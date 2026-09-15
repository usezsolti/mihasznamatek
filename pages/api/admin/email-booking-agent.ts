import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { extractBearerToken, requireAdmin } from '../../../utils/apiSecurity';
import {
    isEmailAgentEnabled,
    listEmailAgentThreads,
    releaseEmailHold,
    runEmailBookingAgent,
    setEmailAgentEnabled,
    withEmailAgentAuth,
} from '../../../server/emailBookingAgent';
import { gmailImapReady } from '../../../server/gmailImap';

export const config = { maxDuration: 60 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const token = extractBearerToken(req) || '';
    return withEmailAgentAuth(token, () => handle(req, res));
}

async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const [enabled, threads] = await Promise.all([
                isEmailAgentEnabled(),
                listEmailAgentThreads(40),
            ]);
            return sendOk(res, {
                enabled,
                imapReady: gmailImapReady(),
                threads,
            });
        } catch (e: any) {
            return sendErr(res, e?.message || 'Betöltés sikertelen', 500);
        }
    }

    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }

    const action = String(req.body?.action || '');
    try {
        if (action === 'enable') {
            await setEmailAgentEnabled(true);
            return sendOk(res, { enabled: true });
        }
        if (action === 'disable') {
            await setEmailAgentEnabled(false);
            return sendOk(res, { enabled: false });
        }
        if (action === 'run') {
            const result = await runEmailBookingAgent();
            return sendOk(res, result);
        }
        if (action === 'release') {
            const threadId = String(req.body?.threadId || '');
            if (!threadId) return sendErr(res, 'Hiányzó szál.', 400);
            await releaseEmailHold(threadId);
            return sendOk(res, { released: true });
        }
        return sendErr(res, 'Ismeretlen action.', 400);
    } catch (e: any) {
        return sendErr(res, e?.message || 'Művelet sikertelen', 500);
    }
}
