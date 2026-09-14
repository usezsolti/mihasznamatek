import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { correctInkStroke } from '../../utils/whiteboardInkToShape';
import type { WbPoint, WbStroke } from '../../utils/whiteboardTypes';

function pen(points: WbPoint[]): WbStroke {
    return {
        id: 't',
        tool: 'pen',
        color: '#000',
        width: 3,
        points,
        authorId: 'a',
        authorName: 'A',
        createdAtMs: 1,
    };
}

function line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    n: number,
    wobble = 0
): WbPoint[] {
    const pts: WbPoint[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const wob = wobble * Math.sin(i * 1.7);
        const nx = y1 - y0;
        const ny = x0 - x1;
        const nl = Math.hypot(nx, ny) || 1;
        pts.push({
            x: x0 + (x1 - x0) * t + (nx / nl) * wob,
            y: y0 + (y1 - y0) * t + (ny / nl) * wob,
        });
    }
    return pts;
}

function closedPoly(verts: WbPoint[], perSide = 18, wobble = 0): WbPoint[] {
    const pts: WbPoint[] = [];
    for (let s = 0; s < verts.length; s++) {
        const a = verts[s];
        const b = verts[(s + 1) % verts.length];
        pts.push(...line(a.x, a.y, b.x, b.y, perSide, wobble).slice(s === 0 ? 0 : 1));
    }
    return pts;
}

function circle(cx: number, cy: number, r: number, n = 48, extra = 0): WbPoint[] {
    const pts: WbPoint[] = [];
    const total = n + extra;
    for (let i = 0; i <= total; i++) {
        const a = (i / n) * Math.PI * 2;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
    return pts;
}

function wobblyCircle(cx: number, cy: number, r: number, n = 56): WbPoint[] {
    const pts: WbPoint[] = [];
    for (let i = 0; i <= n + 8; i++) {
        const a = (i / n) * Math.PI * 2;
        const rr = r * (1 + 0.08 * Math.sin(i * 1.3) + 0.04 * Math.sin(i * 2.1));
        pts.push({ x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) });
    }
    return pts;
}

function figureEight(cx: number, cy: number, r: number): WbPoint[] {
    const top = circle(cx, cy - r, r, 36);
    const bottom = circle(cx, cy + r, r, 36).slice(1);
    return [...top, ...bottom];
}

/** Degrees away from 90° at the vertex closest to a right angle. */
function triangleRightness(pts: WbPoint[]): number {
    let best = 180;
    for (let i = 0; i < 3; i++) {
        const b = pts[i];
        const a = pts[(i + 2) % 3];
        const c = pts[(i + 1) % 3];
        const v1x = a.x - b.x;
        const v1y = a.y - b.y;
        const v2x = c.x - b.x;
        const v2y = c.y - b.y;
        const n1 = Math.hypot(v1x, v1y) || 1;
        const n2 = Math.hypot(v2x, v2y) || 1;
        const dot = Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / (n1 * n2)));
        const deg = (Math.acos(dot) * 180) / Math.PI;
        best = Math.min(best, Math.abs(deg - 90));
    }
    return best;
}

