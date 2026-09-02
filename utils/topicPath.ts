/** Duolingo-s témakör út: 6 lecke = 6 nehézségi szint (szintenként 20 feladat) + 3 kincs */

import { agentDebugLog } from './agentDebugLog';

export type PathStage = 1 | 2 | 3 | 4 | 5 | 6;

export const PATH_LESSON_COUNT = 6;
export const PATH_QUESTIONS_PER_LESSON = 20;
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

/** 1 lecke = 1 szint (1…6) */
export function lessonToStage(lesson: number): PathStage {
    const n = Math.min(6, Math.max(1, Math.floor(lesson)));
    return n as PathStage;
}

export const PATH_STAGE_LABELS: Record<PathStage, string> = {
    1: '1. szint',
    2: '2. szint',
    3: '3. szint',
    4: '4. szint',
    5: '5. szint',
    6: '6. szint',
};

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
        nodes.push({
            kind: 'lesson',
            lesson,
            stage,
            label: `Lecke ${lesson} · ${PATH_STAGE_LABELS[stage]}`,
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

export type DoubleHelixPaths = {
    strandA: string;
    strandB: string;
    /** Szalag / „cső” a szálak körül */
    tubeA: string;
    tubeB: string;
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

function tubeAround(
    center: Array<{ x: number; y: number }>,
    halfWidth: number
): string {
    if (center.length < 2) return '';
    const left: Array<{ x: number; y: number }> = [];
    const right: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < center.length; i++) {
        const p = center[i];
        const prev = center[Math.max(0, i - 1)];
        const next = center[Math.min(center.length - 1, i + 1)];
        let tx = next.x - prev.x;
        let ty = next.y - prev.y;
        const len = Math.hypot(tx, ty) || 1;
        tx /= len;
        ty /= len;
        const nx = -ty;
        const ny = tx;
        left.push({ x: p.x + nx * halfWidth, y: p.y + ny * halfWidth });
        right.push({ x: p.x - nx * halfWidth, y: p.y - ny * halfWidth });
    }
    return polyPath([...left, ...right.reverse()], true);
}

/** Kettős hélix: két összefonódó szál. */
export function buildDoubleHelix(
    count: number,
    opts?: { turns?: number; amplitude?: number; y0?: number; y1?: number }
): {
    points: WindingPoint[];
    helix: DoubleHelixPaths;
    svgPath: string;
} {
    const turns = opts?.turns ?? 1.55;
    const amplitude = opts?.amplitude ?? 16;
    const y0 = opts?.y0 ?? 7;
    const y1 = opts?.y1 ?? 93;
    const n = Math.max(1, count);

    const strandAPts: Array<{ x: number; y: number }> = [];
    const strandBPts: Array<{ x: number; y: number }> = [];
    const samples = Math.max(48, n * 14);

    for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const y = y0 + (y1 - y0) * t;
        const phase = t * turns * Math.PI * 2;
        strandAPts.push({ x: 50 + amplitude * Math.sin(phase), y });
        strandBPts.push({ x: 50 + amplitude * Math.sin(phase + Math.PI), y });
    }

    // Node-ok a hélixre: váltakozva A/B szálon
    const points: WindingPoint[] = [];
    for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0 : i / (n - 1);
        const y = y0 + (y1 - y0) * t;
        const phase = t * turns * Math.PI * 2;
        const onA = i % 2 === 0;
        const x = 50 + amplitude * Math.sin(phase + (onA ? 0 : Math.PI));
        points.push({
            x,
            y,
            side: x < 50 ? 'left' : 'right',
        });
    }

    const helix: DoubleHelixPaths = {
        strandA: polyPath(strandAPts),
        strandB: polyPath(strandBPts),
        tubeA: tubeAround(densifyPoints(strandAPts, 1), 2.4),
        tubeB: tubeAround(densifyPoints(strandBPts, 1), 2.4),
    };

    // Középvonal (referencia)
    const mid = densifyPoints(
        Array.from({ length: 12 }, (_, i) => {
            const t = i / 11;
            return { x: 50, y: y0 + (y1 - y0) * t };
        }),
        4
    );

    return {
        points,
        helix,
        svgPath: polyPath(mid),
    };
}

