import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GamePlayHud from '../components/game/GamePlayHud';
import GameQuestionCard from '../components/game/GameQuestionCard';
import GamePathBackButton from '../components/game/GamePathBackButton';
import GameLoading from '../components/game/GameLoading';
import GameLobby from '../components/game/GameLobby';
import GameCelebrate from '../components/game/GameCelebrate';
import { useGameAuth } from '../hooks/useGameAuth';
import { useGamePlay, type GameSessionBridge } from '../hooks/useGamePlay';
import { useGameSessionBuilders } from '../hooks/useGameSessionBuilders';
import { useGameRouteBootstrap } from '../hooks/useGameRouteBootstrap';
import type { Question } from '../utils/game';
import { buildBlitzHref, buildTopicPracticeHref } from '../utils/topicStats';
import { getHsTextbookLessonLabel } from '../utils/hsTextbook';
import { comboMultiplier, gearFromRank } from '../utils/gameJuice';
import { agentDebugLog } from '../utils/agentDebugLog';
import { skillNodeById } from '../utils/skillTree';

export default function Game() {
    const router = useRouter();
    const {
        currentUser,
        loading,
        totalXp,
        setTotalXp,
        avatarLevel,
        setAvatarLevel,
    } = useGameAuth();

    const [educationLevel, setEducationLevel] = useState<'elementary' | 'highschool' | 'university' | null>(null);
    const [currentTopic, setCurrentTopic] = useState<string>('');
    const [showErettsegiMenu, setShowErettsegiMenu] = useState(false);
    const [selectedErettsegiMode, setSelectedErettsegiMode] = useState<'topics' | 'papers' | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [selectedElementaryTopic, setSelectedElementaryTopic] = useState<string | null>(null);
    const [selectedHighschoolGrade, setSelectedHighschoolGrade] = useState<number | null>(null);
    const [selectedHighschoolTopic, setSelectedHighschoolTopic] = useState<string | null>(null);
    const [selectedUniversitySubject, setSelectedUniversitySubject] = useState<string | null>(null);
    const [selectedUniversityTopic, setSelectedUniversityTopic] = useState<string | null>(null);
    const [showSzigorlatMenu, setShowSzigorlatMenu] = useState(false);

    const questionsRef = useRef<Question[]>([]);
    const generateUniversityQuestionsRef = useRef<(() => void) | undefined>(undefined);
    const sessionBridgeRef = useRef<GameSessionBridge>({
        educationLevel: null,
        selectedTask: null,
        selectedGrade: null,
        selectedElementaryTopic: null,
        selectedHighschoolGrade: null,
        selectedHighschoolTopic: null,
        selectedUniversitySubject: null,
        selectedUniversityTopic: null,
        currentTopic: '',
        erettsegiQuestions: [],
        assignedTasks: [],
    });

    const {
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
        feedbackPending,
        celebrateLevelUp,
        continueAfterFeedback,
        setFailedQuestions,
        isCorrect,
        setIsCorrect,
        gameActive,
        setGameActive,
        highScore,
        showExpression,
        setShowExpression,
        correctStreak,
        setCorrectStreak,
        setMaxStreak,
        sessionXp,
        setSessionXp,
        setCorrectQuestionIds,
        setWrongFirstIds,
        setStagesCleared,
        badgeToast,
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
        isBlitzMode,
        setIsBlitzMode,
        juiceBoosters,
        hintText,
        secondChanceArmed,
        comboBroken,
        brokenStreak,
        lastXpGain,
        skillPerks,
        useBooster,
        worksheetTopicKeyRef,
        pathLessonRef,
        livesRef,
        sprintEndedRef,
        correctQuestionIdsRef,
        wrongFirstIdsRef,
        erettsegiQuestionsRef,
        startGame,
        resetGame,
        checkSubQuestionAnswers,
        submitAnswer,
        skipQuestion,
    } = useGamePlay({
        currentUser,
        setTotalXp,
        avatarLevel,
        setAvatarLevel,
        questionsRef,
        sessionBridgeRef,
        educationLevel,
        generateUniversityQuestions: () => generateUniversityQuestionsRef.current?.(),
        onResetPicker: () => {
            setEducationLevel(null);
            setShowErettsegiMenu(false);
            setSelectedErettsegiMode(null);
        },
    });

    const {
        taskQuestions,
        setTaskQuestions,
        erettsegiQuestions,
        setErettsegiQuestions,
        assignedTasks,
        selectedTask,
        loadTaskQuestions,
        generateElementaryQuestionsByTopic,
        generateKozpontiQuestionsByTopic,
        generateKozpontiPaper,
        generateSzigorlatQuestionsBySubject,
        generateVegyesSzigorlatQuestions,
        generateUniversityQuestionsByTopic,
        generateHighschoolQuestionsByTopic,
        startPathLessonForEducationLevel,
        startTopicMixedPractice,
        generateDailyMixedQuestions,
        generateBlitzQuestions,
        generateChallengeQuestions,
        generateErettsegiQuestionsByTopic,
        generateMixedErettsegiQuestions,
        loadAssignedTasks,
        generateUniversityQuestions,
        getQuestionsForLevel,
        elementaryTopics,
        highschoolTopics,
        universitySubjects,
    } = useGameSessionBuilders({
        router,
        currentUser,
        currentTopic,
        setCurrentTopic,
        setEducationLevel,
        setGameActive,
        setScore,
        setLevel,
        setLives,
        setCurrentQuestion,
        setCurrentSubQuestion,
        setSubQuestionAnswers,
        setShowSolutions,
        setUserAnswer,
        setUserAnswer2,
        setUserAnswer3,
        setUserAnswer4,
        setMessage,
        setIsCorrect,
        setShowExpression,
        setFailedQuestions,
        setIsWorksheetMode,
        setIsPathMode,
        setPathLesson,
        setIsSprintMode,
        setSprintLeft,
        setMascotMood,
        setIsDailyMode,
        setIsErettsegiMode,
        setIsBlitzMode,
        setCorrectQuestionIds,
        setWrongFirstIds,
        setStagesCleared,
        setSessionXp,
        setCorrectStreak,
        setMaxStreak,
        setSelectedGrade,
        setSelectedElementaryTopic,
        setSelectedHighschoolGrade,
        setSelectedHighschoolTopic,
        setSelectedUniversitySubject,
        setSelectedUniversityTopic,
        pathLessonRef,
        livesRef,
        sprintEndedRef,
        correctQuestionIdsRef,
        wrongFirstIdsRef,
        worksheetTopicKeyRef,
        erettsegiQuestionsRef,
    });

    generateUniversityQuestionsRef.current = generateUniversityQuestions;
    sessionBridgeRef.current = {
        educationLevel,
        selectedTask,
        selectedGrade,
        selectedElementaryTopic,
        selectedHighschoolGrade,
        selectedHighschoolTopic,
        selectedUniversitySubject,
        selectedUniversityTopic,
        currentTopic,
        erettsegiQuestions,
        assignedTasks,
        replaceSessionQuestions: (qs) => {
            setErettsegiQuestions(qs);
            setTaskQuestions(qs);
        },
    };

    const { isClient } = useGameRouteBootstrap({
        router,
        gameActive,
        setEducationLevel,
        setCurrentTopic,
        setSelectedGrade,
        setSelectedElementaryTopic,
        setSelectedHighschoolGrade,
        setSelectedHighschoolTopic,
        setSelectedUniversitySubject,
        setSelectedUniversityTopic,
        generateDailyMixedQuestions,
        generateBlitzQuestions,
        generateChallengeQuestions,
        startTopicMixedPractice,
        startPathLessonForEducationLevel,
        generateElementaryQuestionsByTopic,
        generateHighschoolQuestionsByTopic,
        generateUniversityQuestionsByTopic,
        generateErettsegiQuestionsByTopic,
        generateMixedErettsegiQuestions,
        generateKozpontiQuestionsByTopic,
        generateKozpontiPaper,
        generateVegyesSzigorlatQuestions,
        generateSzigorlatQuestionsBySubject,
        loadTaskQuestions,
        loadAssignedTasks,
    });

    const showDevNav =
        process.env.NODE_ENV === 'development' || router.query.dev === '1';

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

    // Feladatok betöltése a kiválasztott szint alapján (keverve) + hibás feladatok
    const questions: Question[] = useMemo(() => {
        let baseQuestions: Question[] = [];
        if (erettsegiQuestions.length > 0) {
            baseQuestions = erettsegiQuestions;
        } else if (taskQuestions.length > 0) {
            baseQuestions = taskQuestions;
        } else {
            const levelQuestions = getQuestionsForLevel(educationLevel || 'elementary');
            baseQuestions = [...levelQuestions].sort(() => Math.random() - 0.5);
        }
        return baseQuestions;
    }, [erettsegiQuestions, taskQuestions, educationLevel]);
    questionsRef.current = questions;

    useEffect(() => {
        if (!gameActive) return;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'game.tsx:showDevNav',
            message: 'dev nav visibility',
            data: {
                showDevNav,
                nodeEnv: process.env.NODE_ENV || '',
                queryDev: String(router.query.dev || ''),
                qLen: questions.length,
                idx: currentQuestion,
            },
            runId: 'dev-nav',
        });
        // #endregion
    }, [gameActive, showDevNav, questions.length, currentQuestion, router.query.dev]);

    if (!isClient || loading) {
        return <GameLoading />;
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
                        <GameLobby
                            isErettsegiMode={isErettsegiMode}
                            educationLevel={educationLevel}
                            setEducationLevel={setEducationLevel}
                            currentTopic={currentTopic}
                            selectedTask={selectedTask}
                            questionsLength={questions.length}
                            showErettsegiMenu={showErettsegiMenu}
                            setShowErettsegiMenu={setShowErettsegiMenu}
                            setSelectedErettsegiMode={setSelectedErettsegiMode}
                            onSelectErettsegiTopics={() => {
                                setSelectedErettsegiMode('topics');
                                router.push('/erettsegi-felkeszules?mode=topics');
                            }}
                            onSelectErettsegiPapers={() => {
                                setSelectedErettsegiMode('papers');
                                router.push('/erettsegi-felkeszules?mode=papers');
                            }}
                            selectedGrade={selectedGrade}
                            setSelectedGrade={setSelectedGrade}
                            selectedElementaryTopic={selectedElementaryTopic}
                            elementaryTopics={elementaryTopics}
                            onSelectElementaryTopic={(topicId, grade) => {
                                setSelectedElementaryTopic(topicId);
                                generateElementaryQuestionsByTopic(topicId, grade);
                            }}
                            selectedHighschoolGrade={selectedHighschoolGrade}
                            setSelectedHighschoolGrade={setSelectedHighschoolGrade}
                            selectedHighschoolTopic={selectedHighschoolTopic}
                            highschoolTopics={highschoolTopics}
                            onSelectHighschoolTopic={(topicId, grade) => {
                                if (grade === 9 || grade === 11) {
                                    router.push(buildTopicPracticeHref(topicId, 'highschool', 'emelt', grade));
                                    return;
                                }
                                setSelectedHighschoolTopic(topicId);
                                generateHighschoolQuestionsByTopic(topicId, grade);
                            }}
                            selectedUniversitySubject={selectedUniversitySubject}
                            setSelectedUniversitySubject={setSelectedUniversitySubject}
                            selectedUniversityTopic={selectedUniversityTopic}
                            showSzigorlatMenu={showSzigorlatMenu}
                            setShowSzigorlatMenu={setShowSzigorlatMenu}
                            universitySubjects={universitySubjects}
                            onGenerateKozponti={() => {
                                router.push('/kozponti-felkeszules');
                            }}
                            onGenerateVegyesSzigorlat={generateVegyesSzigorlatQuestions}
                            onSelectUniversityTopic={(_subjectId, topicId) => {
                                setSelectedUniversityTopic(topicId);
                                router.push(buildTopicPracticeHref(topicId, 'university'));
                            }}
                            highScore={highScore}
                            assignedTasks={assignedTasks}
                            onStartGame={startGame}
                            onResetGame={resetGame}
                            onStartBlitz={() => {
                                const level = educationLevel || 'highschool';
                                router.push(buildBlitzHref(level));
                            }}
                        />
                    ) : (
                        <div className="game-screen">
                            <GamePlayHud
                                score={score}
                                totalXp={totalXp}
                                currentQuestion={currentQuestion}
                                questionsLength={questions.length}
                                lives={lives}
                                correctStreak={correctStreak}
                                sprintLeft={sprintLeft}
                                isPathMode={isPathMode}
                                isSprintMode={isSprintMode}
                                isDailyMode={isDailyMode}
                                isTopicMix={router.query.topicMix === '1'}
                                isBlitzMode={isBlitzMode}
                                isBoss={!!questions[currentQuestion]?.isBoss}
                                isErettsegiMode={isErettsegiMode}
                                isWorksheetMode={isWorksheetMode}
                                pathLesson={pathLesson}
                                sessionXp={sessionXp}
                                mascotMood={mascotMood}
                                badgeToast={badgeToast}
                                avatarLevel={avatarLevel}
                                currentStage={questions[currentQuestion]?.stage}
                                juiceBoosters={juiceBoosters}
                                secondChanceArmed={secondChanceArmed}
                                onUseBooster={useBooster}
                                comboEarlier={skillPerks.comboEarlier}
                                extraLives={skillPerks.extraLives}
                                hideTaskIndex={router.query.kozponti === 'true'}
                                challengeTitle={skillNodeById(String(router.query.challenge || ''))?.title}
                                hideBoosters={!!skillNodeById(String(router.query.challenge || ''))?.rules.noBoosters}
                                maxLives={skillNodeById(String(router.query.challenge || ''))?.rules.lives}
                                pathStageLabel={getHsTextbookLessonLabel(
                                    String(router.query.topic || selectedHighschoolTopic || ''),
                                    pathLesson || 0
                                )}
                            />

                            <GameQuestionCard
                                question={questions[currentQuestion]}
                                currentQuestion={currentQuestion}
                                questionsLength={questions.length}
                                subQuestionAnswers={subQuestionAnswers}
                                setSubQuestionAnswers={setSubQuestionAnswers}
                                showSolutions={showSolutions}
                                setShowSolutions={setShowSolutions}
                                setCurrentQuestion={setCurrentQuestion}
                                setCurrentSubQuestion={setCurrentSubQuestion}
                                setMessage={setMessage}
                                setIsCorrect={setIsCorrect}
                                checkSubQuestionAnswers={checkSubQuestionAnswers}
                                userAnswer={userAnswer}
                                setUserAnswer={setUserAnswer}
                                userAnswer2={userAnswer2}
                                setUserAnswer2={setUserAnswer2}
                                userAnswer3={userAnswer3}
                                setUserAnswer3={setUserAnswer3}
                                userAnswer4={userAnswer4}
                                setUserAnswer4={setUserAnswer4}
                                submitAnswer={submitAnswer}
                                message={message}
                                isCorrect={isCorrect}
                                showExpression={showExpression}
                                feedbackPending={feedbackPending}
                                onDismissFeedback={continueAfterFeedback}
                                hintText={hintText}
                                hideOfficialLabel={router.query.kozponti === 'true'}
                            />

                            <GameCelebrate
                                open={feedbackPending && (isCorrect || comboBroken)}
                                streak={comboBroken && !isCorrect ? brokenStreak : correctStreak}
                                levelUp={celebrateLevelUp}
                                multiplier={comboMultiplier(correctStreak, skillPerks.comboEarlier)}
                                xpGained={lastXpGain}
                                isBoss={!!questions[currentQuestion]?.isBoss && isCorrect}
                                broken={comboBroken && !isCorrect}
                                gear={gearFromRank(avatarLevel)}
                                onContinue={continueAfterFeedback}
                            />

                            {isPathMode && (
                                <GamePathBackButton currentTopic={currentTopic} />
                            )}

                            {showDevNav && (
                                <div className="dev-nav-row">
                                    <button
                                        type="button"
                                        className="dev-nav-btn"
                                        onClick={() => skipQuestion(-1)}
                                        disabled={!currentQuestion}
                                    >
                                        ← Előző
                                    </button>
                                    <span className="dev-nav-idx">
                                        {currentQuestion + 1}/{questions.length}
                                    </span>
                                    <button
                                        type="button"
                                        className="dev-nav-btn"
                                        onClick={() => skipQuestion(1)}
                                        disabled={currentQuestion >= questions.length - 1}
                                    >
                                        Következő →
                                    </button>
                                </div>
                            )}

                            <button className="reset-button" onClick={resetGame}>
                                <span className="button-icon">🔄</span>
                                ÚJ JÁTÉK
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
