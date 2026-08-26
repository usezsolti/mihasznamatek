/** Tanári konzol — diáklista, dosszié, órák, jegyzet. */

import {
    loadStudentAssignedTasks,
    type AssignedTaskDoc,
} from './assignedTasks';
import { getBudapestDateKeyOffset, type BookingPayload } from './bookingNotify';
import { fetchGameResultsForUser, type GameResultDoc } from './gameResultsClient';
import {
    elementaryTopics,
    erettsegiEmeltTopics,
    erettsegiKozepTopics,
    highschoolTopics,
    universitySubjects,
    type EducationLevelId,
} from './mathTopicsCatalog';
import {
    emptyProgress,
    loadRemotePracticeProgress,
    type TopicProgress,
    type UserPracticeProgress,
} from './practiceProgress';
import { PATH_LESSON_COUNT } from './topicPath';

export type TeacherStudent = {
    uid: string;
    name: string;
    email: string;
    educationLevel?: string;
    photoURL?: string;
    lastSeenMs?: number;
};

export type TeacherAdminMeta = {
    paymentStatus: 'unpaid' | 'transfer_pending' | 'paid' | '';
    paymentNote: string;
    attendanceStatus: 'unknown' | 'present' | 'absent' | 'excused';
    attendanceNote: string;
};

export type StudentProfileDetail = {
    photoURL: string;
    displayName: string;
    email: string;
    educationLevel: string;
    phone: string;
    username: string;
    bio: string;
    createdAtMs: number;
    lastLoginMs: number;
    updatedAtMs: number;
    followerCount: number;
    followingCount: number;
    postCount: number;
    socialXp: number;
    socialRank: string;
    /** Egyéb users-mezők (szövegesen), amit a profilban tárolunk. */
    extraFields: Array<{ key: string; value: string }>;
    bookings: BookingPayload[];
    teacherAdmin: TeacherAdminMeta;
    nextLesson: BookingPayload | null;
};

export const emptyTeacherAdminMeta = (): TeacherAdminMeta => ({
    paymentStatus: '',
    paymentNote: '',
    attendanceStatus: 'unknown',
    attendanceNote: '',
});

export type TopicSnapshot = {
    key: string;
    title: string;
    levelLabel: string;
    lessonsDone: number;
    lessonsTotal: number;
    avgStars: number | null;
    completed: boolean;
    weak: boolean;
    started: boolean;
    statusLabel: string;
};

export type MistakeSnapshot = {
    id: string;
    topic: string;
    wrong: number;
    total: number;
    correct: number;
    atMs: number;
    label: string;
};

export type StudentDossier = {
    student: TeacherStudent;
    profile: StudentProfileDetail;
    progress: UserPracticeProgress;
    topics: TopicSnapshot[];
    mistakes: MistakeSnapshot[];
    tasks: AssignedTaskDoc[];
    note: string;
    openTaskCount: number;
    weakTopicCount: number;
};

export type QuickTaskTemplate = {
    id: string;
    title: string;
    description: string;
    topicId: string;
    topicTitle: string;
    educationLevel: string;
    difficulty: string;
    questions: number;
    timeLimit: number;
};

const TOPIC_TITLE: Record<string, string> = {
    parameter: 'Paraméter',
    explog: 'Exp / logaritmus',
    absroot: 'Abszolútérték / gyök',
    bizonyitas: 'Bizonyítás',
    egyenletek: 'Egyenletek',
    fuggvenyek: 'Függvények',
    halmazok: 'Halmazok',
};

function getFirebase(): any | null {
    if (typeof window === 'undefined') return null;
    return (window as any).firebase || null;
}

function catalogTitle(id: string): string {
    const all = [
        ...elementaryTopics,
        ...highschoolTopics,
        ...erettsegiKozepTopics,
        ...erettsegiEmeltTopics,
        ...universitySubjects.flatMap((s) => s.topics),
    ];
    const hit = all.find((t) => t.id === id || t.id === id.replace(/-emelt$/, ''));
    return hit?.title || TOPIC_TITLE[id] || id;
}

