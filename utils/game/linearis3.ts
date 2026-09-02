import type { LaRow } from './linearisTypes';
import { det2, yn } from './linearisTypes';

function push20(out: LaRow[], make: (i: number) => LaRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Sajátérték és sajátvektor */
export function la3Sajatvektor(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Av=λv, v≠0 esetén v sajátvektor?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`λ sajátérték, ha van nemnulla v: Av=λv?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `diag(2, 5) sajátértéke lehet 2? (1=igen)`, 1, 'igen'];
        return [1, `Mennyi A=2I₂ sajátértéke (mindkettő)?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `Mennyi [[3, 0],[0, 1]] egyik sajátértéke (a nagyobb)?`, 3, '3'];
        if (i % 4 === 1) return [2, yn(`Sajátaltér = ker(A−λI)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`A 0 lehet sajátérték?`), 1, 'ha szinguláris'];
        return [2, `Ha Av=0, v≠0, mennyi λ?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Sajátvektor skalárszorosa (nem 0) is sajátvektor ugyanarra λ-ra?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `T(x,y)=(2x, 2y) sajátértéke?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Különböző sajátértékű sajátvektorok függetlenek?`), 1, 'igen'];
        return [3, `I₃ sajátértéke?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `[[1, 1],[0, 1]] sajátértéke (Jordan)?`, 1, '1'];
        if (i % 4 === 1) return [4, yn(`Háromszögmátrix sajátértékei a főátló elemei?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `Mennyi det(A−λI) gyökei? sajátértékek (1=igen)`, 1, 'igen'];
        return [4, `diag(4, −1) kisebb sajátértéke?`, -1, '−1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Sajátaltér mindig tartalmazza a 0-t?`), 1, 'altér'];
        if (i % 4 === 1) return [5, `A=0_{2×2} sajátértéke?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Minden 2×2 valós mátrixnak van valós sajátértéke?`), 0, 'forgatás'];
        return [5, `90°-os forgatás ℝ²-ben valós sajátértékeinek száma?`, 0, 'nincs nemnulla Av=λv'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Av=λv ⇔ (A−λI)v=0?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `[[5, 0],[0, 5]] sajátaltér dimenziója λ=5-re?`, 2, 'egész sík'];
        if (i % 5 === 2) return [6, yn(`Sajátvektor soha nem a zérusvektor?`), 1, 'definíció'];
        if (i % 5 === 3) return [6, `trace diag(2, 7) = sajátértékek összege? mennyi?`, 9, '9'];
        return [6, `det diag(2, 7) = sajátértékek szorzata? mennyi?`, 14, '14'];
    });
    return out;
}

/** Karakterisztikus polinom és sajátalterek */
export function la3Karpolinom(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`p_A(λ)=det(A−λI)?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Sajátértékek p_A gyökei?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `deg p_A egy n×n mátrixra? n=3`, 3, '3'];
        return [1, `p_I(λ)=(1−λ)^n, n=2: p_I(0)=?`, 1, '1'];
    });
    push20(out, (i) => {
        const d = det2(2, 0, 0, 3);
        if (i % 4 === 0) return [2, `A=diag(2,3), p_A(0)=det A = ?`, d, '6'];
        if (i % 4 === 1) return [2, `A=diag(1,1), p_A(1)=?`, 0, 'gyök'];
        if (i % 4 === 2) return [2, yn(`E_λ = ker(A−λI)?`), 1, 'igen'];
        return [2, `dim E_λ a geometriai multiplicitás? (1=igen)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `[[2, 0],[0, 2]] karakterisztikus polinomja (λ−2)^2. p(2)=?`, 0, '0'];
        if (i % 4 === 1) return [3, yn(`Hasonló mátrixok karakterisztikus polinomja azonos?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `p_A vezetőegyütthatója n=2-re (λ² együttható, p=det(A−λI) konvenciónál (−1)^n)? det(A−λI) λ² együtthatója?`, 1, '(−λ)^2'];
        return [3, yn(`Cayley–Hamilton: p_A(A)=0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Algebrai multiplicitás: (λ−2)^3-ban a 2 rendje?`, 3, '3'];
        if (i % 4 === 1) return [4, yn(`Geometriai multiplicitás ≤ algebrai?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `Ha λ egyszerű gyök, dim E_λ = ?`, 1, '1'];
        return [4, yn(`Sajátaltér dimenziója legalább 1, ha λ sajátérték?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Hasonló mátrixok sajátértékei azonosak?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `p_A(λ)=det(A−λI), A=0_{2×2}, p(0)=?`, 0, 'det 0'];
        if (i % 4 === 2) return [5, yn(`A sajátaltér T-invariáns?`), 1, 'igen'];
        return [5, `dim ker(A−λI) ha A=λI_2?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `trace A = sajátértékek összege. trace I₃=?`, 3, '3'];
        if (i % 5 === 1) return [6, `det A = sajátértékek szorzata. det I₃=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`p_{A^T}=p_A?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `[[0, −1],[1, 0]] valós sajátértékeinek száma?`, 0, '±i'];
        return [6, yn(`A karakterisztikus polinom monikus, ha det(λI−A)-t használjuk?`), 1, 'igen'];
    });
    return out;
}

