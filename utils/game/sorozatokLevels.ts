import type { Question } from './types';

/**
 * Sorozatok — 6 szint × 20 feladat (Sorozatok.pdf).
 * 1 Alapok → 2 Számtani → 3 Mértani →
 * 4 Összegek → 5 Határérték → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getSorozatokPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Adott az aₙ = 3n − 2 sorozat.
Írd fel az első öt tagját!

Add meg a tagok halmazát sorrend nélkül, pl. {1; 4; …}!`,
        answer: 5,
        expectedSet: ['1', '4', '7', '10', '13'],
        type: 'multiplication',
        expression: `1, 4, 7, 10, 13`,
    },
    {
        stage: 1,
        question: `Adott az aₙ = (−1)ⁿ n sorozat.
Add meg a hatodik tagot!`,
        answer: 6,
        type: 'multiplication',
        expression: `−1, 2, −3, 4, −5, 6`,
    },
    {
        stage: 1,
        question: `Adott az aₙ = 5 − 2n sorozat.
Határozd meg a₁₀-et!`,
        answer: -15,
        type: 'multiplication',
        expression: `5 − 20 = −15`,
    },
    {
        stage: 1,
        question: `Adott az aₙ = (2n + 1)/(n + 1) sorozat.
Határozd meg a₄-et!`,
        answer: 1.8,
        type: 'multiplication',
        expression: `9/5 = 1,8`,
    },
    {
        stage: 1,
        question: `a₁ = 2, aₙ₊₁ = aₙ + 3.
Add meg a hatodik tagot!`,
        answer: 17,
        type: 'multiplication',
        expression: `2, 5, 8, 11, 14, 17`,
    },
    {
        stage: 1,
        question: `a₁ = 3, aₙ₊₁ = 2aₙ.
Add meg az ötödik tagot!`,
        answer: 48,
        type: 'multiplication',
        expression: `3, 6, 12, 24, 48`,
    },
    {
        stage: 1,
        question: `A 7, 11, 15, 19, … sorozat számtani sorozat-e?
Ha igen, add meg a differenciáját!`,
        answer: 4,
        type: 'multiplication',
        expression: `Igen, d = 4`,
    },
    {
        stage: 1,
        question: `A 81, 27, 9, 3, … sorozat mértani sorozat-e?
Ha igen, add meg a hányadosát!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `Igen, q = 1/3`,
    },
    {
        stage: 1,
        question: `A 2, 4, 8, 16, … sorozat n-edik tagja aₙ = 2ⁿ.
Add meg a₁₀-et!`,
        answer: 1024,
        type: 'multiplication',
        expression: `aₙ = 2ⁿ`,
    },
    {
        stage: 1,
        question: `A 5, 2, −1, −4, … sorozat n-edik tagja aₙ = 8 − 3n.
Add meg aₙ képletében a 8 − 3n helyett a₁₀ értékét!`,
        answer: -22,
        type: 'multiplication',
        expression: `aₙ = 8 − 3n; a₁₀ = −22`,
    },
    {
        stage: 1,
        question: `A 3, 6, 12, 24, … mértani sorozatnak határozd meg a nyolcadik tagját!`,
        answer: 384,
        type: 'multiplication',
        expression: `3 · 2⁷ = 384`,
    },
    {
        stage: 1,
        question: `A 20, 17, 14, 11, … számtani sorozatnak határozd meg a tizenötödik tagját!`,
        answer: -22,
        type: 'multiplication',
        expression: `20 + 14 · (−3) = −22`,
    },
    {
        stage: 1,
        question: `Egy számtani sorozat első tagja 4, differenciája 5.
Határozd meg a huszadik tagját!`,
        answer: 99,
        type: 'multiplication',
        expression: `4 + 19 · 5 = 99`,
    },
    {
        stage: 1,
        question: `Egy mértani sorozat első tagja 2, hányadosa 3.
Határozd meg a hatodik tagját!`,
        answer: 486,
        type: 'multiplication',
        expression: `2 · 3⁵ = 486`,
    },
    {
        stage: 1,
        question: `A 7, 10, 13, 16, … számtani sorozat hányadik tagja 64?`,
        answer: 20,
        type: 'multiplication',
        expression: `7 + (n−1)·3 = 64 → n = 20`,
    },
    {
        stage: 1,
        question: `Az 5, 10, 20, 40, … mértani sorozat hányadik tagja 640?`,
        answer: 8,
        type: 'multiplication',
        expression: `5 · 2ⁿ⁻¹ = 640 → n = 8`,
    },
    {
        stage: 1,
        question: `A 6, 6, 6, 6, … sorozat számtani és mértani is.
Add meg a differenciáját!`,
        answer: 0,
        type: 'multiplication',
        expression: `d = 0, q = 1`,
    },
    {
        stage: 1,
        question: `Adott az aₙ = 1/n sorozat.
Add meg a negyedik tagot!`,
        answer: 0.25,
        type: 'multiplication',
        expression: `1, 1/2, 1/3, 1/4; szigorúan csökkenő`,
    },
    {
        stage: 1,
        question: `Adott az aₙ = (−1)ⁿ sorozat.
Korlátos-e? Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Nem monoton; korlátos`,
    },
    {
        stage: 1,
        question: `Adott az aₙ = n² sorozat.
Határozd meg a₁₀-et!`,
        answer: 100,
        type: 'multiplication',
        expression: `1, 4, 9, 16, 25; a₁₀ = 100`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Számtani sorozat: a₁ = 7, d = 4.
Határozd meg a₁₈-at!`,
        answer: 75,
        type: 'multiplication',
        expression: `7 + 17 · 4 = 75`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₅ = 19, d = 3.
Határozd meg a₁-et!`,
        answer: 7,
        type: 'multiplication',
        expression: `a₁ + 4 · 3 = 19 → a₁ = 7`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₄ = 11, a₁₀ = 35.
Határozd meg d-t!`,
        answer: 4,
        type: 'multiplication',
        expression: `a₁ = −1, d = 4`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₇ = 5, a₁₃ = −13.
Határozd meg a₁-et!`,
        answer: 23,
        type: 'multiplication',
        expression: `a₁ = 23, d = −3`,
    },
    {
        stage: 2,
        question: `Egy számtani sorozat első tagja 12, huszadik tagja 69.
Határozd meg az első 20 tag összegét!`,
        answer: 810,
        type: 'multiplication',
        expression: `S₂₀ = 10 · (12 + 69) = 810`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₁ = −5, d = 4.
Határozd meg az első 30 tag összegét!`,
        answer: 1590,
        type: 'multiplication',
        expression: `S₃₀ = 1590`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₈ = 26, a₂₀ = 62.
Határozd meg S₂₀-at!`,
        answer: 670,
        type: 'multiplication',
        expression: `a₁ = 5, d = 3, S₂₀ = 670`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₁ = 4, d = 2.
Határozd meg az első 15 tag összegét!`,
        answer: 270,
        type: 'multiplication',
        expression: `S₁₅ = 270`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₁ = 100, d = −7.
Hány pozitív tagja van?`,
        answer: 15,
        type: 'multiplication',
        expression: `15 pozitív tag`,
    },
    {
        stage: 2,
        question: `A 3 és 18 közé iktass be négy számot úgy, hogy számtani sorozatot alkossanak!

Add meg a beszúrt számok halmazát!`,
        answer: 4,
        expectedSet: ['6', '9', '12', '15'],
        type: 'multiplication',
        expression: `6, 9, 12, 15`,
    },
    {
        stage: 2,
        question: `Három egymást követő számtani sorozattag összege 42, a differencia 5.
Add meg a középső tagot!`,
        answer: 14,
        type: 'multiplication',
        expression: `9, 14, 19`,
    },
    {
        stage: 2,
        question: `Három egymást követő számtani sorozattag összege 30, az első tag 6.
Add meg a harmadik tagot!`,
        answer: 14,
        type: 'multiplication',
        expression: `6, 10, 14`,
    },
    {
        stage: 2,
        question: `Számtani sorozatban a₂ + a₈ = 40.
Határozd meg a₅-öt!`,
        answer: 20,
        type: 'multiplication',
        expression: `a₂ + a₈ = 2a₅ = 40`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₃ = 10, a₉ = 34.
Határozd meg S₁₁-et!`,
        answer: 242,
        type: 'multiplication',
        expression: `S₁₁ = 242`,
    },
    {
        stage: 2,
        question: `Számtani sorozat: a₁ = 4, S₂₀ = 460.
Határozd meg a differenciát!`,
        answer: 2,
        type: 'multiplication',
        expression: `d = 2`,
    },
    {
        stage: 2,
        question: `Az első n pozitív egész szám összege 325.
Határozd meg n-et!`,
        answer: 25,
        type: 'multiplication',
        expression: `n(n+1)/2 = 325 → n = 25`,
    },
    {
        stage: 2,
        question: `Számítsd ki: 5 + 8 + 11 + ⋯ + 92.`,
        answer: 1455,
        type: 'multiplication',
        expression: `S = 1455`,
    },
    {
        stage: 2,
        question: `Egy futó az első napon 3 km-t fut, majd minden nap 0,5 km-rel többet.
Hány kilométert fut 14 nap alatt?`,
        answer: 87.5,
        type: 'multiplication',
        expression: `87,5 km`,
    },
    {
        stage: 2,
        question: `Egy színház első sorában 18 ülőhely van, minden következő sorban 2-vel több.
Hány ülőhely van 15 sorban?`,
        answer: 480,
        type: 'multiplication',
        expression: `480`,
    },
    {
        stage: 2,
        question: `Egy négyszög belső szögei számtani sorozat. A legkisebb szög 72°.
Add meg a legnagyobb szöget fokban!`,
        answer: 108,
        type: 'multiplication',
        expression: `72°, 84°, 96°, 108°`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Mértani sorozat: a₁ = 3, q = 2.
Határozd meg a₈-at!`,
        answer: 384,
        type: 'multiplication',
        expression: `3 · 2⁷ = 384`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₄ = 54, q = 3.
Határozd meg a₁-et!`,
        answer: 2,
        type: 'multiplication',
        expression: `54 / 27 = 2`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₂ = 12, a₅ = 96, q > 0.
Határozd meg q-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `q = 2, a₁ = 6`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₃ = 20, a₆ = 160, q > 0.
Határozd meg a₁-et!`,
        answer: 5,
        type: 'multiplication',
        expression: `q = 2, a₁ = 5`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₁ = 5, q = 1/2.
Határozd meg a₇-et!`,
        answer: 0.078,
        type: 'multiplication',
        expression: `5/64 ≈ 0,078`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₁ = −2, q = −3.
Határozd meg a₅-öt!`,
        answer: -162,
        type: 'multiplication',
        expression: `−2 · 81 = −162`,
    },
    {
        stage: 3,
        question: `Határozd meg az első 6 tag összegét, ha a₁ = 2, q = 2.`,
        answer: 126,
        type: 'multiplication',
        expression: `S₆ = 126`,
    },
    {
        stage: 3,
        question: `Határozd meg az első 5 tag összegét, ha a₁ = 81, q = 1/3.`,
        answer: 121,
        type: 'multiplication',
        expression: `S₅ = 121`,
    },
    {
        stage: 3,
        question: `Határozd meg a végtelen mértani sor összegét:
6 + 2 + 2/3 + 2/9 + ⋯`,
        answer: 9,
        type: 'multiplication',
        expression: `6 / (1 − 1/3) = 9`,
    },
    {
        stage: 3,
        question: `Határozd meg a végtelen mértani sor összegét:
8 − 4 + 2 − 1 + ⋯`,
        answer: 5.333,
        type: 'multiplication',
        expression: `8 / (1 + 1/2) = 16/3 ≈ 5,333`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₂ = 10, a₅ = 80, q > 0.
Határozd meg a₁-et!`,
        answer: 5,
        type: 'multiplication',
        expression: `a₁ = 5, q = 2`,
    },
    {
        stage: 3,
        question: `Három egymást követő pozitív mértani sorozattag közül az első 3, a szorzat 216.
Add meg a harmadik tagot!`,
        answer: 12,
        type: 'multiplication',
        expression: `3, 6, 12`,
    },
    {
        stage: 3,
        question: `Mértani sorozat: a₁ = 4, q = 3/2.
Határozd meg a₆-ot!`,
        answer: 30.375,
        type: 'multiplication',
        expression: `243/8 = 30,375`,
    },
    {
        stage: 3,
        question: `Egy baktériumtenyészet kezdetben 500 egyed, naponta 8%-kal nő.
Hány egyed lesz 5 nap múlva? (3 tizedesjegy)`,
        answer: 734.664,
        type: 'multiplication',
        expression: `500 · 1,08⁵ ≈ 734,664`,
    },
    {
        stage: 3,
        question: `Egy 2 000 000 Ft értékű gép értéke évente 15%-kal csökken.
Mekkora lesz 4 év múlva? (egész forint)`,
        answer: 1044013,
        type: 'multiplication',
        expression: `2 000 000 · 0,85⁴ ≈ 1 044 013`,
    },
    {
        stage: 3,
        question: `Egy baktériumkultúra kezdetben 200 egyed, óránként megháromszorozódik.
Hány egyed lesz 6 óra múlva?`,
        answer: 145800,
        type: 'multiplication',
        expression: `200 · 3⁶ = 145 800`,
    },
    {
        stage: 3,
        question: `Egy labdát 2 m-ről ejtünk. Minden felpattanás után az előző magasság 80%-ára jut.
Mekkora a tizedik felpattanás magassága méterben? (3 tizedesjegy)`,
        answer: 0.215,
        type: 'multiplication',
        expression: `2 · 0,8¹⁰ ≈ 0,215 m`,
    },
    {
        stage: 3,
        question: `Az előző labda összesen mekkora utat tesz meg, ha végtelen sokáig pattog? (méter)`,
        answer: 18,
        type: 'multiplication',
        expression: `2 + 2 · 2 · 0,8 / 0,2 = 18 m`,
    },
    {
        stage: 3,
        question: `Egy 8 m oldalú négyzetbe újabb négyzeteket rajzolunk, kerületük mindig az előző 3/4-e.
Határozd meg az összes kerület végtelen összegét méterben!`,
        answer: 128,
        type: 'multiplication',
        expression: `32 / (1 − 3/4) = 128`,
    },
    {
        stage: 3,
        question: `Pozitív mértani sorozat: a₃ = 12, a₇ = 192.
Határozd meg a₁-et!`,
        answer: 3,
        type: 'multiplication',
        expression: `a₁ = 3, q = 2`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Számtani sorozat: a₁ = 12, d = 5.
Határozd meg S₂₅-öt!`,
        answer: 1800,
        type: 'multiplication',
        expression: `S₂₅ = 1800`,
    },
    {
        stage: 4,
        question: `Mértani sorozat: a₁ = 3, q = 2.
Határozd meg S₈-at!`,
        answer: 765,
        type: 'multiplication',
        expression: `S₈ = 765`,
    },
    {
        stage: 4,
        question: `A aₙ = 2n + 1 számtani sorozatban határozd meg
a₁₁ + a₁₂ + ⋯ + a₃₀ értékét!`,
        answer: 840,
        type: 'multiplication',
        expression: `840`,
    },
    {
        stage: 4,
        question: `Mértani sorozat: a₁ = 2, q = 3.
Határozd meg a₄ + a₅ + ⋯ + a₉ értékét!`,
        answer: 19656,
        type: 'multiplication',
        expression: `19656`,
    },
    {
        stage: 4,
        question: `Egy számtani sorozat első 10 tagjának összege 210, d = 4.
Határozd meg az első tagot!`,
        answer: 3,
        type: 'multiplication',
        expression: `a₁ = 3`,
    },
    {
        stage: 4,
        question: `Egy mértani sorozat első 4 tagjának összege 30, q = 2.
Határozd meg az első tagot!`,
        answer: 2,
        type: 'multiplication',
        expression: `a₁ = 2`,
    },
    {
        stage: 4,
        question: `Számtani sorozatban a₃ + a₇ = 40.
Határozd meg az első 9 tag összegét!`,
        answer: 180,
        type: 'multiplication',
        expression: `S₉ = 9 · a₅ = 180`,
    },
    {
        stage: 4,
        question: `Pozitív mértani sorozatban a₂ · a₆ = 256.
Határozd meg a₄-et!`,
        answer: 16,
        type: 'multiplication',
        expression: `a₄² = 256 → a₄ = 16`,
    },
    {
        stage: 4,
        question: `Három pozitív, egymást követő mértani sorozattag összege 14, szorzata 64.
Add meg a középső tagot!`,
        answer: 4,
        type: 'multiplication',
        expression: `2, 4, 8 vagy 8, 4, 2`,
    },
    {
        stage: 4,
        question: `A pozitív egészeket így csoportosítjuk: (1), (2, 3), (4, 5, 6), …
A k-adik csoportban k szám van. Mi az 50. csoport első eleme?`,
        answer: 1226,
        type: 'multiplication',
        expression: `1 + 49·50/2 = 1226`,
    },
    {
        stage: 4,
        question: `Az előző csoportosításban melyik csoportban van az 1000?
Add meg a csoport sorszámát!`,
        answer: 45,
        type: 'multiplication',
        expression: `A 45. csoport 10. eleme`,
    },
    {
        stage: 4,
        question: `Valaki az első hónapban 10 000 Ft-ot tesz félre, majd havonta 2000 Ft-tal többet.
Mennyit takarít meg 12 hónap alatt?`,
        answer: 252000,
        type: 'multiplication',
        expression: `252 000 Ft`,
    },
    {
        stage: 4,
        question: `Egy befektetés első hónapban 400 000 Ft, minden hónap végére 2%-kal nő.
Mekkora a tizenkét havi érték összege? (egész forint)`,
        answer: 5364836,
        type: 'multiplication',
        expression: `≈ 5 364 836 Ft`,
    },
    {
        stage: 4,
        question: `Egymillió forintot évi 5%-os kamatos kamatra helyezünk el.
Mennyi lesz 8 év múlva? (egész forint)`,
        answer: 1477455,
        type: 'multiplication',
        expression: `≈ 1 477 455 Ft`,
    },
    {
        stage: 4,
        question: `Egy szabályos háromszög kerülete 30 cm. Az oldalfelezők újabb szabályos háromszöget adnak, végtelen sokszor.
Határozd meg a kerületek összegét cm-ben!`,
        answer: 60,
        type: 'multiplication',
        expression: `30 / (1 − 1/2) = 60`,
    },
    {
        stage: 4,
        question: `Egy 10 cm oldalú négyzetben az oldalfelezők összekötésével újabb négyzetet kapunk, végtelen sokszor.
Határozd meg a területek összegét cm²-ben!`,
        answer: 200,
        type: 'multiplication',
        expression: `100 / (1 − 1/2) = 200`,
    },
    {
        stage: 4,
        question: `Az első n pozitív páratlan szám összege 1600.
Határozd meg n-et!`,
        answer: 40,
        type: 'multiplication',
        expression: `n² = 1600 → n = 40`,
    },
    {
        stage: 4,
        question: `A 7 + 11 + 15 + ⋯ számtani sorozat első n tagjának összege 738.
Határozd meg n-et!`,
        answer: 18,
        type: 'multiplication',
        expression: `n = 18`,
    },
    {
        stage: 4,
        question: `Az 1 + 2 + 4 + ⋯ + 2ⁿ⁻¹ összeg értéke 1023.
Határozd meg n-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `2ⁿ − 1 = 1023 → n = 10`,
    },
    {
        stage: 4,
        question: `Egy 1,2 m-ről leejtett labda minden pattanás után az előző magasság 75%-ára pattan.
Mekkora utat tesz meg az 1. és a 12. talajra érkezése között? (3 tizedesjegy, méter)`,
        answer: 6.896,
        type: 'multiplication',
        expression: `≈ 6,896 m`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Vizsgáld az aₙ = (3n + 1)/(4n + 2) sorozatot!
Add meg a határértékét!`,
        answer: 0.75,
        type: 'multiplication',
        expression: `Szigorúan növekvő, korlátos, lim = 3/4`,
    },
    {
        stage: 5,
        question: `Vizsgáld az aₙ = (5n + 2)/(n + 3) sorozatot!
Add meg a határértékét!`,
        answer: 5,
        type: 'multiplication',
        expression: `Szigorúan növekvő, korlátos, lim = 5`,
    },
    {
        stage: 5,
        question: `Vizsgáld az aₙ = (n + 4)/n sorozatot!
Add meg a határértékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `Szigorúan csökkenő, lim = 1`,
    },
    {
        stage: 5,
        question: `Vizsgáld az aₙ = 2 + 3/n sorozatot!
Add meg a határértékét!`,
        answer: 2,
        type: 'multiplication',
        expression: `Szigorúan csökkenő, lim = 2`,
    },
    {
        stage: 5,
        question: `Vizsgáld az aₙ = (1/2)ⁿ sorozatot!
Add meg a határértékét!`,
        answer: 0,
        type: 'multiplication',
        expression: `Szigorúan csökkenő, lim = 0`,
    },
    {
        stage: 5,
        question: `Vizsgáld az aₙ = (−1)ⁿ / n sorozatot!
Add meg a határértékét!`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem monoton; korlátos; lim = 0`,
    },
    {
        stage: 5,
        question: `Vizsgáld az aₙ = 5 − 2/n sorozatot!
Add meg a határértékét!`,
        answer: 5,
        type: 'multiplication',
        expression: `Szigorúan növekvő, lim = 5`,
    },
    {
        stage: 5,
        question: `Vizsgáld az aₙ = n/(n + 1) sorozatot!
Add meg a határértékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `Szigorúan növekvő, lim = 1`,
    },
    {
        stage: 5,
        question: `a₁ = 1, aₙ₊₁ = (aₙ + 3)/2.
Határozd meg a határértékét!`,
        answer: 3,
        type: 'multiplication',
        expression: `Szigorúan növekvő, aₙ < 3, lim = 3`,
    },
    {
        stage: 5,
        question: `a₁ = 10, aₙ₊₁ = (1/2)aₙ + 2.
Határozd meg a határértékét!`,
        answer: 4,
        type: 'multiplication',
        expression: `Szigorúan csökkenő, aₙ > 4, lim = 4`,
    },
    {
        stage: 5,
        question: `aₙ = 7 + 3 · 0,8ⁿ.
Határozd meg a határértékét!`,
        answer: 7,
        type: 'multiplication',
        expression: `Szigorúan csökkenő, lim = 7`,
    },
    {
        stage: 5,
        question: `bₙ = 12 / (1 + 5 · 0,7ⁿ).
Határozd meg a határértékét!`,
        answer: 12,
        type: 'multiplication',
        expression: `Szigorúan növekvő, lim = 12`,
    },
    {
        stage: 5,
        question: `aₙ = (2n² + 1)/(n² + 3).
Határozd meg a határértékét!`,
        answer: 2,
        type: 'multiplication',
        expression: `Szigorúan növekvő, lim = 2`,
    },
    {
        stage: 5,
        question: `aₙ = n/(n² + 1).
Határozd meg a határértékét!`,
        answer: 0,
        type: 'multiplication',
        expression: `Szigorúan csökkenő n ≥ 1-re a maximum után; lim = 0`,
    },
    {
        stage: 5,
        question: `Konvergens-e az aₙ = (−1)ⁿ + 1/n sorozat?
Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem konvergens`,
    },
    {
        stage: 5,
        question: `Határozd meg az aₙ = (3ⁿ + 2ⁿ)/3ⁿ sorozat határértékét!`,
        answer: 1,
        type: 'multiplication',
        expression: `1 + (2/3)ⁿ → 1`,
    },
    {
        stage: 5,
        question: `Határozd meg az aₙ = 2ⁿ / 5ⁿ sorozat határértékét!`,
        answer: 0,
        type: 'multiplication',
        expression: `(2/5)ⁿ → 0`,
    },
    {
        stage: 5,
        question: `Sₙ = 3 + 3/2 + 3/4 + ⋯ + 3/2ⁿ⁻¹.
Határozd meg a határértékét!`,
        answer: 6,
        type: 'multiplication',
        expression: `Szigorúan növekvő, Sₙ < 6, lim = 6`,
    },
    {
        stage: 5,
        question: `aₙ = 1 + 1/2 + 1/4 + ⋯ + 1/2ⁿ⁻¹.
Határozd meg a határértékét!`,
        answer: 2,
        type: 'multiplication',
        expression: `lim = 2`,
    },
    {
        stage: 5,
        question: `„Minden konvergens valós számsorozat korlátos.”
Igaz-e? Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Számtani sorozat: a₅ = 17, a₁₂ = 45.
Határozd meg S₃₀-at!`,
        answer: 1770,
        type: 'multiplication',
        expression: `S₃₀ = 1770`,
    },
    {
        stage: 6,
        question: `Pozitív mértani sorozat: a₃ = 18, a₆ = 486.
Határozd meg S₈-at!`,
        answer: 6560,
        type: 'multiplication',
        expression: `S₈ = 6560`,
    },
    {
        stage: 6,
        question: `Számtani sorozat: S₁₀ = 155, S₂₀ = 610.
Határozd meg d-t!`,
        answer: 3,
        type: 'multiplication',
        expression: `a₁ = 2, d = 3`,
    },
    {
        stage: 6,
        question: `Mértani sorozat: S₃ = 21, S₆ = 189, q > 0.
Határozd meg q-t!`,
        answer: 2,
        type: 'multiplication',
        expression: `a₁ = 3, q = 2`,
    },
    {
        stage: 6,
        question: `Négy egymást követő számtani sorozattag összege 44, az első és a negyedik szorzata 85.
Add meg a legkisebb tagot!`,
        answer: 5,
        type: 'multiplication',
        expression: `5, 9, 13, 17`,
    },
    {
        stage: 6,
        question: `Három egymást követő pozitív mértani sorozattag összege 26, szorzata 216.
Add meg a legnagyobb tagot!`,
        answer: 18,
        type: 'multiplication',
        expression: `2, 6, 18`,
    },
    {
        stage: 6,
        question: `Számtani sorozat, d = 2. Az első, harmadik és hetedik tag mértani sorozatot alkot.
Add meg az első tagot!`,
        answer: 4,
        type: 'multiplication',
        expression: `4, 8, 16`,
    },
    {
        stage: 6,
        question: `Számtani sorozat, d = 3. Az első, második és negyedik tag mértani sorozatot alkot.
Add meg az első tagot!`,
        answer: 3,
        type: 'multiplication',
        expression: `3, 6, 12`,
    },
    {
        stage: 6,
        question: `Mértani sorozat: a₁ + a₃ = 20, a₂ + a₄ = 40, q > 0.
Határozd meg az ötödik tagot!`,
        answer: 64,
        type: 'multiplication',
        expression: `a₅ = 64`,
    },
    {
        stage: 6,
        question: `Számtani sorozat: a₁ + a₃ = 30, a₂ + a₄ = 46.
Határozd meg az ötödik tagot!`,
        answer: 39,
        type: 'multiplication',
        expression: `a₅ = 39`,
    },
    {
        stage: 6,
        question: `Egy 1 m oldalú négyzetbe újabb négyzeteket rajzolunk, oldaluk mindig az előző 5/7-szerese.
Határozd meg az összes kerület végtelen összegét méterben!`,
        answer: 14,
        type: 'multiplication',
        expression: `4 / (1 − 5/7) = 14`,
    },
    {
        stage: 6,
        question: `Valaki 14 napon át minden nap 5-tel több felülést végez. Összesen 1001.
Hány felülést végez az első napon?`,
        answer: 39,
        type: 'multiplication',
        expression: `39 és 104`,
    },
    {
        stage: 6,
        question: `Egy versenyautó az első órában 45 km-t megy, minden következő órában az előző 95,5%-át.
Hányadik órában megy először 20 km-nél kevesebbet?`,
        answer: 19,
        type: 'multiplication',
        expression: `A 19. órában`,
    },
    {
        stage: 6,
        question: `Két befektetés: 500 000 Ft havi 1%-kal, és 450 000 Ft havi 1,3%-kal.
Hányadik hónap végén lesz először több a második?`,
        answer: 36,
        type: 'multiplication',
        expression: `A 36. hónap végén`,
    },
    {
        stage: 6,
        question: `1 000 000 Ft hitel, havi 2% kamat, 60 azonos törlesztő.
t = H qⁿ(q−1)/(qⁿ−1). Add meg a havi részletet egész forintban!`,
        answer: 28768,
        type: 'multiplication',
        expression: `≈ 28 768 Ft/hó`,
    },
    {
        stage: 6,
        question: `Mely 5-nél nagyobb egész n-ekre alkot számtani sorozatot
C(n,4), C(n,5), C(n,6)?

Add meg az n értékek halmazát!`,
        answer: 2,
        expectedSet: ['7', '14'],
        type: 'multiplication',
        expression: `n = 7 vagy n = 14`,
    },
    {
        stage: 6,
        question: `aₙ = aₙ₋₁ + n (n ≥ 2), és a₁ + a₂ + a₃ + a₄ = 360.
Határozd meg a₁-et!`,
        answer: 86,
        type: 'multiplication',
        expression: `86, 88, 91, 95`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy aₙ = (n + 4)/n szigorúan csökkenő, korlátos, és lim = 1.
Add meg a határértéket!`,
        answer: 1,
        type: 'multiplication',
        expression: `1 < aₙ ≤ 5, lim = 1`,
    },
    {
        stage: 6,
        question: `aₙ = 2 · (−1/2)ⁿ.
Add meg a legkisebb pozitív egész n-et, amelyre |aₙ| < 10⁻⁷!`,
        answer: 25,
        type: 'multiplication',
        expression: `n = 25; S₁₀ = −341/512`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be: ha |q| < 1, akkor aₙ = a₁ qⁿ⁻¹ határértéke 0.
Add meg ezt a határértéket!`,
        answer: 0,
        type: 'multiplication',
        expression: `lim aₙ = 0, S = a₁/(1−q)`,
    },
];
