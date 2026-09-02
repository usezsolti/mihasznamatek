import type { Question } from './types';

/**
 * Paraméteres egyenletek — 6 szint × 20 feladat (Paraméteres_feladatok.pdf).
 * 1 Lineáris alapok → 2 Diszkrimináns → 3 Viète →
 * 4 Abszolútérték/gyök/tört → 5 Egyenlőtlenség/rendszer → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getParameterPracticeQuestions = (): Question[] => [
    // —— 1. szint – Lineáris paraméteres alapok ——
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(p − 2)x = 6

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: 2,
        type: 'multiplication',
        expression: `p ≠ 2: x = 6/(p − 2); p = 2: nincs megoldás`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(p + 1)x = p + 1

Add meg azt a p-t, amikor végtelen sok megoldás van!`,
        answer: -1,
        type: 'multiplication',
        expression: `p ≠ −1: x = 1; p = −1: végtelen sok`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

px = 4

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: 0,
        type: 'multiplication',
        expression: `p ≠ 0: x = 4/p; p = 0: nincs megoldás`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(p − 3)x = p² − 9

Add meg azt a p-t, amikor végtelen sok megoldás van!`,
        answer: 3,
        type: 'multiplication',
        expression: `p ≠ 3: x = p + 3; p = 3: végtelen sok`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(p + 2)x = p² + 2p

Add meg azt a p-t, amikor végtelen sok megoldás van!`,
        answer: -2,
        type: 'multiplication',
        expression: `p ≠ −2: x = p; p = −2: végtelen sok`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(2p − 1)x = 3p + 2

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `p ≠ 1/2: x = (3p+2)/(2p−1); p = 1/2: nincs megoldás`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(p² − 4)x = p − 2

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: -2,
        type: 'multiplication',
        expression: `p ∉ {−2, 2}: x = 1/(p+2); p = 2: végtelen sok; p = −2: nincs`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(p − 1)x = 2p − 2

Add meg azt a p-t, amikor végtelen sok megoldás van!`,
        answer: 1,
        type: 'multiplication',
        expression: `p ≠ 1: x = 2; p = 1: végtelen sok`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p valós paraméter függvényében:

(p + 3)x = 0

Add meg azt a p-t, amikor végtelen sok megoldás van!`,
        answer: -3,
        type: 'multiplication',
        expression: `p ≠ −3: x = 0; p = −3: végtelen sok`,
    },
    {
        stage: 1,
        question: `Oldd meg x-re minden p ∈ ℝ esetén:

(p² + 1)x = p

Add meg x értékét, ha p = 1!`,
        answer: 0.5,
        type: 'multiplication',
        expression: `x = p/(p²+1); p = 1 → x = 1/2`,
    },
    {
        stage: 1,
        question: `Határozd meg p-t úgy, hogy x = 2 megoldása legyen az

(p + 1)x = 3p − 1

egyenletnek!`,
        answer: 3,
        type: 'multiplication',
        expression: `2(p+1) = 3p − 1 → p = 3`,
    },
    {
        stage: 1,
        question: `Határozd meg p-t úgy, hogy x = −1 megoldása legyen a

(2p − 3)x = p + 5

egyenletnek!`,
        answer: -0.667,
        type: 'multiplication',
        expression: `−(2p−3) = p+5 → p = −2/3 ≈ −0,667`,
    },
    {
        stage: 1,
        question: `Határozd meg p-t úgy, hogy x = 3 megoldása legyen a

(p − 2)x = 2p + 1

egyenletnek!`,
        answer: 7,
        type: 'multiplication',
        expression: `3(p−2) = 2p+1 → p = 7`,
    },
    {
        stage: 1,
        question: `Határozd meg p-t úgy, hogy x = 0 megoldása legyen a

(p + 4)x = p − 1

egyenletnek!`,
        answer: 1,
        type: 'multiplication',
        expression: `0 = p − 1 → p = 1`,
    },
    {
        stage: 1,
        question: `Határozd meg p-t úgy, hogy x = 4 megoldása legyen a

(3p − 2)x = 5p + 6

egyenletnek!`,
        answer: 2,
        type: 'multiplication',
        expression: `4(3p−2) = 5p+6 → p = 2`,
    },
    {
        stage: 1,
        question: `Mely p érték esetén nincs megoldása az

(p − 5)x = p + 1

egyenletnek?`,
        answer: 5,
        type: 'multiplication',
        expression: `p = 5: 0 = 6, nincs megoldás`,
    },
    {
        stage: 1,
        question: `Mely p érték esetén van végtelen sok megoldása az

(p + 2)x = 3p + 6

egyenletnek?`,
        answer: -2,
        type: 'multiplication',
        expression: `p = −2: 0 = 0, végtelen sok`,
    },
    {
        stage: 1,
        question: `Vizsgáld teljesen a p paraméter függvényében:

(p² − 9)x = p − 3

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: -3,
        type: 'multiplication',
        expression: `p ∉ {−3, 3}: x = 1/(p+3); p = 3: végtelen sok; p = −3: nincs`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p paraméter függvényében:

(p − 1)(x − 2) = 0

Add meg azt a p-t, amikor végtelen sok megoldás van!`,
        answer: 1,
        type: 'multiplication',
        expression: `p ≠ 1: x = 2; p = 1: minden x megoldás`,
    },
    {
        stage: 1,
        question: `Vizsgáld a p paraméter függvényében:

(p + 1)x + p = x + 1

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: 0,
        type: 'multiplication',
        expression: `px = 1 − p; p ≠ 0: x = (1−p)/p; p = 0: nincs`,
    },

    // —— 2. szint – Másodfokú egyenletek és diszkrimináns ——
    {
        stage: 2,
        question: `Mely p értékek esetén van két különböző valós gyöke az

x² − (p + 2)x + 2p = 0

egyenletnek?

Add meg azt a p-t, amelyre ez NEM teljesül!`,
        answer: 2,
        type: 'multiplication',
        expression: `D = (p−2)² > 0 ⇔ p ≠ 2`,
    },
    {
        stage: 2,
        question: `Mutasd meg, hogy minden p ∈ ℝ esetén két különböző valós gyöke van az

x² − 2px + p² − 4 = 0

egyenletnek!

Hány valós p esetén NINCS két különböző valós gyöke?`,
        answer: 0,
        type: 'multiplication',
        expression: `D = 16 > 0 minden p-re`,
    },
    {
        stage: 2,
        question: `Mely p érték esetén van pontosan egy különböző valós gyöke az

x² − (p + 1)x + p = 0

egyenletnek?`,
        answer: 1,
        type: 'multiplication',
        expression: `D = (p−1)² = 0 → p = 1`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén nincs valós gyöke az

x² + px + 1 = 0

egyenletnek?

Add meg a nyílt intervallum pozitív határát!`,
        answer: 2,
        type: 'multiplication',
        expression: `D = p² − 4 < 0 ⇔ −2 < p < 2`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén van két különböző valós gyöke az

x² + 2px + p + 2 = 0

egyenletnek?

Add meg a nagyobb D = 0 határértéket!`,
        answer: 2,
        type: 'multiplication',
        expression: `D > 0 ⇔ p < −1 vagy p > 2`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén van pontosan egy különböző valós gyöke az

x² − (p − 3)x + p = 0

egyenletnek?

Add meg a nagyobb p-t!`,
        answer: 9,
        type: 'multiplication',
        expression: `D = 0 → p = 1 vagy p = 9`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén nincs valós gyöke a

2x² + px + 2 = 0

egyenletnek?

Add meg a nyílt intervallum pozitív határát!`,
        answer: 4,
        type: 'multiplication',
        expression: `D = p² − 16 < 0 ⇔ −4 < p < 4`,
    },
    {
        stage: 2,
        question: `Vizsgáld a valós megoldások számát p függvényében:

px² − 2x + 1 = 0

Hány különböző valós megoldás van, ha p = 0?`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 0: −2x + 1 = 0 → egy lineáris megoldás`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén nincs valós gyöke az

x² + (p − 4)x + 4 = 0

egyenletnek?

Add meg a nyílt intervallum nagyobb határát!`,
        answer: 8,
        type: 'multiplication',
        expression: `D < 0 ⇔ 0 < p < 8`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén van két különböző valós gyöke az

x² − (p − 1)x + p + 3 = 0

egyenletnek?

Add meg a nagyobb D = 0 határértéket 3 tizedesjegyre!`,
        answer: 7.472,
        type: 'multiplication',
        expression: `3 + 2√5 ≈ 7,472`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t, ha x = 3 gyöke az

x² − (p + 2)x + 2p = 0

egyenletnek!`,
        answer: 3,
        type: 'multiplication',
        expression: `9 − 3(p+2) + 2p = 0 → p = 3`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t, ha x = −2 gyöke az

x² + px + p − 2 = 0

egyenletnek!`,
        answer: 2,
        type: 'multiplication',
        expression: `4 − 2p + p − 2 = 0 → p = 2`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t, ha x = 1 gyöke az

x² + (p − 3)x + 2p − 1 = 0

egyenletnek!`,
        answer: 1,
        type: 'multiplication',
        expression: `1 + p − 3 + 2p − 1 = 0 → p = 1`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t, ha x = 4 gyöke az

x² − (2p + 1)x + 3p + 4 = 0

egyenletnek!`,
        answer: 3.2,
        type: 'multiplication',
        expression: `16 − 4(2p+1) + 3p + 4 = 0 → p = 16/5 = 3,2`,
    },
    {
        stage: 2,
        question: `Határozd meg p-t úgy, hogy az

x² + px + 4 = 0

egyenletnek x = 2 kétszeres gyöke legyen!`,
        answer: -4,
        type: 'multiplication',
        expression: `Összeg 4 = −p → p = −4`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén pozitív mindkét gyöke az

x² − (p + 1)x + p = 0

egyenletnek?

Add meg a nyílt alsó határt!`,
        answer: 0,
        type: 'multiplication',
        expression: `Gyökök 1 és p; p > 0`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén nemnegatív mindkét gyöke az

x² − (p + 1)x + p = 0

egyenletnek?

Add meg a zárt alsó határt!`,
        answer: 0,
        type: 'multiplication',
        expression: `Gyökök 1 és p; p ≥ 0`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén ellentétes előjelűek az

x² + px − 3 = 0

egyenlet gyökei?

Hány valós p esetén NEM ellentétes előjelűek?`,
        answer: 0,
        type: 'multiplication',
        expression: `Szorzat = −3 < 0 minden p-re`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén pozitív mindkét valós gyöke az

x² − px + 2 = 0

egyenletnek?

Add meg a zárt alsó határt 3 tizedesjegyre!`,
        answer: 2.828,
        type: 'multiplication',
        expression: `p ≥ 2√2 ≈ 2,828`,
    },
    {
        stage: 2,
        question: `Mely p értékek esetén negatív mindkét valós gyöke az

x² − px + 2 = 0

egyenletnek?

Add meg a zárt felső határt 3 tizedesjegyre!`,
        answer: -2.828,
        type: 'multiplication',
        expression: `p ≤ −2√2 ≈ −2,828`,
    },

    // —— 3. szint – Viète-formulák ——
    {
        stage: 3,
        question: `Az x² − (p + 1)x + p = 0 egyenlet gyökei x₁, x₂.
Határozd meg p-t, ha x₁² + x₂² = 10.

Add meg a pozitív p-t!`,
        answer: 3,
        type: 'multiplication',
        expression: `1 + p² = 10 → p = ±3`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 1)x + p = 0 egyenlet gyökei x₁, x₂.
Határozd meg p-t, ha |x₁ − x₂| = 4.

Add meg a nagyobb p-t!`,
        answer: 5,
        type: 'multiplication',
        expression: `|1 − p| = 4 → p = 5 vagy p = −3`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 1)x + p = 0 egyenlet gyökei x₁, x₂.
Határozd meg p-t, ha x₁³ + x₂³ = 28.`,
        answer: 3,
        type: 'multiplication',
        expression: `1 + p³ = 28 → p = 3`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 1)x + p = 0 egyenlet gyökei nemnullák.
Határozd meg p-t, ha x₁/x₂ + x₂/x₁ = 5/2.

Add meg a nagyobb p-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `(1+p²)/p = 5/2 → p = 2 vagy p = 1/2`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 2)x + 2p = 0 egyenlet egyik gyöke kétszerese a másiknak.
Határozd meg p-t!

Add meg a nagyobb p-t!`,
        answer: 4,
        type: 'multiplication',
        expression: `Gyökök 2 és p → p = 1 vagy p = 4`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 2)x + 2p = 0 egyenlet gyökeinek négyzetösszege 20.
Határozd meg p-t!

Add meg a pozitív p-t!`,
        answer: 4,
        type: 'multiplication',
        expression: `(p+2)² − 4p = 20 → p = ±4`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 2)x + 2p = 0 egyenlet gyökeinek szorzata 10.
Határozd meg p-t!`,
        answer: 5,
        type: 'multiplication',
        expression: `2p = 10 → p = 5`,
    },
    {
        stage: 3,
        question: `Létezik-e olyan p, amelyre az
x² − px + p − 2 = 0
egyenlet gyökeinek összege megegyezik a gyökeik szorzatával?

Hány ilyen valós p van?`,
        answer: 0,
        type: 'multiplication',
        expression: `p = p − 2, ellentmondás`,
    },
    {
        stage: 3,
        question: `Az x² − px + 2 = 0 egyenlet két valós gyökének távolsága 1.
Határozd meg p-t!

Add meg a pozitív p-t!`,
        answer: 3,
        type: 'multiplication',
        expression: `√(p² − 8) = 1 → p = ±3`,
    },
    {
        stage: 3,
        question: `Az x² − px + 3 = 0 egyenlet két valós gyökének távolsága 2.
Határozd meg p-t!

Add meg a pozitív p-t!`,
        answer: 4,
        type: 'multiplication',
        expression: `√(p² − 12) = 2 → p = ±4`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 1)x + p − 2 = 0 egyenlet egyik gyöke 2.
Határozd meg p-t!`,
        answer: 0,
        type: 'multiplication',
        expression: `4 − 2(p+1) + p − 2 = 0 → p = 0`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 1)x + p − 2 = 0 egyenlet egyik gyöke kétszerese a másiknak.
Hány ilyen valós p van?`,
        answer: 0,
        type: 'multiplication',
        expression: `A kapott másodfokú D-je negatív`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 3)x + 2p = 0 egyenlet két valós gyökének távolsága 3.
Határozd meg p-t!

Add meg a nagyobb p-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `√D = 3 → p² − 2p + 9 = 9 → p = 0 vagy p = 2`,
    },
    {
        stage: 3,
        question: `Az x² − (p + 3)x + 2p = 0 egyenlet gyökeinek négyzetösszege 13.
Határozd meg p-t!

Add meg a nagyobb p-t 3 tizedesjegyre!`,
        answer: 1.236,
        type: 'multiplication',
        expression: `p = −1 ± √5; nagyobb ≈ 1,236`,
    },
    {
        stage: 3,
        question: `Mely p értékek esetén egymás reciprokai az
x² − px + 1 = 0
egyenlet valós gyökei?

Add meg a zárt pozitív határt!`,
        answer: 2,
        type: 'multiplication',
        expression: `Szorzat = 1; D ≥ 0 ⇔ |p| ≥ 2`,
    },
    {
        stage: 3,
        question: `Mely p értékek esetén nagyobb 1-nél az
x² − (p + 3)x + 2p = 0
egyenlet mindkét gyöke?

Add meg a nyílt alsó határt!`,
        answer: 2,
        type: 'multiplication',
        expression: `p > 2`,
    },
    {
        stage: 3,
        question: `Mely p értékek esetén van az
x² − (p + 1)x + p = 0
egyenlet mindkét gyöke a [0; 3] intervallumban?

Add meg a zárt felső határt!`,
        answer: 3,
        type: 'multiplication',
        expression: `Gyökök 1 és p; 0 ≤ p ≤ 3`,
    },
    {
        stage: 3,
        question: `Mely p értékek esetén van az
x² − (p + 2)x + 2p = 0
egyenlet egyik gyöke a ]0; 1[, a másik pedig az ]1; +∞[ intervallumban?

Add meg a nyílt felső határt!`,
        answer: 1,
        type: 'multiplication',
        expression: `Gyökök 2 és p; 0 < p < 1`,
    },
    {
        stage: 3,
        question: `Határozd meg azokat a valós p értékeket, amelyekre az
x² − px + 6 = 0
egyenlet mindkét gyöke egész szám!

Add meg a p értékek halmazát!`,
        answer: 4,
        expectedSet: ['-7', '-5', '5', '7'],
        type: 'multiplication',
        expression: `p ∈ {−7, −5, 5, 7}`,
    },
    {
        stage: 3,
        question: `Határozd meg p-t, ha az
x² − 10x + p = 0
egyenlet mindkét gyöke pozitív egész szám!

Add meg a p értékek halmazát!`,
        answer: 5,
        expectedSet: ['9', '16', '21', '24', '25'],
        type: 'multiplication',
        expression: `p ∈ {9, 16, 21, 24, 25}`,
    },

    // —— 4. szint – Abszolútértékes, gyökös és törtes ——
    {
        stage: 4,
        question: `Vizsgáld a valós megoldások számát p függvényében:

|x| = p

Hány megoldás van, ha p = 3?`,
        answer: 2,
        type: 'multiplication',
        expression: `p < 0: 0; p = 0: 1; p > 0: 2`,
    },
    {
        stage: 4,
        question: `Vizsgáld a valós megoldások számát:

|x − 2| = p

Hány megoldás van, ha p = 0?`,
        answer: 1,
        type: 'multiplication',
        expression: `p < 0: 0; p = 0: 1; p > 0: 2`,
    },
    {
        stage: 4,
        question: `Vizsgáld a valós megoldások számát:

|2x − 1| = p

Hány megoldás van, ha p = −1?`,
        answer: 0,
        type: 'multiplication',
        expression: `p < 0: 0; p = 0: 1; p > 0: 2`,
    },
    {
        stage: 4,
        question: `Oldd meg x-re a p paraméter függvényében:

|x| = px

Hány megoldás van, ha p = 2?`,
        answer: 1,
        type: 'multiplication',
        expression: `p = ±1: félegyenes; egyébként csak x = 0`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x − 1| = p + 1

Hány megoldás van, ha p = 0?`,
        answer: 2,
        type: 'multiplication',
        expression: `p < −1: 0; p = −1: 1; p > −1: 2`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x² − 1| = p

Hány megoldás van, ha p = 1/2?`,
        answer: 4,
        type: 'multiplication',
        expression: `0 < p < 1: 4 megoldás`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x² − 4| = p

Hány megoldás van, ha p = 4?`,
        answer: 3,
        type: 'multiplication',
        expression: `p = 4: 3 megoldás`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x² − 4x + 3| = p

Hány megoldás van, ha p = 1?`,
        answer: 3,
        type: 'multiplication',
        expression: `p = 1: 3 megoldás`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

√(x + 2) = p

Hány megoldás van, ha p = 3?`,
        answer: 1,
        type: 'multiplication',
        expression: `p < 0: 0; p ≥ 0: 1`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

√(x + 2) = p − x

Hány megoldás van, ha p = 0?`,
        answer: 1,
        type: 'multiplication',
        expression: `p < −2: 0; p ≥ −2: 1`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

√(x + 4) = p

Hány megoldás van, ha p = −2?`,
        answer: 0,
        type: 'multiplication',
        expression: `p < 0: 0; p ≥ 0: 1`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

1/(x − 1) = p

Hány megoldás van, ha p = 0?`,
        answer: 0,
        type: 'multiplication',
        expression: `p = 0: 0; p ≠ 0: 1`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

(x + 1)/(x − 2) = p

Hány megoldás van, ha p = 1?`,
        answer: 0,
        type: 'multiplication',
        expression: `p = 1: 0; p ≠ 1: 1`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

(p − 1)/(x − 2) = 1

Hány megoldás van, ha p = 3?`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 1: 0; p ≠ 1: 1`,
    },
    {
        stage: 4,
        question: `Vizsgáld a valós megoldások számát p függvényében:

|x − 1| = px

Hány megoldás van, ha p = 1/2?`,
        answer: 2,
        type: 'multiplication',
        expression: `0 < p < 1: 2 megoldás`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x| + |x − 2| = p

Hány megoldás van, ha p = 5?`,
        answer: 2,
        type: 'multiplication',
        expression: `p < 2: 0; p = 2: végtelen; p > 2: 2`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x| + |x − 4| = p

Hány megoldás van, ha p = 6?`,
        answer: 2,
        type: 'multiplication',
        expression: `p < 4: 0; p = 4: végtelen; p > 4: 2`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x − 1| + |x + 1| = p

Hány megoldás van, ha p = 3?`,
        answer: 2,
        type: 'multiplication',
        expression: `p < 2: 0; p = 2: végtelen; p > 2: 2`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

|x| − |x − 2| = p

Hány megoldás van, ha p = 0?`,
        answer: 1,
        type: 'multiplication',
        expression: `|p| > 2: 0; −2 < p < 2: 1; p = ±2: végtelen`,
    },
    {
        stage: 4,
        question: `Vizsgáld a megoldások számát:

√x = px

Hány megoldás van, ha p = 1?`,
        answer: 2,
        type: 'multiplication',
        expression: `p ≤ 0: 1 (x = 0); p > 0: 2`,
    },

    // —— 5. szint – Egyenlőtlenségek és egyenletrendszerek ——
    {
        stage: 5,
        question: `Vizsgáld a p paraméter függvényében:

px + y = 1
x + py = 1

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: -1,
        type: 'multiplication',
        expression: `p ≠ ±1: egy megoldás; p = 1: végtelen; p = −1: nincs`,
    },
    {
        stage: 5,
        question: `Vizsgáld a p paraméter függvényében:

px + y = 2
x + py = 3

Hány p érték esetén nincs megoldás?`,
        answer: 2,
        type: 'multiplication',
        expression: `p ≠ ±1: egy megoldás; p = ±1: nincs`,
    },
    {
        stage: 5,
        question: `Vizsgáld a p paraméter függvényében:

px + y = 0
x + py = 0

Hány rendezett számpár megoldás van, ha p = 0?`,
        answer: 1,
        type: 'multiplication',
        expression: `p ≠ ±1: csak (0, 0); p = ±1: végtelen sok`,
    },
    {
        stage: 5,
        question: `Vizsgáld a p paraméter függvényében:

(p − 1)x + y = 1
x + (p − 1)y = 1

Add meg azt a p-t, amikor nincs megoldás!`,
        answer: 0,
        type: 'multiplication',
        expression: `p ∉ {0, 2}: egy; p = 2: végtelen; p = 0: nincs`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re p függvényében:

x² − (p + 1)x + p < 0

Ha p = 3, add meg a nyílt intervallum nagyobb végét!`,
        answer: 3,
        type: 'multiplication',
        expression: `x ∈ ]min{1, p}; max{1, p}[; p = 3 → ]1; 3[`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re p függvényében:

x² − (p + 1)x + p ≤ 0

Ha p = 4, add meg a zárt intervallum nagyobb végét!`,
        answer: 4,
        type: 'multiplication',
        expression: `x ∈ [min{1, p}; max{1, p}]; p = 4 → [1; 4]`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re:

(x − p)(x − 2) > 0

Ha p = 5, add meg a nagyobb gyököt (a nyílt sáv jobb határát)!`,
        answer: 5,
        type: 'multiplication',
        expression: `x < min{p, 2} vagy x > max{p, 2}`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re:

(x − p)/(x − 1) > 0

Ha p = 4, add meg a nagyobb szakadási / gyökhelyet!`,
        answer: 4,
        type: 'multiplication',
        expression: `x < min{p, 1} vagy x > max{p, 1}, x ≠ 1`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re:

|x − p| < 2

Ha p = 3, add meg a nyílt intervallum nagyobb végét!`,
        answer: 5,
        type: 'multiplication',
        expression: `p − 2 < x < p + 2; p = 3 → ]1; 5[`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re a p paraméter függvényében:

|x − 1| ≤ p

Ha p = 2, add meg a zárt intervallum nagyobb végét!`,
        answer: 3,
        type: 'multiplication',
        expression: `p < 0: ∅; p ≥ 0: [1−p; 1+p]; p = 2 → [−1; 3]`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re:

x² − 2px + p² − 1 ≤ 0

Ha p = 3, add meg a zárt intervallum nagyobb végét!`,
        answer: 4,
        type: 'multiplication',
        expression: `x ∈ [p − 1; p + 1]; p = 3 → [2; 4]`,
    },
    {
        stage: 5,
        question: `Oldd meg x-re:

x² − 2px + p² − 4 > 0

Ha p = 3, add meg a nagyobb gyököt!`,
        answer: 5,
        type: 'multiplication',
        expression: `x < p − 2 vagy x > p + 2; p = 3 → x < 1 vagy x > 5`,
    },
    {
        stage: 5,
        question: `Mely p értékek esetén van az
x² − (p + 1)x + p = 0
egyenlet mindkét gyöke a [0; 2] intervallumban?

Add meg a zárt felső határt!`,
        answer: 2,
        type: 'multiplication',
        expression: `0 ≤ p ≤ 2`,
    },
    {
        stage: 5,
        question: `Mely p értékek esetén esik az
x² − (p + 1)x + p = 0
egyenletnek pontosan egy különböző gyöke a [0; 2] intervallumba?

Add meg a izolált p értéket!`,
        answer: 1,
        type: 'multiplication',
        expression: `p ∈ ]−∞; 0[ ∪ {1} ∪ ]2; +∞[`,
    },
    {
        stage: 5,
        question: `Mely p értékek esetén van az
x² − (p + 2)x + 2p = 0
egyenletnek legalább egy 2-nél nagyobb gyöke?

Add meg a nyílt alsó határt!`,
        answer: 2,
        type: 'multiplication',
        expression: `p > 2`,
    },
    {
        stage: 5,
        question: `Mely p értékek esetén ellentétes előjelű az
x² − (p + 1)x + p = 0
egyenlet két gyöke?

Add meg a nyílt felső határt!`,
        answer: 0,
        type: 'multiplication',
        expression: `Szorzat = p < 0`,
    },
    {
        stage: 5,
        question: `Mely p értékek esetén pozitív és különböző az
x² − (p + 1)x + p = 0
egyenlet két gyöke?

Add meg a kizárt pozitív p-t!`,
        answer: 1,
        type: 'multiplication',
        expression: `p > 0, p ≠ 1`,
    },
    {
        stage: 5,
        question: `Vizsgáld a rendezett valós számpár megoldások számát:

x + y = p
xy = 6

Hány rendezett számpár van, ha p = 0?`,
        answer: 0,
        type: 'multiplication',
        expression: `|p| > 2√6: 2; |p| = 2√6: 1; |p| < 2√6: 0`,
    },
    {
        stage: 5,
        question: `Vizsgáld a rendezett valós számpár megoldások számát:

x + y = p
x² + y² = 10

Hány rendezett számpár van, ha p = 0?`,
        answer: 2,
        type: 'multiplication',
        expression: `|p| < 2√5: 2; |p| = 2√5: 1; |p| > 2√5: 0`,
    },
    {
        stage: 5,
        question: `Vizsgáld a pozitív rendezett számpár megoldások számát:

x + y = p
xy = 4

Hány pozitív rendezett számpár van, ha p = 5?`,
        answer: 2,
        type: 'multiplication',
        expression: `p < 4: 0; p = 4: 1; p > 4: 2`,
    },

    // —— 6. szint – Teljes vizsgálat és mesterfeladatok ——
    {
        stage: 6,
        question: `Vizsgáld teljesen a p valós paraméter függvényében:

|x² − 4x + 3| = p

Hány különböző valós megoldás van, ha p = 1/2?`,
        answer: 4,
        type: 'multiplication',
        expression: `0 < p < 1: 4 megoldás`,
    },
    {
        stage: 6,
        question: `Vizsgáld teljesen a p valós paraméter függvényében:

|x² − 1| = p|x|

Hány megoldás van, ha p = 1?`,
        answer: 4,
        type: 'multiplication',
        expression: `p < 0: 0; p = 0: 2; p > 0: 4`,
    },
    {
        stage: 6,
        question: `Vizsgáld a különböző valós gyökök számát:

x⁴ − (p + 1)x² + p = 0

Hány különböző valós gyök van, ha p = 1?`,
        answer: 2,
        type: 'multiplication',
        expression: `p = 1: 2 különböző valós gyök`,
    },
    {
        stage: 6,
        question: `Vizsgáld a különböző valós gyökök számát:

x⁴ − (p + 4)x² + 4p = 0

Hány különböző valós gyök van, ha p = 4?`,
        answer: 2,
        type: 'multiplication',
        expression: `p = 4: 2 különböző valós gyök`,
    },
    {
        stage: 6,
        question: `Vizsgáld a különböző valós gyökök számát:

(x² − p)² = 1

Hány különböző valós gyök van, ha p = 2?`,
        answer: 4,
        type: 'multiplication',
        expression: `p > 1: 4 különböző valós gyök`,
    },
    {
        stage: 6,
        question: `Oldd meg x-re a p paraméter függvényében:

|x − p| = |x + 1|

Add meg x-et, ha p = 3!`,
        answer: 1,
        type: 'multiplication',
        expression: `p ≠ −1: x = (p − 1)/2; p = 3 → x = 1`,
    },
    {
        stage: 6,
        question: `Vizsgáld a megoldások számát:

|x − p| + |x + p| = 2

Hány megoldás van, ha p = 0?`,
        answer: 2,
        type: 'multiplication',
        expression: `|p| > 1: 0; |p| = 1: végtelen; |p| < 1: 2`,
    },
    {
        stage: 6,
        question: `Vizsgáld a megoldások számát:

|x − p| + |x + p| = 2p

Hány megoldás van, ha p = 0?`,
        answer: 1,
        type: 'multiplication',
        expression: `p < 0: 0; p = 0: 1; p > 0: végtelen`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy minden valós p esetén két különböző valós gyöke van az

x² − (3p + 1)x + p = 0

egyenletnek!

Hány valós p esetén NINCS két különböző valós gyöke?`,
        answer: 0,
        type: 'multiplication',
        expression: `D = (3p+1)² − 4p = 9p² + 2p + 1 = (3p+1/3)² + 8/9 > 0`,
    },
    {
        stage: 6,
        question: `Az x² − (3p + 1)x + p = 0 egyenlet egyik gyöke 2.
Határozd meg p-t!`,
        answer: 0.4,
        type: 'multiplication',
        expression: `4 − 2(3p+1) + p = 0 → p = 2/5 = 0,4`,
    },
    {
        stage: 6,
        question: `Az x² − (3p + 1)x + p = 0 egyenlet gyökeinek négyzetösszege 5.
Határozd meg p-t!

Add meg a nagyobb p-t 3 tizedesjegyre!`,
        answer: 0.481,
        type: 'multiplication',
        expression: `p = (−2 ± 2√10)/9; nagyobb ≈ 0,481`,
    },
    {
        stage: 6,
        question: `Vizsgáld a rendezett valós számpár megoldások számát:

x + y = p
xy = p

Hány rendezett számpár van, ha p = 5?`,
        answer: 2,
        type: 'multiplication',
        expression: `p < 0 vagy p > 4: 2; p = 0 vagy 4: 1; 0 < p < 4: 0`,
    },
    {
        stage: 6,
        question: `Vizsgáld a rendezett valós számpár megoldások számát:

x + y = p
x² + y² = p²

Hány rendezett számpár van, ha p = 0?`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 0: 1; p ≠ 0: 2`,
    },
    {
        stage: 6,
        question: `Határozd meg azokat a p valós számokat, amelyekre az
x² − px + 6 = 0
egyenlet mindkét gyöke egész szám!

Add meg a p értékek halmazát!`,
        answer: 4,
        expectedSet: ['-7', '-5', '5', '7'],
        type: 'multiplication',
        expression: `p ∈ {−7, −5, 5, 7}`,
    },
    {
        stage: 6,
        question: `Határozd meg p-t úgy, hogy az
x² − px + 12 = 0
egyenlet mindkét gyöke pozitív egész szám legyen!

Add meg a p értékek halmazát!`,
        answer: 3,
        expectedSet: ['7', '8', '13'],
        type: 'multiplication',
        expression: `p ∈ {7, 8, 13}`,
    },
    {
        stage: 6,
        question: `Határozd meg azokat a p értékeket, amelyekre az
x² − px + p = 0
egyenlet mindkét gyöke egész szám!

Add meg a p értékek halmazát!`,
        answer: 2,
        expectedSet: ['0', '4'],
        type: 'multiplication',
        expression: `p ∈ {0, 4}`,
    },
    {
        stage: 6,
        question: `Mely p érték esetén van pontosan három különböző valós gyöke az

x⁴ − (p + 1)x² + p = 0

egyenletnek?`,
        answer: 0,
        type: 'multiplication',
        expression: `p = 0`,
    },
    {
        stage: 6,
        question: `Mely p érték esetén van pontosan három különböző valós gyöke az

x⁴ − (p + 4)x² + 4p = 0

egyenletnek?`,
        answer: 0,
        type: 'multiplication',
        expression: `p = 0`,
    },
    {
        stage: 6,
        question: `Mely p értékek esetén van pontosan két különböző pozitív rendezett számpár megoldása az

x + y = p
xy = 4

egyenletrendszernek?

Add meg a nyílt alsó határt!`,
        answer: 4,
        type: 'multiplication',
        expression: `p > 4`,
    },
    {
        stage: 6,
        question: `Vizsgáld teljesen a p paraméter függvényében:

(p − 1)x² − 2px + p + 1 = 0

Hány valós megoldás van, ha p = 1?`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 1: 1 valós megoldás; p ≠ 1: 2 különböző`,
    },
];
