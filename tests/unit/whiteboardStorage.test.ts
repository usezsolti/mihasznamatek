import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { openPersonalBoard } from '../../utils/whiteboardSync';

class MemoryStorage {
    private data = new Map<string, string>();
    failWrites = 0;

    get length() {
        return this.data.size;
    }

    key(index: number) {
        return [...this.data.keys()][index] ?? null;
    }

    getItem(key: string) {
        return this.data.has(key) ? this.data.get(key)! : null;
    }

    setItem(key: string, value: string) {
        if (this.failWrites > 0) {
            this.failWrites -= 1;
            throw new DOMException('quota', 'QuotaExceededError');
        }
        this.data.set(key, value);
    }

    removeItem(key: string) {
        this.data.delete(key);
    }
}

describe('openPersonalBoard storage quota', () => {
    const previous = (globalThis as { localStorage?: Storage }).localStorage;

    afterEach(() => {
        if (previous) (globalThis as { localStorage?: Storage }).localStorage = previous;
        else delete (globalThis as { localStorage?: Storage }).localStorage;
    });

    it('opens a board when localStorage is already full', () => {
        const storage = new MemoryStorage();
        storage.setItem('wb_strokes_old', 'x'.repeat(200));
        storage.failWrites = 1;
        (globalThis as { localStorage?: Storage }).localStorage = storage as unknown as Storage;

        const id = openPersonalBoard('user-1');
        assert.match(id, /^wb_/);
        assert.equal(storage.getItem('wb_strokes_old'), null);
        assert.ok(storage.getItem(`wb_meta_${id}`));
    });
});
