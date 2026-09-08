import { layoutGraph } from '../../utils/game/graphFigure';
import {
    figuresOf,
    type DrawFigure,
    type DrawPrimitive,
    type GraphKindFigure,
    type ImageFigure,
    type QuestionFigure,
} from '../../utils/game/questionFigure';
import type { Question } from '../../utils/game/types';
import { agentDebugLog } from '../../utils/agentDebugLog';

type Props = {
    question?: Question | null;
};

const DRAW_W = 320;
const DRAW_H = 220;

function captionOf(fig: QuestionFigure): string | undefined {
    if (fig.kind === 'graph') return fig.caption || fig.graph.caption;
    return fig.caption;
}

function GraphSvg({ fig }: { fig: GraphKindFigure }) {
    const graph = fig.graph;
    const width = 320;
    const height = 220;
    const points = layoutGraph(graph, width, height);
    const highlight = new Set(graph.highlightVertices || []);
    return (
        <svg
            className="game-figure-svg"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={captionOf(fig) || 'Gráf ábra'}
        >
            {graph.edges.map(([a, b], i) => {
                const pa = points[a];
                const pb = points[b];
                if (!pa || !pb) return null;
                return (
                    <line
                        key={`e-${i}`}
                        x1={pa.x}
                        y1={pa.y}
                        x2={pb.x}
                        y2={pb.y}
                        className="game-graph-edge"
                    />
                );
            })}
            {graph.vertices.map((v) => {
                const p = points[v];
                if (!p) return null;
                const on = highlight.has(v);
                return (
                    <g key={v}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r={14}
                            className={on ? 'game-graph-node is-hot' : 'game-graph-node'}
                        />
                        <text x={p.x} y={p.y} className="game-graph-label">
                            {v}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function axesPrimitives(p: Extract<DrawPrimitive, { t: 'axes' }>, w: number, h: number): DrawPrimitive[] {
    const mx = 28;
    const my = 24;
    const x0 = mx + ((0 - p.xmin) / (p.xmax - p.xmin || 1)) * (w - 2 * mx);
    const y0 = h - my - ((0 - p.ymin) / (p.ymax - p.ymin || 1)) * (h - 2 * my);
    return [
        { t: 'line', x1: mx, y1: y0, x2: w - mx, y2: y0, className: 'game-draw-axis' },
        { t: 'line', x1: x0, y1: my, x2: x0, y2: h - my, className: 'game-draw-axis' },
    ];
}

function DrawSvg({ fig }: { fig: DrawFigure }) {
    const w = fig.width || DRAW_W;
    const h = fig.height || DRAW_H;
    const primitives = fig.primitives.flatMap((p) =>
        p.t === 'axes' ? axesPrimitives(p, w, h) : [p]
    );
    return (
        <svg
            className="game-figure-svg"
            viewBox={fig.viewBox || `0 0 ${w} ${h}`}
            role="img"
            aria-label={fig.caption || 'Ábra'}
        >
            {primitives.map((p, i) => {
                const key = `d-${i}`;
                if (p.t === 'line') {
                    return (
                        <line
                            key={key}
                            x1={p.x1}
                            y1={p.y1}
                            x2={p.x2}
                            y2={p.y2}
                            className={p.className || 'game-draw-stroke'}
                        />
                    );
                }
                if (p.t === 'circle') {
                    return (
                        <circle
                            key={key}
                            cx={p.cx}
                            cy={p.cy}
                            r={p.r}
                            className={p.className || 'game-draw-shape'}
                        />
                    );
                }
                if (p.t === 'rect') {
                    return (
                        <rect
                            key={key}
                            x={p.x}
                            y={p.y}
                            width={p.w}
                            height={p.h}
                            className={p.className || 'game-draw-shape'}
                        />
                    );
                }
                if (p.t === 'poly') {
                    return (
                        <polygon
                            key={key}
                            points={p.points.map(([x, y]) => `${x},${y}`).join(' ')}
                            className={p.className || 'game-draw-shape'}
                        />
                    );
                }
                if (p.t === 'path') {
                    return <path key={key} d={p.d} className={p.className || 'game-draw-stroke'} />;
                }
                if (p.t === 'text') {
                    if (p.text && p.text.length > 4 && p.anchor === 'middle') {
                        // #region agent log
                        agentDebugLog({
                            hypothesisId: 'H1',
                            location: 'GameQuestionFigure.tsx:DrawSvg',
                            message: 'axis title rendered',
                            data: {
                                text: p.text,
                                x: p.x,
                                y: p.y,
                                anchor: p.anchor,
                                viewW: w,
                                viewH: h,
                                fitsX: p.x > 40 && p.x < w - 40,
                                fitsY: p.y > 10 && p.y < h - 4,
                            },
                            runId: 'kf-xlabel',
                        });
                        // #endregion
                    }
                    return (
                        <text
                            key={key}
                            x={p.x}
                            y={p.y}
                            className={p.className || 'game-draw-text'}
                            textAnchor={p.anchor || (p.className === 'game-draw-tick' ? 'middle' : 'start')}
                        >
                            {p.text}
                        </text>
                    );
                }
                return null;
            })}
        </svg>
    );
}

function ImageBlock({ fig }: { fig: ImageFigure }) {
    return (
        <img
            className="game-question-image"
            src={fig.src}
            alt={fig.alt || fig.caption || ''}
            onLoad={() => {
                if (!fig.src.includes('kozponti/20')) return;
                // #region agent log
                agentDebugLog({
                    hypothesisId: 'H5',
                    location: 'GameQuestionFigure.tsx:ImageBlock',
                    message: 'feb figure loaded',
                    data: { src: fig.src },
                    runId: 'kf-2026-feb',
                });
                if (fig.src.includes('2021jan')) {
                    agentDebugLog({
                        hypothesisId: 'H3',
                        location: 'GameQuestionFigure.tsx:ImageBlock:2021',
                        message: '2021 jan figure loaded',
                        data: { src: fig.src, ok: true },
                        runId: 'kf-2021-jan',
                    });
                }
                // #endregion
            }}
            onError={() => {
                if (!fig.src.includes('kozponti/20')) return;
                // #region agent log
                agentDebugLog({
                    hypothesisId: 'H5',
                    location: 'GameQuestionFigure.tsx:ImageBlock',
                    message: 'feb figure failed',
                    data: { src: fig.src },
                    runId: 'kf-2026-feb',
                });
                if (fig.src.includes('2021jan')) {
                    agentDebugLog({
                        hypothesisId: 'H3',
                        location: 'GameQuestionFigure.tsx:ImageBlock:2021',
                        message: '2021 jan figure failed',
                        data: { src: fig.src, ok: false },
                        runId: 'kf-2021-jan',
                    });
                }
                // #endregion
            }}
        />
    );
}

function OneFigure({ fig }: { fig: QuestionFigure }) {
    const caption = captionOf(fig);
    return (
        <div className="game-question-figure">
            {fig.kind === 'image' ? <ImageBlock fig={fig} /> : null}
            {fig.kind === 'graph' ? <GraphSvg fig={fig} /> : null}
            {fig.kind === 'draw' ? <DrawSvg fig={fig} /> : null}
            {caption ? <div className="game-graph-caption">{caption}</div> : null}
        </div>
    );
}

export default function GameQuestionFigure({ question }: Props) {
    const list = figuresOf(question);
    if (!list.length) return null;
    return (
        <>
            {list.map((fig, i) => (
                <OneFigure key={`${fig.kind}-${i}`} fig={fig} />
            ))}
        </>
    );
}