function levelLabelForTopicKey(key: string): string {
    if (elementaryTopics.some((t) => t.id === key)) return 'Ált. iskola';
    if (highschoolTopics.some((t) => t.id === key)) return 'Középiskola';
    if (erettsegiKozepTopics.some((t) => t.id === key)) return 'Érettségi · közép';
    if (erettsegiEmeltTopics.some((t) => t.id === key)) return 'Érettségi · emelt';
    for (const s of universitySubjects) {
        if (s.topics.some((t) => t.id === key) || s.id === key) return `Egyetem · ${s.title}`;
    }
    return 'Téma';
}

function catalogKeysForStudentLevel(
    educationLevel?: string
): Array<{ id: string; title: string; levelLabel: string }> {
    const level = (educationLevel || '') as EducationLevelId;
    const out: Array<{ id: string; title: string; levelLabel: string }> = [];
    const pushTopics = (
        topics: Array<{ id: string; title: string }>,
        levelLabel: string
    ) => {
        for (const t of topics) out.push({ id: t.id, title: t.title, levelLabel });
    };

    if (level === 'elementary') pushTopics(elementaryTopics, 'Ált. iskola');
    else if (level === 'highschool') pushTopics(highschoolTopics, 'Középiskola');
    else if (level === 'erettsegi') {
        pushTopics(erettsegiKozepTopics, 'Érettségi · közép');
        pushTopics(erettsegiEmeltTopics, 'Érettségi · emelt');
    } else if (level === 'university') {
        for (const s of universitySubjects) pushTopics(s.topics, `Egyetem · ${s.title}`);
    } else {
        pushTopics(elementaryTopics, 'Ált. iskola');
        pushTopics(highschoolTopics, 'Középiskola');
        pushTopics(erettsegiKozepTopics, 'Érettségi · közép');
        pushTopics(erettsegiEmeltTopics, 'Érettségi · emelt');
        for (const s of universitySubjects) pushTopics(s.topics, `Egyetem · ${s.title}`);
    }
    return out;
}

function snapshotFromProgress(
    key: string,
    title: string,
    levelLabel: string,
    tp?: TopicProgress
): TopicSnapshot {
    const lessonsDone = Array.isArray(tp?.lessonsCompleted) ? tp!.lessonsCompleted.length : 0;
    const stars = Object.values(tp?.lessonStars || {});
    const avgStars =
        stars.length > 0 ? stars.reduce((a, b) => a + Number(b), 0) / stars.length : null;
    const completed = Boolean(tp?.completed) || lessonsDone >= PATH_LESSON_COUNT;
    const started = lessonsDone > 0 || Boolean(tp?.completed) || stars.length > 0;
    const weak =
        (avgStars !== null && avgStars < 2.2) ||
        (lessonsDone > 0 && lessonsDone < PATH_LESSON_COUNT && (avgStars || 3) <= 2);
    let statusLabel = 'Még nem kezdte';
    if (completed) statusLabel = 'Kész';
    else if (weak) statusLabel = 'Gyenge — gyakoroltasd';
    else if (started) statusLabel = 'Folyamatban';
    return {
        key,
        title,
        levelLabel,
        lessonsDone,
        lessonsTotal: PATH_LESSON_COUNT,
        avgStars,
        completed,
        weak,
        started,
        statusLabel,
    };
}

function toMs(value: any): number {
    if (!value) return 0;
    if (typeof value?.toMillis === 'function') return value.toMillis();
    if (typeof value?.seconds === 'number') return value.seconds * 1000;
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
}

