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
