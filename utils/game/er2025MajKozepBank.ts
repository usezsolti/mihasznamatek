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

const FIG = '/figures/erettsegi/2025maj-kozep';

/** 2025. május 6. középszint (K2511) — válaszok a javítási útmutató szerint. */
export function getErettsegi2025MajKozepQuestions(): Question[] {
    const tri = imageFigure(`${FIG}/p04-1.png`, '2025/5. hegyesszögű háromszög');
    const hex = imageFigure(`${FIG}/p06-2.png`, '2025/9. szabályos hatszög');
    const quad = imageFigure(`${FIG}/p14-1.jpeg`, '2025/14. ABCD négyszög');
    const dessert = imageFigure(`${FIG}/p20-1.jpeg`, '2025/17. túrórúd');
    const pie = imageFigure(`${FIG}/p23-1.png`, '2025/18.c) kördiagram');
    const sets =
        'Adottak a következő halmazok: A={1; 2; 3; 4; 5}, B={1; 3; 5; 7; 9}. Elemei felsorolásával adja meg az A∩B és az A\\B halmazt!';
    const prices =
        'Egy új építésű házban a megvehető 14 lakás ára, millió forintban: 50, 50, 55, 55, 55, 70, 70, 80, 80, 90, 110, 115, 130, 145. Ábrázolja sodrófadiagramon ezeket az adatokat!';
    const hexStem =
        'Az ábrán látható ABCDEF szabályos hatszögben a = BA vektor és c = BC vektor. Fejezze ki az a és c vektorok segítségével a CA és a BE vektorokat!';
    const quadStem =
        'Az ABCD négyszögben AB = 12 cm, BC = 15 cm, BD = 20 cm. Az A csúcsnál lévő belső szög derékszög, továbbá a DBC szög 63°.';
    const fnStem =
        'Adott három, a valós számok halmazán értelmezett függvény: f: x ↦ 2^x−3, g: x ↦ −x^2, h: x ↦ 2^x+1. Határozza meg mindhárom függvény esetén a megadott állítások logikai értékét!';
    const phone =
        'A hiányos táblázat a magyarországi mobiltelefon-hívások száma, összidőtartama és a két tizedesjegyre kerekített átlagos hívásidő. Hívások száma (millió db): 2002: 4399, 2007: 7173, 2012: 8045, 2017: hiányzik, 2022: 8577. Hívások időtartama (millió perc): 2002: 5080, 2007: 13653, 2012: 18001, 2017: 22377, 2022: hiányzik. Átlagos idő (perc): 2002: 1,15, 2007: 1,90, 2012: hiányzik, 2017: 2,83, 2022: 3,31.';
    const pressure =
        'A tengerszint felett h kilométer magasságban mérhető légnyomás p(h) = p(0)·10^(−0,054h). p(0) = 101 325 Pa.';

    const list: Question[] = [
        q(
            'er25m-1i',
            `2025/1. ${sets}\nÍrd be az A∩B elemeit.`,
            0,
            '{1; 3; 5}',
            { expectedSet: ['1', '3', '5'] }
        ),
        q(
            'er25m-1d',
            `2025/1. ${sets}\nÍrd be az A\\B elemeit.`,
            0,
            '{2; 4}',
            { expectedSet: ['2', '4'] }
        ),
        q(
            'er25m-2',
            '2025/2. Adja meg a 12 és a 20 legkisebb közös többszörösét!',
            60,
            'lkkt(12; 20) = 60'
        ),
        q(
            'er25m-3',
            '2025/3. Oldja meg az alábbi egyenletet a valós számok halmazán!\n2·(2^2)^3 / 2^4 = 2^x',
            3,
            '2·2^6 / 2^4 = 2^3 → x = 3'
        ),
        q(
            'er25m-4',
            '2025/4. Az alábbi táblázat egy kisbolt napi bevételeit mutatja az egyik héten hétfőtől péntekig, ezer forintban: hétfő 568, kedd 465, szerda 497, csütörtök 488, péntek 882. Hány ezer forint volt ezen az öt napon a bolt átlagos napi bevétele?',
            580,
            '(568+465+497+488+882)/5 = 580'
        ),
        q(
            'er25m-5',
            '2025/5. Az ábrán látható hegyesszögű háromszög 6 cm hosszú oldalával szemközti szöge 60°-os. Mekkora a háromszög 5 cm hosszú oldalával szemközti szög? Megoldását részletezze!',
            46.2,
            'sin α / 5 = sin 60° / 6 → α ≈ 46,2°',
            { figure: tri }
        ),
        q(
            'er25m-6',
            '2025/6. Rajzoljon egy olyan hatpontú gráfot, melyben a csúcsok fokszáma 5, 4, 3, 2, 2, 2.\nA beírandó szám a gráf éleinek száma.',
            9,
            'Fokszámösszeg 18 = 2e → e = 9'
        ),
        q(
            'er25m-7',
            '2025/7. Hány köbcentiméter egy 3 cm sugarú félgömb térfogata?',
            56.5,
            '(2/3)π·27 = 18π ≈ 56,5'
        ),
        q(
            'er25m-8',
            `2025/8. ${prices}\nA beírandó számok a minimum és a maximum.`,
            50,
            'min 50, max 145',
            { alternativeAnswer: 145 }
        ),
        q(
            'er25m-8q',
            `2025/8. ${prices}\nA beírandó számok az alsó kvartilis, a medián és a felső kvartilis.`,
            55,
            'Q1=55, medián=75, Q3=110',
            { alternativeAnswer: 75, thirdAnswer: 110 }
        ),
        q(
            'er25m-9a',
            `2025/9. ${hexStem}\nCA = p·a + q·c. Írd be p-t és q-t.`,
            1,
            'CA = a − c',
            { alternativeAnswer: -1, figure: hex }
        ),
        q(
            'er25m-9b',
            `2025/9. ${hexStem}\nBE = p·(a+c). Mennyi p?`,
            2,
            'BE = 2(a + c)',
            { figure: hex }
        ),
        q(
            'er25m-10',
            '2025/10. Írja fel annak a (0; 1) ponton átmenő egyenesnek az egyenletét, amely párhuzamos az y=2x+4 egyenletű egyenessel!\nA beírandó számok a meredekség és a tengelymetszet.',
            2,
            'y = 2x + 1',
            { alternativeAnswer: 1 }
        ),
        q(
            'er25m-11',
            '2025/11. Egy mértani sorozat második tagja 24, harmadik tagja 36. Határozza meg a sorozat első hat tagjának összegét! Megoldását részletezze!',
            332.5,
            'q = 1,5; a1 = 16; S6 = 332,5'
        ),
        q(
            'er25m-12',
            '2025/12. Egy piros és egy kék színű szabályos dobókockával egyszerre dobunk. Mennyi a valószínűsége annak, hogy az egyik kockával 6-ost, a másikkal pedig páratlan számot dobunk? Megoldását részletezze!',
            1 / 6,
            '6/36 = 1/6'
        ),
        q(
            'er25m-13a',
            '2025/13.a) Oldja meg az alábbi egyenletet a valós számok halmazán!\n(x+8)/20 + (x−5)/25 = 2',
            20,
            '5(x+8)+4(x−5) = 200 → x = 20'
        ),
        q(
            'er25m-13b',
            '2025/13.b) Egy téglalap egyik oldala 48 cm-rel hosszabb, mint a másik oldala. A téglalap területe 2025 cm². Számítsa ki a téglalap kerületét!',
            204,
            'oldalak 27 és 75; K = 204'
        ),
        q(
            'er25m-14a',
            `2025/14.a) ${quadStem} Számítsa ki a négyszög B csúcsnál lévő belső szögének, β-nak a nagyságát!`,
            116.1,
            'ABD szög ≈ 53,1°; β ≈ 116,1°',
            { figure: quad }
        ),
        q(
            'er25m-14b',
            `2025/14.b) ${quadStem} Számítsa ki a négyszög AD és CD oldalának hosszát, valamint a négyszög területét!`,
            16,
            'AD = 16 cm, CD ≈ 18,8 cm, T = 230 cm²',
            { alternativeAnswer: 18.8, thirdAnswer: 230, figure: quad }
        ),
        q(
            'er25m-14c',
            '2025/14.c) Határozza meg az alábbi állítás logikai értékét (igaz vagy hamis)! Válaszát indokolja! Ha egy négyszög átlói felezik egymást, akkor a négyszög rombusz. Igaz=1, hamis=0.',
            0,
            'Hamis (paralelogramma).',
            { figure: quad }
        ),
        q(
            'er25m-15afZ',
            `2025/15.a) ${fnStem} Az f függvénynek van zérushelye. Igaz=1, hamis=0.`,
            1,
            '2^x−3=0 megoldható. Igaz.'
        ),
        q(
            'er25m-15afM',
            `2025/15.a) ${fnStem} Az f függvénynek van maximuma. Igaz=1, hamis=0.`,
            0,
            'Szigorúan nő, nincs maximum. Hamis.'
        ),
        q(
            'er25m-15afS',
            `2025/15.a) ${fnStem} Az f függvény szigorúan monoton növekvő. Igaz=1, hamis=0.`,
            1,
            '2^x−3 szigorúan nő. Igaz.'
        ),
        q(
            'er25m-15agZ',
            `2025/15.a) ${fnStem} A g függvénynek van zérushelye. Igaz=1, hamis=0.`,
            1,
            '−x^2=0 az x=0-nál. Igaz.'
        ),
        q(
            'er25m-15agM',
            `2025/15.a) ${fnStem} A g függvénynek van maximuma. Igaz=1, hamis=0.`,
            1,
            'A maximum 0. Igaz.'
        ),
        q(
            'er25m-15agS',
            `2025/15.a) ${fnStem} A g függvény szigorúan monoton növekvő. Igaz=1, hamis=0.`,
            0,
            'Lefelé nyíló parabola. Hamis.'
        ),
        q(
            'er25m-15ahZ',
            `2025/15.a) ${fnStem} A h függvénynek van zérushelye. Igaz=1, hamis=0.`,
            0,
            '2^x+1 mindig pozitív. Hamis.'
        ),
        q(
            'er25m-15ahM',
            `2025/15.a) ${fnStem} A h függvénynek van maximuma. Igaz=1, hamis=0.`,
            0,
            'Szigorúan nő, nincs maximum. Hamis.'
        ),
        q(
            'er25m-15ahS',
            `2025/15.a) ${fnStem} A h függvény szigorúan monoton növekvő. Igaz=1, hamis=0.`,
            1,
            '2^x+1 szigorúan nő. Igaz.'
        ),
        q(
            'er25m-15b',
            `2025/15.b) ${fnStem} Adja meg a h függvény értelmezési tartományának azt az elemét, amelyhez a függvény 1,25-ot rendel!`,
            -2,
            '2^x+1 = 1,25 → x = −2'
        ),
        q(
            'er25m-15c',
            '2025/15.c) Adott a valós számok halmazán értelmezett j: x ↦ (x−1)^2−2 függvény. Ábrázolja a j függvényt a [−1; 4] intervallumon!\nA beírandó számok a minimumhely és a minimumérték.',
            1,
            'minimum (1; −2)',
            { alternativeAnswer: -2 }
        ),
        q(
            'er25m-16a1',
            `2025/16.a) ${phone} Számítsa ki a táblázat három hiányzó adatát!\nA 2012-es átlagos hívásidő (perc):`,
            2.24,
            '18001/8045 ≈ 2,24'
        ),
        q(
            'er25m-16a2',
            `2025/16.a) ${phone} Számítsa ki a táblázat három hiányzó adatát!\nA 2017-es hívások száma (millió db):`,
            7907,
            '22377/2,83 ≈ 7907'
        ),
        q(
            'er25m-16a3',
            `2025/16.a) ${phone} Számítsa ki a táblázat három hiányzó adatát!\nA 2022-es hívások időtartama (millió perc):`,
            28390,
            '8577·3,31 ≈ 28390'
        ),
        q(
            'er25m-16b',
            '2025/16.b) Egy telefonos játékban 12 szintet lehet teljesíteni. Az egymást követő szintekért járó pontszámok között mindig ugyanannyi a különbség. A negyedik szint teljesítéséért 630 pont, a hetedik szintért 990 pont jár. Mennyi az összpontszáma annak a játékosnak, aki teljesítette mind a 12 szintet?',
            11160,
            'd = 120; a1 = 270; S12 = 11160'
        ),
        q(
            'er25m-16c',
            '2025/16.c) Egy 32 fős munkahelyen mindenkitől megkérdezték, hogy az Alfa, a Béta és a Gamma mobiltelefon-szolgáltatók közül kinek melyiknél volt már előfizetése. 5 főnek az Alfánál és a Bétánál is, 6 főnek a Bétánál és a Gammánál is, 7 főnek pedig az Alfánál és a Gammánál is volt már előfizetése, közülük 4 főnek mindhárom szolgáltatónál volt már előfizetése. 1 főnek egyik szolgáltatónál sem volt még előfizetése. Akiknek csak az Alfánál volt már előfizetésük, azok kétszer annyian vannak, mint akiknek csak a Bétánál, és feleannyian, mint akiknek csak a Gammánál. Számítsa ki, hogy a megkérdezettek közül hány főnek volt már előfizetése a Bétánál!',
            10,
            'Béta: 10 fő'
        ),
        q(
            'er25m-17a',
            '2025/17.a) Több mint 60 éves Magyarország egyik kedvelt desszertje a csokoládéval bevont túrórúd. Az egyik automatába 300 Ft-ot kell bedobni, ha egy ilyen terméket vásárolunk. A gép csak 100 Ft-os és 50 Ft-os érméket fogad el. Hányféleképpen lehet ilyen érmékből 300 Ft-ot bedobni az automatába, ha a bedobás sorrendje is számít? Az azonos címletű érméket nem különböztetjük meg egymástól.',
            13,
            '0, 2, 4 vagy 6 darab 100 Ft-os: 1+6+5+1 = 13',
            { figure: dessert }
        ),
        q(
            'er25m-17b',
            '2025/17.b) Anna 2 darab tejcsokoládé- és 4 darab étcsokoládé-bevonatú desszertet vásárolt. A hat desszert közül Balázs véletlenszerűen kiválaszt hármat, visszatevés nélkül. Mennyi a valószínűsége annak, hogy egy darab tejcsokoládé- és két darab étcsokoládé-bevonatú desszertet választ ki Balázs?',
            0.6,
            'C(2,1)·C(4,2)/C(6,3) = 0,6',
            { figure: dessert }
        ),
        q(
            'er25m-17c',
            '2025/17.c) A desszert készítésekor egy 18 mm átmérőjű, 100 mm hosszúságú lehűtött túróhenger köré csokoládébevonatot dermesztenek. A kész desszert alakja egy 20 mm × 10 mm × 102 mm méretű téglatest és egy 20 mm átmérőjű, 102 mm hosszúságú félhenger egyesítésének tekinthető. Hány cm³ csokoládé kerül egy desszertbe?',
            11,
            '≈ 11 cm³',
            { figure: dessert }
        ),
        q(
            'er25m-18a',
            `2025/18.a) ${pressure} A Föld legmagasabb hegycsúcsa, a Mount Everest 8848 méter magas. Számítsa ki a megadott képlettel, hogy mekkora a Mount Everest csúcsán mérhető légnyomás!`,
            33723,
            'p(8,848) ≈ 33 723 Pa'
        ),
        q(
            'er25m-18b',
            `2025/18.b) ${pressure} A képlet alapján hány méter magasságban lesz a légnyomás 60 000 Pa? Válaszát 100 méterre kerekítve adja meg!`,
            4200,
            'h ≈ 4,2 km = 4200 m'
        ),
        q(
            'er25m-18c',
            '2025/18.c) A táblázat azoknak a hegymászóknak a számát mutatja kontinensenként, akik 2024 szeptemberéig legalább kétszer sikeresen feljutottak a Mount Everest csúcsára. Ázsia 125, Amerika 70, Európa 50, többi kontinens 23. Ábrázolja kördiagramon a táblázatban szereplő hegymászók számának kontinensek szerinti megoszlását!\nA beírandó számok az összlétszám és Ázsia körcikkének középponti szöge (fok).',
            268,
            '268 fő; Ázsia ≈ 168°',
            { alternativeAnswer: 168, figure: pie }
        ),
        q(
            'er25m-18d',
            '2025/18.d) Egy ötfős hegymászócsapat indul a csúcs felé. A csapat tagjai között van Ágnes és László. Hányféle sorrendben haladhatnak öten egymás után, ha Ágnes és László, valamilyen sorrendben, közvetlenül egymás után haladnak?',
            48,
            '2·4! = 48'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'er2025MajKozepBank.ts',
        message: '2025 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-batch-2325',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2025_MAJ_KOZEP_COUNT = 43;
