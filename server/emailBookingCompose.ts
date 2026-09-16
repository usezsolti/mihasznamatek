import type { PackedSlot, RequestedSlot, StudentWindow } from '../utils/bookingPackedSlots';
import { formatSlotHu } from '../utils/bookingPackedSlots';
import { LESSON_PRICE_PER_HOUR } from '../utils/booking/types';

export type DraftKind = 'ask_window' | 'offer' | 'confirm';

export type ComposedMail = {
    text: string;
    html: string;
};

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function greeting(studentName: string): string {
    const name = studentName.trim();
    if (!name || name.toLowerCase() === 'szia') return 'Szia!';
    return `Szia ${name}!`;
}

function priceLine(): string {
    return `Egy óra 60 perc, ${LESSON_PRICE_PER_HOUR.toLocaleString('hu-HU')} Ft.`;
}

function slotListText(slots: Array<PackedSlot | RequestedSlot>): string {
    return slots.map((s, i) => `${i + 1}. ${formatSlotHu(s)}`).join('\n');
}

function slotPills(slots: Array<PackedSlot | RequestedSlot>): string {
    return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:12px 0 16px;width:100%;">
      ${slots
          .map(
              (s, i) => `<tr><td style="padding:0 0 8px;">
        <div style="background:#0c1016;border:1px solid rgba(57,255,20,0.35);border-radius:12px;padding:12px 14px;color:#e8f0ea;font-size:15px;font-weight:700;">
          ${i + 1}. ${escapeHtml(formatSlotHu(s))}
        </div>
      </td></tr>`
          )
          .join('')}
    </table>`;
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
<body style="margin:0;padding:0;background:#07090c;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#07090c;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;border-collapse:separate;">
        <tr><td style="background:#0c1016;border:1px solid rgba(57,255,20,0.28);border-radius:16px 16px 0 0;padding:20px 24px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#39ff14;font-weight:800;">${escapeHtml(opts.kicker || 'Mihaszna Matek')}</p>
          <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#e8f0ea;">${escapeHtml(opts.title)}</p>
        </td></tr>
        <tr><td style="background:#ffffff;border-left:1px solid rgba(57,255,20,0.18);border-right:1px solid rgba(57,255,20,0.18);padding:24px;">
          ${opts.innerHtml}
        </td></tr>
        <tr><td style="background:#0c1016;border:1px solid rgba(57,255,20,0.28);border-top:0;border-radius:0 0 16px 16px;padding:14px 24px;">
          <p style="margin:0;font-size:12px;color:#a8b8b0;line-height:1.5;">
            Zsolt · Mihaszna Matek<br>
            <a href="${site}" style="color:#39ff14;text-decoration:none;">mihasznamatek.hu</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function studentHtml(hi: string, paragraphs: string[], slots?: Array<PackedSlot | RequestedSlot>): string {
    const paras = paragraphs
        .map(
            (p) =>
                `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#222;">${escapeHtml(p)}</p>`
        )
        .join('');
    return wrapMihasznaMailHtml({
        title: 'Matekóra',
        innerHtml: `<p style="margin:0 0 14px;font-size:16px;font-weight:700;line-height:1.5;color:#111;">${escapeHtml(hi)}</p>${paras}${slots?.length ? slotPills(slots) : ''}<p style="margin:18px 0 0;font-size:14px;color:#444;">Üdv,<br><strong>Zsolt</strong></p>`,
    });
}

