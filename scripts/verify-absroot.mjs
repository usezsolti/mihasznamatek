import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'utils/game/absrootLevels.ts'), 'utf8');
const stages = [...src.matchAll(/stage:\s*(\d+)/g)].map((m) => Number(m[1]));
const byStage = {};
stages.forEach((s) => {
  byStage[s] = (byStage[s] || 0) + 1;
});
const multiAnswer =
  (src.match(/alternativeAnswer/g) || []).length + (src.match(/thirdAnswer/g) || []).length;
const withHeader = (src.match(/\d+\. szint ·/g) || []).length;
const pb = fs.readFileSync(path.join(root, 'utils/game/practiceBanks.ts'), 'utf8');
const wired =
  pb.includes("from './absrootLevels'") &&
  pb.includes('getAbsoluteRootPracticeQuestions') &&
  pb.includes('agentDebugLog');

const ok =
  stages.length === 120 &&
  [1, 2, 3, 4, 5, 6].every((s) => byStage[s] === 20) &&
  wired &&
  multiAnswer === 0 &&
  withHeader === 0;

const payload = {
  sessionId: 'c04d6a',
  runId: 'single-q-verify',
  hypothesisId: 'B',
  location: 'scripts/verify-absroot.mjs',
  message: 'absroot single-answer + no header',
  data: { total: stages.length, byStage, wired, multiAnswer, withHeader, ok },
  timestamp: Date.now(),
};

const line = JSON.stringify(payload) + '\n';
fs.appendFileSync(path.join(root, 'debug-c04d6a.log'), line);
const cursorLog = path.join(root, '..', '.cursor', 'debug-c04d6a.log');
try {
  fs.mkdirSync(path.dirname(cursorLog), { recursive: true });
  fs.appendFileSync(cursorLog, line);
} catch {
  /* ignore */
}
console.log(JSON.stringify(payload.data, null, 2));
process.exit(ok ? 0 : 1);
