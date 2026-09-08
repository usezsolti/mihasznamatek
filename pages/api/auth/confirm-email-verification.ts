import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getAdminDb, getFirebaseAdmin } from '../../../server/firebaseAdmin';
import {
    consumeEmailVerificationToken,
    markEmailVerified,
    readEmailVerifyToken,
} from '../../../server/emailVerificationStore';
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

    const signed = readEmailVerifyToken(token);
    const consumed = signed
        ? { uid: '', email: signed.email }
        : consumeEmailVerificationToken(token);
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

    markEmailVerified(consumed.email);
    const admin = getFirebaseAdmin();
    if (admin) {
        try {
            if (consumed.uid) {
                await admin.auth().updateUser(consumed.uid, { emailVerified: true });
            } else {
                const found = await admin.auth().getUserByEmail(consumed.email);
                await admin.auth().updateUser(found.uid, { emailVerified: true });
            }
        } catch (e: any) {
            console.warn('confirm-email-verification admin updateUser', e?.message || e);
        }
        const db = getAdminDb();
        if (db) {
            await db
                .collection('auth_users')
                .doc(consumed.email.replace(/[^a-z0-9@._+-]/g, '_'))
                .set({ emailVerified: true, emailVerifiedAt: new Date().toISOString() }, { merge: true })
                .catch(() => undefined);
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
