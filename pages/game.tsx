import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MathInputToolbar from '../components/MathInputToolbar';
import {
    assignStagesToQuestions,
    applyAndSaveProgress,
    getBadgeDef,
    getRankEmoji,
    getRankTitle,
    loadUserPracticeProgress,
    resolveProgressStorageKey,
    STAGE_LABELS,
    xpForNextRank,
    type BadgeId,
    type PracticeStage,
} from '../utils/practiceProgress';
import {
    PATH_LESSON_XP,
    buildPathQuestionBank,
    getLessonQuestions,
    isLessonUnlocked,
    isWorksheetTopicId,
    lessonToStage,
} from '../utils/topicPath';
import {
    elementaryTopics as ELEMENTARY_TOPICS_FROM_CATALOG,
    highschoolTopics as HIGHSCHOOL_TOPICS_FROM_CATALOG,
    universitySubjects as UNIVERSITY_SUBJECTS_FROM_CATALOG,
    getTopicsForEducationLevel,
    type EducationLevelId,
} from '../utils/mathTopicsCatalog';
import {
    SPRINT_SECONDS,
    playCorrectSound,
    playLifeLostSound,
    playStreakSound,
    playWrongSound,
    streakBonusXp,
    type MascotMood,
} from '../utils/gameFeedback';
import { buildTopicPracticeHref } from '../utils/topicStats';

