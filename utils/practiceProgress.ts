/** Emelt érettségi / Duolingo út progresszió: XP, rang, badge, stage, leckék */

import {
    PATH_CHEST_XP,
    PATH_LESSON_COUNT,
    PATH_LESSON_XP,
    PATH_QUESTIONS_PER_LESSON,
    PATH_TOTAL_QUESTIONS,
    computeHighestUnlocked,
    lessonToStage,
    normalizeTopicId,
    starsFromWrongCount,
} from './topicPath';

export type PracticeStage = 1 | 2 | 3 | 4 | 5 | 6;

export type BadgeId =
    | 'parameter_kesz'
    | 'explog_kesz'
    | 'absroot_kesz'
    | 'bizonyitas_kesz'
    | 'fuggveny_kesz'
    | 'halmazok_kesz'
    | 'kombinatorika_kesz'
    | 'ut_bejart'
    | 'mester_szakasz'
    | 'hibatlan_5'
    | 'xp_500'
    | 'xp_1000';

/** Régi munkalap kulcsok — badge mappinghez */
export type TopicProgressKey = 'parameter' | 'explog' | 'absroot' | 'bizonyitas' | 'egyenletek' | 'fuggvenyek' | 'halmazok' | 'kombinatorika';

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
    /** Lecke → legjobb csillag (1–3) */
    lessonStars?: Record<number, 1 | 2 | 3>;
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
        lessonStars: {},
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
    { id: 'halmazok_kesz', title: 'Halmazok mester', description: 'Halmazok munkalap teljesítve', icon: '{}' },
    { id: 'kombinatorika_kesz', title: 'Kombinatorika mester', description: 'Kombinatorika munkalap teljesítve', icon: '🔢' },
    { id: 'ut_bejart', title: 'Út bejárva', description: 'Egy teljes témakör-út (6 lecke) kész', icon: '🗺️' },
    { id: 'mester_szakasz', title: 'Mester szakasz', description: 'Bármely munkalap 6. szintje kész', icon: '🏆' },
    { id: 'hibatlan_5', title: '5 hibátlan', description: '5 helyes válasz egymás után', icon: '🔥' },
    { id: 'xp_500', title: '500 XP', description: 'Elérted az 500 XP-t', icon: '⭐' },
    { id: 'xp_1000', title: '1000 XP', description: 'Elérted az 1000 XP-t', icon: '👑' },
];

export const STAGE_LABELS: Record<PracticeStage, string> = {
    1: '1. szint',
    2: '2. szint',
    3: '3. szint',
    4: '4. szint',
    5: '5. szint',
    6: '6. szint',
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

/** Avatar háttérszín — game + uniboost közös. */
export function getAvatarColor(level: number): string {
    if (level >= 20) return 'linear-gradient(45deg, #FFD700, #FFA500)';
    if (level >= 15) return 'linear-gradient(45deg, #C0C0C0, #808080)';
    if (level >= 10) return 'linear-gradient(45deg, #CD7F32, #8B4513)';
    if (level >= 5) return 'linear-gradient(45deg, #4169E1, #1E90FF)';
    return 'linear-gradient(45deg, #87CEEB, #4682B4)';
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
    const hasExplicit = list.some((q) => typeof q.stage === 'number' && q.stage >= 1 && q.stage <= 6);
    if (hasExplicit) {
        return list
            .map((q) => {
                const stage = (q.stage && q.stage >= 1 && q.stage <= 6 ? q.stage : 1) as PracticeStage;
                return { ...q, stage };
            })
            .sort((a, b) => a.stage - b.stage);
    }
    // 6 egyenlő sáv, ha nincs előre jelölt stage
    return list.map((q, i) => {
        const band = Math.min(5, Math.floor((i * 6) / Math.max(1, n)));
        let stage = (band + 1) as PracticeStage;
        if (q.question && /mesterfok|főgonosz|Mihaszna-mester|szintzáró|6\. szint/i.test(q.question)) {
            stage = 6;
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
    if (t.includes('halmaz')) return 'halmazok';
    if (t.includes('kombinatorika')) return 'kombinatorika';
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
        case 'halmazok': return 'halmazok_kesz';
        case 'kombinatorika': return 'kombinatorika_kesz';
        default: return null;
    }
}

export function getBadgeDef(id: BadgeId): BadgeDef | undefined {
    return BADGE_DEFS.find((b) => b.id === id);
}

export function emptyProgress(): UserPracticeProgress {
    return { xp: 0, rank: 'BEGINNER', rankLevel: 1, badges: [], topics: {} };
}

const LOCAL_PROGRESS_KEY = 'mihaszna_practice_progress_v1';

function normalizeLoadedTopic(raw: any): TopicProgress {
    const base = emptyPathTopicProgress(Number(raw?.totalQuestions) || PATH_TOTAL_QUESTIONS);
    const lessonsCompleted = Array.isArray(raw?.lessonsCompleted) ? raw.lessonsCompleted.map(Number) : [];
    const stagesCompleted = Array.isArray(raw?.stagesCompleted) ? raw.stagesCompleted.map(Number) : [];
    const chestsClaimed = Array.isArray(raw?.chestsClaimed) ? raw.chestsClaimed.map(Number) : [];
    const highestUnlocked = Number(raw?.highestUnlocked) || computeHighestUnlocked(lessonsCompleted);
    const lessonStars: Record<number, 1 | 2 | 3> = {};
    if (raw?.lessonStars && typeof raw.lessonStars === 'object') {
        Object.keys(raw.lessonStars).forEach((k) => {
            const lesson = Number(k);
            const stars = Number(raw.lessonStars[k]);
            if (lesson >= 1 && (stars === 1 || stars === 2 || stars === 3)) {
                lessonStars[lesson] = stars;
            }
        });
    }
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
        lessonStars,
        updatedAt: raw?.updatedAt,
    };
}

function loadLocalProgress(): UserPracticeProgress {
    if (typeof window === 'undefined') return emptyProgress();
    try {
        const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
        if (!raw) return emptyProgress();
        const data = JSON.parse(raw);
        const xp = Number(data.xp) || 0;
        const rankLevel = Number(data.rankLevel) || xpToRankLevel(xp);
        const topics: Record<string, TopicProgress> = {};
        Object.keys(data.topics || {}).forEach((k) => {
            topics[k] = normalizeLoadedTopic(data.topics[k]);
        });
        return {
            xp,
            rank: data.rank || getRankTitle(rankLevel),
            rankLevel,
            badges: Array.isArray(data.badges) ? data.badges : [],
            topics,
            updatedAt: data.updatedAt,
        };
    } catch {
        return emptyProgress();
    }
}

function saveLocalProgress(progress: UserPracticeProgress) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(
            LOCAL_PROGRESS_KEY,
            JSON.stringify({ ...progress, updatedAt: Date.now() })
        );
    } catch {
        /* ignore quota */
    }
}

