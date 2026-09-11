import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminBookingCalendar from "../components/AdminBookingCalendar";
import AdminTeacherConsole from "../components/AdminTeacherConsole";
import AdminWorkingHoursEditor from "../components/AdminWorkingHoursEditor";
import BookingAttachments from "../components/BookingAttachments";
import ProfilePanel from "../components/ProfilePanel";
import { isAdminEmail } from "../utils/admin";
import { isTestAuthUser } from "../utils/testLogin";
import { checkAppEmailVerified, skipEmailVerification } from "../utils/authUserDoc";
import {
    gameUrlForAssignedTask,
    loadStudentAssignedTasks,
    type AssignedTaskDoc,
} from "../utils/assignedTasks";
import { paymentStatusLabel } from "../utils/bookingNotify";
import {
    EDUCATION_LEVELS,
    getTopicsForEducationLevel,
    type EducationLevelId,
    type ErettsegiExamLevel,
} from "../utils/mathTopicsCatalog";
import {
    resolveProgressStorageKey,
    touchDailyJuice,
} from "../utils/practiceProgress";
import type { GameJuiceState } from "../utils/gameJuice";
import SkillTreePanel from "../components/SkillTreePanel";
import { countDueSrs } from "../utils/srs";
import { PATH_LESSON_COUNT } from "../utils/topicPath";
import {
    buildBlitzHref,
    buildChallengeHref,
    buildDailyPracticeHref,
    buildTopicStatsHref,
    indexBestSessionsByTopic,
    lookupBestSessionForTopic,
    type RawGameResult,
} from "../utils/topicStats";
import { useLang } from "../utils/i18n";
import { waitForFirebase } from "../utils/firebaseReady";
import { agentDebugLog } from "../utils/agentDebugLog";

type DashboardTab = "tanulas" | "profil" | "admin";

type UserDoc = {
    uid?: string;
    name?: string;
    email?: string;
};

