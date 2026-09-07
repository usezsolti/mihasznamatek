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

/** 2022. jan. 27. Mat2 (UI: 2022 Január 27 kártya) — útmutató szerint. */
export function getKozponti2022FebQuestions(): Question[] {
    const pieFig = imageFigure('/figures/kozponti/2022feb/t4-kor.jpeg', '2022/4. kartonlapok kordiagram');
    const triFig = imageFigure('/figures/kozponti/2022feb/t5-haromszog.png', '2022/5. ABC haromszog e, f');
    const solidFig = imageFigure('/figures/kozponti/2022feb/t9-test.jpeg', '2022/9. ot negyzetes oszlop');

    const list: Question[] = [
        q(
            'kf2022f-1a',
            '2022/1.a) A = 0,042 · 10⁴. Mennyi A?',
            420,
            '0,042 * 10000 = 420'
        ),
        q(
            'kf2022f-1b',
            '2022/1.b) B a 327,6 tízesekre kerekített értéke. Mennyi B?',
            330,
            '327,6 -> 330'
        ),
        q(
            'kf2022f-1c',
            '2022/1.c) C = 35 : 5 · 4. Mennyi C?',
            28,
            '7 * 4 = 28'
        ),
        q(
            'kf2022f-1d',
            '2022/1.d) D = 15 : (3/4). Mennyi D? (20 vagy 60/3 is jó)',
            20,
            '15 * 4/3 = 20'
        ),
        q(
            'kf2022f-2a',
            '2022/2.a) 3/4 óra − 0,4 óra = ? perc',
            21,
            '0,35 ora = 21 perc'
        ),
        q(
            'kf2022f-2b',
            '2022/2.b) 17,2 dm³ + ? liter = 22 dm³  (4,8 is jó)',
            4.8,
            '22-17,2 = 4,8 liter'
        ),
        q(
            'kf2022f-2c',
            '2022/2.c) 7 m² − 5000 cm² = ? cm²',
            65000,
            '70000-5000 = 65000'
        ),
        q(
            'kf2022f-2d',
            '2022/2.d) 65 000 cm² = ? dm²',
            650,
            '65000 cm2 = 650 dm2'
        ),
        q(
            'kf2022f-3',
            '2022/3. Lépcső A-tól F-ig, egyszerre 1 vagy 2 fok. Példa: ACDEF.\nHány megfelelő lépéssorozat van összesen (a példa is számít)?',
            8,
            '7 tovabbi + a pelda = 8'
        ),
        q(
            'kf2022f-4a',
            '2022/4.a) 72 kartonlap, piros–kék–fehér kördiagram. Hány darab piros?',
            12,
            '72 * 2/12 = 12',
            { figure: pieFig }
        ),
        q(
            'kf2022f-4b',
            '2022/4.b) Hány fokos középponti szög tartozik a fehér körcikkhez?',
            150,
            '5/12 * 360 = 150',
            { figure: pieFig }
        ),
        q(
            'kf2022f-4c',
            '2022/4.c) Hány százaléka a piros lapok száma a kék lapok számának?',
            40,
            '12/30 = 40%',
            { figure: pieFig }
        ),
        q(
            'kf2022f-4d',
            '2022/4.d) Hány piros lapot kellene négyfelé vágni, hogy ugyanannyi piros darab legyen, mint kék?',
            6,
            '12+3n = 30, n = 6',
            { figure: pieFig }
        ),
        q(
            'kf2022f-5a',
            '2022/5.a) e és f harmadolja a C-nél lévő szöget, CP = PB. Mekkora a δ szög? (fok)',
            78,
            '180-102 = 78',
            { figure: triFig }
        ),
        q(
            'kf2022f-5b',
            '2022/5.b) Mekkora az ABC háromszögben a B-nél lévő β szög? (fok)',
            34,
            'beta = 34',
            { figure: triFig }
        ),
        q(
            'kf2022f-5c',
            '2022/5.c) Mekkora az ABC háromszögben a C-nél lévő γ szög? (fok)',
            102,
            'gamma = 3*34 = 102',
            { figure: triFig }
        ),
        q(
            'kf2022f-5d',
            '2022/5.d) Mekkora az ABC háromszögben az A-nál lévő α szög? (fok)',
            44,
            '180-102-34 = 44',
            { figure: triFig }
        ),
        q(
            'kf2022f-6a',
            '2022/6.a) 36 diák, 75% fiú. Hány lány jár az osztályba?',
            9,
            '25% * 36 = 9'
        ),
        q(
            'kf2022f-6b',
            '2022/6.b) A diákok 2/3-a barna hajú, 18 barna hajú fiú. Hány barna hajú lány van?',
            6,
            '24-18 = 6'
        ),
        q(
            'kf2022f-7a',
            '2022/7.a) Ha egy háromszögben két hegyesszög összege 90°, mit állíthatunk biztosan?\n(A) hegyesszögű\n(B) derékszögű\n(C) egyenlő szárú\n(D) tompaszögű\nBetű száma: A=1, B=2, C=3, D=4',
            2,
            '180-90 = 90 -> derekszogu -> B -> 2'
        ),
        q(
            'kf2022f-7b',
            '2022/7.b) e: y = 3x − 5, f: y = −2x + 10. Melyik egyenesen van P(3; 4)?\n(A) Csak e-n\n(B) Csak f-en\n(C) Egyiken sem\n(D) Mindkettőn, közös pont\nBetű száma: A=1 ... D=4',
            4,
            '3*3-5=4 es -2*3+10=4 -> D -> 4'
        ),
        q(
            'kf2022f-7c',
            '2022/7.c) Mennyi a 72 és a 48 legnagyobb közös osztója?\n(A) 8\n(B) 12\n(C) 24\n(D) 144\nBetű száma: A=1 ... D=4',
            3,
            'LNKO(72,48)=24 -> C -> 3'
        ),
        q(
            'kf2022f-7d',
            '2022/7.d) Hány közös pontja nem lehet egy körvonalnak és egy téglalap határvonalának?\n(A) 3\n(B) 4\n(C) 8\n(D) 9\nBetű száma: A=1 ... D=4',
            4,
            '9 nem lehet -> D -> 4'
        ),
        q(
            'kf2022f-8t',
            '2022/8. 3-mal több tyúk, mint kacsa; 7-tel több kacsa, mint liba; a tyúkok száma a libák kétszerese. Hány tyúk van?',
            20,
            'x = 2(x-10), x = 20'
        ),
        q(
            'kf2022f-8k',
            '2022/8. Hány kacsa van?',
            17,
            '20-3 = 17'
        ),
        q(
            'kf2022f-8l',
            '2022/8. Hány liba van?',
            10,
            '20-10 = 10'
        ),
        q(
            'kf2022f-9',
            '2022/9. Öt egybevágó négyzetes oszlop, a = 2 cm, b = 5 cm. Hány cm² a test felszíne?',
            208,
            '5*48 - 8*4 = 208',
            { figure: solidFig }
        ),
        q(
            'kf2022f-10',
            '2022/10. Reggel a harmadát + 4 l, délután a maradék felét + 10 l, este a felét + 5 l, maradt 10 l. Hány liter volt eredetileg?',
            126,
            'visszafele: 15*2=30, 40*2=80, 84*1,5=126'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H13',
        location: 'kf2022FebBank.ts:getKozponti2022FebQuestions',
        message: '2022 Jan 27 Mat2 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2022f-1a')?.answer,
            a3: list.find((x) => x.id === 'kf2022f-3')?.answer,
            a9: list.find((x) => x.id === 'kf2022f-9')?.answer,
            a10: list.find((x) => x.id === 'kf2022f-10')?.answer,
            pieKind: list.find((x) => x.id === 'kf2022f-4a')?.figure?.kind,
            triKind: list.find((x) => x.id === 'kf2022f-5a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2022f-9')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2022-feb',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2022_FEB_COUNT = 28;
