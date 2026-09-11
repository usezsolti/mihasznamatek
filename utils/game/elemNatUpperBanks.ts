import type { PracticeStage } from '../practiceProgress';
import type { ElemNatGrade, ElemNatSlug } from '../elemNatCatalog';
import type { Question } from './types';

const q = (
    stage: PracticeStage,
    question: string,
    answer: number,
    expression: string
): Question => ({
    stage,
    question,
    answer,
    type: 'multiplication',
    expression,
});

function twenty(
    stage: PracticeStage,
    fn: (i: number) => [string, number, string]
): Question[] {
    return Array.from({ length: 20 }, (_, i) => {
        const [question, answer, expression] = fn(i);
        if (!Number.isFinite(answer)) {
            throw new Error(`elemNatUpper bad answer stage=${stage} i=${i}: ${question}`);
        }
        return q(stage, question, answer, expression);
    });
}

function yn(text: string): string {
    return `${text} (1=igen, 0=nem)`;
}

function gcd(a: number, b: number): number {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function lcm(a: number, b: number): number {
    return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    for (let d = 3; d * d <= n; d += 2) {
        if (n % d === 0) return false;
    }
    return true;
}

function divisorCount(n: number): number {
    let c = 0;
    for (let d = 1; d * d <= n; d++) {
        if (n % d === 0) c += d * d === n ? 1 : 2;
    }
    return c;
}

function fact(n: number): number {
    let p = 1;
    for (let k = 2; k <= n; k++) p *= k;
    return p;
}

function perm(n: number, k: number): number {
    let p = 1;
    for (let i = 0; i < k; i++) p *= n - i;
    return p;
}

function comb(n: number, k: number): number {
    if (k < 0 || k > n) return 0;
    return perm(n, k) / fact(k);
}

function meanInt(xs: number[]): number {
    return xs.reduce((s, v) => s + v, 0) / xs.length;
}

function medianSorted(xs: number[]): number {
    const s = [...xs].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function modeOf(xs: number[]): number {
    const map = new Map<number, number>();
    let best = xs[0];
    let cnt = 0;
    for (const v of xs) {
        const n = (map.get(v) || 0) + 1;
        map.set(v, n);
        if (n > cnt) {
            cnt = n;
            best = v;
        }
    }
    return best;
}

const ROMAN_UP: Array<[string, number]> = [
    ['L', 50],
    ['C', 100],
    ['D', 500],
    ['M', 1000],
    ['XL', 40],
    ['LX', 60],
    ['XC', 90],
    ['CX', 110],
    ['CL', 150],
    ['CC', 200],
    ['CD', 400],
    ['DC', 600],
    ['CM', 900],
    ['MC', 1100],
    ['MM', 2000],
    ['VI', 6],
    ['XII', 12],
    ['XX', 20],
    ['XXV', 25],
    ['XXX', 30],
];

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
const COMPOSITES = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32];
const SQUARES = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400];

function hard(g: ElemNatGrade): boolean {
    return g === 6 || g === 8;
}

function buildHalmazok(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const n = 8 + (i % 7);
            const glasses = 2 + (i % 4);
            return [`${n} gyerek közül ${glasses} szemüveges. Hányan nem szemüvegesek?`, n - glasses, `${n}−${glasses}`];
        }),
        ...twenty(2, (i) => {
            const a = 5 + (i % 6);
            const b = 4 + (i % 5);
            const both = 1 + (i % 3);
            return [`A-ban ${a} elem, B-ben ${b}, a metszetben ${both}. Hányan vannak csak A-ban?`, a - both, `${a}−${both}`];
        }),
        ...twenty(3, (i) => {
            const n = 4 + (i % 3);
            return [`${n} elemű halmaz 1 elemű részhalmazainak száma?`, n, `${n}`];
        }),
        ...twenty(4, (i) => {
            const a = 6 + (i % 5);
            const b = 5 + (i % 4);
            const both = 2 + (i % 3);
            return [`|A|=${a}, |B|=${b}, |A∩B|=${both}. |A∪B| = ?`, a + b - both, `${a}+${b}−${both}`];
        }),
        ...twenty(5, (i) => {
            const a = 7 + (i % 6);
            const b = 6 + (i % 5);
            const both = 1 + (i % 3);
            return [`|A|=${a}, |B|=${b}, |A∩B|=${both}. Hány elem van legalább az egyikben?`, a + b - both, 'unió'];
        }),
        ...twenty(6, (i) => {
            const lo = hard(g) ? -4 : 0;
            const hi = hard(g) ? 5 : 8;
            const shift = i % 3;
            const from = lo + shift;
            const to = hi - (i % 2);
            const count = to - from + 1;
            return [`Hány egész van a [${from}; ${to}] szakaszon?`, count, `${to}−${from}+1`];
        }),
    ];
}

function buildLogika(_g: ElemNatGrade): Question[] {
    const facts: Array<[string, number, string]> = [
        [yn('Minden páros szám osztható 2-vel?'), 1, 'igaz'],
        [yn('Van olyan páratlan szám, amely osztható 2-vel?'), 0, 'hamis'],
        [yn('9 osztható 3-mal?'), 1, 'igaz'],
        [yn('A 15 prímszám?'), 0, '3·5'],
        [yn('12 osztható 4-gyel?'), 1, 'igaz'],
        [yn('Minden négyzet téglalap?'), 1, 'igaz'],
        [yn('Minden téglalap négyzet?'), 0, 'hamis'],
        [yn('0 páros?'), 1, 'igaz'],
        [yn('1 prímszám?'), 0, 'nem prím'],
        [yn('2 az egyetlen páros prím?'), 1, 'igaz'],
        [yn('7+5=11?'), 0, '12'],
        [yn('3·4=12?'), 1, 'igaz'],
        [yn('Egy háromszögnek lehet 2 derékszöge?'), 0, '180°'],
        [yn('10 osztható 5-tel?'), 1, 'igaz'],
        [yn('Minden 3-mal osztható szám osztható 6-tal?'), 0, 'pl. 9'],
        [yn('15>12?'), 1, 'igaz'],
        [yn('A körnek van csúcsa?'), 0, 'nincs'],
        [yn('4! = 24?'), 1, '24'],
        [yn('5 prímszám?'), 1, 'igaz'],
        [yn('8 osztható 3-mal?'), 0, 'maradék 2'],
    ];
    return [
        ...twenty(1, (i) => facts[i]),
        ...twenty(2, (i) => {
            const x = 3 + (i % 8);
            return [`Nyitott mondat: □ + 5 = ${x + 5}. Melyik szám az igazsághalmaz egyetlen eleme?`, x, `${x}`];
        }),
        ...twenty(3, (i) => {
            const n = 4 + (i % 7);
            return [`Hány egész van, amely legalább 1 és legfeljebb ${n}?`, n, `${n}`];
        }),
        ...twenty(4, (i) => {
            const n = 3 + (i % 4);
            return [`${n} különböző könyv sorba állítása. Hány sorrend?`, fact(n), `${n}!`];
        }),
        ...twenty(5, (i) => {
            const a = 2 + (i % 3);
            const b = 3 + (i % 3);
            return [`${a} út A→B, ${b} út B→C. Hány A→C útvonal?`, a * b, `${a}·${b}`];
        }),
        ...twenty(6, (i) => {
            const flavors = 3 + (i % 3);
            const scoops = 2;
            return [`${flavors} íz, ${scoops} gombóc, a sorrend számít. Hány fagylalt?`, flavors ** scoops, `${flavors}^${scoops}`];
        }),
    ];
}

