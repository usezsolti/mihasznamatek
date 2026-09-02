import type { Question } from './types';

/**
 * Egyszerűsítések és átalakítások — 6 szint × 20 feladat (Egyszerűsítések.pdf).
 * 1 Alapműveletek → 2 Azonosságok → 3 Algebrai törtek →
 * 4 Gyök / racionális kitevő → 5 Összetett → 6 Mesterfok.
 * Egy kártya = egy szám. Algebrai alak: helyettesítési érték
 * (vagy kitevő / √ együttható). Igen/hamis: 1 / 0.
 */
export const getEgyszerusitesPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Egyszerűsítsd: 3x + 5x − 2x.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 12,
        type: 'multiplication',
        expression: `6x, x=2 → 12`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: 7a − 3a + 4 − 9.
Add meg az egyszerűsített alak értékét a = 3 esetén!`,
        answer: 7,
        type: 'multiplication',
        expression: `4a − 5, a=3 → 7`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: 4x² + 3x − 2x² + 5x.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 24,
        type: 'multiplication',
        expression: `2x² + 8x, x=2 → 24`,
    },
    {
        stage: 1,
        question: `Bontsd fel és egyszerűsítsd: 3(x + 4) − 2x.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 14,
        type: 'multiplication',
        expression: `x + 12, x=2 → 14`,
    },
    {
        stage: 1,
        question: `Bontsd fel: −2(3a − 5).
Add meg az egyszerűsített alak értékét a = 2 esetén!`,
        answer: -2,
        type: 'multiplication',
        expression: `−6a + 10, a=2 → −2`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: (x + 3) + (2x − 7).
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `3x − 4, x=2 → 2`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: (5x − 2) − (3x + 4).
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: -2,
        type: 'multiplication',
        expression: `2x − 6, x=2 → −2`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: a³ · a⁵.
Add meg a kitevőt!`,
        answer: 8,
        type: 'multiplication',
        expression: `a⁸`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd, ha b ≠ 0: b⁹ / b⁴.
Add meg a kitevőt!`,
        answer: 5,
        type: 'multiplication',
        expression: `b⁵`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: (c³)⁴.
Add meg a kitevőt!`,
        answer: 12,
        type: 'multiplication',
        expression: `c¹²`,
    },
    {
        stage: 1,
        question: `Döntsd el: igaz vagy hamis minden valós x-re? x² + x² = x⁴.

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hamis (2x² ≠ x⁴)`,
    },
    {
        stage: 1,
        question: `Döntsd el: igaz vagy hamis minden valós a-ra? a³ · a⁴ = a⁷.

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 1,
        question: `Döntsd el: igaz vagy hamis minden valós b-re? (b²)³ = b⁵.

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hamis (b⁶ ≠ b⁵)`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: 5x − 2(3x − 4).
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 6,
        type: 'multiplication',
        expression: `−x + 8, x=2 → 6`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: 4(2a − 1) − 3(a + 2).
Add meg az egyszerűsített alak értékét a = 3 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `5a − 10, a=3 → 5`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: 2x² − 3x + 5 + x² + 4x − 8.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 11,
        type: 'multiplication',
        expression: `3x² + x − 3, x=2 → 11`,
    },
    {
        stage: 1,
        question: `A 2x² + 5x − 3 = 0 egyenlet diszkriminánsát számítsd ki!`,
        answer: 49,
        type: 'multiplication',
        expression: `D = 25 − 4·2·(−3) = 49`,
    },
    {
        stage: 1,
        question: `Igaz az azonosság: aᵐ · aⁿ = aᵐ⁺ⁿ.
Ha m = 2 és n = 3, mennyi a kitevő?`,
        answer: 5,
        type: 'multiplication',
        expression: `m + n = 5`,
    },
    {
        stage: 1,
        question: `Határozd meg, x-nek hányadik hatványa: ((x³)⁴ · x²) / x⁵, x ≠ 0.`,
        answer: 9,
        type: 'multiplication',
        expression: `x¹² · x² / x⁵ = x⁹`,
    },
    {
        stage: 1,
        question: `Határozd meg, 2-nek hányadik hatványa: (2⁷ · (2³)²) / 2⁴.`,
        answer: 9,
        type: 'multiplication',
        expression: `2⁷ · 2⁶ / 2⁴ = 2⁹`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Bontsd fel: (x + 5)².
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 49,
        type: 'multiplication',
        expression: `x² + 10x + 25, x=2 → 49`,
    },
    {
        stage: 2,
        question: `Bontsd fel: (x − 4)².
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 4,
        type: 'multiplication',
        expression: `x² − 8x + 16, x=2 → 4`,
    },
    {
        stage: 2,
        question: `Bontsd fel: (x + 3)(x − 3).
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: -5,
        type: 'multiplication',
        expression: `x² − 9, x=2 → −5`,
    },
    {
        stage: 2,
        question: `Egyszerűsítsd: (x + 2)² − (x − 2)².
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 16,
        type: 'multiplication',
        expression: `8x, x=2 → 16`,
    },
    {
        stage: 2,
        question: `Bontsd fel: (2x + 1)².
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 25,
        type: 'multiplication',
        expression: `4x² + 4x + 1, x=2 → 25`,
    },
    {
        stage: 2,
        question: `Bontsd fel: (3a − 2)².
Add meg az egyszerűsített alak értékét a = 2 esetén!`,
        answer: 16,
        type: 'multiplication',
        expression: `9a² − 12a + 4, a=2 → 16`,
    },
    {
        stage: 2,
        question: `Alakítsd szorzattá: x² − 25.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: -21,
        type: 'multiplication',
        expression: `(x − 5)(x + 5), x=2 → −21`,
    },
    {
        stage: 2,
        question: `Alakítsd szorzattá: x² + 8x + 16.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 36,
        type: 'multiplication',
        expression: `(x + 4)², x=2 → 36`,
    },
    {
        stage: 2,
        question: `Alakítsd szorzattá: 4a² − 12a + 9.
Add meg az egyszerűsített alak értékét a = 2 esetén!`,
        answer: 1,
        type: 'multiplication',
        expression: `(2a − 3)², a=2 → 1`,
    },
    {
        stage: 2,
        question: `Emelj ki közös tényezőt: 6x³ − 9x².
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 12,
        type: 'multiplication',
        expression: `3x²(2x − 3), x=2 → 12`,
    },
    {
        stage: 2,
        question: `Emelj ki közös tényezőt: 12a⁴b² + 8a³b³.
Add meg az egyszerűsített alak értékét a = 1, b = 1 esetén!`,
        answer: 20,
        type: 'multiplication',
        expression: `4a³b²(3a + 2b), a=b=1 → 20`,
    },
    {
        stage: 2,
        question: `Egyszerűsítsd: (x − 3)² + (x − 4)(x + 4) − 2x² + 7x.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: -5,
        type: 'multiplication',
        expression: `x − 7, x=2 → −5`,
    },
    {
        stage: 2,
        question: `Egyszerűsítsd: (a + 2)(a − 2) + (a + 3)².
Add meg az egyszerűsített alak értékét a = 2 esetén!`,
        answer: 25,
        type: 'multiplication',
        expression: `2a² + 6a + 5, a=2 → 25`,
    },
    {
        stage: 2,
        question: `Egyszerűsítsd: (2x − 3)(2x + 3) − (x − 1)².
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 6,
        type: 'multiplication',
        expression: `3x² + 2x − 10, x=2 → 6`,
    },
    {
        stage: 2,
        question: `Alakítsd szorzattá: x² − 7x.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: -10,
        type: 'multiplication',
        expression: `x(x − 7), x=2 → −10`,
    },
    {
        stage: 2,
        question: `Alakítsd szorzattá: 3a² + 12a.
Add meg az egyszerűsített alak értékét a = 2 esetén!`,
        answer: 36,
        type: 'multiplication',
        expression: `3a(a + 4), a=2 → 36`,
    },
    {
        stage: 2,
        question: `Alakítsd szorzattá: x² − 6x + 9.
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 1,
        type: 'multiplication',
        expression: `(x − 3)², x=2 → 1`,
    },
    {
        stage: 2,
        question: `Alakítsd szorzattá: 9y² − 16.
Add meg az egyszerűsített alak értékét y = 2 esetén!`,
        answer: 20,
        type: 'multiplication',
        expression: `(3y − 4)(3y + 4), y=2 → 20`,
    },
    {
        stage: 2,
        question: `Egyszerűsítsd: (2x + 5)² − (2x − 5)².
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 80,
        type: 'multiplication',
        expression: `40x, x=2 → 80`,
    },
    {
        stage: 2,
        question: `Egyszerűsítsd: (a − 1)(a + 1) + (a + 4)² − 2a².
Add meg az egyszerűsített alak értékét a = 2 esetén!`,
        answer: 31,
        type: 'multiplication',
        expression: `8a + 15, a=2 → 31`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Egyszerűsítsd, ahol értelmezett: (x² − 9) / (x − 3).
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 8,
        type: 'multiplication',
        expression: `x + 3, x=5 → 8`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² − 6x + 9) / (x − 3).
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `x − 3, x=5 → 2`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² − 4) / (x + 2).
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 3,
        type: 'multiplication',
        expression: `x − 2, x=5 → 3`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² + 5x) / x.
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 10,
        type: 'multiplication',
        expression: `x + 5, x=5 → 10`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (3a² + 6a) / (3a).
