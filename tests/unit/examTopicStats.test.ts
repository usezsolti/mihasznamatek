import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    aggregateExamTopicGauges,
    buildTopicBreakdown,
} from '../../utils/examTopicStats';
import {
    ERETTSEGI_PAPERS,
    getErettsegiPaperQuestions,
} from '../../utils/game/erettsegiPapers';
import {
    KOZPONTI_PAPERS,
    getKozpontiPaperQuestions,
} from '../../utils/game/kozpontiPapers';
import { isValidPaperTopicId } from '../../utils/game/paperTopicTags';

describe('exam topic tags and gauges', () => {
    it('tags every ready érettségi paper question with a valid catalog topic', () => {
        const ready = ERETTSEGI_PAPERS.filter((p) => p.ready);
        assert.ok(ready.length >= 10, 'expected ready érettségi papers');
        for (const paper of ready) {
            const questions = getErettsegiPaperQuestions(paper.id);
            assert.ok(questions && questions.length > 0, `missing questions: ${paper.id}`);
            for (const q of questions) {
                assert.ok(q.catalogTopicId, `no catalogTopicId: ${paper.id} ${q.id}`);
                assert.ok(
                    isValidPaperTopicId(q.catalogTopicId, paper.level),
                    `invalid topic ${q.catalogTopicId} on ${paper.id} ${q.id}`
                );
            }
        }
    });

    it('tags every ready központi paper question with a valid catalog topic', () => {
        const ready = KOZPONTI_PAPERS.filter((p) => p.ready);
        assert.ok(ready.length >= 5, 'expected ready központi papers');
        for (const paper of ready) {
            const questions = getKozpontiPaperQuestions(paper.id);
            assert.ok(questions && questions.length > 0, `missing questions: ${paper.id}`);
            for (const q of questions) {
                assert.ok(q.catalogTopicId, `no catalogTopicId: ${paper.id} ${q.id}`);
                assert.ok(
                    isValidPaperTopicId(q.catalogTopicId, 'kozponti'),
                    `invalid topic ${q.catalogTopicId} on ${paper.id} ${q.id}`
                );
            }
        }
    });

    it('counts first-try correct, first-try wrong, and unanswered as wrong', () => {
        const questions = [
            { id: 'q1', catalogTopicId: 'trigonometria', question: 'sin', expression: '' },
            { id: 'q2', catalogTopicId: 'trigonometria', question: 'cos', expression: '' },
            { id: 'q3', catalogTopicId: 'statisztika', question: 'átlag', expression: '' },
            { id: 'q4', catalogTopicId: 'statisztika', question: 'medián', expression: '' },
        ];
        const breakdown = buildTopicBreakdown(questions, ['q1'], ['q2'], 'kozep');
        assert.equal(breakdown.trigonometria.correct, 1);
        assert.equal(breakdown.trigonometria.wrong, 1);
        assert.equal(breakdown.statisztika.correct, 0);
        assert.equal(breakdown.statisztika.wrong, 2);
    });

    it('merges the same topic across two exam papers and sorts weak topics first', () => {
        const gauges = aggregateExamTopicGauges([
            {
                gameMode: 'erettsegi',
                paperId: 'er-a',
                topicBreakdown: {
                    trigonometria: { title: 'Trigonometria', correct: 2, wrong: 1 },
                    statisztika: { title: 'Statisztika', correct: 1, wrong: 3 },
                },
            },
            {
                gameMode: 'erettsegi',
                paperId: 'er-b',
                topicBreakdown: {
                    trigonometria: { title: 'Trigonometria', correct: 3, wrong: 2 },
                },
            },
            {
                gameMode: 'highschool',
                topicBreakdown: {
                    trigonometria: { title: 'should skip unless exam', correct: 99, wrong: 0 },
                },
            },
        ]);
        const trig = gauges.find((g) => g.topicId === 'trigonometria');
        const stat = gauges.find((g) => g.topicId === 'statisztika');
        assert.ok(trig);
        assert.ok(stat);
        assert.equal(trig.correct, 5);
        assert.equal(trig.wrong, 3);
        assert.equal(trig.percent, Math.round((5 / 8) * 100));
        assert.equal(stat.correct, 1);
        assert.equal(stat.wrong, 3);
        assert.equal(stat.percent, 25);
        assert.equal(gauges[0].topicId, 'statisztika');
    });
});
