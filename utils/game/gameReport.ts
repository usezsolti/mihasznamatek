import type { PaperQuestionStat, PaperRunSummary } from './paperRun';
import { catalogTopicTitle } from './paperTopicTags';
import {
    elementaryTopics,
    erettsegiEmeltTopics,
    erettsegiKozepTopics,
    highschoolGrade09Topics,
    highschoolGrade10Topics,
    highschoolGrade11Topics,
    highschoolGrade12Topics,
    highschoolTopics,
    universitySubjects,
} from '../mathTopicsCatalog';

export type GameReportOutcome = 'first' | 'later' | 'missed' | 'skipped';

export type GameReportTask = {
    id: string;
    label: string;
    topicTitle: string;
    outcome: GameReportOutcome;
    detail: string;
};

export type GameReportTopic = {
    title: string;
    correct: number;
    total: number;
};

export type GameReport = {
    title: string;
    dateLabel: string;
    fileDate: string;
    percent: number;
    solved: number;
    total: number;
    firstTryCorrect: number;
    wrongAtLeastOnce: number;
    topics: GameReportTopic[];
    tasks: GameReportTask[];
};

export type SessionTaskOutcome = 'unseen' | 'first' | 'later' | 'missed';

export type SessionTask = {
    id: string;
    label: string;
    topicTitle: string;
    outcome: SessionTaskOutcome;
};

const TOPIC_TITLES = new Map<string, string>();
for (const topic of [
    ...elementaryTopics,
    ...highschoolTopics,
    ...highschoolGrade09Topics,
    ...highschoolGrade10Topics,
    ...highschoolGrade11Topics,
    ...highschoolGrade12Topics,
    ...erettsegiKozepTopics,
    ...erettsegiEmeltTopics,
    ...universitySubjects,
]) {
    TOPIC_TITLES.set(topic.id, topic.title);
}

export function displayTopicTitle(topicId: string): string {
    const id = String(topicId || '').trim();
    if (!id) return 'Játék';
    const exam = catalogTopicTitle(id);
    if (exam !== id) return exam;
    return TOPIC_TITLES.get(id) || id;
}

export function formatReportDate(date: Date): string {
    return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

export function reportFileStamp(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

export function reportFileName(dateStamp: string): string {
    return `mihaszna-jelentes-${dateStamp}.pdf`;
}

export function outcomeDetail(
    outcome: GameReportOutcome,
    attempts?: number
): string {
    if (outcome === 'first') {
        return attempts ? `${attempts} próbálkozás · elsőre helyes` : 'elsőre helyes';
    }
    if (outcome === 'later') {
        return attempts ? `${attempts}. próbálkozásra sikerült` : 'később sikerült';
    }
    if (outcome === 'skipped') return 'nem került sorra';
    return 'nem sikerült';
}

function topicsFromTasks(tasks: GameReportTask[]): GameReportTopic[] {
    const topics = new Map<string, GameReportTopic>();
    for (const task of tasks) {
        const title = task.topicTitle || 'Gyakorlás';
        const prev = topics.get(title) || { title, correct: 0, total: 0 };
        prev.total += 1;
        if (task.outcome === 'first' || task.outcome === 'later') prev.correct += 1;
        topics.set(title, prev);
    }
    return Array.from(topics.values()).sort(
        (a, b) => (b.total - b.correct) - (a.total - a.correct) || a.title.localeCompare(b.title, 'hu')
    );
}

function finishReport(
    title: string,
    tasks: GameReportTask[],
    now: Date
): GameReport {
    const total = tasks.length;
    const solved = tasks.filter((task) => task.outcome === 'first' || task.outcome === 'later').length;
    return {
        title: title || 'Játék',
        dateLabel: formatReportDate(now),
        fileDate: reportFileStamp(now),
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
        solved,
        total,
        firstTryCorrect: tasks.filter((task) => task.outcome === 'first').length,
        wrongAtLeastOnce: tasks.filter((task) => task.outcome === 'later' || task.outcome === 'missed').length,
        topics: topicsFromTasks(tasks),
        tasks,
    };
}

function paperOutcome(row: PaperQuestionStat): GameReportOutcome {
    if (row.firstAttemptCorrect) return 'first';
    if (row.solved) return 'later';
    if (row.attempts === 0) return 'skipped';
    return 'missed';
}

export function reportFromPaper(
    summary: PaperRunSummary,
    title: string,
    now = new Date()
): GameReport {
    const tasks = summary.history.map((row) => {
        const outcome = paperOutcome(row);
        return {
            id: row.questionId,
            label: row.label,
            topicTitle: row.topicTitle,
            outcome,
            detail: outcomeDetail(outcome, row.attempts),
        };
    });
    return finishReport(title, tasks, now);
}

export function reportFromSession(
    title: string,
    tasks: SessionTask[],
    now = new Date()
): GameReport {
    const rows = tasks.map((task) => {
        const outcome: GameReportOutcome = task.outcome === 'unseen' ? 'skipped' : task.outcome;
        return {
            id: task.id,
            label: task.label,
            topicTitle: task.topicTitle,
            outcome,
            detail: outcomeDetail(outcome),
        };
    });
    return finishReport(title, rows, now);
}

export function taskOrigin(questionId: string, questionText: string, index: number): string {
    const raw = String(questionId || questionText || `idx_${index}`);
    return raw.replace(/_r[a-z0-9]+$/i, '');
}
