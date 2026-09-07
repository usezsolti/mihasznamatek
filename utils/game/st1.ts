import type { LaRow as StRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: StRow[], make: (i: number) => StRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Statisztikai alapok */
export function st1Alapok(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i === 0) return [1, `A {2, 4, 6} minta elemszáma n=?`, 3, '3'];
        if (i % 4 === 1) return [1, yn(`Sokaság = vizsgált teljes halmaz?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Minta a sokaság részhalmaza?`), 1, 'igen'];
        return [1, `n=8 mintaelemszám. n=?`, 8, '8'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Reprezentatív minta tükrözi a sokaságot?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Nominális skála: kategóriák, nincs sorrend?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Ordinális: van sorrend, nincs egyenlő köz?`), 1, 'igen'];
        return [2, yn(`Intervallum/arány: numerikus mérés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Paraméter a sokaság jellemzője?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Mintából számolt mennyiség = statisztika?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Egyszerű véletlen mintavétel: egyenlő esély?`), 1, 'igen'];
        return [3, yn(`Rétegzett mintavétel: rétegekből külön?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Változó: megfigyelt jellemző?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Kvalitatív vs kvantitatív adattípus?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `n=1 egyelemű minta. n=?`, 1, '1'];
        return [4, yn(`Torzított mintavétel rontja a reprezentativitást?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Arányskála: van abszolút 0?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Hőmérséklet °C intervallumskála?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `10 fős minta, n=?`, 10, '10'];
        return [5, yn(`Cenzus = teljes sokaság megfigyelése?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Nagyobb n általában pontosabb becslés?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `n=0 üres minta. n=?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Cluster mintavétel csoportokat sorsol?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Diszkrét vs folytonos változó?`), 1, 'igen'];
        return [6, yn(`Minta célja a sokaság következtetése?`), 1, 'igen'];
    });
    return out;
}

/** Adatok leírása */
export function st1Leiras(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `Gyakoriság: 2,3,5 összeg n=?`, 10, '10'];
        if (i % 4 === 1) return [1, `Relatív gyakoriság 4/8=?`, 0.5, '1/2'];
        if (i % 4 === 2) return [1, yn(`Hisztogram folytonos adat osztásközeire?`), 1, 'igen'];
        return [1, yn(`Boxplot: min, Q1, med, Q3, max?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `3 előfordulás 12-ből, relatív=?`, 0.25, '1/4'];
        if (i % 4 === 1) return [2, yn(`Tapasztalati eloszlás a mintából?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`F_n(x) tapasztalati eloszlásfüggvény?`), 1, 'igen'];
        return [2, `kumulált 0+2+3=5. 5=?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Osztályközép a hisztogram oszlopához?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `100%, relatív összeg?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`Outlier a boxploton túlnyúlhat?`), 1, 'igen'];
        return [3, yn(`Gyakorisági táblázat kategóriánként?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `F_n(-∞)=0. 0=?`, 0, '0'];
        if (i % 4 === 1) return [4, `F_n(+∞)=1. 1=?`, 1, '1'];
        if (i % 4 === 2) return [4, yn(`Glivenko–Cantelli: F_n → F?`), 1, 'igen'];
        return [4, `5/5 relatív=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`IQR = Q3−Q1 a doboz magassága?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `Q1=2, Q3=6, IQR=?`, 4, '4'];
        if (i % 4 === 2) return [5, yn(`Számláló vs oszlopdiagram diszkrétre?`), 1, 'igen'];
        return [5, `gyakoriság 0 kategória. 0=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `2/10 relatív=?`, 0.2, '0.2'];
        if (i % 5 === 1) return [6, yn(`Sűrűséghisztogram terület ≈1?`), 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Kvantilis a tapasztalt eloszlásból?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `n=4, egyenlő 1/n lépcső. 1/4=?`, 0.25, '0.25'];
        return [6, yn(`Leíró ábra nem következtetés próba?`), 1, 'igen'];
    });
    return out;
}

