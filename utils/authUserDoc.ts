import type { RegistrationProfile } from './registrationProfile';

export function mapFirebaseAuthError(code?: string): string {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'Ez az e-mail cím már regisztrálva van. Próbálj bejelentkezni!';
        case 'auth/invalid-email':
            return 'Érvénytelen e-mail cím.';
        case 'auth/weak-password':
            return 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
            return 'Hibás e-mail cím vagy jelszó. Ha Google-lal regisztráltál, használd a „Google” gombot.';
        case 'auth/user-not-found':
            return 'Nincs ilyen felhasználó. Regisztrálj előbb!';
        case 'auth/too-many-requests':
            return 'Túl sok próbálkozás (Firebase limit). Várj 15–60 percet, nézd a Spam mappát (feladó gyakran noreply@…firebaseapp.com). A megerősítő levelet a Firebase küldi — nem a Gmail App Password.';
        case 'auth/popup-closed-by-user':
            return 'A bejelentkezési ablak bezáródott, mielőtt befejeződött volna.';
        case 'auth/popup-blocked':
            return 'A böngésző blokkolta a bejelentkezési ablakot. Engedd meg a felugró ablakokat.';
        case 'auth/account-exists-with-different-credential':
            return 'Ez az e-mail cím már egy másik bejelentkezési móddal van regisztrálva.';
        case 'auth/operation-not-allowed':
            return 'Ez a bejelentkezési mód ki van kapcsolva. Firebase Console → Authentication → Sign-in method: kapcsold be az Email/Password (és/vagy Anonymous) opciót.';
        case 'auth/unauthorized-domain':
            return 'Ez a domain nincs engedélyezve a Firebase-ben (Authorized domains).';
        case 'auth/network-request-failed':
            return 'Hálózati hiba — ellenőrizd az internetet / adblokkolót.';
        default:
            if (code && /invalid-login|invalid-credential/i.test(code)) {
                return 'Hibás e-mail cím vagy jelszó. Ha Google-lal regisztráltál, használd a „Google” gombot.';
            }
            return code ? `Hiba történt (${code}).` : 'Hiba történt. Kérjük, próbáld újra.';
    }
}

export async function ensureUserDoc(
    firebase: any,
    user: any,
    options?: {
        name?: string;
        gdprAccepted?: boolean;
        profile?: RegistrationProfile;
    }
): Promise<void> {
    if (!user) return;
    const db = firebase.firestore();
    const ref = db.collection('users').doc(user.uid);
    const snap = await ref.get();
    const gdprFields = options?.gdprAccepted
        ? {
              gdprAccepted: true,
              gdprAcceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
              gdprVersion: '2026-08-03',
          }
        : {};
    const profileFields = options?.profile
        ? {
              name: options.profile.name,
              preferredLessonType: options.profile.preferredLessonType,
              preferredSubject: options.profile.preferredSubject,
              hobby: options.profile.hobby || '',
              postalCode: options.profile.postalCode,
              street: options.profile.street,
              houseNumber: options.profile.houseNumber,
              profileCompletedAt: firebase.firestore.FieldValue.serverTimestamp(),
          }
        : { name: options?.name || user.displayName || '' };

    if (!snap.exists) {
        await ref.set({
            email: user.email || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...profileFields,
            ...gdprFields,
        });
    } else {
        await ref.set(
            {
                ...profileFields,
                ...gdprFields,
                email: user.email || snap.data()?.email || '',
            },
            { merge: true }
        );
    }
}

export function isEmailPasswordUser(user: any): boolean {
    const providers = user?.providerData || [];
    return providers.some((p: any) => p?.providerId === 'password');
}

/**
 * Firebase Auth verification email.
 * Preferált: Gmail („Mihaszna Matek”) — Admin oob VAGY saját token.
 * Firebase noreply csak akkor, ha nincs GMAIL_APP_PASSWORD.
 */
