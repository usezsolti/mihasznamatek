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

/** 2022. febr. 4. Mat3 (UI: 2022 harmadik kártya) — útmutató szerint. */
export function getKozponti2022MarQuestions(): Question[] {
    const mapFig = imageFigure('/figures/kozponti/2022mar/t3-terkep.png', '2022/3. ot varos terkep');
    const chartFig = imageFigure('/figures/kozponti/2022mar/t4-diagram.jpeg', '2022/4. feladat atlagok');
    const triFig = imageFigure('/figures/kozponti/2022mar/t5-haromszog.png', '2022/5. ABC haromszog P');
    const solidFig = imageFigure('/figures/kozponti/2022mar/t9-test.png', '2022/9. negy negyzetes hasab');

    const list: Question[] = [
        q(
            'kf2022m-1a',
            '2022/1.a) K a legkisebb páratlan kétjegyű négyzetszám. Mennyi K?',
            25,
            '5^2 = 25'
        ),
        q(
            'kf2022m-1b',
            '2022/1.b) L = (−20) : 5 − (−4). Mennyi L?',
            0,
            '-4 - (-4) = 0'
        ),
        q(
            'kf2022m-1c',
            '2022/1.c) M = (5/8) · (−4/15). Mennyi M? (−1/6 is jó)',
            -1 / 6,
            '-20/120 = -1/6'
        ),
        q(
            'kf2022m-1n',
            '2022/1.d) N = (−3L + K) / M. Mennyi N?',
            -150,
            '(0+25) / (-1/6) = -150'
        ),
        q(
            'kf2022m-2a',
            '2022/2.a) 360 másodperc + 24 perc = ? perc',
            30,
            '6+24 = 30'
        ),
        q(
            'kf2022m-2b',
            '2022/2.b) 5,42 m − ? mm = 5170 mm',
            250,
            '5420-5170 = 250'
        ),
        q(
            'kf2022m-2c',
            '2022/2.c) 4,1 m² + 3410 cm² = ? cm²',
            44410,
            '41000+3410 = 44410'
        ),
        q(
            'kf2022m-2d',
            '2022/2.d) 44 410 cm² = ? dm²  (444,1 is jó)',
            444.1,
            '44410 cm2 = 444,1 dm2'
        ),
        q(
            'kf2022m-3',
            '2022/3. Öt város, E-ből indulva minden városba egyszer. Példa: EABCD.\nHány megfelelő útvonal van összesen (a példa is számít)?',
            6,
            '5 tovabbi + a pelda = 6',
            { figure: mapFig }
        ),
        q(
            'kf2022m-4a',
            '2022/4.a) Melyik feladat bizonyult a legnehezebbnek? (sorszám)',
            7,
            'A 7. a legalacsonyabb atlag',
            { figure: chartFig }
        ),
        q(
            'kf2022m-4b1',
            '2022/4.b) A két feladat, amelyek átlaga között a legnagyobb a különbség. A kisebb sorszám?',
            2,
            '2. es 7.',
            { figure: chartFig }
        ),
        q(
            'kf2022m-4b2',
            '2022/4.b) A nagyobb sorszám?',
            7,
            '2. es 7.',
            { figure: chartFig }
        ),
        q(
            'kf2022m-4c',
            '2022/4.c) Mennyi a három legmagasabb átlagpontszám átlaga?',
            71,
            '(77+70+66)/3 = 71',
            { figure: chartFig }
        ),
        q(
            'kf2022m-5a',
            '2022/5.a) CB = CP. Mekkora az ABC háromszög B-nél lévő szöge? (fok)',
            70,
            'B = 70',
            { figure: triFig }
        ),
        q(
            'kf2022m-5b',
            '2022/5.b) Mekkora az ABC háromszög C-nél lévő szöge? (fok)',
            80,
            'C = 80',
            { figure: triFig }
        ),
        q(
            'kf2022m-5c',
            '2022/5.c) Mekkora az ABC háromszög A-nál lévő szöge? (fok)',
            30,
            'A = 30',
            { figure: triFig }
        ),
        q(
            'kf2022m-6a',
            '2022/6.a) 40 diák, nyelvek aránya 2 : 3 : 4 : 1 (francia : német : angol : olasz). Hányan tanulnak franciát?',
            8,
            '40 * 2/10 = 8'
        ),
        q(
            'kf2022m-6b',
            '2022/6.b) A nem angolt tanulók 1/12-e jövőre sem angolt, a mostani angolosok folytatják. A diákok hány százaléka nem tanul jövőre angolt?',
            5,
            '60 * 1/12 = 5%'
        ),
        q(
            'kf2022m-7a',
            '2022/7.a) Minden trapéznak van két olyan szöge, amelyek összege 180°.\nIgaz=1, Hamis=2',
            1,
            'Igaz -> 1'
        ),
        q(
            'kf2022m-7b',
            '2022/7.b) Van három olyan prímszám, amelyek összege páros.\nIgaz=1, Hamis=2',
            1,
            '2+3+5=10 -> Igaz -> 1'
        ),
        q(
            'kf2022m-7c',
            '2022/7.c) Nincs olyan sokszög, amelynek van homorú szöge.\nIgaz=1, Hamis=2',
            2,
            'Van homoru sokszog -> Hamis -> 2'
        ),
        q(
            'kf2022m-7d',
            '2022/7.d) Minden pozitív egész számnak van legalább két különböző pozitív osztója.\nIgaz=1, Hamis=2',
            2,
            'Az 1-nek csak egy osztoja van -> Hamis -> 2'
        ),
        q(
            'kf2022m-8a',
            '2022/8.a) 89-től 200-ig egymás mellé írva a számokat hány számjegy van?',
            325,
            '11*2 + 101*3 = 325'
        ),
        q(
            'kf2022m-8b',
            '2022/8.b) Mi a számsorban jobbról a 37. számjegy?',
            8,
            '188 utolso jegye = 8'
        ),
        q(
            'kf2022m-9a',
            '2022/9.a) Négy egybevágó négyzetes hasáb, a test leghosszabb éle 12 cm, a legrövidebb 2 cm. Hány cm a h magasság?',
            8,
            'h = 8',
            { figure: solidFig }
        ),
        q(
            'kf2022m-9b',
            '2022/9.b) Hány cm² a test felszíne?',
            224,
            '12*16 + 4*4 + 2*8 = 224',
            { figure: solidFig }
        ),
        q(
            'kf2022m-10',
            '2022/10. Megtették a tervezett út 40%-át, majd a 3/7-ét, hátra van 6 km. Hány km volt a teljes út?',
            35,
            '6 = 12/70 * x, x = 35'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H14',
        location: 'kf2022MarBank.ts:getKozponti2022MarQuestions',
        message: '2022 Feb 4 Mat3 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2022m-1a')?.answer,
            a1n: list.find((x) => x.id === 'kf2022m-1n')?.answer,
            a3: list.find((x) => x.id === 'kf2022m-3')?.answer,
            a10: list.find((x) => x.id === 'kf2022m-10')?.answer,
            mapKind: list.find((x) => x.id === 'kf2022m-3')?.figure?.kind,
            chartKind: list.find((x) => x.id === 'kf2022m-4a')?.figure?.kind,
            triKind: list.find((x) => x.id === 'kf2022m-5a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2022m-9a')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2022-mar',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2022_MAR_COUNT = 27;
