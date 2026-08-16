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

function envFlagOn(name: string): boolean {
    const v = String(process.env[name] || '')
        .trim()
        .toLowerCase();
    return v === '1' || v === 'true' || v === 'yes';
}

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
 * Prefer Admin SDK custom token. Password relay only via server env (never hardcode).
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
    const allowPasswordRelay = envFlagOn('ALLOW_ADMIN_PASSWORD_RELAY');

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
                        'Admin fiók nincs a Firebase-ben. Állítsd be a szerver env jelszót, vagy hozd létre a fiókot a Console-ban.',
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
            'Hiányzik a szerver oldali admin jelszó env, és/vagy a Firebase Admin SDK. Állítsd be a hosting env változókat.',
            503
        );
    }
    if (!allowPasswordRelay) {
        return sendErr(
            res,
            'Jelszavas relay ki van kapcsolva. Add hozzá a Firebase service account JSON env-et, vagy kapcsold be a relay flaget a staging env-ben.',
            503
        );
    }

    // Gmail +alias owned by env password (rules/isAdminEmail treat usezsolti*@gmail as admin).
    // Avoid fighting an existing primary Gmail password the env may not know.
    const relayEmail = email.includes('+')
        ? email
        : email.replace('@gmail.com', '+teacher@gmail.com');

    async function signInOrSignUp(targetEmail: string): Promise<IdToolkitAuth> {
        let auth = await idToolkit('signInWithPassword', targetEmail, password);
        const msg = String(auth.error?.message || '');
        if (
            msg.includes('EMAIL_NOT_FOUND') ||
            msg.includes('INVALID_LOGIN_CREDENTIALS') ||
            msg.includes('INVALID_PASSWORD')
        ) {
            const created = await idToolkit('signUp', targetEmail, password);
            const cMsg = String(created.error?.message || '');
            // Account exists with a different password — cannot reset without Admin SDK
            if (cMsg.includes('EMAIL_EXISTS')) {
                return auth.idToken ? auth : created.error?.message ? created : auth;
            }
            return created;
        }
        return auth;
    }

    try {
        let auth = await signInOrSignUp(relayEmail);
        if ((!auth.idToken || auth.error?.message) && relayEmail !== email) {
            auth = await signInOrSignUp(email);
        }

        if (auth.error?.message && !auth.idToken) {
            const msg = String(auth.error.message);
            if (msg.includes('EMAIL_EXISTS') || msg.includes('INVALID_')) {
                return sendErr(
                    res,
                    'Az admin Firebase jelszó nem egyezik a szerver env értékkel. Állítsd be a FIREBASE_SERVICE_ACCOUNT_JSON-t, vagy egyeztesd az ADMIN_LOGIN_PASSWORD-t a Firebase Authentication jelszóval.',
                    401
                );
            }
            return sendErr(res, `Firebase: ${auth.error.message}`, 400);
        }

        return sendOk(res, {
            email: auth.email || relayEmail,
            oneTimePassword: password,
            idToken: auth.idToken,
            localId: auth.localId,
            method: relayEmail !== email ? 'password-relay-alias' : 'password-relay',
        });
    } catch (e: any) {
        console.error('admin-quick-login toolkit error:', e);
        return sendErr(res, 'Admin belépés sikertelen (szerver hiba).', 500);
    }
}
