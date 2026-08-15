import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import AdminHomeInbox from './AdminHomeInbox';
import { assignTaskToStudent, gameUrlForAssignedTask } from '../utils/assignedTasks';
import type { BookingPayload } from '../utils/bookingNotify';
import {
    customQuestionsToText,
    deleteCustomExamTask,
    isCatalogBaseTask,
    isOwnCustomTask,
    loadExamTaskBank,
    parseCustomQuestionsText,
    saveCustomExamTask,
    type ExamTaskBankItem,
} from '../utils/examTaskBank';
import {
    createLessonRoom,
    lessonJoinPath,
} from '../utils/lessonRoom';
import { EDUCATION_LEVELS } from '../utils/mathTopicsCatalog';
import { BADGE_DEFS, getRankEmoji } from '../utils/practiceProgress';
import {
    emptyTeacherAdminMeta,
    findStudentForBooking,
    loadLessonDayBookings,
    loadStudentDossier,
    loadTeacherStudents,
    notifyStudentAssignedTask,
    notifyStudentLessonLobby,
    saveTeacherAdminMeta,
    saveTeacherNote,
    type StudentDossier,
    type TeacherAdminMeta,
    type TeacherStudent,
} from '../utils/teacherConsole';

type ConsoleTab = 'students' | 'tasks' | 'lessons' | 'schedule';
type LevelFilter = 'all' | 'elementary' | 'highschool' | 'erettsegi' | 'university';

type ScheduleLobbyApi = {
    createLobbyFromBooking: (booking: BookingPayload) => Promise<void>;
    lobbyBusy: boolean;
    lastLessonLink: string;
    lessonStartMsg: string;
};

type Props = {
    adminUid?: string;
    adminEmail?: string;
    initialTab?: ConsoleTab;
    schedulePanel: ReactNode | ((api: ScheduleLobbyApi) => ReactNode);
};

