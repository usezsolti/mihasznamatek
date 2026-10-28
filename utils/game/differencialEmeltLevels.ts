import type { Question } from './types';

/**
 * Emelt érettségi — differenciálszámítás, 6×20.
 * A típusok a „Határérték és differenciálszámítás” feladatlapot követik:
 * polinom, szorzat, hányados, lánc, érintő, magasabb derivált, szélsőérték.
 * A kártya a derivált egy konkrét értékét kéri, a kidolgozás a teljes f'(x)-et is megadja.
 */

const e = Math.E;

function card(stage: number, question: string, answer: number, expression: string): Question {
    return {
        stage: stage as Question['stage'],
        question,
        answer,
        type: 'multiplication',
        expression,
    };
}

function yn(stage: number, question: string, answer: 0 | 1, expression: string): Question {
    return card(stage, `${question}\n(1 = igen, 0 = nem)`, answer, expression);
}

export const getDifferencialEmeltQuestions = (): Question[] => [
    // 1. szint — polinom deriváltja egy pontban
    card(1, 'f(x) = x². Add meg f\'(3) értékét!', 6, 'f\'(x) = 2x, ezért f\'(3) = 6.'),
    card(1, 'f(x) = x³. Add meg f\'(2) értékét!', 12, 'f\'(x) = 3x², ezért f\'(2) = 12.'),
    card(1, 'f(x) = x⁴. Add meg f\'(1) értékét!', 4, 'f\'(x) = 4x³, ezért f\'(1) = 4.'),
    card(1, 'f(x) = 5x³ − 2x. Add meg f\'(1) értékét!', 13, 'f\'(x) = 15x² − 2, ezért f\'(1) = 15 − 2 = 13.'),
    card(1, 'f(x) = x⁵ − 3x³ + 2x − 7. Add meg f\'(1) értékét!', -2, 'f\'(x) = 5x⁴ − 9x² + 2, ezért f\'(1) = 5 − 9 + 2 = −2.'),
    card(1, 'f(x) = x⁵ − 3x³ + 2x − 7. Add meg f\'(0) értékét!', 2, 'f\'(x) = 5x⁴ − 9x² + 2, ezért f\'(0) = 2.'),
    card(1, 'f(x) = 2x³ + x². Add meg f\'(1) értékét!', 8, 'f\'(x) = 6x² + 2x, ezért f\'(1) = 6 + 2 = 8.'),
    card(1, 'f(x) = (1/2)x⁴ − 3x². Add meg f\'(1) értékét!', -4, 'f\'(x) = 2x³ − 6x, ezért f\'(1) = 2 − 6 = −4.'),
    card(1, 'f(x) = x³ − 6x² + 9x. Add meg f\'(1) értékét!', 0, 'f\'(x) = 3x² − 12x + 9 = 3(x−1)(x−3), ezért f\'(1) = 0.'),
    card(1, 'f(x) = 4x³ − x. Add meg f\'(2) értékét!', 47, 'f\'(x) = 12x² − 1, ezért f\'(2) = 48 − 1 = 47.'),
    card(1, 'f(x) = −x² + 4x. Add meg f\'(1) értékét!', 2, 'f\'(x) = −2x + 4, ezért f\'(1) = 2.'),
    card(1, 'f(x) = x⁴ − 2x². Add meg f\'(1) értékét!', 0, 'f\'(x) = 4x³ − 4x, ezért f\'(1) = 4 − 4 = 0.'),
    card(1, 'f(x) = 3x² + 5. Add meg f\'(4) értékét!', 24, 'f\'(x) = 6x, ezért f\'(4) = 24.'),
    card(1, 'f(x) = x⁵. Add meg f\'(1) értékét!', 5, 'f\'(x) = 5x⁴, ezért f\'(1) = 5.'),
    card(1, 'f(x) = 2x⁴ − 8x. Add meg f\'(1) értékét!', 0, 'f\'(x) = 8x³ − 8, ezért f\'(1) = 8 − 8 = 0.'),
    card(1, 'f(x) = x³ + x. Add meg f\'(2) értékét!', 13, 'f\'(x) = 3x² + 1, ezért f\'(2) = 12 + 1 = 13.'),
    card(1, 'f(x) = 6x² − x³. Add meg f\'(2) értékét!', 12, 'f\'(x) = 12x − 3x², ezért f\'(2) = 24 − 12 = 12.'),
    card(1, 'f(x) = x² − 5x + 6. Add meg f\'(0) értékét!', -5, 'f\'(x) = 2x − 5, ezért f\'(0) = −5.'),
    card(1, 'f(x) = 10x. Add meg f\'(3) értékét!', 10, 'f\'(x) = 10, a derivált mindenütt 10.'),
    card(1, 'f(x) = x⁴ + x³. Add meg f\'(1) értékét!', 7, 'f\'(x) = 4x³ + 3x², ezért f\'(1) = 4 + 3 = 7.'),

    // 2. szint — szorzat, hányados, egyszerű lánc
    card(2, 'f(x) = x²eˣ. Add meg f\'(0) értékét!', 0, 'f\'(x) = eˣ(x²+2x). Az x=0 helyen 1·0 = 0.'),
    card(2, 'f(x) = xeˣ. Add meg f\'(0) értékét!', 1, 'f\'(x) = eˣ(x+1). Az x=0 helyen 1·1 = 1.'),
    card(2, 'f(x) = x ln x, x>0. Add meg f\'(e) értékét!', 2, 'f\'(x) = ln x + 1. Az x=e helyen 1+1 = 2.'),
    card(2, 'f(x) = ln x, x>0. Add meg f\'(e) értékét! Beírhatod 1/e alakban is.', 1 / e, 'f\'(x) = 1/x, ezért f\'(e) = 1/e.'),
    card(2, 'f(x) = x sin x. Add meg f\'(0) értékét! A szög radián.', 0, 'f\'(x) = sin x + x cos x. Az x=0 helyen 0+0 = 0.'),
    card(2, 'f(x) = x + 1/x, x≠0. Add meg f\'(1) értékét!', 0, 'f\'(x) = 1 − 1/x². Az x=1 helyen 1−1 = 0.'),
    card(2, 'f(x) = √x, x>0. Add meg f\'(4) értékét!', 0.25, 'f\'(x) = 1/(2√x). Az x=4 helyen 1/4.'),
    card(2, 'f(x) = 1/x, x≠0. Add meg f\'(1) értékét!', -1, 'f\'(x) = −1/x², ezért f\'(1) = −1.'),
    card(2, 'f(x) = e^(2x). Add meg f\'(0) értékét!', 2, 'f\'(x) = 2e^(2x), ezért f\'(0) = 2.'),
    card(2, 'f(x) = sin(2x). Add meg f\'(0) értékét! A szög radián.', 2, 'f\'(x) = 2 cos(2x), ezért f\'(0) = 2.'),
    card(2, 'f(x) = cos x. Add meg f\'(π/2) értékét! A szög radián.', -1, 'f\'(x) = −sin x, ezért f\'(π/2) = −1.'),
    card(2, 'f(x) = ln(x²+1). Add meg f\'(1) értékét!', 1, 'f\'(x) = 2x/(x²+1). Az x=1 helyen 2/2 = 1.'),
    card(2, 'f(x) = e^(x²). Add meg f\'(1) értékét! Beírhatod 2e alakban is.', 2 * e, 'f\'(x) = 2x e^(x²). Az x=1 helyen 2e.'),
    card(2, 'f(x) = x² ln x, x>0. Add meg f\'(e) értékét! Beírhatod 3e alakban is.', 3 * e, 'f\'(x) = 2x ln x + x. Az x=e helyen 2e·1 + e = 3e.'),
    card(2, 'f(x) = (x+1)/(x−1), x≠1. Add meg f\'(3) értékét!', -0.5, 'f\'(x) = −2/(x−1)². Az x=3 helyen −2/4 = −1/2.'),
    card(2, 'f(x) = sin x cos x. Add meg f\'(0) értékét! A szög radián.', 1, 'f\'(x) = cos(2x). Az x=0 helyen 1.'),
    card(2, 'f(x) = arctan x. Add meg f\'(1) értékét!', 0.5, 'f\'(x) = 1/(1+x²). Az x=1 helyen 1/2.'),
    card(2, 'f(x) = arcsin x. Add meg f\'(0) értékét!', 1, 'f\'(x) = 1/√(1−x²). Az x=0 helyen 1.'),
    card(2, 'f(x) = √(x²+1). Add meg f\'(0) értékét!', 0, 'f\'(x) = x/√(x²+1). Az x=0 helyen 0.'),
    card(2, 'f(x) = eˣ sin x. Add meg f\'(0) értékét! A szög radián.', 1, 'f\'(x) = eˣ(sin x + cos x). Az x=0 helyen 1·(0+1) = 1.'),

    // 3. szint — összetett lánc, hatvány, inverz trigonometria
    card(3, 'f(x) = e^(sin x). Add meg f\'(0) értékét! A szög radián.', 1, 'f\'(x) = e^(sin x)·cos x. Az x=0 helyen e⁰·1 = 1.'),
    card(3, 'f(x) = xˣ, x>0. Add meg f\'(1) értékét!', 1, 'xˣ = e^(x ln x), f\'(x) = xˣ(ln x+1). Az x=1 helyen 1·(0+1) = 1.'),
    card(3, 'f(x) = arcsin(2x), |x|<1/2. Add meg f\'(0) értékét!', 2, 'f\'(x) = 2/√(1−4x²). Az x=0 helyen 2.'),
    card(3, 'f(x) = arctan(3x). Add meg f\'(0) értékét!', 3, 'f\'(x) = 3/(1+9x²). Az x=0 helyen 3.'),
    card(3, 'f(x) = tan(2x). Add meg f\'(0) értékét! A szög radián.', 2, 'f\'(x) = 2/cos²(2x). Az x=0 helyen 2.'),
    card(3, 'f(x) = sin(x²). Add meg f\'(0) értékét! A szög radián.', 0, 'f\'(x) = 2x cos(x²). Az x=0 helyen 0.'),
    card(3, 'f(x) = cos(3x²). Add meg f\'(0) értékét! A szög radián.', 0, 'f\'(x) = −6x sin(3x²). Az x=0 helyen 0.'),
    card(3, 'f(x) = (3x²−1)⁵. Add meg f\'(1) értékét!', 480, 'f\'(x) = 30x(3x²−1)⁴. Az x=1 helyen 30·(2)⁴ = 30·16 = 480.'),
    card(3, 'f(x) = e^(x²). Add meg f\'(1) értékét! Beírhatod 2e alakban is.', 2 * e, 'f\'(x) = 2x e^(x²). Az x=1 helyen 2e.'),
    card(3, 'f(x) = sin(e^(x²)). Add meg f\'(0) értékét! A szög radián.', 0, 'f\'(x) = 2x e^(x²) cos(e^(x²)). Az x=0 helyen a 2x tényező 0.'),
    card(3, 'f(x) = (x+1)/(x−1), x≠1. Add meg f\'(0) értékét!', -2, 'f\'(x) = −2/(x−1)². Az x=0 helyen −2/1 = −2.'),
    card(3, 'f(x) = e^(2x) cos x. Add meg f\'(0) értékét! A szög radián.', 2, 'f\'(x) = 2e^(2x) cos x − e^(2x) sin x. Az x=0 helyen 2·1·1 − 0 = 2.'),
    card(3, 'f(x) = x²eˣ. Add meg f\'(1) értékét! Beírhatod 3e alakban is.', 3 * e, 'f\'(x) = eˣ(x²+2x). Az x=1 helyen e(1+2) = 3e.'),
    card(3, 'f(x) = 2ˣ. Add meg f\'(0) értékét! Beírhatod ln(2) alakban is.', Math.LN2, 'f\'(x) = 2ˣ ln 2. Az x=0 helyen ln 2.'),
    card(3, 'f(x) = x^(1/x), x>0. Add meg f\'(1) értékét!', 1, 'f(x) = e^(ln x / x), f\'(x) = f(x)·(1−ln x)/x². Az x=1 helyen 1·1 = 1.'),
    card(3, 'f(x) = ln(x²+1). Add meg f\'(0) értékét!', 0, 'f\'(x) = 2x/(x²+1). Az x=0 helyen 0.'),
    card(3, 'f(x) = arccos x. Add meg f\'(0) értékét!', -1, 'f\'(x) = −1/√(1−x²). Az x=0 helyen −1.'),
    card(3, 'f(x) = (x²+1)⁵. Add meg f\'(1) értékét!', 160, 'f\'(x) = 10x(x²+1)⁴. Az x=1 helyen 10·16 = 160.'),
    card(3, 'f(x) = e^(sin(ln(x²+1))). Add meg f\'(0) értékét!', 0, 'A láncban van egy 2x/(x²+1) tényező. Az x=0 helyen ez 0, ezért f\'(0) = 0.'),
    card(3, 'f(x) = √(x²+1). Add meg f\'(1) értékét! Két tizedesjegy is elég, vagy írd be 1/√2.', 1 / Math.sqrt(2), 'f\'(x) = x/√(x²+1). Az x=1 helyen 1/√2.'),

    // 4. szint — érintő meredeksége
    card(4, 'Az y = x² görbe érintőjének meredeksége az x=3 helyen?', 6, 'y\' = 2x, az x=3 helyen a meredekség 6.'),
    card(4, 'Az y = x² görbe érintőjének meredeksége az x=−1 helyen?', -2, 'y\' = 2x, az x=−1 helyen a meredekség −2.'),
    card(4, 'Az y = x³−3x görbe érintőjének meredeksége az x=1 helyen?', 0, 'y\' = 3x²−3. Az x=1 helyen 0, itt vízszintes az érintő.'),
    card(4, 'Az y = x³−3x görbe érintőjének meredeksége az x=0 helyen?', -3, 'y\' = 3x²−3. Az x=0 helyen −3.'),
    card(4, 'Az y = ln x görbe érintőjének meredeksége az x=e helyen? Beírhatod 1/e alakban is.', 1 / e, 'y\' = 1/x, az x=e helyen 1/e.'),
    card(4, 'Az y = eˣ görbe érintőjének meredeksége az x=0 helyen?', 1, 'y\' = eˣ, az x=0 helyen 1. Az érintő: y = x+1.'),
    card(4, 'Az y = sin x görbe érintőjének meredeksége az x=0 helyen? A szög radián.', 1, 'y\' = cos x, az x=0 helyen 1.'),
    card(4, 'Az y = sin x görbe érintőjének meredeksége az x=π/2 helyen? A szög radián.', 0, 'y\' = cos x, a π/2 helyen 0. Itt vízszintes az érintő.'),
    card(4, 'Az y = 1/x görbe érintőjének meredeksége az x=2 helyen?', -0.25, 'y\' = −1/x², az x=2 helyen −1/4.'),
    card(4, 'Az x²+xy+y² = 7 görbe érintőjének meredeksége a P(1; 2) pontban?', -0.8, 'Deriválás: 2x+y+xy\'+2yy\' = 0. Behelyettesítve 4+5y\' = 0, tehát y\' = −4/5.'),
    card(4, 'Az előző görbe P(1; 2) pontbeli érintője y = −(4/5)x + b. Mennyi b?', 2.8, 'A (1; 2) pont rajta van: 2 = −4/5 + b, tehát b = 14/5 = 2,8. Az érintő y = −(4/5)x + 14/5.'),
    card(4, 'Az y = x²+1 görbe érintőjének meredeksége az x=1 helyen?', 2, 'y\' = 2x, az x=1 helyen 2. Az érintő a (1; 2) ponton át y = 2x.'),
    card(4, 'Az y = x²+1 görbe x=1 helyen vett érintője y = 2x + c. Mennyi c?', 0, 'y−2 = 2(x−1), rendezve y = 2x. A tengelymetszet 0.'),
    card(4, 'Az y = x³ görbe érintőjének meredeksége az x=2 helyen?', 12, 'y\' = 3x², az x=2 helyen 12.'),
    card(4, 'Az y = √x görbe érintőjének meredeksége az x=4 helyen?', 0.25, 'y\' = 1/(2√x), az x=4 helyen 1/4.'),
    card(4, 'Az y = x⁴ görbe érintőjének meredeksége az x=−1 helyen?', -4, 'y\' = 4x³, az x=−1 helyen −4.'),
    card(4, 'Az y = e^(2x) görbe érintőjének meredeksége az x=0 helyen?', 2, 'y\' = 2e^(2x), az x=0 helyen 2.'),
    card(4, 'Az y = ln(x²+1) görbe érintőjének meredeksége az x=0 helyen?', 0, 'y\' = 2x/(x²+1), az x=0 helyen 0. Itt vízszintes az érintő.'),
    card(4, 'Az y = cos x görbe érintőjének meredeksége az x=0 helyen? A szög radián.', 0, 'y\' = −sin x, az x=0 helyen 0.'),
    card(4, 'Az x²+y² = 25 kör érintőjének meredeksége a (3; 4) pontban?', -0.75, '2x+2yy\' = 0, tehát y\' = −x/y. A (3; 4) pontban −3/4.'),

    // 5. szint — második és harmadik derivált
    card(5, 'f(x) = x² ln x, x>0. Add meg f\'\'(e) értékét!', 5, 'f\'(x) = 2x ln x + x, f\'\'(x) = 2 ln x + 3. Az x=e helyen 2+3 = 5.'),
    card(5, 'f(x) = e^(2x). Add meg f\'\'\'(0) értékét!', 8, 'Minden deriválás 2-vel szoroz: f\'\'\'(x) = 8e^(2x), ezért f\'\'\'(0) = 8.'),
    card(5, 'f(x) = x³−3x. Add meg f\'\'(1) értékét!', 6, 'f\'(x) = 3x²−3, f\'\'(x) = 6x, ezért f\'\'(1) = 6.'),
    card(5, 'f(x) = x³−3x. Add meg f\'\'(0) értékét!', 0, 'f\'\'(x) = 6x, ezért f\'\'(0) = 0.'),
    card(5, 'f(x) = sin x. Add meg f\'\'(0) értékét! A szög radián.', 0, 'f\'\'(x) = −sin x, ezért f\'\'(0) = 0.'),
    card(5, 'f(x) = sin x. Add meg f\'\'(π/2) értékét! A szög radián.', -1, 'f\'\'(x) = −sin x, a π/2 helyen −1.'),
    card(5, 'f(x) = cos x. Add meg f\'\'(0) értékét! A szög radián.', -1, 'f\'\'(x) = −cos x, az x=0 helyen −1.'),
    card(5, 'f(x) = eˣ. Add meg f\'\'(0) értékét!', 1, 'eˣ minden deriváltja önmaga, ezért f\'\'(0) = 1.'),
    card(5, 'f(x) = x⁴. Add meg f\'\'(1) értékét!', 12, 'f\'(x) = 4x³, f\'\'(x) = 12x², ezért f\'\'(1) = 12.'),
    card(5, 'f(x) = x⁴−4x². Add meg f\'\'(0) értékét!', -8, 'f\'(x) = 4x³−8x, f\'\'(x) = 12x²−8, ezért f\'\'(0) = −8.'),
    card(5, 'f(x) = x⁴−4x². Add meg f\'\'(1) értékét!', 4, 'f\'\'(x) = 12x²−8. Az x=1 helyen 12−8 = 4.'),
    card(5, 'f(x) = ln x, x>0. Add meg f\'\'(e) értékét! Beírhatod −1/e² alakban is.', -1 / (e * e), 'f\'(x) = 1/x, f\'\'(x) = −1/x². Az x=e helyen −1/e².'),
    card(5, 'f(x) = 1/x, x≠0. Add meg f\'\'(1) értékét!', 2, 'f\'(x) = −1/x², f\'\'(x) = 2/x³, ezért f\'\'(1) = 2.'),
    card(5, 'f(x) = xeˣ. Add meg f\'\'(0) értékét!', 2, 'f\'(x) = eˣ(x+1), f\'\'(x) = eˣ(x+2). Az x=0 helyen 2.'),
    card(5, 'f(x) = sin x. Add meg f\'\'\'(0) értékét! A szög radián.', -1, 'f\'\'\'(x) = −cos x, az x=0 helyen −1.'),
    card(5, 'f(x) = e^(3x). Add meg f\'\'(0) értékét!', 9, 'f\'(x) = 3e^(3x), f\'\'(x) = 9e^(3x), ezért f\'\'(0) = 9.'),
    card(5, 'f(x) = x⁵. Add meg f\'\'(1) értékét!', 20, 'f\'(x) = 5x⁴, f\'\'(x) = 20x³, ezért f\'\'(1) = 20.'),
    card(5, 'f(x) = ln(x²), x>0. Add meg f\'\'(1) értékét!', -2, 'ln(x²) = 2 ln x, f\'(x) = 2/x, f\'\'(x) = −2/x². Az x=1 helyen −2.'),
    card(5, 'f(x) = x³+x. Add meg f\'\'(2) értékét!', 12, 'f\'(x) = 3x²+1, f\'\'(x) = 6x, ezért f\'\'(2) = 12.'),
    card(5, 'f(x) = cos(2x). Add meg f\'\'(0) értékét! A szög radián.', -4, 'f\'(x) = −2 sin(2x), f\'\'(x) = −4 cos(2x). Az x=0 helyen −4.'),

    // 6. szint — monotonitás, szélsőérték, differenciálhatóság
    card(6, 'f(x) = x³−3x. Mennyi a lokális maximum értéke?', 2, 'f\'(x) = 3(x²−1). Nő (−∞,−1)-en, csökken (−1,1)-en. f(−1) = 2 a lokális maximum.'),
    card(6, 'f(x) = x³−3x. Mennyi a lokális minimum értéke?', -2, 'A derivált előjele (1,∞)-en pozitív, (−1,1)-en negatív. f(1) = −2 a lokális minimum.'),
    card(6, 'f(x) = x³−3x. Mely x-nél van a lokális maximum?', -1, 'f\'(x) = 3(x−1)(x+1). Az x=−1 előtt pozitív, utána negatív, itt maximum van.'),
    card(6, 'f(x) = x³−3x. Mely x-nél van a lokális minimum?', 1, 'Az x=1 előtt a derivált negatív, utána pozitív, itt minimum van.'),
    card(6, 'f(x) = x²−4x+7. Mennyi a minimum értéke?', 3, 'f\'(x) = 2x−4 = 0 az x=2 helyen. f(2) = 4−8+7 = 3.'),
    card(6, 'f(x) = x²−4x+7. Mely x-nél van a minimum?', 2, 'f\'(x) = 2x−4 = 0, tehát x = 2. A második derivált 2>0, ez minimum.'),
    card(6, 'f(x) = x⁴−4x². Mennyi a lokális maximum értéke?', 0, 'f\'(x) = 4x(x²−2). Az x=0 helyen előjelváltás + felől − felé? Előtte negatív, utána a (−√2,0)-n pozitív, (0,√2)-n negatív. f(0)=0 lokális maximum.'),
    card(6, 'f(x) = x⁴−4x². Mennyi egy lokális minimum értéke?', -4, 'A ±√2 helyeken f(±√2) = 4−8 = −4. Mindkettő lokális minimum.'),
    card(6, 'f(x) = x⁴−4x². Hány lokális minimumhelye van?', 2, 'A kritikus pontok 0 és ±√2. Minimum a két szélső, x = ±√2.'),
    card(6, 'f(x) = xe^(−x). Mely x-nél van a maximum?', 1, 'f\'(x) = e^(−x)(1−x). Az x=1 előtt pozitív, utána negatív, itt maximum van.'),
    card(6, 'f(x) = xe^(−x). Mennyi a maximum értéke? Beírhatod 1/e alakban is.', 1 / e, 'A maximum az x=1 helyen van, f(1) = e⁻¹ = 1/e.'),
    card(6, 'f(x) = ax+b, ha x<1, és f(x)=x², ha x≥1. Mely a-ra differenciálható az 1-ben?', 2, 'Folytonosság: a+b = 1. A bal derivált a, a jobb 2. Tehát a = 2, és ebből b = −1.'),
    card(6, 'Az előző függvénynél a differenciálhatósághoz a = 2. Mennyi b?', -1, 'A folytonosság a+b = 1. Ha a = 2, akkor b = −1.'),
    yn(6, 'Az f(x) = x³ függvénynek van lokális szélsőértéke?', 0, 'f\'(x) = 3x² ≥ 0, csak az x=0-ban nulla, és ott nem vált előjelet. Inflexiós pont, nincs szélsőérték.'),
    card(6, 'f(x) = −x²+4. Mennyi a maximum értéke?', 4, 'f\'(x) = −2x = 0 az x=0 helyen. f(0) = 4, és a parabola lefelé nyílik.'),
    card(6, 'f(x) = x+1/x, x>0. Mennyi a minimum értéke?', 2, 'f\'(x) = 1−1/x² = 0 az x=1 helyen. f(1) = 2.'),
    card(6, 'f(x) = x+1/x, x>0. Mely x-nél van a minimum?', 1, '1−1/x² = 0, x>0 miatt x = 1. Előtte negatív, utána pozitív a derivált.'),
    card(6, 'f(x) = x³−3x. Hány nyílt intervallumon szigorúan növő? Csak a darabok számát add meg.', 2, 'Nő (−∞,−1)-en és (1,∞)-en. Ez két nyílt intervallum. Közöttük, (−1,1)-en csökken.'),
    card(6, 'f(x) = (x−1)²+3. Mennyi a minimum értéke?', 3, 'A négyzet az x=1 helyen 0, a függvény ott 3. Máshol nagyobb.'),
    card(6, 'f(x) = x⁴−4x². Hány helyen nulla a derivált?', 3, 'f\'(x) = 4x(x²−2) = 0, ha x = 0 vagy x = ±√2. Ez három gyök.'),
];
