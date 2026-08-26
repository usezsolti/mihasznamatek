import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'utils/game/proofLevels.ts'), 'utf8');
const stages = [...src.matchAll(/stage:\s*(\d+)/g)].map((m) => Number(m[1]));
const byStage = {};
stages.forEach((s) => {
  byStage[s] = (byStage[s] || 0) + 1;
});
const multi = (src.match(/alternativeAnswer/g) || []).length;
const pb = fs.readFileSync(path.join(root, 'utils/game/practiceBanks.ts'), 'utf8');
const wired = pb.includes("from './proofLevels'") && pb.includes('getProofPracticeQuestions');
const ok =
  stages.length === 120 &&
  [1, 2, 3, 4, 5, 6].every((s) => byStage[s] === 20) &&
  multi === 0 &&
  wired;

const payload = {
  sessionId: 'c04d6a',
  runId: 'proof-120',
  hypothesisId: 'P',
  location: 'scripts/verify-proof.mjs',
  message: 'proof 6x20 bank',
  data: { total: stages.length, byStage, multi, wired, ok },
  timestamp: Date.now(),
};
fs.appendFileSync(path.join(root, 'debug-c04d6a.log'), JSON.stringify(payload) + '\n');
console.log(JSON.stringify(payload.data, null, 2));
process.exit(ok ? 0 : 1);
