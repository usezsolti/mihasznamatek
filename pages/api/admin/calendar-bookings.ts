import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { blockedSlotToDay, bookingToPayload } from '../../../server/bookingMappers';
import { requireAdmin } from '../../../utils/apiSecurity';

/**
 * GET /api/admin/calendar-bookings
 * Admin naptár foglalásai + blockedSlots (Prisma).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    try {
        const [bookingRows, blockedRows] = await Promise.all([
            prisma.booking.findMany({
                orderBy: [{ date: 'desc' }, { submittedAt: 'desc' }],
                take: 500,
            }),
            prisma.blockedSlot.findMany({
                orderBy: { date: 'asc' },
                take: 500,
            }),
        ]);

        const bookings = bookingRows.map(bookingToPayload);
        const blocked = blockedRows.map(blockedSlotToDay);

        return sendOk(res, {
            bookings,
            blocked,
            source: 'prisma' as const,
            permissionDenied: false,
        });
    } catch (e: any) {
        console.error('admin/calendar-bookings', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
