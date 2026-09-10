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

const FIG = '/figures/erettsegi/2025maj-kozep';

/** 2025. május 6. középszint (K2511) — válaszok a javítási útmutató szerint. */
export function getErettsegi2025MajKozepQuestions(): Question[] {
    const tri = imageFigure(`${FIG}/p04-1.png`, '2025/5. hegyesszögű háromszög');
    const hex = imageFigure(`${FIG}/p06-2.png`, '2025/9. szabályos hatszög');
    const quad = imageFigure(`${FIG}/p14-1.jpeg`, '2025/14. ABCD négyszög');
    const dessert = imageFigure(`${FIG}/p20-1.jpeg`, '2025/17. túrórúd');
    const pie = imageFigure(`${FIG}/p23-1.png`, '2025/18.c) kördiagram');

    const list: Question[] = [
        q(
            'er25m-1i',
            '2025/1. A = {1; 2; 3; 4; 5}, B = {1; 3; 5; 7; 9}. Sorold fel A ∩ B elemeit.',
            0,
            '{1; 3; 5}',
            { expectedSet: ['1', '3', '5'] }
        ),
        q(
            'er25m-1d',
            '2025/1. Ugyanazok a halmazok. Sorold fel A \\ B elemeit.',
            0,
            '{2; 4}',
            { expectedSet: ['2', '4'] }
        ),
        q(
            'er25m-2',
            '2025/2. Add meg a 12 és a 20 legkisebb közös többszörösét!',
            60,
            'lkkt(12; 20) = 60'
        ),
        q(
            'er25m-3',
            '2025/3. Oldd meg: 4^x = 8 * 2^x. x = ?',
            3,
            '2^{2x} = 2^3 * 2^x -> x = 3'
        ),
        q(
            'er25m-4',
            '2025/4. Napi bevétel (ezer Ft): 568, 465, 497, 488, 882. Öt nap átlaga (ezer Ft)?',
            580,
            '(568+465+497+488+882)/5 = 580'
        ),
        q(
            'er25m-5',
            '2025/5. Hegyesszögű háromszög: a 6 cm-es oldallal szemközti szög 60°. A 5 cm-es oldallal szemközti szög (fok, egy tizedesre).',
            46.2,
            'sin a / 5 = sin 60 / 6 -> a ~ 46,2',
            { figure: tri }
        ),
        q(
            'er25m-7',
            '2025/7. 3 cm sugarú félgömb térfogata (cm³, egy tizedesre).',
            56.5,
            '(2/3)pi*27 = 18pi ~ 56,5'
        ),
        q(
            'er25m-8',
            '2025/8. Lakásárak (M Ft): 50, 50, 55, 55, 55, 70, 70, 80, 80, 90, 110, 115, 130, 145.\nSodrófa: min és max.',
            50,
            'min 50, max 145',
            { alternativeAnswer: 145 }
        ),
        q(
            'er25m-8q',
            '2025/8. Ugyanazok az árak. Q1, medián, Q3 (millió Ft).',
            55,
            'Q1=55, median=75, Q3=110',
            { alternativeAnswer: 75, thirdAnswer: 110 }
        ),
        q(
            'er25m-9a',
            '2025/9. Szabályos hatszög, a = BA, c = BC. CA = p·a + q·c. Írd be p-t és q-t.',
            1,
            'CA = a - c',
            { alternativeAnswer: -1, figure: hex }
        ),
        q(
            'er25m-9b',
            '2025/9. Ugyanaz. BE = p*(a+c). Mennyi p?',
            2,
            'BE = 2(a + c)',
            { figure: hex }
        ),
        q(
            'er25m-10',
            '2025/10. A (0; 1) ponton átmenő, y = 2x+4-gyel párhuzamos egyenes meredeksége és tengelymetszete.',
            2,
            'y = 2x + 1',
            { alternativeAnswer: 1 }
        ),
        q(
            'er25m-11',
            '2025/11. Mértani sorozat: a2 = 24, a3 = 36. S6 = ?',
            332.5,
            'q = 1,5; a1 = 16; S6 = 332,5'
        ),
        q(
            'er25m-12',
            '2025/12. Piros és kék kocka. P(egyiken 6-os, a másikon páratlan)? (1/6)',
            1 / 6,
            '6/36 = 1/6'
        ),
        q(
            'er25m-13a',
            '2025/13.a) (x+8)/20 + (x-5)/25 = 2. x = ?',
            20,
            '5(x+8)+4(x-5) = 200 -> x = 20'
        ),
        q(
            'er25m-13b',
            '2025/13.b) Téglalap: egyik oldal 48 cm-rel hosszabb, terület 2025 cm². Kerület (cm)?',
            204,
            'oldalak 27 es 75; K = 204'
        ),
        q(
            'er25m-14a',
            '2025/14.a) AB=12, BC=15, BD=20, szög A=90°, szög DBC=63°. β = szög ABC (fok, egy tizedesre).',
            116.1,
            'szog ABD ~ 53,1; beta ~ 116,1',
            { figure: quad }
        ),
        q(
            'er25m-14b',
            '2025/14.b) Ugyanaz a négyszög. Terület (cm²).',
            230,
            'T = 230 cm2',
            { figure: quad }
        ),
        q(
            'er25m-14c',
            '2025/14.c) „Ha egy négyszög átlói felezik egymást, akkor rombusz.” Igaz=1, hamis=0.',
            0,
            'Hamis (paralelogramma).',
            { figure: quad }
        ),
        q(
            'er25m-15b',
            '2025/15.b) h: x |-> 2^x + 1. Melyik x-hez rendel 1,25-ot?',
            -2,
            '2^x + 1 = 1,25 -> x = -2'
        ),
        q(
            'er25m-15c',
            '2025/15.c) j: x |-> (x-1)^2 - 2 a [-1; 4]-en. A minimumhely x- es y-koordinataja.',
            1,
            'minimum (1; -2)',
            { alternativeAnswer: -2 }
        ),
        q(
            'er25m-16a1',
            '2025/16.a) 2012: 8045 millió hívás, 18001 millió perc. Átlagos hívásidő (perc, két tizedesre).',
            2.24,
            '18001/8045 ~ 2,24'
        ),
        q(
            'er25m-16a2',
            '2025/16.a) 2017: 22377 millió perc, atlag 2,83 perc. Hívások száma (millió db, egészre).',
            7907,
            '22377/2,83 ~ 7907'
        ),
        q(
            'er25m-16a3',
            '2025/16.a) 2022: 8577 millió hívás, atlag 3,31 perc. Összidő (millió perc, egészre).',
            28390,
            '8577 * 3,31 ~ 28390'
        ),
        q(
            'er25m-16b',
            '2025/16.b) Számtani: 4. szint 630 pont, 7. szint 990 pont. 12 szint összpontszáma?',
            11160,
            'd = 120; a1 = 270; S12 = 11160'
        ),
        q(
            'er25m-16c',
            '2025/16.c) 32 fő, három szolgáltató, Venn-adatok. Hánynak volt Bétánál előfizetése?',
            10,
            'Béta: 10 fő'
        ),
        q(
            'er25m-17a',
            '2025/17.a) 300 Ft csak 100 és 50 Ft-os érmékből, a sorrend számít. Hányféleképpen?',
            13,
            '1+5+6+1 = 13',
            { figure: dessert }
        ),
        q(
            'er25m-17b',
            '2025/17.b) 2 tej + 4 étcsoki, 3-at választunk. P(1 tej + 2 étcsoki)?',
            0.6,
            'C(2,1)*C(4,2)/C(6,3) = 0,6',
            { figure: dessert }
        ),
        q(
            'er25m-17c',
            '2025/17.c) Túrórúd csokoládé-térfogata (cm³, egészre).',
            11,
            '~ 11 cm3',
            { figure: dessert }
        ),
        q(
            'er25m-18a',
            '2025/18.a) p(h) = 101325 * 10^{-0,054h}, h km. Everest 8,848 km. Légnyomás (Pa, egészre).',
            33723,
            '~ 33723 Pa'
        ),
        q(
            'er25m-18b',
            '2025/18.b) Hol 60000 Pa? Magasság méterben, 100 m-re kerekítve.',
            4200,
            'h ~ 4,2 km = 4200 m'
        ),
        q(
            'er25m-18c',
            '2025/18.c) Hegymászók: 125, 70, 50, 23. Összlétszám, és Ázsia körcikk-szöge (fok, egészre).',
            268,
            '268 fo; Azsia ~ 168 fok',
            { alternativeAnswer: 168, figure: pie }
        ),
        q(
            'er25m-18d',
            '2025/18.d) 5 hegymászó, Ágnes és László közvetlenül egymás mellett. Hány sorrend?',
            48,
            '2 * 4! = 48'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'er2025MajKozepBank.ts',
        message: '2025 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-batch-2325',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2025_MAJ_KOZEP_COUNT = 33;
