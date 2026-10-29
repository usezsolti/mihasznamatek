import test from 'node:test';
import assert from 'node:assert/strict';
import {
    allOriginsSolved,
    dropLaterCopies,
    enqueueRetry,
    questionOriginId,
} from '../../utils/game/retryQueue';

test('retry credits the original id', () => {
    assert.equal(questionOriginId('q3_rabc12'), 'q3');
    assert.equal(questionOriginId('q3'), 'q3');
});

test('a miss comes back until it is solved, then it is gone', () => {
    const bank = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const afterMiss = enqueueRetry(bank, 0, bank[0], 1);
    assert.deepEqual(afterMiss.map((q) => q.id), ['a', 'b', 'a', 'c']);

    const stillWaiting = enqueueRetry(afterMiss, 0, afterMiss[0], 1);
    assert.equal(stillWaiting, afterMiss);

    const missedAgain = enqueueRetry(afterMiss, 2, afterMiss[2], 0);
    assert.deepEqual(missedAgain.map((q) => q.id), ['a', 'b', 'a', 'a', 'c']);

    const solved = dropLaterCopies(missedAgain, 2, 'a');
    assert.deepEqual(solved.map((q) => q.id), ['a', 'b', 'a', 'c']);
    assert.equal(allOriginsSolved(solved, ['a', 'b']), false);
    assert.equal(allOriginsSolved(solved, ['a', 'b', 'c']), true);
});

test('the level is done once each question is correct once', () => {
    const bank = [{ id: 'a' }, { id: 'b' }, { id: 'a_rzzz' }];
    assert.equal(allOriginsSolved(bank, ['a_rzzz', 'b']), true);
    assert.equal(allOriginsSolved(bank, ['b']), false);
    assert.equal(allOriginsSolved([], ['a']), false);
});
