import type { PracticeStage } from '../practiceProgress';
import type { ElemNatGrade, ElemNatSlug } from '../elemNatCatalog';
import { parseElemNatTopicId } from '../elemNatCatalog';
import { assertSixByTwenty } from './linearisTypes';
import type { Question } from './types';
import { ELEM_NAT_UPPER_BUILDERS } from './elemNatUpperBanks';

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
            throw new Error(`elemNat bad answer stage=${stage} i=${i}: ${question}`);
        }
        return q(stage, question, answer, expression);
    });
}

function yn(text: string): string {
    return `${text} (1=igen, 0=nem)`;
}

function maxN(g: ElemNatGrade): number {
    return g === 1 ? 20 : g === 2 ? 100 : g === 3 ? 1000 : 10000;
}

function tensMax(g: ElemNatGrade): number {
    return g === 1 ? 20 : g === 2 ? 90 : g === 3 ? 900 : 9000;
}

function addPair(g: ElemNatGrade, i: number): [number, number] {
    if (g === 1) {
        const a = 1 + (i % 9);
        const b = 1 + ((i * 2 + 1) % Math.max(1, 20 - a));
        return [a, b];
    }
    if (g === 2) {
        const a = 10 + ((i * 3) % 40);
        const b = 5 + ((i * 7) % Math.max(1, 100 - a));
        return [a, b];
    }
    if (g === 3) {
        const a = 120 + i * 17;
        const b = 80 + i * 11;
        return [a, b];
    }
    const a = 1200 + i * 37;
    const b = 800 + i * 29;
    return [a, b];
}

function subPair(g: ElemNatGrade, i: number): [number, number] {
    const [a, b] = addPair(g, i);
    return [a + b, a];
}

function evenOddList(i: number): number[] {
    return [2 + i, 3 + i, 8 + (i % 5), 11 + (i % 4), 14 + (i % 3), 15 + (i % 2)];
}

function countEven(nums: number[]): number {
    return nums.filter((n) => n % 2 === 0).length;
}

function placeDigits(n: number): { e: number; t: number; h: number; th: number } {
    return {
        e: n % 10,
        t: Math.floor(n / 10) % 10,
        h: Math.floor(n / 100) % 10,
        th: Math.floor(n / 1000) % 10,
    };
}

function romanValue(s: string): number {
    const map: Record<string, number> = {
        I: 1,
        II: 2,
        III: 3,
        IV: 4,
        V: 5,
        VI: 6,
        VII: 7,
        VIII: 8,
        IX: 9,
        X: 10,
        XI: 11,
        XII: 12,
        XIII: 13,
        XIV: 14,
        XV: 15,
        XVI: 16,
        XIX: 19,
        XX: 20,
    };
    return map[s];
}

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XIX', 'XX', 'V', 'X'];

function buildHalmaz(g: ElemNatGrade): Question[] {
    const colors = ['piros', 'kék', 'zöld', 'sárga'];
    const shapes = ['kör', 'háromszög', 'négyzet', 'téglalap'];
    return [
        ...twenty(1, (i) => {
            const c1 = colors[i % 4];
            const c2 = colors[(i + (i % 3 === 0 ? 0 : 1)) % 4];
            return [yn(`A ${c1} alma és a ${c2} labda azonos színű?`), c1 === c2 ? 1 : 0, c1 === c2 ? 'azonos' : 'különböző'];
        }),
        ...twenty(2, (i) => {
            const nums = evenOddList(i).map((n) => (g === 1 ? (n % 20) + 1 : n));
            const even = countEven(nums);
            return [`Hány páros szám van ezek között: ${nums.join(', ')}?`, even, `${even}`];
        }),
        ...twenty(3, (i) => {
            const nums = evenOddList(i + 3).map((n) => (g === 1 ? (n % 20) + 1 : n));
            const notEven = nums.length - countEven(nums);
            return [`A „nem páros” címkéjű dobozba hány szám kerül: ${nums.join(', ')}?`, notEven, `${notEven}`];
        }),
        ...twenty(4, (i) => {
            const redEven = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
            const pick = redEven[i % redEven.length];
            const ok = pick % 2 === 0 && pick <= (g === 1 ? 20 : 20);
            return [yn(`Két szempont: piros ÉS páros. A ${pick} bekerül a közös részbe?`), ok ? 1 : 0, 'páros'];
        }),
        ...twenty(5, (i) => {
            const n = 6 + (i % 5);
            const k = 2 + (i % 3);
            return [`${n} gyerek közül ${k} szemüveges. Hányan nem szemüvegesek?`, n - k, `${n}−${k}`];
        }),
        ...twenty(6, (i) => {
            const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const allEven = false;
            const claimEven = i % 2 === 0;
            if (claimEven) return [yn('A 1–10 számok halmazában mindegyik páros?'), allEven ? 1 : 0, 'van páratlan'];
            const has = nums.includes(5);
            return [yn('A 1–10 számok között van 5-ös?'), has ? 1 : 0, 'van'];
        }),
    ];
}

function buildRendszer(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const start = g === 1 ? 2 + (i % 6) : 10 + i;
            const step = g === 1 ? 2 : g === 2 ? 5 : 10;
            const seq = [start, start + step, start + 2 * step, start + 4 * step];
            return [`A sor: ${seq[0]}, ${seq[1]}, ${seq[2]}, ?, ${seq[3]}. Mi hiányzik?`, start + 3 * step, `+${step}`];
        }),
        ...twenty(2, (i) => {
            const lo = 1;
            const hi = g === 1 ? 10 : g === 2 ? 20 : 30;
            const secret = lo + (i % hi);
            const greater = secret;
            return [`Barkochba: 1-től ${hi}-ig gondoltam. Nagyobb, mint ${secret - 1}, kisebb, mint ${secret + 1}. Melyik szám?`, secret, `${secret}`];
        }),
        ...twenty(3, (i) => {
            return [`Egy logikai lapon 3 tulajdonság van. Hány tulajdonságban tér el, ha mind a 3 más?`, 3, '3'];
        }),
        ...twenty(4, (i) => {
            const rows = 2 + (i % 3);
            const cols = 2 + ((i + 1) % 3);
            return [`${rows} soros, ${cols} oszlopos táblázatban hány cella van?`, rows * cols, `${rows}·${cols}`];
        }),
        ...twenty(5, (i) => {
            const flavors = 2 + (i % 3);
            const scoops = 2;
            const n = flavors ** scoops;
            return [`${flavors} íz, ${scoops} gombóc, a sorrend számít. Hányféle fagylalt?`, n, `${flavors}^${scoops}`];
        }),
        ...twenty(6, (i) => {
            const total = g === 1 ? 8 : g === 2 ? 12 : 16;
            const missing = 1 + (i % 3);
            return [`Egy ${total} elemű teljes készletből ${missing} hiányzik. Hány elem látszik?`, total - missing, `${total}−${missing}`];
        }),
    ];
}

