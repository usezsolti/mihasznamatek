import { getGoogleCalendarUrl } from '../bookingCalendar';
import { agentDebugLog } from '../agentDebugLog';
import {
    ADMIN_BOOKING_EMAIL,
    CANCEL_POLICY_HU,
    formatAttachmentsLine,
    priceForTimes,
    type BookingEmailType,
    type BookingPayload,
    type MailBuildExtras,
    type MailPayload,
} from './types';

function displayPrice(booking: BookingPayload): number {
    return booking.totalPrice > 0 ? booking.totalPrice : priceForTimes(booking.times);
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDateHu(dateKey: string): string {
    return new Date(dateKey + 'T12:00:00').toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });
}

function typeLabel(lessonType: string): string {
    return lessonType === 'personal' ? 'Személyes (Fót)' : 'Online';
}

function emailBtn(href: string, label: string, variant: 'primary' | 'danger' | 'outline'): string {
    const styles = {
        primary: 'background:#0b6e4f;color:#ffffff;border:2px solid #0b6e4f;',
        danger: 'background:#b42318;color:#ffffff;border:2px solid #b42318;',
        outline: 'background:#ffffff;color:#0b6e4f;border:2px solid #0b6e4f;',
    }[variant];
    return `<a href="${escapeHtml(href)}" style="display:inline-block;${styles}text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:15px;">${escapeHtml(label)}</a>`;
}

function wrapStudentHtml(title: string, inner: string): string {
    return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f6f7f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px 24px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;">${escapeHtml(title)}</p>
          ${inner}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function studentDetailsTable(booking: BookingPayload, dateKey?: string, times?: string[]): string {
    const dateHu = formatDateHu(dateKey || booking.date);
    const slot = (times || booking.times).join(', ');
    const rows: Array<[string, string]> = [
        ['Dátum', dateHu],
        ['Időpont(ok)', slot],
        ['Óra típusa', typeLabel(booking.lessonType)],
        ['Témakör', booking.selectedSubject || '—'],
        ['Összesen', `${displayPrice(booking).toLocaleString('hu-HU')} Ft`],
    ];
    return `<table role="presentation" style="margin:0 0 20px;font-size:14px;line-height:1.45;">${rows
        .map(
            ([k, v]) =>
                `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(v)}</td></tr>`
        )
        .join('')}</table>`;
}

function policyBlock(): string {
    return `<p style="margin:16px 0 0;padding:12px 14px;background:#fff6e8;border-radius:8px;font-size:13px;line-height:1.5;color:#5c3b00;">${escapeHtml(CANCEL_POLICY_HU)}</p>`;
}

const STUDENT_WELCOME_LINES = [
    'Csáó leendő tanítványom!',
    'Üdvözöllek a MihasznaMatek univerzumában, várom, hogy együtt csapassuk a közös munkát és fejlődjünk.',
];

function studentWelcomeHtml(): string {
    return `<p style="margin:0 0 8px;font-size:16px;font-weight:700;line-height:1.45;">${escapeHtml(STUDENT_WELCOME_LINES[0])}</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.55;">${escapeHtml(STUDENT_WELCOME_LINES[1])}</p>`;
}

function studentSignoffHtml(): string {
    return `<p style="margin:16px 0 0;font-size:13px;color:#555;line-height:1.5;">Ha kérdésed van, írj bátran erre az e-mailre.<br><br>Találkozunk az órán!<br>Zsolt<br>Mihaszna Matek</p>`;
}

function addressLine(booking: BookingPayload): string {
    return (
        `${booking.postalCode || ''} ${booking.street || ''} ${booking.houseNumber || ''}`.trim() ||
        '—'
    );
}

export function formatAdminNewMessage(
    booking: BookingPayload,
    approveUrl: string,
    proposeUrl: string
): string {
    return [
        'Új időpontfoglalás érkezett – elfogadásra vár!',
        '',
        `Név: ${booking.customerName}`,
        `Felhasználónév: ${booking.username || '—'}`,
        `E-mail: ${booking.customerEmail}`,
        `Dátum: ${formatDateHu(booking.date)}`,
        `Időpont(ok): ${booking.times.join(', ')}`,
        `Óra típusa: ${typeLabel(booking.lessonType)}`,
        `Témakör: ${booking.selectedSubject}`,
        `Megjegyzés: ${booking.hobby || '—'}`,
        `Ár: ${displayPrice(booking).toLocaleString('hu-HU')} Ft`,
        `Számlázási cím: ${addressLine(booking)}`,
        `Csatolt fájlok:\n  ${formatAttachmentsLine(booking.uploadedFiles)}`,
        `Beküldve: ${new Date(booking.submittedAt).toLocaleString('hu-HU')}`,
        `Foglalás ID: ${booking.id}`,
        '',
        'A diák még NEM kapott levelet. Itt, az e-mailből dönthetsz:',
        '',
        'Elfogadom ezt az időpontot:',
        approveUrl,
        '',
        'Ha nem jó, javasolj másik időpontot:',
        proposeUrl,
        '',
        'Ha a diák elfogadja a javaslatot, kapsz róla e-mailt.',
    ].join('\n');
}

