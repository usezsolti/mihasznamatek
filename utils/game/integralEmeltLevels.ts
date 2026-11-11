import type { Question } from './types';
import { evalMathExpr } from '../gradeAntiderivative';

/**
 * Emelt érettségi — integrálás, 6×20.
 * A feladatok a „Integrálás • 6 szint / 120 feladat” lap szintjei:
 * alapintegrál, átalakítás, helyettesítés, parciális, határozott, összetett.
 * A primitív függvény akkor is jó, ha csak konstansban tér el a megoldókulcstól.
 */

const ANY = [-1.2, 0.4, 1.3, 2.1];
const POS = [0.6, 1.4, 2.5, 4];
const NZ = [-2, -1, 1, 2];
const TRIG = [0.4, 1.1, 2.2, 2.7];
const SEC = [-0.6, 0.2, 0.8, 1.1];
const CSC = [0.4, 1, 2, 2.6];
const OPEN = [-0.6, -0.2, 0.3, 0.7];
const ARC3 = [-2, -0.5, 0.8, 2];
const AWAY = [-2, 0, 1, 2];
const ROOT = [0, 1, 3, 5];
const POLE = [-4, -3, 0, 1];
const GAP = [-3, -2, 0.5, 2];
const SHIFT = [-1, 0, 2, 3];
const LNGT = [1.6, 2.4, 3.2, 4.5];

function prim(
    stage: number,
    integral: string,
    integrand: string,
    samples: number[],
    official: string,
    how: string
): Question {
    return {
        stage: stage as Question['stage'],
        question: `Határozd meg a primitív függvényt: ${integral}`,
        answer: 0,
        type: 'multiplication',
        expression: how,
        displayAnswer: official,
        integrand,
        integrandSamples: samples,
        answerHint: 'primitív függvény, +C lehet',
    };
}

function definite(
    stage: number,
    integral: string,
    valueExpr: string,
    official: string,
    how: string
): Question {
    const answer = evalMathExpr(valueExpr);
    if (!Number.isFinite(answer)) throw new Error(`Hibás integrálérték: ${valueExpr}`);
    return {
        stage: stage as Question['stage'],
        question: `Számítsd ki a határozott integrált: ${integral}`,
        answer,
        type: 'multiplication',
        expression: how,
        displayAnswer: official,
        gradeAsExpr: true,
        answerHint: 'pontos érték, pl. 1/2 vagy pi/4',
    };
}