function buildAllitas(g: ElemNatGrade): Question[] {
    const facts: Array<[string, number, string]> = [
        [yn('A 2 páros szám?'), 1, 'páros'],
        [yn('A 7 páros szám?'), 0, 'páratlan'],
        [yn('A négyzetnek 4 oldala van?'), 1, '4'],
        [yn('A háromszögnek 4 csúcsa van?'), 0, '3'],
        [yn('A 10 nagyobb, mint a 8?'), 1, '10>8'],
        [yn('A 3 nagyobb, mint a 9?'), 0, '3<9'],
        [yn('5+3=8?'), 1, '8'],
        [yn('6−2=5?'), 0, '4'],
        [yn('A körnek vannak csúcsai?'), 0, 'nincs'],
        [yn('1 hét = 7 nap?'), 1, '7'],
        [yn('1 méter = 100 centiméter?'), 1, '100'],
        [yn('A 0 páros?'), 1, 'páros'],
        [yn('Minden négyzet téglalap?'), 1, 'speciális'],
        [yn('Minden téglalap négyzet?'), 0, 'nem'],
        [yn('2·5=10?'), 1, '10'],
        [yn('Egy kockának 6 lapja van?'), 1, '6'],
        [yn('Egy téglalapnak 3 szöge van?'), 0, '4'],
        [yn('9 kisebb, mint 10?'), 1, '9<10'],
        [yn('4+4=9?'), 0, '8'],
        [yn('A háromszögnek 3 oldala van?'), 1, '3'],
    ];
    return [
        ...twenty(1, (i) => facts[i]),
        ...twenty(2, (i) => {
            const a = 3 + (i % 6);
            const b = a + 2;
            return [`„A hmm-hmm ${b}.” Melyik szám teszi igazzá, ha 2-vel nagyobb, mint ${a}?`, b, `${a}+2`];
        }),
        ...twenty(3, (i) => {
            const nums = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20].slice(0, 5 + (i % 4));
            const allEven = nums.every((n) => n % 2 === 0);
            return [yn(`Ebben a halmazban mindegyik páros: ${nums.join(', ')}?`), allEven ? 1 : 0, allEven ? 'mindegyik' : 'nem'];
        }),
        ...twenty(4, (i) => {
            const start = [2, 4, 6, 8];
            const extra = 1 + (i % 9);
            const still = extra % 2 === 0;
            return [yn(`Az állítás: „mindegyik páros”. A ${start.join(', ')} halmazhoz hozzáteszünk egy ${extra}-t. Marad igaz?`), still ? 1 : 0, still ? 'páros' : 'elromlott'];
        }),
        ...twenty(5, (i) => {
            const host = 4 + (i % 8);
            return [`„A …-nak 4 lába van.” Hány lábú állat teszi igazzá?`, 4, '4'];
        }),
        ...twenty(6, (i) => {
            const n = 5 + (i % 6);
            const evens = Array.from({ length: n }, (_, k) => 2 * (k + 1));
            return [`Ellenpélda kell: „1-től ${2 * n}-ig minden szám páros.” Hány páratlan ellenpélda van?`, n, `${n}`];
        }),
    ];
}

function buildProblema(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const price = g === 1 ? 5 + (i % 6) : 20 + i * 3;
            const pay = price + (g === 1 ? 5 : 10);
            return [`A ceruza ${price} Ft. ${pay} Ft-tal fizetsz. Mennyi a visszajáró?`, pay - price, `${pay}−${price}`];
        }),
        ...twenty(2, (i) => {
            const right = 2 + (i % 4);
            const up = 1 + (i % 3);
            return [`A labirintusban ${right} lépés jobbra és ${up} lépés fel. Hány lépés az út?`, right + up, `${right}+${up}`];
        }),
        ...twenty(3, (i) => {
            const end = g === 1 ? 8 + (i % 8) : 30 + i * 2;
            const took = 3 + (i % 4);
            return [`Visszafelé: a végén ${end} korongom van. Előtte elvettem ${took}-at. Mennyi volt előtte?`, end + took, `${end}+${took}`];
        }),
        ...twenty(4, (i) => {
            const full = g === 1 ? 8 : 12;
            const pour = 2 + (i % 3);
            return [`A kancsóban ${full} dl van. Átöntök ${pour} dl-t. Mennyi marad?`, full - pour, `${full}−${pour}`];
        }),
        ...twenty(5, (i) => {
            const n = 3 + (i % 4);
            return [`Sudoku-sor: ${n} különböző szám kell. Hányféleképpen tölthető, ha mind különböző 1-től ${n}-ig?`, n === 3 ? 6 : n === 4 ? 24 : n === 5 ? 120 : 720, `${n}!`];
        }),
        ...twenty(6, (i) => {
            const mouse = 1 + (i % 4);
            const cat = 5;
            return [`Az egér ${mouse} mezőt lép, a macska ${cat}-öt. Hány mezővel van előrébb a macska egy-egy ilyen lépés után, ha egyszerre lépnek?`, cat - mouse, `${cat}−${mouse}`];
        }),
    ];
}

function buildSzoveg(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 3 + (i % 6);
            const b = 2 + (i % 5);
            return [`Annának ${a} ceruzája van, Bercinek ${b}. Összesen hány ceruzájuk van?`, a + b, `${a}+${b}`];
        }),
        ...twenty(2, (i) => {
            const all = g === 1 ? 12 + (i % 7) : 40 + i;
            const known = 5 + (i % 4);
            return [`${all} alma van. ${known}-et már megszámoltunk. Hányat kell még?`, all - known, `${all}−${known}`];
        }),
        ...twenty(3, (i) => {
            const [a, b] = addPair(g === 1 ? 1 : g, i);
            const left = Math.min(a, g === 1 ? 12 : a);
            const more = Math.min(b, g === 1 ? 8 : b);
            return [`A bal kezemben ${more}-vel több ceruza van, mint a jobbban. Jobbban ${left} van. Mennyi van balban?`, left + more, `${left}+${more}`];
        }),
        ...twenty(4, (i) => {
            const had = g === 1 ? 10 + (i % 8) : 40 + i * 2;
            const bought = 3 + (i % 5);
            const ate = 2 + (i % 3);
            return [`Volt ${had} cukorka. Vettem még ${bought}-et, ettem ${ate}-t. Mennyi maradt?`, had + bought - ate, `${had}+${bought}−${ate}`];
        }),
        ...twenty(5, (i) => {
            const red = 4 + (i % 6);
            const blue = 3 + (i % 5);
            const unused = 100;
            return [`Piroska ${red} almát szedett, kék plüssmacija ${unused} éves. A kék ládában ${blue} alma van. Hány alma van összesen?`, red + blue, `${red}+${blue}`];
        }),
        ...twenty(6, (i) => {
            const a = 6 + (i % 7);
            const b = 2 + (i % 4);
            const sum = a + b;
            return [`Ellenőrzés: ha ${a}+${b}=${sum}, akkor ${sum}−${a} mennyi?`, b, `${sum}−${a}`];
        }),
    ];
}

