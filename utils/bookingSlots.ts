/** Közös munkaidő / órasáv logika a foglaló és az admin naptárhoz. */

export type DayRange = [string, string] | null;

/** Napindex: 0 = vasárnap … 6 = szombat (JS Date.getDay()). */
export type WorkingHoursMap = Record<number, DayRange>;

export const DEFAULT_WORKING_HOURS: WorkingHoursMap = {
    0: null, // vasárnap
    1: ["11:00", "20:00"],
    2: ["16:00", "22:00"],
    3: ["08:00", "20:00"],
    4: ["11:00", "20:00"],
    5: ["11:00", "18:00"],
    6: ["09:00", "15:00"],
};

/** @deprecated használd: DEFAULT_WORKING_HOURS */
export const WORKING_HOURS = DEFAULT_WORKING_HOURS;

export const WEEKDAY_LABELS_HU: Record<number, string> = {
    0: "Vasárnap",
    1: "Hétfő",
    2: "Kedd",
    3: "Szerda",
    4: "Csütörtök",
    5: "Péntek",
    6: "Szombat",
};

/** Megjelenítési sorrend: Hétfő → Vasárnap */
export const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

const SETTINGS_DOC = "workingHours";

function getFirebase(): any | null {
    if (typeof window === "undefined") return null;
    return (window as any).firebase || null;
}

export function cloneWorkingHours(hours?: WorkingHoursMap | null): WorkingHoursMap {
    const src = hours || DEFAULT_WORKING_HOURS;
    const out: WorkingHoursMap = { ...DEFAULT_WORKING_HOURS };
    for (let d = 0; d <= 6; d++) {
        const range = src[d];
        out[d] = range ? [range[0], range[1]] : null;
    }
    return out;
}

/** Firestore / UI objektumból biztonságos WorkingHoursMap. */
export function normalizeWorkingHours(raw: any): WorkingHoursMap {
    const out = cloneWorkingHours(DEFAULT_WORKING_HOURS);
    if (!raw || typeof raw !== "object") return out;

    const source = raw.hours && typeof raw.hours === "object" ? raw.hours : raw;

    for (let d = 0; d <= 6; d++) {
        const key = String(d);
        const val = source[d] !== undefined ? source[d] : source[key];
        if (val === null || val === undefined || val === false) {
            out[d] = null;
            continue;
        }
        if (Array.isArray(val) && val.length >= 2) {
            const start = String(val[0] || "").trim();
            const end = String(val[1] || "").trim();
            if (/^\d{2}:\d{2}$/.test(start) && /^\d{2}:\d{2}$/.test(end) && parseTime(start) < parseTime(end)) {
                out[d] = [start, end];
            } else {
                out[d] = null;
            }
        }
    }
    return out;
}

export function toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function parseTime(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

export function formatTime(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getSlotsForDay(date: Date, hours: WorkingHoursMap = DEFAULT_WORKING_HOURS): string[] {
    const range = hours[date.getDay()];
    if (!range) return [];
    const [start, end] = range;
    const startM = parseTime(start);
    const endM = parseTime(end);
    if (!(startM < endM)) return [];
    const slots: string[] = [];
    for (let m = startM; m + 60 <= endM; m += 60) {
        slots.push(formatTime(m));
    }
    return slots;
}

export function getSlotsForDateKey(
    dateKey: string,
    hours: WorkingHoursMap = DEFAULT_WORKING_HOURS
): string[] {
    return getSlotsForDay(new Date(dateKey + "T12:00:00"), hours);
}

export function makeSlotsForDateKeyFn(hours: WorkingHoursMap) {
    return (dateKey: string) => getSlotsForDateKey(dateKey, hours);
}

export async function loadWorkingHoursFromFirestore(): Promise<WorkingHoursMap> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return cloneWorkingHours();
        const snap = await firebase.firestore().collection("settings").doc(SETTINGS_DOC).get();
        if (!snap.exists) return cloneWorkingHours();
        return normalizeWorkingHours(snap.data());
    } catch (err: any) {
        const msg = String(err?.message || err || '');
        if (!/permission|insufficient/i.test(msg)) {
            console.warn('loadWorkingHoursFromFirestore:', msg.slice(0, 120));
        }
        return cloneWorkingHours();
    }
}

export async function saveWorkingHoursToFirestore(
    hours: WorkingHoursMap
): Promise<{ ok: boolean; error?: string }> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) {
            return { ok: false, error: "Firebase nem elérhető" };
        }
        const normalized = normalizeWorkingHours(hours);
        const payload: Record<string, DayRange> = {};
        for (let d = 0; d <= 6; d++) {
            payload[String(d)] = normalized[d];
        }
        await firebase
            .firestore()
            .collection("settings")
            .doc(SETTINGS_DOC)
            .set(
                {
                    hours: payload,
                    updatedAt: new Date().toISOString(),
                },
                { merge: true }
            );
        return { ok: true };
    } catch (err: any) {
        console.error("saveWorkingHoursToFirestore failed:", err);
        return { ok: false, error: err?.message || "Mentés sikertelen" };
    }
}

/** Óránkénti time optionök a szerkesztőhöz (06:00–22:00). */
export function hourSelectOptions(): string[] {
    const opts: string[] = [];
    for (let h = 6; h <= 22; h++) {
        opts.push(formatTime(h * 60));
    }
    return opts;
}
