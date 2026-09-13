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

/** 2020. jan. 23. Mat2 — itemek a javítási útmutató szerint. */
export function getKozponti2020FebQuestions(): Question[] {
    const pieFig = imageFigure('/figures/kozponti/2020feb/t4-kor.png', '2020/4. palacsinta kördiagram');
    const quadFig = imageFigure('/figures/kozponti/2020feb/t5-negyzet.png', '2020/5. ABCD átlók P-ben');
    const solidFig = imageFigure('/figures/kozponti/2020feb/t9-test.png', '2020/9. négy négyzetes oszlop');

    return [
        q(
            'kf2020f-1a',
            '2020/1.a) Hány 3-mal osztható egész szám van 8 és 29 között?',
            7,
            '9, 12, 15, 18, 21, 24, 27 → 7'
        ),
        q(
            'kf2020f-1b',
            '2020/1.b) 2 3/7 = ? / 7. Mennyi a hiányzó számláló?',
            17,
            '17/7 = 2 3/7'
        ),
        q(
            'kf2020f-1c',
            '2020/1.c) (2/3)³ = ? (8/27)',
            8 / 27,
            '(2/3)³ = 8/27'
        ),
        q(
            'kf2020f-1e',
            '2020/1.e) 4,8 : 4/5 = ?',
            6,
            '4,8 · 5/4 = 6'
        ),
        q(
            'kf2020f-2a',
            '2020/2.a) 36 m + ? dm = 44 m',
            80,
            '8 m = 80 dm'
        ),
        q(
            'kf2020f-2b',
            '2020/2.b) 2020 másodperc − ? másodperc = 30 perc',
            220,
            '30 perc = 1800 s → 2020 − 1800 = 220'
        ),
        q(
            'kf2020f-2c',
            '2020/2.c) 290 dm² − 5000 cm² = ? cm²',
            24000,
            '290 dm² = 29000 cm² → 29000 − 5000 = 24000'
        ),
        q(
            'kf2020f-2d',
            '2020/2.d) 24000 cm² = ? dm²',
            240,
            '24000 / 100 = 240'
        ),
        q(
            'kf2020f-3',
            '2020/3. 5 piros (P) és 2 fehér (F) muskátli egy sorban. Fehér nem lehet a sor végén, és nem lehetnek egymás mellett. Az egyszínűek megegyeznek.\nHány különböző sorrend van?\n(PFPFPFP, PFPFPPP, PFPPFPP, PPFPPFP, PPPFPFP, PPFPFPP.)',
            6,
            '6 sorrend az útmutató szerint'
        ),
        q(
            'kf2020f-4a',
            '2020/4.a) Hány palacsintát rendeltek összesen?',
            24,
            'túrós 6 db = 90° → 6/90 · 360 = 24',
            { figure: pieFig }
        ),
        q(
            'kf2020f-4b',
            '2020/4.b) Hány kakaós palacsintát rendeltek?',
            4,
            '60° / 360° · 24 = 4',
            { figure: pieFig }
        ),
        q(
            'kf2020f-4c',
            '2020/4.c) Hány lekváros palacsintát rendeltek?',
            14,
            'túrós 6 db = 90° → teljes 24 db; lekváros 210° → 14',
            { figure: pieFig }
        ),
        q(
            'kf2020f-4e',
            '2020/4.e) Összesen hány forintot fizettek? Lekváros 200 Ft, túrós 210 Ft, kakaós 150 Ft.',
            4660,
            '14·200 + 6·210 + 4·150 = 4660',
            { figure: pieFig }
        ),
        q(
            'kf2020f-5a',
            '2020/5.a) AB = AC, CB = CP, PA = PD, CAB = 20°. Mekkora a γ szög? (fok)',
            80,
            'ABC egyenlő szárú AB=AC → alapon 80°, 80°',
            { figure: quadFig }
        ),
        q(
            'kf2020f-5b',
            '2020/5.b) Mekkora az ε szög? (fok)',
            50,
            '(180 − γ) / 2 = 50',
            { figure: quadFig }
        ),
        q(
            'kf2020f-5c',
            '2020/5.c) Mekkora a δ szög? (fok)',
            65,
            '(180 − ε) / 2 = 65',
            { figure: quadFig }
        ),
        q(
            'kf2020f-6',
            '2020/6. Téglalap egyik oldala 5 cm. Ha minden oldalt 2 cm-rel növelünk, a terület 30 cm²-rel nő.\nHány cm a másik oldal?',
            8,
            '7(x+2) − 5x = 30 → x = 8'
        ),
        q(
            'kf2020f-7a',
            '2020/7.a) Három prímszám szorzata 0-ra végződik.\n(A) Nem teljesülhet  (B) Lehetséges, de nem mindig  (C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            2,
            '2·5·3=30 igen, 3·3·3=27 nem → B → 2'
        ),
        q(
            'kf2020f-7b',
            '2020/7.b) Egy konvex deltoid felbontható két egyenlő szárú háromszögre.\n(A) Nem teljesülhet  (B) Lehetséges, de nem mindig  (C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            3,
            'átlók mentén mindig → C → 3'
        ),
        q(
            'kf2020f-7c',
            '2020/7.c) Egy pozitív szám négyzete nagyobb a számnál.\n(A) Nem teljesülhet  (B) Lehetséges, de nem mindig  (C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            2,
            '2²>2, (1/2)²<1/2 → B → 2'
        ),
        q(
            'kf2020f-7d',
            '2020/7.d) Egy szám ezresekre kerekített értéke nagyobb, mint a százasokra kerekített értéke.\n(A) Nem teljesülhet  (B) Lehetséges, de nem mindig  (C) Biztosan teljesül\nBetű száma: A=1, B=2, C=3',
            2,
            'pl. 2500: ezres 2000 vagy 3000 vs százas 2500 — függ a számtól → B → 2'
        ),
        q(
            'kf2020f-8',
            '2020/8. Másfélszer annyi fehér golyó, mint piros. Ha a pirosak 10%-át és még 9 fehér golyót kiveszünk, a maradék 3/5-e fehér.\nHány piros golyó volt eredetileg?',
            60,
            '(1,5x−9):0,9x = 3:2 → x = 60'
        ),
        q(
            'kf2020f-9',
            '2020/9. Négy egybevágó négyzetes oszlop, a = 2 cm, b = 4 cm. Hány cm² a test felszíne?',
            136,
            '4·40 − 6·4 = 136',
            { figure: solidFig }
        ),
        q(
            'kf2020f-10',
            '2020/10. Kedden 3-szor annyi oldal, mint hétfőn; szerdán a keddi negyede; csütörtökön 6-tal több, mint szerdán; pénteken 3-mal kevesebb, mint csütörtökön, és annyi, mint hétfőn.\nHány oldalt olvasott összesen hétfőtől péntekig?',
            84,
            'x=12; 12+36+9+15+12 = 84'
        ),
    ];
}

export const KOZPONTI_2020_FEB_COUNT = 24;