function buildValosag(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 4 + (i % 8);
            const b = 3 + (i % 6);
            return [`Melyik a több? ${a} szék vagy ${b} gyerek — add meg a különbséget (nagyobb − kisebb).`, Math.abs(a - b), `|${a}−${b}|`];
        }),
        ...twenty(2, (i) => {
            const kids = 6 + (i % 7);
            const hats = kids - (i % 2);
            return [yn(`Jut-e mind a ${kids} gyereknek sapka, ha ${hats} sapka van?`), hats >= kids ? 1 : 0, hats >= kids ? 'igen' : 'nem'];
        }),
        ...twenty(3, (i) => {
            const n = g === 1 ? 4 + (i % 6) : 8 + (i % 9);
            return [`Ránézésre: 2 sorban, soronként ${n / 2 > 0 && n % 2 === 0 ? n / 2 : n} korong. Ha páros ${n}, mennyi a darabszám?`, n % 2 === 0 ? n : n + 1, 'darab'];
        }),
        ...twenty(4, (i) => {
            const n = g === 1 ? 6 + (i % 8) : 12 + (i % 10);
            const left = 1 + (i % Math.max(1, n - 1));
            return [`A ${n} korongot kétfelé bontjuk. Az egyik rész ${left}. Mennyi a másik?`, n - left, `${n}−${left}`];
        }),
        ...twenty(5, (i) => {
            const n = g === 1 ? 8 + i : g === 2 ? 28 + i : 64 + i * 3;
            return [`${n} cm — hány centiméter? Írd a mérőszámot.`, n, `${n}`];
        }),
        ...twenty(6, (i) => {
            const a = 7 + (i % 9);
            const b = 10 + (i % 6);
            return [`Melyik jel igaz: ha a=${a}, b=${b}, akkor a<b? 1=igen 0=nem`, a < b ? 1 : 0, a < b ? '<' : 'nem'];
        }),
    ];
}

function buildSzamlalas(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const n = g === 1 ? 8 + i : g === 2 ? 20 + i * 2 : 100 + i * 5;
            return [`Számlálj ${n}-ig egyesével. Melyik az utolsó kimondott szám?`, n, `${n}`];
        }),
        ...twenty(2, (i) => {
            const step = i % 3 === 0 ? 2 : i % 3 === 1 ? 5 : 10;
            const k = 3 + (i % 6);
            return [`Számlálj ${step}-esével ${k} lépést 0-tól. Hol jársz?`, step * k, `${step}·${k}`];
        }),
        ...twenty(3, (i) => {
            const start = g === 1 ? 16 : g === 2 ? 60 : 200;
            const step = g === 1 ? 2 : g === 2 ? 6 : 10;
            const k = 3 + (i % 4);
            return [`${start}-tól ${step}-esével visszafelé ${k} lépés. Hol jársz?`, start - step * k, `${start}−${step}·${k}`];
        }),
        ...twenty(4, (i) => {
            const real = g === 1 ? 18 + (i % 3) : 47 + i;
            const guess = real + (i % 2 === 0 ? 2 : -3);
            return [`Becsültél ${guess}-t, pontosan ${real} van. Mennyi a tévedés (abszolút)?`, Math.abs(real - guess), `|${real}−${guess}|`];
        }),
        ...twenty(5, (i) => {
            const groups = 4 + (i % 5);
            const each = g === 1 ? 5 : 10;
            return [`${groups} csomag, csomagonként ${each}. Mennyi összesen?`, groups * each, `${groups}·${each}`];
        }),
        ...twenty(6, (i) => {
            const first = g === 1 ? 12 + (i % 6) : 80 + i;
            const second = first + (i % 2 === 0 ? -2 : 3);
            return [`Először ${first}-et tippeltél, újra becsülve ${second}. Mennyit változtattál (abszolút)?`, Math.abs(second - first), `|${second}−${first}|`];
        }),
    ];
}

function buildRendezes(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 4 + i;
            const b = a + 3;
            const c = a + 1;
            const mid = [a, b, c].sort((x, y) => x - y)[1];
            return [`Rendezd: ${b}, ${a}, ${c}. Melyik a középső?`, mid, `${mid}`];
        }),
        ...twenty(2, (i) => {
            const n = 1 + (i % 10);
            return [`Hányadik a sorban, aki elölről a ${n}.? Írd a sorszámot.`, n, `${n}.`];
        }),
        ...twenty(3, (i) => {
            const n = g === 1 ? 7 + (i % 10) : g === 2 ? 34 + i : 250 + i * 4;
            return [`Mi ${n} egyes szomszédja fölfelé?`, n + 1, `${n}+1`];
        }),
        ...twenty(4, (i) => {
            const n = (i % 10) * 10 + (i % 10);
            const pos = (i % 10) + 1;
            return [`A 10×10-es táblán (1–100) a ${pos}. sor első száma?`, (pos - 1) * 10 + 1, `${(pos - 1) * 10 + 1}`];
        }),
        ...twenty(5, (i) => {
            const nums = [3 + i, 8 + i, 1 + i, 12 + (i % 5), 5 + i].map((n) => (g === 1 ? (n % 20) + 1 : n));
            const sorted = [...nums].sort((a, b) => a - b);
            return [`Növekvő sor: ${nums.join(', ')}. Melyik a legkisebb?`, sorted[0], `${sorted[0]}`];
        }),
        ...twenty(6, (i) => {
            const n = g === 1 ? 14 + (i % 6) : g === 2 ? 67 + i : g === 3 ? 348 + i * 5 : 2348 + i * 11;
            const nearestTen = Math.round(n / 10) * 10;
            return g === 1
                ? [`Hol van a ${n} a 0–20 számegyenesen? Írd a számot.`, n, `${n}`]
                : [`Kerekítsd ${n}-et tízesekre.`, nearestTen, `${nearestTen}`];
        }),
    ];
}

