import type { Question } from './types';
import { getHs09PracticeQuestions } from './hs09Levels';
import { getHs10PracticeQuestions } from './hs10Levels';
import { getHs11PracticeQuestions } from './hs11Levels';
import { getHs12PracticeQuestions } from './hs12Levels';

export function getHsTextbookPracticeQuestions(topicId: string): Question[] | null {
    const id = topicId.toLowerCase();
    if (id.startsWith('hs09-')) return getHs09PracticeQuestions(id);
    if (id.startsWith('hs10-')) return getHs10PracticeQuestions(id);
    if (id.startsWith('hs11-')) return getHs11PracticeQuestions(id);
    if (id.startsWith('hs12-')) return getHs12PracticeQuestions(id);
    return null;
}
