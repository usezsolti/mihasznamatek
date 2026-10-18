import { NextApiRequest, NextApiResponse } from 'next';
import { composeMathShortScript } from '../../server/mathShortScript';
import { sendErr, sendOk } from '../../server/http';
import {
    getClientIp,
    isAllowedOrigin,
    rateLimit,
    requireAuth,
    sanitizeText,
} from '../../utils/apiSecurity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }
    const user = await requireAuth(req, res);
    if (!user) return;

    const ip = getClientIp(req);
    const rlIp = rateLimit(`math-short:${ip}`, 30, 60 * 60 * 1000);
    const rlUser = rateLimit(`math-short:uid:${user.uid}`, 15, 60 * 60 * 1000);
    if (!rlIp.ok || !rlUser.ok) {
        return sendErr(res, 'Túl sok short-generálás. Próbáld később.', 429);
    }

    const topic = sanitizeText(req.body?.topic, 80) || 'matek trükk';
    const difficulty = sanitizeText(req.body?.difficulty || 'közepes', 20) || 'közepes';
    return sendOk(res, await composeMathShortScript(topic, difficulty));
}
