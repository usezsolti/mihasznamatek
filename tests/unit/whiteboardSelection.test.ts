import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hitTestStroke, hitTestTop, resizeImageStroke, translateStroke } from '../../utils/whiteboardSelection';
import type { WbStroke } from '../../utils/whiteboardTypes';

function stroke(partial: Partial<WbStroke> & Pick<WbStroke, 'tool'>): WbStroke {
    return {
        id: partial.id || 't',
        color: '#fff',
        width: 4,
        points: [],
        authorId: 'a',
        authorName: 'A',
        createdAtMs: 1,
        ...partial,
    };
}

describe('whiteboard selection', () => {
    it('hits a pen stroke near the line and misses far away', () => {
        const pen = stroke({
            tool: 'pen',
            points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
            ],
        });
        assert.equal(hitTestStroke(pen, { x: 50, y: 2 }), true);
        assert.equal(hitTestStroke(pen, { x: 50, y: 40 }), false);
    });

    it('does not select an eraser stroke', () => {
        const eraser = stroke({
            tool: 'eraser',
            width: 20,
            points: [
                { x: 0, y: 0 },
                { x: 80, y: 0 },
            ],
        });
        assert.equal(hitTestStroke(eraser, { x: 40, y: 0 }), false);
    });

    it('picks the topmost stroke', () => {
        const lower = stroke({
            id: 'lower',
            tool: 'rect',
            x: 0,
            y: 0,
            w: 100,
            h: 80,
        });
        const upper = stroke({
            id: 'upper',
            tool: 'rect',
            x: 10,
            y: 10,
            w: 40,
            h: 40,
        });
        const hit = hitTestTop([lower, upper], { x: 20, y: 20 });
        assert.equal(hit?.id, 'upper');
    });

    it('translates points and the shape origin', () => {
        const moved = translateStroke(
            stroke({
                tool: 'rect',
                x: 10,
                y: 20,
                w: 30,
                h: 40,
                points: [{ x: 1, y: 2 }],
            }),
            5,
            -3
        );
        assert.equal(moved.x, 15);
        assert.equal(moved.y, 17);
        assert.equal(moved.w, 30);
        assert.equal(moved.points[0].x, 6);
        assert.equal(moved.points[0].y, -1);
    });

    it('resizes an image from the corner and keeps the aspect', () => {
        const next = resizeImageStroke(
            stroke({ tool: 'image', x: 0, y: 0, w: 100, h: 50, src: 'x' }),
            { x: 200, y: 0 }
        );
        assert.equal(next.w, 200);
        assert.equal(next.h, 100);
        assert.equal(next.x, 0);
    });
});
