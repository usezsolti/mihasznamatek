import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { evaluateScientific, ScientificEvalError } from '../../utils/scientificEval';

describe('scientificEval', () => {
    it('evaluates sin(30) in degrees', () => {
        assert.ok(Math.abs(evaluateScientific('sin(30)', 'deg') - 0.5) < 1e-9);
    });

    it('evaluates power and parentheses', () => {
        assert.equal(evaluateScientific('2^3'), 8);
        assert.equal(evaluateScientific('(1+2)*3'), 9);
    });

    it('accepts a decimal comma', () => {
        assert.ok(Math.abs(evaluateScientific('1,5+1,5') - 3) < 1e-9);
    });

    it('evaluates a stacked fraction, root and power', () => {
        assert.ok(Math.abs(evaluateScientific('(3)/(4)') - 0.75) < 1e-9);
        assert.ok(Math.abs(evaluateScientific('sqrt(9)') - 3) < 1e-9);
        assert.ok(Math.abs(evaluateScientific('root(3,8)') - 2) < 1e-9);
        assert.equal(evaluateScientific('(2)^(3)'), 8);
        assert.ok(Math.abs(evaluateScientific('log(2,8)') - 3) < 1e-9);
    });

    it('rejects a broken expression', () => {
        assert.throws(() => evaluateScientific('sin('), ScientificEvalError);
        assert.throws(() => evaluateScientific('1/0'), ScientificEvalError);
    });
});
