import { randomUUID } from 'crypto';
import { FIREBASE_PROJECT_ID } from './config';
import { getAdminDb, getFirebaseAdmin } from './firebaseAdmin';
import {
    DAILY_SHORT_LIMIT,
    budapestDayKey,
    pollinationsVideoUrl,
    quotaDecision,
    topicKey,
    videoModel,
    videoPromptFromScript,
} from './mathShortQuota';
import { composeMathShortScript } from './mathShortScript';

const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
const STALE_MS = 20 * 60 * 1000;

export class MathShortError extends Error {
    status: number;
    constructor(message: string, status = 400) {
        super(message);
        this.status = status;
    }
}

export type MathShortRecord = {
    id: string;
    topic: string;
    topicKey: string;
    dayKey: string;
    title: string;
    hook: string;
    body: string;
    tip: string;
    difficulty: string;
    videoUrl: string | null;
    status: 'queued' | 'running' | 'ready' | 'failed';
    authorId: string;
    createdAtMs: number;
    updatedAtMs: number;
    jobId: string | null;
    error: string | null;
};

type ShortDoc = Record<string, unknown>;

function requireKey(): string {
    const key = String(process.env.POLLINATIONS_API_KEY || '').trim();
    if (!key) throw new MathShortError('Hiányzik a POLLINATIONS_API_KEY.', 503);
    return key;
}

function requireDb() {
    const db = getAdminDb();
    if (!db) {
        throw new MathShortError('A Firebase Admin nincs beállítva, a videót nem tudom elmenteni.', 503);
    }
    return db;
}

function bucketName(): string {
    return process.env.FIREBASE_STORAGE_BUCKET || `${FIREBASE_PROJECT_ID}.appspot.com`;
}

function mapDoc(id: string, data: ShortDoc): MathShortRecord {
    const status = String(data.status || 'failed');
    return {
        id,
        topic: String(data.topic || ''),
        topicKey: String(data.topicKey || ''),
        dayKey: String(data.dayKey || ''),
        title: String(data.title || ''),
        hook: String(data.hook || ''),
        body: String(data.body || ''),
        tip: String(data.tip || ''),
        difficulty: String(data.difficulty || 'közepes'),
        videoUrl: data.videoUrl ? String(data.videoUrl) : null,
        status: status === 'queued' || status === 'running' || status === 'ready' ? status : 'failed',
        authorId: String(data.authorId || ''),
        createdAtMs: Number(data.createdAtMs || 0),
        updatedAtMs: Number(data.updatedAtMs || 0),
        jobId: data.jobId ? String(data.jobId) : null,
        error: data.error ? String(data.error) : null,
    };
}

async function uploadVideo(id: string, bytes: Buffer): Promise<string> {
    const admin = getFirebaseAdmin();
    if (!admin) throw new MathShortError('A Firebase Admin nincs beállítva, a videót nem tudom elmenteni.', 503);
    if (bytes.length < 1000 || bytes.length > MAX_VIDEO_BYTES) {
        throw new Error('A kapott videó mérete nem használható.');
    }
    const token = randomUUID();
    const path = `mathShorts/${id}.mp4`;
    await admin.storage().bucket(bucketName()).file(path).save(bytes, {
        resumable: false,
        metadata: {
            contentType: 'video/mp4',
            metadata: { firebaseStorageDownloadTokens: token },
        },
    });
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName()}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

function jobPhase(data: Record<string, unknown>): 'pending' | 'done' | 'failed' {
    const status = String(data.status || data.state || '').toLowerCase();
    if (['failed', 'error', 'cancelled', 'canceled'].includes(status)) return 'failed';
    if (['succeeded', 'success', 'completed', 'complete', 'ready', 'done'].includes(status)) return 'done';
    return 'pending';
}

function nestedUrl(data: Record<string, unknown>): string {
    const output = data.output as { url?: string } | undefined;
    const result = data.result as { url?: string } | undefined;
    return String(output?.url || result?.url || data.url || '');
}

