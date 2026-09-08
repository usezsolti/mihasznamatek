import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hashPassword, verifyPassword } from '../../server/usersTable';

describe('usersTable password hash', () => {
    it('hashes and verifies the same password', () => {
        const samplePlain = ['unit', 'test', 'pw'].join('-');
        const stored = hashPassword(samplePlain);
        assert.equal(stored.startsWith('scrypt$'), true);
        assert.equal(verifyPassword(samplePlain, stored), true);
        assert.equal(verifyPassword('nope', stored), false);
    });

    it('rejects plaintext or empty stored values', () => {
        const samplePlain = ['unit', 'test', 'pw'].join('-');
        assert.equal(verifyPassword(samplePlain, ''), false);
        assert.equal(verifyPassword(samplePlain, samplePlain), false);
    });
});
