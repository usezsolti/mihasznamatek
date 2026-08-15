import type { WbPoint, WbStroke } from './whiteboardTypes';

/** Distance between two points */
function dist(a: WbPoint, b: WbPoint): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
}

function bbox(points: WbPoint[]) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    }
    return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

/** Path length */
function pathLength(points: WbPoint[]): number {
    let len = 0;
    for (let i = 1; i < points.length; i++) len += dist(points[i - 1], points[i]);
    return len;
}

function centroid(points: WbPoint[]): WbPoint {
    let x = 0;
    let y = 0;
    for (const p of points) {
        x += p.x;
        y += p.y;
    }
    const n = Math.max(1, points.length);
    return { x: x / n, y: y / n };
}

function angleBetween(a: WbPoint, b: WbPoint, c: WbPoint): number {
    const v1x = a.x - b.x;
    const v1y = a.y - b.y;
    const v2x = c.x - b.x;
    const v2y = c.y - b.y;
    const n1 = Math.hypot(v1x, v1y) || 1;
    const n2 = Math.hypot(v2x, v2y) || 1;
    const dot = Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / (n1 * n2)));
    return Math.acos(dot);
}

function turnAngle(a: WbPoint, b: WbPoint, c: WbPoint): number {
    // Absolute exterior turning (0 = straight, π = sharp U-turn)
    return Math.PI - angleBetween(a, b, c);
}

function resample(points: WbPoint[], n: number): WbPoint[] {
    if (points.length < 2 || n < 2) return points.slice();
    const total = pathLength(points);
    if (total < 1) return points.slice(0, 1);
    const step = total / (n - 1);
    const out: WbPoint[] = [points[0]];
    let acc = 0;
    let i = 1;
    let prev = points[0];
    while (out.length < n - 1 && i < points.length) {
        const cur = points[i];
        const seg = dist(prev, cur);
        if (acc + seg >= step) {
            const t = (step - acc) / (seg || 1);
            const p = { x: prev.x + (cur.x - prev.x) * t, y: prev.y + (cur.y - prev.y) * t };
            out.push(p);
            prev = p;
            acc = 0;
        } else {
            acc += seg;
            prev = cur;
            i++;
        }
    }
    out.push(points[points.length - 1]);
    return out;
}

/**
 * Find sharp corners along a freehand path (for polygon recognition).
 */
function detectCorners(raw: WbPoint[]): WbPoint[] {
    const pts = resample(raw, Math.min(96, Math.max(32, Math.floor(raw.length * 0.6))));
    if (pts.length < 8) return [];

    const size = Math.max(bbox(pts).w, bbox(pts).h) || 1;
    const turns: number[] = new Array(pts.length).fill(0);
    for (let i = 1; i < pts.length - 1; i++) {
        turns[i] = turnAngle(pts[i - 1], pts[i], pts[i + 1]);
    }
    // Closed path: also score endpoints via wrap
    if (dist(pts[0], pts[pts.length - 1]) < size * 0.28) {
        turns[0] = turnAngle(pts[pts.length - 2], pts[0], pts[1]);
        turns[pts.length - 1] = turns[0];
    }

    const threshold = 0.38; // ~22°
    const candidates: { i: number; t: number }[] = [];
    for (let i = 1; i < pts.length - 1; i++) {
        if (turns[i] < threshold) continue;
        if (turns[i] >= turns[i - 1] && turns[i] >= turns[i + 1]) {
            candidates.push({ i, t: turns[i] });
        }
    }
    if (turns[0] >= threshold) candidates.push({ i: 0, t: turns[0] });

    // Non-max suppression by path distance
    candidates.sort((a, b) => b.t - a.t);
    const minSep = size * 0.12;
    const kept: { i: number; t: number }[] = [];
    for (const c of candidates) {
        const p = pts[c.i];
        if (kept.some((k) => dist(pts[k.i], p) < minSep)) continue;
        kept.push(c);
    }

    // Order along the stroke
    kept.sort((a, b) => a.i - b.i);
    let corners = kept.map((k) => pts[k.i]);

    // Drop near-duplicate close of loop
    if (corners.length >= 2 && dist(corners[0], corners[corners.length - 1]) < minSep) {
        corners = corners.slice(0, -1);
    }

    return corners;
}

