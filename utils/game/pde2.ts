import type { LaRow as DeRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DeRow[], make: (i: number) => DeRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Gyenge derivált és gyenge megoldás */
export function pde2Gyenge(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Gyenge derivált: ∫ u φ' = -∫ v φ minden teszt φ?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Klasszikus megoldás ⇒ gyenge is?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Gyenge nem mindig C²?`), 1, 'igen'];
        return [1, yn(`Disztribúció-értelemben Δu=f?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Testfüggvény C_c^∞?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Integrálás parciálisan perem nélkül (kompakt tartó)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `u=0, gyenge derivált 0. v=?`, 0, '0'];
        return [2, yn(`Lépcsőfüggvény gyenge deriváltja δ?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Variációs egyenlet: a(u,φ)=L(φ)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Lax–Milgram: koercív folytonos bilinear ⇒ egyértelmű?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Galerkin: véges dimenziós közelítés?`), 1, 'igen'];
        return [3, yn(`Sűrűség: C^∞ sűrű W^{1,p}-ben (sima tartomány)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Nyom-tétel: u|∂Ω értelmes W^{1,p}-ben?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`W_0^{1,2}: nulla nyom?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Gyenge megoldás peremet a térben hordozza?`), 1, 'igen'];
        return [4, `∫_0^1 0·φ=0. 0=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Regularitás: gyenge + sima adat ⇒ klasszikus?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Elliptikus: bootstrap?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Energia-egyenlőség gyenge megoldásra?`), 1, 'igen'];
        return [5, yn(`Nemegyértelműség nemlineáris gyengében előfordulhat?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Mintafüggvény: |x| ℝ-en W^{1,p}_{loc}?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`δ nem L^p függvény, csak disztribúció?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `⟨1, φ⟩=∫φ, lineáris. 1 a konstans? (1)`, 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Gyenge formuláció FEM alapja?`), 1, 'igen'];
        return [6, yn(`Integrálazonosság definiálja a deriváltat?`), 1, 'igen'];
    });
    return out;
}

/** Lp- és Szoboljev-terek */
export function pde2Szoboljev(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`L^p: (∫|u|^p)^{1/p} <∞?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`W^{k,p}: gyenge deriváltak L^p-ben k-ig?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`H^k = W^{k,2}?`), 1, 'igen'];
        return [1, yn(`Hilbert: H^1 skalárszorzattal?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Hölder: |∫uv| ≤ ||u||_p ||v||_q, 1/p+1/q=1?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `p=2, q=?`, 2, '2'];
        if (i % 4 === 2) return [2, yn(`Poincaré: ||u||_{L^2} ≤ C ||∇u|| W_0^{1,2}-n?`), 1, 'igen'];
        return [2, yn(`Sobolev-beágyazás W^{1,p} ⊂ L^{p*}?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Rellich–Kondrachov: kompakt beágyazás?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Morrey: p>n ⇒ Hölder-folytonos?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `n=1, p=2>1, folytonos képviselő? (1)`, 1, 'igen'];
        return [3, yn(`Nyom: W^{1,p}(Ω)→L^p(∂Ω)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Ekvivalens norma H_0^1: |u|_{H^1}=||∇u||?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Fourier: H^s(ℝ^n) (1+|ξ|²)^{s/2} û ∈ L²?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `s=0, H^0=L². s=?`, 0, '0'];
        return [4, yn(`L^∞ ⊂ L^p korlátos tartományon?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Dual: (L^p)'=L^q?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`H^{-1}=(H_0^1)'?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Banach-tér L^p, 1≤p≤∞?`), 1, 'igen'];
        return [5, yn(`Reflexív 1<p<∞?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Gagliardo–Nirenberg interpoláció?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `p=1, nem Hilbert. Hilbert p=?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Ekvivalens W-normák Lipschitz-tartományon?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Sűrűség C^∞ ∩ W a W-ben?`), 1, 'igen'];
        return [6, yn(`Sobolev a gyenge PDE természetes tere?`), 1, 'igen'];
    });
    return out;
}

/** Variációs módszerek */
export function pde2Variacio(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Dirichlet-energia E(u)=½∫|∇u|²-∫fu?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Minimum ⇒ Euler–Lagrange gyenge forma?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Koercivitás: E(u)→∞ ha ||u||→∞?`), 1, 'igen'];
        return [1, yn(`Alsó félfolytonosság gyenge topológiában?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Direkt módszer: minimalizáló sorozat + gyenge limesz?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Konvex E ⇒ minimum létezik (reflexív)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Poincaré kell a H_0^1 koercivitáshoz?`), 1, 'igen'];
        return [2, yn(`Lagrange-szorzó kényszerre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Ritz: véges dimenziós altér min?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`FEM = Ritz/Galerkin elemekkel?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `E(0)=0 ha f=0. E(0)=?`, 0, '0'];
        return [3, yn(`Első variáció δE=0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Mountain-pass nemkonvex problémákra?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Palais–Smale kompaktfeltétel?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Eigenvalue Rayleigh-hányados min?`), 1, 'igen'];
        return [4, yn(`λ1 = min ||∇u||² / ||u||² u≠0 W_0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Duális variációs elv is létezhet?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Obstacle: variációs egyenlőtlenség?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Konvex halmazra projekció?`), 1, 'igen'];
        return [5, `min x², x=0-nál érték?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Γ-konvergencia homogenizációhoz?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Energia-csökkenés gradiens-folyamnál?`), 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Koercív + l.s.c. ⇒ min?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Természetes perem a variációból jön?`), 1, 'igen'];
        return [6, yn(`Gyenge forma = energia deriváltja?`), 1, 'igen'];
    });
    return out;
}

/** Elliptikus problémák */
export function pde2Elliptikus(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`-div(A∇u)+cu=f elliptikus ha A pozitív definit?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Lax–Milgram H_0^1-en?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Fredholm: kompakt perturbáció?`), 1, 'igen'];
        return [1, yn(`Maximum-elv gyenge/erős?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`H² regularitás sima tartomány+adat?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Sarok rontja a regularitást?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Schauder C^{2,α} Hölder-együtthatóra?`), 1, 'igen'];
        return [2, yn(`De Giorgi–Nash–Moser: korlátos A ⇒ Hölder u?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Sajátértékek 0<λ1<λ2≤… →∞?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`λ1 egyszerű, sajátfüggvény>0?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `f=0, u=0 az egyetlen H_0^1 (c≥0). u=?`, 0, '0'];
        return [3, yn(`Gårding-egyenlőtlenség koercivitás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Neumann: kompatibilitás ∫f = perem?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Vegyes Dirichlet/Neumann OK?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Green-reprezentáció klasszikusban?`), 1, 'igen'];
        return [4, yn(`Agmon–Douglis–Nirenberg L^p?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Nemlineáris: monoton operátor?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`p-Laplace: div(|∇u|^{p-2}∇u)?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Összehasonlító elv?`), 1, 'igen'];
        return [5, yn(`Egyértelműség szigorú monotonitásból?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Homogenizáció effektív A*?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Dirichlet-elv energia=min?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `A=I, c=0, −Δu=f. Poisson? (1)`, 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Spektrálfelbontás sajátbázison?`), 1, 'igen'];
        return [6, yn(`Elliptikus: stacionárius egyensúly?`), 1, 'igen'];
    });
    return out;
}

/** Parabolikus és hiperbolikus problémák */
export function pde2Parabolikus(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`u_t + L u = f parabolikus (L elliptikus)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Energia-egyenlőség d/dt ||u||² + a(u,u)=…?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Maximális regularitás L^p(0,T;W)?`), 1, 'igen'];
        return [1, yn(`Sima t>0-ra (analitikus félcsoport)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Galerkín + Aubin–Lions kompakt?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Hő félcsoport e^{-tA}?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `u0=0,f=0 ⇒ u=0. u=?`, 0, '0'];
        return [2, yn(`Maximum-elv parabolikusra is?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Hiperbolikus: u_tt + L u = f?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Véges terjedési sebesség?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Energia megmarad/oszcillál?`), 1, 'igen'];
        return [3, yn(`Két kezdet u,u_t?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Gyenge hiperbolikus: H^1 × L² energia?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Strichartz diszperzív becslések?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Parabolikus irreversibilis, hiperbolikus reversibilis?`), 1, 'igen'];
        return [4, yn(`Duhamel mindkét evolúcióra?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Navier–Stokes parabolikus-szerű viszkózus?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Hullám kvázilineáris: sokk?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Viszkozitás-eltűnés → hiperbolikus limesz?`), 1, 'igen'];
        return [5, yn(`Jól kitűzöttség Sobolevben (lokális)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Analitikus félcsoport parabolikus?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Csoport hiperbolikus (reverzibilis)?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `t=0 adat, evolúció t>0. t kezdet?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Faedo–Galerkin létezés?`), 1, 'igen'];
        return [6, yn(`Energia a gyenge megoldás kulcsa?`), 1, 'igen'];
    });
    return out;
}

/** Spektrális módszerek, Green, modern PDE */
export function pde2Green(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Green: L G(x,y)=δ_y, peremhomogén?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`u(x)=∫ G(x,y) f(y) dy?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Spektrális: sajátfüggvény-sor?`), 1, 'igen'];
        return [1, yn(`Fourier/spektrális galerkin periodikusra?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`G szimmetrikus önadjungált L-re?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Rezolvens (A-λ)^{-1} spektrális?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `f=0, u=0 Green-reprezentáció. u=?`, 0, '0'];
        return [2, yn(`Pszeudodifferenciális operátor Fourier-szorzó?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Mikrolokális: hullámfront-halmaz?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Hörmander: hiperbolikus regularitás jellemzők mentén?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Calderón–Zygmund szinguláris integrál?`), 1, 'igen'];
        return [3, yn(`Viszkozitás-megoldás Hamilton–Jacobira?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Disztribúció-megoldás fundamentális megoldással?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`FEM + spektrális hibrid?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Céa-lemma Galerkin-hibára?`), 1, 'igen'];
        return [4, yn(`Exponenciális konvergencia analitikus spektrálisnál?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Control: HUM hiperbolikus kontroll?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Inverz probléma: együttható rekonstruálás?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Nemlineáris Schrödinger diszperzív PDE?`), 1, 'igen'];
        return [5, yn(`Navier–Stokes millenniumi kérdés 3D?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Green + spektrál = modern lineáris elmélet?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Szoboljev a természetes függvénytér?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `λ_n ~ n² 1D. n=0, λ≈?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Fundamentális megoldás = Green szabad téren?`), 1, 'igen'];
        return [6, yn(`Gyenge+regularitás ⇒ klasszikus?`), 1, 'igen'];
    });
    return out;
}
