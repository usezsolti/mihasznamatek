import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { NextApiRequest } from 'next';
import {
    extractBearerToken,
    isValidEmail,
    rateLimit,
    sanitizeText,
} from '../../utils/apiSecurity';

function fakeReq(headers: Record<string, string | string[] | undefined>): NextApiRequest {
    return { headers } as NextApiRequest;
}

describe('apiSecurity', () => {
    it('isValidEmail', () => {
        assert.equal(isValidEmail('a@b.hu'), true);
        assert.equal(isValidEmail('bad'), false);
        assert.equal(isValidEmail(''), false);
    });

    it('sanitizeText strips controls and truncates', () => {
        assert.equal(sanitizeText('  hi\u0000there  ', 20), 'hithere');
        assert.equal(sanitizeText('abcdefghij', 5), 'abcde');
    });

    it('extractBearerToken', () => {
        assert.equal(extractBearerToken(fakeReq({ authorization: 'Bearer tok123' })), 'tok123');
        assert.equal(extractBearerToken(fakeReq({})), null);
    });

    it('rateLimit buckets', () => {
        const key = `test-rl-${Date.now()}-${Math.random()}`;
        assert.equal(rateLimit(key, 2, 60_000).ok, true);
        assert.equal(rateLimit(key, 2, 60_000).ok, true);
        assert.equal(rateLimit(key, 2, 60_000).ok, false);
    });
});
