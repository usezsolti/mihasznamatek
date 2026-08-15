/** Egykattintásos admin belépés. */

export { ADMIN_LOGIN_EMAIL } from './adminLoginShared';
import { ADMIN_LOGIN_EMAIL } from './adminLoginShared';

async function waitForFirebase(maxAttempts = 50): Promise<any | null> {
    for (let i = 0; i < maxAttempts; i++) {
        const firebase = (window as any).firebase;
        if (firebase?.apps?.length > 0) return firebase;
        await new Promise((r) => setTimeout(r, 100));
    }
    return (window as any).firebase?.apps?.length ? (window as any).firebase : null;
}

async function signInWithPasswordFlexible(
    auth: any,
    email: string,
    password: string
): Promise<{ uid: string; email: string }> {
    try {
        const signed = await auth.signInWithEmailAndPassword(email, password);
        return {
            uid: signed.user.uid,
            email: signed.user.email || email,
        };
    } catch (err: any) {
        const code = String(err?.code || '');
        if (
            code.includes('user-not-found') ||
            code.includes('invalid-credential') ||
            code.includes('invalid-login-credentials')
        ) {
            try {
                const created = await auth.createUserWithEmailAndPassword(email, password);
                try {
                    await created.user.updateProfile({ displayName: 'Tanár' });
                } catch {
                    /* ignore */
                }
                return {
                    uid: created.user.uid,
                    email: created.user.email || email,
                };
            } catch (createErr: any) {
                if (String(createErr?.code || '').includes('email-already-in-use')) {
                    throw err;
                }
                throw createErr;
            }
        }
        throw err;
    }
}

async function ensureAdminUserDoc(
    firebase: any,
    signed: { uid: string; email: string }
): Promise<void> {
    try {
        await firebase.auth().currentUser?.getIdToken(true);
    } catch {
        /* ignore */
    }
    try {
        if (firebase?.firestore) {
            await firebase.firestore().collection('users').doc(signed.uid).set(
                {
                    email: signed.email,
                    name: 'Tanár',
                    updatedAt: firebase.firestore.FieldValue?.serverTimestamp?.() || Date.now(),
                },
                { merge: true }
            );
        }
    } catch {
        /* rules még nem publikálva */
    }
}

export async function signInAsAdmin(): Promise<{ uid: string; email: string }> {
    const firebase = await waitForFirebase();
    if (!firebase?.auth) {
        throw new Error('A Firebase nem töltődött be. Frissítsd az oldalt.');
    }
    const auth = firebase.auth();
    try {
        const Persistence = firebase?.auth?.Auth?.Persistence;
        if (Persistence?.LOCAL && typeof auth.setPersistence === 'function') {
            await auth.setPersistence(Persistence.LOCAL);
        }
    } catch {
        /* ignore */
    }

    let signed: { uid: string; email: string } | null = null;

    try {
        const { apiPost } = await import('./apiClient');
        const res = await apiPost<{
            customToken?: string;
            email?: string;
            oneTimePassword?: string;
            method?: string;
        }>('/api/auth/admin-quick-login', {});

        if (res.ok) {
            const data = res.data || {};
            if (data.customToken) {
                const cred = await auth.signInWithCustomToken(data.customToken);
                try {
                    // Claim-ek (isAdminAccount) azonnal legyenek a tokenben
                    await cred.user.getIdToken(true);
                } catch {
                    /* ignore */
                }
                signed = {
                    uid: cred.user.uid,
                    email: cred.user.email || data.email || ADMIN_LOGIN_EMAIL,
                };
            } else if (data.oneTimePassword && data.email) {
                signed = await signInWithPasswordFlexible(auth, data.email, data.oneTimePassword);
            }
        } else if (res.error) {
            console.warn('admin-quick-login:', res.error);
        }
    } catch (e) {
        console.warn('admin-quick-login request failed:', e);
    }

    if (!signed) {
        throw new Error(
            'Admin belépés sikertelen. Állítsd be a szerveren az ADMIN_LOGIN_PASSWORD-t és/vagy a Firebase Admin SDK-t (FIREBASE_SERVICE_ACCOUNT_JSON).'
        );
    }

    await ensureAdminUserDoc(firebase, signed);
    return signed;
}