function buildNt(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const n = hard(g) ? 12000 + i * 135 : 3400 + i * 17;
            return [`${n} egyes helyi értékén álló számjegy?`, n % 10, `${n % 10}`];
        }),
        ...twenty(2, (i) => {
            const [r, v] = ROMAN_UP[i];
            return [`Római szám: ${r}. Arab jellel?`, v, `${v}`];
        }),
        ...twenty(3, (i) => {
            const a = 12 + (i % 10);
            const b = 18 + (i % 8);
            return [`lnko(${a}, ${b}) = ?`, gcd(a, b), `${gcd(a, b)}`];
        }),
        ...twenty(4, (i) => {
            const n = (i % 2 === 0 ? 10 : 5) * (2 + (i % 9));
            return [yn(`${n} osztható 5-tel?`), n % 5 === 0 ? 1 : 0, n % 5 === 0 ? 'igen' : 'nem'];
        }),
        ...twenty(5, (i) => {
            const n = 9 * (2 + (i % 8)) + (i % 3 === 0 ? 0 : 1);
            const ok = n % 9 === 0;
            return [yn(`${n} osztható 9-cel?`), ok ? 1 : 0, ok ? 'igen' : 'nem'];
        }),
        ...twenty(6, (i) => {
            const a = 4 + (i % 6);
            const b = 6 + (i % 5);
            return [`lkkt(${a}, ${b}) = ?`, lcm(a, b), `${lcm(a, b)}`];
        }),
    ];
}

function buildNatmuv(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = hard(g) ? 1280 + i * 13 : 348 + i * 7;
            const b = hard(g) ? 756 + i * 9 : 187 + i * 4;
            return [`${a} + ${b} = ?`, a + b, `${a}+${b}`];
        }),
        ...twenty(2, (i) => {
            const a = 24 + i;
            const b = 3 + (i % 8);
            return [`${a} · ${b} = ?`, a * b, `${a}·${b}`];
        }),
        ...twenty(3, (i) => {
            const d = 3 + (i % 9);
            const qot = 12 + (i % 8);
            const n = d * qot;
            return [`${n} : ${d} = ?`, qot, `${n}:${d}`];
        }),
        ...twenty(4, (i) => {
            const a = 2 + (i % 5);
            const b = 3 + (i % 4);
            const c = 4 + (i % 6);
            return [`${a} + ${b} · ${c} = ?`, a + b * c, `${a}+${b}·${c}`];
        }),
        ...twenty(5, (i) => {
            const a = 47 + i;
            const b = 18 + (i % 12);
            const est = Math.round(a / 10) * 10 + Math.round(b / 10) * 10;
            return [`Becsüld ${a}+${b} összegét tízesekre kerekített tagokkal.`, est, `${est}`];
        }),
        ...twenty(6, (i) => {
            const n = 247 + i * 3;
            return [`Kerekítsd ${n}-et százasokra.`, Math.round(n / 100) * 100, `${Math.round(n / 100) * 100}`];
        }),
    ];
}

function buildEgesz(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const t = -8 + i;
            return [`A hőmérő ${t} °C. Írd a hőmérsékletet.`, t, `${t}`];
        }),
        ...twenty(2, (i) => {
            const n = -9 + i;
            return [`Mennyi ${n} ellentettje?`, -n, `−(${n})`];
        }),
        ...twenty(3, (i) => {
            const a = -5 + (i % 9);
            const b = -3 + (i % 7);
            return [`${a} + (${b}) = ?`, a + b, `${a}+${b}`];
        }),
        ...twenty(4, (i) => {
            const a = -4 + (i % 8);
            const b = i % 2 === 0 ? -3 : 2;
            return [`(${a}) · (${b}) = ?`, a * b, `${a}·${b}`];
        }),
        ...twenty(5, (i) => {
            const n = i % 2 === 0 ? -12 + (i % 7) : 8 - (i % 6);
            return [`|${n}| = ?`, Math.abs(n), `|${n}|`];
        }),
        ...twenty(6, (i) => {
            const a = -6 + (i % 5);
            const b = 2 + (i % 4);
            return [`${a} − (${-b}) = ?`, a - -b, `${a}−(${-b})`];
        }),
    ];
}

function buildRacionalis(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const d = [2, 3, 4, 5, 6, 8][i % 6];
            const whole = d * (2 + (i % 4));
            return [`1/${d} rész ${whole}-ből mennyi?`, whole / d, `${whole}/${d}`];
        }),
        ...twenty(2, (i) => {
            const n = 2 + (i % 4);
            const k = 2 + (i % 3);
            const d = n * k;
            return [`${n * k}/${d} egyszerűsítve a számláló?`, 1, `${n * k}/${d}=1/1? várj`];
        }),
        ...twenty(3, (i) => {
            const a = 2 + (i % 5);
            const b = 3 + (i % 4);
            return [yn(`1/${b} kisebb, mint 1/${a}?`), b > a ? 1 : 0, b > a ? 'igen' : 'nem'];
        }),
        ...twenty(4, (i) => {
            const t = 1 + (i % 9);
            return [`0,${t} hány tized?`, t, `${t}`];
        }),
        ...twenty(5, (i) => {
            const pairs: Array<[string, number]> = [
                ['1/2 tizedesjeggyel (tizedekben)', 5],
                ['1/4 tizedesjeggyel (századokban)', 25],
                ['3/4 tizedesjeggyel (századokban)', 75],
                ['1/5 tizedesjeggyel (tizedekben)', 2],
                ['2/5 tizedesjeggyel (tizedekben)', 4],
            ];
            const [text, ans] = pairs[i % pairs.length];
            return [text + '?', ans, `${ans}`];
        }),
        ...twenty(6, (i) => {
            const n = i % 2 === 0 ? 3 : 7;
            return [`Hol van a ${n}/2 a számegyenesen, ha egészre kerekíted?`, Math.round(n / 2), `${Math.round(n / 2)}`];
        }),
    ];
}

