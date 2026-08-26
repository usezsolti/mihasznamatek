import type { Question } from './types';

/**
 * Bizonyítások — 6 szint × 20 feladat (MIHASZNAMATEK hat szintű rendszer).
 * 1 Alapok → 2 Módszerek → 3 Önálló rutin → 4 Összetett → 5 Emelt → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getProofPracticeQuestions = (): Question[] => [
    {
        stage: 1,
        question: `Igazold numerikusan!

(a + b)² − (a − b)² = 4ab

Ha a = 5 és b = 3, mennyi a bal oldal?`,
        answer: 60,
        type: 'multiplication',
        expression: `4ab = 4·5·3 = 60`,
    },
    {
        stage: 1,
        question: `Igazold!

a² − b² = (a − b)(a + b)

Ha a = 7 és b = 2, mennyi az érték?`,
        answer: 45,
        type: 'multiplication',
        expression: `49 − 4 = 45`,
    },
    {
        stage: 1,
        question: `Egy derékszögű háromszög befogói 6 cm és 8 cm.

Határozd meg az átfogót!`,
        answer: 10,
        type: 'multiplication',
        expression: `√(36+64) = 10`,
    },
    {
        stage: 1,
        question: `Számtani sorozat: a₁ = 3, d = 4.

Mennyi a tizedik tag?`,
        answer: 39,
        type: 'multiplication',
        expression: `a₁₀ = 3 + 9·4 = 39`,
    },
    {
        stage: 1,
        question: `Szabályos dobókockával egyszer dobunk.

Mennyi a páros dobás valószínűsége?`,
        answer: 0.5,
        type: 'multiplication',
        expression: `3/6 = 1/2`,
    },
    {
        stage: 1,
        question: `Öt ember közül kettőt választunk.

Hány különböző kiválasztás lehetséges?`,
        answer: 10,
        type: 'multiplication',
        expression: `C(5,2) = 10`,
    },
    {
        stage: 1,
        question: `n³ − n osztható 6-tal. Ellenőrzés: n = 4.

Mennyi (n³ − n) / 6?`,
        answer: 10,
        type: 'multiplication',
        expression: `64 − 4 = 60, 60/6 = 10`,
    },
    {
        stage: 1,
        question: `Páratlan szám négyzete 8-cal osztva 1 maradékot ad.

5² = 25. Mennyi 25 mod 8?`,
        answer: 1,
        type: 'multiplication',
        expression: `24 + 1`,
    },
    {
        stage: 1,
        question: `1 + 3 + 5 + 7 + 9 = n².

Mennyi az összeg?`,
        answer: 25,
        type: 'multiplication',
        expression: `5² = 25`,
    },
    {
        stage: 1,
        question: `1 + 2 + … + 10 = n(n+1)/2.

Mennyi az összeg?`,
        answer: 55,
        type: 'multiplication',
        expression: `10·11/2 = 55`,
    },
    {
        stage: 1,
        question: `C(n,0) + … + C(n,n) = 2ⁿ.

n = 4 esetén a jobb oldal mennyi?`,
        answer: 16,
        type: 'multiplication',
        expression: `2⁴ = 16`,
    },
    {
        stage: 1,
        question: `Pitagorasz: 3, 4, 5.

Mennyi a háromszög területe?`,
        answer: 6,
        type: 'multiplication',
        expression: `3·4/2 = 6`,
    },
    {
        stage: 1,
        question: `AM-GM: √(ab) ≤ (a+b)/2.

Ha a = 4 és b = 9, mennyi a mértani közép?`,
        answer: 6,
        type: 'multiplication',
        expression: `√36 = 6`,
    },
    {
        stage: 1,
        question: `Ha a = 4 és b = 9, mennyi a számtani közép?`,
        answer: 6.5,
        type: 'multiplication',
        expression: `(4+9)/2 = 6,5`,
    },
    {
        stage: 1,
        question: `2ⁿ értéke n = 5 esetén?`,
        answer: 32,
        type: 'multiplication',
        expression: `2⁵ = 32`,
    },
    {
        stage: 1,
        question: `Három egymást követő egész szorzata: 3·4·5.

Mennyi a szorzat?`,
        answer: 60,
        type: 'multiplication',
        expression: `60`,
    },
    {
        stage: 1,
        question: `n páratlan: n = 9. Mennyi n² mod 8?`,
        answer: 1,
        type: 'multiplication',
        expression: `81 = 10·8 + 1`,
    },
    {
        stage: 1,
        question: `Hány prímszám van 10-nél nem nagyobb?`,
        answer: 4,
        type: 'multiplication',
        expression: `2, 3, 5, 7`,
    },
    {
        stage: 1,
        question: `Egyenlő oldalú háromszög oldala 2.

(a+b−c)(a−b+c)(−a+b+c) = ?`,
        answer: 8,
        type: 'multiplication',
        expression: `2·2·2 = 8`,
    },
    {
        stage: 1,
        question: `C(6,1) = ?`,
        answer: 6,
        type: 'multiplication',
        expression: `6`,
    },
    {
        stage: 2,
        question: `Bizonyítsd: pozitív a, b esetén a/b + b/a ≥ 2.

Add meg a minimumot!`,
        answer: 2,
        type: 'multiplication',
        expression: `egyenlőség ⇔ a = b`,
    },
    {
        stage: 2,
        question: `Mikor áll fenn egyenlőség a/b + b/a ≥ 2 esetén?

Add meg az a/b arányt!`,
        answer: 1,
        type: 'multiplication',
        expression: `a = b`,
    },
    {
        stage: 2,
        question: `|2x − 5| = x + 1 megoldásai közül a nagyobbikat add meg!`,
        answer: 6,
        type: 'multiplication',
        expression: `2x−5 = x+1 → x = 6`,
    },
    {
        stage: 2,
        question: `√(3x − 2) = x.

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 1 vagy x = 2`,
    },
    {
        stage: 2,
        question: `2^{x+1} = 16.

Add meg x-et!`,
        answer: 3,
        type: 'multiplication',
        expression: `2^{x+1} = 2⁴ → x = 3`,
    },
    {
        stage: 2,
        question: `x⁴ − 5x² + 4 = 0.

Add meg a legnagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `x² = 4 vagy 1 → x = ±2, ±1`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₄ = 11, a₉ = 26.

Mennyi d?`,
        answer: 3,
        type: 'multiplication',
        expression: `5d = 15 → d = 3`,
    },
    {
        stage: 2,
        question: `Ugyanennél a sorozatnál mennyi a₁?`,
        answer: 2,
        type: 'multiplication',
        expression: `a₁ + 3d = 11 → a₁ = 2`,
    },
    {
        stage: 2,
        question: `Két kockával a dobott számok összege legalább 10.

Hány kedvező kimenetel van (36-ból)?`,
        answer: 6,
        type: 'multiplication',
        expression: `(4,6)(5,5)(5,6)(6,4)(6,5)(6,6)`,
    },
    {
        stage: 2,
        question: `Két oldal 7 és 10, közbezárt szög 60°.

A harmadik oldal koszinusztétellel: c² = 49+100−70. Mennyi c²?`,
        answer: 79,
        type: 'multiplication',
        expression: `c² = 149 − 70 = 79`,
    },
    {
        stage: 2,
        question: `n = 6. Mennyi (n³ − n)/6?`,
        answer: 35,
        type: 'multiplication',
        expression: `216−6 = 210, 210/6 = 35`,
    },
    {
        stage: 2,
        question: `15² = 225. Mennyi 225 mod 8?`,
        answer: 1,
        type: 'multiplication',
        expression: `28·8 = 224`,
    },
    {
        stage: 2,
        question: `Páros n esetén (n² + 2) mod 4 mennyi?`,
        answer: 2,
        type: 'multiplication',
        expression: `(2k)² + 2 ≡ 2 (mod 4)`,
    },
    {
        stage: 2,
        question: `Páratlan n esetén (n² + 2) mod 4 mennyi?`,
        answer: 3,
        type: 'multiplication',
        expression: `1 + 2 ≡ 3 (mod 4)`,
    },
    {
        stage: 2,
        question: `1 + 3 + … + (2·8 − 1) = ?`,
        answer: 64,
        type: 'multiplication',
        expression: `8² = 64`,
    },
    {
        stage: 2,
        question: `(5³ − 1)/4 = ?`,
        answer: 31,
        type: 'multiplication',
        expression: `124/4 = 31`,
    },
    {
        stage: 2,
        question: `1² + 2² + … + 5² = ?`,
        answer: 55,
        type: 'multiplication',
        expression: `5·6·11/6 = 55`,
    },
    {
        stage: 2,
        question: `C(7,2) = ?`,
        answer: 21,
        type: 'multiplication',
        expression: `21`,
    },
    {
        stage: 2,
        question: `Ha hₐ = hᵦ, akkor a/b = ?`,
        answer: 1,
        type: 'multiplication',
        expression: `T = a hₐ/2 = b hᵦ/2`,
    },
    {
        stage: 2,
        question: `Húrnégyszög szemközti szögeinek összege (fok)?`,
        answer: 180,
        type: 'multiplication',
        expression: `karakterizáció`,
    },
    {
        stage: 3,
        question: `Igazold: (a+b)⁴ − (a−b)⁴ = 8ab(a²+b²).

a = 2, b = 1 esetén mennyi mindkét oldal?`,
        answer: 80,
        type: 'multiplication',
        expression: `81 − 1 = 80`,
    },
    {
        stage: 3,
        question: `x⁴ − 4x³ + 8x² − 8x + 4 = (x² − 2x + 2)² ≥ 0.

Hány valós x-re van egyenlőség?`,
        answer: 0,
        type: 'multiplication',
        expression: `D = 4−8 < 0`,
    },
    {
        stage: 3,
        question: `√(x+5) + √(x−4) = 3.

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `|x − 2| + |x + 3| = 7.

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = −4 vagy x = 3`,
    },
    {
        stage: 3,
        question: `|x² − 5x + 4| = 2.

Add meg a legnagyobb megoldást 3 tizedesjeggyel!`,
        answer: 4.562,
        type: 'multiplication',
        expression: `(5+√17)/2 ≈ 4,562`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₂ = 6, a₅ = 162.

Mennyi q?`,
        answer: 3,
        type: 'multiplication',
        expression: `q³ = 27 → q = 3`,
    },
    {
        stage: 3,
        question: `Ugyanennél mennyi a₁?`,
        answer: 2,
        type: 'multiplication',
        expression: `a₁ q = 6 → a₁ = 2`,
    },
    {
        stage: 3,
        question: `Téglalap kerülete 40 cm.

Mennyi a maximális terület?`,
        answer: 100,
        type: 'multiplication',
        expression: `négyzet 10×10`,
    },
    {
        stage: 3,
        question: `Négy különböző könyv véletlen sorrendben.

Két kijelölt egymás mellett: kedvező / 24. Add meg a valószínűséget 3 tizedesjeggyel!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `2·3! / 4! = 1/2`,
    },
    {
        stage: 3,
        question: `1² + … + 10² = n(n+1)(2n+1)/6.

Mennyi az összeg?`,
        answer: 385,
        type: 'multiplication',
        expression: `10·11·21/6 = 385`,
    },
    {
        stage: 3,
        question: `(5⁴ − 1)/4 = ?`,
        answer: 156,
        type: 'multiplication',
        expression: `625−1 = 624`,
    },
    {
        stage: 3,
        question: `n = 6. 1+3+…+(2n−1) = ?`,
        answer: 36,
        type: 'multiplication',
        expression: `36`,
    },
    {
        stage: 3,
        question: `C(n,0)+…+C(n,n), n = 6. Mennyi?`,
        answer: 64,
        type: 'multiplication',
        expression: `2⁶ = 64`,
    },
    {
        stage: 3,
        question: `Pozitív a,b,c: (a+b+c)(1/a+1/b+1/c) ≥ ?`,
        answer: 9,
        type: 'multiplication',
        expression: `AM-HM`,
    },
    {
        stage: 3,
        question: `aₙ = (2n+3)/(3n+4). Mennyi lim aₙ, 3 tizedesjegy?`,
        answer: 0.667,
        type: 'multiplication',
        expression: `2/3`,
    },
    {
        stage: 3,
        question: `Ugyanennek a sorozatnak a₁ értéke 3 tizedesjeggyel?`,
        answer: 0.714,
        type: 'multiplication',
        expression: `5/7`,
    },
    {
        stage: 3,
        question: `x² − (2p+3)x + p² + 3p + 1 = 0.

A diszkrimináns (konstans) mennyi?`,
        answer: 5,
        type: 'multiplication',
        expression: `D = 5`,
    },
    {
        stage: 3,
        question: `31 tanuló, 12 hónap. Legalább hányan születtek ugyanabban a hónapban?`,
        answer: 3,
        type: 'multiplication',
        expression: `⌈31/12⌉ = 3`,
    },
    {
        stage: 3,
        question: `Létezhet-e gráf pontosan 1 páratlan fokú csúccsal? (1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `kézfogási lemma`,
    },
    {
        stage: 3,
        question: `n(n+1)(n+2)/3, n = 4. Mennyi 1·2+2·3+3·4+4·5?`,
        answer: 40,
        type: 'multiplication',
        expression: `40`,
    },
    {
        stage: 4,
        question: `Jegyár 3000 Ft, 400 eladott jegy. x darab 200 Ft-os áremelés.

A jegyár x = 5 esetén mennyi?`,
        answer: 4000,
        type: 'multiplication',
        expression: `3000 + 1000`,
    },
    {
        stage: 4,
        question: `Ugyanez: eladott jegyek száma x = 5 esetén?`,
        answer: 300,
        type: 'multiplication',
        expression: `400 − 100`,
    },
    {
        stage: 4,
        question: `Bevétel B(x) = (3000+200x)(400−20x).

A maximum x = 2,5-nél van. Mennyi ekkor a jegyár?`,
        answer: 3500,
        type: 'multiplication',
        expression: `3000 + 500`,
    },
    {
        stage: 4,
        question: `20 cm-es négyzet sarkából x = 4 cm-es négyzetet vágunk.

Mennyi a megmaradó terület?`,
        answer: 384,
        type: 'multiplication',
        expression: `400 − 16`,
    },
    {
        stage: 4,
        question: `aₙ = (3n+1)/(4n+2).

Mennyi a határérték?`,
        answer: 0.75,
        type: 'multiplication',
        expression: `3/4`,
    },
    {
        stage: 4,
        question: `Ugyanennek a₁ értéke 3 tizedesjeggyel?`,
        answer: 0.667,
        type: 'multiplication',
        expression: `4/6 = 2/3`,
    },
    {
        stage: 4,
        question: `Sₙ = 1·2 + … + n(n+1) = n(n+1)(n+2)/3.

n = 6 esetén mennyi Sₙ?`,
        answer: 112,
        type: 'multiplication',
        expression: `6·7·8/3 = 112`,
    },
    {
        stage: 4,
        question: `Két kocka él p = 1 és q = 2. Összeolvasztás előtt a felszínek összege?`,
        answer: 30,
        type: 'multiplication',
        expression: `6(1+4) = 30`,
    },
    {
        stage: 4,
        question: `52941 számjegyeinek összes sorrendje (az eredetivel együtt). Hány ötjegyű szám?`,
        answer: 120,
        type: 'multiplication',
        expression: `5! = 120`,
    },
    {
        stage: 4,
        question: `Derékszögű háromszög oldalai számtani sorozat, legrövidebb 4.

Mennyi a középső oldal?`,
        answer: 5,
        type: 'multiplication',
        expression: `4, 5, 6 — 16+25=36`,
    },
    {
        stage: 4,
        question: `Ugyanennek az átfogója?`,
        answer: 6,
        type: 'multiplication',
        expression: `6`,
    },
    {
        stage: 4,
        question: `Kocka és gömb felszíne egyenlő. A gömb térfogata nagyobb-e? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `izoperimetrikus`,
    },
    {
        stage: 4,
        question: `C(8,3) = ?`,
        answer: 56,
        type: 'multiplication',
        expression: `56`,
    },
    {
        stage: 4,
        question: `1-től 8-ig három szám, az összeg páros. Hány ilyen választás van?`,
        answer: 28,
        type: 'multiplication',
        expression: `C(4,3)+C(4,2)C(4,1) = 4+24`,
    },
    {
        stage: 4,
        question: `Ekkor a páros összeg valószínűsége?`,
        answer: 0.5,
        type: 'multiplication',
        expression: `28/56`,
    },
    {
        stage: 4,
        question: `n = 9. 1+3+…+(2n−1) = ?`,
        answer: 81,
        type: 'multiplication',
        expression: `81`,
    },
    {
        stage: 4,
        question: `Háromszög 5, 12, 13. Terület?`,
        answer: 30,
        type: 'multiplication',
        expression: `30`,
    },
    {
        stage: 4,
        question: `n = 7. (n³ − n)/6 = ?`,
        answer: 56,
        type: 'multiplication',
        expression: `336/6`,
    },
    {
        stage: 4,
        question: `2⁸ = ?`,
        answer: 256,
        type: 'multiplication',
        expression: `256`,
    },
    {
        stage: 4,
        question: `Téglalap kerület 40, oldalak 12 és 8. Terület?`,
        answer: 96,
        type: 'multiplication',
        expression: `96 (max 100)`,
    },
    {
        stage: 5,
        question: `x² − (2p+1)x + p = 0. D = 4p² + 1.

D minimuma mennyi?`,
        answer: 1,
        type: 'multiplication',
        expression: `4p²+1 ≥ 1`,
    },
    {
        stage: 5,
        question: `Ugyanez: hány valós p-re van két különböző valós gyök? (1 = minden p, 0 = nem minden)`,
        answer: 1,
        type: 'multiplication',
        expression: `D > 0 mindig`,
    },
    {
        stage: 5,
        question: `1+3+…+(2n−1) = n². n = 15 esetén a jobb oldal?`,
        answer: 225,
        type: 'multiplication',
        expression: `225`,
    },
    {
        stage: 5,
        question: `f(x) = x³ − 6x² + 9x + 2. Lokális maximum értéke (x = 1)?`,
        answer: 6,
        type: 'multiplication',
        expression: `f(1) = 6`,
    },
    {
        stage: 5,
        question: `Ugyanennek lokális minimuma (x = 3)?`,
        answer: 2,
        type: 'multiplication',
        expression: `f(3) = 2`,
    },
    {
        stage: 5,
        question: `f′(x) = 3(x−1)(x−3). A kisebb stacionárius hely?`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 5,
        question: `C(8,3) = ?`,
        answer: 56,
        type: 'multiplication',
        expression: `56`,
    },
    {
        stage: 5,
        question: `1,…,8 közül 3 szám, páros összeg. Hány eset?`,
        answer: 28,
        type: 'multiplication',
        expression: `28`,
    },
    {
        stage: 5,
        question: `P(összeg páros) = ?`,
        answer: 0.5,
        type: 'multiplication',
        expression: `1/2`,
    },
    {
        stage: 5,
        question: `(a+b+c)(1/a+1/b+1/c) ≥ 9. Egyenlőségnél a/b = ?`,
        answer: 1,
        type: 'multiplication',
        expression: `a = b = c`,
    },
    {
        stage: 5,
        question: `n = 8. 1²+…+n² = ?`,
        answer: 204,
        type: 'multiplication',
        expression: `8·9·17/6 = 204`,
    },
    {
        stage: 5,
        question: `Sₙ = n(n+1)(n+2)/3, n = 8. Mennyi?`,
        answer: 240,
        type: 'multiplication',
        expression: `8·9·10/3 = 240`,
    },
    {
        stage: 5,
        question: `5ⁿ − 1 osztható 4-gyel. n = 5: (3125−1)/4 = ?`,
        answer: 781,
        type: 'multiplication',
        expression: `3124/4`,
    },
    {
        stage: 5,
        question: `n⁴ + 6n − 1 osztható 9-cel. n = 2: (16+12−1)/9 = ?`,
        answer: 3,
        type: 'multiplication',
        expression: `27/9`,
    },
    {
        stage: 5,
        question: `n⁴ + 6n − 1 osztható-e 8-cal? (1 = igen minden n-re, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `n=1: 6, nem`,
    },
    {
        stage: 5,
        question: `Kocka él 1, gömb felszíne 6. r² = 6/(4π). A gömb térfogata nagyobb a kockáénál? (1/0)`,
        answer: 1,
        type: 'multiplication',
        expression: `igen`,
    },
    {
        stage: 5,
        question: `Ramsey: 6 pont 2-színezésénél van egyszínű háromszög. Az alsó korlát n ≥ ?`,
        answer: 6,
        type: 'multiplication',
        expression: `R(3,3)=6`,
    },
    {
        stage: 5,
        question: `Binomiális: n = 9, 2ⁿ = ?`,
        answer: 512,
        type: 'multiplication',
        expression: `512`,
    },
    {
        stage: 5,
        question: `Skatulya: 50 tanuló, 12 hónap. Legalább hányan ugyanabban a hónapban?`,
        answer: 5,
        type: 'multiplication',
        expression: `⌈50/12⌉ = 5`,
    },
    {
        stage: 5,
        question: `D = (2p+3)² − 4(p²+3p+1). Értéke?`,
        answer: 5,
        type: 'multiplication',
        expression: `5`,
    },
    {
        stage: 6,
        question: `|x² − 4x + 3| = p. p = 1 esetén hány különböző valós megoldás van?`,
        answer: 3,
        type: 'multiplication',
        expression: `csúcs 1, két külső`,
    },
    {
        stage: 6,
        question: `Ugyanez p = 2 esetén hány megoldás?`,
        answer: 2,
        type: 'multiplication',
        expression: `p > 1`,
    },
    {
        stage: 6,
        question: `Ugyanez 0 < p < 1 esetén hány megoldás?`,
        answer: 4,
        type: 'multiplication',
        expression: `W-alak`,
    },
    {
        stage: 6,
        question: `Ugyanez p < 0 esetén hány megoldás?`,
        answer: 0,
        type: 'multiplication',
        expression: `absz ≥ 0`,
    },
    {
        stage: 6,
        question: `Ugyanez p = 0 esetén hány megoldás?`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 1 és x = 3`,
    },
    {
        stage: 6,
        question: `| (x−1)(x−3) | maximuma [1,3]-on?`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 2: |−1| = 1`,
    },
    {
        stage: 6,
        question: `Sₙ = 1·2 + … + n(n+1). S₄ = ?`,
        answer: 40,
        type: 'multiplication',
        expression: `40`,
    },
    {
        stage: 6,
        question: `A sejtés: Sₙ = n(n+1)(n+2)/3. n = 10-re mennyi?`,
        answer: 440,
        type: 'multiplication',
        expression: `10·11·12/3 = 440`,
    },
    {
        stage: 6,
        question: `10 cm sugarú körbe írt téglalap maximális területe?`,
        answer: 200,
        type: 'multiplication',
        expression: `négyzet, átló 20, T = 200`,
    },
    {
        stage: 6,
        question: `C(n,0)+…+C(n,n) = 2ⁿ. n = 10. Mennyi?`,
        answer: 1024,
        type: 'multiplication',
        expression: `1024`,
    },
    {
        stage: 6,
        question: `Egyenlő szárú háromszög megfordítása igaz-e? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `alaptétel megfordítható`,
    },
    {
        stage: 6,
        question: `Páratlan fokú csúcsok száma gráfban páros. 3 páratlan fokú csúcs lehetséges? (1/0)`,
        answer: 0,
        type: 'multiplication',
        expression: `nem`,
    },
    {
        stage: 6,
        question: `n ≥ ? kell ahhoz, hogy 2-színezett teljes gráfban legyen egyszínű háromszög?`,
        answer: 6,
        type: 'multiplication',
        expression: `R(3,3)`,
    },
    {
        stage: 6,
        question: `(a+b+c)(1/a+1/b+1/c), a=b=c=2. Érték?`,
        answer: 9,
        type: 'multiplication',
        expression: `6 · 1,5 = 9`,
    },
    {
        stage: 6,
        question: `Két kocka összeolvasztása: p=q=1. Az új él ³√2. Az új felszín 6·2^{2/3}. 2^{2/3} ≈ ? 3 tizedesjegy.`,
        answer: 1.587,
        type: 'multiplication',
        expression: `2^{2/3}`,
    },
    {
        stage: 6,
        question: `n = 12. 1+3+…+(2n−1) = ?`,
        answer: 144,
        type: 'multiplication',
        expression: `144`,
    },
    {
        stage: 6,
        question: `f(x) = |x²−4x+3| − p. p = 1-nél a gyökök száma?`,
        answer: 3,
        type: 'multiplication',
        expression: `mint fent`,
    },
    {
        stage: 6,
        question: `C(10,2) = ?`,
        answer: 45,
        type: 'multiplication',
        expression: `45`,
    },
    {
        stage: 6,
        question: `√3 irracionális. Igaz-e, hogy √3 racionális? (1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `indirekt`,
    },
    {
        stage: 6,
        question: `Pozitív a,b,c AM-HM minimuma (a+b+c)(1/a+1/b+1/c) = ?`,
        answer: 9,
        type: 'multiplication',
        expression: `9`,
    },
];
