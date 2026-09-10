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

const FIG = '/figures/erettsegi/2024okt-kozep';

/** 2024. október 15. középszint (K2413) — válaszok a javítási útmutató szerint. */
export function getErettsegi2024OktKozepQuestions(): Question[] {
    const graphs = [
        imageFigure(`${FIG}/p04-1.png`, '2024/5. A grafikon'),
        imageFigure(`${FIG}/p04-2.png`, '2024/5. B grafikon'),
        imageFigure(`${FIG}/p04-3.png`, '2024/5. C grafikon'),
        imageFigure(`${FIG}/p04-4.png`, '2024/5. D grafikon'),
    ];
    const tri = imageFigure(`${FIG}/p05-1.jpeg`, '2024/7. derékszögű háromszög');
    const para = imageFigure(`${FIG}/p16-1.png`, '2024/15. ABCD paralelogramma');
    const ball = imageFigure(`${FIG}/p20-1.jpeg`, '2024/17. labdaméretek');
    const storm = imageFigure(`${FIG}/p22-1.jpeg`, '2024/18. Balaton / Badacsony');

    const list: Question[] = [
        q(
            'er24o-1i',
            '2024/1. A = {1; 2; 3; 4}, B = {1; 2; 4; 8}. Sorold fel A ∩ B elemeit.',
            0,
            '{1; 2; 4}',
            { expectedSet: ['1', '2', '4'] }
        ),
        q(
            'er24o-1u',
            '2024/1. Ugyanazok a halmazok. Sorold fel A ∪ B elemeit.',
            0,
            '{1; 2; 3; 4; 8}',
            { expectedSet: ['1', '2', '3', '4', '8'] }
        ),
        q(
            'er24o-1d',
            '2024/1. Ugyanazok a halmazok. Sorold fel A \\ B elemeit.',
            0,
            '{3}',
            { expectedSet: ['3'] }
        ),
        q(
            'er24o-3',
            '2024/3. 30 vevő: 22 fehér, 17 rozskenyeret vett, mindenki legalább az egyiket. Hányan vettek mindkettőt?',
            9,
            '22 + 17 − 30 = 9'
        ),
        q(
            'er24o-4',
            '2024/4. Számtani sorozat: a1 = 6, a7 = 36. a4 = ?',
            21,
            'd = 5; a4 = 21'
        ),
        q(
            'er24o-5',
            '2024/5. Válaszd ki a valósokon értelmezett f függvény grafikonját az A–D ábrák közül.\nA=1, B=2, C=3, D=4.',
            4,
            'D — javítási útmutató',
            { figures: graphs }
        ),
        q(
            'er24o-6',
            '2024/6. Hány átlója van egy konvex nyolcszögnek?',
            20,
            '8·5/2 = 20'
        ),
        q(
            'er24o-7',
            '2024/7. Derékszögű háromszög befogói 5 cm és 6 cm. Az 5 cm-es befogóhoz tartozó súlyvonal (cm, egy tizedesre).',
            6.5,
            'm_a = (1/2) sqrt(2b²+2c²−a²) = 6,5',
            { figure: tri }
        ),
        q(
            'er24o-8',
            '2024/8. Hány különböző, 4-gyel osztható négyjegyű szám készíthető a 2, 3, 4, 5 jegyekből (mindegyik egyszer)?',
            6,
            'utolsó jegy 2 vagy 4 → 6 szám'
        ),
        q(
            'er24o-9',
            '2024/9. Bélának 4-szer annyi pontja van, mint Andrásnak, együtt 6500. Bélának hány pontja van?',
            5200,
            '4x + x = 6500 → Béla 5200'
        ),
        q(
            'er24o-10',
            '2024/10. Anna jegyei: két 5-ös, négy 4-es, két 3-as. Szórás (három tizedesre, ≈0,707).',
            0.707,
            'szórás ≈ 0,707'
        ),
        q(
            'er24o-11',
            '2024/11. Mértani sorozat: a8 = 10^{20}, a9 = 10^{23}. Írd be a hányadost és az első tagot.',
            1000,
            'q = 1000, a1 = 0,1',
            { alternativeAnswer: 0.1 }
        ),
        q(
            'er24o-12',
            '2024/12. Két kocka. P(az összeg négyzetszám)? (7/36 ≈ 0,194)',
            7 / 36,
            '7/36 ≈ 0,194'
        ),
        q(
            'er24o-13a',
            '2024/13.a) (x+3)/4 + (x+1)/5 = −x/2. x = ?',
            -1,
            '9x + 19 = −10x → x = −1'
        ),
        q(
            'er24o-13b',
            '2024/13.b) b(p) = 6 · 1,015^p (ezer db, p perc). 60 perc után hány ezer baktérium (egy tizedesre)?',
            14.7,
            '6 · 1,015^{60} ≈ 14,7'
        ),
        q(
            'er24o-13c',
            '2024/13.c) A képlet szerint hányadik órában éri el a 600 ezret?',
            6,
            'p ≈ 309 perc → 6. óra'
        ),
        q(
            'er24o-14a',
            '2024/14.a) f(x) = (x−3)² − 4. f(2,5) = ?',
            -3.75,
            '(−0,5)² − 4 = −3,75'
        ),
        q(
            'er24o-14b',
            '2024/14.b) Az f függvény zérushelyei.',
            1,
            'x = 1 vagy x = 5',
            { alternativeAnswer: 5 }
        ),
        q(
            'er24o-14c',
            '2024/14.c) P(2; −3) és Q(6; 5) távolsága (két tizedesre).',
            8.94,
            'sqrt(4²+8²) ≈ 8,94'
        ),
        q(
            'er24o-14d',
            '2024/14.d) A P és Q pontokra illeszkedő egyenes meredeksége és y-tengelymetszete (y = mx+b).',
            2,
            'y = 2x − 7',
            { alternativeAnswer: -7 }
        ),
        q(
            'er24o-15a',
            '2024/15.a) Paralelogramma: AB=6 cm, AD=5 cm, ∠A=70°. Terület (cm², egy tizedesre).',
            28.2,
            '6·5·sin70° ≈ 28,2',
            { figure: para }
        ),
        q(
            'er24o-15b',
            '2024/15.b) A BD átlóval keletkező β és γ szögek (fok, egy tizedesre).',
            47.6,
            'β ≈ 47,6°, γ ≈ 62,4°',
            { alternativeAnswer: 62.4, figure: para }
        ),
        q(
            'er24o-15c',
            '2024/15.c) „Ha egy négyszög tengelyesen szimmetrikus, akkor középpontosan is az.” Igaz=1, hamis=0.',
            0,
            'Hamis (pl. húrtrapéz).',
            { figure: para }
        ),
        q(
            'er24o-15d',
            '2024/15.d) Az állítás megfordítása igaz-e? Igaz=1, hamis=0.',
            0,
            'Hamis (pl. nem rombusz paralelogramma).',
            { figure: para }
        ),
        q(
            'er24o-16a',
            '2024/16.a) 4 kg kristály + 1 kg barna = 2600 Ft; 3 kg kristály + 2 kg barna = 3275 Ft. 1 kg kristály és 1 kg barna (Ft).',
            385,
            'kristály 385 Ft/kg, barna 1060 Ft/kg',
            { alternativeAnswer: 1060 }
        ),
        q(
            'er24o-16b',
            '2024/16.b) 5 uncia cukor, 1 kg ≈ 35,3 uncia. Hány gramm (tíz grammra kerekítve)?',
            140,
            '5000/35,3 ≈ 142 → 140 g'
        ),
        q(
            'er24o-16c',
            '2024/16.c) 72 lekváros + 96 csokis linzer, egyforma csomagok. Legfeljebb hány csomag?',
            24,
            'lnko(72; 96) = 24'
        ),
        q(
            'er24o-16d',
            '2024/16.d) 10 lekváros + 15 csokis, 5-öt veszünk. P(pontosan 2 lekváros) ≈ ?',
            0.385,
            'C(10,2)·C(15,3)/C(25,5) ≈ 0,385'
        ),
        q(
            'er24o-17a',
            '2024/17.a) Labdaátmérők 18 cm és 21,5 cm. Hány %-kal nagyobb az 5-ös térfogata a 3-asnál (egészre)?',
            70,
            '(21,5/18)³ − 1 ≈ 70%',
            { figure: ball }
        ),
        q(
            'er24o-17b',
            '2024/17.b) Csoport: 7, 5, 4, 0 pont (mindenki mindenkivel). Hány döntetlen?',
            2,
            'összpont 16; 6 meccs → 2 döntetlen',
            { figure: ball }
        ),
        q(
            'er24o-17c',
            '2024/17.c) 32 csapat pontszámának átlaga (négy tizedesre is elfogadható: 4,1875).',
            4.1875,
            '(0·2+1·3+3·4+4·10+5·2+6·8+7·3)/32 = 4,1875',
            { figure: ball }
        ),
        q(
            'er24o-17d1',
            '2024/17.d) Ugyanazok a pontszámok. Add meg a minimumot és a maximumot.',
            0,
            'min 0, max 7',
            { alternativeAnswer: 7, figure: ball }
        ),
        q(
            'er24o-17d2',
            '2024/17.d) Ugyanazok a pontszámok. Add meg Q1-et, a mediánt és Q3-at.',
            3,
            'Q1=3, medián=4, Q3=6',
            { alternativeAnswer: 4, thirdAnswer: 6, figure: ball }
        ),
        q(
            'er24o-18a',
            '2024/18.a) 12 s alatt 9 felvillanás. Fokozat: alap=0, elsőfok=1, másodfok=2.',
            1,
            '45 villanás/perc → elsőfok',
            { figure: storm }
        ),
        q(
            'er24o-18b',
            '2024/18.b) 3 medence, 3 fokozat, szomszédosak legfeljebb 1 fokozattal térnek el. Hány kiosztás?',
            17,
            '17 megfelelő hármas',
            { figure: storm }
        ),
        q(
            'er24o-18c',
            '2024/18.c) Csonkakúp: alapkerület 11 km, fedősugár 0,6 km, magasság 330 m. V > 1,5 km³? Igaz=1, hamis=0.',
            1,
            'Igaz: V ≈ 1,55 km³',
            { figure: storm }
        ),
        q(
            'er24o-18d',
            '2024/18.d) Évi 5% növekedés, S10 = 1000 hl. a1 és a10 (egy tizedesre).',
            79.5,
            'a1 ≈ 79,5 hl, a10 ≈ 123,3 hl',
            { alternativeAnswer: 123.3, figure: storm }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'er2024OktKozepBank.ts',
        message: '2024 okt kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-batch-2325',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2024_OKT_KOZEP_COUNT = 37;
