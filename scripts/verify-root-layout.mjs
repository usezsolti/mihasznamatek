import fs from 'fs';
const c = fs.readFileSync('components/mathInput/catalog.tsx', 'utf8');
const m = fs.readFileSync('components/MathTemplateInput.tsx', 'utf8');
const payload = {
  sessionId: 'c04d6a',
  runId: 'root-layout',
  hypothesisId: 'W',
  location: 'scripts/verify-root-layout.mjs',
  message: 'radical visual layout',
  data: {
    hasRadicalVisual: c.includes('function RadicalVisual'),
    nthUsesVisual: /case 'nthroot':\s*\n\s*return <RadicalVisual/.test(c),
    hasRootIndexSizing: m.includes("layout === 'nthroot'"),
  },
  timestamp: Date.now(),
};
payload.data.ok =
  payload.data.hasRadicalVisual &&
  payload.data.nthUsesVisual &&
  payload.data.hasRootIndexSizing;
fs.appendFileSync('debug-c04d6a.log', JSON.stringify(payload) + '\n');
console.log(payload.data);