/** Középértékek és szóródás */
export function st1Kozep(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `Átlag (2,4,6)=?`, 4, '4'];
        if (i % 4 === 1) return [1, `Medián (1,2,3)=?`, 2, '2'];
        if (i % 4 === 2) return [1, `Módusz (1,1,2)=?`, 1, '1'];
        return [1, `Terjedelem (1,5)=?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `Átlag (0,10)=?`, 5, '5'];
        if (i % 4 === 1) return [2, `Medián (1,3,5,7)=?`, 4, '4'];
        if (i % 4 === 2) return [2, yn(`Kvartilisek: Q1, Q2=med, Q3?`), 1, 'igen'];
        return [2, `Q2 medián (2,4,6,8,10)=?`, 6, '6'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `Pop. var (2,4,6): átlag 4, ((4+0+4)/3)=?`, 2.667, '8/3'];
        if (i % 4 === 1) return [3, `(5,5,5) szórás=?`, 0, '0'];
        if (i % 4 === 2) return [3, yn(`s² mintavarianciánál /(n-1)?`), 1, 'igen'];
        return [3, `n-1 n=5?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `CV = s/átlag. s=2, átlag=10, CV=?`, 0.2, '0.2'];
        if (i % 4 === 1) return [4, yn(`Ferdeség aszimmetria?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Csúcsosság (kurtózis) farok vastagság?`), 1, 'igen'];
        return [4, `Σx=12, n=3, átlag=?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `min=0, max=10, terjedelem=?`, 10, '10'];
        if (i % 4 === 1) return [5, yn(`Átlag érzékeny outlierre, medián kevésbé?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `páros n medián két középső átlaga. (1,2,3,4) med=?`, 2.5, '2.5'];
        return [5, `1+2+3+4=10, n=4, átlag=?`, 2.5, '2.5'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `σ=3, σ²=?`, 9, '9'];
        if (i % 5 === 1) return [6, yn(`Szórás = √variancia?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Q1=1, Q3=5, IQR=?`, 4, '4'];
        if (i % 5 === 3) return [6, `(10,10) átlag=?`, 10, '10'];
        return [6, yn(`Relatív szórás dimenziótlan?`), 1, 'igen'];
    });
    return out;
}

/** Valószínűségi háttér — ID st1-eloszlas, ne valoszinuseg */
export function st1Eloszlas(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`P(A)+P(A^c)=1?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `P=0.3, P(komplementer)=?`, 0.7, '0.7'];
        if (i % 4 === 2) return [1, yn(`Függetlenség: P(A∩B)=P(A)P(B)?`), 1, 'igen'];
        return [1, `0.2·0.5=?`, 0.1, '0.1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`E[X] várható érték?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `Bernoulli p=0.4, E[X]=?`, 0.4, 'p'];
        if (i % 4 === 2) return [2, `Binom n=10,p=0.5, E=?`, 5, 'np'];
        return [2, yn(`Var(X)=E[X²]-(E[X])²?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `Poisson λ=4, E=?`, 4, 'λ'];
        if (i % 4 === 1) return [3, yn(`N(μ,σ²) haranggörbe?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `Egyenletes [0,1], E=?`, 0.5, '1/2'];
        return [3, yn(`Exp(λ) emlékezetmentes?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `Binom Var=np(1-p), n=4,p=0.5, Var=?`, 1, '1'];
        if (i % 4 === 1) return [4, yn(`Nagy számok: átlag → μ?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`CLT: √n (átlag-μ) ≈ normális?`), 1, 'igen'];
        return [4, `P(biztos)=1. 1=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `P(üres)=0. 0=?`, 0, '0'];
        if (i % 4 === 1) return [5, yn(`Feltételes: P(A|B)=P(A∩B)/P(B)?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `N(0,1) szórás=?`, 1, '1'];
        return [5, yn(`Bernoulli speciális binom n=1?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `σ=2, Var=?`, 4, '4'];
        if (i % 5 === 1) return [6, yn(`Nevezetes eloszlások paraméteres családok?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `E[c]=c, c=7?`, 7, '7'];
        if (i % 5 === 3) return [6, yn(`Diszkrét vs folytonos sűrűség?`), 1, 'igen'];
        return [6, yn(`Eseményművelet: unió, metszet, komplementer?`), 1, 'igen'];
    });
    return out;
}

