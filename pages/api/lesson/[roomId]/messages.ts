import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../server/prisma';
import { msToJson } from '../../../../server/serialize';
import { sendErr, sendOk } from '../../../../server/http';
import {
    isAllowedOrigin,
    requireAuth,
    sanitizeText,
} from '../../../../utils/apiSecurity';

function mapMessage(row: {
    id: string;
    senderId: string;
    senderName: string;
    senderPhoto: string;
    text: string;
    createdAtMs: bigint;
}) {
    return {
        id: row.id,
        senderId: row.senderId,
        senderName: row.senderName,
        senderPhoto: row.senderPhoto,
        text: row.text,
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

        const rows = await prisma.lessonMessage.findMany({
            where: { roomId, createdAtMs: { gt: sinceMs } },
            orderBy: { createdAtMs: 'asc' },
            take: 120,
        });

        return sendOk(res, { messages: rows.map(mapMessage) });
    }

    if (req.method === 'POST') {
        const body = req.body as {
            text?: string;
            senderName?: string;
            senderPhoto?: string;
        };
        const text = sanitizeText(body.text, 1000);
        if (!text) return sendErr(res, 'Üres üzenet.', 400);

        const senderName =
            sanitizeText(body.senderName, 80) ||
            sanitizeText(user.email?.split('@')[0], 80) ||
            'Felhasználó';
        const senderPhoto = sanitizeText(body.senderPhoto, 500);

        const row = await prisma.lessonMessage.create({
            data: {
                roomId,
                senderId: user.uid,
                senderName,
                senderPhoto,
                text,
                createdAtMs: BigInt(Date.now()),
            },
        });

        return sendOk(res, { message: mapMessage(row) }, 201);
    }

    return sendErr(res, 'Method not allowed', 405);
}