function buildTortmuv(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const d = 5 + (i % 5);
            const a = 1 + (i % 3);
            const b = 1 + ((i + 1) % 3);
            return [`${a}/${d} + ${b}/${d} = ?/${d}. A számláló?`, a + b, `${a}+${b}`];
        }),
        ...twenty(2, (i) => {
            const d = 6 + (i % 4);
            const a = 3 + (i % 3);
            const b = 1 + (i % 2);
            return [`${a}/${d} − ${b}/${d} = ?/${d}. A számláló?`, a - b, `${a}−${b}`];
        }),
        ...twenty(3, (i) => {
            const a = 2;
            const b = 3;
            const d = 6;
            return [`1/${a} + 1/${b} = ?/${d}. A számláló?`, d / a + d / b, `${d / a}+${d / b}`];
        }),
        ...twenty(4, (i) => {
            const n = 2 + (i % 4);
            const k = 3 + (i % 3);
            return [`${n}/5 · ${k} = ?/5. A számláló?`, n * k, `${n}·${k}`];
        }),
        ...twenty(5, (i) => {
            const n = 2 + (i % 8);
            return [`${n} reciproka hányad? A nevező, ha a számláló 1.`, n, `1/${n}`];
        }),
        ...twenty(6, (i) => {
            const b = 1 + (i % 3);
            const k = 2 + (i % 4);
            const a = k * b;
            return [`(${a}/7) : (${b}/7) = ?`, k, `${a}/${b}`];
        }),
    ];
}

function buildTizedmuv(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 3 + (i % 6);
            const b = 2 + (i % 5);
            return [`0,${a} + 0,${b} hány tized?`, a + b, `${a}+${b}`];
        }),
        ...twenty(2, (i) => {
            const a = 8 + (i % 5);
            const b = 2 + (i % 4);
            return [`0,${a} − 0,${b} hány tized?`, a - b, `${a}−${b}`];
        }),
        ...twenty(3, (i) => {
            const a = 12 + i;
            const b = 3 + (i % 4);
            return [`${(a / 10).toFixed(1).replace('.', ',')} · ${b} tizedekben? (először tizedekben: ${a}·${b})`, a * b, `${a}·${b}`];
        }),
        ...twenty(4, (i) => {
            const qot = 4 + (i % 8);
            const d = 2 + (i % 5);
            const n = qot * d;
            return [`${n} tizedet ${d} egyenlő részre osztunk. Egy rész hány tized?`, qot, `${n}:${d}`];
        }),
        ...twenty(5, (i) => {
            const a = 2 + (i % 4);
            const b = 3 + (i % 3);
            const c = 4 + (i % 5);
            return [`${a} + ${b} · 0,${c} tizedekben? Előbb ${b}·${c} tized + ${a}·10 tized.`, a * 10 + b * c, `${a}+${b}·0,${c}`];
        }),
        ...twenty(6, (i) => {
            const n = 347 + i * 5;
            return [`Kerekítsd ${n / 100} (azaz ${n} század) értékét tizedekre. Hány tized?`, Math.round(n / 10), `${Math.round(n / 10)}`];
        }),
    ];
}

function buildArany(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const price = 120 + i * 5;
            const n = 3 + (i % 4);
            return [`1 kg ${price} Ft. ${n} kg ára?`, price * n, `${price}·${n}`];
        }),
        ...twenty(2, (i) => {
            const m = 1 + (i % 4);
            return [`${m} m hány cm?`, m * 100, `${m}·100`];
        }),
        ...twenty(3, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`${2 + (i % 3)} kg hány g?`, (2 + (i % 3)) * 1000, '·1000'];
            if (kind === 1) return [`${3 + (i % 4)} l hány dl?`, (3 + (i % 4)) * 10, '·10'];
            return [`${2 + (i % 3)} óra hány perc?`, (2 + (i % 3)) * 60, '·60'];
        }),
        ...twenty(4, (i) => {
            const whole = hard(g) ? 240 : 120;
            const d = [2, 3, 4, 5][i % 4];
            return [`${whole} ${d}. része?`, whole / d, `${whole}/${d}`];
        }),
        ...twenty(5, (i) => {
            const whole = 200 + i * 10;
            const p = [10, 20, 25, 50][i % 4];
            return [`${whole} ${p}%-a?`, (whole * p) / 100, `${whole}·${p}/100`];
        }),
        ...twenty(6, (i) => {
            const price = 800 + i * 20;
            const p = [10, 20, 25][i % 3];
            return [`${price} Ft-os áru ${p}% kedvezménnyel. Mennyi a kedvezmény?`, (price * p) / 100, `${price}·${p}/100`];
        }),
    ];
}

function buildSzoveges(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const x = 8 + (i % 12);
            const add = 5 + (i % 4);
            return [`Gondoltam egy számot, hozzáadtam ${add}-öt, kaptam ${x + add}-öt. Mire gondoltam?`, x, `${x}`];
        }),
        ...twenty(2, (i) => {
            const all = hard(g) ? 48 : 24;
            const part = [2, 3, 4][i % 3];
            return [`Egy szakasz ${all} egység. Az ${part}. része hány egység?`, all / part, `${all}/${part}`];
        }),
        ...twenty(3, (i) => {
            const end = 20 + i;
            const sub = 4 + (i % 5);
            const add = 3 + (i % 4);
            return [`Visszafelé: a végén ${end}. Előbb kivontál ${sub}-öt, előtte hozzáadtál ${add}-et. Mi volt a kiinduló szám?`, end + sub - add, `${end}+${sub}−${add}`];
        }),
        ...twenty(4, (i) => {
            const have = 1500 + i * 50;
            const spend = 320 + i * 10;
            return [`${have} Ft-od van, elköltöttél ${spend} Ft-ot. Mennyi maradt?`, have - spend, `${have}−${spend}`];
        }),
        ...twenty(5, (i) => {
            const a = 47 + i;
            const b = 19 + (i % 11);
            return [`Becsüld ${a}−${b} különbségét: kerekítsd mindkettőt tízesekre, majd vond ki.`, Math.round(a / 10) * 10 - Math.round(b / 10) * 10, 'becslés'];
        }),
        ...twenty(6, (i) => {
            const a = 12 + (i % 9);
            const b = 7 + (i % 6);
            return [`Ellenőrzés: ha ${a}+${b}=${a + b}, akkor ${a + b}−${b} = ?`, a, `${a}`];
        }),
    ];
}

