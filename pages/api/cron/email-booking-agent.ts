import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { runEmailBookingAgent } from '../../../server/emailBookingAgent';

export const config = { maxDuration: 60 };

function cronAuthorized(req: NextApiRequest): boolean {
    const secret = String(process.env.CRON_SECRET || '').trim();
    if (!secret) return false;
    const auth = String(req.headers.authorization || '');
    return auth === `Bearer ${secret}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!cronAuthorized(req)) {
        return sendErr(res, 'Cron titok hibás vagy hiányzik.', 401);
    }
    try {
        const result = await runEmailBookingAgent();
        return sendOk(res, result);
    } catch (e: any) {
        return sendErr(res, e?.message || 'E-mail ügynök hiba', 500);
    }
}
