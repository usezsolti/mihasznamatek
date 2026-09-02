import type { Question } from './types';

/**
 * Valószínűségszámítás — 6 szint × 20 feladat (Valószínűségszámítás.pdf).
 * 1 Klasszikus → 2 Mintavétel visszatevés nélkül → 3 Binomiális →
 * 4 Feltételes / Bayes → 5 Várható érték → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 * Valószínűségek: 3 tizedesjegy (osztályozás |Δ| < 0,01).
 * Igen/nem: 1 / 0.
 */
export const getValoszinusegPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Egy szabályos dobókockával dobunk. Mennyi annak a valószínűsége, hogy 4-nél nagyobb számot dobunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `P = 2/6 = 1/3`,
    },
    {
        stage: 1,
        question: `Két szabályos dobókockával dobunk. Mennyi annak a valószínűsége, hogy a dobott számok összege 8?

Add meg 3 tizedesjeggyel!`,
        answer: 0.139,
        type: 'multiplication',
        expression: `5 kedvező / 36`,
    },
    {
        stage: 1,
        question: `Két szabályos dobókockával dobunk. Mennyi annak a valószínűsége, hogy a dobott számok szorzata osztható 3-mal?

Add meg 3 tizedesjeggyel!`,
        answer: 0.556,
        type: 'multiplication',
        expression: `1 − 16/36 = 20/36 = 5/9`,
    },
    {
        stage: 1,
        question: `Egy szabályos pénzérmét négyszer feldobunk. Mennyi annak a valószínűsége, hogy pontosan két fej lesz?`,
        answer: 0.375,
        type: 'multiplication',
        expression: `C(4,2)/16 = 6/16 = 3/8`,
    },
    {
        stage: 1,
        question: `Egy szabályos pénzérmét ötször feldobunk. Mennyi annak a valószínűsége, hogy legalább egyszer írást kapunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.969,
        type: 'multiplication',
        expression: `1 − 1/32 = 31/32`,
    },
    {
        stage: 1,
        question: `Egy dobozban 7 piros és 5 kék golyó van. Egy golyót húzunk. Mennyi a piros húzásának valószínűsége?

Add meg 3 tizedesjeggyel!`,
        answer: 0.583,
        type: 'multiplication',
        expression: `7/12`,
    },
    {
        stage: 1,
        question: `Egy dobozban 6 fehér, 3 fekete és 2 zöld golyó van. Egy golyót húzunk. Mennyi annak a valószínűsége, hogy nem fekete golyót húzunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.727,
        type: 'multiplication',
        expression: `8/11`,
    },
    {
        stage: 1,
        question: `Az 1, 2, …, 24 számok közül véletlenszerűen választunk egyet. Mennyi annak a valószínűsége, hogy a szám 5-tel vagy 6-tal osztható?

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `8/24 = 1/3`,
    },
    {
        stage: 1,
        question: `Az 1, 2, …, 30 számok közül egyet választunk. Mennyi annak a valószínűsége, hogy prímszámot választunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `10/30 = 1/3`,
    },
    {
        stage: 1,
        question: `Három szabályos dobókockával dobunk. Mennyi annak a valószínűsége, hogy mindhárom dobott szám azonos?

Add meg 3 tizedesjeggyel!`,
        answer: 0.028,
        type: 'multiplication',
        expression: `6/216 = 1/36`,
    },
    {
        stage: 1,
        question: `Két szabályos dobókockával dobunk. Mennyi annak a valószínűsége, hogy a nagyobbik dobott szám 6?

Add meg 3 tizedesjeggyel!`,
        answer: 0.306,
        type: 'multiplication',
        expression: `11/36`,
    },
    {
        stage: 1,
        question: `Két szabályos dobókockával dobunk. Mennyi annak a valószínűsége, hogy a két dobott szám különbségének abszolútértéke 1?

Add meg 3 tizedesjeggyel!`,
        answer: 0.278,
        type: 'multiplication',
        expression: `10/36 = 5/18`,
    },
    {
        stage: 1,
        question: `Egy szabályos pénzérmét háromszor feldobunk. Mennyi annak a valószínűsége, hogy pontosan egy fej lesz?`,
        answer: 0.375,
        type: 'multiplication',
        expression: `C(3,1)/8 = 3/8`,
    },
    {
        stage: 1,
        question: `Egy 12 lapos csomagban 5 nyerő lap van. Egy lapot húzunk. Mennyi a nyerés valószínűsége?

Add meg 3 tizedesjeggyel!`,
        answer: 0.417,
        type: 'multiplication',
        expression: `5/12`,
    },
    {
        stage: 1,
        question: `Az 1, 2, …, 15 számok közül egyet választunk. Mennyi annak a valószínűsége, hogy összetett számot választunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.533,
        type: 'multiplication',
        expression: `8/15`,
    },
    {
        stage: 1,
        question: `Egy szabályos dobókockával dobunk. Jelölje A azt az eseményt, hogy páros számot dobunk, B pedig azt, hogy 3-nál nagyobbat. Határozd meg P(A ∩ B)-t!

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `{4, 6} → 2/6 = 1/3`,
    },
    {
        stage: 1,
        question: `Két szabályos dobókockával dobunk. Mennyi annak a valószínűsége, hogy a dobott számok összege legalább 10?

Add meg 3 tizedesjeggyel!`,
        answer: 0.167,
        type: 'multiplication',
        expression: `6/36 = 1/6`,
    },
    {
        stage: 1,
        question: `Egy szabályos dobókockával háromszor dobunk. Mennyi annak a valószínűsége, hogy egyszer sem dobunk 6-ost?

Add meg 3 tizedesjeggyel!`,
        answer: 0.579,
        type: 'multiplication',
        expression: `(5/6)^3 = 125/216`,
    },
    {
        stage: 1,
        question: `Egy szabályos pénzérmét háromszor feldobunk. Mennyi annak a valószínűsége, hogy mindhárom dobás azonos eredményű?`,
        answer: 0.25,
        type: 'multiplication',
        expression: `2/8 = 1/4`,
    },
    {
        stage: 1,
        question: `Egy szerencsekerék 8 egyenlő nagyságú mezőből áll, amelyek közül 3 piros. Mennyi annak a valószínűsége, hogy egy pörgetés eredménye piros mező?`,
        answer: 0.375,
        type: 'multiplication',
        expression: `3/8`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Egy dobozban 6 fehér és 4 piros golyó van. Egyszerre 2 golyót húzunk. Mennyi annak a valószínűsége, hogy mindkettő fehér?

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `C(6,2)/C(10,2) = 1/3`,
    },
    {
        stage: 2,
        question: `Egy dobozban 6 fehér és 4 piros golyó van. Egyszerre 2 golyót húzunk. Mennyi annak a valószínűsége, hogy különböző színűek?

Add meg 3 tizedesjeggyel!`,
        answer: 0.533,
        type: 'multiplication',
        expression: `C(6,1)C(4,1)/C(10,2) = 8/15`,
    },
    {
        stage: 2,
        question: `Egy urnában 8 sárga és 7 zöld golyó van. Egyszerre 3 golyót húzunk. Mennyi annak a valószínűsége, hogy mindhárom egyszínű?`,
        answer: 0.2,
        type: 'multiplication',
        expression: `(C(8,3)+C(7,3))/C(15,3) = 1/5`,
    },
    {
        stage: 2,
        question: `Egy 14 lapos csomagban 5 nyerő lap van. Egyszerre 4 lapot húzunk. Mennyi annak a valószínűsége, hogy pontosan 2 nyerő lapot húzunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.36,
        type: 'multiplication',
        expression: `C(5,2)C(9,2)/C(14,4)`,
    },
    {
        stage: 2,
        question: `Egy 18 fős csoportban 7 lány van. Véletlenszerűen kiválasztunk 4 embert. Mennyi annak a valószínűsége, hogy pontosan 2 lány kerül a kiválasztottak közé?

Add meg 3 tizedesjeggyel!`,
        answer: 0.377,
        type: 'multiplication',
        expression: `C(7,2)C(11,2)/C(18,4)`,
    },
    {
        stage: 2,
        question: `Egy 24 termékből álló készletben 5 hibás termék van. Véletlenszerűen kiválasztunk 6 terméket. Mennyi annak a valószínűsége, hogy egyik sem hibás?

Add meg 3 tizedesjeggyel!`,
        answer: 0.202,
        type: 'multiplication',
        expression: `C(19,6)/C(24,6)`,
    },
    {
        stage: 2,
        question: `Egy 24 termékből álló készletben 5 hibás termék van. Véletlenszerűen kiválasztunk 6 terméket. Mennyi annak a valószínűsége, hogy legalább egy hibás termék kerül a mintába?

Add meg 3 tizedesjeggyel!`,
        answer: 0.798,
        type: 'multiplication',
        expression: `1 − C(19,6)/C(24,6)`,
    },
    {
        stage: 2,
        question: `Egy 12 fős társaságból 4 embert választunk. Mennyi annak a valószínűsége, hogy két előre megjelölt személy mindketten bekerülnek?

Add meg 3 tizedesjeggyel!`,
        answer: 0.091,
        type: 'multiplication',
        expression: `C(10,2)/C(12,4) = 1/11`,
    },
    {
        stage: 2,
        question: `Egy 12 fős társaságból 4 embert választunk. Mennyi annak a valószínűsége, hogy két előre megjelölt személy közül pontosan az egyik kerül be?

Add meg 3 tizedesjeggyel!`,
        answer: 0.485,
        type: 'multiplication',
        expression: `2·C(10,3)/C(12,4)`,
    },
    {
        stage: 2,
        question: `Egy 52 lapos francia kártyacsomagból 5 lapot húzunk. Mennyi annak a valószínűsége, hogy pontosan egy ász lesz közöttük?

Add meg 3 tizedesjeggyel!`,
        answer: 0.299,
        type: 'multiplication',
        expression: `C(4,1)C(48,4)/C(52,5)`,
    },
    {
        stage: 2,
        question: `Egy 36 lapos kártyacsomag négy színből áll, színenként 9 lappal. Négy lapot húzunk. Mennyi annak a valószínűsége, hogy mind a négy lap ugyanabból a színből való?

Add meg 3 tizedesjeggyel!`,
        answer: 0.009,
        type: 'multiplication',
        expression: `4·C(9,4)/C(36,4)`,
    },
    {
        stage: 2,
        question: `Az 1, 2, …, 18 számok közül egyszerre 3-at választunk. Mennyi annak a valószínűsége, hogy mindhárom kiválasztott szám osztható 4-gyel?

Add meg 3 tizedesjeggyel!`,
        answer: 0.005,
        type: 'multiplication',
        expression: `C(4,3)/C(18,3) = 1/204`,
    },
    {
        stage: 2,
        question: `Az 1, 2, …, 18 számok közül egyszerre 3-at választunk. Mennyi annak a valószínűsége, hogy pontosan két páros számot választunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.397,
        type: 'multiplication',
        expression: `C(9,2)C(9,1)/C(18,3)`,
    },
    {
        stage: 2,
        question: `Egy dobozban 7 kék és 5 piros golyó van. Egyszerre 4 golyót húzunk. Mennyi annak a valószínűsége, hogy legalább egy piros lesz közöttük?

Add meg 3 tizedesjeggyel!`,
        answer: 0.929,
        type: 'multiplication',
        expression: `1 − C(7,4)/C(12,4)`,
    },
    {
        stage: 2,
        question: `Egy 10 fős csoportban 4 nő és 6 férfi van. Véletlenszerűen 3 embert választunk. Mennyi annak a valószínűsége, hogy mindhárman azonos neműek?`,
        answer: 0.2,
        type: 'multiplication',
        expression: `(C(4,3)+C(6,3))/C(10,3) = 1/5`,
    },
    {
        stage: 2,
        question: `Egy polcon 11 könyv van, közülük 5 matematika könyv. Véletlenszerűen 4 könyvet választunk. Mennyi annak a valószínűsége, hogy legalább 2 matematika könyv kerül közéjük?

Add meg 3 tizedesjeggyel!`,
        answer: 0.652,
        type: 'multiplication',
        expression: `(C(5,2)C(6,2)+C(5,3)C(6,1)+C(5,4))/C(11,4)`,
    },
    {
        stage: 2,
        question: `Egy urnában 5 fekete és 8 fehér golyó van. Egyszerre 5 golyót húzunk. Mennyi annak a valószínűsége, hogy pontosan 1 fekete golyó lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.272,
        type: 'multiplication',
        expression: `C(5,1)C(8,4)/C(13,5)`,
    },
    {
        stage: 2,
        question: `Egy 28 fős osztályban 16 lány van. Öt tanulót választunk. Mennyi annak a valószínűsége, hogy mind az öt lány?

Add meg 3 tizedesjeggyel!`,
        answer: 0.044,
        type: 'multiplication',
        expression: `C(16,5)/C(28,5)`,
    },
    {
        stage: 2,
        question: `Egy dobozban 7 fehér és 3 piros golyó van. Öt golyót húzunk visszatevés nélkül.
Melyik fehér-húzásszám a valószínűbb: pontosan 2 vagy pontosan 4?

Add meg a valószínűbb darabszámot!`,
        answer: 4,
        type: 'multiplication',
        expression: `P(4 fehér) = 5/12 > P(2 fehér) = 1/12`,
    },
    {
        stage: 2,
        question: `Egy kiállításon 60 tárgy szerepel. Közülük 15-öt Anna, 20-at Bence, 25-öt Csilla készített. Véletlenszerűen 2 tárgyat választunk. Mennyi annak a valószínűsége, hogy ugyanaz a személy készítette mindkettőt?

Add meg 3 tizedesjeggyel!`,
        answer: 0.336,
        type: 'multiplication',
        expression: `(C(15,2)+C(20,2)+C(25,2))/C(60,2)`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Egy szabályos pénzérmét 6-szor feldobunk. Mennyi annak a valószínűsége, hogy pontosan 4 fej lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.234,
        type: 'multiplication',
        expression: `C(6,4)·(1/2)^6 = 15/64`,
    },
    {
        stage: 3,
        question: `Egy szabályos dobókockával 8-szor dobunk. Mennyi annak a valószínűsége, hogy pontosan kétszer dobunk 6-ost?

Add meg 3 tizedesjeggyel!`,
        answer: 0.26,
        type: 'multiplication',
        expression: `C(8,2)·(1/6)^2·(5/6)^6`,
    },
    {
        stage: 3,
        question: `Egy termék 3% valószínűséggel hibás. 20 egymástól független terméket vizsgálunk. Mennyi annak a valószínűsége, hogy pontosan 1 hibás?

Add meg 3 tizedesjeggyel!`,
        answer: 0.336,
        type: 'multiplication',
        expression: `C(20,1)·0,03·0,97^19`,
    },
    {
        stage: 3,
        question: `Egy termék 3% valószínűséggel hibás. 20 egymástól független terméket vizsgálunk. Mennyi annak a valószínűsége, hogy egyetlen hibás termék sincs?

Add meg 3 tizedesjeggyel!`,
        answer: 0.544,
        type: 'multiplication',
        expression: `0,97^20`,
    },
    {
        stage: 3,
        question: `Egy termék 3% valószínűséggel hibás. 20 egymástól független terméket vizsgálunk. Mennyi annak a valószínűsége, hogy legalább egy hibás termék van?

Add meg 3 tizedesjeggyel!`,
        answer: 0.456,
        type: 'multiplication',
        expression: `1 − 0,97^20`,
    },
    {
        stage: 3,
        question: `Egy lövész találati valószínűsége 0,65. Ötször lő. Mennyi annak a valószínűsége, hogy pontosan 3 találata lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.336,
        type: 'multiplication',
        expression: `C(5,3)·0,65^3·0,35^2`,
    },
    {
        stage: 3,
        question: `Egy tesztkérdésre egy tanuló 0,7 valószínűséggel válaszol helyesen. Nyolc független kérdés esetén mennyi annak a valószínűsége, hogy legalább 6 jó válasza lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.552,
        type: 'multiplication',
        expression: `Σ_{k=6}^{8} C(8,k)·0,7^k·0,3^{8−k}`,
    },
    {
        stage: 3,
        question: `Egy gép által gyártott termék 8% valószínűséggel hibás. 25 termékből mennyi annak a valószínűsége, hogy legfeljebb 2 hibás lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.677,
        type: 'multiplication',
        expression: `Σ_{k=0}^{2} C(25,k)·0,08^k·0,92^{25−k}`,
    },
    {
        stage: 3,
        question: `Egy esemény minden kísérletben 0,3 valószínűséggel következik be. Tíz független kísérletben mennyi annak a valószínűsége, hogy legalább 4-szer bekövetkezik?

Add meg 3 tizedesjeggyel!`,
        answer: 0.35,
        type: 'multiplication',
        expression: `1 − Σ_{k=0}^{3} C(10,k)·0,3^k·0,7^{10−k}`,
    },
    {
        stage: 3,
        question: `Egy csokoládé 15% valószínűséggel nyerő. Hat csokoládét vásárolunk. Mennyi annak a valószínűsége, hogy legalább egy nyerő lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.623,
        type: 'multiplication',
        expression: `1 − 0,85^6`,
    },
    {
        stage: 3,
        question: `Egy csokoládé 15% valószínűséggel nyerő. Hat csokoládét vásárolunk. Mennyi annak a valószínűsége, hogy pontosan 2 nyerő csokoládé van?

Add meg 3 tizedesjeggyel!`,
        answer: 0.176,
        type: 'multiplication',
        expression: `C(6,2)·0,15^2·0,85^4`,
    },
    {
        stage: 3,
        question: `Egy utas 0,97 valószínűséggel jelenik meg a járat indulásánál. 150 egymástól független utas esetén mennyi annak a valószínűsége, hogy mind a 150 megjelenik?

Add meg 3 tizedesjeggyel!`,
        answer: 0.01,
        type: 'multiplication',
        expression: `0,97^150`,
    },
    {
        stage: 3,
        question: `Egy fa 5% valószínűséggel szúrágta. 40 fa közül mennyi annak a valószínűsége, hogy legfeljebb egy szúrágta?

Add meg 3 tizedesjeggyel!`,
        answer: 0.399,
        type: 'multiplication',
        expression: `0,95^40 + 40·0,05·0,95^39`,
    },
    {
        stage: 3,
        question: `Egy vásárló 1/100 valószínűséggel reklamál. 120 vásárló esetén mennyi annak a valószínűsége, hogy legfeljebb 2 reklamáció érkezik?

Add meg 3 tizedesjeggyel!`,
        answer: 0.88,
        type: 'multiplication',
        expression: `Σ_{k=0}^{2} C(120,k)·0,01^k·0,99^{120−k}`,
    },
    {
        stage: 3,
        question: `Egy magozógép egy meggy magját 0,008 valószínűséggel nem távolítja el. 100 meggy esetén mennyi annak a valószínűsége, hogy legalább 2 mag marad?

Add meg 3 tizedesjeggyel!`,
        answer: 0.191,
        type: 'multiplication',
        expression: `1 − 0,992^100 − 100·0,008·0,992^99`,
    },
    {
        stage: 3,
        question: `Egy akkumulátor 0,12 valószínűséggel működik 50 hónapnál rövidebb ideig. 18 akkumulátorból mennyi annak a valószínűsége, hogy legfeljebb 2 ilyen lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.631,
        type: 'multiplication',
        expression: `Σ_{k=0}^{2} C(18,k)·0,12^k·0,88^{18−k}`,
    },
    {
        stage: 3,
        question: `Egy sportlövő találati valószínűsége 0,3. Kilenc lövésből mennyi annak a valószínűsége, hogy legalább 3 találata lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.537,
        type: 'multiplication',
        expression: `1 − Σ_{k=0}^{2} C(9,k)·0,3^k·0,7^{9−k}`,
    },
    {
        stage: 3,
        question: `Egy azonosító hibás kitöltésének valószínűsége 0,01. 25 azonosító közül mennyi annak a valószínűsége, hogy legalább 2 hibás?

Add meg 3 tizedesjeggyel!`,
        answer: 0.026,
        type: 'multiplication',
        expression: `1 − 0,99^25 − 25·0,01·0,99^24`,
    },
    {
        stage: 3,
        question: `Egy lövész három független lövést ad le. Egy lövés találati valószínűsége p. Annak valószínűsége, hogy pontosan 1 vagy pontosan 2 találata lesz, 0,63.
Add meg a kisebb p-t!`,
        answer: 0.3,
        type: 'multiplication',
        expression: `3p(1−p)=0,63 → p=0,3 vagy p=0,7`,
    },
    {
        stage: 3,
        question: `Egy esemény egy próbán 0,2 valószínűséggel következik be. Legalább hány független próbát kell végezni ahhoz, hogy legalább egyszer bekövetkezzen 99%-os valószínűséggel?`,
        answer: 21,
        type: 'multiplication',
        expression: `1 − 0,8^n ≥ 0,99 → n ≥ 21`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Egy üzemben a termékek 70%-a az A gépről, 30%-a a B gépről származik. Az A gép selejtaránya 6%, a B gépé 2%. Mennyi egy véletlen termék selejtességének valószínűsége?`,
        answer: 0.048,
        type: 'multiplication',
        expression: `0,7·0,06 + 0,3·0,02 = 0,048`,
    },
    {
        stage: 4,
        question: `Egy üzemben a termékek 70%-a az A gépről, 30%-a a B gépről származik. Az A gép selejtaránya 6%, a B gépé 2%. Egy termékről kiderül, hogy selejtes. Mennyi annak a valószínűsége, hogy az A gépről származik?`,
        answer: 0.875,
        type: 'multiplication',
        expression: `0,042/0,048 = 0,875`,
    },
    {
        stage: 4,
        question: `Egy vállalat az áru 65%-át az első, 35%-át a második beszállítótól kapja. Az első beszállító termékeinek 2%-a, a másodikénak 7%-a hibás. Mennyi egy véletlen termék hibásságának valószínűsége?`,
        answer: 0.0375,
        type: 'multiplication',
        expression: `0,65·0,02 + 0,35·0,07 = 0,0375`,
    },
    {
        stage: 4,
        question: `Egy vállalat az áru 65%-át az első, 35%-át a második beszállítótól kapja. Az első beszállító termékeinek 2%-a, a másodikénak 7%-a hibás. Egy termék hibásnak bizonyult. Mennyi annak a valószínűsége, hogy a második beszállítótól érkezett?

Add meg 3 tizedesjeggyel!`,
        answer: 0.653,
        type: 'multiplication',
        expression: `0,0245/0,0375 = 49/75`,
    },
    {
        stage: 4,
        question: `Egy dobozban 4 piros és 6 kék golyó van. Visszatevéssel háromszor húzunk. Legyen A az az esemény, hogy pontosan 2 pirosat húzunk, B pedig az, hogy legalább 1 pirosat húzunk. Határozd meg P(A | B)-t!

Add meg 3 tizedesjeggyel!`,
        answer: 0.367,
        type: 'multiplication',
        expression: `C(3,2)·0,4^2·0,6 / (1−0,6^3) = 18/49`,
    },
    {
        stage: 4,
        question: `Egy dobozban 4 piros és 6 kék golyó van. Visszatevéssel háromszor húzunk. Legyen A az az esemény, hogy pontosan 2 pirosat húzunk, B pedig az, hogy legalább 1 pirosat húzunk.
Független-e az A és B esemény?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `P(A|B) ≠ P(A) → nem függetlenek`,
    },
    {
        stage: 4,
        question: `A sorsjegyek 45%-a kék, 55%-a zöld. A kék sorsjegyek 30%-a, a zöldek 50%-a tárgynyereményes. Mennyi annak a valószínűsége, hogy egy véletlen sorsjegy tárgynyereményes?`,
        answer: 0.41,
        type: 'multiplication',
        expression: `0,45·0,30 + 0,55·0,50 = 0,41`,
    },
    {
        stage: 4,
        question: `A sorsjegyek 45%-a kék, 55%-a zöld. A kék sorsjegyek 30%-a, a zöldek 50%-a tárgynyereményes. Egy tárgynyereményes sorsjegyet húztunk. Mennyi annak a valószínűsége, hogy kék?

Add meg 3 tizedesjeggyel!`,
        answer: 0.329,
        type: 'multiplication',
        expression: `0,135/0,41 = 27/82`,
    },
    {
        stage: 4,
        question: `Egy tojásszállítmány 55%-a az A, 45%-a a B termelőtől érkezik. Az A termelő tojásainak 70%-a, a B termelő tojásainak 40%-a első osztályú. Egy első osztályú tojást választunk. Mennyi annak a valószínűsége, hogy az A termelőtől származik?

Add meg 3 tizedesjeggyel!`,
        answer: 0.681,
        type: 'multiplication',
        expression: `0,385 / (0,385+0,180) = 77/113`,
    },
    {
        stage: 4,
        question: `Egy betegség gyakorisága 1%. A teszt érzékenysége 96%, specifitása 93%. Mennyi annak a valószínűsége, hogy egy véletlenül kiválasztott személy tesztje pozitív?`,
        answer: 0.0789,
        type: 'multiplication',
        expression: `0,01·0,96 + 0,99·0,07 = 0,0789`,
    },
    {
        stage: 4,
        question: `Egy betegség gyakorisága 1%. A teszt érzékenysége 96%, specifitása 93%. Egy személy tesztje pozitív. Mennyi annak a valószínűsége, hogy valóban beteg?

Add meg 3 tizedesjeggyel!`,
        answer: 0.122,
        type: 'multiplication',
        expression: `0,0096/0,0789 = 32/263`,
    },
    {
        stage: 4,
        question: `Két eseményre P(A) = 0,4, P(B) = 0,3, P(A ∩ B) = 0,12.
Függetlenek-e A és B?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `0,4·0,3 = 0,12`,
    },
    {
        stage: 4,
        question: `Két eseményre P(A) = 0,4, P(B) = 0,3, P(A ∩ B) = 0,10.
Függetlenek-e A és B?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `0,4·0,3 ≠ 0,10`,
    },
    {
        stage: 4,
        question: `Két eseményre P(A) = 0,8, P(B) = 0,6, P(A ∪ B) = 0,95.
Határozd meg P(A ∩ B)-t!`,
        answer: 0.45,
        type: 'multiplication',
        expression: `0,8+0,6−0,95 = 0,45`,
    },
    {
        stage: 4,
        question: `Két eseményre P(A) = 0,8, P(B) = 0,6, P(A ∪ B) = 0,95.
Határozd meg P(A | B)-t!`,
        answer: 0.75,
        type: 'multiplication',
        expression: `0,45/0,6 = 0,75`,
    },
    {
        stage: 4,
        question: `Egy gyártásban a termékek 97%-a hibátlan. Az ellenőrző rendszer a hibátlan termékek 2%-át, a hibás termékek 85%-át jelzi hibásnak. Mennyi annak a valószínűsége, hogy a rendszer hibajelzést ad?`,
        answer: 0.0449,
        type: 'multiplication',
        expression: `0,97·0,02 + 0,03·0,85 = 0,0449`,
    },
    {
        stage: 4,
        question: `Egy gyártásban a termékek 97%-a hibátlan. Az ellenőrző rendszer a hibátlan termékek 2%-át, a hibás termékek 85%-át jelzi hibásnak. A rendszer hibajelzést adott. Mennyi annak a valószínűsége, hogy a termék valóban hibás?

Add meg 3 tizedesjeggyel!`,
        answer: 0.568,
        type: 'multiplication',
        expression: `0,0255/0,0449 = 255/449`,
    },
    {
        stage: 4,
        question: `Egy diák 65% valószínűséggel tudja egy feleletválasztós kérdés helyes válaszát. Ha nem tudja, az 5 lehetőség közül véletlenszerűen tippel. Mennyi annak a valószínűsége, hogy helyesen válaszol?`,
        answer: 0.72,
        type: 'multiplication',
        expression: `0,65 + 0,35·1/5 = 0,72`,
    },
    {
        stage: 4,
        question: `Egy diák 65% valószínűséggel tudja egy feleletválasztós kérdés helyes válaszát. Ha nem tudja, az 5 lehetőség közül véletlenszerűen tippel. A diák helyesen válaszolt. Mennyi annak a valószínűsége, hogy valóban tudta a választ?

Add meg 3 tizedesjeggyel!`,
        answer: 0.903,
        type: 'multiplication',
        expression: `0,65/0,72 = 65/72`,
    },
    {
        stage: 4,
        question: `Öt azonos típusú akkumulátor mindegyikének q valószínűséggel kisebb az élettartama 55 hónapnál. Annak a valószínűsége, hogy mind az ötnek 55 hónapnál kisebb az élettartama, 0,72. Mennyi annak a valószínűsége, hogy egy véletlen akkumulátor élettartama legalább 55 hónap?

Add meg 3 tizedesjeggyel!`,
        answer: 0.064,
        type: 'multiplication',
        expression: `1 − 0,72^{1/5}`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Egy szabályos dobókockával dobunk. Legyen X a dobott szám. Határozd meg E(X)-et!`,
        answer: 3.5,
        type: 'multiplication',
        expression: `(1+2+3+4+5+6)/6 = 3,5`,
    },
    {
        stage: 5,
        question: `Egy pénzérmét 12-szer feldobunk, a fej valószínűsége 0,35. Legyen X a fejek száma. Határozd meg E(X)-et!`,
        answer: 4.2,
        type: 'multiplication',
        expression: `12·0,35 = 4,2`,
    },
    {
        stage: 5,
        question: `Egy játékban 0,2 valószínűséggel 6000 Ft-ot nyerünk, különben semmit. Határozd meg a nyeremény várható értékét Ft-ban!`,
        answer: 1200,
        type: 'multiplication',
        expression: `0,2·6000 = 1200`,
    },
    {
        stage: 5,
        question: `Egy sorsjegy ára 350 Ft. A sorsjegy 1% eséllyel 10000 Ft-ot, 9% eséllyel 1200 Ft-ot fizet, egyébként nem fizet semmit. Mennyi a vásárló nettó nyereményének várható értéke Ft-ban?`,
        answer: -142,
        type: 'multiplication',
        expression: `0,01·10000 + 0,09·1200 − 350 = −142`,
    },
    {
        stage: 5,
        question: `Egy játékban 1/6 valószínűséggel 1200 Ft-ot nyerünk, 1/3 valószínűséggel 400 Ft-ot nyerünk, egyébként 250 Ft-ot veszítünk. Határozd meg a várható nyereményt Ft-ban!

Add meg 3 tizedesjeggyel!`,
        answer: 208.333,
        type: 'multiplication',
        expression: `625/3 Ft`,
    },
    {
        stage: 5,
        question: `Egy teszten egy helyes válasz 3 pontot ér, egy hibás válaszért 1 pont levonás jár. Egy kérdésre 0,65 valószínűséggel válaszolunk helyesen. Mekkora egy kérdés pontszámának várható értéke?`,
        answer: 1.6,
        type: 'multiplication',
        expression: `0,65·3 + 0,35·(−1) = 1,6`,
    },
    {
        stage: 5,
        question: `Egy teszten egy helyes válasz 3 pontot ér, egy hibás válaszért 1 pont levonás jár. Egy kérdésre 0,65 valószínűséggel válaszolunk helyesen. 12 független kérdés van. Mekkora az összpontszám várható értéke?`,
        answer: 19.2,
        type: 'multiplication',
        expression: `12·1,6 = 19,2`,
    },
    {
        stage: 5,
        question: `Egy binomiális eloszlás paraméterei n = 80, p = 0,025. Határozd meg a várható értéket!`,
        answer: 2,
        type: 'multiplication',
        expression: `np = 2`,
    },
    {
        stage: 5,
        question: `Egy jótékonysági sorsoláson 300 darab, egyenként 400 Ft-os szelvényt adnak el. Egy 20000 Ft-os és tíz 2000 Ft-os nyeremény van. Mennyi a szervező várható haszna Ft-ban, ha minden szelvényt eladnak?`,
        answer: 80000,
        type: 'multiplication',
        expression: `300·400 − 20000 − 10·2000 = 80000`,
    },
    {
        stage: 5,
        question: `Egy véletlen változó a 1, 2, 3, 4 értékeket rendre 0,1, 0,2, 0,3, 0,4 valószínűséggel veszi fel. Határozd meg a várható értékét!`,
        answer: 3,
        type: 'multiplication',
        expression: `0,1+0,4+0,9+1,6 = 3`,
    },
    {
        stage: 5,
        question: `Egy szabályos dobókockával addig dobunk, amíg először 6-ost nem kapunk. Mekkora a szükséges dobások számának várható értéke?`,
        answer: 6,
        type: 'multiplication',
        expression: `1/(1/6) = 6`,
    },
    {
        stage: 5,
        question: `Egy érmét addig dobunk, amíg először fej nem lesz. A fej valószínűsége 0,35. Mekkora a dobásszám várható értéke?

Add meg 3 tizedesjeggyel!`,
        answer: 2.857,
        type: 'multiplication',
        expression: `1/0,35 = 20/7`,
    },
    {
        stage: 5,
        question: `Egy fiókban két piros, két kék és két zöld kesztyű van. Visszatevés nélkül húzunk addig, amíg először lesz két azonos színű kesztyűnk. Határozd meg a húzások számának várható értékét!`,
        answer: 3.2,
        type: 'multiplication',
        expression: `2·(1/5)+3·(2/5)+4·(2/5) = 3,2`,
    },
    {
        stage: 5,
        question: `Négy egyenlő valószínűségű szín közül választunk visszatevéssel addig, amíg először ismétlődik egy korábban kapott szín. Határozd meg a húzások számának várható értékét!

Add meg 3 tizedesjeggyel!`,
        answer: 3.219,
        type: 'multiplication',
        expression: `103/32`,
    },
    {
        stage: 5,
        question: `Egy játékban a pontszám −1, 0, 2, 5 lehet rendre 0,1, 0,2, 0,4, 0,3 valószínűséggel. Határozd meg a várható pontszámot!`,
        answer: 2.2,
        type: 'multiplication',
        expression: `−0,1 + 0 + 0,8 + 1,5 = 2,2`,
    },
    {
        stage: 5,
        question: `Egy biztosító egy szerződés alapján 0,005 valószínűséggel 200000 Ft-ot fizet, máskor semmit. Mekkora legalább a biztosítási díj Ft-ban, ha a biztosító várható nyeresége nem lehet negatív?`,
        answer: 1000,
        type: 'multiplication',
        expression: `0,005·200000 = 1000`,
    },
    {
        stage: 5,
        question: `Egy szabályos dobókockával játszunk. Ha 6-ost dobunk, x Ft-ot nyerünk; ha 1-est vagy 2-est, 200 Ft-ot nyerünk; ha 3, 4 vagy 5 az eredmény, 300 Ft-ot veszítünk. Határozd meg x-et úgy, hogy a játék igazságos legyen!`,
        answer: 500,
        type: 'multiplication',
        expression: `x/6 + 400/6 − 900/6 = 0 → x = 500`,
    },
    {
        stage: 5,
        question: `Egy dolgozatban két kérdésre biztosan tudjuk a választ. További három kérdésnél a helyes válasz valószínűsége rendre 1/2, 1/3, 1/4. Határozd meg az összes helyes válasz számának várható értékét!

Add meg 3 tizedesjeggyel!`,
        answer: 3.083,
        type: 'multiplication',
        expression: `2 + 1/2 + 1/3 + 1/4 = 37/12`,
    },
    {
        stage: 5,
        question: `Egy 100 férőhelyes járatra 102 jegyet adnak el. Minden jegytulajdonos egymástól függetlenül 0,96 valószínűséggel jelenik meg. A lemaradó utasoknak fejenként 400 euró kártérítés jár. Add meg a kártérítés várható értékét euróban, 3 tizedesjeggyel!`,
        answer: 38.869,
        type: 'multiplication',
        expression: `400[P(X=101)+2P(X=102)], X∼Bin(102; 0,96)`,
    },
    {
        stage: 5,
        question: `Négy csokoládét vásárolunk. Minden csokoládé egymástól függetlenül 0,2 valószínűséggel nyer egy újabb csokoládét, és minden nyereménycsokoládé ugyanilyen szabállyal újabb csokoládét nyerhet. Határozd meg a végül elfogyasztható csokoládék számának várható értékét!`,
        answer: 5,
        type: 'multiplication',
        expression: `4/(1−0,2) = 5`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Egy dobozban 9 sárga és 11 zöld golyó van. Visszatevés nélkül 4 golyót húzunk. Mennyi annak a valószínűsége, hogy mind a négy golyó azonos színű?

Add meg 3 tizedesjeggyel!`,
        answer: 0.094,
        type: 'multiplication',
        expression: `(C(9,4)+C(11,4))/C(20,4)`,
    },
    {
        stage: 6,
        question: `Egy dobozban 9 sárga és 11 zöld golyó van. Visszatevéssel 6-szor húzunk. Mennyi annak a valószínűsége, hogy pontosan 4 sárga és 2 zöld golyót húzunk?

Add meg 3 tizedesjeggyel!`,
        answer: 0.186,
        type: 'multiplication',
        expression: `C(6,4)·(9/20)^4·(11/20)^2`,
    },
    {
        stage: 6,
        question: `Az 1, 2, …, 20 számok közül egyszerre 3-at választunk. Mennyi annak a valószínűsége, hogy a három szám összege osztható 3-mal?

Add meg 3 tizedesjeggyel!`,
        answer: 0.337,
        type: 'multiplication',
        expression: `32/95`,
    },
    {
        stage: 6,
        question: `Egy dobozban 8 fehér és 4 piros golyó van. Visszatevés nélkül 6 golyót húzunk. Pontosan 3, illetve pontosan 5 fehér golyó húzásának valószínűsége azonos. Add meg ezt a közös valószínűséget 3 tizedesjeggyel!`,
        answer: 0.242,
        type: 'multiplication',
        expression: `C(8,3)C(4,3)/C(12,6) = C(8,5)C(4,1)/C(12,6)`,
    },
    {
        stage: 6,
        question: `Egy dobozban 8 fehér és 4 piros golyó van. Visszatevéssel 6 golyót húzunk. Mennyi a pontosan 5 fehér golyó húzásának valószínűsége?

Add meg 3 tizedesjeggyel!`,
        answer: 0.263,
        type: 'multiplication',
        expression: `C(6,5)·(2/3)^5·(1/3) = 192/729`,
    },
    {
        stage: 6,
        question: `Egy termék hibás voltának valószínűsége 0,004. 18 egymástól független terméket választunk. Mennyi annak a valószínűsége, hogy legalább 2 hibás van közöttük?

Add meg 3 tizedesjeggyel!`,
        answer: 0.002,
        type: 'multiplication',
        expression: `1 − 0,996^18 − 18·0,004·0,996^17`,
    },
    {
        stage: 6,
        question: `Egy 800 darabos szállítmányban pontosan 8 hibás termék van. Visszatevés nélkül 20 terméket választunk. Mennyi annak a valószínűsége, hogy a mintában nincs hibás termék?

Add meg 3 tizedesjeggyel!`,
        answer: 0.816,
        type: 'multiplication',
        expression: `C(792,20)/C(800,20)`,
    },
    {
        stage: 6,
        question: `Egy lövész minden lövéssel 0,18 valószínűséggel talál. Legalább hány lövés szükséges ahhoz, hogy legalább egy találat valószínűsége elérje a 98%-ot?`,
        answer: 20,
        type: 'multiplication',
        expression: `1 − 0,82^n ≥ 0,98 → n = 20`,
    },
    {
        stage: 6,
        question: `Egy termék selejtességének valószínűsége 0,00003. Legfeljebb hány terméket csomagolhatunk egy dobozba, ha annak valószínűsége, hogy legalább egy selejtes van benne, kisebb 1%-nál?`,
        answer: 335,
        type: 'multiplication',
        expression: `1 − 0,99997^n < 0,01 → n ≤ 335`,
    },
    {
        stage: 6,
        question: `Öt egymástól független kísérletben egy esemény minden alkalommal p valószínűséggel következik be. Annak a valószínűsége, hogy mind az öt kísérlet sikertelen, 0,16807. Határozd meg p-t!`,
        answer: 0.3,
        type: 'multiplication',
        expression: `(1−p)^5 = 0,16807 → p = 0,3`,
    },
    {
        stage: 6,
        question: `A sorsjegyek 30%-a kék, 70%-a zöld. A kékek 40%-a, a zöldek 20%-a tárgynyereményes. Egy véletlen sorsjegyről kiderül, hogy tárgynyereményes. Mennyi annak a valószínűsége, hogy kék?

Add meg 3 tizedesjeggyel!`,
        answer: 0.462,
        type: 'multiplication',
        expression: `0,12/0,26 = 6/13`,
    },
    {
        stage: 6,
        question: `Egy négyoldalú dobótesten az A, B, C, D helyzetek valószínűsége rendre 0,35, 0,35, 0,20, 0,10. Négy ilyen dobótestet egyszerre feldobunk. Mennyi annak a valószínűsége, hogy mind a négy különböző helyzetben érkezik le?`,
        answer: 0.0588,
        type: 'multiplication',
        expression: `4!·0,35·0,35·0,20·0,10 = 0,0588`,
    },
    {
        stage: 6,
        question: `Egy 160 férőhelyes járatra 163 jegyet adnak el. Minden jegytulajdonos egymástól függetlenül 0,97 valószínűséggel jelenik meg. Mennyi annak a valószínűsége, hogy minden megjelenő utas elfér?

Add meg 3 tizedesjeggyel!`,
        answer: 0.87,
        type: 'multiplication',
        expression: `P(X ≤ 160), X∼Bin(163; 0,97)`,
    },
    {
        stage: 6,
        question: `Négy fiú és négy lány véletlenszerűen négy kétszemélyes csapatot alkot. Mennyi annak a valószínűsége, hogy minden csapatban egy fiú és egy lány lesz?

Add meg 3 tizedesjeggyel!`,
        answer: 0.229,
        type: 'multiplication',
        expression: `4! / (7·5·3·1) = 8/35`,
    },
    {
        stage: 6,
        question: `Egy dobozban 4 piros és 6 kék golyó van. Visszatevéssel 4 golyót húzunk. Legyen A az az esemény, hogy pontosan 2 pirosat húzunk, B pedig az, hogy legalább 1 pirosat húzunk. Határozd meg P(A | B)-t!

Add meg 3 tizedesjeggyel!`,
        answer: 0.397,
        type: 'multiplication',
        expression: `C(4,2)·0,4^2·0,6^2 / (1−0,6^4) = 27/68`,
    },
    {
        stage: 6,
        question: `Egy sorsjegynél az 60000 Ft-os nyeremény valószínűsége p, a 3000 Ft-os nyereményé 19p. Összesen 4% a valószínűsége annak, hogy a sorsjegy nyer. Határozd meg a nyeremény várható értékét Ft-ban!`,
        answer: 234,
        type: 'multiplication',
        expression: `p=0,002; E = 60000p + 3000·19p = 234`,
    },
    {
        stage: 6,
        question: `Három tartomány, A, B, C, páronként egy-egy átjáróval kapcsolódik. Minden átjáró egymástól függetlenül p valószínűséggel nyitott. Jelölje E1 azt az eseményt, hogy A-ból pontosan az egyik másik tartomány érhető el. Add meg azt a p értéket, amelynél P(E1) maximális!

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `P(E1)=2p(1−p)^2, max p=1/3`,
    },
    {
        stage: 6,
        question: `Három tartomány, A, B, C, páronként egy-egy átjáróval kapcsolódik. Minden átjáró egymástól függetlenül p valószínűséggel nyitott. Jelölje E0 azt az eseményt, hogy A-ból egyik másik tartomány sem érhető el. Add meg a legkisebb p-t, amelyre P(E0) ≤ 0,02!

Add meg 3 tizedesjeggyel!`,
        answer: 0.859,
        type: 'multiplication',
        expression: `(1−p)^2 ≤ 0,02 → p ≥ 1−√0,02`,
    },
    {
        stage: 6,
        question: `Öt ember öt kulcsát véletlenszerű sorrendben kiosztjuk. Mennyi annak a valószínűsége, hogy legalább hárman a saját kulcsukat kapják?

Add meg 3 tizedesjeggyel!`,
        answer: 0.092,
        type: 'multiplication',
        expression: `11/120`,
    },
    {
        stage: 6,
        question: `András, Bori, Csaba és Dóra egy-egy szabályos dobókockával dobnak. Az nyer, aki a legnagyobb olyan számot dobja, amelyet senki más nem dobott. Ha ilyen szám nincs, senki sem nyer. Bori előre 4-est dobott, a másik három játékos ezután dob. Mennyi annak a valószínűsége, hogy Bori nyer?

Add meg 3 tizedesjeggyel!`,
        answer: 0.218,
        type: 'multiplication',
        expression: `47/216`,
    },
];
