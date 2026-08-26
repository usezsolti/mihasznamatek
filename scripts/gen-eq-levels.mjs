/**
 * Generates utils/game/eqLevels.ts — 6 × 20 single-answer equation tasks.
 * Source: Egyenletek, egyenletrendszerek és egyenlőtlenségek (hat szintű feladatsor).
 * Run: node scripts/gen-eq-levels.mjs
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

// ===== 1. szint — Algebrai rutin =====
add(1, 'Oldd meg!\n\n5x − 8 = 3x + 10\n\nAdd meg x-et!', 9, '2x = 18 → x = 9');
add(1, 'Oldd meg!\n\n3(x − 2) − 2(x + 4) = 7\n\nAdd meg x-et!', 21, 'x − 14 = 7 → x = 21');
add(1, 'Oldd meg!\n\nx² − 7x + 12 = 0\n\nAdd meg a nagyobb gyököt!', 4, '(x − 3)(x − 4) = 0');
add(1, 'Oldd meg!\n\nx³ − 5x² + 6x = 0\n\nAdd meg a legnagyobb gyököt!', 3, 'x(x − 2)(x − 3) = 0');
add(1, 'Oldd meg!\n\n(x − 3)(2x + 5) = 0\n\nAdd meg a nagyobb gyököt!', 3, 'x = 3 vagy x = −5/2');
add(1, 'Oldd meg!\n\n|x − 5| = 3\n\nAdd meg a nagyobb megoldást!', 8, 'x = 8 vagy x = 2');
add(1, 'Oldd meg!\n\n2x − 3 < 7\n\nAdd meg a felső határt (nyílt)!', 5, 'x < 5');
add(1, 'Oldd meg!\n\nx + y = 11\n2x − y = 4\n\nAdd meg x-et!', 5, '(x, y) = (5, 6)');
add(1, 'Oldd meg!\n\n6x + 1 = 2x + 13\n\nAdd meg x-et!', 3, '4x = 12 → x = 3');
add(1, 'Oldd meg!\n\n4(x − 1) − (x + 5) = 6\n\nAdd meg x-et!', 5, '3x − 9 = 6 → x = 5');
add(1, 'Oldd meg!\n\nx² − 9x + 20 = 0\n\nAdd meg a nagyobb gyököt!', 5, '(x − 4)(x − 5) = 0');
add(1, 'Oldd meg!\n\nx² − 25 = 0\n\nAdd meg a pozitív gyököt!', 5, 'x = ±5');
add(1, 'Oldd meg!\n\nx³ − x² − 6x = 0\n\nAdd meg a legnagyobb gyököt!', 3, 'x(x − 3)(x + 2) = 0');
add(1, 'Oldd meg!\n\n(x + 6)(x − 2) = 0\n\nAdd meg a nagyobb gyököt!', 2, 'x = −6 vagy x = 2');
add(1, 'Oldd meg!\n\n|x + 3| = 7\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4 vagy x = −10');
add(1, 'Oldd meg!\n\n5x + 2 ≤ 17\n\nAdd meg a felső határt (zárt)!', 3, 'x ≤ 3');
add(1, 'Oldd meg!\n\nx + y = 15\nx − y = 3\n\nAdd meg x-et!', 9, '(x, y) = (9, 6)');
add(1, 'Oldd meg!\n\n3x − 7 = 8\n\nAdd meg x-et!', 5, '3x = 15 → x = 5');
add(1, 'Oldd meg!\n\n|2x − 1| = 5\n\nAdd meg a nagyobb megoldást!', 3, 'x = 3 vagy x = −2');
add(1, 'Oldd meg!\n\n4x + 5 > 13\n\nAdd meg az alsó határt (nyílt)!', 2, 'x > 2');

// ===== 2. szint — Feltételek és módszerek =====
add(2, 'Oldd meg!\n\n(x + 3)/(x − 2) = 2\n\nAdd meg x-et!', 7, 'x + 3 = 2x − 4 → x = 7 (x ≠ 2)');
add(2, 'Oldd meg!\n\n|2x − 3| = 5\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4 vagy x = −1');
add(2, 'Oldd meg!\n\n|x − 4| = x + 2\n\nAdd meg a megoldást!', 1, 'x = 1 (a másik eset hamis)');
add(2, 'Oldd meg!\n\n√(x + 5) = x − 1\n\nAdd meg a megoldást!', 4, 'x = 4 (x = −1 hamis gyök)');
add(2, 'Oldd meg!\n\n√(3x + 4) = x + 2\n\nAdd meg a nagyobb megoldást!', 0, 'x = 0 vagy x = −1');
add(2, 'Oldd meg!\n\n(x − 1)/(x + 2) ≤ 0\n\nAdd meg a felső határt (zárt)!', 1, '−2 < x ≤ 1');
add(2, 'Oldd meg!\n\nx⁴ − 10x² + 9 = 0\n\nAdd meg a legnagyobb megoldást!', 3, 'x = ±1, ±3');
add(2, 'Oldd meg!\n\nx + y = 7\nxy = 12\n\nAdd meg a nagyobb számot!', 4, '(3, 4) vagy (4, 3)');
add(2, 'Oldd meg!\n\n(x − 4)/(x + 1) = 3\n\nAdd meg x-et!', -3.5, 'x − 4 = 3x + 3 → x = −3,5');
add(2, 'Oldd meg!\n\n|3x + 1| = 7\n\nAdd meg a nagyobb megoldást!', 2, 'x = 2 vagy x = −8/3');
add(2, 'Oldd meg!\n\n|x + 5| = 2x − 1\n\nAdd meg a megoldást!', 6, 'x = 6 (ellenőrzés: |11| = 11)');
add(2, 'Oldd meg!\n\n√(x + 12) = x\n\nAdd meg a megoldást!', 4, 'x = 4 (x = −3 hamis)');
add(2, 'Oldd meg!\n\n√(4x + 5) = x + 1\n\nAdd meg a megoldást 3 tizedesjeggyel!', 3.236, 'x = 1 + √5 ≈ 3,236');
add(2, 'Oldd meg!\n\n(x + 1)/(x − 4) ≤ 0\n\nAdd meg a felső határt (nyílt)!', 4, '−1 ≤ x < 4');
add(2, 'Oldd meg!\n\nx⁴ − 13x² + 36 = 0\n\nAdd meg a legnagyobb megoldást!', 3, 'x² = 4 vagy x² = 9');
add(2, 'Oldd meg!\n\nx + y = 9\nxy = 20\n\nAdd meg a nagyobb számot!', 5, '(4, 5) vagy (5, 4)');
add(2, 'Oldd meg!\n\n(3x − 1)/(x − 2) = 4\n\nAdd meg x-et!', 7, '3x − 1 = 4x − 8 → x = 7');
add(2, 'Oldd meg!\n\n|x − 3| = |2x + 1|\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 0.667, 'x = 2/3 vagy x = −4');
add(2, 'Oldd meg!\n\n√(x − 1) + 2 = x\n\nAdd meg a megoldást 3 tizedesjeggyel!', 3.618, 'x = (5 + √5)/2 ≈ 3,618');
add(2, 'Oldd meg!\n\n|4 − x| = 6\n\nAdd meg a nagyobb megoldást!', 10, 'x = 10 vagy x = −2');

// ===== 3. szint — Szerkezetfelismerés =====
add(3, 'Oldd meg!\n\n2^{2x} − 5 · 2^x + 4 = 0\n\nAdd meg a nagyobb megoldást!', 2, 't = 2^x → t = 4 vagy 1 → x = 2 vagy 0');
add(3, 'Oldd meg!\n\n3^{2x} − 10 · 3^x + 9 = 0\n\nAdd meg a nagyobb megoldást!', 2, 't = 3^x → t = 9 vagy 1 → x = 2 vagy 0');
add(3, 'Oldd meg!\n\n√(x + 8) − √(x − 1) = 1\n\nAdd meg a megoldást!', 17, '√(x − 1) = 4 → x = 17');
add(3, 'Oldd meg!\n\n|x − 2| + |x + 3| = 7\n\nAdd meg a nagyobb megoldást!', 3, 'x = 3 vagy x = −4');
add(3, 'Oldd meg!\n\n(x − 3)/(x + 1) > 1\n\nAdd meg a felső határt (nyílt)!', -1, 'x < −1');
add(3, 'Oldd meg!\n\nlog₂(x − 1) + log₂(x + 2) = 2\n\nAdd meg a megoldást!', 2, '(x − 1)(x + 2) = 4 → x = 2');
add(3, 'Oldd meg!\n\n2 sin² x − 3 sin x + 1 = 0\n\nHány megoldás van a [0; 2π) intervallumon?', 3, 'sin x = 1 vagy 1/2 → 3 megoldás');
add(3, 'Oldd meg!\n\nx + y = 5\nx² + y² = 13\n\nAdd meg a nagyobb számot!', 3, '(2, 3) vagy (3, 2)');
add(3, 'Oldd meg!\n\n4^x − 6 · 2^x + 8 = 0\n\nAdd meg a nagyobb megoldást!', 2, 't = 2^x → t = 4 vagy 2 → x = 2 vagy 1');
add(3, 'Oldd meg!\n\n5^{2x} − 26 · 5^x + 25 = 0\n\nAdd meg a nagyobb megoldást!', 2, 't = 5^x → t = 25 vagy 1 → x = 2 vagy 0');
add(3, 'Oldd meg!\n\n√(x + 5) − √(x − 2) = 1\n\nAdd meg a megoldást!', 11, '√(x − 2) = 3 → x = 11');
add(3, 'Oldd meg!\n\n|x| + |x − 6| = 10\n\nAdd meg a nagyobb megoldást!', 8, 'x = 8 vagy x = −2');
add(3, 'Oldd meg!\n\n(x + 2)/(x − 3) > 1\n\nAdd meg az alsó határt (nyílt)!', 3, 'x > 3');
add(3, 'Oldd meg!\n\nlog₃ x + log₃(x + 8) = 2\n\nAdd meg a megoldást!', 1, 'x(x + 8) = 9 → x = 1');
add(3, 'Oldd meg!\n\n2 cos² x − 3 cos x + 1 = 0\n\nHány megoldás van a [0; 2π) intervallumon?', 3, 'cos x = 1 vagy 1/2 → 3 megoldás');
add(3, 'Oldd meg!\n\nx + y = 6\nx² + y² = 20\n\nAdd meg a nagyobb számot!', 4, '(2, 4) vagy (4, 2)');
add(3, 'Oldd meg!\n\nlog₂(x − 3) = 3\n\nAdd meg x-et!', 11, 'x − 3 = 8 → x = 11');
add(3, 'Oldd meg!\n\n2^{2x} − 9 · 2^x + 8 = 0\n\nAdd meg a nagyobb megoldást!', 3, 't = 2^x → t = 8 vagy 1 → x = 3 vagy 0');
add(3, 'Oldd meg!\n\n|x − 1| + |x − 4| = 5\n\nAdd meg a nagyobb megoldást!', 5, 'x = 5 vagy x = 0');
add(3, 'Oldd meg!\n\nx + y = 4\nxy = 3\n\nAdd meg a nagyobb számot!', 3, '(1, 3) vagy (3, 1)');

// ===== 4. szint — Összetett érettségi rutin =====
add(4, 'Oldd meg!\n\n√(2x + 3) + √(x − 1) = 4\n\nAdd meg a megoldást 3 tizedesjeggyel!', 2.431, 'x = 44 − 24√3 ≈ 2,431');
add(4, 'Oldd meg!\n\n√(x + 5) = |x − 1|\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4 vagy x = −1');
add(4, 'Oldd meg!\n\n|x² − 5x + 4| = 2\n\nAdd meg a legnagyobb megoldást 3 tizedesjeggyel!', 4.562, '(5 + √17)/2 ≈ 4,562');
add(4, 'Oldd meg!\n\n(x − 4)/(x − 6) ≤ −1\n\nAdd meg az alsó határt (zárt)!', 5, '5 ≤ x < 6');
add(4, 'Oldd meg!\n\n4^x − 5 · 2^x + 4 = 0\n\nAdd meg a nagyobb megoldást!', 2, 't = 2^x → t = 4 vagy 1 → x = 2 vagy 0');
add(4, 'Oldd meg!\n\nlog₃(x + 5) + log₃(x − 1) = 2\n\nAdd meg a megoldást 3 tizedesjeggyel!', 2.243, 'x = −2 + 3√2 ≈ 2,243');
add(4, 'Oldd meg!\n\n2 cos² x + cos x − 1 = 0\n\nHány megoldás van a [0; 2π) intervallumon?', 3, 'cos x = 1/2 vagy −1 → 3 megoldás');
add(4, 'Oldd meg!\n\nx + y = 6\n√x + √y = 2√3\n\nAdd meg x-et!', 3, 'x = y = 3');
add(4, 'Oldd meg!\n\n√(x + 3) + √(x − 1) = 4\n\nAdd meg a megoldást!', 3.25, '√(x − 1) = 1,5 → x = 3,25');
add(4, 'Oldd meg!\n\n√(4x + 5) = |x + 1|\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 3.236, 'x = 1 + √5 ≈ 3,236');
add(4, 'Oldd meg!\n\n|x² − 3x| = 2\n\nAdd meg a legnagyobb megoldást 3 tizedesjeggyel!', 3.562, '(3 + √17)/2 ≈ 3,562');
add(4, 'Oldd meg!\n\n(x − 2)/(x − 5) ≤ −1\n\nAdd meg az alsó határt (zárt)!', 3.5, '3,5 ≤ x < 5');
add(4, 'Oldd meg!\n\n9^x − 10 · 3^x + 9 = 0\n\nAdd meg a nagyobb megoldást!', 2, 't = 3^x → t = 9 vagy 1 → x = 2 vagy 0');
add(4, 'Oldd meg!\n\nlog₂(x + 3) + log₂(x − 1) = 3\n\nAdd meg a megoldást 3 tizedesjeggyel!', 2.464, 'x = −1 + 2√3 ≈ 2,464');
add(4, 'Oldd meg!\n\n2 sin² x + sin x − 1 = 0\n\nHány megoldás van a [0; 2π) intervallumon?', 3, 'sin x = 1/2 vagy −1 → 3 megoldás');
add(4, 'Oldd meg!\n\nx + y = 10\n√x + √y = 4\n\nAdd meg a nagyobb számot!', 9, '√x, √y = 1 és 3 → 1 és 9');
add(4, 'Oldd meg!\n\n√(3x + 1) + √(x − 1) = 4\n\nAdd meg a megoldást 3 tizedesjeggyel!', 2.351, 'x = 15 − 4√10 ≈ 2,351');
add(4, 'Oldd meg!\n\n|x² − 4x + 3| = 1\n\nAdd meg a legnagyobb megoldást 3 tizedesjeggyel!', 3.414, '2 + √2 ≈ 3,414');
add(4, 'Oldd meg!\n\nlog₅(x − 2) + log₅(x + 2) = 1\n\nAdd meg a megoldást!', 3, 'x² − 4 = 5 → x = 3');
add(4, 'Oldd meg!\n\n4^x − 10 · 2^x + 16 = 0\n\nAdd meg a nagyobb megoldást!', 3, 't = 2^x → t = 8 vagy 2 → x = 3 vagy 1');

// ===== 5. szint — Emelt =====
add(5, 'Vizsgáld!\n\nx² − (p + 2)x + 2p = 0\n\nMelyik p-nél nincs két különböző valós gyök?', 2, 'D = (p − 2)² = 0 ⇔ p = 2');
add(5, 'Az x² − (p + 1)x + p = 0 egyik gyöke kétszerese a másiknak.\n\nAdd meg a nagyobb ilyen p-t!', 2, 'gyökök: 1 és p → p = 2 vagy p = 1/2');
add(5, 'A p paraméter függvényében: |x − 2| = p\n\nHa p = 0, hány valós megoldás van?', 1, 'p = 0 → egy megoldás (x = 2)');
add(5, 'A p paraméter függvényében: x² − 4x + p = 0\n\nHa p = 4, hány valós megoldás van?', 1, 'D = 0 ⇔ p = 4');
add(5, 'Oldd meg!\n\n√(x + 4) + √(8 − x) = 4\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 7.657, 'x = 2 + 4√2 ≈ 7,657');
add(5, 'Oldd meg!\n\nlog₂(x − 1) + log₂(5 − x) = 1\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 4.414, 'x = 3 + √2 ≈ 4,414');
add(5, 'Oldd meg!\n\nsin² x = 3 cos² x\n\nHány megoldás van a [0; 2π) intervallumon?', 4, 'cos x = ±1/2 → 4 megoldás');
add(5, 'Határozd meg az összes pozitív egész (x, y) számpárt!\n\n1/x + 1/y = 1/2\n\nHány ilyen számpár van?', 3, '(3, 6), (4, 4), (6, 3)');
add(5, 'Az x² − (p + 2)x + 2p = 0 egyenletnél p = 0.\n\nHány különböző valós gyök van?', 2, 'x² − 2x = 0 → x = 0 vagy 2');
add(5, 'Az x² − (p + 3)x + 2p = 0 egyenletnél p = 0.\n\nAdd meg a nemnulla gyököt!', 3, 'x² − 3x = 0 → x = 0 vagy 3');
add(5, '|x − 2| = p. Ha p = 5, hány valós megoldás van?', 2, 'p > 0 → 2 megoldás');
add(5, '|x − 2| = p. Ha p = −3, hány valós megoldás van?', 0, 'p < 0 → 0 megoldás');
add(5, 'x² − 4x + p = 0. Ha p = 0, hány valós megoldás van?', 2, 'x = 0 vagy x = 4');
add(5, 'x² − 4x + p = 0. Ha p = 5, hány valós megoldás van?', 0, 'D = 16 − 20 < 0');
add(5, '√(x + 4) + √(8 − x) = 4\n\nAdd meg a kisebb megoldást 3 tizedesjeggyel!', -3.657, 'x = 2 − 4√2 ≈ −3,657');
add(5, 'log₂(x − 1) + log₂(5 − x) = 1\n\nAdd meg a kisebb megoldást 3 tizedesjeggyel!', 1.586, 'x = 3 − √2 ≈ 1,586');
add(5, 'sin² x = 3 cos² x\n\nAdd meg a kisebb pozitív megoldást fokban!', 60, 'tan² x = 3 → 60°');
add(5, '1/x + 1/y = 1/2, x, y pozitív egészek.\n\nAdd meg a legnagyobb lehetséges x-et!', 6, 'x = 6, y = 3');
add(5, '|x + 1| = p. Ha p = 0, hány valós megoldás van?', 1, 'x = −1');
add(5, 'x² − 6x + p = 0. Két különböző valós gyök van, ha p kisebb, mint …\n\nAdd meg ezt a határt!', 9, 'D = 36 − 4p > 0 → p < 9');

// ===== 6. szint — Mihaszna-mesterfok =====
add(6, 'Vizsgáld!\n\n|x² − 4x + 3| = p\n\nHa p = 1, hány különböző valós megoldás van?', 3, 'p = 1: a W-alak csúcsa + két külső');
add(6, 'Ugyanez az egyenlet. Ha p = 2, hány különböző valós megoldás van?', 2, 'p > 1 → 2 megoldás');
add(6, 'Ugyanez. Ha 0 < p < 1, hány különböző valós megoldás van?', 4, 'W-alak: 4 metszéspont');
add(6, 'Ugyanez. Ha p < 0, hány különböző valós megoldás van?', 0, 'absz ≥ 0');
add(6, 'Ugyanez. Ha p = 0, hány különböző valós megoldás van?', 2, 'x = 1 és x = 3');
add(6, 'Vizsgáld!\n\n√(x + 2) = p − x\n\nHa p = −3, hány valós megoldás van?', 0, 'p < −2 → 0 megoldás');
add(6, 'Ugyanez. Ha p = −2, hány valós megoldás van?', 1, 'érintés x = −2-nél');
add(6, 'Ugyanez. Ha p = 2, hány valós megoldás van?', 1, 'p > −2 → pontosan 1 megoldás');
add(6, 'Vizsgáld!\n\nx² = p − x\n\nHa p = −0,25, hány valós megoldás van?', 1, 'D = 0 ⇔ p = −1/4');
add(6, 'Ugyanez. Ha p = 0, hány valós megoldás van?', 2, 'x = 0 vagy x = −1');
add(6, 'Ugyanez. Ha p = −1, hány valós megoldás van?', 0, 'p < −1/4 → 0 megoldás');
add(6, 'Bizonyítsd: (x + 1)/x = 2 a pozitív valósakon pontosan egy megoldású.\n\nAdd meg ezt a megoldást!', 1, '1 + 1/x = 2 → x = 1');
add(6, 'Határozd meg az összes pozitív egész (x, y) számpárt!\n\nxy = 2x + 3y\n\nHány ilyen számpár van?', 4, '(4, 8), (5, 5), (6, 4), (9, 3)');
add(6, 'Ugyanez. Add meg a legnagyobb lehetséges x-et!', 9, 'x = 9, y = 3');
add(6, 'Oldd meg!\n\n(x² − 5x + 6)/(x² − 1) ≤ 0\n\nHány egész megoldás van?', 3, 'x = 0, 2, 3');
add(6, 'Ugyanez az egyenlőtlenség.\n\nAdd meg a zárt intervallum alsó határát!', 2, ']−1; 1[ ∪ [2; 3]');
add(6, 'Oldd meg!\n\n2 sin² x + sin x cos x − cos² x = 0\n\nHány megoldás van a [0; 2π) intervallumon?', 4, 'tan x = 1/2 vagy tan x = −1');
add(6, 'Vizsgáld!\n\n|x² − 4| = p x\n\nHa p = 0, hány valós megoldás van?', 2, 'x = ±2');
add(6, 'Ugyanez. Ha p = 1, hány valós megoldás van?', 2, 'két pozitív gyök, negatív nincs');
add(6, 'x² = p − x és p = −1/4.\n\nAdd meg a (kettős) gyököt!', -0.5, 'x = −1/2');

for (const s of [1, 2, 3, 4, 5, 6]) {
  if (levels[s].length !== 20) {
    throw new Error(`stage ${s} has ${levels[s].length}, expected 20`);
  }
}

const header = `import type { Question } from './types';

/**
 * Egyenletek, egyenletrendszerek, egyenlőtlenségek — 6 szint × 20 feladat.
 * 1 Algebrai rutin → 2 Feltételek → 3 Szerkezet → 4 Összetett → 5 Emelt → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getEquationsPracticeQuestions = (): Question[] => [
`;

const body = [1, 2, 3, 4, 5, 6].map((s) => levels[s].join('\n')).join('\n');
const out = header + body + '\n];\n';
const dest = path.join(__dirname, '..', 'utils', 'game', 'eqLevels.ts');
fs.writeFileSync(dest, out, 'utf8');
console.log('OK wrote', dest, 'total', [1, 2, 3, 4, 5, 6].reduce((n, s) => n + levels[s].length, 0));
