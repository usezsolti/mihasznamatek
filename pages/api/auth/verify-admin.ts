import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getFirebaseAdmin } from '../../../server/firebaseAdmin';
import { isAdminEmail } from '../../../utils/admin';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../utils/apiSecurity';

/**
 * POST /api/auth/verify-admin
 * Authorization: Bearer <Firebase ID token>
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

    const authHeader = String(req.headers.authorization || '');
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token) {
        return sendErr(res, 'Hiányzó token.', 401);
    }

    try {
        const admin = getFirebaseAdmin();
        if (!admin) {
            // Local without Admin SDK: cannot cryptographically verify — report unknown
            return sendOk(res, { ok: null, reason: 'no-admin-sdk' });
        }
        const decoded = await admin.auth().verifyIdToken(token);
        const email = String(decoded.email || '').toLowerCase();
        const ok = isAdminEmail(email);
        return sendOk(res, { ok, email: ok ? email : undefined });
    } catch (e: any) {
        return sendErr(res, e?.message || 'Token ellenőrzés sikertelen.', 401);
    }
}
