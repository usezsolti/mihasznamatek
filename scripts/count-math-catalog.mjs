import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const cat = fs.readFileSync(path.join(root, 'components/mathInput/catalog.tsx'), 'utf8');
const data = { basic: 0, calculus: 0, vectors: 0, trig: 0, symbols: 0 };
let cur = null;
for (const line of cat.split('\n')) {
  const m = line.match(/id: '(basic|calculus|vectors|trig|symbols)'/);
  if (m) cur = m[1];
  if (cur && /kind: '(template|insert)'/.test(line)) data[cur] += 1;
}
const total = Object.values(data).reduce((a, b) => a + b, 0);
const payload = {
  sessionId: 'c04d6a',
  runId: 'wolfram-full',
  hypothesisId: 'W',
  location: 'scripts/count-math-catalog.mjs',
  message: 'math panel item counts',
  data: { ...data, total, ok: total >= 100 },
  timestamp: Date.now(),
};
fs.appendFileSync(path.join(root, 'debug-c04d6a.log'), JSON.stringify(payload) + '\n');
console.log(JSON.stringify(payload.data, null, 2));
