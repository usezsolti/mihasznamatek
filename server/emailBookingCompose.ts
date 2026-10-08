import type { PackedSlot, RequestedSlot, StudentWindow } from '../utils/bookingPackedSlots';
import { CANCEL_POLICY_HU, LESSON_PRICE_PER_HOUR } from '../utils/booking/types';

export type DraftKind = 'ask_window' | 'offer' | 'confirm';

export type ComposedMail = {
    text: string;
    html: string;
};

const WEEKDAY_HU = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
const SIGN_OFF = 'Üdvözlettel,\nLieszkofszki Zsolt\nMihaszna Matek';

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function nl2br(s: string): string {
    return escapeHtml(s).replace(/\n/g, '<br>');
}

export function greeting(studentName: string): string {
    const name = studentName.trim();
    if (!name || name.toLowerCase() === 'szia' || name.includes('@')) {
        return 'Kedves Érdeklődő!';
    }
    return `Kedves ${name}!`;
}

function priceLine(): string {
    return `Egy alkalom 60 perc, díja ${LESSON_PRICE_PER_HOUR.toLocaleString('hu-HU')} Ft.`;
}

export function formatSlotProfessional(slot: PackedSlot | RequestedSlot): string {
    const weekday =
        'weekdayHu' in slot && slot.weekdayHu
            ? slot.weekdayHu
            : WEEKDAY_HU[new Date(`${slot.dateKey}T12:00:00`).getDay()] || '';
    const date = new Date(`${slot.dateKey}T12:00:00`).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const day = weekday ? weekday.charAt(0).toUpperCase() + weekday.slice(1) : '';
    return day ? `${day}, ${date}, ${slot.time}` : `${date}, ${slot.time}`;
}

function slotListText(slots: Array<PackedSlot | RequestedSlot>, nearestLabel = true): string {
    return slots
        .map((s, i) => {
            const label = i === 0 && nearestLabel ? ' (legközelebbi szabad)' : '';
            return `${i + 1}. ${formatSlotProfessional(s)}${label}`;
        })
        .join('\n');
}

function slotPills(slots: Array<PackedSlot | RequestedSlot>, nearestLabel = true): string {
    return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:4px 0 18px;width:100%;">
      ${slots
          .map((s, i) => {
              const nearest = i === 0 && nearestLabel;
              return `<tr><td style="padding:0 0 8px;">
        <div style="background:${nearest ? '#f3faf6' : '#f7f8fa'};border:1px solid ${
            nearest ? '#0b6e4f' : '#e4e7ec'
        };border-radius:10px;padding:12px 14px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${
              nearest ? '#0b6e4f' : '#667085'
          };font-weight:700;">${nearest ? 'Legközelebbi szabad időpont' : `${i + 1}. szabad időpont`}</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#101828;">${escapeHtml(
              formatSlotProfessional(s)
          )}</p>
        </div>
      </td></tr>`;
          })
          .join('')}
    </table>`;
}

function askBox(html: string): string {
    return `<div style="background:#f3faf6;border-left:4px solid #0b6e4f;border-radius:0 10px 10px 0;padding:14px 16px;margin:4px 0 18px;">
      ${html}
    </div>`;
}

export function wrapMihasznaMailHtml(opts: {
    kicker?: string;
    title: string;
    innerHtml: string;
}): string {
    const site = 'https://mihasznamatek.hu';
    return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f5;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f5;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;border-collapse:separate;">
        <tr><td style="background:#0b6e4f;border-radius:14px 14px 0 0;padding:20px 24px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#d8f3e6;font-weight:700;">${escapeHtml(opts.kicker || 'Mihaszna Matek')}</p>
          <p style="margin:6px 0 0;font-size:22px;font-weight:750;color:#ffffff;">${escapeHtml(opts.title)}</p>
        </td></tr>
        <tr><td style="background:#ffffff;border-left:1px solid #e4e7ec;border-right:1px solid #e4e7ec;padding:26px 24px;">
          ${opts.innerHtml}
        </td></tr>
        <tr><td style="background:#f8faf9;border:1px solid #e4e7ec;border-top:0;border-radius:0 0 14px 14px;padding:16px 24px;">
          <p style="margin:0;font-size:12px;color:#667085;line-height:1.55;">
            Lieszkofszki Zsolt · Mihaszna Matek<br>
            <a href="${site}" style="color:#0b6e4f;text-decoration:none;">mihasznamatek.hu</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function studentHtml(opts: {
    title: string;
    hi: string;
    paragraphs: string[];
    ask?: string;
    slots?: Array<PackedSlot | RequestedSlot>;
    nearestLabel?: boolean;
    afterSlots?: string[];
}): string {
    const paras = opts.paragraphs
        .map(
            (p) =>
                `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#344054;">${escapeHtml(p)}</p>`
        )
        .join('');
    const after = (opts.afterSlots || [])
        .map(
            (p) =>
                `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#344054;">${escapeHtml(p)}</p>`
        )
        .join('');
    const ask = opts.ask
        ? askBox(
              `<p style="margin:0 0 4px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#0b6e4f;font-weight:700;">Kérdés</p><p style="margin:0;font-size:15px;line-height:1.6;color:#101828;font-weight:600;">${escapeHtml(opts.ask)}</p>`
          )
        : '';
    return wrapMihasznaMailHtml({
        title: opts.title,
        innerHtml: `<p style="margin:0 0 16px;font-size:16px;font-weight:700;line-height:1.5;color:#101828;">${escapeHtml(opts.hi)}</p>${paras}${ask}${
            opts.slots?.length ? slotPills(opts.slots, opts.nearestLabel !== false) : ''
        }${after}<p style="margin:18px 0 0;font-size:14px;color:#475467;line-height:1.6;">${nl2br(SIGN_OFF)}</p>`,
    });
}

