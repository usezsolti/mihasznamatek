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

/** 2024. jan. 30. Mat2 (UI: 2024 Január 30 kártya) — útmutató szerint. */
export function getKozponti2024FebQuestions(): Question[] {
    const colorFig = imageFigure('/figures/kozponti/2024feb/t3-szinez.png', '2024/3. kor, teglalap, haromszog');
    const flightFig = imageFigure('/figures/kozponti/2024feb/t4-repulo.png', '2024/4. magassag-ido grafikon');
    const coordFig = imageFigure('/figures/kozponti/2024feb/t5-koord.png', '2024/5. ABC haromszog');
    const triFig = imageFigure('/figures/kozponti/2024feb/t8-haromszog.png', '2024/8. szabalyos ABC');
    const tankFig = imageFigure('/figures/kozponti/2024feb/t9-kad.png', '2024/9. uvegkad es rud');

    const list: Question[] = [
        q(
            'kf2024f-1a',
            '2024/1.a) A = 6/8 tizedes tört alakja. Mennyi A?',
            0.75,
            '6/8 = 0,75'
        ),
        q(
            'kf2024f-1b',
            '2024/1.b) Téglalap hosszabb oldala 13 cm, területe 65 cm². A rövidebb oldal cm-ben?',
            5,
            '65/13 = 5'
        ),
        q(
            'kf2024f-1c',
            '2024/1.c) C = 18/17 − 11/17. Mennyi C? (7 vagy 7/17 is jó a javítókulcs szerint: 7)',
            7,
            '18/17 - 11/17 = 7/17, a kulcs C = 7'
        ),
        q(
            'kf2024f-1d',
            '2024/1.d) D = 12-nek a 30%-a. Mennyi D? (3,6 is jó)',
            3.6,
            '12*0,3 = 3,6'
        ),
        q(
            'kf2024f-2a',
            '2024/2.a) 85 nap + ? nap = 14 hét',
            13,
            '14*7 = 98, 98-85 = 13'
        ),
        q(
            'kf2024f-2b',
            '2024/2.b) 13,55 m − 2350 mm = ? m  (11,2 is jó)',
            11.2,
            '2350 mm = 2,35 m, 13,55-2,35 = 11,2'
        ),
        q(
            'kf2024f-2c',
            '2024/2.c) 18 000 dm³ + ? m³ = 44 000 liter',
            26,
            '18000 dm3 = 18 m3 = 18000 l, 44000-18000 = 26000 l = 26 m3'
        ),
        q(
            'kf2024f-2d',
            '2024/2.d) 44 000 liter = ? hl',
            440,
            '44000 l = 440 hl'
        ),
        q(
            'kf2024f-3',
            '2024/3. Kör, téglalap, háromszög: 5 tartomány, P/K/Z, szomszédosak különbözők, a háromszögben van piros, a téglalapban van kék.\nHány megfelelő színezés van összesen (a példa is számít)?',
            7,
            '7 helyes szinezes a kulcs szerint',
            { figure: colorFig }
        ),
        q(
            'kf2024f-4a',
            '2024/4.a) Hány perc alatt érte el a 9000 méteres magasságot?',
            12,
            'A grafikonon 9000 m 12 percnél',
            { figure: flightFig }
        ),
        q(
            'kf2024f-4b',
            '2024/4.b) Milyen magasan volt a felszállás után 10 perccel? (méter)',
            6000,
            '10 percnél 6000 m',
            { figure: flightFig }
        ),
        q(
            'kf2024f-4c',
            '2024/4.c) Hány méterrel volt magasabban 9 perc után, mint 3 perc után?',
            4000,
            'Kulcs: 4000 m',
            { figure: flightFig }
        ),
        q(
            'kf2024f-4d1',
            '2024/4.d) A legnagyobb emelkedés a felszállást követő hányadik perctől tart?',
            11,
            '11 perc és 12 perc kozott',
            { figure: flightFig }
        ),
        q(
            'kf2024f-4d2',
            '2024/4.d) ...és melyik percig?',
            12,
            '12 perc',
            { figure: flightFig }
        ),
        q(
            'kf2024f-5t',
            '2024/5.c) Az ABC háromszög területe? (egy rácsnégyzet = 1)',
            20,
            'T = 8*5/2 = 20',
            { figure: coordFig }
        ),
        q(
            'kf2024f-5ax',
            '2024/5.e) A origóra vonatkozó tükörképe A\'. A\' x-koordinátája?',
            -2,
            "A'(-2; -5)",
            { figure: coordFig }
        ),
        q(
            'kf2024f-5ay',
            '2024/5.f) A\' y-koordinátája?',
            -5,
            "A'(-2; -5)",
            { figure: coordFig }
        ),
        q(
            'kf2024f-6',
            '2024/6. Reklám 39 600 Ft. Sütemény készítés 400 Ft, eladási ár 900 Ft. Hány darabot kell legalább eladni, hogy megtérüljön?',
            80,
            '39600/500 = 79,2, tehat legalabb 80'
        ),
        q(
            'kf2024f-7a',
            '2024/7.a) Mennyi 3,65 · 4 · 2500?\n(A) 365\n(B) 3650\n(C) 36,5\n(D) 36 500\nBetű száma: A=1, B=2, C=3, D=4',
            4,
            '36500 -> D -> 4'
        ),
        q(
            'kf2024f-7b',
            '2024/7.b) 2b − 3a értéke, ha a=4, b=2?\n(A) −8\n(B) 2\n(C) −1\n(D) 16\nBetű száma: A=1 ... D=4',
            1,
            '4-12 = -8 -> A -> 1'
        ),
        q(
            'kf2024f-7c',
            '2024/7.c) Melyik NEM igaz?\n(A) Van tengelyesen szimmetrikus ötszög.\n(B) Minden háromszög konvex.\n(C) Egy szabályos ötszögnek 10 átlója van.\n(D) Minden paralelogramma trapéz.\nBetű száma: A=1 ... D=4',
            3,
            'Szabalyos otszog atlói: 5, nem 10 -> C -> 3'
        ),
        q(
            'kf2024f-7d',
            '2024/7.d) A 3415 osztható\n(A) 7-tel\n(B) 15-tel\n(C) 9-cel\n(D) 5-tel\nBetű száma: A=1 ... D=4',
            4,
            '3415 5-re vegzodik -> D -> 4'
        ),
        q(
            'kf2024f-8a',
            '2024/8.a) ABC szabályos, AB=BD=EC, béta=15 fok. Mekkora az epsilon szög? (fok)',
            15,
            'epsilon = 15',
            { figure: triFig }
        ),
        q(
            'kf2024f-8b',
            '2024/8.b) Mekkora a BDC háromszög C csúcsánál lévő gamma szög? (fok)',
            30,
            'gamma = 30',
            { figure: triFig }
        ),
        q(
            'kf2024f-8c',
            '2024/8.c) Mekkora az ACE háromszög A csúcsánál lévő mu szög? (fok)',
            45,
            'mu = 45',
            { figure: triFig }
        ),
        q(
            'kf2024f-8d',
            '2024/8.d) Mekkora az ABF háromszög F csúcsánál lévő fi szög? (fok)',
            75,
            'fi = 75',
            { figure: triFig }
        ),
        q(
            'kf2024f-9',
            '2024/9. Nyitott téglatest kád + négyzetes acélrúd, színültig víz. A rúd kiemelése után hány cm-rel csökken a vízszint? (0,5 vagy 1/2 is jó)',
            0.5,
            '5*5*10 = 250, 25*20*x = 250, x = 0,5',
            { figure: tankFig }
        ),
        q(
            'kf2024f-10a',
            '2024/10. Három szám összege 92. Az első a második 125%-a. Az első+harmadik = a második háromszorosa + 12. Az első szám?',
            25,
            'x=25, y=20, z=47'
        ),
        q(
            'kf2024f-10b',
            '2024/10. A második szám?',
            20,
            '20'
        ),
        q(
            'kf2024f-10c',
            '2024/10. A harmadik szám?',
            47,
            '47'
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H9',
        location: 'kf2024FebBank.ts:getKozponti2024FebQuestions',
        message: '2024 Jan30 Mat2 bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            firstAnswer: list[0]?.answer,
            lastId: list[list.length - 1]?.id,
            lastAnswer: list[list.length - 1]?.answer,
            a1a: list.find((x) => x.id === 'kf2024f-1a')?.answer,
            a10c: list.find((x) => x.id === 'kf2024f-10c')?.answer,
            colorKind: list.find((x) => x.id === 'kf2024f-3')?.figure?.kind,
            flightKind: list.find((x) => x.id === 'kf2024f-4a')?.figure?.kind,
            coordKind: list.find((x) => x.id === 'kf2024f-5t')?.figure?.kind,
            triKind: list.find((x) => x.id === 'kf2024f-8a')?.figure?.kind,
            tankKind: list.find((x) => x.id === 'kf2024f-9')?.figure?.kind,
            parseOk: true,
        },
        runId: 'kf-2024-feb',
    });
    // #endregion

    return list;
}

export const KOZPONTI_2024_FEB_COUNT = 30;
