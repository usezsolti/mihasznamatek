import type { Question } from './types';
import { agentDebugLog } from '../agentDebugLog';
import {
    ERETTSEGI_2026_MAJ_KOZEP_COUNT,
    getErettsegi2026MajKozepQuestions,
} from './er2026MajKozepBank';
import {
    ERETTSEGI_2025_OKT_KOZEP_COUNT,
    getErettsegi2025OktKozepQuestions,
} from './er2025OktKozepBank';

export type ErettsegiMonth = 'majus' | 'oktober';
export type ErettsegiExamLevel = 'kozep' | 'emelt';

export type ErettsegiPaperMeta = {
    id: string;
    year: number;
    month: ErettsegiMonth;
    level: ErettsegiExamLevel;
    title: string;
    subtitle: string;
    ready: boolean;
    questionCount: number;
    timeLimitMin: number;
};

export const ERETTSEGI_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020] as const;

export function erettsegiPaperId(
    year: number,
    month: ErettsegiMonth,
    level: ErettsegiExamLevel
): string {
    return `er-${year}-${month === 'majus' ? 'maj' : 'okt'}-${level}`;
}

const READY: Record<string, { subtitle: string; questionCount: number }> = {
    'er-2026-maj-kozep': {
        subtitle: '2026. május 5. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2026_MAJ_KOZEP_COUNT,
    },
    'er-2025-okt-kozep': {
        subtitle: '2025. október 14. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2025_OKT_KOZEP_COUNT,
    },
};

function monthTitle(month: ErettsegiMonth): string {
    return month === 'majus' ? 'Május' : 'Október';
}

function buildPapers(): ErettsegiPaperMeta[] {
    const out: ErettsegiPaperMeta[] = [];
    for (const year of ERETTSEGI_YEARS) {
        for (const month of ['majus', 'oktober'] as ErettsegiMonth[]) {
            for (const level of ['kozep', 'emelt'] as ErettsegiExamLevel[]) {
                const id = erettsegiPaperId(year, month, level);
                const ready = READY[id];
                out.push({
                    id,
                    year,
                    month,
                    level,
                    title: monthTitle(month),
                    subtitle: ready
                        ? ready.subtitle
                        : `${monthTitle(month)} · ${level === 'kozep' ? 'középszint' : 'emelt'} · hamarosan`,
                    ready: Boolean(ready),
                    questionCount: ready ? ready.questionCount : 0,
                    timeLimitMin: 180,
                });
            }
        }
    }
    return out;
}

export const ERETTSEGI_PAPERS: ErettsegiPaperMeta[] = buildPapers();

export function getErettsegiPapersForLevel(level: ErettsegiExamLevel): ErettsegiPaperMeta[] {
    return ERETTSEGI_PAPERS.filter((p) => p.level === level);
}

export function erettsegiPapersByYear(
    level: ErettsegiExamLevel
): Array<{ year: number; papers: ErettsegiPaperMeta[] }> {
    const map = new Map<number, ErettsegiPaperMeta[]>();
    for (const p of getErettsegiPapersForLevel(level)) {
        const list = map.get(p.year) || [];
        list.push(p);
        map.set(p.year, list);
    }
    return [...map.entries()].map(([year, papers]) => ({ year, papers }));
}

export function getErettsegiPaperQuestions(paperId: string): Question[] | null {
    const id = String(paperId || '').toLowerCase();
    const is2026MajKozep =
        id === 'er-2026-maj-kozep' || id === '2026-maj-kozep' || id === 'k2613';
    const is2025OktKozep =
        id === 'er-2025-okt-kozep' || id === '2025-okt-kozep' || id === 'k2512';
    // #region agent log
    agentDebugLog({
        hypothesisId: 'H2',
        location: 'erettsegiPapers.ts:getErettsegiPaperQuestions',
        message: 'erettsegi paper lookup',
        data: { paperId: id, is2026MajKozep, is2025OktKozep },
        runId: 'er-2025-okt',
    });
    // #endregion
    if (is2026MajKozep) return getErettsegi2026MajKozepQuestions();
    if (is2025OktKozep) return getErettsegi2025OktKozepQuestions();
    return null;
}
