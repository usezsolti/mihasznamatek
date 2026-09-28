import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { runEmailBookingAgent } from '../../../server/emailBookingAgent';

export const config = { maxDuration: 60 };

const RUN_HOURS = new Set([12, 16, 22]);

function budapestHour(now = new Date()): number {
    const hour = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Budapest',
        hour: 'numeric',
        hourCycle: 'h23',
    }).format(now);
    return Number(hour);
}

export function isEmailAgentRunHour(now = new Date()): boolean {
    return RUN_HOURS.has(budapestHour(now));
}

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
    const authorized = cronAuthorized(req);
    // #region agent log
    fetch('http://127.0.0.1:7785/ingest/aea5f5c4-876a-4e2f-82d7-0264bfca90ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c04d6a'},body:JSON.stringify({sessionId:'c04d6a',runId:'mail-cron',hypothesisId:'H-auth',location:'pages/api/cron/email-booking-agent.ts',message:'cron hit',data:{method:req.method,authorized,hasSecret:Boolean(String(process.env.CRON_SECRET||'').trim())},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!authorized) {
        return sendErr(res, 'Cron titok hibás vagy hiányzik.', 401);
    }
    const force = String(req.query.force || '') === '1';
    if (!force && !isEmailAgentRunHour()) {
        return sendOk(res, { skipped: true, reason: 'Csak 12:00, 16:00 és 22:00 (Budapest).' });
    }
    try {
        const result = await runEmailBookingAgent();
        return sendOk(res, result);
    } catch (e: any) {
        return sendErr(res, e?.message || 'E-mail ügynök hiba', 500);
    }
}
