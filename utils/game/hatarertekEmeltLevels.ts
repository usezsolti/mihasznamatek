import type { Question } from './types';

/**
 * Emelt érettségi — határérték, 6×20.
 * A típusok a „Határérték és differenciálszámítás” feladatlapot követik:
 * sorozat főtaggal, gyökös átalakítás, e-hatvány, nevezetes függvényhatárérték, egyoldali és paraméter.
 * A ±∞ és a „nem létezik” beírható szöveg. Az e^k beírható e^2 alakban is.
 */

const PLUS_INF = ['+∞', '∞', '+inf', 'inf', 'végtelen', '+végtelen', 'plusz végtelen'];
const MINUS_INF = ['−∞', '-∞', '-inf', '-végtelen', 'minusz végtelen', 'minuszinf'];
const NONE = ['nem létezik', 'nincs', 'nem'];

function card(
    stage: number,
    question: string,
    answer: number,
    expression: string,
    extra?: Pick<Question, 'acceptedAnswers' | 'answerHint'>
): Question {
    return {
        stage: stage as Question['stage'],
        question,
        answer,
        type: 'multiplication',
        expression,
        ...extra,
    };
}

function inf(stage: number, question: string, sign: 1 | -1, expression: string): Question {
    return card(stage, question, 0, expression, {
        acceptedAnswers: sign > 0 ? PLUS_INF : MINUS_INF,
        answerHint: 'pl. 2, +∞, −∞',
    });
}

function missing(stage: number, question: string, expression: string): Question {
    return card(stage, question, 0, expression, {
        acceptedAnswers: NONE,
        answerHint: 'pl. nem létezik',
    });
}

const e = Math.E;