function isNearlyRect(corners: WbPoint[]): boolean {
    if (corners.length !== 4) return false;
    const box = bbox(corners);
    const tol = Math.max(8, Math.min(box.w, box.h) * 0.14);
    let ok = 0;
    for (const p of corners) {
        const onV =
            Math.min(Math.abs(p.x - box.minX), Math.abs(p.x - box.maxX)) <= tol &&
            p.y >= box.minY - tol &&
            p.y <= box.maxY + tol;
        const onH =
            Math.min(Math.abs(p.y - box.minY), Math.abs(p.y - box.maxY)) <= tol &&
            p.x >= box.minX - tol &&
            p.x <= box.maxX + tol;
        if (onV || onH) ok++;
    }
    return ok >= 3;
}

function sideAngle(a: WbPoint, b: WbPoint): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

/** Smallest angle between two undirected lines (0 … π/2). */
function undirectedAngleDiff(a: number, b: number): number {
    let d = Math.abs(a - b) % Math.PI;
    if (d > Math.PI / 2) d = Math.PI - d;
    return d;
}

function averageUndirectedAngle(a: number, b: number): number {
    // Map both into [0, π)
    const norm = (t: number) => {
        let x = t % Math.PI;
        if (x < 0) x += Math.PI;
        return x;
    };
    let a0 = norm(a);
    let b0 = norm(b);
    if (Math.abs(a0 - b0) > Math.PI / 2) {
        if (a0 < b0) a0 += Math.PI;
        else b0 += Math.PI;
    }
    return norm((a0 + b0) / 2);
}

/**
 * Trapezoid = exactly one pair of opposite sides roughly parallel.
 * Returns which pair: 0 → sides (0-1)&(2-3), 1 → sides (1-2)&(3-0).
 */
function detectTrapezoidPair(corners: WbPoint[]): 0 | 1 | null {
    if (corners.length !== 4) return null;
    const thresh = (20 * Math.PI) / 180;
    const a01 = sideAngle(corners[0], corners[1]);
    const a23 = sideAngle(corners[2], corners[3]);
    const a12 = sideAngle(corners[1], corners[2]);
    const a30 = sideAngle(corners[3], corners[0]);
    const d0 = undirectedAngleDiff(a01, a23);
    const d1 = undirectedAngleDiff(a12, a30);
    const pair0 = d0 <= thresh;
    const pair1 = d1 <= thresh;
    // Exactly one pair → trapéz (not paralelogramma)
    if (pair0 && !pair1) return 0;
    if (pair1 && !pair0) return 1;
    return null;
}

export function isTrapezoid(corners: WbPoint[]): boolean {
    return detectTrapezoidPair(corners) !== null;
}

/** Snap a messy quad so one pair of opposite sides is exactly parallel. */
function makeTrapezoid(corners: WbPoint[]): WbPoint[] {
    const pair = detectTrapezoidPair(corners);
    if (pair === null) return corners.map((p) => ({ ...p }));

    const out = corners.map((p) => ({ ...p }));

    const snapSide = (i: number, j: number, theta: number) => {
        const a = out[i];
        const b = out[j];
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const half = dist(a, b) / 2;
        const ux = Math.cos(theta);
        const uy = Math.sin(theta);
        const p1 = { x: mid.x - ux * half, y: mid.y - uy * half };
        const p2 = { x: mid.x + ux * half, y: mid.y + uy * half };
        if (dist(p1, a) + dist(p2, b) <= dist(p1, b) + dist(p2, a)) {
            out[i] = p1;
            out[j] = p2;
        } else {
            out[i] = p2;
            out[j] = p1;
        }
    };

    if (pair === 0) {
        const theta = averageUndirectedAngle(
            sideAngle(corners[0], corners[1]),
            sideAngle(corners[2], corners[3])
        );
        snapSide(0, 1, theta);
        snapSide(2, 3, theta);
    } else {
        const theta = averageUndirectedAngle(
            sideAngle(corners[1], corners[2]),
            sideAngle(corners[3], corners[0])
        );
        snapSide(1, 2, theta);
        snapSide(3, 0, theta);
    }

    // Prefer flat bases when nearly horizontal/vertical (school-style trapéz)
    const flatten = (i: number, j: number) => {
        const a = out[i];
        const b = out[j];
        const ang = Math.abs(sideAngle(a, b));
        const horiz = Math.min(ang % Math.PI, Math.PI - (ang % Math.PI));
        const vert = Math.abs(horiz - Math.PI / 2);
        if (horiz < (12 * Math.PI) / 180) {
            const y = (a.y + b.y) / 2;
            out[i] = { x: a.x, y };
            out[j] = { x: b.x, y };
        } else if (vert < (12 * Math.PI) / 180) {
            const x = (a.x + b.x) / 2;
            out[i] = { x, y: a.y };
            out[j] = { x, y: b.y };
        }
    };
    if (pair === 0) {
        flatten(0, 1);
        flatten(2, 3);
    } else {
        flatten(1, 2);
        flatten(3, 0);
    }

    return out;
}

