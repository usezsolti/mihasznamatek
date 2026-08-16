import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../../server/http';
import { prisma } from '../../../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../../../server/jsonField';
import { isAdminEmail } from '../../../../utils/admin';
import { isAllowedOrigin, requireAdmin, sanitizeText } from '../../../../utils/apiSecurity';
import type { TeacherAdminMeta } from '../../../../utils/teacherConsole';

/**
 * GET /api/admin/students/[id] — student profile for teacher console
 * PATCH /api/admin/students/[id] — update teacherAdmin meta
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'PATCH') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const studentId = String(req.query.id || '').trim();
    if (!studentId) return sendErr(res, 'Hiányzó diák azonosító.', 400);

    try {
        const user = await prisma.user.findUnique({
            where: { id: studentId },
            include: { socialProfile: true },
        });
        if (!user) return sendErr(res, 'Diák nem található.', 404);
        if (user.email && isAdminEmail(user.email)) {
            return sendErr(res, 'Admin fiók.', 403);
        }

        if (req.method === 'GET') {
            const social = user.socialProfile;
            return sendOk(res, {
                uid: user.id,
                name: user.name || user.email?.split('@')[0] || 'Diák',
                email: user.email || '',
                educationLevel: user.educationLevel || '',
                photoURL: user.image || social?.photoURL || '',
                username: social?.username || '',
                bio: social?.bio || '',
                createdAtMs: user.createdAt.getTime(),
                updatedAtMs: user.updatedAt.getTime(),
                teacherAdmin: parseJsonField(user.teacherAdmin, null),
            });
        }

        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const meta = body.teacherAdmin as TeacherAdminMeta | undefined;
        if (!meta) return sendErr(res, 'Hiányzó teacherAdmin.', 400);

        const paymentStatus = String(meta.paymentStatus || '');
        const attendanceStatus = String(meta.attendanceStatus || 'unknown');

        const teacherAdmin = {
            paymentStatus:
                paymentStatus === 'unpaid' ||
                paymentStatus === 'transfer_pending' ||
                paymentStatus === 'paid'
                    ? paymentStatus
                    : '',
            paymentNote: sanitizeText(meta.paymentNote, 500),
            attendanceStatus:
                attendanceStatus === 'present' ||
                attendanceStatus === 'absent' ||
                attendanceStatus === 'excused'
                    ? attendanceStatus
                    : 'unknown',
            attendanceNote: sanitizeText(meta.attendanceNote, 500),
            updatedBy: admin.uid,
            updatedAtMs: Date.now(),
        };

        await prisma.user.update({
            where: { id: studentId },
            data: { teacherAdmin: stringifyJsonField(teacherAdmin) },
        });

        return sendOk(res, { teacherAdmin });
    } catch (e: any) {
        console.error('admin/students/[id]', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
