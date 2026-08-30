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
    return null;
};
