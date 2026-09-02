import type { Question } from './types';

/**
 * Trigonometria — 6 szint × 20 feladat (Trigonometria.pdf).
 * 1 Alapegyenletek → 2 Azonosság / másodfok → 3 Szorzat / vegyes →
 * 4 Egyenlőtlenségek → 5 Összetett → 6 Mesterfok.
 * Egy kártya = egy válasz. Egyenletek: [0°; 360°) megoldások fokban (halmaz).
 * Egyenlőtlenség: a megoldáshalmaz mértéke fokban.
 */
export const getTrigonometriaPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Oldd meg: sin x = 1/2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '150'],
        type: 'multiplication',
        expression: `x = 30° + 360°k vagy 150° + 360°k`,
    },
    {
        stage: 1,
        question: `Oldd meg: sin x = −√2 / 2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['225', '315'],
        type: 'multiplication',
        expression: `225°, 315°`,
    },
    {
        stage: 1,
        question: `Oldd meg: sin x = √3 / 2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['60', '120'],
        type: 'multiplication',
        expression: `60°, 120°`,
    },
    {
        stage: 1,
        question: `Oldd meg: cos x = 1/2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['60', '300'],
        type: 'multiplication',
        expression: `60°, 300°`,
    },
    {
        stage: 1,
        question: `Oldd meg: cos x = −√2 / 2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['135', '225'],
        type: 'multiplication',
        expression: `135°, 225°`,
    },
    {
        stage: 1,
        question: `Oldd meg: cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['90', '270'],
        type: 'multiplication',
        expression: `90°, 270°`,
    },
    {
        stage: 1,
        question: `Oldd meg: tan x = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['45', '225'],
        type: 'multiplication',
        expression: `45°, 225°`,
    },
    {
        stage: 1,
        question: `Oldd meg: tan x = −√3.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['120', '300'],
        type: 'multiplication',
        expression: `120°, 300°`,
    },
    {
        stage: 1,
        question: `Oldd meg: 2 sin x − 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '150'],
        type: 'multiplication',
        expression: `30°, 150°`,
    },
    {
        stage: 1,
        question: `Oldd meg: 2 cos x + √3 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['150', '210'],
        type: 'multiplication',
        expression: `150°, 210°`,
    },
    {
        stage: 1,
        question: `Oldd meg: 3 tan x − √3 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '210'],
        type: 'multiplication',
        expression: `30°, 210°`,
    },
    {
        stage: 1,
        question: `Oldd meg: sin(2x) = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '90', '180', '270'],
        type: 'multiplication',
        expression: `x = k · 90°`,
    },
    {
        stage: 1,
        question: `Oldd meg: cos(2x) = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['0', '180'],
        type: 'multiplication',
        expression: `x = k · 180°`,
    },
    {
        stage: 1,
        question: `Oldd meg: sin(3x) = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '150', '270'],
        type: 'multiplication',
        expression: `30°, 150°, 270°`,
    },
    {
        stage: 1,
        question: `Oldd meg: cos(3x) = −1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['60', '180', '300'],
        type: 'multiplication',
        expression: `60°, 180°, 300°`,
    },
    {
        stage: 1,
        question: `Oldd meg a [0; 2π] intervallumon: sin x = √2 / 2.
Add meg a megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['45', '135'],
        type: 'multiplication',
        expression: `45°, 135°`,
    },
    {
        stage: 1,
        question: `Oldd meg a [−π; π] intervallumon: cos x = −1/2.
Add meg a megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['-120', '120'],
        type: 'multiplication',
        expression: `±120°`,
    },
    {
        stage: 1,
        question: `Oldd meg a [0; 2π] intervallumon: tan x = −1.
Add meg a megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['135', '315'],
        type: 'multiplication',
        expression: `135°, 315°`,
    },
    {
        stage: 1,
        question: `Oldd meg: sin(x − π/6) = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '210'],
        type: 'multiplication',
        expression: `30°, 210°`,
    },
    {
        stage: 1,
        question: `Oldd meg: cos(x + π/3) = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '210'],
        type: 'multiplication',
        expression: `30°, 210°`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Oldd meg: 2 sin² x − 3 sin x + 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '90', '150'],
        type: 'multiplication',
        expression: `sin x = 1 vagy 1/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2 cos² x + cos x − 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['60', '180', '300'],
        type: 'multiplication',
        expression: `cos x = 1/2 vagy −1`,
    },
    {
        stage: 2,
        question: `Oldd meg: 4 sin² x − 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '150', '210', '330'],
        type: 'multiplication',
        expression: `sin x = ±1/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: 4 cos² x − 3 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '150', '210', '330'],
        type: 'multiplication',
        expression: `cos x = ±√3 / 2`,
    },
    {
        stage: 2,
        question: `Oldd meg: sin² x − sin x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['0', '90', '180'],
        type: 'multiplication',
        expression: `sin x = 0 vagy 1`,
    },
    {
        stage: 2,
        question: `Oldd meg: cos² x + cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['90', '180', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy −1`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2 sin² x + sin x − 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '150', '270'],
        type: 'multiplication',
        expression: `sin x = 1/2 vagy −1`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2 cos² x − 3 cos x + 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['0', '60', '300'],
        type: 'multiplication',
        expression: `cos x = 1 vagy 1/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: sin² x = 3/4.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['60', '120', '240', '300'],
        type: 'multiplication',
        expression: `60° + k·180° vagy 120° + k·180°`,
    },
    {
        stage: 2,
        question: `Oldd meg: cos² x = 1/4.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['60', '120', '240', '300'],
        type: 'multiplication',
        expression: `±60° + k·180°`,
    },
    {
        stage: 2,
        question: `Oldd meg: sin² x − cos² x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['45', '135', '225', '315'],
        type: 'multiplication',
        expression: `45° + k·90°`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2 sin² x + cos x − 2 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['60', '90', '270', '300'],
        type: 'multiplication',
        expression: `cos x = 0 vagy 1/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2 cos² x − sin x − 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['90', '210', '330'],
        type: 'multiplication',
        expression: `sin x = 1 vagy −1/2`,
    },
    {
        stage: 2,
        question: `Oldd meg: cos 2x = 2 sin x − 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['0', '90', '180'],
        type: 'multiplication',
        expression: `sin x = 0 vagy 1`,
    },
    {
        stage: 2,
        question: `Oldd meg: cos 2x + 3 sin x = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['0', '180'],
        type: 'multiplication',
        expression: `sin x = 0, x = k·180°`,
    },
    {
        stage: 2,
        question: `Oldd meg: sin² x + 2 cos x = 2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['0', '180'],
        type: 'multiplication',
        expression: `cos x = ±1, x = k·180°`,
    },
    {
        stage: 2,
        question: `Oldd meg: 3 sin² x + 4 cos² x = 3.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['90', '270'],
        type: 'multiplication',
        expression: `cos x = 0`,
    },
    {
        stage: 2,
        question: `Oldd meg: 2 sin² x − 5 sin x + 2 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '150'],
        type: 'multiplication',
        expression: `sin x = 1/2`,
    },
    {
        stage: 2,
        question: `Oldd meg a [−π; π] intervallumon: 2 cos² x + cos x − 1 = 0.
Add meg a megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['-180', '-60', '60', '180'],
        type: 'multiplication',
        expression: `±60°, ±180°`,
    },
    {
        stage: 2,
        question: `Oldd meg a [0; 2π] intervallumon: 4 sin² x − 4 sin x + 1 = 0.
Add meg a megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '150'],
        type: 'multiplication',
        expression: `sin x = 1/2`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Oldd meg: sin x cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '90', '180', '270'],
        type: 'multiplication',
        expression: `x = k·90°`,
    },
    {
        stage: 3,
        question: `Oldd meg: 2 sin x cos x = sin x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '60', '180', '300'],
        type: 'multiplication',
        expression: `sin x = 0 vagy cos x = 1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 2 sin x cos x = cos x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '90', '150', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy sin x = 1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin 2x = sin x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '60', '180', '300'],
        type: 'multiplication',
        expression: `sin x = 0 vagy cos x = 1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin 2x = cos x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '90', '150', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy sin x = 1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: cos 2x = cos x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['0', '120', '240'],
        type: 'multiplication',
        expression: `cos x = 1 vagy −1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: cos 2x = sin x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '150', '270'],
        type: 'multiplication',
        expression: `sin x = 1/2 vagy −1`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin x + sin 2x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '120', '180', '240'],
        type: 'multiplication',
        expression: `sin x = 0 vagy cos x = −1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: cos x + cos 2x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['60', '180', '300'],
        type: 'multiplication',
        expression: `cos x = 1/2 vagy −1`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin x − sin 2x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '60', '180', '300'],
        type: 'multiplication',
        expression: `sin x = 0 vagy cos x = 1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: cos x − cos 2x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['0', '120', '240'],
        type: 'multiplication',
        expression: `cos x = 1 vagy −1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin x + cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['135', '315'],
        type: 'multiplication',
        expression: `x = −45° + k·180°`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin x − cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['45', '225'],
        type: 'multiplication',
        expression: `x = 45° + k·180°`,
    },
    {
        stage: 3,
        question: `Oldd meg: √3 sin x − cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '210'],
        type: 'multiplication',
        expression: `x = 30° + k·180°`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin x + √3 cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['120', '300'],
        type: 'multiplication',
        expression: `x = −60° + k·180°`,
    },
    {
        stage: 3,
        question: `Oldd meg: 2 sin x cos x + sin x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '120', '180', '240'],
        type: 'multiplication',
        expression: `sin x = 0 vagy cos x = −1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: 2 sin x cos x − cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '90', '150', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy sin x = 1/2`,
    },
    {
        stage: 3,
        question: `Oldd meg: sin² x − sin x cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '45', '180', '225'],
        type: 'multiplication',
        expression: `sin x = 0 vagy tan x = 1`,
    },
    {
        stage: 3,
        question: `Oldd meg: cos² x − sin x cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['45', '90', '225', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy tan x = 1`,
    },
    {
        stage: 3,
        question: `Oldd meg a [0; 2π] intervallumon: sin 2x + sin x = 0.
Add meg a megoldásokat fokban!`,
        answer: 5,
        expectedSet: ['0', '120', '180', '240', '360'],
        type: 'multiplication',
        expression: `0°, 120°, 180°, 240°, 360°`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Oldd meg: sin x ≥ 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `[0°, 180°]`,
    },
    {
        stage: 4,
        question: `Oldd meg: sin x < 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `(180°, 360°)`,
    },
    {
        stage: 4,
        question: `Oldd meg: cos x ≥ 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `[0°, 90°] ∪ [270°, 360°)`,
    },
    {
        stage: 4,
        question: `Oldd meg: cos x < 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `(90°, 270°)`,
    },
    {
        stage: 4,
        question: `Oldd meg: sin x ≥ 1/2.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 120,
        type: 'multiplication',
        expression: `[30°, 150°]`,
    },
    {
        stage: 4,
        question: `Oldd meg: sin x ≤ −1/2.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 120,
        type: 'multiplication',
        expression: `[210°, 330°]`,
    },
    {
        stage: 4,
        question: `Oldd meg: cos x ≥ 1/2.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 120,
        type: 'multiplication',
        expression: `[300°, 360°) ∪ [0°, 60°]`,
    },
    {
        stage: 4,
        question: `Oldd meg: cos x ≤ −√2 / 2.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 90,
        type: 'multiplication',
        expression: `[135°, 225°]`,
    },
    {
        stage: 4,
        question: `Oldd meg: tan x > 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `(0°, 90°) ∪ (180°, 270°)`,
    },
    {
        stage: 4,
        question: `Oldd meg: tan x ≤ 1.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 270,
        type: 'multiplication',
        expression: `[0°, 45°] ∪ (90°, 225°] ∪ (270°, 360°)`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2 sin x − 1 > 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 120,
        type: 'multiplication',
        expression: `(30°, 150°)`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2 cos x + √3 ≤ 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 60,
        type: 'multiplication',
        expression: `[150°, 210°]`,
    },
    {
        stage: 4,
        question: `Oldd meg: sin² x ≥ 1/4.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 240,
        type: 'multiplication',
        expression: `|sin x| ≥ 1/2`,
    },
    {
        stage: 4,
        question: `Oldd meg: cos² x < 1/2.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `|cos x| < √2 / 2`,
    },
    {
        stage: 4,
        question: `Oldd meg: sin x cos x > 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `I. és III. síknegyed`,
    },
    {
        stage: 4,
        question: `Oldd meg: sin 2x ≥ 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `[0°, 90°] ∪ [180°, 270°]`,
    },
    {
        stage: 4,
        question: `Oldd meg: cos 2x < 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `(45°, 135°) ∪ (225°, 315°)`,
    },
    {
        stage: 4,
        question: `Oldd meg: 2 sin² x − 1 ≤ 0.
A [0°; 360°) megoldáshalmaz mértéke hány fok?`,
        answer: 180,
        type: 'multiplication',
        expression: `|sin x| ≤ √2 / 2`,
    },
    {
        stage: 4,
        question: `Oldd meg a [−π; π] intervallumon: cos x ≥ 1/2.
A megoldáshalmaz mértéke hány fok?`,
        answer: 120,
        type: 'multiplication',
        expression: `[−60°, 60°]`,
    },
    {
        stage: 4,
        question: `Oldd meg a [0; 2π] intervallumon: sin x < −√3 / 2.
A megoldáshalmaz mértéke hány fok?`,
        answer: 60,
        type: 'multiplication',
        expression: `(240°, 300°)`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Oldd meg: cos 2x + 4 sin x − 3 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 1,
        expectedSet: ['90'],
        type: 'multiplication',
        expression: `sin x = 1`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2 sin² x + 5 sin x + 2 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['210', '330'],
        type: 'multiplication',
        expression: `sin x = −1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 4 cos² x − 4 cos x − 3 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['120', '240'],
        type: 'multiplication',
        expression: `cos x = −1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2 sin² x − 5 sin x − 3 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['210', '330'],
        type: 'multiplication',
        expression: `sin x = −1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 2 cos² x + 3 cos x − 2 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['60', '300'],
        type: 'multiplication',
        expression: `cos x = 1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 4 sin² x − 16 cos² x = −1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['60', '120', '240', '300'],
        type: 'multiplication',
        expression: `cos x = ±1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: 3 sin² x = 5 cos² x, cos x ≠ 0.
Add meg a legkisebb pozitív megoldást fokban, 3 tizedesjeggyel!`,
        answer: 52.239,
        type: 'multiplication',
        expression: `tan² x = 5/3, arctan(√(5/3)) ≈ 52,239°`,
    },
    {
        stage: 5,
        question: `Oldd meg: |sin x| = 1/2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '150', '210', '330'],
        type: 'multiplication',
        expression: `sin x = ±1/2`,
    },
    {
        stage: 5,
        question: `Oldd meg: |cos x| = √3 / 2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '150', '210', '330'],
        type: 'multiplication',
        expression: `cos x = ±√3 / 2`,
    },
    {
        stage: 5,
        question: `Oldd meg: |2 sin x − 1| = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['0', '90', '180'],
        type: 'multiplication',
        expression: `sin x = 0 vagy 1`,
    },
    {
        stage: 5,
        question: `Oldd meg: |2 cos x + 1| = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['90', '180', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy −1`,
    },
    {
        stage: 5,
        question: `Oldd meg: sin⁴ x − sin² x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 5,
        expectedSet: ['0', '90', '180', '270', '360'],
        type: 'multiplication',
        expression: `sin x = 0 vagy ±1; [0; 2π]-n 0 és 360 is`,
    },
    {
        stage: 5,
        question: `Oldd meg: 4 cos⁴ x − 5 cos² x + 1 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 6,
        expectedSet: ['0', '60', '120', '180', '240', '300'],
        type: 'multiplication',
        expression: `cos² x = 1 vagy 1/4`,
    },
    {
        stage: 5,
        question: `Oldd meg: sin² x + sin x cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '135', '180', '315'],
        type: 'multiplication',
        expression: `sin x = 0 vagy tan x = −1`,
    },
    {
        stage: 5,
        question: `Oldd meg: cos² x − sin x cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['45', '90', '225', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy tan x = 1`,
    },
    {
        stage: 5,
        question: `Oldd meg: sin 2x + cos 2x = 0.
Add meg a legkisebb pozitív megoldást fokban!`,
        answer: 67.5,
        type: 'multiplication',
        expression: `x = 67,5° + k·90°`,
    },
    {
        stage: 5,
        question: `Oldd meg: sin 2x = √3 / 2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['30', '60', '210', '240'],
        type: 'multiplication',
        expression: `30° + k·180° vagy 60° + k·180°`,
    },
    {
        stage: 5,
        question: `Oldd meg: cos 2x = −1/2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['60', '120', '240', '300'],
        type: 'multiplication',
        expression: `60° + k·180° vagy 120° + k·180°`,
    },
    {
        stage: 5,
        question: `Oldd meg a [−π; π] intervallumon: 4 sin² x − 16 cos² x = −1.
Add meg a megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['-120', '-60', '60', '120'],
        type: 'multiplication',
        expression: `±60°, ±120°`,
    },
    {
        stage: 5,
        question: `Oldd meg a [0; 2π] intervallumon: |2 sin x + 1| = 2.
Add meg a megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '150'],
        type: 'multiplication',
        expression: `sin x = 1/2`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Oldd meg: cos 2x + 4 sin² x − 5 sin x − 4 = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['210', '330'],
        type: 'multiplication',
        expression: `sin x = −1/2`,
    },
    {
        stage: 6,
        question: `Oldd meg: 2 cos³ x − 5 cos² x − 3 cos x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['90', '120', '240', '270'],
        type: 'multiplication',
        expression: `cos x = 0 vagy −1/2`,
    },
    {
        stage: 6,
        question: `Oldd meg: 2 sin³ x − 5 sin² x − 3 sin x = 0.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['0', '180', '210', '330'],
        type: 'multiplication',
        expression: `sin x = 0 vagy −1/2`,
    },
    {
        stage: 6,
        question: `Oldd meg: 4 sin² x − 16 cos² x = −1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['60', '120', '240', '300'],
        type: 'multiplication',
        expression: `cos x = ±1/2`,
    },
    {
        stage: 6,
        question: `Oldd meg: |2 sin² x + 7 sin x + 1| = 5.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['30', '150'],
        type: 'multiplication',
        expression: `sin x = 1/2`,
    },
    {
        stage: 6,
        question: `Oldd meg: sin² x + sin x = cos² x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['30', '150', '270'],
        type: 'multiplication',
        expression: `sin x = 1/2 vagy −1`,
    },
    {
        stage: 6,
        question: `Oldd meg: cos² x + cos x = sin² x.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 3,
        expectedSet: ['60', '180', '300'],
        type: 'multiplication',
        expression: `cos x = 1/2 vagy −1`,
    },
    {
        stage: 6,
        question: `Oldd meg: sin x + cos x = √2.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 1,
        expectedSet: ['45'],
        type: 'multiplication',
        expression: `x = 45°`,
    },
    {
        stage: 6,
        question: `Oldd meg: sin x + cos x = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['0', '90'],
        type: 'multiplication',
        expression: `0°, 90°`,
    },
    {
        stage: 6,
        question: `Oldd meg: sin x − cos x = 1.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 2,
        expectedSet: ['90', '180'],
        type: 'multiplication',
        expression: `90°, 180°`,
    },
    {
        stage: 6,
        question: `Oldd meg: sin x cos x = 1/4.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['15', '75', '195', '255'],
        type: 'multiplication',
        expression: `sin 2x = 1/2`,
    },
    {
        stage: 6,
        question: `Oldd meg: sin x cos x = −1/4.
Add meg a [0°; 360°) megoldásokat fokban!`,
        answer: 4,
        expectedSet: ['105', '165', '285', '345'],
        type: 'multiplication',
        expression: `sin 2x = −1/2`,
    },
    {
        stage: 6,
        question: `Mely p-re van valós megoldása a sin x = p egyenletnek?
Add meg p legnagyobb értékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `−1 ≤ p ≤ 1`,
    },
    {
        stage: 6,
        question: `2 sin² x − 3 sin x + p = 0 legyen megoldható sin x = 1 mellett.
Határozd meg p-t!`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 1`,
    },
    {
        stage: 6,
        question: `cos² x + p cos x + 1 = 0 legyen megoldható cos x = −1 mellett.
Határozd meg p-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `p = 2`,
    },
    {
        stage: 6,
        question: `Mely p-re van valós megoldása: sin² x + p sin x + 1 = 0?
Add meg a legkisebb pozitív ilyen p-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `|p| ≥ 2`,
    },
    {
        stage: 6,
        question: `Mely p-re van valós megoldása: cos² x + p cos x + 1 = 0?
Add meg a legkisebb pozitív ilyen p-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `|p| ≥ 2`,
    },
    {
        stage: 6,
        question: `Igaz-e: sin⁴ x + cos⁴ x = 1 − (1/2) sin² 2x?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e: (sin x + cos x)² = 1 + sin 2x?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Az f(x) = sin x grafikonja, az x = π/6, x = 5π/6 egyenesek és az x-tengely közrezárt síkidom területe?

Add meg 3 tizedesjeggyel!`,
        answer: 1.732,
        type: 'multiplication',
        expression: `∫ sin x dx = √3 ≈ 1,732`,
    },
];
