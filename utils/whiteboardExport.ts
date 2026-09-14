import type { WbStroke } from './whiteboardTypes';

export type InkBounds = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

export type WhiteboardExportPlan = {
    width: number;
    height: number;
    scale: number;
    pad: number;
    minX: number;
    minY: number;
};

export const EXPORT_MAX_PX = 4096;
export const EXPORT_PAD_PX = 48;
export const EXPORT_MIN_W = 640;
export const EXPORT_MIN_H = 480;

function textFontPx(stroke: WbStroke): number {
    return Math.max(14, (stroke.width || 2) * 4);
}

/** Approx glyph width when Canvas is not available (unit tests / SSR). */
export function estimateTextWidth(text: string, fontPx: number): number {
    return Math.ceil(text.length * fontPx * 0.62);
}

export function measureWhiteboardText(text: string, fontPx: number): number {
    if (typeof document === 'undefined') return estimateTextWidth(text, fontPx);
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return estimateTextWidth(text, fontPx);
    ctx.font = `${fontPx}px "Segoe UI", system-ui, sans-serif`;
    return ctx.measureText(text).width;
}

function strokeHalfPad(stroke: WbStroke): number {
    return Math.max(4, (stroke.width || 2) / 2 + 4);
}

export function strokeInkBounds(
    stroke: WbStroke,
    measureText: (text: string, fontPx: number) => number = measureWhiteboardText
): InkBounds {
    const half = strokeHalfPad(stroke);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const expand = (x: number, y: number, pad = half) => {
        minX = Math.min(minX, x - pad);
        minY = Math.min(minY, y - pad);
        maxX = Math.max(maxX, x + pad);
        maxY = Math.max(maxY, y + pad);
    };

    if (stroke.tool === 'text' && stroke.text) {
        const fontPx = textFontPx(stroke);
        const tw = Math.max(fontPx, measureText(stroke.text, fontPx));
        const x = stroke.x || 0;
        const y = stroke.y || 0;
        expand(x, y, 6);
        expand(x + tw, y + fontPx * 1.35, 6);
    }

    if (stroke.tool === 'rect' || stroke.tool === 'ellipse') {
        const x0 = stroke.x || 0;
        const y0 = stroke.y || 0;
        const x1 = x0 + (stroke.w || 0);
        const y1 = y0 + (stroke.h || 0);
        expand(Math.min(x0, x1), Math.min(y0, y1), half);
        expand(Math.max(x0, x1), Math.max(y0, y1), half);
    }

    for (const p of stroke.points || []) expand(p.x, p.y, half);

    if (!Number.isFinite(minX)) {
        return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }
    return { minX, minY, maxX, maxY };
}

export function unionStrokeBounds(
    strokes: WbStroke[],
    measureText: (text: string, fontPx: number) => number = measureWhiteboardText
): InkBounds | null {
    if (!strokes.length) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const stroke of strokes) {
        const b = strokeInkBounds(stroke, measureText);
        minX = Math.min(minX, b.minX);
        minY = Math.min(minY, b.minY);
        maxX = Math.max(maxX, b.maxX);
        maxY = Math.max(maxY, b.maxY);
    }
    if (!Number.isFinite(minX)) return null;
    return { minX, minY, maxX, maxY };
}

export function planWhiteboardExport(
    bounds: InkBounds | null,
    fallback: { width: number; height: number }
): WhiteboardExportPlan {
    const pad = EXPORT_PAD_PX;
    const minX = bounds ? bounds.minX : 0;
    const minY = bounds ? bounds.minY : 0;
    const innerW = bounds ? Math.max(1, bounds.maxX - bounds.minX) : Math.max(1, fallback.width);
    const innerH = bounds ? Math.max(1, bounds.maxY - bounds.minY) : Math.max(1, fallback.height);
    const paddedW = innerW + pad * 2;
    const paddedH = innerH + pad * 2;
    const targetW = bounds ? paddedW : Math.max(EXPORT_MIN_W, paddedW);
    const targetH = bounds ? paddedH : Math.max(EXPORT_MIN_H, paddedH);
    const scale = Math.min(1, EXPORT_MAX_PX / targetW, EXPORT_MAX_PX / targetH);
    return {
        width: Math.max(1, Math.round(targetW * scale)),
        height: Math.max(1, Math.round(targetH * scale)),
        scale,
        pad,
        minX,
        minY,
    };
}

export function applyExportView(ctx: CanvasRenderingContext2D, plan: WhiteboardExportPlan): void {
    ctx.scale(plan.scale, plan.scale);
    ctx.translate(plan.pad - plan.minX, plan.pad - plan.minY);
}

/** World-space point lands inside the export bitmap (with 1px rounding slack). */
export function exportContainsWorldPoint(plan: WhiteboardExportPlan, x: number, y: number): boolean {
    const px = (x + plan.pad - plan.minX) * plan.scale;
    const py = (y + plan.pad - plan.minY) * plan.scale;
    return px >= -1 && py >= -1 && px <= plan.width + 1 && py <= plan.height + 1;
}
