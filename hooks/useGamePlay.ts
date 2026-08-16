import { useState, useEffect, useRef, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import { useRouter } from 'next/router';
import {
    applyAndSaveProgress,
    getBadgeDef,
    resolveProgressStorageKey,
    STAGE_LABELS,
    type BadgeId,
    type PracticeStage,
} from '../utils/practiceProgress';
import { PATH_LESSON_XP } from '../utils/topicPath';
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
import type { EducationLevelId } from '../utils/mathTopicsCatalog';
import type { Question } from '../utils/game';

export type GameSessionBridge = {
    educationLevel: 'elementary' | 'highschool' | 'university' | null;
    selectedTask: any;
    selectedGrade: number | null;
    selectedElementaryTopic: string | null;
    selectedHighschoolGrade: number | null;
    selectedHighschoolTopic: string | null;
    selectedUniversitySubject: string | null;
    selectedUniversityTopic: string | null;
    currentTopic: string;
    /** Session banks from generators (for worksheet save / stage checks). */
    erettsegiQuestions?: Question[];
    assignedTasks?: any[];
};

export type UseGamePlayParams = {
    currentUser: any;
    setTotalXp: Dispatch<SetStateAction<number>>;
    avatarLevel: number;
    setAvatarLevel: Dispatch<SetStateAction<number>>;
    /**
     * Live question list (base banks + failed). Page keeps this ref updated each render
     * so useGamePlay can run before useGameSessionBuilders without a circular hook dependency.
     */
    questionsRef: MutableRefObject<Question[]>;
    /**
     * Mutable bag of picker / generator fields for start + save.
     * Page updates \`.current\` each render after generators run.
     */
    sessionBridgeRef: MutableRefObject<GameSessionBridge>;
    educationLevel: 'elementary' | 'highschool' | 'university' | null;
    generateUniversityQuestions?: () => void;
    /** Clear picker UI (education level, menus) on reset. */
    onResetPicker?: () => void;
};

export function useGamePlay({
    currentUser,
    setTotalXp,
    avatarLevel,
    setAvatarLevel,
    questionsRef,
    sessionBridgeRef,
    educationLevel,
    generateUniversityQuestions,
    onResetPicker,
}: UseGamePlayParams) {
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
    const [showExpression, setShowExpression] = useState(false);
    const [avatarProgress, setAvatarProgress] = useState(0);
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
    const [isErettsegiMode, setIsErettsegiMode] = useState(false);

    const worksheetTopicKeyRef = useRef<string | null>(null);
    const pathLessonRef = useRef<number | null>(null);
    const livesRef = useRef(3);
    const sprintEndedRef = useRef(false);
    const correctQuestionIdsRef = useRef<string[]>([]);
    const wrongFirstIdsRef = useRef<string[]>([]);
    const erettsegiQuestionsRef = useRef<Question[]>([]);

    const getQuestions = () => questionsRef.current;

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('highScore');
        if (saved) {
            setHighScore(parseInt(saved, 10));
        }
    }, []);

    const saveGameResults = async () => {
            try {
                const ctx = sessionBridgeRef.current;
                const questions = getQuestions();
                const erettsegiBank = erettsegiQuestionsRef.current.length > 0
                    ? erettsegiQuestionsRef.current
                    : (ctx.erettsegiQuestions || []);
                const baseList = isWorksheetMode && erettsegiBank.length > 0
                    ? erettsegiBank
                    : questions;
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
            const topicFromQuery = (router.query.topic as string) || ctx.currentTopic || '';
            const uid = currentUser?.uid || null;

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

            if (!currentUser) return;

            const resultData: Record<string, unknown> = {
                userId: currentUser.uid,
                correct: correctAnswerCount,
                total: totalQuestions,
                score: score,
                xpEarned: sessionXp,
            };

            // Ha van selectedTask, akkor azt használjuk
            if (ctx.selectedTask) {
                resultData.topicId = ctx.selectedTask.id;
                resultData.topicTitle = ctx.selectedTask.title;
                resultData.gameMode = 'uniboost';
            } else {
                // Egyébként az educationLevel és egyéb információk alapján
                resultData.educationLevel = ctx.educationLevel;

                // Érettségi mód
                if (isErettsegiMode) {
                    resultData.gameMode = 'erettsegi';
                    resultData.topic = topicFromQuery || ctx.currentTopic;
                    resultData.topicId = topicFromQuery || ctx.currentTopic;
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
                else if (ctx.educationLevel === 'elementary' && ctx.selectedGrade && ctx.selectedElementaryTopic) {
                    resultData.grade = ctx.selectedGrade;
                    resultData.topic = ctx.selectedElementaryTopic;
                    resultData.topicId = ctx.selectedElementaryTopic;
                }
                // Középiskola
                else if (ctx.educationLevel === 'highschool' && ctx.selectedHighschoolGrade && ctx.selectedHighschoolTopic) {
                    resultData.grade = ctx.selectedHighschoolGrade;
                    resultData.topic = ctx.selectedHighschoolTopic;
                    resultData.topicId = ctx.selectedHighschoolTopic;
                }
                // Egyetem
                else if (ctx.educationLevel === 'university' && ctx.selectedUniversitySubject && ctx.selectedUniversityTopic) {
                    resultData.subject = ctx.selectedUniversitySubject;
                    resultData.topic = ctx.selectedUniversityTopic;
                    resultData.topicId = ctx.selectedUniversityTopic;
                }
                // Alapértelmezett
                else {
                    resultData.gameMode = ctx.educationLevel || 'unknown';
                }
            }

            const { saveGameResult } = await import('../utils/gameResultsClient');
            await saveGameResult(resultData);
            } catch (error) {
                console.error('Error saving game results:', error);
        }
    };

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

    const startGame = async () => {
        if (!educationLevel) return;

        const questions = getQuestions();
        // Ellenőrizzük, hogy vannak-e feladatok
        if (questions.length === 0) {
            alert('Nincsenek elérhető feladatok ezen a szinten. Kérjük, válasszon másik szintet!');
            return;
        }

        // Ha egyetemi szint van kiválasztva, generáljuk a feladatokat
        if (educationLevel === 'university') {
            generateUniversityQuestions?.(); // Nem await, mert azonnal elérhető
        }

        // Ha van kiosztott feladat a témakörhöz, akkor azt használjuk
        const assignedTasks = sessionBridgeRef.current.assignedTasks || [];
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
        setFailedQuestions([]);
        setIsWorksheetMode(false);
        setIsPathMode(false);
        setPathLesson(null);
        pathLessonRef.current = null;
        setIsSprintMode(false);
        setIsDailyMode(false);
        setIsErettsegiMode(false);
        setCorrectStreak(0);
        setMaxStreak(0);
        setSessionXp(0);
        setCorrectQuestionIds([]);
        setWrongFirstIds([]);
        setStagesCleared([]);
        correctQuestionIdsRef.current = [];
        wrongFirstIdsRef.current = [];
        erettsegiQuestionsRef.current = [];
        worksheetTopicKeyRef.current = null;
        sprintEndedRef.current = false;
        setMascotMood('idle');
        onResetPicker?.();
    };

    const checkSubQuestionAnswers = () => {
        const questions = getQuestions();
        const currentQ = questions[currentQuestion];
        if (!currentQ?.subQuestions) {
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
        const questions = getQuestions();
        const currentQ = questions[currentQuestion];
        if (!currentQ) return;
        
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
                            const bank = sessionBridgeRef.current.erettsegiQuestions || [];
                            const baseQs = bank.length > 0 ? bank : questions;
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
                        const bank = sessionBridgeRef.current.erettsegiQuestions || [];
                        const baseQs = bank.length > 0 ? bank : questions;
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

    return {
        // state
        score,
        setScore,
        level,
        setLevel,
        lives,
        setLives,
        currentQuestion,
        setCurrentQuestion,
        currentSubQuestion,
        setCurrentSubQuestion,
        subQuestionAnswers,
        setSubQuestionAnswers,
        showSolutions,
        setShowSolutions,
        userAnswer,
        setUserAnswer,
        userAnswer2,
        setUserAnswer2,
        userAnswer3,
        setUserAnswer3,
        userAnswer4,
        setUserAnswer4,
        message,
        setMessage,
        failedQuestions,
        setFailedQuestions,
        isCorrect,
        setIsCorrect,
        gameActive,
        setGameActive,
        highScore,
        setHighScore,
        showExpression,
        setShowExpression,
        avatarProgress,
        setAvatarProgress,
        correctStreak,
        setCorrectStreak,
        maxStreak,
        setMaxStreak,
        sessionXp,
        setSessionXp,
        correctQuestionIds,
        setCorrectQuestionIds,
        wrongFirstIds,
        setWrongFirstIds,
        stagesCleared,
        setStagesCleared,
        badgeToast,
        setBadgeToast,
        isWorksheetMode,
        setIsWorksheetMode,
        isPathMode,
        setIsPathMode,
        pathLesson,
        setPathLesson,
        isSprintMode,
        setIsSprintMode,
        sprintLeft,
        setSprintLeft,
        mascotMood,
        setMascotMood,
        isDailyMode,
        setIsDailyMode,
        isErettsegiMode,
        setIsErettsegiMode,
        // refs for generators / orchestration
        worksheetTopicKeyRef,
        pathLessonRef,
        livesRef,
        sprintEndedRef,
        correctQuestionIdsRef,
        wrongFirstIdsRef,
        erettsegiQuestionsRef,
        // actions
        startGame,
        resetGame,
        checkSubQuestionAnswers,
        submitAnswer,
        saveGameResults,
    };
}
