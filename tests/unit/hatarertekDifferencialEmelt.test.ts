import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getDifferencialEmeltQuestions } from '../../utils/game/differencialEmeltLevels';
import { getHatarertekEmeltQuestions } from '../../utils/game/hatarertekEmeltLevels';
import { getWorksheetListForTopic } from '../../utils/game/worksheetLists';
import { studentTextMatches } from '../../utils/studentTextAnswer';
import { findCatalogTopic } from '../../utils/topicStats';
import { isWorksheetTopicId } from '../../utils/topicPath';

function assertSixByTwenty(list: { stage?: number; expression: string }[]) {
    assert.equal(list.length, 120);
    for (const stage of [1, 2, 3, 4, 5, 6]) {
        assert.equal(list.filter((q) => q.stage === stage).length, 20, `stage ${stage}`);
    }
    assert.ok(list.every((q) => q.expression.length > 20));
}

describe('emelt határérték és differenciálszámítás', () => {
    const limits = getHatarertekEmeltQuestions();
    const derivatives = getDifferencialEmeltQuestions();

    it('has six levels of twenty cards in each bank', () => {
        assertSixByTwenty(limits);
        assertSixByTwenty(derivatives);
    });

    it('matches the sample sheet on limits', () => {
        const byText = (part: string) => limits.find((q) => q.question.includes(part));
        assert.equal(byText('(2n+1)/(n+3)')?.answer, 2);
        assert.equal(byText('−n + √(n²+6n+2)')?.answer, 3);
        assert.ok(Math.abs((byText('(1+2/n)ⁿ')?.answer ?? 0) - Math.exp(2)) < 1e-9);
        assert.equal(byText('(x²−9)/(x−3)')?.answer, 6);
        assert.equal(byText('sin(4x)/x')?.answer, 4);
        assert.equal(byText('Mennyi a?')?.answer, 12);
        const infinite = byText('(n³+1)/(n+2)');
        assert.equal(studentTextMatches('+∞', infinite?.acceptedAnswers || []), true);
        assert.equal(studentTextMatches('−∞', byText('(−3n⁵+2n²)/(n³+1)')?.acceptedAnswers || []), true);
        assert.equal(studentTextMatches('2', infinite?.acceptedAnswers || []), false);
        const none = byText('Létezik-e lim (x→0) |x|/x');
        assert.equal(studentTextMatches('nem létezik', none?.acceptedAnswers || []), true);
    });

    it('matches the sample sheet on derivatives', () => {
        const byText = (part: string) => derivatives.find((q) => q.question.includes(part));
        assert.equal(byText('f(x) = x². Add meg')?.answer, 6);
        assert.equal(byText('x⁵ − 3x³ + 2x − 7. Add meg f\'(1)')?.answer, -2);
        assert.equal(byText('P(1; 2) pontban')?.answer, -0.8);
        assert.equal(byText('Mennyi a lokális maximum értéke')?.answer, 2);
        assert.equal(byText('Mely a-ra differenciálható')?.answer, 2);
        assert.ok(Math.abs((byText('f\'(e) értékét! Beírhatod 1/e')?.answer ?? 0) - 1 / Math.E) < 1e-12);
    });

    it('is its own emelt category, separate from university analysis', () => {
        assert.equal(isWorksheetTopicId('hatarertek-emelt'), true);
        assert.equal(isWorksheetTopicId('differencialszamitas-emelt'), true);
        const limitPath = getWorksheetListForTopic('hatarertek-emelt');
        const derivPath = getWorksheetListForTopic('differencialszamitas-emelt');
        const university = getWorksheetListForTopic('a1-hatarertek');
        assert.equal(limitPath?.prefix, 'erettsegi_hatarertek');
        assert.equal(derivPath?.prefix, 'erettsegi_differencial');
        assert.equal(limitPath?.list.length, 120);
        assert.equal(derivPath?.list.length, 120);
        assert.equal(university?.prefix, 'uni_a1-hatarertek');
        assert.notEqual(university?.list[0]?.question, limitPath?.list[17]?.question);
        assert.equal(findCatalogTopic('hatarertek-emelt', 'erettsegi')?.title, 'Határérték');
        assert.equal(findCatalogTopic('differencialszamitas-emelt', 'erettsegi')?.title, 'Differenciálszámítás');
    });
});
