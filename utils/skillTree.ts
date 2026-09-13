/**
 * Kihívásfa: öt önálló ág, ágankként tíz szint.
 * Nem könnyít semmin — minden szint egy plusz feltétel.
 * Egy szint akkor indítható, ha megvan az XP-küszöb és az ág előző szintje teljesítve van.
 */

export type SkillBranch = 'kronosz' | 'kristaly' | 'vandor' | 'arnyek' | 'vihar' | 'csucs';

export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SkillNodeId =
    | `kronosz${SkillLevel}`
    | `kristaly${SkillLevel}`
    | `vandor${SkillLevel}`
    | `arnyek${SkillLevel}`
    | `vihar${SkillLevel}`
    | 'mihasznaMester';

export type ChallengeBadgeId =
    | 'kronoszFel'
    | 'kronoszMester'
    | 'kristalyFel'
    | 'kristalyMester'
    | 'vandorFel'
    | 'vandorMester'
    | 'arnyekFel'
    | 'arnyekMester'
    | 'viharFel'
    | 'viharMester'
    | 'mihasznaMester';

/** Hogyan álljanak sorba a feladatok a kihívásban. */
export type ChallengeOrder = 'ramp' | 'reverse' | 'shuffle';

/** Hány témakörből jöjjenek a feladatok. */
export type ChallengeSpread = 'single' | 'mixed' | 'all';

export type ChallengeRules = {
    questionCount: number;
    /** Közös óra másodperce, vagy kérdésenkénti idő. */
    seconds: number;
    timerMode: 'shared' | 'perQuestion' | 'accelerating';
    /** Gyorsuló óránál az utolsó kérdésre ennyi idő marad. */
    secondsEnd?: number;
    /** Kérdésenként sorsolt idő: [min, max]. */
    randomSeconds?: [number, number];
    /** Közös óra: minden helyes válasz ennyi másodpercet ad vissza. */
    timeBonusPerCorrect?: number;
    /** Ennyi hibát bír el a futás. */
    lives: number;
    noBoosters: boolean;
    /** Egyetlen hiba is elbukja a kihívást. */
    failOnWrong: boolean;
    /** Nem látszik a visszaszámláló. */
    hideTimer?: boolean;
    /** Nem látszik, hányadik feladatnál tartasz. */
    hideTaskIndex?: boolean;
    /** A jó/rossz visszajelzés csak a kihívás végén derül ki. */
    deferFeedback?: boolean;
    /** Hibánál az egész sorozat elölről indul, az óra megy tovább. */
    resetOnWrong?: boolean;
    /** Siker esetén dupla XP, bukásnál semmi. */
    xpStake?: boolean;
    /** Nehézségi padló és plafon (1–6). */
    minStage?: number;
    maxStage?: number;
    spread?: ChallengeSpread;
    order?: ChallengeOrder;
};

