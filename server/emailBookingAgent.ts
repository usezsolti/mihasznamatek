import { ADMIN_BOOKING_EMAIL, LESSON_PRICE_PER_HOUR } from '../utils/booking/types';
import { getAvailabilityRange, getBudapestDateKeyOffset } from '../utils/bookingAvailability';
import { classifyBookingMailIntent } from '../utils/bookingMailIntent';
import {
    earliestFreeSlot,
    hasStudentWindow,
    isSlotFree,
    latestStudentText,
    studentIsFlexible,
    mergeWindows,
    parseRequestedSlots,
    parseStudentWindow,
    suggestPackedSlots,
    parseChoiceFromOffers,
    type PackedSlot,
} from '../utils/bookingPackedSlots';
import { AsyncLocalStorage } from 'node:async_hooks';
import { composeBookingDraft, composeTeacherBookedDraft } from './emailBookingCompose';
import { FIRESTORE_DOCS_BASE } from './config';
import { getAdminDb } from './firebaseAdmin';
import {
    deleteDocument,
    getDocument,
    listCollection,
    setDocument,
} from './firestoreRest';
import {
    appendDraftReply,
    appendStandaloneDraft,
    fetchUnprocessedInbox,
    gmailImapReady,
    markProcessed,
    type InboundMail,
} from './gmailImap';
import { resolveFirebaseWebApiKey } from '../utils/firebasePublicConfig';

import type { EmailBookingThread, EmailThreadStatus } from '../utils/emailBookingThread';

const authStore = new AsyncLocalStorage<{ token?: string }>();

export function withEmailAgentAuth<T>(token: string | undefined, fn: () => Promise<T>): Promise<T> {
    return authStore.run({ token: token || undefined }, fn);
}

function userToken(): string {
    return authStore.getStore()?.token || '';
}

const SETTINGS_DOC = 'emailAgent';
const THREADS = 'emailBookingThreads';
const RATE_MS = 3 * 60 * 1000;

export type AgentRunResult = {
    enabled: boolean;
    imapReady: boolean;
    scanned: number;
    drafts: number;
    skipped: number;
    errors: string[];
};

function ownAddress(): string {
    return String(process.env.GMAIL_USER || ADMIN_BOOKING_EMAIL).toLowerCase();
}

function asThread(id: string, data: Record<string, unknown>): EmailBookingThread {
    return { id, ...(data as Omit<EmailBookingThread, 'id'>) };
}

async function writeDoc(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
    const db = getAdminDb();
    if (db) {
        await db.collection(collection).doc(id).set(data, { merge: true });
        return;
    }
    const token = userToken();
    if (!token) throw new Error('Bejelentkezés kell az e-mail ügynök Firestore írásához.');
    await setDocument(`${collection}/${id}`, token, data, true);
}

async function readSettingsDoc(): Promise<Record<string, unknown> | null> {
    const db = getAdminDb();
    if (db) {
        try {
            const snap = await db.collection('settings').doc(SETTINGS_DOC).get();
            return snap.exists ? (snap.data() as Record<string, unknown>) : null;
        } catch {
            return null;
        }
    }
    const token = userToken();
    if (token) {
        try {
            return await getDocument(`settings/${SETTINGS_DOC}`, token);
        } catch {
            return null;
        }
    }
    const key = resolveFirebaseWebApiKey();
    if (!key) return null;
    try {
        const res = await fetch(
            `${FIRESTORE_DOCS_BASE}/settings/${SETTINGS_DOC}?key=${encodeURIComponent(key)}`
        );
        if (!res.ok) return null;
        const json = await res.json();
        const fields = json?.fields || {};
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(fields as Record<string, any>)) {
            if (v?.booleanValue != null) out[k] = v.booleanValue;
            else if (v?.stringValue != null) out[k] = v.stringValue;
            else if (v?.integerValue != null) out[k] = Number(v.integerValue);
            else if (v?.doubleValue != null) out[k] = v.doubleValue;
        }
        return out;
    } catch {
        return null;
    }
}

export async function isEmailAgentEnabled(): Promise<boolean> {
    const doc = await readSettingsDoc();
    return doc?.enabled === true;
}

export async function getEmailAgentSettings(): Promise<{
    enabled: boolean;
    lastRunAt: string;
    lastRunDrafts: number;
    lastRunScanned: number;
}> {
    const doc = await readSettingsDoc();
    return {
        enabled: doc?.enabled === true,
        lastRunAt: String(doc?.lastRunAt || ''),
        lastRunDrafts: Number(doc?.lastRunDrafts) || 0,
        lastRunScanned: Number(doc?.lastRunScanned) || 0,
    };
}

