import type { PracticeStage } from '../practiceProgress';
import type { Question } from './types';

export type LaRow =
    | [PracticeStage, string, number, string]
    | [PracticeStage, string, number, string, string[]];

export function yn(text: string): string {
    return `${text}\n(1 = igen, 0 = nem)`;
}

export function laCard(
    stage: PracticeStage,
    question: string,
    answer: number,
    expression: string
): Question {
    return { stage, question, answer, type: 'multiplication', expression };
}

export function laBank(rows: LaRow[]): Question[] {
    return rows.map((r) => laCard(r[0], r[1], r[2], r[3]));
}

export function assertSixByTwenty(topicId: string, list: Question[]): void {
    const stages = [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length);
    if (list.length !== 120 || stages.some((n) => n !== 20)) {
        throw new Error(`${topicId}: ${list.length} cards stages=${stages.join(',')}`);
    }
}

export function det2(a: number, b: number, c: number, d: number): number {
    return a * d - b * c;
}
