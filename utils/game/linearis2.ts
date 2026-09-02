import type { LaRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: LaRow[], make: (i: number) => LaRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Vektortér és altér */
export function la2Vektorter(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`ℝ^n vektortér ℝ felett?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`A zérusvektor minden vektortérben benne van?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Két vektor összege vektortérben újra vektor?`), 1, 'zártság'];
        return [1, yn(`Skalárszoros vektortérben újra vektor?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Az {0} altér?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Az egész V altér V-ben?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Két altér metszete altér?`), 1, 'igen'];
        return [2, yn(`Két altér uniója mindig altér?`), 0, 'általában nem'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`P_n (legfeljebb n-edfokú polinomok) vektortér?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`M_{m×n} mátrixok tere vektortér?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Pozitív valós számok az összeadással vektortér ℝ felett?`), 0, 'nincs 0, nincs additív inverz'];
        return [3, yn(`Altérkritérium: 0 ∈ W, zártság + és skalár?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Alterek összege U+W = {u+w}?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Direkt összegben U∩W={0}?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`V=U⊕W ⇒ dim V = dim U + dim W (véges dim)?`), 1, 'igen'];
        return [4, yn(`Síkbeli egy origón átmenő egyenes altér ℝ²-ben?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Origón nem átmenő egyenes altér ℝ²-ben?`), 0, 'nincs 0'];
        if (i % 4 === 1) return [5, yn(`C[a,b] folytonos függvények vektortér?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`1·v = v minden vektorra?`), 1, 'axióma'];
        return [5, yn(`v+(−v)=0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`A vektortér axiómái tartalmazzák a disztributivitást?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`ℕ vektortér ℝ felett a szokásos műveletekkel?`), 0, 'nem'];
        if (i % 5 === 2) return [6, yn(`Két altér összege altér?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Véges dimenziós tér minden altere véges dimenziós?`), 1, 'igen'];
        return [6, yn(`A nulltér csak a {0} vektortér?`), 1, 'egy elemű'];
    });
    return out;
}

