import type { Question } from './game/types';
import {
    applyPaperTopicTags,
    catalogTopicTitle,
    inferPaperTopic,
    resolveQuestionTopicId,
    type PaperTopicKind,
} from './game/paperTopicTags';

export type TopicBreakdownRow = {
    title: string;
    correct: number;
    wrong: number;
};

export type TopicBreakdown = Record<string, TopicBreakdownRow>;

export function parseTopicBreakdown(raw: unknown): TopicBreakdown | undefined {
    if (!raw || typeof raw !== 'object') return undefined;
    const out: TopicBreakdown = {};
    for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
        const row = val as { title?: string; correct?: number; wrong?: number } | null;
        out[key] = {
            title: String(row?.title || key),
            correct: Number(row?.correct) || 0,
            wrong: Number(row?.wrong) || 0,
        };
    }
    return Object.keys(out).length ? out : undefined;
}

export type ExamTopicGauge = {
    topicId: string;
    title: string;
    correct: number;
    wrong: number;
    total: number;
    percent: number;
};

export function buildTopicBreakdown(
    questions: Array<Pick<Question, 'id' | 'catalogTopicId' | 'srsTopicId' | 'question' | 'expression'>>,
    correctIds: string[],
    wrongIds: string[],
    kind: PaperTopicKind
): TopicBreakdown {
    const correctSet = new Set(correctIds.filter(Boolean));
    const wrongSet = new Set(wrongIds.filter(Boolean));
    const out: TopicBreakdown = {};

    questions.forEach((q, index) => {
        const qid = String(q.id || `q-${index}`);
        const topicId = resolveQuestionTopicId(q, kind);
        const row = out[topicId] || {
            title: catalogTopicTitle(topicId),
            correct: 0,
            wrong: 0,
        };
        if (correctSet.has(qid)) row.correct += 1;
        else row.wrong += 1;
        out[topicId] = row;
        void wrongSet;
    });

    return out;
}

export function gaugesFromBreakdown(breakdown: TopicBreakdown | null | undefined): ExamTopicGauge[] {
    if (!breakdown) return [];
    return Object.entries(breakdown)
        .map(([topicId, row]) => {
            const correct = Number(row.correct) || 0;
            const wrong = Number(row.wrong) || 0;
            const total = correct + wrong;
            return {
                topicId,
                title: row.title || catalogTopicTitle(topicId),
                correct,
                wrong,
                total,
                percent: total > 0 ? Math.round((correct / total) * 100) : 0,
            };
        })
        .filter((g) => g.total > 0)
        .sort((a, b) => a.percent - b.percent || b.wrong - a.wrong || a.title.localeCompare(b.title, 'hu'));
}

export function mergeTopicBreakdowns(rows: Array<TopicBreakdown | null | undefined>): TopicBreakdown {
    const out: TopicBreakdown = {};
    for (const breakdown of rows) {
        if (!breakdown) continue;
        for (const [topicId, row] of Object.entries(breakdown)) {
            const prev = out[topicId] || {
                title: row.title || catalogTopicTitle(topicId),
                correct: 0,
                wrong: 0,
            };
            prev.correct += Number(row.correct) || 0;
            prev.wrong += Number(row.wrong) || 0;
            if (!prev.title) prev.title = row.title || catalogTopicTitle(topicId);
            out[topicId] = prev;
        }
    }
    return out;
}

export function isExamPaperResult(result: {
    gameMode?: string;
    educationLevel?: string;
    paperId?: string;
    topicBreakdown?: TopicBreakdown;
}): boolean {
    const mode = String(result.gameMode || result.educationLevel || '').toLowerCase();
    return Boolean(result.paperId) || mode === 'erettsegi' || mode === 'kozponti';
}

export function aggregateExamTopicGauges(
    results: Array<{
        gameMode?: string;
        educationLevel?: string;
        paperId?: string;
        topicBreakdown?: TopicBreakdown;
    }>
): ExamTopicGauge[] {
    const parts = results.filter(isExamPaperResult).map((r) => r.topicBreakdown);
    return gaugesFromBreakdown(mergeTopicBreakdowns(parts));
}

export { applyPaperTopicTags, inferPaperTopic, catalogTopicTitle, resolveQuestionTopicId };
export type { PaperTopicKind };
