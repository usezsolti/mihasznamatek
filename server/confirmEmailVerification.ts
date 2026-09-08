import { getAdminDb, getFirebaseAdmin } from './firebaseAdmin';
import {
    consumeEmailVerificationToken,
    markEmailVerified,
    readEmailVerifyToken,
    signVerifiedSession,
} from './emailVerificationStore';

export function normalizeVerifyToken(raw: unknown): string {
    let token = String(raw || '').trim();
    try {
        token = decodeURIComponent(token);
    } catch {
        /* already decoded */
    }
    return token.replace(/\s+/g, '').replace(/^<|>$/g, '');
}

export async function confirmEmailVerificationToken(
    rawToken: unknown
): Promise<{ ok: true; email: string; session: string } | { ok: false; error: string }> {
    const token = normalizeVerifyToken(rawToken);
    if (!token || token.length < 16) {
        return { ok: false, error: 'Hiányzik vagy rövid a megerősítő token.' };
    }

    const signed = readEmailVerifyToken(token);
    const consumed = signed
        ? { uid: '', email: signed.email }
        : consumeEmailVerificationToken(token);

    if (!consumed) {
        return {
            ok: false,
            error: 'A link lejárt vagy érvénytelen. Kérj új megerősítő levelet a belépő ablakból.',
        };
    }

    markEmailVerified(consumed.email);

    const admin = getFirebaseAdmin();
    if (admin) {
        try {
            if (consumed.uid) {
                await admin.auth().updateUser(consumed.uid, { emailVerified: true });
            } else {
                const found = await admin.auth().getUserByEmail(consumed.email);
                await admin.auth().updateUser(found.uid, { emailVerified: true });
            }
        } catch (e) {
            console.warn('confirmEmailVerification admin:', e);
        }
        const db = getAdminDb();
        if (db) {
            await db
                .collection('auth_users')
                .doc(consumed.email.replace(/[^a-z0-9@._+-]/g, '_'))
                .set({ emailVerified: true, emailVerifiedAt: new Date().toISOString() }, { merge: true })
                .catch(() => undefined);
        }
    }

    return { ok: true, email: consumed.email, session: signVerifiedSession(consumed.email) };
}