function mail(textParas: string[], html: string): ComposedMail {
    return {
        text: `${textParas.join('\n\n')}\n\n${SIGN_OFF}`,
        html,
    };
}

export function composeBookingDraft(opts: {
    kind: DraftKind;
    studentName: string;
    packed?: PackedSlot[];
    confirm?: RequestedSlot | PackedSlot;
    requestedButPacked?: PackedSlot[];
    /** A diák ezt kérte, de foglalt — a packed a helyette szabad sáv. */
    requestedTaken?: RequestedSlot;
    window?: StudentWindow | null;
}): ComposedMail {
    const hi = greeting(opts.studentName);

    if (opts.kind === 'ask_window') {
        const ask =
            'Melyik a számodra legközelebbi időpont, amikor tudnál jönni? Ezt összevetem a naptárammal, és ha szabad, azt egyeztetjük.';
        const paras = [
            'Köszönöm a leveledet. Örülök, hogy matekórát szeretnél — szívesen egyeztetünk időpontot.',
            'Ahhoz, hogy a lehető leghamarabb találjunk helyet, írd meg, kérlek, a számodra legközelebbi napot és órát. Elég egy sáv is, például: hétköznap 15 óra után, vagy szombat délelőtt.',
            'A válaszod alapján megnézem, hogy ez az időpont szabad-e. Ha foglalt, a naptáramban ehhez legközelebbi szabad órát ajánlom.',
            priceLine(),
        ];
        return mail([hi, ...paras, ask], studentHtml({
            title: 'Időpont-egyeztetés',
            hi,
            paragraphs: paras,
            ask,
        }));
    }

    if (opts.kind === 'confirm' && opts.confirm) {
        const when = formatSlotProfessional(opts.confirm);
        const paras = [
            `Köszönöm a visszajelzésed. Ezt az időpontot lefoglaltam számodra: ${when}.`,
            priceLine(),
            CANCEL_POLICY_HU,
            'Ha mégsem tudsz jönni, írj minél előbb, hogy a sávot fel tudjam oldani.',
            'Várlak az órán.',
        ];
        return mail([hi, ...paras], studentHtml({
            title: 'Óra lefoglalva',
            hi,
            paragraphs: paras,
            slots: [opts.confirm],
            nearestLabel: false,
        }));
    }

    if (opts.requestedTaken) {
        const when = formatSlotProfessional(opts.requestedTaken);
        const slots = opts.packed || [];
        const ask = slots.length
            ? 'Ezek közül melyik a számodra legközelebbi, amelyik jó? Elég a sorszám.'
            : 'Melyik másik nap és óra lenne jó? Újra megnézem, melyik sáv szabad.';
        const before = slots.length
            ? [`A kért időpont (${when}) foglalt. Ezek a hozzá legközelebbi szabad órák:`]
            : [`A kért időpont (${when}) foglalt, és azon a napon most nincs másik szabad órám.`];
        const after = [priceLine()];
        return mail(
            [hi, ...before, slots.length ? slotListText(slots) : '', ask, ...after].filter(Boolean),
            studentHtml({
                title: 'Szabad időpontok',
                hi,
                paragraphs: before,
                ask,
                slots,
                afterSlots: after,
            })
        );
    }

    if (opts.requestedButPacked?.length) {
        const slots = opts.requestedButPacked;
        const ask =
            'Melyik a számodra legközelebbi időpont ezek közül, amelyik jó is, és a naptáramban is szabad? Elég a sorszám.';
        const before = [
            'A kért időpont önmagában szabad lenne. A naptáram szerint azonban ezek a közeli, már meglévő órákhoz kapcsolódó szabad sávok jobban illeszkednek — így tudunk a lehető leghamarabb találkozni.',
        ];
        const after = [priceLine()];
        return mail(
            [hi, ...before, slotListText(slots), ask, ...after],
            studentHtml({
                title: 'Szabad időpontok',
                hi,
                paragraphs: before,
                ask,
                slots,
                afterSlots: after,
            })
        );
    }

    const packed = opts.packed || [];
    if (packed.length) {
        const ask =
            'A legközelebbi szabad időpont megfelel? Ha nem, melyik a számodra legkorábbi ezek közül, amelyik jó? Elég a sorszám.';
        const before = [
            'Köszönöm a visszajelzésed. A naptáramban ezek a számodra elérhető, legközelebbi szabad órák — az első a lehető leghamarabbi szabad sáv.',
        ];
        const after = [priceLine()];
        return mail(
            [hi, ...before, slotListText(packed), ask, ...after],
            studentHtml({
                title: 'Szabad időpontok',
                hi,
                paragraphs: before,
                ask,
                slots: packed,
                afterSlots: after,
            })
        );
    }

    const ask =
        'Melyik a következő, számodra legközelebbi időszak, amikor tudnál jönni? Újra megnézem, melyik sáv szabad.';
    const paras = [
        'Köszönöm, hogy írtál. A megadott időszakban jelenleg nincs szabad órám.',
        'Írd meg, kérlek, a következő napot vagy hetet, amikor jó lenne, és újra átnézem a naptárt.',
    ];
    return mail([hi, ...paras, ask], studentHtml({
        title: 'Időpont-egyeztetés',
        hi,
        paragraphs: paras,
        ask,
    }));
}

