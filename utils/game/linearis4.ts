import type { LaRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: LaRow[], make: (i: number) => LaRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Bilineáris és kvadratikus formák */
export function la4Kvadratikus(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`B(x,y) lineáris mindkét változóban? bilinearitás?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Szimmetrikus bilineáris: B(x,y)=B(y,x)?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Q(x)=x^T A x kvadratikus forma?`), 1, 'igen'];
        return [1, `Q(x,y)=x²+y², Q(1,0)=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `Q=x²−y², Q(1,1)=?`, 0, '0'];
        if (i % 4 === 1) return [2, yn(`Pozitív definit: Q(x)>0 ha x≠0?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`I₂ pozitív definit?`), 1, 'igen'];
        return [2, yn(`−I pozitív definit?`), 0, 'negatív definit'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Sylvester: főminorok >0 ⇒ pozitív definit?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Indefinit: van + és − érték is?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `diag(1,−1) indefinit? (1=igen)`, 1, 'igen'];
        return [3, yn(`Pozitív szemidefinit: Q≥0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Főtengelytétel: Q ortogonális transzformációval diagonális?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Q=2x², A=diag(2,0) (1,1) eleme?`, 2, '2'];
        if (i % 4 === 2) return [4, yn(`Szimmetrikus A egyértelmű Q-hoz?`), 1, 'igen'];
        return [4, yn(`Negatív definit: minden λ<0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `Q(x,y)=xy polarizációval B((1,0),(0,1))=1/2. 2B=1? (1=igen polarizáció Q-ra)`, 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`B mátrixa [B(e_i,e_j)]?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `Sylvester 2×2: a11=2>0, det=3>0. PD? (1=igen)`, 1, 'igen'];
        return [5, yn(`diag(0,1) pozitív definit?`), 0, 'szemidefinit'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `Q=||x||² standard, Q(3,4)=?`, 25, '25'];
        if (i % 5 === 1) return [6, yn(`Kongruens mátrixok ugyanazt a definitséget őrizhetik (Sylvester tehetetlenség)?`), 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`A kvadratikus forma polarizációs azonossággal visszanyeri B-t?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `[[1, 0],[0, 0]] szemidefinit? (1=igen)`, 1, 'igen'];
        return [6, yn(`Indefinit forma diagonalizálva + és − a D-n?`), 1, 'igen'];
    });
    return out;
}

/** LU- és QR-felbontás */
export function la4LuQr(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`LU: A=LU, L alsó, U felső háromszög?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`QR: A=QR, Q ortogonális, R felső háromszög?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`LU-val Ax=b két háromszög-rendszer?`), 1, 'igen'];
        return [1, yn(`GS-ből kapható QR?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`L főátlója gyakran 1 (Doolittle)?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Pivotálás nélkül LU nem mindig létezik?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `I=I·I LU? L=U=I (1,1)-eleme?`, 1, '1'];
        return [2, yn(`Q^T Q=I QR-ben?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`R diagonálja kapcsolódik A „hosszaihoz” GS után?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `diag(2,3) már U. det=?`, 6, '6'];
        if (i % 4 === 2) return [3, yn(`PA=LU pivotmátrixszal?`), 1, 'igen'];
        return [3, yn(`QR teljes oszloprangú A-ra létezik?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Householder QR numerikusan stabilabb, mint klasszikus GS?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Givens forgatással is készül QR?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `L=[[1,0],[2,1]], U=[[1,1],[0,1]], A=LU (2,1)-eleme?`, 2, '2·1+1·0=2'];
        return [4, `Ugyanezen A (1,1)-eleme?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Ly=b, Ux=y a kétrészes megoldás?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`R nem szinguláris, ha A teljes oszloprangú?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `Q=I, R=diag(4,1), A (2,2)=?`, 1, '1'];
        return [5, yn(`LU n³/3 flops nagyságrend (sűrű n×n)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Crout: U átlója 1?`), 1, 'variáns'];
        if (i % 5 === 1) return [6, yn(`Szinguláris A-nak nincs LU pivot nélkül?`), 1, 'gyakran'];
        if (i % 5 === 2) return [6, `[[1,0],[0,1]] QR-ben R lehet I. det R=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Thin QR m×n, m≥n esetén Q m×n?`), 1, 'igen'];
        return [6, yn(`A=QR ⇒ A^T A = R^T R?`), 1, 'Q^TQ=I'];
    });
    return out;
}

