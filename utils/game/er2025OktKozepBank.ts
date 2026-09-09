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

const FIG = '/figures/erettsegi/2025okt-kozep';

/** 2025. október 14. középszint — itemek a javítási útmutató szerint. */
export function getErettsegi2025OktKozepQuestions(): Question[] {
    const chord = imageFigure(`${FIG}/t14-circle.png`, '2025/14. OAB húr, 100°');
    const color = imageFigure(`${FIG}/t14-color.png`, '2025/14.d) három tartomány');
    const caps = imageFigure(`${FIG}/t16-caps.png`, '2025/16. kávékapszula');
    const hemi = imageFigure(`${FIG}/t16-hemi.png`, '2025/16.c) félgömb kapszula');
    const expChart = imageFigure(`${FIG}/t18-exp.png`, '2025/18. exponenciális trend');
    const linChart = imageFigure(`${FIG}/t18-lin.png`, '2025/18.d–e) lineáris trend');

    const list: Question[] = [
        q(
            'er25o-1',
            '2025/1. x^2 − 5x + 6 = 0 a valós számokon. Írd be a két gyököt.',
            2,
            'x = 2 vagy x = 3',
            { alternativeAnswer: 3 }
        ),
        q(
            'er25o-2',
            '2025/2. a = b + c · t, ahol a = 11, b = 5, c = 2. Mennyi t?',
            3,
            't = (11 − 5)/2 = 3'
        ),
        q(
            'er25o-3I',
            '2025/3. I. Ha két rombusz területe egyenlő, akkor egybevágók. Igaz=1, hamis=0.',
            0,
            'Hamis.'
        ),
        q(
            'er25o-3II',
            '2025/3. II. Ha egy paralelogramma átlói egyenlő hosszúak, akkor téglalap. Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er25o-3III',
            '2025/3. III. Ha két vektor párhuzamos és egyenlő hosszú, akkor egyenlők. Igaz=1, hamis=0.',
            0,
            'Hamis (ellentétes irányúak is lehetnek).'
        ),
        q(
            'er25o-4',
            '2025/4. Hétpontú gráf, minden pont fokszáma 4. Hány éle van?',
            14,
            '7·4/2 = 14'
        ),
        q(
            'er25o-5',
            '2025/5. Melyik egyenlő b^{2/3}-mal minden pozitív b-re?\nA) (2/3)b\nB) b^{−3/2}\nC) cuberoot(b^2)\nD) b^2 / b^3\nBetű száma: A=1 … D=4.',
            3,
            'C: (b^2)^{1/3} = b^{2/3}'
        ),
        q(
            'er25o-6',
            '2025/6. Osztályfőnök + 3 diák. Hány sorrend, ha a tanár első vagy utolsó?',
            12,
            '2 · 3! = 12'
        ),
        q(
            'er25o-7u',
            '2025/7. A = {1;2;3;5;7}, B = {1;3;5;7;9}, C = {1;4;9}.\nSorold fel A ∪ B elemeit.',
            0,
            '{1; 2; 3; 5; 7; 9}',
            { expectedSet: ['1', '2', '3', '5', '7', '9'] }
        ),
        q(
            'er25o-7d',
            '2025/7. Ugyanazok a halmazok. Sorold fel (A ∩ B) \\ C elemeit.',
            0,
            '{3; 5; 7}',
            { expectedSet: ['3', '5', '7'] }
        ),
        q(
            'er25o-8',
            '2025/8. Derékszögű háromszög befogói 5 cm és 12 cm. A két hegyesszög foka, egy tizedesre. Írd be mindkettőt.',
            22.6,
            'tg α = 5/12 → α ≈ 22,6°, β ≈ 67,4°',
            { alternativeAnswer: 67.4 }
        ),
        q(
            'er25o-9',
            '2025/9. A függvény minden számhoz a kétszeresénél 3-mal nagyobbat rendel. Mit rendel a 7-hez?',
            17,
            '2·7 + 3 = 17'
        ),
        q(
            'er25o-10',
            '2025/10. Forgáskúp: r = 3 cm, m = 4 cm. Felszín cm²-ben, egy tizedesre (24π ≈ 75,4).',
            75.4,
            'alkotó 5 cm, A = 3π·3 + 3π·5 = 24π ≈ 75,4'
        ),
        q(
            'er25o-11',
            '2025/11. 0, 1, 1, 2, 3, 5. Írd be az átlagot és a szórást (szórás két tizedesre, ≈1,63).',
            2,
            'átlag 2, szórás sqrt(8/3) ≈ 1,63',
            { alternativeAnswer: 1.63 }
        ),
        q(
            'er25o-12',
            '2025/12. Két kocka. P(az összeg osztható 6-tal). (pl. 1/6 vagy 0,167)',
            6 / 36,
            '6 kedvező / 36 = 1/6 ≈ 0,167'
        ),
        q(
            'er25o-13a',
            '2025/13.a) Számtani sorozat: a2 = 7, a4 = 13. Írd be a10-et és az első 10 tag összegét.',
            31,
            'd = 3, a1 = 4, a10 = 31, S10 = 175',
            { alternativeAnswer: 175 }
        ),
        q(
            'er25o-13b',
            '2025/13.b) Mértani sorozat: b2 = 6, b5 = −162. Írd be b10-et és az első 10 tag összegét.',
            39366,
            'q = −3, b1 = −2, b10 = 39366, S10 = 29524',
            { alternativeAnswer: 29524 }
        ),
        q(
            'er25o-14a',
            '2025/14.a) Kör r = 5 cm, középponti szög 100°. Az AB húr hossza cm-ben, két tizedesre.',
            7.66,
            'h ≈ 7,66 cm',
            { figure: chord }
        ),
        q(
            'er25o-14b',
            '2025/14.b) Az OAB háromszög területe cm²-ben, egy tizedesre.',
            12.3,
            '(1/2)·5·5·sin 100° ≈ 12,3',
            { figure: chord }
        ),
        q(
            'er25o-14c',
            '2025/14.c) A 100°-os AB ív hossza cm-ben, két tizedesre.',
            8.73,
            '100/360 · 2π·5 ≈ 8,73',
            { figure: chord }
        ),
        q(
            'er25o-14d',
            '2025/14.d) Három tartomány, piros/sárga/zöld, 2 vagy 3 szín. Hány színezés? (szomszédosak lehetnek azonosak)',
            24,
            '3^3 − 3 = 24',
            { figure: color }
        ),
        q(
            'er25o-15mm',
            '2025/15.a) 14 lány magassága: 153, 156, 160, 162, 162, 164, 167, 169, 169, 172, 174, 174, 175, 177.\nÍrd be a minimumot és a maximumot (cm).',
            153,
            'min 153, max 177',
            { alternativeAnswer: 177 }
        ),
        q(
            'er25o-15q',
            '2025/15.a) Ugyanazok az adatok. Írd be az alsó kvartilist, a mediánt és a felső kvartilist (cm).',
            162,
            'Q1=162, medián=168, Q3=174',
            { alternativeAnswer: 168, thirdAnswer: 174 }
        ),
        q(
            'er25o-15b',
            '2025/15.b) 14 lányból kettőt választunk. P(egyik >170, másik <170). (pl. 45/91 vagy 0,495)',
            45 / 91,
            '5 magasabb, 9 alacsonyabb → 45/91 ≈ 0,495'
        ),
        q(
            'er25o-15c',
            '2025/15.c) 28 tanuló átlaga 172,75 cm, érkezik egy 180 cm-es. Az új átlag (cm)?',
            173,
            '(28·172,75 + 180)/29 = 173'
        ),
        q(
            'er25o-16a',
            '2025/16.a) 56 milliárd kapszula, egyenként 40 mm. Az Egyenlítő r = 6370 km.\nA lánc hányszorosa az Egyenlítőnek? Egészre kerekítve.',
            56,
            '2 240 000 / 40 024 ≈ 56',
            { figure: caps }
        ),
        q(
            'er25o-16b',
            '2025/16.b) Csonkakúp: alapátmérő 28 mm, fedő 24 mm, alkotó 28 mm. Térfogat cm³, egészre.',
            15,
            '≈ 14 842 mm³ → 15 cm³',
            { figure: caps }
        ),
        q(
            'er25o-16c',
            '2025/16.c) Félgömb 10 ml. A sugár cm-ben, egy tizedesre.',
            1.7,
            '(2/3)π r^3 = 10 → r ≈ 1,7 cm',
            { figure: hemi }
        ),
        q(
            'er25o-16d',
            '2025/16.d) P(selejt) = 0,001. 100 kapszula közül egyik sem selejtes. A valószínűség (pl. 0,905).',
            Math.pow(0.999, 100),
            '0,999^100 ≈ 0,905'
        ),
        q(
            'er25o-17a',
            '2025/17.a) 30 000 Ft-os keret, 37 éves vásárló, annyi % kedvezmény, ahány éves. Mennyit fizet (Ft)?',
            18900,
            '30 000 · 0,63 = 18 900'
        ),
        q(
            'er25o-17b',
            '2025/17.b) Ugyanaz az akció, 30 000 Ft-os keretért 16 500 Ft-ot fizet. Hány éves?',
            45,
            '16500/30000 = 55% → 45 éves'
        ),
        q(
            'er25o-17c',
            '2025/17.c) Nagymama háromszor annyi idős, mint Péter. Mindketten 30 000 Ft-os keretet vennének, Péter háromszor annyit fizetne. Írd be Péter és a nagymama korát.',
            25,
            'Péter 25, nagymama 75',
            { alternativeAnswer: 75 }
        ),
        q(
            'er25o-17d',
            '2025/17.d) 32 fős osztály, fiú:lány = 5:3. 11 szemüveges (7 fiú). 3 kiskorú lány, 1 szemüveges.\nHány lány nem szemüveges és már 18+',
            6,
            '12 lány, 4 szemüveges, 2 kiskorú nem szemüveges → 6'
        ),
        q(
            'er25o-18a',
            '2025/18.a) y = 7,67 · 1,27^x, x = évek 2007 óta. 2020-as görbeérték mínusz a grafikon 146 GW-ja. Különbség GW-ben, egy tizedesre.',
            25.5,
            'x=13 → y≈171,5; 171,5 − 146 = 25,5',
            { figure: expChart }
        ),
        q(
            'er25o-18b',
            '2025/18.b) A görbe szerint évente hány %-kal nőtt a kapacitás?',
            27,
            '1,27-szeres → 27%',
            { figure: expChart }
        ),
        q(
            'er25o-18c',
            '2025/18.c) A modell szerint melyik évben éri el a 3000 GW-ot?',
            2032,
            '7,67·1,27^x = 3000 → x≈24,97 → 2032',
            { figure: expChart }
        ),
        q(
            'er25o-18d',
            '2025/18.d) Lineáris: y = 7,7x − 5. 2016-os modellérték hány %-kal kisebb a grafikon 77 GW-jánál? Egy tizedesre.',
            16.5,
            'y=64,3; 64,3/77≈0,835 → 16,5%',
            { figure: linChart }
        ),
        q(
            'er25o-18e',
            '2025/18.e) Az (1; 7) és (9; 77) pontokra illeszkedő y = mx + b. Írd be m-et és b-t.',
            8.75,
            'y = 8,75x − 1,75',
            { alternativeAnswer: -1.75, figure: linChart }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H1',
        location: 'er2025OktKozepBank.ts:getErettsegi2025OktKozepQuestions',
        message: '2025 okt kozep bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            lastId: list[list.length - 1]?.id,
            a4: list.find((x) => x.id === 'er25o-4')?.answer,
            a6: list.find((x) => x.id === 'er25o-6')?.answer,
            a14d: list.find((x) => x.id === 'er25o-14d')?.answer,
            a18c: list.find((x) => x.id === 'er25o-18c')?.answer,
        },
        runId: 'er-2025-okt',
    });
    // #endregion

    return list;
}

export const ERETTSEGI_2025_OKT_KOZEP_COUNT = 38;
