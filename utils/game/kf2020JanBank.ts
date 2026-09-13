import type { Question } from './types';
import { imageFigure } from './questionFigure';

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

/** 2020. jan. 18. Mat1 — itemek a javítási útmutató szerint. */
export function getKozponti2020JanQuestions(): Question[] {
    const chartFig = imageFigure('/figures/kozponti/2020jan/t4-diagram.png', '2020/4. két csoport oszlopdiagram');
    const triFig = imageFigure('/figures/kozponti/2020jan/t5-haromszog.png', '2020/5. ABC háromszög, e magasság, f külső szögfelező');
    const solidFig = imageFigure('/figures/kozponti/2020jan/t9-test.png', '2020/9. kilenc kocka lépcső');

    return [
        q(
            'kf2020-1a',
            '2020/1.a) Hány páratlan egész szám van 10 és 26 között?',
            8,
            '11, 13, 15, 17, 19, 21, 23, 25 → 8'
        ),
        q(
            'kf2020-1b',
            '2020/1.b) Egyszerűsítsd: 9/15 = ? (közönséges tört tizedesként, 3/5)',
            0.6,
            '9/15 = 3/5 = 0,6'
        ),
        q(
            'kf2020-1c',
            '2020/1.c) 3 · (hiányzó szám) = 7. Mennyi a hiányzó szám? (7/3)',
            7 / 3,
            '3 · (7/3) = 7'
        ),
        q(
            'kf2020-1e',
            '2020/1.e) 3 2/3 : 5 = ? (11/15)',
            11 / 15,
            '11/3 : 5 = 11/15'
        ),
        q(
            'kf2020-2a',
            '2020/2.a) 5 m³ − 800 dm³ = ? dm³',
            4200,
            '5 m³ = 5000 dm³ → 5000 − 800 = 4200'
        ),
        q(
            'kf2020-2b',
            '2020/2.b) 3,5 óra + ? perc = 230 perc',
            20,
            '3,5 óra = 210 perc → 230 − 210 = 20'
        ),
        q(
            'kf2020-2c',
            '2020/2.c) 93 mm + 4,7 cm = ? mm',
            140,
            '4,7 cm = 47 mm → 93 + 47 = 140 mm'
        ),
        q(
            'kf2020-2d',
            '2020/2.d) 140 mm = ? dm',
            1.4,
            '140 mm = 1,4 dm'
        ),
        q(
            'kf2020-3',
            '2020/3. Kártyák: 1, 2, 3, 4, 5. Két különböző kártya húzása sorrendben: kétjegyű szám. Hány ilyen, 3-mal osztható kétjegyű szám állítható elő?\n(A helyesek: 12, 15, 21, 24, 42, 45, 51, 54.)',
            8,
            '12, 15, 21, 24, 42, 45, 51, 54 → 8'
        ),
        q(
            'kf2020-4a',
            '2020/4.a) Melyik osztályzatból született a legtöbb a két csoportban összesen?',
            4,
            '4-es: 5+6 = 11, ez a legtöbb',
            { figure: chartFig }
        ),
        q(
            'kf2020-4b',
            '2020/4.b) Hányan szereztek legalább hármas osztályzatot a 2. csoportban?',
            13,
            '4 + 6 + 3 = 13',
            { figure: chartFig }
        ),
        q(
            'kf2020-4c',
            '2020/4.c) Az 1. csoport osztályzatainak átlaga?',
            3.25,
            'létszám 16, összeg 52, 52/16 = 3,25',
            { figure: chartFig }
        ),
        q(
            'kf2020-5a',
            '2020/5.a) Mekkora az ABC háromszögben a γ szög? (fok)',
            105,
            'e merőleges AC-re; γ = 90 + 15 = 105',
            { figure: triFig }
        ),
        q(
            'kf2020-5b',
            '2020/5.b) Mekkora az ABC háromszögben a β szög? (fok)',
            56,
            'f külső szögfelező; külső = 2·28 + kapcsolódó → β = 56',
            { figure: triFig }
        ),
        q(
            'kf2020-5c',
            '2020/5.c) Mekkora az ABC háromszögben az α szög? (fok)',
            19,
            'α = 180 − β − γ = 180 − 56 − 105 = 19',
            { figure: triFig }
        ),
        q(
            'kf2020-6',
            '2020/6. ALFA: 400 Ft/db + 1200 Ft szállítás. BÉTA: 425 Ft/db + 850 Ft szállítás.\nHány konzervnél ugyanannyi a költség?',
            14,
            '400x+1200 = 425x+850 → 25x = 350 → x = 14'
        ),
        q(
            'kf2020-7a',
            '2020/7.a) Mennyi 2³ · 5³?\n(A) 7³  (B) 10⁶  (C) 10³  (D) 7⁶\nBetű száma: A=1, B=2, C=3, D=4',
            3,
            '8·125 = 1000 = 10³ → C → 3'
        ),
        q(
            'kf2020-7b',
            '2020/7.b) A = 1 cm sugarú kör területe, B = 2 cm oldalú négyzet területe.\n(A) A < B  (B) A = B  (C) A > B  (D) A = 2·B\nBetű száma: A=1, B=2, C=3, D=4',
            1,
            'π < 4 → A < B → A → 1'
        ),
        q(
            'kf2020-7c',
            '2020/7.c) A legnagyobb prímszám, ami 99-nek osztója?\n(A) 3  (B) 11  (C) 17  (D) 33\nBetű száma: A=1, B=2, C=3, D=4',
            2,
            '99 = 3²·11 → 11 → B → 2'
        ),
        q(
            'kf2020-7d',
            '2020/7.d) Ha x = 1,2 és y = 10, akkor 5 + xy =\n(A) 62  (B) 17  (C) 26,2  (D) 18\nBetű száma: A=1, B=2, C=3, D=4',
            2,
            '5 + 1,2·10 = 17 → B → 2'
        ),
        q(
            'kf2020-8',
            '2020/8. Kétszer annyi kék lap, mint piros. A kékek 5/8-a négóst, a körök 25%-a piros. A kék négyzetek száma 100-zal több, mint a piros köröké.\nHány lap van összesen?',
            300,
            '5/4 x − x/4 = 100 → x = 100, összesen 3x = 300'
        ),
        q(
            'kf2020-9a',
            '2020/9.a) Kilenc egybevágó 3 cm-es kocka, teljes lappal ragasztva. Hány darab 3 cm-es négyzet határolja a testet?',
            34,
            'UT: 34 négyzetlap',
            { figure: solidFig }
        ),
        q(
            'kf2020-9b',
            '2020/9.b) Ugyanez a test. Hány cm² a felszíne?',
            306,
            '34 · 9 = 306',
            { figure: solidFig }
        ),
        q(
            'kf2020-10',
            '2020/10. 20 éve Gabi életkora hatoda volt az apja akkori életkorának. Most Gabi feleannyi idős, mint az apja.\nHány éves most az apa?',
            50,
            'apa most x, Gabi x/2; 20 éve: 6(x/2 − 20) = x − 20 → x = 50'
        ),
    ];
}

export const KOZPONTI_2020_JAN_COUNT = 24;
