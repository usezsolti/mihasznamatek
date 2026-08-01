import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import {
    ADMIN_BOOKING_EMAIL,
    BookingEmailType,
    BookingPayload,
    EmailSendResult,
    buildMailsForType,
    sendViaFormSubmit,
} from "../../utils/bookingNotify";
import {
    getClientIp,
    isAllowedOrigin,
    isValidEmail,
    rateLimit,
    requireAdmin,
    requireAuth,
    sanitizeText,
    secureSiteOrigin,
} from "../../utils/apiSecurity";

type Body = {
    type?: BookingEmailType;
    booking?: BookingPayload;
    origin?: string;
};

type MailItem = {
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
    cc?: string;
};

const ADMIN_ONLY_TYPES: BookingEmailType[] = [
    "student_approved",
    "student_rejected",
    "lesson_reminder",
];

function sanitizeBooking(raw: any): BookingPayload | null {
    if (!raw || typeof raw !== "object") return null;
    const customerEmail = sanitizeText(raw.customerEmail, 200).toLowerCase();
    const customerName = sanitizeText(raw.customerName, 120);
    const id = sanitizeText(raw.id, 80);
    const date = sanitizeText(raw.date, 32);
    if (!id || !isValidEmail(customerEmail) || !customerName || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return null;
    }
    const times = Array.isArray(raw.times)
        ? raw.times.map((t: any) => sanitizeText(t, 8)).filter((t: string) => /^\d{2}:\d{2}$/.test(t)).slice(0, 12)
        : [];
    if (!times.length) return null;

    return {
        id,
        date,
        times,
        customerName,
        customerEmail,
        lessonType: raw.lessonType === "personal" ? "personal" : "online",
        selectedSubject: sanitizeText(raw.selectedSubject, 120),
        hobby: sanitizeText(raw.hobby, 500),
        totalPrice: Math.min(Math.max(Number(raw.totalPrice) || 0, 0), 5_000_000),
        postalCode: sanitizeText(raw.postalCode, 16),
        street: sanitizeText(raw.street, 120),
        houseNumber: sanitizeText(raw.houseNumber, 32),
        uploadedFiles: Array.isArray(raw.uploadedFiles)
            ? raw.uploadedFiles
                  .slice(0, 5)
                  .map((f: any) => {
                      if (typeof f === "string") return sanitizeText(f, 200);
                      const url = sanitizeText(f?.url, 500);
                      if (url && !/^https:\/\//i.test(url)) return null;
                      return { name: sanitizeText(f?.name, 120), url };
                  })
                  .filter(Boolean)
            : [],
        submittedAt: sanitizeText(raw.submittedAt, 40) || new Date().toISOString(),
        status: raw.status,
        paymentStatus: raw.paymentStatus,
    };
}

async function sendViaGmail(mails: MailItem[]): Promise<EmailSendResult> {
    const user = process.env.GMAIL_USER || ADMIN_BOOKING_EMAIL;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!pass) return { ok: false, error: "Nincs GMAIL_APP_PASSWORD beállítva" };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
    });

    try {
        for (const mail of mails) {
            await transporter.sendMail({
                from: `"Mihaszna Matek" <${user}>`,
                to: mail.to,
                cc: mail.cc,
                replyTo: mail.replyTo,
                subject: mail.subject,
                text: mail.text,
            });
        }
        return { ok: true, provider: "gmail" };
    } catch (err: any) {
        return { ok: false, provider: "gmail", error: err?.message || "Gmail hiba" };
    }
}

async function sendViaWeb3Forms(mails: MailItem[]): Promise<EmailSendResult> {
    const key = process.env.WEB3FORMS_ACCESS_KEY;
    if (!key) return { ok: false, error: "Nincs WEB3FORMS_ACCESS_KEY" };
    try {
        for (const mail of mails) {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: key,
                    subject: mail.subject,
                    from_name: "Mihaszna Matek",
                    email: mail.replyTo || ADMIN_BOOKING_EMAIL,
                    message: `To: ${mail.to}\n\n${mail.text}`,
                }),
            });
            if (!res.ok) {
                return { ok: false, provider: "web3forms", error: `Web3Forms ${res.status}` };
            }
        }
        return { ok: true, provider: "web3forms" };
    } catch (err: any) {
        return { ok: false, provider: "web3forms", error: err?.message || "Web3Forms hiba" };
    }
}

