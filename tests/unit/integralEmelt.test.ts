import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { antiderivativeMatches, evalMathExpr } from '../../utils/gradeAntiderivative';
import { getIntegralEmeltQuestions } from '../../utils/game/integralEmeltLevels';
import { getWorksheetListForTopic } from '../../utils/game/worksheetLists';
import { findCatalogTopic } from '../../utils/topicStats';
import { isWorksheetTopicId } from '../../utils/topicPath';

describe('emelt integrálás', () => {
    const list = getIntegralEmeltQuestions();

    it('has six levels of twenty cards from the sheet', () => {
        assert.equal(list.length, 120);
        for (const stage of [1, 2, 3, 4, 5, 6]) {
            assert.equal(list.filter((q) => q.stage === stage).length, 20, `stage ${stage}`);
        }
        const short = list.filter((q) => (q.expression || '').length <= 20).map((q) => q.expression);
        assert.deepEqual(short, []);
    });

    it('accepts the official primitive, a constant shift, and +C', () => {
        const primitives = list.filter((q) => q.integrand);
        assert.equal(primitives.length, 92);
        const failed = primitives.filter((q) =>
            !antiderivativeMatches(q.displayAnswer || '', q.integrand || '', q.integrandSamples || [])
        );
        assert.equal(failed.map((q) => q.question).join('\n'), '');
        const first = primitives[0];
        assert.equal(antiderivativeMatches('5*x+7', first.integrand || '', first.integrandSamples || []), true);
        assert.equal(antiderivativeMatches('5x', first.integrand || '', first.integrandSamples || []), true);
        assert.equal(antiderivativeMatches('x', first.integrand || '', first.integrandSamples || []), false);
        const tan = primitives.find((q) => q.question.includes('1/cos²'));
        assert.equal(antiderivativeMatches('tan(x)+C', tan?.integrand || '', tan?.integrandSamples || []), true);
        assert.equal(antiderivativeMatches('tg(x)', tan?.integrand || '', tan?.integrandSamples || []), true);
    });

    it('grades the definite values from the answer key', () => {
        const byText = (part: string) => list.find((q) => q.gradeAsExpr && q.question.includes(part));
        const close = (part: string, value: number) => {
            const q = byText(part);
            assert.ok(q, part);
            assert.ok(Math.abs((q?.answer ?? NaN) - value) < 1e-9, `${part} stored ${q?.answer}`);
            assert.equal(q?.gradeAsExpr, true);
            const typed = evalMathExpr(q?.displayAnswer || '');
            assert.ok(Math.abs(typed - value) < 1e-8, `${part} typed ${typed}`);
        };
        close('0-tól 2-ig', 6);
        close('1-től e-ig ∫ 1/x', 1);
        close('0-tól π-ig ∫ sin(x)', 2);
        close('0-tól π/4-ig', 0.5);
        close('0-tól ln(2)-ig', 1.5);
        close('0-tól 1-ig ∫ 1/(x² + 1)', Math.PI / 4);
        close('2x(x² + 1)³', 15 / 4);
        close('0-tól √3-ig', 7 / 3);
        close('sin(x) cos(x)', 0.5);
        close('x/(x² + 1) dx', Math.log(2) / 2);
        close('x eˣ dx', 1);
        close('1-től e-ig ∫ ln(x)', 1);
        close('x ln(x) dx', (1 + Math.exp(2)) / 4);
        close('x cos(x)', Math.PI / 2 - 1);
        close('x² eˣ dx', Math.E - 2);
        close('e-től e²-ig', Math.log(2));
        close('sin(x) + 2', Math.log(1.5));
        close('(x² + 1)²', 0.25);
        close('sin²(x)', Math.PI / 2);
        close('eˣ sin(x)', (1 + Math.exp(Math.PI)) / 2);
        close('x ln(x² + 1)', Math.log(2) - 0.5);
        close('x²/(x² + 1)', 1 - Math.PI / 4);
        close('x sin(x)', 1);
        close('(ln(x))²/x', 1 / 3);
        close('x³/(x² + 1)', 0.5 - Math.log(2) / 2);
        close('arctg(x) dx', Math.PI / 4 - Math.log(2) / 2);
        close('sin³(x)', 2 / 3);
        close('x² ln(x + 1)', -5 / 18 + (2 / 3) * Math.log(2));
    });

    it('is its own emelt category', () => {
        assert.equal(isWorksheetTopicId('integralszamitas-emelt'), true);
        const path = getWorksheetListForTopic('integralszamitas-emelt');
        assert.equal(path?.prefix, 'erettsegi_integral');
        assert.equal(path?.list.length, 120);
        assert.equal(findCatalogTopic('integralszamitas-emelt', 'erettsegi')?.title, 'Integrálás');
        assert.notEqual(getWorksheetListForTopic('differencialszamitas-emelt')?.prefix, 'erettsegi_integral');
    });
});
