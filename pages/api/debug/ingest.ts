import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';

/**
 * Debug NDJSON ingest — csak developmentben, és csak ha ALLOW_DEBUG_INGEST=1.
 * Prod-ban mindig 404.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const allowed =
        process.env.NODE_ENV !== 'production' &&
        String(process.env.ALLOW_DEBUG_INGEST || '') === '1';

    if (!allowed) {
        return sendErr(res, 'Not found', 404);
    }
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }

    // Dev-only: ne írjunk tetszőleges fájlba auth nélkül — csak stdout
    console.info('[debug-ingest]', JSON.stringify(req.body)?.slice(0, 500));
    return sendOk(res, { ingested: true });
}