function regularityScore(corners: WbPoint[]): number {
    const n = corners.length;
    if (n < 3) return 0;
    const c = centroid(corners);
    const radii = corners.map((p) => dist(p, c));
    const rMean = radii.reduce((a, b) => a + b, 0) / n;
    if (rMean < 1) return 0;
    let rVar = 0;
    for (const r of radii) rVar += (r - rMean) ** 2;
    const rCv = Math.sqrt(rVar / n) / rMean;

    const sides: number[] = [];
    for (let i = 0; i < n; i++) {
        sides.push(dist(corners[i], corners[(i + 1) % n]));
    }
    const sMean = sides.reduce((a, b) => a + b, 0) / n;
    let sVar = 0;
    for (const s of sides) sVar += (s - sMean) ** 2;
    const sCv = Math.sqrt(sVar / n) / (sMean || 1);

    return Math.max(0, 1 - rCv * 1.6 - sCv * 1.4);
}

function makeRegularPolygon(corners: WbPoint[]): WbPoint[] {
    const n = corners.length;
    const c = centroid(corners);
    const r = corners.reduce((acc, p) => acc + dist(p, c), 0) / n;
    // Start angle from the average of vertex angles (rotated to match drawing)
    let ang0 = 0;
    for (let i = 0; i < n; i++) {
        ang0 += Math.atan2(corners[i].y - c.y, corners[i].x - c.x) - (i * 2 * Math.PI) / n;
    }
    ang0 /= n;
    const out: WbPoint[] = [];
    for (let i = 0; i < n; i++) {
        const a = ang0 + (i * 2 * Math.PI) / n;
        out.push({ x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) });
    }
    return out;
}

function polygonFitScore(raw: WbPoint[], corners: WbPoint[]): number {
    if (corners.length < 3) return 0;
    const size = Math.max(bbox(raw).w, bbox(raw).h) || 1;
    const closed = dist(raw[0], raw[raw.length - 1]) < size * 0.28;
    // How well ink hugs the polygon edges
    let err = 0;
    for (const p of raw) {
        let best = Infinity;
        for (let i = 0; i < corners.length; i++) {
            const a = corners[i];
            const b = corners[(i + 1) % corners.length];
            best = Math.min(best, pointLineDistance(p, a, b));
        }
        err += best;
    }
    err /= raw.length;
    const edgeFit = Math.max(0, 1 - err / (size * 0.12));
    const reg = regularityScore(corners);
    return edgeFit * 0.65 + reg * 0.2 + (closed ? 0.15 : 0);
}

/** Hungarian label for corrected polygon (incl. trapéz). */
export function polygonLabel(points: WbPoint[] | number): string {
    if (typeof points === 'number') {
        return polygonLabelByCount(points);
    }
    if (points.length === 4 && isTrapezoid(points)) return 'trapéz';
    return polygonLabelByCount(points.length);
}

function polygonLabelByCount(n: number): string {
    switch (n) {
        case 3:
            return 'háromszög';
        case 4:
            return 'négyszög';
        case 5:
            return 'ötszög';
        case 6:
            return 'hatszög';
        case 7:
            return 'hétszög';
        case 8:
            return 'nyolcszög';
        default:
            return `${n}-szög`;
    }
}

/**
 * If freehand ink looks like a line / circle / ellipse / rectangle / polygon,
 * return a cleaned geometric stroke. Otherwise return the original.
 */
