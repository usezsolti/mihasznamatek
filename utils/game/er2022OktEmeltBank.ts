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

const FIG = '/figures/erettsegi/2022okt-emelt';

/** 2022. október 18. emelt (2212) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2022OktEmeltQuestions(): Question[] {
    const pie = imageFigure(`${FIG}/p08-1.jpeg`, '2022/3. töltők élettartama');
    const color = imageFigure(`${FIG}/p12-1.jpeg`, '2022/5. téglalap tartományok');
    const trough = [
        imageFigure(`${FIG}/p14-1.jpeg`, '2022/6. legelő / vályú'),
        imageFigure(`${FIG}/p14-2.jpeg`, '2022/6. vályú'),
        imageFigure(`${FIG}/p14-3.jpeg`, '2022/6. vízfelszín'),
    ];
    const rects = imageFigure(`${FIG}/p16-3.jpeg`, '2022/7.c) beírt téglalapok');

    const list: Question[] = [
        q(
            'er22oe-1c',
            '2022/1.c) C(−6; −2), P(−3; 2). A CP egyenes és a tengelyek derékszögű háromszögének körülírt köre, sugár.',
            3.75,
            'átfogó 7,5; R = 3,75'
        ),
        q(
            'er22oe-2b',
            '2022/2.b) log₃(x+8)+log₃(x−2)−log₃(x+4)=1 a valósokon. x = ?',
            4,
            'x = 4 (x = −7 nem megoldás)'
        ),
        q(
            'er22oe-3a',
            '2022/3.a) 24 töltő élettartama a kördiagram szerint. Átlag és szórás (hónap).',
            51.5,
            'átlag 51,5; szórás √2 ≈ 1,41',
            { alternativeAnswer: 1.41, figure: pie }
        ),
        q(
            'er22oe-3b',
            '2022/3.b) P(egy töltő legalább 50 hónap) = 0,9. 20 darab közül P(legfeljebb 2 rövidebb) (három tizedes).',
            0.677,
            'P(0)+P(1)+P(2) ≈ 0,677'
        ),
        q(
            'er22oe-3c',
            '2022/3.c) P(öt töltő mindegyike < 55 hónap) = 0,75. P(egy töltő ≥ 55 hónap) (három tizedes).',
            0.056,
            '1 − 0,75^(1/5) ≈ 0,056'
        ),
        q(
            'er22oe-4b',
            '2022/4.b) f(x)=sin x és g(x)=(2x/π)², x∈[0; π/2]. A grafikonok közbezárta terület (három tizedes).',
            0.476,
            '≈ 0,476'
        ),
        q(
            'er22oe-4c',
            '2022/4.c) a_n = 2/n² + 2π (n∈N⁺). A sorozat határértéke (két tizedes, vagy 2π).',
            6.28,
            '2π',
            { alternativeAnswer: 2 * Math.PI }
        ),
        q(
            'er22oe-5a',
            '2022/5.a) Téglalap 6 tartománya, 4 szín, szomszédosak különbözőek. Hány színezés, ha A és C színe különböző?',
            144,
            '4·3·2·(8−2) = 144',
            { figure: color }
        ),
        q(
            'er22oe-5b',
            '2022/5.b) A=6, D=8; B számtani közép A,C; F mértani közép D,E; F=B+1; E=C+2. B lehetséges értékei.',
            3,
            'B = 3 vagy B = 11',
            { alternativeAnswer: 11 }
        ),
        q(
            'er22oe-6a',
            '2022/6.a) Konvex négyszög: AB=126, BC=65, CD=80, ABC=122,5°, ADC=90°. Hirdetett 0,9 ha. Hány %-kal nagyobb a valódi?',
            5,
            '9454 m² = 0,9454 ha; 0,9454:0,9 ≈ 1,05 → 5%',
            { figures: trough }
        ),
        q(
            'er22oe-6c',
            '2022/6.c) Vályú visszafektetve, benne 15 l víz. A víz magassága (cm, egészre).',
            19,
            '≈ 19 cm',
            { figures: trough }
        ),
        q(
            'er22oe-7b',
            '2022/7.b) Ötpontú gráf: él pontosan akkor, ha a két szám összege racionális. Hány él?',
            4,
            '4 él'
        ),
        q(
            'er22oe-7c',
            '2022/7.c) g(x)=3^(−x) (x≥0), egységnyi téglalapok. n max, hogy g(n)−g(n+1)>10^(−6). Az első n téglalap területösszege.',
            0.5,
            'n=12; S12 ≈ 0,5',
            { figure: rects }
        ),
        q(
            'er22oe-8a',
            '2022/8.a) Téglatest élei 4 dm és 2 dm, V=72 dm³. Felszín (dm²).',
            124,
            'harmadik él 9 dm; A = 124'
        ),
        q(
            'er22oe-8b',
            '2022/8.b) V=72 dm³, egyik él a másik kétszerese. Minimális felszínű téglatest élei (dm).',
            3,
            '3 dm, 6 dm, 4 dm',
            { alternativeAnswer: 6, thirdAnswer: 4 }
        ),
        q(
            'er22oe-8c',
            '2022/8.c) Téglatest 8 csúcsából 3 úgy, hogy a sík ne tartalmazzon további csúcsot. Hányféle?',
            8,
            '2·2·2 = 8'
        ),
        q(
            'er22oe-9a',
            '2022/9.a) 5 kék+3 zöld = 6700 Ft, 3 kék+2 zöld = 4200 Ft. Egy kék, illetve egy zöld sorsjegy (Ft).',
            800,
            'kék 800 Ft, zöld 900 Ft',
            { alternativeAnswer: 900 }
        ),
        q(
            'er22oe-9b',
            '2022/9.b) P(A)=0,38. P(B|A) (három tizedes). Függetlenek-e A és B? igen=1, nem=0.',
            0.368,
            'P(B|A)=7/19 ≈ 0,368; nem függetlenek',
            { alternativeAnswer: 0 }
        ),
        q(
            'er22oe-9c',
            '2022/9.c) Egy kék sorsjegy nyereményének várható értéke (Ft), tárgynyeremény = 500 Ft.',
            625,
            '0,35·500 + 0,2·1000 + 0,05·5000 = 625'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2022OktEmeltBank.ts:get',
        message: 'emelt 2022 okt bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2022_OKT_EMELT_COUNT = 19;
