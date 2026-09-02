import type { Question } from './types';

/**
 * Abszolútérték és gyök — 6×20 (Abszolútérték_és_gyök.pdf / TeX).
 * 1 Alapok → 2 Egyenletek → 3 Több abszolútérték / két gyök →
 * 4 Egyenlőtlenségek → 5 Vegyes → 6 Paraméter / mesterfok.
 * Egy kártya = egy szám vagy halmaz. Igaz/hamis: 1 / 0.
 */
export const getAbsoluteRootPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Számítsd ki: |−7|.`,
        answer: 7,
        type: 'multiplication',
        expression: `7`,
    },
    {
        stage: 1,
        question: `Számítsd ki: |3 − 8|.`,
        answer: 5,
        type: 'multiplication',
        expression: `5`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: √49.`,
        answer: 7,
        type: 'multiplication',
        expression: `7`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: √72.
Add meg √2 együtthatóját!`,
        answer: 6,
        type: 'multiplication',
        expression: `6√2`,
    },
    {
        stage: 1,
        question: `Add meg az f(x) = √(x − 4) értelmezési tartományának véges határpontját!`,
        answer: 4,
        type: 'multiplication',
        expression: `[4, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az f(x) = √(7 − 2x) értelmezési tartományának véges határpontját!`,
        answer: 3.5,
        type: 'multiplication',
        expression: `(−∞, 7/2]`,
    },
    {
        stage: 1,
        question: `Oldd meg: |x| = 6.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-6', '6'],
        type: 'multiplication',
        expression: `x = ±6`,
    },
    {
        stage: 1,
        question: `Oldd meg: |x − 3| = 5.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-2', '8'],
        type: 'multiplication',
        expression: `x = −2 vagy 8`,
    },
    {
        stage: 1,
        question: `Oldd meg: |2x + 1| = 7.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-4', '3'],
        type: 'multiplication',
        expression: `x = 3 vagy −4`,
    },
    {
        stage: 1,
        question: `Oldd meg: √x = 5.`,
        answer: 25,
        type: 'multiplication',
        expression: `x = 25`,
    },
    {
        stage: 1,
        question: `Oldd meg: √(x + 4) = 3.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 1,
        question: `Oldd meg: √(2x − 1) = 5.`,
        answer: 13,
        type: 'multiplication',
        expression: `x = 13`,
    },
    {
        stage: 1,
        question: `Oldd meg: |x + 2| = 0.`,
        answer: -2,
        type: 'multiplication',
        expression: `x = −2`,
    },
    {
        stage: 1,
        question: `Igaz-e minden valós x-re: √(x²) = x?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hamis; √(x²) = |x|`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: √(25x²).
Add meg az értéket x = −2 esetén!`,
        answer: 10,
        type: 'multiplication',
        expression: `5|x|`,
    },
    {
        stage: 1,
        question: `Oldd meg: |3x − 6| = 0.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 1,
        question: `Oldd meg: √(9 − x) = 2.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 1,
        question: `Add meg az f(x) = 1/√(x + 1) értelmezési tartományának véges határpontját!`,
        answer: -1,
        type: 'multiplication',
        expression: `(−1, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az f(x) = √(x² − 9) véges határpontjait!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `(−∞, −3] ∪ [3, ∞)`,
    },
    {
        stage: 1,
        question: `Oldd meg: |x − 1| = |4|.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-3', '5'],
        type: 'multiplication',
        expression: `x = −3 vagy 5`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Oldd meg: |2x − 5| = 3.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['1', '4'],
        type: 'multiplication',
        expression: `x = 1 vagy 4`,
    },
    {
        stage: 2,
        question: `Oldd meg: |3x + 2| = 8.
Add meg a két megoldást 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-3.333', '2'],
        type: 'multiplication',
        expression: `x = 2 vagy −10/3`,
    },
    {
        stage: 2,
        question: `Oldd meg: |x − 4| = 2x + 1.`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 2,
        question: `Oldd meg: |2x + 3| = x + 6.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `x = ±3`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(x + 6) = x.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(x + 2) = x − 2.

Add meg 3 tizedesjeggyel!`,
        answer: 4.562,
        type: 'multiplication',
        expression: `(5 + √17)/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(3x + 4) = x.`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(2x + 3) = x + 1.

Add meg 3 tizedesjeggyel!`,
        answer: 1.414,
        type: 'multiplication',
        expression: `√2`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(5 − x) = x − 1.

Add meg 3 tizedesjeggyel!`,
        answer: 2.562,
        type: 'multiplication',
        expression: `(1 + √17)/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(x²) = 5.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-5', '5'],
        type: 'multiplication',
        expression: `x = ±5`,
    },
    {
        stage: 2,
        question: `Oldd meg: √((x − 2)²) = 4.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-2', '6'],
        type: 'multiplication',
        expression: `|x − 2| = 4`,
    },
    {
        stage: 2,
        question: `Oldd meg: |x + 1| + 2 = 7.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-6', '4'],
        type: 'multiplication',
        expression: `x = 4 vagy −6`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2|x − 3| = 10.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-2', '8'],
        type: 'multiplication',
        expression: `x = −2 vagy 8`,
    },
    {
        stage: 2,
        question: `Oldd meg: |x| − 3 = 2.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-5', '5'],
        type: 'multiplication',
        expression: `x = ±5`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(4x − 3) = 3.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg: √(12 − 2x) = 4.`,
        answer: -2,
        type: 'multiplication',
        expression: `x = −2`,
    },
    {
        stage: 2,
        question: `Oldd meg: |x − 2| = |x + 4|.`,
        answer: -1,
        type: 'multiplication',
        expression: `x = −1`,
    },
    {
        stage: 2,
        question: `Oldd meg: |2x − 1| = |x + 5|.
Add meg a két megoldást 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-1.333', '6'],
        type: 'multiplication',
        expression: `x = 6 vagy −4/3`,
    },
    {
        stage: 2,
        question: `Add meg az f(x) = √((x − 1)(x + 4)) véges határpontjait!`,
        answer: 2,
        expectedSet: ['-4', '1'],
        type: 'multiplication',
        expression: `(−∞, −4] ∪ [1, ∞)`,
    },
    {
        stage: 2,
        question: `Add meg az f(x) = √(x − 2) / (x − 5) véges határpontjait!`,
        answer: 2,
        expectedSet: ['2', '5'],
        type: 'multiplication',
        expression: `[2, 5) ∪ (5, ∞)`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Oldd meg: |x − 2| + |x + 1| = 5.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-2', '3'],
        type: 'multiplication',
        expression: `x = −2 vagy 3`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x − 4| + |x − 1| = 7.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '6'],
        type: 'multiplication',
        expression: `x = −1 vagy 6`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x + 3| − |x − 1| = 2.`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x − 5| − |x + 1| = −2.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 3,
        question: `Oldd meg: ||x| − 3| = 1.
Add meg a négy megoldást!`,
        answer: 4,
        expectedSet: ['-4', '-2', '2', '4'],
        type: 'multiplication',
        expression: `x = ±2, ±4`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x − |x − 2|| = 2.
Add meg a véges (izolált) megoldást! (A többi: x ≥ 2.)`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0 vagy x ≥ 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 1) + √(x − 3) = 4.`,
        answer: 5.25,
        type: 'multiplication',
        expression: `x = 21/4`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 4) − √x = 2.`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 5) + √(x − 4) = 5.`,
        answer: 6.56,
        type: 'multiplication',
        expression: `x = 164/25`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(2x + 3) = √(x + 7).`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 6) = √(2x − 1) + 1.

Add meg 3 tizedesjeggyel!`,
        answer: 2.254,
        type: 'multiplication',
        expression: `10 − 2√15`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 2) = 3 − √(x − 2).

