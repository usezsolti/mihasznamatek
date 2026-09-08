/**
 * Email/jelszó users tábla — az SSO (Google) mellett.
 * Jelszó csak scrypt hash-ként. Soha ne tárolj sima jelszót.
 *
 * Tárolás: data/users-table.json (dev) + Firestore auth_users (Admin SDK, éles).
 */
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getAdminDb } from './firebaseAdmin';

export type PasswordUserRow = {
    id: string;
    email: string;
    name: string;
    username?: string;
    passwordHash: string;
    createdAt: string;
    firebaseUid?: string;
};

type TableFile = { users: PasswordUserRow[] };

const COLLECTION = 'auth_users';
const FILE = path.join(process.cwd(), 'data', 'users-table.json');

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 32).toString('hex');
    return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    const parts = String(stored || '').split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
    const [, salt, hash] = parts;
    if (!salt || !hash) return false;
    try {
        const next = scryptSync(password, salt, 32);
        const prev = Buffer.from(hash, 'hex');
        return prev.length === next.length && timingSafeEqual(prev, next);
    } catch {
        return false;
    }
}

function emptyTable(): TableFile {
    return { users: [] };
}

function readFileTable(): TableFile {
    try {
        if (!fs.existsSync(FILE)) return emptyTable();
        const raw = JSON.parse(fs.readFileSync(FILE, 'utf8')) as TableFile;
        return { users: Array.isArray(raw?.users) ? raw.users : [] };
    } catch {
        return emptyTable();
    }
}

function writeFileTable(table: TableFile): void {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(table, null, 2), 'utf8');
}

function docId(email: string): string {
    return normalizeEmail(email).replace(/[^a-z0-9@._+-]/g, '_');
}

function rowFromData(id: string, data: Record<string, unknown>): PasswordUserRow | null {
    const email = normalizeEmail(String(data.email || ''));
    const passwordHash = String(data.passwordHash || '');
    const name = String(data.name || '').trim();
    if (!email || !passwordHash) return null;
    return {
        id: String(data.id || id),
        email,
        name,
        username: data.username ? String(data.username) : undefined,
        passwordHash,
        createdAt: String(data.createdAt || new Date().toISOString()),
        firebaseUid: data.firebaseUid ? String(data.firebaseUid) : undefined,
    };
}

export async function findUserByEmail(email: string): Promise<PasswordUserRow | null> {
    const key = normalizeEmail(email);
    if (!key) return null;

    const db = getAdminDb();
    if (db) {
        try {
            const snap = await db.collection(COLLECTION).doc(docId(key)).get();
            if (snap.exists) {
                return rowFromData(snap.id, (snap.data() || {}) as Record<string, unknown>);
            }
        } catch (err) {
            console.warn('usersTable firestore read failed:', err);
        }
    }

    return readFileTable().users.find((u) => u.email === key) || null;
}

export async function createPasswordUser(input: {
    email: string;
    name: string;
    username?: string;
    password: string;
}): Promise<{ ok: true; user: Omit<PasswordUserRow, 'passwordHash'> } | { ok: false; error: string }> {
    const email = normalizeEmail(input.email);
    const name = input.name.trim();
    const username = String(input.username || '').trim().replace(/^@/, '');
    const password = String(input.password || '');
    if (!email || !name) return { ok: false, error: 'Név és e-mail kell.' };
    if (password.length < 6) return { ok: false, error: 'A jelszónak legalább 6 karakter kell.' };

    const existing = await findUserByEmail(email);
    if (existing) return { ok: false, error: 'Ez az e-mail már regisztrálva van. Jelentkezz be!' };

    const row: PasswordUserRow = {
        id: randomUUID(),
        email,
        name,
        username: username || undefined,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
    };

    const db = getAdminDb();
    if (db) {
        try {
            await db.collection(COLLECTION).doc(docId(email)).set({
                id: row.id,
                email: row.email,
                name: row.name,
                username: row.username || '',
                passwordHash: row.passwordHash,
                createdAt: row.createdAt,
                provider: 'password',
            });
        } catch (err) {
            console.warn('usersTable firestore write failed:', err);
        }
    }

    const table = readFileTable();
    table.users = table.users.filter((u) => u.email !== email);
    table.users.push(row);
    writeFileTable(table);

    return { ok: true, user: { id: row.id, email: row.email, name: row.name, username: row.username, createdAt: row.createdAt } };
}

export async function verifyPasswordUser(
    email: string,
    password: string
): Promise<{ ok: true; user: Omit<PasswordUserRow, 'passwordHash'> } | { ok: false; error: string; notFound?: boolean }> {
    const row = await findUserByEmail(email);
    if (!row) {
        return { ok: false, error: 'Nincs ilyen felhasználó. Regisztrálj előbb!', notFound: true };
    }
    if (!verifyPassword(password, row.passwordHash)) {
        return { ok: false, error: 'Hibás e-mail cím vagy jelszó.' };
    }
    return {
        ok: true,
        user: {
            id: row.id,
            email: row.email,
            name: row.name,
            createdAt: row.createdAt,
            firebaseUid: row.firebaseUid,
        },
    };
}
