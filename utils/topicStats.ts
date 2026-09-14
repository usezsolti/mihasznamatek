/** Témánkénti játék-statisztika: kulcs-egyeztetés + aggregátumok */

import {
    getTopicsForEducationLevel,
    getUniversitySubjectById,
    findUniversityTopic,
    type CatalogTopic,
    type EducationLevelId,
    type ErettsegiExamLevel,
} from './mathTopicsCatalog';
import { PATH_LESSON_COUNT } from './topicPath';
import { textbookGradeFromTopicId } from './hsTextbook';
import { elemNatGradeFromTopicId } from './elemNatCatalog';
import { isSkillNodeId, type SkillNodeId } from './skillTree';
import { KOZPONTI_PAPERS } from './game/kozpontiPapers';
import { ERETTSEGI_PAPERS } from './game/erettsegiPapers';

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
    grade?: string | number;
    subject?: string;
    paperId?: string;
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

export type PlayedGameSummary = {
    key: string;
    title: string;
    icon: string;
    color: string;
    educationLevel?: string;
    gameMode?: string;
    topicId?: string;
    paperId?: string;
    totalGames: number;
    totalCorrect: number;
    totalQuestions: number;
    totalWrong: number;
    successRate: number;
    lastPlayedAt: any | null;
};

function paperMetaTitle(paperId: string): string | null {
    const id = String(paperId || '').toLowerCase();
    if (!id) return null;
    const kf = KOZPONTI_PAPERS.find((p) => p.id === id || p.id === paperId);
    if (kf) return `Központi ${kf.year} · ${kf.title}`;
    const er = ERETTSEGI_PAPERS.find((p) => p.id === id || p.id === paperId);
    if (er) {
        const level = er.level === 'emelt' ? 'emelt' : 'közép';
        return `Érettségi ${er.year} ${er.title} · ${level}`;
    }
    return null;
}

export function playedGameTitle(result: RawGameResult): string {
    const paperTitle = paperMetaTitle(String(result.paperId || ''));
    if (result.topicTitle && !/unknown|ismeretlen/i.test(result.topicTitle)) {
        return result.topicTitle;
    }
    if (paperTitle) return paperTitle;
    const topicId = String(result.topicId || result.topic || '');
    const level = result.educationLevel as EducationLevelId | undefined;
    const catalog = topicId ? findCatalogTopic(topicId, level) : null;
    if (catalog?.title) return catalog.title;
    if (result.gameMode === 'blitz') return 'Villámjáték';
    if (result.gameMode === 'daily') return 'Napi gyakorlás';
    if (result.gameMode === 'kozponti' || result.educationLevel === 'kozponti') {
        return topicId ? `Központi · ${topicId}` : 'Központi felvételi';
    }
    return topicId || result.topicTitle || 'Játék';
}

export function playedGameLooks(result: RawGameResult): { icon: string; color: string } {
    const topicId = String(result.topicId || result.topic || '');
    const level = result.educationLevel as EducationLevelId | undefined;
    const catalog = topicId ? findCatalogTopic(topicId, level) : null;
    if (catalog) return { icon: catalog.icon, color: catalog.color };
    if (result.gameMode === 'erettsegi' || result.level) return { icon: '📝', color: '#ffd700' };
    if (result.gameMode === 'kozponti' || result.educationLevel === 'kozponti' || result.paperId) {
        return { icon: '📄', color: '#39ff14' };
    }
    if (result.educationLevel === 'elementary') return { icon: '🎒', color: '#39ff14' };
    if (result.educationLevel === 'highschool') return { icon: '📚', color: '#4fc3f7' };
    if (result.educationLevel === 'university') return { icon: '🎓', color: '#ff69b4' };
    if (result.gameMode === 'blitz') return { icon: '⚡', color: '#ffd700' };
    return { icon: '🧮', color: '#39ff14' };
}

export function gameResultGroupKey(result: RawGameResult): string {
    const paper = String(result.paperId || '').trim().toLowerCase();
    if (paper) return `paper:${paper}`;
    const topic = String(result.topicId || result.topic || '').trim().toLowerCase();
    if (topic) return `topic:${topic}`;
    const title = String(result.topicTitle || '').trim().toLowerCase();
    if (title) return `title:${title}`;
    return `mode:${String(result.gameMode || result.educationLevel || 'other').toLowerCase()}`;
}