/** Becslések */
export function st1Becsles(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Pontbecslés: egy szám a paraméterre?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Torzítatlan: E[θ̂]=θ?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Konzisztens: θ̂ → θ valószínűségben?`), 1, 'igen'];
        return [1, yn(`MLE: likelihood maximuma?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Momentumok módszere: mintamomentum = elméleti?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `mintaátlag torzítatlan μ-re? (1)`, 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Hatásosabb: kisebb variancia?`), 1, 'igen'];
        return [2, yn(`Erős konzisztencia: m.m. konvergencia?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `n=4, átlag (1,3,5,7)=? μ̂`, 4, '4'];
        if (i % 4 === 1) return [3, yn(`s² torzítatlan σ²-re (n-1)?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`MLE Bernoulli: p̂=átlag?`), 1, 'igen'];
        return [3, `3 fej 10 dobásból, p̂=?`, 0.3, '0.3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Torzítás = E[θ̂]−θ?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `torzítás 0. 0=?`, 0, '0'];
        if (i % 4 === 2) return [4, yn(`MSE = Var + torzítás²?`), 1, 'igen'];
        return [4, yn(`Becslőfüggvény a mintán értelmezett?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Invariancia: MLE g(θ) = g(MLE)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `Poisson λ̂=átlag, adatok 2,4, λ̂=?`, 3, '3'];
        if (i % 4 === 2) return [5, yn(`Egyenletes [0,θ] MLE = max X_i?`), 1, 'igen'];
        return [5, yn(`Konzisztencia n→∞?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Cramér–Rao alsó korlát a Var-ra?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `p̂=1, n=1 siker. 1=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`MOM és MLE gyakran egybeesik?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `n=2, (0,2) átlag=?`, 1, '1'];
        return [6, yn(`Pontbecslés ≠ intervallum?`), 1, 'igen'];
    });
    return out;
}

/** Konfidenciaintervallumok */
export function st1Konfidencia(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`95% konfidenciaszint gyakori?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `α=0.05, 1−α=?`, 0.95, '0.95'];
        if (i % 4 === 2) return [1, yn(`KI: véletlen intervallum fedi θ-t 1−α-val?`), 1, 'igen'];
        return [1, yn(`z_{0.025}≈1.96 N(0,1)-hez?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `szélesség 2, félszélesség=?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`μ KI: átlag ± z σ/√n (ismert σ)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Ismeretlen σ: t-eloszlás?`), 1, 'igen'];
        return [2, `√n n=9, √9=?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Arány p: p̂ ± z √(p̂(1-p̂)/n)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `p̂=0.5, n=100, se=√(0.25/100)=?`, 0.05, '0.05'];
        if (i % 4 === 2) return [3, yn(`σ² KI: χ²-eloszlás?`), 1, 'igen'];
        return [3, yn(`Nagyobb n ⇒ rövidebb KI (általában)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `1−α=0.99, α=?`, 0.01, '0.01'];
        if (i % 4 === 1) return [4, yn(`Kétoldali vs egyoldali KI?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `átlag=10, hibahatár=2, alsó=?`, 8, '8'];
        return [4, `felső 10+2=?`, 12, '12'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`df=n-1 t-próba/KI átlagra?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `n=5, df=?`, 4, '4'];
        if (i % 4 === 2) return [5, yn(`Szórás KI a variancia gyökéből?`), 1, 'igen'];
        return [5, yn(`A konfidenciaszint a eljárás hosszú távú fedésére vonatkozik?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Normális adat: μ és σ² KI klasszikus?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `z=2, se=1, hibahatár=?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Bootstrap is adhat KI-t?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `α=0, degenerált 100%. 1-α=?`, 1, '1'];
        return [6, yn(`Konfidencia ≠ p-érték, de rokon?`), 1, 'igen'];
    });
    return out;
}
