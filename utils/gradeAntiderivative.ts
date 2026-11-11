/**
 * Primitív függvény ellenőrzése deriválással, és zárt képlet kiértékelése.
 * A +C és bármely konstans eltérés nem számít hibának.
 */

type Node =
    | { k: 'n'; v: number }
    | { k: 'x' }
    | { k: 'e' }
    | { k: 'pi' }
    | { k: 'neg'; a: Node }
    | { k: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: Node; b: Node }
    | { k: 'call'; f: string; args: Node[] };

const FNS = [
    'arcsin', 'arccos', 'arctan', 'arctg', 'asin', 'acos', 'atan',
    'sqrt', 'abs', 'exp', 'sin', 'cos', 'tan', 'tg', 'ctg', 'cot',
    'sec', 'csc', 'ln', 'log',
];

const SUP: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
};

function matchParen(s: string, open: number): number {
    let d = 0;
    for (let i = open; i < s.length; i++) {
        if (s[i] === '(') d++;
        else if (s[i] === ')') {
            d--;
            if (d === 0) return i;
        }
    }
    return -1;
}

/** A betűk közötti szóközt megtartja (x cos), a többit törli. */
function keepSpacesBetweenWords(s: string): string {
    let out = '';
    for (let i = 0; i < s.length; i++) {
        if (s[i] !== ' ' && s[i] !== '\t') {
            out += s[i];
            continue;
        }
        let j = i;
        while (s[j] === ' ' || s[j] === '\t') j++;
        const prev = out[out.length - 1] || '';
        const next = s[j] || '';
        if (/[a-z]/.test(prev) && /[a-z]/.test(next)) out += ' ';
        i = j - 1;
    }
    return out;
}

/** √x és 2√x → sqrt(x), a zárójeles √(...) marad. */
function wrapBareSqrt(s: string): string {
    let out = '';
    let i = 0;
    while (i < s.length) {
        if (s.startsWith('sqrt', i) && s[i + 4] !== '(') {
            let j = i + 4;
            let atom = '';
            while (/[a-z0-9.]/.test(s[j] || '')) {
                atom += s[j];
                j++;
            }
            out += atom ? `sqrt(${atom})` : 'sqrt';
            i = j;
            continue;
        }
        out += s[i];
        i++;
    }
    return out;
}

function rewriteFnPowers(s: string): string {
    let out = '';
    let i = 0;
    while (i < s.length) {
        const fn = FNS.find((name) => s.startsWith(`${name}^`, i));
        if (!fn) {
            out += s[i];
            i++;
            continue;
        }
        let j = i + fn.length + 1;
        let exp = '';
        if (s[j] === '(') {
            const end = matchParen(s, j);
            if (end < 0) {
                out += s[i];
                i++;
                continue;
            }
            exp = s.slice(j + 1, end);
            j = end + 1;
        } else {
            while (j < s.length && /[0-9.]/.test(s[j])) {
                exp += s[j];
                j++;
            }
        }
        if (!exp || s[j] !== '(') {
            out += s[i];
            i++;
            continue;
        }
        const endArg = matchParen(s, j);
        if (endArg < 0) {
            out += s[i];
            i++;
            continue;
        }
        const arg = s.slice(j + 1, endArg);
        out += `((${fn}(${arg}))^(${exp}))`;
        i = endArg + 1;
    }
    return out;
}

