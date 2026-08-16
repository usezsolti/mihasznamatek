/** Egykattintásos teszt fiók — jelszó csak a szerveren (TEST_LOGIN_PASSWORD). */

export {
    TEST_LOGIN_EMAIL,
    isTestLoginAllowed,
    isTestAuthUser,
} from './testLoginShared';

import { TEST_LOGIN_EMAIL, isTestLoginAllowed } from './testLoginShared';

export function formatAuthError(err: any): string {
    const code = err?.code || '';
    switch (code) {
        case 'auth/too-many-requests':
            return 'Túl sok próbálkozás. Várj egy kicsit.';
        default:
            if (code) return `Hiba: ${code}`;
            return err?.message || 'Ismeretlen hiba a belépésnél.';
    }
}

export async function signInAsTestUser(): Promise<{
    uid: string;
    email: string;
    method: 'session';
}> {
    if (!isTestLoginAllowed()) {
        throw new Error('A teszt belépés ebben a környezetben nem elérhető.');
    }

    const res = await fetch('/api/auth/test-session-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.ok) {
        throw Object.assign(
            new Error(json?.error || 'Teszt belépés sikertelen.'),
            { code: 'auth/invalid-credential' }
        );
    }

    const { getSession } = await import('next-auth/react');
    await getSession();

    return {
        uid: String(json?.data?.uid || ''),
        email: String(json?.data?.email || TEST_LOGIN_EMAIL),
        method: 'session',
    };
}
