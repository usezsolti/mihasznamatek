import type { Question } from './types';
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

/** 2022. május 3. emelt (2213) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2022MajEmeltQuestions(): Question[] {
    const list: Question[] = [
        q(
            'er22me-1a',
            '2022/1.a) Exponenciális egyenlet 3^x-ben (15·3^x és 9^x). A valós megoldás x = ?',
            -1,
            '3^x = 1/3 → x = −1'
        ),
        q(
            'er22me-2a',
            '2022/2.a) Számtani sorozat: a1 = 5, d = 3, Sn = 4900. n = ?',
            56,
            'n = 56 (n = −58,3 nem megoldás)'
        ),
        q(
            'er22me-2b',
            '2022/2.b) Mértani sorozat: a1+a2 = 6, a3+a4 = 96. Az első tag? (két megoldás)',
            1.2,
            'q = 4 → a1 = 6/5 = 1,2; q = −4 → a1 = −2',
            { alternativeAnswer: -2 }
        ),
        q(
            'er22me-3a',
            '2022/3.a) 50 lakó, 38% nő, 32% szemüveges. A nem szemüveges férfiak száma legalább, illetve legfeljebb?',
            15,
            'legalább 15, legfeljebb 31',
            { alternativeAnswer: 31 }
        ),
        q(
            'er22me-3b',
            '2022/3.b) 15×10 m kert, átló mentén fű/virág. 10 m sugarú negyedkör locsol. Kimaradó füvesített terület (m², egy tizedes).',
            9.1,
            '75 − 65,9 = 9,1'
        ),
        q(
            'er22me-4a',
            '2022/4.a) Tömegek (g): 163,163,163,163,163,164,165,166,166. Hitelesíthető-e (szórás ≤ 1 g)? igen=1, nem=0.',
            0,
            'szórás ≈ 1,25 g > 1 g, nem hitelesíthető'
        ),
        q(
            'er22me-4b',
            '2022/4.b) 3 piros + 7 kék, visszatevés nélkül 2 golyó. P(van piros) (három tizedes).',
            0.533,
            '1 − C(7;2)/C(10;2) = 8/15 ≈ 0,533'
        ),
        q(
            'er22me-4c',
            '2022/4.c) Visszatevéssel 3 húzás. A: pontosan 2 piros, B: van piros. P(A|B) (három tizedes).',
            0.288,
            '189/657 ≈ 0,288'
        ),
        q(
            'er22me-5a',
            '2022/5.a) 3 mogyorós+1 túrós+2 fahéjas = 1500 Ft, stb. Egy mogyorós / túrós / fahéjas ára (Ft).',
            270,
            'mogyorós 270, túrós 210, fahéjas 240',
            { alternativeAnswer: 210, thirdAnswer: 240 }
        ),
        q(
            'er22me-5c',
            '2022/5.c) 6 érme összege 210 Ft (100,50,20,10,5). Hányféle sorrendben vehető elő?',
            215,
            '180 + 15 + 20 = 215'
        ),
        q(
            'er22me-6a',
            '2022/6.a) A(0;0), B(82;0), C(41;71). A szögek fokban, három tizedesre.',
            59.995,
            '59,995°; 59,995°; 60,010°',
            { alternativeAnswer: 60.01 }
        ),
        q(
            'er22me-6b',
            '2022/6.b) AC/AB aránya négy tizedesre.',
            0.9999,
            '≈ 0,9999'
        ),
        q(
            'er22me-6c',
            '2022/6.c) Csonkakúp: r=14, R=8, a=10. Henger-közelítés relatív hibája (%). (előjeles vagy abszolút)',
            -2.4,
            '−2,4% (a 2,4% is elfogadható)',
            { alternativeAnswer: 2.4 }
        ),
        q(
            'er22me-7a',
            '2022/7.a) 5:4 búza:rozs. 450 g búza + 400 g rozs + 500 g hozzáadott. A hozzáadottból hány g búza?',
            300,
            '750 − 450 = 300 g'
        ),
        q(
            'er22me-7c',
            '2022/7.c) n(x)=0,8x(x−3)(1,5−x) (tízezer tallér). Max napi nyereség (tallér) és a liszt (t).',
            25100,
            '≈ 25 100 tallér, kb. 2,46 t',
            { alternativeAnswer: 2.46 }
        ),
        q(
            'er22me-8a',
            '2022/8.a) 7 fiú, 5 lány. Fiú–fiú kézfogás, egyébként ölelés. Hány ölelés?',
            45,
            'C(5;2)+5·7 = 10+35 = 45'
        ),
        q(
            'er22me-8b',
            '2022/8.b) 6 játékos, 9 meccs, minden fok páratlan. Játszott-e már Dóra Fanni ellen? igen=1, nem=0.',
            0,
            'a DF él nem létezik'
        ),
        q(
            'er22me-8c',
            '2022/8.c) Bori 5-öst dobott. P(Bori nyer) (három tizedes).',
            0.356,
            '77/216 ≈ 0,356'
        ),
        q(
            'er22me-9a',
            '2022/9.a) Parabola fókusza és a kör középpontja: y-koordináták? (fókusz, majd C)',
            7.5,
            'fókusz (0; 7,5), C(0; 3)',
            { alternativeAnswer: 3 }
        ),
        q(
            'er22me-9c',
            '2022/9.c) A parabola és az x-tengely közrezárta korlátos síkidom területe.',
            42.667,
            '128/3',
            { alternativeAnswer: 128 / 3 }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2022MajEmeltBank.ts:get',
        message: 'emelt 2022 maj bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2022_MAJ_EMELT_COUNT = 20;