Add meg 3 tizedesjeggyel!`,
        answer: 2.694,
        type: 'multiplication',
        expression: `97/36`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x² − 5x + 6) = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['2', '3'],
        type: 'multiplication',
        expression: `x = 2 vagy 3`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x² − 6x + 9) = x − 1.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: √((x + 1)²) = 2x − 1.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x − 1| + |x − 3| = 2.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `[1, 3]`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x + 2| + |x − 4| = 6.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-2', '4'],
        type: 'multiplication',
        expression: `[−2, 4]`,
    },
    {
        stage: 3,
        question: `Oldd meg: |2x − 3| + |2x + 1| = 8.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1.5', '2.5'],
        type: 'multiplication',
        expression: `x = −3/2 vagy 5/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 8) + √(8 − x) = 4.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-8', '8'],
        type: 'multiplication',
        expression: `x = ±8`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 5) = |x − 1|.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '4'],
        type: 'multiplication',
        expression: `x = 4 vagy −1`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Oldd meg: |x| < 4.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-4', '4'],
        type: 'multiplication',
        expression: `(−4, 4)`,
    },
    {
        stage: 4,
        question: `Oldd meg: |x − 3| ≤ 5.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-2', '8'],
        type: 'multiplication',
        expression: `[−2, 8]`,
    },
    {
        stage: 4,
        question: `Oldd meg: |2x + 1| > 7.
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['-4', '3'],
        type: 'multiplication',
        expression: `(−∞, −4) ∪ (3, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: |3x − 6| ≥ 9.
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['-1', '5'],
        type: 'multiplication',
        expression: `(−∞, −1] ∪ [5, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: |x + 2| < |x − 4|.
Add meg a véges határpontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `x < 1`,
    },
    {
        stage: 4,
        question: `Oldd meg: |2x − 1| ≤ |x + 5|.
Add meg a két határpontot 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-1.333', '6'],
        type: 'multiplication',
        expression: `[−4/3, 6]`,
    },
    {
        stage: 4,
        question: `Oldd meg: ||x| − 3| ≤ 1.
Add meg a négy határpontot!`,
        answer: 4,
        expectedSet: ['-4', '-2', '2', '4'],
        type: 'multiplication',
        expression: `[−4, −2] ∪ [2, 4]`,
    },
    {
        stage: 4,
        question: `Oldd meg: |x − 1| + |x + 1| ≤ 4.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `[−2, 2]`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x + 1) < 3.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-1', '8'],
        type: 'multiplication',
        expression: `[−1, 8)`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(2x − 3) ≤ 5.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['1.5', '14'],
        type: 'multiplication',
        expression: `[3/2, 14]`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(7 − x) > 2.
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `x < 3`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x − 2) ≥ 4.
Add meg a véges határpontot!`,
        answer: 18,
        type: 'multiplication',
        expression: `[18, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x + 4) ≤ x.
Add meg a véges határpontot 3 tizedesjeggyel!`,
        answer: 2.562,
        type: 'multiplication',
        expression: `[(1 + √17)/2, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x + 6) > x.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-6', '3'],
        type: 'multiplication',
        expression: `[−6, 3)`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(9 − x²) ≥ 0.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `[−3, 3]`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x² − 4) < 3.
Add meg a pozitív külső határpontot 3 tizedesjeggyel!`,
        answer: 3.606,
        type: 'multiplication',
        expression: `(−√13, −2] ∪ [2, √13)`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x + 3) ≤ √(2x + 1).
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `[2, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(5 − x) > √(x − 1).
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `[1, 3)`,
    },
    {
        stage: 4,
        question: `Hány egész megoldása van: √(x + 4) < 5?`,
        answer: 25,
        type: 'multiplication',
        expression: `−4, …, 20 → 25`,
    },
    {
        stage: 4,
        question: `Hány pozitív egész megoldása van: |2x − 7| ≤ 9?`,
        answer: 8,
        type: 'multiplication',
        expression: `1, …, 8`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Oldd meg: √(3x + 1) = √(x + 1) + 2.`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(3x + 7) = √(x + 1) + 2.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '3'],
        type: 'multiplication',
        expression: `x = −1 vagy 3`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 4) + √x = 4.`,
        answer: 2.25,
        type: 'multiplication',
        expression: `x = 9/4`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 12) − √x = 2.`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 9) = √(x + 4) + 1.`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 9) + √x = 9.`,
        answer: 16,
        type: 'multiplication',
        expression: `x = 16`,
    },
    {
        stage: 5,
        question: `Oldd meg: |x − |x − 4|| = 2x − 1.`,
        answer: 1.25,
        type: 'multiplication',
        expression: `x = 5/4`,
    },
    {
        stage: 5,
        question: `Oldd meg: |2x − |x + 1|| = x + 2.`,
        answer: -0.5,
        type: 'multiplication',
        expression: `x = −1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: ||x − 1| − 2| = 3.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-4', '6'],
        type: 'multiplication',
        expression: `x = −4 vagy 6`,
    },
    {
        stage: 5,
        question: `Oldd meg: |x + 2| = √(x + 8).
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-4', '1'],
        type: 'multiplication',
        expression: `x = 1 vagy −4`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 3) = |x − 1|.
