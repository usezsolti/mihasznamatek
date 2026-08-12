import { getGoogleCalendarUrl } from "./bookingCalendar";

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

function getFirebase(): any | null {
    if (typeof window === "undefined") return null;
    return (window as any).firebase || null;
}

const BOOKING_FILE_MAX_BYTES = 8 * 1024 * 1024;
const BOOKING_FILE_MAX_COUNT = 5;
const BOOKING_FILE_ACCEPT =
    /\.(pdf|jpe?g|png|docx?)$/i;

function sanitizeFileName(name: string): string {
    return name.replace(/[^\w.\-()\u00C0-\u024F ]+/g, "_").slice(0, 120) || "file";
}

/** Foglaláshoz csatolt fájlok feltöltése Firebase Storage-ba. */
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

    const firebase = getFirebase();
    if (!firebase?.storage) {
        return {
            ok: false,
            files: [],
            error: "A fájlfeltöltés most nem elérhető (Storage). Próbáld fájl nélkül, vagy később.",
        };
    }

    const uploaded: BookingAttachment[] = [];
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const safe = sanitizeFileName(file.name);
            const path = `booking-files/${bookingId}/${Date.now()}_${i}_${safe}`;
            const ref = firebase.storage().ref(path);
            await ref.put(file, { contentType: file.type || "application/octet-stream" });
            const url = await ref.getDownloadURL();
            uploaded.push({ name: file.name, url });
        }
        return { ok: true, files: uploaded };
    } catch (err: any) {
        console.error("uploadBookingAttachments failed:", err);
        return {
            ok: false,
            files: uploaded,
            error:
                err?.message ||
                "Fájlfeltöltés sikertelen. Ellenőrizd a Firebase Storage szabályokat, vagy küldd fájl nélkül.",
        };
    }
}

export async function saveBookingToFirestore(
    booking: BookingPayload
): Promise<{ ok: boolean; error?: string }> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) {
            return { ok: false, error: "Firebase nem elérhető" };
        }
        const db = firebase.firestore();
        const doc = {
            ...booking,
            status: "pending" as BookingStatus,
            paymentStatus: booking.paymentStatus || ("unpaid" as PaymentStatus),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection("bookings").doc(booking.id).set(doc);
        await db.collection("pendingBookings").doc(booking.id).set(doc).catch(() => undefined);
        return { ok: true };
    } catch (err: any) {
        console.error("Firestore booking save failed:", err);
        return { ok: false, error: err?.message || "Firestore mentés sikertelen" };
    }
}

export async function updateBookingStatus(
    bookingId: string,
    status: "approved" | "rejected" | "cancelled",
    booking?: BookingPayload
): Promise<boolean> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return false;
        const db = firebase.firestore();
        const stamp =
            status === "approved"
                ? { approvedAt: new Date().toISOString() }
                : status === "rejected"
                  ? { rejectedAt: new Date().toISOString() }
                  : { cancelledAt: new Date().toISOString() };
        const patch = {
            status,
            ...stamp,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection("bookings").doc(bookingId).set(patch, { merge: true });
        await db
            .collection("pendingBookings")
            .doc(bookingId)
            .set(patch, { merge: true })
            .catch(() => undefined);
        if (status === "approved" && booking) {
            await db
                .collection("approvedBookings")
                .doc(bookingId)
                .set({ ...booking, ...patch })
                .catch(() => undefined);
        }
        if (status === "cancelled" || status === "rejected") {
            await db
                .collection("approvedBookings")
                .doc(bookingId)
                .set(patch, { merge: true })
                .catch(() => undefined);
        }
        return true;
    } catch (err) {
        console.error("updateBookingStatus failed:", err);
        return false;
    }
}

export async function updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus
): Promise<boolean> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore || !bookingId) return false;
        const patch: Record<string, unknown> = {
            paymentStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (paymentStatus === "paid") {
            patch.paidAt = new Date().toISOString();
        }
        const db = firebase.firestore();
        await db.collection("bookings").doc(bookingId).set(patch, { merge: true });
        await db.collection("pendingBookings").doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        await db.collection("approvedBookings").doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        return true;
    } catch (err) {
        console.error("updateBookingPaymentStatus failed:", err);
        return false;
    }
}

export function paymentStatusLabel(status?: PaymentStatus | string): string {
    if (status === "paid") return "Fizetve";
    if (status === "transfer_pending") return "Utalás folyamatban";
    return "Nincs fizetve";
}

export async function markReminderSent(bookingId: string): Promise<boolean> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore || !bookingId) return false;
        const stamp = new Date().toISOString();
        const patch = {
            reminderSentAt: stamp,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        const db = firebase.firestore();
        await db.collection("bookings").doc(bookingId).set(patch, { merge: true });
        await db.collection("approvedBookings").doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        await db.collection("pendingBookings").doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        return true;
    } catch (err) {
        console.error("markReminderSent failed:", err);
        return false;
    }
}

