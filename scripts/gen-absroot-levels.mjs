/**
 * Generates utils/game/absrootLevels.ts — 6 × 20 single-answer questions.
 * Run: node scripts/gen-absroot-levels.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** One problem, one numeric answer — no stage/title header, no multi-answer. */
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

// ===== 1. szint — alap =====
add(1, 'Számítsd ki!\n\n|−7|', 7, '|−7| = 7');
add(1, 'Számítsd ki!\n\n|12|', 12, '|12| = 12');
add(1, 'Számítsd ki!\n\n|−3,5|', 3.5, '|−3,5| = 3,5');
add(1, 'Számítsd ki!\n\n√49', 7, '√49 = 7');
add(1, 'Számítsd ki!\n\n√81', 9, '√81 = 9');
add(1, 'Számítsd ki!\n\n√0,25', 0.5, '√0,25 = 0,5');
add(1, 'Oldd meg!\n\n|x| = 5\n\nAdd meg a pozitív megoldást!', 5, 'x = 5');
add(1, 'Oldd meg!\n\n|x − 2| = 3\n\nAdd meg a nagyobb megoldást!', 5, 'x = 5');
add(1, 'Oldd meg!\n\n√x = 4\n\nAdd meg a megoldást!', 16, 'x = 16');
add(1, 'Oldd meg!\n\n√(x + 3) = 5\n\nAdd meg a megoldást!', 22, 'x = 22');
add(1, '√(x − 4) értelmezési tartománya: x ≥ …\n\nAdd meg a határt!', 4, 'x ≥ 4');
add(1, '√(10 − 2x) értelmezési tartománya: x ≤ …\n\nAdd meg a határt!', 5, 'x ≤ 5');
add(1, 'Oldd meg!\n\n|2x| = 8\n\nAdd meg a pozitív megoldást!', 4, 'x = 4');
add(1, 'Oldd meg!\n\n|x| + 3 = 7\n\nAdd meg a pozitív megoldást!', 4, 'x = 4');
add(1, 'Oldd meg!\n\n√(2x) = 6\n\nAdd meg a megoldást!', 18, 'x = 18');
add(1, 'Oldd meg!\n\n|x + 1| = 0\n\nAdd meg a megoldást!', -1, 'x = −1');
add(1, 'Oldd meg!\n\n|x| < 3\n\nAdd meg a felső határt (nyílt)!', 3, 'x < 3');
add(1, 'Számítsd ki x = 5 esetén!\n\n|3 − x|', 2, '|3 − 5| = 2');
add(1, 'Oldd meg!\n\n√(9x) = 6\n\nAdd meg a megoldást!', 4, 'x = 4');
add(1, 'Oldd meg!\n\n|x − 5| = |x|\n\nAdd meg a megoldást!', 2.5, 'x = 2,5');

