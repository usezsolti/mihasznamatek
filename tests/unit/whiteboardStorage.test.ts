import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { openPersonalBoard, pushStroke, removeStroke } from '../../utils/whiteboardSync';
import type { WbStroke } from '../../utils/whiteboardTypes';

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

describe('whiteboard undo storage', () => {
    const previousWindow = (globalThis as { window?: unknown }).window;
    const previousStorage = (globalThis as { localStorage?: Storage }).localStorage;

    afterEach(() => {
        if (previousWindow) (globalThis as { window?: unknown }).window = previousWindow;
        else delete (globalThis as { window?: unknown }).window;
        if (previousStorage) (globalThis as { localStorage?: Storage }).localStorage = previousStorage;
        else delete (globalThis as { localStorage?: Storage }).localStorage;
    });

    it('does not restore an undone stroke when the next stroke is saved', async () => {
        const storage = new MemoryStorage();
        (globalThis as { localStorage?: Storage }).localStorage = storage as unknown as Storage;
        (globalThis as { window?: { dispatchEvent: (event: Event) => boolean } }).window = {
            dispatchEvent: () => true,
        };
        const boardId = 'wb_undo';
        const undone: WbStroke = {
            id: 'gone',
            tool: 'pen',
            color: '#fff',
            width: 2,
            points: [{ x: 1, y: 1 }],
            authorId: 'u',
            authorName: 'A',
            createdAtMs: 1,
        };
        const next: WbStroke = { ...undone, id: 'next', points: [{ x: 4, y: 4 }], createdAtMs: 2 };

        await pushStroke(boardId, undone);
        await removeStroke(boardId, undone.id);
        storage.setItem(`wb_strokes_${boardId}`, JSON.stringify([undone]));
        await pushStroke(boardId, next);

        const saved = JSON.parse(storage.getItem(`wb_strokes_${boardId}`) || '[]') as WbStroke[];
        assert.deepEqual(saved.map((stroke) => stroke.id), ['next']);
    });
});
