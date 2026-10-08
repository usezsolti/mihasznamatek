import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
    clearWhiteboardStrokes,
    createWhiteboard,
    loadWhiteboardMeta,
    openPersonalBoard,
    pushStroke,
    renameWhiteboard,
    subscribeStrokes,
} from '../../utils/whiteboardSync';
import {
    WB_COLORS,
    newStrokeId,
    type WbPoint,
    type WbStroke,
    type WbTool,
} from '../../utils/whiteboardTypes';
import { correctInkStroke, lastInkCorrectionDebug, polygonLabel } from '../../utils/whiteboardInkToShape';
import { applyExportView, planWhiteboardExport, strokeInkBounds, unionStrokeBounds } from '../../utils/whiteboardExport';
import {
    duplicateStrokes,
    hitImageHandle,
    hitTestTop,
    resizeImageStroke,
    strokesInMarquee,
    translateStroke,
    type MarqueeBox,
} from '../../utils/whiteboardSelection';
import { compressWhiteboardImage, drawCachedImage, primeWhiteboardImage } from '../../utils/whiteboardImage';
import WhiteboardCalculator from './WhiteboardCalculator';
import { buildStamp, WHITEBOARD_STAMPS, type StampId } from '../../utils/whiteboardStamps';
import { textForBoard } from '../../utils/whiteboardEquals';
import { agentDebugLog } from '../../utils/agentDebugLog';

let redrawImages: (() => void) | null = null;

type MatekWhiteboardProps = {
    uid: string;
    displayName: string;
    initialBoardId?: string | null;
    onBoardId: (id: string) => void;
};

