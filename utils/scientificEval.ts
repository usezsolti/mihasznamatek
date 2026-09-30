export type AngleMode = 'deg' | 'rad';

export class ScientificEvalError extends Error {
    constructor(message = 'Hibás kifejezés') {
        super(message);
        this.name = 'ScientificEvalError';
    }
}

type Tok =
    | { k: 'num'; v: number }
    | { k: 'id'; v: string }
    | { k: 'op'; v: string }
    | { k: 'lp' }
    | { k: 'rp' }
    | { k: 'comma' };

const FN_NAMES = new Set([
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'sec', 'csc', 'cot',
    'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
    'sech', 'csch', 'coth',
    'log', 'log10', 'ln', 'sqrt', 'cbrt', 'root', 'abs',
]);

function toRad(x: number, mode: AngleMode): number {
    return mode === 'deg' ? (x * Math.PI) / 180 : x;
}

function fromRad(x: number, mode: AngleMode): number {
    return mode === 'deg' ? (x * 180) / Math.PI : x;
}

function finite(n: number): number {
    if (!Number.isFinite(n)) throw new ScientificEvalError();
    return n;
}

function applyFn(name: string, x: number, mode: AngleMode): number {
    switch (name) {
        case 'sin':
            return finite(Math.sin(toRad(x, mode)));
        case 'cos':
            return finite(Math.cos(toRad(x, mode)));
        case 'tan':
            return finite(Math.tan(toRad(x, mode)));
        case 'sec':
            return finite(1 / Math.cos(toRad(x, mode)));
        case 'csc':
            return finite(1 / Math.sin(toRad(x, mode)));
        case 'cot':
            return finite(1 / Math.tan(toRad(x, mode)));
        case 'sinh':
            return finite(Math.sinh(x));
        case 'cosh':
            return finite(Math.cosh(x));
        case 'tanh':
            return finite(Math.tanh(x));
        case 'asinh':
            return finite(Math.asinh(x));
        case 'acosh':
            if (x < 1) throw new ScientificEvalError();
            return finite(Math.acosh(x));
        case 'atanh':
            if (x <= -1 || x >= 1) throw new ScientificEvalError();
            return finite(Math.atanh(x));
        case 'sech':
            return finite(1 / Math.cosh(x));
        case 'csch':
            return finite(1 / Math.sinh(x));
        case 'coth':
            return finite(1 / Math.tanh(x));
        case 'asin':
            if (x < -1 || x > 1) throw new ScientificEvalError();
            return finite(fromRad(Math.asin(x), mode));
        case 'acos':
            if (x < -1 || x > 1) throw new ScientificEvalError();
            return finite(fromRad(Math.acos(x), mode));
        case 'atan':
            return finite(fromRad(Math.atan(x), mode));
        case 'log':
        case 'log10':
            if (x <= 0) throw new ScientificEvalError();
            return finite(Math.log10(x));
        case 'ln':
            if (x <= 0) throw new ScientificEvalError();
            return finite(Math.log(x));
        case 'sqrt':
            if (x < 0) throw new ScientificEvalError();
            return finite(Math.sqrt(x));
        case 'cbrt':
            return finite(Math.cbrt(x));
        case 'abs':
            return finite(Math.abs(x));
        default:
            throw new ScientificEvalError();
    }
}

function nthRoot(degree: number, x: number): number {
    if (degree === 0) throw new ScientificEvalError();
    if (x < 0) {
        const n = Math.round(degree);
        if (Math.abs(degree - n) > 1e-9 || n % 2 === 0) throw new ScientificEvalError();
        return finite(-Math.pow(-x, 1 / n));
    }
    return finite(Math.pow(x, 1 / degree));
}

function applyCall(name: string, args: number[], mode: AngleMode): number {
    if (name === 'root') {
        if (args.length !== 2) throw new ScientificEvalError();
        return nthRoot(args[0], args[1]);
    }
    if (name === 'log' && args.length === 2) {
        const [base, x] = args;
        if (base <= 0 || base === 1 || x <= 0) throw new ScientificEvalError();
        return finite(Math.log(x) / Math.log(base));
    }
    if (args.length !== 1) throw new ScientificEvalError();
    return applyFn(name, args[0], mode);
}

function factorial(x: number): number {
    if (x < 0 || x > 170 || Math.abs(x - Math.round(x)) > 1e-9) throw new ScientificEvalError();
    let n = Math.round(x);
    let acc = 1;
    for (let i = 2; i <= n; i++) acc *= i;
    return finite(acc);
}

function commaIsDecimal(s: string, i: number): boolean {
    if (s[i] !== ',' || !/[0-9]/.test(s[i - 1] || '') || !/[0-9]/.test(s[i + 1] || '')) return false;
    let depth = 0;
    for (let k = i - 1; k >= 0; k--) {
        const ch = s[k];
        if (ch === ')') depth++;
        else if (ch === '(') {
            if (depth === 0) {
                let j = k - 1;
                while (j >= 0 && /[a-zA-Z]/.test(s[j])) j--;
                const name = s.slice(j + 1, k).toLowerCase();
                return name !== 'root' && name !== 'log';
            }
            depth--;
        }
    }
    return true;
}

