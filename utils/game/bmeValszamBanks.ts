import type { Question } from './types';
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

const YN = 'igen=1, nem=0.';

function getGyak1(): Question[] {
    return [
        q(
            'bme-vsz1-2a',
            `BME 1. gyak. 2/a) Két kocka, A: az összeg kétjegyű, B: az összeg páros. Esemény-e, hogy az összeg egész? ${YN}`,
            1,
            'igen, Ω'
        ),
        q(
            'bme-vsz1-2b',
            `BME 1. gyak. 2/b) Esemény-e, hogy a dobott számok összege irracionális? ${YN}`,
            1,
            'igen, ∅'
        ),
        q(
            'bme-vsz1-2c',
            `BME 1. gyak. 2/c) Esemény-e, hogy a dobott számok összege 11? ${YN}`,
            1,
            'igen, pl. A \\ B'
        ),
        q(
            'bme-vsz1-2d',
            `BME 1. gyak. 2/d) Következik-e, hogy a dobott számok összege 7 is esemény? ${YN}`,
            0,
            'nem következik'
        ),
        q(
            'bme-vsz1-3f',
            `BME 1. gyak. 3/f) Kifejezhető-e a „3 darab 7-es és még 1 valami más” esemény az Ai, P, Ka, T, Ko, Bi jelekkel? ${YN} (nem lehetséges = 0)`,
            0,
            'nem lehetséges'
        ),
        q(
            'bme-vsz1-5',
            'BME 1. gyak. 5. Három kocka, A={összeg 7}, B={mindegyik páros}, C={van hármas}. P(A ∩ (B ∪ C)) = ? (tört is jó, pl. 1/24)',
            1 / 24,
            '1/24; P((A ∪ C) ∩ B) = 25/54',
            { alternativeAnswer: 25 / 54 }
        ),
        q(
            'bme-vsz1-6a',
            'BME 1. gyak. 6/a) n hosszú 0-1-2 sorozat. P(0-val kezdődik) = ?',
            1 / 3,
            '1/3'
        ),
        q(
            'bme-vsz1-9',
            'BME 1. gyak. 9. Véletlen pont a (±10; ±10) négyzeten. P(a háromszögre, tükörképére vagy a (±2; ±2) négyzetre esik) = ?',
            23 / 200,
            '23/200'
        ),
    ];
}

