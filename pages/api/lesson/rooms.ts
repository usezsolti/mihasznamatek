import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma';
import { msToJson } from '../../../server/serialize';
import { sendErr, sendOk } from '../../../server/http';
import {
    isAllowedOrigin,
    requireAuth,
    sanitizeText,
} from '../../../utils/apiSecurity';

function mapRoom(row: {
    id: string;
    title: string;
    createdBy: string;
    whiteboardId: string | null;
    bookingId: string | null;
    studentName: string | null;
    createdAtMs: bigint;
}) {
    return {
        id: row.id,
        title: row.title,
        createdBy: row.createdBy,
        whiteboardId: row.whiteboardId || '',
        bookingId: row.bookingId || undefined,
        studentName: row.studentName || undefined,
        createdAtMs: msToJson(row.createdAtMs),
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);
    const user = await requireAuth(req, res);
    if (!user) return;

    if (req.method === 'GET') {
        const id = sanitizeText(req.query.id, 80);
        if (id) {
            const room = await prisma.lessonRoom.findUnique({ where: { id } });
            if (!room) return sendErr(res, 'Óra nem található.', 404);
            return sendOk(res, { room: mapRoom(room) });
        }

        const rooms = await prisma.lessonRoom.findMany({
            where: { createdBy: user.uid },
            orderBy: { createdAtMs: 'desc' },
            take: 40,
        });
        return sendOk(res, { rooms: rooms.map(mapRoom) });
    }

    if (req.method === 'POST') {
        const title =
            sanitizeText((req.body as { title?: string })?.title, 120) || 'Matek óra';
        const bookingId = sanitizeText((req.body as { bookingId?: string })?.bookingId, 80) || null;
        const studentName =
            sanitizeText((req.body as { studentName?: string })?.studentName, 120) || null;

        const board = await prisma.whiteboard.create({
            data: {
                ownerId: user.uid,
                title: `${title} tábla`.slice(0, 60),
            },
        });

        const room = await prisma.lessonRoom.create({
            data: {
                title,
                createdBy: user.uid,
                whiteboardId: board.id,
                bookingId,
                studentName,
                createdAtMs: BigInt(Date.now()),
            },
        });

        return sendOk(res, { room: mapRoom(room) }, 201);
    }

    if (req.method === 'PATCH') {
        const roomId = sanitizeText((req.body as { roomId?: string })?.roomId, 80);
        const whiteboardId = sanitizeText((req.body as { whiteboardId?: string })?.whiteboardId, 80);
        if (!roomId || !whiteboardId) {
            return sendErr(res, 'Hiányzó roomId vagy whiteboardId.', 400);
        }

        const existing = await prisma.lessonRoom.findUnique({ where: { id: roomId } });
        if (!existing) return sendErr(res, 'Óra nem található.', 404);

        const board = await prisma.whiteboard.findUnique({ where: { id: whiteboardId } });
        if (!board) return sendErr(res, 'Tábla nem található.', 404);

        const room = await prisma.lessonRoom.update({
            where: { id: roomId },
            data: { whiteboardId },
        });
        return sendOk(res, { room: mapRoom(room) });
    }

    return sendErr(res, 'Method not allowed', 405);
}
