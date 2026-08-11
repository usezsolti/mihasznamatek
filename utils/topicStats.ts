/** Témánkénti játék-statisztika: kulcs-egyeztetés + aggregátumok */

import {
    getTopicsForEducationLevel,
    type CatalogTopic,
    type EducationLevelId,
    type ErettsegiExamLevel,
} from './mathTopicsCatalog';
import { PATH_LESSON_COUNT } from './topicPath';
import type { TopicProgress } from './practiceProgress';

export type RawGameResult = {
    id?: string;
    topicId?: string;
    topic?: string;
    topicTitle?: string;
    correct?: number;
    total?: number;
    score?: number;
    xpEarned?: number;
    completedAt?: any;
    educationLevel?: string;
    gameMode?: string;
    level?: string;
    grade?: string;
    subject?: string;
};

export type BestSession = {
    correct: number;
    total: number;
};

export type TopicSessionAggregate = {
    totalGames: number;
    totalCorrect: number;
    totalQuestions: number;
    totalWrong: number;
    averageSuccessRate: number;
    bestScore: number;
    totalXp: number;
    lastPlayedAt: any | null;
    bestSession: BestSession | null;
};

export function topicKeysMatch(a: string, b: string): boolean {
    const left = (a || '').toLowerCase();
    const right = (b || '').toLowerCase();
    if (!left || !right) return false;
    return left === right || left.includes(right) || right.includes(left);
}

export function resultMatchesTopic(
    result: Pick<RawGameResult, 'topicId' | 'topic'>,
    topicId: string
): boolean {
    const key = result.topicId || result.topic || '';
    return topicKeysMatch(key, topicId);
}

/** Firestore docs → topicId szerinti legjobb (legtöbb helyes) session. */
export function indexBestSessionsByTopic(
    results: RawGameResult[]
): Record<string, BestSession> {
    const map: Record<string, BestSession> = {};
    for (const data of results) {
        const key = data.topicId || data.topic;
        if (!key || data.correct === undefined || data.total === undefined) continue;
        const prev = map[key];
        if (!prev || data.correct >= prev.correct) {
            map[key] = { correct: data.correct, total: data.total };
        }
    }
    return map;
}

export function lookupBestSessionForTopic(
    bestByKey: Record<string, BestSession>,
    topicId: string
): BestSession | undefined {
    if (bestByKey[topicId]) return bestByKey[topicId];
    const entry = Object.entries(bestByKey).find(([k]) => topicKeysMatch(k, topicId));
    return entry?.[1];
}

export function filterResultsForTopic(
    results: RawGameResult[],
    topicId: string
): RawGameResult[] {
    return results.filter((r) => resultMatchesTopic(r, topicId));
}

function toMs(ts: any): number {
    if (!ts) return 0;
    if (typeof ts.toDate === 'function') return ts.toDate().getTime();
    if (ts.seconds) return ts.seconds * 1000;
    return new Date(ts).getTime() || 0;
}

export function aggregateTopicStats(results: RawGameResult[]): TopicSessionAggregate {
    let totalCorrect = 0;
    let totalQuestions = 0;
    let bestScore = 0;
    let totalXp = 0;
    let lastPlayedAt: any | null = null;
    let lastMs = 0;
    let bestSession: BestSession | null = null;

    for (const r of results) {
        const correct = r.correct || 0;
        const total = r.total || 0;
        totalCorrect += correct;
        totalQuestions += total;
        const score = r.score || 0;
        if (score > bestScore) bestScore = score;
        totalXp += r.xpEarned || 0;

        const ms = toMs(r.completedAt);
        if (ms >= lastMs) {
            lastMs = ms;
            lastPlayedAt = r.completedAt;
        }

        if (
            !bestSession ||
            correct > bestSession.correct ||
            (correct === bestSession.correct && total >= bestSession.total)
        ) {
            bestSession = { correct, total };
        }
    }

    return {
        totalGames: results.length,
        totalCorrect,
        totalQuestions,
        totalWrong: Math.max(0, totalQuestions - totalCorrect),
        averageSuccessRate:
            totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        bestScore,
        totalXp,
        lastPlayedAt,
        bestSession,
    };
}

export function sortResultsNewestFirst(results: RawGameResult[]): RawGameResult[] {
    return [...results].sort((a, b) => toMs(b.completedAt) - toMs(a.completedAt));
}

export function pathLessonSummary(tp?: TopicProgress | null): {
    lessonsDone: number;
    lessonsTotal: number;
    percent: number;
    completed: boolean;
    perfect: boolean;
    chestsClaimed: number;
    stagesCompleted: number[];
} {
    const lessonsDone = tp?.lessonsCompleted?.length || 0;
    return {
        lessonsDone,
        lessonsTotal: PATH_LESSON_COUNT,
        percent: Math.round((lessonsDone / PATH_LESSON_COUNT) * 100),
        completed: !!tp?.completed,
        perfect: !!tp?.perfect,
        chestsClaimed: tp?.chestsClaimed?.length || 0,
        stagesCompleted: tp?.stagesCompleted || [],
    };
}

export function findCatalogTopic(
    topicId: string,
    educationLevel?: EducationLevelId,
    erettsegiLevel: ErettsegiExamLevel = 'emelt'
): CatalogTopic | null {
    if (educationLevel) {
        const list = getTopicsForEducationLevel(educationLevel, erettsegiLevel);
        const hit = list.find((t) => topicKeysMatch(t.id, topicId));
        if (hit) return hit;
    }

    const levels: EducationLevelId[] = ['elementary', 'highschool', 'university', 'erettsegi'];
    for (const level of levels) {
        if (level === 'erettsegi') {
            for (const exam of ['kozep', 'emelt'] as ErettsegiExamLevel[]) {
                const hit = getTopicsForEducationLevel(level, exam).find((t) =>
                    topicKeysMatch(t.id, topicId)
                );
                if (hit) return hit;
            }
        } else {
            const hit = getTopicsForEducationLevel(level).find((t) =>
                topicKeysMatch(t.id, topicId)
            );
            if (hit) return hit;
        }
    }
    return null;
}

export function buildTopicStatsHref(
    topicId: string,
    educationLevel: EducationLevelId,
    erettsegiLevel: ErettsegiExamLevel = 'emelt'
): string {
    const params = new URLSearchParams({ educationLevel });
    if (educationLevel === 'erettsegi') {
        params.set('level', erettsegiLevel);
    }
    return `/topic/${encodeURIComponent(topicId)}?${params.toString()}`;
}

export function buildTopicPracticeHref(
    topicId: string,
    educationLevel: EducationLevelId,
    erettsegiLevel: ErettsegiExamLevel = 'emelt'
): string {
    if (educationLevel === 'erettsegi') {
        return `/erettsegi-felkeszules?mode=topics&level=${erettsegiLevel}&topic=${encodeURIComponent(topicId)}`;
    }
    const params = new URLSearchParams({
        educationLevel,
        topic: topicId,
    });
    if (educationLevel === 'elementary') {
        params.set('grade', '5');
    } else if (educationLevel === 'highschool') {
        params.set('grade', '10');
    }
    return `/game?${params.toString()}`;
}

export function formatResultDate(timestamp: any): string {
    if (!timestamp) return 'Ismeretlen dátum';
    const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'Ismeretlen dátum';
    return date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
