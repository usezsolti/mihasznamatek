import { getGoogleCalendarUrl } from '../bookingCalendar';
import {
    ADMIN_BOOKING_EMAIL,
    formatAttachmentsLine,
    type BookingEmailType,
    type BookingPayload,
    type MailPayload,
} from './types';

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

export function formatAdminNewMessage(booking: BookingPayload, dashboardUrl: string): string {
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
        'Elfogadáshoz / elutasításhoz nyisd meg a dashboardot:',
        dashboardUrl,
    ].join('\n');
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
    origin: string
): MailPayload[] {
    const dashboardUrl = `${origin}/dashboard`;

    if (type === 'admin_new') {
        return [
            {
                to: ADMIN_BOOKING_EMAIL,
                subject: `Új időpontfoglalás: ${booking.customerName} – ${booking.date} ${booking.times.join(', ')}`,
                text: formatAdminNewMessage(booking, dashboardUrl),
                replyTo: booking.customerEmail,
            },
            {
                to: booking.customerEmail,
                subject: `Megkaptuk a foglalásod – Mihaszna Matek (${booking.date})`,
                text: formatStudentReceivedMessage(booking),
                replyTo: ADMIN_BOOKING_EMAIL,
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
