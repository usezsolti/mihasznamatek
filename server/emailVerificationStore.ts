/**
 * Szerver-oldali e-mail megerősítés (Gmail branded), Firebase Admin nélkül is.
 * data/email-verification.json — ne commitold (gitignore /data).
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

type Pending = {
    uid: string;
    email: string;
    exp: number;
};

type StoreShape = {
    pending: Record<string, Pending>;
    verified: Record<string, { email: string; at: number }>;
};

const STORE_PATH = path.join(process.cwd(), 'data', 'email-verification.json');
const TTL_MS = 24 * 60 * 60 * 1000;

function emptyStore(): StoreShape {
    return { pending: {}, verified: {} };
}

function readStore(): StoreShape {
    try {
        if (!fs.existsSync(STORE_PATH)) return emptyStore();
        const raw = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
        return {
            pending: raw?.pending && typeof raw.pending === 'object' ? raw.pending : {},
            verified: raw?.verified && typeof raw.verified === 'object' ? raw.verified : {},
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
    writeStore(store);
    return { uid: row.uid, email: row.email };
}

export function isUidEmailVerified(uid: string): boolean {
    const store = readStore();
    return Boolean(store.verified[uid]);
}

export function markUidEmailVerified(uid: string, email: string): void {
    const store = readStore();
    store.verified[uid] = { email: email.toLowerCase(), at: Date.now() };
    writeStore(store);
}
