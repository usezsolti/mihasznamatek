import { getGoogleCalendarUrl } from "./bookingCalendar";
import {
    isAdminFirestoreDenied,
    markAdminFirestoreDenied,
} from "./adminFirestoreGate";

export const ADMIN_BOOKING_EMAIL = "usezsolti@gmail.com";

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

export type PaymentStatus = "unpaid" | "transfer_pending" | "paid";

export type BookingAttachment = {
    name: string;
    url: string;
};

export type BookingPayload = {
    id: string;
    date: string;
    times: string[];
    customerName: string;
    customerEmail: string;
    lessonType: "online" | "personal";
    selectedSubject: string;
    hobby: string;
    totalPrice: number;
    postalCode?: string;
    street?: string;
    houseNumber?: string;
    /** Új: {name,url}[]; régi foglalásoknál lehet sima fájlnév-string is. */
    uploadedFiles?: Array<BookingAttachment | string>;
    submittedAt: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    paidAt?: string;
    reminderSentAt?: string;
    gdprAccepted?: boolean;
    gdprAcceptedAt?: string;
    gdprVersion?: string;
};

export function normalizeAttachments(
    files?: Array<BookingAttachment | string> | null
): BookingAttachment[] {
    if (!files?.length) return [];
    return files
        .map((f) => {
            if (typeof f === "string") {
                const isUrl = /^https?:\/\//i.test(f);
                return { name: isUrl ? "csatolmány" : f, url: isUrl ? f : "" };
            }
            return { name: f.name || "csatolmány", url: f.url || "" };
        })
        .filter((f) => f.name);
}

export function formatAttachmentsLine(files?: Array<BookingAttachment | string> | null): string {
    const list = normalizeAttachments(files);
    if (!list.length) return "nincs";
    return list
        .map((f) => (f.url ? `${f.name}: ${f.url}` : f.name))
        .join("\n  ");
}

export type BookingEmailType =
    | "admin_new"
    | "student_approved"
    | "student_rejected"
    | "booking_cancelled"
    | "lesson_reminder";

export type EmailSendResult = {
    ok: boolean;
    provider?: "gmail" | "web3forms" | "formsubmit";
    error?: string;
    needsActivation?: boolean;
    warning?: string;
};

/** Éles / lokális site URL a dashboard linkekhez. */
export function resolveSiteOrigin(options?: {
    clientOrigin?: string;
    hostHeader?: string | string[];
    protoHeader?: string | string[];
}): string {
    const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
    if (envUrl) return envUrl;

    const hostRaw = options?.hostHeader;
    const host = Array.isArray(hostRaw) ? hostRaw[0] : hostRaw;
    const protoRaw = options?.protoHeader;
    const proto = (Array.isArray(protoRaw) ? protoRaw[0] : protoRaw) || "https";

    if (host && !/localhost|127\.0\.0\.1/i.test(host)) {
        return `${proto}://${host}`.replace(/\/$/, "");
    }

    const client = (options?.clientOrigin || "").replace(/\/$/, "");
    if (client) return client;

    return "https://mihasznamatek.hu";
}

function formatDateHu(dateKey: string): string {
    return new Date(dateKey + "T12:00:00").toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
    });
}

function typeLabel(lessonType: string): string {
    return lessonType === "online" ? "Online" : "Személyes (Fót)";
}

function addressLine(booking: BookingPayload): string {
    return `${booking.postalCode || ""} ${booking.street || ""} ${booking.houseNumber || ""}`.trim() || "—";
}

export function formatAdminNewMessage(booking: BookingPayload, dashboardUrl: string): string {
    return [
        "Új időpontfoglalás érkezett – elfogadásra vár!",
        "",
        `Név: ${booking.customerName}`,
        `E-mail: ${booking.customerEmail}`,
        `Dátum: ${formatDateHu(booking.date)}`,
        `Időpont(ok): ${booking.times.join(", ")}`,
        `Óra típusa: ${typeLabel(booking.lessonType)}`,
        `Témakör: ${booking.selectedSubject}`,
        `Megjegyzés: ${booking.hobby || "—"}`,
        `Ár: ${booking.totalPrice.toLocaleString("hu-HU")} Ft`,
        `Számlázási cím: ${addressLine(booking)}`,
        `Csatolt fájlok:\n  ${formatAttachmentsLine(booking.uploadedFiles)}`,
        `Beküldve: ${new Date(booking.submittedAt).toLocaleString("hu-HU")}`,
        `Foglalás ID: ${booking.id}`,
        "",
        "Elfogadáshoz / elutasításhoz nyisd meg a dashboardot:",
        dashboardUrl,
    ].join("\n");
}