function buildTulajdonsag(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const n = (g === 1 ? 1 : 10) + i;
            return [yn(`A ${n} páros szám?`), n % 2 === 0 ? 1 : 0, n % 2 === 0 ? 'páros' : 'páratlan'];
        }),
        ...twenty(2, (i) => {
            const n = g === 1 ? 8 + i : g === 2 ? 24 + i : g === 3 ? 308 + i : 4028 + i;
            return [`Hány jegyű a ${n}?`, String(n).length, `${String(n).length}`];
        }),
        ...twenty(3, (i) => {
            const n = 10 + i * (g === 1 ? 1 : 3);
            const digitSum = String(n)
                .split('')
                .reduce((s, d) => s + Number(d), 0);
            return [`${n} számjegyeinek összege?`, digitSum, `${digitSum}`];
        }),
        ...twenty(4, (i) => {
            const n = 3 + (i % 8);
            const k = 2 + (i % 3);
            return [`${n}-nek a ${k}-szorosa?`, n * k, `${n}·${k}`];
        }),
        ...twenty(5, (i) => {
            const r = ROMANS[i];
            return [`Római szám: ${r}. Arab jellel?`, romanValue(r), `${romanValue(r)}`];
        }),
        ...twenty(6, (i) => {
            const n = g === 1 ? 9 + (i % 10) : 40 + i;
            return [`Kitalálós: páros? ${n % 2 === 0 ? 'igen' : 'nem'}. 2-vel nagyobb, mint ${n - 2}. Melyik szám?`, n, `${n}`];
        }),
    ];
}

function buildHelyiertek(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const ones = 12 + i;
            const tens = Math.floor(ones / 10);
            const rem = ones % 10;
            return [`${ones} korongot tízesével csomagolunk. Hány teljes tízes csomag lesz?`, tens, `${tens}`];
        }),
        ...twenty(2, (i) => {
            const t = 1 + (i % (g === 1 ? 1 : 8));
            const e = i % 10;
            const n = t * 10 + e;
            return [`${t} tízes és ${e} egyes. Melyik szám?`, n, `${n}`];
        }),
        ...twenty(3, (i) => {
            const n = g === 1 ? 14 + (i % 6) : g === 2 ? 64 + i : g === 3 ? 415 + i : 4512 + i;
            const d = placeDigits(n);
            return [`${n} leltár: hány egyes (a tízesek után)?`, d.e, `${d.e}`];
        }),
        ...twenty(4, (i) => {
            const n = g === 1 ? 23 + i <= 20 ? 13 + (i % 7) : 17 : g === 2 ? 58 + i : 347 + i;
            const clamped = g === 1 ? 10 + (i % 10) : n;
            const d = placeDigits(clamped);
            return [`Írd ${clamped} értékét: tízesek·10 + egyesek. Mennyi a tízesek száma?`, d.t, `${d.t}`];
        }),
        ...twenty(5, (i) => {
            const n = g === 1 ? 15 + (i % 5) : g === 2 ? 73 + i : g === 3 ? 508 + i : 2704 + i;
            const d = placeDigits(n);
            const place = i % 3;
            if (place === 0) return [`${n} egyes helyi értékén álló számjegy (alaki érték)?`, d.e, `${d.e}`];
            if (place === 1) return [`${n} tízes helyi értékén álló számjegy?`, d.t, `${d.t}`];
            return [`${n} egyes helyén álló jegy valódi értéke?`, d.e, `${d.e}`];
        }),
        ...twenty(6, (i) => {
            const a = g === 1 ? 12 + (i % 7) : g === 2 ? 45 + i : 320 + i * 4;
            const b = a + (i % 2 === 0 ? 3 : -2);
            return [yn(`${a} nagyobb, mint ${b}?`), a > b ? 1 : 0, a > b ? 'nagyobb' : 'nem'];
        }),
    ];
}

function buildMeres(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 8 + (i % 7);
            const b = 5 + (i % 6);
            return [`Az egyik szalag ${a} arasz, a másik ${b}. Hány arasszal hosszabb a nagyobb?`, Math.abs(a - b), `|${a}−${b}|`];
        }),
        ...twenty(2, (i) => {
            const unit = 3;
            const count = 4 + (i % 5);
            return [`Egy pálcika ${unit} cm. ${count} pálcika hossza?`, unit * count, `${unit}·${count}`];
        }),
        ...twenty(3, (i) => {
            const m = i % 4 === 0 ? 1 : 0;
            const cm = m === 1 ? 100 : 10 + i * 3;
            return m === 1 ? [`1 m hány cm?`, 100, '100'] : [`${cm} cm = ? cm`, cm, `${cm}`];
        }),
        ...twenty(4, (i) => {
            const h = i % 12;
            return [`A mutató az ${h === 0 ? 12 : h} órán áll (egész óra). Hány óra telt el éjféltől?`, h === 0 ? 12 : h, `${h === 0 ? 12 : h}`];
        }),
        ...twenty(5, (i) => {
            const coins = [1, 2, 5, 10, 20];
            const c = coins[i % coins.length];
            const n = 2 + (i % 5);
            return [`${n} darab ${c} Ft-os. Mennyi a pénz?`, n * c, `${n}·${c}`];
        }),
        ...twenty(6, (i) => {
            const a = 3 + (i % 6);
            const b = 4 + (i % 5);
            return [`Téglalap oldalai ${a} és ${b} egység. Kerülete?`, 2 * (a + b), `2·(${a}+${b})`];
        }),
    ];
}