/** Householder- és Givens-transzformáció */
export function la4Householder(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Householder: I−2uu^T/||u||² tükrözés?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Householder ortogonális és szimmetrikus?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Givens: síkbeli forgatás mátrixa?`), 1, 'igen'];
        return [1, yn(`Givens-szel egy elem kinullázható?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `Givens c=cosθ, s=sinθ, c²+s²=?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`H²=I Householderre?`), 1, 'involúció'];
        if (i % 4 === 2) return [2, yn(`det H = −1 (tükrözés)?`), 1, 'igen'];
        return [2, yn(`QR Householder-rel oszloponként nulláz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `Forgatás 0°: c=?`, 1, '1'];
        if (i % 4 === 1) return [3, `Forgatás 90°: c=?`, 0, '0'];
        if (i % 4 === 2) return [3, yn(`Givens mátrix ortogonális?`), 1, 'igen'];
        return [3, yn(`Householder vektort egy koordinátatengelyre visz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Numerikus QR-ben Householder preferált GS-sel szemben?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Givens ritka mátrixnál előnyös lehet?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `I−2ee^T ha e=e1, (1,1)-elem? e1=(1,0), 1−2=?`, -1, '−1'];
        return [4, yn(`Tükrözés megtartja a hosszat?`), 1, 'ortogonális'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Sorozat Householder = QR?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `sin 0°=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Givens 2×2 blokk a (i,j) síkon?`), 1, 'igen'];
        return [5, yn(`det Givens = +1 (forgatás)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Householder unitér ℂ-n is értelmezhető?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`A tükrözés hipersíkra történik?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `||Hx||=||x||. ||(3,4)|| marad?`, 5, '5'];
        if (i % 5 === 3) return [6, yn(`A QR-algoritmus Givens/Householder lépéseket használhat?`), 1, 'igen'];
        return [6, yn(`Egyetlen Givens nem csinál teljes QR-t nagy mátrixra?`), 1, 'sok kell'];
    });
    return out;
}

/** SVD és pszeudoinverz */
export function la4Svd(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`SVD: A=UΣV^T?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Σ diagonális, szinguláris értékek ≥0?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`U,V ortogonális (valós SVD)?`), 1, 'igen'];
        return [1, yn(`rank A = pozitív szinguláris értékek száma?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `σ_i = √λ_i(A^T A). I₂-re σ=?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`A^+ Moore–Penrose-pszeudoinverz?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Invertálható A-ra A^+=A^{-1}?`), 1, 'igen'];
        return [2, yn(`Túlhatározott rendszer: legkisebb négyzetek?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Normálegyenlet: A^T A x = A^T b?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `min ||Ax−b||, A=I, b=(3,4), ||r|| ha x=b?`, 0, '0'];
        if (i % 4 === 2) return [3, yn(`SVD a legjobb k-rangú közelítés (Eckart–Young)?`), 1, 'igen'];
        return [3, `diag(5,0) rangja?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`A^+ = V Σ^+ U^T?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Σ^+ : 1/σ ha σ≠0. σ=2, 1/σ=?`, 0.5, '0,5'];
        if (i % 4 === 2) return [4, yn(`AA^+ A = A (Penrose-axióma)?`), 1, 'igen'];
        return [4, yn(`Szinguláris értékek A^T A sajátértékeinek gyökei?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `||A||_2 = σ_max. diag(3,1) spektrálnorma?`, 3, '3'];
        if (i % 4 === 1) return [5, yn(`Bal/jobb szinguláris vektorok U/V oszlopai?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Alulhatározott: minimális ||x|| megoldás A^+ b?`), 1, 'igen'];
        return [5, `σ_min=0 ⇒ A szinguláris négyzetes esetben? (1=igen)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Kondíciószám κ=σ_max/σ_min?`), 1, '2-norma'];
        if (i % 5 === 1) return [6, `κ(I)=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Truncated SVD zajszűrésre jó?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `[[2,0],[0,0]]^+ (1,1) 1/2? érték?`, 0.5, '0,5'];
        return [6, yn(`A A^+ az oszloptérre projekció (teljes oszloprangnál)?`), 1, 'igen'];
    });
    return out;
}