function getGyak2(): Question[] {
    return [
        q(
            'bme-vsz2-1yn',
            `BME 2. gyak. 1. Szabályos kocka, A={prím}, C={x≥4}. Független-e A és C? ${YN}`,
            1,
            'igen; P(A|B)=1/3'
        ),
        q(
            'bme-vsz2-1p',
            'BME 2. gyak. 1. P(A | B) = ? (A={prím}, B={páros})',
            1 / 3,
            '1/3'
        ),
        q(
            'bme-vsz2-2',
            'BME 2. gyak. 2. Két független lottószelvény közül legalább az egyik pontosan négytalálatos. P = ?',
            0.00001934,
            '0,00001934'
        ),
        q(
            'bme-vsz2-3a',
            'BME 2. gyak. 3. Legalább az egyik mindig bekövetkezik, P(A|B)=0,2, P(B|A)=0,5. P(A) = ?',
            1 / 3,
            'P(A)=1/3; P(B)=5/6; P(A∪B)=1; nem függetlenek',
            { alternativeAnswer: 5 / 6, thirdAnswer: 1 }
        ),
        q(
            'bme-vsz2-3yn',
            `BME 2. gyak. 3. Független-e A és B? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz2-4',
            'BME 2. gyak. 4. Két kocka: P(mindkét érték páros | összeg ≥ 10) = ?',
            1 / 2,
            '1/2'
        ),
        q(
            'bme-vsz2-5',
            `BME 2. gyak. 5. Három érmedobás: A={van fej és írás is}, B={legfeljebb egy írás}. Független-e A és B? ${YN}`,
            1,
            'igen'
        ),
        q(
            'bme-vsz2-6',
            'BME 2. gyak. 6. Francia kártya + kocka. P(lesz hatos dobás) = ?',
            13 / 48,
            '13/48'
        ),
        q(
            'bme-vsz2-7',
            'BME 2. gyak. 7. 15 teniszlabda, 9 új. P(mindhárom kivételnél 1 új + 2 használt) = ?',
            0.0472,
            '0,0472'
        ),
        q(
            'bme-vsz2-8',
            'BME 2. gyak. 8. Négy város, hótorlasz 1/5. P(el lehet jutni A-ból D-be) = ?',
            0.9114,
            '0,9114'
        ),
        q(
            'bme-vsz2-9',
            'BME 2. gyak. 9. Két kocka, majd húzás. MAP becslés k-ra (0, 1 vagy 2), és P(eltaláljuk). Először k, aztán a valószínűség.',
            1,
            'k=1, P=5/7; k=0: 0; k=2: 2/7',
            { alternativeAnswer: 5 / 7 }
        ),
        q(
            'bme-vsz2-10',
            'BME 2. gyak. 10. p=1/4 esetén P(tudta | helyesen válaszolt) = ?',
            1 / 2,
            '3p/(2p+1); p=1/4-nél 1/2'
        ),
        q(
            'bme-vsz2-11a',
            'BME 2. gyak. 11/a) Kocka, majd annyi érme. P(egyszer sem fej) = ?',
            21 / 128,
            '21/128'
        ),
        q(
            'bme-vsz2-11b',
            'BME 2. gyak. 11/b) P(kocka=6 | egyszer sem fej) = ?',
            1 / 63,
            '1/63'
        ),
        q(
            'bme-vsz2-12a',
            'BME 2. gyak. 12/a) Nők 95%, férfiak 10% hosszú hajú. P(lány | hosszú haj), mozgólépcső (50-50) = ?',
            0.9048,
            '0,9048'
        ),
        q(
            'bme-vsz2-12b',
            'BME 2. gyak. 12/b) Ugyanez a Schönherz liftjénél (lakók 99%-a fiú). P = ?',
            0.0876,
            '0,0876'
        ),
    ];
}

function getGyak3(): Question[] {
    return [
        q(
            'bme-vsz3-1a',
            'BME 3. gyak. 1/a) Három érmedobás, X az első írás sorszáma (FFF-nél 0). P(X páratlan) = ?',
            5 / 8,
            '5/8'
        ),
        q(
            'bme-vsz3-1b',
            `BME 3. gyak. 1/b) Y(FFF) véletlenül 0 vagy 1. Valószínűségi változó-e Y az Ω eseménytéren? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz3-2',
            'BME 3. gyak. 2. Y = bekövetkező események száma A,B,C közül. P(0 < Y < 3) = ?',
            0.6,
            '0,6'
        ),
        q(
            'bme-vsz3-3',
            'BME 3. gyak. 3. Két 10 oldalú kocka, P(X ≤ Y) = ?',
            11 / 20,
            '11/20'
        ),
        q(
            'bme-vsz3-4',
            'BME 3. gyak. 4. Két kocka, a maximum várható értéke = ? (4 17/36)',
            4 + 17 / 36,
            '161/36'
        ),
        q(
            'bme-vsz3-5',
            'BME 3. gyak. 5. Ötös lottó: egy szelvény nyereményének várható értéke (Ft) = ?',
            154.1527,
            '154,1527'
        ),
        q(
            'bme-vsz3-6',
            'BME 3. gyak. 6. Érme, amíg két egymás utáni dobás azonos. E(dobásszám) = ?',
            3,
            '3'
        ),
        q(
            'bme-vsz3-7a',
            'BME 3. gyak. 7/a) 100 izzó, 1% hibás. P(legfeljebb 3 hibás) = ?',
            0.9816,
            '0,9816'
        ),
        q(
            'bme-vsz3-7b',
            'BME 3. gyak. 7/b) Várhatóan hány hibás? (és 7/c*: módusz)',
            1,
            '1; módusz is 1',
            { alternativeAnswer: 1 }
        ),
        q(
            'bme-vsz3-8',
            'BME 3. gyak. 8. X kockadobás, E((X−3)²) = ? (3 1/6)',
            19 / 6,
            '19/6'
        ),
        q(
            'bme-vsz3-9',
            'BME 3. gyak. 9. 10 cm négyzet, 3 cm átmérőjű pénz. P(lefed egy csúcsot) = ?',
            0.0707,
            '0,0707'
        ),
        q(
            'bme-vsz3-10',
            'BME 3. gyak. 10. Véletlen P=(a,b) az egységnégyzetben. P(ax²−2bx+1-nek nincs valós gyöke) = ?',
            2 / 3,
            '2/3'
        ),
        q(
            'bme-vsz3-11',
            'BME 3. gyak. 11. [0,1]-en két szám. P(az egyik több mint kétszerese a másiknak) = ?',
            1 / 2,
            '1/2'
        ),
        q(
            'bme-vsz3-12',
            'BME 3. gyak. 12. x∈(0,2), y∈(0,3). P(x,y,1-ből szerkeszthető háromszög) = ?',
            1 / 2,
            '1/2'
        ),
        q(
            'bme-vsz3-13',
            'BME 3. gyak. 13. x,y ∈ (0,1). P(x+y<1 és xy<0,16) = ?',
            0.4218,
            '0,4218'
        ),
    ];
}