export function correctInkStroke(stroke: WbStroke): WbStroke {
    if (stroke.tool !== 'pen' && stroke.tool !== 'highlighter') {
        return snapShapeTool(stroke);
    }

    const pts = stroke.points;
    if (pts.length < 10) return stroke;

    const box = bbox(pts);
    const size = Math.max(box.w, box.h);
    if (size < 28) return stroke;

    const closed = dist(pts[0], pts[pts.length - 1]) < size * 0.22;
    const len = pathLength(pts);

    // --- Line ---
    const lineScore = scoreLine(pts);
    if (!closed && lineScore.ok && lineScore.score > 0.86) {
        return {
            ...stroke,
            tool: 'line',
            points: [lineScore.a, lineScore.b],
            x: undefined,
            y: undefined,
            w: undefined,
            h: undefined,
        };
    }

    // --- Polygon (triangle … n-gon) before circle, so hex/pent aren't swallowed ---
    if (closed || len > size * 2.2) {
        const corners = detectCorners(pts);
        if (corners.length >= 3 && corners.length <= 12) {
            const polyScore = polygonFitScore(pts, corners);
            if (polyScore > 0.62) {
                // Axis-aligned rectangle stays a rect
                if (corners.length === 4 && isNearlyRect(corners)) {
                    const b = bbox(corners);
                    return {
                        ...stroke,
                        tool: 'rect',
                        points: [],
                        x: b.minX,
                        y: b.minY,
                        w: b.w,
                        h: b.h,
                    };
                }

                // Trapéz: exactly one pair of parallel sides → clean snap
                if (corners.length === 4 && detectTrapezoidPair(corners) !== null) {
                    return {
                        ...stroke,
                        tool: 'polygon',
                        points: makeTrapezoid(corners),
                        x: undefined,
                        y: undefined,
                        w: undefined,
                        h: undefined,
                    };
                }

                const verts =
                    regularityScore(corners) > 0.72 ? makeRegularPolygon(corners) : corners;

                return {
                    ...stroke,
                    tool: 'polygon',
                    points: verts,
                    x: undefined,
                    y: undefined,
                    w: undefined,
                    h: undefined,
                };
            }
        }
    }

    // --- Circle / ellipse ---
    if (closed || len > size * 2.2) {
        const circ = scoreCircle(pts);
        if (circ.ok && circ.score > 0.78) {
            const r = circ.r;
            return {
                ...stroke,
                tool: 'ellipse',
                points: [],
                x: circ.cx - r,
                y: circ.cy - r,
                w: r * 2,
                h: r * 2,
            };
        }
        const ell = scoreEllipse(pts, box);
        if (ell.ok && ell.score > 0.74) {
            return {
                ...stroke,
                tool: 'ellipse',
                points: [],
                x: ell.x,
                y: ell.y,
                w: ell.w,
                h: ell.h,
            };
        }
    }

    // --- Rectangle fallback ---
    if (closed || len > size * 2.4) {
        const rect = scoreRect(pts, box);
        if (rect.ok && rect.score > 0.72) {
            return {
                ...stroke,
                tool: 'rect',
                points: [],
                x: rect.x,
                y: rect.y,
                w: rect.w,
                h: rect.h,
            };
        }
    }

    return stroke;
}

/** Light cleanup for intentional shape tools (near-circle → circle, etc.). */
function snapShapeTool(stroke: WbStroke): WbStroke {
    if (stroke.tool === 'ellipse') {
        const w = Math.abs(stroke.w || 0);
        const h = Math.abs(stroke.h || 0);
        if (w < 8 || h < 8) return stroke;
        const ratio = Math.min(w, h) / Math.max(w, h);
        if (ratio > 0.82) {
            const side = (w + h) / 2;
            const cx = (stroke.x || 0) + (stroke.w || 0) / 2;
            const cy = (stroke.y || 0) + (stroke.h || 0) / 2;
            return {
                ...stroke,
                x: cx - side / 2,
                y: cy - side / 2,
                w: side,
                h: side,
            };
        }
    }
    if (stroke.tool === 'rect') {
        const w = Math.abs(stroke.w || 0);
        const h = Math.abs(stroke.h || 0);
        if (w < 8 || h < 8) return stroke;
        const ratio = Math.min(w, h) / Math.max(w, h);
        if (ratio > 0.88) {
            const side = (w + h) / 2;
            const cx = (stroke.x || 0) + (stroke.w || 0) / 2;
            const cy = (stroke.y || 0) + (stroke.h || 0) / 2;
            return {
                ...stroke,
                x: cx - side / 2,
                y: cy - side / 2,
                w: side * Math.sign(stroke.w || 1) || side,
                h: side * Math.sign(stroke.h || 1) || side,
            };
        }
    }
    return stroke;
}