// ===== 2. szint — munkalap (egyesével) =====
add(2, 'Határozd meg!\n\n√(3x − 6)\n\nAdd meg az értelmezési tartomány alsó határát (zárt)!', 2, 'x ≥ 2');
add(2, 'Határozd meg!\n\n√(8 − 2x)\n\nAdd meg az értelmezési tartomány felső határát (zárt)!', 4, 'x ≤ 4');
add(2, 'Határozd meg!\n\n1/√(x + 4)\n\nAdd meg az értelmezési tartomány alsó határát (nyílt)!', -4, 'x > −4');
add(2, 'Határozd meg!\n\n√((x − 2)(x + 5))\n\nAdd meg a [2, ∞) ág alsó határát!', 2, 'x ≥ 2');
add(2, 'Oldd meg!\n\n√(x + 7) = x − 1\n\nAdd meg a megoldást 3 tizedesjeggyel!', 4.372, 'x = (3+√33)/2');
add(2, 'Oldd meg!\n\n√(2x + 3) = x\n\nAdd meg a megoldást!', 3, 'x = 3');
add(2, 'Oldd meg!\n\n√(13 − 2x) = x − 1\n\nAdd meg a megoldást 3 tizedesjeggyel!', 3.464, 'x = 2√3');
add(2, 'Oldd meg!\n\n√(x + 6) = 2 − x\n\nAdd meg a megoldást 3 tizedesjeggyel!', -0.372, 'x = (5−√33)/2');
add(2, 'Oldd meg!\n\n√(4x + 5) = x + 1\n\nAdd meg a megoldást 3 tizedesjeggyel!', 3.236, 'x = 1+√5');
add(2, 'Oldd meg!\n\n√(x + 1) = x − 5\n\nAdd meg a megoldást!', 8, 'x = 8');
add(2, 'Oldd meg!\n\n√(2x − 4) < 4\n\nAdd meg a felső határt (nyílt)!', 10, 'x < 10');
add(2, 'Oldd meg!\n\n√(3x + 6) > 3\n\nAdd meg az alsó határt (nyílt)!', 1, 'x > 1');
add(2, 'Oldd meg!\n\n|x − 3| = x + 1\n\nAdd meg a megoldást!', 1, 'x = 1');
add(2, 'Oldd meg!\n\n|x + 2| = 2x − 1\n\nAdd meg a megoldást!', 3, 'x = 3');
add(2, 'Oldd meg!\n\n|x − 2| = |x + 4|\n\nAdd meg a megoldást!', -1, 'x = −1');
add(2, 'Oldd meg!\n\n|x + 5| = |3x − 1|\n\nAdd meg a nagyobb megoldást!', 3, 'x = 3');
add(2, 'Oldd meg!\n\n|x − 1| + |x + 2| = 5\n\nAdd meg a nagyobb megoldást!', 2, 'x = 2');
add(2, 'Oldd meg!\n\n|2x − 3| < 5\n\nAdd meg a felső határt (nyílt)!', 4, 'x < 4');
add(2, 'Oldd meg!\n\n√(x²) = 4\n\nAdd meg a pozitív megoldást!', 4, 'x = 4');
add(2, 'Oldd meg!\n\n√(2x + 3) = |x|\n\nAdd meg a pozitív megoldást!', 3, 'x = 3');

// ===== 3. szint =====
add(3, 'Határozd meg!\n\n√((x − 1)/(x − 5))\n\nAdd meg a (−∞, 1] felső határát!', 1, 'x ≤ 1');
add(3, 'Határozd meg!\n\n√(|x| − 3)\n\nAdd meg a pozitív ág alsó határát (zárt)!', 3, 'x ≥ 3');
add(3, 'Oldd meg!\n\n√(3x + 1) = x − 1\n\nAdd meg a megoldást!', 5, 'x = 5');
add(3, 'Oldd meg!\n\n√(5 − x) = x − 1\n\nAdd meg a megoldást 3 tizedesjeggyel!', 2.192, 'x = (3+√13)/2');
add(3, 'Oldd meg!\n\n|x − 4| = 2x + 1\n\nAdd meg a megoldást!', 1, 'x = 1');
add(3, 'Oldd meg!\n\n|3x − 2| = x + 6\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4');
add(3, 'Oldd meg!\n\n|2x + 1| = |x − 5|\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4');
add(3, 'Oldd meg!\n\n√(x + 2) ≥ 3\n\nAdd meg az alsó határt (zárt)!', 7, 'x ≥ 7');
add(3, 'Oldd meg!\n\n√(4 − x) < 2\n\nAdd meg a felső határt (nyílt)!', 4, 'x < 4');
add(3, 'Oldd meg!\n\n|x + 2| ≤ 5\n\nAdd meg a felső határt (zárt)!', 3, 'x ≤ 3');
add(3, 'Oldd meg!\n\n|2x − 1| > 3\n\nAdd meg a pozitív ág alsó határát (nyílt)!', 2, 'x > 2');
add(3, 'Határozd meg!\n\n√(x² − 9)\n\nAdd meg a (3, ∞) alsó határát (nyílt)!', 3, 'x > 3');
add(3, 'Oldd meg!\n\n√(x + 5) = 1 − x\n\nAdd meg a megoldást!', 0, 'x = 0');
add(3, 'Oldd meg!\n\n√(2x − 1) = √(x + 3)\n\nAdd meg a megoldást!', 4, 'x = 4');
add(3, 'Oldd meg!\n\n|x| + |x − 2| = 6\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4');
add(3, 'Oldd meg!\n\n√(x − 1) + 2 = 5\n\nAdd meg a megoldást!', 10, 'x = 10');
add(3, 'Oldd meg!\n\n|3 − 2x| = 5\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4');
add(3, 'Határozd meg!\n\n1/√(2 − x)\n\nAdd meg az értelmezési tartomány felső határát (nyílt)!', 2, 'x < 2');
add(3, 'Oldd meg!\n\n√(x + 8) = 2√x\n\nAdd meg a megoldást 3 tizedesjeggyel!', 2.667, 'x = 8/3');
add(3, 'Oldd meg!\n\n|x − 1| = √(2x + 7)\n\nAdd meg a nagyobb megoldást!', 3, 'x = 3');