Add meg az egyszerűsített alak értékét a = 3 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `a + 2, a=3 → 5`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² − 16) / (x² − 8x + 16).
Add meg az egyszerűsített alak értékét x = 6 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `(x + 4)/(x − 4), x=6 → 5`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² − 1) / (x² + x).
Add meg az egyszerűsített alak értékét x = 5 esetén!

Add meg 3 tizedesjeggyel!`,
        answer: 0.8,
        type: 'multiplication',
        expression: `(x − 1)/x, x=5 → 0,8`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² + 6x + 9) / (x² − 9).
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 4,
        type: 'multiplication',
        expression: `(x + 3)/(x − 3), x=5 → 4`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (2x² − 8) / (x² − 4x + 4).
Add meg az egyszerűsített alak értékét x = 4 esetén!`,
        answer: 6,
        type: 'multiplication',
        expression: `2(x + 2)/(x − 2), x=4 → 6`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (a² − b²) / (a − b).
Add meg az egyszerűsített alak értékét a = 3, b = 1 esetén!`,
        answer: 4,
        type: 'multiplication',
        expression: `a + b, a=3, b=1 → 4`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x / (x + 1)) · ((x² − 1) / x²).
Add meg az egyszerűsített alak értékét x = 5 esetén!

Add meg 3 tizedesjeggyel!`,
        answer: 0.8,
        type: 'multiplication',
        expression: `(x − 1)/x, x=5 → 0,8`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: ((a² − 4) / a) · (a / (a + 2)).
