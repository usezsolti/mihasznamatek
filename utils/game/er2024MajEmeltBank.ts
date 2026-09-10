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

const FIG = '/figures/erettsegi/2024maj-emelt';

/** 2024. május 7. emelt (E2411) — válaszok a javítási útmutató szerint. II. B mind a 5 opcionális feladat. */
export function getErettsegi2024MajEmeltQuestions(): Question[] {
    const square = imageFigure(`${FIG}/p10-1.jpeg`, '2024/4. ABCD négyzet, P, Q, F');

    const list: Question[] = [
        q(
            'er24me-1a',
            '2024/1.a) log₂(x−2)+log₂ 8 = log₂(2x+8), x>2 (UT: 8x−16=2x+8). x = ?',
            4,
            'x = 4'
        ),
        q(
            'er24me-1b',
            '2024/1.b) f(x)=2^{x−3} és g(x)=2^{3−x} grafikonjának metszéspontja. x és y?',
            3,
            'M(3; 1)',
            { alternativeAnswer: 1 }
        ),
        q(
            'er24me-1c',
            '2024/1.c) h: egyjegyű pozitív prímeken, h(x)=2^{x−3}. Az inverz értelmezési tartománya?',
            0,
            '{0,5; 1; 4; 16}',
            { expectedSet: ['0.5', '1', '4', '16'] }
        ),
        q(
            'er24me-2a',
            '2024/2.a) Hány hétjegyű kettes számrendszerbeli számban van legfeljebb két 0?',
            22,
            '1 + 6 + 15 = 22'
        ),
        q(
            'er24me-2b',
            '2024/2.b) H = {1,…,9}. Hány 4 elemű részhalmaznak eleme az 1 vagy a 2?',
            91,
            '35 + 35 + 21 = 91'
        ),
        q(
            'er24me-2c',
            '2024/2.c) „Ha A \\ B = ∅, akkor A ∩ B = ∅.” A megfordítás igaz-e? igaz=1, hamis=0.',
            0,
            'hamis (pl. A={1}, B={2})'
        ),
        q(
            'er24me-3a',
            '2024/3.a) Öt szabályos kocka, első dobás. P(Sor) ≈ ? (három tizedes)',
            0.031,
            '≈ 0,031'
        ),
        q(
            'er24me-3b',
            '2024/3.b) 3-3-3-4-5 után a 4-est és 5-öst újradobjuk. P(Full House vagy Royal)?',
            1 / 6,
            '1/6'
        ),
        q(
            'er24me-3c',
            '2024/3.c) Cinkelt kocka, P(6)=p. Két dobás, P(legalább egy 6-os)=0,64. p = ?',
            0.4,
            'p = 0,4'
        ),
        q(
            'er24me-4a',
            '2024/4.a) ABCD négyzet, AP:PQ:QC=4:5:3, F az AB felezőpontja. T(AFQ)/T(ABCD) = ?',
            3 / 16,
            '3/16',
            { figure: square }
        ),
        q(
            'er24me-5a',
            '2024/5.a) aₙ = n/(n+4). A sorozat határértéke?',
            1,
            'lim aₙ = 1'
        ),
        q(
            'er24me-5c',
            '2024/5.c) (n+4)! / n! = 24(n+1)(n+3), n pozitív egész. n = ?',
            2,
            'n = 2'
        ),
        q(
            'er24me-5d',
            '2024/5.d) f(x)=24(x+1)(x+3) és az x-tengely közbezárt korlátos síkidom területe?',
            32,
            'terület = 32'
        ),
        q(
            'er24me-6a',
            '2024/6.a) 14 nap, naponta 5-tel több felülés, összesen 1001. Első és utolsó nap?',
            39,
            'első 39, utolsó 104',
            { alternativeAnswer: 104 }
        ),
        q(
            'er24me-6b',
            '2024/6.b) Két 5,25 km-es kör, második 3,5 km/h-val lassabb, kétkörös átlag 12 km/h. Az első és a második kör átlagsebessége (km/h)?',
            14,
            '14 km/h és 10,5 km/h',
            { alternativeAnswer: 10.5 }
        ),
        q(
            'er24me-6c',
            '2024/6.c) Két különböző pozitív szám …… közepe mindig nagyobb, mint a …… közepe, de kisebb, mint a …… közepe. (mértani / harmonikus / számtani)',
            0,
            'mértani; harmonikus; számtani',
            { expectedSet: ['mértani', 'harmonikus', 'számtani'] }
        ),
        q(
            'er24me-7a',
            '2024/7.a) Homokszem r=0,1 mm, 2 dl pohár, 60%-os kitöltés. Hány millió homokszem (egészre)?',
            29,
            '≈ 29 millió'
        ),
        q(
            'er24me-7b',
            '2024/7.b) Forgáskúp alkotó 1,8 m, alapátmérő 3,1 m. Térfogat (m³, egy tizedes)?',
            2.3,
            '≈ 2,3 m³'
        ),
        q(
            'er24me-7c',
            '2024/7.c) 1,8 m alkotójú kúpok közül a maximális térfogatú: sugár (m) és térfogat (m³). Magasság ≈ 1,04 m.',
            1.47,
            'r ≈ 1,47 m; m ≈ 1,04 m; V ≈ 2,35 m³',
            { alternativeAnswer: 1.04, thirdAnswer: 2.35 }
        ),
        q(
            'er24me-8a',
            '2024/8.a) k₁: x²−4x+y²−12y=13. Középpont (x; y) és r².',
            2,
            'O(2; 6), r² = 53',
            { alternativeAnswer: 6, thirdAnswer: 53 }
        ),
        q(
            'er24me-8b',
            '2024/8.b) Húrtrapéz A(4;13), B(−5;4), C(4;−1), D(9;4). Magasság (7√2) és szögek (fok, két tizedes).',
            7 * Math.sqrt(2),
            'm = 7√2; 74,05° és 105,95°',
            { alternativeAnswer: 74.05, thirdAnswer: 105.95 }
        ),
        q(
            'er24me-8c',
            '2024/8.c) k₂: x²+y²=53. Hány rácspont van a körvonalon?',
            8,
            '8 pont'
        ),
        q(
            'er24me-9a',
            '2024/9.a) Egy k és egy 2k pontú teljes gráfnak összesen 697 éle van. k = ?',
            17,
            'k = 17'
        ),
        q(
            'er24me-9b',
            '2024/9.b) 6 csapat körmérkőzés, 3 mérkőzést sorsolnak. P(van csapat, amelyik mindhármon szerepel) ≈ ? (három tizedes)',
            0.132,
            '60/455 = 12/91 ≈ 0,132'
        ),
        q(
            'er24me-9c',
            '2024/9.c) 6 ember, a kézfogásszámok között 5 különböző érték. Hány kézfogás lehetett? (két lehetséges UT-érték)',
            6,
            '6 vagy 9',
            { alternativeAnswer: 9 }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2024MajEmeltBank.ts:get',
        message: 'emelt 2024 maj bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2024_MAJ_EMELT_COUNT = 25;