function formatWhen(ms: number): string {
    if (!ms) return '—';
    return new Date(ms).toLocaleString('hu-HU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const LEVEL_LABEL: Record<string, string> = {
    elementary: 'Ált. iskola',
    highschool: 'Középiskola',
    erettsegi: 'Érettségi',
    university: 'Egyetem',
};

function educationLabel(id?: string): string {
    if (!id) return '—';
    const hit = EDUCATION_LEVELS.find((l) => l.id === id);
    return hit?.name || LEVEL_LABEL[id] || id;
}

function initials(name: string, email: string): string {
    const src = (name || email || '?').trim();
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return src.slice(0, 2).toUpperCase();
}

export default function AdminTeacherConsole({
    adminUid,
    adminEmail,
    initialTab = 'schedule',
    schedulePanel,
}: Props) {
    const [tab, setTab] = useState<ConsoleTab>(initialTab);
    const [students, setStudents] = useState<TeacherStudent[]>([]);
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [dossier, setDossier] = useState<StudentDossier | null>(null);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingDossier, setLoadingDossier] = useState(false);
    const [noteDraft, setNoteDraft] = useState('');
    const [noteSaving, setNoteSaving] = useState(false);
    const [noteMsg, setNoteMsg] = useState('');

    const [taskBank, setTaskBank] = useState<ExamTaskBankItem[]>([]);
    const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
    const [selectedTopicKeys, setSelectedTopicKeys] = useState<string[]>([]);
    const [activeTopicKey, setActiveTopicKey] = useState<string | null>(null);
    const [ownTitle, setOwnTitle] = useState('');
    const [ownDescription, setOwnDescription] = useState('');
    const [ownQuestionsText, setOwnQuestionsText] = useState('');
    const [ownDifficulty, setOwnDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [ownTimeLimit, setOwnTimeLimit] = useState(30);
    const [ownBusy, setOwnBusy] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [notifyOnAssign, setNotifyOnAssign] = useState(true);
    const [adminMeta, setAdminMeta] = useState<TeacherAdminMeta>(emptyTeacherAdminMeta());
    const [adminMetaBusy, setAdminMetaBusy] = useState(false);
    const [adminMetaMsg, setAdminMetaMsg] = useState('');
    const [assignBusy, setAssignBusy] = useState(false);
    const [assignMsg, setAssignMsg] = useState('');

    const [lessons, setLessons] = useState<Array<BookingPayload & { dateKey: string }>>([]);
    const [lessonDay, setLessonDay] = useState<0 | 1>(0);
    const [loadingLessons, setLoadingLessons] = useState(false);
    const [lessonStartBusy, setLessonStartBusy] = useState(false);
    const [lessonStartMsg, setLessonStartMsg] = useState('');
    const [lastLessonLink, setLastLessonLink] = useState('');

    useEffect(() => {
        setTab(initialTab);
    }, [initialTab]);

    const loadStudents = useCallback(async (forceRetry = false) => {
        setLoadingList(true);
        try {
            if (forceRetry) {
                const { clearAdminFirestoreDenied } = await import('../utils/adminFirestoreGate');
                clearAdminFirestoreDenied();
            }
            const { students: list } = await loadTeacherStudents();
            setStudents(list);
            setSelectedId((prev) => prev || list[0]?.uid || null);
        } catch {
            setStudents([]);
        } finally {
            setLoadingList(false);
        }
    }, []);

    const refreshStudents = useCallback(() => loadStudents(true), [loadStudents]);

    useEffect(() => {
        void loadStudents(false);
        void loadExamTaskBank().then(setTaskBank);
    }, [loadStudents]);

    useEffect(() => {
        if (!selectedId) {
            setDossier(null);
            return;
        }
        const student = students.find((s) => s.uid === selectedId);
        if (!student) return;
        let cancelled = false;
        setLoadingDossier(true);
        void loadStudentDossier(student)
            .then((d) => {
                if (cancelled) return;
                setDossier(d);
                setNoteDraft(d.note);
                setAdminMeta(d.profile.teacherAdmin || emptyTeacherAdminMeta());
                setAdminMetaMsg('');
                setAssignMsg('');
                setNoteMsg('');
                setSelectedTopicKeys([]);
            })
            .finally(() => {
                if (!cancelled) setLoadingDossier(false);
            });
        return () => {
            cancelled = true;
        };
    }, [selectedId, students]);

    useEffect(() => {
        if (tab !== 'lessons') return;
        let cancelled = false;
        setLoadingLessons(true);
        void loadLessonDayBookings(lessonDay)
            .then((list) => {
                if (!cancelled) setLessons(list);
            })
            .finally(() => {
                if (!cancelled) setLoadingLessons(false);
            });
        return () => {
            cancelled = true;
        };
    }, [tab, lessonDay]);

    const filteredStudents = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return students;
        return students.filter(
            (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
        );
    }, [students, query]);

    const filteredTasks = useMemo(() => {
        if (levelFilter === 'all') return taskBank;
        return taskBank.filter((t) => t.educationLevel === levelFilter);
    }, [taskBank, levelFilter]);

    const topicBrowseList = useMemo(() => {
        const map = new Map<
            string,
            {
                key: string;
                title: string;
                educationLevel: string;
                erettsegiLevel?: string;
                baseCount: number;
                ownCount: number;
            }
        >();
        for (const t of filteredTasks) {
            const key =
                t.topicId ||
                t.topic.toLowerCase().replace(/\s+/g, '-') ||
                t.id;
            const cur = map.get(key) || {
                key,
                title: t.topic || t.title,
                educationLevel: t.educationLevel,
                erettsegiLevel: t.erettsegiLevel,
                baseCount: 0,
                ownCount: 0,
            };
            if (isOwnCustomTask(t)) cur.ownCount += 1;
            else cur.baseCount += 1;
            if (!cur.title && t.title) cur.title = t.title;
            map.set(key, cur);
        }
        return Array.from(map.values()).sort((a, b) =>
            a.title.localeCompare(b.title, 'hu')
        );
    }, [filteredTasks]);

    const activeTopicMeta = useMemo(() => {
        if (!activeTopicKey) return null;
        return topicBrowseList.find((t) => t.key === activeTopicKey) || null;
    }, [activeTopicKey, topicBrowseList]);

    const topicTasks = useMemo(() => {
        if (!activeTopicKey) return { base: [] as ExamTaskBankItem[], own: [] as ExamTaskBankItem[] };
        const list = filteredTasks.filter((t) => {
            const key = t.topicId || t.topic.toLowerCase().replace(/\s+/g, '-') || t.id;
            return key === activeTopicKey;
        });
        return {
            base: list.filter((t) => !isOwnCustomTask(t)),
            own: list.filter((t) => isOwnCustomTask(t)),
        };
    }, [filteredTasks, activeTopicKey]);

    const selectedStudent = students.find((s) => s.uid === selectedId) || null;
    const selectedTasks = useMemo(
        () => taskBank.filter((t) => selectedTaskIds.includes(t.id)),
        [taskBank, selectedTaskIds]
    );

    const toggleTaskId = (id: string) => {
        setSelectedTaskIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleTopicKey = (key: string) => {
        setSelectedTopicKeys((prev) =>
            prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
        );
    };

    const taskIdForTopicKey = (key: string): string | null => {
        const match = taskBank.find(
            (task) =>
                task.topicId === key ||
                task.topic.toLowerCase().replace(/\s+/g, '-') === key
        );
        return match?.id || null;
    };

    const openStudent = (uid: string, nextTab: ConsoleTab = 'students') => {
        setSelectedId(uid);
        setTab(nextTab);
    };

    const saveNote = async () => {
        if (!selectedId) return;
        setNoteSaving(true);
        setNoteMsg('');
        const res = await saveTeacherNote(selectedId, noteDraft, adminUid);
        setNoteSaving(false);
        setNoteMsg(res.ok ? 'Mentve.' : res.error || 'Mentés sikertelen');
    };

    const runAssign = async (alsoOpenGame: boolean, tasksOverride?: ExamTaskBankItem[]) => {
        const tasksToAssign = tasksOverride || selectedTasks;
        if (!selectedStudent || tasksToAssign.length === 0) {
            setAssignMsg('Válassz diákot és legalább egy témát / feladatot.');
            return;
        }
        setAssignBusy(true);
        setAssignMsg('');
        let okCount = 0;
        let lastError = '';
        for (const task of tasksToAssign) {
            const res = await assignTaskToStudent({
                taskId: task.id,
                title: task.title,
                description: task.description,
                topicId: task.topicId || task.topic.toLowerCase().replace(/\s+/g, '-'),
                topicTitle: task.topic,
                educationLevel: task.educationLevel,
                difficulty: task.difficulty,
                questions: task.questions,
                timeLimit: task.timeLimit,
                customQuestions: task.customQuestions || [],
                studentId: selectedStudent.uid,
                studentEmail: selectedStudent.email,
                studentName: selectedStudent.name,
                createdBy: adminUid || adminEmail || '',
            });
            if (res.ok) okCount += 1;
            else lastError = res.error || 'Kiosztás sikertelen';
        }
        setAssignBusy(false);
        if (okCount === 0) {
            setAssignMsg(lastError || 'Kiosztás sikertelen');
            return;
        }
        setAssignMsg(
            okCount === 1
                ? `Kiosztva: ${tasksToAssign[0].title} → ${selectedStudent.name}`
                : `Kiosztva: ${okCount} feladat → ${selectedStudent.name}`
        );
        if (notifyOnAssign && selectedStudent.email && okCount > 0) {
            const titles = tasksToAssign.slice(0, okCount).map((t) => t.title).join(', ');
            const mailed = await notifyStudentAssignedTask({
                email: selectedStudent.email,
                studentName: selectedStudent.name,
                taskTitle: titles,
                topicTitle: tasksToAssign[0]?.topic,
            });
            setAssignMsg((prev) =>
                mailed.ok ? `${prev} · diák értesítve` : `${prev} · Értesítés: ${mailed.error || 'hiba'}`
            );
        }
        setSelectedTaskIds([]);
        setSelectedTopicKeys([]);
        if (dossier?.student.uid === selectedStudent.uid) {
            const refreshed = await loadStudentDossier(selectedStudent);
            setDossier(refreshed);
        }
        if (alsoOpenGame && tasksToAssign[0]) {
            const task = tasksToAssign[0];
            window.location.href = gameUrlForAssignedTask({
                id: '',
                taskId: task.id,
                title: task.title,
                educationLevel: task.educationLevel,
                topicId: task.topicId || task.topic.toLowerCase().replace(/\s+/g, '-'),
                studentId: selectedStudent.uid,
                studentName: selectedStudent.name,
            });
        }
    };

    const assignSelectedTopicsFromDossier = async () => {
        if (!selectedStudent || selectedTopicKeys.length === 0) {
            setAssignMsg('Jelölj ki legalább egy témakört.');
            return;
        }
        const tasks: ExamTaskBankItem[] = [];
        const missing: string[] = [];
        for (const key of selectedTopicKeys) {
            const id = taskIdForTopicKey(key);
            const task = id ? taskBank.find((t) => t.id === id) : null;
            if (task) tasks.push(task);
            else {
                const title =
                    dossier?.topics.find((t) => t.key === key)?.title || key;
                missing.push(title);
            }
        }
        if (tasks.length === 0) {
            setAssignMsg(
                `Nincs kiosztható feladat ezekhez: ${missing.slice(0, 3).join(', ')}`
            );
            return;
        }
        await runAssign(false, tasks);
        if (missing.length) {
            setAssignMsg((prev) =>
                `${prev} · Hiányzik bankból: ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? '…' : ''}`
            );
        }
    };

    const enterTopic = (key: string, titleHint?: string) => {
        setActiveTopicKey(key);
        setOwnTitle(titleHint ? `${titleHint} — saját feladat` : 'Saját feladat');
        setOwnDescription('');
        setOwnQuestionsText('');
        setOwnDifficulty('medium');
        setOwnTimeLimit(30);
        setAssignMsg('');
        setTab('tasks');
    };

    const saveOwnTask = async (alsoAssign: boolean) => {
        if (!activeTopicKey || !activeTopicMeta) {
            setAssignMsg('Előbb lépj be egy témakörbe.');
            return;
        }
        const questions = parseCustomQuestionsText(ownQuestionsText);
        if (!ownTitle.trim()) {
            setAssignMsg('Adj címet a saját feladatnak.');
            return;
        }
        if (questions.length === 0) {
            setAssignMsg('Írj legalább egy kérdést (soronként). Válasz opcionális: kérdés || 12');
            return;
        }
        setOwnBusy(true);
        setAssignMsg('');
        const wasEditing = Boolean(editingTaskId);
        const id = editingTaskId || `custom-${activeTopicKey}-${Date.now()}`;
        const task: ExamTaskBankItem = {
            id,
            title: ownTitle.trim(),
            description: ownDescription.trim() || `Saját feladat · ${activeTopicMeta.title}`,
            difficulty: ownDifficulty,
            topic: activeTopicMeta.title,
            topicId: activeTopicKey,
            educationLevel: (activeTopicMeta.educationLevel as ExamTaskBankItem['educationLevel']) || 'highschool',
            erettsegiLevel:
                activeTopicMeta.erettsegiLevel === 'kozep' || activeTopicMeta.erettsegiLevel === 'emelt'
                    ? activeTopicMeta.erettsegiLevel
                    : undefined,
            questions: questions.length,
            timeLimit: ownTimeLimit,
            customQuestions: questions,
        };
        const saved = await saveCustomExamTask(task);
        setOwnBusy(false);
        if (!saved.ok) {
            setAssignMsg(saved.error || 'Mentés sikertelen');
            return;
        }
        const bank = await loadExamTaskBank();
        setTaskBank(bank);
        setSelectedTaskIds([id]);
        setEditingTaskId(null);
        setAssignMsg(
            wasEditing ? `Saját feladat frissítve: ${task.title}` : `Saját feladat mentve: ${task.title}`
        );
        if (alsoAssign) {
            if (!selectedStudent) {
                setAssignMsg(`Mentve. Válassz diákot a kiosztáshoz.`);
                return;
            }
            await runAssign(false, [task]);
        }
    };

    const startEditOwnTask = (task: ExamTaskBankItem) => {
        setEditingTaskId(task.id);
        setOwnTitle(task.title);
        setOwnDescription(task.description || '');
        setOwnQuestionsText(customQuestionsToText(task.customQuestions));
        setOwnDifficulty(task.difficulty || 'medium');
        setOwnTimeLimit(task.timeLimit || 30);
        setAssignMsg(`Szerkesztés: ${task.title}`);
    };

    const removeOwnTask = async (taskId: string) => {
        if (!window.confirm('Törlöd ezt a saját feladatot?')) return;
        const res = await deleteCustomExamTask(taskId);
        if (!res.ok) {
            setAssignMsg(res.error || 'Törlés sikertelen');
            return;
        }
        if (editingTaskId === taskId) setEditingTaskId(null);
        setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
        const bank = await loadExamTaskBank();
        setTaskBank(bank);
        setAssignMsg('Saját feladat törölve.');
    };

    const saveAdminMeta = async () => {
        if (!selectedId) return;
        setAdminMetaBusy(true);
        setAdminMetaMsg('');
        const res = await saveTeacherAdminMeta(selectedId, adminMeta, adminUid);
        setAdminMetaBusy(false);
        setAdminMetaMsg(res.ok ? 'Mentve.' : res.error || 'Mentés sikertelen');
        if (res.ok && selectedStudent) {
            const refreshed = await loadStudentDossier(selectedStudent);
            setDossier(refreshed);
        }
    };

    const startLiveLesson = async (opts?: {
        title?: string;
        studentName?: string;
        studentEmail?: string;
        bookingId?: string;
        emailStudent?: boolean;
    }) => {
        if (!adminUid) {
            setLessonStartMsg('Nincs tanári session — jelentkezz be újra.');
            return;
        }
        setLessonStartBusy(true);
        setLessonStartMsg('');
        try {
            const title =
                opts?.title ||
                (opts?.studentName
                    ? `Óra · ${opts.studentName}`
                    : `Matek óra · ${new Date().toLocaleString('hu-HU', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                      })}`);
            const { room, warning } = await createLessonRoom({
                title,
                createdBy: adminUid,
                bookingId: opts?.bookingId,
                studentName: opts?.studentName,
            });
            const path = lessonJoinPath(room.id);
            const absolute =
                typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
            setLastLessonLink(absolute);

            const parts: string[] = [];
            try {
                await navigator.clipboard.writeText(absolute);
                parts.push('Link a vágólapra másolva');
            } catch {
                parts.push(`Link: ${absolute}`);
            }

            const shouldEmail = opts?.emailStudent !== false && !!opts?.studentEmail;
            if (shouldEmail && opts?.studentEmail) {
                const mailed = await notifyStudentLessonLobby({
                    email: opts.studentEmail,
                    studentName: opts.studentName || 'Diák',
                    lobbyUrl: absolute,
                    lessonTitle: title,
                });
                parts.push(
                    mailed.ok
                        ? `e-mail elküldve (${opts.studentEmail})`
                        : `e-mail nem ment: ${mailed.error || 'hiba'}`
                );
            } else if (opts?.studentName && !opts?.studentEmail) {
                parts.push('nincs diák e-mail — csak link másolva');
            }

            if (warning) parts.push(warning);
            setLessonStartMsg(`Lobby kész — ${parts.join('; ')}.`);
            window.open(path, '_blank', 'noopener,noreferrer');
        } catch (err: any) {
            setLessonStartMsg(String(err?.message || err).slice(0, 160));
        } finally {
            setLessonStartBusy(false);
        }
    };

    return (
        <div className="atc">
            <div className="atc-platform-bar">
                <button
                    type="button"
                    className="atc-platform-brand"
                    onClick={() => setTab('students')}
                >
                    <p className="atc-platform-kicker">Mihaszna Matek</p>
                    <h1 className="atc-platform-title">Admin platform</h1>
                    <p className="atc-muted" style={{ margin: '0.2rem 0 0' }}>
                        Élő óra: Naptár → diák → Lobby (link + e-mail). Képernyőmegosztás a hívásban.
                    </p>
                </button>
                <div className="atc-tabs" role="tablist" aria-label="Admin eszközök">
                    {(
                        [
                            ['schedule', 'Naptár'],
                            ['tasks', 'Feladatok'],
                            ['lessons', 'Órák'],
                        ] as const
                    ).map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={tab === id}
                            className={tab === id ? 'active' : ''}
                            onClick={() => setTab(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'schedule' ? (
                <div className="atc-schedule">
                    {lessonStartMsg && tab === 'schedule' ? (
                        <p className="atc-msg" style={{ marginBottom: '0.75rem' }}>
                            {lessonStartMsg}
                            {lastLessonLink ? (
                                <>
                                    {' '}
                                    <a href={lastLessonLink} target="_blank" rel="noreferrer">
                                        Megnyitás
                                    </a>
                                </>
                            ) : null}
                        </p>
                    ) : null}
                    {typeof schedulePanel === 'function'
                        ? schedulePanel({
                              createLobbyFromBooking: async (booking) => {
                                  await startLiveLesson({
                                      title: `Óra · ${booking.customerName}${
                                          (booking.times || [])[0] ? ` · ${booking.times![0]}` : ''
                                      }`,
                                      studentName: booking.customerName,
                                      studentEmail: booking.customerEmail,
                                      bookingId: booking.id,
                                      emailStudent: true,
                                  });
                              },
                              lobbyBusy: lessonStartBusy,
                              lastLessonLink,
                              lessonStartMsg,
                          })
                        : schedulePanel}
                </div>
            ) : null}

            {tab === 'lessons' ? (
                <section className="atc-panel">
                    <div className="atc-row-between">
                        <h2>{lessonDay === 0 ? 'Mai órák' : 'Holnapi órák'}</h2>
                        <div className="atc-seg">
                            <button
                                type="button"
                                className={lessonDay === 0 ? 'active' : ''}
                                onClick={() => setLessonDay(0)}
                            >
                                Ma
                            </button>
                            <button
                                type="button"
                                className={lessonDay === 1 ? 'active' : ''}
                                onClick={() => setLessonDay(1)}
                            >
                                Holnap
                            </button>
                        </div>
                    </div>
                    <p className="atc-muted" style={{ marginBottom: '0.75rem' }}>
                        Preferált: <strong>Naptár</strong> → diák kiválasztása → Lobby (automatikus
                        e-mail). Itt gyors lista a nap foglalásaira.
                    </p>
                    <div className="atc-actions" style={{ margin: '0.75rem 0' }}>
                        <button
                            type="button"
                            className="atc-btn"
                            disabled={lessonStartBusy || !adminUid}
                            onClick={() => void startLiveLesson({ emailStudent: false })}
                        >
                            {lessonStartBusy ? '…' : 'Gyors lobby (nincs e-mail)'}
                        </button>
                        {lastLessonLink ? (
                            <button
                                type="button"
                                className="atc-btn"
                                onClick={() => {
                                    void navigator.clipboard.writeText(lastLessonLink).then(
                                        () => setLessonStartMsg('Link újra a vágólapra másolva.'),
                                        () => setLessonStartMsg(lastLessonLink)
                                    );
                                }}
                            >
                                Utolsó link másolása
                            </button>
                        ) : null}
                        {lastLessonLink ? (
                            <a
                                className="atc-btn"
                                href={lastLessonLink}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Megnyitás
                            </a>
                        ) : null}
                        <button
                            type="button"
                            className="atc-btn primary"
                            onClick={() => setTab('schedule')}
                        >
                            Naptár →
                        </button>
                    </div>
                    {lessonStartMsg ? <p className="atc-msg">{lessonStartMsg}</p> : null}
                    {loadingLessons ? (
                        <p className="atc-muted">Betöltés…</p>
                    ) : lessons.length === 0 ? (
                        <p className="atc-muted">Nincs foglalás erre a napra.</p>
                    ) : (
                        <ul className="atc-plain-list">
                            {lessons.map((b) => {
                                const student = findStudentForBooking(students, b);
                                return (
                                    <li key={b.id} className="atc-row-between">
                                        <div>
                                            <strong>
                                                {(b.times || []).join(', ') || '—'} · {b.customerName}
                                            </strong>
                                            <p className="atc-muted">
                                                {b.selectedSubject || 'Téma nincs'} ·{' '}
                                                {b.status === 'approved' ? 'Jóváhagyva' : 'Függőben'}
                                            </p>
                                        </div>
                                        <div className="atc-actions">
                                            <button
                                                type="button"
                                                className="atc-btn primary"
                                                disabled={lessonStartBusy || !adminUid}
                                                onClick={() =>
                                                    void startLiveLesson({
                                                        title: `Óra · ${b.customerName}`,
                                                        studentName: b.customerName,
                                                        studentEmail: b.customerEmail,
                                                        bookingId: b.id,
                                                        emailStudent: true,
                                                    })
                                                }
                                            >
                                                Lobby + e-mail
                                            </button>
                                            {student ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="atc-btn"
                                                        onClick={() =>
                                                            openStudent(student.uid, 'students')
                                                        }
                                                    >
                                                        Dosszié
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="atc-btn"
                                                        onClick={() =>
                                                            openStudent(student.uid, 'tasks')
                                                        }
                                                    >
                                                        Feladat
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="atc-muted">Nincs fiók</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            ) : null}

            {tab === 'tasks' ? (
                <section className="atc-panel">
                    <div className="atc-assign-bar">
                        <label>
                            Diák
                            <select
                                value={selectedId || ''}
                                onChange={(e) => setSelectedId(e.target.value || null)}
                            >
                                <option value="">Válassz diákot…</option>
                                {students.map((s) => (
                                    <option key={s.uid} value={s.uid}>
                                        {s.name} ({s.email || 'nincs email'})
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Szint
                            <select
                                value={levelFilter}
                                onChange={(e) => {
                                    setLevelFilter(e.target.value as LevelFilter);
                                    setActiveTopicKey(null);
                                }}
                            >
                                <option value="all">Mind (minden szint)</option>
                                <option value="elementary">Ált. iskola</option>
                                <option value="highschool">Középiskola</option>
                                <option value="erettsegi">Érettségi</option>
                                <option value="university">Egyetem</option>
                            </select>
                        </label>
                        <div className="atc-actions">
                            {activeTopicKey ? (
                                <button
                                    type="button"
                                    className="atc-btn"
                                    onClick={() => setActiveTopicKey(null)}
                                >
                                    ← Témák
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="atc-btn"
                                    onClick={() => setTab('students')}
                                >
                                    ← Admin
                                </button>
                            )}
                            <button
                                type="button"
                                className="atc-btn"
                                disabled={selectedTaskIds.length === 0}
                                onClick={() => setSelectedTaskIds([])}
                            >
                                Törlés
                            </button>
                            <button
                                type="button"
                                className="atc-btn primary"
                                disabled={!selectedStudent || selectedTasks.length === 0 || assignBusy}
                                onClick={() => void runAssign(false)}
                            >
                                {assignBusy
                                    ? '…'
                                    : selectedTasks.length > 1
                                      ? `Kiosztás (${selectedTasks.length})`
                                      : 'Kiosztás'}
                            </button>
                            <button
                                type="button"
                                className="atc-btn"
                                disabled={!selectedStudent || selectedTasks.length === 0 || assignBusy}
                                onClick={() => void runAssign(true)}
                            >
                                Kiosztás + indítás
                            </button>
                            <label className="atc-notify-toggle">
                                <input
                                    type="checkbox"
                                    checked={notifyOnAssign}
                                    onChange={(e) => setNotifyOnAssign(e.target.checked)}
                                />
                                Diák értesítése e-mailben
                            </label>
                        </div>
                    </div>
                    {assignMsg ? <p className="atc-msg">{assignMsg}</p> : null}

                    {!activeTopicKey ? (
                        <>
                            <p className="atc-muted">
                                Lépj be egy témakörbe: meglátod az alapfeladatokat, és írhatsz sajátot.
                            </p>
                            <div className="atc-task-grid">
                                {topicBrowseList.map((topic) => (
                                    <button
                                        key={topic.key}
                                        type="button"
                                        className="atc-task-card"
                                        onClick={() => enterTopic(topic.key, topic.title)}
                                    >
                                        <strong>{topic.title}</strong>
                                        <span>
                                            {LEVEL_LABEL[topic.educationLevel] || topic.educationLevel}
                                            {topic.erettsegiLevel === 'kozep'
                                                ? ' · közép'
                                                : topic.erettsegiLevel === 'emelt'
                                                  ? ' · emelt'
                                                  : ''}
                                        </span>
                                        <span>
                                            Alap: {topic.baseCount} · Saját: {topic.ownCount} · Belépés →
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {topicBrowseList.length === 0 ? (
                                <p className="atc-muted">Nincs téma ezen a szinten.</p>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <div className="atc-row-between" style={{ marginBottom: '0.75rem' }}>
                                <div>
                                    <h2 style={{ margin: 0 }}>
                                        {activeTopicMeta?.title || activeTopicKey}
                                    </h2>
                                    <p className="atc-muted" style={{ margin: '0.25rem 0 0' }}>
                                        {LEVEL_LABEL[activeTopicMeta?.educationLevel || ''] ||
                                            activeTopicMeta?.educationLevel ||
                                            ''}
                                    </p>
                                </div>
                            </div>

                            <h3>Alapfeladatok</h3>
                            <p className="atc-muted" style={{ marginBottom: '0.5rem' }}>
                                Ezek a rendszer alapfeladatai ehhez a témához. Jelöld ki, majd Kiosztás.
                            </p>
                            {topicTasks.base.length === 0 ? (
                                <p className="atc-muted">Nincs alapfeladat.</p>
                            ) : (
                                <div className="atc-task-grid">
                                    {topicTasks.base.map((task) => (
                                        <button
                                            key={task.id}
                                            type="button"
                                            className={`atc-task-card ${selectedTaskIds.includes(task.id) ? 'active' : ''}`}
                                            onClick={() => toggleTaskId(task.id)}
                                            aria-pressed={selectedTaskIds.includes(task.id)}
                                        >
                                            <strong>
                                                {isCatalogBaseTask(task) ? '📘 ' : '📗 '}
                                                {task.title}
                                            </strong>
                                            <span>{task.description || task.topic}</span>
                                            <span>
                                                {task.difficulty} · {task.questions} kérdés · {task.timeLimit} perc
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <h3>Saját feladatok</h3>
                            {topicTasks.own.length === 0 ? (
                                <p className="atc-muted">Még nincs saját feladat ehhez a témához.</p>
                            ) : (
                                <div className="atc-task-grid">
                                    {topicTasks.own.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`atc-task-card atc-task-card-own ${selectedTaskIds.includes(task.id) ? 'active' : ''} ${editingTaskId === task.id ? 'editing' : ''}`}
                                        >
                                            <button
                                                type="button"
                                                className="atc-task-select"
                                                onClick={() => toggleTaskId(task.id)}
                                                aria-pressed={selectedTaskIds.includes(task.id)}
                                            >
                                                <strong>✏️ {task.title}</strong>
                                                <span>
                                                    {(task.customQuestions || []).length} saját kérdés ·{' '}
                                                    {task.timeLimit} perc
                                                </span>
                                                <span className="atc-muted">
                                                    {(task.customQuestions || [])
                                                        .slice(0, 2)
                                                        .map((q) => q.question)
                                                        .join(' · ')}
                                                </span>
                                            </button>
                                            <div className="atc-task-own-actions">
                                                <button
                                                    type="button"
                                                    className="atc-btn"
                                                    onClick={() => startEditOwnTask(task)}
                                                >
                                                    Szerkesztés
                                                </button>
                                                <button
                                                    type="button"
                                                    className="atc-btn"
                                                    onClick={() => void removeOwnTask(task.id)}
                                                >
                                                    Törlés
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <h3>
                                {editingTaskId ? 'Saját feladat szerkesztése' : 'Saját feladat írása'}
                            </h3>
                            <div className="atc-own-form">
                                <label>
                                    Cím
                                    <input
                                        value={ownTitle}
                                        onChange={(e) => setOwnTitle(e.target.value)}
                                        placeholder="Pl. Másodfokú — házi 1"
                                    />
                                </label>
                                <label>
                                    Leírás
                                    <input
                                        value={ownDescription}
                                        onChange={(e) => setOwnDescription(e.target.value)}
                                        placeholder="Rövid útmutató a diáknak"
                                    />
                                </label>
                                <div className="atc-own-row">
                                    <label>
                                        Nehézség
                                        <select
                                            value={ownDifficulty}
                                            onChange={(e) =>
                                                setOwnDifficulty(
                                                    e.target.value as 'easy' | 'medium' | 'hard'
                                                )
                                            }
                                        >
                                            <option value="easy">könnyű</option>
                                            <option value="medium">közepes</option>
                                            <option value="hard">nehéz</option>
                                        </select>
                                    </label>
                                    <label>
                                        Időlimit (perc)
                                        <input
                                            type="number"
                                            min={5}
                                            max={180}
                                            value={ownTimeLimit}
                                            onChange={(e) =>
                                                setOwnTimeLimit(Math.max(5, Number(e.target.value) || 30))
                                            }
                                        />
                                    </label>
                                </div>
                                <label>
                                    Kérdések (soronként)
                                    <textarea
                                        rows={6}
                                        value={ownQuestionsText}
                                        onChange={(e) => setOwnQuestionsText(e.target.value)}
                                        placeholder={
                                            'Egy sor = egy kérdés\nOpcionális válasz: 2x+3=7 || 2\nMásik kérdés szövege'
                                        }
                                    />
                                </label>
                                <p className="atc-muted">
                                    Formátum: <code>kérdés</code> vagy <code>kérdés || számválasz</code>
                                </p>
                                <div className="atc-actions">
                                    <button
                                        type="button"
                                        className="atc-btn"
                                        disabled={ownBusy}
                                        onClick={() => void saveOwnTask(false)}
                                    >
                                        {ownBusy ? '…' : editingTaskId ? 'Frissítés' : 'Mentés'}
                                    </button>
                                    <button
                                        type="button"
                                        className="atc-btn primary"
                                        disabled={ownBusy || !selectedStudent}
                                        onClick={() => void saveOwnTask(true)}
                                    >
                                        {ownBusy
                                            ? '…'
                                            : editingTaskId
                                              ? 'Frissítés + kiosztás'
                                              : 'Mentés + kiosztás'}
                                    </button>
                                    {editingTaskId ? (
                                        <button
                                            type="button"
                                            className="atc-btn"
                                            disabled={ownBusy}
                                            onClick={() => {
                                                setEditingTaskId(null);
                                                setOwnTitle(
                                                    activeTopicMeta
                                                        ? `${activeTopicMeta.title} — saját feladat`
                                                        : 'Saját feladat'
                                                );
                                                setOwnDescription('');
                                                setOwnQuestionsText('');
                                                setOwnDifficulty('medium');
                                                setOwnTimeLimit(30);
                                                setAssignMsg('');
                                            }}
                                        >
                                            Mégse
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )}
                </section>
            ) : null}

            {tab === 'students' ? (
                <div>
                    <AdminHomeInbox
                        students={students}
                        onOpenStudent={(uid) => {
                            setSelectedId(uid);
                            setTab('students');
                        }}
                        onOpenSchedule={() => setTab('schedule')}
                        onOpenLessons={() => setTab('lessons')}
                    />
                <div className="atc-grid">
                    <aside className="atc-panel">
                        <div className="atc-row-between" style={{ marginBottom: '0.55rem' }}>
                            <strong>Diákok</strong>
                            <button
                                type="button"
                                className="atc-btn"
                                onClick={() => void refreshStudents()}
                            >
                                Frissítés
                            </button>
                        </div>
                        <input
                            className="atc-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Keresés…"
                            aria-label="Diák keresés"
                        />
                        {loadingList ? (
                            <p className="atc-muted">Betöltés…</p>
                        ) : filteredStudents.length === 0 ? (
                            <p className="atc-muted">Nincs diák a listában.</p>
                        ) : (
                            <ul className="atc-student-list">
                                {filteredStudents.map((s) => (
                                    <li key={s.uid}>
                                        <button
                                            type="button"
                                            className={selectedId === s.uid ? 'active' : ''}
                                            onClick={() => setSelectedId(s.uid)}
                                        >
                                            <span className="atc-avatar-sm" aria-hidden>
                                                {s.photoURL ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={s.photoURL} alt="" />
                                                ) : (
                                                    initials(s.name, s.email)
                                                )}
                                            </span>
                                            <span className="atc-student-meta">
                                                <span>{s.name}</span>
                                                <em>{s.email || '—'}</em>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </aside>

                    <section className="atc-panel">
                        {!selectedId ? (
                            <div>
                                <p className="atc-muted" style={{ marginBottom: '0.75rem' }}>
                                    {students.length === 0
                                        ? 'Még nincs diák a listában.'
                                        : 'Válassz diákot a bal oldali listából.'}
                                </p>
                            </div>
                        ) : loadingDossier || !dossier ? (
                            <p className="atc-muted">Dosszié betöltése…</p>
                        ) : (
                            <>
                                <div className="atc-profile-head">
                                    <div className="atc-avatar-lg" aria-hidden>
                                        {dossier.profile.photoURL ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={dossier.profile.photoURL}
                                                alt={dossier.profile.displayName || 'Profilkép'}
                                            />
                                        ) : (
                                            <span>
                                                {initials(
                                                    dossier.profile.displayName,
                                                    dossier.profile.email
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className="atc-profile-head-text">
                                        <h2>{dossier.profile.displayName || dossier.student.name}</h2>
                                        <p className="atc-muted">
                                            {dossier.profile.email || dossier.student.email || '—'}
                                        </p>
                                        {dossier.profile.username ? (
                                            <p className="atc-muted">@{dossier.profile.username}</p>
                                        ) : null}
                                        <div className="atc-actions" style={{ marginTop: '0.65rem' }}>
                                            <button
                                                type="button"
                                                className="atc-btn primary"
                                                onClick={() => setTab('tasks')}
                                            >
                                                Feladat kiosztása
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {dossier.profile.bio ? (
                                    <p className="atc-bio">{dossier.profile.bio}</p>
                                ) : null}

                                <div className="atc-prep">
                                    <h3>Következő óra előkészítő</h3>
                                    {dossier.profile.nextLesson ? (
                                        <p className="atc-prep-when">
                                            {dossier.profile.nextLesson.date} ·{' '}
                                            {(dossier.profile.nextLesson.times || []).join(', ') ||
                                                '—'}{' '}
                                            ·{' '}
                                            {dossier.profile.nextLesson.lessonType === 'online'
                                                ? 'online'
                                                : 'személyes'}
                                            {dossier.profile.nextLesson.selectedSubject
                                                ? ` · ${dossier.profile.nextLesson.selectedSubject}`
                                                : ''}
                                        </p>
                                    ) : (
                                        <p className="atc-muted">Nincs közelgő foglalás.</p>
                                    )}
                                    <div className="atc-prep-cols">
                                        <div>
                                            <strong>Gyenge témák</strong>
                                            {dossier.topics.filter((t) => t.weak).length === 0 ? (
                                                <p className="atc-muted">Nincs gyenge téma.</p>
                                            ) : (
                                                <ul className="atc-plain-list">
                                                    {dossier.topics
                                                        .filter((t) => t.weak)
                                                        .slice(0, 5)
                                                        .map((t) => (
                                                            <li key={t.key}>
                                                                <strong>{t.title}</strong>
                                                                <span className="atc-muted">
                                                                    {t.statusLabel}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div>
                                            <strong>Nyitott feladatok</strong>
                                            {dossier.tasks.filter((t) => t.status !== 'completed')
                                                .length === 0 ? (
                                                <p className="atc-muted">Nincs nyitott feladat.</p>
                                            ) : (
                                                <ul className="atc-plain-list">
                                                    {dossier.tasks
                                                        .filter((t) => t.status !== 'completed')
                                                        .slice(0, 5)
                                                        .map((t) => (
                                                            <li key={t.id}>
                                                                <strong>{t.title}</strong>
                                                                <span className="atc-muted">
                                                                    {t.topicTitle ||
                                                                        t.status ||
                                                                        'assigned'}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    {noteDraft.trim() ? (
                                        <p className="atc-prep-note">
                                            <strong>Jegyzet:</strong> {noteDraft.trim()}
                                        </p>
                                    ) : (
                                        <p className="atc-muted">Még nincs órajegyzet.</p>
                                    )}
                                </div>

                                <h3>Jelenlét és fizetés</h3>
                                <div className="atc-admin-meta">
                                    <label>
                                        Jelenlét
                                        <select
                                            value={adminMeta.attendanceStatus}
                                            onChange={(e) =>
                                                setAdminMeta((m) => ({
                                                    ...m,
                                                    attendanceStatus: e.target
                                                        .value as TeacherAdminMeta['attendanceStatus'],
                                                }))
                                            }
                                        >
                                            <option value="unknown">—</option>
                                            <option value="present">Jelen</option>
                                            <option value="absent">Hiányzott</option>
                                            <option value="excused">Igazolt</option>
                                        </select>
                                    </label>
                                    <label>
                                        Fizetés
                                        <select
                                            value={adminMeta.paymentStatus}
                                            onChange={(e) =>
                                                setAdminMeta((m) => ({
                                                    ...m,
                                                    paymentStatus: e.target
                                                        .value as TeacherAdminMeta['paymentStatus'],
                                                }))
                                            }
                                        >
                                            <option value="">—</option>
                                            <option value="unpaid">Nem fizetett</option>
                                            <option value="transfer_pending">Átutalás folyamatban</option>
                                            <option value="paid">Fizetve</option>
                                        </select>
                                    </label>
                                    <label>
                                        Jelenlét megjegyzés
                                        <input
                                            value={adminMeta.attendanceNote}
                                            onChange={(e) =>
                                                setAdminMeta((m) => ({
                                                    ...m,
                                                    attendanceNote: e.target.value,
                                                }))
                                            }
                                            placeholder="Pl. késés 10 perc"
                                        />
                                    </label>
                                    <label>
                                        Fizetés megjegyzés
                                        <input
                                            value={adminMeta.paymentNote}
                                            onChange={(e) =>
                                                setAdminMeta((m) => ({
                                                    ...m,
                                                    paymentNote: e.target.value,
                                                }))
                                            }
                                            placeholder="Pl. 8000 Ft, április"
                                        />
                                    </label>
                                </div>
                                <div className="atc-actions" style={{ marginTop: '0.55rem' }}>
                                    <button
                                        type="button"
                                        className="atc-btn primary"
                                        disabled={adminMetaBusy}
                                        onClick={() => void saveAdminMeta()}
                                    >
                                        {adminMetaBusy ? '…' : 'Jelenlét / fizetés mentése'}
                                    </button>
                                    {adminMetaMsg ? (
                                        <span className="atc-msg">{adminMetaMsg}</span>
                                    ) : null}
                                </div>

                                <h3>Profil adatok</h3>
                                <dl className="atc-info-grid">
                                    <div>
                                        <dt>Iskolaszint</dt>
                                        <dd>{educationLabel(dossier.profile.educationLevel)}</dd>
                                    </div>
                                    <div>
                                        <dt>Telefon</dt>
                                        <dd>{dossier.profile.phone || '—'}</dd>
                                    </div>
                                    <div>
                                        <dt>UID</dt>
                                        <dd className="atc-mono">{dossier.student.uid}</dd>
                                    </div>
                                    <div>
                                        <dt>Regisztráció</dt>
                                        <dd>{formatWhen(dossier.profile.createdAtMs)}</dd>
                                    </div>
                                    <div>
                                        <dt>Utolsó belépés</dt>
                                        <dd>{formatWhen(dossier.profile.lastLoginMs)}</dd>
                                    </div>
                                    <div>
                                        <dt>Utolsó frissítés</dt>
                                        <dd>{formatWhen(dossier.profile.updatedAtMs)}</dd>
                                    </div>
                                    <div>
                                        <dt>Közösség</dt>
                                        <dd>
                                            {dossier.profile.followerCount} követő ·{' '}
                                            {dossier.profile.followingCount} követés ·{' '}
                                            {dossier.profile.postCount} poszt
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>Social XP / rang</dt>
                                        <dd>
                                            {dossier.profile.socialXp || 0} XP
                                            {dossier.profile.socialRank
                                                ? ` · ${dossier.profile.socialRank}`
                                                : ''}
                                        </dd>
                                    </div>
                                    {dossier.profile.extraFields.map((f) => (
                                        <div key={f.key}>
                                            <dt>{f.key}</dt>
                                            <dd>{f.value}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className="atc-stats">
                                    <div>
                                        <strong>
                                            {getRankEmoji(dossier.progress.rankLevel)}{' '}
                                            {dossier.progress.xp}
                                        </strong>
                                        <span>XP</span>
                                    </div>
                                    <div>
                                        <strong>{dossier.progress.rank}</strong>
                                        <span>Rang</span>
                                    </div>
                                    <div>
                                        <strong>{dossier.weakTopicCount}</strong>
                                        <span>Gyenge</span>
                                    </div>
                                    <div>
                                        <strong>{dossier.openTaskCount}</strong>
                                        <span>Feladat</span>
                                    </div>
                                </div>

                                <h3>Jelvények ({BADGE_DEFS.length})</h3>
                                <div className="atc-badges">
                                    {BADGE_DEFS.map((def) => {
                                        const earned = dossier.progress.badges.includes(def.id);
                                        return (
                                            <span
                                                key={def.id}
                                                className={`atc-badge ${earned ? 'earned' : 'locked'}`}
                                                title={def.description}
                                            >
                                                <span className="atc-badge-icon">{def.icon || '🏅'}</span>
                                                <span>
                                                    <strong>{def.title}</strong>
                                                    <em>{earned ? 'Megszerezve' : 'Még nincs'}</em>
                                                </span>
                                            </span>
                                        );
                                    })}
                                </div>

                                <h3>Foglalások</h3>
                                {dossier.profile.bookings.length === 0 ? (
                                    <p className="atc-muted">Nincs foglalás ehhez az e-mailhez.</p>
                                ) : (
                                    <ul className="atc-plain-list">
                                        {dossier.profile.bookings.slice(0, 12).map((b) => (
                                            <li key={b.id}>
                                                <strong>
                                                    {b.date} · {(b.times || []).join(', ') || '—'}
                                                </strong>
                                                <span className="atc-muted">
                                                    {b.status || '—'} · {b.selectedSubject || 'téma nincs'} ·{' '}
                                                    {b.lessonType === 'online' ? 'online' : 'személyes'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <h3>Témakörök ({dossier.topics.length})</h3>
                                <p className="atc-muted" style={{ marginBottom: '0.55rem' }}>
                                    Több témát is kijelölhetsz (kattints a kártyára), majd kioszthatod
                                    egyszerre.
                                </p>
                                <div className="atc-actions" style={{ marginBottom: '0.65rem' }}>
                                    <button
                                        type="button"
                                        className="atc-btn primary"
                                        disabled={
                                            selectedTopicKeys.length === 0 || assignBusy || !selectedStudent
                                        }
                                        onClick={() => void assignSelectedTopicsFromDossier()}
                                    >
                                        {assignBusy
                                            ? '…'
                                            : selectedTopicKeys.length
                                              ? `Kiosztás (${selectedTopicKeys.length})`
                                              : 'Kiosztás'}
                                    </button>
                                    <button
                                        type="button"
                                        className="atc-btn"
                                        disabled={selectedTopicKeys.length === 0}
                                        onClick={() => setSelectedTopicKeys([])}
                                    >
                                        Kijelölés törlése
                                    </button>
                                    {assignMsg && tab === 'students' ? (
                                        <span className="atc-msg">{assignMsg}</span>
                                    ) : null}
                                </div>
                                <div className="atc-topics">
                                    {dossier.topics.map((t) => {
                                        const pct = Math.round(
                                            (t.lessonsDone / Math.max(1, t.lessonsTotal)) * 100
                                        );
                                        const selected = selectedTopicKeys.includes(t.key);
                                        return (
                                            <div
                                                key={t.key}
                                                className={`atc-topic ${t.weak ? 'weak' : ''} ${t.completed ? 'done' : ''} ${!t.started ? 'idle' : ''} ${selected ? 'selected' : ''}`}
                                            >
                                                <div className="atc-topic-top">
                                                    <button
                                                        type="button"
                                                        className="atc-topic-select"
                                                        onClick={() => toggleTopicKey(t.key)}
                                                        aria-pressed={selected}
                                                    >
                                                        <strong>
                                                            {selected ? '✓ ' : ''}
                                                            {t.title}
                                                        </strong>
                                                        <span className="atc-topic-level">
                                                            {t.levelLabel}
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="atc-btn"
                                                        onClick={() => enterTopic(t.key, t.title)}
                                                    >
                                                        Belépés
                                                    </button>
                                                </div>
                                                <div className="atc-topic-bar" aria-hidden>
                                                    <i style={{ width: `${Math.min(100, pct)}%` }} />
                                                </div>
                                                <span>
                                                    {t.statusLabel} · {t.lessonsDone}/{t.lessonsTotal}
                                                    {t.avgStars != null
                                                        ? ` · ★ ${t.avgStars.toFixed(1)}`
                                                        : ''}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <h3>Hibák</h3>
                                {dossier.mistakes.filter((m) => m.wrong > 0).length === 0 ? (
                                    <p className="atc-muted">Nincs hibás futam.</p>
                                ) : (
                                    <ul className="atc-plain-list">
                                        {dossier.mistakes
                                            .filter((m) => m.wrong > 0)
                                            .slice(0, 8)
                                            .map((m) => (
                                                <li key={m.id}>
                                                    <strong>{m.topic}</strong>
                                                    <span className="atc-muted">
                                                        {m.wrong} hiba / {m.total} · {formatWhen(m.atMs)}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                )}

                                <h3>Kiosztott feladatok</h3>
                                {dossier.tasks.length === 0 ? (
                                    <p className="atc-muted">Még nincs feladat.</p>
                                ) : (
                                    <ul className="atc-plain-list">
                                        {dossier.tasks.map((task) => (
                                            <li key={task.id}>
                                                <strong>{task.title}</strong>
                                                <span className="atc-muted">
                                                    {task.topicTitle || '—'} · {task.status || 'assigned'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <h3>Órajegyzet</h3>
                                <textarea
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    rows={4}
                                    placeholder="Következő órára…"
                                />
                                <div className="atc-actions" style={{ marginTop: '0.6rem' }}>
                                    <button
                                        type="button"
                                        className="atc-btn primary"
                                        disabled={noteSaving}
                                        onClick={() => void saveNote()}
                                    >
                                        {noteSaving ? '…' : 'Mentés'}
                                    </button>
                                    {noteMsg ? <span className="atc-msg">{noteMsg}</span> : null}
                                </div>
                            </>
                        )}
                    </section>
                </div>
                </div>
            ) : null}

            <style jsx>{`
                .atc {
                    --line: rgba(57, 255, 20, 0.2);
                    --muted: #a8b8b0;
                    --accent: #39ff14;
                    max-width: 1100px;
                    margin: 0 auto 2rem;
                    padding: 0 0.5rem 1.5rem;
                    color: #e8f0ea;
                }
                .atc :global(h1),
                .atc :global(h2),
                .atc :global(h3),
                .atc :global(p),
                .atc :global(strong),
                .atc :global(span),
                .atc :global(li),
                .atc :global(label) {
                    color: inherit;
                }
                .atc-platform-bar {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0.85rem;
                    margin: 0 0 1.25rem;
                    padding: 0.9rem 1rem 1rem;
                    border: 1px solid var(--line);
                    border-radius: 14px;
                    background: rgba(12, 16, 22, 0.92);
                }
                .atc-platform-brand {
                    background: transparent;
                    border: none;
                    color: inherit;
                    text-align: left;
                    padding: 0;
                    cursor: pointer;
                    width: 100%;
                }
                .atc-platform-kicker {
                    margin: 0;
                    font-size: 0.7rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: var(--accent);
                    font-weight: 700;
                }
                .atc-platform-title {
                    margin: 0.15rem 0 0;
                    font-size: 1.45rem;
                    font-weight: 800;
                    color: #e8f0ea;
                }
                .atc-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                    position: static;
                    width: 100%;
                    height: auto;
                    background: transparent;
                    padding: 0;
                    margin: 0;
                    z-index: auto;
                }
                .atc-tabs button {
                    border: 1px solid var(--line);
                    background: rgba(18, 24, 33, 0.95);
                    color: #d7e6dc !important;
                    padding: 0.55rem 0.95rem;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .atc-tabs button.active {
                    background: rgba(57, 255, 20, 0.15);
                    color: #39ff14 !important;
                    border-color: rgba(57, 255, 20, 0.45);
                }
                .atc-grid {
                    display: grid;
                    grid-template-columns: minmax(200px, 260px) 1fr;
                    gap: 0.85rem;
                }
                @media (max-width: 800px) {
                    .atc-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .atc-panel {
                    background: #121821;
                    border: 1px solid var(--line);
                    border-radius: 14px;
                    padding: 0.9rem;
                }
                .atc-muted {
                    color: var(--muted) !important;
                    font-size: 0.88rem;
                }
                .atc-search,
                .atc-assign-bar select,
                .atc-panel textarea,
                .atc-assign-bar label select {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0.55rem 0.7rem;
                    border-radius: 9px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: #0a0e13;
                    color: inherit;
                }
                .atc-search {
                    margin-bottom: 0.65rem;
                }
                .atc-student-list,
                .atc-plain-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .atc-student-list button {
                    width: 100%;
                    text-align: left;
                    border: 1px solid transparent;
                    background: transparent;
                    color: inherit;
                    padding: 0.45rem 0.4rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 0.55rem;
                }
                .atc-avatar-sm {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    overflow: hidden;
                    flex-shrink: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(57, 255, 20, 0.12);
                    border: 1px solid var(--line);
                    font-size: 0.72rem;
                    font-weight: 800;
                    color: var(--accent);
                }
                .atc-avatar-sm img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .atc-student-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                    min-width: 0;
                }
                .atc-student-meta span {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .atc-student-list button em {
                    font-style: normal;
                    color: var(--muted);
                    font-size: 0.78rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .atc-student-list button.active,
                .atc-student-list button:hover {
                    background: rgba(57, 255, 20, 0.08);
                    border-color: var(--line);
                }
                .atc-profile-head {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                    margin-bottom: 0.85rem;
                }
                .atc-avatar-lg {
                    width: 88px;
                    height: 88px;
                    border-radius: 50%;
                    overflow: hidden;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(57, 255, 20, 0.12);
                    border: 2px solid rgba(57, 255, 20, 0.35);
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: var(--accent);
                }
                .atc-avatar-lg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .atc-profile-head-text h2 {
                    margin: 0;
                    font-size: 1.35rem;
                }
                .atc-bio {
                    margin: 0 0 0.85rem;
                    padding: 0.65rem 0.75rem;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid var(--line);
                    color: #d7e6dc;
                    line-height: 1.45;
                }
                .atc-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 0.55rem 0.75rem;
                    margin: 0 0 1rem;
                }
                @media (max-width: 640px) {
                    .atc-info-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .atc-info-grid div {
                    padding: 0.45rem 0.55rem;
                    border-radius: 8px;
                    background: rgba(10, 14, 19, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                }
                .atc-info-grid dt {
                    margin: 0;
                    font-size: 0.72rem;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    color: var(--muted);
                }
                .atc-info-grid dd {
                    margin: 0.2rem 0 0;
                    color: #e8f0ea;
                    word-break: break-word;
                }
                .atc-mono {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                    font-size: 0.78rem;
                }
                .atc-badges {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 0.45rem;
                    margin-bottom: 0.85rem;
                }
                .atc-badge {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.45rem;
                    padding: 0.5rem 0.6rem;
                    border-radius: 10px;
                    border: 1px solid var(--line);
                    background: rgba(57, 255, 20, 0.08);
                    font-size: 0.82rem;
                }
                .atc-badge.locked {
                    opacity: 0.55;
                    background: rgba(255, 255, 255, 0.03);
                    border-style: dashed;
                }
                .atc-badge.earned {
                    opacity: 1;
                    border-color: rgba(57, 255, 20, 0.45);
                }
                .atc-badge-icon {
                    font-size: 1.05rem;
                    line-height: 1.2;
                }
                .atc-badge strong {
                    display: block;
                }
                .atc-badge em {
                    display: block;
                    font-style: normal;
                    color: var(--muted);
                    font-size: 0.72rem;
                    margin-top: 0.1rem;
                }
                .atc-row-between {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }
                .atc-row-between h2 {
                    margin: 0;
                    font-size: 1.25rem;
                }
                .atc-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.4rem;
                    margin: 0.85rem 0;
                }
                .atc-stats div {
                    text-align: center;
                    background: rgba(0, 0, 0, 0.25);
                    border-radius: 9px;
                    padding: 0.45rem;
                }
                .atc-stats strong {
                    display: block;
                    color: var(--accent);
                    font-size: 0.9rem;
                }
                .atc-stats span {
                    font-size: 0.68rem;
                    color: var(--muted);
                }
                .atc-panel h3 {
                    margin: 1rem 0 0.5rem;
                    font-size: 0.95rem;
                }
                .atc-topics {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 0.5rem;
                }
                .atc-topic.selected {
                    border-color: rgba(57, 255, 20, 0.75);
                    box-shadow: 0 0 0 1px rgba(57, 255, 20, 0.35);
                    background: rgba(57, 255, 20, 0.12);
                }
                .atc-topic {
                    background: rgba(10, 14, 19, 0.65);
                    border: 1px solid var(--line);
                    border-radius: 10px;
                    padding: 0.55rem 0.65rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                    font-size: 0.82rem;
                    color: inherit;
                    text-align: left;
                    width: 100%;
                }
                .atc-topic-select {
                    background: transparent;
                    border: none;
                    color: inherit;
                    text-align: left;
                    padding: 0;
                    cursor: pointer;
                    flex: 1;
                    min-width: 0;
                }
                .atc-topic-top .atc-btn {
                    padding: 0.3rem 0.55rem;
                    font-size: 0.75rem;
                    flex-shrink: 0;
                }
                .atc-own-form {
                    display: flex;
                    flex-direction: column;
                    gap: 0.65rem;
                    margin-top: 0.35rem;
                    padding: 0.85rem;
                    border-radius: 12px;
                    border: 1px solid var(--line);
                    background: rgba(0, 0, 0, 0.22);
                }
                .atc-own-form label {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    font-size: 0.82rem;
                    color: var(--muted);
                }
                .atc-own-form input,
                .atc-own-form textarea,
                .atc-own-form select {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0.55rem 0.7rem;
                    border-radius: 9px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: #0a0e13;
                    color: #e8f0ea;
                    font: inherit;
                }
                .atc-own-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.65rem;
                }
                @media (max-width: 640px) {
                    .atc-own-row {
                        grid-template-columns: 1fr;
                    }
                }
                .atc-own-form code {
                    color: var(--accent);
                }
                .atc-topic.weak {
                    border-color: rgba(255, 105, 180, 0.55);
                    background: rgba(80, 10, 40, 0.35);
                }
                .atc-topic.done {
                    border-color: rgba(57, 255, 20, 0.45);
                }
                .atc-topic.idle {
                    opacity: 0.8;
                }
                .atc-topic-top {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.5rem;
                    align-items: flex-start;
                }
                .atc-topic-top strong {
                    display: block;
                    font-size: 0.9rem;
                }
                .atc-topic-level {
                    display: block;
                    color: var(--muted);
                    font-size: 0.72rem;
                    margin-top: 0.15rem;
                }
                .atc-topic-bar {
                    height: 6px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.08);
                    overflow: hidden;
                }
                .atc-topic-bar i {
                    display: block;
                    height: 100%;
                    background: linear-gradient(90deg, #39ff14, #b8ff5a);
                }
                .atc-topic.weak .atc-topic-bar i {
                    background: linear-gradient(90deg, #ff69b4, #ff9ecd);
                }
                .atc-topic span {
                    color: var(--muted);
                    font-size: 0.78rem;
                }
                .atc-topic-top .atc-btn {
                    padding: 0.3rem 0.55rem;
                    font-size: 0.75rem;
                    flex-shrink: 0;
                }
                .atc-plain-list li {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.75rem;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    flex-wrap: wrap;
                }
                .atc-btn {
                    border: 1px solid var(--line);
                    background: rgba(57, 255, 20, 0.08);
                    color: var(--accent);
                    font-weight: 700;
                    padding: 0.5rem 0.85rem;
                    border-radius: 9px;
                    cursor: pointer;
                }
                .atc-btn.primary {
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                    color: #061008;
                    border: none;
                }
                .atc-btn:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }
                .atc-actions {
                    display: flex;
                    gap: 0.45rem;
                    flex-wrap: wrap;
                    align-items: center;
                }
                .atc-msg {
                    color: var(--accent);
                    font-size: 0.88rem;
                }
                .atc-seg {
                    display: flex;
                    gap: 0.3rem;
                }
                .atc-seg button {
                    border: 1px solid var(--line);
                    background: transparent;
                    color: var(--muted);
                    border-radius: 8px;
                    padding: 0.35rem 0.7rem;
                    font-weight: 700;
                    cursor: pointer;
                }
                .atc-seg button.active {
                    color: var(--accent);
                    background: rgba(57, 255, 20, 0.12);
                }
                .atc-assign-bar {
                    display: grid;
                    grid-template-columns: 1.4fr 0.8fr auto;
                    gap: 0.65rem;
                    align-items: end;
                    margin-bottom: 0.75rem;
                }
                @media (max-width: 800px) {
                    .atc-assign-bar {
                        grid-template-columns: 1fr;
                    }
                }
                .atc-assign-bar label {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    font-size: 0.78rem;
                    color: var(--muted);
                    font-weight: 700;
                }
                .atc-task-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 0.55rem;
                    margin-top: 0.75rem;
                }
                .atc-task-card {
                    text-align: left;
                    background: rgba(0, 0, 0, 0.28);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 11px;
                    padding: 0.7rem;
                    color: inherit;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .atc-task-card span {
                    color: var(--muted);
                    font-size: 0.78rem;
                }
                .atc-task-card.active {
                    border-color: var(--accent);
                    background: rgba(57, 255, 20, 0.1);
                }
                .atc-task-card-own {
                    cursor: default;
                    gap: 0.45rem;
                }
                .atc-task-card-own.editing {
                    border-color: rgba(255, 200, 80, 0.55);
                }
                .atc-task-select {
                    all: unset;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    width: 100%;
                }
                .atc-task-own-actions {
                    display: flex;
                    gap: 0.35rem;
                    flex-wrap: wrap;
                }
                .atc-task-own-actions .atc-btn {
                    padding: 0.28rem 0.55rem;
                    font-size: 0.72rem;
                }
                .atc-notify-toggle {
                    display: inline-flex !important;
                    flex-direction: row !important;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.78rem;
                    color: var(--muted);
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .atc-prep {
                    margin: 0.85rem 0 1rem;
                    padding: 0.85rem 0.9rem;
                    border-radius: 12px;
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    background: rgba(20, 40, 24, 0.45);
                }
                .atc-prep h3 {
                    margin: 0 0 0.45rem;
                }
                .atc-prep-when {
                    margin: 0 0 0.65rem;
                    color: var(--accent);
                    font-weight: 700;
                    font-size: 0.9rem;
                }
                .atc-prep-cols {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                    margin-bottom: 0.55rem;
                }
                @media (max-width: 700px) {
                    .atc-prep-cols {
                        grid-template-columns: 1fr;
                    }
                }
                .atc-prep-cols strong {
                    display: block;
                    margin-bottom: 0.35rem;
                    font-size: 0.82rem;
                }
                .atc-prep-note {
                    margin: 0;
                    font-size: 0.88rem;
                    line-height: 1.4;
                }
                .atc-admin-meta {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.65rem;
                }
                @media (max-width: 700px) {
                    .atc-admin-meta {
                        grid-template-columns: 1fr;
                    }
                }
                .atc-admin-meta label {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    font-size: 0.78rem;
                    color: var(--muted);
                    font-weight: 700;
                }
                .atc-admin-meta input,
                .atc-admin-meta select {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0.5rem 0.65rem;
                    border-radius: 9px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: #0a0e13;
                    color: #e8f0ea;
                    font: inherit;
                }
                .atc-panel textarea {
                    resize: vertical;
                    min-height: 90px;
                }
            `}</style>
        </div>
    );
}