// ===== 4. szint =====
add(4, 'Határozd meg!\n\n√((2 − x)/(x + 3))\n\nAdd meg a felső határt (zárt)!', 2, 'x ≤ 2');
add(4, 'Oldd meg!\n\n√(x + 5) − √(x − 3) = 1\n\nAdd meg a megoldást!', 4, 'x = 4');
add(4, 'Oldd meg!\n\n|x + 3| + |x − 1| = 8\n\nAdd meg a nagyobb megoldást!', 3, 'x = 3');
add(4, 'Oldd meg!\n\n|2x − 1| + |x + 2| = 9\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 2.667, 'x = 8/3');
add(4, 'Oldd meg!\n\n√(2x + 3) ≤ x\n\nAdd meg az alsó határt (zárt)!', 3, 'x ≥ 3');
add(4, 'Oldd meg!\n\n|x − 2| + |x + 1| < 5\n\nAdd meg a felső határt (nyílt)!', 3, 'x < 3');
add(4, 'Oldd meg!\n\n√(3x + 1) = 2 − x\n\nAdd meg a megoldást!', 0, 'x = 0');
add(4, '√(x² − 5x + 6) „lyuka” (2, 3). Add meg a lyuk alsó határát (nyílt)!', 2, '(2, 3)');
add(4, 'Oldd meg!\n\n|x² − 1| = 3\n\nAdd meg a pozitív megoldást!', 2, 'x = 2');
add(4, 'Határozd meg!\n\n√(4 − x²)\n\nAdd meg a felső határt (zárt)!', 2, 'x ≤ 2');
add(4, 'Oldd meg!\n\n|2x + 3| = |5 − x|\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 0.667, 'x = 2/3');
add(4, 'Oldd meg!\n\n√(x + 3) = |x − 1|\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 3.562, 'x = (3+√17)/2');
add(4, 'Oldd meg!\n\n|x| − |x − 4| = 2\n\nAdd meg a megoldáshalmaz alsó határát (zárt)!', 3, 'x ≥ 3');
add(4, 'Oldd meg!\n\n√(2x + 6) = |x|\n\nAdd meg a pozitív megoldást!', 3, 'x = 3');
add(4, 'Oldd meg!\n\n|2x − 5| ≥ 3\n\nAdd meg a pozitív ág alsó határát (zárt)!', 4, 'x ≥ 4');
add(4, 'Oldd meg!\n\n√(x − 2) + √(x + 1) = 3\n\nAdd meg a megoldást!', 3, 'x = 3');
add(4, 'Határozd meg!\n\n√(x/(x − 2))\n\nAdd meg a (2, ∞) alsó határát (nyílt)!', 2, 'x > 2');
add(4, 'Oldd meg!\n\n|3x − 6| + |x| = 9\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 3.75, 'x = 3,75');
add(4, 'Oldd meg!\n\n√(x + 2) = 4 − √x\n\nAdd meg a megoldást 3 tizedesjeggyel!', 3.063, 'x = 49/16');
add(4, 'Oldd meg!\n\n√(x + 4) − √(x − 1) = 1\n\nAdd meg a megoldást!', 5, 'x = 5');

// ===== 5. szint =====
add(5, 'Oldd meg!\n\n|x + 1| + |x − 2| + |x − 4| = 9\n\nAdd meg a nagyobb megoldást!', 5, 'x = 5');
add(5, 'Oldd meg!\n\n√(x + 12) − √(x + 3) = 1\n\nAdd meg a megoldást!', 13, 'x = 13');
add(5, 'Oldd meg!\n\n√(2x − 1) = √(x + 4)\n\nAdd meg a megoldást!', 5, 'x = 5');
add(5, 'Oldd meg!\n\n|x² − 5x + 6| = 2\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4');
add(5, 'Oldd meg!\n\n√(x − 1) + √(x + 2) = 3\n\nAdd meg a megoldást!', 2, 'x = 2');
add(5, 'Határozd meg!\n\n√((x − 2)/(4 − x))\n\nAdd meg az alsó határt (zárt)!', 2, '2 ≤ x < 4');
add(5, 'Oldd meg!\n\n|2x − 3| − |x + 1| = 2\n\nAdd meg a megoldáshalmaz alsó határát (zárt)!', 2, 'x ≥ 2');
add(5, 'Oldd meg!\n\n√(x + 6) ≥ x\n\nAdd meg a felső határt (zárt)!', 3, 'x ≤ 3');
add(5, 'Oldd meg!\n\n|x| = √(x + 6)\n\nAdd meg a pozitív megoldást!', 3, 'x = 3');
add(5, 'Határozd meg!\n\n√(9 − x²)\n\nAdd meg a felső határt (zárt)!', 3, 'x ≤ 3');
add(5, 'Oldd meg!\n\n√(9 − x²) = x + 1\n\nAdd meg a megoldást!', 0, 'x = 0');
add(5, 'Oldd meg!\n\n|x − 2|² = 16\n\nAdd meg a nagyobb megoldást!', 6, 'x = 6');
add(5, 'Oldd meg!\n\n|x + 1| + |x − 2| ≥ 5\n\nAdd meg a pozitív ág alsó határát (zárt)!', 3, 'x ≥ 3');
add(5, 'Oldd meg!\n\n√(x + 4) − √(x − 1) = 1\n\nAdd meg a megoldást!', 5, 'x = 5');
add(5, 'Oldd meg!\n\n√(x²) = 3 − 2x\n\nAdd meg a megoldást!', 1, 'x = 1');
add(5, 'Oldd meg!\n\n|x − 3| · |x + 2| = 0\n\nAdd meg a pozitív megoldást!', 3, 'x = 3');
add(5, 'Határozd meg!\n\n1/√(x − 1) − 1/√(4 − x)\n\nAdd meg az alsó határt (nyílt)!', 1, '1 < x < 4');
add(5, 'Oldd meg!\n\n√(3x + 1) = |2x − 1|\n\nAdd meg a nagyobb megoldást!', 1.75, 'x = 7/4');
add(5, 'Oldd meg!\n\n√(2x + 1) + √(x − 3) = 4\n\nAdd meg a megoldást!', 4, 'x = 4');
add(5, 'Oldd meg!\n\n|x − 2| · |x + 1| = 4\n\nAdd meg a pozitív megoldást!', 3, 'x = 3');

// ===== 6. szint =====
add(6, 'Határozd meg!\n\n√((x² − 4)/(x − 3))\n\nAdd meg a [2, 3) ág alsó határát!', 2, 'x ≥ 2');
add(6, 'Oldd meg!\n\n|x − 1| + |x − 3| + |x − 8| = 12\n\nAdd meg a nagyobb megoldást!', 8, 'x = 8');
add(6, 'Oldd meg!\n\n√(x + 3) + √(2 − x) = 3\n\nAdd meg a megoldást!', 1, 'x = 1');
add(6, 'Oldd meg!\n\n√(x² − 2x − 8) = x − 2\n\nAdd meg a megoldást!', 4, 'x = 4');
add(6, 'Oldd meg!\n\n|x² − 4| = 3x\n\nAdd meg a nagyobb megoldást!', 4, 'x = 4');
add(6, 'Oldd meg!\n\n√(2x + 3) − √(x − 1) = 1\n\nAdd meg a megoldást!', 3, 'x = 3');
add(6, 'Oldd meg!\n\n√(x + 5) = |2x − 1|\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 1.804, 'x = (5+√89)/8');
add(6, 'Határozd meg!\n\n1 / √(x² − 5x + 6)\n\nAdd meg a kizárt intervallum alsó határát!', 2, 'x < 2 vagy x > 3');
add(6, 'Oldd meg!\n\n|x − 2| + |x + 2| = 6\n\nAdd meg a felső határt (zárt)!', 3, 'x ≤ 3');
add(6, 'Oldd meg!\n\n√(4x − 3) = 2 − √(x − 1)\n\nAdd meg a megoldást!', 1, 'x = 1');
add(6, 'Oldd meg!\n\n|x − 2| · |x + 1| = 4\n\nAdd meg a pozitív megoldást!', 3, 'x = 3');
add(6, 'Határozd meg!\n\n√(x − 2) / √(5 − x)\n\nAdd meg az alsó határt (zárt)!', 2, '2 ≤ x < 5');
add(6, 'Oldd meg!\n\n|x| + |x − 2| = √(x + 7)\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 2.545, 'x = (9+√129)/8');
add(6, 'Oldd meg!\n\n√(3 − x) ≥ x − 1\n\nAdd meg a felső határt (zárt)!', 2, 'x ≤ 2');
add(6, 'Oldd meg!\n\n√(x + 1) = 2|x − 1|\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 1.843, 'x = (9+√33)/8');
add(6, 'Oldd meg!\n\n|2x − 1| = √(x + 5)\n\nAdd meg a nagyobb megoldást 3 tizedesjeggyel!', 1.804, 'x = (5+√89)/8');
add(6, 'Határozd meg!\n\n√(x² − 9) / (x − 4)\n\nAdd meg a [3, ∞) ág alsó határát!', 3, '|x| ≥ 3, x ≠ 4');
add(6, 'Oldd meg!\n\n√(5 − 2x) = |x − 1|\n\nAdd meg a pozitív megoldást!', 2, 'x = 2');
add(6, 'Oldd meg!\n\n√(x − 3) + √(6 − x) = √6\n\nAdd meg a megoldást!', 4.5, 'x = 4,5');
add(6, 'Oldd meg!\n\n|x² − 9| = 7|x|\n\nAdd meg a nagyobb pozitív megoldást 3 tizedesjeggyel!', 8.109, 'x = (7+√85)/2');

for (const s of [1, 2, 3, 4, 5, 6]) {
  if (levels[s].length !== 20) {
    console.error('Level', s, 'has', levels[s].length);
    process.exit(1);
  }
  for (const block of levels[s]) {
    if (block.includes('alternativeAnswer') || block.includes('thirdAnswer')) {
      console.error('Multi-answer found in stage', s);
      process.exit(1);
    }
    if (/\d+\. szint ·/.test(block)) {
      console.error('Stage header found in stage', s);
      process.exit(1);
    }
  }
}

const body = [1, 2, 3, 4, 5, 6].flatMap((s) => levels[s]).join('\n');
const out = `import type { Question } from './types';

/**
 * Abszolútérték és gyök — 6 szint × 20 feladat.
 * Egy kártya = egy feladat = egy válasz (nincs szint/téma fejléc).
 */
export const getAbsoluteRootPracticeQuestions = (): Question[] => [
${body}
];
`;

const target = path.join(__dirname, '..', 'utils', 'game', 'absrootLevels.ts');
fs.writeFileSync(target, out, 'utf8');
console.log('OK wrote', target, 'total', 120);
