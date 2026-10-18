import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { MathShortError, listReadyMathShorts } from '../../server/mathShortVideo';
import { isAllowedOrigin, requireAuth } from '../../utils/apiSecurity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
        const shorts = await listReadyMathShorts(40);
        return sendOk(res, { shorts });
    } catch (e) {
        const status = e instanceof MathShortError ? e.status : 500;
        const message = e instanceof Error ? e.message : 'A shortok betöltése nem sikerült.';
        return sendErr(res, message, status);
    }
}
