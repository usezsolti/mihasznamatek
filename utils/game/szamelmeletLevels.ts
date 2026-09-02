import type { Question } from './types';

/**
 * Számelmélet — 6 szint × 20 feladat (Számelmélet.pdf).
 * 1 Oszthatóság → 2 Számjegyek / számrendszerek → 3 LNKO–LKKT / diofantosz →
 * 4 Kongruenciák → 5 Összetett → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getSzamelmeletPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Bontsd prímtényezőkre a 756 számot!
Add meg a 3 kitevőjét a felbontásban!`,
        answer: 3,
        type: 'multiplication',
        expression: `756 = 2² · 3³ · 7`,
    },
    {
        stage: 1,
        question: `Határozd meg a 360 pozitív osztóinak számát!`,
        answer: 24,
        type: 'multiplication',
        expression: `360 = 2³ · 3² · 5, τ = 4 · 3 · 2 = 24`,
    },
    {
        stage: 1,
        question: `Határozd meg: lnko(252, 198).`,
        answer: 18,
        type: 'multiplication',
        expression: `lnko(252, 198) = 18`,
    },
    {
        stage: 1,
        question: `Határozd meg: lkkt(84, 126).`,
        answer: 252,
        type: 'multiplication',
        expression: `lkkt(84, 126) = 252`,
    },
    {
        stage: 1,
        question: `Határozd meg a c számjegyet úgy, hogy 42c osztható legyen 6-tal!

Add meg a lehetséges számjegyek halmazát!`,
        answer: 2,
        expectedSet: ['0', '6'],
        type: 'multiplication',
        expression: `c ∈ {0, 6}`,
    },
    {
        stage: 1,
        question: `Határozd meg az a számjegyet úgy, hogy 73a24 osztható legyen 9-cel!

Add meg a lehetséges számjegyek halmazát!`,
        answer: 2,
        expectedSet: ['0', '9'],
        type: 'multiplication',
        expression: `a = 0 vagy 9`,
    },
    {
        stage: 1,
        question: `Határozd meg a b számjegyet úgy, hogy 47b5 osztható legyen 15-tel!

Add meg a lehetséges számjegyek halmazát!`,
        answer: 4,
        expectedSet: ['0', '3', '6', '9'],
        type: 'multiplication',
        expression: `b ∈ {0, 3, 6, 9}`,
    },
    {
        stage: 1,
        question: `Mennyi 437 osztási maradéka 7-tel?`,
        answer: 3,
        type: 'multiplication',
        expression: `437 = 62 · 7 + 3`,
    },
    {
        stage: 1,
        question: `Melyik a legnagyobb kétjegyű pozitív egész, amely 6-tal és 8-cal is osztható?`,
        answer: 96,
        type: 'multiplication',
        expression: `lkkt(6, 8) = 24; 96 = 4 · 24`,
    },
    {
        stage: 1,
        question: `Melyik a legkisebb pozitív egész, amely 12-vel, 15-tel és 18-cal is osztható?`,
        answer: 180,
        type: 'multiplication',
        expression: `lkkt(12, 15, 18) = 180`,
    },
    {
        stage: 1,
        question: `Sorold fel a 72 pozitív osztóit!

Add meg az osztók halmazát!`,
        answer: 12,
        expectedSet: ['1', '2', '3', '4', '6', '8', '9', '12', '18', '24', '36', '72'],
        type: 'multiplication',
        expression: `1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72`,
    },
    {
        stage: 1,
        question: `Határozd meg a 28 pozitív valódi osztóinak összegét!`,
        answer: 28,
        type: 'multiplication',
        expression: `1 + 2 + 4 + 7 + 14 = 28`,
    },
    {
        stage: 1,
        question: `Relatív prím-e egymáshoz a 35 és a 64?
(1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `lnko(35, 64) = 1`,
    },
    {
        stage: 1,
        question: `Melyik a 100-nál nagyobb legkisebb prímszám?`,
        answer: 101,
        type: 'multiplication',
        expression: `101 prím`,
    },
    {
        stage: 1,
        question: `Két pozitív egész LNKO-ja 12, LKKT-ja 420. Mennyi a két szám szorzata?`,
        answer: 5040,
        type: 'multiplication',
        expression: `lnko · lkkt = 12 · 420 = 5040`,
    },
    {
        stage: 1,
        question: `A N = 2⁸ · 3³ számnak hány olyan pozitív osztója van, amely 12-vel osztható?`,
        answer: 21,
        type: 'multiplication',
        expression: `12 = 2² · 3; kitevők: 7 · 3 = 21`,
    },
    {
        stage: 1,
        question: `Határozd meg a legkisebb pozitív egész x-et, amelyre 4x + 7 osztható 9-cel!`,
        answer: 5,
        type: 'multiplication',
        expression: `4 · 5 + 7 = 27`,
    },
    {
        stage: 1,
        question: `Igaz-e, hogy két egymást követő egész szám szorzata mindig páros?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Az egyik páros`,
    },
    {
        stage: 1,
        question: `Igaz-e, hogy három egymást követő egész szám között mindig van 3-mal osztható?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Három maradékosztály`,
    },
    {
        stage: 1,
        question: `Igaz vagy hamis? Ha egy szám osztható 18-cal, akkor biztosan osztható 6-tal és 9-cel is.
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `18 = 2 · 9 és 18 = 3 · 6`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Az 1, 2, 3, 4, 5 számjegyeket mind pontosan egyszer felhasználva hány ötjegyű szám osztható 6-tal?`,
        answer: 48,
        type: 'multiplication',
        expression: `Számjegyösszeg 15 (osztható 3-mal); utolsó jegy 2 vagy 4: 2 · 4! = 48`,
    },
    {
        stage: 2,
        question: `A 0, 1, 2, 3, 4 számjegyeket mind pontosan egyszer felhasználva hány ötjegyű szám osztható 4-gyel?`,
        answer: 24,
        type: 'multiplication',
        expression: `Első jegy ≠ 0, utolsó két jegy osztható 4-gyel: 24`,
    },
    {
        stage: 2,
        question: `Határozd meg az a számjegyet úgy, hogy 73a2 osztható legyen 9-cel!`,
        answer: 6,
        type: 'multiplication',
        expression: `7+3+a+2 = 12+a osztható 9-cel → a = 6`,
    },
    {
        stage: 2,
        question: `Határozd meg a b számjegyet úgy, hogy 4b56 osztható legyen 8-cal!

Add meg a lehetséges számjegyek halmazát!`,
        answer: 5,
        expectedSet: ['0', '2', '4', '6', '8'],
        type: 'multiplication',
        expression: `b ∈ {0, 2, 4, 6, 8}`,
    },
    {
        stage: 2,
        question: `Határozd meg a nemnulla c számjegyet úgy, hogy c35c osztható legyen 15-tel!`,
        answer: 5,
        type: 'multiplication',
        expression: `c = 5`,
    },
    {
        stage: 2,
        question: `Minden abba alakú négyjegyű szám osztható 11-gyel.
Add meg az alternáló számjegyösszeget!`,
        answer: 0,
        type: 'multiplication',
        expression: `a − b + b − a = 0`,
    },
    {
        stage: 2,
        question: `Írd át tízes számrendszerbe: 101101₂.`,
        answer: 45,
        type: 'multiplication',
        expression: `32+8+4+1 = 45`,
    },
    {
        stage: 2,
        question: `Írd át nyolcas számrendszerbe: 157₁₀.
Add meg a nyolcas számrendszerbeli számot számjegyként!`,
        answer: 235,
        type: 'multiplication',
        expression: `157 = 2 · 64 + 3 · 8 + 5 → 235₈`,
    },
    {
        stage: 2,
        question: `Írd át tízes számrendszerbe: 342₅.`,
        answer: 97,
        type: 'multiplication',
        expression: `3 · 25 + 4 · 5 + 2 = 97`,
    },
    {
        stage: 2,
        question: `Határozd meg az 1a3₄ szám tízes értékét minden megengedett a számjegyre!

Add meg a lehetséges értékek halmazát!`,
        answer: 4,
        expectedSet: ['19', '23', '27', '31'],
        type: 'multiplication',
        expression: `19, 23, 27, 31`,
    },
    {
        stage: 2,
        question: `Mekkora a hetes számrendszer legnagyobb háromjegyű pozitív egész számának tízes értéke?`,
        answer: 342,
        type: 'multiplication',
        expression: `666₇ = 6 · 49 + 6 · 7 + 6 = 342`,
    },
    {
        stage: 2,
        question: `Mekkora az ötös számrendszer legkisebb négyjegyű pozitív egész számának tízes értéke?`,
        answer: 125,
        type: 'multiplication',
        expression: `1000₅ = 5³ = 125`,
    },
    {
        stage: 2,
        question: `Hány háromjegyű pozitív egész szám van a hármas számrendszerben?`,
        answer: 18,
        type: 'multiplication',
        expression: `222₃ − 100₃ + 1 = 26 − 9 + 1 = 18`,
    },
    {
        stage: 2,
        question: `Igaz-e a 3-mal való oszthatóság számjegyösszeges szabálya?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `10 ≡ 1 (mod 3)`,
    },
    {
        stage: 2,
        question: `Igaz-e a 4-gyel való oszthatóság utolsó két számjegyre vonatkozó szabálya?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `100 osztható 4-gyel`,
    },
    {
        stage: 2,
        question: `Osztható-e 11-gyel az 53856?
(1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `5 − 3 + 8 − 5 + 6 = 11`,
    },
    {
        stage: 2,
        question: `Határozd meg az x, y számjegyeket úgy, hogy 3x5y osztható legyen 36-tal.
Add meg x + y értékét!`,
        answer: 10,
        type: 'multiplication',
        expression: `(x, y) = (8, 2) vagy (4, 6); x + y = 10`,
    },
    {
        stage: 2,
        question: `Hány hétjegyű kettes számrendszerbeli pozitív egészben van legfeljebb két 0?`,
        answer: 22,
        type: 'multiplication',
        expression: `Első jegy 1: 1 + 6 + C(6,2) = 22`,
    },
    {
        stage: 2,
        question: `Hány pozitív háromjegyű tízes számrendszerbeli egész osztható a 8 és a 9 közül legalább az egyikkel?`,
        answer: 200,
        type: 'multiplication',
        expression: `⌊999/8⌋−⌊99/8⌋ + ⌊999/9⌋−⌊99/9⌋ − (⌊999/72⌋−⌊99/72⌋) = 200`,
    },
    {
        stage: 2,
        question: `Hány olyan nyolcas számrendszerbeli háromjegyű pozitív egész van, amely kilences számrendszerben is háromjegyű?`,
        answer: 431,
        type: 'multiplication',
        expression: `81-től 511-ig: 511 − 81 + 1 = 431`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Határozd meg lnko(2⁵ · 3² · 5, 2³ · 3⁴ · 7) értékét!`,
        answer: 72,
        type: 'multiplication',
        expression: `2³ · 3² = 72`,
    },
    {
        stage: 3,
        question: `Határozd meg ugyanennek a két számnak az LKKT-ját!`,
        answer: 90720,
        type: 'multiplication',
        expression: `2⁵ · 3⁴ · 5 · 7 = 90720`,
    },
    {
        stage: 3,
        question: `Két pozitív egész LNKO-ja 18, LKKT-ja 630. Mennyi a szorzatuk?`,
        answer: 11340,
        type: 'multiplication',
        expression: `18 · 630 = 11340`,
    },
    {
        stage: 3,
        question: `Határozd meg n-et, ha lnko(n, 84) = 12 és lkkt(n, 84) = 420!`,
        answer: 60,
        type: 'multiplication',
        expression: `n · 84 = 12 · 420 → n = 60`,
    },
    {
        stage: 3,
        question: `Tudjuk, hogy lkkt(60, n) = 1260. Melyik a legkisebb lehetséges pozitív egész n?`,
        answer: 63,
        type: 'multiplication',
        expression: `6 lehetséges n; a legkisebb 63`,
    },
    {
        stage: 3,
        question: `Hány pozitív osztója van a 840 számnak?`,
        answer: 32,
        type: 'multiplication',
        expression: `840 = 2³ · 3 · 5 · 7, τ = 4 · 2 · 2 · 2 = 32`,
    },
    {
        stage: 3,
        question: `Határozd meg a 72 összes pozitív osztójának összegét!`,
        answer: 195,
        type: 'multiplication',
        expression: `(1+2+4+8)(1+3+9) = 15 · 13 = 195`,
    },
    {
        stage: 3,
        question: `Hány négyzetszám osztója van a 2⁸ · 3⁵ · 5² számnak?`,
        answer: 30,
        type: 'multiplication',
        expression: `Páros kitevők: 5 · 3 · 2 = 30`,
    },
    {
        stage: 3,
        question: `Melyik a legkisebb pozitív egész k, amelyre k · 6! négyzetszám?`,
        answer: 5,
        type: 'multiplication',
        expression: `6! = 2⁴ · 3² · 5, kell még egy 5`,
    },
    {
        stage: 3,
        question: `Hány 1000-nél kisebb pozitív egész k esetén négyzetszám k · 6!?`,
        answer: 14,
        type: 'multiplication',
        expression: `k = 5 · a², a² < 200; 14 ilyen k`,
    },
    {
        stage: 3,
        question: `Adj meg egy egész megoldást: 84x + 30y = 6.
Add meg y-t a x = −1 megoldásban!`,
        answer: 3,
        type: 'multiplication',
        expression: `x = −1, y = 3`,
    },
    {
        stage: 3,
        question: `Hány pozitív egész megoldáspárja van a 2x + 3y = 24 egyenletnek?`,
        answer: 3,
        type: 'multiplication',
        expression: `(3,6), (6,4), (9,2)`,
    },
    {
        stage: 3,
        question: `Határozd meg a pozitív egész n-et: n(n + 1) = 72.`,
        answer: 8,
        type: 'multiplication',
        expression: `8 · 9 = 72`,
    },
    {
        stage: 3,
        question: `Hány 20-nál kisebb prímszám p esetén prímszám p + 2 is?`,
        answer: 4,
        type: 'multiplication',
        expression: `(3,5), (5,7), (11,13), (17,19)`,
    },
    {
        stage: 3,
        question: `Hány pozitív egész n-hez létezik prímszám p, hogy n² − pn pozitív prímszám legyen?`,
        answer: 1,
        type: 'multiplication',
        expression: `Csak n = 3, p = 2`,
    },
    {
        stage: 3,
        question: `Határozd meg az összes prímszámot p, amelyre p + 1 is prímszám!`,
        answer: 2,
        type: 'multiplication',
        expression: `Csak p = 2`,
    },
    {
        stage: 3,
        question: `Igaz-e: ha p > 3 prímszám, akkor p² ≡ 1 (mod 24)?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `p ≡ ±1 (mod 6), sőt 24 | (p²−1)`,
    },
    {
        stage: 3,
        question: `Hány pozitív osztója van a 10! számnak?`,
        answer: 270,
        type: 'multiplication',
        expression: `10! = 2⁸ · 3⁴ · 5² · 7, τ = 9 · 5 · 3 · 2 = 270`,
    },
    {
        stage: 3,
        question: `Hány nullára végződik a 100!?`,
        answer: 24,
        type: 'multiplication',
        expression: `⌊100/5⌋ + ⌊100/25⌋ = 24`,
    },
    {
        stage: 3,
        question: `Mekkora a 2 kitevője a 100! prímtényezős felbontásában?`,
        answer: 97,
        type: 'multiplication',
        expression: `50+25+12+6+3+1 = 97`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Határozd meg 2²⁰ maradékát 7-tel osztva!`,
        answer: 4,
        type: 'multiplication',
        expression: `2³ ≡ 1 (mod 7), 2²⁰ = 2¹⁸ · 4 ≡ 4`,
    },
    {
        stage: 4,
        question: `Határozd meg 3⁵⁰ maradékát 8-cal osztva!`,
        answer: 1,
        type: 'multiplication',
        expression: `3² ≡ 1 (mod 8), 50 páros`,
    },
    {
        stage: 4,
        question: `Határozd meg 7¹⁰⁰ utolsó számjegyét!`,
        answer: 1,
        type: 'multiplication',
        expression: `Ciklus 7,9,3,1; 100 ≡ 0 (mod 4)`,
    },
    {
        stage: 4,
        question: `Határozd meg 13²⁰²⁶ utolsó számjegyét!`,
        answer: 9,
        type: 'multiplication',
        expression: `Ciklus 3,9,7,1; 2026 ≡ 2 (mod 4)`,
    },
    {
        stage: 4,
        question: `Határozd meg 7²⁰ utolsó két számjegyéből álló számot!`,
        answer: 1,
        type: 'multiplication',
        expression: `7⁴ ≡ 01 (mod 100), 7²⁰ ≡ 01`,
    },
    {
        stage: 4,
        question: `Határozd meg 2³⁰ + 3²⁰ maradékát 5-tel osztva!`,
        answer: 0,
        type: 'multiplication',
        expression: `2³⁰ ≡ 4, 3²⁰ ≡ 1 (mod 5); 4+1 ≡ 0`,
    },
    {
        stage: 4,
        question: `Igaz-e, hogy minden pozitív egész n-re 4ⁿ + 6ⁿ − 1 osztható 9-cel?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `Igaz-e, hogy nincs pozitív egész n, amelyre 4ⁿ + 6ⁿ − 1 osztható 8-cal?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `Oldd meg: 3x ≡ 4 (mod 7).
Add meg a 0 és 6 közötti megoldást!`,
        answer: 6,
        type: 'multiplication',
        expression: `x ≡ 6 (mod 7)`,
    },
    {
        stage: 4,
        question: `Oldd meg: 5x ≡ 1 (mod 12).
Add meg a 0 és 11 közötti megoldást!`,
        answer: 5,
        type: 'multiplication',
        expression: `x ≡ 5 (mod 12)`,
    },
    {
        stage: 4,
        question: `Határozd meg a legkisebb pozitív egész x-et, amelyre x ≡ 2 (mod 3) és x ≡ 3 (mod 5)!`,
        answer: 8,
        type: 'multiplication',
        expression: `x = 8`,
    },
    {
        stage: 4,
        question: `Oldd meg: x ≡ 1 (mod 4), x ≡ 2 (mod 5), x ≡ 3 (mod 7).
Add meg a 0 és 139 közötti megoldást!`,
        answer: 17,
        type: 'multiplication',
        expression: `x ≡ 17 (mod 140)`,
    },
    {
        stage: 4,
        question: `Létezik-e egész n, amelyre n ≡ 2 (mod 6) és n ≡ 1 (mod 15)?
(1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem, ellentmondás mod 3`,
    },
    {
        stage: 4,
        question: `Határozd meg 9²⁰²⁵ + 7²⁰²⁵ utolsó számjegyét!`,
        answer: 6,
        type: 'multiplication',
        expression: `9 páratlan kitevőn 9; 7 kitevő 2025 ≡ 1 (mod 4) → 7; 9+7 → 6`,
    },
    {
        stage: 4,
        question: `Igaz-e, hogy minden páratlan n-re n² ≡ 1 (mod 8)?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `Igaz-e, hogy n³ − n minden egész n-re osztható 6-tal?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `n(n−1)(n+1)`,
    },
    {
        stage: 4,
        question: `Igaz-e, hogy n⁵ − n minden egész n-re osztható 30-cal?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `Igaz-e, hogy négyzetszám 4-gyel osztva csak 0 vagy 1 maradékot ad?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `Ha a ≡ b (mod m), igaz-e, hogy aᵏ ≡ bᵏ (mod m) minden pozitív egész k-ra?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `A TAJ-jellegű súlyozási szabállyal határozd meg a 24165379 számjegysor ellenőrző számjegyét!`,
        answer: 9,
        type: 'multiplication',
        expression: `Ellenőrző jegy: 9`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Hány pozitív háromjegyű szám osztható a 8 és a 9 közül legalább az egyikkel?`,
        answer: 200,
        type: 'multiplication',
        expression: `Ugyanaz, mint a 2. szint 19. feladata: 200`,
    },
    {
        stage: 5,
        question: `Hány 90-nél nem nagyobb pozitív egész osztható a 2, 3, 5 közül pontosan az egyikkel?`,
        answer: 42,
        type: 'multiplication',
        expression: `42`,
    },
    {
        stage: 5,
        question: `Az 1, 2, 4, 5, 9 számjegyeket egyszer felhasználva hány 12-vel osztható ötjegyű szám képezhető?`,
        answer: 24,
        type: 'multiplication',
        expression: `24`,
    },
    {
        stage: 5,
        question: `Hány hétjegyű kettes számrendszerbeli pozitív egészben van legfeljebb két 0?`,
        answer: 22,
        type: 'multiplication',
        expression: `22`,
    },
    {
        stage: 5,
        question: `Hány olyan pozitív tízes számrendszerbeli egész van, amelynek számjegyösszege és számjegyszorzata is 12?`,
        answer: 240,
        type: 'multiplication',
        expression: `240`,
    },
    {
        stage: 5,
        question: `Melyik a legnagyobb természetes szám, amely a következő négy feltételből pontosan hármat teljesít: húszjegyű; 20-szal osztható; számjegyösszege 20; számjegyszorzata 20?
Add meg az első három számjegyét!`,
        answer: 992,
        type: 'multiplication',
        expression: `992, majd 17 nulla`,
    },
    {
        stage: 5,
        question: `Az n jegyű pozitív egészek több mint 99%-a tartalmaz legalább egy 7-est. Mi a legkisebb n?`,
        answer: 44,
        type: 'multiplication',
        expression: `n = 44`,
    },
    {
        stage: 5,
        question: `Hány húszjegyű pozitív egész nem tartalmaz 7-est?
A szám 8 · 9ᵏ alakú. Add meg k-t!`,
        answer: 19,
        type: 'multiplication',
        expression: `8 · 9¹⁹, a legalább egy 7-est tartalmazók: 9 · 10¹⁹ − 8 · 9¹⁹`,
    },
    {
        stage: 5,
        question: `Határozd meg a 24165379 számjegysor TAJ-jellegű ellenőrző számjegyét!`,
        answer: 9,
        type: 'multiplication',
        expression: `9`,
    },
    {
        stage: 5,
        question: `Egy TAJ-jellegű számból az első számjegyet letakartuk: _14564797. Határozd meg a hiányzó jegyet!`,
        answer: 1,
        type: 'multiplication',
        expression: `1`,
    },
    {
        stage: 5,
        question: `Határozd meg az ellenőrző számjegy lehetséges értékeit a 02563abba alakú kódban!

Add meg a lehetséges jegyek halmazát!`,
        answer: 2,
        expectedSet: ['0', '5'],
        type: 'multiplication',
        expression: `0 vagy 5`,
    },
    {
        stage: 5,
        question: `Hány 1000-nél nem nagyobb pozitív egész osztható 12-vel, de nem 18-cal?`,
        answer: 56,
        type: 'multiplication',
        expression: `⌊1000/12⌋ − ⌊1000/36⌋ = 83 − 27 = 56`,
    },
    {
        stage: 5,
        question: `Hány 1000-nél nem nagyobb pozitív egész relatív prím 10-hez?`,
        answer: 400,
        type: 'multiplication',
        expression: `Nem osztható 2-vel és 5-tel: 400`,
    },
    {
        stage: 5,
        question: `Határozd meg: φ(84).`,
        answer: 24,
        type: 'multiplication',
        expression: `φ(84) = 84 · (1−1/2) · (1−1/3) · (1−1/7) = 24`,
    },
    {
        stage: 5,
        question: `Oldd meg: x² ≡ 1 (mod 15).
Add meg a 0 és 14 közötti megoldások halmazát!`,
        answer: 4,
        expectedSet: ['1', '4', '11', '14'],
        type: 'multiplication',
        expression: `x ≡ 1, 4, 11, 14 (mod 15)`,
    },
    {
        stage: 5,
        question: `Határozd meg a 360 összes pozitív osztójának összegét!`,
        answer: 1170,
        type: 'multiplication',
        expression: `360 = 2³ · 3² · 5; σ = 15 · 13 · 6 = 1170`,
    },
    {
        stage: 5,
        question: `Hány 1 és 1000 közötti pozitív egész relatív prím 1000-hez?`,
        answer: 400,
        type: 'multiplication',
        expression: `φ(1000) = 400`,
    },
    {
        stage: 5,
        question: `Melyik a legkisebb pozitív egész szám, amelynek pontosan 12 pozitív osztója van?`,
        answer: 60,
        type: 'multiplication',
        expression: `60 = 2² · 3 · 5, τ = 12`,
    },
    {
        stage: 5,
        question: `Melyik a legkisebb pozitív egész szám, amelynek pontosan 15 pozitív osztója van?`,
        answer: 144,
        type: 'multiplication',
        expression: `144 = 2⁴ · 3², τ = 5 · 3 = 15`,
    },
    {
        stage: 5,
        question: `Hány négyzetszám osztója van a 3600 számnak?`,
        answer: 12,
        type: 'multiplication',
        expression: `3600 = 2⁴ · 3² · 5²; páros kitevők: 3 · 2 · 2 = 12`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Eukleidész gondolatmenete szerint végtelen sok prímszám létezik.
Igaz-e ez? (1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Végtelen sok prímszám létezik`,
    },
    {
        stage: 6,
        question: `Igaz-e, hogy √2 irracionális?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `√2 ∉ ℚ`,
    },
    {
        stage: 6,
        question: `Két egymást követő pozitív egész relatív prím.
Add meg lnko(n, n + 1) értékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `lnko(n, n+1) = 1`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy lnko(n, n + 2) csak 1 vagy 2 lehet!

Add meg a lehetséges értékek halmazát!`,
        answer: 2,
        expectedSet: ['1', '2'],
        type: 'multiplication',
        expression: `lnko(n, n+2) ∈ {1, 2}`,
    },
    {
        stage: 6,
        question: `Ha a | b és b | a pozitív egészekre, akkor a = b.
Add meg a/b értékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `a = b`,
    },
    {
        stage: 6,
        question: `Igaz-e Eukleidész lemmája: ha p prím és p | ab, akkor p | a vagy p | b?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e: ha lnko(a, b) = 1 és a | bc, akkor a | c?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e a 3-mal való oszthatóság számjegyösszeges szabálya?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e a 11-gyel való oszthatóság alternáló számjegyösszeges szabálya?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Egész szám négyzete 8-cal osztva milyen maradékot adhat?

Add meg a lehetséges maradékok halmazát!`,
        answer: 3,
        expectedSet: ['0', '1', '4'],
        type: 'multiplication',
        expression: `0, 1, 4`,
    },
    {
        stage: 6,
        question: `Igaz-e, hogy négyzetszám nem végződhet 2, 3, 7 vagy 8 számjegyre?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Az 52941 számjegyeit tetszőleges sorrendben leírjuk. Egyik sem négyzetszám.
Add meg a számjegyösszeget!`,
        answer: 21,
        type: 'multiplication',
        expression: `5+2+9+4+1 = 21: osztható 3-mal, de nem 9-cel`,
    },
    {
        stage: 6,
        question: `Határozd meg az összes pozitív egész n-et, amelyre n | (n + 12)!

Add meg a lehetséges n-ek halmazát!`,
        answer: 6,
        expectedSet: ['1', '2', '3', '4', '6', '12'],
        type: 'multiplication',
        expression: `n | 12, tehát n ∈ {1, 2, 3, 4, 6, 12}`,
    },
    {
        stage: 6,
        question: `Igaz-e, hogy négy egymást követő egész szorzata osztható 24-gyel?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Öt egymást követő egész szorzata mivel osztható mindig?`,
        answer: 120,
        type: 'multiplication',
        expression: `5! = 120`,
    },
    {
        stage: 6,
        question: `1 + 3 + 5 + ⋯ + (2n − 1) = n².
n = 5 esetén mennyi az összeg?`,
        answer: 25,
        type: 'multiplication',
        expression: `5² = 25`,
    },
    {
        stage: 6,
        question: `Igaz-e, hogy n³ − n minden egész n-re osztható 6-tal?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e, hogy 4ⁿ + 6ⁿ − 1 minden pozitív egész n-re osztható 9-cel?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz (indukció)`,
    },
    {
        stage: 6,
        question: `Ha p > 3 prímszám, akkor p² − 1 mivel osztható?`,
        answer: 24,
        type: 'multiplication',
        expression: `24 | (p² − 1)`,
    },
    {
        stage: 6,
        question: `Igaz-e: ha n² páros, akkor n is páros?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
];