export function composeTeacherBookedDraft(opts: {
    studentName: string;
    studentEmail: string;
    slot: RequestedSlot | PackedSlot;
    bookingId: string;
}): ComposedMail {
    const when = formatSlotProfessional(opts.slot);
    const text = [
        'E-mail ügynök: időpont rögzítve.',
        'Ez piszkozat — csak akkor küldd el magadnak / a naplódba, ha a foglalás rendben van. A diáknak szánt választ külön küldöd.',
        '',
        `Diák: ${opts.studentName}`,
        `E-mail: ${opts.studentEmail}`,
        `Időpont: ${when}`,
        `Foglalás ID: ${opts.bookingId}`,
        `Díj: ${LESSON_PRICE_PER_HOUR.toLocaleString('hu-HU')} Ft / 60 perc`,
        '',
        'A naptárban approved foglalásként szerepel, a sávot másnak nem ajánlja.',
    ].join('\n');
    const html = wrapMihasznaMailHtml({
        kicker: 'Tanári értesítő · piszkozat',
        title: 'Időpont rögzítve',
        innerHtml: `
          <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#344054;">Az ügynök lefoglalta a diák választott, szabad sávját. Ez a levél piszkozat marad, amíg Te el nem küldöd.</p>
          ${slotPills([opts.slot], false)}
          <table role="presentation" style="font-size:14px;line-height:1.6;">
            <tr><td style="padding:4px 12px 4px 0;color:#667085;">Diák</td><td style="font-weight:700;color:#101828;">${escapeHtml(opts.studentName)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#667085;">E-mail</td><td style="font-weight:700;color:#101828;">${escapeHtml(opts.studentEmail)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#667085;">Foglalás</td><td style="font-weight:700;color:#101828;">${escapeHtml(opts.bookingId)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#667085;">Díj</td><td style="font-weight:700;color:#101828;">${LESSON_PRICE_PER_HOUR.toLocaleString('hu-HU')} Ft</td></tr>
          </table>
        `,
    });
    return { text, html };
}
