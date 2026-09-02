import type { LaRow } from './linearisTypes';
import { det2, yn } from './linearisTypes';

function push20(out: LaRow[], stage: 1 | 2 | 3 | 4 | 5 | 6, make: (i: number) => LaRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Vektorok és alapműveletek */
export function la1Vektorok(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, 1, (i) => {
        const a = i + 1;
        const b = i + 2;
        const c = 3;
        const d = 1;
        if (i % 4 === 0) return [1, `Mennyi (${a}, ${b})+(${c}, ${d}) első koordinátája?`, a + c, `${a}+${c}`];
        if (i % 4 === 1) return [1, `Mennyi (${a}, ${b})+(${c}, ${d}) második koordinátája?`, b + d, `${b}+${d}`];
        if (i % 4 === 2) return [1, `Mennyi ${2}·(${a}, ${b}) első koordinátája?`, 2 * a, `2·${a}`];
        return [1, yn(`Igaz-e, hogy (${a}, 0) párhuzamos az x-tengellyel ℝ²-ben?`), 1, 'második koordináta 0'];
    });
    push20(out, 2, (i) => {
        const a = i + 1;
        const b = 4;
        if (i % 4 === 0) return [2, `Mennyi (${a}, ${b})−(${1}, ${2}) első koordinátája?`, a - 1, `${a}−1`];
        if (i % 4 === 1) return [2, `Mennyi |(3, 4)|?`, 5, '√(9+16)=5'];
        if (i % 4 === 2) return [2, `Mennyi |(0, ${a + 1})|?`, a + 1, 'abszolút érték'];
        return [2, `Mennyi a (0,0) és (${3}, ${4}) pontok távolsága?`, 5, '5'];
    });
    push20(out, 3, (i) => {
        const a = i + 1;
        const b = 2;
        const c = 3;
        const d = 4;
        if (i % 5 === 0) return [3, `Mennyi (${a}, ${b})·(${c}, ${d})?`, a * c + b * d, 'skaláris szorzat'];
        if (i % 5 === 1) return [3, yn(`Merőleges-e (1, 0) és (0, ${a})?`), 1, 'skaláris szorzat 0'];
        if (i % 5 === 2) return [3, yn(`Merőleges-e (${a}, 0) és (${a}, 0)?`), a === 0 ? 1 : 0, 'párhuzamos, nem merőleges ha nem 0'];
        if (i % 5 === 3) return [3, `Mennyi |(6, 8)|?`, 10, '10'];
        return [3, `Mennyi (1, 2, 3)·(0, 0, ${a})?`, 3 * a, '3a'];
    });
    push20(out, 4, (i) => {
        const a = i + 1;
        if (i % 4 === 0) return [4, `Mennyi (2, 0, 0)×(0, 3, 0) harmadik (k) koordinátája?`, 6, 'i×j=k, 2·3=6'];
        if (i % 4 === 1) return [4, yn(`A vektoriális szorzat merőleges mindkét tényezőre?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `Mennyi |(1, 0)×(0, 1)| (síkbeli terület)?`, 1, '1'];
        return [4, `Mennyi a ${a}(1, 0)+2(0, 1) második koordinátája?`, 2, 'lineáris kombináció'];
    });
    push20(out, 5, (i) => {
        if (i % 4 === 0) return [5, `Mennyi a vegyes szorzat (1,0,0)·((0,1,0)×(0,0,1))?`, 1, 'térfogat=1'];
        if (i % 4 === 1) return [5, yn(`Ha a×b=0 és a,b ≠ 0, akkor a és b párhuzamos?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `Mennyi |(3, 0, 0)×(0, 4, 0)|?`, 12, '12'];
        return [5, yn(`A skaláris szorzat kommutatív?`), 1, 'igen'];
    });
    push20(out, 6, (i) => {
        const a = i + 1;
        if (i % 5 === 0) return [6, `A (0,0,${a}) pont illeszkedik a z-tengelyre? (1=igen, 0=nem)`, 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Két nemnulla merőleges vektor skaláris szorzata 0?`), 1, 'definíció'];
        if (i % 5 === 2) return [6, `Mennyi ||(1,2,2)||?`, 3, '√9=3'];
        if (i % 5 === 3) return [6, `Mennyi (1,−1,0)·(1,1,${a})?`, 0, '1−1+0'];
        return [6, yn(`ℝ³-ban a standard bázis ortogonális?`), 1, 'igen'];
    });
    return out;
}

/** Mátrixműveletek */
export function la1MxMuveletek(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, 1, (i) => {
        const a = i + 1;
        if (i % 4 === 0) return [1, `Hány sora van egy 2×3-as mátrixnak?`, 2, '2'];
        if (i % 4 === 1) return [1, `Hány oszlopa van egy 2×3-as mátrixnak?`, 3, '3'];
        if (i % 4 === 2) return [1, `Mennyi [[${a}, 0],[0, 1]]+[[1, 0],[0, 2]] (1,1)-eleme?`, a + 1, `${a}+1`];
        return [1, yn(`Az I₂ egységmátrix 2×2-es?`), 1, 'igen'];
    });
    push20(out, 2, (i) => {
        const a = i + 1;
        if (i % 4 === 0) return [2, `Mennyi 3·[[1, 0],[0, ${a}]] (2,2)-eleme?`, 3 * a, `3·${a}`];
        if (i % 4 === 1) return [2, `Mennyi [[1, ${a}],[2, 3]]^T (1,2)-eleme?`, 2, 'transzponált'];
        if (i % 4 === 2) return [2, yn(`A transzponálás kétszer alkalmazva identitás?`), 1, '(A^T)^T=A'];
        return [2, `Mennyi a 3×3-as zérusmátrix (2,2)-eleme?`, 0, '0'];
    });
    push20(out, 3, (i) => {
        const a = i + 1;
        if (i % 4 === 0) return [3, `Mennyi [[1, 2],[3, 4]]·[[5, 0],[0, 1]] (1,1)-eleme?`, 5, '1·5+2·0=5'];
        if (i % 4 === 1) return [3, `Mennyi [[2, 0],[0, 3]]·[[${a}, 0],[0, 1]] (1,1)-eleme?`, 2 * a, `2·${a}`];
        if (i % 4 === 2) return [3, yn(`Mátrixszorzás mindig kommutatív?`), 0, 'nem'];
        return [3, `Mennyi I₂·[[${a}, 1],[0, 2]] (1,1)-eleme?`, a, 'I A = A'];
    });
    push20(out, 4, (i) => {
        if (i % 4 === 0) return [4, yn(`(AB)^T = B^T A^T?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Mennyi [[2, 0],[0, 2]]² (1,1)-eleme?`, 4, '4'];
        if (i % 4 === 2) return [4, yn(`Diagonális mátrix szorzata diagonális?`), 1, 'igen'];
        return [4, `Mennyi a 2×2-es skalármátrix 5I (2,2)-eleme?`, 5, '5'];
    });
    push20(out, 5, (i) => {
        const a = i + 1;
        if (i % 4 === 0) return [5, yn(`A négyzetes mátrix sorainak száma egyenlő az oszlopokéval?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `Mennyi [[0, 1],[${a}, 0]]·[[0, 1],[${a}, 0]] (1,1)-eleme?`, a, '1·a=a'];
        if (i % 4 === 2) return [5, yn(`Felső háromszögmátrixban a főátló alatt csupa 0 van?`), 1, 'igen'];
        return [5, `Hány eleme van egy 3×3-as mátrixnak?`, 9, '9'];
    });
    push20(out, 6, (i) => {
        if (i % 5 === 0) return [6, yn(`(A+B)^T = A^T+B^T?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `Mennyi [[1, 1],[0, 1]]² (1,2)-eleme?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Az egységmátrix diagonális?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `Mennyi 0·A (tetszőleges A) (1,1)-eleme, ha A=[ [7,1],[2,3] ]?`, 0, '0'];
        return [6, yn(`Két azonos méretű mátrix mindig összeszorozható?`), 0, 'oszlop=sor kell'];
    });
    return out;
}

/** Lineáris egyenletrendszerek és Gauss-elimináció */
export function la1Gauss(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, 1, (i) => {
        if (i % 4 === 0) return [1, `Az x+y=3, x−y=1 rendszerben mennyi x?`, 2, 'összeadva 2x=4'];
        if (i % 4 === 1) return [1, `Az x+y=3, x−y=1 rendszerben mennyi y?`, 1, 'y=1'];
        if (i % 4 === 2) return [1, yn(`A 0x=0 egyenlet mindig teljesül?`), 1, 'igen'];
        return [1, yn(`A homogén Ax=0 rendszernek mindig van megoldása?`), 1, 'x=0'];
    });
    push20(out, 2, (i) => {
        if (i % 4 === 0) return [2, yn(`Ha det A ≠ 0, Ax=b egyértelműen megoldható?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Inhomogén rendszernek mindig van megoldása?`), 0, 'nem'];
        if (i % 4 === 2) return [2, `Az x=2, y=3 megoldásban mennyi x+y?`, 5, '5'];
        return [2, yn(`Két sor felcserélése elemi sorművelet?`), 1, 'igen'];
    });
    push20(out, 3, (i) => {
        if (i % 4 === 0) return [3, yn(`Sor nemnulla skalárral szorzása elemi sorművelet?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Egyik sor többszörösének hozzáadása másikhoz elemi sorművelet?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `A 2x=6 egyenletben mennyi x?`, 3, '3'];
        return [3, yn(`Lépcsős alakban a főelemek a pivotok?`), 1, 'igen'];
    });
    push20(out, 4, (i) => {
        if (i % 4 === 0) return [4, yn(`RREF-ben minden pivot 1, felette-alatta 0?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Gauss–Jordan a redukált lépcsős alakot adja?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `Hány szabad paraméter van, ha 2 egyenlet, 3 ismeretlen, 2 pivot?`, 1, '3−2=1'];
        return [4, yn(`Ellentmondásos rendszernek van megoldása?`), 0, 'nincs'];
    });
    push20(out, 5, (i) => {
        if (i % 4 === 0) return [5, yn(`Végtelen sok megoldásnál van szabad változó?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `A 3x+0y=6, 0x+0y=0 rendszerben mennyi x?`, 2, 'x=2, y szabad'];
        if (i % 4 === 2) return [5, yn(`Visszahelyettesítés a Gauss utolsó lépése?`), 1, 'igen'];
        return [5, yn(`A kibővített mátrix [A|b]?`), 1, 'igen'];
    });
    push20(out, 6, (i) => {
        if (i % 5 === 0) return [6, yn(`Ha rank A < rank[A|b], nincs megoldás?`), 1, 'Kronecker–Capelli'];
        if (i % 5 === 1) return [6, yn(`Ha rank A = rank[A|b] = n, egyértelmű megoldás?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `2x+y=5, x−y=1: mennyi x?`, 2, 'x=2'];
        if (i % 5 === 3) return [6, `2x+y=5, x−y=1: mennyi y?`, 1, 'y=1'];
        return [6, yn(`Homogén rendszernek csak a triviális megoldása lehet?`), 0, 'lehet nemtriviális'];
    });
    return out;
}

/** Determinánsok */
export function la1Det(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, 1, (i) => {
        const a = i + 2;
        const d = det2(a, 1, 0, 3);
        if (i % 4 === 0) return [1, `Mennyi det[[2, 1],[0, 3]]?`, 6, '6'];
        if (i % 4 === 1) return [1, `Mennyi det[[${a}, 0],[0, 1]]?`, a, `${a}`];
        if (i % 4 === 2) return [1, `Mennyi det I₂?`, 1, '1'];
        return [1, `Mennyi det[[1, 2],[3, 4]]?`, det2(1, 2, 3, 4), '4−6=−2'];
        void d;
    });
    push20(out, 2, (i) => {
        if (i % 4 === 0) return [2, `Mennyi det[[1, 0, 0],[0, 2, 0],[0, 0, 3]]?`, 6, '1·2·3'];
        if (i % 4 === 1) return [2, yn(`Háromszögmátrix determinánsa a főátló szorzata?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `Mennyi det[[0, 1],[1, 0]]?`, -1, '−1'];
        return [2, yn(`Sarrus-szabály 3×3-ra érvényes?`), 1, 'igen'];
    });
    push20(out, 3, (i) => {
        if (i % 4 === 0) return [3, yn(`Sorcsere megváltoztatja a det előjelét?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Ha két sor egyenlő, det=0?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `Ha egy sort 5-tel szorzunk, det hányszorosára nő?`, 5, '5'];
        return [3, yn(`det(AB)=det(A)det(B)?`), 1, 'igen'];
    });
    push20(out, 4, (i) => {
        if (i % 4 === 0) return [4, `Mennyi det[[1, 2, 3],[0, 1, 4],[0, 0, 1]]?`, 1, 'háromszög'];
        if (i % 4 === 1) return [4, yn(`Lineárisan függő sorok ⇒ det=0?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `Mennyi det(−I₂)?`, 1, '(−1)²=1'];
        return [4, yn(`det(A^T)=det(A)?`), 1, 'igen'];
    });
    push20(out, 5, (i) => {
        if (i % 4 === 0) return [5, yn(`A det előjele az orientációt kódolja?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `Mennyi |det[[2, 0],[0, 3]]| (területi skála ℝ²-ben)?`, 6, '6'];
        if (i % 4 === 2) return [5, yn(`Laplace-kifejtés bármely sor szerint működik?`), 1, 'igen'];
        return [5, `Kofaktor C₁₁ a [[1, 2],[3, 4]] mátrixnál?`, 4, '(-1)^{1+1}M11=4'];
    });
    push20(out, 6, (i) => {
        if (i % 5 === 0) return [6, `Mennyi det[[2, 1, 0],[0, 2, 1],[0, 0, 2]]?`, 8, '8'];
        if (i % 5 === 1) return [6, yn(`det(A^{-1})=1/det(A), ha A invertálható?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Mennyi det(2I₃)?`, 8, '2³=8'];
        if (i % 5 === 3) return [6, yn(`A 0 mátrix determinánsa 0?`), 1, 'igen'];
        return [6, `Mennyi det[[1, 1],[1, 1]]?`, 0, 'függő sorok'];
    });
    return out;
}

/** Inverz mátrix és Cramer-szabály */
export function la1Inverz(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, 1, (i) => {
        if (i % 4 === 0) return [1, yn(`Ha det A=0, A invertálható?`), 0, 'nem'];
        if (i % 4 === 1) return [1, yn(`AA^{-1}=I?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `Mennyi I₂^{-1} (1,1)-eleme?`, 1, 'I^{-1}=I'];
        return [1, yn(`Az egységmátrix invertálható?`), 1, 'igen'];
    });
    push20(out, 2, (i) => {
        // [[1,1],[0,1]]^{-1} = [[1,-1],[0,1]]
        if (i % 4 === 0) return [2, `Mennyi [[1, 1],[0, 1]]^{-1} (1,2)-eleme?`, -1, '−1'];
        if (i % 4 === 1) return [2, `Mennyi [[2, 0],[0, 4]]^{-1} (1,1)-eleme?`, 0.5, '1/2'];
        if (i % 4 === 2) return [2, yn(`Gauss–Jordan-nal számítható az inverz?`), 1, '[A|I]→[I|A^{-1}]'];
        return [2, `Mennyi det[[1, 2],[3, 5]]?`, -1, '5−6=−1'];
    });
    push20(out, 3, (i) => {
        if (i % 4 === 0) return [3, yn(`(AB)^{-1}=B^{-1}A^{-1}, ha A,B invertálható?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`(A^T)^{-1}=(A^{-1})^T?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `Cramer: 2x=4, egyetlen egyenlet, mennyi x?`, 2, 'x=2'];
        return [3, `Az x+y=3, x−y=1 rendszerben Cramer x = det[[3,1],[1,−1]]/det[[1,1],[1,−1]]. Mennyi x?`, 2, '−4/−2=2'];
    });
    push20(out, 4, (i) => {
        if (i % 4 === 0) return [4, yn(`Adj(A)/det(A) az inverz, ha det≠0?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Mennyi [[3, 0],[0, 3]]^{-1} (2,2)-eleme?`, 1 / 3, '1/3'];
        if (i % 4 === 2) return [4, yn(`Szinguláris mátrixnak van inverze?`), 0, 'nincs'];
        return [4, `Mennyi [[1, 0],[0, −1]]^{-1} (2,2)-eleme?`, -1, '−1'];
    });
    push20(out, 5, (i) => {
        if (i % 4 === 0) return [5, `2x+y=5, x+y=3 Cramer: mennyi y?`, 1, 'y=1'];
        if (i % 4 === 1) return [5, `2x+y=5, x+y=3: mennyi x?`, 2, 'x=2'];
        if (i % 4 === 2) return [5, yn(`Cramer csak négyzetes, invertálható A-ra megy?`), 1, 'igen'];
        return [5, yn(`A^{-1} egyértelmű, ha létezik?`), 1, 'igen'];
    });
    push20(out, 6, (i) => {
        if (i % 5 === 0) return [6, `Mennyi [[1, 2],[0, 1]]^{-1} (1,2)-eleme?`, -2, '−2'];
        if (i % 5 === 1) return [6, yn(`det A ≠ 0 ⇔ A invertálható (véges dim)?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Mennyi (2I₂)^{-1} (1,1)-eleme?`, 0.5, '1/2'];
        if (i % 5 === 3) return [6, yn(`Bal inverz egyben jobb inverz négyzetes véges dimenzióban?`), 1, 'igen'];
        return [6, `A x=2, y=−1 mellett Ax=b, ha A=I: mennyi x?`, 2, '2'];
    });
    return out;
}

/** Rang és összetett egyenletrendszerek */
export function la1Rang(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, 1, (i) => {
        if (i % 4 === 0) return [1, `Mennyi rank I₃?`, 3, '3'];
        if (i % 4 === 1) return [1, `Mennyi rank a 2×2-es zérusmátrixnak?`, 0, '0'];
        if (i % 4 === 2) return [1, `Mennyi rank [[1, 0],[0, 0]]?`, 1, '1'];
        return [1, yn(`Sorrang = oszloprang?`), 1, 'igen'];
    });
    push20(out, 2, (i) => {
        if (i % 4 === 0) return [2, `Mennyi rank [[1, 2],[2, 4]]?`, 1, 'függő sorok'];
        if (i % 4 === 1) return [2, `Mennyi rank [[1, 0],[0, 1]]?`, 2, '2'];
        if (i % 4 === 2) return [2, yn(`A rang a pivotok száma Gauss után?`), 1, 'igen'];
        return [2, `Mennyi rank [[1, 2, 3],[0, 0, 0]]?`, 1, '1'];
    });
    push20(out, 3, (i) => {
        if (i % 4 === 0) return [3, yn(`rank A ≤ min(m,n) egy m×n mátrixra?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `Mennyi rank diag(1, 2, 0)?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Teljes oszloprang: rank = oszlopszám?`), 1, 'igen'];
        return [3, `Hány pivot kell 3×3 invertálható mátrixhoz?`, 3, '3'];
    });
    push20(out, 4, (i) => {
        if (i % 4 === 0) return [4, yn(`rank A = rank[A|b] szükséges a megoldhatósághoz?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Szabad változók száma n−rank, n=4, rank=2: mennyi?`, 2, '2'];
        if (i % 4 === 2) return [4, yn(`rank(AB) ≤ min(rank A, rank B)?`), 1, 'igen'];
        return [4, `Mennyi rank [[0, 1],[0, 0]]?`, 1, '1'];
    });
    push20(out, 5, (i) => {
        if (i % 4 === 0) return [5, yn(`A teljes rangú négyzetes mátrix invertálható?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `Mennyi rank [[1, 1, 1],[2, 2, 2],[3, 3, 3]]?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Elemi sorművelet nem változtatja a rangot?`), 1, 'igen'];
        return [5, `3 egyenlet, 3 ismeretlen, rank A=2, rank[A|b]=2: hány szabad változó?`, 1, '1'];
    });
    push20(out, 6, (i) => {
        if (i % 5 === 0) return [6, yn(`Ha rank A = rank[A|b] < n, végtelen sok megoldás?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `Mennyi rank I₅?`, 5, '5'];
        if (i % 5 === 2) return [6, yn(`A nullmátrix rangja 0?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `Mennyi rank [[1, 0, 0],[0, 1, 0],[0, 0, 0]]?`, 2, '2'];
        return [6, yn(`Kronecker–Capelli a megoldhatóságot a rangokkal dönti el?`), 1, 'igen'];
    });
    return out;
}
