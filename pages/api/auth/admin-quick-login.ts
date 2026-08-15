import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getFirebaseAdmin } from '../../../server/firebaseAdmin';
import { ADMIN_LOGIN_EMAIL } from '../../../utils/adminLoginShared';
import { resolveFirebaseWebApiKey } from '../../../utils/firebasePublicConfig';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../utils/apiSecurity';

const DEFAULT_ADMIN_PASSWORD = 'Dont4getbjj';

type IdToolkitAuth = {
    idToken?: string;
    refreshToken?: string;
    localId?: string;
    email?: string;
    error?: { message?: string };
};

async function idToolkit(
    path: 'signInWithPassword' | 'signUp',
    email: string,
    password: string
): Promise<IdToolkitAuth> {
    const key = resolveFirebaseWebApiKey();
    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:${path}?key=${encodeURIComponent(key)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
    );
    return (await res.json().catch(() => ({}))) as IdToolkitAuth;
}

/**
 * POST /api/auth/admin-quick-login
 * Egykattintás — Admin SDK vagy Identity Toolkit (signIn / signUp).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`admin-quick-login:${ip}`, 20, 60 * 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok próbálkozás.', 429);
    }

    const email = (process.env.ADMIN_LOGIN_EMAIL || ADMIN_LOGIN_EMAIL).trim().toLowerCase();
    const password = process.env.ADMIN_LOGIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

    // 1) Firebase Admin SDK (ha van)
    try {
        const admin = getFirebaseAdmin();
        if (admin?.auth) {
            const user = await admin
                .auth()
                .getUserByEmail(email)
                .catch(async () =>
                    admin.auth().createUser({
                        email,
                        password,
                        emailVerified: true,
                        displayName: 'Admin',
                    })
                );
            try {
                await admin.auth().updateUser(user.uid, { password, emailVerified: true });
            } catch {
                /* ignore */
            }
            try {
                await admin.auth().setCustomUserClaims(user.uid, { isAdminAccount: true });
            } catch {
                /* ignore */
            }
            const customToken = await admin.auth().createCustomToken(user.uid, {
                isAdminAccount: true,
            });
            return sendOk(res, {
                customToken,
                email,
                localId: user.uid,
                method: 'custom',
            });
        }
    } catch (e) {
        console.warn('admin-quick-login admin sdk skipped:', e);
    }

    // 2) Identity Toolkit REST — nincs Admin SDK sem kell
    try {
        let auth = await idToolkit('signInWithPassword', email, password);
        const msg = String(auth.error?.message || '');

        if (msg.includes('EMAIL_NOT_FOUND')) {
            auth = await idToolkit('signUp', email, password);
        } else if (msg.includes('INVALID_PASSWORD') || msg.includes('INVALID_LOGIN_CREDENTIALS')) {
            // Létező fiók, más jelszó — próbáljunk Admin nélkül sem tudjuk átírni.
            // Gmail alias fiók létrehozása egykattintáshoz:
            const alias = email.includes('+')
                ? email
                : email.replace('@', '+mihaadmin@');
            let aliasAuth = await idToolkit('signInWithPassword', alias, password);
            const aliasMsg = String(aliasAuth.error?.message || '');
            if (aliasMsg.includes('EMAIL_NOT_FOUND')) {
                aliasAuth = await idToolkit('signUp', alias, password);
            }
            if (aliasAuth.idToken && !aliasAuth.error?.message) {
                return sendOk(res, {
                    email: alias,
                    oneTimePassword: password,
                    idToken: aliasAuth.idToken,
                    localId: aliasAuth.localId,
                    method: 'password-relay-alias',
                });
            }
            return sendErr(
                res,
                'Az admin e-mailhez tartozó Firebase jelszó nem egyezik. Állítsd a jelszót Dont4getbjj-re a Firebase Console → Authentication alatt, vagy add hozzá a service accountot.',
                401
            );
        }

        if (auth.error?.message && !auth.idToken) {
            return sendErr(res, `Firebase: ${auth.error.message}`, 400);
        }

        return sendOk(res, {
            email,
            oneTimePassword: password,
            idToken: auth.idToken,
            localId: auth.localId,
            method: 'password-relay',
        });
    } catch (e: any) {
        console.error('admin-quick-login toolkit error:', e);
        // Utolsó esély: kliens próbálja a jelszavas belépést
        return sendOk(res, {
            email,
            oneTimePassword: password,
            method: 'password-relay',
        });
    }
}
