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

const FIG = '/figures/erettsegi/2021maj-emelt';

/** 2021. május 4. emelt (2112) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2021MajEmeltQuestions(): Question[] {
    const trap = imageFigure(`${FIG}/p10-1.jpeg`, '2021/4. görbe és trapéz');
    const inv = imageFigure(`${FIG}/p16-1.jpeg`, '2021/7.c) f grafikonja');
    const logs = imageFigure(`${FIG}/p20-1.jpeg`, '2021/9. farönkök a raktérben');

    const list: Question[] = [
        q(
            'er21me-1a',
            '2021/1.a) Gyökös egyenlet, ÉT: −1 ≤ x ≤ 3. A valós megoldás x = ?',
            1,
            'négyzetre emelve x²+4x−5=0; x=1 megoldás, x=−5 nem'
        ),
        q(
            'er21me-1b',
            '2021/1.b) Logaritmusos egyenlet 4-es alapon (x>0). A megoldás x = ?',
            8,
            'x = 8'
        ),
        q(
            'er21me-2a',
            '2021/2.a) ABCD: AB=50 m, BC=60 m, CD=70 m, BAD=BCD=100,3°. Terület (m², egészre).',
            3987,
            '2066 + 1921 = 3987'
        ),
        q(
            'er21me-2b',
            '2021/2.b) Az átlók 4 háromszöge, 4 szín, szomszédosak különbözőek, pontosan 3 szín. Hány színezés?',
            48,
            '4·2·3·2 = 48'
        ),
        q(
            'er21me-3a',
            '2021/3.a) 6600 és 4800 Ft-os részvények, összeg 131 400 Ft. Csere után 140 400 Ft. Darabszámok.',
            9,
            '9 db 6600 Ft-os és 15 db 4800 Ft-os',
            { alternativeAnswer: 15 }
        ),
        q(
            'er21me-3b',
            '2021/3.b) 500 000 Ft havi 1%, 450 000 Ft havi 1,3%. Hányadik hónap végén lesz először több a második?',
            36,
            '≈ 35,5 → a 36. hónap végén'
        ),
        q(
            'er21me-4b',
            '2021/4.b) y=0,25x(5−x) (0≤x≤5) és trapéz. P(a véletlen pont a trapézban is) (három tizedes).',
            0.538,
            '7 / 13,02 ≈ 0,538 (pontosan 48/625 = 0,5376)',
            { alternativeAnswer: 0.5376, figure: trap }
        ),
        q(
            'er21me-5c',
            '2021/5.c) A, B, C egymástól függetlenül 0,6 valószínűséggel igaz. P((A∧B)∨C igaz).',
            0.744,
            '0,216+0,144+0,384 = 0,744'
        ),
        q(
            'er21me-6a',
            '2021/6.a) A-nak 5, B-nek 4, C-nek 3 ismerőse. Hányféle lehet a D,E,F ismeretségi hálója?',
            8,
            '2³ = 8'
        ),
        q(
            'er21me-6b',
            '2021/6.b) D,E,F mind ismerik egymást. Hányféle a hattagú társaság ismeretségi hálója?',
            12,
            '3 + 3·3 = 12'
        ),
        q(
            'er21me-6c',
            '2021/6.c) 3 fős kihallgatások, A és B nincs együtt. Hány csoport?',
            16,
            'C(6;3) − C(4;1) = 20 − 4 = 16'
        ),
        q(
            'er21me-7a',
            '2021/7.a) Sikeres dobások: 6,3,7,6,4,7,8,7. Átlag, medián, szórás (két tizedes).',
            6,
            'átlag 6; medián 6,5; szórás ≈ 1,58',
            { alternativeAnswer: 6.5, thirdAnswer: 1.58 }
        ),
        q(
            'er21me-7c',
            '2021/7.c) f: [−2;3]→R szigorúan monoton folytonos. Az inverz zérushelye? (értelmezési tartomány végei: −2 és 5)',
            1,
            'zérushely 1; Df⁻¹=[−2;5], Rf⁻¹=[−2;3]',
            { alternativeAnswer: -2, thirdAnswer: 5, figure: inv }
        ),
        q(
            'er21me-8a',
            '2021/8.a) 5000 db sorsjegy 500 Ft. Ár 300 Ft-ra csökken. Havi bevétel (Ft).',
            2700000,
            '9000 · 300 = 2 700 000'
        ),
        q(
            'er21me-8b',
            '2021/8.b) n-szer 10 Ft-os árcsökkentés, +10n² eladott db. Melyik n-re max a havi bevétel?',
            27,
            'n = 27 (230 Ft-os ár)'
        ),
        q(
            'er21me-8c',
            '2021/8.c) 5% nyerő, 2500 Ft-osból 24-szer annyi, mint 50 000 Ft-osból. Egy sorsjegy nyereményének várható értéke (Ft).',
            220,
            '0,048·2500 + 0,002·50 000 = 220'
        ),
        q(
            'er21me-9b',
            '2021/9.b) 86 farönk a raktérben. A raktér hány %-a marad üresen?',
            19,
            '1 − 0,81 = 19%',
            { figure: logs }
        ),
        q(
            'er21me-9c',
            '2021/9.c) 50 fa, P(szú)=0,04. P(legfeljebb egy szúrágta) (három tizedes).',
            0.401,
            '0,130 + 0,271 = 0,401',
            { figure: logs }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2021MajEmeltBank.ts:get',
        message: 'emelt 2021 maj bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2021_MAJ_EMELT_COUNT = 18;