describe('whiteboardInkToShape', () => {
    it('turns a slightly wobbly square into a rectangle, not an n-gon', () => {
        const pts = closedPoly(
            [
                { x: 40, y: 40 },
                { x: 160, y: 40 },
                { x: 160, y: 160 },
                { x: 40, y: 160 },
            ],
            22,
            5
        );
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'rect');
        assert.ok(Math.abs((out.w || 0) - (out.h || 0)) < 20);
    });

    it('keeps a handwritten 8 as ink instead of a square or polygon', () => {
        const out = correctInkStroke(pen(figureEight(120, 120, 36)));
        assert.equal(out.tool, 'pen');
        assert.ok(out.points.length > 10);
    });

    it('does not turn a scribbled 3-like stroke into a polygon', () => {
        const pts: WbPoint[] = [];
        for (let i = 0; i <= 30; i++) {
            const t = i / 30;
            pts.push({
                x: 80 + 40 * Math.sin(t * Math.PI),
                y: 60 + t * 40,
            });
        }
        for (let i = 1; i <= 30; i++) {
            const t = i / 30;
            pts.push({
                x: 80 + 40 * Math.sin(t * Math.PI),
                y: 100 + t * 40,
            });
        }
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'pen');
    });

    it('recognizes a clean triangle', () => {
        const pts = closedPoly(
            [
                { x: 80, y: 40 },
                { x: 180, y: 160 },
                { x: 40, y: 160 },
            ],
            20,
            1
        );
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'polygon');
        assert.equal(out.points.length, 3);
    });

    it('keeps a wobbly right triangle as a triangle, not a circle', () => {
        const pts = closedPoly(
            [
                { x: 40, y: 160 },
                { x: 40, y: 40 },
                { x: 160, y: 40 },
            ],
            22,
            6
        );
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'polygon');
        assert.equal(out.points.length, 3);
        const ang = triangleRightness(out.points);
        assert.ok(ang < 18, `right angle drifted to ${ang.toFixed(1)}° from 90`);
    });

    it('keeps a 3-4-5 right triangle as a triangle, not a circle', () => {
        const pts = closedPoly(
            [
                { x: 40, y: 160 },
                { x: 40, y: 40 },
                { x: 200, y: 160 },
            ],
            22,
            7
        );
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'polygon');
        assert.equal(out.points.length, 3);
        assert.ok(triangleRightness(out.points) < 18);
    });

    it('does not turn a right triangle into an equilateral one', () => {
        const pts = closedPoly(
            [
                { x: 50, y: 180 },
                { x: 50, y: 50 },
                { x: 220, y: 180 },
            ],
            20,
            4
        );
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'polygon');
        const sides = [0, 1, 2].map((i) => {
            const a = out.points[i];
            const b = out.points[(i + 1) % 3];
            return Math.hypot(a.x - b.x, a.y - b.y);
        });
        const min = Math.min(...sides);
        const max = Math.max(...sides);
        assert.ok(max / min > 1.25, 'legs and hypotenuse should stay different');
    });

    it('recognizes a wobbly circle that overlaps its start', () => {
        const out = correctInkStroke(pen(wobblyCircle(140, 140, 52)));
        assert.equal(out.tool, 'ellipse');
        const ratio = Math.min(out.w || 0, out.h || 0) / Math.max(out.w || 1, out.h || 1);
        assert.ok(ratio > 0.8);
    });

    it('recognizes a circle that is not fully closed', () => {
        const pts = circle(140, 140, 50, 48).slice(0, 40);
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'ellipse');
    });

    it('recognizes a rectangle that is not a square', () => {
        const pts = closedPoly(
            [
                { x: 40, y: 50 },
                { x: 220, y: 50 },
                { x: 220, y: 140 },
                { x: 40, y: 140 },
            ],
            20,
            4
        );
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'rect');
        assert.ok((out.w || 0) > (out.h || 0) * 1.3);
    });

    it('recognizes a rectangle with a small gap at the close', () => {
        const pts = closedPoly(
            [
                { x: 40, y: 40 },
                { x: 200, y: 40 },
                { x: 200, y: 130 },
                { x: 40, y: 130 },
            ],
            18,
            3
        ).slice(0, -8);
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'rect');
    });

    it('recognizes a shakier elongated rectangle, not a triangle or freehand', () => {
        const pts = closedPoly(
            [
                { x: 40, y: 50 },
                { x: 240, y: 50 },
                { x: 240, y: 130 },
                { x: 40, y: 130 },
            ],
            28,
            11
        );
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'rect');
        assert.ok((out.w || 0) > (out.h || 0) * 1.4);
    });

    it('recognizes a rectangle with one rounded corner', () => {
        const pts: WbPoint[] = [];
        pts.push(...line(40, 50, 220, 50, 20, 3).slice(0, -1));
        pts.push(...line(220, 50, 220, 140, 18, 3).slice(0, -1));
        pts.push(...line(220, 140, 40, 140, 20, 3).slice(0, -1));
        for (let i = 1; i <= 12; i++) {
            const a = Math.PI / 2 + (i / 12) * (Math.PI / 2);
            pts.push({ x: 40 + 22 * Math.cos(a), y: 50 - 22 * Math.sin(a) + 22 });
        }
        const out = correctInkStroke(pen(pts));
        assert.equal(out.tool, 'rect');
    });
});
