import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../../server/http';
import { prisma } from '../../../../server/prisma';
import { isAllowedOrigin, requireAdmin, sanitizeText } from '../../../../utils/apiSecurity';

/**
 * GET /api/admin/teacher-notes/[studentId]
 * PUT /api/admin/teacher-notes/[studentId]
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'PUT') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const studentId = String(req.query.studentId || '').trim();
    if (!studentId) return sendErr(res, 'Hiányzó diák azonosító.', 400);

    try {
        if (req.method === 'GET') {
            const note = await prisma.teacherNote.findUnique({ where: { studentId } });
            return sendOk(res, { text: note?.text || '' });
        }

        const text = sanitizeText((req.body as { text?: string })?.text, 8000);
        await prisma.teacherNote.upsert({
            where: { studentId },
            create: { studentId, text },
            update: { text },
        });
        return sendOk(res, { text });
    } catch (e: any) {
        console.error('admin/teacher-notes/[studentId]', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
