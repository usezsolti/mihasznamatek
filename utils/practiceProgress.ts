/** Emelt érettségi / Duolingo út progresszió: XP, rang, badge, stage, leckék */

import {
    PATH_CHEST_XP,
    PATH_LESSON_COUNT,
    PATH_LESSON_XP,
    PATH_TOTAL_QUESTIONS,
    computeHighestUnlocked,
    lessonToStage,
    normalizeTopicId,
} from './topicPath';

export type PracticeStage = 1 | 2 | 3;

export type BadgeId =
    | 'parameter_kesz'
    | 'explog_kesz'
    | 'absroot_kesz'
    | 'bizonyitas_kesz'
    | 'fuggveny_kesz'
    | 'ut_bejart'
    | 'mester_szakasz'
    | 'hibatlan_5'
    | 'xp_500'
    | 'xp_1000';

/** Régi munkalap kulcsok — badge mappinghez */
export type TopicProgressKey = 'parameter' | 'explog' | 'absroot' | 'bizonyitas' | 'egyenletek' | 'fuggvenyek';

export interface BadgeDef {
    id: BadgeId;
    title: string;
    description: string;
    icon: string;
}

export interface TopicProgress {
    bestCorrect: number;
    totalQuestions: number;
    stagesCompleted: number[];
    completed: boolean;
    perfect: boolean;
    lessonsCompleted: number[];
    highestUnlocked: number;
    chestsClaimed: number[];
    updatedAt?: any;
}

function emptyPathTopicProgress(totalQuestions = PATH_TOTAL_QUESTIONS): TopicProgress {
    return {
        bestCorrect: 0,
        totalQuestions,
        stagesCompleted: [],
        completed: false,
        perfect: false,
        lessonsCompleted: [],
        highestUnlocked: 1,
        chestsClaimed: [],
    };
}

export interface UserPracticeProgress {
    xp: number;
    rank: string;
    rankLevel: number;
    badges: BadgeId[];
    /** Kulcs: normalizeTopicId(topicId) vagy régi TopicProgressKey */
    topics: Record<string, TopicProgress>;
    updatedAt?: any;
}

export const BADGE_DEFS: BadgeDef[] = [
    { id: 'parameter_kesz', title: 'Paraméter mester', description: 'Paraméteres munkalap teljesítve', icon: 'α' },
    { id: 'explog_kesz', title: 'Exp/Log mester', description: 'Exponenciális–logaritmus munkalap teljesítve', icon: 'log' },
    { id: 'absroot_kesz', title: 'Abszolútérték–gyök mester', description: 'Abszolútérték/gyök munkalap teljesítve', icon: '|√' },
    { id: 'bizonyitas_kesz', title: 'Bizonyítás mester', description: 'Bizonyítási munkalap teljesítve', icon: '✓' },
    { id: 'fuggveny_kesz', title: 'Függvény mester', description: 'Függvények–analízis munkalap teljesítve', icon: '📈' },
    { id: 'ut_bejart', title: 'Út bejárva', description: 'Egy teljes témakör-út (6 lecke) kész', icon: '🗺️' },
    { id: 'mester_szakasz', title: 'Mester szakasz', description: 'Bármely munkalap 3. szakasza kész', icon: '🏆' },
    { id: 'hibatlan_5', title: '5 hibátlan', description: '5 helyes válasz egymás után', icon: '🔥' },
    { id: 'xp_500', title: '500 XP', description: 'Elérted az 500 XP-t', icon: '⭐' },
    { id: 'xp_1000', title: '1000 XP', description: 'Elérted az 1000 XP-t', icon: '👑' },
];

export const STAGE_LABELS: Record<PracticeStage, string> = {
    1: 'Alap',
    2: 'Közép',
    3: 'Mester',
};

/** XP küszöbök → avatar szint (1+) */
export const XP_RANK_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];

export function xpToRankLevel(xp: number): number {
    let level = 1;
    for (let i = 0; i < XP_RANK_THRESHOLDS.length; i++) {
        if (xp >= XP_RANK_THRESHOLDS[i]) level = i + 1;
    }
    if (xp >= 5500) {
        level = 10 + Math.floor((xp - 5500) / 1000);
    }
    return Math.max(1, level);
}

export function getRankTitle(level: number): string {
    if (level >= 20) return 'MASTER';
    if (level >= 15) return 'EXPERT';
    if (level >= 10) return 'ADVANCED';
    if (level >= 5) return 'INTERMEDIATE';
    return 'BEGINNER';
}

