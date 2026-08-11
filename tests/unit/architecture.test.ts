import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ARCH_LAYERS, ARCH_PATHS } from '../../lib/architecture';

describe('architecture contract', () => {
    it('four layers with paths', () => {
        assert.equal(ARCH_LAYERS.length, 4);
        for (const layer of ARCH_LAYERS) {
            assert.ok((ARCH_PATHS[layer] || []).length > 0, layer);
        }
    });
});
