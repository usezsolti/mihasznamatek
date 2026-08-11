import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getFirebaseAdmin } from '../../../server/firebaseAdmin';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../utils/apiSecurity';
import { isTestLoginAllowed, TEST_LOGIN_EMAIL } from '../../../utils/testLoginShared';

/**
 * POST /api/auth/test-login
 * Jelszó csak szerveren (TEST_LOGIN_PASSWORD) — nem a kliens bundle-ben.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }
    if (!isTestLoginAllowed()) {
        return sendErr(res, 'Not found', 404);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`test-login:${ip}`, 10, 60 * 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok próbálkozás.', 429);
    }

    const email = process.env.TEST_LOGIN_EMAIL || TEST_LOGIN_EMAIL;
    const password = process.env.TEST_LOGIN_PASSWORD || '';
    if (!password) {
        return sendErr(res, 'TEST_LOGIN_PASSWORD nincs beállítva (.env.local).', 503);
    }

    // Prefer Admin custom token (soha nem küldünk jelszót a kliensnek)
    try {
        const admin = getFirebaseAdmin();
        if (admin) {
            const user = await admin.auth().getUserByEmail(email).catch(async () => {
                return admin.auth().createUser({
                    email,
                    password,
                    emailVerified: true,
                    displayName: 'Teszt Felhasználó',
                });
            });
            const customToken = await admin.auth().createCustomToken(user.uid, {
                isTestAccount: true,
            });
            return sendOk(res, { customToken, email, localId: user.uid, method: 'custom' });
        }
    } catch (e) {
        console.warn('test-login admin path skipped:', e);
    }

    // Password-relay csak explicit dev flag mellett — productionben soha
    const allowRelay =
        process.env.NODE_ENV !== 'production' &&
        String(process.env.ALLOW_TEST_PASSWORD_RELAY || '') === '1';
    if (!allowRelay) {
        return sendErr(
            res,
            'Teszt belépéshez Firebase Admin kell (vagy ALLOW_TEST_PASSWORD_RELAY=1 csak local).',
            503
        );
    }

    return sendOk(res, {
        email,
        oneTimePassword: password,
        method: 'password-relay',
    });
}