function buildMuvelet(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const [a, b] = addPair(g === 4 ? 2 : g, i);
            return [`Hozzáteszek ${a}-hoz ${b}-t. Mennyi lesz?`, a + b, `${a}+${b}`];
        }),
        ...twenty(2, (i) => {
            const [big, small] = subPair(g === 4 ? 2 : g, i);
            return [`${big}-ből elveszek ${small}-t. Mennyi marad?`, big - small, `${big}−${small}`];
        }),
        ...twenty(3, (i) => {
            const n = 2 + (i % 8);
            const k = g === 1 ? 2 + (i % 3) : 2 + (i % 5);
            return [`${k} darab ${n}-es csoport. Mennyi összesen? (szorzás)`, n * k, `${k}·${n}`];
        }),
        ...twenty(4, (i) => {
            const n = g === 1 ? 12 : 20 + (i % 5) * 2;
            const d = 2 + (i % 4);
            if (n % d !== 0) {
                const ok = d * Math.floor(n / d);
                return [`${ok} korongot ${d} egyenlő csoportba osztunk. Egy csoportban?`, ok / d, `${ok}:${d}`];
            }
            return [`${n} korongot ${d} egyenlő csoportba osztunk. Egy csoportban?`, n / d, `${n}:${d}`];
        }),
        ...twenty(5, (i) => {
            const d = 3 + (i % 4);
            const qot = 2 + (i % 5);
            const rem = 1 + (i % (d - 1));
            const n = d * qot + rem;
            return [`${n} : ${d} osztásnál mennyi a maradék?`, rem, `${n}=${d}·${qot}+${rem}`];
        }),
        ...twenty(6, (i) => {
            const a = 4 + (i % 7);
            const b = 3 + (i % 5);
            return [`Piroska ${a} almát szedett, még ${b}-et kapott. Melyik művelet eredménye a történet?`, a + b, `${a}+${b}`];
        }),
    ];
}

function buildMuvtul(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 4 + (i % 8);
            const b = 7 + (i % 6);
            return [yn(`${a}+${b} ugyanannyi, mint ${b}+${a}?`), 1, 'felcserélhető'];
        }),
        ...twenty(2, (i) => {
            const a = 5 + (i % 6);
            const b = 6 + (i % 5);
            return [`Babos: ${a}+${b}=${a + b}. Mennyi ${a + b}−${a}?`, b, `${b}`];
        }),
        ...twenty(3, (i) => {
            const a = 8 + (i % 9);
            const b = 5 + (i % 7);
            return [`□ + ${b} = ${a + b}. Mi a □?`, a, `${a}`];
        }),
        ...twenty(4, (i) => {
            const a = 3 + (i % 5);
            const x = 4 + (i % 4);
            const y = 2 + (i % 3);
            return [`${a}·${x + y} = ${a}·${x} + ${a}·${y}. Mennyi az érték?`, a * (x + y), `${a}·${x + y}`];
        }),
        ...twenty(5, (i) => {
            const a = 10 + (i % 8);
            const b = 4 + (i % 5);
            return [`Ha ${a}+${b} összegében a ${b}-t 1-gyel növeled, mennyivel nő az összeg?`, 1, '1'];
        }),
        ...twenty(6, (i) => {
            const a = 9 + (i % 8);
            const b = 6 + (i % 5);
            return [`Ellenőrzés: ${a}−${b} után visszaadod ${b}-t. Mennyi lesz?`, a, `${a}`];
        }),
    ];
}

function buildSzobeli(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = g === 1 ? 8 + (i % 5) : 28 + i;
            const toTen = g === 1 ? 10 - (a % 10 || 10) : 10 - (a % 10);
            const need = a % 10 === 0 ? 0 : 10 - (a % 10);
            return [`Mennyit kell hozzáadni ${a}-hoz, hogy a következő kerek tízes legyen?`, need, `${need}`];
        }),
        ...twenty(2, (i) => {
            const a = g === 1 ? 7 + (i % 6) : 47 + i;
            const b = g === 1 ? 5 + (i % 4) : 8 + (i % 7);
            return [`${a}+${b} = ? (tízesátlépéssel is számolhatsz)`, a + b, `${a}+${b}`];
        }),
        ...twenty(3, (i) => {
            const price = g === 1 ? 7 + (i % 8) : 34 + i;
            const pay = g === 1 ? 10 : Math.ceil(price / 10) * 10;
            return [`Boltos: ${price} Ft a termék, ${pay} Ft-tal fizetsz. Visszajáró?`, pay - price, `${pay}−${price}`];
        }),
        ...twenty(4, (i) => {
            const a = g === 1 ? 12 + (i % 6) : g === 2 ? 30 + i : 300 + i * 10;
            const b = g === 1 ? 5 : g === 2 ? 20 : 200;
            return [`Analógia: ${a}+${b} = ?`, a + b, `${a}+${b}`];
        }),
        ...twenty(5, (i) => {
            const n = 2 + (i % 8);
            return [`6·8 és 6·4 kapcsolata: 6·8 = 6·4 · □. Mi a □?`, 2, '2'];
        }),
        ...twenty(6, (i) => {
            const a = g === 1 ? 18 + (i % 3) : g === 2 ? 67 + i : 348 + i * 7;
            const b = g === 1 ? 9 + (i % 4) : g === 2 ? 24 + (i % 10) : 120 + i;
            const est = Math.round(a / 10) * 10 + Math.round(b / 10) * 10;
            return [`Becsüld ${a}+${b} összegét tízesekre kerekített tagokkal. Mennyi a becslés?`, est, `${est}`];
        }),
    ];
}

function buildFejben(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 6 + (i % 9);
            const b = 4 + (i % 8);
            const sum = a + b;
            const use = g === 1 && sum > 20 ? [8, 7] : [a, b];
            return [`Fejben: ${use[0]}+${use[1]} = ?`, use[0] + use[1], `${use[0]}+${use[1]}`];
        }),
        ...twenty(2, (i) => {
            const t = (1 + (i % 8)) * 10;
            const u = 3 + (i % 6);
            return [`${t}+${u} = ?`, t + u, `${t}+${u}`];
        }),
        ...twenty(3, (i) => {
            const a = g === 1 ? 11 + (i % 8) : 21 + i;
            const b = 4 + (i % 6);
            return [`${a}+${b} = ?`, a + b, `${a}+${b}`];
        }),
        ...twenty(4, (i) => {
            const a = g === 1 ? 12 + (i % 5) : 34 + i;
            const b = g === 1 ? 5 + (i % 4) : 12 + (i % 15);
            const sum = a + b;
            if (g === 1 && sum > 20) return [`${10 + (i % 5)}+${4 + (i % 4)} = ?`, 10 + (i % 5) + 4 + (i % 4), 'összeg'];
            return [`${a}+${b} = ?`, sum, `${a}+${b}`];
        }),
        ...twenty(5, (i) => {
            const n = 1 + (i % 10);
            const k = i % 3 === 0 ? 2 : i % 3 === 1 ? 5 : 10;
            return [`${n}·${k} = ?`, n * k, `${n}·${k}`];
        }),
        ...twenty(6, (i) => {
            const a = g === 1 ? 20 : g === 2 ? 80 : g === 3 ? 400 : 4000;
            const b = g === 1 ? 10 : g === 2 ? 20 : g === 3 ? 300 : 2000;
            return [`Analóg nagy: ${a}+${b} = ?`, a + b, `${a}+${b}`];
        }),
    ];
}

