import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma';
import { sendErr, sendOk } from '../../../server/http';
import {
    isAllowedOrigin,
    requireAuth,
    sanitizeText,
} from '../../../utils/apiSecurity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);
    const user = await requireAuth(req, res);
    if (!user) return;

    if (req.method === 'GET') {
        const id = sanitizeText(req.query.id, 80);
        if (!id) return sendErr(res, 'Hiányzó id.', 400);

        const board = await prisma.whiteboard.findUnique({ where: { id } });
        if (!board) return sendErr(res, 'Tábla nem található.', 404);

        return sendOk(res, {
            meta: {
                id: board.id,
                title: board.title,
                createdBy: board.ownerId || '',
                createdAtMs: board.createdAt.getTime(),
                updatedAtMs: board.updatedAt.getTime(),
            },
        });
    }

    if (req.method === 'POST') {
        const title =
            sanitizeText((req.body as { title?: string })?.title, 60) || 'Matek tábla';
        const now = Date.now();

        const board = await prisma.whiteboard.create({
            data: {
                ownerId: user.uid,
                title,
            },
        });

        return sendOk(
            res,
            {
                meta: {
                    id: board.id,
                    title: board.title,
                    createdBy: user.uid,
                    createdAtMs: now,
                    updatedAtMs: now,
                },
            },
            201
        );
    }

    if (req.method === 'PATCH') {
        const id = sanitizeText((req.body as { id?: string })?.id, 80);
        const title = sanitizeText((req.body as { title?: string })?.title, 60);
        if (!id || !title) return sendErr(res, 'Hiányzó id vagy title.', 400);

        const board = await prisma.whiteboard.update({
            where: { id },
            data: { title },
        });

        return sendOk(res, {
            meta: {
                id: board.id,
                title: board.title,
                createdBy: board.ownerId || '',
                createdAtMs: board.createdAt.getTime(),
                updatedAtMs: board.updatedAt.getTime(),
            },
        });
    }

    return sendErr(res, 'Method not allowed', 405);
}
