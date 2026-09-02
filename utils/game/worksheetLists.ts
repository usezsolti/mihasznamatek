import type { Question } from './types';
import { agentDebugLog } from '../agentDebugLog';
import { isWorksheetTopicId } from '../topicPath';
import {
    getParameterPracticeQuestions,
    getExponentialLogPracticeQuestions,
    getAbsoluteRootPracticeQuestions,
    getFunctionsPracticeQuestions,
    getProofPracticeQuestions,
    getEquationsPracticeQuestions,
    getHalmazPracticeQuestions,
    getKombinatorikaPracticeQuestions,
    getKoordinatageometriaPracticeQuestions,
    getGrafokPracticeQuestions,
    getSorozatokPracticeQuestions,
    getStatisztikaPracticeQuestions,
    getSzamelmeletPracticeQuestions,
    getSzovegesPracticeQuestions,
    getTergeometriaPracticeQuestions,
    getTrigonometriaPracticeQuestions,
    getValoszinusegPracticeQuestions,
    getEgyszerusitesPracticeQuestions,
    getErtelmezesiPracticeQuestions,
    getSikgeometriaPracticeQuestions,
    getAnalizis1PracticeQuestions,
    getAnalizis2PracticeQuestions,
    getLinearisPracticeQuestions,
} from './practiceBanks';

