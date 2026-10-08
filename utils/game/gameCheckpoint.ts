import type { SessionTask } from './gameReport';

export type GameCheckpoint = {
    version: 1;
    savedAt: number;
    label: string;
    paperId: string;
    questionIndex: number;
    score: number;
    level: number;
    lives: number;
    runMaxLives: number;
    correctIds: string[];
    wrongIds: string[];
    sessionTasks: SessionTask[];
    questionIds: string[];
    streak: number;
    sessionXp: number;
    href?: string;
};

const KEY_PREFIX = 'mz-game-checkpoint:';

function storageKey(uid: string): string {
    return `${KEY_PREFIX}${uid || 'local'}`;
}

export function saveGameCheckpoint(uid: string, checkpoint: GameCheckpoint): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(storageKey(uid), JSON.stringify(checkpoint));
    } catch {
        /* a menet enélkül is megy tovább a memóriában */
    }
}

export function loadGameCheckpoint(uid: string): GameCheckpoint | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(storageKey(uid));
        if (!raw) return null;
        const parsed = JSON.parse(raw) as GameCheckpoint;
        if (parsed?.version !== 1 || !Array.isArray(parsed.questionIds)) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function clearGameCheckpoint(uid: string): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem(storageKey(uid));
    } catch {
        /* ignore */
    }
}

export function checkpointMatchesQuestions(checkpoint: GameCheckpoint, questionIds: string[]): boolean {
    if (!checkpoint.questionIds.length || checkpoint.questionIds.length !== questionIds.length) return false;
    return checkpoint.questionIds.every((id, index) => id === questionIds[index]);
}

export function orderedQuestionsForCheckpoint<T extends { id?: string }>(
    checkpoint: GameCheckpoint,
    questions: T[],
): T[] | null {
    const ids = questions.map((question, index) => String(question.id || `idx_${index}`));
    if (checkpointMatchesQuestions(checkpoint, ids)) return questions;
    if (checkpoint.questionIds.length !== ids.length) return null;
    const byId = new Map(questions.map((question, index) => [String(question.id || `idx_${index}`), question]));
    const ordered: T[] = [];
    for (const id of checkpoint.questionIds) {
        const question = byId.get(id);
        if (!question) return null;
        ordered.push(question);
    }
    return ordered;
}
