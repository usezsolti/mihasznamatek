export const ADMIN_BOOKING_EMAIL = 'usezsolti@gmail.com';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type PaymentStatus = 'unpaid' | 'transfer_pending' | 'paid';

export type BookingAttachment = {
    name: string;
    url: string;
};

export type BookingPayload = {
    id: string;
    date: string;
    times: string[];
    customerName: string;
    customerEmail: string;
    lessonType: 'online' | 'personal';
    selectedSubject: string;
    hobby: string;
    totalPrice: number;
    postalCode?: string;
    street?: string;
    houseNumber?: string;
    /** Új: {name,url}[]; régi foglalásoknál lehet sima fájlnév-string is. */
    uploadedFiles?: Array<BookingAttachment | string>;
    submittedAt: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    paidAt?: string;
    reminderSentAt?: string;
    gdprAccepted?: boolean;
    gdprAcceptedAt?: string;
    gdprVersion?: string;
};

export type BookingEmailType =
    | 'admin_new'
    | 'student_approved'
    | 'student_rejected'
    | 'booking_cancelled'
    | 'lesson_reminder';

export type EmailSendResult = {
    ok: boolean;
    provider?: 'gmail' | 'web3forms' | 'formsubmit';
    error?: string;
    needsActivation?: boolean;
    warning?: string;
};

export type ReminderRunResult = {
    dateKey: string;
    candidates: number;
    sent: number;
    failed: number;
    errors: string[];
};

export type BlockedDay = {
    date: string;
    times: string[];
    allDay?: boolean;
    note?: string;
    updatedAt?: string;
};

export type MailPayload = {
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
    cc?: string;
};

export function normalizeAttachments(
    files?: Array<BookingAttachment | string> | null
): BookingAttachment[] {
    if (!files?.length) return [];
    return files
        .map((f) => {
            if (typeof f === 'string') {
                const isUrl = /^https?:\/\//i.test(f);
                return { name: isUrl ? 'csatolmány' : f, url: isUrl ? f : '' };
            }
            return { name: f.name || 'csatolmány', url: f.url || '' };
        })
        .filter((f) => f.name);
}

export function formatAttachmentsLine(
    files?: Array<BookingAttachment | string> | null
): string {
    const list = normalizeAttachments(files);
    if (!list.length) return 'nincs';
    return list.map((f) => (f.url ? `${f.name}: ${f.url}` : f.name)).join('\n  ');
}

export function paymentStatusLabel(status?: PaymentStatus | string): string {
    if (status === 'paid') return 'Fizetve';
    if (status === 'transfer_pending') return 'Utalás folyamatban';
    return 'Nincs fizetve';
}

export function getFirebase(): any | null {
    if (typeof window === 'undefined') return null;
    return (window as any).firebase || null;
}