export async function setEmailAgentEnabled(enabled: boolean): Promise<void> {
    await writeDoc('settings', SETTINGS_DOC, {
        enabled,
        updatedAt: new Date().toISOString(),
    });
}

export async function listEmailAgentThreads(limit = 30): Promise<EmailBookingThread[]> {
    const db = getAdminDb();
    if (db) {
        try {
            const snap = await db.collection(THREADS).orderBy('updatedAtMs', 'desc').limit(limit).get();
            return snap.docs.map((d) => asThread(d.id, d.data() as Record<string, unknown>));
        } catch {
            const snap = await db.collection(THREADS).limit(limit).get();
            return snap.docs.map((d) => asThread(d.id, d.data() as Record<string, unknown>));
        }
    }
    const token = userToken();
    if (!token) return [];
    try {
        const docs = await listCollection(THREADS, token, {
            pageSize: limit,
            orderBy: 'updatedAtMs desc',
        });
        return docs.map((d) => asThread(String(d.__id || ''), d));
    } catch {
        const docs = await listCollection(THREADS, token, { pageSize: limit });
        return docs.map((d) => asThread(String(d.__id || ''), d));
    }
}

async function loadThread(id: string): Promise<EmailBookingThread | null> {
    const db = getAdminDb();
    if (db) {
        const snap = await db.collection(THREADS).doc(id).get();
        if (!snap.exists) return null;
        return asThread(snap.id, snap.data() as Record<string, unknown>);
    }
    const token = userToken();
    if (!token) return null;
    const doc = await getDocument(`${THREADS}/${id}`, token);
    if (!doc) return null;
    return asThread(String(doc.__id || id), doc);
}

async function saveThread(thread: EmailBookingThread): Promise<void> {
    try {
        await writeDoc(THREADS, thread.id, { ...thread });
    } catch {
        /* cron Admin SDK nélkül: IMAP zászló akkor is megmarad */
    }
}

async function isKnownCustomer(email: string): Promise<boolean> {
    if (!email) return false;
    const db = getAdminDb();
    if (db) {
        try {
            const snap = await db.collection('bookings').where('customerEmail', '==', email).limit(1).get();
            return !snap.empty;
        } catch {
            return false;
        }
    }
    return false;
}

async function holdSlot(opts: {
    threadId: string;
    email: string;
    name: string;
    dateKey: string;
    time: string;
}): Promise<string> {
    const id = `booking_email_${opts.threadId}`.replace(/[^\w.-]+/g, '_').slice(0, 80);
    const now = new Date().toISOString();
    const doc = {
        id,
        date: opts.dateKey,
        times: [opts.time],
        customerName: opts.name || 'Diák',
        customerEmail: opts.email,
        lessonType: 'online' as const,
        selectedSubject: 'matek',
        hobby: '—',
        totalPrice: LESSON_PRICE_PER_HOUR,
        submittedAt: now,
        status: 'approved',
        paymentStatus: 'unpaid',
        source: 'email-agent',
        emailThreadId: opts.threadId,
        updatedAt: now,
    };
    await writeDoc('bookings', id, doc);
    try {
        await writeDoc('pendingBookings', id, doc);
    } catch {
        /* opcionális */
    }
    return id;
}

export async function releaseEmailHold(threadId: string): Promise<void> {
    const thread = await loadThread(threadId);
    if (!thread?.bookingId) return;
    const now = new Date().toISOString();
    await writeDoc('bookings', thread.bookingId, {
        status: 'cancelled',
        cancelledAt: now,
        updatedAt: now,
    });
    const db = getAdminDb();
    if (db) {
        await db.collection('pendingBookings').doc(thread.bookingId).delete().catch(() => undefined);
    } else if (userToken()) {
        await deleteDocument(`pendingBookings/${thread.bookingId}`, userToken()).catch(() => undefined);
    }
    await saveThread({
        ...thread,
        status: 'negotiating',
        bookingId: undefined,
        holdDate: undefined,
        holdTime: undefined,
        updatedAtMs: Date.now(),
    });
}

function firstName(fromName: string, email: string): string {
    const n = fromName.trim().split(/\s+/)[0] || '';
    if (n && !n.includes('@')) return n;
    return email.split('@')[0] || '';
}