export type SkillNode = {
    id: SkillNodeId;
    title: string;
    desc: string;
    effect: string;
    icon: string;
    /** XP-küszöb: ennyi XP kell az indításhoz. Nem kerül levonásra. */
    minXp: number;
    requires: SkillNodeId[];
    branch: SkillBranch;
    level: number;
    badgeId?: ChallengeBadgeId;
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

export const BRANCH_META: Record<
    SkillBranch,
    { label: string; tagline: string; color: string; glow: string; icon: string }
> = {
    kronosz: {
        label: 'Kronosz',
        tagline: 'Az idő ága',
        color: '#ff6b1a',
        glow: 'rgba(255, 107, 26, 0.45)',
        icon: '⏱️',
    },
    kristaly: {
        label: 'Kristály',
        tagline: 'A hibátlanság ága',
        color: '#3aa0ff',
        glow: 'rgba(58, 160, 255, 0.45)',
        icon: '💎',
    },
    vandor: {
        label: 'Vándor',
        tagline: 'A kitartás ága',
        color: '#39ff14',
        glow: 'rgba(57, 255, 20, 0.4)',
        icon: '🥾',
    },
    arnyek: {
        label: 'Árnyék',
        tagline: 'A vak ág',
        color: '#c084fc',
        glow: 'rgba(192, 132, 252, 0.45)',
        icon: '🌑',
    },
    vihar: {
        label: 'Vihar',
        tagline: 'A káosz ága',
        color: '#f5c400',
        glow: 'rgba(245, 196, 0, 0.45)',
        icon: '🌪️',
    },
    csucs: {
        label: 'Csúcs',
        tagline: 'A fa teteje',
        color: '#ffd400',
        glow: 'rgba(255, 212, 0, 0.55)',
        icon: '👑',
    },
};

/** Az ágon belüli XP-lépcső: a belépőhöz adódik hozzá. */
const XP_LADDER = [0, 40, 100, 180, 280, 400, 560, 760, 1000, 1300];

const BRANCH_ENTRY_XP: Record<Exclude<SkillBranch, 'csucs'>, number> = {
    kronosz: 0,
    kristaly: 120,
    vandor: 300,
    arnyek: 700,
    vihar: 1200,
};

type LevelSpec = {
    title: string;
    icon: string;
    desc: string;
    effect: string;
    rules: ChallengeRules;
};

const base = (
    questionCount: number,
    seconds: number,
    lives: number,
    extra: Partial<ChallengeRules> = {}
): ChallengeRules => ({
    questionCount,
    seconds,
    timerMode: 'shared',
    lives,
    noBoosters: false,
    failOnWrong: false,
    ...extra,
});

const KRONOSZ: LevelSpec[] = [
    {
        title: 'Szikra',
        icon: '⚡',
        desc: 'Az idő ágának első szikrája.',
        effect: '1 feladat, 40 másodperc.',
        rules: base(1, 40, 2),
    },
    {
        title: 'Gyújtás',
        icon: '🔥',
        desc: 'Két feladat egy közös órán.',
        effect: '2 feladat, 50 másodperc együtt.',
        rules: base(2, 50, 2),
    },
    {
        title: 'Percmutató',
        icon: '🕐',
        desc: 'Egy perc, három feladat.',
        effect: '3 feladat, 60 másodperc együtt.',
        rules: base(3, 60, 2),
    },
    {
        title: 'Homokóra',
        icon: '⏳',
        desc: 'Minden feladat új homokórát kap.',
        effect: '3 feladat, kérdésenként 20 másodperc.',
        rules: base(3, 20, 2, { timerMode: 'perQuestion' }),
    },
    {
        title: 'Időbank',
        icon: '🏦',
        desc: 'A helyes válasz másodperceket fizet vissza.',
        effect: '5 feladat, 40 mp-ről indul, minden helyes válasz +8 mp.',
        rules: base(5, 40, 2, { timeBonusPerCorrect: 8 }),
    },
    {
        title: 'Szűkülő',
        icon: '🌀',
        desc: 'Az óra kérdésről kérdésre kevesebbet ad.',
        effect: '5 feladat, az idő 25 mp-ről 10 mp-re szűkül.',
        rules: base(5, 25, 2, { timerMode: 'accelerating', secondsEnd: 10 }),
    },
    {
        title: 'Villám',
        icon: '⚡',
        desc: 'Gondolkodásra alig marad idő.',
        effect: '6 feladat, kérdésenként 12 másodperc.',
        rules: base(6, 12, 2, { timerMode: 'perQuestion' }),
    },
    {
        title: 'Vakóra',
        icon: '🕶️',
        desc: 'Megy az óra, csak épp nem látod.',
        effect: '6 feladat, 70 mp, rejtett visszaszámlálóval.',
        rules: base(6, 70, 2, { hideTimer: true }),
    },
    {
        title: 'Zuhanás',
        icon: '📉',
        desc: 'Egyre kevesebb idő, egyetlen élet.',
        effect: '8 feladat, az idő 18 mp-ről 6 mp-re esik, 1 élet.',
        rules: base(8, 18, 1, { timerMode: 'accelerating', secondsEnd: 6 }),
    },
    {
        title: 'Kronosz',
        icon: '👑',
        desc: 'Az idő ágának csúcsa.',
        effect: '10 feladat, kérdésenként 6 másodperc, 1 élet.',
        rules: base(10, 6, 1, { timerMode: 'perQuestion' }),
    },
];

const KRISTALY: LevelSpec[] = [
    {
        title: 'Tiszta lap',
        icon: '💧',
        desc: 'Egy feladat, egy esély.',
        effect: '1 feladat, 45 mp. Egy hiba is bukás.',
        rules: base(1, 45, 1, { failOnWrong: true }),
    },
    {
        title: 'Két csepp',
        icon: '💦',
        desc: 'Kettő egymás után, tisztán.',
        effect: '2 feladat, 60 mp. Egy hiba is bukás.',
        rules: base(2, 60, 1, { failOnWrong: true }),
    },
    {
        title: 'Csiszolás',
        icon: '✨',
        desc: 'Három hibátlan megoldás.',
        effect: '3 feladat, 60 mp. Egy hiba is bukás.',
        rules: base(3, 60, 1, { failOnWrong: true }),
    },
    {
        title: 'Repedés',
        icon: '🪨',
        desc: 'Négy feladat, egyetlen repedés nélkül.',
        effect: '4 feladat, 80 mp. Egy hiba is bukás.',
        rules: base(4, 80, 1, { failOnWrong: true }),
    },
    {
        title: 'Tükörfény',
        icon: '🪞',
        desc: 'Segítség nélkül, hibátlanul.',
        effect: '5 feladat, 90 mp, booster nélkül. Egy hiba is bukás.',
        rules: base(5, 90, 1, { failOnWrong: true, noBoosters: true }),
    },
    {
        title: 'Vakfolt',
        icon: '🌫️',
        desc: 'Csak a végén derül ki, mit rontottál.',
        effect: '5 feladat, 90 mp. A visszajelzés a kihívás végén jön.',
        rules: base(5, 90, 1, { failOnWrong: true, deferFeedback: true }),
    },
    {
        title: 'Gyémántszem',
        icon: '💠',
        desc: 'Se óra, se booster.',
        effect: '6 feladat, 100 mp, rejtett óra, booster nélkül. Egy hiba is bukás.',
        rules: base(6, 100, 1, { failOnWrong: true, noBoosters: true, hideTimer: true }),
    },
    {
        title: 'Üvegszív',
        icon: '🫧',
        desc: 'Hibánál minden elölről, de az óra nem áll meg.',
        effect: '6 feladat, 140 mp. Minden hiba után elölről kezded.',
        rules: base(6, 140, 3, { resetOnWrong: true }),
    },
    {
        title: 'Karcmentes',
        icon: '🔷',
        desc: 'Nyolc feladat egyetlen karcolás nélkül.',
        effect: '8 feladat, 130 mp, booster nélkül. Egy hiba is bukás.',
        rules: base(8, 130, 1, { failOnWrong: true, noBoosters: true }),
    },
    {
        title: 'Kristály',
        icon: '👑',
        desc: 'A hibátlanság ágának csúcsa.',
        effect: '10 feladat, 150 mp, booster nélkül, rejtett óra és számláló. Egy hiba is bukás.',
        rules: base(10, 150, 1, {
            failOnWrong: true,
            noBoosters: true,
            hideTimer: true,
            hideTaskIndex: true,
        }),
    },
];

const VANDOR: LevelSpec[] = [
    {
        title: 'Első mérföld',
        icon: '🥾',
        desc: 'Hosszabb kör, bőven idővel.',
        effect: '5 feladat, 150 mp, 3 élet.',
        rules: base(5, 150, 3),
    },
    {
        title: 'Ösvény',
        icon: '🛤️',
        desc: 'Nyolc feladat egy szuszra.',
        effect: '8 feladat, 220 mp, 3 élet.',
        rules: base(8, 220, 3),
    },
    {
        title: 'Hegymenet',
        icon: '⛰️',
        desc: 'Könnyűvel kezd, nehézzel végez.',
        effect: '10 feladat, 260 mp. A feladatok szintről szintre nehezednek.',
        rules: base(10, 260, 3, { order: 'ramp' }),
    },
    {
        title: 'Fennsík',
        icon: '🏔️',
        desc: 'Hosszú, egyenletes szakasz.',
        effect: '12 feladat, 300 mp, 3 élet.',
        rules: base(12, 300, 3),
    },
    {
        title: 'Szélcsend',
        icon: '🍃',
        desc: 'Semmi segítség, csak a kitartás.',
        effect: '12 feladat, 300 mp, booster nélkül.',
        rules: base(12, 300, 3, { noBoosters: true }),
    },
    {
        title: 'Gerinctúra',
        icon: '🧗',
        desc: 'Tizenöt feladat, két élet.',
        effect: '15 feladat, 360 mp, 2 élet.',
        rules: base(15, 360, 2),
    },
    {
        title: 'Éjszakai menet',
        icon: '🌙',
        desc: 'Nem látod, mennyi van hátra.',
        effect: '15 feladat, 360 mp, rejtett óra és rejtett számláló.',
        rules: base(15, 360, 2, { hideTimer: true, hideTaskIndex: true }),
    },
    {
        title: 'Hágó',
        icon: '🏕️',
        desc: 'Tizennyolc feladat segítség nélkül.',
        effect: '18 feladat, 420 mp, 2 élet, booster nélkül.',
        rules: base(18, 420, 2, { noBoosters: true }),
    },
    {
        title: 'Csúcstámadás',
        icon: '🚩',
        desc: 'Húsz feladat, egyetlen élet.',
        effect: '20 feladat, 450 mp, 1 élet.',
        rules: base(20, 450, 1),
    },
    {
        title: 'Vándor',
        icon: '👑',
        desc: 'A kitartás ágának csúcsa.',
        effect: '25 feladat, 540 mp, 1 élet, booster nélkül.',
        rules: base(25, 540, 1, { noBoosters: true }),
    },
];

const ARNYEK: LevelSpec[] = [
    {
        title: 'Csendes start',
        icon: '🤫',
        desc: 'Booster nélkül indulunk.',
        effect: '2 feladat, 70 mp, booster nélkül.',
        rules: base(2, 70, 2, { noBoosters: true }),
    },
    {
        title: 'Néma óra',
        icon: '🕯️',
        desc: 'Megy az idő, de nem mutatja magát.',
        effect: '3 feladat, 80 mp, rejtett visszaszámlálóval.',
        rules: base(3, 80, 2, { hideTimer: true }),
    },
    {
        title: 'Vak számláló',
        icon: '🔢',
        desc: 'Nem tudod, hányadiknál tartasz.',
        effect: '3 feladat, 80 mp, rejtett feladatszámlálóval.',
        rules: base(3, 80, 2, { hideTaskIndex: true }),
    },
    {
        title: 'Sötétkamra',
        icon: '🌘',
        desc: 'A kép csak a végén hívódik elő.',
        effect: '4 feladat, 100 mp. A visszajelzés a kihívás végén jön.',
        rules: base(4, 100, 2, { deferFeedback: true }),
    },
    {
        title: 'Elhalkult',
        icon: '🔇',
        desc: 'Se óra, se booster, egyetlen élet.',
        effect: '5 feladat, 110 mp, rejtett óra, booster nélkül, 1 élet.',
        rules: base(5, 110, 1, { hideTimer: true, noBoosters: true }),
    },
    {
        title: 'Árnyjáték',
        icon: '🎭',
        desc: 'Minden kijelző elsötétül.',
        effect: '5 feladat, 110 mp, rejtett óra és rejtett számláló.',
        rules: base(5, 110, 2, { hideTimer: true, hideTaskIndex: true }),
    },
    {
        title: 'Suttogás',
        icon: '🌫️',
        desc: 'Teljes sötét: nincs kijelző, nincs booster.',
        effect: '6 feladat, 130 mp, teljes sötétben.',
        rules: base(6, 130, 2, { hideTimer: true, hideTaskIndex: true, noBoosters: true }),
    },
    {
        title: 'Éjfél',
        icon: '🌃',
        desc: 'Nyolc feladat, egyetlen élet, semmi támpont.',
        effect: '8 feladat, 160 mp, teljes sötétben, 1 élet.',
        rules: base(8, 160, 1, { hideTimer: true, hideTaskIndex: true, noBoosters: true }),
    },
    {
        title: 'Némaság',
        icon: '🔕',
        desc: 'A visszajelzés is elmarad a végéig.',
        effect: '8 feladat, 160 mp, teljes sötétben, visszajelzés csak a végén.',
        rules: base(8, 160, 1, {
            hideTimer: true,
            hideTaskIndex: true,
            noBoosters: true,
            deferFeedback: true,
        }),
    },
    {
        title: 'Árnyék',
        icon: '👑',
        desc: 'A vak ág csúcsa.',
        effect: '10 feladat, 190 mp, teljes sötétben, 1 élet. Egy hiba is bukás.',
        rules: base(10, 190, 1, {
            hideTimer: true,
            hideTaskIndex: true,
            noBoosters: true,
            deferFeedback: true,
            failOnWrong: true,
        }),
    },
];

const VIHAR: LevelSpec[] = [
    {
        title: 'Szélfuvallat',
        icon: '🍃',
        desc: 'Több témakör keveredik.',
        effect: '3 feladat, 90 mp, kevert témakörökből.',
        rules: base(3, 90, 2, { spread: 'mixed' }),
    },
    {
        title: 'Forgószél',
        icon: '🌀',
        desc: 'Minden feladat más területről jön.',
        effect: '4 feladat, 110 mp, mindegyik más témakörből.',
        rules: base(4, 110, 2, { spread: 'all' }),
    },
    {
        title: 'Jégeső',
        icon: '🧊',
        desc: 'Csak a nehezebb szintekről.',
        effect: '5 feladat, 140 mp, csak 4–6. nehézségi szintről.',
        rules: base(5, 140, 2, { minStage: 4 }),
    },
    {
        title: 'Villámcsapás',
        icon: '⚡',
        desc: 'Sosem tudod, mennyi időd lesz.',
        effect: '5 feladat, kérdésenként sorsolt 10–25 másodperc.',
        rules: base(5, 18, 2, { timerMode: 'perQuestion', randomSeconds: [10, 25] }),
    },
    {
        title: 'Zivatar',
        icon: '🌧️',
        desc: 'Kevert témák, egyetlen élet.',
        effect: '6 feladat, 150 mp, mindegyik más témakörből, 1 élet.',
        rules: base(6, 150, 1, { spread: 'all' }),
    },
    {
        title: 'Visszaszámlálás',
        icon: '🔻',
        desc: 'A legnehezebbel kezdesz.',
        effect: '6 feladat, 160 mp, fordított sorrendben: nehézzel indul.',
        rules: base(6, 160, 2, { order: 'reverse' }),
    },
    {
        title: 'Kettős tét',
        icon: '🎰',
        desc: 'Dupla vagy semmi.',
        effect: '6 feladat, 150 mp. Siker esetén dupla XP, bukásnál nulla.',
        rules: base(6, 150, 2, { xpStake: true }),
    },
    {
        title: 'Orkán',
        icon: '🌬️',
        desc: 'Kevert témák gyorsuló órával.',
        effect: '8 feladat, az idő 22 mp-ről 9 mp-re szűkül, kevert témákból.',
        rules: base(8, 22, 2, { timerMode: 'accelerating', secondsEnd: 9, spread: 'all' }),
    },
    {
        title: 'Jégvihar',
        icon: '❄️',
        desc: 'Csak a legnehezebb szintek.',
        effect: '10 feladat, 240 mp, csak 5–6. szintről, booster nélkül.',
        rules: base(10, 240, 2, { minStage: 5, noBoosters: true }),
    },
    {
        title: 'Vihar',
        icon: '👑',
        desc: 'A káosz ágának csúcsa.',
        effect: '12 feladat, az idő 20 mp-ről 8 mp-re szűkül, kevert témákból, 1 élet.',
        rules: base(12, 20, 1, { timerMode: 'accelerating', secondsEnd: 8, spread: 'all' }),
    },
];

const BRANCH_SPECS: Array<{ branch: Exclude<SkillBranch, 'csucs'>; specs: LevelSpec[] }> = [
    { branch: 'kronosz', specs: KRONOSZ },
    { branch: 'kristaly', specs: KRISTALY },
    { branch: 'vandor', specs: VANDOR },
    { branch: 'arnyek', specs: ARNYEK },
    { branch: 'vihar', specs: VIHAR },
];

const MILESTONE_BADGES: Record<
    Exclude<SkillBranch, 'csucs'>,
    { half: ChallengeBadgeId; master: ChallengeBadgeId }
> = {
    kronosz: { half: 'kronoszFel', master: 'kronoszMester' },
    kristaly: { half: 'kristalyFel', master: 'kristalyMester' },
    vandor: { half: 'vandorFel', master: 'vandorMester' },
    arnyek: { half: 'arnyekFel', master: 'arnyekMester' },
    vihar: { half: 'viharFel', master: 'viharMester' },
};

function buildNodes(): SkillNode[] {
    const nodes: SkillNode[] = [];
    for (const { branch, specs } of BRANCH_SPECS) {
        specs.forEach((spec, i) => {
            const level = i + 1;
            const id = `${branch}${level}` as SkillNodeId;
            const prev = level > 1 ? ([`${branch}${level - 1}`] as SkillNodeId[]) : [];
            const badgeId =
                level === 5
                    ? MILESTONE_BADGES[branch].half
                    : level === 10
                      ? MILESTONE_BADGES[branch].master
                      : undefined;
            nodes.push({
                id,
                title: spec.title,
                desc: spec.desc,
                effect: spec.effect,
                icon: spec.icon,
                minXp: BRANCH_ENTRY_XP[branch] + XP_LADDER[i],
                requires: prev,
                branch,
                level,
                badgeId,
                rules: spec.rules,
            });
        });
    }
    nodes.push({
        id: 'mihasznaMester',
        title: 'Mihaszna-mester',
        desc: 'A fa teteje. Mind az öt ág végigjátszva kell hozzá.',
        effect: '15 feladat, kérdésenként 8 mp, 1 élet, teljes sötétben, csak 5–6. szintről.',
        icon: '👑',
        minXp: 4000,
        requires: ['kronosz10', 'kristaly10', 'vandor10', 'arnyek10', 'vihar10'],
        branch: 'csucs',
        level: 11,
        badgeId: 'mihasznaMester',
        rules: base(15, 8, 1, {
            timerMode: 'perQuestion',
            noBoosters: true,
            hideTimer: true,
            hideTaskIndex: true,
            minStage: 5,
            spread: 'all',
        }),
    });
    return nodes;
}

export const SKILL_NODES: SkillNode[] = buildNodes();

export const BRANCH_ORDER: Array<Exclude<SkillBranch, 'csucs'>> = [
    'kronosz',
    'kristaly',
    'vandor',
    'arnyek',
    'vihar',
];

export const SKILL_LEVELS_PER_BRANCH = 10;

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

export function branchNodes(branch: SkillBranch): SkillNode[] {
    return SKILL_NODES.filter((n) => n.branch === branch).sort((a, b) => a.level - b.level);
}

export type ChallengeGate =
    | { ok: true }
    | { ok: false; reason: 'xp'; xpLeft: number }
    | { ok: false; reason: 'prereq'; missing: SkillNode[] }
    | { ok: false; reason: 'unknown' };

/** Indítható-e: megvan az XP-küszöb és az előfeltételek teljesítve vannak. */
export function canStartChallenge(id: string, completed: string[], xp: number): ChallengeGate {
    const node = skillNodeById(id);
    if (!node) return { ok: false, reason: 'unknown' };
    const missing = node.requires
        .filter((req) => !completed.includes(req))
        .map((req) => skillNodeById(req))
        .filter((n): n is SkillNode => Boolean(n));
    if (missing.length > 0) return { ok: false, reason: 'prereq', missing };
    if (xp < node.minXp) return { ok: false, reason: 'xp', xpLeft: node.minXp - xp };
    return { ok: true };
}

/** Még nem teljesített, de már indítható kihívások XP-sorrendben. */
export function startableChallenges(completed: string[], xp: number): SkillNode[] {
    return SKILL_NODES
        .filter((n) => !completed.includes(n.id) && canStartChallenge(n.id, completed, xp).ok)
        .sort((a, b) => a.minXp - b.minXp || a.level - b.level);
}

/** Azok a kihívások, amelyek ehhez az XP-emelkedéshez nyíltak ki. */
export function newlyStartableChallenges(
    completed: string[],
    prevXp: number,
    nextXp: number
): SkillNode[] {
    if (nextXp <= prevXp) return [];
    const before = new Set(startableChallenges(completed, prevXp).map((n) => n.id));
    return startableChallenges(completed, nextXp).filter((n) => !before.has(n.id));
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

/** Kérdésenkénti idő gyorsuló vagy sorsolt óránál. */
export function challengeSecondsForIndex(rules: ChallengeRules, index: number): number {
    if (rules.randomSeconds) {
        const [min, max] = rules.randomSeconds;
        const lo = Math.min(min, max);
        const hi = Math.max(min, max);
        return lo + Math.floor(Math.random() * (hi - lo + 1));
    }
    if (rules.timerMode === 'accelerating') {
        const start = rules.seconds;
        const finish = rules.secondsEnd ?? rules.seconds;
        const steps = Math.max(1, rules.questionCount - 1);
        const at = Math.min(Math.max(0, index), steps);
        return Math.max(3, Math.round(start + ((finish - start) * at) / steps));
    }
    return rules.seconds;
}

/** Kérdésenként újrainduló óra? */
export function isPerQuestionTimer(rules: ChallengeRules): boolean {
    return rules.timerMode === 'perQuestion' || rules.timerMode === 'accelerating';
}
