/**
 * Server-side free-slot lookup for MihAIy / booking helpers.
 * Uses Prisma for bookings, blocked slots, and working hours.
 */
import { prisma } from '../server/prisma';
import { asStringArray } from '../server/bookingMappers';
import { parseJsonField } from '../server/jsonField';
import {
    DEFAULT_WORKING_HOURS,
    getSlotsForDateKey,
    normalizeWorkingHours,
    type WorkingHoursMap,
} from './bookingSlots';

export type DayAvailability = {
    dateKey: string;
    weekdayHu: string;
    freeSlots: string[];
    takenSlots: string[];
    workingSlots: string[];
    source: 'admin' | 'public-partial';
    note?: string;
};

const WEEKDAY_HU = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];

/** Mai / holnapi dátumkulcs Budapest időzónában (YYYY-MM-DD). */
export function getBudapestDateKeyOffset(daysFromToday: number): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Budapest',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    const y = Number(parts.find((p) => p.type === 'year')?.value);
    const m = Number(parts.find((p) => p.type === 'month')?.value);
    const d = Number(parts.find((p) => p.type === 'day')?.value);
    const base = new Date(Date.UTC(y, m - 1, d));
    base.setUTCDate(base.getUTCDate() + daysFromToday);
    const yy = base.getUTCFullYear();
    const mm = String(base.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(base.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

function weekdayForDateKey(dateKey: string): string {
    const d = new Date(dateKey + 'T12:00:00');
    return WEEKDAY_HU[d.getDay()] || '';
}

async function loadWorkingHours(): Promise<WorkingHoursMap> {
    try {
        const row = await prisma.setting.findUnique({ where: { id: 'workingHours' } });
        if (row?.value) {
            return normalizeWorkingHours(parseJsonField(row.value, { hours: DEFAULT_WORKING_HOURS }));
        }
    } catch (e) {
        console.warn('workingHours load failed', e);
    }
    return normalizeWorkingHours(DEFAULT_WORKING_HOURS);
}

async function loadTakenTimes(
    dateKey: string,
    workingSlots: string[]
): Promise<{ taken: Set<string>; source: 'admin' | 'public-partial' }> {
    const taken = new Set<string>();

    try {
        const blocked = await prisma.blockedSlot.findUnique({ where: { date: dateKey } });
        if (blocked) {
            if (blocked.allDay) workingSlots.forEach((t) => taken.add(t));
            else asStringArray(blocked.times).forEach((t) => taken.add(t));
        }
    } catch (e) {
        console.warn('blockedSlots load failed', e);
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                date: dateKey,
                status: { in: ['pending', 'approved'] },
            },
            select: { times: true },
        });
        bookings.forEach((row) => {
            asStringArray(row.times).forEach((t) => taken.add(t));
        });
        return { taken, source: 'admin' };
    } catch (e) {
        console.warn('bookings load failed', e);
    }

    return { taken, source: 'public-partial' };
}

/** Parse "ma/today/holnap/tomorrow/YYYY-MM-DD" from chat text. */
export function parseRequestedDateKey(message: string): string | null {
    const m = message.toLowerCase();
    if (/\b(ma|today|mai nap)\b/.test(m) || /book.*today|foglal.*ma|ma.*szabad|szabad.*ma/.test(m)) {
        return getBudapestDateKeyOffset(0);
    }
    if (/\b(holnap|tomorrow)\b/.test(m)) {
        return getBudapestDateKeyOffset(1);
    }
    const iso = message.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
    if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

    const huMonth: Record<string, number> = {
        januar: 1,
        februar: 2,
        marcius: 3,
        aprilis: 4,
        majus: 5,
        junius: 6,
        julius: 7,
        augusztus: 8,
        szeptember: 9,
        oktober: 10,
        november: 11,
        december: 12,
    };
    const norm = m.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [name, month] of Object.entries(huMonth)) {
        const re = new RegExp(`${name}\\s+(\\d{1,2})`);
        const hit = norm.match(re);
        if (hit) {
            const day = Number(hit[1]);
            const year = Number(getBudapestDateKeyOffset(0).slice(0, 4));
            const mm = String(month).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            return `${year}-${mm}-${dd}`;
        }
    }
    return null;
}

