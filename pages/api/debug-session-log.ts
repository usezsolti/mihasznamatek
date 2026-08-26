import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * Same-origin debug sink (browser CORS-safe).
 * Forwards to the session ingest when possible and always appends NDJSON locally.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    const payload = {
        sessionId: 'c04d6a',
        ...(typeof req.body === 'object' && req.body ? req.body : {}),
        timestamp: Date.now(),
    };

    try {
        const logPath = path.join(process.cwd(), 'debug-c04d6a.log');
        fs.appendFileSync(logPath, JSON.stringify(payload) + '\n', 'utf8');
    } catch {
        /* ignore */
    }

    try {
        await fetch('http://127.0.0.1:7785/ingest/aea5f5c4-876a-4e2f-82d7-0264bfca90ad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': 'c04d6a',
            },
            body: JSON.stringify(payload),
        });
    } catch {
        /* ignore */
    }

    res.status(204).end();
}
