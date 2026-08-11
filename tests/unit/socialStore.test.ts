import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSocialStore, runSocialAction } from '../../server/socialStore';

describe('socialStore (local)', () => {
    process.env.SOCIAL_DATA_STORE = 'local';

    it('ensureProfile → createPost → listFeed', async () => {
        const store = createSocialStore('unit-test');
        const uid = `unit-${Date.now()}`;
        const profile = await runSocialAction(store, 'ensureProfile', uid, {
            name: 'Unit Tester',
        });
        assert.ok((profile.data as any)?.username);

        const post = await runSocialAction(store, 'createPost', uid, {
            text: 'unit post',
        });
        assert.equal(post.status, 201);
        assert.equal((post.data as any)?.text, 'unit post');

        const feed = await runSocialAction(store, 'listFeed', uid, { limit: 5 });
        assert.ok(Array.isArray(feed.data));
        assert.ok((feed.data as any[]).length >= 1);
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