function getGyak4(): Question[] {
    return [
        q(
            'bme-vsz4-2c',
            'BME 4. gyak. 2/c) Egységnégyzet átellenes oldalain a,b. X = távolság². E(X) = ?',
            7 / 6,
            '7/6'
        ),
        q(
            'bme-vsz4-3',
            'BME 4. gyak. 3. Ötös lottó: a legkisebb szám eloszlásfüggvénye a 25 helyen. F(25) = ?',
            0.7967,
            '0,7967; nem folytonos',
            { alternativeAnswer: 0 }
        ),
        q(
            'bme-vsz4-3yn',
            `BME 4. gyak. 3. Folytonos-e ez az eloszlásfüggvény? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz4-4b',
            'BME 4. gyak. 4/b) (0,1)-en három pont, Y a középső. E(Y) = ?',
            1 / 2,
            '1/2'
        ),
        q(
            'bme-vsz4-5',
            'BME 4. gyak. 5. Tartály kapacitása (liter), hogy P(kifogy)<0,05, majd az átlagos heti fogyasztás (liter).',
            45072,
            '45′072 ℓ; átlag 16′667 ℓ',
            { alternativeAnswer: 16667 }
        ),
        q(
            'bme-vsz4-6a',
            `BME 4. gyak. 6/a) Eloszlásfüggvény-e F(x)=1 (x>0), 0 egyébként? ${YN}`,
            1,
            'igen'
        ),
        q(
            'bme-vsz4-6b',
            `BME 4. gyak. 6/b) Eloszlásfüggvény-e F(x)=e^{−e^{−x}}? ${YN}`,
            1,
            'igen'
        ),
        q(
            'bme-vsz4-6c',
            `BME 4. gyak. 6/c) Eloszlásfüggvény-e F(x)=1−e^{−x²}? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz4-6d',
            `BME 4. gyak. 6/d) Eloszlásfüggvény-e F(x)=(2/π) arcsin(√x)? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz4-7a',
            'BME 4. gyak. 7/a) f(x)=α(2x−x²) a (0,2)-n. α = ?',
            3 / 4,
            '3/4'
        ),
        q(
            'bme-vsz4-7b',
            'BME 4. gyak. 7/b) f(x)=α√(x−2) a (2,3)-on. α = ?',
            3 / 2,
            '3/2'
        ),
        q(
            'bme-vsz4-7d',
            'BME 4. gyak. 7/d) f(x)=α cos(x/2) a (0,π)-n. α = ?',
            1 / 2,
            '1/2'
        ),
        q(
            'bme-vsz4-7e',
            'BME 4. gyak. 7/e) Mediánok: a)=1, b)≈2,63, c)≈3,54, d)=π/3. Add meg az a) mediánt, majd a d) mediánt.',
            1,
            '1; 2,63; 3,54; π/3',
            { alternativeAnswer: Math.PI / 3, thirdAnswer: 2.63, fourthAnswer: 3.54 }
        ),
        q(
            'bme-vsz4-8a',
            'BME 4. gyak. 8/a) Plútó kráterek, P(S>9)=0,2689. c = ?',
            10.89,
            '10,89'
        ),
        q(
            'bme-vsz4-8b',
            'BME 4. gyak. 8/b) d = ?',
            3.749,
            '3,749'
        ),
    ];
}

function getGyak5(): Question[] {
    return [
        q(
            'bme-vsz5-1a',
            'BME 5. gyak. 1/a) X exponenciális, P(X>3)=e^{−6}. λ = ?',
            2,
            'λ=2'
        ),
        q(
            'bme-vsz5-1b',
            'BME 5. gyak. 1/b) P(X<2) = ?',
            0.9817,
            '1−e^{−4} ≈ 0,9817'
        ),
        q(
            'bme-vsz5-1c',
            'BME 5. gyak. 1/c) E(X) = ?',
            0.5,
            '1/λ=1/2'
        ),
        q(
            'bme-vsz5-2',
            'BME 5. gyak. 2. Mosógép, örökifjú, átlag 2 év. P(első 3 évben nem hibásodik | első 2 évben jó) = ?',
            0.6065,
            'e^{−1/2} ≈ 0,6065'
        ),
        q(
            'bme-vsz5-3',
            'BME 5. gyak. 3. Hullócsillag, örökifjú. P(látunk az első órában) = ?',
            0.8647,
            '1−e^{−2} ≈ 0,8647'
        ),
        q(
            'bme-vsz5-4',
            'BME 5. gyak. 4. X,Y exponenciális, E(X)=2 E(Y), 3 P(X>1)=2 P(Y<1). E(X) = ?',
            1.443,
            '≈1,443'
        ),
        q(
            'bme-vsz5-5',
            'BME 5. gyak. 5. Egységintervallum, stop a középső harmadban. P(X<5) = ?',
            0.8025,
            '1−(2/3)^4 ≈ 0,8025'
        ),
        q(
            'bme-vsz5-6',
            'BME 5. gyak. 6. Érme, amíg két egymás utáni dobás azonos. E(dobásszám) = ?',
            3,
            '3'
        ),
        q(
            'bme-vsz5-7',
            'BME 5. gyak. 7. [−1,1]², stop az egységkörben. A pontok számának várható értéke = ?',
            1.273,
            'Geo(π/4), E=4/π ≈ 1,273'
        ),
        q(
            'bme-vsz5-8',
            'BME 5. gyak. 8. Érme a 2. fejig. P(az első fej után ugyanannyi kell a másodikig, mint az elsőig) = ?',
            1 / 3,
            '1/3'
        ),
        q(
            'bme-vsz5-9',
            'BME 5. gyak. 9. 20 napból átlag 2 reklamációmentes, Poisson. P(legalább 3 reklamáció egy napon) = ?',
            0.4046,
            '≈0,4046'
        ),
        q(
            'bme-vsz5-10',
            'BME 5. gyak. 10. 360 napból 12-ön semmi sem romlik. Várhatóan hány telefon romlik el egy nap, és hány napon romlik el legalább 2?',
            3.401,
            'λ=ln 30 ≈ 3,401; 307 nap',
            { alternativeAnswer: 307 }
        ),
        q(
            'bme-vsz5-11',
            'BME 5. gyak. 11. P(hibátlan kör)=0,05. P(legfeljebb 3 akadályt ver le) = ?',
            0.6482,
            '≈0,6482'
        ),
        q(
            'bme-vsz5-12',
            'BME 5. gyak. 12. 300-an 1 kullancsot, 75-en 2-t találtak. Becsült indulószám = ?',
            989,
            '989'
        ),
    ];
}

function getGyak6(): Question[] {
    return [
        q(
            'bme-vsz6-1a',
            'BME 6. gyak. 1/a) Y=(−1)^X, X hónap 4…12. P(Y=1) = ?',
            5 / 9,
            'P(Y=1)=5/9; P(Y=−1)=4/9',
            { alternativeAnswer: 4 / 9 }
        ),
        q(
            'bme-vsz6-1bc',
            'BME 6. gyak. 1/b–c) E(Y) = ?',
            1 / 9,
            '1/9'
        ),
        q(
            'bme-vsz6-2',
            'BME 6. gyak. 2. Tetraéder, Y=X², Z=X²+X+1. E(Y) = ?, E(Z) = ?',
            9 / 8,
            'E(Y)=9/8; E(Z)=23/8',
            { alternativeAnswer: 23 / 8 }
        ),
        q(
            'bme-vsz6-3a',
            'BME 6. gyak. 3/a) X~Pois(3), Y=3X−1. FY(π) = ?',
            0.1991,
            '0,1991'
        ),
        q(
            'bme-vsz6-3b',
            'BME 6. gyak. 3/b) Z=X²−X, E(Z) = ?',
            9,
            '9'
        ),
        q(
            'bme-vsz6-5e',
            'BME 6. gyak. 5. Y=|X−3|, X kocka. E(Y) = ?',
            1.5,
            'E(Y)=1,5'
        ),
        q(
            'bme-vsz6-6de',
            'BME 6. gyak. 6/d–e) Y=X√X, E(Y) = ?',
            1 / 4,
            '1/4'
        ),
    ];
}

function getGyak7(): Question[] {
    return [
        q(
            'bme-vsz7-1',
            `BME 7. gyak. 1. Két kocka, X=hatosok, Y=párosak száma. Független-e X és Y? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz7-2a',
            'BME 7. gyak. 2/a) Együttes eloszlás táblázat. p = ?',
            1 / 60,
            '1/60'
        ),
        q(
            'bme-vsz7-2b',
            'BME 7. gyak. 2/b) P(X≤0, Y=1) = ?',
            1 / 3,
            '1/3'
        ),
        q(
            'bme-vsz7-2c',
            `BME 7. gyak. 2/c) Független-e X és Y? ${YN}`,
            1,
            'igen'
        ),
        q(
            'bme-vsz7-2d',
            'BME 7. gyak. 2/d) E(XY) = ?',
            1 / 3,
            '1/3'
        ),
        q(
            'bme-vsz7-3',
            `BME 7. gyak. 3. 6 golyó, húzás pirosig. Független-e X és Y? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz7-4a',
            'BME 7. gyak. 4/a) X,Y ~ Geo(2/3) függetlenek. E(XY) = ?',
            2.25,
            '2,25'
        ),
        q(
            'bme-vsz7-4b',
            'BME 7. gyak. 4/b) P(X=2 | Y=5) = ?',
            2 / 9,
            '2/9'
        ),
        q(
            'bme-vsz7-4c',
            'BME 7. gyak. 4/c*) P(X=Y) = ?',
            0.5,
            '0,5'
        ),
        q(
            'bme-vsz7-5a',
            'BME 7. gyak. 5/a) 1,2,3 cédula, visszatevés nélkül. cov(X,Y) = ?',
            -1 / 3,
            '−1/3'
        ),
        q(
            'bme-vsz7-5b',
            'BME 7. gyak. 5/b) cov(X,X) = ?',
            2 / 3,
            '2/3'
        ),
        q(
            'bme-vsz7-5d',
            'BME 7. gyak. 5/d) corr(X,Y) = ?',
            -1 / 2,
            '−1/2'
        ),
        q(
            'bme-vsz7-5e',
            `BME 7. gyak. 5/e) Független-e X és Y? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz7-6',
            'BME 7. gyak. 6. corr(X, X²−4X) = ? (ha létezik)',
            0,
            '0, ha létezik'
        ),
        q(
            'bme-vsz7-7a',
            'BME 7. gyak. 7/a) Két kocka, X=egyesek száma, Y=második dobás. cov = ?',
            -0.4167,
            '−0,4167'
        ),
        q(
            'bme-vsz7-7b',
            'BME 7. gyak. 7/b) corr = ?',
            -0.4629,
            '−0,4629'
        ),
        q(
            'bme-vsz7-9',
            'BME 7. gyak. 9. X~Geo(1/3). E((3−X)²) = ?, D(5−2X) = ?',
            6,
            '6; 4,899',
            { alternativeAnswer: 4.899 }
        ),
    ];
}