export const getHatarertekEmeltQuestions = (): Question[] => [
    // 1. szint — racionális sorozat, főtag
    card(1, 'lim (n→∞) (2n+1)/(n+3) = ?', 2, 'Oszd n-nel: (2+1/n)/(1+3/n) → 2/1 = 2.'),
    card(1, 'lim (n→∞) (4n²+n)/(2n²−1) = ?', 2, 'Oszd n²-tel: (4+1/n)/(2−1/n²) → 4/2 = 2.'),
    card(1, 'lim (n→∞) (n+4)/(n²+1) = ?', 0, 'A nevező magasabb fokú, ezért a hányados 0-hoz tart.'),
    card(1, 'lim (n→∞) (6n−9)/(3n+3) = ?', 2, 'Oszd n-nel: (6−9/n)/(3+3/n) → 6/3 = 2.'),
    card(1, 'lim (n→∞) (8n−4)/(2n+6) = ?', 4, 'Oszd n-nel: (8−4/n)/(2+6/n) → 8/2 = 4.'),
    card(1, 'lim (n→∞) (n³−n)/(n³+4) = ?', 1, 'Oszd n³-nal: (1−1/n²)/(1+4/n³) → 1.'),
    card(1, 'lim (n→∞) (3n²−n)/(n²+5) = ?', 3, 'Oszd n²-tel: (3−1/n)/(1+5/n²) → 3.'),
    card(1, 'lim (n→∞) n/(2n+5) = ?', 0.5, 'Oszd n-nel: 1/(2+5/n) → 1/2.'),
    card(1, 'lim (n→∞) (10n²)/(5n²+n) = ?', 2, 'Oszd n²-tel: 10/(5+1/n) → 10/5 = 2.'),
    card(1, 'lim (n→∞) (7n+2)/(7n−2) = ?', 1, 'A főtagok hányadosa 7/7 = 1.'),
    card(1, 'lim (n→∞) (9n−3)/(3n) = ?', 3, 'Oszd n-nel: (9−3/n)/3 → 9/3 = 3.'),
    card(1, 'lim (n→∞) (n²−n)/(n²+n) = ?', 1, 'Oszd n²-tel: (1−1/n)/(1+1/n) → 1/1 = 1.'),
    card(1, 'lim (n→∞) 8/n = ?', 0, 'Állandó számláló, végtelen nevező: a hányados 0.'),
    card(1, 'lim (n→∞) (4n³+1)/(2n³−n) = ?', 2, 'Oszd n³-nal: (4+1/n³)/(2−1/n²) → 4/2 = 2.'),
    card(1, 'lim (n→∞) (4ⁿ+1)/4ⁿ = ?', 1, '1 + 4⁻ⁿ, és 4⁻ⁿ → 0, ezért a határérték 1.'),
    card(1, 'lim (n→∞) (n²+2n)/(4n²) = ?', 0.25, 'Oszd n²-tel: (1+2/n)/4 → 1/4 = 0,25.'),
    inf(1, 'lim (n→∞) (−3n⁵+2n²)/(n³+1) = ?', -1, 'A számláló ötödfokú és negatív főegyütthatós, a nevező harmadfokú, ezért −∞.'),
    inf(1, 'lim (n→∞) (n³+1)/(n+2) = ?', 1, 'A számláló magasabb fokú és pozitív, ezért +∞.'),
    inf(1, 'lim (n→∞) (√n + 2n³)/(n²+1) = ?', 1, 'A 2n³ a főtag, a nevező n², a hányados +∞.'),
    inf(1, 'lim (n→∞) (−n²)/(n+1) = ?', -1, 'A főtag −n, ez −∞-hez tart.'),

    // 2. szint — gyökös sorozatok, konjugálás
    card(2, 'lim (n→∞) (−n + √(n²+6n+2)) = ?', 3, 'Konjugálás: (6n+2)/(√(n²+6n+2)+n) → 6/2 = 3.'),
    card(2, 'lim (n→∞) (−n + √(n²+4n+1)) = ?', 2, 'A lineáris tag 4n, a határérték 4/2 = 2.'),
    card(2, 'lim (n→∞) (−n + √(n²+8n)) = ?', 4, 'Konjugálás után 8n/(√+n) → 8/2 = 4.'),
    card(2, 'lim (n→∞) (−n + √(n²+10n+3)) = ?', 5, 'A 10n tagból a határérték 10/2 = 5.'),
    card(2, 'lim (n→∞) (−n + √(n²+2n+1)) = ?', 1, '√(n²+2n+1) = n+1, ezért a különbség pontosan 1.'),
    card(2, 'lim (n→∞) n(−n + √(n²+4)) = ?', 2, 'Konjugálás: 4n / (√(n²+4)+n) → 4/2 = 2.'),
    card(2, 'lim (n→∞) n(−n + √(n²+6)) = ?', 3, '6n / (√(n²+6)+n) → 6/2 = 3.'),
    card(2, 'lim (n→∞) n(−n + √(n²+10)) = ?', 5, '10n / (√(n²+10)+n) → 10/2 = 5.'),
    card(2, 'lim (n→∞) (√(n²+5n) − √(n²−3n)) = ?', 4, 'A két lineáris tag különbségének fele: (5−(−3))/2 = 4.'),
    card(2, 'lim (n→∞) (√(n²+8n) − √(n²+2n)) = ?', 3, 'A két lineáris tag különbségének fele: (8−2)/2 = 3.'),
    card(2, 'lim (n→∞) (√(n²+6n) − n) = ?', 3, '6n / (√(n²+6n)+n) → 6/2 = 3.'),
    card(2, 'lim (n→∞) (n + √(4n²+n))/(3n) = ?', 1, '√(4n²+n) ~ 2n, ezért (n+2n)/(3n) → 1.'),
    card(2, 'lim (n→∞) (−n + ∛(n³+6n²)) = ?', 2, '∛(n³+3·2·n²) ~ n+2, a különbség 2.'),
    card(2, 'lim (n→∞) (−n + ∛(n³+3n²)) = ?', 1, 'A másodfokú tag 3n², ezért a határérték 1.'),
    card(2, 'lim (n→∞) (−n + ∛(n³+9n²)) = ?', 3, '9n² = 3·3·n², a határérték 3.'),
    card(2, 'lim (n→∞) (√(9n²+6n) − 3n) = ?', 1, '6n / (√(9n²+6n)+3n) → 6/6 = 1.'),
    card(2, 'lim (n→∞) (√(4n²+8n) − 2n) = ?', 2, '8n / (√(4n²+8n)+2n) → 8/4 = 2.'),
    card(2, 'lim (n→∞) (√(n²+2n+1) − n) = ?', 1, '√(n²+2n+1) = n+1, a különbség 1.'),
    card(2, 'lim (n→∞) (√(4n²+4n+1) − 2n) = ?', 1, '√(4n²+4n+1) = 2n+1, a különbség 1.'),
    card(2, 'lim (n→∞) (√(n²+12n) − n) = ?', 6, '12n / (√(n²+12n)+n) → 12/2 = 6.'),

    // 3. szint — e-hatvány, faktoriális, összeg
    card(3, 'lim (n→∞) (1+1/n)ⁿ = ? Beírhatod e^k alakban is.', e, 'A nevezetes határérték szerint (1+1/n)ⁿ → e¹ = e.'),
    card(3, 'lim (n→∞) (1+2/n)ⁿ = ? Beírhatod e^k alakban is.', e ** 2, 'A nevezetes alak szerint (1+2/n)ⁿ → e².'),
    card(3, 'lim (n→∞) (1−1/n)ⁿ = ? Beírhatod e^k alakban is.', e ** -1, 'A nevezetes alak szerint (1−1/n)ⁿ → e⁻¹.'),
    card(3, 'lim (n→∞) (1+1/n)²ⁿ = ? Beírhatod e^k alakban is.', e ** 2, 'A nevezetes határérték négyzete: ((1+1/n)ⁿ)² → e².'),
    card(3, 'lim (n→∞) (1+3/n)ⁿ = ? Beírhatod e^k alakban is.', e ** 3, 'A nevezetes alak szerint (1+3/n)ⁿ → e³.'),
    card(3, 'lim (n→∞) (1−3/n)²ⁿ = ? Beírhatod e^k alakban is.', e ** -6, '((1−3/n)ⁿ)² → (e⁻³)² = e⁻⁶.'),
    card(3, 'lim (n→∞) (1+1/(2n))ⁿ = ? Beírhatod e^k alakban is.', e ** 0.5, '(1+1/(2n))ⁿ = ((1+1/(2n))²ⁿ)^(1/2) → √e = e^(1/2).'),
    card(3, 'lim (n→∞) ((3n+5)/(3n−1))^(2n+1) = ? Beírhatod e^k alakban is.', e ** 4, '1+6/(3n−1) alak, a kitevő és a különbség szorzata 4, ezért e⁴.'),
    card(3, 'lim (n→∞) ((n²+2)/(n²+7))^(3n²) = ? Beírhatod e^k alakban is.', e ** -15, '1−5/(n²+7) alak. A kitevő 3n², a szorzat −15, ezért e⁻¹⁵.'),
    card(3, 'lim (n→∞) (1+4/n)^(n/2) = ? Beírhatod e^k alakban is.', e ** 2, '((1+4/n)ⁿ)^(1/2) → (e⁴)^(1/2) = e².'),
    card(3, 'lim (n→∞) (1−2/n)ⁿ = ? Beírhatod e^k alakban is.', e ** -2, 'A nevezetes alak szerint (1−2/n)ⁿ → e⁻².'),
    card(3, 'lim (n→∞) (1+5/n)^(n/5) = ? Beírhatod e^k alakban is.', e, '((1+5/n)ⁿ)^(1/5) → (e⁵)^(1/5) = e.'),
    card(3, 'lim (n→∞) (n+2)! / (n²·n!) = ?', 1, '(n+2)! / (n² n!) = (n+1)(n+2)/n² → 1.'),
    card(3, 'lim (n→∞) 4ⁿ / n! = ?', 0, 'A faktoriális minden exponenciálisnál gyorsabban nő, ezért a hányados 0.'),
    card(3, 'lim (n→∞) n! / nⁿ = ?', 0, 'nⁿ a nevezőben gyorsabban nő, a hányados 0.'),
    card(3, 'lim (n→∞) (1+2+2²+…+2ⁿ) / 2ⁿ = ?', 2, 'Az összeg (2ⁿ⁺¹−1)/2ⁿ = 2 − 2⁻ⁿ → 2.'),
    card(3, 'lim (n→∞) (1+2+…+n) / n² = ?', 0.5, 'Az összeg n(n+1)/2, osztva n²-tel: n(n+1)/(2n²) → 1/2.'),
    card(3, 'lim (n→∞) (2n + 6ⁿ + 1)^(1/n) = ?', 6, 'A legnagyobb alap a 6ⁿ, n-edik gyöke 6-hoz tart.'),
    card(3, 'lim (n→∞) (sin n) / √n = ?', 0, '|sin n / √n| ≤ 1/√n → 0, rendőrelv.'),
    card(3, 'lim (n→∞) 5ⁿ⁺¹ / (2·5ⁿ) = ?', 2.5, '5ⁿ⁺¹ / 5ⁿ = 5, osztva 2-vel: 5/2 = 2,5.'),

    // 4. szint — algebrai függvényhatárérték
    card(4, 'lim (x→3) (x²−9)/(x−3) = ?', 6, '(x−3)(x+3)/(x−3) = x+3, ha x≠3. Helyettesítve 6.'),
    card(4, 'lim (x→1) (x³+2x²−x−2)/(x²−1) = ?', 3, 'A számláló (x−1)(x+1)(x+2), a nevező (x−1)(x+1). Egyszerűsítés után x+2, az 1-ben 3.'),
    card(4, 'lim (x→∞) (4x⁴−3x+1)/(2x⁴+x²) = ?', 2, 'Oszd x⁴-nel: (4−3/x³+1/x⁴)/(2+1/x²) → 4/2 = 2.'),
    inf(4, 'lim (x→−∞) (x⁵+3x²−1) = ?', -1, 'A páratlan, pozitív főegyütthatós polinom −∞-ben −∞-hez tart.'),
    card(4, 'lim (x→3) (√(2x+3)−3)/(x−3) = ?', 1 / 3, 'Konjugálás: 2 / (√(2x+3)+3). Az x=3 helyen 2/6 = 1/3.'),
    card(4, 'lim (x→0) (∛(2x+1)−1)/x = ?', 2 / 3, 'A ∛(1+u) deriváltja 1/3 az 1-ben, a lánc 2-vel szoroz: 2/3.'),
    card(4, 'lim (x→0) (−√(1−x) + √(5x+1))/x = ?', 3, 'A 0-beli derivált: 1/(2√(1−x)) + 5/(2√(5x+1)), ez 1/2+5/2 = 3.'),
    card(4, 'lim (x→∞) (−x + √(x²+6x+1)) = ?', 3, 'Konjugálás: (6x+1)/(√(x²+6x+1)+x) → 6/2 = 3.'),
    card(4, 'lim (x→−∞) (x + √(x²−4x)) = ?', 2, 'x negatív, a gyök ~ −x. Konjugálás után a határérték 2.'),
    card(4, 'lim (x→0) (√(x²+1)−1)/x² = ?', 0.5, 'Konjugálás: x² / (x²(√(x²+1)+1)) → 1/2.'),
    card(4, 'lim (x→2) (x²−4)/(x−2) = ?', 4, 'x+2, ha x≠2. A 2-ben 4.'),
    card(4, 'lim (x→0) (x²−x)/x = ?', -1, 'x−1, ha x≠0. A 0-ban −1.'),
    card(4, 'lim (x→∞) (3x²+1)/(x²−x) = ?', 3, 'Oszd x²-tel: (3+1/x²)/(1−1/x) → 3.'),
    card(4, 'lim (x→∞) (2x+1)/x² = ?', 0, 'A nevező magasabb fokú, a hányados 0.'),
    card(4, 'lim (x→∞) (x³−1)/(2x³+x) = ?', 0.5, 'A főtagok hányadosa 1/2.'),
    inf(4, 'lim (x→−∞) (2x³+1)/x² = ?', -1, 'Egyszerűsítve ~ 2x, és x → −∞, ezért −∞.'),
    card(4, 'lim (x→1) (√x−1)/(x−1) = ?', 0.5, 'Konjugálás: 1/(√x+1). Az 1-ben 1/2.'),
    card(4, 'lim (x→4) (√x−2)/(x−4) = ?', 0.25, '1/(√x+2). A 4-ben 1/4.'),
    card(4, 'lim (x→∞) √(4x²+1) / x = ?', 2, '√(4+1/x²) → 2, mert x pozitív.'),
    inf(4, 'lim (x→∞) (x²+1)/(x−1) = ?', 1, 'A számláló magasabb fokú és pozitív, ezért +∞.'),

    // 5. szint — nevezetes határértékek
    card(5, 'lim (x→0) sin(4x)/x = ? A szög radián.', 4, 'sin(4x)/(4x) · 4 → 1·4 = 4.'),
    card(5, 'lim (x→0) sin(3x)/(5x) = ? A szög radián.', 0.6, '3/5 · sin(3x)/(3x) → 3/5 = 0,6.'),
    card(5, 'lim (x→0) (1−cos(3x))/x² = ? A szög radián.', 4.5, '(1−cos u)/u² → 1/2, u=3x, ezért 9/2 = 4,5.'),
    card(5, 'lim (x→0) (cos(x²)−1)/(5x⁴) = ? A szög radián.', -0.1, 'cos u − 1 ~ −u²/2, u=x², tehát −x⁴/(2·5x⁴) = −1/10.'),
    card(5, 'lim (x→0) sin(2x³) / (x² sin(4x)) = ? A szög radián.', 0.5, 'sin(2x³)~2x³ és sin(4x)~4x, a hányados 2x³/(4x³) → 1/2.'),
    card(5, 'lim (x→0+) (1−cos(√x)) / sin(3x) = ? A szög radián.', 1 / 6, '1−cos √x ~ x/2, sin(3x)~3x, a hányados 1/6.'),
    card(5, 'lim (x→0) ln(5x+1)/sin(2x) = ? A szög radián.', 2.5, 'ln(1+5x)~5x és sin(2x)~2x, a hányados 5/2 = 2,5.'),
    card(5, 'lim (x→0) (e^(3x)−1) / ln(2x+1) = ?', 1.5, 'e^(3x)−1 ~ 3x, ln(1+2x)~2x, a hányados 3/2 = 1,5.'),
    card(5, 'lim (x→0) ((4x+1)/(1−x))^(1/x) = ? Beírhatod e^k alakban is.', e ** 5, '(4x+1)/(1−x) = 1 + 5x/(1−x). A kitevő 1/x, a szorzat 5, ezért e⁵.'),
    card(5, 'lim (x→0) (1+2x²)^(1/x²) = ? Beírhatod e^k alakban is.', e ** 2, '(1+u)^(2/u) → e², ahol u = 2x².'),
    card(5, 'lim (x→∞) (2ˣ+3ˣ) / (3ˣ⁺¹+1) = ?', 1 / 3, 'A 3ˣ a főtag. A hányados (1)/(3) = 1/3.'),
    card(5, 'lim (x→∞) x³ · e^(−2x) = ?', 0, 'Az exponenciális csökkenés minden polinomnál erősebb, a szorzat 0.'),
    card(5, 'lim (x→∞) ln(x) / ∛x = ?', 0, 'A gyök minden logaritmusnál gyorsabban nő, a hányados 0.'),
    card(5, 'lim (x→0) x·sin(1/x) = ? A szög radián.', 0, '|x sin(1/x)| ≤ |x| → 0, rendőrelv.'),
    card(5, 'lim (x→0+) |x|/x = ?', 1, 'Pozitív x-re |x|/x = 1.'),
    card(5, 'lim (x→0−) |x|/x = ?', -1, 'Negatív x-re |x|/x = −1.'),
    card(5, 'lim (x→0) sin(x)/x = ? A szög radián.', 1, 'Ez a nevezetes határérték: sin x / x → 1.'),
    card(5, 'lim (x→0) (eˣ−1)/x = ?', 1, 'Az eˣ deriváltja a 0-ban 1, ezért a hányados 1.'),
    card(5, 'lim (x→0) ln(1+x)/x = ?', 1, 'A ln(1+x) deriváltja a 0-ban 1.'),
    card(5, 'lim (x→0) (1−cos x)/x² = ? A szög radián.', 0.5, '1−cos x ~ x²/2, osztva x²-tel a határérték 1/2.'),

    // 6. szint — egyoldali, szakadás, paraméter
    card(6, 'lim (x→2) (x²−x−2)/(x²+x−6) = ?', 0.6, '(x−2)(x+1)/((x−2)(x+3)) = (x+1)/(x+3). A 2-ben 3/5 = 0,6. A szakadás megszüntethető.'),
    card(6, 'f(x) = x²/|x|, ha x≠0, és f(0)=c. Mely c-re folytonos a 0-ban?', 0, 'x²/|x| = |x| → 0, ha x→0. A folytonossághoz c = 0.'),
    card(6, 'f(x) = a·sin(2x)/x, ha x<0; f(0)=c; f(x)=ln(1+3x)/x, ha x>0. Mely a-ra folytonos a 0-ban? A szög radián.', 1.5, 'Balról a határérték 2a, jobbról 3. Folytonosság: 2a = 3, tehát a = 3/2.'),
    card(6, 'Az előző függvénynél a = 3/2. Mely c-re folytonos a 0-ban?', 3, 'Mindkét egyoldali határérték 3, ezért c = 3.'),
    card(6, 'lim (x→0) (√(1+ax)−1)/sin(3x) = 2. Mennyi a? A szög radián.', 12, 'A számláló ~ ax/2, a nevező ~ 3x. (a/2)/3 = 2, tehát a = 12.'),
    missing(6, 'Létezik-e lim (x→0) |x|/x ? Ha nem, írd: nem létezik.', 'Balról −1, jobbról 1. A kétoldali határérték nem létezik.'),
    card(6, 'lim (x→1) (x²−1)/(x−1) = ?', 2, 'x+1, ha x≠1. Az 1-ben 2.'),
    card(6, 'f(x)=(x²−1)/(x−1), ha x≠1. Mely értékkel kell pótolni az 1-et, hogy a függvény ott folytonos legyen?', 2, 'A határérték 2, a megszüntethető szakadást f(1)=2 szünteti meg.'),
    missing(6, 'f(x)=0, ha x<0, és f(x)=1, ha x>0. Létezik-e a 0-beli kétoldali határérték? Ha nem, írd: nem létezik.', 'Balról 0, jobbról 1. Ugrása van, a kétoldali határérték nem létezik.'),
    inf(6, 'lim (x→0+) 1/x = ?', 1, 'Pozitív oldalon a reciprok +∞-hez tart.'),
    inf(6, 'lim (x→0−) 1/x = ?', -1, 'Negatív oldalon a reciprok −∞-hez tart.'),
    inf(6, 'lim (x→2−) 1/(x−2) = ?', -1, 'x−2 balról negatív és 0-hoz tart, a reciprok −∞.'),
    card(6, 'lim (x→0) (e^(ax)−1)/x = 4. Mennyi a?', 4, 'e^(ax)−1 ~ ax, osztva x-szel a határérték a. Ez 4, tehát a = 4.'),
    card(6, 'lim (x→0) sin(ax)/x = 6. Mennyi a? A szög radián.', 6, 'sin(ax)/x → a. A megadott határérték 6, tehát a = 6.'),
    card(6, 'lim (x→∞) (1+2/x)ˣ = ? Beírhatod e^k alakban is.', e ** 2, 'A nevezetes határérték szerint (1+2/x)ˣ → e².'),
    card(6, 'lim (x→0) (1+x)^(1/x) = ? Beírhatod e^k alakban is.', e, 'A nevezetes határérték: (1+x)^(1/x) → e.'),
    card(6, 'lim (x→0) sin(2x)/x = ? A szög radián.', 2, '2 · sin(2x)/(2x) → 2.'),
    card(6, 'lim (x→∞) (3x−1)/(x+4) = ?', 3, 'A főtagok hányadosa 3/1 = 3.'),
    card(6, 'lim (x→∞) (√(x²+x) − x) = ?', 0.5, 'Konjugálás: x / (√(x²+x)+x) → 1/2.'),
    card(6, 'lim (x→0) (tan x − sin x)/x³ = ? A szög radián.', 0.5, 'tan x − sin x = sin x(1−cos x)/cos x. Osztva x³-nal: (sin x / x)·((1−cos x)/x²)/cos x → 1·(1/2)/1 = 1/2.'),
];