export const getIntegralEmeltQuestions = (): Question[] => [
    // 1. szint — alapintegrálok
    prim(1, '∫ 5 dx', '5', ANY, '5x + C', 'Az állandó integrálja 5x + C.'),
    prim(1, '∫ x dx', 'x', ANY, 'x²/2 + C', 'A hatvány szabálya: ∫ x dx = x²/2 + C.'),
    prim(1, '∫ x² dx', 'x^2', ANY, 'x³/3 + C', 'A hatvány szabálya: ∫ x² dx = x³/3 + C.'),
    prim(1, '∫ 4x³ dx', '4*x^3', ANY, 'x⁴ + C', 'A hatvány szabálya: ∫ 4x³ dx = x⁴ + C.'),
    prim(1, '∫ (3x² − 2x + 1) dx', '3*x^2-2*x+1', ANY, 'x³ − x² + x + C', 'Tagonként: x³ − x² + x + C.'),
    prim(1, '∫ (x⁴ + 2x) dx', 'x^4+2*x', ANY, 'x⁵/5 + x² + C', 'Tagonként: x⁵/5 + x² + C.'),
    prim(1, '∫ √x dx', 'sqrt(x)', POS, '2x^(3/2)/3 + C', '∫ x^(1/2) dx = 2x^(3/2)/3 + C.'),
    prim(1, '∫ 1/√x dx', '1/sqrt(x)', POS, '2√x + C', '∫ x^(−1/2) dx = 2√x + C.'),
    prim(1, '∫ 1/x² dx', '1/x^2', NZ, '−1/x + C', '∫ x^(−2) dx = −1/x + C.'),
    prim(1, '∫ 3/x dx', '3/x', NZ, '3 ln|x| + C', 'A logaritmus alapintegrálja: 3 ln|x| + C.'),
    prim(1, '∫ eˣ dx', 'e^x', ANY, 'eˣ + C', 'Az exponenciális önmaga primitívje: eˣ + C.'),
    prim(1, '∫ (2eˣ + 3) dx', '2*e^x+3', ANY, '2eˣ + 3x + C', 'Tagonként: 2eˣ + 3x + C.'),
    prim(1, '∫ sin(x) dx', 'sin(x)', TRIG, '−cos(x) + C', '∫ sin(x) dx = −cos(x) + C.'),
    prim(1, '∫ cos(x) dx', 'cos(x)', TRIG, 'sin(x) + C', '∫ cos(x) dx = sin(x) + C.'),
    prim(1, '∫ (−3 sin(x) + 2 cos(x)) dx', '-3*sin(x)+2*cos(x)', TRIG, '3 cos(x) + 2 sin(x) + C', 'Tagonként: 3 cos(x) + 2 sin(x) + C.'),
    prim(1, '∫ 1/cos²(x) dx', '1/cos(x)^2', SEC, 'tg(x) + C', '∫ 1/cos²(x) dx = tg(x) + C.'),
    prim(1, '∫ 1/sin²(x) dx', '1/sin(x)^2', CSC, '−ctg(x) + C', '∫ 1/sin²(x) dx = −ctg(x) + C.'),
    prim(1, '∫ 1/(x² + 1) dx', '1/(x^2+1)', ANY, 'arctg(x) + C', 'Az arcus tangens alapintegrálja: arctg(x) + C.'),
    prim(1, '∫ 1/√(1 − x²) dx', '1/sqrt(1-x^2)', OPEN, 'arcsin(x) + C', 'Az arcus szinusz alapintegrálja: arcsin(x) + C.'),
    prim(1, '∫ (x³ − 2x + 4)/x dx', '(x^3-2*x+4)/x', NZ, 'x³/3 − 2x + 4 ln|x| + C', 'Osszunk x-szel: x² − 2 + 4/x, ennek primitívje x³/3 − 2x + 4 ln|x| + C.'),

    // 2. szint — átalakítás és felismerés
    prim(2, '∫ (x + 1)² dx', '(x+1)^2', ANY, 'x³/3 + x² + x + C', 'Bontsd fel: x² + 2x + 1, ennek primitívje x³/3 + x² + x + C.'),
    prim(2, '∫ (2x − 3)² dx', '(2*x-3)^2', ANY, '4x³/3 − 6x² + 9x + C', 'Bontsd fel: 4x² − 12x + 9, ennek primitívje 4x³/3 − 6x² + 9x + C.'),
    prim(2, '∫ (x − 1)(x + 2) dx', '(x-1)*(x+2)', ANY, 'x³/3 + x²/2 − 2x + C', 'Szorzat: x² + x − 2, ennek primitívje x³/3 + x²/2 − 2x + C.'),
    prim(2, '∫ (x² + 3x + 2)/x dx', '(x^2+3*x+2)/x', NZ, 'x²/2 + 3x + 2 ln|x| + C', 'Oszd el tagonként: x + 3 + 2/x, primitívje x²/2 + 3x + 2 ln|x| + C.'),
    prim(2, '∫ (x³ − 2x + 1)/x² dx', '(x^3-2*x+1)/x^2', NZ, 'x²/2 − 2 ln|x| − 1/x + C', 'Oszd el: x − 2/x + 1/x², primitívje x²/2 − 2 ln|x| − 1/x + C.'),
    prim(2, '∫ (√x + 1)/√x dx', '(sqrt(x)+1)/sqrt(x)', POS, 'x + 2√x + C', 'Egyszerűsíts: 1 + x^(−1/2), primitívje x + 2√x + C.'),
    prim(2, '∫ (x + 1)/√x dx', '(x+1)/sqrt(x)', POS, '2x^(3/2)/3 + 2√x + C', 'Írd át: x^(1/2) + x^(−1/2), primitívje 2x^(3/2)/3 + 2√x + C.'),
    prim(2, '∫ (1 − 2/x)² dx', '(1-2/x)^2', NZ, 'x − 4 ln|x| − 4/x + C', 'Bontsd fel: 1 − 4/x + 4/x², primitívje x − 4 ln|x| − 4/x + C.'),
    prim(2, '∫ e^(3x) dx', 'e^(3*x)', ANY, 'e^(3x)/3 + C', 'A belső derivált 3, ezért e^(3x)/3 + C.'),
    prim(2, '∫ e^(2x − 1) dx', 'e^(2*x-1)', ANY, 'e^(2x−1)/2 + C', 'A belső derivált 2, ezért e^(2x−1)/2 + C.'),
    prim(2, '∫ sin(4x) dx', 'sin(4*x)', TRIG, '−cos(4x)/4 + C', 'A belső derivált 4, ezért −cos(4x)/4 + C.'),
    prim(2, '∫ cos(3x + 2) dx', 'cos(3*x+2)', TRIG, 'sin(3x + 2)/3 + C', 'A belső derivált 3, ezért sin(3x + 2)/3 + C.'),
    prim(2, '∫ 1/(2x + 1) dx', '1/(2*x+1)', AWAY, 'ln|2x + 1|/2 + C', 'A belső derivált 2, ezért ln|2x + 1|/2 + C.'),
    prim(2, '∫ 1/(3x − 2)² dx', '1/(3*x-2)^2', [0, 1, 2, 3], '−1/(9x − 6) + C', 'A láncszabály szerint −1/(3(3x − 2)) + C, azaz −1/(9x − 6) + C.'),
    prim(2, '∫ √(2x + 3) dx', 'sqrt(2*x+3)', ROOT, '(2x + 3)^(3/2)/3 + C', 'A belső derivált 2, ezért (2x + 3)^(3/2)/3 + C.'),
    prim(2, '∫ 1/√(5 − 2x) dx', '1/sqrt(5-2*x)', [-1, 0, 1, 2], '−√(5 − 2x) + C', 'A belső derivált −2, ezért a primitív −√(5 − 2x) + C.'),
    prim(2, '∫ 1/(x² + 4) dx', '1/(x^2+4)', ANY, 'arctg(x/2)/2 + C', 'Írd át 1/4 · 1/((x/2)² + 1) alakba: arctg(x/2)/2 + C.'),
    prim(2, '∫ 1/√(9 − x²) dx', '1/sqrt(9-x^2)', ARC3, 'arcsin(x/3) + C', 'A 3-as skála miatt arcsin(x/3) + C.'),
    prim(2, '∫ sin²(x) dx', 'sin(x)^2', TRIG, 'x/2 − sin(2x)/4 + C', 'sin²(x) = (1 − cos(2x))/2, primitívje x/2 − sin(2x)/4 + C.'),
    prim(2, '∫ cos²(x) dx', 'cos(x)^2', TRIG, 'x/2 + sin(2x)/4 + C', 'cos²(x) = (1 + cos(2x))/2, primitívje x/2 + sin(2x)/4 + C.'),

    // 3. szint — helyettesítés
    prim(3, '∫ 2x(x² + 1)³ dx', '2*x*(x^2+1)^3', ANY, '(x² + 1)⁴/4 + C', 't = x² + 1, dt = 2x dx, ezért (x² + 1)⁴/4 + C.'),
    prim(3, '∫ 3x²(x³ + 2)⁴ dx', '3*x^2*(x^3+2)^4', ANY, '(x³ + 2)⁵/5 + C', 't = x³ + 2, dt = 3x² dx, ezért (x³ + 2)⁵/5 + C.'),
    prim(3, '∫ x√(x² + 4) dx', 'x*sqrt(x^2+4)', ANY, '(x² + 4)^(3/2)/3 + C', 't = x² + 4, dt = 2x dx, ezért (x² + 4)^(3/2)/3 + C.'),
    prim(3, '∫ x/√(x² + 1) dx', 'x/sqrt(x^2+1)', ANY, '√(x² + 1) + C', 't = x² + 1, a primitív √(x² + 1) + C.'),
    prim(3, '∫ 2x/(x² + 5) dx', '2*x/(x^2+5)', ANY, 'ln(x² + 5) + C', 'A számláló a nevező deriváltja, ezért ln(x² + 5) + C.'),
    prim(3, '∫ 3x²/(x³ + 1) dx', '3*x^2/(x^3+1)', [0, 0.5, 1, 2], 'ln|x³ + 1| + C', 'A számláló a nevező deriváltja, ezért ln|x³ + 1| + C.'),
    prim(3, '∫ x e^(x²) dx', 'x*e^(x^2)', ANY, 'e^(x²)/2 + C', 't = x², dt = 2x dx, ezért e^(x²)/2 + C.'),
    prim(3, '∫ x² e^(x³) dx', 'x^2*e^(x^3)', ANY, 'e^(x³)/3 + C', 't = x³, dt = 3x² dx, ezért e^(x³)/3 + C.'),
    prim(3, '∫ sin⁴(x) cos(x) dx', 'sin(x)^4*cos(x)', TRIG, 'sin⁵(x)/5 + C', 't = sin(x), dt = cos(x) dx, ezért sin⁵(x)/5 + C.'),
    prim(3, '∫ sin(x) cos³(x) dx', 'sin(x)*cos(x)^3', TRIG, '−cos⁴(x)/4 + C', 't = cos(x), dt = −sin(x) dx, ezért −cos⁴(x)/4 + C.'),
    prim(3, '∫ cos(x)/(sin(x) + 2) dx', 'cos(x)/(sin(x)+2)', TRIG, 'ln|sin(x) + 2| + C', 't = sin(x) + 2, dt = cos(x) dx, ezért ln|sin(x) + 2| + C.'),
    prim(3, '∫ sin(x)/(cos(x) + 3) dx', 'sin(x)/(cos(x)+3)', TRIG, '−ln|cos(x) + 3| + C', 't = cos(x) + 3, dt = −sin(x) dx, ezért −ln|cos(x) + 3| + C.'),
    prim(3, '∫ eˣ/(eˣ + 1) dx', 'e^x/(e^x+1)', ANY, 'ln(eˣ + 1) + C', 't = eˣ + 1, dt = eˣ dx, ezért ln(eˣ + 1) + C.'),
    prim(3, '∫ e^(2x)/(e^(2x) + 1) dx', 'e^(2*x)/(e^(2*x)+1)', ANY, 'ln(e^(2x) + 1)/2 + C', 't = e^(2x) + 1, dt = 2e^(2x) dx, ezért ln(e^(2x) + 1)/2 + C.'),
    prim(3, '∫ 1/(x ln(x)) dx', '1/(x*ln(x))', LNGT, 'ln|ln|x|| + C', 't = ln|x|, dt = dx/x, ezért ln|ln|x|| + C.'),
    prim(3, '∫ (ln(x))²/x dx', 'ln(x)^2/x', POS, '(ln|x|)³/3 + C', 't = ln|x|, dt = dx/x, ezért (ln|x|)³/3 + C.'),
    prim(3, '∫ x/(x² + 1)² dx', 'x/(x^2+1)^2', ANY, '−1/(2x² + 2) + C', 't = x² + 1, dt = 2x dx, ezért −1/(2(x² + 1)) + C.'),
    prim(3, '∫ 1/(√x (√x + 1)) dx', '1/(sqrt(x)*(sqrt(x)+1))', POS, '2 ln(√x + 1) + C', 't = √x, x = t², dx = 2t dt, az integrál 2 ln|√x + 1| + C.'),
    prim(3, '∫ √x / (x^(3/2) + 1) dx', 'sqrt(x)/(x^(3/2)+1)', POS, '2 ln(x^(3/2) + 1)/3 + C', 't = x^(3/2) + 1, dt = (3/2)√x dx, ezért 2 ln(x^(3/2) + 1)/3 + C.'),
    prim(3, '∫ x/(x⁴ + 1) dx', 'x/(x^4+1)', ANY, 'arctg(x²)/2 + C', 't = x², dt = 2x dx, ezért arctg(x²)/2 + C.'),

    // 4. szint — parciális integrálás
    prim(4, '∫ x eˣ dx', 'x*e^x', ANY, '(x − 1)eˣ + C', 'Parciálisan u = x, v′ = eˣ: (x − 1)eˣ + C.'),
    prim(4, '∫ x cos(x) dx', 'x*cos(x)', TRIG, 'x sin(x) + cos(x) + C', 'Parciálisan u = x, v′ = cos(x): x sin(x) + cos(x) + C.'),
    prim(4, '∫ x sin(x) dx', 'x*sin(x)', TRIG, '−x cos(x) + sin(x) + C', 'Parciálisan u = x, v′ = sin(x): −x cos(x) + sin(x) + C.'),
    prim(4, '∫ ln(x) dx', 'ln(x)', POS, 'x ln|x| − x + C', 'Parciálisan u = ln(x), v′ = 1: x ln|x| − x + C.'),
    prim(4, '∫ x ln(x) dx', 'x*ln(x)', POS, 'x² ln|x|/2 − x²/4 + C', 'Parciálisan u = ln(x), v′ = x: x² ln|x|/2 − x²/4 + C.'),
    prim(4, '∫ x e^(2x) dx', 'x*e^(2*x)', ANY, '(2x − 1)e^(2x)/4 + C', 'Parciálisan u = x, v′ = e^(2x): (2x − 1)e^(2x)/4 + C.'),
    prim(4, '∫ x cos(2x) dx', 'x*cos(2*x)', TRIG, 'x sin(2x)/2 + cos(2x)/4 + C', 'Parciálisan u = x, v′ = cos(2x): x sin(2x)/2 + cos(2x)/4 + C.'),
    prim(4, '∫ x sin(3x) dx', 'x*sin(3*x)', TRIG, '−x cos(3x)/3 + sin(3x)/9 + C', 'Parciálisan u = x, v′ = sin(3x): −x cos(3x)/3 + sin(3x)/9 + C.'),
    prim(4, '∫ x² eˣ dx', 'x^2*e^x', ANY, '(x² − 2x + 2)eˣ + C', 'Kétszer parciálisan: (x² − 2x + 2)eˣ + C.'),
    prim(4, '∫ x² cos(x) dx', 'x^2*cos(x)', TRIG, 'x² sin(x) + 2x cos(x) − 2 sin(x) + C', 'Kétszer parciálisan: x² sin(x) + 2x cos(x) − 2 sin(x) + C.'),
    prim(4, '∫ x² sin(x) dx', 'x^2*sin(x)', TRIG, '−x² cos(x) + 2x sin(x) + 2 cos(x) + C', 'Kétszer parciálisan: −x² cos(x) + 2x sin(x) + 2 cos(x) + C.'),
    prim(4, '∫ x² ln(x) dx', 'x^2*ln(x)', POS, 'x³ ln|x|/3 − x³/9 + C', 'Parciálisan u = ln(x), v′ = x²: x³ ln|x|/3 − x³/9 + C.'),
    prim(4, '∫ √x ln(x) dx', 'sqrt(x)*ln(x)', POS, '2x^(3/2) ln|x|/3 − 4x^(3/2)/9 + C', 'Parciálisan u = ln(x), v′ = √x: 2x^(3/2) ln|x|/3 − 4x^(3/2)/9 + C.'),
    prim(4, '∫ ln(x)/x² dx', 'ln(x)/x^2', POS, '(−ln|x| − 1)/x + C', 'Parciálisan u = ln(x), v′ = x^(−2): (−ln|x| − 1)/x + C.'),
    prim(4, '∫ arctg(x) dx', 'arctan(x)', ANY, 'x arctg(x) − ln(x² + 1)/2 + C', 'Parciálisan u = arctg(x), v′ = 1: x arctg(x) − ln(x² + 1)/2 + C.'),
    prim(4, '∫ (ln(x))² dx', 'ln(x)^2', POS, 'x (ln|x|)² − 2x ln|x| + 2x + C', 'Kétszer parciálisan: x(ln|x|)² − 2x ln|x| + 2x + C.'),
    prim(4, '∫ x³ eˣ dx', 'x^3*e^x', ANY, '(x³ − 3x² + 6x − 6)eˣ + C', 'Háromszor parciálisan: (x³ − 3x² + 6x − 6)eˣ + C.'),
    prim(4, '∫ x² e^(2x) dx', 'x^2*e^(2*x)', ANY, '(2x² − 2x + 1)e^(2x)/4 + C', 'Kétszer parciálisan: (2x² − 2x + 1)e^(2x)/4 + C.'),
    prim(4, '∫ eˣ sin(x) dx', 'e^x*sin(x)', TRIG, 'eˣ(sin(x) − cos(x))/2 + C', 'Kétszer parciálisan, a visszatérő integrált rendezve: eˣ(sin(x) − cos(x))/2 + C.'),
    prim(4, '∫ eˣ cos(x) dx', 'e^x*cos(x)', TRIG, 'eˣ(sin(x) + cos(x))/2 + C', 'Kétszer parciálisan, a visszatérő integrált rendezve: eˣ(sin(x) + cos(x))/2 + C.'),

    // 5. szint — határozott integrál
    definite(5, '0-tól 2-ig ∫ (3x² − 2x + 1) dx', '6', '6', 'A primitív x³ − x² + x. Behelyettesítve 0-tól 2-ig: 6.'),
    definite(5, '1-től e-ig ∫ 1/x dx', '1', '1', 'A primitív ln|x|. Behelyettesítve 1-től e-ig: 1.'),
    definite(5, '0-tól π-ig ∫ sin(x) dx', '2', '2', 'A primitív −cos(x). Behelyettesítve 0-tól π-ig: 2.'),
    definite(5, '0-tól π/4-ig ∫ cos(2x) dx', '1/2', '1/2', 'A primitív sin(2x)/2. A π/4-nél sin(π/2)/2 = 1/2.'),
    definite(5, '0-tól ln(2)-ig ∫ e^(2x) dx', '3/2', '3/2', 'A primitív e^(2x)/2. A ln(2)-nél 4/2 − 1/2 = 3/2.'),
    definite(5, '0-tól 1-ig ∫ 1/(x² + 1) dx', 'pi/4', 'π/4', 'A primitív arctg(x). Behelyettesítve 0-tól 1-ig: π/4.'),
    definite(5, '0-tól 1-ig ∫ 2x(x² + 1)³ dx', '15/4', '15/4', 't = x² + 1, 1-től 2-ig t⁴/4: 16/4 − 1/4 = 15/4.'),
    definite(5, '0-tól √3-ig ∫ x√(x² + 1) dx', '7/3', '7/3', 'A primitív (x² + 1)^(3/2)/3. √3-nál 8/3, 0-nál 1/3, a különbség 7/3.'),
    definite(5, '0-tól π/2-ig ∫ sin(x) cos(x) dx', '1/2', '1/2', 'A primitív sin²(x)/2. A π/2-nél 1/2.'),
    definite(5, '0-tól 1-ig ∫ x/(x² + 1) dx', 'ln(2)/2', 'ln(2)/2', 'A primitív ln(x² + 1)/2. 1-nél ln(2)/2.'),
    definite(5, '0-tól 1-ig ∫ x eˣ dx', '1', '1', 'A primitív (x − 1)eˣ. 1-nél 0, 0-nál −1, a különbség 1.'),
    definite(5, '1-től e-ig ∫ ln(x) dx', '1', '1', 'A primitív x ln|x| − x. e-nél 0, 1-nél −1, a különbség 1.'),
    definite(5, '1-től e-ig ∫ x ln(x) dx', '(1+e^2)/4', '(1 + e²)/4', 'A primitív x² ln|x|/2 − x²/4. Behelyettesítve (1 + e²)/4.'),
    definite(5, '0-tól π/2-ig ∫ x cos(x) dx', 'pi/2-1', 'π/2 − 1', 'A primitív x sin(x) + cos(x). Behelyettesítve π/2 − 1.'),
    definite(5, '0-tól 1-ig ∫ x² eˣ dx', 'e-2', 'e − 2', 'A primitív (x² − 2x + 2)eˣ. Behelyettesítve e − 2.'),
    definite(5, 'e-től e²-ig ∫ 1/(x ln(x)) dx', 'ln(2)', 'ln(2)', 't = ln(x), 1-től 2-ig ∫ dt/t = ln(2).'),
    definite(5, '0-tól π/2-ig ∫ cos(x)/(sin(x) + 2) dx', 'ln(3/2)', 'ln(3/2)', 'A primitív ln|sin(x) + 2|. A két határ ln(3) − ln(2) = ln(3/2).'),
    definite(5, '0-tól 1-ig ∫ x/(x² + 1)² dx', '1/4', '1/4', 'A primitív −1/(2(x² + 1)). Behelyettesítve 1/4.'),
    definite(5, '0-tól π-ig ∫ sin²(x) dx', 'pi/2', 'π/2', 'sin²(x) = (1 − cos(2x))/2. 0-tól π-ig az érték π/2.'),
    definite(5, '0-tól π-ig ∫ eˣ sin(x) dx', '(1+e^pi)/2', '(1 + e^π)/2', 'A primitív eˣ(sin(x) − cos(x))/2. Behelyettesítve (1 + e^π)/2.'),

    // 6. szint — összetett
    prim(6, '∫ x³ e^(x²) dx', 'x^3*e^(x^2)', ANY, '(x² − 1)e^(x²)/2 + C', 't = x² után parciális integrálás: (x² − 1)e^(x²)/2 + C.'),
    prim(6, '∫ x ln(x² + 1) dx', 'x*ln(x^2+1)', ANY, '−x²/2 + (x² + 1) ln(x² + 1)/2 + C', 'Parciálisan, majd a maradékot helyettesítéssel: −x²/2 + (x² + 1) ln(x² + 1)/2 + C.'),
    prim(6, '∫ x² arctg(x) dx', 'x^2*arctan(x)', ANY, 'x³ arctg(x)/3 − x²/6 + ln(x² + 1)/6 + C', 'Parciálisan u = arctg(x), a maradékot polinomosztással: x³ arctg(x)/3 − x²/6 + ln(x² + 1)/6 + C.'),
    prim(6, '∫ eˣ sin(2x) dx', 'e^x*sin(2*x)', TRIG, 'eˣ(sin(2x) − 2 cos(2x))/5 + C', 'Kétszer parciálisan: eˣ(sin(2x) − 2 cos(2x))/5 + C.'),
    prim(6, '∫ 1/(x² + 4x + 5) dx', '1/(x^2+4*x+5)', ANY, 'arctg(x + 2) + C', 'Alakítsd (x + 2)² + 1-re: arctg(x + 2) + C.'),
    prim(6, '∫ (2x + 3)/(x² + 3x + 2) dx', '(2*x+3)/(x^2+3*x+2)', POLE, 'ln|x² + 3x + 2| + C', 'A számláló a nevező deriváltja, ezért ln|x² + 3x + 2| + C.'),
    prim(6, '∫ 1/(x(x + 1)) dx', '1/(x*(x+1))', GAP, 'ln|x| − ln|x + 1| + C', 'Parciális törtek: 1/x − 1/(x + 1), primitívje ln|x| − ln|x + 1| + C.'),
    prim(6, '∫ (x² + 1)/(x − 1) dx', '(x^2+1)/(x-1)', SHIFT, 'x²/2 + x + 2 ln|x − 1| + C', 'Polinomosztás: x + 1 + 2/(x − 1), primitívje x²/2 + x + 2 ln|x − 1| + C.'),
    prim(6, '∫ sin³(x) cos²(x) dx', 'sin(x)^3*cos(x)^2', TRIG, 'cos⁵(x)/5 − cos³(x)/3 + C', 'sin³ = sin(1 − cos²). t = cos(x) után cos⁵(x)/5 − cos³(x)/3 + C.'),
    prim(6, '∫ x³/√(x² + 1) dx', 'x^3/sqrt(x^2+1)', ANY, '(x² + 1)^(3/2)/3 − √(x² + 1) + C', 't = x² + 1 után (x² + 1)^(3/2)/3 − √(x² + 1) + C.'),
    prim(6, '∫ 1/(eˣ + 1) dx', '1/(e^x+1)', ANY, 'x − ln(eˣ + 1) + C', '1/(eˣ + 1) = 1 − eˣ/(eˣ + 1), primitívje x − ln(eˣ + 1) + C.'),
    prim(6, '∫ ln(x) / (x ((ln(x))² + 1)) dx', 'ln(x)/(x*(ln(x)^2+1))', LNGT, 'ln((ln|x|)² + 1)/2 + C', 't = ln|x|, ∫ t/(t² + 1) dt = ln((ln|x|)² + 1)/2 + C.'),
    definite(6, '0-tól 1-ig ∫ x ln(x² + 1) dx', '-1/2+ln(2)', '−1/2 + ln(2)', 'A primitív −x²/2 + (x² + 1) ln(x² + 1)/2. Behelyettesítve −1/2 + ln(2).'),
    definite(6, '0-tól 1-ig ∫ x²/(x² + 1) dx', '1-pi/4', '1 − π/4', 'Polinomosztás: 1 − 1/(x² + 1). Behelyettesítve 1 − π/4.'),
    definite(6, '0-tól π/2-ig ∫ x sin(x) dx', '1', '1', 'A primitív −x cos(x) + sin(x). A π/2-nél 1.'),
    definite(6, '1-től e-ig ∫ (ln(x))²/x dx', '1/3', '1/3', 't = ln(x), 0-tól 1-ig t³/3 = 1/3.'),
    definite(6, '0-tól 1-ig ∫ x³/(x² + 1) dx', '1/2-ln(2)/2', '1/2 − ln(2)/2', 'Polinomosztás: x − x/(x² + 1). Behelyettesítve 1/2 − ln(2)/2.'),
    definite(6, '0-tól 1-ig ∫ arctg(x) dx', 'pi/4-ln(2)/2', 'π/4 − ln(2)/2', 'Parciálisan: x arctg(x) − ln(x² + 1)/2. Behelyettesítve π/4 − ln(2)/2.'),
    definite(6, '0-tól π/2-ig ∫ sin³(x) dx', '2/3', '2/3', 'sin³(x) = sin(x)(1 − cos²(x)). t = cos(x) után 2/3.'),
    definite(6, '0-tól 1-ig ∫ x² ln(x + 1) dx', '-5/18+2*ln(2)/3', '−5/18 + 2 ln(2)/3', 'Parciálisan, majd a maradékot polinomosztással: −5/18 + 2 ln(2)/3.'),
];
