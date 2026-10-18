import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { inboxSnapshot } from '../../server/socialLiveTail';
import type { ConversationPreview, DirectMessage } from '../../utils/socialTypes';

const conv = (id: string): ConversationPreview => ({
    id,
    otherUid: 'other',
    otherName: 'Other',
    otherPhoto: '',
    lastMessage: 'szia',
    updatedAtMs: 1,
});

const msg = (id: string): DirectMessage => ({
    id,
    senderId: 'other',
    text: 'szia',
    createdAtMs: 1,
});

describe('inboxSnapshot', () => {
    it('sends messages only for a conversation this user is in', () => {
        const own = inboxSnapshot([conv('a_b')], 'a_b', [msg('1')]);
        assert.equal(own.conversationId, 'a_b');
        assert.equal(own.messages.length, 1);

        const foreign = inboxSnapshot([conv('a_b')], 'x_y', [msg('secret')]);
        assert.equal(foreign.conversationId, '');
        assert.deepEqual(foreign.messages, []);
    });
});