function buildAlkotas(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const cubes = 3 + (i % 6);
            return [`${cubes} kockából tornyot építünk. Hány kocka kell?`, cubes, `${cubes}`];
        }),
        ...twenty(2, (i) => {
            const a = 2;
            const b = 1;
            const period = a + b;
            const n = 3 + (i % 5);
            return [`Sorminta: 2 háromszög, 1 kör ismétlődik. ${n} teljes ismétlésben hány alakzat van?`, period * n, `${period}·${n}`];
        }),
        ...twenty(3, (i) => {
            const w = 2 + (i % 3);
            const d = 2 + ((i + 1) % 3);
            return [`Téglalap alaprajz: ${w} × ${d} kockányi. Hány kocka kell a padlóhoz?`, w * d, `${w}·${d}`];
        }),
        ...twenty(4, (i) => {
            const half = 4 + (i % 5);
            return [`Tükrös papírhajtogatás: a fél oldalon ${half} lyuk. Szétnyitva hány lyuk?`, half * 2, `${half}·2`];
        }),
        ...twenty(5, (i) => {
            const tangram = 7;
            return [`A tangram ${tangram} darabból áll. Hány darab kell a teljes képhez?`, tangram, '7'];
        }),
        ...twenty(6, (i) => {
            const n = 2 + (i % 3);
            const colors = 2;
            const ways = colors ** n;
            return [`${n} sávos zászló, ${colors} szín, sorrend számít. Hány zászló?`, ways, `${colors}^${n}`];
        }),
    ];
}

function buildAlakzat(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const isSolid = i % 2 === 0;
            return [yn(isSolid ? 'A dobókocka test?' : 'A körlap síkidom?'), 1, 'igen'];
        }),
        ...twenty(2, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Hány oldala van a háromszögnek?`, 3, '3'];
            if (kind === 1) return [`Hány oldala van a négyszögnek?`, 4, '4'];
            return [yn('A körnek van csúcsa?'), 0, 'nincs'];
        }),
        ...twenty(3, (i) => {
            const kind = i % 4;
            if (kind === 0) return [`Hány csúcsa van a téglalapnak?`, 4, '4'];
            if (kind === 1) return [`Hány átlója van a téglalapnak?`, 2, '2'];
            if (kind === 2) return [`Hány szimmetriatengelye van a négyzetnek?`, 4, '4'];
            return [yn('A négyzet speciális téglalap?'), 1, 'igen'];
        }),
        ...twenty(4, (i) => {
            const kind = i % 4;
            if (kind === 0) return [`Hány lapja van a téglatestnek?`, 6, '6'];
            if (kind === 1) return [`Hány csúcsa van a kockának?`, 8, '8'];
            if (kind === 2) return [`Hány éle van a kockának?`, 12, '12'];
            return [yn('A kocka speciális téglatest?'), 1, 'igen'];
        }),
        ...twenty(5, (i) => {
            const n = 3 + (i % 6);
            return [`Egy ${n}-szögnek hány csúcsa van?`, n, `${n}`];
        }),
        ...twenty(6, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Hány derékszöge van a téglalapnak?`, 4, '4'];
            if (kind === 1) return [yn('A derékszög nagyobb, mint a hegyesszög?'), 1, 'igen'];
            return [`Egy csúcsból hány él indul a téglatesten?`, 3, '3'];
        }),
    ];
}

function buildTukor(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            return [yn('Ha a párod a tükörkép, a jobb kezednek a bal keze felel meg?'), 1, 'tükör'];
        }),
        ...twenty(2, (i) => {
            const n = i % 2 === 0 ? 2 : 1;
            return [`A téglalapnak (nem négyzet) hány tükörtengelye van?`, 2, '2'];
        }),
        ...twenty(3, (i) => {
            const steps = 3 + (i % 5);
            return [`Az alakzatot ${steps} mezővel jobbra toltuk. Hány mezővel kell vissza a helyére?`, steps, `${steps}`];
        }),
        ...twenty(4, (i) => {
            const cells = 4 + (i % 6);
            return [`Tükrös sorminta: a minta ${cells} cellás fele. A teljes periódus hossza?`, cells * 2, `${cells}·2`];
        }),
        ...twenty(5, (i) => {
            const side = 3 + (i % 4);
            return [`Négyzetrácson a ${side} oldalú négyzet kétszeresére nagyítva hány rácsoldalú?`, side * 2, `${side}·2`];
        }),
        ...twenty(6, (i) => {
            const isMirror = i % 2 === 0;
            return [yn(isMirror ? 'A tükörkép megfordítja a balsőt?' : 'Az eltolás megfordítja a balsőt?'), isMirror ? 1 : 0, isMirror ? 'tükör' : 'eltolás'];
        }),
    ];
}

function buildTajekozas(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const r = 2 + (i % 4);
            const u = 1 + (i % 3);
            return [`${r} lépés jobbra, ${u} lépés fel. Hány lépés összesen?`, r + u, `${r}+${u}`];
        }),
        ...twenty(2, (i) => {
            const n = 3 + (i % 5);
            return [`${n} gyerek áll sorban. Hány szomszédpár van (egymás mellett)?`, n - 1, `${n}−1`];
        }),
        ...twenty(3, (i) => {
            const steps = [2, 3, 1, 4][i % 4];
            const times = 2 + (i % 3);
            return [`Vonalvezetés: ${steps} lépés fel, ismételd ${times}-szor. Hány lépés felé?`, steps * times, `${steps}·${times}`];
        }),
        ...twenty(4, (i) => {
            const col = 1 + (i % 8);
            const row = 1 + (i % 8);
            return [`Négyzetháló: a (${col}; ${row}) mező oszlopszáma?`, col, `${col}`];
        }),
        ...twenty(5, (i) => {
            const a = 2 + (i % 5);
            const b = 3 + (i % 4);
            return [`Térképkereső: A${a} és ${b}. oszlop. Add meg az oszlopszámok összegét.`, a + b, `${a}+${b}`];
        }),
        ...twenty(6, (i) => {
            const there = 5 + (i % 8);
            return [`Oda ${there} lépés. Ugyanezen az úton vissza. Hány lépés oda-vissza?`, there * 2, `${there}·2`];
        }),
    ];
}

