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

/** 2025. jan. 28. Mat2 (UI: 2025 Február kártya) — útmutató szerint. */
export function getKozponti2025FebQuestions(): Question[] {
    const arrowFig = imageFigure('/figures/kozponti/2025feb/t3-nyil.png', '2025/3. nyilak: 2, 3, 4, 5');
    const chartFig = imageFigure('/figures/kozponti/2025feb/t4-diagram.png', '2025/4. A es B termeles diagram');
    const coordFig = imageFigure('/figures/kozponti/2025feb/t5-koord.png', '2025/5. ABCD konkav negyszog');
    const triFig = imageFigure('/figures/kozponti/2025feb/t7-haromszog.png', '2025/7. CDE haromszog');
    const solidFig = imageFigure('/figures/kozponti/2025feb/t9-test.png', '2025/9. osszeragasztott test');

    const list: Question[] = [
        q(
            'kf2025f-1a',
            '2025/1.a) 5^A · 5^4 = 5^12. Mennyi A?',
            8,
            'A+4 = 12, A = 8'
        ),
        q(
            'kf2025f-1b',
            '2025/1.b) B a 7; 10; 8; 2; 5 számsokaság mediánja. Mennyi B?',
            7,
            'Rendezve: 2, 5, 7, 8, 10. Kozepso: 7'
        ),
        q(
            'kf2025f-1c',
            '2025/1.c) C = 4 2/3 · 9. Mennyi C?',
            42,
            '(14/3)*9 = 42'
        ),
        q(
            'kf2025f-1d1',
            '2025/1.d) D olyan számjegy, hogy 2371D osztható 4-gyel. A kisebb D?',
            2,
            '1D oszthato 4-gyel: 12 vagy 16, D = 2 vagy 6'
        ),
        q(
            'kf2025f-1d2',
            '2025/1.d) A nagyobb lehetséges D?',
            6,
            'D = 6'
        ),
        q(
            'kf2025f-2a',
            '2025/2.a) 6 m² − 25 dm² = ? m²  (5,75 is jó)',
            5.75,
            '25 dm2 = 0,25 m2, 6-0,25 = 5,75'
        ),
        q(
            'kf2025f-2b',
            '2025/2.b) 2,15 kg + ? g = 3 kg',
            850,
            '3-2,15 = 0,85 kg = 850 g'
        ),
        q(
            'kf2025f-2c',
            '2025/2.c) ? óra + 90 perc = 2,25 óra  (0,75 vagy 3/4 is jó)',
            0.75,
            '90 perc = 1,5 ora, 2,25-1,5 = 0,75 ora'
        ),
        q(
            'kf2025f-2d',
            '2025/2.d) 2,25 óra = ? másodperc',
            8100,
            '2,25*3600 = 8100'
        ),
        q(
            'kf2025f-3',
            '2025/3. Írd a 2; 3; 4; 5 számokat az üres körökbe úgy, hogy minden nyíl a nagyobb szám felé mutasson. A 1-es már be van írva.\nHány megfelelő elrendezés van összesen (a példa is számít)?',
            6,
            '5 tovabbi helyes + a pelda = 6',
            { figure: arrowFig }
        ),
        q(
            'kf2025f-4a',
            '2025/4.a) Hány hónapban gyártottak többet a B termékből, mint az A-ból?',
            4,
            'B>A: febr, jun, jul, aug -> 4',
            { figure: chartFig }
        ),
        q(
            'kf2025f-4b',
            '2025/4.b) Mekkora volt a legnagyobb eltérés az A és a B havi darabszáma között?',
            100,
            'Legnagyobb |A-B| = 100',
            { figure: chartFig }
        ),
        q(
            'kf2025f-4e',
            '2025/4.e) Hány darab A terméket gyártottak havi átlagban június–augusztusban?',
            130,
            '(100+120+170)/3 = 390/3 = 130',
            { figure: chartFig }
        ),
        q(
            'kf2025f-5dx',
            '2025/5.b) ABCD konkáv négyszög, D x-koordinátája háromszorosa az y-nak. D x-koordinátája?',
            6,
            'D(6; 2), mert 6 = 3*2',
            { figure: coordFig }
        ),
        q(
            'kf2025f-5dy',
            '2025/5.b) D y-koordinátája?',
            2,
            'D(6; 2)',
            { figure: coordFig }
        ),
        q(
            'kf2025f-5t',
            '2025/5.e) Az origó, B és C csúcsú háromszög területe? (egy rácsnégyzet = 1)',
            15,
            'T = OC*m/2 = 6*5/2 = 15',
            { figure: coordFig }
        ),
        q(
            'kf2025f-6',
            '2025/6. Esős napon 2000 m, szárazon még +400 m. 30 napos június, összesen 70 000 m.\nHány nap esett az eső?',
            5,
            '2000x + 2400*(30-x) = 70000, 400x = 2000, x = 5'
        ),
        q(
            'kf2025f-7a',
            '2025/7.a) BD = BC = CE, ECB-nél C-nél 76 fok. Mekkora az epsilon szög? (fok)',
            52,
            'BCE egyenloszaru, epsilon = (180-76)/2 = 52',
            { figure: triFig }
        ),
        q(
            'kf2025f-7b',
            '2025/7.b) Mekkora a DBC háromszög B csúcsánál lévő béta szög? (fok)',
            128,
            'beta = 180 - 52 = 128',
            { figure: triFig }
        ),
        q(
            'kf2025f-7c',
            '2025/7.c) Mekkora a DBC háromszög D csúcsánál lévő delta szög? (fok)',
            26,
            'BD=BC, (180-128)/2 = 26',
            { figure: triFig }
        ),
        q(
            'kf2025f-7d',
            '2025/7.d) Mekkora az ABC háromszög A csúcsánál lévő alfa szög? (fok)',
            39,
            'CA felezi phi-t, alfa = 39',
            { figure: triFig }
        ),
        q(
            'kf2025f-8a',
            '2025/8.a) |A|=3, |B|=7. Mennyi lehet |A unio B| az alábbiak közül?\n(A) 4\n(B) 3\n(C) 7\n(D) 21\nBetű száma: A=1, B=2, C=3, D=4',
            3,
            'Ha A reszhalmaza B-nek, unio = 7 -> C -> 3'
        ),
        q(
            'kf2025f-8b',
            '2025/8.b) Melyik NEM osztója a 11·12·…·19 szorzatnak?\n(A) 20\n(B) 21\n(C) 22\n(D) 23\nBetű száma: A=1 ... D=4',
            4,
            '23 prim, nincs a tenyezok kozt -> D -> 4'
        ),
        q(
            'kf2025f-8c',
            '2025/8.c) Hány darab háromjegyű természetes szám van?\n(A) 999\n(B) 899\n(C) 900\n(D) 1000\nBetű száma: A=1 ... D=4',
            3,
            '100-tol 999-ig: 900 -> C -> 3'
        ),
        q(
            'kf2025f-8d',
            '2025/8.d) Melyik állítás igaz minden paralelogrammára?\n(A) Átlói felezik a belső szögeket.\n(B) Van szimmetriatengelye.\n(C) Van tompaszöge.\n(D) Átlói felezik egymást.\nBetű száma: A=1 ... D=4',
            4,
            'Atlok felezik egymast -> D -> 4'
        ),
        q(
            'kf2025f-9',
            '2025/9. Két egybevágó téglatest és két egybevágó négyzetes oszlop. Hány cm² a test felszíne?',
            198,
            '2*(64+8+27) = 198',
            { figure: solidFig }
        ),
        q(
            'kf2025f-10',
            '2025/10. Gondolt szám: *25, +25, /25, −25, eredmény 25. Melyik számra gondoltam?',
            49,
            '(25x+25)/25 - 25 = 25, x+1-25=25, x=49'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H7',
        location: 'kf2025FebBank.ts:getKozponti2025FebQuestions',
        message: '2025 Jan28 Mat2 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2025f-1a')?.answer,
            a10: list.find((x) => x.id === 'kf2025f-10')?.answer,
            arrowKind: list.find((x) => x.id === 'kf2025f-3')?.figure?.kind,
            chartKind: list.find((x) => x.id === 'kf2025f-4a')?.figure?.kind,
            coordKind: list.find((x) => x.id === 'kf2025f-5dx')?.figure?.kind,
            triKind: list.find((x) => x.id === 'kf2025f-7a')?.figure?.kind,
            solidKind: list.find((x) => x.id === 'kf2025f-9')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2025-feb',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2025_FEB_COUNT = 27;
