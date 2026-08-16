import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
    blockedTimesMap,
    loadActiveBookingsFromFirestore,
    loadBlockedDaysFromFirestore,
    saveBookingToFirestore,
    sendBookingEmailFromClient,
    uploadBookingAttachments,
    type BookingAttachment,
    type BookingPayload,
} from "../utils/bookingNotify";
import {
    DEFAULT_WORKING_HOURS,
    WorkingHoursMap,
    cloneWorkingHours,
    getSlotsForDay,
    loadWorkingHoursFromFirestore,
    makeSlotsForDateKeyFn,
    toDateKey,
} from "../utils/bookingSlots";
import { openAuthModal } from "../utils/authModal";
import { useLang } from "../utils/i18n";
import { LESSON_SUBJECTS } from "../utils/registrationProfile";

type LessonType = "online" | "personal";

interface BookingRequest extends BookingPayload {
    postalCode: string;
    street: string;
    houseNumber: string;
    uploadedFiles: BookingAttachment[];
    status: "pending";
}

const PRICE_PER_HOUR = 11000;

const SUBJECTS = [...LESSON_SUBJECTS];

const SUBJECT_I18N: Record<string, string> = {
    "Általános iskola matek": "booking.subject.elementary",
    "Középiskola / gimnázium": "booking.subject.highschool",
    "Érettségi felkészítés": "booking.subject.exam",
    Egyetem: "booking.subject.university",
    Egyéb: "booking.subject.other",
};

const WEEKDAY_KEYS = [
    "booking.weekday.mon",
    "booking.weekday.tue",
    "booking.weekday.wed",
    "booking.weekday.thu",
    "booking.weekday.fri",
    "booking.weekday.sat",
    "booking.weekday.sun",
] as const;

function loadBookingsLocal(): BookingRequest[] {
    if (typeof window === "undefined") return [];
    try {
        const pending = JSON.parse(localStorage.getItem("pendingBookings") || "[]");
        const approved = JSON.parse(localStorage.getItem("approvedBookings") || "[]");
        return [...pending, ...approved];
    } catch {
        return [];
    }
}

