import { getFirebase } from './booking/types';
import { agentDebugLog } from './agentDebugLog';
import { buildLessonPackPdfBlob } from './lessonPackPdf';
import type { LessonPackContent, LessonPackRecord } from './lessonPack';

export async function requestLessonPackFromApi(input: {
    topicTitle: string;
    topicId?: string;
    preparingFor?: string;
    preparingForLabel?: string;
    selectedSubject?: string;
    topicNote?: string;
}): Promise<{ content: LessonPackContent; summary: string; source: 'gemini' | 'fallback' }> {
    const res = await fetch('/api/lesson-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(input),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok || !json?.data?.content) {
        throw new Error(json?.error || 'Óraanyag készítése sikertelen');
    }
    return {
        content: json.data.content,
        summary: String(json.data.summary || ''),
        source: json.data.source === 'gemini' ? 'gemini' : 'fallback',
    };
}

function sanitizeFileName(name: string): string {
    return name.replace(/[^\w.\-()\u00C0-\u024F ]+/g, '_').slice(0, 80) || 'oraanyag';
}

export async function uploadLessonPackPdf(
    uid: string,
    packId: string,
    topicTitle: string,
    blob: Blob
): Promise<string | undefined> {
    const firebase = getFirebase();
    if (!firebase?.storage || !uid) return undefined;
    try {
        const safe = sanitizeFileName(topicTitle);
        const path = `lesson-packs/${uid}/${packId}_${safe}.pdf`;
        const ref = firebase.storage().ref(path);
        await ref.put(blob, { contentType: 'application/pdf' });
        return await ref.getDownloadURL();
    } catch (err) {
        console.warn('lesson pack storage upload failed', err);
        return undefined;
    }
}

export async function saveLessonPackToStudent(
    uid: string,
    pack: LessonPackRecord
): Promise<{ ok: boolean; pdfUrl?: string; error?: string }> {
    const firebase = getFirebase();
    if (!firebase?.firestore || !uid) {
        return { ok: false, error: 'Nincs bejelentkezett diák.' };
    }
    let pdfUrl = pack.pdfUrl;
    try {
        const blob = buildLessonPackPdfBlob(pack.content);
        pdfUrl = (await uploadLessonPackPdf(uid, pack.id, pack.topicTitle, blob)) || pdfUrl;
    } catch (err) {
        console.warn('lesson pack pdf build failed', err);
    }

    const record: LessonPackRecord = { ...pack, pdfUrl };
    try {
        await firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    lessonPacks: firebase.firestore.FieldValue.arrayUnion(record),
                    lastLessonPackId: pack.id,
                    lastLessonPackAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLessonTopic: pack.topicTitle,
                    lastLessonGoal: pack.preparingForLabel || pack.preparingFor || '',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H11',
            location: 'saveLessonPack.ts:ok',
            message: 'lesson pack saved on student',
            data: {
                hasPdfUrl: Boolean(pdfUrl),
                topicLen: pack.topicTitle.length,
                source: pack.source || null,
            },
            runId: 'lesson-pack',
        });
        // #endregion
        return { ok: true, pdfUrl };
    } catch (err: any) {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H11',
            location: 'saveLessonPack.ts:err',
            message: 'lesson pack save failed',
            data: { err: String(err?.message || err).slice(0, 120) },
            runId: 'lesson-pack',
        });
        // #endregion
        return { ok: false, error: err?.message || 'Profil mentés sikertelen' };
    }
}

export function readLessonPacks(data: any): LessonPackRecord[] {
    const raw = Array.isArray(data?.lessonPacks) ? data.lessonPacks : [];
    return raw.filter((p: any) => p && typeof p === 'object' && p.id && p.content);
}
