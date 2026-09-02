import type { Question } from './types';

/**
 * Bizonyítások — 6×20 (Bizonyítások.pdf / TeX).
 * 1 Direkt → 2 Megfordítás / ellenpélda / indirekt → 3 Algebra / számelmélet →
 * 4 Indukció / sorozatok → 5 Geometria / kombinatorika / gráf → 6 Mesterfok.
 * Egy kártya = egy szám vagy halmaz. Igaz/hamis: 1 / 0.
 * Azonosság: adott helyen kiértékelt szám.
 */
export const getProofPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Bizonyítsd be, hogy két egymást követő egész összege páratlan.
n = 6 esetén mennyi n + (n + 1)?`,
        answer: 13,
        type: 'multiplication',
        expression: `2n + 1 = 13`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy két egymást követő egész szorzata páros.
n = 6 esetén mennyi n(n + 1)?`,
        answer: 42,
        type: 'multiplication',
        expression: `6 · 7 = 42`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy három egymást követő egész összege osztható 3-mal.
n = 5 esetén mennyi az összeg osztva 3-mal?`,
        answer: 6,
        type: 'multiplication',
        expression: `5 + 6 + 7 = 18`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy három egymást követő egész szorzata osztható 6-tal.
n = 4 esetén mennyi n(n + 1)(n + 2) / 6?`,
        answer: 20,
        type: 'multiplication',
        expression: `4 · 5 · 6 / 6 = 20`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy n² + n páros.
n = 7 esetén mennyi (n² + n) / 2?`,
        answer: 28,
        type: 'multiplication',
        expression: `n(n + 1) / 2 = 28`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy n³ − n osztható 6-tal.
n = 5 esetén mennyi (n³ − n) / 6?`,
        answer: 20,
        type: 'multiplication',
        expression: `120 / 6 = 20`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy páratlan egész négyzete páratlan.
Mennyi 9²?`,
        answer: 81,
        type: 'multiplication',
        expression: `(2k + 1)² páratlan`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy páros egész négyzete osztható 4-gyel.
Mennyi 10² / 4?`,
        answer: 25,
        type: 'multiplication',
        expression: `(2k)² = 4k²`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy két páratlan egész összege páros.
Mennyi 7 + 11?`,
        answer: 18,
        type: 'multiplication',
        expression: `2(k + m + 1)`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be, hogy két páratlan egész szorzata páratlan.
Mennyi 7 · 11?`,
        answer: 77,
        type: 'multiplication',
        expression: `4km + 2k + 2m + 1`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: (a + b)² + (a − b)² = 2(a² + b²).
a = 5, b = 3 esetén mennyi a bal oldal?`,
        answer: 68,
        type: 'multiplication',
        expression: `64 + 4 = 68`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: (a + b)² − (a − b)² = 4ab.
a = 5, b = 3 esetén mennyi a bal oldal?`,
        answer: 60,
        type: 'multiplication',
        expression: `4 · 5 · 3 = 60`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: a³ − b³ = (a − b)(a² + ab + b²).
a = 5, b = 2 esetén mennyi a³ − b³?`,
        answer: 117,
        type: 'multiplication',
        expression: `125 − 8 = 117`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: a³ + b³ = (a + b)(a² − ab + b²).
a = 3, b = 2 esetén mennyi a³ + b³?`,
        answer: 35,
        type: 'multiplication',
        expression: `27 + 8 = 35`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: ha a | b és a | c, akkor a | (b + c).
a = 4, b = 8, c = 12 esetén mennyi (b + c) / a?`,
        answer: 5,
        type: 'multiplication',
        expression: `20 / 4 = 5`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: ha a | b, akkor a | kb.
a = 5, b = 15, k = 3 esetén mennyi kb / a?`,
        answer: 9,
        type: 'multiplication',
        expression: `45 / 5 = 9`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: ha a | b és b | c, akkor a | c.
a = 3, b = 6, c = 18 esetén mennyi c / a?`,
        answer: 6,
        type: 'multiplication',
        expression: `18 / 3 = 6`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: (a + b)/2 ≥ √(ab) (a, b > 0).
a = 9, b = 4 esetén mennyi a számtani közép?`,
        answer: 6.5,
        type: 'multiplication',
        expression: `AM = 6,5 ≥ GM = 6`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: x² + 1 ≥ 2x.
