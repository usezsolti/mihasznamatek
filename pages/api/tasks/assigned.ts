import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../../server/jsonField';
import { isAllowedOrigin, requireAdmin, requireAuth, sanitizeText } from '../../../utils/apiSecurity';

type AssignedPayload = Record<string, unknown>;

function mapAssignedTask(row: {
    id: string;
    studentId: string;
    studentEmail: string | null;
    title: string;
    topicTitle: string | null;
    status: string;
    payload: unknown;
    createdAt: Date;
    updatedAt: Date;
}) {
    const payload = parseJsonField<AssignedPayload>(row.payload, {});
    return {
        id: row.id,
        taskId: String(payload.taskId || row.id),
        title: row.title,
        description: String(payload.description || ''),
        topicId: String(payload.topicId || ''),
        topicTitle: row.topicTitle || String(payload.topicTitle || ''),
        educationLevel: String(payload.educationLevel || ''),
        difficulty: String(payload.difficulty || ''),
        questions: Number(payload.questions || 0),
        timeLimit: Number(payload.timeLimit || 0),
        customQuestions: Array.isArray(payload.customQuestions) ? payload.customQuestions : [],
        studentId: row.studentId,
        studentEmail: row.studentEmail || '',
        studentName: String(payload.studentName || ''),
        status: row.status as 'assigned' | 'completed' | 'started',
        createdAt: row.createdAt.toISOString(),
        createdBy: String(payload.createdBy || ''),
    };
}

/**
 * GET  /api/tasks/assigned — current user's assigned tasks
 * POST /api/tasks/assigned — admin assign task
 * PATCH /api/tasks/assigned — update task status (owner or admin)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    if (req.method === 'GET') {
        const user = await requireAuth(req, res);
        if (!user) return;

        try {
            const email = user.email.trim().toLowerCase();
            const rows = await prisma.assignedTask.findMany({
                where: {
                    OR: [{ studentId: user.uid }, ...(email ? [{ studentEmail: email }] : [])],
                },
                orderBy: { createdAt: 'desc' },
                take: 200,
            });
            const map = new Map<string, ReturnType<typeof mapAssignedTask>>();
            for (const row of rows) {
                map.set(row.id, mapAssignedTask(row));
            }
            return sendOk(res, { tasks: Array.from(map.values()) });
        } catch (e: any) {
            console.error('tasks/assigned GET', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'POST') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
        const studentId = String(body.studentId || '').trim();
        const title = sanitizeText(body.title, 300);
        if (!studentId || !title) {
            return sendErr(res, 'Hiányzó diák vagy cím.', 400);
        }

        const payload: AssignedPayload = {
            taskId: String(body.taskId || ''),
            description: sanitizeText(body.description, 2000),
            topicId: String(body.topicId || ''),
            topicTitle: String(body.topicTitle || ''),
            educationLevel: String(body.educationLevel || ''),
            difficulty: String(body.difficulty || ''),
            questions: Number(body.questions || 0),
            timeLimit: Number(body.timeLimit || 0),
            customQuestions: Array.isArray(body.customQuestions) ? body.customQuestions : [],
            studentName: sanitizeText(body.studentName, 120),
            createdBy: admin.uid,
        };

        try {
            const row = await prisma.assignedTask.create({
                data: {
                    studentId,
                    studentEmail: String(body.studentEmail || '').trim().toLowerCase() || null,
                    title,
                    topicTitle: String(body.topicTitle || '') || null,
                    status: 'assigned',
                    payload: stringifyJsonField(payload),
                },
            });
            if (!payload.taskId) {
                payload.taskId = row.id;
                await prisma.assignedTask.update({
                    where: { id: row.id },
                    data: { payload: stringifyJsonField(payload) },
                });
            }
            return sendOk(res, { task: mapAssignedTask({ ...row, payload }) }, 201);
        } catch (e: any) {
            console.error('tasks/assigned POST', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'PATCH') {
        const user = await requireAuth(req, res);
        if (!user) return;

        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
        const id = String(body.id || '').trim();
        const status = String(body.status || '').trim();
        if (!id || !status) return sendErr(res, 'Hiányzó id vagy status.', 400);
        if (!['assigned', 'started', 'completed'].includes(status)) {
            return sendErr(res, 'Érvénytelen status.', 400);
        }

        try {
            const existing = await prisma.assignedTask.findUnique({ where: { id } });
            if (!existing) return sendErr(res, 'Feladat nem található.', 404);

            const isOwner = existing.studentId === user.uid;
            const isAdmin = user.role === 'admin';
            if (!isOwner && !isAdmin) {
                return sendErr(res, 'Nincs jogosultság.', 403);
            }

            const row = await prisma.assignedTask.update({
                where: { id },
                data: { status },
            });
            return sendOk(res, { task: mapAssignedTask(row) });
        } catch (e: any) {
            console.error('tasks/assigned PATCH', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    return sendErr(res, 'Method not allowed', 405);
}