export function getRankEmoji(level: number): string {
    if (level >= 20) return '🏆';
    if (level >= 15) return '👑';
    if (level >= 10) return '⭐';
    if (level >= 5) return '🔥';
    return '🌟';
}

export function xpForNextRank(xp: number): { current: number; next: number; level: number } {
    const level = xpToRankLevel(xp);
    const currentThreshold = level <= XP_RANK_THRESHOLDS.length
        ? XP_RANK_THRESHOLDS[level - 1]
        : 5500 + (level - 10) * 1000;
    const nextThreshold = level < XP_RANK_THRESHOLDS.length
        ? XP_RANK_THRESHOLDS[level]
        : level === XP_RANK_THRESHOLDS.length
            ? 5500
            : 5500 + (level - 9) * 1000;
    return { current: currentThreshold, next: nextThreshold, level };
}

export function assignStagesToQuestions<T extends { stage?: PracticeStage; question?: string }>(
    list: T[]
): (T & { stage: PracticeStage })[] {
    const n = list.length;
    if (n === 0) return [];
    const t1 = Math.max(1, Math.ceil(n / 3));
    const t2 = Math.max(t1 + 1, Math.ceil((2 * n) / 3));
    return list.map((q, i) => {
        let stage: PracticeStage = 1;
        if (i >= t2) stage = 3;
        else if (i >= t1) stage = 2;
        if (q.question && /mesterfok|főgonosz|Mihaszna-mester/i.test(q.question)) {
            stage = 3;
        }
        return { ...q, stage };
    }).sort((a, b) => a.stage - b.stage);
}

export function resolveTopicProgressKey(topicId: string): TopicProgressKey | null {
    const t = topicId.toLowerCase();
    if (t.includes('parameter') || t.includes('paramet')) return 'parameter';
    if (t.includes('abszolutertek') || (t.includes('gyok') && !t.includes('bizony'))) return 'absroot';
    if (t.includes('exponencialis') || t.includes('logaritmus')) return 'explog';
    if (t.includes('bizonyitas')) return 'bizonyitas';
    if (t.includes('egyenletek') || t.includes('egyenlotlenseg')) return 'egyenletek';
    if (t.includes('fuggveny') || t.includes('analizis')) return 'fuggvenyek';
    return null;
}

/** Progress tároló kulcs minden témához */
export function resolveProgressStorageKey(topicId: string): string {
    const legacy = resolveTopicProgressKey(topicId);
    if (legacy) return legacy;
    return normalizeTopicId(topicId);
}

export function topicCompletionBadge(key: string): BadgeId | null {
    switch (key) {
        case 'parameter': return 'parameter_kesz';
        case 'explog': return 'explog_kesz';
        case 'absroot': return 'absroot_kesz';
        case 'bizonyitas':
        case 'egyenletek':
            return 'bizonyitas_kesz';
        case 'fuggvenyek': return 'fuggveny_kesz';
        default: return null;
    }
}

export function getBadgeDef(id: BadgeId): BadgeDef | undefined {
    return BADGE_DEFS.find((b) => b.id === id);
}

export function emptyProgress(): UserPracticeProgress {
    return { xp: 0, rank: 'BEGINNER', rankLevel: 1, badges: [], topics: {} };
}

function normalizeLoadedTopic(raw: any): TopicProgress {
    const base = emptyPathTopicProgress(Number(raw?.totalQuestions) || PATH_TOTAL_QUESTIONS);
    const lessonsCompleted = Array.isArray(raw?.lessonsCompleted) ? raw.lessonsCompleted.map(Number) : [];
    const stagesCompleted = Array.isArray(raw?.stagesCompleted) ? raw.stagesCompleted.map(Number) : [];
    const chestsClaimed = Array.isArray(raw?.chestsClaimed) ? raw.chestsClaimed.map(Number) : [];
    const highestUnlocked = Number(raw?.highestUnlocked) || computeHighestUnlocked(lessonsCompleted);
    return {
        ...base,
        bestCorrect: Number(raw?.bestCorrect) || 0,
        totalQuestions: Number(raw?.totalQuestions) || PATH_TOTAL_QUESTIONS,
        stagesCompleted,
        completed: Boolean(raw?.completed),
        perfect: Boolean(raw?.perfect),
        lessonsCompleted,
        highestUnlocked,
        chestsClaimed,
        updatedAt: raw?.updatedAt,
    };
}