export function isAvailabilityIntent(message: string): boolean {
    const m = message
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (/\bfoglalkoz/.test(m)) return false;

    const bookingVerb =
        /\b(idopont(?:ot|otok|foglal(?:as|ni|ok|hatok)?)?|foglal(?:as|ni|ok|hatok|junk)?|appointment|booking|book(?:ing)?)\b/.test(
            m
        ) || /\bbook\s+appoint/.test(m);

    const freeSlot =
        /\b(szabad\s*orak?|szabad\s*idopont|free\s*hours?|free\s*slots?|availability|available\s*slots?|open\s*hours?)\b/.test(
            m
        ) || /\bmikor\s+(van|erhet).*?(szabad|ora|idopont)/.test(m);

    const zsoltiSchedule =
        /\bzsolti\b/.test(m) &&
        /\b(szabad|ora|idopont|foglal|book|available|mikor|today|ma|holnap)\b/.test(m);

    return bookingVerb || freeSlot || zsoltiSchedule;
}

export async function getDayAvailability(dateKey: string): Promise<DayAvailability> {
    const hours = await loadWorkingHours();
    const workingSlots = getSlotsForDateKey(dateKey, hours);
    const { taken, source } = await loadTakenTimes(dateKey, workingSlots);
    const freeSlots = workingSlots.filter((t) => !taken.has(t));
    const takenSlots = workingSlots.filter((t) => taken.has(t));

    return {
        dateKey,
        weekdayHu: weekdayForDateKey(dateKey),
        freeSlots,
        takenSlots,
        workingSlots,
        source,
        note:
            source === 'public-partial'
                ? 'Some bookings may not be visible server-side — confirm on /booking.'
                : undefined,
    };
}

export function formatAvailabilityReply(avail: DayAvailability, lang: 'hu' | 'en'): string {
    const { dateKey, weekdayHu, freeSlots, source } = avail;
    const bookingUrl = '/booking';

    if (!avail.workingSlots.length) {
        return lang === 'en'
            ? `Zsolti has no working hours on ${dateKey} (${weekdayHu}). Try another day, or visit the appointment booking page: ${bookingUrl}`
            : `Zsoltinak nincs munkaideje ${dateKey}-én (${weekdayHu}). Próbálj másik napot, vagy látogasd meg az időpontfoglaló oldalt: ${bookingUrl}`;
    }
    if (!freeSlots.length) {
        return lang === 'en'
            ? `On ${dateKey} (${weekdayHu}) Zsolti has no free hours left. Try tomorrow, or visit the appointment booking page for other days: ${bookingUrl}`
            : `${dateKey}-én (${weekdayHu}) Zsoltinak sajnos nincs szabad órája. Próbáld holnap, vagy nézd az időpontfoglaló oldalt más napokra: ${bookingUrl}`;
    }

    const list = freeSlots.join(', ');
    const bookHint =
        lang === 'en'
            ? `To reserve a slot, visit the appointment booking page, pick ${dateKey} and one free hour (e.g. ${freeSlots[0]}), then confirm: ${bookingUrl}`
            : `Foglaláshoz látogasd meg az időpontfoglaló oldalt, válaszd a ${dateKey} napot és egy szabad órát (pl. ${freeSlots[0]}), majd erősítsd meg: ${bookingUrl}`;

    const partial =
        source === 'public-partial'
            ? lang === 'en'
                ? ' (Please double-check on the appointment booking page.)'
                : ' (Kérlek ellenőrizd az időpontfoglaló oldalon is.)'
            : '';

    return lang === 'en'
        ? `Zsolti's free hours on ${dateKey} (${weekdayHu}): ${list}.${partial}\n\n${bookHint}`
        : `Zsolti szabad órái ${dateKey}-én (${weekdayHu}): ${list}.${partial}\n\n${bookHint}`;
}
