import { createHmac } from 'crypto';

function secret(): string {
    return (
        process.env.BOOKING_PROPOSAL_SECRET ||
        process.env.CRON_SECRET ||
        process.env.RESEND_API_KEY ||
        'mihaszna-booking-proposal'
    );
}

export type DecisionPurpose = 'student_accept' | 'admin_approve' | 'admin_propose' | 'student_cancel';

export function proposalPayload(
    bookingId: string,
    email: string,
    date: string,
    times: string[]
): string {
    return [bookingId, email.toLowerCase(), date, times.join(',')].join('|');
}

export function signProposal(
    bookingId: string,
    email: string,
    date: string,
    times: string[]
): string {
    return createHmac('sha256', secret())
        .update(proposalPayload(bookingId, email, date, times))
        .digest('hex')
        .slice(0, 32);
}

export function verifyProposal(opts: {
    bookingId: string;
    email: string;
    date: string;
    times: string[];
    token: string;
}): boolean {
    const expected = signProposal(opts.bookingId, opts.email, opts.date, opts.times);
    return Boolean(opts.token) && opts.token === expected;
}

export function signDecision(
    purpose: DecisionPurpose,
    bookingId: string,
    email: string,
    date: string,
    times: string[]
): string {
    return createHmac('sha256', secret())
        .update([purpose, proposalPayload(bookingId, email, date, times)].join('|'))
        .digest('hex')
        .slice(0, 32);
}

export function verifyDecision(opts: {
    purpose: DecisionPurpose;
    bookingId: string;
    email: string;
    date: string;
    times: string[];
    token: string;
}): boolean {
    const expected = signDecision(opts.purpose, opts.bookingId, opts.email, opts.date, opts.times);
    return Boolean(opts.token) && opts.token === expected;
}

export function adminDecisionUrl(
    origin: string,
    action: 'approve' | 'propose',
    booking: {
        id: string;
        customerEmail: string;
        customerName: string;
        date: string;
        times: string[];
        lessonType?: string;
    },
    token: string
): string {
    const q = new URLSearchParams({
        action,
        id: booking.id,
        email: booking.customerEmail,
        date: booking.date,
        times: booking.times.join(','),
        name: booking.customerName,
        token,
    });
    if (booking.lessonType) q.set('lessonType', booking.lessonType);
    return `${origin.replace(/\/$/, '')}/foglalas-dontes?${q.toString()}`;
}

export function studentCancelUrl(
    origin: string,
    booking: { id: string; customerEmail: string; customerName: string; date: string; times: string[] },
    token: string
): string {
    const q = new URLSearchParams({
        id: booking.id,
        email: booking.customerEmail,
        date: booking.date,
        times: booking.times.join(','),
        name: booking.customerName,
        token,
    });
    return `${origin.replace(/\/$/, '')}/foglalas-lemondas?${q.toString()}`;
}

export function studentMailExtras(
    origin: string,
    booking: { id: string; customerEmail: string; customerName: string; date: string; times: string[] }
): { cancelUrl: string } {
    return {
        cancelUrl: studentCancelUrl(
            origin,
            booking,
            signDecision('student_cancel', booking.id, booking.customerEmail, booking.date, booking.times)
        ),
    };
}
