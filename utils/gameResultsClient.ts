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

    try {
        const snap = await db.collection('gameResults').where('userId', '==', userId).get();
        return { results: mapSnap(snap), source: 'userId', permissionDenied: false };
    } catch (err) {
        const denied = isPermissionError(err);
        try {
            const snap = await db.collection('gameResults').where('uid', '==', userId).get();
            return { results: mapSnap(snap), source: 'uid', permissionDenied: false };
        } catch (err2) {
            if (!denied && !isPermissionError(err2)) {
                console.warn('gameResults load failed:', err2);
            }
            return {
                results: [],
                source: 'empty',
                permissionDenied: denied || isPermissionError(err2),
            };
        }
    }
}
