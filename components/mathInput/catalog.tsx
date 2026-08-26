import type { ReactNode, CSSProperties } from 'react';

export type MathCategoryId = 'basic' | 'calculus' | 'vectors' | 'trig' | 'symbols';

export type LayoutId =
    | 'frac'
    | 'power'
    | 'pow2'
    | 'sqrt'
    | 'cbrt'
    | 'nthroot'
    | 'abs'
    | 'unary'
    | 'logb'
    | 'exp'
    | 'deriv'
    | 'deriv2'
    | 'pderiv'
    | 'pderiv2'
    | 'pderivmix'
    | 'integral'
    | 'defint'
    | 'sum'
    | 'prod'
    | 'limit'
    | 'limitSide'
    | 'vec'
    | 'col'
    | 'mat'
    | 'piecewise'
    | 'set';

export type TemplateItem = {
    kind: 'template';
    id: string;
    label: string;
    katex: string;
    slots: number;
    layout: LayoutId;
    /** Extra layout hint (e.g. vec size, mat rows/cols, side +/-) */
    meta?: Record<string, string | number>;
    build: (slots: string[]) => string;
};

export type InsertItem = {
    kind: 'insert';
    id: string;
    label: string;
    katex: string;
    insert: string;
};

export type MathItem = TemplateItem | InsertItem;

export type MathCategory = {
    id: MathCategoryId;
    title: string;
    items: MathItem[];
};

const u = (name: string, katex: string, fn: string): TemplateItem => ({
    kind: 'template',
    id: name,
    label: name,
    katex,
    slots: 1,
    layout: 'unary',
    meta: { fn },
    build: ([a]) => `${fn}(${a || '?'})`,
});

