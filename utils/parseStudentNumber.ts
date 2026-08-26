/**
 * Diák válasz szöveg → szám.
 * Támogat beágyazott sablonokat is: abs(sqrt(9)), (1)/(2), root(2,sqrt(9))…
 */
export function parseStudentNumber(raw: string): number {
    const s0 = String(raw || '').trim();
    if (!s0) return NaN;
    return evalExpr(
        s0
            .replace(/\s+/g, '')
            .replace(/π/g, 'pi')
            .replace(/∞/g, 'inf')
    );
}

function evalExpr(s: string): number {
    if (!s || s === '?') return NaN;

    if (s === 'pi') return Math.PI;
    if (s === 'e') return Math.E;
    if (s === 'inf' || s === '+inf') return Infinity;
    if (s === '-inf') return -Infinity;

    // Európai tizedes: "3,5" — de NE cseréljük a függvény-argumentum vesszőket (root(2,16))
    if (/^-?\d+,\d+$/.test(s)) {
        s = s.replace(',', '.');
    }

    const direct = Number(s);
    if (Number.isFinite(direct)) return direct;

    // strip outer parens
    if (s.startsWith('(') && s.endsWith(')') && balanced(s.slice(1, -1))) {
        return evalExpr(s.slice(1, -1));
    }

    // a/b  or (a)/(b)
    {
        const parts = splitTop(s, '/');
        if (parts && parts.length === 2) {
            const a = evalExpr(parts[0]);
            const b = evalExpr(parts[1]);
            if (!Number.isFinite(b) || b === 0) return NaN;
            return a / b;
        }
    }

    // a^b
    {
        const parts = splitTop(s, '^');
        if (parts && parts.length === 2) {
            return Math.pow(evalExpr(parts[0]), evalExpr(parts[1]));
        }
    }

    const fn1 = s.match(
        /^(sqrt|cbrt|abs|ln|log10|log|sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|sec|csc|cot)\((.+)\)$/i
    );
    if (fn1 && balanced(fn1[2])) {
        const inner = evalExpr(fn1[2]);
        const name = fn1[1].toLowerCase();
        const map: Record<string, (x: number) => number> = {
            sqrt: Math.sqrt,
            cbrt: Math.cbrt,
            abs: Math.abs,
            ln: Math.log,
            log10: Math.log10,
            log: Math.log10,
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            asin: Math.asin,
            acos: Math.acos,
            atan: Math.atan,
            sinh: Math.sinh,
            cosh: Math.cosh,
            tanh: Math.tanh,
            asinh: Math.asinh,
            acosh: Math.acosh,
            atanh: Math.atanh,
            sec: (x) => 1 / Math.cos(x),
            csc: (x) => 1 / Math.sin(x),
            cot: (x) => 1 / Math.tan(x),
        };
        const fn = map[name];
        return fn ? fn(inner) : NaN;
    }

    // root(n,a) | log(b,a) | e^(x)
    const root = s.match(/^root\((.+)\)$/i);
    if (root && balanced(root[1])) {
        const parts = splitTop(root[1], ',');
        if (parts && parts.length === 2) {
            const n = evalExpr(parts[0]);
            const a = evalExpr(parts[1]);
            if (!Number.isFinite(n) || n === 0) return NaN;
            return Math.pow(a, 1 / n);
        }
    }

    const logb = s.match(/^log\((.+)\)$/i);
    if (logb && balanced(logb[1])) {
        const parts = splitTop(logb[1], ',');
        if (parts && parts.length === 2) {
            const b = evalExpr(parts[0]);
            const a = evalExpr(parts[1]);
            if (!(b > 0) || b === 1 || !(a > 0)) return NaN;
            return Math.log(a) / Math.log(b);
        }
    }

    const exp = s.match(/^e\^\((.+)\)$/i);
    if (exp && balanced(exp[1])) return Math.exp(evalExpr(exp[1]));

    return NaN;
}

function balanced(s: string): boolean {
    let d = 0;
    for (const ch of s) {
        if (ch === '(') d++;
        else if (ch === ')') d--;
        if (d < 0) return false;
    }
    return d === 0;
}

/** Split by operator at top paren level (not inside nested ()). */
function splitTop(s: string, op: string): string[] | null {
    let d = 0;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === '(') d++;
        else if (ch === ')') d--;
        else if (d === 0 && s.startsWith(op, i)) {
            // avoid matching unary - etc for /
            const left = s.slice(0, i);
            const right = s.slice(i + op.length);
            if (!left || !right) return null;
            return [left, right];
        }
    }
    return null;
}
