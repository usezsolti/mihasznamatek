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

const FIG = '/figures/erettsegi/2026maj-kozep';

/** 2026. május 5. középszint — itemek a javítási útmutató szerint. */
export function getErettsegi2026MajKozepQuestions(): Question[] {
    const graphs = imageFigure(`${FIG}/t5-graphs.png`, '2026/5. A–D grafikonok');
    const box = imageFigure(`${FIG}/t6-box.png`, '2026/6. dobozdiagram');
    const tri = imageFigure(`${FIG}/t9-tri.png`, '2026/9. háromszög');
    const venn = imageFigure(`${FIG}/t14-venn.png`, '2026/14. Venn-ábrák');
    const light = imageFigure(`${FIG}/t16-light.png`, '2026/16.d) világítótorony');
    const table = imageFigure(`${FIG}/t17-table.png`, '2026/17. csapatok száma');
    const goal = imageFigure(`${FIG}/t17-goal.png`, '2026/17.d) kapuháló');
    const plane = imageFigure(`${FIG}/t18-plane.png`, '2026/18.e) ülésrend');

    const list: Question[] = [
        q(
            'er26m-1',
            '2026/1. A = {2; 4}. A ∪ B = {1; 2; 3; 4; 5}.\nSorold fel azokat az elemeket, amelyek B-ben biztosan benne vannak (A-ban nincsenek, de az unióban igen).',
            0,
            'B-nek tartalmaznia kell {1; 3; 5}-öt. Mintamegoldás: B = {1; 3; 5}.',
            { expectedSet: ['1', '3', '5'] }
        ),
        q(
            'er26m-2',
            '2026/2. Egy ötpontú gráfban a pontok fokszámának összege 10, és az egyik pont fokszáma 4.\nHány éle van a gráfnak?',
            5,
            'Fokszámösszeg = 2e → e = 5'
        ),
        q(
            'er26m-3',
            '2026/3. Derékszögű háromszög átfogója 50 cm, egyik befogója 14 cm. A másik befogó hossza (cm)?',
            48,
            'sqrt(50^2 − 14^2) = sqrt(2500 − 196) = sqrt(2304) = 48'
        ),
        q(
            'er26m-4',
            '2026/4. Hány átlója van egy konvex 11-szögnek?',
            44,
            'n(n−3)/2 = 11·8/2 = 44'
        ),
        q(
            'er26m-5',
            '2026/5. Válaszd ki f: R → R, f(x) = 2^x grafikonját!\nA=1, B=2, C=3, D=4. Írd be a helyes betű számát.',
            1,
            '2^x átmegy (0;1) és (1;2) ponton, x→−∞ esetén y→0. A',
            { figure: graphs }
        ),
        q(
            'er26m-6',
            '2026/6. Dobozdiagram: add meg a négy adatot tetszőleges sorrendben.\nmaximum, medián, alsó kvartilis, terjedelem.',
            96,
            'max=96, medián=70, Q1=58, terjedelem=96−42=54',
            { alternativeAnswer: 70, thirdAnswer: 58, fourthAnswer: 54, figure: box }
        ),
        q(
            'er26m-7',
            '2026/7. (2^2)^4 / 8 = 2^n. Mennyi n?',
            5,
            '(4)^4 / 8 = 256/8 = 32 = 2^5 → n = 5'
        ),
        q(
            'er26m-8',
            '2026/8. Kör középpontja (−3; 0), sugara 4. Az (x+3)^2 + y^2 = r^2 alakban mennyi r^2?',
            16,
            '(x+3)^2 + y^2 = 16'
        ),
        q(
            'er26m-9',
            '2026/9. Háromszög egyik oldala 6 cm, a rajta fekvő szögek 45° és 70°.\nA 45°-os szöggel szemközti oldal hossza cm-ben, két tizedesre kerekítve.',
            4.68,
            'Harmadik szög 65°. Szinusztétel: b/sin45 = 6/sin65 → b ≈ 4,68 cm',
            { figure: tri }
        ),
        q(
            'er26m-10',
            '2026/10. Két egész szám, különbségük 6, abszolútértékük egyenlő. Írd be a két számot.',
            3,
            '3 és −3',
            { alternativeAnswer: -3 }
        ),
        q(
            'er26m-11',
            '2026/11. Hány háromjegyű, különböző számjegyű páratlan természetes szám alkotható az 1, 2, 3, 4 jegyekből?',
            12,
            '4·3·2 = 24 különböző jegyű háromjegyű, fele páratlan → 12'
        ),
        q(
            'er26m-12',
            '2026/12. Két szabályos dobókocka. Annak a valószínűsége, hogy a dobott számok különbsége legalább 4. (pl. 1/6)',
            1 / 6,
            '36 összes, 6 kedvező (6-1, 6-2, 5-1 és fordítva) → 6/36 = 1/6'
        ),
        q(
            'er26m-13a',
            '2026/13.a) (x+3)^2 + 2(x+3) = 80 a valós számokon. Írd be a két gyököt.',
            5,
            'x = 5 vagy x = −13',
            { alternativeAnswer: -13 }
        ),
        q(
            'er26m-13b',
            '2026/13.b) Két pozitív szám összege 15. A kisebb háromszorosa + a nagyobb kétszerese = a nagyobb háromszorosa − a kisebb kétszerese.\nÍrd be a két számot.',
            2.5,
            'kisebb 2,5; nagyobb 12,5',
            { alternativeAnswer: 12.5 }
        ),
        q(
            'er26m-14a',
            '2026/14.a) H = {1,…,49}, A páros, B 3-mal osztható, C 5-tel osztható.\nSorold fel C \\ (A ∪ B) elemeit.',
            0,
            '{5; 25; 35}',
            { expectedSet: ['5', '25', '35'], figure: venn }
        ),
        q(
            'er26m-14b',
            '2026/14.b) A 2. ábrán satírozott halmaz (A ∩ B) \\ C. Sorold fel az elemeit.',
            0,
            '(A ∩ B) \\ C = {6; 12; 18; 24; 36; 42; 48}',
            { expectedSet: ['6', '12', '18', '24', '36', '42', '48'], figure: venn }
        ),
        q(
            'er26m-14c',
            '2026/14.c) Véletlen elem H-ból. P(2-vel osztható, de 3-mal nem). (pl. 16/49)',
            16 / 49,
            '49 összes, 24 páros, 8 osztható 6-tal → 16/49 ≈ 0,327'
        ),
        q(
            'er26m-14d',
            '2026/14.d) Van-e háromjegyű, csupa azonos jegyű szám, amely 2-vel, 3-mal és 5-tel is osztható?\n0 = nincs, 1 = van',
            0,
            'Nincs. 5-tel osztható azonos jegyű: 555, az nem páros.'
        ),
        q(
            'er26m-15aI',
            '2026/15.a) f(x) = (x−1)^2 − 4. I. állítás: a minimumhely az 1. Igaz=1, hamis=0.',
            1,
            'Parabola csúcsa x=1, minimumhely. Igaz.'
        ),
        q(
            'er26m-15aII',
            '2026/15.a) II. Az f szigorúan monoton nő. Igaz=1, hamis=0.',
            0,
            'Csúcsos parabola, nem szigorúan monoton. Hamis.'
        ),
        q(
            'er26m-15aIII',
            '2026/15.a) III. Az f kölcsönösen egyértelmű. Igaz=1, hamis=0.',
            0,
            'Nem injektív. Hamis.'
        ),
        q(
            'er26m-15b',
            '2026/15.b) f(x) = (x−1)^2 − 4 zérushelyei. Írd be a két gyököt.',
            -1,
            'x = −1 és x = 3',
            { alternativeAnswer: 3 }
        ),
        q(
            'er26m-15c',
            '2026/15.c) f értékkészlete: A=[1;∞[, B=[4;∞[, C=[−4;∞[, D=R.\nBetű száma: A=1 … D=4.',
            3,
            'Minimum −4, értékkészlet [−4; ∞[ → C'
        ),
        q(
            'er26m-15d',
            '2026/15.d) Grafikon pontjai x=0 és x=4. A két pont távolsága (pl. sqrt(80) vagy 8,94).',
            Math.sqrt(80),
            'f(0)=−3, f(4)=5 → sqrt(4^2 + 8^2) = sqrt(80) ≈ 8,94'
        ),
        q(
            'er26m-16a',
            '2026/16.a) Viharjelzés ápr. 1. 0:00 – okt. 31. 24:00. 1319+668 óra jelzés.\nÁpr/jún/szept 30 napos, a másik 4 hónap 31. Hány százaléka volt jelzéses? Egy tizedesre.',
            38.7,
            '214 nap = 5136 óra. 1987/5136 ≈ 38,7%'
        ),
        q(
            'er26m-16b',
            '2026/16.b) 115 másodfokú jelzés, összesen 668 óra. Átlag óra:perc, egész percre.\nÍrd be az órát és a percet (két mező).',
            5,
            '668/115 ≈ 5,81 óra → 5 óra 49 perc',
            { alternativeAnswer: 49 }
        ),
        q(
            'er26m-16c',
            '2026/16.c) Árnyék 19 m, beesési szög 70°. A torony magassága méterben, egy tizedesre.',
            52.2,
            'h = 19 · tg 70° ≈ 52,2 m'
        ),
        q(
            'er26m-16d',
            '2026/16.d) Világítótorony 3 km-re a parttól, fény 30 km-ig. A tengeri láthatósági terület km²-ben, egészre kerekítve.',
            1234,
            'Körszelet ≈ 1233,7 km² → 1234 km²',
            { figure: light }
        ),
        q(
            'er26m-17a',
            '2026/17.a) Csapatok száma időben. Legjobb diagram: A) kör  B) oszlop  C) doboz.\nBetű száma: A=1, B=2, C=3.',
            2,
            'Időbeli változás: oszlopdiagram. B',
            { figure: table }
        ),
        q(
            'er26m-17b',
            '2026/17.b) 2000: 2272 csapat, 2025: 1554. Hány %-kal csökkent? Egy tizedesre.',
            31.6,
            '1554/2272 ≈ 0,684 → 31,6% csökkenés',
            { figure: table }
        ),
        q(
            'er26m-17c',
            '2026/17.c) 2025 után évente 2%-kal nő. Melyik évben éri el ismét az 1800-at?',
            2033,
            '1554 · 1,02^n = 1800 → n ≈ 7,41 → 2033'
        ),
        q(
            'er26m-17d',
            '2026/17.d) Kapu 7,32 × 2,44 m, mélység 1,5 m. Háló (4 lap) m²-ben, egy tizedesre.',
            36.2,
            '7,32·2,44 + 7,32·1,5 + 2·2,44·1,5 ≈ 36,2',
            { figure: goal }
        ),
        q(
            'er26m-17e',
            '2026/17.e) 11 kezdő, legfeljebb 5 csere (0–5 fő). Hányféleképpen választhatók a cseréltek?',
            1024,
            'C(11,0)+…+C(11,5) = 1024 = 2^11 / 2'
        ),
        q(
            'er26m-18a',
            '2026/18.a) Poggyász 55×40×23 cm. Hány literes, 10 literre kerekítve?',
            50,
            '50 600 cm³ = 50,6 liter → 50 liter'
        ),
        q(
            'er26m-18b',
            '2026/18.b) A poggyász testátlója cm-ben, egy tizedesre (75 cm-es esernyő nem fér el).',
            71.8,
            'sqrt(55^2+40^2+23^2) ≈ 71,8 < 75'
        ),
        q(
            'er26m-18c',
            '2026/18.c) 2025-ben 19,6 millió utas, +0,9 millió/év. Melyik évben éri el a 30 milliót?',
            2037,
            '19,6 + 0,9n > 30 → n > 11,56 → 12. év = 2037'
        ),
        q(
            'er26m-18d',
            '2026/18.d) 2025. jan. 1. – 2040. dec. 31. (16 év), +0,9 millió/év. Összes utas millió főben, egy tizedesre.',
            421.6,
            'Számtani sor: S_16 = 16/2 · (2·19,6 + 15·0,9) = 421,6'
        ),
        q(
            'er26m-18e',
            '2026/18.e) 70 ülőhely, 36 ablakos. 3 barát. P(legfeljebb 1 ablakos hely). (pl. 0,478 vagy 11/23)',
            26180 / 54740,
            'C(70,3)=54740; kedvező 5984+20196=26180 → ≈0,478',
            { figure: plane }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H1',
        location: 'er2026MajKozepBank.ts:getErettsegi2026MajKozepQuestions',
        message: '2026 maj kozep bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            lastId: list[list.length - 1]?.id,
            a3: list.find((x) => x.id === 'er26m-3')?.answer,
            a12: list.find((x) => x.id === 'er26m-12')?.answer,
            a17e: list.find((x) => x.id === 'er26m-17e')?.answer,
            hasGraphs: Boolean(list.find((x) => x.id === 'er26m-5')?.figure),
            hasVenn: Boolean(list.find((x) => x.id === 'er26m-14a')?.figure),
        },
        runId: 'er-2026-maj',
    });
    // #endregion

    return list;
}

export const ERETTSEGI_2026_MAJ_KOZEP_COUNT = 38;