function mergeTopicProgress(a: TopicProgress, b: TopicProgress): TopicProgress {
    const lessons = Array.from(
        new Set([...(a.lessonsCompleted || []), ...(b.lessonsCompleted || [])])
    ).sort((x, y) => x - y);
    const stages = Array.from(
        new Set([...(a.stagesCompleted || []), ...(b.stagesCompleted || [])])
    ).sort((x, y) => x - y);
    const chests = Array.from(
        new Set([...(a.chestsClaimed || []), ...(b.chestsClaimed || [])])
    ).sort((x, y) => x - y);
    return {
        bestCorrect: Math.max(a.bestCorrect || 0, b.bestCorrect || 0),
        totalQuestions: Math.max(a.totalQuestions || 0, b.totalQuestions || 0, PATH_TOTAL_QUESTIONS),
        stagesCompleted: stages,
        completed: Boolean(a.completed || b.completed),
        perfect: Boolean(a.perfect || b.perfect),
        lessonsCompleted: lessons,
        highestUnlocked: Math.max(
            a.highestUnlocked || 1,
            b.highestUnlocked || 1,
            computeHighestUnlocked(lessons)
        ),
        chestsClaimed: chests,
    };
}

function mergeProgress(local: UserPracticeProgress, remote: UserPracticeProgress): UserPracticeProgress {
    const xp = Math.max(local.xp || 0, remote.xp || 0);
    const rankLevel = Math.max(local.rankLevel || 1, remote.rankLevel || 1, xpToRankLevel(xp));
    const badges = Array.from(new Set([...(local.badges || []), ...(remote.badges || [])]));
    const topics: Record<string, TopicProgress> = { ...local.topics };
    Object.keys(remote.topics || {}).forEach((k) => {
        topics[k] = topics[k]
            ? mergeTopicProgress(topics[k], remote.topics[k])
            : normalizeLoadedTopic(remote.topics[k]);
    });
    return {
        xp,
        rank: getRankTitle(rankLevel),
        rankLevel,
        badges: badges as BadgeId[],
        topics,
    };
}

