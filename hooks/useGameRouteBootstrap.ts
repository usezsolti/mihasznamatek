import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import type { NextRouter } from 'next/router';
import {
    loadUserPracticeProgress,
    resolveProgressStorageKey,
} from '../utils/practiceProgress';
import { isLessonUnlocked } from '../utils/topicPath';
import { type EducationLevelId } from '../utils/mathTopicsCatalog';
import { buildTopicPracticeHref } from '../utils/topicStats';
import type { GameEducationLevel } from './useGameSessionBuilders';

type PracticeEducationLevel = Exclude<GameEducationLevel, null>;

export type UseGameRouteBootstrapParams = {
    router: NextRouter;
    gameActive: boolean;
    setEducationLevel: Dispatch<SetStateAction<GameEducationLevel>>;
    setCurrentTopic: Dispatch<SetStateAction<string>>;
    setSelectedGrade: Dispatch<SetStateAction<number | null>>;
    setSelectedElementaryTopic: Dispatch<SetStateAction<string | null>>;
    setSelectedHighschoolGrade: Dispatch<SetStateAction<number | null>>;
    setSelectedHighschoolTopic: Dispatch<SetStateAction<string | null>>;
    setSelectedUniversitySubject: Dispatch<SetStateAction<string | null>>;
    setSelectedUniversityTopic: Dispatch<SetStateAction<string | null>>;
    generateDailyMixedQuestions: (eduLevel: EducationLevelId, grade: number) => void;
    startPathLessonForEducationLevel: (
        eduLevel: PracticeEducationLevel,
        topicId: string,
        grade: number,
        sprint?: boolean
    ) => void;
    generateElementaryQuestionsByTopic: (topicId: string, grade: number) => void;
    generateHighschoolQuestionsByTopic: (topicId: string, grade: number) => void;
    generateUniversityQuestionsByTopic: (subjectId: string, topicId: string) => void;
    generateErettsegiQuestionsByTopic: (topicId: string, level: string, sprint?: boolean) => void;
    generateMixedErettsegiQuestions: (level: string) => void;
    generateKozpontiQuestionsByTopic: (topicId: string) => void;
    generateVegyesSzigorlatQuestions: () => void;
    generateSzigorlatQuestionsBySubject: (subjectId: string) => void;
    loadTaskQuestions: (taskId: string) => void | Promise<void>;
    loadAssignedTasks: () => void | Promise<void>;
};

/**
 * Client flag + URL-query bootstrap: start modes from router, load assigned tasks.
 * Picker UI state stays on the page so this hook does not own the whole game shell.
 */
export function useGameRouteBootstrap({
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
    startPathLessonForEducationLevel,
    generateElementaryQuestionsByTopic,
    generateHighschoolQuestionsByTopic,
    generateUniversityQuestionsByTopic,
    generateErettsegiQuestionsByTopic,
    generateMixedErettsegiQuestions,
    generateKozpontiQuestionsByTopic,
    generateVegyesSzigorlatQuestions,
    generateSzigorlatQuestionsBySubject,
    loadTaskQuestions,
    loadAssignedTasks,
}: UseGameRouteBootstrapParams) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

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
                            const { getSession } = await import('next-auth/react');
                            const session = await getSession();
                            const uid = String((session?.user as { id?: string } | undefined)?.id || '') || null;
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
                        const { getSession } = await import('next-auth/react');
                        const session = await getSession();
                        const uid = String((session?.user as { id?: string } | undefined)?.id || '') || null;
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

    return { isClient };
}