Add meg a két megoldást 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-0.562', '3.562'],
        type: 'multiplication',
        expression: `(3 ± √17)/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(2x + 5) = |x + 1|.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `x = ±2`,
    },
    {
        stage: 5,
        question: `Add meg az f(x) = √(log₂(x − 1)) értelmezési tartományának véges határpontját!`,
        answer: 2,
        type: 'multiplication',
        expression: `[2, ∞)`,
    },
    {
        stage: 5,
        question: `Add meg az f(x) = log₂ √(x + 3) értelmezési tartományának véges határpontját!`,
        answer: -3,
        type: 'multiplication',
        expression: `(−3, ∞)`,
    },
    {
        stage: 5,
        question: `Add meg az f(x) = √(log₂(cos x)) 0-hoz legközelebbi nemnegatív megoldását!`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 2kπ`,
    },
    {
        stage: 5,
        question: `f(x) = log_{√x}(cos² x). Add meg a kizárt pozitív alappontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `x > 0, x ≠ 1, cos x ≠ 0`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 2) = |x|.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '2'],
        type: 'multiplication',
        expression: `x = 2 vagy −1`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(6 − x) = |x − 2|.
Add meg a két megoldást 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-0.562', '3.562'],
        type: 'multiplication',
        expression: `(3 ± √17)/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(4x + 4) = |x + 1|.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '3'],
        type: 'multiplication',
        expression: `x = −1 vagy 3`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 4) + |x − 2| = 6.
