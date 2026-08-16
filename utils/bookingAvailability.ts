/**
 * Server-side free-slot lookup for MihAIy / booking helpers.
 * Uses Admin SDK when available; otherwise public settings + blockedSlots.
 */
import { getAdminDb } from '../server/firebaseAdmin';
import { FIRESTORE_DOCS_BASE } from '../server/config';
import { resolveFirebaseWebApiKey } from './firebasePublicConfig';
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

function firestoreValue(field: any): any {
    if (!field || typeof field !== 'object') return undefined;
    if ('stringValue' in field) return field.stringValue;
    if ('booleanValue' in field) return field.booleanValue;
    if ('integerValue' in field) return Number(field.integerValue);
    if ('arrayValue' in field) {
        return (field.arrayValue?.values || []).map(firestoreValue);
    }
    if ('mapValue' in field) {
        const out: Record<string, any> = {};
        const fields = field.mapValue?.fields || {};
        for (const [k, v] of Object.entries(fields)) out[k] = firestoreValue(v);
        return out;
    }
    if ('nullValue' in field) return null;
    return undefined;
}

async function fetchFirestoreDoc(path: string): Promise<Record<string, any> | null> {
    const key = resolveFirebaseWebApiKey();
    const url = `${FIRESTORE_DOCS_BASE}/${path}?key=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const fields = data?.fields || {};
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) out[k] = firestoreValue(v);
    return out;
}

async function listFirestoreCollection(collectionId: string): Promise<Array<{ id: string; data: Record<string, any> }>> {
    const key = resolveFirebaseWebApiKey();
    const url = `${FIRESTORE_DOCS_BASE}/${collectionId}?key=${encodeURIComponent(key)}&pageSize=300`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const docs = Array.isArray(data?.documents) ? data.documents : [];
    return docs.map((doc: any) => {
        const name = String(doc.name || '');
        const id = name.split('/').pop() || '';
        const fields = doc.fields || {};
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(fields)) out[k] = firestoreValue(v);
        return { id, data: out };
    });
}

async function loadWorkingHours(): Promise<WorkingHoursMap> {
    const db = getAdminDb();
    if (db) {
        try {
            const snap = await db.collection('settings').doc('workingHours').get();
            if (snap.exists) return normalizeWorkingHours(snap.data());
        } catch (e) {
            console.warn('admin workingHours failed', e);
        }
    }
    try {
        const doc = await fetchFirestoreDoc('settings/workingHours');
        if (doc) return normalizeWorkingHours(doc);
    } catch (e) {
        console.warn('public workingHours failed', e);
    }
    return normalizeWorkingHours(DEFAULT_WORKING_HOURS);
}

async function loadTakenTimes(dateKey: string, workingSlots: string[]): Promise<{ taken: Set<string>; source: 'admin' | 'public-partial' }> {
    const taken = new Set<string>();
    const db = getAdminDb();

    // Blocked slots (public)
    try {
        if (db) {
            const blocked = await db.collection('blockedSlots').doc(dateKey).get();
            if (blocked.exists) {
                const data = blocked.data() || {};
                if (data.allDay) workingSlots.forEach((t) => taken.add(t));
                else if (Array.isArray(data.times)) data.times.forEach((t: any) => taken.add(String(t)));
            }
        } else {
            const doc = await fetchFirestoreDoc(`blockedSlots/${dateKey}`);
            if (doc) {
                if (doc.allDay) workingSlots.forEach((t) => taken.add(t));
                else if (Array.isArray(doc.times)) doc.times.forEach((t: any) => taken.add(String(t)));
            }
        }
    } catch (e) {
        console.warn('blockedSlots load failed', e);
    }

    // Bookings (admin only — rules hide others' bookings from public)
    if (db) {
        try {
            const snap = await db.collection('bookings').where('date', '==', dateKey).get();
            snap.forEach((doc) => {
                const data = doc.data() || {};
                const status = String(data.status || 'pending');
                if (status === 'cancelled' || status === 'rejected') return;
                const times = Array.isArray(data.times) ? data.times : [];
                times.forEach((t: any) => taken.add(String(t)));
            });
            return { taken, source: 'admin' };
        } catch (e) {
            console.warn('admin bookings load failed', e);
        }
    }

    return {
        taken,
        source: 'public-partial',
    };
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

    // "augusztus 12" style — current year Budapest
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

    // Avoid false friends: foglalkozás, szabadság, etc.
    if (/\bfoglalkoz/.test(m)) return false;

    const bookingVerb =
        /\b(idopont(?:ot|otok|foglal(?:as|ni|ok|hatok)?)?|foglal(?:as|ni|ok|hatok|junk)?|appointment|booking|book(?:ing)?)\b/.test(
            m
        ) || /\bbook\s+appoint/.test(m);

    const freeSlot =
        /\b(szabad\s*orak?|szabad\s*idopont|free\s*hours?|free\s*slots?|availability|available\s*slots?|open\s*hours?)\b/.test(
            m
        ) || /\bmikor\s+(van|erhet).*?(szabad|ora|idopont)/.test(m);

    const zsoltiSchedule = /\bzsolti\b/.test(m) && /\b(szabad|ora|idopont|foglal|book|available|mikor|today|ma|holnap)\b/.test(m);

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
