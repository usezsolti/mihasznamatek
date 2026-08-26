import fs from 'fs';

const c = fs.readFileSync('components/mathInput/catalog.tsx', 'utf8');
const m = fs.readFileSync('components/MathTemplateInput.tsx', 'utf8');

const layouts = [
  'frac', 'power', 'pow2', 'sqrt', 'cbrt', 'nthroot', 'abs', 'exp', 'logb', 'unary',
  'deriv', 'deriv2', 'pderiv', 'pderiv2', 'pderivmix',
  'integral', 'defint', 'sum', 'prod', 'limit', 'limitSide',
  'vec', 'col', 'mat', 'piecewise',
];

const missing = layouts.filter((l) => !c.includes(`case '${l}'`));
const data = {
  layoutCases: layouts.length,
  missing,
  hasGetSlotVisualRole: c.includes('export function getSlotVisualRole'),
  usesGetSlotVisualRole: m.includes('getSlotVisualRole'),
  hasDerivBlock: c.includes('function DerivBlock'),
  hasRadicalVisual: c.includes('function RadicalVisual'),
  hasPowerWrap: c.includes('powerWrap'),
};
const payload = {
  sessionId: 'c04d6a',
  runId: 'layouts-audit',
  hypothesisId: 'L',
  location: 'scripts/verify-layouts.mjs',
  message: 'all math layouts placement review',
  data: {
    ...data,
    ok:
      missing.length === 0 &&
      data.hasGetSlotVisualRole &&
      data.usesGetSlotVisualRole &&
      data.hasDerivBlock &&
      data.hasRadicalVisual,
  },
  timestamp: Date.now(),
};
fs.appendFileSync('debug-c04d6a.log', JSON.stringify(payload) + '\n');
console.log(JSON.stringify(payload.data, null, 2));