export default function Game() {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentSubQuestion, setCurrentSubQuestion] = useState(0);
    const [subQuestionAnswers, setSubQuestionAnswers] = useState<{ [key: number]: string }>({});
    const [showSolutions, setShowSolutions] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [userAnswer2, setUserAnswer2] = useState('');
    const [userAnswer3, setUserAnswer3] = useState('');
    const [userAnswer4, setUserAnswer4] = useState('');
    const [message, setMessage] = useState('');
    const [failedQuestions, setFailedQuestions] = useState<Question[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [showExpression, setShowExpression] = useState(false);
    const [avatarLevel, setAvatarLevel] = useState(1);
    const [avatarProgress, setAvatarProgress] = useState(0);
    const [totalXp, setTotalXp] = useState(0);
    const [correctStreak, setCorrectStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [sessionXp, setSessionXp] = useState(0);
    const [correctQuestionIds, setCorrectQuestionIds] = useState<string[]>([]);
    const [wrongFirstIds, setWrongFirstIds] = useState<string[]>([]);
    const [stagesCleared, setStagesCleared] = useState<PracticeStage[]>([]);
    const [badgeToast, setBadgeToast] = useState<string | null>(null);
    const [isWorksheetMode, setIsWorksheetMode] = useState(false);
    const [isPathMode, setIsPathMode] = useState(false);
    const [pathLesson, setPathLesson] = useState<number | null>(null);
    const [isSprintMode, setIsSprintMode] = useState(false);
    const [sprintLeft, setSprintLeft] = useState(SPRINT_SECONDS);
    const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
    const [isDailyMode, setIsDailyMode] = useState(false);
    const worksheetTopicKeyRef = useRef<string | null>(null);
    const pathLessonRef = useRef<number | null>(null);
    const livesRef = useRef(3);
    const sprintEndedRef = useRef(false);
    const correctQuestionIdsRef = useRef<string[]>([]);
    const wrongFirstIdsRef = useRef<string[]>([]);
    const erettsegiQuestionsRef = useRef<Question[]>([]);
    const [educationLevel, setEducationLevel] = useState<'elementary' | 'highschool' | 'university' | null>(null);
    const [universityQuestions, setUniversityQuestions] = useState<Question[]>([]);
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [currentTopic, setCurrentTopic] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [taskQuestions, setTaskQuestions] = useState<Question[]>([]);
    const [showErettsegiMenu, setShowErettsegiMenu] = useState(false);
    const [selectedErettsegiMode, setSelectedErettsegiMode] = useState<'topics' | 'papers' | null>(null);
    const [erettsegiQuestions, setErettsegiQuestions] = useState<Question[]>([]);
    const [isErettsegiMode, setIsErettsegiMode] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [selectedElementaryTopic, setSelectedElementaryTopic] = useState<string | null>(null);
    const [selectedHighschoolGrade, setSelectedHighschoolGrade] = useState<number | null>(null);
    const [selectedHighschoolTopic, setSelectedHighschoolTopic] = useState<string | null>(null);
    const [selectedUniversitySubject, setSelectedUniversitySubject] = useState<string | null>(null);
    const [selectedUniversityTopic, setSelectedUniversityTopic] = useState<string | null>(null);
    const [showSzigorlatMenu, setShowSzigorlatMenu] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('highScore');
            if (saved) {
                setHighScore(parseInt(saved));
            }
        }

        // Admin ellenőrzés
        const checkAuth = async () => {
            let attempts = 0;
            while (!(window as any).firebase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!(window as any).firebase) {
                setLoading(false);
                return;
            }

            try {
                const auth = (window as any).firebase.auth();
                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user) {
                        // Ha nincs bejelentkezve, engedjük a játékot
                        setLoading(false);
                        return;
                    }

                    setCurrentUser(user);

                    // Admin ellenőrzés - csak usezsolti@gmail.com férhet hozzá a játék módosításhoz
                    if (user.email === 'usezsolti@gmail.com') {
                        console.log('Admin hozzáférés engedélyezve:', user.email);
                        setIsAdmin(true);
                    } else {
                        console.log('Felhasználó játékban:', user.email);
                        setIsAdmin(false);
                    }
                    try {
                        const prog = await loadUserPracticeProgress(user.uid);
                        setTotalXp(prog.xp);
                        setAvatarLevel(prog.rankLevel);
                    } catch (e) {
                        console.error('Progress load error:', e);
                    }
                    setLoading(false);
                });

                return () => unsub();
            } catch (err) {
                console.error('Auth error:', err);
                setLoading(false);
            }
        };

        checkAuth();

        // URL paraméterek: oktatási szint (általános / gimi / egyetem)
        if (router.isReady) {
            const levelFromQuery = router.query.educationLevel as string | undefined;
            const uniboost = router.query.uniboost === 'true';
            const topicParam = typeof router.query.topic === 'string' ? router.query.topic : '';
            const gradeParam = router.query.grade ? parseInt(String(router.query.grade), 10) : NaN;

            let resolvedLevel: 'elementary' | 'highschool' | 'university' | null = null;
            if (levelFromQuery === 'elementary' || levelFromQuery === 'highschool' || levelFromQuery === 'university') {
                resolvedLevel = levelFromQuery;
            } else if (uniboost) {
                resolvedLevel = 'university';
            }

            if (resolvedLevel) {
                setEducationLevel(resolvedLevel);
            }
            if (topicParam) {
                setCurrentTopic(topicParam);
            }

            const pathRequested = router.query.path === '1';
            const dailyRequested = router.query.daily === '1';
            const sprintRequested = router.query.sprint === '1';

            if (dailyRequested && resolvedLevel && !gameActive) {
                const grade = !isNaN(gradeParam) ? gradeParam : resolvedLevel === 'elementary' ? 5 : 10;
                generateDailyMixedQuestions(resolvedLevel, grade);
            } else if (pathRequested && resolvedLevel && topicParam && !gameActive) {
                const grade = !isNaN(gradeParam)
                    ? gradeParam
                    : resolvedLevel === 'elementary'
                      ? 5
                      : 10;
                const runPath = async () => {
                    const nodeParsed = router.query.node != null
                        ? parseInt(String(router.query.node), 10)
                        : 1;
                    if (Number.isFinite(nodeParsed) && nodeParsed > 1) {
                        try {
                            let attempts = 0;
                            while (!(window as any).firebase?.auth && attempts < 30) {
                                await new Promise((r) => setTimeout(r, 100));
                                attempts++;
                            }
                            const uid = (window as any).firebase?.auth?.()?.currentUser?.uid || null;
                            const prog = await loadUserPracticeProgress(uid);
                            const key = resolveProgressStorageKey(topicParam);
                            const tp = prog.topics[key];
                            if (!isLessonUnlocked(nodeParsed, tp?.highestUnlocked || 1, tp?.lessonsCompleted || [])) {
                                router.replace(
                                    buildTopicPracticeHref(topicParam, resolvedLevel as EducationLevelId)
                                );
                                return;
                            }
                        } catch (e) {
                            console.error('Path unlock check:', e);
                        }
                    }
                    startPathLessonForEducationLevel(
                        resolvedLevel,
                        topicParam,
                        grade,
                        sprintRequested
                    );
                };
                void runPath();
            } else if (resolvedLevel === 'elementary' && topicParam && !gameActive) {
                const grade = !isNaN(gradeParam) && gradeParam >= 1 && gradeParam <= 8 ? gradeParam : 5;
                setSelectedGrade(grade);
                setSelectedElementaryTopic(topicParam);
                generateElementaryQuestionsByTopic(topicParam, grade);
            } else if (resolvedLevel === 'highschool' && topicParam && !gameActive) {
                const grade = !isNaN(gradeParam) && gradeParam >= 9 && gradeParam <= 12 ? gradeParam : 10;
                setSelectedHighschoolGrade(grade);
                setSelectedHighschoolTopic(topicParam);
                generateHighschoolQuestionsByTopic(topicParam, grade);
            } else if (resolvedLevel === 'university' && topicParam && !gameActive) {
                const knownSubject = ['analizis1', 'analizis2', 'analizis3'].includes(topicParam);
                if (knownSubject) {
                    setSelectedUniversitySubject(topicParam);
                } else {
                    setSelectedUniversitySubject(topicParam);
                    setSelectedUniversityTopic(topicParam);
                    generateUniversityQuestionsByTopic(topicParam, topicParam);
                }
            }
        }

        // Érettségi mód kezelése — path lecke: csak ha az előző kész
        if (router.query.erettsegi === 'true' && router.query.topic) {
            const topicId = router.query.topic as string;
            const level = (router.query.level as string) || 'emelt';
            const nodeParsed = router.query.node != null
                ? parseInt(String(router.query.node), 10)
                : NaN;
            const run = async () => {
                if (Number.isFinite(nodeParsed) && nodeParsed > 1) {
                    try {
                        let attempts = 0;
                        while (!(window as any).firebase?.auth && attempts < 30) {
                            await new Promise((r) => setTimeout(r, 100));
                            attempts++;
                        }
                        const uid = (window as any).firebase?.auth?.()?.currentUser?.uid || null;
                        const prog = await loadUserPracticeProgress(uid);
                        const key = resolveProgressStorageKey(topicId);
                        const tp = prog.topics[key];
                        const lessons = tp?.lessonsCompleted || [];
                        const unlocked = tp?.highestUnlocked || 1;
                        if (!isLessonUnlocked(nodeParsed, unlocked, lessons)) {
                            router.replace(
                                `/erettsegi-felkeszules?mode=topics&level=${level}&topic=${encodeURIComponent(topicId)}`
                            );
                            return;
                        }
                    } catch (e) {
                        console.error('Path unlock check:', e);
                    }
                }
                generateErettsegiQuestionsByTopic(topicId, level, router.query.sprint === '1');
            };
            void run();
        }

        // Napi vegyes (érettségi szint)
        if (router.isReady && router.query.daily === '1' && router.query.educationLevel === 'erettsegi') {
            generateDailyMixedQuestions('erettsegi', 10);
        }

        // Érettségi feladatsor kezelése - közép vagy emelt szintű feladatokkal vegyes témakörökből
        if (router.query.erettsegi === 'true' && router.query.paperId && router.query.level) {
            const level = router.query.level as string;
            generateMixedErettsegiQuestions(level);
        }

        // Érettségi feladatsor kezelése - vegyes közép és emelt szintű feladatokkal
        if (router.query.erettsegi === 'true' && router.query.paperId && router.query.mixed === 'true') {
            const level = (router.query.level as string) || 'kozep';
            generateMixedErettsegiQuestions(level);
        }

        // Központi felvételi kezelése - gimnáziumi felvételi felkészülés
        if (router.isReady && router.query.kozponti === 'true' && router.query.topic) {
            const topicId = router.query.topic as string;
            console.log('Központi felvételi detected, topicId:', topicId);
            generateKozpontiQuestionsByTopic(topicId);
        }

        // Szigorlat kezelése
        if (router.isReady && router.query.szigorlat === 'true') {
            if (router.query.vegyes === 'true') {
                generateVegyesSzigorlatQuestions();
            } else if (router.query.subject) {
                const subjectId = router.query.subject as string;
                generateSzigorlatQuestionsBySubject(subjectId);
            }
        }

        // Kártya feladatok betöltése
        if (router.query.taskId) {
            loadTaskQuestions(router.query.taskId as string);
        }

        // Kiosztott feladatok betöltése
        loadAssignedTasks();
    }, [router.query]);

    // Sprint visszaszámláló
    useEffect(() => {
        if (!gameActive || !isSprintMode) return;
        if (sprintLeft <= 0) {
            if (!sprintEndedRef.current) {
                sprintEndedRef.current = true;
                setMessage('Lejárt az idő! ⏱');
                setMascotMood('sad');
                setGameActive(false);
                void saveGameResults();
            }
            return;
        }
        const id = window.setTimeout(() => setSprintLeft((s) => s - 1), 1000);
        return () => window.clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameActive, isSprintMode, sprintLeft]);

    // Érettségi feladatok betöltése után automatikusan elindítjuk a játékot
    useEffect(() => {
        if (erettsegiQuestions.length > 0 && isErettsegiMode && !gameActive) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    }, [erettsegiQuestions, isErettsegiMode]);

    const loadTaskQuestions = async (taskId: string) => {
        try {
            if (!(window as any).firebase) {
                return;
            }

            const db = (window as any).firebase.firestore();

            // Kártya feladatok betöltése a customTasks collection-ból
            const snapshot = await db.collection('customTasks')
                .where('id', '==', taskId)
                .get();

            if (!snapshot.empty) {
                const taskDoc = snapshot.docs[0];
                const taskData = taskDoc.data();

                setSelectedTask(taskData);

                // Csak a customQuestions-okat használjuk, ha vannak
                if (taskData.customQuestions && taskData.customQuestions.length > 0) {
                    const taskLevel = taskData.educationLevel || 'university';
                    if (taskLevel === 'elementary' || taskLevel === 'highschool' || taskLevel === 'university') {
                        setEducationLevel(taskLevel);
                    }
                    const questions = taskData.customQuestions.map((q: any, index: number) => ({
                        id: `task_${taskId}_${index}`,
                        question: q.question || `Feladat ${index + 1}`,
                        answer: q.answer || 0,
                        expression: q.expression || '',
                        level: taskLevel
                    }));
                    setTaskQuestions(questions);
                    setGameActive(true);
                    setScore(0);
                    setLevel(1);
                    setLives(3);
                    setCurrentQuestion(0);
                } else {
                    // Ha nincsenek custom questions, üres tömb
                    setTaskQuestions([]);
                }
            }
        } catch (error) {
            console.error('Error loading task questions:', error);
        }
    };

    const generateTaskQuestions = (taskData: any) => {
        // Alapértelmezett feladatok generálása a kártya alapján
        const questions: Question[] = [];
        const taskCount = taskData.questions || 10;

        for (let i = 0; i < taskCount; i++) {
            const question = generateQuestionByTopic(taskData.topic || taskData.title);
            if (question) {
                questions.push({
                    ...question,
                    id: `generated_${taskData.id}_${i}`,
                    level: 'university'
                });
            }
        }

        setTaskQuestions(questions);
    };

    const generateQuestionByTopic = (topic: string) => {
        // Témakör alapján feladat generálása
        const topicLower = topic.toLowerCase();

        if (topicLower.includes('másodfokú') || topicLower.includes('egyenlet')) {
            return generateQuadraticQuestion();
        } else if (topicLower.includes('derivál') || topicLower.includes('derivált')) {
            return generateDerivativeQuestion();
        } else if (topicLower.includes('trigonometri')) {
            return generateTrigonometryQuestion();
        } else if (topicLower.includes('integrál')) {
            return generateIntegralQuestion();
        } else if (topicLower.includes('geometri')) {
            return generateGeometryQuestion();
        } else {
            // Alapértelmezett algebra feladat
            return generateAlgebraQuestion();
        }
    };

    // Paraméteres egyenletek gyakorló feladatai (munkalap 1–12)
    const getParameterPracticeQuestions = (): Question[] => [
        {
            question: `1. Adott gyök\n\nAdott az x² − (p + 5)x + 3p + 2 = 0 egyenlet, ahol p valós paraméter.\n\na) Határozd meg p értékét úgy, hogy az egyenlet egyik gyöke 2 legyen!\nb) Határozd meg ebben az esetben az egyenlet másik gyökét!\n\nAdd meg: p, majd a másik gyököt!`,
            answer: 4,
            alternativeAnswer: 7,
            type: 'multiplication',
            expression: `a) x=2 behelyettesítve: 4 − 2(p+5) + 3p + 2 = 0 → p − 4 = 0 → p = 4\nb) Gyökök összege: p+5 = 9 → 2 + x₂ = 9 → x₂ = 7`
        },
        {
            question: `2. Két különböző valós gyök\n\nHatározd meg az m valós paraméter összes lehetséges értékét úgy, hogy az\nx² − (2m − 1)x + m + 2 = 0\negyenletnek pontosan két különböző valós gyöke legyen!\n\nAdd meg a D = 0 határértékeit (kisebb, majd nagyobb), 3 tizedesjegyre!\n(A megoldás: m < kisebb vagy m > nagyobb.)`,
            answer: -0.658,
            alternativeAnswer: 2.658,
            type: 'multiplication',
            expression: `D = (2m−1)² − 4(m+2) = 4m² − 8m − 7\nD > 0 ⇔ m < (2−√11)/2 ≈ −0,658 vagy m > (2+√11)/2 ≈ 2,658`
        },
        {
            question: `3. Pontosan egy valós megoldás\n\nHatározd meg a p paraméter összes lehetséges értékét úgy, hogy a\n(p − 1)x² − 2(p + 1)x + p + 5 = 0\negyenletnek pontosan egy valós megoldása legyen!\n\nFigyelem: külön vizsgáld meg, amikor az egyenlet nem másodfokú!\n\nAdd meg a két p értéket (tetszőleges sorrendben)!`,
            answer: 1,
            alternativeAnswer: 3,
            type: 'multiplication',
            expression: `p = 1 (lineáris): −4x + 6 = 0 → x = 3/2 (egy megoldás)\nMásodfokú (p ≠ 1): D = 0 → p = 3\nTehát p = 1 vagy p = 3`
        },
        {
            question: `4. Nincs valós gyök\n\nHatározd meg a p valós paraméter értékeit úgy, hogy az\nx² + 2px + p + 5 = 0\negyenletnek ne legyen valós gyöke!\n\nAdd meg a D = 0 határértékeit (kisebb, majd nagyobb), 3 tizedesjegyre!\n(A megoldás: kisebb < p < nagyobb.)`,
            answer: -1.791,
            alternativeAnswer: 2.791,
            type: 'multiplication',
            expression: `D = 4p² − 4(p+5) = 4(p² − p − 5)\nD < 0 ⇔ (1−√21)/2 < p < (1+√21)/2 ≈ −1,791 < p < 2,791`
        },
        {
            question: `5. A gyökök négyzetösszege\n\nAz x² − (p + 2)x + 2p = 0 egyenlet valós gyökei x₁ és x₂.\nHatározd meg p értékét úgy, hogy x₁² + x₂² = 10 teljesüljön!\n\nAdd meg a két p értéket 3 tizedesjegyre (tetszőleges sorrendben)!`,
            answer: 2.449,
            alternativeAnswer: -2.449,
            type: 'multiplication',
            expression: `x₁² + x₂² = (x₁+x₂)² − 2x₁x₂ = (p+2)² − 4p = p² + 4 = 10\np² = 6 → p = ±√6 ≈ ±2,449\n(D ≥ 0 mindkét esetben teljesül)`
        },
        {
            question: `6. A gyökök különbsége\n\nAz x² − (m + 1)x + m − 2 = 0 egyenlet két valós gyöke x₁ és x₂.\nHatározd meg m értékét úgy, hogy |x₁ − x₂| = 4 legyen!\n\nAdd meg a két m értéket 3 tizedesjegyre (tetszőleges sorrendben)!`,
            answer: 3.828,
            alternativeAnswer: -1.828,
            type: 'multiplication',
            expression: `|x₁−x₂| = √((m+1)² − 4(m−2)) = √(m² − 2m + 9) = 4\nm² − 2m − 7 = 0 → m = 1 ± 2√2 ≈ 3,828 és −1,828`
        },
        {
            question: `7. Lineáris paraméteres egyenlet\n\nVizsgáld meg a p paraméter értékétől függően az (p − 2)x = p + 2 egyenletet!\nHatározd meg, hogy mely p értékek esetén van:\n1. pontosan egy megoldás;\n2. nincs megoldás;\n3. végtelen sok megoldás.\nHa egyetlen megoldás van, add meg azt is!\n\nAdd meg:\n1) az x megoldást, ha p = 6 (egy megoldás esete);\n2) a p értéket, amikor nincs megoldás;\n3) van-e p, ahol végtelen sok megoldás van? (1 = igen, 0 = nem)`,
            answer: 2,
            alternativeAnswer: 2,
            thirdAnswer: 0,
            type: 'multiplication',
            expression: `p ≠ 2: pontosan egy megoldás, x = (p+2)/(p−2)\npl. p = 6 → x = 8/4 = 2\np = 2: 0·x = 4 → nincs megoldás\nVégtelen sok megoldás: soha (0 = 0 soha nem áll fenn)`
        },
        {
            question: `8. Abszolútértékes paraméteres egyenlet\n\nVizsgáld meg a p valós paraméter függvényében a |2x − 5| = p − 1 egyenlet megoldásainak számát!\nHatározd meg, hogy mely p értékek esetén van:\n• nulla valós megoldás;\n• egy valós megoldás;\n• két valós megoldás.\n\nAdd meg:\n1) a p értéket, amikor pontosan egy megoldás van;\n2) a megoldások számát, ha p = 4 (két megoldás esete);\n3) a megoldások számát, ha p = 0 (nulla megoldás esete).`,
            answer: 1,
            alternativeAnswer: 2,
            thirdAnswer: 0,
            type: 'multiplication',
            expression: `p < 1: jobb oldal negatív → 0 megoldás (pl. p = 0)\np = 1: |2x−5| = 0 → egy megoldás (x = 5/2)\np > 1: két megoldás (pl. p = 4)`
        },
        {
            question: `9. Paraméteres harmadfokú függvény\n\nLegyen fₚ(x) = −x³ + (p + 1)x² + (p² − 4)x − 2.\n\na) Határozd meg p értékét úgy, hogy x = 1 az fₚ zérushelye legyen!\nb) Határozd meg p értékeit úgy, hogy fₚ'(1) > 0 teljesüljön!\n\nAdd meg a) két p értékét, majd b) két határértékét 3 tizedesjegyre!`,
            answer: 2,
            alternativeAnswer: -3,
            thirdAnswer: -3.449,
            fourthAnswer: 1.449,
            type: 'multiplication',
            expression: `a) f(1) = 0 → p² + p − 6 = 0 → (p+3)(p−2) = 0 → p = 2 vagy p = −3\nb) f'(1) = p² + 2p − 5 > 0 → p < −1−√6 ≈ −3,449 vagy p > −1+√6 ≈ 1,449`
        },
        {
            question: `10. Egyenes érinti a parabolát\n\nAdott az y = x² − 4x + 1 parabola és az y = mx − 3 egyenes.\nHatározd meg az m paraméter értékét úgy, hogy az egyenes érintse a parabolát!\nHatározd meg az érintési pontok x-koordinátáit is!\n\nAdd meg a két m értéket, majd a két érintési pont x-ét (tetszőleges sorrendben)!`,
            answer: 0,
            alternativeAnswer: -8,
            thirdAnswer: 2,
            fourthAnswer: -2,
            type: 'multiplication',
            expression: `x² − (4+m)x + 4 = 0, D = 0 → m = 0 vagy m = −8\nm = 0: érintési pont (2, −3)\nm = −8: érintési pont (−2, 13)`
        },
        {
            question: `11. Egyenes és kör helyzete\n\nAdott az x² + y² − 8x + 12 = 0 egyenletű kör és az y = mx egyenes.\nHatározd meg az m valós paraméter összes lehetséges értékét úgy, hogy az egyenesnek és a körnek ne legyen közös pontja!\n\nAdd meg a pozitív határértéket 3 tizedesjegyre!\n(A megoldás: |m| > ez az érték.)`,
            answer: 0.577,
            type: 'multiplication',
            expression: `Kör: (x−4)² + y² = 4, középpont (4,0), r = 2\nTávolság > r: |4m|/√(m²+1) > 2 → |m| > 1/√3 ≈ 0,577`
        },
        {
            question: `12. Szöveges paraméteres feladat\n\nEgy webáruház egy termék árát p%-kal csökkenti. Ennek hatására az eladott darabszám 3p%-kal nő.\nA modell csak 0 < p < 30 esetén használható.\nHány százalékkal csökkentették a termék árát, ha az árbevétel 12%-kal nőtt?\n\nAdd meg p értékét 3 tizedesjegyre!`,
            answer: 6.667,
            type: 'multiplication',
            expression: `(1 − p/100)(1 + 3p/100) = 1,12\n3p² − 200p + 1200 = 0 → p = 60 (nem engedett) vagy p = 20/3 ≈ 6,667`
        }
    ];

    // Exponenciális és logaritmusos gyakorló feladatok (emelt algebra munkalap 1–16)
    const getExponentialLogPracticeQuestions = (): Question[] => [
        {
            question: `1. Értelmezési tartomány\n\nAdd meg a valós számok halmazának azt a legbővebb részhalmazát, amelyen az alábbi kifejezések értelmezhetők!\n\na) log₃(√(2x − 1))\nb) √(log₂(x + 3))\nc) log_{x−1}(9 − x²)\nd) √(x + 4) / log₂(x − 2)\n\nAdd meg:\n1) a) alsó határát (nyílt), 3 tizedesjegyre;\n2) b) alsó határát (zárt);\n3) d) kizárt belső pontját!`,
            answer: 0.5,
            alternativeAnswer: -2,
            thirdAnswer: 3,
            type: 'multiplication',
            expression: `a) 2x−1 > 0 → x > 1/2\nb) log₂(x+3) ≥ 0 → x+3 ≥ 1 → x ≥ −2\nc) (1,2) ∪ (2,3)\nd) x > 2 és x ≠ 3`
        },
        {
            question: `2. Gyökös egyenletek\n\nOldd meg a valós számok halmazán!\n\na) √(x + 5) = 3 − x\nb) √(3x − 2) = x\nc) √(2x + 7) − √(x + 3) = 1\n\nAdd meg a) megoldását 3 tizedesjegyre, majd b) két megoldását!`,
            answer: 0.628,
            alternativeAnswer: 1,
            thirdAnswer: 2,
            type: 'multiplication',
            expression: `a) x = (7−√33)/2 ≈ 0,628\nb) x = 1 és x = 2\nc) x = −3 vagy x = 1`
        },
        {
            question: `2c. Gyökös egyenlet\n\nOldd meg a valós számok halmazán!\n\n√(2x + 7) − √(x + 3) = 1\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
            answer: -3,
            alternativeAnswer: 1,
            type: 'multiplication',
            expression: `√(2x+7) = 1 + √(x+3) → t = √(x+3): t² = 2t → x = −3 vagy x = 1`
        },
        {
            question: `3. Két gyökös tagot tartalmazó egyenlet\n\nOldd meg a valós számok halmazán!\n\n√(5x − 4) = √(x + 8) + 2\n\nA megoldás során minden négyzetre emelés előtt vizsgáld meg az ekvivalencia feltételeit!\n\nAdd meg a megoldást!`,
            answer: 8,
            type: 'multiplication',
            expression: `x − 4 = √(x+8) (x ≥ 4) → x² − 9x + 8 = 0 → x = 8`
        },
        {
            question: `7. Exponenciális egyenletek\n\nOldd meg a valós számok halmazán!\n\na) 3^{2x−1} = 27^{x−2}\nb) 2^{x+2} + 2^x = 80\nc) 4^x − 5·2^x + 4 = 0\nd) 9^x + 3^{x+1} − 18 = 0\n\nAdd meg a), b), d) megoldását, majd c) nagyobbik megoldását!`,
            answer: 5,
            alternativeAnswer: 4,
            thirdAnswer: 1,
            fourthAnswer: 2,
            type: 'multiplication',
            expression: `a) x = 5\nb) x = 4\nc) x = 0 vagy 2\nd) x = 1`
        },
        {
            question: `8. Helyettesítéssel megoldható exponenciális egyenlet\n\nOldd meg a valós számok halmazán!\n\n5^{2x} − 26·5^x + 25 = 0\n\nA megoldás során vezess be új ismeretlent: t = 5^x.\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
            answer: 0,
            alternativeAnswer: 2,
            type: 'multiplication',
            expression: `t = 5^x: t² − 26t + 25 = 0 → t = 1 vagy 25 → x = 0 vagy 2`
        },
        {
            question: `9. Exponenciális egyenlőtlenségek\n\nOldd meg a valós számok halmazán!\n\na) 2^{3x−1} > 16\nb) (1/3)^{2x+1} ≤ 27\nc) 4^x − 5·2^x + 4 ≤ 0\n\nAdd meg:\n1) a) alsó határát 3 tizedesjegyre (x > …);\n2) b) alsó határát (x ≥ …);\n3) c) alsó, majd felső határát (zárt)!`,
            answer: 1.667,
            alternativeAnswer: -2,
            thirdAnswer: 0,
            fourthAnswer: 2,
            type: 'multiplication',
            expression: `a) x > 5/3 ≈ 1,667\nb) x ≥ −2\nc) 0 ≤ x ≤ 2`
        },
        {
            question: `10. Logaritmusos egyenletek\n\nOldd meg a valós számok halmazán!\n\na) log₂(x − 1) = 3\nb) log₃(x + 5) + log₃(x − 1) = 2\nc) log₂(x + 2) − log₂(x − 2) = 1\nd) lg x + lg(x − 9) = 2\n\nAdd meg a), c) megoldását, majd b) és d) megoldását 3 tizedesjegyre!`,
            answer: 9,
            alternativeAnswer: 6,
            thirdAnswer: 2.243,
            fourthAnswer: 15.466,
            type: 'multiplication',
            expression: `a) x = 9\nb) x ≈ 2,243\nc) x = 6\nd) x ≈ 15,466`
        },
        {
            question: `11. Logaritmusos egyenlőtlenségek\n\nOldd meg a valós számok halmazán!\n\na) log₂(3x − 1) ≥ 3\nb) log_{1/2}(x + 4) < −2\nc) Hány egész szám elégíti ki: log₃(2x + 7) ≤ 4?\n\nAdd meg:\n1) a) alsó határát (x ≥ …);\n2) b) alsó határát (x > …);\n3) c) egész megoldások számát!`,
            answer: 3,
            alternativeAnswer: 0,
            thirdAnswer: 41,
            type: 'multiplication',
            expression: `a) x ≥ 3\nb) x > 0\nc) −3,…,37 → 41 db`
        },
        {
            question: `12. Változó alapú logaritmus\n\nOldd meg a valós számok halmazán!\n\nlog_{x−1}(x + 5) = 2\n\nA megoldás során külön vizsgáld meg: x−1 > 0, x−1 ≠ 1, x+5 > 0.\n\nAdd meg a megoldást!`,
            answer: 4,
            type: 'multiplication',
            expression: `x+5 = (x−1)² → x = 4`
        },
        {
            question: `13. Logaritmikus egyenletrendszer\n\nOldd meg az alábbi egyenletrendszert, ahol x és y pozitív valós számok!\n\nx + y = 10\nlog₂ x + log₂ y = 4\n\nAdd meg a két lehetséges x (vagy y) értéket (tetszőleges sorrendben)!`,
            answer: 2,
            alternativeAnswer: 8,
            type: 'multiplication',
            expression: `xy = 16, x+y = 10 → (2,8) és (8,2)`
        },
        {
            question: `14. Vegyes gyökös és logaritmikus feladat\n\nOldd meg a valós számok halmazán!\n\nlog₂(√(x + 1)) = 2\n\nEllenőrizd, hogy a kapott megoldás eleme-e az értelmezési tartománynak!\n\nAdd meg a megoldást!`,
            answer: 15,
            type: 'multiplication',
            expression: `√(x+1) = 4 → x = 15`
        },
        {
            question: `15. Szöveges exponenciális feladat\n\nEgy baktériumtenyészetben kezdetben 500 baktérium. Számuk óránként 25%-kal nő:\nN(t) = 500 · 1,25^t\n\na) Hány baktérium lesz 4 óra múlva?\nb) Hány óra múlva lesz először legalább 2000?\nc) Az aₙ = 500 · 1,25ⁿ sorozat monoton növekvő? (1 = igen, 0 = nem)\n\nAdd meg a), b) értékét 3 tizedesjegyre, majd c) válaszát!`,
            answer: 1220.703,
            alternativeAnswer: 6.213,
            thirdAnswer: 1,
            type: 'multiplication',
            expression: `a) N(4) = 1220,703\nb) t ≈ 6,213\nc) q = 1,25 > 1 → szigorúan monoton növekvő`
        },
        {
            question: `16. Mihaszna-mesterfok\n\nOldd meg a valós számok halmazán!\n\na) √(x + 6) + √(10 − x) = 4\nb) 2^{x+1} + 2^{1−x} = 5\n\nAdd meg a) két megoldását, majd b) két megoldását (tetszőleges sorrendben)!`,
            answer: -6,
            alternativeAnswer: 10,
            thirdAnswer: -1,
            fourthAnswer: 1,
            type: 'multiplication',
            expression: `a) x = −6 és x = 10\nb) x = −1 és x = 1`
        },
        {
            question: `16c–d. Mihaszna-mesterfok\n\nOldd meg a valós számok halmazán!\n\nc) log₂(x − 1) + log₂(x + 3) = 3\nd) |x − 1| = √(x + 5)\n\nAdd meg c) megoldását 3 tizedesjegyre, majd d) két megoldását!`,
            answer: 2.464,
            alternativeAnswer: -1,
            thirdAnswer: 4,
            type: 'multiplication',
            expression: `c) x = −1 + 2√3 ≈ 2,464\nd) x = −1 vagy x = 4`
        }
    ];

    // Abszolútértékes és gyökös kifejezések (emelt algebra munkalap 1–11)
    const getAbsoluteRootPracticeQuestions = (): Question[] => [
        {
            question: `1. Értelmezési tartomány\n\nAdd meg a valós számok halmazának azt a legbővebb részhalmazát, amelyen az alábbi kifejezések értelmezhetők!\n\na) √(5 − 2x)\nb) 1 / √(3x + 6)\nc) √((x − 1)/(x + 4))\nd) √(x + 5) / (x² − 9)\n\nAdd meg:\n1) a) felső határát (zárt), 3 tizedesjegyre;\n2) b) alsó határát (nyílt);\n3) d) pozitív kizárt pontját!`,
            answer: 2.5,
            alternativeAnswer: -2,
            thirdAnswer: 3,
            type: 'multiplication',
            expression: `a) x ≤ 5/2 = 2,5\nb) x > −2\nc) (−∞, −4) ∪ [1, ∞)\nd) x ≥ −5, x ≠ ±3`
        },
        {
            question: `2. Egyszerű gyökös egyenletek\n\nOldd meg a valós számok halmazán!\n\na) √(x + 6) = x\nb) √(8 − 2x) = x + 1\nc) √(3x + 4) = x + 2\n\nAdd meg a), b) megoldását 3 tizedesjegyre, majd c) nagyobbik megoldását!`,
            answer: 3,
            alternativeAnswer: 1.317,
            thirdAnswer: 0,
            type: 'multiplication',
            expression: `a) x = 3\nb) x = −2 + √11 ≈ 1,317\nc) x = −1 vagy x = 0`
        },
        {
            question: `3. Két gyökös tagot tartalmazó egyenlet\n\nOldd meg a valós számok halmazán!\n\n√(2x + 9) − √(x + 1) = 2\n\nA megoldás során minden négyzetre emelés előtt írd fel az ekvivalens átalakításhoz szükséges feltételeket!\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
            answer: 0,
            alternativeAnswer: 8,
            type: 'multiplication',
            expression: `√(2x+9) = 2 + √(x+1) → négyzetre emelés után x = 0 vagy x = 8`
        },
        {
            question: `4. Gyökös egyenlőtlenségek\n\nOldd meg a valós számok halmazán!\n\na) √(3x − 2) ≤ 4\nb) √(x + 5) > x − 1\nc) Hány egész szám elégíti ki: √(20 − 2x) ≥ 2? — add meg inkább a megoldás felső határát (x ≤ …)!\n\nAdd meg a) alsó és felső határát 3 tizedesjegyre, majd c) felső határát!`,
            answer: 0.667,
            alternativeAnswer: 6,
            thirdAnswer: 8,
            type: 'multiplication',
            expression: `a) 2/3 ≤ x ≤ 6\nb) −5 ≤ x < 4\nc) x ≤ 8`
        },
        {
            question: `5. Abszolútértékes egyenletek\n\nOldd meg a valós számok halmazán!\n\na) |2x − 3| = x + 4\nb) |x + 2| = 3x − 1\nc) |x − 4| + |x + 1| = 11\n\nAdd meg a) két megoldását 3 tizedesjegyre, majd b) megoldását!`,
            answer: 7,
            alternativeAnswer: -0.333,
            thirdAnswer: 1.5,
            type: 'multiplication',
            expression: `a) x = 7 vagy x = −1/3\nb) x = 3/2\nc) x = −4 vagy x = 7`
        },
        {
            question: `5c. Abszolútértékes egyenlet\n\nOldd meg a valós számok halmazán!\n\n|x − 4| + |x + 1| = 11\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
            answer: -4,
            alternativeAnswer: 7,
            type: 'multiplication',
            expression: `Esetszétválasztás: x = −4 vagy x = 7`
        },
        {
            question: `6. Abszolútértékes egyenlőtlenségek\n\nOldd meg a valós számok halmazán!\n\na) |3x − 2| < 7\nb) |2x + 5| ≥ 9\nc) |x − 3| ≤ |x + 5|\n\nAdd meg a) alsó és felső határát 3 tizedesjegyre (nyílt), majd c) alsó határát (zárt)!`,
            answer: -1.667,
            alternativeAnswer: 3,
            thirdAnswer: -1,
            type: 'multiplication',
            expression: `a) −5/3 < x < 3\nb) x ≤ −7 vagy x ≥ 2\nc) x ≥ −1`
        },
        {
            question: `7. Esetszétválasztás\n\nOldd meg a valós számok halmazán!\n\n3|x| = 2x + 5\n\nA megoldást az alábbi két eset vizsgálatával végezd el: x ≥ 0 és x < 0.\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
            answer: 5,
            alternativeAnswer: -1,
            type: 'multiplication',
            expression: `x ≥ 0: x = 5\nx < 0: x = −1`
        },
        {
            question: `8. Másodfokú kifejezés abszolútértékben\n\nOldd meg a valós számok halmazán!\n\n|x² − 4x + 1| = 5\n\nAdd meg a két megoldást 3 tizedesjegyre (tetszőleges sorrendben)!`,
            answer: 4.828,
            alternativeAnswer: -0.828,
            type: 'multiplication',
            expression: `x² − 4x + 1 = ±5 → x = 2 ± 2√2 ≈ 4,828 és −0,828`
        },
        {
            question: `9. Gyökös kifejezés és abszolútérték\n\nOldd meg a valós számok halmazán!\n\n√(x + 4) = |x − 2|\n\nElőször határozd meg az értelmezési tartományt, majd a négyzetre emelés után ellenőrizd a gyököket!\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
            answer: 0,
            alternativeAnswer: 5,
            type: 'multiplication',
            expression: `x ≥ −4 → x = 0 vagy x = 5 (ellenőrzés: mindkettő jó)`
        },
        {
            question: `10. Halmazok gyökös feltétellel\n\nH: pozitív egészek, amelyekre √(18 − x) ≥ 3.\nB: pozitív egészek b, amelyekre log_b 81 pozitív egész.\n\na) Határozd meg H-t!\nb) Határozd meg B-t!\nc) H ∩ B\nd) B ∖ H\n\nAdd meg |H|, |B|, |H ∩ B| értékét!`,
            answer: 9,
            alternativeAnswer: 3,
            thirdAnswer: 2,
            type: 'multiplication',
            expression: `H = {1,…,9}, B = {3,9,81}\nH ∩ B = {3,9}, B ∖ H = {81}`
        },
        {
            question: `11. Mihaszna-mesterfok\n\nOldd meg a valós számok halmazán!\n\na) √(x + 7) + √(11 − x) = 6\nb) |x + 1| = √(3x + 7)\n\nAdd meg a) megoldását, majd b) két megoldását (tetszőleges sorrendben)!`,
            answer: 2,
            alternativeAnswer: 3,
            thirdAnswer: -2,
            type: 'multiplication',
            expression: `a) x = 2\nb) x = 3 vagy x = −2`
        },
        {
            question: `11c–d. Mihaszna-mesterfok\n\nOldd meg a valós számok halmazán!\n\nc) √(x² − 4x + 7) = x − 1\nd) |x − 2| + |2x + 1| = 8\n\nAdd meg c) megoldását, majd d) két megoldását 3 tizedesjegyre!`,
            answer: 3,
            alternativeAnswer: -2.333,
            thirdAnswer: 3,
            type: 'multiplication',
            expression: `c) x = 3\nd) x = −7/3 ≈ −2,333 vagy x = 3`
        }
    ];

    // Függvények és analízis (emelt munkalap 1–10) — numerikus ellenőrző kérdések
    const getFunctionsPracticeQuestions = (): Question[] => [
        {
            question: `1. Paraméteres függvény\n\nLegyen p valós paraméter, és tekintsük a valós számok halmazán értelmezett\nfₚ(x) = −2x³ + (p − 1)x² + (p² − 4)x − 3 függvényt!\n\na) Számítsd ki a ∫₀² fₚ(x) dx határozott integrál értékét, ha p = 2!\nb) Határozd meg p értékét úgy, hogy az x = 1 az fₚ függvény zérushelye legyen!\nc) Határozd meg p összes lehetséges értékét úgy, hogy fₚ'(1) > 0 teljesüljön!\n\nAdd meg:\n1) a) értékét 3 tizedesjegyre;\n2) b) pozitív p értékét 3 tizedesjegyre;\n3) c) alsó, majd felső határát (p < … vagy p > …) 3 tizedesjegyre!`,
            answer: -11.333,
            alternativeAnswer: 2.702,
            thirdAnswer: -4.606,
            fourthAnswer: 2.606,
            type: 'multiplication',
            expression: `a) p=2: f₂(x)=−2x³+x²−3 → ∫₀² = −34/3 ≈ −11,333\nb) fₚ(1)=0 → p²+p−10=0 → p = (−1±√41)/2 ≈ 2,702 és −3,702\nc) fₚ'(1)=p²+2p−12 > 0 → p < −1−√13 vagy p > −1+√13 ≈ −4,606 illetve 2,606`
        },
        {
            question: `2. Konzervdoboz optimalizálása\n\nEgy üzemben 1500 cm³ térfogatú, zárt, forgáshenger alakú dobozokat gyártanak. A doboz alap- és fedőlapjához használt anyag ára 0,3 Ft/cm², a palást anyagának ára pedig 0,15 Ft/cm². Jelölje r a doboz alapkörének sugarát, h pedig a magasságát centiméterben!\n\na) Fejezd ki a doboz h magasságát az r sugár segítségével!\nb) Igazold, hogy a doboz teljes anyagköltségét a\nK(r) = 0,6πr² + 450/r, r > 0\nfüggvény adja meg!\nc) Határozd meg a doboz optimális sugarát és magasságát úgy, hogy az anyagköltség minimális legyen! Válaszodat centiméterben, egy tizedesjegyre kerekítve add meg!\n\nAdd meg c) optimális sugarát, majd magasságát (egy tizedesjegy)!`,
            answer: 4.9,
            alternativeAnswer: 19.7,
            type: 'multiplication',
            expression: `a) h = 1500/(πr²)\nb) K = 0,6πr² + 0,3πrh = 0,6πr² + 450/r\nc) K'(r)=0 → r³ = 375/π → r ≈ 4,9 cm, h ≈ 19,7 cm`
        },
        {
            question: `3. Függvényvizsgálat\n\nLegyen f: ]−3; 4[ → ℝ, f(x) = x³ − 3x² − 9x + 5.\n\na) Határozd meg az f' deriváltfüggvényt és annak zérushelyeit!\nb) Vizsgáld meg az f függvényt monotonitás szempontjából!\nc) Határozd meg az f függvény lokális szélsőértékeinek helyét és értékét!\nd) Add meg azt a g primitív függvényt, amelyre g'(x) = f(x) és g(1) = 0.\n\nAdd meg:\n1) f' kisebbik, majd nagyobbik zérushelyét;\n2) a lokális maximum értékét;\n3) a lokális minimum értékét!`,
            answer: -1,
            alternativeAnswer: 3,
            thirdAnswer: 10,
            fourthAnswer: -22,
            type: 'multiplication',
            expression: `f'(x)=3x²−6x−9=3(x+1)(x−3)\nNövekvő: ]−3,−1] és [3,4[; csökkenő: [−1,3]\nLok. max: f(−1)=10; lok. min: f(3)=−22\ng(x)=x⁴/4 − x³ − (9/2)x² + 5x + 1/4`
        },
        {
            question: `4. Érintő és területszámítás\n\nLegyen f(x) = 4x − x².\n\na) Igazold, hogy a függvény grafikonja az x = 0 és x = 4 helyeken metszi az x tengelyt!\nb) Írd fel a görbe x = 1 abszcisszájú pontjában húzott érintőjének egyenletét!\nc) Számítsd ki a görbe és az x tengely által közbezárt korlátos síkidom területét!\n\nAdd meg:\n1) az érintő meredekségét;\n2) az érintő y-tengelymetszetét;\n3) a területet 3 tizedesjegyre!`,
            answer: 2,
            alternativeAnswer: 1,
            thirdAnswer: 10.667,
            type: 'multiplication',
            expression: `a) f(0)=f(4)=0\nb) f'(x)=4−2x, f'(1)=2, f(1)=3 → y = 2x + 1\nc) ∫₀⁴ (4x−x²) dx = 32/3 ≈ 10,667`
        },
        {
            question: `5. Két függvény kapcsolata\n\nLegyen f(x) = 2x + 3 és g(x) = x² − 1.\n\na) Határozd meg a 2f + g függvény zérushelyeit!\nb) Határozd meg az f és g függvény grafikonjainak metszéspontjait!\nc) Számítsd ki az f és g függvények grafikonja által közbezárt korlátos síkidom területét!\nd) Legyen h(x) = g(x)/f(x). Határozd meg a h függvény értelmezési tartományát!\n\nAdd meg:\n1) a) valós zérushelyeinek számát;\n2) b) kisebbik, majd nagyobbik x-koordinátáját 3 tizedesjegyre;\n3) c) területét 3 tizedesjegyre!`,
            answer: 0,
            alternativeAnswer: -1.236,
            thirdAnswer: 3.236,
            fourthAnswer: 14.907,
            type: 'multiplication',
            expression: `a) 2f+g = x²+4x+5, D<0 → 0 db zérushely\nb) x = 1±√5 ≈ −1,236 és 3,236\nc) T = 20√5/3 ≈ 14,907\nd) ℝ ∖ {−3/2}`
        },
        {
            question: `6. Téglalap maximális területtel\n\nEgy 20 cm kerületű téglalap egyik oldalának hossza x cm.\n\na) Fejezd ki a téglalap másik oldalának hosszát x segítségével!\nb) Igazold, hogy a téglalap területét a T(x) = 10x − x², 0 < x < 10 függvény adja meg!\nc) Határozd meg a téglalap oldalainak hosszát úgy, hogy a területe maximális legyen!\nd) Határozd meg a maximális területét!\n\nAdd meg:\n1) a) értékét x = 4 esetén;\n2) c) mindkét oldal hosszát;\n3) d) maximális területét!`,
            answer: 6,
            alternativeAnswer: 5,
            thirdAnswer: 5,
            fourthAnswer: 25,
            type: 'multiplication',
            expression: `a) másik oldal: 10 − x (x=4 → 6)\nb) T = x(10−x) = 10x − x²\nc) T'=0 → x = 5, oldalak: 5 cm és 5 cm\nd) T_max = 25 cm²`
        },
        {
            question: `7. Közlekedési költség\n\nEgy futárszolgálat járművének üzemeltetési költsége két részből áll.\nAz x km/h átlagsebesség mellett az üzemeltetési költség kilométerenként (300 + 0,5x) forint.\nA sofőr órabére 1800 forint.\n\na) Igazold, hogy a kilométerenkénti teljes költséget a\nK(x) = 300 + 0,5x + 1800/x, x > 0\nfüggvény adja meg!\nb) Határozd meg azt az átlagsebességet, amelynél a kilométerenkénti költség minimális! Válaszodat egész kilométer per órára kerekítve add meg!\nc) Határozd meg a minimális kilométerenkénti költséget egész forintra kerekítve!\n\nAdd meg b) átlagsebességét (km/h), majd c) minimális költséget (Ft)!`,
            answer: 60,
            alternativeAnswer: 360,
            type: 'multiplication',
            expression: `a) bér km-enként: 1800/x → K(x) = 300 + 0,5x + 1800/x\nb) K'=0 → x = 60 km/h\nc) K(60) = 360 Ft`
        },
        {
            question: `8. Paraméteres határozott integrál\n\nLegyen fₚ(x) = x² + px − 2, ahol p valós paraméter.\n\na) Számítsd ki a ∫₀³ fₚ(x) dx integrált p függvényében!\nb) Határozd meg p értékét úgy, hogy ∫₀³ fₚ(x) dx = 0 teljesüljön!\nc) Határozd meg p értékét úgy, hogy az fₚ függvény grafikonjához az x = 1 abszcisszájú pontban húzott érintő párhuzamos legyen az y = 5x − 4 egyenessel!\n\nAdd meg:\n1) a) értékét p = 0 esetén;\n2) b) p értékét 3 tizedesjegyre;\n3) c) p értékét!`,
            answer: 3,
            alternativeAnswer: -0.667,
            thirdAnswer: 3,
            type: 'multiplication',
            expression: `a) ∫₀³ = 3 + (9/2)p (p=0 → 3)\nb) 3 + 9p/2 = 0 → p = −2/3 ≈ −0,667\nc) f'=2x+p, f'(1)=2+p = 5 → p = 3`
        },
        {
            question: `9. Bevétel maximalizálása\n\nEgy rendezvényre jelenleg 3000 darab belépőjegyet adnak el darabonként 4000 forintért. A szervezők becslése szerint minden 100 forintos áremelés 50-nel csökkenti az eladott jegyek számát.\nJelölje x a 100 forintos áremelések számát!\n\na) Fejezd ki a jegy új árát és az eladott jegyek számát x segítségével!\nb) Igazold, hogy a teljes bevételt a B(x) = (4000 + 100x)(3000 − 50x) függvény adja meg!\nc) Határozd meg azt a jegyárat, amely mellett a bevétel maximális!\nd) Határozd meg a maximális bevételt!\n\nAdd meg:\n1) a) jegyárat x = 2 esetén;\n2) c) optimális jegyárat;\n3) d) maximális bevételt!`,
            answer: 4200,
            alternativeAnswer: 5000,
            thirdAnswer: 12500000,
            type: 'multiplication',
            expression: `a) ár = 4000+100x, darab = 3000−50x (x=2 → 4200 Ft)\nb) B(x)=(4000+100x)(3000−50x)\nc) B'=0 → x=10 → ár = 5000 Ft\nd) B(10)=12 500 000 Ft`
        },
        {
            question: `10. Mihaszna-mesterfok\n\nLegyen f(x) = x⁴ − 4x³ − 2x² + 12x.\n\na) Határozd meg az f' deriváltfüggvény zérushelyeit!\nb) Vizsgáld meg a függvény monotonitását!\nc) Határozd meg a lokális szélsőértékek helyét és értékét!\nd) Határozd meg azokat az intervallumokat, amelyeken az f függvény konvex, illetve konkáv!\ne) Számítsd ki a ∫₀² f(x) dx határozott integrált!\n\nAdd meg f' három zérushelyét növekvő sorrendben, majd e) integrál értékét 3 tizedesjegyre!`,
            answer: -1,
            alternativeAnswer: 1,
            thirdAnswer: 3,
            fourthAnswer: 9.067,
            type: 'multiplication',
            expression: `f'(x)=4(x+1)(x−1)(x−3) → zérusok: −1, 1, 3\nLok. max: f(1)=7; lok. min: f(−1)=f(3)=−9\nKonvex: x < 1−(2/3)√3 vagy x > 1+(2/3)√3\n∫₀² f = 136/15 ≈ 9,067`
        }
    ];

    // Bizonyítási feladatok (emelt munkalap 1–21) — numerikus ellenőrző kérdések
    const getProofPracticeQuestions = (): Question[] => [
        {
            question: `1. Algebrai azonosság\n\nIgazold, hogy tetszőleges a, b ∈ ℝ esetén\n(a + b)⁴ − (a − b)⁴ = 8ab(a² + b²).\n\nEllenőrzésként: ha a = 2 és b = 1, mennyi a bal (és a jobb) oldal?`,
            answer: 80,
            type: 'multiplication',
            expression: `Bal: 3⁴ − 1⁴ = 81 − 1 = 80\nJobb: 8·2·1·(4+1) = 80`
        },
        {
            question: `2. Algebrai egyenlőtlenség\n\nBizonyítsd be, hogy tetszőleges pozitív a, b esetén\na/b + b/a ≥ 2.\nHatározd meg, mikor áll fenn egyenlőség!\n\nAdd meg:\n1) a minimum értékét;\n2) az a/b arányt egyenlőség esetén!`,
            answer: 2,
            alternativeAnswer: 1,
            type: 'multiplication',
            expression: `(√(a/b) − √(b/a))² ≥ 0 → a/b + b/a ≥ 2\nEgyenlőség ⇔ a = b ⇔ a/b = 1`
        },
        {
            question: `3. Nemnegatív kifejezés\n\nIgazold, hogy minden x ∈ ℝ esetén\nx⁴ − 4x³ + 8x² − 8x + 4 ≥ 0.\nHatározd meg azokat az x értékeket is, amelyekre egyenlőség áll fenn!\n\nHány valós x-re áll fenn egyenlőség?`,
            answer: 0,
            type: 'multiplication',
            expression: `= (x² − 2x + 2)² ≥ 0\nx² − 2x + 2 = 0 diszkriminánsa 4 − 8 < 0 → nincs valós gyök → egyenlőség soha`
        },
        {
            question: `4. Oszthatósági bizonyítás\n\nBizonyítsd be, hogy minden pozitív egész n esetén n³ − n osztható 6-tal!\n\nEllenőrzés: n = 5 esetén (n³ − n) / 6 = ?`,
            answer: 20,
            type: 'multiplication',
            expression: `n³ − n = n(n−1)(n+1) — három egymást követő egész → osztható 2-vel és 3-mal\nn = 5: 125 − 5 = 120, 120/6 = 20`
        },
        {
            question: `5. Maradékosztályos gondolkodás\n\nBizonyítsd be, hogy minden páratlan egész szám négyzete 8-cal osztva 1 maradékot ad!\n\nEllenőrzés: 9² = 81. Mennyi 81 mod 8?`,
            answer: 1,
            type: 'multiplication',
            expression: `(2k+1)² = 4k(k+1) + 1, és k(k+1) páros → 4k(k+1) osztható 8-cal\n81 = 10·8 + 1`
        },
        {
            question: `6. Indirekt bizonyítás\n\nBizonyítsd be indirekt módszerrel, hogy √3 irracionális!\n\nHa √3 = p/q (legkisebb pozitív egészek, lnko=1), akkor p² = 3q². Mivel 3 prímszám, p osztható 3-mal. Igaz-e, hogy √3 racionális? (1 = igen, 0 = nem)`,
            answer: 0,
            type: 'multiplication',
            expression: `Indirekt: √3 = p/q → p² = 3q² → 3 | p → p = 3r → 9r² = 3q² → 3 | q → ellentmondás az lnko=1-nek\nTehát √3 irracionális (nem racionális)`
        },
        {
            question: `7. Egész megoldás nem létezik\n\nBizonyítsd be, hogy nincs olyan egész n, amelyre n² + 2 osztható 4-gyel!\n\nAdd meg:\n1) n páros esetén (n² + 2) mod 4 értékét;\n2) n páratlan esetén (n² + 2) mod 4 értékét!`,
            answer: 2,
            alternativeAnswer: 3,
            type: 'multiplication',
            expression: `Páros: (2k)² + 2 ≡ 2 (mod 4)\nPáratlan: (2k+1)² + 2 ≡ 1 + 2 ≡ 3 (mod 4)\nEgyik sem 0`
        },
        {
            question: `8. Megfordítás és ellenpélda\n\nÁllítás: Ha egy pozitív egész osztható 12-vel, akkor osztható 4-gyel és 6-tal is.\n\na) Bizonyítsd be!\nb) Fogalmazd meg a megfordítást!\nc) A megfordítás igaz vagy hamis?\n\nAdd meg: az állítás igaz-e (1/0), majd a megfordítás igaz-e (1/0)!`,
            answer: 1,
            alternativeAnswer: 1,
            type: 'multiplication',
            expression: `12 | n ⇒ 4 | n és 6 | n (igaz)\nMegfordítás: 4 | n és 6 | n ⇒ 12 | n — szintén igaz, mert lnko(4,6)=2, lnko szerinti: lnko helyett lnko… valójában lcm(4,6)=12`
        },
        {
            question: `9. Teljes indukció\n\nBizonyítsd be teljes indukcióval:\n1 + 3 + 5 + … + (2n − 1) = n².\n\nEllenőrzés: n = 10 esetén a jobb oldal mennyi?`,
            answer: 100,
            type: 'multiplication',
            expression: `n = 1: 1 = 1²\nIndukció: összeg + (2n+1) = n² + 2n + 1 = (n+1)²\nn = 10 → 10² = 100`
        },
        {
            question: `10. Indukció és oszthatóság\n\nBizonyítsd be teljes indukcióval, hogy minden pozitív egész n esetén 5ⁿ − 1 osztható 4-gyel!\n\nEllenőrzés: n = 3 esetén (5³ − 1) / 4 = ?`,
            answer: 31,
            type: 'multiplication',
            expression: `5 ≡ 1 (mod 4) → 5ⁿ ≡ 1ⁿ ≡ 1 (mod 4)\n125 − 1 = 124, 124/4 = 31`
        },
        {
            question: `11. Négyzetösszeg\n\nBizonyítsd be teljes indukcióval:\n1² + 2² + … + n² = n(n+1)(2n+1)/6.\n\nEllenőrzés: n = 5 esetén az összeg mennyi?`,
            answer: 55,
            type: 'multiplication',
            expression: `5·6·11/6 = 55\n(1+4+9+16+25 = 55)`
        },
        {
            question: `12. Sorozat vizsgálata\n\naₙ = (2n + 3)/(3n + 4), n ∈ ℕ⁺.\nBizonyítsd be, hogy {aₙ}:\na) szigorúan monoton csökkenő;\nb) alulról korlátos;\nc) felülről korlátos.\n\nAdd meg lim aₙ értékét 3 tizedesjegyre, majd a₁ értékét 3 tizedesjegyre!`,
            answer: 0.667,
            alternativeAnswer: 0.714,
            type: 'multiplication',
            expression: `lim = 2/3 ≈ 0,667 (alsó korlát)\na₁ = 5/7 ≈ 0,714 (felső korlát)\naₙ − aₙ₊₁ > 0 → szigorúan csökkenő`
        },
        {
            question: `13. Paraméteres állítás\n\nx² − (2p + 3)x + p² + 3p + 1 = 0, p ∈ ℝ.\nBizonyítsd be, hogy minden p-re két különböző valós gyök van!\n\nAdd meg a diszkrimináns értékét (konstans)!`,
            answer: 5,
            type: 'multiplication',
            expression: `D = (2p+3)² − 4(p²+3p+1) = 4p² + 12p + 9 − 4p² − 12p − 4 = 5 > 0`
        },
        {
            question: `14. Háromszög magasságai\n\nEgy háromszög két magassága egyenlő hosszúságú. Bizonyítsd be, hogy a háromszög egyenlő szárú!\n\nHa hₐ = hᵦ, akkor az a/b oldalarány mennyi?`,
            answer: 1,
            type: 'multiplication',
            expression: `T = a·hₐ/2 = b·hᵦ/2 → a·hₐ = b·hᵦ → hₐ = hᵦ ⇒ a = b`
        },
        {
            question: `15. Geometriai egyenlőtlenség\n\nHáromszög oldalai a, b, c. Bizonyítsd be:\n(a + b − c)(a − b + c)(−a + b + c) > 0.\n\nEllenőrzés egyenlő oldalú a = b = c = 2 esetén a szorzat mennyi?`,
            answer: 8,
            type: 'multiplication',
            expression: `Háromszög-egyenlőtlenségek: a+b>c, a+c>b, b+c>a → mindhárom tényező pozitív\na=b=c=2: 2·2·2 = 8`
        },
        {
            question: `16. Húrnégyszög\n\nEgy konvex négyszög két szemközti szögének összege 180°. Bizonyítsd be, hogy a négyszög húrnégyszög!\n\nAdd meg a szemközti szögek összegét fokban (a feltétel szerint)!`,
            answer: 180,
            type: 'multiplication',
            expression: `Konvex négyszög húrnégyszög ⇔ szemközti szögek összege 180° (karakterizáció)`
        },
        {
            question: `17. Skatulyaelv\n\nEgy osztályban 31 tanuló van. Bizonyítsd be, hogy van legalább három olyan tanuló, akik ugyanabban a hónapban születtek!\n\nA skatulyaelv szerint legalább hány tanuló született ugyanabban a hónapban?`,
            answer: 3,
            type: 'multiplication',
            expression: `12 hónap (skatulyák), 31 tanuló\n⌈31/12⌉ = 3`
        },
        {
            question: `18. Gráfelméleti bizonyítás\n\nBizonyítsd be, hogy egy véges gráfban a páratlan fokszámú csúcsok száma páros!\n\nLétezhet-e gráf pontosan 1 páratlan fokszámú csúccsal? (1 = igen, 0 = nem)`,
            answer: 0,
            type: 'multiplication',
            expression: `∑ deg(v) = 2|E| páros → a páratlan fokú csúcsok száma páros\nTehát 1 páratlan fokú csúcs lehetetlen`
        },
        {
            question: `19. Binomiális együtthatók\n\nBizonyítsd be: C(n,0)+…+C(n,n) = 2ⁿ.\nAdj algebrai és kombinatorikus bizonyítást is!\n\nEllenőrzés: n = 6 esetén a jobb oldal mennyi?`,
            answer: 64,
            type: 'multiplication',
            expression: `(1+1)ⁿ = 2ⁿ\nKombinatorika: n elemű halmaz összes részhalmaza\n2⁶ = 64`
        },
        {
            question: `20. Mihaszna-mesterfok\n\nPozitív a, b, c. Bizonyítsd be:\n(a+b+c)(1/a + 1/b + 1/c) ≥ 9.\nHatározd meg, mikor áll fenn egyenlőség!\n\nAdd meg a minimumot, majd az a/b arányt egyenlőség esetén!`,
            answer: 9,
            alternativeAnswer: 1,
            type: 'multiplication',
            expression: `AM-HM / Cauchy: egyenlőség ⇔ a = b = c ⇔ a/b = 1\nMinimum = 9`
        },
        {
            question: `21. Mihaszna-főgonosz\n\nn oldalú konvex sokszög éleit/átlóit pirosra vagy kékre színezzük. Bizonyítsd be: ha n ≥ 6, akkor van egyszínű háromszög a csúcsok között!\n\nAdd meg a feladatban szereplő alsó korlátot (n ≥ …)!`,
            answer: 6,
            type: 'multiplication',
            expression: `Ramsey R(3,3) = 6: 6 pont 2-színezésénél van egyszínű háromszög\nn ≥ 6 elegendő`
        }
    ];

    const generateErettsegiQuestionByTopicId = (topicId: string, level: string): Question | null => {
        // Érettségi témakör ID alapján feladat generálása
        const topicIdLower = topicId.toLowerCase();

        // Abszolútérték, gyök — munkalap feladatok
        if (topicIdLower.includes('abszolutertek') || topicIdLower.includes('gyok')) {
            const list = getAbsoluteRootPracticeQuestions();
            return list[Math.floor(Math.random() * list.length)];
        }
        // Egyenletek, egyenlőtlenségek — munkalap (bizonyítási feladatsor 1–21)
        else if (topicIdLower.includes('egyenletek') || topicIdLower.includes('egyenlotlenseg')) {
            const list = getProofPracticeQuestions();
            return list[Math.floor(Math.random() * list.length)];
        }
        // Egyszerűsítések, átalakítások
        else if (topicIdLower.includes('egyszerusites') || topicIdLower.includes('atalakitas')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: összetett algebrai kifejezések
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 5) + 2;
                const c = Math.floor(Math.random() * 5) + 1;
                // (a² - b²) / (a - b) = a + b
                const answer = a + b;
                return {
                    question: `Egyszerűsítsd: (${a}² - ${b}²) / (${a} - ${b}) = ?`,
                    answer: answer,
                    type: 'multiplication',
                    expression: `(${a}² - ${b}²) / (${a} - ${b}) = (${a} - ${b})(${a} + ${b}) / (${a} - ${b}) = ${a} + ${b} = ${answer}`
                };
            }
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const answer = a * b;
            return {
                question: `${a} × ${b} = ?`,
                answer: answer,
                type: 'multiplication',
                expression: `${a} × ${b} = ${answer}`
            };
        }
        // Exponenciális és logaritmusos — munkalap feladatok
        else if (topicIdLower.includes('exponencialis') || topicIdLower.includes('logaritmus')) {
            const list = getExponentialLogPracticeQuestions();
            return list[Math.floor(Math.random() * list.length)];
        }
        // Függvények, analízis — munkalap feladatok
        else if (topicIdLower.includes('fuggveny') || topicIdLower.includes('analizis')) {
            const list = getFunctionsPracticeQuestions();
            return list[Math.floor(Math.random() * list.length)];
        }
        // Halmazok
        else if (topicIdLower.includes('halmaz')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: halmazműveletek
                const a = Math.floor(Math.random() * 5) + 3;
                const b = Math.floor(Math.random() * 5) + 3;
                const intersection = Math.floor(Math.random() * Math.min(a, b)) + 1;
                // |A ∪ B| = |A| + |B| - |A ∩ B|
                const answer = a + b - intersection;
                return {
                    question: `|A| = ${a}, |B| = ${b}, |A ∩ B| = ${intersection}. Mennyi |A ∪ B|?`,
                    answer: answer,
                    type: 'addition',
                    expression: `|A ∪ B| = |A| + |B| - |A ∩ B| = ${a} + ${b} - ${intersection} = ${answer}`
                };
            }
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const answer = a + b;
            return {
                question: `A = {1, 2, ..., ${a}}, B = {${a}, ${a+1}, ..., ${a+b}}. |A ∪ B| = ?`,
                answer: answer,
                type: 'addition',
                expression: `|A ∪ B| = ${answer}`
            };
        }
        // Kombinatorika
        else if (topicIdLower.includes('kombinatorika')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: valódi kombináció számítás
                const n = Math.floor(Math.random() * 5) + 5;
                const k = 2; // Egyszerűsítés: k=2 esetén C(n,2) = n*(n-1)/2
                const answer = (n * (n - 1)) / 2;
                return {
                    question: `${n} elem közül hányféleképpen választhatunk ki ${k} elemet?`,
                    answer: answer,
                    type: 'multiplication',
                    expression: `C(${n},${k}) = ${n}! / (${k}!(${n}-${k})!) = ${n} × ${n-1} / 2 = ${answer}`
                };
            }
            const n = Math.floor(Math.random() * 5) + 3;
            const k = Math.floor(Math.random() * (n - 1)) + 1;
            const answer = n * (n - 1) / 2;
            return {
                question: `${n} elem közül hányféleképpen választhatunk ki ${k} elemet? (Egyszerűsített)`,
                answer: Math.round(answer),
                type: 'multiplication',
                expression: `C(${n},${k}) ≈ ${Math.round(answer)}`
            };
        }
        // Koordinátageometria
        else if (topicIdLower.includes('koordinatageometria') || topicIdLower.includes('koordinata')) {
            const x1 = Math.floor(Math.random() * 10);
            const y1 = Math.floor(Math.random() * 10);
            const x2 = Math.floor(Math.random() * 10);
            const y2 = Math.floor(Math.random() * 10);
            const answer = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            return {
                question: `A(${x1}, ${y1}) és B(${x2}, ${y2}) pontok távolsága?`,
                answer: Math.round(answer * 10) / 10,
                type: 'multiplication',
                expression: `d = √((${x2}-${x1})² + (${y2}-${y1})²) = ${Math.round(answer * 10) / 10}`
            };
        }
        // Síkgeometria
        else if (topicIdLower.includes('sikgeometria') || topicIdLower.includes('sik')) {
            return generateGeometryQuestion();
        }
        // Sorozatok
        else if (topicIdLower.includes('sorozat')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: geometriai sorozat
                const a1 = Math.floor(Math.random() * 5) + 2;
                const q = Math.floor(Math.random() * 3) + 2;
                const n = 4;
                const answer = a1 * Math.pow(q, n - 1);
                return {
                    question: `Geometriai sorozat: a₁ = ${a1}, q = ${q}. Mennyi a₄?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                    answer: Math.round(answer * 1000) / 1000,
                    type: 'multiplication',
                    expression: `a₄ = a₁ · q³ = ${a1} · ${q}³ = ${a1} · ${Math.pow(q, 3)} = ${Math.round(answer * 1000) / 1000}`
                };
            }
            const a1 = Math.floor(Math.random() * 10) + 1;
            const d = Math.floor(Math.random() * 5) + 1;
            const n = 5;
            const answer = a1 + (n - 1) * d;
            return {
                question: `Számtani sorozat: a₁ = ${a1}, d = ${d}. Mennyi a₅?`,
                answer: answer,
                type: 'addition',
                expression: `a₅ = a₁ + 4d = ${a1} + 4·${d} = ${answer}`
            };
        }
        // Statisztika
        else if (topicIdLower.includes('statisztika')) {
            const nums = [1, 2, 3, 4, 5];
            const answer = nums.reduce((a, b) => a + b, 0) / nums.length;
            return {
                question: `Adatok: ${nums.join(', ')}. Átlag?`,
                answer: answer,
                type: 'multiplication',
                expression: `Átlag = (${nums.join(' + ')}) / ${nums.length} = ${answer}`
            };
        }
        // Számelmélet
        else if (topicIdLower.includes('szamelmelet') || topicIdLower.includes('szam')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: LKKT számítás
                const a = Math.floor(Math.random() * 5) + 4;
                const b = Math.floor(Math.random() * 5) + 4;
                const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
                const lcm = (a * b) / gcd(a, b);
                return {
                    question: `LKKT(${a}, ${b}) = ?`,
                    answer: lcm,
                    type: 'multiplication',
                    expression: `LKKT(${a}, ${b}) = (${a} × ${b}) / LNKO(${a}, ${b}) = ${lcm}`
                };
            }
            const a = Math.floor(Math.random() * 20) + 10;
            const b = Math.floor(Math.random() * 20) + 10;
            const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
            const answer = gcd(a, b);
            return {
                question: `LNKO(${a}, ${b}) = ?`,
                answer: answer,
                type: 'multiplication',
                expression: `LNKO(${a}, ${b}) = ${answer}`
            };
        }
        // Szöveges feladatok
        else if (topicIdLower.includes('szoveges')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: összetett szöveges feladat
                const a = Math.floor(Math.random() * 5) + 5;
                const b = Math.floor(Math.random() * 5) + 3;
                // Kati a almát szedett, Pali b-t. Kati kétszer annyit szedett, mint Pali. Hány almát szedett Kati?
                // Ha Kati = 2 * Pali és Kati = a, akkor a = 2b → b = a/2
                // De itt fordítva: ha Kati kétszer annyit szedett, akkor Kati = 2 * Pali
                const pali = b;
                const kati = 2 * pali;
                return {
                    question: `Kati kétszer annyi almát szedett, mint Pali. Ha Pali ${pali} almát szedett, hány almát szedett Kati?`,
                    answer: kati,
                    type: 'multiplication',
                    expression: `Kati = 2 × Pali = 2 × ${pali} = ${kati}`
                };
            }
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const answer = a + b;
            return {
                question: `Kati ${a} almát, Pali ${b} almát szedett. Összesen hány alma?`,
                answer: answer,
                type: 'addition',
                expression: `${a} + ${b} = ${answer}`
            };
        }
        // Paraméter — ELŐBB, mert a "parameter" id tartalmazza a "ter" szócskát
        else if (topicIdLower.includes('parameter') || topicIdLower.includes('paramet')) {
            const list = getParameterPracticeQuestions();
            return list[Math.floor(Math.random() * list.length)];
        }
        // Térgeometria (ne használj includes('ter') — elkapná a parameter témát is!)
        else if (topicIdLower.includes('tergeometria')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: gömb térfogata
                const r = Math.floor(Math.random() * 5) + 2;
                const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
                return {
                    question: `Gömb sugara ${r} cm. Térfogat? (π ≈ 3.14, egész szám)`,
                    answer: Math.round(volume),
                    type: 'multiplication',
                    expression: `V = (4/3)πr³ = (4/3) × 3.14 × ${r}³ = ${Math.round(volume)} cm³`
                };
            }
            const a = Math.floor(Math.random() * 5) + 2;
            const answer = Math.pow(a, 3);
            return {
                question: `Kocka éle ${a} cm. Térfogat?`,
                answer: answer,
                type: 'multiplication',
                expression: `V = a³ = ${a}³ = ${answer} cm³`
            };
        }
        // Trigonometria
        else if (topicIdLower.includes('trigonometria') || topicIdLower.includes('trigonometri')) {
            return generateTrigonometryQuestion();
        }
        // Valószínűségszámítás
        else if (topicIdLower.includes('valoszinuseg')) {
            return {
                question: 'Egy kockával dobva, mi a valószínűsége, hogy 3-nál nagyobb számot dobunk?',
                answer: 0.5,
                type: 'multiplication',
                expression: 'Kedvező: 4,5,6 (3 db), Összes: 6, P = 3/6 = 0.5'
            };
        }
        // Bizonyítások — munkalap feladatok
        else if (topicIdLower.includes('bizonyitas')) {
            const list = getProofPracticeQuestions();
            return list[Math.floor(Math.random() * list.length)];
        }
        // Logika, gráfok
        else if (topicIdLower.includes('logika') || topicIdLower.includes('graf')) {
            return {
                question: 'Logikai művelet: (1 ÉS 0) VAGY 1 = ?',
                answer: 1,
                type: 'multiplication',
                expression: '(1 ÉS 0) = 0, 0 VAGY 1 = 1'
            };
        }
        // Értelmezési tartomány, értékkészlet
        else if (topicIdLower.includes('ertelmezesi') || topicIdLower.includes('tartomany') || topicIdLower.includes('ertekkeszlet')) {
            const levelLower = level.toLowerCase();
            if (levelLower.includes('emelt')) {
                // Emelt szint: összetett függvény értelmezési tartománya
                const a = Math.floor(Math.random() * 5) + 3;
                // f(x) = √(x-2) + 1/(x-a), értelmezési tartomány: x ≥ 2 ÉS x ≠ a
                const minValue = Math.max(2, a + 1);
                return {
                    question: `f(x) = √(x-2) + 1/(x-${a}) értelmezési tartománya? (Add meg a legkisebb egész számot)`,
                    answer: minValue,
                    type: 'multiplication',
                    expression: `x - 2 ≥ 0 → x ≥ 2, és x ≠ ${a}, legkisebb egész: ${minValue}`
                };
            }
            return {
                question: 'f(x) = √(x-2) értelmezési tartománya? (Add meg a legkisebb egész számot)',
                answer: 2,
                type: 'multiplication',
                expression: 'x - 2 ≥ 0 → x ≥ 2, legkisebb egész: 2'
            };
        }

        // Alapértelmezett
        return generateAlgebraQuestion();
    };

    const generateElementaryQuestionByTopic = (topicId: string, grade: number, difficulty: number = 0): Question | null => {
        const topicIdLower = topicId.toLowerCase();

        // Számok 20-ig — többféle feladatvariáns
        if (topicIdLower.includes('szamok-20ig') || topicIdLower.includes('20ig')) {
            const max = 10 + Math.min(10, difficulty * 2);
            const a = Math.floor(Math.random() * max) + 1;
            const b = Math.floor(Math.random() * Math.max(1, max - a + 1));
            const variant = Math.floor(Math.random() * 4);
            if (variant === 0) {
                return {
                    question: `Mennyi ${a} + ${b}?`,
                    answer: a + b,
                    type: 'addition',
                    expression: `${a} + ${b} = ${a + b}`,
                };
            }
            if (variant === 1) {
                const larger = Math.max(a, b);
                const smaller = Math.min(a, b);
                return {
                    question: `Mennyi ${larger} − ${smaller}?`,
                    answer: larger - smaller,
                    type: 'subtraction',
                    expression: `${larger} - ${smaller} = ${larger - smaller}`,
                };
            }
            if (variant === 2) {
                return {
                    question: `Melyik a nagyobb: ${a} vagy ${b}? Írd be a nagyobbat!`,
                    answer: Math.max(a, b),
                    type: 'addition',
                    expression: `max(${a},${b}) = ${Math.max(a, b)}`,
                };
            }
            return {
                question: `Mi következik ${a} után?`,
                answer: a + 1,
                type: 'addition',
                expression: `${a} + 1 = ${a + 1}`,
            };
        }
        // Számok 100-ig
        else if (topicIdLower.includes('szamok-100ig') || topicIdLower.includes('100ig')) {
            const max = 20 + difficulty * 15;
            const a = Math.floor(Math.random() * max) + 1;
            const b = Math.floor(Math.random() * max) + 1;
            const variant = Math.floor(Math.random() * 3);
            if (variant === 0) {
                return {
                    question: `Mennyi ${a} + ${b}?`,
                    answer: a + b,
                    type: 'addition',
                    expression: `${a} + ${b} = ${a + b}`,
                };
            }
            if (variant === 1) {
                const larger = Math.max(a, b);
                const smaller = Math.min(a, b);
                return {
                    question: `Mennyi ${larger} − ${smaller}?`,
                    answer: larger - smaller,
                    type: 'subtraction',
                    expression: `${larger} - ${smaller} = ${larger - smaller}`,
                };
            }
            const tens = Math.floor(a / 10) * 10;
            return {
                question: `Kerekítsd ${a}-t a legközelebbi tizesre!`,
                answer: a - tens >= 5 ? tens + 10 : tens,
                type: 'addition',
                expression: `kerekítés(${a})`,
            };
        }
        // Összeadás-kivonás
        else if (topicIdLower.includes('osszeadas') || topicIdLower.includes('kivonas')) {
            const maxNum = Math.min(grade * 10, 100);
            const a = Math.floor(Math.random() * maxNum) + 1;
            const b = Math.floor(Math.random() * maxNum) + 1;
            const isAddition = Math.random() > 0.5;
            if (isAddition) {
                return {
                    question: `${a} + ${b} = ?`,
                    answer: a + b,
                    type: 'addition',
                    expression: `${a} + ${b} = ${a + b}`
                };
            } else {
                const larger = Math.max(a, b);
                const smaller = Math.min(a, b);
                return {
                    question: `${larger} - ${smaller} = ?`,
                    answer: larger - smaller,
                    type: 'subtraction',
                    expression: `${larger} - ${smaller} = ${larger - smaller}`
                };
            }
        }
        // Szorzótábla
        else if (topicIdLower.includes('szorzotabla') || topicIdLower.includes('szorzas')) {
            const maxFactor = Math.min(grade + 2, 10);
            const a = Math.floor(Math.random() * maxFactor) + 1;
            const b = Math.floor(Math.random() * maxFactor) + 1;
            return {
                question: `${a} × ${b} = ?`,
                answer: a * b,
                type: 'multiplication',
                expression: `${a} × ${b} = ${a * b}`
            };
        }
        // Törtek
        else if (topicIdLower.includes('tortek') || topicIdLower.includes('tort')) {
            const numerator = Math.floor(Math.random() * 5) + 1;
            const denominator = Math.floor(Math.random() * 5) + numerator;
            const answer = Math.round((numerator / denominator) * 100) / 100;
            return {
                question: `${numerator}/${denominator} tizedes törtben? (Kerekíts 2 tizedesjegyre)`,
                answer: answer,
                type: 'division',
                expression: `${numerator}/${denominator} = ${answer}`
            };
        }
        // Geometria alapok
        else if (topicIdLower.includes('geometria') || topicIdLower.includes('geometri')) {
            const side = Math.floor(Math.random() * 10) + 1;
            const answer = side * side;
            return {
                question: `${side} cm oldalú négyzet területe?`,
                answer: answer,
                type: 'multiplication',
                expression: `T = a² = ${side}² = ${answer} cm²`
            };
        }

        // Alapértelmezett
        return generateAlgebraQuestion();
    };

    const generateElementaryQuestionsByTopic = (topicId: string, grade: number) => {
        // Témakör nevének beállítása
        const topic = elementaryTopics.find(t => t.id === topicId);
        if (topic) {
            setSelectedElementaryTopic(topic.title);
        }
        
        const questions: Question[] = [];
        
        // Generálunk 50 feladatot nehézségi szintek szerint
        const difficultyLevels = 5;
        const questionsPerLevel = 10;
        
        for (let difficulty = 0; difficulty < difficultyLevels; difficulty++) {
            for (let i = 0; i < questionsPerLevel; i++) {
                const question = generateElementaryQuestionByTopic(topicId, grade, difficulty);
                if (question) {
                    questions.push({
                        ...question,
                        id: `elementary_${topicId}_${grade}_${difficulty}_${i}`
                    });
                }
            }
        }

        // Nem keverjük össze, hogy a nehézségi sorrend megmaradjon
        setTaskQuestions(questions);
        
        // Azonnal elindítjuk a játékot
        if (questions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    };

    const generateKozpontiQuestionByTopic = (topicId: string, difficulty: number = 0): Question | null => {
        const topicIdLower = topicId.toLowerCase();

        // Számítás - gimnáziumi felvételi szint
        if (topicIdLower.includes('szamitas') || topicIdLower.includes('számítás')) {
            const baseRange = 10 + difficulty * 20;
            const a = Math.floor(Math.random() * baseRange) + 10;
            const b = Math.floor(Math.random() * baseRange) + 10;
            const operation = Math.floor(Math.random() * 6);
            
            if (operation === 0) {
                // Összeadás
                return {
                    question: `${a} + ${b} = ?`,
                    answer: a + b,
                    type: 'addition',
                    expression: `${a} + ${b} = ${a + b}`
                };
            } else if (operation === 1) {
                // Kivonás
                const larger = Math.max(a, b);
                const smaller = Math.min(a, b);
                return {
                    question: `${larger} - ${smaller} = ?`,
                    answer: larger - smaller,
                    type: 'subtraction',
                    expression: `${larger} - ${smaller} = ${larger - smaller}`
                };
            } else if (operation === 2) {
                // Szorzás
                const factor = Math.floor(Math.random() * (5 + difficulty)) + 2;
                return {
                    question: `${a} × ${factor} = ?`,
                    answer: a * factor,
                    type: 'multiplication',
                    expression: `${a} × ${factor} = ${a * factor}`
                };
            } else if (operation === 3) {
                // Osztás
                const divisor = Math.floor(Math.random() * (5 + difficulty)) + 2;
                const dividend = a * divisor;
                return {
                    question: `${dividend} ÷ ${divisor} = ?`,
                    answer: a,
                    type: 'division',
                    expression: `${dividend} ÷ ${divisor} = ${a}`
                };
            } else if (operation === 4 && difficulty >= 2) {
                // Törtek összeadása/kivonása
                const num1 = Math.floor(Math.random() * 5) + 1;
                const den1 = num1 + Math.floor(Math.random() * 5) + 1;
                const num2 = Math.floor(Math.random() * 5) + 1;
                const den2 = num2 + Math.floor(Math.random() * 5) + 1;
                const commonDen = den1 * den2;
                const sumNum = num1 * den2 + num2 * den1;
                const answer = Math.round((sumNum / commonDen) * 100) / 100;
                return {
                    question: `${num1}/${den1} + ${num2}/${den2} = ? (2 tizedesjegyre)`,
                    answer: answer,
                    type: 'addition',
                    expression: `${num1}/${den1} + ${num2}/${den2} = ${sumNum}/${commonDen} = ${answer}`
                };
            } else {
                // Hatványozás
                const base = Math.floor(Math.random() * 5) + 2;
                const exp = Math.floor(Math.random() * 4) + 2;
                return {
                    question: `${base}^${exp} = ?`,
                    answer: Math.pow(base, exp),
                    type: 'multiplication',
                    expression: `${base}^${exp} = ${Math.pow(base, exp)}`
                };
            }
        }
        // Algebra - gimnáziumi felvételi szint
        else if (topicIdLower.includes('algebra')) {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 20) + 5;
            const c = Math.floor(Math.random() * 10) + 1;
            return {
                question: `${a}x + ${b} = ${a * c + b}. Mennyi x?`,
                answer: c,
                type: 'multiplication',
                expression: `${a}x + ${b} = ${a * c + b} → ${a}x = ${a * c} → x = ${c}`
            };
        }
        // Geometria - gimnáziumi felvételi szint
        else if (topicIdLower.includes('geometria')) {
            const shape = Math.floor(Math.random() * (5 + difficulty));
            const baseSize = Math.floor(Math.random() * 10) + 5;
            
            if (shape === 0 || difficulty === 0) {
                // Négyzet terület
                return {
                    question: `${baseSize} cm oldalú négyzet területe?`,
                    answer: baseSize * baseSize,
                    type: 'multiplication',
                    expression: `T = a² = ${baseSize}² = ${baseSize * baseSize} cm²`
                };
            } else if (shape === 1 || difficulty <= 1) {
                // Téglalap terület
                const width = baseSize + Math.floor(Math.random() * 5);
                return {
                    question: `${baseSize} cm × ${width} cm téglalap területe?`,
                    answer: baseSize * width,
                    type: 'multiplication',
                    expression: `T = a × b = ${baseSize} × ${width} = ${baseSize * width} cm²`
                };
            } else if (shape === 2 || difficulty <= 2) {
                // Kör terület
                const radius = baseSize;
                const area = Math.round(Math.PI * radius * radius);
                return {
                    question: `${radius} cm sugarú kör területe? (Egész számra kerekítve, π ≈ 3.14)`,
                    answer: area,
                    type: 'multiplication',
                    expression: `T = πr² = 3.14 × ${radius}² ≈ ${area} cm²`
                };
            } else if (shape === 3 || difficulty <= 3) {
                // Háromszög terület
                const base = baseSize;
                const height = baseSize + Math.floor(Math.random() * 5);
                const area = Math.round((base * height) / 2);
                return {
                    question: `${base} cm alapú, ${height} cm magasságú háromszög területe?`,
                    answer: area,
                    type: 'multiplication',
                    expression: `T = (a × m) / 2 = (${base} × ${height}) / 2 = ${area} cm²`
                };
            } else {
                // Derékszögű háromszög átfogó (Pitagorasz-tétel)
                const a = Math.floor(Math.random() * 5) + 3;
                const b = Math.floor(Math.random() * 5) + 4;
                const c = Math.round(Math.sqrt(a * a + b * b));
                return {
                    question: `Derékszögű háromszög befogói: ${a} cm és ${b} cm. Az átfogó hossza? (Egész számra kerekítve)`,
                    answer: c,
                    type: 'multiplication',
                    expression: `c² = a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b} → c ≈ ${c} cm`
                };
            }
        }
        // Szöveges feladatok
        else if (topicIdLower.includes('szoveges') || topicIdLower.includes('szöveges')) {
            const problemType = Math.floor(Math.random() * (4 + difficulty));
            
            if (problemType === 0 || difficulty === 0) {
                // Egyszerű szöveges feladat
                const a = Math.floor(Math.random() * 20) + 10;
                const b = Math.floor(Math.random() * 20) + 5;
                return {
                    question: `Péter ${a} forinttal rendelkezik. ${b} forintot költött. Mennyi pénze maradt?`,
                    answer: a - b,
                    type: 'subtraction',
                    expression: `${a} - ${b} = ${a - b} forint`
                };
            } else if (problemType === 1 || difficulty <= 1) {
                // Szorzással kapcsolatos
                const price = Math.floor(Math.random() * 5) + 2;
                const quantity = Math.floor(Math.random() * 10) + 5;
                return {
                    question: `Egy ${price} forintos csomagból ${quantity} darabot vettünk. Összesen mennyit fizettünk?`,
                    answer: price * quantity,
                    type: 'multiplication',
                    expression: `${price} × ${quantity} = ${price * quantity} forint`
                };
            } else if (problemType === 2 || difficulty <= 2) {
                // Osztással kapcsolatos
                const total = Math.floor(Math.random() * 20 + 10) * 5;
                const people = Math.floor(Math.random() * 5) + 2;
                return {
                    question: `${total} forintot ${people} személy között osztunk szét. Mennyi jut egy személyre?`,
                    answer: total / people,
                    type: 'division',
                    expression: `${total} ÷ ${people} = ${total / people} forint`
                };
            } else if (problemType === 3 || difficulty <= 3) {
                // Kétismeretlenes
                const a = Math.floor(Math.random() * 10) + 3;
                const b = Math.floor(Math.random() * 10) + 5;
                const x = Math.floor(Math.random() * 5) + 2;
                const sum = a * x + b;
                return {
                    question: `Egy szám ${a}-szorosa plusz ${b} egyenlő ${sum}. Mennyi a szám?`,
                    answer: x,
                    type: 'multiplication',
                    expression: `Legyen x a szám. ${a}x + ${b} = ${sum} → ${a}x = ${sum - b} → x = ${x}`
                };
            } else {
                // Sebesség/idő/távolság
                const speed = Math.floor(Math.random() * 30) + 40;
                const time = Math.floor(Math.random() * 3) + 2;
                const distance = speed * time;
                return {
                    question: `Egy autó ${speed} km/h sebességgel ${time} órát halad. Hány km-t tesz meg?`,
                    answer: distance,
                    type: 'multiplication',
                    expression: `s = v × t = ${speed} × ${time} = ${distance} km`
                };
            }
        }
        // Halmazok
        else if (topicIdLower.includes('halmazok')) {
            const problemType = Math.floor(Math.random() * (3 + difficulty));
            
            if (problemType === 0 || difficulty === 0) {
                // Halmazok uniója
                const a = Math.floor(Math.random() * 10) + 5;
                const b = Math.floor(Math.random() * 10) + 5;
                const intersection = Math.floor(Math.random() * Math.min(a, b));
                return {
                    question: `A halmaz ${a} elemet, B halmaz ${b} elemet tartalmaz, közös elemeik száma ${intersection}. A ∪ B elemeinek száma?`,
                    answer: a + b - intersection,
                    type: 'addition',
                    expression: `|A ∪ B| = |A| + |B| - |A ∩ B| = ${a} + ${b} - ${intersection} = ${a + b - intersection}`
                };
            } else if (problemType === 1 || difficulty <= 2) {
                // Halmazok különbsége
                const a = Math.floor(Math.random() * 15) + 10;
                const b = Math.floor(Math.random() * 10) + 5;
                const intersection = Math.floor(Math.random() * Math.min(a, b));
                const diff = a - intersection;
                return {
                    question: `A halmaz ${a} elemet, A ∩ B = ${intersection} elem. A \\ B elemeinek száma?`,
                    answer: diff,
                    type: 'subtraction',
                    expression: `|A \\ B| = |A| - |A ∩ B| = ${a} - ${intersection} = ${diff}`
                };
            } else {
                // Három halmaz
                const a = Math.floor(Math.random() * 8) + 5;
                const b = Math.floor(Math.random() * 8) + 5;
                const c = Math.floor(Math.random() * 8) + 5;
                const intersection = Math.floor(Math.random() * Math.min(a, b, c));
                const union = a + b + c - 2 * intersection;
                return {
                    question: `A, B, C halmazok elemszáma: ${a}, ${b}, ${c}. Ha |A ∩ B ∩ C| = ${intersection} és nincs más metszet, mennyi |A ∪ B ∪ C|?`,
                    answer: union,
                    type: 'addition',
                    expression: `|A ∪ B ∪ C| = |A| + |B| + |C| - 2|A ∩ B ∩ C| = ${a} + ${b} + ${c} - 2×${intersection} = ${union}`
                };
            }
        }
        // Függvények
        else if (topicIdLower.includes('fuggvenyek') || topicIdLower.includes('függvények')) {
            const problemType = Math.floor(Math.random() * (4 + difficulty));
            
            if (problemType === 0 || difficulty === 0) {
                // Lineáris függvény értéke
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 10) + 1;
                const x = Math.floor(Math.random() * 5) + 1;
                return {
                    question: `f(x) = ${a}x + ${b}. Mennyi f(${x})?`,
                    answer: a * x + b,
                    type: 'multiplication',
                    expression: `f(${x}) = ${a} × ${x} + ${b} = ${a * x + b}`
                };
            } else if (problemType === 1 || difficulty <= 1) {
                // Függvény nullhelye
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 10) + 1;
                const zero = -b / a;
                return {
                    question: `f(x) = ${a}x + ${b}. Mennyi x, ha f(x) = 0? (2 tizedesjegyre)`,
                    answer: Math.round(zero * 100) / 100,
                    type: 'multiplication',
                    expression: `${a}x + ${b} = 0 → ${a}x = -${b} → x = ${Math.round(zero * 100) / 100}`
                };
            } else if (problemType === 2 || difficulty <= 2) {
                // Másodfokú függvény értéke
                const a = Math.floor(Math.random() * 3) + 1;
                const b = Math.floor(Math.random() * 5) + 1;
                const x = Math.floor(Math.random() * 3) + 1;
                const value = a * x * x + b;
                return {
                    question: `f(x) = ${a}x² + ${b}. Mennyi f(${x})?`,
                    answer: value,
                    type: 'multiplication',
                    expression: `f(${x}) = ${a} × ${x}² + ${b} = ${a * x * x} + ${b} = ${value}`
                };
            } else {
                // Függvények összege
                const a1 = Math.floor(Math.random() * 3) + 2;
                const a2 = Math.floor(Math.random() * 3) + 2;
                const x = Math.floor(Math.random() * 3) + 1;
                const f1 = a1 * x;
                const f2 = a2 * x;
                return {
                    question: `f(x) = ${a1}x és g(x) = ${a2}x. Mennyi f(${x}) + g(${x})?`,
                    answer: f1 + f2,
                    type: 'addition',
                    expression: `f(${x}) + g(${x}) = ${a1}×${x} + ${a2}×${x} = ${f1} + ${f2} = ${f1 + f2}`
                };
            }
        }
        // Statisztika
        else if (topicIdLower.includes('statisztika')) {
            const problemType = Math.floor(Math.random() * (3 + difficulty));
            const count = 5 + Math.floor(difficulty);
            const nums: number[] = [];
            
            for (let i = 0; i < count; i++) {
                nums.push(Math.floor(Math.random() * 20) + 1);
            }
            
            if (problemType === 0 || difficulty === 0) {
                // Átlag
                const sum = nums.reduce((a, b) => a + b, 0);
                const answer = sum / nums.length;
                return {
                    question: `Adatok: ${nums.join(', ')}. Átlag? (2 tizedesjegyre)`,
                    answer: Math.round(answer * 100) / 100,
                    type: 'multiplication',
                    expression: `Átlag = (${nums.join(' + ')}) / ${nums.length} = ${sum} / ${nums.length} = ${Math.round(answer * 100) / 100}`
                };
            } else if (problemType === 1 || difficulty <= 2) {
                // Maximum
                const max = Math.max(...nums);
                return {
                    question: `Adatok: ${nums.join(', ')}. Maximum érték?`,
                    answer: max,
                    type: 'multiplication',
                    expression: `Maximum = ${max}`
                };
            } else {
                // Összeg
                const sum = nums.reduce((a, b) => a + b, 0);
                return {
                    question: `Adatok: ${nums.join(', ')}. Összeg?`,
                    answer: sum,
                    type: 'addition',
                    expression: `Összeg = ${nums.join(' + ')} = ${sum}`
                };
            }
        }
        // Valószínűség
        else if (topicIdLower.includes('valoszinuseg') || topicIdLower.includes('valószínűség')) {
            const problemType = Math.floor(Math.random() * (3 + difficulty));
            
            if (problemType === 0 || difficulty === 0) {
                // Kocka dobás
                const favorable = Math.floor(Math.random() * 2) + 1;
                const total = 6;
                return {
                    question: `Egy kockával dobva, mi a valószínűsége, hogy ${favorable}-t dobunk? (2 tizedesjegyre)`,
                    answer: Math.round((1 / total) * 100) / 100,
                    type: 'multiplication',
                    expression: `Kedvező: 1 db, Összes: ${total}, P = 1/${total} = ${Math.round((1 / total) * 100) / 100}`
                };
            } else if (problemType === 1 || difficulty <= 1) {
                // Páros szám
                const total = 6;
                return {
                    question: `Egy kockával dobva, mi a valószínűsége, hogy páros számot dobunk? (2 tizedesjegyre)`,
                    answer: Math.round((3 / total) * 100) / 100,
                    type: 'multiplication',
                    expression: `Kedvező: 2, 4, 6 (3 db), Összes: ${total}, P = 3/${total} = ${Math.round((3 / total) * 100) / 100}`
                };
            } else if (problemType === 2 || difficulty <= 2) {
                // Két kocka összeg
                const target = Math.floor(Math.random() * 5) + 7; // 7-11 között
                const favorable = target <= 7 ? target - 1 : 13 - target;
                const total = 36;
                return {
                    question: `Két kockával dobva, mi a valószínűsége, hogy ${target}-t dobunk? (2 tizedesjegyre)`,
                    answer: Math.round((favorable / total) * 100) / 100,
                    type: 'multiplication',
                    expression: `Kedvező: ${favorable} db, Összes: ${total}, P = ${favorable}/${total} = ${Math.round((favorable / total) * 100) / 100}`
                };
            } else {
                // Egyenletes eloszlás
                const total = Math.floor(Math.random() * 5) + 6; // 6-10
                const favorable = Math.floor(Math.random() * (total - 1)) + 1;
                return {
                    question: `${total} szám közül egyet választunk. Mi a valószínűsége, hogy ${favorable}-t választunk? (2 tizedesjegyre)`,
                    answer: Math.round((1 / total) * 100) / 100,
                    type: 'multiplication',
                    expression: `Kedvező: 1 db, Összes: ${total}, P = 1/${total} = ${Math.round((1 / total) * 100) / 100}`
                };
            }
        }

        // Alapértelmezett
        return generateAlgebraQuestion();
    };

    const generateKozpontiQuestionsByTopic = (topicId: string) => {
        console.log('generateKozpontiQuestionsByTopic called with topicId:', topicId);
        const questions: Question[] = [];
        
        // Központi felkészülés témakörök - 8. osztályosoknak 9. osztályos felvételire
        const kozpontiTopics = ['szamitas', 'algebra', 'geometria', 'szoveges', 'halmazok', 'fuggvenyek', 'statisztika', 'valoszinuseg'];
        
        // Generálunk 50 feladatot minden témakörből vegyesen
        const difficultyLevels = 5;
        const questionsPerTopic = Math.floor(50 / kozpontiTopics.length); // ~6-7 feladat témakörönként
        
        for (const topic of kozpontiTopics) {
            for (let difficulty = 0; difficulty < difficultyLevels; difficulty++) {
                const questionsForThisLevel = Math.floor(questionsPerTopic / difficultyLevels);
                for (let i = 0; i < questionsForThisLevel; i++) {
                    const question = generateKozpontiQuestionByTopic(topic, difficulty);
                    if (question) {
                        questions.push({
                            ...question,
                            id: `kozponti_${topic}_${difficulty}_${i}`
                        });
                    }
                }
            }
        }
        
        // Ha nincs elég feladat, kiegészítjük
        while (questions.length < 50) {
            const randomTopic = kozpontiTopics[Math.floor(Math.random() * kozpontiTopics.length)];
            const difficulty = Math.floor(Math.random() * difficultyLevels);
            const question = generateKozpontiQuestionByTopic(randomTopic, difficulty);
            if (question) {
                questions.push({
                    ...question,
                    id: `kozponti_${randomTopic}_${difficulty}_${questions.length}`
                });
            }
        }

        console.log('Generated questions count:', questions.length);
        // Keverjük össze a feladatokat, hogy vegyes témakörökből legyenek
        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        setTaskQuestions(shuffledQuestions.slice(0, 50));
        
        // Azonnal elindítjuk a játékot
        if (questions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        } else {
            console.error('No questions generated for topicId:', topicId);
        }
    };

    // Előre definiált szigorlat feladatok
    const szigorlatQuestions: Question[] = [
        {
            question: `(a) Oldjuk meg az alábbi differenciálegyenletet az x < 1.80644 intervallumon! Mely megoldásgörbe elégíti ki az y(0) = -1/3 kezdeti feltételt?

y'(x) = e^(3y(x)+1) · (x² - x)

Megjegyzés: a fenti intervallumon teljesül, hogy -x³ + (3x²)/2 + 1 > 0.

(b) Adjuk meg az előző egyenlet megoldásfüggvényének a fenti intervallum belsejébe eső szélsőértékeit!`,
            answer: 1, // c értéke (5. részfeladat)
            alternativeAnswer: 0, // x = 0 (7. részfeladat)
            thirdAnswer: 1, // x = 1 (7. részfeladat)
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Adja meg a h(y) függvényt!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: h(y) = e^(3y+1)`,
                    answer: 0 // Nincs számérték, csak ellenőrzés
                },
                {
                    question: `Részfeladat 2: Adja meg a g(x) függvényt!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: g(x) = x²-x`,
                    answer: 0 // Nincs számérték
                },
                {
                    question: `RÉSZFELADAT 3: Számítsd ki az első integrált!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: e^(-3y-1)/(-3) + c`,
                    answer: 0 // Nincs számérték
                },
                {
                    question: `RÉSZFELADAT 4: Számítsd ki a második integrált!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: x³/3 - x²/2 + c`,
                    answer: 0 // Nincs számérték
                },
                {
                    question: `RÉSZFELADAT 5: Alkalmazd a kezdeti feltételt és határozd meg c értékét!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: c = 1`,
                    answer: 1 // c értéke
                },
                {
                    question: `RÉSZFELADAT 6: Írd fel a végleges megoldást!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: y(x) = -1/3 · ln(-x³ + 3x²/2 + 1) - 1/3`,
                    answer: 0 // Nincs számérték
                },
                {
                    question: `RÉSZFELADAT 7: Határozd meg a derivált zérushelyeit! (Első zérushely)`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: x = 0`,
                    answer: 0 // Első zérushely
                },
                {
                    question: `RÉSZFELADAT 8: Határozd meg a derivált zérushelyeit! (Második zérushely)`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: x = 1`,
                    answer: 1 // Második zérushely
                },
                {
                    question: `Részfeladat 9: Határozd meg a megoldásfüggvény második deriváltját!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: y''(x) = -1/3 · [(-6x+3)(-x³+3x²/2+1) - (-3x²+3x)²] / (-x³+3x²/2+1)²`,
                    answer: 0 // Nincs számérték
                },
                {
                    question: `Részfeladat 10: Ad meg a lokális maximumának a helyét!`,
                    rubric: `Megoldás. 10. részfeladat megoldása ez: x = 0`,
                    answer: 0 // Lokális maximum helye
                },
                {
                    question: `Részfeladat 11: Ad meg a lokális minimumának a helyét!`,
                    rubric: `Megoldás. 11. részfeladat megoldása ez: x = 1`,
                    answer: 1 // Lokális minimum helye
                }
            ],
            expression: `Teljes megoldás:

(a) Szétválasztható differenciálegyenlet:
h(y) = e^(3y+1), g(x) = x²-x
∫ e^(-3y-1) dy = ∫ (x²-x) dx
-e^(-3y-1)/3 = x³/3 - x²/2 + c
y(x) = -1/3 · ln(-x³ + 3x²/2 + c) - 1/3

Kezdeti feltétel: y(0) = -1/3 · ln(c) - 1/3 = -1/3
ln(c) = 0, tehát c = 1

Végleges megoldás: y(x) = -1/3 · ln(-x³ + 3x²/2 + 1) - 1/3

(b) Deriválva: y'(x) = -1/3 · (-3x²+3x)/(-x³ + 3x²/2 + 1)

y'(x) = 0, ha -3x²+3x = 0
x(3-3x) = 0
x = 0 vagy x = 1

Második derivált: y''(x) = -1/3 · [(-6x+3)(-x³+3x²/2+1) - (-3x²+3x)²] / (-x³+3x²/2+1)²

y''(0) < 0 → maximum
y''(1) > 0 → minimum

Rubrikák összesítése:
- h(y) és g(x) azonosítása: 2 pont
- Integrálás képlet: 2 pont
- Első integrál: 2 pont
- Második integrál: 2 pont
- Kezdeti feltétel: 4 pont
- Végleges megoldás: 3 pont
- Derivált zérushelyek: 1+1 pont
- Szélsőérték típusok: 1+1 pont
Összesen: 19 pont`
            },
            {
                question: `Tekintsük azt az f:(0,π]→ℝ függvényt, mely az alábbi módon van definiálva:

f(x) = {
  -3, ha x ∈ (0, π/2],
  0, ha x ∈ (π/2, π]
}

Terjesszük ki ezt a függvényt úgy, hogy minden x ∈ ℝ esetén értelmezve legyen, és Fourier-sora tisztán szinuszos legyen!

Számítsuk ki a Fourier-sor együtthatóit!`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Hogyan kell kiterjeszteni a függvényt, hogy tisztán szinuszos legyen?`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: páratlan függvénnyé kel alakítani`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: A tisztán szinuszos kiterjesztésnek, mi a függvénye?`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: f(x) = { 3, ha x ∈ (-π/2, 0]; -3, ha x ∈ (0, π/2]; 0, máshol }`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg a szinuszos együtthatók (bₖ) képletét!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel az integrálokat a függvény definíciója alapján!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: bₖ = (1/π) [∫[-π/2,0] 3sin(kx) dx + ∫[0,π/2] (-3)sin(kx) dx]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Számítsa ki az integrálokat!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: bₖ = (1/π) [(-3cos(kx)/k)|[-π/2,0] + (3cos(kx)/k)|[0,π/2]]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Végezze el a behelyettesítést és egyszerűsítést!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: bₖ = -(6/πk)cos(kπ/2)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Adja meg a bₖ értékét, ha k páros, de nem osztható 4-gyel!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: bₖ = -12/(πk)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Adja meg a bₖ értékét, ha k páratlan!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: bₖ = -6/(πk)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 9: Adja meg a bₖ értékét, ha k osztható 4-gyel!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: bₖ = 0`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Mivel tisztán szinuszos Fourier-sort szeretnénk, így páratlan függvényként kell kiterjeszteni.
Így legyen a kiterjesztés a (-π, π) intervallumon:

f(x) = {
  3, ha x ∈ (-π/2, 0],
  -3, ha x ∈ (0, π/2],
  0, máshol
}

és f(x) = f(x+2π).

Ekkor az együtthatókra a₀ = 0, aₙ = 0 adódik a szimmetria miatt.

A szinuszos együtthatók:
bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx

Felhasználva a definíciót:
bₖ = (1/π) [∫[-π/2,0] 3sin(kx) dx + ∫[0,π/2] (-3)sin(kx) dx]

Integrálva:
= (1/π) [(-3cos(kx)/k)|[-π/2,0] + (3cos(kx)/k)|[0,π/2]]

Behelyettesítve:
= (1/π) [(3/k)(1-cos(-kπ/2)) + (3/k)(cos(kπ/2)-1)]
= -(6/πk)cos(kπ/2)

A különböző esetek:
bₖ = {
  -12/(πk), ha k páros, de nem osztható 4-gyel,
  -6/(πk), ha k páratlan,
  0, ha k osztható 4-gyel
}`
            },
            {
                question: `3. feladat. Adjuk meg a

v⃗(x,y,z) = (-2x·sin(x), 3e^(3y), 2cos(x))

vektormező integrálját az A(2,1,3) és B(0,-1,3) pontokat összekötő egyenes szakasz mentén (az A pontból indulva)!

Megjegyzés: a végeredményben szereplő trigonometrikus és exponenciális függvények értékeit nem kell pontosan meghatározni.`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Adja meg a görbe egy megfelelő paraméterezését!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(t) = Bt + (1-t)A = (0, -1, 3)t + (1-t)(2, 1, 3) = (-2t+2, -2t+1, 3)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Adja meg a paraméterezés deriváltját!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗'(t) = (-2, -2, 0)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg a vektormező értékét a görbén!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: v⃗(r⃗(t)) = (-2(2-2t)sin(2-2t), 3e^(3(1-2t)), 2cos(2-2t)) = (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t))`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel a vonalintegrált!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt = ∫[0,1] (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t)) · (-2, -2, 0) dt`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Számítsa ki az integranduszt!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: ∫[0,1] [8(1-t)sin(2-2t) - 6e^(3-6t)] dt`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Végezze el az integrálást!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: [4(1-t)cos(2-2t) + e^(3-6t)]|[0,1] = 4cos(0) + e^(-3) - (4cos(2) + e^3)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Adja meg a végeredményt egyszerűsített formában!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: 4 + e^(-3) - 4cos(2) - e^3`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Paraméterezés:
A görbe egy megfelelő paraméterezése:
r⃗(t) = B + (1-t)(A-B) = (0, -1, 3) + (1-t)(2, 1, 3) = (2-2t, 1-2t, 3), t ∈ [0,1]

Ennek deriváltja:
r⃗'(t) = (-2, -2, 0)

Továbbá:
v⃗(r⃗(t)) = (-2(2-2t)sin(2-2t), 3e^(3(1-2t)), 2cos(2-2t))
         = (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t))

