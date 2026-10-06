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

const FIG = '/figures/erettsegi/2024maj-kozep';

/** 2024. május 7. középszint (K2414) — válaszok a javítási útmutató szerint. */
export function getErettsegi2024MajKozepQuestions(): Question[] {
    const box = imageFigure(`${FIG}/p16-1.png`, '2024/15.c) sodrófadiagram');
    const isler = imageFigure(`${FIG}/p20-1.jpeg`, '2024/17. habos isler');
    const circuit = imageFigure(`${FIG}/p22-1.png`, '2024/18. áramköri gráf');
    const sets =
        'Az A és B halmazokról tudjuk, hogy A∪B={1; 2; 3; 4; 5; 6}, A∩B={1; 2}, és A\\B={3; 4}. Adja meg az A és B halmazokat elemeik felsorolásával!';
    const decagon = 'Egy szabályos tízszög egy oldalának hossza 10 cm.';
    const drinks =
        'Egy étteremben az üdítőitalok árát deciliterenként adják meg. Tudjuk, hogy 3 dl almalé és 5 dl baracklé összesen 1010 Ft-ba, 5 dl almalé és 3 dl baracklé pedig 990 Ft-ba kerül.';
    const islerStem =
        'A szolnoki habos isler alsó és felső része egy-egy 0,5 cm vastagságú, 6 cm átmérőjű, henger alakú tésztalap. A két tésztalap között 90 ml henger alakú hab található.';
    const rangeStem =
        'Ádám azt olvasta, hogy 2011-ben átlagosan 95 km volt egy elektromos autó hatótávolsága, 2023-ra pedig 425 km-re nőtt. Arra kíváncsi, melyik évben éri el az átlagos hatótávolság az 1000 km-t.';
    const verdict = 'Igaz=1, hamis=0, nem eldönthető=2.';

    const list: Question[] = [
        q(
            'er24m-1A',
            `2024/1. ${sets}\nÍrd be A elemeit.`,
            0,
            'A = {1; 2; 3; 4}',
            { expectedSet: ['1', '2', '3', '4'] }
        ),
        q(
            'er24m-1B',
            `2024/1. ${sets}\nÍrd be B elemeit.`,
            0,
            'B = {1; 2; 5; 6}',
            { expectedSet: ['1', '2', '5', '6'] }
        ),
        q(
            'er24m-2',
            '2024/2. Egy derékszögű háromszög egyik befogója 24 cm, átfogója 25 cm hosszú. Hány cm hosszú a másik befogó?',
            7,
            'sqrt(25²−24²) = 7'
        ),
        q(
            'er24m-3',
            '2024/3. Hány darab négyjegyű, különböző számjegyekből álló, pozitív páratlan szám alkotható az 1, 2, 3, 4 számjegyekből?',
            12,
            '3·2·1·2 = 12'
        ),
        q(
            'er24m-4',
            '2024/4. Egy kozmetikai cég alkalmazottja diagramot készített a 2022-ben és 2023-ban értékesített termékek mennyiségéről. A diagram szerint 2022-ben 1000, 2023-ban 1200 terméket értékesített. Igaz-e, hogy 2023-ban háromszor annyi terméket értékesített, mint 2022-ben? Igaz=1, hamis=0.',
            0,
            'Hamis: 1200 = 1,2 · 1000, nem 3-szoros.'
        ),
        q(
            'er24m-5',
            '2024/5. Adja meg a értékét, ha tudjuk, hogy a^{1/2} = 4.',
            16,
            'a = 4² = 16'
        ),
        q(
            'er24m-6',
            '2024/6. Egy számtani sorozat nyolcadik tagja 6-tal nagyobb, mint a negyedik tagja. A sorozat hatodik tagja 6. Számítsa ki a sorozat első 6 tagjának az összegét!',
            13.5,
            'd = 1,5; a1 = −1,5; S6 = 13,5'
        ),
        q(
            'er24m-7',
            '2024/7. Hány csúcsa, hány lapja és hány éle van egy hatszög alapú gúlának?',
            7,
            'csúcs 7, lap 7, él 12',
            { alternativeAnswer: 7, thirdAnswer: 12 }
        ),
        q(
            'er24m-8',
            '2024/8. Egy szám 2-es alapú logaritmusa 6. Mennyi a szám kétszeresének a 2-es alapú logaritmusa?',
            7,
            'log₂ 64 = 6; log₂ 128 = 7'
        ),
        q(
            'er24m-9',
            '2024/9. Egy városban a polgármester-választáson a győztes jelöltre a szavazáson résztvevők 55%-a szavazott, így 10 593 szavazatot kapott. Hányan vettek részt a szavazáson?',
            19260,
            '10593 / 0,55 = 19260'
        ),
        q(
            'er24m-10',
            '2024/10. Adott öt függvény: f: x ↦ x²;  g: x ↦ 2^x;  h: x ↦ 2x+3;  i: x ↦ |x|;  j: x ↦ 5. Adja meg azoknak a betűjelét, amelyeknek van zérushelye!',
            0,
            'f, h, i',
            { expectedSet: ['f', 'h', 'i'] }
        ),
        q(
            'er24m-11',
            '2024/11. Balázs magyar irodalomból az első félévben ezeket a jegyeket szerezte: 1, 5, 5, 5. Számítsa ki a jegyek átlagát és szórását!',
            4,
            'átlag 4, szórás ≈ 1,73',
            { alternativeAnswer: 1.73 }
        ),
        q(
            'er24m-12',
            '2024/12. Egy piros, egy fekete és egy fehér szabályos dobókockával egyszerre dobunk. Határozza meg annak a valószínűségét, hogy a dobás eredménye három különböző szám lesz!',
            120 / 216,
            '6·5·4 / 216 = 120/216 ≈ 0,556'
        ),
        q(
            'er24m-13a',
            '2024/13.a) Oldja meg a valós számok halmazán: 18·(7x+96)+19·(5x−56)=1990.',
            6,
            'x = 6'
        ),
        q(
            'er24m-13b',
            '2024/13.b) Írja fel az 1896 és az 1956 prímtényezős felbontását, és adja meg az 1896 és az 1956 összes közös, pozitív osztóját!\nÍrd be a közös pozitív osztókat.',
            0,
            '{1; 2; 3; 4; 6; 12}',
            { expectedSet: ['1', '2', '3', '4', '6', '12'] }
        ),
        q(
            'er24m-14a',
            `2024/14.a) ${decagon} Igazolja, hogy a tízszög egy belső szöge 144°-os!`,
            144,
            '(10−2)·180°/10 = 144°'
        ),
        q(
            'er24m-14b',
            `2024/14.b) ${decagon} Számítsa ki a tízszög területét!`,
            770,
            '(10·10²)/4 · 1/tg(18°) ≈ 770'
        ),
        q(
            'er24m-14c',
            '2024/14.c) Egy szabályos sokszög átlóinak a száma 2015. Hány oldalú a sokszög?',
            65,
            'n(n−3)/2 = 2015 → n = 65'
        ),
        q(
            'er24m-15a',
            `2024/15.a) ${drinks} Mennyibe kerül egy dl almalé, és mennyibe egy dl baracklé?`,
            120,
            'alma 120 Ft/dl, barack 130 Ft/dl',
            { alternativeAnswer: 130 }
        ),
        q(
            'er24m-15b',
            '2024/15.b) Anna almalevet, Bella baracklevet, Cili citromos teát rendelt. A pincér véletlenszerűen osztja ki nekik a három italt. Határozza meg annak a valószínűségét, hogy egyikük sem azt az italt kapja, amit rendelt!',
            1 / 3,
            '2 derangement / 6 = 1/3'
        ),
        q(
            'er24m-15c1',
            `2024/15.c) A sodrófadiagram az üdítőitalokért fizetett összegeket mutatja. „Az adatok terjedelme 7000 Ft.” ${verdict}`,
            0,
            'Hamis: max−min = 5500 Ft.',
            { figure: box }
        ),
        q(
            'er24m-15c2',
            `2024/15.c) A sodrófadiagram az üdítőitalokért fizetett összegeket mutatja. „A kifizetett összegek átlaga 3500 Ft.” ${verdict}`,
            2,
            'Nem lehet eldönteni (átlag nem olvasható le).',
            { figure: box }
        ),
        q(
            'er24m-15c3',
            `2024/15.c) A sodrófadiagram az üdítőitalokért fizetett összegeket mutatja. „A kifizetett összegek körülbelül 25%-a legalább 4000 Ft volt.” ${verdict}`,
            1,
            'Igaz: Q3 = 4000.',
            { figure: box }
        ),
        q(
            'er24m-15c4',
            `2024/15.c) A sodrófadiagram az üdítőitalokért fizetett összegeket mutatja. „Volt olyan asztal, ahol 2500 Ft-ot fizettek.” ${verdict}`,
            2,
            'Nem lehet eldönteni.',
            { figure: box }
        ),
        q(
            'er24m-16a',
            '2024/16.a) Péter négy függvény ábrázolása közül legalább kettőt meg fog csinálni. Hányféleképpen választhat ki a négy függvény közül legalább kettőt? Két kiválasztást különbözőnek tekintünk, ha van legalább egy olyan függvény, amelyik az egyik kiválasztásban szerepel, a másikban pedig nem.',
            11,
            'C(4,2)+C(4,3)+C(4,4) = 11'
        ),
        q(
            'er24m-16b',
            '2024/16.b) Egy lineáris függvény grafikonja átmegy a (12; 7) és a (13; 9) pontokon. Adja meg a hozzárendelési szabályt x ↦ mx+b alakban!\nÍrd be m-et és b-t.',
            2,
            'x ↦ 2x − 17',
            { alternativeAnswer: -17 }
        ),
        q(
            'er24m-16c',
            '2024/16.c) Írja fel a (12; 7) középpontú, 15 egység sugarú kör egyenletét, és számítsa ki a kör és az y-tengely metszéspontjainak koordinátáit!\nA beírandó számok a metszéspontok y-koordinátái.',
            -2,
            '(0; −2) és (0; 16)',
            { alternativeAnswer: 16 }
        ),
        q(
            'er24m-17a',
            `2024/17.a) ${islerStem} Hány cm³ a két tésztalap együttes térfogata?`,
            28.3,
            '2 · π · 3² · 0,5 = 9π ≈ 28,3',
            { figure: isler }
        ),
        q(
            'er24m-17b',
            `2024/17.b) ${islerStem} Hány cm a két tésztalap közötti, habbal kitöltött hengeres rész átmérője, ha a sütemény teljes magassága 5 cm?`,
            5.4,
            'πr²·4 = 90 → d ≈ 5,4',
            { figure: isler }
        ),
        q(
            'er24m-17c',
            '2024/17.c) Annak a valószínűsége, hogy egy isleren a csokimáz megreped, 0,03. Az egyik cukrászdában szerdán 30 islert készítenek. Számítsa ki annak a valószínűségét, hogy ezen a napon egyetlen islerten sem reped meg a csokimáz!',
            0.401,
            '0,97³⁰ ≈ 0,401',
            { figure: isler }
        ),
        q(
            'er24m-17d',
            '2024/17.d) Szerda délelőtt 20 rendelést adtak le. 1 rendelésben mindhárom sütemény (zserbó, krémes, isler) szerepelt, 2-ben egyik sem. 5-ben zserbó és krémes is, 3-ban zserbó és isler is, 6-ban isler és krémes is. 9 rendelésben szerepelt zserbó. Ugyanannyi rendelésben szerepelt krémes, mint amennyiben isler. Hány rendelésben szerepelt a három sütemény közül csak a krémes?',
            1,
            'csak krémes: 1',
            { figure: isler }
        ),
        q(
            'er24m-18a',
            '2024/18.a) Egy hatpontú gráfnak hat éle van, és öt pont fokszáma: 1, 2, 2, 3, 3. Adja meg a hatodik csúcs fokszámát!',
            1,
            '2e = 12 = 1+2+2+3+3+f → f = 1',
            { figure: circuit }
        ),
        q(
            'er24m-18b',
            `2024/18.b) ${rangeStem} Ha évről évre ugyanannyival nő az átlagos hatótávolság, melyik évben éri el az 1000 km-t?`,
            2044,
            'évi +27,5 km → 2044',
            { figure: circuit }
        ),
        q(
            'er24m-18c',
            `2024/18.c) ${rangeStem} Ha évről évre ugyanannyiszorosára nő az átlagos hatótávolság, melyik évben éri el az 1000 km-t?`,
            2030,
            'q = (425/95)^{1/12}; 95·q^n = 1000 → 2030',
            { figure: circuit }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'er2024MajKozepBank.ts',
        message: '2024 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-batch-2325',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2024_MAJ_KOZEP_COUNT = 34;