export function formatStudentDecisionMessage(
    booking: BookingPayload,
    decision: "approved" | "rejected"
): string {
    const dateHu = formatDateHu(booking.date);
    if (decision === "approved") {
        const calUrl = getGoogleCalendarUrl(booking);
        return [
            `Kedves ${booking.customerName}!`,
            "",
            "✅ Foglalásod jóváhagyva!",
            "",
            `📅 Dátum: ${dateHu}`,
            `⏰ Időpontok: ${booking.times.join(", ")}`,
            `📍 Óra típusa: ${typeLabel(booking.lessonType)}`,
            `📚 Témakör: ${booking.selectedSubject}`,
            `💰 Összesen: ${booking.totalPrice.toLocaleString("hu-HU")} Ft`,
            ...(calUrl ? ["", "Naptárba mentés (Google):", calUrl] : []),
            "",
            "Egy nappal az óra előtt emlékeztető e-mailt is küldünk.",
            "",
            "Várunk az órán!",
            "",
            "Üdvözlettel,",
            "Mihaszna Matek",
            ADMIN_BOOKING_EMAIL,
        ].join("\n");
    }
    return [
        `Kedves ${booking.customerName}!`,
        "",
        "Sajnos a foglalási kérelmedet most nem tudjuk elfogadni.",
        "",
        `📅 Kért dátum: ${dateHu}`,
        `⏰ Kért időpontok: ${booking.times.join(", ")}`,
        "",
        "Ha szeretnél máskor időpontot, foglalj újra az oldalon, vagy írj nekünk.",
        "",
        "Üdvözlettel,",
        "Mihaszna Matek",
        ADMIN_BOOKING_EMAIL,
    ].join("\n");
}

export function formatStudentReceivedMessage(booking: BookingPayload): string {
    return [
        `Kedves ${booking.customerName}!`,
        "",
        "Megkaptuk az időpontfoglalási kérelmedet. Hamarosan visszajelzünk e-mailben.",
        "",
        `📅 Dátum: ${formatDateHu(booking.date)}`,
        `⏰ Időpontok: ${booking.times.join(", ")}`,
        `📍 Óra típusa: ${typeLabel(booking.lessonType)}`,
        `💰 Összesen: ${booking.totalPrice.toLocaleString("hu-HU")} Ft`,
        "",
        "Üdvözlettel,",
        "Mihaszna Matek",
    ].join("\n");
}

export function formatAdminCancelledMessage(booking: BookingPayload, dashboardUrl: string): string {
    return [
        "Egy diák lemondta a foglalását.",
        "",
        `Név: ${booking.customerName}`,
        `E-mail: ${booking.customerEmail}`,
        `Dátum: ${formatDateHu(booking.date)}`,
        `Időpont(ok): ${(booking.times || []).join(", ")}`,
        `Óra típusa: ${typeLabel(booking.lessonType)}`,
        `Témakör: ${booking.selectedSubject || "—"}`,
        `Foglalás ID: ${booking.id}`,
        "",
        "Dashboard:",
        dashboardUrl,
    ].join("\n");
}

export function formatStudentCancelledMessage(booking: BookingPayload): string {
    return [
        `Kedves ${booking.customerName}!`,
        "",
        "Foglalásod sikeresen lemondva.",
        "",
        `📅 Dátum: ${formatDateHu(booking.date)}`,
        `⏰ Időpontok: ${(booking.times || []).join(", ")}`,
        "",
        "Ha máskor szeretnél órát, foglalj újra a honlapon.",
        "",
        "Üdvözlettel,",
        "Mihaszna Matek",
        ADMIN_BOOKING_EMAIL,
    ].join("\n");
}

