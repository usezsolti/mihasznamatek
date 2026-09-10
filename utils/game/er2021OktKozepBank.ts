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

const FIG = '/figures/erettsegi/2021okt-kozep';

/** 2021. október 19. középszint (2113) — válaszok a javítási útmutató szerint. */
export function getErettsegi2021OktKozepQuestions(): Question[] {
    const gula = imageFigure(`${FIG}/p14-1.png`, '2021/14. négyzet alapú szabályos gúla');
    const gula2 = imageFigure(`${FIG}/p14-2.jpeg`, '2021/14. gúla / csonkagúla');
    const tri = imageFigure(`${FIG}/p18-1.jpeg`, '2021/16. ABC háromszög');
    const screen = imageFigure(`${FIG}/p22-1.png`, '2021/18. képernyő 4×6');

    const list: Question[] = [
        q(
            'er21o-1',
            '2021/1. A ∪ B = {1; 2; 3; 4; 5; 6; 7; 8; 9}, A \\ B = {7; 8; 9}, B \\ A = {1; 2}. Sorold fel A ∩ B elemeit.',
            0,
            'A ∩ B = {3; 4; 5; 6}',
            { expectedSet: ['3', '4', '5', '6'] }
        ),
        q(
            'er21o-2',
            '2021/2. Dorka és hat barátnője. Dorka a szélső, 1-es széken ül. Hányféle sorrendben ülhet a hét lány?',
            720,
            '6! = 720'
        ),
        q(
            'er21o-3',
            '2021/3. A háromszög mely nevezetes vonalai illeszkednek mindig valamelyik oldalfelező pontra?\nA: magasságvonal  B: középvonal  C: súlyvonal  D: szögfelező  E: oldalfelező merőleges\nÍrd be a megfelelő betűket.',
            0,
            'B, C, E',
            { expectedSet: ['B', 'C', 'E'] }
        ),
        q(
            'er21o-4',
            '2021/4. A pulóver árát 15%-kal csökkentették, így 10 200 Ft. Mennyi volt az ár az árcsökkentés előtt (Ft)?',
            12000,
            '10 200 : 0,85 = 12 000'
        ),
        q(
            'er21o-5',
            '2021/5. f(x) = (x−3)² − 1 a valósokon. Add meg a minimum helyét és értékét.',
            3,
            'minimum helye 3, értéke −1',
            { alternativeAnswer: -1 }
        ),
        q(
            'er21o-6',
            '2021/6. Kocka és téglatest térfogata egyenlő. A téglatest élei 45 cm, 120 cm, 135 cm. A kocka éle (cm)?',
            90,
            '∛(45·120·135) = ∛729000 = 90'
        ),
        q(
            'er21o-8',
            '2021/8. Add meg x értékét, ha 2^{x−1} = 16.',
            5,
            '2^{x−1} = 2⁴ → x = 5'
        ),
        q(
            'er21o-9',
            '2021/9. Az őr 4 napot dolgozik, 2-t pihen, ciklusosan, jan. 1-jén kezd. Az év 100. napján dolgozik vagy pihen?\nDolgozik=1, pihen=0.',
            1,
            '100 = 16·6 + 4, maradék 4 → dolgozik'
        ),
        q(
            'er21o-10',
            '2021/10. Sorozat: a₁ = 5, innentől minden tag az előző (−2)-szeresénél 1-gyel nagyobb. 2. és 3. tag?',
            -9,
            '5·(−2)+1 = −9; (−9)·(−2)+1 = 19',
            { alternativeAnswer: 19 }
        ),
        q(
            'er21o-11',
            '2021/11. Kör középpontja K(3; 2), átmegy P(−1; 5)-ön. A sugár hossza?',
            5,
            'r = √[(3−(−1))²+(2−5)²] = 5; (x−3)²+(y−2)² = 25'
        ),
        q(
            'er21o-12',
            '2021/12. Piros és kék szabályos kocka. P(az összeg legalább 11)? (3/36 ≈ 0,083)',
            3 / 36,
            '36 összes; 5-6, 6-5, 6-6 → 3/36 ≈ 0,083'
        ),
        q(
            'er21o-13a',
            '2021/13.a) Taxi: alapdíj 700 Ft, kilométerdíj 300 Ft/km. 12,5 km viteldíja (Ft)?',
            4450,
            '700 + 12,5·300 = 4450'
        ),
        q(
            'er21o-13b',
            '2021/13.b) Ugyanaz a tarifa. A viteldíj 2275 Ft. Hány km az út?',
            5.25,
            '700 + 300x = 2275 → x = 5,25'
        ),
        q(
            'er21o-13d',
            '2021/13.d) Másik város: 6,5 km → 2825 Ft, 10,4 km → 4190 Ft. Kilométerdíj és alapdíj (Ft).',
            350,
            '3,9k = 1365 → k = 350; a = 550',
            { alternativeAnswer: 550 }
        ),
        q(
            'er21o-14a',
            '2021/14.a) Négyzet alapú szabályos gúla: alapél 66 cm, magasság 56 cm. Felszín (cm²)?',
            12936,
            'm = 65; oldallap 2145; A = 66² + 4·2145 = 12 936',
            { figures: [gula, gula2] }
        ),
        q(
            'er21o-14b',
            '2021/14.b) Az alappal párhuzamos, a magasságot felező sík. A csonkagúla térfogata (cm³)?',
            71148,
            'V = 28/3 · (66²+33²+66·33) = 71 148',
            { figures: [gula, gula2] }
        ),
        q(
            'er21o-14c',
            '2021/14.c) Létezik-e 7 pontú gráf, amelyben minden pont foka 3?\n0 = nincs, 1 = van',
            0,
            'A fokszámösszeg 21 páratlan → ilyen gráf nincs.',
            { figures: [gula, gula2] }
        ),
        q(
            'er21o-15a',
            '2021/15.a) Dávid: három 3-as és két 5-ös. János mediánja 1-gyel nagyobb, átlaga 1-gyel kisebb. Add meg János öt jegyét.',
            0,
            'János jegyei: 1, 1, 4, 4, 4',
            { expectedSet: ['1', '1', '4', '4', '4'] }
        ),
        q(
            'er21o-15b',
            '2021/15.b) Eszter: 9 jegy, átlag 3; majd 6 jegy, átlag 4,5. Egész éves átlag?',
            3.6,
            '(9·3 + 6·4,5)/15 = 54/15 = 3,6'
        ),
        q(
            'er21o-15c',
            '2021/15.c) {1; 2; 3; 4; 5}-ből két különböző elem. P(az átlaguk egész)?',
            0.4,
            '4 kedvező / 10 = 0,4'
        ),
        q(
            'er21o-16a',
            '2021/16.a) A(5; 6), B(4; 2), C(8; 2). Az A-nál lévő belső szög (fok, két tizedesre).',
            50.91,
            'cos α ≈ 0,6306 → α ≈ 50,91°',
            { figure: tri }
        ),
        q(
            'er21o-16b',
            '2021/16.b) A B-re illeszkedő magasságvonal: 3x−4y=4. Az M magasságpont x és y koordinátája.',
            5,
            'M(5; 2,75)',
            { alternativeAnswer: 2.75, figure: tri }
        ),
        q(
            'er21o-16cA',
            '2021/16.c) B-ből 2-szeres nagyítás. A′ koordinátái (x; y).',
            6,
            "A'(6; 10), B'(4; 2), C'(12; 2)",
            { alternativeAnswer: 10, figure: tri }
        ),
        q(
            'er21o-16cB',
            '2021/16.c) Ugyanaz a nagyítás. B′ koordinátái (x; y).',
            4,
            "B'(4; 2)",
            { alternativeAnswer: 2, figure: tri }
        ),
        q(
            'er21o-16cC',
            '2021/16.c) Ugyanaz a nagyítás. C′ koordinátái (x; y).',
            12,
            "C'(12; 2)",
            { alternativeAnswer: 2, figure: tri }
        ),
        q(
            'er21o-17a',
            '2021/17.a) Számtani sorozat: a₂ = 24, a₅ = 81. Hány %-kal nagyobb S₁₆ a 106. tagnál?',
            18,
            'd = 19, a₁ = 5; S₁₆ = 2360; a₁₀₆ = 2000; 2360/2000 = 1,18 → 18%'
        ),
        q(
            'er21o-17b',
            '2021/17.b) Mértani sorozat: a₂ = 24, a₅ = 81. Hány tag kisebb, mint 10 000 000?',
            33,
            'q = 1,5, a₁ = 16; n ≈ 33,9 → 33 tag'
        ),
        q(
            'er21o-18a',
            '2021/18.a) Matekfakultációra kétszer annyian járnak, mint fizikára; 15-en legalább az egyikre, 6-an mindkettőre. Hányan járnak csak matekra?',
            8,
            'x + 2x − 6 = 15 → x = 7; csak matek: 14 − 6 = 8'
        ),
        q(
            'er21o-18b',
            '2021/18.b) Képernyő 16 : 9, 4 sor × 6 oszlop. Egy kis téglalap vízszintes : függőleges oldalaránya (két egész).',
            32,
            '16/6 : 9/4 = 64/54 = 32/27',
            { alternativeAnswer: 27, figure: screen }
        ),
        q(
            'er21o-18c',
            '2021/18.c) 24 téglalap véletlen elhelyezése. P(Stefi és Cili is az első sorba kerül)? (30/552 ≈ 0,054)',
            30 / 552,
            '24·23 = 552; kedvező 6·5 = 30; 30/552 ≈ 0,054',
            { figure: screen }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H20',
        location: 'er2021OktKozepBank.ts',
        message: '2021 okt kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-batch-2020-23',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2021_OKT_KOZEP_COUNT = 30;
