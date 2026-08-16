import type { NextApiRequest, NextApiResponse } from 'next';
import { encode } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../server/prisma';
import { ADMIN_LOGIN_EMAIL } from '../../../utils/adminLoginShared';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../utils/apiSecurity';
import { sendErr, sendOk } from '../../../server/http';

/**
 * POST /api/auth/admin-session-login
 * Server-side admin password from env → sets Auth.js session cookie.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);

    const ip = getClientIp(req);
    const rl = rateLimit(`admin-session-login:${ip}`, 20, 60 * 60 * 1000);
    if (!rl.ok) return sendErr(res, 'Túl sok próbálkozás.', 429);

    const email = (process.env.ADMIN_LOGIN_EMAIL || ADMIN_LOGIN_EMAIL).trim().toLowerCase();
    const password = String(process.env.ADMIN_LOGIN_PASSWORD || '').trim();
    if (!password) {
        return sendErr(res, 'Hiányzik az ADMIN_LOGIN_PASSWORD env.', 503);
    }

    let user = await prisma.user.findUnique({ where: { email } });
    const passwordHash = await bcrypt.hash(password, 10);
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name: 'Admin',
                passwordHash,
                role: 'admin',
                emailVerified: new Date(),
            },
        });
    } else {
        user = await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash, role: 'admin', emailVerified: new Date() },
        });
    }

    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) return sendErr(res, 'Hiányzik az AUTH_SECRET.', 503);

    const token = await encode({
        token: {
            sub: user.id,
            uid: user.id,
            email: user.email,
            name: user.name,
            role: 'admin',
        },
        secret,
        maxAge: 30 * 24 * 60 * 60,
    });

    const cookieName =
        process.env.NODE_ENV === 'production'
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token';

    const parts = [
        `${cookieName}=${encodeURIComponent(token)}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${30 * 24 * 60 * 60}`,
    ];
    if (process.env.NODE_ENV === 'production') parts.push('Secure');
    res.setHeader('Set-Cookie', parts.join('; '));

    return sendOk(res, { uid: user.id, email: user.email, method: 'session' });
}
