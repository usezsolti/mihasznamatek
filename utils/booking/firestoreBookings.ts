import {
    isAdminFirestoreDenied,
    markAdminFirestoreDenied,
} from '../adminFirestoreGate';
import { getBudapestDateKeyOffset } from './dates';
import { sendBookingEmailFromClient } from './emailSend';
import {
    getFirebase,
    type BlockedDay,
    type BookingPayload,
    type BookingStatus,
    type PaymentStatus,
    type ReminderRunResult,
} from './types';
import { agentDebugLog } from '../agentDebugLog';

export async function saveBookingToFirestore(
    booking: BookingPayload
): Promise<{ ok: boolean; error?: string }> {
    // #region agent log
    agentDebugLog({
        hypothesisId: 'R1',
        location: 'booking/firestoreBookings.ts:saveBookingToFirestore',
        message: 'save booking entry',
        data: {
            hasId: Boolean(booking?.id),
            status: booking?.status || 'pending',
            timesCount: Array.isArray(booking?.times) ? booking.times.length : 0,
        },
    });
    // #endregion
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) {
            return { ok: false, error: 'Firebase nem elérhető' };
        }
        const db = firebase.firestore();
        const status = (booking.status || 'pending') as BookingStatus;
        const doc = {
            ...booking,
            status,
            paymentStatus: booking.paymentStatus || ('unpaid' as PaymentStatus),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection('bookings').doc(booking.id).set(doc);
        await db.collection('pendingBookings').doc(booking.id).set(doc).catch(() => undefined);
        if (status === 'approved') {
            await db
                .collection('approvedBookings')
                .doc(booking.id)
                .set(doc)
                .catch(() => undefined);
        }
        // #region agent log
        agentDebugLog({
            hypothesisId: 'R1',
            location: 'booking/firestoreBookings.ts:saveBookingToFirestore:ok',
            message: 'save booking success',
            data: { status },
        });
        // #endregion
        return { ok: true };
    } catch (err: any) {
        console.error('Firestore booking save failed:', err);
        // #region agent log
        agentDebugLog({
            hypothesisId: 'R1',
            location: 'booking/firestoreBookings.ts:saveBookingToFirestore:err',
            message: 'save booking failed',
            data: { err: String(err?.message || err).slice(0, 120) },
        });
        // #endregion
        return { ok: false, error: err?.message || 'Firestore mentés sikertelen' };
    }
}

const ADMIN_LESSON_PRICE_PER_HOUR = 11000;

/** Tanár manuálisan felvesz órát a naptárba (jóváhagyott foglalásként). */
export async function createAdminLessonBooking(params: {
    date: string;
    times: string[];
    customerName: string;
    customerEmail?: string;
    lessonType?: 'online' | 'personal';
    selectedSubject?: string;
    totalPrice?: number;
}): Promise<{ ok: boolean; booking?: BookingPayload; error?: string }> {
    const name = String(params.customerName || '').trim();
    const email = String(params.customerEmail || '').trim().toLowerCase();
    const times = (params.times || []).map((t) => String(t).trim()).filter(Boolean);
    const date = String(params.date || '').trim();

    if (!name) return { ok: false, error: 'Add meg a diák nevét.' };
    if (!date) return { ok: false, error: 'Válassz napot.' };
    if (times.length === 0) return { ok: false, error: 'Válassz legalább egy órasávot.' };

    const booking: BookingPayload = {
        id: `booking_admin_${Date.now()}`,
        date,
        times,
        customerName: name.slice(0, 80),
        customerEmail: email.slice(0, 120) || `nincs+${Date.now()}@local.invalid`,
        lessonType: params.lessonType === 'personal' ? 'personal' : 'online',
        selectedSubject: (params.selectedSubject || 'Matek óra').trim().slice(0, 120),
        hobby: '—',
        totalPrice:
            typeof params.totalPrice === 'number'
                ? params.totalPrice
                : times.length * ADMIN_LESSON_PRICE_PER_HOUR,
        submittedAt: new Date().toISOString(),
        status: 'approved',
        paymentStatus: 'unpaid',
        gdprAccepted: true,
        gdprAcceptedAt: new Date().toISOString(),
        gdprVersion: 'admin-created',
    };

    const saved = await saveBookingToFirestore(booking);
    if (!saved.ok) return { ok: false, error: saved.error };
    return { ok: true, booking };
}