export function composeBookingDraft(opts: {
    kind: DraftKind;
    studentName: string;
    packed?: PackedSlot[];
    confirm?: RequestedSlot | PackedSlot;
    requestedButPacked?: PackedSlot[];
    window?: StudentWindow | null;
}): ComposedMail {
    const hi = greeting(opts.studentName);

    if (opts.kind === 'ask_window') {
        const paras = [
            hi,
            'Köszönöm a leveledet — matekórát egyeztetünk.',
            'Írd meg, mikor a legkorábbi, amikor jó lenne: napokat és sávot, pl. hétköznap 14 után, vagy szombat délelőtt.',
            'Ezekből olyan időpontot választok, ami a többi órához simul, hogy tömbben haladjunk.',
            priceLine(),
        ];
        return {
            text: `${paras.join('\n\n')}\n\nÜdv,\nZsolt`,
            html: studentHtml(hi, paras.slice(1)),
        };
    }

    if (opts.kind === 'confirm' && opts.confirm) {
        const when = formatSlotHu(opts.confirm);
        const paras = [
            hi,
            `Akkor ezt az időpontot lefoglaltam neked: ${when}.`,
            priceLine(),
            'Ha mégsem jó, írd meg minél előbb — addig ezt a sávot nem adom ki másnak.',
            'Találkozunk az órán!',
        ];
        return {
            text: `${paras.join('\n\n')}\n\nÜdv,\nZsolt`,
            html: studentHtml(hi, paras.slice(1), [opts.confirm]),
        };
    }

    if (opts.requestedButPacked?.length) {
        const slots = opts.requestedButPacked;
        const paras = [
            hi,
            'A kért idő szabad lenne, de jobban belefér, ha a többi órához kapcsolódik. Ezek jönnének egymás után:',
            'Melyik a legkorábbi, ami neked is jó? Írd meg a sorszámot vagy a napot és az órát.',
            priceLine(),
        ];
        return {
            text: `${hi}\n\n${paras[1]}\n\n${slotListText(slots)}\n\n${paras[2]}\n\n${paras[3]}\n\nÜdv,\nZsolt`,
            html: studentHtml(hi, [paras[1], paras[2], paras[3]], slots),
        };
    }

    const packed = opts.packed || [];
    if (packed.length) {
        const paras = [
            hi,
            'Ezek a legkorábbi sávok, amik nálam egymáshoz simulnak:',
            'Melyik a legjobb? Írd meg a sorszámot (1, 2, 3) vagy a pontos időt.',
            priceLine(),
        ];
        return {
            text: `${hi}\n\n${paras[1]}\n\n${slotListText(packed)}\n\n${paras[2]}\n\n${paras[3]}\n\nÜdv,\nZsolt`,
            html: studentHtml(hi, [paras[1], paras[2], paras[3]], packed),
        };
    }

    const paras = [
        hi,
        'Most nem találtam szabad, egymás utáni sávot a megadott ablakban.',
        'Írd meg, van-e másik nap vagy későbbi hét, és újra nézem.',
    ];
    return {
        text: `${paras.join('\n\n')}\n\nÜdv,\nZsolt`,
        html: studentHtml(hi, paras.slice(1)),
    };
}

export function composeTeacherBookedDraft(opts: {
    studentName: string;
    studentEmail: string;
    slot: RequestedSlot | PackedSlot;
    bookingId: string;
}): ComposedMail {
    const when = formatSlotHu(opts.slot);
    const text = [
        'E-mail ügynök: időpont lefoglalva (piszkozat — te küldöd el, ha rendben van).',
        '',
        `Diák: ${opts.studentName}`,
        `E-mail: ${opts.studentEmail}`,
        `Időpont: ${when}`,
        `Foglalás ID: ${opts.bookingId}`,
        `Ár: ${LESSON_PRICE_PER_HOUR.toLocaleString('hu-HU')} Ft / 60 perc`,
        '',
        'A naptárban pending/approved foglalásként szerepel, a sávot másnak nem ajánlja.',
    ].join('\n');
    const html = wrapMihasznaMailHtml({
        kicker: 'Tanári értesítő',
        title: 'Időpont lefoglalva',
        innerHtml: `
          <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Az ügynök rögzítette a diák választott sávját. Ez a levél piszkozat — te küldöd el, ha rendben van.</p>
          ${slotPills([opts.slot])}
          <table role="presentation" style="font-size:14px;line-height:1.5;">
            <tr><td style="padding:4px 12px 4px 0;color:#666;">Diák</td><td style="font-weight:700;">${escapeHtml(opts.studentName)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666;">E-mail</td><td style="font-weight:700;">${escapeHtml(opts.studentEmail)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666;">Foglalás</td><td style="font-weight:700;">${escapeHtml(opts.bookingId)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666;">Ár</td><td style="font-weight:700;">${LESSON_PRICE_PER_HOUR.toLocaleString('hu-HU')} Ft</td></tr>
          </table>
        `,
    });
    return { text, html };
}
