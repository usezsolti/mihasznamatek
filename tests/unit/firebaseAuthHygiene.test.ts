import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseApiEnvelope } from '../../utils/apiEnvelope';

describe('auth secret hygiene', () => {
    it('AUTH_SECRET or NEXTAUTH_SECRET should be documented in env example', async () => {
        const fs = await import('node:fs/promises');
        const path = await import('node:path');
        const examplePath = path.join(process.cwd(), '.env.local.example');
        const text = await fs.readFile(examplePath, 'utf8');
        assert.match(text, /AUTH_SECRET=/);
        assert.match(text, /NEXTAUTH_SECRET=/);
        assert.match(text, /DATABASE_URL=/);
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