type MathTopic = {
    id: string;
    title: string;
    completed: number;
    total: number;
    color: string;
    icon: string;
    correctAnswers: number;
    wrongAnswers: number;
    totalAnswers: number;
    lessonsCompleted?: number;
    pathCompleted?: boolean;
};

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLang();

    const topicLabel = (id: string, fallback: string) => {
        const key = `dashboard.topic.${id}`;
        const translated = t(key);
        if (translated !== key) return translated;
        const base = id.replace(/-emelt$/, '');
        if (base !== id) {
            const baseKey = `dashboard.topic.${base}`;
            const baseTranslated = t(baseKey);
            if (baseTranslated !== baseKey) return baseTranslated;
        }
        return fallback;
    };

    const [loading, setLoading] = useState(true);
    const [me, setMe] = useState<UserDoc | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [educationLevel, setEducationLevel] = useState<EducationLevelId>('university');
    const [highschoolGrade, setHighschoolGrade] = useState(11);
    const [elementaryGrade, setElementaryGrade] = useState(1);
    const [erettsegiExamLevel, setErettsegiExamLevel] = useState<ErettsegiExamLevel>('emelt');
    const [erettsegiPrepPath, setErettsegiPrepPath] = useState<'choose' | 'topics'>('choose');
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<DashboardTab>("tanulas");
    const [publicTasks, setPublicTasks] = useState<any[]>([]);
    const [assignedTasks, setAssignedTasks] = useState<AssignedTaskDoc[]>([]);
    const [pendingBookings, setPendingBookings] = useState<any[]>([]);
    const [proposeDraft, setProposeDraft] = useState<Record<string, { date: string; time: string }>>({});
    const [emailStatus, setEmailStatus] = useState<{
        ready?: boolean;
        mode?: string;
        hint?: string;
        hasGmail?: boolean;
        adminEmail?: string;
        siteUrl?: string | null;
    } | null>(null);
    const [emailTestLoading, setEmailTestLoading] = useState(false);
    const [reminderLoading, setReminderLoading] = useState(false);
    const [reminderInfo, setReminderInfo] = useState<string | null>(null);
    const [workingHoursVersion, setWorkingHoursVersion] = useState(0);
    const [srsDueCount, setSrsDueCount] = useState(0);
    const [juice, setJuice] = useState<GameJuiceState | null>(null);
    const [practiceXp, setPracticeXp] = useState(0);
    const [showNewTopicForm, setShowNewTopicForm] = useState(false);
    const [newTopic, setNewTopic] = useState({
        title: '',
        icon: '📚',
        color: '#39ff14'
    });

    const catalogToMathTopics = (level: EducationLevelId, examLevel: ErettsegiExamLevel): MathTopic[] =>
        getTopicsForEducationLevel(
            level,
            examLevel,
            level === 'highschool' ? highschoolGrade : level === 'elementary' ? elementaryGrade : undefined
        ).map((t) => ({
            ...t,
            completed: 0,
            total: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalAnswers: 0,
            lessonsCompleted: 0,
            pathCompleted: false,
        }));

    const [mathTopics, setMathTopics] = useState<MathTopic[]>([]);

    useEffect(() => {
        const savedLevel = localStorage.getItem('educationLevel') as EducationLevelId | null;
        if (
            savedLevel === 'elementary' ||
            savedLevel === 'highschool' ||
            savedLevel === 'university' ||
            savedLevel === 'erettsegi'
        ) {
            setEducationLevel(savedLevel);
        }
        const savedExam = localStorage.getItem('erettsegiExamLevel') as ErettsegiExamLevel | null;
        if (savedExam === 'kozep' || savedExam === 'emelt') {
            setErettsegiExamLevel(savedExam);
        }
        const savedHs = parseInt(localStorage.getItem('highschoolGrade') || '', 10);
        if (savedHs >= 9 && savedHs <= 12) setHighschoolGrade(savedHs);
        const savedEl = parseInt(localStorage.getItem('elementaryGrade') || '', 10);
        if (savedEl >= 1 && savedEl <= 8) setElementaryGrade(savedEl);
    }, []);

    useEffect(() => {
        const next = catalogToMathTopics(educationLevel, erettsegiExamLevel);
        // #region agent log
        if (educationLevel === 'highschool') {
            agentDebugLog({
                hypothesisId: 'H1',
                location: 'dashboard.tsx:loadTopics',
                message: 'highschool topics for grade',
                data: {
                    grade: highschoolGrade,
                    n: next.length,
                    ids: next.map((t) => t.id),
                },
                runId: 'hs11-oh',
            });
        }
        // #endregion
        loadTopicsWithGameResults(next);
    }, [educationLevel, erettsegiExamLevel, highschoolGrade, elementaryGrade]);

    useEffect(() => {
        let unsub: (() => void) | undefined;
        let cancelled = false;

        const checkAuth = async () => {
            const firebase = await waitForFirebase();
            if (cancelled) return;

            if (!firebase) {
                setError("Firebase nem elérhető.");
                setLoading(false);
                return;
            }

            try {
                const auth = firebase.auth();
                unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (cancelled) return;
                    if (!user) {
                        // #region agent log
                        agentDebugLog({
                            hypothesisId: 'D',
                            location: 'dashboard.tsx:auth-null',
                            message: 'dashboard auth null',
                            data: { path: router.pathname, queryTab: String(router.query.tab || '') },
                            runId: 'social-login',
                        });
                        // #endregion
                        setMe(null);
                        setIsAdmin(false);
                        setLoading(false);
                        if (router.pathname === '/dashboard') {
                            let justOut = false;
                            try {
                                justOut = sessionStorage.getItem('mihaszna:justLoggedOut') === '1';
                                if (justOut) sessionStorage.removeItem('mihaszna:justLoggedOut');
                            } catch {
                                /* ignore */
                            }
                            router.replace(justOut ? '/' : '/?auth=1');
                        }
                        return;
                    }

                    // E-mail/jelszó fiókoknál kötelező a megerősített e-mail (teszt fiók kivétel)
                    const isPasswordUser = (user.providerData || []).some(
                        (p: any) => p?.providerId === 'password'
                    );
                    if (
                        isPasswordUser &&
                        !skipEmailVerification() &&
                        !isTestAuthUser(user) &&
                        !isAdminEmail(user.email)
                    ) {
                        const verified =
                            Boolean(user.emailVerified) ||
                            (await checkAppEmailVerified(user));
                        if (!verified) {
                            // #region agent log
                            agentDebugLog({
                                hypothesisId: 'E',
                                location: 'dashboard.tsx:unverified',
                                message: 'dashboard signed out unverified',
                                data: { uid: user.uid },
                                runId: 'social-login',
                            });
                            // #endregion
                            setMe(null);
                            setIsAdmin(false);
                            setLoading(false);
                            try {
                                await auth.signOut();
                            } catch {
                                /* ignore */
                            }
                            router.replace('/?auth=1&verify=1');
                            return;
                        }
                    }

                    setMe({
                        uid: user.uid,
                        name: user.displayName || '',
                        email: user.email || '',
                    });
                    setIsAdmin(isAdminEmail(user.email));
                    setLoading(false);
                });
            } catch (err) {
                setError("Hiba történt.");
                setLoading(false);
            }
        };

        void checkAuth();
        return () => {
            cancelled = true;
            if (unsub) unsub();
        };
    }, [router]);

    useEffect(() => {
        if (!me?.uid) {
            setAssignedTasks([]);
            return;
        }
        let cancelled = false;
        (async () => {
            const list = await loadStudentAssignedTasks(me.uid!, me.email);
            if (!cancelled) setAssignedTasks(list);
        })();
        return () => {
            cancelled = true;
        };
    }, [me?.uid, me?.email]);

    useEffect(() => {
        if (!router.isReady) return;
        const tab = router.query.tab;
        if (tab === 'admin') {
            if (!isAdmin) {
                setActiveTab('tanulas');
                return;
            }
            setActiveTab('admin');
            return;
        }
        if (tab === 'profil') {
            setActiveTab('profil');
            return;
        }
        if (tab === 'tanulas') {
            setActiveTab('tanulas');
            return;
        }
        // Admin alapból a tanári konzolra érkezik (üres tab)
        if (isAdmin && (tab === undefined || tab === '')) {
            setActiveTab('admin');
            void router.replace(
                { pathname: '/dashboard', query: { tab: 'admin' } },
                undefined,
                { shallow: true }
            );
            return;
        }
        setActiveTab('tanulas');
    }, [router.isReady, router.query.tab, isAdmin, router]);

    const switchTab = (tab: DashboardTab) => {
        if (tab === 'admin' && !isAdmin) return;
        setActiveTab(tab);
        const query =
            tab === 'admin'
                ? { tab: 'admin' }
                : tab === 'tanulas' && isAdmin
                  ? { tab: 'tanulas' }
                  : tab === 'tanulas'
                    ? {}
                    : { tab };
        router.replace({ pathname: '/dashboard', query }, undefined, { shallow: true });
    };

    useEffect(() => {
        // Load public tasks for current education level
        const loadPublicTasks = async () => {
            if (!(window as any).firebase) return;
            if (educationLevel === 'erettsegi') {
                setPublicTasks([]);
                return;
            }

            try {
                const db = (window as any).firebase.firestore();
                const snapshot = await db.collection('publicTasks')
                    .where('educationLevel', '==', educationLevel)
                    .where('isActive', '==', true)
                    .get();

                const tasks: any[] = [];
                snapshot.forEach((doc: any) => {
                    tasks.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                console.log('Loaded public tasks for', educationLevel, ':', tasks.length);
                setPublicTasks(tasks);
            } catch (error: any) {
                const msg = String(error?.message || error || '');
                if (!/permission|insufficient/i.test(msg)) {
                    console.warn('Error loading public tasks:', msg.slice(0, 160));
                }
            }
        };

        loadPublicTasks();
    }, [educationLevel]);


    // EmailJS initialization for automatic email sending
    useEffect(() => {
        if (typeof window !== 'undefined' && window.emailjs) {
            window.emailjs.init("_UgC1pw0jHHqLl6sG");
            console.log('🔵 EmailJS inicializálva dashboard-ban');
        }
    }, []);

    // Pending foglalások: csak admin API (nincs kliens Firestore / onSnapshot)
    useEffect(() => {
        if (!isAdmin || typeof window === 'undefined') return;

        let unsub: (() => void) | undefined;
        let cancelled = false;

        const applyList = (list: any[]) => {
            const sorted = [...list].sort(
                (a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
            );
            setPendingBookings(sorted);
            try {
                localStorage.setItem('pendingBookings', JSON.stringify(sorted));
            } catch {
                // ignore
            }

            if (sorted.length > 0) {
                const lastNotification = localStorage.getItem('lastBookingNotification');
                const latestBooking = sorted[0];
                if (!lastNotification || lastNotification !== latestBooking.id) {
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('🚨 Új foglalási kérés!', {
                            body: `${latestBooking.customerName} foglalt időpontot ${new Date(latestBooking.date).toLocaleDateString('hu-HU')} napra`,
                            icon: '/favicon.ico',
                            tag: 'booking-notification',
                        });
                    }
                    localStorage.setItem('lastBookingNotification', latestBooking.id);
                }
            }
        };

        const start = async () => {
            const {
                loadPendingBookingsFromFirestore,
                isPendingBookingsDenied,
            } = await import('../utils/bookingNotify');

            // Már tudjuk, hogy rules tilt — ne kérdezzük újra (terminál scrollozik)
            if (isPendingBookingsDenied()) return;

            // Várj auth tokenre (különben 401 spam)
            const fb = (window as any).firebase;
            const auth = fb?.auth?.();
            if (auth && !auth.currentUser) {
                await new Promise<void>((resolve) => {
                    let unsubAuth: (() => void) | undefined;
                    const t = setTimeout(() => {
                        unsubAuth?.();
                        resolve();
                    }, 4000);
                    unsubAuth = auth.onAuthStateChanged((u: unknown) => {
                        if (!u) return;
                        clearTimeout(t);
                        unsubAuth?.();
                        resolve();
                    });
                });
            }

            if (cancelled || isPendingBookingsDenied()) return;

            const initial = await loadPendingBookingsFromFirestore();
            if (!cancelled) applyList(initial);

            // Rules / setup hiány → ne spameljük a hálózatot
            if (isPendingBookingsDenied()) return;

            const interval = setInterval(async () => {
                if (isPendingBookingsDenied() || cancelled) {
                    clearInterval(interval);
                    return;
                }
                const list = await loadPendingBookingsFromFirestore();
                if (!cancelled) applyList(list);
                if (isPendingBookingsDenied()) clearInterval(interval);
            }, 15000);
            unsub = () => clearInterval(interval);
        };

        void start();

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            cancelled = true;
            if (unsub) unsub();
        };
    }, [isAdmin]);

    useEffect(() => {
        if (!isAdmin) return;
        (async () => {
            try {
                const { apiEmailStatus } = await import('../utils/apiClient');
                const res = await apiEmailStatus();
                if (res.ok) setEmailStatus(res.data);
                else setEmailStatus({ ready: false, hint: res.error });
            } catch {
                setEmailStatus({ ready: false, hint: 'Nem sikerült lekérni az e-mail állapotot.' });
            }
        })();
    }, [isAdmin]);

    const sendTestBookingEmail = async () => {
        if (!me?.email) return;
        setEmailTestLoading(true);
        try {
            const { sendBookingEmailFromClient } = await import('../utils/bookingNotify');
            const result = await sendBookingEmailFromClient('admin_new', {
                id: `booking_test_${Date.now()}`,
                date: new Date().toISOString().slice(0, 10),
                times: ['12:00'],
                customerName: me.name || 'Admin teszt',
                customerEmail: me.email,
                lessonType: 'online',
                selectedSubject: 'E-mail teszt',
                hobby: 'Dashboard tesztküldés',
                totalPrice: 0,
                submittedAt: new Date().toISOString(),
            });
            if (result.ok) {
                alert(`Teszt e-mail elküldve (${result.provider}). Nézd a(z) ${me.email} és usezsolti@gmail.com postaládát / Spam mappát.`);
            } else {
                alert(`Teszt e-mail nem ment el:\n\n${result.error || 'Ismeretlen hiba'}`);
            }
            const { apiEmailStatus } = await import('../utils/apiClient');
            const statusRes = await apiEmailStatus();
            if (statusRes.ok) setEmailStatus(statusRes.data);
        } catch (err: any) {
            alert(err?.message || 'Tesztküldés sikertelen');
        } finally {
            setEmailTestLoading(false);
        }
    };

    const runLessonReminders = async (opts?: { silent?: boolean }) => {
        if (!isAdmin) return;
        setReminderLoading(true);
        try {
            const { processLessonReminders, getBudapestDateKeyOffset } = await import('../utils/bookingNotify');
            const result = await processLessonReminders();
            const msg =
                result.candidates === 0
                    ? `Nincs holnapi (${result.dateKey}) jóváhagyott óra emlékeztető nélkül.`
                    : `Emlékeztetők (${result.dateKey}): ${result.sent} elküldve` +
                      (result.failed ? `, ${result.failed} sikertelen` : '') +
                      '.';
            setReminderInfo(msg);
            if (!opts?.silent) {
                alert(
                    result.failed
                        ? `${msg}\n\n${result.errors.slice(0, 5).join('\n')}`
                        : msg
                );
            }
            // Csak ha nincs mit küldeni, vagy sikerült legalább egy — különben újrapróbálható
            if (result.candidates === 0 || result.sent > 0) {
                try {
                    localStorage.setItem(
                        `remindersRan_${getBudapestDateKeyOffset(0)}`,
                        String(Date.now())
                    );
                } catch {
                    // ignore
                }
            }
        } catch (err: any) {
            const msg = err?.message || 'Emlékeztető küldés sikertelen';
            setReminderInfo(msg);
            if (!opts?.silent) alert(msg);
        } finally {
            setReminderLoading(false);
        }
    };

    // Admin belépéskor (bármelyik fül): naponta egyszer kiküldi a holnapi emlékeztetőket
    useEffect(() => {
        if (!isAdmin || loading || typeof window === 'undefined') return;
        let cancelled = false;
        (async () => {
            try {
                const { getBudapestDateKeyOffset } = await import('../utils/bookingNotify');
                const todayKey = getBudapestDateKeyOffset(0);
                const ran = localStorage.getItem(`remindersRan_${todayKey}`);
                if (ran) return;
                if (cancelled) return;
                await runLessonReminders({ silent: true });
            } catch {
                // ignore auto
            }
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin, loading]);

    useEffect(() => {
        if (loading || typeof window === 'undefined') return;
        const head = document.querySelector('.dash-contact-head');
        const nav = document.querySelector('nav.site-navbar');
        const links = document.querySelector('.nav-links');
        const hs = head ? window.getComputedStyle(head) : null;
        const ns = nav ? window.getComputedStyle(nav) : null;
        const ls = links ? window.getComputedStyle(links) : null;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H70',
            location: 'dashboard.tsx:layoutProbe',
            message: 'dashboard contact/nav computed layout',
            data: {
                host: window.location.host,
                innerWidth: window.innerWidth,
                headTag: head?.tagName || null,
                headPosition: hs?.position || null,
                headDisplay: hs?.display || null,
                headMinHeight: hs?.minHeight || null,
                headBg: (hs?.backgroundColor || '').slice(0, 40),
                headWidth: hs?.width || null,
                navOverflow: ns?.overflow || null,
                linksWrap: ls?.flexWrap || null,
                linksDir: ls?.flexDirection || null,
                path: window.location.pathname,
            },
            runId: 'dash-layout',
        });
        // #endregion
    }, [loading, activeTab]);

    const approveBooking = async (bookingId: string) => {
        const booking = pendingBookings.find((b) => b.id === bookingId);
        if (!booking) return;

        const updated = pendingBookings.filter((b) => b.id !== bookingId);
        setPendingBookings(updated);

        const { updateBookingStatus, sendBookingEmailFromClient } = await import('../utils/bookingNotify');
        const saved = await updateBookingStatus(bookingId, 'approved', booking);
        const emailed = await sendBookingEmailFromClient('student_approved', booking);

        if (!saved) {
            alert('A jóváhagyás részben sikerült (Firestore hiba). Ellenőrizd a kapcsolatot.');
            return;
        }
        alert(
            emailed.ok
                ? 'Foglalás jóváhagyva! A diák e-mailt kapott.'
                : `Foglalás jóváhagyva, de a diák e-mail nem ment el.\n\n${emailed.error || 'Próbáld a „Email Másolása” gombot.'}`
        );
    };

    const proposeOtherTime = async (bookingId: string) => {
        const booking = pendingBookings.find((b) => b.id === bookingId);
        if (!booking) return;
        const draft = proposeDraft[bookingId] || { date: booking.date, time: (booking.times || [])[0] || '17:00' };
        if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || !/^\d{2}:\d{2}$/.test(draft.time)) {
            alert('Adj meg dátumot és időt (óra:perc).');
            return;
        }
        const { apiPostAuth } = await import('../utils/apiClient');
        const res = await apiPostAuth('/api/booking-proposal', {
            action: 'propose',
            booking,
            date: draft.date,
            times: [draft.time],
        });
        if (!res.ok) {
            alert(res.error || 'A javaslat nem ment ki.');
            return;
        }
        alert('A diáknak kiment a másik időpont. Ha elfogadja, kapsz emailt.');
    };

    const rejectBooking = async (bookingId: string) => {
        const booking = pendingBookings.find((b) => b.id === bookingId);
        if (!booking) return;

        const updated = pendingBookings.filter((b) => b.id !== bookingId);
        setPendingBookings(updated);

        const { updateBookingStatus, sendBookingEmailFromClient } = await import('../utils/bookingNotify');
        const saved = await updateBookingStatus(bookingId, 'rejected', booking);
        const emailed = await sendBookingEmailFromClient('student_rejected', booking);

        if (!saved) {
            alert('Az elutasítás részben sikerült (Firestore hiba).');
            return;
        }
        alert(
            emailed.ok
                ? 'Foglalás elutasítva. A diák e-mailt kapott.'
                : `Foglalás elutasítva, de a diák e-mail nem ment el.\n\n${emailed.error || ''}`
        );
    };
    const loadTopicsWithGameResults = async (baseTopics: MathTopic[]) => {
        const zeroed = (topics: MathTopic[]) =>
            topics.map((topic) => ({
                ...topic,
                completed: 0,
                total: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                totalAnswers: 0,
                lessonsCompleted: 0,
                pathCompleted: false,
            }));

        try {
            if (!(window as any).firebase) {
                setMathTopics(zeroed(baseTopics));
                return;
            }

            const uid = (window as any).firebase.auth().currentUser?.uid || '';

            if (!uid) {
                setMathTopics(zeroed(baseTopics));
                return;
            }

            let gameResultsSnapshot: { forEach: (cb: (doc: any) => void) => void; empty?: boolean };
            try {
                const { fetchGameResultsForUser } = await import('../utils/gameResultsClient');
                const loaded = await fetchGameResultsForUser(uid);
                const docs = loaded.results;
                gameResultsSnapshot = {
                    empty: docs.length === 0,
                    forEach: (cb) => {
                        docs.forEach((row) => {
                            const { id, ...data } = row;
                            cb({ id, data: () => data });
                        });
                    },
                };
            } catch (err) {
                console.warn('gameResults load failed:', err);
                gameResultsSnapshot = { forEach: () => undefined, empty: true };
            }

            const rows: RawGameResult[] = [];
            gameResultsSnapshot.forEach((doc: any) => {
                rows.push({ id: doc.id, ...doc.data() });
            });
            const bestByKey = indexBestSessionsByTopic(rows);

            let practiceTopics: Record<string, { lessonsCompleted?: number[]; completed?: boolean }> = {};
            try {
                const progress = await touchDailyJuice(uid || null);
                practiceTopics = progress.topics || {};
                setSrsDueCount(countDueSrs(progress.srs));
                setJuice(progress.juice || null);
                setPracticeXp(progress.xp || 0);
                // #region agent log
                agentDebugLog({
                    hypothesisId: 'D',
                    location: 'dashboard.tsx:touchDailyJuice',
                    message: 'skill tree loaded',
                    data: {
                        xp: progress.xp || 0,
                        shop: progress.juice?.skillShop || '',
                        unlocked: progress.juice?.unlockedSkills || [],
                        unlockedN: (progress.juice?.unlockedSkills || []).length,
                    },
                    runId: 'skill-xp',
                });
                // #endregion
            } catch (err) {
                console.error('Error loading practice progress:', err);
            }

            const topicsWithResults = baseTopics.map((topic) => {
                const result = lookupBestSessionForTopic(bestByKey, topic.id);
                const key = resolveProgressStorageKey(topic.id);
                const tp = practiceTopics[key];
                const lessonsCompleted = tp?.lessonsCompleted?.length || 0;
                const pathCompleted = !!tp?.completed;

                if (result) {
                    return {
                        ...topic,
                        completed: Math.min(result.correct, result.total),
                        total: result.total,
                        correctAnswers: result.correct,
                        wrongAnswers: Math.max(0, result.total - result.correct),
                        totalAnswers: result.total,
                        lessonsCompleted,
                        pathCompleted,
                    };
                }
                return {
                    ...topic,
                    completed: 0,
                    total: 0,
                    correctAnswers: 0,
                    wrongAnswers: 0,
                    totalAnswers: 0,
                    lessonsCompleted,
                    pathCompleted,
                };
            });

            setMathTopics(topicsWithResults);
        } catch (error) {
            console.error('Error loading game results:', error);
            setMathTopics(zeroed(baseTopics));
        }
    };

    const percent = (completed: number, total: number) => total === 0 ? 0 : Math.round((completed / total) * 100);

    const updateTopicProgress = (topicId: string, addTask: boolean = false) => {
        setMathTopics(prev => {
            const updated = prev.map(topic =>
                topic.id === topicId
                    ? {
                        ...topic,
                        total: addTask ? topic.total + 1 : topic.total,
                        completed: addTask ? topic.completed : Math.min(topic.completed + 1, topic.total)
                    }
                    : topic
            );

            const progressData: { [key: string]: { completed: number, total: number } } = {};
            updated.forEach(topic => {
                progressData[topic.id] = { completed: topic.completed, total: topic.total };
            });
            localStorage.setItem(`mathTopicsProgress_${educationLevel}`, JSON.stringify(progressData));

            return updated;
        });
    };

    const addNewTask = (topicId: string) => {
        updateTopicProgress(topicId, true);
    };

    const simulateTaskCompletion = (topicId: string) => {
        updateTopicProgress(topicId);
    };

    const navigateToTopicStats = (topicId: string) => {
        router.push(
            buildTopicStatsHref(
                topicId,
                educationLevel,
                erettsegiExamLevel,
                educationLevel === 'elementary' ? elementaryGrade : highschoolGrade
            )
        );
    };

    const addNewTopic = () => {
        if (!newTopic.title.trim()) return;

        const topicId = newTopic.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const newTopicData = {
            id: topicId,
            title: newTopic.title,
            completed: 0,
            total: 0,
            color: newTopic.color,
            icon: newTopic.icon,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalAnswers: 0
        };

        // Hozzáadás a jelenlegi témakörök listájához
        setMathTopics((prev: MathTopic[]) => [...prev, newTopicData]);

        // Form reset
        setNewTopic({
            title: '',
            icon: '📚',
            color: '#39ff14'
        });
        setShowNewTopicForm(false);
    };

    const toggleNewTopicForm = () => {
        setShowNewTopicForm(!showNewTopicForm);
    };

    const overallAnswers = mathTopics.reduce((s, x) => s + x.totalAnswers, 0);
    const overallPct =
        overallAnswers > 0
            ? Math.round((mathTopics.reduce((s, x) => s + x.correctAnswers, 0) / overallAnswers) * 100)
            : 0;

    // Email küldő funkciók


    if (loading) {
        return (
            <div className="dashboard-container modern-theme">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>{t('dashboard.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container modern-theme">
                <div className="error-screen">
                    <h2>{t('dashboard.error')}</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container modern-theme has-site-navbar">
            {/* Main Content */}
            <main className="main-content">
                {activeTab === 'admin' && isAdmin && (
                    <AdminTeacherConsole
                        adminUid={me?.uid}
                        adminEmail={me?.email}
                        initialTab={
                            router.query.view === 'tasks'
                                ? 'tasks'
                                : router.query.view === 'lessons'
                                  ? 'lessons'
                                  : 'schedule'
                        }
                        schedulePanel={({ createLobbyFromBooking, lobbyBusy }) => (
                            <>
                        {emailStatus && (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.65rem',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'rgba(18, 24, 33, 0.9)',
                                border: '1px solid rgba(57,255,20,0.25)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                margin: '0 0 1rem',
                                color: '#ddd',
                                fontSize: '0.9rem',
                            }}>
                                <span>
                                    E-mail:{' '}
                                    <strong style={{ color: emailStatus.hasGmail ? '#39ff14' : '#ff69b4' }}>
                                        {emailStatus.hasGmail ? 'kész' : 'nincs beállítva'}
                                    </strong>
                                    {reminderInfo ? (' - ' + reminderInfo) : ''}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        onClick={sendTestBookingEmail}
                                        disabled={emailTestLoading || !emailStatus.hasGmail}
                                        className="atc-inline-btn"
                                        style={{
                                            background: 'rgba(57,255,20,0.12)',
                                            color: '#39ff14',
                                            border: '1px solid #39ff14',
                                            borderRadius: '8px',
                                            padding: '0.4rem 0.75rem',
                                            fontWeight: 700,
                                            cursor: emailTestLoading || !emailStatus.hasGmail ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {emailTestLoading ? '…' : 'Teszt e-mail'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => runLessonReminders()}
                                        disabled={reminderLoading || !emailStatus.hasGmail}
                                        style={{
                                            background: 'rgba(57,255,20,0.12)',
                                            color: '#39ff14',
                                            border: '1px solid #39ff14',
                                            borderRadius: '8px',
                                            padding: '0.4rem 0.75rem',
                                            fontWeight: 700,
                                            cursor: reminderLoading || !emailStatus.hasGmail ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {reminderLoading ? '…' : 'Holnapi emlékeztető'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <AdminWorkingHoursEditor
                            onSaved={() => setWorkingHoursVersion((v) => v + 1)}
                        />

                        <AdminBookingCalendar
                            key={workingHoursVersion}
                            lobbyBusy={lobbyBusy}
                            onCreateLobby={(booking) => void createLobbyFromBooking(booking)}
                            onChanged={async () => {
                                const { loadPendingBookingsFromFirestore } = await import('../utils/bookingNotify');
                                const list = await loadPendingBookingsFromFirestore();
                                setPendingBookings(list);
                            }}
                        />

                        {pendingBookings.length > 0 ? (
                            <section className="pending-bookings-section">
                                <h2 className="section-title">Függő foglalások</h2>
                                <div className="pending-bookings-grid">
                                    {pendingBookings.map(booking => (
                                        <div key={booking.id} className="pending-booking-card">
                                            <div className="booking-header">
                                                <h3>{new Date(booking.date).toLocaleDateString('hu-HU')}</h3>
                                                <span className="booking-status pending">Függőben</span>
                                            </div>
                                            <div className="booking-content">
                                                <div className="booking-info">
                                                    <p><strong>Név:</strong> {booking.customerName}</p>
                                                    <p><strong>Email:</strong> {booking.customerEmail}</p>
                                                    <p><strong>Idő:</strong> {(booking.times || []).join(', ')}</p>
                                                    <p><strong>Típus:</strong> {booking.lessonType === 'online' ? 'Online' : 'Személyes'}</p>
                                                    <p><strong>Szint:</strong> {booking.selectedSubject}</p>
                                                    {booking.preparingForLabel || booking.preparingFor ? (
                                                        <p>
                                                            <strong>Mire készül:</strong>{' '}
                                                            {booking.preparingForLabel || booking.preparingFor}
                                                        </p>
                                                    ) : null}
                                                    {(booking.topicTitle || (booking.hobby && booking.hobby !== '—')) ? (
                                                        <p>
                                                            <strong>Konkrét téma:</strong>{' '}
                                                            {booking.topicTitle || booking.hobby}
                                                        </p>
                                                    ) : null}
                                                    {booking.topicNote ? (
                                                        <p><strong>Megjegyzés:</strong> {booking.topicNote}</p>
                                                    ) : null}
                                                    {booking.lessonPack?.title ? (
                                                        <p>
                                                            <strong>Óraanyag:</strong>{' '}
                                                            {booking.lessonPack.title}
                                                            {booking.lessonPack.content ? (
                                                                <button
                                                                    type="button"
                                                                    style={{
                                                                        marginLeft: 8,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={async () => {
                                                                        const { downloadLessonPackPdf } =
                                                                            await import('../utils/lessonPackPdf');
                                                                        downloadLessonPackPdf(
                                                                            booking.lessonPack!.content!,
                                                                            `oraanyag-${booking.topicTitle || 'matek'}`
                                                                        );
                                                                    }}
                                                                >
                                                                    PDF
                                                                </button>
                                                            ) : null}
                                                        </p>
                                                    ) : null}
                                                    <p><strong>Ár:</strong> {booking.totalPrice} Ft</p>
                                                    <p>
                                                        <strong>Fizetés:</strong>{' '}
                                                        {paymentStatusLabel(booking.paymentStatus)}
                                                    </p>
                                                    <BookingAttachments files={booking.uploadedFiles} />
                                                </div>
                                                <div className="booking-actions">
                                                    <button className="approve-btn" onClick={() => approveBooking(booking.id)}>
                                                        Jóváhagyás
                                                    </button>
                                                    <button className="reject-btn" onClick={() => rejectBooking(booking.id)}>
                                                        Elutasítás
                                                    </button>
                                                    <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.4rem' }}>
                                                        <input
                                                            type="date"
                                                            value={proposeDraft[booking.id]?.date || booking.date}
                                                            onChange={(e) =>
                                                                setProposeDraft((prev) => ({
                                                                    ...prev,
                                                                    [booking.id]: {
                                                                        date: e.target.value,
                                                                        time:
                                                                            prev[booking.id]?.time ||
                                                                            (booking.times || [])[0] ||
                                                                            '17:00',
                                                                    },
                                                                }))
                                                            }
                                                        />
                                                        <input
                                                            type="time"
                                                            value={
                                                                proposeDraft[booking.id]?.time ||
                                                                (booking.times || [])[0] ||
                                                                '17:00'
                                                            }
                                                            onChange={(e) =>
                                                                setProposeDraft((prev) => ({
                                                                    ...prev,
                                                                    [booking.id]: {
                                                                        date: prev[booking.id]?.date || booking.date,
                                                                        time: e.target.value,
                                                                    },
                                                                }))
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            className="approve-btn"
                                                            onClick={() => void proposeOtherTime(booking.id)}
                                                        >
                                                            Másik időpontot javaslok
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="approve-btn"
                                                        disabled={lobbyBusy}
                                                        onClick={() => void createLobbyFromBooking(booking)}
                                                        style={{ background: 'linear-gradient(135deg,#39ff14,#b8ff5a)', color: '#061008', border: 'none' }}
                                                    >
                                                        Lobby
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#a0a0a0' }}>Nincs függő foglalás.</p>
                        )}
                            </>
                        )}
                    />
                )}
                {activeTab === 'profil' && (
                    <section className="dash-profile-tab">
                        <button
                            type="button"
                            className="erettsegi-prep-back"
                            onClick={() => switchTab('tanulas')}
                        >
                            {t('dashboard.backToPractice')}
                        </button>
                        <ProfilePanel embedded />
                        {juice && (
                            <>
                                <SkillTreePanel
                                    juice={juice}
                                    xp={practiceXp}
                                    onStart={(id) => {
                                        router.push(buildChallengeHref(id, educationLevel, erettsegiExamLevel));
                                    }}
                                />
                                <div className="dash-juice">
                                    <div className="dash-juice-streak">
                                        🔥 {juice.loginStreak} {t('dashboard.loginStreak')}
                                        {juice.blitzBest > 0 ? ` · ⚡ ${juice.blitzBest}` : ''}
                                    </div>
                                    <div className="dash-quests">
                                        {juice.quests.map((q) => (
                                            <div
                                                key={q.id}
                                                className={`dash-quest ${q.done ? 'done' : ''}`}
                                            >
                                                <span>{q.title}</span>
                                                <b>{q.progress}/{q.target}</b>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                )}
                {activeTab === 'tanulas' && (
                <>
                {/* Education Level Selector — categories first */}
                <section className="education-level-section">
                    <h3 className="level-title">
                        {t('dashboard.chooseCategory')}
                    </h3>
                    <div className="level-selector level-selector--cats">
                        {EDUCATION_LEVELS.map((level) => (
                            <button
                                key={level.id}
                                className={`level-btn ${educationLevel === level.id ? 'active' : ''}`}
                                onClick={() => {
                                    setEducationLevel(level.id);
                                    localStorage.setItem('educationLevel', level.id);
                                    setErettsegiPrepPath(level.id === 'erettsegi' ? 'choose' : 'topics');
                                }}
                            >
                                <span style={{ display: 'block', fontSize: '1.35rem' }}>{level.emoji}</span>
                                {t(`dashboard.level.${level.id}`)}
                                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.75, fontWeight: 500 }}>
                                    {t(`dashboard.level.${level.id}Desc`)}
                                </span>
                            </button>
                        ))}
                        <button
                            type="button"
                            className="level-btn level-btn-kozponti"
                            onClick={() => {
                                // #region agent log
                                agentDebugLog({
                                    hypothesisId: 'K',
                                    location: 'dashboard.tsx:kozpontiCard',
                                    message: 'kozponti category opened',
                                    data: { href: '/kozponti-felkeszules' },
                                    runId: 'kozponti-dash',
                                });
                                // #endregion
                                router.push('/kozponti-felkeszules');
                            }}
                        >
                            <span style={{ display: 'block', fontSize: '1.35rem' }}>🎯</span>
                            {t('dashboard.level.kozponti')}
                            <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.75, fontWeight: 500 }}>
                                {t('dashboard.level.kozpontiDesc')}
                            </span>
                        </button>
                    </div>
                    {educationLevel === 'elementary' && (
                        <div className="level-selector" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                                <button
                                    key={g}
                                    className={`level-btn ${elementaryGrade === g ? 'active' : ''}`}
                                    onClick={() => {
                                        setElementaryGrade(g);
                                        localStorage.setItem('elementaryGrade', String(g));
                                    }}
                                >
                                    {g}. osztály
                                </button>
                            ))}
                        </div>
                    )}
                    {educationLevel === 'highschool' && (
                        <div className="level-selector" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
                            {[9, 10, 11, 12].map((g) => (
                                <button
                                    key={g}
                                    className={`level-btn ${highschoolGrade === g ? 'active' : ''}`}
                                    onClick={() => {
                                        setHighschoolGrade(g);
                                        localStorage.setItem('highschoolGrade', String(g));
                                    }}
                                >
                                    {g}. osztály
                                </button>
                            ))}
                        </div>
                    )}
                    {educationLevel === 'erettsegi' && (
                        <div className="level-selector" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
                            <button
                                className={`level-btn ${erettsegiExamLevel === 'kozep' ? 'active' : ''}`}
                                onClick={() => {
                                    setErettsegiExamLevel('kozep');
                                    localStorage.setItem('erettsegiExamLevel', 'kozep');
                                }}
                            >
                                {t('dashboard.exam.kozep')}
                            </button>
                            <button
                                className={`level-btn ${erettsegiExamLevel === 'emelt' ? 'active' : ''}`}
                                onClick={() => {
                                    setErettsegiExamLevel('emelt');
                                    localStorage.setItem('erettsegiExamLevel', 'emelt');
                                }}
                            >
                                {t('dashboard.exam.emelt')}
                            </button>
                        </div>
                    )}
                </section>

                {isAdmin && (
                    <div className="dash-admin-hint">
                        <span style={{ color: '#cfe9d4' }}>
                            {t('dashboard.studentViewHint')}
                        </span>
                        <button
                            type="button"
                            onClick={() => switchTab('admin')}
                            className="dash-admin-hint-btn"
                        >
                            {t('dashboard.adminPlatform')}
                        </button>
                    </div>
                )}

                {/* Mathematical Topics Section */}
                <section className="dash-learn attendance-section">
                    <div className="dash-learn-head">
                        <div className="dash-learn-titles">
                            <h2 className="section-title">
                                {educationLevel === 'elementary' && t('dashboard.topics.elementary')}
                                {educationLevel === 'highschool' && t('dashboard.topics.highschool')}
                                {educationLevel === 'university' && t('dashboard.topics.university')}
                                {educationLevel === 'erettsegi' &&
                                    (erettsegiPrepPath === 'choose'
                                        ? t('dashboard.erettsegi.chooseTitle')
                                        : erettsegiExamLevel === 'emelt'
                                          ? t('dashboard.topics.erettsegiEmelt')
                                          : t('dashboard.topics.erettsegiKozep'))}
                            </h2>
                            <p className="section-subtitle">
                                {educationLevel === 'elementary' && t('dashboard.topicsSub.elementary')}
                                {educationLevel === 'highschool' && t('dashboard.topicsSub.highschool')}
                                {educationLevel === 'university' && t('dashboard.topicsSub.university')}
                                {educationLevel === 'erettsegi' &&
                                    (erettsegiPrepPath === 'choose'
                                        ? t('dashboard.erettsegi.chooseSub')
                                        : t('dashboard.topicsSub.erettsegi'))}
                            </p>
                            {(educationLevel !== 'erettsegi' || erettsegiPrepPath === 'topics') && (
                                <p className="dash-overall-line">
                                    {t('dashboard.overallLine')
                                        .replace('{pct}', String(overallPct))
                                        .replace('{n}', String(mathTopics.length))}
                                </p>
                            )}
                        </div>
                        <div className="dash-learn-actions">
                            <button
                                type="button"
                                className="dash-daily-btn"
                                onClick={() =>
                                    router.push(buildDailyPracticeHref(educationLevel, elementaryGrade))
                                }
                            >
                                {srsDueCount > 0
                                    ? t('dashboard.dailyDue').replace('{n}', String(srsDueCount))
                                    : t('dashboard.daily')}
                            </button>
                            <button
                                type="button"
                                className="dash-daily-btn dash-blitz-btn"
                                onClick={() => router.push(buildBlitzHref(educationLevel, elementaryGrade))}
                            >
                                {t('dashboard.blitz')}
                            </button>
                        </div>
                    </div>
                    {educationLevel === 'erettsegi' && erettsegiPrepPath === 'choose' && (
                        <div className="erettsegi-prep-choice">
                            <button
                                type="button"
                                className={`erettsegi-prep-card ${erettsegiPrepPath === 'topics' ? 'active' : ''}`}
                                onClick={() => {
                                    // #region agent log
                                    agentDebugLog({
                                        hypothesisId: 'H3',
                                        location: 'dashboard.tsx:erettsegiPrepPath',
                                        message: 'dashboard erettsegi path chosen',
                                        data: { path: 'topics', level: erettsegiExamLevel },
                                        runId: 'er-choose-hub',
                                    });
                                    // #endregion
                                    setErettsegiPrepPath('topics');
                                }}
                            >
                                <span className="erettsegi-prep-icon" aria-hidden>
                                    📖
                                </span>
                                <strong>{t('dashboard.erettsegi.topicsTitle')}</strong>
                                <small>{t('dashboard.erettsegi.topicsDesc')}</small>
                            </button>
                            <button
                                type="button"
                                className="erettsegi-prep-card papers"
                                onClick={() => {
                                    // #region agent log
                                    agentDebugLog({
                                        hypothesisId: 'H3',
                                        location: 'dashboard.tsx:erettsegiPrepPath',
                                        message: 'dashboard erettsegi path chosen',
                                        data: { path: 'papers', level: erettsegiExamLevel },
                                        runId: 'er-choose-hub',
                                    });
                                    // #endregion
                                    router.push(
                                        `/erettsegi-felkeszules?mode=papers&level=${erettsegiExamLevel}`
                                    );
                                }}
                            >
                                <span className="erettsegi-prep-icon" aria-hidden>
                                    📄
                                </span>
                                <strong>{t('dashboard.erettsegi.papersTitle')}</strong>
                                <small>{t('dashboard.erettsegi.papersDesc')}</small>
                            </button>
                        </div>
                    )}
                    {educationLevel === 'erettsegi' && erettsegiPrepPath === 'topics' && (
                        <button
                            type="button"
                            className="erettsegi-prep-back"
                            onClick={() => setErettsegiPrepPath('choose')}
                        >
                            {t('dashboard.erettsegi.backChoose')}
                        </button>
                    )}

                    {(educationLevel !== 'erettsegi' || erettsegiPrepPath === 'topics') && (
                    <div className="topics-grid">
                        {mathTopics.map((topic) => {
                            const successRate = topic.totalAnswers > 0 ? (topic.correctAnswers / topic.totalAnswers) * 100 : 0;
                            const lessonsDone = topic.lessonsCompleted || 0;
                            return (
                                <div
                                    key={topic.id}
                                    className="topic-card speedometer-card"
                                    onClick={() => navigateToTopicStats(topic.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            navigateToTopicStats(topic.id);
                                        }
                                    }}
                                >
                                    <div className="card-header">
                                        <div className="topic-icon" style={{ backgroundColor: topic.color }}>
                                            {topic.icon}
                                        </div>
                                        <div className="topic-info">
                                            <h3 className="topic-title">{topicLabel(topic.id, topic.title)}</h3>
                                        </div>
                                    </div>

                                    <div className="speedometer-container">
                                        <div className="performance-header" style={{ color: topic.color }}>
                                            {Math.round(successRate)}%
                                        </div>
                                        <div className="speedometer">
                                            <svg className="speedometer-gauge" viewBox="0 0 200 120">
                                                {/* Háttér ív */}
                                                <path
                                                    className="gauge-background"
                                                    d="M 20 100 A 80 80 0 0 1 180 100"
                                                    fill="none"
                                                    stroke="#e0e0e0"
                                                    strokeWidth="12"
                                                />
                                                {/* Progress ív - befejezett feladatok alapján */}
                                                <path
                                                    className="gauge-progress"
                                                    d="M 20 100 A 80 80 0 0 1 180 100"
                                                    fill="none"
                                                    stroke={topic.color}
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                    style={{
                                                        strokeDasharray: `${Math.PI * 80}`,
                                                        strokeDashoffset: `${Math.PI * 80 * (1 - successRate / 100)}`,
                                                        filter: `drop-shadow(0 0 8px ${topic.color})`
                                                    }}
                                                />
                                                {/* Skála jelölések - teljesítmény százalék alapján */}
                                                {(() => {
                                                    const scalePoints = [0, 25, 50, 75, 100]; // Százalékos skála
                                                    return scalePoints.map((value, i) => {
                                                        const angle = (value / Math.max(...scalePoints)) * Math.PI - Math.PI;
                                                        const x1 = 100 + 70 * Math.cos(angle);
                                                        const y1 = 100 + 70 * Math.sin(angle);
                                                        const x2 = 100 + 80 * Math.cos(angle);
                                                        const y2 = 100 + 80 * Math.sin(angle);
                                                        return (
                                                            <g key={i}>
                                                                <line
                                                                    className="gauge-tick"
                                                                    x1={x1}
                                                                    y1={y1}
                                                                    x2={x2}
                                                                    y2={y2}
                                                                    stroke="#666"
                                                                    strokeWidth="2"
                                                                />
                                                                <text
                                                                    className="gauge-label"
                                                                    x={100 + 60 * Math.cos(angle)}
                                                                    y={100 + 60 * Math.sin(angle) + 5}
                                                                    textAnchor="middle"
                                                                    fontSize="10"
                                                                    fill="#666"
                                                                >
                                                                    {value}
                                                                </text>
                                                            </g>
                                                        );
                                                    });
                                                })()}
                                                {/* Mutató - befejezett feladatok száma alapján */}
                                                <g className="gauge-needle">
                                                    <line
                                                        x1="100"
                                                        y1="100"
                                                        x2="100"
                                                        y2="35"
                                                        stroke={topic.color}
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        style={{
                                                            transform: `rotate(${(successRate / 100) * 180 - 90}deg)`,
                                                            transformOrigin: '100px 100px',
                                                            filter: `drop-shadow(0 0 6px ${topic.color})`
                                                        }}
                                                    />
                                                    <circle
                                                        cx="100"
                                                        cy="100"
                                                        r="6"
                                                        fill={topic.color}
                                                        style={{
                                                            filter: `drop-shadow(0 0 8px ${topic.color})`
                                                        }}
                                                    />
                                                </g>
                                            </svg>

                                            <div className="speedometer-display">
                                                <div className="progress-percentage">
                                                    {t('dashboard.correct', {
                                                        a: String(topic.correctAnswers),
                                                        b: String(topic.totalAnswers),
                                                    })}
                                                </div>
                                                <div
                                                    className="progress-percentage"
                                                    style={{
                                                        marginTop: '0.35rem',
                                                        fontSize: '0.85rem',
                                                        color: topic.pathCompleted ? '#ffd700' : '#9f9',
                                                    }}
                                                >
                                                    {topic.pathCompleted
                                                        ? t('dashboard.pathDone')
                                                        : t('dashboard.lessons', {
                                                              a: String(lessonsDone),
                                                              b: String(PATH_LESSON_COUNT),
                                                          })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                    )}
                </section>


                 {assignedTasks.length > 0 && (
                     <section className="public-tasks-section" style={{ marginBottom: "2rem" }}>
                         <h2 className="section-title">{t('dashboard.assignedTitle')}</h2>
                         <p className="section-subtitle">{t('dashboard.assignedSub')}</p>
                         <div className="public-tasks-grid">
                             {assignedTasks.map((task) => (
                                 <div key={task.id} className="public-task-card">
                                     <div className="task-header">
                                         <h3>{task.title}</h3>
                                         <span className="task-badge">
                                             {task.status === "completed"
                                                 ? t('dashboard.statusDone')
                                                 : t('dashboard.statusAssigned')}
                                         </span>
                                     </div>
                                     <div className="task-content">
                                         {task.topicTitle && (
                                             <p>
                                                 <strong>{t('dashboard.topicLabel')}</strong> {task.topicTitle}
                                             </p>
                                         )}
                                         {task.description && <p>{task.description}</p>}
                                         <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                                             {task.questions
                                                 ? t('dashboard.questions', { n: String(task.questions) })
                                                 : ""}
                                             {task.difficulty ? ` · ${task.difficulty}` : ""}
                                         </p>
                                         <Link
                                             href={gameUrlForAssignedTask(task)}
                                             className="submit-btn"
                                             style={{
                                                 display: "inline-block",
                                                 marginTop: "0.75rem",
                                                 textDecoration: "none",
                                                 padding: "0.65rem 1rem",
                                             }}
                                         >
                                             {t('dashboard.startTask')}
                                         </Link>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </section>
                 )}

                 {/* Public Tasks Section */}
                 {publicTasks.length > 0 && (
                     <section className="public-tasks-section">
                         <h2 className="section-title">{t('dashboard.publicTitle')}</h2>
                         <p className="section-subtitle">{t('dashboard.publicSub')}</p>

                         <div className="public-tasks-grid">
                             {publicTasks.map(task => (
                                 <div key={task.id} className="public-task-card">
                                     <div className="task-header">
                                         <h3>{task.topicTitle || task.topicId}</h3>
                                         <span className="task-badge">{t('dashboard.newTask')}</span>
                                     </div>
                                     <div className="task-content">
                                         <p>
                                             <strong>{t('dashboard.taskLabel')}</strong> {task.taskDescription}
                                         </p>
                                         <div className="task-input-section">
                                             <input
                                                 type="text"
                                                 placeholder={t('dashboard.answerPlaceholder')}
                                                 className="task-answer-input"
                                                 onKeyPress={(e) => {
                                                     if (e.key === 'Enter') {
                                                         const userAnswer = (e.target as HTMLInputElement).value;
                                                         if (userAnswer.trim() === task.correctAnswer.trim()) {
                                                             alert(t('dashboard.answerCorrect'));
                                                             updateTopicProgress(task.topicId);
                                                         } else {
                                                             alert(t('dashboard.answerWrong'));
                                                         }
                                                         (e.target as HTMLInputElement).value = '';
                                                     }
                                                 }}
                                             />
                                             <div className="task-hint">
                                                 {t('dashboard.answerHint')}
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </section>
                 )}

                </>
                )}
            </main>
        </div>
    );
}