function getGyak8(): Question[] {
    return [
        q(
            'bme-vsz8-1a',
            'BME 8. gyak. 1/a) X~U(0;3), Y~U(−1;4) függetlenek. P(X<Y) = ?',
            1 / 2,
            '1/2'
        ),
        q(
            'bme-vsz8-1b',
            'BME 8. gyak. 1/b) P(X+Y=1) = ?',
            0,
            '0'
        ),
        q(
            'bme-vsz8-1c',
            'BME 8. gyak. 1/c) P(XY<1) = ?',
            0.4323,
            '0,4323'
        ),
        q(
            'bme-vsz8-2',
            'BME 8. gyak. 2. X,Y~U(0;1), Z=2X+1, V=3Y. P(V<Z) = ?',
            2 / 3,
            '2/3'
        ),
        q(
            'bme-vsz8-3a',
            'BME 8. gyak. 3/a) f=2(x³+y³) a (0,1)²-en. P(X+Y<1) = ?',
            1 / 5,
            '1/5'
        ),
        q(
            'bme-vsz8-3b',
            'BME 8. gyak. 3/b) P(X²<Y) = ?',
            11 / 18,
            '11/18'
        ),
        q(
            'bme-vsz8-3d',
            'BME 8. gyak. 3/d) E(X) = ?',
            13 / 20,
            '13/20'
        ),
        q(
            'bme-vsz8-3e',
            `BME 8. gyak. 3/e) Független-e X és Y? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz8-4',
            'BME 8. gyak. 4. P((X,Y) a megadott háromszög belsejében) = ?',
            1 / 1024,
            '1/1024'
        ),
        q(
            'bme-vsz8-5',
            'BME 8. gyak. 5. Függetlenséghez a = ?, b = ?',
            1 / 5,
            'a=1/5, b=2/5',
            { alternativeAnswer: 2 / 5 }
        ),
        q(
            'bme-vsz8-6q',
            'BME 8. gyak. 6. Q=min(X,Y), X,Y~Exp(1). E(Q) = ?',
            1 / 2,
            'Q~Exp(2), E(Q)=1/2; E(R)=3/2; nem függetlenek',
            { alternativeAnswer: 3 / 2 }
        ),
        q(
            'bme-vsz8-6yn',
            `BME 8. gyak. 6. Független-e Q és R? ${YN}`,
            0,
            'nem függetlenek'
        ),
    ];
}

function getGyak9(): Question[] {
    return [
        q(
            'bme-vsz9-1a',
            'BME 9. gyak. 1/a) Élettartam N(6,3; 2²), 8 év garancia. P(meghibásodás a garancia alatt) = ?',
            0.8023,
            '0,8023'
        ),
        q(
            'bme-vsz9-1b',
            'BME 9. gyak. 1/b) Hány év garancia kell, hogy P(csak utána hibásodik)=0,95?',
            3.02,
            '3,02'
        ),
        q(
            'bme-vsz9-2',
            'BME 9. gyak. 2. Liszt N(m; 0,002²), P(X<2)=0,01. m = ?',
            2.005,
            '2,005'
        ),
        q(
            'bme-vsz9-3',
            'BME 9. gyak. 3. P(X<10)=0,2, P(X>14)=0,3. μ = ?, σ² = ?',
            12.47,
            'μ=12,47; σ²=8,657',
            { alternativeAnswer: 8.657 }
        ),
        q(
            'bme-vsz9-4',
            'BME 9. gyak. 4. N(86; 16) Fahrenheit → Celsius. Az új várható érték = ?, variancia = ?',
            30,
            'N(30; 4,938)',
            { alternativeAnswer: 4.938 }
        ),
        q(
            'bme-vsz9-6',
            'BME 9. gyak. 6. 300 film, p=0,1. P(több mint 42 tetszik) ≈ ?',
            0.0104,
            '≈0,0104'
        ),
        q(
            'bme-vsz9-7',
            'BME 9. gyak. 7. 500 hallgató, p=0,25. Hány fős terem kell 90%-os biztonsághoz? ≈ ?',
            138,
            '≈138'
        ),
        q(
            'bme-vsz9-9',
            'BME 9. gyak. 9. 1000 részfeladat U(1;3). P(összesen < 1984) ≈ ?',
            0.1894,
            '≈0,1894'
        ),
        q(
            'bme-vsz9-10',
            'BME 9. gyak. 10. Exp(λ) minta, CHT. λ közelítése ≈ ?',
            3,
            '≈3'
        ),
        q(
            'bme-vsz9-11',
            'BME 9. gyak. 11. 10 interjú, 3% túlcsúszás 100 percen. m = ?',
            9.439,
            '9,439'
        ),
    ];
}

function getGyak10(): Question[] {
    return [
        q(
            'bme-vsz10-1',
            'BME 10. gyak. 1. E(5X−6Y), E(XY), D²(5X−6Y+8), cov(5X+2Y+2, X+6Y−3). Add meg sorban az első és a harmadik értéket.',
            20,
            '20; 0; 97; 29',
            { alternativeAnswer: 97, thirdAnswer: 0, fourthAnswer: 29 }
        ),
        q(
            'bme-vsz10-2a',
            'BME 10. gyak. 2/a) X,Y~U(0;1), Z1=XY, Z2=X+Y. E(Z1)=?, E(Z2)=?',
            0.25,
            '0,25; 1',
            { alternativeAnswer: 1 }
        ),
        q(
            'bme-vsz10-2b',
            `BME 10. gyak. 2/b) Igaz-e, hogy D²(XY)=D²(X)·D²(Y)? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz10-2c',
            'BME 10. gyak. 2/c) D²(Z1+2Z2) = ?',
            1.049,
            '1,049'
        ),
        q(
            'bme-vsz10-3',
            'BME 10. gyak. 3. f=2(x³+y³) a (0,1)²-en. cov(X,Y) = ?',
            -0.0225,
            '−0,0225'
        ),
        q(
            'bme-vsz10-4',
            'BME 10. gyak. 4. Y=3X+8, Z=5−2X. corr(Y,Z) = ?',
            -1,
            '−1'
        ),
        q(
            'bme-vsz10-5',
            'BME 10. gyak. 5. X~U(0;2π), Y=cos X, Z=sin X. cov(Y,Z) = ?',
            0,
            '0; nem függetlenek'
        ),
        q(
            'bme-vsz10-5yn',
            `BME 10. gyak. 5. Független-e Y és Z? ${YN}`,
            0,
            'nem'
        ),
        q(
            'bme-vsz10-6',
            'BME 10. gyak. 6. cov(U, V²) = ?',
            0.0127,
            '0,01270'
        ),
        q(
            'bme-vsz10-7a',
            'BME 10. gyak. 7/a) cov(X1+X2, X2+X3) = ? (majd a két szórásnégyzet: 2 és 2)',
            1,
            '1; 2; 2',
            { alternativeAnswer: 2 }
        ),
        q(
            'bme-vsz10-7b',
            'BME 10. gyak. 7/b) corr(X1+X2, X2+X3) = ?',
            1 / 2,
            '1/2'
        ),
        q(
            'bme-vsz10-7d',
            'BME 10. gyak. 7/d) A regresszió hibájának szórásnégyzete = ?',
            3 / 2,
            '3/2'
        ),
        q(
            'bme-vsz10-9err',
            'BME 10. gyak. 9. A regressziós egyenes átlagos négyzetes hibája = ?',
            0.07097,
            '0,07097'
        ),
        q(
            'bme-vsz10-10',
            'BME 10. gyak. 10. E(X) = ?, E(Y) = ?',
            -8,
            '−8; −10',
            { alternativeAnswer: -10 }
        ),
    ];
}

