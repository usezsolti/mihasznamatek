import type { LaRow as DeRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DeRow[], make: (i: number) => DeRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** PDE-alapfogalmak és osztályozás */
export function pde1Osztaly(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`PDE: több független változó?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`u_t=u_xx parabolikus (1D hő)?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`u_tt=u_xx hiperbolikus (hullám)?`), 1, 'igen'];
        return [1, yn(`u_xx+u_yy=0 elliptikus (Laplace)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Rend: legmagasabb derivált rendje?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `u_xx+u_x=0 rendje?`, 2, '2'];
        if (i % 4 === 2) return [2, yn(`Lineáris: u és deriváltjai első fokon?`), 1, 'igen'];
        return [2, yn(`Kvázi-lineáris: főrész lineáris a legmagasabb deriváltban?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`2. rend 2 változó: b²-4ac előjel osztályoz?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `hő: a=1,b=0,c=0 (u_t vs u_xx más), parabolikus D=0. D=?`, 0, '0'];
        if (i % 4 === 2) return [3, yn(`Peremfeltétel elliptikusra kell?`), 1, 'igen'];
        return [3, yn(`Kezdeti feltétel evolúciós (hő/hullám) PDE-re?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Homogén: nincs külső forrás?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Állandó együtthatós: együtthatók konstansok?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `dimenzió térben 3D Laplace. n=?`, 3, '3'];
        return [4, yn(`Jól kitűzött: létezés, egyértelműség, stabilitás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Szuperpozíció lineáris homogén PDE-re?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Nemlineáris: pl. u u_x?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `u=const megoldása u_x=0-nak. u_x(5)=?`, 0, '0'];
        return [5, yn(`Osztályozás pontonként változhat (változó együttható)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Cauchy–Kowalevski analitikus Cauchy-adatra?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Hadamard: elliptikus Cauchy rosszul kitűzött?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `elsőrendű PDE rendje?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Forrásfő: Poisson Δu=f?`), 1, 'igen'];
        return [6, yn(`Idő + tér = evolúciós PDE?`), 1, 'igen'];
    });
    return out;
}

/** Elsőrendű PDE-k és karakterisztikák */
export function pde1Karakter(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`a u_x+b u_y=c transzport/karakterisztika?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Karakterisztika: dx/dt=a, dy/dt=b?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`u konstans a karakterisztikán (homogén)?`), 1, 'igen'];
        return [1, `u_x=0 ⇒ u=g(y). u_x=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`u_t+c u_x=0 megoldás u=f(x-ct)?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `c=2, eltolás t=1 alatt Δx=?`, 2, '2'];
        if (i % 4 === 2) return [2, yn(`Kezdeti görbe nem lehet karakterisztikus?`), 1, 'igen'];
        return [2, yn(`Burgers: u_t+u u_x=0 sokk lehet?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Lagrange–Charpit nemlineáris első rendre?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Teljes integrál: paraméteres megoldáscsalád?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `c=0, u_t=0, u=kezdet. u(t,x)=u(0,x). t-független? (1)`, 1, 'igen'];
        return [3, yn(`Metsző karakterisztikák: többértékűség/sokk?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Ritkítási hullám: karakterisztikák szétnyílnak?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `f(x)=x, c=1, u(1,3)=f(3-1)=?`, 2, '2'];
        if (i % 4 === 2) return [4, yn(`Inhomogén: du/dt=c a karakterisztikán?`), 1, 'igen'];
        return [4, yn(`2D áramlás: karakterisztika = áramvonal?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`eikonal |∇u|=1 geometriai optika?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Hamilton–Jacobi elsőrendű PDE?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `u=5 konstans, ∇u=0, |∇u|=?`, 0, '0'];
        return [5, yn(`Gyenge/entrópia megoldás sokkra?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Cauchy-adat transzportálódik a görbék mentén?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `c=-1, x-ct = x+t. t=0, u=x, u(1,0)=f(0-(-1))? f(1)=1 ha f=id, u=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Lineáris transzport megőrzi a max-ot?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Változó c(x): karakterisztika nem egyenes?`), 1, 'igen'];
        return [6, yn(`PDE megoldása = ODE a karakterisztikán?`), 1, 'igen'];
    });
    return out;
}

