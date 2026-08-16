import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { prisma } from '../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../server/jsonField';
import { isAllowedOrigin, requireAdmin, requireAuth } from '../../utils/apiSecurity';

function mapGameResult(row: {
    id: string;
    userId: string;
    topicId: string | null;
    score: number | null;
    payload: unknown;
    createdAt: Date;
}) {
    const payload = parseJsonField<Record<string, unknown>>(row.payload, {});
    return {
        id: row.id,
        userId: row.userId,
        uid: row.userId,
        topicId: row.topicId || String(payload.topicId || payload.topic || ''),
        topic: String(payload.topic || payload.topicTitle || row.topicId || ''),
        topicTitle: String(payload.topicTitle || ''),
        correct: Number(payload.correct ?? 0),
        total: Number(payload.total ?? 0),
        score: row.score ?? Number(payload.score ?? 0),
        xpEarned: Number(payload.xpEarned ?? 0),
        educationLevel: String(payload.educationLevel || ''),
        gameMode: String(payload.gameMode || ''),
        level: payload.level,
        grade: payload.grade,
        subject: payload.subject,
        worksheet: payload.worksheet,
        stagesCleared: payload.stagesCleared,
        perfect: payload.perfect,
        completedAt: row.createdAt.toISOString(),
        ...payload,
    };
}

/**
 * GET  /api/game-results — list for current user (?userId= admin only)
 * POST /api/game-results — create result for current user
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const user = await requireAuth(req, res);
    if (!user) return;

    if (req.method === 'GET') {
        const queryUserId = String(req.query.userId || '').trim();
        let uid = user.uid;
        if (queryUserId && queryUserId !== user.uid) {
            const admin = await requireAdmin(req, res);
            if (!admin) return;
            uid = queryUserId;
        }

        try {
            const rows = await prisma.gameResult.findMany({
                where: { userId: uid },
                orderBy: { createdAt: 'desc' },
                take: 200,
            });
            return sendOk(res, { results: rows.map(mapGameResult) });
        } catch (e: any) {
            console.error('game-results GET', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'POST') {
        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
        const topicId = String(body.topicId || body.topic || '').trim() || null;
        const score = Number(body.score ?? 0);

        const payload: Record<string, unknown> = { ...body };
        delete payload.userId;
        delete payload.uid;

        try {
            const row = await prisma.gameResult.create({
                data: {
                    userId: user.uid,
                    topicId,
                    score: Number.isFinite(score) ? score : null,
                    payload: stringifyJsonField(payload),
                },
            });
            return sendOk(res, { result: mapGameResult(row) }, 201);
        } catch (e: any) {
            console.error('game-results POST', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    return sendErr(res, 'Method not allowed', 405);
}
