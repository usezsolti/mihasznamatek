import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    mapGameSession,
    mergePracticeXp,
    startedAndCompletedTopicCounts,
} from '../../server/studentProgress';
import { emptyProgress } from '../../utils/practiceProgress';

describe('student progress merge', () => {
    it('maps game sessions and sums XP from plays when summary is empty', () => {
        const a = mapGameSession('1', {
            topicTitle: 'Egyenletek',
            topicId: 'egyenletek',
            correct: 8,
            total: 10,
            score: 80,
            xpEarned: 40,
            completedAt: '2026-09-10T10:00:00.000Z',
            userId: 'u1',
        });
        const b = mapGameSession('2', {
            topic: 'Függvények',
            correct: 5,
            total: 5,
            xpEarned: 25,
            timestamp: { seconds: 1757500000 },
        });
        assert.equal(a.topic, 'Egyenletek');
        assert.equal(a.xpEarned, 40);
        assert.ok(a.atMs > 0);
        assert.equal(mergePracticeXp(0, [a, b]), 65);
        assert.equal(mergePracticeXp(120, [a, b]), 120);
    });

    it('maps topicBreakdown from exam papers', () => {
        const row = mapGameSession('paper-1', {
            topicTitle: '2026 május középszint',
            gameMode: 'erettsegi',
            paperId: 'er-2026-maj-kozep',
            correct: 10,
            total: 14,
            topicBreakdown: {
                trigonometria: { title: 'Trigonometria', correct: 3, wrong: 1 },
            },
        });
        assert.equal(row.paperId, 'er-2026-maj-kozep');
        assert.equal(row.topicBreakdown?.trigonometria.correct, 3);
        assert.equal(row.topicBreakdown?.trigonometria.wrong, 1);
    });

    it('uses score as XP when xpEarned is missing', () => {
        const row = mapGameSession('3', { score: 15, topic: 'Napi' });
        assert.equal(row.xpEarned, 15);
    });

    it('counts started topics from progress', () => {
        const progress = emptyProgress();
        progress.topics.egyenletek = {
            bestCorrect: 4,
            totalQuestions: 10,
            stagesCompleted: [1],
            completed: false,
            perfect: false,
            lessonsCompleted: [1],
            highestUnlocked: 2,
            chestsClaimed: [],
        };
        const counts = startedAndCompletedTopicCounts(progress);
        assert.equal(counts.started, 1);
        assert.equal(counts.completed, 0);
    });
});