x = 5 esetén mennyi (x − 1)²?`,
        answer: 16,
        type: 'multiplication',
        expression: `(x − 1)² ≥ 0`,
    },
    {
        stage: 1,
        question: `Bizonyítsd be: x² + y² ≥ 2xy.
x = 4, y = 1 esetén mennyi (x − y)²?`,
        answer: 9,
        type: 'multiplication',
        expression: `(x − y)² ≥ 0`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `„Ha egy egész osztható 12-vel, akkor osztható 6-tal.”
A megfordítás hamis. Adj ellenpéldát: melyik szám osztható 6-tal, de nem 12-vel?`,
        answer: 6,
        type: 'multiplication',
        expression: `6 | 6, de 12 ∤ 6`,
    },
    {
        stage: 2,
        question: `„Ha egy négyszög négyzet, akkor téglalap.”
Igaz-e a megfordítás?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hamis (nem négyzet téglalap)`,
    },
    {
        stage: 2,
        question: `„Ha egy háromszög szabályos, akkor egyenlő szárú.”
Igaz-e a megfordítás?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hamis`,
    },
    {
        stage: 2,
        question: `Adj ellenpéldát: „Ha a² | b², akkor a² | b.”
a = 2 esetén mennyi b?`,
        answer: 2,
        type: 'multiplication',
        expression: `4 | 4, de 4 ∤ 2`,
    },
    {
        stage: 2,
        question: `Adj ellenpéldát: „Ha ab páros, akkor a és b is páros.”
Add meg a páratlan tényezőt a kulcsbeli példában!`,
        answer: 3,
        type: 'multiplication',
        expression: `a = 2, b = 3`,
    },
    {
        stage: 2,
        question: `Adj ellenpéldát: „Ha x² > y², akkor x > y.”
Add meg az x értékét a kulcsbeli példában!`,
        answer: -3,
        type: 'multiplication',
        expression: `x = −3, y = 2`,
    },
    {
        stage: 2,
        question: `Bizonyítsd indirekt módon, hogy √2 irracionális.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 2,
        question: `Bizonyítsd indirekt módon, hogy nincs legnagyobb prímszám.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 2,
        question: `Bizonyítsd: ha n² páros, akkor n páros.
n = 7 esetén mennyi n² mod 2?`,
        answer: 1,
        type: 'multiplication',
        expression: `49 páratlan`,
    },
    {
        stage: 2,
        question: `Bizonyítsd: ha n² osztható 3-mal, akkor n is.