Add meg a három megoldást!`,
        answer: 3,
        expectedSet: ['-4', '-3', '5'],
        type: 'multiplication',
        expression: `x = −4, −3, 5`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Mely p-kre van |x − 2| = p-nek pontosan két valós megoldása?
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `p > 0`,
    },
    {
        stage: 6,
        question: `Mely p-kre van |x + 1| = p-nek pontosan egy valós megoldása?`,
        answer: 0,
        type: 'multiplication',
        expression: `p = 0`,
    },
    {
        stage: 6,
        question: `Van-e √(x − p) = 3-nak minden valós p-re megoldása?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 9 + p`,
    },
    {
        stage: 6,
        question: `Határozd meg p-t úgy, hogy √(x + 5) = x − p-nek x = 4 megoldása legyen!`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 1`,
    },
    {
        stage: 6,
        question: `Határozd meg p-t úgy, hogy |2x − p| = 6 egyik megoldása x = 5 legyen.
Add meg a két p-t!`,
        answer: 2,
        expectedSet: ['4', '16'],
        type: 'multiplication',
        expression: `p = 4 vagy 16`,
    },
    {
        stage: 6,
        question: `Mely p-kre értelmezett √(x² − p) minden valós x-re?
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `p ≤ 0`,
    },
    {
        stage: 6,
        question: `Mely p-kre értelmezett √(p − x²) legalább egy valós x-re?
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `p ≥ 0`,
    },
    {
        stage: 6,
        question: `Oldd meg: √(x + 1) + √(9 − x) = 4.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '8'],
        type: 'multiplication',
        expression: `x = 0 vagy 8`,
    },
    {
        stage: 6,
        question: `Oldd meg: √(x + 4) + √(12 − x) = 4√2.`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 6,
        question: `Oldd meg: √(x + 5) − √(x − 4) = 1.`,
        answer: 20,
        type: 'multiplication',
        expression: `x = 20`,
    },
    {
        stage: 6,
        question: `Oldd meg: |x − 1| + |x − 4| = |2x − 5|.
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['1', '4'],
        type: 'multiplication',
        expression: `x ≤ 1 vagy x ≥ 4`,
    },
    {
        stage: 6,
        question: `Oldd meg: |x + 2| + |x − 2| = 2|x| + 4.`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: |x| ≥ x minden valós x-re.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: |x + y| ≤ |x| + |y|.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: √(x²) = |x|.

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Határozd meg az f(x) = |x − a| minimumértékét!`,
        answer: 0,
        type: 'multiplication',
        expression: `min = 0 az x = a helyen`,
    },
    {
        stage: 6,
        question: `Határozd meg az f(x) = √(9 − x²) értékkészletének két határpontját!`,
        answer: 2,
        expectedSet: ['0', '3'],
        type: 'multiplication',
        expression: `[0, 3]`,
    },
    {
        stage: 6,
        question: `Határozd meg az f(x) = |x − 3| + 2 értékkészletének véges határpontját!`,
        answer: 2,
        type: 'multiplication',
        expression: `[2, ∞)`,
    },
    {
        stage: 6,
        question: `Add meg az f(x) = √(log₂(1 + cos x)) alappont-intervallumának jobb határát π együtthatójaként!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `[−π/2, π/2] + 2kπ`,
    },
    {
        stage: 6,
        question: `f(x) = log_{√x}(sin² x). Add meg a kizárt pozitív alappontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `x > 0, x ≠ 1, sin x ≠ 0`,
    },
];
