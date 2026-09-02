import type { Question } from './types';

/**
 * Koordinátageometria — 6 szint × 20 feladat (Koordinátageometria.pdf).
 * 1 Pontok/vektorok → 2 Egyenesek → 3 Körök →
 * 4 Parabolák → 5 Paraméter/mértani hely → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getKoordinatageometriaPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Adott A(2; −1) és B(7; 3).
Határozd meg az AB vektor koordinátáit!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['5', '4'],
        type: 'multiplication',
        expression: `AB = (5; 4)`,
    },
    {
        stage: 1,
        question: `Határozd meg a v = (−6; 8) vektor hosszát!`,
        answer: 10,
        type: 'multiplication',
        expression: `|v| = √(36 + 64) = 10`,
    },
    {
        stage: 1,
        question: `Számítsd ki az A(−2; 4) és B(4; −4) pontok távolságát!`,
        answer: 10,
        type: 'multiplication',
        expression: `√(6² + (−8)²) = 10`,
    },
    {
        stage: 1,
        question: `Határozd meg az A(−3; 5) és B(7; −1) szakasz felezőpontját!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['2', '2'],
        type: 'multiplication',
        expression: `F(2; 2)`,
    },
    {
        stage: 1,
        question: `Az AB szakasz felezőpontja F(4; 5), továbbá A(1; 2).
Határozd meg B koordinátáit!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['7', '8'],
        type: 'multiplication',
        expression: `B(7; 8)`,
    },
    {
        stage: 1,
        question: `Adott u = (2; −3), v = (−5; 4).
Határozd meg u + v-t!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['-3', '1'],
        type: 'multiplication',
        expression: `(−3; 1)`,
    },
    {
        stage: 1,
        question: `Adott u = (2; −3), v = (−5; 4).
Határozd meg 3u − 2v-t!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['16', '-17'],
        type: 'multiplication',
        expression: `(16; −17)`,
    },
    {
        stage: 1,
        question: `Döntsd el skaláris szorzattal, hogy a
a = (3; 4), b = (−4; 3)
vektorok merőlegesek-e egymásra!

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `a · b = −12 + 12 = 0 → merőlegesek`,
    },
    {
        stage: 1,
        question: `Mekkora szöget zár be egymással az
a = (1; 0), b = (1; 1)
vektor?

Add meg a szöget fokban!`,
        answer: 45,
        type: 'multiplication',
        expression: `45°`,
    },
    {
        stage: 1,
        question: `Határozd meg az A(2; 3) és B(6; 11) pontokon átmenő egyenes meredekségét!`,
        answer: 2,
        type: 'multiplication',
        expression: `m = 8/4 = 2`,
    },
    {
        stage: 1,
        question: `Írd fel annak az egyenesnek az egyenletét, amely átmegy a P(1; −2) ponton, és meredeksége 3!

Add meg a y = 3x + b alak b értékét!`,
        answer: -5,
        type: 'multiplication',
        expression: `y = 3x − 5`,
    },
    {
        stage: 1,
        question: `Írd fel az A(−1; 2) és B(3; 10) pontokon átmenő egyenes egyenletét!

Add meg a y = 2x + b alak b értékét!`,
        answer: 4,
        type: 'multiplication',
        expression: `y = 2x + 4`,
    },
    {
        stage: 1,
        question: `Határozd meg a 2x + 3y = 12 egyenes koordinátatengelyekkel alkotott metszéspontjait!

Add meg az x-tengelymetszet x-koordinátáját!`,
        answer: 6,
        type: 'multiplication',
        expression: `P(6; 0), Q(0; 4)`,
    },
    {
        stage: 1,
        question: `Döntsd el, hogy a P(2; 1) pont illeszkedik-e az
x + 2y = 4
egyenesre!

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `2 + 2 = 4 → igen`,
    },
    {
        stage: 1,
        question: `Határozd meg a
y = 2x + 1, y = −x + 7
egyenesek metszéspontját!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['2', '5'],
        type: 'multiplication',
        expression: `(2; 5)`,
    },
    {
        stage: 1,
        question: `Tükrözd a P(3; −5) pontot az x tengelyre!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['3', '5'],
        type: 'multiplication',
        expression: `(3; 5)`,
    },
    {
        stage: 1,
        question: `Tükrözd a P(3; −5) pontot az y tengelyre!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['-3', '-5'],
        type: 'multiplication',
        expression: `(−3; −5)`,
    },
    {
        stage: 1,
        question: `Tükrözd a P(3; −5) pontot az origóra!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['-3', '5'],
        type: 'multiplication',
        expression: `(−3; 5)`,
    },
    {
        stage: 1,
        question: `Az A(0; 0), B(6; 0), C(0; 8) pontok egy háromszög csúcsai.
Határozd meg a háromszög kerületét!`,
        answer: 24,
        type: 'multiplication',
        expression: `6 + 8 + 10 = 24`,
    },
    {
        stage: 1,
        question: `Határozd meg az A(1; 1), B(7; 1), C(1; 5) háromszög területét!`,
        answer: 12,
        type: 'multiplication',
        expression: `(6 · 4)/2 = 12`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Írd fel az A(2; 5) és B(6; −3) pontokon átmenő egyenes egyenletét!

Add meg y értékét, ha x = 0 (a 2x + y = 9 alakban)!`,
        answer: 9,
        type: 'multiplication',
        expression: `2x + y = 9`,
    },
    {
        stage: 2,
        question: `Írd fel a P(4; 1) ponton átmenő, a 3x − 2y = 7 egyenessel párhuzamos egyenes egyenletét!

Add meg c-t a 3x − 2y = c alakban!`,
        answer: 10,
        type: 'multiplication',
        expression: `3x − 2y = 10`,
    },
    {
        stage: 2,
        question: `Írd fel a P(2; −1) ponton átmenő, a y = (1/2)x + 3 egyenesre merőleges egyenes egyenletét!

Add meg a y = −2x + b alak b értékét!`,
        answer: 3,
        type: 'multiplication',
        expression: `y = −2x + 3`,
    },
    {
        stage: 2,
        question: `Határozd meg a
2x + y = 7, x − y = 2
egyenesek metszéspontját!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['3', '1'],
        type: 'multiplication',
        expression: `(3; 1)`,
    },
    {
        stage: 2,
        question: `Írd fel az A(−2; 1), B(4; 5) szakasz felezőmerőlegesének egyenletét!

Add meg c-t a 3x + 2y = c alakban!`,
        answer: 9,
        type: 'multiplication',
        expression: `3x + 2y = 9`,
    },
    {
        stage: 2,
        question: `Számítsd ki a P(3; 4) pont távolságát a
3x + 4y − 5 = 0
egyenestől!`,
        answer: 4,
        type: 'multiplication',
        expression: `|9 + 16 − 5|/5 = 4`,
    },
    {
        stage: 2,
        question: `Mekkora szöget zár be egymással a
y = x, y = −x
egyenes?

Add meg a szöget fokban!`,
        answer: 90,
        type: 'multiplication',
        expression: `90°`,
    },
    {
        stage: 2,
        question: `Döntsd el, hogy az A(1; 2), B(3; 6), C(5; 10) pontok egy egyenesre illeszkednek-e!

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Meredekségek egyenlők → igen`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t úgy, hogy a P(p; 5) pont illeszkedjen a
2x − y = 3
egyenesre!`,
        answer: 4,
        type: 'multiplication',
        expression: `2p − 5 = 3 → p = 4`,
    },
    {
        stage: 2,
        question: `Az A(1; 1), B(5; 2), C(7; 6) pontok egy paralelogramma három egymást követő csúcsa.
Határozd meg a negyedik csúcs koordinátáit!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['3', '5'],
        type: 'multiplication',
        expression: `D = A + C − B = (3; 5)`,
    },
    {
        stage: 2,
        question: `Az A(0; 0), B(4; 0) pontok egy négyzet két szomszédos csúcsa.
Határozd meg a másik két csúcs összes lehetséges koordinátáit!

Add meg egy lehetséges harmadik csúcs y-koordinátáját (a pozitívat)!`,
        answer: 4,
        type: 'multiplication',
        expression: `(4; 4), (0; 4) vagy (4; −4), (0; −4)`,
    },
    {
        stage: 2,
        question: `Határozd meg az A(0; 0), B(6; 0), C(3; 9) háromszög súlypontját!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['3', '3'],
        type: 'multiplication',
        expression: `S(3; 3)`,
    },
    {
        stage: 2,
        question: `Írd fel az A(0; 0), B(6; 0), C(2; 4) háromszög A-ból induló súlyvonalának egyenletét!

Add meg a meredekséget!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `Felezőpont (4; 2) → y = (1/2)x`,
    },
    {
        stage: 2,
        question: `Határozd meg az A(1; 2), B(5; 2), C(3; 7) háromszög területét!`,
        answer: 10,
        type: 'multiplication',
        expression: `(4 · 5)/2 = 10`,
    },
    {
        stage: 2,
        question: `Határozd meg az A(0; 0), B(6; 0), C(0; 8) derékszögű háromszög magasságpontját!

Add meg az x-koordinátát!`,
        answer: 0,
        type: 'multiplication',
        expression: `H(0; 0)`,
    },
    {
        stage: 2,
        question: `Határozd meg az A(0; 0), B(6; 0), C(0; 8) háromszög körülírt körének középpontját!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['3', '4'],
        type: 'multiplication',
        expression: `K(3; 4)`,
    },
    {
        stage: 2,
        question: `Mekkora szöget zár be az x tengellyel a
y = √3 x + 1
egyenes?

Add meg a szöget fokban!`,
        answer: 60,
        type: 'multiplication',
        expression: `60°`,
    },
    {
        stage: 2,
        question: `Határozd meg a
3x + 4y = 5, 3x + 4y = 25
párhuzamos egyenesek távolságát!`,
        answer: 4,
        type: 'multiplication',
        expression: `|25 − 5|/5 = 4`,
    },
    {
        stage: 2,
        question: `Az x tengely P pontja egyenlő távol van az A(0; 2) és B(4; 4) pontoktól.
Határozd meg P x-koordinátáját!`,
        answer: 3.5,
        type: 'multiplication',
        expression: `P(7/2; 0)`,
    },
    {
        stage: 2,
        question: `Határozd meg az A(0; 0), B(4; 0), C(4; 3) háromszög B csúcsánál levő belső szöget!

Add meg a szöget fokban!`,
        answer: 90,
        type: 'multiplication',
        expression: `90°`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Írd fel a C(2; −3) középpontú, 5 sugarú kör egyenletét!

Add meg a sugarat!`,
        answer: 5,
        type: 'multiplication',
        expression: `(x − 2)² + (y + 3)² = 25`,
    },
    {
        stage: 3,
        question: `Határozd meg az
x² + y² − 6x + 4y − 12 = 0
kör középpontját és sugarát!

Add meg a sugarat!`,
        answer: 5,
        type: 'multiplication',
        expression: `C(3; −2), r = 5`,
    },
    {
        stage: 3,
        question: `Írd fel a C(−1; 4) középpontú, P(2; 8) ponton átmenő kör egyenletét!

Add meg a sugarat!`,
        answer: 5,
        type: 'multiplication',
        expression: `(x + 1)² + (y − 4)² = 25`,
    },
    {
        stage: 3,
        question: `Írd fel annak a körnek az egyenletét, amelynek átmérője az A(−2; 0), B(6; 0) szakasz!

Add meg a sugarat!`,
        answer: 4,
        type: 'multiplication',
        expression: `(x − 2)² + y² = 16`,
    },
    {
        stage: 3,
        question: `Határozd meg az
(x − 1)² + (y − 2)² = 13
kör x tengellyel közös pontjait!

Add meg az x-koordináták halmazát!`,
        answer: 2,
        expectedSet: ['-2', '4'],
        type: 'multiplication',
        expression: `(−2; 0), (4; 0)`,
    },
    {
        stage: 3,
        question: `Határozd meg az
(x − 1)² + (y − 2)² = 13
kör y tengellyel közös pontjait!

Add meg a nagyobb y-koordinátát 3 tizedesjegyre!`,
        answer: 5.464,
        type: 'multiplication',
        expression: `y = 2 ± 2√3; nagyobb ≈ 5,464`,
    },
    {
        stage: 3,
        question: `Döntsd el, hogy a P(5; 1) pont rajta van-e a
(x − 2)² + (y + 3)² = 25
körön!

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `9 + 16 = 25 → igen`,
    },
    {
        stage: 3,
        question: `Írd fel az x² + y² = 25 kör P(3; 4) pontjában húzott érintő egyenletét!

Add meg c-t a 3x + 4y = c alakban!`,
        answer: 25,
        type: 'multiplication',
        expression: `3x + 4y = 25`,
    },
    {
        stage: 3,
        question: `Írd fel a (x − 2)² + (y + 1)² = 25 kör P(5; 3) pontjában húzott érintő egyenletét!

Add meg c-t a 3x + 4y = c alakban!`,
        answer: 27,
        type: 'multiplication',
        expression: `3x + 4y = 27`,
    },
    {
        stage: 3,
        question: `Határozd meg az
x² + y² = 25, y = 3
egyenletek közös pontjait!

Add meg az x-koordináták halmazát!`,
        answer: 2,
        expectedSet: ['-4', '4'],
        type: 'multiplication',
        expression: `(−4; 3), (4; 3)`,
    },
    {
        stage: 3,
        question: `Határozd meg az
x² + y² = 18, y = x
egyenletek közös pontjait!

Add meg a pozitív x-koordinátát!`,
        answer: 3,
        type: 'multiplication',
        expression: `(−3; −3), (3; 3)`,
    },
    {
        stage: 3,
        question: `Írd fel az A(0; 0), B(6; 0), C(0; 8) pontokon átmenő kör egyenletét!

Add meg a sugarat!`,
        answer: 5,
        type: 'multiplication',
        expression: `(x − 3)² + (y − 4)² = 25`,
    },
    {
        stage: 3,
        question: `Egy kör középpontja az y tengelyen van, és áthalad az A(3; 1), B(5; 5) pontokon.

Add meg a középpont y-koordinátáját!`,
        answer: 5,
        type: 'multiplication',
        expression: `x² + (y − 5)² = 25`,
    },
    {
        stage: 3,
        question: `Egy kör középpontja az x tengelyen van, és áthalad az A(1; 4), B(5; 2) pontokon.

Add meg a középpont x-koordinátáját!`,
        answer: 1.5,
        type: 'multiplication',
        expression: `(x − 3/2)² + y² = 65/4`,
    },
    {
        stage: 3,
        question: `Határozd meg az
x² + y² = 25, (x − 4)² + y² = 9
körök közös húrjának egyenesét!

Add meg a húr x-koordinátáját!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4; pontok (4; ±3)`,
    },
    {
        stage: 3,
        question: `Döntsd el, hogy a 3x + 4y = 30 egyenesnek van-e közös pontja az
x² + y² = 25
körrel!

Add meg a közös pontok számát!`,
        answer: 0,
        type: 'multiplication',
        expression: `Távolság 6 > 5 → nincs közös pont`,
    },
    {
        stage: 3,
        question: `Igazold, hogy a 3x + 4y = 25 egyenes érinti az x² + y² = 25 kört, és add meg az érintési pontot!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['3', '4'],
        type: 'multiplication',
        expression: `(3; 4)`,
    },
    {
        stage: 3,
        question: `Hány egész koordinátájú pont található az
x² + y² = 25
körön?`,
        answer: 12,
        type: 'multiplication',
        expression: `(±3; ±4), (±4; ±3), (0; ±5), (±5; 0) → 12`,
    },
    {
        stage: 3,
        question: `Írd fel annak a 3 sugarú körnek az egyenletét, amely az első síknegyedben érinti mindkét koordinátatengelyt!

Add meg a középpont x-koordinátáját!`,
        answer: 3,
        type: 'multiplication',
        expression: `(x − 3)² + (y − 3)² = 9`,
    },
    {
        stage: 3,
        question: `Írd fel a C(4; 3) középpontú, az x tengelyt érintő kör egyenletét!

Add meg a sugarat!`,
        answer: 3,
        type: 'multiplication',
        expression: `(x − 4)² + (y − 3)² = 9`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Határozd meg az x² = 8y parabola fókuszpontját!

Add meg a fókusz y-koordinátáját!`,
        answer: 2,
        type: 'multiplication',
        expression: `F(0; 2), vezéregyenes y = −2`,
    },
    {
        stage: 4,
        question: `Határozd meg a
y = (x − 2)²/8 + 1
parabola fókuszpontját!

Add meg a fókusz y-koordinátáját!`,
        answer: 3,
        type: 'multiplication',
        expression: `T(2; 1), F(2; 3)`,
    },
    {
        stage: 4,
        question: `Határozd meg a
y = x² − 4x + 3
parabola tengelypontját!

Add meg a tengelypont y-koordinátáját!`,
        answer: -1,
        type: 'multiplication',
        expression: `T(2; −1), tengely x = 2`,
    },
    {
        stage: 4,
        question: `Határozd meg m-et úgy, hogy a y = mx − 1 egyenes érintse a y = x² parabolát!

Add meg a pozitív m-et!`,
        answer: 2,
        type: 'multiplication',
        expression: `m = ±2`,
    },
    {
        stage: 4,
        question: `Határozd meg b-t úgy, hogy a y = 2x + b egyenes érintse a y = x² parabolát!`,
        answer: -1,
        type: 'multiplication',
        expression: `b = −1, érintési pont (1; 1)`,
    },
    {
        stage: 4,
        question: `Határozd meg a y = x², y = 2x + 3 görbék közös pontjait!

Add meg a nagyobb x-koordinátát!`,
        answer: 3,
        type: 'multiplication',
        expression: `(−1; 1), (3; 9)`,
    },
    {
        stage: 4,
        question: `Egy parabola zérushelyei −2 és 4, továbbá áthalad a P(0; 8) ponton.

Add meg a parabola y-tengelymetszetét!`,
        answer: 8,
        type: 'multiplication',
        expression: `y = −x² + 2x + 8`,
    },
    {
        stage: 4,
        question: `Írd fel az x² + y² = 25 kör P(3; 4) pontjában húzott érintőjét, majd határozd meg annak meredekségét!`,
        answer: -0.75,
        type: 'multiplication',
        expression: `3x + 4y = 25, m = −3/4`,
    },
    {
        stage: 4,
        question: `A P(13; 0) pontból érintőket húzunk az x² + y² = 25 körhöz.
Határozd meg az érintési pontokat!

Add meg az érintési pontok közös x-koordinátáját 3 tizedesjegyre!`,
        answer: 1.923,
        type: 'multiplication',
        expression: `x = 25/13 ≈ 1,923`,
    },
    {
        stage: 4,
        question: `Az x² + y² = 25 kör egyik húrjának felezőpontja M(3; 0).
Add meg a húr egyik végpontjának y-koordinátáját (a pozitívat)!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 3; végpontok (3; ±4)`,
    },
    {
        stage: 4,
        question: `Az x² + y² = 25 kört a y = 3 egyenes metszi.
Határozd meg a keletkező húr hosszát!`,
        answer: 8,
        type: 'multiplication',
        expression: `Végpontok (±4; 3), hossz 8`,
    },
    {
        stage: 4,
        question: `Mely b értékek esetén érinti a y = 2x + b egyenes a
(x − 2)² + (y + 1)² = 25
kört?

Add meg a nagyobb b-t 3 tizedesjegyre!`,
        answer: 6.180,
        type: 'multiplication',
        expression: `b = −5 + 5√5 ≈ 6,180`,
    },
    {
        stage: 4,
        question: `Határozd meg m-et úgy, hogy az y = mx egyenesnek ne legyen közös pontja a
(x − 2)² + (y − 3)² = 4
körrel!

Add meg a nyílt felső határt 3 tizedesjegyre!`,
        answer: 0.417,
        type: 'multiplication',
        expression: `m < 5/12 ≈ 0,417`,
    },
    {
        stage: 4,
        question: `Határozd meg m-et úgy, hogy az y = mx egyenes érintse a
(x − 2)² + (y − 3)² = 4
kört!`,
        answer: 0.417,
        type: 'multiplication',
        expression: `m = 5/12 ≈ 0,417`,
    },
    {
        stage: 4,
        question: `Határozd meg az A(0; 0), B(6; 0), C(2; 4) háromszög körülírt körének sugarát 3 tizedesjegyre!`,
        answer: 3.162,
        type: 'multiplication',
        expression: `(x − 3)² + (y − 1)² = 10, r = √10 ≈ 3,162`,
    },
    {
        stage: 4,
        question: `Határozd meg az A(0; 0), B(6; 0), C(2; 4) háromszög magasságpontját!

Add meg a koordinátákat {x; y} alakban!`,
        answer: 2,
        expectedSet: ['2', '2'],
        type: 'multiplication',
        expression: `H(2; 2)`,
    },
    {
        stage: 4,
        question: `Határozd meg azoknak a pontoknak a mértani helyét, amelyek egyenlő távol vannak az A(−2; 0) és B(4; 0) pontoktól!

Add meg a felezőmerőleges x-koordinátáját!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 4,
        question: `Határozd meg azoknak a P pontoknak a mértani helyét, amelyekre PA = 2 PB, ahol A(0; 0), B(3; 0)!

Add meg a kör sugarát!`,
        answer: 2,
        type: 'multiplication',
        expression: `(x − 4)² + y² = 4`,
    },
    {
        stage: 4,
        question: `Egy negatív meredekségű egyenes áthalad a P(3; 8) ponton, és a pozitív tengelyekből háromszöget metsz ki.
Add meg a minimális területet!`,
        answer: 48,
        type: 'multiplication',
        expression: `y = −(8/3)x + 16, T_min = 48`,
    },
    {
        stage: 4,
        question: `Adottak az A(1; 2), B(2; 3), C(4; 5) pontok.
Határozd meg azt az m értéket, amelyre az y = mx egyeneshez mért függőleges távolságok négyzetösszege minimális!`,
        answer: 1.333,
        type: 'multiplication',
        expression: `m = 4/3 ≈ 1,333`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Az A(4; 0), B(0; 0), C(p; 6) pontok háromszöget határoznak meg.
Határozd meg p-t úgy, hogy a B csúcsnál levő belső szög 60° legyen!

Add meg p-t 3 tizedesjegyre!`,
        answer: 3.464,
        type: 'multiplication',
        expression: `p = 2√3 ≈ 3,464`,
    },
    {
        stage: 5,
        question: `Vizsgáld az m paraméter függvényében az y = mx egyenes és a
(x − 2)² + (y − 3)² = 4
kör kölcsönös helyzetét!

Hány közös pont van, ha m = 0?`,
        answer: 0,
        type: 'multiplication',
        expression: `m < 5/12: 0 közös pont`,
    },
    {
        stage: 5,
        question: `Határozd meg azt az m értéket, amelyre az y = mx egyenes érinti a
(x − 2)² + (y − 3)² = 4
kört!`,
        answer: 0.417,
        type: 'multiplication',
        expression: `m = 5/12 ≈ 0,417`,
    },
    {
        stage: 5,
        question: `Határozd meg az összes b értéket úgy, hogy a y = (3/4)x + b egyenes érintse az
x² + y² = 25
kört!

Add meg a pozitív b-t!`,
        answer: 6.25,
        type: 'multiplication',
        expression: `b = ±25/4 = ±6,25`,
    },
    {
        stage: 5,
        question: `Egy kör középpontja az y tengelyen van, és áthalad az A(5; 2), B(1; 6) pontokon.

Add meg a középpont y-koordinátáját!`,
        answer: 1,
        type: 'multiplication',
        expression: `x² + (y − 1)² = 26`,
    },
    {
        stage: 5,
        question: `Egy 13 sugarú kör átmegy a P(5; 12) ponton, középpontja az y tengelyen van.

Add meg a nagyobb középpont y-koordinátáját!`,
        answer: 24,
        type: 'multiplication',
        expression: `x² + y² = 169 vagy x² + (y − 24)² = 169`,
    },
    {
        stage: 5,
        question: `Adott P(−3; 0), Q(5; 0), R(0; 4), és H a PQ szakasz tetszőleges pontja.
Hol maximális a PH · RH skaláris szorzat?

Add meg a maximumhely x-koordinátáját!`,
        answer: 5,
        type: 'multiplication',
        expression: `Maximum: H(5; 0)`,
    },
    {
        stage: 5,
        question: `A P(13; 0) pontból érintőket húzunk az x² + y² = 25 körhöz.

Add meg a pozitív meredekségű érintő meredekségét 3 tizedesjegyre!`,
        answer: 0.417,
        type: 'multiplication',
        expression: `m = ±5/12 ≈ ±0,417`,
    },
    {
        stage: 5,
        question: `Az x² + y² = 25 kör egyik húrjának felezőpontja M(1; 2).
Add meg a húr egyik végpontjának x-koordinátáját (a nagyobbat)!`,
        answer: 5,
        type: 'multiplication',
        expression: `x + 2y = 5; végpontok (5; 0), (−3; 4)`,
    },
    {
        stage: 5,
        question: `Vizsgáld a p paraméter függvényében a y = px + 6 egyenes és az
x² + y² = 25
kör közös pontjainak számát!

Add meg a |p| határértéket 3 tizedesjegyre, ahol pontosan egy közös pont van!`,
        answer: 0.663,
        type: 'multiplication',
        expression: `|p| = √11 / 5 ≈ 0,663`,
    },
    {
        stage: 5,
        question: `Adott a körök családja:
x² + y² − 2px + 4y + p² − 5 = 0.
Határozd meg a körök középpontjainak mértani helyét!

Add meg a középpontok y-koordinátáját!`,
        answer: -2,
        type: 'multiplication',
        expression: `Középpontok: (p; −2) → y = −2`,
    },
    {
        stage: 5,
        question: `Az A(a; 0) és B(0; b) pontokra a ≥ 0, b ≥ 0, a + b = 6.
Határozd meg az AB szakasz felezőpontjának mértani helyét!

Add meg c-t az x + y = c egyenletben!`,
        answer: 3,
        type: 'multiplication',
        expression: `x + y = 3, x ≥ 0, y ≥ 0`,
    },
    {
        stage: 5,
        question: `Az A(2; 0) pont rögzített, a B pont az x² + y² = 36 körön mozog.
Határozd meg az AB felezőpont mértani helyének sugarát!`,
        answer: 3,
        type: 'multiplication',
        expression: `(x − 1)² + y² = 9`,
    },
    {
        stage: 5,
        question: `A P pont az y = x + 1 egyenesen mozog.
Határozd meg azt a P-t, amely egyenlő távol van az A(0; 0) és B(4; 2) pontoktól!

Add meg P x-koordinátáját 3 tizedesjegyre!`,
        answer: 1.333,
        type: 'multiplication',
        expression: `P(4/3; 7/3)`,
    },
    {
        stage: 5,
        question: `Egy kör érinti az x tengelyt, középpontja az x + y = 6 egyenesen van, és áthalad a P(2; 2) ponton.

Add meg a kisebb sugarat!`,
        answer: 2,
        type: 'multiplication',
        expression: `(x − 4)² + (y − 2)² = 4 vagy (x + 4)² + (y − 10)² = 100`,
    },
    {
        stage: 5,
        question: `Az A(0; 0), B(6; 0), C(p; p) háromszög területe 12.
Határozd meg p-t!

Add meg a pozitív p-t!`,
        answer: 4,
        type: 'multiplication',
        expression: `T = |6p|/2 = 12 → p = ±4`,
    },
    {
        stage: 5,
        question: `Az A(0; 0), B(8; 0), C(0; 6) háromszög C csúcsán átmenő egyenes felezi a háromszög területét.

Add meg c-t a 3x + 2y = c alakban!`,
        answer: 12,
        type: 'multiplication',
        expression: `3x + 2y = 12`,
    },
    {
        stage: 5,
        question: `A P(p; 4) pont rajta van az x² + y² = 25 körön.
Határozd meg p-t!

Add meg a pozitív p-t!`,
        answer: 3,
        type: 'multiplication',
        expression: `p = ±3`,
    },
    {
        stage: 5,
        question: `Határozd meg az m értékeit úgy, hogy a y = mx − 4 egyenes érintse a y = x² parabolát!

Add meg a pozitív m-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `m = ±4`,
    },
    {
        stage: 5,
        question: `Hány egész koordinátájú pont található a
(x − 2)² + (y + 1)² = 25
körön?`,
        answer: 12,
        type: 'multiplication',
        expression: `12 rácspont`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Egy negatív meredekségű egyenes áthalad a P(3; 8) ponton, és a pozitív tengelyekből háromszöget metsz ki.
Add meg a minimális területet!`,
        answer: 48,
        type: 'multiplication',
        expression: `y = −(8/3)x + 16, T_min = 48`,
    },
    {
        stage: 6,
        question: `Adott a (x − 2)² + (y − 3)² = 4 kör és az y = mx egyenescsalád.
Hány közös pont van, ha m = 5/12?`,
        answer: 1,
        type: 'multiplication',
        expression: `m = 5/12: érintő, 1 közös pont`,
    },
    {
        stage: 6,
        question: `A P(13; 0) pontból érintőket húzunk az x² + y² = 25 körhöz.

Add meg a pozitív meredekségű érintő meredekségét 3 tizedesjegyre!`,
        answer: 0.417,
        type: 'multiplication',
        expression: `m = 5/12 ≈ 0,417`,
    },
    {
        stage: 6,
        question: `Adott az A(0; 0), B(6; 0), C(2; 4) háromszög.
Írd fel a körülírt kör C pontjában húzott érintőjét!

Add meg c-t az x − 3y + c = 0 alakban!`,
        answer: 10,
        type: 'multiplication',
        expression: `x − 3y + 10 = 0`,
    },
    {
        stage: 6,
        question: `Egy kör áthalad a P(2; 2) ponton, érinti az x tengelyt, és középpontja az x + y = 6 egyenesen van.

Add meg a kisebb sugarat!`,
        answer: 2,
        type: 'multiplication',
        expression: `r = 2 vagy r = 10`,
    },
    {
        stage: 6,
        question: `Határozd meg azoknak a pontoknak a mértani helyét, amelyekre PA = 2 PB, ahol A(0; 0), B(3; 0)!

Add meg a kör sugarát!`,
        answer: 2,
        type: 'multiplication',
        expression: `(x − 4)² + y² = 4`,
    },
    {
        stage: 6,
        question: `Határozd meg azoknak a pontoknak a mértani helyét, amelyek egyenlő távol vannak az y = 0 és y = x egyenesektől!

Add meg a pozitív meredekségű szögfelező meredekségét 3 tizedesjegyre!`,
        answer: 0.414,
        type: 'multiplication',
        expression: `m = √2 − 1 ≈ 0,414`,
    },
    {
        stage: 6,
        question: `Egy négyzet középpontja K(5; 5), oldala 2√13.
Egyik csúcsa az y tengelyen, szomszédos csúcsa az x tengelyen van.

Add meg az y tengelyen levő csúcs egyik lehetséges y-koordinátáját (a kisebb pozitívat)!`,
        answer: 4,
        type: 'multiplication',
        expression: `(0; 4), (6; 0) vagy (0; 6), (4; 0)`,
    },
    {
        stage: 6,
        question: `Határozd meg az A(−4; 0), B(4; 0), C(0; 6) háromszög körülírt körének sugarát 3 tizedesjegyre!`,
        answer: 4.333,
        type: 'multiplication',
        expression: `K(0; 5/3), r = 13/3 ≈ 4,333`,
    },
    {
        stage: 6,
        question: `Az x² + y² = 25 kör y = 3 és y = −4 húrjainak végpontjai húrtrapézt határoznak meg.
Határozd meg a trapéz magasságát!`,
        answer: 7,
        type: 'multiplication',
        expression: `Magasság: 3 − (−4) = 7`,
    },
    {
        stage: 6,
        question: `Igazold, hogy a y = x − 1 egyenes érinti a y = x²/4 parabolát és az
(x − 3)² + y² = 2
kört is!

Add meg a közös érintési pont koordinátáit {x; y} alakban!`,
        answer: 2,
        expectedSet: ['2', '1'],
        type: 'multiplication',
        expression: `Q(2; 1)`,
    },
    {
        stage: 6,
        question: `Határozd meg m-et úgy, hogy a y = mx − 1 egyenes érintse a y = x²/4 parabolát!

Add meg a pozitív m-et!`,
        answer: 1,
        type: 'multiplication',
        expression: `m = ±1`,
    },
    {
        stage: 6,
        question: `Adottak az A(1; 3), B(2; 2), C(4; 6) pontok.
Határozd meg azt az m értéket, amelyre az y = mx egyeneshez tartozó függőleges eltérések négyzetösszege minimális!`,
        answer: 1.476,
        type: 'multiplication',
        expression: `m = 31/21 ≈ 1,476`,
    },
    {
        stage: 6,
        question: `Adott P(−3; 0), Q(5; 0), R(0; 4), és H a PQ szakasz pontja.
Hol minimális a PH · RH skaláris szorzat?

Add meg a minimumhely x-koordinátáját!`,
        answer: -1.5,
        type: 'multiplication',
        expression: `Minimum: H(−3/2; 0)`,
    },
    {
        stage: 6,
        question: `Hány egész koordinátájú pont található az
x² + y² = 65
körön?`,
        answer: 16,
        type: 'multiplication',
        expression: `(±1; ±8), (±8; ±1), (±4; ±7), (±7; ±4) → 16`,
    },
    {
        stage: 6,
        question: `A P(5; 0) pontból érintőket húzunk az x² + y² = 9 körhöz.

Add meg a pozitív meredekségű érintő meredekségét!`,
        answer: 0.75,
        type: 'multiplication',
        expression: `m = ±3/4`,
    },
    {
        stage: 6,
        question: `Egy kör áthalad az A(4; 10), B(8; 2) pontokon, középpontja az y tengelyen van.

Add meg a középpont y-koordinátáját!`,
        answer: 3,
        type: 'multiplication',
        expression: `x² + (y − 3)² = 65`,
    },
    {
        stage: 6,
        question: `Határozd meg az
x² + y² = 25, (x − 4)² + y² = 9
körök közös húrjának egyenletét!

Add meg a húr x-koordinátáját!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 6,
        question: `Az A(4; 0), B(0; 0), C(p; 6) háromszög B csúcsánál levő belső szöge 60°.
Határozd meg p-t 3 tizedesjegyre!`,
        answer: 3.464,
        type: 'multiplication',
        expression: `p = 2√3 ≈ 3,464`,
    },
    {
        stage: 6,
        question: `Egy ABCD négyzet A csúcsa az y tengelyen, szomszédos B csúcsa az x tengelyen van.
A középpont mindig az y = x vagy az y = −x egyenesen van.

Add meg 1-et, ha ez igaz!`,
        answer: 1,
        type: 'multiplication',
        expression: `Középpont: y = x vagy y = −x`,
    },
];