export async function loadTeacherStudents(): Promise<{
    students: TeacherStudent[];
    permissionDenied: boolean;
    setupHint?: string;
}> {
    const {
        clearAdminFirestoreDenied,
        isAdminFirestoreDenied,
        markAdminFirestoreDenied,
    } = await import('./adminFirestoreGate');

    // Rules már tiltott — ne spameljük a terminált / DevTools-t újrahívásokkal.
    if (isAdminFirestoreDenied()) {
        return {
            students: [],
            permissionDenied: true,
            setupHint:
                'Firestore rules tiltja a users olvasást. Publikáld: /rules-setup → Publish, majd Frissítés.',
        };
    }

    // Csak admin API — ne listázzuk a users kollekciót a kliensről (rules zaj).
    try {
        const { apiGetAuth, getIdToken } = await import('./apiClient');
        const token = await getIdToken();
        if (!token) {
            return {
                students: [],
                permissionDenied: false,
                setupHint: 'Nincs Firebase session — jelentkezz be újra (Tanári belépés).',
            };
        }

        const res = await apiGetAuth<{
            students?: TeacherStudent[];
            permissionDenied?: boolean;
            setupHint?: string;
        }>('/api/admin/teacher-bootstrap');
        if (res.ok) {
            const denied = Boolean(res.data?.permissionDenied);
            if (denied) markAdminFirestoreDenied();
            else clearAdminFirestoreDenied();
            return {
                students: Array.isArray(res.data?.students) ? res.data.students : [],
                permissionDenied: denied,
                setupHint: res.data?.setupHint,
            };
        }
        const status = Number((res as any).status || 0);
        if (
            status === 403 ||
            /rules|permission|jogosult|tilt|HTTP 403/i.test(String(res.error || ''))
        ) {
            markAdminFirestoreDenied();
            return {
                students: [],
                permissionDenied: true,
                setupHint:
                    String(res.error || '') ||
                    'Firestore rules / admin jogosultság. Publikáld: /rules-setup',
            };
        }
        return { students: [], permissionDenied: false, setupHint: String(res.error || '') };
    } catch (err: any) {
        return {
            students: [],
            permissionDenied: false,
            setupHint: String(err?.message || err).slice(0, 160),
        };
    }
}

function buildTopicSnapshots(
    progress: UserPracticeProgress,
    educationLevel?: string
): TopicSnapshot[] {
    const map = new Map<string, TopicSnapshot>();
    for (const cat of catalogKeysForStudentLevel(educationLevel)) {
        map.set(
            cat.id,
            snapshotFromProgress(cat.id, cat.title, cat.levelLabel, progress.topics?.[cat.id])
        );
    }
    for (const [key, tp] of Object.entries(progress.topics || {})) {
        if (map.has(key)) continue;
        map.set(
            key,
            snapshotFromProgress(
                key,
                catalogTitle(key),
                levelLabelForTopicKey(key),
                tp as TopicProgress
            )
        );
    }
    return Array.from(map.values()).sort(
        (a, b) =>
            Number(b.weak) - Number(a.weak) ||
            Number(b.started) - Number(a.started) ||
            a.levelLabel.localeCompare(b.levelLabel, 'hu') ||
            a.title.localeCompare(b.title, 'hu')
    );
}

function buildMistakes(results: GameResultDoc[]): MistakeSnapshot[] {
    return results
        .map((r) => {
            const total = Number(r.total) || 0;
            const correct = Number(r.correct) || 0;
            const wrong = Math.max(0, total - correct);
            const topic = String(r.topicTitle || r.topic || r.topicId || 'Ismeretlen');
            return {
                id: String(r.id),
                topic,
                wrong,
                total,
                correct,
                atMs: toMs(r.completedAt || r.timestamp || r.createdAt),
                label: wrong > 0 ? `${wrong} hiba / ${total}` : `Hibátlan (${total})`,
            };
        })
        .filter((m) => m.wrong > 0 || m.total > 0)
        .sort((a, b) => b.atMs - a.atMs)
        .slice(0, 40);
}

function formatFieldValue(value: unknown): string | null {
    if (value == null || value === '') return null;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    if (typeof (value as any)?.toDate === 'function') {
        try {
            return (value as any).toDate().toLocaleString('hu-HU');
        } catch {
            return null;
        }
    }
    if (typeof (value as any)?.seconds === 'number') {
        return new Date((value as any).seconds * 1000).toLocaleString('hu-HU');
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return null;
        if (value.every((v) => typeof v === 'string' || typeof v === 'number')) {
            return value.join(', ');
        }
        return `${value.length} elem`;
    }
    return null;
}

const USER_DOC_SKIP = new Set([
    'name',
    'displayName',
    'email',
    'photoURL',
    'educationLevel',
    'phone',
    'phoneNumber',
    'createdAt',
    'lastLogin',
    'updatedAt',
    'assignedTasks',
    'password',
    'passwordHash',
    'teacherAdmin',
]);

