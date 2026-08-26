import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getFirebaseAdmin } from '../../../server/firebaseAdmin';
import { consumeEmailVerificationToken } from '../../../server/emailVerificationStore';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../utils/apiSecurity';
import { agentDebugLog } from '../../../utils/agentDebugLog';

/**
 * POST /api/auth/confirm-email-verification
 * body: { token }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Origin nem engedélyezett', 403);

    const ip = getClientIp(req);
    const rl = rateLimit(`confirm-verify:${ip}`, 20, 60 * 60 * 1000);
    if (!rl.ok) return sendErr(res, 'Túl sok próbálkozás.', 429);

    const token = String(req.body?.token || '').trim();
    if (!token || token.length < 16) return sendErr(res, 'Érvénytelen token.', 400);

    const consumed = consumeEmailVerificationToken(token);
    if (!consumed) {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H5',
            location: 'api/auth/confirm-email-verification.ts',
            message: 'invalid or expired token',
            data: { ok: false },
            runId: 'verify-from-name',
        });
        // #endregion
        return sendErr(res, 'A link lejárt vagy érvénytelen. Kérj új megerősítő levelet.', 400);
    }

    const admin = getFirebaseAdmin();
    if (admin) {
        try {
            await admin.auth().updateUser(consumed.uid, { emailVerified: true });
        } catch (e: any) {
            console.warn('confirm-email-verification admin updateUser', e?.message || e);
        }
    }

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H4',
        location: 'api/auth/confirm-email-verification.ts:ok',
        message: 'email verified via custom token',
        data: { ok: true, hasAdmin: Boolean(admin) },
        runId: 'verify-from-name',
    });
    // #endregion

    return sendOk(res, { verified: true });
}