export async function loadUserPracticeProgress(uid: string): Promise<UserPracticeProgress> {
    const firebase = (window as any).firebase;
    if (!firebase?.firestore) return emptyProgress();
    const db = firebase.firestore();
    const snap = await db.collection('users').doc(uid).collection('progress').doc('summary').get();
    if (!snap.exists) return emptyProgress();
    const data = snap.data() || {};
    const xp = Number(data.xp) || 0;
    const rankLevel = Number(data.rankLevel) || xpToRankLevel(xp);
    const rawTopics = data.topics || {};
    const topics: Record<string, TopicProgress> = {};
    Object.keys(rawTopics).forEach((k) => {
        topics[k] = normalizeLoadedTopic(rawTopics[k]);
    });
    return {
        xp,
        rank: data.rank || getRankTitle(rankLevel),
        rankLevel,
        badges: Array.isArray(data.badges) ? data.badges : [],
        topics,
        updatedAt: data.updatedAt,
    };
}

export type ProgressUpdateInput = {
    topicKey: string | null;
    topicId: string;
    correctCount: number;
    totalQuestions: number;
    stagesClearedThisRun: PracticeStage[];
    perfectRun: boolean;
    maxStreak: number;
    sessionXpFromAnswers: number;
    /** Path mód: melyik lecke készült el (1–6) */
    lessonJustCompleted?: number;
};

export type ProgressUpdateResult = {
    previous: UserPracticeProgress;
    next: UserPracticeProgress;
    xpGained: number;
    newBadges: BadgeId[];
};

