import { formatTime, parseTime } from './bookingSlots';

export type DaySlots = {
    dateKey: string;
    weekdayHu: string;
    freeSlots: string[];
    takenSlots: string[];
};

export type StudentWindow = {
    weekdays: number[] | null;
    afterMinutes: number | null;
    beforeMinutes: number | null;
    earliestDateKey?: string;
    latestDateKey?: string;
};

export type PackedSlot = {
    dateKey: string;
    time: string;
    weekdayHu: string;
    packScore: number;
    reason: 'gap' | 'adjacent' | 'busy-day' | 'earliest-free';
};

export type RequestedSlot = { dateKey: string; time: string };

const WEEKDAY_HU: Record<string, number> = {
    vasarnap: 0,
    hetfo: 1,
    kedd: 2,
    szerda: 3,
    csutortok: 4,
    pentek: 5,
    szombat: 6,
};

const WEEKDAY_LABEL = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];

export function foldHu(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ß/g, 'ss');
}

function weekdayIndexFromDateKey(dateKey: string): number {
    return new Date(dateKey + 'T12:00:00').getDay();
}

export function neighborTime(time: string, deltaHours: number): string {
    return formatTime(parseTime(time) + deltaHours * 60);
}

export function slotFitsWindow(dateKey: string, time: string, window: StudentWindow | null): boolean {
    if (!window) return true;
    const day = weekdayIndexFromDateKey(dateKey);
    if (window.weekdays && window.weekdays.length && !window.weekdays.includes(day)) return false;
    const mins = parseTime(time);
    if (window.afterMinutes != null && mins < window.afterMinutes) return false;
    if (window.beforeMinutes != null && mins >= window.beforeMinutes) return false;
    if (window.earliestDateKey && dateKey < window.earliestDateKey) return false;
    if (window.latestDateKey && dateKey > window.latestDateKey) return false;
    return true;
}

function packMeta(day: DaySlots, time: string): Pick<PackedSlot, 'packScore' | 'reason'> {
    const taken = new Set(day.takenSlots);
    const prev = neighborTime(time, -1);
    const next = neighborTime(time, 1);
    const left = taken.has(prev);
    const right = taken.has(next);
    if (left && right) return { packScore: 100, reason: 'gap' };
    if (left || right) return { packScore: 50, reason: 'adjacent' };
    if (day.takenSlots.length > 0) return { packScore: 20, reason: 'busy-day' };
    return { packScore: 0, reason: 'earliest-free' };
}