/** Lineáris kombináció és generált tér */
export function la2Span(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        const a = i + 1;
        if (i % 4 === 0) return [1, `Mennyi 2(1, 0)+3(0, 1) első koordinátája?`, 2, '2'];
        if (i % 4 === 1) return [1, `Mennyi 2(1, 0)+3(0, 1) második koordinátája?`, 3, '3'];
        if (i % 4 === 2) return [1, yn(`span{v} az {αv} halmaz?`), 1, 'igen'];
        return [1, `Mennyi ${a}(1, 0)+(0, 1) első koordinátája?`, a, `${a}`];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`span{e1,e2}=ℝ² a standard bázisra?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Generátorrendszer kifeszíti a teret?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Minimális generátorrendszer bázis (véges dim)?`), 1, 'igen'];
        return [2, yn(`A (1,2) benne van span{(1,0),(0,1)}-ben?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`span{v,w}=span{w,v}?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Ha w∈span{v}, akkor span{v,w}=span{v}?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `Hány dimenziós span{(1,0,0),(0,1,0)} ℝ³-ban?`, 2, '2'];
        return [3, yn(`A zérusvektor benne van minden span-ben?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Oszloptér = az oszlopok által generált altér?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Sortér = a sorok által generált altér?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `Mennyi dim span{(1,1),(2,2)}?`, 1, '1'];
        return [4, yn(`Ax lineáris kombinációja A oszlopainak?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Ha G generálja V-t és G⊂H, akkor H is?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `P_2-t generálja {1,x,x²}? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`span∅={0}?`), 1, 'üres összeg'];
        return [5, `Hány vektor kell legalább ℝ³ generálásához?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`A generált altér a legszűkebb altér, ami tartalmazza a vektorokat?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `Mennyi dim span{(1,0,0),(0,1,0),(0,0,1)}?`, 3, '3'];
        if (i % 5 === 2) return [6, yn(`Függő vektor elhagyható a generátorrendszerből?`), 1, 'igen, ha függő'];
        if (i % 5 === 3) return [6, yn(`Minden véges dimenziós térnek van véges generátorrendszere?`), 1, 'igen'];
        return [6, `Mennyi 0·v+1·(2,3) második koordinátája?`, 3, '3'];
    });
    return out;
}

/** Lineáris függetlenség */
export function la2Fuggetlenseg(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Egy nemnulla vektor lineárisan független?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`A {0} rendszer független?`), 0, '1·0=0 nemtriviális'];
        if (i % 4 === 2) return [1, yn(`(1,0) és (0,1) független ℝ²-ben?`), 1, 'igen'];
        return [1, yn(`(1,2) és (2,4) független?`), 0, 'párhuzamos'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Függetlenség: csak triviális lineáris kombináció ad 0-t?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Ha egy vektor a többi kombinációja, a rendszer függő?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`ℝ²-ben 3 vektor mindig függő?`), 1, 'igen'];
        return [2, yn(`I₃ oszlopai függetlenek?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Részhalmaza független rendszernek független?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Függő rendszer minden bővítése függő?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `Hány független vektor fér ℝ³-ba legfeljebb?`, 3, 'dim=3'];
        return [3, yn(`Ortogonális nemnulla vektorok függetlenek?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Steinitz: független rendszer kicserélhető generátorrendszerbe?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`A standard bázis független?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `Mennyi rank, ha 2 független oszlop van 2×2-ben?`, 2, '2'];
        return [4, yn(`Függőségi reláció nemtriviális kombináció=0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`{1,x,x²} független P₂-ben?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`{1, 2, 3} mint ℝ-beli „vektorok” (1 dim) független?`), 0, '1 dim, 3 elem'];
        if (i % 4 === 2) return [5, yn(`Gauss: nincs szabad változó a homogénben ⇒ oszlopok függetlenek?`), 1, 'igen'];
        return [5, `ℝ³-ban a max független vektorok száma?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Véges dimenzióban a független max hossza = dim?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`(1,1,0),(0,1,1),(1,0,1) független ℝ³-ban?`), 1, 'det≠0'];
        if (i % 5 === 2) return [6, yn(`Üres rendszer független?`), 1, 'üres összeg=0 csak triviálisan'];
        if (i % 5 === 3) return [6, yn(`Két párhuzamos nemnulla vektor függő?`), 1, 'igen'];
        return [6, yn(`Független oszlopok ⇒ Ax=0 csak x=0?`), 1, 'igen'];
    });
    return out;
}

/** Bázis és koordináták */
export function la2Bazis(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Bázis = független generátorrendszer?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`A standard bázis bázis ℝ^n-ben?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `Hány vektor van ℝ² standard bázisában?`, 2, '2'];
        return [1, `Hány vektor van ℝ³ standard bázisában?`, 3, '3'];
    });
    push20(out, (i) => {
        const a = i + 1;
        if (i % 4 === 0) return [2, `A (3, 0) koordinátája e1 irányban a standard bázisban?`, 3, '3'];
        if (i % 4 === 1) return [2, `Mennyi (0, ${a}) második standard koordinátája?`, a, `${a}`];
        if (i % 4 === 2) return [2, yn(`Koordináták egyértelműek adott bázisban?`), 1, 'igen'];
        return [2, yn(`Minden véges dimenziós térnek van bázisa?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Bázis kereshető Gauss-eliminációval az oszlopokból?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Két bázis azonos elemszámú (véges dim)?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `P_2 standard bázisa {1,x,x²} hány elemű?`, 3, '3'];
        return [3, yn(`Koordinátavektor a bázis szerinti együtthatók?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Ha v=2b1+3b2, a koordináta első komponense 2?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Mennyi e1 koordinátája saját magában (első)?`, 1, '1'];
        if (i % 4 === 2) return [4, yn(`Áttérés mátrixa a régi bázis új szerinti oszlopai?`), 1, 'P'];
        return [4, yn(`[v]_C = P^{-1}[v]_B bázisváltáskor?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`M_{2×2} standard bázisa 4 mátrix?`), 1, 'E_{ij}'];
        if (i % 4 === 1) return [5, `dim M_{2×2} = ?`, 4, '4'];
        if (i % 4 === 2) return [5, yn(`Báziscsere invertálható mátrixszal történik?`), 1, 'igen'];
        return [5, `ℝ^n bázisa hány elemű? n=5 esetén`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Koordináták transzformációja lineáris?`), 1, 'igen'];
        if (i % 5 === 1) return [6, yn(`Egy vektortérnek több bázisa is lehet?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `A (1,1) a {(1,0),(1,1)} bázisban: második koordináta?`, 1, '0·b1+1·b2'];
        if (i % 5 === 3) return [6, `A (1,1) a {(1,0),(1,1)} bázisban: első koordináta?`, 0, '0'];
        return [6, yn(`Hamel-bázis létezik minden vektortérben (ZF+AC)?`), 1, 'igen'];
    });
    return out;
}

