import { getHs09LessonLabel } from './hs09Lessons';
import { getHs10LessonLabel } from './hs10Lessons';
import { getHs11LessonLabel } from './hs11Lessons';
import { getHs12LessonLabel } from './hs12Lessons';

/** hs09-kombi, hs10-quad, hs11-coord, hs12-seq → 9–12. */
export function textbookGradeFromTopicId(topicId: string): number | null {
    const m = topicId.toLowerCase().match(/^hs(\d{2})-/);
    if (!m) return null;
    const g = parseInt(m[1], 10);
    return g >= 9 && g <= 12 ? g : null;
}

export function isHsTextbookTopicId(topicId: string): boolean {
    return textbookGradeFromTopicId(topicId) != null;
}

export function hsTextbookRunId(topicId: string): string {
    const g = textbookGradeFromTopicId(topicId);
    return g ? `hs${String(g).padStart(2, '0')}-oh` : 'hs-oh';
}

export function getHsTextbookLessonLabel(topicId: string, lesson: number): string | null {
    return (
        getHs09LessonLabel(topicId, lesson) ||
        getHs10LessonLabel(topicId, lesson) ||
        getHs11LessonLabel(topicId, lesson) ||
        getHs12LessonLabel(topicId, lesson)
    );
}

