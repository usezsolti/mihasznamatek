import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { studentSetMatches } from '../../utils/parseStudentSet';
import { studentTextMatches } from '../../utils/studentTextAnswer';
import { getZhPaperById, getZhPaperQuestions } from '../../utils/game/zhPapers';

describe('Analízis I. minta-ZH B változat', () => {
    const list = getZhPaperQuestions('zh-a1-minta-b') || [];
    const byId = (id: string) => list.find((q) => q.id === id);

    it('asks for the written answers from the key', () => {
        const meta = getZhPaperById('zh-a1-minta-b');
        assert.equal(meta?.points, 50);
        assert.equal(list.length, 10);
        assert.ok(list.every((q) => q.expression.length > 40));
        const regions = byId('zh-a1-b-1');
        assert.equal(studentSetMatches('AC; ABC; B', regions?.expectedSet || []), true);
        assert.equal(byId('zh-a1-b-2b')?.answer, -8);
    });

    it('accepts a typed domain, formula and infinity', () => {
        const domain = byId('zh-a1-b-3')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('(-2, -1) ∪ (-1, 4]', domain), true);
        assert.equal(studentTextMatches(']-2,-1[ U ]-1,4]', domain), true);
        assert.equal(studentTextMatches('D_f = (-2;-1) U (-1;4]', domain), true);
        assert.equal(studentTextMatches('(-2,-1) U (-1,4)', domain), false);

        const comp = byId('zh-a1-b-4')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('cos(2-√(x-3))', comp), true);
        assert.equal(studentTextMatches('f(g(x)) = cos(2-sqrt(x-3))', comp), true);

        const compDomain = byId('zh-a1-b-4b')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('[3, +∞)', compDomain), true);
        assert.equal(studentTextMatches('[3, végtelen[', compDomain), true);

        const inverse = byId('zh-a1-b-5')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('(3/x)-2', inverse), true);
        assert.equal(studentTextMatches('\\frac{3}{x}-2', inverse), true);

        const inverseDomain = byId('zh-a1-b-5b')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('R \\ {0}', inverseDomain), true);
        assert.equal(studentTextMatches('(-∞, 0) ∪ (0, +∞)', inverseDomain), true);

        const limit = byId('zh-a1-b-6')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('+∞', limit), true);
        assert.equal(studentTextMatches('végtelen', limit), true);
        assert.equal(studentTextMatches('-∞', limit), false);

        const simplified = byId('zh-a1-b-6b')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('x − 3', simplified), true);

        const mono = byId('zh-a1-b-2')?.acceptedAnswers || [];
        assert.equal(studentTextMatches('szigorúan monoton csökkenő', mono), true);
        assert.equal(studentTextMatches('szigorúan növő', mono), false);
    });
});
