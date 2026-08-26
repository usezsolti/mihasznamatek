/** Egykattintásos teszt fiók — jelszó csak a szerveren (TEST_LOGIN_PASSWORD). */

export {
    TEST_LOGIN_EMAIL,
    isTestLoginAllowed,
    isTestAuthUser,
} from './testLoginShared';

import { TEST_LOGIN_EMAIL, isTestLoginAllowed } from './testLoginShared';
import { waitForFirebase } from './firebaseReady';

/** Normalize Firebase auth error codes from .code or message text. */
export function authErrorCode(err: any): string {
    const raw = String(err?.code || '').trim().toLowerCase();
    if (raw.startsWith('auth/')) return raw;
    const fromMsg = String(err?.message || '').match(/auth\/[a-z0-9-]+/i);
    return (fromMsg?.[0] || raw).toLowerCase();
}

export function formatAuthError(err: any): string {
    const code = authErrorCode(err);
    switch (code) {
        case 'auth/operation-not-allowed':
            return 'Ez a belépési mód ki van kapcsolva a Firebase-ben.';
        case 'auth/unauthorized-domain':
            return 'Ez a domain nincs az Authorized domains listán a Firebase-ben.';
        case 'auth/network-request-failed':
            return 'Hálózati hiba — ellenőrizd az internetet / adblokkolót.';
        case 'auth/too-many-requests':
            return 'Túl sok próbálkozás (Firebase limit). Várj 15–60 percet, nézd a Spam mappát. A megerősítő levelet a Firebase küldi — nem a Gmail App Password.';
        case 'auth/invalid-login-credentials':
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Hibás e-mail cím vagy jelszó. Ha Google-lal regisztráltál, használd a „Google” gombot, vagy állíts be jelszót: Firebase Console → Authentication → Users.';
        case 'auth/email-already-in-use':
            return 'Ez az e-mail már regisztrálva van — próbálj bejelentkezni.';
        case 'auth/weak-password':
            return 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
        case 'auth/invalid-email':
            return 'Érvénytelen e-mail cím.';
        default:
            if (code.includes('invalid-login') || code.includes('invalid-credential')) {
                return 'Hibás e-mail cím vagy jelszó. Ha Google-lal regisztráltál, használd a „Google” gombot.';
            }
            if (code) return `Hiba: ${code}`;
            return err?.message || 'Ismeretlen hiba a belépésnél.';
    }
}

async function ensureAuthPersistence(auth: any, firebase: any) {
    try {
        const Persistence = firebase?.auth?.Auth?.Persistence;
        if (Persistence?.LOCAL && typeof auth.setPersistence === 'function') {
            await auth.setPersistence(Persistence.LOCAL);
        }
    } catch {
        /* ignore */
    }
}

async function ensureTestUserDoc(firebase: any, user: any) {
    if (!user?.uid || !firebase?.firestore) return;
    try {
        const db = firebase.firestore();
        const ref = db.collection('users').doc(user.uid);
        const snap = await ref.get();
        const payload: Record<string, unknown> = {
            email: user.email || TEST_LOGIN_EMAIL,
            name: user.displayName || 'Teszt Felhasználó',
            isTestAccount: true,
        };
        if (!snap.exists) {
            payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await ref.set(payload);
        } else {
            await ref.set(payload, { merge: true });
        }
    } catch {
        /* ignore */
    }
}

async function signInAnonymously(auth: any, firebase: any) {
    const cred = await auth.signInAnonymously();
    if (!cred.user) throw new Error('Anonim belépés sikertelen.');
    try {
        await cred.user.updateProfile({ displayName: 'Teszt Felhasználó' });
    } catch {
        /* ignore */
    }
    await ensureTestUserDoc(firebase, cred.user);
    return {
        uid: cred.user.uid,
        email: cred.user.email || 'teszt-vendeg (anonim)',
        method: 'anonymous' as const,
    };
}

export async function signInAsTestUser(): Promise<{
    uid: string;
    email: string;
    method: 'email' | 'anonymous';
}> {
    if (!isTestLoginAllowed()) {
        throw new Error('A teszt belépés ebben a környezetben nem elérhető.');
    }
    const firebase = await waitForFirebase();
    if (!firebase?.auth) {
        throw new Error('A Firebase nem töltődött be. Frissítsd az oldalt.');
    }
    const auth = firebase.auth();
    await ensureAuthPersistence(auth, firebase);

    try {
        const { apiTestLogin } = await import('./apiClient');
        const res = await apiTestLogin();
        if (!res.ok) {
            throw Object.assign(new Error(res.error || 'Teszt belépés sikertelen.'), {
                code: 'auth/invalid-credential',
            });
        }
        const data = res.data || {};

        if (data.customToken) {
            const signed = await auth.signInWithCustomToken(data.customToken);
            await ensureTestUserDoc(firebase, signed.user);
            return {
                uid: signed.user.uid,
                email: signed.user.email || TEST_LOGIN_EMAIL,
                method: 'email',
            };
        }

        if (data.oneTimePassword && data.email) {
            const signed = await auth.signInWithEmailAndPassword(data.email, data.oneTimePassword);
            await ensureTestUserDoc(firebase, signed.user);
            return {
                uid: signed.user.uid,
                email: TEST_LOGIN_EMAIL,
                method: 'email',
            };
        }

        throw new Error('A szerver nem adott belépési credentialt.');
    } catch (emailErr: any) {
        try {
            return await signInAnonymously(auth, firebase);
        } catch (anonErr: any) {
            const combined = new Error(
                formatAuthError(emailErr) + ' | Anonim: ' + formatAuthError(anonErr)
            );
            (combined as any).code = anonErr?.code || emailErr?.code;
            throw combined;
        }
    }
}
