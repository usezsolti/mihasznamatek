import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { bookingToPayload } from '../../../server/bookingMappers';
import { isAdminEmail } from '../../../utils/admin';
import { isAllowedOrigin, requireAuth } from '../../../utils/apiSecurity';

/**
 * GET /api/bookings/list
 * Admin: all bookings (optional ?status=&date=&reminderPending=1)
 * User: own bookings by email
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const user = await requireAuth(req, res);
    if (!user) return;

    const isAdmin = user.role === 'admin' || isAdminEmail(user.email);
    const status = String(req.query.status || '').trim();
    const date = String(req.query.date || '').trim();
    const reminderPending = String(req.query.reminderPending || '') === '1';
    const emailQuery = String(req.query.email || '').trim().toLowerCase();

    try {
        if (isAdmin) {
            const where: Record<string, unknown> = {};
            if (status) where.status = status;
            if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) where.date = date;
            if (emailQuery) where.customerEmail = { equals: emailQuery, mode: 'insensitive' };
            if (reminderPending) {
                where.status = 'approved';
                where.reminderSentAt = null;
                if (date) where.date = date;
            }

            const rows = await prisma.booking.findMany({
                where,
                orderBy: [{ date: 'desc' }, { submittedAt: 'desc' }],
                take: 500,
            });

            const bookings = rows.map(bookingToPayload);
            return sendOk(res, { bookings, role: 'admin' as const });
        }

        const email = user.email.trim().toLowerCase();
        if (!email) return sendOk(res, { bookings: [], role: 'student' as const });

        const rows = await prisma.booking.findMany({
            where: { customerEmail: { equals: email, mode: 'insensitive' } },
            orderBy: [{ date: 'desc' }, { submittedAt: 'desc' }],
            take: 100,
        });

        const bookings = rows.map(bookingToPayload);
        return sendOk(res, { bookings, role: 'student' as const });
    } catch (e: any) {
        console.error('bookings/list', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
