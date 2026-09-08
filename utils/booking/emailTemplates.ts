import { getGoogleCalendarUrl } from '../bookingCalendar';
import {
    ADMIN_BOOKING_EMAIL,
    formatAttachmentsLine,
    type BookingEmailType,
    type BookingPayload,
    type MailBuildExtras,
    type MailPayload,
} from './types';

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
    return lessonType === 'online' ? 'Online' : 'Személyes (Fót)';
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
        `E-mail: ${booking.customerEmail}`,
        `Dátum: ${formatDateHu(booking.date)}`,
        `Időpont(ok): ${booking.times.join(', ')}`,
        `Óra típusa: ${typeLabel(booking.lessonType)}`,
        `Témakör: ${booking.selectedSubject}`,
        `Megjegyzés: ${booking.hobby || '—'}`,
        `Ár: ${booking.totalPrice.toLocaleString('hu-HU')} Ft`,
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
        ['E-mail', booking.customerEmail],
        ['Dátum', formatDateHu(booking.date)],
        ['Időpont(ok)', booking.times.join(', ')],
        ['Óra típusa', typeLabel(booking.lessonType)],
        ['Témakör', booking.selectedSubject || '—'],
        ['Megjegyzés', booking.hobby || '—'],
        ['Ár', `${booking.totalPrice.toLocaleString('hu-HU')} Ft`],
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

export function formatStudentDecisionMessage(
    booking: BookingPayload,
    decision: 'approved' | 'rejected'
): string {
    const dateHu = formatDateHu(booking.date);
    if (decision === 'approved') {
        const calUrl = getGoogleCalendarUrl(booking);
        return [
            `Kedves ${booking.customerName}!`,
            '',
            '✅ Foglalásod jóváhagyva!',
            '',
            `📅 Dátum: ${dateHu}`,
            `⏰ Időpontok: ${booking.times.join(', ')}`,
            `📍 Óra típusa: ${typeLabel(booking.lessonType)}`,
            `📚 Témakör: ${booking.selectedSubject}`,
            `💰 Összesen: ${booking.totalPrice.toLocaleString('hu-HU')} Ft`,
            ...(calUrl ? ['', 'Naptárba mentés (Google):', calUrl] : []),
            '',
            'Egy nappal az óra előtt emlékeztető e-mailt is küldünk.',
            '',
            'Várunk az órán!',
            '',
            'Üdvözlettel,',
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
        `💰 Összesen: ${booking.totalPrice.toLocaleString('hu-HU')} Ft`,
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
        'Ha máskor szeretnél órát, foglalj újra a honlapon.',
        '',
        'Üdvözlettel,',
        'Mihaszna Matek',
        ADMIN_BOOKING_EMAIL,
    ].join('\n');
}

export function formatLessonReminderMessage(booking: BookingPayload): string {
    const times = (booking.times || []).join(', ');
    const calUrl = getGoogleCalendarUrl(booking);
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
        booking.lessonType === 'online'
            ? 'Az óra online lesz — a linket / belépési infót e-mailben / Messengeren egyeztetjük.'
            : 'Az óra személyesen lesz (Fót).',
        ...(calUrl ? ['', 'Naptárba mentés (Google):', calUrl] : []),
        '',
        'Ha mégsem tudsz jönni, mondd le a Dashboard → Profilom → Óráim menüben.',
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
        const acceptUrl = `${origin}/foglalas-valasz?id=${encodeURIComponent(booking.id)}&email=${encodeURIComponent(booking.customerEmail)}&date=${encodeURIComponent(date)}&times=${encodeURIComponent(times.join(','))}&name=${encodeURIComponent(booking.customerName)}&token=${encodeURIComponent(booking.proposalToken || '')}`;
        return [
            {
                to: booking.customerEmail,
                subject: `Másik időpontot javasolunk – ${date} ${times.join(', ')}`,
                text: [
                    `Kedves ${booking.customerName}!`,
                    '',
                    'A kért időpont sajnos nem jó. Ezt az időpontot javasoljuk helyette:',
                    `📅 ${formatDateHu(date)}`,
                    `⏰ ${times.join(', ')}`,
                    '',
                    'Ha megfelel, nyisd meg ezt a linket:',
                    acceptUrl,
                    '',
                    'Üdvözlettel,',
                    'Mihaszna Matek',
                ].join('\n'),
                replyTo: ADMIN_BOOKING_EMAIL,
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
                replyTo: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    if (type === 'lesson_reminder') {
        const times = (booking.times || []).join(', ');
        return [
            {
                to: booking.customerEmail,
                subject: `⏰ Holnap óra – ${booking.date} ${times}`,
                text: formatLessonReminderMessage(booking),
                replyTo: ADMIN_BOOKING_EMAIL,
                cc: ADMIN_BOOKING_EMAIL,
            },
        ];
    }

    const decision = type === 'student_approved' ? 'approved' : 'rejected';
    return [
        {
            to: booking.customerEmail,
            subject:
                decision === 'approved'
                    ? `✅ Foglalásod jóváhagyva – ${booking.date}`
                    : `Foglalási kérelem – ${booking.date}`,
            text: formatStudentDecisionMessage(booking, decision),
            replyTo: ADMIN_BOOKING_EMAIL,
            cc: ADMIN_BOOKING_EMAIL,
        },
    ];
}
