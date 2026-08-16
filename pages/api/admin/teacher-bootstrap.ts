import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { bookingToPayload } from '../../../server/bookingMappers';
import { parseJsonField } from '../../../server/jsonField';import { isAdminEmail } from '../../../utils/admin';
import { requireAdmin } from '../../../utils/apiSecurity';

/**
 * GET /api/admin/teacher-bootstrap
 * Diáklista + pending foglalások + teacher notes + assigned tasks (Prisma).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const [users, pendingRows, notes, tasks] = await Promise.all([
            prisma.user.findMany({
                where: { role: { not: 'admin' } },
                orderBy: { updatedAt: 'desc' },
                take: 200,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    educationLevel: true,
                    image: true,
                    updatedAt: true,
                    createdAt: true,
                },
            }),
            prisma.booking.findMany({
                where: { status: 'pending' },
                orderBy: { submittedAt: 'desc' },
                take: 100,
            }),
            prisma.teacherNote.findMany({ take: 200 }),
            prisma.assignedTask.findMany({
                orderBy: { updatedAt: 'desc' },
                take: 300,
            }),
        ]);

        const students = users
            .filter((u) => {
                const email = String(u.email || '').trim().toLowerCase();
                return email && !isAdminEmail(email);
            })
            .map((u) => ({
                uid: u.id,
                name: String(u.name || u.email?.split('@')[0] || 'Diák'),
                email: String(u.email || ''),
                educationLevel: String(u.educationLevel || ''),
                photoURL: String(u.image || ''),
                lastSeenMs: u.updatedAt.getTime() || u.createdAt.getTime(),
            }))
            .sort((a, b) => (b.lastSeenMs || 0) - (a.lastSeenMs || 0));

        const pending = pendingRows.map(bookingToPayload);

        const teacherNotes: Record<string, string> = {};
        notes.forEach((n) => {
            teacherNotes[n.studentId] = n.text;
        });

        const assignedTasks = tasks.map((t) => ({
            id: t.id,
            studentId: t.studentId,
            studentEmail: t.studentEmail || '',
            title: t.title,
            topicTitle: t.topicTitle || '',
            status: t.status,
            payload: parseJsonField(t.payload, {}),
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
        }));

        return sendOk(res, {
            students,
            pending,
            teacherNotes,
            assignedTasks,
            source: 'prisma' as const,
            permissionDenied: false,
            hasAdminSdk: false,
        });
    } catch (e: any) {
        console.error('admin/teacher-bootstrap', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
