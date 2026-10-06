import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Question } from '../../utils/game/types';
import {
    beginRetryRound,
    createPaperRun,
    recordPaperAnswer,
    summarizePaperRun,
    taskLabel,
} from '../../utils/game/paperRun';

function bank(n: number): Question[] {
    return Array.from({ length: n }, (_, i) => ({
        id: `q${i + 1}`,
        question: `2026/${i + 1}. Feladat ${i + 1}`,
        answer: 1,
        type: 'multiplication' as const,
        expression: '',
    }));
}

describe('paper run completion', () => {
    it('labels official numbers', () => {
        assert.equal(taskLabel('2026/4. Hány átlója van?', 9), '4. feladat');
        assert.equal(taskLabel('2026/14.a) Halmaz.', 20), '14.a) feladat');
    });

    it('counts unique correct answers, not retries', () => {
        let run = createPaperRun('paper', bank(20), 'kozep', 1_000);
        for (let i = 0; i < 20; i++) {
            run = recordPaperAnswer(run, `q${i + 1}`, i < 15, 1_000 + i);
        }
        const summary = summarizePaperRun(run);
        assert.equal(summary.percent, 75);
        assert.equal(summary.solved, 15);
        assert.equal(summary.total, 20);
        assert.equal(summary.retryLeft, 5);
        assert.equal(summary.complete, false);
        assert.equal(run.phase, 'summary');
    });

    it('reaches 100 percent when later attempts are correct', () => {
        let run = createPaperRun('paper', bank(20), 'kozep', 2_000);
        for (let i = 0; i < 20; i++) {
            run = recordPaperAnswer(run, `q${i + 1}`, i < 15, 2_000 + i);
        }
        run = beginRetryRound(run, 3_000);
        assert.equal(run.phase, 'retry');
        assert.deepEqual(run.queue, ['q16', 'q17', 'q18', 'q19', 'q20']);
        for (const id of ['q16', 'q17', 'q18', 'q19', 'q20']) {
            run = recordPaperAnswer(run, id, true, 4_000);
        }
        const summary = summarizePaperRun(run);
        assert.equal(summary.percent, 100);
        assert.equal(summary.solved, 20);
        assert.equal(summary.firstTryCorrect, 15);
        assert.equal(summary.retryLeft, 0);
        assert.equal(summary.complete, true);
        assert.equal(summary.history.find((row) => row.questionId === 'q16')?.attempts, 2);
        assert.equal(summary.history.find((row) => row.questionId === 'q16')?.retryCount, 1);
    });

    it('stays under 100 percent while any task is still wrong', () => {
        let run = createPaperRun('paper', bank(20), 'kozep', 5_000);
        for (let i = 0; i < 20; i++) {
            run = recordPaperAnswer(run, `q${i + 1}`, i < 18, 5_000 + i);
        }
        run = beginRetryRound(run, 6_000);
        run = recordPaperAnswer(run, 'q19', false, 6_100);
        run = recordPaperAnswer(run, 'q20', false, 6_200);
        const summary = summarizePaperRun(run);
        assert.equal(summary.percent, 90);
        assert.equal(summary.solved, 18);
        assert.equal(summary.retryLeft, 2);
        assert.equal(run.stats.q19.wrongAttempts, 2);
        assert.equal(run.stats.q19.solved, false);
    });

    it('does not ask a solved task again in the next retry round', () => {
        let run = createPaperRun('paper', bank(3), 'kozep', 7_000);
        run = recordPaperAnswer(run, 'q1', true, 7_001);
        run = recordPaperAnswer(run, 'q2', false, 7_002);
        run = recordPaperAnswer(run, 'q3', false, 7_003);
        run = beginRetryRound(run, 7_100);
        run = recordPaperAnswer(run, 'q2', true, 7_101);
        run = recordPaperAnswer(run, 'q3', false, 7_102);
        run = beginRetryRound(run, 7_200);
        assert.deepEqual(run.queue, ['q3']);
        assert.equal(summarizePaperRun(run).history.find((row) => row.questionId === 'q1')?.solved, true);
    });
});
