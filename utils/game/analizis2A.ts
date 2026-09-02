import type { LaRow as A2Row } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: A2Row[], make: (i: number) => A2Row): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Differenciálhatóság */
export function a2Diffhat(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        const x = i + 3;
        if (i % 4 === 0) return [1, `Mennyi (x²)' értéke x=${x}-nál?`, 2 * x, `2x=${2 * x}`];
        if (i % 4 === 1) return [1, `Mennyi (x³)' értéke x=1-nél?`, 3, '3x², x=1'];
        if (i % 4 === 2) return [1, yn(`Ha f differenciálható x0-ban, akkor folytonos is ott?`), 1, 'igen'];
        return [1, yn(`Az érintő meredeksége f'(x0)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        const h = i + 1;
        if (i % 4 === 0) return [2, `f(x)=x², [f(1+h)−f(1)]/h h=1-re?`, 3, '(4−1)/1=3'];
        if (i % 4 === 1) return [2, `f(x)=3x, f'(0)=?`, 3, '3'];
        if (i % 4 === 2) return [2, yn(`A konstans függvény deriváltja 0?`), 1, 'igen'];
        return [2, yn(`|x| differenciálható x=0-ban?`), 0, 'nem'];
        void h;
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `f(x)=x, f'(5)=?`, 1, '1'];
        if (i % 4 === 1) return [3, yn(`Differenciálhatóság erősebb, mint a folytonosság?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `Bal és jobb derivált x=0-ban |x|-nél: egyenlők? (1=igen)`, 0, '−1 és +1'];
        return [3, `f(x)=7, f'(2)=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`A derivált a különbségihányados határértéke?`), 1, 'definíció'];
        if (i % 4 === 1) return [4, `f(x)=2x+1, f'(10)=?`, 2, '2'];
        if (i % 4 === 2) return [4, yn(`Ha f' létezik egy intervallumon, f folytonos ott?`), 1, 'igen'];
        return [4, `√x deriváltja x=4-nél?`, 0.25, '1/(2√x)=1/4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Weierstrass sehol sem differenciálható folytonos példa létezik?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `f(x)=x², f'(−2)=?`, -4, '−4'];
        if (i % 4 === 2) return [5, yn(`Egyoldali deriváltak egyenlősége kell a deriválthoz?`), 1, 'igen'];
        return [5, `1/x deriváltja x=1-nél?`, -1, '−1/x²'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Ha f' korlátos [a,b]-n, f Lipschitz?`), 1, 'MVT'];
        if (i % 5 === 1) return [6, `f(x)=x^4, f'(1)=?`, 4, '4x³'];
        if (i % 5 === 2) return [6, yn(`A derivált mindig folytonos, ha létezik?`), 0, 'pl. x²sin(1/x)'];
        if (i % 5 === 3) return [6, `f(x)=−x, f'(0)=?`, -1, '−1'];
        return [6, yn(`Geometriai jelentés: érintő meredekség?`), 1, 'igen'];
    });
    return out;
}

