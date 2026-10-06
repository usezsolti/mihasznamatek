import type { Question } from './types';
import {
    catalogTopicTitle,
    resolveQuestionTopicId,
    type PaperTopicKind,
} from './paperTopicTags';

export type PaperQuestionStat = {
    questionId: string;
    index: number;
    label: string;
    topicId: string;
    topicTitle: string;
    questionRef: string;
    paperId: string;
    firstAttemptCorrect: boolean | null;
    attempts: number;
    wrongAttempts: number;
    correctAttempts: number;
    solved: boolean;
    firstSeenAt: number | null;
    firstAttemptAt: number | null;
    solvedCorrectAt: number | null;
    retryCount: number;
    timeSpentMs: number;
};

export type PaperRunPhase = 'first' | 'summary' | 'retry';

export type PaperRunState = {
    version: 1;
    paperId: string;
    runId: string;
    kind: PaperTopicKind;
    order: string[];
    queue: string[];
    cursor: number;
    phase: PaperRunPhase;
    stats: Record<string, PaperQuestionStat>;
    presentedAt: number | null;
    startedAt: number;
    updatedAt: number;
    resultsSavedAt?: number | null;
};

export type PaperTopicProgress = {
    topicId: string;
    title: string;
    correct: number;
    total: number;
    missing: number;
};

export type PaperRetryItem = {
    questionId: string;
    label: string;
    topicTitle: string;
};

export type PaperRunSummary = {
    percent: number;
    total: number;
    attempted: number;
    solved: number;
    firstTryCorrect: number;
    wrongAtLeastOnce: number;
    retryLeft: number;
    complete: boolean;
    retryItems: PaperRetryItem[];
    topics: PaperTopicProgress[];
    history: PaperQuestionStat[];
};

export function questionKey(question: Question, index: number): string {
    return String(question.id || `idx_${index}`);
}

export function taskLabel(question: string, index: number): string {
    const match = String(question || '').match(/^\d{4}\/(\d+(?:\.[a-z])?\)?)/i);
    if (!match) return `${index}. feladat`;
    const num = match[1];
    if (num.includes('.') || num.includes(')')) return `${num} feladat`;
    return `${num}. feladat`;
}

function questionRef(question: string): string {
    const body = String(question || '')
        .replace(/^\d{4}\/\d+\.?(?:[a-z]\)?)?\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();
    return body.slice(0, 160);
}

