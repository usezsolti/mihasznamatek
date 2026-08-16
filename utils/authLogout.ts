/**
 * Megbízható kijelentkezés — Firebase session + UI állapot.
 */

export const AUTH_LOGOUT_EVENT = 'mihaszna:auth-logout';

export async function signOutUser(opts?: { redirectTo?: string }): Promise<void> {
    if (typeof window === 'undefined') return;

    // Azonnal jelezzük a UI-nak (ne várjon a Firebase callbackre)
    try {
        sessionStorage.setItem('mihaszna:justLoggedOut', '1');
        window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
    } catch {
        /* ignore */
    }

    try {
        const firebase = (window as any).firebase;
        const auth = firebase?.auth?.();
        if (auth?.signOut) {
            await auth.signOut();
        }
    } catch (err) {
        console.warn('signOut failed:', String((err as any)?.message || err).slice(0, 120));
    }

    const dest = opts?.redirectTo ?? '/';
    try {
        // Hard navigáció — tiszta állapot (dashboard admin state is eldobódik)
        window.location.assign(dest);
    } catch {
        window.location.href = dest;
    }
}