export const MATH_CATEGORIES: MathCategory[] = [
    {
        id: 'basic',
        title: 'ALAP MATEK',
        items: [
            {
                kind: 'template',
                id: 'fraction',
                label: 'Tört',
                katex: '\\frac{\\square}{\\square}',
                slots: 2,
                layout: 'frac',
                build: ([a, b]) => `(${a || '?'})/(${b || '?'})`,
            },
            {
                kind: 'template',
                id: 'pow2',
                label: 'Négyzet',
                katex: '\\square^{2}',
                slots: 1,
                layout: 'pow2',
                build: ([a]) => `(${a || '?'})^(2)`,
            },
            {
                kind: 'template',
                id: 'power',
                label: 'Hatvány',
                katex: '\\square^{\\square}',
                slots: 2,
                layout: 'power',
                build: ([a, b]) => `(${a || '?'})^(${b || '?'})`,
            },
            {
                kind: 'template',
                id: 'sqrt',
                label: 'Gyök',
                katex: '\\sqrt{\\square}',
                slots: 1,
                layout: 'sqrt',
                build: ([a]) => `sqrt(${a || '?'})`,
            },
            {
                kind: 'template',
                id: 'cbrt',
                label: 'Köbgyök',
                katex: '\\sqrt[3]{\\square}',
                slots: 1,
                layout: 'cbrt',
                build: ([a]) => `cbrt(${a || '?'})`,
            },
            {
                kind: 'template',
                id: 'nthroot',
                label: 'n-edik gyök',
                katex: '\\sqrt[\\square]{\\square}',
                slots: 2,
                layout: 'nthroot',
                build: ([n, a]) => `root(${n || '?'},${a || '?'})`,
            },
            { kind: 'insert', id: 'inf', label: '∞', katex: '\\infty', insert: 'inf' },
            { kind: 'insert', id: 'ninf', label: '−∞', katex: '-\\infty', insert: '-inf' },
            { kind: 'insert', id: 'pi', label: 'π', katex: '\\pi', insert: 'pi' },
            { kind: 'insert', id: 'e', label: 'e', katex: 'e', insert: 'e' },
            {
                kind: 'template',
                id: 'exp',
                label: 'e^□',
                katex: 'e^{\\square}',
                slots: 1,
                layout: 'exp',
                build: ([a]) => `e^(${a || '?'})`,
            },
            u('ln', '\\ln(\\square)', 'ln'),
            {
                kind: 'template',
                id: 'logb',
                label: 'log_b',
                katex: '\\log_{\\square}(\\square)',
                slots: 2,
                layout: 'logb',
                build: ([b, a]) => `log(${b || '?'},${a || '?'})`,
            },
            u('log10', '\\log_{10}(\\square)', 'log10'),
            {
                kind: 'template',
                id: 'abs',
                label: 'Abszolút',
                katex: '|\\square|',
                slots: 1,
                layout: 'abs',
                build: ([a]) => `abs(${a || '?'})`,
            },
            {
                kind: 'template',
                id: 'set',
                label: 'Halmaz',
                katex: '\\{\\square\\}',
                slots: 1,
                layout: 'set',
                build: ([a]) => `{${a || ''}}`,
            },
            { kind: 'insert', id: 'le', label: '≤', katex: '\\le', insert: '<=' },
            { kind: 'insert', id: 'ge', label: '≥', katex: '\\ge', insert: '>=' },
            { kind: 'insert', id: 'ne', label: '≠', katex: '\\ne', insert: '!=' },
            { kind: 'insert', id: 'plus', label: '+', katex: '+', insert: '+' },
            { kind: 'insert', id: 'minus', label: '−', katex: '-', insert: '-' },
            { kind: 'insert', id: 'times', label: '×', katex: '\\times', insert: '*' },
            { kind: 'insert', id: 'div', label: '÷', katex: '\\div', insert: '/' },
            { kind: 'insert', id: 'eq', label: '=', katex: '=', insert: '=' },
            { kind: 'insert', id: 'lt', label: '<', katex: '<', insert: '<' },
            { kind: 'insert', id: 'gt', label: '>', katex: '>', insert: '>' },
            { kind: 'insert', id: 'lparen', label: '(', katex: '(', insert: '(' },
            { kind: 'insert', id: 'rparen', label: ')', katex: ')', insert: ')' },
        ],
    },
    {
        id: 'calculus',
        title: 'KALKULUS ÉS ÖSSZEGEK',
        items: [
            {
                kind: 'template',
                id: 'deriv',
                label: 'd/dx',
                katex: '\\dfrac{d}{d\\square}\\square',
                slots: 2,
                layout: 'deriv',
                build: ([v, f]) => `d/d(${v || '?'})(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'deriv2',
                label: 'd²/dx²',
                katex: '\\dfrac{d^{2}}{d\\square^{2}}\\square',
                slots: 2,
                layout: 'deriv2',
                build: ([v, f]) => `d2/d(${v || '?'})2(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'pderiv',
                label: '∂/∂x',
                katex: '\\dfrac{\\partial}{\\partial\\square}\\square',
                slots: 2,
                layout: 'pderiv',
                build: ([v, f]) => `pd/d(${v || '?'})(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'pderiv2',
                label: '∂²/∂x²',
                katex: '\\dfrac{\\partial^{2}}{\\partial\\square^{2}}\\square',
                slots: 2,
                layout: 'pderiv2',
                build: ([v, f]) => `pd2/d(${v || '?'})2(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'pderivmix',
                label: '∂²/∂x∂y',
                katex: '\\dfrac{\\partial^{2}}{\\partial\\square\\partial\\square}\\square',
                slots: 3,
                layout: 'pderivmix',
                build: ([x, y, f]) => `pd2/d(${x || '?'})d(${y || '?'})(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'integral',
                label: '∫',
                katex: '\\int\\square\\,d\\square',
                slots: 2,
                layout: 'integral',
                build: ([f, v]) => `int(${f || '?'},d${v || '?'})`,
            },
            {
                kind: 'template',
                id: 'defint',
                label: '∫_a^b',
                katex: '\\int_{\\square}^{\\square}\\square\\,d\\square',
                slots: 4,
                layout: 'defint',
                build: ([lo, hi, f, v]) => `defint(${lo || '?'},${hi || '?'},${f || '?'},d${v || '?'})`,
            },
            {
                kind: 'template',
                id: 'iint',
                label: '∬',
                katex: '\\iint\\square',
                slots: 1,
                layout: 'unary',
                meta: { fn: 'iint', prefix: '∬' },
                build: ([f]) => `iint(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'iiint',
                label: '∭',
                katex: '\\iiint\\square',
                slots: 1,
                layout: 'unary',
                meta: { fn: 'iiint', prefix: '∭' },
                build: ([f]) => `iiint(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'oint',
                label: '∮',
                katex: '\\oint\\square',
                slots: 1,
                layout: 'unary',
                meta: { fn: 'oint', prefix: '∮' },
                build: ([f]) => `oint(${f || '?'})`,
            },
            {
                kind: 'template',
                id: 'sum',
                label: 'Σ',
                katex: '\\sum_{\\square}^{\\square}\\square',
                slots: 3,
                layout: 'sum',
                build: ([lo, hi, expr]) => `sum(${lo || '?'},${hi || '?'},${expr || '?'})`,
            },
            {
                kind: 'template',
                id: 'prod',
                label: 'Π',
                katex: '\\prod_{\\square}^{\\square}\\square',
                slots: 3,
                layout: 'prod',
                build: ([lo, hi, expr]) => `prod(${lo || '?'},${hi || '?'},${expr || '?'})`,
            },
            {
                kind: 'template',
                id: 'limit',
                label: 'lim',
                katex: '\\lim_{\\square\\to\\square}\\square',
                slots: 3,
                layout: 'limit',
                build: ([v, to, expr]) => `lim(${v || '?'}->${to || '?'},${expr || '?'})`,
            },
            {
                kind: 'template',
                id: 'limitL',
                label: 'lim −',
                katex: '\\lim_{\\square\\to\\square^{-}}\\square',
                slots: 3,
                layout: 'limitSide',
                meta: { side: '-' },
                build: ([v, to, expr]) => `lim(${v || '?'}->${to || '?'}-,${expr || '?'})`,
            },
            {
                kind: 'template',
                id: 'limitR',
                label: 'lim +',
                katex: '\\lim_{\\square\\to\\square^{+}}\\square',
                slots: 3,
                layout: 'limitSide',
                meta: { side: '+' },
                build: ([v, to, expr]) => `lim(${v || '?'}->${to || '?'}+,${expr || '?'})`,
            },
            u('theta', '\\theta(\\square)', 'theta'),
            u('delta', '\\delta(\\square)', 'delta'),
            {
                kind: 'template',
                id: 'piecewise',
                label: '{…}',
                katex: '\\begin{cases}\\square\\\\\\square\\end{cases}',
                slots: 2,
                layout: 'piecewise',
                build: ([a, b]) => `piecewise(${a || '?'};${b || '?'})`,
            },
            u('laplace', '\\mathcal{L}\\{\\square\\}', 'L'),
            u('ilaplace', '\\mathcal{L}^{-1}\\{\\square\\}', 'Linv'),
            u('fourier', '\\mathcal{F}\\{\\square\\}', 'F'),
            u('ifourier', '\\mathcal{F}^{-1}\\{\\square\\}', 'Finv'),
        ],
    },
    {
        id: 'vectors',
        title: 'VEKTOROK ÉS MÁTRIXOK',
        items: [
            {
                kind: 'template',
                id: 'vec2',
                label: '[□,□]',
                katex: '[\\square,\\square]',
                slots: 2,
                layout: 'vec',
                meta: { n: 2 },
                build: (s) => `[${s.map((x) => x || '?').join(',')}]`,
            },
            {
                kind: 'template',
                id: 'vec3',
                label: '[□,□,□]',
                katex: '[\\square,\\square,\\square]',
                slots: 3,
                layout: 'vec',
                meta: { n: 3 },
                build: (s) => `[${s.map((x) => x || '?').join(',')}]`,
            },
            {
                kind: 'template',
                id: 'vec4',
                label: '[□×4]',
                katex: '[\\square,\\square,\\square,\\square]',
                slots: 4,
                layout: 'vec',
                meta: { n: 4 },
                build: (s) => `[${s.map((x) => x || '?').join(',')}]`,
            },
            {
                kind: 'template',
                id: 'col2',
                label: 'oszlop 2',
                katex: '\\begin{bmatrix}\\square\\\\\\square\\end{bmatrix}',
                slots: 2,
                layout: 'col',
                meta: { n: 2 },
                build: (s) => `col(${s.map((x) => x || '?').join(',')})`,
            },
            {
                kind: 'template',
                id: 'col3',
                label: 'oszlop 3',
                katex: '\\begin{bmatrix}\\square\\\\\\square\\\\\\square\\end{bmatrix}',
                slots: 3,
                layout: 'col',
                meta: { n: 3 },
                build: (s) => `col(${s.map((x) => x || '?').join(',')})`,
            },
            {
                kind: 'template',
                id: 'col4',
                label: 'oszlop 4',
                katex: '\\begin{bmatrix}\\square\\\\\\square\\\\\\square\\\\\\square\\end{bmatrix}',
                slots: 4,
                layout: 'col',
                meta: { n: 4 },
                build: (s) => `col(${s.map((x) => x || '?').join(',')})`,
            },
            {
                kind: 'template',
                id: 'mat22',
                label: '2×2',
                katex: '\\begin{pmatrix}\\square&\\square\\\\\\square&\\square\\end{pmatrix}',
                slots: 4,
                layout: 'mat',
                meta: { rows: 2, cols: 2 },
                build: ([a, b, c, d]) => `mat([[${a || '?'},${b || '?'}],[${c || '?'},${d || '?'}]])`,
            },
            {
                kind: 'template',
                id: 'mat23',
                label: '2×3',
                katex: '\\begin{pmatrix}\\square&\\square&\\square\\\\\\square&\\square&\\square\\end{pmatrix}',
                slots: 6,
                layout: 'mat',
                meta: { rows: 2, cols: 3 },
                build: (s) => {
                    const [a, b, c, d, e, f] = s;
                    return `mat([[${a || '?'},${b || '?'},${c || '?'}],[${d || '?'},${e || '?'},${f || '?'}]])`;
                },
            },
            {
                kind: 'template',
                id: 'mat32',
                label: '3×2',
                katex: '\\begin{pmatrix}\\square&\\square\\\\\\square&\\square\\\\\\square&\\square\\end{pmatrix}',
                slots: 6,
                layout: 'mat',
                meta: { rows: 3, cols: 2 },
                build: (s) => {
                    const [a, b, c, d, e, f] = s;
                    return `mat([[${a || '?'},${b || '?'}],[${c || '?'},${d || '?'}],[${e || '?'},${f || '?'}]])`;
                },
            },
            {
                kind: 'template',
                id: 'mat33',
                label: '3×3',
                katex: '\\begin{pmatrix}\\square&\\square&\\square\\\\\\square&\\square&\\square\\\\\\square&\\square&\\square\\end{pmatrix}',
                slots: 9,
                layout: 'mat',
                meta: { rows: 3, cols: 3 },
                build: (s) => {
                    const p = s.map((x) => x || '?');
                    return `mat([[${p[0]},${p[1]},${p[2]}],[${p[3]},${p[4]},${p[5]}],[${p[6]},${p[7]},${p[8]}]])`;
                },
            },
            {
                kind: 'template',
                id: 'mat44',
                label: '4×4',
                katex: '4\\times4',
                slots: 16,
                layout: 'mat',
                meta: { rows: 4, cols: 4 },
                build: (s) => {
                    const p = s.map((x) => x || '?');
                    const rows = [0, 1, 2, 3].map((r) => `[${p[r * 4]},${p[r * 4 + 1]},${p[r * 4 + 2]},${p[r * 4 + 3]}]`);
                    return `mat([${rows.join(',')}])`;
                },
            },
        ],
    },
    {
        id: 'trig',
        title: 'TRIGONOMETRIA',
        items: [
            { kind: 'insert', id: 'pi2', label: 'π', katex: '\\pi', insert: 'pi' },
            { kind: 'insert', id: 'deg', label: '°', katex: '^{\\circ}', insert: 'deg' },
            { kind: 'insert', id: 'rad', label: 'rad', katex: '\\mathrm{rad}', insert: 'rad' },
            u('sin', '\\sin\\square', 'sin'),
            u('cos', '\\cos\\square', 'cos'),
            u('tan', '\\tan\\square', 'tan'),
            u('sec', '\\sec\\square', 'sec'),
            u('csc', '\\csc\\square', 'csc'),
            u('cot', '\\cot\\square', 'cot'),
            u('asin', '\\sin^{-1}\\square', 'asin'),
            u('acos', '\\cos^{-1}\\square', 'acos'),
            u('atan', '\\tan^{-1}\\square', 'atan'),
            u('sinh', '\\sinh\\square', 'sinh'),
            u('cosh', '\\cosh\\square', 'cosh'),
            u('tanh', '\\tanh\\square', 'tanh'),
            u('sech', '\\mathrm{sech}\\square', 'sech'),
            u('csch', '\\mathrm{csch}\\square', 'csch'),
            u('coth', '\\coth\\square', 'coth'),
            u('asinh', '\\sinh^{-1}\\square', 'asinh'),
            u('acosh', '\\cosh^{-1}\\square', 'acosh'),
            u('atanh', '\\tanh^{-1}\\square', 'atanh'),
            u('asech', '\\mathrm{sech}^{-1}\\square', 'asech'),
            u('acsch', '\\mathrm{csch}^{-1}\\square', 'acsch'),
            u('acoth', '\\coth^{-1}\\square', 'acoth'),
        ],
    },
    {
        id: 'symbols',
        title: 'SZIMBÓLUMOK',
        items: [
            { kind: 'insert', id: 's_pi', label: 'π', katex: '\\pi', insert: 'pi' },
            { kind: 'insert', id: 's_deg', label: '°', katex: '^{\\circ}', insert: 'deg' },
            { kind: 'insert', id: 's_inf', label: '∞', katex: '\\infty', insert: 'inf' },
            { kind: 'insert', id: 'forall', label: '∀', katex: '\\forall', insert: 'forall' },
            { kind: 'insert', id: 'exists', label: '∃', katex: '\\exists', insert: 'exists' },
            { kind: 'insert', id: 'cup', label: '∪', katex: '\\cup', insert: '∪' },
            { kind: 'insert', id: 'cap', label: '∩', katex: '\\cap', insert: '∩' },
            { kind: 'insert', id: 'setminus', label: '\\', katex: '\\setminus', insert: '\\' },
            { kind: 'insert', id: 'setsemi', label: ';', katex: ';', insert: ';' },
            { kind: 'insert', id: 'subseteq', label: '⊆', katex: '\\subseteq', insert: '⊆' },
            { kind: 'insert', id: 'nabla', label: '∇', katex: '\\nabla', insert: 'nabla' },
            { kind: 'insert', id: 'Delta', label: 'Δ', katex: '\\Delta', insert: 'Delta' },
            { kind: 'insert', id: 'alpha', label: 'α', katex: '\\alpha', insert: 'alpha' },
            { kind: 'insert', id: 'beta', label: 'β', katex: '\\beta', insert: 'beta' },
            { kind: 'insert', id: 'gamma', label: 'γ', katex: '\\gamma', insert: 'gamma' },
            { kind: 'insert', id: 'delta', label: 'δ', katex: '\\delta', insert: 'delta' },
            { kind: 'insert', id: 'eps', label: 'ε', katex: '\\varepsilon', insert: 'eps' },
            { kind: 'insert', id: 'zeta', label: 'ζ', katex: '\\zeta', insert: 'zeta' },
            { kind: 'insert', id: 'eta', label: 'η', katex: '\\eta', insert: 'eta' },
            { kind: 'insert', id: 'theta', label: 'θ', katex: '\\theta', insert: 'theta' },
            { kind: 'insert', id: 'kappa', label: 'κ', katex: '\\kappa', insert: 'kappa' },
            { kind: 'insert', id: 'lambda', label: 'λ', katex: '\\lambda', insert: 'lambda' },
            { kind: 'insert', id: 'mu', label: 'μ', katex: '\\mu', insert: 'mu' },
            { kind: 'insert', id: 'nu', label: 'ν', katex: '\\nu', insert: 'nu' },
            { kind: 'insert', id: 'xi', label: 'ξ', katex: '\\xi', insert: 'xi' },
            { kind: 'insert', id: 'rho', label: 'ρ', katex: '\\rho', insert: 'rho' },
            { kind: 'insert', id: 'sigma', label: 'σ', katex: '\\sigma', insert: 'sigma' },
            { kind: 'insert', id: 'tau', label: 'τ', katex: '\\tau', insert: 'tau' },
            { kind: 'insert', id: 'phi', label: 'φ', katex: '\\varphi', insert: 'phi' },
            { kind: 'insert', id: 'chi', label: 'χ', katex: '\\chi', insert: 'chi' },
            { kind: 'insert', id: 'psi', label: 'ψ', katex: '\\psi', insert: 'psi' },
            { kind: 'insert', id: 'omega', label: 'ω', katex: '\\omega', insert: 'omega' },
            { kind: 'insert', id: 'Gamma', label: 'Γ', katex: '\\Gamma', insert: 'Gamma' },
            { kind: 'insert', id: 'Theta', label: 'Θ', katex: '\\Theta', insert: 'Theta' },
            { kind: 'insert', id: 'Lambda', label: 'Λ', katex: '\\Lambda', insert: 'Lambda' },
            { kind: 'insert', id: 'Xi', label: 'Ξ', katex: '\\Xi', insert: 'Xi' },
            { kind: 'insert', id: 'Upsilon', label: 'Υ', katex: '\\Upsilon', insert: 'Upsilon' },
            { kind: 'insert', id: 'Phi', label: 'Φ', katex: '\\Phi', insert: 'Phi' },
            { kind: 'insert', id: 'Psi', label: 'Ψ', katex: '\\Psi', insert: 'Psi' },
            { kind: 'insert', id: 'Omega', label: 'Ω', katex: '\\Omega', insert: 'Omega' },
            { kind: 'insert', id: 'hbar', label: 'ℏ', katex: '\\hbar', insert: 'hbar' },
            { kind: 'insert', id: 'aleph', label: 'ℵ', katex: '\\aleph', insert: 'aleph' },
            { kind: 'insert', id: 'to', label: '→', katex: '\\rightarrow', insert: '->' },
            { kind: 'insert', id: 'oplus', label: '⊕', katex: '\\oplus', insert: 'oplus' },
            { kind: 'insert', id: 'odot', label: '⊙', katex: '\\odot', insert: 'odot' },
            { kind: 'insert', id: 's_ne', label: '≠', katex: '\\ne', insert: '!=' },
            { kind: 'insert', id: 's_ge', label: '≥', katex: '\\ge', insert: '>=' },
            { kind: 'insert', id: 's_le', label: '≤', katex: '\\le', insert: '<=' },
            { kind: 'insert', id: 'in', label: '∈', katex: '\\in', insert: '∈' },
            { kind: 'insert', id: 'notin', label: '∉', katex: '\\notin', insert: '∉' },
            { kind: 'insert', id: 'subset', label: '⊂', katex: '\\subset', insert: '⊂' },
            { kind: 'insert', id: 'emptyset', label: '∅', katex: '\\emptyset', insert: '∅' },
        ],
    },
];

export function findTemplate(id: string): TemplateItem | undefined {
    for (const cat of MATH_CATEGORIES) {
        for (const item of cat.items) {
            if (item.kind === 'template' && item.id === id) return item;
        }
    }
    return undefined;
}

const structRow: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: '#dfffd8',
    fontSize: '1.1rem',
    fontWeight: 600,
};

/** Hatvány: alap a sorban, kitevő kisebb és feljebb (Wolfram-szerű). */
const powerWrap: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'flex-end',
    gap: 2,
    color: '#dfffd8',
    paddingTop: 12,
    paddingRight: 2,
};

const powerBase: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
};

const powerExp: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
    transform: 'translateY(-2px)',
};

const fracCol: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 40,
    padding: '2px 4px',
};

const fracLine: CSSProperties = {
    display: 'block',
    width: '100%',
    minWidth: 48,
    height: 2,
    background: '#39ff14',
    borderRadius: 1,
    alignSelf: 'stretch',
};

const tallOp: CSSProperties = {
    fontSize: '2rem',
    lineHeight: 1,
    color: '#39ff14',
    fontWeight: 400,
    alignSelf: 'center',
};

const scriptStack: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginRight: 6,
};

const limBlock: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10,
    lineHeight: 1.1,
};

const parenBig: CSSProperties = {
    fontSize: '1.7rem',
    lineHeight: 1,
    color: '#39ff14',
    alignSelf: 'stretch',
    display: 'inline-flex',
    alignItems: 'center',
};

const radical: CSSProperties = {
    fontSize: '2.1rem',
    lineHeight: 0.85,
    color: '#39ff14',
    fontWeight: 400,
    alignSelf: 'stretch',
    display: 'inline-flex',
    alignItems: 'flex-end',
    paddingBottom: 2,
};

const radicalBody: CSSProperties = {
    borderTop: '2.5px solid #39ff14',
    padding: '4px 8px 2px',
    minWidth: 44,
    minHeight: 36,
    display: 'inline-flex',
    alignItems: 'center',
    alignSelf: 'center',
};

const radicalWrap: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'flex-end',
    gap: 0,
    paddingLeft: 2,
    paddingTop: 10,
};

const radicalIndex: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    transform: 'translate(-10%, -15%)',
    display: 'inline-flex',
};

const labelFn: CSSProperties = {
    color: '#39ff14',
    fontWeight: 700,
    marginRight: 2,
};

/** Wolfram-szerű gyök: fok a √ bal felső sarkában, belsejében a radikandus. */
function RadicalVisual({
    index,
    radicand,
}: {
    index?: ReactNode;
    radicand: ReactNode;
}) {
    return (
        <span style={structRow}>
            <span style={radicalWrap}>
                {index != null ? <span style={radicalIndex}>{index}</span> : null}
                <span style={radical} aria-hidden>
                    √
                </span>
                <span style={radicalBody}>{radicand}</span>
            </span>
        </span>
    );
}

function DerivBlock({
    top,
    bottom,
    body,
}: {
    top: ReactNode;
    bottom: ReactNode;
    body: ReactNode;
}) {
    return (
        <span style={structRow}>
            <span style={fracCol}>
                {top}
                <span style={fracLine} />
                {bottom}
            </span>
            <span style={{ marginLeft: 8 }}>{body}</span>
        </span>
    );
}

/** Slot méret/szerep a layout + index alapján (a beviteli UI használja). */
export type SlotVisualRole = 'default' | 'compact' | 'wide' | 'base' | 'exp' | 'sub' | 'setlist';

export function getSlotVisualRole(layout: LayoutId, index: number): SlotVisualRole {
    switch (layout) {
        case 'frac':
            return 'wide';
        case 'power':
            return index === 0 ? 'base' : 'exp';
        case 'pow2':
            return 'base';
        case 'exp':
            return 'exp';
        case 'nthroot':
            return index === 0 ? 'compact' : 'wide';
        case 'sqrt':
        case 'cbrt':
        case 'abs':
        case 'unary':
        case 'piecewise':
            return 'wide';
        case 'set':
            return 'setlist';
        case 'logb':
            return index === 0 ? 'sub' : 'wide';
        case 'deriv':
        case 'deriv2':
        case 'pderiv':
        case 'pderiv2':
            return index === 0 ? 'sub' : 'wide';
        case 'pderivmix':
            return index < 2 ? 'sub' : 'wide';
        case 'integral':
            return index === 0 ? 'wide' : 'sub';
        case 'defint':
            if (index === 0 || index === 1 || index === 3) return 'compact';
            return 'wide';
        case 'sum':
        case 'prod':
            return index < 2 ? 'compact' : 'wide';
        case 'limit':
        case 'limitSide':
            return index < 2 ? 'compact' : 'wide';
        case 'vec':
        case 'col':
        case 'mat':
            return 'compact';
        default:
            return 'default';
    }
}

export function renderLayout(
    item: TemplateItem,
    boxes: ReactNode[]
): ReactNode {
    const side = String(item.meta?.side || '');
    const rows = Number(item.meta?.rows || 0);
    const cols = Number(item.meta?.cols || 0);
    const prefix = String(item.meta?.prefix || item.meta?.fn || '');

    switch (item.layout) {
        case 'frac':
            return (
                <span style={structRow}>
                    <span style={fracCol}>
                        {boxes[0]}
                        <span style={fracLine} />
                        {boxes[1]}
                    </span>
                </span>
            );
        case 'pow2':
            return (
                <span style={powerWrap}>
                    <span style={powerBase}>{boxes[0]}</span>
                    <span style={powerExp}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#39ff14', lineHeight: 1 }}>
                            2
                        </span>
                    </span>
                </span>
            );
        case 'power':
            return (
                <span style={powerWrap}>
                    <span style={powerBase}>{boxes[0]}</span>
                    <span style={powerExp}>{boxes[1]}</span>
                </span>
            );
        case 'sqrt':
            return <RadicalVisual radicand={boxes[0]} />;
        case 'cbrt':
            return (
                <RadicalVisual
                    index={
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#39ff14', lineHeight: 1 }}>
                            3
                        </span>
                    }
                    radicand={boxes[0]}
                />
            );
        case 'nthroot':
            return <RadicalVisual index={boxes[0]} radicand={boxes[1]} />;
        case 'abs':
            return (
                <span style={structRow}>
                    <span style={parenBig}>|</span>
                    <span style={{ padding: '0 4px' }}>{boxes[0]}</span>
                    <span style={parenBig}>|</span>
                </span>
            );
        case 'set':
            return (
                <span style={structRow}>
                    <span style={{ ...parenBig, fontSize: '2rem' }}>{'{'}</span>
                    <span style={{ padding: '0 6px', minWidth: 160 }}>{boxes[0]}</span>
                    <span style={{ ...parenBig, fontSize: '2rem' }}>{'}'}</span>
                </span>
            );
        case 'exp':
            return (
                <span style={powerWrap}>
                    <span style={{ ...powerBase, fontSize: '1.25rem', color: '#39ff14', fontWeight: 800 }}>e</span>
                    <span style={powerExp}>{boxes[0]}</span>
                </span>
            );
        case 'logb':
            return (
                <span style={structRow}>
                    <span style={labelFn}>log</span>
                    <sub style={{ display: 'inline-flex', marginRight: 2 }}>{boxes[0]}</sub>
                    <span>(</span>
                    {boxes[1]}
                    <span>)</span>
                </span>
            );
        case 'unary':
            return (
                <span style={structRow}>
                    <span style={labelFn}>{prefix || 'f'}</span>
                    <span>(</span>
                    {boxes[0]}
                    <span>)</span>
                </span>
            );
        case 'deriv':
            return (
                <DerivBlock
                    top={<span style={{ color: '#39ff14' }}>d</span>}
                    bottom={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ color: '#39ff14' }}>d</span>
                            {boxes[0]}
                        </span>
                    }
                    body={boxes[1]}
                />
            );
        case 'deriv2':
            return (
                <DerivBlock
                    top={<span style={{ color: '#39ff14' }}>d²</span>}
                    bottom={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ color: '#39ff14' }}>d</span>
                            {boxes[0]}
                            <sup style={{ color: '#39ff14' }}>2</sup>
                        </span>
                    }
                    body={boxes[1]}
                />
            );
        case 'pderiv':
            return (
                <DerivBlock
                    top={<span style={{ color: '#39ff14' }}>∂</span>}
                    bottom={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ color: '#39ff14' }}>∂</span>
                            {boxes[0]}
                        </span>
                    }
                    body={boxes[1]}
                />
            );
        case 'pderiv2':
            return (
                <DerivBlock
                    top={<span style={{ color: '#39ff14' }}>∂²</span>}
                    bottom={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ color: '#39ff14' }}>∂</span>
                            {boxes[0]}
                            <sup style={{ color: '#39ff14' }}>2</sup>
                        </span>
                    }
                    body={boxes[1]}
                />
            );
        case 'pderivmix':
            return (
                <DerivBlock
                    top={<span style={{ color: '#39ff14' }}>∂²</span>}
                    bottom={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ color: '#39ff14' }}>∂</span>
                            {boxes[0]}
                            <span style={{ color: '#39ff14' }}>∂</span>
                            {boxes[1]}
                        </span>
                    }
                    body={boxes[2]}
                />
            );
        case 'integral':
            return (
                <span style={{ ...structRow, alignItems: 'center' }}>
                    <span style={tallOp}>∫</span>
                    <span style={{ margin: '0 6px' }}>{boxes[0]}</span>
                    <span style={{ color: '#39ff14', marginRight: 2 }}>d</span>
                    {boxes[1]}
                </span>
            );
        case 'defint':
            return (
                <span style={{ ...structRow, alignItems: 'center', paddingTop: 4 }}>
                    <span style={tallOp}>∫</span>
                    <span style={scriptStack}>
                        <span>{boxes[1]}</span>
                        <span>{boxes[0]}</span>
                    </span>
                    <span style={{ margin: '0 6px' }}>{boxes[2]}</span>
                    <span style={{ color: '#39ff14', marginRight: 2 }}>d</span>
                    {boxes[3]}
                </span>
            );
        case 'sum':
        case 'prod':
            return (
                <span style={{ ...structRow, alignItems: 'center', paddingTop: 4 }}>
                    <span style={scriptStack}>
                        <span>{boxes[1]}</span>
                        <span style={{ ...tallOp, fontSize: '1.6rem' }}>
                            {item.layout === 'sum' ? 'Σ' : 'Π'}
                        </span>
                        <span>{boxes[0]}</span>
                    </span>
                    <span style={{ marginLeft: 4 }}>{boxes[2]}</span>
                </span>
            );
        case 'limit':
        case 'limitSide':
            return (
                <span style={structRow}>
                    <span style={limBlock}>
                        <span style={{ ...labelFn, fontSize: '1.05rem' }}>lim</span>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                marginTop: 2,
                            }}
                        >
                            {boxes[0]}
                            <span style={{ color: '#39ff14' }}>→</span>
                            {boxes[1]}
                            {side ? (
                                <sup style={{ color: '#39ff14', fontSize: '0.75rem' }}>{side}</sup>
                            ) : null}
                        </span>
                    </span>
                    {boxes[2]}
                </span>
            );
        case 'vec':
            return (
                <span style={structRow}>
                    <span style={parenBig}>[</span>
                    {boxes.map((b, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {i > 0 ? <span style={{ margin: '0 4px', color: '#39ff14' }}>,</span> : null}
                            {b}
                        </span>
                    ))}
                    <span style={parenBig}>]</span>
                </span>
            );
        case 'col':
            return (
                <span style={{ ...structRow, alignItems: 'center' }}>
                    <span style={parenBig}>[</span>
                    <span
                        style={{
                            display: 'inline-flex',
                            flexDirection: 'column',
                            gap: 4,
                            margin: '0 4px',
                        }}
                    >
                        {boxes}
                    </span>
                    <span style={parenBig}>]</span>
                </span>
            );
        case 'mat':
            return (
                <span style={{ ...structRow, alignItems: 'center' }}>
                    <span style={parenBig}>(</span>
                    <span
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${cols || 2}, auto)`,
                            gap: 6,
                            margin: '4px 6px',
                            alignItems: 'center',
                            justifyItems: 'center',
                        }}
                    >
                        {boxes}
                    </span>
                    <span style={parenBig}>)</span>
                </span>
            );
        case 'piecewise':
            return (
                <span style={{ ...structRow, alignItems: 'center' }}>
                    <span style={{ ...parenBig, fontSize: '2.2rem' }}>{'{'}</span>
                    <span
                        style={{
                            display: 'inline-flex',
                            flexDirection: 'column',
                            gap: 6,
                            marginLeft: 4,
                        }}
                    >
                        {boxes[0]}
                        {boxes[1]}
                    </span>
                </span>
            );
        default:
            return <span style={structRow}>{boxes}</span>;
    }
}
