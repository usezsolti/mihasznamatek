import type { Question } from './types';

/**
 * Halmazok — 6 szint × 20 feladat (MIHASZNAMATEK Halmazok.pdf).
 * 1 Alapok → 2 Műveletek → 3 Kombinatorika → 4 Algebra → 5 Emelt → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getHalmazPracticeQuestions = (): Question[] => [
    {
        stage: 1,
        question: `Legyen

A = {x ∈ Z | −3 ≤ x ≤ 4}.

Sorold fel A elemeit!

Add meg a halmazt, pl. {−3; −2; …}.`,
        answer: 8,
        expectedSet: ["-3","-2","-1","0","1","2","3","4"],
        type: 'multiplication',
        expression: `A = {−3; −2; −1; 0; 1; 2; 3; 4}`,
    },
    {
        stage: 1,
        question: `Legyen B a 24 pozitív osztóinak halmaza.

Sorold fel B elemeit!`,
        answer: 8,
        expectedSet: ["1","2","3","4","6","8","12","24"],
        type: 'multiplication',
        expression: `{1; 2; 3; 4; 6; 8; 12; 24}`,
    },
    {
        stage: 1,
        question: `Legyen

C = {x ∈ Z+ | x < 10, x páratlan}.

Sorold fel C elemeit!`,
        answer: 5,
        expectedSet: ["1","3","5","7","9"],
        type: 'multiplication',
        expression: `C = {1; 3; 5; 7; 9}`,
    },
    {
        stage: 1,
        question: `Írd fel egyenlőtlenséggel az [−2; 5[ intervallum elemeit!

Add meg a felső határt (nyílt)!`,
        answer: 5,
        type: 'multiplication',
        expression: `−2 ≤ x < 5`,
    },
    {
        stage: 1,
        question: `Sorold fel a

D = {x ∈ Z | |x| ≤ 4}

halmaz elemeit!`,
        answer: 9,
        expectedSet: ["-4","-3","-2","-1","0","1","2","3","4"],
        type: 'multiplication',
        expression: `{−4; −3; −2; −1; 0; 1; 2; 3; 4}`,
    },
    {
        stage: 1,
        question: `A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.

Határozd meg A ∪ B-t!`,
        answer: 6,
        expectedSet: ["1","2","3","4","5","6"],
        type: 'multiplication',
        expression: `{1; 2; 3; 4; 5; 6}`,
    },
    {
        stage: 1,
        question: `A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.

Határozd meg A ∩ B-t!`,
        answer: 2,
        expectedSet: ["3","4"],
        type: 'multiplication',
        expression: `{3; 4}`,
    },
    {
        stage: 1,
        question: `A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.

Határozd meg A \\ B-t!`,
        answer: 2,
        expectedSet: ["1","2"],
        type: 'multiplication',
        expression: `{1; 2}`,
    },
    {
        stage: 1,
        question: `A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.

Határozd meg B \\ A-t!`,
        answer: 2,
        expectedSet: ["5","6"],
        type: 'multiplication',
        expression: `{5; 6}`,
    },
    {
        stage: 1,
        question: `A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.

Határozd meg (A \\ B) ∪ (B \\ A)-t!`,
        answer: 4,
        expectedSet: ["1","2","5","6"],
        type: 'multiplication',
        expression: `{1; 2; 5; 6}`,
    },
    {
        stage: 1,
        question: `U = {1; …; 10}, A az U páros elemei.

Add meg A komplementerét U-ra nézve!`,
        answer: 5,
        expectedSet: ["1","3","5","7","9"],
        type: 'multiplication',
        expression: `{1; 3; 5; 7; 9}`,
    },
    {
        stage: 1,
        question: `Döntsd el, igaz-e:

{1; 3} ⊆ {1; 2; 3; 4}.

(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `mindkét elem benne van`,
    },
    {
        stage: 1,
        question: `Döntsd el, igaz-e:

{1; 2; 3} ⊊ {1; 2; 3}.

(1 = igaz, 0 = hamis)`,
        answer: 0,
        type: 'multiplication',
        expression: `nem valódi részhalmaz (egyenlőek)`,
    },
    {
        stage: 1,
        question: `Hány eleme van az A = {a; b; c; d; e} halmaznak?`,
        answer: 5,
        type: 'multiplication',
        expression: `|A| = 5`,
    },
    {
        stage: 1,
        question: `Hány részhalmaza van egy 5 elemű halmaznak?`,
        answer: 32,
        type: 'multiplication',
        expression: `2^5 = 32`,
    },
    {
        stage: 1,
        question: `Sorold fel az A = {a; b} összes részhalmazát!`,
        answer: 4,
        expectedSet: ["∅","{a}","{b}","{a;b}"],
        type: 'multiplication',
        expression: `P(A) = {∅; {a}; {b}; {a; b}}`,
    },
    {
        stage: 1,
        question: `Egyszerűsítsd: A ∩ ∅.

Add meg a halmazt (∅ vagy {})!`,
        answer: 0,
        expectedSet: [],
        type: 'multiplication',
        expression: `A ∩ ∅ = ∅`,
    },
    {
        stage: 1,
        question: `A = {1; 2}, B = {a; b; c}.

Sorold fel az A × B Descartes-szorzat elemeit!`,
        answer: 6,
        expectedSet: ["(1,a)","(1,b)","(1,c)","(2,a)","(2,b)","(2,c)"],
        type: 'multiplication',
        expression: `{(1,a); (1,b); (1,c); (2,a); (2,b); (2,c)}`,
    },
    {
        stage: 1,
        question: `U = {1; …; 12}. A a 2-vel, B a 3-mal osztható elemek.

Add meg A ∩ B-t!`,
        answer: 2,
        expectedSet: ["6","12"],
        type: 'multiplication',
        expression: `{6; 12}`,
    },
    {
        stage: 1,
        question: `Helyezd el a lehető legszűkebb számhalmazban: −3, 5/7, √2, π, 6.

Hány közülük irracionális?`,
        answer: 2,
        type: 'multiplication',
        expression: `√2 és π ∈ R \\ Q`,
    },
    {
        stage: 2,
        question: `(x+2)/(x−4) ≤ 0 egész megoldásai A; |x−1| < 4 egész megoldásai B.

Add meg A ∪ B elemeit!`,
        answer: 7,
        expectedSet: ["-2","-1","0","1","2","3","4"],
        type: 'multiplication',
        expression: `A ∪ B = {−2; −1; 0; 1; 2; 3; 4}`,
    },
    {
        stage: 2,
        question: `H: √(12−x) ≥ 2 pozitív egész megoldásai.

Sorold fel H elemeit!`,
        answer: 8,
        expectedSet: ["1","2","3","4","5","6","7","8"],
        type: 'multiplication',
        expression: `H = {1; …; 8}`,
    },
    {
        stage: 2,
        question: `A a 36 pozitív osztói, B a 36-nál nem nagyobb pozitív 4-gyel osztható számok.

Add meg A ∩ B-t!`,
        answer: 3,
        expectedSet: ["4","12","36"],
        type: 'multiplication',
        expression: `{4; 12; 36}`,
    },
    {
        stage: 2,
        question: `U = {1; …; 30}, A a prímek, B a páratlanok U-ban.

Add meg A \\ B-t!`,
        answer: 1,
        expectedSet: ["2"],
        type: 'multiplication',
        expression: `A \\ B = {2}`,
    },
    {
        stage: 2,
        question: `Határozd meg [−4; 3] ∩ ]1; 7[ felső határát (zárt)!`,
        answer: 3,
        type: 'multiplication',
        expression: `]1; 3]`,
    },
    {
        stage: 2,
        question: `Az alaphalmaz R. Az ]−2; 5] komplementerének jobb oldali darabja ]5; +∞[.

Add meg a 5-öt (ahonnan nyíltan indul)!`,
        answer: 5,
        type: 'multiplication',
        expression: `]−∞; −2] ∪ ]5; +∞[`,
    },
    {
        stage: 2,
        question: `A = {1; 2}, B = {1; 2; 3; 4}. A legkisebb X, amelyre A ∪ X = B.

Add meg X-et!`,
        answer: 2,
        expectedSet: ["3","4"],
        type: 'multiplication',
        expression: `X = {3; 4}`,
    },
    {
        stage: 2,
        question: `U = {1; …; 8}, A = {1; 3; 5; 7}. A legnagyobb X ⊆ U, amelyre A ∩ X = ∅.

Add meg X-et!`,
        answer: 4,
        expectedSet: ["2","4","6","8"],
        type: 'multiplication',
        expression: `{2; 4; 6; 8}`,
    },
    {
        stage: 2,
        question: `40 fős csoport: 25 angol, 18 német, 10 mindkettő.

Hányan tanulnak legalább az egyik nyelven?`,
        answer: 33,
        type: 'multiplication',
        expression: `|A ∪ B| = 25+18−10 = 33; egyik sem: 7`,
    },
    {
        stage: 2,
        question: `50 fős évfolyam: 30 sport, 28 zene, 5 egyik sem.

Hányan végzik mindkettőt?`,
        answer: 13,
        type: 'multiplication',
        expression: `|A ∪ B| = 45 → |A ∩ B| = 30+28−45 = 13`,
    },
    {
        stage: 2,
        question: `|A|=30, |B|=25, |C|=20, |A∩B|=10, |A∩C|=8, |B∩C|=7, |A∩B∩C|=5, |U|=60.

Mennyi |A ∪ B ∪ C|?`,
        answer: 55,
        type: 'multiplication',
        expression: `30+25+20−10−8−7+5 = 55; kívül: 5`,
    },
    {
        stage: 2,
        question: `Hány részhalmaza van egy 8 elemű halmaznak?`,
        answer: 256,
        type: 'multiplication',
        expression: `2^8 = 256`,
    },
    {
        stage: 2,
        question: `Hány 3 elemű részhalmaza van egy 8 elemű halmaznak?`,
        answer: 56,
        type: 'multiplication',
        expression: `C(8,3) = 56`,
    },
    {
        stage: 2,
        question: `Egy 7 elemű halmaznak hány olyan részhalmaza van, amely tartalmaz egy előre kijelölt elemet?`,
        answer: 64,
        type: 'multiplication',
        expression: `2^6 = 64`,
    },
    {
        stage: 2,
        question: `Egy 7 elemű halmaznak hány olyan részhalmaza van, amely nem tartalmaz egy előre kijelölt elemet?`,
        answer: 64,
        type: 'multiplication',
        expression: `2^6 = 64`,
    },
    {
        stage: 2,
        question: `Egy 9 elemű halmaznak hány olyan 4 elemű részhalmaza van, amely két előre kijelölt elemet biztosan tartalmaz?`,
        answer: 21,
        type: 'multiplication',
        expression: `C(7,2) = 21`,
    },
    {
        stage: 2,
        question: `Egy 8 elemű halmazból 3 elemet választunk. Hány részhalmaz tartalmaz két kijelölt elem közül pontosan egyet?`,
        answer: 30,
        type: 'multiplication',
        expression: `2 · C(6,2) = 30`,
    },
    {
        stage: 2,
        question: `Ha |A| = 4 és |B| = 5, hány eleme van A × B-nek?`,
        answer: 20,
        type: 'multiplication',
        expression: `4 · 5 = 20`,
    },
    {
        stage: 2,
        question: `A = {x ∈ Z | |2x − 1| ≤ 7}.

Sorold fel A elemeit!`,
        answer: 8,
        expectedSet: ["-3","-2","-1","0","1","2","3","4"],
        type: 'multiplication',
        expression: `{−3; −2; −1; 0; 1; 2; 3; 4}`,
    },
    {
        stage: 2,
        question: `U = {1;…;6}, A = {1;2;4}, B = {2;3;5}.

Add meg (A ∪ B)^c-t U-ra nézve!`,
        answer: 1,
        expectedSet: ["6"],
        type: 'multiplication',
        expression: `{6}`,
    },
    {
        stage: 3,
        question: `Hány olyan háromjegyű pozitív egész van, amelyben legalább egy 1-es szerepel?`,
        answer: 252,
        type: 'multiplication',
        expression: `900 − 8·9·9 = 252`,
    },
    {
        stage: 3,
        question: `Hány olyan háromjegyű pozitív egész van, amelyben legalább egy 0 szerepel?`,
        answer: 171,
        type: 'multiplication',
        expression: `900 − 9^3 = 171`,
    },
    {
        stage: 3,
        question: `Hány olyan háromjegyű pozitív egész van, amelynek alakjában az 1-es és a 2-es is szerepel?`,
        answer: 52,
        type: 'multiplication',
        expression: `megoldókulcs: 52`,
    },
    {
        stage: 3,
        question: `A 0,1,2,3,4,5,6 számjegyekből hány különböző számjegyű négyjegyű szám készíthető, amelynek számjegyösszege 12?`,
        answer: 102,
        type: 'multiplication',
        expression: `megoldókulcs: 102`,
    },
    {
        stage: 3,
        question: `H = {1; …; 9}. Hány 4 elemű részhalmaza van H-nak, amelynek az 1 vagy a 2 eleme?`,
        answer: 91,
        type: 'multiplication',
        expression: `C(9,4) − C(7,4) = 126 − 35 = 91`,
    },
    {
        stage: 3,
        question: `Egy 10 elemű halmaznak hány 5 elemű részhalmaza tartalmaz két előre kijelölt elemet?`,
        answer: 56,
        type: 'multiplication',
        expression: `C(8,3) = 56`,
    },
    {
        stage: 3,
        question: `Egy 12 elemű halmazból 6 elemet választunk. Hány részhalmaz tartalmaz három kijelölt elem közül pontosan egyet?`,
        answer: 378,
        type: 'multiplication',
        expression: `3 · C(9,5) = 378`,
    },
    {
        stage: 3,
        question: `Egy n elemű halmaznak ötször annyi 3 elemű részhalmaza van, mint 2 elemű.

Add meg n-et!`,
        answer: 17,
        type: 'multiplication',
        expression: `C(n,3) = 5 C(n,2) → n = 17`,
    },
    {
        stage: 3,
        question: `Egy n elemű halmaznak hatszor annyi 4 elemű részhalmaza van, mint 2 elemű.

Add meg n-et!`,
        answer: 11,
        type: 'multiplication',
        expression: `C(n,4) = 6 C(n,2) → n = 11`,
    },
    {
        stage: 3,
        question: `Az 1,…,8 közül 3 különbözőt választunk. Mennyi annak a valószínűsége, hogy a halmaznak az 1 vagy a 2 eleme?

Add meg 3 tizedesjegyre!`,
        answer: 0.643,
        type: 'multiplication',
        expression: `36/56 = 9/14 ≈ 0,643`,
    },
    {
        stage: 3,
        question: `Két dobókocka. A: összeg prím, B: szorzat prím (36 kimenetel).

Add meg |A|-t!`,
        answer: 15,
        type: 'multiplication',
        expression: `|A| = 15, |B| = 6, |A ∩ B| = 2`,
    },
    {
        stage: 3,
        question: `Két dobókocka. A: összeg páros, B: szorzat 3-mal osztható.

Hány kimenetel van A ∩ B-ben?`,
        answer: 10,
        type: 'multiplication',
        expression: `|A ∩ B| = 10`,
    },
    {
        stage: 3,
        question: `Különleges kocka: két lap 1, egy lap 2, három lap 4. Két ilyen kockával P(összeg = 5)?

Add meg 3 tizedesjegyre!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `P = 1/3 ≈ 0,333`,
    },
    {
        stage: 3,
        question: `80 fős csoport: 45 A, 40 B, 20 mindkettő.

Hányan tartoznak pontosan az egyik halmazba?`,
        answer: 45,
        type: 'multiplication',
        expression: `csak A: 25, csak B: 20 → 45; egyik sem: 15`,
    },
    {
        stage: 3,
        question: `|U|=100, |A|=50, |B|=45, |C|=40, |A∩B|=20, |A∩C|=18, |B∩C|=15, |ABC|=8.

Mennyi |A ∪ B ∪ C|?`,
        answer: 90,
        type: 'multiplication',
        expression: `50+45+40−20−18−15+8 = 90; kívül: 10`,
    },
    {
        stage: 3,
        question: `Selejtnél |A|=32, |B|=37, |C|=41, nincs hármas metszet, csak-egy kód ugyanannyi, |A∩C|=2|A∩B|.

Hány selejtes van összesen?`,
        answer: 85,
        type: 'multiplication',
        expression: `megoldókulcs: 85`,
    },
    {
        stage: 3,
        question: `M szigorúan növekvő, K konvex, A alulról korlátos. f(x)=x, g=x², h=e^x, i=−x.

Hány függvény esik M ∩ K ∩ A-ba?`,
        answer: 1,
        type: 'multiplication',
        expression: `csak h(x) = e^x`,
    },
    {
        stage: 3,
        question: `A lehető legszűkebb számhalmazba: 3^{−2}, 3^{1/2}, 3^0.

Hány közülük irracionális?`,
        answer: 1,
        type: 'multiplication',
        expression: `√3 ∈ R \\ Q; 1/9 ∈ Q \\ Z; 1 ∈ N`,
    },
    {
        stage: 3,
        question: `Döntsd el a megfordítás logikai értékét: A ⊆ B ⇒ A ∩ B = A.

(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `A ∩ B = A ⇒ A ⊆ B igaz`,
    },
    {
        stage: 3,
        question: `A Venn-rész, amely A-ban és B-ben benne van, de C-ben nincs: (A ∩ B) \\ C.

Igaz-e ez? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `(A ∩ B) \\ C`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (A ∪ B) ∩ (A ∪ B^c).

Ha |A| = 7, mennyi az egyszerűsített halmaz elemszáma?`,
        answer: 7,
        type: 'multiplication',
        expression: `az azonosság A-t adja`,
    },
    {
        stage: 4,
        question: `Egyszerűsítsd: (A ∩ B) ∪ (A ∩ B^c).

Ha |A| = 7, mennyi az egyszerűsített halmaz elemszáma?`,
        answer: 7,
        type: 'multiplication',
        expression: `az azonosság A-t adja`,
    },
    {
        stage: 4,
        question: `Írd át De Morgan azonosságával: (A ∪ B)^c.

Igaz-e, hogy ez A^c ∩ B^c? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `(A ∪ B)^c = A^c ∩ B^c`,
    },
    {
        stage: 4,
        question: `U = {1;…;8}, A = {1;2;3;4;5}, B = {2;4}. X ∩ A = B, X ⊆ U.

Add meg a legnagyobb X-et!`,
        answer: 5,
        expectedSet: ["2","4","6","7","8"],
        type: 'multiplication',
        expression: `X_max = {2;4;6;7;8}`,
    },
    {
        stage: 4,
        question: `A = {1;2}, B = {1;2;3;4;5}. A ∪ X = B.

Add meg a legkisebb X-et!`,
        answer: 3,
        expectedSet: ["3","4","5"],
        type: 'multiplication',
        expression: `X_min = {3;4;5}`,
    },
    {
        stage: 4,
        question: `A = {1;2;3;4}, B = {3;4;5;6}.

Add meg A △ B-t!`,
        answer: 4,
        expectedSet: ["1","2","5","6"],
        type: 'multiplication',
        expression: `{1; 2; 5; 6}`,
    },
    {
        stage: 4,
        question: `Igaz-e minden A, B-re: A △ B = (A ∪ B) \\ (A ∩ B)?

(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `szimmetrikus különbség definíciója`,
    },
    {
        stage: 4,
        question: `|U|=70, |A|=42, |B|=38, |A ∪ B|=60.

Mennyi |A ∩ B|?`,
        answer: 20,
        type: 'multiplication',
        expression: `42+38−60 = 20`,
    },
    {
        stage: 4,
        question: `|U|=100, |A|=55, |B|=50, |C|=45, |A∩B|=25, |A∩C|=20, |B∩C|=18, |A∪B∪C|=90.

Mennyi |A ∩ B ∩ C|?`,
        answer: 3,
        type: 'multiplication',
        expression: `90 = 150 − 63 + x → x = 3`,
    },
    {
        stage: 4,
        question: `Az előző adatokkal hány elem tartozik pontosan egyetlen halmazba?`,
        answer: 33,
        type: 'multiplication',
        expression: `csak A:13, B:10, C:10 → 33`,
    },
    {
        stage: 4,
        question: `Az előző adatokkal hány elem tartozik pontosan két halmazba?`,
        answer: 54,
        type: 'multiplication',
        expression: `22+17+15 = 54`,
    },
    {
        stage: 4,
        question: `Az előző adatokkal hány elem nem tartozik egyik halmazba sem?`,
        answer: 10,
        type: 'multiplication',
        expression: `100 − 90 = 10`,
    },
    {
        stage: 4,
        question: `Egy n elemű halmaznak 1024 részhalmaza van.

Add meg n-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `2^n = 1024`,
    },
    {
        stage: 4,
        question: `Egy n elemű halmaznak 45 darab 2 elemű részhalmaza van.

Add meg n-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `C(n,2) = 45 → n = 10`,
    },
    {
        stage: 4,
        question: `Egy n elemű halmaznak 120 darab 3 elemű részhalmaza van.

Add meg n-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `C(n,3) = 120 → n = 10`,
    },
    {
        stage: 4,
        question: `Egy n elemű halmaznak 210 darab 4 elemű részhalmaza van.

Add meg n-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `C(n,4) = 210 → n = 10`,
    },
    {
        stage: 4,
        question: `Egy n elemű halmaznak 252 darab 5 elemű részhalmaza van.

Add meg n-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `C(n,5) = 252 → n = 10`,
    },
    {
        stage: 4,
        question: `Egy 5 elemű U-n hány rendezett (A, B) párra A ⊆ B?`,
        answer: 243,
        type: 'multiplication',
        expression: `3^5 = 243`,
    },
    {
        stage: 4,
        question: `|U|=10, |B|=4, B ⊆ U. Hány A ⊆ U-ra A ∩ B = ∅?`,
        answer: 64,
        type: 'multiplication',
        expression: `2^6 = 64`,
    },
    {
        stage: 4,
        question: `|U|=10, |B|=3, B ⊆ U. Hány A ⊆ U-ra B ⊆ A?`,
        answer: 128,
        type: 'multiplication',
        expression: `2^7 = 128`,
    },
    {
        stage: 5,
        question: `A_p = {x ∈ R | x² − (p+1)x + p = 0}.

Ha p = 1, mennyi |A_p|?`,
        answer: 1,
        type: 'multiplication',
        expression: `p = 1 → egy gyök; egyébként 2`,
    },
    {
        stage: 5,
        question: `A_p = {x ∈ R | |x − 2| ≤ p}.

Ha p = −1, mennyi |A_p|? (üres = 0)`,
        answer: 0,
        type: 'multiplication',
        expression: `p < 0 → ∅; p = 0 → {2}; p > 0 → intervallum`,
    },
    {
        stage: 5,
        question: `Mely p-kre nem üres [p; p+3] ∩ [1; 5]?

Add meg a p-intervallum alsó határát!`,
        answer: -2,
        type: 'multiplication',
        expression: `−2 ≤ p ≤ 5`,
    },
    {
        stage: 5,
        question: `Mely p-kre [p; p+2] ⊆ [0; 5]?

Add meg a p-intervallum felső határát!`,
        answer: 3,
        type: 'multiplication',
        expression: `0 ≤ p ≤ 3`,
    },
    {
        stage: 5,
        question: `Mely p-kre intervallum a [0; 2] ∪ [p; p+1]?

Add meg a p-intervallum felső határát!`,
        answer: 2,
        type: 'multiplication',
        expression: `−1 ≤ p ≤ 2`,
    },
    {
        stage: 5,
        question: `Egy n elemű halmaznak ötször annyi 3 elemű részhalmaza van, mint 2 elemű.

Add meg n-et!`,
        answer: 17,
        type: 'multiplication',
        expression: `n = 17`,
    },
    {
        stage: 5,
        question: `Egy n elemű halmaznak hatszor annyi 4 elemű részhalmaza van, mint 2 elemű.

Add meg n-et!`,
        answer: 11,
        type: 'multiplication',
        expression: `n = 11`,
    },
    {
        stage: 5,
        question: `Egy n elemű halmaznak 64 olyan részhalmaza van, amely egy rögzített 2 elemű részhalmazt tartalmaz.

Add meg n-et!`,
        answer: 8,
        type: 'multiplication',
        expression: `2^{n−2} = 64 → n = 8`,
    },
    {
        stage: 5,
        question: `10 elemű halmazból 5 elemet választunk. Hány részhalmaz tartalmaz két kijelölt elem közül legalább egyet?`,
        answer: 196,
        type: 'multiplication',
        expression: `C(10,5) − C(8,5) = 196`,
    },
    {
        stage: 5,
        question: `12 elemű halmazból 6 elemet választunk. Hány részhalmaz tartalmaz három kijelölt elem közül pontosan kettőt?`,
        answer: 378,
        type: 'multiplication',
        expression: `C(3,2) · C(9,4) = 378`,
    },
    {
        stage: 5,
        question: `Hány 8-jegyű kettes számrendszerbeli pozitív számban van legfeljebb két 0?`,
        answer: 29,
        type: 'multiplication',
        expression: `1 + C(7,1) + C(7,2) = 29`,
    },
    {
        stage: 5,
        question: `Hány különböző számjegyű négyjegyű számban szerepel az 1 és 2 közül pontosan az egyik?`,
        answer: 2436,
        type: 'multiplication',
        expression: `megoldókulcs: 2436`,
    },
    {
        stage: 5,
        question: `100 darabból 4 hibás. Visszatevés nélkül 5-öt választunk. P(nincs hibás a mintában)?

Add meg 3 tizedesjegyre!`,
        answer: 0.812,
        type: 'multiplication',
        expression: `C(96,5)/C(100,5) ≈ 0,812`,
    },
    {
        stage: 5,
        question: `Különleges kocka: 3 A, 2 B, 1 C lap. Igazságos játéknál mekkora az n − 60 összeg (Ft)?`,
        answer: 180,
        type: 'multiplication',
        expression: `n − 60 = 180`,
    },
    {
        stage: 5,
        question: `Selejtnél |T|=44, |H|=38, |E|=42, nincs hármas, csak-egy ugyanannyi, |T∩E|=2|T∩H|.

Hány selejtes van összesen?`,
        answer: 110,
        type: 'multiplication',
        expression: `megoldókulcs: 110`,
    },
    {
        stage: 5,
        question: `M szigorúan növekvő, K konvex, A alulról korlátos.

Igaz-e, hogy x² ∈ (K ∩ A) \\ M? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `például f(x) = x²`,
    },
    {
        stage: 5,
        question: `U: legalább 4 pontú egyszerű gráfok, F fák, G összefüggő gráfok.

Hány elem van F \\ G-ben?`,
        answer: 0,
        type: 'multiplication',
        expression: `F ⊆ G → F \\ G = ∅`,
    },
    {
        stage: 5,
        question: `8 épületből 6-ot ellenőriz az őr, két kijelöltet mindenképp. Hány különböző sorrendű útvonal van?`,
        answer: 10800,
        type: 'multiplication',
        expression: `C(6,4) · 6! = 10800`,
    },
    {
        stage: 5,
        question: `Döntsd el: A = B ⇒ A △ B = ∅. Az állítás és a megfordítás is igaz?

(1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `mindkettő igaz`,
    },
    {
        stage: 5,
        question: `Igaz-e: ha A, B véges, |A| = |B| és A ⊆ B, akkor A = B?

(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `véges halmazokra igaz`,
    },
    {
        stage: 6,
        question: `Bizonyítsd: (A ∪ B)^c = A^c ∩ B^c.

Igaz az azonosság? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `De Morgan`,
    },
    {
        stage: 6,
        question: `Bizonyítsd: A \\ (B ∪ C) = (A \\ B) ∩ (A \\ C).

Igaz az azonosság? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `halmazkülönbség szétosztása`,
    },
    {
        stage: 6,
        question: `Bizonyítsd: A △ B = B △ A.

Igaz? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `szimmetrikus különbség kommutatív`,
    },
    {
        stage: 6,
        question: `Bizonyítsd: ha A △ B = A △ C, akkor B = C.

Igaz? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `B = C következik`,
    },
    {
        stage: 6,
        question: `|U|=150, |A|=80, |B|=75, |C|=70, |A∩B|=35, |A∩C|=30, |B∩C|=28, 10 elem kívül.

Mennyi |A ∩ B ∩ C|?`,
        answer: 8,
        type: 'multiplication',
        expression: `|A ∪ B ∪ C| = 140 → x = 8`,
    },
    {
        stage: 6,
        question: `Írd fel |A ∪ B ∪ C| inklúzió-kizárását!

Hány kéttagú metszetet vonunk ki?`,
        answer: 3,
        type: 'multiplication',
        expression: `|A|+|B|+|C| − |A∩B| − |A∩C| − |B∩C| + |ABC|`,
    },
    {
        stage: 6,
        question: `Egy 8 elemű U-n hány rendezett (A, B) párra A ∩ B = ∅?`,
        answer: 6561,
        type: 'multiplication',
        expression: `3^8 = 6561`,
    },
    {
        stage: 6,
        question: `Egy 6 elemű U-n hány rendezett (A, B, C) hármasra A, B, C páronként diszjunkt?`,
        answer: 4096,
        type: 'multiplication',
        expression: `4^6 = 4096`,
    },
    {
        stage: 6,
        question: `Egy 7 elemű U-n hány rendezett (A, B) párra A ∪ B = U?`,
        answer: 2187,
        type: 'multiplication',
        expression: `3^7 = 2187`,
    },
    {
        stage: 6,
        question: `Egy 7 elemű U-n hány rendezett (A, B) párra A ∩ B = ∅?`,
        answer: 2187,
        type: 'multiplication',
        expression: `3^7 = 2187`,
    },
    {
        stage: 6,
        question: `Egy 7 elemű U-n hány rendezett (A, B) párra A ⊆ B?`,
        answer: 2187,
        type: 'multiplication',
        expression: `3^7 = 2187`,
    },
    {
        stage: 6,
        question: `Egy 5 elemű U-n hány rendezett (A, B, C) hármasra A ⊆ B ⊆ C?`,
        answer: 1024,
        type: 'multiplication',
        expression: `4^5 = 1024`,
    },
    {
        stage: 6,
        question: `A_p = {x ∈ Z | p ≤ x ≤ p+3}.

Ha p = 2 (egész), mennyi |A_p|?`,
        answer: 4,
        type: 'multiplication',
        expression: `p ∈ Z → 4 elem; p ∉ Z → 3 elem`,
    },
    {
        stage: 6,
        question: `H = {1; …; 12}. Hány 5 elemű részhalmaz tartalmazza {1,2} közül pontosan egyet, és {3,4} közül legalább egyet?`,
        answer: 280,
        type: 'multiplication',
        expression: `megoldókulcs: 280`,
    },
    {
        stage: 6,
        question: `H = {1; …; 12}. Hány 6 elemű részhalmaz tartalmazza {1,2,3,4} közül pontosan kettőt?`,
        answer: 420,
        type: 'multiplication',
        expression: `C(4,2) · C(8,4) = 420`,
    },
    {
        stage: 6,
        question: `|U|=120, |A|=65, |B|=60, |C|=55; csak AB=18, csak AC=15, csak BC=12, mindhárom=10.

Hányan vannak pontosan egy halmazban?`,
        answer: 60,
        type: 'multiplication',
        expression: `pontosan egy: 60; kettő: 45; kívül: 5`,
    },
    {
        stage: 6,
        question: `Igaz-e, hogy x² ∈ (K ∩ A) \\ M és e^x ∈ M ∩ K ∩ A?

(1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `x² és e^x a két Venn-részben`,
    },
    {
        stage: 6,
        question: `F ⊆ G a fák és az összefüggő gráfok között.

Hány elem van F \\ G-ben?`,
        answer: 0,
        type: 'multiplication',
        expression: `F \\ G = ∅`,
    },
    {
        stage: 6,
        question: `Ha P(A) = P(B) (hatványhalmaz), akkor A = B.

Igaz? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `A = B`,
    },
    {
        stage: 6,
        question: `Selejtnél csak T = csak H = csak E, mindhárom = 4, |T| = 40, összesen 91.

Mennyi a csak-egy kód elemszáma (egyik kategória)?`,
        answer: 20,
        type: 'multiplication',
        expression: `csak T = csak H = csak E = 20; TH=7; TE=9; HE=11`,
    },
];
