import { foldHu } from './bookingPackedSlots';

export type MailIntent = 'booking' | 'ignore' | 'escalate';

const ESCALATE =
    /\b(panasz|reklamacio|ugyved|nav\b|szamla|sztorno|beteg|korhaz|gyasz|rendorse|feljelentes|gdpr|torold? az adata|olcsobb|olcsobban|ingyen|alkud|kedvezmeny|visszaeles)\b/;

const IGNORE =
    /\b(unsubscribe|irattar|hirlevel|newsletter|noreply|no-reply|receipt from google|security alert|teamviewer|linkedin)\b/;

const BOOKING =
    /\b(idopont|foglal|matek|korrepet|tanit|tanar|orat|orara|orat|oraim|orakat|zsolt|hetfo|kedd|szerda|csutortok|pentek|szombat|vasarnap|hetkoznap|mikor\s+jo|van-e hely|szabad\s*ora|appointment|lesson|tutor)/;

export function classifyBookingMailIntent(opts: {
    subject: string;
    text: string;
    fromEmail: string;
    knownCustomer?: boolean;
    inAgentThread?: boolean;
}): MailIntent {
    const from = foldHu(opts.fromEmail);
    if (/\b(noreply|no-reply|mailer-daemon|notifications?@)\b/.test(from)) return 'ignore';

    const blob = foldHu(`${opts.subject}\n${opts.text}`).slice(0, 8000);
    if (ESCALATE.test(blob)) return 'escalate';
    if (IGNORE.test(blob) && !BOOKING.test(blob)) return 'ignore';
    if (opts.inAgentThread || opts.knownCustomer) {
        if (BOOKING.test(blob) || /\b(jo|ok|rendben|megfelel|koszi|koszonom|tudom|igen|nem)\b/.test(blob)) {
            return 'booking';
        }
    }
    if (BOOKING.test(blob)) return 'booking';
    if (/\b\d{1,2}:\d{2}\b/.test(blob) && /\b(ora|idopont|jo|tud|mehet)\b/.test(blob)) return 'booking';
    return 'ignore';
}
