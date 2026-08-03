import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
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

type LessonType = "online" | "personal";

interface BookingRequest extends BookingPayload {
    postalCode: string;
    street: string;
    houseNumber: string;
    uploadedFiles: BookingAttachment[];
    status: "pending";
}

const PRICE_PER_HOUR = 11000;

const SUBJECTS = [
    "Általános iskola matek",
    "Középiskola / gimnázium",
    "Érettségi felkészítés",
    "Egyetem",
    "Egyéb",
];

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
    const router = useRouter();
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
    const [authReady, setAuthReady] = useState(false);
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });

        let unsub: (() => void) | undefined;
        let cancelled = false;
        (async () => {
            let attempts = 0;
            while (!(window as any).firebase && attempts < 50) {
                await new Promise((r) => setTimeout(r, 100));
                attempts++;
            }
            if (cancelled || !(window as any).firebase) {
                setAuthReady(true);
                return;
            }
            const auth = (window as any).firebase.auth();
            unsub = auth.onAuthStateChanged((user: any) => {
                if (!user) {
                    setAuthUser(null);
                    setAuthReady(true);
                    openAuthModal();
                    return;
                }
                const email = String(user.email || "").toLowerCase();
                const name = String(user.displayName || "");
                setAuthUser({ email, name });
                setCustomerEmail(email);
                if (name) setCustomerName((prev) => prev || name);
                setAuthReady(true);
            });
        })();

        const refresh = async () => {
            const [remote, blocked, hours] = await Promise.all([
                loadActiveBookingsFromFirestore(),
                loadBlockedDaysFromFirestore(),
                loadWorkingHoursFromFirestore(),
            ]);
            setWorkingHours(hours);
            setBlockedByDate(blockedTimesMap(blocked, makeSlotsForDateKeyFn(hours)));
            if (remote.length > 0) {
                setExistingBookings(remote as BookingRequest[]);
                return;
            }
            setExistingBookings(loadBookingsLocal());
        };

        refresh();
        const t = setInterval(refresh, 15000);
        return () => {
            cancelled = true;
            clearInterval(t);
            if (unsub) unsub();
        };
    }, [router]);

    const monthLabel = currentMonth.toLocaleDateString("hu-HU", {
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

        if (!authUser?.email) {
            setError("A foglaláshoz be kell jelentkezned.");
            openAuthModal();
            return;
        }
        if (!selectedDate || selectedTimes.length === 0) {
            setError("Válassz dátumot és legalább egy időpontot!");
            return;
        }
        if (!customerName.trim() || !customerEmail.trim()) {
            setError("A név és az e-mail megadása kötelező.");
            return;
        }
        if (customerEmail.trim().toLowerCase() !== authUser.email) {
            setError("A foglalási e-mailnek egyeznie kell a bejelentkezett fiókkal.");
            return;
        }
        if (!gdprAccepted) {
            setError("A foglaláshoz el kell fogadnod az adatkezelési tájékoztatót.");
            return;
        }
        if (!postalCode.trim() || !street.trim() || !houseNumber.trim()) {
            setError("A számlázási cím megadása kötelező (irányítószám, utca, házszám).");
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
                setError(`Ezek az időpontok már nem elérhetők: ${conflict.join(", ")}. Válassz másikat.`);
                setSelectedTimes((prev) => prev.filter((t) => !taken.has(t)));
                setSubmitting(false);
                return;
            }

            const bookingId = `booking_${Date.now()}`;
            let uploadedFiles: BookingAttachment[] = [];
            if (selectedFiles.length > 0) {
                const up = await uploadBookingAttachments(bookingId, selectedFiles);
                if (!up.ok) {
                    setError(up.error || "Fájlfeltöltés sikertelen.");
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
                        ? emailed.error ||
                          "A foglalás elmentve. Az admin e-mailhez FormSubmit aktiválás vagy Gmail App Password kell."
                        : emailed.error ||
                          "A foglalás elmentve, de az értesítő e-mail nem ment el. Hamarosan így is jelentkezünk."
                );
            } else if (emailed.warning) {
                setError(emailed.warning);
            }
        } catch (err) {
            console.error(err);
            setError("Nem sikerült elküldeni a foglalást. Próbáld újra.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Időpontfoglalás - Mihaszna Matek</title>
                <meta
                    name="description"
                    content="Foglalj matekórát online vagy személyesen. Válassz időpontot a naptárból."
                />
            </Head>

            <div className="booking-page">
                <div className="booking-page-inner">
                    <div className="booking-page-header">
                        <Link href="/" className="booking-back-link">
                            ← Vissza a főoldalra
                        </Link>
                        <h1>📅 Időpontfoglalás</h1>
                        <p>
                            Válassz napot és időpontot, majd küldd el a foglalási kérelmed.
                            Az ár: <strong>{PRICE_PER_HOUR.toLocaleString("hu-HU")} Ft / 60 perc</strong>
                        </p>
                    </div>

                    <div className="booking-layout">
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
                                    Ma
                                </button>
                            </div>

                            <div className="booking-weekdays">
                                {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((d) => (
                                    <div key={d} className="booking-weekday">
                                        {d}
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
                                        Időpontok —{" "}
                                        {selectedDate.toLocaleDateString("hu-HU", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            weekday: "long",
                                        })}
                                    </h3>
                                    {availableSlots.length === 0 ? (
                                        <p className="booking-muted">Ezen a napon nincs elérhető óra.</p>
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
                                                            ? " (nem elérhető)"
                                                            : taken
                                                              ? " (foglalt)"
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
                            <h2>Foglalási adatok</h2>
                            {authReady && !authUser && (
                                <p className="booking-muted" style={{ marginBottom: "1rem" }}>
                                    A foglaláshoz{" "}
                                    <button
                                        type="button"
                                        onClick={() => openAuthModal()}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#39ff14",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                            padding: 0,
                                            font: "inherit",
                                        }}
                                    >
                                        jelentkezz be
                                    </button>
                                    .
                                </p>
                            )}
                            <form onSubmit={handleSubmit} className="booking-form-fields">
                                <div className="booking-field">
                                    <label htmlFor="booking-name">Név *</label>
                                    <input
                                        id="booking-name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Teljes neved"
                                        required
                                    />
                                </div>
                                <div className="booking-field">
                                    <label htmlFor="booking-email">E-mail * (fiókod)</label>
                                    <input
                                        id="booking-email"
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="pelda@email.hu"
                                        required
                                        readOnly={Boolean(authUser)}
                                        title={
                                            authUser
                                                ? "A fiókod e-mail címe — nem módosítható"
                                                : undefined
                                        }
                                    />
                                </div>

                                <div className="booking-field">
                                    <label>Óra típusa *</label>
                                    <div className="booking-toggle">
                                        <button
                                            type="button"
                                            className={lessonType === "online" ? "active" : ""}
                                            onClick={() => setLessonType("online")}
                                        >
                                            💻 Online
                                        </button>
                                        <button
                                            type="button"
                                            className={lessonType === "personal" ? "active" : ""}
                                            onClick={() => setLessonType("personal")}
                                        >
                                            🏠 Személyes (Fót)
                                        </button>
                                    </div>
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="booking-subject">Témakör / szint *</label>
                                    <select
                                        id="booking-subject"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                    >
                                        {SUBJECTS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="booking-hobby">Hobby / megjegyzés</label>
                                    <input
                                        id="booking-hobby"
                                        value={hobby}
                                        onChange={(e) => setHobby(e.target.value)}
                                        placeholder="Pl. sport, érdeklődés, cél"
                                    />
                                </div>

                                <div className="booking-address-block">
                                    <div className="booking-field" style={{ marginBottom: "0.35rem" }}>
                                        <label>Számlázási cím *</label>
                                        <p className="booking-muted" style={{ margin: "0.25rem 0 0.5rem" }}>
                                            A címet a számlázáshoz kérjük — online és személyes óránál is kötelező.
                                            {lessonType === "personal"
                                                ? " Személyes óránál ez egyben a foglalkozás címe is lehet."
                                                : ""}
                                        </p>
                                    </div>
                                    <div className="booking-address-row">
                                        <div className="booking-field">
                                            <label htmlFor="booking-zip">Irányítószám *</label>
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
                                            <label htmlFor="booking-street">Utca *</label>
                                            <input
                                                id="booking-street"
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                                placeholder="Szent Imre utca"
                                                required
                                                autoComplete="street-address"
                                            />
                                        </div>
                                        <div className="booking-field">
                                            <label htmlFor="booking-house">Házszám *</label>
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
                                    <label htmlFor="booking-files">Feladat / anyag csatolása (opcionális)</label>
                                    <input
                                        id="booking-files"
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/*"
                                        onChange={handleFileChange}
                                    />
                                    <p className="booking-muted" style={{ marginTop: "0.35rem" }}>
                                        Max. 5 fájl, egyenként 8 MB — PDF, JPG, PNG, DOC, DOCX.
                                    </p>
                                    {selectedFiles.length > 0 && (
                                        <p className="booking-muted">
                                            Kiválasztva: {selectedFiles.map((f) => f.name).join(", ")}
                                        </p>
                                    )}
                                </div>

                                <div className="booking-summary">
                                    <div>
                                        <span>Kiválasztott órák:</span>
                                        <strong>
                                            {selectedTimes.length > 0
                                                ? selectedTimes.join(", ")
                                                : "—"}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>Összesen:</span>
                                        <strong className="booking-price">
                                            {totalPrice.toLocaleString("hu-HU")} Ft
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
                                        Elolvastam és elfogadom az{" "}
                                        <a
                                            href="/adatkezelesi-tajekoztato"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            adatkezelési tájékoztatót
                                        </a>{" "}
                                        (GDPR), és hozzájárulok a foglaláshoz szükséges
                                        személyes adatok kezeléséhez. *
                                    </span>
                                </label>

                                {error && <p className="booking-error">{error}</p>}
                                {success && (
                                    <p className="booking-success">
                                        Köszönjük! A foglalásod elmentve. E-mail értesítést küldtünk, és hamarosan
                                        visszajelzünk a megadott címre.
                                        <br /><br />
                                        <strong>Fizetés (készpénz vagy utalás):</strong><br />
                                        Kedvezményezett: Lieszkofszki Zsolt<br />
                                        Számlaszám: 10401000-86765086-50861000<br />
                                        Közlemény: neved + foglalás dátuma
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="booking-submit"
                                    disabled={submitting}
                                >
                                    {submitting ? "Küldés..." : "Foglalás elküldése"}
                                </button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
