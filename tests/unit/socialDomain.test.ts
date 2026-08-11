import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    createBlankSocialProfile,
    mapSocialProfile,
    normalizePostText,
    normalizeUsernameOrThrow,
} from '../../utils/socialDomain';

describe('socialDomain', () => {
    it('normalizePostText trims and rejects empty', () => {
        assert.equal(normalizePostText('  hello  '), 'hello');
        assert.throws(() => normalizePostText('   '), /Írj valamit/);
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
});
