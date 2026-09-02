import type { Question } from './types';

/**
 * Értelmezési tartomány és értékkészlet — 6×20 (Értelmezési_tartomány__értékkészlet.pdf).
 * 1 Domain alapok → 2 Range alapok → 3 Intervallum →
 * 4 Összetett domain → 5 Összetett range → 6 Mesterfok.
 * Egy kártya = egy szám vagy végpont-halmaz.
 * ℝ: kizárt pontok száma 0. Igaz/hamis: 1 / 0.
 */
export const getErtelmezesiPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = 1/(x − 4).
Add meg a kizárt valós számot!`,
        answer: 4,
        type: 'multiplication',
        expression: `ℝ \\ {4}`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = 3/(x + 2).
Add meg a kizárt valós számot!`,
        answer: -2,
        type: 'multiplication',
        expression: `ℝ \\ {−2}`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = 1/(x² − 9).
Add meg a kizárt számok halmazát!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `ℝ \\ {−3; 3}`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = √(x − 5).
Add meg a véges határpontot!`,
        answer: 5,
        type: 'multiplication',
        expression: `[5, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = √(7 − x).
Add meg a véges határpontot!`,
        answer: 7,
        type: 'multiplication',
        expression: `(−∞, 7]`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = √(2x + 6).
Add meg a véges határpontot!`,
        answer: -3,
        type: 'multiplication',
        expression: `[−3, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = log₂ x.
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `(0, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = log₃(x − 4).
Add meg a véges határpontot!`,
        answer: 4,
        type: 'multiplication',
        expression: `(4, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = log₅(7 − x).
Add meg a véges határpontot!`,
        answer: 7,
        type: 'multiplication',
        expression: `(−∞, 7)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = |x − 3|.
Hány valós számot zárunk ki?`,
        answer: 0,
        type: 'multiplication',
        expression: `ℝ`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = sin x.
Hány valós számot zárunk ki?`,
        answer: 0,
        type: 'multiplication',
        expression: `ℝ`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = cos x.
Hány valós számot zárunk ki?`,
        answer: 0,
        type: 'multiplication',
        expression: `ℝ`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = tan x.
Add meg a legkisebb pozitív kizárt szöget fokban!`,
        answer: 90,
        type: 'multiplication',
        expression: `ℝ \\ {π/2 + kπ}`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = 1/((x − 1)(x + 5)).
Add meg a kizárt számok halmazát!`,
        answer: 2,
        expectedSet: ['-5', '1'],
        type: 'multiplication',
        expression: `ℝ \\ {−5; 1}`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = √(x + 1) + 2.
Add meg a véges határpontot!`,
        answer: -1,
        type: 'multiplication',
        expression: `[−1, ∞)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = √(4 − 2x).
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `(−∞, 2]`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = log₂(3 − x).
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `(−∞, 3)`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = (x + 1)/(x² − 4).
Add meg a kizárt számok halmazát!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `ℝ \\ {−2; 2}`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = √(x²).
Hány valós számot zárunk ki?`,
        answer: 0,
        type: 'multiplication',
        expression: `ℝ`,
    },
    {
        stage: 1,
        question: `Add meg az értelmezési tartományt: f(x) = 1/(x² + 1).
Hány valós számot zárunk ki?`,
        answer: 0,
        type: 'multiplication',
        expression: `ℝ`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = x + 3, x ∈ ℝ.
Igaz-e, hogy az értékkészlet a teljes ℝ?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `ℝ`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = x².
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `[0, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = x² + 4.
Add meg a véges határpontot!`,
        answer: 4,
        type: 'multiplication',
        expression: `[4, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = x² − 5.
Add meg a véges határpontot!`,
        answer: -5,
        type: 'multiplication',
        expression: `[−5, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = |x|.
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `[0, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = |x − 2| + 1.
Add meg a véges határpontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `[1, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 3 − |x|.
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `(−∞, 3]`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = sin x.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `[−1, 1]`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 2 + sin x.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `[1, 3]`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 3 cos x − 1.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-4', '2'],
        type: 'multiplication',
        expression: `[−4, 2]`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 1 + cos x.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '2'],
        type: 'multiplication',
        expression: `[0, 2]`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 2 sin x + 5.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['3', '7'],
        type: 'multiplication',
        expression: `[3, 7]`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = √x.
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `[0, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = √x + 4.
Add meg a véges határpontot!`,
        answer: 4,
        type: 'multiplication',
        expression: `[4, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 5 − √x.
Add meg a véges határpontot!`,
        answer: 5,
        type: 'multiplication',
        expression: `(−∞, 5]`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 1/x, x ≠ 0.
Add meg a kizárt értéket!`,
        answer: 0,
        type: 'multiplication',
        expression: `ℝ \\ {0}`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 1/x + 2.
Add meg a kizárt értéket!`,
        answer: 2,
        type: 'multiplication',
        expression: `ℝ \\ {2}`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 2ˣ.
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `(0, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = 2ˣ + 3.
Add meg a véges határpontot!`,
        answer: 3,
        type: 'multiplication',
        expression: `(3, ∞)`,
    },
    {
        stage: 2,
        question: `Határozd meg az értékkészletet: f(x) = −2ˣ.
Add meg a véges határpontot!`,
        answer: 0,
        type: 'multiplication',
        expression: `(−∞, 0)`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = x, x ∈ [−3, 5].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-3', '5'],
        type: 'multiplication',
        expression: `[−3, 5]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = x², x ∈ [−2, 3].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '9'],
        type: 'multiplication',
        expression: `[0, 9]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = x², x ∈ (1, 4).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['1', '16'],
        type: 'multiplication',
        expression: `(1, 16)`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = x² − 1, x ∈ (−2, 2).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '3'],
        type: 'multiplication',
        expression: `[−1, 3)`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = |x|, x ∈ [−4, 2].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '4'],
        type: 'multiplication',
        expression: `[0, 4]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = |x − 1|, x ∈ [−2, 5].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '4'],
        type: 'multiplication',
        expression: `[0, 4]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = 2x + 1, x ∈ [−3, 4].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-5', '9'],
        type: 'multiplication',
        expression: `[−5, 9]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = −3x + 2, x ∈ [−1, 5].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-13', '5'],
        type: 'multiplication',
        expression: `[−13, 5]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = x² − 4x + 3, x ∈ [0, 5].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '8'],
        type: 'multiplication',
        expression: `[−1, 8]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = −x² + 4x + 1, x ∈ [0, 5].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-4', '5'],
        type: 'multiplication',
        expression: `[−4, 5]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = sin x, x ∈ [0, π/2].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `[0, 1]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = cos x, x ∈ [0, π].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `[−1, 1]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = sin x, x ∈ [−π/2, π/2].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `[−1, 1]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = 2 + cos x, x ∈ [0, π].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `[1, 3]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = √x, x ∈ [1, 9].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `[1, 3]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = √(x + 1), x ∈ [−1, 8].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '3'],
        type: 'multiplication',
        expression: `[0, 3]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = 1/x, x ∈ [1, 4].
Add meg a kisebb végpontot 3 tizedesjeggyel!`,
        answer: 0.25,
        type: 'multiplication',
        expression: `[1/4, 1]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = 1/x, x ∈ [−4, −1].
Add meg a 0-hoz közelebbi végpontot 3 tizedesjeggyel!`,
        answer: -0.25,
        type: 'multiplication',
        expression: `[−1, −1/4]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = 2ˣ, x ∈ [−2, 3].
Add meg a kisebb végpontot 3 tizedesjeggyel!`,
        answer: 0.25,
        type: 'multiplication',
        expression: `[1/4, 8]`,
    },
    {
        stage: 3,
        question: `Határozd meg az értékkészletet: f(x) = log₂ x, x ∈ [1, 8].
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '3'],
        type: 'multiplication',
        expression: `[0, 3]`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = 1/√(x − 2).
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `(2, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √((x − 1)/(x + 2)).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-2', '1'],
        type: 'multiplication',
        expression: `(−∞, −2) ∪ [1, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √(x + 3) / (x − 1).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-3', '1'],
        type: 'multiplication',
        expression: `[−3, 1) ∪ (1, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = log₂(x² − 4).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `(−∞, −2) ∪ (2, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = log₃(5 − 2x).
Add meg a véges határpontot!`,
        answer: 2.5,
        type: 'multiplication',
        expression: `(−∞, 5/2)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = 1 / log₂ x.
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `(0, 1) ∪ (1, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √(log₂ x).
Add meg a véges határpontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `[1, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = log₂(√x − 1).
Add meg a véges határpontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `(1, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = 1 / √(9 − x²).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-3', '3'],
        type: 'multiplication',
        expression: `(−3, 3)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √(4 − x²).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `[−2, 2]`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = 1 / sin x.
Add meg a legkisebb pozitív kizárt szöget fokban!`,
        answer: 180,
        type: 'multiplication',
        expression: `ℝ \\ {kπ}`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = 1 / cos x.
Add meg a legkisebb pozitív kizárt szöget fokban!`,
        answer: 90,
        type: 'multiplication',
        expression: `ℝ \\ {π/2 + kπ}`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √(1 − sin x).
Hány valós számot zárunk ki?`,
        answer: 0,
        type: 'multiplication',
        expression: `ℝ`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = log₂(1 + cos x).
Add meg a legkisebb pozitív kizárt szöget fokban!`,
        answer: 180,
        type: 'multiplication',
        expression: `ℝ \\ {(2k+1)π}`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √(x − 1) / (x² − 9).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['1', '3'],
        type: 'multiplication',
        expression: `[1, 3) ∪ (3, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √((x + 1)/(x − 3)).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-1', '3'],
        type: 'multiplication',
        expression: `(−∞, −1] ∪ (3, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = log₅((x − 2)/(x + 1)).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-1', '2'],
        type: 'multiplication',
        expression: `(−∞, −1) ∪ (2, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = 1 / √(x² − 4).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-2', '2'],
        type: 'multiplication',
        expression: `(−∞, −2) ∪ (2, ∞)`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = √((2 − x)/(x + 4)).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-4', '2'],
        type: 'multiplication',
        expression: `(−4, 2]`,
    },
    {
        stage: 4,
        question: `Add meg az értelmezési tartományt: f(x) = log₂((x + 3)/(x − 1)).
Add meg a véges határpontok halmazát!`,
        answer: 2,
        expectedSet: ['-3', '1'],
        type: 'multiplication',
        expression: `(−∞, −3) ∪ (1, ∞)`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = (x − 3)² + 2.
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `[2, ∞)`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = −(x + 1)² + 5.
Add meg a véges határpontot!`,
        answer: 5,
        type: 'multiplication',
        expression: `(−∞, 5]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 2|x − 4| − 3.
Add meg a véges határpontot!`,
        answer: -3,
        type: 'multiplication',
        expression: `[−3, ∞)`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 5 − 3|x + 2|.
Add meg a véges határpontot!`,
        answer: 5,
        type: 'multiplication',
        expression: `(−∞, 5]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 1/(x² + 1).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `(0, 1]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 1/(x² + 4) + 2.
Add meg a nagyobb végpontot 3 tizedesjeggyel!`,
        answer: 2.25,
        type: 'multiplication',
        expression: `(2, 9/4]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = x²/(x² + 1).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `[0, 1)`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = (x² − 1)/(x² + 1).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `[−1, 1)`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = √(9 − x²).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '3'],
        type: 'multiplication',
        expression: `[0, 3]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 2 + √(4 − x²).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['2', '4'],
        type: 'multiplication',
        expression: `[2, 4]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 3 − 2 sin x.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['1', '5'],
        type: 'multiplication',
        expression: `[1, 5]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = |sin x|.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `[0, 1]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = sin² x.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `[0, 1]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 2 cos² x − 1.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `[−1, 1]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 3ˣ − 2.
Add meg a véges határpontot!`,
        answer: -2,
        type: 'multiplication',
        expression: `(−2, ∞)`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 5 − 2ˣ.
Add meg a véges határpontot!`,
        answer: 5,
        type: 'multiplication',
        expression: `(−∞, 5)`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = log₂ x + 3.
Igaz-e, hogy az értékkészlet a teljes ℝ?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `ℝ`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = 1 / (|x| + 1).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `(0, 1]`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = |x| / (|x| + 1).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `[0, 1)`,
    },
    {
        stage: 5,
        question: `Határozd meg az értékkészletet: f(x) = √(x² + 4).
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `[2, ∞)`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Határozd meg az értelmezési tartományt: f(x) = √((x² − 4)/(x² − 9)).
Add meg a véges határpontok halmazát!`,
        answer: 4,
        expectedSet: ['-3', '-2', '2', '3'],
        type: 'multiplication',
        expression: `(−∞, −3) ∪ [−2, 2] ∪ (3, ∞)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értelmezési tartományt: f(x) = log₂((x² − 1)/(x − 3)).
Add meg a véges határpontok halmazát!`,
        answer: 3,
        expectedSet: ['-1', '1', '3'],
        type: 'multiplication',
        expression: `(−1, 1) ∪ (3, ∞)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értelmezési tartományt: f(x) = 1 / √(log₂ x).
Add meg a véges határpontot!`,
        answer: 1,
        type: 'multiplication',
        expression: `(1, ∞)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értelmezési tartományt: f(x) = √(log₃(5 − x)).
Add meg a véges határpontot!`,
        answer: 4,
        type: 'multiplication',
        expression: `(−∞, 4]`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = x + 1/x, x > 0.
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `[2, ∞)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = x + 4/x, x > 0.
Add meg a véges határpontot!`,
        answer: 4,
        type: 'multiplication',
        expression: `[4, ∞)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = x² + 1/x², x ≠ 0.
Add meg a véges határpontot!`,
        answer: 2,
        type: 'multiplication',
        expression: `[2, ∞)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = x / (1 + |x|).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `(−1, 1)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = x² / (x² + 4).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `[0, 1)`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = 2x / (x² + 1).
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `[−1, 1]`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = sin x + cos x.
Add meg a felső határt 3 tizedesjeggyel!`,
        answer: 1.414,
        type: 'multiplication',
        expression: `[−√2, √2]`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = 2 sin x − 3 cos x.
Add meg a felső határt 3 tizedesjeggyel!`,
        answer: 3.606,
        type: 'multiplication',
        expression: `[−√13, √13]`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = sin x cos x.
Add meg a felső határt!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `[−1/2, 1/2]`,
    },
    {
        stage: 6,
        question: `Határozd meg az értékkészletet: f(x) = sin² x − cos² x.
Add meg a két végpontot!`,
        answer: 2,
        expectedSet: ['-1', '1'],
        type: 'multiplication',
        expression: `[−1, 1]`,
    },
    {
        stage: 6,
        question: `Határozd meg a p azon értékeit, amelyekre f(x) = √(x − p) értelmezési tartománya tartalmazza a [2, ∞) intervallumot!
Add meg p megengedett értékeinek véges határpontját!`,
        answer: 2,
        type: 'multiplication',
        expression: `p ≤ 2`,
    },
    {
        stage: 6,
        question: `Határozd meg a p azon értékeit, amelyekre f(x) = log₂(x − p) értelmezési tartománya tartalmazza a (3, ∞) intervallumot!
Add meg p megengedett értékeinek véges határpontját!`,
        answer: 3,
        type: 'multiplication',
        expression: `p ≤ 3`,
    },
    {
        stage: 6,
        question: `Határozd meg a p paramétert, ha f(x) = (x − p)² + 4 értékkészlete [4, ∞)!
Igaz-e, hogy minden valós p jó?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `p ∈ ℝ`,
    },
    {
        stage: 6,
        question: `Határozd meg a p azon értékeit, amelyekre f(x) = p + sin x értékkészlete [2, 4]!
Add meg p-t!`,
        answer: 3,
        type: 'multiplication',
        expression: `p = 3`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy f(x) = 1/(x² + 1) értékkészlete (0, 1]!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy f(x) = x + 1/x, x > 0 értékkészlete [2, ∞)!

Add meg 1-et, ha az állítás igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz (AM-GM)`,
    },
];
