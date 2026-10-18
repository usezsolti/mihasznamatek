import type { Question } from './types';

/**
 * MiHasznaMatek minta-zárthelyi, B változat.
 * Halmazok, sorozatok és függvények. Összesen 50 pont.
 * A kidolgozás a hivatalos megoldókulcsot követi.
 */

const T = 'multiplication' as const;

function card(
    id: string,
    question: string,
    answer: number,
    expression: string,
    extra?: { expectedSet?: string[]; acceptedAnswers?: string[]; answerHint?: string }
): Question {
    return { id, question, answer, type: T, expression, level: 'zh', ...extra };
}

const SET_SOLUTION = `A∩C: ami A-ban és C-ben is benne van, a hármas metszettel együtt.
B∖(A∪C): ami csak B-ben van, A-n és C-n kívül.
A két rész unióját színezzük. Más rész nem kell.
Beszínezendő kódok: AC, ABC és B.`;

const MONO_SOLUTION = `aₙ = (2−3n)/(n+2).
aₙ₊₁ = (2−3(n+1))/(n+3) = (−3n−1)/(n+3).
aₙ₊₁ − aₙ = [(−3n−1)(n+2) − (2−3n)(n+3)] / [(n+2)(n+3)]
= [(−3n²−7n−2) − (−3n²−7n+6)] / [(n+2)(n+3)]
= −8 / [(n+2)(n+3)] < 0.
A nevező n ≥ 1-re pozitív, a számláló negatív, ezért a sorozat szigorúan monoton csökkenő.
Másképp: aₙ = −3 + 8/(n+2), és a pozitív tört n növelésével csökken.`;

const DOMAIN_SOLUTION = `Három feltétel együtt:
1. ln(x+2) miatt x+2 > 0, azaz x > −2.
2. A nevező nem nulla: ln(x+2) ≠ 0, azaz x+2 ≠ 1, tehát x ≠ −1.
3. A gyök miatt 4−x ≥ 0, azaz x ≤ 4.
D_f = (−2, −1) ∪ (−1, 4].
A −2 nincs benne (ln 0 nem értelmezett), a −1 sincs (a nevező 0 lenne), a 4 benne van (a gyök lehet 0).`;

const COMP_SOLUTION = `Először g, utána f.
(f∘g)(x) = cos(2 − √(x−3)).
A gyök miatt x−3 ≥ 0, vagyis x ≥ 3.
A koszinusz minden valós számon értelmezett, további feltételt nem ad.
D_{f∘g} = [3, +∞).`;

const INV_SOLUTION = `D_f = ℝ ∖ {−2}.
y = 3/(x+2)
y(x+2) = 3
x+2 = 3/y, ha y ≠ 0
x = 3/y − 2.
A függvény a 0-t nem veszi fel, és minden y ≠ 0-hoz pontosan egy x tartozik, ami nem −2.
f⁻¹(x) = 3/x − 2, D_{f⁻¹} = ℝ ∖ {0}.
Ellenőrzés: f(f⁻¹(x)) = 3 / ((3/x − 2) + 2) = x.`;

const LIM_SOLUTION = `∞/∞ alak, először át kell alakítani.
x²−5x+6 = (x−2)(x−3).
x ≠ 2 esetén a tört = (x−2)(x−3)/(x−2) = x−3.
Az x = 2 a +∞-beli határértéket nem befolyásolja.
lim (x→+∞) (x−3) = +∞, véges határérték nincs.
Pontos indoklás: bármely K > 0-hoz X = K+3. Ha x > X, akkor x > 3, az egyszerűsítés megengedett, és a tört értéke x−3 > K.`;

