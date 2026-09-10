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

const FIG = '/figures/erettsegi/2023okt-kozep';

/** 2023. október 17. középszint (2313) — válaszok a javítási útmutató szerint. */
export function getErettsegi2023OktKozepQuestions(): Question[] {
    const para = imageFigure(`${FIG}/p14-1.png`, '2023/14. ABCD paralelogramma');
    const color = imageFigure(`${FIG}/p16-1.jpeg`, '2023/14.d) színezés');
    const pillow = imageFigure(`${FIG}/p22-1.jpeg`, '2023/18. szivacspárna');

    const list: Question[] = [
        q(
            'er23o-1',
            '2023/1. Add meg az 1848 prímtényezős felbontását! Írd be a különböző prímtényezőket.',
            0,
            '1848 = 2³ · 3 · 7 · 11',
            { expectedSet: ['2', '3', '7', '11'] }
        ),
        q(
            'er23o-2',
            '2023/2. Öt egyforma teherautó mindegyikének 8-szor kellene fordulnia. Hány forduló kell négy ugyanekkora teherautónak?',
            10,
            '5·8 / 4 = 10'
        ),
        q(
            'er23o-3a',
            '2023/3. Derékszögű háromszög befogói 10 cm és 24 cm. Mekkora az átfogó (cm)?',
            26,
            'sqrt(10²+24²) = 26'
        ),
        q(
            'er23o-3b',
            '2023/3. A 10 cm-es befogóval szemközti szög (fok, két tizedesre).',
            22.62,
            'tg α = 10/24 → α ≈ 22,62°'
        ),
        q(
            'er23o-4',
            '2023/4. Melyik függvény nem vesz fel negatív értéket?\nA) x/(x+3)  B) x/(x²−3)  C) x³/(x−3)\nA=1, B=2, C=3.',
            3,
            'C: x³/(x−3) — a javító szerint C.'
        ),
        q(
            'er23o-5',
            '2023/5. Autóbérlés: 5 napig 7500 Ft/nap, 6 naptól 6300 Ft/nap. Hány Ft-tal magasabb a 6 napos díj az 5 naposnál?',
            300,
            '6·6300 − 5·7500 = 300'
        ),
        q(
            'er23o-6',
            '2023/6. Napi maximumok (°C): 9, 5, 6, 9, 6, 6, 8. Add meg az átlagot, a terjedelmet és a mediánt.',
            7,
            'átlag=7, terjedelem=4, medián=6',
            { alternativeAnswer: 4, thirdAnswer: 6 }
        ),
        q(
            'er23o-7',
            '2023/7. 10 piros golyó + zöld. P(piros)=2/3. Hány zöld golyó van?',
            5,
            '10/(10+z)=2/3 → z=5'
        ),
        q(
            'er23o-8',
            '2023/8. Bontsd fel: (a+1)(a−1) + (a+4)², és add meg a konstans tagot.',
            15,
            'a²−1 + a²+8a+16 = 2a²+8a+15'
        ),
        q(
            'er23o-9',
            '2023/9. Üres tartálykocsi 23,8 t, max. 60 000 l, 1 l = 0,85 kg. Tele tömeg (tonna)?',
            74.8,
            '51 000 kg = 51 t; 51+23,8 = 74,8'
        ),
        q(
            'er23o-10',
            '2023/10. (x−2)²+(y−4)²=25. Add meg a középpont x, y koordinátáját és a sugarat.',
            2,
            'O(2; 4), r=5',
            { alternativeAnswer: 4, thirdAnswer: 5 }
        ),
        q(
            'er23o-11',
            '2023/11. f(x)=√x − 3 a nemnegatívokon. Zérushely?',
            9,
            '√x = 3 → x=9'
        ),
        q(
            'er23o-12',
            '2023/12. Szabályos érme 3-szor. P(pontosan 1 fej)? Tizedestörtként.',
            0.375,
            'C(3,1)/8 = 3/8 = 0,375'
        ),
        q(
            'er23o-13a',
            '2023/13.a) f(x)=(x−3)²+2. f(3,5)=?',
            2.25,
            '(0,5)²+2 = 2,25'
        ),
        q(
            'er23o-13b',
            '2023/13.b) (x−3)²+2 = 6. Add meg a két gyököt.',
            1,
            'x=1 vagy x=5',
            { alternativeAnswer: 5 }
        ),
        q(
            'er23o-13c',
            '2023/13.c) Grafikonra vonatkozó feleletválasztó. B=2, A=1, C=3, D=4.',
            2,
            'B'
        ),
        q(
            'er23o-13d',
            '2023/13.d) (x−3)²+2 ≤ 6 egész megoldásai. Add meg a három egészet.',
            2,
            '2, 3, 4',
            { alternativeAnswer: 3, thirdAnswer: 4 }
        ),
        q(
            'er23o-14a',
            '2023/14.a) Paralelogramma: CA=11, AB=8, szög A=32°. BC hossza (cm, egészre).',
            6,
            'koszinusztétel → BC≈6',
            { figure: para }
        ),
        q(
            'er23o-14b',
            '2023/14.b) A paralelogramma területe (cm², egy tizedesre).',
            46.6,
            '11·8·sin32° ≈ 46,6',
            { figure: para }
        ),
        q(
            'er23o-14c',
            '2023/14.c) Az AC felezőpontjából az AB-re bocsátott merőleges talppontja T. AT és TB (cm, két tizedesre).',
            4.66,
            'AT≈4,66 cm, TB≈3,34 cm',
            { alternativeAnswer: 3.34, figure: para }
        ),
        q(
            'er23o-14d',
            '2023/14.d) 4 tartomány, 3 szín, szomszédosak különbözők, mind a 3 színt használjuk. Hány színezés?',
            12,
            '3·2·2 = 12',
            { figure: color }
        ),
        q(
            'er23o-15bI',
            '2023/15.b) I. Ha |A|=|B|=2, akkor |A∪B|=4. Igaz=1, hamis=0.',
            0,
            'Hamis, pl. A={1;2}, B={1;3}.'
        ),
        q(
            'er23o-15bII',
            '2023/15.b) II. A kétjegyű négyzetszámok száma?',
            6,
            '16, 25, 36, 49, 64, 81'
        ),
        q(
            'er23o-16a',
            '2023/16.a) Jegyek: 3, 3, 4, majd n darab 5-ös, átlag 4,5. Mennyi n?',
            7,
            '(10+5n)/(3+n)=4,5 → n=7'
        ),
        q(
            'er23o-16b',
            '2023/16.b) 12 évig havi 1000, 2000, …, 12 000 Ft. Összesen hány Ft?',
            936000,
            '12·1000·(1+…+12)=12·1000·78=936000'
        ),
        q(
            'er23o-16c',
            '2023/16.c) Mértani sorozat q=3, S9=59046. a9=?',
            39366,
            'a1=6; a9=6·3⁸=39366',
            { alternativeAnswer: 6 }
        ),
        q(
            'er23o-16d',
            '2023/16.d) 50000(1+p/100)³=59046. p értéke egy tizedesre.',
            5.7,
            'p≈5,7'
        ),
        q(
            'er23o-17a',
            '2023/17.a) 7 kocsi: 5 egyforma másodosztályú + étkező + kerékpárszállító. Hány sorrend?',
            42,
            '7!/5! = 42'
        ),
        q(
            'er23o-17b',
            '2023/17.b) 5% kedvezmény után 3040 Ft. Teljes árú jegy (Ft)?',
            3200,
            '3040/0,95 = 3200'
        ),
        q(
            'er23o-17c',
            '2023/17.c) Havi bérlet 2140 Ft, automatás jegy 266 Ft. Hányszor utazott Ábel, ha a bérlet 8 jegynél több, 9-nél kevesebb?',
            9,
            '2140/266≈8,05 → 9 utazás'
        ),
        q(
            'er23o-17d',
            '2023/17.d) Teljes árú jegy x és pótjegy y. x=?, y=?',
            2200,
            'x=2200 Ft, y=175 Ft',
            { alternativeAnswer: 175 }
        ),
        q(
            'er23o-18a',
            '2023/18.a) Gyűrűhenger: R=21 cm, r=9 cm, m=7 cm. Szivacs térfogata (cm³, egészre).',
            7917,
            'π·21²·7 − π·9²·7 ≈ 7917',
            { figure: pillow }
        ),
        q(
            'er23o-18b',
            '2023/18.b) 30 párna szövetigénye (m², egészre kerekítve).',
            11,
            '30·3582 cm² = 10,746 m² → 11 m²',
            { figure: pillow }
        ),
        q(
            'er23o-18c',
            '2023/18.c) P(selejt)=0,03 függetlenül, 30 párna. P(legfeljebb 1 selejt), három tizedesre.',
            0.773,
            '0,97³⁰ + C(30,1)·0,03·0,97²⁹ ≈ 0,773',
            { figure: pillow }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'er2023OktKozepBank.ts',
        message: '2023 okt kozep bank',
        data: { total: list.length, firstId: list[0]?.id },
        runId: 'er-batch-2325',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2023_OKT_KOZEP_COUNT = 34;
