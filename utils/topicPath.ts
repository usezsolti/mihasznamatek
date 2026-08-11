/** Duolingo-s témakör út: 6 lecke + 3 kincs, növekvő nehézség */

export type PathStage = 1 | 2 | 3;

export const PATH_LESSON_COUNT = 6;
export const PATH_QUESTIONS_PER_LESSON = 3;
export const PATH_TOTAL_QUESTIONS = PATH_LESSON_COUNT * PATH_QUESTIONS_PER_LESSON;
export const PATH_LESSON_XP = 30;
export const PATH_CHEST_XP: Record<1 | 2 | 3, number> = {
    1: 40,
    2: 60,
    3: 100,
};

export type PathNodeKind = 'lesson' | 'chest';

export interface PathLessonNode {
    kind: 'lesson';
    lesson: number;
    stage: PathStage;
    label: string;
}

export interface PathChestNode {
    kind: 'chest';
    chest: 1 | 2 | 3;
    afterLesson: number;
    label: string;
    xp: number;
}

export type PathNode = PathLessonNode | PathChestNode;

/** Emelt suffix levágása — progress kulcs */
export function normalizeTopicId(topicId: string): string {
    return topicId.toLowerCase().replace(/-emelt$/, '');
}

export function lessonToStage(lesson: number): PathStage {
    if (lesson <= 2) return 1;
    if (lesson <= 4) return 2;
    return 3;
}

/** Kincs feloldható, ha az adott páros lecke (2/4/6) kész */
export function isChestUnlockable(chest: 1 | 2 | 3, lessonsCompleted: number[]): boolean {
    const gate = chest * 2;
    return lessonsCompleted.includes(gate);
}

export function chestAfterLesson(lesson: number): 1 | 2 | 3 | null {
    if (lesson === 2) return 1;
    if (lesson === 4) return 2;
    if (lesson === 6) return 3;
    return null;
}

export function buildPathNodes(): PathNode[] {
    const nodes: PathNode[] = [];
    for (let lesson = 1; lesson <= PATH_LESSON_COUNT; lesson++) {
        const stage = lessonToStage(lesson);
        const stageLabel = stage === 1 ? 'Alap' : stage === 2 ? 'Közép' : 'Mester';
        nodes.push({
            kind: 'lesson',
            lesson,
            stage,
            label: `Lecke ${lesson} · ${stageLabel}`,
        });
        const chest = chestAfterLesson(lesson);
        if (chest) {
            nodes.push({
                kind: 'chest',
                chest,
                afterLesson: lesson,
                label: chest === 1 ? 'Kincs A' : chest === 2 ? 'Kincs B' : 'Kincs C',
                xp: PATH_CHEST_XP[chest],
            });
        }
    }
    return nodes;
}

/** Duolingo-szerű kanyargós layout: x/y százalék + SVG path (viewBox 0 0 100 100). */
export type WindingPoint = { x: number; y: number; side: 'left' | 'right' };

export type MobiusRibbon = {
    /** Világosabb „előlap” sáv */
    front: string;
    /** Sötétebb „hátlap” sáv (csavar után) */
    back: string;
    /** Középvonal a szaggatott mintához */
    center: string;
    /** Élvonal a 3D hatáshoz */
    edge: string;
};

function densifyPoints(
    points: Array<{ x: number; y: number }>,
    samplesPerSeg = 10
): Array<{ x: number; y: number }> {
    if (points.length < 2) return points.slice();
    const out: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        for (let s = 0; s < samplesPerSeg; s++) {
            const t = s / samplesPerSeg;
            // enyhe S-görbe interpoláció
            const mt = t * t * (3 - 2 * t);
            out.push({
                x: a.x + (b.x - a.x) * mt,
                y: a.y + (b.y - a.y) * mt,
            });
        }
    }
    out.push(points[points.length - 1]);
    return out;
}

function polyPath(pts: Array<{ x: number; y: number }>, close = false): string {
    if (!pts.length) return '';
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
        d += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
    }
    if (close) d += ' Z';
    return d;
}

/** Möbius-szalag: félfordulatos csavar a sávban (előlap/hátlap). */
export function buildMobiusRibbon(
    points: Array<{ x: number; y: number }>,
    halfWidth = 3.4
): MobiusRibbon {
    const dense = densifyPoints(points, 12);
    const left: Array<{ x: number; y: number }> = [];
    const right: Array<{ x: number; y: number }> = [];
    const center = dense;

    for (let i = 0; i < dense.length; i++) {
        const p = dense[i];
        const prev = dense[Math.max(0, i - 1)];
        const next = dense[Math.min(dense.length - 1, i + 1)];
        let tx = next.x - prev.x;
        let ty = next.y - prev.y;
        const len = Math.hypot(tx, ty) || 1;
        tx /= len;
        ty /= len;
        // normál
        let nx = -ty;
        let ny = tx;

        // Fél fordulat (0 → π): a szélesség előjele megfordul → Möbius hatás
        const theta = (i / Math.max(1, dense.length - 1)) * Math.PI;
        const w = halfWidth * Math.cos(theta);
        // a csavar közepén ne tűnjön el teljesen
        const ww = Math.abs(w) < 0.55 ? (w >= 0 ? 0.55 : -0.55) : w;

        left.push({ x: p.x + nx * ww, y: p.y + ny * ww });
        right.push({ x: p.x - nx * ww, y: p.y - ny * ww });
    }

    const mid = Math.floor(dense.length / 2);
    // Előlap: 0..mid, hátlap: mid..end (másik szín)
    const frontPoly = [
        ...left.slice(0, mid + 1),
        ...right.slice(0, mid + 1).reverse(),
    ];
    const backPoly = [
        ...left.slice(mid),
        ...right.slice(mid).reverse(),
    ];

    // Él: bal oldal végig + jobb vissza
    const edgePoly = [...left, ...right.slice().reverse()];

    return {
        front: polyPath(frontPoly, true),
        back: polyPath(backPoly, true),
        center: polyPath(center, false),
        edge: polyPath(edgePoly, true),
    };
}

