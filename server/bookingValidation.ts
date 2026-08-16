import type { BookingPayload, BookingStatus, PaymentStatus } from '../utils/bookingNotify';
import { isValidEmail, sanitizeText } from '../utils/apiSecurity';

export function sanitizeBookingInput(raw: unknown, opts?: { requireId?: boolean }): BookingPayload | null {
    if (!raw || typeof raw !== 'object') return null;
    const o = raw as Record<string, unknown>;

    const customerEmail = sanitizeText(o.customerEmail, 200).toLowerCase();
    const customerName = sanitizeText(o.customerName, 120);
    const id = sanitizeText(o.id, 80);
    const date = sanitizeText(o.date, 32);

    if (!isValidEmail(customerEmail) || !customerName || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return null;
    }
    if (opts?.requireId !== false && !id) return null;

    const times = Array.isArray(o.times)
        ? o.times
              .map((t) => sanitizeText(t, 8))
              .filter((t) => /^\d{2}:\d{2}$/.test(t))
              .slice(0, 12)
        : [];
    if (!times.length) return null;

    const statusRaw = sanitizeText(o.status, 20);
    const status = (['pending', 'approved', 'rejected', 'cancelled'] as const).includes(
        statusRaw as BookingStatus
    )
        ? (statusRaw as BookingStatus)
        : undefined;

    const paymentRaw = sanitizeText(o.paymentStatus, 24);
    const paymentStatus = (['unpaid', 'transfer_pending', 'paid'] as const).includes(
        paymentRaw as PaymentStatus
    )
        ? (paymentRaw as PaymentStatus)
        : undefined;

    return {
        id: id || '',
        date,
        times,
        customerName,
        customerEmail,
        lessonType: o.lessonType === 'personal' ? 'personal' : 'online',
        selectedSubject: sanitizeText(o.selectedSubject, 120),
        hobby: sanitizeText(o.hobby, 500),
        totalPrice: Math.min(Math.max(Number(o.totalPrice) || 0, 0), 5_000_000),
        postalCode: sanitizeText(o.postalCode, 16) || undefined,
        street: sanitizeText(o.street, 120) || undefined,
        houseNumber: sanitizeText(o.houseNumber, 32) || undefined,
        uploadedFiles: Array.isArray(o.uploadedFiles)
            ? o.uploadedFiles
                  .slice(0, 5)
                  .map((f) => {
                      if (typeof f === 'string') return sanitizeText(f, 200);
                      if (!f || typeof f !== 'object') return null;
                      const fo = f as Record<string, unknown>;
                      const url = sanitizeText(fo.url, 500);
                      if (url && !/^https:\/\//i.test(url)) return null;
                      return { name: sanitizeText(fo.name, 120), url };
                  })
                  .filter(Boolean)
            : undefined,
        submittedAt: sanitizeText(o.submittedAt, 40) || new Date().toISOString(),
        status,
        paymentStatus,
        paidAt: sanitizeText(o.paidAt, 40) || undefined,
        reminderSentAt: sanitizeText(o.reminderSentAt, 40) || undefined,
        gdprAccepted: Boolean(o.gdprAccepted),
        gdprAcceptedAt: sanitizeText(o.gdprAcceptedAt, 40) || undefined,
        gdprVersion: sanitizeText(o.gdprVersion, 32) || undefined,
    };
}

export function isBookingOwner(
    booking: { customerEmail: string },
    userEmail: string
): boolean {
    const a = (booking.customerEmail || '').trim().toLowerCase();
    const b = (userEmail || '').trim().toLowerCase();
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.endsWith('@gmail.com') && b.endsWith('@gmail.com')) {
        const base = (addr: string) => addr.split('@')[0].split('+')[0];
        return base(a) === base(b);
    }
    return false;
}
