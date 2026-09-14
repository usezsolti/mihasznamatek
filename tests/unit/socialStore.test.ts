import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createSocialStore, runSocialAction } from '../../server/socialStore';
import { ADMIN_LOGIN_EMAIL } from '../../utils/adminLoginShared';

const adminCtx = { email: ADMIN_LOGIN_EMAIL };
const tmpDb = path.join(os.tmpdir(), `mm-social-unit-${process.pid}.json`);

describe('socialStore (local)', () => {
    process.env.SOCIAL_DATA_STORE = 'local';
    process.env.SOCIAL_LOCAL_DB_PATH = tmpDb;
    process.env.SOCIAL_AI_FILTER = '0';
    process.env.SOCIAL_SKIP_MODERATION_MAIL = '1';

    after(() => {
        try {
            fs.unlinkSync(tmpDb);
        } catch {
            /* ignore */
        }
    });

    it('ensureProfile → pending post stays off the public feed until approved', async () => {
        const store = createSocialStore('unit-test');
        const uid = `unit-${Date.now()}`;
        const profile = await runSocialAction(store, 'ensureProfile', uid, {
            name: 'Unit Tester',
        });
        assert.ok((profile.data as any)?.username);

        const post = await runSocialAction(store, 'createPost', uid, {
            text: 'unit egyenlet 2x+3=7',
            topic: 'algebra',
        });
        assert.equal(post.status, 201);
        assert.equal((post.data as any)?.text, 'unit egyenlet 2x+3=7');
        assert.equal((post.data as any)?.moderationStatus, 'pending');

        const feedBefore = await runSocialAction(store, 'listFeed', uid, { limit: 20 });
        assert.ok(Array.isArray(feedBefore.data));
        assert.equal(
            (feedBefore.data as any[]).some((p) => p.id === (post.data as any).id),
            false
        );

        const mine = await runSocialAction(store, 'listUserPosts', uid, { uid, limit: 20 });
        assert.ok((mine.data as any[]).some((p) => p.id === (post.data as any).id));

        const pending = await runSocialAction(
            store,
            'listPendingPosts',
            uid,
            { limit: 20 },
            adminCtx
        );
        assert.ok((pending.data as any[]).some((p) => p.id === (post.data as any).id));

        const reviewed = await runSocialAction(
            store,
            'reviewPost',
            uid,
            { postId: (post.data as any).id, decision: 'approved' },
            adminCtx
        );
        assert.equal((reviewed.data as any)?.moderationStatus, 'approved');

        const feedAfter = await runSocialAction(store, 'listFeed', uid, { limit: 20 });
        assert.ok((feedAfter.data as any[]).some((p) => p.id === (post.data as any).id));
    });

    it('one profile posts and another sees it only after approval', async () => {
        const store = createSocialStore('unit-test');
        const a = `unit-a-${Date.now()}`;
        const b = `unit-b-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', a, { name: 'Anna' });
        await runSocialAction(store, 'ensureProfile', b, { name: 'Bela' });
        const created = await runSocialAction(store, 'createPost', a, {
            text: 'látható matek feladat: 3x=12',
            topic: 'feladat',
        });
        const postId = (created.data as any)?.id;
        assert.ok(postId);
        assert.equal((created.data as any)?.moderationStatus, 'pending');

        const feedHidden = await runSocialAction(store, 'listFeed', b, { limit: 20 });
        assert.equal((feedHidden.data as any[]).some((p) => p.id === postId), false);

        const otherProfile = await runSocialAction(store, 'listUserPosts', b, { uid: a, limit: 20 });
        assert.equal((otherProfile.data as any[]).some((p) => p.id === postId), false);

        await runSocialAction(
            store,
            'reviewPost',
            b,
            { postId, decision: 'approved' },
            adminCtx
        );

        const feed = await runSocialAction(store, 'listFeed', b, { limit: 20 });
        const feedHit = (feed.data as any[]).find((p) => p.id === postId);
        assert.equal(feedHit?.text, 'látható matek feladat: 3x=12');
        assert.equal(feedHit?.authorId, a);

        const mine = await runSocialAction(store, 'listUserPosts', b, { uid: a, limit: 20 });
        const profileHit = (mine.data as any[]).find((p) => p.id === postId);
        assert.ok(profileHit);
        assert.equal(profileHit.authorId, a);
    });

    it('rejects video posts', async () => {
        const store = createSocialStore('unit-test');
        const uid = `unit-vid-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', uid, { name: 'Video Teszt' });
        await assert.rejects(
            () =>
                runSocialAction(store, 'createPost', uid, {
                    text: 'matek feladat 2x=4',
                    topic: 'feladat',
                    videoUrl: 'https://example.com/clip.mp4',
                }),
            /Videót nem lehet/
        );
    });

    it('students cannot review posts', async () => {
        const store = createSocialStore('unit-test');
        const uid = `unit-rev-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', uid, { name: 'Diak' });
        const created = await runSocialAction(store, 'createPost', uid, {
            text: 'matek feladat 5x=10',
            topic: 'feladat',
        });
        await assert.rejects(
            () =>
                runSocialAction(store, 'reviewPost', uid, {
                    postId: (created.data as any).id,
                    decision: 'approved',
                }),
            /tanár/
        );
    });

    it('hides and purges invalid users and all posts', async () => {
        const store = createSocialStore('unit-test');
        const uid = `unit-junk-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', uid, { name: 'Teszt Felhasználó' });
        const created = await runSocialAction(store, 'createPost', uid, {
            text: 'matek feladat 2x=6',
            topic: 'feladat',
        });
        await runSocialAction(
            store,
            'reviewPost',
            uid,
            { postId: (created.data as any).id, decision: 'approved' },
            adminCtx
        );
        const feed = await runSocialAction(store, 'listFeed', uid, { limit: 20 });
        assert.equal((feed.data as any[]).some((p) => p.id === (created.data as any).id), false);

        const people = await runSocialAction(store, 'listProfiles', uid, { limit: 30 });
        assert.equal((people.data as any[]).some((p) => p.uid === uid), false);

        const purged = await runSocialAction(store, 'purgeSocialJunk', 'admin-uid', {}, adminCtx);
        assert.ok(((purged.data as any).deletedPosts || 0) >= 1);
        assert.ok(((purged.data as any).deletedProfiles || 0) >= 1);
    });

    it('admin can publish a daily post that sits on top', async () => {
        const store = createSocialStore('unit-test');
        const teacher = `unit-teacher-${Date.now()}`;
        const student = `unit-stu-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', teacher, { name: 'Zsolti' }, adminCtx);
        await runSocialAction(store, 'ensureProfile', student, { name: 'Anna' });
        const regular = await runSocialAction(store, 'createPost', student, {
            text: 'matek feladat 4x=8',
            topic: 'feladat',
        });
        await runSocialAction(
            store,
            'reviewPost',
            teacher,
            { postId: (regular.data as any).id, decision: 'approved' },
            adminCtx
        );
        const daily = await runSocialAction(
            store,
            'createPost',
            teacher,
            { text: 'Napi matek: oldd meg  x^2=9', topic: 'feladat', daily: true },
            adminCtx
        );
        assert.ok((daily.data as any)?.dailyKey);
        const feed = await runSocialAction(store, 'listFeed', student, { limit: 20 });
        assert.equal((feed.data as any[])[0]?.id, (daily.data as any).id);
        await assert.rejects(
            () =>
                runSocialAction(store, 'createPost', student, {
                    text: 'matek feladat 5x=10',
                    topic: 'feladat',
                    daily: true,
                }),
            /tanár/
        );
    });

    it('createGroup can include selected members', async () => {
        const store = createSocialStore('unit-test');
        const owner = `unit-owner-${Date.now()}`;
        const mate = `unit-mate-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', owner, { name: 'Tanar' }, adminCtx);
        await runSocialAction(store, 'ensureProfile', mate, { name: 'DiakMatek' });
        const group = await runSocialAction(
            store,
            'createGroup',
            owner,
            { name: 'Emelt matek', topic: 'erettsegi', memberIds: [mate, 'missing-user'] },
            adminCtx
        );
        const members = (group.data as any).memberIds as string[];
        assert.equal(members[0], owner);
        assert.ok(members.includes(mate));
        assert.equal(members.includes('missing-user'), false);
        assert.equal((group.data as any).memberCount, 2);
    });

    it('sendMessage can reply to another message', async () => {
        const store = createSocialStore('unit-test');
        const a = `unit-a-${Date.now()}`;
        const b = `unit-b-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', a, { name: 'AnnaMatek' });
        await runSocialAction(store, 'ensureProfile', b, { name: 'BelaMatek' });
        await runSocialAction(store, 'sendMessage', a, { toUid: b, text: 'csá! x^2=9?' });
        const listed = await runSocialAction(store, 'listConversations', b, {});
        const cid = (listed.data as any[])[0].id;
        const msgs = await runSocialAction(store, 'listMessages', b, { conversationId: cid });
        const first = (msgs.data as any[])[0];
        await runSocialAction(store, 'sendMessage', b, {
            toUid: a,
            text: 'igen 👍',
            replyToId: first.id,
            replyToText: first.text,
            replyToSenderId: first.senderId,
        });
        const again = await runSocialAction(store, 'listMessages', a, { conversationId: cid });
        const last = (again.data as any[]).at(-1);
        assert.equal(last.replyToId, first.id);
        assert.equal(last.replyToText, first.text);
        assert.match(last.text, /👍/);
        const convsForA = await runSocialAction(store, 'listConversations', a, {});
        const convsForB = await runSocialAction(store, 'listConversations', b, {});
        assert.equal((convsForB.data as any[])[0].initiatorId, a);
        assert.equal((convsForA.data as any[])[0].initiatorId, a);
    });

    it('reactToMessage toggles an emoji on a DM', async () => {
        const store = createSocialStore('unit-test');
        const a = `unit-ra-${Date.now()}`;
        const b = `unit-rb-${Date.now()}`;
        await runSocialAction(store, 'ensureProfile', a, { name: 'AnnaMatek' });
        await runSocialAction(store, 'ensureProfile', b, { name: 'BelaMatek' });
        await runSocialAction(store, 'sendMessage', a, { toUid: b, text: 'csá Martin! x=2' });
        const listed = await runSocialAction(store, 'listConversations', b, {});
        const cid = (listed.data as any[])[0].id;
        const msgs = await runSocialAction(store, 'listMessages', b, { conversationId: cid });
        const first = (msgs.data as any[])[0];
        const reacted = await runSocialAction(store, 'reactToMessage', b, {
            conversationId: cid,
            messageId: first.id,
            emoji: '🔥',
        });
        assert.deepEqual((reacted.data as any).reactions, [{ emoji: '🔥', uids: [b] }]);
        const again = await runSocialAction(store, 'reactToMessage', a, {
            conversationId: cid,
            messageId: first.id,
            emoji: '🔥',
        });
        assert.deepEqual((again.data as any).reactions[0].uids.sort(), [a, b].sort());
        const undone = await runSocialAction(store, 'reactToMessage', b, {
            conversationId: cid,
            messageId: first.id,
            emoji: '🔥',
        });
        assert.deepEqual((undone.data as any).reactions, [{ emoji: '🔥', uids: [a] }]);
    });

    it('unknown action → status 400', async () => {
        const store = createSocialStore('unit-test');
        await assert.rejects(
            () => runSocialAction(store, 'noSuchAction', 'uid', {}),
            (err: any) => {
                assert.match(String(err.message), /Ismeretlen action/);
                assert.equal(err.status, 400);
                return true;
            }
        );
    });
});