export async function updateBookingStatus(
    bookingId: string,
    status: 'approved' | 'rejected' | 'cancelled',
    booking?: BookingPayload
): Promise<boolean> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return false;
        const db = firebase.firestore();
        const stamp =
            status === 'approved'
                ? { approvedAt: new Date().toISOString() }
                : status === 'rejected'
                  ? { rejectedAt: new Date().toISOString() }
                  : { cancelledAt: new Date().toISOString() };
        const patch = {
            status,
            ...stamp,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection('bookings').doc(bookingId).set(patch, { merge: true });
        await db
            .collection('pendingBookings')
            .doc(bookingId)
            .set(patch, { merge: true })
            .catch(() => undefined);
        if (status === 'approved' && booking) {
            await db
                .collection('approvedBookings')
                .doc(bookingId)
                .set({ ...booking, ...patch })
                .catch(() => undefined);
        }
        if (status === 'cancelled' || status === 'rejected') {
            await db
                .collection('approvedBookings')
                .doc(bookingId)
                .set(patch, { merge: true })
                .catch(() => undefined);
        }
        return true;
    } catch (err) {
        console.error('updateBookingStatus failed:', err);
        return false;
    }
}

export async function updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus
): Promise<boolean> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore || !bookingId) return false;
        const patch: Record<string, unknown> = {
            paymentStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (paymentStatus === 'paid') {
            patch.paidAt = new Date().toISOString();
        }
        const db = firebase.firestore();
        await db.collection('bookings').doc(bookingId).set(patch, { merge: true });
        await db.collection('pendingBookings').doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        await db.collection('approvedBookings').doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        return true;
    } catch (err) {
        console.error('updateBookingPaymentStatus failed:', err);
        return false;
    }
}

export async function markReminderSent(bookingId: string): Promise<boolean> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore || !bookingId) return false;
        const stamp = new Date().toISOString();
        const patch = {
            reminderSentAt: stamp,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        const db = firebase.firestore();
        await db.collection('bookings').doc(bookingId).set(patch, { merge: true });
        await db.collection('approvedBookings').doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        await db.collection('pendingBookings').doc(bookingId).set(patch, { merge: true }).catch(() => undefined);
        return true;
    } catch (err) {
        console.error('markReminderSent failed:', err);
        return false;
    }
}

/** Holnapi jóváhagyott órák, amikhez még nem ment emlékeztető. */
export async function loadReminderCandidatesFromFirestore(
    dateKey?: string
): Promise<BookingPayload[]> {
    const target = dateKey || getBudapestDateKeyOffset(1);
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const db = firebase.firestore();
        const map = new Map<string, BookingPayload>();

        const merge = (snap: any) => {
            snap.forEach((doc: any) => {
                const data = doc.data() || {};
                if (String(data.date || '') !== target) return;
                if (data.status !== 'approved') return;
                if (data.reminderSentAt) return;
                map.set(doc.id, { id: doc.id, ...data });
            });
        };

        try {
            const byDate = await db
                .collection('bookings')
                .where('date', '==', target)
                .where('status', '==', 'approved')
                .get();
            merge(byDate);
        } catch (err) {
            console.warn('reminder bookings query failed:', err);
        }

        try {
            merge(await db.collection('approvedBookings').get());
        } catch {
            // ignore
        }

        return Array.from(map.values());
    } catch (err) {
        console.error('loadReminderCandidatesFromFirestore failed:', err);
        return [];
    }
}

