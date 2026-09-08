import type { Question } from './types';
import { coordPlaneFigure, imageFigure } from './questionFigure';
import { agentDebugLog } from '../agentDebugLog';
import { getKozponti2026FebQuestions, KOZPONTI_2026_FEB_COUNT } from './kf2026FebBank';
import { getKozponti2025JanQuestions, KOZPONTI_2025_JAN_COUNT } from './kf2025JanBank';
import { getKozponti2025FebQuestions, KOZPONTI_2025_FEB_COUNT } from './kf2025FebBank';
import { getKozponti2024JanQuestions, KOZPONTI_2024_JAN_COUNT } from './kf2024JanBank';
import { getKozponti2024FebQuestions, KOZPONTI_2024_FEB_COUNT } from './kf2024FebBank';
import { getKozponti2023JanQuestions, KOZPONTI_2023_JAN_COUNT } from './kf2023JanBank';
import { getKozponti2023FebQuestions, KOZPONTI_2023_FEB_COUNT } from './kf2023FebBank';
import { getKozponti2022JanQuestions, KOZPONTI_2022_JAN_COUNT } from './kf2022JanBank';
import { getKozponti2022FebQuestions, KOZPONTI_2022_FEB_COUNT } from './kf2022FebBank';
import { getKozponti2022MarQuestions, KOZPONTI_2022_MAR_COUNT } from './kf2022MarBank';
import { getKozponti2021JanQuestions, KOZPONTI_2021_JAN_COUNT } from './kf2021JanBank';

export { getKozponti2026FebQuestions } from './kf2026FebBank';
export { getKozponti2025JanQuestions } from './kf2025JanBank';
export { getKozponti2025FebQuestions } from './kf2025FebBank';
export { getKozponti2024JanQuestions } from './kf2024JanBank';
export { getKozponti2024FebQuestions } from './kf2024FebBank';
export { getKozponti2023JanQuestions } from './kf2023JanBank';
export { getKozponti2023FebQuestions } from './kf2023FebBank';
export { getKozponti2022JanQuestions } from './kf2022JanBank';
export { getKozponti2022FebQuestions } from './kf2022FebBank';
export { getKozponti2022MarQuestions } from './kf2022MarBank';
export { getKozponti2021JanQuestions } from './kf2021JanBank';

export type KozpontiPaperId = string;
export type KozpontiGrade = 6 | 8;
export type KozpontiMonth = 'januar' | 'februar' | 'harmadik';

export type KozpontiPaperMeta = {
    id: string;
    year: number;
    grade: KozpontiGrade;
    month: KozpontiMonth;
    part: 'mat1' | 'mat2' | 'mat3';
    title: string;
    subtitle: string;
    ready: boolean;
    questionCount: number;
    timeLimitMin: number;
};

export const KOZPONTI_GRADES: KozpontiGrade[] = [6, 8];
export const KOZPONTI_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020] as const;

function kfPaperId(year: number, grade: KozpontiGrade, month: KozpontiMonth): string {
    return `kf-${year}-g${grade}-${month === 'januar' ? 'jan' : 'feb'}`;
}

/** 2026 jan. és febr. 8. évfolyam a beküldött hivatalos sorok. */
const READY_PAPER_IDS = new Set([
    'kf-2026-g8-jan',
    '2026-mat1',
    '2026',
    'kf-2026',
    'kf-2026-g8-feb',
    '2026-mat2',
    'kf-2026-feb',
    'kf-2025-g8-jan',
    '2025-mat1',
    'kf-2025-jan',
    'kf-2025-g8-feb',
    '2025-mat2',
    'kf-2025-feb',
    'kf-2024-g8-jan',
    '2024-mat1',
    'kf-2024-jan',
    'kf-2024-g8-feb',
    '2024-mat2',
    'kf-2024-feb',
    'kf-2023-g8-jan',
    '2023-mat1',
    'kf-2023-jan',
    'kf-2023-g8-feb',
    '2023-mat2',
    'kf-2023-feb',
    'kf-2022-g8-jan',
    '2022-mat1',
    'kf-2022-jan',
    'kf-2022-g8-feb',
    '2022-mat2',
    'kf-2022-feb',
    'kf-2022-g8-mar',
    '2022-mat3',
    'kf-2022-mar',
    'kf-2021-g8-jan',
    '2021-mat1',
    'kf-2021-jan',
]);

