import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { ADMIN_EMAIL, isAdminEmail } from './admin';
import { authOptions } from '../server/auth';

export type VerifiedUser = {
    uid: string;
    email: string;
    emailVerified: boolean;
    role?: string;
};

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

/** Egyszerű in-memory rate limit (szerverless-en példányonként). */
export function rateLimit(
    key: string,
    limit: number,
    windowMs: number
): { ok: boolean; retryAfterSec?: number } {
    const now = Date.now();
    const bucket = rateBuckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
        rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
        return { ok: true };
    }
    if (bucket.count >= limit) {
        return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
    }
    bucket.count += 1;
    return { ok: true };
}

export function getClientIp(req: NextApiRequest): string {
    const vercelIp = req.headers['x-real-ip'] || req.headers['x-vercel-forwarded-for'];
    if (typeof vercelIp === 'string' && vercelIp.length) {
        return vercelIp.split(',')[0].trim();
    }
    const xf = req.headers['x-forwarded-for'];
    if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
    if (Array.isArray(xf) && xf[0]) return xf[0].split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

export function extractBearerToken(req: NextApiRequest): string | null {
    const h = req.headers.authorization;
    if (typeof h === 'string' && h.toLowerCase().startsWith('bearer ')) {
        return h.slice(7).trim() || null;
    }
    return null;
}

/** @deprecated Firebase token verify — no-op; use Auth.js session. */
export async function verifyFirebaseIdToken(_idToken: string): Promise<VerifiedUser | null> {
    return null;
}

export async function requireAuth(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<VerifiedUser | null> {
    const session = await getServerSession(req, res, authOptions);
    const uid = String((session?.user as { id?: string } | undefined)?.id || '');
    const email = String(session?.user?.email || '').toLowerCase();
    if (!uid) {
        res.status(401).json({ ok: false, error: 'Bejelentkezés szükséges.' });
        return null;
    }
    return {
        uid,
        email,
        emailVerified: true,
        role: String((session?.user as { role?: string } | undefined)?.role || 'student'),
    };
}

export async function requireAdmin(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<VerifiedUser | null> {
    const user = await requireAuth(req, res);
    if (!user) return null;

    const email = (user.email || '').toLowerCase();
    const roleAdmin = user.role === 'admin';
    if (
        roleAdmin ||
        isAdminEmail(email) ||
        (ADMIN_EMAIL && email === ADMIN_EMAIL.toLowerCase())
    ) {
        return { ...user, email: email || user.email };
    }

    res.status(403).json({ ok: false, error: 'Nincs admin jogosultság.' });
    return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email?: string): boolean {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 200) return false;
    return EMAIL_RE.test(email.trim());
}

export function sanitizeText(value: unknown, maxLen: number): string {
    const s = String(value ?? '')
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
        .trim();
    return s.slice(0, maxLen);
}

function hostnameOf(urlLike: string): string | null {
    try {
        return new URL(urlLike).hostname.toLowerCase();
    } catch {
        return null;
    }
}

/** Origin ellenőrzés — csak saját site / localhost / saját Vercel URL. */
export function isAllowedOrigin(req: NextApiRequest): boolean {
    const origin = String(req.headers.origin || '');
    const referer = String(req.headers.referer || '');
    const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mihasznamatek.hu').replace(/\/$/, '');
    const allowedHosts = new Set(
        [
            hostnameOf(site),
            'mihasznamatek.hu',
            'www.mihasznamatek.hu',
            'localhost',
            '127.0.0.1',
            process.env.VERCEL_URL?.toLowerCase(),
            process.env.VERCEL_BRANCH_URL?.toLowerCase(),
            process.env.VERCEL_PROJECT_PRODUCTION_URL?.toLowerCase(),
        ].filter(Boolean) as string[]
    );

    const check = (value: string): boolean => {
        const host = hostnameOf(value);
        if (!host) return false;
        if (allowedHosts.has(host)) return true;
        const extra = String(process.env.ALLOWED_ORIGINS || '')
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
        if (extra.includes(host) || extra.includes(value.toLowerCase())) return true;
        return false;
    };

    if (origin && check(origin)) return true;
    if (referer && check(referer)) return true;
    if (!origin && !referer) return process.env.NODE_ENV !== 'production';
    return false;
}

export function secureSiteOrigin(): string {
    const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
    if (envUrl) return envUrl;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '');
    return 'https://mihasznamatek.hu';
}
