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

const FIG = '/figures/erettsegi/2020maj-emelt';

/** 2020. május 5. emelt (2011) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2020MajEmeltQuestions(): Question[] {
    const graph = imageFigure(`${FIG}/p08-2.jpeg`, '2020/3. nyolcpontú gráf');
    const day = imageFigure(`${FIG}/p12-1.jpeg`, '2020/5. nappalhossz-modell');

    const list: Question[] = [
        q(
            'er20me-1a',
            '2020/1.a) Számtani sorozat: a1+a3=26, a2+a4=130. Az ötödik tag?',
            169,
            'd=52, a1=−39 → a5=169'
        ),
        q(
            'er20me-1b',
            '2020/1.b) Mértani sorozat: b1+b3=26, b2+b4=130. Az ötödik tag?',
            625,
            'q=5, b1=1 → b5=625'
        ),
        q(
            'er20me-2a',
            '2020/2.a) PRM-abc rendszám, a·b·c prímszám. Hány különböző „prímes” rendszám?',
            12,
            '4·3 = 12'
        ),
        q(
            'er20me-2b',
            '2020/2.b) HAT-abc, a+b+c=6 (számjegyek). Hány „hatos” rendszám?',
            28,
            '3+6+6+3+3+6+1 = 28'
        ),
        q(
            'er20me-2c',
            '2020/2.c) LOG-abc, log_a b = c. Hány „logaritmusos” rendszám?',
            19,
            '8+8+2+1 = 19'
        ),
        q(
            'er20me-3b',
            '2020/3.b) Nyolcpontú gráf, véletlen két csúcs. P(él köti össze őket) (három tizedes).',
            0.429,
            '12 / C(8;2) = 3/7 ≈ 0,429',
            { figure: graph }
        ),
        q(
            'er20me-4b',
            '2020/4.b) Másodfokú egyenlet p paraméterrel. Ha egyik gyök 3, a másik gyök?',
            0.4,
            '3,4 − 3 = 0,4'
        ),
        q(
            'er20me-4c',
            '2020/4.c) A gyökök négyzetösszege 7. A p paraméter értékei.',
            0.5,
            'p = 0,5 vagy p = −0,75',
            { alternativeAnswer: -0.75 }
        ),
        q(
            'er20me-5a',
            '2020/5.a) 9/58 radián értéke fokban (két tizedes).',
            8.89,
            '9/58 · 180/π ≈ 8,89°',
            { figure: day }
        ),
        q(
            'er20me-5b',
            '2020/5.b) Az év 50. napján a nappal hossza: óra és perc (egész percre).',
            8,
            '≈ 8,39 óra → 8:23',
            { alternativeAnswer: 23, figure: day }
        ),
        q(
            'er20me-5d',
            '2020/5.d) y=−5,2 cos x + 11,2, valamint x=0, y=0, x=2π. A korlátos síkidom területe (két tizedes).',
            70.37,
            '11,2 · 2π ≈ 70,37',
            { figure: day }
        ),
        q(
            'er20me-6a',
            '2020/6.a) Hány 90-nél nem nagyobb pozitív egész osztható a 2, 3, 5 közül pontosan eggyel?',
            42,
            '24+12+6 = 42'
        ),
        q(
            'er20me-6b',
            '2020/6.b) Ötöslottó, Kati: 7,9,14,64,68. Első három nyerő: 7,9,14. P(a maradék kettőből legalább egy találat) (három tizedes).',
            0.046,
            '171/3741 ≈ 0,046'
        ),
        q(
            'er20me-6c',
            '2020/6.c) 3 222 831 szelvény, 250 Ft/db. Egy szelvényre jutó átlagos veszteség (Ft, egy tizedes).',
            177.7,
            '250 − 72,3 = 177,7'
        ),
        q(
            'er20me-7a',
            '2020/7.a) Húrnégyszög AB=20, BC=18, ABC=70°, CAD=50°. CD hossza és a terület (egy tizedes).',
            17.82,
            'CD ≈ 17,82; T ≈ 235,7 (Brahmagupta ≈ 236,1)',
            { alternativeAnswer: 235.7, thirdAnswer: 236.1 }
        ),
        q(
            'er20me-7b',
            '2020/7.b) P(−2;0), Q(6;0), R(0;5), H(−1,8;0). PH·RH skaláris szorzat.',
            -0.36,
            '0,2·(−1,8) = −0,36'
        ),
        q(
            'er20me-7c',
            '2020/7.c) H a PQ szakaszon. A skaláris szorzat min. és max. helyén H x-koordinátája.',
            -1,
            'min: H(−1; 0), max: H(6; 0)',
            { alternativeAnswer: 6 }
        ),
        q(
            'er20me-8a',
            '2020/8.a) Hibás számla 8710, helyes 7670 Ft. Étel és ital helyes bruttó ára (Ft).',
            5720,
            'étel 5720 Ft, ital 1950 Ft',
            { alternativeAnswer: 1950 }
        ),
        q(
            'er20me-8b',
            '2020/8.b) 3900 Ft ebéd, 1000 vendég. Az étterem várható haszna (Ft).',
            940000,
            '3 900 000 − 2 960 000 = 940 000'
        ),
        q(
            'er20me-8c',
            '2020/8.c) Két vendég együttes fogyasztása veszteség. P = ? (négy tizedes)',
            0.1375,
            '0,0025+0,01+0,03+0,025+0,01+0,06 = 0,1375'
        ),
        q(
            'er20me-9a',
            '2020/9.a) 350 talléros vonaljegy. Napi bevétel (tallér).',
            25200000,
            '72 000 · 350 = 25 200 000'
        ),
        q(
            'er20me-9b',
            '2020/9.b) Hány talléros vonaljegynél maximális a napi bevétel?',
            260,
            'x = −8 → 300 − 40 = 260 tallér'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2020MajEmeltBank.ts:get',
        message: 'emelt 2020 maj bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2020_MAJ_EMELT_COUNT = 22;
