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

/** 2024. jan. 20. Mat1 — itemek a javítási útmutató szerint. */
export function getKozponti2024JanQuestions(): Question[] {
    const chartFig = imageFigure('/figures/kozponti/2024jan/t4-diagram.png', '2024/4. gyakorlasi ido diagram');
    const coordFig = imageFigure('/figures/kozponti/2024jan/t5-koord.png', '2024/5. f egyenes, B, D, E');
    const pentFig = imageFigure('/figures/kozponti/2024jan/t7-otszog.png', '2024/7. ABCDE otszog');
    const prismFig = imageFigure('/figures/kozponti/2024jan/t9-hasab.png', '2024/9. haromszog alapu hasab');

    const list: Question[] = [
        q(
            'kf2024-1a',
            '2024/1.a) A = 1 2/9 − 2. Mennyi A? (−7/9 vagy −0,78 is jó)',
            -7 / 9,
            '11/9 - 2 = -7/9'
        ),
        q(
            'kf2024-1b',
            '2024/1.b) 7^9 · 7^8 = 7^B. Mennyi B?',
            17,
            '9+8 = 17'
        ),
        q(
            'kf2024-1c',
            '2024/1.c) C a 2; 3; 3; 4; 5; 2; 3; 3; 2; 4; 1 számsokaság módusza. Mennyi C?',
            3,
            'A 3 a leggyakoribb. C = 3'
        ),
        q(
            'kf2024-1d',
            '2024/1.d) D számjegy, a 32D57 osztható 9-cel. Mennyi D?',
            1,
            '3+2+D+5+7 = 17+D, D = 1'
        ),
        q(
            'kf2024-2a',
            '2024/2.a) 12 dkg + ? g = 731 g',
            611,
            '12 dkg = 120 g, 731-120 = 611 g'
        ),
        q(
            'kf2024-2b',
            '2024/2.b) 3000 másodperc − ? perc = 30 perc',
            20,
            '3000 s = 50 perc, 50-30 = 20 perc'
        ),
        q(
            'kf2024-2c',
            '2024/2.c) ? dm² + 82 500 cm² = 1750 dm²',
            925,
            '82500 cm2 = 825 dm2, 1750-825 = 925 dm2'
        ),
        q(
            'kf2024-2d',
            '2024/2.d) 1750 dm² = ? m²  (17,5 is jó)',
            17.5,
            '1750 dm2 = 17,5 m2'
        ),
        q(
            'kf2024-3',
            '2024/3. Pad: A, B, C, D, E. A és C nem szomszéd; A és B szomszéd; C és E nem szomszéd; E nem szélen. Példa: C–B–A–E–D.\nHány megfelelő sorrend van összesen (a példa is számít)?',
            6,
            '5 tovabbi + a pelda = 6'
        ),
        q(
            'kf2024-4a',
            '2024/4.a) Hány napon gyakorolt Emese a felvételire?',
            10,
            '1+3+1+4+1 = 10 nap',
            { figure: chartFig }
        ),
        q(
            'kf2024-4c',
            '2024/4.c) Hány percet gyakorolt összesen?',
            160,
            '1*5 + 3*10 + 1*15 + 4*20 + 1*30 = 160',
            { figure: chartFig }
        ),
        q(
            'kf2024-4e',
            '2024/4.e) Az utolsó öt napon hány percet gyakorolt naponta átlagosan?',
            22,
            '(4*20 + 30)/5 = 110/5 = 22',
            { figure: chartFig }
        ),
        q(
            'kf2024-5ay',
            '2024/5.b) B(4; 2) és D(0; 4) az f egyenesen. A is f-en van, x = −2. A y-koordinátája?',
            5,
            'f meredeksege -1/2, A(-2; 5)',
            { figure: coordFig }
        ),
        q(
            'kf2024-5cx',
            '2024/5.d) C a B pont y tengelyre vonatkozó tükörképe. C x-koordinátája?',
            -4,
            'C(-4; 2)',
            { figure: coordFig }
        ),
        q(
            'kf2024-5cy',
            '2024/5.d) C y-koordinátája?',
            2,
            'C(-4; 2)',
            { figure: coordFig }
        ),
        q(
            'kf2024-5t',
            '2024/5.g) Az EDB háromszög területe? (egy rácsnégyzet = 1)',
            9,
            'ED=9, magassag=2, T=9*2/2=9',
            { figure: coordFig }
        ),
        q(
            'kf2024-6',
            '2024/6. 120 g szappan 150 Ft, majd 80 g 160 Ft. Hányszorosára emelkedett 1 kg ára? (1,6 vagy 8/5 is jó)',
            1.6,
            '1250 Ft/kg -> 2000 Ft/kg, 2000/1250 = 1,6'
        ),
        q(
            'kf2024-7a',
            '2024/7.a) PA=PB=PD=PE, PBCD négyzet. Mekkora az alfa szög? (fok)',
            106,
            'alfa = 106',
            { figure: pentFig }
        ),
        q(
            'kf2024-7b',
            '2024/7.b) Mekkora a DEP háromszög E csúcsánál lévő béta szög? (fok)',
            38,
            'beta = 38',
            { figure: pentFig }
        ),
        q(
            'kf2024-7c',
            '2024/7.c) Mekkora a PDA háromszög D csúcsánál lévő gamma szög? (fok)',
            8,
            'gamma = 8',
            { figure: pentFig }
        ),
        q(
            'kf2024-7d',
            '2024/7.d) Mekkora a DAE háromszög A csúcsánál lévő delta szög? (fok)',
            52,
            'delta = 52',
            { figure: pentFig }
        ),
        q(
            'kf2024-8a',
            '2024/8.a) Mennyi a 12 pozitív osztóinak az összege?\n(A) 15\n(B) 16\n(C) 28\n(D) 27\nBetű száma: A=1, B=2, C=3, D=4',
            3,
            '1+2+3+4+6+12 = 28 -> C -> 3'
        ),
        q(
            'kf2024-8b',
            '2024/8.b) Téglalap kerülete 35 cm, hosszabb oldal 14 cm. A rövidebb oldal cm-ben?\n(A) 21\n(B) 3,5\n(C) 10,5\n(D) 7\nBetű száma: A=1 ... D=4',
            2,
            '(35-28)/2 = 3,5 -> B -> 2'
        ),
        q(
            'kf2024-8c',
            '2024/8.c) Mennyi a 12 és a 15 legkisebb közös többszöröse?\n(A) 180\n(B) 60\n(C) 120\n(D) 90\nBetű száma: A=1 ... D=4',
            2,
            'LKKT(12,15) = 60 -> B -> 2'
        ),
        q(
            'kf2024-8d',
            '2024/8.d) Melyik lehet egy háromszög három oldala?\n(A) 12; 47,5; 35,5\n(B) 5; 13; 7\n(C) 22; 33; 44\n(D) 17; 25; 6\nBetű száma: A=1 ... D=4',
            3,
            '22+33>44, tobbi nem -> C -> 3'
        ),
        q(
            'kf2024-9',
            '2024/9. Háromszög alapú egyenes hasáb: a=10, b=20, c=24, d=8 cm. Hány cm³ a térfogat?',
            1920,
            'Alap: 24*8/2=96, V=96*20=1920',
            { figure: prismFig }
        ),
        q(
            'kf2024-10',
            '2024/10. András a nyáj 1/4-ét, Béla 1/3-át kapja. Csaba a maradék 1/5-ét, Dezső 40 birkát. Hány birka volt a nyáj?',
            120,
            '7/12 + 1/12 + 40 = x, 4x/12 = 40, x = 120'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H8',
        location: 'kf2024JanBank.ts:getKozponti2024JanQuestions',
        message: '2024 Jan Mat1 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2024-1a')?.answer,
            a10: list.find((x) => x.id === 'kf2024-10')?.answer,
            chartKind: list.find((x) => x.id === 'kf2024-4a')?.figure?.kind,
            coordKind: list.find((x) => x.id === 'kf2024-5ay')?.figure?.kind,
            pentKind: list.find((x) => x.id === 'kf2024-7a')?.figure?.kind,
            prismKind: list.find((x) => x.id === 'kf2024-9')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2024-jan',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2024_JAN_COUNT = 27;
