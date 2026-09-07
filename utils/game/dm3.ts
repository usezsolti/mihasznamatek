import type { LaRow as DmRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DmRow[], make: (i: number) => DmRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Extremális gráfelmélet */
export function dm3Extrem(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Extremális: max/min struktúra tiltott rész nélkül?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`ex(n,H) max él H-mentes n-csúcsún?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `ex(3,K_3)=3 (P_3 vagy élek). C_3-mentes n=3 max él út? 2=?`, 2, '2'];
        return [1, yn(`Erdős: extremális kombinatorika program?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Tiltott részgráf vs minor vs feszített?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `n=2, max él K_2=1. 1=?`, 1, '1'];
        if (i % 4 === 2) return [2, yn(`Stabilizálódás: Turán-sűrűség?`), 1, 'igen'];
        return [2, yn(`Erdős–Stone: χ(H) határozza a sűrűséget?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Háromszögmentes = K_3-mentes?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Páros gráfok K_3-mentesek?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `K_{2,2} élszám 4. 4=?`, 4, '4'];
        return [3, yn(`Zarankiewicz: K_{s,t}-mentes?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Degenerált extremális: fa-mentes O(n)?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `fa n csúcs max n-1 él körmentes. n=5?`, 4, '4'];
        if (i % 4 === 2) return [4, yn(`Even-cycle: C_4-mentes?`), 1, 'igen'];
        return [4, yn(`Részgráf-számolás vs élszám?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `ex(n,K_2)=0 n≥1? K_2-mentes üres. |E|=?`, 0, '0'];
        if (i % 4 === 1) return [5, yn(`Aszimptotika ~ konstans · n^2?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Konstrukció + felső becslés?`), 1, 'igen'];
        return [5, yn(`Flag algebra haladó eszköz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Superszaturáció: plusz él sok H-t szül?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `n=1 ex bármi 0. 0=?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Stabilitás: extremális közel Turán?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Hypergraph extremális is?`), 1, 'igen'];
        return [6, yn(`Cél: éles konstans / pontos ex?`), 1, 'igen'];
    });
    return out;
}

