export const LESSON_GOAL_IDS = [
    'dolgozat',
    'erettsegi',
    'potvizsga',
    'felveteli',
    'verseny',
    'megertes',
    'gyakorlas',
    'other',
] as const;

export type LessonGoalId = (typeof LESSON_GOAL_IDS)[number];

export function isLessonGoalId(value: string): value is LessonGoalId {
    return (LESSON_GOAL_IDS as readonly string[]).includes(value);
}
