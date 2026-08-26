import { parseStudentNumber } from '../utils/parseStudentNumber';
import fs from 'fs';

const cases: [string, number][] = [
  ['abs(sqrt(9))', 3],
  ['(1)/(2)', 0.5],
  ['sqrt((4)/(1))', 2],
  ['root(2,16)', 4],
  ['3,5', 3.5],
  ['root(2,sqrt(81))', 3],
];

const results = cases.map(([s, e]) => {
  const got = parseStudentNumber(s);
  return { s, got, e, ok: Number.isFinite(got) && Math.abs(got - e) < 1e-9 };
});

const payload = {
  sessionId: 'c04d6a',
  runId: 'nest-template',
  hypothesisId: 'N',
  location: 'parseStudentNumber',
  message: 'nested parse after comma fix',
  data: { results, ok: results.every((r) => r.ok) },
  timestamp: Date.now(),
};
fs.appendFileSync('debug-c04d6a.log', JSON.stringify(payload) + '\n');
console.log(JSON.stringify(payload.data, null, 2));
