import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hashPassword, verifyPassword } from '../../server/usersTable';

describe('usersTable password hash', () => {
    it('hashes and verifies the same password', () => {
        const stored = hashPassword('titkos123');
        assert.equal(stored.startsWith('scrypt$'), true);
        assert.equal(verifyPassword('titkos123', stored), true);
        assert.equal(verifyPassword('rossz', stored), false);
    });

    it('rejects plaintext or empty stored values', () => {
        assert.equal(verifyPassword('titkos123', ''), false);
        assert.equal(verifyPassword('titkos123', 'titkos123'), false);
    });
});
