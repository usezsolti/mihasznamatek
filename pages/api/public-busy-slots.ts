import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../server/http';
import { getAdminDb } from '../../server/firebaseAdmin';
import { getClientIp, isAllowedOrigin, rateLimit } from '../../utils/apiSecurity';

export type BusySlotDay = {
    date: string;
    times: string[];
    status: 'pending' | 'approved';
};

/**
 * Public busy times for the appointment calendar (no names/emails).
 * Uses Admin SDK when available; otherwise empty (blockedSlots still load client-side).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`public-busy-slots:${ip}`, 120, 60 * 60 * 1000);
    if (!rl.ok) {
        return sendErr(res, 'Túl sok kérés.', 429);
    }

    const db = getAdminDb();
    if (!db) {
        return sendOk(res, { slots: [] as BusySlotDay[], source: 'none' as const });
    }

    try {
        const snap = await db.collection('bookings').get();
        const slots: BusySlotDay[] = [];
        snap.forEach((doc) => {
            const data = doc.data() || {};
            const status = String(data.status || 'pending');
            if (status !== 'pending' && status !== 'approved') return;
            const date = String(data.date || '');
            const times = Array.isArray(data.times) ? data.times.map((t: unknown) => String(t)) : [];
            if (!date || times.length === 0) return;
            slots.push({
                date,
                times,
                status: status as 'pending' | 'approved',
            });
        });
        return sendOk(res, { slots, source: 'admin' as const });
    } catch (e: any) {
        console.warn('public-busy-slots', String(e?.message || e).slice(0, 160));
        return sendOk(res, { slots: [] as BusySlotDay[], source: 'error' as const });
    }
}
