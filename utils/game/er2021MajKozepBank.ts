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

const FIG = '/figures/erettsegi/2021maj-kozep';

/** 2021. május 4. középszint (2112) — válaszok a javítási útmutató szerint. */
export function getErettsegi2021MajKozepQuestions(): Question[] {
    const trap = imageFigure(`${FIG}/p14-1.jpeg`, '2021/14. ABCD derékszögű trapéz');
    const graph = imageFigure(`${FIG}/p18-1.jpeg`, '2021/16. jégkorong-gráf');
    const puck = imageFigure(`${FIG}/p18-2.jpeg`, '2021/16.d) jégkorong');
    const pts = imageFigure(`${FIG}/p22-1.jpeg`, '2021/18. A–G pontok');

    const list: Question[] = [
        q(
            'er21m-1',
            '2021/1. Számtani sorozat: a második tag 8, a negyedik 18. Az első tag?',
            3,
            'a2=a1+d=8, a4=a1+3d=18 → 2d=10, d=5, a1=3'
        ),
        q(
            'er21m-2',
            '2021/2. Hányadik hatványra kell emelni a 2-t, hogy 512-t kapjunk?',
            9,
            '2⁹ = 512'
        ),
        q(
            'er21m-3',
            '2021/3. A a pozitív kétjegyű páros számok, B a 40-nél kisebb, 3-mal osztható pozitív számok. Sorold fel A ∩ B elemeit.',
            0,
            'A ∩ B = {12; 18; 24; 30; 36}',
            { expectedSet: ['12', '18', '24', '30', '36'] }
        ),
        q(
            'er21m-4',
            '2021/4. Négyszög belső szögeinek aránya 1 : 2 : 3 : 4. A legnagyobb szög (fok)?',
            144,
            '10α = 360° → α = 36°, 4α = 144°'
        ),
        q(
            'er21m-5',
            '2021/5. „Volt olyan nap a múlt héten, amikor esett az eső.” Mely állítások tagadják?\nA) Minden nap esett.  B) Egyik nap sem esett.  C) Nem volt olyan nap, amikor esett.  D) Volt olyan nap, amikor nem esett.\nÍrd be a helyes betűket.',
            0,
            'B és C',
            { expectedSet: ['B', 'C'] }
        ),
        q(
            'er21m-6',
            '2021/6. Órabérek (Ft): 1000 (9 db), 1200 (4), 1500 (5), 1600 (7). Add meg a terjedelmet, a móduszt, a mediánt és az átlagot.',
            600,
            'terjedelem=600, módusz=1000, medián=1200, átlag=1300',
            { alternativeAnswer: 1000, thirdAnswer: 1200, fourthAnswer: 1300 }
        ),
        q(
            'er21m-7',
            '2021/7. 150 000 Ft-ból 6% működési költséget levonnak. Hány forintot írnak jóvá?',
            141000,
            '150 000 · 0,94 = 141 000'
        ),
        q(
            'er21m-8',
            '2021/8. f: x ↦ (2/5)x + 8/5. Adj meg egy pontot a grafikonon. Add meg x és y koordinátáját.',
            1,
            'például (1; 2)',
            { alternativeAnswer: 2 }
        ),
        q(
            'er21m-9',
            '2021/9. Szabályos sokszög egyik csúcsából két átló: háromszög, négyszög és ötszög. Hány oldalú a sokszög?',
            8,
            '8'
        ),
        q(
            'er21m-10',
            '2021/10. |x − 4| = 1 a valósokon. Add meg a két gyököt.',
            5,
            'x = 5 vagy x = 3',
            { alternativeAnswer: 3 }
        ),
        q(
            'er21m-11',
            '2021/11. f(x) = 2 · sin(x + π). f(π/2) = ?',
            -2,
            'sin(3π/2) = −1 → f(π/2) = −2'
        ),
        q(
            'er21m-12',
            '2021/12. Véletlen háromjegyű pozitív egész. P(számjegyei különbözők)? Tizedestörtként.',
            0.72,
            '648/900 = 0,72'
        ),
        q(
            'er21m-13a',
            '2021/13.a) (x + 4)² + (x + 1)(x + 2) = 9. Add meg a két valós gyököt.',
            -1,
            '2x² + 11x + 9 = 0 → x = −1 vagy x = −4,5',
            { alternativeAnswer: -4.5 }
        ),
        q(
            'er21m-13b',
            '2021/13.b) 2x + y = 7 és 3x − 7y = 36. Add meg x-et és y-t.',
            5,
            'x = 5, y = −3',
            { alternativeAnswer: -3 }
        ),
        q(
            'er21m-14a',
            '2021/14.a) ABCD derékszögű trapéz, BC = 6 cm, CD = 12 cm, BCD∠ = 110°. AD és AB hossza (cm, két tizedesre).',
            5.64,
            'AD ≈ 5,64 cm, AB ≈ 14,05 cm',
            { alternativeAnswer: 14.05, figure: trap }
        ),
        q(
            'er21m-14b',
            '2021/14.b) BCD háromszög: BD hossza (cm, két tizedesre) és a két ismeretlen szög (fok, egy tizedesre).',
            15.14,
            'BD ≈ 15,14 cm, δ ≈ 21,9°, β ≈ 48,1°',
            { alternativeAnswer: 21.9, thirdAnswer: 48.1, figure: trap }
        ),
        q(
            'er21m-15a',
            '2021/15.a) E = 37 · lg K + 31 = 70. A kutya valódi kora: hány év és hány hónap (egész hónapra kerekítve)?',
            11,
            'K ≈ 11,325 év → 11 év 4 hónap',
            { alternativeAnswer: 4 }
        ),
        q(
            'er21m-15b',
            '2021/15.b) K = 8. Emberévek a két képlettel, és hány %-kal nagyobb az amerikai? Add meg a két életkort és a százalékot.',
            56,
            '5,5·8+12 = 56; 37·lg8+31 ≈ 64,4; 15%-kal nagyobb',
            { alternativeAnswer: 64.4, thirdAnswer: 15 }
        ),
        q(
            'er21m-16a',
            '2021/16.a) Adj meg három olyan csapatot, amelyek közül bármely kettő már játszott. Írd be az összes ilyen hármast.',
            0,
            '{ABE; ACD; ACE; AEF; BGH; DGH}',
            { expectedSet: ['ABE', 'ACD', 'ACE', 'AEF', 'BGH', 'DGH'], figure: graph }
        ),
        q(
            'er21m-16b',
            '2021/16.b) Hány mérkőzés maradt el az első 5 fordulóban?',
            5,
            '15 lejátszott, 20 tervezett → 5 elmaradt',
            { figure: graph }
        ),
        q(
            'er21m-16c',
            '2021/16.c) P(gól)=0,3. 10 büntetőből pontosan 4 gól valószínűsége, három tizedesre.',
            0.2,
            'C(10,4)·0,3⁴·0,7⁶ ≈ 0,200'
        ),
        q(
            'er21m-16d',
            '2021/16.d) Hasonló korong térfogata 1 m³. Magasság és alapkörátmérő (cm, egészre).',
            52,
            'k ≈ 20,5; m ≈ 52 cm, d ≈ 156 cm',
            { alternativeAnswer: 156, figure: puck }
        ),
        q(
            'er21m-17a',
            '2021/17.a) x ↦ mx + b, f(1)=200, f(21)=5200. Add meg m-et és b-t.',
            250,
            'm = 250, b = −50',
            { alternativeAnswer: -50 }
        ),
        q(
            'er21m-17b',
            '2021/17.b) 21 nap: első 200 m, utolsó 5200 m. Összesen hány méter számtani, illetve mértani sorozat esetén?',
            56700,
            'S21 = 56 700 m (számtani), ≈ 33 500 m (mértani)',
            { alternativeAnswer: 33500 }
        ),
        q(
            'er21m-17c',
            '2021/17.c) Indulók 36%-a nő (átlag 35 év), 64%-a férfi (átlag 38 év). Az összes induló átlagéletkora?',
            36.92,
            '0,36·35 + 0,64·38 = 36,92 (≈ 37 is elfogadható)',
            { alternativeAnswer: 37 }
        ),
        q(
            'er21m-18a',
            '2021/18.a) Hány különböző egyenes illeszkedik az ábrán lévő pontok közül legalább kettőre?',
            12,
            '5·2 + 2 = 12',
            { figure: pts }
        ),
        q(
            'er21m-18b',
            '2021/18.b) Hány háromszög készíthető a 7 pontból (nem egy egyenesen)?',
            25,
            'C(7,3) − C(5,3) = 35 − 10 = 25',
            { figure: pts }
        ),
        q(
            'er21m-18d',
            '2021/18.d) K(−1; 5), L(1; 1), M(5; 3) körülírt köre. Add meg a középpont x, y koordinátáját és r²-et.',
            2,
            '(x − 2)² + (y − 4)² = 10',
            { alternativeAnswer: 4, thirdAnswer: 10, figure: pts }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H20',
        location: 'er2021MajKozepBank.ts',
        message: '2021 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id },
        runId: 'er-batch-2020-23',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2021_MAJ_KOZEP_COUNT = 28;