function scoreLine(pts: WbPoint[]): { ok: boolean; score: number; a: WbPoint; b: WbPoint } {
    const a = pts[0];
    const b = pts[pts.length - 1];
    const span = dist(a, b);
    if (span < 36) return { ok: false, score: 0, a, b };

    let maxDev = 0;
    let sumDev = 0;
    for (const p of pts) {
        const d = pointLineDistance(p, a, b);
        maxDev = Math.max(maxDev, d);
        sumDev += d;
    }
    const avgDev = sumDev / pts.length;
    const score = Math.max(0, 1 - (avgDev * 2.2 + maxDev) / span);
    const pathLen = pathLength(pts);
    if (pathLen > span * 1.55) return { ok: false, score: 0, a, b };
    return { ok: score > 0.8, score, a, b };
}

function pointLineDistance(p: WbPoint, a: WbPoint, b: WbPoint): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const L2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L2));
    const proj = { x: a.x + t * dx, y: a.y + t * dy };
    return dist(p, proj);
}

function scoreCircle(pts: WbPoint[]): { ok: boolean; score: number; cx: number; cy: number; r: number } {
    const c = centroid(pts);
    const radii = pts.map((p) => dist(p, c));
    const r = radii.reduce((a, b) => a + b, 0) / radii.length;
    if (r < 18) return { ok: false, score: 0, cx: c.x, cy: c.y, r: 0 };

    let varSum = 0;
    for (const ri of radii) varSum += (ri - r) ** 2;
    const std = Math.sqrt(varSum / radii.length);
    const roundness = Math.max(0, 1 - std / r);

    const box = bbox(pts);
    const aspect = Math.min(box.w, box.h) / Math.max(box.w, box.h || 1);
    const closed = dist(pts[0], pts[pts.length - 1]) < r * 0.45;
    const score = roundness * 0.7 + aspect * 0.2 + (closed ? 0.15 : 0);

    return { ok: score > 0.75 && aspect > 0.72, score, cx: c.x, cy: c.y, r };
}

function scoreEllipse(
    pts: WbPoint[],
    box: ReturnType<typeof bbox>
): { ok: boolean; score: number; x: number; y: number; w: number; h: number } {
    if (box.w < 28 || box.h < 28) return { ok: false, score: 0, x: 0, y: 0, w: 0, h: 0 };
    const cx = (box.minX + box.maxX) / 2;
    const cy = (box.minY + box.maxY) / 2;
    const rx = box.w / 2 || 1;
    const ry = box.h / 2 || 1;

    let err = 0;
    for (const p of pts) {
        const nx = (p.x - cx) / rx;
        const ny = (p.y - cy) / ry;
        const v = Math.abs(nx * nx + ny * ny - 1);
        err += v;
    }
    err /= pts.length;
    const closed = dist(pts[0], pts[pts.length - 1]) < Math.max(rx, ry) * 0.4;
    const score = Math.max(0, 1 - err * 1.4) * (closed ? 1 : 0.85);
    return {
        ok: score > 0.7,
        score,
        x: box.minX,
        y: box.minY,
        w: box.w,
        h: box.h,
    };
}

function scoreRect(
    pts: WbPoint[],
    box: ReturnType<typeof bbox>
): { ok: boolean; score: number; x: number; y: number; w: number; h: number } {
    if (box.w < 28 || box.h < 28) return { ok: false, score: 0, x: 0, y: 0, w: 0, h: 0 };

    const tol = Math.max(6, Math.min(box.w, box.h) * 0.08);
    let near = 0;
    for (const p of pts) {
        const dl = Math.abs(p.x - box.minX);
        const dr = Math.abs(p.x - box.maxX);
        const dt = Math.abs(p.y - box.minY);
        const db = Math.abs(p.y - box.maxY);
        const onVertical = Math.min(dl, dr) <= tol && p.y >= box.minY - tol && p.y <= box.maxY + tol;
        const onHorizontal = Math.min(dt, db) <= tol && p.x >= box.minX - tol && p.x <= box.maxX + tol;
        if (onVertical || onHorizontal) near++;
    }
    const borderRatio = near / pts.length;
    const closed = dist(pts[0], pts[pts.length - 1]) < Math.max(box.w, box.h) * 0.25;
    const perimeter = 2 * (box.w + box.h);
    const len = pathLength(pts);
    const lengthFit = 1 - Math.min(1, Math.abs(len - perimeter) / perimeter);

    const score = borderRatio * 0.55 + lengthFit * 0.25 + (closed ? 0.2 : 0);
    return {
        ok: score > 0.68 && borderRatio > 0.55,
        score,
        x: box.minX,
        y: box.minY,
        w: box.w,
        h: box.h,
    };
}
