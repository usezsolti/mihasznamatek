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
import {
    ERETTSEGI_2025_MAJ_KOZEP_COUNT,
    getErettsegi2025MajKozepQuestions,
} from './er2025MajKozepBank';
import {
    ERETTSEGI_2024_OKT_KOZEP_COUNT,
    getErettsegi2024OktKozepQuestions,
} from './er2024OktKozepBank';
import {
    ERETTSEGI_2024_MAJ_KOZEP_COUNT,
    getErettsegi2024MajKozepQuestions,
} from './er2024MajKozepBank';
import {
    ERETTSEGI_2023_OKT_KOZEP_COUNT,
    getErettsegi2023OktKozepQuestions,
} from './er2023OktKozepBank';
import {
    ERETTSEGI_2023_MAJ_KOZEP_COUNT,
    getErettsegi2023MajKozepQuestions,
} from './er2023MajKozepBank';
import {
    ERETTSEGI_2022_OKT_KOZEP_COUNT,
    getErettsegi2022OktKozepQuestions,
} from './er2022OktKozepBank';
import {
    ERETTSEGI_2022_MAJ_KOZEP_COUNT,
    getErettsegi2022MajKozepQuestions,
} from './er2022MajKozepBank';
import {
    ERETTSEGI_2021_OKT_KOZEP_COUNT,
    getErettsegi2021OktKozepQuestions,
} from './er2021OktKozepBank';
import {
    ERETTSEGI_2021_MAJ_KOZEP_COUNT,
    getErettsegi2021MajKozepQuestions,
} from './er2021MajKozepBank';
import {
    ERETTSEGI_2020_OKT_KOZEP_COUNT,
    getErettsegi2020OktKozepQuestions,
} from './er2020OktKozepBank';
import {
    ERETTSEGI_2020_MAJ_KOZEP_COUNT,
    getErettsegi2020MajKozepQuestions,
} from './er2020MajKozepBank';

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
    'er-2025-maj-kozep': {
        subtitle: '2025. május 6. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2025_MAJ_KOZEP_COUNT,
    },
    'er-2024-okt-kozep': {
        subtitle: '2024. október 15. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2024_OKT_KOZEP_COUNT,
    },
    'er-2024-maj-kozep': {
        subtitle: '2024. május 7. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2024_MAJ_KOZEP_COUNT,
    },
    'er-2023-okt-kozep': {
        subtitle: '2023. október 17. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2023_OKT_KOZEP_COUNT,
    },
    'er-2023-maj-kozep': {
        subtitle: '2023. május 9. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2023_MAJ_KOZEP_COUNT,
    },
    'er-2022-okt-kozep': {
        subtitle: '2022. október 18. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2022_OKT_KOZEP_COUNT,
    },
    'er-2022-maj-kozep': {
        subtitle: '2022. május 3. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2022_MAJ_KOZEP_COUNT,
    },
    'er-2021-okt-kozep': {
        subtitle: '2021. október 19. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2021_OKT_KOZEP_COUNT,
    },
    'er-2021-maj-kozep': {
        subtitle: '2021. május 4. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2021_MAJ_KOZEP_COUNT,
    },
    'er-2020-okt-kozep': {
        subtitle: '2020. október 20. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2020_OKT_KOZEP_COUNT,
    },
    'er-2020-maj-kozep': {
        subtitle: '2020. május 5. · 180 perc · OH hivatalos középszint',
        questionCount: ERETTSEGI_2020_MAJ_KOZEP_COUNT,
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
    const is2025MajKozep =
        id === 'er-2025-maj-kozep' || id === '2025-maj-kozep' || id === 'k2511';
    const is2024OktKozep =
        id === 'er-2024-okt-kozep' || id === '2024-okt-kozep' || id === 'k2413';
    const is2024MajKozep =
        id === 'er-2024-maj-kozep' || id === '2024-maj-kozep' || id === 'k2414';
    const is2023OktKozep =
        id === 'er-2023-okt-kozep' || id === '2023-okt-kozep' || id === 'k2313';
    const is2023MajKozep =
        id === 'er-2023-maj-kozep' || id === '2023-maj-kozep' || id === 'k2312';
    const is2022OktKozep =
        id === 'er-2022-okt-kozep' || id === '2022-okt-kozep' || id === 'k2211';
    const is2022MajKozep =
        id === 'er-2022-maj-kozep' || id === '2022-maj-kozep' || id === 'k2212';
    const is2021OktKozep =
        id === 'er-2021-okt-kozep' || id === '2021-okt-kozep' || id === 'k2113';
    const is2021MajKozep =
        id === 'er-2021-maj-kozep' || id === '2021-maj-kozep' || id === 'k2112';
    const is2020OktKozep =
        id === 'er-2020-okt-kozep' || id === '2020-okt-kozep' || id === 'k2012';
    const is2020MajKozep =
        id === 'er-2020-maj-kozep' || id === '2020-maj-kozep' || id === 'k2011';
    // #region agent log
    agentDebugLog({
        hypothesisId: 'H20',
        location: 'erettsegiPapers.ts:getErettsegiPaperQuestions',
        message: 'erettsegi paper lookup',
        data: {
            paperId: id,
            is2022MajKozep,
            is2022OktKozep,
            is2021OktKozep,
            is2021MajKozep,
            is2020OktKozep,
            is2020MajKozep,
        },
        runId: 'er-2022-maj',
    });
    // #endregion
    if (is2026MajKozep) return getErettsegi2026MajKozepQuestions();
    if (is2025OktKozep) return getErettsegi2025OktKozepQuestions();
    if (is2025MajKozep) return getErettsegi2025MajKozepQuestions();
    if (is2024OktKozep) return getErettsegi2024OktKozepQuestions();
    if (is2024MajKozep) return getErettsegi2024MajKozepQuestions();
    if (is2023OktKozep) return getErettsegi2023OktKozepQuestions();
    if (is2023MajKozep) return getErettsegi2023MajKozepQuestions();
    if (is2022OktKozep) return getErettsegi2022OktKozepQuestions();
    if (is2022MajKozep) return getErettsegi2022MajKozepQuestions();
    if (is2021OktKozep) return getErettsegi2021OktKozepQuestions();
    if (is2021MajKozep) return getErettsegi2021MajKozepQuestions();
    if (is2020OktKozep) return getErettsegi2020OktKozepQuestions();
    if (is2020MajKozep) return getErettsegi2020MajKozepQuestions();
    return null;
}