async function processOne(mail: InboundMail): Promise<'draft' | 'skip'> {
    const me = ownAddress();
    if (!mail.fromEmail || mail.fromEmail === me) {
        await markProcessed(mail.mailbox, mail.uid);
        return 'skip';
    }

    const existing = await loadThread(mail.gmailThreadId);
    const known = existing ? true : await isKnownCustomer(mail.fromEmail);
    const intent = classifyBookingMailIntent({
        subject: mail.subject,
        text: mail.text,
        fromEmail: mail.fromEmail,
        knownCustomer: known,
        inAgentThread: Boolean(existing),
    });
    // #region agent log
    {
        const { agentDebugLog } = await import('../utils/agentDebugLog');
        agentDebugLog({
            hypothesisId: 'MAIL',
            location: 'emailBookingAgent.ts:processOne',
            message: 'mail intent',
            data: {
                intent,
                inAgentThread: Boolean(existing),
                known,
                subjLen: mail.subject.length,
                textLen: mail.text.length,
            },
            runId: 'mail-filter',
        });
    }
    // #endregion

    const now = Date.now();
    const base: EmailBookingThread =
        existing ||
        ({
            id: mail.gmailThreadId,
            fromEmail: mail.fromEmail,
            fromName: mail.fromName,
            subject: mail.subject,
            status: 'negotiating',
            lastStudentText: '',
            lastDraftText: '',
            lastDraftAtMs: 0,
            window: null,
            updatedAtMs: now,
            createdAtMs: now,
        } satisfies EmailBookingThread);

    if (intent === 'ignore') {
        await markProcessed(mail.mailbox, mail.uid);
        return 'skip';
    }

    if (intent === 'escalate') {
        await saveThread({
            ...base,
            status: 'escalate',
            lastStudentText: mail.text.slice(0, 1500),
            subject: mail.subject,
            updatedAtMs: now,
        });
        await markProcessed(mail.mailbox, mail.uid);
        return 'skip';
    }

    if (base.lastDraftAtMs && now - base.lastDraftAtMs < RATE_MS) {
        return 'skip';
    }

    const fresh = latestStudentText(mail.text);
    const blob = `${mail.subject}\n${fresh}`;
    const parsedWindow = parseStudentWindow(blob);
    const window = mergeWindows(base.window, parsedWindow);
    const today = getBudapestDateKeyOffset(0);
    const chosen = parseChoiceFromOffers(blob, base.offeredSlots || []);
    const requested = chosen ? [chosen] : parseRequestedSlots(blob, today);
    const days = (await getAvailabilityRange(14)).map((d) => ({
        dateKey: d.dateKey,
        weekdayHu: d.weekdayHu,
        freeSlots: d.freeSlots,
        takenSlots: d.takenSlots,
    }));

    const name = firstName(mail.fromName || base.fromName, mail.fromEmail);
    let composed = composeBookingDraft({ kind: 'ask_window', studentName: name });
    let nextStatus: EmailThreadStatus = 'negotiating';
    let bookingId = base.bookingId;
    let holdDate = base.holdDate;
    let holdTime = base.holdTime;
    let offeredSlots = base.offeredSlots;

    const flexible = studentIsFlexible(blob);
    const namedFree = requested.find((slot) => isSlotFree(days, slot.dateKey, slot.time)) || null;

    if (namedFree) {
        composed = composeBookingDraft({ kind: 'confirm', studentName: name, confirm: namedFree });
        try {
            bookingId = await holdSlot({
                threadId: mail.gmailThreadId,
                email: mail.fromEmail,
                name: mail.fromName || name,
                dateKey: namedFree.dateKey,
                time: namedFree.time,
            });
            holdDate = namedFree.dateKey;
            holdTime = namedFree.time;
            nextStatus = 'held';
            offeredSlots = undefined;
            const teacher = composeTeacherBookedDraft({
                studentName: mail.fromName || name,
                studentEmail: mail.fromEmail,
                slot: namedFree,
                bookingId,
            });
            await appendStandaloneDraft({
                toEmail: ownAddress() || ADMIN_BOOKING_EMAIL,
                subject: `Foglalás rögzítve · ${mail.fromName || name} · ${namedFree.time}`,
                body: teacher.text,
                html: teacher.html,
            });
        } catch {
            nextStatus = 'negotiating';
        }
    } else if (requested.length) {
        const wanted = requested[0];
        const sameDay = days.filter((day) => day.dateKey === wanted.dateKey);
        const alternatives = suggestPackedSlots(sameDay.length ? sameDay : days, window, 3);
        composed = composeBookingDraft({
            kind: 'offer',
            studentName: name,
            packed: alternatives,
            requestedTaken: wanted,
            window,
        });
        offeredSlots = alternatives;
    } else if (flexible) {
        const earliest = earliestFreeSlot(days);
        if (earliest) {
            composed = composeBookingDraft({ kind: 'offer', studentName: name, packed: [earliest], window });
            offeredSlots = [earliest];
        } else {
            composed = composeBookingDraft({ kind: 'ask_window', studentName: name });
        }
    } else if (hasStudentWindow(window)) {
        const packed: PackedSlot[] = suggestPackedSlots(days, window, 3);
        composed = composeBookingDraft({ kind: 'offer', studentName: name, packed, window });
        offeredSlots = packed;
    } else {
        composed = composeBookingDraft({ kind: 'ask_window', studentName: name });
        offeredSlots = undefined;
    }

    await appendDraftReply({
        toEmail: mail.fromEmail,
        subject: mail.subject,
        inReplyTo: mail.messageId,
        references: [mail.references, mail.messageId].filter(Boolean).join(' '),
        body: composed.text,
        html: composed.html,
    });

    await saveThread({
        ...base,
        fromEmail: mail.fromEmail,
        fromName: mail.fromName || base.fromName,
        subject: mail.subject,
        status: nextStatus,
        lastStudentText: mail.text.slice(0, 1500),
        lastDraftText: composed.text,
        lastDraftAtMs: now,
        window,
        bookingId,
        holdDate,
        holdTime,
        offeredSlots,
        updatedAtMs: now,
    });
    await markProcessed(mail.mailbox, mail.uid);
    return 'draft';
}