export const zhAnalizis1MintaB: Question[] = [
    card(
        'zh-a1-b-1',
        `1. Halmazműveletek (5 pont)
Színezd ki a Venn-diagramon: (A∩C) ∪ (B∖(A∪C)).
A részek kódja: A, B, C, AB, AC, BC, ABC.
Írd be a beszínezendő kódokat.`,
        3,
        SET_SOLUTION,
        { expectedSet: ['ac', 'abc', 'b'], answerHint: 'pl. A; AB; C' }
    ),

    card(
        'zh-a1-b-2',
        `2. Sorozat monotonitása (7 pont)
aₙ = (2−3n)/(n+2), n = 1, 2, 3, …
Milyen a sorozat? Írd be a választ.`,
        0,
        MONO_SOLUTION,
        {
            acceptedAnswers: [
                'szigorúan monoton csökkenő',
                'szigorúan csökkenő',
                'monoton csökkenő',
                'csökkenő',
            ],
            answerHint: 'pl. szigorúan növő',
        }
    ),
    card(
        'zh-a1-b-2b',
        `2. Sorozat monotonitása (7 pont)
aₙ = (2−3n)/(n+2).
Az aₙ₊₁ − aₙ különbség egyszerűsített számlálója mennyi?`,
        -8,
        MONO_SOLUTION
    ),

    card(
        'zh-a1-b-3',
        `3. Értelmezési tartomány (8 pont)
f(x) = 1/ln(x+2) − √(4−x).
Írd be a teljes értelmezési tartományt.`,
        0,
        DOMAIN_SOLUTION,
        {
            acceptedAnswers: [
                '(-2,-1) U (-1,4]',
                ']-2,-1[ U ]-1,4]',
                '(-2;-1) ∪ (-1;4]',
                'D_f = (-2,-1) ∪ (-1,4]',
            ],
            answerHint: 'pl. (-1,0] U [2,5)',
        }
    ),

    card(
        'zh-a1-b-4',
        `4. Függvénykompozíció (9 pont)
f(x) = cos(2−x), g(x) = √(x−3).
Írd be az f(g(x)) képletét.`,
        0,
        COMP_SOLUTION,
        {
            acceptedAnswers: [
                'cos(2-sqrt(x-3))',
                'cos(2-√(x-3))',
                'f(g(x)) = cos(2-gyok(x-3))',
                '\\cos(2-\\sqrt{x-3})',
            ],
            answerHint: 'pl. sin(x+1)',
        }
    ),
    card(
        'zh-a1-b-4b',
        `4. Függvénykompozíció (9 pont)
f(x) = cos(2−x), g(x) = √(x−3).
Írd be az f(g(x)) értelmezési tartományát.`,
        0,
        COMP_SOLUTION,
        {
            acceptedAnswers: [
                '[3,+∞)',
                '[3,∞)',
                '[3,+inf)',
                '[3, végtelen)',
                'D = [3,+∞)',
                '[3,+∞[',
            ],
            answerHint: 'pl. [1,+∞)',
        }
    ),

    card(
        'zh-a1-b-5',
        `5. Inverz függvény (6 pont)
f(x) = 3/(x+2), a természetes tartományán.
Írd be az inverz képletét.`,
        0,
        INV_SOLUTION,
        {
            acceptedAnswers: [
                '3/x-2',
                '(3/x)-2',
                '3/x−2',
                'f^{-1}(x) = 3/x - 2',
                '\\frac{3}{x}-2',
            ],
            answerHint: 'pl. 2/x+1',
        }
    ),
    card(
        'zh-a1-b-5b',
        `5. Inverz függvény (6 pont)
f(x) = 3/(x+2).
Írd be az inverz értelmezési tartományát.`,
        0,
        INV_SOLUTION,
        {
            acceptedAnswers: [
                'R \\ {0}',
                'ℝ ∖ {0}',
                'R-{0}',
                'R kivéve 0',
                '(-∞,0) U (0,∞)',
                '(-∞,0) ∪ (0,+∞)',
            ],
            answerHint: 'pl. R \\ {1}',
        }
    ),

    card(
        'zh-a1-b-6',
        `6. Határérték a végtelenben (15 pont)
lim (x→+∞) (x²−5x+6)/(x−2).
Írd be a határértéket.`,
        0,
        LIM_SOLUTION,
        {
            acceptedAnswers: ['+∞', '∞', '+végtelen', 'végtelen', '+infinity'],
            answerHint: 'pl. 0 vagy +∞',
        }
    ),
    card(
        'zh-a1-b-6b',
        `6. Határérték a végtelenben (15 pont)
lim (x→+∞) (x²−5x+6)/(x−2).
Egyszerűsítés után mi a kifejezés? Írd be.`,
        0,
        LIM_SOLUTION,
        {
            acceptedAnswers: ['x-3', 'x−3'],
            answerHint: 'pl. x+1',
        }
    ),
];

export function getZhAnalizis1MintaBQuestions(): Question[] {
    return zhAnalizis1MintaB;
}