function buildSzabaly(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const nums = [2, 4, 6, 8, 9 + (i % 2 === 0 ? 0 : 1)];
            const odd = nums.filter((n) => n % 2);
            return [`Kakukktojás a ${nums.join(', ')} sorban: melyik a páratlan?`, odd[0] ?? 9, `${odd[0] ?? 9}`];
        }),
        ...twenty(2, (i) => {
            const start = g === 1 ? 2 : 5;
            const step = g === 1 ? 2 : 3;
            const k = 4 + (i % 5);
            return [`Sorozat: ${start}-től ${step}-esével. A ${k}. elem?`, start + (k - 1) * step, `${start}+${k - 1}·${step}`];
        }),
        ...twenty(3, (i) => {
            const months = 12;
            const later = 1 + (i % 6);
            return [`Hány hónap van egy évben? Utána: ${later} hónappal később hány hónapot léptünk?`, later, `${later}`];
        }),
        ...twenty(4, (i) => {
            const add = 2 + (i % 5);
            const x = 3 + (i % 8);
            return [`Gép: +${add}. Ha bemegy ${x}, mi jön ki?`, x + add, `${x}+${add}`];
        }),
        ...twenty(5, (i) => {
            const x = 4 + (i % 7);
            const y = 3 * x;
            return [`Táblázat: x → 3x. Ha x=${x}, mennyi y?`, y, `3·${x}`];
        }),
        ...twenty(6, (i) => {
            const add = 5 + (i % 4);
            const out = 12 + i;
            return [`A +${add} gép megfordítása. Ha kimenet ${out}, mi volt a bemenet?`, out - add, `${out}−${add}`];
        }),
    ];
}

function buildAdat(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 4 + (i % 6);
            const b = 3 + (i % 5);
            const c = 2 + (i % 4);
            return [`Kedvenc ital: ${a} tea, ${b} kakaó, ${c} víz. Hány gyereket kérdeztünk?`, a + b + c, `${a}+${b}+${c}`];
        }),
        ...twenty(2, (i) => {
            const cols = [3, 5, 2, 4, 1];
            const idx = i % 5;
            return [`Tornasor: az oszlopok ${cols.join(', ')} fősek. A ${idx + 1}. oszlopban hányan állnak?`, cols[idx], `${cols[idx]}`];
        }),
        ...twenty(3, (i) => {
            const bars = [2, 6, 4, 8, 3];
            const idx = i % 5;
            return [`Oszlopdiagram: magasságok ${bars.join(', ')}. A ${idx + 1}. oszlop értéke?`, bars[idx], `${bars[idx]}`];
        }),
        ...twenty(4, (i) => {
            const data = [3 + i, 9 + (i % 4), 1 + (i % 5), 7, 4 + (i % 3)];
            return [`Adatok: ${data.join(', ')}. Melyik a legnagyobb?`, Math.max(...data), `${Math.max(...data)}`];
        }),
        ...twenty(5, (i) => {
            const data = [5, 2, 8, 2, 6];
            const val = data[i % 5];
            const freq = data.filter((n) => n === val).length;
            return [`Táblázatban a ${val} hányszor szerepel: 5, 2, 8, 2, 6?`, freq, `${freq}`];
        }),
        ...twenty(6, (i) => {
            const data = [4, 7, 4, 9, 4 + (i % 2)];
            const min = Math.min(...data);
            return [`Az adatok: ${data.join(', ')}. A legkisebb?`, min, `${min}`];
        }),
    ];
}

function buildVeletlen(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const kind = i % 3;
            if (kind === 0) return [`Kockával 7-et dobunk. 0=lehetetlen, 1=biztos, 2=lehetséges, de nem biztos`, 0, 'lehetetlen'];
            if (kind === 1) return [`Kockával 1 és 6 közötti egész számot dobunk. 0=lehetetlen, 1=biztos, 2=lehetséges`, 1, 'biztos'];
            return [`Kockával 6-ost dobunk. 0=lehetetlen, 1=biztos, 2=lehetséges, de nem biztos`, 2, 'lehetséges'];
        }),
        ...twenty(2, (i) => {
            const red = 3 + (i % 3);
            const blue = 1 + (i % 2);
            return [`Kalapban ${red} piros és ${blue} kék cédula. Hány cédula van összesen?`, red + blue, `${red}+${blue}`];
        }),
        ...twenty(3, (i) => {
            const red = 5;
            const blue = 1 + (i % 3);
            return [yn(`Több a piros (${red}), mint a kék (${blue}). Pirosat húzni valószínűbb?`), 1, 'piros'];
        }),
        ...twenty(4, (i) => {
            const trials = 10 + i;
            const hits = 3 + (i % 5);
            return [`${trials} kísérletből ${hits}-szer jött piros. Hányszor nem jött piros?`, trials - hits, `${trials}−${hits}`];
        }),
        ...twenty(5, (i) => {
            const tip = 4 + (i % 6);
            const seen = 6 + (i % 5);
            return [`Tippeltél ${tip}-et, mértél ${seen}-et. Mennyi a különbség (abszolút)?`, Math.abs(seen - tip), `|${seen}−${tip}|`];
        }),
        ...twenty(6, (i) => {
            return [yn('„Lehetetlen, hogy kockával 1-est dobjunk.” Ez igaz állítás?'), 0, 'ellenpélda: 1'];
        }),
    ];
}

function buildIrasPm(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 27 + i;
            const b = 18 + (i % 9);
            return [`Írásbeli: ${a}+${b} = ?`, a + b, `${a}+${b}`];
        }),
        ...twenty(2, (i) => {
            const a = 270 + i * 3;
            const b = 180 + i * 2;
            return [`Írásbeli: ${a}+${b} = ?`, a + b, `${a}+${b}`];
        }),
        ...twenty(3, (i) => {
            const a = 46 + i;
            const b = 29 + (i % 8);
            return [`□ + ${b} = ${a + b}. Mi a □?`, a, `${a}`];
        }),
        ...twenty(4, (i) => {
            const a = g === 3 ? 83 + i : 508 + i * 3;
            const b = g === 3 ? 27 + (i % 15) : 169 + i;
            return [`Írásbeli: ${a}−${b} = ?`, a - b, `${a}−${b}`];
        }),
        ...twenty(5, (i) => {
            const a = 348 + i * 5;
            const b = 271 + i * 3;
            const est = Math.round(a / 100) * 100 + Math.round(b / 100) * 100;
            return [`Becsüld ${a}+${b} összegét százasokra kerekített tagokkal.`, est, `${est}`];
        }),
        ...twenty(6, (i) => {
            const a = 156 + i * 4;
            const b = 78 + i * 2;
            return [`Ellenőrzés: ${a}−${b} után ${b}-t visszaadva mennyi?`, a, `${a}`];
        }),
    ];
}

