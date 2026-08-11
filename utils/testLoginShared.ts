/** Shared (client+server) — NEM tartalmaz jelszót. */

export const TEST_LOGIN_EMAIL = 'teszt@mihasznamatek.hu';

/** Csak fejlesztői / explicit flag mellett. */
export function isTestLoginAllowed(): boolean {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
        return String(process.env.NEXT_PUBLIC_ALLOW_TEST_LOGIN || '') === '1';
    }
    return true;
}

export function isTestAuthUser(user: any): boolean {
    if (!user) return false;
    const email = String(user.email || '').trim().toLowerCase();
    if (email && email === TEST_LOGIN_EMAIL.toLowerCase()) return true;
    if (user.isAnonymous && String(user.displayName || '').toLowerCase().includes('teszt')) {
        return true;
    }
    return false;
}