function drawStroke(ctx: CanvasRenderingContext2D, s: WbStroke) {
    if (s.tool === 'image' && s.src) {
        drawCachedImage(ctx, s.src, s.x || 0, s.y || 0, s.w || 1, s.h || 1, () => redrawImages?.());
        return;
    }

    if (s.tool === 'text' && s.text) {
        ctx.save();
        ctx.fillStyle = s.color;
        ctx.font = `${Math.max(14, s.width * 4)}px "Segoe UI", system-ui, sans-serif`;
        ctx.fillText(s.text, s.x || 0, (s.y || 0) + Math.max(14, s.width * 4));
        ctx.restore();
        return;
    }

    if (s.tool === 'rect') {
        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.strokeRect(s.x || 0, s.y || 0, s.w || 0, s.h || 0);
        ctx.restore();
        return;
    }

    if (s.tool === 'ellipse') {
        const x = s.x || 0;
        const y = s.y || 0;
        const w = s.w || 0;
        const h = s.h || 0;
        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        return;
    }

    if (s.tool === 'line' && s.points.length >= 2) {
        const a = s.points[0];
        const b = s.points[s.points.length - 1];
        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
        return;
    }

    if (s.tool === 'polygon' && s.points.length >= 3) {
        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) {
            ctx.lineTo(s.points[i].x, s.points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        return;
    }

    if (s.points.length < 1) return;
    ctx.save();
    if (s.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else if (s.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 0.35;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 1;
    }
    ctx.lineWidth = s.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(s.points[0].x, s.points[0].y);
    for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
    }
    if (s.points.length === 1) {
        ctx.lineTo(s.points[0].x + 0.01, s.points[0].y);
    }
    ctx.stroke();
    ctx.restore();
}

function Icon({ children, size = 22 }: { children: ReactNode; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
            {children}
        </svg>
    );
}

function IconUndo() {
    return (
        <Icon>
            <path
                d="M9 14L4 9l5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4 9h9a6 6 0 1 1 0 12h-3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </Icon>
    );
}

function IconClearAll() {
    return (
        <Icon>
            <path
                d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M8 7l.6 11.2A1.5 1.5 0 0 0 10.1 19.5h3.8a1.5 1.5 0 0 0 1.5-1.3L16 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    );
}

function IconHand() {
    return (
        <Icon>
            <path
                d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11M11 10.5V5.5a1.5 1.5 0 0 1 3 0V11M14 10.5V7a1.5 1.5 0 0 1 3 0v6.5c0 3-2 5.5-5.5 5.5S6 17 6 14v-1.5a1.5 1.5 0 0 1 3 0V11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    );
}

function IconCopy() {
    return (
        <Icon>
            <rect x="8" y="8" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M6 14.5V6.5A1.5 1.5 0 0 1 7.5 5H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </Icon>
    );
}

function IconSelect() {
    return (
        <Icon>
            <path d="M5 5.5h6.5M5 5.5v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12.5 5.5H19V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2.2 2" />
            <path d="M5 13v5.5h6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2.2 2" />
            <path d="M13.5 18.5H19V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10 10.5 15.5 12.2 12.8 13.6 14.6 16.8 13.2 17.6 11.4 14.4 9.6 16.2 10 10.5Z" fill="currentColor" />
        </Icon>
    );
}

function IconLibrary() {
    return (
        <Icon>
            <path d="M4 19h16M12 19V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 5l2.2 2.2M12 5 9.8 7.2M20 19l-2.2-2.2M20 19l-2.2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </Icon>
    );
}

function IconCalc() {
    return (
        <Icon>
            <rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 7.5h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8 12h.01M12 12h.01M16 12h.01M8 15.5h.01M12 15.5h.01M16 15.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </Icon>
    );
}

function IconImage() {
    return (
        <Icon>
            <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="9" cy="10" r="1.4" fill="currentColor" />
            <path d="M7 16.5 11 12.5 13.2 14.5 15 12.8 18 16" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </Icon>
    );
}

function IconPen({ tip = '#222' }: { tip?: string }) {
    return (
        <Icon>
            <path
                d="M14.8 3.8c.6-.6 1.6-.6 2.2 0l1.2 1.2c.6.6.6 1.6 0 2.2L10 15.4 6.2 16l.6-3.8L14.8 3.8Z"
                fill={tip}
            />
            <path d="M13.9 4.8 17.2 8.1" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
            <path d="M6.2 16 4.8 19.4 8.2 18" stroke="#5c5c5c" strokeWidth="1.4" strokeLinejoin="round" />
        </Icon>
    );
}

function IconHighlighter() {
    return (
        <Icon>
            <path d="M7 15.5 13.5 5.5l3.2 2L10 18l-3-2.5Z" fill="#f7d060" />
            <path d="M7 15.5 5 20h4l1-2" stroke="#c9a227" strokeWidth="1.3" />
            <path d="M5.5 20.5h13" stroke="#f7d060" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </Icon>
    );
}

function IconEraser() {
    return (
        <Icon>
            <path d="M7 14.5 13.5 6l4 3.2-6.5 8.5H7v-3.2Z" fill="#f783ac" />
            <path d="M7 17.5h10" stroke="#adb5bd" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M13.5 6 16 4.5 19.5 8 17.5 9.2" stroke="#868e96" strokeWidth="1.3" />
        </Icon>
    );
}

function IconText() {
    return (
        <Icon>
            <path d="M5 6h14M12 6v13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M8.5 19h7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </Icon>
    );
}

function IconShapes() {
    return (
        <Icon>
            <rect x="3.5" y="4.5" width="9" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="16" cy="15.5" r="4.2" stroke="#1971c2" strokeWidth="1.8" />
        </Icon>
    );
}

function IconMore() {
    return (
        <Icon>
            <circle cx="6" cy="12" r="1.6" fill="currentColor" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            <circle cx="18" cy="12" r="1.6" fill="currentColor" />
        </Icon>
    );
}

function IconZoomOut() {
    return (
        <Icon size={18}>
            <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M15 15.5 19 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8 10.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </Icon>
    );
}

function IconZoomIn() {
    return (
        <Icon size={18}>
            <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M15 15.5 19 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8 10.5h5M10.5 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </Icon>
    );
}

function IconFit() {
    return (
        <Icon size={18}>
            <path
                d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    );
}

function IconClose() {
    return (
        <Icon size={18}>
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </Icon>
    );
}

function IconLine() {
    return (
        <Icon>
            <path d="M5 18 19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </Icon>
    );
}

function IconRect() {
    return (
        <Icon>
            <rect x="4.5" y="5.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.9" />
        </Icon>
    );
}

function IconEllipse() {
    return (
        <Icon>
            <ellipse cx="12" cy="12" rx="8" ry="6.5" stroke="#1971c2" strokeWidth="1.9" />
        </Icon>
    );
}

function IconShare() {
    return (
        <Icon size={18}>
            <circle cx="18" cy="5" r="2.2" fill="currentColor" />
            <circle cx="6" cy="12" r="2.2" fill="currentColor" />
            <circle cx="18" cy="19" r="2.2" fill="currentColor" />
            <path d="M8 11.2 16 6.2M8 12.8 16 17.8" stroke="currentColor" strokeWidth="1.6" />
        </Icon>
    );
}

export default function MatekWhiteboard({
    uid,
    displayName,
    initialBoardId,
    onBoardId,
}: MatekWhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inkLayerRef = useRef<HTMLCanvasElement | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [boardId, setBoardId] = useState<string | null>(() => {
        if (initialBoardId) return initialBoardId;
        if (typeof window === 'undefined') return null;
        return openPersonalBoard(uid);
    });
    const [title, setTitle] = useState('Matek tábla');
    const [tool, setTool] = useState<WbTool>('pen');
    const [color, setColor] = useState('#ffffff');
    const [width, setWidth] = useState(3);
    const [strokes, setStrokes] = useState<WbStroke[]>([]);
    const [status, setStatus] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [shapeAssist, setShapeAssist] = useState(true);
    const [tray, setTray] = useState<'ink' | 'shapes' | 'more' | 'library' | null>('ink');
    const [zoomPct, setZoomPct] = useState(100);
    const [manualGate, setManualGate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [calcOpen, setCalcOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const autoCreateStarted = useRef(false);
    const createGen = useRef(0);
    const savedTitle = useRef('Matek tábla');

    const drawing = useRef(false);
    const current = useRef<WbStroke | null>(null);
    const pan = useRef({ x: 0, y: 0, active: false, lastX: 0, lastY: 0 });
    const scale = useRef(1);
    const localUndo = useRef<WbStroke[]>([]);
    const strokesRef = useRef<WbStroke[]>([]);
    const selectedRef = useRef<string[]>([]);
    const dragRef = useRef<{
        active: boolean;
        moved: boolean;
        mode: 'move' | 'resize' | 'marquee';
        startX: number;
        startY: number;
        ids: string[];
        snapshots: WbStroke[];
        additive?: boolean;
        marquee?: MarqueeBox;
    } | null>(null);
    const clipboardRef = useRef<WbStroke[]>([]);
    const placeImageRef = useRef<(blob: Blob) => void>(() => {});
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const pendingIds = useRef(new Set<string>());
    const explicitClear = useRef(false);
    const onBoardIdRef = useRef(onBoardId);
    onBoardIdRef.current = onBoardId;

    const inkActive = tool === 'pen' || tool === 'highlighter' || tool === 'eraser';
    const shapeActive = tool === 'line' || tool === 'rect' || tool === 'ellipse';

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ink on a separate layer so destination-out eraser never punches the grid.
        let ink = inkLayerRef.current;
        if (!ink) {
            ink = document.createElement('canvas');
            inkLayerRef.current = ink;
        }
        if (ink.width !== canvas.width || ink.height !== canvas.height) {
            ink.width = canvas.width;
            ink.height = canvas.height;
        }
        const ictx = ink.getContext('2d');
        if (!ictx) return;
        ictx.setTransform(1, 0, 0, 1, 0, 0);
        ictx.clearRect(0, 0, ink.width, ink.height);
        ictx.setTransform(
            scale.current,
            0,
            0,
            scale.current,
            pan.current.x * scale.current,
            pan.current.y * scale.current
        );
        const list = strokesRef.current;
        redrawImages = redraw;
        for (const s of list) drawStroke(ictx, s);
        if (current.current) drawStroke(ictx, current.current);

        // subtle charcoal grid (MS Whiteboard–like) — always under the ink
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        const step = 40 * scale.current;
        const ox = (pan.current.x * scale.current) % step;
        const oy = (pan.current.y * scale.current) % step;
        for (let x = ox; x < canvas.width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = oy; y < canvas.height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.restore();
        ctx.drawImage(ink, 0, 0);

        const selected = selectedRef.current;
        if (selected.length) {
            ctx.save();
            ctx.setTransform(
                scale.current,
                0,
                0,
                scale.current,
                pan.current.x * scale.current,
                pan.current.y * scale.current
            );
            ctx.strokeStyle = '#4dabf7';
            ctx.fillStyle = '#4dabf7';
            for (const id of selected) {
                const s = list.find((st) => st.id === id);
                if (!s || s.tool === 'eraser') continue;
                const b = strokeInkBounds(s);
                ctx.setLineDash([6 / scale.current, 4 / scale.current]);
                ctx.lineWidth = 1.5 / scale.current;
                ctx.strokeRect(b.minX, b.minY, Math.max(1, b.maxX - b.minX), Math.max(1, b.maxY - b.minY));
                if (s.tool === 'image' && selected.length === 1) {
                    const hx = (s.x || 0) + (s.w || 0);
                    const hy = (s.y || 0) + (s.h || 0);
                    const r = 5 / scale.current;
                    ctx.setLineDash([]);
                    ctx.fillRect(hx - r, hy - r, r * 2, r * 2);
                }
            }
            ctx.restore();
        }
        const marquee = dragRef.current?.mode === 'marquee' ? dragRef.current.marquee : null;
        if (marquee && (marquee.w !== 0 || marquee.h !== 0)) {
            ctx.save();
            ctx.setTransform(
                scale.current,
                0,
                0,
                scale.current,
                pan.current.x * scale.current,
                pan.current.y * scale.current
            );
            ctx.fillStyle = 'rgba(77, 171, 247, 0.14)';
            ctx.strokeStyle = '#4dabf7';
            ctx.lineWidth = 1.5 / scale.current;
            ctx.setLineDash([6 / scale.current, 4 / scale.current]);
            ctx.fillRect(marquee.x, marquee.y, marquee.w, marquee.h);
            ctx.strokeRect(marquee.x, marquee.y, marquee.w, marquee.h);
            ctx.restore();
        }
        // #region agent log
        if (!drawing.current || !current.current || current.current.points.length <= 2) {
            agentDebugLog({
                hypothesisId: 'B',
                location: 'MatekWhiteboard.tsx:redraw',
                message: 'redraw',
                data: {
                    strokesN: list.length,
                    hasCurrent: !!current.current,
                    drawing: drawing.current,
                    canvasW: canvas.width,
                    canvasH: canvas.height,
                },
                runId: 'wb-erase-fix',
            });
        }
        // #endregion
    }, []);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const box = wrap.getBoundingClientRect();
        const w = Math.max(320, Math.round(box.width));
        const h = Math.max(360, Math.round(box.height) || window.innerHeight - 120);
        const sameSize = canvas.width === w && canvas.height === h;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'MatekWhiteboard.tsx:resize',
            message: 'canvas buffer write',
            data: {
                w,
                h,
                prevW: canvas.width,
                prevH: canvas.height,
                sameSize,
                skipped: sameSize,
                strokesN: strokesRef.current.length,
                drawing: drawing.current,
            },
            runId: 'wb-erase-fix',
        });
        // #endregion
        if (!sameSize) {
            canvas.width = w;
            canvas.height = h;
        }
        redraw();
    }, [redraw]);

    useEffect(() => {
        resize();
        const wrap = wrapRef.current;
        const ro = typeof ResizeObserver !== 'undefined' && wrap ? new ResizeObserver(() => resize()) : null;
        if (wrap && ro) ro.observe(wrap);
        window.addEventListener('resize', resize);
        return () => {
            ro?.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, [resize]);

    useEffect(() => {
        if (dragRef.current?.active) return;
        strokesRef.current = strokes;
        redraw();
    }, [redraw, strokes]);

    useEffect(() => {
        if (!boardId) return;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'C',
            location: 'MatekWhiteboard.tsx:subscribeEffect',
            message: 'subscribe mount',
            data: { boardId, localN: strokesRef.current.length },
            runId: 'wb-erase',
        });
        // #endregion
        if (initialBoardId) onBoardIdRef.current(boardId);
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(`${origin}/whiteboard?board=${encodeURIComponent(boardId)}`);
        const unsub = subscribeStrokes(boardId, (list) => {
            const prev = strokesRef.current;
            const nextIds = new Set(list.map((s) => s.id));
            const dropped = prev.filter((s) => !nextIds.has(s.id)).map((s) => s.id);
            const ignoreEmpty = list.length === 0 && prev.length > 0 && !explicitClear.current;
            const merged = new Map(list.map((s) => [s.id, s] as const));
            let keptOptimistic = 0;
            if (!ignoreEmpty) {
                for (const s of prev) {
                    if (pendingIds.current.has(s.id)) {
                        merged.set(s.id, s);
                        keptOptimistic += 1;
                    }
                }
            }
            // #region agent log
            agentDebugLog({
                hypothesisId: 'A',
                location: 'MatekWhiteboard.tsx:subscribeStrokes',
                message: 'snapshot applied',
                data: {
                    prevN: prev.length,
                    nextN: list.length,
                    droppedN: dropped.length,
                    dropped: dropped.slice(0, 8),
                    drawing: drawing.current,
                    hasCurrent: !!current.current,
                    ignoreEmpty,
                    keptOptimistic,
                    mergedN: ignoreEmpty ? prev.length : merged.size,
                },
                runId: 'wb-erase-fix',
            });
            // #endregion
            if (ignoreEmpty) return;
            explicitClear.current = false;
            let next = [...merged.values()].sort((a, b) => a.createdAtMs - b.createdAtMs);
            const drag = dragRef.current;
            if (drag?.active) {
                const local = new Map(strokesRef.current.map((s) => [s.id, s] as const));
                next = next.map((s) => (drag.ids.includes(s.id) && local.has(s.id) ? local.get(s.id)! : s));
                for (const id of drag.ids) {
                    if (!next.some((s) => s.id === id) && local.has(id)) next.push(local.get(id)!);
                }
            }
            strokesRef.current = next;
            setStrokes(next);
        });
        loadWhiteboardMeta(boardId).then((m) => {
            if (m?.title) {
                setTitle(m.title);
                savedTitle.current = m.title;
            }
        });
        return () => {
            // #region agent log
            agentDebugLog({
                hypothesisId: 'C',
                location: 'MatekWhiteboard.tsx:subscribeEffect',
                message: 'subscribe unmount',
                data: { boardId, localN: strokesRef.current.length },
                runId: 'wb-erase',
            });
            // #endregion
            unsub();
        };
    }, [boardId, initialBoardId]);

    useEffect(() => {
        if (boardId) document.body.classList.add('wb-board-open');
        else document.body.classList.remove('wb-board-open');
        return () => document.body.classList.remove('wb-board-open');
    }, [boardId]);

    useEffect(() => {
        if (!boardId) return;
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }
            const key = e.key.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && key === 'd') {
                e.preventDefault();
                duplicateSelected();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && key === 'c' && selectedRef.current.length) {
                e.preventDefault();
                clipboardRef.current = strokesRef.current.filter((stroke) => selectedRef.current.includes(stroke.id));
                setStatus('Kijelölés a vágólapon');
                return;
            }
            if ((e.ctrlKey || e.metaKey) && key === 'v' && clipboardRef.current.length) {
                e.preventDefault();
                placeCopies(duplicateStrokes(clipboardRef.current, 28, 28));
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [boardId]);

    useEffect(() => {
        if (!boardId) return;
        const onPaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }
            const item = Array.from(e.clipboardData?.items || []).find((it) => it.type.startsWith('image/'));
            const file = item?.getAsFile();
            if (!file) return;
            e.preventDefault();
            placeImageRef.current(file);
        };
        window.addEventListener('paste', onPaste);
        return () => window.removeEventListener('paste', onPaste);
    }, [boardId]);

    useEffect(() => {
        if (initialBoardId) setBoardId(initialBoardId);
    }, [initialBoardId]);

    const setZoom = (next: number) => {
        scale.current = Math.min(2.5, Math.max(0.4, next));
        setZoomPct(Math.round(scale.current * 100));
        redraw();
    };

    const fitZoom = () => {
        pan.current.x = 0;
        pan.current.y = 0;
        setZoom(1);
    };

    const toWorld = (clientX: number, clientY: number): WbPoint => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const sx = rect.width ? canvas.width / rect.width : 1;
        const sy = rect.height ? canvas.height / rect.height : 1;
        const x = ((clientX - rect.left) * sx) / scale.current - pan.current.x;
        const y = ((clientY - rect.top) * sy) / scale.current - pan.current.y;
        return { x, y };
    };

    const commitStroke = async (stroke: WbStroke, mode: 'add' | 'update' = 'add') => {
        if (!boardId) return;
        if (mode === 'add') localUndo.current.push(stroke);
        pendingIds.current.add(stroke.id);
        const idx = strokesRef.current.findIndex((s) => s.id === stroke.id);
        if (idx >= 0) {
            const next = strokesRef.current.slice();
            next[idx] = stroke;
            strokesRef.current = next;
        } else {
            strokesRef.current = [...strokesRef.current, stroke];
        }
        setStrokes(strokesRef.current);
        redraw();
        try {
            await pushStroke(boardId, stroke);
        } catch (e: any) {
            setStatus(e?.message || 'Mentés sikertelen (Firestore jogosultság?)');
        } finally {
            pendingIds.current.delete(stroke.id);
        }
    };

    const selectOnly = (ids: string[]) => {
        selectedRef.current = ids;
        setSelectedIds(ids);
        redraw();
    };

    const placeCopies = (copies: WbStroke[]) => {
        if (!copies.length) return;
        for (const stroke of copies) void commitStroke(stroke);
        selectOnly(copies.map((stroke) => stroke.id));
        setTool('select');
        setStatus(copies.length === 1 ? '1 elem lemásolva' : `${copies.length} elem lemásolva`);
    };

    const duplicateSelected = (dx = 28, dy = 28) => {
        const chosen = strokesRef.current.filter(
            (stroke) => selectedRef.current.includes(stroke.id) && stroke.tool !== 'eraser'
        );
        placeCopies(duplicateStrokes(chosen, dx, dy));
    };

    const viewCenter = (): WbPoint => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        return {
            x: canvas.width / (2 * scale.current) - pan.current.x,
            y: canvas.height / (2 * scale.current) - pan.current.y,
        };
    };

    const placeImageBlob = async (blob: Blob) => {
        if (!boardId) return;
        try {
            const compressed = await compressWhiteboardImage(blob);
            await primeWhiteboardImage(compressed.src);
            const fit = Math.min(1, 480 / Math.max(compressed.width, compressed.height));
            const w = compressed.width * fit;
            const h = compressed.height * fit;
            const center = viewCenter();
            const stroke: WbStroke = {
                id: newStrokeId(),
                tool: 'image',
                color: '#ffffff',
                width: 2,
                points: [],
                src: compressed.src,
                x: center.x - w / 2,
                y: center.y - h / 2,
                w,
                h,
                authorId: uid,
                authorName: displayName,
                createdAtMs: Date.now(),
            };
            await commitStroke(stroke);
            selectOnly([stroke.id]);
            setTool('select');
            setStatus('Kép beillesztve.');
        } catch (e: any) {
            setStatus(e?.message || 'A kép beillesztése nem sikerült.');
        }
    };
    placeImageRef.current = (blob) => {
        void placeImageBlob(blob);
    };

    const openImageFile = () => {
        setTray(null);
        imageInputRef.current?.click();
    };

    const onImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (file && file.type.startsWith('image/')) void placeImageBlob(file);
    };

    const onDropImage = (e: React.DragEvent) => {
        e.preventDefault();
        const file = Array.from(e.dataTransfer.files).find((item) => item.type.startsWith('image/'));
        if (file) void placeImageBlob(file);
    };

    const placeCalcResult = (text: string) => {
        if (!boardId || !text.trim()) return;
        const center = viewCenter();
        const stroke: WbStroke = {
            id: newStrokeId(),
            tool: 'text',
            color,
            width,
            points: [],
            x: center.x,
            y: center.y,
            text: text.trim().slice(0, 200),
            authorId: uid,
            authorName: displayName,
            createdAtMs: Date.now(),
        };
        void commitStroke(stroke);
        selectOnly([stroke.id]);
        setTool('select');
    };

    const placeStamp = (id: StampId) => {
        if (!boardId) return;
        const strokes = buildStamp(id, viewCenter(), { authorId: uid, authorName: displayName });
        for (const stroke of strokes) void commitStroke(stroke);
        selectOnly(strokes.map((stroke) => stroke.id));
        setTool('select');
        setTray(null);
    };

    const onPointerDown = (e: React.PointerEvent) => {
        if (!boardId) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.setPointerCapture(e.pointerId);
        const p = toWorld(e.clientX, e.clientY);
        // #region agent log
        {
            const rect = canvas.getBoundingClientRect();
            agentDebugLog({
                hypothesisId: 'F',
                location: 'MatekWhiteboard.tsx:onPointerDown',
                message: 'pointer down',
                data: {
                    strokesN: strokesRef.current.length,
                    tool,
                    buttons: e.buttons,
                    canvasW: canvas.width,
                    canvasH: canvas.height,
                    rectW: Math.round(rect.width),
                    rectH: Math.round(rect.height),
                    sx: rect.width ? Number((canvas.width / rect.width).toFixed(3)) : 1,
                    sy: rect.height ? Number((canvas.height / rect.height).toFixed(3)) : 1,
                    worldX: Math.round(p.x),
                    worldY: Math.round(p.y),
                },
                runId: 'wb-erase-fix',
            });
        }
        // #endregion

        if (tool === 'pan' || e.button === 1 || e.buttons === 4) {
            pan.current.active = true;
            pan.current.lastX = e.clientX;
            pan.current.lastY = e.clientY;
            return;
        }

        if (tool === 'select') {
            const onlySelected = strokesRef.current.filter((s) => selectedRef.current.length === 1 && s.id === selectedRef.current[0]);
            const selectedImage = onlySelected[0];
            if (selectedImage && hitImageHandle(selectedImage, p, scale.current)) {
                dragRef.current = {
                    active: true,
                    moved: false,
                    mode: 'resize',
                    startX: p.x,
                    startY: p.y,
                    ids: [selectedImage.id],
                    snapshots: [selectedImage],
                };
                return;
            }

            const hit = hitTestTop(strokesRef.current, p);
            if (e.shiftKey) {
                if (!hit) return;
                const has = selectedRef.current.includes(hit.id);
                selectOnly(has ? selectedRef.current.filter((id) => id !== hit.id) : [...selectedRef.current, hit.id]);
                return;
            }

            if (!hit) {
                dragRef.current = {
                    active: true,
                    moved: false,
                    mode: 'marquee',
                    startX: p.x,
                    startY: p.y,
                    ids: [],
                    snapshots: [],
                    additive: e.shiftKey,
                    marquee: { x: p.x, y: p.y, w: 0, h: 0 },
                };
                return;
            }

            const ids = selectedRef.current.includes(hit.id) ? selectedRef.current : [hit.id];
            const originals = strokesRef.current.filter((s) => ids.includes(s.id) && s.tool !== 'eraser');
            if (e.ctrlKey || e.metaKey) {
                const copies = duplicateStrokes(originals, 0, 0);
                for (const stroke of copies) void commitStroke(stroke);
                selectOnly(copies.map((stroke) => stroke.id));
                dragRef.current = {
                    active: true,
                    moved: false,
                    mode: 'move',
                    startX: p.x,
                    startY: p.y,
                    ids: copies.map((stroke) => stroke.id),
                    snapshots: copies,
                };
                return;
            }

            selectOnly(ids);
            dragRef.current = {
                active: true,
                moved: false,
                mode: 'move',
                startX: p.x,
                startY: p.y,
                ids,
                snapshots: originals,
            };
            return;
        }

        if (tool === 'text') {
            const text = window.prompt('Szöveg a táblára:');
            if (!text?.trim()) return;
            const shown = textForBoard(text, strokesRef.current, p);
            const stroke: WbStroke = {
                id: newStrokeId(),
                tool: 'text',
                color,
                width,
                points: [],
                x: p.x,
                y: p.y,
                text: shown.slice(0, 200),
                authorId: uid,
                authorName: displayName,
                createdAtMs: Date.now(),
            };
            void commitStroke(stroke);
            return;
        }

        drawing.current = true;
        const strokeWidth = tool === 'highlighter' ? Math.max(width * 4, 12) : tool === 'eraser' ? Math.max(width * 5, 16) : width;
        const drawTool = tool === 'pen' || tool === 'highlighter' || tool === 'eraser' || tool === 'line' || tool === 'rect' || tool === 'ellipse' || tool === 'polygon' || tool === 'text'
            ? tool
            : 'pen';
        current.current = {
            id: newStrokeId(),
            tool: drawTool,
            color: tool === 'eraser' ? '#000000' : color,
            width: strokeWidth,
            points: [p],
            x: p.x,
            y: p.y,
            w: 0,
            h: 0,
            authorId: uid,
            authorName: displayName,
            createdAtMs: Date.now(),
        };
        redraw();
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (pan.current.active) {
            const dx = (e.clientX - pan.current.lastX) / scale.current;
            const dy = (e.clientY - pan.current.lastY) / scale.current;
            pan.current.x += dx;
            pan.current.y += dy;
            pan.current.lastX = e.clientX;
            pan.current.lastY = e.clientY;
            redraw();
            return;
        }
        const drag = dragRef.current;
        if (drag?.active) {
            const p = toWorld(e.clientX, e.clientY);
            const dx = p.x - drag.startX;
            const dy = p.y - drag.startY;
            if (Math.hypot(dx, dy) > 2) drag.moved = true;
            if (drag.mode === 'marquee') {
                drag.marquee = {
                    x: Math.min(drag.startX, p.x),
                    y: Math.min(drag.startY, p.y),
                    w: Math.abs(p.x - drag.startX),
                    h: Math.abs(p.y - drag.startY),
                };
                redraw();
                return;
            }
            const byId = new Map(drag.snapshots.map((s) => [s.id, s] as const));
            strokesRef.current = strokesRef.current.map((s) => {
                const snap = byId.get(s.id);
                if (!snap) return s;
                if (drag.mode === 'resize') return resizeImageStroke(snap, p);
                return translateStroke(snap, dx, dy);
            });
            redraw();
            return;
        }
        if (!drawing.current || !current.current) return;
        const p = toWorld(e.clientX, e.clientY);
        const s = current.current;
        if (s.tool === 'pen' || s.tool === 'highlighter' || s.tool === 'eraser') {
            s.points.push(p);
        } else if (s.tool === 'line') {
            s.points = [s.points[0] || p, p];
        } else if (s.tool === 'rect' || s.tool === 'ellipse') {
            s.w = p.x - (s.x || 0);
            s.h = p.y - (s.y || 0);
        }
        redraw();
    };

    const onPointerUp = () => {
        pan.current.active = false;
        const drag = dragRef.current;
        if (drag?.active) {
            dragRef.current = null;
            if (drag.mode === 'marquee') {
                const box = drag.marquee;
                if (!drag.moved || !box) {
                    if (!drag.additive) selectOnly([]);
                    else redraw();
                    return;
                }
                const hits = strokesInMarquee(strokesRef.current, box);
                const next = drag.additive
                    ? Array.from(new Set([...selectedRef.current, ...hits]))
                    : hits;
                selectOnly(next);
                if (next.length) {
                    setStatus(next.length === 1 ? '1 elem kijelölve' : `${next.length} elem kijelölve`);
                }
                return;
            }
            if (!drag.moved) {
                const byId = new Map(drag.snapshots.map((s) => [s.id, s] as const));
                strokesRef.current = strokesRef.current.map((s) => byId.get(s.id) || s);
                redraw();
                return;
            }
            const changed = strokesRef.current.filter((s) => drag.ids.includes(s.id));
            setStrokes(strokesRef.current.slice());
            for (const s of changed) void commitStroke(s, 'update');
            return;
        }
        if (!drawing.current || !current.current) return;
        drawing.current = false;
        let s = current.current;
        current.current = null;
        if (shapeAssist) {
            const before = s.tool;
            const nPts = s.points.length;
            s = correctInkStroke(s);
            // #region agent log
            agentDebugLog({
                hypothesisId: 'T',
                location: 'MatekWhiteboard.tsx:shapeAssist',
                message: 'ink correction',
                data: {
                    before,
                    after: s.tool,
                    nPts,
                    afterPts: s.points.length,
                    changed: s.tool !== before,
                    polyLabel:
                        s.tool === 'polygon' && s.points.length >= 3
                            ? polygonLabel(s.points)
                            : null,
                    ...(lastInkCorrectionDebug || {}),
                },
                runId: 'wb-shape',
            });
            // #endregion
            if (s.tool !== before && (before === 'pen' || before === 'highlighter')) {
                const polyMsg =
                    s.tool === 'polygon' && s.points.length >= 3
                        ? `Alakzat javítva: ${polygonLabel(s.points)}`
                        : null;
                setStatus(
                    polyMsg ||
                        (s.tool === 'ellipse'
                            ? 'Alakzat javítva: kör/ellipszis'
                            : s.tool === 'rect'
                              ? 'Alakzat javítva: téglalap'
                              : s.tool === 'line'
                                ? 'Alakzat javítva: egyenes'
                                : 'Alakzat javítva')
                );
            }
        }
        // #region agent log
        agentDebugLog({
            hypothesisId: 'D',
            location: 'MatekWhiteboard.tsx:onPointerUp',
            message: 'pointer up before commit',
            data: {
                strokesN: strokes.length,
                points: s.points.length,
                tool: s.tool,
                id: s.id,
            },
            runId: 'wb-erase',
        });
        // #endregion
        void commitStroke(s);
    };

    const onWheel = (e: React.WheelEvent) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        const next = scale.current * (e.deltaY > 0 ? 0.9 : 1.1);
        setZoom(next);
    };

    const handleCreate = async () => {
        const gen = ++createGen.current;
        setCreating(true);
        setStatus('Tábla link generálása…');
        try {
            const res = await createWhiteboard(uid, title || 'Matek tábla');
            if (gen !== createGen.current) return;
            setManualGate(false);
            setBoardId(res.meta.id);
            strokesRef.current = [];
            setStrokes([]);
            savedTitle.current = res.meta.title;
            setTitle(res.meta.title);
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const url = `${origin}/whiteboard?board=${encodeURIComponent(res.meta.id)}`;
            setShareUrl(url);
            try {
                await navigator.clipboard.writeText(url);
                if (gen !== createGen.current) return;
                if (res.mode === 'local') {
                    setStatus(
                        res.warning ||
                            'Link a vágólapra. Helyi tábla — közös synchez Publish: /rules-setup'
                    );
                } else {
                    setStatus('Táblalink generálva és a vágólapra másolva.');
                }
            } catch {
                if (gen !== createGen.current) return;
                setStatus(
                    res.mode === 'local'
                        ? res.warning || 'Táblalink kész (helyi mód).'
                        : 'Táblalink generálva.'
                );
            }
        } catch (e: any) {
            if (gen !== createGen.current) return;
            setManualGate(true);
            setStatus(e?.message || 'Nem sikerült létrehozni a táblát.');
        } finally {
            if (gen === createGen.current) setCreating(false);
        }
    };

    const handleJoin = async () => {
        const id = joinCode.trim().replace(/^.*board=/, '').split('&')[0];
        if (!id) {
            setStatus('Add meg a tábla kódot vagy linket.');
            return;
        }
        const meta = await loadWhiteboardMeta(id);
        if (!meta && !(typeof localStorage !== 'undefined' && localStorage.getItem(`wb_strokes_${id}`))) {
            // still allow join — strokes may appear once rules/local exist
        }
        setBoardId(id);
        if (meta?.title) {
            setTitle(meta.title);
            savedTitle.current = meta.title;
        }
        setStatus('Csatlakozva a közös táblához.');
    };

    const handleClear = async () => {
        if (!boardId) return;
        if (!window.confirm('Biztosan törlöd az egész táblát? Minden rajz eltűnik.')) return;
        setStatus('Tábla ürítése…');
        try {
            await clearWhiteboardStrokes(boardId);
            explicitClear.current = true;
            pendingIds.current.clear();
            strokesRef.current = [];
            setStrokes([]);
            localUndo.current = [];
            current.current = null;
            drawing.current = false;
            selectOnly([]);
            setStatus('Tábla kiürítve.');
            redraw();
        } catch (e: any) {
            setStatus(e?.message || 'Ürítés sikertelen.');
        }
    };

    const handleUndoLocal = async () => {
        const mine = [...strokesRef.current].reverse().find((s) => s.authorId === uid);
        if (!mine || !boardId) return;
        strokesRef.current = strokesRef.current.filter((s) => s.id !== mine.id);
        setStrokes(strokesRef.current);
        redraw();
        try {
            const firebase = (window as any).firebase;
            await firebase
                ?.firestore?.()
                ?.collection('whiteboards')
                ?.doc(boardId)
                ?.collection('strokes')
                ?.doc(mine.id)
                ?.delete?.();
        } catch {
            /* local-only undo fallback */
        }
    };

    const copyShare = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setStatus('Link a vágólapra másolva.');
        } catch {
            setStatus(shareUrl);
        }
    };

    const commitTitle = async () => {
        if (!boardId) return;
        const next = title.trim().slice(0, 60) || 'Matek tábla';
        if (next !== title) setTitle(next);
        if (next === savedTitle.current) return;
        try {
            await renameWhiteboard(boardId, next);
            savedTitle.current = next;
            setStatus('Tábla átnevezve.');
        } catch (e: any) {
            setStatus(e?.message || 'Átnevezés sikertelen.');
        }
    };

    const safeFileBase = () => {
        const raw = (title || 'whiteboard').replace(/[^\w\-áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+/gi, '_').slice(0, 40);
        return raw || 'whiteboard';
    };

    /** Flat export canvas: every stroke, scaled to fit (never clipped at 4096px). */
    const buildExportCanvas = () => {
        const src = canvasRef.current;
        if (!src) return null;

        const list = strokesRef.current.slice();
        if (current.current) list.push(current.current);

        const bounds = unionStrokeBounds(list);
        const plan = planWhiteboardExport(bounds, { width: src.width, height: src.height });
        const out = document.createElement('canvas');
        out.width = plan.width;
        out.height = plan.height;
        const ctx = out.getContext('2d');
        if (!ctx) return null;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, out.width, out.height);
        ctx.save();
        applyExportView(ctx, plan);
        for (const s of list) drawStroke(ctx, s);
        ctx.restore();
        return out;
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportImage = async (format: 'png' | 'jpeg') => {
        const out = buildExportCanvas();
        if (!out) {
            setStatus('Nincs mit exportálni.');
            return;
        }
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpeg' ? 0.92 : undefined;
        await new Promise<void>((resolve) => {
            out.toBlob(
                (blob) => {
                    if (!blob) {
                        setStatus('Kép export sikertelen.');
                        resolve();
                        return;
                    }
                    downloadBlob(blob, `${safeFileBase()}.${format === 'png' ? 'png' : 'jpg'}`);
                    setStatus(format === 'png' ? 'PNG letöltve.' : 'JPG letöltve.');
                    resolve();
                },
                mime,
                quality
            );
        });
    };

    const exportPdf = async () => {
        const out = buildExportCanvas();
        if (!out) {
            setStatus('Nincs mit exportálni.');
            return;
        }
        try {
            const { jsPDF } = await import('jspdf');
            const img = out.toDataURL('image/jpeg', 0.92);
            const orient = out.width >= out.height ? 'landscape' : 'portrait';
            const pdf = new jsPDF({
                orientation: orient,
                unit: 'pt',
                format: 'a4',
            });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 24;
            const maxW = pageW - margin * 2;
            const maxH = pageH - margin * 2;
            const scale = Math.min(maxW / out.width, maxH / out.height);
            const w = out.width * scale;
            const h = out.height * scale;
            const x = (pageW - w) / 2;
            const y = (pageH - h) / 2;
            pdf.setFillColor(12, 16, 24);
            pdf.rect(0, 0, pageW, pageH, 'F');
            pdf.addImage(img, 'JPEG', x, y, w, h);
            pdf.save(`${safeFileBase()}.pdf`);
            setStatus('PDF letöltve.');
        } catch (e: any) {
            setStatus(e?.message || 'PDF export sikertelen.');
        }
    };

    if (!boardId) {
        if (!manualGate || creating) {
            return (
                <div className="wb-gate">
                    <h2>Whiteboard</h2>
                    <p>Táblalink generálása…</p>
                    {status && <p className="wb-status">{status}</p>}
                    <button
                        type="button"
                        className="wb-ghost"
                        onClick={() => {
                            createGen.current += 1;
                            autoCreateStarted.current = true;
                            setManualGate(true);
                            setCreating(false);
                            setStatus('');
                        }}
                    >
                        Meglévő táblához csatlakozom
                    </button>
                </div>
            );
        }
        return (
            <div className="wb-gate">
                <h2>Whiteboard</h2>
                <p>Hozz létre új táblát (automatikus link), vagy csatlakozz egy meglévőhöz.</p>
                <label className="wb-field">
                    Tábla neve
                    <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} />
                </label>
                <button
                    type="button"
                    className="wb-primary"
                    disabled={creating}
                    onClick={() => {
                        autoCreateStarted.current = false;
                        void handleCreate();
                    }}
                >
                    Új tábla + link
                </button>
                <div className="wb-or">vagy csatlakozás</div>
                <label className="wb-field">
                    Tábla kód / link
                    <input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="wb_… vagy teljes link"
                    />
                </label>
                <button type="button" className="wb-ghost" onClick={() => void handleJoin()}>
                    Csatlakozás
                </button>
                {status && <p className="wb-status">{status}</p>}
            </div>
        );
    }

    return (
        <div className="wb-app wb-app--board">
            <div className="wb-topchip">
                <span className="wb-topchip-mark" aria-hidden>
                    W
                </span>
                <div className="wb-topchip-text">
                    <input
                        className="wb-topchip-title"
                        value={title}
                        maxLength={60}
                        aria-label="Tábla neve"
                        title="Kattints az átnevezéshez"
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => void commitTitle()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="wb-topchip-link"
                        title="Kattints a másoláshoz"
                        onClick={() => void copyShare()}
                    >
                        {shareUrl || 'Link generálása…'}
                    </button>
                </div>
                <button
                    type="button"
                    className="wb-topchip-share"
                    title="Link másolása"
                    onClick={() => void copyShare()}
                >
                    <IconShare />
                </button>
            </div>

            <div
                className="wb-canvas-wrap"
                ref={wrapRef}
                onDragOver={(e) => {
                    if (Array.from(e.dataTransfer.types).includes('Files')) e.preventDefault();
                }}
                onDrop={onDropImage}
            >
                <canvas
                    ref={canvasRef}
                    className={`wb-canvas${tool === 'pan' ? ' is-pan' : ''}${tool === 'select' ? ' is-select' : ''}`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onWheel={onWheel}
                />
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onImageFile}
                />
            </div>

            <div className="wb-dock" aria-label="Whiteboard eszközök">
                {tray === 'ink' && (
                    <div className="wb-tray wb-tray--ink" role="toolbar" aria-label="Tollak">
                        <button
                            type="button"
                            className={`wb-inktool ${tool === 'pen' ? 'is-on' : ''}`}
                            title="Toll"
                            onClick={() => {
                                setTool('pen');
                                setTray('ink');
                            }}
                        >
                            <span className="wb-inktool-shaft" style={{ background: color }} />
                            <IconPen tip={color} />
                        </button>
                        <button
                            type="button"
                            className={`wb-inktool is-hi ${tool === 'highlighter' ? 'is-on' : ''}`}
                            title="Kiemelő"
                            onClick={() => {
                                setTool('highlighter');
                                setTray('ink');
                            }}
                        >
                            <IconHighlighter />
                        </button>
                        <button
                            type="button"
                            className={`wb-inktool is-er ${tool === 'eraser' ? 'is-on' : ''}`}
                            title="Radír"
                            onClick={() => {
                                setTool('eraser');
                                setTray('ink');
                            }}
                        >
                            <IconEraser />
                        </button>
                        <span className="wb-tray-sep" />
                        <div className="wb-colors">
                            {WB_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`wb-swatch ${
                                        color.toLowerCase() === c.toLowerCase() ? 'is-on' : ''
                                    }`}
                                    style={{ background: c }}
                                    onClick={() => {
                                        setColor(c);
                                        if (tool === 'eraser') setTool('pen');
                                    }}
                                    aria-label={`Szín ${c}`}
                                    title={c}
                                />
                            ))}
                            <label
                                className={`wb-swatch wb-swatch-custom ${
                                    !WB_COLORS.some((c) => c.toLowerCase() === color.toLowerCase())
                                        ? 'is-on'
                                        : ''
                                }`}
                                title="Egyéni szín"
                            >
                                <span className="wb-swatch-custom-preview" style={{ background: color }} />
                                <input
                                    type="color"
                                    value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : '#ffffff'}
                                    onChange={(e) => {
                                        setColor(e.target.value);
                                        if (tool === 'eraser') setTool('pen');
                                    }}
                                    aria-label="Egyéni szín"
                                />
                            </label>
                        </div>
                        <span className="wb-tray-sep" />
                        <div className="wb-width-group" title="Vastagság">
                            {(
                                [
                                    [2, width <= 3],
                                    [4, width > 3 && width < 7],
                                    [8, width >= 7],
                                ] as const
                            ).map(([w, on]) => (
                                <button
                                    key={w}
                                    type="button"
                                    className={`wb-width-dot ${on ? 'is-on' : ''}`}
                                    onClick={() => setWidth(w)}
                                    aria-label={`Vastagság ${w}`}
                                >
                                    <span style={{ width: w + 4, height: w + 4 }} />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="wb-iconbtn wb-iconbtn--ghost"
                            title="Bezár"
                            onClick={() => setTray(null)}
                        >
                            <IconClose />
                        </button>
                    </div>
                )}

                {tray === 'shapes' && (
                    <div className="wb-tray" role="toolbar" aria-label="Alakzatok">
                        <button
                            type="button"
                            className={`wb-iconbtn ${tool === 'line' ? 'is-on' : ''}`}
                            title="Vonal"
                            onClick={() => setTool('line')}
                        >
                            <IconLine />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${tool === 'rect' ? 'is-on' : ''}`}
                            title="Téglalap"
                            onClick={() => setTool('rect')}
                        >
                            <IconRect />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${tool === 'ellipse' ? 'is-on' : ''}`}
                            title="Kör"
                            onClick={() => setTool('ellipse')}
                        >
                            <IconEllipse />
                        </button>
                        <span className="wb-tray-sep" />
                        <label className="wb-assist" title="Rossz kézi alakzat → tiszta">
                            <input
                                type="checkbox"
                                checked={shapeAssist}
                                onChange={(e) => setShapeAssist(e.target.checked)}
                            />
                            Alakzat javítás
                        </label>
                        <button
                            type="button"
                            className="wb-iconbtn wb-iconbtn--ghost"
                            title="Bezár"
                            onClick={() => setTray(null)}
                        >
                            <IconClose />
                        </button>
                    </div>
                )}

                {tray === 'library' && (
                    <div className="wb-tray" role="toolbar" aria-label="Adattár">
                        {WHITEBOARD_STAMPS.map((stamp) => (
                            <button
                                key={stamp.id}
                                type="button"
                                className="wb-stamp"
                                onClick={() => placeStamp(stamp.id)}
                            >
                                {stamp.label}
                            </button>
                        ))}
                        <button
                            type="button"
                            className="wb-iconbtn wb-iconbtn--ghost"
                            title="Bezár"
                            onClick={() => setTray(null)}
                        >
                            <IconClose />
                        </button>
                    </div>
                )}

                {tray === 'more' && (
                    <div className="wb-tray wb-tray--menu" role="menu" aria-label="Több">
                        <button type="button" className="wb-menuitem wb-menuitem--danger" onClick={() => void handleClear()}>
                            Egész tábla ürítése
                        </button>
                        <button type="button" className="wb-menuitem" onClick={() => void exportImage('png')}>
                            PNG
                        </button>
                        <button type="button" className="wb-menuitem" onClick={() => void exportImage('jpeg')}>
                            JPG
                        </button>
                        <button type="button" className="wb-menuitem" onClick={() => void exportPdf()}>
                            PDF
                        </button>
                        <button type="button" className="wb-menuitem" onClick={openImageFile}>
                            Kép beillesztése
                        </button>
                        <button type="button" className="wb-menuitem" onClick={() => void copyShare()}>
                            Megosztás
                        </button>
                        <button
                            type="button"
                            className="wb-menuitem"
                            onClick={() => {
                                setBoardId(null);
                                setManualGate(true);
                                autoCreateStarted.current = false;
                                setTray(null);
                                setShareUrl('');
                            }}
                        >
                            Másik tábla
                        </button>
                        <button
                            type="button"
                            className="wb-iconbtn wb-iconbtn--ghost"
                            title="Bezár"
                            onClick={() => setTray(null)}
                        >
                            <IconClose />
                        </button>
                    </div>
                )}

                <div className="wb-dock-row">
                    <div className="wb-fab-group">
                        <button
                            type="button"
                            className="wb-fab"
                            title="Visszavonás"
                            onClick={() => void handleUndoLocal()}
                        >
                            <IconUndo />
                        </button>
                        <button
                            type="button"
                            className="wb-fab wb-fab--danger"
                            title="Egész tábla ürítése"
                            onClick={() => void handleClear()}
                        >
                            <IconClearAll />
                        </button>
                    </div>
                    <div className="wb-mainbar" role="toolbar">
                        <button
                            type="button"
                            className={`wb-iconbtn ${tool === 'pan' ? 'is-on' : ''}`}
                            title="Mozgatás"
                            onClick={() => {
                                setTool('pan');
                                setTray(null);
                            }}
                        >
                            <IconHand />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${tool === 'select' ? 'is-on' : ''}`}
                            title={
                                selectedIds.length
                                    ? `Kijelölés (${selectedIds.length}). Húzd arrébb, Ctrl+húzás másol.`
                                    : 'Kijelölés: kattints, vagy húzz keretet több elemhez'
                            }
                            onClick={() => {
                                setTool('select');
                                setTray(null);
                            }}
                        >
                            <IconSelect />
                        </button>
                        {selectedIds.length > 0 && (
                            <button
                                type="button"
                                className="wb-iconbtn"
                                title="Kijelölés másolása"
                                onClick={() => duplicateSelected()}
                            >
                                <IconCopy />
                            </button>
                        )}
                        <button
                            type="button"
                            className={`wb-iconbtn ${inkActive ? 'is-on' : ''}`}
                            title="Toll"
                            onClick={() => {
                                if (!inkActive) setTool('pen');
                                setTray(tray === 'ink' ? null : 'ink');
                            }}
                        >
                            <IconPen tip={color} />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${tool === 'text' ? 'is-on' : ''}`}
                            title="Szöveg"
                            onClick={() => {
                                setTool('text');
                                setTray(null);
                            }}
                        >
                            <IconText />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${shapeActive || tray === 'shapes' ? 'is-on' : ''}`}
                            title="Alakzatok"
                            onClick={() => {
                                if (!shapeActive) setTool('rect');
                                setTray(tray === 'shapes' ? null : 'shapes');
                            }}
                        >
                            <IconShapes />
                        </button>
                        <button
                            type="button"
                            className="wb-iconbtn"
                            title="Kép"
                            onClick={openImageFile}
                        >
                            <IconImage />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${calcOpen ? 'is-on' : ''}`}
                            title="Számológép"
                            onClick={() => {
                                setCalcOpen((open) => !open);
                                setTray(null);
                            }}
                        >
                            <IconCalc />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${tray === 'library' ? 'is-on' : ''}`}
                            title="Adattár"
                            onClick={() => {
                                setTray(tray === 'library' ? null : 'library');
                                setCalcOpen(false);
                            }}
                        >
                            <IconLibrary />
                        </button>
                        <button
                            type="button"
                            className={`wb-iconbtn ${tray === 'more' ? 'is-on' : ''}`}
                            title="Több"
                            onClick={() => setTray(tray === 'more' ? null : 'more')}
                        >
                            <IconMore />
                        </button>
                    </div>
                </div>
            </div>

            <div className="wb-zoombar" role="toolbar" aria-label="Zoom">
                <button type="button" className="wb-iconbtn" title="Kicsinyítés" onClick={() => setZoom(scale.current * 0.9)}>
                    <IconZoomOut />
                </button>
                <span className="wb-zoom-label">{zoomPct}%</span>
                <button type="button" className="wb-iconbtn" title="Nagyítás" onClick={() => setZoom(scale.current * 1.1)}>
                    <IconZoomIn />
                </button>
                <button type="button" className="wb-iconbtn" title="Illesztés" onClick={fitZoom}>
                    <IconFit />
                </button>
            </div>

            {calcOpen && (
                <WhiteboardCalculator onClose={() => setCalcOpen(false)} onPlace={placeCalcResult} />
            )}

            {status && <p className="wb-status wb-status--float">{status}</p>}
        </div>
    );
}