function pickNextLesson(bookings: BookingPayload[]): BookingPayload | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = bookings
        .filter((b) => {
            const st = String(b.status || '');
            if (st && st !== 'approved' && st !== 'pending') return false;
            const d = new Date(`${b.date}T12:00:00`);
            return Number.isFinite(d.getTime()) && d.getTime() >= today.getTime() - 86400000;
        })
        .sort((a, b) => {
            const da = `${a.date} ${a.times?.[0] || ''}`;
            const db = `${b.date} ${b.times?.[0] || ''}`;
            return da.localeCompare(db);
        });
    return upcoming[0] || null;
}

function readTeacherAdmin(raw: unknown): TeacherAdminMeta {
    const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    const paymentStatus = String(o.paymentStatus || '');
    const attendanceStatus = String(o.attendanceStatus || 'unknown');
    return {
        paymentStatus:
            paymentStatus === 'unpaid' ||
            paymentStatus === 'transfer_pending' ||
            paymentStatus === 'paid'
                ? paymentStatus
                : '',
        paymentNote: String(o.paymentNote || '').slice(0, 500),
        attendanceStatus:
            attendanceStatus === 'present' ||
            attendanceStatus === 'absent' ||
            attendanceStatus === 'excused'
                ? attendanceStatus
                : 'unknown',
        attendanceNote: String(o.attendanceNote || '').slice(0, 500),
    };
}

export async function loadStudentProfileDetail(
    student: TeacherStudent
): Promise<StudentProfileDetail> {
    const empty: StudentProfileDetail = {
        photoURL: student.photoURL || '',
        displayName: student.name || '',
        email: student.email || '',
        educationLevel: student.educationLevel || '',
        phone: '',
        username: '',
        bio: '',
        createdAtMs: 0,
        lastLoginMs: 0,
        updatedAtMs: student.lastSeenMs || 0,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        socialXp: 0,
        socialRank: '',
        extraFields: [],
        bookings: [],
        teacherAdmin: emptyTeacherAdminMeta(),
        nextLesson: null,
    };

    const firebase = getFirebase();
    const db = firebase?.firestore?.();
    if (!db || !student.uid) return empty;

    let userData: Record<string, unknown> = {};
    let socialData: Record<string, unknown> = {};

    try {
        const snap = await db.collection('users').doc(student.uid).get();
        if (snap.exists) userData = snap.data() || {};
    } catch {
        /* rules / missing */
    }

    try {
        const snap = await db.collection('socialProfiles').doc(student.uid).get();
        if (snap.exists) socialData = snap.data() || {};
    } catch {
        /* ignore */
    }

    let bookings: BookingPayload[] = [];
    try {
        const { loadStudentBookingsFromFirestore } = await import('./bookingNotify');
        bookings = await loadStudentBookingsFromFirestore(student.email);
    } catch {
        bookings = [];
    }

    const extraFields: Array<{ key: string; value: string }> = [];
    for (const [key, value] of Object.entries(userData)) {
        if (USER_DOC_SKIP.has(key)) continue;
        if (key.toLowerCase().includes('token') || key.toLowerCase().includes('secret')) continue;
        const formatted = formatFieldValue(value);
        if (formatted) extraFields.push({ key, value: formatted.slice(0, 240) });
    }
    extraFields.sort((a, b) => a.key.localeCompare(b.key));

    const photoURL =
        String(userData.photoURL || socialData.photoURL || student.photoURL || '').trim();
    const displayName = String(
        userData.name ||
            userData.displayName ||
            socialData.displayName ||
            student.name ||
            ''
    ).trim();
    const email = String(userData.email || student.email || '').trim();

    return {
        photoURL,
        displayName,
        email,
        educationLevel: String(userData.educationLevel || student.educationLevel || '').trim(),
        phone: String(userData.phone || userData.phoneNumber || '').trim(),
        username: String(socialData.username || '').trim(),
        bio: String(socialData.bio || userData.bio || '').trim(),
        createdAtMs: toMs(userData.createdAt),
        lastLoginMs: toMs(userData.lastLogin),
        updatedAtMs: toMs(userData.updatedAt) || student.lastSeenMs || 0,
        followerCount: Number(socialData.followerCount) || 0,
        followingCount: Number(socialData.followingCount) || 0,
        postCount: Number(socialData.postCount) || 0,
        socialXp: Number(socialData.xp) || 0,
        socialRank: String(socialData.rank || '').trim(),
        extraFields,
        bookings,
        teacherAdmin: readTeacherAdmin(userData.teacherAdmin),
        nextLesson: pickNextLesson(bookings),
    };
}

