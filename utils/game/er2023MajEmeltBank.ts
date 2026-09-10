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

const FIG = '/figures/erettsegi/2023maj-emelt';

/** 2023. május 9. emelt (E2313) — válaszok a javítási útmutató szerint. II. B mind a 5 opcionális feladat. */
export function getErettsegi2023MajEmeltQuestions(): Question[] {
    const garden = imageFigure(`${FIG}/p08-1.jpeg`, '2023/3. trapéz kert');
    const box = imageFigure(`${FIG}/p14-1.jpeg`, '2023/6. nyitott doboz');
    const pool = imageFigure(`${FIG}/p20-1.jpeg`, '2023/9. medence tervrajz');

    const list: Question[] = [
        q(
            'er23me-1a',
            '2023/1.a) log₃ x + log₃(x+2) = 1. x = ?',
            1,
            'x = 1'
        ),
        q(
            'er23me-2a',
            '2023/2.a) 25,4 mérföld/gallon → liter/100 km (1 tizedes). 1 gallon≈3,79 l, 1 mérföld≈1,61 km.',
            9.3,
            '9,3 l/100 km'
        ),
        q(
            'er23me-2b',
            '2023/2.b) Magyar rendszám: 4 betű + 3 számjegy a megadott szabályokkal. Hány megfelelő rendszám?',
            309973716,
            '459 · 675324 = 309973716'
        ),
        q(
            'er23me-2c',
            '2023/2.c) „Bármely két magyar rendszám különböző.” tagadása melyik? A/B/C/D.',
            0,
            'C',
            { expectedSet: ['C'] }
        ),
        q(
            'er23me-3a',
            '2023/3.a) Trapéz AB=36 m, CD=8 m, AC=11 m merőleges az alapokra. Kerület (m) és terület (m²)?',
            95.2,
            'K = 95,2 m; T = 242 m²',
            { alternativeAnswer: 242, figure: garden }
        ),
        q(
            'er23me-3b',
            '2023/3.b) Henger kút, átmérő 10 cm, V=0,1 m³. Mélység (m, egy tizedes)?',
            12.7,
            'h ≈ 12,7 m'
        ),
        q(
            'er23me-3c',
            '2023/3.c) e ∥ alapok, AC-t felezi az EF. Az A-tól milyen messze metszi e az AC-t (m)?',
            5.5,
            '5,5 m'
        ),
        q(
            'er23me-4a',
            '2023/4.a) Számtani sorozat: a₂₀=108, S₂₀=1115. a₁ és d?',
            3.5,
            'a₁ = 3,5; d = 5,5',
            { alternativeAnswer: 5.5 }
        ),
        q(
            'er23me-4b',
            '2023/4.b) Mértani sorozat a₁=3, q=3, első n tag szorzata 3^{435}. n = ?',
            29,
            'n = 29'
        ),
        q(
            'er23me-5a',
            '2023/5.a) Pali: A kör 1, Kocka 2, Képlet 3; Lilla: Képlet 1, A kör 2, Kocka 3. Melyik filmet nézik?',
            0,
            'A kör',
            { expectedSet: ['A kör'] }
        ),
        q(
            'er23me-5b',
            '2023/5.b) Hányféle pontozásnál egyenlő mindhárom film pontösszege?',
            6,
            '3! = 6'
        ),
        q(
            'er23me-5c',
            '2023/5.c) Véletlen pontozás. P(lesz filmnézés)?',
            2 / 3,
            '4/6 = 2/3'
        ),
        q(
            'er23me-5d',
            '2023/5.d) 83 értékelés, 46 darab 1-es, átlag 5. Szórás (két tizedes)?',
            4.46,
            '≈ 4,46'
        ),
        q(
            'er23me-6a',
            '2023/6.a) Nyitott doboz, alap 8×6 cm, szemközti függőleges lapok 6×5 és 6×2 cm. Testátló (cm, egy tizedes)?',
            11.2,
            '≈ 11,2 cm',
            { figure: box }
        ),
        q(
            'er23me-6b',
            '2023/6.b) Háló 15×16 cm-es téglalapból. Hulladék (%)?',
            39.2,
            '39,2%'
        ),
        q(
            'er23me-6c',
            '2023/6.c) Karton: 4-4 cm és 2-2 cm margó, középső téglalap 50 cm², minimális terület. Oldalak (cm)?',
            9,
            '9 cm és 18 cm',
            { alternativeAnswer: 18 }
        ),
        q(
            'er23me-7a',
            '2023/7.a) 600 termék, 6 hibás, 15 elemű visszatevés nélküli minta. P(0 hibás a mintában) ≈ ? (három tizedes)',
            0.859,
            '≈ 0,859'
        ),
        q(
            'er23me-7b',
            '2023/7.b) 0,5% hibás, visszatevéses 15-ös minta. P(legalább 2 hibás) = ? (UT: 0,0025, és ez < 1%)',
            0.0025,
            '0,0025'
        ),
        q(
            'er23me-7c',
            '2023/7.c) Selejtraktár T/H/E kódok (UT adatok). Hány selejtes termék van?',
            90,
            '90'
        ),
        q(
            'er23me-8a',
            '2023/8.a) f(x)=x²−1, g(x)=√x az [1;∞[-en. f(g(x))=g(f(x)). x = ?',
            1,
            'x = 1'
        ),
        q(
            'er23me-8c',
            '2023/8.c) ∫_a^b (2x−1) dx = 8, a<b egészek. a (két lehetséges) és b?',
            -3,
            'a = −3, b = 5 vagy a = 4, b = 5',
            { alternativeAnswer: 4, thirdAnswer: 5 }
        ),
        q(
            'er23me-9a',
            '2023/9.a) Medence tervrajz, (0;0) és (1;0) a valóságban 12 m. Alapterület (m²)?',
            84,
            '84 m²',
            { figure: pool }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2023MajEmeltBank.ts:get',
        message: 'emelt 2023 maj bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2023_MAJ_EMELT_COUNT = 22;
