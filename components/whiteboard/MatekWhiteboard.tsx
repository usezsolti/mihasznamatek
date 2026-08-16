import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
    clearWhiteboardStrokes,
    createWhiteboard,
    loadWhiteboardMeta,
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
import { correctInkStroke, polygonLabel } from '../../utils/whiteboardInkToShape';

type MatekWhiteboardProps = {
    uid: string;
    displayName: string;
    initialBoardId?: string | null;
    onBoardId: (id: string) => void;
};

function drawStroke(ctx: CanvasRenderingContext2D, s: WbStroke) {
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
    const wrapRef = useRef<HTMLDivElement>(null);
    const [boardId, setBoardId] = useState<string | null>(initialBoardId || null);
    const [title, setTitle] = useState('Matek tábla');
    const [tool, setTool] = useState<WbTool>('pen');
    const [color, setColor] = useState('#ffffff');
    const [width, setWidth] = useState(3);
    const [strokes, setStrokes] = useState<WbStroke[]>([]);
    const [status, setStatus] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [shapeAssist, setShapeAssist] = useState(true);
    const [tray, setTray] = useState<'ink' | 'shapes' | 'more' | null>('ink');
    const [zoomPct, setZoomPct] = useState(100);
    const [manualGate, setManualGate] = useState(false);
    const [creating, setCreating] = useState(false);
    const autoCreateStarted = useRef(false);
    const createGen = useRef(0);
    const savedTitle = useRef('Matek tábla');

    const drawing = useRef(false);
    const current = useRef<WbStroke | null>(null);
    const pan = useRef({ x: 0, y: 0, active: false, lastX: 0, lastY: 0 });
    const scale = useRef(1);
    const localUndo = useRef<WbStroke[]>([]);

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

        // subtle charcoal grid (MS Whiteboard–like)
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

        ctx.setTransform(scale.current, 0, 0, scale.current, pan.current.x * scale.current, pan.current.y * scale.current);
        for (const s of strokes) drawStroke(ctx, s);
        if (current.current) drawStroke(ctx, current.current);
    }, [strokes]);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const w = Math.max(320, wrap.clientWidth);
        const h = Math.max(360, wrap.clientHeight || window.innerHeight - 120);
        canvas.width = w;
        canvas.height = h;
        redraw();
    }, [redraw]);

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [resize]);

    useEffect(() => {
        redraw();
    }, [redraw, strokes]);

    useEffect(() => {
        if (!boardId) return;
        onBoardId(boardId);
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(`${origin}/whiteboard?board=${encodeURIComponent(boardId)}`);
        const unsub = subscribeStrokes(boardId, (list) => {
            setStrokes(list);
        });
        loadWhiteboardMeta(boardId).then((m) => {
            if (m?.title) {
                setTitle(m.title);
                savedTitle.current = m.title;
            }
        });
        return unsub;
    }, [boardId, onBoardId]);

    useEffect(() => {
        if (boardId) document.body.classList.add('wb-board-open');
        else document.body.classList.remove('wb-board-open');
        return () => document.body.classList.remove('wb-board-open');
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
        const x = (clientX - rect.left) / scale.current - pan.current.x;
        const y = (clientY - rect.top) / scale.current - pan.current.y;
        return { x, y };
    };

    const commitStroke = async (stroke: WbStroke) => {
        if (!boardId) return;
        localUndo.current.push(stroke);
        setStrokes((prev) => [...prev, stroke]);
        try {
            await pushStroke(boardId, stroke);
        } catch (e: any) {
            setStatus(e?.message || 'Mentés sikertelen (Firestore jogosultság?)');
        }
    };

    const onPointerDown = (e: React.PointerEvent) => {
        if (!boardId) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.setPointerCapture(e.pointerId);
        const p = toWorld(e.clientX, e.clientY);

        if (tool === 'pan' || e.button === 1 || e.buttons === 4) {
            pan.current.active = true;
            pan.current.lastX = e.clientX;
            pan.current.lastY = e.clientY;
            return;
        }

        if (tool === 'text') {
            const text = window.prompt('Szöveg a táblára:');
            if (!text?.trim()) return;
            const stroke: WbStroke = {
                id: newStrokeId(),
                tool: 'text',
                color,
                width,
                points: [],
                x: p.x,
                y: p.y,
                text: text.trim().slice(0, 200),
                authorId: uid,
                authorName: displayName,
                createdAtMs: Date.now(),
            };
            void commitStroke(stroke);
            return;
        }

        drawing.current = true;
        const strokeWidth = tool === 'highlighter' ? Math.max(width * 4, 12) : tool === 'eraser' ? Math.max(width * 5, 16) : width;
        current.current = {
            id: newStrokeId(),
            tool: tool === 'pan' ? 'pen' : tool,
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
        if (!drawing.current || !current.current) return;
        drawing.current = false;
        let s = current.current;
        current.current = null;
        if (shapeAssist) {
            const before = s.tool;
            s = correctInkStroke(s);
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
        void commitStroke(s);
        redraw();
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

    // Open /whiteboard → auto-generate a shareable board link (unless joining an existing one).
    useEffect(() => {
        if (initialBoardId || boardId || manualGate) return;
        if (autoCreateStarted.current) return;
        autoCreateStarted.current = true;
        void handleCreate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialBoardId, boardId, manualGate, uid]);

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
            setStrokes([]);
            localUndo.current = [];
            current.current = null;
            drawing.current = false;
            setStatus('Tábla kiürítve.');
            redraw();
        } catch (e: any) {
            setStatus(e?.message || 'Ürítés sikertelen.');
        }
    };

    const handleUndoLocal = async () => {
        const mine = [...strokes].reverse().find((s) => s.authorId === uid);
        if (!mine || !boardId) return;
        setStrokes((prev) => prev.filter((s) => s.id !== mine.id));
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

    /** Flat export canvas (all strokes, no pan/zoom) on dark Mihaszna board. */
    const buildExportCanvas = () => {
        redraw();
        const src = canvasRef.current;
        if (!src) return null;

        // Fit strokes into a clean export size
        let minX = 0;
        let minY = 0;
        let maxX = src.width;
        let maxY = src.height;
        if (strokes.length) {
            minX = Infinity;
            minY = Infinity;
            maxX = -Infinity;
            maxY = -Infinity;
            const expand = (x: number, y: number, pad = 24) => {
                minX = Math.min(minX, x - pad);
                minY = Math.min(minY, y - pad);
                maxX = Math.max(maxX, x + pad);
                maxY = Math.max(maxY, y + pad);
            };
            for (const s of strokes) {
                for (const p of s.points) expand(p.x, p.y, s.width + 20);
                if (s.tool === 'rect' || s.tool === 'ellipse') {
                    expand(s.x || 0, s.y || 0);
                    expand((s.x || 0) + (s.w || 0), (s.y || 0) + (s.h || 0));
                }
                if (s.tool === 'text') expand(s.x || 0, s.y || 0, 80);
            }
            if (!Number.isFinite(minX)) {
                minX = 0;
                minY = 0;
                maxX = src.width;
                maxY = src.height;
            }
        }

        const pad = 40;
        const w = Math.max(640, Math.ceil(maxX - minX + pad * 2));
        const h = Math.max(480, Math.ceil(maxY - minY + pad * 2));
        const out = document.createElement('canvas');
        out.width = Math.min(w, 4096);
        out.height = Math.min(h, 4096);
        const ctx = out.getContext('2d');
        if (!ctx) return null;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, out.width, out.height);
        ctx.save();
        ctx.translate(pad - minX, pad - minY);
        for (const s of strokes) drawStroke(ctx, s);
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

            <div className="wb-canvas-wrap" ref={wrapRef}>
                <canvas
                    ref={canvasRef}
                    className={`wb-canvas${tool === 'pan' ? ' is-pan' : ''}`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onWheel={onWheel}
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

            {status && <p className="wb-status wb-status--float">{status}</p>}
        </div>
    );
}
