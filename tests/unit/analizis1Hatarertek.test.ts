import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getAnalizis1PracticeQuestions } from '../../utils/game/analizis1Levels';

describe('analízis 1 határérték feladatsor', () => {
    const list = getAnalizis1PracticeQuestions('a1-hatarertek') || [];

    it('has six levels of twenty worked problems', () => {
        assert.equal(list.length, 120);
        for (const stage of [1, 2, 3, 4, 5, 6]) {
            const level = list.filter((q) => q.stage === stage);
            assert.equal(level.length, 20);
            assert.ok(level.every((q) => q.expression.length > 20));
        }
    });

    it('covers sequences, bounds, thresholds and function limits', () => {
        const text = list.map((q) => q.question).join('\n');
        assert.match(text, /n→∞/);
        assert.match(text, /korlátos/);
        assert.match(text, /küszöbindex/);
        assert.match(text, /x→/);
        assert.match(text, /legnagyobb δ/);
        const threshold = list.find((q) => q.question.includes('ε = 0,1') && q.question.startsWith('aₙ = 1/n'));
        assert.equal(threshold?.answer, 10);
        const rationalized = list.find((q) => q.question.includes('√(n²+n)'));
        assert.equal(rationalized?.answer, 0.5);
    });
});
