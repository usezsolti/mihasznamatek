/** Kihívásfa: időre, láncban, hibátlanul. Semmi nem könnyít — extra feltétel. */

export type SkillBranch = 'flame' | 'shield' | 'vault' | 'wind' | 'mind' | 'cap';

export type SkillNodeId =
    | 'flash_1'
    | 'chain_2'
    | 'clean_1'
    | 'heat_3'
    | 'quiet_3'
    | 'flash_3'
    | 'chain_3'
    | 'clean_3'
    | 'heat_5'
    | 'quiet_5'
    | 'cap_mix'
    | 'cap_iron'
    | 'master_sigma';

export type ChallengeRules = {
    questionCount: number;
    /** Közös idő, vagy kérdésenkénti idő (mp). */
    seconds: number;
    timerMode: 'shared' | 'perQuestion';
    lives: number;
    noBoosters: boolean;
    failOnWrong: boolean;
};

export type SkillNode = {
    id: SkillNodeId;
    title: string;
    desc: string;
    effect: string;
    icon: string;
    cost: number;
    requires: SkillNodeId[];
    branch: SkillBranch;
    x: number;
    y: number;
    rules: ChallengeRules;
};

export type SkillPerks = {
    comboEarlier: boolean;
    extraLives: number;
    freezeBonus: number;
    blitzBonus: number;
    xpBonus: number;
    loginFifty: number;
    loginSecond: number;
    loginFreeze: number;
    bossXpBonus: number;
    lessonXpBonus: number;
    tightHint: boolean;
    startSecondArmed: boolean;
};

export const BRANCH_META: Record<SkillBranch, { label: string; color: string; glow: string }> = {
    flame: { label: 'Idő', color: '#ff6b1a', glow: 'rgba(255, 107, 26, 0.45)' },
    shield: { label: 'Lánc', color: '#3aa0ff', glow: 'rgba(58, 160, 255, 0.45)' },
    vault: { label: 'Tiszta', color: '#f5c400', glow: 'rgba(245, 196, 0, 0.45)' },
    wind: { label: 'Nyomás', color: '#39ff14', glow: 'rgba(57, 255, 20, 0.4)' },
    mind: { label: 'Csend', color: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)' },
    cap: { label: 'Csúcs', color: '#ffd400', glow: 'rgba(255, 212, 0, 0.55)' },
};