async function bytesFromResponse(res: Response, key: string): Promise<Buffer | null> {
    const type = res.headers.get('content-type') || '';
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text.slice(0, 180) || `Pollinations HTTP ${res.status}`);
    }
    if (type.includes('video') || type.includes('octet-stream') || type.includes('mp4')) {
        return Buffer.from(await res.arrayBuffer());
    }
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const url = nestedUrl(data);
    if (!url) return null;
    const file = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
    if (!file.ok) throw new Error(`A videó letöltése nem sikerült (${file.status}).`);
    return Buffer.from(await file.arrayBuffer());
}

async function startJob(prompt: string, key: string): Promise<{ jobId?: string; video?: Buffer }> {
    const res = await fetch(pollinationsVideoUrl(prompt, videoModel()), {
        headers: {
            Authorization: `Bearer ${key}`,
            Prefer: 'respond-async',
            Accept: 'application/json, video/mp4',
        },
    });
    const type = res.headers.get('content-type') || '';
    if (!res.ok && res.status !== 202) {
        const text = await res.text();
        throw new Error(text.slice(0, 180) || `Pollinations HTTP ${res.status}`);
    }
    if (type.includes('video') || type.includes('octet-stream')) {
        return { video: Buffer.from(await res.arrayBuffer()) };
    }
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const direct = await bytesFromResponse(
        new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } }),
        key
    ).catch(() => null);
    if (direct) return { video: direct };
    const jobId = String(data.id || data.job_id || '');
    if (!jobId) throw new Error('A Pollinations nem adott feladat-azonosítót.');
    return { jobId };
}

async function pollJob(jobId: string, key: string): Promise<{ phase: 'pending' | 'done' | 'failed'; video?: Buffer; error?: string }> {
    const statusRes = await fetch(`https://gen.pollinations.ai/v1/jobs/${encodeURIComponent(jobId)}`, {
        headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
    });
    if (!statusRes.ok) {
        const text = await statusRes.text();
        throw new Error(text.slice(0, 180) || `Pollinations HTTP ${statusRes.status}`);
    }
    const data = (await statusRes.json()) as Record<string, unknown>;
    const phase = jobPhase(data);
    if (phase === 'failed') return { phase, error: String(data.error || 'A videó készítése nem sikerült.') };
    if (phase === 'pending') return { phase };
    const result = await fetch(`https://gen.pollinations.ai/v1/jobs/${encodeURIComponent(jobId)}/result`, {
        headers: { Authorization: `Bearer ${key}`, Accept: 'video/mp4, application/json' },
    });
    const video = await bytesFromResponse(result, key);
    if (!video) return { phase: 'pending' };
    return { phase: 'done', video };
}

async function releaseTopic(dayKey: string, key: string) {
    const db = requireDb();
    const ref = db.collection('mathShortDays').doc(dayKey);
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const topics = Array.isArray(snap.data()?.topics) ? snap.data()!.topics.map(String) : [];
        tx.set(ref, { topics: topics.filter((item) => item !== key) }, { merge: true });
    });
}

async function failShort(record: MathShortRecord, error: string) {
    const db = requireDb();
    await db.collection('mathShorts').doc(record.id).update({
        status: 'failed',
        error: error.slice(0, 240),
        updatedAtMs: Date.now(),
    });
    await releaseTopic(record.dayKey, record.topicKey);
}

async function finishShort(record: MathShortRecord, video: Buffer) {
    const url = await uploadVideo(record.id, video);
    const db = requireDb();
    await db.collection('mathShorts').doc(record.id).update({
        status: 'ready',
        videoUrl: url,
        error: null,
        updatedAtMs: Date.now(),
    });
}

async function promoteNext(): Promise<MathShortRecord | null> {
    const db = requireDb();
    const queued = await db.collection('mathShorts').where('status', '==', 'queued').get();
    const next = queued.docs
        .map((doc) => mapDoc(doc.id, doc.data()))
        .sort((a, b) => a.createdAtMs - b.createdAtMs)[0];
    if (!next) return null;
    await db.collection('mathShorts').doc(next.id).update({ status: 'running', updatedAtMs: Date.now() });
    return { ...next, status: 'running' };
}

