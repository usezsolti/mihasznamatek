import type { Question } from './types';
import { cn, gridGraph, kn, knm, kparts, labeled, pathGraph } from './graphFigure';

/**
 * Logika, gráfok — 6 szint × 20 feladat (Gráfok_és_logika.pdf).
 * 1 Alapok → 2 Összefüggőség/fák → 3 Fokszámsorozatok →
 * 4 Euler/páros/színezés → 5 Összetett → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getGrafokPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Adott V = {A, B, C, D, E, F} és
E = {AB, AC, BC, BD, CE, DF, EF}.

Hány éle van a gráfnak?`,
        answer: 7,
        type: 'multiplication',
        graph: labeled('ABCDEF', ['AB', 'AC', 'BC', 'BD', 'CE', 'DF', 'EF']),
        expression: `6 csúcs, 7 él`,
    },
    {
        stage: 1,
        question: `Adott V = {A, B, C, D, E}, E = {AB, AC, AD, BC, CE, DE}.
Határozd meg A fokszámát!`,
        answer: 3,
        type: 'multiplication',
        graph: { ...labeled('ABCDE', ['AB', 'AC', 'AD', 'BC', 'CE', 'DE']), highlightVertices: ['A'] },
        expression: `d(A) = 3, d(B) = 2, d(C) = 3, d(D) = 2, d(E) = 2`,
    },
    {
        stage: 1,
        question: `Egy egyszerű gráf csúcsainak fokszámösszege 26.
Hány éle van a gráfnak?`,
        answer: 13,
        type: 'multiplication',
        expression: `|E| = 26/2 = 13`,
    },
    {
        stage: 1,
        question: `Hány éle van a K₆ teljes gráfnak?`,
        answer: 15,
        type: 'multiplication',
        graph: kn(6),
        expression: `C(6, 2) = 15`,
    },
    {
        stage: 1,
        question: `Legfeljebb hány éle lehet egy 8 csúcsú egyszerű gráfnak?`,
        answer: 28,
        type: 'multiplication',
        expression: `C(8, 2) = 28`,
    },
    {
        stage: 1,
        question: `Egy 6 csúcsú gráf minden csúcsa harmadfokú.
Hány éle van a gráfnak?`,
        answer: 9,
        type: 'multiplication',
        expression: `6 · 3 / 2 = 9`,
    },
    {
        stage: 1,
        question: `Létezhet-e olyan 5 csúcsú egyszerű gráf, amelynek minden csúcsa harmadfokú?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Fokszámösszeg 15 páratlan → nem`,
    },
    {
        stage: 1,
        question: `Egy 7 csúcsú egyszerű gráfnak 8 éle van.
Hány éle van a komplementer gráfjának?`,
        answer: 13,
        type: 'multiplication',
        expression: `C(7, 2) − 8 = 21 − 8 = 13`,
    },
    {
        stage: 1,
        question: `Adott V = {A, B, C, D, E, F}, E = {AB, AC, CD, DE}.
Hány izolált csúcsa van a gráfnak?`,
        answer: 1,
        type: 'multiplication',
        graph: { ...labeled('ABCDEF', ['AB', 'AC', 'CD', 'DE']), highlightVertices: ['F'] },
        expression: `Elsőfokú: B, E; izolált: F`,
    },
    {
        stage: 1,
        question: `Az A − B − C − D − E út hány élből áll?`,
        answer: 4,
        type: 'multiplication',
        graph: pathGraph(['A', 'B', 'C', 'D', 'E']),
        expression: `5 csúcs → 4 él`,
    },
    {
        stage: 1,
        question: `Hány éle van a C₇ körgráfnak?`,
        answer: 7,
        type: 'multiplication',
        graph: cn(7),
        expression: `7 él, minden fokszám 2`,
    },
    {
        stage: 1,
        question: `Mekkora a K₄ teljes gráf fokszámainak összege?`,
        answer: 12,
        type: 'multiplication',
        graph: kn(4),
        expression: `Minden fokszám 3, összeg 12`,
    },
    {
        stage: 1,
        question: `Egy gráfnak 9 éle van.
Mennyi a csúcsok fokszámának összege?`,
        answer: 18,
        type: 'multiplication',
        expression: `2 · 9 = 18`,
    },
    {
        stage: 1,
        question: `Egy 5 csúcsú gráf fokszámai 1, 2, 2, 3, 4.
Hány éle van a gráfnak?`,
        answer: 6,
        type: 'multiplication',
        expression: `(1+2+2+3+4)/2 = 6`,
    },
    {
        stage: 1,
        question: `Lehet-e egyszerű gráf olyan gráf, amelyben egy csúcsból önmagába vezet él?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Hurokél tilos egyszerű gráfban`,
    },
    {
        stage: 1,
        question: `Egy 8 csúcsú egyszerű gráfban egy v csúcs fokszáma 5.
Mennyi v fokszáma a komplementer gráfban?`,
        answer: 2,
        type: 'multiplication',
        expression: `8 − 1 − 5 = 2`,
    },
    {
        stage: 1,
        question: `Mekkora lehet legfeljebb egy csúcs fokszáma egy 10 csúcsú egyszerű gráfban?`,
        answer: 9,
        type: 'multiplication',
        expression: `n − 1 = 9`,
    },
    {
        stage: 1,
        question: `A K₃,₄ teljes páros gráfban hány él van?`,
        answer: 12,
        type: 'multiplication',
        graph: knm(3, 4),
        expression: `3 · 4 = 12 (7 csúcs)`,
    },
    {
        stage: 1,
        question: `Adj meg egy 4 csúcsú egyszerű gráfot, amelynek fokszámsorozata 3, 2, 2, 1.

Hány éle van ennek a gráfnak?`,
        answer: 4,
        type: 'multiplication',
        expression: `Például E = {AB, AC, AD, BC}; |E| = 4`,
    },
    {
        stage: 1,
        question: `Egy 8 fős társaságban összesen 20 kölcsönös ismeretség van.
Mennyi az átlagos fokszám?`,
        answer: 5,
        type: 'multiplication',
        expression: `Fokszámösszeg 40, átlag 5`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Adott V = {A, B, C, D, E, F}, E = {AB, BC, CA, DE}.
Hány összefüggő komponense van a gráfnak?`,
        answer: 3,
        type: 'multiplication',
        graph: labeled('ABCDEF', ['AB', 'BC', 'CA', 'DE']),
        expression: `{A,B,C}, {D,E}, {F} → 3`,
    },
    {
        stage: 2,
        question: `Adott V = {A, B, C, D, E, F}, E = {AB, BC, CA, DE, EF}.
Hány komponense van a gráfnak?`,
        answer: 2,
        type: 'multiplication',
        graph: labeled('ABCDEF', ['AB', 'BC', 'CA', 'DE', 'EF']),
        expression: `Nem összefüggő; 2 komponens`,
    },
    {
        stage: 2,
        question: `Hány éle van egy 9 csúcsú fagráfnak?`,
        answer: 8,
        type: 'multiplication',
        expression: `n − 1 = 8`,
    },
    {
        stage: 2,
        question: `Hány éle van egy 12 csúcsú fagráfnak?`,
        answer: 11,
        type: 'multiplication',
        expression: `n − 1 = 11`,
    },
    {
        stage: 2,
        question: `Egy összefüggő egyszerű gráfnak 8 csúcsa és 7 éle van.
Biztosan fagráf-e?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Összefüggő + n−1 él → fa`,
    },
    {
        stage: 2,
        question: `Egy 7 csúcsú egyszerű gráfnak 6 éle van, és tartalmaz kört.
Lehet-e összefüggő?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Összefüggő + kör → legalább 7 él`,
    },
    {
        stage: 2,
        question: `Egy erdőnek 10 csúcsa és 3 komponense van.
Hány éle van?`,
        answer: 7,
        type: 'multiplication',
        expression: `n − k = 10 − 3 = 7`,
    },
    {
        stage: 2,
        question: `Egy erdőnek 12 csúcsa és 8 éle van.
Hány komponense van?`,
        answer: 4,
        type: 'multiplication',
        expression: `k = n − |E| = 4`,
    },
    {
        stage: 2,
        question: `Egy fában három csúcs fokszáma 3, két csúcs fokszáma 2, minden további csúcs fokszáma 1.
Hány elsőfokú csúcsa van a fának?`,
        answer: 5,
        type: 'multiplication',
        expression: `5 levél, összesen 10 csúcs`,
    },
    {
        stage: 2,
        question: `Egy fában öt csúcs fokszáma 3, négy csúcs fokszáma 2, minden további csúcs fokszáma 1.
Hány levele van a fának?`,
        answer: 7,
        type: 'multiplication',
        expression: `7 levél, összesen 16 csúcs`,
    },
    {
        stage: 2,
        question: `Összefüggő-e a C₈ körgráf?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        graph: cn(8),
        expression: `Igen; minden fokszám 2`,
    },
    {
        stage: 2,
        question: `Páros gráf-e a C₇ körgráf?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        graph: cn(7),
        expression: `Páratlan kör → nem páros`,
    },
    {
        stage: 2,
        question: `Páros gráf-e a C₈ körgráf?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        graph: cn(8),
        expression: `Páros kör → páros gráf`,
    },
    {
        stage: 2,
        question: `Páros gráf-e a K₃ teljes gráf?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        graph: kn(3),
        expression: `Háromszög → nem páros`,
    },
    {
        stage: 2,
        question: `A K₄,₅ teljes páros gráfnak hány éle van?`,
        answer: 20,
        type: 'multiplication',
        graph: knm(4, 5),
        expression: `4 · 5 = 20 (9 csúcs)`,
    },
    {
        stage: 2,
        question: `Mi a K₆ teljes gráf komplementere?
Hány éle van?`,
        answer: 0,
        type: 'multiplication',
        expression: `6 izolált csúcs, 0 él`,
    },
    {
        stage: 2,
        question: `Mi egy 6 csúcsú él nélküli gráf komplementere?
Hány éle van?`,
        answer: 15,
        type: 'multiplication',
        expression: `K₆; 15 él`,
    },
    {
        stage: 2,
        question: `Adott V = {A, B, C, D, E, F, G}, E = {AB, BC, CD, EF}.
Hány komponense van a gráfnak?`,
        answer: 3,
        type: 'multiplication',
        graph: labeled('ABCDEFG', ['AB', 'BC', 'CD', 'EF']),
        expression: `{A,B,C,D}, {E,F}, {G} → 3`,
    },
    {
        stage: 2,
        question: `Milyen gráfot nevezünk fának?
Hány kört tartalmaz egy fa?`,
        answer: 0,
        type: 'multiplication',
        expression: `Összefüggő, kört nem tartalmazó gráf`,
    },
    {
        stage: 2,
        question: `Egy erdőnek 20 csúcsa és 5 komponense van.
Hány éle van?`,
        answer: 15,
        type: 'multiplication',
        expression: `20 − 5 = 15`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Döntsd el, lehet-e egyszerű gráf fokszámsorozata 3, 3, 2, 2, 2, 2.

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igen (grafikus)`,
    },
    {
        stage: 3,
        question: `Döntsd el, lehet-e egyszerű gráf fokszámsorozata 4, 4, 4, 1, 1.

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem grafikus`,
    },
    {
        stage: 3,
        question: `Döntsd el, lehet-e egyszerű gráf fokszámsorozata 4, 3, 3, 2, 2.

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igen (grafikus)`,
    },
    {
        stage: 3,
        question: `Létezhet-e olyan 6 csúcsú egyszerű gráf, amelynek minden csúcsa páratlan fokszámú?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igen, például K₃,₃`,
    },
    {
        stage: 3,
        question: `Létezhet-e egyszerű gráf, amelyben pontosan egy páratlan fokszámú csúcs van?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Páratlan fokúak száma páros`,
    },
    {
        stage: 3,
        question: `Létezhet-e egyszerű gráf, amelyben pontosan három páratlan fokszámú csúcs van?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Páratlan fokúak száma páros`,
    },
    {
        stage: 3,
        question: `Létezhet-e 7 csúcsú 4-reguláris egyszerű gráf?
Ha igen, hány éle van?`,
        answer: 14,
        type: 'multiplication',
        expression: `Igen; 7 · 4 / 2 = 14`,
    },
    {
        stage: 3,
        question: `Egy n csúcsú r-reguláris egyszerű gráfban hány él van, ha n = 6 és r = 3?`,
        answer: 9,
        type: 'multiplication',
        expression: `|E| = nr/2; nr páros kell legyen`,
    },
    {
        stage: 3,
        question: `Egy 8 csúcsú egyszerű gráf fokszámai 5, 3, 3, 3, 2, 2, 2, 2.
Hány éle van?`,
        answer: 11,
        type: 'multiplication',
        expression: `22/2 = 11; létezik ilyen gráf`,
    },
    {
        stage: 3,
        question: `Létezhet-e olyan 6 csúcsú egyszerű gráf, amelynek fokszámsorozata 5, 5, 2, 2, 2, 2?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igen`,
    },
    {
        stage: 3,
        question: `Egy 8 csúcsú egyszerű gráf fokszámai 1, 2, 2, 3, 4, 4, 5, 5.
Add meg a komplementer legnagyobb fokszámát!`,
        answer: 6,
        type: 'multiplication',
        expression: `Komplementer: 6, 5, 5, 4, 3, 3, 2, 2`,
    },
    {
        stage: 3,
        question: `Hány csúcsa van annak a teljes gráfnak, amelynek 45 éle van?`,
        answer: 10,
        type: 'multiplication',
        expression: `n(n−1)/2 = 45 → n = 10`,
    },
    {
        stage: 3,
        question: `Egy teljes páros gráfnak 11 csúcsa és 30 éle van.
Add meg a nagyobb osztály elemszámát!`,
        answer: 6,
        type: 'multiplication',
        expression: `5 és 6`,
    },
    {
        stage: 3,
        question: `Egy 9 csúcsú egyszerű gráfnak ugyanannyi éle van, mint a komplementerének.
Hány éle van?`,
        answer: 18,
        type: 'multiplication',
        expression: `C(9, 2)/2 = 18`,
    },
    {
        stage: 3,
        question: `Ha egy 8 csúcsú egyszerű gráf izomorf a komplementerével, akkor hány éle van?`,
        answer: 14,
        type: 'multiplication',
        expression: `C(8, 2)/2 = 14`,
    },
    {
        stage: 3,
        question: `Hány különböző egyszerű, címkézett gráf adható meg 5 rögzített csúcson?`,
        answer: 1024,
        type: 'multiplication',
        expression: `2¹⁰ = 1024`,
    },
    {
        stage: 3,
        question: `Hány feszítő részgráfja van a K₄ teljes gráfnak, ha bármely él vagy szerepel, vagy nem?`,
        answer: 64,
        type: 'multiplication',
        expression: `2⁶ = 64`,
    },
    {
        stage: 3,
        question: `Hány 5 csúcsú, címkézett egyszerű gráf van pontosan 4 éllel?`,
        answer: 210,
        type: 'multiplication',
        expression: `C(10, 4) = 210`,
    },
    {
        stage: 3,
        question: `Hány háromszög található a K₆ teljes gráfban?`,
        answer: 20,
        type: 'multiplication',
        expression: `C(6, 3) = 20`,
    },
    {
        stage: 3,
        question: `Hány különböző négypontú kör található a K₆ teljes gráfban?`,
        answer: 45,
        type: 'multiplication',
        expression: `3 · C(6, 4) = 45`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Egy összefüggő gráf minden csúcsának fokszáma 2.
Van-e Euler-köre?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Minden fok páros → Euler-kör`,
    },
    {
        stage: 4,
        question: `Egy összefüggő gráfban pontosan két páratlan fokszámú csúcs van.
Van-e Euler-köre?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Euler-út van, Euler-kör nincs`,
    },
    {
        stage: 4,
        question: `Egy összefüggő gráf fokszámsorozata 3, 3, 2, 2, 2, 2.
Van-e Euler-útja?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        expression: `Pontosan két páratlan fok → Euler-út`,
    },
    {
        stage: 4,
        question: `Van-e Euler-útja a K₄ teljes gráfnak?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        graph: kn(4),
        expression: `4 páratlan fokú csúcs → nincs`,
    },
    {
        stage: 4,
        question: `Van-e Euler-köre a K₅ teljes gráfnak?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        graph: kn(5),
        expression: `Minden fok 4 (páros)`,
    },
    {
        stage: 4,
        question: `Van-e Euler-útja a K₃,₄ teljes páros gráfnak?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        graph: knm(3, 4),
        expression: `7 páratlan fokú csúcs → nincs`,
    },
    {
        stage: 4,
        question: `Van-e Euler-köre a K₂,₄ teljes páros gráfnak?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        graph: knm(2, 4),
        expression: `Fokok: 4, 4, 2, 2, 2, 2 — mind páros`,
    },
    {
        stage: 4,
        question: `Igaz-e: minden legalább kétcsúcsú fának legalább két elsőfokú csúcsa van?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `Egy fában öt csúcs fokszáma 3, négy csúcs fokszáma 2, minden más csúcs fokszáma 1.
Hány elsőfokú csúcsa van?`,
        answer: 7,
        type: 'multiplication',
        expression: `7 levél`,
    },
    {
        stage: 4,
        question: `Egy fában minden nem levél csúcs fokszáma 3, és a fának 8 levele van.
Hány éle van?`,
        answer: 13,
        type: 'multiplication',
        expression: `6 nem levél, 14 csúcs, 13 él`,
    },
    {
        stage: 4,
        question: `Igaz-e, hogy egy egyszerű gráf pontosan akkor páros, ha nem tartalmaz páratlan hosszúságú kört?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 4,
        question: `Mennyi a C₁₀ körgráf kromatikus száma?`,
        answer: 2,
        type: 'multiplication',
        graph: cn(10),
        expression: `Páros kör → χ = 2`,
    },
    {
        stage: 4,
        question: `Mennyi a K₆ teljes gráf kromatikus száma?`,
        answer: 6,
        type: 'multiplication',
        graph: kn(6),
        expression: `χ(Kₙ) = n`,
    },
    {
        stage: 4,
        question: `Mennyi a C₉ körgráf kromatikus száma?`,
        answer: 3,
        type: 'multiplication',
        graph: cn(9),
        expression: `Páratlan kör → χ = 3`,
    },
    {
        stage: 4,
        question: `Mennyi a C₁₂ körgráf kromatikus száma?`,
        answer: 2,
        type: 'multiplication',
        graph: cn(12),
        expression: `Páros kör → χ = 2`,
    },
    {
        stage: 4,
        question: `Mennyi a K₃,₅ teljes páros gráf kromatikus száma?`,
        answer: 2,
        type: 'multiplication',
        graph: knm(3, 5),
        expression: `Páros gráf, van él → χ = 2`,
    },
    {
        stage: 4,
        question: `Mennyi egy legalább kétcsúcsú fa kromatikus száma?`,
        answer: 2,
        type: 'multiplication',
        expression: `Fa páros gráf`,
    },
    {
        stage: 4,
        question: `Legfeljebb hány éle lehet egy 8 csúcsú egyszerű páros gráfnak?`,
        answer: 16,
        type: 'multiplication',
        expression: `4 · 4 = 16`,
    },
    {
        stage: 4,
        question: `A K₅ teljes gráfból elhagyunk egyetlen élt.
Mennyi a kapott gráf kromatikus száma?`,
        answer: 4,
        type: 'multiplication',
        graph: { vertices: kn(5).vertices, edges: kn(5).edges.filter(([a, b]) => !(a === 'A' && b === 'B')) },
        expression: `χ = 4`,
    },
    {
        stage: 4,
        question: `Határozd meg a K₂,₃,₄ teljes háromrészes gráf éleinek számát!`,
        answer: 26,
        type: 'multiplication',
        graph: kparts([2, 3, 4]),
        expression: `χ = 3; élek: 6 + 8 + 12 = 26`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Igaz-e: ha egy 8 csúcsú egyszerű gráf minden csúcsának fokszáma legalább 3, akkor a gráf biztosan összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem; ellenpélda K₄ ∪ K₄`,
    },
    {
        stage: 5,
        question: `Igaz-e: ha egy 8 csúcsú egyszerű gráf minden csúcsának fokszáma legalább 4, akkor a gráf biztosan összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `δ ≥ n/2 → összefüggő`,
    },
    {
        stage: 5,
        question: `Igaz-e: minden 7 csúcsú, 15 élű egyszerű gráf összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem; ellenpélda K₆ + izolált csúcs (15 él)`,
    },
    {
        stage: 5,
        question: `Igaz-e: minden 7 csúcsú, 16 élű egyszerű gráf összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `C(6, 2) = 15 < 16 → összefüggő`,
    },
    {
        stage: 5,
        question: `Legfeljebb hány éle lehet egy n csúcsú nem összefüggő egyszerű gráfnak, ha n = 5?`,
        answer: 6,
        type: 'multiplication',
        expression: `C(n−1, 2) = C(4, 2) = 6`,
    },
    {
        stage: 5,
        question: `Igaz-e: ha egy n csúcsú egyszerű gráfnak több mint C(n−1, 2) éle van, akkor összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 5,
        question: `Igaz-e: ha egy egyszerű gráf nem összefüggő, akkor a komplementere összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 5,
        question: `Lehetséges-e, hogy egy 5 csúcsú fagráf komplementere is fagráf?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 0,
        type: 'multiplication',
        expression: `Fa 4 él, komplementer 6 él ≠ 4`,
    },
    {
        stage: 5,
        question: `Milyen maradékosztályba kell tartoznia n-nek modulo 4, ha létezhet n csúcsú önkomplementer egyszerű gráf?

Add meg a két lehetséges maradékot {a; b} alakban!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `n ≡ 0 vagy 1 (mod 4)`,
    },
    {
        stage: 5,
        question: `Ha egy 9 csúcsú gráf önkomplementer, hány éle van?`,
        answer: 18,
        type: 'multiplication',
        expression: `C(9, 2)/2 = 18`,
    },
    {
        stage: 5,
        question: `Egy 6 fős társaságban az emberek közül öt különböző számú emberrel fogott kezet.
Hány kézfogás történhetett összesen?

Add meg a lehetséges értékek halmazát!`,
        answer: 2,
        expectedSet: ['6', '9'],
        type: 'multiplication',
        expression: `6 vagy 9`,
    },
    {
        stage: 5,
        question: `Egy 6 csúcsú egyszerű gráf öt csúcsának fokszámai 0, 1, 2, 3, 4.
Mekkora a hatodik csúcs fokszáma?`,
        answer: 2,
        type: 'multiplication',
        expression: `Hatodik fok 2; élek száma 6`,
    },
    {
        stage: 5,
        question: `Egy 6 csúcsú egyszerű gráf öt csúcsának fokszámai 1, 2, 3, 4, 5.
Mekkora a hatodik csúcs fokszáma?`,
        answer: 3,
        type: 'multiplication',
        expression: `Hatodik fok 3; élek száma 9`,
    },
    {
        stage: 5,
        question: `Egy Kₖ és egy K₂ₖ teljes gráf éleinek száma összesen 697.
Határozd meg k-t!`,
        answer: 17,
        type: 'multiplication',
        expression: `C(k, 2) + C(2k, 2) = 697 → k = 17`,
    },
    {
        stage: 5,
        question: `Határozd meg a 3×3-as négyzetrács (9 rácspont) oldaléleiből álló gráf éleinek számát!`,
        answer: 12,
        type: 'multiplication',
        graph: gridGraph(3, 3),
        expression: `9 csúcs, 12 él, fokszámösszeg 24`,
    },
    {
        stage: 5,
        question: `Páros gráf-e a 3×3-as négyzetrács csúcsaiból és oldaléleiből álló gráf?

Add meg 1-et, ha igen, 0-t, ha nem!`,
        answer: 1,
        type: 'multiplication',
        graph: gridGraph(3, 3),
        expression: `Rácsgráf páros`,
    },
    {
        stage: 5,
        question: `Igaz-e: minden véges gráf, amelynek minden csúcsának fokszáma legalább 2, tartalmaz kört?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 5,
        question: `Igaz-e: bármely 6 ember között van három olyan, akik páronként mind ismerik egymást, vagy páronként egyikük sem ismeri a másikat?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `R(3, 3) = 6`,
    },
    {
        stage: 5,
        question: `Legyen V = {A, B, C, D, E, F} és
E = {AB, AC, BC, BD, CD, CE, DE, DF, EF, BF}.
Hány egyszerű út vezet A-ból F-be?`,
        answer: 17,
        type: 'multiplication',
        graph: {
            ...labeled('ABCDEF', ['AB', 'AC', 'BC', 'BD', 'CD', 'CE', 'DE', 'DF', 'EF', 'BF']),
            highlightVertices: ['A', 'F'],
        },
        expression: `17 egyszerű út`,
    },
    {
        stage: 5,
        question: `Egy 3×4-es rácspontú négyzetrács oldaléleiből gráfot készítünk.
Hány éle van?`,
        answer: 17,
        type: 'multiplication',
        graph: gridGraph(3, 4),
        expression: `12 csúcs, 17 él, fokszámösszeg 34`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Bizonyítsd be a kézfogás-lemmát: ∑ d(v) = 2|E|.
Ha |E| = 11, mennyi a fokszámösszeg?`,
        answer: 22,
        type: 'multiplication',
        expression: `Minden él két fokot ad`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy bármely véges gráfban a páratlan fokszámú csúcsok száma páros!
Hány páratlan fokú csúcs lehet 7-ből?`,
        answer: 0,
        type: 'multiplication',
        expression: `7 páratlan, tehát lehetetlen`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy minden n csúcsú fagráfnak pontosan n − 1 éle van!
Hány éle van egy 20 csúcsú fának?`,
        answer: 19,
        type: 'multiplication',
        expression: `|E| = n − 1`,
    },
    {
        stage: 6,
        question: `Igaz-e: ha egy n csúcsú egyszerű gráf összefüggő és n − 1 éle van, akkor fa?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e: minden legalább kétcsúcsú fának legalább két levele van?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e: egy véges egyszerű gráf akkor és csak akkor páros, ha nem tartalmaz páratlan kört?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e: ha G nem összefüggő egyszerű gráf, akkor a komplementere összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Egy n csúcsú nem összefüggő egyszerű gráf éleinek száma legfeljebb C(n−1, 2).
Ha n = 8, add meg ezt a maximumot!`,
        answer: 21,
        type: 'multiplication',
        expression: `C(7, 2) = 21`,
    },
    {
        stage: 6,
        question: `Igaz-e: ha egy n csúcsú egyszerű gráf minimális fokszáma legalább n/2, akkor összefüggő?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Igaz-e: egy 6 csúcsú teljes gráf éleinek tetszőleges piros-kék színezésében mindig van egyszínű háromszög?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Mindig van egyszínű háromszög`,
    },
    {
        stage: 6,
        question: `Önkomplementer n csúcsú egyszerű gráf csak akkor létezhet, ha n ≡ 0 vagy 1 (mod 4).
Add meg a két lehetséges maradékot {a; b} alakban!`,
        answer: 2,
        expectedSet: ['0', '1'],
        type: 'multiplication',
        expression: `n ≡ 0 vagy 1 (mod 4)`,
    },
    {
        stage: 6,
        question: `Adj meg egy 4 csúcsú önkomplementer gráfot!
Hány éle van a P₄ útgráfnak?`,
        answer: 3,
        type: 'multiplication',
        graph: pathGraph(['A', 'B', 'C', 'D']),
        expression: `Például P₄; 3 él`,
    },
    {
        stage: 6,
        question: `Igaz-e Euler tételének egyik iránya: ha egy összefüggő gráf minden csúcsának fokszáma páros, akkor van Euler-köre?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Hány különböző egyszerű út vezet két rögzített csúcs között a K₆ teljes gráfban?`,
        answer: 65,
        type: 'multiplication',
        graph: { ...kn(6), highlightVertices: ['A', 'B'] },
        expression: `1 + 4 + 12 + 24 + 24 = 65`,
    },
    {
        stage: 6,
        question: `Hány Hamilton-kör van a K₇ teljes gráfban, ha az ellenkező irányú bejárást ugyanannak tekintjük?`,
        answer: 360,
        type: 'multiplication',
        expression: `6! / 2 = 360`,
    },
    {
        stage: 6,
        question: `Hány feszítő fája van a K₆ teljes gráfnak?`,
        answer: 1296,
        type: 'multiplication',
        expression: `6⁴ = 1296`,
    },
    {
        stage: 6,
        question: `Hány különböző címkézett fa van 5 rögzített csúcson?`,
        answer: 125,
        type: 'multiplication',
        expression: `5³ = 125`,
    },
    {
        stage: 6,
        question: `Igaz-e: ha egy véges gráf minden csúcsának fokszáma legalább 2, akkor tartalmaz kört?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Konstruálj egy 6 csúcsú fát, amelynek minden csúcsa páratlan fokszámú!
Hány levele van?`,
        answer: 4,
        type: 'multiplication',
        expression: `Fokszámsorozat: 3, 3, 1, 1, 1, 1`,
    },
    {
        stage: 6,
        question: `Igaz-e: egy legalább kétcsúcsú fa komplementere pontosan akkor nem összefüggő, ha az eredeti fa csillaggráf?

Add meg 1-et, ha igaz, 0-t, ha hamis!`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
];
