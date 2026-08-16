import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../server/prisma';
import { msToJson } from '../../../../server/serialize';
import { sendErr, sendOk } from '../../../../server/http';
import {
    isAllowedOrigin,
    requireAuth,
    sanitizeText,
} from '../../../../utils/apiSecurity';

const SIGNAL_TYPES = new Set(['offer', 'answer', 'ice', 'hangup']);

function mapSignal(row: {
    id: string;
    type: string;
    fromUid: string;
    sdp: string | null;
    candidate: string | null;
    createdAtMs: bigint;
}) {
    return {
        id: row.id,
        type: row.type,
        fromUid: row.fromUid,
        sdp: row.sdp || undefined,
        candidate: row.candidate || undefined,
        createdAtMs: msToJson(row.createdAtMs),
    };
}

async function roomExists(roomId: string) {
    return prisma.lessonRoom.findUnique({ where: { id: roomId }, select: { id: true } });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);
    const user = await requireAuth(req, res);
    if (!user) return;

    const roomId = sanitizeText(req.query.roomId, 80);
    if (!roomId) return sendErr(res, 'Hiányzó roomId.', 400);

    const room = await roomExists(roomId);
    if (!room) return sendErr(res, 'Óra nem található.', 404);

    if (req.method === 'GET') {
        const sinceRaw = sanitizeText(req.query.since, 24);
        const sinceMs = sinceRaw ? BigInt(Math.max(0, Number(sinceRaw) || 0)) : BigInt(0);

        const rows = await prisma.callSignal.findMany({
            where: { roomId, createdAtMs: { gt: sinceMs } },
            orderBy: { createdAtMs: 'asc' },
            take: 80,
        });

        return sendOk(res, { signals: rows.map(mapSignal) });
    }

    if (req.method === 'POST') {
        const body = req.body as { type?: string; sdp?: string; candidate?: string };
        const type = sanitizeText(body.type, 20);
        if (!SIGNAL_TYPES.has(type)) return sendErr(res, 'Érvénytelen signal type.', 400);

        const sdp = body.sdp != null ? String(body.sdp).slice(0, 100_000) : null;
        const candidate =
            body.candidate != null ? String(body.candidate).slice(0, 20_000) : null;

        const row = await prisma.callSignal.create({
            data: {
                roomId,
                type,
                fromUid: user.uid,
                sdp,
                candidate,
                createdAtMs: BigInt(Date.now()),
            },
        });

        return sendOk(res, { signal: mapSignal(row) }, 201);
    }

    if (req.method === 'DELETE') {
        await prisma.callSignal.deleteMany({
            where: { roomId, fromUid: user.uid },
        });
        return sendOk(res, { ok: true });
    }

    return sendErr(res, 'Method not allowed', 405);
}
