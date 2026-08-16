import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { prisma } from '../../server/prisma';
import { blockedSlotToDay, asStringArray } from '../../server/bookingMappers';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../utils/apiSecurity';

export type BusySlotDay = {
    date: string;
    times: string[];
    status: 'pending' | 'approved';
};

/**
 * Public busy times for the appointment calendar (no names/emails).
 * Includes approved/pending bookings + blockedSlots from Prisma.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`public-busy-slots:${ip}`, 120, 60 * 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok kérés.', 429);
    }

    try {
        const [bookingRows, blockedRows] = await Promise.all([
            prisma.booking.findMany({
                where: { status: { in: ['pending', 'approved'] } },
                select: { date: true, times: true, status: true },
                take: 1000,
            }),
            prisma.blockedSlot.findMany({ take: 500 }),
        ]);

        const slots: BusySlotDay[] = [];
        bookingRows.forEach((row) => {
            const date = String(row.date || '');
            const times = asStringArray(row.times);
            if (!date || times.length === 0) return;
            slots.push({
                date,
                times,
                status: row.status === 'approved' ? 'approved' : 'pending',
            });
        });

        const blocked = blockedRows.map(blockedSlotToDay);

        return sendOk(res, { slots, blocked, source: 'prisma' as const });
    } catch (e: any) {
        console.warn('public-busy-slots', String(e?.message || e).slice(0, 160));
        return sendOk(res, { slots: [] as BusySlotDay[], blocked: [], source: 'error' as const });
    }
}
