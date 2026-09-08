import { createHmac } from 'crypto';

function secret(): string {
    return (
        process.env.BOOKING_PROPOSAL_SECRET ||
        process.env.CRON_SECRET ||
        process.env.RESEND_API_KEY ||
        'mihaszna-booking-proposal'
    );
}

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
