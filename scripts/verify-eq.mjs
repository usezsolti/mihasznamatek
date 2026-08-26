import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'utils/game/eqLevels.ts'), 'utf8');
const stages = [...src.matchAll(/stage:\s*(\d+)/g)].map((m) => Number(m[1]));
const byStage = {};
stages.forEach((s) => {
  byStage[s] = (byStage[s] || 0) + 1;
});
const multi = (src.match(/alternativeAnswer/g) || []).length;
const header = /^\s*\d+\.\s*szint/m.test(src);
const pb = fs.readFileSync(path.join(root, 'utils/game/practiceBanks.ts'), 'utf8');
const wl = fs.readFileSync(path.join(root, 'utils/game/worksheetLists.ts'), 'utf8');
const ge = fs.readFileSync(path.join(root, 'utils/game/generateErettsegi.ts'), 'utf8');
const wired =
  pb.includes("from './eqLevels'") &&
  pb.includes('getEquationsPracticeQuestions') &&
  wl.includes('getEquationsPracticeQuestions') &&
  /bizonyitas[\s\S]*getProofPracticeQuestions/.test(wl) &&
  /egyenletek[\s\S]*getEquationsPracticeQuestions/.test(wl) &&
  ge.includes('getEquationsPracticeQuestions()');
const stillProofForEq =
  /egyenletek[\s\S]{0,200}getProofPracticeQuestions/.test(wl) ||
  /egyenletek[\s\S]{0,200}getProofPracticeQuestions/.test(ge);
const ok =
  stages.length === 120 &&
  [1, 2, 3, 4, 5, 6].every((s) => byStage[s] === 20) &&
  multi === 0 &&
  !header &&
  wired &&
  !stillProofForEq;

const payload = {
  sessionId: 'c04d6a',
  runId: 'eq-120',
  hypothesisId: 'E',
  location: 'scripts/verify-eq.mjs',
  message: 'equations 6x20 bank',
  data: { total: stages.length, byStage, multi, header, wired, stillProofForEq, ok },
  timestamp: Date.now(),
};
fs.appendFileSync(path.join(root, 'debug-c04d6a.log'), JSON.stringify(payload) + '\n');
console.log(JSON.stringify(payload.data, null, 2));
process.exit(ok ? 0 : 1);
