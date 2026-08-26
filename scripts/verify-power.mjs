import fs from 'fs';
const c = fs.readFileSync('components/mathInput/catalog.tsx', 'utf8');
const m = fs.readFileSync('components/MathTemplateInput.tsx', 'utf8');
const data = {
  hasPowerWrap: c.includes('powerWrap'),
  hasPowerExp: c.includes('powerExp'),
  hasExpRole: m.includes("role: isPowerExp"),
  powerCaseUsesWrap: /case 'power':[\s\S]*?powerWrap/.test(c),
};
const payload = {
  sessionId: 'c04d6a',
  runId: 'power-layout',
  hypothesisId: 'P',
  location: 'scripts/verify-power.mjs',
  message: 'power superscript layout',
  data: { ...data, ok: data.hasPowerWrap && data.hasPowerExp && data.hasExpRole && data.powerCaseUsesWrap },
  timestamp: Date.now(),
};
fs.appendFileSync('debug-c04d6a.log', JSON.stringify(payload) + '\n');
console.log(payload.data);
