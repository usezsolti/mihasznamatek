import { useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { NextRouter } from 'next/router';
import {
    assignStagesToQuestions,
    resolveProgressStorageKey,
    type PracticeStage,
} from '../utils/practiceProgress';
import {
    buildPathQuestionBank,
    getLessonQuestions,
    lessonToStage,
} from '../utils/topicPath';
import {
    elementaryTopics,
    highschoolTopics,
    getHighschoolTopicsForGrade,
    universitySubjects,
    getTopicsForEducationLevel,
    type EducationLevelId,
} from '../utils/mathTopicsCatalog';
import { SPRINT_SECONDS, type MascotMood } from '../utils/gameFeedback';
import { BLITZ_SECONDS } from '../utils/gameJuice';
import { type SkillNode } from '../utils/skillTree';
import { agentDebugLog } from '../utils/agentDebugLog';
import { shuffleArray } from '../utils/shuffle';
import { loadUserPracticeProgress } from '../utils/practiceProgress';
import { dueSrsCards } from '../utils/srs';
import { generateSkillQuestion, generateSkillQuestionFromCard } from '../utils/srsQuestions';
import type { Question } from '../utils/game';
import {
    generateQuadraticQuestion,
    generateDerivativeQuestion,
    generateTrigonometryQuestion,
    generateIntegralQuestion,
    generateGeometryQuestion,
    generateAlgebraQuestion,
    generateErettsegiQuestionByTopicId,
    generateElementaryQuestionByTopic,
    generateKozpontiQuestionByTopic,
    getKozpontiPaperQuestions,
    getErettsegiPaperQuestions,
    generateHighschoolQuestionByTopic,
    generateUniversityQuestionByTopic,
    getWorksheetListForTopic,
    szigorlatQuestions,
    elementaryQuestions,
    highschoolQuestions,
    fallbackUniversityQuestions,
} from '../utils/game';

export type GameEducationLevel = 'elementary' | 'highschool' | 'university' | null;

export type UseGameSessionBuildersParams = {
    router: NextRouter;
    currentUser: { uid?: string } | null;
    currentTopic: string;
    setCurrentTopic: Dispatch<SetStateAction<string>>;
    setEducationLevel: Dispatch<SetStateAction<GameEducationLevel>>;
    setGameActive: Dispatch<SetStateAction<boolean>>;
    setScore: Dispatch<SetStateAction<number>>;
    setLevel: Dispatch<SetStateAction<number>>;
    setLives: Dispatch<SetStateAction<number>>;
    setCurrentQuestion: Dispatch<SetStateAction<number>>;
    setCurrentSubQuestion: Dispatch<SetStateAction<number>>;
    setSubQuestionAnswers: Dispatch<SetStateAction<{ [key: number]: string }>>;
    setShowSolutions: Dispatch<SetStateAction<boolean>>;
    setUserAnswer: Dispatch<SetStateAction<string>>;
    setUserAnswer2: Dispatch<SetStateAction<string>>;
    setUserAnswer3: Dispatch<SetStateAction<string>>;
    setUserAnswer4: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    setIsCorrect: Dispatch<SetStateAction<boolean>>;
    setShowExpression: Dispatch<SetStateAction<boolean>>;
    setFailedQuestions: Dispatch<SetStateAction<Question[]>>;
    setIsWorksheetMode: Dispatch<SetStateAction<boolean>>;
    setIsPathMode: Dispatch<SetStateAction<boolean>>;
    setPathLesson: Dispatch<SetStateAction<number | null>>;
    setIsSprintMode: Dispatch<SetStateAction<boolean>>;
    setSprintLeft: Dispatch<SetStateAction<number>>;
    setMascotMood: Dispatch<SetStateAction<MascotMood>>;
    setIsDailyMode: Dispatch<SetStateAction<boolean>>;
    setIsErettsegiMode: Dispatch<SetStateAction<boolean>>;
    setIsBlitzMode: Dispatch<SetStateAction<boolean>>;
    setCorrectQuestionIds: Dispatch<SetStateAction<string[]>>;
    setWrongFirstIds: Dispatch<SetStateAction<string[]>>;
    setStagesCleared: Dispatch<SetStateAction<PracticeStage[]>>;
    setSessionXp: Dispatch<SetStateAction<number>>;
    setCorrectStreak: Dispatch<SetStateAction<number>>;
    setMaxStreak: Dispatch<SetStateAction<number>>;
    setSelectedGrade: Dispatch<SetStateAction<number | null>>;
    setSelectedElementaryTopic: Dispatch<SetStateAction<string | null>>;
    setSelectedHighschoolGrade: Dispatch<SetStateAction<number | null>>;
    setSelectedHighschoolTopic: Dispatch<SetStateAction<string | null>>;
    setSelectedUniversitySubject: Dispatch<SetStateAction<string | null>>;
    setSelectedUniversityTopic: Dispatch<SetStateAction<string | null>>;
    pathLessonRef: MutableRefObject<number | null>;
    livesRef: MutableRefObject<number>;
    sprintEndedRef: MutableRefObject<boolean>;
    correctQuestionIdsRef: MutableRefObject<string[]>;
    wrongFirstIdsRef: MutableRefObject<string[]>;
    worksheetTopicKeyRef: MutableRefObject<string | null>;
    erettsegiQuestionsRef: MutableRefObject<Question[]>;
};

function resetPlayAnswers(p: UseGameSessionBuildersParams) {
    p.setUserAnswer('');
    p.setUserAnswer2('');
    p.setUserAnswer3('');
    p.setUserAnswer4('');
    p.setMessage('');
    p.setIsCorrect(false);
    p.setShowExpression(false);
}

function startGeneratedRun(p: UseGameSessionBuildersParams, hasQuestions: boolean, extras?: {
    resetSubQuestions?: boolean;
    showSolutions?: boolean;
}) {
    if (!hasQuestions) return;
    p.setGameActive(true);
    p.setScore(0);
    p.setLevel(1);
    p.setLives(3);
    p.setCurrentQuestion(0);
    if (extras?.resetSubQuestions) {
        p.setCurrentSubQuestion(0);
        p.setSubQuestionAnswers({});
    }
    if (extras?.showSolutions === false) {
        p.setShowSolutions(false);
    }
    resetPlayAnswers(p);
}

export function useGameSessionBuilders(p: UseGameSessionBuildersParams) {
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [taskQuestions, setTaskQuestions] = useState<Question[]>([]);
    const [erettsegiQuestions, setErettsegiQuestions] = useState<Question[]>([]);
    const [universityQuestions, setUniversityQuestions] = useState<Question[]>([]);
    const erettsegiQuestionsRef = p.erettsegiQuestionsRef;

    const loadTaskQuestions = async (taskId: string) => {
        try {
            if (!(window as any).firebase) {
                return;
            }

            const db = (window as any).firebase.firestore();

            const snapshot = await db.collection('customTasks')
                .where('id', '==', taskId)
                .get();

            if (!snapshot.empty) {
                const taskDoc = snapshot.docs[0];
                const taskData = taskDoc.data();

                setSelectedTask(taskData);

                if (taskData.customQuestions && taskData.customQuestions.length > 0) {
                    const taskLevel = taskData.educationLevel || 'university';
                    if (taskLevel === 'elementary' || taskLevel === 'highschool' || taskLevel === 'university') {
                        p.setEducationLevel(taskLevel);
                    }
                    const questions = taskData.customQuestions.map((q: any, index: number) => ({
                        id: `task_${taskId}_${index}`,
                        question: q.question || `Feladat ${index + 1}`,
                        answer: q.answer || 0,
                        expression: q.expression || '',
                        level: taskLevel
                    }));
                    setTaskQuestions(questions);
                    p.setGameActive(true);
                    p.setScore(0);
                    p.setLevel(1);
                    p.setLives(3);
                    p.setCurrentQuestion(0);
                } else {
                    setTaskQuestions([]);
                }
            }
        } catch (error) {
            console.error('Error loading task questions:', error);
        }
    };

    const generateQuestionByTopic = (topic: string) => {
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
            return generateAlgebraQuestion();
        }
    };

    const generateTaskQuestions = (taskData: any) => {
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

    const generateElementaryQuestionsByTopic = (topicId: string, grade: number) => {
        const topic = elementaryTopics.find(t => t.id === topicId);
        if (topic) {
            p.setSelectedElementaryTopic(topic.title);
        }

        const questions: Question[] = [];
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

        setTaskQuestions(questions);
        startGeneratedRun(p, questions.length > 0);
    };

    const generateKozpontiQuestionsByTopic = (topicId: string) => {
        console.log('generateKozpontiQuestionsByTopic called with topicId:', topicId);
        const questions: Question[] = [];

        const kozpontiTopics = ['szamitas', 'algebra', 'geometria', 'szoveges', 'halmazok', 'fuggvenyek', 'statisztika', 'valoszinuseg'];

        const difficultyLevels = 5;
        const questionsPerTopic = Math.floor(50 / kozpontiTopics.length);

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
        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        setTaskQuestions(shuffledQuestions.slice(0, 50));

        if (questions.length > 0) {
            startGeneratedRun(p, true);
        } else {
            console.error('No questions generated for topicId:', topicId);
        }
    };

    const generateKozpontiPaper = (paperId: string) => {
        const list = getKozpontiPaperQuestions(paperId);
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'useGameSessionBuilders.ts:generateKozpontiPaper',
            message: 'kozponti paper started',
            data: {
                paperId,
                total: list?.length || 0,
                firstId: list?.[0]?.id,
                firstAnswer: list?.[0]?.answer,
                lastId: list?.[list.length - 1]?.id,
                lastAnswer: list?.[list.length - 1]?.answer,
                ready: Boolean(list?.length),
                isFeb: String(paperId || '').includes('feb') || String(paperId || '').includes('mat2'),
                is2025Jan: String(paperId || '').includes('2025'),
            },
            runId: 'kf-2026',
        });
        agentDebugLog({
            hypothesisId: 'H1',
            location: 'useGameSessionBuilders.ts:generateKozpontiPaper:2021',
            message: '2021 jan paper start',
            data: {
                paperId,
                total: list?.length || 0,
                firstId: list?.[0]?.id,
                firstAnswer: list?.[0]?.answer,
                lastId: list?.[list.length - 1]?.id,
                lastAnswer: list?.[list.length - 1]?.answer,
                swimFig: list?.find((x) => x.id === 'kf2021-4a')?.figure?.kind || null,
                triFig: list?.find((x) => x.id === 'kf2021-5a')?.figure?.kind || null,
                solidFig: list?.find((x) => x.id === 'kf2021-9')?.figure?.kind || null,
            },
            runId: 'kf-2021-jan',
        });
        // #endregion
        if (!list?.length) {
            console.error('No központi paper questions for', paperId);
            return;
        }
        setTaskQuestions(list);
        startGeneratedRun(p, true);
    };

    const generateErettsegiPaper = (paperId: string) => {
        const list = getErettsegiPaperQuestions(paperId);
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H1',
            location: 'useGameSessionBuilders.ts:generateErettsegiPaper',
            message: 'erettsegi official paper started',
            data: {
                paperId,
                total: list?.length || 0,
                firstId: list?.[0]?.id,
                lastId: list?.[list.length - 1]?.id,
                ready: Boolean(list?.length),
            },
            runId: 'er-2026-maj',
        });
        // #endregion
        if (!list?.length) {
            console.error('No érettségi paper questions for', paperId);
            return;
        }
        p.setIsErettsegiMode(true);
        setErettsegiQuestions(list);
        startGeneratedRun(p, true);
    };

    const generateSzigorlatQuestionsBySubject = (_subjectId: string) => {
        setTaskQuestions(szigorlatQuestions);
        startGeneratedRun(p, szigorlatQuestions.length > 0, { resetSubQuestions: true });
    };

    const generateVegyesSzigorlatQuestions = () => {
        setTaskQuestions(szigorlatQuestions);
        startGeneratedRun(p, szigorlatQuestions.length > 0, {
            resetSubQuestions: true,
            showSolutions: false,
        });
    };

    const generateUniversityQuestionsByTopic = (subjectId: string, topicId: string) => {
        const subject = universitySubjects.find(s => s.id === subjectId);
        if (subject) {
            p.setSelectedUniversitySubject(subject.title);
            const topic = subject.topics.find(t => t.id === topicId);
            if (topic) {
                p.setSelectedUniversityTopic(topic.title);
            }
        }

        const questions: Question[] = [];

        for (let i = 0; i < 50; i++) {
            const question = generateUniversityQuestionByTopic(subjectId, topicId);
            if (question) {
                questions.push({
                    ...question,
                    id: `university_${subjectId}_${topicId}_${i}`
                });
            }
        }

        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        setTaskQuestions(shuffledQuestions);
        startGeneratedRun(p, questions.length > 0);
    };

    const generateHighschoolQuestionsByTopic = (topicId: string, grade: number) => {
        const topic = getHighschoolTopicsForGrade(grade).find(t => t.id === topicId)
            || highschoolTopics.find(t => t.id === topicId);
        if (topic) {
            p.setSelectedHighschoolTopic(topic.title);
        }

        const questions: Question[] = [];
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

        setTaskQuestions(questions);
        startGeneratedRun(p, questions.length > 0);
    };

    const beginPathOrWorksheetRun = (
        questions: Question[],
        opts: {
            topicId: string;
            lessonNode: number | null;
            sprint?: boolean;
            erettsegi?: boolean;
            daily?: boolean;
            blitz?: boolean;
            keepOrder?: boolean;
            challenge?: SkillNode;
        }
    ) => {
        const source = opts.challenge
            ? questions.slice(0, Math.max(1, opts.challenge.rules.questionCount))
            : questions;
        const pathMode = opts.lessonNode != null;
        p.setIsPathMode(pathMode);
        p.setPathLesson(opts.lessonNode);
        p.pathLessonRef.current = opts.lessonNode;
        p.setIsWorksheetMode(true);
        p.setIsErettsegiMode(!!opts.erettsegi);
        p.setIsDailyMode(!!opts.daily);
        p.setIsBlitzMode(!!opts.blitz);
        p.setIsSprintMode(!!opts.sprint || !!opts.blitz || !!opts.challenge);
        const challengeSec = opts.challenge?.rules.seconds;
        p.setSprintLeft(
            typeof challengeSec === 'number'
                ? challengeSec
                : opts.blitz ? BLITZ_SECONDS : SPRINT_SECONDS
        );
        p.sprintEndedRef.current = false;
        p.setMascotMood('idle');
        p.worksheetTopicKeyRef.current = resolveProgressStorageKey(opts.topicId);
        p.setCurrentTopic(opts.topicId);
        p.setCorrectQuestionIds([]);
        p.setWrongFirstIds([]);
        p.setStagesCleared([]);
        p.setSessionXp(0);
        p.setCorrectStreak(0);
        p.setMaxStreak(0);
        p.setFailedQuestions([]);
        p.correctQuestionIdsRef.current = [];
        p.wrongFirstIdsRef.current = [];
        const ordered = opts.keepOrder ? source.slice() : shuffleArray(source);
        const stamped = ordered.map((q) => ({
            ...q,
            srsTopicId: q.srsTopicId || (opts.daily ? q.srsTopicId : opts.topicId),
            srsStage: q.srsStage || q.stage,
        }));
        if (pathMode && stamped.length >= 3) {
            for (let i = stamped.length - 3; i < stamped.length; i++) {
                stamped[i] = { ...stamped[i], isBoss: true };
            }
        }
        erettsegiQuestionsRef.current = stamped;
        setErettsegiQuestions(stamped);
        setTaskQuestions(stamped);

        // #region agent log
        void import('../utils/agentDebugLog').then(({ agentDebugLog }) => {
            agentDebugLog({
                hypothesisId: 'A',
                location: 'useGameSessionBuilders.ts:beginPathOrWorksheetRun',
                message: 'path/worksheet run started',
                data: {
                    pathMode,
                    lesson: opts.lessonNode,
                    questionsLength: stamped.length,
                    shuffled: !opts.keepOrder,
                    firstId: stamped[0]?.id || null,
                    topicId: opts.topicId,
                    daily: !!opts.daily,
                    blitz: !!opts.blitz,
                    challenge: opts.challenge?.id || '',
                    challengeQ: opts.challenge?.rules.questionCount || 0,
                    challengeSec: opts.challenge?.rules.seconds || 0,
                    bossN: stamped.filter((q) => q.isBoss).length,
                    topicMix: p.router.query.topicMix === '1',
                },
                runId: p.router.query.topicMix === '1' ? 'topic-mix' : 'path-20q',
            });
        });
        // #endregion

        if (source.length > 0) {
            p.setGameActive(true);
            p.setScore(0);
            p.setLevel(1);
            const startLives = opts.challenge
                ? opts.challenge.rules.lives
                : opts.sprint ? 2 : 3;
            p.livesRef.current = startLives;
            p.setLives(startLives);
            p.setCurrentQuestion(0);
            resetPlayAnswers(p);
        }
    };

    const startPathLessonForEducationLevel = (
        eduLevel: 'elementary' | 'highschool' | 'university',
        topicId: string,
        grade: number,
        sprint = false
    ) => {
        const nodeRaw = p.router.query.node;
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
            for (let band = 0; band < 6; band++) {
                const stage = (band + 1) as PracticeStage;
                const difficulty = Math.min(4, Math.floor(band * 0.8));
                for (let i = 0; i < 8; i++) {
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
            p.setSelectedGrade(grade);
            p.setSelectedElementaryTopic(topicId);
        } else if (eduLevel === 'highschool') {
            p.setSelectedHighschoolGrade(grade);
            p.setSelectedHighschoolTopic(topicId);
        } else {
            p.setSelectedUniversitySubject(topicId);
            p.setSelectedUniversityTopic(topicId);
        }
        p.setEducationLevel(eduLevel);
        beginPathOrWorksheetRun(questions, {
            topicId,
            lessonNode,
            sprint,
            erettsegi: false,
        });
    };

    const startTopicMixedPractice = (
        topicId: string,
        eduLevel: EducationLevelId,
        grade: number,
        examLevel = 'emelt'
    ) => {
        const perStage = 3;
        const qLevel =
            eduLevel === 'elementary'
                ? 'elementary'
                : eduLevel === 'highschool'
                  ? 'highschool'
                  : eduLevel === 'university'
                    ? 'university'
                    : examLevel === 'kozep'
                      ? 'highschool'
                      : 'university';

        let stagedSource: (Question & { stage: PracticeStage })[] = [];
        const worksheet = getWorksheetListForTopic(topicId);
        if (worksheet) {
            stagedSource = assignStagesToQuestions(
                worksheet.list.map((q, i) => ({
                    ...q,
                    id: `${worksheet.prefix}_mix_${i + 1}`,
                    level: qLevel,
                }))
            );
        } else {
            for (let band = 0; band < 6; band++) {
                const stage = (band + 1) as PracticeStage;
                const difficulty = Math.min(4, Math.floor(band * 0.8));
                for (let i = 0; i < 6; i++) {
                    let question: Question | null = null;
                    if (eduLevel === 'elementary') {
                        question = generateElementaryQuestionByTopic(topicId, grade, difficulty);
                    } else if (eduLevel === 'highschool') {
                        question = generateHighschoolQuestionByTopic(topicId, grade, difficulty);
                    } else if (eduLevel === 'university') {
                        question = generateUniversityQuestionByTopic(topicId, topicId);
                    } else {
                        question = generateErettsegiQuestionByTopicId(topicId, examLevel);
                    }
                    if (question) {
                        stagedSource.push({
                            ...question,
                            id: `mix_${eduLevel}_${topicId}_s${stage}_${i}_${Math.random().toString(36).slice(2, 7)}`,
                            level: qLevel,
                            stage,
                        });
                    }
                }
            }
        }

        const questions: Question[] = [];
        const stageCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        for (let band = 0; band < 6; band++) {
            const stage = (band + 1) as PracticeStage;
            const pool = stagedSource
                .filter((q) => q.stage === stage)
                .sort(() => Math.random() - 0.5);
            const fallback = stagedSource.length ? stagedSource : pool;
            const source = pool.length ? pool : fallback;
            for (let i = 0; i < perStage; i++) {
                const src = source[i % Math.max(1, source.length)];
                if (!src) continue;
                questions.push({
                    ...src,
                    id: `topicmix_${topicId}_s${stage}_${i}_${Math.random().toString(36).slice(2, 7)}`,
                    stage,
                    srsTopicId: topicId,
                    srsStage: stage,
                });
                stageCounts[stage] = (stageCounts[stage] || 0) + 1;
            }
        }

        // #region agent log
        agentDebugLog({
            hypothesisId: 'D',
            location: 'useGameSessionBuilders.ts:startTopicMixedPractice',
            message: 'topic-end mixed bank built',
            data: {
                topicId,
                eduLevel,
                examLevel,
                usedWorksheet: Boolean(worksheet),
                total: questions.length,
                stageCounts,
                lessonNode: null,
            },
            runId: 'topic-mix',
        });
        // #endregion

        if (eduLevel === 'elementary') {
            p.setSelectedGrade(grade);
            p.setSelectedElementaryTopic(topicId);
            p.setEducationLevel('elementary');
        } else if (eduLevel === 'highschool') {
            p.setSelectedHighschoolGrade(grade);
            p.setSelectedHighschoolTopic(topicId);
            p.setEducationLevel('highschool');
        } else if (eduLevel === 'university') {
            p.setSelectedUniversitySubject(topicId);
            p.setSelectedUniversityTopic(topicId);
            p.setEducationLevel('university');
        } else {
            p.setEducationLevel(null);
        }

        beginPathOrWorksheetRun(questions, {
            topicId,
            lessonNode: null,
            sprint: p.router.query.sprint === '1',
            erettsegi: eduLevel === 'erettsegi',
            daily: false,
        });
    };

    const generateDailyMixedQuestions = async (
        eduLevel: EducationLevelId,
        grade: number
    ) => {
        const examLevel = eduLevel === 'erettsegi'
            ? ((p.router.query.level as string) === 'kozep' ? 'kozep' : 'emelt')
            : 'emelt';
        const srsLevel = eduLevel === 'elementary' || eduLevel === 'highschool' || eduLevel === 'university' || eduLevel === 'erettsegi'
            ? eduLevel
            : 'erettsegi';
        const uid = p.currentUser?.uid || null;
        const progress = await loadUserPracticeProgress(uid);
        const due = dueSrsCards(progress.srs).filter((c) =>
            eduLevel === 'erettsegi' ? true : c.educationLevel === srsLevel || c.educationLevel === 'erettsegi'
        );
        const questions: Question[] = [];
        const reviewIds = new Set<string>();
        for (const card of due.slice(0, 8)) {
            const q = generateSkillQuestionFromCard(card, grade || 10);
            if (q) {
                questions.push(q);
                reviewIds.add(card.id);
            }
        }

        const topics = getTopicsForEducationLevel(
            eduLevel === 'erettsegi' ? 'erettsegi' : eduLevel,
            examLevel as 'kozep' | 'emelt'
        );
        const picked = [...topics].sort(() => Math.random() - 0.5).slice(0, 6);
        let guard = 0;
        while (questions.length < 12 && guard < 80) {
            guard++;
            const t = picked[questions.length % Math.max(1, picked.length)];
            if (!t) break;
            const stage = lessonToStage(Math.floor(questions.length / 4) + 1) as PracticeStage;
            let q: Question | null = generateSkillQuestion(t.id, stage, srsLevel, grade || 10);
            if (!q) {
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
                    q = {
                        ...q,
                        id: `daily_${t.id}_${questions.length}`,
                        stage,
                        srsTopicId: t.id,
                        srsStage: stage,
                    };
                }
            }
            if (q) questions.push(q);
        }

        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'useGameSessionBuilders.ts:generateDailyMixedQuestions',
            message: 'daily srs mix built',
            data: {
                eduLevel,
                dueN: due.length,
                reviewN: reviewIds.size,
                total: questions.length,
                firstSrs: questions[0]?.srsTopicId || null,
            },
            runId: 'srs-daily',
        });
        // #endregion

        p.setEducationLevel(
            eduLevel === 'erettsegi'
                ? null
                : eduLevel === 'elementary' || eduLevel === 'highschool' || eduLevel === 'university'
                  ? eduLevel
                  : null
        );
        beginPathOrWorksheetRun(questions, {
            topicId: `daily_${eduLevel}`,
            lessonNode: null,
            sprint: p.router.query.sprint === '1',
            erettsegi: eduLevel === 'erettsegi',
            daily: true,
        });
    };

    const generateBlitzQuestions = async (
        eduLevel: EducationLevelId,
        grade: number
    ) => {
        const examLevel = eduLevel === 'erettsegi'
            ? ((p.router.query.level as string) === 'kozep' ? 'kozep' : 'emelt')
            : 'emelt';
        const srsLevel = eduLevel === 'elementary' || eduLevel === 'highschool' || eduLevel === 'university' || eduLevel === 'erettsegi'
            ? eduLevel
            : 'erettsegi';
        const topics = getTopicsForEducationLevel(
            eduLevel === 'erettsegi' ? 'erettsegi' : eduLevel,
            examLevel as 'kozep' | 'emelt'
        );
        const picked = [...topics].sort(() => Math.random() - 0.5).slice(0, 8);
        const questions: Question[] = [];
        let guard = 0;
        while (questions.length < 24 && guard < 120) {
            guard++;
            const t = picked[questions.length % Math.max(1, picked.length)];
            if (!t) break;
            const stage = lessonToStage(Math.floor(questions.length / 4) + 1) as PracticeStage;
            let q: Question | null = generateSkillQuestion(t.id, stage, srsLevel, grade || 10);
            if (!q) {
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
                    q = {
                        ...q,
                        id: `blitz_${t.id}_${questions.length}`,
                        stage,
                        srsTopicId: t.id,
                        srsStage: stage,
                    };
                }
            }
            if (q) questions.push({ ...q, id: q.id || `blitz_${questions.length}` });
        }
        // #region agent log
        agentDebugLog({
            hypothesisId: 'D',
            location: 'useGameSessionBuilders.ts:generateBlitzQuestions',
            message: 'blitz bank built',
            data: { eduLevel, total: questions.length },
            runId: 'juice',
        });
        // #endregion
        p.setEducationLevel(
            eduLevel === 'erettsegi'
                ? null
                : eduLevel === 'elementary' || eduLevel === 'highschool' || eduLevel === 'university'
                  ? eduLevel
                  : null
        );
        beginPathOrWorksheetRun(questions, {
            topicId: `blitz_${eduLevel}`,
            lessonNode: null,
            sprint: false,
            blitz: true,
            erettsegi: eduLevel === 'erettsegi',
            daily: false,
        });
    };

    const generateChallengeQuestions = async (
        eduLevel: EducationLevelId,
        grade: number,
        challenge: SkillNode
    ) => {
        const examLevel = eduLevel === 'erettsegi'
            ? ((p.router.query.level as string) === 'kozep' ? 'kozep' : 'emelt')
            : 'emelt';
        const srsLevel = eduLevel === 'elementary' || eduLevel === 'highschool' || eduLevel === 'university' || eduLevel === 'erettsegi'
            ? eduLevel
            : 'erettsegi';
        const topics = getTopicsForEducationLevel(
            eduLevel === 'erettsegi' ? 'erettsegi' : eduLevel,
            examLevel as 'kozep' | 'emelt'
        );
        const needed = Math.max(1, challenge.rules.questionCount);
        const picked = [...topics].sort(() => Math.random() - 0.5).slice(0, Math.min(8, Math.max(3, topics.length)));
        const questions: Question[] = [];
        let guard = 0;
        while (questions.length < needed + 2 && guard < 80) {
            guard++;
            const t = picked[questions.length % Math.max(1, picked.length)];
            if (!t) break;
            const stage = lessonToStage(Math.floor(questions.length / 2) + 1) as PracticeStage;
            let q: Question | null = generateSkillQuestion(t.id, stage, srsLevel, grade || 10);
            if (!q) {
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
                    q = {
                        ...q,
                        id: `chal_${challenge.id}_${t.id}_${questions.length}`,
                        stage,
                        srsTopicId: t.id,
                        srsStage: stage,
                    };
                }
            }
            if (q) questions.push({ ...q, id: q.id || `chal_${challenge.id}_${questions.length}` });
        }
        // #region agent log
        agentDebugLog({
            hypothesisId: 'C',
            location: 'useGameSessionBuilders.ts:generateChallengeQuestions',
            message: 'challenge bank built',
            data: {
                id: challenge.id,
                needed,
                total: questions.length,
                sec: challenge.rules.seconds,
                timer: challenge.rules.timerMode,
                lives: challenge.rules.lives,
                noBoosters: challenge.rules.noBoosters,
            },
            runId: 'challenge-tree',
        });
        // #endregion
        p.setEducationLevel(
            eduLevel === 'erettsegi'
                ? null
                : eduLevel === 'elementary' || eduLevel === 'highschool' || eduLevel === 'university'
                  ? eduLevel
                  : null
        );
        beginPathOrWorksheetRun(questions, {
            topicId: `challenge_${challenge.id}`,
            lessonNode: null,
            sprint: true,
            blitz: false,
            erettsegi: eduLevel === 'erettsegi',
            daily: false,
            challenge,
        });
    };

    const generateErettsegiQuestionsByTopic = (topicId: string, level: string, sprint = false) => {
        const nodeRaw = p.router.query.node;
        const nodeParsed = nodeRaw != null ? parseInt(String(nodeRaw), 10) : NaN;
        const pathRequested = p.router.query.path === '1' || (Number.isFinite(nodeParsed) && nodeParsed >= 1);
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
            for (let band = 0; band < 6; band++) {
                const stage = (band + 1) as PracticeStage;
                for (let i = 0; i < 8; i++) {
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
                            stage: lessonToStage(Math.floor(i / 20) + 1) as PracticeStage,
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
            sprint: sprint || p.router.query.sprint === '1',
            erettsegi: true,
        });
    };

    const generateMixedErettsegiQuestions = (level: string) => {
        p.setIsErettsegiMode(true);

        const questions: Question[] = [];

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

        const normalizedLevel = level.toLowerCase().includes('emelt') ? 'emelt' : 'kozep';

        const questionsPerTopic = Math.floor(50 / allTopics.length);
        const remainingQuestions = 50 % allTopics.length;

        for (let i = 0; i < allTopics.length; i++) {
            const topic = allTopics[i];
            const questionsForThisTopic = questionsPerTopic + (i < remainingQuestions ? 1 : 0);

            for (let j = 0; j < questionsForThisTopic; j++) {
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

        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        setErettsegiQuestions(shuffledQuestions);

        startGeneratedRun(p, questions.length > 0);
    };

    const loadAssignedTasks = async () => {
        try {
            if (!(window as any).firebase) {
                return;
            }

            const db = (window as any).firebase.firestore();
            const snapshot = await db.collection('assignedTasks')
                .where('studentId', '==', p.currentUser?.uid || '')
                .where('topicId', '==', p.currentTopic)
                .get();

            const tasks: any[] = [];
            snapshot.forEach((doc: any) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });

            setAssignedTasks(tasks);
        } catch (error: any) {
            const msg = String(error?.message || error || '');
            if (!/permission|insufficient/i.test(msg)) {
                console.warn('Error loading assigned tasks:', msg.slice(0, 160));
            }
        }
    };

    const generateUniversityQuestion = async (
        topic: string,
        difficulty: 'könnyű' | 'közepes' | 'nehéz' = 'közepes'
    ): Promise<Question | null> => {
        try {
            setIsGeneratingQuestion(true);
            const { apiGenerateMathQuestion } = await import('../utils/apiClient');
            const res = await apiGenerateMathQuestion(topic, difficulty);
            if (!res.ok) {
                throw new Error(res.error || `API error`);
            }
            const payload = res.data;

            if (payload.success || payload.question) {
                return {
                    question: payload.question!,
                    answer: parseFloat(String(payload.answer)) || parseInt(String(payload.answer), 10) || 0,
                    type: 'multiplication',
                    expression: payload.explanation || payload.question!
                };
            } else {
                console.error('API error:', payload.error);
                return null;
            }
        } catch (error) {
            console.error('Error generating university question:', error);
            return null;
        } finally {
            setIsGeneratingQuestion(false);
        }
    };

    const generateUniversityQuestions = async () => {
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
                return fallbackUniversityQuestions;
            default:
                return elementaryQuestions;
        }
    };

    return {
        taskQuestions,
        setTaskQuestions,
        erettsegiQuestions,
        setErettsegiQuestions,
        erettsegiQuestionsRef,
        isGeneratingQuestion,
        assignedTasks,
        selectedTask,
        universityQuestions,
        loadTaskQuestions,
        generateTaskQuestions,
        generateQuestionByTopic,
        generateElementaryQuestionsByTopic,
        generateKozpontiQuestionsByTopic,
        generateKozpontiPaper,
        generateErettsegiPaper,
        generateSzigorlatQuestionsBySubject,
        generateVegyesSzigorlatQuestions,
        generateUniversityQuestionsByTopic,
        generateHighschoolQuestionsByTopic,
        beginPathOrWorksheetRun,
        startPathLessonForEducationLevel,
        startTopicMixedPractice,
        generateDailyMixedQuestions,
        generateBlitzQuestions,
        generateChallengeQuestions,
        generateErettsegiQuestionsByTopic,
        generateMixedErettsegiQuestions,
        loadAssignedTasks,
        generateUniversityQuestion,
        generateUniversityQuestions,
        getQuestionsForLevel,
        elementaryTopics,
        highschoolTopics,
        universitySubjects,
    };
}