/** Emlékeztetők küldése a holnapi (vagy megadott nap) jóváhagyott órákra. */
export async function processLessonReminders(dateKey?: string): Promise<ReminderRunResult> {
    const target = dateKey || getBudapestDateKeyOffset(1);
    const list = await loadReminderCandidatesFromFirestore(target);
    const result: ReminderRunResult = {
        dateKey: target,
        candidates: list.length,
        sent: 0,
        failed: 0,
        errors: [],
    };

    for (const booking of list) {
        const emailed = await sendBookingEmailFromClient('lesson_reminder', booking);
        if (emailed.ok) {
            await markReminderSent(booking.id);
            result.sent += 1;
        } else {
            result.failed += 1;
            result.errors.push(
                `${booking.customerName || booking.id}: ${emailed.error || 'küldés sikertelen'}`
            );
        }
    }

    return result;
}

/** Diák lemondása: Firestore + e-mail (admin + diák). */
export async function cancelBookingByStudent(
    booking: BookingPayload
): Promise<{ ok: boolean; error?: string }> {
    if (!booking?.id) return { ok: false, error: 'Hiányzó foglalás' };
    const status = booking.status || 'pending';
    if (status !== 'pending' && status !== 'approved') {
        return { ok: false, error: 'Ez a foglalás már nem mondható le.' };
    }
    if (booking.date) {
        const day = new Date(booking.date + 'T23:59:59');
        if (day.getTime() < Date.now()) {
            return { ok: false, error: 'Múltbeli óra nem mondható le.' };
        }
    }

    const saved = await updateBookingStatus(booking.id, 'cancelled', booking);
    if (!saved) return { ok: false, error: 'Nem sikerült menteni a lemondást.' };

    const emailed = await sendBookingEmailFromClient('booking_cancelled', {
        ...booking,
        status: 'cancelled',
    });
    if (!emailed.ok) {
        return {
            ok: true,
            error: emailed.error || 'Lemondva, de az e-mail nem ment el.',
        };
    }
    return { ok: true };
}

export async function loadActiveBookingsFromFirestore(): Promise<BookingPayload[]> {
    try {
        const res = await fetch('/api/public-busy-slots', {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        });
        if (!res.ok) return [];
        const json = await res.json();
        const slots = Array.isArray(json?.data?.slots) ? json.data.slots : [];
        return slots.map((s: any, i: number) => ({
            id: `busy_${s.date}_${i}`,
            date: String(s.date || ''),
            times: Array.isArray(s.times) ? s.times.map(String) : [],
            customerName: '',
            customerEmail: '',
            lessonType: 'online' as const,
            selectedSubject: '',
            hobby: '',
            totalPrice: 0,
            submittedAt: '',
            status: (s.status === 'approved' ? 'approved' : 'pending') as BookingStatus,
        }));
    } catch (err: any) {
        const msg = String(err?.message || err || '');
        if (!/permission|insufficient/i.test(msg)) {
            console.warn('loadActiveBookingsFromFirestore:', msg.slice(0, 120));
        }
        return [];
    }
}

let adminCalendarDenied = false;

export function isAdminCalendarDenied(): boolean {
    return adminCalendarDenied || isAdminFirestoreDenied();
}