function getGyak12(): Question[] {
    return [
        q(
            'bme-vsz11-1',
            'BME 11. gyak. 1. U~U[1;2], M|U ~ Exp(U) (ráta). E(M) = ? (és E(M|U=1) = 1)',
            Math.log(2),
            'E(M|U)=1/U; E(M)=ln 2',
            { alternativeAnswer: 1 }
        ),
        q(
            'bme-vsz11-2ey',
            'BME 11. gyak. 2/b) f=12/5 (x²−xy+y²) a (0,1)²-en. E(Y | X=0,5) = ?',
            0.625,
            'E(Y|X=x)=(6x²−4x+3)/(12x²−6x+4); x=1/2-nél 5/8'
        ),
        q(
            'bme-vsz11-2cov',
            'BME 11. gyak. 2/c) Var(X) = ? és cov(X,Y) = ?',
            13 / 150,
            'Var=13/150; cov=−2/75',
            { alternativeAnswer: -2 / 75 }
        ),
        q(
            'bme-vsz11-2reg',
            'BME 11. gyak. 2/d) Y lineáris regressziója X-re: meredekség = ?, tengelymetszet = ?',
            -4 / 13,
            'y = 51/65 − (4/13)x',
            { alternativeAnswer: 51 / 65 }
        ),
        q(
            'bme-vsz11-3',
            'BME 11. gyak. 3. f=4/5 (x+y+xy) a (0,1)²-en. E(X | Y=1) = ?',
            7 / 12,
            'E(X|Y=y)=(2+5y)/(3(1+3y)); y=1-nél 7/12'
        ),
        q(
            'bme-vsz11-4a',
            'BME 11. gyak. 4/a) X~N(0;1), Y~Exp(2) függetlenek. E(3X−Y+1 | X=1) = ?',
            3.5,
            '3X − 1/2 + 1 = 3X + 1/2'
        ),
        q(
            'bme-vsz11-4b',
            'BME 11. gyak. 4/b) E((2XY)² − 7Y | X=1) = ?',
            -1.5,
            '2X² − 7/2; X=1-nél −3/2'
        ),
        q(
            'bme-vsz11-4c',
            'BME 11. gyak. 4/c) E(X²+2XY+Y² | X+Y=1) = ?',
            1,
            '(X+Y)² | W=1 → 1'
        ),
        q(
            'bme-vsz11-5',
            'BME 11. gyak. 5. Három kocka, X=min, Y=max. E(X | Y=3) = ?',
            27 / 19,
            '27/19'
        ),
        q(
            'bme-vsz11-6',
            'BME 11. gyak. 6. Négy érme, Y=fejek száma, A={első fej a 2. dobás}. E(Y | A) = ?',
            2,
            '2'
        ),
        q(
            'bme-vsz11-7',
            'BME 11. gyak. 7. n kocka, X=hatosok, Y=párosak. E(Y|X) meredeksége X-ben = ?',
            3 / 5,
            'E(Y|X)=(2/5)n + (3/5)X',
            { alternativeAnswer: 2 / 5 }
        ),
        q(
            'bme-vsz11-8',
            'BME 11. gyak. 8. p~U(1/4; 3/4), dobás az első fejig. E(dobásszám) = ?',
            2 * Math.log(3),
            '2 ln 3 ≈ 2,197'
        ),
        q(
            'bme-vsz11-9',
            'BME 11. gyak. 9. X~Exp(4), Y|X ~ U(0;X). E(Y) = ?',
            1 / 8,
            'E(X/2)=1/8'
        ),
        q(
            'bme-vsz11-10a',
            'BME 11. gyak. 10/a) Irat a fiókban, 2/3 felső (7 perc), 1/3 alsó (3 perc). Kezdés a felsővel: E(idő) percben = ?',
            8,
            '8'
        ),
        q(
            'bme-vsz11-10b',
            'BME 11. gyak. 10/b) Kezdés az alsóval: E(idő) percben = ?',
            23 / 3,
            '23/3'
        ),
        q(
            'bme-vsz11-11',
            'BME 11. gyak. 11. Bánya, 3 irány (1 óra ki, 2 óra vissza, 3 óra vissza). E(kijutás ideje) órában = ?',
            6,
            'E=6'
        ),
        q(
            'bme-vsz11-imsc',
            'BME 11. gyak. IMSc. X1,X2 i.i.d. N(μ,σ²), X̄ és S². corr(X̄, S²) = ?',
            0,
            '0 (függetlenek Gauss-mintában)'
        ),
    ];
}

