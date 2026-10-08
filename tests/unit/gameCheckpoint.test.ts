import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    checkpointMatchesQuestions,
    orderedQuestionsForCheckpoint,
    type GameCheckpoint,
} from '../../utils/game/gameCheckpoint';

function checkpoint(ids: string[], index = 1): GameCheckpoint {
    return {
        version: 1,
        savedAt: 1,
        label: 'próba',
        paperId: '',
        questionIndex: index,
        score: 0,
        level: 1,
        lives: 3,
        runMaxLives: 3,
        correctIds: [],
        wrongIds: [],
        sessionTasks: [],
        questionIds: ids,
        streak: 0,
        sessionXp: 0,
    };
}

describe('game checkpoint', () => {
    it('matches the same question order and rebuilds a shuffled list', () => {
        const saved = checkpoint(['b', 'a', 'c'], 2);
        assert.equal(checkpointMatchesQuestions(saved, ['b', 'a', 'c']), true);
        assert.equal(checkpointMatchesQuestions(saved, ['a', 'b', 'c']), false);
        const ordered = orderedQuestionsForCheckpoint(saved, [
            { id: 'a', n: 1 },
            { id: 'c', n: 3 },
            { id: 'b', n: 2 },
        ]);
        assert.deepEqual(ordered?.map((question) => question.id), ['b', 'a', 'c']);
        assert.equal(orderedQuestionsForCheckpoint(saved, [{ id: 'a' }, { id: 'b' }]), null);
    });
});
