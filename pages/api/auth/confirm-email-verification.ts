import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { confirmEmailVerificationToken } from '../../../server/confirmEmailVerification';
import { getClientIp, rateLimit } from '../../../utils/apiSecurity';

/**
 * GET/POST /api/auth/confirm-email-verification
 * A levélből jövő kattintásnak origin nélkül is mennie kell.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`confirm-verify:${ip}`, 40, 60 * 60 * 1000);
    if (!rl.ok) return sendErr(res, 'Túl sok próbálkozás.', 429);

    const token = req.method === 'GET' ? req.query.token : req.body?.token;
    const result = await confirmEmailVerificationToken(token);
    if (!result.ok) return sendErr(res, result.error, 400);
    return sendOk(res, { verified: true, email: result.email });
}
