import type { NextApiRequest, NextApiResponse } from "next";
import { ADMIN_EMAIL, isAdminEmail } from "./admin";

const FIREBASE_API_KEY =
    process.env.FIREBASE_WEB_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyD1gvtJjjod5J3oJUI-iBPnR6yzU-AldtI";

export type VerifiedUser = {
    uid: string;
    email: string;
    emailVerified: boolean;
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
    const xf = req.headers["x-forwarded-for"];
    if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
    if (Array.isArray(xf) && xf[0]) return xf[0].split(",")[0].trim();
    return req.socket?.remoteAddress || "unknown";
}

export function extractBearerToken(req: NextApiRequest): string | null {
    const h = req.headers.authorization;
    if (typeof h === "string" && h.toLowerCase().startsWith("bearer ")) {
        return h.slice(7).trim() || null;
    }
    return null;
}

/** Firebase ID token ellenőrzés (Identity Toolkit REST — Admin SDK nélkül). */
export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedUser | null> {
    if (!idToken || idToken.length < 20) return null;
    try {
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(FIREBASE_API_KEY)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const user = data?.users?.[0];
        if (!user?.localId || !user?.email) return null;
        return {
            uid: String(user.localId),
            email: String(user.email).toLowerCase(),
            emailVerified: Boolean(user.emailVerified),
        };
    } catch (err) {
        console.error("verifyFirebaseIdToken failed:", err);
        return null;
    }
}

export async function requireAuth(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<VerifiedUser | null> {
    const token = extractBearerToken(req);
    if (!token) {
        res.status(401).json({ ok: false, error: "Bejelentkezés szükséges." });
        return null;
    }
    const user = await verifyFirebaseIdToken(token);
    if (!user) {
        res.status(401).json({ ok: false, error: "Érvénytelen vagy lejárt munkamenet." });
        return null;
    }
    return user;
}

export async function requireAdmin(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<VerifiedUser | null> {
    const user = await requireAuth(req, res);
    if (!user) return null;
    if (!isAdminEmail(user.email) && user.email !== ADMIN_EMAIL.toLowerCase()) {
        res.status(403).json({ ok: false, error: "Nincs admin jogosultság." });
        return null;
    }
    return user;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email?: string): boolean {
    if (!email || typeof email !== "string") return false;
    if (email.length > 200) return false;
    return EMAIL_RE.test(email.trim());
}

export function sanitizeText(value: unknown, maxLen: number): string {
    const s = String(value ?? "")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
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

/** Origin ellenőrzés — csak saját site / localhost / Vercel preview. */
export function isAllowedOrigin(req: NextApiRequest): boolean {
    const origin = String(req.headers.origin || "");
    const referer = String(req.headers.referer || "");
    const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://mihasznamatek.hu").replace(/\/$/, "");
    const allowedHosts = new Set(
        [
            hostnameOf(site),
            "mihasznamatek.hu",
            "www.mihasznamatek.hu",
            "localhost",
            "127.0.0.1",
        ].filter(Boolean) as string[]
    );

    const check = (value: string): boolean => {
        const host = hostnameOf(value);
        if (!host) return false;
        if (allowedHosts.has(host)) return true;
        if (host.endsWith(".vercel.app")) return true;
        return false;
    };

    if (origin && check(origin)) return true;
    if (referer && check(referer)) return true;
    // Szerver-szerver / hiányzó Origin — productionben tiltsuk
    if (!origin && !referer) return process.env.NODE_ENV !== "production";
    return false;
}

export function secureSiteOrigin(): string {
    const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
    if (envUrl) return envUrl;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
    return "https://mihasznamatek.hu";
}
