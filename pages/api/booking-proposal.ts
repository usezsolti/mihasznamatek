import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import {
    getClientIp,
    isAllowedOrigin,
    isValidEmail,
    rateLimit,
    requireAdmin,
    sanitizeText,
    secureSiteOrigin,
} from '../../utils/apiSecurity';
import { buildMailsForType, type BookingPayload } from '../../utils/bookingNotify';
import { signProposal, verifyProposal } from '../../utils/booking/proposalToken';
import { hasResend, sendViaResend } from '../../server/resendMail';
import { getAdminDb } from '../../server/firebaseAdmin';
import { agentDebugLog } from '../../utils/agentDebugLog';

function parseTimes(raw: unknown): string[] {
    const list = Array.isArray(raw)
        ? raw
        : String(raw || '')
              .split(',')
              .map((s) => s.trim());
    return list.map((t) => sanitizeText(t, 8)).filter((t) => /^\d{2}:\d{2}$/.test(t)).slice(0, 8);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);

    const ip = getClientIp(req);
    const action = sanitizeText(req.body?.action, 20);
    const origin = secureSiteOrigin();

    if (action === 'propose') {
        const admin = await requireAdmin(req, res);
        if (!admin) return;
        const rl = rateLimit(`propose:${ip}`, 40, 60 * 60 * 1000);
        if (!rl.ok) return sendErr(res, 'Túl sok kérés.', 429);

        const booking = req.body?.booking as BookingPayload;
        const date = sanitizeText(req.body?.date, 32);
        const times = parseTimes(req.body?.times);
        const email = sanitizeText(booking?.customerEmail, 200).toLowerCase();
        if (!booking?.id || !isValidEmail(email) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !times.length) {
            return sendErr(res, 'Érvénytelen javaslat.', 400);
        }
        const token = signProposal(booking.id, email, date, times);
        const payload: BookingPayload = {
            ...booking,
            customerEmail: email,
            proposedDate: date,
            proposedTimes: times,
            proposalToken: token,
            status: 'proposed',
        };
        const db = getAdminDb();
        if (db) {
            await db
                .collection('bookings')
                .doc(booking.id)
                .set(
                    {
                        proposedDate: date,
                        proposedTimes: times,
                        status: 'proposed',
                        updatedAt: new Date().toISOString(),
                    },
                    { merge: true }
                )
                .catch(() => undefined);
        }
        const mails = buildMailsForType('propose_time', payload, origin);
        const sent = hasResend()
            ? await sendViaResend(mails)
            : { ok: false, error: 'Nincs Resend' };
        // #region agent log
        agentDebugLog({
            hypothesisId: 'P1',
            location: 'api/booking-proposal.ts:propose',
            message: 'proposed other time',
            data: { ok: sent.ok, bookingId: booking.id, date, times },
            runId: 'email-debug',
        });
        // #endregion
        if (!sent.ok) return sendErr(res, sent.error || 'Email nem ment ki', 502);
        return sendOk(res, { ok: true, date, times });
    }

    if (action === 'accept') {
        const rl = rateLimit(`accept:${ip}`, 20, 60 * 60 * 1000);
        if (!rl.ok) return sendErr(res, 'Túl sok kérés.', 429);
        const id = sanitizeText(req.body?.id, 80);
        const email = sanitizeText(req.body?.email, 200).toLowerCase();
        const name = sanitizeText(req.body?.name, 120) || 'Diák';
        const date = sanitizeText(req.body?.date, 32);
        const times = parseTimes(req.body?.times);
        const token = sanitizeText(req.body?.token, 64);
        if (!id || !isValidEmail(email) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !times.length) {
            return sendErr(res, 'Érvénytelen link.', 400);
        }
        if (!verifyProposal({ bookingId: id, email, date, times, token })) {
            return sendErr(res, 'Érvénytelen vagy lejárt link.', 403);
        }
        const booking: BookingPayload = {
            id,
            date,
            times,
            customerName: name,
            customerEmail: email,
            lessonType: 'online',
            selectedSubject: '',
            hobby: '',
            totalPrice: 0,
            submittedAt: new Date().toISOString(),
            proposedDate: date,
            proposedTimes: times,
            status: 'approved',
        };
        const db = getAdminDb();
        if (db) {
            await db
                .collection('bookings')
                .doc(id)
                .set(
                    {
                        date,
                        times,
                        status: 'approved',
                        approvedAt: new Date().toISOString(),
                        proposedDate: date,
                        proposedTimes: times,
                    },
                    { merge: true }
                )
                .catch(() => undefined);
        }
        const mails = buildMailsForType('proposal_accepted', booking, origin);
        const sent = hasResend()
            ? await sendViaResend(mails)
            : { ok: false, error: 'Nincs Resend' };
        // #region agent log
        agentDebugLog({
            hypothesisId: 'P2',
            location: 'api/booking-proposal.ts:accept',
            message: 'student accepted proposed time',
            data: { ok: sent.ok, bookingId: id, date, times },
            runId: 'email-debug',
        });
        // #endregion
        if (!sent.ok) return sendErr(res, sent.error || 'Email nem ment ki', 502);
        return sendOk(res, { ok: true });
    }

    return sendErr(res, 'Ismeretlen művelet', 400);
}
