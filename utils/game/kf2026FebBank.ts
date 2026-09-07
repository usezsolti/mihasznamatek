import type { Question } from './types';
import { imageFigure } from './questionFigure';
import { agentDebugLog } from '../agentDebugLog';

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

/** 2026. febr. 3. Mat2 — itemek a javítási útmutató szerint. */
export function getKozponti2026FebQuestions(): Question[] {
    const coordFig = imageFigure('/figures/kozponti/2026feb/t4-koord.jpeg', '2026/4. A(−7; −2), B(8; 3), P(−1; 6), e egyenes');
    const eigerFig = imageFigure('/figures/kozponti/2026feb/t5-eiger.png', '2026/5. Eiger-mászás magasság–idő grafikon');
    const quadFig = imageFigure('/figures/kozponti/2026feb/t7-negyzet.jpeg', '2026/7. ABCD négyszög vázlat');
    const solidFig = imageFigure('/figures/kozponti/2026feb/t9-test.png', '2026/9. összeragasztott test');

    const list: Question[] = [
        q(
            'kf2026f-1a',
            '2026/1.a) A = 42,36 · 20 000. Mennyi A?',
            847200,
            '42,36 · 20 000 = 847 200'
        ),
        q(
            'kf2026f-1b',
            '2026/1.b) B egy számjegy. A 43B17 ötjegyű szám osztható 9-cel. Mennyi B?',
            3,
            'Számjegyösszeg 4+3+B+1+7 = 15+B osztható 9-cel → B = 3'
        ),
        q(
            'kf2026f-1c',
            '2026/1.c) Az 1; 3; 6; 1; 3; 5; C; 7; 9 számsokaság egyetlen módusza 3. Mennyi C?',
            3,
            'A 3-nak kell a leggyakoribbnak lennie, és egyedül. C = 3'
        ),
        q(
            'kf2026f-1d',
            '2026/1.d) (5/3) · D = 4. Mennyi D? (2,4 vagy 12/5 is jó)',
            2.4,
            'D = 4 · 3/5 = 12/5 = 2,4'
        ),
        q(
            'kf2026f-2a',
            '2026/2.a) 42 000 dm³ − 4 m³ = ? dm³',
            38000,
            '4 m³ = 4000 dm³ → 42 000 − 4000 = 38 000 dm³'
        ),
        q(
            'kf2026f-2b',
            '2026/2.b) 120 cm + ? mm = 305 cm',
            1850,
            '305 − 120 = 185 cm = 1850 mm'
        ),
        q(
            'kf2026f-2c',
            '2026/2.c) ? nap + 3 hét = 70 nap',
            49,
            '3 hét = 21 nap → 70 − 21 = 49 nap'
        ),
        q(
            'kf2026f-2d',
            '2026/2.d) 70 nap = ? óra',
            1680,
            '70 · 24 = 1680 óra'
        ),
        q(
            'kf2026f-3',
            '2026/3. Doboz: 5 rekesz, mindegyikbe 1 gyümölcs. Fajták: barack (B), alma (A), körte (K). Minden fajtából legalább 1, a sorrend nem számít.\nHányféle feltöltés van összesen (a példaként megadott is számít)?',
            6,
            'B+A+K=5, mindegyik ≥1. (3,1,1) 3-féle + (2,2,1) 3-féle → 6'
        ),
        q(
            'kf2026f-4rx',
            '2026/4.b) R a P pont e egyenesre vonatkozó tükörképe. R x-koordinátája?',
            3,
            'e: y = x+3. P(−1; 6) tükörképe R(3; 2)',
            { figure: coordFig }
        ),
        q(
            'kf2026f-4ry',
            '2026/4.b) R y-koordinátája?',
            2,
            'R(3; 2)',
            { figure: coordFig }
        ),
        q(
            'kf2026f-4cx',
            '2026/4.d) ABC derékszögű C-nél, mindkét befogó tengelypárhuzamos, C első koordinátája kisebb a másodiknál. C x-koordinátája?',
            -7,
            'Befogók A-nál függőleges, B-nél vízszintes → C(−7; 3)',
            { figure: coordFig }
        ),
        q(
            'kf2026f-4cy',
            '2026/4.d) C y-koordinátája?',
            3,
            'C(−7; 3), és −7 < 3',
            { figure: coordFig }
        ),
        q(
            'kf2026f-5a',
            '2026/5.a) Hány méter tengerszint feletti magasságban pihent másodszor egy órát?',
            3250,
            'A (4) pihenő vízszintes szakasza 3250 m-en van',
            { figure: eigerFig }
        ),
        q(
            'kf2026f-5b',
            '2026/5.b) Hány órát töltött a sziklaperemen (6)?',
            9,
            'A (6) szakasz 20:00-tól másnap 5:00-ig tart → 9 óra',
            { figure: eigerFig }
        ),
        q(
            'kf2026f-5c',
            '2026/5.c) Hány méter szintkülönbséget tett meg a mászás során? (A pihenés nem számít mászásnak.)',
            1700,
            'Indulás 2250 m, csúcs 3950 m → 1700 m',
            { figure: eigerFig }
        ),
        q(
            'kf2026f-5d',
            '2026/5.d) Átlagosan hány méter szintkülönbséget tett meg óránként a mászás során? (106,25 is jó)',
            106.25,
            'Mászás: 3+4+3+6 = 16 óra. 1700/16 = 106,25 m/h',
            { figure: eigerFig }
        ),
        q(
            'kf2026f-6',
            '2026/6. Zsinór három részre vágva. 1. darab: eredeti hossz harmadánál 26 cm-rel rövidebb. 2. darab: negyedénél 6 cm-rel rövidebb. Maradék: felénél 30 cm-rel rövidebb.\nHány cm volt a zsinór eredeti hossza?',
            744,
            '(x/3−26)+(x/4−6)+(x/2−30)=x → x/12 = 62 → x = 744'
        ),
        q(
            'kf2026f-7a',
            '2026/7.a) Mekkora a CEB háromszög E csúcsánál lévő ε szög? (fok)\nAdott: BC = AB = AE = BE = DE.',
            50,
            'BCE egyenlő szárú, C-nél 50° → ε = 50°',
            { figure: quadFig }
        ),
        q(
            'kf2026f-7b',
            '2026/7.b) Mekkora az EBD háromszög B csúcsánál lévő β szög? (fok)',
            25,
            'ABE szabályos (AB=AE=BE), EBD egyenlő szárú → β = 25°',
            { figure: quadFig }
        ),
        q(
            'kf2026f-7c',
            '2026/7.c) Mekkora a DAE háromszög A csúcsánál lévő alfa szög? (fok)',
            55,
            'ABE szabalyos. AED: 180-60-50=70, AE=DE, alfa=(180-70)/2=55',
            { figure: quadFig },
        ),
        q(
            'kf2026f-7d',
            '2026/7.d) Mekkora az ADB háromszög D csúcsánál lévő delta szög? (fok)',
            30,
            'BDE: BE=DE, beta=25, BDE=25. ADE=55, delta=55-25=30',
            { figure: quadFig },
        ),
        q(
            'kf2026f-8a',
            '2026/8.a) Egy tó felszínén gyorsan szaporodtak az algák. Minden nap estére negyedakkora területtel nőtt az algával borított terület, mint amekkora előző nap este volt. Ma estére teljesen befedte az alga a tavat.\nHány százalékát fedte alga tegnap este a tó felszínének?\n(A) 25%\n(B) 70%\n(C) 75%\n(D) 80%\n(E) 90%\nÍrd be a helyes válasz BETŰJÉT számként: A=1, B=2, C=3, D=4, E=5',
            4,
            'x + x/4 = 1 → (5/4)x = 1 → x = 80% → D → 4'
        ),
        q(
            'kf2026f-8b',
            '2026/8.b) Hány átlója van egy szabályos hétszögnek?\n(A) 7\n(B) 12\n(C) 14\n(D) 21\n(E) 28\nBetű száma: A=1 … E=5',
            3,
            'n(n−3)/2 = 7·4/2 = 14 → C → 3'
        ),
        q(
            'kf2026f-8c',
            '2026/8.c) Mennyi a 120 és a 186 legnagyobb közös osztója?\n(A) 2\n(B) 6\n(C) 12\n(D) 31\n(E) 3720\nBetű száma: A=1 … E=5',
            2,
            'lnko(120, 186) = 6 → B → 2'
        ),
        q(
            'kf2026f-9a',
            '2026/9.a) Hat egybevágó négyzet alapú hasáb. Leghosszabb él 20 cm, legrövidebb 2 cm. A négyzetes hasáb rövidebb éle a = ? cm',
            2,
            'A legrövidebb él a négyzet oldala: a = 2 cm',
            { figure: solidFig }
        ),
        q(
            'kf2026f-9b',
            '2026/9.b) A négyzetes hasáb hosszabb éle b = ? cm',
            16,
            'Leghosszabb él: b + 2a = 20 → b = 16 cm',
            { figure: solidFig }
        ),
        q(
            'kf2026f-9c',
            '2026/9.c) Hány cm² az összeragasztott test felszíne?',
            752,
            'Egy hasáb: 4ab+2a² = 136. Ragasztás: 16a² = 64. Felszín: 6·136 − 64 = 752',
            { figure: solidFig }
        ),
        q(
            'kf2026f-10',
            '2026/10. Tibi 2021-ben ötször idősebb volt, mint az unokaöccse. 2029-ben Tibi már csak háromszor annyi idős lesz, mint az unokaöccse akkor.\nHány éves Tibi most, 2026-ban?',
            45,
            'Öt éve Tibi x−5, unokaöccs (x−5)/5. 3 év múlva: x+3 = 3·((x−5)/5+8) → x = 45'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H3',
        location: 'kf2026FebBank.ts:getKozponti2026FebQuestions',
        message: '2026 Feb Mat2 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2026f-1a')?.answer,
            a8a: list.find((x) => x.id === 'kf2026f-8a')?.answer,
            a10: list.find((x) => x.id === 'kf2026f-10')?.answer,
            coordKind: list.find((x) => x.id === 'kf2026f-4rx')?.figure?.kind,
            eigerKind: list.find((x) => x.id === 'kf2026f-5a')?.figure?.kind,
            quadKind: list.find((x) => x.id === 'kf2026f-7a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2026f-9a')?.figure?.kind,
            solidSrc:
                list.find((x) => x.id === 'kf2026f-9a')?.figure?.kind === 'image'
                    ? list.find((x) => x.id === 'kf2026f-9a')?.figure?.src
                    : null,
            parseOk: true,
            coordSrc:
                list.find((x) => x.id === 'kf2026f-4rx')?.figure?.kind === 'image'
                    ? list.find((x) => x.id === 'kf2026f-4rx')?.figure?.src
                    : null,
        },
        runId: 'kf-2026-feb',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2026_FEB_COUNT = 29;
