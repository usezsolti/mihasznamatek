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

/** 2021. jan. 23. Mat1 — itemek a javítási útmutató szerint. */
export function getKozponti2021JanQuestions(): Question[] {
    const swimFig = imageFigure('/figures/kozponti/2021jan/t4-diagram.png', '2021/4. uszas diagram');
    const triFig = imageFigure('/figures/kozponti/2021jan/t5-haromszog.png', '2021/5. ABC haromszog vazlat');
    const solidFig = imageFigure('/figures/kozponti/2021jan/t9-test.png', '2021/9. osszeragasztott test');

    const list: Question[] = [
        q(
            'kf2021-1a',
            '2021/1.a) A = 2^3 + 3^2. Mennyi A?',
            17,
            '8 + 9 = 17'
        ),
        q(
            'kf2021-1b',
            '2021/1.b) L az egyjegyű pozitív prímszámok száma. Mennyi L?',
            4,
            '2, 3, 5, 7 -> 4'
        ),
        q(
            'kf2021-1c',
            '2021/1.c) M = 12 · 5/6. Mennyi M?',
            10,
            '12 * 5/6 = 10'
        ),
        q(
            'kf2021-1e',
            '2021/1.e) X = A − (L − M) + A, ahol A=17, L=4, M=10. Mennyi X?',
            40,
            '17 - (4-10) + 17 = 40'
        ),
        q(
            'kf2021-2a',
            '2021/2.a) 135 m − 700 cm = ? m',
            128,
            '135 - 7 = 128'
        ),
        q(
            'kf2021-2b',
            '2021/2.b) 540 másodperc + ? perc = 34 perc',
            25,
            '540 s = 9 perc, 34-9 = 25'
        ),
        q(
            'kf2021-2c',
            '2021/2.c) 22 m² − 1300 dm² = ? dm²',
            900,
            '2200 - 1300 = 900'
        ),
        q(
            'kf2021-2d',
            '2021/2.d) 900 dm² = ? cm²',
            90000,
            '900 * 100 = 90000'
        ),
        q(
            'kf2021-3',
            '2021/3. Négyjegyű pozitív egész: ezresek és tízesek páratlan, százasok és egyesek páros; nincs két egyforma számjegy; a számjegyek csökkenő sorozatot alkotnak; a szám hárommal osztható. Példa: 9210.\nHány megfelelő van összesen (a példa is számít)?',
            13,
            '13 darab, koztuk 9210'
        ),
        q(
            'kf2021-4a',
            '2021/4.a) Ambrus, Bernát és Csaba kétórás úszóedzése. A vízszintes szakaszok az úszás idejét mutatják.\nAz edzés alatt összesen hány percig úszott a három versenyző egyszerre?',
            30,
            'harom kozos szakasz: 30 perc',
            { figure: swimFig }
        ),
        q(
            'kf2021-4b',
            '2021/4.b) Csaba 80 percet úszott, 40 percet pihent, 4400 m-t tett meg.\nÚszás közben 1 perc alatt átlagosan hány métert tett meg?',
            55,
            '4400 / 80 = 55',
            { figure: swimFig }
        ),
        q(
            'kf2021-4c',
            '2021/4.b) Bernát 1 perc alatt átlagosan 50 m-t úszott, összesen 3500 m-t.\nHány percet úszott?',
            70,
            '3500 / 50 = 70',
            { figure: swimFig }
        ),
        q(
            'kf2021-4d',
            '2021/4.b) Bernát 70 percet úszott a 120 perces edzésen.\nHány percet pihent?',
            50,
            '120 - 70 = 50',
            { figure: swimFig }
        ),
        q(
            'kf2021-4e',
            '2021/4.b) Ambrus 1 perc alatt átlagosan 60 m-t úszott, 90 percet úszott.\nHány métert tett meg az edzésen?',
            5400,
            '60 * 90 = 5400',
            { figure: swimFig }
        ),
        q(
            'kf2021-5a',
            '2021/5.a) ABC háromszög, B-nél a külső szög 147°. Mekkora a β szög? (fok)',
            33,
            '180 - 147 = 33',
            { figure: triFig }
        ),
        q(
            'kf2021-5b',
            '2021/5.b) Milyen tulajdonságú az APC hegyesszögű háromszög?\n(A) szabályos\n(B) egyenlő szárú\n(C) derékszögű\n(D) tompaszögű\nBetű száma: A=1, B=2, C=3, D=4',
            2,
            'f felezomeroleges -> PA=PC -> B -> 2',
            { figure: triFig }
        ),
        q(
            'kf2021-5c',
            '2021/5.c) Mekkora az ABC háromszögben az α szög? (fok)',
            49,
            'PA=PC, alfa = gamma/2, 3*alfa+33=180, alfa=49',
            { figure: triFig }
        ),
        q(
            'kf2021-5d',
            '2021/5.d) Mekkora az ABC háromszögben a γ szög? (fok)',
            98,
            '2 * 49 = 98',
            { figure: triFig }
        ),
        q(
            'kf2021-6a',
            '2021/6. Két pozitív szám aránya 9 : 5. Ha a nagyobból kivonjuk a kisebbet, 120-szal kisebb számot kapunk, mint a két szám összege.\nMennyi a kisebb szám?',
            60,
            '9x-5x + 120 = 9x+5x, 2x=120, kisebb=60'
        ),
        q(
            'kf2021-6b',
            '2021/6. Ugyanez a két szám. Mennyi a nagyobb szám?',
            108,
            '9/5 * 60 = 108'
        ),
        q(
            'kf2021-7a',
            '2021/7.a) Ha helyesen összeszorzunk két véletlenszerűen kiválasztott egész számot, akkor a szorzat nagyobb lesz a két szám összegénél.\n(A) Nem teljesülhet\n(B) Lehetséges, de nem mindig teljesül\n(C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            2,
            'pl. 5*6>11, de 1*1<2 -> B -> 2'
        ),
        q(
            'kf2021-7b',
            '2021/7.b) Ha helyesen összeadunk négy véletlenszerűen kiválasztott különböző prímszámot, akkor az összeg páros szám lesz.\n(A) Nem teljesülhet\n(B) Lehetséges, de nem mindig teljesül\n(C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            2,
            '2 nelkul paros, 2-vel paratlan -> B -> 2'
        ),
        q(
            'kf2021-7c',
            '2021/7.c) Ha helyesen kiszámítjuk egy tetszőleges konvex négyszög belső szögeinek összegét, akkor ez az összeg nagyobb lesz a külső szögei összegénél.\n(A) Nem teljesülhet\n(B) Lehetséges, de nem mindig teljesül\n(C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            1,
            '360 = 360, soha nagyobb -> A -> 1'
        ),
        q(
            'kf2021-7d',
            '2021/7.d) Ha helyesen összeadunk két véletlenszerűen kiválasztott egész számot, akkor az összeg racionális szám lesz.\n(A) Nem teljesülhet\n(B) Lehetséges, de nem mindig teljesül\n(C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            3,
            'egesz + egesz racionális -> C -> 3'
        ),
        q(
            'kf2021-8',
            '2021/8. Egy háromfordulós matematikaverseny első fordulójából az indulók 85%-a nem jutott tovább. A második fordulóba jutottak 8%-át hívták be a döntőbe. A döntőben 24-en versenyeztek.\nHányan indultak?',
            2000,
            '24 / 0,08 / 0,15 = 2000'
        ),
        q(
            'kf2021-9',
            '2021/9. Négy egybevágó négyzetes oszlop, a=2 cm, b=4 cm, a ragasztási felületek teljes négyzetek.\nHány cm² a test felszíne?',
            136,
            '4*40 - 6*4 = 136',
            { figure: solidFig }
        ),
        q(
            'kf2021-10',
            '2021/10. Tibor először a teljes mennyiség felét és még 5 dobozt pakolt le. A maradék felét és még 6 dobozt a második helyen. Végül 9 doboz maradt.\nHány doboz volt a kiszállítás kezdetekor?',
            70,
            '9+6=15 a masodik fele, 30+5=35 az elso fele, 70'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H2',
        location: 'kf2021JanBank.ts:getKozponti2021JanQuestions',
        message: '2021 Jan Mat1 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1c: list.find((x) => x.id === 'kf2021-1c')?.answer,
            a3: list.find((x) => x.id === 'kf2021-3')?.answer,
            a4a: list.find((x) => x.id === 'kf2021-4a')?.answer,
            a5b: list.find((x) => x.id === 'kf2021-5b')?.answer,
            a7c: list.find((x) => x.id === 'kf2021-7c')?.answer,
            a9: list.find((x) => x.id === 'kf2021-9')?.answer,
            a10: list.find((x) => x.id === 'kf2021-10')?.answer,
            swimKind: list.find((x) => x.id === 'kf2021-4a')?.figure?.kind,
            swimSrc: list.find((x) => x.id === 'kf2021-4a')?.figure?.kind === 'image'
                ? list.find((x) => x.id === 'kf2021-4a')?.figure?.src
                : null,
            triKind: list.find((x) => x.id === 'kf2021-5a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2021-9')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2021-jan',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2021_JAN_COUNT = 27;