n = 4 esetén mennyi n² mod 3?`,
        answer: 1,
        type: 'multiplication',
        expression: `16 ≡ 1 (mod 3)`,
    },
    {
        stage: 2,
        question: `Bizonyítsd: ha egy háromszög két magassága egyenlő, akkor egyenlő szárú.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `T = am_a/2 = bm_b/2`,
    },
    {
        stage: 2,
        question: `Bizonyítsd: nincs olyan egész, amely egyszerre páros és páratlan.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 2,
        question: `Bizonyítsd: két különböző páratlan prím összege páros összetett.
Mennyi 3 + 5?`,
        answer: 8,
        type: 'multiplication',
        expression: `> 2 és páros`,
    },
    {
        stage: 2,
        question: `„Ha egy egész osztható 18-cal, akkor számjegyeinek összege osztható 9-cel.”
A megfordítás hamis. Adj ellenpéldát!`,
        answer: 9,
        type: 'multiplication',
        expression: `9 osztható 9-cel, de nem 18-cal`,
    },
    {
        stage: 2,
        question: `„Ha egy négyszög rombusz, akkor átlói merőlegesek.”
Igaz-e a megfordítás?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hamis (pl. nem rombusz deltoid)`,
    },
    {
        stage: 2,
        question: `Ha a, b > 0 és a + b = 10, akkor nem lehet a > 5 és b > 5.
Ha a = 6, mennyi a maximális b?`,
        answer: 4,
        type: 'multiplication',
        expression: `a + b = 10`,
    },
    {
        stage: 2,
        question: `Két egymást követő pozitív négyzetszám különbsége.
k = 5 esetén mennyi (k + 1)² − k²?`,
        answer: 11,
        type: 'multiplication',
        expression: `2k + 1 = 11`,
    },
    {
        stage: 2,
        question: `„Ha két háromszögnek két-két oldala egyenlő, akkor egybevágók.”
Igaz-e az állítás?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hamis (SSA nem elég)`,
    },
    {
        stage: 2,
        question: `„Ha két függvénynek ugyanaz a zérushelye, akkor azonosak.”
f(x) = x és g(x) = x³ közös zérushelye?`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 2,
        question: `Ha n nem osztható 2-vel és 3-mal, akkor n² ≡ 1 (mod 6).
n = 5 esetén mennyi n² mod 6?`,
        answer: 1,
        type: 'multiplication',
        expression: `25 ≡ 1 (mod 6)`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Bizonyítsd: n⁵ − n osztható 30-cal.
n = 4 esetén mennyi (n⁵ − n) / 30?`,
        answer: 34,
        type: 'multiplication',
        expression: `1020 / 30 = 34`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: páratlan n-re n² ≡ 1 (mod 8).
n = 7 esetén mennyi n² mod 8?`,
        answer: 1,
        type: 'multiplication',
        expression: `49 ≡ 1 (mod 8)`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: p > 3 prímre p² − 1 osztható 24-gyel.
p = 7 esetén mennyi (p² − 1) / 24?`,
        answer: 2,
        type: 'multiplication',
        expression: `48 / 24 = 2`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: négyzetszám 4-gyel osztva 0 vagy 1 maradékot ad.
Mennyi 7² mod 4?`,
        answer: 1,
        type: 'multiplication',
        expression: `49 ≡ 1 (mod 4)`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: négyzetszám nem végződhet 2, 3, 7, 8-ra.
Mennyi 13² utolsó számjegye?`,
        answer: 9,
        type: 'multiplication',
        expression: `169`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: lnko(a, b) = 1 ⇒ lnko(a, a + b) = 1.
a = 8, b = 15 esetén mennyi lnko(8, 23)?`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: két egymást követő pozitív egész relatív prím.
Mennyi lnko(14, 15)?`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: lnko(n, n + 2) csak 1 vagy 2 lehet.
n = 8 esetén mennyi lnko(8, 10)?`,
        answer: 2,
        type: 'multiplication',
        expression: `2`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: ha a | b és b | a pozitív egészekre, akkor a = b.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `kℓ = 1`,
    },
    {
        stage: 3,
        question: `Bizonyítsd Eukleidész lemmáját: p prím, p | ab ⇒ p | a vagy p | b.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: lnko(a, b) = 1 és a | bc ⇒ a | c.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Bézout`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: a² + b² ≥ 2ab (a, b > 0).
a = 3, b = 5 esetén mennyi (a − b)²?`,
        answer: 4,
        type: 'multiplication',
        expression: `4`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: a/b + b/a ≥ 2 (a, b > 0).
a = 4, b = 1 esetén mennyi a/b + b/a?`,
        answer: 4.25,
        type: 'multiplication',
        expression: `4 + 1/4 = 4,25`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: x + 1/x ≥ 2 (x > 0).
x = 4 esetén mennyi x + 1/x?`,
        answer: 4.25,
        type: 'multiplication',
        expression: `4,25`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: (a + b + c)² ≥ 3(ab + bc + ca).
a = 1, b = 2, c = 3 esetén mennyi a különbség?`,
        answer: 3,
        type: 'multiplication',
        expression: `36 − 33 = 3`,
    },
    {
        stage: 3,
        question: `Ha a, b, c háromszög oldalai, akkor a² + b² + 2ab − c² > 0.
a = 3, b = 4, c = 5 esetén mennyi a bal oldal?`,
        answer: 24,
        type: 'multiplication',
        expression: `(a + b)² − c² = 24`,
    },
    {
        stage: 3,
        question: `Ha a, b, c > 0 és a + b = c, akkor a² + b² < c².
a = 3, b = 4, c = 7 esetén mennyi c² − (a² + b²)?`,
        answer: 24,
        type: 'multiplication',
        expression: `2ab = 24`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: 52941 jegyeiből képzett ötjegyű szám nem négyzetszám.
Mennyi a számjegyösszeg?`,
        answer: 21,
        type: 'multiplication',
        expression: `21 osztható 3-mal, de nem 9-cel`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: n³ + (n + 1)³ + (n + 2)³ osztható 9-cel.
n = 2 esetén mennyi az összeg osztva 9-cel?`,
        answer: 11,
        type: 'multiplication',
        expression: `99 / 9 = 11`,
    },
    {
        stage: 3,
        question: `Bizonyítsd: n⁴ − n² osztható 12-vel.
n = 5 esetén mennyi (n⁴ − n²) / 12?`,
        answer: 50,
        type: 'multiplication',
        expression: `600 / 12 = 50`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Bizonyítsd: 1 + 2 + … + n = n(n + 1)/2.
n = 10 esetén mennyi az összeg?`,
        answer: 55,
        type: 'multiplication',
        expression: `55`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1 + 3 + … + (2n − 1) = n².
n = 8 esetén mennyi az összeg?`,
        answer: 64,
        type: 'multiplication',
        expression: `8² = 64`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1² + … + n² = n(n + 1)(2n + 1)/6.
n = 5 esetén mennyi az összeg?`,
        answer: 55,
        type: 'multiplication',
        expression: `55`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1³ + … + n³ = [n(n + 1)/2]².
n = 5 esetén mennyi az összeg?`,
        answer: 225,
        type: 'multiplication',
        expression: `15² = 225`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 2ⁿ ≥ n + 1.
n = 5 esetén mennyi 2ⁿ?`,
        answer: 32,
        type: 'multiplication',
        expression: `32 ≥ 6`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 3ⁿ ≥ 2n + 1.
n = 4 esetén mennyi 3ⁿ?`,
        answer: 81,
        type: 'multiplication',
        expression: `81 ≥ 9`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 4ⁿ + 6n − 1 osztható 9-cel.
n = 2 esetén mennyi (4ⁿ + 6n − 1) / 9?`,
        answer: 3,
        type: 'multiplication',
        expression: `27 / 9 = 3`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 7ⁿ − 1 osztható 6-tal.
n = 2 esetén mennyi (7ⁿ − 1) / 6?`,
        answer: 8,
        type: 'multiplication',
        expression: `48 / 6 = 8`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 5^{2n} − 1 osztható 24-gyel.
n = 2 esetén mennyi (5⁴ − 1) / 24?`,
        answer: 26,
        type: 'multiplication',
        expression: `624 / 24 = 26`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1·2 + … + n(n + 1) = n(n + 1)(n + 2)/3.
n = 4 esetén mennyi az összeg?`,
        answer: 40,
        type: 'multiplication',
        expression: `40`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1·3 + … + n(n + 2) = n(n + 1)(2n + 7)/6.
n = 3 esetén mennyi az összeg?`,
        answer: 26,
        type: 'multiplication',
        expression: `26`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1/(1·2) + … + 1/(n(n + 1)) = n/(n + 1).
n = 4 esetén mennyi az összeg?`,
        answer: 0.8,
        type: 'multiplication',
        expression: `4/5 = 0,8`,
    },
    {
        stage: 4,
        question: `Bizonyítsd, hogy a_n = (3n + 2)/(4n + 1) szigorúan csökkenő.
Mennyi a₂ 3 tizedesjeggyel?`,
        answer: 0.889,
        type: 'multiplication',
        expression: `8/9 ≈ 0,889`,
    },
    {
        stage: 4,
        question: `Bizonyítsd, hogy a_n = n/(n + 1) szigorúan növekvő és felülről korlátos.
Mennyi a₁₀ 3 tizedesjeggyel?`,
        answer: 0.909,
        type: 'multiplication',
        expression: `10/11 ≈ 0,909`,
    },
    {
        stage: 4,
        question: `Bizonyítsd, hogy a_n = (2n + 1)/(n + 3) szigorúan növekvő (n ≥ 1).
Mennyi a₂?`,
        answer: 1,
        type: 'multiplication',
        expression: `5/5 = 1`,
    },
    {
        stage: 4,
        question: `Bizonyítsd, hogy a_n = (5n + 4)/(7n + 2) szigorúan csökkenő.
Mennyi a₂?`,
        answer: 0.875,
        type: 'multiplication',
        expression: `14/16 = 0,875`,
    },
    {
        stage: 4,
        question: `b_n = L / (1 + K qⁿ), L, K > 0, 0 < q < 1. Szigorúan növekvő és L-hez tart?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `a₁ = 1, a_{n+1} = 2a_n + 1. Igazold: a_n = 2ⁿ − 1.
Mennyi a₅?`,
        answer: 31,
        type: 'multiplication',
        expression: `32 − 1 = 31`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1 + 2 + 4 + … + 2^{n−1} = 2ⁿ − 1.
n = 6 esetén mennyi az összeg?`,
        answer: 63,
        type: 'multiplication',
        expression: `64 − 1 = 63`,
    },
    {
        stage: 4,
        question: `Bizonyítsd: 1·1! + … + n·n! = (n + 1)! − 1.
n = 4 esetén mennyi az összeg?`,
        answer: 119,
        type: 'multiplication',
        expression: `5! − 1 = 119`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Bizonyítsd: ha egy háromszög két magassága egyenlő, akkor a hozzájuk tartozó oldalak is.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `T = am/2`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: húrnégyszög szemközti szögeinek összege 180°.
Mennyi ez az összeg fokban?`,
        answer: 180,
        type: 'multiplication',
        expression: `180`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: paralelogramma átlói felezik egymást.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: ha egy négyszög átlói felezik egymást, akkor paralelogramma.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: rombusz átlói merőlegesek.
Mennyi a hajlásszögük fokban?`,
        answer: 90,
        type: 'multiplication',
        expression: `90`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: téglalap átlói egyenlők.
3 cm és 4 cm oldalú téglalap átlója cm-ben?`,
        answer: 5,
        type: 'multiplication',
        expression: `5`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: azonos ívhez tartozó kerületi szögek egyenlők.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 5,
        question: `Bizonyítsd Thalész tételét: átmérőhöz tartozó kerületi szög.
Mennyi ez a szög fokban?`,
        answer: 90,
        type: 'multiplication',
        expression: `90`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: a súlypont a súlyvonalakat 2 : 1 arányban osztja.
Add meg a csúcs felőli arány nagyobbik tagját!`,
        answer: 2,
        type: 'multiplication',
        expression: `2 : 1`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: a középvonal a párhuzamos oldal fele.
Ha az oldal 10, mennyi a középvonal?`,
        answer: 5,
        type: 'multiplication',
        expression: `5`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: C(n, k) = C(n, n − k).
Mennyi C(8, 3)?`,
        answer: 56,
        type: 'multiplication',
        expression: `C(8, 5) = 56`,
    },
    {
        stage: 5,
        question: `Bizonyítsd Pascal azonosságát.
Mennyi C(5, 2) + C(5, 3)?`,
        answer: 20,
        type: 'multiplication',
        expression: `C(6, 3) = 20`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: Σ C(n, k) = 2ⁿ.
n = 5 esetén mennyi az összeg?`,
        answer: 32,
        type: 'multiplication',
        expression: `32`,
    },
    {
        stage: 5,
        question: `13 dobókockadobás között biztosan van legalább hány azonos eredmény?`,
        answer: 3,
        type: 'multiplication',
        expression: `6 · 2 + 1`,
    },
    {
        stage: 5,
        question: `n + 1 egész közül kettő különbsége osztható n-nel.
n = 5 esetén hány szám kell ehhez?`,
        answer: 6,
        type: 'multiplication',
        expression: `5 + 1 = 6`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: egyszerű gráfban a fokszámok összege páros.
K₃ fokszámösszege?`,
        answer: 6,
        type: 'multiplication',
        expression: `2e = 6`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: a páratlan fokszámú csúcsok száma páros.
Egy 3 élű út hány páratlan fokú csúcsa van?`,
        answer: 2,
        type: 'multiplication',
        expression: `2`,
    },
    {
        stage: 5,
        question: `Bizonyítsd: n csúcsú fa éleinek száma n − 1.
n = 6 esetén mennyi az élszám?`,
        answer: 5,
        type: 'multiplication',
        expression: `5`,
    },
    {
        stage: 5,
        question: `Ha egy n csúcsú egyszerű gráfnak legalább C(n − 1, 2) + 1 éle van, akkor összefüggő.
n = 4 esetén mennyi ez a küszöb?`,
        answer: 4,
        type: 'multiplication',
        expression: `C(3, 2) + 1 = 4`,
    },
    {
        stage: 5,
        question: `K₆ éleinek kétszínezésében mindig van egyszínű háromszög.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Ramsey`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Ha egy kocka és egy gömb felszíne egyenlő, a gömb térfogata nagyobb.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `π < 6`,
    },
    {
        stage: 6,
        question: `p és q élű kockákat egy kockává olvasztunk. Az új felszín kisebb az eredeti összegnél.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Azonos magasságú hengerek sugarai r = 1, R = 4. Az összeolvasztott henger sugara √(r² + R²).

Add meg 3 tizedesjeggyel!`,
        answer: 4.123,
        type: 'multiplication',
        expression: `√17 ≈ 4,123 ≥ √8`,
    },
    {
        stage: 6,
        question: `R sugarú gömbbe írt maximális térfogatú henger magassága 2R/√3.
Add meg h/R értékét 3 tizedesjeggyel!`,
        answer: 1.155,
        type: 'multiplication',
        expression: `2/√3 ≈ 1,155`,
    },
    {
        stage: 6,
        question: `Adott térfogatú zárt henger felszíne akkor minimális, ha h = 2r.
Add meg a h/r arányt!`,
        answer: 2,
        type: 'multiplication',
        expression: `h = 2r`,
    },
    {
        stage: 6,
        question: `Adott térfogatú felül nyitott henger felszíne akkor minimális, ha h = r.
Add meg a h/r arányt!`,
        answer: 1,
        type: 'multiplication',
        expression: `h = r`,
    },
    {
        stage: 6,
        question: `Adott összes élhosszúságú téglatestek közül a kocka térfogata a legnagyobb.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `AM-GM`,
    },
    {
        stage: 6,
        question: `Ha egy négyszög szögei számtani sorozat egymást követő tagjai, akkor trapéz vagy húrnégyszög.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Ha egy nem szabályos háromszög oldalai számtani sorozat, akkor nincs 60°-os szöge.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `f(n) = (n² − 5n + 10)/2, n ≥ 3 egész értékű és szigorúan növekvő.
Mennyi f(4)?`,
        answer: 3,
        type: 'multiplication',
        expression: `(16 − 20 + 10)/2 = 3`,
    },
    {
        stage: 6,
        question: `Van n ≥ 3, amelyre f(n) = 2 + m(m + 1)/2.
m = 4 esetén mennyi ez az n?`,
        answer: 7,
        type: 'multiplication',
        expression: `n = m + 3`,
    },
    {
        stage: 6,
        question: `Bizonyítsd: 1³ + … + n³ = [n(n + 1)/2]².
n = 3 esetén mennyi az összeg?`,
        answer: 36,
        type: 'multiplication',
        expression: `6² = 36`,
    },
    {
        stage: 6,
        question: `Van-e n > 2, amelyre C(n,1), C(n,2), C(n,3) mértani sorozat?

Add meg 1-et, ha van, 0-t, ha nincs!`,
        answer: 0,
        type: 'multiplication',
        expression: `n = −1 adódna`,
    },
    {
        stage: 6,
        question: `a² + 2ab + b² − c² > 0 háromszög-oldalakra; a megfordítás hamis.
A kulcsbeli ellenpéldában mennyi c?`,
        answer: 1,
        type: 'multiplication',
        expression: `a = 2, b = 1, c = 1`,
    },
    {
        stage: 6,
        question: `6 csúcsú teljes gráf éleinek kétszínezésében van egyszínű háromszög.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Ramsey`,
    },
    {
        stage: 6,
        question: `n csúcsú körmentes egyszerű gráfnak legfeljebb n − 1 éle van.
n = 7 esetén mennyi a maximum?`,
        answer: 6,
        type: 'multiplication',
        expression: `6`,
    },
    {
        stage: 6,
        question: `8 csúcsú, 9 élű gráf tartalmaz kört. Körmentes 8 csúcsú gráf max. élszáma?`,
        answer: 7,
        type: 'multiplication',
        expression: `7 < 9`,
    },
    {
        stage: 6,
        question: `b_n = L / (1 + K qⁿ), L = 12000, K = 39, 0 < q < 1.
Mennyi b₀?`,
        answer: 300,
        type: 'multiplication',
        expression: `12000 / 40 = 300`,
    },
    {
        stage: 6,
        question: `P(t) = E / (1 + k · 2^{−ct}) ≤ E.
E = 100, k = 1, t = 0 esetén mennyi P(0)?`,
        answer: 50,
        type: 'multiplication',
        expression: `100 / 2 = 50`,
    },
    {
        stage: 6,
        question: `S_n = Σ_{1≤i<j≤n} ij = n(n − 1)(n + 1)(3n + 2)/24.
n = 4 esetén mennyi S_n?`,
        answer: 35,
        type: 'multiplication',
        expression: `35`,
    },
];
