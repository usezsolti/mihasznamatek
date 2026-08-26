import { getFirebase, type BlockedDay } from './types';

export async function loadBlockedDaysFromFirestore(): Promise<BlockedDay[]> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const snap = await firebase.firestore().collection('blockedSlots').get();
        const list: BlockedDay[] = [];
        snap.forEach((doc: any) => {
            const data = doc.data() || {};
            list.push({
                date: String(data.date || doc.id),
                times: Array.isArray(data.times) ? data.times.map(String) : [],
                allDay: Boolean(data.allDay),
                note: data.note ? String(data.note) : undefined,
                updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
            });
        });
        return list;
    } catch (err: any) {
        const msg = String(err?.message || err || '');
        if (!/permission|insufficient/i.test(msg)) {
            console.warn('loadBlockedDaysFromFirestore:', msg.slice(0, 120));
        }
        return [];
    }
}

/** Dátum → blokkolt órák halmaza (allDay esetén az összes sáv). */
export function blockedTimesMap(
    blockedDays: BlockedDay[],
    slotsForDate: (dateKey: string) => string[]
): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();
    blockedDays.forEach((day) => {
        if (!day.date) return;
        const set = new Set<string>();
        if (day.allDay) {
            slotsForDate(day.date).forEach((t) => set.add(t));
        } else {
            (day.times || []).forEach((t) => set.add(t));
        }
        if (set.size > 0) map.set(day.date, set);
    });
    return map;
}

export async function saveBlockedDay(day: BlockedDay): Promise<boolean> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return false;
        const db = firebase.firestore();
        const times = Array.from(new Set(day.times || [])).sort();
        const allDay = Boolean(day.allDay);

        if (!allDay && times.length === 0) {
            await db.collection('blockedSlots').doc(day.date).delete().catch(() => undefined);
            return true;
        }

        await db.collection('blockedSlots').doc(day.date).set({
            date: day.date,
            times,
            allDay,
            note: day.note || '',
            updatedAt: new Date().toISOString(),
        });
        return true;
    } catch (err) {
        console.error('saveBlockedDay failed:', err);
        return false;
    }
}

export async function toggleBlockedSlot(
    dateKey: string,
    slot: string,
    currentlyBlocked: boolean,
    allDaySlots: string[]
): Promise<boolean> {
    const list = await loadBlockedDaysFromFirestore();
    const existing = list.find((d) => d.date === dateKey);
    const times = new Set<string>(existing?.allDay ? allDaySlots : existing?.times || []);
    let allDay = Boolean(existing?.allDay);

    if (currentlyBlocked) {
        times.delete(slot);
        allDay = false;
    } else {
        times.add(slot);
        if (allDaySlots.length > 0 && allDaySlots.every((s) => times.has(s))) {
            allDay = true;
        }
    }

    return saveBlockedDay({
        date: dateKey,
        times: Array.from(times),
        allDay,
        note: existing?.note,
    });
}

export async function setDayBlocked(
    dateKey: string,
    block: boolean,
    allDaySlots: string[]
): Promise<boolean> {
    if (!block) {
        return saveBlockedDay({ date: dateKey, times: [], allDay: false });
    }
    return saveBlockedDay({
        date: dateKey,
        times: allDaySlots,
        allDay: true,
    });
}
