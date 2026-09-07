import { getHs09LessonLabel } from './hs09Lessons';
import { getHs11LessonLabel } from './hs11Lessons';

/** hs09-trig, hs11-coord … → 9 / 11, különben null. */
export function textbookGradeFromTopicId(topicId: string): number | null {
    const m = topicId.toLowerCase().match(/^hs(\d{2})-/);
    if (!m) return null;
    const g = parseInt(m[1], 10);
    return g >= 9 && g <= 12 ? g : null;
}

export function isHsTextbookTopicId(topicId: string): boolean {
    return textbookGradeFromTopicId(topicId) != null;
}

export function getHsTextbookLessonLabel(topicId: string, lesson: number): string | null {
    return getHs09LessonLabel(topicId, lesson) || getHs11LessonLabel(topicId, lesson);
}
