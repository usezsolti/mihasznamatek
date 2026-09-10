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
import {
    ERETTSEGI_2026_MAJ_EMELT_COUNT,
    getErettsegi2026MajEmeltQuestions,
} from './er2026MajEmeltBank';
import {
    ERETTSEGI_2025_OKT_EMELT_COUNT,
    getErettsegi2025OktEmeltQuestions,
} from './er2025OktEmeltBank';
import {
    ERETTSEGI_2025_MAJ_EMELT_COUNT,
    getErettsegi2025MajEmeltQuestions,
} from './er2025MajEmeltBank';
import {
    ERETTSEGI_2024_OKT_EMELT_COUNT,
    getErettsegi2024OktEmeltQuestions,
} from './er2024OktEmeltBank';
import {
    ERETTSEGI_2024_MAJ_EMELT_COUNT,
    getErettsegi2024MajEmeltQuestions,
} from './er2024MajEmeltBank';
import {
    ERETTSEGI_2023_OKT_EMELT_COUNT,
    getErettsegi2023OktEmeltQuestions,
} from './er2023OktEmeltBank';
import {
    ERETTSEGI_2023_MAJ_EMELT_COUNT,
    getErettsegi2023MajEmeltQuestions,
} from './er2023MajEmeltBank';
import {
    ERETTSEGI_2022_OKT_EMELT_COUNT,
    getErettsegi2022OktEmeltQuestions,
} from './er2022OktEmeltBank';
import {
    ERETTSEGI_2022_MAJ_EMELT_COUNT,
    getErettsegi2022MajEmeltQuestions,
} from './er2022MajEmeltBank';
import {
    ERETTSEGI_2021_OKT_EMELT_COUNT,
    getErettsegi2021OktEmeltQuestions,
} from './er2021OktEmeltBank';
import {
    ERETTSEGI_2021_MAJ_EMELT_COUNT,
    getErettsegi2021MajEmeltQuestions,
} from './er2021MajEmeltBank';
import {
    ERETTSEGI_2020_OKT_EMELT_COUNT,
    getErettsegi2020OktEmeltQuestions,
} from './er2020OktEmeltBank';
import {
    ERETTSEGI_2020_MAJ_EMELT_COUNT,
    getErettsegi2020MajEmeltQuestions,
} from './er2020MajEmeltBank';

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
    'er-2026-maj-emelt': {
        subtitle: '2026. május 5. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2026_MAJ_EMELT_COUNT,
    },
    'er-2025-okt-emelt': {
        subtitle: '2025. október 14. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2025_OKT_EMELT_COUNT,
    },
    'er-2025-maj-emelt': {
        subtitle: '2025. május 6. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2025_MAJ_EMELT_COUNT,
    },
    'er-2024-okt-emelt': {
        subtitle: '2024. október 15. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2024_OKT_EMELT_COUNT,
    },
    'er-2024-maj-emelt': {
        subtitle: '2024. május 7. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2024_MAJ_EMELT_COUNT,
    },
    'er-2023-okt-emelt': {
        subtitle: '2023. október 17. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2023_OKT_EMELT_COUNT,
    },
    'er-2023-maj-emelt': {
        subtitle: '2023. május 9. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2023_MAJ_EMELT_COUNT,
    },
    'er-2022-okt-emelt': {
        subtitle: '2022. október 18. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2022_OKT_EMELT_COUNT,
    },
    'er-2022-maj-emelt': {
        subtitle: '2022. május 3. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2022_MAJ_EMELT_COUNT,
    },
    'er-2021-okt-emelt': {
        subtitle: '2021. október 19. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2021_OKT_EMELT_COUNT,
    },
    'er-2021-maj-emelt': {
        subtitle: '2021. május 4. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2021_MAJ_EMELT_COUNT,
    },
    'er-2020-okt-emelt': {
        subtitle: '2020. október 20. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2020_OKT_EMELT_COUNT,
    },
    'er-2020-maj-emelt': {
        subtitle: '2020. május 5. · 240 perc · OH hivatalos emelt',
        questionCount: ERETTSEGI_2020_MAJ_EMELT_COUNT,
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
                    timeLimitMin: level === 'emelt' ? 240 : 180,
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
    const is2026MajEmelt =
        id === 'er-2026-maj-emelt' || id === '2026-maj-emelt' || id === 'e2513';
    const is2025OktEmelt =
        id === 'er-2025-okt-emelt' || id === '2025-okt-emelt' || id === 'e2412';
    const is2025MajEmelt =
        id === 'er-2025-maj-emelt' || id === '2025-maj-emelt' || id === 'e2512';
    const is2024OktEmelt =
        id === 'er-2024-okt-emelt' || id === '2024-okt-emelt' || id === 'e2413';
    const is2024MajEmelt =
        id === 'er-2024-maj-emelt' || id === '2024-maj-emelt' || id === 'e2411';
    const is2023OktEmelt =
        id === 'er-2023-okt-emelt' || id === '2023-okt-emelt' || id === 'e2311';
    const is2023MajEmelt =
        id === 'er-2023-maj-emelt' || id === '2023-maj-emelt' || id === 'e2313';
    const is2022OktEmelt =
        id === 'er-2022-okt-emelt' || id === '2022-okt-emelt' || id === 'e2212';
    const is2022MajEmelt =
        id === 'er-2022-maj-emelt' || id === '2022-maj-emelt' || id === 'e2213';
    const is2021OktEmelt =
        id === 'er-2021-okt-emelt' || id === '2021-okt-emelt' || id === 'e2113';
    const is2021MajEmelt =
        id === 'er-2021-maj-emelt' || id === '2021-maj-emelt' || id === 'e2112';
    const is2020OktEmelt =
        id === 'er-2020-okt-emelt' || id === '2020-okt-emelt' || id === 'e2013';
    const is2020MajEmelt =
        id === 'er-2020-maj-emelt' || id === '2020-maj-emelt' || id === 'e2011';
    const emeltHit =
        is2026MajEmelt ||
        is2025OktEmelt ||
        is2025MajEmelt ||
        is2024OktEmelt ||
        is2024MajEmelt ||
        is2023OktEmelt ||
        is2023MajEmelt ||
        is2022OktEmelt ||
        is2022MajEmelt ||
        is2021OktEmelt ||
        is2021MajEmelt ||
        is2020OktEmelt ||
        is2020MajEmelt;
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
    agentDebugLog({
        hypothesisId: emeltHit ? 'H50' : id.includes('emelt') ? 'H51' : 'H20',
        location: 'erettsegiPapers.ts:getErettsegiPaperQuestions:emelt',
        message: 'emelt paper lookup',
        data: {
            paperId: id,
            emeltHit,
            readyCatalog: Boolean(READY[`er-${id.replace(/^er-/, '')}`] || READY[id]),
            is2026MajEmelt,
            is2025OktEmelt,
            is2020MajEmelt,
        },
        runId: 'er-emelt-batch',
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
    if (is2026MajEmelt) return getErettsegi2026MajEmeltQuestions();
    if (is2025OktEmelt) return getErettsegi2025OktEmeltQuestions();
    if (is2025MajEmelt) return getErettsegi2025MajEmeltQuestions();
    if (is2024OktEmelt) return getErettsegi2024OktEmeltQuestions();
    if (is2024MajEmelt) return getErettsegi2024MajEmeltQuestions();
    if (is2023OktEmelt) return getErettsegi2023OktEmeltQuestions();
    if (is2023MajEmelt) return getErettsegi2023MajEmeltQuestions();
    if (is2022OktEmelt) return getErettsegi2022OktEmeltQuestions();
    if (is2022MajEmelt) return getErettsegi2022MajEmeltQuestions();
    if (is2021OktEmelt) return getErettsegi2021OktEmeltQuestions();
    if (is2021MajEmelt) return getErettsegi2021MajEmeltQuestions();
    if (is2020OktEmelt) return getErettsegi2020OktEmeltQuestions();
    if (is2020MajEmelt) return getErettsegi2020MajEmeltQuestions();
    return null;
}
