/** Minimális típus — kerüli a körkörös importot a bookingNotify-jal. */
export type CalendarBooking = {
    id: string;
    date: string;
    times: string[];
    customerName?: string;
    customerEmail?: string;
    lessonType?: "online" | "personal" | string;
    selectedSubject?: string;
    hobby?: string;
    postalCode?: string;
    street?: string;
    houseNumber?: string;
    status?: string;
};

const TZ = "Europe/Budapest";

function parseTimeMins(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
}

function formatHm(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Foglalás időtartama: legkorábbi sáv elejétől az utolsó sáv + 60 percig. */
export function getBookingTimeRange(booking: CalendarBooking): { start: string; end: string } | null {
    const times = (booking.times || []).filter(Boolean).sort();
    if (!times.length || !booking.date) return null;
    const startMins = parseTimeMins(times[0]);
    const endMins = parseTimeMins(times[times.length - 1]) + 60;
    return { start: formatHm(startMins), end: formatHm(endMins) };
}

function icsEscape(text: string): string {
    return String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

function toIcsLocalStamp(dateKey: string, time: string): string {
    return `${dateKey.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function foldIcsLine(line: string): string {
    if (line.length <= 75) return line;
    let out = line.slice(0, 75);
    let rest = line.slice(75);
    while (rest.length) {
        out += `\r\n ${rest.slice(0, 74)}`;
        rest = rest.slice(74);
    }
    return out;
}

export function getBookingEventTitle(booking: CalendarBooking): string {
    const subject = booking.selectedSubject ? ` – ${booking.selectedSubject}` : "";
    return `Mihaszna Matek${subject}`;
}

export function getBookingEventDescription(booking: CalendarBooking): string {
    const lines = [
        `Diák: ${booking.customerName || "—"}`,
        `E-mail: ${booking.customerEmail || "—"}`,
        `Típus: ${booking.lessonType === "online" ? "Online" : "Személyes (Fót)"}`,
        `Témakör: ${booking.selectedSubject || "—"}`,
        `Időpontok: ${(booking.times || []).join(", ")}`,
    ];
    if (booking.hobby && booking.hobby !== "—") {
        lines.push(`Megjegyzés: ${booking.hobby}`);
    }
    lines.push("", "Mihaszna Matek – https://mihasznamatek.hu");
    return lines.join("\n");
}

export function getBookingEventLocation(booking: CalendarBooking): string {
    if (booking.lessonType === "online") return "Online";
    const addr = [booking.postalCode, booking.street, booking.houseNumber].filter(Boolean).join(" ");
    return addr || "Személyes óra (Fót)";
}

/** Google Calendar „Add event” link (helyi Budapest idő, sablon). */
export function getGoogleCalendarUrl(booking: CalendarBooking): string | null {
    const range = getBookingTimeRange(booking);
    if (!range || !booking.date) return null;

    const dates = `${toIcsLocalStamp(booking.date, range.start)}/${toIcsLocalStamp(booking.date, range.end)}`;
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: getBookingEventTitle(booking),
        dates,
        details: getBookingEventDescription(booking),
        location: getBookingEventLocation(booking),
        ctz: TZ,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** .ics fájl tartalom (Apple / Outlook / Google import). */
export function buildBookingIcs(booking: CalendarBooking): string | null {
    const range = getBookingTimeRange(booking);
    if (!range || !booking.date) return null;

    const uid = `${booking.id || "booking"}@mihasznamatek.hu`;
    const stamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
    const dtStart = toIcsLocalStamp(booking.date, range.start);
    const dtEnd = toIcsLocalStamp(booking.date, range.end);

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Mihaszna Matek//Booking//HU",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VTIMEZONE",
        `TZID:${TZ}`,
        "BEGIN:DAYLIGHT",
        "TZOFFSETFROM:+0100",
        "TZOFFSETTO:+0200",
        "TZNAME:CEST",
        "DTSTART:19700329T020000",
        "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
        "END:DAYLIGHT",
        "BEGIN:STANDARD",
        "TZOFFSETFROM:+0200",
        "TZOFFSETTO:+0100",
        "TZNAME:CET",
        "DTSTART:19701025T030000",
        "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART;TZID=${TZ}:${dtStart}`,
        `DTEND;TZID=${TZ}:${dtEnd}`,
        `SUMMARY:${icsEscape(getBookingEventTitle(booking))}`,
        `DESCRIPTION:${icsEscape(getBookingEventDescription(booking))}`,
        `LOCATION:${icsEscape(getBookingEventLocation(booking))}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ];

    return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

export function downloadBookingIcs(booking: CalendarBooking): boolean {
    const ics = buildBookingIcs(booking);
    if (!ics || typeof window === "undefined") return false;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mihaszna-matek-${booking.date || "ora"}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
}
