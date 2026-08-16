import type { WbBoardMeta, WbStroke } from './whiteboardTypes';
import {
    apiDeleteAuth,
    apiGetAuth,
    apiPatchAuth,
    apiPostAuth,
} from './apiClient';

const POLL_MS = 1500;

function markBoardMode(boardId: string, mode: 'cloud' | 'local') {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(`wb_mode_${boardId}`, mode);
}

export function getBoardMode(boardId: string): 'cloud' | 'local' | 'unknown' {
    if (typeof localStorage === 'undefined') return 'unknown';
    const m = localStorage.getItem(`wb_mode_${boardId}`);
    if (m === 'cloud' || m === 'local') return m;
    return 'unknown';
}

function saveMetaLocal(meta: WbBoardMeta) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(`wb_meta_${meta.id}`, JSON.stringify(meta));
    if (!localStorage.getItem(`wb_strokes_${meta.id}`)) {
        localStorage.setItem(`wb_strokes_${meta.id}`, '[]');
    }
}

export type CreateWhiteboardResult = {
    meta: WbBoardMeta;
    mode: 'cloud' | 'local';
    warning?: string;
};

export async function createWhiteboard(
    uid: string,
    title = 'Matek tábla'
): Promise<CreateWhiteboardResult> {
    const res = await apiPostAuth<{ meta: WbBoardMeta }>('/api/whiteboard/create', {
        title: title.trim().slice(0, 60) || 'Matek tábla',
    });

    if (res.ok) {
        const meta = res.data.meta;
        markBoardMode(meta.id, 'cloud');
        saveMetaLocal(meta);
        return { meta, mode: 'cloud' };
    }

    const now = Date.now();
    const meta: WbBoardMeta = {
        id: `wb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim().slice(0, 60) || 'Matek tábla',
        createdBy: uid,
        createdAtMs: now,
        updatedAtMs: now,
    };
    saveMetaLocal(meta);
    markBoardMode(meta.id, 'local');
    return { meta, mode: 'local', warning: res.error || 'Helyi tábla készült.' };
}

export async function loadWhiteboardMeta(boardId: string): Promise<WbBoardMeta | null> {
    if (getBoardMode(boardId) !== 'local') {
        const res = await apiGetAuth<{ meta: WbBoardMeta }>(
            `/api/whiteboard/create?id=${encodeURIComponent(boardId)}`
        );
        if (res.ok) {
            markBoardMode(boardId, 'cloud');
            saveMetaLocal(res.data.meta);
            return res.data.meta;
        }
    }

    if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(`wb_meta_${boardId}`);
        return raw ? (JSON.parse(raw) as WbBoardMeta) : null;
    }
    return null;
}

export async function renameWhiteboard(boardId: string, title: string): Promise<void> {
    const nextTitle = title.trim().slice(0, 60) || 'Matek tábla';
    const preferLocal = getBoardMode(boardId) === 'local';
    const updatedAtMs = Date.now();

    const saveLocal = () => {
        if (typeof localStorage === 'undefined') return;
        const raw = localStorage.getItem(`wb_meta_${boardId}`);
        const prev = raw ? (JSON.parse(raw) as WbBoardMeta) : null;
        const meta: WbBoardMeta = {
            id: boardId,
            title: nextTitle,
            createdBy: prev?.createdBy || '',
            createdAtMs: prev?.createdAtMs || updatedAtMs,
            updatedAtMs,
        };
        saveMetaLocal(meta);
    };

    if (!preferLocal) {
        const res = await apiPatchAuth<{ meta: WbBoardMeta }>('/api/whiteboard/create', {
            id: boardId,
            title: nextTitle,
        });
        if (res.ok) {
            markBoardMode(boardId, 'cloud');
            saveLocal();
            return;
        }
        markBoardMode(boardId, 'local');
    }

    saveLocal();
}

export async function pushStroke(boardId: string, stroke: WbStroke): Promise<void> {
    const preferLocal = getBoardMode(boardId) === 'local';

    const pushLocal = () => {
        if (typeof localStorage === 'undefined') return;
        const key = `wb_strokes_${boardId}`;
        const list: WbStroke[] = JSON.parse(localStorage.getItem(key) || '[]');
        if (!list.some((s) => s.id === stroke.id)) list.push(stroke);
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('wb:local-stroke', { detail: { boardId, stroke } }));
    };

    if (!preferLocal) {
        const res = await apiPostAuth<{ stroke: WbStroke }>(
            `/api/whiteboard/${encodeURIComponent(boardId)}/strokes`,
            { stroke }
        );
        if (res.ok) {
            markBoardMode(boardId, 'cloud');
            pushLocal();
            return;
        }
        markBoardMode(boardId, 'local');
    }

    pushLocal();
}

export async function clearWhiteboardStrokes(boardId: string): Promise<void> {
    const preferLocal = getBoardMode(boardId) === 'local';

    const clearLocal = () => {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(`wb_strokes_${boardId}`, '[]');
        window.dispatchEvent(new CustomEvent('wb:local-clear', { detail: { boardId } }));
    };

    if (!preferLocal) {
        const res = await apiDeleteAuth<{ ok: boolean }>(
            `/api/whiteboard/${encodeURIComponent(boardId)}/strokes`
        );
        if (res.ok) {
            clearLocal();
            return;
        }
        markBoardMode(boardId, 'local');
    }

    clearLocal();
}

/** Live stroke list via short polling. Returns unsubscribe. */
export function subscribeStrokes(
    boardId: string,
    onChange: (strokes: WbStroke[]) => void
): () => void {
    const readLocal = () => {
        const list: WbStroke[] = JSON.parse(localStorage.getItem(`wb_strokes_${boardId}`) || '[]');
        onChange(list);
    };

    const attachLocal = () => {
        readLocal();
        const onStroke = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.boardId === boardId) readLocal();
        };
        const onClear = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.boardId === boardId) readLocal();
        };
        window.addEventListener('wb:local-stroke', onStroke);
        window.addEventListener('wb:local-clear', onClear);
        window.addEventListener('storage', readLocal);
        return () => {
            window.removeEventListener('wb:local-stroke', onStroke);
            window.removeEventListener('wb:local-clear', onClear);
            window.removeEventListener('storage', readLocal);
        };
    };

    if (getBoardMode(boardId) === 'local') {
        return attachLocal();
    }

    let stopped = false;
    let sinceMs = 0;
    let loaded = false;
    const byId = new Map<string, WbStroke>();
    let localUnsub: (() => void) | null = null;

    const emit = () => {
        const list = [...byId.values()].sort((a, b) => a.createdAtMs - b.createdAtMs);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`wb_strokes_${boardId}`, JSON.stringify(list));
        }
        onChange(list);
    };

    const poll = async () => {
        if (stopped) return;
        try {
            const res = await apiGetAuth<{ strokes: WbStroke[]; board?: WbBoardMeta }>(
                `/api/whiteboard/${encodeURIComponent(boardId)}/strokes?since=${sinceMs}`
            );
            if (!res.ok) {
                markBoardMode(boardId, 'local');
                if (!localUnsub) localUnsub = attachLocal();
                return;
            }
            markBoardMode(boardId, 'cloud');
            if (res.data.board) saveMetaLocal(res.data.board);
            let changed = false;
            for (const s of res.data.strokes) {
                if (!byId.has(s.id)) {
                    byId.set(s.id, s);
                    changed = true;
                }
                sinceMs = Math.max(sinceMs, s.createdAtMs);
            }
            if (changed) emit();
            else if (!loaded) {
                loaded = true;
                emit();
            }
        } catch {
            markBoardMode(boardId, 'local');
            if (!localUnsub) localUnsub = attachLocal();
        }
    };

    void poll();
    const timer = setInterval(() => void poll(), POLL_MS);

    return () => {
        stopped = true;
        clearInterval(timer);
        localUnsub?.();
    };
}
