import type { BlockedSlot, Booking } from '@prisma/client';
import type {
    BlockedDay,
    BookingPayload,
    BookingStatus,
    PaymentStatus,
} from '../utils/bookingNotify';
import { parseJsonField, stringifyJsonField } from './jsonField';

export function asStringArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String);
    return parseJsonField<string[]>(value, []);
}

export function timesJson(times: string[]): string {
    return stringifyJsonField(times);
}

export function bookingToPayload(row: Booking): BookingPayload {
    const uploadedFiles = parseJsonField<BookingPayload['uploadedFiles']>(
        row.uploadedFiles,
        undefined
    );
    return {
        id: row.id,
        date: row.date,
        times: asStringArray(row.times),
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        lessonType: row.lessonType === 'personal' ? 'personal' : 'online',
        selectedSubject: row.selectedSubject,
        hobby: row.hobby,
        totalPrice: row.totalPrice,
        postalCode: row.postalCode || undefined,
        street: row.street || undefined,
        houseNumber: row.houseNumber || undefined,
        uploadedFiles: uploadedFiles || undefined,
        submittedAt: row.submittedAt.toISOString(),
        status: row.status as BookingStatus,
        paymentStatus: (row.paymentStatus as PaymentStatus | null) || undefined,
        paidAt: row.paidAt?.toISOString(),
        reminderSentAt: row.reminderSentAt?.toISOString(),
        gdprAccepted: row.gdprAccepted,
        gdprAcceptedAt: row.gdprAcceptedAt?.toISOString(),
        gdprVersion: row.gdprVersion || undefined,
    };
}

export function blockedSlotToDay(row: BlockedSlot): BlockedDay {
    return {
        date: row.date,
        times: asStringArray(row.times),
        allDay: row.allDay,
        note: row.note || undefined,
        updatedAt: row.updatedAt.toISOString(),
    };
}