async function sendViaFormSubmitAll(
    type: BookingEmailType,
    mails: MailItem[],
    baseOrigin: string
): Promise<EmailSendResult> {
    let lastError = "";
    let anyOk = false;
    for (const mail of mails) {
        const result = await sendViaFormSubmit(mail, baseOrigin);
        if (result.ok) anyOk = true;
        else lastError = result.error || lastError;
    }
    if (anyOk) return { ok: true, provider: "formsubmit" };
    return { ok: false, provider: "formsubmit", error: lastError || "FormSubmit sikertelen" };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    if (!isAllowedOrigin(req)) {
        return res.status(403).json({ ok: false, error: "Nem engedélyezett origin." });
    }

    const ip = getClientIp(req);
    const { type, booking: rawBooking }: Body = req.body || {};

    const allowed: BookingEmailType[] = [
        "admin_new",
        "student_approved",
        "student_rejected",
        "booking_cancelled",
        "lesson_reminder",
    ];
    if (!type || !allowed.includes(type)) {
        return res.status(400).json({ ok: false, error: "Érvénytelen e-mail típus" });
    }

    const booking = sanitizeBooking(rawBooking);
    if (!booking) {
        return res.status(400).json({ ok: false, error: "Érvénytelen foglalási adat" });
    }

    // Rate limits
    if (type === "admin_new") {
        const rl = rateLimit(`email:admin_new:${ip}`, 8, 60 * 60 * 1000);
        if (!rl.ok) {
            return res.status(429).json({
                ok: false,
                error: `Túl sok foglalási e-mail. Próbáld ${rl.retryAfterSec}s múlva.`,
            });
        }
        const rlEmail = rateLimit(`email:admin_new:to:${booking.customerEmail}`, 5, 60 * 60 * 1000);
        if (!rlEmail.ok) {
            return res.status(429).json({ ok: false, error: "Túl sok kérés ezzel az e-mail címmel." });
        }
    } else {
        const rl = rateLimit(`email:${type}:${ip}`, 30, 60 * 60 * 1000);
        if (!rl.ok) {
            return res.status(429).json({ ok: false, error: "Túl sok kérés." });
        }
    }

    // Auth: admin-only típusok
    if (ADMIN_ONLY_TYPES.includes(type)) {
        const admin = await requireAdmin(req, res);
        if (!admin) return;
    }

    // Új foglalás e-mail: bejelentkezés + saját e-mail (spam / hamisítás ellen)
    if (type === "admin_new") {
        const user = await requireAuth(req, res);
        if (!user) return;
        if (user.email !== booking.customerEmail.toLowerCase()) {
            return res.status(403).json({
                ok: false,
                error: "A foglalási e-mailnek egyeznie kell a bejelentkezett fiókkal.",
            });
        }
    }

    // Lemondás: admin VAGY a foglaló diák (e-mail egyezés)
    if (type === "booking_cancelled") {
        const user = await requireAuth(req, res);
        if (!user) return;
        const isAdmin =
            user.email === ADMIN_BOOKING_EMAIL.toLowerCase() ||
            user.email === "usezsolti@gmail.com";
        if (!isAdmin && user.email !== booking.customerEmail.toLowerCase()) {
            return res.status(403).json({ ok: false, error: "Csak a saját foglalásod mondható le." });
        }
    }

    // Linkek: soha ne bízzunk a kliens originben productionben
    const baseOrigin = secureSiteOrigin();
    const mails = buildMailsForType(type, booking, baseOrigin);

    try {
        if (process.env.GMAIL_APP_PASSWORD) {
            const gmailResult = await sendViaGmail(mails);
            if (gmailResult.ok) return res.status(200).json(gmailResult);
            console.warn("Gmail failed, trying fallbacks:", gmailResult.error);
        }
        if (process.env.WEB3FORMS_ACCESS_KEY) {
            const w3 = await sendViaWeb3Forms(mails);
            if (w3.ok) return res.status(200).json(w3);
        }
        const fsResult = await sendViaFormSubmitAll(type, mails, baseOrigin);
        if (fsResult.ok) return res.status(200).json(fsResult);
        return res.status(502).json(fsResult);
    } catch (err: any) {
        console.error("send-booking-email API error:", err);
        return res.status(500).json({ ok: false, error: "Szerver hiba" });
    }
}