Add meg az egyszerűsített alak értékét a = 3 esetén!`,
        answer: 1,
        type: 'multiplication',
        expression: `a − 2, a=3 → 1`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: ((x² − 9) / x) ÷ ((x − 3) / x).
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 8,
        type: 'multiplication',
        expression: `x + 3, x=5 → 8`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: ((a² − a) / (a + 1)) ÷ (a / (a + 1)).
Add meg az egyszerűsített alak értékét a = 3 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `a − 1, a=3 → 2`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² − 4x + 4) / (x² − 4).
Add meg az egyszerűsített alak értékét x = 4 esetén!

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `(x − 2)/(x + 2), x=4 → 1/3`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x² − 2x) / (x² − 4x + 4).
Add meg az egyszerűsített alak értékét x = 4 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `x/(x − 2), x=4 → 2`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (9a² − 25) / (3a − 5).
Add meg az egyszerűsített alak értékét a = 3 esetén!`,
        answer: 14,
        type: 'multiplication',
        expression: `3a + 5, a=3 → 14`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (4x² − 12x + 9) / (2x − 3).
Add meg az egyszerűsített alak értékét x = 4 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `2x − 3, x=4 → 5`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x³ − x) / (x² − 1).
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `x, x=5 → 5`,
    },
    {
        stage: 3,
        question: `Egyszerűsítsd: (x³ − 4x) / (x² − 4).
Add meg az egyszerűsített alak értékét x = 5 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `x, x=5 → 5`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Egyszerűsítsd: √72.
Add meg √2 együtthatóját!`,
        answer: 6,
        type: 'multiplication',
        expression: `6√2`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: √(50x²), ahol x ≥ 0.
Add meg √2 együtthatóját x = 1 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `5x√2, x=1 → 5`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: √(18a⁴).
Add meg √2 együtthatóját a = 1 esetén!`,
        answer: 3,
        type: 'multiplication',
        expression: `3a²√2, a=1 → 3`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: √12 · √3.`,
        answer: 6,
        type: 'multiplication',
        expression: `√36 = 6`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: √75 / √3.`,
        answer: 5,
        type: 'multiplication',
        expression: `√25 = 5`,
    },
    {
        stage: 4,
        question: `Gyöktelenítsd a nevezőt: 3 / √5.
Add meg az értéket 3 tizedesjeggyel!`,
        answer: 1.342,
        type: 'multiplication',
        expression: `3√5 / 5 ≈ 1,342`,
    },
    {
        stage: 4,
        question: `Gyöktelenítsd a nevezőt: 2 / (√3 + 1).
Add meg az értéket 3 tizedesjeggyel!`,
        answer: 0.732,
        type: 'multiplication',
        expression: `√3 − 1 ≈ 0,732`,
    },
    {
        stage: 4,
        question: `Írd gyökös alakba: x^{3/2}, x ≥ 0.
Add meg az értéket x = 4 esetén!`,
        answer: 8,
        type: 'multiplication',
        expression: `x√x, x=4 → 8`,
    },
    {
        stage: 4,
        question: `Írd hatványalakba: ∛(a⁵).
Add meg az értéket a = 8 esetén!`,
        answer: 32,
        type: 'multiplication',
        expression: `a^{5/3}, a=8 → 32`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: x^{1/2} · x^{3/2}, x > 0.
Add meg az értéket x = 3 esetén!`,
        answer: 9,
        type: 'multiplication',
        expression: `x², x=3 → 9`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: a^{7/3} / a^{1/3}, a > 0.
Add meg az értéket a = 3 esetén!`,
        answer: 9,
        type: 'multiplication',
        expression: `a², a=3 → 9`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (x^{2/3})^{3/2}, x > 0.
Add meg az értéket x = 5 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `x, x=5 → 5`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (a² b^{−1})³ / (a⁴ b^{−2}).
Add meg az értéket a = 2, b = 1 esetén!`,
        answer: 4,
        type: 'multiplication',
        expression: `a² / b, a=2, b=1 → 4`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (x^{−2} y³) / (x^{−5} y).
Add meg az értéket x = 2, y = 1 esetén!`,
        answer: 8,
        type: 'multiplication',
        expression: `x³ y², x=2, y=1 → 8`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (a² / b³)^{−2}.
Add meg az értéket a = 1, b = 2 esetén!`,
        answer: 64,
        type: 'multiplication',
        expression: `b⁶ / a⁴, a=1, b=2 → 64`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: √(x² − 6x + 9).
Add meg az értéket x = 1 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `|x − 3|, x=1 → 2`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: √((2a − 5)²).
Add meg az értéket a = 4 esetén!`,
        answer: 3,
        type: 'multiplication',
        expression: `|2a − 5|, a=4 → 3`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (√48 + √27) / √3.`,
        answer: 7,
        type: 'multiplication',
        expression: `(4√3 + 3√3)/√3 = 7`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: 1 / (√2 − 1).
Add meg az értéket 3 tizedesjeggyel!`,
        answer: 2.414,
        type: 'multiplication',
        expression: `√2 + 1 ≈ 2,414`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (√x − √y) / (x − y), x, y > 0, x ≠ y.
Add meg az értéket x = 9, y = 4 esetén!`,
        answer: 0.2,
        type: 'multiplication',
        expression: `1/(√x + √y) = 1/5`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Egyszerűsítsd: ((x² − 9)/(x² − 6x + 9)) · ((x − 3)/(x + 3)).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: ((x² − 4)/(x² + 4x + 4)) · ((x + 2)/(x − 2)).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: ((a² − 4a + 4)/(a² − 4)) ÷ ((a − 2)/(a + 2)).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: x/(x − 1) − 1/(x − 1).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (x + 2)/x − 2/x.`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: 1/(x + 1) + 1/(x − 1).
Add meg az egyszerűsített alak értékét x = 2 esetén!

Add meg 3 tizedesjeggyel!`,
        answer: 1.333,
        type: 'multiplication',
        expression: `2x/(x² − 1), x=2 → 4/3`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: 1/(a − 2) − 1/(a + 2).
Add meg az egyszerűsített alak értékét a = 0 esetén!`,
        answer: -1,
        type: 'multiplication',
        expression: `4/(a² − 4), a=0 → −1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: x/(x + 1) + 1/(x + 1).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: x²/(x² − 1) − 1/(x² − 1).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (x² − 1)/(x − 1) − (x + 1).`,
        answer: 0,
        type: 'multiplication',
        expression: `0`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (a² − b²)/(a − b) − (a² + 2ab + b²)/(a + b).`,
        answer: 0,
        type: 'multiplication',
        expression: `0`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (x² − 4x + 4)/(x − 2) + (x² − 4)/(x + 2).
Add meg az egyszerűsített alak értékét x = 3 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `2x − 4, x=3 → 2`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: ((x + 1)² − (x − 1)²) / (4x).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: ((a + b)² − (a − b)²) / (4ab).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (√x + 1) / (x − 1).
Add meg az értéket x = 4 esetén!`,
        answer: 1,
        type: 'multiplication',
        expression: `1/(√x − 1), x=4 → 1`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (x − 1) / (√x − 1).
Add meg az értéket x = 4 esetén!`,
        answer: 3,
        type: 'multiplication',
        expression: `√x + 1, x=4 → 3`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: 1/(√x + 1) + 1/(√x − 1).
Add meg az értéket x = 4 esetén!

Add meg 3 tizedesjeggyel!`,
        answer: 1.333,
        type: 'multiplication',
        expression: `2√x / (x − 1), x=4 → 4/3`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (x^{3/2} − x^{1/2}) / (x − 1).
Add meg az értéket x = 4 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `√x, x=4 → 2`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (a³ − b³) / (a − b).
Add meg az értéket a = 2, b = 1 esetén!`,
        answer: 7,
        type: 'multiplication',
        expression: `a² + ab + b² → 7`,
    },
    {
        stage: 5,
        question: `Egyszerűsítsd: (x⁴ − 16) / (x² − 4).
Add meg az értéket x = 3 esetén!`,
        answer: 13,
        type: 'multiplication',
        expression: `x² + 4, x=3 → 13`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Egyszerűsítsd: (x³ − 3x² + 3x − 1) / (x² − 2x + 1).
Add meg az egyszerűsített alak értékét x = 3 esetén!`,
        answer: 2,
        type: 'multiplication',
        expression: `x − 1, x=3 → 2`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x⁴ − 1) / (x² − 1).
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `x² + 1, x=2 → 5`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x⁶ − 1) / (x³ − 1).
Add meg az egyszerűsített alak értékét x = 2 esetén!`,
        answer: 9,
        type: 'multiplication',
        expression: `x³ + 1, x=2 → 9`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x³ + y³) / (x + y).