const LOADERS: Record<number, () => Question[]> = {
    1: getGyak1,
    2: getGyak2,
    3: getGyak3,
    4: getGyak4,
    5: getGyak5,
    6: getGyak6,
    7: getGyak7,
    8: getGyak8,
    9: getGyak9,
    10: getGyak9,
    11: getGyak10,
    12: getGyak12,
};

export function getBmeValszamGyakQuestions(n: number): Question[] {
    const loader = LOADERS[n];
    return loader ? loader() : [];
}

export function bmeValszamGyakCount(n: number): number {
    return getBmeValszamGyakQuestions(n).length;
}

export function getAllBmeValszamQuestions(): Question[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12].flatMap((n) => getBmeValszamGyakQuestions(n));
}

export function logBmeValszamBank(paperId: string, list: Question[] | null, loc: string): void {
    // #region agent log
    agentDebugLog({
        hypothesisId: 'H32',
        location: loc,
        message: 'BME valszam bank lookup',
        data: {
            paperId,
            total: list?.length || 0,
            firstId: list?.[0]?.id || null,
            lastId: list?.[list && list.length ? list.length - 1 : 0]?.id || null,
            routedToValoszinuseg: /valoszinuseg/.test(paperId),
        },
        runId: 'bme-valszam',
    });
    // #endregion
}
