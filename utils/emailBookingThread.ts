import type { StudentWindow } from './bookingPackedSlots';

export type EmailThreadStatus = 'negotiating' | 'held' | 'done' | 'skipped' | 'escalate';

export type EmailBookingThread = {
    id: string;
    fromEmail: string;
    fromName: string;
    subject: string;
    status: EmailThreadStatus;
    lastStudentText: string;
    lastDraftText: string;
    lastDraftAtMs: number;
    window: StudentWindow | null;
    bookingId?: string;
    holdDate?: string;
    holdTime?: string;
    offeredSlots?: Array<{ dateKey: string; time: string; weekdayHu?: string }>;
    updatedAtMs: number;
    createdAtMs: number;
};
