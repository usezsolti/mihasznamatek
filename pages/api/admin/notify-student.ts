import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { ADMIN_BOOKING_EMAIL, sendViaFormSubmit } from '../../../utils/bookingNotify';
import {
    getClientIp,
    isAllowedOrigin,
    isValidEmail,
    rateLimit,
    requireAdmin,
    sanitizeText,
    secureSiteOrigin,
} from '../../../utils/apiSecurity';
import { sendErr, sendOk } from '../../../server/http';

/**
 * POST /api/admin/notify-student
 * Body: { to, studentName?, subject, message }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);

    const ip = getClientIp(req);
    if (!rateLimit(`notify-student:${ip}`, 30, 60_000)) {
        return sendErr(res, 'Túl sok kérés', 429);
    }
    if (!isAllowedOrigin(req)) return sendErr(res, 'Origin nem engedélyezett', 403);

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const to = sanitizeText(String(req.body?.to || ''), 200).toLowerCase();
    const studentName = sanitizeText(String(req.body?.studentName || ''), 120);
    const subject = sanitizeText(String(req.body?.subject || ''), 200);
    const message = sanitizeText(String(req.body?.message || ''), 4000);
    if (!isValidEmail(to) || !subject || !message) {
        return sendErr(res, 'Érvénytelen címzett / tárgy / üzenet', 400);
    }

    const text = [
        studentName ? `Szia ${studentName}!` : 'Szia!',
        '',
        message,
        '',
        '— Mihaszna Matek',
    ].join('\n');

    const mail = {
        to,
        subject,
        text,
        replyTo: ADMIN_BOOKING_EMAIL,
        cc: ADMIN_BOOKING_EMAIL,
    };

    const gmailUser = process.env.GMAIL_USER || ADMIN_BOOKING_EMAIL;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (gmailPass) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: gmailUser, pass: gmailPass },
            });
            await transporter.sendMail({
                from: `"Mihaszna Matek" <${gmailUser}>`,
                to: mail.to,
                cc: mail.cc,
                replyTo: mail.replyTo,
                subject: mail.subject,
                text: mail.text,
            });
            return sendOk(res, { provider: 'gmail' });
        } catch (err: any) {
            /* fallback */
        }
    }

    const origin = secureSiteOrigin() || 'https://mihasznamatek.hu';
    const fallback = await sendViaFormSubmit(mail, origin);
    if (fallback.ok) return sendOk(res, { provider: fallback.provider || 'formsubmit' });
    return sendErr(res, fallback.error || 'Értesítés küldése sikertelen', 502);
}
