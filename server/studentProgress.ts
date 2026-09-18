import { getAdminDb } from './firebaseAdmin';
import { getDocument, listCollection, runQuery } from './firestoreRest';
import {
    emptyProgress,
    getRankTitle,
    parseProgressDoc,
    xpToRankLevel,
    type UserPracticeProgress,
} from '../utils/practiceProgress';
import {
    aggregateExamTopicGauges,
    parseTopicBreakdown,
    type ExamTopicGauge,
} from '../utils/examTopicStats';

export type GameSessionRow = {
    id: string;
    topic: string;
    topicId: string;
    gameMode: string;
    correct: number;
    total: number;
    score: number;
    xpEarned: number;
    atMs: number;
    paperId?: string;
    topicBreakdown?: Record<string, { title: string; correct: number; wrong: number }>;
};

export type StudentProgressPayload = {
    uid: string;
    progress: UserPracticeProgress;
    sessions: GameSessionRow[];
    xp: number;
    gameCount: number;
    lastPlayedMs: number;
    startedTopicCount: number;
    completedTopicCount: number;
    examTopicGauges: ExamTopicGauge[];
};

export function toMillis(value: unknown): number {
    if (value == null || value === '') return 0;
    const anyVal = value as {
        toMillis?: () => number;
        toDate?: () => Date;
        seconds?: number;
        _seconds?: number;
    };
    if (typeof anyVal.toMillis === 'function') return anyVal.toMillis();
    if (typeof anyVal.toDate === 'function') {
        const t = anyVal.toDate().getTime();
        return Number.isFinite(t) ? t : 0;
    }
    if (typeof anyVal.seconds === 'number') return anyVal.seconds * 1000;
    if (typeof anyVal._seconds === 'number') return anyVal._seconds * 1000;
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value < 1e12 ? value * 1000 : value;
    }
    const t = new Date(String(value)).getTime();
    return Number.isFinite(t) ? t : 0;
}

export function mapGameSession(id: string, data: Record<string, unknown>): GameSessionRow {
    const topicId = String(data.topicId || data.topic || '');
    const topic = String(data.topicTitle || data.topic || data.topicId || 'Játék');
    const xpRaw = data.xpEarned;
    const xpEarned =
        xpRaw != null && xpRaw !== '' ? Number(xpRaw) || 0 : Number(data.score) || 0;
    const paperId = String(data.paperId || '').trim();
    return {
        id,
        topic,
        topicId,
        gameMode: String(data.gameMode || data.educationLevel || ''),
        correct: Number(data.correct) || 0,
        total: Number(data.total) || 0,
        score: Number(data.score) || 0,
        xpEarned,
        atMs: toMillis(data.completedAt || data.timestamp || data.createdAt),
        paperId: paperId || undefined,
        topicBreakdown: parseTopicBreakdown(data.topicBreakdown),
    };
}

export function mergePracticeXp(summaryXp: number, sessions: GameSessionRow[]): number {
    const fromGames = sessions.reduce((sum, row) => sum + (row.xpEarned || 0), 0);
    return Math.max(Number(summaryXp) || 0, fromGames);
}

export function startedAndCompletedTopicCounts(progress: UserPracticeProgress): {
    started: number;
    completed: number;
} {
    const topics = Object.values(progress.topics || {});
    return {
        started: topics.filter(
            (t) =>
                Boolean(t.completed) ||
                (t.lessonsCompleted || []).length > 0 ||
                (t.bestCorrect || 0) > 0
        ).length,
        completed: topics.filter((t) => Boolean(t.completed)).length,
    };
}

function ownerUid(data: Record<string, unknown>): string {
    return String(data.userId || data.uid || '').trim();
}

type AdminDb = NonNullable<ReturnType<typeof getAdminDb>>;

function mergeSessionMaps(
    into: Map<string, GameSessionRow>,
    rows: GameSessionRow[]
): void {
    for (const row of rows) {
        if (!into.has(row.id)) into.set(row.id, row);
    }
}

async function queryGameResultsAdmin(
    db: AdminDb,
    field: 'userId' | 'uid',
    value: string
): Promise<GameSessionRow[]> {
    const snap = await db.collection('gameResults').where(field, '==', value).limit(200).get();
    return snap.docs.map((doc) => mapGameSession(doc.id, (doc.data() || {}) as Record<string, unknown>));
}

async function queryGameResultsToken(
    token: string,
    field: 'userId' | 'uid',
    value: string
): Promise<GameSessionRow[]> {
    const rows = await runQuery(token, {
        from: [{ collectionId: 'gameResults' }],
        where: {
            fieldFilter: {
                field: { fieldPath: field },
                op: 'EQUAL',
                value: { stringValue: value },
            },
        },
        limit: 200,
    });
    return rows.map((d) => mapGameSession(String(d.__id || ''), d));
}

