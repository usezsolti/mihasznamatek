/**
 * Firebase Admin (opcionális).
 * Ha van FIREBASE_SERVICE_ACCOUNT_JSON, Admin SDK-val megy a Firestore.
 * Enélkül a backend a user ID tokennel (Firestore REST) dolgozik.
 */
import admin from 'firebase-admin';
import { FIREBASE_PROJECT_ID } from './config';

let initTried = false;

export function getFirebaseAdmin(): typeof admin | null {
    if (admin.apps.length) return admin;

    if (initTried) return admin.apps.length ? admin : null;
    initTried = true;

    try {
        const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        if (raw) {
            const cred = JSON.parse(raw);
            admin.initializeApp({
                credential: admin.credential.cert(cred),
                projectId: cred.project_id || FIREBASE_PROJECT_ID,
            });
            return admin;
        }

        // Vercel / GCP ADC (ha be van állítva)
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_ADMIN_SDK === '1') {
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
