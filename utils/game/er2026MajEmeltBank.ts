import type { Question } from './types';
import { imageFigure } from './questionFigure';
import { agentDebugLog } from '../agentDebugLog';

function q(
    id: string,
    question: string,
    answer: number,
    expression: string,
    extra?: Partial<Question>
): Question {
    return {
        id,
        question,
        answer,
        type: 'multiplication',
        expression,
        ...extra,
    };
}

const FIG = '/figures/erettsegi/2026maj-emelt';

/** 2026. május 5. emelt (E2513) — válaszok a javítási útmutató szerint. II. B mind a 5 opcionális feladat. */
export function getErettsegi2026MajEmeltQuestions(): Question[] {
    const aq = imageFigure(`${FIG}/p20-1.jpeg`, '2026/9. akvárium');
    const base = imageFigure(`${FIG}/p20-2.jpeg`, '2026/9. alaplap vázlat');

    const list: Question[] = [
        q(
            'er26e-1b',
            '2026/1.b) 1 kg alma + 1 kg mandarin = 14 peták. Döme 1 kg-mal több almát vett. Almáért 21, mandarinért 20 peták. Hány kg almát vett, és 1 kg alma hány peták?',
            3.5,
            'x=3,5 kg; y=6 peták/kg',
            { alternativeAnswer: 6 }
        ),
        q(
            'er26e-2a',
            '2026/2.a) 1957-ben 32 g stroncium-90, felezési idő 29 év. 2026-ban hány gramm maradt (két tizedes)?',
            6.15,
            '32 · 0,5^(69/29) ≈ 6,15 g'
        ),
        q(
            'er26e-2b',
            '2026/2.b) Hány %-kal csökken évente a stroncium-90 tömege?',
            2.4,
            '1 − 0,5^(1/29) ≈ 2,4%'
        ),
        q(
            'er26e-2c',
            '2026/2.c) 2026-ban 33,3 g maradt 50 g-ból. Melyik évben került a környezetbe?',
            2009,
            '2026 − 17 = 2009'
        ),
        q(
            'er26e-3a',
            '2026/3.a) H = {1,…,300}. Hány elem nem osztható 2-vel, 3-mal és 5-tel sem?',
            80,
            '300 − 220 = 80'
        ),
        q(
            'er26e-3b',
            '2026/3.b) Hány háromelemű részhalmazban a három elem páronként relatív prím a 2,3,5 szerint (UT: 838125)?',
            838125,
            '75 · 11175 = 838125'
        ),
        q(
            'er26e-3c',
            '2026/3.c) Hány 299 elemű részhalmazban páros az elemek összege?',
            150,
            '150'
        ),
        q(
            'er26e-4b',
            '2026/4.b) ADBC konkáv négyszög területe (cm², egy tizedes).',
            407.8,
            '1014 − 606,2 = 407,8'
        ),
        q(
            'er26e-4d',
            '2026/4.d) A bicentrikus négyszög területe (cm²).',
            588,
            '√(21·56·42·7) = 588'
        ),
        q(
            'er26e-5b',
            '2026/5.b) n lehetséges értéke a sorozat-feltételből.',
            31,
            'n = 31'
        ),
        q(
            'er26e-5c',
            '2026/5.c) A két szám négyzetes közepe (egy tizedes).',
            5.1,
            '≈ 5,1'
        ),
        q(
            'er26e-6a',
            '2026/6.a) Összefüggő 9 pontú egyszerű gráf, minden fok ≥ 2. Van-e benne kör? igaz=1, hamis=0.',
            1,
            'igaz'
        ),
        q(
            'er26e-6b',
            '2026/6.b) Az állítás megfordítása igaz-e? igaz=1, hamis=0.',
            0,
            'hamis'
        ),
        q(
            'er26e-6c',
            '2026/6.c) Lehetséges-e, hogy Balázs és Attila még csak az egymás elleni meccset játszotta? igen=1, nem=0.',
            0,
            'nem lehetséges'
        ),
        q(
            'er26e-7a',
            '2026/7.a) Mely függvények konkávok ]−∞; 7[-en? Add meg a betűket (A–E).',
            0,
            'A, D, E',
            { expectedSet: ['A', 'D', 'E'] }
        ),
        q(
            'er26e-8a',
            '2026/8.a) A 36°-os, 2000 Ft-os cikk területe (cm², egészre, π≈3,14).',
            503,
            '160π ≈ 503'
        ),
        q(
            'er26e-8b',
            '2026/8.b) Egy forgatás nyereményének várható értéke (Ft).',
            2300,
            '1000·0,4+2000·0,1+3000·0,3+4000·0,2 = 2300'
        ),
        q(
            'er26e-8c',
            '2026/8.c) P(három forgatás összege pontosan 6000 Ft).',
            0.169,
            '0,001+0,072+0,096 = 0,169'
        ),
        q(
            'er26e-8d',
            '2026/8.d) Az 1000 Ft-os nyeremény új valószínűsége p = ? (2000 Ft-os: 0,3)',
            0.2,
            'p=0,2; 2000 Ft: 0,3',
            { alternativeAnswer: 0.3 }
        ),
        q(
            'er26e-9a',
            '2026/9.a) Akvárium térfogata literben, egészre kerekítve.',
            123,
            '123 165 cm³ ≈ 123 liter',
            { figures: [aq, base] }
        ),
        q(
            'er26e-9b',
            '2026/9.b) Minimális felszínű, 35 cm magas, 126000 cm³ téglatest alapélei (cm).',
            60,
            'négyzet alap, él 60 cm'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2026MajEmeltBank.ts:get',
        message: 'emelt 2026 maj bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2026_MAJ_EMELT_COUNT = 21;
