import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminBookingCalendar from "../components/AdminBookingCalendar";
import AdminWorkingHoursEditor from "../components/AdminWorkingHoursEditor";
import BookingAttachments from "../components/BookingAttachments";
import ProfilePanel from "../components/ProfilePanel";
import { isAdminEmail } from "../utils/admin";
import { isTestAuthUser } from "../utils/testLogin";
import {
    gameUrlForAssignedTask,
    loadStudentAssignedTasks,
    type AssignedTaskDoc,
} from "../utils/assignedTasks";
import { paymentStatusLabel } from "../utils/bookingNotify";

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
};

export default function Dashboard() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [me, setMe] = useState<UserDoc | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [educationLevel, setEducationLevel] = useState<'elementary' | 'highschool' | 'university'>('university');
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<DashboardTab>("tanulas");
    const [publicTasks, setPublicTasks] = useState<any[]>([]);
    const [assignedTasks, setAssignedTasks] = useState<AssignedTaskDoc[]>([]);
    const [pendingBookings, setPendingBookings] = useState<any[]>([]);
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
    const [showNewTopicForm, setShowNewTopicForm] = useState(false);
    const [newTopic, setNewTopic] = useState({
        title: '',
        icon: '📚',
        color: '#39ff14'
    });

    const allMathTopics = {
        elementary: [
            { id: 'szamok-20ig', title: 'Számok 20-ig', completed: 0, total: 0, color: '#39ff14', icon: '2️⃣', correctAnswers: 8, wrongAnswers: 2, totalAnswers: 10 },
            { id: 'szamok-100ig', title: 'Számok 100-ig', completed: 0, total: 0, color: '#39ff14', icon: '💯', correctAnswers: 5, wrongAnswers: 3, totalAnswers: 8 },
            { id: 'osszeadas-kivonas', title: 'Összeadás-kivonás', completed: 0, total: 0, color: '#39ff14', icon: '➕', correctAnswers: 12, wrongAnswers: 1, totalAnswers: 13 },
            { id: 'szorzotabla', title: 'Szorzótábla', completed: 0, total: 0, color: '#39ff14', icon: '✖️', correctAnswers: 6, wrongAnswers: 4, totalAnswers: 10 },
            { id: 'tortek', title: 'Törtek', completed: 0, total: 0, color: '#39ff14', icon: '½', correctAnswers: 7, wrongAnswers: 3, totalAnswers: 10 },
            { id: 'geometria-alapok', title: 'Geometria alapok', completed: 0, total: 0, color: '#39ff14', icon: '📐', correctAnswers: 9, wrongAnswers: 1, totalAnswers: 10 },
        ],
        highschool: [
            { id: 'abszolutertek', title: 'Abszolútérték', completed: 0, total: 0, color: '#39ff14', icon: 'A', correctAnswers: 15, wrongAnswers: 5, totalAnswers: 20 },
            { id: 'egyenletek', title: 'Egyenletek', completed: 0, total: 0, color: '#39ff14', icon: 'Σ', correctAnswers: 8, wrongAnswers: 7, totalAnswers: 15 },
            { id: 'sikgeometria', title: 'Síkgeometria', completed: 0, total: 0, color: '#39ff14', icon: '📐', correctAnswers: 12, wrongAnswers: 3, totalAnswers: 15 },
            { id: 'fuggvenyek', title: 'Függvények', completed: 0, total: 0, color: '#39ff14', icon: '📈', correctAnswers: 10, wrongAnswers: 5, totalAnswers: 15 },
            { id: 'trigonometria', title: 'Trigonometria', completed: 0, total: 0, color: '#39ff14', icon: '📐', correctAnswers: 6, wrongAnswers: 9, totalAnswers: 15 },
            { id: 'statisztika', title: 'Statisztika', completed: 0, total: 0, color: '#39ff14', icon: '📊', correctAnswers: 14, wrongAnswers: 1, totalAnswers: 15 },
            { id: 'koordinatageometria', title: 'Koordinátageometria', completed: 0, total: 0, color: '#39ff14', icon: '📍', correctAnswers: 7, wrongAnswers: 8, totalAnswers: 15 },
            { id: 'valoszinusegszamitas', title: 'Valószínűségszámítás', completed: 0, total: 0, color: '#39ff14', icon: '🎲', correctAnswers: 11, wrongAnswers: 4, totalAnswers: 15 },
            { id: 'logaritmus', title: 'Logaritmus', completed: 0, total: 0, color: '#39ff14', icon: 'log', correctAnswers: 9, wrongAnswers: 6, totalAnswers: 15 },
            { id: 'kombinatorika', title: 'Kombinatorika', completed: 0, total: 0, color: '#39ff14', icon: '🔢', correctAnswers: 13, wrongAnswers: 2, totalAnswers: 15 },
            { id: 'sorozatok', title: 'Sorozatok', completed: 0, total: 0, color: '#39ff14', icon: '∞', correctAnswers: 5, wrongAnswers: 10, totalAnswers: 15 },
        ],
        university: [
            { id: 'analizis1', title: 'Analízis I.', completed: 0, total: 0, color: '#39ff14', icon: '∫', correctAnswers: 20, wrongAnswers: 5, totalAnswers: 25 },
            { id: 'analizis2', title: 'Analízis II.', completed: 0, total: 0, color: '#39ff14', icon: '∂', correctAnswers: 12, wrongAnswers: 8, totalAnswers: 20 },
            { id: 'linearis-algebra', title: 'Lineáris Algebra', completed: 0, total: 0, color: '#39ff14', icon: '⬜', correctAnswers: 18, wrongAnswers: 7, totalAnswers: 25 },
            { id: 'differencial-geometria', title: 'Differenciálgeometria', completed: 0, total: 0, color: '#39ff14', icon: '🌀', correctAnswers: 8, wrongAnswers: 12, totalAnswers: 20 },
            { id: 'topologia', title: 'Topológia', completed: 0, total: 0, color: '#39ff14', icon: '🔗', correctAnswers: 6, wrongAnswers: 14, totalAnswers: 20 },
            { id: 'valoszinuseg-elmeleti', title: 'Valószínűség-elmélet', completed: 0, total: 0, color: '#39ff14', icon: 'P', correctAnswers: 15, wrongAnswers: 5, totalAnswers: 20 },
            { id: 'numerikus-modszerek', title: 'Numerikus Módszerek', completed: 0, total: 0, color: '#39ff14', icon: '🔢', correctAnswers: 22, wrongAnswers: 3, totalAnswers: 25 },
            { id: 'operaciokutatas', title: 'Operációkutatás', completed: 0, total: 0, color: '#39ff14', icon: '⚙️', correctAnswers: 16, wrongAnswers: 4, totalAnswers: 20 },
            { id: 'diszkret-matematika', title: 'Diszkrét Matematika', completed: 0, total: 0, color: '#39ff14', icon: '⚫', correctAnswers: 14, wrongAnswers: 6, totalAnswers: 20 },
            { id: 'graf-elmelet', title: 'Gráfelmélet', completed: 0, total: 0, color: '#39ff14', icon: '🕸️', correctAnswers: 10, wrongAnswers: 10, totalAnswers: 20 },
        ]
    };

    const [mathTopics, setMathTopics] = useState<MathTopic[]>([]);

    useEffect(() => {
        const savedLevel = localStorage.getItem('educationLevel') as 'elementary' | 'highschool' | 'university';
        if (savedLevel && allMathTopics[savedLevel]) {
            setEducationLevel(savedLevel);
        }
    }, []);

    useEffect(() => {
        // Betöltjük a témaköröket 0% progress-szel és játék eredményekkel
        loadTopicsWithGameResults(allMathTopics[educationLevel]);
    }, [educationLevel]);

    useEffect(() => {
        const checkAuth = async () => {
            let attempts = 0;
            while (!(window as any).firebase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!(window as any).firebase) {
                setError("Firebase nem elérhető.");
                setLoading(false);
                return;
            }

            try {
                const auth = (window as any).firebase.auth();
                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user) {
                        setMe(null);
                        setIsAdmin(false);
                        setLoading(false);
                        router.replace('/?auth=1');
                        return;
                    }

                    // E-mail/jelszó fiókoknál kötelező a megerősített e-mail (teszt fiók kivétel)
                    const isPasswordUser = (user.providerData || []).some(
                        (p: any) => p?.providerId === 'password'
                    );
                    if (isPasswordUser && !user.emailVerified && !isTestAuthUser(user)) {
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

                    const userData = {
                        uid: user.uid,
                        name: user.displayName || '',
                        email: user.email || '',
                    };

                    setMe(userData);
                    const adminStatus = isAdminEmail(user.email);
                    setIsAdmin(adminStatus);
                    setLoading(false);
                });

                return () => unsub();
            } catch (err) {
                setError("Hiba történt.");
                setLoading(false);
            }
        };

        checkAuth();
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
        const tab = router.query.tab;
        if (tab === 'profil' || tab === 'admin' || tab === 'tanulas') {
            if (tab === 'admin' && !isAdmin) {
                setActiveTab('tanulas');
                return;
            }
            setActiveTab(tab);
        }
    }, [router.query.tab, isAdmin]);

    const switchTab = (tab: DashboardTab) => {
        if (tab === 'admin' && !isAdmin) return;
        setActiveTab(tab);
        router.replace(
            { pathname: '/dashboard', query: tab === 'tanulas' ? {} : { tab } },
            undefined,
            { shallow: true }
        );
    };

    useEffect(() => {
        // Load public tasks for current education level
        const loadPublicTasks = async () => {
            if (!(window as any).firebase) return;

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
            } catch (error) {
                console.error('Error loading public tasks:', error);
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

    // Pending foglalások: Firestore (bookings collection) + legacy fallback
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
            const { loadPendingBookingsFromFirestore } = await import('../utils/bookingNotify');

            // First paint from Firestore query
            const initial = await loadPendingBookingsFromFirestore();
            if (!cancelled) applyList(initial);

            const firebase = (window as any).firebase;
            if (!firebase?.firestore) {
                // poll fallback
                const interval = setInterval(async () => {
                    const list = await loadPendingBookingsFromFirestore();
                    if (!cancelled) applyList(list);
                }, 8000);
                unsub = () => clearInterval(interval);
                return;
            }

            try {
                unsub = firebase
                    .firestore()
                    .collection('bookings')
                    .where('status', '==', 'pending')
                    .onSnapshot(
                        (snap: any) => {
                            const list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
                            applyList(list);
                        },
                        async () => {
                            const list = await loadPendingBookingsFromFirestore();
                            applyList(list);
                        }
                    );
            } catch {
                const interval = setInterval(async () => {
                    const list = await loadPendingBookingsFromFirestore();
                    if (!cancelled) applyList(list);
                }, 8000);
                unsub = () => clearInterval(interval);
            }
        };

        start();

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
                const token = await (window as any).firebase?.auth()?.currentUser?.getIdToken?.();
                const res = await fetch('/api/email-status', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await res.json();
                setEmailStatus(data);
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
            const token = await (window as any).firebase?.auth()?.currentUser?.getIdToken?.();
            const status = await fetch('/api/email-status', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            }).then((r) => r.json());
            setEmailStatus(status);
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
        try {
            if (!(window as any).firebase) {
                // Ha nincs Firebase, csak 0% progress-szel betöltjük
                const topicsWithZeroProgress = baseTopics.map(topic => ({
                    ...topic,
                    completed: 0,
                    total: 0,
                    correctAnswers: 0,
                    wrongAnswers: 0,
                    totalAnswers: 0
                }));
                setMathTopics(topicsWithZeroProgress);
                return;
            }

            const db = (window as any).firebase.firestore();

            // Betöltjük a játék eredményeket a gameResults collection-ból
            const gameResultsSnapshot = await db.collection('gameResults')
                .where('userId', '==', (window as any).firebase.auth().currentUser?.uid || '')
                .get();

            const gameResults: { [topicId: string]: { correct: number, total: number } } = {};

            gameResultsSnapshot.forEach((doc: any) => {
                const data = doc.data();
                const key = data.topicId || data.topic;
                if (key && data.correct !== undefined && data.total !== undefined) {
                    const prev = gameResults[key];
                    // Legjobb / legújabb: tartsuk a nagyobb correct arányút
                    if (!prev || data.correct >= prev.correct) {
                        gameResults[key] = {
                            correct: data.correct,
                            total: data.total
                        };
                    }
                }
            });

            // Frissítjük a témaköröket a játék eredményekkel
            const topicsWithResults = baseTopics.map(topic => {
                const result = gameResults[topic.id]
                    || Object.entries(gameResults).find(([k]) =>
                        k.toLowerCase().includes(topic.id.toLowerCase())
                        || topic.id.toLowerCase().includes(k.toLowerCase())
                    )?.[1];
                if (result) {
                    return {
                        ...topic,
                        completed: Math.min(result.correct, result.total),
                        total: result.total,
                        correctAnswers: result.correct,
                        wrongAnswers: Math.max(0, result.total - result.correct),
                        totalAnswers: result.total
                    };
                } else {
                    return {
                        ...topic,
                        completed: 0,
                        total: 0,
                        correctAnswers: 0,
                        wrongAnswers: 0,
                        totalAnswers: 0
                    };
                }
            });

            setMathTopics(topicsWithResults);
        } catch (error) {
            console.error('Error loading game results:', error);
            // Hiba esetén is 0% progress-szel betöltjük
            const topicsWithZeroProgress = baseTopics.map(topic => ({
                ...topic,
                completed: 0,
                total: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                totalAnswers: 0
            }));
            setMathTopics(topicsWithZeroProgress);
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

    const navigateToProblems = (topicId: string) => {
        // A kiválasztott oktatási szintnek megfelelő kvíz indítása
        const params = new URLSearchParams({
            educationLevel,
            topic: topicId,
        });
        if (educationLevel === 'elementary') {
            params.set('grade', '5');
        } else if (educationLevel === 'highschool') {
            params.set('grade', '10');
        }
        router.push(`/game?${params.toString()}`);
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

    // Email küldő funkciók


    if (loading) {
        return (
            <div className="dashboard-container modern-theme">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Betöltés...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container modern-theme">
                <div className="error-screen">
                    <h2>Hiba történt</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container modern-theme">
            {/* Navigation */}
            <div className="top-nav">
                <nav className="nav-tabs">
                    <button
                        className={`nav-tab ${activeTab === 'tanulas' ? 'active' : ''}`}
                        onClick={() => switchTab('tanulas')}
                    >
                        <i className="nav-icon">📚</i>
                        Tanulás
                    </button>
                    <button
                        className={`nav-tab ${activeTab === 'profil' ? 'active' : ''}`}
                        onClick={() => switchTab('profil')}
                    >
                        <i className="nav-icon">👤</i>
                        Profilom
                    </button>
                    {isAdmin && (
                        <button
                            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => switchTab('admin')}
                            style={pendingBookings.length > 0 ? { color: '#ff6b6b', border: '2px solid #ff6b6b' } : undefined}
                        >
                            <i className="nav-icon">⚙️</i>
                            Admin{pendingBookings.length > 0 ? ` (${pendingBookings.length})` : ''}
                        </button>
                    )}
                    <button
                        type="button"
                        className="nav-tab"
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        <i className="nav-icon">🏠</i>
                        Kezdőlap
                    </button>
                    <button
                        type="button"
                        className="nav-tab"
                        onClick={() => {
                            window.location.href = '/#contact';
                        }}
                    >
                        <i className="nav-icon">📞</i>
                        Kapcsolat
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <main className="main-content">
                {activeTab === 'profil' && (
                    <section className="profile-embedded-section" style={{ padding: '1rem 0 2rem' }}>
                        <ProfilePanel embedded />
                    </section>
                )}

                {activeTab === 'admin' && isAdmin && (
                    <>
                        <div style={{
                            background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                            color: '#000',
                            padding: '0.5rem 1rem',
                            borderRadius: '15px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            textAlign: 'center',
                            marginTop: '1rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)',
                            maxWidth: '400px',
                            margin: '1rem auto 1.5rem'
                        }}>
                            👑 ADMIN FELÜLET - {me?.email}
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <button
                                type="button"
                                className="nav-tab"
                                onClick={() => router.push('/exam-prep')}
                                style={{
                                    display: 'inline-flex',
                                    gap: '0.5rem',
                                    border: '2px solid #39ff14',
                                    borderRadius: '12px',
                                    padding: '0.75rem 1.25rem',
                                    cursor: 'pointer',
                                    background: 'rgba(57,255,20,0.12)',
                                    color: '#39ff14',
                                    fontWeight: 700,
                                }}
                            >
                                ⚙️ Feladatkiosztás (Exam Prep)
                            </button>
                        </div>

                        {emailStatus && (
                            <div style={{
                                background: emailStatus.ready
                                    ? 'rgba(57, 255, 20, 0.12)'
                                    : 'rgba(255, 105, 180, 0.12)',
                                border: `1px solid ${emailStatus.ready ? 'rgba(57,255,20,0.5)' : 'rgba(255,105,180,0.5)'}`,
                                borderRadius: '14px',
                                padding: '1rem 1.25rem',
                                margin: '0 auto 2rem',
                                maxWidth: '720px',
                                color: '#eee',
                            }}>
                                <strong style={{ color: emailStatus.ready ? '#39ff14' : '#ff69b4' }}>
                                    {emailStatus.ready ? 'E-mail rendszer kész' : 'E-mail beállítás'}
                                </strong>
                                <p style={{ margin: '0.5rem 0', color: '#bbb', fontSize: '0.95rem' }}>
                                    Mód: <code>{emailStatus.mode}</code>
                                    {emailStatus.adminEmail ? ` · Admin: ${emailStatus.adminEmail}` : ''}
                                    {emailStatus.siteUrl ? ` · Site: ${emailStatus.siteUrl}` : ''}
                                </p>
                                {!emailStatus.hasGmail ? (
                                    <ol style={{ margin: '0.75rem 0', paddingLeft: '1.25rem', color: '#ccc', fontSize: '0.92rem', lineHeight: 1.55 }}>
                                        <li>
                                            Nyisd meg:{' '}
                                            <a
                                                href="https://myaccount.google.com/apppasswords"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#39ff14' }}
                                            >
                                                Google App-jelszavak
                                            </a>
                                            {' '}(2 lépéses azonosítás kell)
                                        </li>
                                        <li>Generálj új app-jelszót (pl. „Mihaszna Matek”)</li>
                                        <li>
                                            Illeszd a 16 karakteres kódot a projekt{' '}
                                            <code>.env.local</code> fájljába:{' '}
                                            <code>GMAIL_APP_PASSWORD=xxxxxxxxxxxx</code>
                                            {' '}(szóközök nélkül)
                                        </li>
                                        <li>Írd meg ide a chatben, hogy megvan — újraindítom a szervert és tesztejük</li>
                                    </ol>
                                ) : (
                                    <p style={{ margin: '0 0 0.75rem', color: '#ccc', fontSize: '0.9rem' }}>
                                        {emailStatus.hint}
                                    </p>
                                )}
                                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        onClick={sendTestBookingEmail}
                                        disabled={emailTestLoading || !emailStatus.hasGmail}
                                        style={{
                                            background: emailStatus.hasGmail
                                                ? 'linear-gradient(135deg, #39ff14, #ff69b4)'
                                                : 'rgba(255,255,255,0.15)',
                                            color: emailStatus.hasGmail ? '#000' : '#888',
                                            border: 'none',
                                            borderRadius: '10px',
                                            padding: '0.65rem 1rem',
                                            fontWeight: 700,
                                            cursor: emailTestLoading || !emailStatus.hasGmail ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {emailTestLoading
                                            ? 'Küldés...'
                                            : emailStatus.hasGmail
                                              ? 'Teszt e-mail küldése'
                                              : 'Előbb App-jelszó kell'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => runLessonReminders()}
                                        disabled={reminderLoading || !emailStatus.hasGmail}
                                        style={{
                                            background: emailStatus.hasGmail
                                                ? 'rgba(57,255,20,0.15)'
                                                : 'rgba(255,255,255,0.1)',
                                            color: emailStatus.hasGmail ? '#39ff14' : '#888',
                                            border: `1px solid ${emailStatus.hasGmail ? '#39ff14' : '#555'}`,
                                            borderRadius: '10px',
                                            padding: '0.65rem 1rem',
                                            fontWeight: 700,
                                            cursor: reminderLoading || !emailStatus.hasGmail ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {reminderLoading ? 'Emlékeztetők…' : 'Holnapi emlékeztetők'}
                                    </button>
                                </div>
                                {reminderInfo && (
                                    <p style={{ margin: '0.75rem 0 0', color: '#aaa', fontSize: '0.88rem' }}>
                                        {reminderInfo}
                                    </p>
                                )}
                                <p style={{ margin: '0.65rem 0 0', color: '#777', fontSize: '0.82rem' }}>
                                    Holnapi jóváhagyott órákra emlékeztető megy a diáknak (+ másolat neked).
                                    Ha adminnal belépsz a Dashboardra, naponta egyszer automatikusan lefut — vagy nyomd meg a gombot.
                                </p>
                            </div>
                        )}

                        <AdminWorkingHoursEditor
                            onSaved={() => setWorkingHoursVersion((v) => v + 1)}
                        />

                        <AdminBookingCalendar
                            key={workingHoursVersion}
                            onChanged={async () => {
                                const { loadPendingBookingsFromFirestore } = await import('../utils/bookingNotify');
                                const list = await loadPendingBookingsFromFirestore();
                                setPendingBookings(list);
                            }}
                        />

                        {pendingBookings.length > 0 ? (
                            <section className="pending-bookings-section">
                                <h2 className="section-title">⚠️ Függőben Lévő Foglalások</h2>
                                <p className="section-subtitle">Jóváhagyásra váró időpontfoglalások</p>
                                <div className="pending-bookings-grid">
                                    {pendingBookings.map(booking => (
                                        <div key={booking.id} className="pending-booking-card">
                                            <div className="booking-header">
                                                <h3>📅 {new Date(booking.date).toLocaleDateString('hu-HU')}</h3>
                                                <span className="booking-status pending">Függőben</span>
                                            </div>
                                            <div className="booking-content">
                                                <div className="booking-info">
                                                    <p><strong>👤 Név:</strong> {booking.customerName}</p>
                                                    <p><strong>📧 Email:</strong> {booking.customerEmail}</p>
                                                    <p><strong>⏰ Időpontok:</strong> {(booking.times || []).join(', ')}</p>
                                                    <p><strong>📍 Típus:</strong> {booking.lessonType === 'online' ? '💻 Online' : '🏠 Személyes'}</p>
                                                    <p><strong>📚 Témakör:</strong> {booking.selectedSubject}</p>
                                                    <p><strong>💰 Ár:</strong> {booking.totalPrice} Ft</p>
                                                    <p>
                                                        <strong>🧾 Számlázási cím:</strong>{" "}
                                                        {[booking.postalCode, booking.street, booking.houseNumber]
                                                            .filter(Boolean)
                                                            .join(" ") || "—"}
                                                    </p>
                                                    <p>
                                                        <strong>💳 Fizetés:</strong>{" "}
                                                        {paymentStatusLabel(booking.paymentStatus)}
                                                    </p>
                                                    <p><strong>📅 Beküldve:</strong> {booking.submittedAt ? new Date(booking.submittedAt).toLocaleString('hu-HU') : '—'}</p>
                                                    <BookingAttachments files={booking.uploadedFiles} />
                                                </div>
                                                <div className="booking-actions">
                                                    <button className="approve-btn" onClick={() => approveBooking(booking.id)}>
                                                        ✅ Jóváhagyás
                                                    </button>
                                                    <button className="reject-btn" onClick={() => rejectBooking(booking.id)}>
                                                        ❌ Elutasítás
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

                {activeTab === 'tanulas' && (
                <>
                {/* Education Level Selector */}
                <section className="education-level-section">
                    <h3 className="level-title">
                        🎓 Válaszd ki az oktatási szinted
                    </h3>
                    <div className="level-selector">
                        <button
                            className={`level-btn ${educationLevel === 'elementary' ? 'active' : ''}`}
                            onClick={() => {
                                setEducationLevel('elementary');
                                localStorage.setItem('educationLevel', 'elementary');
                            }}
                        >
                            🏫 Általános Iskola
                        </button>
                        <button
                            className={`level-btn ${educationLevel === 'highschool' ? 'active' : ''}`}
                            onClick={() => {
                                setEducationLevel('highschool');
                                localStorage.setItem('educationLevel', 'highschool');
                            }}
                        >
                            🎒 Középiskola
                        </button>
                        <button
                            className={`level-btn ${educationLevel === 'university' ? 'active' : ''}`}
                            onClick={() => {
                                setEducationLevel('university');
                                localStorage.setItem('educationLevel', 'university');
                            }}
                        >
                            🎓 Egyetem
                        </button>
                    </div>
                </section>

                    {isAdmin && (
                        <section className="exam-prep-section">
                            <div className="exam-prep-card" onClick={() => router.push(`/exam-prep?level=${educationLevel}`)}>
                                <div className="card-header" style={{
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                                    <h3 style={{
                                        background: 'linear-gradient(90deg, #39ff14 0%, #ff69b4 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        margin: 0,
                                        fontSize: '1.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        Feladatkiosztás diákoknak
                                    </h3>
                                </div>
                                <p style={{ textAlign: 'center', color: '#a0a0a0', marginTop: '0.5rem' }}>
                                    Admin: kvízek és feladatok kiosztása
                                </p>
                            </div>
                        </section>
                    )}

                {/* Mathematical Topics Section */}
                <section className="attendance-section">
                    <h2 className="section-title">
                        {educationLevel === 'elementary' && '🏫 Általános Iskolai'}
                        {educationLevel === 'highschool' && '🎒 Középiskolai'}
                        {educationLevel === 'university' && '🎓 Egyetemi'}
                        {' '}Matematikai Témakörök
                    </h2>
                    <p className="section-subtitle">
                        {educationLevel === 'elementary' && 'Alapozd meg a matematikai tudásod'}
                        {educationLevel === 'highschool' && 'Készülj fel az érettségire és továbbtanulásra'}
                        {educationLevel === 'university' && 'Mélyítsd el a felsőfokú matematikai ismereteid'}
                    </p>

                    <div className="topics-grid">
                        {mathTopics.map((topic) => {
                            const successRate = topic.totalAnswers > 0 ? (topic.correctAnswers / topic.totalAnswers) * 100 : 0;
                            const speedValue = topic.totalAnswers; // Összes válasz száma
                            const completedValue = topic.correctAnswers; // Helyes válaszok száma
                            return (
                                <div key={topic.id} className="topic-card speedometer-card" onClick={() => navigateToProblems(topic.id)}>
                                    <div className="card-header">
                                        <div className="topic-icon" style={{ backgroundColor: topic.color }}>
                                            {topic.icon}
                                        </div>
                                        <div className="topic-info">
                                            <h3 className="topic-title">{topic.title}</h3>
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
                                                <div className="progress-percentage">{topic.correctAnswers}/{topic.totalAnswers} helyes</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}

                        {/* Új témakör hozzáadás — csak admin */}
                        {isAdmin && (
                        <div className="add-topic-card" onClick={toggleNewTopicForm}>
                            <div className="add-topic-content">
                                <div className="add-topic-icon">➕</div>
                                <div className="add-topic-text">Új Témakör</div>
                            </div>
                        </div>
                        )}

                        {/* Új témakör form */}
                        {isAdmin && showNewTopicForm && (
                            <div className="new-topic-form">
                                <div className="form-header">
                                    <h3>Új Témakör Létrehozása</h3>
                                    <button className="close-form-btn" onClick={toggleNewTopicForm}>✕</button>
                                </div>
                                <div className="form-content">
                                    <div className="form-group">
                                        <label>Témakör neve:</label>
                                        <input
                                            type="text"
                                            value={newTopic.title}
                                            onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                                            placeholder="pl. Algebra alapok"
                                            className="topic-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ikon:</label>
                                        <input
                                            type="text"
                                            value={newTopic.icon}
                                            onChange={(e) => setNewTopic({ ...newTopic, icon: e.target.value })}
                                            placeholder="📚"
                                            className="icon-input"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Szín:</label>
                                        <input
                                            type="color"
                                            value={newTopic.color}
                                            onChange={(e) => setNewTopic({ ...newTopic, color: e.target.value })}
                                            className="color-input"
                                        />
                                    </div>
                                    <button className="create-topic-btn" onClick={addNewTopic}>
                                        Témakör Létrehozása
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Overall Progress Summary */}
                <section className="overall-progress-section">
                    <h2 className="section-title">📊 Összesített Állapot</h2>
                    <div className="overall-speedometer-container">
                        {(() => {
                            const totalCorrect = mathTopics.reduce((sum, topic) => sum + topic.correctAnswers, 0);
                            const totalAnswers = mathTopics.reduce((sum, topic) => sum + topic.totalAnswers, 0);
                            const overallSuccessRate = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0;

                            return (
                                <>
                                    <div className="performance-header" style={{ color: '#39ff14' }}>
                                        {Math.round(overallSuccessRate)}%
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
                                            {/* Progress ív */}
                                            <path
                                                className="gauge-progress"
                                                d="M 20 100 A 80 80 0 0 1 180 100"
                                                fill="none"
                                                stroke="#39ff14"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                style={{
                                                    strokeDasharray: `${Math.PI * 80}`,
                                                    strokeDashoffset: `${Math.PI * 80 * (1 - overallSuccessRate / 100)}`,
                                                    filter: `drop-shadow(0 0 8px #39ff14)`
                                                }}
                                            />
                                            {/* Skála jelölések */}
                                            {[0, 25, 50, 75, 100].map((value, i) => {
                                                const angle = (value / 100) * Math.PI - Math.PI;
                                                const x1 = 100 + 70 * Math.cos(angle);
                                                const y1 = 100 + 70 * Math.sin(angle);
                                                const x2 = 100 + 80 * Math.cos(angle);
                                                const y2 = 100 + 80 * Math.sin(angle);
                                                return (
                                                    <g key={i}>
                                                        <line
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
                                            })}
                                            {/* Mutató */}
                                            <g className="gauge-needle">
                                                <line
                                                    x1="100"
                                                    y1="100"
                                                    x2="100"
                                                    y2="35"
                                                    stroke="#39ff14"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    style={{
                                                        transform: `rotate(${(overallSuccessRate / 100) * 180 - 90}deg)`,
                                                        transformOrigin: '100px 100px',
                                                        filter: `drop-shadow(0 0 6px #39ff14)`
                                                    }}
                                                />
                                                <circle
                                                    cx="100"
                                                    cy="100"
                                                    r="6"
                                                    fill="#39ff14"
                                                    style={{
                                                        filter: `drop-shadow(0 0 8px #39ff14)`
                                                    }}
                                                />
                                            </g>
                                        </svg>
                                        <div className="speedometer-display">
                                            <div className="progress-percentage">{totalCorrect}/{totalAnswers} helyes</div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </section>

                 {assignedTasks.length > 0 && (
                     <section className="public-tasks-section" style={{ marginBottom: "2rem" }}>
                         <h2 className="section-title">🎯 Neked kiosztott feladatok</h2>
                         <p className="section-subtitle">Az oktató által hozzád rendelt gyakorló feladatok</p>
                         <div className="public-tasks-grid">
                             {assignedTasks.map((task) => (
                                 <div key={task.id} className="public-task-card">
                                     <div className="task-header">
                                         <h3>{task.title}</h3>
                                         <span className="task-badge">
                                             {task.status === "completed" ? "Kész" : "Kiosztva"}
                                         </span>
                                     </div>
                                     <div className="task-content">
                                         {task.topicTitle && (
                                             <p><strong>Témakör:</strong> {task.topicTitle}</p>
                                         )}
                                         {task.description && <p>{task.description}</p>}
                                         <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                                             {task.questions ? `${task.questions} kérdés` : ""}
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
                                             🎮 Feladat indítása
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
                         <h2 className="section-title">📚 Aktuális Feladatok</h2>
                         <p className="section-subtitle">Az adminisztrátor által kiadott feladatok</p>

                         <div className="public-tasks-grid">
                             {publicTasks.map(task => (
                                 <div key={task.id} className="public-task-card">
                                     <div className="task-header">
                                         <h3>{task.topicTitle || task.topicId}</h3>
                                         <span className="task-badge">Új Feladat</span>
                                     </div>
                                     <div className="task-content">
                                         <p><strong>Feladat:</strong> {task.taskDescription}</p>
                                         <div className="task-input-section">
                                             <input
                                                 type="text"
                                                 placeholder="Add meg a válaszodat..."
                                                 className="task-answer-input"
                                                 onKeyPress={(e) => {
                                                     if (e.key === 'Enter') {
                                                         const userAnswer = (e.target as HTMLInputElement).value;
                                                         if (userAnswer.trim() === task.correctAnswer.trim()) {
                                                             alert('🎉 Helyes válasz! Szuper munka!');
                                                             updateTopicProgress(task.topicId);
                                                         } else {
                                                             alert('❌ Hibás válasz. Próbáld újra!');
                                                         }
                                                         (e.target as HTMLInputElement).value = '';
                                                     }
                                                 }}
                                             />
                                             <div className="task-hint">
                                                 Nyomj Enter-t a válasz elküldéséhez
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </section>
                 )}

                 {/* Contact Section */}
                 <section className="contact-section">
                     <h2 className="section-title">📞 Kapcsolat</h2>
                     <p className="section-subtitle">Vedd fel velem a kapcsolatot bármikor</p>

                     <div className="contact-grid">
                         <div className="contact-info-card">
                             <div className="contact-header">
                                 <h3>📞 Telefon</h3>
                             </div>
                             <div className="contact-content">
                                 <a href="tel:+36308935495" className="contact-link">
                                     <span className="contact-icon">📞</span>
                                     <span className="contact-text">+36 30 893 5495</span>
                                 </a>
                                 <p className="contact-description">Hívj bármikor, szívesen segítek!</p>
                             </div>
                         </div>

                         <div className="contact-info-card">
                             <div className="contact-header">
                                 <h3>📧 Email</h3>
                             </div>
                             <div className="contact-content">
                                <a href="mailto:usezsolti@gmail.com" className="contact-link">
                                    <span className="contact-icon">📧</span>
                                    <span className="contact-text">usezsolti@gmail.com</span>
                                </a>
                                 <p className="contact-description">Írj emailt, hamarosan válaszolok!</p>
                             </div>
                         </div>

                         <div className="contact-info-card">
                             <div className="contact-header">
                                 <h3>📍 Cím</h3>
                             </div>
                             <div className="contact-content">
                                 <div className="contact-address">
                                     <span className="contact-icon">📍</span>
                                     <div className="address-text">
                                         <p>2151 Fót</p>
                                         <p>Szent Imre utca 18</p>
                                     </div>
                                 </div>
                                 <p className="contact-description">Személyes órák is lehetségesek!</p>
                             </div>
                         </div>

                         <div className="contact-info-card">
                             <div className="contact-header">
                                 <h3>🌐 Social Media</h3>
                             </div>
                             <div className="contact-content">
                                <div className="social-links">
                                    <a href="https://www.facebook.com/profile.php?id=100075272401924" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                                        <span className="social-icon">📘</span>
                                        <span>Facebook</span>
                                    </a>
                                    <a href="https://www.instagram.com/mihaszna__/" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                                        <span className="social-icon">📷</span>
                                        <span>Instagram</span>
                                    </a>
                                    <a href="https://www.youtube.com/@Mihasznamatek" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                                        <span className="social-icon">📺</span>
                                        <span>YouTube</span>
                                    </a>
                                    <a href="https://tiktok.com/@mihasznamatek" target="_blank" rel="noopener noreferrer" className="social-link tiktok">
                                        <span className="social-icon">🎵</span>
                                        <span>TikTok</span>
                                    </a>
                                </div>
                                 <p className="contact-description">Kövess be a social médián!</p>
                             </div>
                         </div>
                     </div>
                 </section>
                </>
                )}
            </main>
        </div>
    );
}
