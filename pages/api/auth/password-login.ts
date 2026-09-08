import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { verifyPasswordUser } from '../../../server/usersTable';
import { SHOW_EMAIL_PASSWORD_UI } from '../../../utils/authModal';
import {
    getClientIp,
    isAllowedOrigin,
    isValidEmail,
    rateLimit,
    sanitizeText,
} from '../../../utils/apiSecurity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);
    if (!SHOW_EMAIL_PASSWORD_UI) {
        return sendErr(res, 'A belépés csak Google-fiókkal lehetséges.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`password-login:${ip}`, 20, 60 * 60 * 1000);
    if (!rl.ok) return sendErr(res, 'Túl sok belépési kísérlet. Próbáld később.', 429);

    const email = sanitizeText(req.body?.email, 200).toLowerCase();
    const password = String(req.body?.password || '');
    if (!isValidEmail(email) || !password) {
        return sendErr(res, 'E-mail és jelszó kell.', 400);
    }

    const checked = await verifyPasswordUser(email, password);
    if (!checked.ok) {
        return sendErr(res, checked.error, checked.notFound ? 404 : 401);
    }
    return sendOk(res, checked.user);
}