async function advance(record: MathShortRecord, key: string) {
    if (record.updatedAtMs && Date.now() - record.updatedAtMs > STALE_MS && record.jobId) {
        await failShort(record, 'A videó készítése túl sokáig tartott.');
        return;
    }
    const db = requireDb();
    if (!record.jobId) {
        const started = await startJob(
            videoPromptFromScript(record),
            key
        );
        if (started.video) {
            await finishShort(record, started.video);
            return;
        }
        await db.collection('mathShorts').doc(record.id).update({
            jobId: started.jobId,
            updatedAtMs: Date.now(),
        });
        return;
    }
    const polled = await pollJob(record.jobId, key);
    if (polled.phase === 'pending') {
        await db.collection('mathShorts').doc(record.id).update({ updatedAtMs: Date.now() });
        return;
    }
    if (polled.phase === 'failed' || !polled.video) {
        await failShort(record, polled.error || 'A videó készítése nem sikerült.');
        return;
    }
    await finishShort(record, polled.video);
}

let chain: Promise<void> = Promise.resolve();

/** Egy lépés: a futó klipet viszi tovább, vagy a sor következőjét indítja. */
export function tickMathShorts(): Promise<void> {
    const run = chain.then(() => stepOnce());
    chain = run.catch(() => undefined);
    return run;
}

async function stepOnce() {
    const key = requireKey();
    const db = requireDb();
    const runningSnap = await db.collection('mathShorts').where('status', '==', 'running').get();
    const running = runningSnap.docs
        .map((doc) => mapDoc(doc.id, doc.data()))
        .sort((a, b) => a.createdAtMs - b.createdAtMs);
    for (const extra of running.slice(1)) {
        await db.collection('mathShorts').doc(extra.id).update({ status: 'queued', updatedAtMs: Date.now() });
    }
    const current = running[0] || (await promoteNext());
    if (!current) return;
    try {
        await advance(current, key);
    } catch (e) {
        await failShort(current, e instanceof Error ? e.message : 'A videó készítése nem sikerült.');
    }
}

export async function enqueueMathShort(topicRaw: string, authorId: string): Promise<MathShortRecord> {
    const db = requireDb();
    requireKey();
    const script = await composeMathShortScript(topicRaw, 'közepes');
    const dayKey = budapestDayKey();
    const key = topicKey(script.topic || topicRaw);
    const dayRef = db.collection('mathShortDays').doc(dayKey);
    const id = `ms_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();
    const record: MathShortRecord = {
        id,
        topic: script.topic || topicRaw,
        topicKey: key,
        dayKey,
        title: script.title,
        hook: script.hook,
        body: script.body,
        tip: script.tip,
        difficulty: script.difficulty,
        videoUrl: null,
        status: 'queued',
        authorId,
        createdAtMs: now,
        updatedAtMs: now,
        jobId: null,
        error: null,
    };

    await db.runTransaction(async (tx) => {
        const daySnap = await tx.get(dayRef);
        const topics = Array.isArray(daySnap.data()?.topics) ? daySnap.data()!.topics.map(String) : [];
        const decision = quotaDecision(topics, key);
        if (!decision.ok && decision.reason === 'duplicate') {
            throw new MathShortError('Ebből a témából ma már készül short.', 409);
        }
        if (!decision.ok) throw new MathShortError('Ma már megvan az 5 short.', 429);
        tx.set(dayRef, { topics: [...topics, key] }, { merge: true });
        tx.set(db.collection('mathShorts').doc(id), record);
    });

    await tickMathShorts();
    return record;
}

export async function mathShortAdminState(): Promise<{
    dayKey: string;
    used: number;
    limit: number;
    shorts: MathShortRecord[];
}> {
    const db = requireDb();
    const dayKey = budapestDayKey();
    const day = await db.collection('mathShortDays').doc(dayKey).get();
    const used = Array.isArray(day.data()?.topics) ? day.data()!.topics.length : 0;
    const snap = await db.collection('mathShorts').orderBy('createdAtMs', 'desc').limit(40).get();
    return {
        dayKey,
        used,
        limit: DAILY_SHORT_LIMIT,
        shorts: snap.docs.map((doc) => mapDoc(doc.id, doc.data())),
    };
}

export async function listReadyMathShorts(limit = 30): Promise<MathShortRecord[]> {
    const db = requireDb();
    const snap = await db.collection('mathShorts').where('status', '==', 'ready').limit(limit).get();
    return snap.docs
        .map((doc) => mapDoc(doc.id, doc.data()))
        .filter((item) => item.videoUrl)
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
}
