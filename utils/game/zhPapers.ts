import type { Question } from './types';
import { getZhAnalizis1MintaBQuestions } from './zhAnalizis1MintaB';

export type ZhPaperMeta = {
    id: string;
    subjectId: string;
    title: string;
    subtitle: string;
    ready: boolean;
    points: number;
    questionCount: number;
};

const BANKS: Record<string, () => Question[]> = {
    'zh-a1-minta-b': getZhAnalizis1MintaBQuestions,
};

export const ZH_PAPERS: ZhPaperMeta[] = [
    {
        id: 'zh-a1-minta-b',
        subjectId: 'zh-analizis1',
        title: 'Minta-ZH — B változat',
        subtitle: 'Halmazok, sorozatok és függvények',
        ready: true,
        points: 50,
        questionCount: getZhAnalizis1MintaBQuestions().length,
    },
];

export function getZhPaperById(paperId: string): ZhPaperMeta | undefined {
    const id = String(paperId || '').toLowerCase();
    return ZH_PAPERS.find((paper) => paper.id === id);
}

export function getZhPaperQuestions(paperId: string): Question[] | null {
    const bank = BANKS[String(paperId || '').toLowerCase()];
    if (!bank) return null;
    const list = bank();
    return list.length ? list : null;
}

export function isZhPaperId(paperId: string): boolean {
    return Boolean(getZhPaperById(paperId));
}
