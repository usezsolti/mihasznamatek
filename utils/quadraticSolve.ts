import { evaluateScientific, formatScientific } from './scientificEval';

export type QuadraticSolveResult =
    | { ok: true; lines: string[]; board: string }
    | { ok: false; error: string };

function nearlyZero(n: number, scale = 1): boolean {
    return Math.abs(n) <= 1e-9 * Math.max(1, Math.abs(scale));
}

function show(n: number): string {
    return formatScientific(n).replace(/-/g, '−');
}

function showAbs(n: number): string {
    return formatScientific(Math.abs(n));
}

function addTerm(coeff: number, body: string, started: boolean): { text: string; started: boolean } {
    if (coeff === 0) return { text: '', started };
    const abs = Math.abs(coeff);
    const mag = body && abs === 1 ? body : `${showAbs(coeff)}${body}`;
    if (!started) return { text: coeff < 0 ? `−${mag}` : mag, started: true };
    return { text: coeff < 0 ? ` − ${mag}` : ` + ${mag}`, started: true };
}

export function formatQuadraticEquation(a: number, b: number, c: number): string {
    let text = '';
    let started = false;
    for (const [coeff, body] of [
        [a, 'x²'],
        [b, 'x'],
        [c, ''],
    ] as const) {
        const next = addTerm(coeff, body, started);
        text += next.text;
        started = next.started;
    }
    return started ? `${text} = 0` : '0 = 0';
}

function complexPair(real: number, imag: number): string {
    const im = showAbs(imag) === '1' ? 'i' : `${showAbs(imag)}i`;
    if (nearlyZero(real)) return `±${im}`;
    return `${show(real)} ± ${im}`;
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticSolveResult {
    if (![a, b, c].every((n) => Number.isFinite(n))) {
        return { ok: false, error: 'Hibás együttható' };
    }
    const eq = formatQuadraticEquation(a, b, c);
    if (a === 0) {
        if (b === 0 && c === 0) {
            return {
                ok: true,
                lines: ['0 = 0', 'Minden valós szám megoldás.'],
                board: '0 = 0 | minden valós szám megoldás',
            };
        }
        if (b === 0) {
            return {
                ok: true,
                lines: [eq, 'Nincs megoldás.'],
                board: `${eq} | nincs megoldás`,
            };
        }
        const x = -c / b;
        return {
            ok: true,
            lines: ['Ez elsőfokú, mert a = 0.', eq, `x = ${show(x)}`],
            board: `${eq} | x = ${show(x)}`,
        };
    }

    const rawD = b * b - 4 * a * c;
    const D = nearlyZero(rawD, Math.max(Math.abs(b * b), Math.abs(4 * a * c))) ? 0 : rawD;
    if (D > 0) {
        const root = Math.sqrt(D);
        const x1 = (-b + root) / (2 * a);
        const x2 = (-b - root) / (2 * a);
        return {
            ok: true,
            lines: [eq, `D = ${show(D)}`, `x₁ = ${show(x1)}`, `x₂ = ${show(x2)}`],
            board: `${eq} | D = ${show(D)} | x₁ = ${show(x1)} | x₂ = ${show(x2)}`,
        };
    }
    if (D === 0) {
        const x = -b / (2 * a);
        return {
            ok: true,
            lines: [eq, 'D = 0', `x = ${show(x)} (kétszeres gyök)`],
            board: `${eq} | D = 0 | x = ${show(x)} (kétszeres gyök)`,
        };
    }
    const real = -b / (2 * a);
    const imag = Math.sqrt(-D) / (2 * Math.abs(a));
    const pair = complexPair(real, imag);
    return {
        ok: true,
        lines: [eq, `D = ${show(D)}`, 'Nincs valós gyök.', `x = ${pair}`],
        board: `${eq} | D = ${show(D)} | nincs valós gyök, x = ${pair}`,
    };
}

function readCoeff(raw: string): number | null | 'bad' {
    const text = raw.trim();
    if (!text) return null;
    try {
        const value = evaluateScientific(text);
        return Number.isFinite(value) ? value : 'bad';
    } catch {
        return 'bad';
    }
}

export function solveQuadraticInputs(aRaw: string, bRaw: string, cRaw: string): QuadraticSolveResult {
    const coeffs = [readCoeff(aRaw), readCoeff(bRaw), readCoeff(cRaw)];
    if (coeffs.some((item) => item === 'bad')) return { ok: false, error: 'Hibás együttható' };
    if (coeffs.some((item) => item === null)) return { ok: false, error: '' };
    return solveQuadratic(coeffs[0] as number, coeffs[1] as number, coeffs[2] as number);
}