export const getWorksheetListForTopic = (topicId: string): { list: Question[]; prefix: string } | null => {
    const topicLower = topicId.toLowerCase();
    if (!isWorksheetTopicId(topicId)) return null;
    if (topicLower.startsWith('a1-')) {
        const list = getAnalizis1PracticeQuestions(topicId);
        if (!list) return null;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'analizis1 topic routed',
            data: {
                topicId,
                prefix: `uni_${topicLower}`,
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                firstQ: String(list[0]?.question || '').slice(0, 60),
                firstAnswer: list[0]?.answer,
                isKomplex: topicLower === 'a1-komplex',
            },
            runId: 'a1-komplex',
        });
        // #endregion
        return { list, prefix: `uni_${topicLower}` };
    }
    if (topicLower.startsWith('a2-')) {
        const list = getAnalizis2PracticeQuestions(topicId);
        if (!list) return null;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'analizis2 topic routed',
            data: {
                topicId,
                prefix: `uni_${topicLower}`,
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                firstQ: String(list[0]?.question || '').slice(0, 60),
                firstAnswer: list[0]?.answer,
            },
            runId: 'a2-topics',
        });
        // #endregion
        return { list, prefix: `uni_${topicLower}` };
    }
    if (/^la[1-4]-/.test(topicLower)) {
        const list = getLinearisPracticeQuestions(topicId);
        if (!list) return null;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'linearis algebra topic routed',
            data: {
                topicId,
                prefix: `uni_${topicLower}`,
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                firstQ: String(list[0]?.question || '').slice(0, 60),
                firstAnswer: list[0]?.answer,
                collidedEgyenletek: topicLower.includes('egyenletek'),
            },
            runId: 'la-topics',
        });
        // #endregion
        return { list, prefix: `uni_${topicLower}` };
    }
    if (topicLower.includes('parameter') || topicLower.includes('paramet')) {
        return { list: getParameterPracticeQuestions(), prefix: 'erettsegi_parameter' };
    }
    if (topicLower.includes('abszolutertek') || topicLower.includes('gyok')) {
        const list = getAbsoluteRootPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'C',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'absroot topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_absroot',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                secondQ: String(list[1]?.question || '').slice(0, 50),
                secondAnswer: list[1]?.answer,
            },
            runId: 'absroot-pdf-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_absroot' };
    }
    if (topicLower.includes('bizonyitas')) {
        const list = getProofPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'C',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'proof topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_proof',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                firstQ: String(list[0]?.question || '').slice(0, 70),
                firstAnswer: list[0]?.answer,
            },
            runId: 'proof-pdf-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_proof' };
    }
    if (topicLower.includes('egyenletek') || topicLower.includes('egyenlotlenseg')) {
        const list = getEquationsPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'E',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'equations topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_egyenletek',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                firstQ: String(list[0]?.question || '').slice(0, 50),
                firstAnswer: list[0]?.answer,
            },
            runId: 'eq-pdf-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_egyenletek' };
    }
    if (topicLower.includes('fuggveny') || topicLower.includes('analizis')) {
        const list = getFunctionsPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'C',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'functions topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_fuggvenyek',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                setCards: list.filter((q) => Array.isArray((q as { expectedSet?: string[] }).expectedSet)).length,
                firstHasStage: list[0]?.stage ?? null,
                firstQ: String(list[0]?.question || '').slice(0, 50),
            },
            runId: 'fugg-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_fuggvenyek' };
    }
    if (topicLower.includes('exponencialis') || topicLower.includes('logaritmus')) {
        const list = getExponentialLogPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'explog topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_explog',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                setCards: list.filter((q) => Array.isArray((q as { expectedSet?: string[] }).expectedSet)).length,
                firstHasStage: list[0]?.stage ?? null,
            },
            runId: 'explog-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_explog' };
    }
    if (topicLower.includes('halmaz')) {
        return { list: getHalmazPracticeQuestions(), prefix: 'erettsegi_halmazok' };
    }
    if (topicLower.includes('kombinatorika')) {
        return { list: getKombinatorikaPracticeQuestions(), prefix: 'erettsegi_kombinatorika' };
    }
    if (topicLower.includes('koordinatageometria') || topicLower.includes('koordinata')) {
        return { list: getKoordinatageometriaPracticeQuestions(), prefix: 'erettsegi_koord' };
    }
    if (topicLower.includes('logika') || topicLower.includes('grafok') || topicLower.includes('graf')) {
        return { list: getGrafokPracticeQuestions(), prefix: 'erettsegi_grafok' };
    }
    if (topicLower.includes('sorozat')) {
        const list = getSorozatokPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'sorozatok topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_sorozatok',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
                firstHasSet: Array.isArray((list[0] as { expectedSet?: string[] })?.expectedSet),
            },
            runId: 'sorozat-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_sorozatok' };
    }
    if (topicLower.includes('statisztika')) {
        const list = getStatisztikaPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'statisztika topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_statisztika',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'stat-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_statisztika' };
    }
    if (topicLower.includes('szamelmelet')) {
        const list = getSzamelmeletPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'szamelmelet topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_szamelmelet',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'nt-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_szamelmelet' };
    }
    if (topicLower.includes('szoveges')) {
        const list = getSzovegesPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'szoveges topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_szoveges',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'szov-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_szoveges' };
    }
    if (topicLower.includes('tergeometria')) {
        const list = getTergeometriaPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'tergeometria topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_tergeometria',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'ter-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_tergeometria' };
    }
    if (topicLower.includes('trigonometria')) {
        const list = getTrigonometriaPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'trigonometria topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_trigonometria',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'trig-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_trigonometria' };
    }
    if (topicLower.includes('valoszinuseg')) {
        const list = getValoszinusegPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'valoszinuseg topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_valoszinuseg',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'val-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_valoszinuseg' };
    }
    if (topicLower.includes('egyszerusites')) {
        const list = getEgyszerusitesPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'egyszerusites topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_egyszerusites',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'egys-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_egyszerusites' };
    }
    if (topicLower.includes('ertelmezesi')) {
        const list = getErtelmezesiPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'ertelmezesi topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_ertelmezesi',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'ert-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_ertelmezesi' };
    }
    if (topicLower.includes('sikgeometria')) {
        const list = getSikgeometriaPracticeQuestions();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'worksheetLists.ts:getWorksheetListForTopic',
            message: 'sikgeometria topic routed',
            data: {
                topicId,
                prefix: 'erettsegi_sikgeometria',
                total: list.length,
                stages: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            },
            runId: 'sik-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_sikgeometria' };
    }
    return null;
};
