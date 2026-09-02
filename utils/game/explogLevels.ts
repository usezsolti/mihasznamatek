import type { Question } from './types';

/**
 * Exponenciális és logaritmikus kifejezések — 6×20
 * (Exponenciális_és_logaritmikus_egyenletek.pdf / TeX).
 * 1 Alapok → 2 Egyenletek → 3 Másodfokú helyettesítés →
 * 4 Egyenlőtlenségek → 5 Összetett / modell → 6 Mesterfok.
 * Egy kártya = egy szám vagy halmaz. Igen/hamis: 1 / 0.
 */
export const getExponentialLogPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Egyszerűsítsd: 2³ · 2⁵.`,
        answer: 256,
        type: 'multiplication',
        expression: `2⁸ = 256`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: 5⁷ / 5³.`,
        answer: 625,
        type: 'multiplication',
        expression: `5⁴ = 625`,
    },
    {
        stage: 1,
        question: `Írd egyetlen hatvány alakjában: 3^{x+2} · 3^{x−1}.
Add meg a kitevőben x együtthatóját!`,
        answer: 2,
        type: 'multiplication',
        expression: `3^{2x+1}`,
    },
    {
        stage: 1,
        question: `Írd egyetlen hatvány alakjában: 7^{2x+1} / 7^{x−3}.
Add meg a kitevő konstans tagját!`,
        answer: 4,
        type: 'multiplication',
        expression: `7^{x+4}`,
    },
    {
        stage: 1,
        question: `Oldd meg: 2ˣ = 32.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 1,
        question: `Oldd meg: 3ˣ = 1/27.`,
        answer: -3,
        type: 'multiplication',
        expression: `x = −3`,
    },
    {
        stage: 1,
        question: `Oldd meg: 5^{x−1} = 25.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 1,
        question: `Oldd meg: 4^{x+1} = 64.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 1,
        question: `Számítsd ki: log₂ 32.`,
        answer: 5,
        type: 'multiplication',
        expression: `5`,
    },
    {
        stage: 1,
        question: `Számítsd ki: log₃(1/27).`,
        answer: -3,
        type: 'multiplication',
        expression: `−3`,
    },
    {
        stage: 1,
        question: `Számítsd ki: log₅ 125.`,
        answer: 3,
        type: 'multiplication',
        expression: `3`,
    },
    {
        stage: 1,
        question: `Számítsd ki: log_{1/2} 8.`,
        answer: -3,
        type: 'multiplication',
        expression: `−3`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = log₂(x − 3).
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `(3, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = log₅(7 − 2x).
Add meg a véges határpontot!`,
        answer: 3.5,
        type: 'multiplication',
        expression: `(−∞, 7/2)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = log₃(x² − 4).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `(−∞, −2) ∪ (2, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = 1 / log₂ x.
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `(0, 1) ∪ (1, ∞)`,
    },
    {
        stage: 1,
        question: `Oldd meg: log₂ x = 4.`,
        answer: 16,
        type: 'multiplication',
        expression: `x = 16`,
    },
    {
        stage: 1,
        question: `Oldd meg: log₃(x − 1) = 2.`,
        answer: 10,
        type: 'multiplication',
        expression: `x = 10`,
    },
    {
        stage: 1,
        question: `Oldd meg: log₅(2x + 1) = 1.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 1,
        question: `Döntsd el, igaz vagy hamis: log₂(8 · 4) = log₂ 8 + log₂ 4.

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Oldd meg: 2^{x+1} = 8^{x−1}.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 2,
        question: `Oldd meg: 9ˣ = 3^{x+4}.`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 2,
        question: `Oldd meg: 5^{2x−1} = 125.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 2,
        question: `Oldd meg: (1/4)^{x−2} = 8.`,
        answer: 0.5,
        type: 'multiplication',
        expression: `x = 1/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2ˣ + 2ˣ = 64.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 2,
        question: `Oldd meg: 3^{x+1} + 3ˣ = 108.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg: 5^{x+1} − 5ˣ = 500.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg: 4ˣ + 2 · 4ˣ = 192.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₂ x + log₂ 4 = 5.`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₃(x − 2) + log₃ 3 = 2.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₅ x − log₅ 4 = 1.`,
        answer: 20,
        type: 'multiplication',
        expression: `x = 20`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₂(x + 1) = log₂ 9.`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₃(x − 1) + log₃(x + 1) = 2.
Add meg 3 tizedesjeggyel!`,
        answer: 3.162,
        type: 'multiplication',
        expression: `x = √10`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₂(x + 2) − log₂ x = 1.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2 log₃ x = 4.`,
        answer: 9,
        type: 'multiplication',
        expression: `x = 9`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₂(x²) = 6.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-8', '8'],
        type: 'multiplication',
        expression: `x = ±8`,
    },
    {
        stage: 2,
        question: `Oldd meg: log₅(x − 4) = 0.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 2,
        question: `Oldd meg: log_{1/2}(x + 1) = −2.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg: 7^{x−2} = 49^{1−x}.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 2,
        question: `Oldd meg: 10^{2x} = 1000^{x−1}.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Oldd meg: 2^{2x} − 5 · 2ˣ + 4 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `x = 0 vagy 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 3^{2x} − 10 · 3ˣ + 9 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `x = 0 vagy 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 4ˣ − 5 · 2ˣ + 4 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `x = 0 vagy 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 9ˣ − 10 · 3ˣ + 9 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `x = 0 vagy 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 25ˣ − 6 · 5ˣ + 5 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `x = 0 vagy 1`,
    },
    {
        stage: 3,
        question: `Oldd meg: 2^{2x+1} − 9 · 2ˣ + 4 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '2'],
        type: 'multiplication',
        expression: `x = −1 vagy 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 3 · 9ˣ − 10 · 3ˣ + 3 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = −1 vagy 1`,
    },
    {
        stage: 3,
        question: `Oldd meg: 4^{x+1} − 17 · 2ˣ + 4 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `x = −2 vagy 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: (log₂ x)² − 5 log₂ x + 6 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['4', '8'],
        type: 'multiplication',
        expression: `x = 4 vagy 8`,
    },
    {
        stage: 3,
        question: `Oldd meg: (log₃ x)² − 4 log₃ x + 3 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['3', '27'],
        type: 'multiplication',
        expression: `x = 3 vagy 27`,
    },
    {
        stage: 3,
        question: `Oldd meg: (lg x)² + lg x − 2 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0.01', '10'],
        type: 'multiplication',
        expression: `x = 10 vagy 0,01`,
    },
    {
        stage: 3,
        question: `Oldd meg: (log₅ x)² − 1 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0.2', '5'],
        type: 'multiplication',
        expression: `x = 5 vagy 1/5`,
    },
    {
        stage: 3,
        question: `Oldd meg: log₂ x + log₂(x − 2) = 3.`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Oldd meg: log₃ x + log₃(x + 2) = 2.`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 3,
        question: `Oldd meg: log₂(x − 1) − log₂(x − 3) = 1.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 3,
        question: `Oldd meg: log₅(x + 4) − log₅(x − 1) = 1.`,
        answer: 2.25,
        type: 'multiplication',
        expression: `x = 9/4`,
    },
    {
        stage: 3,
        question: `Oldd meg: x + y = 10, log₂ x + log₂ y = 4 (x, y > 0).
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['2', '8'],
        type: 'multiplication',
        expression: `(2, 8) vagy (8, 2)`,
    },
    {
        stage: 3,
        question: `Oldd meg: x + y = 7, log₃ x + log₃ y = 2 (x, y > 0).
Add meg a nagyobbik gyököt 3 tizedesjeggyel!`,
        answer: 5.303,
        type: 'multiplication',
        expression: `(7 ± √13)/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 2ˣ + 2^{−x} = 5/2.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 3,
        question: `Oldd meg: 3ˣ + 3^{−x} = 10/3.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Oldd meg: 2ˣ > 8.
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `x > 3`,
    },
    {
        stage: 4,
        question: `Oldd meg: 3^{2x−1} ≤ 27.
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≤ 2`,
    },
    {
        stage: 4,
        question: `Oldd meg: (1/2)ˣ ≥ 8.
Add meg a véges határpontot!`,
        answer: -3,
        type: 'multiplication',
        expression: `x ≤ −3`,
    },
    {
        stage: 4,
        question: `Oldd meg: 5^{x+1} < 1/25.
Add meg a véges határpontot!`,
        answer: -3,
        type: 'multiplication',
        expression: `x < −3`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2ˣ + 2ˣ ≤ 32.
Add meg a véges határpontot!`,
        answer: 4,
        type: 'multiplication',
        expression: `x ≤ 4`,
    },
    {
        stage: 4,
        question: `Oldd meg: 3^{x+1} − 3ˣ > 54.
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `x > 3`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₂ x > 3.
Add meg a véges határpontot!`,
        answer: 8,
        type: 'multiplication',
        expression: `x > 8`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₃(x − 1) ≤ 2.
Add meg a zárt (nagyobb) határpontot!`,
        answer: 10,
        type: 'multiplication',
        expression: `1 < x ≤ 10`,
    },
    {
        stage: 4,
        question: `Oldd meg: log_{1/2}(x + 2) > −1.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-2', '0'],
        type: 'multiplication',
        expression: `−2 < x < 0`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₅(2x − 1) ≥ 1.
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≥ 3`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₂(x² − 1) ≥ 3.
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `(−∞, −3] ∪ [3, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₃(x + 4) < 1.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-4', '-1'],
        type: 'multiplication',
        expression: `−4 < x < −1`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₂(x − 1) + log₂(x + 1) ≥ 3.
Add meg a véges határpontot (értelmezési tartománnyal)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≥ 3`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₅(x + 4) − log₅(x − 1) > 0.
Add meg a véges határpontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `x > 1`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2^{2x} − 5 · 2ˣ + 4 ≤ 0.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `0 ≤ x ≤ 2`,
    },
    {
        stage: 4,
        question: `Oldd meg: 3^{2x} − 10 · 3ˣ + 9 > 0.
Add meg a pozitív határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `x < 0 vagy x > 2`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₂ x + log₂(8 − x) ≥ 3.
Add meg a kisebb határpontot 3 tizedesjeggyel!`,
        answer: 1.172,
        type: 'multiplication',
        expression: `[4 − 2√2, 4 + 2√2]`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₃(x² − 4) < 2.
Add meg a pozitív külső határpontot 3 tizedesjeggyel!`,
        answer: 3.606,
        type: 'multiplication',
        expression: `(−√13, −2) ∪ (2, √13)`,
    },
    {
        stage: 4,
        question: `Hány egész megoldása van: log_{1/2}(2x + 10) ≥ −3?`,
        answer: 4,
        type: 'multiplication',
        expression: `−5 < x ≤ −1 → 4 egész`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2ˣ < 100.
Add meg a legnagyobb egész megoldást!`,
        answer: 6,
        type: 'multiplication',
        expression: `minden egész x ≤ 6`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Oldd meg: 2^{x+2} + 2^{2−x} = 10.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 5,
        question: `Oldd meg: 3^{x+1} + 3^{1−x} = 10.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 5,
        question: `Oldd meg: 5ˣ − 6 + 5^{−x} = 0.
Add meg a pozitív megoldást 3 tizedesjeggyel!`,
        answer: 1.095,
        type: 'multiplication',
        expression: `5ˣ = 3 + 2√2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2^{2x+1} − 5 · 2ˣ + 2 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₂ x + log₂(x − 2) = log₂ 15.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2 log₃ x − log₃(x − 2) = 2.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₂(x + 3) − log₂(x − 1) = 2.

Add meg 3 tizedesjeggyel!`,
        answer: 2.333,
        type: 'multiplication',
        expression: `x = 7/3`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₅(x² − 4x) = 1.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '5'],
        type: 'multiplication',
        expression: `x = 2 ± 3`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₂ x = log_x 16.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0.25', '4'],
        type: 'multiplication',
        expression: `x = 4 vagy 1/4`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₃ x + log_x 3 = 2.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 5,
        question: `Határozd meg p-t úgy, hogy 2ˣ = p-nek legyen valós megoldása.
Add meg p megengedett értékeinek véges határpontját!`,
        answer: 0,
        type: 'multiplication',
        expression: `p > 0`,
    },
    {
        stage: 5,
        question: `Határozd meg p-t úgy, hogy log₂(x − p) értelmezési tartománya tartalmazza a (5, ∞) intervallumot!
Add meg p megengedett értékeinek véges határpontját!`,
        answer: 5,
        type: 'multiplication',
        expression: `p ≤ 5`,
    },
    {
        stage: 5,
        question: `Határozd meg p-t úgy, hogy 2^{2x} − p · 2ˣ + 4 = 0-nak pontosan egy valós megoldása legyen!`,
        answer: 4,
        type: 'multiplication',
        expression: `p = 4 (t = 2ˣ > 0)`,
    },
    {
        stage: 5,
        question: `Határozd meg p-t úgy, hogy (log₂ x)² − p log₂ x + 1 = 0-nak pontosan egy pozitív megoldása legyen.
Add meg a két p-t!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `p = ±2`,
    },
    {
        stage: 5,
        question: `N(t) = 500 · 1,12ᵗ. Hány egyed lesz 10 óra múlva?

Add meg 3 tizedesjeggyel!`,
        answer: 1552.924,
        type: 'multiplication',
        expression: `500 · 1,12¹⁰ ≈ 1552,924`,
    },
    {
        stage: 5,
        question: `N(t) = 500 · 1,12ᵗ. Körülbelül hány óra múlva lesz a létszám 2000?

Add meg 2 tizedesjeggyel!`,
        answer: 12.23,
        type: 'multiplication',
        expression: `log 4 / log 1,12 ≈ 12,23`,
    },
    {
        stage: 5,
        question: `Egy gyógyszer mennyisége óránként az előző 80%-ára csökken. Kezdetben 250 mg. Add meg a mennyiséget 1 óra múlva mg-ban!`,
        answer: 200,
        type: 'multiplication',
        expression: `M(t) = 250 · 0,8ᵗ, M(1) = 200`,
    },
    {
        stage: 5,
        question: `M(t) = 250 · 0,8ᵗ. Hány óra múlva csökken a mennyiség 50 mg alá?

Add meg a küszöböt 2 tizedesjeggyel!`,
        answer: 7.21,
        type: 'multiplication',
        expression: `log 0,2 / log 0,8 ≈ 7,21`,
    },
    {
        stage: 5,
        question: `h(t) = 25 / (1 + 49 · 0,92ᵗ). Határozd meg h(0)-t méterben!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `0,5 m`,
    },
    {
        stage: 5,
        question: `h(t) = 25 / (1 + 49 · 0,92ᵗ). Milyen értékhez tart h(t), ha t → ∞?`,
        answer: 25,
        type: 'multiplication',
        expression: `25 m`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Oldd meg: 2^{2x} − 6 · 2ˣ + 8 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['1', '2'],
        type: 'multiplication',
        expression: `x = 1 vagy 2`,
    },
    {
        stage: 6,
        question: `Oldd meg: 3^{2x+1} − 28 · 3ˣ + 9 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '2'],
        type: 'multiplication',
        expression: `x = −1 vagy 2`,
    },
    {
        stage: 6,
        question: `Oldd meg: 5^{x+1} + 5^{1−x} = 26.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 6,
        question: `Oldd meg: log₂(x − 1) + log₂(x + 3) = 3.

Add meg 3 tizedesjeggyel!`,
        answer: 2.464,
        type: 'multiplication',
        expression: `x = −1 + 2√3`,
    },
    {
        stage: 6,
        question: `Oldd meg: log₃(x + 1) − log₃(x − 2) = 1.`,
        answer: 3.5,
        type: 'multiplication',
        expression: `x = 7/2`,
    },
    {
        stage: 6,
        question: `Oldd meg: (log₂ x)² − 3 log₂ x − 4 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0.0625', '16'],
        type: 'multiplication',
        expression: `x = 16 vagy 1/16`,
    },
    {
        stage: 6,
        question: `Oldd meg: log₂ x + log_x 2 = 5/2.
Add meg a nagyobbik megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4 vagy √2`,
    },
    {
        stage: 6,
        question: `Oldd meg: 2ˣ + 4ˣ = 6.`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 6,
        question: `Oldd meg: 3ˣ + 9ˣ = 12.`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 6,
        question: `Oldd meg: 2ˣ + 2^{−x} = 3.
Add meg a pozitív megoldást 3 tizedesjeggyel!`,
        answer: 1.388,
        type: 'multiplication',
        expression: `log₂((3+√5)/2)`,
    },
    {
        stage: 6,
        question: `Határozd meg p-t úgy, hogy 2^{2x} − p · 2ˣ + 8 = 0-nak két különböző valós megoldása legyen.
Add meg a határpontot 3 tizedesjeggyel!`,
        answer: 5.657,
        type: 'multiplication',
        expression: `p > 4√2`,
    },
    {
        stage: 6,
        question: `Határozd meg p-t úgy, hogy (log₃ x)² − p log₃ x + 2 = 0-nak két különböző pozitív megoldása legyen.
Add meg a pozitív határpontot 3 tizedesjeggyel!`,
        answer: 2.828,
        type: 'multiplication',
        expression: `|p| > 2√2`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be minden valós x-re: 2ˣ + 2^{−x} ≥ 2.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz (AM-GM)`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be minden valós x-re: 5ˣ + 5^{−x} ≥ 2.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: log_a(xy) = log_a x + log_a y (a > 0, a ≠ 1, x, y > 0).

Add meg 1-et, ha az azonosság igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: log_a(x/y) = log_a x − log_a y.

Add meg 1-et, ha az azonosság igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `P(t) = 12000 / (1 + 39 · 0,85ᵗ). Határozd meg P(0)-t!`,
        answer: 300,
        type: 'multiplication',
        expression: `P(0) = 300, határérték 12000`,
    },
    {
        stage: 6,
        question: `P(t) = 12000 / (1 + 39 · 0,85ᵗ). Körülbelül hány időegység múlva lesz a populáció 6000?

Add meg 1 tizedesjeggyel!`,
        answer: 22.5,
        type: 'multiplication',
        expression: `log(1/39) / log 0,85 ≈ 22,5`,
    },
    {
        stage: 6,
        question: `m(t) = 80 · 2^{−t/6}. Mikor csökken a tömeg 10 grammra?`,
        answer: 18,
        type: 'multiplication',
        expression: `felezési idő 6, t = 18`,
    },
    {
        stage: 6,
        question: `Határozd meg az összes p-t, amelyekre log₂(x − p) + log₂(x + p) = 3-nak van valós megoldása.
Igaz-e, hogy minden valós p jó?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `p ∈ ℝ`,
    },
];