function formatAdminNewHtml(
    booking: BookingPayload,
    approveUrl: string,
    proposeUrl: string
): string {
    const rows: Array<[string, string]> = [
        ['Név', booking.customerName],
        ['Felhasználónév', booking.username || '—'],
        ['E-mail', booking.customerEmail],
        ['Dátum', formatDateHu(booking.date)],
        ['Időpont(ok)', booking.times.join(', ')],
        ['Óra típusa', typeLabel(booking.lessonType)],
        ['Témakör', booking.selectedSubject || '—'],
        ['Megjegyzés', booking.hobby || '—'],
        ['Ár', `${displayPrice(booking).toLocaleString('hu-HU')} Ft`],
        ['Számlázási cím', addressLine(booking)],
        ['Csatolt fájlok', formatAttachmentsLine(booking.uploadedFiles)],
        ['Foglalás ID', booking.id],
    ];
    const table = rows
        .map(
            ([k, v]) =>
                `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(v)}</td></tr>`
        )
        .join('');
    return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f6f7f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px 24px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;">Új foglalás</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">A diák még nem kapott levelet. Itt dönthetsz:</p>
          <table role="presentation" style="margin:0 0 20px;font-size:14px;line-height:1.45;">${table}</table>
          <p style="margin:0 0 12px;">
            <a href="${escapeHtml(approveUrl)}" style="display:inline-block;background:#0b6e4f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:15px;">
              Elfogadom ezt az időpontot
            </a>
          </p>
          <p style="margin:0 0 20px;">
            <a href="${escapeHtml(proposeUrl)}" style="display:inline-block;background:#ffffff;color:#0b6e4f;border:2px solid #0b6e4f;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:15px;">
              Másik időpontot javaslok
            </a>
          </p>
          <p style="margin:0;font-size:12px;color:#777;line-height:1.45;">
            Ha a gombok nem működnek, nyisd meg a sima szöveges linkeket.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatStudentApprovedHtml(booking: BookingPayload, extras?: MailBuildExtras): string {
    const calUrl = getGoogleCalendarUrl(booking);
    const buttons = [
        calUrl ? `<p style="margin:0 0 12px;">${emailBtn(calUrl, 'Naptárba mentés', 'primary')}</p>` : '',
        extras?.cancelUrl
            ? `<p style="margin:0 0 8px;">${emailBtn(extras.cancelUrl, 'Lemondás', 'danger')}</p>`
            : '',
    ]
        .filter(Boolean)
        .join('');
    return wrapStudentHtml(
        'Foglalásod jóváhagyva',
        `${studentWelcomeHtml()}
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">Az órád be van írva, ${escapeHtml(booking.customerName)}. Itt a részletek:</p>
          ${studentDetailsTable(booking)}
          ${buttons}
          ${policyBlock()}
          <p style="margin:16px 0 0;font-size:14px;line-height:1.5;">Egy nappal az óra előtt emlékeztetőt is küldünk.</p>
          ${studentSignoffHtml()}`
    );
}

function formatProposeTimeHtml(
    booking: BookingPayload,
    date: string,
    times: string[],
    respondUrl: string,
    cancelUrl?: string
): string {
    const buttons = [
        `<p style="margin:0 0 12px;">${emailBtn(respondUrl, 'Elfogadom / másik időpontot kérek', 'primary')}</p>`,
        cancelUrl ? `<p style="margin:0 0 8px;">${emailBtn(cancelUrl, 'Lemondás', 'danger')}</p>` : '',
    ].join('');
    return wrapStudentHtml(
        'Másik időpontot javasolunk',
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.5;">Kedves ${escapeHtml(booking.customerName)}! A kért időpont sajnos nem jó. Ezt javasoljuk helyette:</p>
          ${studentDetailsTable(booking, date, times)}
          ${buttons}
          ${policyBlock()}
          <p style="margin:16px 0 0;font-size:13px;color:#555;">Üdvözlettel,<br>Mihaszna Matek</p>`
    );
}

function formatReminderHtml(booking: BookingPayload, extras?: MailBuildExtras): string {
    const calUrl = getGoogleCalendarUrl(booking);
    const loc =
        booking.lessonType === 'personal'
            ? 'Az óra személyesen lesz (Fót).'
            : 'Az óra online lesz — a linket / belépési infót e-mailben vagy Messengeren egyeztetjük.';
    const buttons = [
        calUrl ? `<p style="margin:0 0 12px;">${emailBtn(calUrl, 'Naptárba mentés', 'primary')}</p>` : '',
        extras?.cancelUrl
            ? `<p style="margin:0 0 8px;">${emailBtn(extras.cancelUrl, 'Lemondás', 'danger')}</p>`
            : '',
    ]
        .filter(Boolean)
        .join('');
    return wrapStudentHtml(
        'Holnap matekóra',
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.5;">Kedves ${escapeHtml(booking.customerName)}!</p>
          ${studentDetailsTable(booking)}
          <p style="margin:0 0 16px;font-size:14px;line-height:1.5;">${escapeHtml(loc)}</p>
          ${buttons}
          ${policyBlock()}
          <p style="margin:16px 0 0;font-size:13px;color:#555;">Üdvözlettel,<br>Mihaszna Matek</p>`
    );
}

function formatStudentCancelledHtml(booking: BookingPayload): string {
    return wrapStudentHtml(
        'Foglalásod lemondva',
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.5;">Kedves ${escapeHtml(booking.customerName)}! A foglalásod sikeresen lemondva.</p>
          ${studentDetailsTable(booking)}
          ${policyBlock()}
          <p style="margin:16px 0 0;font-size:14px;line-height:1.5;">Ha máskor szeretnél órát, foglalj újra a honlapon.</p>
          <p style="margin:16px 0 0;font-size:13px;color:#555;">Üdvözlettel,<br>Mihaszna Matek</p>`
    );
}

export function formatStudentDecisionMessage(
    booking: BookingPayload,
    decision: 'approved' | 'rejected',
    extras?: MailBuildExtras
): string {
    const dateHu = formatDateHu(booking.date);
    if (decision === 'approved') {
        return [
            STUDENT_WELCOME_LINES[0],
            STUDENT_WELCOME_LINES[1],
            '',
            `Az órád be van írva, ${booking.customerName}. Itt a részletek:`,
            '',
            `Dátum: ${dateHu}`,
            `Időpontok: ${booking.times.join(', ')}`,
            `Óra típusa: ${typeLabel(booking.lessonType)}`,
            `Témakör: ${booking.selectedSubject}`,
            `Összesen: ${displayPrice(booking).toLocaleString('hu-HU')} Ft`,
            '',
            CANCEL_POLICY_HU,
            '',
            extras?.cancelUrl ? 'Lemondáshoz használd a gombot az e-mailben.' : '',
            '',
            'Egy nappal az óra előtt emlékeztető e-mailt is küldünk.',
            '',
            'Ha kérdésed van, írj bátran erre az e-mailre.',
            '',
            'Találkozunk az órán!',
            'Zsolt',
            'Mihaszna Matek',
            ADMIN_BOOKING_EMAIL,
        ].join('\n');
    }
    return [
        `Kedves ${booking.customerName}!`,
        '',
        'Sajnos a foglalási kérelmedet most nem tudjuk elfogadni.',
        '',
        `📅 Kért dátum: ${dateHu}`,
        `⏰ Kért időpontok: ${booking.times.join(', ')}`,
        '',
        'Ha szeretnél máskor időpontot, foglalj újra az oldalon, vagy írj nekünk.',
        '',
        'Üdvözlettel,',
        'Mihaszna Matek',
        ADMIN_BOOKING_EMAIL,
    ].join('\n');
}

export function formatStudentReceivedMessage(booking: BookingPayload): string {
    return [
        `Kedves ${booking.customerName}!`,
        '',
        'Megkaptuk az időpontfoglalási kérelmedet. Hamarosan visszajelzünk e-mailben.',
        '',
        `📅 Dátum: ${formatDateHu(booking.date)}`,
        `⏰ Időpontok: ${booking.times.join(', ')}`,
        `📍 Óra típusa: ${typeLabel(booking.lessonType)}`,
        `💰 Összesen: ${displayPrice(booking).toLocaleString('hu-HU')} Ft`,
        '',
        'Üdvözlettel,',
        'Mihaszna Matek',
    ].join('\n');
}

export function formatAdminCancelledMessage(booking: BookingPayload, dashboardUrl: string): string {
    return [
        'Egy diák lemondta a foglalását.',
        '',
        `Név: ${booking.customerName}`,
        `E-mail: ${booking.customerEmail}`,
        `Dátum: ${formatDateHu(booking.date)}`,
        `Időpont(ok): ${(booking.times || []).join(', ')}`,
        `Óra típusa: ${typeLabel(booking.lessonType)}`,
        `Témakör: ${booking.selectedSubject || '—'}`,
        `Foglalás ID: ${booking.id}`,
        '',
        'Dashboard:',
        dashboardUrl,
    ].join('\n');
}

export function formatStudentCancelledMessage(booking: BookingPayload): string {
    return [
        `Kedves ${booking.customerName}!`,
        '',
        'Foglalásod sikeresen lemondva.',
        '',
        `📅 Dátum: ${formatDateHu(booking.date)}`,
        `⏰ Időpontok: ${(booking.times || []).join(', ')}`,
        '',
        CANCEL_POLICY_HU,
        '',
        'Ha máskor szeretnél órát, foglalj újra a honlapon.',
        '',
        'Üdvözlettel,',
        'Mihaszna Matek',
        ADMIN_BOOKING_EMAIL,
    ].join('\n');
}

export function formatLessonReminderMessage(booking: BookingPayload): string {
    const times = (booking.times || []).join(', ');
    return [
        `Kedves ${booking.customerName}!`,
        '',
        '⏰ Emlékeztető: holnap matekóra!',
        '',
        `📅 Dátum: ${formatDateHu(booking.date)}`,
        `⏰ Időpontok: ${times}`,
        `📍 Óra típusa: ${typeLabel(booking.lessonType)}`,
        `📚 Témakör: ${booking.selectedSubject || '—'}`,
        '',
        booking.lessonType === 'personal'
            ? 'Az óra személyesen lesz (Fót).'
            : 'Az óra online lesz — a linket / belépési infót e-mailben / Messengeren egyeztetjük.',
        '',
        CANCEL_POLICY_HU,
        '',
        'Ha mégsem tudsz jönni, a lemondás gombbal vagy a Profilom → Óráim menüben mondhatod le.',
        '',
        'Üdvözlettel,',
        'Mihaszna Matek',
        ADMIN_BOOKING_EMAIL,
    ].join('\n');
}

export function buildMailsForType(
    type: BookingEmailType,
    booking: BookingPayload,
    origin: string,
    extras?: MailBuildExtras
): MailPayload[] {
    const dashboardUrl = `${origin}/dashboard`;

    if (type === 'admin_new') {
        const approveUrl = extras?.approveUrl || `${origin}/dashboard`;
        const proposeUrl = extras?.proposeUrl || `${origin}/dashboard`;
        return [
            {
                to: ADMIN_BOOKING_EMAIL,
                subject: `Új időpontfoglalás: ${booking.customerName} – ${booking.date} ${booking.times.join(', ')}`,
                text: formatAdminNewMessage(booking, approveUrl, proposeUrl),
                html: formatAdminNewHtml(booking, approveUrl, proposeUrl),
                replyTo: booking.customerEmail,
            },
        ];
    }

    if (type === 'propose_time') {
        const date = booking.proposedDate || booking.date;
        const times = booking.proposedTimes?.length ? booking.proposedTimes : booking.times;
        const respondUrl =
            extras?.respondUrl ||
            `${origin}/foglalas-valasz?id=${encodeURIComponent(booking.id)}&email=${encodeURIComponent(booking.customerEmail)}&date=${encodeURIComponent(date)}&times=${encodeURIComponent(times.join(','))}&name=${encodeURIComponent(booking.customerName)}&token=${encodeURIComponent(booking.proposalToken || '')}`;
        return [
            {
                to: booking.customerEmail,
                subject: `Másik időpontot javasolunk – ${date} ${times.join(', ')}`,
                text: [
                    `Kedves ${booking.customerName}!`,
                    '',
                    'A kért időpont sajnos nem jó. Ezt az időpontot javasoljuk helyette:',
                    `Dátum: ${formatDateHu(date)}`,
                    `Időpontok: ${times.join(', ')}`,
                    `Óra típusa: ${typeLabel(booking.lessonType)}`,
                    '',
                    'A gombbal el tudod fogadni, vagy másik időpontot kérni.',
                    '',
                    CANCEL_POLICY_HU,
                    '',
                    'Üdvözlettel,',
                    'Mihaszna Matek',
                ].join('\n'),
                html: formatProposeTimeHtml(booking, date, times, respondUrl, extras?.cancelUrl),
                replyTo: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    if (type === 'student_counter') {
        const approveUrl = extras?.approveUrl || `${origin}/dashboard`;
        const proposeUrl = extras?.proposeUrl || `${origin}/dashboard`;
        return [
            {
                to: ADMIN_BOOKING_EMAIL,
                subject: `A diák másik időpontot kér: ${booking.customerName} – ${booking.date} ${booking.times.join(', ')}`,
                text: [
                    `${booking.customerName} nem tudja a javasolt időpontot, ezt kéri helyette:`,
                    '',
                    `Név: ${booking.customerName}`,
                    `E-mail: ${booking.customerEmail}`,
                    `📅 ${formatDateHu(booking.date)}`,
                    `⏰ ${booking.times.join(', ')}`,
                    `Foglalás ID: ${booking.id}`,
                    '',
                    'Elfogadom ezt az időpontot:',
                    approveUrl,
                    '',
                    'Ha ez sem jó, javasolj másikat:',
                    proposeUrl,
                ].join('\n'),
                html: formatAdminNewHtml(booking, approveUrl, proposeUrl),
                replyTo: booking.customerEmail,
            },
        ];
    }

    if (type === 'proposal_accepted') {
        const date = booking.proposedDate || booking.date;
        const times = booking.proposedTimes?.length ? booking.proposedTimes : booking.times;
        return [
            {
                to: ADMIN_BOOKING_EMAIL,
                subject: `A diák elfogadta a javasolt időpontot: ${booking.customerName} – ${date} ${times.join(', ')}`,
                text: [
                    `${booking.customerName} elfogadta a javasolt időpontot.`,
                    '',
                    `E-mail: ${booking.customerEmail}`,
                    `📅 ${formatDateHu(date)}`,
                    `⏰ ${times.join(', ')}`,
                    `Foglalás ID: ${booking.id}`,
                    '',
                    dashboardUrl,
                ].join('\n'),
                replyTo: booking.customerEmail,
            },
        ];
    }

    if (type === 'booking_cancelled') {
        return [
            {
                to: ADMIN_BOOKING_EMAIL,
                subject: `Lemondás: ${booking.customerName} – ${booking.date} ${(booking.times || []).join(', ')}`,
                text: formatAdminCancelledMessage(booking, dashboardUrl),
                replyTo: booking.customerEmail,
            },
            {
                to: booking.customerEmail,
                subject: `Foglalásod lemondva – ${booking.date}`,
                text: formatStudentCancelledMessage(booking),
                html: formatStudentCancelledHtml(booking),
                replyTo: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    if (type === 'lesson_reminder') {
        const times = (booking.times || []).join(', ');
        return [
            {
                to: booking.customerEmail,
                subject: `Holnap óra – ${booking.date} ${times}`,
                text: formatLessonReminderMessage(booking),
                html: formatReminderHtml(booking, extras),
                replyTo: ADMIN_BOOKING_EMAIL,
                cc: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    const decision = type === 'student_approved' ? 'approved' : 'rejected';
    // #region agent log
    agentDebugLog({
        hypothesisId: 'E',
        location: 'emailTemplates.ts:buildMailsForType',
        message: 'student decision mail built',
        data: {
            type,
            lessonType: booking.lessonType,
            typeLabel: typeLabel(booking.lessonType),
            hasCancelUrl: Boolean(extras?.cancelUrl),
            hasHtml: decision === 'approved',
        },
        runId: 'lesson-type-email',
    });
    // #endregion
    return [
        {
            to: booking.customerEmail,
            subject:
                decision === 'approved'
                    ? `Foglalásod jóváhagyva – ${booking.date}`
                    : `Foglalási kérelem – ${booking.date}`,
            text: formatStudentDecisionMessage(booking, decision, extras),
            html: decision === 'approved' ? formatStudentApprovedHtml(booking, extras) : undefined,
            replyTo: ADMIN_BOOKING_EMAIL,
            cc: ADMIN_BOOKING_EMAIL,
        },
    ];
}
