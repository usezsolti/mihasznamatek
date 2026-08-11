import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseApiEnvelope } from '../../utils/apiEnvelope';

describe('parseApiEnvelope', () => {
    it('unwraps { ok, data }', () => {
        const r = parseApiEnvelope<{ n: number }>(200, { ok: true, data: { n: 7 } });
        assert.equal(r.ok, true);
        if (r.ok) assert.equal(r.data.n, 7);
    });

    it('maps error + meta', () => {
        const r = parseApiEnvelope(502, {
            ok: false,
            error: 'fail',
            needsActivation: true,
            provider: 'formsubmit',
        });
        assert.equal(r.ok, false);
        if (!r.ok) {
            assert.equal(r.error, 'fail');
            assert.equal(r.status, 502);
            assert.equal(r.meta?.needsActivation, true);
            assert.equal(r.meta?.provider, 'formsubmit');
        }
    });

    it('legacy flat ok:true', () => {
        const r = parseApiEnvelope<{ provider: string }>(200, {
            ok: true,
            provider: 'gmail',
        });
        assert.equal(r.ok, true);
        if (r.ok) assert.equal(r.data.provider, 'gmail');
    });

    it('HTTP error without body', () => {
        const r = parseApiEnvelope(404, {});
        assert.equal(r.ok, false);
        if (!r.ok) assert.match(r.error, /HTTP 404/);
    });
});
