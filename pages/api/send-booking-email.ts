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
    extractBearerToken,
    verifyFirebaseIdToken,
    sanitizeText,
    secureSiteOrigin,
} from "../../utils/apiSecurity";
import { sendErr, sendOk } from "../../server/http";
import { isAdminEmail } from "../../utils/admin";
import { getAdminDb } from "../../server/firebaseAdmin";
import { agentDebugLog } from "../../utils/agentDebugLog";
import { emailFromHeader } from "../../utils/emailFrom";

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
    // Google gyakran szóközökkel mutatja az app jelszót — nodemailernek egyben kell
    const pass = String(process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    if (!pass) return { ok: false, error: "Nincs GMAIL_APP_PASSWORD beállítva" };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
    });

    try {
        for (const mail of mails) {
            await transporter.sendMail({
                from: emailFromHeader(),
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

function emailOk(res: NextApiResponse, result: EmailSendResult) {
    return sendOk(res, {
        provider: result.provider,
        warning: result.warning,
        needsActivation: result.needsActivation,
    });
}

function emailFail(res: NextApiResponse, result: EmailSendResult, status = 502) {
    return res.status(status).json({
        ok: false,
        error: result.error || "E-mail küldés sikertelen",
        provider: result.provider,
        needsActivation: result.needsActivation,
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return sendErr(res, "Method not allowed", 405);
    }

    if (!isAllowedOrigin(req)) {
        return sendErr(res, "Nem engedélyezett origin.", 403);
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
        return sendErr(res, "Érvénytelen e-mail típus", 400);
    }

    // #region agent log
    agentDebugLog({
        hypothesisId: 'R1',
        location: 'api/send-booking-email.ts:entry',
        message: 'booking email API hit',
        data: { type, hasBookingId: Boolean(rawBooking?.id) },
        runId: 'phase1-refactor',
    });
    // #endregion

    const booking = sanitizeBooking(rawBooking);
    if (!booking) {
        return sendErr(res, "Érvénytelen foglalási adat", 400);
    }

    // Rate limits
    if (type === "admin_new") {
        const rl = rateLimit(`email:admin_new:${ip}`, 8, 60 * 60 * 1000);
        if (!rl.ok) {
            return sendErr(
                res,
                `Túl sok foglalási e-mail. Próbáld ${rl.retryAfterSec}s múlva.`,
                429
            );
        }
        const rlEmail = rateLimit(`email:admin_new:to:${booking.customerEmail}`, 5, 60 * 60 * 1000);
        if (!rlEmail.ok) {
            return sendErr(res, "Túl sok kérés ezzel az e-mail címmel.", 429);
        }
    } else {
        const rl = rateLimit(`email:${type}:${ip}`, 30, 60 * 60 * 1000);
        if (!rl.ok) {
            return sendErr(res, "Túl sok kérés.", 429);
        }
    }

    // Auth: admin-only típusok
    if (ADMIN_ONLY_TYPES.includes(type)) {
        const admin = await requireAdmin(req, res);
        if (!admin) return;
    }

    // Új foglalás e-mail: vendég OK (rate limit), bejelentkezve e-mail egyezés
    if (type === "admin_new") {
        const token = extractBearerToken(req);
        if (token) {
            const user = await verifyFirebaseIdToken(token);
            if (!user) {
                return sendErr(res, "Érvénytelen vagy lejárt munkamenet.", 401);
            }
            if (user.email !== booking.customerEmail.toLowerCase()) {
                return sendErr(
                    res,
                    "A foglalási e-mailnek egyeznie kell a bejelentkezett fiókkal.",
                    403
                );
            }
        }
        // Spam ellen: csak létező Firestore foglalásra küldünk (Admin SDK ha elérhető)
        const db = getAdminDb();
        if (db && booking.id) {
            try {
                const snap = await db.collection("bookings").doc(booking.id).get();
                if (!snap.exists) {
                    return sendErr(res, "A foglalás nem található. Mentés után próbáld újra.", 409);
                }
                const email = String(snap.data()?.customerEmail || "").toLowerCase();
                if (email && email !== booking.customerEmail.toLowerCase()) {
                    return sendErr(res, "A foglalási adatok nem egyeznek.", 403);
                }
            } catch (err) {
                console.warn("admin_new booking verify skipped:", err);
            }
        }
    }

    // Lemondás: admin VAGY a foglaló diák (e-mail egyezés)
    if (type === "booking_cancelled") {
        const user = await requireAuth(req, res);
        if (!user) return;
        if (!isAdminEmail(user.email) && user.email !== booking.customerEmail.toLowerCase()) {
            return sendErr(res, "Csak a saját foglalásod mondható le.", 403);
        }
    }

    // Linkek: soha ne bízzunk a kliens originben productionben
    const baseOrigin = secureSiteOrigin();
    const mails = buildMailsForType(type, booking, baseOrigin);

    try {
        if (process.env.GMAIL_APP_PASSWORD) {
            const gmailResult = await sendViaGmail(mails);
            // #region agent log
            agentDebugLog({
                hypothesisId: 'E1',
                location: 'api/send-booking-email.ts:gmail',
                message: 'gmail attempt',
                data: {
                    ok: gmailResult.ok,
                    err: String(gmailResult.error || '').slice(0, 160),
                    type,
                    mailCount: mails.length,
                },
                runId: 'email-debug',
            });
            // #endregion
            if (gmailResult.ok) return emailOk(res, gmailResult);
            console.warn("Gmail failed, trying fallbacks:", gmailResult.error);
        }
        if (process.env.WEB3FORMS_ACCESS_KEY) {
            const w3 = await sendViaWeb3Forms(mails);
            // #region agent log
            agentDebugLog({
                hypothesisId: 'E2',
                location: 'api/send-booking-email.ts:web3',
                message: 'web3forms attempt',
                data: { ok: w3.ok, err: String(w3.error || '').slice(0, 120), type },
                runId: 'email-debug',
            });
            // #endregion
            if (w3.ok) return emailOk(res, w3);
        }
        const fsResult = await sendViaFormSubmitAll(type, mails, baseOrigin);
        // #region agent log
        agentDebugLog({
            hypothesisId: 'E3',
            location: 'api/send-booking-email.ts:formsubmit',
            message: 'formsubmit attempt',
            data: {
                ok: fsResult.ok,
                err: String(fsResult.error || '').slice(0, 160),
                needsActivation: !!fsResult.needsActivation,
                type,
            },
            runId: 'email-debug',
        });
        // #endregion
        if (fsResult.ok) return emailOk(res, fsResult);
        return emailFail(res, fsResult, 502);
    } catch (err: any) {
        console.error("send-booking-email API error:", err);
        return sendErr(res, "Szerver hiba", 500);
    }
}