/** Multiplicitások */
export function la3Multiplicitas(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Algebrai multiplicitás: gyök multiplicitása p_A-ban?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Geometriai multiplicitás: dim E_λ?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `Ha p=(λ−2)^3, a 2 algebrai multiplicitása?`, 3, '3'];
        return [1, yn(`1 ≤ geo ≤ alg mindig?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `Egyszerű sajátérték algebrai multiplicitása?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`Ha geo < alg, a mátrix defektív arra a λ-ra?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `diag(5,5,5) λ=5 algebrai multiplicitása?`, 3, '3'];
        return [2, `diag(5,5,5) λ=5 geometriai multiplicitása?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `Jordan [[λ,1],[0,λ]] geometriai multiplicitása?`, 1, '1'];
        if (i % 4 === 1) return [3, `Ugyanennek algebrai multiplicitása?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`A multiplicitások összege n egy n×n mátrixra (ℂ)?`), 1, 'igen'];
        return [3, yn(`I_n-re az 1 algebrai multiplicitása n?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Diagonalizálható, ha minden λ-ra geo=alg?`), 1, 'ℂ-n felbomló p_A'];
        if (i % 4 === 1) return [4, `[[1,1],[0,1]] λ=1 geo=?`, 1, '1'];
        if (i % 4 === 2) return [4, `[[1,0],[0,1]] λ=1 geo=?`, 2, '2'];
        return [4, yn(`Különböző sajátértékek sajátalterei csak a 0-ban metszik egymást?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`A karakterisztikus polinom foka = n?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `p=(λ−1)(λ−2)^2, a 2 algebrai multiplicitása?`, 2, '2'];
        if (i % 4 === 2) return [5, yn(`Geometriai multiplicitás legalább 1 sajátértéknél?`), 1, 'igen'];
        return [5, yn(`Trace = algebrai multiplicitással súlyozott sajátérték-összeg?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`det = sajátértékek szorzata multiplicitással?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `0 sajátérték algebrai multiplicitása = dim ker A^k stabilizálódva (általánosított)? n=rank-korlát. rank I₃, 0 multiplicitása?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Többszörös gyök nem jelenti automatikusan, hogy nem diagonalizálható?`), 1, 'I_n példa'];
        if (i % 5 === 3) return [6, `A 2×2 I mátrixban hány sajátérték van multiplicitással?`, 2, '2'];
        return [6, yn(`Sajátaltér direkt összege a tér, ha diagonalizálható?`), 1, 'igen'];
    });
    return out;
}

/** Diagonalizálás és Cayley–Hamilton-tétel */
export function la3Diagonal(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`A=PDP^{-1} a diagonalizálás?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`D diagonális a sajátértékekkel?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`P oszlopai sajátvektorok?`), 1, 'igen'];
        return [1, yn(`Minden mátrix diagonalizálható ℂ felett?`), 0, 'Jordan'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`n független sajátvektor ⇒ n×n diagonalizálható?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `A^n = P D^n P^{-1}. D=diag(2,1), D² (1,1)=?`, 4, '4'];
        if (i % 4 === 2) return [2, yn(`Cayley–Hamilton: minden négyzetes mátrix kielégíti p_A-t?`), 1, 'igen'];
        return [2, `[[0, 1],[0, 0]]² (1,2)-eleme?`, 0, 'nilpotens'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Ha van n különböző sajátérték, diagonalizálható?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`A 2×2 nemtriviális Jordan-blokk nem diagonalizálható?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `diag(1,2,3) diagonalizálható? (1=igen)`, 1, 'már diagonális'];
        return [3, yn(`Hasonló mátrixok együtt diagonalizálhatók?`), 0, 'nem feltétlen együtt'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `p_A(t)=t²−5t+6, A-ra A²−5A+6I=0. 6I (1,1) ha I₂?`, 6, '6'];
        if (i % 4 === 1) return [4, yn(`Minimálpolinom osztója a karakterisztikusnak?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Diagonalizálható ⇔ minimálpolinom szimple gyökű?`), 1, 'felbomlik és négyzetmentes'];
        return [4, `D=diag(2,2), D³ (2,2)=?`, 8, '8'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`A^k számítása diagonalizálással olcsó, ha D ismert?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Projektív felbontás spektrálból jön szimmetrikus esetben?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `Ha P=I, A=D, A⁵ (1,1) D=diag(2,0)?`, 32, '32'];
        return [5, yn(`Defektív mátrix: geometriai < algebrai multiplicitás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`ℂ felett minden mátrixnak van Jordan-alakja?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `Nilpotens index 2: N²=0. N≠0 lehet diagonalizálható? (1=igen)`, 0, 'csak 0'];
        if (i % 5 === 2) return [6, yn(`CH-tételből A^{-1} polinomja A-nak, ha det≠0?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `diag(1,−1)² (1,1)=?`, 1, '1'];
        return [6, yn(`Két diagonalizálható mátrix szorzata diagonalizálható?`), 0, 'nem mindig'];
    });
    return out;
}

/** Belső szorzat és Gram–Schmidt */
export function la3GramSchmidt(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `Mennyi ⟨(1,0),(0,1)⟩ (standard)?`, 0, '0'];
        if (i % 4 === 1) return [1, `Mennyi ⟨(1,2),(3,4)⟩?`, 11, '3+8=11'];
        if (i % 4 === 2) return [1, yn(`⟨x,x⟩ ≥ 0?`), 1, 'igen'];
        return [1, `Mennyi ||(3,4)||?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Cauchy–Schwarz: |⟨x,y⟩| ≤ ||x|| ||y||?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `|(3,4)·(1,0)| ≤ 5·1. Bal oldal?`, 3, '3'];
        if (i % 4 === 2) return [2, yn(`Egyenlőség CS-ben ⇔ lineárisan függő vektorok?`), 1, 'igen'];
        return [2, yn(`⟨x,y⟩=0 ortogonalitás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Ortonormált: ortogonális és egységnyi?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`A standard bázis ONB?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `proj_{(1,0)}(3,4) első koordinátája?`, 3, '3'];
        return [3, `proj_{(1,0)}(3,4) második koordinátája?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Gram–Schmidt független rendszerből ONB-t csinál?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `u1=v1/||v1||. v1=(0,4), ||v1||=?`, 4, '4'];
        if (i % 4 === 2) return [4, yn(`Ortogonális rendszer nemnulla vektorai függetlenek?`), 1, 'igen'];
        return [4, `⟨(1,1),(1,−1)⟩=?`, 0, 'ortogonális'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Q^T Q = I ortogonális mátrixra?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Ortogonális Q-ra Q^{-1}=Q^T?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `proj_u v = ⟨v,u⟩/⟨u,u⟩ u. u=(2,0), v=(2,2), együttható ⟨v,u⟩/⟨u,u⟩=?`, 0.5, '4/8=0,5'];
        return [5, yn(`Belső szorzat lineáris az első változóban?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Norma ||x||=√⟨x,x⟩?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Távolság ||x−y||?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `||(1,0,0)||?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`GS elhasal, ha a rendszer függő?`), 1, 'nullvektor léphet fel'];
        return [6, yn(`Szög cos θ = ⟨x,y⟩/(||x||||y||)?`), 1, 'igen'];
    });
    return out;
}

/** Spektráltétel és ortogonális diagonalizálás */
export function la3Spektral(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Szimmetrikus: A^T=A?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Valós szimmetrikus ortogonálisan diagonalizálható?`), 1, 'spektráltétel'];
        if (i % 4 === 2) return [1, yn(`A=Q D Q^T spektrálfelbontás szimmetrikusra?`), 1, 'igen'];
        return [1, yn(`Szimmetrikus mátrix sajátértékei valósak?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Különböző λ sajátterei ortogonálisak szimmetrikus A-nál?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `[[2, 0],[0, 3]] már szimmetrikus? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Ortogonális mátrix oszlopai ONB?`), 1, 'igen'];
        return [2, `Q=I, D=diag(4,1), A=QDQ^T (1,1)=?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Spektrálfelbontás: összeg λ_i P_i projekciókkal?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`[[0, 1],[−1, 0]] szimmetrikus?`), 0, 'ferde'];
        if (i % 4 === 2) return [3, yn(`Valós szimmetrikus mindig diagonalizálható ℝ felett?`), 1, 'igen'];
        return [3, `[[1, 2],[2, 1]] szimmetrikus? (1=igen)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Q ortogonális ⇒ oszlopok ON sajátvektor-bázis lehet?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `det Q = ±1 ortogonálisra. det I=?`, 1, '1'];
        if (i % 4 === 2) return [4, yn(`Normális mátrix: AA^*=A^*A, unitér diagonalizálható ℂ-n?`), 1, 'igen'];
        return [4, yn(`Főtengelytétel a kvadratikus formákra a spektráltételből jön?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `A=diag(2,−3), spektrum max |λ|?`, 3, '3'];
        if (i % 4 === 1) return [5, yn(`Pozitív definit szimmetrikus: minden λ>0?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Projekció P²=P, szimmetrikus P önadjungált projekció?`), 1, 'igen'];
        return [5, `[[1, 0],[0, 0]] rangja (spektrál projekció)?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`A=∑ λ_i u_i u_i^T ON sajátvektorokra?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Komplex Hermite-mátrix unitér diagonalizálható?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Szimmetrikus 2×2: [[0,1],[1,0]] sajátértékei ±1. nagyobb?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Ortogonális diagonalizálás Q^{-1}=Q^T-t használ?`), 1, 'igen'];
        return [6, yn(`Minden valós mátrix ortogonálisan diagonalizálható?`), 0, 'csak szimmetrikus'];
    });
    return out;
}