/** @deprecated — a Möbius helyett double helixet használunk; kompatibilitás miatt megmarad. */
export type MobiusRibbon = {
    front: string;
    back: string;
    center: string;
    edge: string;
};

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
    helix: DoubleHelixPaths;
} {
    const built = buildDoubleHelix(count);
    return {
        points: built.points,
        svgPath: built.svgPath,
        helix: built.helix,
    };
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
 * Stagelő listából 120 kérdés bank lecke-sorrendben (L1…L6 × 20).
 * 1 lecke = 1 szint. Ha egy szintben kevés a feladat, ciklusosan ismétel.
 */
export function buildPathQuestionBank<T extends { id?: string; stage: PathStage; question?: string }>(
    staged: T[]
): (T & { pathLesson: number })[] {
    const byStage: Record<PathStage, T[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    staged.forEach((q) => {
        const s = q.stage;
        if (s >= 1 && s <= 6) byStage[s as PathStage].push(q);
    });

    const fallback = staged.length ? staged : [];
    ([1, 2, 3, 4, 5, 6] as PathStage[]).forEach((s) => {
        if (byStage[s].length === 0 && fallback.length) {
            byStage[s] = fallback.map((q) => ({ ...q, stage: s }));
        }
    });

    const out: (T & { pathLesson: number })[] = [];
    for (let lesson = 1; lesson <= PATH_LESSON_COUNT; lesson++) {
        const stage = lessonToStage(lesson);
        const pool = byStage[stage].length ? byStage[stage] : fallback;
        if (!pool.length) continue;
        for (let i = 0; i < PATH_QUESTIONS_PER_LESSON; i++) {
            const src = pool[i % pool.length];
            out.push({
                ...src,
                stage,
                pathLesson: lesson,
                id: `path_${lesson}_${i + 1}_${src.id || i}`,
            });
        }
    }
    // #region agent log
    agentDebugLog({
        hypothesisId: 'A',
        location: 'topicPath.ts:buildPathQuestionBank',
        message: 'path bank built',
        data: {
            perLesson: PATH_QUESTIONS_PER_LESSON,
            bankLen: out.length,
            byStageLens: {
                1: byStage[1].length,
                2: byStage[2].length,
                3: byStage[3].length,
                4: byStage[4].length,
                5: byStage[5].length,
                6: byStage[6].length,
            },
        },
        runId: 'path-20q',
    });
    // #endregion
    return out;
}

export function getLessonQuestions<T extends { pathLesson?: number }>(
    bank: T[],
    lesson: number
): T[] {
    const fromFlag = bank.filter((q) => q.pathLesson === lesson);
    const picked = fromFlag.length
        ? fromFlag.slice(0, PATH_QUESTIONS_PER_LESSON)
        : bank.slice(
              (lesson - 1) * PATH_QUESTIONS_PER_LESSON,
              lesson * PATH_QUESTIONS_PER_LESSON
          );
    // #region agent log
    agentDebugLog({
        hypothesisId: 'A',
        location: 'topicPath.ts:getLessonQuestions',
        message: 'lesson questions picked',
        data: {
            lesson,
            count: picked.length,
            expected: PATH_QUESTIONS_PER_LESSON,
            bankLen: bank.length,
        },
        runId: 'path-20q',
    });
    // #endregion
    return picked;
}

export function isWorksheetTopicId(topicId: string): boolean {
    const t = topicId.toLowerCase();
    return (
        t.startsWith('a1-') ||
        t.startsWith('a2-') ||
        /^la[1-4]-/.test(t) ||
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
        t.includes('fuggvenyek-analizis') ||
        t.includes('halmaz') ||
        t.includes('kombinatorika') ||
        t.includes('koordinatageometria') ||
        t.includes('koordinata') ||
        t.includes('logika') ||
        t.includes('grafok') ||
        t.includes('sorozat') ||
        t.includes('statisztika') ||
        t.includes('szamelmelet') ||
        t.includes('szoveges') ||
        t.includes('tergeometria') ||
        t.includes('trigonometria') ||
        t.includes('valoszinuseg') ||
        t.includes('egyszerusites') ||
        t.includes('ertelmezesi') ||
        t.includes('sikgeometria')
    );
}
