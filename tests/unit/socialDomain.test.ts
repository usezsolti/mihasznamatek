import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    createBlankSocialProfile,
    isPlaceholderSocialProfile,
    mapSocialProfile,
    applyFeedRefresh,
    assertMathOnlyPost,
    assertNoVideoPost,
    buildDailyStoryProfiles,
    isPublicSocialPost,
    normalizePostText,
    normalizeUsernameOrThrow,
    resolveGroupMemberIds,
    socialTodayKey,
    isInboundMessageRequest,
    buildMessageReply,
    toggleMessageReaction,
    mapDirectMessage,
} from '../../utils/socialDomain';

describe('socialDomain', () => {
    it('normalizePostText trims and rejects empty', () => {
        assert.equal(normalizePostText('  hello  '), 'hello');
        assert.throws(() => normalizePostText('   '), /Írj valamit/);
    });

    it('assertMathOnlyPost allows math and rejects off-topic', () => {
        assert.equal(assertMathOnlyPost('Másodfokú egyenlet: x^2=4', 'algebra'), 'Másodfokú egyenlet: x^2=4');
        assert.throws(() => assertMathOnlyPost('Holnap megyek edzeni', 'algebra'), /Csak matekos/);
        assert.throws(() => assertMathOnlyPost('2+2=4', ''), /matektémát/);
    });

    it('assertNoVideoPost rejects video posts', () => {
        assert.doesNotThrow(() => assertNoVideoPost(null));
        assert.doesNotThrow(() => assertNoVideoPost(''));
        assert.throws(() => assertNoVideoPost('https://example.com/clip.mp4'), /Videót nem lehet/);
    });

    it('legacy posts without status are public; pending and invalid authors are hidden', () => {
        assert.equal(isPublicSocialPost({ authorName: 'Anna', authorUsername: 'anna' }), true);
        assert.equal(isPublicSocialPost({ authorName: 'Anna', moderationStatus: 'approved' }), true);
        assert.equal(isPublicSocialPost({ authorName: 'Anna', moderationStatus: 'pending' }), false);
        assert.equal(isPublicSocialPost({ authorName: 'Diák', authorUsername: 'diakab12' }), false);
        assert.equal(isPublicSocialPost({}), false);
    });

    it('normalizeUsernameOrThrow enforces min length', () => {
        assert.throws(() => normalizeUsernameOrThrow('ab'), /3 karakter/);
        const u = normalizeUsernameOrThrow('MatekDiak99');
        assert.ok(u.length >= 3);
    });

    it('createBlankSocialProfile + mapSocialProfile', () => {
        const blank = createBlankSocialProfile('uid-1', { displayName: 'Teszt' });
        assert.equal(blank.uid, 'uid-1');
        assert.equal(blank.displayName, 'Teszt');
        assert.ok(blank.username);

        const mapped = mapSocialProfile('uid-2', {
            username: 'alice',
            displayName: 'Alice',
            xp: 42,
            showXp: false,
        });
        assert.equal(mapped.username, 'alice');
        assert.equal(mapped.xp, 42);
        assert.equal(mapped.showXp, false);
    });

    it('applyFeedRefresh keeps optimistic posts when the server list is empty', () => {
        const prev = [
            {
                id: 'p1',
                authorId: 'u1',
                authorName: 'A',
                authorUsername: 'a',
                authorPhoto: '',
                text: 'hello',
                likeCount: 0,
                commentCount: 0,
                createdAtMs: Date.now(),
            },
        ];
        const kept = applyFeedRefresh([], prev);
        assert.equal(kept.length, 1);
        assert.equal(kept[0].id, 'p1');
    });

    it('isPlaceholderSocialProfile hides test and empty Diák accounts', () => {
        assert.equal(
            isPlaceholderSocialProfile({ displayName: 'Teszt Felhasználó', username: 'tesztfelhasznaloXq0C' }),
            true
        );
        assert.equal(
            isPlaceholderSocialProfile({ displayName: 'Diák', username: 'diakhlFh', photoURL: '', bio: '', postCount: 3 }),
            true
        );
        assert.equal(
            isPlaceholderSocialProfile({ displayName: 'Zsolti', username: 'zsolti', photoURL: '', bio: '', postCount: 0 }),
            false
        );
    });

    it('buildDailyStoryProfiles only lists authors of today\'s daily posts', () => {
        const today = socialTodayKey();
        const posts = [
            { authorId: 'junk', authorName: 'Unit', authorUsername: 'unittesterunit', dailyKey: null, createdAtMs: 2 },
            { authorId: 'teacher', authorName: 'Zsolt', authorUsername: 'zsolt', dailyKey: today, createdAtMs: 3 },
            { authorId: 'old', authorName: 'Anna', authorUsername: 'annaunit', dailyKey: '2020-01-01', createdAtMs: 9 },
            { authorId: 'teacher', authorName: 'Zsolt', authorUsername: 'zsolt', dailyKey: today, createdAtMs: 1 },
        ];
        const stories = buildDailyStoryProfiles(posts, [], 'viewer');
        assert.deepEqual(stories.map((s) => s.uid), ['teacher']);
        assert.equal(stories[0].username, 'zsolt');
    });

    it('buildDailyStoryProfiles puts the viewer first', () => {
        const today = socialTodayKey();
        const posts = [
            { authorId: 'a', authorName: 'A', authorUsername: 'a', dailyKey: today, createdAtMs: 5 },
            { authorId: 'me', authorName: 'Me', authorUsername: 'me', dailyKey: today, createdAtMs: 1 },
        ];
        const stories = buildDailyStoryProfiles(posts, [], 'me');
        assert.deepEqual(stories.map((s) => s.uid), ['me', 'a']);
    });

    it('resolveGroupMemberIds keeps owner first and unique invited members', () => {
        const ids = resolveGroupMemberIds('owner', ['a', 'owner', 'a', '', 'b']);
        assert.deepEqual(ids, ['owner', 'a', 'b']);
        assert.equal(resolveGroupMemberIds('me').length, 1);
        assert.throws(() => resolveGroupMemberIds(''), /Tulajdonos/);
    });

    it('toggleMessageReaction adds, stacks and removes an emoji', () => {
        const once = toggleMessageReaction([], 'u1', '👍');
        assert.deepEqual(once, [{ emoji: '👍', uids: ['u1'] }]);
        const both = toggleMessageReaction(once, 'u2', '👍');
        assert.deepEqual(both, [{ emoji: '👍', uids: ['u1', 'u2'] }]);
        const extra = toggleMessageReaction(both, 'u1', '🔥');
        assert.equal(extra.length, 2);
        assert.deepEqual(extra.find((r) => r.emoji === '🔥')?.uids, ['u1']);
        const undone = toggleMessageReaction(extra, 'u1', '👍');
        assert.deepEqual(undone.find((r) => r.emoji === '👍')?.uids, ['u2']);
        assert.throws(() => toggleMessageReaction([], 'u1', 'hello'), /Érvénytelen emoji/);
        const mapped = mapDirectMessage({
            id: 'm1',
            senderId: 'u2',
            text: 'csá',
            createdAtMs: 1,
            reactions: [{ emoji: '❤️', uids: ['u1'] }],
        });
        assert.deepEqual(mapped.reactions, [{ emoji: '❤️', uids: ['u1'] }]);
    });

    it('buildMessageReply stores a short snapshot of the quoted message', () => {
        assert.equal(buildMessageReply(null), null);
        assert.equal(buildMessageReply({ id: 'm1', text: '   ', senderId: 'u' }), null);
        const q = buildMessageReply({ id: 'm1', text: '  csá Martin!  ', senderId: 'u2' });
        assert.deepEqual(q, {
            replyToId: 'm1',
            replyToText: 'csá Martin!',
            replyToSenderId: 'u2',
        });
    });

    it('isInboundMessageRequest is only for people you do not follow who wrote first', () => {
        const conv = { otherUid: 'stranger', initiatorId: 'stranger' };
        assert.equal(isInboundMessageRequest('me', conv, []), true);
        assert.equal(isInboundMessageRequest('me', conv, ['stranger']), false);
        assert.equal(isInboundMessageRequest('me', { otherUid: 'stranger', initiatorId: 'me' }, []), false);
        assert.equal(
            isInboundMessageRequest('me', { otherUid: 'stranger', lastSenderId: 'stranger' }, []),
            true
        );
    });
});
