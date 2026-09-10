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

const FIG = '/figures/erettsegi/2025maj-emelt';

/** 2025. május 6. emelt (E2512) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2025MajEmeltQuestions(): Question[] {
    const quad = imageFigure(`${FIG}/p08-1.jpeg`, '2025/3. ABCD négyszög');

    const list: Question[] = [
        q(
            'er25me-1a',
            '2025/1.a) Három cipő novemberben 45 000 Ft. Akció: legolcsóbb 50%, középső 20% kedvezmény → 37 000 Ft. Legolcsóbb +30% → 48 000 Ft. Novemberi árak (Ft)?',
            10000,
            'x=10000, y=15000, z=20000',
            { alternativeAnswer: 15000, thirdAnswer: 20000 }
        ),
        q(
            'er25me-1b',
            '2025/1.b) Négy szám: első 3, utolsó 25. Első három számtani, utolsó három mértani. Az egyik megoldás két középső tagja?',
            9,
            '3, 9, 15, 25',
            { alternativeAnswer: 15 }
        ),
        q(
            'er25me-1b2',
            '2025/1.b) Ugyanaz. A másik megoldás két középső tagja?',
            0.25,
            '3; 0,25; −2,5; 25',
            { alternativeAnswer: -2.5 }
        ),
        q(
            'er25me-2a',
            '2025/2.a) P(t)=E/(1+k·2^{−ct}), k=1,5, c=0,05, P(8)=140. Eltartóképesség E (egész)?',
            300,
            '≈299 → 300 egyed'
        ),
        q(
            'er25me-2b',
            '2025/2.b) E=1500, P(0)=200, P(5)=350. k = ?',
            6.5,
            'k=6,5'
        ),
        q(
            'er25me-2bc',
            '2025/2.b) Ugyanaz a populáció. c ≈ ? (három tizedes)',
            0.197,
            'c≈0,197'
        ),
        q(
            'er25me-3a',
            '2025/3.a) a_n / a_{n−1} = n/(n+1) (n≥2). A négyszög szögei a1…a4 (fok). Add meg a négy szöget.',
            86,
            '86°, 88°, 91°, 95°',
            { alternativeAnswer: 88, thirdAnswer: 91, fourthAnswer: 95 }
        ),
        q(
            'er25me-3b',
            '2025/3.b) AB=18 cm, AD=15 cm, AC=20 cm, DAB=90°, ABC=70°. BC hossza (cm, két tizedes)?',
            16.83,
            'BC≈16,83 cm',
            { figure: quad }
        ),
        q(
            'er25me-3cd',
            '2025/3.b) Ugyanaz a négyszög. CD hossza (cm, két tizedes)?',
            12.27,
            'CD≈12,27 cm',
            { figure: quad }
        ),
        q(
            'er25me-4a',
            '2025/4.a) Kör az A(5; 14) és B(7; 6) pontokon, középpontja az y tengelyen. Középpont y-koordinátája és r²?',
            8.5,
            'x²+(y−8,5)²=55,25',
            { alternativeAnswer: 55.25 }
        ),
        q(
            'er25me-4b',
            '2025/4.b) y = (1/(2p))(x−u)²+v parabola tengelypontja B, illeszkedik A-ra. p = ?',
            0.25,
            'p=1/4'
        ),
        q(
            'er25me-5a',
            '2025/5.a) 510 tanuló; a fiúk p%-a (13 fő), a lányok (p+3)%-a (20 fő) kitűnő. Fiúk és lányok száma?',
            260,
            'fiúk 260, lányok 250; p=5',
            { alternativeAnswer: 250 }
        ),
        q(
            'er25me-5b',
            '2025/5.b) 13 fiú és 20 lány kitűnő közül 3 sorsolás. P(1 fiú és 2 lány)? (három tizedes)',
            0.453,
            'C(13,1)·C(20,2)/C(33,3)≈0,453'
        ),
        q(
            'er25me-6c',
            '2025/6.c) f(x)=x²+bx+c, x=2-ben minimum, a minimum értéke −1. b és c?',
            -4,
            'b=−4, c=3',
            { alternativeAnswer: 3 }
        ),
        q(
            'er25me-6d',
            '2025/6.d) p ∈ [0; 2π], ∫₀ᵖ sin x dx = 1/2. A két p érték (radián)?',
            Math.PI / 3,
            'p=π/3 vagy p=5π/3',
            { alternativeAnswer: (5 * Math.PI) / 3 }
        ),
        q(
            'er25me-7a',
            '2025/7.a) Felül nyitott négyzetes hasáb. Alap 4 tallér/dm², oldal 3 tallér/dm², max 300 tallér. Alapél 6 dm. Max magasság (dm)?',
            13 / 6,
            'm ≤ 13/6 dm'
        ),
        q(
            'er25me-7b',
            '2025/7.b) Ugyanaz a költségkeret. Maximális térfogatú doboz alapéle (dm)?',
            5,
            'a=5 dm'
        ),
        q(
            'er25me-7bh',
            '2025/7.b) Ugyanaz. A maximális térfogatú doboz magassága (dm)?',
            10 / 3,
            'b=10/3 dm; V=250/3'
        ),
        q(
            'er25me-7c',
            '2025/7.c) Alaplap + 4 oldallap kék vagy piros; forgatással egyezők azonosak. Hány színezés?',
            12,
            '12 színezés'
        ),
        q(
            'er25me-8a',
            '2025/8.a) G ötpontú fagráf. Lehetséges-e, hogy a komplementere is fagráf? igen=1, nem=0.',
            0,
            'nem lehetséges (4 vs 6 él)'
        ),
        q(
            'er25me-8b',
            '2025/8.b) K₆ pontjai 1–6; él zöld, ha az egyik szám osztója a másiknak. P(három véletlen pont egyszínű háromszöge)?',
            0.3,
            '6/20=0,3'
        ),
        q(
            'er25me-8c',
            '2025/8.c) 3 zöld + 3 piros golyó, visszatevés nélkül, amíg az egyik színből mindhárom kijön. Húzások számának várható értéke?',
            4.5,
            'E=4,5'
        ),
        q(
            'er25me-9a',
            '2025/9.a) Legnagyobb természetes szám, amelyre a 4 tulajdonságból pontosan 3 teljesül. Első három számjegy és a záró nullák száma?',
            992,
            '992000…0 (17 nulla)',
            { alternativeAnswer: 17 }
        ),
        q(
            'er25me-9b',
            '2025/9.b) H: húszjegyű pozitív egészek, A: 7-est tartalmazók. Igaz-e, hogy |A| > |Ā|? igaz=1, hamis=0.',
            1,
            '|A|=7,92·10^19 > |Ā|≈1,08·10^19'
        ),
        q(
            'er25me-9c',
            '2025/9.c) n-jegyű véletlen pozitív egész P(van benne 7-es) > 0,99. n lehetséges értékei: n ≥ ?',
            44,
            'n≥44'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2025MajEmeltBank.ts:get',
        message: 'emelt 2025 maj bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2025_MAJ_EMELT_COUNT = 25;
