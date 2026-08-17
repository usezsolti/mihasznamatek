import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr } from '../../../server/http';

/**
 * POST /api/auth/admin-quick-login
 * Kikapcsolva: a nyilvános egykattintásos tanári belépés bárkit beengedett.
 * Használd a kliens oldali jelszavas tanári belépést.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    return sendErr(
        res,
        'A gyors tanári belépés ki van kapcsolva. Használd a jelszavas tanári belépést.',
        403
    );
}