async function persistProgress(uid: string | null | undefined, next: UserPracticeProgress) {
    saveLocalProgress(next);
    const firebase = (window as any).firebase;
    if (uid && firebase?.firestore) {
        try {
            const db = firebase.firestore();
            await db.collection('users').doc(uid).collection('progress').doc('summary').set(
                {
                    ...next,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );
            // #region agent log
            const { agentDebugLog } = await import('./agentDebugLog');
            agentDebugLog({
                hypothesisId: 'P3',
                location: 'practiceProgress.ts:persistProgress',
                message: 'progress write ok',
                data: { uidLen: String(uid).length },
                runId: 'firestore-perms',
            });
            // #endregion
        } catch (err: any) {
            // #region agent log
            const { agentDebugLog } = await import('./agentDebugLog');
            agentDebugLog({
                hypothesisId: 'P2-P3',
                location: 'practiceProgress.ts:persistProgress',
                message: 'progress write failed',
                data: {
                    code: String(err?.code || '').slice(0, 80),
                    msg: String(err?.message || err).slice(0, 160),
                },
                runId: 'firestore-perms',
            });
            // #endregion
            // Lokális progress megmarad — ne dőljön el a játék unpublished rules miatt
            console.warn('persistProgress firestore:', err?.code || err);
        }
    }
}

export async function loadUserPracticeProgress(uid?: string | null): Promise<UserPracticeProgress> {
    const local = loadLocalProgress();
    const firebase = (window as any).firebase;
    if (!uid || !firebase?.firestore) return local;

    try {
        const db = firebase.firestore();
        const snap = await db.collection('users').doc(uid).collection('progress').doc('summary').get();
        if (!snap.exists) return local;
        const data = snap.data() || {};
        const xp = Number(data.xp) || 0;
        const rankLevel = Number(data.rankLevel) || xpToRankLevel(xp);
        const rawTopics = data.topics || {};
        const topics: Record<string, TopicProgress> = {};
        Object.keys(rawTopics).forEach((k) => {
            topics[k] = normalizeLoadedTopic(rawTopics[k]);
        });
        const remote: UserPracticeProgress = {
            xp,
            rank: data.rank || getRankTitle(rankLevel),
            rankLevel,
            badges: Array.isArray(data.badges) ? data.badges : [],
            topics,
            updatedAt: data.updatedAt,
        };
        const merged = mergeProgress(local, remote);
        saveLocalProgress(merged);
        return merged;
    } catch (err: any) {
        // #region agent log
        const { agentDebugLog } = await import('./agentDebugLog');
        agentDebugLog({
            hypothesisId: 'P3',
            location: 'practiceProgress.ts:loadUserPracticeProgress',
            message: 'progress read failed',
            data: {
                code: String(err?.code || '').slice(0, 80),
                msg: String(err?.message || err).slice(0, 160),
            },
            runId: 'firestore-perms',
        });
        // #endregion
        return local;
    }
}

/** Csak Firestore — tanári dossziéhoz (ne keverje az admin lokális progressét). */
export async function loadRemotePracticeProgress(uid: string): Promise<UserPracticeProgress> {
    const firebase = (window as any).firebase;
    if (!uid || !firebase?.firestore) return emptyProgress();
    try {
        const snap = await firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .collection('progress')
            .doc('summary')
            .get();
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
    } catch {
        return emptyProgress();
    }
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
    /** Path mód: hibás első tippek száma a leckében → csillagok */
    lessonWrongCount?: number;
};

export type ProgressUpdateResult = {
    previous: UserPracticeProgress;
    next: UserPracticeProgress;
    xpGained: number;
    newBadges: BadgeId[];
};

export async function applyAndSaveProgress(
    uid: string | null | undefined,
    input: ProgressUpdateInput
): Promise<ProgressUpdateResult> {
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
        // Path: bestCorrect = kész leckék × feladatok/lecke
        const pathBest = lessonsCompleted.length * PATH_QUESTIONS_PER_LESSON;
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

        const lessonStars = { ...(prevTopic.lessonStars || {}) };
        if (input.lessonJustCompleted) {
            const earned = starsFromWrongCount(input.lessonWrongCount ?? 0);
            const prevStars = lessonStars[input.lessonJustCompleted] || 0;
            if (earned > prevStars) {
                lessonStars[input.lessonJustCompleted] = earned;
            }
        }

        topics[storageKey] = {
            bestCorrect,
            totalQuestions: PATH_TOTAL_QUESTIONS,
            stagesCompleted: Array.from(stagesSet).sort((a, b) => a - b),
            completed: prevTopic.completed || completedNow || pathComplete,
            perfect: prevTopic.perfect || (completedNow && input.perfectRun),
            lessonsCompleted: lessonsCompleted.sort((a, b) => a - b),
            highestUnlocked,
            chestsClaimed: prevTopic.chestsClaimed || [],
            lessonStars,
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
        if ((topics[storageKey]!.stagesCompleted || []).includes(6)) {
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

    await persistProgress(uid, next);

    return { previous, next, xpGained, newBadges };
}

/** Kincs claim az útvonalról */
export async function claimPathChest(
    uid: string | null | undefined,
    topicId: string,
    chest: 1 | 2 | 3
): Promise<ProgressUpdateResult & { alreadyClaimed: boolean }> {
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

    await persistProgress(uid, next);

    return { previous, next, xpGained, newBadges, alreadyClaimed: false };
}
