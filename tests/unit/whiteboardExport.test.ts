import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    EXPORT_MAX_PX,
    exportContainsWorldPoint,
    planWhiteboardExport,
    strokeInkBounds,
    unionStrokeBounds,
} from '../../utils/whiteboardExport';
import type { WbStroke } from '../../utils/whiteboardTypes';

function stroke(partial: Partial<WbStroke> & Pick<WbStroke, 'tool'>): WbStroke {
    return {
        id: 't',
        color: '#fff',
        width: 4,
        points: [],
        authorId: 'a',
        authorName: 'A',
        createdAtMs: 1,
        ...partial,
    };
}

describe('whiteboard export bounds', () => {
    it('covers both corners of a rect drawn backwards', () => {
        const b = strokeInkBounds(
            stroke({
                tool: 'rect',
                x: 200,
                y: 180,
                w: -120,
                h: -90,
            })
        );
        assert.ok(b.minX <= 80);
        assert.ok(b.minY <= 90);
        assert.ok(b.maxX >= 200);
        assert.ok(b.maxY >= 180);
    });

    it('uses measured text width instead of a fixed 80px pad', () => {
        const b = strokeInkBounds(
            stroke({
                tool: 'text',
                x: 10,
                y: 20,
                width: 4,
                text: 'Hosszú felirat a táblára ami kilógna',
            }),
            (text, fontPx) => text.length * fontPx
        );
        assert.ok(b.maxX - b.minX > 200);
    });

    it('unions far-apart strokes', () => {
        const bounds = unionStrokeBounds([
            stroke({ tool: 'pen', points: [{ x: 0, y: 0 }] }),
            stroke({ tool: 'pen', points: [{ x: 2400, y: 900 }] }),
        ]);
        assert.ok(bounds);
        assert.ok(bounds.maxX >= 2400);
        assert.ok(bounds.maxY >= 900);
    });
});

describe('whiteboard export scale', () => {
    it('scales a wide drawing instead of clipping at 4096px', () => {
        const bounds = unionStrokeBounds([
            stroke({ tool: 'pen', points: [{ x: 0, y: 0 }, { x: 8000, y: 40 }] }),
        ]);
        const plan = planWhiteboardExport(bounds, { width: 800, height: 600 });
        assert.ok(plan.width <= EXPORT_MAX_PX);
        assert.ok(plan.height <= EXPORT_MAX_PX);
        assert.ok(plan.scale < 1);
        assert.equal(exportContainsWorldPoint(plan, 0, 0), true);
        assert.equal(exportContainsWorldPoint(plan, 8000, 40), true);
    });

    it('keeps small drawings at 1:1', () => {
        const bounds = unionStrokeBounds([
            stroke({ tool: 'pen', points: [{ x: 10, y: 10 }, { x: 80, y: 40 }] }),
        ]);
        const plan = planWhiteboardExport(bounds, { width: 800, height: 600 });
        assert.equal(plan.scale, 1);
        assert.equal(exportContainsWorldPoint(plan, 10, 10), true);
        assert.equal(exportContainsWorldPoint(plan, 80, 40), true);
    });

    it('empty board uses the viewport fallback without shrinking below min size', () => {
        const plan = planWhiteboardExport(null, { width: 400, height: 300 });
        assert.ok(plan.width >= 640);
        assert.ok(plan.height >= 480);
        assert.equal(plan.scale, 1);
    });
});
