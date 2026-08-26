/**
 * Generates utils/game/proofLevels.ts — 6 × 20 single-answer proof checks.
 * Levels follow MIHASZNAMATEK "Hat szintű rendszer" (Bizonyítások szintek szerint).
 * Run: node scripts/gen-proof-levels.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function item(stage, body, answer, expression) {
  return [
    '    {',
    `        stage: ${stage},`,
    `        question: \`${body}\`,`,
    `        answer: ${Number(answer)},`,
    `        type: 'multiplication',`,
    `        expression: \`${expression}\`,`,
    '    },',
  ].join('\n');
}

const levels = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
const add = (stage, body, answer, expression) => {
  levels[stage].push(item(stage, body, answer, expression));
};

// ===== 1. szint — Alapok =====
add(1, 'Igazold numerikusan!\n\n(a + b)² − (a − b)² = 4ab\n\nHa a = 5 és b = 3, mennyi a bal oldal?', 60, '4ab = 4·5·3 = 60');
add(1, 'Igazold!\n\na² − b² = (a − b)(a + b)\n\nHa a = 7 és b = 2, mennyi az érték?', 45, '49 − 4 = 45');
add(1, 'Egy derékszögű háromszög befogói 6 cm és 8 cm.\n\nHatározd meg az átfogót!', 10, '√(36+64) = 10');
add(1, 'Számtani sorozat: a₁ = 3, d = 4.\n\nMennyi a tizedik tag?', 39, 'a₁₀ = 3 + 9·4 = 39');
add(1, 'Szabályos dobókockával egyszer dobunk.\n\nMennyi a páros dobás valószínűsége?', 0.5, '3/6 = 1/2');
add(1, 'Öt ember közül kettőt választunk.\n\nHány különböző kiválasztás lehetséges?', 10, 'C(5,2) = 10');
add(1, 'n³ − n osztható 6-tal. Ellenőrzés: n = 4.\n\nMennyi (n³ − n) / 6?', 10, '64 − 4 = 60, 60/6 = 10');
add(1, 'Páratlan szám négyzete 8-cal osztva 1 maradékot ad.\n\n5² = 25. Mennyi 25 mod 8?', 1, '24 + 1');
add(1, '1 + 3 + 5 + 7 + 9 = n².\n\nMennyi az összeg?', 25, '5² = 25');
add(1, '1 + 2 + … + 10 = n(n+1)/2.\n\nMennyi az összeg?', 55, '10·11/2 = 55');
add(1, 'C(n,0) + … + C(n,n) = 2ⁿ.\n\nn = 4 esetén a jobb oldal mennyi?', 16, '2⁴ = 16');
add(1, 'Pitagorasz: 3, 4, 5.\n\nMennyi a háromszög területe?', 6, '3·4/2 = 6');
add(1, 'AM-GM: √(ab) ≤ (a+b)/2.\n\nHa a = 4 és b = 9, mennyi a mértani közép?', 6, '√36 = 6');
add(1, 'Ha a = 4 és b = 9, mennyi a számtani közép?', 6.5, '(4+9)/2 = 6,5');
add(1, '2ⁿ értéke n = 5 esetén?', 32, '2⁵ = 32');
add(1, 'Három egymást követő egész szorzata: 3·4·5.\n\nMennyi a szorzat?', 60, '60');
add(1, 'n páratlan: n = 9. Mennyi n² mod 8?', 1, '81 = 10·8 + 1');
add(1, 'Hány prímszám van 10-nél nem nagyobb?', 4, '2, 3, 5, 7');
add(1, 'Egyenlő oldalú háromszög oldala 2.\n\n(a+b−c)(a−b+c)(−a+b+c) = ?', 8, '2·2·2 = 8');
add(1, 'C(6,1) = ?', 6, '6');

// ===== 2. szint — Módszerek =====
add(2, 'Bizonyítsd: pozitív a, b esetén a/b + b/a ≥ 2.\n\nAdd meg a minimumot!', 2, 'egyenlőség ⇔ a = b');
add(2, 'Mikor áll fenn egyenlőség a/b + b/a ≥ 2 esetén?\n\nAdd meg az a/b arányt!', 1, 'a = b');
add(2, '|2x − 5| = x + 1 megoldásai közül a nagyobbikat add meg!', 6, '2x−5 = x+1 → x = 6');
add(2, '√(3x − 2) = x.\n\nAdd meg a nagyobb megoldást!', 2, 'x = 1 vagy x = 2');
add(2, '2^{x+1} = 16.\n\nAdd meg x-et!', 3, '2^{x+1} = 2⁴ → x = 3');
add(2, 'x⁴ − 5x² + 4 = 0.\n\nAdd meg a legnagyobb megoldást!', 2, 'x² = 4 vagy 1 → x = ±2, ±1');
add(2, 'Számtani sorozat: a₄ = 11, a₉ = 26.\n\nMennyi d?', 3, '5d = 15 → d = 3');
add(2, 'Ugyanennél a sorozatnál mennyi a₁?', 2, 'a₁ + 3d = 11 → a₁ = 2');
add(2, 'Két kockával a dobott számok összege legalább 10.\n\nHány kedvező kimenetel van (36-ból)?', 6, '(4,6)(5,5)(5,6)(6,4)(6,5)(6,6)');
add(2, 'Két oldal 7 és 10, közbezárt szög 60°.\n\nA harmadik oldal koszinusztétellel: c² = 49+100−70. Mennyi c²?', 79, 'c² = 149 − 70 = 79');
add(2, 'n = 6. Mennyi (n³ − n)/6?', 35, '216−6 = 210, 210/6 = 35');
add(2, '15² = 225. Mennyi 225 mod 8?', 1, '28·8 = 224');
add(2, 'Páros n esetén (n² + 2) mod 4 mennyi?', 2, '(2k)² + 2 ≡ 2 (mod 4)');
add(2, 'Páratlan n esetén (n² + 2) mod 4 mennyi?', 3, '1 + 2 ≡ 3 (mod 4)');
add(2, '1 + 3 + … + (2·8 − 1) = ?', 64, '8² = 64');
add(2, '(5³ − 1)/4 = ?', 31, '124/4 = 31');
add(2, '1² + 2² + … + 5² = ?', 55, '5·6·11/6 = 55');
add(2, 'C(7,2) = ?', 21, '21');
add(2, 'Ha hₐ = hᵦ, akkor a/b = ?', 1, 'T = a hₐ/2 = b hᵦ/2');
add(2, 'Húrnégyszög szemközti szögeinek összege (fok)?', 180, 'karakterizáció');

// ===== 3. szint — Önálló rutin =====
add(3, 'Igazold: (a+b)⁴ − (a−b)⁴ = 8ab(a²+b²).\n\na = 2, b = 1 esetén mennyi mindkét oldal?', 80, '81 − 1 = 80');
add(3, 'x⁴ − 4x³ + 8x² − 8x + 4 = (x² − 2x + 2)² ≥ 0.\n\nHány valós x-re van egyenlőség?', 0, 'D = 4−8 < 0');
add(3, '√(x+5) + √(x−4) = 3.\n\nAdd meg a megoldást!', 4, 'x = 4');
add(3, '|x − 2| + |x + 3| = 7.\n\nAdd meg a nagyobb megoldást!', 3, 'x = −4 vagy x = 3');
add(3, '|x² − 5x + 4| = 2.\n\nAdd meg a legnagyobb megoldást 3 tizedesjeggyel!', 4.562, '(5+√17)/2 ≈ 4,562');
add(3, 'Mértani sorozat: a₂ = 6, a₅ = 162.\n\nMennyi q?', 3, 'q³ = 27 → q = 3');
add(3, 'Ugyanennél mennyi a₁?', 2, 'a₁ q = 6 → a₁ = 2');
add(3, 'Téglalap kerülete 40 cm.\n\nMennyi a maximális terület?', 100, 'négyzet 10×10');
add(3, 'Négy különböző könyv véletlen sorrendben.\n\nKét kijelölt egymás mellett: kedvező / 24. Add meg a valószínűséget 3 tizedesjeggyel!', 0.5, '2·3! / 4! = 1/2');
add(3, '1² + … + 10² = n(n+1)(2n+1)/6.\n\nMennyi az összeg?', 385, '10·11·21/6 = 385');
add(3, '(5⁴ − 1)/4 = ?', 156, '625−1 = 624');
add(3, 'n = 6. 1+3+…+(2n−1) = ?', 36, '36');
add(3, 'C(n,0)+…+C(n,n), n = 6. Mennyi?', 64, '2⁶ = 64');
add(3, 'Pozitív a,b,c: (a+b+c)(1/a+1/b+1/c) ≥ ?', 9, 'AM-HM');
add(3, 'aₙ = (2n+3)/(3n+4). Mennyi lim aₙ, 3 tizedesjegy?', 0.667, '2/3');
add(3, 'Ugyanennek a sorozatnak a₁ értéke 3 tizedesjeggyel?', 0.714, '5/7');
add(3, 'x² − (2p+3)x + p² + 3p + 1 = 0.\n\nA diszkrimináns (konstans) mennyi?', 5, 'D = 5');
add(3, '31 tanuló, 12 hónap. Legalább hányan születtek ugyanabban a hónapban?', 3, '⌈31/12⌉ = 3');
add(3, 'Létezhet-e gráf pontosan 1 páratlan fokú csúccsal? (1 = igen, 0 = nem)', 0, 'kézfogási lemma');
add(3, 'n(n+1)(n+2)/3, n = 4. Mennyi 1·2+2·3+3·4+4·5?', 40, '40');

// ===== 4. szint — Összetett problémák =====
add(4, 'Jegyár 3000 Ft, 400 eladott jegy. x darab 200 Ft-os áremelés.\n\nA jegyár x = 5 esetén mennyi?', 4000, '3000 + 1000');
add(4, 'Ugyanez: eladott jegyek száma x = 5 esetén?', 300, '400 − 100');
add(4, 'Bevétel B(x) = (3000+200x)(400−20x).\n\nA maximum x = 2,5-nél van. Mennyi ekkor a jegyár?', 3500, '3000 + 500');
add(4, '20 cm-es négyzet sarkából x = 4 cm-es négyzetet vágunk.\n\nMennyi a megmaradó terület?', 384, '400 − 16');
add(4, 'aₙ = (3n+1)/(4n+2).\n\nMennyi a határérték?', 0.75, '3/4');
add(4, 'Ugyanennek a₁ értéke 3 tizedesjeggyel?', 0.667, '4/6 = 2/3');
add(4, 'Sₙ = 1·2 + … + n(n+1) = n(n+1)(n+2)/3.\n\nn = 6 esetén mennyi Sₙ?', 112, '6·7·8/3 = 112');
add(4, 'Két kocka él p = 1 és q = 2. Összeolvasztás előtt a felszínek összege?', 30, '6(1+4) = 30');
add(4, '52941 számjegyeinek összes sorrendje (az eredetivel együtt). Hány ötjegyű szám?', 120, '5! = 120');
add(4, 'Derékszögű háromszög oldalai számtani sorozat, legrövidebb 4.\n\nMennyi a középső oldal?', 5, '4, 5, 6 — 16+25=36');
add(4, 'Ugyanennek az átfogója?', 6, '6');
add(4, 'Kocka és gömb felszíne egyenlő. A gömb térfogata nagyobb-e? (1 = igen, 0 = nem)', 1, 'izoperimetrikus');
add(4, 'C(8,3) = ?', 56, '56');
add(4, '1-től 8-ig három szám, az összeg páros. Hány ilyen választás van?', 28, 'C(4,3)+C(4,2)C(4,1) = 4+24');
add(4, 'Ekkor a páros összeg valószínűsége?', 0.5, '28/56');
add(4, 'n = 9. 1+3+…+(2n−1) = ?', 81, '81');
add(4, 'Háromszög 5, 12, 13. Terület?', 30, '30');
add(4, 'n = 7. (n³ − n)/6 = ?', 56, '336/6');
add(4, '2⁸ = ?', 256, '256');
add(4, 'Téglalap kerület 40, oldalak 12 és 8. Terület?', 96, '96 (max 100)');

// ===== 5. szint — Emelt =====
add(5, 'x² − (2p+1)x + p = 0. D = 4p² + 1.\n\nD minimuma mennyi?', 1, '4p²+1 ≥ 1');
add(5, 'Ugyanez: hány valós p-re van két különböző valós gyök? (1 = minden p, 0 = nem minden)', 1, 'D > 0 mindig');
add(5, '1+3+…+(2n−1) = n². n = 15 esetén a jobb oldal?', 225, '225');
add(5, 'f(x) = x³ − 6x² + 9x + 2. Lokális maximum értéke (x = 1)?', 6, 'f(1) = 6');
add(5, 'Ugyanennek lokális minimuma (x = 3)?', 2, 'f(3) = 2');
add(5, 'f′(x) = 3(x−1)(x−3). A kisebb stacionárius hely?', 1, 'x = 1');
add(5, 'C(8,3) = ?', 56, '56');
add(5, '1,…,8 közül 3 szám, páros összeg. Hány eset?', 28, '28');
add(5, 'P(összeg páros) = ?', 0.5, '1/2');
add(5, '(a+b+c)(1/a+1/b+1/c) ≥ 9. Egyenlőségnél a/b = ?', 1, 'a = b = c');
add(5, 'n = 8. 1²+…+n² = ?', 204, '8·9·17/6 = 204');
add(5, 'Sₙ = n(n+1)(n+2)/3, n = 8. Mennyi?', 240, '8·9·10/3 = 240');
add(5, '5ⁿ − 1 osztható 4-gyel. n = 5: (3125−1)/4 = ?', 781, '3124/4');
add(5, 'n⁴ + 6n − 1 osztható 9-cel. n = 2: (16+12−1)/9 = ?', 3, '27/9');
add(5, 'n⁴ + 6n − 1 osztható-e 8-cal? (1 = igen minden n-re, 0 = nem)', 0, 'n=1: 6, nem');
add(5, 'Kocka él 1, gömb felszíne 6. r² = 6/(4π). A gömb térfogata nagyobb a kockáénál? (1/0)', 1, 'igen');
add(5, 'Ramsey: 6 pont 2-színezésénél van egyszínű háromszög. Az alsó korlát n ≥ ?', 6, 'R(3,3)=6');
add(5, 'Binomiális: n = 9, 2ⁿ = ?', 512, '512');
add(5, 'Skatulya: 50 tanuló, 12 hónap. Legalább hányan ugyanabban a hónapban?', 5, '⌈50/12⌉ = 5');
add(5, 'D = (2p+3)² − 4(p²+3p+1). Értéke?', 5, '5');

// ===== 6. szint — Mesterfok =====
add(6, '|x² − 4x + 3| = p. p = 1 esetén hány különböző valós megoldás van?', 3, 'csúcs 1, két külső');
add(6, 'Ugyanez p = 2 esetén hány megoldás?', 2, 'p > 1');
add(6, 'Ugyanez 0 < p < 1 esetén hány megoldás?', 4, 'W-alak');
add(6, 'Ugyanez p < 0 esetén hány megoldás?', 0, 'absz ≥ 0');
add(6, 'Ugyanez p = 0 esetén hány megoldás?', 2, 'x = 1 és x = 3');
add(6, '| (x−1)(x−3) | maximuma [1,3]-on?', 1, 'x = 2: |−1| = 1');
add(6, 'Sₙ = 1·2 + … + n(n+1). S₄ = ?', 40, '40');
add(6, 'A sejtés: Sₙ = n(n+1)(n+2)/3. n = 10-re mennyi?', 440, '10·11·12/3 = 440');
add(6, '10 cm sugarú körbe írt téglalap maximális területe?', 200, 'négyzet, átló 20, T = 200');
add(6, 'C(n,0)+…+C(n,n) = 2ⁿ. n = 10. Mennyi?', 1024, '1024');
add(6, 'Egyenlő szárú háromszög megfordítása igaz-e? (1 = igen, 0 = nem)', 1, 'alaptétel megfordítható');
add(6, 'Páratlan fokú csúcsok száma gráfban páros. 3 páratlan fokú csúcs lehetséges? (1/0)', 0, 'nem');
add(6, 'n ≥ ? kell ahhoz, hogy 2-színezett teljes gráfban legyen egyszínű háromszög?', 6, 'R(3,3)');
add(6, '(a+b+c)(1/a+1/b+1/c), a=b=c=2. Érték?', 9, '6 · 1,5 = 9');
add(6, 'Két kocka összeolvasztása: p=q=1. Az új él ³√2. Az új felszín 6·2^{2/3}. 2^{2/3} ≈ ? 3 tizedesjegy.', 1.587, '2^{2/3}');
add(6, 'n = 12. 1+3+…+(2n−1) = ?', 144, '144');
add(6, 'f(x) = |x²−4x+3| − p. p = 1-nél a gyökök száma?', 3, 'mint fent');
add(6, 'C(10,2) = ?', 45, '45');
add(6, '√3 irracionális. Igaz-e, hogy √3 racionális? (1 = igen, 0 = nem)', 0, 'indirekt');
add(6, 'Pozitív a,b,c AM-HM minimuma (a+b+c)(1/a+1/b+1/c) = ?', 9, '9');

for (const s of [1, 2, 3, 4, 5, 6]) {
  if (levels[s].length !== 20) {
    console.error('Level', s, 'has', levels[s].length);
    process.exit(1);
  }
}

const body = [1, 2, 3, 4, 5, 6].flatMap((s) => levels[s]).join('\n');
const out = `import type { Question } from './types';

/**
 * Bizonyítások — 6 szint × 20 feladat (MIHASZNAMATEK hat szintű rendszer).
 * 1 Alapok → 2 Módszerek → 3 Önálló rutin → 4 Összetett → 5 Emelt → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getProofPracticeQuestions = (): Question[] => [
${body}
];
`;

const target = path.join(__dirname, '..', 'utils', 'game', 'proofLevels.ts');
fs.writeFileSync(target, out, 'utf8');
console.log('OK wrote', target, 'total', 120);
