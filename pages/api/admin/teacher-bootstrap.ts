import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getAdminDb } from '../../../server/firebaseAdmin';
import { listCollection, runQuery } from '../../../server/firestoreRest';
import { requireAdmin } from '../../../utils/apiSecurity';
import { isAdminEmail } from '../../../utils/admin';

let warnedUsersOnce = false;
let warnedPendingOnce = false;

/**
 * GET /api/admin/teacher-bootstrap
 * Diáklista + pending foglalások — Admin SDK ha van, különben user token + rules.
 * Rules tiltás esetén 200 + permissionDenied (ne 403 spam / kliens fallback).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    const authHeader = String(req.headers.authorization || '');
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    const db = getAdminDb();

    try {
        let students: Array<{
            uid: string;
            name: string;
            email: string;
            educationLevel?: string;
            photoURL?: string;
            lastSeenMs?: number;
        }> = [];
        let pending: Array<Record<string, unknown>> = [];
        let source: 'admin-sdk' | 'user-token' = 'user-token';
        let permissionDenied = false;
        let setupHint = '';

        if (db) {
            source = 'admin-sdk';
            const usersSnap = await db.collection('users').limit(200).get();
            usersSnap.forEach((doc) => {
                const data = doc.data() || {};
                const email = String(data.email || '').trim();
                if (email && isAdminEmail(email)) return;
                students.push({
                    uid: doc.id,
                    name: String(data.name || data.displayName || email.split('@')[0] || 'Diák'),
                    email,
                    educationLevel: String(data.educationLevel || ''),
                    photoURL: String(data.photoURL || ''),
                    lastSeenMs: toMs(data.updatedAt || data.lastLogin || data.createdAt),
                });
            });
            students.sort((a, b) => (b.lastSeenMs || 0) - (a.lastSeenMs || 0));

            const pendingSnap = await db.collection('bookings').where('status', '==', 'pending').get();
            pendingSnap.forEach((doc) => {
                pending.push({ id: doc.id, ...doc.data() });
            });
        } else if (token) {
            try {
                const docs = await listCollection('users', token, { pageSize: 200 });
                students = docs
                    .map((d) => {
                        const email = String(d.email || '').trim();
                        return {
                            uid: String(d.__id || ''),
                            name: String(d.name || d.displayName || email.split('@')[0] || 'Diák'),
                            email,
                            educationLevel: String(d.educationLevel || ''),
                            photoURL: String(d.photoURL || ''),
                            lastSeenMs: toMs(d.updatedAt || d.lastLogin || d.createdAt),
                        };
                    })
                    .filter((s) => s.uid && !(s.email && isAdminEmail(s.email)))
                    .sort((a, b) => (b.lastSeenMs || 0) - (a.lastSeenMs || 0));
            } catch (e: any) {
                permissionDenied = true;
                setupHint =
                    'Firestore rules tiltja a users olvasást. Publikáld a firestore.rules-t: /rules-setup → Másolás → Firebase Console → Publish. Vagy állíts be FIREBASE_SERVICE_ACCOUNT_JSON-t a .env.local-ban.';
                if (!warnedUsersOnce) {
                    warnedUsersOnce = true;
                    console.warn(
                        'teacher-bootstrap users: Missing or insufficient permissions (logged once — publish firestore.rules)'
                    );
                }
            }

            if (!permissionDenied) {
                try {
                    const rows = await runQuery(token, {
                        from: [{ collectionId: 'bookings' }],
                        where: {
                            fieldFilter: {
                                field: { fieldPath: 'status' },
                                op: 'EQUAL',
                                value: { stringValue: 'pending' },
                            },
                        },
                        limit: 100,
                    });
                    pending = rows.map((d) => ({ id: d.__id, ...d }));
                } catch (e: any) {
                    if (!warnedPendingOnce) {
                        warnedPendingOnce = true;
                        console.warn(
                            'teacher-bootstrap pending: Missing or insufficient permissions (logged once)'
                        );
                    }
                }
            }
        } else {
            return sendErr(res, 'Nincs auth token.', 401);
        }

        pending.sort(
            (a, b) =>
                new Date(String(b.submittedAt || 0)).getTime() -
                new Date(String(a.submittedAt || 0)).getTime()
        );

        return sendOk(res, {
            students,
            pending,
            source,
            permissionDenied,
            setupHint: setupHint || undefined,
            hasAdminSdk: Boolean(db),
        });
    } catch (e: any) {
        return sendErr(res, String(e?.message || e), 500);
    }
}

function toMs(value: any): number {
    if (!value) return 0;
    if (typeof value?.toMillis === 'function') return value.toMillis();
    if (typeof value?.seconds === 'number') return value.seconds * 1000;
    if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value);
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
}