export function formatLessonReminderMessage(booking: BookingPayload): string {
    const times = (booking.times || []).join(", ");
    const calUrl = getGoogleCalendarUrl(booking);
    return [
        `Kedves ${booking.customerName}!`,
        "",
        "⏰ Emlékeztető: holnap matekóra!",
        "",
        `📅 Dátum: ${formatDateHu(booking.date)}`,
        `⏰ Időpontok: ${times}`,
        `📍 Óra típusa: ${typeLabel(booking.lessonType)}`,
        `📚 Témakör: ${booking.selectedSubject || "—"}`,
        "",
        booking.lessonType === "online"
            ? "Az óra online lesz — a linket / belépési infót e-mailben / Messengeren egyeztetjük."
            : "Az óra személyesen lesz (Fót).",
        ...(calUrl ? ["", "Naptárba mentés (Google):", calUrl] : []),
        "",
        "Ha mégsem tudsz jönni, mondd le a Dashboard → Profilom → Óráim menüben.",
        "",
        "Üdvözlettel,",
        "Mihaszna Matek",
        ADMIN_BOOKING_EMAIL,
    ].join("\n");
}

/** Mai / holnapi dátumkulcs Budapest időzónában (YYYY-MM-DD). */
export function getBudapestDateKeyOffset(daysFromToday: number): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Budapest",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const y = Number(parts.find((p) => p.type === "year")?.value);
    const m = Number(parts.find((p) => p.type === "month")?.value);
    const d = Number(parts.find((p) => p.type === "day")?.value);
    const base = new Date(Date.UTC(y, m - 1, d));
    base.setUTCDate(base.getUTCDate() + daysFromToday);
    const yy = base.getUTCFullYear();
    const mm = String(base.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(base.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

type MailPayload = {
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
    cc?: string;
};

/** FormSubmit AJAX – a JSON success mezőt is ellenőrzi. */
export async function sendViaFormSubmit(
    mail: MailPayload,
    origin: string
): Promise<EmailSendResult> {
    try {
        const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(mail.to)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Origin: origin,
                Referer: `${origin}/booking`,
            },
            body: JSON.stringify({
                name: "Mihaszna Matek",
                email: mail.replyTo || ADMIN_BOOKING_EMAIL,
                _replyto: mail.replyTo || ADMIN_BOOKING_EMAIL,
                _subject: mail.subject,
                ...(mail.cc ? { _cc: mail.cc } : {}),
                _template: "table",
                _captcha: "false",
                message: mail.text,
            }),
        });

        const raw = await res.text();
        let data: any = null;
        try {
            data = JSON.parse(raw);
        } catch {
            // HTML válasz = gyakran CF / hiba
        }

        const msg = String(data?.message || raw || "");
        const needsActivation = /activat/i.test(msg) || /Activate Form/i.test(msg);

        // Fontos: az aktiváló szöveg tartalmazza a "sent" szót — azt NE számítsuk sikernek
        if (needsActivation) {
            console.error("FormSubmit needs activation:", msg);
            return {
                ok: false,
                provider: "formsubmit",
                needsActivation: true,
                error: `FormSubmit aktiválás kell: nézd meg a(z) ${mail.to} postaládát (Spam is!), kattints az „Activate Form” linkre, majd foglalj újra.`,
            };
        }

        const successFlag = data?.success;
        const success =
            successFlag === true ||
            successFlag === "true" ||
            /email has been sent|successfully sent|thank you/i.test(msg);

        if (success && res.ok) {
            return { ok: true, provider: "formsubmit" };
        }

        console.error("FormSubmit rejected:", msg || raw);
        return {
            ok: false,
            provider: "formsubmit",
            error: msg || "Ismeretlen FormSubmit hiba",
        };
    } catch (err: any) {
        console.error("FormSubmit error:", err);
        return { ok: false, provider: "formsubmit", error: err?.message || "FormSubmit hálózati hiba" };
    }
}

