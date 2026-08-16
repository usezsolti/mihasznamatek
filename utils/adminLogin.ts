/** Tanári belépés — csak usezsolti@gmail.com + saját jelszó (nincs nyilvános egykattintás). */

export { ADMIN_LOGIN_EMAIL } from './adminLoginShared';
import { ADMIN_LOGIN_EMAIL } from './adminLoginShared';
import { isAdminEmail } from './admin';

async function waitForFirebase(maxAttempts = 50): Promise<any | null> {
    for (let i = 0; i < maxAttempts; i++) {
        const firebase = (window as any).firebase;
        if (firebase?.apps?.length > 0) return firebase;
        await new Promise((r) => setTimeout(r, 100));
    }
    return (window as any).firebase?.apps?.length ? (window as any).firebase : null;
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

/**
 * Csak a kijelölt admin e-mail + jelszó. Nem hoz létre fiókot, nem használ
 * szerveres jelszó-relayt (az bárkit beengedne).
 */
export async function signInAsAdmin(password: string): Promise<{ uid: string; email: string }> {
    const pwd = String(password || '').trim();
    if (!pwd) {
        throw new Error('Add meg a tanári jelszót.');
    }

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

    const email = ADMIN_LOGIN_EMAIL.toLowerCase();
    let cred: any;
    try {
        cred = await auth.signInWithEmailAndPassword(email, pwd);
    } catch (err: any) {
        const code = String(err?.code || '');
        if (code.includes('user-not-found')) {
            throw new Error('Nincs tanári fiók ezzel az e-maillel a Firebase-ben.');
        }
        if (
            code.includes('wrong-password') ||
            code.includes('invalid-credential') ||
            code.includes('invalid-login-credentials')
        ) {
            throw new Error('Hibás tanári jelszó.');
        }
        throw new Error(err?.message || 'Tanári belépés sikertelen.');
    }

    const signedEmail = String(cred.user?.email || email).toLowerCase();
    if (!isAdminEmail(signedEmail)) {
        try {
            await auth.signOut();
        } catch {
            /* ignore */
        }
        throw new Error('Ez a fiók nem tanári admin.');
    }

    const signed = {
        uid: String(cred.user.uid),
        email: signedEmail,
    };
    await ensureAdminUserDoc(firebase, signed);
    return signed;
}
