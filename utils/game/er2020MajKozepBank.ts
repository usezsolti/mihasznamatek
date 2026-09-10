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

const FIG = '/figures/erettsegi/2020maj-kozep';

/** 2020. május 5. középszint (2011) — válaszok a javítási útmutató szerint. */
export function getErettsegi2020MajKozepQuestions(): Question[] {
    const pie = imageFigure(`${FIG}/p05-2.png`, '2020/7. életkor kördiagram');
    const venn = imageFigure(`${FIG}/p20-1.png`, '2020/17.b) N, B, F halmazábra');
    const stone = imageFigure(`${FIG}/p22-1.png`, '2020/18. ötszög alapú burkolókő');
    const pent = imageFigure(`${FIG}/p22-2.jpeg`, '2020/18. ABCDE ötszög');

    const list: Question[] = [
        q(
            'er20m-1',
            '2020/1. Téglatest egy csúcsából kiinduló élek: 3 dm, 2 dm és 2,5 dm. A felszín (dm²)?',
            37,
            '2(3·2 + 3·2,5 + 2·2,5) = 37'
        ),
        q(
            'er20m-3',
            '2020/3. A 2 hányadik hatványával egyenlő: (2⁷ · (2³)⁴) / 2⁵ ?',
            14,
            '(2⁷ · 2¹²) / 2⁵ = 2¹⁴'
        ),
        q(
            'er20m-4',
            '2020/4. Ötfős társaság (A–E), kölcsönös ismeretségek. Kiket ismer E? Írd be a betűket.',
            0,
            'E ismerősei: A és D',
            { expectedSet: ['A', 'D'] }
        ),
        q(
            'er20m-5A',
            '2020/5. A: Ha egy pozitív egész osztója 24-nek, akkor osztója 12-nek is. Igaz=1, hamis=0.',
            0,
            'Hamis (pl. 8 | 24, de 8 ∤ 12).'
        ),
        q(
            'er20m-5B',
            '2020/5. B: Ha egy pozitív egész osztható 12-vel, akkor osztható 6-tal is. Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er20m-5C',
            '2020/5. C: Ha egy pozitív egész osztható 2-vel és 4-gyel, akkor osztható 8-cal is. Igaz=1, hamis=0.',
            0,
            'Hamis (pl. 4).'
        ),
        q(
            'er20m-7',
            '2020/7. A kördiagram a diákok életkorát mutatja. Add meg a terjedelmet, a móduszt és a mediánt (év).',
            6,
            'terjedelem=6, módusz=17, medián=16',
            { alternativeAnswer: 17, thirdAnswer: 16, figure: pie }
        ),
        q(
            'er20m-8',
            '2020/8. Hány olyan egész szám van, amelynek az abszolút értéke kisebb 6-nál?',
            11,
            '|n| < 6 → n ∈ {−5; …; 5}, 11 szám'
        ),
        q(
            'er20m-9',
            '2020/9. 5/7 = 0,714285… (szakasz hossza 6). A tizedesvessző utáni 100. számjegy?',
            2,
            '100 = 6·16 + 4 → a szakasz 4. jegye: 2'
        ),
        q(
            'er20m-10',
            '2020/10. Háromszög: 11 cm-es oldallal szemközti szög 45°, van 122°-os szöge is. A 122°-os szöggel szemközti oldal (cm, egy tizedesre)?',
            13.2,
            'sin122°/a = sin45°/11 → a ≈ 13,2'
        ),
        q(
            'er20m-11',
            '2020/11. Mértani sorozat: a₁ = 1/2, a₂ = 3. A harmadik tag?',
            18,
            'q = 6; a₃ = 3·6 = 18'
        ),
        q(
            'er20m-12',
            '2020/12. Szabályos dobókocka 3-szor, a dobások háromjegyű számot adnak. P(szám > 500)?',
            1 / 3,
            '2/6 = 1/3'
        ),
        q(
            'er20m-13a',
            '2020/13.a) Oldd meg a valósokon: (x² − 4x + 4) / (x² − 4) = 2.',
            -6,
            'É.T.: x ≠ ±2; x = −6'
        ),
        q(
            'er20m-13b',
            '2020/13.b) f(x)=x−1, g(x)=2ˣ, h(x)=|x|−3. Melyik rendeli a (−2)-höz a (−1)-et? f=1, g=2, h=3.',
            3,
            'h(−2) = 2 − 3 = −1'
        ),
        q(
            'er20m-13c1',
            '2020/13.c) f(x)=x−1. Van zérushelye? Igaz=1, hamis=0.',
            1,
            'Igaz: f(1)=0.'
        ),
        q(
            'er20m-13c2',
            '2020/13.c) f(x)=x−1. Monoton növekvő a teljes értelmezési tartományon? Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er20m-13c3',
            '2020/13.c) f(x)=x−1. Van minimuma? Igaz=1, hamis=0.',
            0,
            'Hamis.'
        ),
        q(
            'er20m-13c4',
            '2020/13.c) g(x)=2ˣ. Van zérushelye? Igaz=1, hamis=0.',
            0,
            'Hamis.'
        ),
        q(
            'er20m-13c5',
            '2020/13.c) g(x)=2ˣ. Monoton növekvő a teljes értelmezési tartományon? Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er20m-13c6',
            '2020/13.c) g(x)=2ˣ. Van minimuma? Igaz=1, hamis=0.',
            0,
            'Hamis.'
        ),
        q(
            'er20m-13c7',
            '2020/13.c) h(x)=|x|−3. Van zérushelye? Igaz=1, hamis=0.',
            1,
            'Igaz: |x|=3.'
        ),
        q(
            'er20m-13c8',
            '2020/13.c) h(x)=|x|−3. Monoton növekvő a teljes értelmezési tartományon? Igaz=1, hamis=0.',
            0,
            'Hamis.'
        ),
        q(
            'er20m-13c9',
            '2020/13.c) h(x)=|x|−3. Van minimuma? Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er20m-14a',
            '2020/14.a) Súlylökés: hiányzó eredmények (m). Írd be a öt számot (Kung 2. dobása és a négy eredmény).',
            0,
            '19,39; 20,42; 20,63; 19,87; 19,35 (helyezések: 2., 1., 4., 3., 5.)',
            { expectedSet: ['19.39', '20.42', '20.63', '19.87', '19.35'] }
        ),
        q(
            'er20m-14b',
            '2020/14.b) Márton Anita hat dobásának átlaga és szórása (m).',
            19.01,
            'átlag=19,01; szórás≈0,72',
            { alternativeAnswer: 0.72 }
        ),
        q(
            'er20m-14c',
            '2020/14.c) 4 kg-os sárgaréz golyó, 1 cm³ = 8,73 g. Az átmérő (cm, egy tizedesre)?',
            9.6,
            'V≈458,19 cm³; r≈4,782 cm; 2r≈9,6 cm'
        ),
        q(
            'er20m-15a',
            '2020/15.a) 10 000 törölköző a 176 : 153 : 124 : 47 arányban, százasokra kerekítve. Kék, sárga, piros, zöld darabszám?',
            3500,
            '3500 kék, 3100 sárga, 2500 piros, 900 zöld',
            { alternativeAnswer: 3100, thirdAnswer: 2500, fourthAnswer: 900 }
        ),
        q(
            'er20m-15b',
            '2020/15.b) 4 kék + 2 sárga + 1 piros közül kettőt húzunk. P(mindkettő sárga)? Három tizedesre.',
            0.048,
            '2/42 = 1/21 ≈ 0,048'
        ),
        q(
            'er20m-15c',
            '2020/15.c) Tavaly 3-szor annyi nő, mint férfi; idén +70 nő és +6 férfi, így 4-szer annyi nő. Idén hány férfi és hány nő?',
            52,
            '52 férfi, 208 nő',
            { alternativeAnswer: 208 }
        ),
        q(
            'er20m-16a',
            '2020/16.a) A(−8; −12), B(8; 0); D az A tükörképe B-re. D koordinátái?',
            24,
            'D(24; 12)',
            { alternativeAnswer: 12 }
        ),
        q(
            'er20m-16b',
            '2020/16.b) ABC: A(−8; −12), B(8; 0), C(−1; 12). A B-n áthaladó magasságvonal: ax+by=c. Add meg a, b és c értékét.',
            7,
            '7x + 24y = 56',
            { alternativeAnswer: 24, thirdAnswer: 56 }
        ),
        q(
            'er20m-16d',
            '2020/16.d) A, B, C pontok 3 színnel, nem használjuk mind a 3 színt. Hány színezés?',
            21,
            '3³ − 3! = 27 − 6 = 21'
        ),
        q(
            'er20m-17a',
            '2020/17.a) 30 nap, összesen 3000 fa, naponta 2-vel több. Első és 30. napi darabszám?',
            71,
            'a₁=71, a₃₀=129',
            { alternativeAnswer: 129 }
        ),
        q(
            'er20m-17b',
            '2020/17.b) 3000 fából N=45, B=30, F=20; N∩B=21, N∩F=13, B∩F=4, mindhárom=2. Hány fa nem kapott jelet?',
            2941,
            '59 jelölt → 3000−59=2941',
            { figure: venn }
        ),
        q(
            'er20m-17c',
            '2020/17.c) Faállomány 10 000 m³, évi 3% növekedés. Hány év múlva éri el a 16 000 m³-t? (egy tizedes; a kb. 16 is jó)',
            15.9,
            '1,03ˣ=1,6 → x≈15,9 (kb. 16 év)',
            { alternativeAnswer: 16 }
        ),
        q(
            'er20m-18b',
            '2020/18.b) Szimmetrikus ABCDE ötszög, négy oldal 10 cm, három szög 120°. A terület (cm²)?',
            150,
            '2·50 + 50 = 150',
            { figures: [stone, pent] }
        ),
        q(
            'er20m-18c',
            '2020/18.c) Róbert 20 óra, Sándor 30 óra egyedül. Együtt hány óra alatt végeznek?',
            12,
            '1/20+1/30=1/12 → 12 óra',
            { figure: stone }
        ),
        q(
            'er20m-18d',
            '2020/18.d) P(rossz matrica)=0,01, 21 szürke jelzésű doboz. P(legalább 20-ban szürke kő), négy tizedesre.',
            0.9815,
            '0,99²¹ + C(21,20)·0,99²⁰·0,01 ≈ 0,9815',
            { figure: stone }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H20',
        location: 'er2020MajKozepBank.ts',
        message: '2020 maj kozep bank',
        data: { total: list.length, firstId: list[0]?.id, lastId: list[list.length - 1]?.id },
        runId: 'er-batch-2020-23',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2020_MAJ_KOZEP_COUNT = 38;
