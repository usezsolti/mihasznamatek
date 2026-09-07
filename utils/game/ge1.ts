import type { LaRow as DmRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DmRow[], make: (i: number) => DmRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Gráfok alapfogalmai és fokszám */
export function ge1Alapok(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i === 0) return [1, `Kézfogási lemma: Σ d(v)=2|E|. |E|=3, Σd=?`, 6, '6'];
        if (i % 4 === 1) return [1, yn(`G=(V,E) csúcsok és élek?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Egyszerű: nincs hurok/többél?`), 1, 'igen'];
        return [1, `|V|=4, |E|=0. Σd=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `K_3 élszám C(3,2)=?`, 3, '3'];
        if (i % 4 === 1) return [2, `K_4 élszám C(4,2)=?`, 6, '6'];
        if (i % 4 === 2) return [2, yn(`d(v) a v fokszáma?`), 1, 'igen'];
        return [2, yn(`Páros gráf: élek A–B között?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `2-reguláris 5-csúcsú kör. d(v)=?`, 2, '2'];
        if (i % 4 === 1) return [3, yn(`Multigráf megenged többélt?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Irányított: éleknek iránya van?`), 1, 'igen'];
        return [3, `fok (3,3,2,2), Σd=?`, 10, '|E|=5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Σd páros. (3,3,3) Σ=9 páratlan ⇒ nem grafikus? (1=igen, nem grafikus)`, 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Részgráf: V'⊆V, E'⊆E?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Feszített: minden él a V'-ben?`), 1, 'igen'];
        return [4, `K_1 élszám?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `Δ max fok. (1,2,3), Δ=?`, 3, '3'];
        if (i % 4 === 1) return [5, yn(`Teljes K_n minden pár él?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `|E|=|V|=5 kör. Σd=?`, 10, '10'];
        return [5, yn(`Grafikus sorozat: van egyszerű realizáció?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `K_5 |E|=10. 10=?`, 10, '10'];
        if (i % 5 === 1) return [6, yn(`Hurok 2-vel növeli a fokot?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `üres n=6, |E|=?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Izomorfia később: élő bijekció?`), 1, 'igen'];
        return [6, `átlagfok 2|E|/n, n=4,|E|=4, átlag=?`, 2, '2'];
    });
    return out;
}

/** Utak, körök és összefüggőség */
export function ge1Utak(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Út: ismétlődés nélküli csúcsok?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Kör: zárt út, n≥3?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Séta megenged ismétlést?`), 1, 'igen'];
        return [1, yn(`Vonal: élismétlés nincs?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Összefüggő: bármely két csúcs közt út?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `2 komponens, diszjunkt. komponensszám?`, 2, '2'];
        if (i % 4 === 2) return [2, yn(`d(u,v) legrövidebb út hossza?`), 1, 'igen'];
        return [2, `távolság u=v. d=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Átmérő = max d(u,v)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Sugár = min excentricitás?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `P_3 út, átmérő?`, 2, '2'];
        return [3, yn(`Izomorfia: élőrző bijekció?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `C_5 kör, |V|=?`, 5, '5'];
        if (i % 4 === 1) return [4, `C_n élszám = n. n=6?`, 6, '6'];
        if (i % 4 === 2) return [4, yn(`Híd él: elhagyva nő a komponensszám?`), 1, 'igen'];
        return [4, yn(`Vágópont hasonló csúcsra?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `K_n átmérő 1 (n≥2). 1=?`, 1, '1'];
        if (i % 4 === 1) return [5, yn(`Fa összefüggő és körmentes?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `1 csúcs, 0 él, összefüggő? (1)`, 1, 'igen'];
        return [5, yn(`Zárt séta nem mindig kör?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `excentricitás K_n (n≥2) =?`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Komponens maximális összefüggő rész?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `P_2 hossza (él)?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Nem összefüggő ⇒ van u,v út nélkül?`), 1, 'igen'];
        return [6, `C_4 átmérő?`, 2, '2'];
    });
    return out;
}

/** Fák és erdők */
export function ge1Fak(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `n csúcsú fa élszáma n-1. n=5, |E|=?`, 4, '4'];
        if (i % 4 === 1) return [1, yn(`Erdő: körmentes (nem feltétlen összefüggő)?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Levél: fok 1?`), 1, 'igen'];
        return [1, `n=1 fa, |E|=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `n=6 fa, |E|=?`, 5, '5'];
        if (i % 4 === 1) return [2, yn(`n≥2 fának van legalább 2 levele?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `erdő c komponens, |E|=n-c. n=5,c=2, |E|=?`, 3, '3'];
        return [2, yn(`Egyértelmű út két csúcs közt fában?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Gyökeres fa: kitüntetett gyökér?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `csillag n=4, levelek?`, 3, '3'];
        if (i % 4 === 2) return [3, yn(`Fa = minimális összefüggő?`), 1, 'igen'];
        return [3, yn(`Fa = maximális körmentes?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Σd=2(n-1). n=4, Σd=?`, 6, '6'];
        if (i % 4 === 1) return [4, yn(`Bármely él elhagyása szétvág?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Bármely nem-él hozzáadása kört szül?`), 1, 'igen'];
        return [4, `P_n út-fa, n=7, |E|=?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `bináris fa nem feltétlen 2 gyerek. gyökér 0 gyerek, levelek?`, 1, '1'];
        if (i % 4 === 1) return [5, yn(`Erdő fák uniója?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `n=n, c=n, |E|=0. 0=?`, 0, '0'];
        return [5, yn(`Körmentes + |E|=n-1 ⇒ fa?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `n=10 fa, |E|=?`, 9, '9'];
        if (i % 5 === 1) return [6, yn(`Prüfer/Cayley feszítőfához?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `2 csúcsú fa, |E|=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Levél törlése kisebb fa?`), 1, 'igen'];
        return [6, `csillag n=6, max fok=?`, 5, '5'];
    });
    return out;
}

/** Feszítőfák, Cayley, Prüfer */
export function ge1Cayley(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Feszítőfa: minden csúcs, fa?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Cayley: n^{n-2} címkézett fa?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `n=3, 3^{1}=?`, 3, '3'];
        return [1, `n=2, 2^0=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `n=4, 4^{2}=?`, 16, '16'];
        if (i % 4 === 1) return [2, yn(`Prüfer-kód hossza n-2?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `n=5 Prüfer hossz?`, 3, '3'];
        return [2, yn(`Prüfer bijekció a fákra?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `n=1 feszítőfa 1 (üres). 1=?`, 1, '1'];
        if (i % 4 === 1) return [3, yn(`Összefüggő G-nek van feszítőfája?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `K_n feszítőfái n^{n-2}. n=3?`, 3, '3'];
        return [3, yn(`Kirchhoff mátrix-fa tétel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `n=6, 6^4=1296. 6^{n-2} kitevő?`, 4, '4'];
        if (i % 4 === 1) return [4, yn(`Prüferben nem szereplő: levél?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `csillag Prüfer: n-2 azonos címke. n=4 hossz?`, 2, '2'];
        return [4, yn(`Feszítőfa |E|=n-1?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `n=0 értelmetlen; n=3 Cayley 3. 3=?`, 3, '3'];
        if (i % 4 === 1) return [5, yn(`Több feszítőfa lehet G-ben?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `fa maga 1 feszítőfa. 1=?`, 1, '1'];
        return [5, yn(`Címkézetlen fák ≠ n^{n-2}?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `n=5, 5^3=?`, 125, '125'];
        if (i % 5 === 1) return [6, yn(`Mátrix-fa: kofaktor?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Prüfer [1] n=3. hossz 1. 1=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Feszítőerdő nem összefüggő G-re?`), 1, 'igen'];
        return [6, `2^{0}=1 n=2. 1=?`, 1, '1'];
    });
    return out;
}

/** Euler- és Hamilton-problémák */
export function ge1Euler(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Euler-kör: minden él egyszer, zárt?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Összefüggő + minden fok páros ⇒ Euler-kör?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `C_4 minden fok 2 páros. Euler-kör? (1)`, 1, 'igen'];
        return [1, yn(`Euler-út: pontosan 0 vagy 2 páratlan fok?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `K_3 Euler-kör? minden fok 2. (1)`, 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Hamilton-kör: minden csúcs egyszer?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Hamilton NP-nehéz, Euler polinom?`), 1, 'igen'];
        return [2, `P_3 Hamilton-út van, kör? (0=nem)`, 0, 'nem'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Dirac: n≥3, d(v)≥n/2 ⇒ Hamilton-kör?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `n=6, n/2=?`, 3, '3'];
        if (i % 4 === 2) return [3, yn(`Ore: nem-szomszéd d(u)+d(v)≥n?`), 1, 'igen'];
        return [3, yn(`K_n n≥3 Hamilton-kör?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `2 páratlan fok: Euler-út, nem kör. páratlanok száma?`, 2, '2'];
        if (i % 4 === 1) return [4, yn(`Hierholzer Euler-kört épít?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `K_2 nem kör. n=2<3 Dirac. Hamilton-kör? (0)`, 0, 'nem'];
        return [4, yn(`Szükséges Hamilton: nincs vágócsúcs?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `4 páratlan fok: nincs Euler-út. 4=?`, 4, '4'];
        if (i % 4 === 1) return [5, yn(`Petersen nem Hamilton?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `C_5 Hamilton-kör? (1)`, 1, 'igen'];
        return [5, yn(`Dirac elégséges, nem szükséges?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Kínai postás Euler-vonallal rokon?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `n=4, Dirac küszöb 2. 4/2=?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Út vs kör: zártság?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `üres 1 csúcs Euler-kör triviális? (1)`, 1, 'igen'];
        return [6, yn(`Ore ⇒ Dirac speciális esetben?`), 1, 'igen'];
    });
    return out;
}

/** Minimális feszítőfa és gráfalgoritmusok */
export function ge1Mst(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`MST: minimális összsúlyú feszítőfa?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Kruskal: élek növekvő súly, nincs kör?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Prim: fa növelése minimális éllel?`), 1, 'igen'];
        return [1, `3 élű fa, súlyok 1+2+3 összeg?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Union-Find Kruskalhoz?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Egyedi súlyok ⇒ egyedi MST?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `n=4 MST élszám?`, 3, '3'];
        return [2, yn(`Vágás tulajdonság: min él a vágáson MST-ben?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Kör tulajdonság: max él kihagyható?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `súlyok 1,1,100, Kruskal első két él. 1+1=?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Dijkstra legrövidebb út, nem MST?`), 1, 'igen'];
        return [3, yn(`BFS legrövidebb élhossz=1-re?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`DFS bejárás?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `Prim start 1 csúcs, 0 él. |E_fa|=?`, 0, '0'];
        if (i % 4 === 2) return [4, yn(`Negatív súly Kruskal/Prim OK (nincs kör-csökkentés kell)?`), 1, 'igen'];
        return [4, yn(`Borůvka is MST?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `összes él súlya 10, MST 4. 4=?`, 4, '4'];
        if (i % 4 === 1) return [5, yn(`Nem összefüggő: feszítőerdő?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`Sort Kruskal O(E log E)?`), 1, 'igen'];
        return [5, `n=5, MST élek?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Fordítva max feszítőfa: negált súlyok?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `0 súlyú n-1 él, MST költség?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Közös: mohó algoritmusok?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `K_3 súly 1,2,3 MST=1+2=?`, 3, '3'];
        return [6, yn(`MST nem feltétlen legrövidebb u–v út?`), 1, 'igen'];
    });
    return out;
}