async function loadSessionsForUid(
    uid: string,
    db: AdminDb | null,
    token: string
): Promise<GameSessionRow[]> {
    const byId = new Map<string, GameSessionRow>();
    if (db) {
        const [byUserId, byUid] = await Promise.all([
            queryGameResultsAdmin(db, 'userId', uid).catch(() => []),
            queryGameResultsAdmin(db, 'uid', uid).catch(() => []),
        ]);
        mergeSessionMaps(byId, byUserId);
        mergeSessionMaps(byId, byUid);
    } else if (token) {
        const [byUserId, byUid] = await Promise.all([
            queryGameResultsToken(token, 'userId', uid).catch(() => []),
            queryGameResultsToken(token, 'uid', uid).catch(() => []),
        ]);
        mergeSessionMaps(byId, byUserId);
        mergeSessionMaps(byId, byUid);
    }
    return Array.from(byId.values()).sort((a, b) => b.atMs - a.atMs);
}

function finalizePayload(uid: string, progress: UserPracticeProgress, sessions: GameSessionRow[]): StudentProgressPayload {
    const xp = mergePracticeXp(progress.xp || 0, sessions);
    const rankLevel = Math.max(progress.rankLevel || 1, xpToRankLevel(xp));
    const counts = startedAndCompletedTopicCounts(progress);
    return {
        uid,
        progress: {
            ...progress,
            xp,
            rankLevel,
            rank: getRankTitle(rankLevel),
        },
        sessions,
        xp,
        gameCount: sessions.length,
        lastPlayedMs: sessions[0]?.atMs || 0,
        startedTopicCount: counts.started,
        completedTopicCount: counts.completed,
        examTopicGauges: aggregateExamTopicGauges(sessions),
    };
}

export async function loadStudentProgress(opts: {
    uid: string;
    token?: string;
}): Promise<StudentProgressPayload> {
    const uid = String(opts.uid || '').trim();
    if (!uid) {
        return finalizePayload('', emptyProgress(), []);
    }
    const db = getAdminDb();
    const token = opts.token || '';

    let progress = emptyProgress();
    if (db) {
        const snap = await db.collection('users').doc(uid).collection('progress').doc('summary').get();
        if (snap.exists) progress = parseProgressDoc((snap.data() || {}) as Record<string, unknown>);
    } else if (token) {
        const doc = await getDocument(`users/${uid}/progress/summary`, token).catch(() => null);
        if (doc) progress = parseProgressDoc(doc);
    }

    const sessions = await loadSessionsForUid(uid, db, token);
    return finalizePayload(uid, progress, sessions);
}

export type StudentProgressSummary = {
    uid: string;
    xp: number;
    gameCount: number;
    lastPlayedMs: number;
    startedTopicCount: number;
    completedTopicCount: number;
};

