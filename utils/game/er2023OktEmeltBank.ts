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

const FIG = '/figures/erettsegi/2023okt-emelt';

/** 2023. október 17. emelt (E2311) — válaszok a javítási útmutató szerint. II. B mind a 5 opcionális feladat. */
export function getErettsegi2023OktEmeltQuestions(): Question[] {
    const house = imageFigure(`${FIG}/p06-1.png`, '2023/2. családi ház nézetek');
    const pentagon = imageFigure(`${FIG}/p12-1.jpeg`, '2023/5. ABCDE ötszög');

    const list: Question[] = [
        q(
            'er23oe-1a',
            '2023/1.a) xy = 12, x és y pozitív egész. Add meg az összes (x;y) párt.',
            0,
            '(1;12), (12;1), (2;6), (6;2), (3;4), (4;3)',
            { expectedSet: ['1;12', '12;1', '2;6', '6;2', '3;4', '4;3'] }
        ),
        q(
            'er23oe-1b',
            '2023/1.b) Exponenciális egyenlet (FL). Valós megoldások: x = ? (két gyök)',
            2,
            'x = 2 vagy x = −1',
            { alternativeAnswer: -1 }
        ),
        q(
            'er23oe-2a',
            '2023/2.a) Teljes tetőfelület cseréppel (m², egészre). Ábra: s≈5,4 m, hossz 8,5 m.',
            92,
            '≈ 92 m²',
            { figure: house }
        ),
        q(
            'er23oe-2b',
            '2023/2.b) Ház teljes térfogata (földszint + tetőtér, m³)? Földszint 8×8,5×3,2 m.',
            340,
            '218 + 122 = 340 m³'
        ),
        q(
            'er23oe-2c',
            '2023/2.c) Teljes lakóterület (m²)? Tetőtér csak ahol belmagasság ≥ 1,9 m.',
            100,
            '68 + 32 = 100 m²'
        ),
        q(
            'er23oe-3a',
            '2023/3.a) Értékelések: 6, 8, 6, 2, 8, 8, 6. Átlag (két tizedes) és szórás (két tizedes)?',
            6.29,
            'átlag ≈ 6,29; szórás ≈ 1,98',
            { alternativeAnswer: 1.98 }
        ),
        q(
            'er23oe-3b',
            '2023/3.b) Tíz értékelés: átlag 6,3, terjedelem 8, egy módusz. Az utolsó három értékelés?',
            0,
            '3, 6, 10',
            { expectedSet: ['3', '6', '10'] }
        ),
        q(
            'er23oe-3c',
            '2023/3.c) A 11. mérkőzés értékelése?',
            3,
            'x = 3'
        ),
        q(
            'er23oe-4a',
            '2023/4.a) A négy grafikon közül az f a III. lehet. igaz=1, hamis=0.',
            1,
            'III. grafikon'
        ),
        q(
            'er23oe-4b',
            '2023/4.b) g(x)=px²+qx+r, g(1)=1, g′(1)=2, g″(1)=4. p, q, r?',
            2,
            'p = 2, q = −2, r = 1',
            { alternativeAnswer: -2, thirdAnswer: 1 }
        ),
        q(
            'er23oe-5a',
            '2023/5.a) ABCDE ötszög szögei (fok). Add meg a különböző értékeket.',
            0,
            '120°, 70°, 140°, 140°, 70°',
            { expectedSet: ['120', '70', '140'], figure: pentagon }
        ),
        q(
            'er23oe-5b',
            '2023/5.b) Az ötszög területe (cm², egy tizedes)?',
            385.6,
            '173,2 + 212,4 = 385,6 cm²'
        ),
        q(
            'er23oe-5c',
            '2023/5.c) ABCDE gráf Euler-bejárásai (minden élen pontosan egyszer). Hányféle?',
            12,
            '12'
        ),
        q(
            'er23oe-6b',
            '2023/6.b) 6 fő, 3 kétfős csapat véletlenül. P(minden csapatban 1 fiú és 1 lány)?',
            0.4,
            '6/15 = 0,4'
        ),
        q(
            'er23oe-6c',
            '2023/6.c) Asztalitenisz: a többi öt játékos mind különböző számú mérkőzést játszott. Boróka hányat játszott?',
            2,
            '2'
        ),
        q(
            'er23oe-7a',
            '2023/7.a) h(t)=30/(1+59·0,905ᵗ). Fa magassága a megfigyelés kezdetekor (m)?',
            0.5,
            '0,5 m'
        ),
        q(
            'er23oe-7b',
            '2023/7.b) Hány év múlva lesz 10 m magas? (egészre kerekítve)',
            34,
            't ≈ 33,9 → 34 év'
        ),
        q(
            'er23oe-7c',
            '2023/7.c) aₙ = 30/(1+59·0,905ⁿ). Határérték?',
            30,
            '30'
        ),
        q(
            'er23oe-7d',
            '2023/7.d) Kerítés 400 ezer Ft, 5 ezer Ft/m és 10 ezer Ft/m. Maximális területű oldalak (m)?',
            40,
            '40 m és 20 m (T = 800 m²)',
            { alternativeAnswer: 20, thirdAnswer: 800 }
        ),
        q(
            'er23oe-8b',
            '2023/8.b) P(E₀) ≤ 0,01. A p intervallum alsó határa?',
            0.9,
            '0,9 ≤ p < 1'
        ),
        q(
            'er23oe-8d',
            '2023/8.d) P(E₁) maximális. p és a max. valószínűség (három tizedes)?',
            1 / 3,
            'p = 1/3; ≈ 0,296',
            { alternativeAnswer: 0.296 }
        ),
        q(
            'er23oe-9a',
            '2023/9.a) 2, 4, 6, 8, 10 páronkénti szorzatai (első tényező kisebb). Az összeg?',
            340,
            '340'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2023OktEmeltBank.ts:get',
        message: 'emelt 2023 okt bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2023_OKT_EMELT_COUNT = 22;
