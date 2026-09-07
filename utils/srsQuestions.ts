import type { Question } from './game/types';
import {
    generateElementaryQuestionByTopic,
    generateErettsegiQuestionByTopicId,
    generateHighschoolQuestionByTopic,
    generateUniversityQuestionByTopic,
    getWorksheetListForTopic,
} from './game';
import type { PracticeStage } from './practiceProgress';
import type { SrsCard, SrsEducationLevel } from './srs';

function stamp(q: Question, topicId: string, stage: PracticeStage): Question {
    return {
        ...q,
        id: `srs|${topicId}|${stage}|${Math.random().toString(36).slice(2, 8)}`,
        stage,
        srsTopicId: topicId,
        srsStage: stage,
    };
}

export function generateSkillQuestion(
    topicId: string,
    stage: PracticeStage,
    educationLevel: SrsEducationLevel,
    grade = 10
): Question | null {
    const ws = getWorksheetListForTopic(topicId);
    if (ws?.list?.length) {
        const pool = ws.list.filter((q) => q.stage === stage);
        const src = (pool.length ? pool : ws.list)[Math.floor(Math.random() * (pool.length || ws.list.length))];
        return stamp(src, topicId, stage);
    }

    const difficulty = Math.min(4, Math.max(0, stage - 1));
    let q: Question | null = null;
    if (educationLevel === 'elementary') {
        q = generateElementaryQuestionByTopic(topicId, grade || 5, difficulty);
    } else if (educationLevel === 'highschool') {
        q = generateHighschoolQuestionByTopic(topicId, grade || 10, difficulty);
    } else if (educationLevel === 'university') {
        q = generateUniversityQuestionByTopic(topicId, topicId);
    } else {
        q = generateErettsegiQuestionByTopicId(topicId, 'emelt');
    }
    return q ? stamp(q, topicId, stage) : null;
}

export function generateSkillQuestionFromCard(card: SrsCard, grade = 10): Question | null {
    return generateSkillQuestion(card.topicId, card.stage, card.educationLevel, grade);
}
