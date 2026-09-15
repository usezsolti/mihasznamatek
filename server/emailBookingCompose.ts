import type { PackedSlot, RequestedSlot, StudentWindow } from '../utils/bookingPackedSlots';
import { formatSlotHu } from '../utils/bookingPackedSlots';

export type DraftKind = 'ask_window' | 'offer' | 'confirm' | 'escalate_note';

export function composeBookingDraft(opts: {
    kind: DraftKind;
    studentName: string;
    packed?: PackedSlot[];
    confirm?: RequestedSlot | PackedSlot;
    requestedButPacked?: PackedSlot[];
    window?: StudentWindow | null;
}): string {
    const name = opts.studentName.trim() || 'Szia';
    const hi = name.toLowerCase() === 'szia' ? 'Szia!' : `Szia ${name}!`;

    if (opts.kind === 'ask_window') {
        return `${hi}

köszi a levelet. Mikor a legkorábbi, amikor jó lenne óra? Írd meg a napokat és a sávot, pl. hétköznap 14 után, vagy szombat délelőtt.

Ezekből választok majd egymás utáni időpontot, hogy a diákok tömbben legyenek.

Üdv,
Zsolt`;
    }

    if (opts.kind === 'confirm' && opts.confirm) {
        return `${hi}

akkor ezt raktam félre: ${formatSlotHu(opts.confirm)}. 60 perc, 11.000 Ft.

Ha mégsem jó, írd meg — addig ezt a sávot nem adom ki máshova.

Üdv,
Zsolt`;
    }

    if (opts.requestedButPacked?.length) {
        const list = opts.requestedButPacked.map((s) => `• ${formatSlotHu(s)}`).join('\n');
        return `${hi}

a kért idő szabad lenne, de jobban belefér, ha a többi órához kapcsolódik. Ezek jönnének egymás után:

${list}

Melyik a legkorábbi, ami neked is jó?

Üdv,
Zsolt`;
    }

    const packed = opts.packed || [];
    if (packed.length) {
        const list = packed.map((s) => `• ${formatSlotHu(s)}`).join('\n');
        return `${hi}

ezek a legkorábbi sávok, amik nálam egymáshoz simulnak:

${list}

Melyik a legjobb? 60 perc, 11.000 Ft.

Üdv,
Zsolt`;
    }

    return `${hi}

most nem találtam szabad egymás utáni sávot a megadott ablakban. Írd meg, van-e másik nap / későbbi hét, és újra nézem.

Üdv,
Zsolt`;
}
