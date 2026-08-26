import type { Question } from './types';

/**
 * Abszolútérték és gyök — 6 szint × 20 feladat.
 * Egy kártya = egy feladat = egy válasz (nincs szint/téma fejléc).
 */
export const getAbsoluteRootPracticeQuestions = (): Question[] => [
    {
        stage: 1,
        question: `Számítsd ki!

|−7|`,
        answer: 7,
        type: 'multiplication',
        expression: `|−7| = 7`,
    },
    {
        stage: 1,
        question: `Számítsd ki!

|12|`,
        answer: 12,
        type: 'multiplication',
        expression: `|12| = 12`,
    },
    {
        stage: 1,
        question: `Számítsd ki!

|−3,5|`,
        answer: 3.5,
        type: 'multiplication',
        expression: `|−3,5| = 3,5`,
    },
    {
        stage: 1,
        question: `Számítsd ki!

√49`,
        answer: 7,
        type: 'multiplication',
        expression: `√49 = 7`,
    },
    {
        stage: 1,
        question: `Számítsd ki!

√81`,
        answer: 9,
        type: 'multiplication',
        expression: `√81 = 9`,
    },
    {
        stage: 1,
        question: `Számítsd ki!

√0,25`,
        answer: 0.5,
        type: 'multiplication',
        expression: `√0,25 = 0,5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x| = 5

Add meg a pozitív megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x − 2| = 3

Add meg a nagyobb megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

√x = 4

Add meg a megoldást!`,
        answer: 16,
        type: 'multiplication',
        expression: `x = 16`,
    },
    {
        stage: 1,
        question: `Oldd meg!

√(x + 3) = 5

Add meg a megoldást!`,
        answer: 22,
        type: 'multiplication',
        expression: `x = 22`,
    },
    {
        stage: 1,
        question: `√(x − 4) értelmezési tartománya: x ≥ …

Add meg a határt!`,
        answer: 4,
        type: 'multiplication',
        expression: `x ≥ 4`,
    },
    {
        stage: 1,
        question: `√(10 − 2x) értelmezési tartománya: x ≤ …

Add meg a határt!`,
        answer: 5,
        type: 'multiplication',
        expression: `x ≤ 5`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|2x| = 8

Add meg a pozitív megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x| + 3 = 7

Add meg a pozitív megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 1,
        question: `Oldd meg!

√(2x) = 6

Add meg a megoldást!`,
        answer: 18,
        type: 'multiplication',
        expression: `x = 18`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x + 1| = 0

Add meg a megoldást!`,
        answer: -1,
        type: 'multiplication',
        expression: `x = −1`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x| < 3

Add meg a felső határt (nyílt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x < 3`,
    },
    {
        stage: 1,
        question: `Számítsd ki x = 5 esetén!

|3 − x|`,
        answer: 2,
        type: 'multiplication',
        expression: `|3 − 5| = 2`,
    },
    {
        stage: 1,
        question: `Oldd meg!

√(9x) = 6

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 1,
        question: `Oldd meg!

|x − 5| = |x|

Add meg a megoldást!`,
        answer: 2.5,
        type: 'multiplication',
        expression: `x = 2,5`,
    },
    {
        stage: 2,
        question: `Határozd meg!

√(3x − 6)

Add meg az értelmezési tartomány alsó határát (zárt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≥ 2`,
    },
    {
        stage: 2,
        question: `Határozd meg!

√(8 − 2x)

Add meg az értelmezési tartomány felső határát (zárt)!`,
        answer: 4,
        type: 'multiplication',
        expression: `x ≤ 4`,
    },
    {
        stage: 2,
        question: `Határozd meg!

1/√(x + 4)

Add meg az értelmezési tartomány alsó határát (nyílt)!`,
        answer: -4,
        type: 'multiplication',
        expression: `x > −4`,
    },
    {
        stage: 2,
        question: `Határozd meg!

√((x − 2)(x + 5))

Add meg a [2, ∞) ág alsó határát!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≥ 2`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(x + 7) = x − 1

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 4.372,
        type: 'multiplication',
        expression: `x = (3+√33)/2`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(2x + 3) = x

Add meg a megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(13 − 2x) = x − 1

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 3.464,
        type: 'multiplication',
        expression: `x = 2√3`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(x + 6) = 2 − x

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: -0.372,
        type: 'multiplication',
        expression: `x = (5−√33)/2`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(4x + 5) = x + 1

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 3.236,
        type: 'multiplication',
        expression: `x = 1+√5`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(x + 1) = x − 5

Add meg a megoldást!`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(2x − 4) < 4

Add meg a felső határt (nyílt)!`,
        answer: 10,
        type: 'multiplication',
        expression: `x < 10`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(3x + 6) > 3

Add meg az alsó határt (nyílt)!`,
        answer: 1,
        type: 'multiplication',
        expression: `x > 1`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x − 3| = x + 1

Add meg a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x + 2| = 2x − 1

Add meg a megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x − 2| = |x + 4|

Add meg a megoldást!`,
        answer: -1,
        type: 'multiplication',
        expression: `x = −1`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x + 5| = |3x − 1|

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|x − 1| + |x + 2| = 5

Add meg a nagyobb megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 2,
        question: `Oldd meg!

|2x − 3| < 5

Add meg a felső határt (nyílt)!`,
        answer: 4,
        type: 'multiplication',
        expression: `x < 4`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(x²) = 4

Add meg a pozitív megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 2,
        question: `Oldd meg!

√(2x + 3) = |x|

Add meg a pozitív megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 3,
        question: `Határozd meg!

√((x − 1)/(x − 5))

Add meg a (−∞, 1] felső határát!`,
        answer: 1,
        type: 'multiplication',
        expression: `x ≤ 1`,
    },
    {
        stage: 3,
        question: `Határozd meg!

√(|x| − 3)

Add meg a pozitív ág alsó határát (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≥ 3`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(3x + 1) = x − 1

Add meg a megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(5 − x) = x − 1

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 2.192,
        type: 'multiplication',
        expression: `x = (3+√13)/2`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|x − 4| = 2x + 1

Add meg a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|3x − 2| = x + 6

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|2x + 1| = |x − 5|

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(x + 2) ≥ 3

Add meg az alsó határt (zárt)!`,
        answer: 7,
        type: 'multiplication',
        expression: `x ≥ 7`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(4 − x) < 2

Add meg a felső határt (nyílt)!`,
        answer: 4,
        type: 'multiplication',
        expression: `x < 4`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|x + 2| ≤ 5

Add meg a felső határt (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≤ 3`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|2x − 1| > 3

Add meg a pozitív ág alsó határát (nyílt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x > 2`,
    },
    {
        stage: 3,
        question: `Határozd meg!

√(x² − 9)

Add meg a (3, ∞) alsó határát (nyílt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x > 3`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(x + 5) = 1 − x

Add meg a megoldást!`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(2x − 1) = √(x + 3)

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|x| + |x − 2| = 6

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(x − 1) + 2 = 5

Add meg a megoldást!`,
        answer: 10,
        type: 'multiplication',
        expression: `x = 10`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|3 − 2x| = 5

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 3,
        question: `Határozd meg!

1/√(2 − x)

Add meg az értelmezési tartomány felső határát (nyílt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x < 2`,
    },
    {
        stage: 3,
        question: `Oldd meg!

√(x + 8) = 2√x

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 2.667,
        type: 'multiplication',
        expression: `x = 8/3`,
    },
    {
        stage: 3,
        question: `Oldd meg!

|x − 1| = √(2x + 7)

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 4,
        question: `Határozd meg!

√((2 − x)/(x + 3))

Add meg a felső határt (zárt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≤ 2`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(x + 5) − √(x − 3) = 1

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|x + 3| + |x − 1| = 8

Add meg a nagyobb megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|2x − 1| + |x + 2| = 9

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 2.667,
        type: 'multiplication',
        expression: `x = 8/3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(2x + 3) ≤ x

Add meg az alsó határt (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≥ 3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|x − 2| + |x + 1| < 5

Add meg a felső határt (nyílt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x < 3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(3x + 1) = 2 − x

Add meg a megoldást!`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 4,
        question: `√(x² − 5x + 6) „lyuka” (2, 3). Add meg a lyuk alsó határát (nyílt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `(2, 3)`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|x² − 1| = 3

Add meg a pozitív megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 4,
        question: `Határozd meg!

√(4 − x²)

Add meg a felső határt (zárt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≤ 2`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|2x + 3| = |5 − x|

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 0.667,
        type: 'multiplication',
        expression: `x = 2/3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(x + 3) = |x − 1|

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 3.562,
        type: 'multiplication',
        expression: `x = (3+√17)/2`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|x| − |x − 4| = 2

Add meg a megoldáshalmaz alsó határát (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≥ 3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(2x + 6) = |x|

Add meg a pozitív megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|2x − 5| ≥ 3

Add meg a pozitív ág alsó határát (zárt)!`,
        answer: 4,
        type: 'multiplication',
        expression: `x ≥ 4`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(x − 2) + √(x + 1) = 3

Add meg a megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 4,
        question: `Határozd meg!

√(x/(x − 2))

Add meg a (2, ∞) alsó határát (nyílt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x > 2`,
    },
    {
        stage: 4,
        question: `Oldd meg!

|3x − 6| + |x| = 9

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 3.75,
        type: 'multiplication',
        expression: `x = 3,75`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(x + 2) = 4 − √x

Add meg a megoldást 3 tizedesjeggyel!`,
        answer: 3.063,
        type: 'multiplication',
        expression: `x = 49/16`,
    },
    {
        stage: 4,
        question: `Oldd meg!

√(x + 4) − √(x − 1) = 1

Add meg a megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|x + 1| + |x − 2| + |x − 4| = 9

Add meg a nagyobb megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(x + 12) − √(x + 3) = 1

Add meg a megoldást!`,
        answer: 13,
        type: 'multiplication',
        expression: `x = 13`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(2x − 1) = √(x + 4)

Add meg a megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|x² − 5x + 6| = 2

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(x − 1) + √(x + 2) = 3

Add meg a megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 5,
        question: `Határozd meg!

√((x − 2)/(4 − x))

Add meg az alsó határt (zárt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `2 ≤ x < 4`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|2x − 3| − |x + 1| = 2

Add meg a megoldáshalmaz alsó határát (zárt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≥ 2`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(x + 6) ≥ x

Add meg a felső határt (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≤ 3`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|x| = √(x + 6)

Add meg a pozitív megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 5,
        question: `Határozd meg!

√(9 − x²)

Add meg a felső határt (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≤ 3`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(9 − x²) = x + 1

Add meg a megoldást!`,
        answer: 0,
        type: 'multiplication',
        expression: `x = 0`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|x − 2|² = 16

Add meg a nagyobb megoldást!`,
        answer: 6,
        type: 'multiplication',
        expression: `x = 6`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|x + 1| + |x − 2| ≥ 5

Add meg a pozitív ág alsó határát (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≥ 3`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(x + 4) − √(x − 1) = 1

Add meg a megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(x²) = 3 − 2x

Add meg a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|x − 3| · |x + 2| = 0

Add meg a pozitív megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 5,
        question: `Határozd meg!

1/√(x − 1) − 1/√(4 − x)

Add meg az alsó határt (nyílt)!`,
        answer: 1,
        type: 'multiplication',
        expression: `1 < x < 4`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(3x + 1) = |2x − 1|

Add meg a nagyobb megoldást!`,
        answer: 1.75,
        type: 'multiplication',
        expression: `x = 7/4`,
    },
    {
        stage: 5,
        question: `Oldd meg!

√(2x + 1) + √(x − 3) = 4

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 5,
        question: `Oldd meg!

|x − 2| · |x + 1| = 4

Add meg a pozitív megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 6,
        question: `Határozd meg!

√((x² − 4)/(x − 3))

Add meg a [2, 3) ág alsó határát!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≥ 2`,
    },
    {
        stage: 6,
        question: `Oldd meg!

|x − 1| + |x − 3| + |x − 8| = 12

Add meg a nagyobb megoldást!`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(x + 3) + √(2 − x) = 3

Add meg a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(x² − 2x − 8) = x − 2

Add meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 6,
        question: `Oldd meg!

|x² − 4| = 3x

Add meg a nagyobb megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(2x + 3) − √(x − 1) = 1

Add meg a megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(x + 5) = |2x − 1|

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 1.804,
        type: 'multiplication',
        expression: `x = (5+√89)/8`,
    },
    {
        stage: 6,
        question: `Határozd meg!

1 / √(x² − 5x + 6)

Add meg a kizárt intervallum alsó határát!`,
        answer: 2,
        type: 'multiplication',
        expression: `x < 2 vagy x > 3`,
    },
    {
        stage: 6,
        question: `Oldd meg!

|x − 2| + |x + 2| = 6

Add meg a felső határt (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ≤ 3`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(4x − 3) = 2 − √(x − 1)

Add meg a megoldást!`,
        answer: 1,
        type: 'multiplication',
        expression: `x = 1`,
    },
    {
        stage: 6,
        question: `Oldd meg!

|x − 2| · |x + 1| = 4

Add meg a pozitív megoldást!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = 3`,
    },
    {
        stage: 6,
        question: `Határozd meg!

√(x − 2) / √(5 − x)

Add meg az alsó határt (zárt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `2 ≤ x < 5`,
    },
    {
        stage: 6,
        question: `Oldd meg!

|x| + |x − 2| = √(x + 7)

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 2.545,
        type: 'multiplication',
        expression: `x = (9+√129)/8`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(3 − x) ≥ x − 1

Add meg a felső határt (zárt)!`,
        answer: 2,
        type: 'multiplication',
        expression: `x ≤ 2`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(x + 1) = 2|x − 1|

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 1.843,
        type: 'multiplication',
        expression: `x = (9+√33)/8`,
    },
    {
        stage: 6,
        question: `Oldd meg!

|2x − 1| = √(x + 5)

Add meg a nagyobb megoldást 3 tizedesjeggyel!`,
        answer: 1.804,
        type: 'multiplication',
        expression: `x = (5+√89)/8`,
    },
    {
        stage: 6,
        question: `Határozd meg!

√(x² − 9) / (x − 4)

Add meg a [3, ∞) ág alsó határát!`,
        answer: 3,
        type: 'multiplication',
        expression: `|x| ≥ 3, x ≠ 4`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(5 − 2x) = |x − 1|

Add meg a pozitív megoldást!`,
        answer: 2,
        type: 'multiplication',
        expression: `x = 2`,
    },
    {
        stage: 6,
        question: `Oldd meg!

√(x − 3) + √(6 − x) = √6

Add meg a megoldást!`,
        answer: 4.5,
        type: 'multiplication',
        expression: `x = 4,5`,
    },
    {
        stage: 6,
        question: `Oldd meg!

|x² − 9| = 7|x|

Add meg a nagyobb pozitív megoldást 3 tizedesjeggyel!`,
        answer: 8.109,
        type: 'multiplication',
        expression: `x = (7+√85)/2`,
    },
];
