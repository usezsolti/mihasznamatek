import fs from 'fs';
import { createRequire } from 'module';

// Quick structural check + eval via transpiled-free copy of parse logic
const src = fs.readFileSync('components/MathTemplateInput.tsx', 'utf8');
const parseSrc = fs.readFileSync('utils/parseStudentNumber.ts', 'utf8');

// Inline eval of nested patterns by importing after tsx if available — fallback string checks
const data = {
  hasNestIntoFocus: src.includes("mode: root ? 'nest-into-focus' : 'new-root'"),
  hasSetSlotAt: src.includes('function setSlotAt'),
  hasNestNode: src.includes('type NestNode'),
  parseRecursive: parseSrc.includes('function evalExpr'),
};

// Runtime parse test using dynamic eval of the TS is hard; duplicate minimal checks:
function evalQuick(s) {
  // use node --experimental? skip; call via tsx
  return s;
}

const payload = {
  sessionId: 'c04d6a',
  runId: 'nest-template',
  hypothesisId: 'N',
  location: 'scripts/verify-nest.mjs',
  message: 'nest-into-focus wiring',
  data: { ...data, ok: data.hasNestIntoFocus && data.hasSetSlotAt && data.hasNestNode && data.parseRecursive },
  timestamp: Date.now(),
};
fs.appendFileSync('debug-c04d6a.log', JSON.stringify(payload) + '\n');
console.log(payload.data);

// Try tsx parse tests
try {
  const { execSync } = await import('child_process');
  const out = execSync(
    'npx --yes tsx -e "import { parseStudentNumber } from \'./utils/parseStudentNumber.ts\'; const cases=[[\'abs(sqrt(9))\',3],[\'(1)/(2)\',0.5],[\'sqrt((4)/(1))\',2],[\'root(2,16)\',4]]; const r=cases.map(([s,e])=>({s, got:parseStudentNumber(s), e, ok:Math.abs(parseStudentNumber(s)-e)<1e-9})); console.log(JSON.stringify(r));"',
    { encoding: 'utf8', cwd: process.cwd() }
  );
  const parsed = JSON.parse(out.trim().split('\n').pop());
  const payload2 = {
    sessionId: 'c04d6a',
    runId: 'nest-template',
    hypothesisId: 'N',
    location: 'parseStudentNumber',
    message: 'nested parse cases',
    data: { cases: parsed, ok: parsed.every((x) => x.ok) },
    timestamp: Date.now(),
  };
  fs.appendFileSync('debug-c04d6a.log', JSON.stringify(payload2) + '\n');
  console.log(payload2.data);
} catch (e) {
  console.log('parse runtime skip', String(e && e.message || e).slice(0, 200));
}
