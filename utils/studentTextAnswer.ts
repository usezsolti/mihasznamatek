/**
 * Beírt képlet, tartomány és szöveges válasz összevetése.
 * Elfogadja a szóköz, a ∪ / U, a +∞ és a ]a,b[ nyílt jelölés változatait.
 */

function stripPrefixes(value: string): string {
    let s = value;
    const prefixes = [
        /^d_f=/,
        /^df=/,
        /^tartomany=/,
        /^d=/,
        /^f\(g\(x\)\)=/,
        /^fg\(x\)=/,
        /^f\^-1\(x\)=/,
        /^f-1\(x\)=/,
        /^inverz=/,
        /^lim=/,
    ];
    let changed = true;
    while (changed) {
        changed = false;
        for (const prefix of prefixes) {
            const next = s.replace(prefix, '');
            if (next !== s) {
                s = next;
                changed = true;
            }
        }
    }
    return s;
}

export function canonStudentText(raw: string): string {
    let s = String(raw || '').trim().toLowerCase();
    if (!s) return '';
    s = s.normalize('NFD').replace(/\p{M}/gu, '');
    s = s.replace(/[−–—]/g, '-');
    s = s.replace(/\\left|\\right/g, '');
    s = s.replace(/\\mathbb\{r\}|ℝ/gi, 'r');
    s = s.replace(/\\infty|∞/g, 'inf');
    s = s.replace(/infty|infinity|vegtelen/g, 'inf');
    s = s.replace(/\\cup|∪/g, 'u');
    s = s.replace(/\\cap|∩/g, 'n');
    s = s.replace(/\\setminus|∖/g, '\\');
    s = s.replace(/\\cos/g, 'cos');
    s = s.replace(/\\ln/g, 'ln');
    s = s.replace(/\\sqrt|√/g, 'sqrt');
    s = s.replace(/gyok/g, 'sqrt');
    s = s.replace(/\\circ|∘/g, '');
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)');
    s = s.replace(/sqrt\{([^{}]+)\}/g, 'sqrt($1)');
    s = s.replace(/[{}]/g, '');
    s = s.replace(/\s+/g, '');
    s = s.replace(/;/g, ',');
    s = s.replace(/pluszinf/g, 'inf');
    s = s.replace(/minuszinf/g, '-inf');
    s = s.replace(/\+inf/g, 'inf');
    s = s.replace(/\](?=-?\d|\()/g, '(');
    s = s.replace(/\[(?=u|\)|$)/g, ')');
    s = s.replace(/\((\d+)\)\/\(([a-z0-9]+)\)/g, '$1/$2');
    s = s.replace(/\((\d+\/[a-z0-9]+)\)/g, '$1');
    s = s.replace(/r(\\|-)0/g, 'r\\0');
    s = s.replace(/rkiveve0/g, 'r\\0');
    s = stripPrefixes(s);
    return s;
}

export function studentTextMatches(raw: string, accepted: string[]): boolean {
    const got = canonStudentText(raw);
    if (!got) return false;
    return accepted.some((item) => canonStudentText(item) === got);
}
