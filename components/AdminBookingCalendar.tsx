import { useEffect, useMemo, useState } from "react";
import BookingAttachments from "./BookingAttachments";
import BookingCalendarLinks from "./BookingCalendarLinks";
import {
    BlockedDay,
    BookingPayload,
    blockedTimesMap,
    isAdminCalendarDenied,
    loadAdminCalendarBundle,
    paymentStatusLabel,
    sendBookingEmailFromClient,
    setDayBlocked,
    toggleBlockedSlot,
    updateBookingPaymentStatus,
    updateBookingStatus,
    type PaymentStatus,
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

type Props = {
    onChanged?: () => void;
    /** Naptárból: diák/foglalás kiválasztása után lobby (élő óra) indítása */
    onCreateLobby?: (booking: BookingPayload) => void | Promise<void>;
    lobbyBusy?: boolean;
};

export default function AdminBookingCalendar({
    onChanged,
    onCreateLobby,
    lobbyBusy = false,
}: Props) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [bookings, setBookings] = useState<BookingPayload[]>([]);
    const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
    const [workingHours, setWorkingHours] = useState<WorkingHoursMap>(() =>
        cloneWorkingHours(DEFAULT_WORKING_HOURS)
    );
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [blockBusy, setBlockBusy] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const todayKey = toDateKey(new Date());

    const refresh = async () => {
        if (isAdminCalendarDenied()) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [bundle, hours] = await Promise.all([
                loadAdminCalendarBundle(),
                loadWorkingHoursFromFirestore(),
            ]);
            setBookings(bundle.bookings);
            setBlockedDays(bundle.blocked);
            setWorkingHours(hours);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        let interval: ReturnType<typeof setInterval> | undefined;

        const start = async () => {
            await refresh();
            if (cancelled || isAdminCalendarDenied()) return;
            interval = setInterval(() => {
                if (isAdminCalendarDenied()) {
                    if (interval) clearInterval(interval);
                    return;
                }
                void refresh();
            }, 20000);
        };

        void start();
        return () => {
            cancelled = true;
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only poll
    }, []);

    const monthLabel = currentMonth.toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
    });

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startOffset = (firstDay.getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells: Array<{ date: Date; inMonth: boolean }> = [];

        for (let i = 0; i < startOffset; i++) {
            cells.push({ date: new Date(year, month, 1 - (startOffset - i)), inMonth: false });
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

    const bookingsByDate = useMemo(() => {
        const map = new Map<string, BookingPayload[]>();
        bookings.forEach((b) => {
            if (!b.date) return;
            const arr = map.get(b.date) || [];
            arr.push(b);
            map.set(b.date, arr);
        });
        return map;
    }, [bookings]);

    const blockedByDate = useMemo(
        () => blockedTimesMap(blockedDays, makeSlotsForDateKeyFn(workingHours)),
        [blockedDays, workingHours]
    );

    const selectedKey = selectedDate ? toDateKey(selectedDate) : "";
    const dayBookings = selectedKey ? bookingsByDate.get(selectedKey) || [] : [];
    const daySlots = selectedDate ? getSlotsForDay(selectedDate, workingHours) : [];
    const blockedForSelected = selectedKey ? blockedByDate.get(selectedKey) || new Set<string>() : new Set<string>();
    const bookedForSelected = useMemo(() => {
        const set = new Set<string>();
        dayBookings.forEach((b) => {
            if (b.status === "rejected" || b.status === "cancelled") return;
            (b.times || []).forEach((t) => set.add(t));
        });
        return set;
    }, [dayBookings]);
    const dayFullyBlocked =
        daySlots.length > 0 && daySlots.every((s) => blockedForSelected.has(s));

    const changeMonth = (delta: number) => {
        const next = new Date(currentMonth);
        next.setMonth(next.getMonth() + delta);
        setCurrentMonth(next);
    };

    const handleApprove = async (booking: BookingPayload) => {
        setBusyId(booking.id);
        try {
            await updateBookingStatus(booking.id, "approved", booking);
            await sendBookingEmailFromClient("student_approved", booking);
            await refresh();
            onChanged?.();
        } finally {
            setBusyId(null);
        }
    };

    const handleReject = async (booking: BookingPayload) => {
        setBusyId(booking.id);
        try {
            await updateBookingStatus(booking.id, "rejected", booking);
            await sendBookingEmailFromClient("student_rejected", booking);
            await refresh();
            onChanged?.();
        } finally {
            setBusyId(null);
        }
    };

    const handleToggleSlot = async (slot: string) => {
        if (!selectedKey || blockBusy) return;
        setBlockBusy(true);
        try {
            const isBlocked = blockedForSelected.has(slot);
            await toggleBlockedSlot(selectedKey, slot, isBlocked, daySlots);
            await refresh();
        } finally {
            setBlockBusy(false);
        }
    };

    const handleToggleDay = async () => {
        if (!selectedKey || blockBusy || daySlots.length === 0) return;
        setBlockBusy(true);
        try {
            await setDayBlocked(selectedKey, !dayFullyBlocked, daySlots);
            await refresh();
        } finally {
            setBlockBusy(false);
        }
    };

    const statusMeta = (status?: string) => {
        if (status === "approved") return { label: "Jóváhagyva", color: "#39ff14" };
        if (status === "rejected") return { label: "Elutasítva", color: "#ff69b4" };
        if (status === "cancelled") return { label: "Lemondva", color: "#888" };
        return { label: "Függőben", color: "#ffd166" };
    };

    return (
        <section style={{ margin: "0 auto 2.5rem", maxWidth: "960px", padding: "0 1rem" }}>
            <h2 className="section-title" style={{ marginBottom: "0.35rem" }}>
                📆 Foglalási naptár
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "1.25rem" }}>
                Válassz napot → kattints a diák foglalására →{" "}
                <strong style={{ color: "#39ff14" }}>Lobby létrehozása</strong> (link + e-mail a
                diáknak). Sárga = függőben, zöld = jóváhagyva, piros = blokkolt.
            </p>

            <div className="booking-calendar-card" style={{ marginBottom: "1.25rem" }}>
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
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            setSelectedDate(today);
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
                        const dayList = bookingsByDate.get(key) || [];
                        const pendingCount = dayList.filter((b) => !b.status || b.status === "pending").length;
                        const approvedCount = dayList.filter((b) => b.status === "approved").length;
                        const hasBlocked = (blockedByDate.get(key)?.size || 0) > 0;
                        const isSelected = selectedKey === key;
                        const isToday = key === todayKey;

                        return (
                            <button
                                key={key + String(inMonth)}
                                type="button"
                                className={[
                                    "booking-day",
                                    "clickable",
                                    !inMonth ? "other-month" : "",
                                    isToday ? "today" : "",
                                    isSelected ? "selected" : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                onClick={() => {
                                    const d = new Date(date);
                                    d.setHours(0, 0, 0, 0);
                                    setSelectedDate(d);
                                    setSelectedBookingId(null);
                                }}
                                style={{ position: "relative", minHeight: "3.2rem" }}
                            >
                                {date.getDate()}
                                {(pendingCount > 0 || approvedCount > 0 || hasBlocked) && (
                                    <span
                                        style={{
                                            display: "flex",
                                            gap: "3px",
                                            justifyContent: "center",
                                            marginTop: "2px",
                                        }}
                                    >
                                        {pendingCount > 0 && (
                                            <span
                                                title={`${pendingCount} függő`}
                                                style={{
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: "50%",
                                                    background: "#ffd166",
                                                }}
                                            />
                                        )}
                                        {approvedCount > 0 && (
                                            <span
                                                title={`${approvedCount} jóváhagyott`}
                                                style={{
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: "50%",
                                                    background: "#39ff14",
                                                }}
                                            />
                                        )}
                                        {hasBlocked && (
                                            <span
                                                title="Blokkolt sávok"
                                                style={{
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: "50%",
                                                    background: "#ff4d6d",
                                                }}
                                            />
                                        )}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div
                style={{
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(57,255,20,0.25)",
                    borderRadius: "16px",
                    padding: "1.25rem",
                }}
            >
                <h3 style={{ margin: "0 0 1rem", color: "#39ff14" }}>
                    {selectedDate
                        ? selectedDate.toLocaleDateString("hu-HU", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "long",
                          })
                        : "Válassz napot"}
                </h3>

                {selectedDate && (
                    <div style={{ marginBottom: "1.5rem" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "0.75rem",
                                flexWrap: "wrap",
                                marginBottom: "0.75rem",
                            }}
                        >
                            <strong style={{ color: "#eee" }}>🔒 Elérhetőség</strong>
                            {daySlots.length > 0 && (
                                <button
                                    type="button"
                                    disabled={blockBusy}
                                    onClick={handleToggleDay}
                                    style={{
                                        background: dayFullyBlocked
                                            ? "rgba(57,255,20,0.15)"
                                            : "rgba(255,77,109,0.18)",
                                        color: dayFullyBlocked ? "#39ff14" : "#ff4d6d",
                                        border: `1px solid ${dayFullyBlocked ? "#39ff14" : "#ff4d6d"}`,
                                        borderRadius: "10px",
                                        padding: "0.45rem 0.85rem",
                                        fontWeight: 700,
                                        cursor: blockBusy ? "wait" : "pointer",
                                    }}
                                >
                                    {dayFullyBlocked ? "Egész nap feloldása" : "Egész nap blokkolása"}
                                </button>
                            )}
                        </div>

                        {daySlots.length === 0 ? (
                            <p style={{ color: "#aaa", margin: 0 }}>Ezen a napon nincs munkaidő (pl. vasárnap).</p>
                        ) : (
                            <div className="booking-slots-grid">
                                {daySlots.map((slot) => {
                                    const blocked = blockedForSelected.has(slot);
                                    const booked = bookedForSelected.has(slot);
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            disabled={blockBusy}
                                            className={[
                                                "booking-slot",
                                                blocked ? "taken" : "free",
                                                booked && !blocked ? "selected" : "",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                            onClick={() => handleToggleSlot(slot)}
                                            title={
                                                booked
                                                    ? blocked
                                                        ? "Blokkolt + van foglalás — kattints a feloldáshoz"
                                                        : "Van foglalás — kattints a blokkoláshoz"
                                                    : blocked
                                                      ? "Blokkolt — kattints a feloldáshoz"
                                                      : "Szabad — kattints a blokkoláshoz"
                                            }
                                        >
                                            {slot}
                                            {blocked ? " (blokkolt)" : booked ? " (foglalt)" : ""}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <p style={{ color: "#888", fontSize: "0.85rem", margin: "0.65rem 0 0" }}>
                            A blokkolt sávok a foglaló oldalon nem választhatók.
                        </p>
                    </div>
                )}

                <h4 style={{ margin: "0 0 0.75rem", color: "#ccc", fontWeight: 600 }}>
                    Diákok / foglalások ezen a napon
                </h4>

                {loading ? (
                    <p style={{ color: "#aaa" }}>Betöltés…</p>
                ) : dayBookings.length === 0 ? (
                    <p style={{ color: "#aaa", margin: 0 }}>Ezen a napon nincs foglalás.</p>
                ) : (
                    <div style={{ display: "grid", gap: "0.85rem" }}>
                        {dayBookings.map((b) => {
                            const meta = statusMeta(b.status);
                            const isPick = selectedBookingId === b.id;
                            return (
                                <div
                                    key={b.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedBookingId(b.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setSelectedBookingId(b.id);
                                        }
                                    }}
                                    style={{
                                        border: isPick
                                            ? "2px solid #39ff14"
                                            : `1px solid ${meta.color}66`,
                                        borderRadius: "14px",
                                        padding: "1rem",
                                        background: isPick
                                            ? "rgba(57,255,20,0.1)"
                                            : "rgba(255,255,255,0.04)",
                                        cursor: "pointer",
                                        boxShadow: isPick
                                            ? "0 0 0 1px rgba(57,255,20,0.35)"
                                            : "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: "0.75rem",
                                            flexWrap: "wrap",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        <strong style={{ color: "#fff" }}>
                                            {(b.times || []).join(", ") || "—"} · {b.customerName}
                                            {isPick ? " · kiválasztva" : ""}
                                        </strong>
                                        <span
                                            style={{
                                                color: meta.color,
                                                border: `1px solid ${meta.color}`,
                                                borderRadius: "999px",
                                                padding: "0.15rem 0.65rem",
                                                fontSize: "0.8rem",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {meta.label}
                                        </span>
                                    </div>
                                    <p style={{ margin: "0.2rem 0", color: "#ccc", fontSize: "0.95rem" }}>
                                        {b.customerEmail}
                                    </p>
                                    <p style={{ margin: "0.2rem 0", color: "#bbb", fontSize: "0.9rem" }}>
                                        {b.lessonType === "online" ? "Online" : "Személyes"}
                                        {b.selectedSubject ? ` · ${b.selectedSubject}` : ""}
                                        {typeof b.totalPrice === "number"
                                            ? ` · ${b.totalPrice.toLocaleString("hu-HU")} Ft`
                                            : ""}
                                    </p>
                                    <p style={{ margin: "0.2rem 0", color: "#ccc", fontSize: "0.9rem" }}>
                                        Számlázási cím:{" "}
                                        {[b.postalCode, b.street, b.houseNumber].filter(Boolean).join(" ") ||
                                            "—"}
                                    </p>
                                    <p style={{ margin: "0.35rem 0", fontSize: "0.9rem" }}>
                                        Fizetés:{" "}
                                        <span
                                            style={{
                                                color:
                                                    b.paymentStatus === "paid"
                                                        ? "#39ff14"
                                                        : b.paymentStatus === "transfer_pending"
                                                          ? "#ffd166"
                                                          : "#ff69b4",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {paymentStatusLabel(b.paymentStatus)}
                                        </span>
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.4rem",
                                            flexWrap: "wrap",
                                            marginBottom: "0.5rem",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {(
                                            [
                                                ["unpaid", "Nincs fizetve"],
                                                ["transfer_pending", "Utalás…"],
                                                ["paid", "Fizetve"],
                                            ] as Array<[PaymentStatus, string]>
                                        ).map(([value, label]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                disabled={blockBusy || busyId === b.id}
                                                onClick={async () => {
                                                    setBusyId(b.id);
                                                    try {
                                                        await updateBookingPaymentStatus(b.id, value);
                                                        await refresh();
                                                        onChanged?.();
                                                    } finally {
                                                        setBusyId(null);
                                                    }
                                                }}
                                                style={{
                                                    fontSize: "0.75rem",
                                                    padding: "0.3rem 0.55rem",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    border:
                                                        (b.paymentStatus || "unpaid") === value
                                                            ? "1px solid #39ff14"
                                                            : "1px solid #555",
                                                    background:
                                                        (b.paymentStatus || "unpaid") === value
                                                            ? "rgba(57,255,20,0.15)"
                                                            : "transparent",
                                                    color: "#ddd",
                                                }}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <BookingAttachments files={b.uploadedFiles} />
                                        <BookingCalendarLinks booking={b} forceShow />
                                    </div>
                                    {onCreateLobby ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                                marginTop: "0.85rem",
                                                flexWrap: "wrap",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                type="button"
                                                disabled={lobbyBusy}
                                                onClick={() => {
                                                    setSelectedBookingId(b.id);
                                                    void onCreateLobby(b);
                                                }}
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, #39ff14, #b8ff5a)",
                                                    color: "#061008",
                                                    border: "none",
                                                    borderRadius: "10px",
                                                    padding: "0.55rem 1rem",
                                                    fontWeight: 800,
                                                    cursor: lobbyBusy ? "wait" : "pointer",
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                {lobbyBusy && selectedBookingId === b.id
                                                    ? "Lobby…"
                                                    : "Lobby + e-mail"}
                                            </button>
                                        </div>
                                    ) : null}
                                    {(!b.status || b.status === "pending") && (
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                                marginTop: "0.75rem",
                                                flexWrap: "wrap",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                type="button"
                                                className="approve-btn"
                                                disabled={busyId === b.id}
                                                onClick={() => handleApprove(b)}
                                            >
                                                Jóváhagyás
                                            </button>
                                            <button
                                                type="button"
                                                className="reject-btn"
                                                disabled={busyId === b.id}
                                                onClick={() => handleReject(b)}
                                            >
                                                Elutasítás
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {onCreateLobby && selectedBookingId && dayBookings.some((b) => b.id === selectedBookingId) ? (
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "0.85rem 1rem",
                            borderRadius: "12px",
                            border: "1px solid rgba(57,255,20,0.35)",
                            background: "rgba(57,255,20,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <strong style={{ color: "#39ff14" }}>Kiválasztott diák</strong>
                            <p style={{ margin: "0.25rem 0 0", color: "#ddd", fontSize: "0.9rem" }}>
                                {dayBookings.find((b) => b.id === selectedBookingId)?.customerName}
                                {" · "}
                                {(
                                    dayBookings.find((b) => b.id === selectedBookingId)?.times || []
                                ).join(", ") || "—"}
                            </p>
                        </div>
                        <button
                            type="button"
                            disabled={lobbyBusy}
                            onClick={() => {
                                const b = dayBookings.find((x) => x.id === selectedBookingId);
                                if (b) void onCreateLobby(b);
                            }}
                            style={{
                                background: "linear-gradient(135deg, #39ff14, #b8ff5a)",
                                color: "#061008",
                                border: "none",
                                borderRadius: "10px",
                                padding: "0.65rem 1.15rem",
                                fontWeight: 800,
                                cursor: lobbyBusy ? "wait" : "pointer",
                            }}
                        >
                            {lobbyBusy ? "Lobby készül…" : "Lobby + e-mail"}
                        </button>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