export const SKILL_NODES: SkillNode[] = [
    {
        id: 'flash_1',
        title: 'Villám 1',
        desc: 'Idő-ág: egy feladat, rövid óra.',
        effect: '1 feladat, 25 másodperc. Ha lejár az idő, a kihívás vége.',
        icon: '⚡',
        cost: 80,
        requires: [],
        branch: 'flame',
        x: 10,
        y: 12,
        rules: { questionCount: 1, seconds: 25, timerMode: 'shared', lives: 1, noBoosters: false, failOnWrong: true },
    },
    {
        id: 'chain_2',
        title: 'Dupla lánc',
        desc: 'Lánc-ág: két feladat, kérdésenként új idő.',
        effect: '2 feladat egymás után. Mindegyikre 20 másodperced van.',
        icon: '🔗',
        cost: 110,
        requires: [],
        branch: 'shield',
        x: 30,
        y: 12,
        rules: { questionCount: 2, seconds: 20, timerMode: 'perQuestion', lives: 2, noBoosters: false, failOnWrong: false },
    },
    {
        id: 'clean_1',
        title: 'Tiszta 1',
        desc: 'Tiszta-ág: egy hiba is bukás.',
        effect: '1 feladat, 30 mp. Hibás válasz = a kihívás elbukott.',
        icon: '✨',
        cost: 140,
        requires: [],
        branch: 'vault',
        x: 50,
        y: 12,
        rules: { questionCount: 1, seconds: 30, timerMode: 'shared', lives: 1, noBoosters: false, failOnWrong: true },
    },
    {
        id: 'heat_3',
        title: 'Egy élet',
        desc: 'Nyomás-ág: három feladat, egy élet.',
        effect: '3 feladat, 60 mp együtt, 1 élet. Egy hiba és vége.',
        icon: '❤️',
        cost: 170,
        requires: [],
        branch: 'wind',
        x: 70,
        y: 12,
        rules: { questionCount: 3, seconds: 60, timerMode: 'shared', lives: 1, noBoosters: false, failOnWrong: true },
    },
    {
        id: 'quiet_3',
        title: 'Csend 3',
        desc: 'Csend-ág: nincs 50/50, nincs fagy, nincs 2. esély.',
        effect: '3 feladat, 70 mp. Booster nélkül kell megoldanod.',
        icon: '🔇',
        cost: 200,
        requires: [],
        branch: 'mind',
        x: 90,
        y: 12,
        rules: { questionCount: 3, seconds: 70, timerMode: 'shared', lives: 3, noBoosters: true, failOnWrong: false },
    },

    {
        id: 'flash_3',
        title: 'Villám 3',
        desc: 'Három feladat egy közös órával.',
        effect: '3 feladat, 45 másodperc együtt. Mindet időn belül kell.',
        icon: '⏱️',
        cost: 250,
        requires: ['flash_1'],
        branch: 'flame',
        x: 10,
        y: 36,
        rules: { questionCount: 3, seconds: 45, timerMode: 'shared', lives: 1, noBoosters: false, failOnWrong: true },
    },
    {
        id: 'chain_3',
        title: 'Hármas lánc',
        desc: 'Három feladat, kérdésenként szűkülő idő.',
        effect: '3 feladat. Mindegyikre 15 másodperc, a következőnél újraindul.',
        icon: '⛓️',
        cost: 280,
        requires: ['chain_2'],
        branch: 'shield',
        x: 30,
        y: 36,
        rules: { questionCount: 3, seconds: 15, timerMode: 'perQuestion', lives: 2, noBoosters: false, failOnWrong: false },
    },
    {
        id: 'clean_3',
        title: 'Tiszta 3',
        desc: 'Három hibátlan megoldás.',
        effect: '3 feladat, 55 mp. Egyetlen hiba is elbukja a kihívást.',
        icon: '💎',
        cost: 310,
        requires: ['clean_1'],
        branch: 'vault',
        x: 50,
        y: 36,
        rules: { questionCount: 3, seconds: 55, timerMode: 'shared', lives: 1, noBoosters: false, failOnWrong: true },
    },
    {
        id: 'heat_5',
        title: 'Ötös nyomás',
        desc: 'Öt feladat, egy élet.',
        effect: '5 feladat, 80 mp, 1 élet. Hibázol = vége.',
        icon: '🔥',
        cost: 340,
        requires: ['heat_3'],
        branch: 'wind',
        x: 70,
        y: 36,
        rules: { questionCount: 5, seconds: 80, timerMode: 'shared', lives: 1, noBoosters: false, failOnWrong: true },
    },
    {
        id: 'quiet_5',
        title: 'Csend 5',
        desc: 'Öt feladat booster nélkül.',
        effect: '5 feladat, 90 mp. Sem 50/50, sem időfagy, sem 2. esély.',
        icon: '🚫',
        cost: 370,
        requires: ['quiet_3'],
        branch: 'mind',
        x: 90,
        y: 36,
        rules: { questionCount: 5, seconds: 90, timerMode: 'shared', lives: 3, noBoosters: true, failOnWrong: false },
    },

    {
        id: 'cap_mix',
        title: 'Percenként',
        desc: 'Lánc + nyomás korona.',
        effect: '6 feladat, kérdésenként 12 mp, 1 élet.',
        icon: '⏳',
        cost: 480,
        requires: ['flash_3', 'chain_3', 'heat_5'],
        branch: 'cap',
        x: 30,
        y: 60,
        rules: { questionCount: 6, seconds: 12, timerMode: 'perQuestion', lives: 1, noBoosters: false, failOnWrong: true },
    },
    {
        id: 'cap_iron',
        title: 'Vasóra',
        desc: 'Tiszta + csend korona.',
        effect: '8 feladat, 100 mp együtt, booster nélkül. Hiba = vége.',
        icon: '🛡️',
        cost: 520,
        requires: ['clean_3', 'quiet_5', 'heat_3'],
        branch: 'cap',
        x: 70,
        y: 60,
        rules: { questionCount: 8, seconds: 100, timerMode: 'shared', lives: 1, noBoosters: true, failOnWrong: true },
    },

    {
        id: 'master_sigma',
        title: 'Σ Mesterpróba',
        desc: 'A fa csúcsa.',
        effect: '10 feladat, kérdésenként 8 mp, 1 élet, booster nélkül.',
        icon: '👑',
        cost: 700,
        requires: ['cap_mix', 'cap_iron'],
        branch: 'cap',
        x: 50,
        y: 82,
        rules: { questionCount: 10, seconds: 8, timerMode: 'perQuestion', lives: 1, noBoosters: true, failOnWrong: true },
    },
];

export const EMPTY_SKILL_PERKS: SkillPerks = {
    comboEarlier: false,
    extraLives: 0,
    freezeBonus: 0,
    blitzBonus: 0,
    xpBonus: 0,
    loginFifty: 0,
    loginSecond: 0,
    loginFreeze: 0,
    bossXpBonus: 0,
    lessonXpBonus: 0,
    tightHint: false,
    startSecondArmed: false,
};

export function isSkillNodeId(id: string): id is SkillNodeId {
    return SKILL_NODES.some((n) => n.id === id);
}

/** A kihívásfa nem ad könnyítő perket. */
export function deriveSkillPerks(_unlocked?: string[]): SkillPerks {
    return { ...EMPTY_SKILL_PERKS };
}

export function skillNodeById(id: string): SkillNode | undefined {
    return SKILL_NODES.find((n) => n.id === id);
}

export function canUnlockSkill(
    id: SkillNodeId,
    unlocked: string[],
    points: number
): { ok: boolean; reason?: string } {
    const node = skillNodeById(id);
    if (!node) return { ok: false, reason: 'unknown' };
    if (unlocked.includes(id)) return { ok: false, reason: 'already' };
    if (node.requires.some((req) => !unlocked.includes(req))) {
        return { ok: false, reason: 'locked' };
    }
    if (points < node.cost) return { ok: false, reason: 'xp' };
    return { ok: true };
}

export function syncSkillsFromXp(xp: number): SkillNodeId[] {
    const unlocked: SkillNodeId[] = [];
    let changed = true;
    while (changed) {
        changed = false;
        for (const node of SKILL_NODES) {
            if (unlocked.includes(node.id)) continue;
            if (node.requires.some((req) => !unlocked.includes(req))) continue;
            if (xp >= node.cost) {
                unlocked.push(node.id);
                changed = true;
            }
        }
    }
    return unlocked;
}

export function skillEdges(): Array<{ from: SkillNodeId; to: SkillNodeId }> {
    const edges: Array<{ from: SkillNodeId; to: SkillNodeId }> = [];
    for (const node of SKILL_NODES) {
        for (const req of node.requires) {
            edges.push({ from: req, to: node.id });
        }
    }
    return edges;
}