Így a vonalintegrál:
∫[γ] v⃗ · dr⃗ = ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt
            = ∫[0,1] (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t)) · (-2, -2, 0) dt

Az integrandusz kiszámítása után:
= ∫[0,1] [8(1-t)sin(2-2t) - 6e^(3-6t)] dt

Integrálva:
= [4(1-t)cos(2-2t) + e^(3-6t)]|[0,1]
= 4cos(0) + e^(-3) - (4cos(2) + e^3)
= 4 + e^(-3) - 4cos(2) - e^3`
            },
            {
                question: `4. feladat. Tekintsük az alábbi felületet:

V = {az origó középpontú, 3 sugarú gömbfelület y ≤ 0 és z ≥ 0 térbe eső része}
(tehát az oldallapok nem).

Számítsuk ki a

v⃗(x,y,z) = (2x, 2y, z+1)

vektormezőnek ezen a felületen vett felületi integrálját az origótól távolodó irányban!

Megjegyzés: ∫[0,2π] sin x cos x dx = sin x(2π) - sin x(0).
Továbbá a Gauss-Osztrigyin tétel szerint az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla, ezért azt nem kell kiszámítani.`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Számítsa ki a vektormező divergenciáját!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: div(v⃗) = ∂/∂x(2x) + ∂/∂y(2y) + ∂/∂z(z+1) = 2 + 2 + 1 = 5`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Írja fel a Gauss-Osztrigyin tétel alapján a felületi integrált!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: ∬[V] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Miért nulla az y=0 oldallap integrálja?`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: A Gauss-Osztrigyin tétel szerint az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Számítsa ki a térfogati integrált (divergencia integrálja)!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: ∭[V] div(v⃗) dV = ∭[V] 5 dV = 5·Vol(V)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Adja meg a negyedgömb térfogatát!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·3³ = 9π`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Írja fel a z=0 oldallap paraméterezését!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,3], w ∈ [0,2π)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Számítsa ki a parciális deriváltakat!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: r⃗_u = (cos w, sin w, 0), r⃗_w = (-u sin w, u cos w, 0)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Számítsa ki a kereszt szorzatot és határozza meg a normálvektort!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: r⃗_u × r⃗_w = (0, 0, u), de mivel ez nem befelé mutat, a normálvektor: (0, 0, -u)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 9: Adja meg a vektormező értékét a z=0 oldallapon!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: v⃗(r⃗(u,w)) = (2u cos w, 2u sin w, 1)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 10: Számítsa ki a z=0 oldallap integrálját!`,
                        rubric: `Megoldás. 10. részfeladat megoldása ez: ∬[z=0] v⃗·dF⃗ = ∫[0,3]∫[0,2π] (2u cos w, 2u sin w, 1)·(0, 0, -u) dw du = ∫[0,3]∫[0,2π] (-u) dw du = -9π`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 11: Adja meg a végeredményt!`,
                        rubric: `Megoldás. 11. részfeladat megoldása ez: ∬[V] v⃗·dF⃗ = 5·9π - (-9π) = 45π + 9π = 54π`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

