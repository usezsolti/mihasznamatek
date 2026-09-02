import type { Question } from './types';

/**
 * Függvények, analízis — 6×20
 * (Függvények_és_anlízis.pdf / TeX).
 * 1 Alapok → 2 Érintő / szélsőérték → 3 Második derivált →
 * 4 Integrál / terület → 5 Optimalizálás → 6 Mesterfok.
 * Egy kártya = egy szám vagy halmaz. Igen/hamis: 1 / 0.
 * Algebrai képlet: a kért helyen kiértékelt szám.
 */
export const getFunctionsPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Legyen f(x) = 2x² − 5x + 3.
Számítsd ki f(2) értékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `f(2) = 1`,
    },
    {
        stage: 1,
        question: `Határozd meg az f(x) = 3x − 12 függvény zérushelyét!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 1,
        question: `Határozd meg az f(x) = x² − 9 függvény zérushelyeit.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `x = ±3`,
    },
    {
        stage: 1,
        question: `Add meg az f(x) = (2x + 1)/(x − 4) értelmezési tartományát.
Add meg a kizárt véges pontot!`,
        answer: 4,
        type: 'multiplication',
        expression: `ℝ ∖ {4}`,
    },
    {
        stage: 1,
        question: `Add meg az f(x) = √(5 − x) értelmezési tartományát.
Add meg a véges határpontot!`,
        answer: 5,
        type: 'multiplication',
        expression: `(−∞, 5]`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = 4x³ − 5x² + 7x − 2.
Add meg f'(1) értékét!`,
        answer: 9,
        type: 'multiplication',
        expression: `f'(x) = 12x² − 10x + 7, f'(1) = 9`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = (1/2)x⁴ − 3x² + 8.
Add meg f'(1) értékét!`,
        answer: -4,
        type: 'multiplication',
        expression: `f'(x) = 2x³ − 6x, f'(1) = −4`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = 1/x (x ≠ 0).
Add meg f'(1) értékét!`,
        answer: -1,
        type: 'multiplication',
        expression: `f'(x) = −1/x², f'(1) = −1`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = √x (x > 0).
Add meg f'(4) értékét!`,
        answer: 0.25,
        type: 'multiplication',
        expression: `f'(x) = 1/(2√x), f'(4) = 1/4`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = 2ˣ.
Add meg f'(0) értékét 3 tizedesjeggyel!`,
        answer: 0.693,
        type: 'multiplication',
        expression: `f'(x) = 2ˣ ln 2, f'(0) = ln 2`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = ln x (x > 0).
Add meg f'(2) értékét!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `f'(x) = 1/x, f'(2) = 1/2`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = sin x.
Add meg f'(0) értékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `f'(x) = cos x, f'(0) = 1`,
    },
    {
        stage: 1,
        question: `Deriváld: f(x) = cos x.
Add meg f'(π/2) értékét!`,
        answer: -1,
        type: 'multiplication',
        expression: `f'(x) = −sin x, f'(π/2) = −1`,
    },
    {
        stage: 1,
        question: `Számítsd ki az f(x) = x³ − 2x deriváltját az x = 2 helyen!`,
        answer: 10,
        type: 'multiplication',
        expression: `f'(2) = 10`,
    },
    {
        stage: 1,
        question: `Írd fel az f(x) = x² + 1 görbéhez az x = 1 helyen húzott érintő meredekségét!`,
        answer: 2,
        type: 'multiplication',
        expression: `m = 2`,
    },
    {
        stage: 1,
        question: `Döntsd el, növekvő vagy csökkenő az f(x) = 5x − 3 a valós számok halmazán.

Add meg 1-et, ha növekvő, 0-t, ha csökkenő!`,
        answer: 1,
        type: 'multiplication',
        expression: `Szigorúan monoton növekvő`,
    },
    {
        stage: 1,
        question: `Döntsd el, növekvő vagy csökkenő az f(x) = −2x + 7 a valós számok halmazán.

Add meg 1-et, ha növekvő, 0-t, ha csökkenő!`,
        answer: 0,
        type: 'multiplication',
        expression: `Szigorúan monoton csökkenő`,
    },
    {
        stage: 1,
        question: `Határozd meg az f(x) = x² − 4x + 7 parabola csúcspontjának koordinátáit.
Add meg a két koordinátát!`,
        answer: 2,
        expectedSet: ['2', '3'],
        type: 'multiplication',
        expression: `(2; 3)`,
    },
    {
        stage: 1,
        question: `Határozd meg az f(x) = −x² + 6x − 5 függvény maximumhelyét!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 1,
        question: `Adj meg egy primitív függvényt f(x) = 6x² − 4x + 3-hoz (C = 0).
Add meg F(1) értékét!`,
        answer: 3,
        type: 'multiplication',
        expression: `F(x) = 2x³ − 2x² + 3x, F(1) = 3`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Írd fel az f(x) = x² − 3x + 2 görbéhez az x = 2 helyen húzott érintő egyenletét.
Add meg az y-tengelymetszetet!`,
        answer: -2,
        type: 'multiplication',
        expression: `y = x − 2`,
    },
    {
        stage: 2,
        question: `Írd fel az f(x) = x³ görbéhez az x = −1 helyen húzott érintő egyenletét.
Add meg az y-tengelymetszetet!`,
        answer: 2,
        type: 'multiplication',
        expression: `y = 3x + 2`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = x² − 6x + 5 minimumértékét!`,
        answer: -4,
        type: 'multiplication',
        expression: `f(3) = −4`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = −x² + 4x + 1 maximumértékét!`,
        answer: 5,
        type: 'multiplication',
        expression: `f(2) = 5`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = x³ − 3x lokális szélsőértékhelyeit.
Add meg a két helyet!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = x³ − 6x² + 9x monotonitási határpontjait.
Add meg a két véges pontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `nő (−∞,1) ∪ (3,∞), csökken (1,3)`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = x⁴ − 4x² kritikus pontjait.
Add meg a három helyet 3 tizedesjeggyel!`,
        answer: 3,
        expectedSet: ['-1.414', '0', '1.414'],
        type: 'multiplication',
        expression: `x = 0, ±√2`,
    },
    {
        stage: 2,
        question: `Vizsgáld az f(x) = x + 4/x (x > 0) függvényt minimum szempontjából.
Add meg a minimumhelyet!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2, f(2) = 4`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = x²/2 − 4x + 1 minimumértékét!`,
        answer: -7,
        type: 'multiplication',
        expression: `x = 4, f(4) = −7`,
    },
    {
        stage: 2,
        question: `Írd fel az f(x) = √x görbéhez az x = 4 helyen húzott érintő meredekségét!`,
        answer: 0.25,
        type: 'multiplication',
        expression: `y = (1/4)x + 1`,
    },
    {
        stage: 2,
        question: `Írd fel az f(x) = ln x görbéhez az x = 1 helyen húzott érintő y-tengelymetszetét!`,
        answer: -1,
        type: 'multiplication',
        expression: `y = x − 1`,
    },
    {
        stage: 2,
        question: `Írd fel az f(x) = eˣ görbéhez az x = 0 helyen húzott érintő y-tengelymetszetét!`,
        answer: 1,
        type: 'multiplication',
        expression: `y = x + 1`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = 2 sin x, x ∈ [0, 2π] szélsőértékhelyeit.
Add meg a helyeket π együtthatójaként!`,
        answer: 2,
        expectedSet: ['0.5', '1.5'],
        type: 'multiplication',
        expression: `x = π/2 és 3π/2`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = cos x, x ∈ [0, 2π] maximumértékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `max = 1, min = −1`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = x³ − 12x + 1 lokális maximumhelyét!`,
        answer: -2,
        type: 'multiplication',
        expression: `x = −2`,
    },
    {
        stage: 2,
        question: `Határozd meg az f(x) = x³ − 12x + 1 lokális minimumhelyét!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 2,
        question: `Mely intervallumokon növekvő az f(x) = x³ − 3x²?
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `(−∞, 0) ∪ (2, ∞)`,
    },
    {
        stage: 2,
        question: `Mely intervallumokon csökkenő az f(x) = x³ + 3x²?
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-2', '0'],
        type: 'multiplication',
        expression: `(−2, 0)`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t úgy, hogy f(x) = x² + px + 4 deriváltja az x = 2 helyen 0 legyen!`,
        answer: -4,
        type: 'multiplication',
        expression: `p = −4`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t úgy, hogy f(x) = x² + px deriváltja az x = 1 helyen pozitív legyen.
Add meg a véges határpontot!`,
        answer: -2,
        type: 'multiplication',
        expression: `p > −2`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Határozd meg az f(x) = x³ − 6x² + 9x inflexiós helyét!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 3,
        question: `Vizsgáld az f(x) = x⁴ − 4x² konvexitását.
Add meg a pozitív inflexiós határpontot 3 tizedesjeggyel!`,
        answer: 0.816,
        type: 'multiplication',
        expression: `√(2/3) ≈ 0,816`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x³ + 3x² − 9x lokális maximumértékét!`,
        answer: 27,
        type: 'multiplication',
        expression: `f(−3) = 27`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x³ + 3x² − 9x inflexiós pontjának x-koordinátáját!`,
        answer: -1,
        type: 'multiplication',
        expression: `(−1; 11)`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x⁴ − 8x² + 3 lokális maximumértékét!`,
        answer: 3,
        type: 'multiplication',
        expression: `f(0) = 3`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x⁴ − 8x² + 3 inflexiós helyeit.
Add meg a két helyet 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-1.155', '1.155'],
        type: 'multiplication',
        expression: `x = ±2/√3`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = (1/3)x³ − 2x² + 3x monotonitási határpontjait.
Add meg a két véges pontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `nő (−∞,1) ∪ (3,∞)`,
    },
    {
        stage: 3,
        question: `Az előző függvény lokális szélsőértékhelyei.
Add meg a két helyet!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `max: x = 1, min: x = 3`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x³ − 3x² + 2 inflexiós helyét!`,
        answer: 1,
        type: 'multiplication',
        expression: `konkáv (−∞,1), konvex (1,∞)`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = −x³ + 6x² − 9x inflexiós pontjának y-koordinátáját!`,
        answer: -2,
        type: 'multiplication',
        expression: `(2; −2)`,
    },
    {
        stage: 3,
        question: `Legyen f(x) = x⁴ − 2x². Az x = 0 lokális maximum- vagy minimumhely?

Add meg 1-et, ha maximum, 0-t, ha minimum!`,
        answer: 1,
        type: 'multiplication',
        expression: `Lokális maximumhely`,
    },
    {
        stage: 3,
        question: `Legyen f(x) = x⁴ + 2x². Az x = 0 lokális maximum- vagy minimumhely?

Add meg 1-et, ha maximum, 0-t, ha minimum!`,
        answer: 0,
        type: 'multiplication',
        expression: `Lokális minimumhely`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = ln x − x (x > 0) maximumértékét!`,
        answer: -1,
        type: 'multiplication',
        expression: `x = 1, f(1) = −1`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x e^{−x} pozitív tartományon vett maximumhelyét!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x² e^{−x} pozitív tartományon vett maximumhelyét!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = x + 1/x (x > 0) minimumértékét!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 1, f(1) = 2`,
    },
    {
        stage: 3,
        question: `Határozd meg p-t úgy, hogy f(x) = x³ + p x² + 3x-nek x = 1 szélsőértékhelye legyen!`,
        answer: -3,
        type: 'multiplication',
        expression: `p = −3`,
    },
    {
        stage: 3,
        question: `Határozd meg p-t úgy, hogy f(x) = x⁴ + p x²-nek x = 1 stacionárius pontja legyen!`,
        answer: -2,
        type: 'multiplication',
        expression: `p = −2`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = sin x + cos x maximumértékét 3 tizedesjeggyel!`,
        answer: 1.414,
        type: 'multiplication',
        expression: `√2`,
    },
    {
        stage: 3,
        question: `Határozd meg az f(x) = 2 sin x − 3 cos x legnagyobb értékét 3 tizedesjeggyel!`,
        answer: 3.606,
        type: 'multiplication',
        expression: `√13`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Számítsd ki: ∫₀² (3x² + 1) dx.`,
        answer: 10,
        type: 'multiplication',
        expression: `10`,
    },
    {
        stage: 4,
        question: `Számítsd ki: ∫₁³ (2x − 4) dx.`,
        answer: 0,
        type: 'multiplication',
        expression: `0`,
    },
    {
        stage: 4,
        question: `Számítsd ki: ∫₋₁² x² dx.`,
        answer: 3,
        type: 'multiplication',
        expression: `3`,
    },
    {
        stage: 4,
        question: `Számítsd ki: ∫₀^π sin x dx.`,
        answer: 2,
        type: 'multiplication',
        expression: `2`,
    },
    {
        stage: 4,
        question: `Számítsd ki: ∫₀^{π/2} cos x dx.`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 4,
        question: `Számítsd ki: ∫₁^e (1/x) dx.`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 4,
        question: `Határozd meg az f(x) = x² − 4 grafikonja és az x-tengely közti korlátos területet.

Add meg 3 tizedesjeggyel!`,
        answer: 10.667,
        type: 'multiplication',
        expression: `32/3`,
    },
    {
        stage: 4,
        question: `Határozd meg az f(x) = 4 − x² grafikonja és az x-tengely közti területet.

Add meg 3 tizedesjeggyel!`,
        answer: 10.667,
        type: 'multiplication',
        expression: `32/3`,
    },
    {
        stage: 4,
        question: `Határozd meg az f(x) = x² és g(x) = 2x görbék közti területet.

Add meg 3 tizedesjeggyel!`,
        answer: 1.333,
        type: 'multiplication',
        expression: `4/3`,
    },
    {
        stage: 4,
        question: `Határozd meg az f(x) = x + 2 és g(x) = x² görbék közti területet.`,
        answer: 4.5,
        type: 'multiplication',
        expression: `9/2`,
    },
    {
        stage: 4,
        question: `Határozd meg a sin x, az x = 0, x = π és az x-tengely közti területet!`,
        answer: 2,
        type: 'multiplication',
        expression: `2`,
    },
    {
        stage: 4,
        question: `Határozd meg a cos x és az x-tengely közti területet a [0, π] intervallumon!`,
        answer: 2,
        type: 'multiplication',
        expression: `2`,
    },
    {
        stage: 4,
        question: `Adj meg F primitív függvényt f(x) = 4x³ − 6x + 2-höz, F(0) = 5.
Add meg F(2) értékét!`,
        answer: 13,
        type: 'multiplication',
        expression: `F(x) = x⁴ − 3x² + 2x + 5, F(2) = 13`,
    },
    {
        stage: 4,
        question: `Határozd meg azt a primitív függvényt, amelyre F'(x) = 2x + 3 és F(1) = 4.
Add meg F(2) értékét!`,
        answer: 10,
        type: 'multiplication',
        expression: `F(x) = x² + 3x, F(2) = 10`,
    },
    {
        stage: 4,
        question: `Számítsd ki: ∫₀¹ (x + 1)² dx.

Add meg 3 tizedesjeggyel!`,
        answer: 2.333,
        type: 'multiplication',
        expression: `7/3`,
    },
    {
        stage: 4,
        question: `Számítsd ki: ∫₋₂² (4 − x²) dx.

Add meg 3 tizedesjeggyel!`,
        answer: 10.667,
        type: 'multiplication',
        expression: `32/3`,
    },
    {
        stage: 4,
        question: `Határozd meg az f(x) = x³ és az x-tengely közti területet a [−1, 1] intervallumon!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `1/2`,
    },
    {
        stage: 4,
        question: `Határozd meg az f(x) = x² − 2x grafikonja és az x-tengely közti korlátos területet.

Add meg 3 tizedesjeggyel!`,
        answer: 1.333,
        type: 'multiplication',
        expression: `4/3`,
    },
    {
        stage: 4,
        question: `Határozd meg az f(x) = 2x és g(x) = x² − 3 metszéspontjainak első koordinátáit.
Add meg a két értéket!`,
        answer: 2,
        expectedSet: ['-1', '3'],
        type: 'multiplication',
        expression: `x = −1 vagy 3`,
    },
    {
        stage: 4,
        question: `Az előző görbék által közrezárt terület.

Add meg 3 tizedesjeggyel!`,
        answer: 10.667,
        type: 'multiplication',
        expression: `32/3`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Egy téglalap kerülete 40 cm. Mekkora oldalhossz mellett maximális a területe?`,
        answer: 10,
        type: 'multiplication',
        expression: `10 cm × 10 cm`,
    },
    {
        stage: 5,
        question: `Egy téglalap egyik oldala x, a másik 20 − x. Határozd meg a maximális területet!`,
        answer: 100,
        type: 'multiplication',
        expression: `100`,
    },
    {
        stage: 5,
        question: `Felül nyitott négyzet alapú doboz térfogata 108 cm³. Add meg a minimális felszínű doboz alapélét cm-ben!`,
        answer: 6,
        type: 'multiplication',
        expression: `a = 6, h = 3`,
    },
    {
        stage: 5,
        question: `Zárt henger térfogata 128π cm³. Add meg a minimális felszínű henger sugarát cm-ben!`,
        answer: 4,
        type: 'multiplication',
        expression: `r = 4, h = 8`,
    },
    {
        stage: 5,
        question: `Felül nyitott henger térfogata 125π cm³. Add meg a minimális anyagfelülethez tartozó sugarat cm-ben!`,
        answer: 5,
        type: 'multiplication',
        expression: `r = 5, h = 5`,
    },
    {
        stage: 5,
        question: `24 cm × 24 cm-es karton sarkaiból x oldalú négyzeteket vágunk. Mekkora x mellett maximális a doboz térfogata?`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 5,
        question: `K(v) = 12v + 900/v, v > 0. Mekkora sebességnél minimális a költség?

Add meg 3 tizedesjeggyel!`,
        answer: 8.66,
        type: 'multiplication',
        expression: `√75 ≈ 8,660`,
    },
    {
        stage: 5,
        question: `K(v) = 350 + 0,6v + 1500/v, v > 0. Mekkora sebességnél minimális a költség?`,
        answer: 50,
        type: 'multiplication',
        expression: `v = 50`,
    },
    {
        stage: 5,
        question: `q(x) = 600 − 2x eladott darab, ár x forint. Melyik árnál maximális az árbevétel?`,
        answer: 150,
        type: 'multiplication',
        expression: `x = 150`,
    },
    {
        stage: 5,
        question: `Jegyár x száz forint, nézőszám N(x) = 1200 − 50x. Melyik x mellett maximális a bevétel?`,
        answer: 12,
        type: 'multiplication',
        expression: `x = 12`,
    },
    {
        stage: 5,
        question: `N(t) = 400 e^{0,15 t}. Mekkora a pillanatnyi növekedési sebesség t = 10-nél?

Add meg 3 tizedesjeggyel!`,
        answer: 268.901,
        type: 'multiplication',
        expression: `60 e^{1,5} ≈ 268,901`,
    },
    {
        stage: 5,
        question: `M(t) = 200 e^{−0,2 t}. Mekkora a pillanatnyi változási sebesség t = 5-nél?

Add meg 3 tizedesjeggyel!`,
        answer: -14.716,
        type: 'multiplication',
        expression: `−40/e ≈ −14,716`,
    },
    {
        stage: 5,
        question: `s(t) = t³ − 6t² + 9t. Mikor nulla a sebesség?
Add meg a két időpontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `t = 1 vagy 3`,
    },
    {
        stage: 5,
        question: `Az előző mozgásnál mikor pozitív a gyorsulás?
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `t > 2`,
    },
    {
        stage: 5,
        question: `1000 cm³ zárt henger, az alap és a fedő egységnyi költsége kétszer a palásténak.
Add meg a költségminimalizáló h/r arányt!`,
        answer: 4,
        type: 'multiplication',
        expression: `h = 4r`,
    },
    {
        stage: 5,
        question: `Téglalap kert két szomszédos oldala: 5 és 10 egység/m, összesen 400. Mekkora a hosszabb oldal a maximális területnél?`,
        answer: 40,
        type: 'multiplication',
        expression: `40 m és 20 m`,
    },
    {
        stage: 5,
        question: `G(v) = 280v − 500000 + 250000000/v. Határozd meg a minimumhelyet 1 tizedesjeggyel!`,
        answer: 944.9,
        type: 'multiplication',
        expression: `v ≈ 944,9`,
    },
    {
        stage: 5,
        question: `30 cm × 18 cm-es karton sarkaiból x oldalú négyzeteket vágunk. Add meg a maximális térfogatot adó x-et 3 tizedesjeggyel!`,
        answer: 3.641,
        type: 'multiplication',
        expression: `8 − √19 ≈ 3,641`,
    },
    {
        stage: 5,
        question: `T(n) = 25000/n + 90n. A folytonos modell szerint hol minimális T?

Add meg 3 tizedesjeggyel!`,
        answer: 16.667,
        type: 'multiplication',
        expression: `n = 50/3`,
    },
    {
        stage: 5,
        question: `Az előző feladatban, ha n pozitív egész, melyik n adja a kisebb időt: 16 vagy 17?`,
        answer: 17,
        type: 'multiplication',
        expression: `n = 17`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `fₚ(x) = −3x³ + (p − 3)x² + p² x − 4.
Határozd meg p-t úgy, hogy x = 1 zérushely legyen.
Add meg a két értéket 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-3.702', '2.702'],
        type: 'multiplication',
        expression: `p = (−1 ± √41)/2`,
    },
    {
        stage: 6,
        question: `Az előző függvénynél fₚ'(1) > 0.
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['-5', '3'],
        type: 'multiplication',
        expression: `p < −5 vagy p > 3`,
    },
    {
        stage: 6,
        question: `f(x) = x⁴ + 8x³ − 270x² + 275.
Add meg a stacionárius pontok első koordinátáit!`,
        answer: 3,
        expectedSet: ['-15', '0', '9'],
        type: 'multiplication',
        expression: `x = −15, 0, 9`,
    },
    {
        stage: 6,
        question: `Az előző függvénynél határozd meg az inflexiós helyeket.
Add meg a két helyet!`,
        answer: 2,
        expectedSet: ['-9', '5'],
        type: 'multiplication',
        expression: `x = −9, 5`,
    },
    {
        stage: 6,
        question: `Számítsd ki: ∫₀⁵ (x⁴ + 8x³ − 270x² + 275) dx.`,
        answer: -8000,
        type: 'multiplication',
        expression: `−8000`,
    },
    {
        stage: 6,
        question: `f(x) = 2ˣ − 1, h(x) = 10 − x², k = h ∘ f.
Add meg k(1) értékét!`,
        answer: 9,
        type: 'multiplication',
        expression: `k(x) = 10 − (2ˣ − 1)², k(1) = 9`,
    },
    {
        stage: 6,
        question: `f(x) = 2x + 1, g(x) = x² − 2. Oldd meg: f(g(x)) < g(f(x)).
Add meg a kizárt véges pontot!`,
        answer: -1,
        type: 'multiplication',
        expression: `ℝ ∖ {−1}`,
    },
    {
        stage: 6,
        question: `f(x) = x³ − 3x. Az x = 2 és x = 0 helyeken húzott érintők metszéspontjának x-koordinátája.

Add meg 3 tizedesjeggyel!`,
        answer: 1.333,
        type: 'multiplication',
        expression: `x = 4/3`,
    },
    {
        stage: 6,
        question: `f(x) = x³ + kx. Az x = 1 és x = 2 érintők metszéspontjának k-tól független x-koordinátája.

Add meg 3 tizedesjeggyel!`,
        answer: 1.556,
        type: 'multiplication',
        expression: `x = 14/9`,
    },
    {
        stage: 6,
        question: `Határozd meg az f(x) = x + 4/x (x > 0) minimumértékét!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 2, f(2) = 4`,
    },
    {
        stage: 6,
        question: `Határozd meg az f(x) = 1/(x² + 1) értékkészletének zárt határpontját!`,
        answer: 1,
        type: 'multiplication',
        expression: `(0, 1]`,
    },
    {
        stage: 6,
        question: `Határozd meg az f(x) = 2x/(x² + 1) abszolút maximumát!`,
        answer: 1,
        type: 'multiplication',
        expression: `max = 1, min = −1`,
    },
    {
        stage: 6,
        question: `sin x és (2x/π)² közti terület a [0, π/2] intervallumon.

Add meg 3 tizedesjeggyel!`,
        answer: 0.476,
        type: 'multiplication',
        expression: `1 − π/6`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be deriválással, hogy x + 1/x ≥ 2 minden x > 0 esetén.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be deriválással, hogy eˣ ≥ x + 1 minden valós x esetén.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Mely p-kre szigorúan monoton növekvő fₚ(x) = x³ + p x a teljes ℝ-en?
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `p ≥ 0`,
    },
    {
        stage: 6,
        question: `Mely p-kre van fₚ(x) = x⁴ + p x²-nek pontosan három stacionárius pontja?
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `p < 0`,
    },
    {
        stage: 6,
        question: `P(t) = 12000 / (1 + 39 e^{−0,2 t}). Mikor maximális a növekedési sebesség?

Add meg 3 tizedesjeggyel!`,
        answer: 18.318,
        type: 'multiplication',
        expression: `t = 5 ln 39 ≈ 18,318`,
    },
    {
        stage: 6,
        question: `Az előző modellben határozd meg a maximális növekedési sebességet!`,
        answer: 600,
        type: 'multiplication',
        expression: `600`,
    },
    {
        stage: 6,
        question: `f(x) = x² az [0, ∞)-en. Oldd meg: f⁻¹(x) = x/2.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '4'],
        type: 'multiplication',
        expression: `√x = x/2 → x = 0 vagy 4`,
    },
];
