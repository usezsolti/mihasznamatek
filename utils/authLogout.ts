import { signOut } from 'next-auth/react';

export async function signOutUser(opts?: { redirectTo?: string }) {
    await signOut({ callbackUrl: opts?.redirectTo || '/' });
}
