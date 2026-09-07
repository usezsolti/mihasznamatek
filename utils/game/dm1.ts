import type { LaRow as DmRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DmRow[], make: (i: number) => DmRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Összeadási és szorzási elv */
export function dm1Osszeadas(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i === 0) return [1, `Összeadási elv: 3 + 4 hány lehetőség?`, 7, '3+4'];
        if (i % 4 === 1) return [1, yn(`Kizáró eseteknél összeadunk?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `2 vagy 5 út, összesen?`, 7, '7'];
        return [1, yn(`Szorzási elv: egymás utáni lépések?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `3 majd 4 választás, szorzat?`, 12, '3·4'];
        if (i % 4 === 1) return [2, `2·5·3 folyamat?`, 30, '30'];
        if (i % 4 === 2) return [2, yn(`Bijekció ⇒ azonos elemszám?`), 1, 'igen'];
        return [2, `|{1,2,3}| = ?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `Menü: 4 előétel × 3 főétel?`, 12, '12'];
        if (i % 4 === 1) return [3, `Jegy: 2 osztály + 5 kocsi, ha VAGY?`, 7, '7'];
        if (i % 4 === 2) return [3, `Kocka 6, érme 2, párok?`, 12, '12'];
        return [3, yn(`Üres halmaz elemszáma 0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `n=6, 2 diszjunkt csoport 2+4. összeg?`, 6, '6'];
        if (i % 4 === 1) return [4, `ABC 3 betű, 2 számjegy, kódok (ismétléssel) 26? nem: 3·2=?`, 6, '6'];
        if (i % 4 === 2) return [4, `4 bit, 2^4=?`, 16, '16'];
        return [4, yn(`Független választások szorzódnak?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `3 ruha × 2 cipő × 2 sapka?`, 12, '12'];
        if (i % 4 === 1) return [5, `{a,b} bijektív {1,2}. elemszám?`, 2, '2'];
        if (i % 4 === 2) return [5, `10+0 összeadási elv?`, 10, '10'];
        return [5, yn(`Átfedő eseteknél nem sima összeg?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `5 lépés, egyenként 2 mód. 2^5=?`, 32, '32'];
        if (i % 5 === 1) return [6, yn(`Számosság bijekcióval bizonyítható?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `7 vagy 1, diszjunkt. összeg?`, 8, '8'];
        if (i % 5 === 3) return [6, `1·2·3·4=?`, 24, '24'];
        return [6, yn(`Összeadás ∪, szorzás × folyamat?`), 1, 'igen'];
    });
    return out;
}

/** Permutáció, variáció és kombináció */
export function dm1Permvar(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `3! = ?`, 6, '6'];
        if (i % 4 === 1) return [1, `4! = ?`, 24, '24'];
        if (i % 4 === 2) return [1, `0! = ?`, 1, '1'];
        return [1, yn(`n! = n különböző elem sorrendje?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `Ismétléses perm: 3 betű AAB. 3!/2! = ?`, 3, '3'];
        if (i % 4 === 1) return [2, `MISSISSIPPI M: 4, I:4, S:4, P:2, n=11. 11!/(4!^3 2!) nagy; 2! = ?`, 2, '2'];
        if (i % 4 === 2) return [2, `V(5,2)=5!/3! = ?`, 20, '20'];
        return [2, yn(`Variáció: sorrend számít?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `C(5,2)=?`, 10, '10'];
        if (i % 4 === 1) return [3, `C(6,1)=?`, 6, '6'];
        if (i % 4 === 2) return [3, `C(n,0)=?`, 1, '1'];
        return [3, yn(`Kombináció: sorrend nem számít?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Ismétléses variáció: 3^4=?`, 81, '81'];
        if (i % 4 === 1) return [4, `2^5 jelszó 2 jelből 5 hosszú?`, 32, '32'];
        if (i % 4 === 2) return [4, `C(6,2)=?`, 15, '15'];
        return [4, `P(6,2)=6·5=?`, 30, '30'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `C(8,3)=?`, 56, '56'];
        if (i % 4 === 1) return [5, `5! / 5 = 4! = ?`, 24, '24'];
        if (i % 4 === 2) return [5, yn(`V(n,n)=n!?`), 1, 'igen'];
        return [5, `C(7,6)=C(7,1)=?`, 7, '7'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `C(10,2)=?`, 45, '45'];
        if (i % 5 === 1) return [6, yn(`Ismétléses kombináció C(n+k-1,k)?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `C(4+2-1,2)=C(5,2)=?`, 10, '10'];
        if (i % 5 === 3) return [6, `P(4,3)=4·3·2=?`, 24, '24'];
        return [6, yn(`n!/(n-k)! = V(n,k)?`), 1, 'igen'];
    });
    return out;
}

/** Binomiális együtthatók és azonosságok */
export function dm1Binom(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `C(5,2)=C(5,3)? érték?`, 10, '10'];
        if (i % 4 === 1) return [1, yn(`C(n,k)=C(n,n-k) szimmetria?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `C(n,0)+C(n,n)=1+1, n>0. összeg?`, 2, '2'];
        return [1, yn(`Pascal: C(n,k)+C(n,k+1)=C(n+1,k+1)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `C(4,1)+C(4,2)=4+6=?`, 10, 'C(5,2)'];
        if (i % 4 === 1) return [2, `(1+1)^3=8. Σ C(3,k)=?`, 8, '8'];
        if (i % 4 === 2) return [2, `(1+1)^4=?`, 16, '16'];
        return [2, yn(`Binomiális tétel (a+b)^n?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `(1+x)^2 együttható x^1? C(2,1)=?`, 2, '2'];
        if (i % 4 === 1) return [3, `(2+1)^3=27. 27=?`, 27, '27'];
        if (i % 4 === 2) return [3, `Pascal 5. sor közepe C(4,2)=? (0-indexű n=4)`, 6, '6'];
        return [3, yn(`Multinomiális n!/(n1!…nk!)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `3!/(1!1!1!)=6. 6=?`, 6, '6'];
        if (i % 4 === 1) return [4, `C(6,0)=?`, 1, '1'];
        if (i % 4 === 2) return [4, `C(6,6)=?`, 1, '1'];
        return [4, `Σ_k C(5,k)=32? 2^5=?`, 32, '32'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `C(7,3)=?`, 35, '35'];
        if (i % 4 === 1) return [5, yn(`k C(n,k)= n C(n-1,k-1)?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `2·C(4,2)=2·6=?`, 12, '12'];
        return [5, yn(`Pascal-háromszög sorösszeg 2^n?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `C(8,4)=?`, 70, '70'];
        if (i % 5 === 1) return [6, `(a+b)^0 együttható?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`C(n,k)=0 ha k>n?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `C(9,1)=?`, 9, '9'];
        return [6, yn(`Kombinatorikai azonosság bijekcióval is?`), 1, 'igen'];
    });
    return out;
}

/** Skatulyaelv és kettős leszámlálás */
export function dm1Skatulya(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`n+1 tárgy n skatulyába ⇒ 2 egyben?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `8 galamb, 7 lyuk, legalább egy lyukban ≥?`, 2, '2'];
        if (i % 4 === 2) return [1, `ceil(10/3)=?`, 4, '4'];
        return [1, yn(`Általánosított: ceil(N/k)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `13 ember, hónapok 12, legalább egy hónap ≥?`, 2, '2'];
        if (i % 4 === 1) return [2, `100 tárgy, 9 doboz, ceil(100/9)=?`, 12, '12'];
        if (i % 4 === 2) return [2, yn(`Kettős leszámlálás: kétféle számolás egyenlő?`), 1, 'igen'];
        return [2, `Kézfogás: 3 él, Σd=2|E|=?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `5 pár zokni fiók, 6 zokni ⇒ legalább 1 pár? (1=igen)`, 1, 'igen'];
        if (i % 4 === 1) return [3, `Maradék mod 5: 6 szám, van 2 azonos maradék? (1)`, 1, 'igen'];
        if (i % 4 === 2) return [3, `ceil(7/7)=?`, 1, '1'];
        return [3, yn(`Ha N≤k, nem kényszerít 2-t egy osztályba?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Élek leszámlálása Σd/2. d=(2,2,2), |E|=?`, 3, '3'];
        if (i % 4 === 1) return [4, yn(`Párok (ember,szék) két irányból?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `n=5, k=2, ceil(5/2)=?`, 3, '3'];
        return [4, yn(`Skatulyaelv létezést bizonyít, konstrukciót nem mindig?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `366 nap, 367 ember, legalább 2 ugyanazon a napon? (1)`, 1, 'igen'];
        if (i % 4 === 1) return [5, `3 szín, 7 golyó, ceil(7/3)=?`, 3, '3'];
        if (i % 4 === 2) return [5, yn(`Kettős leszámlálás binomiális azonosságra?`), 1, 'igen'];
        return [5, `C(n,2) élek teljes gráfon. n=4, C(4,2)=?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `ceil(17/5)=?`, 4, '4'];
        if (i % 5 === 1) return [6, yn(`Erősebb skatulya: r+1 egy skatulyában, ha N>r k?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `N=rk+1, legalább r+1. r=3,k=2, N=?`, 7, '7'];
        if (i % 5 === 3) return [6, `Σ 1 = n. n=9?`, 9, '9'];
        return [6, yn(`Leszámlálás két oldala egyenlő?`), 1, 'igen'];
    });
    return out;
}

/** Szitaformula és multihalmazok */
export function dm1Szita(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `|A∪B|=|A|+|B|-|A∩B|. 5+7-3=?`, 9, '9'];
        if (i % 4 === 1) return [1, yn(`Szita: zárójeles metszetek előjele (−1)^{r+1}?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `|A|=4,|B|=0, unió?`, 4, '4'];
        return [1, yn(`Háromhalmazos szita 7 tag?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `3+4+5-1-1-2+1=?`, 9, '9'];
        if (i % 4 === 1) return [2, yn(`Derangement: nincs fixpont?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `!2=1. 1=?`, 1, '1'];
        return [2, `!3=2. 2=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `!4=9. 9=?`, 9, '9'];
        if (i % 4 === 1) return [3, yn(`!n ≈ n!/e?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Multihalmaz: elemszám multiplicitással?`), 1, 'igen'];
        return [3, `{a,a,b} elemszám 3? (1)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Ismétléses kombináció 3 típus, 2 elem: C(3+2-1,2)=?`, 6, '6'];
        if (i % 4 === 1) return [4, `|U|=10, |A|=3, |A^c|=?`, 7, '7'];
        if (i % 4 === 2) return [4, yn(`Komplementer szita is?`), 1, 'igen'];
        return [4, `0 metszet, |A∪B|=3+5=?`, 8, '8'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `!5=44. 44=?`, 44, '44'];
        if (i % 4 === 1) return [5, yn(`Részmultihalmaz multiplicitás ≤ eredeti?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `csillag-vonás: x1+x2=5, xi≥0, C(5+2-1,5)=?`, 6, '6'];
        return [5, yn(`Szita túl-/alulszámolást javít?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `|A∩B|=0, |A|=2,|B|=2, unió?`, 4, '4'];
        if (i % 5 === 1) return [6, yn(`n! Σ (-1)^k/k! derangement?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `C(5,0)-C(5,1)+C(5,2)=1-5+10=?`, 6, '6'];
        if (i % 5 === 3) return [6, yn(`Korlátos leszámlálás szitával?`), 1, 'igen'];
        return [6, `3 alma + 2 körte multihalmaz méret?`, 5, '5'];
    });
    return out;
}

/** Összetett kombinatorikai bizonyítások */
export function dm1OsszBiz(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Bijekciós bizonyítás: két halmaz párosítása?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Kettős leszámlálás azonosságra?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `C(n,k) k! = P(n,k). n=5,k=2, 10·2=?`, 20, '20'];
        return [1, yn(`Algebrai azonosság kombinatorikai jelentéssel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `Σ k C(n,k)= n 2^{n-1}. n=3, 3·4=?`, 12, '12'];
        if (i % 4 === 1) return [2, yn(`Csapatkapitány: n·C(n-1,k-1)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `C(6,2)=15, C(6,4)=15. egyenlők? (1)`, 1, 'igen'];
        return [2, yn(`Injekció + azonos véges szám ⇒ bijekció?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Pascal kombinatorikája: kitüntetett elem?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `C(5,2)+C(5,3)=10+10=?`, 20, 'C(6,3)'];
        if (i % 4 === 2) return [3, yn(`Generátorfüggvény is bizonyíthat?`), 1, 'igen'];
        return [3, `2^n részhalmaz. n=4?`, 16, '16'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Tiltott pozíció: szita + perm?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `n=0, 0!=1 üres szorzat. 1=?`, 1, '1'];
        if (i % 4 === 2) return [4, yn(`Színes bizonyítás: elemek színezése?`), 1, 'igen'];
        return [4, `C(2n,n) n=2, C(4,2)=?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Probabilisztikus létezés P>0?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `C(n,0)^2+… hockey-stick előkészítés. C(3,1)=?`, 3, '3'];
        if (i % 4 === 2) return [5, yn(`Indukció + binomiális azonosság?`), 1, 'igen'];
        return [5, `n 2^{n-1} n=1?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Bijekció véges halmazokon elemszám-egyenlőség?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `C(10,1)=?`, 10, '10'];
        if (i % 5 === 2) return [6, yn(`Kettős leszámlálás = két oldal ugyanaz a mennyiség?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `P(5,1)=5. 5=?`, 5, '5'];
        return [6, yn(`Világos bijekció a legerősebb magyarázat?`), 1, 'igen'];
    });
    return out;
}
