import type { LaRow as DmRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DmRow[], make: (i: number) => DmRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Rekurzív sorozatok */
export function dm2Rekurzio(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Rekurzió: a_n korábbi tagokból?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `a_n=a_{n-1}+1, a_0=0, a_3=?`, 3, '3'];
        if (i % 4 === 2) return [1, `a_n=2 a_{n-1}, a_0=1, a_4=?`, 16, '16'];
        return [1, yn(`Kezdőérték kell a rekurzióhoz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `a_n=3, konstans. a_10=?`, 3, '3'];
        if (i % 4 === 1) return [2, yn(`Elsőrendű: egy előző tag?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `a_n=a_{n-1}+2, a_0=1, a_2=?`, 5, '5'];
        return [2, yn(`Zárt alak nem rekurzív?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `a_n=c a_{n-1}, a_0=2, c=3, a_2=?`, 18, '18'];
        if (i % 4 === 1) return [3, yn(`Másodrendű: két előző tag?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `a_n=a_{n-1}+a_{n-2}, a_0=1,a_1=1, a_3=?`, 3, '3'];
        return [3, yn(`Lineáris rekurzió: tagok első fokon?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `a_n=-a_{n-1}, a_0=5, a_2=?`, 5, '5'];
        if (i % 4 === 1) return [4, `a_n=0·a_{n-1}+4, a_n=4. a_7=?`, 4, '4'];
        if (i % 4 === 2) return [4, yn(`Nemlineáris: pl. a_n=a_{n-1}^2?`), 1, 'igen'];
        return [4, `a_0=0, a_n=a_{n-1}, a_9=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `aritmetika: a_n=a_{n-1}+d, d=5, a_0=0, a_4=?`, 20, '20'];
        if (i % 4 === 1) return [5, yn(`Generátorfüggvény rekurziót zárttá tehet?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `a_n=n, a_5=?`, 5, '5'];
        return [5, yn(`Egyértelmű, ha elég kezdőérték van?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `2^n, n=6?`, 64, '64'];
        if (i % 5 === 1) return [6, yn(`Rekurzív struktúra: fa, zárójel?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `a_n=a_{n-1}-1, a_0=10, a_3=?`, 7, '7'];
        if (i % 5 === 3) return [6, yn(`k-adrendű: k kezdőérték?`), 1, 'igen'];
        return [6, `a_n=1+a_{n-1}, a_0=0, a_8=?`, 8, '8'];
    });
    return out;
}

/** Lineáris rekurziók */
export function dm2LinearRek(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`a_n=c a_{n-1}+d elsőrendű lineáris?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `a_n=2 a_{n-1}, a_0=1, a_3=?`, 8, '8'];
        if (i % 4 === 2) return [1, yn(`Karakterisztikus: r^2-p r-q=0 másodrendűre?`), 1, 'igen'];
        return [1, `a_n=a_{n-1}+a_{n-2} p=1,q=1. p+q=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `r^2-3r+2=0, gyökök 1,2. összeg?`, 3, '3'];
        if (i % 4 === 1) return [2, `szorzat gyökök 2? 1·2=?`, 2, '2'];
        if (i % 4 === 2) return [2, yn(`Homogén: nincs plusz f(n) tag?`), 1, 'igen'];
        return [2, yn(`Általános: C1 r1^n + C2 r2^n?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Kettős gyöknél n r^n tag?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `a_n=3, partikuláris konstans. 3=?`, 3, '3'];
        if (i % 4 === 2) return [3, yn(`Inhomogén = homogén + partikuláris?`), 1, 'igen'];
        return [3, `a_n=5 a_{n-1}, r=?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `r=2,-1, a_n=C1 2^n+C2 (-1)^n. a_0=C1+C2. ha C1=1,C2=0, a_0=?`, 1, '1'];
        if (i % 4 === 1) return [4, yn(`Állandó együtthatós karakterisztikus polinom?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `rend k=3, 3 gyök (ℂ). k=?`, 3, '3'];
        return [4, yn(`Próbafüggvény polinom/exponenciális inhomogénre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `a_n=2a_{n-1}+1, egyensúly a=2a+1 ⇒ a=-1. -1=?`, -1, '−1'];
        if (i % 4 === 1) return [5, yn(`Generátorfüggvény parciális törtekre visz?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `r^2=4, r=±2, |nagyobb|?`, 2, '2'];
        return [5, yn(`Kezdőértékek rögzítik C-ket?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `a_n=a_{n-1}, r=1, a_n=C. C=7, a_n=?`, 7, '7'];
        if (i % 5 === 1) return [6, yn(`Komplex gyök: sin/cos alak?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `diszkrimináns 9-8=1>0 két valós. 1=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Szuperpozíció homogénre?`), 1, 'igen'];
        return [6, `2^0=?`, 1, '1'];
    });
    return out;
}

/** Fibonacci-számok */
export function dm2Fibonacci(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `F_0=?`, 0, '0'];
        if (i % 4 === 1) return [1, `F_1=?`, 1, '1'];
        if (i % 4 === 2) return [1, `F_2=?`, 1, '1'];
        return [1, `F_3=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `F_4=?`, 3, '3'];
        if (i % 4 === 1) return [2, `F_5=?`, 5, '5'];
        if (i % 4 === 2) return [2, `F_6=?`, 8, '8'];
        return [2, yn(`F_n=F_{n-1}+F_{n-2}?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `F_7=?`, 13, '13'];
        if (i % 4 === 1) return [3, `F_8=?`, 21, '21'];
        if (i % 4 === 2) return [3, `F_9=?`, 34, '34'];
        return [3, `F_10=?`, 55, '55'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Binet: (φ^n-ψ^n)/√5?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`φ=(1+√5)/2 aranymetszés?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `F_1+F_2+F_3=1+1+2=?`, 4, 'F_5-1'];
        return [4, yn(`Cassini: F_{n+1}F_{n-1}-F_n^2=(-1)^n?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `F_3^2+F_4^2=4+9=?`, 13, 'F_7'];
        if (i % 4 === 1) return [5, yn(`Nyulak/Fibonacci-modell?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `gcd(F_6,F_9)=F_gcd(6,9)=F_3=?`, 2, '2'];
        return [5, yn(`Karakterisztikus r^2-r-1=0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `F_11=?`, 89, '89'];
        if (i % 5 === 1) return [6, yn(`F_n / F_{n-1} → φ?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `F_0+F_1=1=F_2. 1=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Binet kerekítése egészre?`), 1, 'igen'];
        return [6, `F_12=?`, 144, '144'];
    });
    return out;
}

/** Catalan, Stirling, Bell */
export function dm2Catalan(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `C_0 Catalan=?`, 1, '1'];
        if (i % 4 === 1) return [1, `C_1=?`, 1, '1'];
        if (i % 4 === 2) return [1, `C_2=?`, 2, '2'];
        return [1, `C_3=?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `C_4=?`, 14, '14'];
        if (i % 4 === 1) return [2, yn(`C_n=1/(n+1) C(2n,n)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `C(6,3)/4=20/4=? C_3`, 5, '5'];
        return [2, yn(`Zárójelezés Catalan?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Másodfajú Stirling: n elem k nemüres blokk?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `S(3,2)=?`, 3, '3'];
        if (i % 4 === 2) return [3, `S(4,2)=?`, 7, '7'];
        return [3, `S(4,3)=?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `S(n,1)=1. n tetsző, érték?`, 1, '1'];
        if (i % 4 === 1) return [4, `S(n,n)=1. 1=?`, 1, '1'];
        if (i % 4 === 2) return [4, yn(`Bell B_n = Σ S(n,k)?`), 1, 'igen'];
        return [4, `B_2=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `B_3=?`, 5, '5'];
        if (i % 4 === 1) return [5, `B_4=?`, 15, '15'];
        if (i % 4 === 2) return [5, yn(`Bináris fák / rácsutak Catalan?`), 1, 'igen'];
        return [5, `S(5,2)=?`, 15, '15'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `C_5=?`, 42, '42'];
        if (i % 5 === 1) return [6, yn(`Trianguláció n-szög: C_{n-2}?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `B_5=?`, 52, '52'];
        if (i % 5 === 3) return [6, yn(`S(n,k)=k S(n-1,k)+S(n-1,k-1)?`), 1, 'igen'];
        return [6, `C(4,2)=?`, 6, '6'];
    });
    return out;
}

/** Generátorfüggvények */
export function dm2Gf(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`A(x)=Σ a_n x^n ordinárius GF?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `1/(1-x)=Σ x^n, a_0=?`, 1, '1'];
        if (i % 4 === 2) return [1, yn(`Szorzás = Cauchy-konvolúció?`), 1, 'igen'];
        return [1, yn(`Összeg GF-ek összege?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `x/(1-x)^2 = Σ n x^n. n=1 együttható?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`Deriválás indexeltolás/n szorzó?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `(1+x)^3 x^2 együttható C(3,2)=?`, 3, '3'];
        return [2, yn(`1/(1-x)^{k+1} ismétléses kombináció?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`EGF: Σ a_n x^n/n! ?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `e^x EGF a_n=1. a_0=?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`Rekurzió → algebrai egyenlet A(x)-re?`), 1, 'igen'];
        return [3, `konstans 0 GF. a_5=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Cauchy: (1,1,…) * (1,0,0,…) = (1,1,…). a_0=?`, 1, '1'];
        if (i % 4 === 1) return [4, yn(`Parciális tört → explicit a_n?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `x A(x) eltolt. ha a_0=0, ok. 0=?`, 0, '0'];
        return [4, yn(`Fibonacci GF x/(1-x-x^2)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `Catalan GF C=1+x C^2. C(0)=?`, 1, '1'];
        if (i % 4 === 1) return [5, yn(`Szorzat EGF: labeled termék?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `(1-x)^{-1} a_n=1. a_8=?`, 1, '1'];
        return [5, yn(`Indexeltolás: (A-a0)/x?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `Σ C(n,k) x^k = (1+x)^n. n=0 érték?`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Műveletek: +, *, d/dx, x^m szorzó?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `k=0 Cauchy belső összeg a0 b0. 1·1=?`, 1, '1'];
        return [6, yn(`Leszámlálás GF együtthatója?`), 1, 'igen'];
    });
    return out;
}
export function dm2OsszRek(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `F_6+C_3=8+5=?`, 13, '13'];
        if (i % 4 === 1) return [1, yn(`Korlátozott perm GF/szita?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `S(4,1)+S(4,4)=1+1=?`, 2, '2'];
        return [1, yn(`Rekurzív struktúra Catalan-egyenlet?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `B_3-F_4=5-3=?`, 2, '2'];
        if (i % 4 === 1) return [2, yn(`Partíciók EGF exp(e^x-1)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `n! n=4?`, 24, '24'];
        return [2, yn(`Inhomogén rekurzió + GF?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `C(2n,n) n=3, C(6,3)=?`, 20, '20'];
        if (i % 4 === 1) return [3, yn(`Dyck-út = Catalan?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `F_5+F_6=F_7. 5+8=?`, 13, '13'];
        return [3, yn(`Stirling 1. fajú előjeles ciklusok?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `2^n-F_n n=4: 16-3=?`, 13, '13'];
        if (i % 4 === 1) return [4, yn(`Kernel-módszer haladó GF?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `C_n C_{n} n=2: 2·2=?`, 4, '4'];
        return [4, yn(`Leszámlálás rekurzióval + zárt forma?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `B_4/S(4,2)=15/7 nem egész. S(4,2)=?`, 7, '7'];
        if (i % 4 === 1) return [5, yn(`Több változós GF?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `F_10-F_9=F_8. 55-34=?`, 21, '21'];
        return [5, yn(`Aszimptotika singularity analysis?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `C_4-C_3=14-5=?`, 9, '9'];
        if (i % 5 === 1) return [6, yn(`Kevert: rekurzió + binomiális transzform?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `n=0 minden kezdő 0, a_n=0. 0=?`, 0, '0'];
        if (i % 5 === 3) return [6, `S(5,5)=?`, 1, '1'];
        return [6, yn(`Zárt formula nem mindig létezik elemi függvényekkel?`), 1, 'igen'];
    });
    return out;
}