function tokenize(input: string): Tok[] {
    const s = input.trim().replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    const out: Tok[] = [];
    let i = 0;
    while (i < s.length) {
        const c = s[i];
        if (c === ' ' || c === '\t' || c === '\n') {
            i++;
            continue;
        }
        if (c === '(') {
            out.push({ k: 'lp' });
            i++;
            continue;
        }
        if (c === ')') {
            out.push({ k: 'rp' });
            i++;
            continue;
        }
        if (c === ',') {
            out.push({ k: 'comma' });
            i++;
            continue;
        }
        if ('+-*/^!%'.includes(c)) {
            out.push({ k: 'op', v: c });
            i++;
            continue;
        }
        if (/[0-9.]/.test(c) || (c === ',' && commaIsDecimal(s, i))) {
            let j = i;
            let sawDigit = false;
            let sawSep = false;
            while (j < s.length && (/[0-9.]/.test(s[j]) || (s[j] === ',' && commaIsDecimal(s, j)))) {
                if (s[j] === '.' || s[j] === ',') {
                    if (sawSep) break;
                    sawSep = true;
                } else sawDigit = true;
                j++;
            }
            if (!sawDigit) throw new ScientificEvalError();
            const raw = s.slice(i, j).replace(',', '.');
            const v = Number(raw);
            if (!Number.isFinite(v)) throw new ScientificEvalError();
            out.push({ k: 'num', v });
            i = j;
            continue;
        }
        if (/[a-zA-Z]/.test(c)) {
            let j = i + 1;
            while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
            out.push({ k: 'id', v: s.slice(i, j).toLowerCase() });
            i = j;
            continue;
        }
        throw new ScientificEvalError();
    }
    return out;
}

class Parser {
    private i = 0;
    private toks: Tok[];
    private mode: AngleMode;

    constructor(toks: Tok[], mode: AngleMode) {
        this.toks = toks;
        this.mode = mode;
    }

    parse(): number {
        if (!this.toks.length) throw new ScientificEvalError();
        const v = this.expr();
        if (this.i < this.toks.length) throw new ScientificEvalError();
        return finite(v);
    }

    private peek(): Tok | null {
        return this.i < this.toks.length ? this.toks[this.i] : null;
    }

    private eat(): Tok {
        const t = this.peek();
        if (!t) throw new ScientificEvalError();
        this.i++;
        return t;
    }

    private expr(): number {
        let v = this.term();
        for (;;) {
            const t = this.peek();
            if (t?.k !== 'op' || (t.v !== '+' && t.v !== '-')) break;
            this.eat();
            const r = this.term();
            v = finite(t.v === '+' ? v + r : v - r);
        }
        return v;
    }

    private term(): number {
        let v = this.power();
        for (;;) {
            const t = this.peek();
            if (t?.k !== 'op' || (t.v !== '*' && t.v !== '/')) break;
            this.eat();
            const r = this.power();
            if (t.v === '/' && r === 0) throw new ScientificEvalError();
            v = finite(t.v === '*' ? v * r : v / r);
        }
        return v;
    }

    private power(): number {
        const base = this.unary();
        const t = this.peek();
        if (t?.k === 'op' && t.v === '^') {
            this.eat();
            return finite(Math.pow(base, this.power()));
        }
        return base;
    }

    private unary(): number {
        const t = this.peek();
        if (t?.k === 'op' && t.v === '-') {
            this.eat();
            return finite(-this.unary());
        }
        if (t?.k === 'op' && t.v === '+') {
            this.eat();
            return this.unary();
        }
        return this.postfix();
    }

    private postfix(): number {
        let v = this.primary();
        for (;;) {
            const t = this.peek();
            if (t?.k !== 'op' || (t.v !== '!' && t.v !== '%')) break;
            this.eat();
            v = t.v === '!' ? factorial(v) : finite(v / 100);
        }
        return v;
    }

    private primary(): number {
        const t = this.peek();
        if (!t) throw new ScientificEvalError();
        if (t.k === 'num') {
            this.eat();
            return t.v;
        }
        if (t.k === 'lp') {
            this.eat();
            const v = this.expr();
            const close = this.eat();
            if (close.k !== 'rp') throw new ScientificEvalError();
            return v;
        }
        if (t.k === 'id') {
            this.eat();
            const next = this.peek();
            if (next?.k === 'lp') {
                if (!FN_NAMES.has(t.v)) throw new ScientificEvalError();
                this.eat();
                const args = [this.expr()];
                while (this.peek()?.k === 'comma') {
                    this.eat();
                    args.push(this.expr());
                }
                const close = this.eat();
                if (close.k !== 'rp') throw new ScientificEvalError();
                return applyCall(t.v, args, this.mode);
            }
            if (t.v === 'pi') return Math.PI;
            if (t.v === 'e') return Math.E;
            throw new ScientificEvalError();
        }
        throw new ScientificEvalError();
    }
}

export function evaluateScientific(input: string, mode: AngleMode = 'deg'): number {
    return new Parser(tokenize(input), mode).parse();
}

export function formatScientific(n: number): string {
    if (!Number.isFinite(n)) throw new ScientificEvalError();
    const rounded = Math.round(n * 1e10) / 1e10;
    return String(rounded).replace('.', ',');
}
