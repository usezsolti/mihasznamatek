import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../../../server/jsonField';
import { msToJson } from '../../../../server/serialize';
import { sendErr, sendOk } from '../../../../server/http';
import {
    isAllowedOrigin,
    requireAuth,
    sanitizeText,
} from '../../../../utils/apiSecurity';
import type { WbStroke } from '../../../../utils/whiteboardTypes';

function strokeFromRow(row: {
    id: string;
    authorId: string | null;
    payload: unknown;
    createdAtMs: bigint;
}): WbStroke {
    const payload = parseJsonField<Partial<WbStroke>>(row.payload, {});
    return {
        id: row.id,
        tool: payload.tool as WbStroke['tool'],
        color: String(payload.color || '#000000'),
        width: Number(payload.width || 2),
        points: Array.isArray(payload.points) ? payload.points : [],
        x: payload.x,
        y: payload.y,
        w: payload.w,
        h: payload.h,
        text: payload.text,
        authorId: String(payload.authorId || row.authorId || ''),
        authorName: String(payload.authorName || ''),
        createdAtMs: msToJson(row.createdAtMs),
    };
}

async function boardExists(boardId: string) {
    return prisma.whiteboard.findUnique({ where: { id: boardId } });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);
    const user = await requireAuth(req, res);
    if (!user) return;

    const boardId = sanitizeText(req.query.boardId, 80);
    if (!boardId) return sendErr(res, 'Hiányzó boardId.', 400);

    const board = await boardExists(boardId);
    if (!board) return sendErr(res, 'Tábla nem található.', 404);

    if (req.method === 'GET') {
        const sinceRaw = sanitizeText(req.query.since, 24);
        const sinceMs = sinceRaw ? BigInt(Math.max(0, Number(sinceRaw) || 0)) : BigInt(0);

        const rows = await prisma.whiteboardStroke.findMany({
            where: { boardId, createdAtMs: { gt: sinceMs } },
            orderBy: { createdAtMs: 'asc' },
            take: 500,
        });

        return sendOk(res, {
            board: {
                id: board.id,
                title: board.title,
                createdBy: board.ownerId || '',
                createdAtMs: board.createdAt.getTime(),
                updatedAtMs: board.updatedAt.getTime(),
            },
            strokes: rows.map(strokeFromRow),
        });
    }

    if (req.method === 'POST') {
        const body = req.body as { stroke?: WbStroke; id?: string };
        const stroke = body.stroke || (body as unknown as WbStroke);
        const strokeId = sanitizeText(stroke?.id || body.id, 80);
        if (!strokeId || !stroke?.tool) return sendErr(res, 'Hiányzó stroke adat.', 400);

        const strokePayload = {
            tool: stroke.tool,
            color: String(stroke.color || '#000000').slice(0, 20),
            width: Number(stroke.width || 2),
            points: Array.isArray(stroke.points) ? stroke.points.slice(0, 5000) : [],
            x: stroke.x,
            y: stroke.y,
            w: stroke.w,
            h: stroke.h,
            text: stroke.text != null ? String(stroke.text).slice(0, 2000) : undefined,
            authorId: String(stroke.authorId || user.uid),
            authorName: sanitizeText(stroke.authorName, 80),
        };

        const row = await prisma.whiteboardStroke.upsert({
            where: { id: strokeId },
            create: {
                id: strokeId,
                boardId,
                authorId: user.uid,
                payload: stringifyJsonField(strokePayload),
                createdAtMs: BigInt(stroke.createdAtMs || Date.now()),
            },
            update: {
                payload: stringifyJsonField(strokePayload),
            },
        });

        await prisma.whiteboard.update({
            where: { id: boardId },
            data: { updatedAt: new Date() },
        });

        return sendOk(res, { stroke: strokeFromRow(row) }, 201);
    }

    if (req.method === 'DELETE') {
        const strokeId = sanitizeText(req.query.strokeId || req.body?.strokeId, 80);
        if (strokeId) {
            await prisma.whiteboardStroke.deleteMany({ where: { boardId, id: strokeId } });
        } else {
            await prisma.whiteboardStroke.deleteMany({ where: { boardId } });
        }
        await prisma.whiteboard.update({
            where: { id: boardId },
            data: { updatedAt: new Date() },
        });
        return sendOk(res, { ok: true });
    }

    return sendErr(res, 'Method not allowed', 405);
}