function foldName(s: string): string {
    return String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function namesLikelySame(a: string, b: string): boolean {
    const ta = foldName(a).split(' ').filter(Boolean).sort();
    const tb = foldName(b).split(' ').filter(Boolean).sort();
    if (!ta.length || !tb.length) return false;
    if (ta.join(' ') === tb.join(' ')) return true;
    const [small, large] = ta.length <= tb.length ? [ta, new Set(tb)] : [tb, new Set(ta)];
    return small.every((t) => large.has(t));
}

export async function loadStudentProgressSummaries(opts: {
    students: Array<{ uid: string; name?: string; email?: string }>;
    token?: string;
}): Promise<Record<string, StudentProgressSummary>> {
    const out: Record<string, StudentProgressSummary> = {};
    const students = opts.students.filter((s) => s.uid);
    for (const s of students) {
        out[s.uid] = {
            uid: s.uid,
            xp: 0,
            gameCount: 0,
            lastPlayedMs: 0,
            startedTopicCount: 0,
            completedTopicCount: 0,
        };
    }
    if (students.length === 0) return out;

    const db = getAdminDb();
    const token = opts.token || '';

    if (db) {
        const refs = students.map((s) =>
            db.collection('users').doc(s.uid).collection('progress').doc('summary')
        );
        for (let i = 0; i < refs.length; i += 100) {
            const snaps = await db.getAll(...refs.slice(i, i + 100));
            snaps.forEach((snap, idx) => {
                const student = students[i + idx];
                if (!student || !snap.exists) return;
                const progress = parseProgressDoc((snap.data() || {}) as Record<string, unknown>);
                const counts = startedAndCompletedTopicCounts(progress);
                out[student.uid] = {
                    ...out[student.uid],
                    xp: progress.xp || 0,
                    startedTopicCount: counts.started,
                    completedTopicCount: counts.completed,
                };
            });
        }

        const resultsSnap = await db.collection('gameResults').limit(4000).get();
        const byOwner = new Map<string, GameSessionRow[]>();
        resultsSnap.forEach((doc) => {
            const data = (doc.data() || {}) as Record<string, unknown>;
            const owner = ownerUid(data);
            if (!owner) return;
            const list = byOwner.get(owner) || [];
            list.push(mapGameSession(doc.id, data));
            byOwner.set(owner, list);
        });

        const known = new Set(students.map((s) => s.uid));
        const byEmail = new Map<string, string>();
        for (const s of students) {
            if (s.email) byEmail.set(s.email.trim().toLowerCase(), s.uid);
        }

        const matchStudentUid = (email: string, name: string): string => {
            if (email && byEmail.get(email)) return byEmail.get(email) || '';
            const hit = students.find((s) => namesLikelySame(s.name || '', name));
            return hit?.uid || '';
        };

        const sessionsByStudent = new Map<string, GameSessionRow[]>();
        const addToStudent = (target: string, sessions: GameSessionRow[]) => {
            const cur = sessionsByStudent.get(target) || [];
            const seen = new Set(cur.map((row) => row.id));
            for (const row of sessions) {
                if (!seen.has(row.id)) cur.push(row);
            }
            sessionsByStudent.set(target, cur);
        };

        for (const [owner, sessions] of byOwner) {
            let target = known.has(owner) ? owner : '';
            if (!target) {
                try {
                    const userSnap = await db.collection('users').doc(owner).get();
                    const d = (userSnap.data() || {}) as Record<string, unknown>;
                    const email = String(d.email || '')
                        .trim()
                        .toLowerCase();
                    target = matchStudentUid(email, String(d.name || d.displayName || ''));
                } catch {
                    target = '';
                }
            }
            if (!target || !out[target]) continue;
            addToStudent(target, sessions);
        }

        for (const [uid, sessions] of sessionsByStudent) {
            const sorted = sessions.sort((a, b) => b.atMs - a.atMs);
            out[uid] = {
                ...out[uid],
                xp: mergePracticeXp(out[uid].xp, sorted),
                gameCount: sorted.length,
                lastPlayedMs: sorted[0]?.atMs || 0,
            };
        }
        return out;
    }

    if (!token) return out;
    try {
        const docs = await listCollection('gameResults', token, { pageSize: 2000 });
        const byOwner = new Map<string, GameSessionRow[]>();
        for (const d of docs) {
            const owner = ownerUid(d);
            if (!owner) continue;
            const list = byOwner.get(owner) || [];
            list.push(mapGameSession(String(d.__id || ''), d));
            byOwner.set(owner, list);
        }
        const known = new Set(students.map((s) => s.uid));
        const byEmail = new Map<string, string>();
        for (const s of students) {
            if (s.email) byEmail.set(s.email.trim().toLowerCase(), s.uid);
        }
        const sessionsByStudent = new Map<string, GameSessionRow[]>();
        const addToStudent = (target: string, sessions: GameSessionRow[]) => {
            const cur = sessionsByStudent.get(target) || [];
            const seen = new Set(cur.map((row) => row.id));
            for (const row of sessions) {
                if (!seen.has(row.id)) cur.push(row);
            }
            sessionsByStudent.set(target, cur);
        };
        for (const [owner, sessions] of byOwner) {
            let target = known.has(owner) ? owner : '';
            if (!target) {
                try {
                    const user = await getDocument(`users/${owner}`, token);
                    const email = String(user?.email || '')
                        .trim()
                        .toLowerCase();
                    const name = String(user?.name || user?.displayName || '');
                    if (email) {
                        const hit = byEmail.get(email);
                        if (hit) target = hit;
                    }
                    if (!target) {
                        const hit = students.find((s) => namesLikelySame(s.name || '', name));
                        target = hit?.uid || '';
                    }
                } catch {
                    target = '';
                }
            }
            if (!target || !out[target]) continue;
            addToStudent(target, sessions);
        }
        for (const [uid, sessions] of sessionsByStudent) {
            const sorted = sessions.sort((a, b) => b.atMs - a.atMs);
            out[uid] = {
                ...out[uid],
                xp: mergePracticeXp(out[uid].xp, sorted),
                gameCount: sorted.length,
                lastPlayedMs: sorted[0]?.atMs || 0,
            };
        }
        await Promise.all(
            students.slice(0, 80).map(async (s) => {
                try {
                    const doc = await getDocument(`users/${s.uid}/progress/summary`, token);
                    if (!doc) return;
                    const progress = parseProgressDoc(doc);
                    const counts = startedAndCompletedTopicCounts(progress);
                    out[s.uid] = {
                        ...out[s.uid],
                        xp: Math.max(progress.xp || 0, out[s.uid].xp),
                        startedTopicCount: counts.started,
                        completedTopicCount: counts.completed,
                    };
                } catch {
                    /* keep game XP */
                }
            })
        );
        return out;
    } catch {
        await Promise.all(
            students.map(async (s) => {
                try {
                    const payload = await loadStudentProgress({ uid: s.uid, token });
                    out[s.uid] = {
                        uid: s.uid,
                        xp: payload.xp,
                        gameCount: payload.gameCount,
                        lastPlayedMs: payload.lastPlayedMs,
                        startedTopicCount: payload.startedTopicCount,
                        completedTopicCount: payload.completedTopicCount,
                    };
                } catch {
                    /* keep zeros */
                }
            })
        );
        return out;
    }
}
