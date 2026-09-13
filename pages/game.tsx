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
import { buildBlitzHref, buildChallengeHref, buildTopicPracticeHref } from '../utils/topicStats';
import GameChallengeOffer from '../components/game/GameChallengeOffer';
import type { EducationLevelId } from '../utils/mathTopicsCatalog';
import { getHsTextbookLessonLabel } from '../utils/hsTextbook';
import { getElemNatLessonLabel } from '../utils/elemNatCatalog';
import {
    comboMultiplier,
    gearFromRank,
    livesFromXp,
    nearMissCue,
    nextLifeUnlock,
    readPlayWithLivesLocal,
    startLivesForRun,
    writePlayWithLivesLocal,
} from '../utils/gameJuice';
import { loadUserPracticeProgress, persistPlayWithLives } from '../utils/practiceProgress';
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
    const [playWithLives, setPlayWithLives] = useState(true);

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
        runMaxLives,
        doubleStakeArmed,
        setDoubleStakeArmed,
        clutchArmed,
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
        challengeOffer,
        dismissChallengeOffer,
    } = useGamePlay({
        currentUser,
        totalXp,
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
        playWithLives,
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
        generateErettsegiPaper,
        generateBmeValszamPaper,
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
        playWithLives,
        totalXp,
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

    useEffect(() => {
        setPlayWithLives(readPlayWithLivesLocal());
    }, []);

    useEffect(() => {
        if (!currentUser?.uid) return;
        void loadUserPracticeProgress(currentUser.uid).then((prog) => {
            if (prog.juice?.playWithLives === false) setPlayWithLives(false);
            else if (prog.juice?.playWithLives === true) setPlayWithLives(true);
        }).catch(() => undefined);
    }, [currentUser?.uid]);

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
        generateErettsegiPaper,
        generateBmeValszamPaper,
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
            const start = startLivesForRun({ playWithLives, xp: totalXp });
            livesRef.current = start;
            setLives(start);
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
                                if (grade === 9 || grade === 10 || grade === 11 || grade === 12) {
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
                            onSelectKozpontiTopic={(topicId, grade) => {
                                router.push(`/game?kozponti=true&topic=${encodeURIComponent(topicId)}&grade=${grade}`);
                            }}
                            onSelectKozpontiPaper={(paperId) => {
                                router.push(`/game?kozponti=true&paper=${encodeURIComponent(paperId)}`);
                            }}
                            onGenerateVegyesSzigorlat={generateVegyesSzigorlatQuestions}
                            onSelectUniversityTopic={(_subjectId, topicId) => {
                                if (!topicId) {
                                    setSelectedUniversityTopic(null);
                                    return;
                                }
                                if (topicId === 'valszam-bme') {
                                    setSelectedUniversityTopic(topicId);
                                    // #region agent log
                                    void import('../utils/agentDebugLog').then(({ agentDebugLog }) => {
                                        agentDebugLog({
                                            hypothesisId: 'H33',
                                            location: 'game.tsx:selectBmeHub',
                                            message: 'BME hub selected, stay in lobby',
                                            data: { topicId, navigatedToPath: false },
                                            runId: 'bme-valszam',
                                        });
                                    });
                                    // #endregion
                                    return;
                                }
                                setSelectedUniversityTopic(topicId);
                                router.push(buildTopicPracticeHref(topicId, 'university'));
                            }}
                            onSelectBmePaper={(paperId) => {
                                router.push(
                                    `/game?educationLevel=university&bmeValszam=true&paperId=${encodeURIComponent(paperId)}`
                                );
                            }}
                            highScore={highScore}
                            assignedTasks={assignedTasks}
                            onStartGame={startGame}
                            onResetGame={resetGame}
                            onStartBlitz={() => {
                                const level = educationLevel || 'highschool';
                                router.push(buildBlitzHref(level));
                            }}
                            playWithLives={playWithLives}
                            maxLivesFromXp={livesFromXp(totalXp)}
                            nextLifeUnlockXp={nextLifeUnlock(totalXp)?.nextXp ?? null}
                            onTogglePlayWithLives={(on) => {
                                setPlayWithLives(on);
                                writePlayWithLivesLocal(on);
                                void persistPlayWithLives(currentUser?.uid, on);
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
                                hideTaskIndex={
                                    router.query.kozponti === 'true'
                                    || !!skillNodeById(String(router.query.challenge || ''))?.rules.hideTaskIndex
                                }
                                hideTimer={!!skillNodeById(String(router.query.challenge || ''))?.rules.hideTimer}
                                challengeTitle={skillNodeById(String(router.query.challenge || ''))?.title}
                                hideBoosters={!!skillNodeById(String(router.query.challenge || ''))?.rules.noBoosters}
                                maxLives={
                                    skillNodeById(String(router.query.challenge || ''))?.rules.lives
                                    || runMaxLives
                                }
                                showLives={
                                    !!skillNodeById(String(router.query.challenge || ''))
                                    || playWithLives
                                }
                                nearMiss={nearMissCue({
                                    streak: correctStreak,
                                    lives,
                                    playWithLives:
                                        playWithLives
                                        || !!skillNodeById(String(router.query.challenge || '')),
                                    remainingIncludingCurrent: Math.max(0, questions.length - currentQuestion),
                                    comboEarlier: skillPerks.comboEarlier,
                                })}
                                isClutch={!!questions[currentQuestion]?.isClutch && clutchArmed}
                                pathStageLabel={
                                    getHsTextbookLessonLabel(
                                        String(router.query.topic || selectedHighschoolTopic || ''),
                                        pathLesson || 0
                                    ) ||
                                    getElemNatLessonLabel(String(router.query.topic || ''), pathLesson || 0)
                                }
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
                                hideOfficialLabel={
                                    router.query.kozponti === 'true' || Boolean(router.query.paperId)
                                }
                                doubleStakeArmed={doubleStakeArmed}
                                onToggleDoubleStake={
                                    skillNodeById(String(router.query.challenge || ''))
                                        ? undefined
                                        : () => setDoubleStakeArmed((on) => !on)
                                }
                            />

                            {challengeOffer && !skillNodeById(String(router.query.challenge || '')) && (
                                <GameChallengeOffer
                                    node={challengeOffer}
                                    onAccept={() => {
                                        const edu = (router.query.educationLevel as EducationLevelId)
                                            || educationLevel
                                            || 'erettsegi';
                                        const gradeRaw = parseInt(String(router.query.grade || ''), 10);
                                        const examLvl = ((router.query.level as string) === 'kozep' ? 'kozep' : 'emelt') as 'kozep' | 'emelt';
                                        router.push(buildChallengeHref(
                                            challengeOffer.id,
                                            edu,
                                            examLvl,
                                            Number.isFinite(gradeRaw) ? gradeRaw : undefined
                                        ));
                                    }}
                                    onSkip={dismissChallengeOffer}
                                />
                            )}

                            <GameCelebrate
                                open={
                                    feedbackPending
                                    && (isCorrect || comboBroken)
                                    && !skillNodeById(String(router.query.challenge || ''))?.rules.deferFeedback
                                }
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
