/**
 * Szerver-oldali e-mail megerősítés (Gmail branded), Firebase Admin nélkül is.
 * data/email-verification.json — ne commitold (gitignore /data).
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const STORE_PATH = path.join(process.cwd(), 'data', 'email-verification.json');
const TTL_MS = 24 * 60 * 60 * 1000;

function hmacSecrets(): string[] {
    const list = [
        process.env.EMAIL_VERIFY_SECRET,
        process.env.BOOKING_PROPOSAL_SECRET,
        process.env.CRON_SECRET,
        process.env.RESEND_API_KEY,
        'mihaszna-email-verify',
    ]
        .map((s) => String(s || '').trim())
        .filter(Boolean);
    return [...new Set(list)];
}

function hmacSecret(): string {
    return hmacSecrets()[0] || 'mihaszna-email-verify';
}

/** Stateless megerősítő token — Vercel példányok között is működik. */
export function signEmailVerifyToken(email: string): string {
    const exp = Date.now() + TTL_MS;
    const payload = Buffer.from(
        JSON.stringify({ e: email.trim().toLowerCase(), exp }),
        'utf8'
    ).toString('base64url');
    const sig = crypto.createHmac('sha256', hmacSecret()).update(payload).digest('hex').slice(0, 32);
    return `${payload}.${sig}`;
}

export function readEmailVerifyToken(token: string): { email: string } | null {
    const cleaned = String(token || '').trim().replace(/\s+/g, '');
    const dot = cleaned.lastIndexOf('.');
    if (dot < 8) return null;
    const payload = cleaned.slice(0, dot);
    const sig = cleaned.slice(dot + 1);
    if (!payload || !sig) return null;

    const matched = hmacSecrets().some((secret) => {
        const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
        return sig === expected;
    });
    if (!matched) return null;

    try {
        const json = Buffer.from(payload, 'base64url').toString('utf8');
        const data = JSON.parse(json) as { e?: string; exp?: number };
        if (!data?.e || !data.exp || Number(data.exp) < Date.now()) return null;
        return { email: String(data.e).toLowerCase() };
    } catch {
        return null;
    }
}

type Pending = {
    uid: string;
    email: string;
    exp: number;
};

type StoreShape = {
    pending: Record<string, Pending>;
    verified: Record<string, { email: string; at: number }>;
    verifiedByEmail: Record<string, { at: number }>;
};

function emptyStore(): StoreShape {
    return { pending: {}, verified: {}, verifiedByEmail: {} };
}

function readStore(): StoreShape {
    try {
        if (!fs.existsSync(STORE_PATH)) return emptyStore();
        const raw = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
        return {
            pending: raw?.pending && typeof raw.pending === 'object' ? raw.pending : {},
            verified: raw?.verified && typeof raw.verified === 'object' ? raw.verified : {},
            verifiedByEmail:
                raw?.verifiedByEmail && typeof raw.verifiedByEmail === 'object'
                    ? raw.verifiedByEmail
                    : {},
        };
    } catch {
        return emptyStore();
    }
}

function writeStore(store: StoreShape): void {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function prune(store: StoreShape): void {
    const now = Date.now();
    for (const [token, row] of Object.entries(store.pending)) {
        if (!row || row.exp < now) delete store.pending[token];
    }
}

export function createEmailVerificationToken(uid: string, email: string): string {
    const store = readStore();
    prune(store);
    // Egy uid → egy élő token
    for (const [token, row] of Object.entries(store.pending)) {
        if (row?.uid === uid) delete store.pending[token];
    }
    const token = crypto.randomBytes(32).toString('hex');
    store.pending[token] = {
        uid,
        email: email.toLowerCase(),
        exp: Date.now() + TTL_MS,
    };
    writeStore(store);
    return token;
}

export function consumeEmailVerificationToken(
    token: string
): { uid: string; email: string } | null {
    const store = readStore();
    prune(store);
    const row = store.pending[token];
    if (!row || row.exp < Date.now()) {
        if (row) {
            delete store.pending[token];
            writeStore(store);
        }
        return null;
    }
    delete store.pending[token];
    store.verified[row.uid] = { email: row.email, at: Date.now() };
    store.verifiedByEmail[row.email] = { at: Date.now() };
    writeStore(store);
    return { uid: row.uid, email: row.email };
}

export function isUidEmailVerified(uid: string): boolean {
    const store = readStore();
    return Boolean(store.verified[uid]);
}

export function markUidEmailVerified(uid: string, email: string): void {
    const store = readStore();
    const em = email.toLowerCase();
    store.verified[uid] = { email: em, at: Date.now() };
    store.verifiedByEmail[em] = { at: Date.now() };
    writeStore(store);
}

export function markEmailVerified(email: string): void {
    const store = readStore();
    store.verifiedByEmail[email.trim().toLowerCase()] = { at: Date.now() };
    writeStore(store);
}

export function isEmailVerified(email: string): boolean {
    const store = readStore();
    return Boolean(store.verifiedByEmail[email.trim().toLowerCase()]);
}

const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export function signVerifiedSession(email: string): string {
    const exp = Date.now() + SESSION_TTL_MS;
    const payload = Buffer.from(
        JSON.stringify({ e: email.trim().toLowerCase(), exp }),
        'utf8'
    ).toString('base64url');
    const sig = crypto.createHmac('sha256', hmacSecret()).update(payload).digest('hex').slice(0, 32);
    return `${payload}.${sig}`;
}

export function emailFromVerifiedSession(token: string): string | null {
    return readEmailVerifyToken(token)?.email || null;
}
