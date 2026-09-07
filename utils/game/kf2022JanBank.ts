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

/** 2022. jan. 22. Mat1 — itemek a javítási útmutató szerint. */
export function getKozponti2022JanQuestions(): Question[] {
    const graphFig = imageFigure('/figures/kozponti/2022jan/t4-grafikon.png', '2022/4. A es B mozdony grafikon');
    const quadFig = imageFigure('/figures/kozponti/2022jan/t5-negyzet.png', '2022/5. ABCD negyszog P, CP');
    const solidFig = imageFigure('/figures/kozponti/2022jan/t9-test.png', '2022/9. kilenc kocka');

    const list: Question[] = [
        q(
            'kf2022-1a',
            '2022/1.a) A = 36 : (5 · 4). Mennyi A? (1,8 is jó)',
            1.8,
            '36 / 20 = 1,8'
        ),
        q(
            'kf2022-1b',
            '2022/1.b) B a 24 és a 9 legkisebb közös többszöröse. Mennyi B?',
            72,
            'LKKT(24,9) = 72'
        ),
        q(
            'kf2022-1c',
            '2022/1.c) C-nek a kétharmada 32. Mennyi C?',
            48,
            'C * 2/3 = 32, C = 48'
        ),
        q(
            'kf2022-1d',
            '2022/1.d) D = 2/3 − 2/5. Mennyi D? (4/15 is jó)',
            4 / 15,
            '10/15 - 6/15 = 4/15'
        ),
        q(
            'kf2022-2a',
            '2022/2.a) 15 000 g + 3 kg = ? kg',
            18,
            '15 kg + 3 kg = 18 kg'
        ),
        q(
            'kf2022-2b',
            '2022/2.b) 1700 cm³ + ? dm³ = 4700 cm³',
            3,
            '4700-1700 = 3000 cm3 = 3 dm3'
        ),
        q(
            'kf2022-2c',
            '2022/2.c) 2,5 m − 130 mm = ? mm',
            2370,
            '2500 mm - 130 mm = 2370 mm'
        ),
        q(
            'kf2022-2d',
            '2022/2.d) 2370 mm = ? cm',
            237,
            '2370 mm = 237 cm'
        ),
        q(
            'kf2022-3',
            '2022/3. Tíz négyzet, öt X. A számok azt jelzik, hány szomszédos négyzetbe kell X (közös oldal vagy csúcs). A számos négyzetbe nem kerülhet X. Példa meg van adva.\nHány megfelelő elrendezés van összesen (a példa is számít)?',
            6,
            '5 tovabbi + a pelda = 6'
        ),
        q(
            'kf2022-4a',
            '2022/4.a) Hány alkalommal haladtak el egymás mellett a mozdonyok? (Az A elindulását ne számítsd!)',
            3,
            '3 metszespont t>0',
            { figure: graphFig }
        ),
        q(
            'kf2022-4b',
            '2022/4.b) Hány másodpercig állt a B mozdony?',
            4,
            '0-2 es 5-7: 4 s',
            { figure: graphFig }
        ),
        q(
            'kf2022-4c',
            '2022/4.c) Hány dm utat futott be összesen az A mozdony?',
            27,
            '10+1+7+8+1 = 27',
            { figure: graphFig }
        ),
        q(
            'kf2022-4d',
            '2022/4.d) Hány másodpercig közeledett az indulási ponthoz az A mozdony?',
            5,
            '1+3+1 = 5',
            { figure: graphFig }
        ),
        q(
            'kf2022-5a',
            '2022/5.a) CP felezi a C-nél lévő szöget, CD = CP, PB = AB. Mekkora a δ szög? (fok)',
            73,
            'CDP egyenlo szaru, delta = 73',
            { figure: quadFig }
        ),
        q(
            'kf2022-5b',
            '2022/5.b) Mekkora az ABP háromszögben az A-nál lévő α szög? (fok)',
            69,
            '180-38-73 = 69',
            { figure: quadFig }
        ),
        q(
            'kf2022-5c',
            '2022/5.c) Mekkora az ABCD négyszögben a C-nél lévő γ szög? (fok)',
            68,
            '2*(180-73-73) = 68',
            { figure: quadFig }
        ),
        q(
            'kf2022-5d',
            '2022/5.d) Mekkora az ABCD négyszögben a B-nél lévő β szög? (fok)',
            150,
            '360-73-69-68 = 150',
            { figure: quadFig }
        ),
        q(
            'kf2022-6',
            '2022/6. Tibi 15 jegyet kapott: 4 darab hármas, a többi négyes vagy ötös, átlag 4,2. Hány ötöst kapott?',
            7,
            '56+x = 63, x = 7'
        ),
        q(
            'kf2022-7a',
            '2022/7.a) Hány 0-ra végződik az 1·2·…·12 szorzat?\n(A) 1\n(B) 2\n(C) 3\n(D) 4\nBetű száma: A=1, B=2, C=3, D=4',
            2,
            '12! ket nulla -> B -> 2'
        ),
        q(
            'kf2022-7b',
            '2022/7.b) Melyik a legnagyobb az alábbiak közül, amivel a 7428 osztható?\n(A) 4\n(B) 6\n(C) 12\n(D) 24\nBetű száma: A=1 ... D=4',
            3,
            '7428 oszthato 12-vel, 24-gyel nem -> C -> 3'
        ),
        q(
            'kf2022-7c',
            '2022/7.c) Hány százaléka az 50-nek a 75?\n(A) 66%\n(B) 125%\n(C) 75%\n(D) 150%\nBetű száma: A=1 ... D=4',
            4,
            '75/50 = 150% -> D -> 4'
        ),
        q(
            'kf2022-7d',
            '2022/7.d) Hány hegyesszöge lehet legfeljebb egy konvex négyszögnek?\n(A) 1\n(B) 2\n(C) 3\n(D) 4\nBetű száma: A=1 ... D=4',
            3,
            'Max 3 hegyesszog -> C -> 3'
        ),
        q(
            'kf2022-8a',
            '2022/8.a) x = 4, y = 5. Mennyi 2x − 3y?',
            -7,
            '8 - 15 = -7'
        ),
        q(
            'kf2022-8b',
            '2022/8.b) x = 9, 2x − 3y = 0. Mennyi y?',
            6,
            '18 - 3y = 0, y = 6'
        ),
        q(
            'kf2022-8c',
            '2022/8.c) y = −6, 2x − 3y = 8. Mennyi x?',
            -5,
            '2x + 18 = 8, x = -5'
        ),
        q(
            'kf2022-9',
            '2022/9. Kilenc egybevágó kocka, él 3 cm, szomszédos kockák teljes lappal ragasztva. Hány cm² a test felszíne?',
            324,
            '36 * 9 = 324',
            { figure: solidFig }
        ),
        q(
            'kf2022-10',
            '2022/10. A jelentkezők 1/15-e nem jelent meg. A megjelentek 5/7-e ment tovább, majd 40%-ukat igazolták: 28 fő. Hányan jelentkeztek előzetesen?',
            105,
            '28/0,4 = 70, 70/(5/7)=98, 98/(14/15)=105'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'kf2022JanBank.ts:getKozponti2022JanQuestions',
        message: '2022 Jan Mat1 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2022-1a')?.answer,
            a3: list.find((x) => x.id === 'kf2022-3')?.answer,
            a9: list.find((x) => x.id === 'kf2022-9')?.answer,
            a10: list.find((x) => x.id === 'kf2022-10')?.answer,
            graphKind: list.find((x) => x.id === 'kf2022-4a')?.figure?.kind,
            quadKind: list.find((x) => x.id === 'kf2022-5a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2022-9')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2022-jan',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2022_JAN_COUNT = 27;
