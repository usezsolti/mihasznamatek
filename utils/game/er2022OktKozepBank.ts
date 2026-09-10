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

const FIG = '/figures/erettsegi/2022okt-kozep';

/** 2022. október 18. középszint (2211) — válaszok a javítási útmutató szerint. */
export function getErettsegi2022OktKozepQuestions(): Question[] {
    const graph = imageFigure(`${FIG}/p04-1.png`, '2022/5. f grafikonja');
    const tri1 = imageFigure(`${FIG}/p06-1.png`, '2022/10. háromszög');
    const tri2 = imageFigure(`${FIG}/p06-2.png`, '2022/10. háromszög');
    const rail = imageFigure(`${FIG}/p14-1.png`, '2022/14. lépcsőkorlát');
    const para = imageFigure(`${FIG}/p14-2.jpeg`, '2022/14. paralelogramma');
    const grades = imageFigure(`${FIG}/p18-1.png`, '2022/16. próbaérettségi táblázat');

    const list: Question[] = [
        q(
            'er22o-1A',
            '2022/1. A = {12-nél kisebb prímszámok}. Sorold fel A elemeit.',
            0,
            'A = {2; 3; 5; 7; 11}',
            { expectedSet: ['2', '3', '5', '7', '11'] }
        ),
        q(
            'er22o-1B',
            '2022/1. B = {3-mal nem osztható egyjegyű számok}. Sorold fel B elemeit.',
            0,
            'B = {1; 2; 4; 5; 7; 8}',
            { expectedSet: ['1', '2', '4', '5', '7', '8'] }
        ),
        q(
            'er22o-1i',
            '2022/1. Ugyanazok a halmazok. Sorold fel A ∩ B elemeit.',
            0,
            'A ∩ B = {2; 5; 7}',
            { expectedSet: ['2', '5', '7'] }
        ),
        q(
            'er22o-1d',
            '2022/1. Ugyanazok a halmazok. Sorold fel B \\ A elemeit.',
            0,
            'B \\ A = {1; 4; 8}',
            { expectedSet: ['1', '4', '8'] }
        ),
        q(
            'er22o-2',
            '2022/2. Hány olyan háromjegyű pozitív egész szám van, melynek mindhárom számjegye nagyobb 5-nél?',
            64,
            '4³ = 64'
        ),
        q(
            'er22o-3',
            '2022/3. (2^7 · 2^6) / 2^3 = 2^n. Add meg n értékét.',
            10,
            '2^{10} = 2^n → n = 10'
        ),
        q(
            'er22o-4',
            '2022/4. 35 g csokoládé, 100 g-ban 520 kcal. Hány kcal van ebben a szeletben?',
            182,
            '0,35 · 520 = 182'
        ),
        q(
            'er22o-5',
            '2022/5. f(x) = −(x+1)² + 5 a [−3; 2] zárt intervallumon. Add meg az értékkészlet alsó és felső határát, és a maximum helyét.',
            -4,
            'értékkészlet [−4; 5], maximum helye −1',
            { alternativeAnswer: 5, thirdAnswer: -1, figure: graph }
        ),
        q(
            'er22o-6',
            '2022/6. Hány átlója van egy konvex nyolcszögnek?',
            20,
            '8 · 5 / 2 = 20'
        ),
        q(
            'er22o-7',
            '2022/7. 10^x = 30. Add meg x értékét három tizedesjegyre kerekítve.',
            1.477,
            'x = lg 30 ≈ 1,477'
        ),
        q(
            'er22o-8',
            '2022/8. f: x ↦ 5x − 3 a valósokon. A grafikon az x-tengelyt a P pontban metszi. P első koordinátája?',
            0.6,
            '5x − 3 = 0 → x = 3/5 = 0,6'
        ),
        q(
            'er22o-10',
            '2022/10. A háromszögben a 30°-os szöggel szemközti oldal hossza (cm, két tizedesre).',
            3.92,
            'β = 50°; sin 30° / a = sin 50° / 6 → a ≈ 3,92',
            { figures: [tri1, tri2] }
        ),
        q(
            'er22o-11',
            '2022/11. Gyufaszálak: 43, 40, 42, 39, 40, 36. Add meg az átlagot és a szórást (két tizedesre).',
            40,
            'átlag = 40, szórás = √5 ≈ 2,24',
            { alternativeAnswer: 2.24 }
        ),
        q(
            'er22o-12',
            '2022/12. Szabályos dobókockával kétszer dobunk. P(a két szám szorzata 6)?',
            1 / 9,
            '4/36 = 1/9 ≈ 0,111'
        ),
        q(
            'er22o-13a',
            '2022/13.a) x/2 + (x−1)/3 = 8 a valósokon. x = ?',
            10,
            '3x + 2(x−1) = 48 → x = 10'
        ),
        q(
            'er22o-13b',
            '2022/13.b) Két egymást követő egész szám négyzetének összege 10 513. Add meg a két számot (mindkét előjelpár).',
            72,
            '72 és 73, vagy −73 és −72',
            { alternativeAnswer: 73, thirdAnswer: -73, fourthAnswer: -72 }
        ),
        q(
            'er22o-14a',
            '2022/14.a) A ϕ szög a paralelogramma alsó oldalának a vízszintessel bezárt szöge (egész fokra).',
            23,
            'cos ϕ = 115/125 = 0,92 → ϕ = 23°',
            { figures: [rail, para] }
        ),
        q(
            'er22o-14b',
            '2022/14.b) A paralelogramma e átlójának hossza (cm, egészre).',
            119,
            'e ≈ 119 cm',
            { figures: [rail, para] }
        ),
        q(
            'er22o-14c',
            '2022/14.c) A nádszövet területe (cm²), illetve m²-ben, és kisebb-e 1 m²-nél? Igaz=1, hamis=0.',
            9200,
            'T = 80 · 115 = 9200 cm² = 0,92 m²; az állítás igaz',
            { alternativeAnswer: 0.92, thirdAnswer: 1, figures: [rail, para] }
        ),
        q(
            'er22o-15a',
            '2022/15.a) 24. havi árbevétel és a két év összbevétele (Ft, tízezerre kerekítve).',
            720000,
            '300 000 · 1,05^{18} ≈ 720 000; összesen 10 660 000',
            { alternativeAnswer: 10660000 }
        ),
        q(
            'er22o-15b',
            '2022/15.b) Öt fiatal, csak András vagy Dóra vezet, András Cili mellett ül. Hányféle ülésrend?',
            14,
            '6 + 8 = 14'
        ),
        q(
            'er22o-16a',
            '2022/16.a) Hiányzó jegyek (Béla, Fruzsi, Géza, Huba). Add meg a négy jegyet.',
            4,
            '4, 4, 2, 3',
            { alternativeAnswer: 2, thirdAnswer: 3, figure: grades }
        ),
        q(
            'er22o-16b',
            '2022/16.b) 33 fő, páronként 13, 12, 10; 4 csak egy programon. Hányan voltak mindhárom programon?',
            3,
            'x = 3'
        ),
        q(
            'er22o-16c',
            '2022/16.c) 15 sor, 6. sorban 26, 10. sorban 34 szék. Összesen hány szék van?',
            450,
            'd = 2, a1 = 16, S15 = 450'
        ),
        q(
            'er22o-17a',
            '2022/17.a) 20 cm átmérőjű, 25 cm magas hengerből 2 mm átmérőjű ceruzabél. Hány méter készül?',
            2500,
            'h = 250 000 cm = 2500 m'
        ),
        q(
            'er22o-17b',
            '2022/17.b) Nők : férfiak = 3 : 2; +5 nő és +6 férfi után 4 : 3. Jelenleg hány nő és hány férfi?',
            27,
            '27 nő, 18 férfi',
            { alternativeAnswer: 18 }
        ),
        q(
            'er22o-17c',
            '2022/17.c) P(kitörik)=0,2, 12 ceruza. P(legfeljebb egy törik), három tizedesre.',
            0.275,
            '0,8^{12} + C(12,1)·0,2·0,8^{11} ≈ 0,069 + 0,206 = 0,275'
        ),
        q(
            'er22o-18a',
            '2022/18.a) 36 sokszög, 24 piros, 27 háromszög, 5 kék négyszög. Hány piros háromszög van?',
            20,
            '20 piros háromszög'
        ),
        q(
            'er22o-18b',
            '2022/18.b) 36-ból kettőt választunk. P(mindkettő háromszög)? Három tizedesre.',
            0.557,
            'C(27,2)/C(36,2) = 39/70 ≈ 0,557'
        ),
        q(
            'er22o-18d',
            '2022/18.d) A(1; 2), B(5; 0), C(6; 7). Az ABC háromszög területe (területegység).',
            15,
            'T = 15'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H20',
        location: 'er2022OktKozepBank.ts',
        message: '2022 okt kozep bank',
        data: { total: list.length, firstId: list[0]?.id },
        runId: 'er-batch-2020-23',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2022_OKT_KOZEP_COUNT = 30;
