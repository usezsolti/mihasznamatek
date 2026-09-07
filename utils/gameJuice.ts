/** Játékíz: combo, napi küldetés, login-sorozat, booster, villámkör, mascot cucc. */

import { deriveSkillPerks, isSkillNodeId, type SkillNodeId } from './skillTree';

export const BLITZ_SECONDS = 60;
export const FREEZE_SECONDS = 20;

export type BoosterKind = 'fiftyFifty' | 'secondChance' | 'freeze';

export type DailyQuestId = 'lessons_3' | 'correct_10' | 'mix_1';

export type DailyQuest = {
    id: DailyQuestId;
    title: string;
    progress: number;
    target: number;
    done: boolean;
};

export type JuiceBoosters = {
    fiftyFifty: number;
    secondChance: number;
    freeze: number;
};

export type GameJuiceState = {
    questDate: string;
    quests: DailyQuest[];
    loginStreak: number;
    lastLoginDate: string;
    boosters: JuiceBoosters;
    blitzBest: number;
    skillPoints: number;
    unlockedSkills: SkillNodeId[];
    skillMigrated?: boolean;
    /** xp = a fa XP-ből vehető, nincs ingyen perk */
    skillShop?: 'xp' | 'points';
};

export type MascotGear = 'none' | 'glasses' | 'hat' | 'cape' | 'crown';

export const BOOSTER_XP_COST: Record<BoosterKind, number> = {
    fiftyFifty: 25,
    secondChance: 40,
    freeze: 30,
};

export const BOOSTER_LABEL: Record<BoosterKind, string> = {
    fiftyFifty: '50/50',
    secondChance: '2. esély',
    freeze: 'Időfagy',
};