export async function applyAndSaveProgress(
    uid: string,
    input: ProgressUpdateInput
): Promise<ProgressUpdateResult> {
    const firebase = (window as any).firebase;
    const previous = await loadUserPracticeProgress(uid);
    let xpGained = input.sessionXpFromAnswers;
    const badges = new Set<BadgeId>(previous.badges);
    const newBadges: BadgeId[] = [];
    const topics = { ...previous.topics };

    const unlock = (id: BadgeId) => {
        if (!badges.has(id)) {
            badges.add(id);
            newBadges.push(id);
        }
    };

    const storageKey = input.topicKey || resolveProgressStorageKey(input.topicId);

    if (storageKey) {
        const prevTopic = topics[storageKey]
            ? normalizeLoadedTopic(topics[storageKey])
            : emptyPathTopicProgress(input.totalQuestions || PATH_TOTAL_QUESTIONS);

        const lessonsCompleted = [...(prevTopic.lessonsCompleted || [])];
        let lessonXp = 0;
        if (input.lessonJustCompleted && input.lessonJustCompleted >= 1 && input.lessonJustCompleted <= PATH_LESSON_COUNT) {
            if (!lessonsCompleted.includes(input.lessonJustCompleted)) {
                lessonsCompleted.push(input.lessonJustCompleted);
                lessonXp = PATH_LESSON_XP;
                xpGained += PATH_LESSON_XP;
            }
        }

        const stagesFromLessons = lessonsCompleted.map((l) => lessonToStage(l));
        const stagesSet = new Set<number>([
            ...(prevTopic.stagesCompleted || []),
            ...input.stagesClearedThisRun,
            ...stagesFromLessons,
        ]);
        const newlyClearedStages = input.stagesClearedThisRun.filter(
            (s) => !(prevTopic.stagesCompleted || []).includes(s)
        );
        // Path módban a lecke XP a fő jutalom; stage bónusz csak ha nem path lesson
        if (!input.lessonJustCompleted) {
            xpGained += newlyClearedStages.length * 50;
        }

        const highestUnlocked = computeHighestUnlocked(lessonsCompleted);
        const pathComplete = lessonsCompleted.length >= PATH_LESSON_COUNT
            && Array.from({ length: PATH_LESSON_COUNT }, (_, i) => i + 1).every((n) => lessonsCompleted.includes(n));

        const correctTotal = Math.max(prevTopic.bestCorrect || 0, input.correctCount);
        // Path: bestCorrect = kész leckék × 3
        const pathBest = lessonsCompleted.length * 3;
        const bestCorrect = input.lessonJustCompleted
            ? Math.max(prevTopic.bestCorrect || 0, pathBest)
            : correctTotal;

        const completedNow = pathComplete
            || (input.correctCount >= input.totalQuestions && input.totalQuestions > 0 && !input.lessonJustCompleted);
        const firstComplete = completedNow && !prevTopic.completed;
        if (firstComplete && !input.lessonJustCompleted) xpGained += 100;
        if (pathComplete && !prevTopic.completed) {
            xpGained += 100;
            unlock('ut_bejart');
        }
        if (completedNow && input.perfectRun && !prevTopic.perfect) xpGained += 50;

        topics[storageKey] = {
            bestCorrect,
            totalQuestions: PATH_TOTAL_QUESTIONS,
            stagesCompleted: Array.from(stagesSet).sort((a, b) => a - b),
            completed: prevTopic.completed || completedNow || pathComplete,
            perfect: prevTopic.perfect || (completedNow && input.perfectRun),
            lessonsCompleted: lessonsCompleted.sort((a, b) => a - b),
            highestUnlocked,
            chestsClaimed: prevTopic.chestsClaimed || [],
        };

        if (topics[storageKey]!.completed) {
            const b = topicCompletionBadge(storageKey);
            if (b) unlock(b);
            // Legacy badge a resolveTopicProgressKey alapján is
            const legacy = resolveTopicProgressKey(input.topicId);
            if (legacy) {
                const lb = topicCompletionBadge(legacy);
                if (lb) unlock(lb);
            }
        }
        if ((topics[storageKey]!.stagesCompleted || []).includes(3)) {
            unlock('mester_szakasz');
        }

        void lessonXp;
    }

    if (input.maxStreak >= 5) unlock('hibatlan_5');

    const nextXp = previous.xp + xpGained;
    if (nextXp >= 500) unlock('xp_500');
    if (nextXp >= 1000) unlock('xp_1000');

    const rankLevel = xpToRankLevel(nextXp);
    const next: UserPracticeProgress = {
        xp: nextXp,
        rank: getRankTitle(rankLevel),
        rankLevel,
        badges: Array.from(badges),
        topics,
    };

    if (firebase?.firestore) {
        const db = firebase.firestore();
        await db.collection('users').doc(uid).collection('progress').doc('summary').set(
            {
                ...next,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    }

    return { previous, next, xpGained, newBadges };
}

/** Kincs claim az útvonalról */
export async function claimPathChest(
    uid: string,
    topicId: string,
    chest: 1 | 2 | 3
): Promise<ProgressUpdateResult & { alreadyClaimed: boolean }> {
    const firebase = (window as any).firebase;
    const previous = await loadUserPracticeProgress(uid);
    const storageKey = resolveProgressStorageKey(topicId);
    const prevTopic = previous.topics[storageKey]
        ? normalizeLoadedTopic(previous.topics[storageKey])
        : emptyPathTopicProgress();

    const lessonsCompleted = prevTopic.lessonsCompleted || [];
    const gate = chest * 2;
    const unlockable = lessonsCompleted.includes(gate);
    const already = (prevTopic.chestsClaimed || []).includes(chest);

    if (!unlockable || already) {
        return { previous, next: previous, xpGained: 0, newBadges: [], alreadyClaimed: true };
    }

    const xpGained = PATH_CHEST_XP[chest];
    const badges = new Set<BadgeId>(previous.badges);
    const newBadges: BadgeId[] = [];
    const unlock = (id: BadgeId) => {
        if (!badges.has(id)) {
            badges.add(id);
            newBadges.push(id);
        }
    };

    const chestsClaimed = [...(prevTopic.chestsClaimed || []), chest];
    const topics = {
        ...previous.topics,
        [storageKey]: {
            ...prevTopic,
            chestsClaimed,
        },
    };

    const nextXp = previous.xp + xpGained;
    if (nextXp >= 500) unlock('xp_500');
    if (nextXp >= 1000) unlock('xp_1000');
    if (chest === 3) {
        unlock('ut_bejart');
        const legacy = resolveTopicProgressKey(topicId);
        if (legacy) {
            const b = topicCompletionBadge(legacy);
            if (b) unlock(b);
        }
        topics[storageKey] = {
            ...topics[storageKey],
            completed: true,
        };
    }

    const rankLevel = xpToRankLevel(nextXp);
    const next: UserPracticeProgress = {
        xp: nextXp,
        rank: getRankTitle(rankLevel),
        rankLevel,
        badges: Array.from(badges),
        topics,
    };

    if (firebase?.firestore) {
        const db = firebase.firestore();
        await db.collection('users').doc(uid).collection('progress').doc('summary').set(
            {
                ...next,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    }

    return { previous, next, xpGained, newBadges, alreadyClaimed: false };
}
