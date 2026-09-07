/** Egyszerű SM-2 spaced repetition — készségkártya (témakör + szint). */

export type SrsGrade = 'again' | 'good' | 'easy';

export type SrsEducationLevel = 'elementary' | 'highschool' | 'university' | 'erettsegi';

export type SrsCard = {
    id: string;
    topicId: string;
    stage: 1 | 2 | 3 | 4 | 5 | 6;
    educationLevel: SrsEducationLevel;
    ease: number;
    intervalDays: number;
    reps: number;
    lapses: number;
    nextDueMs: number;
    lastReviewedMs: number;
};

export const SRS_DAY_MS = 24 * 60 * 60 * 1000;

export function srsCardId(topicId: string, stage: number): string {
    return `${String(topicId || '').toLowerCase()}:${stage}`;
}

export function emptySrsCard(
    topicId: string,
    stage: 1 | 2 | 3 | 4 | 5 | 6,
    educationLevel: SrsEducationLevel
): SrsCard {
    return {
        id: srsCardId(topicId, stage),
        topicId: topicId.toLowerCase(),
        stage,
        educationLevel,
        ease: 2.5,
        intervalDays: 0,
        reps: 0,
        lapses: 0,
        nextDueMs: 0,
        lastReviewedMs: 0,
    };
}

export function normalizeSrsCard(raw: Partial<SrsCard> | null | undefined): SrsCard | null {
    if (!raw || !raw.topicId) return null;
    const stage = Number(raw.stage);
    if (stage < 1 || stage > 6) return null;
    const level = raw.educationLevel;
    const educationLevel: SrsEducationLevel =
        level === 'elementary' || level === 'highschool' || level === 'university' || level === 'erettsegi'
            ? level
            : 'erettsegi';
    return {
        id: raw.id || srsCardId(raw.topicId, stage),
        topicId: String(raw.topicId).toLowerCase(),
        stage: stage as SrsCard['stage'],
        educationLevel,
        ease: Math.max(1.3, Number(raw.ease) || 2.5),
        intervalDays: Math.max(0, Number(raw.intervalDays) || 0),
        reps: Math.max(0, Number(raw.reps) || 0),
        lapses: Math.max(0, Number(raw.lapses) || 0),
        nextDueMs: Number(raw.nextDueMs) || 0,
        lastReviewedMs: Number(raw.lastReviewedMs) || 0,
    };
}

export function reviewSrsCard(card: SrsCard, grade: SrsGrade, now = Date.now()): SrsCard {
    if (grade === 'again') {
        return {
            ...card,
            reps: 0,
            lapses: card.lapses + 1,
            intervalDays: 1,
            ease: Math.max(1.3, card.ease - 0.2),
            nextDueMs: now,
            lastReviewedMs: now,
        };
    }
    const reps = card.reps + 1;
    let interval = 1;
    if (reps === 1) interval = grade === 'easy' ? 3 : 2;
    else if (reps === 2) interval = grade === 'easy' ? 7 : 4;
    else interval = Math.max(1, Math.round(card.intervalDays * card.ease));
    const ease = grade === 'easy' ? card.ease + 0.15 : card.ease;
    return {
        ...card,
        reps,
        intervalDays: interval,
        ease,
        nextDueMs: now + interval * SRS_DAY_MS,
        lastReviewedMs: now,
    };
}

export function dueSrsCards(
    srs: Record<string, SrsCard> | undefined,
    now = Date.now()
): SrsCard[] {
    return Object.values(srs || {})
        .filter((c) => c && c.nextDueMs <= now)
        .sort((a, b) => a.nextDueMs - b.nextDueMs);
}

export function countDueSrs(srs: Record<string, SrsCard> | undefined, now = Date.now()): number {
    return dueSrsCards(srs, now).length;
}

export function mergeSrsMaps(
    a: Record<string, SrsCard> | undefined,
    b: Record<string, SrsCard> | undefined
): Record<string, SrsCard> {
    const out: Record<string, SrsCard> = { ...(a || {}) };
    Object.entries(b || {}).forEach(([id, card]) => {
        const prev = out[id];
        if (!prev || (card.lastReviewedMs || 0) >= (prev.lastReviewedMs || 0)) {
            out[id] = card;
        }
    });
    return out;
}

export function isSrsTopicId(topicId: string): boolean {
    const t = String(topicId || '').toLowerCase();
    return Boolean(t) && !t.startsWith('daily_') && t !== 'vegyes';
}
