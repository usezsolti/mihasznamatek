/** Egykattintásos teszt fiók Firebase e-mail/jelszó belépéshez. */

export const TEST_LOGIN_EMAIL = "teszt@mihasznamatek.hu";
export const TEST_LOGIN_PASSWORD = "teszt123456";

async function waitForFirebase(maxAttempts = 50): Promise<any | null> {
    for (let i = 0; i < maxAttempts; i++) {
        const firebase = (window as any).firebase;
        if (firebase?.apps?.length > 0) return firebase;
        if (firebase && !firebase.apps?.length && (window as any).__FIREBASE_CONFIG__) {
            try {
                firebase.initializeApp((window as any).__FIREBASE_CONFIG__);
                return firebase;
            } catch {
                /* init folyamatban */
            }
        }
        await new Promise((r) => setTimeout(r, 100));
    }
    return (window as any).firebase?.apps?.length ? (window as any).firebase : null;
}

async function ensureTestUserDoc(firebase: any, user: any) {
    if (!user) return;
    const db = firebase.firestore();
    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();
    const payload = {
        email: TEST_LOGIN_EMAIL,
        name: "Teszt Felhasználó",
        isTestAccount: true,
        preferredLessonType: "online",
        preferredSubject: "emelt-erettsegi",
    };
    if (!snap.exists) {
        await ref.set({
            ...payload,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } else {
        await ref.set(payload, { merge: true });
    }
}

/**
 * Bejelentkezik a teszt fiókkal; ha még nincs, létrehozza.
 * Nem vár e-mail megerősítést (teszt célra).
 */
export async function signInAsTestUser(): Promise<{ uid: string; email: string }> {
    const firebase = await waitForFirebase();
    if (!firebase?.auth) {
        throw new Error("A Firebase nem töltődött be. Frissítsd az oldalt.");
    }
    const auth = firebase.auth();

    try {
        const cred = await auth.signInWithEmailAndPassword(TEST_LOGIN_EMAIL, TEST_LOGIN_PASSWORD);
        await ensureTestUserDoc(firebase, cred.user);
        return { uid: cred.user.uid, email: TEST_LOGIN_EMAIL };
    } catch (err: any) {
        const code = err?.code || "";
        if (
            code === "auth/user-not-found" ||
            code === "auth/invalid-credential" ||
            code === "auth/wrong-password" ||
            code === "auth/invalid-login-credentials"
        ) {
            try {
                const created = await auth.createUserWithEmailAndPassword(
                    TEST_LOGIN_EMAIL,
                    TEST_LOGIN_PASSWORD
                );
                if (created.user) {
                    try {
                        await created.user.updateProfile({ displayName: "Teszt Felhasználó" });
                    } catch {
                        /* ignore */
                    }
                    await ensureTestUserDoc(firebase, created.user);
                    return { uid: created.user.uid, email: TEST_LOGIN_EMAIL };
                }
            } catch (createErr: any) {
                // Ha közben már létezik, próbáljuk újra a belépést
                if (createErr?.code === "auth/email-already-in-use") {
                    const cred = await auth.signInWithEmailAndPassword(
                        TEST_LOGIN_EMAIL,
                        TEST_LOGIN_PASSWORD
                    );
                    await ensureTestUserDoc(firebase, cred.user);
                    return { uid: cred.user.uid, email: TEST_LOGIN_EMAIL };
                }
                throw createErr;
            }
        }
        throw err;
    }

    throw new Error("Nem sikerült a teszt belépés.");
}
