import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildStamp, WHITEBOARD_STAMPS } from '../../utils/whiteboardStamps';

const author = { authorId: 'u', authorName: 'Teszt' };

describe('whiteboard stamps', () => {
    it('builds a coordinate system with axis labels', () => {
        const strokes = buildStamp('axes', { x: 0, y: 0 }, author);
        assert.ok(strokes.length > 8);
        assert.ok(strokes.some((stroke) => stroke.text === 'x'));
        assert.ok(strokes.some((stroke) => stroke.text === 'y'));
        assert.ok(strokes.some((stroke) => stroke.text === 'O'));
        assert.equal(new Set(strokes.map((stroke) => stroke.id)).size, strokes.length);
        assert.ok(strokes.every((stroke) => stroke.color === '#f4f6fb'));
    });

    it('builds the other five figures', () => {
        for (const stamp of WHITEBOARD_STAMPS) {
            const strokes = buildStamp(stamp.id, { x: 40, y: -20 }, author);
            assert.ok(strokes.length >= 3, stamp.id);
        }
        const circle = buildStamp('circle', { x: 0, y: 0 }, author);
        assert.ok(circle.some((stroke) => stroke.tool === 'ellipse'));
        assert.ok(circle.some((stroke) => stroke.text === 'r'));
        const unit = buildStamp('unitcircle', { x: 0, y: 0 }, author);
        assert.ok(unit.some((stroke) => stroke.text === 'π/2'));
        const right = buildStamp('righttriangle', { x: 0, y: 0 }, author);
        assert.ok(right.filter((stroke) => stroke.tool === 'line').length >= 2);
    });
});
