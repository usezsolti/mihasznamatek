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

const FIG = '/figures/erettsegi/2025okt-emelt';

/** 2025. október 14. emelt (E2412) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2025OktEmeltQuestions(): Question[] {
    const graph = imageFigure(`${FIG}/p08-1.jpeg`, '2025/3. gráf A–F');
    const tiling = imageFigure(`${FIG}/p14-1.jpeg`, '2025/6. kalap-csempézés');
    const hat = imageFigure(`${FIG}/p14-2.jpeg`, '2025/6. kalap deltoidokból');

    const list: Question[] = [
        q(
            'er25oe-1a',
            '2025/1.a) Oldd meg: 9^{x+1} + 78·3^{x−1} − 3 = 0. x = ?',
            -2,
            '3^x = 1/9 → x=−2'
        ),
        q(
            'er25oe-1b',
            '2025/1.b) Mértani sorozat: b2=48, b5=162. bn > 10 000 000. n ≥ ?',
            33,
            'q=1,5; n≥33'
        ),
        q(
            'er25oe-2a',
            '2025/2.a) 917 jegy, 2 380 000 Ft. Elővétel 2500 Ft, helyszín 3000 Ft. Elővételes és helyszíni jegyek száma?',
            742,
            '742 elővétel, 175 helyszín',
            { alternativeAnswer: 175 }
        ),
        q(
            'er25oe-2b',
            '2025/2.b) 40 hajó, 5 nyerő. Petra 2-t húz visszatevés nélkül. P(pontosan az egyik nyerő)? (három tizedes)',
            0.224,
            'C(5,1)·C(35,1)/C(40,2)≈0,224'
        ),
        q(
            'er25oe-2c',
            '2025/2.c) Andrea, Bálint, Csilla; kettes vagy hármas holtverseny is lehet. Hányféle sorrend?',
            13,
            '6+6+1=13'
        ),
        q(
            'er25oe-3a',
            '2025/3.a) A gráfon A-ból F-be: minden élen és csúcson legfeljebb egyszer. Hány út?',
            13,
            '3+6+4=13 út',
            { figure: graph }
        ),
        q(
            'er25oe-3c',
            '2025/3.c) Megfordítás: ha a²+ab+b²−c²>0, akkor van a,b,c oldalú háromszög. Igaz-e? igaz=1, hamis=0.',
            0,
            'hamis (pl. a=2, b=1, c=1)'
        ),
        q(
            'er25oe-4a',
            '2025/4.a) A(−12; 21), B(6; −3). Az AB felezőmerőlegese hány fokos szöget zár be az y tengellyel? (egy tizedes)',
            53.1,
            'α≈36,9° (x tengely); pótszög ≈53,1°'
        ),
        q(
            'er25oe-4b',
            '2025/4.b) 26 sugarú kör a P(24; 6) ponton, középpontja az y tengelyen. A középpont y-koordinátái?',
            -4,
            'C1(0; −4) vagy C2(0; 16)',
            { alternativeAnswer: 16 }
        ),
        q(
            'er25oe-5a',
            '2025/5.a) Dobások: 4, 5, 4, 3, 1, 4. Átlag és szórás (szórás két tizedes)?',
            3.5,
            'átlag 3,5; szórás √(19/12)≈1,26',
            { alternativeAnswer: 1.26 }
        ),
        q(
            'er25oe-5b',
            '2025/5.b) 4 dobás → négyjegyű szám (1–6). Hány %-ában van legalább két egyforma számjegy? (egy tizedes)',
            72.2,
            '936/1296≈72,2%'
        ),
        q(
            'er25oe-5c',
            '2025/5.c) Legkisebb n, hogy n dobás között biztosan van legalább 3 egyforma érték.',
            13,
            '6·2+1=13'
        ),
        q(
            'er25oe-5d',
            '2025/5.d) Addig dobunk, amíg lesz 2 egyforma. A dobások számának várható értéke (három tizedes)?',
            3.775,
            '1223/324≈3,775'
        ),
        q(
            'er25oe-6b',
            '2025/6.b) Kalap területe 1728. Kerület (18+8√3 alak, számként)?',
            18 + 8 * Math.sqrt(3),
            '18+8√3 ≈ 31,86',
            { figures: [tiling, hat] }
        ),
        q(
            'er25oe-6c',
            '2025/6.c) 8 deltoid, 3 szín, szomszédosak különbözőek. Hány színezés?',
            144,
            '6·8·3=144',
            { figures: [tiling, hat] }
        ),
        q(
            'er25oe-7a',
            '2025/7.a) 10 km, v=12 km/h. Üzemanyag 1,2v dukát/km, rezsi 90 dukát/óra. Üzemeltetési költség (dukát)?',
            219,
            '144+75=219'
        ),
        q(
            'er25oe-7b',
            '2025/7.b) Ugyanaz a 10 km. Minimális költséghez tartozó sebesség (km/h, két tizedes) és a minimális költség (dukát, egészre)?',
            8.66,
            'v=√75≈8,66 km/h; kb. 208 dukát',
            { alternativeAnswer: 208 }
        ),
        q(
            'er25oe-7c',
            '2025/7.c) Oda 50 fő, átlag 1650 Ft; vissza 70 fő, átlag 1500 Ft. Két út együttes jegyenkénti átlaga (Ft)?',
            1562.5,
            '187500/120=1562,5'
        ),
        q(
            'er25oe-8a',
            '2025/8.a) Másodfokú f, zérushelyek −3 és 4, f(0)=6. y=ax²+bx+c alakban a, b, c?',
            -0.5,
            'y=−0,5x²+0,5x+6',
            { alternativeAnswer: 0.5, thirdAnswer: 6 }
        ),
        q(
            'er25oe-8b',
            '2025/8.b) g(x)=0,5x²−2x−6. Érintő x=4-ben: meredekség és y-tengelymetszet?',
            2,
            'y=2x−14',
            { alternativeAnswer: -14 }
        ),
        q(
            'er25oe-8c',
            '2025/8.c) y=−2x+2 és y=0,5x²−2x−6 közti korlátos síkidom területe?',
            128 / 3,
            '128/3≈42,67'
        ),
        q(
            'er25oe-9a',
            '2025/9.a) TAJ: páratlan helyek ×3, párosok ×7, az összeg utolsó jegye a 9. jegy. 24165379_ ellenőrző számjegye?',
            9,
            '199 → 9'
        ),
        q(
            'er25oe-9b',
            '2025/9.b) Letakart első jegy: _14564797. A letakart számjegy?',
            1,
            'x=1'
        ),
        q(
            'er25oe-9c',
            '2025/9.c) TAJ 02563abba alakú. Az ellenőrző számjegy (a) lehetséges értékei?',
            0,
            'a=0 vagy a=5',
            { alternativeAnswer: 5 }
        ),
        q(
            'er25oe-9d',
            '2025/9.d) 20 TAJ, egyenként 0,015 a hibás. P(egynél több hibás)? (három tizedes)',
            0.036,
            '1−0,739−0,225≈0,036'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2025OktEmeltBank.ts:get',
        message: 'emelt 2025 okt bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2025_OKT_EMELT_COUNT = 25;