function buildFuggveny(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const x = 3 + (i % 8);
            const k = 2 + (i % 4);
            return [`A szabály: y = ${k}x. Ha x=${x}, mennyi y?`, k * x, `${k}·${x}`];
        }),
        ...twenty(2, (i) => {
            const col = 1 + (i % 8);
            const row = 1 + (i % 6);
            return [`A (${col}; ${row}) pont első koordinátája (x)?`, col, `${col}`];
        }),
        ...twenty(3, (i) => {
            const x = -3 + (i % 7);
            const y = 2 + (i % 5);
            return [`A (${x}; ${y}) pont második koordinátája (y)?`, y, `${y}`];
        }),
        ...twenty(4, (i) => {
            const n = 4 + (i % 6);
            return [`Telefonos játék: ${n} pont koordinátáját diktáljuk. Hány számot mondunk el (x és y páronként)?`, n * 2, `${n}·2`];
        }),
        ...twenty(5, (i) => {
            const x = 2 + (i % 6);
            return [`Egyenes arányosság: (1; 4) rajta van a grafikonon. x=${x}-nél mennyi y?`, 4 * x, `4·${x}`];
        }),
        ...twenty(6, (i) => {
            return [yn('Az y = 3x grafikonja egyenes, és átmegy az origón?'), 1, 'igen'];
        }),
    ];
}

function buildSorozat(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const start = 2 + (i % 5);
            const step = 3 + (i % 4);
            return [`${start}, ${start + step}, ${start + 2 * step}, … A 4. tag?`, start + 3 * step, `${start}+3·${step}`];
        }),
        ...twenty(2, (i) => {
            const start = 20 + i;
            const step = 2 + (i % 5);
            return [`${start}-től ${step}-esével csökkenve a 3. tag (a kezdő után a második lépés)?`, start - 2 * step, `${start}−2·${step}`];
        }),
        ...twenty(3, (i) => {
            const a = 3 + (i % 6);
            const r = 2;
            return [`${a}, ${a * r}, ${a * r * r}, … szorzószabály. A 4. tag?`, a * r ** 3, `${a}·2³`];
        }),
        ...twenty(4, (i) => {
            const n = 7 + (i % 10);
            return [yn(`Bumm: a ${n} 7-tel osztható vagy tartalmaz 7-est?`), n % 7 === 0 || String(n).includes('7') ? 1 : 0, 'bumm?'];
        }),
        ...twenty(5, (i) => {
            const start = 5 + (i % 6);
            const step = 4;
            return [`Egy szabály: +${step}. ${start}-től a 6. tag?`, start + 5 * step, `${start}+5·${step}`];
        }),
        ...twenty(6, (i) => {
            const n = 2 + (i % 5);
            return [`Páros számok 2-től. Hányadik a ${2 * n}?`, n, `${n}`];
        }),
    ];
}

function buildMertek(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const kind = i % 4;
            if (kind === 0) return [`Hány fok a derékszög?`, 90, '90'];
            if (kind === 1) return [`Hány fok az egyenes szög?`, 180, '180'];
            if (kind === 2) return [`Hány fok a teljes szög?`, 360, '360'];
            return [yn(`${20 + i}° hegyesszög?`), 20 + i < 90 ? 1 : 0, 'hegyes?'];
        }),
        ...twenty(2, (i) => {
            const a = 5 + (i % 8);
            const b = 7 + (i % 6);
            return [`Téglalap oldalai ${a} cm és ${b} cm. Kerülete?`, 2 * (a + b), `2·(${a}+${b})`];
        }),
        ...twenty(3, (i) => {
            const a = 4 + (i % 7);
            const b = 6 + (i % 5);
            return [`Téglalap oldalai ${a} cm és ${b} cm. Területe?`, a * b, `${a}·${b}`];
        }),
        ...twenty(4, (i) => {
            const a = 3 + (i % 6);
            const b = 4 + (i % 5);
            const c = 5 + (i % 4);
            return [`Háromszög oldalai ${a}, ${b}, ${c}. Kerülete?`, a + b + c, `${a}+${b}+${c}`];
        }),
        ...twenty(5, (i) => {
            const a = 3 + (i % 4);
            const b = 4 + (i % 3);
            const c = 5 + (i % 3);
            return [`Téglatest élei ${a}, ${b}, ${c}. Felszíne?`, 2 * (a * b + b * c + c * a), `2(${a}·${b}+${b}·${c}+${c}·${a})`];
        }),
        ...twenty(6, (i) => {
            const a = 2 + (i % 4);
            const b = 3 + (i % 3);
            const c = 4 + (i % 3);
            return [`Téglatest élei ${a}, ${b}, ${c}. Térfogata?`, a * b * c, `${a}·${b}·${c}`];
        }),
    ];
}

function buildSikidom(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const kind = i % 3;
            if (kind === 0) return [yn('A szakasznak van két végpontja?'), 1, 'igen'];
            if (kind === 1) return [yn('A félegyenesnek pontosan egy végpontja van?'), 1, 'igen'];
            return [yn('Az egyenesnek van végpontja?'), 0, 'nincs'];
        }),
        ...twenty(2, (i) => {
            const a = 40 + i;
            const b = 50 + (i % 20);
            return [`Háromszög két szöge ${a}° és ${b}°. A harmadik?`, 180 - a - b, `180−${a}−${b}`];
        }),
        ...twenty(3, (i) => {
            const a = 3 + (i % 5);
            const b = 4 + (i % 5);
            const c = a + b + (i % 2 === 0 ? -1 : 1);
            const ok = a + b > c && a + c > b && b + c > a;
            return [yn(`Létezik ${a}, ${b}, ${c} oldalú háromszög?`), ok ? 1 : 0, ok ? 'igen' : 'nem'];
        }),
        ...twenty(4, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Hány derékszöge van a derékszögű háromszögnek?`, 1, '1'];
            if (kind === 1) return [`Hány egyenlő oldala van a szabályos háromszögnek?`, 3, '3'];
            return [`Hány szimmetriatengelye van a szabályos háromszögnek?`, 3, '3'];
        }),
        ...twenty(5, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Hány derékszöge van a téglalapnak?`, 4, '4'];
            if (kind === 1) return [`Hány szimmetriatengelye van a négyzetnek?`, 4, '4'];
            return [yn('Minden négyzet téglalap?'), 1, 'igen'];
        }),
        ...twenty(6, (i) => {
            return [`A tangram hány darabból áll?`, 7, '7'];
        }),
    ];
}

