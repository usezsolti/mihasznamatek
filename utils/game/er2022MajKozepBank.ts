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

const FIG = '/figures/erettsegi/2022maj-kozep';

/** 2022. május 3. középszint (2212) — válaszok a javítási útmutató szerint. */
export function getErettsegi2022MajKozepQuestions(): Question[] {
    const graphs = [
        imageFigure(`${FIG}/p04-1.jpeg`, '2022/4. A grafikon'),
        imageFigure(`${FIG}/p04-2.jpeg`, '2022/4. B grafikon'),
        imageFigure(`${FIG}/p04-3.jpeg`, '2022/4. C grafikon'),
        imageFigure(`${FIG}/p04-4.jpeg`, '2022/4. D grafikon'),
    ];
    const pie = imageFigure(`${FIG}/p07-1.jpeg`, '2022/11. kördiagram-sablon');
    const jar = imageFigure(`${FIG}/p20-1.jpeg`, '2022/17. kerámiaedény');

    const list: Question[] = [
        q(
            'er22m-1',
            '2022/1. A = {2; 3; 5}, A ∩ B = {2; 3}, A ∪ B = {1; 2; 3; 4; 5}. Sorold fel B elemeit.',
            0,
            'B = {1; 2; 3; 4}',
            { expectedSet: ['1', '2', '3', '4'] }
        ),
        q(
            'er22m-2',
            '2022/2. Hány éle van egy tízpontú teljes gráfnak?',
            45,
            'C(10; 2) = 10·9/2 = 45'
        ),
        q(
            'er22m-3',
            '2022/3. Melyik az a szám, amely 10-zel kisebb az ellentettjénél?',
            -5,
            'x = −x − 10 → x = −5'
        ),
        q(
            'er22m-4',
            '2022/4. Melyik az x ↦ (x−2)² grafikonja a valósokon?\nA=1, B=2, C=3, D=4.',
            3,
            'C',
            { figures: graphs }
        ),
        q(
            'er22m-5',
            '2022/5. Derékszögű háromszög: egyik befogó 5 cm, a vele szemközti szög 32°. A másik befogó (cm, egészre).',
            8,
            'a = 5 / tg 32° ≈ 8'
        ),
        q(
            'er22m-6',
            '2022/6. 5 kérdés, kérdésenként 4 válasz, mindenhol egyet kell jelölni. Hány kitöltés?',
            1024,
            '4⁵ = 1024'
        ),
        q(
            'er22m-7',
            '2022/7. Mértani sorozat: a2 = 1,5, q = 3. Add meg a6-ot és S10-et.',
            121.5,
            'a6 = 121,5; S10 = 14762',
            { alternativeAnswer: 14762 }
        ),
        q(
            'er22m-8',
            '2022/8. A(5; −3) és B(1; 0) távolsága.',
            5,
            'sqrt(4²+3²) = 5'
        ),
        q(
            'er22m-10z',
            '2022/10. f: [−8; 4] → R, f(x) = (1/2)x + 3. Zérushely?',
            -6,
            'x = −6'
        ),
        q(
            'er22m-10r',
            '2022/10. Ugyanaz az f. Az értékkészlet két végpontja.',
            -1,
            '[−1; 5]',
            { alternativeAnswer: 5 }
        ),
        q(
            'er22m-11',
            '2022/11. BKK-szavazás: 50% 60 perc, 30% 90 perc, 20% 30 perc. A három körcikk szöge (fok).',
            180,
            '180°, 108°, 72°',
            { alternativeAnswer: 108, thirdAnswer: 72, figure: pie }
        ),
        q(
            'er22m-12',
            '2022/12. Három szabályos érme. P(mindhárom azonos)? (2/8 = 1/4)',
            0.25,
            '2/8 = 1/4'
        ),
        q(
            'er22m-13a',
            '2022/13.a) (x−5)² + 7 = 2x. Add meg a két gyököt.',
            8,
            'x = 8 vagy x = 4',
            { alternativeAnswer: 4 }
        ),
        q(
            'er22m-13b',
            '2022/13.b) x + y = 1 és 0,7x + 0,2y = x. Add meg x-et és y-t.',
            0.4,
            'x = 0,4; y = 0,6',
            { alternativeAnswer: 0.6 }
        ),
        q(
            'er22m-14a',
            '2022/14.a) Osztálylétszámok (fiú+lány): A 18+14, B 24+6, C 18+17, D 12+15. A legkisebb osztályban a lányok a fiúk hány %-a?',
            125,
            '12.D: 15/12 = 125%'
        ),
        q(
            'er22m-14b',
            '2022/14.b) Lányok: 14, 6, 17, 15. Terjedelem, átlag, szórás (szórás két tizedesre ≈4,18).',
            11,
            'terjedelem 11, átlag 13, szórás ≈ 4,18',
            { alternativeAnswer: 13, thirdAnswer: 4.18 }
        ),
        q(
            'er22m-14c',
            '2022/14.c) 12.B: 30 fő, lányátlag 4,5 (6 lány), osztályátlag 4,1. A fiúk átlaga?',
            4,
            '96/24 = 4'
        ),
        q(
            'er22m-15a',
            '2022/15.a) 4,7 t szőlő, 1 l léhez 1,3 kg kell, 5 l-es tasak. Hány teli tasak?',
            723,
            '4700/6,5 ≈ 723'
        ),
        q(
            'er22m-15b',
            '2022/15.b) Doboz élei 12 cm, 20 cm, 25 cm. Hány literes?',
            6,
            '6000 cm³ = 6 l'
        ),
        q(
            'er22m-15c',
            '2022/15.c) Téglalap telek 3:4, terület 1,47 ha. Kerület (m)?',
            490,
            'oldalak 105 m és 140 m; K = 490 m'
        ),
        q(
            'er22m-16a',
            '2022/16.a) 6 millió Ft-os autó 5 év alatt lineárisan a felére csökken. Havi értékvesztés (Ft)?',
            50000,
            '3 000 000 / 60 = 50 000'
        ),
        q(
            'er22m-16b',
            '2022/16.b) Havi 1% csökkenés, 2 év. Az autó értéke (Ft, egészre) és a százalékos csökkenés (egy tizedesre).',
            4714069,
            '≈ 4 714 069 Ft; 21,4%',
            { alternativeAnswer: 21.4 }
        ),
        q(
            'er22m-16c',
            '2022/16.c) Ugyanaz az exponenciális modell. Hány hónap alatt csökken a felére?',
            69,
            'n ≈ 68,97 → 69 hónap'
        ),
        q(
            'er22m-16d',
            '2022/16.d) Számtani: a1 = 65, S12 = 1110. Havi növekmény (db)?',
            5,
            'd = 5'
        ),
        q(
            'er22m-17a',
            '2022/17.a) Edény: csonkakúp + henger, alapátmérő 14 cm, henger 11 cm, magasság 21 cm. Térfogat (cm³, egészre).',
            2293,
            '≈ 2293 cm³',
            { figure: jar }
        ),
        q(
            'er22m-17b',
            '2022/17.b) Ugyanaz. A belső zománcozott felület (cm², egészre).',
            933,
            '≈ 933 cm²',
            { figure: jar }
        ),
        q(
            'er22m-17c',
            '2022/17.c) 5 natúr + 15 csokis edényből 4-et választunk. P(1 natúr + 3 csokis), három tizedesre.',
            0.47,
            '2275/4845 ≈ 0,470',
            { figure: jar }
        ),
        q(
            'er22m-18aI',
            '2022/18.a) I. Ha B üres, akkor A ∩ B üres. Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er22m-18aII',
            '2022/18.a) II. Ha A = B, akkor A \\ B üres. Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er22m-18aIII',
            '2022/18.a) III. Ha A ∪ B = A, akkor A = B. Igaz=1, hamis=0.',
            0,
            'Hamis (B ⊂ A is lehet).'
        ),
        q(
            'er22m-18b',
            '2022/18.b) „Ha A ∩ B üres, akkor B üres.” Igaz=1, hamis=0.',
            0,
            'Hamis (két diszjunkt, nemüres halmaz).'
        ),
        q(
            'er22m-18d',
            '2022/18.d) Számjegyek: 0, 1, 2, 4, 9, mind különböző. Hány 4-gyel osztható ötjegyű szám?',
            30,
            '3·6 + 3·4 = 30'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H24',
        location: 'er2022MajKozepBank.ts',
        message: '2022 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-2022-maj',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2022_MAJ_KOZEP_COUNT = 32;
