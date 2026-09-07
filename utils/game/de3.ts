import type { LaRow as DeRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DeRow[], make: (i: number) => DeRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Differenciálegyenlet-rendszerek */
export function de3Rendszerek(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`x'=f(t,x,y), y'=g(t,x,y) elsőrendű rendszer?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `2 ismeretlen, 2 egyenlet. dimenzió?`, 2, '2'];
        if (i % 4 === 2) return [1, yn(`n-edrendű ODE átírható n elsőrendűre?`), 1, 'igen'];
        return [1, `y''=y, v=y', v' = y. hány egyenlet?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Autonóm: jobb oldal nem függ t-től expliciten?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Nemautonóm: van explicit t?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `x'=0, y'=0 egyensúly. sebesség?`, 0, '0'];
        return [2, yn(`Fázistér: (x,y) sík 2D rendszernél?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Megoldás görbe a fázissíkon?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `kezdeti (x0,y0) 2D, hány skalár adat?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`y''+y=0 ↔ x1=y, x2=y', x1'=x2, x2'=-x1?`), 1, 'igen'];
        return [3, yn(`Rendszer megoldása vektorfüggvény?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `3D rendszer, kezdeti feltételek száma?`, 3, '3'];
        if (i % 4 === 1) return [4, yn(`Kapcsolt: egyik egyenlet függ a másik változótól?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Szétcsatolható, ha a Jacobi blokkdiagonális?`), 1, 'igen'];
        return [4, `x'=2, x(0)=0, x(3)=?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`IVP rendszerre is Picard–Lindelöf?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `x'=x, x(0)=4, x(0) check?`, 4, '4'];
        if (i % 4 === 2) return [5, yn(`Konzervatív mennyiség első integrál?`), 1, 'igen'];
        return [5, yn(`Időben haladó megoldás orbitot rajzol?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`n komponensű x'=F(t,x) ℝⁿ-ben?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `y'''=0, három elsőrendű. n=?`, 3, '3'];
        if (i % 5 === 2) return [6, yn(`Kezdeti vektor egyértelműsíti a megoldást (Lipschitz)?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `x'=1, y'=0, x(0)=0, x(5)=?`, 5, '5'];
        return [6, yn(`Rendszer általánosabb, mint egyetlen skalár ODE?`), 1, 'igen'];
    });
    return out;
}

/** Lineáris rendszerek */
export function de3LinearRendszer(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`x'=A x + b(t) lineáris rendszer?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Homogén: x'=A x?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `A 2×2, állapot dimenzió?`, 2, '2'];
        return [1, yn(`Szuperpozíció homogén lineárisnál?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `A=diag(1,2), λ1=?`, 1, '1'];
        if (i % 4 === 1) return [2, `A=diag(1,2), λ2=?`, 2, '2'];
        if (i % 4 === 2) return [2, yn(`Állandó A: megoldás e^{At} x0?`), 1, 'igen'];
        return [2, `e^{0·A}=I, I_{11}=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Fundamentális mátrix oszlopai független megoldások?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `Φ(0)=I, det Φ(0)=?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`Liouville: det Φ' / det Φ = tr A?`), 1, 'igen'];
        return [3, yn(`Inhomogén: variáció x=Φ u?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `tr([[1,0],[0,3]])=?`, 4, '4'];
        if (i % 4 === 1) return [4, `det([[2,0],[0,2]])=?`, 4, '4'];
        if (i % 4 === 2) return [4, yn(`Komplex λ: oszcilláló módusok?`), 1, 'igen'];
        return [4, yn(`Valós negatív λ: lecsengés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `x'=0·x, x konstans. x(0)=7, x(t)=?`, 7, '7'];
        if (i % 4 === 1) return [5, yn(`Változó A(t) is lineáris, de e^{At} nem mindig?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Általános megoldás n dimenzióban n konstans?`), 1, 'igen'];
        return [5, `n=3, hány skalár C?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Homogén + partikuláris = inhomogén megoldás?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `A=0, x'=0, dim ker? n=2, dim=?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Állandó együtthatós: Laplace is megy?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `x1'=x2, x2'=-x1, harmonikus. ω=?`, 1, '1'];
        return [6, yn(`Lineáris rendszer zárt az összeadásra (homogén)?`), 1, 'igen'];
    });
    return out;
}

/** Sajátértékek és mátrixexponenciális */
export function de3Expat(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Av=λv sajátérték-egyenlet?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `A=[[2,0],[0,5]], λ nagyobb?`, 5, '5'];
        if (i % 4 === 2) return [1, yn(`e^{At} = Σ (At)^k / k! ?`), 1, 'igen'];
        return [1, `e^{0}=? (skalár)`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Diagonalizálható: A=PDP^{-1}, e^{At}=P e^{Dt} P^{-1}?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `D=diag(0,0), e^{Dt}=I, I_{22}=?`, 1, '1'];
        if (i % 4 === 2) return [2, `λ=-3, e^{λt} t=0?`, 1, '1'];
        return [2, yn(`Két független sajátvektor 2×2-nél diagonalizál?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Jordan-blokk: t^k e^{λt} / k! tagok?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `λ=0, e^{λt}=?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`Komplex λ=α±iβ: e^{αt}(cos,sin)?`), 1, 'igen'];
        return [3, `α=0, β=2, rezgés ω=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `e^{t} t=0 értéke?`, 1, '1'];
        if (i % 4 === 1) return [4, yn(`d/dt e^{At} = A e^{At}?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`e^{A} e^{B}=e^{A+B} ha AB=BA?`), 1, 'igen'];
        return [4, `λ1+λ2=tr A, A=[[1,2],[3,4]], tr=?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `det(A-λI)=0 karakterisztikus. λ gyökök száma n=? 2×2`, 2, '2'];
        if (i % 4 === 1) return [5, yn(`Sajátvektor irányában tiszta exponenciális?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `λ=1 és λ=1 kettős, 1 sajátirány: nem diagonalizál. hiányzó vektorok?`, 1, '1'];
        return [5, yn(`Mátrixexp t=0-nál mindig I?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `||e^{At}|| viselkedés Re λ<0: →0. Re λ max=-1<0? (1=igen)`, 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Cayley–Hamilton számolja e^{At}-t polinomként?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `λ=4, módus e^{4t}, t=0?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Defektív mátrix: polinomiális t-szorzók?`), 1, 'igen'];
        return [6, yn(`Spektrálfelbontás diagonalizálhatónál?`), 1, 'igen'];
    });
    return out;
}

/** Autonóm rendszerek és fázisportrék */
export function de3Fazis(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Egyensúly: F(x*)=0?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `x'=x(1-x), egyensúly 0 és 1. hány?`, 2, '2'];
        if (i % 4 === 2) return [1, yn(`Nyereg: egy vonzó, egy taszító irány?`), 1, 'igen'];
        return [1, yn(`Re λ<0 mindkét gyöknél: csomó/fókusz stabil?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Fókusz: spirál a fázisképen?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Centrum: zárt pályák (lineáris, tiszta imaginárius)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `λ=±2i, Re λ=?`, 0, '0'];
        return [2, yn(`Nullklina: x'=0 vagy y'=0 görbe?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Orbit nem metszi önmagát autonóm 2D-ben (egyszerű)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Poincaré–Bendixson: 2D kompakt ω-limit ciklus/egyensúly?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `tr A<0, det A>0: stabil. tr=-2, det=1. stabil? (1)`, 1, 'igen'];
        return [3, `tr=2, det=1 instabil? (1=igen)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Konzervatív: zárt nívógörbék lehetnek?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Disszipatív: energia csökken?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `x'= -x, x=0 vonzó. x(0)=5, x(∞)→?`, 0, '0'];
        return [4, yn(`Heteroklinikus: két egyensúlyt köt?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Homoklinikus: ugyanahhoz az egyensúlyhoz tér?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `det A=0, λ=0 gyök. hiperbolikus? (0=nem)`, 0, 'nem'];
        if (i % 4 === 2) return [5, yn(`Hiperbolikus: Re λ ≠ 0 minden λ?`), 1, 'igen'];
        return [5, yn(`Fázisportré kvalitatív kép?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Index +1 tipikus csomó/fókusz?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `nyereg index -1. -1=?`, -1, '−1'];
        if (i % 5 === 2) return [6, yn(`Limitciklus izolált zárt pálya?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `x'=1, nincs egyensúly ℝ-en. hány?`, 0, '0'];
        return [6, yn(`Linearizálás Jacobi F'(x*)?`), 1, 'igen'];
    });
    return out;
}

/** Stabilitás és linearizálás */
export function de3Stabil(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Ljapunov-stabil: közeli start közeli marad?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Aszimptotikus: ráadásul → x*?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Exponenciális: ||x-x*|| ≤ C e^{-αt}?`), 1, 'igen'];
        return [1, yn(`Instabil: van közeli start, ami eltávolodik?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Hartman–Grobman: hiperbolikus egyensúly topologikusan lineáris?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `minden Re λ < 0 ⇒ aszimptotikusan stabil (lineáris). igaz? (1)`, 1, 'igen'];
        if (i % 4 === 2) return [2, `egy Re λ>0 ⇒ instabil. igaz? (1)`, 1, 'igen'];
        return [2, yn(`Re λ=0: linearizálás nem dönt?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Ljapunov-függvény V>0, V'≤0 stabilitás?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`V'<0 szigorú: aszimptotikus (LaSalle/szigorú)?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `V=x², V'=2x x', x'=-x, V'=-2x² ≤0. stabil? (1)`, 1, 'igen'];
        return [3, yn(`Routh–Hurwitz polinom gyökeire?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `λ=-1,-2 mind negatív. stabil lineáris? (1)`, 1, 'igen'];
        if (i % 4 === 1) return [4, `λ=1,-5, van pozitív. instabil? (1)`, 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Strukturális stabilitás: kis perturbáció nem változtatja a portrét?`), 1, 'igen'];
        return [4, yn(`Bifurkáció: kvalitatív változás paraméterrel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Jacobian sajátértékei döntik a hiperbolikus esetet?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `x'=-x³, λ=0 a 0-nál, de aszimptotikusan stabil. linearizálás λ=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Középpont-sokaság Re λ=0 irányokra?`), 1, 'igen'];
        return [5, yn(`Lineáris stabilitás ≠ nemlineáris ha nem hiperbolikus?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`BIBO: korlátos bemenet korlátos kimenet?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `Re λ_max=-0.5<0. exponenciális lecsengés? (1)`, 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Ljapunov közvetett: linearizálás?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Közvetlen: V konstrukció?`), 1, 'igen'];
        return [6, yn(`Nyereg mindig instabil?`), 1, 'igen'];
    });
    return out;
}

/** Nemlineáris dinamikai rendszerek és modellek */
export function de3Dinamika(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Logisztikus: x'=rx(1-x/K)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `K=10 kapacitás, egyensúly x=? (pozitív)`, 10, '10'];
        if (i % 4 === 2) return [1, yn(`Lotka–Volterra: zsákmány–ragadozó?`), 1, 'igen'];
        return [1, yn(`SIR járvány: S,I,R rekeszek?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Van der Pol: nemlineáris oszcillátor, limitciklus?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Duffing: x''+δx'+αx+βx³=γ cos ωt?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Káosz: érzékeny kezdeti feltétel?`), 1, 'igen'];
        return [2, yn(`Lyapunov-exponens >0: széttartás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Hopf: egyensúlyból ciklus születik?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Nyereg-csomó: két egyensúly ütközik?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `r=0 transzkritikus tipikus. r param. 0=?`, 0, '0'];
        return [3, yn(`Pitchfork: szimmetria törése?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Lorenz: 3D, kaotikus attraktor?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Lorenz dimenzió?`, 3, '3'];
        if (i % 4 === 2) return [4, yn(`Poincaré-leképezés: folyam → diszkrét?`), 1, 'igen'];
        return [4, yn(`Attraktor: ω-limit halmaz vonzó?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Konkurencia-modell: két faj, erőforrás?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Kémiai kinetika: tömeghatás ODE?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `x'=0 egyensúly, F=0. 0=?`, 0, '0'];
        return [5, yn(`Nemlineáris: szuperpozíció általában hamis?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Bifurkációs diagram paraméter vs állapot?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Perioduskettőződés káoszhoz vezethet?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `SIR S+I+R=N konstans. N=100, S=90,I=5, R=?`, 5, '5'];
        if (i % 5 === 3) return [6, yn(`Fáziszár: 1D x'=f(x) nyilak?`), 1, 'igen'];
        return [6, yn(`Modell egyszerűsít, de ODE-struktúrát őriz?`), 1, 'igen'];
    });
    return out;
}
