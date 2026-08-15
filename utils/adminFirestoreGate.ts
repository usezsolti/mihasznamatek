/**
 * Firestore admin read denied — persist across HMR/remounts so we don't
 * re-hit APIs every 15–20s and flood the terminal / DevTools console.
 */

const KEY = 'mihaszna:adminFirestoreDenied';

function read(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        return sessionStorage.getItem(KEY) === '1';
    } catch {
        return false;
    }
}

function write(denied: boolean) {
    if (typeof window === 'undefined') return;
    try {
        if (denied) sessionStorage.setItem(KEY, '1');
        else sessionStorage.removeItem(KEY);
    } catch {
        /* ignore */
    }
}

export function isAdminFirestoreDenied(): boolean {
    return read();
}

export function markAdminFirestoreDenied(): void {
    write(true);
}

/** Call after Publish, or when an explicit Refresh succeeds / is clicked. */
export function clearAdminFirestoreDenied(): void {
    write(false);
}
