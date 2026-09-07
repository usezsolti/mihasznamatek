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

/** 2023. jan. 31. Mat2 (UI: 2023 Január 31 kártya) — útmutató szerint. */
export function getKozponti2023FebQuestions(): Question[] {
    const chartFig = imageFigure('/figures/kozponti/2023feb/t4-diagram.png', '2023/4. fej-iras arany diagram');
    const triFig = imageFigure('/figures/kozponti/2023feb/t5-haromszog.png', '2023/5. ABC haromszog D, E');
    const solidFig = imageFigure('/figures/kozponti/2023feb/t9-test.png', '2023/9. ot negyzetes oszlop');

    const list: Question[] = [
        q(
            'kf2023f-1a',
            '2023/1.a) A = 8 : 1,6. Mennyi A?',
            5,
            '8 / 1,6 = 5'
        ),
        q(
            'kf2023f-1b',
            '2023/1.b) B az 1,6-nek a 3/8-ad része. Mennyi B? (0,6 vagy 3/5 is jó)',
            0.6,
            '1,6 * 3/8 = 0,6'
        ),
        q(
            'kf2023f-1c',
            '2023/1.c) C a 3/8-nál 1,6-del kisebb szám. Mennyi C? (−1,225 vagy −49/40 is jó)',
            -1.225,
            '3/8 - 1,6 = -1,225'
        ),
        q(
            'kf2023f-1e',
            '2023/1.e) 3/7, 3/8 és 8/3 növekvő sorrendjében a 3/7 hányadik? (1 = legkisebb)',
            2,
            '3/8 < 3/7 < 8/3, a 3/7 a 2.'
        ),
        q(
            'kf2023f-2a',
            '2023/2.a) 24 000 g − ? kg = 18 000 g',
            6,
            '24000-18000 = 6000 g = 6 kg'
        ),
        q(
            'kf2023f-2b',
            '2023/2.b) 2 dm² + 4600 mm² = ? dm²  (2,46 is jó)',
            2.46,
            '4600 mm2 = 0,46 dm2, 2+0,46 = 2,46'
        ),
        q(
            'kf2023f-2c',
            '2023/2.c) 245 perc + ? perc = 6 óra',
            115,
            '6 ora = 360 perc, 360-245 = 115'
        ),
        q(
            'kf2023f-2d',
            '2023/2.d) 6 óra = ? nap  (0,25 vagy 1/4 is jó)',
            0.25,
            '6/24 = 1/4 = 0,25'
        ),
        q(
            'kf2023f-3',
            '2023/3. Nekeresd–Piripócs 4 : 2, Piripócs soha nem vezetett. Példa: N P N N P N.\nHány megfelelő gólsorrend van összesen (a példa is számít)?',
            9,
            '8 tovabbi + a pelda = 9'
        ),
        q(
            'kf2023f-4a',
            '2023/4.a) Hányadik dobásnál dobtunk először fejet?',
            2,
            'Az 1. dobas 0%, a 2. 50% -> 2.',
            { figure: chartFig }
        ),
        q(
            'kf2023f-4b',
            '2023/4.b) Hány százalék volt az első öt dobásban az írások aránya?',
            80,
            '5. dobasnal 20% fej, iras 80%',
            { figure: chartFig }
        ),
        q(
            'kf2023f-4c',
            '2023/4.c) Hány írás lett a tíz dobásból?',
            6,
            '10. dobasnal 40% fej = 4 fej, 6 iras',
            { figure: chartFig }
        ),
        q(
            'kf2023f-4d',
            '2023/4.d) Hányszor dobtunk írás után közvetlenül fejet?',
            3,
            'TH, TH, TH = 3',
            { figure: chartFig }
        ),
        q(
            'kf2023f-5a',
            '2023/5.a) AC = EC, AB = DB. EBC-ben az E-nél 112°, ACD-ben az A-nál 7°. Mekkora az α szög? (fok)',
            68,
            'AEC-ben 180-112=68, AC=EC, alfa = 68',
            { figure: triFig }
        ),
        q(
            'kf2023f-5b',
            '2023/5.b) Mekkora az ABD háromszögben a D-nél lévő δ szög? (fok)',
            75,
            '68+7 = 75',
            { figure: triFig }
        ),
        q(
            'kf2023f-5c',
            '2023/5.c) Mekkora az ABC háromszögben a C-nél lévő γ szög? (fok)',
            82,
            '75+7 = 82',
            { figure: triFig }
        ),
        q(
            'kf2023f-5d',
            '2023/5.d) Mekkora az ABC háromszögben a B-nél lévő β szög? (fok)',
            30,
            '180-68-82 = 30',
            { figure: triFig }
        ),
        q(
            'kf2023f-6',
            '2023/6. Két egyforma deszka, az egyiket 14 cm-rel rövidítették. A hosszak aránya 12 : 14. Hány cm volt eredetileg egy deszka?',
            98,
            '14 egyseg : 12 egyseg, 2 egyseg = 14 cm, 14*7 = 98'
        ),
        q(
            'kf2023f-7a',
            '2023/7.a) Mennyi a 13 427 százasokra kerekített értéke?\n(A) 13 430\n(B) 13 500\n(C) 13 400\n(D) 13 000\nBetű száma: A=1, B=2, C=3, D=4',
            3,
            '13400 -> C -> 3'
        ),
        q(
            'kf2023f-7b',
            '2023/7.b) A 237 8X5 15-tel osztható, X a tízesek helyén. Melyik lehet X?\n(A) 0\n(B) 1\n(C) 2\n(D) 3\nBetű száma: A=1 ... D=4',
            3,
            'X = 2 -> C -> 3'
        ),
        q(
            'kf2023f-7c',
            '2023/7.c) Melyik állítás igaz?\n(A) Minden téglalap négyzet.\n(B) Minden tengelyesen szimmetrikus háromszög szabályos.\n(C) Minden prímszám páratlan.\n(D) Minden négyzetes oszlop téglatest.\nBetű száma: A=1 ... D=4',
            4,
            'Negyzetes oszlop = teglatest -> D -> 4'
        ),
        q(
            'kf2023f-7d',
            '2023/7.d) Melyik állítás igaz minden háromszög legalább egyik súlyvonalára?\n(A) Felezi a háromszög egyik oldalát.\n(B) Nincs a háromszög belsejében.\n(C) Merőleges a háromszög egyik oldalára.\n(D) A háromszög egyik szögét felezi.\nBetű száma: A=1 ... D=4',
            1,
            'A sulyvonal felezi az oldalt -> A -> 1'
        ),
        q(
            'kf2023f-8',
            '2023/8. 16 palacsintához 60 dkg liszt, 6 dl tej, 4 tojás kell. Van 2 kg liszt, 7 tojás, 1,5 liter tej. Legfeljebb hány palacsinta sül ki?',
            28,
            'A 7 tojas a szuk keresztmetszet: 7/4 * 16 = 28'
        ),
        q(
            'kf2023f-9a',
            '2023/9.a) Öt egybevágó négyzetes oszlop, a test leghosszabb éle 9 cm, a legrövidebb 1 cm. Mennyi a?',
            1,
            'a = 1 cm',
            { figure: solidFig }
        ),
        q(
            'kf2023f-9b',
            '2023/9.a) Mennyi b?',
            4,
            '2b + a = 9, b = 4',
            { figure: solidFig }
        ),
        q(
            'kf2023f-9s',
            '2023/9.b) Hány cm² a test felszíne?',
            82,
            '5*18 - 8 = 82',
            { figure: solidFig }
        ),
        q(
            'kf2023f-10f',
            '2023/10. Kiment 10 fiú, kétszer annyi lány maradt, mint fiú. Majd kiment 15 lány, háromszor annyi fiú maradt, mint lány. Hány fiú volt eredetileg?',
            19,
            'x=19 fiu, 18 lany'
        ),
        q(
            'kf2023f-10l',
            '2023/10. Hány lány volt eredetileg?',
            18,
            '19 fiu, 18 lany'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H11',
        location: 'kf2023FebBank.ts:getKozponti2023FebQuestions',
        message: '2023 Jan 31 Mat2 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2023f-1a')?.answer,
            a3: list.find((x) => x.id === 'kf2023f-3')?.answer,
            a8: list.find((x) => x.id === 'kf2023f-8')?.answer,
            a10l: list.find((x) => x.id === 'kf2023f-10l')?.answer,
            chartKind: list.find((x) => x.id === 'kf2023f-4a')?.figure?.kind,
            triKind: list.find((x) => x.id === 'kf2023f-5a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2023f-9a')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2023-feb',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2023_FEB_COUNT = 28;
