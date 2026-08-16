import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveFirebaseWebApiKey } from '../../utils/firebasePublicConfig';
import { parseApiEnvelope } from '../../utils/apiEnvelope';

describe('firebasePublicConfig', () => {
    it('resolves a non-empty web API key', () => {
        const key = resolveFirebaseWebApiKey();
        assert.ok(key.length > 20);
        assert.match(key, /^AIza/);
    });
});

describe('auth envelope regression', () => {
    it('401 invalid session maps to ApiErr', () => {
        const r = parseApiEnvelope(401, {
            ok: false,
            error: 'Érvénytelen vagy lejárt munkamenet.',
        });
        assert.equal(r.ok, false);
        if (!r.ok) assert.match(r.error, /munkamenet/);
    });
});
