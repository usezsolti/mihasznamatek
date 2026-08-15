import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getFirebaseAdmin } from '../../../server/firebaseAdmin';
import { ADMIN_LOGIN_EMAIL } from '../../../utils/adminLoginShared';
import { resolveFirebaseWebApiKey } from '../../../utils/firebasePublicConfig';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../utils/apiSecurity';

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
 * Egykattintás — Admin SDK (custom token) vagy Identity Toolkit (csak ha ADMIN_LOGIN_PASSWORD env be van állítva).
 * SOHA ne hardcode-olj jelszót ebbe a fájlba.
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
    const password = String(process.env.ADMIN_LOGIN_PASSWORD || '').trim();
    const allowPasswordRelay =
        process.env.ALLOW_ADMIN_PASSWORD_RELAY === '1' ||
        process.env.ALLOW_ADMIN_PASSWORD_RELAY === 'true';

    // 1) Firebase Admin SDK — preferált (nincs jelszó a kliens felé)
    try {
        const admin = getFirebaseAdmin();
        if (admin?.auth) {
            let user: { uid: string };
            try {
                user = await admin.auth().getUserByEmail(email);
            } catch {
                if (!password) {
                    return sendErr(
                        res,
                        'Admin fiók nincs a Firebase-ben. Állítsd be az ADMIN_LOGIN_PASSWORD env változót, vagy hozd létre a fiókot a Console-ban.',
                        503
                    );
                }
                user = await admin.auth().createUser({
                    email,
                    password,
                    emailVerified: true,
                    displayName: 'Admin',
                });
            }
            if (password) {
                try {
                    await admin.auth().updateUser(user.uid, { password, emailVerified: true });
                } catch {
                    /* ignore */
                }
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

    // 2) Identity Toolkit REST — csak env jelszóval, soha hardcode-dal
    if (!password) {
        return sendErr(
            res,
            'Hiányzik az ADMIN_LOGIN_PASSWORD (és/vagy a Firebase Admin SDK). Állítsd be a szerver env változókat.',
            503
        );
    }
    if (!allowPasswordRelay) {
        return sendErr(
            res,
            'Admin SDK nélkül a jelszavas relay ki van kapcsolva. Állítsd be a FIREBASE_SERVICE_ACCOUNT_JSON-t, vagy ALLOW_ADMIN_PASSWORD_RELAY=1-et staginghez.',
            503
        );
    }

    try {
        let auth = await idToolkit('signInWithPassword', email, password);
        const msg = String(auth.error?.message || '');

        if (msg.includes('EMAIL_NOT_FOUND')) {
            auth = await idToolkit('signUp', email, password);
        } else if (msg.includes('INVALID_PASSWORD') || msg.includes('INVALID_LOGIN_CREDENTIALS')) {
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
                'Az admin Firebase jelszó nem egyezik az ADMIN_LOGIN_PASSWORD env értékkel. Frissítsd a jelszót a Firebase Console → Authentication alatt, vagy a Vercel/env beállítást.',
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
        return sendErr(res, 'Admin belépés sikertelen (szerver hiba).', 500);
    }
}
