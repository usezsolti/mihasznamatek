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

    const hasGmail = Boolean(process.env.GMAIL_APP_PASSWORD?.trim());
    const hasWeb3 = Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim());

    return sendOk(res, {
        ready: hasGmail || hasWeb3,
        mode: hasGmail ? 'gmail' : hasWeb3 ? 'web3forms' : 'none',
        hasGmail,
        hasWeb3,
        siteConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
        hint: hasGmail
            ? 'Gmail SMTP aktív.'
            : 'Állítsd be a GMAIL_APP_PASSWORD-öt a szerver env-ben.',
    });
}