/** Deriválási szabályok */
export function a2Szabalyok(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        const a = i + 2;
        if (i % 4 === 0) return [1, `(${a}x + x²)' x=1-nél?`, a + 2, `${a}+2x`];
        if (i % 4 === 1) return [1, `(3f)' = 3 f'? (1=igen)`, 1, 'konstansszoros'];
        if (i % 4 === 2) return [1, `(f+g)' = f'+g'? (1=igen)`, 1, 'összeg'];
        return [1, `(x−x)' x=5-nél?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `(x·x)' x=4-nél?`, 8, 'szorzat: 1·x+x·1=2x'];
        if (i % 4 === 1) return [2, yn(`(fg)' = f'g + fg'?`), 1, 'szorzatszabály'];
        if (i % 4 === 2) return [2, `(x / x)' x=2-nél (x≠0)?`, 0, '1 deriváltja'];
        return [2, yn(`(f/g)' = (f'g−fg')/g²?`), 1, 'hányados'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Láncszabály: (f∘g)' = (f'∘g)·g'?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `( (2x)² )' x=1-nél?`, 8, '2·(2x)·2=8x'];
        if (i % 4 === 2) return [3, `(sin(3x))' x=0-nál?`, 3, '3 cos(3x)'];
        return [3, `(e^{2x})' x=0-nál?`, 2, '2e^{2x}'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `(x³+x)' x=1-nél?`, 4, '3+1'];
        if (i % 4 === 1) return [4, `(5x²)' x=2-nél?`, 20, '10x'];
        if (i % 4 === 2) return [4, yn(`Különbség: (f−g)'=f'−g'?`), 1, 'igen'];
        return [4, `(1/x²)' x=1-nél?`, -2, '−2/x³'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `(x sin x)' x=0-nál?`, 1, 'sin+x cos, x=0 ⇒ 1'];
        if (i % 4 === 1) return [5, `(tan x)' x=0-nál?`, 1, '1/cos²'];
        if (i % 4 === 2) return [5, yn(`Inverz függvény deriváltja 1/f'(f^{-1})?`), 1, 'igen'];
        return [5, `(ln(2x))' x=1-nél?`, 1, '1/x'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `(x^x nem elemi szabály egyedül; (e^{x ln x})') x=1-nél?`, 1, 'x^x(ln x+1), x=1 ⇒ 1'];
        if (i % 5 === 1) return [6, `(f/g) ha f=g=x, derivált x=3-nál?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Összetett függvényhez láncszabály kell?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `(2x+3)⁵ deriváltja x=0-nál?`, 810, '5·3⁴·2=810'];
        return [6, `(√(4x))' x=1-nél?`, 1, '2√x deriváltja 1/√x'];
    });
    return out;
}

