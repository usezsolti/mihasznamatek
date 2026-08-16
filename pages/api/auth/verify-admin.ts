import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { isAdminEmail } from '../../../utils/admin';
import { getClientIp, isAllowedOrigin, rateLimit, requireAdmin } from '../../../utils/apiSecurity';

/**
 * POST /api/auth/verify-admin
 * Auth.js session cookie — admin role / email check.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`verify-admin:${ip}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok próbálkozás.', 429);
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const email = (admin.email || '').toLowerCase();
    const ok = admin.role === 'admin' || isAdminEmail(email);
    return sendOk(res, { ok, email: ok ? email : undefined });
}
