import type { Question } from './types';

/**
 * Síkgeometria — 6 szint × 20 feladat (Síkgeometria.pdf).
 * 1 Alapok → 2 Hasonlóság → 3 Trigonometria →
 * 4 Kör / húrnégyszög → 5 Összetett → 6 Mesterfok.
 * Egy kártya = egy szám vagy halmaz. π / √3: együttható.
 * Igen/hamis: 1 / 0. Decimális: 3 tizedes (szög: kulcs szerint).
 */
export const getSikgeometriaPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Egy háromszög két belső szöge 48° és 67°. Határozd meg a harmadik szöget fokban!`,
        answer: 65,
        type: 'multiplication',
        expression: `180 − 48 − 67 = 65°`,
    },
    {
        stage: 1,
        question: `Egy egyenlő szárú háromszög csúcsszöge 38°. Mekkora az alapon fekvő szög fokban?`,
        answer: 71,
        type: 'multiplication',
        expression: `(180 − 38)/2 = 71°`,
    },
    {
        stage: 1,
        question: `Egy derékszögű háromszög egyik hegyesszöge 27°. Mekkora a másik hegyesszöge fokban?`,
        answer: 63,
        type: 'multiplication',
        expression: `90 − 27 = 63°`,
    },
    {
        stage: 1,
        question: `Egy háromszög oldalai 6, 8 és 10 cm. Derékszögű-e?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `6² + 8² = 10²`,
    },
    {
        stage: 1,
        question: `Egy derékszögű háromszög befogói 9 cm és 12 cm. Határozd meg az átfogót cm-ben!`,
        answer: 15,
        type: 'multiplication',
        expression: `√(81+144) = 15`,
    },
    {
        stage: 1,
        question: `Egy derékszögű háromszög átfogója 13 cm, egyik befogója 5 cm. Határozd meg a másik befogót cm-ben!`,
        answer: 12,
        type: 'multiplication',
        expression: `√(169−25) = 12`,
    },
    {
        stage: 1,
        question: `Egy téglalap oldalai 7 cm és 11 cm. Határozd meg a területét cm²-ben!`,
        answer: 77,
        type: 'multiplication',
        expression: `K = 36, T = 77`,
    },
    {
        stage: 1,
        question: `Egy négyzet átlója 10√2 cm. Határozd meg a területét cm²-ben!`,
        answer: 100,
        type: 'multiplication',
        expression: `a = 10, T = 100`,
    },
    {
        stage: 1,
        question: `Egy paralelogramma két szomszédos oldala 8 cm és 13 cm. Határozd meg a kerületét cm-ben!`,
        answer: 42,
        type: 'multiplication',
        expression: `2(8+13) = 42`,
    },
    {
        stage: 1,
        question: `Egy rombusz átlói 10 cm és 24 cm. Határozd meg a területét cm²-ben!`,
        answer: 120,
        type: 'multiplication',
        expression: `d₁d₂/2 = 120`,
    },
    {
        stage: 1,
        question: `Egy trapéz párhuzamos oldalai 8 cm és 14 cm, magassága 5 cm. Határozd meg a területét cm²-ben!`,
        answer: 55,
        type: 'multiplication',
        expression: `(8+14)·5/2 = 55`,
    },
    {
        stage: 1,
        question: `Egy deltoid átlói 12 cm és 18 cm. Határozd meg a területét cm²-ben!`,
        answer: 108,
        type: 'multiplication',
        expression: `12·18/2 = 108`,
    },
    {
        stage: 1,
        question: `Egy szabályos háromszög oldala 8 cm. A magasság k√3 cm. Add meg k-t!`,
        answer: 4,
        type: 'multiplication',
        expression: `4√3`,
    },
    {
        stage: 1,
        question: `Egy szabályos háromszög oldala 10 cm. A terület k√3 cm². Add meg k-t!`,
        answer: 25,
        type: 'multiplication',
        expression: `25√3`,
    },
    {
        stage: 1,
        question: `Egy szabályos hatszög oldala 6 cm. Határozd meg a kerületét cm-ben!`,
        answer: 36,
        type: 'multiplication',
        expression: `6·6 = 36`,
    },
    {
        stage: 1,
        question: `Egy szabályos hatszög oldala 4 cm. A terület k√3 cm². Add meg k-t!`,
        answer: 24,
        type: 'multiplication',
        expression: `24√3`,
    },
    {
        stage: 1,
        question: `Egy 12 oldalú szabályos sokszög egy belső szögének nagyságát add meg fokban!`,
        answer: 150,
        type: 'multiplication',
        expression: `((12−2)·180)/12 = 150°`,
    },
    {
        stage: 1,
        question: `Egy 15 oldalú sokszög belső szögeinek összegét add meg fokban!`,
        answer: 2340,
        type: 'multiplication',
        expression: `(15−2)·180 = 2340°`,
    },
    {
        stage: 1,
        question: `Egy kör sugara 7 cm. A terület kπ cm². Add meg k-t!`,
        answer: 49,
        type: 'multiplication',
        expression: `K = 14π, T = 49π`,
    },
    {
        stage: 1,
        question: `Egy félkör átmérője 12 cm. A félkör területe kπ cm². Add meg k-t!`,
        answer: 18,
        type: 'multiplication',
        expression: `T = 18π, határ = 6π+12`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Két hasonló háromszög megfelelő oldalainak aránya 3 : 5. A kisebb háromszög egyik oldala 12 cm. Mekkora a megfelelő oldal a nagyobb háromszögben cm-ben?`,
        answer: 20,
        type: 'multiplication',
        expression: `12 · 5/3 = 20`,
    },
    {
        stage: 2,
        question: `Két hasonló háromszög hasonlósági aránya 2 : 3. Mekkora a területeik aránya?
Add meg a két tagot, pl. {4; 9}!`,
        answer: 2,
        expectedSet: ['4', '9'],
        type: 'multiplication',
        expression: `4 : 9`,
    },
    {
        stage: 2,
        question: `Két hasonló síkidom területének aránya 25 : 49. Mekkora a megfelelő hosszak aránya?
Add meg a két tagot, pl. {5; 7}!`,
        answer: 2,
        expectedSet: ['5', '7'],
        type: 'multiplication',
        expression: `5 : 7`,
    },
    {
        stage: 2,
        question: `Az ABC háromszögben DE ∥ BC, D ∈ AB, E ∈ AC. Ha AD = 4, DB = 6, AE = 5, határozd meg EC-t cm-ben!`,
        answer: 7.5,
        type: 'multiplication',
        expression: `EC = 15/2`,
    },
    {
        stage: 2,
        question: `Az ABC háromszögben DE ∥ BC. Ha AB = 15, AD = 9, BC = 20, határozd meg DE-t cm-ben!`,
        answer: 12,
        type: 'multiplication',
        expression: `DE = 20 · 9/15 = 12`,
    },
    {
        stage: 2,
        question: `Egy háromszög egyik oldala 18 cm. A hozzá hasonló háromszög megfelelő oldala 24 cm, területe 96 cm². Határozd meg az első háromszög területét cm²-ben!`,
        answer: 54,
        type: 'multiplication',
        expression: `96 · (18/24)² = 54`,
    },
    {
        stage: 2,
        question: `Egy derékszögű háromszög átfogója 25 cm, egyik befogója 15 cm. Határozd meg a másik befogót cm-ben!`,
        answer: 20,
        type: 'multiplication',
        expression: `másik befogó 20, magasság 12`,
    },
    {
        stage: 2,
        question: `Egy derékszögű háromszög befogói 9 cm és 12 cm. Határozd meg az átfogóra eső kisebb vetületet cm-ben!`,
        answer: 5.4,
        type: 'multiplication',
        expression: `5,4 cm és 9,6 cm`,
    },
    {
        stage: 2,
        question: `Egy kör átmérőjének két végpontja A és B, a kör egy további pontja C. Mekkora az ∠ACB fokban?`,
        answer: 90,
        type: 'multiplication',
        expression: `Thalész: 90°`,
    },
    {
        stage: 2,
        question: `Az ABC háromszögben az A-ból induló belső szögfelező a BC oldalt D-ben metszi. Ha AB = 8, AC = 12, BD = 6, határozd meg DC-t cm-ben!`,
        answer: 9,
        type: 'multiplication',
        expression: `DC/BD = 12/8 → DC = 9`,
    },
    {
        stage: 2,
        question: `Az ABC háromszögben az A csúcsból induló súlyvonal hossza 10 cm. Mekkora távolságra van a súlypont az A csúcstól cm-ben?

Add meg 3 tizedesjeggyel!`,
        answer: 6.667,
        type: 'multiplication',
        expression: `20/3 cm`,
    },
    {
        stage: 2,
        question: `Egy háromszög súlyvonala 15 cm hosszú. Add meg a súlypont által levágott két szakasz hosszát cm-ben!`,
        answer: 2,
        expectedSet: ['5', '10'],
        type: 'multiplication',
        expression: `10 cm és 5 cm`,
    },
    {
        stage: 2,
        question: `Az ABC háromszögben M a BC oldal felezőpontja. Egyenlő-e T_ABM és T_ACM?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Egyenlők (közös magasság, egyenlő alap)`,
    },
    {
        stage: 2,
        question: `Egy háromszög egyik oldalával párhuzamos szakasz a másik két oldalt 2 : 3 arányban osztja a csúcstól mérve. Mekkora a levágott kisebb háromszög és az eredeti területének aránya?
Add meg a két tagot, pl. {4; 25}!`,
        answer: 2,
        expectedSet: ['4', '25'],
        type: 'multiplication',
        expression: `4 : 25`,
    },
    {
        stage: 2,
        question: `Egy trapéz párhuzamos oldalai 10 cm és 18 cm. Átlóinak metszéspontja az egyik átlót milyen arányban osztja?
Add meg a két tagot, pl. {5; 9}!`,
        answer: 2,
        expectedSet: ['5', '9'],
        type: 'multiplication',
        expression: `5 : 9`,
    },
    {
        stage: 2,
        question: `Egy derékszögű háromszögben az átfogóhoz tartozó magasság 6 cm, az átfogó egyik vetülete 4 cm. Határozd meg a másik vetületet cm-ben!`,
        answer: 9,
        type: 'multiplication',
        expression: `m² = pq → 36 = 4q → q = 9`,
    },
    {
        stage: 2,
        question: `Egy derékszögű háromszög átfogóra eső vetületei 9 cm és 16 cm. Add meg a két befogót cm-ben!`,
        answer: 2,
        expectedSet: ['15', '20'],
        type: 'multiplication',
        expression: `15 cm és 20 cm`,
    },
    {
        stage: 2,
        question: `Egy 12 cm oldalú szabályos háromszögben az oldalak felezőpontjait összekötjük. A középső háromszög területe k√3 cm². Add meg k-t!`,
        answer: 9,
        type: 'multiplication',
        expression: `9√3`,
    },
    {
        stage: 2,
        question: `Egy 10 cm oldalú négyzetbe az oldalak felezőpontjainak összekötésével új négyzetet rajzolunk. Határozd meg az új négyzet területét cm²-ben!`,
        answer: 50,
        type: 'multiplication',
        expression: `50`,
    },
    {
        stage: 2,
        question: `Egy háromszög területe 84 cm². Egy csúcsból induló súlyvonal két háromszögre bontja. Mekkora e két háromszög egyike cm²-ben?`,
        answer: 42,
        type: 'multiplication',
        expression: `42 és 42`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Egy háromszög két oldala 8 cm és 11 cm, a közbezárt szög 60°. Határozd meg a harmadik oldalt cm-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 9.849,
        type: 'multiplication',
        expression: `√97`,
    },
    {
        stage: 3,
        question: `Egy háromszög két oldala 7 cm és 10 cm, a közbezárt szög 120°. Határozd meg a harmadik oldalt cm-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 14.799,
        type: 'multiplication',
        expression: `√219`,
    },
    {
        stage: 3,
        question: `Egy háromszög oldalai 5, 7 és 8 cm. Határozd meg a 8 cm-es oldallal szemközti szöget fokban!

Add meg 1 tizedesjeggyel!`,
        answer: 74.2,
        type: 'multiplication',
        expression: `cos γ = 19/70, γ ≈ 74,2°`,
    },
    {
        stage: 3,
        question: `Egy háromszögben a = 12, b = 9, α = 40°. Határozd meg β-t fokban szinusztétellel!

Add meg 1 tizedesjeggyel!`,
        answer: 28.8,
        type: 'multiplication',
        expression: `β ≈ 28,8°`,
    },
    {
        stage: 3,
        question: `Egy háromszögben a = 10, α = 30°, β = 45°. Határozd meg b-t cm-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 14.142,
        type: 'multiplication',
        expression: `10√2`,
    },
    {
        stage: 3,
        question: `Egy háromszög két oldala 14 cm és 18 cm, közbezárt szögük 35°. Határozd meg a területét cm²-ben!

Add meg 1 tizedesjeggyel!`,
        answer: 72.3,
        type: 'multiplication',
        expression: `126 sin 35° ≈ 72,3`,
    },
    {
        stage: 3,
        question: `Egy paralelogramma oldalai 9 cm és 13 cm, közbezárt szögük 50°. Határozd meg a területét cm²-ben!

Add meg 1 tizedesjeggyel!`,
        answer: 89.6,
        type: 'multiplication',
        expression: `117 sin 50° ≈ 89,6`,
    },
    {
        stage: 3,
        question: `Egy rombusz oldala 12 cm, egyik belső szöge 60°. A terület k√3 cm². Add meg k-t!`,
        answer: 72,
        type: 'multiplication',
        expression: `72√3`,
    },
    {
        stage: 3,
        question: `Egy egyenlő szárú háromszög szára 10 cm, csúcsszöge 40°. Határozd meg az alap hosszát cm-ben!

Add meg 2 tizedesjeggyel!`,
        answer: 6.84,
        type: 'multiplication',
        expression: `20 sin 20° ≈ 6,84`,
    },
    {
        stage: 3,
        question: `Egy egyenlő szárú háromszög alapja 12 cm, alapon fekvő szöge 55°. Határozd meg a szár hosszát cm-ben!

Add meg 2 tizedesjeggyel!`,
        answer: 10.46,
        type: 'multiplication',
        expression: `6 / cos 55° ≈ 10,46`,
    },
    {
        stage: 3,
        question: `Egy fa vízszintes talajon 8 m hosszú árnyékot vet. A napsugarak 35°-os szöget zárnak be a talajjal. Milyen magas a fa m-ben?

Add meg 2 tizedesjeggyel!`,
        answer: 5.6,
        type: 'multiplication',
        expression: `8 tan 35° ≈ 5,60`,
    },
    {
        stage: 3,
        question: `Egy torony tetejét egy pontból 28°-os emelkedési szög alatt látjuk. A pont 45 m-re van a torony talppontjától. Határozd meg a torony magasságát m-ben!

Add meg 2 tizedesjeggyel!`,
        answer: 23.93,
        type: 'multiplication',
        expression: `45 tan 28° ≈ 23,93`,
    },
    {
        stage: 3,
        question: `Egy 20 m magas világítótorony tetejéről egy hajót 12°-os depressziószög alatt látunk. Milyen messze van a hajó vízszintesen a toronytól m-ben?

Add meg 1 tizedesjeggyel!`,
        answer: 94.1,
        type: 'multiplication',
        expression: `20 / tan 12° ≈ 94,1`,
    },
    {
        stage: 3,
        question: `Két út 70°-os szöget zár be. Az elágazástól az egyik úton 5 km-re, a másikon 8 km-re van egy-egy település. Mekkora a két település távolsága km-ben?

Add meg 2 tizedesjeggyel!`,
        answer: 7.85,
        type: 'multiplication',
        expression: `√(25+64−80 cos 70°) ≈ 7,85`,
    },
    {
        stage: 3,
        question: `Egy háromszög oldalai 13, 14, 15 cm. Határozd meg a 14 és 15 cm-es oldalak által bezárt szöget fokban!

Add meg 2 tizedesjeggyel!`,
        answer: 53.13,
        type: 'multiplication',
        expression: `cos γ = 3/5, γ ≈ 53,13°`,
    },
    {
        stage: 3,
        question: `Egy háromszögben a = 8, b = 10, c = 12. A terület k√7 cm². Add meg k-t!`,
        answer: 15,
        type: 'multiplication',
        expression: `15√7`,
    },
    {
        stage: 3,
        question: `Egy szabályos tízszög köré írt kör sugara 6 cm. Határozd meg a tízszög oldalhosszát cm-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 3.708,
        type: 'multiplication',
        expression: `12 sin 18°`,
    },
    {
        stage: 3,
        question: `Egy szabályos nyolcszög köré írt kör sugara 5 cm. A terület k√2 cm². Add meg k-t!`,
        answer: 50,
        type: 'multiplication',
        expression: `50√2`,
    },
    {
        stage: 3,
        question: `Egy húrtrapéz alapjai 10 cm és 16 cm, szárai 5 cm. Határozd meg a területét cm²-ben!`,
        answer: 52,
        type: 'multiplication',
        expression: `m = 4, T = 52`,
    },
    {
        stage: 3,
        question: `Egy háromszög területe 30 cm², két oldala 10 cm és 8 cm. Mekkora lehet a közbezárt hegyesszög fokban?

Add meg 2 tizedesjeggyel!`,
        answer: 48.59,
        type: 'multiplication',
        expression: `sin γ = 3/4, γ ≈ 48,59° vagy 131,41°`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Egy kör sugara 10 cm. A 72°-os körcikk területe kπ cm². Add meg k-t!`,
        answer: 20,
        type: 'multiplication',
        expression: `ív = 4π, T = 20π`,
    },
    {
        stage: 4,
        question: `Egy 8 cm sugarú körben egy húrhoz 120°-os középponti szög tartozik. A húr hossza k√3 cm. Add meg k-t!`,
        answer: 8,
        type: 'multiplication',
        expression: `8√3`,
    },
    {
        stage: 4,
        question: `Egy kör sugara 13 cm, egy húr távolsága a középponttól 5 cm. Határozd meg a húr hosszát cm-ben!`,
        answer: 24,
        type: 'multiplication',
        expression: `2√(169−25) = 24`,
    },
    {
        stage: 4,
        question: `Egy körhöz külső P pontból két érintőt húzunk. Ha PA = 7 cm, mekkora PB cm-ben?`,
        answer: 7,
        type: 'multiplication',
        expression: `PA = PB = 7`,
    },
    {
        stage: 4,
        question: `Egy kör sugara 5 cm, a középpont és egy külső pont távolsága 13 cm. Határozd meg a külső pontból húzott érintőszakasz hosszát cm-ben!`,
        answer: 12,
        type: 'multiplication',
        expression: `√(169−25) = 12`,
    },
    {
        stage: 4,
        question: `Egy körben egy 100°-os középponti szöghöz tartozó ívet egy kerületi szög lát. Mekkora a kerületi szög fokban?`,
        answer: 50,
        type: 'multiplication',
        expression: `100/2 = 50°`,
    },
    {
        stage: 4,
        question: `Egy kerületi szög 37°. Mekkora az általa látott ívhez tartozó középponti szög fokban?`,
        answer: 74,
        type: 'multiplication',
        expression: `2 · 37 = 74°`,
    },
    {
        stage: 4,
        question: `Egy húrnégyszög egyik belső szöge 68°. Mekkora a szemközti szög fokban?`,
        answer: 112,
        type: 'multiplication',
        expression: `180 − 68 = 112°`,
    },
    {
        stage: 4,
        question: `Egy húrnégyszög három szöge 75°, 105°, 62°. Határozd meg a negyedik szöget fokban!`,
        answer: 118,
        type: 'multiplication',
        expression: `360 − 75 − 105 − 62 = 118°`,
    },
    {
        stage: 4,
        question: `Egy húrtrapéz egyik alapon fekvő szöge 48°. Határozd meg a száron fekvő (nagyobb) belső szöget fokban!`,
        answer: 132,
        type: 'multiplication',
        expression: `48°, 132°, 132°`,
    },
    {
        stage: 4,
        question: `Egy szabályos 12-szög köré írt kör sugara 10 cm. Határozd meg a sokszög oldalhosszát cm-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 5.176,
        type: 'multiplication',
        expression: `10√(2−√3)`,
    },
    {
        stage: 4,
        question: `Egy szabályos 12-szög beírt körének sugara 10 cm. Határozd meg a sokszög területét cm²-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 321.539,
        type: 'multiplication',
        expression: `1200(2−√3)`,
    },
    {
        stage: 4,
        question: `Egy szabályos nyolcszög oldala 4 cm. Határozd meg a területét cm²-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 77.255,
        type: 'multiplication',
        expression: `32(1+√2)`,
    },
    {
        stage: 4,
        question: `Egy szabályos hatszög rövidebb átlója 6√3 cm. Határozd meg az oldalát cm-ben!`,
        answer: 6,
        type: 'multiplication',
        expression: `a = 6, T = 54√3`,
    },
    {
        stage: 4,
        question: `Egy szabályos hatszög hosszabb átlója 14 cm. Határozd meg a kerületét cm-ben!`,
        answer: 42,
        type: 'multiplication',
        expression: `a = 7, K = 42`,
    },
    {
        stage: 4,
        question: `Egy körbe írt derékszögű háromszög átfogója 18 cm. Mekkora a kör sugara cm-ben?`,
        answer: 9,
        type: 'multiplication',
        expression: `R = c/2 = 9`,
    },
    {
        stage: 4,
        question: `Egy körbe írt szabályos háromszög oldala 6√3 cm. Határozd meg a kör sugarát cm-ben!`,
        answer: 6,
        type: 'multiplication',
        expression: `R = a / √3 = 6`,
    },
    {
        stage: 4,
        question: `Egy kör köré írt szabályos háromszög beírt körének sugara 4 cm. Az oldalhossz k√3 cm. Add meg k-t!`,
        answer: 8,
        type: 'multiplication',
        expression: `8√3`,
    },
    {
        stage: 4,
        question: `Egy húrnégyszög két szomszédos oldala 6 cm és 8 cm, közbezárt szöge 60°. Az ezek végpontjait összekötő átló k√13 cm. Add meg k-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `2√13`,
    },
    {
        stage: 4,
        question: `Egy 12 cm sugarú körben egy húr hossza 12 cm. Határozd meg a kisebb körszelethez tartozó középponti szöget fokban!`,
        answer: 60,
        type: 'multiplication',
        expression: `60°`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Egy trapéz párhuzamos oldalai 12 cm és 20 cm, átlóinak metszéspontja K. Milyen arányban osztja K az átlókat?
Add meg a két tagot, pl. {3; 5}!`,
        answer: 2,
        expectedSet: ['3', '5'],
        type: 'multiplication',
        expression: `3 : 5`,
    },
    {
        stage: 5,
        question: `Egy trapéz alapjai 9 cm és 15 cm, magassága 8 cm. Az átlók metszéspontján át az alapokkal párhuzamos egyenest húzunk. Határozd meg ennek a trapézba eső szakaszának hosszát cm-ben!`,
        answer: 11.25,
        type: 'multiplication',
        expression: `11,25`,
    },
    {
        stage: 5,
        question: `Egy háromszög oldalai 13, 14, 15 cm. Határozd meg a területét Heron-képlettel cm²-ben!`,
        answer: 84,
        type: 'multiplication',
        expression: `84`,
    },
    {
        stage: 5,
        question: `Egy háromszög oldalai 13, 14, 15 cm. Határozd meg a beírt kör sugarát cm-ben!`,
        answer: 4,
        type: 'multiplication',
        expression: `r = T/s = 84/21 = 4`,
    },
    {
        stage: 5,
        question: `Egy derékszögű háromszög befogói 9 cm és 12 cm. Határozd meg a beírt kör sugarát cm-ben!`,
        answer: 3,
        type: 'multiplication',
        expression: `r = 3, R = 7,5`,
    },
    {
        stage: 5,
        question: `Egy háromszög oldalai 10, 10 és 12 cm. Határozd meg a beírt kör sugarát cm-ben!`,
        answer: 3,
        type: 'multiplication',
        expression: `r = 3`,
    },
    {
        stage: 5,
        question: `Egy 10 cm oldalú négyzetbe egy kör van írva. A körbe pedig egy új négyzetet írunk. Határozd meg a belső négyzet területét cm²-ben!`,
        answer: 50,
        type: 'multiplication',
        expression: `50`,
    },
    {
        stage: 5,
        question: `Egy 12 cm oldalú szabályos háromszögbe kört írunk. A körbe szabályos hatszöget írunk. A hatszög területe k√3 cm². Add meg k-t!`,
        answer: 18,
        type: 'multiplication',
        expression: `18√3`,
    },
    {
        stage: 5,
        question: `Egy kör sugara 10 cm. Egy 120°-os körcikkbe az ív végpontjait összekötő húrt húzzuk. Határozd meg a körcikk és a hozzá tartozó egyenlő szárú háromszög területének különbségét cm²-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 61.418,
        type: 'multiplication',
        expression: `100π/3 − 25√3`,
    },
    {
        stage: 5,
        question: `Egy húrnégyszögben AB = 8, BC = 6, CD = 10, DA = 12. Ha ∠ABC = 60°, határozd meg AC-t cm-ben!

Add meg 3 tizedesjeggyel!`,
        answer: 7.211,
        type: 'multiplication',
        expression: `2√13`,
    },
    {
        stage: 5,
        question: `Egy húrnégyszögben ∠A = 72°. Határozd meg ∠C-t fokban!`,
        answer: 108,
        type: 'multiplication',
        expression: `C = 108°, D = 85° ha B = 95°`,
    },
    {
        stage: 5,
        question: `Egy körhöz egy külső pontból két érintőt húzunk. Az érintők hossza 12 cm, a középpont és a külső pont távolsága 13 cm. Határozd meg a kör sugarát cm-ben!`,
        answer: 5,
        type: 'multiplication',
        expression: `√(169−144) = 5`,
    },
    {
        stage: 5,
        question: `Egy 5 cm sugarú körhöz külső pontból érintőt húzunk. A külső pont és a középpont távolsága 10 cm. Add meg a keletkező derékszögű háromszög hegyesszögeit fokban!`,
        answer: 2,
        expectedSet: ['30', '60'],
        type: 'multiplication',
        expression: `60° és 30°`,
    },
    {
        stage: 5,
        question: `Egy háromszög két oldala 12 cm és 16 cm. Mekkora legyen a közbezárt szög fokban, hogy a terület maximális legyen?`,
        answer: 90,
        type: 'multiplication',
        expression: `90°, T_max = 96`,
    },
    {
        stage: 5,
        question: `Egy 10 cm oldalú szabályos háromszögbe olyan téglalapot írunk, amelynek egyik oldala a háromszög alapjára illeszkedik. A maximális terület k√3 / 2 cm². Add meg k-t!`,
        answer: 25,
        type: 'multiplication',
        expression: `25√3 / 2`,
    },
    {
        stage: 5,
        question: `Egy 12 cm oldalú négyzetbe olyan téglalapot írunk, amelynek oldalai párhuzamosak a négyzet átlóival. Határozd meg a maximális területét cm²-ben!`,
        answer: 72,
        type: 'multiplication',
        expression: `72`,
    },
    {
        stage: 5,
        question: `Egy 20 cm kerületű téglalap területét maximalizáljuk. Mennyi a maximális terület cm²-ben?`,
        answer: 25,
        type: 'multiplication',
        expression: `5×5, T = 25`,
    },
    {
        stage: 5,
        question: `Egy egyenlő szárú háromszög kerülete 30 cm, alapja 10 cm. A terület k√3 cm². Add meg k-t!`,
        answer: 25,
        type: 'multiplication',
        expression: `25√3`,
    },
    {
        stage: 5,
        question: `Egy R = 6 cm köré írt szabályos hatszög és a körbe írt szabályos hatszög területének különbsége k√3 cm². Add meg k-t!`,
        answer: 18,
        type: 'multiplication',
        expression: `18√3`,
    },
    {
        stage: 5,
        question: `Egy szabályos 12-szög köré írt kör sugara 10 cm. Határozd meg a sokszög területét cm²-ben!`,
        answer: 300,
        type: 'multiplication',
        expression: `300`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Bizonyítsd be: ha egy háromszög két magassága egyenlő hosszúságú, akkor a háromszög egyenlő szárú!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `ma = mb → a = b`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: egy derékszögű háromszögben az átfogóra bocsátott magasságra m² = pq!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: egy derékszögű háromszög befogóira a² = cp, b² = cq!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: egy húrnégyszög szemközti szögeinek összege 180°!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: ha egy négyszög szemközti szögeinek összege 180°, akkor húrnégyszög!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: a körhöz egy külső pontból húzott két érintőszakasz egyenlő hosszú!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `PA = PB`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: egy körben ugyanakkora húrokhoz ugyanakkora középponti szögek tartoznak!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: egy körben ugyanahhoz az ívhez tartozó kerületi szögek egyenlők!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Egy derékszögű háromszög oldalai számtani sorozat három egymást követő tagjai. Add meg az oldalak arányának három tagját!`,
        answer: 3,
        expectedSet: ['3', '4', '5'],
        type: 'multiplication',
        expression: `3 : 4 : 5`,
    },
    {
        stage: 6,
        question: `Egy háromszög oldalai a, a + 4, a + 8. A legnagyobb szög 120°. Add meg a három oldalt cm-ben!`,
        answer: 3,
        expectedSet: ['6', '10', '14'],
        type: 'multiplication',
        expression: `6, 10, 14`,
    },
    {
        stage: 6,
        question: `Egy szabályos háromszög oldalát a-val jelöljük. Add meg a R/r arányt!`,
        answer: 2,
        type: 'multiplication',
        expression: `R = 2r`,
    },
    {
        stage: 6,
        question: `Egy kör sugarát R-rel jelöljük. A körbe írt szabályos hatszög oldala hányszorosa R-nek?`,
        answer: 1,
        type: 'multiplication',
        expression: `a = R`,
    },
    {
        stage: 6,
        question: `Egy a oldalú négyzetbe az oldalak felezőpontjait összekötve újabb négyzetet rajzolunk, majd ezt végtelen sokszor ismételjük. A területek összege k·a². Add meg k-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `2a²`,
    },
    {
        stage: 6,
        question: `Egy a oldalú szabályos háromszög oldalfelező pontjait összekötve újabb szabályos háromszöget rajzolunk, majd ezt végtelen sokszor ismételjük. A kerületek összege k·a. Add meg k-t!`,
        answer: 6,
        type: 'multiplication',
        expression: `6a`,
    },
    {
        stage: 6,
        question: `Egy R sugarú körbe szabályos n-szöget írunk. Igaz-e, hogy az oldala aₙ = 2R sin(π/n)?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Egy R sugarú körbe szabályos n-szöget írunk. Igaz-e, hogy Tₙ = (n R² / 2) sin(2π/n)?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Egy 10 cm oldalú szabályos háromszögbe téglalapot írunk úgy, hogy egyik oldala a háromszög alapján fekszik. A maximális terület k√3 / 2 cm². Add meg k-t!`,
        answer: 25,
        type: 'multiplication',
        expression: `25√3 / 2`,
    },
    {
        stage: 6,
        question: `Egy körhöz külső P pontból érintőket húzunk A és B érintési pontokkal. Felezi-e OP az ∠APB szöget?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Egy derékszögű háromszög befogói a és b, átfogója c. Igaz-e, hogy r = (a + b − c)/2?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Egy a oldalú négyzetbe beírt körbe újabb négyzetet írunk, abba újabb kört, és ezt végtelen sokszor folytatjuk. Az összes négyzet területének összege k·a². Add meg k-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `2a²`,
    },
];