/** Lecke ikon: matematikai alakzat (csillag helyett). */
export function lessonMathSymbol(lesson: number): string {
    switch (lesson) {
        case 1:
            return '△';
        case 2:
            return '□';
        case 3:
            return '○';
        case 4:
            return '◇';
        case 5:
            return '⬡';
        case 6:
            return 'Σ';
        default:
            return 'π';
    }
}

export function buildWindingLayout(count: number): {
    points: WindingPoint[];
    svgPath: string;
    mobius: MobiusRibbon;
} {
    // Erősebb zigzag — a node-ok jól láthatóan bal/jobb oldalon
    const patternX = [50, 26, 30, 74, 70, 26, 30, 74, 70];
    const points: WindingPoint[] = [];
    const n = Math.max(1, count);
    for (let i = 0; i < n; i++) {
        const x = patternX[i % patternX.length];
        const y = 7 + (i / Math.max(1, n - 1)) * 86;
        points.push({
            x,
            y,
            side: x < 50 ? 'left' : 'right',
        });
    }

    let svgPath = '';
    if (points.length === 1) {
        svgPath = `M ${points[0].x} ${points[0].y}`;
    } else {
        svgPath = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const midY = (prev.y + curr.y) / 2;
            svgPath += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
        }
    }

    const mobius = buildMobiusRibbon(points, 3.6);

    return { points, svgPath, mobius };
}

export function computeHighestUnlocked(lessonsCompleted: number[]): number {
    const sorted = [...lessonsCompleted].sort((a, b) => a - b);
    let contiguous = 0;
    for (let i = 1; i <= PATH_LESSON_COUNT; i++) {
        if (sorted.includes(i)) contiguous = i;
        else break;
    }
    return Math.min(PATH_LESSON_COUNT, Math.max(1, contiguous + 1));
}

export function isLessonUnlocked(
    lesson: number,
    highestUnlocked: number,
    lessonsCompleted: number[]
): boolean {
    if (lesson <= 1) return true;
    if (lessonsCompleted.includes(lesson)) return true;
    return lesson <= highestUnlocked;
}

export function starsFromWrongCount(wrongCount: number): 1 | 2 | 3 {
    if (wrongCount <= 0) return 3;
    if (wrongCount === 1) return 2;
    return 1;
}

/**
 * Stagelő listából 18 kérdés bank lecke-sorrendben (L1…L6 × 3).
 * Ha egy szakaszban kevés a feladat, ciklusosan ismétel (új id-vel).
 */
export function buildPathQuestionBank<T extends { id?: string; stage: PathStage; question?: string }>(
    staged: T[]
): (T & { pathLesson: number })[] {
    const byStage: Record<PathStage, T[]> = { 1: [], 2: [], 3: [] };
    staged.forEach((q) => byStage[q.stage].push(q));

    const fallback = staged.length ? staged : [];
    ([1, 2, 3] as PathStage[]).forEach((s) => {
        if (byStage[s].length === 0 && fallback.length) {
            byStage[s] = fallback.map((q) => ({ ...q, stage: s }));
        }
    });

    const out: (T & { pathLesson: number })[] = [];
    for (let lesson = 1; lesson <= PATH_LESSON_COUNT; lesson++) {
        const stage = lessonToStage(lesson);
        const pool = byStage[stage].length ? byStage[stage] : fallback;
        if (!pool.length) continue;
        const half = lesson % 2 === 1 ? 0 : PATH_QUESTIONS_PER_LESSON;
        for (let i = 0; i < PATH_QUESTIONS_PER_LESSON; i++) {
            const src = pool[(half + i) % pool.length];
            out.push({
                ...src,
                stage,
                pathLesson: lesson,
                id: `path_${lesson}_${i + 1}_${src.id || i}`,
            });
        }
    }
    return out;
}

export function getLessonQuestions<T extends { pathLesson?: number }>(
    bank: T[],
    lesson: number
): T[] {
    const fromFlag = bank.filter((q) => q.pathLesson === lesson);
    if (fromFlag.length) return fromFlag.slice(0, PATH_QUESTIONS_PER_LESSON);
    const start = (lesson - 1) * PATH_QUESTIONS_PER_LESSON;
    return bank.slice(start, start + PATH_QUESTIONS_PER_LESSON);
}

export function isWorksheetTopicId(topicId: string): boolean {
    const t = topicId.toLowerCase();
    return (
        t.includes('parameter') ||
        t.includes('paramet') ||
        t.includes('exponencialis') ||
        t.includes('logaritmus') ||
        t.includes('abszolutertek') ||
        (t.includes('gyok') && !t.includes('bizony')) ||
        t.includes('bizonyitas') ||
        t.includes('egyenletek') ||
        t.includes('egyenlotlenseg') ||
        t.includes('fuggveny') ||
        t.includes('analizis')
    );
}
