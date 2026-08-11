import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { sendErr, sendOk } from '../../../server/http';
import { requireAdmin } from '../../../utils/apiSecurity';

/**
 * GET /api/backend/firestore-rules-text
 * Csak admin + nem production (vagy ALLOW_RULES_EXPORT=1).
 * Envelope: { ok, data: { rules } }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }

    const allowExport =
        process.env.NODE_ENV !== 'production' ||
        String(process.env.ALLOW_RULES_EXPORT || '') === '1';
    if (!allowExport) {
        return sendErr(res, 'Not found', 404);
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
        const rulesPath = path.join(process.cwd(), 'firestore.rules');
        const rules = fs.readFileSync(rulesPath, 'utf8');
        res.setHeader('Cache-Control', 'no-store');
        return sendOk(res, { rules });
    } catch (e: any) {
        return sendErr(res, String(e?.message || e), 500);
    }
}
