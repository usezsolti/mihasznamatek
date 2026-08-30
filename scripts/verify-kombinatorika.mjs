import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'utils/game/kombinatorikaLevels.ts'), 'utf8');
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
const tp = fs.readFileSync(path.join(root, 'utils/topicPath.ts'), 'utf8');
const wired =
  pb.includes("from './kombinatorikaLevels'") &&
  pb.includes('getKombinatorikaPracticeQuestions') &&
  wl.includes('getKombinatorikaPracticeQuestions') &&
  /kombinatorika[\s\S]*getKombinatorikaPracticeQuestions/.test(wl) &&
  ge.includes('getKombinatorikaPracticeQuestions()') &&
  tp.includes("t.includes('kombinatorika')");
const stillRandom =
  /kombinatorika[\s\S]{0,400}Egyszerűsített/.test(ge);
const ok =
  stages.length === 120 &&
  [1, 2, 3, 4, 5, 6].every((s) => byStage[s] === 20) &&
  multi === 0 &&
  !header &&
  wired &&
  !stillRandom;

const payload = {
  total: stages.length,
  byStage,
  multi,
  header,
  wired,
  stillRandom,
  ok,
};
console.log(JSON.stringify(payload, null, 2));
process.exit(ok ? 0 : 1);