function readyPaperCopy(id: string, month: KozpontiMonth): { subtitle: string; questionCount: number } {
    if (id === 'kf-2026-g8-jan') {
        return { subtitle: '2026. január 24. · 45 perc · OH hivatalos sor', questionCount: 30 };
    }
    if (id === 'kf-2026-g8-feb') {
        return {
            subtitle: '2026. február 3. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2026_FEB_COUNT,
        };
    }
    if (id === 'kf-2025-g8-jan') {
        return {
            subtitle: '2025. január 18. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2025_JAN_COUNT,
        };
    }
    if (id === 'kf-2025-g8-feb') {
        return {
            subtitle: '2025. január 28. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2025_FEB_COUNT,
        };
    }
    if (id === 'kf-2024-g8-jan') {
        return {
            subtitle: '2024. január 20. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2024_JAN_COUNT,
        };
    }
    if (id === 'kf-2024-g8-feb') {
        return {
            subtitle: '2024. január 30. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2024_FEB_COUNT,
        };
    }
    if (id === 'kf-2023-g8-jan') {
        return {
            subtitle: '2023. január 21. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2023_JAN_COUNT,
        };
    }
    if (id === 'kf-2023-g8-feb') {
        return {
            subtitle: '2023. január 31. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2023_FEB_COUNT,
        };
    }
    if (id === 'kf-2022-g8-jan') {
        return {
            subtitle: '2022. január 22. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2022_JAN_COUNT,
        };
    }
    if (id === 'kf-2022-g8-feb') {
        return {
            subtitle: '2022. január 27. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2022_FEB_COUNT,
        };
    }
    if (id === 'kf-2022-g8-mar') {
        return {
            subtitle: '2022. február 4. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2022_MAR_COUNT,
        };
    }
    if (id === 'kf-2021-g8-jan') {
        return {
            subtitle: '2021. január 23. · 45 perc · OH hivatalos sor',
            questionCount: KOZPONTI_2021_JAN_COUNT,
        };
    }
    return { subtitle: month === 'januar' ? 'rendes írásbeli' : 'pótló írásbeli', questionCount: 0 };
}

function buildKozpontiPapers(): KozpontiPaperMeta[] {
    const months: KozpontiMonth[] = ['januar', 'februar'];
    const out: KozpontiPaperMeta[] = [];
    for (const grade of KOZPONTI_GRADES) {
        for (const year of KOZPONTI_YEARS) {
            for (const month of months) {
                const id = kfPaperId(year, grade, month);
                const ready = READY_PAPER_IDS.has(id);
                const monthLabel =
                    id === 'kf-2025-g8-feb'
                        ? 'Január 28'
                        : id === 'kf-2024-g8-feb'
                          ? 'Január 30'
                          : id === 'kf-2023-g8-feb'
                            ? 'Január 31'
                            : id === 'kf-2022-g8-feb'
                              ? 'Január 27'
                              : month === 'januar'
                              ? 'Január'
                              : 'Február';
                const sitting = month === 'januar' ? 'rendes írásbeli' : 'pótló írásbeli';
                const track = grade === 8 ? '9. évfolyamra' : '6/8 évfolyamos gimnázium';
                out.push({
                    id,
                    year,
                    grade,
                    month,
                    part: month === 'januar' ? 'mat1' : 'mat2',
                    title: monthLabel,
                    subtitle: ready ? readyPaperCopy(id, month).subtitle : `${track} · ${sitting}`,
                    ready,
                    questionCount: ready ? readyPaperCopy(id, month).questionCount : 0,
                    timeLimitMin: 45,
                });
            }
            if (year === 2022) {
                const id = `kf-${year}-g${grade}-mar`;
                const ready = READY_PAPER_IDS.has(id);
                const track = grade === 8 ? '9. évfolyamra' : '6/8 évfolyamos gimnázium';
                out.push({
                    id,
                    year,
                    grade,
                    month: 'harmadik',
                    part: 'mat3',
                    title: 'Február 4',
                    subtitle: ready ? readyPaperCopy(id, 'harmadik').subtitle : `${track} · 3. írásbeli`,
                    ready,
                    questionCount: ready ? readyPaperCopy(id, 'harmadik').questionCount : 0,
                    timeLimitMin: 45,
                });
            }
        }
    }
    return out;
}

