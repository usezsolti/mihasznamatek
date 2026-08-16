import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { prisma } from '../../server/prisma';
import { blockedSlotToDay, timesJson } from '../../server/bookingMappers';
import { getClientIp, isAllowedOrigin, rateLimit, requireAdmin, sanitizeText } from '../../utils/apiSecurity';
import type { BlockedDay } from '../../utils/bookingNotify';

function parseBlockedDay(raw: unknown): BlockedDay | null {
    if (!raw || typeof raw !== 'object') return null;
    const o = raw as Record<string, unknown>;
    const date = sanitizeText(o.date, 32);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    const times = Array.isArray(o.times)
        ? o.times.map((t) => sanitizeText(t, 8)).filter((t) => /^\d{2}:\d{2}$/.test(t))
        : [];
    return {
        date,
        times,
        allDay: Boolean(o.allDay),
        note: sanitizeText(o.note, 240) || undefined,
    };
}

/**
 * GET /api/blocked-slots — public list (no auth)
 * POST /api/blocked-slots — admin upsert/delete
 * DELETE /api/blocked-slots?date=YYYY-MM-DD — admin delete
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!['GET', 'POST', 'DELETE'].includes(req.method || '')) {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    if (req.method === 'GET') {
        const ip = getClientIp(req);
        const rl = rateLimit(`blocked-slots-get:${ip}`, 120, 60 * 60 * 1000);
        if (!rl.ok) return sendErr(res, 'Túl sok kérés.', 429);

        try {
            const rows = await prisma.blockedSlot.findMany({
                orderBy: { date: 'asc' },
                take: 500,
            });
            return sendOk(res, { blocked: rows.map(blockedSlotToDay) });
        } catch (e: any) {
            console.error('blocked-slots GET', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === 'DELETE') {
        const date = sanitizeText(req.query.date, 32);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return sendErr(res, 'Érvénytelen dátum.', 400);
        }
        try {
            await prisma.blockedSlot.delete({ where: { date } }).catch(() => undefined);
            return sendOk(res, { deleted: date });
        } catch (e: any) {
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    const day = parseBlockedDay(req.body);
    if (!day) return sendErr(res, 'Érvénytelen blokk adat.', 400);

    const times = Array.from(new Set(day.times || [])).sort();
    const allDay = Boolean(day.allDay);

    try {
        if (!allDay && times.length === 0) {
            await prisma.blockedSlot.delete({ where: { date: day.date } }).catch(() => undefined);
            return sendOk(res, { blocked: null, deleted: day.date });
        }

        const row = await prisma.blockedSlot.upsert({
            where: { date: day.date },
            create: {
                date: day.date,
                times: timesJson(times),
                allDay,
                note: day.note || null,
            },
            update: {
                times: timesJson(times),
                allDay,
                note: day.note || null,
            },
        });

        return sendOk(res, { blocked: blockedSlotToDay(row) });
    } catch (e: any) {
        console.error('blocked-slots POST', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
