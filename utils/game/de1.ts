import type { LaRow as DeRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DeRow[], make: (i: number) => DeRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Alapfogalmak és iránymezők */
export function de1Alapok(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i === 0) return [1, `Hányadrendű az y'' + y = 0 egyenlet?`, 2, 'másodrendű'];
        if (i % 4 === 1) return [1, yn(`Az y' = f(x,y) közönséges DE (ODE)?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Az u_t = u_xx parciális DE (PDE)?`), 1, 'igen'];
        return [1, `Hányadrendű az y' + y = 0?`, 1, 'elsőrendű'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Explicit alak: y' = f(x,y)?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Lineáris ODE-ben y és deriváltjai első fokon szerepelnek?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`y y' = x lineáris?`), 0, 'nemlineáris'];
        return [2, yn(`Általános megoldás tartalmaz tetszőleges állandókat?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Partikuláris megoldás konkrét C-vel?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Integrálgörbe = megoldásgrafikon?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Iránymező: meredekség y'=f(x,y) szerint?`), 1, 'igen'];
        return [3, `y' = 2x, meredekség x=1, y tetsző: f=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `y' = 3, konstans meredekség?`, 3, '3'];
        if (i % 4 === 1) return [4, yn(`Közvetlenül integrálható: y' = f(x)?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `y' = 2x, y(0)=1, y(1)=?`, 2, 'x²+1'];
        return [4, yn(`Maximális megoldás a lehető legnagyobb intervallumon?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Cauchy-probléma = IVP?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `y' = 0, y(0)=4, y(10)=?`, 4, 'konstans'];
        if (i % 4 === 2) return [5, yn(`n-edrendű ODE n kezdeti feltételt igényel tipikusan?`), 1, 'igen'];
        return [5, yn(`Kvalitatív vizsgálat iránymezőből is megy?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`PDE-ben több független változó van?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `y''=0 rendje?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Implicit F(x,y,y')=0 nem mindig oldható y'-re?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `y'=x, y(0)=0, y(2)=?`, 2, 'x²/2'];
        return [6, yn(`Megoldásgörbe érinti az iránymezőt?`), 1, 'igen'];
    });
    return out;
}

/** Szeparálható differenciálegyenletek */
export function de1Szeparal(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`y' = f(x)g(y) szeparálható?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `y' = y, y=Ce^x, y(0)=2 ⇒ C=?`, 2, '2'];
        if (i % 4 === 2) return [1, `y' = 2y, y(0)=1, y=e^{2x}, y(0) check 1? (1=igen)`, 1, 'igen'];
        return [1, yn(`dy/g(y) = f(x) dx a szétválasztás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `y' = 0*g(y), konstans y megoldás lehet? (1=igen)`, 1, 'igen'];
        if (i % 4 === 1) return [2, `y' = 3, y(0)=0, y(1)=?`, 3, '3x'];
        if (i % 4 === 2) return [2, `y' = e^x, y(0)=0, y(0) check: C=-1, y=e^x-1, y(0)=?`, 0, '0'];
        return [2, yn(`g(y)=0 egyensúlyi (konstans) megoldást adhat?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `y' = y^2 típus; y=0 konstans megoldás? (1=igen)`, 1, 'igen'];
        if (i % 4 === 1) return [3, `y' = 1/y,  y dy = dx, y^2/2 = x+C. y(0)=2, C=?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Szeparálás után mindkét oldalt integráljuk?`), 1, 'igen'];
        return [3, `y'=2x y^0, y(0)=5, y(1)=?`, 6, 'x²+5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `y'=k, k=4, Δx=2, Δy=?`, 8, '8'];
        if (i % 4 === 1) return [4, yn(`y'=xy szeparálható?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `y'=y, ln|y|=x+C. y>0, y(0)=e, C=?`, 1, 'ln e=1'];
        return [4, yn(`Konstans megoldást külön ellenőrizni kell?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `y'=-y, y=y0 e^{-x}, y0=3, y(0)=?`, 3, '3'];
        if (i % 4 === 1) return [5, yn(`IVP a C-t rögzíti?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `y'=1, y(2)=0, y(5)=?`, 3, 'x-2'];
        return [5, yn(`y'=f(x)+g(y) általában NEM szeparálható?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `y'=y(1-y), egyensúly y=0 és y=1. hány darab?`, 2, '2'];
        if (i % 5 === 1) return [6, yn(`Logisztikus egyenlet szeparálható?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `y'=4x^3, y(0)=0, y(1)=?`, 1, 'x^4'];
        if (i % 5 === 3) return [6, yn(`Elveszthetjük a y=0 megoldást osztáskor?`), 1, 'igen'];
        return [6, `y'=2/x (x>0), y(1)=0, y=2 ln x, y(e)=?`, 2, '2'];
    });
    return out;
}

/** Elsőrendű lineáris differenciálegyenletek */
export function de1Linear(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`y' + p(x)y = q(x) elsőrendű lineáris?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`q=0 a homogén eset?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `μ = exp(∫p dx). p=1, μ=e^x, μ(0)=?`, 1, '1'];
        return [1, yn(`Integráló tényező μ' = p μ?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `y'+y=0, y=Ce^{-x}, y(0)=2, C=?`, 2, '2'];
        if (i % 4 === 1) return [2, `y'+2y=0, r=-2, y=e^{-2x} C. y(0)=1, C=?`, 1, '1'];
        if (i % 4 === 2) return [2, yn(`(μ y)' = μ q a módszer lényege?`), 1, 'igen'];
        return [2, `p=0, y'=q=3, y(0)=0, y(2)=?`, 6, '3x'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `y'-y=0, y=Ce^x, y(0)=5, C=?`, 5, '5'];
        if (i % 4 === 1) return [3, yn(`Inhomogén: q nem azonosan 0?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `y'+y=1, egyensúly y=1. y konstans 1 megoldás? (1=igen)`, 1, 'igen'];
        return [3, yn(`Homogén megoldás szorzódhat C-vel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `μ=e^{∫2 dx}=e^{2x}, μ(0)=?`, 1, '1'];
        if (i % 4 === 1) return [4, yn(`Elsőrendű lineáris mindig szeparálható, ha q=0?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `y'+y=e^x, yp=A e^x, A=1/2. 2A=?`, 1, '1'];
        return [4, yn(`Általános megoldás yh+yp?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `y(0)=0, y=e^x-1 típusú yp. y(0)=?`, 0, '0'];
        if (i % 4 === 1) return [5, yn(`p,q folytonos ⇒ lokális megoldás létezik?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `∫p=ln x (x>0), μ=x, μ(1)=?`, 1, '1'];
        return [5, yn(`Newton-hűlés elsőrendű lineáris?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `y'+3y=0, felezési: y(ln 2 / 3)= y0/2. k=3, igen? (1)`, 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Bernoulli α=1-re lineáris?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `y'=1-y, egyensúly?`, 1, 'y=1'];
        if (i % 5 === 3) return [6, yn(`μ soha 0, ha exponenciális?`), 1, 'igen'];
        return [6, `y'+y=0, y(1)=e^{-1}≈0.368, y0 ha y=y0 e^{-x}, y0=?`, 1, '1'];
    });
    return out;
}

/** Homogén, Bernoulli és egzakt egyenletek */
export function de1Bernoulli(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`y' = F(y/x) homogén fokszámú?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`u=y/x a homogén helyettesítés?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Bernoulli: y'+p y = q y^α?`), 1, 'igen'];
        return [1, yn(`α=0 Bernoulli lineáris?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Egzakt: M dx + N dy = 0, My=Nx?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `M=y, N=x, My=1, Nx=1, egzakt? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [2, `M=2x, N=2y, My=0, Nx=0, egzakt? (1)`, 1, 'igen'];
        return [2, yn(`v=y^{1-α} linearizálja Bernoullit?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Csak x-től függő μ: (My−Nx)/N csak x függvénye?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Csak y-tól függő μ: (Nx−My)/M csak y?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `α=2 Bernoulli. 1-α=?`, -1, '−1'];
        return [3, yn(`Homogén: skálázás x,y ugyanazzal a λ-val?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `F=y/x, u=2, F(2)=2. 2=?`, 2, '2'];
        if (i % 4 === 1) return [4, yn(`Potenciál Φ, dΦ=M dx+N dy egzaktnál?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `M=x, N=y, My−Nx=0-y? −1, nem 0. egzakt? (0=nem)`, 0, 'nem'];
        return [4, yn(`Bernoulli α=1 lineáris inhomogén?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Egzakt egyenlet totális differenciál?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `∫M dx + g(y), M=2xy, Φ=x² y +g. Φ_y=x²+g'. N=x², g'=0. g'=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Homogén helyettesítés ODE-t szeparálhatóvá tehet?`), 1, 'igen'];
        return [5, yn(`μ megszorozza M,N-t egzakttá?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Nem minden M dx+N dy egzakt?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `α=3, 1-α=?`, -2, '−2'];
        if (i % 5 === 2) return [6, yn(`u=y/x, y=ux, y'=u+x u'?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `My=Nx=5, különbség?`, 0, '0'];
        return [6, yn(`Bernoulli nemlineáris α≠0,1 esetén?`), 1, 'igen'];
    });
    return out;
}

/** Kezdetiérték-problémák és létezés */
export function de1Ivp(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`IVP: y'=f(x,y), y(x0)=y0?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Picard–Lindelöf: Lipschitz y-ban ⇒ lokális egyértelműség?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`f folytonos ⇒ lokális létezés (Peano)?`), 1, 'igen'];
        return [1, yn(`Gronwall becslést ad a különbségre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `y'=2y, y(0)=1, y(0) érték?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`Lipschitz |f(x,y)-f(x,z)|≤K|y-z|?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`√|y| nem Lipschitz y=0-nál?`), 1, 'igen'];
        return [2, yn(`Maximális intervallum lehet véges blow-up miatt?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Folytonos függés a kezdeti adattól Lipschitz mellett?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `y'=y^2, y(0)=1, blow-up 1/(1-x), pólus x=?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`Egyértelműség sérülhet Lipschitz nélkül?`), 1, 'igen'];
        return [3, yn(`Picard-iteráció: y_{n+1}=y0+∫f?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Lokális tétel nem globális megoldást ígér?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `y'=0, y(5)=7, egyértelmű megoldás y=?`, 7, '7'];
        if (i % 4 === 2) return [4, yn(`Lineáris y'+p y=q, p,q folytonos [a,b]-n ⇒ megoldás az egész [a,b]-n?`), 1, 'igen'];
        return [4, yn(`Gronwall: u≤a+∫b u ⇒ u≤a exp(∫b)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Picard kontraktív leképezés kis intervallumon?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `f=y, K Lipschitz=? (∂f/∂y)`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`y(x0)=y0 egy pontot rögzít a síkon?`), 1, 'igen'];
        return [5, yn(`Több megoldás áthaladhat ugyanazon a ponton, ha nincs Lipschitz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Maximális megoldás nem hosszabbítható?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `y'=1+y^2, tan blow-up π/2≈1.571`, 1.571, 'π/2'];
        if (i % 5 === 2) return [6, yn(`Unicitás ⇒ megoldásgörbék nem metszik egymást?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `y(0)=0, y'=2, y(4)=?`, 8, '2x'];
        return [6, yn(`Peano nem ad egyértelműséget?`), 1, 'igen'];
    });
    return out;
}

/** Matematikai modellezés */
export function de1Modellek(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`P'=kP exponenciális növekedés?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `P=P0 e^{kt}, k=0, P/P0=?`, 1, '1'];
        if (i % 4 === 2) return [1, `N'=-λN bomlás. λ>0? (1=igen)`, 1, 'igen'];
        return [1, yn(`Newton: T'=-k(T-Tk)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `P(0)=10, k=0, P(5)=?`, 10, '10'];
        if (i % 4 === 1) return [2, yn(`Logisztikus: P'=rP(1-P/K)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `Logisztikus egyensúly P=K. K=100, egyensúly?`, 100, '100'];
        return [2, `P=0 is egyensúly logisztikusnál? (1=igen)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `T'= -k(T-20), egyensúly T=?`, 20, '20'];
        if (i % 4 === 1) return [3, `Felezési idő bomlásnál T_{1/2}=ln2/λ. ln2≈0.693, λ=0.693, T=?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`Keverési modell gyakran elsőrendű lineáris?`), 1, 'igen'];
        return [3, yn(`P0 e^{kt} k<0 csökken?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `k=ln2, P0=1, P(1)=2. 2=?`, 2, 'e^{ln2}'];
        if (i % 4 === 1) return [4, yn(`Eltartóképesség = K?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `P>K logisztikusnál P' előjele negatív? (1=igen)`, 1, 'igen'];
        return [4, yn(`Radioaktív bomlás N=N0 e^{-λt}?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `Tk=0, T(0)=10, k→∞, T→?`, 0, '0'];
        if (i % 4 === 1) return [5, yn(`Malthus = exponenciális modell?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `P'=2P, megduplázódás ideje ln2/2≈0.347`, 0.347, 'ln2/2'];
        return [5, yn(`Gazdasági kamatos kamat folytonosan P'=rP?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Logisztikus S-görbe K-hoz tart?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `N0=8, λ=0, N(t)=?`, 8, '8'];
        if (i % 5 === 2) return [6, yn(`Newton egyensúlya a környezeti hőmérséklet?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `K=50, r>0, P=25 a K/2. inflexiós tipikus? (1)`, 1, 'igen'];
        return [6, yn(`Modell paraméterei mérésből jönnek?`), 1, 'igen'];
    });
    return out;
}