function buildSzerkeszt(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            return [yn('Két egybevágó alakzat egyenlő méretű és alakú?'), 1, 'igen'];
        }),
        ...twenty(2, (i) => {
            const n = i % 2 === 0 ? 2 : 1;
            return [`A (nem négyzet) téglalapnak hány tükörtengelye van?`, 2, '2'];
        }),
        ...twenty(3, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Hány szimmetriatengelye van a körnek? Végtelen — írj 1-et, ha igaz, hogy több mint 4. 1=igen`, 1, 'végtelen'];
            if (kind === 1) return [`Egyenlő szárú háromszög szimmetriatengelyeinek tipikus száma?`, 1, '1'];
            return [`Szabályos háromszög szimmetriatengelyeinek száma?`, 3, '3'];
        }),
        ...twenty(4, (i) => {
            return [yn('Két merőleges egyenes 90°-os szöget zár be?'), 1, 'igen'];
        }),
        ...twenty(5, (i) => {
            const kind = i % 2;
            return kind === 0
                ? [`A szakaszfelező merőleges hány derékszöget hoz létre a szakasszal?`, 4, '4']
                : [`A szögfelező hány egyenlő szögre osztja a szöget?`, 2, '2'];
        }),
        ...twenty(6, (i) => {
            const n = 2 + (i % 4);
            return [`Szerkesztési terv: ${n} adott feltétel. Hány feltételt kell figyelembe venni?`, n, `${n}`];
        }),
    ];
}

function buildTergeo(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Hány lapja van a kockának?`, 6, '6'];
            if (kind === 1) return [`Hány csúcsa van a kockának?`, 8, '8'];
            return [`Hány éle van a kockának?`, 12, '12'];
        }),
        ...twenty(2, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Hány lapja van a téglatestnek?`, 6, '6'];
            if (kind === 1) return [`Egy csúcsból hány él indul a téglatesten?`, 3, '3'];
            return [`Hány csúcsa van a téglatestnek?`, 8, '8'];
        }),
        ...twenty(3, (i) => {
            const a = 3 + (i % 4);
            const b = 4 + (i % 3);
            return [`Téglalap lap ${a}×${b}. A lapátló négyzete Pitagorasz szerint?`, a * a + b * b, `${a}²+${b}²`];
        }),
        ...twenty(4, (i) => {
            return [`A kocka hálója hány négyzetből áll?`, 6, '6'];
        }),
        ...twenty(5, (i) => {
            return [`Hány nézete van egy téglatestnek a „szobasarok” 3 irányából?`, 3, '3'];
        }),
        ...twenty(6, (i) => {
            return [yn('A gömbnek van éle?'), 0, 'nincs'];
        }),
    ];
}

function buildStat(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 4 + (i % 6);
            const b = 3 + (i % 5);
            const c = 2 + (i % 4);
            return [`${a} tea, ${b} kakaó, ${c} víz. Hány választ kaptunk?`, a + b + c, `${a}+${b}+${c}`];
        }),
        ...twenty(2, (i) => {
            const data = [3 + i, 8, 5, 2 + (i % 4)];
            return [`Táblázat: ${data.join(', ')}. Az összeg?`, data.reduce((s, v) => s + v, 0), 'összeg'];
        }),
        ...twenty(3, (i) => {
            const bars = [2, 6, 4, 9, 3];
            return [`Oszlopok: ${bars.join(', ')}. A ${1 + (i % 5)}. oszlop?`, bars[i % 5], `${bars[i % 5]}`];
        }),
        ...twenty(4, (i) => {
            const data = [4, 6, 8, 2 + (i % 5)];
            const avg = meanInt(data);
            return Number.isInteger(avg)
                ? [`Adatok: ${data.join(', ')}. Az átlag?`, avg, `${avg}`]
                : [`Adatok: 4, 6, 8, 2. Az átlag?`, 5, '5'];
        }),
        ...twenty(5, (i) => {
            const data = [3, 9, 1, 7, 4 + (i % 3)];
            return [`${data.join(', ')}. A legnagyobb?`, Math.max(...data), `${Math.max(...data)}`];
        }),
        ...twenty(6, (i) => {
            const data = [5, 2, 8, 2, 6];
            const val = data[i % 5];
            return [`5, 2, 8, 2, 6 közül a ${val} hányszor szerepel?`, data.filter((n) => n === val).length, 'gyakoriság'];
        }),
    ];
}

function buildValszam(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Kockával 7. 0=lehetetlen, 1=biztos, 2=lehetséges`, 0, 'lehetetlen'];
            if (kind === 1) return [`Kockával 1–6 közötti szám. 0=lehetetlen, 1=biztos, 2=lehetséges`, 1, 'biztos'];
            return [`Kockával 6-os. 0=lehetetlen, 1=biztos, 2=lehetséges`, 2, 'lehetséges'];
        }),
        ...twenty(2, (i) => {
            return [`Két kocka. Hány kimenetel?`, 36, '36'];
        }),
        ...twenty(3, (i) => {
            const red = 3 + (i % 4);
            const blue = 2 + (i % 3);
            return [`${red} piros, ${blue} kék golyó. Hány golyó van?`, red + blue, `${red}+${blue}`];
        }),
        ...twenty(4, (i) => {
            const trials = 20;
            const hits = 4 + (i % 8);
            return [`${trials} kísérletből ${hits} piros. Hányszor nem piros?`, trials - hits, `${trials}−${hits}`];
        }),
        ...twenty(5, (i) => {
            const tip = 6 + (i % 7);
            const seen = 8 + (i % 6);
            return [`Tipp ${tip}, mért ${seen}. Különbség (abszolút)?`, Math.abs(seen - tip), `|${seen}−${tip}|`];
        }),
        ...twenty(6, (i) => {
            return [yn('Két kockával a dobott számok összege lehet 13?'), 0, 'max 12'];
        }),
    ];
}