/** Dimenzió és báziscsere */
export function la2Dimenzio(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        const n = (i % 5) + 1;
        if (i % 4 === 0) return [1, `Mennyi dim ℝ³?`, 3, '3'];
        if (i % 4 === 1) return [1, `Mennyi dim ℝ^${n}?`, n, `${n}`];
        if (i % 4 === 2) return [1, yn(`dim{0}=0?`), 1, 'igen'];
        return [1, `Mennyi dim P_2?`, 3, 'n+1=3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Altér dimenziója ≤ a tér dimenziója?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `dim M_{2×3} = ?`, 6, '6'];
        if (i % 4 === 2) return [2, yn(`Ha dim U=dim V és U⊂V véges dim, akkor U=V?`), 1, 'igen'];
        return [2, `dim P_n, n=4?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`dim(U+W)+dim(U∩W)=dim U+dim W?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `dim ℝ² + dim ℝ² − dim(ℝ²∩ℝ² mint azonos sík) = dim összeg: 2+2−2?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Véges dimenziós tér minden bázisa azonos hosszú?`), 1, 'igen'];
        return [3, `Hány dimenziós egy origón átmenő sík ℝ³-ban?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Bázisváltó mátrix invertálható?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `P=I bázisváltásnál [v] változatlan? (1=igen)`, 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`dim ker T + dim Im T = dim V?`), 1, 'dimenziótétel'];
        return [4, `dim ker 0-leképezés ℝ³→ℝ³?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `dim Im id_{ℝ^4}?`, 4, '4'];
        if (i % 4 === 1) return [5, yn(`Koordináták P^{-1}-gyel transzformálódnak?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `dim C^n mint ℂ-vektortér, n=2?`, 2, '2'];
        return [5, `dim ℂ mint ℝ-vektortér?`, 2, '1 és i'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Végtelen dimenziós tér: pl. összes polinom ℝ[x]?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `dim span{(1,0),(0,1),(1,1)}?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Steinitz következménye: minden bázis egyforma hosszú?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `dim { (x,y,z): x+y+z=0 } ℝ³-ban?`, 2, 'sík'];
        return [6, yn(`Báziscsere a mátrixot P^{-1}AP szerint viszi (endomorfizmus)?`), 1, 'hasonló'];
    });
    return out;
}

/** Lineáris leképezések, magtér és képtér */
export function la2Lekepezes(): LaRow[] {
    const out: LaRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`T(αu+βv)=αT(u)+βT(v) a linearitás?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`T(0)=0 minden lineáris T-re?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Az identitás lineáris?`), 1, 'igen'];
        return [1, yn(`A zéróleképezés lineáris?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Izomorfizmus = invertálható lineáris leképezés?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Endomorfizmus: T: V→V?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `T(x,y)=(2x, 3y), T(1,1) első komponense?`, 2, '2'];
        return [2, `T(x,y)=(2x, 3y), T(1,1) második komponense?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`ker T altér?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Im T altér?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`T injektív ⇔ ker T={0}?`), 1, 'igen'];
        return [3, `nullity = dim ker. A 0-leképezés ℝ²→ℝ² nullitása?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `rank T = dim Im. Az id_{ℝ³} rangja?`, 3, '3'];
        if (i % 4 === 1) return [4, yn(`dim V = rank + nullity?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `T: ℝ³→ℝ², max rank?`, 2, '2'];
        return [4, yn(`Kompozíció lineáris leképezéseké lineáris?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`A leképezés mátrixa bázisfüggő?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Báziscsere: [T]_C = P^{-1}[T]_B P?`), 1, 'endomorfizmus'];
        if (i % 4 === 2) return [5, `Projekció ℝ²→x-tengely rangja?`, 1, '1'];
        return [5, `Ugyanennek a projekciónak a nullitása?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Véges dimenzióban injektív endomorfizmus szürjektív?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `T(x)=(x,0) ℝ→ℝ² rangja?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Matrix szorzás a leképezések kompozíciója?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `ker deriválás P_3→P_2 dimenziója (konstansok)?`, 1, '1'];
        return [6, yn(`Rank-nullity a dimenziótétel?`), 1, 'igen'];
    });
    return out;
}
