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

/** 2025. jan. 18. Mat1 — itemek a javítási útmutató szerint. */
export function getKozponti2025JanQuestions(): Question[] {
    const pieFig = imageFigure('/figures/kozponti/2025jan/t4-kor.png', '2025/4. szabadido kordiagram');
    const deltoidFig = imageFigure('/figures/kozponti/2025jan/t5-deltoid.png', '2025/5. ABCD deltoid racs');
    const triFig = imageFigure('/figures/kozponti/2025jan/t7-haromszog.png', '2025/7. ABC haromszog vazlat');
    const solidFig = imageFigure('/figures/kozponti/2025jan/t9-test.png', '2025/9. osszeragasztott test');

    const list: Question[] = [
        q(
            'kf2025-1a',
            '2025/1.a) A = 10,25 · 4. Mennyi A?',
            41,
            '10,25 · 4 = 41'
        ),
        q(
            'kf2025-1b',
            '2025/1.b) B az 1; 2; 4; 8; 10 számok átlaga. Mennyi B?',
            5,
            '(1+2+4+8+10)/5 = 25/5 = 5'
        ),
        q(
            'kf2025-1c',
            '2025/1.c) C a legkisebb pozitív egész, amelynek 1; 2; 4; 5 és 6 is osztója. Mennyi C?',
            60,
            'LKKT(1,2,4,5,6) = 60'
        ),
        q(
            'kf2025-1d',
            '2025/1.d) D a 3/4-nek a 4/5 része. Mennyi D? (0,6 vagy 3/5 is jó)',
            0.6,
            '(3/4)*(4/5) = 3/5 = 0,6'
        ),
        q(
            'kf2025-2a',
            '2025/2.a) 7 liter − 250 cm³ = ? cm³',
            6750,
            '7 liter = 7000 cm3, 7000-250 = 6750'
        ),
        q(
            'kf2025-2b',
            '2025/2.b) 2 hét + ? óra = 17 nap',
            72,
            '2 het = 14 nap, 17-14 = 3 nap = 72 ora'
        ),
        q(
            'kf2025-2c',
            '2025/2.c) ? cm + 2,4 dm = 17,5 dm',
            151,
            '17,5-2,4 = 15,1 dm = 151 cm'
        ),
        q(
            'kf2025-2d',
            '2025/2.d) 17,5 dm = ? mm',
            1750,
            '17,5 dm = 1750 mm'
        ),
        q(
            'kf2025-3',
            '2025/3. Négy boríték: A, B, C, D. Négy betűkártya: A, B, C, D. Pontosan egy borítékban egyezik a kártya a boríték betűjével.\nHány megfelelő elrendezés van összesen (a példa is számít)?',
            8,
            'Pontosan 1 fixpont: 4 * !3 = 4*2 = 8'
        ),
        q(
            'kf2025-4a',
            '2025/4.a) Olvasás középponti szöge? (fok)',
            90,
            '30 fo = 135 fok, 1 fo = 4,5 fok, 20*4,5 = 90',
            { figure: pieFig }
        ),
        q(
            'kf2025-4b',
            '2025/4.a) Számítógépes játékok középponti szöge? (fok)',
            45,
            '10*4,5 = 45',
            { figure: pieFig }
        ),
        q(
            'kf2025-4c',
            '2025/4.a) Filmnézés hány fő?',
            5,
            '22,5 / 4,5 = 5',
            { figure: pieFig }
        ),
        q(
            'kf2025-4d',
            '2025/4.d) A megkérdezettek hány százaléka tölti zenehallgatással? (két tizedes, 18,75)',
            18.75,
            'Osszes: 30+20+15+10+5=80. 15/80*100 = 18,75',
            { figure: pieFig }
        ),
        q(
            'kf2025-5dx',
            '2025/5.b) ABCD deltoid, szimmetriatengely párhuzamos az y tengellyel, minden csúcs rácspont. D x-koordinátája?',
            8,
            'A es C x=4 (tengely). B(0;7) tukre D(8;7)',
            { figure: deltoidFig }
        ),
        q(
            'kf2025-5dy',
            '2025/5.b) D y-koordinátája?',
            7,
            'D(8; 7)',
            { figure: deltoidFig }
        ),
        q(
            'kf2025-5t',
            '2025/5.e) Az ABCD deltoid területe? (egy rácsnégyzet = 1)',
            36,
            'T = AC*BD/2 = 9*8/2 = 36',
            { figure: deltoidFig }
        ),
        q(
            'kf2025-6a',
            '2025/6. Háromszor annyi háromszög, mint négyszög, összesen 117 csúcs, nincs közös pont.\nHány háromszöget rajzolt?',
            27,
            '4x + 9x = 117, 13x=117, x=9 negyszog, 3x=27 haromszog'
        ),
        q(
            'kf2025-6b',
            '2025/6. Hány négyszöget rajzolt?',
            9,
            'x = 9'
        ),
        q(
            'kf2025-7a',
            '2025/7.a) ABC egyenlő szárú, AB=AC, alfa=44 fok. Mekkora a B csúcsánál lévő béta szög? (fok)',
            68,
            'beta = (180-44)/2 = 68',
            { figure: triFig }
        ),
        q(
            'kf2025-7b',
            '2025/7.b) Mekkora a BDG háromszög D csúcsánál lévő delta szög? (fok)',
            40,
            'AGD=108, delta = 108-beta = 40',
            { figure: triFig }
        ),
        q(
            'kf2025-7c',
            '2025/7.c) Mekkora a mu-val jelölt szög? (fok)',
            110,
            'DE szogfelezo, mu = 90 + delta/2 = 110',
            { figure: triFig }
        ),
        q(
            'kf2025-8a',
            '2025/8.a) Mennyi az x értéke, ha 15^15 − 15^14 = x · 15^14 ?\n(A) 15\n(B) 14\n(C) 1\n(D) 29\nBetű száma: A=1, B=2, C=3, D=4',
            2,
            '15^14 * (15-1) = x * 15^14, x=14 -> B -> 2'
        ),
        q(
            'kf2025-8b',
            '2025/8.b) Egyenlő szárú háromszög szára 17 cm, kerülete 43 cm. Az alap hossza cm-ben?\n(A) 26\n(B) 13\n(C) 9\n(D) 4,5\nBetű száma: A=1 ... D=4',
            3,
            '43-17-17=9 -> C -> 3'
        ),
        q(
            'kf2025-8c',
            '2025/8.c) Melyik állítás igaz?\n(A) Minden tört egyszerűsíthető, ha számlálója és nevezője is 3-ra végződik.\n(B) Minden 6-jegyű szám osztható 6-tal, ha minden számjegye egyenlő.\n(C) Ha két pozitív tört számlálója egyenlő, a kisebb nevezőjű a nagyobb.\n(D) Ha két egész összege természetes, mindkét szám természetes.\nBetű száma: A=1 ... D=4',
            3,
            'C igaz -> 3'
        ),
        q(
            'kf2025-8d',
            '2025/8.d) Hány olyan egész szám van, amely nagyobb, mint −9, de kisebb, mint 82?\n(A) 92\n(B) 91\n(C) 90\n(D) 89\nBetű száma: A=1 ... D=4',
            3,
            '-8-tol 81-ig: 81-(-8)+1 = 90 -> C -> 3'
        ),
        q(
            'kf2025-9',
            '2025/9. Két egybevágó téglatest és két egybevágó négyzetes oszlop (alap 1 cm). Hány cm² a test felszíne?',
            116,
            '2*(14+10+34) = 116, vagy 2*40+2*22-8 = 116',
            { figure: solidFig }
        ),
        q(
            'kf2025-10',
            '2025/10. Piros, kék, sárga labdák. 11 kivételével mind piros, 12 kivételével mind kék, 13 kivételével mind sárga.\nHány piros labda van?',
            7,
            'x = 3x-36, x=18, piros = 18-11 = 7'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H6',
        location: 'kf2025JanBank.ts:getKozponti2025JanQuestions',
        message: '2025 Jan Mat1 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2025-1a')?.answer,
            a8a: list.find((x) => x.id === 'kf2025-8a')?.answer,
            a10: list.find((x) => x.id === 'kf2025-10')?.answer,
            pieKind: list.find((x) => x.id === 'kf2025-4a')?.figure?.kind,
            deltoidKind: list.find((x) => x.id === 'kf2025-5dx')?.figure?.kind,
            triKind: list.find((x) => x.id === 'kf2025-7a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2025-9')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2025-jan',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2025_JAN_COUNT = 27;