A keresett felületi integrál kiszámítható a Gauss-Osztrigyin tétel alapján:
∬[V] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗

De ismert, hogy ∬[y=0 oldallap] v⃗·dF⃗ = 0.

A divergencia:
div(v⃗) = ∂/∂x(2x) + ∂/∂y(2y) + ∂/∂z(z+1) = 2 + 2 + 1 = 5

Így:
∭[V] div(v⃗) dV = ∭[V] 5 dV = 5·Vol(V)

A negyedgömb térfogata:
V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·3³ = 9π

azaz
∭[V] div(v⃗) dV = 5·9π = 45π

A z=0 oldallap paraméterezése:
r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,3], w ∈ [0,2π)

Parciális deriváltak:
r⃗_u = (cos w, sin w, 0)
r⃗_w = (-u sin w, u cos w, 0)

Keresztszorzat:
r⃗_u × r⃗_w = (0, 0, u)

Ez nem befelé mutat, ezért helyette a (0, 0, -u) vektort használjuk.

Továbbá:
v⃗(r⃗(u,w)) = (2u cos w, 2u sin w, 1)

Így:
∬[z=0] v⃗·dF⃗ = ∫[0,3]∫[0,2π] (2u cos w, 2u sin w, 1)·(0, 0, -u) dw du
            = ∫[0,3]∫[0,2π] (-u) dw du
            = ∫[0,3] (-2πu) du
            = -πu²|[0,3]
            = -9π

Összesen:
∬[V] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[z=0] v⃗·dF⃗
            = 45π - (-9π)
            = 45π + 9π
            = 54π`
            },
            {
                question: `5. feladat. Oldjuk meg az alábbi egyenletrendszert!

x'(t) = 2x(t) - 3y(t) + 2e^(-3t)
y'(t) = 3x(t) + 2y(t)`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Adja meg a rendszerhez tartozó mátrixot!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: A = [[2, -3], [3, 2]]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Számítsa ki a mátrix sajátértékeit!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: λ₁,₂ = 2 ± 3i`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg a 2+3i sajátértékhez tartozó sajátvektort!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: s₁ = [i, 1]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel a homogén megoldást!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: [x_h(t), y_h(t)] = c₁[-e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[e^(2t)cos(3t), e^(2t)sin(3t)]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Vezesse vissza másodrendűre az egyenletet a partikuláris megoldáshoz!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: x''(t) = 4x'(t) - 13x(t) - 10e^(-3t)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Határozza meg a próbaalakot és az A együtthatót!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: x_p(t) = Ae^(-3t), ahol A = -5/17`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Adja meg a partikuláris megoldás másik komponensét!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: y_p(t) = (3/17)e^(-3t)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Oldja meg közvetlenül a rendszerbe helyettesítéssel!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: x_p(t) = Ae^(-3t), y_p(t) = Be^(-3t), ahol A = -5/17, B = 3/17`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 9: Adja meg az alapmátrixot az állandók variálásához!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: Φ(t) = [[-e^(2t)sin(3t), e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

A megoldást előállítjuk homogén és partikuláris alakban.

Homogén megoldás:
A rendszerhez tartozó mátrix:
A = [[2, -3], [3, 2]]

Ennek sajátértékei:
λ₁,₂ = 2 ± 3i

A 2+3i sajátértékhez tartozó sajátvektor:
s₁ = [i, 1]

így
e^((2+3i)t) = e^(2t)(cos(3t) + i sin(3t))

Ebből:
e^((2+3i)t) s₁ = e^(2t) [i cos(3t) - sin(3t), cos(3t) + i sin(3t)]

A homogén megoldás tehát:
[x_h(t), y_h(t)] = c₁[-e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[e^(2t)cos(3t), e^(2t)sin(3t)]

Partikuláris megoldás:

Másodrendűre visszavezetés:
x''(t) = 2x'(t) - 3y'(t) - 6e^(-3t)
       = 2x'(t) - 9x(t) - 6y(t) - 6e^(-3t)

Az első egyenletből:
3y(t) = 2x(t) - x'(t) + 2e^(-3t)

Behelyettesítve:
x''(t) = 2x'(t) - 9x(t) - 2(2x(t) - x'(t) + 2e^(-3t)) - 6e^(-3t)
       = 4x'(t) - 13x(t) - 10e^(-3t)

Próbaalak:
x_p(t) = A e^(-3t)

Behelyettesítve:
9A e^(-3t) = -12A e^(-3t) - 13A e^(-3t) - 10e^(-3t)

amiből
A = -10/34 = -5/17

Így:
x_p(t) = -(5/17) e^(-3t)

A másik komponens:
y_p(t) = (1/3)(2x(t) - x'(t) + 2e^(-3t))
       = (3/17) e^(-3t)

Közvetlen rendszerbe helyettesítés:
Legyen
x_p(t) = A e^(-3t), y_p(t) = B e^(-3t)

Behelyettesítve:
-3A = 2A - 3B + 2
-3B = 3A + 2B

Ebből:
A = -5/17, B = 3/17

Állandók variálása:
Az alapmátrix:
Φ(t) = [[-e^(2t)sin(3t), e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]

Ennek inverze, az integrálás és az utolsó szorzás elvégzése után megkapjuk a teljes megoldást.`
            },
            {
                question: `1. feladat

(a) Oldjuk meg az alábbi differenciálegyenletet, ahol x < 1.9108!
Mely megoldásgörbe elégíti ki az y(0) = -1/2 feltételt?

y'(x) = e^(2y(x)+1)(x²-x)

Megjegyzés: az x ∈ (-∞, 1.9108) intervallumon igaz, hogy
-2x³/3 + x² + 1 > 0.

(b) Adjuk meg az előző egyenlet megoldásfüggvényének a fenti intervallum belsejébe eső szélsőértékeit!`,
                answer: 1, // c értéke (5. részfeladat)
                alternativeAnswer: 0, // x = 0 (7. részfeladat)
                thirdAnswer: 1, // x = 1 (8. részfeladat)
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Adja meg a h(y) függvényt!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: h(y) = e^(2y+1)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Adja meg a g(x) függvényt!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: g(x) = x²-x`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Számítsd ki az első integrált!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: e^(-2y-1)/(-2) + c`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Számítsd ki a második integrált!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: x³/3 - x²/2 + c`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Alkalmazd a kezdeti feltételt és határozd meg c értékét!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: c = 1`,
                        answer: 1
                    },
                    {
                        question: `Részfeladat 6: Írd fel a végleges megoldást!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: y(x) = -1/2 · ln(-2x³/3 + x² + 1) - 1/2`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Határozd meg a derivált zérushelyeit! (Első zérushely)`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: x = 0`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Határozd meg a derivált zérushelyeit! (Második zérushely)`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: x = 1`,
                        answer: 1
                    },
                    {
                        question: `Részfeladat 9: Határozd meg a megoldásfüggvény második deriváltját!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: y''(x) = -1/2 · [(-4x+2)(-2x³/3+x²+1) - (-2x²+2x)²] / (-2x³/3+x²+1)²`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 10: Ad meg a lokális maximumának a helyét!`,
                        rubric: `Megoldás. 10. részfeladat megoldása ez: x = 0`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 11: Ad meg a lokális minimumának a helyét!`,
                        rubric: `Megoldás. 11. részfeladat megoldása ez: x = 1`,
                        answer: 1
                    }
                ],
                expression: `Teljes megoldás:

(a) Szétválasztható differenciálegyenlet:
h(y) = e^(2y+1), g(x) = x²-x
∫ e^(-2y-1) dy = ∫ (x²-x) dx
-e^(-2y-1)/2 = x³/3 - x²/2 + c
y(x) = -1/2 · ln(-2x³/3 + x² + c) - 1/2

Kezdeti feltétel: y(0) = -1/2 · ln(c) - 1/2 = -1/2
ln(c) = 0, tehát c = 1

Végleges megoldás: y(x) = -1/2 · ln(-2x³/3 + x² + 1) - 1/2

(b) Deriválva: y'(x) = -1/2 · (-2x²+2x)/(-2x³/3 + x² + 1)

y'(x) = 0, ha -2x²+2x = 0
x(2-2x) = 0
x = 0 vagy x = 1

Második derivált: y''(x) = -1/2 · [(-4x+2)(-2x³/3+x²+1) - (-2x²+2x)²] / (-2x³/3+x²+1)²
x=0 esetén: y''(0) = -1/2 · (2·1)/1 < 0, tehát maximum van.
x=1 esetén: y''(1) = -1/2 · [(-2)(4/3)] / (4/3)² = -1/2 · (-2) / (4/3) = 3/4 > 0, tehát minimum van.`
            },
            {
                question: `2. feladat. Tekintsük az f:(0,π]→ℝ függvényt, mely az alábbi módon van definiálva:

f(x) = {
  -4, ha x ∈ (0, π/2],
  0, ha x ∈ (π/2, π]
}

Terjesszük ki ezt a függvényt úgy, hogy minden x ∈ ℝ esetén értelmezve legyen, és Fourier-sora tisztán szinuszos legyen!

Számítsuk ki a Fourier-sor együtthatóit!`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Hogyan kell kiterjeszteni a függvényt, hogy páratlan legyen? Adja meg a kiterjesztett függvény definícióját a (-π, π) intervallumon!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: f(x) = { 4, ha x ∈ (-π/2, 0]; -4, ha x ∈ (0, π/2]; 0, máshol } és f(x) = f(x+2π)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Miért lesz a₀ = 0 és aₖ = 0?`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: A szimmetria miatt, mivel páratlan függvényről van szó`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg a szinuszos együtthatók (bₖ) képletét!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel az integrálokat a függvény definíciója alapján!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: bₖ = (1/π) [∫[-π/2,0] 4sin(kx) dx + ∫[0,π/2] (-4)sin(kx) dx]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Számítsa ki az integrálokat!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: bₖ = (1/π) [(-4cos(kx)/k)|[-π/2,0] + (4cos(kx)/k)|[0,π/2]]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Végezze el a behelyettesítést és egyszerűsítést!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: bₖ = -(8/πk)cos(kπ/2)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Adja meg a bₖ értékét, ha k páros, de nem osztható 4-gyel!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: bₖ = -16/(πk)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Adja meg a bₖ értékét, ha k páratlan!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: bₖ = -8/(πk)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 9: Adja meg a bₖ értékét, ha k osztható 4-gyel!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: bₖ = 0`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Mivel tisztán szinuszos Fourier-sort szeretnénk, ezért a függvényt páratlan módon terjesztjük ki.
Legyen a kiterjesztés a (-π, π) intervallumon:

f(x) = {
  4, ha x ∈ (-π/2, 0],
  -4, ha x ∈ (0, π/2],
  0, máshol
}

és f(x) = f(x+2π).

A szimmetria miatt:
a₀ = 0 és aₖ = 0

A szinuszos együtthatók:
bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx

A definíció felhasználásával:
bₖ = (1/π) [∫[-π/2,0] 4sin(kx) dx + ∫[0,π/2] (-4)sin(kx) dx]

Integrálva:
= (1/π) [(-4cos(kx)/k)|[-π/2,0] + (4cos(kx)/k)|[0,π/2]]

Behelyettesítve:
= (1/π) [(4/k)(1-cos(-kπ/2)) + (4/k)(cos(kπ/2)-1)]
= -(8/πk)cos(kπ/2)

Így a különböző esetek:
bₖ = {
  -16/(πk), ha k páros, de nem osztható 4-gyel,
  -8/(πk), ha k páratlan,
  0, ha k osztható 4-gyel
}`
            },
            {
                question: `3. feladat. Adjuk meg a

v⃗(x,y,z) = (-3x·sin(x), 2e^(2y), 3cos(x))

vektormező integrálját az A(1,2,2) és B(-1,0,2) pontokat összekötő egyenes szakasz mentén (az A pontból indulva)!

Megjegyzés: a végeredményben szereplő exponenciális függvény értékét nem kell pontosan meghatározni!`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Adja meg a görbe egy megfelelő paraméterezését!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(t) = (-2t+1, -2t+2, 2), t ∈ [0,1]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Adja meg a paraméterezés deriváltját!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗'(t) = (-2, -2, 0)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg a vektormező értékét a görbén!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: v⃗(r⃗(t)) = (-3(-2t+1)sin(-2t+1), 2e^(2(-2t+2)), 3cos(-2t+1)) = (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1))`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel a vonalintegrált!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt = ∫[0,1] (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1)) · (-2, -2, 0) dt`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Számítsa ki az integranduszt!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: ∫[0,1] [12sin(-2t+1) - 4e^(-4t+4)] dt`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Végezze el az integrálást!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: [-6cos(-2t+1) + e^(-4t+4)]|[0,1] = -6cos(-1) + e^0 - (-6cos(1) + e^4) = -e^4 + 1`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Paraméterezés:
A görbe egy megfelelő paraméterezése:
r⃗(t) = B + (1-t)(A-B) = (-1, 0, 2) + (1-t)(1, 2, 2) = (-2t+1, -2t+2, 2), t ∈ [0,1]

Ennek deriváltja:
r⃗'(t) = (-2, -2, 0)

Továbbá:
v⃗(r⃗(t)) = (-3(-2t+1)sin(-2t+1), 2e^(2(-2t+2)), 3cos(-2t+1))
         = (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1))

Így a vonalintegrál:
∫[γ] v⃗ · dr⃗ = ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt
            = ∫[0,1] (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1)) · (-2, -2, 0) dt
            = ∫[0,1] [12sin(-2t+1) - 4e^(-4t+4)] dt

Integrálva:
= [-6cos(-2t+1) + e^(-4t+4)]|[0,1]
= -6cos(-1) + e^0 - (-6cos(1) + e^4)
= -6cos(-1) + 1 + 6cos(1) - e^4
= -e^4 + 1`
            },
            {
                question: `Tekintsük az alábbi felületet:

V = {az origó középpontú, 2 sugarú gömbfelület y ≤ 0 és z ≥ 0 térbe eső része}
(tehát az oldallapok nem).

Számítsuk ki a

v⃗(x,y,z) = (3x, 3y, 3z+1)

vektormezőnek ezen a felületen vett felületi integrálját az origótól távolodó irányban (kifelé)!

Segítség az integráláshoz: 2sin(x)cos(x) = sin(2x).
Segítség a G-O tételhez: az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla (azaz ott nem kell kiszámítani).`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Írja fel a Gauss-Osztrigyin tétel alapján a felületi integrált!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: ∬[F] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Miért nulla az y=0 oldallap integrálja?`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: A Gauss-Osztrigyin tétel szerint az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Számítsa ki a vektormező divergenciáját!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: div(v⃗) = ∂/∂x(3x) + ∂/∂y(3y) + ∂/∂z(3z+1) = 3 + 3 + 3 = 9`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Számítsa ki a térfogati integrált (divergencia integrálja)!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: ∭[V] div(v⃗) dV = ∭[V] 9 dV = 9·Vol(V)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Adja meg a negyedgömb térfogatát!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·2³ = 8π/3`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Írja fel a z=0 oldallap paraméterezését!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,2], w ∈ [π,2π)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Számítsa ki a parciális deriváltakat!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: r⃗_u = (cos w, sin w, 0), r⃗_w = (-u sin w, u cos w, 0)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Számítsa ki a kereszt szorzatot és határozza meg a normálvektort!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: r⃗_u × r⃗_w = (0, 0, u), de mivel ez nem befelé mutat, a normálvektor: (0, 0, -u)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 9: Adja meg a vektormező értékét a z=0 oldallapon!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: v⃗(r⃗(u,w)) = (3u cos w, 3u sin w, 1)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 10: Számítsa ki a z=0 oldallap integrálját!`,
                        rubric: `Megoldás. 10. részfeladat megoldása ez: ∬[z=0] v⃗·dF⃗ = ∫[0,2]∫[π,2π] (3u cos w, 3u sin w, 1)·(0, 0, -u) dw du = ∫[0,2]∫[π,2π] (-u) dw du = -2π`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 11: Adja meg a végeredményt!`,
                        rubric: `Megoldás. 11. részfeladat megoldása ez: ∬[F] v⃗·dF⃗ = 9·8π/3 - 0 - (-2π) = 24π + 2π = 26π`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

A keresett felületi integrál kiszámítható a Gauss-Osztrigyin tétel alapján:
∬[F] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗

De ismert, hogy ∬[y=0 oldallap] v⃗·dF⃗ = 0.

A divergencia:
div(v⃗) = ∂/∂x(3x) + ∂/∂y(3y) + ∂/∂z(3z+1) = 3 + 3 + 3 = 9

Így:
∭[V] div(v⃗) dV = ∭[V] 9 dV = 9·Vol(V)

A negyedgömb térfogata:
V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·2³ = 8π/3

azaz
∭[V] div(v⃗) dV = 9·8π/3 = 24π

A z=0 oldallap paraméterezése:
r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,2], w ∈ [π,2π)

Parciális deriváltak:
r⃗_u = (cos w, sin w, 0)
r⃗_w = (-u sin w, u cos w, 0)

Keresztszorzat:
r⃗_u × r⃗_w = (0, 0, u)

Ez nem befelé mutat, ezért helyette a (0, 0, -u) vektort használjuk.

Továbbá:
v⃗(r⃗(u,w)) = (3u cos w, 3u sin w, 1)

Így:
∬[z=0] v⃗·dF⃗ = ∫[0,2]∫[π,2π] (3u cos w, 3u sin w, 1)·(0, 0, -u) dw du
            = ∫[0,2]∫[π,2π] (-u) dw du
            = ∫[0,2] (-πu) du
            = -πu²/2|[0,2]
            = -2π

Összesen:
∬[F] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0] v⃗·dF⃗ - ∬[z=0] v⃗·dF⃗
            = 24π - 0 - (-2π)
            = 24π + 2π
            = 26π`
            },
            {
                question: `Oldjuk meg az alábbi egyenletrendszert!

x'(t) = 2x(t) + 3y(t) + e^(-4t)
y'(t) = -3x(t) + 2y(t)`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Adja meg a rendszerhez tartozó mátrixot!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: A = [[2, 3], [-3, 2]]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Számítsa ki a mátrix sajátértékeit!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: λ₁,₂ = 2 ± 3i`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg a 2+3i sajátértékhez tartozó sajátvektort!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: s₁ = [-i, 1]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel a homogén megoldást!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: [x_h(t), y_h(t)] = c₁[e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[-e^(2t)cos(3t), e^(2t)sin(3t)]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Vezesse vissza másodrendűre az egyenletet a partikuláris megoldáshoz!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: x''(t) = 4x'(t) - 13x(t) - 6e^(-4t)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Határozza meg a próbaalakot és az A együtthatót!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: x_p(t) = A e^(-4t), ahol A = -2/15`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Adja meg a partikuláris megoldás másik komponensét!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: y_p(t) = -(1/15) e^(-4t)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Oldja meg közvetlenül a rendszerbe helyettesítéssel!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: x_p(t) = A e^(-4t), y_p(t) = B e^(-4t), ahol A = -2/15, B = -1/15`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 9: Adja meg az alapmátrixot az állandók variálásához!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: Φ(t) = [[e^(2t)sin(3t), -e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

A megoldást előállítjuk homogén + partikuláris alakban.

Homogén megoldás:
A rendszerhez tartozó mátrix:
A = [[2, 3], [-3, 2]]

Ennek sajátértékei:
λ₁,₂ = 2 ± 3i

A 2+3i-hez tartozó sajátvektor:
s₁ = [-i, 1]

azaz
e^((2+3i)t) = e^(2t)(cos(3t) + i sin(3t))

Így:
e^((2+3i)t) s₁ = e^(2t)(cos(3t) + i sin(3t)) [-i, 1]
                = [-i e^(2t)cos(3t) + e^(2t)sin(3t), e^(2t)cos(3t) + i e^(2t)sin(3t)]

Ebből a homogén megoldás (valós bázisban):
[x_h(t), y_h(t)] = c₁[e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[-e^(2t)cos(3t), e^(2t)sin(3t)]

Partikuláris megoldás:

Másodrendűre írás:
x''(t) = 2x'(t) + 3y'(t) - 4e^(-4t)
       = 2x'(t) - 9x(t) + 6y(t) - 4e^(-4t)

Az első egyenletből:
3y(t) = x'(t) - 2x(t) - e^(-4t)

Behelyettesítve:
x''(t) = 2x'(t) - 9x(t) + 2x'(t) - 4x(t) - 2e^(-4t) - 4e^(-4t)
       = 4x'(t) - 13x(t) - 6e^(-4t)

Próbaalak:
x_p(t) = A e^(-4t)

Behelyettesítve:
16A e^(-4t) = 4(-4A) e^(-4t) - 13A e^(-4t) - 6e^(-4t)
16A = -16A - 13A - 6
A = -6/45 = -2/15

Ezért
x_p(t) = -(2/15) e^(-4t)

A másik komponens:
y_p(t) = (1/3)(x'(t) - 2x(t) - e^(-4t))
       = (1/3)((8/15)e^(-4t) + (4/15)e^(-4t) - e^(-4t))
       = -(1/15) e^(-4t)

Partikuláris megoldás keresése közvetlenül a rendszerben:
Legyen x_p(t) = A e^(-4t) és y_p(t) = B e^(-4t)

Behelyettesítve:
-4A = 2A + 3B + 1
-4B = -3A + 2B

Ennek megoldása:
A = -2/15, B = -1/15

Állandók variálása:
Az alapmátrix:
Φ(t) = [[e^(2t)sin(3t), -e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]

Ennek inverze, az integrálás és az utolsó szorzás elvégzése után adódik a teljes megoldás.

Végső megoldás:
[x(t), y(t)] = c₁[e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[-e^(2t)cos(3t), e^(2t)sin(3t)] + [-(2/15)e^(-4t), -(1/15)e^(-4t)]`
            },
            {
                question: `a) Adjuk meg az alábbi differenciálegyenlet y(0)=1 kezdeti feltételt kielégítő megoldását!

y'(x) = (y(x))² x³

b) Határozzuk meg a megoldásfüggvény lokális szélsőértékeit!

Alternatíva: Keressük meg az alábbi függvény szélsőértékét:
f(x) = 1/(-x²/2 + 3)`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Írja fel az egyenletet szétválasztható formában!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: dy/dx = y² x³, azaz dy/y² = x³ dx`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Integrálja mindkét oldalt!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: ∫ y^(-2) dy = ∫ x³ dx, azaz -1/y = x⁴/4 + c`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Fejezze ki y-t!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: y = -1/(x⁴/4 + c)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Alkalmazza a kezdeti feltételt és határozza meg c értékét!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: y(0) = 1 = -1/c, tehát c = -1`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Írja fel a végleges megoldást!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: y(x) = -1/(x⁴/4 - 1) = -4/(x⁴ - 4)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Számítsa ki a deriváltat a szélsőértékekhez!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: y'(x) = (16x³)/(x⁴ - 4)²`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Határozza meg a derivált zérushelyeit!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: y'(x) = 0, ha x = 0`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Vizsgálja meg a második deriváltat és határozza meg a szélsőérték típusát!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: y''(0) < 0, tehát x = 0-nál lokális maximum van`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 9 (Alternatíva): Határozza meg az f(x) = 1/(-x²/2 + 3) függvény szélsőértékét!`,
                        rubric: `Megoldás. 9. részfeladat megoldása ez: f'(x) = x/(3 - x²/2)², f'(x) = 0, ha x = 0, f''(0) > 0, tehát x = 0-nál minimum van`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

a) Szétválasztható differenciálegyenlet:
dy/dx = y² x³
dy/y² = x³ dx

Integrálva mindkét oldalt:
∫ y^(-2) dy = ∫ x³ dx
-1/y = x⁴/4 + c

Fejezzük ki y-t:
y = -1/(x⁴/4 + c)

Kezdeti feltétel: y(0) = 1
1 = -1/c
c = -1

Végleges megoldás:
y(x) = -1/(x⁴/4 - 1) = -1/((x⁴ - 4)/4) = -4/(x⁴ - 4)

b) Szélsőértékek:
Deriválva:
y'(x) = d/dx[-4/(x⁴ - 4)] = 16x³/(x⁴ - 4)²

y'(x) = 0, ha x = 0

Második derivált:
y''(x) = [48x²(x⁴-4)² - 16x³·2(x⁴-4)·4x³] / (x⁴-4)⁴

y''(0) < 0, tehát x = 0-nál lokális maximum van.

Alternatíva:
f(x) = 1/(-x²/2 + 3) = 1/(3 - x²/2)

f'(x) = d/dx[(3 - x²/2)^(-1)] = x/(3 - x²/2)²

f'(x) = 0, ha x = 0

f''(x) = [(3-x²/2)² - x·2(3-x²/2)(-x)] / (3-x²/2)⁴

f''(0) > 0, tehát x = 0-nál minimum van.`
            },
            {
                question: `(Fourier sorok feladatsor 5. feladat) Tekintsük azt az f:[0,2]→ℝ függvényt, mely az alábbi módon van definiálva:

f(x) = {
  0, ha x ∈ [0,1],
  1, ha x ∈ (1, 3/2],
  -2, ha x ∈ (3/2, 2]
}

Terjesszük ki ezt a függvényt úgy, hogy minden x ∈ ℝ esetén értelmezve legyen, és Fourier-sora tisztán koszinuszos legyen!
Számítsuk ki ezt a Fourier-sort!`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Hogyan kell kiterjeszteni a függvényt, hogy páros legyen? Adja meg a kiterjesztett függvény definícióját!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: Páros módon kiterjesztjük: f(x) = f(-x) és f(x) = f(x+4) (4 a periódus, mert 2L = 4)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Miért lesz bₖ = 0 minden k-ra?`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: A szimmetria miatt, mivel páros függvényről van szó`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg az a₀ együttható képletét és számítsa ki!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: a₀ = (1/L) ∫[0,L] f(x) dx = (1/2) ∫[0,2] f(x) dx = (1/2)[0 + 1·(3/2-1) + (-2)·(2-3/2)] = (1/2)[1/2 - 1] = -1/4`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Adja meg az aₖ együtthatók képletét!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: aₖ = (2/L) ∫[0,L] f(x)cos(kπx/L) dx = (2/2) ∫[0,2] f(x)cos(kπx/2) dx = ∫[0,2] f(x)cos(kπx/2) dx`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Írja fel az integrálokat a függvény definíciója alapján!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: aₖ = ∫[0,1] 0·cos(kπx/2) dx + ∫[1,3/2] 1·cos(kπx/2) dx + ∫[3/2,2] (-2)·cos(kπx/2) dx`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Számítsa ki az integrálokat!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: aₖ = [2/(kπ)sin(kπx/2)]|[1,3/2] - 2[2/(kπ)sin(kπx/2)]|[3/2,2] = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[sin(kπ) - sin(3kπ/4)]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Egyszerűsítse az aₖ kifejezést!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: aₖ = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[0 - sin(3kπ/4)] = (2/(kπ))[sin(3kπ/4) - sin(kπ/2) + 2sin(3kπ/4)] = (2/(kπ))[3sin(3kπ/4) - sin(kπ/2)]`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Mivel tisztán koszinuszos Fourier-sort szeretnénk, ezért a függvényt páros módon terjesztjük ki.
Legyen a kiterjesztés: f(x) = f(-x) és f(x) = f(x+4) (4 a periódus, mert 2L = 4, ahol L = 2)

A szimmetria miatt:
bₖ = 0 minden k-ra

Az a₀ együttható:
a₀ = (1/L) ∫[0,L] f(x) dx = (1/2) ∫[0,2] f(x) dx
   = (1/2)[∫[0,1] 0 dx + ∫[1,3/2] 1 dx + ∫[3/2,2] (-2) dx]
   = (1/2)[0 + 1·(3/2-1) + (-2)·(2-3/2)]
   = (1/2)[1/2 - 1]
   = -1/4

Az aₖ együtthatók (k ≥ 1):
aₖ = (2/L) ∫[0,L] f(x)cos(kπx/L) dx
   = (2/2) ∫[0,2] f(x)cos(kπx/2) dx
   = ∫[0,2] f(x)cos(kπx/2) dx

A definíció felhasználásával:
aₖ = ∫[0,1] 0·cos(kπx/2) dx + ∫[1,3/2] 1·cos(kπx/2) dx + ∫[3/2,2] (-2)·cos(kπx/2) dx
   = 0 + [2/(kπ)sin(kπx/2)]|[1,3/2] - 2[2/(kπ)sin(kπx/2)]|[3/2,2]
   = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[sin(kπ) - sin(3kπ/4)]
   = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[0 - sin(3kπ/4)]
   = (2/(kπ))[sin(3kπ/4) - sin(kπ/2) + 2sin(3kπ/4)]
   = (2/(kπ))[3sin(3kπ/4) - sin(kπ/2)]

A Fourier-sor:
f(x) = a₀/2 + Σ[k=1,∞] aₖ cos(kπx/2)
     = -1/8 + Σ[k=1,∞] (2/(kπ))[3sin(3kπ/4) - sin(kπ/2)] cos(kπx/2)`
            },
            {
                question: `(Feltételes szélsőérték feladatsor 5. feladat) Keressük az alábbi függvény szélsőértékeit az

(x-1)² + y² ≤ 1

egyenletű körlapon!

f(x,y) = x² - y² + 3x - 1`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Számítsa ki a függvény gradiensét!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: ∇f = (∂f/∂x, ∂f/∂y) = (2x + 3, -2y)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Keresse meg a belső kritikus pontokat (ahol a gradiens nulla)!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: 2x + 3 = 0 és -2y = 0, tehát x = -3/2, y = 0. Ellenőrizzük: (-3/2 - 1)² + 0² = 25/4 > 1, tehát ez nincs a körlapon belül`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Írja fel a Lagrange-multiplikátor módszer egyenleteit a határon!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: ∇f = λ∇g, ahol g(x,y) = (x-1)² + y² - 1 = 0. Tehát: (2x+3, -2y) = λ(2(x-1), 2y)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Oldja meg a Lagrange-egyenleteket!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: 2x+3 = 2λ(x-1) és -2y = 2λy. Ha y ≠ 0, akkor λ = -1, és ebből x = -1/2. Ha y = 0, akkor a feltételből x = 0 vagy x = 2`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Határozza meg az összes kritikus pontot a határon!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: (0, 0), (2, 0), (-1/2, ±√3/2)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Számítsa ki a függvény értékét minden kritikus pontban!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: f(0,0) = -1, f(2,0) = 9, f(-1/2, √3/2) = -5/4, f(-1/2, -√3/2) = -5/4`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Adja meg a maximum és minimum értékeket!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: Maximum: f(2,0) = 9, Minimum: f(-1/2, ±√3/2) = -5/4`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Belső pontok keresése:
A gradiens:
∇f = (∂f/∂x, ∂f/∂y) = (2x + 3, -2y)

Kritikus pontok (ahol a gradiens nulla):
2x + 3 = 0 → x = -3/2
-2y = 0 → y = 0

Ellenőrizzük, hogy ez a pont a körlapon belül van-e:
(-3/2 - 1)² + 0² = (-5/2)² = 25/4 > 1

Tehát ez a pont nincs a körlapon belül, így csak a határt kell vizsgálni.

Határ vizsgálata (Lagrange-multiplikátor módszer):
Feltétel: g(x,y) = (x-1)² + y² - 1 = 0

Lagrange-egyenletek:
∇f = λ∇g
(2x+3, -2y) = λ(2(x-1), 2y)

Tehát:
2x + 3 = 2λ(x-1)  ... (1)
-2y = 2λy        ... (2)
(x-1)² + y² = 1   ... (3)

A (2) egyenletből:
-2y = 2λy
y(λ + 1) = 0

Esetszétválasztás:

1. eset: y = 0
Ekkor a (3) egyenletből: (x-1)² = 1, tehát x = 0 vagy x = 2
Pontok: (0, 0) és (2, 0)

2. eset: y ≠ 0, akkor λ = -1
Ekkor az (1) egyenletből:
2x + 3 = -2(x-1)
2x + 3 = -2x + 2
4x = -1
x = -1/2

A (3) egyenletből:
(-1/2 - 1)² + y² = 1
(-3/2)² + y² = 1
9/4 + y² = 1
y² = 1 - 9/4 = -5/4

Ez lehetetlen, tehát nincs ilyen pont.

Várjunk, újraszámolva:
Ha λ = -1 és x = -1/2, akkor:
(-1/2 - 1)² + y² = 1
(-3/2)² + y² = 1
9/4 + y² = 1
y² = -5/4

Ez valóban lehetetlen. Próbáljuk meg újra a Lagrange-egyenleteket.

Valójában a határon paraméterezéssel is megoldható:
x = 1 + cos t, y = sin t, t ∈ [0, 2π)

f(x(t), y(t)) = (1+cos t)² - sin² t + 3(1+cos t) - 1
              = 1 + 2cos t + cos² t - sin² t + 3 + 3cos t - 1
              = 3 + 5cos t + cos² t - sin² t
              = 3 + 5cos t + cos(2t)

Deriválva t szerint:
f'(t) = -5sin t - 2sin(2t) = -5sin t - 4sin t cos t = -sin t(5 + 4cos t)

f'(t) = 0, ha sin t = 0 vagy cos t = -5/4 (lehetetlen)

sin t = 0 → t = 0, π, 2π

Pontok:
t = 0: (2, 0) → f(2,0) = 4 - 0 + 6 - 1 = 9
t = π: (0, 0) → f(0,0) = 0 - 0 + 0 - 1 = -1
t = 2π: (2, 0) → ugyanaz

További kritikus pontok lehetnek, ahol cos t = -5/4 lehetetlen, de nézzük meg a második deriváltat is.

Valójában egyszerűbb módszer: a határon a függvény értéke:
f(x,y) = x² - y² + 3x - 1, ahol (x-1)² + y² = 1

y² = 1 - (x-1)² = 1 - (x² - 2x + 1) = 2x - x²

f(x) = x² - (2x - x²) + 3x - 1 = x² - 2x + x² + 3x - 1 = 2x² + x - 1

f'(x) = 4x + 1 = 0 → x = -1/4

De x ∈ [0, 2] a határon, mert (x-1)² ≤ 1 → 0 ≤ x ≤ 2

f(0) = -1, f(2) = 9, f(-1/4) nincs a [0,2] intervallumban

Tehát:
Maximum: f(2, 0) = 9
Minimum: f(0, 0) = -1`
            },
            {
                question: `Vonalintegrál (3. gyakorlat 1. f) és 5. feladat) Számítsuk ki a

