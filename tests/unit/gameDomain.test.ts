import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pick, randInt } from '../../utils/game/random';
import {
    generatePointDistanceQuestion,
    generateQuadraticQuestion,
    getParameterPracticeQuestions,
    szigorlatQuestions,
} from '../../utils/game';

describe('game domain', () => {
    it('randInt stays in range', () => {
        for (let i = 0; i < 40; i++) {
            const n = randInt(2, 5);
            assert.ok(n >= 2 && n <= 5);
        }
    });

    it('pick returns list member', () => {
        const list = ['a', 'b', 'c'] as const;
        assert.ok(list.includes(pick([...list])));
    });

    it('generators return question + answer', () => {
        const q = generateQuadraticQuestion();
        assert.ok(q.question);
        assert.equal(typeof q.answer, 'number');
        const d = generatePointDistanceQuestion();
        assert.ok(d.question);
    });

    it('practice banks and szigorlat non-empty', () => {
        assert.ok(getParameterPracticeQuestions().length >= 5);
        assert.ok(szigorlatQuestions.length >= 5);
    });
});