export function aggregatePlayedGames(results: RawGameResult[]): PlayedGameSummary[] {
    const groups = new Map<string, RawGameResult[]>();
    for (const result of results) {
        const key = gameResultGroupKey(result);
        const list = groups.get(key) || [];
        list.push(result);
        groups.set(key, list);
    }

    const summaries: PlayedGameSummary[] = [];
    for (const [key, list] of groups) {
        const agg = aggregateTopicStats(list);
        const newest = sortResultsNewestFirst(list)[0];
        const looks = playedGameLooks(newest || list[0]);
        summaries.push({
            key,
            title: playedGameTitle(newest || list[0]),
            icon: looks.icon,
            color: looks.color,
            educationLevel: newest?.educationLevel || newest?.gameMode,
            gameMode: newest?.gameMode,
            topicId: newest?.topicId || newest?.topic,
            paperId: newest?.paperId,
            totalGames: agg.totalGames,
            totalCorrect: agg.totalCorrect,
            totalQuestions: agg.totalQuestions,
            totalWrong: agg.totalWrong,
            successRate: agg.averageSuccessRate,
            lastPlayedAt: agg.lastPlayedAt,
        });
    }

    return summaries.sort((a, b) => toMs(b.lastPlayedAt) - toMs(a.lastPlayedAt));
}