/** Mantel- és Turán-elmélet */
export function dm3Turan(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Mantel: K_3-mentes |E|≤⌊n²/4⌋?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `n=4, ⌊16/4⌋=?`, 4, '4'];
        if (i % 4 === 2) return [1, `n=5, ⌊25/4⌋=?`, 6, '6'];
        return [1, yn(`Egyenlőség: T_2(n)=K_{⌊n/2⌋,⌈n/2⌉}?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Turán T_r(n): r osztály, közel egyenlő, teljes r-osztású?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`T_r(n) K_{r+1}-mentes?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `T_2(2)=K_{1,1} |E|=?`, 1, '1'];
        return [2, `T_2(3)=K_{1,2} |E|=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Turán-tétel: max K_{r+1}-mentes = T_r(n)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `r=1, T_1(n) üres |E|=?`, 0, '0'];
        if (i % 4 === 2) return [3, `n=6 Mantel ⌊36/4⌋=?`, 9, '9'];
        return [3, yn(`K_{2,2}=C_4 ≠ Turán K_3?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `T_2(4)=K_{2,2} |E|=4. 4=?`, 4, '4'];
        if (i % 4 === 1) return [4, yn(`Zykov szimmetrizáció?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Cauchy-Schwarz Mantel-bizonyítás?`), 1, 'igen'];
        return [4, `⌊9/4⌋ n=3 Mantel=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Erdős–Stone: ex(n,H)/C(n,2)→1-1/(χ(H)-1)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `χ(K_3)=3, 1-1/2=1/2. sűrűség 0.5? (1)`, 1, 'igen'];
        if (i % 4 === 2) return [5, `n=8, n²/4=16. 16=?`, 16, '16'];
        return [5, yn(`T_3(n) K_4-mentes?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `n=7, ⌊49/4⌋=?`, 12, '12'];
        if (i % 5 === 1) return [6, yn(`Osztályméretek ⌊n/r⌋ vagy ⌈n/r⌉?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `T_2(1) |E|=?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Plus one él ⇒ K_{r+1}?`), 1, 'igen'];
        return [6, yn(`Mantel = Turán r=2?`), 1, 'igen'];
    });
    return out;
}

/** Ramsey-elmélet */
export function dm3Ramsey(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`R(s,t): kényszer K_s vagy komplement K_t?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `R(3,3)=6. 6=?`, 6, '6'];
        if (i % 4 === 2) return [1, `R(2,k)=k. R(2,4)=?`, 4, '4'];
        return [1, yn(`R(s,t)=R(t,s) szimmetria?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Ramsey: elég nagy ⇒ rendezettség?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `R(3,2)=3. 3=?`, 3, '3'];
        if (i % 4 === 2) return [2, yn(`Végtelen Ramsey is van?`), 1, 'igen'];
        return [2, yn(`C_5 mutatja R(3,3)>5?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`2-színezett élek K_n?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Multicolor R(3,3,3)=17?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `alsó korlát R(3,3)-1=5. 5=?`, 5, '5'];
        return [3, yn(`Erdős véletlen alsó korlát?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `R(s,1) értelmetlen; R(s,2)=s. s=7?`, 7, '7'];
        if (i % 4 === 1) return [4, yn(`Schur, van der Waerden rokon?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Graph Ramsey R(H1,H2) is?`), 1, 'igen'];
        return [4, yn(`Felső: R(s,t)≤R(s-1,t)+R(s,t-1)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `R(3,4)=?`, 9, '9'];
        if (i % 4 === 1) return [5, yn(`Kiszámítás R(5,5) nyitott pontosan?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `R(3,3)-R(2,3)=6-3=?`, 3, '3'];
        return [5, yn(`Komplementer színezés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `R(4,2)=4. 4=?`, 4, '4'];
        if (i % 5 === 1) return [6, yn(`Party-probléma: 6 ember R(3,3)?`), 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Végtelen: végtelen monokromatikus?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `alsó 5, felső 6, R(3,3)=6. 6=?`, 6, '6'];
        return [6, yn(`Ramsey-számok nőnek gyorsan?`), 1, 'igen'];
    });
    return out;
}

/** Hipergráfok és extremális halmazrendszerek */
export function dm3Hiper(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Hiperél: ≥2 (akár >2) csúcs?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`k-uniform: minden él k elem?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `2-uniform = közönséges gráf? (1)`, 1, 'igen'];
        return [1, yn(`Sperner: max antichain C(n,⌊n/2⌋)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `C(4,2)=6 Sperner n=4. 6=?`, 6, '6'];
        if (i % 4 === 1) return [2, yn(`Metsző család: A∩B≠∅?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`EKR: r-uniform metsző max C(n-1,r-1)?`), 1, 'igen'];
        return [2, yn(`Boolean-rács 2^n halmaz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `2^3=8. 8=?`, 8, '8'];
        if (i % 4 === 1) return [3, yn(`Blokkrendszer: kiegyensúlyozott design?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Steiner S(2,3,7) Fano |B|=7?`), 1, 'igen'];
        return [3, `C(5,2)=10. 10=?`, 10, '10'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`LYM egyenlőtlenség Spernerhez?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Shadow / Kruskal–Katona?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `n=1 Sperner C(1,0)=1. 1=?`, 1, '1'];
        return [4, yn(`Csillag: minden él egy közös ponton?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `EKR n=5,r=2, C(4,1)=4. 4=?`, 4, '4'];
        if (i % 4 === 1) return [5, yn(`t-metsző: |A∩B|≥t?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Hipergráf kromatikus szám is?`), 1, 'igen'];
        return [5, yn(`Turán hipergráfra nyitott T(n,k,r)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `C(6,3)=20. 20=?`, 20, '20'];
        if (i % 5 === 1) return [6, yn(`Incidencia-struktúra pontok+blokkok?`), 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Antichain: semelyik nem tartalmazza a másikat?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `2-uniform 3-élű hiperél? (0=nem, él 2 pont)`, 0, 'nem'];
        return [6, yn(`Extremális család: tiltott konfiguráció?`), 1, 'igen'];
    });
    return out;
}

/** Valószínűségi és lineáris algebrai módszerek */
export function dm3Prob(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`P(A)>0 ⇒ A előfordulhat?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Első momentum: E[X]<1 ⇒ van X=0?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `E[X]=0.5<1, létezik X=0? (1)`, 1, 'igen'];
        return [1, yn(`Véletlen gráf G(n,p)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Alteráció / deletion method?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Lovász Local Lemma?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Második momentum Var?`), 1, 'igen'];
        return [2, yn(`Incidenciamátrix rangja korlát?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Lineáris algebrai: vektorok függetlensége?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Fisher-egyenlőtlenség designokra?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `rang ≤ n. n=4 max rang?`, 4, '4'];
        return [3, yn(`Spektrum A(G) sajátértékei?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Laplace L=D-A?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Kirchhoff kofaktor = feszítőfák?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `K_n spektrum n-1, -1,... tr=0. tr(A)=?`, 0, '0'];
        return [4, yn(`Expander sajátérték-rés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Kromatikus vs spektrum?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `E[X]=2, nem zárja ki X=0. E=?`, 2, '2'];
        if (i % 4 === 2) return [5, yn(`Lineáris függés ⇒ konfiguráció-korlát?`), 1, 'igen'];
        return [5, yn(`Véletlen színezés / partíció?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Probabilisztikus ≠ konstrukció mindig?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `P=0 ⇒ soha. 0=?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Sajátvektor-partíció?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Mátrix-fa tétel algebrai?`), 1, 'igen'];
        return [6, yn(`Kombinálható a két módszer?`), 1, 'igen'];
    });
    return out;
}

/** Polinomos módszer és haladó kombinatorika */
export function dm3Polinom(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Combinatorial Nullstellensatz Alon?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Polinom nemnulla ⇒ konfiguráció?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Foka k, ≤k gyök egy változóban (test)?`), 1, 'igen'];
        return [1, `deg(x^3)=3. 3=?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Cauchy–Davenport polinommal is?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Chevalley–Warning?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `konstans polinom deg 0. 0=?`, 0, '0'];
        return [2, yn(`Koefficiens nemnulla CNS feltétel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Kaplansky / finite field method?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Síkban irányok: distinct distances rokon?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `2 változó, deg_x 2. 2=?`, 2, '2'];
        return [3, yn(`Nullstellensatz algebrai geometria gyökere?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Graph polynomial / chromatic polynomial?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `χ-polinom P(K_1,k)=k. k=5?`, 5, '5'];
        if (i % 4 === 2) return [4, yn(`Tételek véges testen?`), 1, 'igen'];
        return [4, yn(`Kombinatorikus Nullstellensatz grid-en?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Haladó: flag algebra + spektrum + polinom?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `1+x+x^2 deg=?`, 2, '2'];
        if (i % 4 === 2) return [5, yn(`Nem létezés: azonosan 0 polinom?`), 1, 'igen'];
        return [5, yn(`Explicit konstrukció vs létezés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Alon–Füredi / covering?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `x^0=1. 1=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Számelmélet + kombinatorika találkozó?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Roadmap vége: extremális+algebrai?`), 1, 'igen'];
        return [6, yn(`Polinom foka korlátozza a zérusokat?`), 1, 'igen'];
    });
    return out;
}
