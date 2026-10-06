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
    const sets =
        'Az alaphalmaz az egyjegyű pozitív egész számok halmaza. A a prímszámok, B a 3-mal osztható számok halmaza. Elemei felsorolásával adja meg a B és az A\\B halmazt!';
    const fn =
        'Adott a valós számok halmazán értelmezett f(x)=(x+3)²−2,25 függvény.';
    const rect =
        'Az ABCD téglalap AB oldalának hossza 12 cm, a BC oldal hossza 6 cm. A téglalapba az AECF rombuszt írjuk az ábrán látható módon, ahol E az AB oldal, F pedig a CD oldal egy pontja.';
    const pop =
        'Az ENSZ felmérése szerint a Föld népessége 8 milliárd fő volt 2022 végén. A népességnövekedés mértéke körülbelül évi 1%.';
    const grades =
        'A 24 fős csoport osztályzatai: 1-es 0 darab, 2-es 2 darab, 3-as 9 darab, 4-es 6 darab, 5-ös 7 darab.';
    const trap =
        'Az ABCD trapéz AB alapja 24 cm, a többi oldala 12 cm hosszú.';

    const list: Question[] = [
        q(
            'er23m-1',
            '2023/1. Egy akció során az eredetileg 21 000 Ft-os cipő árát 20%-kal csökkentették. Mennyi a cipő csökkentett ára?',
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
            `2023/3. ${sets}\nÍrd be B elemeit.`,
            0,
            'B = {3; 6; 9}',
            { expectedSet: ['3', '6', '9'] }
        ),
        q(
            'er23m-3d',
            `2023/3. ${sets}\nÍrd be az A\\B elemeit.`,
            0,
            'A \\ B = {2; 5; 7}',
            { expectedSet: ['2', '5', '7'] }
        ),
        q(
            'er23m-5',
            '2023/5. Adja meg a 420 és az 504 legnagyobb közös osztóját!',
            84,
            '420 = 2²·3·5·7; 504 = 2³·3²·7; LNKO = 2²·3·7 = 84'
        ),
        q(
            'er23m-6',
            '2023/6. Adott az A(2; 4) és a B(3; −1) pont. Írja fel az AB vektort a koordinátáival!\nÍrd be az x és az y koordinátát.',
            1,
            'AB = (1; −5)',
            { alternativeAnswer: -5 }
        ),
        q(
            'er23m-7',
            '2023/7. Egy mértani sorozat második tagja 6, harmadik tagja 9. Számítsa ki a sorozat első hat tagjának az összegét!',
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
            '2023/9. „Minden út Rómába vezet.” Válassza ki az állítás tagadásait!\nA) Nincs olyan út, ami Rómába vezet.\nB) Van olyan út, amelyik nem Rómába vezet.\nC) Semelyik út nem vezet Rómába.\nD) Nem minden út vezet Rómába.',
            0,
            'B, D',
            { expectedSet: ['B', 'D'] }
        ),
        q(
            'er23m-10',
            '2023/10. Adott a 2x+5y=19 egyenletű f egyenes. Adja meg az f egyenes és az y=5 egyenletű egyenes metszéspontjának koordinátáit!',
            -3,
            '(−3; 5)',
            { alternativeAnswer: 5 }
        ),
        q(
            'er23m-11',
            '2023/11. Számítsa ki az 1989 cm³ térfogatú gömb sugarának hosszát!',
            7.8,
            'r = ∛(3·1989/(4π)) ≈ 7,8'
        ),
        q(
            'er23m-12',
            '2023/12. Egy kék és egy piros szabályos dobókockával dobva mennyi a valószínűsége annak, hogy a kék kockával nagyobb számot dobunk, mint a pirossal?',
            0.417,
            '15/36 ≈ 0,417'
        ),
        q(
            'er23m-13a',
            `2023/13.a) ${fn} Mit rendel az f függvény az x=1-hez?`,
            13.75,
            '(1 + 3)² − 2,25 = 13,75'
        ),
        q(
            'er23m-13b',
            `2023/13.b) ${fn} Adja meg az f függvény zérushelyeit!`,
            -1.5,
            'x = −1,5 és x = −4,5',
            { alternativeAnswer: -4.5 }
        ),
        q(
            'er23m-13c',
            `2023/13.c) ${fn} Döntse el, hogy az f függvénynek maximuma vagy minimuma van-e, majd adja meg a szélsőérték helyét és értékét!\nA beírandó számok a szélsőérték helye és értéke.`,
            -3,
            'x = −3, minimum −2,25',
            { alternativeAnswer: -2.25 }
        ),
        q(
            'er23m-13d',
            `2023/13.d) ${fn} Az f függvény értékkészlete a valós számok halmaza. Igaz=1, hamis=0.`,
            0,
            'Hamis (minimum −2,25).'
        ),
        q(
            'er23m-14a',
            `2023/14.a) ${rect} Igazolja, hogy a rombusz oldalainak hossza 7,5 cm!`,
            7.5,
            'x = 7,5 cm',
            { figure: rhomb }
        ),
        q(
            'er23m-14b',
            `2023/14.b) ${rect} Számítsa ki a rombusz belső szögeinek nagyságát!\nA beírandó számok a két különböző belső szög (fok).`,
            53.1,
            'α ≈ 53,1°, 180° − 53,1° = 126,9°',
            { alternativeAnswer: 126.9, figure: rhomb }
        ),
        q(
            'er23m-14c',
            `2023/14.c) ${rect} Hány százaléka a rombusz területe a téglalap területének?`,
            62.5,
            '45/72 = 0,625 → 62,5%',
            { figure: rhomb }
        ),
        q(
            'er23m-15a',
            `2023/15.a) ${pop} Hány fő élne 2100 végén a Földön, ha addig folyamatosan évi 1% lenne a népességnövekedés?\nA beírandó szám milliárd fő.`,
            17.38,
            '8 · 1,01⁷⁸ ≈ 17,38'
        ),
        q(
            'er23m-15b',
            `2023/15.b) ${pop} Melyik évben érné el a 12 milliárd főt a Föld népessége évi 1%-os növekedés mellett?`,
            2063,
            '8 · 1,01ⁿ = 12 → n ≈ 40,75 → 2022 + 41 = 2063'
        ),
        q(
            'er23m-15c',
            '2023/15.c) A Föld népessége 8 milliárd fő volt 2022 végén. Az ENSZ becslése szerint 2100 végére 10,35 milliárd fő lesz. 2022 végétől kezdve évente hány százalékkal kellene növekednie a népességnek ennek eléréséhez, ha minden évben ugyanannyi százalékkal nőne?',
            0.33,
            '8 · q⁷⁸ = 10,35 → q ≈ 1,0033 → 0,33%'
        ),
        q(
            'er23m-16a',
            '2023/16.a) A középszintű matematika érettségin minden vizsgázó pontosan két feladatot választ a 16., 17. és 18. feladatok közül. Egy 24 fős csoportban a vizsgázók 75%-a választotta a 16-ost, 62,5%-a a 17-est. A csoportban a vizsgázók hány százaléka választotta a 18-as feladatot?',
            62.5,
            '75 + 62,5 + x = 200 → x = 62,5'
        ),
        q(
            'er23m-16b',
            `2023/16.b) ${grades} Számítsa ki az osztályzatok átlagát ebben a csoportban!`,
            3.75,
            '(2·2 + 9·3 + 6·4 + 7·5)/24 = 3,75'
        ),
        q(
            'er23m-16c',
            `2023/16.c) ${grades} Adja meg az osztályzatok móduszát, mediánját és terjedelmét ebben a csoportban!`,
            3,
            'módusz=3, medián=4, terjedelem=3',
            { alternativeAnswer: 4, thirdAnswer: 3 }
        ),
        q(
            'er23m-16d',
            `2023/16.d) ${grades} Ábrázolja kördiagramon az osztályzatok eloszlását ebben a csoportban!\nA beírandó számok a 2-es, a 3-as, a 4-es és az 5-ös osztályzat körcikkének középponti szöge (fok).`,
            30,
            '2-es 30°, 3-as 135°, 4-es 90°, 5-ös 105°',
            { alternativeAnswer: 135, thirdAnswer: 90, fourthAnswer: 105 }
        ),
        q(
            'er23m-16e',
            `2023/16.e) ${grades} Az érettségi elnök nyolc dolgozatot választ úgy, hogy 2-esből, 3-asból, 4-esből és 5-ösből is pontosan kettő szerepeljen. Hányféleképpen választhat ki ilyen módon nyolc dolgozatot?`,
            11340,
            'C(2;2)·C(9;2)·C(6;2)·C(7;2) = 1·36·15·21 = 11 340'
        ),
        q(
            'er23m-17a',
            `2023/17.a) ${trap} Igazolja, hogy a trapéz A csúcsánál lévő belső szög 60°-os!`,
            60,
            'cos α = 6/12 = 1/2 → α = 60°'
        ),
        q(
            'er23m-17b',
            `2023/17.b) ${trap} Számítsa ki a BD átló hosszát!`,
            20.8,
            'BD = √432 ≈ 20,8'
        ),
        q(
            'er23m-17c',
            `2023/17.c) ${trap} A trapézt megforgatjuk a szimmetriatengelye körül. Számítsa ki a keletkező forgástest térfogatát!`,
            2742,
            'csonkakúp: V ≈ 2742'
        ),
        q(
            'er23m-17d',
            '2023/17.d) Egy trapéz alakú területre szőlőt telepítettek, az első sorba 120 szőlőtőkét, az utolsóba 240-et. A második sortól kezdve minden sorba ugyanannyival több tőke került, mint az előzőbe. Összesen 7380 darab szőlőtőkét ültettek el. Az első 20 sorba kizárólag olaszrizlingtőke került, és máshova ebből a fajtából nem ültettek. Számítsa ki a telepített olaszrizlingtőkék számát!',
            2970,
            'n = 41, d = 3; S20 = 2970'
        ),
        q(
            'er23m-18b',
            '2023/18.b) Egy négyszögöl egyenlő az egy öl oldalhosszúságú négyzet területével. Egy hektár, azaz 10 000 m², körülbelül 2780 négyszögöl. Számítsa ki, hogy egy öl hány méter!',
            1.9,
            '√(10 000/2780) ≈ 1,9'
        ),
        q(
            'er23m-18c',
            '2023/18.c) 12 egyforma telket 1 Ft-os áron adnak el. Az akcióra 14 család jelentkezik, köztük a Kovács és a Szabó család, ezért a 14 család közül sorsolják ki a 12 nyertest. Számítsa ki annak a valószínűségét, hogy a Kovács és a Szabó család is a nyertesek között lesz!',
            0.725,
            'C(12;10)/C(14;12) = 66/91 ≈ 0,725'
        ),
        q(
            'er23m-18d',
            '2023/18.d) 12 egybevágó, téglalap alakú telek. Ha két szomszédos telek a rövidebb oldalával csatlakozik, 228 méter kerítés kell, ha a hosszabb oldallal, 156 méter. Mekkora egy telek területe?',
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

export const ERETTSEGI_2023_MAJ_KOZEP_COUNT = 34;
