/**
 * Egységes Firebase bootstrap várakozás (kliens).
 */

export async function waitForFirebase(
    maxAttempts = 50,
    delayMs = 100
): Promise<any | null> {
    if (typeof window === 'undefined') return null;

    for (let i = 0; i < maxAttempts; i++) {
        const firebase = (window as any).firebase;
        if (firebase?.apps?.length > 0) return firebase;
        if (firebase && !firebase.apps?.length && (window as any).__FIREBASE_CONFIG__) {
            try {
                firebase.initializeApp((window as any).__FIREBASE_CONFIG__);
                if (firebase.apps?.length > 0) return firebase;
            } catch {
                /* init folyamatban */
            }
        }
        await new Promise((r) => setTimeout(r, delayMs));
    }

    const firebase = (window as any).firebase;
    return firebase?.apps?.length ? firebase : null;
}