/** Jordan- és Schur-felbontás */
export function la4Jordan(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Schur: A=Q T Q^* , T felső háromszög?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Jordan: A=P J P^{-1}?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Jordan-blokk λ-val szuperdiagonális 1-ek?`), 1, 'igen'];
        return [1, yn(`Általánosított sajátvektor kell, ha defektív?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `2×2 Jordan λ, J (1,2)-eleme?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`Diagonalizálható ⇔ J diagonális?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`ℂ felett Schur mindig létezik?`), 1, 'igen'];
        return [2, yn(`T átlója a sajátértékek Schur-nál?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Jordan-lánc: (A−λI)v_{k}=v_{k−1}?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `Blokkméret 1: geometriai = algebrai arra a láncra? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Minimálpolinom foka = legnagyobb Jordan-blokk mérete λ-nként?`), 1, 'igen'];
        return [3, yn(`Valós Schur-blokk 2×2 lehet komplex konjugált párra?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Nilpotens Jordan-blokk λ=0?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `J=[[0,1],[0,0]], J²=? (1,1)`, 0, '0'];
        if (i % 4 === 2) return [4, yn(`Unicitás: Jordan-blokkok méretei egyértelműek?`), 1, 'igen'];
        return [4, yn(`Schur unitér hasonlóság?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Normális mátrix Schur-alakja diagonális?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `3×3 egyetlen Jordan-blokk λ=2, algebrai multiplicitás?`, 3, '3'];
        if (i % 4 === 2) return [5, yn(`Geometriai multiplicitás = Jordan-blokkok száma λ-ra?`), 1, 'igen'];
        return [5, yn(`P oszlopai (általánosított) sajátvektorok?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Minden mátrix hasonló a Jordan-alakjához ℂ-n?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Valós mátrixnak nem mindig van valós Jordan?`), 1, 'komplex λ'];
        if (i % 5 === 2) return [6, `J=diag(5,5) már diagonális. (2,2)=?`, 5, '5'];
        if (i % 5 === 3) return [6, yn(`QR-algoritmus Schur-alakhoz konvergálhat?`), 1, 'igen'];
        return [6, yn(`Két Jordan-blokk ugyanarra λ-ra: geometriai ≥2?`), 1, 'igen'];
    });
    return out;
}

/** Mátrixnormák, kondíciószám és alkalmazások */
export function la4Normak(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Frobenius: ||A||_F = √∑ a_{ij}²?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `||I₂||_F három tizedesjegyre (√2)?`, 1.414, '√2≈1,414'];
        if (i % 4 === 2) return [1, yn(`Indukált norma ||A||=sup_{||x||=1}||Ax||?`), 1, 'igen'];
        return [1, yn(`κ(A)=||A|| ||A^{-1}||?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `||I||_2 = ?`, 1, '1'];
        if (i % 4 === 1) return [2, `κ(I)=?`, 1, '1'];
        if (i % 4 === 2) return [2, yn(`Nagy κ numerikusan érzékeny rendszer?`), 1, 'igen'];
        return [2, `||diag(3,0)||_2 = σ_max=?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`||Ax|| ≤ ||A|| ||x||?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Ekvivalens normák véges dimenzióban?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `||(3,4)||_2=?`, 5, '5'];
        return [3, `||(3,4)||_1=?`, 7, '7'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `||(3,4)||_∞=?`, 4, '4'];
        if (i % 4 === 1) return [4, yn(`Spektrálnorma = σ_max?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`||AB|| ≤ ||A|| ||B|| szubmultiplikatív?`), 1, 'igen'];
        return [4, `κ(diag(10, 0.1))=10/0.1?`, 100, '100'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Duális tér V^* lineáris funkcionálok?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Önadjungált: ⟨Tx,y⟩=⟨x,Ty⟩?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Unitér: U^* U=I?`), 1, 'igen'];
        return [5, yn(`Normális: TT^*=T^*T?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `||[[1,0],[0,0]]||_F=?`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Kondíció relatív hibát erősíthet?`), 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Ortogonális operátor valós belső szorzatot tart?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `||0|| mátrixnorma?`, 0, '0'];
        return [6, yn(`Biduális V^{**} izomorf V-vel véges dimenzióban?`), 1, 'igen'];
    });
    return out;
}