export async function sendVerificationEmail(
    user: any
): Promise<{ provider: string; hint?: string; verifyLink?: string }> {
    if (!user?.getIdToken) {
        throw new Error('Nincs bejelentkezett felhasználó a megerősítő levélhez.');
    }

    let apiHint = '';

    try {
        const token = await user.getIdToken();
        const res = await fetch('/api/auth/send-verification-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: '{}',
        });
        const json = await res.json().catch(() => ({}));
        apiHint = String(json?.error || json?.data?.hint || '').slice(0, 280);
        // #region agent log
        const { agentDebugLog } = await import('./agentDebugLog');
        agentDebugLog({
            hypothesisId: 'S1-S2',
            location: 'authUserDoc.ts:sendVerificationEmail',
            message: 'api verification response',
            data: {
                httpOk: res.ok,
                status: res.status,
                provider: json?.data?.provider || null,
                mode: json?.data?.mode || null,
                hasVerifyLink: Boolean(json?.data?.verifyLink),
                fallback: json?.data?.fallback || null,
                alreadyVerified: Boolean(json?.data?.alreadyVerified),
                hint: apiHint.slice(0, 120),
            },
            runId: 'spam-deliverability',
        });
        // #endregion
        if (res.ok && json?.ok && json?.data?.provider === 'gmail') {
            return {
                provider: 'gmail',
                verifyLink: json?.data?.verifyLink || undefined,
            };
        }
        if (res.ok && json?.ok && json?.data?.alreadyVerified) {
            return { provider: 'already' };
        }
        if (!res.ok) {
            throw new Error(apiHint || 'A megerősítő e-mailt nem sikerült elküldeni.');
        }
        if (res.ok && json?.ok && json?.data?.fallback === 'firebase') {
            /* fall through to firebase */
        } else {
            throw new Error(apiHint || 'A megerősítő e-mailt nem sikerült elküldeni.');
        }
    } catch (err: any) {
        if (String(err?.message || '').includes('Gmail') || String(err?.message || '').includes('megerősítő')) {
            throw err;
        }
        // #region agent log
        const { agentDebugLog } = await import('./agentDebugLog');
        agentDebugLog({
            hypothesisId: 'H3',
            location: 'authUserDoc.ts:sendVerificationEmail:catch',
            message: 'api call failed, falling back to firebase',
            data: { err: String(err?.message || err).slice(0, 120) },
            runId: 'spam-deliverability',
        });
        // #endregion
    }

    if (!user?.sendEmailVerification) {
        throw new Error('Nincs bejelentkezett felhasználó a megerősítő levélhez.');
    }
    await user.sendEmailVerification();
    // #region agent log
    {
        const { agentDebugLog } = await import('./agentDebugLog');
        agentDebugLog({
            hypothesisId: 'H1',
            location: 'authUserDoc.ts:sendVerificationEmail:firebase',
            message: 'sent via firebase sendEmailVerification (noreply sender)',
            data: { provider: 'firebase' },
            runId: 'spam-deliverability',
        });
    }
    // #endregion
    return { provider: 'firebase', hint: apiHint || undefined };
}

/** App-szintű megerősítés (Gmail custom token), Firebase emailVerified mellett. */
export async function checkAppEmailVerified(user: any): Promise<boolean> {
    if (!user?.getIdToken) return false;
    if (user.emailVerified) return true;
    try {
        const token = await user.getIdToken();
        const res = await fetch('/api/auth/verification-status', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json().catch(() => ({}));
        return Boolean(res.ok && json?.ok && json?.data?.verified);
    } catch {
        return false;
    }
}

/** Fejlesztéshez: NEXT_PUBLIC_SKIP_EMAIL_VERIFY=1 → nem blokkolja a belépést. */
export function skipEmailVerification(): boolean {
    return String(process.env.NEXT_PUBLIC_SKIP_EMAIL_VERIFY || '') === '1';
}
