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

const FIG = '/figures/erettsegi/2024maj-kozep';

/** 2024. május 7. középszint (K2414) — válaszok a javítási útmutató szerint. */
export function getErettsegi2024MajKozepQuestions(): Question[] {
    const box = imageFigure(`${FIG}/p16-1.png`, '2024/15.c) sodrófadiagram');
    const isler = imageFigure(`${FIG}/p20-1.jpeg`, '2024/17. habos isler');
    const circuit = imageFigure(`${FIG}/p22-1.png`, '2024/18. áramköri gráf');

    const list: Question[] = [
        q(
            'er24m-1A',
            '2024/1. A ∪ B = {1; 2; 3; 4; 5; 6}, A ∩ B = {1; 2}, A \\ B = {3; 4}. Sorold fel A elemeit.',
            0,
            'A = {1; 2; 3; 4}',
            { expectedSet: ['1', '2', '3', '4'] }
        ),
        q(
            'er24m-1B',
            '2024/1. Ugyanazok a halmazok. Sorold fel B elemeit.',
            0,
            'B = {1; 2; 5; 6}',
            { expectedSet: ['1', '2', '5', '6'] }
        ),
        q(
            'er24m-2',
            '2024/2. Derékszögű háromszög egyik befogója 24 cm, átfogója 25 cm. A másik befogó (cm)?',
            7,
            'sqrt(25²−24²) = 7'
        ),
        q(
            'er24m-3',
            '2024/3. Hány darab négyjegyű, különböző számjegyű páratlan szám alkotható az 1, 2, 3, 4 jegyekből?',
            12,
            '3·2·1·2 = 12'
        ),
        q(
            'er24m-4',
            '2024/4. A diagram 2022-ben 1000, 2023-ban 1200 eladott terméket mutat. Igaz-e, hogy 2023-ban háromszor annyit adtak el, mint 2022-ben? Igaz=1, hamis=0.',
            0,
            'Hamis: 1200 = 1,2 · 1000, nem 3-szoros.'
        ),
        q(
            'er24m-5',
            '2024/5. Add meg a értékét, ha a^{1/2} = 4.',
            16,
            'a = 4² = 16'
        ),
        q(
            'er24m-6',
            '2024/6. Számtani sorozat: a8 = a4 + 6, a6 = 6. S6 = ?',
            13.5,
            'd = 1,5; a1 = −1,5; S6 = 13,5'
        ),
        q(
            'er24m-7',
            '2024/7. Hatszög alapú gúla: csúcsok, lapok, élek száma.',
            7,
            'csúcs 7, lap 7, él 12',
            { alternativeAnswer: 7, thirdAnswer: 12 }
        ),
        q(
            'er24m-8',
            '2024/8. Egy szám 2-es alapú logaritmusa 6. Mennyi a szám kétszeresének 2-es alapú logaritmusa?',
            7,
            'log₂ 64 = 6; log₂ 128 = 7'
        ),
        q(
            'er24m-9',
            '2024/9. A győztes a szavazók 55%-át kapta: 10 593 szavazat. Hányan szavaztak?',
            19260,
            '10593 / 0,55 = 19260'
        ),
        q(
            'er24m-10',
            '2024/10. Mely függvényeknek van zérushelye? f: x ↦ x²;  g: x ↦ 2ˣ;  h: x ↦ x+3;  i: x ↦ x;  j: x ↦ 5.\nÍrd be a betűket.',
            0,
            'f, h, i',
            { expectedSet: ['f', 'h', 'i'] }
        ),
        q(
            'er24m-11',
            '2024/11. Jegyek: 1, 5, 5, 5. Átlag és szórás (szórás két tizedesre).',
            4,
            'átlag 4, szórás ≈ 1,73',
            { alternativeAnswer: 1.73 }
        ),
        q(
            'er24m-12',
            '2024/12. Három különböző színű kocka. P(három különböző szám)? Tizedestörtként is jó (≈0,556).',
            120 / 216,
            '6·5·4 / 216 = 120/216 ≈ 0,556'
        ),
        q(
            'er24m-13a',
            '2024/13.a) 18·(7x + 96) + 19·(5x − 56) = 1990. x = ?',
            6,
            'x = 6'
        ),
        q(
            'er24m-13b',
            '2024/13.b) 1896 és 1956 összes közös pozitív osztója. Írd be mindet.',
            0,
            '{1; 2; 3; 4; 6; 12}',
            { expectedSet: ['1', '2', '3', '4', '6', '12'] }
        ),
        q(
            'er24m-14a',
            '2024/14.a) Szabályos tízszög belső szöge (fok).',
            144,
            '(10−2)·180°/10 = 144°'
        ),
        q(
            'er24m-14b',
            '2024/14.b) Szabályos tízszög oldala 10 cm. Terület (cm², egészre).',
            770,
            '(10·10²)/4 · 1/tg(18°) ≈ 770'
        ),
        q(
            'er24m-14c',
            '2024/14.c) Szabályos sokszög átlóinak száma 2015. Hány oldalú?',
            65,
            'n(n−3)/2 = 2015 → n = 65'
        ),
        q(
            'er24m-15a',
            '2024/15.a) 3 dl alma + 5 dl barack = 1010 Ft; 5 dl alma + 3 dl barack = 990 Ft. 1 dl alma és 1 dl barack (Ft).',
            120,
            'alma 120 Ft/dl, barack 130 Ft/dl',
            { alternativeAnswer: 130 }
        ),
        q(
            'er24m-15b',
            '2024/15.b) Három különböző ital véletlen kiosztása. P(senki sem a sajátját kapja)?',
            1 / 3,
            '2 derangement / 6 = 1/3'
        ),
        q(
            'er24m-15c1',
            '2024/15.c) Sodrófa: „Az adatok terjedelme 7000 Ft.” Igaz=1, hamis=0, nem eldönthető=2.',
            0,
            'Hamis: max−min = 5500 Ft.',
            { figure: box }
        ),
        q(
            'er24m-15c2',
            '2024/15.c) „A kifizetett összegek átlaga 3500 Ft.” Igaz=1, hamis=0, nem eldönthető=2.',
            2,
            'Nem lehet eldönteni (átlag nem olvasható le).',
            { figure: box }
        ),
        q(
            'er24m-15c3',
            '2024/15.c) „A kifizetett összegek kb. 25%-a legalább 4000 Ft volt.” Igaz=1, hamis=0, nem eldönthető=2.',
            1,
            'Igaz: Q3 = 4000.',
            { figure: box }
        ),
        q(
            'er24m-15c4',
            '2024/15.c) „Volt olyan asztal, ahol 2500 Ft-ot fizettek.” Igaz=1, hamis=0, nem eldönthető=2.',
            2,
            'Nem lehet eldönteni.',
            { figure: box }
        ),
        q(
            'er24m-16a',
            '2024/16.a) 4 függvény közül legalább kettőt kiválasztani. Hányféleképpen?',
            11,
            'C(4,2)+C(4,3)+C(4,4) = 11'
        ),
        q(
            'er24m-16b',
            '2024/16.b) Lineáris függvény a (12; 7) és (13; 9) pontokon. Írd be m-et és b-t (x ↦ mx+b).',
            2,
            'x ↦ 2x − 17',
            { alternativeAnswer: -17 }
        ),
        q(
            'er24m-16c',
            '2024/16.c) (12; 7) középpontú, 15 sugarú kör és az y-tengely metszéspontjainak y-koordinátái.',
            -2,
            '(0; −2) és (0; 16)',
            { alternativeAnswer: 16 }
        ),
        q(
            'er24m-17a',
            '2024/17.a) Két 0,5 cm vastag, 6 cm átmérőjű tésztalap együttes térfogata (cm³, egy tizedesre).',
            28.3,
            '2 · π · 3² · 0,5 = 9π ≈ 28,3',
            { figure: isler }
        ),
        q(
            'er24m-17b',
            '2024/17.b) 90 ml hab, teljes magasság 5 cm. A habos henger átmérője (cm, egy tizedesre).',
            5.4,
            'πr²·4 = 90 → d ≈ 5,4',
            { figure: isler }
        ),
        q(
            'er24m-17c',
            '2024/17.c) P(repedés)=0,03, 30 isler. P(egyiken sem reped), három tizedesre.',
            0.401,
            '0,97³⁰ ≈ 0,401',
            { figure: isler }
        ),
        q(
            'er24m-17d',
            '2024/17.d) 20 rendelés, Venn-adatok. Hány rendelésben csak a krémes szerepelt?',
            1,
            'csak krémes: 1',
            { figure: isler }
        ),
        q(
            'er24m-18a',
            '2024/18.a) Hatpontú, 6 élű gráf, ismert fokok: 1, 2, 2, 3, 3. A 6. csúcs foka?',
            1,
            '2e = 12 = 1+2+2+3+3+f → f = 1',
            { figure: circuit }
        ),
        q(
            'er24m-18b',
            '2024/18.b) Hatótáv 2011: 95 km, 2023: 425 km, lineáris modell. Melyik évben éri el az 1000 km-t?',
            2044,
            'évi +27,5 km → 2044',
            { figure: circuit }
        ),
        q(
            'er24m-18c',
            '2024/18.c) Ugyanazok az adatok, mértani (százalékos) modell. Melyik évben éri el az 1000 km-t?',
            2030,
            'q = (425/95)^{1/12}; 95·q^n = 1000 → 2030',
            { figure: circuit }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'er2024MajKozepBank.ts',
        message: '2024 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-batch-2325',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2024_MAJ_KOZEP_COUNT = 34;