export function createPaperRun(
    paperId: string,
    questions: Question[],
    kind: PaperTopicKind,
    now = Date.now()
): PaperRunState {
    const order: string[] = [];
    const stats: Record<string, PaperQuestionStat> = {};
    questions.forEach((question, index) => {
        const questionId = questionKey(question, index);
        order.push(questionId);
        const topicId = resolveQuestionTopicId(question, kind);
        const position = index + 1;
        stats[questionId] = {
            questionId,
            index: position,
            label: taskLabel(question.question || '', position),
            topicId,
            topicTitle: catalogTopicTitle(topicId),
            questionRef: questionRef(question.question || ''),
            paperId,
            firstAttemptCorrect: null,
            attempts: 0,
            wrongAttempts: 0,
            correctAttempts: 0,
            solved: false,
            firstSeenAt: index === 0 ? now : null,
            firstAttemptAt: null,
            solvedCorrectAt: null,
            retryCount: 0,
            timeSpentMs: 0,
        };
    });
    return {
        version: 1,
        paperId,
        runId: `run_${now.toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        kind,
        order,
        queue: order.slice(),
        cursor: 0,
        phase: 'first',
        stats,
        presentedAt: order.length ? now : null,
        startedAt: now,
        updatedAt: now,
    };
}

export function recordPaperAnswer(
    state: PaperRunState,
    questionId: string,
    correct: boolean,
    now = Date.now()
): PaperRunState {
    const current = state.stats[questionId];
    if (!current || state.phase === 'summary') return state;
    const elapsed = state.presentedAt != null ? Math.max(0, now - state.presentedAt) : 0;
    const attempts = current.attempts + 1;
    const nextStat: PaperQuestionStat = {
        ...current,
        attempts,
        wrongAttempts: current.wrongAttempts + (correct ? 0 : 1),
        correctAttempts: current.correctAttempts + (correct ? 1 : 0),
        solved: current.solved || correct,
        firstAttemptCorrect: current.attempts === 0 ? correct : current.firstAttemptCorrect,
        firstSeenAt: current.firstSeenAt ?? state.presentedAt ?? now,
        firstAttemptAt: current.firstAttemptAt ?? now,
        solvedCorrectAt: correct && current.solvedCorrectAt == null ? now : current.solvedCorrectAt,
        retryCount: Math.max(0, attempts - 1),
        timeSpentMs: current.timeSpentMs + elapsed,
    };
    const stats = { ...state.stats, [questionId]: nextStat };
    const atEnd = state.cursor >= state.queue.length - 1;
    if (atEnd) {
        return {
            ...state,
            stats,
            phase: 'summary',
            presentedAt: null,
            updatedAt: now,
        };
    }
    const nextId = state.queue[state.cursor + 1];
    const nextSeen = nextId && stats[nextId] && stats[nextId].firstSeenAt == null
        ? { ...stats, [nextId]: { ...stats[nextId], firstSeenAt: now } }
        : stats;
    return {
        ...state,
        stats: nextSeen,
        cursor: state.cursor + 1,
        presentedAt: now,
        updatedAt: now,
    };
}

export function beginRetryRound(state: PaperRunState, now = Date.now()): PaperRunState {
    const left = state.order.filter((id) => !state.stats[id]?.solved);
    if (left.length === 0) {
        return { ...state, phase: 'summary', queue: [], cursor: 0, presentedAt: null, updatedAt: now };
    }
    const stats = { ...state.stats };
    const first = left[0];
    if (stats[first] && stats[first].firstSeenAt == null) {
        stats[first] = { ...stats[first], firstSeenAt: now };
    }
    return {
        ...state,
        stats,
        phase: 'retry',
        queue: left,
        cursor: 0,
        presentedAt: now,
        updatedAt: now,
    };
}

export function summarizePaperRun(state: PaperRunState): PaperRunSummary {
    const history = state.order
        .map((id) => state.stats[id])
        .filter((row): row is PaperQuestionStat => Boolean(row));
    const total = history.length;
    const solved = history.filter((row) => row.solved).length;
    const attempted = history.filter((row) => row.attempts > 0).length;
    const firstTryCorrect = history.filter((row) => row.firstAttemptCorrect === true).length;
    const wrongAtLeastOnce = history.filter((row) => row.wrongAttempts > 0).length;
    const retryItems = history
        .filter((row) => !row.solved)
        .map((row) => ({
            questionId: row.questionId,
            label: row.label,
            topicTitle: row.topicTitle,
        }));
    const topics = new Map<string, PaperTopicProgress>();
    for (const row of history) {
        const prev = topics.get(row.topicId) || {
            topicId: row.topicId,
            title: row.topicTitle,
            correct: 0,
            total: 0,
            missing: 0,
        };
        prev.total += 1;
        if (row.solved) prev.correct += 1;
        else prev.missing += 1;
        topics.set(row.topicId, prev);
    }
    return {
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
        total,
        attempted,
        solved,
        firstTryCorrect,
        wrongAtLeastOnce,
        retryLeft: retryItems.length,
        complete: total > 0 && solved === total,
        retryItems,
        topics: Array.from(topics.values()).sort(
            (a, b) => b.missing - a.missing || a.title.localeCompare(b.title, 'hu')
        ),
        history,
    };
}

export function paperQuestionsMatch(state: PaperRunState, questions: Question[]): boolean {
    if (state.order.length !== questions.length) return false;
    return state.order.every((id, index) => id === questionKey(questions[index], index));
}

export function paperRunStorageKey(uid: string, paperId: string): string {
    return `mz-paper-run:${uid}:${paperId}`;
}

export function savePaperRun(uid: string, state: PaperRunState): void {
    if (typeof window === 'undefined' || !uid || !state.paperId) return;
    try {
        window.localStorage.setItem(paperRunStorageKey(uid, state.paperId), JSON.stringify(state));
    } catch {
        /* a feladatsor enélkül is megy tovább a memóriában */
    }
}

export function loadPaperRun(uid: string, paperId: string): PaperRunState | null {
    if (typeof window === 'undefined' || !uid || !paperId) return null;
    try {
        const raw = window.localStorage.getItem(paperRunStorageKey(uid, paperId));
        if (!raw) return null;
        const parsed = JSON.parse(raw) as PaperRunState;
        if (parsed?.version !== 1 || parsed.paperId !== paperId || !parsed.stats) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function clearPaperRun(uid: string, paperId: string): void {
    if (typeof window === 'undefined' || !uid || !paperId) return;
    try {
        window.localStorage.removeItem(paperRunStorageKey(uid, paperId));
    } catch {
        /* ignore */
    }
}