/** Holnapi jóváhagyott órák, amikhez még nem ment emlékeztető. */
export async function loadReminderCandidatesFromFirestore(
    dateKey?: string
): Promise<BookingPayload[]> {
    const target = dateKey || getBudapestDateKeyOffset(1);
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const db = firebase.firestore();
        const map = new Map<string, BookingPayload>();

        const merge = (snap: any) => {
            snap.forEach((doc: any) => {
                const data = doc.data() || {};
                if (String(data.date || "") !== target) return;
                if (data.status !== "approved") return;
                if (data.reminderSentAt) return;
                map.set(doc.id, { id: doc.id, ...data });
            });
        };

        try {
            const byDate = await db
                .collection("bookings")
                .where("date", "==", target)
                .where("status", "==", "approved")
                .get();
            merge(byDate);
        } catch {
            const all = await db.collection("bookings").get();
            merge(all);
        }

        try {
            merge(await db.collection("approvedBookings").get());
        } catch {
            // ignore
        }

        return Array.from(map.values());
    } catch (err) {
        console.error("loadReminderCandidatesFromFirestore failed:", err);
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

/** Diák lemondása: Firestore + e-mail (admin + diák). */
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
    // Public calendar must NOT query bookings.* from the client — rules only allow
    // admin or own-email reads, so a full collection get throws permission-denied.
    try {
        const res = await fetch('/api/public-busy-slots', {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
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
    } catch (err: any) {
        const msg = String(err?.message || err || '');
        if (!/permission|insufficient/i.test(msg)) {
            console.warn('loadActiveBookingsFromFirestore:', msg.slice(0, 120));
        }
        return [];
    }
}

/** Admin naptár: pending + approved (+ rejected opcionálisan). */
export async function loadAdminCalendarBookingsFromFirestore(): Promise<BookingPayload[]> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const db = firebase.firestore();
        const map = new Map<string, BookingPayload>();

        const addSnap = (snap: any) => {
            snap.forEach((doc: any) => {
                map.set(doc.id, { id: doc.id, ...doc.data() });
            });
        };

        const bookings = await db.collection("bookings").get();
        addSnap(bookings);

        try {
            addSnap(await db.collection("pendingBookings").get());
        } catch {
            // ignore
        }
        try {
            addSnap(await db.collection("approvedBookings").get());
        } catch {
            // ignore
        }

        return Array.from(map.values()).sort((a, b) => {
            const d = String(b.date || "").localeCompare(String(a.date || ""));
            if (d !== 0) return d;
            return String(a.times?.[0] || "").localeCompare(String(b.times?.[0] || ""));
        });
    } catch (err) {
        console.error("loadAdminCalendarBookingsFromFirestore failed:", err);
        return [];
    }
}

export async function loadPendingBookingsFromFirestore(): Promise<BookingPayload[]> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const db = firebase.firestore();
        const snap = await db.collection("bookings").where("status", "==", "pending").get();
        let list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        if (list.length === 0) {
            const legacy = await db.collection("pendingBookings").where("status", "==", "pending").get();
            list = legacy.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        }
        return list.sort(
            (a: any, b: any) =>
                new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
        );
    } catch (err) {
        console.error("loadPendingBookingsFromFirestore failed:", err);
        return [];
    }
}

/** Diák saját foglalásai e-mail alapján (pending + approved + rejected). */
export async function loadStudentBookingsFromFirestore(
    customerEmail: string
): Promise<BookingPayload[]> {
    const email = (customerEmail || "").trim().toLowerCase();
    if (!email) return [];

    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const db = firebase.firestore();
        const map = new Map<string, BookingPayload>();

        const mergeSnap = (snap: any) => {
            snap.docs.forEach((doc: any) => {
                const data = doc.data() || {};
                const docEmail = String(data.customerEmail || "").trim().toLowerCase();
                if (docEmail && docEmail !== email) return;
                map.set(doc.id, { id: doc.id, ...data });
            });
        };

        try {
            const byEmail = await db
                .collection("bookings")
                .where("customerEmail", "==", customerEmail.trim())
                .get();
            mergeSnap(byEmail);
        } catch (err) {
            console.warn("bookings by email query failed, scanning:", err);
            const all = await db.collection("bookings").get();
            mergeSnap(all);
        }

        // Legacy collections
        try {
            const pending = await db.collection("pendingBookings").get();
            mergeSnap(pending);
        } catch {
            // ignore
        }
        try {
            const approved = await db.collection("approvedBookings").get();
            mergeSnap(approved);
        } catch {
            // ignore
        }

        return Array.from(map.values()).sort((a, b) => {
            const da = a.date || "";
            const db_ = b.date || "";
            if (da !== db_) return db_.localeCompare(da);
            return String(b.submittedAt || "").localeCompare(String(a.submittedAt || ""));
        });
    } catch (err) {
        console.error("loadStudentBookingsFromFirestore failed:", err);
        return [];
    }
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
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const snap = await firebase.firestore().collection("blockedSlots").get();
        const list: BlockedDay[] = [];
        snap.forEach((doc: any) => {
            const data = doc.data() || {};
            list.push({
                date: String(data.date || doc.id),
                times: Array.isArray(data.times) ? data.times.map(String) : [],
                allDay: Boolean(data.allDay),
                note: data.note ? String(data.note) : undefined,
                updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
            });
        });
        return list;
    } catch (err: any) {
        const msg = String(err?.message || err || "");
        if (!/permission|insufficient/i.test(msg)) {
            console.warn("loadBlockedDaysFromFirestore:", msg.slice(0, 120));
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
        const firebase = getFirebase();
        if (!firebase?.firestore) return false;
        const db = firebase.firestore();
        const times = Array.from(new Set(day.times || [])).sort();
        const allDay = Boolean(day.allDay);

        if (!allDay && times.length === 0) {
            await db.collection("blockedSlots").doc(day.date).delete().catch(() => undefined);
            return true;
        }

        await db.collection("blockedSlots").doc(day.date).set({
            date: day.date,
            times,
            allDay,
            note: day.note || "",
            updatedAt: new Date().toISOString(),
        });
        return true;
    } catch (err) {
        console.error("saveBlockedDay failed:", err);
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
