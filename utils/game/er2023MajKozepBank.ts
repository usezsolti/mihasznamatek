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

const FIG = '/figures/erettsegi/2023maj-kozep';

/** 2023. május 9. középszint (2312) — válaszok a javítási útmutató szerint. */
export function getErettsegi2023MajKozepQuestions(): Question[] {
    const rhomb = imageFigure(`${FIG}/p14-1.png`, '2023/14. ABCD téglalap, AECF rombusz');
    const plots = imageFigure(`${FIG}/p22-6.png`, '2023/18.d) telkek és kerítés');

    const list: Question[] = [
        q(
            'er23m-1',
            '2023/1. Az eredetileg 21 000 Ft-os cipő árát 20%-kal csökkentették. Mennyi a csökkentett ár (Ft)?',
            16800,
            '21 000 · 0,8 = 16 800'
        ),
        q(
            'er23m-2',
            '2023/2. Hány éle van egy hétpontú teljes gráfnak?',
            21,
            'C(7; 2) = 7·6/2 = 21'
        ),
        q(
            'er23m-3B',
            '2023/3. U = egyjegyű pozitív egészek, A a prímek, B a 3-mal oszthatók. Sorold fel B elemeit.',
            0,
            'B = {3; 6; 9}',
            { expectedSet: ['3', '6', '9'] }
        ),
        q(
            'er23m-3d',
            '2023/3. Ugyanazok a halmazok. Sorold fel A \\ B elemeit.',
            0,
            'A \\ B = {2; 5; 7}',
            { expectedSet: ['2', '5', '7'] }
        ),
        q(
            'er23m-5',
            '2023/5. Add meg a 420 és az 504 legnagyobb közös osztóját!',
            84,
            '420 = 2²·3·5·7; 504 = 2³·3²·7; LNKO = 2²·3·7 = 84'
        ),
        q(
            'er23m-6',
            '2023/6. A(2; 4), B(3; −1). Add meg az AB vektor x és y koordinátáját.',
            1,
            'AB = (1; −5)',
            { alternativeAnswer: -5 }
        ),
        q(
            'er23m-7',
            '2023/7. Mértani sorozat: a2 = 6, a3 = 9. Az első hat tag összege?',
            83.125,
            'q = 1,5; a1 = 4; S6 = 83,125'
        ),
        q(
            'er23m-8',
            '2023/8. Hány olyan háromjegyű pozitív egész van, amelynek számjegyei különböző páratlan számok?',
            60,
            '5·4·3 = 60'
        ),
        q(
            'er23m-9',
            '2023/9. „Minden út Rómába vezet.” Mely állítások tagadják?\nA) Nincs olyan út, ami Rómába vezet.\nB) Van olyan út, amelyik nem Rómába vezet.\nC) Semelyik út nem vezet Rómába.\nD) Nem minden út vezet Rómába.\nÍrd be a helyes betűket.',
            0,
            'B, D',
            { expectedSet: ['B', 'D'] }
        ),
        q(
            'er23m-10',
            '2023/10. 2x + 5y = 19 és y = 5 metszéspontja. Add meg x-et és y-t.',
            -3,
            '(−3; 5)',
            { alternativeAnswer: 5 }
        ),
        q(
            'er23m-11',
            '2023/11. 1989 cm³ térfogatú gömb sugara (cm, egy tizedesre)?',
            7.8,
            'r = ∛(3·1989/(4π)) ≈ 7,8'
        ),
        q(
            'er23m-12',
            '2023/12. Kék és piros szabályos dobókocka. P(kék > piros)? Tizedestörtként.',
            0.417,
            '15/36 ≈ 0,417'
        ),
        q(
            'er23m-13a',
            '2023/13.a) f(x) = (x + 3)² − 2,25. f(1) = ?',
            13.75,
            '(1 + 3)² − 2,25 = 13,75'
        ),
        q(
            'er23m-13b',
            '2023/13.b) (x + 3)² − 2,25 = 0. Add meg a két zérushelyet.',
            -1.5,
            'x = −1,5 és x = −4,5',
            { alternativeAnswer: -4.5 }
        ),
        q(
            'er23m-13c',
            '2023/13.c) f-nek az x = ? helyen minimuma van, melynek értéke? Add meg a helyet és az értéket.',
            -3,
            'x = −3, minimum −2,25',
            { alternativeAnswer: -2.25 }
        ),
        q(
            'er23m-13d',
            '2023/13.d) „Az f függvény értékkészlete a valós számok halmaza.” Igaz=1, hamis=0.',
            0,
            'Hamis (minimum −2,25).'
        ),
        q(
            'er23m-14a',
            '2023/14.a) ABCD téglalap: AB = 12 cm, BC = 6 cm, beírt AECF rombusz. A rombusz oldalhossza (cm)?',
            7.5,
            'x = 7,5 cm',
            { figure: rhomb }
        ),
        q(
            'er23m-14b',
            '2023/14.b) A rombusz belső szögei (fok, egy tizedesre). Add meg a két szöget.',
            53.1,
            'α ≈ 53,1°, 180° − 53,1° = 126,9°',
            { alternativeAnswer: 126.9, figure: rhomb }
        ),
        q(
            'er23m-14c',
            '2023/14.c) Hány százaléka a rombusz területe a téglalap területének?',
            62.5,
            '45/72 = 0,625 → 62,5%',
            { figure: rhomb }
        ),
        q(
            'er23m-15a',
            '2023/15.a) 8 milliárd fő, évi 1% növekedés. 2100 végén hány milliárd fő (két tizedesre)?',
            17.38,
            '8 · 1,01⁷⁸ ≈ 17,38'
        ),
        q(
            'er23m-15b',
            '2023/15.b) Ugyanaz a modell. Melyik évben éri el a 12 milliárd főt?',
            2063,
            '8 · 1,01ⁿ = 12 → n ≈ 40,75 → 2022 + 41 = 2063'
        ),
        q(
            'er23m-15c',
            '2023/15.c) 8 milliárdról 10,35 milliárdra 78 év alatt. Éves növekedés (%, két tizedesre)?',
            0.33,
            '8 · q⁷⁸ = 10,35 → q ≈ 1,0033 → 0,33%'
        ),
        q(
            'er23m-16a',
            '2023/16.a) 24 fő, mindenki 2 feladatot választ a 16–18 közül. 75% a 16-ost, 62,5% a 17-est. Hány % választotta a 18-ast?',
            62.5,
            '75 + 62,5 + x = 200 → x = 62,5'
        ),
        q(
            'er23m-16b',
            '2023/16.b) Osztályzatok: 2 (2 db), 3 (9), 4 (6), 5 (7). Az átlag?',
            3.75,
            '(2·2 + 9·3 + 6·4 + 7·5)/24 = 3,75'
        ),
        q(
            'er23m-16c',
            '2023/16.c) Ugyanazok az osztályzatok. Add meg a móduszt, a mediánt és a terjedelmet.',
            3,
            'módusz=3, medián=4, terjedelem=3',
            { alternativeAnswer: 4 }
        ),
        q(
            'er23m-16e',
            '2023/16.e) 24 dolgozatból 8-at úgy, hogy 2-esből, 3-asból, 4-esből és 5-ösből is pontosan kettő legyen. Hányféleképpen?',
            11340,
            'C(2;2)·C(9;2)·C(6;2)·C(7;2) = 1·36·15·21 = 11 340'
        ),
        q(
            'er23m-17a',
            '2023/17.a) ABCD trapéz, AB = 24 cm, a többi oldal 12 cm. Az A csúcsnál lévő belső szög (fok)?',
            60,
            'cos α = 6/12 = 1/2 → α = 60°'
        ),
        q(
            'er23m-17b',
            '2023/17.b) Ugyanaz a trapéz. A BD átló hossza (cm, egy tizedesre)?',
            20.8,
            'BD = √432 ≈ 20,8'
        ),
        q(
            'er23m-17c',
            '2023/17.c) A trapézt a szimmetriatengelye körül megforgatjuk. A forgástest térfogata (cm³, egészre)?',
            2742,
            'csonkakúp: V ≈ 2742'
        ),
        q(
            'er23m-17d',
            '2023/17.d) Számtani: első sor 120, utolsó 240, összesen 7380 tőke. Az első 20 sorban hány olaszrizling?',
            2970,
            'n = 41, d = 3; S20 = 2970'
        ),
        q(
            'er23m-18b',
            '2023/18.b) 1 hektár = 10 000 m² ≈ 2780 négyszögöl. Egy öl hány méter (egy tizedesre)?',
            1.9,
            '√(10 000/2780) ≈ 1,9'
        ),
        q(
            'er23m-18c',
            '2023/18.c) 14 családból 12 nyertest sorsolnak. P(Kovács és Szabó is nyer)? Tizedestörtként.',
            0.725,
            'C(12;10)/C(14;12) = 66/91 ≈ 0,725'
        ),
        q(
            'er23m-18d',
            '2023/18.d) Két szomszédos telek kerítése: rövidebb oldalon 228 m, hosszabb oldalon 156 m. Egy telek területe (m²)?',
            700,
            'a = 14 m, b = 50 m; T = 14·50 = 700',
            { figure: plots }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H20',
        location: 'er2023MajKozepBank.ts',
        message: '2023 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id },
        runId: 'er-batch-2020-23',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2023_MAJ_KOZEP_COUNT = 33;