export function todayKey(now = Date.now()): string {
    const d = new Date(now);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function isYesterday(dateKey: string, today = todayKey()): boolean {
    if (!dateKey) return false;
    const [y, m, d] = today.split('-').map(Number);
    const prev = new Date(y, (m || 1) - 1, d || 1);
    prev.setDate(prev.getDate() - 1);
    return dateKey === todayKey(prev.getTime());
}

export function freshQuests(): DailyQuest[] {
    return [
        { id: 'lessons_3', title: '3 lecke ma', progress: 0, target: 3, done: false },
        { id: 'correct_10', title: '10 helyes válasz', progress: 0, target: 10, done: false },
        { id: 'mix_1', title: '1 vegyes vagy napi kör', progress: 0, target: 1, done: false },
    ];
}

export function emptyJuice(): GameJuiceState {
    return {
        questDate: '',
        quests: freshQuests(),
        loginStreak: 0,
        lastLoginDate: '',
        boosters: { fiftyFifty: 0, secondChance: 0, freeze: 0 },
        blitzBest: 0,
        skillPoints: 0,
        unlockedSkills: [],
        skillMigrated: true,
        skillShop: 'xp',
    };
}

function clampInt(n: unknown, fallback = 0): number {
    const v = Number(n);
    if (!Number.isFinite(v)) return fallback;
    return Math.max(0, Math.floor(v));
}

export function normalizeJuice(raw: unknown): GameJuiceState {
    const base = emptyJuice();
    if (!raw || typeof raw !== 'object') return base;
    const data = raw as Partial<GameJuiceState> & { boosters?: Partial<JuiceBoosters> };
    const questsById = new Map((Array.isArray(data.quests) ? data.quests : []).map((q) => [q.id, q]));
    const quests = freshQuests().map((def) => {
        const prev = questsById.get(def.id);
        const progress = clampInt(prev?.progress);
        const target = def.target;
        return {
            ...def,
            progress: Math.min(progress, target),
            done: Boolean(prev?.done) || progress >= target,
        };
    });
    return {
        questDate: typeof data.questDate === 'string' ? data.questDate : '',
        quests,
        loginStreak: clampInt(data.loginStreak),
        lastLoginDate: typeof data.lastLoginDate === 'string' ? data.lastLoginDate : '',
        boosters: {
            fiftyFifty: clampInt(data.boosters?.fiftyFifty),
            secondChance: clampInt(data.boosters?.secondChance),
            freeze: clampInt(data.boosters?.freeze),
        },
        blitzBest: clampInt(data.blitzBest),
        skillPoints: clampInt(data.skillPoints),
        unlockedSkills: Array.from(new Set(
            (Array.isArray(data.unlockedSkills) ? data.unlockedSkills : [])
                .map(String)
                .filter(isSkillNodeId)
        )),
        skillMigrated: Boolean(data.skillMigrated),
        skillShop: data.skillShop === 'xp' ? 'xp' : 'points',
    };
}

export function mergeJuice(a?: GameJuiceState, b?: GameJuiceState): GameJuiceState {
    const A = normalizeJuice(a);
    const B = normalizeJuice(b);
    const later = A.lastLoginDate >= B.lastLoginDate ? A : B;
    const other = later === A ? B : A;
    const questSrc = A.questDate >= B.questDate ? A : B;
    const aXp = A.skillShop === 'xp';
    const bXp = B.skillShop === 'xp';
    const unlockedSkills = aXp && !bXp
        ? A.unlockedSkills
        : bXp && !aXp
            ? B.unlockedSkills
            : Array.from(new Set([...A.unlockedSkills, ...B.unlockedSkills]));
    // #region agent log
    if (A.skillShop !== B.skillShop || A.unlockedSkills.length !== B.unlockedSkills.length) {
        void import('./agentDebugLog').then(({ agentDebugLog }) => {
            agentDebugLog({
                hypothesisId: 'D',
                location: 'gameJuice.ts:mergeJuice',
                message: 'juice skill merge',
                data: {
                    aShop: A.skillShop,
                    bShop: B.skillShop,
                    aN: A.unlockedSkills.length,
                    bN: B.unlockedSkills.length,
                    outN: unlockedSkills.length,
                },
                runId: 'skill-xp',
            });
        });
    }
    // #endregion
    return {
        questDate: questSrc.questDate,
        quests: questSrc.quests,
        loginStreak: later.lastLoginDate === other.lastLoginDate
            ? Math.max(A.loginStreak, B.loginStreak)
            : later.loginStreak,
        lastLoginDate: later.lastLoginDate,
        boosters: {
            fiftyFifty: Math.max(A.boosters.fiftyFifty, B.boosters.fiftyFifty),
            secondChance: Math.max(A.boosters.secondChance, B.boosters.secondChance),
            freeze: Math.max(A.boosters.freeze, B.boosters.freeze),
        },
        blitzBest: Math.max(A.blitzBest, B.blitzBest),
        skillPoints: Math.max(A.skillPoints, B.skillPoints),
        unlockedSkills,
        skillMigrated: Boolean(A.skillMigrated || B.skillMigrated),
        skillShop: A.skillShop === 'xp' || B.skillShop === 'xp' ? 'xp' : 'points',
    };
}

/** 1× alap, 2× 3-tól, 3× 5-től, 4× 8-tól. Korai perk: egy lépéssel előbb. */
export function comboMultiplier(streak: number, earlier = false): number {
    const twoAt = earlier ? 2 : 3;
    const threeAt = earlier ? 4 : 5;
    const fourAt = earlier ? 6 : 8;
    if (streak >= fourAt) return 4;
    if (streak >= threeAt) return 3;
    if (streak >= twoAt) return 2;
    return 1;
}

export function isComboMilestone(streak: number): boolean {
    return streak === 3 || streak === 5 || streak === 8 || (streak > 0 && streak % 10 === 0);
}

export function gearFromRank(level: number): MascotGear {
    if (level >= 20) return 'crown';
    if (level >= 15) return 'cape';
    if (level >= 10) return 'hat';
    if (level >= 5) return 'glasses';
    return 'none';
}

export function getFlavorTitle(level: number): string {
    if (level >= 20) return 'Koronás Σ';
    if (level >= 15) return 'Mátrix mester';
    if (level >= 10) return 'Analízis lovag';
    if (level >= 5) return 'Lángoló szigma';
    return 'Kezdő hex';
}

export function fiftyFiftyHint(answer: number, extra?: number[], tight = false): string {
    const nums = [answer, ...(extra || [])].filter((n) => Number.isFinite(n));
    const primary = nums[0];
    if (!Number.isFinite(primary)) return 'Tipp: nézd meg a nagyságrendet.';
    if (nums.length >= 2) {
        const lo = Math.min(...nums);
        const hi = Math.max(...nums);
        return `Tipp: a válaszok ${lo} és ${hi} között vannak.`;
    }
    if (primary === 0) return 'Tipp: a válasz 0.';
    if (primary === 1 || primary === -1) return `Tipp: a válasz ${primary}.`;
    const span = Math.max(tight ? 1 : 2, Math.round(Math.abs(primary) * (tight ? 0.18 : 0.35)) || (tight ? 1 : 2));
    const lo = Math.round(primary - span);
    const hi = Math.round(primary + span);
    return `Tipp: a válasz ${lo} és ${hi} között van.`;
}

export type JuiceSessionEvent = {
    correctCount: number;
    lessonsCompleted: number;
    didMix: boolean;
    didDaily: boolean;
    didBlitz?: boolean;
    blitzScore?: number;
    maxStreak: number;
};

function bumpQuest(quests: DailyQuest[], id: DailyQuestId, add: number): DailyQuest[] {
    if (add <= 0) return quests;
    return quests.map((q) => {
        if (q.id !== id) return q;
        const progress = Math.min(q.target, q.progress + add);
        return { ...q, progress, done: progress >= q.target };
    });
}

export function applyJuiceEvent(juice: GameJuiceState, event: JuiceSessionEvent): GameJuiceState {
    const next = normalizeJuice(juice);
    next.quests = bumpQuest(next.quests, 'correct_10', event.correctCount);
    next.quests = bumpQuest(next.quests, 'lessons_3', event.lessonsCompleted);
    if (event.didMix || event.didDaily) {
        next.quests = bumpQuest(next.quests, 'mix_1', 1);
    }
    if (event.lessonsCompleted > 0) {
        next.boosters.fiftyFifty += event.lessonsCompleted;
    }
    if (event.maxStreak >= 5) {
        next.boosters.freeze += 1;
    }
    if (event.didDaily) {
        next.boosters.secondChance += 1;
    }
    if (event.didBlitz && typeof event.blitzScore === 'number') {
        next.blitzBest = Math.max(next.blitzBest, event.blitzScore);
    }
    return next;
}

export function rolloverDailyJuice(juice: GameJuiceState, now = Date.now()): GameJuiceState {
    const today = todayKey(now);
    const next = normalizeJuice(juice);
    if (next.lastLoginDate !== today) {
        next.loginStreak = isYesterday(next.lastLoginDate, today) ? next.loginStreak + 1 : 1;
        next.lastLoginDate = today;
        const perks = deriveSkillPerks(next.unlockedSkills);
        next.boosters.secondChance += 1 + perks.loginSecond;
        next.boosters.fiftyFifty += perks.loginFifty;
        next.boosters.freeze += perks.loginFreeze;
    }
    if (next.questDate !== today) {
        next.questDate = today;
        next.quests = freshQuests();
    }
    return next;
}
