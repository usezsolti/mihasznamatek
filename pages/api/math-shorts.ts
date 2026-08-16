import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../server/jsonField';
import { sendErr, sendOk } from '../../server/http';
import { getClientIp, isAllowedOrigin, rateLimit, requireAuth } from '../../utils/apiSecurity';

/**
 * GET /api/math-shorts?limit=
 * POST /api/math-shorts — auth required
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req) && req.method !== 'GET') {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    if (req.method === 'GET') {
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
        const rows = await prisma.mathShort.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return sendOk(res, {
            shorts: rows.map((r) => {
                const payload = parseJsonField<Record<string, unknown>>(r.payload, {});
                return {
                    id: r.id,
                    title: r.title,
                    body: r.body,
                    topic: String(payload.topic || ''),
                    hook: String(payload.hook || ''),
                    tip: String(payload.tip || ''),
                    difficulty: String(payload.difficulty || 'közepes'),
                    createdAtMs: r.createdAt.getTime(),
                };
            }),
        });
    }

    if (req.method === 'POST') {
        const user = await requireAuth(req, res);
        if (!user) return;
        const ip = getClientIp(req);
        const rl = rateLimit(`math-short:${ip}`, 30, 60 * 60 * 1000);
        if (!rl.ok) return sendErr(res, 'Túl sok kérés.', 429);

        const title = String(req.body?.title || '').trim().slice(0, 200);
        const body = String(req.body?.body || '').trim().slice(0, 5000);
        if (!title || !body) return sendErr(res, 'Hiányzó title/body.', 400);

        const created = await prisma.mathShort.create({
            data: {
                title,
                body,
                payload: stringifyJsonField({
                    topic: String(req.body?.topic || ''),
                    hook: String(req.body?.hook || ''),
                    tip: String(req.body?.tip || ''),
                    difficulty: String(req.body?.difficulty || 'közepes'),
                    createdAtMs: Number(req.body?.createdAtMs) || Date.now(),
                }),
            },
        });
        const payload = parseJsonField<Record<string, unknown>>(created.payload, {});
        return sendOk(
            res,
            {
                id: created.id,
                title: created.title,
                body: created.body,
                topic: String(payload.topic || ''),
                hook: String(payload.hook || ''),
                tip: String(payload.tip || ''),
                difficulty: String(payload.difficulty || 'közepes'),
                createdAtMs: created.createdAt.getTime(),
            },
            201
        );
    }

    return sendErr(res, 'Method not allowed', 405);
}
