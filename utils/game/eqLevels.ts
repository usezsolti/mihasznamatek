import type { Question } from './types';

/**
 * Egyenletek, egyenletrendszerek, egyenlőtlenségek — 6×20
 * (Egyenletek__egyenletrendszerek__egyenlőtlenségek.pdf / TeX).
 * 1 Algebrai alapok → 2 Egyenletrendszerek → 3 Speciális egyenletek →
 * 4 Egyenlőtlenségek → 5 Helyettesítés / exp-log-trig → 6 Mesterfok.
 * Egy kártya = egy szám vagy halmaz. Igaz/hamis: 1 / 0.
 */
export const getEquationsPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Oldd meg: 3x − 7 = 11.`,
        answer: 6,
        type: 'multiplication',
        expression: `x = 6`,
    },
    {
        stage: 1,
        question: `Oldd meg: 5 − 2(x − 3) = 13.`,
        answer: -1,
        type: 'multiplication',
        expression: `x = −1`,
    },
    {
        stage: 1,
        question: `Oldd meg: (x − 2)/3 + (x + 1)/2 = 4.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 1,
        question: `Oldd meg: 4(2x − 1) − 3(x + 2) = 5.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 1,
        question: `Oldd meg: x² − 9 = 0.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `x = ±3`,
    },
    {
        stage: 1,
        question: `Oldd meg: x² − 7x + 12 = 0.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['3', '4'],
        type: 'multiplication',
        expression: `x = 3 vagy 4`,
    },
    {
        stage: 1,
        question: `Oldd meg: 2x² − 5x − 3 = 0.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['-0.5', '3'],
        type: 'multiplication',
        expression: `x = −1/2 vagy 3`,
    },
    {
        stage: 1,
        question: `Oldd meg: 3x² + 6x = 0.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['-2', '0'],
        type: 'multiplication',
        expression: `x = 0 vagy −2`,
    },
    {
        stage: 1,
        question: `Oldd meg: (x − 4)(2x + 3) = 0.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['-1.5', '4'],
        type: 'multiplication',
        expression: `x = 4 vagy −3/2`,
    },
    {
        stage: 1,
        question: `Oldd meg: x³ − 4x = 0.
Add meg a három gyököt!`,
        answer: 3,
        expectedSet: ['-2', '0', '2'],
        type: 'multiplication',
        expression: `x = 0, ±2`,
    },
    {
        stage: 1,
        question: `Oldd meg: x³ − 5x² + 6x = 0.
Add meg a három gyököt!`,
        answer: 3,
        expectedSet: ['0', '2', '3'],
        type: 'multiplication',
        expression: `x = 0, 2, 3`,
    },
    {
        stage: 1,
        question: `Oldd meg: 2x³ + x² − 8x − 4 = 0.
Add meg a három gyököt!`,
        answer: 3,
        expectedSet: ['-2', '-0.5', '2'],
        type: 'multiplication',
        expression: `(x² − 4)(2x + 1) = 0`,
    },
    {
        stage: 1,
        question: `Oldd meg, ahol értelmezett: (x + 3)/(x − 2) = 2.`,
        answer: 7,
        type: 'multiplication',
        expression: `x = 7`,
    },
    {
        stage: 1,
        question: `Oldd meg, ahol értelmezett: (2x − 1)/(x + 1) = 3.`,
        answer: -4,
        type: 'multiplication',
        expression: `x = −4`,
    },
    {
        stage: 1,
        question: `Oldd meg: x/4 − (x − 3)/6 = 2.`,
        answer: 18,
        type: 'multiplication',
        expression: `x = 18`,
    },
    {
        stage: 1,
        question: `Oldd meg: (x + 1)² = 16.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['-5', '3'],
        type: 'multiplication',
        expression: `x = 3 vagy −5`,
    },
    {
        stage: 1,
        question: `Oldd meg: (x − 2)² = 3x + 4.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['0', '7'],
        type: 'multiplication',
        expression: `x = 0 vagy 7`,
    },
    {
        stage: 1,
        question: `Oldd meg: 2(x + 3)² = 8.
Add meg a két gyököt!`,
        answer: 2,
        expectedSet: ['-5', '-1'],
        type: 'multiplication',
        expression: `x = −1 vagy −5`,
    },
    {
        stage: 1,
        question: `Oldd meg: x³ + x² − 6x = 0.
Add meg a három gyököt!`,
        answer: 3,
        expectedSet: ['-3', '0', '2'],
        type: 'multiplication',
        expression: `x = −3, 0, 2`,
    },
    {
        stage: 1,
        question: `Igazold, hogy −2, 0 és 3 gyöke x³ − x² − 6x = 0-nak.
Add meg a három gyököt!`,
        answer: 3,
        expectedSet: ['-2', '0', '3'],
        type: 'multiplication',
        expression: `x(x − 3)(x + 2) = 0`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Oldd meg: x + y = 11, x − y = 3.
Add meg x-et!`,
        answer: 7,
        type: 'multiplication',
        expression: `(7, 4)`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2x + 3y = 13, 3x − y = 7.
Add meg x-et 3 tizedesjeggyel!`,
        answer: 3.091,
        type: 'multiplication',
        expression: `x = 34/11`,
    },
    {
        stage: 2,
        question: `Oldd meg: 4x − y = 9, 2x + 5y = 1.
Add meg x-et 3 tizedesjeggyel!`,
        answer: 2.091,
        type: 'multiplication',
        expression: `x = 23/11`,
    },
    {
        stage: 2,
        question: `Oldd meg: (x + 1)/2 + (y − 1)/3 = 4, x − y = 1.
Add meg x-et!`,
        answer: 5,
        type: 'multiplication',
        expression: `(5, 4)`,
    },
    {
        stage: 2,
        question: `Oldd meg: x/3 + y/2 = 4, x + y = 10.
Add meg x-et!`,
        answer: 6,
        type: 'multiplication',
        expression: `(6, 4)`,
    },
    {
        stage: 2,
        question: `Oldd meg: x + y = 7, xy = 12.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['3', '4'],
        type: 'multiplication',
        expression: `(3, 4) vagy (4, 3)`,
    },
    {
        stage: 2,
        question: `Oldd meg: x − y = 1, xy = 6.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['-2', '3'],
        type: 'multiplication',
        expression: `(3, 2) vagy (−2, −3)`,
    },
    {
        stage: 2,
        question: `Oldd meg: x² + y² = 25, x + y = 7.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['3', '4'],
        type: 'multiplication',
        expression: `(3, 4) vagy (4, 3)`,
    },
    {
        stage: 2,
        question: `Oldd meg: x² − y² = 15, x − y = 3.
Add meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `(4, 1)`,
    },
    {
        stage: 2,
        question: `Oldd meg: y = 2√x, x + y = 8 (x ≥ 0).
Add meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `(4, 4)`,
    },
    {
        stage: 2,
        question: `Oldd meg: y = √(x + 5), y = x − 1.
Add meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `(4, 3)`,
    },
    {
        stage: 2,
        question: `Oldd meg: 1/x + 1/y = 5/6, x + y = 5.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['2', '3'],
        type: 'multiplication',
        expression: `(2, 3) vagy (3, 2)`,
    },
    {
        stage: 2,
        question: `Oldd meg: (x + 1)/(x − 1) = 3, y = 2x + 1.
Add meg x-et!`,
        answer: 2,
        type: 'multiplication',
        expression: `(2, 5)`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2x − y = 1, x² + y² = 13.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['-1.2', '2'],
        type: 'multiplication',
        expression: `x = 2 vagy −6/5`,
    },
    {
        stage: 2,
        question: `Oldd meg: x + y = 4, x² + y² = 10.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `(1, 3) vagy (3, 1)`,
    },
    {
        stage: 2,
        question: `Oldd meg pozitív x, y-ra: x + y = 10, √x + √y = √18.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['2', '8'],
        type: 'multiplication',
        expression: `(2, 8) vagy (8, 2)`,
    },
    {
        stage: 2,
        question: `Oldd meg: x + y = 6, √x + √y = √10 (x, y ≥ 0).
Add meg a két lehetséges x-et 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['0.764', '5.236'],
        type: 'multiplication',
        expression: `3 ± √5`,
    },
    {
        stage: 2,
        question: `Határozd meg x/y értékét, ha (3x + 2y)/(5x + 2y) = 5/7.`,
        answer: 1,
        type: 'multiplication',
        expression: `x/y = 1`,
    },
    {
        stage: 2,
        question: `Hány pozitív egész (x, y) párra teljesül x/12 = 2/y?`,
        answer: 8,
        type: 'multiplication',
        expression: `xy = 24 → 8 pár`,
    },
    {
        stage: 2,
        question: `Hány pozitív egész (x, y) párra teljesül x/10 = 3/y?`,
        answer: 8,
        type: 'multiplication',
        expression: `xy = 30 → 8 pár`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Oldd meg: |x − 4| = 3.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['1', '7'],
        type: 'multiplication',
        expression: `x = 1 vagy 7`,
    },
    {
        stage: 3,
        question: `Oldd meg: |2x + 1| = 5.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-3', '2'],
        type: 'multiplication',
        expression: `x = 2 vagy −3`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x − 2| = x + 4.`,
        answer: -1,
        type: 'multiplication',
        expression: `x = −1`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x + 1| = 2x − 1.`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 3,
        question: `Oldd meg a [0, 8] alaphalmazon: |5 − |x − 3|| = 2.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '6'],
        type: 'multiplication',
        expression: `x = 0 vagy 6`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 5) = 4.`,
        answer: 11,
        type: 'multiplication',
        expression: `x = 11`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(2x − 1) = x − 1.

Add meg 3 tizedesjeggyel!`,
        answer: 3.414,
        type: 'multiplication',
        expression: `x = 2 + √2`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 6) = x.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 10) − √(x + 1) = 1.`,
        answer: 15,
        type: 'multiplication',
        expression: `x = 15`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(2x + 3) = √(x + 8) − 1.

Add meg 3 tizedesjeggyel!`,
        answer: 0.254,
        type: 'multiplication',
        expression: `8 − 2√15`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x + 4) + √x = 4.`,
        answer: 2.25,
        type: 'multiplication',
        expression: `x = 9/4`,
    },
    {
        stage: 3,
        question: `Oldd meg: (x − 3)/(x + 2) = 2.`,
        answer: -7,
        type: 'multiplication',
        expression: `x = −7`,
    },
    {
        stage: 3,
        question: `Oldd meg: (x + 1)/(x − 2) + 3/(x − 2) = 2.`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8`,
    },
    {
        stage: 3,
        question: `Oldd meg: 1/(x − 1) + 1/(x + 1) = 3/4.
Add meg a két megoldást 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-0.333', '3'],
        type: 'multiplication',
        expression: `x = 3 vagy −1/3`,
    },
    {
        stage: 3,
        question: `Oldd meg: x/(x − 2) = 4/(x + 1).
Hány valós megoldása van?`,
        answer: 0,
        type: 'multiplication',
        expression: `Nincs valós megoldás`,
    },
    {
        stage: 3,
        question: `Oldd meg: (x² − 9)/(x − 3) = 7 (ahol értelmezett).`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Oldd meg: (x² − 4)/(x + 2) = x − 2.
Add meg a kizárt pontot!`,
        answer: -2,
        type: 'multiplication',
        expression: `minden x ≠ −2`,
    },
    {
        stage: 3,
        question: `Oldd meg: √(x − 1) + 1/√(x − 1) = 5/2.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['1.25', '5'],
        type: 'multiplication',
        expression: `x = 5 vagy 5/4`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x − 1| + |x + 2| = 7.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-4', '3'],
        type: 'multiplication',
        expression: `x = −4 vagy 3`,
    },
    {
        stage: 3,
        question: `Oldd meg: |x − |x − 3|| = 1.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['1', '2'],
        type: 'multiplication',
        expression: `x = 1 vagy 2`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Oldd meg: 3x − 7 ≤ 11.
Add meg a véges határpontot!`,
        answer: 6,
        type: 'multiplication',
        expression: `x ≤ 6`,
    },
    {
        stage: 4,
        question: `Oldd meg: 5 − 2x > 9.
Add meg a véges határpontot!`,
        answer: -2,
        type: 'multiplication',
        expression: `x < −2`,
    },
    {
        stage: 4,
        question: `Oldd meg: (x − 2)(x + 3) ≥ 0.
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['-3', '2'],
        type: 'multiplication',
        expression: `(−∞, −3] ∪ [2, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: x² − 5x + 6 < 0.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['2', '3'],
        type: 'multiplication',
        expression: `(2, 3)`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2x² + x − 3 ≤ 0.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-1.5', '1'],
        type: 'multiplication',
        expression: `[−3/2, 1]`,
    },
    {
        stage: 4,
        question: `Oldd meg: (x − 4)/(x − 6) ≤ −1.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['5', '6'],
        type: 'multiplication',
        expression: `[5, 6)`,
    },
    {
        stage: 4,
        question: `Oldd meg: (x + 2)/(x − 1) > 0.
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['-2', '1'],
        type: 'multiplication',
        expression: `(−∞, −2) ∪ (1, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: (x² − 9)/(x − 2) ≥ 0.
Add meg a három véges határpontot!`,
        answer: 3,
        expectedSet: ['-3', '2', '3'],
        type: 'multiplication',
        expression: `[−3, 2) ∪ [3, ∞)`,
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
        question: `Oldd meg: |2x + 1| > 3.
Add meg a két véges határpontot!`,
        answer: 2,
        expectedSet: ['-2', '1'],
        type: 'multiplication',
        expression: `(−∞, −2) ∪ (1, ∞)`,
    },
    {
        stage: 4,
        question: `Oldd meg: |x − 2| ≥ x.
Add meg a véges határpontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `x ≤ 1`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x + 1) ≤ 3.
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['-1', '8'],
        type: 'multiplication',
        expression: `[−1, 8]`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(2x − 3) > 1.
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `x > 2`,
    },
    {
        stage: 4,
        question: `Oldd meg: √(x + 4) ≥ x.
Add meg a két határpontot 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-4', '2.562'],
        type: 'multiplication',
        expression: `[−4, (1 + √17)/2]`,
    },
    {
        stage: 4,
        question: `Oldd meg a [4, 6] alaphalmazon: 2 cos² x + cos x − 1 ≤ 0.
Add meg a jobb határpontot 3 tizedesjeggyel!`,
        answer: 5.236,
        type: 'multiplication',
        expression: `[4, 5π/3]`,
    },
    {
        stage: 4,
        question: `Oldd meg a [0, 2π] alaphalmazon: 2 sin x − 1 ≥ 0.
Add meg a két határpontot fokban!`,
        answer: 2,
        expectedSet: ['30', '150'],
        type: 'multiplication',
        expression: `[π/6, 5π/6]`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2ˣ ≤ 8.
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≤ 3`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₂(x − 1) > 2.
Add meg a véges határpontot!`,
        answer: 5,
        type: 'multiplication',
        expression: `x > 5`,
    },
    {
        stage: 4,
        question: `Oldd meg: log₃(x² − 1) ≤ 2.
Add meg a pozitív külső határpontot 3 tizedesjeggyel!`,
        answer: 3.162,
        type: 'multiplication',
        expression: `[−√10, −1) ∪ (1, √10]`,
    },
    {
        stage: 4,
        question: `Oldd meg a [−5, 5] alaphalmazon: (x² − 4)/(x + 1) < 0.
Add meg a négy véges határpontot!`,
        answer: 4,
        expectedSet: ['-5', '-2', '-1', '2'],
        type: 'multiplication',
        expression: `[−5, −2) ∪ (−1, 2)`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Oldd meg: x⁴ − 5x² + 4 = 0.
Add meg a négy gyököt!`,
        answer: 4,
        expectedSet: ['-2', '-1', '1', '2'],
        type: 'multiplication',
        expression: `x = ±1, ±2`,
    },
    {
        stage: 5,
        question: `Oldd meg: x⁶ − 5x³ + 4 = 0.
Add meg a két valós gyököt 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['1', '1.587'],
        type: 'multiplication',
        expression: `x = 1 vagy ∛4`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2^{2x} − 5 · 2ˣ + 4 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `x = 0 vagy 2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 9 · 9ˣ + 15 · 3ˣ − 6 = 0.`,
        answer: -1,
        type: 'multiplication',
        expression: `x = −1`,
    },
    {
        stage: 5,
        question: `Oldd meg: 5^{2x} − 6 · 5ˣ + 5 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `x = 0 vagy 1`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₂(x + 3) + log₂(x − 1) = 3.

Add meg 3 tizedesjeggyel!`,
        answer: 2.464,
        type: 'multiplication',
        expression: `x = −1 + 2√3`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₃(x + 8) + log₃(x − 2) − log₃(x + 4) = 1.`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 5,
        question: `Oldd meg: (log₂ x)² − 5 log₂ x + 6 = 0.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['4', '8'],
        type: 'multiplication',
        expression: `x = 4 vagy 8`,
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
        question: `Oldd meg: sin² x = 3 cos² x.
Add meg a legkisebb pozitív megoldást fokban!`,
        answer: 60,
        type: 'multiplication',
        expression: `tan² x = 3`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2 cos² x − 5 cos x − 3 = 0.
Add meg a [0°, 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['120', '240'],
        type: 'multiplication',
        expression: `cos x = −1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2 sin² x + sin x − 1 = 0.
Add meg a [0°, 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '150', '270'],
        type: 'multiplication',
        expression: `sin x = 1/2 vagy −1`,
    },
    {
        stage: 5,
        question: `Oldd meg: sin(2x − π/3) = 1/2.
Add meg a két legkisebb pozitív megoldást fokban!`,
        answer: 2,
        expectedSet: ['45', '105'],
        type: 'multiplication',
        expression: `x = π/4 vagy 7π/12`,
    },
    {
        stage: 5,
        question: `Oldd meg: cos 2x = sin x.
Add meg a [0°, 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '150', '270'],
        type: 'multiplication',
        expression: `sin x = 1/2 vagy −1`,
    },
    {
        stage: 5,
        question: `Oldd meg: sin 2x = cos x.
Add meg a [0°, 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '90', '150', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy sin x = 1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2ˣ + 2^{−x} = 5/2.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 5,
        question: `Oldd meg: 3ˣ + 3^{−x} = 10/3.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 5,
        question: `Oldd meg: log₅(x + 4) − log₅(x − 1) = 1.`,
        answer: 2.25,
        type: 'multiplication',
        expression: `x = 9/4`,
    },
    {
        stage: 5,
        question: `Oldd meg: √(x + 1) = log₂(x + 1).
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['3', '15'],
        type: 'multiplication',
        expression: `x = 3 vagy 15`,
    },
    {
        stage: 5,
        question: `Hány valós megoldása van: 2 · 16ˣ + 7 · 4ˣ + 3 = 0?`,
        answer: 0,
        type: 'multiplication',
        expression: `Nincs valós megoldás`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Mely p-kre van x² − (p + 1)x + p = 0-nak két különböző valós gyöke?
Add meg a kizárt p-t!`,
        answer: 1,
        type: 'multiplication',
        expression: `p ≠ 1`,
    },
    {
        stage: 6,
        question: `Határozd meg p-t úgy, hogy x² − 6x + p = 0-nak pontosan egy valós gyöke legyen!`,
        answer: 9,
        type: 'multiplication',
        expression: `p = 9`,
    },
    {
        stage: 6,
        question: `Határozd meg p-t úgy, hogy 2^{2x} − p · 2ˣ + 4 = 0-nak pontosan egy valós megoldása legyen!`,
        answer: 4,
        type: 'multiplication',
        expression: `p = 4`,
    },
    {
        stage: 6,
        question: `Mely p-kre van (log₂ x)² − p log₂ x + 1 = 0-nak két különböző pozitív megoldása?
Add meg a pozitív határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `|p| > 2`,
    },
    {
        stage: 6,
        question: `Oldd meg a [1, 8] alaphalmazon: |x − 5| = 2x − 4.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 6,
        question: `Oldd meg a [0, 10] alaphalmazon: √(2x + 3) = x.`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 6,
        question: `Oldd meg pozitív egész párokra: xy = 36, x + y = 13.
Add meg a két lehetséges x-et!`,
        answer: 2,
        expectedSet: ['4', '9'],
        type: 'multiplication',
        expression: `(4, 9) vagy (9, 4)`,
    },
    {
        stage: 6,
        question: `Hány pozitív egész (x, y) párra teljesül x/8 = 1,5 / y?`,
        answer: 6,
        type: 'multiplication',
        expression: `xy = 12 → 6 pár`,
    },
    {
        stage: 6,
        question: `Határozd meg a pozitív egész n-et, amelyre (n + 4)! / n! = 24(n + 1)(n + 3).`,
        answer: 2,
        type: 'multiplication',
        expression: `n = 2`,
    },
    {
        stage: 6,
        question: `Hány egész n-re teljesül n² − 5n + 10 = 26?`,
        answer: 0,
        type: 'multiplication',
        expression: `Nincs egész megoldás`,
    },
    {
        stage: 6,
        question: `Hány valós megoldása van: 3x⁴ + 2x² + 5 = 0?`,
        answer: 0,
        type: 'multiplication',
        expression: `Nincs valós megoldás`,
    },
    {
        stage: 6,
        question: `Igazold: x³ − 4x² − x + 4 = 0 gyökei −1, 1, 4.
Add meg a három gyököt!`,
        answer: 3,
        expectedSet: ['-1', '1', '4'],
        type: 'multiplication',
        expression: `(x − 4)(x − 1)(x + 1)`,
    },
    {
        stage: 6,
        question: `Oldd meg: (x − 2)/(x + 1) = (x + 4)/(x − 3).`,
        answer: 0.2,
        type: 'multiplication',
        expression: `x = 1/5`,
    },
    {
        stage: 6,
        question: `Oldd meg: √(x + 4) + √(x − 1) = 5.`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 6,
        question: `Oldd meg: |x − 2| + |2x + 1| = 7.
Add meg a két megoldást 3 tizedesjeggyel!`,
        answer: 2,
        expectedSet: ['-2', '2.667'],
        type: 'multiplication',
        expression: `x = −2 vagy 8/3`,
    },
    {
        stage: 6,
        question: `Oldd meg: log₂(x − 1) + log₂(x + 3) = 4.

Add meg 3 tizedesjeggyel!`,
        answer: 3.472,
        type: 'multiplication',
        expression: `x = −1 + 2√5`,
    },
    {
        stage: 6,
        question: `Oldd meg: 2^{x+1} + 2^{1−x} = 5.
Add meg a két megoldást!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `x = ±1`,
    },
    {
        stage: 6,
        question: `Oldd meg: 2 sin² x − 3 sin x + 1 = 0.
Add meg a [0°, 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '90', '150'],
        type: 'multiplication',
        expression: `sin x = 1 vagy 1/2`,
    },
    {
        stage: 6,
        question: `Mely p-kre esik |x − p| = 3 mindkét megoldása a [0, 10] intervallumba?
Add meg a két határpontot!`,
        answer: 2,
        expectedSet: ['3', '7'],
        type: 'multiplication',
        expression: `3 ≤ p ≤ 7`,
    },
    {
        stage: 6,
        question: `P(n) = (n² − 5n + 10)/2. Van-e n ≥ 3 egész, amelyre P(n) = 35?

Add meg 1-et, ha van, 0-t, ha nincs!`,
        answer: 0,
        type: 'multiplication',
        expression: `n² − 5n − 60 = 0, nem egész`,
    },
];
