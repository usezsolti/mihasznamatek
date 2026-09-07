import type { GraphFigure } from './graphFigure';

/** Statikus kép: tedd a fájlt public/figures/ alá, pl. /figures/sikgeometria/haromszog.png */
export type ImageFigure = {
    kind: 'image';
    src: string;
    alt?: string;
    caption?: string;
};

export type GraphKindFigure = {
    kind: 'graph';
    graph: GraphFigure;
    caption?: string;
};

/** Általános SVG-rajz: későbbi geometria, koordináta, Venn, stb. */
export type DrawPrimitive =
    | { t: 'line'; x1: number; y1: number; x2: number; y2: number; className?: string }
    | { t: 'circle'; cx: number; cy: number; r: number; className?: string }
    | { t: 'rect'; x: number; y: number; w: number; h: number; className?: string }
    | { t: 'poly'; points: Array<[number, number]>; className?: string }
    | { t: 'path'; d: string; className?: string }
    | { t: 'text'; x: number; y: number; text: string; className?: string }
    | { t: 'axes'; xmin: number; xmax: number; ymin: number; ymax: number };

export type DrawFigure = {
    kind: 'draw';
    viewBox?: string;
    width?: number;
    height?: number;
    primitives: DrawPrimitive[];
    caption?: string;
};

export type QuestionFigure = ImageFigure | GraphKindFigure | DrawFigure;

export type FigureSource = {
    figure?: QuestionFigure;
    figures?: QuestionFigure[];
    graph?: GraphFigure;
    imageSrc?: string;
};

export function figuresOf(q: FigureSource | null | undefined): QuestionFigure[] {
    if (!q) return [];
    const out: QuestionFigure[] = [];
    if (q.figure) out.push(q.figure);
    if (q.figures?.length) out.push(...q.figures);
    if (q.graph) out.push({ kind: 'graph', graph: q.graph, caption: q.graph.caption });
    if (q.imageSrc) out.push({ kind: 'image', src: q.imageSrc });
    return out;
}

export function imageFigure(src: string, caption?: string): ImageFigure {
    return { kind: 'image', src, caption };
}

export function graphFigure(graph: GraphFigure, caption?: string): GraphKindFigure {
    return { kind: 'graph', graph, caption: caption ?? graph.caption };
}

export function drawFigure(primitives: DrawPrimitive[], caption?: string): DrawFigure {
    return { kind: 'draw', primitives, caption };
}

export type CoordPoint = { x: number; y: number; label?: string };

/** Koordináta-rács + tengelyek + feliratozott pontok (felvételi / munkalap ábrák). */
export function coordPlaneFigure(opts: {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    points: CoordPoint[];
    width?: number;
    height?: number;
    xLabel?: string;
    yLabel?: string;
    caption?: string;
}): DrawFigure {
    const w = opts.width ?? 480;
    const h = opts.height ?? 400;
    const mx = 40;
    const my = 34;
    const xmin = opts.xmin;
    const xmax = opts.xmax;
    const ymin = opts.ymin;
    const ymax = opts.ymax;
    const sx = (w - 2 * mx) / (xmax - xmin || 1);
    const sy = (h - 2 * my) / (ymax - ymin || 1);
    const X = (x: number) => mx + (x - xmin) * sx;
    const Y = (y: number) => h - my - (y - ymin) * sy;

    const primitives: DrawPrimitive[] = [];
    for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) {
        primitives.push({ t: 'line', x1: X(x), y1: Y(ymin), x2: X(x), y2: Y(ymax), className: 'game-draw-grid' });
    }
    for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) {
        primitives.push({ t: 'line', x1: X(xmin), y1: Y(y), x2: X(xmax), y2: Y(y), className: 'game-draw-grid' });
    }
    primitives.push({ t: 'line', x1: X(xmin), y1: Y(0), x2: X(xmax), y2: Y(0), className: 'game-draw-axis' });
    primitives.push({ t: 'line', x1: X(0), y1: Y(ymin), x2: X(0), y2: Y(ymax), className: 'game-draw-axis' });

    for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) {
        if (x === 0) continue;
        primitives.push({ t: 'text', x: X(x), y: Y(0) + 14, text: String(x), className: 'game-draw-tick' });
    }
    for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) {
        if (y === 0) continue;
        primitives.push({ t: 'text', x: X(0) - 12, y: Y(y) + 4, text: String(y), className: 'game-draw-tick' });
    }
    primitives.push({ t: 'text', x: X(0) - 10, y: Y(0) + 14, text: '0', className: 'game-draw-tick' });
    if (opts.xLabel) {
        primitives.push({ t: 'text', x: X(xmax) - 8, y: Y(0) - 8, text: opts.xLabel, className: 'game-draw-text' });
    }
    if (opts.yLabel) {
        primitives.push({ t: 'text', x: X(0) + 8, y: Y(ymax) + 4, text: opts.yLabel, className: 'game-draw-text' });
    }

    for (const p of opts.points) {
        primitives.push({ t: 'circle', cx: X(p.x), cy: Y(p.y), r: 5, className: 'game-draw-point' });
        if (p.label) {
            primitives.push({
                t: 'text',
                x: X(p.x) + 8,
                y: Y(p.y) - 8,
                text: p.label,
                className: 'game-draw-text',
            });
        }
    }

    return {
        kind: 'draw',
        width: w,
        height: h,
        primitives,
        caption: opts.caption,
    };
}