export const KOZPONTI_PAPERS: KozpontiPaperMeta[] = buildKozpontiPapers();

export function getKozpontiPapersForGrade(grade: KozpontiGrade): KozpontiPaperMeta[] {
    return KOZPONTI_PAPERS.filter((p) => p.grade === grade);
}

export function kozpontiPapersByYear(grade: KozpontiGrade): Array<{ year: number; papers: KozpontiPaperMeta[] }> {
    const map = new Map<number, KozpontiPaperMeta[]>();
    for (const p of getKozpontiPapersForGrade(grade)) {
        const list = map.get(p.year) || [];
        list.push(p);
        map.set(p.year, list);
    }
    return [...map.entries()].map(([year, papers]) => ({ year, papers }));
}

function q(
    id: string,
    question: string,
    answer: number,
    expression: string,
    extra?: Partial<Question>
): Question {
    return {
        id,
        question,
        answer,
        type: 'multiplication',
        expression,
        ...extra,
    };
}

/** 2026. jan. 24. Mat1 — itemek a javítási útmutató szerint. */
export function getKozponti2026Mat1Questions(): Question[] {
    const mapFig = imageFigure('/figures/kozponti/2026/t3-terkep.png', '2026/3. térképvázlat');
    const triangleFig = imageFigure('/figures/kozponti/2026/t7-haromszog.png', '2026/7. ABC vázlat');
    const solidFig = imageFigure('/figures/kozponti/2026/t9-test.png', '2026/9. összeragasztott test');
    const scatterFig = coordPlaneFigure({
        xmin: 0,
        xmax: 10,
        ymin: 0,
        ymax: 10,
        xLabel: 'Elégedettség',
        yLabel: 'Ajánlás',
        caption: '2026/4. elégedettség–ajánlás diagram',
        points: [
            { x: 1, y: 1 },
            { x: 3, y: 7 },
            { x: 5, y: 9 },
            { x: 6, y: 5 },
            { x: 7, y: 7 },
            { x: 7, y: 10 },
            { x: 8, y: 6 },
            { x: 8, y: 9 },
            { x: 9, y: 3 },
            { x: 9, y: 5 },
            { x: 9, y: 8 },
            { x: 10, y: 4 },
            { x: 10, y: 6 },
            { x: 10, y: 9 },
            { x: 10, y: 10 },
        ],
    });
    const coordFig = coordPlaneFigure({
        xmin: -8,
        xmax: 8,
        ymin: -4,
        ymax: 8,
        xLabel: 'x',
        yLabel: 'y',
        caption: '2026/5. A(−7; 2), B(−1; 6), C(3; 4)',
        points: [
            { x: -7, y: 2, label: 'A' },
            { x: -1, y: 6, label: 'B' },
            { x: 3, y: 4, label: 'C' },
        ],
    });

    const list: Question[] = [
        q(
            'kf2026-1a',
            '2026/1.a) Egy szabályos hatszög átlóinak száma = ?',
            9,
            'Szabályos hatszög: n(n−3)/2 = 6·3/2 = 9'
        ),
        q(
            'kf2026-1b',
            '2026/1.b) A 12 és a 15 legkisebb közös többszöröse = ?',
            60,
            '12=2²·3, 15=3·5 → LKKT = 2²·3·5 = 60'
        ),
        q(
            'kf2026-1c',
            '2026/1.c) A 16; 9; 18; 3; 4 számsokaság mediánja = ?',
            9,
            'Rendezve: 3, 4, 9, 16, 18. Középső: 9'
        ),
        q(
            'kf2026-1d',
            '2026/1.d) 2 : (8/15) = ?  (írhatod 3,75 vagy 15/4 alakban)',
            3.75,
            '2 : (8/15) = 2 · 15/8 = 30/8 = 15/4 = 3,75'
        ),
        q(
            'kf2026-2a',
            '2026/2.a) 3 kg − 75 dkg = ? dkg',
            225,
            '3 kg = 300 dkg, 300 − 75 = 225 dkg'
        ),
        q(
            'kf2026-2b',
            '2026/2.b) 12,4 dm² + ? mm² = 15,1 dm²',
            27000,
            '15,1 − 12,4 = 2,7 dm² = 2,7 · 10 000 mm² = 27 000 mm²'
        ),
        q(
            'kf2026-2c',
            '2026/2.c) ? másodperc + 50 perc = 6300 másodperc',
            3300,
            '50 perc = 3000 s, 6300 − 3000 = 3300 s'
        ),
        q(
            'kf2026-2d',
            '2026/2.d) 6300 másodperc = ? óra  (1,75 vagy 7/4 is jó)',
            1.75,
            '6300 / 3600 = 63/36 = 7/4 = 1,75 óra'
        ),
        q(
            'kf2026-3a',
            '2026/3. Öt ország: N, L, C, A, S. Indulás N, csak szomszédosba, minden ország egyszer, befejezés A vagy L.\nA példa: N–L–C–S–A.\nHány megfelelő sorrend van összesen (a példa is számít)?',
            6,
            'N-L-C-S-A, N-L-S-C-A, N-C-L-S-A, N-C-A-S-L, N-A-C-S-L, N-A-S-C-L → 6',
            { figure: mapFig }
        ),
        q(
            'kf2026-3b',
            '2026/3. Ugyanezekkel a feltételekkel hány sorrend végződik Ausztriában (A)?',
            3,
            'N-L-C-S-A, N-L-S-C-A, N-C-L-S-A → 3',
            { figure: mapFig }
        ),
        q(
            'kf2026-4a',
            '2026/4.a) 15 ügyfél. Hányan adtak legalább 6 pontot az elégedettségre?',
            12,
            'A diagramon x ≥ 6: 12 pont',
            { figure: scatterFig }
        ),
        q(
            'kf2026-4b',
            '2026/4.b) Az ügyfelek hány százaléka adott legalább 6 pontot az elégedettségre?',
            80,
            '12/15 = 0,8 → 80%',
            { figure: scatterFig }
        ),
        q(
            'kf2026-4c',
            '2026/4.c) Hány ügyfél adott az elégedettségre és az ajánlásra összesen kevesebb mint 17 pontot?',
            10,
            'x+y < 17: 10 pont',
            { figure: scatterFig }
        ),
        q(
            'kf2026-4d',
            '2026/4.d–e) Mennyi volt az ajánlásra adott azon pontszámok átlaga, amelyek nem érték el a 6-ot?',
            3.6,
            'y < 6: 1+5+5+3+4 = 18, 18/5 = 3,6',
            { figure: scatterFig }
        ),
        q(
            'kf2026-5tx',
            '2026/5.b) T az A(−7; 2) origóra vonatkozó tükörképe. T x-koordinátája?',
            7,
            'Origóra tükrözés: (−x; −y) → T(7; −2)',
            { figure: coordFig }
        ),
        q(
            'kf2026-5ty',
            '2026/5.b) T y-koordinátája?',
            -2,
            'T(7; −2)',
            { figure: coordFig }
        ),
        q(
            'kf2026-5dx',
            '2026/5.d) D az x-tengelyen, A,B,C,D ebben a sorrendben paralelogramma. D x-koordinátája?',
            -3,
            'D = A+C−B = (−7+3−(−1); 2+4−6) = (−3; 0)',
            { figure: coordFig }
        ),
        q(
            'kf2026-5dy',
            '2026/5.d) D y-koordinátája?',
            0,
            'D(−3; 0) az x-tengelyen',
            { figure: coordFig }
        ),
        q(
            'kf2026-6',
            '2026/6. Éves bér: 100 tallér + 1 ruha. 7 hónap után: 1 ruha + 20 tallér.\nHány tallért ért egy öltözet ruha?',
            92,
            '7/12 · (100+x) = x+20 → 700+7x = 240+12x → 460 = 5x → x = 92'
        ),
        q(
            'kf2026-7a',
            '2026/7.a) Mekkora az ECD háromszög C csúcsánál lévő ε szög? (fok)',
            50,
            'B–C–D egyenes: ε = 180° − 130° = 50°',
            { figure: triangleFig }
        ),
        q(
            'kf2026-7b',
            '2026/7.b) Mekkora a CED háromszög E csúcsánál lévő δ szög? (fok)',
            70,
            'D-nél belső 60°, ε=50° → δ = 180−60−50 = 70°',
            { figure: triangleFig }
        ),
        q(
            'kf2026-7c',
            '2026/7.c) Mekkora az ABC háromszög A csúcsánál lévő α szög? (fok)',
            20,
            'f felezőmerőleges, AFE derékszög, δ=70° → α = 90°−70° = 20°',
            { figure: triangleFig }
        ),
        q(
            'kf2026-7d',
            '2026/7.d) Mekkora az EBC háromszög B csúcsánál lévő γ szög? (fok)',
            10,
            'γ = 180°−130°−(180°−2δ) = 10°',
            { figure: triangleFig }
        ),
        q(
            'kf2026-8a',
            '2026/8.a) Legkisebb ötjegyű pozitív egész − legnagyobb háromjegyű = ?\nA=1  B=2  C=9001  D=900  E=910\nÍrd be a helyes válasz BETŰJÉT számként: A=1, B=2, C=3, D=4, E=5',
            3,
            '10000 − 999 = 9001 → C → 3'
        ),
        q(
            'kf2026-8b',
            '2026/8.b) Hány embert kell legalább kiválasztani, hogy biztosan legyen kettő, akiknek a születési hónap utolsó betűje azonos?\nA=2  B=13  C=7  D=3  E=4\nBetű száma: A=1 … E=5',
            4,
            'Hónapok utolsó betűje: r,r,s,s,s,s,s,s,r,r,r,r → 2-féle. Skatulya: 2+1=3 → D → 4'
        ),
        q(
            'kf2026-8c',
            '2026/8.c) Melyik állítás NEM igaz minden rombuszra?\n(A) Minden oldala egyenlő.\n(B) Átlói merőlegesen felezik egymást.\n(C) Szemben lévő oldalai párhuzamosak.\n(D) Minden szöge derékszög.\n(E) Szemközti szögei egyenlők.\nBetű száma: A=1 … E=5',
            4,
            'Nem minden rombusz téglalap → D → 4'
        ),
        q(
            'kf2026-9a',
            '2026/9.a) Öt egybevágó négyzet alapú hasáb. Leghosszabb él 20 dm, legrövidebb 2 dm.\na = ? dm',
            2,
            'A legrövidebb él a négyzet oldala: a = 2 dm',
            { figure: solidFig }
        ),
        q(
            'kf2026-9b',
            '2026/9.b) b = ? dm',
            8,
            'Leghosszabb él 2a+2b = 20 → 4+2b=20 → b=8',
            { figure: solidFig }
        ),
        q(
            'kf2026-9c',
            '2026/9.c) A testet 24×10×4 dm-es nyitott üvegdobozba tettük, színültig vízzel. Hány dm³ víz van a dobozban?',
            800,
            'Test: 5·2·2·8 = 160 dm³. Doboz: 24·10·4 = 960. Víz: 960−160 = 800 dm³',
            { figure: solidFig }
        ),
        q(
            'kf2026-10',
            '2026/10. Dorka : anya : nagymama = 2 : 9 : 14.\n10 év múlva Dorka + nagymama összege 8-cal kevesebb, mint az anya akkori korának kétszerese.\nHány éves most a nagymama?',
            56,
            '2x+10 + 14x+10 + 8 = 2(9x+10) → 16x+28 = 18x+20 → x=4 → 14x=56'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'A',
        location: 'kozpontiPapers.ts:getKozponti2026Mat1Questions',
        message: '2026 Mat1 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            mapKind: list.find((x) => x.id === 'kf2026-3a')?.figure?.kind,
            scatterKind: list.find((x) => x.id === 'kf2026-4a')?.figure?.kind,
            coordKind: list.find((x) => x.id === 'kf2026-5tx')?.figure?.kind,
            coordPoints: (list.find((x) => x.id === 'kf2026-5tx')?.figure?.kind === 'draw'
                ? list.find((x) => x.id === 'kf2026-5tx')?.figure?.primitives.filter((p) => p.t === 'circle').length
                : 0),
            scatterPoints: (list.find((x) => x.id === 'kf2026-4a')?.figure?.kind === 'draw'
                ? list.find((x) => x.id === 'kf2026-4a')?.figure?.primitives.filter((p) => p.t === 'circle').length
                : 0),
            triangleKind: list.find((x) => x.id === 'kf2026-7a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2026-9a')?.figure?.kind,
        },
        runId: 'kf-2026',
    });
    // #endregion

    return list;
}