function buildIrasSzor(g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const a = 23 + i;
            const b = 2 + (i % 8);
            return [`Írásbeli: ${a}·${b} = ?`, a * b, `${a}·${b}`];
        }),
        ...twenty(2, (i) => {
            const a = 14 + (i % 20);
            const t = 10;
            return [`${a}·${t} = ?`, a * t, `${a}·10`];
        }),
        ...twenty(3, (i) => {
            const a = g === 3 ? 12 + (i % 15) : 24 + i;
            const b = 11 + (i % 6);
            return [`Írásbeli: ${a}·${b} = ?`, a * b, `${a}·${b}`];
        }),
        ...twenty(4, (i) => {
            const d = 2 + (i % 7);
            const qot = 12 + (i % 9);
            const n = d * qot;
            return [`Írásbeli: ${n} : ${d} = ?`, qot, `${n}:${d}`];
        }),
        ...twenty(5, (i) => {
            const d = 3 + (i % 6);
            const qot = 8 + (i % 7);
            const rem = 1 + (i % (d - 1 || 1));
            const n = d * qot + rem;
            return [`${n} : ${d} osztásnál a hányados?`, qot, `${qot} maradék ${rem}`];
        }),
        ...twenty(6, (i) => {
            const a = 21 + i;
            const b = 4 + (i % 5);
            const est = Math.round(a / 10) * 10 * b;
            return [`Becsüld ${a}·${b} szorzatát: ${a}-t tízesekre kerekítve.`, est, `${Math.round(a / 10) * 10}·${b}`];
        }),
    ];
}

function buildTortresz(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const parts = [2, 3, 4, 6, 8][i % 5];
            return [`Az egészet ${parts} egyenlő részre osztjuk. Hány egyenlő rész van?`, parts, `${parts}`];
        }),
        ...twenty(2, (i) => {
            const whole = [8, 12, 16, 18, 20][i % 5];
            const d = [2, 3, 4, 6][i % 4];
            if (whole % d !== 0) {
                const w = d * (2 + (i % 4));
                return [`1/${d} rész ${w}-ből mennyi?`, w / d, `${w}/${d}`];
            }
            return [`1/${d} rész ${whole}-ből mennyi?`, whole / d, `${whole}/${d}`];
        }),
        ...twenty(3, (i) => {
            const d = [3, 4, 5, 6][i % 4];
            const k = 2 + (i % (d - 1));
            const whole = d * (3 + (i % 3));
            return [`${k}/${d} rész ${whole}-ből mennyi?`, (k * whole) / d, `${k}·${whole}/${d}`];
        }),
        ...twenty(4, (i) => {
            const a = 2;
            const b = 4;
            return [yn(`1/${b} kisebb, mint 1/${a}?`), 1, '1/4<1/2'];
        }),
        ...twenty(5, (i) => {
            const d = 4;
            const n = 2;
            return [`${n}/${d} hányad része az egésznek, ha 2/4=1/□. Mi a □?`, 2, '1/2'];
        }),
        ...twenty(6, (i) => {
            const pizza = 8;
            const ate = 1 + (i % 6);
            return [`A pizza ${pizza} szeletes. ${ate} szeletet ettél. Hány szelet maradt?`, pizza - ate, `${pizza}−${ate}`];
        }),
    ];
}

function buildNegativ(_g: ElemNatGrade): Question[] {
    return [
        ...twenty(1, (i) => {
            const before = 2 + (i % 5);
            return [`Az iskola előtt ${before} évvel. Hány évvel korábbi ez, mint az iskolakezdés?`, before, `${before}`];
        }),
        ...twenty(2, (i) => {
            const t = -8 + i;
            return [`A hőmérő ${t} °C-ot mutat. Írd a hőmérsékletet (negatív is lehet).`, t, `${t}`];
        }),
        ...twenty(3, (i) => {
            const depth = 3 + (i % 12);
            return [`A tenger szintje alatt ${depth} méter. Írd a magasságot (negatív szám).`, -depth, `−${depth}`];
        }),
        ...twenty(4, (i) => {
            const cash = 10 + i;
            const debt = 4 + (i % 7);
            return [`${cash} Ft készpénz és ${debt} Ft adósság. Mennyi a vagyon (készpénz−adósság)?`, cash - debt, `${cash}−${debt}`];
        }),
        ...twenty(5, (i) => {
            const a = -5 + (i % 8);
            const b = -2 + (i % 6);
            return [yn(`${a} kisebb, mint ${b}?`), a < b ? 1 : 0, a < b ? 'kisebb' : 'nem'];
        }),
        ...twenty(6, (i) => {
            const start = -3 + (i % 5);
            const change = 4 + (i % 4);
            return [`Reggel ${start} °C, ${change} fokot melegedett. Hány fok lett?`, start + change, `${start}+${change}`];
        }),
    ];
}

const BUILDERS: Record<ElemNatSlug, (g: ElemNatGrade) => Question[]> = {
    halmaz: buildHalmaz,
    rendszer: buildRendszer,
    allitas: buildAllitas,
    problema: buildProblema,
    szoveg: buildSzoveg,
    valosag: buildValosag,
    szamlalas: buildSzamlalas,
    rendezes: buildRendezes,
    tulajdonsag: buildTulajdonsag,
    helyiertek: buildHelyiertek,
    meres: buildMeres,
    muvelet: buildMuvelet,
    muvtul: buildMuvtul,
    szobeli: buildSzobeli,
    fejben: buildFejben,
    alkotas: buildAlkotas,
    alakzat: buildAlakzat,
    tukor: buildTukor,
    tajekozas: buildTajekozas,
    szabaly: buildSzabaly,
    adat: buildAdat,
    veletlen: buildVeletlen,
    'iras-pm': buildIrasPm,
    'iras-szor': buildIrasSzor,
    tortresz: buildTortresz,
    negativ: buildNegativ,
    ...ELEM_NAT_UPPER_BUILDERS,
} as Record<ElemNatSlug, (g: ElemNatGrade) => Question[]>;

const cache = new Map<string, Question[]>();

export function getElemNatPracticeQuestions(topicId: string): Question[] | null {
    const parsed = parseElemNatTopicId(topicId);
    if (!parsed) return null;
    const hit = cache.get(topicId);
    if (hit) return hit;
    const builder = BUILDERS[parsed.slug];
    if (!builder) return null;
    const list = builder(parsed.grade);
    assertSixByTwenty(topicId, list);
    cache.set(topicId, list);
    return list;
}
