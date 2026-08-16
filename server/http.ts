import type { NextApiRequest, NextApiResponse } from 'next';
import {
    extractBearerToken,
    getClientIp,
    isAllowedOrigin,
    rateLimit,
    requireAuth,
    type VerifiedUser,
} from '../utils/apiSecurity';

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: string };
export type ApiResult<T> = ApiOk<T> | ApiErr;

export function sendOk<T>(res: NextApiResponse, data: T, status = 200) {
    return res.status(status).json({ ok: true, data } satisfies ApiOk<T>);
}

export function sendErr(res: NextApiResponse, error: string, status = 400) {
    return res.status(status).json({ ok: false, error } satisfies ApiErr);
}

/** Standard backend gate: method + origin + auth + rate limit. */
export async function withBackendAuth(
    req: NextApiRequest,
    res: NextApiResponse,
    opts?: { methods?: string[]; rateKey?: string; limit?: number; windowMs?: number }
): Promise<{ user: VerifiedUser; token: string } | null> {
    const methods = opts?.methods || ['GET', 'POST'];
    if (!methods.includes(req.method || '')) {
        sendErr(res, 'Method not allowed', 405);
        return null;
    }
    if (!isAllowedOrigin(req)) {
        sendErr(res, 'Nem engedélyezett origin.', 403);
        return null;
    }
    const user = await requireAuth(req, res);
    if (!user) return null;

    const token = extractBearerToken(req);
    if (!token) {
        sendErr(res, 'Bejelentkezés szükséges.', 401);
        return null;
    }

    const ip = getClientIp(req);
    const key = `${opts?.rateKey || 'backend'}:${ip}:${user.uid}`;
    const rl = rateLimit(key, opts?.limit ?? 120, opts?.windowMs ?? 60 * 60 * 1000);
    if (!rl.ok) {
        sendErr(res, 'Túl sok kérés. Próbáld később.', 429);
        return null;
    }

    return { user, token };
}