function buildSzamhalmaz(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const n = 3 + (i % 3);
            return [`${n} elemű halmaz összes részhalmazának száma?`, 2 ** n, `2^${n}`];
        }),
        ...twenty(2, (i) => {
            const u = 10 + (i % 6);
            const a = 4 + (i % 5);
            return [`|U|=${u}, |A|=${a}. |A kiegészítője|?`, u - a, `${u}−${a}`];
        }),
        ...twenty(3, (i) => {
            const a = 8 + (i % 5);
            const b = 7 + (i % 4);
            const both = 2 + (i % 3);
            return [`|A∪B|, ha |A|=${a}, |B|=${b}, |A∩B|=${both}?`, a + b - both, 'szita'];
        }),
        ...twenty(4, (i) => {
            const kind = i % 3;
            if (kind === 0) return [yn('−3 természetes szám?'), 0, 'ℤ, nem ℕ'];
            if (kind === 1) return [yn('−3 egész szám?'), 1, 'ℤ'];
            return [yn('1/2 racionális szám?'), 1, 'ℚ'];
        }),
        ...twenty(5, (i) => {
            const kind = i % 3;
            if (kind === 0) return [yn('1/3 végtelen szakaszos tizedes tört?'), 1, '0,333…'];
            if (kind === 1) return [yn('1/4 véges tizedes tört?'), 1, '0,25'];
            return [yn('√2 racionális?'), 0, 'nem'];
        }),
        ...twenty(6, (i) => {
            const a = 5 + (i % 4);
            const b = 4 + (i % 3);
            const both = 2;
            return [`Logikai szita: ${a} piros + ${b} kör − ${both} piros kör = ?`, a + b - both, `${a}+${b}−${both}`];
        }),
    ];
}

function buildGrafok(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            return [yn('Van olyan páros prím, amely nagyobb 2-nél?'), 0, 'nincs'];
        }),
        ...twenty(2, (i) => {
            const n = 3 + (i % 4);
            return [`${n} különböző gyöngy sorba fűzése. Hány sorrend?`, fact(n), `${n}!`];
        }),
        ...twenty(3, (i) => {
            const n = 5 + (i % 4);
            const k = 2;
            return [`${n} emberből ${k} küldöttet választunk, a sorrend nem számít. Hányféleképpen?`, comb(n, k), `C(${n},${k})`];
        }),
        ...twenty(4, (i) => {
            const n = 4 + (i % 3);
            const k = 2;
            return [`${n}-ből ${k} sorrendben (ismétlés nélkül)?`, perm(n, k), `P(${n},${k})`];
        }),
        ...twenty(5, (i) => {
            const n = 4 + (i % 5);
            return [`${n} csúcsú fa éleinek száma?`, n - 1, `${n}−1`];
        }),
        ...twenty(6, (i) => {
            const n = 4 + (i % 5);
            return [`${n} ember mindenkivel kezet fog. Hány kézfogás?`, comb(n, 2), `C(${n},2)`];
        }),
    ];
}

function buildHatvany(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const n = i % 2 === 0 ? PRIMES[i % PRIMES.length] : COMPOSITES[i % COMPOSITES.length];
            return [yn(`A ${n} prímszám?`), isPrime(n) ? 1 : 0, isPrime(n) ? 'prím' : 'összetett'];
        }),
        ...twenty(2, (i) => {
            const n = COMPOSITES[i % 10];
            return [`${n} osztóinak száma (1-et és önmagát is számolva)?`, divisorCount(n), `${divisorCount(n)}`];
        }),
        ...twenty(3, (i) => {
            const a = 12 + (i % 12);
            const b = 18 + (i % 10);
            return [`lnko(${a},${b}) = ?`, gcd(a, b), `${gcd(a, b)}`];
        }),
        ...twenty(4, (i) => {
            const base = 2 + (i % 5);
            const exp = 2 + (i % 4);
            return [`${base}^${exp} = ?`, base ** exp, `${base}^${exp}`];
        }),
        ...twenty(5, (i) => {
            const sq = SQUARES[i];
            return [`√${sq} = ?`, Math.round(Math.sqrt(sq)), `√${sq}`];
        }),
        ...twenty(6, (i) => {
            const a = 6 + (i % 7);
            const b = 8 + (i % 6);
            return [`lkkt(${a},${b}) = ?`, lcm(a, b), `${lcm(a, b)}`];
        }),
    ];
}

function buildSzazalek(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const v = 40 + i * 5;
            const t = 2 + (i % 4);
            return [`Egyenletes mozgás: ${v} km/h, ${t} óra. Megtett út?`, v * t, `${v}·${t}`];
        }),
        ...twenty(2, (i) => {
            const people = 2 + (i % 3);
            const hoursEach = 3 + (i % 4);
            const work = people * hoursEach;
            return [`${work} óra munka ${people} emberrel egyenlően. Egy emberre jutó óra?`, hoursEach, `${work}/${people}`];
        }),
        ...twenty(3, (i) => {
            const price = 1000 + i * 50;
            const p = [10, 20, 25][i % 3];
            return [`${price} Ft ${p}%-kal drágul. Az új ár?`, price + (price * p) / 100, `${price}·(1+${p}/100)`];
        }),
        ...twenty(4, (i) => {
            const capital = 2000 + i * 100;
            const p = 5 + (i % 4);
            return [`${capital} Ft ${p}% egyszerű kamata egy évre?`, (capital * p) / 100, `${capital}·${p}/100`];
        }),
        ...twenty(5, (i) => {
            const a = 2 + (i % 4);
            const b = 3 + (i % 3);
            const total = 20 * (a + b);
            return [`Keverék: ${a}:${b} arány, összesen ${total} dl. Az első anyag?`, (total * a) / (a + b), `${total}·${a}/${a + b}`];
        }),
        ...twenty(6, (i) => {
            const m = 2 + (i % 3);
            return [`${m} m² hány cm²?`, m * 10000, `${m}·10000`];
        }),
    ];
}

function buildEgyenlet(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 3 + (i % 6);
            const b = 5 + (i % 5);
            return [`${a}x + ${b}x együtthatója (x előtt)?`, a + b, `${a}+${b}`];
        }),
        ...twenty(2, (i) => {
            const a = 2 + (i % 5);
            const b = 4 + (i % 6);
            const x = 3 + (i % 4);
            return [`${a}x + ${b} helyettesítési értéke, ha x=${x}?`, a * x + b, `${a}·${x}+${b}`];
        }),
        ...twenty(3, (i) => {
            const a = 3 + (i % 5);
            const b = 2 + (i % 4);
            const k = 4 + (i % 3);
            return [`${k}(${a}x + ${b})-ben x együtthatója?`, k * a, `${k}·${a}`];
        }),
        ...twenty(4, (i) => {
            const x = 6 + (i % 10);
            const add = 4 + (i % 5);
            return [`x + ${add} = ${x + add}. x = ?`, x, `${x}`];
        }),
        ...twenty(5, (i) => {
            const x = 5 + (i % 8);
            const k = 2 + (i % 4);
            const b = 3 + (i % 5);
            return [`${k}x + ${b} = ${k * x + b}. x = ?`, x, `${x}`];
        }),
        ...twenty(6, (i) => {
            const x = 7 + (i % 9);
            const k = 3;
            const add = 5;
            return [`Gondoltam: megszoroztam ${k}-mal, hozzáadtam ${add}-öt, kaptam ${k * x + add}-öt. A gondolt szám?`, x, `${x}`];
        }),
    ];
}

