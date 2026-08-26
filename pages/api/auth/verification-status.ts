import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { isUidEmailVerified } from '../../../server/emailVerificationStore';
import { isAllowedOrigin, requireAuth } from '../../../utils/apiSecurity';

/** GET/POST /api/auth/verification-status */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) return sendErr(res, 'Origin nem engedélyezett', 403);

    const user = await requireAuth(req, res);
    if (!user) return;

    const appVerified = isUidEmailVerified(user.uid);
    return sendOk(res, {
        firebaseVerified: Boolean(user.emailVerified),
        appVerified,
        verified: Boolean(user.emailVerified) || appVerified,
    });
}
