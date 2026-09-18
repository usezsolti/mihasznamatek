import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { loadStudentProgress } from '../../../server/studentProgress';
import { requireAdmin } from '../../../utils/apiSecurity';

/**
 * GET /api/admin/student-progress?uid=
 * Diák XP, témakörök és minden játékfutam — Admin SDK ha van.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    const uid = String(req.query.uid || '').trim();
    if (!uid) return sendErr(res, 'Hiányzik a diák azonosító.', 400);

    const authHeader = String(req.headers.authorization || '');
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    try {
        const data = await loadStudentProgress({ uid, token });
        return sendOk(res, data);
    } catch (e: any) {
        return sendErr(res, String(e?.message || e), 500);
    }
}
