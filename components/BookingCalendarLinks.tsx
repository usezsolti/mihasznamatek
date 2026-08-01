import {
    downloadBookingIcs,
    getGoogleCalendarUrl,
    type CalendarBooking,
} from "../utils/bookingCalendar";

type Props = {
    booking: CalendarBooking;
    /** pending óráknál is mutatható; alapból csak approved */
    forceShow?: boolean;
};

export default function BookingCalendarLinks({ booking, forceShow }: Props) {
    const status = booking.status || "pending";
    if (!forceShow && status !== "approved") return null;

    const googleUrl = getGoogleCalendarUrl(booking);
    if (!googleUrl) return null;

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "0.65rem",
                alignItems: "center",
            }}
        >
            <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "inline-block",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "10px",
                    border: "1px solid #39ff14",
                    color: "#39ff14",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    background: "rgba(57,255,20,0.1)",
                }}
            >
                Google Naptár
            </a>
            <button
                type="button"
                onClick={() => downloadBookingIcs(booking)}
                style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "10px",
                    border: "1px solid #aaa",
                    color: "#ddd",
                    background: "transparent",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                }}
            >
                .ics letöltés
            </button>
        </div>
    );
}
