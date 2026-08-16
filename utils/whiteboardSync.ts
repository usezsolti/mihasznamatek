import type { WbBoardMeta, WbStroke } from './whiteboardTypes';
import { newBoardId } from './whiteboardTypes';

function getFirebase(): any {
    if (typeof window === 'undefined') return null;
    return (window as any).firebase || null;
}

function db() {
    const firebase = getFirebase();
    if (!firebase?.firestore) return null;
    return firebase.firestore();
}

function isPermissionError(err: any): boolean {
    const code = String(err?.code || '');
    const msg = String(err?.message || err || '');
    return (
        code.includes('permission-denied') ||
        /Missing or insufficient permissions/i.test(msg) ||
        /PERMISSION_DENIED/i.test(msg)
    );
}

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
    const firestore = db();
    const id = newBoardId();
    const meta: WbBoardMeta = {
        id,
        title,
        createdBy: uid,
        createdAtMs: Date.now(),
        updatedAtMs: Date.now(),
    };

    if (firestore) {
        try {
            await firestore.collection('whiteboards').doc(id).set(meta);
            markBoardMode(id, 'cloud');
            saveMetaLocal(meta);
            return { meta, mode: 'cloud' };
        } catch (err: any) {
            // Rules not published yet → still usable on this device
            saveMetaLocal(meta);
            markBoardMode(id, 'local');
            const warning = isPermissionError(err)
                ? 'Firestore rules hiányoznak a whiteboards gyűjteményhez. Helyi tábla készült — Publish: /rules-setup'
                : String(err?.message || err).slice(0, 160);
            return { meta, mode: 'local', warning };
        }
    }

    saveMetaLocal(meta);
    markBoardMode(id, 'local');
    return { meta, mode: 'local', warning: 'Firebase nincs betöltve — helyi tábla.' };
}

export async function loadWhiteboardMeta(boardId: string): Promise<WbBoardMeta | null> {
    if (getBoardMode(boardId) !== 'local') {
        const firestore = db();
        if (firestore) {
            try {
                const snap = await firestore.collection('whiteboards').doc(boardId).get();
                if (snap.exists) {
                    markBoardMode(boardId, 'cloud');
                    return { id: snap.id, ...snap.data() } as WbBoardMeta;
                }
            } catch (err) {
                if (!isPermissionError(err)) console.warn('loadWhiteboardMeta', err);
            }
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
    const firestore = db();
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

    if (!preferLocal && firestore) {
        try {
            await firestore.collection('whiteboards').doc(boardId).set(
                { title: nextTitle, updatedAtMs },
                { merge: true }
            );
            markBoardMode(boardId, 'cloud');
            saveLocal();
            return;
        } catch (err: any) {
            if (isPermissionError(err)) {
                markBoardMode(boardId, 'local');
                saveLocal();
                return;
            }
            throw err;
        }
    }

    saveLocal();
}

export async function pushStroke(boardId: string, stroke: WbStroke): Promise<void> {
    const preferLocal = getBoardMode(boardId) === 'local';
    const firestore = db();

    const pushLocal = () => {
        if (typeof localStorage === 'undefined') return;
        const key = `wb_strokes_${boardId}`;
        const list: WbStroke[] = JSON.parse(localStorage.getItem(key) || '[]');
        if (!list.some((s) => s.id === stroke.id)) list.push(stroke);
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('wb:local-stroke', { detail: { boardId, stroke } }));
    };

    if (!preferLocal && firestore) {
        try {
            await firestore
                .collection('whiteboards')
                .doc(boardId)
                .collection('strokes')
                .doc(stroke.id)
                .set(stroke);
            await firestore.collection('whiteboards').doc(boardId).set(
                { updatedAtMs: Date.now() },
                { merge: true }
            );
            markBoardMode(boardId, 'cloud');
            pushLocal(); // mirror for offline reopen
            return;
        } catch (err: any) {
            if (isPermissionError(err)) {
                markBoardMode(boardId, 'local');
                pushLocal();
                return;
            }
            throw err;
        }
    }

    pushLocal();
}

export async function clearWhiteboardStrokes(boardId: string): Promise<void> {
    const preferLocal = getBoardMode(boardId) === 'local';
    const firestore = db();

    const clearLocal = () => {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(`wb_strokes_${boardId}`, '[]');
        window.dispatchEvent(new CustomEvent('wb:local-clear', { detail: { boardId } }));
    };

    if (!preferLocal && firestore) {
        try {
            const snap = await firestore
                .collection('whiteboards')
                .doc(boardId)
                .collection('strokes')
                .get();
            const docs = snap.docs as any[];
            // Firestore batch limit is 500
            for (let i = 0; i < docs.length; i += 400) {
                const batch = firestore.batch();
                docs.slice(i, i + 400).forEach((d: any) => batch.delete(d.ref));
                await batch.commit();
            }
            await firestore.collection('whiteboards').doc(boardId).set(
                { updatedAtMs: Date.now() },
                { merge: true }
            );
            clearLocal();
            return;
        } catch (err: any) {
            if (isPermissionError(err)) {
                markBoardMode(boardId, 'local');
                clearLocal();
                return;
            }
            throw err;
        }
    }

    clearLocal();
}

/** Live stroke list. Returns unsubscribe. */
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

    const firestore = db();
    if (firestore) {
        let localUnsub: (() => void) | null = null;
        const remoteUnsub = firestore
            .collection('whiteboards')
            .doc(boardId)
            .collection('strokes')
            .orderBy('createdAtMs', 'asc')
            .onSnapshot(
                (snap: any) => {
                    markBoardMode(boardId, 'cloud');
                    const list: WbStroke[] = [];
                    snap.forEach((doc: any) => list.push({ id: doc.id, ...doc.data() }));
                    onChange(list);
                },
                () => {
                    markBoardMode(boardId, 'local');
                    if (!localUnsub) localUnsub = attachLocal();
                }
            );
        return () => {
            remoteUnsub?.();
            localUnsub?.();
        };
    }

    return attachLocal();
}
