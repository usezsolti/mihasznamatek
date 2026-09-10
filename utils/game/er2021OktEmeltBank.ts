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

const FIG = '/figures/erettsegi/2021okt-emelt';

/** 2021. október 19. emelt (2113) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2021OktEmeltQuestions(): Question[] {
    const card = imageFigure(`${FIG}/p10-1.jpeg`, '2021/4. ötszög belépőkártya');
    const dist = imageFigure(`${FIG}/p16-1.jpeg`, '2021/7. függőleges távolságok');
    const cube = imageFigure(`${FIG}/p18-1.jpeg`, '2021/8. ABCDEFGH kocka');

    const list: Question[] = [
        q(
            'er21oe-1a',
            '2021/1.a) Exponenciális egyenlet 2^x-ben másodfokú. A valós megoldás x = ?',
            3,
            'x = 3'
        ),
        q(
            'er21oe-1b',
            '2021/1.b) f(x)=x²−9x+14. „Ha x>7, akkor f(x)>0.” Igaz=1, hamis=0.',
            1,
            'igaz (felfelé nyitott parabola, zérushelyek 2 és 7)'
        ),
        q(
            'er21oe-1c',
            '2021/1.c) Az állítás megfordítása igaz-e? igaz=1, hamis=0.',
            0,
            'hamis (pl. x=0: f(x)=14>0, de x≤7)'
        ),
        q(
            'er21oe-2a',
            '2021/2.a) 45 l benzin, 200 km város, 10 l/100 km. Hátralévő távolság (km).',
            250,
            '25/10 · 100 = 250'
        ),
        q(
            'er21oe-2b',
            '2021/2.b) +100 km vidék, utána 200 km a hátralévő. A kirándulás átlagfogyasztása (l/100 km).',
            7,
            '7 liter / 100 km'
        ),
        q(
            'er21oe-3a',
            '2021/3.a) Hány pozitív háromjegyű szám osztható 8-cal vagy 9-cel?',
            200,
            '112 + 100 − 12 = 200'
        ),
        q(
            'er21oe-3b',
            '2021/3.b) 8-asban háromjegyű szám. P(9-esben is háromjegyű) (három tizedes).',
            0.962,
            '431/448 ≈ 0,962'
        ),
        q(
            'er21oe-4a',
            '2021/4.a) PQRST konvex ötszög oldalai+átlói vastagíthatók. 400 résztvevő. Jut-e mindenkinek különböző kártya? igen=1, nem=0.',
            1,
            '2^10 = 1024 > 400',
            { figure: card }
        ),
        q(
            'er21oe-4b',
            '2021/4.b) AB=AC=130 m, BC=100 m, T_BCD=2000 m², D∈AB. CD hossza (m, egy tizedes).',
            92.4,
            '≈ 92,4 m',
            { figure: card }
        ),
        q(
            'er21oe-4c',
            '2021/4.c) 200 magyar, 70 angol (átlag 44), 130 német (48), összes átlag 45,7. Magyar átlag (év).',
            44.8,
            'x = 44,8'
        ),
        q(
            'er21oe-5a',
            '2021/5.a) a_n = C(n+1; 2). Az első öt tag átlaga és szórása (két tizedes).',
            7,
            'átlag 7; szórás √25,2 ≈ 5,02',
            { alternativeAnswer: 5.02 }
        ),
        q(
            'er21oe-5b',
            '2021/5.b) b_n = a_{n+1}/a_n. lim b_n = ?',
            1,
            '(n+2)/n → 1'
        ),
        q(
            'er21oe-5c',
            '2021/5.c) Számtani sorozat d=0,25; Sn=100, S_{2n}=300. n = ?',
            20,
            'n² = 400 → n = 20'
        ),
        q(
            'er21oe-6a',
            '2021/6.a) Egyenlő szárú háromszög alapja 18 cm. A szár nagyobb, mint hány cm, ha az egyiptomi közelítés hibája < 25%?',
            15,
            'b > 15 cm'
        ),
        q(
            'er21oe-6b',
            '2021/6.b) Hány 1000-nél kisebb pozitív egészre 1·2·3·4·5·6·m négyzetszám?',
            14,
            'm < 200/√2 ≈ 14,1 → 14 szám'
        ),
        q(
            'er21oe-7a',
            '2021/7.a) R(4;2) és S(4;5) függőleges távolsága az y = x/3 + 5/3 egyenestől.',
            1,
            'R: 1; S: 2',
            { alternativeAnswer: 2, figure: dist }
        ),
        q(
            'er21oe-7b',
            '2021/7.b) A(1;3), B(3;5), C(4;4). y=mx legjobban illeszkedő (négyzetösszeg min.). m = ?',
            1.3077,
            'm = 68/52 = 17/13',
            { alternativeAnswer: 17 / 13 }
        ),
        q(
            'er21oe-7c',
            '2021/7.c) g: y=(1/3)(x²−2x+11), h: origó és C. A közbezárt korlátos alakzat területe.',
            8.44,
            '76/9 ≈ 8,44',
            { alternativeAnswer: 76 / 9 }
        ),
        q(
            'er21oe-8b',
            '2021/8.b) 8-féle kocka, 7 megvan. 3 vásárlás. P(meglesz a hiányzó) (három tizedes).',
            0.33,
            '≈ 0,002+0,041+0,287 = 0,330',
            { figure: cube }
        ),
        q(
            'er21oe-8c',
            '2021/8.c) Kocka él 10. Az ABG háromszög beírt körének sugara (két tizedes).',
            3.41,
            '≈ 3,41',
            { figure: cube }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2021OktEmeltBank.ts:get',
        message: 'emelt 2021 okt bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2021_OKT_EMELT_COUNT = 20;
