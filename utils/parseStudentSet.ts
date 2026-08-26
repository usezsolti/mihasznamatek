/**
 * Diák halmazválasz: {1; 2; 3}, {1, 2, 3}, 1;2;3, ∅, nested {a;b}.
 * Sorrend nem számít.
 */

function splitTopLevel(s: string): string[] {
    const out: string[] = [];
    let buf = '';
    let brace = 0;
    let paren = 0;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === '{') brace++;
        else if (ch === '}') brace--;
        else if (ch === '(') paren++;
        else if (ch === ')') paren--;
        const sep = (ch === ';' || ch === ',') && brace === 0 && paren === 0;
        if (sep) {
            if (buf.trim()) out.push(buf.trim());
            buf = '';
            continue;
        }
        buf += ch;
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
}

export function canonSetToken(raw: string): string {
    let t = String(raw || '')
        .trim()
        .replace(/[−–—]/g, '-')
        .replace(/\s+/g, '');
    t = t.replace(/^(emptyset|empty|varnothing)$/i, '∅');
    if (t === '{}' || t === '∅') return '∅';

    if (t.startsWith('{') && t.endsWith('}') && t.length >= 2) {
        const inner = parseStudentSet(t);
        if (!inner) return t.toLowerCase();
        if (inner.length === 0) return '∅';
        return `{${[...inner].sort().join(';')}}`;
    }

    if (t.startsWith('(') && t.endsWith(')') && t.length >= 2) {
        const parts = splitTopLevel(t.slice(1, -1)).map(canonSetToken);
        return `(${parts.join(',')})`;
    }

    return t.toLowerCase();
}

export function parseStudentSet(raw: string): string[] | null {
    let s = String(raw || '').trim();
    if (!s) return null;
    s = s.replace(/^P\s*\([^)]*\)\s*=\s*/i, '');
    const packed = s.replace(/\s+/g, '');
    if (/^set\(/i.test(packed) && packed.endsWith(')')) {
        s = `{${s.replace(/^set\s*\(/i, '').replace(/\)\s*$/, '')}}`;
    }
    s = s.replace(/[−–—]/g, '-');
    if (/^(emptyset|empty|varnothing|∅|\{\})$/i.test(s.replace(/\s+/g, ''))) {
        return [];
    }

    let inner = s.trim();
    if (inner.startsWith('{') && inner.endsWith('}')) {
        inner = inner.slice(1, -1).trim();
    }
    if (!inner) return [];

    const parts = splitTopLevel(inner);
    if (parts.length === 0) return [];
    return parts.map(canonSetToken);
}

export function studentSetMatches(raw: string, expected: string[]): boolean {
    const got = parseStudentSet(raw);
    if (!got) return false;
    const a = [...got].sort();
    const b = expected.map(canonSetToken).sort();
    if (a.length !== b.length) return false;
    return a.every((x, i) => x === b[i]);
}
