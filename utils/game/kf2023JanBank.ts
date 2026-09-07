import type { Question } from './types';
import { coordPlaneFigure, imageFigure } from './questionFigure';
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

/** 2023. jan. 21. Mat1 — itemek a javítási útmutató szerint. */
export function getKozponti2023JanQuestions(): Question[] {
    const chartFig = imageFigure('/figures/kozponti/2023jan/t4-diagram.png', '2023/4. otosok oszlopdiagram');
    const triFig = imageFigure('/figures/kozponti/2023jan/t5-haromszog.png', '2023/5. ABC es ADE haromszog');
    const prismFig = imageFigure('/figures/kozponti/2023jan/t9-hasab.png', '2023/9. szimmetrikus trapez alapu hasab');
    const coordFig = coordPlaneFigure({
        xmin: -4,
        xmax: 10,
        ymin: -4,
        ymax: 5,
        points: [{ x: 3, y: 2, label: 'A' }],
        caption: '2023/8. A(3; 2), x tengelyre tukrozott teglalap',
    });

    const list: Question[] = [
        q(
            'kf2023-1a',
            '2023/1.a) O = 2 − 2/3. Mennyi O? (4/3 vagy 1 1/3 is jó)',
            4 / 3,
            '2 - 2/3 = 4/3'
        ),
        q(
            'kf2023-1b',
            '2023/1.b) K a 2 kétharmad része. Mennyi K? (4/3 vagy 1 1/3 is jó)',
            4 / 3,
            '2 * 2/3 = 4/3'
        ),
        q(
            'kf2023-1c',
            '2023/1.c) S = (2/3)². Mennyi S? (4/9 is jó)',
            4 / 9,
            '(2/3)^2 = 4/9'
        ),
        q(
            'kf2023-1x',
            '2023/1.d) X = O + K + O + S. Mennyi X? (40/9 vagy 4 4/9 is jó)',
            40 / 9,
            '4/3 + 4/3 + 4/3 + 4/9 = 40/9'
        ),
        q(
            'kf2023-2a',
            '2023/2.a) 3 nap + 50 óra = ? óra',
            122,
            '3*24 + 50 = 122'
        ),
        q(
            'kf2023-2b',
            '2023/2.b) 2 liter − ? cm³ = 700 cm³',
            1300,
            '2 liter = 2000 cm3, 2000-700 = 1300'
        ),
        q(
            'kf2023-2c',
            '2023/2.c) ? km − 1300 m = 5700 m',
            7,
            '5700+1300 = 7000 m = 7 km'
        ),
        q(
            'kf2023-2d',
            '2023/2.d) 5700 m = ? dm',
            57000,
            '5700 m = 57000 dm'
        ),
        q(
            'kf2023-3',
            '2023/3. Az 1, 2, 3, 4, 5 számjegyek olyan sorrendjei, ahol az első számjegy páros, és az egymás mellett lévő számjegyek különbsége nem 1. Példa: 2 4 1 3 5.\nHány megfelelő sorrend van összesen (a példa is számít)?',
            6,
            '24135, 24153, 25314, 41352, 42531, 42513 = 6'
        ),
        q(
            'kf2023-4a',
            '2023/4.a) Csaba kapta a legtöbb ötöst. Hány ötöst kapott Csaba?',
            8,
            'A diagramon a legnagyobb ertek 8',
            { figure: chartFig }
        ),
        q(
            'kf2023-4b',
            '2023/4.b) Daninál és Elemérnél kevesebb ötöst nem kapott senki. Hány ötöst kapott összesen ez a két tanuló?',
            4,
            'A legkevesebb 2, ketten 2+2 = 4',
            { figure: chartFig }
        ),
        q(
            'kf2023-4d',
            '2023/4.c–d) Hány ötöst kaptak összesen a 8. b diákjai?',
            162,
            '2*5 + 3*8 + 5*12 + 6*10 + 8*1 = 162',
            { figure: chartFig }
        ),
        q(
            'kf2023-5a',
            '2023/5.a) ABC egyenlő szárú (AB = AC), A körül 46°-kal elforgatva ADE. ADE-ben az E-nél lévő szög 75°. Mekkora az α szög? (fok)',
            30,
            'ADE egyenlo szaru, 180-75-75 = 30',
            { figure: triFig }
        ),
        q(
            'kf2023-5b',
            '2023/5.b) Mekkora az ACD háromszögben az A-nál lévő μ szög? (fok)',
            16,
            '46 - 30 = 16',
            { figure: triFig }
        ),
        q(
            'kf2023-5c',
            '2023/5.c) Mekkora az ABE háromszögben az E-nél lévő δ szög? (fok)',
            52,
            '(180-76)/2 = 52',
            { figure: triFig }
        ),
        q(
            'kf2023-5d',
            '2023/5.d) Mekkora a BCDE négyszögben a B-nél lévő β szög? (fok)',
            23,
            '75 - 52 = 23',
            { figure: triFig }
        ),
        q(
            'kf2023-6',
            '2023/6. Gizi és Bandi 91 kg almát szedett, arányuk 8 : 5. Hány kilogrammal szedett többet Bandi, mint Gizi?',
            21,
            '8x+5x=91, x=7, 3*7=21'
        ),
        q(
            'kf2023-7a',
            '2023/7.a) Egy számnak és a 145-nek az átlaga 25. Melyik ez a szám?\n(A) 105\n(B) –120\n(C) 170\n(D) –95\nBetű száma: A=1, B=2, C=3, D=4',
            4,
            '(x+145)/2 = 25, x = -95 -> D -> 4'
        ),
        q(
            'kf2023-7b',
            '2023/7.b) N = 26·35 és K = 13·72. Mennyi az N és a K legnagyobb közös osztója?\n(A) 104\n(B) 26\n(C) 13\n(D) 2\nBetű száma: A=1 ... D=4',
            2,
            'LNKO = 26 -> B -> 2'
        ),
        q(
            'kf2023-7c',
            '2023/7.c) Melyik szorzat a 256 000 000 normálalakja?\n(A) 256·10⁶\n(B) 2,56·10⁷\n(C) 0,256·10⁸\n(D) 2,56·10⁸\nBetű száma: A=1 ... D=4',
            4,
            '2,56 * 10^8 -> D -> 4'
        ),
        q(
            'kf2023-7d',
            '2023/7.d) Melyik állítás igaz mindig egy háromszög legalább egyik magasságára?\n(A) Felezi a háromszög egyik oldalát.\n(B) Hosszabb a háromszög valamelyik oldalánál.\n(C) Merőleges a háromszög egyik oldalára.\n(D) A háromszöget két egyenlő területű részre osztja.\nBetű száma: A=1 ... D=4',
            3,
            'A magassag meroleges egy oldalra -> C -> 3'
        ),
        q(
            'kf2023-8ax',
            '2023/8.a) ABCD téglalap szimmetrikus az x tengelyre, A tükre B, C tükre D. A(3; 2), területe 20. B x-koordinátája?',
            3,
            'B(3; -2)',
            { figure: coordFig }
        ),
        q(
            'kf2023-8ay',
            '2023/8.a) B y-koordinátája?',
            -2,
            'B(3; -2)',
            { figure: coordFig }
        ),
        q(
            'kf2023-8c1x',
            '2023/8.b) Az egyik ilyen téglalap C csúcsának x-koordinátája a nagyobb. Mennyi ez az x?',
            8,
            'C(8; -2), D(8; 2)',
            { figure: coordFig }
        ),
        q(
            'kf2023-8c1y',
            '2023/8.b) Ennél a téglalapnál C y-koordinátája?',
            -2,
            'C(8; -2)',
            { figure: coordFig }
        ),
        q(
            'kf2023-8c2x',
            '2023/8.b) A másik téglalap C csúcsának x-koordinátája?',
            -2,
            'C(-2; -2), D(-2; 2)',
            { figure: coordFig }
        ),
        q(
            'kf2023-9a',
            '2023/9.a) Szimmetrikus trapéz alapú egyenes hasáb: AB = 26 cm, AA′ = 8 cm, AD = DC = CB = 10 cm, CT = 6 cm. Hány cm² az ABCD trapéz területe?',
            108,
            '(26+10)/2 * 6 = 108',
            { figure: prismFig }
        ),
        q(
            'kf2023-9b',
            '2023/9.b) Hány cm³ a hasáb térfogata?',
            864,
            '108 * 8 = 864',
            { figure: prismFig }
        ),
        q(
            'kf2023-10a',
            '2023/10. Három szám összege 103. Ha az elsőt 2-vel növelnéd, a másodikat kétszereznéd, a harmadikat megfeleznéd, ugyanazt a számot kapnád. Mennyi az első szám?',
            28,
            '28, 15, 60'
        ),
        q(
            'kf2023-10b',
            '2023/10. Mennyi a második szám?',
            15,
            '28, 15, 60'
        ),
        q(
            'kf2023-10c',
            '2023/10. Mennyi a harmadik szám?',
            60,
            '28, 15, 60'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H10',
        location: 'kf2023JanBank.ts:getKozponti2023JanQuestions',
        message: '2023 Jan Mat1 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2023-1a')?.answer,
            a3: list.find((x) => x.id === 'kf2023-3')?.answer,
            a4d: list.find((x) => x.id === 'kf2023-4d')?.answer,
            a10c: list.find((x) => x.id === 'kf2023-10c')?.answer,
            chartKind: list.find((x) => x.id === 'kf2023-4a')?.figure?.kind,
            triKind: list.find((x) => x.id === 'kf2023-5a')?.figure?.kind,
            coordKind: list.find((x) => x.id === 'kf2023-8ax')?.figure?.kind,
            prismKind: list.find((x) => x.id === 'kf2023-9a')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2023-jan',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2023_JAN_COUNT = 31;
