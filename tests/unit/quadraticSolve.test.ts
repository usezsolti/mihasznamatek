import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { solveQuadratic, solveQuadraticInputs } from '../../utils/quadraticSolve';

describe('quadraticSolve', () => {
    it('solves two real roots with the plus branch first', () => {
        const solved = solveQuadratic(1, -5, 6);
        assert.equal(solved.ok, true);
        if (!solved.ok) return;
        assert.deepEqual(solved.lines, ['x² − 5x + 6 = 0', 'D = 1', 'x₁ = 3', 'x₂ = 2']);
        assert.equal(solved.board, 'x² − 5x + 6 = 0 | D = 1 | x₁ = 3 | x₂ = 2');
    });

    it('marks a zero discriminant as a double root', () => {
        const solved = solveQuadratic(1, -2, 1);
        assert.equal(solved.ok, true);
        if (!solved.ok) return;
        assert.equal(solved.lines[2], 'x = 1 (kétszeres gyök)');
    });

    it('shows a complex pair when there is no real root', () => {
        const plain = solveQuadratic(1, 0, 1);
        const shifted = solveQuadratic(1, 2, 5);
        assert.equal(plain.ok && plain.board, 'x² + 1 = 0 | D = −4 | nincs valós gyök, x = ±i');
        assert.equal(shifted.ok && shifted.lines[3], 'x = −1 ± 2i');
    });

    it('falls back to a linear equation when a is zero', () => {
        const solved = solveQuadratic(0, 2, -4);
        assert.equal(solved.ok, true);
        if (!solved.ok) return;
        assert.equal(solved.lines[0], 'Ez elsőfokú, mert a = 0.');
        assert.equal(solved.lines[2], 'x = 2');
    });

    it('accepts expressions and a decimal comma in the inputs', () => {
        const solved = solveQuadraticInputs('1/2', '0', '-2');
        const comma = solveQuadraticInputs('1', '-1,5', '0,5');
        assert.equal(solved.ok, true);
        if (solved.ok) assert.match(solved.board, /x₁ = 2/);
        assert.equal(comma.ok, true);
        if (comma.ok) assert.match(comma.board, /x₁ = 1 \| x₂ = 0,5/);
    });

    it('stays quiet until every coefficient is filled', () => {
        assert.deepEqual(solveQuadraticInputs('1', '', '1'), { ok: false, error: '' });
        assert.equal(solveQuadraticInputs('1', 'alma', '1').ok, false);
    });
});