/** Rank free slots: fill blocks first, then earlier date/time. */
export function suggestPackedSlots(
    days: DaySlots[],
    window: StudentWindow | null,
    limit = 3
): PackedSlot[] {
    const ranked: PackedSlot[] = [];
    for (const day of days) {
        for (const time of day.freeSlots) {
            if (!slotFitsWindow(day.dateKey, time, window)) continue;
            const meta = packMeta(day, time);
            ranked.push({
                dateKey: day.dateKey,
                time,
                weekdayHu: day.weekdayHu || WEEKDAY_LABEL[weekdayIndexFromDateKey(day.dateKey)] || '',
                packScore: meta.packScore,
                reason: meta.reason,
            });
        }
    }
    ranked.sort((a, b) => {
        if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
        return parseTime(a.time) - parseTime(b.time);
    });
    const out: PackedSlot[] = [];
    const seen = new Set<string>();
    for (const s of ranked) {
        const k = `${s.dateKey} ${s.time}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(s);
        if (out.length >= limit) break;
    }
    return out;
}

const ANY_WEEKDAY = [0, 1, 2, 3, 4, 5, 6];

/** Merge two windows (later message can narrow). */
export function mergeWindows(base: StudentWindow | null, next: StudentWindow | null): StudentWindow | null {
    if (!base) return next;
    if (!next) return base;
    let weekdays: number[] | null = base.weekdays;
    if (next.weekdays) {
        weekdays = (weekdays || ANY_WEEKDAY).filter((d) => next.weekdays!.includes(d));
        if (!weekdays.length) weekdays = next.weekdays;
    }
    return {
        weekdays,
        afterMinutes:
            base.afterMinutes == null
                ? next.afterMinutes
                : next.afterMinutes == null
                  ? base.afterMinutes
                  : Math.max(base.afterMinutes, next.afterMinutes),
        beforeMinutes:
            base.beforeMinutes == null
                ? next.beforeMinutes
                : next.beforeMinutes == null
                  ? base.beforeMinutes
                  : Math.min(base.beforeMinutes, next.beforeMinutes),
        earliestDateKey:
            base.earliestDateKey && next.earliestDateKey
                ? base.earliestDateKey > next.earliestDateKey
                    ? base.earliestDateKey
                    : next.earliestDateKey
                : base.earliestDateKey || next.earliestDateKey,
        latestDateKey:
            base.latestDateKey && next.latestDateKey
                ? base.latestDateKey < next.latestDateKey
                    ? base.latestDateKey
                    : next.latestDateKey
                : base.latestDateKey || next.latestDateKey,
    };
}

function parseClock(raw: string): number | null {
    const m = raw.match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!m) return null;
    const h = Number(m[1]);
    const min = m[2] ? Number(m[2]) : 0;
    if (h > 23 || min > 59) return null;
    return h * 60 + min;
}

/**
 * Student "earliest window" from Hungarian (or English) mail text.
 * Returns null if they did not constrain days/hours.
 */
export function parseStudentWindow(text: string): StudentWindow | null {
    const f = foldHu(text);
    const weekdays = new Set<number>();
    if (/\bhetkoznap/.test(f) || /\bhetkozben/.test(f) || /\bweekday/.test(f)) {
        [1, 2, 3, 4, 5].forEach((d) => weekdays.add(d));
    }
    if (/\bhetvege/.test(f) || /\bweekend/.test(f)) {
        weekdays.add(0);
        weekdays.add(6);
    }
    for (const [name, idx] of Object.entries(WEEKDAY_HU)) {
        const re = new RegExp(`\\b${name}`);
        if (re.test(f)) weekdays.add(idx);
    }

    let afterMinutes: number | null = null;
    let beforeMinutes: number | null = null;
    if (/\bdelelott\b/.test(f) || /\breggel\b/.test(f) || /\bmorning\b/.test(f)) {
        beforeMinutes = 12 * 60;
    }
    if (/\bdelutan\b/.test(f) || /\bafternoon\b/.test(f)) {
        afterMinutes = Math.max(afterMinutes ?? 0, 13 * 60);
    }
    if (/\beste\b/.test(f) || /\bevening\b/.test(f)) {
        afterMinutes = Math.max(afterMinutes ?? 0, 17 * 60);
    }

    const afterHit = f.match(/\b(\d{1,2}(?::\d{2})?)\s*(?:utan|tol|from)\b/);
    if (afterHit) {
        const v = parseClock(afterHit[1]);
        if (v != null) afterMinutes = v;
    }
    const beforeHit = f.match(/\b(\d{1,2}(?::\d{2})?)\s*(?:elott|ig|until|before)\b/);
    if (beforeHit) {
        const v = parseClock(beforeHit[1]);
        if (v != null) beforeMinutes = v;
    }

    const talkedAvailability =
        /\b(raer\w*|erek ra|szabad|tudok|tudnek|jo nekem|jo lenne|megfelel|idopont|foglal|delutan|delelott|este|reggel)\b/.test(f);
    if (!talkedAvailability && afterMinutes == null && beforeMinutes == null) return null;
    if (!weekdays.size && afterMinutes == null && beforeMinutes == null) return null;
    return {
        weekdays: weekdays.size ? [...weekdays].sort((a, b) => a - b) : null,
        afterMinutes,
        beforeMinutes,
    };
}

export function hasStudentWindow(window: StudentWindow | null): boolean {
    return Boolean(window);
}

const FLEXIBLE =
    /\b(barmikor|akarmikor|mindegy|barmelyik|barmilyen|amikor csak|neked jo|ahogy neked|anytime|whenever)\b/;

/** „Bármikor jó” — nincs nap- vagy óraszűkítés. */
export function studentIsFlexible(text: string): boolean {
    return FLEXIBLE.test(foldHu(text));
}

/** Legkorábbi szabad sáv, dátum majd óra szerint (pl. hétfő 12:00). */
export function earliestFreeSlot(days: DaySlots[]): PackedSlot | null {
    let best: PackedSlot | null = null;
    for (const day of days) {
        for (const time of day.freeSlots) {
            if (
                !best ||
                day.dateKey < best.dateKey ||
                (day.dateKey === best.dateKey && parseTime(time) < parseTime(best.time))
            ) {
                best = {
                    dateKey: day.dateKey,
                    time,
                    weekdayHu: day.weekdayHu || WEEKDAY_LABEL[weekdayIndexFromDateKey(day.dateKey)] || '',
                    packScore: 0,
                    reason: 'earliest-free',
                };
            }
        }
    }
    return best;
}

/** Next occurrence of weekday (0=Sun) on or after fromDateKey. */
export function nextDateKeyForWeekday(fromDateKey: string, weekday: number): string {
    const d = new Date(fromDateKey + 'T12:00:00');
    for (let i = 0; i < 8; i++) {
        if (d.getDay() === weekday) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        }
        d.setDate(d.getDate() + 1);
    }
    return fromDateKey;
}

/**
 * Concrete "szerda 16:00" / "2026-09-17 15:00" requests.
 * `todayKey` is Budapest YYYY-MM-DD.
 */
/** A diák új mondata, az idézett előzmény nélkül. */
export function latestStudentText(text: string): string {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const out: string[] = [];
    for (const line of lines) {
        const t = line.trim();
        if (/^>/.test(t)) break;
        if (/^-{2,}\s*original message\s*-{2,}/i.test(t)) break;
        if (/^_{5,}/.test(t)) break;
        if (/(?:írta|irta|wrote)\s*:$/i.test(foldHu(t)) || /(?:írta|irta|wrote)\s*:$/i.test(t)) break;
        out.push(line);
    }
    return out.join('\n').trim();
}

function clockHour(rawHour: number, folded: string): number | null {
    let h = rawHour;
    const afternoon = /\b(delutan|este)\b/.test(folded) && !/\b(delelott|reggel)\b/.test(folded);
    if (afternoon && h >= 1 && h <= 7) h += 12;
    if (h < 8 || h > 21) return null;
    return h;
}

export function parseRequestedSlots(text: string, todayKey: string): RequestedSlot[] {
    const fresh = latestStudentText(text);
    const f = foldHu(fresh);
    const out: RequestedSlot[] = [];
    const iso = [...fresh.matchAll(/\b(20\d{2}-\d{2}-\d{2})(?:[ tT](\d{1,2}:\d{2}))?/g)];
    for (const m of iso) {
        if (!m[2]) continue;
        const clock = m[2].length === 4 ? `0${m[2]}` : m[2];
        out.push({ dateKey: m[1], time: formatTime(parseTime(clock)) });
    }

    for (const [name, idx] of Object.entries(WEEKDAY_HU)) {
        const re = new RegExp(
            `\\b${name}\\w{0,12}(?:\\s+\\w+){0,4}\\s+(\\d{1,2})(?::(\\d{2}))?\\s*(?:ora\\w*|kor)\\b|\\b${name}\\w{0,12}(?:\\s+\\w+){0,4}\\s+(\\d{1,2}):(\\d{2})\\b|\\b(\\d{1,2})(?::(\\d{2}))?\\s*(?:ora\\w*|kor)\\b(?:\\s+\\w+){0,4}\\s+${name}|\\b(\\d{1,2}):(\\d{2})\\b(?:\\s+\\w+){0,4}\\s+${name}`
        );
        const m = f.match(re);
        if (!m) continue;
        const hRaw = Number(m[1] || m[3] || m[5] || m[7]);
        const min = Number(m[2] || m[4] || m[6] || m[8] || 0);
        const h = clockHour(hRaw, f);
        if (h == null || min > 59) continue;
        out.push({ dateKey: nextDateKeyForWeekday(todayKey, idx), time: formatTime(h * 60 + min) });
    }
    const uniq = new Map<string, RequestedSlot>();
    for (const s of out) uniq.set(`${s.dateKey}|${s.time}`, s);
    return [...uniq.values()];
}

const ORDINAL: Array<{ re: RegExp; index: number }> = [
    { re: /\b(elso|1\.|az\s+elso)\b/, index: 0 },
    { re: /\b(masodik|2\.|a\s+masodik)\b/, index: 1 },
    { re: /\b(harmadik|3\.|a\s+harmadik)\b/, index: 2 },
];

const CONFIRM_YES =
    /\b(igen|jo|az\s+jo|azt\s+ker(nem|nem)|mehet|foglald|lefoglal|rendben|ok(?:e)?|azt\s+valasztom)\b/;

/** "az első jó" / "a második mehet" a felkínált sávokból. */
export function parseChoiceFromOffers(
    text: string,
    offered: Array<RequestedSlot | PackedSlot>
): RequestedSlot | null {
    if (!offered.length) return null;
    const f = foldHu(text);
    for (const { re, index } of ORDINAL) {
        if (re.test(f) && offered[index]) {
            const s = offered[index];
            return { dateKey: s.dateKey, time: s.time };
        }
    }
    for (const s of offered) {
        const day = foldHu(
            'weekdayHu' in s && s.weekdayHu ? String(s.weekdayHu) : ''
        );
        if (day && f.includes(day) && f.includes(s.time.replace(/^0/, ''))) {
            return { dateKey: s.dateKey, time: s.time };
        }
        if (f.includes(s.time) && CONFIRM_YES.test(f)) {
            return { dateKey: s.dateKey, time: s.time };
        }
    }
    if (offered.length === 1 && CONFIRM_YES.test(f) && !/\b(de\b|kiveve|nem\b|masik)\b/.test(f)) {
        return { dateKey: offered[0].dateKey, time: offered[0].time };
    }
    return null;
}

export function findDay(days: DaySlots[], dateKey: string): DaySlots | undefined {
    return days.find((d) => d.dateKey === dateKey);
}

export function isSlotFree(days: DaySlots[], dateKey: string, time: string): boolean {
    const day = findDay(days, dateKey);
    return Boolean(day?.freeSlots.includes(time));
}

/** Prefer packed alternative over confirming an isolated empty-day request. */
export function shouldOfferPackedInsteadOfRequested(
    requested: RequestedSlot,
    days: DaySlots[],
    window: StudentWindow | null
): PackedSlot[] {
    const packed = suggestPackedSlots(days, window, 3);
    if (!packed.length) return [];
    const reqMeta = (() => {
        const day = findDay(days, requested.dateKey);
        if (!day || !day.freeSlots.includes(requested.time)) return null;
        return packMeta(day, requested.time);
    })();
    const best = packed[0];
    if (!reqMeta) return packed;
    if (best.packScore >= 50 && reqMeta.packScore < 50) return packed;
    return [];
}

export function formatSlotHu(slot: PackedSlot | RequestedSlot, weekdayHu?: string): string {
    const day =
        'weekdayHu' in slot && slot.weekdayHu
            ? slot.weekdayHu
            : weekdayHu || WEEKDAY_LABEL[weekdayIndexFromDateKey(slot.dateKey)] || slot.dateKey;
    return `${day} ${slot.dateKey}, ${slot.time}`;
}
