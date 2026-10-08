import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { beginRetryRound, createPaperRun, recordPaperAnswer, summarizePaperRun } from '../../utils/game/paperRun';
import { reportFileName, reportFromPaper, reportFromSession } from '../../utils/game/gameReport';
import type { Question } from '../../utils/game/types';

function bank(n: number): Question[] {
    return Array.from({ length: n }, (_, i) => ({
        id: `q${i + 1}`,
        question: `2026/${i + 1}. Feladat ${i + 1}`,
        answer: 1,
        type: 'multiplication' as const,
        expression: '',
        catalogTopicId: i < 2 ? 'halmazok' : 'sorozatok',
    }));
}

describe('game report', () => {
    it('builds a paper report from solved and missed tasks', () => {
        let run = createPaperRun('paper', bank(3), 'kozep', 1_000);
        run = recordPaperAnswer(run, 'q1', true, 1_100);
        run = recordPaperAnswer(run, 'q2', false, 1_200);
        run = recordPaperAnswer(run, 'q3', false, 1_300);
        run = beginRetryRound(run, 1_400);
        run = recordPaperAnswer(run, 'q3', true, 1_500);
        const report = reportFromPaper(summarizePaperRun(run), 'Érettségi próba', new Date('2026-10-06T12:00:00'));
        assert.equal(report.percent, 67);
        assert.equal(report.solved, 2);
        assert.equal(report.total, 3);
        assert.equal(report.firstTryCorrect, 1);
        assert.equal(report.wrongAtLeastOnce, 2);
        assert.equal(report.tasks[0].detail.includes('elsőre'), true);
        assert.equal(report.tasks[1].outcome, 'missed');
        assert.equal(report.tasks[2].outcome, 'later');
        assert.equal(reportFileName(report.fileDate), 'mihaszna-jelentes-2026-10-06.pdf');
    });

    it('treats unanswered session tasks as not yet reached', () => {
        const report = reportFromSession('Sprint', [
            { id: 'a', label: '1. feladat', topicTitle: 'Halmazok', outcome: 'first' },
            { id: 'b', label: '2. feladat', topicTitle: 'Halmazok', outcome: 'missed' },
            { id: 'c', label: '3. feladat', topicTitle: 'Sorozatok', outcome: 'unseen' },
        ], new Date('2026-10-06T12:00:00'));
        assert.equal(report.solved, 1);
        assert.equal(report.percent, 33);
        assert.equal(report.wrongAtLeastOnce, 1);
        assert.equal(report.tasks[2].outcome, 'skipped');
        assert.equal(report.topics.length, 2);
    });
});
