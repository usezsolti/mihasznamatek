import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getAdminDb } from '../../../server/firebaseAdmin';
import { listCollection } from '../../../server/firestoreRest';
import { requireAdmin } from '../../../utils/apiSecurity';

let warnedCalendarOnce = false;

/**
 * GET /api/admin/calendar-bookings
 * Admin naptár foglalásai + blockedSlots — Admin SDK vagy user token + rules.
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
        const map = new Map<string, Record<string, unknown>>();
        let blocked: Array<Record<string, unknown>> = [];
        let permissionDenied = false;
        let source: 'admin-sdk' | 'user-token' = 'user-token';

        const add = (id: string, data: Record<string, unknown>) => {
            if (!id) return;
            map.set(id, { id, ...data });
        };

        if (db) {
            source = 'admin-sdk';
            const bookingsSnap = await db.collection('bookings').limit(500).get();
            bookingsSnap.forEach((doc) => add(doc.id, doc.data() || {}));

            try {
                const pendingSnap = await db.collection('pendingBookings').limit(200).get();
                pendingSnap.forEach((doc) => add(doc.id, doc.data() || {}));
            } catch {
                /* optional legacy */
            }
            try {
                const approvedSnap = await db.collection('approvedBookings').limit(200).get();
                approvedSnap.forEach((doc) => add(doc.id, doc.data() || {}));
            } catch {
                /* optional legacy */
            }

            const blockedSnap = await db.collection('blockedSlots').limit(500).get();
            blockedSnap.forEach((doc) => {
                const data = doc.data() || {};
                blocked.push({
                    date: String(data.date || doc.id),
                    times: Array.isArray(data.times) ? data.times.map(String) : [],
                    allDay: Boolean(data.allDay),
                    note: data.note ? String(data.note) : undefined,
                    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
                });
            });
        } else if (token) {
            try {
                const docs = await listCollection('bookings', token, { pageSize: 500 });
                docs.forEach((d) => add(String(d.__id || ''), d));
            } catch (e: any) {
                permissionDenied = true;
                if (!warnedCalendarOnce) {
                    warnedCalendarOnce = true;
                    console.warn(
                        'calendar-bookings: Missing or insufficient permissions (logged once — publish firestore.rules)'
                    );
                }
            }

            if (!permissionDenied) {
                for (const col of ['pendingBookings', 'approvedBookings'] as const) {
                    try {
                        const docs = await listCollection(col, token, { pageSize: 200 });
                        docs.forEach((d) => add(String(d.__id || ''), d));
                    } catch {
                        /* legacy optional */
                    }
                }
                try {
                    const docs = await listCollection('blockedSlots', token, { pageSize: 500 });
                    blocked = docs.map((d) => ({
                        date: String(d.date || d.__id || ''),
                        times: Array.isArray(d.times) ? d.times.map(String) : [],
                        allDay: Boolean(d.allDay),
                        note: d.note ? String(d.note) : undefined,
                        updatedAt: d.updatedAt ? String(d.updatedAt) : undefined,
                    }));
                } catch {
                    /* ignore */
                }
            }
        } else {
            return sendErr(res, 'Nincs auth token.', 401);
        }

        const bookings = Array.from(map.values()).sort((a, b) => {
            const d = String(b.date || '').localeCompare(String(a.date || ''));
            if (d !== 0) return d;
            const at = Array.isArray(a.times) ? String(a.times[0] || '') : '';
            const bt = Array.isArray(b.times) ? String(b.times[0] || '') : '';
            return at.localeCompare(bt);
        });

        return sendOk(res, {
            bookings,
            blocked,
            source,
            permissionDenied,
            setupHint: permissionDenied
                ? 'Firestore rules tiltja a bookings olvasást. Publikáld: /rules-setup → Publish.'
                : undefined,
        });
    } catch (e: any) {
        return sendErr(res, String(e?.message || e), 500);
    }
}
