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
} from './practiceBanks';

export const getWorksheetListForTopic = (topicId: string): { list: Question[]; prefix: string } | null => {
    const topicLower = topicId.toLowerCase();
    if (!isWorksheetTopicId(topicId)) return null;
    if (topicLower.includes('parameter') || topicLower.includes('paramet')) {
        return { list: getParameterPracticeQuestions(), prefix: 'erettsegi_parameter' };
    }
    if (topicLower.includes('abszolutertek') || topicLower.includes('gyok')) {
        return { list: getAbsoluteRootPracticeQuestions(), prefix: 'erettsegi_absroot' };
    }
    if (topicLower.includes('bizonyitas')) {
        return { list: getProofPracticeQuestions(), prefix: 'erettsegi_proof' };
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
                firstStage: list[0]?.stage ?? null,
                usesProof: false,
            },
            runId: 'eq-120',
        });
        // #endregion
        return { list, prefix: 'erettsegi_egyenletek' };
    }
    if (topicLower.includes('fuggveny') || topicLower.includes('analizis')) {
        return { list: getFunctionsPracticeQuestions(), prefix: 'erettsegi_fuggvenyek' };
    }
    if (topicLower.includes('exponencialis') || topicLower.includes('logaritmus')) {
        return { list: getExponentialLogPracticeQuestions(), prefix: 'erettsegi_explog' };
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
    return null;
};