/** Hőegyenlet */
export function pde1Ho(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`u_t = k u_xx hőegyenlet 1D?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Maximum-elv: max a peremen/kezdeten?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Sima azonnal t>0-ra (k>0)?`), 1, 'igen'];
        return [1, yn(`Végtelen sebességű jel (parabolikus)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Gauss-mag (4πkt)^{-1/2} e^{-x²/4kt}?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `k=0, u_t=0, u állandó időben. u(1)=u(0)=3, u=?`, 3, '3'];
        if (i % 4 === 2) return [2, yn(`Dirichlet: u|_(perem) adott?`), 1, 'igen'];
        return [2, yn(`Neumann: u_x peremen adott?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Fourier: sin(nπx/L) e^{-k (nπ/L)² t}?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `n=1, t→∞, exponenciális →0. limesz?`, 0, '0'];
        if (i % 4 === 2) return [3, yn(`Energia ∫u² csökken (homogén Dirichlet)?`), 1, 'igen'];
        return [3, yn(`Forrás: u_t=k u_xx+f?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Stacionárius: u_xx=0, lineáris u?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `u=ax+b, u(0)=0,u(1)=2, a=?`, 2, '2'];
        if (i % 4 === 2) return [4, yn(`Kompatibilitás Neumann+forrásra?`), 1, 'igen'];
        return [4, yn(`Duhamel: forrás = kezdetek szuperpozíciója?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Dimenzió n: u_t=k Δu?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Skálázás x/√t hasonló megoldás?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `u≡0 megoldás f=0,u0=0. u=?`, 0, '0'];
        return [5, yn(`Visszafelé hő ill-posed?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Robin: αu+β u_n =g?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `k=1, módus e^{-π² t}, t=0 faktor?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Pozitivitás: u0≥0 ⇒ u≥0?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Green-függvény a hőmag?`), 1, 'igen'];
        return [6, yn(`Parabolikus regularitás erős?`), 1, 'igen'];
    });
    return out;
}

/** Hullámegyenlet */
export function pde1Hullam(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`u_tt=c² u_xx hullám 1D?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`d'Alembert: u=(f(x-ct)+g(x+ct))/2 + ...?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `c=3, jellemző sebesség?`, 3, '3'];
        return [1, yn(`Véges jelterjedési sebesség c?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Két kezdet: u és u_t t=0-nál?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Energia megmarad (nincs csillapítás)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `u=f(x-ct), f=id, c=1,t=0, u(0,2)=?`, 2, '2'];
        return [2, yn(`Karakterisztikák x±ct?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Húr: Dirichlet u(0)=u(L)=0?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Sajátmódus sin(nπx/L) cos(c nπ t/L)?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `n=1, L=π, c=1, ω=c π/L=?`, 1, '1'];
        return [3, yn(`Visszaverődés peremen fázisugrással (rögzített)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`3D Kirchhoff: gömbfelületi közép?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Huygens-elv páratlan térdimenzióban?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`2D utócsengés (nincs tiszta Huygens)?`), 1, 'igen'];
        return [4, yn(`Tartomány of dependence: karakterisztikus háromszög?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Csillapított: u_tt+γ u_t=c² u_xx?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `u_t(0)=0, nyugalom kezdet. 0=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Inhomogén hullám: Duhamel?`), 1, 'igen'];
        return [5, yn(`Hiperbolikus: információ a kúpon belül?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Telegráf-egyenlet csillapított hullám?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `c=0, u_tt=0, u=at+b. a=0,u=5, u=?`, 5, '5'];
        if (i % 5 === 2) return [6, yn(`Szétválasztás + Fourier húron?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`CFL numerikus hullámra |c Δt/Δx|≤1?`), 1, 'igen'];
        return [6, yn(`d'Alembert 1D egzakt?`), 1, 'igen'];
    });
    return out;
}

/** Laplace- és Poisson-egyenlet */
export function pde1Laplace(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Δu=0 Laplace?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Δu=f Poisson?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Harmonikus = Laplace-megoldás?`), 1, 'igen'];
        return [1, yn(`Középérték-tulajdonság gömbön?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Maximum-elv: max peremen?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Dirichlet-probléma: u|∂Ω=g?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Neumann: ∂u/∂n=g, kompatibilitás ∫g=0?`), 1, 'igen'];
        return [2, `u=x, Δu=0 1D. Δu=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Green-függvény Dirichletre?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Poisson-mag gömbre/féltérre?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `u≡4, Δu=?`, 0, '0'];
        return [3, yn(`Analitikus (Weyl lemma / elliptikus regularitás)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Szétválasztás téglalapon sin-sor?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Polár: r^n (A cos nθ+B sin)?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `n=0, u=A+B ln r (2D). r-független A? (1)`, 1, 'igen'];
        return [4, yn(`Liouville: korlátos harmonikus ℝⁿ-en konstans?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Variációs: Dirichlet-energia min?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`f=0 Poisson → Laplace?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `u=x² 1D, u''=2, Poisson f=?`, 2, '2'];
        return [5, yn(`Egyértelműség Dirichletre (energia/max)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Kelvin-transzformáció gömbre?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Hopf-lemma peremderiváltra?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Δu=0, u=0 peremen ⇒ u=0. u belsejében?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Fundamentális megoldás ln r / 1/r?`), 1, 'igen'];
        return [6, yn(`Elliptikus: nincs idő, peremérték?`), 1, 'igen'];
    });
    return out;
}

/** Fourier-módszer és peremérték */
export function pde1Perem(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Szétválasztás u=X(x)T(t)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Sajátérték X''+λX=0 peremmel?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `Dirichlet X(0)=X(π)=0, λ=n², n=1 λ=?`, 1, '1'];
        return [1, yn(`Ortogonális sajátfüggvények?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Fourier-szinusz sor páratlan kiterjesztés?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Koszinusz: Neumann/páros?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `üres együttható mind 0, u=?`, 0, '0'];
        return [2, yn(`Sturm–Liouville általánosítja?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Kezdeti u0 vetítése a bázisra?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Hő: e^{-λ k t} együttható-lecsengés?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Hullám: A cos(c√λ t)+B sin?`), 1, 'igen'];
        return [3, yn(`Laplace téglalap: sinh(μy) X(x)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Inhomogén perem: lift + homogén?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Sajátfüggvény-fejlesztés forrásra is?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `λ=0 konstans módus Neumannál. λ=?`, 0, '0'];
        return [4, yn(`Konvergencia: sima adat ⇒ gyors együttható-csökkenés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Komplett bázis L²(0,L)-ben?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `Parseval: energia = Σ c_n². c=0 mind, energia?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`2D sajátfüggvény szorzat X(x)Y(y)?`), 1, 'igen'];
        return [5, yn(`Bessel körön radiális rész?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Peremérték + kezdet együtt IBVP?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `n=2, λ=4 ha λ=n². λ=?`, 4, '4'];
        if (i % 5 === 2) return [6, yn(`Homogén perem kell a sajátfüggvényhez?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Gibbs a szakadásos kezdet Fourierjénél?`), 1, 'igen'];
        return [6, yn(`Szétválasztás lineáris állandó együtthatós PDE-re?`), 1, 'igen'];
    });
    return out;
}