v⃗(x,y,z) = (2xyz, x²z, x²y)

vektormező integrálját a z = 3 síkban fekvő x² + y² = 1 körnek az A(1,0,3) és B(1/√2, 1/√2, 3) pontok közötti íve mentén!`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Adja meg a görbe paraméterezését!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(t) = (cos t, sin t, 3), t ∈ [0, π/4]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Adja meg a paraméterezés deriváltját!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗'(t) = (-sin t, cos t, 0)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Adja meg a vektormező értékét a görbén!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: v⃗(r⃗(t)) = (2cos t·sin t·3, cos² t·3, cos² t·sin t) = (6cos t sin t, 3cos² t, cos² t sin t)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel a vonalintegrált!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: ∫[0,π/4] v⃗(r⃗(t)) · r⃗'(t) dt = ∫[0,π/4] (6cos t sin t, 3cos² t, cos² t sin t) · (-sin t, cos t, 0) dt`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Számítsa ki az integranduszt!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: ∫[0,π/4] [-6cos t sin² t + 3cos³ t] dt`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Végezze el az integrálást!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: ∫[0,π/4] [-6cos t sin² t + 3cos³ t] dt = [-3sin³ t + 3sin t]|[0,π/4] = -3(1/√2)³ + 3(1/√2) = -3/(2√2) + 3/√2 = 3/(2√2)`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Paraméterezés:
A görbe a z = 3 síkban fekvő x² + y² = 1 kör íve.
Paraméterezés: r⃗(t) = (cos t, sin t, 3), t ∈ [0, π/4]

Ellenőrizzük:
- A(1,0,3) = (cos 0, sin 0, 3) ✓
- B(1/√2, 1/√2, 3) = (cos π/4, sin π/4, 3) ✓

Derivált:
r⃗'(t) = (-sin t, cos t, 0)

Vektormező értéke a görbén:
v⃗(r⃗(t)) = (2cos t·sin t·3, cos² t·3, cos² t·sin t)
         = (6cos t sin t, 3cos² t, cos² t sin t)

Vonalintegrál:
∫[γ] v⃗ · dr⃗ = ∫[0,π/4] v⃗(r⃗(t)) · r⃗'(t) dt
            = ∫[0,π/4] (6cos t sin t, 3cos² t, cos² t sin t) · (-sin t, cos t, 0) dt
            = ∫[0,π/4] [-6cos t sin² t + 3cos³ t] dt

Integrálás:
∫[-6cos t sin² t + 3cos³ t] dt
= ∫[-6cos t sin² t] dt + ∫[3cos³ t] dt
= -6∫[cos t sin² t] dt + 3∫[cos³ t] dt

Az első integrál:
∫[cos t sin² t] dt = ∫[sin² t] d(sin t) = sin³ t/3

A második integrál:
∫[cos³ t] dt = ∫[cos t cos² t] dt = ∫[cos t (1 - sin² t)] dt
            = ∫[cos t] dt - ∫[cos t sin² t] dt
            = sin t - sin³ t/3

Tehát:
∫[-6cos t sin² t + 3cos³ t] dt
= -6(sin³ t/3) + 3(sin t - sin³ t/3)
= -2sin³ t + 3sin t - sin³ t
= -3sin³ t + 3sin t

Határok közé helyettesítve:
[-3sin³ t + 3sin t]|[0,π/4]
= -3(1/√2)³ + 3(1/√2) - 0
= -3/(2√2) + 3/√2
= -3/(2√2) + 6/(2√2)
= 3/(2√2)`
            },
            {
                question: `Felületi integrál (4. gyakorlat 2. és 5. gyakorlat 1. feladat) Számítsuk ki a

v⃗(x,y,z) = (2x, 2y, 2z)

vektormezőnek a

V = {(x,y,z): x² + y² ≤ 1, z = 1 - √(x² + y²)}

felületen vett felületi integrálját a z tengelytől távolodó irányban!`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Írja fel a felület paraméterezését!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(u,v) = (u cos v, u sin v, 1-u), u ∈ [0,1], v ∈ [0,2π)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Számítsa ki a parciális deriváltakat!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗_u = (cos v, sin v, -1), r⃗_v = (-u sin v, u cos v, 0)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Számítsa ki a kereszt szorzatot!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: r⃗_u × r⃗_v = (u cos v, u sin v, u)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Ellenőrizze, hogy a normálvektor a z tengelytől távolodó irányba mutat-e!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: A normálvektor (u cos v, u sin v, u) komponensei pozitívak, tehát kifelé mutat`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Adja meg a vektormező értékét a felületen!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: v⃗(r⃗(u,v)) = (2u cos v, 2u sin v, 2(1-u))`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Írja fel a felületi integrált!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: ∬[V] v⃗·dF⃗ = ∫[0,1]∫[0,2π] (2u cos v, 2u sin v, 2(1-u)) · (u cos v, u sin v, u) dv du`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Számítsa ki a skaláris szorzatot!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: v⃗·(r⃗_u × r⃗_v) = 2u²cos²v + 2u²sin²v + 2u(1-u) = 2u² + 2u - 2u² = 2u`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Végezze el az integrálást!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: ∫[0,1]∫[0,2π] 2u dv du = ∫[0,1] 4πu du = 2πu²|[0,1] = 2π`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Paraméterezés:
A felület: z = 1 - √(x² + y²), ahol x² + y² ≤ 1

Polárkoordinátás paraméterezés:
r⃗(u,v) = (u cos v, u sin v, 1-u), u ∈ [0,1], v ∈ [0,2π)

Parciális deriváltak:
r⃗_u = (cos v, sin v, -1)
r⃗_v = (-u sin v, u cos v, 0)

Kereszt szorzat (normálvektor):
r⃗_u × r⃗_v = |i  j  k |
            |cos v  sin v  -1|
            |-u sin v  u cos v  0|
         = (u cos v, u sin v, u)

A normálvektor (u cos v, u sin v, u) komponensei pozitívak (u ≥ 0), tehát kifelé mutat a z tengelytől távolodó irányba.

Vektormező értéke a felületen:
v⃗(r⃗(u,v)) = (2u cos v, 2u sin v, 2(1-u))

Felületi integrál:
∬[V] v⃗·dF⃗ = ∫[0,1]∫[0,2π] v⃗(r⃗(u,v)) · (r⃗_u × r⃗_v) dv du
            = ∫[0,1]∫[0,2π] (2u cos v, 2u sin v, 2(1-u)) · (u cos v, u sin v, u) dv du

Skaláris szorzat:
(2u cos v, 2u sin v, 2(1-u)) · (u cos v, u sin v, u)
= 2u²cos²v + 2u²sin²v + 2u(1-u)
= 2u²(cos²v + sin²v) + 2u - 2u²
= 2u² + 2u - 2u²
= 2u

Integrálás:
∫[0,1]∫[0,2π] 2u dv du
= ∫[0,1] 2u · 2π du
= 4π ∫[0,1] u du
= 4π · u²/2|[0,1]
= 4π · 1/2
= 2π`
            },
            {
                question: `Inhomogén differenciálegyenlet-rendszer (11. gyakorlat 1. feladat) Oldjuk meg az alábbi egyenletrendszert!

