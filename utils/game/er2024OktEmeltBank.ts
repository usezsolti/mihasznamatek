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

const FIG = '/figures/erettsegi/2024okt-emelt';

/** 2024. október 15. emelt (E2413) — válaszok a javítási útmutató szerint. II. B mind a 5 opcionális feladat. */
export function getErettsegi2024OktEmeltQuestions(): Question[] {
    const sector = imageFigure(`${FIG}/p14-1.jpeg`, '2024/6. OAB háromszög és körív');

    const list: Question[] = [
        q(
            'er24oe-1a',
            '2024/1.a) „Ha a>6 és b>8, akkor a és b számtani közepe > 7.” Igaz-e? igaz=1, hamis=0.',
            1,
            'igaz'
        ),
        q(
            'er24oe-1b',
            '2024/1.b) Az előző állítás megfordítása igaz-e? igaz=1, hamis=0.',
            0,
            'hamis (pl. a=5, b=11)'
        ),
        q(
            'er24oe-1c',
            '2024/1.c) A 7-nek és az x-nek (x>0) a harmonikus közepe 10. x = ?',
            17.5,
            'x = 17,5'
        ),
        q(
            'er24oe-2a',
            '2024/2.a) Kávé 75 °C, szoba 25 °C, c=−0,209. 15 perc múlva a hőmérséklet (°C, egy tizedes)?',
            30.7,
            '≈ 30,7 °C'
        ),
        q(
            'er24oe-2b',
            '2024/2.b) Ugyanez a kávé. Hány perc múlva 25,5 °C? (egészre kerekítve)',
            32,
            't ≈ 31,8 → 32 perc'
        ),
        q(
            'er24oe-2c',
            '2024/2.c) 85 °C-os kávé 10 perc alatt 40 °C-ra hűl, c=−0,209. Szoba hőmérséklete (°C, egy tizedes)?',
            26.2,
            'H ≈ 26,2 °C'
        ),
        q(
            'er24oe-3b',
            '2024/3.b) ∫ sin x dx a [π/6; 5π/6] szakaszon (az x-tengellyel közrezárt síkidom területe).',
            Math.sqrt(3),
            '√3 ≈ 1,73',
            { alternativeAnswer: 1.73 }
        ),
        q(
            'er24oe-4a',
            '2024/4.a) b=a+4, c=a+8, legnagyobb szög 120°. Oldalak (cm)?',
            6,
            '6 cm, 10 cm, 14 cm',
            { alternativeAnswer: 10, thirdAnswer: 14 }
        ),
        q(
            'er24oe-4b',
            '2024/4.b) Ugyanilyen háromszög, leghosszabb oldal 24 cm. Terület (cm², egy tizedes).',
            158.7,
            '≈ 158,7 cm² (másik számítás ≈ 158,4)',
            { alternativeAnswer: 158.4 }
        ),
        q(
            'er24oe-5a',
            '2024/5.a) Dobások: 1, 2, 2, 3, 3, 3. Átlag (két tizedes) és szórás (három tizedes)?',
            2.33,
            'átlag ≈ 2,33; szórás ≈ 0,745',
            { alternativeAnswer: 0.745 }
        ),
        q(
            'er24oe-5b',
            '2024/5.b) Hány különböző dobássorozat áll egy 1-esből, két 2-esből és három 3-asból?',
            60,
            '6 · 10 = 60'
        ),
        q(
            'er24oe-5c',
            '2024/5.c) Két szabályos kocka. P(szorzat osztható 2-vel, de 4-gyel nem)?',
            1 / 3,
            '12/36 = 1/3 ≈ 0,333',
            { alternativeAnswer: 0.333 }
        ),
        q(
            'er24oe-6a',
            '2024/6.a) OA=OB=12 cm, AOB=75°, r=8 cm körív. Szürke tartomány területe (cm²) és kerülete (cm), egy tizedes.',
            27.6,
            'T ≈ 27,6 cm²; K = 33,1 cm',
            { alternativeAnswer: 33.1, figure: sector }
        ),
        q(
            'er24oe-6b',
            '2024/6.b) Az OAB háromszöget az OA egyenese körül megforgatjuk. Forgástest térfogata (cm³, egészre)?',
            1691,
            '≈ 1691 cm³'
        ),
        q(
            'er24oe-6c',
            '2024/6.c) Négy tartomány, 3 szín, szomszédosak különbözőek. Hány színezés?',
            18,
            '18'
        ),
        q(
            'er24oe-7a',
            '2024/7.a) 36 szekrény, 3 üres. A: egy sorban; B: három különböző sorban. B-é a nagyobb valószínűség? igaz=1, hamis=0.',
            1,
            'P(B) ≈ 0,242 > P(A)',
            { alternativeAnswer: 0.242 }
        ),
        q(
            'er24oe-7b',
            '2024/7.b) Szekrény 20×35×30 cm. Leghosszabb egyenes pálca (cm, egészre)?',
            50,
            '≈ 50 cm'
        ),
        q(
            'er24oe-7c',
            '2024/7.c) 4 kulcs véletlen kiosztása. P(legalább két lány a sajátját kapja) ≈ ? (három tizedes)',
            0.292,
            '7/24 ≈ 0,292'
        ),
        q(
            'er24oe-8a',
            '2024/8.a) Zab ezermagtömege 35 g. Hány mag van 1 tonnában? (normálalak: 2,857·10⁷)',
            2.857e7,
            '2,857·10⁷'
        ),
        q(
            'er24oe-8b',
            '2024/8.b) 1000 kg zab 8 egyenlő részben, t(k)=k²/90+40 perc/adag. Hány óra?',
            64,
            '64 óra'
        ),
        q(
            'er24oe-8c',
            '2024/8.c) n egyenlő rész, minimális idő. n és a minimális idő (óra)?',
            17,
            'n = 17; ≈ 50 óra',
            { alternativeAnswer: 50 }
        ),
        q(
            'er24oe-9a',
            '2024/9.a) A megadott mértani sorozat. Legkisebb n, amelyre |aₙ| < 10⁻⁷?',
            25,
            'n = 25'
        ),
        q(
            'er24oe-9b',
            '2024/9.b) Az első 10 tag összege −k/m alakban (relatív prímek). Az érték?',
            -512 / 341,
            'S₁₀ = −512/341'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2024OktEmeltBank.ts:get',
        message: 'emelt 2024 okt bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2024_OKT_EMELT_COUNT = 23;
