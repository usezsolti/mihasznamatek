import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prisma } from '@prisma/client';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { bookingToPayload } from '../../../server/bookingMappers';
import { stringifyJsonField } from '../../../server/jsonField';
import { isBookingOwner } from '../../../server/bookingValidation';
import { isAdminEmail } from '../../../utils/admin';
import { isAllowedOrigin, requireAuth } from '../../../utils/apiSecurity';
import type { BookingStatus, PaymentStatus } from '../../../utils/bookingNotify';

/**
 * GET /api/bookings/[id] — admin or owner (email match)
 * PATCH /api/bookings/[id] — admin status/payment; owner cancel
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'PATCH') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const id = String(req.query.id || '').trim();
    if (!id) return sendErr(res, 'Hiányzó foglalás azonosító.', 400);

    const user = await requireAuth(req, res);
    if (!user) return;

    const isAdmin =
        user.role === 'admin' || isAdminEmail(user.email);

    try {
        const row = await prisma.booking.findUnique({ where: { id } });
        if (!row) return sendErr(res, 'Foglalás nem található.', 404);

        const booking = bookingToPayload(row);
        const isOwner = isBookingOwner(booking, user.email);

        if (!isAdmin && !isOwner) {
            return sendErr(res, 'Nincs jogosultság.', 403);
        }

        if (req.method === 'GET') {
            return sendOk(res, { booking });
        }

        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const patch: Prisma.BookingUpdateInput = {};

        if (isAdmin) {
            const status = String(body.status || '');
            if (['approved', 'rejected', 'cancelled', 'pending'].includes(status)) {
                patch.status = status as BookingStatus;
            }
            const paymentStatus = String(body.paymentStatus || '');
            if (['unpaid', 'transfer_pending', 'paid'].includes(paymentStatus)) {
                patch.paymentStatus = paymentStatus as PaymentStatus;
                if (paymentStatus === 'paid') {
                    patch.paidAt = body.paidAt ? new Date(String(body.paidAt)) : new Date();
                }
            }
            if (body.reminderSentAt !== undefined) {
                patch.reminderSentAt = body.reminderSentAt
                    ? new Date(String(body.reminderSentAt))
                    : null;
            }
            if (Array.isArray(body.uploadedFiles)) {
                patch.uploadedFiles = stringifyJsonField(body.uploadedFiles);
            }
        } else if (isOwner) {
            const status = String(body.status || '');
            if (status === 'cancelled') {
                const current = booking.status || 'pending';
                if (current !== 'pending' && current !== 'approved') {
                    return sendErr(res, 'Ez a foglalás már nem mondható le.', 400);
                }
                if (booking.date) {
                    const day = new Date(booking.date + 'T23:59:59');
                    if (day.getTime() < Date.now()) {
                        return sendErr(res, 'Múltbeli óra nem mondható le.', 400);
                    }
                }
                patch.status = 'cancelled';
            } else if (body.paymentStatus === 'transfer_pending') {
                patch.paymentStatus = 'transfer_pending';
            }
        }

        if (!Object.keys(patch).length) {
            return sendErr(res, 'Nincs módosítható mező.', 400);
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: patch,
        });

        return sendOk(res, { booking: bookingToPayload(updated) });
    } catch (e: any) {
        console.error('bookings/[id]', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
