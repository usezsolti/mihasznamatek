/**
 * Firebase Admin (opcionális).
 * Beállítás (egyik elég):
 * - FIREBASE_SERVICE_ACCOUNT_JSON=...egysoros JSON...
 * - FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-admin.json
 * - GOOGLE_APPLICATION_CREDENTIALS=... (ugyanaz fájlút)
 */
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { FIREBASE_PROJECT_ID } from './config';

let initTried = false;

function parseServiceAccountJson(raw: string): Record<string, unknown> {
    let s = raw.trim().replace(/^\uFEFF/, '');
    if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
    ) {
        s = s.slice(1, -1).replace(/\\"/g, '"');
    }
    if (!s.startsWith('{')) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON nem JSON objektum.');
    }
    const parsed = JSON.parse(s) as Record<string, unknown>;
    if (typeof parsed.private_key === 'string') {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
}

function loadServiceAccount(): Record<string, unknown> | null {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (raw) {
        return parseServiceAccountJson(raw);
    }
    const filePath =
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!filePath) return null;
    const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

export function getFirebaseAdmin(): typeof admin | null {
    try {
        if (admin?.apps?.length) return admin;
    } catch {
        return null;
    }

    if (initTried) {
        try {
            return admin?.apps?.length ? admin : null;
        } catch {
            return null;
        }
    }
    initTried = true;

    try {
        const cred = loadServiceAccount();
        if (cred) {
            admin.initializeApp({
                credential: admin.credential.cert(cred as admin.ServiceAccount),
                projectId: String(cred.project_id || FIREBASE_PROJECT_ID),
            });
            return admin;
        }

        // GCP / Vercel ADC (ha a környezet ad credentialt)
        if (process.env.FIREBASE_ADMIN_SDK === '1') {
            admin.initializeApp({ projectId: FIREBASE_PROJECT_ID });
            return admin;
        }
    } catch (e) {
        console.error('firebase-admin init failed:', e);
    }
    return null;
}

export function getAdminDb() {
    const a = getFirebaseAdmin();
    return a ? a.firestore() : null;
}

export function backendMode(): 'admin' | 'user-token' {
    return getAdminDb() ? 'admin' : 'user-token';
}
