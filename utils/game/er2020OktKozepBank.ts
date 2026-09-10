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

const FIG = '/figures/erettsegi/2020okt-kozep';

/** 2020. október 20. középszint (2012) — válaszok a javítási útmutató szerint. */
export function getErettsegi2020OktKozepQuestions(): Question[] {
    const graphPts = imageFigure(`${FIG}/p20-1.png`, '2020/17. A, B, C, D, E pontok');
    const para = imageFigure(`${FIG}/p20-2.jpeg`, '2020/17. ABCD paralelogramma');

    const list: Question[] = [
        q(
            'er20o-1i',
            '2020/1. A = {1; 3; 6; 10; 15}, B = {1; 4; 10; 20}. Sorold fel A ∩ B elemeit.',
            0,
            'A ∩ B = {1; 10}',
            { expectedSet: ['1', '10'] }
        ),
        q(
            'er20o-1d',
            '2020/1. Ugyanazok a halmazok. Sorold fel A \\ B elemeit.',
            0,
            'A \\ B = {3; 6; 15}',
            { expectedSet: ['3', '6', '15'] }
        ),
        q(
            'er20o-2',
            '2020/2. Anna öt napon át 200 m-es körön fut: 5, 6, 7, 8, 9 kör. Összesen hány métert fut?',
            7000,
            '35 kör · 200 m = 7000 m'
        ),
        q(
            'er20o-3',
            '2020/3. Milyen számjegyet írjunk x helyére, hogy 202x osztható legyen 12-vel?',
            8,
            'x = 8'
        ),
        q(
            'er20o-4',
            '2020/4. Melyik egyenlő 2^100 kétszeresével?\nA) 2^101  B) 2^102  C) 2^200  D) 4^100\nA=1, B=2, C=3, D=4.',
            1,
            'A: 2 · 2^100 = 2^101'
        ),
        q(
            'er20o-5A',
            '2020/5. Lottószámok: 16, 24, 36, 54, 81. A: mindegyik osztható 3-mal. Igaz=1, hamis=0.',
            0,
            'Hamis (16 nem osztható 3-mal).'
        ),
        q(
            'er20o-5B',
            '2020/5. Ugyanazok a számok. B: közülük három négyzetszám. Igaz=1, hamis=0.',
            1,
            'Igaz (16, 36, 81).'
        ),
        q(
            'er20o-5C',
            '2020/5. Ugyanazok a számok. C: mértani sorozat első öt tagjának tekinthetők. Igaz=1, hamis=0.',
            1,
            'Igaz (q = 3/2).'
        ),
        q(
            'er20o-6a',
            '2020/6.a) f(x) = 10^{x/4}. f(12) = ?',
            1000,
            '10^{12/4} = 10³ = 1000'
        ),
        q(
            'er20o-6b',
            '2020/6.b) f(x) = 10^{x/4} = 100. Mennyi x?',
            8,
            'x/4 = 2 → x = 8'
        ),
        q(
            'er20o-7',
            '2020/7. 15 000 Ft-ot 25%-kal emeltek, majd újra 15 000 Ft. Hány %-os a kedvezmény?',
            20,
            '18 750 · 0,8 = 15 000 → 20%'
        ),
        q(
            'er20o-8',
            '2020/8. b élű kocka felszíne 13,5 cm². A 2b élű kocka felszíne (cm²)?',
            54,
            'b = 1,5 cm; 6 · 3² = 54'
        ),
        q(
            'er20o-9',
            '2020/9. Hány különböző hatjegyű szám készíthető két 2-esből és négy 4-esből?',
            15,
            '6! / (2! · 4!) = 15'
        ),
        q(
            'er20o-10a',
            '2020/10.a) f: [−2; 2] → ℝ, f(x) = x² − 1. Az értékkészlet alsó és felső határa.',
            -1,
            '[−1; 3]',
            { alternativeAnswer: 3 }
        ),
        q(
            'er20o-10b',
            '2020/10.b) Ugyanaz a függvény. Add meg a zérushelyeket.',
            -1,
            'x = −1 és x = 1',
            { alternativeAnswer: 1 }
        ),
        q(
            'er20o-11',
            '2020/11. Idők (perc): 38, 30, 26, 26. Add meg az átlagot és a szórást (egy tizedesre).',
            30,
            'átlag = 30, szórás = √24 ≈ 4,9',
            { alternativeAnswer: 4.9 }
        ),
        q(
            'er20o-12',
            '2020/12. Két szabályos dobókocka. P(két különböző szám)?',
            5 / 6,
            '30/36 = 5/6'
        ),
        q(
            'er20o-13a',
            '2020/13.a) A szám feléből 5-öt vonunk, 4-gyel szorzunk, +8, az eredeti számot kapjuk. Melyik szám?',
            12,
            '2(x/2 − 5) + 8 = x → x = 12'
        ),
        q(
            'er20o-13b',
            '2020/13.b) Számtani sorozat: a10 = 18, a30 = 48. Add meg az első tagot és a differenciát.',
            4.5,
            'a1 = 4,5, d = 1,5',
            { alternativeAnswer: 1.5 }
        ),
        q(
            'er20o-14a',
            '2020/14.a) Derékszögű háromszög: BC = 40 cm, AB = 41 cm. Terület (dm²)?',
            1.8,
            'AC = 9 cm; T = 180 cm² = 1,8 dm²'
        ),
        q(
            'er20o-14b',
            '2020/14.b) Ugyanaz a háromszög. A két hegyesszög (fok, két tizedesre).',
            77.32,
            'α ≈ 77,32°, β = 12,68°',
            { alternativeAnswer: 12.68 }
        ),
        q(
            'er20o-14c',
            '2020/14.c) A háromszög köré írt kör kerülete (cm, egészre).',
            129,
            'd = 41 cm; K = 41π ≈ 129 cm'
        ),
        q(
            'er20o-15a',
            '2020/15.a) f(x) = 0,0001x² − 0,0063x + 15,2. 2018-ban hány °C-kal magasabb a középhő, mint 1998-ban?',
            0.3,
            'f(118) − f(98) = 15,849 − 15,543 ≈ 0,3'
        ),
        q(
            'er20o-15b',
            '2020/15.b) Ugyanaz a modell. Melyik évben volt a középhő 15,42 °C?',
            1988,
            'x = 88 → 1900 + 88 = 1988'
        ),
        q(
            'er20o-15c',
            '2020/15.c) g(t) = 15,92 · 1,002^t. Melyik évben lesz 16,7 °C?',
            2042,
            't ≈ 23,94 → 2018 + 24 = 2042'
        ),
        q(
            'er20o-16a',
            '2020/16.a) Föld pályája 939 000 000 km, 365,25 nap. Átlagsebesség (km/h)?',
            107118,
            '939 000 000 / 8766 ≈ 107 118'
        ),
        q(
            'er20o-16b',
            '2020/16.b) Neptunusz 4,2 fényórára. Távolság a Naptól (km, normálalak)?',
            4.5e9,
            '15 120 · 300 000 ≈ 4,5 · 10⁹'
        ),
        q(
            'er20o-16c',
            '2020/16.c) Bolygósorrend: Föld 3., Neptunusz utolsó, Merkúr/Vénusz tipp, 4 bolygó véletlen. P(helyes sorrend)?',
            1 / 48,
            '1/48 ≈ 0,021',
            { alternativeAnswer: 0.021 }
        ),
        q(
            'er20o-16d',
            '2020/16.d) P(legalább egyik cédula Föld): visszatevéses vagy visszatevés nélküli húzás a nagyobb?\nVisszatevés nélküli=1, visszatevéses=0.',
            1,
            '7/28 = 0,25 > 15/64 ≈ 0,234'
        ),
        q(
            'er20o-17b',
            '2020/17.b) Létezik-e 5 csúcsú gráf, amelyben minden csúcs foka pontosan 3?\n0 = nincs, 1 = van.',
            0,
            'Fokszámösszeg 15 páratlan → nincs ilyen gráf.',
            { figure: graphPts }
        ),
        q(
            'er20o-17dA',
            '2020/17.d) Paralelogramma: AB: 2x − 5y = −4, AD: 3x − 2y = −6, C(5; 5), B x = 3. A koordinátái (x, y).',
            -2,
            'A(−2; 0)',
            { alternativeAnswer: 0, figure: para }
        ),
        q(
            'er20o-17dB',
            '2020/17.d) Ugyanaz a paralelogramma. B koordinátái (x, y).',
            3,
            'B(3; 2)',
            { alternativeAnswer: 2, figure: para }
        ),
        q(
            'er20o-17dD',
            '2020/17.d) Ugyanaz a paralelogramma. D koordinátái (x, y).',
            0,
            'D(0; 3)',
            { alternativeAnswer: 3, figure: para }
        ),
        q(
            'er20o-18a',
            '2020/18.a) Acélszög: fej 1 mm + henger 25 mm + hegy 2,5 mm. Teljes hossz (mm)?',
            28.5,
            '1 + 25 + 2,5 = 28,5'
        ),
        q(
            'er20o-18b',
            '2020/18.b) 10 dkg szög, sűrűség 7,8 g/cm³. Körülbelül hány darab?',
            140,
            'V ≈ 91,37 mm³; m ≈ 0,713 g; 100/0,713 ≈ 140'
        ),
        q(
            'er20o-18d',
            '2020/18.d) 50 adat osztályközepekkel. Add meg a mediánt és az átlagot.',
            137,
            'medián 137 db, átlag 140,4 db',
            { alternativeAnswer: 140.4 }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H20',
        location: 'er2020OktKozepBank.ts',
        message: '2020 okt kozep bank',
        data: { total: list.length, firstId: list[0]?.id },
        runId: 'er-batch-2020-23',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2020_OKT_KOZEP_COUNT = 36;
