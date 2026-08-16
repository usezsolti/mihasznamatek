import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../../server/jsonField';
import { isAllowedOrigin, requireAdmin, requireAuth } from '../../../utils/apiSecurity';

const emptyProgress = () => ({
    xp: 0,
    rank: 'BEGINNER',
    rankLevel: 1,
    badges: [] as string[],
    topics: {} as Record<string, unknown>,
});

/**
 * GET /api/progress/practice — current user's practice progress
 * PUT /api/progress/practice — save practice progress (current user)
 * Query ?userId= — admin read another user's progress
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const user = await requireAuth(req, res);
    if (!user) return;

    const targetUserId = String(req.query.userId || '').trim();
    let uid = user.uid;

    if (targetUserId && targetUserId !== user.uid) {
        const admin = await requireAdmin(req, res);
        if (!admin) return;
        uid = targetUserId;
    }

    if (req.method === 'GET') {
        try {
            const row = await prisma.practiceProgress.findUnique({ where: { userId: uid } });
            const data = parseJsonField<Record<string, unknown>>(row?.data, {});
            if (!row?.data) {
                return sendOk(res, { progress: emptyProgress(), updatedAt: null });
            }
            return sendOk(res, {
                progress: {
                    xp: Number(data.xp || 0),
                    rank: String(data.rank || 'BEGINNER'),
                    rankLevel: Number(data.rankLevel || 1),
                    badges: Array.isArray(data.badges) ? data.badges : [],
                    topics: data.topics && typeof data.topics === 'object' ? data.topics : {},
                },
                updatedAt: row.updatedAt.toISOString(),
            });
        } catch (e: any) {
            console.error('progress/practice GET', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'PUT') {
        if (uid !== user.uid) {
            return sendErr(res, 'Csak a saját progress menthető.', 403);
        }

        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
        const progress = body.progress;
        if (!progress || typeof progress !== 'object') {
            return sendErr(res, 'Hiányzó progress adat.', 400);
        }

        try {
            const row = await prisma.practiceProgress.upsert({
                where: { userId: uid },
                create: { userId: uid, data: stringifyJsonField(progress) },
                update: { data: stringifyJsonField(progress) },
            });
            return sendOk(res, { updatedAt: row.updatedAt.toISOString() });
        } catch (e: any) {
            console.error('progress/practice PUT', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    return sendErr(res, 'Method not allowed', 405);
}
