import type { Question } from './types';
import { isWorksheetTopicId } from '../topicPath';
import {
    getParameterPracticeQuestions,
    getExponentialLogPracticeQuestions,
    getAbsoluteRootPracticeQuestions,
    getFunctionsPracticeQuestions,
    getProofPracticeQuestions,
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
