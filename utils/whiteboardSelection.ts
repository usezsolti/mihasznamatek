import { strokeInkBounds } from './whiteboardExport';
import type { WbPoint, WbStroke } from './whiteboardTypes';

const BOX_TOOLS = new Set<WbStroke['tool']>(['text', 'rect', 'ellipse', 'image']);

function dist(a: WbPoint, b: WbPoint): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function distToSegment(p: WbPoint, a: WbPoint, b: WbPoint): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return dist(p, a);
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function pointInBounds(p: WbPoint, minX: number, minY: number, maxX: number, maxY: number): boolean {
    return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
}

export function hitTestStroke(stroke: WbStroke, point: WbPoint): boolean {
    if (stroke.tool === 'eraser') return false;

    if (BOX_TOOLS.has(stroke.tool)) {
        const b = strokeInkBounds(stroke);
        if (b.maxX === 0 && b.minX === 0 && b.maxY === 0 && b.minY === 0 && !stroke.text && stroke.tool !== 'image') {
            return false;
        }
        return pointInBounds(point, b.minX, b.minY, b.maxX, b.maxY);
    }

    const pts = stroke.points || [];
    if (!pts.length) return false;
    const slop = Math.max(10, (stroke.width || 2) / 2 + 6);
    if (pts.length === 1) return dist(point, pts[0]) <= slop;
    for (let i = 1; i < pts.length; i++) {
        if (distToSegment(point, pts[i - 1], pts[i]) <= slop) return true;
    }
    if (stroke.tool === 'polygon' && pts.length >= 3) {
        if (distToSegment(point, pts[pts.length - 1], pts[0]) <= slop) return true;
    }
    return false;
}

/** Topmost hit. Later strokes are drawn above earlier ones. */
export function hitTestTop(strokes: WbStroke[], point: WbPoint): WbStroke | null {
    for (let i = strokes.length - 1; i >= 0; i--) {
        if (hitTestStroke(strokes[i], point)) return strokes[i];
    }
    return null;
}

export function translateStroke(stroke: WbStroke, dx: number, dy: number): WbStroke {
    return {
        ...stroke,
        x: stroke.x === undefined ? undefined : stroke.x + dx,
        y: stroke.y === undefined ? undefined : stroke.y + dy,
        points: (stroke.points || []).map((p) => ({ x: p.x + dx, y: p.y + dy })),
    };
}

export function imageHandlePoint(stroke: WbStroke): WbPoint | null {
    if (stroke.tool !== 'image') return null;
    const x0 = stroke.x || 0;
    const y0 = stroke.y || 0;
    return { x: x0 + (stroke.w || 0), y: y0 + (stroke.h || 0) };
}

export function hitImageHandle(stroke: WbStroke, point: WbPoint, scale: number): boolean {
    const handle = imageHandlePoint(stroke);
    if (!handle) return false;
    const radius = 14 / Math.max(0.4, scale);
    return dist(point, handle) <= radius;
}

/** Resize from the bottom-right corner, keeping the original aspect ratio. */
export function resizeImageStroke(original: WbStroke, pointer: WbPoint): WbStroke {
    const ow = original.w || 1;
    const oh = original.h || 1;
    const aspect = Math.abs(ow / oh) || 1;
    const w = Math.max(24, pointer.x - (original.x || 0));
    const h = Math.max(24, w / aspect);
    return { ...original, w, h };
}
