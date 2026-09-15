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
        if (b.packScore !== a.packScore) return b.packScore - a.packScore;
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
    if (/\bdelutan\b/.test(f) || /\beste\b/.test(f) || /\bafternoon\b/.test(f) || /\bevening\b/.test(f)) {
        afterMinutes = 12 * 60;
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
export function parseRequestedSlots(text: string, todayKey: string): RequestedSlot[] {
    const f = foldHu(text);
    const out: RequestedSlot[] = [];
    const iso = [...text.matchAll(/\b(20\d{2}-\d{2}-\d{2})(?:[ tT](\d{1,2}:\d{2}))?/g)];
    for (const m of iso) {
        out.push({ dateKey: m[1], time: m[2] ? formatTime(parseTime(m[2].length === 4 ? `0${m[2]}` : m[2])) : '12:00' });
    }

    const clock = f.match(/\b(\d{1,2})(?::(\d{2}))?\b(?:-kor)?/);
    let time = '16:00';
    if (clock) {
        const h = Number(clock[1]);
        const min = clock[2] ? Number(clock[2]) : 0;
        if (h <= 23) time = formatTime(h * 60 + min);
    }

    for (const [name, idx] of Object.entries(WEEKDAY_HU)) {
        if (new RegExp(`\\b${name}`).test(f) && /\b\d{1,2}/.test(f)) {
            out.push({ dateKey: nextDateKeyForWeekday(todayKey, idx), time });
        }
    }
    const uniq = new Map<string, RequestedSlot>();
    for (const s of out) uniq.set(`${s.dateKey}|${s.time}`, s);
    return [...uniq.values()];
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
