import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr } from '../../../server/http';

/** GET /api/backend/firestore-rules-text — Firebase removed. */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }
    return sendErr(res, 'Firebase / Firestore rules export removed. Use Prisma + Auth.js.', 410);
}
