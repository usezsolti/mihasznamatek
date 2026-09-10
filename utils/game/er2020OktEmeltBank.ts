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

const FIG = '/figures/erettsegi/2020okt-emelt';

/** 2020. október 20. emelt (2013) — válaszok a javítási útmutató szerint. II. B mind az 5 opcionális feladat. */
export function getErettsegi2020OktEmeltQuestions(): Question[] {
    const box = imageFigure(`${FIG}/p10-1.jpeg`, '2020/4. pingponglabda-doboz');
    const roof = imageFigure(`${FIG}/p16-1.jpeg`, '2020/7. háztető');
    const tri = [
        imageFigure(`${FIG}/p20-1.jpeg`, '2020/9. szabályos háromszög osztópontok'),
        imageFigure(`${FIG}/p20-2.jpeg`, '2020/9. XYZ háromszög'),
    ];

    const list: Question[] = [
        q(
            'er20oe-1a',
            '2020/1.a) f(x)=900−0,25(x−60)², x∈]0;130]. Az f zérushelye?',
            120,
            'x = 120 (x = 0 nem ÉT)'
        ),
        q(
            'er20oe-1b',
            '2020/1.b) g(x)=6,4x. f(20)−g(20) = ?',
            372,
            '500 − 128 = 372'
        ),
        q(
            'er20oe-1c',
            '2020/1.c) h=f−g a ]0;130]-on. Maximumhely és maximumérték.',
            47.2,
            'hely 47,2; érték 556,96 (minimum nincs)',
            { alternativeAnswer: 556.96 }
        ),
        q(
            'er20oe-2a',
            '2020/2.a) 30 fős csoport, átlag 28 év; 5 legidősebb átlaga 40, a többieké 25,6. 1,5-szer annyi nő, mint férfi. Férfiak és nők száma.',
            12,
            '12 férfi, 18 nő',
            { alternativeAnswer: 18 }
        ),
        q(
            'er20oe-2b',
            '2020/2.b) 6 fűszer, 3 vagy 4-féle, édes és keserű nem egyszerre. Hány ízesítés?',
            25,
            '35 − 10 = 25'
        ),
        q(
            'er20oe-3a',
            '2020/3.a) 6 doboz. Minden dobozba 1 érme → m marad; minden dobozba m érme → m doboz üres. Érmék száma? (két lehetőség)',
            8,
            'e = 8 (m=2) vagy e = 9 (m=3)',
            { alternativeAnswer: 9 }
        ),
        q(
            'er20oe-3b',
            '2020/3.b) 3% hibás, 80 érme (binomiális). P(legfeljebb 2 hibás) (három tizedes).',
            0.567,
            '0,087+0,216+0,264 = 0,567'
        ),
        q(
            'er20oe-4a',
            '2020/4.a) 1 m-ről ejtett labda, 84%-os pattanás. Út az 1. asztalra érkezéstől a 15.-ig (m, két tizedes).',
            9.59,
            '≈ 9,59 m'
        ),
        q(
            'er20oe-4c',
            '2020/4.c) Három 40 mm-es labda a hengeres dobozban. A labdák a doboz térfogatának hány %-a?',
            58,
            '≈ 58%',
            { figure: box }
        ),
        q(
            'er20oe-5a',
            '2020/5.a) f(x)=(x+4)(2−x), g(x)=x+4. A grafikonok közrezárta korlátos síkidom területe.',
            20.833,
            '125/6',
            { alternativeAnswer: 125 / 6 }
        ),
        q(
            'er20oe-5c',
            '2020/5.c) k, m, n zérushelyei adottak, p(x)=x+c. Hány c-re lesz a 4 pontú gráf fa?',
            2,
            'c = −3 vagy c = 5, kétféle'
        ),
        q(
            'er20oe-6a',
            '2020/6.a) L=1,5 millió, B0=1000. 5 nap múlva hány fertőzött (egészre, ezerre kerekítve is)?',
            4200,
            '≈ 4204,98 → kb. 4200'
        ),
        q(
            'er20oe-6b',
            '2020/6.b) Hány nap múlva lesz a lakosság 10%-a fertőzött? (egész nap)',
            18,
            '≈ 17,78 → kb. 18 nap'
        ),
        q(
            'er20oe-7a',
            '2020/7.a) 7×4 m tető, 15 mm eső, 95% a 4 hordóba (∅ 40 cm). Vízmagasság a hordóban (cm).',
            79,
            '≈ 0,79 m = 79 cm',
            { figure: roof }
        ),
        q(
            'er20oe-7b',
            '2020/7.b) Tető: 30°-os húrtrapézok + egyenlő szárú háromszögek, 30 cserép/m², 8% hulladék. Hány cserép?',
            1055,
            '970 / 0,92 ≈ 1055',
            { figure: roof }
        ),
        q(
            'er20oe-8a',
            '2020/8.a) Háromjegyűek; A: van 1-es, B: van 2-es, C: van 3-as. |A \\ (B ∩ C)| = ?',
            246,
            '252 − 6 = 246'
        ),
        q(
            'er20oe-8b',
            '2020/8.b) Kocka: 3×hármas, 2×kettes, 1×egyes. Két kocka, P(összeg=4) (három tizedes).',
            0.278,
            '5/18 ≈ 0,278'
        ),
        q(
            'er20oe-8c',
            '2020/8.c) Igazságos játék. Béla Andinak az 1-es dobásakor ennyit fizet (Ft).',
            120,
            'n=200; 200−80 = 120'
        ),
        q(
            'er20oe-9a',
            '2020/9.a) Szabályos háromszög oldalait 3-3 osztópont. Hány négyszög, melynek mindhárom oldalon van csúcsa?',
            81,
            '3·3·3·3 = 81',
            { figures: tri }
        ),
        q(
            'er20oe-9b',
            '2020/9.b) 4 egység oldalú szabályos háromszög, XYZ a Ceva-metszéspontok. T_XYZ (két tizedes).',
            2.13,
            '≈ 2,13',
            { figures: tri }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H50',
        location: 'er2020OktEmeltBank.ts:get',
        message: 'emelt 2020 okt bank loaded',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-emelt-batch',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2020_OKT_EMELT_COUNT = 20;
