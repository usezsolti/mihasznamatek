import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { bookingToPayload, timesJson } from '../../../server/bookingMappers';
import { stringifyJsonField } from '../../../server/jsonField';
import { sanitizeBookingInput } from '../../../server/bookingValidation';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../utils/apiSecurity';

/**
 * POST /api/bookings/create
 * Public booking creation (optional auth links userId).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`bookings-create:${ip}`, 20, 60 * 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok kérés.', 429);
    }

    const payload = sanitizeBookingInput(req.body);
    if (!payload) {
        return sendErr(res, 'Érvénytelen foglalási adatok.', 400);
    }

    const bookingId = payload.id || `booking_${Date.now()}`;

    try {
        const { getServerSession } = await import('next-auth');
        const { authOptions } = await import('../../../server/auth');
        const session = await getServerSession(req, res, authOptions);
        const userId =
            String((session?.user as { id?: string } | undefined)?.id || '') || undefined;

        const row = await prisma.booking.create({
            data: {
                id: bookingId,
                date: payload.date,
                times: timesJson(payload.times),
                customerName: payload.customerName,
                customerEmail: payload.customerEmail,
                lessonType: payload.lessonType,
                selectedSubject: payload.selectedSubject || '',
                hobby: payload.hobby || '',
                totalPrice: payload.totalPrice,
                postalCode: payload.postalCode || null,
                street: payload.street || null,
                houseNumber: payload.houseNumber || null,
                uploadedFiles: payload.uploadedFiles
                    ? stringifyJsonField(payload.uploadedFiles)
                    : undefined,
                submittedAt: new Date(payload.submittedAt),
                status: 'pending',
                paymentStatus: payload.paymentStatus || 'unpaid',
                gdprAccepted: Boolean(payload.gdprAccepted),
                gdprAcceptedAt: payload.gdprAcceptedAt
                    ? new Date(payload.gdprAcceptedAt)
                    : payload.gdprAccepted
                      ? new Date()
                      : null,
                gdprVersion: payload.gdprVersion || null,
                userId: userId || null,
            },
        });

        return sendOk(res, { booking: bookingToPayload(row) }, 201);
    } catch (e: any) {
        if (e?.code === 'P2002') {
            return sendErr(res, 'Ez a foglalás azonosító már létezik.', 409);
        }
        console.error('bookings/create', e);
        return sendErr(res, String(e?.message || e), 500);
    }
}
