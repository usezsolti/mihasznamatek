import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr } from '../../../server/http';

/**
 * @deprecated Use POST /api/auth/admin-session-login instead.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    return sendErr(
        res,
        'Deprecated. Használd a POST /api/auth/admin-session-login végpontot.',
        410
    );
}
