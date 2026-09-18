/**
 * gameResults kliens olvasás — rules: userId VAGY uid == auth.uid
 * Permission denied → üres lista (ne dobjon piros overlay-t).
 */
export type GameResultDoc = { id: string; [k: string]: unknown };

function isPermissionError(err: unknown): boolean {
    const code = String((err as any)?.code || '');
    const msg = String((err as any)?.message || err || '');
    return (
        code.includes('permission-denied') ||
        /Missing or insufficient permissions/i.test(msg) ||
        /PERMISSION_DENIED/i.test(msg)
    );
}

export async function fetchGameResultsForUser(userId: string): Promise<{
    results: GameResultDoc[];
    source: 'userId' | 'uid' | 'empty';
    permissionDenied: boolean;
}> {
    const db = (window as any).firebase?.firestore?.();
    if (!db || !userId) {
        return { results: [], source: 'empty', permissionDenied: false };
    }

    const mapSnap = (snap: any): GameResultDoc[] => {
        const rows: GameResultDoc[] = [];
        snap.forEach((doc: any) => rows.push({ id: doc.id, ...doc.data() }));
        return rows;
    };

    const byId = new Map<string, GameResultDoc>();
    let permissionDenied = false;
    let source: 'userId' | 'uid' | 'empty' = 'empty';

    try {
        const snap = await db.collection('gameResults').where('userId', '==', userId).get();
        mapSnap(snap).forEach((row) => byId.set(row.id, row));
        if (byId.size) source = 'userId';
    } catch (err) {
        permissionDenied = isPermissionError(err);
    }

    try {
        const snap = await db.collection('gameResults').where('uid', '==', userId).get();
        mapSnap(snap).forEach((row) => byId.set(row.id, row));
        if (source === 'empty' && byId.size) source = 'uid';
    } catch (err) {
        permissionDenied = permissionDenied || isPermissionError(err);
        if (!permissionDenied && !isPermissionError(err)) {
            console.warn('gameResults load failed:', err);
        }
    }

    return {
        results: Array.from(byId.values()),
        source: byId.size ? source : 'empty',
        permissionDenied: permissionDenied && byId.size === 0,
    };
}
