import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { WbStroke } from '../../utils/whiteboardTypes';
import { expressionWithResult, textForBoard } from '../../utils/whiteboardEquals';

function textStroke(text: string, x: number, y: number): WbStroke {
    return {
        id: `s_${x}`,
        tool: 'text',
        color: '#fff',
        width: 4,
        points: [],
        x,
        y,
        text,
        authorId: 'u',
        authorName: 'n',
        createdAtMs: 1,
    };
}

describe('whiteboard equals', () => {
    it('writes the result after a trailing equals sign', () => {
        assert.equal(expressionWithResult('2+3='), '2+3 = 5');
        assert.equal(expressionWithResult('sqrt(9)='), 'sqrt(9) = 3');
        assert.equal(expressionWithResult('1/2='), '1/2 = 0,5');
        assert.equal(expressionWithResult('  2^10 = '), '2^10 = 1024');
    });

    it('leaves a non-calculation unchanged', () => {
        assert.equal(expressionWithResult('x+1='), null);
        assert.equal(expressionWithResult('2+3'), null);
        assert.equal(expressionWithResult('='), null);
    });

    it('fills a lone equals sign from the expression on its left', () => {
        const strokes = [textStroke('12*4', 0, 0)];
        assert.equal(textForBoard('=', strokes, { x: 80, y: 10 }), '= 48');
        assert.equal(textForBoard('=', strokes, { x: 400, y: 10 }), '=');
        assert.equal(textForBoard('x+1=', strokes, { x: 80, y: 10 }), 'x+1=');
    });
});
