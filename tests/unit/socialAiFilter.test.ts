import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    assertSocialContentAllowed,
    parseSocialAiDecision,
} from '../../server/socialAiFilter';

describe('socialAiFilter', () => {
    it('parseSocialAiDecision reads allow/deny JSON', () => {
        const allow = parseSocialAiDecision('{"allow":true,"reason":"","category":"math"}');
        assert.equal(allow?.allow, true);

        const deny = parseSocialAiDecision(
            'prefix {"allow":false,"reason":"Ez nem matek.","category":"off_topic"} suffix'
        );
        assert.equal(deny?.allow, false);
        assert.equal(deny?.reason, 'Ez nem matek.');
        assert.equal(parseSocialAiDecision('nem json'), null);
    });

    it('assertSocialContentAllowed is a no-op when the filter is off', async () => {
        const prev = process.env.SOCIAL_AI_FILTER;
        process.env.SOCIAL_AI_FILTER = '0';
        try {
            await assertSocialContentAllowed({ kind: 'post', text: 'off topic edzés' });
        } finally {
            process.env.SOCIAL_AI_FILTER = prev;
        }
    });
});