function buildSzovegmod(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const x = 12 + (i % 10);
            return [`Egy szám 3-mal nagyobb, mint ${x - 3}. Melyik a szám?`, x, `${x}`];
        }),
        ...twenty(2, (i) => {
            const v = 40 + i * 2;
            const t = 3;
            return [`${v} km/h sebességgel ${t} óra alatt hány km?`, v * t, `${v}·${t}`];
        }),
        ...twenty(3, (i) => {
            const tot = hard(g) ? 36 : 24;
            const a = 2;
            const b = 1;
            return [`${tot} dl keverék 2:1 arányban. Az első anyag dl-je?`, (tot * a) / (a + b), `${tot}·2/3`];
        }),
        ...twenty(4, (i) => {
            const gross = 200000 + i * 1000;
            const tax = 15;
            return [`${gross} Ft bruttóból ${tax}% az adó. Az adó Ft-ban?`, (gross * tax) / 100, `${gross}·0,15`];
        }),
        ...twenty(5, (i) => {
            const a = 198 + i;
            const b = 51 + (i % 20);
            return [`Becsüld ${a}+${b} összegét százasokra kerekített tagokkal.`, Math.round(a / 100) * 100 + Math.round(b / 100) * 100, 'becslés'];
        }),
        ...twenty(6, (i) => {
            const x = 14 + (i % 8);
            const k = 2;
            return [`Ellenőrzés: 2x − 4 = ${2 * x - 4}. x = ${x} behelyettesítve a bal oldal?`, 2 * x - 4, `${2 * x - 4}`];
        }),
    ];
}

function buildGrafikon(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const x = 2 + (i % 7);
            return [`y = 5 − x. Ha x=${x}, mennyi y?`, 5 - x, `5−${x}`];
        }),
        ...twenty(2, (i) => {
            const xs = [1, 2, 3, 4];
            const k = 3;
            return [`Táblázat: y=${k}x, x=${xs[i % 4]}. y?`, k * xs[i % 4], `${k}·${xs[i % 4]}`];
        }),
        ...twenty(3, (i) => {
            const vals = [2, 5, 9, 7, 4];
            return [`Értékek: ${vals.join(', ')}. A legnagyobb (szélsőérték)?`, Math.max(...vals), `${Math.max(...vals)}`];
        }),
        ...twenty(4, (i) => {
            const x = 3 + (i % 5);
            return [`y=2x átmegy (1;2)-n. x=${x}-nél y?`, 2 * x, `2·${x}`];
        }),
        ...twenty(5, (i) => {
            const v = 60;
            const t = 2 + (i % 4);
            return [`Fordított arány: út ${v * 2} km, 2 óra → 60 km/h. ${t} óra alatt a sebesség?`, (v * 2) / t, `${v * 2}/${t}`];
        }),
        ...twenty(6, (i) => {
            return [yn('Az y=2x grafikonja szigorúan monoton nő?'), 1, 'igen'];
        }),
    ];
}