/** Elemi függvények deriváltjai */
export function a2ElemiDer(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        const n = i + 2;
        if (i % 4 === 0) return [1, `(x^${n})' x=1-nél?`, n, `${n}x^{${n - 1}}`];
        if (i % 4 === 1) return [1, `(e^x)' x=0-nál?`, 1, 'e^x'];
        if (i % 4 === 2) return [1, `(ln x)' x=1-nél?`, 1, '1/x'];
        return [1, `(sin x)' x=0-nál?`, 1, 'cos 0=1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `(cos x)' x=0-nál?`, 0, '−sin 0=0'];
        if (i % 4 === 1) return [2, `(a^x)' a=e, x=0?`, 1, 'e^x ln e'];
        if (i % 4 === 2) return [2, `(log_{10} x)' helyett (ln x / ln 10)' x=1: 1/ln 10 ≈ 0.434? három tizedes`, 0.434, '1/(x ln 10)'];
        return [2, `(tan x)' x=0?`, 1, 'sec²'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `(arcsin x)' x=0?`, 1, '1/√(1−x²)'];
        if (i % 4 === 1) return [3, `(arccos x)' x=0?`, -1, '−1/√(1−x²)'];
        if (i % 4 === 2) return [3, `(arctg x)' x=0?`, 1, '1/(1+x²)'];
        return [3, `(sinh x)' x=0?`, 1, 'cosh 0=1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `(cos x)' x=π/2, −sin(π/2)=?`, -1, '−1'];
        if (i % 4 === 1) return [4, `(e^{x})' x=1, e három tizedesjegyre?`, 2.718, 'e'];
        if (i % 4 === 2) return [4, `(1/x)' x=2?`, -0.25, '−1/4'];
        return [4, `(√x)' x=9, három tizedesjegyre?`, 0.167, '1/6≈0,167'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `(x^{-1})' x=1?`, -1, '−x^{-2}'];
        if (i % 4 === 1) return [5, `(2^x)' x=0?  ln 2 ≈ 0.693`, 0.693, '2^x ln 2'];
        if (i % 4 === 2) return [5, `(ctg x)' x=π/4: −1/sin²(π/4)=−2`, -2, '−2'];
        return [5, `(cosh x)' x=0?`, 0, 'sinh 0=0'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `(sin x)' x=π, cos π=?`, -1, '−1'];
        if (i % 5 === 1) return [6, `(ln x)' x=e, három tizedesjegyre (1/e)?`, 0.368, '1/e≈0,368'];
        if (i % 5 === 2) return [6, yn(`(sin x)' = cos x?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `(x^{1/3})' x=8, három tizedes (1/12)?`, 0.083, '1/12'];
        return [6, `(cos x)' x=π?`, 0, '−sin π=0'];
    });
    return out;
}

/** Magasabb rendű deriváltak */
export function a2Magasabb(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `f(x)=x², f''(x)=?`, 2, '2'];
        if (i % 4 === 1) return [1, `f(x)=x³, f''(1)=?`, 6, '6x'];
        if (i % 4 === 2) return [1, yn(`f'' a derivált deriváltja?`), 1, 'igen'];
        return [1, `f(x)=e^x, f''(0)=?`, 1, 'e^x'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `f(x)=sin x, f''(0)=?`, 0, '−sin 0'];
        if (i % 4 === 1) return [2, `f(x)=sin x, f''(π/2), −sin(π/2)=?`, -1, '−1'];
        if (i % 4 === 2) return [2, `f(x)=5x+1, f''=?`, 0, '0'];
        return [2, `f(x)=x^4, f''(1)=?`, 12, '12x²'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `f(x)=x^n, n=3, f'''=? konstans`, 6, '6'];
        if (i % 4 === 1) return [3, yn(`C^(n) n-szer folytonosan deriválható?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `f=cos x, f''(0)=?`, -1, '−cos 0'];
        return [3, `f=ln x, f''(1)=?`, -1, '−1/x²'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `f=e^{2x}, f''(0)=?`, 4, '4e^{2x}'];
        if (i % 4 === 1) return [4, `Leibniz (fg)^{(n)} összeg? (1=igen van képlet)`, 1, 'igen'];
        if (i % 4 === 2) return [4, `f=x^5, f^{(5)}=?`, 120, '5!'];
        return [4, `f=x^5, f^{(6)}=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `f=sin x, f^{(4)}(0)=?`, 1, 'sin'];
        if (i % 4 === 1) return [5, `f=cos x, f^{(4)}(0)=?`, 1, 'cos'];
        if (i % 4 === 2) return [5, yn(`Polinom n-edfokú n+1. deriváltja 0?`), 1, 'igen'];
        return [5, `f=1/x, f''(1)=?`, 2, '2/x³'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `f=x² sin x típus; f=x², f'''=?`, 0, '0'];
        if (i % 5 === 1) return [6, yn(`Taylor-hoz magasabb deriváltak kellenek?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `f=e^x, f^{(n)}(0)=?`, 1, '1'];
        if (i % 5 === 3) return [6, `f=ax+b, f''=?`, 0, '0'];
        return [6, `f=x^4, f^{(4)}=?`, 24, '24'];
    });
    return out;
}

/** Középértéktételek */
export function a2Mvt(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Rolle: f(a)=f(b) ⇒ van c, f'(c)=0? (folytonos, diff (a,b))`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Lagrange MVT: van c, f'(c)=(f(b)−f(a))/(b−a)?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `f(x)=x² [0,2], (f(2)−f(0))/2=?`, 2, '4/2=2, c=1'];
        return [1, `Ugyanezen f-re c, ahol f'(c)=2: c=?`, 1, '2c=2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Cauchy MVT: f'/g' = (f(b)−f(a))/(g(b)−g(a))?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `f(x)=x [1,3], MVT c, f'=1 mindig. c lehet 2? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Rolle a Lagrange speciális esete f(a)=f(b)-re?`), 1, 'igen'];
        return [2, `f=konstans, f' mindenütt?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Ha f'=0 (a,b)-n, f konstans?`), 1, 'MVT'];
        if (i % 4 === 1) return [3, yn(`Ha f'>0, f szigorúan nő?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `f(x)=x³ [−1,1], Rolle: f(−1)=f(1)=−1? f(1)=1, nem. f(−1)+1=0, f(1)−1=0. f(−1)=?`, -1, '−1'];
        return [3, yn(`MVT-hez kell folytonosság [a,b]-n és diff (a,b)-n?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `f(x)=e^x [0,1], (e−1)/1, e≈2.718, e−1≈1.718. f'(c)=e^c. Nem kérünk c-t. (f(1)−f(0))/(1−0) három tizedes?`, 1.718, 'e−1'];
        if (i % 4 === 1) return [4, yn(`Darboux: derivált Darboux-tulajdonságú?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `f(x)=x²−x, f(0)=f(1)=0, Rolle c=1/2, f'(1/2)=?`, 0, '0'];
        return [4, yn(`Cauchy MVT-ben g'≠0 a (a,b)-n?`), 1, 'feltétel'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`f'=g' ⇒ f−g konstans?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `f(x)=sin x [0,π], f(0)=f(π)=0, van c f'=0? (1=igen)`, 1, 'π/2'];
        if (i % 4 === 2) return [5, `sin'(π/2)=?`, 0, '0'];
        return [5, yn(`Lagrange-ból következik a konstans tétel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`MVT diszkrét különbségihányadost középértékkel köt?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `f(x)=x³ [0,1], (1−0)/1=1, f'(c)=3c²=1, c=1/√3≈0.577. 3c²=? cél 1. mennyi 3*(1/3)?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Rolle nem teljesül, ha f nem diff egy ponton (a,b)-n?`), 1, 'ellenpélda |x|'];
        if (i % 5 === 3) return [6, `f=2x [0,5], MVT meredekség?`, 2, '2'];
        return [6, yn(`Cauchy MVT a L'Hospital bizonyításában szerepel?`), 1, 'igen'];
    });
    return out;
}

/** Monotonitás */
export function a2Monoton(): A2Row[] {
    const out: A2Row[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`f'>0 ⇒ f szigorúan monoton nő?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`f'<0 ⇒ f szigorúan monoton csökken?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `f(x)=x³, f'(0)=0, mégis szigorúan nő? (1=igen)`, 1, 'igen'];
        return [1, yn(`f'≥0 ⇒ f monoton nő (nem feltétlen szigorúan)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `f(x)=x², f' előjele x>0-n pozitív? (1=igen)`, 1, '2x>0'];
        if (i % 4 === 1) return [2, `f(x)=x² csökkenő (−∞,0]-on? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [2, `f(x)=e^x, f'>0 mindenütt? (1=igen)`, 1, 'igen'];
        return [2, `f(x)=−x, f'=?`, -1, '−1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Stacionárius pont: f'=0?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `f(x)=x³−x, f'=3x²−1=0, x=±1/√3. hány stacionárius?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Első deriváltas teszt: előjelváltás szélsőérték?`), 1, 'igen'];
        return [3, `f=ln x, f'>0 (0,∞)-n? (1=igen)`, 1, '1/x>0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `f(x)=1/x, f'<0 (0,∞)-n? (1=igen)`, 1, '−1/x²'];
        if (i % 4 === 1) return [4, yn(`Konstans f'=0 és monoton nő is csökken is gyengén?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `f(x)=arctan x, f'>0? (1=igen)`, 1, '1/(1+x²)'];
        return [4, `f(x)=cos x, (0,π)-n csökkenő? (1=igen)`, 1, '−sin<0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`f'≥0 és f' nem azonosan 0 intervallumon ⇒ szigorú növekedés nem mindig (sima plató)?`), 1, 'plató'];
        if (i % 4 === 1) return [5, `f(x)=x+|x|, x>0-n f'=?`, 2, '2'];
        if (i % 4 === 2) return [5, `Növekedési intervallum x²-re? [0,∞) (1=igen)`, 1, 'igen'];
        return [5, yn(`Monotonitás a derivált előjeléből olvasható?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `f(x)=e^{-x}, f'<0? (1=igen)`, 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Szigorú növekedéshez elég f'≥0 és f' nem 0 egyetlen pontban sem egy egész íven?`), 1, 'általában'];
        if (i % 5 === 2) return [6, `f=x^3, hány pontban f'=0?`, 1, 'x=0'];
        if (i % 5 === 3) return [6, `f=sin x [0,π/2] nő? (1=igen)`, 1, 'igen'];
        return [6, yn(`Csökkenő függvény deriváltja ≤0 ahol létezik?`), 1, 'igen'];
    });
    return out;
}