/** Admin naptár + blockedSlots — egy API hívás, nincs kliens bookings.get(). */
export async function loadAdminCalendarBundle(): Promise<{
    bookings: BookingPayload[];
    blocked: BlockedDay[];
}> {
    if (adminCalendarDenied || isAdminFirestoreDenied()) {
        return { bookings: [], blocked: [] };
    }

    try {
        const { apiGetAuth, getIdToken } = await import('../apiClient');
        const token = await getIdToken();
        if (!token) return { bookings: [], blocked: [] };

        const res = await apiGetAuth<{
            bookings?: BookingPayload[];
            blocked?: BlockedDay[];
            permissionDenied?: boolean;
        }>('/api/admin/calendar-bookings');

        if (res.ok && res.data?.permissionDenied) {
            adminCalendarDenied = true;
            markAdminFirestoreDenied();
            return { bookings: [], blocked: [] };
        }

        if (res.ok) {
            adminCalendarDenied = false;
            const bookings = Array.isArray(res.data?.bookings) ? [...res.data.bookings] : [];
            bookings.sort((a, b) => {
                const d = String(b.date || '').localeCompare(String(a.date || ''));
                if (d !== 0) return d;
                return String(a.times?.[0] || '').localeCompare(String(b.times?.[0] || ''));
            });
            return {
                bookings,
                blocked: Array.isArray(res.data?.blocked) ? res.data.blocked : [],
            };
        }

        const status = Number((res as any).status || 0);
        if (status === 403 || status === 401) {
            adminCalendarDenied = true;
            markAdminFirestoreDenied();
        }
        return { bookings: [], blocked: [] };
    } catch {
        return { bookings: [], blocked: [] };
    }
}

/** @deprecated — használd loadAdminCalendarBundle */
export async function loadAdminCalendarBookingsFromFirestore(): Promise<BookingPayload[]> {
    const { bookings } = await loadAdminCalendarBundle();
    return bookings;
}

let pendingBookingsDenied = false;

export function isPendingBookingsDenied(): boolean {
    return pendingBookingsDenied || isAdminFirestoreDenied();
}

export async function loadPendingBookingsFromFirestore(): Promise<BookingPayload[]> {
    if (pendingBookingsDenied || isAdminFirestoreDenied()) return [];

    try {
        const { apiGetAuth, getIdToken } = await import('../apiClient');
        const token = await getIdToken();
        if (!token) {
            return [];
        }

        const res = await apiGetAuth<{
            pending?: BookingPayload[];
            permissionDenied?: boolean;
        }>('/api/admin/teacher-bootstrap');

        if (res.ok && res.data?.permissionDenied) {
            pendingBookingsDenied = true;
            markAdminFirestoreDenied();
            return [];
        }

        if (res.ok && Array.isArray(res.data?.pending)) {
            pendingBookingsDenied = false;
            return [...res.data.pending].sort(
                (a: any, b: any) =>
                    new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
            );
        }

        if (!res.ok) {
            const status = Number((res as any).status || 0);
            const err = String(res.error || '');
            if (
                status === 403 ||
                status === 401 ||
                /rules|permission|jogosult|tilt|HTTP 403/i.test(err)
            ) {
                pendingBookingsDenied = true;
                markAdminFirestoreDenied();
            }
            return [];
        }
    } catch {
        /* soft empty */
    }

    return [];
}

/** Diák saját foglalásai e-mail alapján (pending + approved + rejected). */
export async function loadStudentBookingsFromFirestore(
    customerEmail: string
): Promise<BookingPayload[]> {
    const email = (customerEmail || '').trim().toLowerCase();
    if (!email) return [];

    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return [];
        const db = firebase.firestore();
        const map = new Map<string, BookingPayload>();

        const mergeSnap = (snap: any) => {
            snap.docs.forEach((doc: any) => {
                const data = doc.data() || {};
                const docEmail = String(data.customerEmail || '').trim().toLowerCase();
                if (docEmail && docEmail !== email) return;
                map.set(doc.id, { id: doc.id, ...data });
            });
        };

        const emailVariants = Array.from(new Set([customerEmail.trim(), email].filter(Boolean)));
        for (const variant of emailVariants) {
            try {
                const byEmail = await db
                    .collection('bookings')
                    .where('customerEmail', '==', variant)
                    .get();
                mergeSnap(byEmail);
            } catch (err) {
                console.warn('bookings by email query failed:', err);
            }
        }

        return Array.from(map.values()).sort((a, b) => {
            const da = a.date || '';
            const db_ = b.date || '';
            if (da !== db_) return db_.localeCompare(da);
            return String(b.submittedAt || '').localeCompare(String(a.submittedAt || ''));
        });
    } catch (err) {
        console.error('loadStudentBookingsFromFirestore failed:', err);
        return [];
    }
}