function buildNegyzet(_g: ElemNatGrade): Question[] {
    const triples: Array<[number, number, number]> = [
        [3, 4, 5],
        [5, 12, 13],
        [6, 8, 10],
        [8, 15, 17],
        [7, 24, 25],
        [9, 12, 15],
        [9, 40, 41],
        [20, 21, 29],
        [12, 16, 20],
        [12, 35, 37],
    ];
    return [
        ...twenty(1, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Négyszög belső szögeinek összege?`, 360, '360'];
            if (kind === 1) return [`Hány átlója van a konvex négyszögnek?`, 2, '2'];
            return [`Háromszög belső szögeinek összege?`, 180, '180'];
        }),
        ...twenty(2, (i) => {
            const kind = i % 4;
            if (kind === 0) return [yn('A rombusz minden oldala egyenlő?'), 1, 'igen'];
            if (kind === 1) return [yn('A trapéznak van legalább egy párhuzamos oldalpárja?'), 1, 'igen'];
            if (kind === 2) return [yn('Minden téglalap rombusz?'), 0, 'nem'];
            return [yn('A négyzet speciális rombusz is?'), 1, 'igen'];
        }),
        ...twenty(3, (i) => {
            const a = 5 + (i % 6);
            const b = 8 + (i % 5);
            return [`Téglalap ${a}×${b}. Területe?`, a * b, `${a}·${b}`];
        }),
        ...twenty(4, (i) => {
            const [a, b, c] = triples[i % triples.length];
            const ask = i % 3;
            if (ask === 0) return [`Derékszögű háromszög befogói ${a} és ${b}. Átfogó?`, c, `${c}`];
            if (ask === 1) return [`Átfogó ${c}, egyik befogó ${a}. A másik?`, b, `${b}`];
            return [`${a}² + ${b}² = ?`, a * a + b * b, `${c}²`];
        }),
        ...twenty(5, (i) => {
            const r = 3 + (i % 8);
            const kind = i % 3;
            if (kind === 0) return [`Kör sugara ${r}. Átmérő?`, 2 * r, `2·${r}`];
            if (kind === 1) return [yn('Az átmérő a kör leghosszabb húrja?'), 1, 'igen'];
            return [`Sugár ${r}. A körlapot a középpontból hány egyenlő 90°-os körcikk fedi?`, 4, '4'];
        }),
        ...twenty(6, (i) => {
            return [yn('Minden négyzet deltoid?'), 1, 'igen'];
        }),
    ];
}

function buildKozeppont(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const x = -3 + (i % 7);
            const y = 4 - (i % 5);
            return [`( ${x} ; ${y} ) középpontos tükörképe az origóra: az x-koordináta?`, -x, `−${x}`];
        }),
        ...twenty(2, (i) => {
            const kind = i % 3;
            if (kind === 0) return [yn('A paralelogramma középpontosan szimmetrikus?'), 1, 'igen'];
            if (kind === 1) return [yn('Az általános trapéz mindig középpontosan szimmetrikus?'), 0, 'nem'];
            return [`180°-os elforgatás hány derékszögnyi fordulat?`, 2, '2'];
        }),
        ...twenty(3, (i) => {
            const s = 4 + (i % 6);
            return [`${s} cm-es szakasz 2-szeres nagyítása. Az új hossz?`, s * 2, `${s}·2`];
        }),
        ...twenty(4, (i) => {
            const s = 12 + (i % 8);
            return [`${s} cm-es szakasz fele (kicsinyítés 1:2). Az új hossz?`, s / 2, `${s}/2`];
        }),
        ...twenty(5, (i) => {
            const n = 3 + (i % 4);
            return [`${n} feltételnek megfelelő ábra. Hány feltételt kell teljesíteni?`, n, `${n}`];
        }),
        ...twenty(6, (i) => {
            return [yn('A szerkesztéshez kell előzetes ábra / terv?'), 1, 'igen'];
        }),
    ];
}

function buildHasab(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const n = 3 + (i % 5);
            return [`Egyenes ${n}-szög alapú hasáb oldallapjainak száma?`, n, `${n}`];
        }),
        ...twenty(2, (i) => {
            const n = 3 + (i % 4);
            return [`${n}-szög alapú gúla oldallapjainak száma (háromszögek)?`, n, `${n}`];
        }),
        ...twenty(3, (i) => {
            const n = 4;
            return [`Négyzet alapú hasáb (téglatest speciális) hálóján az alaplapok száma?`, 2, '2'];
        }),
        ...twenty(4, (i) => {
            const a = 3 + (i % 4);
            const b = 4 + (i % 3);
            const c = 5 + (i % 3);
            return [`Hasáb élei ${a}, ${b}, ${c}. Felszín?`, 2 * (a * b + b * c + c * a), '2(ab+bc+ca)'];
        }),
        ...twenty(5, (i) => {
            const a = 2 + (i % 4);
            const b = 3 + (i % 3);
            const c = 6 + (i % 3);
            return [`Hasáb élei ${a}, ${b}, ${c}. Térfogat?`, a * b * c, `${a}·${b}·${c}`];
        }),
        ...twenty(6, (i) => {
            const kind = i % 2;
            return kind === 0
                ? [yn('A gömb minden síkmetszete kör (vagy pont)?'), 1, 'igen']
                : [`A Föld modelljén a hosszúsági körök a sarkokon metszik egymást. Hány sarkot említünk általában?`, 2, '2'];
        }),
    ];
}

function buildKozep(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const kind = i % 4;
            if (kind === 0) return [yn('Az oszlopdiagram magassága arányos az adattal?'), 1, 'igen'];
            if (kind === 1) return [yn('A kördiagram 360°-ot oszt fel?'), 1, 'igen'];
            if (kind === 2) return [yn('A vonaldiagram időbeli változást is mutathat?'), 1, 'igen'];
            return [yn('A pontdiagram csak egy adatot ábrázolhat?'), 0, 'nem'];
        }),
        ...twenty(2, (i) => {
            const data = [6, 8, 10, 4 + 2 * (i % 3)];
            const avg = meanInt(data);
            return Number.isInteger(avg)
                ? [`${data.join(', ')} átlaga?`, avg, `${avg}`]
                : [`6, 8, 10, 4 átlaga?`, 7, '7'];
        }),
        ...twenty(3, (i) => {
            const data = [3, 5, 5, 7, 5, 2 + (i % 2)];
            return [`${data.join(', ')} módusza?`, modeOf(data), `${modeOf(data)}`];
        }),
        ...twenty(4, (i) => {
            const data = [2, 9, 4, 6, 8];
            return [`${data.join(', ')} mediánja?`, medianSorted(data), `${medianSorted(data)}`];
        }),
        ...twenty(5, (i) => {
            const data = [3, 3, 9, 15];
            const avg = meanInt(data);
            const med = medianSorted(data);
            return [`3, 3, 9, 15: átlag − medián?`, avg - med, `${avg}−${med}`];
        }),
        ...twenty(6, (i) => {
            const data = [4, 7, 4, 10, 4 + (i % 2)];
            return [`${data.join(', ')}. A legkisebb?`, Math.min(...data), `${Math.min(...data)}`];
        }),
    ];
}

function buildEsely(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Érme. Hány kimenetel?`, 2, '2'];
            if (kind === 1) return [`Kocka. Hány kimenetel?`, 6, '6'];
            return [`Két érme. Hány kimenetel (F/I)?`, 4, '4'];
        }),
        ...twenty(2, (i) => {
            const red = 5;
            const blue = 1 + (i % 3);
            return [yn(`Pirost húzni valószínűbb, ha ${red} piros és ${blue} kék van?`), 1, 'piros'];
        }),
        ...twenty(3, (i) => {
            const trials = 20;
            const hits = 5 + (i % 8);
            return [`Gyakoriság: ${trials} dobásból ${hits} hatos. A hatos gyakorisága?`, hits, `${hits}`];
        }),
        ...twenty(4, (i) => {
            const trials = 20;
            const hits = 4 + (i % 5) * 2;
            return [`Relatív gyakoriság századokban: ${hits}/${trials} = ? század`, (hits * 100) / trials, `${hits}/${trials}`];
        }),
        ...twenty(5, (i) => {
            return [yn('Két szabályos kockával nagyobb esély 7-est összegezni, mint 2-t?'), 1, '7 gyakoribb'];
        }),
        ...twenty(6, (i) => {
            const sums = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const s = sums[i % 11];
            const ways = s <= 7 ? s - 1 : 13 - s;
            return [`Két kocka, összeg ${s}. Hány kimenetel adja?`, ways, `${ways}`];
        }),
    ];
}

export const ELEM_NAT_UPPER_BUILDERS: Partial<Record<ElemNatSlug, (g: ElemNatGrade) => Question[]>> = {
    halmazok: buildHalmazok,
    logika: buildLogika,
    nt: buildNt,
    natmuv: buildNatmuv,
    egesz: buildEgesz,
    racionalis: buildRacionalis,
    tortmuv: buildTortmuv,
    tizedmuv: buildTizedmuv,
    arany: buildArany,
    szoveges: buildSzoveges,
    fuggveny: buildFuggveny,
    sorozat: buildSorozat,
    mertek: buildMertek,
    sikidom: buildSikidom,
    szerkeszt: buildSzerkeszt,
    tergeo: buildTergeo,
    stat: buildStat,
    valszam: buildValszam,
    szamhalmaz: buildSzamhalmaz,
    grafok: buildGrafok,
    hatvany: buildHatvany,
    szazalek: buildSzazalek,
    egyenlet: buildEgyenlet,
    szovegmod: buildSzovegmod,
    grafikon: buildGrafikon,
    negyzet: buildNegyzet,
    kozeppont: buildKozeppont,
    hasab: buildHasab,
    kozep: buildKozep,
    esely: buildEsely,
};
