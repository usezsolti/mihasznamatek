/** Egykattintásos teszt fiók — e-mail/jelszó, ha nem megy: anonim Firebase auth. */

export const TEST_LOGIN_EMAIL = "teszt@mihasznamatek.hu";
export const TEST_LOGIN_PASSWORD = "teszt123456";

export function formatAuthError(err: any): string {
    const code = err?.code || "";
    switch (code) {
        case "auth/operation-not-allowed":
            return "Ez a belépési mód ki van kapcsolva a Firebase-ben (Email/Password vagy Anonymous). Kapcsold be: Firebase Console → Authentication → Sign-in method.";
        case "auth/unauthorized-domain":
            return "Ez a domain nincs az Authorized domains listán a Firebase-ben.";
        case "auth/invalid-email":
            return "Érvénytelen e-mail cím.";
        case "auth/weak-password":
            return "A jelszó túl gyenge (min. 6 karakter).";
        case "auth/email-already-in-use":
            return "Ez az e-mail már foglalt, de a jelszó nem egyezik. Állítsd vissza a jelszót a Firebase Console-ban, vagy töröld a fiókot.";
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
            return "Hibás e-mail vagy jelszó (vagy a fiók más jelszóval létezik).";
        case "auth/user-not-found":
            return "Nincs ilyen felhasználó.";
        case "auth/network-request-failed":
            return "Hálózati hiba — ellenőrizd az internetet / adblokkolót.";
        case "auth/too-many-requests":
            return "Túl sok próbálkozás. Várj egy kicsit.";
        case "permission-denied":
            return "Firestore jogosultság hiba (a belépés ettől még sikerülhet).";
        default:
            if (code) return `Hiba: ${code}`;
            return err?.message || "Ismeretlen hiba a belépésnél.";
    }
}

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
    if (!user?.uid || !firebase?.firestore) return;
    try {
        const db = firebase.firestore();
        const ref = db.collection("users").doc(user.uid);
        const snap = await ref.get();
        const payload: Record<string, unknown> = {
            email: user.email || TEST_LOGIN_EMAIL,
            name: user.displayName || "Teszt Felhasználó",
            isTestAccount: true,
            preferredLessonType: "online",
            preferredSubject: "emelt-erettsegi",
        };
        if (!snap.exists) {
            payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await ref.set(payload);
        } else {
            await ref.set(payload, { merge: true });
        }
    } catch (e) {
        // A belépés sikeres lehet Firestore szabályok nélkül is
        console.warn("ensureTestUserDoc skipped:", e);
    }
}

async function signInWithEmail(auth: any, firebase: any) {
    try {
        const cred = await auth.signInWithEmailAndPassword(TEST_LOGIN_EMAIL, TEST_LOGIN_PASSWORD);
        await ensureTestUserDoc(firebase, cred.user);
        return { uid: cred.user.uid, email: TEST_LOGIN_EMAIL, method: "email" as const };
    } catch (err: any) {
        const code = err?.code || "";
        const canCreate =
            code === "auth/user-not-found" ||
            code === "auth/invalid-credential" ||
            code === "auth/wrong-password" ||
            code === "auth/invalid-login-credentials";

        if (!canCreate) throw err;

        try {
            const created = await auth.createUserWithEmailAndPassword(
                TEST_LOGIN_EMAIL,
                TEST_LOGIN_PASSWORD
            );
            if (!created.user) throw created;
            try {
                await created.user.updateProfile({ displayName: "Teszt Felhasználó" });
            } catch {
                /* ignore */
            }
            await ensureTestUserDoc(firebase, created.user);
            return { uid: created.user.uid, email: TEST_LOGIN_EMAIL, method: "email" as const };
        } catch (createErr: any) {
            if (createErr?.code === "auth/email-already-in-use") {
                // Létezik, de a jelszó nem stimmel → ne bukjunk el néma hibán
                throw createErr;
            }
            throw createErr;
        }
    }
}

async function signInAnonymously(auth: any, firebase: any) {
    const cred = await auth.signInAnonymously();
    if (!cred.user) throw new Error("Anonim belépés sikertelen.");
    try {
        await cred.user.updateProfile({ displayName: "Teszt Felhasználó" });
    } catch {
        /* ignore */
    }
    await ensureTestUserDoc(firebase, cred.user);
    return {
        uid: cred.user.uid,
        email: cred.user.email || "teszt-vendeg (anonim)",
        method: "anonymous" as const,
    };
}

/**
 * Bejelentkezik a teszt fiókkal.
 * 1) Email/Password  2) ha az ki van kapcsolva → Anonymous
 */
export async function signInAsTestUser(): Promise<{
    uid: string;
    email: string;
    method: "email" | "anonymous";
}> {
    const firebase = await waitForFirebase();
    if (!firebase?.auth) {
        throw new Error("A Firebase nem töltődött be. Frissítsd az oldalt.");
    }
    const auth = firebase.auth();

    try {
        return await signInWithEmail(auth, firebase);
    } catch (emailErr: any) {
        const code = emailErr?.code || "";
        // Email provider ki van kapcsolva, vagy egyéb config hiba → anonim
        if (
            code === "auth/operation-not-allowed" ||
            code === "auth/admin-restricted-operation" ||
            code === "auth/configuration-not-found"
        ) {
            try {
                return await signInAnonymously(auth, firebase);
            } catch (anonErr: any) {
                const combined = new Error(
                    formatAuthError(emailErr) +
                        " | Anonim fallback: " +
                        formatAuthError(anonErr)
                );
                (combined as any).code = anonErr?.code || emailErr?.code;
                throw combined;
            }
        }
        // Ha a jelszó nem stimmel egy meglévő fióknál, próbáljunk anonimot is (teszt célra)
        if (code === "auth/email-already-in-use" || code === "auth/invalid-credential" || code === "auth/wrong-password") {
            try {
                return await signInAnonymously(auth, firebase);
            } catch {
                throw emailErr;
            }
        }
        throw emailErr;
    }
}