export function buildMailsForType(
    type: BookingEmailType,
    booking: BookingPayload,
    origin: string
): MailPayload[] {
    const dashboardUrl = `${origin}/dashboard`;

    if (type === "admin_new") {
        return [
            {
                to: ADMIN_BOOKING_EMAIL,
                subject: `Új időpontfoglalás: ${booking.customerName} – ${booking.date} ${booking.times.join(", ")}`,
                text: formatAdminNewMessage(booking, dashboardUrl),
                replyTo: booking.customerEmail,
            },
            {
                to: booking.customerEmail,
                subject: `Megkaptuk a foglalásod – Mihaszna Matek (${booking.date})`,
                text: formatStudentReceivedMessage(booking),
                replyTo: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    if (type === "booking_cancelled") {
        return [
            {
                to: ADMIN_BOOKING_EMAIL,
                subject: `Lemondás: ${booking.customerName} – ${booking.date} ${(booking.times || []).join(", ")}`,
                text: formatAdminCancelledMessage(booking, dashboardUrl),
                replyTo: booking.customerEmail,
            },
            {
                to: booking.customerEmail,
                subject: `Foglalásod lemondva – ${booking.date}`,
                text: formatStudentCancelledMessage(booking),
                replyTo: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    if (type === "lesson_reminder") {
        const times = (booking.times || []).join(", ");
        return [
            {
                to: booking.customerEmail,
                subject: `⏰ Holnap óra – ${booking.date} ${times}`,
                text: formatLessonReminderMessage(booking),
                replyTo: ADMIN_BOOKING_EMAIL,
                cc: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    const decision = type === "student_approved" ? "approved" : "rejected";
    return [
        {
            to: booking.customerEmail,
            subject:
                decision === "approved"
                    ? `✅ Foglalásod jóváhagyva – ${booking.date}`
                    : `Foglalási kérelem – ${booking.date}`,
            text: formatStudentDecisionMessage(booking, decision),
            replyTo: ADMIN_BOOKING_EMAIL,
            cc: ADMIN_BOOKING_EMAIL,
        },
    ];
}

/** Kliens: mindig az API-n keresztül (+ Firebase ID token, ha van). */
export async function sendBookingEmailFromClient(
    type: BookingEmailType,
    booking: BookingPayload
): Promise<EmailSendResult> {
    try {
        const { apiSendBookingEmail } = await import("./apiClient");
        const res = await apiSendBookingEmail(type, booking as unknown as Record<string, unknown>);
        if (res.ok) {
            return {
                ok: true,
                provider: res.data.provider,
                warning: res.data.warning,
            };
        }
        return {
            ok: false,
            needsActivation: !!res.meta?.needsActivation,
            error: res.error || "E-mail API hiba",
            provider: res.meta?.provider as string | undefined,
        };
    } catch (err: any) {
        console.error("sendBookingEmailFromClient error:", err);
        return { ok: false, error: err?.message || "E-mail küldés sikertelen" };
    }
}

/** @deprecated */
export async function sendBookingAdminEmail(booking: BookingPayload): Promise<boolean> {
    const r = await sendBookingEmailFromClient("admin_new", booking);
    return r.ok;
}


const BOOKING_FILE_MAX_BYTES = 8 * 1024 * 1024;
const BOOKING_FILE_MAX_COUNT = 5;
const BOOKING_FILE_ACCEPT =
    /\.(pdf|jpe?g|png|docx?)$/i;

function sanitizeFileName(name: string): string {
    return name.replace(/[^\w.\-()\u00C0-\u024F ]+/g, "_").slice(0, 120) || "file";
}

/** Foglaláshoz csatolt fájlok feltöltése Vercel Blob-ba (/api/upload). */
export async function uploadBookingAttachments(
    bookingId: string,
    files: File[]
): Promise<{ ok: boolean; files: BookingAttachment[]; error?: string }> {
    if (!files.length) return { ok: true, files: [] };
    if (files.length > BOOKING_FILE_MAX_COUNT) {
        return {
            ok: false,
            files: [],
            error: `Maximum ${BOOKING_FILE_MAX_COUNT} fájl csatolható.`,
        };
    }

    for (const file of files) {
        if (file.size > BOOKING_FILE_MAX_BYTES) {
            return {
                ok: false,
                files: [],
                error: `"${file.name}" túl nagy (max. 8 MB).`,
            };
        }
        if (!BOOKING_FILE_ACCEPT.test(file.name)) {
            return {
                ok: false,
                files: [],
                error: `"${file.name}" nem támogatott. Engedélyezett: PDF, JPG, PNG, DOC, DOCX.`,
            };
        }
    }

    const { uploadFileViaApi } = await import('./clientUpload');
    const uploaded: BookingAttachment[] = [];
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const safe = sanitizeFileName(file.name);
            const path = `booking-files/${bookingId}/${Date.now()}_${i}_${safe}`;
            const url = await uploadFileViaApi(
                file,
                safe,
                file.type || 'application/octet-stream',
                path
            );
            uploaded.push({ name: file.name, url });
        }
        return { ok: true, files: uploaded };
    } catch (err: unknown) {
        console.error('uploadBookingAttachments failed:', err);
        return {
            ok: false,
            files: uploaded,
            error:
                (err instanceof Error ? err.message : null) ||
                'Fájlfeltöltés sikertelen. Próbáld fájl nélkül, vagy később.',
        };
    }
}

export async function saveBookingToFirestore(
    booking: BookingPayload
): Promise<{ ok: boolean; error?: string }> {
    try {
        const { apiPost } = await import('./apiClient');
        const res = await apiPost<{ booking?: BookingPayload }>('/api/bookings/create', booking);
        if (!res.ok) return { ok: false, error: res.error || 'Mentés sikertelen' };
        return { ok: true };
    } catch (err: unknown) {
        console.error('Booking save failed:', err);
        return {
            ok: false,
            error: err instanceof Error ? err.message : 'Mentés sikertelen',
        };
    }
}

async function patchBooking(bookingId: string, patch: Record<string, unknown>): Promise<boolean> {
    try {
        const { apiPatchAuth } = await import('./apiClient');
        const res = await apiPatchAuth<{ booking?: BookingPayload }>(
            `/api/bookings/${encodeURIComponent(bookingId)}`,
            patch
        );
        return res.ok;
    } catch {
        return false;
    }
}

export async function updateBookingStatus(
    bookingId: string,
    status: "approved" | "rejected" | "cancelled",
    _booking?: BookingPayload
): Promise<boolean> {
    return patchBooking(bookingId, { status });
}

export async function updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus
): Promise<boolean> {
    const patch: Record<string, unknown> = { paymentStatus };
    if (paymentStatus === 'paid') {
        patch.paidAt = new Date().toISOString();
    }
    return patchBooking(bookingId, patch);
}

export function paymentStatusLabel(status?: PaymentStatus | string): string {
    if (status === "paid") return "Fizetve";
    if (status === "transfer_pending") return "Utalás folyamatban";
    return "Nincs fizetve";
}

export async function markReminderSent(bookingId: string): Promise<boolean> {
    if (!bookingId) return false;
    return patchBooking(bookingId, { reminderSentAt: new Date().toISOString() });
}

/** Holnapi jóváhagyott órák, amikhez még nem ment emlékeztető. */
export async function loadReminderCandidatesFromFirestore(
    dateKey?: string
): Promise<BookingPayload[]> {
    const target = dateKey || getBudapestDateKeyOffset(1);
    try {
        const { apiGetAuth } = await import('./apiClient');
        const res = await apiGetAuth<{ bookings?: BookingPayload[] }>(
            `/api/bookings/list?status=approved&date=${encodeURIComponent(target)}&reminderPending=1`
        );
        if (!res.ok || !Array.isArray(res.data?.bookings)) return [];
        return res.data.bookings;
    } catch (err) {
        console.error('loadReminderCandidatesFromFirestore failed:', err);
        return [];
    }
}

export type ReminderRunResult = {
    dateKey: string;
    candidates: number;
    sent: number;
    failed: number;
    errors: string[];
};

/** Emlékeztetők küldése a holnapi (vagy megadott nap) jóváhagyott órákra. */
export async function processLessonReminders(dateKey?: string): Promise<ReminderRunResult> {
    const target = dateKey || getBudapestDateKeyOffset(1);
    const list = await loadReminderCandidatesFromFirestore(target);
    const result: ReminderRunResult = {
        dateKey: target,
        candidates: list.length,
        sent: 0,
        failed: 0,
        errors: [],
    };

    for (const booking of list) {
        const emailed = await sendBookingEmailFromClient("lesson_reminder", booking);
        if (emailed.ok) {
            await markReminderSent(booking.id);
            result.sent += 1;
        } else {
            result.failed += 1;
            result.errors.push(
                `${booking.customerName || booking.id}: ${emailed.error || "küldés sikertelen"}`
            );
        }
    }

    return result;
}

/** Diák lemondása: API + e-mail (admin + diák). */
export async function cancelBookingByStudent(
    booking: BookingPayload
): Promise<{ ok: boolean; error?: string }> {
    if (!booking?.id) return { ok: false, error: "Hiányzó foglalás" };
    const status = booking.status || "pending";
    if (status !== "pending" && status !== "approved") {
        return { ok: false, error: "Ez a foglalás már nem mondható le." };
    }
    if (booking.date) {
        const day = new Date(booking.date + "T23:59:59");
        if (day.getTime() < Date.now()) {
            return { ok: false, error: "Múltbeli óra nem mondható le." };
        }
    }

    const saved = await updateBookingStatus(booking.id, "cancelled", booking);
    if (!saved) return { ok: false, error: "Nem sikerült menteni a lemondást." };

    const emailed = await sendBookingEmailFromClient("booking_cancelled", {
        ...booking,
        status: "cancelled",
    });
    if (!emailed.ok) {
        return {
            ok: true,
            error: emailed.error || "Lemondva, de az e-mail nem ment el.",
        };
    }
    return { ok: true };
}

export async function loadActiveBookingsFromFirestore(): Promise<BookingPayload[]> {
    try {
        const res = await fetch('/api/public-busy-slots', {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'include',
        });
        if (!res.ok) return [];
        const json = await res.json();
        const slots = Array.isArray(json?.data?.slots) ? json.data.slots : [];
        return slots.map((s: any, i: number) => ({
            id: `busy_${s.date}_${i}`,
            date: String(s.date || ''),
            times: Array.isArray(s.times) ? s.times.map(String) : [],
            customerName: '',
            customerEmail: '',
            lessonType: 'online',
            selectedSubject: '',
            hobby: '',
            totalPrice: 0,
            submittedAt: '',
            status: (s.status === 'approved' ? 'approved' : 'pending') as BookingStatus,
        }));
    } catch (err: unknown) {
        const msg = String(err instanceof Error ? err.message : err || '');
        if (!/permission|insufficient/i.test(msg)) {
            console.warn('loadActiveBookingsFromFirestore:', msg.slice(0, 120));
        }
        return [];
    }
}

let adminCalendarDenied = false;

export function isAdminCalendarDenied(): boolean {
    return adminCalendarDenied || isAdminFirestoreDenied();
}

/** Admin naptár + blockedSlots — egy API hívás, nincs kliens bookings.get(). */
export async function loadAdminCalendarBundle(): Promise<{
    bookings: BookingPayload[];
    blocked: BlockedDay[];
}> {
    if (adminCalendarDenied || isAdminFirestoreDenied()) {
        return { bookings: [], blocked: [] };
    }

    try {
        const { apiGetAuth } = await import("./apiClient");

        const res = await apiGetAuth<{
            bookings?: BookingPayload[];
            blocked?: BlockedDay[];
            permissionDenied?: boolean;
        }>("/api/admin/calendar-bookings");

        if (res.ok && res.data?.permissionDenied) {
            adminCalendarDenied = true;
            markAdminFirestoreDenied();
            return { bookings: [], blocked: [] };
        }

        if (res.ok) {
            adminCalendarDenied = false;
            const bookings = Array.isArray(res.data?.bookings) ? [...res.data.bookings] : [];
            bookings.sort((a, b) => {
                const d = String(b.date || "").localeCompare(String(a.date || ""));
                if (d !== 0) return d;
                return String(a.times?.[0] || "").localeCompare(String(b.times?.[0] || ""));
            });
            return {
                bookings,
                blocked: Array.isArray(res.data?.blocked) ? res.data.blocked : [],
            };
        }

        const status = Number((res as any).status || 0);
        if (status === 403 || status === 401) {
            adminCalendarDenied = true;
            markAdminFirestoreDenied();
        }
        return { bookings: [], blocked: [] };
    } catch {
        return { bookings: [], blocked: [] };
    }
}

/** @deprecated — használd loadAdminCalendarBundle */
export async function loadAdminCalendarBookingsFromFirestore(): Promise<BookingPayload[]> {
    const { bookings } = await loadAdminCalendarBundle();
    return bookings;
}

let pendingBookingsDenied = false;

export function isPendingBookingsDenied(): boolean {
    return pendingBookingsDenied || isAdminFirestoreDenied();
}

export async function loadPendingBookingsFromFirestore(): Promise<BookingPayload[]> {
    // Csak admin API — ne legyen kliens Firestore bookings query (rules / overlay zaj).
    if (pendingBookingsDenied || isAdminFirestoreDenied()) return [];

    try {
        const { apiGetAuth } = await import("./apiClient");

        const res = await apiGetAuth<{
            pending?: BookingPayload[];
            permissionDenied?: boolean;
        }>("/api/admin/teacher-bootstrap");

        if (res.ok && res.data?.permissionDenied) {
            pendingBookingsDenied = true;
            markAdminFirestoreDenied();
            return [];
        }

        if (res.ok && Array.isArray(res.data?.pending)) {
            pendingBookingsDenied = false;
            return [...res.data.pending].sort(
                (a: any, b: any) =>
                    new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
            );
        }

        if (!res.ok) {
            const status = Number((res as any).status || 0);
            const err = String(res.error || "");
            // 403 = jogosultság / rules; 401 ismétlődő → állj (nincs session)
            if (
                status === 403 ||
                status === 401 ||
                /rules|permission|jogosult|tilt|HTTP 403/i.test(err)
            ) {
                pendingBookingsDenied = true;
                markAdminFirestoreDenied();
            }
            return [];
        }
    } catch {
        /* soft empty */
    }

    return [];
}

/** Diák saját foglalásai e-mail alapján (pending + approved + rejected). */
export async function loadStudentBookingsFromFirestore(
    customerEmail: string
): Promise<BookingPayload[]> {
    const email = (customerEmail || '').trim().toLowerCase();
    if (!email) return [];

    try {
        const { apiGetAuth } = await import('./apiClient');
        const res = await apiGetAuth<{ bookings?: BookingPayload[] }>(
            `/api/bookings/list?email=${encodeURIComponent(email)}`
        );
        if (!res.ok || !Array.isArray(res.data?.bookings)) return [];
        return sortBookings(res.data.bookings);
    } catch (err) {
        console.error('loadStudentBookingsFromFirestore failed:', err);
        return [];
    }
}

function sortBookings(list: BookingPayload[]): BookingPayload[] {
    return [...list].sort((a, b) => {
        const da = a.date || '';
        const db_ = b.date || '';
        if (da !== db_) return db_.localeCompare(da);
        return String(b.submittedAt || '').localeCompare(String(a.submittedAt || ''));
    });
}

/** Admin által manuálisan blokkolt nap / órasávok. */
export type BlockedDay = {
    date: string;
    times: string[];
    allDay?: boolean;
    note?: string;
    updatedAt?: string;
};

export async function loadBlockedDaysFromFirestore(): Promise<BlockedDay[]> {
    try {
        const { apiGet } = await import('./apiClient');
        const res = await apiGet<{ blocked?: BlockedDay[] }>('/api/blocked-slots');
        if (!res.ok || !Array.isArray(res.data?.blocked)) return [];
        return res.data.blocked;
    } catch (err: unknown) {
        const msg = String(err instanceof Error ? err.message : err || '');
        if (!/permission|insufficient/i.test(msg)) {
            console.warn('loadBlockedDaysFromFirestore:', msg.slice(0, 120));
        }
        return [];
    }
}

/** Dátum → blokkolt órák halmaza (allDay esetén az összes sáv). */
export function blockedTimesMap(
    blockedDays: BlockedDay[],
    slotsForDate: (dateKey: string) => string[]
): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();
    blockedDays.forEach((day) => {
        if (!day.date) return;
        const set = new Set<string>();
        if (day.allDay) {
            slotsForDate(day.date).forEach((t) => set.add(t));
        } else {
            (day.times || []).forEach((t) => set.add(t));
        }
        if (set.size > 0) map.set(day.date, set);
    });
    return map;
}

export async function saveBlockedDay(day: BlockedDay): Promise<boolean> {
    try {
        const { apiPostAuth } = await import('./apiClient');
        const res = await apiPostAuth<{ blocked?: BlockedDay | null }>('/api/blocked-slots', day);
        return res.ok;
    } catch (err) {
        console.error('saveBlockedDay failed:', err);
        return false;
    }
}

export async function toggleBlockedSlot(
    dateKey: string,
    slot: string,
    currentlyBlocked: boolean,
    allDaySlots: string[]
): Promise<boolean> {
    const list = await loadBlockedDaysFromFirestore();
    const existing = list.find((d) => d.date === dateKey);
    let times = new Set<string>(existing?.allDay ? allDaySlots : existing?.times || []);
    let allDay = Boolean(existing?.allDay);

    if (currentlyBlocked) {
        times.delete(slot);
        allDay = false;
    } else {
        times.add(slot);
        if (allDaySlots.length > 0 && allDaySlots.every((s) => times.has(s))) {
            allDay = true;
        }
    }

    return saveBlockedDay({
        date: dateKey,
        times: Array.from(times),
        allDay,
        note: existing?.note,
    });
}

export async function setDayBlocked(
    dateKey: string,
    block: boolean,
    allDaySlots: string[]
): Promise<boolean> {
    if (!block) {
        return saveBlockedDay({ date: dateKey, times: [], allDay: false });
    }
    return saveBlockedDay({
        date: dateKey,
        times: allDaySlots,
        allDay: true,
    });
}
