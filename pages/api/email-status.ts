import type { NextApiRequest, NextApiResponse } from 'next';
import { getClientIp, rateLimit, requireAdmin } from '../../utils/apiSecurity';
import { sendErr, sendOk } from '../../server/http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const ip = getClientIp(req);
    const rl = rateLimit(`email-status:${ip}`, 60, 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok kérés.', 429);
    }

    const hasResend = String(process.env.RESEND_API_KEY || '').trim().startsWith('re_');
    const hasGmail = Boolean(process.env.GMAIL_APP_PASSWORD?.trim());
    const hasWeb3 = Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim());

    return sendOk(res, {
        ready: hasResend || hasGmail || hasWeb3,
        mode: hasResend ? 'resend' : hasGmail ? 'gmail' : hasWeb3 ? 'web3forms' : 'none',
        hasResend,
        hasGmail,
        hasWeb3,
        from: process.env.EMAIL_FROM || 'info@mihasznamatek.hu',
        siteConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
        hint: hasResend
            ? 'Resend aktív, feladó a hitelesített domain.'
            : hasGmail
              ? 'Gmail SMTP aktív.'
              : 'Állítsd be a RESEND_API_KEY-t a szerver env-ben.',
    });
}
