import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../../server/jsonField';
import { isAllowedOrigin, requireAdmin, requireAuth, sanitizeText } from '../../../utils/apiSecurity';
import { isAdminEmail } from '../../../utils/admin';

function mapCustomTask(row: {
    id: string;
    ownerId: string;
    title: string;
    payload: unknown;
    createdAt: Date;
    updatedAt: Date;
}) {
    const payload = parseJsonField<Record<string, unknown>>(row.payload, {});
    return {
        id: row.id,
        ownerId: row.ownerId,
        title: row.title,
        description: String(payload.description || ''),
        difficulty: String(payload.difficulty || 'medium'),
        topic: String(payload.topic || payload.topicTitle || ''),
        topicId: String(payload.topicId || ''),
        educationLevel: String(payload.educationLevel || 'highschool'),
        erettsegiLevel: payload.erettsegiLevel || null,
        subjectId: payload.subjectId || null,
        questions: Number(payload.questions || 10),
        timeLimit: Number(payload.timeLimit || 30),
        customQuestions: Array.isArray(payload.customQuestions) ? payload.customQuestions : [],
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

function buildPayload(body: Record<string, unknown>): Record<string, unknown> {
    return {
        description: sanitizeText(body.description, 2000),
        difficulty: String(body.difficulty || 'medium'),
        topic: String(body.topic || body.topicTitle || ''),
        topicId: String(body.topicId || ''),
        educationLevel: String(body.educationLevel || 'highschool'),
        erettsegiLevel: body.erettsegiLevel || null,
        subjectId: body.subjectId || null,
        questions: Number(body.questions || body.customQuestions ? (body.customQuestions as unknown[]).length : 10) || 10,
        timeLimit: Number(body.timeLimit || 30),
        customQuestions: Array.isArray(body.customQuestions) ? body.customQuestions : [],
    };
}

/**
 * GET    /api/tasks/custom — list custom tasks (admin: all; user: own)
 * POST   /api/tasks/custom — create (admin)
 * PUT    /api/tasks/custom — update by id (admin)
 * DELETE /api/tasks/custom — delete by id (admin)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const user = await requireAuth(req, res);
    if (!user) return;

    const isAdmin = user.role === 'admin' || isAdminEmail(user.email);

    if (req.method === 'GET') {
        try {
            const rows = await prisma.customTask.findMany({
                where: isAdmin ? undefined : { ownerId: user.uid },
                orderBy: { updatedAt: 'desc' },
                take: 500,
            });
            return sendOk(res, { tasks: rows.map(mapCustomTask) });
        } catch (e: any) {
            console.error('tasks/custom GET', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'POST') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
        const title = sanitizeText(body.title, 300);
        if (!title) return sendErr(res, 'Hiányzó cím.', 400);

        const requestedId = String(body.id || '').trim();
        const payload = buildPayload(body);

        try {
            const row = await prisma.customTask.create({
                data: {
                    ...(requestedId ? { id: requestedId } : {}),
                    ownerId: admin.uid,
                    title,
                    payload: stringifyJsonField(payload),
                },
            });
            return sendOk(res, { task: mapCustomTask(row) }, 201);
        } catch (e: any) {
            console.error('tasks/custom POST', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'PUT') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
        const id = String(body.id || '').trim();
        if (!id) return sendErr(res, 'Hiányzó id.', 400);
        if (id.startsWith('cat-')) return sendErr(res, 'Katalógus feladat nem módosítható.', 400);

        const title = sanitizeText(body.title, 300);
        const payload = buildPayload(body);

        try {
            const existing = await prisma.customTask.findUnique({ where: { id } });
            if (!existing) return sendErr(res, 'Feladat nem található.', 404);

            const row = await prisma.customTask.update({
                where: { id },
                data: {
                    title: title || existing.title,
                    payload: stringifyJsonField(payload),
                },
            });
            return sendOk(res, { task: mapCustomTask(row) });
        } catch (e: any) {
            console.error('tasks/custom PUT', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'DELETE') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;

        const id = String(req.query.id || (req.body as { id?: string })?.id || '').trim();
        if (!id) return sendErr(res, 'Hiányzó id.', 400);
        if (id.startsWith('cat-')) return sendErr(res, 'Katalógus feladat nem törölhető.', 400);

        try {
            await prisma.customTask.delete({ where: { id } });
            return sendOk(res, { deleted: true });
        } catch (e: any) {
            console.error('tasks/custom DELETE', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    return sendErr(res, 'Method not allowed', 405);
}
