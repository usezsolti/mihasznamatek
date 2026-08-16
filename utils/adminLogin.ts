import { signIn, signOut, getSession } from 'next-auth/react';
import { ADMIN_LOGIN_EMAIL } from './adminLoginShared';

/** Egykattintásos admin belépés — Auth.js credentials. */
export { ADMIN_LOGIN_EMAIL };

export async function signInAsAdmin(): Promise<{ uid: string; email: string }> {
    const password = String(process.env.NEXT_PUBLIC_ADMIN_LOGIN_PASSWORD || '').trim();
    // Client cannot read server-only ADMIN_LOGIN_PASSWORD; use dedicated API then session.
    const res = await fetch('/api/auth/admin-session-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.ok) {
        // Fallback: credentials with env-exposed password only if set for local
        if (password) {
            const r = await signIn('credentials', {
                redirect: false,
                email: ADMIN_LOGIN_EMAIL,
                password,
                register: '0',
            });
            if (r?.error) throw new Error(r.error);
        } else {
            throw new Error(
                json?.error ||
                    'Admin belépés sikertelen. Állítsd be az ADMIN_LOGIN_PASSWORD-t a szerveren.'
            );
        }
    }
    await getSession();
    return { uid: String(json?.data?.uid || ''), email: ADMIN_LOGIN_EMAIL };
}

export async function signOutUser(opts?: { redirectTo?: string }) {
    await signOut({ callbackUrl: opts?.redirectTo || '/' });
}