export function normalizeMathExpr(raw: string): string {
    let s = String(raw || '').trim().toLowerCase();
    if (!s) return '';
    s = s.normalize('NFD').replace(/\p{M}/gu, '');
    s = s.replace(/[−–—]/g, '-');
    s = s.replace(/[×·∙]/g, '*');
    s = s.replace(/÷/g, '/');
    s = s.replace(/π/g, 'pi');
    s = s.replace(/ˣ/g, '^x');
    s = s.replace(/√/g, 'sqrt');
    s = keepSpacesBetweenWords(s);
    s = wrapBareSqrt(s);
    s = s.replace(/\*\*/g, '^');
    s = s.replace(/⁻[⁰¹²³⁴⁵⁶⁷⁸⁹]+|[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => {
        const neg = m.startsWith('⁻');
        const digits = [...(neg ? m.slice(1) : m)].map((ch) => SUP[ch] || '').join('');
        return neg ? `^(-${digits})` : `^(${digits})`;
    });
    s = rewriteFnPowers(s);
    let prev = '';
    while (s !== prev) {
        prev = s;
        s = s.replace(/(\+|-)(c|k|konstans)$/, '');
    }
    return s;
}

class Parser {
    i = 0;
    afterSep = false;
    /** Abszolútérték belsejében a záró | nem új tényező. */
    private absDepth = 0;
    constructor(private s: string) {}

    get c(): string {
        while (this.s[this.i] === ' ') this.i++;
        return this.s[this.i] || '';
    }

    parseExpr(): Node {
        let node = this.parseTerm();
        while (this.c === '+' || this.c === '-') {
            const op = this.c as '+' | '-';
            this.i++;
            this.afterSep = false;
            node = { k: 'bin', op, a: node, b: this.parseTerm() };
        }
        return node;
    }

    private parseTerm(): Node {
        let node = this.parseUnary();
        while (true) {
            if (this.c === '*' || this.c === '/') {
                const op = this.c as '*' | '/';
                this.i++;
                this.afterSep = false;
                node = { k: 'bin', op, a: node, b: this.parseUnary() };
                continue;
            }
            if (this.startsPrimary()) {
                node = { k: 'bin', op: '*', a: node, b: this.parseUnary() };
                continue;
            }
            return node;
        }
    }

    /** A hatvány erősebb, mint az előjel: −x² = −(x²), x^−2 pedig negatív kitevő. */
    private parsePow(): Node {
        const base = this.parsePrimary();
        if (this.c !== '^') return base;
        this.i++;
        this.afterSep = false;
        return { k: 'bin', op: '^', a: base, b: this.parseUnary() };
    }

    private parseUnary(): Node {
        if (this.c === '+') {
            this.i++;
            return this.parseUnary();
        }
        if (this.c === '-') {
            this.i++;
            return { k: 'neg', a: this.parseUnary() };
        }
        return this.parsePow();
    }

    private startsPrimary(): boolean {
        if (this.absDepth > 0 && this.c === '|') return false;
        return /[0-9a-z.(|]/.test(this.c);
    }

    private parsePrimary(): Node {
        if (this.c === '(') {
            this.i++;
            this.afterSep = true;
            const node = this.parseExpr();
            if (this.c !== ')') throw new Error('paren');
            this.i++;
            this.afterSep = false;
            return node;
        }
        if (this.c === '|') return this.parseAbs();
        if (/[0-9.]/.test(this.c)) return this.parseNumber();
        if (/[a-z]/.test(this.c)) {
            const start = this.i;
            while (/[a-z]/.test(this.s[this.i] || '')) this.i++;
            const id = this.s.slice(start, this.i);
            const callable = FNS.includes(id) || id === 'root';
            if (callable && (this.c === '(' || this.c === '|')) {
                const arg = this.c === '|' ? this.parseAbs() : this.parseCallArgs();
                const args = this.c === '' && arg.k === 'call' && false ? [] : [arg];
                if (id === 'root' || id === 'log') {
                    return this.parseMaybeTwoArg(id, arg);
                }
                return { k: 'call', f: id, args };
            }
            this.afterSep = false;
            if (id === 'x') return { k: 'x' };
            if (id === 'e') return { k: 'e' };
            if (id === 'pi') return { k: 'pi' };
            throw new Error(id);
        }
        throw new Error(`primary@${this.i}:${JSON.stringify(this.s.slice(Math.max(0, this.i - 6), this.i + 8))}`);
    }

    /** root(n,a) és log(b,a); az első argumentum már kész. */
    private parseMaybeTwoArg(id: string, first: Node): Node {
        if (this.c === ',') {
            this.i++;
            this.afterSep = true;
            const second = this.parseExpr();
            if (this.c !== ')') throw new Error('call');
            this.i++;
            this.afterSep = false;
            return { k: 'call', f: id, args: [first, second] };
        }
        return { k: 'call', f: id, args: [first] };
    }

    private parseCallArgs(): Node {
        this.i++;
        this.afterSep = true;
        const first = this.parseExpr();
        if (this.c === ',') return first;
        if (this.c !== ')') throw new Error('call');
        this.i++;
        this.afterSep = false;
        return first;
    }

    private parseAbs(): Node {
        this.i++;
        this.afterSep = false;
        this.absDepth++;
        const inner = this.parseExpr();
        this.absDepth--;
        if (this.c !== '|') throw new Error(`abs@${this.i}:${JSON.stringify(this.s.slice(Math.max(0, this.i - 8), this.i + 8))}`);
        this.i++;
        this.afterSep = false;
        return { k: 'call', f: 'abs', args: [inner] };
    }

    private parseNumber(): Node {
        const start = this.i;
        while (/[0-9]/.test(this.s[this.i] || '')) this.i++;
        const decimalOk = !this.afterSep && this.c === ',' && /[0-9]/.test(this.s[this.i + 1] || '');
        if (this.c === '.' || decimalOk) {
            this.i++;
            while (/[0-9]/.test(this.c)) this.i++;
        }
        const raw = this.s.slice(start, this.i).replace(',', '.');
        this.afterSep = false;
        const v = Number(raw);
        if (!Number.isFinite(v)) throw new Error('num');
        return { k: 'n', v };
    }
}

function evalNode(node: Node, x: number): number {
    switch (node.k) {
        case 'n':
            return node.v;
        case 'x':
            return x;
        case 'e':
            return Math.E;
        case 'pi':
            return Math.PI;
        case 'neg':
            return -evalNode(node.a, x);
        case 'bin': {
            const a = evalNode(node.a, x);
            const b = evalNode(node.b, x);
            if (node.op === '+') return a + b;
            if (node.op === '-') return a - b;
            if (node.op === '*') return a * b;
            if (node.op === '/') return b === 0 ? NaN : a / b;
            return Math.pow(a, b);
        }
        case 'call':
            return evalCall(node.f, node.args, x);
        default:
            return NaN;
    }
}

function evalCall(name: string, args: Node[], x: number): number {
    const a = args.map((arg) => evalNode(arg, x));
    const u = a[0];
    switch (name) {
        case 'sin': return Math.sin(u);
        case 'cos': return Math.cos(u);
        case 'tan':
        case 'tg': return Math.tan(u);
        case 'cot':
        case 'ctg': return 1 / Math.tan(u);
        case 'sec': return 1 / Math.cos(u);
        case 'csc': return 1 / Math.sin(u);
        case 'ln': return Math.log(u);
        case 'log':
            if (args.length === 2) return Math.log(a[1]) / Math.log(u);
            return Math.log(u);
        case 'sqrt': return Math.sqrt(u);
        case 'abs': return Math.abs(u);
        case 'exp': return Math.exp(u);
        case 'arcsin':
        case 'asin': return Math.asin(u);
        case 'arccos':
        case 'acos': return Math.acos(u);
        case 'arctan':
        case 'atan':
        case 'arctg': return Math.atan(u);
        case 'root':
            return a.length === 2 && a[0] !== 0 ? Math.pow(a[1], 1 / a[0]) : NaN;
        default:
            return NaN;
    }
}

export function explainMathExpr(raw: string, x = 0): string {
    try {
        const s = normalizeMathExpr(raw);
        if (!s) return 'empty';
        const parser = new Parser(s);
        const node = parser.parseExpr();
        if (parser.i !== s.length) return `tail:${s.slice(parser.i)} i=${parser.i} len=${s.length}`;
        const value = evalNode(node, x);
        return Number.isFinite(value) ? String(value) : 'nan-value';
    } catch (error) {
        return error instanceof Error ? error.message : 'err';
    }
}

export function evalMathExpr(raw: string, x = 0): number {
    const explained = explainMathExpr(raw, x);
    const value = Number(explained);
    return Number.isFinite(value) ? value : NaN;
}

/** A beírt F deriváltja egyezik-e az integrandussal a mintapontokon. */
export function antiderivativeMatches(raw: string, integrand: string, samples: number[]): boolean {
    if (!samples.length || !normalizeMathExpr(raw)) return false;
    const h = 1e-4;
    for (const x of samples) {
        const f = evalMathExpr(integrand, x);
        const right = evalMathExpr(raw, x + h);
        const left = evalMathExpr(raw, x - h);
        if (![f, right, left].every(Number.isFinite)) return false;
        const slope = (right - left) / (2 * h);
        const tol = Math.max(1e-3, 2e-3 * Math.abs(f));
        if (Math.abs(slope - f) > tol) return false;
    }
    return true;
}