export function playedGameHref(summary: PlayedGameSummary): string | null {
    const paperId = String(summary.paperId || '');
    if (paperId.startsWith('kf-') || paperId.startsWith('2020-') || /g[68]/.test(paperId)) {
        return `/game?kozponti=true&paper=${encodeURIComponent(paperId)}`;
    }
    if (paperId.startsWith('er-')) {
        const level = paperId.includes('emelt') ? 'emelt' : 'kozep';
        return `/game?erettsegi=true&paperId=${encodeURIComponent(paperId)}&level=${level}`;
    }
    const topicId = String(summary.topicId || '');
    if (!topicId) return null;
    const level = (summary.educationLevel || 'university') as EducationLevelId;
    const safeLevel: EducationLevelId =
        level === 'elementary' ||
        level === 'highschool' ||
        level === 'university' ||
        level === 'erettsegi' ||
        level === 'kozponti'
            ? level
            : 'university';
    if (safeLevel === 'kozponti') {
        return `/game?kozponti=true&paper=${encodeURIComponent(topicId)}`;
    }
    return buildTopicStatsHref(topicId, safeLevel);
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
    const uniSubject = getUniversitySubjectById(topicId);
    if (uniSubject && (!educationLevel || educationLevel === 'university')) {
        return { id: uniSubject.id, title: uniSubject.title, icon: uniSubject.icon, color: uniSubject.color };
    }
    const nested = findUniversityTopic(topicId);
    if (nested && (!educationLevel || educationLevel === 'university')) {
        return {
            id: nested.topic.id,
            title: nested.topic.title,
            icon: nested.topic.icon,
            color: nested.subject.color,
        };
    }

    if (educationLevel) {
        const list = getTopicsForEducationLevel(educationLevel, erettsegiLevel);
        const hit = list.find((t) => topicKeysMatch(t.id, topicId));
        if (hit) return hit;
        if (educationLevel === 'highschool') {
            for (const g of [9, 10, 11, 12]) {
                const hitG = getTopicsForEducationLevel('highschool', erettsegiLevel, g).find((t) =>
                    topicKeysMatch(t.id, topicId)
                );
                if (hitG) return hitG;
            }
        }
        if (educationLevel === 'elementary') {
            for (const g of [1, 2, 3, 4, 5, 6, 7, 8]) {
                const hitG = getTopicsForEducationLevel('elementary', erettsegiLevel, g).find((t) =>
                    topicKeysMatch(t.id, topicId)
                );
                if (hitG) return hitG;
            }
        }
    }

    const levels: EducationLevelId[] = ['elementary', 'highschool', 'university', 'erettsegi', 'kozponti'];
    for (const level of levels) {
        if (level === 'erettsegi') {
            for (const exam of ['kozep', 'emelt'] as ErettsegiExamLevel[]) {
                const hit = getTopicsForEducationLevel(level, exam).find((t) =>
                    topicKeysMatch(t.id, topicId)
                );
                if (hit) return hit;
            }
        } else if (level === 'elementary') {
            for (const g of [1, 2, 3, 4, 5, 6, 7, 8]) {
                const hit = getTopicsForEducationLevel(level, 'emelt', g).find((t) =>
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
    erettsegiLevel: ErettsegiExamLevel = 'emelt',
    grade?: number
): string {
    const params = new URLSearchParams({ educationLevel });
    if (educationLevel === 'erettsegi') {
        params.set('level', erettsegiLevel);
    }
    if (educationLevel === 'highschool') {
        const g = grade && grade >= 9 && grade <= 12 ? grade : (textbookGradeFromTopicId(topicId) ?? 10);
        params.set('grade', String(g));
    }
    if (educationLevel === 'elementary' && grade) {
        params.set('grade', String(grade));
    }
    if (educationLevel === 'kozponti') {
        params.set('grade', String(grade === 6 ? 6 : 8));
    }
    return `/topic/${encodeURIComponent(topicId)}?${params.toString()}`;
}

/** Gyakorlás → Duolingo-út (minden iskolaszinten). */
export function buildTopicPracticeHref(
    topicId: string,
    educationLevel: EducationLevelId,
    erettsegiLevel: ErettsegiExamLevel = 'emelt',
    grade?: number
): string {
    const params = new URLSearchParams({
        educationLevel,
        view: 'path',
    });
    if (educationLevel === 'erettsegi') {
        params.set('level', erettsegiLevel);
    }
    if (educationLevel === 'elementary') {
        const fromId = elemNatGradeFromTopicId(topicId);
        params.set('grade', String(grade && grade >= 1 && grade <= 8 ? grade : fromId ?? 1));
    } else if (educationLevel === 'highschool') {
        const g = grade && grade >= 9 && grade <= 12 ? grade : (textbookGradeFromTopicId(topicId) ?? 10);
        params.set('grade', String(g));
    } else if (educationLevel === 'kozponti') {
        const g = grade === 6 ? 6 : 8;
        return `/game?kozponti=true&topic=${encodeURIComponent(topicId)}&grade=${g}`;
    }
    return `/topic/${encodeURIComponent(topicId)}?${params.toString()}`;
}

/** Témakör-végi vegyes feladatmegoldás (6 lecke után). */
export function buildTopicMixGameHref(
    topicId: string,
    educationLevel: EducationLevelId,
    erettsegiLevel: ErettsegiExamLevel = 'emelt'
): string {
    const params = new URLSearchParams({
        topic: topicId,
        topicMix: '1',
    });
    if (educationLevel === 'erettsegi') {
        params.set('erettsegi', 'true');
        params.set('level', erettsegiLevel);
    } else {
        params.set('educationLevel', educationLevel);
        if (educationLevel === 'elementary') params.set('grade', String(elemNatGradeFromTopicId(topicId) ?? 1));
        else if (educationLevel === 'highschool') params.set('grade', String(textbookGradeFromTopicId(topicId) ?? 10));
        else if (educationLevel === 'kozponti') {
            return `/game?kozponti=true&topic=${encodeURIComponent(topicId)}&grade=8`;
        }
    }
    return `/game?${params.toString()}`;
}

/** Napi vegyes gyakorlás (több témából). */
export function buildDailyPracticeHref(educationLevel: EducationLevelId, grade?: number): string {
    const params = new URLSearchParams({
        daily: '1',
        educationLevel,
    });
    if (educationLevel === 'elementary') {
        params.set('grade', String(grade && grade >= 1 && grade <= 8 ? grade : 1));
    }
    if (educationLevel === 'highschool') params.set('grade', '10');
    if (educationLevel === 'kozponti') {
        return `/game?kozponti=true&topic=szamitas&grade=${grade === 6 ? 6 : 8}`;
    }
    return `/game?${params.toString()}`;
}

export function buildBlitzHref(educationLevel: EducationLevelId, grade?: number): string {
    const params = new URLSearchParams({
        blitz: '1',
        educationLevel,
    });
    if (educationLevel === 'elementary') {
        params.set('grade', String(grade && grade >= 1 && grade <= 8 ? grade : 1));
    }
    if (educationLevel === 'highschool') params.set('grade', '10');
    if (educationLevel === 'kozponti') {
        return `/game?kozponti=true&topic=szamitas&grade=${grade === 6 ? 6 : 8}`;
    }
    return `/game?${params.toString()}`;
}

export function buildChallengeHref(
    id: SkillNodeId,
    educationLevel: EducationLevelId,
    erettsegiLevel: ErettsegiExamLevel = 'emelt',
    grade?: number
): string {
    const params = new URLSearchParams({
        challenge: id,
        educationLevel,
    });
    if (educationLevel === 'elementary') {
        params.set('grade', String(grade && grade >= 1 && grade <= 8 ? grade : 5));
    }
    if (educationLevel === 'highschool') {
        params.set('grade', String(grade && grade >= 9 && grade <= 12 ? grade : 10));
    }
    if (educationLevel === 'erettsegi') params.set('level', erettsegiLevel);
    return `/game?${params.toString()}`;
}

export function challengeIdFromQuery(raw: unknown): SkillNodeId | null {
    const id = String(raw || '');
    return isSkillNodeId(id) ? id : null;
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
