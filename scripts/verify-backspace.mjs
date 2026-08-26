import fs from 'fs';
const m = fs.readFileSync('components/MathTemplateInput.tsx', 'utf8');
const data = {
  hasBackspaceHandler: m.includes("e.key !== 'Backspace'"),
  hasUnwrap: m.includes('backspace unwrap/clear'),
  hasIsNodeEmpty: m.includes('function isNodeEmpty'),
};
const payload = {
  sessionId: 'c04d6a',
  runId: 'backspace-delete',
  hypothesisId: 'B',
  location: 'scripts/verify-backspace.mjs',
  message: 'backspace delete wiring',
  data: { ...data, ok: data.hasBackspaceHandler && data.hasUnwrap && data.hasIsNodeEmpty },
  timestamp: Date.now(),
};
fs.appendFileSync('debug-c04d6a.log', JSON.stringify(payload) + '\n');
console.log(payload.data);