Add meg az értéket x = 2, y = 1 esetén!`,
        answer: 3,
        type: 'multiplication',
        expression: `x² − xy + y² → 3`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x⁴ − y⁴) / (x² − y²).
Add meg az értéket x = 2, y = 1 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `x² + y² → 5`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: ((a + b)² / (a + b)) · ((a − b)² / (a − b)).
Add meg az értéket a = 3, b = 1 esetén!`,
        answer: 8,
        type: 'multiplication',
        expression: `a² − b² → 8`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: ((x+1)/(x−1) − (x−1)/(x+1)) · (x² − 1)/(4x).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (1/(x−1) − 1/(x+1)) · (x² − 1)/2.`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: ((x² + 2x + 1)/(x² − 1)) · ((x − 1)/(x + 1)).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: ((√x − 1)/(x − 1)) · (√x + 1).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (√x + 1/√x)² − (√x − 1/√x)².`,
        answer: 4,
        type: 'multiplication',
        expression: `4`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: ((√a − √b)/(a − b)) · (√a + √b).`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: (a + b)² + (a − b)² = 2(a² + b²).

Add meg 1-et, ha az azonosság igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: (a + b)² − (a − b)² = 4ab.

Add meg 1-et, ha az azonosság igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: a³ − b³ = (a − b)(a² + ab + b²).

Add meg 1-et, ha az azonosság igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: a³ + b³ = (a + b)(a² − ab + b²).

Add meg 1-et, ha az azonosság igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x+y)²/(x+y) − (x−y)²/(x−y).
Add meg az értéket y = 4 esetén!`,
        answer: 8,
        type: 'multiplication',
        expression: `2y, y=4 → 8`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x−y)²/(x−y) + (x+y)²/(x+y).
Add meg az értéket x = 3 esetén!`,
        answer: 6,
        type: 'multiplication',
        expression: `2x, x=3 → 6`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x⁴ − 5x² + 4) / (x² − 1).
Add meg az értéket x = 3 esetén!`,
        answer: 5,
        type: 'multiplication',
        expression: `x² − 4, x=3 → 5`,
    },
    {
        stage: 6,
        question: `Egyszerűsítsd: (x⁴ − 13x² + 36) / (x² − 4).
Add meg az értéket x = 3 esetén!`,
        answer: 0,
        type: 'multiplication',
        expression: `x² − 9, x=3 → 0`,
    },
];