export async function runEmailBookingAgent(): Promise<AgentRunResult> {
    const result = await executeEmailBookingAgent();
    await recordAgentRun(result);
    // #region agent log
    fetch('http://127.0.0.1:7785/ingest/aea5f5c4-876a-4e2f-82d7-0264bfca90ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c04d6a'},body:JSON.stringify({sessionId:'c04d6a',runId:'mail-cron',hypothesisId:'H-cron',location:'server/emailBookingAgent.ts:run',message:'email agent run finished',data:{enabled:result.enabled,imapReady:result.imapReady,scanned:result.scanned,drafts:result.drafts,skipped:result.skipped,errorCount:result.errors.length,lastRunWrite:'attempted'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return result;
}

async function executeEmailBookingAgent(): Promise<AgentRunResult> {
    const errors: string[] = [];
    const enabled = await isEmailAgentEnabled();
    const imapReady = gmailImapReady();
    if (!enabled) {
        return { enabled, imapReady, scanned: 0, drafts: 0, skipped: 0, errors };
    }
    if (!imapReady) {
        return { enabled, imapReady, scanned: 0, drafts: 0, skipped: 0, errors: ['GMAIL_USER / GMAIL_APP_PASSWORD hiányzik'] };
    }

    let mails: InboundMail[] = [];
    try {
        mails = await fetchUnprocessedInbox(8);
    } catch (e: any) {
        return {
            enabled,
            imapReady,
            scanned: 0,
            drafts: 0,
            skipped: 0,
            errors: [String(e?.message || e).slice(0, 200)],
        };
    }

    let drafts = 0;
    let skipped = 0;
    for (const mail of mails) {
        try {
            const r = await processOne(mail);
            if (r === 'draft') drafts += 1;
            else skipped += 1;
        } catch (e: any) {
            skipped += 1;
            errors.push(`${mail.fromEmail}: ${String(e?.message || e).slice(0, 120)}`);
        }
    }
    return { enabled, imapReady, scanned: mails.length, drafts, skipped, errors };
}

async function recordAgentRun(result: AgentRunResult): Promise<void> {
    try {
        await writeDoc('settings', SETTINGS_DOC, {
            lastRunAt: new Date().toISOString(),
            lastRunDrafts: result.drafts,
            lastRunScanned: result.scanned,
        });
        // #region agent log
        fetch('http://127.0.0.1:7785/ingest/aea5f5c4-876a-4e2f-82d7-0264bfca90ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c04d6a'},body:JSON.stringify({sessionId:'c04d6a',runId:'mail-cron',hypothesisId:'H-lastrun',location:'server/emailBookingAgent.ts:recordAgentRun',message:'lastRun persisted',data:{ok:true,hasAdminDb:Boolean(getAdminDb()),hasUserToken:Boolean(userToken()),drafts:result.drafts,scanned:result.scanned},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
    } catch (e: any) {
        // #region agent log
        fetch('http://127.0.0.1:7785/ingest/aea5f5c4-876a-4e2f-82d7-0264bfca90ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c04d6a'},body:JSON.stringify({sessionId:'c04d6a',runId:'mail-cron',hypothesisId:'H-lastrun',location:'server/emailBookingAgent.ts:recordAgentRun',message:'lastRun persist failed',data:{ok:false,hasAdminDb:Boolean(getAdminDb()),hasUserToken:Boolean(userToken()),err:String(e?.message||e).slice(0,120)},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
    }
}
