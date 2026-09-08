import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { createPasswordUser } from '../../../server/usersTable';
import { signEmailVerifyToken } from '../../../server/emailVerificationStore';
import { sendBrandedVerificationMail } from '../../../server/brandedMail';
import {
    getClientIp,
    isAllowedOrigin,
    isValidEmail,
    mailLinkOrigin,
    rateLimit,
    sanitizeText,
} from '../../../utils/apiSecurity';
import { SHOW_EMAIL_PASSWORD_UI } from '../../../utils/authModal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);
    if (!SHOW_EMAIL_PASSWORD_UI) {
        return sendErr(res, 'A belépés csak Google-fiókkal lehetséges.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`password-register:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) return sendErr(res, 'Túl sok regisztráció. Próbáld később.', 429);

    const email = sanitizeText(req.body?.email, 200).toLowerCase();
    const name = sanitizeText(req.body?.name, 120);
    const username = sanitizeText(req.body?.username, 24).replace(/^@/, '');
    const password = String(req.body?.password || '');
    if (!isValidEmail(email) || !name) {
        return sendErr(res, 'Név és érvényes e-mail kell.', 400);
    }
    if (!/^[a-zA-Z0-9._]{3,24}$/.test(username)) {
        return sendErr(res, 'A felhasználónév 3–24 karakter: betű, szám, pont vagy aláhúzás.', 400);
    }
    if (password.length < 6 || password.length > 200) {
        return sendErr(res, 'A jelszónak legalább 6 karakter kell.', 400);
    }

    const saved = await createPasswordUser({ email, name, username, password });
    if (!saved.ok) return sendErr(res, saved.error, 409);

    let emailSent = false;
    let emailError = '';
    try {
        const token = signEmailVerifyToken(email);
        const origin = mailLinkOrigin(req);
        await sendBrandedVerificationMail({
            to: email,
            link: `${origin}/verify-email?token=${encodeURIComponent(token)}`,
        });
        emailSent = true;
    } catch (err) {
        emailError = err instanceof Error ? err.message : 'Megerősítő e-mail sikertelen';
        console.error('password-register verification mail:', emailError);
    }

    return sendOk(res, { ...saved.user, emailSent, emailError: emailError || undefined });
}
