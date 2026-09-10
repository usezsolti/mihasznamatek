export const ADMIN_BOOKING_EMAIL = 'usezsolti@gmail.com';

/** 1 órás sáv ára — a foglaló és az e-mail ezt használja. */
export const LESSON_PRICE_PER_HOUR = 11000;

export const CANCEL_POLICY_HU =
    'Ha 24 óránál kevesebbel az óra előtt mondod le, a teljes összeget ki kell fizetni.';

export function resolveLessonType(...vals: unknown[]): 'online' | 'personal' {
    for (const v of vals) {
        const s = String(v || '')
            .toLowerCase()
            .trim();
        if (s === 'personal' || s === 'személyes' || s === 'szemelyes') return 'personal';
        if (s === 'online') return 'online';
    }
    return 'online';
}

export function priceForTimes(times: string[] | undefined | null): number {
    const n = Array.isArray(times) ? times.length : 0;
    return n * LESSON_PRICE_PER_HOUR;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'proposed';

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
    username?: string;
    lessonType: 'online' | 'personal';
    selectedSubject: string;
    hobby: string;
    /** Mire készül: dolgozat, érettségi, felvételi… */
    preparingFor?: string;
    preparingForLabel?: string;
    topicId?: string;
    topicTitle?: string;
    topicNote?: string;
    lessonPack?: {
        id: string;
        title: string;
        summary: string;
        pdfUrl?: string;
        source?: string;
        content?: import('../lessonPack').LessonPackContent;
    };
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
    proposedDate?: string;
    proposedTimes?: string[];
    proposalToken?: string;
};

export type BookingEmailType =
    | 'admin_new'
    | 'student_approved'
    | 'student_rejected'
    | 'booking_cancelled'
    | 'lesson_reminder'
    | 'propose_time'
    | 'proposal_accepted'
    | 'student_counter';

export type EmailSendResult = {
    ok: boolean;
    provider?: 'resend' | 'gmail' | 'web3forms' | 'formsubmit';
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
    html?: string;
    replyTo?: string;
    cc?: string;
};

export type MailBuildExtras = {
    approveUrl?: string;
    proposeUrl?: string;
    cancelUrl?: string;
    respondUrl?: string;
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
