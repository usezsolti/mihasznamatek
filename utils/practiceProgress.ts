/** Emelt érettségi munkalap progresszió: XP, rang, badge, stage */

export type PracticeStage = 1 | 2 | 3;

export type BadgeId =
    | 'parameter_kesz'
    | 'explog_kesz'
    | 'absroot_kesz'
    | 'bizonyitas_kesz'
    | 'mester_szakasz'
    | 'hibatlan_5'
    | 'xp_500'
    | 'xp_1000';

export type TopicProgressKey = 'parameter' | 'explog' | 'absroot' | 'bizonyitas' | 'egyenletek';

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
    updatedAt?: any;
}

export interface UserPracticeProgress {
    xp: number;
    rank: string;
    rankLevel: number;
    badges: BadgeId[];
    topics: Partial<Record<TopicProgressKey, TopicProgress>>;
    updatedAt?: any;
}

export const BADGE_DEFS: BadgeDef[] = [
    { id: 'parameter_kesz', title: 'Paraméter mester', description: 'Paraméteres munkalap teljesítve', icon: 'α' },
    { id: 'explog_kesz', title: 'Exp/Log mester', description: 'Exponenciális–logaritmus munkalap teljesítve', icon: 'log' },
    { id: 'absroot_kesz', title: 'Abszolútérték–gyök mester', description: 'Abszolútérték/gyök munkalap teljesítve', icon: '|√' },
    { id: 'bizonyitas_kesz', title: 'Bizonyítás mester', description: 'Bizonyítási munkalap teljesítve', icon: '✓' },
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
    // Extra szintek 1000 XP-nként 5500 felett
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
        // Mesterfok feladatok mindig 3. szakasz
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
    return null;
}

export function topicCompletionBadge(key: TopicProgressKey): BadgeId | null {
    switch (key) {
        case 'parameter': return 'parameter_kesz';
        case 'explog': return 'explog_kesz';
        case 'absroot': return 'absroot_kesz';
        case 'bizonyitas':
        case 'egyenletek':
            return 'bizonyitas_kesz';
        default: return null;
    }
}

export function getBadgeDef(id: BadgeId): BadgeDef | undefined {
    return BADGE_DEFS.find((b) => b.id === id);
}

export function emptyProgress(): UserPracticeProgress {
    return { xp: 0, rank: 'BEGINNER', rankLevel: 1, badges: [], topics: {} };
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
    return {
        xp,
        rank: data.rank || getRankTitle(rankLevel),
        rankLevel,
        badges: Array.isArray(data.badges) ? data.badges : [],
        topics: data.topics || {},
        updatedAt: data.updatedAt,
    };
}

export type ProgressUpdateInput = {
    topicKey: TopicProgressKey | null;
    topicId: string;
    correctCount: number;
    totalQuestions: number;
    stagesClearedThisRun: PracticeStage[];
    perfectRun: boolean;
    maxStreak: number;
    sessionXpFromAnswers: number;
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

    if (input.topicKey) {
        const prevTopic = topics[input.topicKey] || {
            bestCorrect: 0,
            totalQuestions: input.totalQuestions,
            stagesCompleted: [] as number[],
            completed: false,
            perfect: false,
        };
        const stagesSet = new Set<number>([...(prevTopic.stagesCompleted || []), ...input.stagesClearedThisRun]);
        const newlyClearedStages = input.stagesClearedThisRun.filter(
            (s) => !(prevTopic.stagesCompleted || []).includes(s)
        );
        xpGained += newlyClearedStages.length * 50;

        const completedNow =
            input.correctCount >= input.totalQuestions && input.totalQuestions > 0;
        const firstComplete = completedNow && !prevTopic.completed;
        if (firstComplete) xpGained += 100;
        if (completedNow && input.perfectRun && !prevTopic.perfect) xpGained += 50;

        topics[input.topicKey] = {
            bestCorrect: Math.max(prevTopic.bestCorrect || 0, input.correctCount),
            totalQuestions: input.totalQuestions,
            stagesCompleted: Array.from(stagesSet).sort((a, b) => a - b),
            completed: prevTopic.completed || completedNow,
            perfect: prevTopic.perfect || (completedNow && input.perfectRun),
        };

        if (topics[input.topicKey]!.completed) {
            const b = topicCompletionBadge(input.topicKey);
            if (b) unlock(b);
        }
        if ((topics[input.topicKey]!.stagesCompleted || []).includes(3)) {
            unlock('mester_szakasz');
        }
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
