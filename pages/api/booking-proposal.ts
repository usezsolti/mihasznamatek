import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import {
    getClientIp,
    isAllowedOrigin,
    isValidEmail,
    mailLinkOrigin,
    rateLimit,
    requireAdmin,
    sanitizeText,
} from '../../utils/apiSecurity';
import { buildMailsForType, type BookingPayload } from '../../utils/bookingNotify';
import {
    signProposal,
    verifyDecision,
    verifyProposal,
} from '../../utils/booking/proposalToken';
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

async function loadBookingDoc(id: string, fallback: BookingPayload): Promise<BookingPayload> {
    const db = getAdminDb();
    if (!db) return fallback;
    try {
        const snap = await db.collection('bookings').doc(id).get();
        if (!snap.exists) return fallback;
        const d = (snap.data() || {}) as Partial<BookingPayload>;
        return {
            ...fallback,
            ...d,
            id,
            customerEmail: String(d.customerEmail || fallback.customerEmail || '').toLowerCase(),
            customerName: String(d.customerName || fallback.customerName || 'Diák'),
            date: String(d.date || fallback.date || ''),
            times: Array.isArray(d.times) && d.times.length ? d.times : fallback.times,
            status: (d.status as BookingPayload['status']) || fallback.status,
        };
    } catch {
        return fallback;
    }
}

async function sendMails(mails: ReturnType<typeof buildMailsForType>) {
    if (hasResend()) return sendViaResend(mails);
    return { ok: false, error: 'Nincs Resend' as const };
}

async function proposeToStudent(opts: {
    booking: BookingPayload;
    email: string;
    date: string;
    times: string[];
    origin: string;
}) {
    const token = signProposal(opts.booking.id, opts.email, opts.date, opts.times);
    const payload: BookingPayload = {
        ...opts.booking,
        customerEmail: opts.email,
        proposedDate: opts.date,
        proposedTimes: opts.times,
        proposalToken: token,
        status: 'proposed',
    };
    const db = getAdminDb();
    if (db) {
        await db
            .collection('bookings')
            .doc(opts.booking.id)
            .set(
                {
                    proposedDate: opts.date,
                    proposedTimes: opts.times,
                    status: 'proposed',
                    updatedAt: new Date().toISOString(),
                },
                { merge: true }
            )
            .catch(() => undefined);
    }
    const mails = buildMailsForType('propose_time', payload, opts.origin);
    return sendMails(mails);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);

    const ip = getClientIp(req);
    const action = sanitizeText(req.body?.action, 20);
    const origin = mailLinkOrigin(req);

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
        const sent = await proposeToStudent({ booking, email, date, times, origin });
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
        const sent = await sendMails(mails);
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

    if (action === 'admin_approve') {
        const rl = rateLimit(`admin_approve:${ip}`, 30, 60 * 60 * 1000);
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
        if (!verifyDecision({ purpose: 'admin_approve', bookingId: id, email, date, times, token })) {
            return sendErr(res, 'Érvénytelen vagy lejárt link.', 403);
        }
        const fallback: BookingPayload = {
            id,
            date,
            times,
            customerName: name,
            customerEmail: email,
            lessonType: req.body?.lessonType === 'personal' ? 'personal' : 'online',
            selectedSubject: sanitizeText(req.body?.selectedSubject, 120),
            hobby: sanitizeText(req.body?.hobby, 500),
            totalPrice: Math.min(Math.max(Number(req.body?.totalPrice) || 0, 0), 5_000_000),
            submittedAt: new Date().toISOString(),
            status: 'pending',
        };
        const booking = await loadBookingDoc(id, fallback);
        if (String(booking.customerEmail || '').toLowerCase() && String(booking.customerEmail).toLowerCase() !== email) {
            return sendErr(res, 'A foglalási adatok nem egyeznek.', 403);
        }
        if (booking.status === 'approved') {
            return sendOk(res, { ok: true, already: true });
        }
        if (booking.status === 'cancelled' || booking.status === 'rejected') {
            return sendErr(res, 'Ez a foglalás már lezárult.', 409);
        }
        const db = getAdminDb();
        if (db) {
            await db
                .collection('bookings')
                .doc(id)
                .set(
                    {
                        status: 'approved',
                        approvedAt: new Date().toISOString(),
                        date,
                        times,
                    },
                    { merge: true }
                )
                .catch(() => undefined);
        }
        const approved: BookingPayload = { ...booking, customerEmail: email, date, times, status: 'approved' };
        const mails = buildMailsForType('student_approved', approved, origin);
        const sent = await sendMails(mails);
        // #region agent log
        agentDebugLog({
            hypothesisId: 'P3',
            location: 'api/booking-proposal.ts:admin_approve',
            message: 'admin approved from email',
            data: { ok: sent.ok, bookingId: id, date, times },
            runId: 'email-debug',
        });
        // #endregion
        if (!sent.ok) return sendErr(res, sent.error || 'A diák e-mail nem ment ki', 502);
        return sendOk(res, { ok: true });
    }

    if (action === 'admin_propose') {
        const rl = rateLimit(`admin_propose:${ip}`, 30, 60 * 60 * 1000);
        if (!rl.ok) return sendErr(res, 'Túl sok kérés.', 429);
        const id = sanitizeText(req.body?.id, 80);
        const email = sanitizeText(req.body?.email, 200).toLowerCase();
        const name = sanitizeText(req.body?.name, 120) || 'Diák';
        const originalDate = sanitizeText(req.body?.originalDate || req.body?.date, 32);
        const originalTimes = parseTimes(req.body?.originalTimes || req.body?.requestedTimes);
        const token = sanitizeText(req.body?.token, 64);
        const date = sanitizeText(req.body?.proposedDate || req.body?.newDate, 32);
        const times = parseTimes(req.body?.proposedTimes || req.body?.newTimes);
        if (!id || !isValidEmail(email) || !/^\d{4}-\d{2}-\d{2}$/.test(originalDate) || !originalTimes.length) {
            return sendErr(res, 'Érvénytelen link.', 400);
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !times.length) {
            return sendErr(res, 'Adj meg dátumot és időt.', 400);
        }
        if (
            !verifyDecision({
                purpose: 'admin_propose',
                bookingId: id,
                email,
                date: originalDate,
                times: originalTimes,
                token,
            })
        ) {
            return sendErr(res, 'Érvénytelen vagy lejárt link.', 403);
        }
        const fallback: BookingPayload = {
            id,
            date: originalDate,
            times: originalTimes,
            customerName: name,
            customerEmail: email,
            lessonType: 'online',
            selectedSubject: '',
            hobby: '',
            totalPrice: 0,
            submittedAt: new Date().toISOString(),
        };
        const booking = await loadBookingDoc(id, fallback);
        if (booking.status === 'approved' || booking.status === 'cancelled' || booking.status === 'rejected') {
            return sendErr(res, 'Ez a foglalás már lezárult.', 409);
        }
        const sent = await proposeToStudent({
            booking: { ...booking, customerEmail: email, customerName: name },
            email,
            date,
            times,
            origin,
        });
        // #region agent log
        agentDebugLog({
            hypothesisId: 'P4',
            location: 'api/booking-proposal.ts:admin_propose',
            message: 'admin proposed from email',
            data: { ok: sent.ok, bookingId: id, date, times },
            runId: 'email-debug',
        });
        // #endregion
        if (!sent.ok) return sendErr(res, sent.error || 'Email nem ment ki', 502);
        return sendOk(res, { ok: true, date, times });
    }

    return sendErr(res, 'Ismeretlen művelet', 400);
}
