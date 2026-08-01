import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import {
    ADMIN_BOOKING_EMAIL,
    BookingEmailType,
    BookingPayload,
    EmailSendResult,
    buildMailsForType,
    resolveSiteOrigin,
    sendViaFormSubmit,
} from "../../utils/bookingNotify";

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

async function sendViaGmail(mails: MailItem[]): Promise<EmailSendResult> {
    const user = process.env.GMAIL_USER || ADMIN_BOOKING_EMAIL;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!pass) {
        return { ok: false, error: "Nincs GMAIL_APP_PASSWORD beállítva" };
    }

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
        console.error("Gmail SMTP error:", err);
        return {
            ok: false,
            provider: "gmail",
            error: err?.message || "Gmail küldés sikertelen",
        };
    }
}

/** Web3Forms: admin értesítés (a kulcshoz tartozó e-mailre). Diák levelekhez Gmail kell. */
async function sendViaWeb3Forms(mails: MailItem[]): Promise<EmailSendResult> {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
        return { ok: false, error: "Nincs WEB3FORMS_ACCESS_KEY" };
    }

    try {
        let sent = 0;
        for (const mail of mails) {
            // Web3Forms alapból a regisztrált admin címre küld; a diákot replyto/cc mezőkkel jelezzük
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    subject: mail.subject,
                    from_name: "Mihaszna Matek",
                    email: mail.replyTo || mail.to,
                    message: mail.text,
                    to_email: mail.to,
                    replyto: mail.replyTo || mail.to,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
                sent += 1;
            } else {
                console.error("Web3Forms failed:", data);
            }
        }
        if (sent > 0) {
            return {
                ok: true,
                provider: "web3forms",
                warning:
                    sent < mails.length
                        ? "Részben elküldve Web3Forms-szal. Diák levelekhez Gmail App Password ajánlott."
                        : undefined,
            };
        }
        return { ok: false, provider: "web3forms", error: "Web3Forms küldés sikertelen" };
    } catch (err: any) {
        return {
            ok: false,
            provider: "web3forms",
            error: err?.message || "Web3Forms hálózati hiba",
        };
    }
}

async function sendViaFormSubmitAll(
    type: BookingEmailType,
    mails: MailItem[],
    baseOrigin: string
): Promise<EmailSendResult> {
    const adminMails = mails.filter(
        (m) => m.to.toLowerCase() === ADMIN_BOOKING_EMAIL.toLowerCase()
    );
    const otherMails = mails.filter(
        (m) => m.to.toLowerCase() !== ADMIN_BOOKING_EMAIL.toLowerCase()
    );

    let adminOk = adminMails.length === 0;
    let needsActivation = false;
    let lastError = "";

    for (const mail of adminMails) {
        const result = await sendViaFormSubmit(mail, baseOrigin);
        if (result.ok) adminOk = true;
        else {
            needsActivation = needsActivation || !!result.needsActivation;
            lastError = result.error || lastError;
        }
    }

    let studentOk = otherMails.length === 0;
    if (adminOk || adminMails.length === 0) {
        let anyStudent = false;
        for (const mail of otherMails) {
            const result = await sendViaFormSubmit(mail, baseOrigin);
            if (result.ok) anyStudent = true;
            else {
                needsActivation = needsActivation || !!result.needsActivation;
                lastError = result.error || lastError;
            }
        }
        studentOk = anyStudent || otherMails.length === 0;
    }

    if (type === "admin_new") {
        if (adminOk) {
            return {
                ok: true,
                provider: "formsubmit",
                warning: studentOk
                    ? undefined
                    : "Admin értesítve. Diák visszaigazoláshoz állíts be GMAIL_APP_PASSWORD-öt (helyben és a hostingon is).",
            };
        }
        return {
            ok: false,
            provider: "formsubmit",
            needsActivation,
            error:
                lastError ||
                "Admin e-mail nem ment. FormSubmit aktiválás vagy GMAIL_APP_PASSWORD kell.",
        };
    }

    if (studentOk || adminOk) {
        return { ok: true, provider: "formsubmit" };
    }

    return {
        ok: false,
        provider: "formsubmit",
        needsActivation,
        error: lastError || "E-mail küldés sikertelen. Állíts be GMAIL_APP_PASSWORD-öt.",
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { type, booking, origin }: Body = req.body || {};

    if (!type || !booking?.id || !booking?.customerEmail) {
        return res.status(400).json({ ok: false, error: "Hiányzó type vagy booking adat" });
    }

    const allowed: BookingEmailType[] = [
        "admin_new",
        "student_approved",
        "student_rejected",
        "booking_cancelled",
        "lesson_reminder",
    ];
    if (!allowed.includes(type)) {
        return res.status(400).json({ ok: false, error: "Érvénytelen e-mail típus" });
    }

    // Élesen: NEXT_PUBLIC_SITE_URL / host header → mihasznamatek.hu
    // Lokálisan: a böngésző origin (localhost), ha nincs SITE_URL
    const baseOrigin = resolveSiteOrigin({
        clientOrigin: origin,
        hostHeader: req.headers["x-forwarded-host"] || req.headers.host,
        protoHeader: req.headers["x-forwarded-proto"],
    });

    const mails = buildMailsForType(type, booking, baseOrigin);

    try {
        // 1) Gmail SMTP — helyben ÉS élesen ugyanúgy (Vercel/Netlify env változók)
        if (process.env.GMAIL_APP_PASSWORD) {
            const gmailResult = await sendViaGmail(mails);
            if (gmailResult.ok) {
                return res.status(200).json(gmailResult);
            }
            console.warn("Gmail failed, trying fallbacks:", gmailResult.error);
        }

        // 2) Web3Forms — szintén env kulccsal, hostingon is működik
        if (process.env.WEB3FORMS_ACCESS_KEY) {
            const w3 = await sendViaWeb3Forms(mails);
            if (w3.ok) {
                return res.status(200).json(w3);
            }
            console.warn("Web3Forms failed:", w3.error);
        }

        // 3) FormSubmit fallback
        const fsResult = await sendViaFormSubmitAll(type, mails, baseOrigin);
        if (fsResult.ok) {
            return res.status(200).json(fsResult);
        }
        return res.status(502).json(fsResult);
    } catch (err: any) {
        console.error("send-booking-email API error:", err);
        return res.status(500).json({ ok: false, error: err?.message || "Szerver hiba" });
    }
}
