/**
 * Generates utils/game/halmazLevels.ts — 6 × 20 single-answer set tasks.
 * Source: Halmazok.pdf (MIHASZNAMATEK, 6 szint).
 * Run: node scripts/gen-halmaz-levels.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function item(stage, body, answer, expression, expectedSet) {
  const lines = [
    '    {',
    `        stage: ${stage},`,
    `        question: \`${esc(body)}\`,`,
    `        answer: ${Number(answer)},`,
  ];
  if (Array.isArray(expectedSet)) {
    lines.push(`        expectedSet: ${JSON.stringify(expectedSet)},`);
  }
  lines.push(
    `        type: 'multiplication',`,
    `        expression: \`${esc(expression)}\`,`,
    '    },'
  );
  return lines.join('\n');
}

const levels = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
const add = (stage, body, answer, expression, expectedSet) => {
  levels[stage].push(item(stage, body, answer, expression, expectedSet));
};

// ===== 1. szint — Halmazelméleti alapok =====
add(1, 'Legyen\n\nA = {x ∈ Z | −3 ≤ x ≤ 4}.\n\nSorold fel A elemeit!\n\nAdd meg a halmazt, pl. {−3; −2; …}.', 8, 'A = {−3; −2; −1; 0; 1; 2; 3; 4}', ['-3','-2','-1','0','1','2','3','4']);
add(1, 'Legyen B a 24 pozitív osztóinak halmaza.\n\nSorold fel B elemeit!', 8, '{1; 2; 3; 4; 6; 8; 12; 24}', ['1','2','3','4','6','8','12','24']);
add(1, 'Legyen\n\nC = {x ∈ Z+ | x < 10, x páratlan}.\n\nSorold fel C elemeit!', 5, 'C = {1; 3; 5; 7; 9}', ['1','3','5','7','9']);
add(1, 'Írd fel egyenlőtlenséggel az [−2; 5[ intervallum elemeit!\n\nAdd meg a felső határt (nyílt)!', 5, '−2 ≤ x < 5');
add(1, 'Sorold fel a\n\nD = {x ∈ Z | |x| ≤ 4}\n\nhalmaz elemeit!', 9, '{−4; −3; −2; −1; 0; 1; 2; 3; 4}', ['-4','-3','-2','-1','0','1','2','3','4']);
add(1, 'A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.\n\nHatározd meg A ∪ B-t!', 6, '{1; 2; 3; 4; 5; 6}', ['1','2','3','4','5','6']);
add(1, 'A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.\n\nHatározd meg A ∩ B-t!', 2, '{3; 4}', ['3','4']);
add(1, 'A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.\n\nHatározd meg A \\ B-t!', 2, '{1; 2}', ['1','2']);
add(1, 'A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.\n\nHatározd meg B \\ A-t!', 2, '{5; 6}', ['5','6']);
add(1, 'A = {1; 2; 3; 4}, B = {3; 4; 5; 6}.\n\nHatározd meg (A \\ B) ∪ (B \\ A)-t!', 4, '{1; 2; 5; 6}', ['1','2','5','6']);
add(1, 'U = {1; …; 10}, A az U páros elemei.\n\nAdd meg A komplementerét U-ra nézve!', 5, '{1; 3; 5; 7; 9}', ['1','3','5','7','9']);
add(1, 'Döntsd el, igaz-e:\n\n{1; 3} ⊆ {1; 2; 3; 4}.\n\n(1 = igaz, 0 = hamis)', 1, 'mindkét elem benne van');
add(1, 'Döntsd el, igaz-e:\n\n{1; 2; 3} ⊊ {1; 2; 3}.\n\n(1 = igaz, 0 = hamis)', 0, 'nem valódi részhalmaz (egyenlőek)');
add(1, 'Hány eleme van az A = {a; b; c; d; e} halmaznak?', 5, '|A| = 5');
add(1, 'Hány részhalmaza van egy 5 elemű halmaznak?', 32, '2^5 = 32');
add(1, 'Sorold fel az A = {a; b} összes részhalmazát!', 4, 'P(A) = {∅; {a}; {b}; {a; b}}', ['∅','{a}','{b}','{a;b}']);
add(1, 'Egyszerűsítsd: A ∩ ∅.\n\nAdd meg a halmazt (∅ vagy {})!', 0, 'A ∩ ∅ = ∅', []);
add(1, 'A = {1; 2}, B = {a; b; c}.\n\nSorold fel az A × B Descartes-szorzat elemeit!', 6, '{(1,a); (1,b); (1,c); (2,a); (2,b); (2,c)}', ['(1,a)','(1,b)','(1,c)','(2,a)','(2,b)','(2,c)']);
add(1, 'U = {1; …; 12}. A a 2-vel, B a 3-mal osztható elemek.\n\nAdd meg A ∩ B-t!', 2, '{6; 12}', ['6','12']);
add(1, 'Helyezd el a lehető legszűkebb számhalmazban: −3, 5/7, √2, π, 6.\n\nHány közülük irracionális?', 2, '√2 és π ∈ R \\ Q');

// ===== 2. szint — Halmazműveletek és elemszámok =====
add(2, '(x+2)/(x−4) ≤ 0 egész megoldásai A; |x−1| < 4 egész megoldásai B.\n\nAdd meg A ∪ B elemeit!', 7, 'A ∪ B = {−2; −1; 0; 1; 2; 3; 4}', ['-2','-1','0','1','2','3','4']);
add(2, 'H: √(12−x) ≥ 2 pozitív egész megoldásai.\n\nSorold fel H elemeit!', 8, 'H = {1; …; 8}', ['1','2','3','4','5','6','7','8']);
add(2, 'A a 36 pozitív osztói, B a 36-nál nem nagyobb pozitív 4-gyel osztható számok.\n\nAdd meg A ∩ B-t!', 3, '{4; 12; 36}', ['4','12','36']);
add(2, 'U = {1; …; 30}, A a prímek, B a páratlanok U-ban.\n\nAdd meg A \\ B-t!', 1, 'A \\ B = {2}', ['2']);
add(2, 'Határozd meg [−4; 3] ∩ ]1; 7[ felső határát (zárt)!', 3, ']1; 3]');
add(2, 'Az alaphalmaz R. Az ]−2; 5] komplementerének jobb oldali darabja ]5; +∞[.\n\nAdd meg a 5-öt (ahonnan nyíltan indul)!', 5, ']−∞; −2] ∪ ]5; +∞[');
add(2, 'A = {1; 2}, B = {1; 2; 3; 4}. A legkisebb X, amelyre A ∪ X = B.\n\nAdd meg X-et!', 2, 'X = {3; 4}', ['3','4']);
add(2, 'U = {1; …; 8}, A = {1; 3; 5; 7}. A legnagyobb X ⊆ U, amelyre A ∩ X = ∅.\n\nAdd meg X-et!', 4, '{2; 4; 6; 8}', ['2','4','6','8']);
add(2, '40 fős csoport: 25 angol, 18 német, 10 mindkettő.\n\nHányan tanulnak legalább az egyik nyelven?', 33, '|A ∪ B| = 25+18−10 = 33; egyik sem: 7');
add(2, '50 fős évfolyam: 30 sport, 28 zene, 5 egyik sem.\n\nHányan végzik mindkettőt?', 13, '|A ∪ B| = 45 → |A ∩ B| = 30+28−45 = 13');
add(2, '|A|=30, |B|=25, |C|=20, |A∩B|=10, |A∩C|=8, |B∩C|=7, |A∩B∩C|=5, |U|=60.\n\nMennyi |A ∪ B ∪ C|?', 55, '30+25+20−10−8−7+5 = 55; kívül: 5');
add(2, 'Hány részhalmaza van egy 8 elemű halmaznak?', 256, '2^8 = 256');
add(2, 'Hány 3 elemű részhalmaza van egy 8 elemű halmaznak?', 56, 'C(8,3) = 56');
add(2, 'Egy 7 elemű halmaznak hány olyan részhalmaza van, amely tartalmaz egy előre kijelölt elemet?', 64, '2^6 = 64');
add(2, 'Egy 7 elemű halmaznak hány olyan részhalmaza van, amely nem tartalmaz egy előre kijelölt elemet?', 64, '2^6 = 64');
add(2, 'Egy 9 elemű halmaznak hány olyan 4 elemű részhalmaza van, amely két előre kijelölt elemet biztosan tartalmaz?', 21, 'C(7,2) = 21');
add(2, 'Egy 8 elemű halmazból 3 elemet választunk. Hány részhalmaz tartalmaz két kijelölt elem közül pontosan egyet?', 30, '2 · C(6,2) = 30');
add(2, 'Ha |A| = 4 és |B| = 5, hány eleme van A × B-nek?', 20, '4 · 5 = 20');
add(2, 'A = {x ∈ Z | |2x − 1| ≤ 7}.\n\nSorold fel A elemeit!', 8, '{−3; −2; −1; 0; 1; 2; 3; 4}', ['-3','-2','-1','0','1','2','3','4']);
add(2, 'U = {1;…;6}, A = {1;2;4}, B = {2;3;5}.\n\nAdd meg (A ∪ B)^c-t U-ra nézve!', 1, '{6}', ['6']);

// ===== 3. szint — Kombinatorika és valószínűség =====
add(3, 'Hány olyan háromjegyű pozitív egész van, amelyben legalább egy 1-es szerepel?', 252, '900 − 8·9·9 = 252');
add(3, 'Hány olyan háromjegyű pozitív egész van, amelyben legalább egy 0 szerepel?', 171, '900 − 9^3 = 171');
add(3, 'Hány olyan háromjegyű pozitív egész van, amelynek alakjában az 1-es és a 2-es is szerepel?', 52, 'megoldókulcs: 52');
add(3, 'A 0,1,2,3,4,5,6 számjegyekből hány különböző számjegyű négyjegyű szám készíthető, amelynek számjegyösszege 12?', 102, 'megoldókulcs: 102');
add(3, 'H = {1; …; 9}. Hány 4 elemű részhalmaza van H-nak, amelynek az 1 vagy a 2 eleme?', 91, 'C(9,4) − C(7,4) = 126 − 35 = 91');
add(3, 'Egy 10 elemű halmaznak hány 5 elemű részhalmaza tartalmaz két előre kijelölt elemet?', 56, 'C(8,3) = 56');
add(3, 'Egy 12 elemű halmazból 6 elemet választunk. Hány részhalmaz tartalmaz három kijelölt elem közül pontosan egyet?', 378, '3 · C(9,5) = 378');
add(3, 'Egy n elemű halmaznak ötször annyi 3 elemű részhalmaza van, mint 2 elemű.\n\nAdd meg n-et!', 17, 'C(n,3) = 5 C(n,2) → n = 17');
add(3, 'Egy n elemű halmaznak hatszor annyi 4 elemű részhalmaza van, mint 2 elemű.\n\nAdd meg n-et!', 11, 'C(n,4) = 6 C(n,2) → n = 11');
add(3, 'Az 1,…,8 közül 3 különbözőt választunk. Mennyi annak a valószínűsége, hogy a halmaznak az 1 vagy a 2 eleme?\n\nAdd meg 3 tizedesjegyre!', 0.643, '36/56 = 9/14 ≈ 0,643');
add(3, 'Két dobókocka. A: összeg prím, B: szorzat prím (36 kimenetel).\n\nAdd meg |A|-t!', 15, '|A| = 15, |B| = 6, |A ∩ B| = 2');
add(3, 'Két dobókocka. A: összeg páros, B: szorzat 3-mal osztható.\n\nHány kimenetel van A ∩ B-ben?', 10, '|A ∩ B| = 10');
add(3, 'Különleges kocka: két lap 1, egy lap 2, három lap 4. Két ilyen kockával P(összeg = 5)?\n\nAdd meg 3 tizedesjegyre!', 0.333, 'P = 1/3 ≈ 0,333');
add(3, '80 fős csoport: 45 A, 40 B, 20 mindkettő.\n\nHányan tartoznak pontosan az egyik halmazba?', 45, 'csak A: 25, csak B: 20 → 45; egyik sem: 15');
add(3, '|U|=100, |A|=50, |B|=45, |C|=40, |A∩B|=20, |A∩C|=18, |B∩C|=15, |ABC|=8.\n\nMennyi |A ∪ B ∪ C|?', 90, '50+45+40−20−18−15+8 = 90; kívül: 10');
add(3, 'Selejtnél |A|=32, |B|=37, |C|=41, nincs hármas metszet, csak-egy kód ugyanannyi, |A∩C|=2|A∩B|.\n\nHány selejtes van összesen?', 85, 'megoldókulcs: 85');
add(3, 'M szigorúan növekvő, K konvex, A alulról korlátos. f(x)=x, g=x², h=e^x, i=−x.\n\nHány függvény esik M ∩ K ∩ A-ba?', 1, 'csak h(x) = e^x');
add(3, 'A lehető legszűkebb számhalmazba: 3^{−2}, 3^{1/2}, 3^0.\n\nHány közülük irracionális?', 1, '√3 ∈ R \\ Q; 1/9 ∈ Q \\ Z; 1 ∈ N');
add(3, 'Döntsd el a megfordítás logikai értékét: A ⊆ B ⇒ A ∩ B = A.\n\n(1 = igaz, 0 = hamis)', 1, 'A ∩ B = A ⇒ A ⊆ B igaz');
add(3, 'A Venn-rész, amely A-ban és B-ben benne van, de C-ben nincs: (A ∩ B) \\ C.\n\nIgaz-e ez? (1 = igen, 0 = nem)', 1, '(A ∩ B) \\ C');

// ===== 4. szint — Halmazalgebra és elemszám =====
add(4, 'Egyszerűsítsd: (A ∪ B) ∩ (A ∪ B^c).\n\nHa |A| = 7, mennyi az egyszerűsített halmaz elemszáma?', 7, 'az azonosság A-t adja');
add(4, 'Egyszerűsítsd: (A ∩ B) ∪ (A ∩ B^c).\n\nHa |A| = 7, mennyi az egyszerűsített halmaz elemszáma?', 7, 'az azonosság A-t adja');
add(4, 'Írd át De Morgan azonosságával: (A ∪ B)^c.\n\nIgaz-e, hogy ez A^c ∩ B^c? (1 = igen, 0 = nem)', 1, '(A ∪ B)^c = A^c ∩ B^c');
add(4, 'U = {1;…;8}, A = {1;2;3;4;5}, B = {2;4}. X ∩ A = B, X ⊆ U.\n\nAdd meg a legnagyobb X-et!', 5, 'X_max = {2;4;6;7;8}', ['2','4','6','7','8']);
add(4, 'A = {1;2}, B = {1;2;3;4;5}. A ∪ X = B.\n\nAdd meg a legkisebb X-et!', 3, 'X_min = {3;4;5}', ['3','4','5']);
add(4, 'A = {1;2;3;4}, B = {3;4;5;6}.\n\nAdd meg A △ B-t!', 4, '{1; 2; 5; 6}', ['1','2','5','6']);
add(4, 'Igaz-e minden A, B-re: A △ B = (A ∪ B) \\ (A ∩ B)?\n\n(1 = igaz, 0 = hamis)', 1, 'szimmetrikus különbség definíciója');
add(4, '|U|=70, |A|=42, |B|=38, |A ∪ B|=60.\n\nMennyi |A ∩ B|?', 20, '42+38−60 = 20');
add(4, '|U|=100, |A|=55, |B|=50, |C|=45, |A∩B|=25, |A∩C|=20, |B∩C|=18, |A∪B∪C|=90.\n\nMennyi |A ∩ B ∩ C|?', 3, '90 = 150 − 63 + x → x = 3');
add(4, 'Az előző adatokkal hány elem tartozik pontosan egyetlen halmazba?', 33, 'csak A:13, B:10, C:10 → 33');
add(4, 'Az előző adatokkal hány elem tartozik pontosan két halmazba?', 54, '22+17+15 = 54');
add(4, 'Az előző adatokkal hány elem nem tartozik egyik halmazba sem?', 10, '100 − 90 = 10');
add(4, 'Egy n elemű halmaznak 1024 részhalmaza van.\n\nAdd meg n-et!', 10, '2^n = 1024');
add(4, 'Egy n elemű halmaznak 45 darab 2 elemű részhalmaza van.\n\nAdd meg n-et!', 10, 'C(n,2) = 45 → n = 10');
add(4, 'Egy n elemű halmaznak 120 darab 3 elemű részhalmaza van.\n\nAdd meg n-et!', 10, 'C(n,3) = 120 → n = 10');
add(4, 'Egy n elemű halmaznak 210 darab 4 elemű részhalmaza van.\n\nAdd meg n-et!', 10, 'C(n,4) = 210 → n = 10');
add(4, 'Egy n elemű halmaznak 252 darab 5 elemű részhalmaza van.\n\nAdd meg n-et!', 10, 'C(n,5) = 252 → n = 10');
add(4, 'Egy 5 elemű U-n hány rendezett (A, B) párra A ⊆ B?', 243, '3^5 = 243');
add(4, '|U|=10, |B|=4, B ⊆ U. Hány A ⊆ U-ra A ∩ B = ∅?', 64, '2^6 = 64');
add(4, '|U|=10, |B|=3, B ⊆ U. Hány A ⊆ U-ra B ⊆ A?', 128, '2^7 = 128');

// ===== 5. szint — Emelt =====
add(5, 'A_p = {x ∈ R | x² − (p+1)x + p = 0}.\n\nHa p = 1, mennyi |A_p|?', 1, 'p = 1 → egy gyök; egyébként 2');
add(5, 'A_p = {x ∈ R | |x − 2| ≤ p}.\n\nHa p = −1, mennyi |A_p|? (üres = 0)', 0, 'p < 0 → ∅; p = 0 → {2}; p > 0 → intervallum');
add(5, 'Mely p-kre nem üres [p; p+3] ∩ [1; 5]?\n\nAdd meg a p-intervallum alsó határát!', -2, '−2 ≤ p ≤ 5');
add(5, 'Mely p-kre [p; p+2] ⊆ [0; 5]?\n\nAdd meg a p-intervallum felső határát!', 3, '0 ≤ p ≤ 3');
add(5, 'Mely p-kre intervallum a [0; 2] ∪ [p; p+1]?\n\nAdd meg a p-intervallum felső határát!', 2, '−1 ≤ p ≤ 2');
add(5, 'Egy n elemű halmaznak ötször annyi 3 elemű részhalmaza van, mint 2 elemű.\n\nAdd meg n-et!', 17, 'n = 17');
add(5, 'Egy n elemű halmaznak hatszor annyi 4 elemű részhalmaza van, mint 2 elemű.\n\nAdd meg n-et!', 11, 'n = 11');
add(5, 'Egy n elemű halmaznak 64 olyan részhalmaza van, amely egy rögzített 2 elemű részhalmazt tartalmaz.\n\nAdd meg n-et!', 8, '2^{n−2} = 64 → n = 8');
add(5, '10 elemű halmazból 5 elemet választunk. Hány részhalmaz tartalmaz két kijelölt elem közül legalább egyet?', 196, 'C(10,5) − C(8,5) = 196');
add(5, '12 elemű halmazból 6 elemet választunk. Hány részhalmaz tartalmaz három kijelölt elem közül pontosan kettőt?', 378, 'C(3,2) · C(9,4) = 378');
add(5, 'Hány 8-jegyű kettes számrendszerbeli pozitív számban van legfeljebb két 0?', 29, '1 + C(7,1) + C(7,2) = 29');
add(5, 'Hány különböző számjegyű négyjegyű számban szerepel az 1 és 2 közül pontosan az egyik?', 2436, 'megoldókulcs: 2436');
add(5, '100 darabból 4 hibás. Visszatevés nélkül 5-öt választunk. P(nincs hibás a mintában)?\n\nAdd meg 3 tizedesjegyre!', 0.812, 'C(96,5)/C(100,5) ≈ 0,812');
add(5, 'Különleges kocka: 3 A, 2 B, 1 C lap. Igazságos játéknál mekkora az n − 60 összeg (Ft)?', 180, 'n − 60 = 180');
add(5, 'Selejtnél |T|=44, |H|=38, |E|=42, nincs hármas, csak-egy ugyanannyi, |T∩E|=2|T∩H|.\n\nHány selejtes van összesen?', 110, 'megoldókulcs: 110');
add(5, 'M szigorúan növekvő, K konvex, A alulról korlátos.\n\nIgaz-e, hogy x² ∈ (K ∩ A) \\ M? (1 = igen, 0 = nem)', 1, 'például f(x) = x²');
add(5, 'U: legalább 4 pontú egyszerű gráfok, F fák, G összefüggő gráfok.\n\nHány elem van F \\ G-ben?', 0, 'F ⊆ G → F \\ G = ∅');
add(5, '8 épületből 6-ot ellenőriz az őr, két kijelöltet mindenképp. Hány különböző sorrendű útvonal van?', 10800, 'C(6,4) · 6! = 10800');
add(5, 'Döntsd el: A = B ⇒ A △ B = ∅. Az állítás és a megfordítás is igaz?\n\n(1 = igen, 0 = nem)', 1, 'mindkettő igaz');
add(5, 'Igaz-e: ha A, B véges, |A| = |B| és A ⊆ B, akkor A = B?\n\n(1 = igaz, 0 = hamis)', 1, 'véges halmazokra igaz');

// ===== 6. szint — Mihaszna-mesterfok =====
add(6, 'Bizonyítsd: (A ∪ B)^c = A^c ∩ B^c.\n\nIgaz az azonosság? (1 = igen, 0 = nem)', 1, 'De Morgan');
add(6, 'Bizonyítsd: A \\ (B ∪ C) = (A \\ B) ∩ (A \\ C).\n\nIgaz az azonosság? (1 = igen, 0 = nem)', 1, 'halmazkülönbség szétosztása');
add(6, 'Bizonyítsd: A △ B = B △ A.\n\nIgaz? (1 = igen, 0 = nem)', 1, 'szimmetrikus különbség kommutatív');
add(6, 'Bizonyítsd: ha A △ B = A △ C, akkor B = C.\n\nIgaz? (1 = igen, 0 = nem)', 1, 'B = C következik');
add(6, '|U|=150, |A|=80, |B|=75, |C|=70, |A∩B|=35, |A∩C|=30, |B∩C|=28, 10 elem kívül.\n\nMennyi |A ∩ B ∩ C|?', 8, '|A ∪ B ∪ C| = 140 → x = 8');
add(6, 'Írd fel |A ∪ B ∪ C| inklúzió-kizárását!\n\nHány kéttagú metszetet vonunk ki?', 3, '|A|+|B|+|C| − |A∩B| − |A∩C| − |B∩C| + |ABC|');
add(6, 'Egy 8 elemű U-n hány rendezett (A, B) párra A ∩ B = ∅?', 6561, '3^8 = 6561');
add(6, 'Egy 6 elemű U-n hány rendezett (A, B, C) hármasra A, B, C páronként diszjunkt?', 4096, '4^6 = 4096');
add(6, 'Egy 7 elemű U-n hány rendezett (A, B) párra A ∪ B = U?', 2187, '3^7 = 2187');
add(6, 'Egy 7 elemű U-n hány rendezett (A, B) párra A ∩ B = ∅?', 2187, '3^7 = 2187');
add(6, 'Egy 7 elemű U-n hány rendezett (A, B) párra A ⊆ B?', 2187, '3^7 = 2187');
add(6, 'Egy 5 elemű U-n hány rendezett (A, B, C) hármasra A ⊆ B ⊆ C?', 1024, '4^5 = 1024');
add(6, 'A_p = {x ∈ Z | p ≤ x ≤ p+3}.\n\nHa p = 2 (egész), mennyi |A_p|?', 4, 'p ∈ Z → 4 elem; p ∉ Z → 3 elem');
add(6, 'H = {1; …; 12}. Hány 5 elemű részhalmaz tartalmazza {1,2} közül pontosan egyet, és {3,4} közül legalább egyet?', 280, 'megoldókulcs: 280');
add(6, 'H = {1; …; 12}. Hány 6 elemű részhalmaz tartalmazza {1,2,3,4} közül pontosan kettőt?', 420, 'C(4,2) · C(8,4) = 420');
add(6, '|U|=120, |A|=65, |B|=60, |C|=55; csak AB=18, csak AC=15, csak BC=12, mindhárom=10.\n\nHányan vannak pontosan egy halmazban?', 60, 'pontosan egy: 60; kettő: 45; kívül: 5');
add(6, 'Igaz-e, hogy x² ∈ (K ∩ A) \\ M és e^x ∈ M ∩ K ∩ A?\n\n(1 = igen, 0 = nem)', 1, 'x² és e^x a két Venn-részben');
add(6, 'F ⊆ G a fák és az összefüggő gráfok között.\n\nHány elem van F \\ G-ben?', 0, 'F \\ G = ∅');
add(6, 'Ha P(A) = P(B) (hatványhalmaz), akkor A = B.\n\nIgaz? (1 = igen, 0 = nem)', 1, 'A = B');
add(6, 'Selejtnél csak T = csak H = csak E, mindhárom = 4, |T| = 40, összesen 91.\n\nMennyi a csak-egy kód elemszáma (egyik kategória)?', 20, 'csak T = csak H = csak E = 20; TH=7; TE=9; HE=11');

for (const s of [1, 2, 3, 4, 5, 6]) {
  if (levels[s].length !== 20) {
    throw new Error(`stage ${s} has ${levels[s].length}, expected 20`);
  }
}

const header = `import type { Question } from './types';

/**
 * Halmazok — 6 szint × 20 feladat (MIHASZNAMATEK Halmazok.pdf).
 * 1 Alapok → 2 Műveletek → 3 Kombinatorika → 4 Algebra → 5 Emelt → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getHalmazPracticeQuestions = (): Question[] => [
`;

const body = [1, 2, 3, 4, 5, 6].map((s) => levels[s].join('\n')).join('\n');
const out = header + body + '\n];\n';
const dest = path.join(__dirname, '..', 'utils', 'game', 'halmazLevels.ts');
fs.writeFileSync(dest, out, 'utf8');
console.log('OK wrote', dest, 'total', [1, 2, 3, 4, 5, 6].reduce((n, s) => n + levels[s].length, 0));
