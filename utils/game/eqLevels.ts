import type { Question } from './types';

/**
 * Egyenletek, egyenletrendszerek, egyenlőtlenségek — 6 szint × 20 feladat.
 * 1 Algebrai rutin → 2 Feltételek → 3 Szerkezet → 4 Összetett → 5 Emelt → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getEquationsPracticeQuestions = (): Question[] => [
    {
        stage: 1,
        question: `Oldd meg!

5x − 8 = 3x + 10

Add meg x-et!`,
        answer: 9,
        type: 'multiplication',
        expression: `2x = 18 → x = 9`,
    },
    {
        stage: 1,
        question: `Oldd meg!

3(x − 2) − 2(x + 4) = 7

Add meg x-et!`,
        answer: 21,
        type: 'multiplication',
        expression: `x − 14 = 7 → x = 21`,
    },
    {
        stage: 1,
        question: `Oldd meg!

x² − 7x + 12 = 0

Add meg a nagyobb gyököt!`,
        answer: 4,
        type: 'multiplication',
        expression: `(x − 3)(x − 4) = 0`,
    },
    {
        stage: 1,
        question: `Oldd meg!

x³ − 5x² + 6x = 0

Add meg a legnagyobb gyököt!`,
        answer: 3,
        type: 'multiplication',
        expression: `x(x − 2)(x − 3) = 0`,
    },
    {
        stage: 1,
        question: `Oldd meg!

(x − 3)(2x + 5) = 0

Add meg a nagyobb gyököt!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3 vagy x = −5/2`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x − 5| = 3

Add meg a nagyobb megoldást!`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8 vagy x = 2`,
    },
    {
        stage: 1,
        question: `Oldd meg!

2x − 3 < 7

Add meg a felső határt (nyílt)!`,
        answer: 5,
        type: 'multiplication',
        expression: `x < 5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

x + y = 11
2x − y = 4

Add meg x-et!`,
        answer: 5,
        type: 'multiplication',
        expression: `(x, y) = (5, 6)`,
    },
    {
        stage: 1,
        question: `Oldd meg!

6x + 1 = 2x + 13

Add meg x-et!`,
        answer: 3,
        type: 'multiplication',
        expression: `4x = 12 → x = 3`,
    },
    {
        stage: 1,
        question: `Oldd meg!

4(x − 1) − (x + 5) = 6

Add meg x-et!`,
        answer: 5,
        type: 'multiplication',
        expression: `3x − 9 = 6 → x = 5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

x² − 9x + 20 = 0

Add meg a nagyobb gyököt!`,
        answer: 5,
        type: 'multiplication',
        expression: `(x − 4)(x − 5) = 0`,
    },
    {
        stage: 1,
        question: `Oldd meg!

x² − 25 = 0

Add meg a pozitív gyököt!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = ±5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

x³ − x² − 6x = 0

Add meg a legnagyobb gyököt!`,
        answer: 3,
        type: 'multiplication',
        expression: `x(x − 3)(x + 2) = 0`,
    },
    {
        stage: 1,
        question: `Oldd meg!

(x + 6)(x − 2) = 0

Add meg a nagyobb gyököt!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = −6 vagy x = 2`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x + 3| = 7

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4 vagy x = −10`,
    },
    {
        stage: 1,
        question: `Oldd meg!

5x + 2 ≤ 17

Add meg a felső határt (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≤ 3`,
    },
    {
        stage: 1,
        question: `Oldd meg!

x + y = 15
x − y = 3

Add meg x-et!`,
        answer: 9,
        type: 'multiplication',
        expression: `(x, y) = (9, 6)`,
    },
    {
        stage: 1,
        question: `Oldd meg!

3x − 7 = 8

Add meg x-et!`,
        answer: 5,
        type: 'multiplication',
        expression: `3x = 15 → x = 5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|2x − 1| = 5

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3 vagy x = −2`,
    },
    {
        stage: 1,
        question: `Oldd meg!

4x + 5 > 13

Add meg az alsó határt (nyílt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x > 2`,
    },
    {
        stage: 2,
        question: `Oldd meg!

(x + 3)/(x − 2) = 2

Add meg x-et!`,
        answer: 7,
        type: 'multiplication',
        expression: `x + 3 = 2x − 4 → x = 7 (x ≠ 2)`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|2x − 3| = 5

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4 vagy x = −1`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x − 4| = x + 2

Add meg a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1 (a másik eset hamis)`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(x + 5) = x − 1

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4 (x = −1 hamis gyök)`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(3x + 4) = x + 2

Add meg a nagyobb megoldást!`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0 vagy x = −1`,
    },
    {
        stage: 2,
        question: `Oldd meg!

(x − 1)/(x + 2) ≤ 0

Add meg a felső határt (zárt)!`,
        answer: 1,
        type: 'multiplication',
        expression: `−2 < x ≤ 1`,
    },
    {
        stage: 2,
        question: `Oldd meg!

x⁴ − 10x² + 9 = 0

Add meg a legnagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = ±1, ±3`,
    },
    {
        stage: 2,
        question: `Oldd meg!

x + y = 7
xy = 12

Add meg a nagyobb számot!`,
        answer: 4,
        type: 'multiplication',
        expression: `(3, 4) vagy (4, 3)`,
    },
    {
        stage: 2,
        question: `Oldd meg!

(x − 4)/(x + 1) = 3

Add meg x-et!`,
        answer: -3.5,
        type: 'multiplication',
        expression: `x − 4 = 3x + 3 → x = −3,5`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|3x + 1| = 7

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2 vagy x = −8/3`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x + 5| = 2x − 1

Add meg a megoldást!`,
        answer: 6,
        type: 'multiplication',
        expression: `x = 6 (ellenőrzés: |11| = 11)`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(x + 12) = x

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4 (x = −3 hamis)`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(4x + 5) = x + 1

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 3.236,
        type: 'multiplication',
        expression: `x = 1 + √5 ≈ 3,236`,
    },
    {
        stage: 2,
        question: `Oldd meg!

(x + 1)/(x − 4) ≤ 0

Add meg a felső határt (nyílt)!`,
        answer: 4,
        type: 'multiplication',
        expression: `−1 ≤ x < 4`,
    },
    {
        stage: 2,
        question: `Oldd meg!

x⁴ − 13x² + 36 = 0

Add meg a legnagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x² = 4 vagy x² = 9`,
    },
    {
        stage: 2,
        question: `Oldd meg!

x + y = 9
xy = 20

Add meg a nagyobb számot!`,
        answer: 5,
        type: 'multiplication',
        expression: `(4, 5) vagy (5, 4)`,
    },
    {
        stage: 2,
        question: `Oldd meg!

(3x − 1)/(x − 2) = 4

Add meg x-et!`,
        answer: 7,
        type: 'multiplication',
        expression: `3x − 1 = 4x − 8 → x = 7`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x − 3| = |2x + 1|

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 0.667,
        type: 'multiplication',
        expression: `x = 2/3 vagy x = −4`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(x − 1) + 2 = x

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 3.618,
        type: 'multiplication',
        expression: `x = (5 + √5)/2 ≈ 3,618`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|4 − x| = 6

Add meg a nagyobb megoldást!`,
        answer: 10,
        type: 'multiplication',
        expression: `x = 10 vagy x = −2`,
    },
    {
        stage: 3,
        question: `Oldd meg!

2^{2x} − 5 · 2^x + 4 = 0

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `t = 2^x → t = 4 vagy 1 → x = 2 vagy 0`,
    },
    {
        stage: 3,
        question: `Oldd meg!

3^{2x} − 10 · 3^x + 9 = 0

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `t = 3^x → t = 9 vagy 1 → x = 2 vagy 0`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(x + 8) − √(x − 1) = 1

Add meg a megoldást!`,
        answer: 17,
        type: 'multiplication',
        expression: `√(x − 1) = 4 → x = 17`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|x − 2| + |x + 3| = 7

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3 vagy x = −4`,
    },
    {
        stage: 3,
        question: `Oldd meg!

(x − 3)/(x + 1) > 1

Add meg a felső határt (nyílt)!`,
        answer: -1,
        type: 'multiplication',
        expression: `x < −1`,
    },
    {
        stage: 3,
        question: `Oldd meg!

log₂(x − 1) + log₂(x + 2) = 2

Add meg a megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `(x − 1)(x + 2) = 4 → x = 2`,
    },
    {
        stage: 3,
        question: `Oldd meg!

2 sin² x − 3 sin x + 1 = 0

Hány megoldás van a [0; 2π) intervallumon?`,
        answer: 3,
        type: 'multiplication',
        expression: `sin x = 1 vagy 1/2 → 3 megoldás`,
    },
    {
        stage: 3,
        question: `Oldd meg!

x + y = 5
x² + y² = 13

Add meg a nagyobb számot!`,
        answer: 3,
        type: 'multiplication',
        expression: `(2, 3) vagy (3, 2)`,
    },
    {
        stage: 3,
        question: `Oldd meg!

4^x − 6 · 2^x + 8 = 0

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `t = 2^x → t = 4 vagy 2 → x = 2 vagy 1`,
    },
    {
        stage: 3,
        question: `Oldd meg!

5^{2x} − 26 · 5^x + 25 = 0

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `t = 5^x → t = 25 vagy 1 → x = 2 vagy 0`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(x + 5) − √(x − 2) = 1

Add meg a megoldást!`,
        answer: 11,
        type: 'multiplication',
        expression: `√(x − 2) = 3 → x = 11`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|x| + |x − 6| = 10

Add meg a nagyobb megoldást!`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8 vagy x = −2`,
    },
    {
        stage: 3,
        question: `Oldd meg!

(x + 2)/(x − 3) > 1

Add meg az alsó határt (nyílt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x > 3`,
    },
    {
        stage: 3,
        question: `Oldd meg!

log₃ x + log₃(x + 8) = 2

Add meg a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `x(x + 8) = 9 → x = 1`,
    },
    {
        stage: 3,
        question: `Oldd meg!

2 cos² x − 3 cos x + 1 = 0

Hány megoldás van a [0; 2π) intervallumon?`,
        answer: 3,
        type: 'multiplication',
        expression: `cos x = 1 vagy 1/2 → 3 megoldás`,
    },
    {
        stage: 3,
        question: `Oldd meg!

x + y = 6
x² + y² = 20

Add meg a nagyobb számot!`,
        answer: 4,
        type: 'multiplication',
        expression: `(2, 4) vagy (4, 2)`,
    },
    {
        stage: 3,
        question: `Oldd meg!

log₂(x − 3) = 3

Add meg x-et!`,
        answer: 11,
        type: 'multiplication',
        expression: `x − 3 = 8 → x = 11`,
    },
    {
        stage: 3,
        question: `Oldd meg!

2^{2x} − 9 · 2^x + 8 = 0

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `t = 2^x → t = 8 vagy 1 → x = 3 vagy 0`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|x − 1| + |x − 4| = 5

Add meg a nagyobb megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5 vagy x = 0`,
    },
    {
        stage: 3,
        question: `Oldd meg!

x + y = 4
xy = 3

Add meg a nagyobb számot!`,
        answer: 3,
        type: 'multiplication',
        expression: `(1, 3) vagy (3, 1)`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(2x + 3) + √(x − 1) = 4

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 2.431,
        type: 'multiplication',
        expression: `x = 44 − 24√3 ≈ 2,431`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(x + 5) = |x − 1|

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4 vagy x = −1`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|x² − 5x + 4| = 2

Add meg a legnagyobb megoldást 3 tizedesjeggyel!`,
        answer: 4.562,
        type: 'multiplication',
        expression: `(5 + √17)/2 ≈ 4,562`,
    },
    {
        stage: 4,
        question: `Oldd meg!

(x − 4)/(x − 6) ≤ −1

Add meg az alsó határt (zárt)!`,
        answer: 5,
        type: 'multiplication',
        expression: `5 ≤ x < 6`,
    },
    {
        stage: 4,
        question: `Oldd meg!

4^x − 5 · 2^x + 4 = 0

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `t = 2^x → t = 4 vagy 1 → x = 2 vagy 0`,
    },
    {
        stage: 4,
        question: `Oldd meg!

log₃(x + 5) + log₃(x − 1) = 2

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 2.243,
        type: 'multiplication',
        expression: `x = −2 + 3√2 ≈ 2,243`,
    },
    {
        stage: 4,
        question: `Oldd meg!

2 cos² x + cos x − 1 = 0

Hány megoldás van a [0; 2π) intervallumon?`,
        answer: 3,
        type: 'multiplication',
        expression: `cos x = 1/2 vagy −1 → 3 megoldás`,
    },
    {
        stage: 4,
        question: `Oldd meg!

x + y = 6
√x + √y = 2√3

Add meg x-et!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = y = 3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(x + 3) + √(x − 1) = 4

Add meg a megoldást!`,
        answer: 3.25,
        type: 'multiplication',
        expression: `√(x − 1) = 1,5 → x = 3,25`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(4x + 5) = |x + 1|

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 3.236,
        type: 'multiplication',
        expression: `x = 1 + √5 ≈ 3,236`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|x² − 3x| = 2

Add meg a legnagyobb megoldást 3 tizedesjeggyel!`,
        answer: 3.562,
        type: 'multiplication',
        expression: `(3 + √17)/2 ≈ 3,562`,
    },
    {
        stage: 4,
        question: `Oldd meg!

(x − 2)/(x − 5) ≤ −1

Add meg az alsó határt (zárt)!`,
        answer: 3.5,
        type: 'multiplication',
        expression: `3,5 ≤ x < 5`,
    },
    {
        stage: 4,
        question: `Oldd meg!

9^x − 10 · 3^x + 9 = 0

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `t = 3^x → t = 9 vagy 1 → x = 2 vagy 0`,
    },
    {
        stage: 4,
        question: `Oldd meg!

log₂(x + 3) + log₂(x − 1) = 3

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 2.464,
        type: 'multiplication',
        expression: `x = −1 + 2√3 ≈ 2,464`,
    },
    {
        stage: 4,
        question: `Oldd meg!

2 sin² x + sin x − 1 = 0

Hány megoldás van a [0; 2π) intervallumon?`,
        answer: 3,
        type: 'multiplication',
        expression: `sin x = 1/2 vagy −1 → 3 megoldás`,
    },
    {
        stage: 4,
        question: `Oldd meg!

x + y = 10
√x + √y = 4

Add meg a nagyobb számot!`,
        answer: 9,
        type: 'multiplication',
        expression: `√x, √y = 1 és 3 → 1 és 9`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(3x + 1) + √(x − 1) = 4

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 2.351,
        type: 'multiplication',
        expression: `x = 15 − 4√10 ≈ 2,351`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|x² − 4x + 3| = 1

Add meg a legnagyobb megoldást 3 tizedesjeggyel!`,
        answer: 3.414,
        type: 'multiplication',
        expression: `2 + √2 ≈ 3,414`,
    },
    {
        stage: 4,
        question: `Oldd meg!

log₅(x − 2) + log₅(x + 2) = 1

Add meg a megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x² − 4 = 5 → x = 3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

4^x − 10 · 2^x + 16 = 0

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `t = 2^x → t = 8 vagy 2 → x = 3 vagy 1`,
    },
    {
        stage: 5,
        question: `Vizsgáld!

x² − (p + 2)x + 2p = 0

Melyik p-nél nincs két különböző valós gyök?`,
        answer: 2,
        type: 'multiplication',
        expression: `D = (p − 2)² = 0 ⇔ p = 2`,
    },
    {
        stage: 5,
        question: `Az x² − (p + 1)x + p = 0 egyik gyöke kétszerese a másiknak.

Add meg a nagyobb ilyen p-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `gyökök: 1 és p → p = 2 vagy p = 1/2`,
    },
    {
        stage: 5,
        question: `A p paraméter függvényében: |x − 2| = p

Ha p = 0, hány valós megoldás van?`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 0 → egy megoldás (x = 2)`,
    },
    {
        stage: 5,
        question: `A p paraméter függvényében: x² − 4x + p = 0

Ha p = 4, hány valós megoldás van?`,
        answer: 1,
        type: 'multiplication',
        expression: `D = 0 ⇔ p = 4`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(x + 4) + √(8 − x) = 4

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 7.657,
        type: 'multiplication',
        expression: `x = 2 + 4√2 ≈ 7,657`,
    },
    {
        stage: 5,
        question: `Oldd meg!

log₂(x − 1) + log₂(5 − x) = 1

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 4.414,
        type: 'multiplication',
        expression: `x = 3 + √2 ≈ 4,414`,
    },
    {
        stage: 5,
        question: `Oldd meg!

sin² x = 3 cos² x

Hány megoldás van a [0; 2π) intervallumon?`,
        answer: 4,
        type: 'multiplication',
        expression: `cos x = ±1/2 → 4 megoldás`,
    },
    {
        stage: 5,
        question: `Határozd meg az összes pozitív egész (x, y) számpárt!

1/x + 1/y = 1/2

Hány ilyen számpár van?`,
        answer: 3,
        type: 'multiplication',
        expression: `(3, 6), (4, 4), (6, 3)`,
    },
    {
        stage: 5,
        question: `Az x² − (p + 2)x + 2p = 0 egyenletnél p = 0.

Hány különböző valós gyök van?`,
        answer: 2,
        type: 'multiplication',
        expression: `x² − 2x = 0 → x = 0 vagy 2`,
    },
    {
        stage: 5,
        question: `Az x² − (p + 3)x + 2p = 0 egyenletnél p = 0.

Add meg a nemnulla gyököt!`,
        answer: 3,
        type: 'multiplication',
        expression: `x² − 3x = 0 → x = 0 vagy 3`,
    },
    {
        stage: 5,
        question: `|x − 2| = p. Ha p = 5, hány valós megoldás van?`,
        answer: 2,
        type: 'multiplication',
        expression: `p > 0 → 2 megoldás`,
    },
    {
        stage: 5,
        question: `|x − 2| = p. Ha p = −3, hány valós megoldás van?`,
        answer: 0,
        type: 'multiplication',
        expression: `p < 0 → 0 megoldás`,
    },
    {
        stage: 5,
        question: `x² − 4x + p = 0. Ha p = 0, hány valós megoldás van?`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 0 vagy x = 4`,
    },
    {
        stage: 5,
        question: `x² − 4x + p = 0. Ha p = 5, hány valós megoldás van?`,
        answer: 0,
        type: 'multiplication',
        expression: `D = 16 − 20 < 0`,
    },
    {
        stage: 5,
        question: `√(x + 4) + √(8 − x) = 4

Add meg a kisebb megoldást 3 tizedesjeggyel!`,
        answer: -3.657,
        type: 'multiplication',
        expression: `x = 2 − 4√2 ≈ −3,657`,
    },
    {
        stage: 5,
        question: `log₂(x − 1) + log₂(5 − x) = 1

Add meg a kisebb megoldást 3 tizedesjeggyel!`,
        answer: 1.586,
        type: 'multiplication',
        expression: `x = 3 − √2 ≈ 1,586`,
    },
    {
        stage: 5,
        question: `sin² x = 3 cos² x

Add meg a kisebb pozitív megoldást fokban!`,
        answer: 60,
        type: 'multiplication',
        expression: `tan² x = 3 → 60°`,
    },
    {
        stage: 5,
        question: `1/x + 1/y = 1/2, x, y pozitív egészek.

Add meg a legnagyobb lehetséges x-et!`,
        answer: 6,
        type: 'multiplication',
        expression: `x = 6, y = 3`,
    },
    {
        stage: 5,
        question: `|x + 1| = p. Ha p = 0, hány valós megoldás van?`,
        answer: 1,
        type: 'multiplication',
        expression: `x = −1`,
    },
    {
        stage: 5,
        question: `x² − 6x + p = 0. Két különböző valós gyök van, ha p kisebb, mint …

Add meg ezt a határt!`,
        answer: 9,
        type: 'multiplication',
        expression: `D = 36 − 4p > 0 → p < 9`,
    },
    {
        stage: 6,
        question: `Vizsgáld!

|x² − 4x + 3| = p

Ha p = 1, hány különböző valós megoldás van?`,
        answer: 3,
        type: 'multiplication',
        expression: `p = 1: a W-alak csúcsa + két külső`,
    },
    {
        stage: 6,
        question: `Ugyanez az egyenlet. Ha p = 2, hány különböző valós megoldás van?`,
        answer: 2,
        type: 'multiplication',
        expression: `p > 1 → 2 megoldás`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha 0 < p < 1, hány különböző valós megoldás van?`,
        answer: 4,
        type: 'multiplication',
        expression: `W-alak: 4 metszéspont`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha p < 0, hány különböző valós megoldás van?`,
        answer: 0,
        type: 'multiplication',
        expression: `absz ≥ 0`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha p = 0, hány különböző valós megoldás van?`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 1 és x = 3`,
    },
    {
        stage: 6,
        question: `Vizsgáld!

√(x + 2) = p − x

Ha p = −3, hány valós megoldás van?`,
        answer: 0,
        type: 'multiplication',
        expression: `p < −2 → 0 megoldás`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha p = −2, hány valós megoldás van?`,
        answer: 1,
        type: 'multiplication',
        expression: `érintés x = −2-nél`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha p = 2, hány valós megoldás van?`,
        answer: 1,
        type: 'multiplication',
        expression: `p > −2 → pontosan 1 megoldás`,
    },
    {
        stage: 6,
        question: `Vizsgáld!

x² = p − x

Ha p = −0,25, hány valós megoldás van?`,
        answer: 1,
        type: 'multiplication',
        expression: `D = 0 ⇔ p = −1/4`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha p = 0, hány valós megoldás van?`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 0 vagy x = −1`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha p = −1, hány valós megoldás van?`,
        answer: 0,
        type: 'multiplication',
        expression: `p < −1/4 → 0 megoldás`,
    },
    {
        stage: 6,
        question: `Bizonyítsd: (x + 1)/x = 2 a pozitív valósakon pontosan egy megoldású.

Add meg ezt a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `1 + 1/x = 2 → x = 1`,
    },
    {
        stage: 6,
        question: `Határozd meg az összes pozitív egész (x, y) számpárt!

xy = 2x + 3y

Hány ilyen számpár van?`,
        answer: 4,
        type: 'multiplication',
        expression: `(4, 8), (5, 5), (6, 4), (9, 3)`,
    },
    {
        stage: 6,
        question: `Ugyanez. Add meg a legnagyobb lehetséges x-et!`,
        answer: 9,
        type: 'multiplication',
        expression: `x = 9, y = 3`,
    },
    {
        stage: 6,
        question: `Oldd meg!

(x² − 5x + 6)/(x² − 1) ≤ 0

Hány egész megoldás van?`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 0, 2, 3`,
    },
    {
        stage: 6,
        question: `Ugyanez az egyenlőtlenség.

Add meg a zárt intervallum alsó határát!`,
        answer: 2,
        type: 'multiplication',
        expression: `]−1; 1[ ∪ [2; 3]`,
    },
    {
        stage: 6,
        question: `Oldd meg!

2 sin² x + sin x cos x − cos² x = 0

Hány megoldás van a [0; 2π) intervallumon?`,
        answer: 4,
        type: 'multiplication',
        expression: `tan x = 1/2 vagy tan x = −1`,
    },
    {
        stage: 6,
        question: `Vizsgáld!

|x² − 4| = p x

Ha p = 0, hány valós megoldás van?`,
        answer: 2,
        type: 'multiplication',
        expression: `x = ±2`,
    },
    {
        stage: 6,
        question: `Ugyanez. Ha p = 1, hány valós megoldás van?`,
        answer: 2,
        type: 'multiplication',
        expression: `két pozitív gyök, negatív nincs`,
    },
    {
        stage: 6,
        question: `x² = p − x és p = −1/4.

Add meg a (kettős) gyököt!`,
        answer: -0.5,
        type: 'multiplication',
        expression: `x = −1/2`,
    },
];
