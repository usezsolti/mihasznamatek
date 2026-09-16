import { foldHu } from './bookingPackedSlots';

export type MailIntent = 'booking' | 'ignore' | 'escalate';

const ESCALATE =
    /\b(panasz|reklamacio|ugyved|nav\b|szamla|sztorno|beteg|korhaz|gyasz|rendorse|feljelentes|gdpr|torold? az adata|olcsobb|olcsobban|ingyen|alkud|kedvezmeny|visszaeles)\b/;

const IGNORE =
    /\b(unsubscribe|irattar|hirlevel|newsletter|noreply|no-reply|receipt from google|security alert|teamviewer|linkedin|facebook|instagram|tiktok|promo|akcio)\b/;

/** Matek / tanóra — új szál csak ebből indulhat. */
const MATH_LESSON =
    /\b(matek|matematika|korrepet|tanora|magantanar|erettsegi|algebra|geometria|felkeszul|mihaszna|oraanyag|feladatlap)/;

const BOOKING_ASK =
    /\b(idopont|foglal|tanorat|orat\s+ker|orara\s+jelent|szeretnek\s+orat|lesson|tutor|appointment)/;

const SLOT_TALK =
    /\b(hetfo|kedd|szerda|csutortok|pentek|szombat|vasarnap|\d{1,2}:\d{2}|\d{1,2}\s*(?:ora|kor)|elso|masodik|harmadik|az\s+jo|mehet|foglald|lefoglal)\b/;

const THANKS_ONLY =
    /^(szia|hello|hellosz|koszi+|koszonom|koszii+|ok|oke|rendben|thx|thanks|koszi\s+szepen)[\s!.]*$/i;

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
    const bodyOnly = foldHu(opts.text).trim();
    if (ESCALATE.test(blob)) return 'escalate';
    if (IGNORE.test(blob) && !MATH_LESSON.test(blob) && !BOOKING_ASK.test(blob)) return 'ignore';

    const mathOrAsk = MATH_LESSON.test(blob) || BOOKING_ASK.test(blob);

    if (opts.inAgentThread) {
        if (THANKS_ONLY.test(bodyOnly) && !SLOT_TALK.test(blob) && !mathOrAsk) return 'ignore';
        if (mathOrAsk || SLOT_TALK.test(blob)) return 'booking';
        return 'ignore';
    }

    if (mathOrAsk) return 'booking';
    return 'ignore';
}
