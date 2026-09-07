import { Fragment, type ReactNode } from 'react';
import { agentDebugLog } from './agentDebugLog';

const SCRIPT = /_\{([^}]+)\}|_([A-Za-z0-9]+)|\^\{([^}]+)\}|\^([A-Za-z0-9]+)/g;
const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿⁱ¹²³';
const SUB = '₀₁₂₃₄₅₆₇₈₉ₙ';
const ATOM = /[A-Za-z0-9π∞εθλωαβγΔ√∫ℓℚℝℂℕℤ'!.,]|[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿⁱ₁₂₃₄₅₆₇₈₉ₙ₀]/;

function isAtom(c: string): boolean {
    return ATOM.test(c) || SUPER.includes(c) || SUB.includes(c) || c === '+' || c === '-' || c === '−' || c === '*';
}

function isSlash(c: string): boolean {
    return c === '/' || c === '∕' || c === '⁄' || c === '／';
}

function isBreaker(c: string): boolean {
    return ' \t\n=<>?,;:·×÷±+−–'.includes(c) || c === '-';
}

function looksLikeMath(t: string): boolean {
    const s = t.trim();
    if (!s || s.length > 64) return false;
    if (/[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(s)) return false;
    if (/^(igen|nem|vagy|az|egy|es|és|http|https)$/i.test(s)) return false;
    if (/[0-9^_|()[\]{}!√∞π∑∫ℓℚℝℂℕℤ²³¹₀-₉]/.test(s)) return true;
    if (/^(sin|cos|tan|cot|ctg|ln|log|lim|sup|inf|max|min|Re|Im|abs|det|tr|exp)$/i.test(s)) {
        return true;
    }
    return /^[A-Za-z]{1,4}!*$/.test(s);
}

function consumeScriptRight(s: string, i: number): number {
    if (s[i] !== '_' && s[i] !== '^') return i;
    i += 1;
    if (s[i] === '{') {
        let d = 1;
        i += 1;
        while (i < s.length && d > 0) {
            if (s[i] === '{') d += 1;
            else if (s[i] === '}') d -= 1;
            i += 1;
        }
        return i;
    }
    while (i < s.length && /[A-Za-z0-9]/.test(s[i])) i += 1;
    return i;
}

function consumeScriptLeft(s: string, i: number): number {
    if (s[i] === '}') {
        let d = 1;
        i -= 1;
        while (i >= 0 && d > 0) {
            if (s[i] === '}') d += 1;
            else if (s[i] === '{') d -= 1;
            i -= 1;
        }
        if (s[i] === '_' || s[i] === '^') i -= 1;
        return i;
    }
    return i;
}

function takeRight(s: string, start: number): { text: string; end: number } | null {
    let i = start;
    while (i < s.length && (s[i] === ' ' || s[i] === '\t')) i += 1;
    if (i >= s.length) return null;
    const from = i;
    let depth = 0;
    let brace = 0;
    const startedBar = s[i] === '|';
    while (i < s.length) {
        const c = s[i];
        if (c === '{') {
            brace += 1;
            i += 1;
            continue;
        }
        if (c === '}') {
            if (brace === 0) break;
            brace -= 1;
            i += 1;
            continue;
        }
        if (c === '(' || c === '[') {
            depth += 1;
            i += 1;
            continue;
        }
        if (c === ')' || c === ']') {
            if (depth === 0) break;
            depth -= 1;
            i += 1;
            continue;
        }
        if (c === '|') {
            i += 1;
            if (startedBar && depth === 0 && brace === 0) break;
            continue;
        }
        if (c === '_' || c === '^') {
            i = consumeScriptRight(s, i);
            continue;
        }
        if (depth === 0 && brace === 0 && isBreaker(c)) break;
        if (isAtom(c)) {
            i += 1;
            continue;
        }
        break;
    }
    const text = s.slice(from, i);
    if (!looksLikeMath(text)) return null;
    return { text, end: i };
}

function takeLeft(s: string, end: number): { text: string; start: number } | null {
    let i = end - 1;
    while (i >= 0 && (s[i] === ' ' || s[i] === '\t')) i -= 1;
    if (i < 0) return null;
    const to = i + 1;
    let depth = 0;
    let brace = 0;
    const startedBar = s[i] === '|';
    while (i >= 0) {
        const c = s[i];
        if (c === '}') {
            brace += 1;
            i = consumeScriptLeft(s, i);
            continue;
        }
        if (c === '{') {
            if (brace === 0) break;
            brace -= 1;
            i -= 1;
            continue;
        }
        if (c === ')' || c === ']') {
            depth += 1;
            i -= 1;
            continue;
        }
        if (c === '(' || c === '[') {
            if (depth === 0) break;
            depth -= 1;
            i -= 1;
            continue;
        }
        if (c === '|') {
            i -= 1;
            if (startedBar && depth === 0 && brace === 0) break;
            continue;
        }
        if (c === '_' || c === '^') {
            i -= 1;
            continue;
        }
        if (depth === 0 && brace === 0 && isBreaker(c)) break;
        if (isAtom(c)) {
            i -= 1;
            continue;
        }
        break;
    }
    const text = s.slice(i + 1, to);
    if (!looksLikeMath(text)) return null;
    return { text, start: i + 1 };
}

type Chunk =
    | { kind: 'text'; value: string }
    | { kind: 'frac'; num: string; den: string };

function nextSlash(src: string, from: number): number {
    for (let i = from; i < src.length; i++) {
        if (isSlash(src[i])) return i;
    }
    return -1;
}

function splitFractions(src: string): Chunk[] {
    const out: Chunk[] = [];
    let i = 0;
    while (i < src.length) {
        const slash = nextSlash(src, i);
        if (slash < 0) {
            out.push({ kind: 'text', value: src.slice(i) });
            break;
        }
        const left = takeLeft(src, slash);
        const right = takeRight(src, slash + 1);
        if (!left || !right) {
            // #region agent log
            agentDebugLog({
                hypothesisId: 'B',
                location: 'formatMathText.tsx:splitFractions',
                message: 'slash not converted',
                data: {
                    left: left?.text || null,
                    right: right?.text || null,
                    around: src.slice(Math.max(0, slash - 12), slash + 12),
                },
                runId: 'math-frac',
            });
            // #endregion
        }
        if (left && right) {
            if (left.start > i) out.push({ kind: 'text', value: src.slice(i, left.start) });
            out.push({ kind: 'frac', num: left.text, den: right.text });
            i = right.end;
            continue;
        }
        out.push({ kind: 'text', value: src.slice(i, slash + 1) });
        i = slash + 1;
    }
    return out;
}

function formatScripts(text: string): ReactNode {
    const nodes: ReactNode[] = [];
    let last = 0;
    let key = 0;
    SCRIPT.lastIndex = 0;
    let m: RegExpExecArray | null;
    const src = String(text);
    while ((m = SCRIPT.exec(src))) {
        if (m.index > last) nodes.push(src.slice(last, m.index));
        if (m[1] != null || m[2] != null) {
            nodes.push(<sub key={`s${key++}`}>{m[1] ?? m[2]}</sub>);
        } else {
            nodes.push(<sup key={`p${key++}`}>{m[3] ?? m[4]}</sup>);
        }
        last = m.index + m[0].length;
    }
    if (last < src.length) nodes.push(src.slice(last));
    return nodes.map((node, idx) => <Fragment key={idx}>{node}</Fragment>);
}

/** Hivatalos sorszám: 2026/1.a) — a felvételinél ne jelenjen meg.
 *  Válaszmező betűje: (A) = ? / (C)=? — ezt se mutassuk. A feleletválasztó
 *  (A) Minden oldala… sorokat nem nyúljuk, mert utánuk nem egyenlőségjel van.
 */
export function stripOfficialTaskLabel(text: string | undefined | null): string {
    if (!text) return '';
    const before = String(text);
    const after = before
        .replace(/^\d{4}\/\d+(?:\.[a-z])?(?:–[a-z])?\)?\s*/i, '')
        .replace(/\s*\(([A-Ea-e])\)\s*(?==)/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/[ \t]+\n/g, '\n')
        .trim();
    // #region agent log
    if (/\([A-Ea-e]\)\s*=/.test(before) || before !== after) {
        agentDebugLog({
            hypothesisId: 'H1',
            location: 'formatMathText.tsx:stripOfficialTaskLabel',
            message: 'kozponti official/letter strip',
            data: {
                hadYearPrefix: /^\d{4}\//.test(before),
                hadLetterSlot: /\([A-Ea-e]\)\s*=/.test(before),
                afterHasLetterSlot: /\([A-Ea-e]\)\s*=/.test(after),
                keptChoiceLines: /^\([A-E]\)\s+\S/m.test(after),
                before: before.slice(0, 90),
                after: after.slice(0, 90),
            },
            runId: 'kf-label',
        });
    }
    // #endregion
    return after;
}

/** a_n → alsó index, ^n → felső, a/b → egymás alatti hányados. */
export function formatMathText(text: string | undefined | null): ReactNode {
    if (!text) return null;
    const src = String(text);
    const chunks = splitFractions(src);
    const fracN = chunks.filter((c) => c.kind === 'frac').length;

    if (src.includes('_') || src.includes('/') || fracN > 0) {
        const firstFrac = chunks.find((c) => c.kind === 'frac');
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'formatMathText.tsx:formatMathText',
            message: 'math text formatted',
            data: {
                fracN,
                hasSlash: /[/∕⁄／]/.test(src),
                firstNum: firstFrac && firstFrac.kind === 'frac' ? firstFrac.num : null,
                firstDen: firstFrac && firstFrac.kind === 'frac' ? firstFrac.den : null,
                sample: src.slice(0, 80),
            },
            runId: 'math-frac',
        });
        // #endregion
    }

    return chunks.map((chunk, i) => {
        if (chunk.kind === 'text') {
            return <Fragment key={i}>{formatScripts(chunk.value)}</Fragment>;
        }
        return (
            <span key={i} className="mm-frac" aria-label={`${chunk.num} per ${chunk.den}`}>
                <span className="mm-frac-num">{formatMathText(chunk.num)}</span>
                <span className="mm-frac-bar" />
                <span className="mm-frac-den">{formatMathText(chunk.den)}</span>
            </span>
        );
    });
}
