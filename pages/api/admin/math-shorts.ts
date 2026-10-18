import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { MathShortError, enqueueMathShort, mathShortAdminState, tickMathShorts } from '../../../server/mathShortVideo';
import { requireAdmin, sanitizeText } from '../../../utils/apiSecurity';

export const config = { maxDuration: 60 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
        if (req.method === 'POST') {
            const topic = sanitizeText(req.body?.topic, 80);
            if (!topic) return sendErr(res, 'Adj meg egy témát.', 400);
            await enqueueMathShort(topic, admin.uid);
            return sendOk(res, await mathShortAdminState());
        }
        if (req.method === 'GET') {
            await tickMathShorts();
            return sendOk(res, await mathShortAdminState());
        }
        return sendErr(res, 'Method not allowed', 405);
    } catch (e) {
        const status = e instanceof MathShortError ? e.status : 500;
        const message = e instanceof Error ? e.message : 'A short készítése nem sikerült.';
        return sendErr(res, message, status);
    }
}
