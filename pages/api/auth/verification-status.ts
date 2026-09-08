import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import {
    emailFromVerifiedSession,
    isEmailVerified,
    isUidEmailVerified,
} from '../../../server/emailVerificationStore';
import { isAllowedOrigin, requireAuth } from '../../../utils/apiSecurity';

/** GET/POST /api/auth/verification-status */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) return sendErr(res, 'Origin nem engedélyezett', 403);

    const user = await requireAuth(req, res);
    if (!user) return;

    const cookie = String(req.headers.cookie || '');
    const session = cookie
        .split(';')
        .map((p) => p.trim())
        .find((p) => p.startsWith('mm_email_verified='))
        ?.slice('mm_email_verified='.length);
    const cookieEmail = session ? emailFromVerifiedSession(session) : null;
    const cookieOk = Boolean(cookieEmail && cookieEmail === user.email);
    const appVerified = isUidEmailVerified(user.uid) || isEmailVerified(user.email) || cookieOk;
    return sendOk(res, {
        firebaseVerified: Boolean(user.emailVerified),
        appVerified,
        verified: Boolean(user.emailVerified) || appVerified,
    });
}