export async function saveTeacherAdminMeta(
    studentId: string,
    meta: TeacherAdminMeta,
    teacherUid?: string
): Promise<{ ok: boolean; error?: string }> {
    const firebase = getFirebase();
    if (!firebase?.firestore || !studentId) return { ok: false, error: 'Nincs Firestore' };
    try {
        await firebase.firestore().collection('users').doc(studentId).set(
            {
                teacherAdmin: {
                    paymentStatus: meta.paymentStatus || '',
                    paymentNote: String(meta.paymentNote || '').slice(0, 500),
                    attendanceStatus: meta.attendanceStatus || 'unknown',
                    attendanceNote: String(meta.attendanceNote || '').slice(0, 500),
                    updatedBy: teacherUid || '',
                    updatedAtMs: Date.now(),
                },
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
        return { ok: true };
    } catch (err: any) {
        return { ok: false, error: String(err?.message || err).slice(0, 160) };
    }
}

export async function notifyStudentAssignedTask(params: {
    email: string;
    studentName: string;
    taskTitle: string;
    topicTitle?: string;
}): Promise<{ ok: boolean; error?: string }> {
    try {
        const { apiNotifyStudent } = await import('./apiClient');
        const res = await apiNotifyStudent({
            to: params.email,
            studentName: params.studentName,
            subject: `Új matekfeladat: ${params.taskTitle}`,
            message: [
                `Új feladatot kaptál: ${params.taskTitle}`,
                params.topicTitle ? `Témakör: ${params.topicTitle}` : '',
                '',
                'Jelentkezz be a Mihaszna Matek oldalra, és nyisd meg a kiosztott feladataidat.',
            ]
                .filter(Boolean)
                .join('\n'),
        });
        if (!res.ok) return { ok: false, error: res.error || 'Értesítés sikertelen' };
        return { ok: true };
    } catch (err: any) {
        return { ok: false, error: String(err?.message || err).slice(0, 120) };
    }
}

/** Élő óra lobby link küldése a diáknak e-mailben. */
export async function notifyStudentLessonLobby(params: {
    email: string;
    studentName: string;
    lobbyUrl: string;
    lessonTitle?: string;
}): Promise<{ ok: boolean; error?: string }> {
    const email = String(params.email || '')
        .trim()
        .toLowerCase();
    if (!email || !email.includes('@')) {
        return { ok: false, error: 'Nincs érvényes diák e-mail' };
    }
    try {
        const { apiNotifyStudent } = await import('./apiClient');
        const res = await apiNotifyStudent({
            to: email,
            studentName: params.studentName,
            subject: params.lessonTitle
                ? `Élő óra link – ${params.lessonTitle}`
                : 'Élő matekóra – csatlakozási link',
            message: [
                'Az óra lobbyja készen áll.',
                params.lessonTitle ? `Óra: ${params.lessonTitle}` : '',
                '',
                'Nyisd meg ezt a linket a böngészőben (Chrome / Edge ajánlott):',
                params.lobbyUrl,
                '',
                'Engedélyezd a kamerát és a mikrofont, ha a tanár kéri.',
                'A képernyőmegosztást a tanár indítja a hívásban.',
            ]
                .filter(Boolean)
                .join('\n'),
        });
        if (!res.ok) return { ok: false, error: res.error || 'Értesítés sikertelen' };
        return { ok: true };
    } catch (err: any) {
        return { ok: false, error: String(err?.message || err).slice(0, 120) };
    }
}

export async function loadStudentDossier(student: TeacherStudent): Promise<StudentDossier> {
    const [progress, gamePack, tasks, note, profile] = await Promise.all([
        loadRemotePracticeProgress(student.uid).catch(() => emptyProgress()),
        fetchGameResultsForUser(student.uid),
        loadStudentAssignedTasks(student.uid, student.email),
        loadTeacherNote(student.uid),
        loadStudentProfileDetail(student),
    ]);
    const topics = buildTopicSnapshots(
        progress,
        profile.educationLevel || student.educationLevel
    );
    const mistakes = buildMistakes(gamePack.results);
    const mergedStudent: TeacherStudent = {
        ...student,
        name: profile.displayName || student.name,
        email: profile.email || student.email,
        educationLevel: profile.educationLevel || student.educationLevel,
        photoURL: profile.photoURL || student.photoURL,
        lastSeenMs: profile.updatedAtMs || profile.lastLoginMs || student.lastSeenMs,
    };
    return {
        student: mergedStudent,
        profile,
        progress,
        topics,
        mistakes,
        tasks,
        note,
        openTaskCount: tasks.filter((t) => t.status !== 'completed').length,
        weakTopicCount: topics.filter((t) => t.weak).length,
    };
}

export async function loadTeacherNote(studentId: string): Promise<string> {
    const firebase = getFirebase();
    if (!firebase?.firestore || !studentId) return '';
    try {
        const snap = await firebase.firestore().collection('teacherNotes').doc(studentId).get();
        return String(snap.data()?.text || '');
    } catch {
        return '';
    }
}

export async function saveTeacherNote(
    studentId: string,
    text: string,
    teacherUid?: string
): Promise<{ ok: boolean; error?: string }> {
    const firebase = getFirebase();
    if (!firebase?.firestore || !studentId) return { ok: false, error: 'Nincs Firestore' };
    try {
        await firebase.firestore().collection('teacherNotes').doc(studentId).set(
            {
                text: text.slice(0, 8000),
                studentId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: teacherUid || '',
            },
            { merge: true }
        );
        return { ok: true };
    } catch (err: any) {
        return { ok: false, error: err?.message || 'Mentés sikertelen' };
    }
}

/** Mai (vagy offset) órák a naptárból — e-mail alapján diákhoz kötve. */
export async function loadLessonDayBookings(
    dayOffset = 0
): Promise<Array<BookingPayload & { dateKey: string }>> {
    const dateKey = getBudapestDateKeyOffset(dayOffset);
    const firebase = getFirebase();
    if (!firebase?.firestore) return [];
    const db = firebase.firestore();
    const map = new Map<string, BookingPayload & { dateKey: string }>();
    const merge = (snap: any) => {
        snap.forEach((doc: any) => {
            const data = doc.data() || {};
            const status = String(data.status || '');
            if (status !== 'approved' && status !== 'pending') return;
            if (String(data.date || '') !== dateKey) return;
            map.set(doc.id, { id: doc.id, ...data, dateKey });
        });
    };
    try {
        const byDate = await db.collection('bookings').where('date', '==', dateKey).get();
        merge(byDate);
    } catch (err) {
        console.warn('lesson day bookings failed:', err);
    }
    return Array.from(map.values()).sort((a, b) =>
        String(a.times?.[0] || '').localeCompare(String(b.times?.[0] || ''))
    );
}

export function findStudentForBooking(
    students: TeacherStudent[],
    booking: BookingPayload
): TeacherStudent | null {
    const email = String(booking.customerEmail || '').trim().toLowerCase();
    if (!email) return null;
    return (
        students.find((s) => s.email.toLowerCase() === email) ||
        students.find((s) => s.email.toLowerCase().split('+')[0] === email.split('+')[0]) ||
        null
    );
}

export async function loadQuickTaskTemplates(): Promise<QuickTaskTemplate[]> {
    const { loadExamTaskBank } = await import('./examTaskBank');
    const bank = await loadExamTaskBank();
    return bank.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        topicId: t.topic.toLowerCase().replace(/\s+/g, '-'),
        topicTitle: t.topic,
        educationLevel: t.educationLevel,
        difficulty: t.difficulty,
        questions: t.questions,
        timeLimit: t.timeLimit,
    }));
}