x'(t) = y(t) + 2e^t
y'(t) = x(t) + z(t) + t²
z'(t) = y(t) + t`,
                answer: 0,
                alternativeAnswer: undefined,
                thirdAnswer: undefined,
                fourthAnswer: undefined,
                type: 'multiplication',
                subQuestions: [
                    {
                        question: `Részfeladat 1: Írja fel a rendszer mátrixos alakját!`,
                        rubric: `Megoldás. 1. részfeladat megoldása ez: [x', y', z']ᵀ = A[x, y, z]ᵀ + [2e^t, t², t]ᵀ, ahol A = [[0, 1, 0], [1, 0, 1], [0, 1, 0]]`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 2: Számítsa ki a mátrix sajátértékeit!`,
                        rubric: `Megoldás. 2. részfeladat megoldása ez: det(A - λI) = 0, sajátértékek: λ₁ = 0, λ₂ = √2, λ₃ = -√2`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 3: Határozza meg a sajátvektorokat!`,
                        rubric: `Megoldás. 3. részfeladat megoldása ez: λ₁ = 0: [1, 0, -1]ᵀ, λ₂ = √2: [1, √2, 1]ᵀ, λ₃ = -√2: [1, -√2, 1]ᵀ`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 4: Írja fel a homogén megoldást!`,
                        rubric: `Megoldás. 4. részfeladat megoldása ez: [x_h, y_h, z_h]ᵀ = c₁[1, 0, -1]ᵀ + c₂[1, √2, 1]ᵀe^(√2t) + c₃[1, -√2, 1]ᵀe^(-√2t)`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 5: Keressen partikuláris megoldást az x_p(t) = Ae^t alakban!`,
                        rubric: `Megoldás. 5. részfeladat megoldása ez: x_p(t) = 2e^t/(1-1) divergál, más próbaalak kell`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 6: Keressen partikuláris megoldást az inhomogén tagokhoz!`,
                        rubric: `Megoldás. 6. részfeladat megoldása ez: Próbaalak: x_p = Ate^t, y_p = Bt² + Ct + D, z_p = Et² + Ft + G`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 7: Határozza meg a partikuláris megoldás együtthatóit!`,
                        rubric: `Megoldás. 7. részfeladat megoldása ez: Behelyettesítéssel és együtthatók összehasonlításával meghatározható az A, B, C, D, E, F, G`,
                        answer: 0
                    },
                    {
                        question: `Részfeladat 8: Írja fel a teljes megoldást!`,
                        rubric: `Megoldás. 8. részfeladat megoldása ez: [x, y, z]ᵀ = homogén megoldás + partikuláris megoldás`,
                        answer: 0
                    }
                ],
                expression: `Teljes megoldás:

Mátrixos alak:
[x', y', z']ᵀ = A[x, y, z]ᵀ + [2e^t, t², t]ᵀ

ahol
A = [[0, 1, 0],
     [1, 0, 1],
     [0, 1, 0]]

Homogén rész:
A sajátértékek meghatározása:
det(A - λI) = 0
| -λ   1   0 |
|  1  -λ   1 | = 0
|  0   1  -λ |

-λ(-λ² - 1) - 1(-λ) = -λ³ + λ = -λ(λ² - 2) = 0

Sajátértékek: λ₁ = 0, λ₂ = √2, λ₃ = -√2

Sajátvektorok:
- λ₁ = 0: [1, 0, -1]ᵀ
- λ₂ = √2: [1, √2, 1]ᵀ
- λ₃ = -√2: [1, -√2, 1]ᵀ

Homogén megoldás:
[x_h, y_h, z_h]ᵀ = c₁[1, 0, -1]ᵀ + c₂[1, √2, 1]ᵀe^(√2t) + c₃[1, -√2, 1]ᵀe^(-√2t)

Partikuláris megoldás:
Az inhomogén tag: [2e^t, t², t]ᵀ

Próbaalakok:
- x_p(t) = Ate^t (mert e^t már szerepel a homogén megoldásban)
- y_p(t) = Bt² + Ct + D
- z_p(t) = Et² + Ft + G

Behelyettesítve a rendszerbe:
x'_p = y_p + 2e^t
y'_p = x_p + z_p + t²
z'_p = y_p + t

Ebből:
Ae^t + Ate^t = Bt² + Ct + D + 2e^t
2Bt + C = Ate^t + Et² + Ft + G + t²
2Et + F = Bt² + Ct + D + t

Együtthatók összehasonlításával meghatározható az A, B, C, D, E, F, G.

Teljes megoldás:
[x, y, z]ᵀ = homogén megoldás + partikuláris megoldás`
            }
        ];

    const generateSzigorlatQuestionsBySubject = (subjectId: string) => {
        // Előre definiált feladatokat használunk
        setTaskQuestions(szigorlatQuestions);
        
        // Azonnal elindítjuk a játékot
        if (szigorlatQuestions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setCurrentSubQuestion(0);
            setSubQuestionAnswers({});
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    };

    const generateVegyesSzigorlatQuestions = () => {
        // Előre definiált feladatokat használunk
        setTaskQuestions(szigorlatQuestions);
        
        // Azonnal elindítjuk a játékot
        if (szigorlatQuestions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setCurrentSubQuestion(0);
            setSubQuestionAnswers({});
            setShowSolutions(false);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    };

    const generateHighschoolQuestionByTopic = (topicId: string, grade: number, difficulty: number = 0): Question | null => {
        const topicIdLower = topicId.toLowerCase();

        // Abszolútérték, gyök
        if (topicIdLower.includes('abszolutertek') || topicIdLower.includes('gyok')) {
            // A difficulty alapján változtatjuk a nehézséget (0-4: könnyűtől nehezebbig)
            const questionType = Math.floor(Math.random() * (difficulty + 1) * 10) % 15;
            
            if (questionType < 5 || difficulty === 0) {
                // Könnyű: egyszerű abszolútérték számítások
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                const answer = Math.abs(a - b);
                return {
                    question: `|${a} - ${b}| = ?`,
                    answer: answer,
                    type: 'multiplication',
                    expression: `|${a} - ${b}| = |${a - b}| = ${answer}`
                };
            } else if (questionType < 10 || difficulty <= 2) {
                // Közepes: abszolútértékes egyenletek |x - a| = b
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                const solution1 = a + b;
                const solution2 = a - b;
                return {
                    question: `|x - ${a}| = ${b}. Mennyi x?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                    answer: Math.round(solution1 * 1000) / 1000,
                    alternativeAnswer: Math.round(solution2 * 1000) / 1000,
                    type: 'multiplication',
                    expression: `|x - ${a}| = ${b} → x - ${a} = ±${b} → x = ${a} ± ${b} → x₁ = ${Math.round(solution1 * 1000) / 1000}, x₂ = ${Math.round(solution2 * 1000) / 1000}`
                };
            } else {
                // Nehezebb: gyökös egyenletek √(x + a) = b
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 5) + 2;
                const solution = b * b - a;
                if (solution >= 0) {
                    return {
                        question: `√(x + ${a}) = ${b}\n\nMennyi x?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                        answer: Math.round(solution * 1000) / 1000,
                        type: 'multiplication',
                        expression: `√(x + ${a}) = ${b} → x + ${a} = ${b}² → x + ${a} = ${b * b} → x = ${Math.round(solution * 1000) / 1000}`
                    };
                } else {
                    // Ha negatív lenne, akkor abszolútértékes egyenletet adunk
                    const a2 = Math.floor(Math.random() * 10) + 1;
                    const b2 = Math.floor(Math.random() * 10) + 1;
                    const solution1 = a2 + b2;
                    const solution2 = a2 - b2;
                    return {
                        question: `|x - ${a2}| = ${b2}. Mennyi x?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                        answer: Math.round(solution1 * 1000) / 1000,
                        alternativeAnswer: Math.round(solution2 * 1000) / 1000,
                        type: 'multiplication',
                        expression: `|x - ${a2}| = ${b2} → x - ${a2} = ±${b2} → x = ${a2} ± ${b2} → x₁ = ${Math.round(solution1 * 1000) / 1000}, x₂ = ${Math.round(solution2 * 1000) / 1000}`
                    };
                }
            }
        }
        // Egyenletek
        else if (topicIdLower.includes('egyenletek') || topicIdLower.includes('egyenlet')) {
            return generateQuadraticQuestion();
        }
        // Síkgeometria
        else if (topicIdLower.includes('sikgeometria') || topicIdLower.includes('sik')) {
            return generateGeometryQuestion();
        }
        // Függvények
        else if (topicIdLower.includes('fuggvenyek') || topicIdLower.includes('fuggveny')) {
            return generateDerivativeQuestion();
        }
        // Trigonometria
        else if (topicIdLower.includes('trigonometria') || topicIdLower.includes('trigonometri')) {
            return generateTrigonometryQuestion();
        }
        // Statisztika
        else if (topicIdLower.includes('statisztika')) {
            const nums = [1, 2, 3, 4, 5];
            const answer = nums.reduce((a, b) => a + b, 0) / nums.length;
            return {
                question: `Adatok: ${nums.join(', ')}. Átlag?`,
                answer: answer,
                type: 'multiplication',
                expression: `Átlag = (${nums.join(' + ')}) / ${nums.length} = ${answer}`
            };
        }
        // Koordinátageometria
        else if (topicIdLower.includes('koordinatageometria') || topicIdLower.includes('koordinata')) {
            const x1 = Math.floor(Math.random() * 10);
            const y1 = Math.floor(Math.random() * 10);
            const x2 = Math.floor(Math.random() * 10);
            const y2 = Math.floor(Math.random() * 10);
            const answer = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            return {
                question: `A(${x1}, ${y1}) és B(${x2}, ${y2}) pontok távolsága?`,
                answer: Math.round(answer * 10) / 10,
                type: 'multiplication',
                expression: `d = √((${x2}-${x1})² + (${y2}-${y1})²) = ${Math.round(answer * 10) / 10}`
            };
        }
        // Valószínűségszámítás
        else if (topicIdLower.includes('valoszinuseg')) {
            return {
                question: 'Egy kockával dobva, mi a valószínűsége, hogy 3-nál nagyobb számot dobunk?',
                answer: 0.5,
                type: 'multiplication',
                expression: 'Kedvező: 4,5,6 (3 db), Összes: 6, P = 3/6 = 0.5'
            };
        }
        // Logaritmus
        else if (topicIdLower.includes('logaritmus') || topicIdLower.includes('log')) {
            const base = Math.floor(Math.random() * 3) + 2;
            const power = Math.floor(Math.random() * 5) + 1;
            return {
                question: `log${base}(${Math.pow(base, power)}) = ?`,
                answer: power,
                type: 'multiplication',
                expression: `log${base}(${Math.pow(base, power)}) = log${base}(${base}^${power}) = ${power}`
            };
        }
        // Kombinatorika
        else if (topicIdLower.includes('kombinatorika')) {
            const n = Math.floor(Math.random() * 5) + 3;
            const k = Math.floor(Math.random() * (n - 1)) + 1;
            const answer = Math.round((n * (n - 1)) / 2);
            return {
                question: `${n} elem közül hányféleképpen választhatunk ki ${k} elemet? (Egyszerűsített)`,
                answer: answer,
                type: 'multiplication',
                expression: `C(${n},${k}) ≈ ${answer}`
            };
        }
        // Sorozatok
        else if (topicIdLower.includes('sorozatok') || topicIdLower.includes('sorozat')) {
            const a1 = Math.floor(Math.random() * 10) + 1;
            const d = Math.floor(Math.random() * 5) + 1;
            const n = 5;
            const answer = a1 + (n - 1) * d;
            return {
                question: `Számtani sorozat: a₁ = ${a1}, d = ${d}. Mennyi a₅?`,
                answer: answer,
                type: 'addition',
                expression: `a₅ = a₁ + 4d = ${a1} + 4·${d} = ${answer}`
            };
        }

        // Alapértelmezett
        return generateQuadraticQuestion();
    };

    const generateUniversityQuestionByTopic = (subjectId: string, topicId: string, difficulty: number = 0): Question | null => {
        const topicIdLower = topicId.toLowerCase();
        const subjectIdLower = subjectId.toLowerCase();

        // Analízis I témakörök
        if (subjectIdLower.includes('analizis1') || subjectIdLower.includes('analizis-1')) {
            if (topicIdLower.includes('komplex') || topicIdLower.includes('komplex')) {
                return {
                    question: 'i² = ? (ahol i a komplex egyseg)',
                    answer: -1,
                    type: 'multiplication',
                    expression: 'i² = -1 (komplex szám definíciója)'
                };
            } else if (topicIdLower.includes('sorozatok') || topicIdLower.includes('sorozat')) {
                return {
                    question: '∑(n=1 to ∞) 1/2ⁿ = ?',
                    answer: 1,
                    type: 'multiplication',
                    expression: 'Geometriai sor: a/(1-r) = (1/2)/(1-1/2) = 1'
                };
            } else if (topicIdLower.includes('egyvaltozos') || topicIdLower.includes('egyváltozós')) {
                return {
                    question: 'f(x) = x² + 3x - 2, f(1) = ?',
                    answer: 2,
                    type: 'multiplication',
                    expression: 'f(1) = 1² + 3·1 - 2 = 1 + 3 - 2 = 2'
                };
            } else if (topicIdLower.includes('fuggvenyvizsgalat') || topicIdLower.includes('függvényvizsgálat')) {
                return generateDerivativeQuestion();
            } else if (topicIdLower.includes('differencialszamitas') || topicIdLower.includes('differenciálszámítás') || topicIdLower.includes('differencial')) {
                return generateDerivativeQuestion();
            } else if (topicIdLower.includes('kozepertek') || topicIdLower.includes('középérték')) {
                return {
                    question: 'Lagrange középértéktétel: f(x)=x² [0,2] intervallumon. Hányadik pontban?',
                    answer: 1,
                    type: 'multiplication',
                    expression: 'f\'(c) = (f(2)-f(0))/(2-0) = (4-0)/2 = 2, c=1'
                };
            } else if (topicIdLower.includes('parametereesen') || topicIdLower.includes('paraméteresen') || topicIdLower.includes('gorbek')) {
                return {
                    question: 'x(t)=t, y(t)=t² paraméteres görbe. dy/dx t=1-nél?',
                    answer: 2,
                    type: 'multiplication',
                    expression: 'dy/dx = (dy/dt)/(dx/dt) = 2t/1 = 2t, t=1-nél: 2'
                };
            } else if (topicIdLower.includes('integralas') || topicIdLower.includes('integrál')) {
                return generateIntegralQuestion();
            }
        }
        // Analízis II témakörök
        else if (subjectIdLower.includes('analizis2') || subjectIdLower.includes('analizis-2')) {
            if (topicIdLower.includes('matrix') || topicIdLower.includes('mátrix')) {
                return {
                    question: '[[2,1],[3,4]] determinánsa?',
                    answer: 5,
                    type: 'multiplication',
                    expression: 'det = 2·4 - 1·3 = 8 - 3 = 5'
                };
            } else if (topicIdLower.includes('linearis-transzform') || topicIdLower.includes('lineáris transzform')) {
                return {
                    question: 'Lineáris transzformáció: T(x,y) = (2x, 3y). T(1,1) első komponense?',
                    answer: 2,
                    type: 'multiplication',
                    expression: 'T(1,1) = (2·1, 3·1) = (2, 3), első komponens: 2'
                };
            } else if (topicIdLower.includes('numerikus-sorok') || topicIdLower.includes('numerikus sor')) {
                return {
                    question: '∑(n=1 to ∞) 1/n² konvergens? (1=igen, 0=nem)',
                    answer: 1,
                    type: 'multiplication',
                    expression: 'Igen, p-sor p=2>1, konvergens'
                };
            } else if (topicIdLower.includes('sorok') && !topicIdLower.includes('fourier') && !topicIdLower.includes('taylor') && !topicIdLower.includes('numerikus')) {
                return {
                    question: '∑(n=0 to ∞) xⁿ konvergenciasugara? |x|<1 esetén (1=konvergens, 0=divergens)',
                    answer: 1,
                    type: 'multiplication',
                    expression: 'Geometriai sor, |x|<1 esetén konvergens'
                };
            } else if (topicIdLower.includes('fourier')) {
                return {
                    question: 'Fourier-sor periodikus függvényeket reprezentál? (1=igen, 0=nem)',
                    answer: 1,
                    type: 'multiplication',
                    expression: 'Igen, Fourier-sor periodikus függvényeket reprezentál'
                };
            } else if (topicIdLower.includes('taylor')) {
                return {
                    question: 'e^x Taylor-sora x=0 körül első tagja?',
                    answer: 1,
                    type: 'multiplication',
                    expression: 'e^x = 1 + x + x²/2! + ..., első tag: 1'
                };
            } else if (topicIdLower.includes('ketvaltozos') || topicIdLower.includes('kétváltozós')) {
                return {
                    question: 'f(x,y) = x² + y², ∂f/∂x(1,2) = ?',
                    answer: 2,
                    type: 'multiplication',
                    expression: '∂f/∂x = 2x, ∂f/∂x(1,2) = 2·1 = 2'
                };
            } else if (topicIdLower.includes('tobbvaltozos') || topicIdLower.includes('többváltozós')) {
                return {
                    question: 'f(x,y,z) = x² + y² + z², ∂f/∂x(1,1,1) = ?',
                    answer: 2,
                    type: 'multiplication',
                    expression: '∂f/∂x = 2x, ∂f/∂x(1,1,1) = 2·1 = 2'
                };
            }
        }
        // Analízis III témakörök
        else if (subjectIdLower.includes('analizis3') || subjectIdLower.includes('analizis-3')) {
            if (topicIdLower.includes('vektoranalizis') || topicIdLower.includes('vektoranalízis') || topicIdLower.includes('vektor')) {
                return {
                    question: '(2,3,1) és (1,1,0) vektorok skaláris szorzata?',
                    answer: 5,
                    type: 'multiplication',
                    expression: '(2,3,1)·(1,1,0) = 2·1 + 3·1 + 1·0 = 5'
                };
            } else if (topicIdLower.includes('differencialegyenletek') || topicIdLower.includes('differenciálegyenlet')) {
                return {
                    question: 'dy/dx = y egyenlet általános megoldása? (Egyszerűsített, C=1 esetén y(0)=?)',
                    answer: 1,
                    type: 'multiplication',
                    expression: 'y = Ce^x, C=1 esetén y(0) = 1'
                };
            }
        }

        // Alapértelmezett: deriválás
        return generateDerivativeQuestion();
    };

    const generateUniversityQuestionsByTopic = (subjectId: string, topicId: string) => {
        // Tantárgy és témakör nevének beállítása
        const subject = universitySubjects.find(s => s.id === subjectId);
        if (subject) {
            setSelectedUniversitySubject(subject.title);
            const topic = subject.topics.find(t => t.id === topicId);
            if (topic) {
                setSelectedUniversityTopic(topic.title);
            }
        }
        
        const questions: Question[] = [];
        
        // Generálunk 50 feladatot a tantárgy és témakör alapján
        for (let i = 0; i < 50; i++) {
            const question = generateUniversityQuestionByTopic(subjectId, topicId);
            if (question) {
                questions.push({
                    ...question,
                    id: `university_${subjectId}_${topicId}_${i}`
                });
            }
        }

        // Keverjük össze a feladatokat, hogy mindig más legyen a sorrend
        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        setTaskQuestions(shuffledQuestions);
        
        // Azonnal elindítjuk a játékot
        if (questions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    };

    const generateHighschoolQuestionsByTopic = (topicId: string, grade: number) => {
        // Témakör nevének beállítása
        const topic = highschoolTopics.find(t => t.id === topicId);
        if (topic) {
            setSelectedHighschoolTopic(topic.title);
        }
        
        const questions: Question[] = [];
        
        // Generálunk 50 feladatot nehézségi szintek szerint
        const difficultyLevels = 5;
        const questionsPerLevel = 10;
        
        for (let difficulty = 0; difficulty < difficultyLevels; difficulty++) {
            for (let i = 0; i < questionsPerLevel; i++) {
                const question = generateHighschoolQuestionByTopic(topicId, grade, difficulty);
                if (question) {
                    questions.push({
                        ...question,
                        id: `highschool_${topicId}_${grade}_${difficulty}_${i}`
                    });
                }
            }
        }

        // Nem keverjük össze, hogy a nehézségi sorrend megmaradjon
        setTaskQuestions(questions);
        
        // Azonnal elindítjuk a játékot
        if (questions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    };

    const getWorksheetListForTopic = (topicId: string): { list: Question[]; prefix: string } | null => {
        const topicLower = topicId.toLowerCase();
        if (!isWorksheetTopicId(topicId)) return null;
        if (topicLower.includes('parameter') || topicLower.includes('paramet')) {
            return { list: getParameterPracticeQuestions(), prefix: 'erettsegi_parameter' };
        }
        if (topicLower.includes('abszolutertek') || topicLower.includes('gyok')) {
            return { list: getAbsoluteRootPracticeQuestions(), prefix: 'erettsegi_absroot' };
        }
        if (topicLower.includes('bizonyitas')
            || topicLower.includes('egyenletek') || topicLower.includes('egyenlotlenseg')) {
            return {
                list: getProofPracticeQuestions(),
                prefix: topicLower.includes('bizonyitas') ? 'erettsegi_proof' : 'erettsegi_egyenletek',
            };
        }
        if (topicLower.includes('fuggveny') || topicLower.includes('analizis')) {
            return { list: getFunctionsPracticeQuestions(), prefix: 'erettsegi_fuggvenyek' };
        }
        if (topicLower.includes('exponencialis') || topicLower.includes('logaritmus')) {
            return { list: getExponentialLogPracticeQuestions(), prefix: 'erettsegi_explog' };
        }
        return null;
    };

    const beginPathOrWorksheetRun = (
        questions: Question[],
        opts: {
            topicId: string;
            lessonNode: number | null;
            sprint?: boolean;
            erettsegi?: boolean;
            daily?: boolean;
        }
    ) => {
        const pathMode = opts.lessonNode != null;
        setIsPathMode(pathMode);
        setPathLesson(opts.lessonNode);
        pathLessonRef.current = opts.lessonNode;
        setIsWorksheetMode(true);
        setIsErettsegiMode(!!opts.erettsegi);
        setIsDailyMode(!!opts.daily);
        setIsSprintMode(!!opts.sprint);
        setSprintLeft(SPRINT_SECONDS);
        sprintEndedRef.current = false;
        setMascotMood('idle');
        worksheetTopicKeyRef.current = resolveProgressStorageKey(opts.topicId);
        setCurrentTopic(opts.topicId);
        setCorrectQuestionIds([]);
        setWrongFirstIds([]);
        setStagesCleared([]);
        setSessionXp(0);
        setCorrectStreak(0);
        setMaxStreak(0);
        setFailedQuestions([]);
        correctQuestionIdsRef.current = [];
        wrongFirstIdsRef.current = [];
        erettsegiQuestionsRef.current = questions;
        setErettsegiQuestions(questions);
        setTaskQuestions(questions);

        if (questions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            const startLives = opts.sprint ? 2 : 3;
            livesRef.current = startLives;
            setLives(startLives);
            setCurrentQuestion(0);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    };

    /** Path lecke általános / közép / egyetem témákhoz */
    const startPathLessonForEducationLevel = (
        eduLevel: 'elementary' | 'highschool' | 'university',
        topicId: string,
        grade: number,
        sprint = false
    ) => {
        const nodeRaw = router.query.node;
        const nodeParsed = nodeRaw != null ? parseInt(String(nodeRaw), 10) : NaN;
        const lessonNode = Number.isFinite(nodeParsed) && nodeParsed >= 1 && nodeParsed <= 6
            ? nodeParsed
            : 1;

        let stagedSource: (Question & { stage: PracticeStage })[] = [];
        const worksheet = getWorksheetListForTopic(topicId);
        if (worksheet) {
            stagedSource = assignStagesToQuestions(
                worksheet.list.map((q, i) => ({
                    ...q,
                    id: `${worksheet.prefix}_${i + 1}`,
                    level: eduLevel === 'university' ? 'university' : 'highschool',
                }))
            );
        } else {
            // Gazdagabb bank: 10 kérdés / szakasz
            for (let band = 0; band < 3; band++) {
                const stage = (band + 1) as PracticeStage;
                const difficulty = band * 2;
                for (let i = 0; i < 10; i++) {
                    let question: Question | null = null;
                    if (eduLevel === 'elementary') {
                        question = generateElementaryQuestionByTopic(topicId, grade, difficulty);
                    } else if (eduLevel === 'highschool') {
                        question = generateHighschoolQuestionByTopic(topicId, grade, difficulty);
                    } else {
                        question = generateUniversityQuestionByTopic(topicId, topicId);
                    }
                    if (question) {
                        stagedSource.push({
                            ...question,
                            id: `${eduLevel}_${topicId}_s${stage}_${i}_${Math.random().toString(36).slice(2, 7)}`,
                            level: eduLevel === 'university' ? 'university' : eduLevel === 'elementary' ? 'elementary' : 'highschool',
                            stage,
                        });
                    }
                }
            }
        }

        const bank = buildPathQuestionBank(stagedSource);
        const questions = getLessonQuestions(bank, lessonNode);
        if (eduLevel === 'elementary') {
            setSelectedGrade(grade);
            setSelectedElementaryTopic(topicId);
        } else if (eduLevel === 'highschool') {
            setSelectedHighschoolGrade(grade);
            setSelectedHighschoolTopic(topicId);
        } else {
            setSelectedUniversitySubject(topicId);
            setSelectedUniversityTopic(topicId);
        }
        setEducationLevel(eduLevel);
        beginPathOrWorksheetRun(questions, {
            topicId,
            lessonNode,
            sprint,
            erettsegi: false,
        });
    };

    /** Napi vegyes: több témából 12 kérdés */
    const generateDailyMixedQuestions = (
        eduLevel: EducationLevelId,
        grade: number
    ) => {
        const examLevel = eduLevel === 'erettsegi'
            ? ((router.query.level as string) === 'kozep' ? 'kozep' : 'emelt')
            : 'emelt';
        const topics = getTopicsForEducationLevel(
            eduLevel === 'erettsegi' ? 'erettsegi' : eduLevel,
            examLevel as 'kozep' | 'emelt'
        );
        const picked = [...topics].sort(() => Math.random() - 0.5).slice(0, 6);
        const questions: Question[] = [];
        let guard = 0;
        while (questions.length < 12 && guard < 80) {
            guard++;
            const t = picked[questions.length % Math.max(1, picked.length)];
            if (!t) break;
            let q: Question | null = null;
            if (eduLevel === 'elementary') {
                q = generateElementaryQuestionByTopic(t.id, grade || 5, Math.floor(Math.random() * 4));
            } else if (eduLevel === 'highschool') {
                q = generateHighschoolQuestionByTopic(t.id, grade || 10, Math.floor(Math.random() * 4));
            } else if (eduLevel === 'university') {
                q = generateUniversityQuestionByTopic(t.id, t.id);
            } else {
                q = generateErettsegiQuestionByTopicId(t.id, examLevel);
            }
            if (q) {
                questions.push({
                    ...q,
                    id: `daily_${t.id}_${questions.length}`,
                    stage: lessonToStage(Math.floor(questions.length / 4) + 1) as PracticeStage,
                });
            }
        }
        setEducationLevel(eduLevel === 'erettsegi' ? null : eduLevel === 'elementary' || eduLevel === 'highschool' || eduLevel === 'university' ? eduLevel : null);
        beginPathOrWorksheetRun(questions, {
            topicId: `daily_${eduLevel}`,
            lessonNode: null,
            sprint: router.query.sprint === '1',
            erettsegi: eduLevel === 'erettsegi',
            daily: true,
        });
    };

    const generateErettsegiQuestionsByTopic = (topicId: string, level: string, sprint = false) => {
        const nodeRaw = router.query.node;
        const nodeParsed = nodeRaw != null ? parseInt(String(nodeRaw), 10) : NaN;
        const pathRequested = router.query.path === '1' || (Number.isFinite(nodeParsed) && nodeParsed >= 1);
        const lessonNode = Number.isFinite(nodeParsed) && nodeParsed >= 1 && nodeParsed <= 6
            ? nodeParsed
            : pathRequested
                ? 1
                : null;

        const qLevel = level === 'kozep' ? 'highschool' : 'university';
        let stagedSource: (Question & { stage: PracticeStage })[] = [];

        const worksheet = getWorksheetListForTopic(topicId);
        if (worksheet) {
            stagedSource = assignStagesToQuestions(
                worksheet.list.map((q, i) => ({
                    ...q,
                    id: `${worksheet.prefix}_${i + 1}`,
                    level: qLevel,
                }))
            );
        } else {
            // Gazdagabb bank: 10 könnyű + 10 közepes + 10 nehéz
            for (let band = 0; band < 3; band++) {
                const stage = (band + 1) as PracticeStage;
                for (let i = 0; i < 10; i++) {
                    const question = generateErettsegiQuestionByTopicId(topicId, level);
                    if (question) {
                        stagedSource.push({
                            ...question,
                            id: `erettsegi_${topicId}_s${stage}_${i}_${Math.random().toString(36).slice(2, 7)}`,
                            level: qLevel,
                            stage,
                        });
                    }
                }
            }
            if (stagedSource.length === 0) {
                for (let i = 0; i < 18; i++) {
                    const question = generateErettsegiQuestionByTopicId(topicId, level);
                    if (question) {
                        stagedSource.push({
                            ...question,
                            id: `erettsegi_${topicId}_${i}`,
                            level: qLevel,
                            stage: lessonToStage(Math.floor(i / 3) + 1) as PracticeStage,
                        });
                    }
                }
            }
        }

        const bank = buildPathQuestionBank(stagedSource);
        const questions = lessonNode != null
            ? getLessonQuestions(bank, lessonNode)
            : bank;

        beginPathOrWorksheetRun(questions, {
            topicId,
            lessonNode,
            sprint: sprint || router.query.sprint === '1',
            erettsegi: true,
        });
    };

    const generateMixedErettsegiQuestions = (level: string) => {
        setIsErettsegiMode(true);
        
        const questions: Question[] = [];
        
        // Összes érettségi témakör
        const allTopics = [
            'abszolutertek-gyok',
            'egyenletek-egyenlotlensegek',
            'egyszerusitesek',
            'ertelmezesi-tartomany',
            'exponencialis-logaritmus',
            'fuggvenyek-analizis',
            'halmazok',
            'kombinatorika',
            'koordinatageometria',
            'logika',
            'sikgeometria',
            'sorozatok',
            'statisztika',
            'szamelmelet',
            'szoveges',
            'tergeometria',
            'trigonometria',
            'valoszinuseg'
        ];
        
        // A szint normalizálása (közép -> kozep, emelt -> emelt)
        const normalizedLevel = level.toLowerCase().includes('emelt') ? 'emelt' : 'kozep';
        
        // 50 feladat generálása - csak a kiválasztott szintű feladatokkal, de vegyes témakörökből
        const questionsPerTopic = Math.floor(50 / allTopics.length);
        const remainingQuestions = 50 % allTopics.length;
        
        for (let i = 0; i < allTopics.length; i++) {
            const topic = allTopics[i];
            const questionsForThisTopic = questionsPerTopic + (i < remainingQuestions ? 1 : 0);
            
            for (let j = 0; j < questionsForThisTopic; j++) {
                const difficulty = Math.floor(j / 2) % 5; // 0-4 nehézségi szint
                
                // Csak a kiválasztott szintű feladatokat generáljuk
                const question = generateErettsegiQuestionByTopicId(topic, normalizedLevel);
                if (question) {
                    questions.push({
                        ...question,
                        id: `mixed_erettsegi_${topic}_${normalizedLevel}_${j}`,
                        level: normalizedLevel === 'kozep' ? 'highschool' : 'university'
                    });
                }
            }
        }
        
        // Keverjük össze a feladatokat, hogy vegyesen legyenek a témakörök
        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        setErettsegiQuestions(shuffledQuestions);
        
        // Ha van elég feladat, azonnal elindítjuk a játékot
        if (questions.length > 0) {
            setGameActive(true);
            setScore(0);
            setLevel(1);
            setLives(3);
            setCurrentQuestion(0);
            setUserAnswer('');
            setUserAnswer2('');
            setUserAnswer3('');
            setUserAnswer4('');
            setMessage('');
            setIsCorrect(false);
            setShowExpression(false);
        }
    };

    const generateQuadraticQuestion = (): Question => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) - 5;
        const c = Math.floor(Math.random() * 10) - 5;

        const discriminant = b * b - 4 * a * c;
        let answer = 0;
        let question = '';

        if (discriminant >= 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            answer = Math.round(x1 * 10) / 10;
            question = `${a}x² + ${b}x + ${c} = 0 egyenlet egyik gyöke?`;
        } else {
            answer = 0;
            question = `${a}x² + ${b}x + ${c} = 0 egyenlet diszkriminánsa pozitív? (1 = igen, 0 = nem)`;
        }

        return {
            question,
            answer,
            type: 'multiplication' as const,
            expression: `${a}x² + ${b}x + ${c} = 0`
        };
    };

    const generateDerivativeQuestion = (): Question => {
        const coefficient = Math.floor(Math.random() * 5) + 1;
        const power = Math.floor(Math.random() * 4) + 2;

        const answer = coefficient * power;
        const question = `${coefficient}x^${power} deriváltja?`;

        return {
            question,
            answer,
            type: 'multiplication' as const,
            expression: `d/dx(${coefficient}x^${power})`
        };
    };

    const generateTrigonometryQuestion = (): Question => {
        const angles = [0, 30, 45, 60, 90];
        const angle = angles[Math.floor(Math.random() * angles.length)];

        let answer = 0;
        let question = '';

        if (angle === 0) answer = 0;
        else if (angle === 30) answer = 0.5;
        else if (angle === 45) answer = Math.sqrt(2) / 2;
        else if (angle === 60) answer = Math.sqrt(3) / 2;
        else if (angle === 90) answer = 1;

        question = `sin(${angle}°) értéke?`;

        return {
            question,
            answer: Math.round(answer * 100) / 100,
            type: 'multiplication' as const,
            expression: `sin(${angle}°)`
        };
    };

    const generateIntegralQuestion = (): Question => {
        const coefficient = Math.floor(Math.random() * 5) + 1;
        const power = Math.floor(Math.random() * 3) + 1;

        const answer = coefficient / (power + 1);
        const question = `∫${coefficient}x^${power} dx eredménye?`;

        return {
            question,
            answer,
            type: 'multiplication' as const,
            expression: `∫${coefficient}x^${power} dx`
        };
    };

    const generateGeometryQuestion = (): Question => {
        const side = Math.floor(Math.random() * 10) + 1;
        const answer = side * side;
        const question = `${side} cm oldalú négyzet területe?`;

        return {
            question,
            answer,
            type: 'multiplication' as const,
            expression: `${side} cm × ${side} cm`
        };
    };

    const generateAlgebraQuestion = (): Question => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = a + b;
        const question = `${a} + ${b} = ?`;

        return {
            question,
            answer,
            type: 'addition' as const,
            expression: `${a} + ${b}`
        };
    };

    const loadAssignedTasks = async () => {
        try {
            if (!(window as any).firebase) {
                return;
            }

            const db = (window as any).firebase.firestore();
            const snapshot = await db.collection('assignedTasks')
                .where('userId', '==', currentUser?.uid || '')
                .where('topicId', '==', currentTopic)
                .get();

            const tasks: any[] = [];
            snapshot.forEach((doc: any) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });

            setAssignedTasks(tasks);
        } catch (error) {
            console.error('Error loading assigned tasks:', error);
        }
    };

    interface Question {
        question: string;
        answer: number;
        alternativeAnswer?: number; // Második válasz lehetőség (pl. abszolútértékes egyenleteknél)
        thirdAnswer?: number; // Harmadik válasz lehetőség
        fourthAnswer?: number; // Negyedik válasz lehetőség
        type: 'addition' | 'subtraction' | 'multiplication' | 'division';
        expression: string;
        longDivision?: string;
        id?: string; // Opcionális ID a feladatok azonosításához
        level?: string; // Opcionális szint információ
        stage?: PracticeStage; // Munkalap nehézségi szakasz
        subQuestions?: Array<{ // Részfeladatok külön válaszmezőkkel
            question: string;
            rubric: string;
            answer: number;
        }>;
    }

    // Általános iskolai témakörök
    const elementaryTopics = ELEMENTARY_TOPICS_FROM_CATALOG;

    // Középiskolai témakörök
    const highschoolTopics = HIGHSCHOOL_TOPICS_FROM_CATALOG;

    // Egyetemi tantárgyak és témakörök
    const universitySubjects = UNIVERSITY_SUBJECTS_FROM_CATALOG;

    // Általános iskola feladatok (központi felvételi szint)
    const elementaryQuestions: Question[] = [
        // Alapvető műveletek
        { question: 'Mennyi 15 + 27?', answer: 42, type: 'addition', expression: '15 + 27 = 42' },
        { question: 'Mennyi 50 - 23?', answer: 27, type: 'subtraction', expression: '50 - 23 = 27' },
        { question: 'Mennyi 6 × 8?', answer: 48, type: 'multiplication', expression: '6 × 8 = 48' },
        { question: 'Mennyi 72 ÷ 9?', answer: 8, type: 'division', expression: '72 ÷ 9 = 8' },
        { question: 'Mennyi 3²?', answer: 9, type: 'multiplication', expression: '3² = 3 × 3 = 9' },
        { question: 'Mennyi √16?', answer: 4, type: 'multiplication', expression: '√16 = 4, mert 4² = 16' },
        
        // Geometria feladatok
        { question: 'Egy téglalap oldalai 8 cm és 12 cm. Mekkora a kerülete?', answer: 40, type: 'multiplication', expression: 'K = 2(a+b) = 2(8+12) = 2×20 = 40 cm' },
        { question: 'Számítsd ki a 15² értékét!', answer: 225, type: 'multiplication', expression: '15² = 15×15 = 225' },
        { question: 'Egy kör sugara 7 cm. Mekkora a területe? (π ≈ 3.14)', answer: 153.86, type: 'multiplication', expression: 'T = πr² = 3.14×7² = 3.14×49 = 153.86 cm²' },
        { question: 'Mekkora a 3/4 + 2/3 összege? (Add meg tizedes törtben)', answer: 1.417, type: 'addition', expression: '3/4 + 2/3 = 9/12 + 8/12 = 17/12 ≈ 1.417' },
        { question: 'Egy kocka éle 5 cm. Mekkora a térfogata?', answer: 125, type: 'multiplication', expression: 'V = a³ = 5³ = 125 cm³' },
        // Hatványozás és gyökvonás feladatok
        { question: 'Számítsd ki: √(3^(-3)) / 27²', answer: 0.00137, type: 'multiplication', expression: '√(3^(-3)) / 27² = √(1/27) / 729 = (1/3√3) / 729 ≈ 0.00137' },
        { question: 'Számítsd ki: ³√128 / ⁵√16', answer: 2, type: 'division', expression: '³√128 / ⁵√16 = ³√(2^7) / ⁵√(2^4) = 2^(7/3) / 2^(4/5) = 2^(35/15 - 12/15) = 2^(23/15) ≈ 2' },
        { question: 'Számítsd ki: 9 / ³√81', answer: 3, type: 'division', expression: '9 / ³√81 = 9 / ³√(3^4) = 9 / 3^(4/3) = 3^2 / 3^(4/3) = 3^(2-4/3) = 3^(2/3) ≈ 3' },
        { question: 'Számítsd ki: (2²)⁵ × (1/2) × 8^(-2)', answer: 0.5, type: 'multiplication', expression: '(2²)⁵ × (1/2) × 8^(-2) = 2^10 × 2^(-1) × 2^(-6) = 2^(10-1-6) = 2³ = 8' },
        { question: 'Számítsd ki: ⁵√3 / ³√9', answer: 0.577, type: 'division', expression: '⁵√3 / ³√9 = 3^(1/5) / 9^(1/3) = 3^(1/5) / 3^(2/3) = 3^(1/5 - 2/3) = 3^(-7/15) ≈ 0.577' },
        { question: 'Számítsd ki: 4 / ⁵√8', answer: 2, type: 'division', expression: '4 / ⁵√8 = 4 / 8^(1/5) = 2² / 2^(3/5) = 2^(2-3/5) = 2^(7/5) ≈ 2' },
        { question: 'Számítsd ki: √3 × 27 × ³√9²', answer: 81, type: 'multiplication', expression: '√3 × 27 × ³√9² = 3^(1/2) × 3³ × (3²)^(2/3) = 3^(1/2) × 3³ × 3^(4/3) = 3^(1/2 + 3 + 4/3) = 3^(3/6 + 18/6 + 8/6) = 3^(29/6) ≈ 81' },
        { question: 'Számítsd ki: ³√16 / ⁵√4', answer: 2, type: 'division', expression: '³√16 / ⁵√4 = 16^(1/3) / 4^(1/5) = (2^4)^(1/3) / (2²)^(1/5) = 2^(4/3) / 2^(2/5) = 2^(4/3 - 2/5) = 2^(20/15 - 6/15) = 2^(14/15) ≈ 2' },
        { question: 'Számítsd ki: √128 / ³√16', answer: 4, type: 'division', expression: '√128 / ³√16 = √(2^7) / ³√(2^4) = 2^(7/2) / 2^(4/3) = 2^(7/2 - 4/3) = 2^(21/6 - 8/6) = 2^(13/6) ≈ 4' },
        { question: 'Számítsd ki: 1 / √(27 × 9^(1/3))', answer: 0.192, type: 'division', expression: '1 / √(27 × 9^(1/3)) = 1 / √(3³ × 3^(2/3)) = 1 / √(3^(3 + 2/3)) = 1 / √(3^(11/3)) = 1 / 3^(11/6) ≈ 0.192' },
        { question: 'Számítsd ki a √(169) értékét!', answer: 13, type: 'multiplication', expression: '√(169) = 13, mert 13² = 169' },
        { question: 'Egy háromszög alapja 10 cm, magassága 6 cm. Mekkora a területe?', answer: 30, type: 'multiplication', expression: 'T = (a×m)/2 = (10×6)/2 = 60/2 = 30 cm²' },
        { question: 'Mekkora a 2⁵ értéke?', answer: 32, type: 'multiplication', expression: '2⁵ = 2×2×2×2×2 = 32' },
        { question: 'Egy paralelogramma alapja 8 cm, magassága 5 cm. Mekkora a területe?', answer: 40, type: 'multiplication', expression: 'T = a×m = 8×5 = 40 cm²' },
        { question: 'Számítsd ki a 0.25 × 8 értékét!', answer: 2, type: 'multiplication', expression: '0.25 × 8 = 2' },
        { question: 'Egy trapéz párhuzamos oldalai 6 cm és 10 cm, magassága 4 cm. Mekkora a területe?', answer: 32, type: 'multiplication', expression: 'T = (a+c)×m/2 = (6+10)×4/2 = 16×2 = 32 cm²' },
        { question: 'Mekkora a 5/6 - 1/3 különbsége? (Add meg tizedes törtben)', answer: 0.5, type: 'subtraction', expression: '5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2 = 0.5' },
        { question: 'Egy derékszögű háromszög befogói 3 cm és 4 cm. Mekkora az átfogója?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5 cm' },
        { question: 'Számítsd ki a 12% -át a 200-nak!', answer: 24, type: 'multiplication', expression: '200 × 0.12 = 24' },
        { question: 'Egy rombusz oldala 6 cm, magassága 4 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = a×m = 6×4 = 24 cm²' },
        { question: 'Mekkora a 3/5 × 10 értéke?', answer: 6, type: 'multiplication', expression: '3/5 × 10 = 30/5 = 6' },
        { question: 'Egy henger sugara 4 cm, magassága 7 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 351.68, type: 'multiplication', expression: 'V = πr²h = 3.14×4²×7 = 3.14×16×7 = 351.68 cm³' },
        { question: 'Számítsd ki a √(256) értékét!', answer: 16, type: 'multiplication', expression: '√(256) = 16, mert 16² = 256' },
        { question: 'Egy deltoid átlói 6 cm és 8 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = (d₁×d₂)/2 = (6×8)/2 = 48/2 = 24 cm²' },
        { question: 'Mekkora a 0.6 + 0.4 összege?', answer: 1, type: 'addition', expression: '0.6 + 0.4 = 1.0' },
        { question: 'Egy szabályos hatszög oldala 5 cm. Mekkora a kerülete?', answer: 30, type: 'multiplication', expression: 'K = 6a = 6×5 = 30 cm' },
        { question: 'Számítsd ki a 4³ értékét!', answer: 64, type: 'multiplication', expression: '4³ = 4×4×4 = 64' },
        { question: 'Egy kúp sugara 3 cm, magassága 6 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 56.52, type: 'multiplication', expression: 'V = πr²h/3 = 3.14×3²×6/3 = 3.14×9×2 = 56.52 cm³' },
        { question: 'Mekkora a 7/8 - 3/4 különbsége? (Add meg tizedes törtben)', answer: 0.125, type: 'subtraction', expression: '7/8 - 3/4 = 7/8 - 6/8 = 1/8 = 0.125' },
        { question: 'Egy téglalap területe 48 cm², egyik oldala 8 cm. Mekkora a másik oldala?', answer: 6, type: 'division', expression: 'T = a×b, 48 = 8×b, b = 48÷8 = 6 cm' },
        { question: 'Számítsd ki a 15% -át a 80-nak!', answer: 12, type: 'multiplication', expression: '80 × 0.15 = 12' },
        { question: 'Egy gömb sugara 6 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 904.32, type: 'multiplication', expression: 'V = 4πr³/3 = 4×3.14×6³/3 = 4×3.14×216/3 = 904.32 cm³' },
        { question: 'Mekkora a 2/3 × 9 értéke?', answer: 6, type: 'multiplication', expression: '2/3 × 9 = 18/3 = 6' },
        { question: 'Egy paralelogramma kerülete 24 cm, egyik oldala 7 cm. Mekkora a másik oldala?', answer: 5, type: 'subtraction', expression: 'K = 2(a+b), 24 = 2(7+b), 12 = 7+b, b = 5 cm' },
        { question: 'Számítsd ki a √(400) értékét!', answer: 20, type: 'multiplication', expression: '√(400) = 20, mert 20² = 400' }
    ];

    // Középiskola feladatok (érettségi szint)
    const highschoolQuestions: Question[] = [
        // Másodfokú egyenletek
        { question: 'Számítsd ki a 2x² - 5x + 3 = 0 másodfokú egyenlet gyökeit! (Add meg a nagyobb gyököt)', answer: 1.5, type: 'multiplication', expression: 'x = (5 ± √(25-24))/4 = (5 ± 1)/4, x₁ = 1, x₂ = 1.5' },
        { question: 'Oldd meg az x² - 4x + 3 = 0 egyenletet! (Add meg a kisebb gyököt)', answer: 1, type: 'multiplication', expression: 'x² - 4x + 3 = (x-1)(x-3) = 0, x₁ = 1, x₂ = 3' },
        { question: 'Számítsd ki a 3x² + 2x - 1 = 0 egyenlet diszkriminánsát!', answer: 16, type: 'multiplication', expression: 'D = b² - 4ac = 2² - 4×3×(-1) = 4 + 12 = 16' },
        
        // Trigonometria
        { question: 'Számítsd ki a sin(30°) értékét!', answer: 0.5, type: 'multiplication', expression: 'sin(30°) = 1/2 = 0.5' },
        { question: 'Számítsd ki a cos(60°) értékét!', answer: 0.5, type: 'multiplication', expression: 'cos(60°) = 1/2 = 0.5' },
        { question: 'Számítsd ki a tan(45°) értékét!', answer: 1, type: 'multiplication', expression: 'tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1' },
        
        // Logaritmus
        { question: 'Számítsd ki a log₂(8) értékét!', answer: 3, type: 'multiplication', expression: 'log₂(8) = log₂(2³) = 3·log₂(2) = 3·1 = 3' },
        { question: 'Számítsd ki a log₃(27) értékét!', answer: 3, type: 'multiplication', expression: 'log₃(27) = log₃(3³) = 3·log₃(3) = 3·1 = 3' },
        { question: 'Számítsd ki a log₁₀(1000) értékét!', answer: 3, type: 'multiplication', expression: 'log₁₀(1000) = log₁₀(10³) = 3·log₁₀(10) = 3·1 = 3' },
        
        // Geometria
        { question: 'Egy derékszögű háromszög befogói 3 és 4. Mekkora az átfogó?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5' },
        { question: 'Egy derékszögű háromszög befogói 3 és 4. Mekkora az átfogó?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5' },
        { question: 'Számítsd ki a log₂(8) értékét!', answer: 3, type: 'multiplication', expression: 'log₂(8) = log₂(2³) = 3·log₂(2) = 3·1 = 3' },
        { question: 'Egy kör sugara 5 cm. Mekkora a kerülete? (π ≈ 3.14)', answer: 31.4, type: 'multiplication', expression: 'K = 2πr = 2·3.14·5 = 31.4 cm' },
        { question: 'Számítsd ki a sin(30°) értékét!', answer: 0.5, type: 'multiplication', expression: 'sin(30°) = 1/2 = 0.5' },
        // Hatványozás és gyökvonás feladatok (középiskola szint)
        { question: 'Számítsd ki: (√3)^(-3) × 27^(2/3)', answer: 3, type: 'multiplication', expression: '(√3)^(-3) × 27^(2/3) = 3^(-3/2) × (3³)^(2/3) = 3^(-3/2) × 3² = 3^(-3/2 + 2) = 3^(1/2) = √3 ≈ 1.73' },
        { question: 'Számítsd ki: log₃(√(27))', answer: 1.5, type: 'multiplication', expression: 'log₃(√(27)) = log₃(√(3³)) = log₃(3^(3/2)) = (3/2)·log₃(3) = 3/2 = 1.5' },
        { question: 'Számítsd ki: 2^(log₂(8)) + 3^(log₃(9))', answer: 17, type: 'addition', expression: '2^(log₂(8)) + 3^(log₃(9)) = 8 + 9 = 17' },
        { question: 'Számítsd ki: √(2 + √3) × √(2 - √3)', answer: 1, type: 'multiplication', expression: '√(2 + √3) × √(2 - √3) = √((2 + √3)(2 - √3)) = √(4 - 3) = √1 = 1' },
        { question: 'Számítsd ki: (1/2)^(-2) + (1/3)^(-1)', answer: 7, type: 'addition', expression: '(1/2)^(-2) + (1/3)^(-1) = 2² + 3 = 4 + 3 = 7' },
        { question: 'Egy számtani sorozat első tagja 2, differenciája 3. Mennyi a 10. tag?', answer: 29, type: 'multiplication', expression: 'a₁₀ = a₁ + (10-1)·d = 2 + 9·3 = 2 + 27 = 29' },
        { question: 'Számítsd ki a 2⁴ + 3² értékét!', answer: 25, type: 'multiplication', expression: '2⁴ + 3² = 16 + 9 = 25' },
        { question: 'Egy téglalap oldalai 6 cm és 8 cm. Mekkora az átlója?', answer: 10, type: 'multiplication', expression: 'd² = a² + b² = 6² + 8² = 36 + 64 = 100, d = 10 cm' },
        { question: 'Számítsd ki a cos(60°) értékét!', answer: 0.5, type: 'multiplication', expression: 'cos(60°) = 1/2 = 0.5' },
        { question: 'Egy mértani sorozat első tagja 3, hányadosa 2. Mennyi a 5. tag?', answer: 48, type: 'multiplication', expression: 'a₅ = a₁·q⁴ = 3·2⁴ = 3·16 = 48' },
        { question: 'Számítsd ki a √(144) + √(25) értékét!', answer: 17, type: 'multiplication', expression: '√(144) + √(25) = 12 + 5 = 17' },
        { question: 'Egy kocka éle 4 cm. Mekkora a térfogata?', answer: 64, type: 'multiplication', expression: 'V = a³ = 4³ = 64 cm³' },
        { question: 'Számítsd ki a tan(45°) értékét!', answer: 1, type: 'multiplication', expression: 'tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1' },
        { question: 'Egy paralelogramma oldalai 5 cm és 7 cm, a köztük lévő szög 60°. Mekkora a területe?', answer: 30.3, type: 'multiplication', expression: 'T = a·b·sin(α) = 5·7·sin(60°) = 35·√3/2 ≈ 30.3 cm²' },
        { question: 'Számítsd ki a log₃(27) értékét!', answer: 3, type: 'multiplication', expression: 'log₃(27) = log₃(3³) = 3·log₃(3) = 3·1 = 3' },
        { question: 'Egy henger sugara 3 cm, magassága 8 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 226.08, type: 'multiplication', expression: 'V = πr²h = 3.14·3²·8 = 3.14·9·8 = 226.08 cm³' },
        { question: 'Számítsd ki a sin(90°) értékét!', answer: 1, type: 'multiplication', expression: 'sin(90°) = 1' },
        { question: 'Egy trapéz párhuzamos oldalai 6 cm és 10 cm, magassága 4 cm. Mekkora a területe?', answer: 32, type: 'multiplication', expression: 'T = (a+c)·m/2 = (6+10)·4/2 = 16·2 = 32 cm²' },
        { question: 'Számítsd ki a 5³ - 2⁴ értékét!', answer: 109, type: 'multiplication', expression: '5³ - 2⁴ = 125 - 16 = 109' },
        { question: 'Egy gúla alapterülete 36 cm², magassága 8 cm. Mekkora a térfogata?', answer: 96, type: 'multiplication', expression: 'V = T·m/3 = 36·8/3 = 288/3 = 96 cm³' },
        { question: 'Számítsd ki a cos(0°) értékét!', answer: 1, type: 'multiplication', expression: 'cos(0°) = 1' },
        { question: 'Egy rombusz oldala 5 cm, egyik átlója 6 cm. Mekkora a másik átlója?', answer: 8, type: 'multiplication', expression: 'd₁² + d₂² = 4a², 6² + d₂² = 4·5², 36 + d₂² = 100, d₂² = 64, d₂ = 8 cm' },
        { question: 'Számítsd ki a log₁₀(1000) értékét!', answer: 3, type: 'multiplication', expression: 'log₁₀(1000) = log₁₀(10³) = 3·log₁₀(10) = 3·1 = 3' },
        { question: 'Egy kúp sugara 4 cm, magassága 9 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 150.72, type: 'multiplication', expression: 'V = πr²h/3 = 3.14·4²·9/3 = 3.14·16·3 = 150.72 cm³' },
        { question: 'Számítsd ki a sin(60°) értékét!', answer: 0.866, type: 'multiplication', expression: 'sin(60°) = √3/2 ≈ 0.866' },
        { question: 'Egy deltoid átlói 8 cm és 6 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = (d₁·d₂)/2 = (8·6)/2 = 48/2 = 24 cm²' },
        { question: 'Számítsd ki a 7² - 3³ értékét!', answer: 22, type: 'multiplication', expression: '7² - 3³ = 49 - 27 = 22' },
        { question: 'Egy gömb sugara 5 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 523.33, type: 'multiplication', expression: 'V = 4πr³/3 = 4·3.14·5³/3 = 4·3.14·125/3 ≈ 523.33 cm³' },
        { question: 'Számítsd ki a cos(30°) értékét!', answer: 0.866, type: 'multiplication', expression: 'cos(30°) = √3/2 ≈ 0.866' },
        { question: 'Egy szabályos hatszög oldala 4 cm. Mekkora a kerülete?', answer: 24, type: 'multiplication', expression: 'K = 6a = 6·4 = 24 cm' }
    ];

    // Egyetemi matematika témák
    const universityTopics = [
        'deriválás',
        'integrálás',
        'differenciál egyenletek',
        'határértékszámítás',
        'függvényvizsgálat',
        'sorozatok és sorok',
        'többváltozós függvények',
        'lineáris algebra',
        'valószínűségszámítás',
        'komplex számok'
    ];

    // Fallback egyetemi feladatok (ha az API nem elérhető)
    const fallbackUniversityQuestions: Question[] = [
        // Deriválás
        { question: 'Számítsd ki az f(x) = x² + 3x + 2 függvény deriváltját az x = 2 pontban!', answer: 7, type: 'multiplication', expression: 'f\'(x) = 2x + 3, f\'(2) = 2·2 + 3 = 7' },
        { question: 'Számítsd ki az f(x) = 3x² + 2x függvény deriváltját az x = 1 pontban!', answer: 8, type: 'multiplication', expression: 'f\'(x) = 6x + 2, f\'(1) = 6·1 + 2 = 8' },
        { question: 'Számítsd ki az f(x) = x³ - 2x függvény deriváltját az x = 2 pontban!', answer: 10, type: 'multiplication', expression: 'f\'(x) = 3x² - 2, f\'(2) = 3·4 - 2 = 10' },
        { question: 'Számítsd ki az f(x) = e^x függvény deriváltját az x = 0 pontban!', answer: 1, type: 'multiplication', expression: 'f\'(x) = e^x, f\'(0) = e^0 = 1' },
        
        // Integrálás
        { question: 'Számítsd ki a ∫(2x + 1)dx integrált 0-tól 2-ig!', answer: 6, type: 'multiplication', expression: '∫(2x + 1)dx = x² + x, [x² + x]₀² = (4 + 2) - (0 + 0) = 6' },
        { question: 'Számítsd ki a ∫(x² + 2x)dx integrált 0-tól 1-ig!', answer: 1.33, type: 'multiplication', expression: '∫(x² + 2x)dx = x³/3 + x², [x³/3 + x²]₀¹ = 1/3 + 1 = 4/3 ≈ 1.33' },
        { question: 'Számítsd ki a ∫(3x²)dx integrált 0-tól 2-ig!', answer: 8, type: 'multiplication', expression: '∫(3x²)dx = x³, [x³]₀² = 8 - 0 = 8' },
        
        // Határértékek
        { question: 'Számítsd ki a lim(x→0) (sin x)/x határértéket!', answer: 1, type: 'multiplication', expression: 'L\'Hôpital szabály alapján: lim(x→0) (sin x)/x = lim(x→0) cos x/1 = 1' },
        { question: 'Számítsd ki a lim(x→1) (x²-1)/(x-1) határértéket!', answer: 2, type: 'multiplication', expression: 'lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1)(x-1)/(x-1) = lim(x→1) (x+1) = 2' },
        { question: 'Számítsd ki a lim(x→0) (1-cos x)/x² határértéket!', answer: 0.5, type: 'multiplication', expression: 'L\'Hôpital szabály: lim(x→0) (1-cos x)/x² = lim(x→0) sin x/(2x) = 1/2' },
        { question: 'Számítsd ki a ∫(2x + 1)dx integrált 0-tól 2-ig!', answer: 6, type: 'multiplication', expression: '∫(2x + 1)dx = x² + x, [x² + x]₀² = (4 + 2) - (0 + 0) = 6' },
        { question: 'Számítsd ki a lim(x→0) (sin x)/x határértéket!', answer: 1, type: 'multiplication', expression: 'L\'Hôpital szabály alapján: lim(x→0) (sin x)/x = lim(x→0) cos x/1 = 1' },
        { question: 'Oldd meg a dy/dx = 2x differenciál egyenletet y(0) = 1 kezdeti feltétellel!', answer: 1, type: 'multiplication', expression: 'y = x² + C, y(0) = 1 = 0 + C, tehát C = 1, y = x² + 1' },
        { question: 'Melyik pontban van az f(x) = x³ - 3x² + 2 függvénynek lokális minimuma?', answer: 2, type: 'multiplication', expression: 'f\'(x) = 3x² - 6x = 3x(x-2), f\'\'(x) = 6x - 6, f\'\'(2) = 6 > 0, tehát x = 2-ben minimum' },
        { question: 'Számítsd ki a ∑(n=1 to ∞) 1/n² sor összegét!', answer: 1.645, type: 'multiplication', expression: 'Ez a Riemann zeta függvény ζ(2) = π²/6 ≈ 1.645' },
        { question: 'Számítsd ki az f(x,y) = x² + y² függvény parciális deriváltját ∂f/∂x az (1,2) pontban!', answer: 2, type: 'multiplication', expression: '∂f/∂x = 2x, ∂f/∂x(1,2) = 2·1 = 2' },
        { question: 'Számítsd ki a [[2,1],[3,4]] 2x2-es mátrix determinánsát!', answer: 5, type: 'multiplication', expression: 'det = 2·4 - 1·3 = 8 - 3 = 5' },
        { question: 'Egy kockával dobva, mi a valószínűsége annak, hogy 3-nál nagyobb számot dobunk?', answer: 0.5, type: 'multiplication', expression: 'Kedvező esetek: 4,5,6 (3 db), összes eset: 6, P = 3/6 = 0.5' },
        { question: 'Számítsd ki a (2+3i) + (1-2i) komplex szám összegét!', answer: 3, type: 'multiplication', expression: '(2+3i) + (1-2i) = (2+1) + (3-2)i = 3 + i, valós rész: 3' },
        // C Programozás feladatok
        { question: 'Mi lesz az "int x = 5; printf(\"%d\", ++x);" kimenete?', answer: 6, type: 'multiplication', expression: '++x először növeli x-et 6-ra, majd kiírja: 6' },
        { question: 'Mi lesz az "int arr[5] = {1,2,3,4,5}; printf(\"%d\", arr[2]);" kimenete?', answer: 3, type: 'multiplication', expression: 'arr[2] a tömb harmadik eleme (0-indexelés): 3' },
        { question: 'Mi lesz az "int x = 10; int *p = &x; printf(\"%d\", *p);" kimenete?', answer: 10, type: 'multiplication', expression: 'p mutat x-re, *p az x értékét adja vissza: 10' },
        { question: 'Mi lesz az "int x = 5; int y = x++; printf(\"%d %d\", x, y);" kimenete?', answer: 6, type: 'multiplication', expression: 'x++ először értéket ad y-nak (5), majd növeli x-et (6): "6 5"' },
        { question: 'Mi lesz az "int x = 10; if(x > 5) x = x * 2; printf(\"%d\", x);" kimenete?', answer: 20, type: 'multiplication', expression: 'x > 5 igaz, ezért x = 10 * 2 = 20' },
        { question: 'Mi lesz az "int i, sum = 0; for(i=1; i<=3; i++) sum += i; printf(\"%d\", sum);" kimenete?', answer: 6, type: 'multiplication', expression: 'sum = 1 + 2 + 3 = 6' },
        { question: 'Mi lesz az "char str[] = \"Hello\"; printf(\"%c\", str[0]);" kimenete?', answer: 72, type: 'multiplication', expression: 'str[0] az \'H\' karakter, ASCII kódja: 72' },
        { question: 'Mi lesz az "int x = 15; int y = x / 4; printf(\"%d\", y);" kimenete?', answer: 3, type: 'multiplication', expression: '15 / 4 = 3 (egész osztás)' },
        { question: 'Mi lesz az "int x = 7; int y = x % 3; printf(\"%d\", y);" kimenete?', answer: 1, type: 'multiplication', expression: '7 % 3 = 1 (maradékos osztás)' },
        // Folytonos valószínűségi változók feladatok
        { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,2] intervallumon. Mi a várható értéke?', answer: 1, type: 'multiplication', expression: 'E[X] = (a+b)/2 = (0+2)/2 = 1' },
        { question: 'Egy exponenciális eloszlású valószínűségi változó λ=2 paraméterrel. Mi a várható értéke?', answer: 0.5, type: 'multiplication', expression: 'E[X] = 1/λ = 1/2 = 0.5' },
        { question: 'Egy normális eloszlású valószínűségi változó μ=5, σ=2 paraméterekkel. Mi a várható értéke?', answer: 5, type: 'multiplication', expression: 'E[X] = μ = 5' },
        { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,4] intervallumon. Mi a szórása?', answer: 1.15, type: 'multiplication', expression: 'D[X] = (b-a)/(2√3) = (4-0)/(2√3) = 4/(2√3) ≈ 1.15' },
        { question: 'Egy exponenciális eloszlású valószínűségi változó λ=3 paraméterrel. Mi a szórása?', answer: 0.33, type: 'multiplication', expression: 'D[X] = 1/λ = 1/3 ≈ 0.33' },
        { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x > y ? x : y);" kimenete?', answer: 5, type: 'multiplication', expression: 'x > y igaz (5 > 3), ezért az első értéket adja: 5' },
        { question: 'Számítsd ki az f(x) = e^x függvény deriváltját az x = 0 pontban!', answer: 1, type: 'multiplication', expression: 'f\'(x) = e^x, f\'(0) = e^0 = 1' },
        { question: 'Számítsd ki a ∫(x² + 2x)dx integrált 0-tól 1-ig!', answer: 1.33, type: 'multiplication', expression: '∫(x² + 2x)dx = x³/3 + x², [x³/3 + x²]₀¹ = 1/3 + 1 = 4/3 ≈ 1.33' },
        { question: 'Számítsd ki a lim(x→1) (x²-1)/(x-1) határértéket!', answer: 2, type: 'multiplication', expression: 'lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1)(x-1)/(x-1) = lim(x→1) (x+1) = 2' },
        { question: 'Oldd meg a dy/dx = y differenciál egyenletet y(0) = 1 kezdeti feltétellel!', answer: 1, type: 'multiplication', expression: 'y = Ce^x, y(0) = 1 = C·1, tehát C = 1, y = e^x, y(0) = 1' },
        { question: 'Melyik pontban van az f(x) = x⁴ - 4x² függvénynek lokális maximuma?', answer: 0, type: 'multiplication', expression: 'f\'(x) = 4x³ - 8x = 4x(x²-2), f\'\'(x) = 12x² - 8, f\'\'(0) = -8 < 0, tehát x = 0-ban maximum' },
        { question: 'Számítsd ki a ∑(n=1 to ∞) 1/2ⁿ sor összegét!', answer: 1, type: 'multiplication', expression: 'Geometriai sor: a/(1-r) = (1/2)/(1-1/2) = (1/2)/(1/2) = 1' },
        { question: 'Számítsd ki az f(x,y) = xy függvény parciális deriváltját ∂f/∂y az (2,3) pontban!', answer: 2, type: 'multiplication', expression: '∂f/∂y = x, ∂f/∂y(2,3) = 2' },
        { question: 'Számítsd ki a [[1,2],[0,3]] 2x2-es mátrix determinánsát!', answer: 3, type: 'multiplication', expression: 'det = 1·3 - 2·0 = 3 - 0 = 3' },
        { question: 'Egy érmével dobva, mi a valószínűsége annak, hogy fejet dobunk?', answer: 0.5, type: 'multiplication', expression: 'Kedvező esetek: fej (1 db), összes eset: 2, P = 1/2 = 0.5' },
        { question: 'Számítsd ki a (3+4i) · (1+2i) komplex szám szorzatát!', answer: -5, type: 'multiplication', expression: '(3+4i)(1+2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i, valós rész: -5' }
    ];

    // ChatGPT API hívás egyetemi feladatok generálásához
    const generateUniversityQuestion = async (topic: string, difficulty: 'könnyű' | 'közepes' | 'nehéz' = 'közepes'): Promise<Question | null> => {
        try {
            setIsGeneratingQuestion(true);
            let authHeader: Record<string, string> = { 'Content-Type': 'application/json' };
            try {
                const token = await (window as any).firebase?.auth()?.currentUser?.getIdToken?.();
                if (token) authHeader = { ...authHeader, Authorization: `Bearer ${token}` };
            } catch {
                /* ignore */
            }
            const response = await fetch('/api/generate-math-question', {
                method: 'POST',
                headers: authHeader,
                body: JSON.stringify({
                    topic: topic,
                    difficulty: difficulty
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return {
                    question: data.question,
                    answer: parseFloat(data.answer) || parseInt(data.answer) || 0,
                    type: 'multiplication', // Default type for university questions
                    expression: data.explanation || data.question
                };
            } else {
                console.error('API error:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error generating university question:', error);
            return null;
        } finally {
            setIsGeneratingQuestion(false);
        }
    };

    // Egyetemi feladatok generálása játék indításakor
    const generateUniversityQuestions = async () => {
        // Egyelőre használjuk a fallback feladatokat, mert az API még nincs beállítva
        const shuffledQuestions = [...fallbackUniversityQuestions].sort(() => Math.random() - 0.5);
        setUniversityQuestions(shuffledQuestions);

        // TODO: Később visszaállítani az API hívást
        /*
        const questions: Question[] = [];
        const topicsToUse = [...universityTopics].sort(() => Math.random() - 0.5).slice(0, 10);
        
        for (const topic of topicsToUse) {
            const question = await generateUniversityQuestion(topic);
            if (question) {
                questions.push(question);
            }
        }

        // Ha nem sikerült elég feladatot generálni, töltsük fel a fallback feladatokkal
        if (questions.length < 5) {
            questions.push(...fallbackUniversityQuestions.slice(0, 10 - questions.length));
        }

        setUniversityQuestions(questions);
        */
    };

    const getQuestionsForLevel = (level: 'elementary' | 'highschool' | 'university'): Question[] => {
        switch (level) {
            case 'elementary':
                return elementaryQuestions;
            case 'highschool':
                return highschoolQuestions;
            case 'university':
                return fallbackUniversityQuestions; // Mindig használjuk a fallback feladatokat
            default:
                return elementaryQuestions;
        }
    };

    // Feladatok betöltése a kiválasztott szint alapján (keverve) + hibás feladatok
    const questions: Question[] = useMemo(() => {
        let baseQuestions: Question[] = [];
        if (erettsegiQuestions.length > 0) {
            baseQuestions = erettsegiQuestions;
        } else if (taskQuestions.length > 0) {
            baseQuestions = taskQuestions;
        } else {
            const levelQuestions = getQuestionsForLevel(educationLevel || 'elementary');
            // Keverjük össze a feladatokat, hogy mindig más legyen a sorrend
            baseQuestions = [...levelQuestions].sort(() => Math.random() - 0.5);
        }
        // Hozzáadjuk a hibás feladatokat a végére
        return [...baseQuestions, ...failedQuestions];
    }, [erettsegiQuestions, taskQuestions, educationLevel, failedQuestions]);

    const startGame = async () => {
        if (!educationLevel) return;

        // Ellenőrizzük, hogy vannak-e feladatok
        if (questions.length === 0) {
            alert('Nincsenek elérhető feladatok ezen a szinten. Kérjük, válasszon másik szintet!');
            return;
        }

        // Ha egyetemi szint van kiválasztva, generáljuk a feladatokat
        if (educationLevel === 'university') {
            generateUniversityQuestions(); // Nem await, mert azonnal elérhető
        }

        // Ha van kiosztott feladat a témakörhöz, akkor azt használjuk
        if (assignedTasks.length > 0) {
            // Itt lehetne implementálni a kiosztott feladatok kezelését
            console.log('Kiosztott feladatok használata:', assignedTasks);
        }

        setGameActive(true);
        setScore(0);
        setLevel(1);
        setLives(3);
        setCurrentQuestion(0);
        setUserAnswer('');
        setMessage('');
        setIsCorrect(false);
        setShowExpression(false);
        setAvatarLevel(1);
        setAvatarProgress(0);
    };

    const resetGame = () => {
        setGameActive(false);
        setScore(0);
        setLevel(1);
        setLives(3);
        setCurrentQuestion(0);
        setUserAnswer('');
        setUserAnswer2('');
        setUserAnswer3('');
        setUserAnswer4('');
        setMessage('');
        setIsCorrect(false);
        setShowExpression(false);
        setAvatarLevel(1);
        setAvatarProgress(0);
        setEducationLevel(null);
        setShowErettsegiMenu(false);
        setSelectedErettsegiMode(null);
        setFailedQuestions([]);
    };

    const checkSubQuestionAnswers = () => {
        const currentQ = questions[currentQuestion];
        if (!currentQ.subQuestions) {
            console.log('Nincs részfeladat');
            return;
        }
        
        console.log('Ellenőrzés kezdődik, válaszok:', subQuestionAnswers);
        console.log('Részfeladatok száma:', currentQ.subQuestions.length);
        
        let allCorrect = true;
        let checkedCount = 0;
        let correctCount = 0;
        
        // Ellenőrizzük azokat a részfeladatokat, ahol van számérték
        currentQ.subQuestions.forEach((subQ, index) => {
            const userAnswer = subQuestionAnswers[index]?.trim() || '';
            console.log(`Részfeladat ${index + 1}: várt=${subQ.answer}, kapott="${userAnswer}"`);
            
            if (subQ.answer !== 0 && subQ.answer !== undefined) {
                // Számérték ellenőrzés
                const userAns = parseFloat(userAnswer);
                if (isNaN(userAns) || Math.abs(userAns - subQ.answer) >= 0.01) {
                    console.log(`Hibás válasz részfeladat ${index + 1}: várt ${subQ.answer}, kapott ${userAns}`);
                    allCorrect = false;
                } else {
                    checkedCount++;
                    correctCount++;
                }
            } else {
                // Szöveges válasz - csak azt ellenőrizzük, hogy van-e válasz
                // A helyességet nem ellenőrizzük automatikusan, csak a megoldásban látható
                if (!userAnswer) {
                    console.log(`Hiányzó válasz részfeladat ${index + 1}`);
                    allCorrect = false;
                } else {
                    checkedCount++;
                    // Szöveges válaszoknál nem tudjuk automatikusan ellenőrizni a helyességet
                    // Ezért nem számítjuk helyesnek, csak hogy van válasz
                }
            }
        });
        
        console.log(`Ellenőrzés vége: allCorrect=${allCorrect}, checkedCount=${checkedCount}, correctCount=${correctCount}`);
        
        // Mindig mutassuk meg a megoldást, de ne ugorjunk tovább automatikusan
        // Csak akkor ugorjunk tovább, ha minden válasz helyes ÉS minden mező ki van töltve
        if (allCorrect && checkedCount === currentQ.subQuestions.length && correctCount > 0) {
            // Csak akkor, ha van számérték ellenőrzés és minden helyes
            setIsCorrect(true);
            setMessage('✅ Minden válasz helyes!');
            setScore(score + 10);
        } else {
            // Van helytelen vagy hiányzó válasz, vagy csak szöveges válaszok vannak
            setIsCorrect(false);
            if (checkedCount < currentQ.subQuestions.length) {
                setMessage(`❌ Van hiányzó válasz! (${checkedCount}/${currentQ.subQuestions.length} kitöltve)`);
            } else {
                setMessage(`Megoldások megjelenítve. Nézd meg a helyes válaszokat!`);
            }
        }
        
        // Ne ugorjunk tovább automatikusan - a felhasználó kattintson a "Következő" gombra
    };

    const submitAnswer = () => {
        const currentQ = questions[currentQuestion];
        
        // Ha van részfeladat, ne használjuk a normál submitAnswer-t
        if (currentQ.subQuestions) {
            checkSubQuestionAnswers();
            return;
        }
        
        // Ellenőrizzük, hogy hány mezőt kell kitölteni
        const hasAlternative = currentQ.alternativeAnswer !== undefined;
        const hasThird = currentQ.thirdAnswer !== undefined;
        const hasFourth = currentQ.fourthAnswer !== undefined;
        
        if (hasFourth) {
            // Négy mezőt kell kitölteni
            if (!userAnswer.trim() || !userAnswer2.trim() || !userAnswer3.trim() || !userAnswer4.trim()) {
                setMessage('Kérjük, töltsd ki mind a négy mezőt!');
                return;
            }
        } else if (hasThird) {
            // Három mezőt kell kitölteni
            if (!userAnswer.trim() || !userAnswer2.trim() || !userAnswer3.trim()) {
                setMessage('Kérjük, töltsd ki mind a három mezőt!');
                return;
            }
        } else if (hasAlternative) {
            // Két mezőt kell kitölteni
            if (!userAnswer.trim() || !userAnswer2.trim()) {
                setMessage('Kérjük, töltsd ki mindkét mezőt!');
                return;
            }
        } else {
            // Csak egy mezőt kell kitölteni
        if (!userAnswer.trim()) return;
        }

        let correct = false;
        
        if (hasFourth) {
            // Négy mezőből olvassuk a válaszokat
            const nums = [
                parseFloat(userAnswer),
                parseFloat(userAnswer2),
                parseFloat(userAnswer3),
                parseFloat(userAnswer4)
            ];
            
            if (nums.some(n => isNaN(n))) {
                setMessage('Kérjük, adj meg érvényes számokat mind a négy mezőben!');
                return;
            }
            
            // Ellenőrizzük, hogy mind a négy válasz helyes-e (bármilyen sorrendben)
            const answers = [currentQ.answer, currentQ.alternativeAnswer!, currentQ.thirdAnswer!, currentQ.fourthAnswer!];
            const userAnswers = [...nums];
            
            // Rendezzük mindkét tömböt és hasonlítsuk össze
            const sortedAnswers = answers.sort((a, b) => a - b);
            const sortedUserAnswers = userAnswers.sort((a, b) => a - b);
            
            correct = sortedAnswers.every((ans, idx) => Math.abs(ans - sortedUserAnswers[idx]) < 0.01);
        } else if (hasThird) {
            // Három mezőből olvassuk a válaszokat
            const nums = [
                parseFloat(userAnswer),
                parseFloat(userAnswer2),
                parseFloat(userAnswer3)
            ];
            
            if (nums.some(n => isNaN(n))) {
                setMessage('Kérjük, adj meg érvényes számokat mind a három mezőben!');
                return;
            }
            
            const answers = [currentQ.answer, currentQ.alternativeAnswer!, currentQ.thirdAnswer!];
            const userAnswers = [...nums];
            
            const sortedAnswers = answers.sort((a, b) => a - b);
            const sortedUserAnswers = userAnswers.sort((a, b) => a - b);
            
            correct = sortedAnswers.every((ans, idx) => Math.abs(ans - sortedUserAnswers[idx]) < 0.01);
        } else if (hasAlternative) {
            // Két külön mezőből olvassuk a válaszokat
            const num1 = parseFloat(userAnswer);
            const num2 = parseFloat(userAnswer2);
            
            if (isNaN(num1) || isNaN(num2)) {
                setMessage('Kérjük, adj meg érvényes számokat mindkét mezőben!');
                return;
            }
            
            // Ellenőrizzük, hogy mindkét válasz helyes-e (bármilyen sorrendben)
            const hasAnswer1 = (Math.abs(num1 - currentQ.answer) < 0.001 && Math.abs(num2 - currentQ.alternativeAnswer!) < 0.001);
            const hasAnswer2 = (Math.abs(num1 - currentQ.alternativeAnswer!) < 0.001 && Math.abs(num2 - currentQ.answer) < 0.001);
            correct = hasAnswer1 || hasAnswer2;
        } else {
            // Nincs alternatív válasz, csak az első mezőt ellenőrizzük
            const userNum = parseFloat(userAnswer);
            if (!isNaN(userNum)) {
                correct = Math.abs(userNum - currentQ.answer) < 0.01;
            }
        }

        setIsCorrect(correct);
        setShowExpression(true);

        if (correct) {
            playCorrectSound();
            setMascotMood('happy');
            const newScore = score + 10;
            setScore(newScore);
            
            // Szint emelkedés minden 5 helyes válasz után (50 pont = 5 helyes válasz)
            const newLevel = Math.floor(newScore / 50) + 1;
            if (newLevel > level) {
                setLevel(newLevel);
                setMessage(`Helyes! 🎉\n\n🎊 Szint emelkedett! Új szint: ${newLevel}`);
            } else {
            setMessage('Helyes! 🎉');
            }

            // Avatar progress
            setAvatarProgress(avatarProgress + 1);
            if (avatarProgress >= 4) {
                setAvatarLevel(avatarLevel + 1);
                setAvatarProgress(0);
            }

            // Munkalap / path XP / streak / szakasz
            if (isWorksheetMode) {
                const qid = currentQ.id || `idx_${currentQuestion}`;
                const alreadyCorrect = correctQuestionIds.includes(qid);
                const newStreak = correctStreak + 1;
                setCorrectStreak(newStreak);
                setMaxStreak((m) => Math.max(m, newStreak));
                let msgExtra = '';
                if (!alreadyCorrect) {
                    const nextCorrect = [...correctQuestionIds, qid];
                    correctQuestionIdsRef.current = nextCorrect;
                    setCorrectQuestionIds(nextCorrect);
                    setSessionXp((x) => x + 10);
                    setTotalXp((x) => x + 10);

                    const bonus = streakBonusXp(newStreak);
                    if (bonus > 0) {
                        playStreakSound();
                        setSessionXp((x) => x + bonus);
                        setTotalXp((x) => x + bonus);
                        msgExtra += `\n\n🔥 Streak ${newStreak}! (+${bonus} XP)`;
                    }

                    if (!isPathMode) {
                        const stage = currentQ.stage;
                        if (stage) {
                            const baseQs = erettsegiQuestions.length > 0 ? erettsegiQuestions : questions;
                            const stageBase = baseQs.filter((q) => q.stage === stage);
                            const allStageDone = stageBase.every((q) => nextCorrect.includes(q.id || ''));
                            if (allStageDone && !stagesCleared.includes(stage)) {
                                setStagesCleared((s) => [...s, stage]);
                                setSessionXp((x) => x + 50);
                                setTotalXp((x) => x + 50);
                                msgExtra += `\n\n🔓 Szakasz kész: ${STAGE_LABELS[stage]} (+50 XP)`;
                            }
                        }
                    } else {
                        const baseQs = erettsegiQuestions.length > 0 ? erettsegiQuestions : questions;
                        const lessonDone = baseQs.every((q) => nextCorrect.includes(q.id || ''));
                        if (lessonDone && pathLessonRef.current) {
                            setSessionXp((x) => x + PATH_LESSON_XP);
                            setTotalXp((x) => x + PATH_LESSON_XP);
                            msgExtra += `\n\n🎉 Lecke ${pathLessonRef.current} kész! (+${PATH_LESSON_XP} XP)`;
                        }
                    }
                }
                if (msgExtra) {
                    setMessage((prev) => `${prev}${msgExtra}`);
                }
                if (newStreak >= 5) {
                    setBadgeToast((prev) => prev || '🔥 Badge: 5 hibátlan');
                    setTimeout(() => setBadgeToast(null), 4000);
                }
            }
        } else {
            playWrongSound();
            setMascotMood('sad');
            setCorrectStreak(0);
            // Hibás válasz: hozzáadjuk a hibás feladatok listájához (ha még nincs benne)
            const baseQuestionsCount = questions.length - failedQuestions.length;
            const isFailedQuestion = currentQuestion >= baseQuestionsCount;
            let lostLife = false;
            
            if (!isFailedQuestion) {
                // Csak akkor adjuk hozzá, ha még nem hibás feladat
                const questionIndex = failedQuestions.findIndex(q => 
                    (q.id && currentQ.id && q.id === currentQ.id) || 
                    q.question === currentQ.question
                );
                if (questionIndex === -1) {
                    setFailedQuestions([...failedQuestions, { ...currentQ }]);
                }
                const qid = currentQ.id || `idx_${currentQuestion}`;
                if (!wrongFirstIdsRef.current.includes(qid) && !wrongFirstIds.includes(qid)) {
                    const nextWrong = [...wrongFirstIdsRef.current, qid];
                    wrongFirstIdsRef.current = nextWrong;
                    setWrongFirstIds(nextWrong);
                    if (isPathMode || isSprintMode || isDailyMode) {
                        lostLife = true;
                        playLifeLostSound();
                        const nextLives = Math.max(0, livesRef.current - 1);
                        livesRef.current = nextLives;
                        setLives(nextLives);
                    }
                }
            }

            const lifeNote = lostLife
                ? `\n\n💔 Élet: ${livesRef.current}/3`
                : '';
            
            if (currentQ.fourthAnswer !== undefined) {
                setMessage(`Hibás! A helyes válaszok: ${currentQ.answer}, ${currentQ.alternativeAnswer}, ${currentQ.thirdAnswer}, ${currentQ.fourthAnswer}\n\nEz a feladat később újra megjelenik.${lifeNote}`);
            } else if (currentQ.thirdAnswer !== undefined) {
                setMessage(`Hibás! A helyes válaszok: ${currentQ.answer}, ${currentQ.alternativeAnswer}, ${currentQ.thirdAnswer}\n\nEz a feladat később újra megjelenik.${lifeNote}`);
            } else if (currentQ.alternativeAnswer !== undefined) {
                setMessage(`Hibás! A helyes válaszok: ${currentQ.answer}, ${currentQ.alternativeAnswer}\n\nEz a feladat később újra megjelenik.${lifeNote}`);
            } else {
                setMessage(`Hibás! A helyes válasz: ${currentQ.answer}\n\nEz a feladat később újra megjelenik.${lifeNote}`);
            }
        }

        setTimeout(() => {
            if (correct) {
                // Helyes válasz: eltávolítjuk a hibás feladatok listájából, ha benne volt
                const updatedFailed = failedQuestions.filter(q => 
                    !((q.id && currentQ.id && q.id === currentQ.id) || q.question === currentQ.question)
                );
                if (updatedFailed.length !== failedQuestions.length) {
                    setFailedQuestions(updatedFailed);
                }
                
                // Továbblépünk
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setUserAnswer('');
                    setUserAnswer2('');
                    setUserAnswer3('');
                    setUserAnswer4('');
                    setMessage('');
                    setIsCorrect(false);
                    setShowExpression(false);
                    setMascotMood('idle');
                } else {
                    // Ha nincs több feladat, de vannak még hibás feladatok
                    const remainingFailed = updatedFailed.length !== failedQuestions.length ? updatedFailed : failedQuestions;
                    if (remainingFailed.length > 0 && !(isPathMode || isSprintMode)) {
                        // Vissza a hibás feladatokhoz - a questions tömb végén vannak
                        const baseCount = questions.length - failedQuestions.length;
                        setCurrentQuestion(baseCount); // Vissza a hibás feladatokhoz
                        setUserAnswer('');
                        setUserAnswer2('');
                        setUserAnswer3('');
                        setUserAnswer4('');
                        setMessage('Most a hibás feladatokat oldd meg újra!');
                    setIsCorrect(false);
                    setShowExpression(false);
                    setMascotMood('idle');
                } else {
                    // Game won
                    if (score > highScore) {
                        setHighScore(score);
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('highScore', score.toString());
                        }
                    }
                    setMessage('Gratulálok! Megnyerted a játékot! 🏆');
                    setMascotMood('happy');
                    saveGameResults();
                    }
                }
            } else {
                // Hibás válasz: ha elfogyott az élet (path/sprint), mentés és vége
                if ((isPathMode || isSprintMode || isDailyMode) && livesRef.current <= 0) {
                    setMessage('Elfogyott az életed! 💔 Próbáld újra a leckét.');
                    setMascotMood('sad');
                    setGameActive(false);
                    saveGameResults();
                    return;
                }
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setUserAnswer('');
                    setUserAnswer2('');
                    setUserAnswer3('');
                    setUserAnswer4('');
                    setMessage('');
                    setIsCorrect(false);
                    setShowExpression(false);
                    setMascotMood('idle');
                } else {
                    if (failedQuestions.length > 0 && !(isPathMode || isSprintMode)) {
                        const baseCount = questions.length - failedQuestions.length;
                        setCurrentQuestion(baseCount);
                        setUserAnswer('');
                        setUserAnswer2('');
                        setUserAnswer3('');
                        setUserAnswer4('');
                        setMessage('Most a hibás feladatokat oldd meg újra!');
                        setIsCorrect(false);
                        setShowExpression(false);
                    } else {
                        if (score > highScore) {
                            setHighScore(score);
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('highScore', score.toString());
                            }
                        }
                        setMessage('Gratulálok! Megnyerted a játékot! 🏆');
                        saveGameResults();
                    }
                }
            }
        }, 2000);
    };


    const saveGameResults = async () => {
            try {
                const baseList = isWorksheetMode && erettsegiQuestionsRef.current.length > 0
                    ? erettsegiQuestionsRef.current
                    : (isWorksheetMode && erettsegiQuestions.length > 0 ? erettsegiQuestions : questions);
                const totalQuestions = baseList.length;
                const correctIds = correctQuestionIdsRef.current.length
                    ? correctQuestionIdsRef.current
                    : correctQuestionIds;
                const wrongIds = wrongFirstIdsRef.current.length
                    ? wrongFirstIdsRef.current
                    : wrongFirstIds;
                const correctAnswerCount = isWorksheetMode
                    ? correctIds.length
                    : Math.round(score / 10);

            // Készítünk egy eredmény objektumot
            const topicFromQuery = (router.query.topic as string) || currentTopic || '';
            const uid = currentUser?.uid
                || (window as any).firebase?.auth?.()?.currentUser?.uid
                || null;

            // Path / munkalap progress — localStorage + Firestore (ha van user)
            if (isWorksheetMode) {
                const topicKey = worksheetTopicKeyRef.current
                    || resolveProgressStorageKey(topicFromQuery);
                const lessonJustCompleted =
                    isPathMode && pathLessonRef.current
                    && baseList.every((q) => correctIds.includes(q.id || ''))
                        ? pathLessonRef.current
                        : undefined;
                const perfectRun = wrongIds.length === 0 && correctAnswerCount >= totalQuestions;
                const answerXpOnly = correctIds.length * 10;
                const allStages: PracticeStage[] = [1, 2, 3];
                const cleared = [...stagesCleared];
                for (const st of allStages) {
                    const stageQs = baseList.filter((q) => q.stage === st);
                    if (stageQs.length > 0 && stageQs.every((q) => correctIds.includes(q.id || ''))) {
                        if (!cleared.includes(st)) cleared.push(st);
                    }
                }
                const result = await applyAndSaveProgress(uid, {
                    topicKey,
                    topicId: topicFromQuery,
                    correctCount: correctAnswerCount,
                    totalQuestions,
                    stagesClearedThisRun: isPathMode ? [] : cleared,
                    perfectRun,
                    maxStreak,
                    sessionXpFromAnswers: answerXpOnly,
                    lessonJustCompleted,
                    lessonWrongCount: lessonJustCompleted ? wrongIds.length : undefined,
                });
                setTotalXp(result.next.xp);
                setAvatarLevel(result.next.rankLevel);
                if (result.newBadges.length > 0) {
                    const titles = result.newBadges
                        .map((id) => getBadgeDef(id as BadgeId)?.title || id)
                        .join(', ');
                    setBadgeToast(`🏅 Új badge: ${titles}`);
                    setTimeout(() => setBadgeToast(null), 5000);
                } else if (lessonJustCompleted) {
                    setBadgeToast(`🎉 Lecke ${lessonJustCompleted} kész — következhet a következő!`);
                    setTimeout(() => setBadgeToast(null), 4000);
                }
                if (isPathMode) {
                    setTimeout(() => {
                        const edu = (router.query.educationLevel as EducationLevelId)
                            || (router.query.erettsegi === 'true' ? 'erettsegi' : null);
                        const examLvl = ((router.query.level as string) === 'kozep' ? 'kozep' : 'emelt') as 'kozep' | 'emelt';
                        if (edu) {
                            router.push(buildTopicPracticeHref(topicFromQuery, edu, examLvl));
                        } else if (router.query.erettsegi === 'true') {
                            router.push(
                                `/erettsegi-felkeszules?mode=topics&level=${examLvl}&topic=${encodeURIComponent(topicFromQuery)}`
                            );
                        }
                    }, 2200);
                }
            }

            if (!currentUser || !(window as any).firebase?.firestore) return;

                const db = (window as any).firebase.firestore();
            const resultData: any = {
                    userId: currentUser.uid,
                    correct: correctAnswerCount,
                    total: totalQuestions,
                    score: score,
                    xpEarned: sessionXp,
                    completedAt: (window as any).firebase.firestore.FieldValue.serverTimestamp(),
            };

            // Ha van selectedTask, akkor azt használjuk
            if (selectedTask) {
                resultData.topicId = selectedTask.id;
                resultData.topicTitle = selectedTask.title;
                resultData.gameMode = 'uniboost';
            } else {
                // Egyébként az educationLevel és egyéb információk alapján
                resultData.educationLevel = educationLevel;
                
                // Érettségi mód
                if (isErettsegiMode) {
                    resultData.gameMode = 'erettsegi';
                    resultData.topic = topicFromQuery || currentTopic;
                    resultData.topicId = topicFromQuery || currentTopic;
                    if (router.query.level) {
                        resultData.level = router.query.level;
                    }
                    if (isWorksheetMode) {
                        resultData.worksheet = true;
                        resultData.stagesCleared = stagesCleared;
                        resultData.perfect = wrongFirstIds.length === 0 && correctAnswerCount >= totalQuestions;
                    }
                }
                // Általános iskola
                else if (educationLevel === 'elementary' && selectedGrade && selectedElementaryTopic) {
                    resultData.grade = selectedGrade;
                    resultData.topic = selectedElementaryTopic;
                    resultData.topicId = selectedElementaryTopic;
                }
                // Középiskola
                else if (educationLevel === 'highschool' && selectedHighschoolGrade && selectedHighschoolTopic) {
                    resultData.grade = selectedHighschoolGrade;
                    resultData.topic = selectedHighschoolTopic;
                    resultData.topicId = selectedHighschoolTopic;
                }
                // Egyetem
                else if (educationLevel === 'university' && selectedUniversitySubject && selectedUniversityTopic) {
                    resultData.subject = selectedUniversitySubject;
                    resultData.topic = selectedUniversityTopic;
                    resultData.topicId = selectedUniversityTopic;
                }
                // Alapértelmezett
                else {
                    resultData.gameMode = educationLevel || 'unknown';
                }
            }

            await db.collection('gameResults').add(resultData);
            } catch (error) {
                console.error('Error saving game results:', error);
        }
    };

    const getAvatarImage = (level: number) => getRankEmoji(level);

    const getAvatarTitle = (level: number) => getRankTitle(level);

    const getAvatarColor = (level: number) => {
        if (level >= 20) return 'linear-gradient(45deg, #FFD700, #FFA500)'; // Gold
        if (level >= 15) return 'linear-gradient(45deg, #C0C0C0, #808080)'; // Silver
        if (level >= 10) return 'linear-gradient(45deg, #CD7F32, #8B4513)'; // Bronze
        if (level >= 5) return 'linear-gradient(45deg, #4169E1, #1E90FF)'; // Blue
        return 'linear-gradient(45deg, #87CEEB, #4682B4)'; // Light blue
    };

    if (!isClient || loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Mihaszna Matek - Játék</title>
                <meta name="description" content="Matematikai kihívás" />
            </Head>

            <div className="game-container">
                <main className="game-main">
                    {!gameActive ? (
                        <div className="start-screen">
                            <h1 className="game-title">
                                {isErettsegiMode
                                    ? '📚 Érettségi Felkészülés'
                                    : educationLevel === 'elementary'
                                        ? '🏫 Általános Iskolai Kvíz'
                                        : educationLevel === 'highschool'
                                            ? '🎒 Gimnáziumi Kvíz'
                                            : educationLevel === 'university'
                                                ? '🚀 UniBoost'
                                                : '🧮 Matek Kvíz'}
                            </h1>
                            <p className="game-subtitle">
                                {isErettsegiMode 
                                    ? (currentTopic ? `Témakör: ${currentTopic}` : 'Témakörönkénti gyakorlás')
                                    : (selectedTask
                                        ? selectedTask.title
                                        : currentTopic
                                            ? `Témakör: ${currentTopic}`
                                            : 'Válassz szintet, majd indítsd a kvízt a tanítványaiddal')}
                            </p>
                            {questions.length === 0 && (
                                <div className="no-questions-warning">
                                    <p>⚠️ Nincsenek elérhető feladatok ezen a szinten!</p>
                                    <p>Kérjük, válasszon másik oktatási szintet.</p>
                                </div>
                            )}

                            {!educationLevel && !showErettsegiMenu ? (
                                <div className="level-selector">
                                    <h2 className="level-title">Válassz oktatási szintet:</h2>
                                    <div className="level-buttons">
                                        <button
                                            className="level-btn elementary"
                                            onClick={() => setEducationLevel('elementary')}
                                        >
                                            <span className="level-icon">🎒</span>
                                            <span className="level-name">Általános iskola</span>
                                            <span className="level-desc">1-8. osztály</span>
                                        </button>
                                        <button
                                            className="level-btn highschool"
                                            onClick={() => setEducationLevel('highschool')}
                                        >
                                            <span className="level-icon">📚</span>
                                            <span className="level-name">Középiskola</span>
                                            <span className="level-desc">9-12. osztály</span>
                                        </button>
                                        <button
                                            className="level-btn university"
                                            onClick={() => setEducationLevel('university')}
                                        >
                                            <span className="level-icon">🎓</span>
                                            <span className="level-name">Egyetem</span>
                                            <span className="level-desc">Felsőbb matematika</span>
                                        </button>
                                        <button
                                            className="level-btn erettsegi"
                                            onClick={() => setShowErettsegiMenu(true)}
                                        >
                                            <span className="level-icon">📚</span>
                                            <span className="level-name">Érettségi Felkészülés</span>
                                            <span className="level-desc">Témakörök és feladatsorok</span>
                                        </button>
                                        <button
                                            className="level-btn kozponti"
                                            onClick={() => {
                                                // Közvetlenül generálunk vegyes feladatokat az összes témakörből
                                                generateKozpontiQuestionsByTopic('vegyes');
                                            }}
                                        >
                                            <span className="level-icon">🎯</span>
                                            <span className="level-name">Központi Felvételi</span>
                                            <span className="level-desc">Gimnáziumi felvételi felkészülés</span>
                                        </button>
                                    </div>
                                </div>
                            ) : showErettsegiMenu ? (
                                <div className="erettsegi-menu-section">
                                    <button
                                        className="back-to-levels-btn"
                                        onClick={() => {
                                            setShowErettsegiMenu(false);
                                            setEducationLevel(null);
                                            setSelectedErettsegiMode(null);
                                        }}
                                        style={{ marginBottom: '2rem' }}
                                    >
                                        ← Vissza a szintekhez
                                    </button>
                                    <h2 className="level-title">Válassz érettségi felkészülés módot:</h2>
                                    <div className="level-buttons">
                                        <button
                                            className="level-btn erettsegi-option"
                                            onClick={() => {
                                                setSelectedErettsegiMode('topics');
                                                router.push('/erettsegi-felkeszules?mode=topics');
                                            }}
                                        >
                                            <span className="level-icon">📖</span>
                                            <span className="level-name">Érettségi Témakörök szerint</span>
                                            <span className="level-desc">Témakörönként gyakorlás</span>
                                        </button>
                                        <button
                                            className="level-btn erettsegi-option"
                                            onClick={() => {
                                                setSelectedErettsegiMode('papers');
                                                router.push('/erettsegi-felkeszules?mode=papers');
                                            }}
                                        >
                                            <span className="level-icon">📄</span>
                                            <span className="level-name">Érettségi Feladatsorok</span>
                                            <span className="level-desc">Évek szerint csoportosított feladatsorok</span>
                                        </button>
                                    </div>
                                </div>
                            ) : educationLevel === 'elementary' && !selectedGrade ? (
                                <div className="grade-selector-section">
                                    <h2 className="level-title">Válassz osztályt:</h2>
                                    <div className="grade-buttons">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
                                            <button
                                                key={grade}
                                                className="grade-btn"
                                                onClick={() => setSelectedGrade(grade)}
                                            >
                                                <span className="grade-number">{grade}.</span>
                                                <span className="grade-label">osztály</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button className="reset-button" onClick={() => setEducationLevel(null)}>
                                        <span className="button-icon">←</span>
                                        VISSZA
                                    </button>
                                </div>
                            ) : educationLevel === 'elementary' && selectedGrade && !selectedElementaryTopic ? (
                                <div className="topic-selector-section">
                                    <div className="selected-grade-header">
                                        <h2 className="level-title">{selectedGrade}. osztály - Válassz témakört:</h2>
                                        <button
                                            className="change-grade-btn"
                                            onClick={() => setSelectedGrade(null)}
                                        >
                                            🔄 Osztály váltása
                                        </button>
                                    </div>
                                    <div className="elementary-topics-grid">
                                        {elementaryTopics.map(topic => (
                                            <div
                                                key={topic.id}
                                                className="elementary-topic-card"
                                                onClick={() => {
                                                    setSelectedElementaryTopic(topic.id);
                                                    generateElementaryQuestionsByTopic(topic.id, selectedGrade);
                                                }}
                                            >
                                                <div className="topic-icon" style={{ color: topic.color }}>
                                                    {topic.icon}
                                                </div>
                                                <h3 className="topic-title">{topic.title}</h3>
                                                <div className="topic-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : educationLevel === 'highschool' && !selectedHighschoolGrade ? (
                                <div className="grade-selector-section">
                                    <h2 className="level-title">Válassz osztályt:</h2>
                                    <div className="grade-buttons">
                                        {[9, 10, 11, 12].map(grade => (
                                            <button
                                                key={grade}
                                                className="grade-btn"
                                                onClick={() => setSelectedHighschoolGrade(grade)}
                                            >
                                                <span className="grade-number">{grade}.</span>
                                                <span className="grade-label">osztály</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button className="reset-button" onClick={() => setEducationLevel(null)}>
                                        <span className="button-icon">←</span>
                                        VISSZA
                                    </button>
                                </div>
                            ) : educationLevel === 'highschool' && selectedHighschoolGrade && !selectedHighschoolTopic ? (
                                <div className="topic-selector-section">
                                    <div className="selected-grade-header">
                                        <h2 className="level-title">{selectedHighschoolGrade}. osztály - Válassz témakört:</h2>
                                        <button
                                            className="change-grade-btn"
                                            onClick={() => setSelectedHighschoolGrade(null)}
                                        >
                                            🔄 Osztály váltása
                                        </button>
                                    </div>
                                    <div className="elementary-topics-grid">
                                        {highschoolTopics.map(topic => (
                                            <div
                                                key={topic.id}
                                                className="elementary-topic-card"
                                                onClick={() => {
                                                    setSelectedHighschoolTopic(topic.id);
                                                    generateHighschoolQuestionsByTopic(topic.id, selectedHighschoolGrade);
                                                }}
                                            >
                                                <div className="topic-icon" style={{ color: topic.color }}>
                                                    {topic.icon}
                                                </div>
                                                <h3 className="topic-title">{topic.title}</h3>
                                                <div className="topic-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : educationLevel === 'elementary' && selectedGrade && !selectedElementaryTopic ? (
                                <div className="topic-selector-section">
                                    <div className="selected-grade-header">
                                        <h2 className="level-title">{selectedGrade}. osztály - Válassz témakört:</h2>
                                        <button
                                            className="change-grade-btn"
                                            onClick={() => setSelectedGrade(null)}
                                        >
                                            🔄 Osztály váltása
                                        </button>
                                    </div>
                                    <div className="elementary-topics-grid">
                                        {elementaryTopics.map(topic => (
                                            <div
                                                key={topic.id}
                                                className="elementary-topic-card"
                                                onClick={() => {
                                                    setSelectedElementaryTopic(topic.id);
                                                    generateElementaryQuestionsByTopic(topic.id, selectedGrade);
                                                }}
                                            >
                                                <div className="topic-icon" style={{ color: topic.color }}>
                                                    {topic.icon}
                                                </div>
                                                <h3 className="topic-title">{topic.title}</h3>
                                                <div className="topic-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : educationLevel === 'university' && !selectedUniversitySubject && !showSzigorlatMenu ? (
                                <div className="subject-selector-section">
                                    <h2 className="level-title">Válassz opciót:</h2>
                                    <div className="elementary-topics-grid">
                                        {universitySubjects.map(subject => (
                                            <div
                                                key={subject.id}
                                                className="elementary-topic-card"
                                                onClick={() => setSelectedUniversitySubject(subject.id)}
                                            >
                                                <div className="topic-icon" style={{ color: subject.color }}>
                                                    {subject.icon}
                                                </div>
                                                <h3 className="topic-title">{subject.title}</h3>
                                                <div className="topic-arrow">→</div>
                                            </div>
                                        ))}
                                        <div
                                            className="elementary-topic-card"
                                            onClick={() => setShowSzigorlatMenu(true)}
                                            style={{ border: '2px solid rgba(255, 73, 219, 0.5)' }}
                                        >
                                            <div className="topic-icon" style={{ color: '#FF49DB' }}>
                                                📝
                                            </div>
                                            <h3 className="topic-title">Szigorlat</h3>
                                            <div className="topic-arrow">→</div>
                                        </div>
                                    </div>
                                    <button className="reset-button" onClick={() => setEducationLevel(null)}>
                                        <span className="button-icon">←</span>
                                        VISSZA
                                    </button>
                                </div>
                            ) : educationLevel === 'university' && showSzigorlatMenu ? (
                                <div className="subject-selector-section">
                                    <button
                                        className="reset-button"
                                        onClick={() => {
                                            setShowSzigorlatMenu(false);
                                        }}
                                        style={{ marginBottom: '2rem' }}
                                    >
                                        <span className="button-icon">←</span>
                                        VISSZA A TANTÁRGYAKHOZ
                                    </button>
                                    <h2 className="level-title">Szigorlat Felkészülés</h2>
                                    <p style={{ color: '#ccc', marginBottom: '2rem', textAlign: 'center' }}>
                                        Analízis I., II. és III. tantárgyakból vegyes feladatok
                                    </p>
                                    <div className="elementary-topics-grid">
                                        <div
                                            className="elementary-topic-card"
                                            onClick={() => {
                                                generateVegyesSzigorlatQuestions();
                                            }}
                                        >
                                            <div className="topic-icon" style={{ color: '#FF49DB' }}>
                                                📝
                                            </div>
                                            <h3 className="topic-title">Vegyes Szigorlat</h3>
                                            <p style={{ color: '#ccc', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                                Analízis I-III. vegyes feladatok
                                            </p>
                                            <div className="topic-arrow">→</div>
                                        </div>
                                    </div>
                                </div>
                            ) : educationLevel === 'university' && selectedUniversitySubject && !selectedUniversityTopic ? (
                                <div className="topic-selector-section">
                                    <div className="selected-grade-header">
                                        <h2 className="level-title">
                                            {universitySubjects.find(s => s.id === selectedUniversitySubject)?.title} - Válassz témakört:
                                        </h2>
                                        <button
                                            className="change-grade-btn"
                                            onClick={() => setSelectedUniversitySubject(null)}
                                        >
                                            🔄 Tantárgy váltása
                                        </button>
                                    </div>
                                    <div className="elementary-topics-grid">
                                        {universitySubjects.find(s => s.id === selectedUniversitySubject)?.topics.map(topic => (
                                            <div
                                                key={topic.id}
                                                className="elementary-topic-card"
                                                onClick={() => {
                                                    setSelectedUniversityTopic(topic.id);
                                                    generateUniversityQuestionsByTopic(selectedUniversitySubject, topic.id);
                                                }}
                                            >
                                                <div className="topic-icon" style={{ color: '#39ff14' }}>
                                                    {topic.icon}
                                                </div>
                                                <h3 className="topic-title">{topic.title}</h3>
                                                <div className="topic-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="game-info-section">
                                    <div className="selected-level"></div>
                                    <div className="stats-display">
                                        <div className="stat-item">
                                            <span className="stat-icon">🏆</span>
                                            <span className="stat-label">Legjobb eredmény</span>
                                            <span className="stat-value" suppressHydrationWarning>{highScore}</span>
                                        </div>
                                    </div>

                                    {/* Kiosztott feladatok megjelenítése */}
                                    {assignedTasks.length > 0 && (
                                        <div style={{
                                            background: 'rgba(57, 255, 20, 0.1)',
                                            border: '2px solid #39FF14',
                                            borderRadius: '15px',
                                            padding: '1rem',
                                            margin: '1rem 0',
                                            textAlign: 'center'
                                        }}>
                                            <h4 style={{ color: '#39FF14', marginBottom: '0.5rem' }}>
                                                📝 Kiosztott Feladatok ({assignedTasks.length})
                                            </h4>
                                            <p style={{ color: '#fff', fontSize: '0.9rem' }}>
                                                {assignedTasks.map(task => task.title).join(', ')}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        className="start-button"
                                        onClick={startGame}
                                        disabled={questions.length === 0}
                                    >
                                        <span className="button-icon">🚀</span>
                                        {questions.length === 0 ? 'NINCSENEK FELADATOK' : 'JÁTÉK INDÍTÁSA'}
                                    </button>
                                    <button className="reset-button" onClick={resetGame}>
                                        <span className="button-icon">🔄</span>
                                        VISSZA A VÁLASZTÁSHOZ
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="game-screen">
                            {isErettsegiMode && (
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '1rem',
                                    color: '#39ff14',
                                    fontSize: '1.2rem',
                                    fontWeight: '600'
                                }}>
                                    📚 Érettségi Felkészülés
                                </div>
                            )}
                            <div className="hud">
                                <div className="hud-item">
                                    <span className="hud-label">Pontszám:</span>
                                    <span className="hud-value">{score}</span>
                                </div>
                                <div className="hud-item">
                                    <span className="hud-label">XP:</span>
                                    <span className="hud-value">{totalXp}</span>
                                </div>
                                <div className="hud-item">
                                    <span className="hud-label">Feladat:</span>
                                    <span className="hud-value">{currentQuestion + 1}/{questions.length}</span>
                                </div>
                                {(isPathMode || isSprintMode || isDailyMode) && (
                                    <div className="hud-item">
                                        <span className="hud-label">Élet:</span>
                                        <span className="hud-value" style={{ letterSpacing: '0.08em' }}>
                                            {'❤️'.repeat(Math.max(0, lives))}
                                            {'🖤'.repeat(Math.max(0, (isSprintMode ? 2 : 3) - lives))}
                                        </span>
                                    </div>
                                )}
                                {correctStreak > 0 && (
                                    <div className="hud-item">
                                        <span className="hud-label">Streak:</span>
                                        <span className="hud-value">🔥 {correctStreak}</span>
                                    </div>
                                )}
                                {isSprintMode && (
                                    <div className="hud-item">
                                        <span className="hud-label">Idő:</span>
                                        <span
                                            className="hud-value"
                                            style={{ color: sprintLeft <= 15 ? '#ff6b6b' : '#39ff14' }}
                                        >
                                            {sprintLeft}s
                                        </span>
                                    </div>
                                )}
                                {isDailyMode && (
                                    <div className="hud-item">
                                        <span className="hud-label">Mód:</span>
                                        <span className="hud-value">Napi</span>
                                    </div>
                                )}
                            </div>

                            <div
                                className={`game-mascot-react mood-${mascotMood}`}
                                aria-hidden="true"
                            >
                                <img
                                    src="/mihaszna-mascot.png"
                                    alt=""
                                    width={72}
                                    height={72}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/mihaszna-mascot.svg';
                                    }}
                                />
                            </div>

                            {isWorksheetMode && questions[currentQuestion]?.stage && (
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '0.75rem',
                                    color: '#ffd700',
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}>
                                    {isPathMode && pathLesson
                                        ? `Lecke ${pathLesson}/6 · ${STAGE_LABELS[questions[currentQuestion].stage!]}`
                                        : `Szakasz ${questions[currentQuestion].stage}/3 · ${STAGE_LABELS[questions[currentQuestion].stage!]}`}
                                    {sessionXp > 0 ? ` · +${sessionXp} XP ebben a futásban` : ''}
                                </div>
                            )}

                            {badgeToast && (
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '0.75rem',
                                    padding: '0.6rem 1rem',
                                    background: 'rgba(255, 215, 0, 0.15)',
                                    border: '1px solid #ffd700',
                                    borderRadius: '12px',
                                    color: '#ffd700',
                                    fontWeight: 700
                                }}>
                                    {badgeToast}
                                </div>
                            )}

                            <div className="avatar-container">
                                <div
                                    className="avatar"
                                    style={{ background: getAvatarColor(avatarLevel) }}
                                >
                                    {getAvatarImage(avatarLevel)}
                                </div>
                                <div className="avatar-info">
                                    <div className="legend-text">{getAvatarTitle(avatarLevel)}</div>
                                    <div className="legend-badge">
                                        {(() => {
                                            const r = xpForNextRank(totalXp);
                                            const span = Math.max(1, r.next - r.current);
                                            const pct = Math.min(100, Math.round(((totalXp - r.current) / span) * 100));
                                            return `${getAvatarTitle(avatarLevel)} · ${totalXp} XP (${pct}%)`;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="question-card">
                                {questions[currentQuestion]?.subQuestions ? (
                                    // Részfeladatokkal rendelkező feladat megjelenítése
                                    <>
                                        <h2 className="question-text" style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                                            {questions[currentQuestion]?.question}
                                        </h2>
                                        {questions[currentQuestion].subQuestions!.map((subQ, index) => (
                                            <div key={index} style={{ 
                                                marginBottom: '2rem',
                                                padding: '1.5rem',
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(57, 255, 20, 0.3)'
                                            }}>
                                                <h3 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                                    {subQ.question}
                                                </h3>
                                                {showSolutions && (
                                                    <div style={{ 
                                                        color: '#ccc', 
                                                        marginBottom: '1rem',
                                                        fontSize: '0.9rem',
                                                        whiteSpace: 'pre-line',
                                                        padding: '0.5rem',
                                                        background: 'rgba(57, 255, 20, 0.1)',
                                                        borderRadius: '5px'
                                                    }}>
                                                        {subQ.rubric}
                                                    </div>
                                                )}
                                                <div className="answer-section" style={{ marginTop: '1rem' }}>
                                                    <input
                                                        type="text"
                                                        value={subQuestionAnswers[index] || ''}
                                                        onChange={(e) => {
                                                            const newAnswers = { ...subQuestionAnswers };
                                                            newAnswers[index] = e.target.value;
                                                            setSubQuestionAnswers(newAnswers);
                                                        }}
                                                        className="answer-input"
                                                        placeholder="Válasz"
                                                        autoFocus={index === 0}
                                                        disabled={showSolutions}
                                                        id={`math-input-${index}`}
                                                        style={{ 
                                                            width: '100%',
                                                            opacity: showSolutions ? 0.6 : 1
                                                        }}
                                                    />
                                                    {!showSolutions && (
                                                        <MathInputToolbar
                                                            onInsert={(text) => {
                                                                const newAnswers = { ...subQuestionAnswers };
                                                                const currentValue = newAnswers[index] || '';
                                                                const input = document.getElementById(`math-input-${index}`) as HTMLInputElement;
                                                                if (input) {
                                                                    const start = input.selectionStart || 0;
                                                                    const end = input.selectionEnd || 0;
                                                                    const value = input.value;
                                                                    newAnswers[index] = value.substring(0, start) + text + value.substring(end);
                                                                    setSubQuestionAnswers(newAnswers);
                                                                    setTimeout(() => {
                                                                        input.setSelectionRange(start + text.length, start + text.length);
                                                                        input.focus();
                                                                    }, 0);
                                                                } else {
                                                                    newAnswers[index] = currentValue + text;
                                                                    setSubQuestionAnswers(newAnswers);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                            {currentQuestion > 0 && (
                                                <button
                                                    className="submit-button"
                                                    onClick={() => {
                                                        // Visszalépés az előző feladatra
                                                        setCurrentQuestion(currentQuestion - 1);
                                                        setCurrentSubQuestion(0);
                                                        setSubQuestionAnswers({});
                                                        setShowSolutions(false);
                                                        setMessage('');
                                                        setIsCorrect(false);
                                                    }}
                                                    style={{ 
                                                        flex: 1,
                                                        background: 'rgba(57, 255, 20, 0.2)',
                                                        border: '2px solid rgba(57, 255, 20, 0.5)'
                                                    }}
                                                >
                                                    <span className="button-icon">⬅️</span>
                                                    Előző
                                                </button>
                                            )}
                                            {!showSolutions && (
                                                <button
                                                    className="submit-button"
                                                    onClick={() => {
                                                        setShowSolutions(true);
                                                        checkSubQuestionAnswers();
                                                    }}
                                                    disabled={
                                                        !questions[currentQuestion]?.subQuestions
                                                    }
                                                    style={{ flex: 1 }}
                                                >
                                                    <span className="button-icon">✅</span>
                                                    Válasz
                                                </button>
                                            )}
                                            {currentQuestion < questions.length - 1 && (
                                                <button
                                                    className="submit-button"
                                                    onClick={() => {
                                                        // Továbblépés a következő feladatra
                                                        setCurrentQuestion(currentQuestion + 1);
                                                        setCurrentSubQuestion(0);
                                                        setSubQuestionAnswers({});
                                                        setShowSolutions(false);
                                                        setMessage('');
                                                        setIsCorrect(false);
                                                    }}
                                                    style={{ 
                                                        flex: 1,
                                                        background: 'rgba(57, 255, 20, 0.2)',
                                                        border: '2px solid rgba(57, 255, 20, 0.5)'
                                                    }}
                                                >
                                                    <span className="button-icon">➡️</span>
                                                    Következő
                                                </button>
                                            )}
                                        </div>
                                        
                                        {message && (
                                            <div className={`message ${isCorrect ? 'correct' : 'incorrect'}`}>
                                                {message}
                                            </div>
                                        )}

                                        {showExpression && questions[currentQuestion] && (
                                            <div className="expression-display">
                                                <pre>{questions[currentQuestion].expression}</pre>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // Normál feladat megjelenítése
                                    <>
                                        <h2 className="question-text" style={{ whiteSpace: 'pre-line' }}>
                                    {questions[currentQuestion]?.question}
                                </h2>

                                <div className="answer-section">
                                            {questions[currentQuestion]?.fourthAnswer !== undefined ? (
                                        <>
                                            <input
                                                type="number"
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && userAnswer2.trim() && submitAnswer()}
                                                className="answer-input"
                                                placeholder="1. válasz"
                                                autoFocus
                                                style={{ marginRight: '10px' }}
                                            />
                                            <input
                                                type="number"
                                                value={userAnswer2}
                                                onChange={(e) => setUserAnswer2(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && userAnswer3.trim() && submitAnswer()}
                                                className="answer-input"
                                                placeholder="2. válasz"
                                                style={{ marginRight: '10px' }}
                                            />
                                            <input
                                                type="number"
                                                value={userAnswer3}
                                                onChange={(e) => setUserAnswer3(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && userAnswer4.trim() && submitAnswer()}
                                                className="answer-input"
                                                placeholder="3. válasz"
                                                style={{ marginRight: '10px' }}
                                            />
                                            <input
                                                type="number"
                                                value={userAnswer4}
                                                onChange={(e) => setUserAnswer4(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                                className="answer-input"
                                                placeholder="4. válasz"
                                            />
                                        </>
                                    ) : questions[currentQuestion]?.thirdAnswer !== undefined ? (
                                        <>
                                            <input
                                                type="number"
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && userAnswer2.trim() && submitAnswer()}
                                                className="answer-input"
                                                placeholder="1. válasz"
                                                autoFocus
                                                style={{ marginRight: '10px' }}
                                            />
                                            <input
                                                type="number"
                                                value={userAnswer2}
                                                onChange={(e) => setUserAnswer2(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && userAnswer3.trim() && submitAnswer()}
                                                className="answer-input"
                                                placeholder="2. válasz"
                                                style={{ marginRight: '10px' }}
                                            />
                                            <input
                                                type="number"
                                                value={userAnswer3}
                                                onChange={(e) => setUserAnswer3(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                                className="answer-input"
                                                placeholder="3. válasz"
                                            />
                                        </>
                                    ) : questions[currentQuestion]?.alternativeAnswer !== undefined ? (
                                        <>
                                            <input
                                                type="number"
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && userAnswer2.trim() && submitAnswer()}
                                                className="answer-input"
                                                placeholder="1. válasz"
                                                autoFocus
                                                style={{ marginRight: '10px' }}
                                            />
                                            <input
                                                type="number"
                                                value={userAnswer2}
                                                onChange={(e) => setUserAnswer2(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                                className="answer-input"
                                                placeholder="2. válasz"
                                            />
                                        </>
                                    ) : (
                                    <input
                                        type="number"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                        className="answer-input"
                                        placeholder="Írd be a választ..."
                                        autoFocus
                                    />
                                    )}
                                    <div className="answer-buttons">
                                        <button
                                            className="submit-button"
                                            onClick={submitAnswer}
                                            disabled={
                                                questions[currentQuestion]?.fourthAnswer !== undefined
                                                    ? (!userAnswer.trim() || !userAnswer2.trim() || !userAnswer3.trim() || !userAnswer4.trim())
                                                    : questions[currentQuestion]?.thirdAnswer !== undefined
                                                        ? (!userAnswer.trim() || !userAnswer2.trim() || !userAnswer3.trim())
                                                        : questions[currentQuestion]?.alternativeAnswer !== undefined
                                                            ? (!userAnswer.trim() || !userAnswer2.trim())
                                                            : !userAnswer.trim()
                                            }
                                        >
                                            <span className="button-icon">✅</span>
                                            VÁLASZ
                                        </button>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`message ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        {message}
                                    </div>
                                )}

                                {showExpression && questions[currentQuestion] && (
                                    <div className="expression-display">
                                        <pre>{questions[currentQuestion].expression}</pre>
                                    </div>
                                )}
                                    </>
                                )}
                            </div>

                            {isPathMode && (
                                <button
                                    className="reset-button"
                                    onClick={() => {
                                        const topic = (router.query.topic as string) || currentTopic;
                                        const edu = (router.query.educationLevel as EducationLevelId)
                                            || (router.query.erettsegi === 'true' ? 'erettsegi' : 'erettsegi');
                                        const examLvl = ((router.query.level as string) === 'kozep' ? 'kozep' : 'emelt') as 'kozep' | 'emelt';
                                        router.push(buildTopicPracticeHref(topic, edu, examLvl));
                                    }}
                                    style={{
                                        marginBottom: '0.75rem',
                                        background: 'linear-gradient(90deg, #39ff14, #ffd700)',
                                        color: '#111',
                                        fontWeight: 800,
                                        border: 'none',
                                    }}
                                >
                                    <span className="button-icon">🗺️</span>
                                    Vissza az útra
                                </button>
                            )}

                            <button className="reset-button" onClick={resetGame}>
                                <span className="button-icon">🔄</span>
                                ÚJ JÁTÉK
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .game-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
                    position: relative;
                    overflow: hidden;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .game-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
                    pointer-events: none;
                }

                .game-main {
                    position: relative;
                    z-index: 10;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .start-screen {
                    text-align: center;
                    width: 100%;
                }

                .game-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    background: linear-gradient(45deg, #39ff14, #ff77c6, #78dbff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 20px;
                    text-shadow: 0 0 30px rgba(57, 255, 20, 0.5);
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }

                .game-subtitle {
                    color: #39ff14;
                    font-size: 1.3rem;
                    margin-bottom: 40px;
                    font-weight: 600;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }

                .level-selector {
                    margin: 40px 0;
                }

                .level-title {
                    color: #39ff14;
                    font-size: 1.8rem;
                    margin-bottom: 30px;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                }

                .level-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    max-width: 400px;
                    margin: 0 auto;
                }

                .level-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 20px;
                    padding: 25px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .level-btn:hover {
                    background: rgba(120, 219, 255, 0.2);
                    border-color: rgba(120, 219, 255, 0.8);
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(120, 219, 255, 0.4);
                }

                .level-icon {
                    font-size: 2.5rem;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .level-name {
                    color: white;
                    font-size: 1.3rem;
                    font-weight: 700;
                }

                .level-desc {
                    color: #78dbff;
                    font-size: 1rem;
                    opacity: 0.8;
                }

                .level-btn.erettsegi {
                    background: rgba(57, 255, 20, 0.15);
                    border-color: rgba(57, 255, 20, 0.6);
                }

                .level-btn.erettsegi:hover {
                    background: rgba(57, 255, 20, 0.25);
                    border-color: #39ff14;
                    box-shadow: 0 15px 40px rgba(57, 255, 20, 0.5);
                }

                .erettsegi-menu-section {
                    margin: 40px 0;
                    text-align: center;
                }

                .level-btn.erettsegi-option {
                    background: rgba(57, 255, 20, 0.15);
                    border-color: rgba(57, 255, 20, 0.6);
                }

                .level-btn.erettsegi-option:hover {
                    background: rgba(57, 255, 20, 0.25);
                    border-color: #39ff14;
                    box-shadow: 0 15px 40px rgba(57, 255, 20, 0.5);
                }

                .back-to-levels-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 15px;
                    padding: 0.8rem 1.5rem;
                    color: #ffffff;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(20px);
                }

                .back-to-levels-btn:hover {
                    background: rgba(120, 219, 255, 0.2);
                    border-color: rgba(120, 219, 255, 0.8);
                    transform: translateY(-2px);
                }

                .game-info-section {
                    margin: 40px 0;
                }

                .selected-level {
                    margin-bottom: 30px;
                }

                .selected-level h3 {
                    color: #39ff14;
                    font-size: 1.5rem;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                }

                .stats-display {
                    margin-bottom: 40px;
                }

                .stat-item {
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 20px;
                    padding: 20px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    position: relative;
                    top: 0;
                    transition: all 0.3s ease;
                }

                .stat-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(120, 219, 255, 0.4);
                    border-color: rgba(120, 219, 255, 0.8);
                }

                .stat-icon {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 10px;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .stat-label {
                    display: block;
                    color: #78dbff;
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                    font-weight: 600;
                }

                .stat-value {
                    display: block;
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .start-button, .reset-button {
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    border: none;
                    border-radius: 25px;
                    padding: 15px 30px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(57, 255, 20, 0.3);
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    margin: 10px;
                }

                .start-button:hover, .reset-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(57, 255, 20, 0.5);
                }

                .start-button:active, .reset-button:active {
                    transform: translateY(1px);
                }

                .start-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: linear-gradient(45deg, #666, #888);
                }

                .no-questions-warning {
                    background: rgba(255, 193, 7, 0.1);
                    border: 2px solid rgba(255, 193, 7, 0.5);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }

                .no-questions-warning p {
                    color: #ffc107;
                    margin: 5px 0;
                    font-size: 1.1rem;
                    text-shadow: 0 0 10px rgba(255, 193, 7, 0.8);
                }


                .button-icon {
                    font-size: 1.2rem;
                }

                .grade-selector-section {
                    margin-top: 40px;
                    text-align: center;
                    width: 100%;
                }

                .grade-buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin: 2rem 0;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .grade-btn {
                    background: rgba(57, 255, 20, 0.15);
                    border: 2px solid rgba(57, 255, 20, 0.6);
                    border-radius: 15px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .grade-btn:hover {
                    background: rgba(57, 255, 20, 0.25);
                    border-color: #39ff14;
                    box-shadow: 0 15px 40px rgba(57, 255, 20, 0.5);
                    transform: translateY(-5px);
                }

                .grade-number {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #39ff14;
                }

                .grade-label {
                    font-size: 0.9rem;
                    color: #ffffff;
                }

                .topic-selector-section {
                    margin-top: 40px;
                    text-align: center;
                    width: 100%;
                }

                .selected-grade-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .change-grade-btn {
                    background: rgba(57, 255, 20, 0.15);
                    border: 2px solid rgba(57, 255, 20, 0.6);
                    border-radius: 10px;
                    padding: 0.5rem 1rem;
                    color: #39ff14;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                }

                .change-grade-btn:hover {
                    background: rgba(57, 255, 20, 0.25);
                    border-color: #39ff14;
                }

                .elementary-topics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .elementary-topic-card {
                    background: rgba(57, 255, 20, 0.15);
                    border: 2px solid rgba(57, 255, 20, 0.6);
                    border-radius: 15px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    position: relative;
                }

                .elementary-topic-card:hover {
                    background: rgba(57, 255, 20, 0.25);
                    border-color: #39ff14;
                    box-shadow: 0 15px 40px rgba(57, 255, 20, 0.5);
                    transform: translateY(-5px);
                }

                .elementary-topic-card .topic-icon {
                    font-size: 3rem;
                }

                .elementary-topic-card .topic-title {
                    color: #ffffff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0;
                }

                .elementary-topic-card .topic-arrow {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    font-size: 1.5rem;
                    color: #39ff14;
                }

                .game-screen {
                    width: 100%;
                    text-align: center;
                }

                .hud {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .hud-item {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 15px;
                    padding: 15px 20px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    min-width: 120px;
                }

                .hud-label {
                    display: block;
                    color: #78dbff;
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                    font-weight: 600;
                }

                .hud-value {
                    display: block;
                    color: white;
                    font-size: 1.3rem;
                    font-weight: 800;
                }

                .game-mascot-react {
                    display: flex;
                    justify-content: center;
                    margin: -0.5rem 0 1rem;
                    transition: transform 0.25s ease, filter 0.25s ease;
                }
                .game-mascot-react img {
                    width: 72px;
                    height: 72px;
                    object-fit: contain;
                    filter: drop-shadow(0 0 12px rgba(57, 255, 20, 0.35));
                }
                .game-mascot-react.mood-happy {
                    transform: translateY(-4px) scale(1.08);
                    filter: drop-shadow(0 0 16px rgba(57, 255, 20, 0.7));
                }
                .game-mascot-react.mood-sad {
                    transform: translateY(4px) scale(0.95) rotate(-4deg);
                    filter: grayscale(0.35) drop-shadow(0 0 10px rgba(255, 73, 219, 0.45));
                }
                .game-mascot-react.mood-idle {
                    animation: mascotBob 2.4s ease-in-out infinite;
                }
                @keyframes mascotBob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .avatar-container {
                    margin: 30px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }

                .avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    box-shadow: 0 0 30px rgba(120, 219, 255, 0.5);
                    animation: avatarPulse 2s ease-in-out infinite;
                }

                .avatar-info {
                    text-align: center;
                }

                .legend-text {
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .legend-badge {
                    background: rgba(120, 219, 255, 0.2);
                    border: 1px solid rgba(120, 219, 255, 0.5);
                    border-radius: 15px;
                    padding: 5px 15px;
                    color: #78dbff;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .question-card {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 25px;
                    padding: 40px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    margin: 30px 0;
                }

                .question-text {
                    color: white;
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 30px;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                }

                .answer-section {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .answer-input {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    border-radius: 15px;
                    padding: 15px 20px;
                    color: #39ff14;
                    font-size: 1.5rem;
                    font-weight: 600;
                    text-align: center;
                    width: 200px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
                }

                .answer-input::placeholder {
                    color: rgba(57, 255, 20, 0.6);
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
                }

                .answer-input:focus {
                    outline: none;
                    border-color: rgba(57, 255, 20, 0.8);
                    box-shadow: 0 0 30px rgba(57, 255, 20, 0.4);
                }

                .submit-button {
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    border: none;
                    border-radius: 20px;
                    padding: 15px 25px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(57, 255, 20, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(57, 255, 20, 0.5);
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .answer-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 1rem;
                }


                .message {
                    margin-top: 20px;
                    padding: 15px 25px;
                    border-radius: 15px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    animation: messageSlide 0.5s ease-out;
                }

                .message.correct {
                    background: rgba(57, 255, 20, 0.2);
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    color: #39ff14;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
                }

                .message.incorrect {
                    background: rgba(255, 77, 198, 0.2);
                    border: 2px solid rgba(255, 77, 198, 0.5);
                    color: #ff77c6;
                    box-shadow: 0 0 20px rgba(255, 77, 198, 0.3);
                }

                .expression-display {
                    margin-top: 20px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 15px;
                    border: 1px solid rgba(120, 219, 255, 0.3);
                }

                .expression-display pre {
                    color: #78dbff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0;
                    text-align: left;
                    white-space: pre-wrap;
                }

                @keyframes neonGlow {
                    from {
                        text-shadow: 0 0 20px rgba(57, 255, 20, 0.5), 0 0 30px rgba(57, 255, 20, 0.3);
                    }
                    to {
                        text-shadow: 0 0 30px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.5);
                    }
                }

                @keyframes avatarPulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 30px rgba(120, 219, 255, 0.5);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 40px rgba(120, 219, 255, 0.8);
                    }
                }

                @keyframes messageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .game-title {
                        font-size: 2.5rem;
                    }
                    
                    .question-text {
                        font-size: 2rem;
                    }
                    
                    .answer-section {
                        flex-direction: column;
                    }
                    
                    .answer-input {
                        width: 100%;
                        max-width: 300px;
                    }
                    
                    .hud {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .level-buttons {
                        max-width: 100%;
                    }
                }
            `}</style>
        </>
    );
}
