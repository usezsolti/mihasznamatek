import type { LaRow as DeRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DeRow[], make: (i: number) => DeRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Laplace-transzformáció */
export function de4Laplace(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`L{f}(s)=∫_0^∞ e^{-st} f(t) dt?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `L{1}=1/s, s=1-nél?`, 1, '1'];
        if (i % 4 === 2) return [1, yn(`Lineáris transzformáció?`), 1, 'igen'];
        return [1, `L{e^{at}}=1/(s-a), a=0, s=2, érték?`, 0.5, '1/2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`L{f'}=s F - f(0)?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`L{f''}=s²F - s f(0) - f'(0)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `f(0)=0, L{f'}=sF. sF ha F=1/s², s=1, L{f'}=?`, 1, '1'];
        return [2, yn(`Első eltolás: L{e^{at}f}=F(s-a)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `L{t}=1/s², s=1?`, 1, '1'];
        if (i % 4 === 1) return [3, yn(`L{sin ωt}=ω/(s²+ω²)?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `ω=1, s=0, L{sin t}=1/1=1. érték?`, 1, '1'];
        return [3, yn(`L{cos ωt}=s/(s²+ω²)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Konvergencia: Re s elég nagy?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `L{0}=0. 0=?`, 0, '0'];
        if (i % 4 === 2) return [4, yn(`Egyértelmű (folytonos függvények, Lerch)?`), 1, 'igen'];
        return [4, yn(`ODE → algebrai egyenlet F(s)-re?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`L{t^n}=n!/s^{n+1}?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `n=1, s=1, 1!/s²=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Deriválás s szerint: L{-t f}=F'(s)?`), 1, 'igen'];
        return [5, yn(`Kezdeti érték beépül az L{y'}-be?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `L{e^{-t}}=1/(s+1), s=2. érték? (3 tizedes)`, 0.333, '1/3'];
        if (i % 5 === 1) return [6, yn(`Táblázat + linearitás a gyakorlat?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `L{2}=2/s, s=2, érték?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Létezik exponenciális rendű f-re?`), 1, 'igen'];
        return [6, yn(`Laplace lineáris ODE IVP-hez ideális?`), 1, 'igen'];
    });
    return out;
}

/** Inverz Laplace és IVP */
export function de4Inverz(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`L^{-1}{1/s}=1 (t>0)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Parciális törtek F(s) felbontása?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `L^{-1}{1/(s-2)}=e^{2t}, t=0?`, 1, '1'];
        return [1, yn(`IVP: transzformál, algebra, inverz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Egyszerű pólus: reziduum × e^{at}?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `F=1/(s+3), y(0) alak e^{-3t}(0)=?`, 1, '1'];
        if (i % 4 === 2) return [2, yn(`y''+y=0, y(0)=1,y'(0)=0 → y=cos t, y(0)=?`), 1, '1'];
        return [2, yn(`Kezdeti feltételek az L{y'}, L{y''}-ben?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `L^{-1}{1/s²}=t, t=4?`, 4, '4'];
        if (i % 4 === 1) return [3, yn(`Komplex póluspár → sin/cos?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Ismételt pólus → t^k e^{at}?`), 1, 'igen'];
        return [3, `y=e^{-t}, y(0)=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Heaviside fedő: inverz lépcsős?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `y'+y=0, y(0)=5, y(0)=?`, 5, '5'];
        if (i % 4 === 2) return [4, yn(`Algebrai F(s)=(sY - y0 + ... ) / karakterisztikus?`), 1, 'igen'];
        return [4, yn(`Egyértelmű IVP ⇒ egy inverz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `cos(0)=?`, 1, '1'];
        if (i % 4 === 1) return [5, `sin(0)=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Másodrendű: két kezdeti adat?`), 1, 'igen'];
        return [5, yn(`Inverz Laplace lineáris?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `L^{-1}{s/(s²+1)}=cos t, t=0?`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Racionális F: parciális + táblázat?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `y=3e^{0·t}, y(2)=?`, 3, '3'];
        if (i % 5 === 3) return [6, yn(`Nulla kezdet: L{y''}=s²Y?`), 1, 'igen'];
        return [6, yn(`IVP megoldás t≥0-n?`), 1, 'igen'];
    });
    return out;
}

/** Lépcső, impulzus, konvolúció */
export function de4Konvolucio(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`u_c(t)=0 ha t<c, 1 ha t>c?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Dirac δ impulzus, ∫δ=1?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`L{δ}=1?`), 1, 'igen'];
        return [1, yn(`L{u_c}=e^{-cs}/s?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`(f*g)(t)=∫_0^t f(τ)g(t-τ)dτ?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`L{f*g}=F G?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `f*0 = 0. 0=?`, 0, '0'];
        return [2, yn(`Konvolúció kommutatív?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Második eltolás: u_c(t) f(t-c) ↔ e^{-cs} F(s)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Gerjesztés t=a-tól: szorozd u_a-val?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `u_0(t)=1 t>0. érték „bekapcsolva”? (1)`, 1, 'igen'];
        return [3, yn(`Impulzus IVP-t ugrat (y' vagy y)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Green-mag ODE-re konvolúció a gerjesztéssel?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `1*1 = t, t=3?`, 3, '3'];
        if (i % 4 === 2) return [4, yn(`Periodikus gerjesztés: geometriai sor F-ben?`), 1, 'igen'];
        return [4, yn(`δ * f = f?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Ablak: u_a - u_b négyszög?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `c=0, e^{-cs}=1. 1=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Disztribúció: δ deriváltja is értelmes?`), 1, 'igen'];
        return [5, yn(`Konvolúció IVP inhomogén tagjára?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Kapcsolási törvény mérnöki Laplace-ben?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `L{δ(t-a)}=e^{-as}, a=0?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`f*g t=0-nál 0, ha reguláris?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Impulzusválasz = L^{-1}{1/karakterisztikus} (nyugalom)?`), 1, 'igen'];
        return [6, yn(`Lépcső a Heaviside?`), 1, 'igen'];
    });
    return out;
}

/** Euler- és Heun-módszer */
export function de4Euler(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Euler: y_{n+1}=y_n + h f(t_n,y_n)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `y'=1, y0=0, h=1, y1=?`, 1, '1'];
        if (i % 4 === 2) return [1, `y'=2, y0=0, h=0.5, y1=?`, 1, '1'];
        return [1, yn(`Lokális hiba O(h²), globális O(h)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Heun: prediktor Euler + trapéz korrekció?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Heun 2. rendű?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `y'=0, y0=4, bármely h, y1=?`, 4, '4'];
        return [2, yn(`Lépésköz h kisebb ⇒ általában pontosabb (stabil tartományban)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `y'=y, y0=1, h=1 Euler y1=1+1·1=?`, 2, '2'];
        if (i % 4 === 1) return [3, yn(`Implicit Euler: y_{n+1}=y_n+h f(t_{n+1},y_{n+1})?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Implicit Euler merev egyenletre jobb?`), 1, 'igen'];
        return [3, yn(`Explicit Euler olcsó, de feltételesen stabil?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `t0=0, h=0.25, t2=?`, 0.5, '0.5'];
        if (i % 4 === 1) return [4, yn(`Módosított Euler = Heun speciális?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `y'=3, y0=1, h=2, Euler y1=?`, 7, '7'];
        return [4, yn(`Konzisztencia: lokális hiba →0 ha h→0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Abszolút stabilitás teszt: y'=λy?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `n=4 lépés, t=nh, h=0.5, t=?`, 2, '2'];
        if (i % 4 === 2) return [5, yn(`Heun két f-kiértékelés lépésenként?`), 1, 'igen'];
        return [5, yn(`Euler egy f-kiértékelés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `y0=10, h=0, y1=y0=?`, 10, '10'];
        if (i % 5 === 1) return [6, yn(`Globális hiba felhalmozott lokális?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `y'=-1, y0=5, h=1 Euler y1=?`, 4, '4'];
        if (i % 5 === 3) return [6, yn(`Trapéz szabály A-stabil?`), 1, 'igen'];
        return [6, yn(`Explicit Euler A-stabil? (0=nem)`), 0, 'nem'];
    });
    return out;
}

/** Runge–Kutta */
export function de4Rk(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`RK4 klasszikus 4 fokozatú?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`RK1 = Euler?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`RK2 lehet Heun/középpont?`), 1, 'igen'];
        return [1, `RK4 négy k_i. hány k?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`y_{n+1}=y_n+(h/6)(k1+2k2+2k3+k4)?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `súlyok 1,2,2,1 összeg?`, 6, '6'];
        if (i % 4 === 2) return [2, yn(`Butcher-tábla az RK együtthatók?`), 1, 'igen'];
        return [2, yn(`Rend: lokális hiba O(h^{p+1})?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `y'=0, bármely RK y1=y0=8. y1=?`, 8, '8'];
        if (i % 4 === 1) return [3, yn(`Adaptív RK: lépésbecslés (pl. RK45)?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Fehlberg/Dormand–Prince beágyazott?`), 1, 'igen'];
        return [3, yn(`Explicit RK merevre korlátozott h?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `k1=f(t,y). y'=2, k1=?`, 2, '2'];
        if (i % 4 === 1) return [4, yn(`Középponti RK2: k2=f(t+h/2, y+h k1/2)?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Konvergencia rend + stabilitás kell?`), 1, 'igen'];
        return [4, `p=4 RK4 rendje?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`s fokozat ≠ mindig s rend (Butcher-korlát)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `s=1, p=1 Euler. p=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Vektor ODE-re komponensenként ugyanaz az RK?`), 1, 'igen'];
        return [5, yn(`Autonóm: t nem kell külön, ha f=f(y)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Implicit RK (Gauss, Radau) merevre?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `h/6 * 6 = h, h=2, növekmény skála?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`RKF45 mindennapi ODE-solver?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `y0=0, y'=1, egy Euler-lépés h=3, y1=?`, 3, '3'];
        return [6, yn(`RK tábla alsó háromszög explicit?`), 1, 'igen'];
    });
    return out;
}

/** Numerikus stabilitás és merev rendszerek */
export function de4Merev(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Merev: gyors és lassú időlépték együtt?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Explicit Euler instabil nagy |hλ|-re?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`A-stabil: bal félsík a stabilitási tartományban?`), 1, 'igen'];
        return [1, yn(`Implicit módszerek merevre valók?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Stabilitási függvény R(z), z=hλ?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `Euler R=1+z, |1+z|<1 kell. z=0, |R|=?`, 1, '1'];
        if (i % 4 === 2) return [2, yn(`L-stabil: R(∞)=0?`), 1, 'igen'];
        return [2, yn(`BDF merev ODE klasszikus család?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Dahlquist: A-stabil lineáris többlépéses rend ≤2?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Trapéz A-stabil, nem L-stabil?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `λ=-1000, h=0.1, |hλ|=?`, 100, '100'];
        return [3, yn(`Merevségi arány |λ_max/λ_min| nagy?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Abszolút vs relatív tolerancia solverben?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Jacobi numerikus merev implicithez?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `két skála 1 és 0.001, arány?`, 1000, '1000'];
        return [4, yn(`Newton-iteráció implicit lépésben?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`osciláló R(z)≈-1 trapéznál nagy z-re?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Radau IIA L-stabil?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `h→0, konzisztens módszer → pontos. h=0 triviális? (1)`, 1, 'igen'];
        return [5, yn(`CFL-szerű korlát PDE-félre is merevség?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Rosenbrock: lineárisan implicit RK?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `Re λ=-1, Re(hλ)<0 ha h>0. stabil tartományba eshet? (1)`, 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Többlépéses: előző y-ok kellenek?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Kezdő lépések RK-val BDF-hez?`), 1, 'igen'];
        return [6, yn(`Merev solver h-t a lassú skálához igazítja?`), 1, 'igen'];
    });
    return out;
}
