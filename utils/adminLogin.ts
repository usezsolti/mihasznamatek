/** Tanári belépés — csak usezsolti@gmail.com + saját jelszó (nincs nyilvános egykattintás). */

export { ADMIN_LOGIN_EMAIL, ADMIN_GATE_PATH } from './adminLoginShared';
import { ADMIN_LOGIN_EMAIL } from './adminLoginShared';
import { isAdminEmail } from './admin';
import { waitForFirebase } from './firebaseReady';
import { formatAuthError, authErrorCode } from './testLogin';

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
 * Opcionális email: ha megadod, csak admin e-mail fogadható el.
 */
export async function signInAsAdmin(
    password: string,
    emailOverride?: string
): Promise<{ uid: string; email: string }> {
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

    const email = String(emailOverride || ADMIN_LOGIN_EMAIL)
        .trim()
        .toLowerCase();
    if (!isAdminEmail(email)) {
        throw new Error('Ez az e-mail nem tanári fiók.');
    }

    let cred: any;
    try {
        cred = await auth.signInWithEmailAndPassword(email, pwd);
    } catch (err: any) {
        const code = authErrorCode(err);
        // #region agent log
        let methods: string[] = [];
        try {
            methods = await auth.fetchSignInMethodsForEmail(email);
        } catch {
            /* ignore */
        }
        const { agentDebugLog } = await import('./agentDebugLog');
        agentDebugLog({
            hypothesisId: 'L2',
            location: 'adminLogin.ts:signInAsAdmin',
            message: 'teacher sign-in failed',
            data: {
                code,
                methods,
                emailIsPrimary: email === ADMIN_LOGIN_EMAIL,
            },
            runId: 'login-debug',
        });
        // #endregion

        if (methods.length && !methods.includes('password')) {
            throw new Error(
                'Ehhez az e-mailhez nincs jelszavas belépés (csak Google). Firebase Console → Authentication → Users → állíts be jelszót, vagy használd a Google-belépést a főoldalon.'
            );
        }
        if (code.includes('user-not-found') || (methods.length === 0 && code.includes('invalid-login'))) {
            throw new Error(
                'Nincs ilyen e-mail/jelszó fiók. Firebase Console → Authentication → Users: hozd létre / állíts jelszót a usezsolti@gmail.com fiókra. (A Gmail App Password az e-mailküldéshez van — azzal nem lehet belépni.)'
            );
        }
        if (
            code.includes('wrong-password') ||
            code.includes('invalid-credential') ||
            code.includes('invalid-login-credentials')
        ) {
            throw new Error(
                'Hibás jelszó. Használd a Firebase Authentication jelszót — NEM a Gmail webes jelszót, és NEM a GMAIL_APP_PASSWORD-öt (.env.local).'
            );
        }
        throw new Error(formatAuthError(err) || err?.message || 'Tanári belépés sikertelen.');
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
