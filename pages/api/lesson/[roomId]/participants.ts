import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../server/prisma';
import { msToJson, msToJsonOptional } from '../../../../server/serialize';
import { sendErr, sendOk } from '../../../../server/http';
import {
    isAllowedOrigin,
    requireAuth,
    sanitizeText,
} from '../../../../utils/apiSecurity';

function mapParticipant(row: {
    uid: string;
    displayName: string;
    role: string;
    sharingScreen: boolean;
    shareUpdatedAtMs: bigint | null;
    joinedAtMs: bigint;
}) {
    return {
        uid: row.uid,
        displayName: row.displayName,
        role: row.role,
        sharingScreen: row.sharingScreen,
        shareUpdatedAtMs: msToJsonOptional(row.shareUpdatedAtMs),
        joinedAtMs: msToJson(row.joinedAtMs),
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
        const rows = await prisma.callParticipant.findMany({ where: { roomId } });
        return sendOk(res, { participants: rows.map(mapParticipant) });
    }

    if (req.method === 'PUT') {
        const body = req.body as {
            displayName?: string;
            role?: string;
            sharingScreen?: boolean;
        };
        const displayName = sanitizeText(body.displayName, 80);
        const roleRaw = sanitizeText(body.role, 20);
        const role =
            roleRaw === 'teacher' || roleRaw === 'student' ? roleRaw : 'student';
        const sharingScreen = Boolean(body.sharingScreen);
        const now = BigInt(Date.now());

        const row = await prisma.callParticipant.upsert({
            where: { roomId_uid: { roomId, uid: user.uid } },
            create: {
                roomId,
                uid: user.uid,
                displayName: displayName || user.email?.split('@')[0] || 'Felhasználó',
                role,
                sharingScreen,
                shareUpdatedAtMs: sharingScreen ? now : null,
                joinedAtMs: now,
            },
            update: {
                ...(displayName ? { displayName } : {}),
                ...(roleRaw === 'teacher' || roleRaw === 'student' ? { role } : {}),
                sharingScreen,
                shareUpdatedAtMs: sharingScreen ? now : null,
            },
        });

        return sendOk(res, { participant: mapParticipant(row) });
    }

    if (req.method === 'DELETE') {
        await prisma.callParticipant.deleteMany({
            where: { roomId, uid: user.uid },
        });
        return sendOk(res, { ok: true });
    }

    return sendErr(res, 'Method not allowed', 405);
}
