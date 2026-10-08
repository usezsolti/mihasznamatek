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

    it('evaluates trig in degrees and radians, including tg', () => {
        assert.ok(Math.abs(evaluateScientific('sin(90)', 'deg') - 1) < 1e-9);
        assert.ok(Math.abs(evaluateScientific('sin(pi/2)', 'rad') - 1) < 1e-9);
        assert.ok(Math.abs(evaluateScientific('tg(45)', 'deg') - 1) < 1e-9);
        assert.ok(Math.abs(evaluateScientific('ctg(45)', 'deg') - 1) < 1e-9);
        assert.ok(Math.abs(evaluateScientific('acot(1)', 'deg') - 45) < 1e-8);
    });

    it('evaluates combinations and permutations', () => {
        assert.equal(evaluateScientific('ncr(5,2)'), 10);
        assert.equal(evaluateScientific('npr(5,2)'), 20);
        assert.equal(evaluateScientific('ncr(5,0)'), 1);
        assert.throws(() => evaluateScientific('ncr(5,6)'), ScientificEvalError);
        assert.throws(() => evaluateScientific('npr(4,2.5)'), ScientificEvalError);
    });

    it('rejects a broken expression', () => {
        assert.throws(() => evaluateScientific('sin('), ScientificEvalError);
        assert.throws(() => evaluateScientific('1/0'), ScientificEvalError);
    });
});
