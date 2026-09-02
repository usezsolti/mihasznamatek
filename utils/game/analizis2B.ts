import type { LaRow as A2Row } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: A2Row[], make: (i: number) => A2Row): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Szélsőérték */
export function a2Szelso(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Lokális max: van környezet, ahol f(x)≤f(x0)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Stacionárius pont: f'(x0)=0?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `f(x)=x², lokális min x=?`, 0, '0'];
        return [1, `f(x)=x², min érték?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Második deriváltas teszt: f''>0 ⇒ lokális min?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`f''<0 ⇒ lokális max?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `f(x)=−x², f''(0)=?`, -2, '−2'];
        return [2, `f(x)=x³, f'(0)=f''(0)=0, van-e lokális szélsőérték 0-ban? (1=igen)`, 0, 'inflexió'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Weierstrass: folytonos [a,b]-n felveszi max/min?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `f(x)=x [0,1], abszolút max értéke?`, 1, '1'];
        if (i % 4 === 2) return [3, `f(x)=x [0,1], abszolút min értéke?`, 0, '0'];
        return [3, yn(`Nyílt intervallumon nem mindig van abszolút max?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `f(x)=x³−3x, f'=3x²−3=0, x=±1. f(1)=?`, -2, '1−3=−2'];
        if (i % 4 === 1) return [4, `Ugyanezen f(−1)=?`, 2, '−1+3=2'];
        if (i % 4 === 2) return [4, yn(`Első deriváltas teszt: −-ból +-ba min?`), 1, 'igen'];
        return [4, yn(`Kritikus pont: f'=0 vagy f' nem létezik?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `f=|x|, kritikus pont x=?`, 0, 'nem diff'];
        if (i % 4 === 1) return [5, `f=|x|, abszolút min értéke?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Globális max = abszolút maximum?`), 1, 'igen'];
        return [5, `f(x)=sin x, max értéke ℝ-en?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`f''=0-nál a 2. teszt nem dönt?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `f=e^x, van lokális min ℝ-en? (1=igen)`, 0, 'nincs'];
        if (i % 5 === 2) return [6, `f(x)=x^4, f''(0)=0, mégis min? (1=igen)`, 1, 'igen'];
        if (i % 5 === 3) return [6, `f(x)=1−x² [−1,1], max?`, 1, '1'];
        return [6, yn(`Zárt korlátos intervallumon a szélsőérték a kritikus pontok vagy a végek?`), 1, 'igen'];
    });
    return out;
}

/** Konvexitás és konkávitás */
export function a2Konvex(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`f''>0 ⇒ f konvex (szigorúan, ha >0)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`f''<0 ⇒ f konkáv?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `f(x)=x², f''=?`, 2, '2'];
        return [1, yn(`x² konvex ℝ-en?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `f(x)=−x², konkáv? (1=igen)`, 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Inflexió: konvexitásváltás?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `f(x)=x³, inflexió x=?`, 0, 'f"=6x'];
        return [2, `f(x)=e^x, f''>0? (1=igen)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Konvex: a grafikon az érintő felett van?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `f=ln x, f''<0 (0,∞)? (1=igen)`, 1, 'konkáv'];
        if (i % 4 === 2) return [3, `f=sin x (0,π), f''=−sin<0, konkáv? (1=igen)`, 1, 'igen'];
        return [3, yn(`Jensen: konvexre f((x+y)/2)≤(f(x)+f(y))/2?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `f=1/x (0,∞), f''=2/x³>0, konvex? (1=igen)`, 1, 'igen'];
        if (i % 4 === 1) return [4, `f=x^4, f''(0)=0, mégis konvex? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Inflexióhoz f''=0 nem elégséges (x^4)?`), 1, 'igen'];
        return [4, `f=cos x, f''(0)=?`, -1, '−1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Konvex függvény lokális minje globális (nyílt konvex halmazon)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `f=|x|, konvex? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [5, `f=x³, konvex (0,∞)-n? (1=igen)`, 1, 'f">0'];
        return [5, `f=x³, konkáv (−∞,0)-n? (1=igen)`, 1, 'f"<0'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Második derivált előjele a konvexitást adja?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `f=e^{-x²} inflexió? van (1=igen)`, 1, 'igen'];
        if (i % 5 === 2) return [6, `f=ax+b, f''=0, konvex és konkáv? (1=igen gyengén)`, 1, 'igen'];
        if (i % 5 === 3) return [6, `f=−ln x (0,∞) konvex? (1=igen)`, 1, 'igen'];
        return [6, yn(`Grafikon rajzolásánál inflexió töréspont a görbületben?`), 1, 'igen'];
    });
    return out;
}

/** L'Hospital-szabály */
export function a2Lhospital(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `lim_{x→0} (sin x)/x = ?`, 1, '1'];
        if (i % 4 === 1) return [1, yn(`0/0 alakra L'Hospital alkalmazható (feltételekkel)?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`∞/∞ alakra is?`), 1, 'igen'];
        return [1, `lim_{x→0} (e^x−1)/x = ?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `lim_{x→∞} x/e^x = ?`, 0, '0'];
        if (i % 4 === 1) return [2, `lim_{x→0} (1−cos x)/x² = ?`, 0.5, '1/2'];
        if (i % 4 === 2) return [2, yn(`L'Hospital: lim f'/g', ha létezik?`), 1, 'igen'];
        return [2, `lim_{x→0} tan x / x = ?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `lim_{x→∞} (ln x)/x = ?`, 0, '0'];
        if (i % 4 === 1) return [3, `lim_{x→0+} x ln x = ?`, 0, '0'];
        if (i % 4 === 2) return [3, yn(`∞−∞ alakot 0/0-ra lehet hozni?`), 1, 'igen'];
        return [3, `lim_{x→0} (x−sin x)/x³ , klasszikus 1/6≈0.167`, 0.167, '1/6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`L'Hospital ismételhető, ha megint 0/0?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `lim_{x→∞} (x²)/(e^x) = ?`, 0, '0'];
        if (i % 4 === 2) return [4, yn(`Ha lim f'/g' nem létezik, L'H nem dönt?`), 1, 'igen'];
        return [4, `lim_{x→1} (x²−1)/(x−1) = ?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `lim_{x→0} (a^x−1)/x = ln a, a=e ⇒ ?`, 1, '1'];
        if (i % 4 === 1) return [5, yn(`1^∞ alak logaritmussal hozható L'H-ra?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `lim_{x→0} sin(3x)/x = ?`, 3, '3'];
        return [5, `lim_{x→∞} (1+1/x)^x = e ≈ 2.718`, 2.718, 'e'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`L'Hospital feltétele: f,g diff, g'≠0, 0/0 vagy ∞/∞?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `lim_{x→0} (cos x−1)/x = ?`, 0, '0'];
        if (i % 5 === 2) return [6, `lim_{x→∞} n/2^n típus: lim x/2^x = ?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Ellenpélda: L'H lim f'/g' ≠ lim f/g ha feltételek sérülnek?`), 1, 'igen'];
        return [6, `lim_{x→0} arcsin x / x = ?`, 1, '1'];
    });
    return out;
}

/** Aszimptoták */
export function a2Aszimptota(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Függőleges aszimptota: |f|→∞ x→a-nál?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`1/x-nek függőleges aszimptotája x=0?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Vízszintes: f(x)→L x→±∞?`), 1, 'igen'];
        return [1, `lim_{x→∞} 1/x = ?`, 0, 'y=0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`e^{-x} x→∞ vízszintes y=0?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `arctg x → π/2 x→∞, π/2≈1.571`, 1.571, 'π/2'];
        if (i % 4 === 2) return [2, yn(`Ferde: y=mx+b, m=lim f/x, b=lim(f−mx)?`), 1, 'igen'];
        return [2, `(x²+1)/x ferde meredeksége m=?`, 1, 'x+1/x'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `(x²+1)/x , b=lim(f−x)=lim 1/x=?`, 0, 'y=x'];
        if (i % 4 === 1) return [3, yn(`tg x-nek függőleges aszimptotái π/2+kπ?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `lim_{x→∞} (2x+1)/(x+3) = ?`, 2, 'y=2'];
        return [3, `ln x x→0+ ? −∞ (1=igen függőleges viselkedés)?`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Polinomnak n≥1 nincs vízszintes aszimptotája?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `√(x²+1) ferde meredekség x→∞?`, 1, '1'];
        if (i % 4 === 2) return [4, yn(`Függőleges aszimptota nem a függvényérték?`), 1, 'nem értelmezett / ∞'];
        return [4, `1/(x−2) pólus x=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `lim_{x→∞} e^x / x ? ∞ (kérdés: véges vízszintes? 0=nincs)`, 0, 'nincs véges L'];
        if (i % 4 === 1) return [5, yn(`Ferde és vízszintes egyszerre x→∞-ben nem?`), 1, 'm=0 a vízszintes'];
        if (i % 4 === 2) return [5, `f(x)=(3x²)/(x²+1), vízszintes?`, 3, '3'];
        return [5, yn(`Aszimptota a teljes függvényvizsgálat része?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `lim_{x→−∞} e^x = ?`, 0, '0'];
        if (i % 5 === 1) return [6, yn(`Oblique = ferde aszimptota?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `f=x+1/x, m=?`, 1, '1'];
        if (i % 5 === 3) return [6, `lim_{x→∞} arctg x + arctg(−x) = ?`, 0, 'π/2−π/2'];
        return [6, yn(`Racionális tört: fok(számláló)=fok(nevező)+1 ⇒ ferde?`), 1, 'igen'];
    });
    return out;
}

/** Teljes függvényvizsgálat */
export function a2Vizsgalat(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Első lépés: értelmezési tartomány?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `√(x−1) tartománya: infimum (bal vég) ?`, 1, 'x≥1'];
        if (i % 4 === 2) return [1, `1/x zérushelyeinek száma?`, 0, 'nincs'];
        return [1, `x²−1 zérushelyeinek száma?`, 2, '±1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Paritás: f(−x)=f(x) páros?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`x² páros?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`x³ páratlan?`), 1, 'igen'];
        return [2, yn(`e^x se nem páros se nem páratlan?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Határértékek a tartomány szélén kellenek?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `f=1/(x²+1), max értéke?`, 1, '1'];
        if (i % 4 === 2) return [3, `f=x², globális min?`, 0, '0'];
        return [3, yn(`Monotonitás + szélsőérték + konvexitás a vizsgálatban?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Grafikon a vizsgálat utolsó lépése?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `f=sin x periódusa (2π≈6.283), 2π három tizedes?`, 6.283, '2π'];
        if (i % 4 === 2) return [4, `ln x zérushelye?`, 1, 'x=1'];
        return [4, yn(`Aszimptoták a vázlat részei?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `f=(x−1)(x−2), zérusok száma?`, 2, '2'];
        if (i % 4 === 1) return [5, `f=e^x, f(0)=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Inflexió bejelölendő a grafikonon?`), 1, 'igen'];
        return [5, `f=|x−1|, töréspont x=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Teljes vizsgálat: D_f, paritás, lim, aszimptota, f', f'', grafikon?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `f=x^3−3x, lokális max értéke f(−1)=?`, 2, '2'];
        if (i % 5 === 2) return [6, `√x D_f bal széle?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Periodikus függvénynél elég egy periódus?`), 1, 'igen'];
        return [6, `f=1/x², f>0 mindenütt a D_f-en? (1=igen)`, 1, 'igen'];
    });
    return out;
}

/** Taylor-polinom */
export function a2Taylor(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `e^x Maclaurin T0(x)=? (konstans)`, 1, '1'];
        if (i % 4 === 1) return [1, `e^x T1(0)=?`, 1, '1'];
        if (i % 4 === 2) return [1, `e^x T1(1)=1+1=?`, 2, '2'];
        return [1, yn(`Maclaurin = Taylor a=0 körül?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `sin x T1(x)=x, T1(0)=?`, 0, '0'];
        if (i % 4 === 1) return [2, `cos x T2(0)=1−0=?`, 1, '1'];
        if (i % 4 === 2) return [2, `cos x T2(0) a  x²/2 tag nélkül a konstans?`, 1, '1'];
        return [2, yn(`T_n f-et közelít a körül?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `f(x)=1/(1−x), T1(0)=1+x, T1(0)=?`, 1, '1'];
        if (i % 4 === 1) return [3, `ln(1+x) T1(x)=x, T1(0)=?`, 0, '0'];
        if (i % 4 === 2) return [3, yn(`Lagrange-maradék: f^{(n+1)}(ξ)(x−a)^{n+1}/(n+1)! ?`), 1, 'igen'];
        return [3, `(1+x)^α T0=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `sin x T3(0)=0−0+0=? (páratlan, T3(0)=0)`, 0, '0'];
        if (i % 4 === 1) return [4, `e^x T2(0)=1+0+0=?`, 1, '1'];
        if (i % 4 === 2) return [4, `x^3 Taylorja önmaga, T3(2) ha a=0: 8? x=2`, 8, '8'];
        return [4, yn(`Polinom Taylorja elég nagy n-re önmaga?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `f=e^x, T_n együttható 1/k!, k=2: 1/2=?`, 0.5, '0,5'];
        if (i % 4 === 1) return [5, `cos T2(x)=1−x²/2, x=0 érték?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Maradéktag →0 ⇒ Taylor-sor előállítja f-et?`), 1, 'igen'];
        return [5, `arctan x T1(x)=x, x=0?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `√(1+x) T1(x)=1+x/2, T1(0)=?`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Taylor a deriváltakból épül?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `f=x², a=1, T1(x)=1+2(x−1), T1(1)=?`, 1, '1'];
        if (i % 5 === 3) return [6, `e^x T2(1)=1+1+1/2=?`, 2.5, '2,5'];
        return [6, yn(`Közelítés hibája a maradéktag?`), 1, 'igen'];
    });
    return out;
}
