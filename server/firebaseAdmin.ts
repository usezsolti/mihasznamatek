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

function loadServiceAccount(): Record<string, unknown> | null {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (raw) {
        return JSON.parse(raw);
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