export function getKozpontiPaperQuestions(paperId: string): Question[] | null {
    const id = String(paperId || '').toLowerCase();
    const is2026G8Jan =
        id === 'kf-2026-g8-jan' ||
        id === '2026-mat1' ||
        id === '2026' ||
        id === 'kf-2026';
    const is2026G8Feb = id === 'kf-2026-g8-feb' || id === '2026-mat2' || id === 'kf-2026-feb';
    const is2025G8Jan = id === 'kf-2025-g8-jan' || id === '2025-mat1' || id === 'kf-2025-jan';
    const is2025G8Feb = id === 'kf-2025-g8-feb' || id === '2025-mat2' || id === 'kf-2025-feb';
    const is2024G8Jan = id === 'kf-2024-g8-jan' || id === '2024-mat1' || id === 'kf-2024-jan';
    const is2024G8Feb = id === 'kf-2024-g8-feb' || id === '2024-mat2' || id === 'kf-2024-feb';
    const is2023G8Jan = id === 'kf-2023-g8-jan' || id === '2023-mat1' || id === 'kf-2023-jan';
    const is2023G8Feb = id === 'kf-2023-g8-feb' || id === '2023-mat2' || id === 'kf-2023-feb';
    const is2022G8Jan = id === 'kf-2022-g8-jan' || id === '2022-mat1' || id === 'kf-2022-jan';
    const is2022G8Feb = id === 'kf-2022-g8-feb' || id === '2022-mat2' || id === 'kf-2022-feb';
    const is2022G8Mar = id === 'kf-2022-g8-mar' || id === '2022-mat3' || id === 'kf-2022-mar';
    const is2021G8Jan = id === 'kf-2021-g8-jan' || id === '2021-mat1' || id === 'kf-2021-jan';
    // #region agent log
    agentDebugLog({
        hypothesisId: 'H2',
        location: 'kozpontiPapers.ts:getKozpontiPaperQuestions',
        message: 'kf paper lookup',
        data: {
            paperId: id,
            is2026G8Jan,
            is2026G8Feb,
            is2025G8Jan,
            is2025G8Feb,
            is2024G8Jan,
            is2024G8Feb,
            is2023G8Jan,
            is2023G8Feb,
            is2022G8Jan,
            is2022G8Feb,
            is2022G8Mar,
            ready:
                is2026G8Jan ||
                is2026G8Feb ||
                is2025G8Jan ||
                is2025G8Feb ||
                is2024G8Jan ||
                is2024G8Feb ||
                is2023G8Jan ||
                is2023G8Feb ||
                is2022G8Jan ||
                is2022G8Feb ||
                is2022G8Mar,
        },
        runId: 'kf-tracks',
    });
    // #endregion
    if (is2026G8Jan) {
        return getKozponti2026Mat1Questions();
    }
    if (is2026G8Feb) {
        return getKozponti2026FebQuestions();
    }
    if (is2025G8Jan) {
        return getKozponti2025JanQuestions();
    }
    if (is2025G8Feb) {
        return getKozponti2025FebQuestions();
    }
    if (is2024G8Jan) {
        return getKozponti2024JanQuestions();
    }
    if (is2024G8Feb) {
        return getKozponti2024FebQuestions();
    }
    if (is2023G8Jan) {
        return getKozponti2023JanQuestions();
    }
    if (is2023G8Feb) {
        return getKozponti2023FebQuestions();
    }
    if (is2022G8Jan) {
        return getKozponti2022JanQuestions();
    }
    if (is2022G8Feb) {
        return getKozponti2022FebQuestions();
    }
    if (is2022G8Mar) {
        return getKozponti2022MarQuestions();
    }
    // #region agent log
    agentDebugLog({
        hypothesisId: 'H1',
        location: 'kozpontiPapers.ts:getKozpontiPaperQuestions:2021',
        message: 'kf 2021 jan lookup',
        data: { paperId: id, is2021G8Jan, willReturn: is2021G8Jan },
        runId: 'kf-2021-jan',
    });
    // #endregion
    if (is2021G8Jan) {
        return getKozponti2021JanQuestions();
    }
    return null;
}