export default function BookingPage() {
    const { t, lang } = useLang();
    const dateLocale = lang === "en" ? "en-US" : "hu-HU";

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [existingBookings, setExistingBookings] = useState<BookingRequest[]>([]);
    const [blockedByDate, setBlockedByDate] = useState<Map<string, Set<string>>>(() => new Map());
    const [workingHours, setWorkingHours] = useState<WorkingHoursMap>(() =>
        cloneWorkingHours(DEFAULT_WORKING_HOURS)
    );
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [authUser, setAuthUser] = useState<{ email: string; name: string } | null>(null);

    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [lessonType, setLessonType] = useState<LessonType>("online");
    const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
    const [hobby, setHobby] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [gdprAccepted, setGdprAccepted] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [gateGdpr, setGateGdpr] = useState(false);
    /** null = választó; account = belépés/regisztráció; guest = regisztráció nélkül */
    const [bookingPath, setBookingPath] = useState<null | "account" | "guest">(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });

        let unsub: (() => void) | undefined;
        let cancelled = false;

        (async () => {
            try {
                let attempts = 0;
                while (!(window as any).firebase?.auth && attempts < 50) {
                    await new Promise((r) => setTimeout(r, 100));
                    attempts++;
                }
                if (cancelled || !(window as any).firebase?.auth) return;
                const auth = (window as any).firebase.auth();
                unsub = auth.onAuthStateChanged((user: any) => {
                    if (cancelled) return;
                    if (!user) {
                        setAuthUser(null);
                        return;
                    }
                    const email = String(user.email || "").toLowerCase();
                    const name = String(user.displayName || "");
                    setAuthUser({ email, name });
                    // Foglalási mezőket NEM töltjük ki automatikusan — mindig meg kell adni
                    setBookingPath("account");
                    setError("");
                });
            } catch (e) {
                console.warn("booking auth init failed", e);
            }
        })();

        const refresh = async () => {
            try {
                const [remote, blocked, hours] = await Promise.all([
                    loadActiveBookingsFromFirestore(),
                    loadBlockedDaysFromFirestore(),
                    loadWorkingHoursFromFirestore(),
                ]);
                if (cancelled) return;
                setWorkingHours(hours);
                setBlockedByDate(blockedTimesMap(blocked, makeSlotsForDateKeyFn(hours)));
                if (remote.length > 0) {
                    setExistingBookings(remote as BookingRequest[]);
                    return;
                }
                setExistingBookings(loadBookingsLocal());
            } catch (e) {
                console.warn("booking refresh failed", e);
                if (!cancelled) setExistingBookings(loadBookingsLocal());
            }
        };

        refresh();
        const t = setInterval(refresh, 15000);
        return () => {
            cancelled = true;
            clearInterval(t);
            if (unsub) unsub();
        };
    }, []);

    const handleGoogleForBooking = async () => {
        setError("");
        if (!gateGdpr) {
            setError(t("booking.error.gdprGate"));
            return;
        }
        setAuthLoading(true);
        try {
            let attempts = 0;
            while (!(window as any).firebase?.apps?.length && attempts < 40) {
                await new Promise((r) => setTimeout(r, 100));
                attempts++;
            }
            const firebase = (window as any).firebase;
            if (!firebase?.apps?.length) {
                setError(t("auth.errorFirebase"));
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope("email");
            provider.addScope("profile");
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;
            const isNewUser = result.additionalUserInfo?.isNewUser;
            if (user) {
                const db = firebase.firestore();
                const ref = db.collection("users").doc(user.uid);
                const snap = await ref.get();
                const gdprFields = {
                    gdprAccepted: true,
                    gdprAcceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    gdprVersion: "2026-08-03",
                };
                if (!snap.exists) {
                    await ref.set({
                        name: user.displayName || "",
                        email: user.email || "",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        ...gdprFields,
                    });
                } else if (isNewUser) {
                    await ref.set(gdprFields, { merge: true });
                }
            }
            setGateGdpr(false);
        } catch (err: any) {
            console.error(err);
            const code = err?.code || "";
            if (code === "auth/popup-closed-by-user") {
                setError(t("booking.error.googleClosed"));
            } else if (code === "auth/unauthorized-domain") {
                setError(t("booking.error.googleDomain"));
            } else {
                setError(t("booking.error.googleFailed"));
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const monthLabel = currentMonth.toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "long",
    });

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startOffset = (firstDay.getDay() + 6) % 7; // hétfő első
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells: Array<{ date: Date; inMonth: boolean }> = [];

        for (let i = 0; i < startOffset; i++) {
            const d = new Date(year, month, 1 - (startOffset - i));
            cells.push({ date: d, inMonth: false });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            cells.push({ date: new Date(year, month, day), inMonth: true });
        }
        while (cells.length % 7 !== 0) {
            const last = cells[cells.length - 1].date;
            const d = new Date(last);
            d.setDate(d.getDate() + 1);
            cells.push({ date: d, inMonth: false });
        }
        return cells;
    }, [currentMonth]);

    const availableSlots = selectedDate ? getSlotsForDay(selectedDate, workingHours) : [];

    const bookedTimesForSelected = useMemo(() => {
        if (!selectedDate) return new Set<string>();
        const key = toDateKey(selectedDate);
        const set = new Set<string>();
        existingBookings.forEach((b) => {
            if (b.date === key) {
                (b.times || []).forEach((t) => set.add(t));
            }
        });
        const blocked = blockedByDate.get(key);
        blocked?.forEach((t) => set.add(t));
        return set;
    }, [existingBookings, selectedDate, blockedByDate]);

    const totalPrice = selectedTimes.length * PRICE_PER_HOUR;

    const changeMonth = (delta: number) => {
        const next = new Date(currentMonth);
        next.setMonth(next.getMonth() + delta);
        setCurrentMonth(next);
    };

    const selectDay = (date: Date, inMonth: boolean) => {
        if (!inMonth) return;
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
        if (day < today) return;
        if (!getSlotsForDay(day, workingHours).length) return;
        setSelectedDate(day);
        setSelectedTimes([]);
        setSuccess(false);
        setError("");
    };

    const toggleTime = (slot: string) => {
        if (bookedTimesForSelected.has(slot)) return;
        setSelectedTimes((prev) =>
            prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot].sort()
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files.slice(0, 5));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!selectedDate || selectedTimes.length === 0) {
            setError(t("booking.error.needDateTime"));
            return;
        }
        if (!customerName.trim() || !customerEmail.trim()) {
            setError(t("booking.error.needNameEmail"));
            return;
        }
        if (authUser?.email && customerEmail.trim().toLowerCase() !== authUser.email) {
            setError(t("booking.error.emailMismatch"));
            return;
        }
        if (!authUser && bookingPath !== "guest") {
            setError(t("booking.error.needPath"));
            return;
        }
        if (!gdprAccepted) {
            setError(t("booking.error.needGdpr"));
            return;
        }
        if (!postalCode.trim() || !street.trim() || !houseNumber.trim()) {
            setError(t("booking.error.needAddress"));
            return;
        }

        setSubmitting(true);
        try {
            const dateKey = toDateKey(selectedDate);
            const [remote, blocked, hours] = await Promise.all([
                loadActiveBookingsFromFirestore(),
                loadBlockedDaysFromFirestore(),
                loadWorkingHoursFromFirestore(),
            ]);
            setWorkingHours(hours);
            const freshBlocked = blockedTimesMap(blocked, makeSlotsForDateKeyFn(hours));
            const taken = new Set<string>();
            (remote.length > 0 ? remote : existingBookings).forEach((b) => {
                if (b.date === dateKey) (b.times || []).forEach((t) => taken.add(t));
            });
            freshBlocked.get(dateKey)?.forEach((t) => taken.add(t));
            setBlockedByDate(freshBlocked);
            if (remote.length > 0) setExistingBookings(remote as BookingRequest[]);

            const conflict = selectedTimes.filter((t) => taken.has(t));
            if (conflict.length > 0) {
                setError(t("booking.error.conflict", { times: conflict.join(", ") }));
                setSelectedTimes((prev) => prev.filter((t) => !taken.has(t)));
                setSubmitting(false);
                return;
            }

            const bookingId = `booking_${Date.now()}`;
            let uploadedFiles: BookingAttachment[] = [];
            if (selectedFiles.length > 0) {
                const up = await uploadBookingAttachments(bookingId, selectedFiles);
                if (!up.ok) {
                    setError(up.error || t("booking.error.uploadFailed"));
                    setSubmitting(false);
                    return;
                }
                uploadedFiles = up.files;
            }

            const booking: BookingRequest = {
                id: bookingId,
                date: dateKey,
                times: selectedTimes,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                lessonType,
                selectedSubject,
                hobby: hobby.trim() || "—",
                totalPrice,
                postalCode: postalCode.trim(),
                street: street.trim(),
                houseNumber: houseNumber.trim(),
                uploadedFiles,
                submittedAt: new Date().toISOString(),
                status: "pending",
                paymentStatus: "unpaid",
                gdprAccepted: true,
                gdprAcceptedAt: new Date().toISOString(),
                gdprVersion: "2026-08-03",
            };

            const saved = await saveBookingToFirestore(booking);
            if (!saved.ok) {
                // Offline / rules fallback: local cache, still try email
                const pending = JSON.parse(localStorage.getItem("pendingBookings") || "[]");
                pending.push(booking);
                localStorage.setItem("pendingBookings", JSON.stringify(pending));
                console.warn("Firestore mentés sikertelen, localStorage fallback:", saved.error);
            }

            setExistingBookings((prev) => [...prev, booking]);

            const emailed = await sendBookingEmailFromClient("admin_new", booking);

            setSuccess(true);
            setSelectedTimes([]);
            setHobby("");
            setSelectedFiles([]);
            const fileInput = document.getElementById("booking-files") as HTMLInputElement | null;
            if (fileInput) fileInput.value = "";
            if (!emailed.ok) {
                setError(
                    emailed.needsActivation
                        ? emailed.error || t("booking.error.emailNeedsActivation")
                        : emailed.error || t("booking.error.emailFailed")
                );
            } else if (emailed.warning) {
                setError(emailed.warning);
            }
        } catch (err) {
            console.error(err);
            setError(t("booking.error.submitFailed"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>{t("booking.pageTitle")}</title>
                <meta name="description" content={t("booking.metaDescription")} />
            </Head>

            <div className="booking-page">
                <div className="booking-page-inner">
                    <div className="booking-page-header">
                        <Link href="/" className="booking-back-link">
                            ← {t("booking.backHome")}
                        </Link>
                        <h1>📅 {t("booking.title")}</h1>
                        <p>
                            {t("booking.intro")}{" "}
                            {t("booking.priceLabel")}{" "}
                            <strong>
                                {PRICE_PER_HOUR.toLocaleString(dateLocale)} Ft {t("booking.priceUnit")}
                            </strong>
                        </p>
                    </div>

                    {!authUser && bookingPath === null ? (
                        <section className="booking-auth-gate">
                            <h2>{t("booking.pathTitle")}</h2>
                            <p>{t("booking.pathBody")}</p>

                            <div className="booking-path-options">
                                <button
                                    type="button"
                                    className="booking-path-btn is-primary"
                                    onClick={() => {
                                        setError("");
                                        setBookingPath("account");
                                    }}
                                >
                                    {t("booking.pathAccount")}
                                    <small>{t("booking.pathAccountHint")}</small>
                                </button>
                                <button
                                    type="button"
                                    className="booking-path-btn"
                                    onClick={() => {
                                        setError("");
                                        setBookingPath("guest");
                                    }}
                                >
                                    {t("booking.pathGuest")}
                                    <small>{t("booking.pathGuestHint")}</small>
                                </button>
                            </div>
                        </section>
                    ) : !authUser && bookingPath === "account" ? (
                        <section className="booking-auth-gate">
                            <button
                                type="button"
                                className="booking-text-btn"
                                style={{ marginBottom: "1rem" }}
                                onClick={() => {
                                    setBookingPath(null);
                                    setError("");
                                }}
                            >
                                ← {t("booking.backChoice")}
                            </button>
                            <h2>{t("booking.accountTitle")}</h2>
                            <p>{t("booking.accountBody")}</p>

                            <label className="gdpr-consent booking-gdpr">
                                <input
                                    type="checkbox"
                                    checked={gateGdpr}
                                    onChange={(e) => setGateGdpr(e.target.checked)}
                                />
                                <span>
                                    {t("auth.gdprPrefix")}{" "}
                                    <a
                                        href="/adatkezelesi-tajekoztato"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t("auth.gdprLink")}
                                    </a>{" "}
                                    {t("booking.gdprGateSuffix")}
                                </span>
                            </label>

                            {error && <p className="booking-error">{error}</p>}

                            <button
                                type="button"
                                className="google-login-btn booking-google-btn"
                                onClick={handleGoogleForBooking}
                                disabled={authLoading}
                            >
                                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                                    <path
                                        fill="#EA4335"
                                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                    />
                                </svg>
                                {authLoading ? t("auth.loggingIn") : t("booking.googleLogin")}
                            </button>

                            <p className="booking-muted" style={{ marginTop: "1.25rem" }}>
                                <button
                                    type="button"
                                    className="booking-text-btn"
                                    onClick={() =>
                                        openAuthModal({ mode: "login", redirectTo: false })
                                    }
                                >
                                    {t("booking.emailLogin")}
                                </button>
                                {" · "}
                                <button
                                    type="button"
                                    className="booking-text-btn"
                                    onClick={() =>
                                        openAuthModal({ mode: "register", redirectTo: false })
                                    }
                                >
                                    {t("booking.emailRegister")}
                                </button>
                            </p>
                        </section>
                    ) : (
                    <div className="booking-layout">
                        {!authUser && bookingPath === "guest" && (
                            <p className="booking-muted" style={{ gridColumn: "1 / -1", marginBottom: "0.5rem" }}>
                                {t("booking.guest")}{" "}
                                <button
                                    type="button"
                                    className="booking-text-btn"
                                    onClick={() => {
                                        setBookingPath(null);
                                        setError("");
                                    }}
                                >
                                    {t("booking.backChoice")}
                                </button>
                            </p>
                        )}
                        <section className="booking-calendar-card">
                            <div className="booking-cal-header">
                                <button type="button" className="booking-nav-btn" onClick={() => changeMonth(-1)}>
                                    ‹
                                </button>
                                <h2>{monthLabel}</h2>
                                <button type="button" className="booking-nav-btn" onClick={() => changeMonth(1)}>
                                    ›
                                </button>
                                <button
                                    type="button"
                                    className="booking-today-btn"
                                    onClick={() => {
                                        const d = new Date();
                                        d.setDate(1);
                                        d.setHours(0, 0, 0, 0);
                                        setCurrentMonth(d);
                                    }}
                                >
                                    {t("booking.today")}
                                </button>
                            </div>

                            <div className="booking-weekdays">
                                {WEEKDAY_KEYS.map((key) => (
                                    <div key={key} className="booking-weekday">
                                        {t(key)}
                                    </div>
                                ))}
                            </div>

                            <div className="booking-days">
                                {calendarDays.map(({ date, inMonth }) => {
                                    const key = toDateKey(date);
                                    const isPast = date < today;
                                    const hasSlots = getSlotsForDay(date, workingHours).length > 0;
                                    const isSelected =
                                        selectedDate && toDateKey(selectedDate) === key;
                                    const isToday = toDateKey(date) === toDateKey(today);
                                    const clickable = inMonth && !isPast && hasSlots;

                                    return (
                                        <button
                                            key={key + String(inMonth)}
                                            type="button"
                                            disabled={!clickable}
                                            className={[
                                                "booking-day",
                                                !inMonth ? "other-month" : "",
                                                isPast ? "past" : "",
                                                isToday ? "today" : "",
                                                isSelected ? "selected" : "",
                                                clickable ? "clickable" : "",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                            onClick={() => selectDay(date, inMonth)}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedDate && (
                                <div className="booking-slots">
                                    <h3>
                                        {t("booking.slotsTitle")}{" "}
                                        {selectedDate.toLocaleDateString(dateLocale, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            weekday: "long",
                                        })}
                                    </h3>
                                    {availableSlots.length === 0 ? (
                                        <p className="booking-muted">{t("booking.noSlots")}</p>
                                    ) : (
                                        <div className="booking-slots-grid">
                                            {availableSlots.map((slot) => {
                                                const taken = bookedTimesForSelected.has(slot);
                                                const selected = selectedTimes.includes(slot);
                                                const key = selectedDate ? toDateKey(selectedDate) : "";
                                                const adminBlocked = key
                                                    ? blockedByDate.get(key)?.has(slot)
                                                    : false;
                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        disabled={taken}
                                                        className={[
                                                            "booking-slot",
                                                            taken ? "taken" : "free",
                                                            selected ? "selected" : "",
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" ")}
                                                        onClick={() => toggleTime(slot)}
                                                    >
                                                        {slot}
                                                        {adminBlocked
                                                            ? t("booking.unavailable")
                                                            : taken
                                                              ? t("booking.taken")
                                                              : ""}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        <section className="booking-form-card">
                            <h2>{t("booking.formTitle")}</h2>
                            {authUser && (
                                <p className="booking-muted" style={{ marginBottom: "1rem" }}>
                                    {t("booking.signedIn")}{" "}
                                    <strong style={{ color: "#39ff14" }}>{authUser.email}</strong>.{" "}
                                    {t("booking.signedInHint")}
                                </p>
                            )}
                            <form onSubmit={handleSubmit} className="booking-form-fields">
                                <div className="booking-field">
                                    <label htmlFor="booking-name">{t("auth.name")}</label>
                                    <input
                                        id="booking-name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder={t("auth.namePlaceholder")}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="booking-field">
                                    <label htmlFor="booking-email">{t("auth.email")}</label>
                                    <input
                                        id="booking-email"
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder={t("booking.emailPlaceholder")}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="booking-field">
                                    <label>{t("auth.lessonType")}</label>
                                    <div className="booking-toggle">
                                        <button
                                            type="button"
                                            className={lessonType === "online" ? "active" : ""}
                                            onClick={() => setLessonType("online")}
                                        >
                                            {t("booking.online")}
                                        </button>
                                        <button
                                            type="button"
                                            className={lessonType === "personal" ? "active" : ""}
                                            onClick={() => setLessonType("personal")}
                                        >
                                            {t("booking.personal")}
                                        </button>
                                    </div>
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="booking-subject">{t("auth.subject")}</label>
                                    <select
                                        id="booking-subject"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                    >
                                        {SUBJECTS.map((s) => (
                                            <option key={s} value={s}>
                                                {t(SUBJECT_I18N[s] || s)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="booking-hobby">{t("auth.hobby")}</label>
                                    <input
                                        id="booking-hobby"
                                        value={hobby}
                                        onChange={(e) => setHobby(e.target.value)}
                                        placeholder={t("auth.hobbyPlaceholder")}
                                    />
                                </div>

                                <div className="booking-address-block">
                                    <div className="booking-field" style={{ marginBottom: "0.35rem" }}>
                                        <label>{t("auth.billing")}</label>
                                        <p className="booking-muted" style={{ margin: "0.25rem 0 0.5rem" }}>
                                            {t("booking.billingHint")}
                                            {lessonType === "personal" ? t("booking.billingPersonalExtra") : ""}
                                        </p>
                                    </div>
                                    <div className="booking-address-row">
                                        <div className="booking-field">
                                            <label htmlFor="booking-zip">{t("auth.postalCode")}</label>
                                            <input
                                                id="booking-zip"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder="2151"
                                                required
                                                autoComplete="postal-code"
                                            />
                                        </div>
                                        <div className="booking-field">
                                            <label htmlFor="booking-street">{t("auth.street")}</label>
                                            <input
                                                id="booking-street"
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                                placeholder={t("booking.streetPlaceholder")}
                                                required
                                                autoComplete="street-address"
                                            />
                                        </div>
                                        <div className="booking-field">
                                            <label htmlFor="booking-house">{t("auth.houseNumber")}</label>
                                            <input
                                                id="booking-house"
                                                value={houseNumber}
                                                onChange={(e) => setHouseNumber(e.target.value)}
                                                placeholder="18"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="booking-files">{t("booking.files")}</label>
                                    <input
                                        id="booking-files"
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/*"
                                        onChange={handleFileChange}
                                    />
                                    <p className="booking-muted" style={{ marginTop: "0.35rem" }}>
                                        {t("booking.filesHint")}
                                    </p>
                                    {selectedFiles.length > 0 && (
                                        <p className="booking-muted">
                                            {t("booking.filesSelected", {
                                                names: selectedFiles.map((f) => f.name).join(", "),
                                            })}
                                        </p>
                                    )}
                                </div>

                                <div className="booking-summary">
                                    <div>
                                        <span>{t("booking.selectedLessons")}</span>
                                        <strong>
                                            {selectedTimes.length > 0
                                                ? selectedTimes.join(", ")
                                                : "—"}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>{t("booking.total")}</span>
                                        <strong className="booking-price">
                                            {totalPrice.toLocaleString(dateLocale)} Ft
                                        </strong>
                                    </div>
                                </div>

                                <label className="gdpr-consent booking-gdpr">
                                    <input
                                        type="checkbox"
                                        checked={gdprAccepted}
                                        onChange={(e) => setGdprAccepted(e.target.checked)}
                                        required
                                    />
                                    <span>
                                        {t("auth.gdprPrefix")}{" "}
                                        <a
                                            href="/adatkezelesi-tajekoztato"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t("auth.gdprLink")}
                                        </a>{" "}
                                        {t("booking.gdprFormSuffix")}
                                    </span>
                                </label>

                                {error && <p className="booking-error">{error}</p>}
                                {success && (
                                    <p className="booking-success">
                                        {t("booking.success")}
                                        <br /><br />
                                        <strong>{t("booking.paymentTitle")}</strong>
                                        <br />
                                        {t("booking.paymentPayee")}
                                        <br />
                                        {t("booking.paymentAccount")}
                                        <br />
                                        {t("booking.paymentNote")}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="booking-submit"
                                    disabled={submitting}
                                >
                                    {submitting ? t("booking.submitting") : t("booking.submit")}
                                </button>
                            </form>
                        </section>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
}
