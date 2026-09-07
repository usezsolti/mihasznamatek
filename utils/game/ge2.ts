import type { LaRow as DmRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DmRow[], make: (i: number) => DmRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Gráfszínezés */
export function ge2Szinezes(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Szomszédos csúcsok különböző szín?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`χ(G) kromatikus szám?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `χ(K_n)=n. n=4, χ=?`, 4, '4'];
        return [1, `χ(üres)=1. 1=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`ω(G) klikkszám, χ≥ω?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `C_5 χ=3, ω=2. χ=?`, 3, '3'];
        if (i % 4 === 2) return [2, yn(`Mohó: Δ+1 szín elég?`), 1, 'igen'];
        return [2, yn(`Brooks: χ≤Δ kivéve K_n és páratlan kör?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Független halmaz: nincs él belül?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Élszínezés: incidens élek más szín?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Vizing: χ' = Δ vagy Δ+1 egyszerűre?`), 1, 'igen'];
        return [3, `χ'(K_3)=3=Δ+1? Δ=2, χ'=?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `páros gráf χ=2 (ha van él). 2=?`, 2, '2'];
        if (i % 4 === 1) return [4, yn(`Páros ⇒ élszínezés χ'=Δ?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `α független max. K_3 α=?`, 1, '1'];
        return [4, yn(`Klikk = teljes részgráf?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `Δ=0, χ=1. 1=?`, 1, '1'];
        if (i % 4 === 1) return [5, yn(`4-szín síkgráfra?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `C_6 páros, χ=?`, 2, '2'];
        return [5, yn(`Mohó sorrendfüggő?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `χ(K_1)=?`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Mycielski: χ nagy, ω=2?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Δ(K_4)=3, χ=4. 4=?`, 4, '4'];
        if (i % 5 === 3) return [6, yn(`Osztály 1: χ'=Δ?`), 1, 'igen'];
        return [6, yn(`Színezés = partíció függetlenekre?`), 1, 'igen'];
    });
    return out;
}

/** Síkgráfok */
export function ge2Sik(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Síkgráf: élmetszés nélkül síkba?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Euler: n-e+f=2 összefüggő síkra?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `V=4,E=6,F=4 tetraéder. 4-6+4=?`, 2, '2'];
        return [1, yn(`K_5 nem síkgráf?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`K_{3,3} nem síkgráf?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`|E|≤3n-6 n≥3 egyszerű sík?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `n=4, 3·4-6=?`, 6, '6'];
        return [2, yn(`Kuratowski: K_5 vagy K_{3,3} felosztás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Duális: tartomány ↔ csúcs?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `C_4 sík, n=4,e=4, f=2. 4-4+2=?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Háromszögmentes sík |E|≤2n-4?`), 1, 'igen'];
        return [3, yn(`Külső tartomány is F-ben van?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `K_4 síkbarajzolható? (1)`, 1, 'igen'];
        if (i % 4 === 1) return [4, `fa n=5, e=4, f=1. 5-4+1=?`, 2, '2'];
        if (i % 4 === 2) return [4, yn(`Wagner K_5-minor is karakterizál?`), 1, 'igen'];
        return [4, yn(`Síkgráf 5-színezhető (Heawood/5-szín)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `n=6, 3n-6=12. max |E|≤?`, 12, '12'];
        if (i % 4 === 1) return [5, yn(`Sztereografikus: gömb = sík+∞?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `F=1 csak fa/erdő síkon. fa f=?`, 1, '1'];
        return [5, yn(`K_{3,3} 6 csúcs, 9 él?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `|E|=9, K_{3,3}. 9=?`, 9, '9'];
        if (i % 5 === 1) return [6, yn(`Minor ≠ felosztás mindig, de Kuratowski felosztás?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `Euler 2 a síkon. 2=?`, 2, '2'];
        if (i % 5 === 3) return [6, yn(`Maximalis sík: minden tartomány 3-szög?`), 1, 'igen'];
        return [6, yn(`4-szín tétel síkgráf χ≤4?`), 1, 'igen'];
    });
    return out;
}

/** Páros gráfok */
export function ge2Paros(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`V=A∪B, élek csak A–B?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Páros ⇔ nincs páratlan kör?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `K_{2,3} |E|=6. 6=?`, 6, '6'];
        return [1, `K_{1,n} csillag |E|=n. n=5?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`χ≤2 ha páros (üres 1)?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `C_4 páros? (1)`, 1, 'igen'];
        if (i % 4 === 2) return [2, `C_5 páros? (0)`, 0, 'nem'];
        return [2, yn(`K_{m,n} teljes páros?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `|V|=m+n K_{m,n}. m=2,n=2, |V|=?`, 4, '4'];
        if (i % 4 === 1) return [3, yn(`BFS 2-színezés teszteli?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `erdő páros? (1)`, 1, 'igen'];
        return [3, yn(`Részgráfja páros gráfnak páros?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `K_{3,3} |E|=9. 9=?`, 9, '9'];
        if (i % 4 === 1) return [4, yn(`Egyélű gráf páros?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `A=3,B=0, élek 0. |E|=?`, 0, '0'];
        return [4, yn(`Irányítatlan definíció itt?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `max él K_{3,4}=12. 12=?`, 12, '12'];
        if (i % 4 === 1) return [5, yn(`Párosítás természetes párosban?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `C_6 páros, |E|=?`, 6, '6'];
        return [5, yn(`Komponensenként 2-színezhető?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `K_{2,2} ≅ C_4. |E|=?`, 4, '4'];
        if (i % 5 === 1) return [6, yn(`Páratlan kör tiltott?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `m=n=1, K_{1,1} |E|=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Sík: K_{3,3} nem?`), 1, 'igen'];
        return [6, yn(`Teljes nem páros n≥3?`), 1, 'igen'];
    });
    return out;
}

/** Párosítások és Hall–Kőnig */
export function ge2Parositas(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Párosítás: diszjunkt élek?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`ν max párosítás mérete?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `K_2 ν=?`, 1, '1'];
        return [1, yn(`Hall: |N(S)|≥|S| minden S⊆A?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Kőnig: párosban ν=τ (lefogó pontok)?`), 1, 'igen'];
        if (i % 4 === 1) return [2, `P_3 ν=?`, 1, '1'];
        if (i % 4 === 2) return [2, yn(`Teljes párosítás: minden csúcs fedett?`), 1, 'igen'];
        return [2, yn(`Tutte általános gráfra?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `K_{2,2} ν=?`, 2, '2'];
        if (i % 4 === 1) return [3, yn(`Magyar módszer hozzárendelés?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Javítóút Berge: max ⇔ nincs javító?`), 1, 'igen'];
        return [3, `csillag K_{1,3} ν=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `τ Kőnig = ν. K_{3,3} ν=?`, 3, '3'];
        if (i % 4 === 1) return [4, yn(`Lefogó élhalmaz ρ, Gallai?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `üres ν=?`, 0, '0'];
        return [4, yn(`Hall elégséges és szükséges A-fedésre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Hopcroft–Karp páros párosítás?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `C_4 ν=?`, 2, '2'];
        if (i % 4 === 2) return [5, yn(`Átlagos: ν ≤ n/2?`), 1, 'igen'];
        return [5, yn(`Súlyozott: Kuhn-Munkres?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `n=6 teljes, ν=?`, 3, '3'];
        if (i % 5 === 1) return [6, yn(`Tutte-feltétel o(G-S)≤|S|?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `1 él ν=1. 1=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Párosítás ≠ feszítőfa?`), 1, 'igen'];
        return [6, yn(`Kőnig csak párosban egyenlőség?`), 1, 'igen'];
    });
    return out;
}

/** Hálózati folyamok */
export function ge2Folyam(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Hálózat: kapacitás, forrás s, nyelő t?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Folyam: 0≤f≤c, megmaradás?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`max |f| = min vágás (MFMC)?`), 1, 'igen'];
        return [1, `c(s,t)=5 egy él, max folyam?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Ford–Fulkerson javítóutak?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Maradékhálózat?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `két párhuzamos él 3 és 4, max?`, 7, '7'];
        return [2, yn(`Egész kapacitás ⇒ egész max folyam?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`s-t vágás: S∋s, T∋t, kapacitás δ^+(S)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `min vágás 2, max folyam?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Edmonds–Karp legrövidebb javító?`), 1, 'igen'];
        return [3, yn(`Dinic blokkoló folyam?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `f=0 kezdet, |f|=?`, 0, '0'];
        if (i % 4 === 1) return [4, yn(`Csúcs-kapacitás: csúcs kettévágása?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Több forrás: szuper-s?`), 1, 'igen'];
        return [4, `kapacitás 0 él, folyam azon?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Javítóút hiány ⇒ max folyam?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `3 él vágás 1+1+1, min≤3. ha ez min, max=?`, 3, '3'];
        if (i % 4 === 2) return [5, yn(`Cirkuláció: nincs s,t?`), 1, 'igen'];
        return [5, yn(`Irracionális c: FF nem mindig véges?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Menger folyam-speciális (egységkapacitás)?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `egy él c=1, max=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Min-cut tanú a dualitásnak?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `párhuzamos 2+2 max=?`, 4, '4'];
        return [6, yn(`Folyamérték = s kilépő − belépő?`), 1, 'igen'];
    });
    return out;
}

/** Menger, Tutte, kombinatorikus algoritmusok */
export function ge2Menger(): DmRow[] {
    const out: DmRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Menger: diszjunkt utak = min vágás?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Él- és csúcs-változat is van?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `2 élfüggetlen út, min élvágás?`, 2, '2'];
        return [1, yn(`Tutte: teljes párosítás feltétel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Magyar / Kuhn párosítás?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Folyam-algoritmus Mengerre?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `összefüggőség κ, λ. hídszám λ=1. 1=?`, 1, '1'];
        return [2, yn(`Whitney: κ≤λ≤δ?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Petersen 3-reguláris, κ=3?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `fa λ=1. 1=?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`K_n κ=n-1?`), 1, 'igen'];
        return [3, `n=5, κ(K_5)=?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Blossom Edmonds általános párosítás?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Global min-cut Karger?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `δ=2 ⇒ λ≤2. 2=?`, 2, '2'];
        return [4, yn(`Menger lokális s-t?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Tutte-mátrix párosítás det?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `0 út ha s,t külön komponens. utak?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`2-összefüggő: nincs vágócsúcs?`), 1, 'igen'];
        return [5, yn(`Ear-dekompozíció 2-összefüggőre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `3 csúcsfüggetlen s-t út, min csúcsvágás?`, 3, '3'];
        if (i % 5 === 1) return [6, yn(`Algoritmus: max folyam egységc?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `K_2 λ=?`, 1, '1'];
        if (i % 5 === 3) return [6, yn(`Kombinatorikus opt: párosítás+folyam?`), 1, 'igen'];
        return [6, yn(`Menger = MFMC diszkrét utakra?`), 1, 'igen'];
    });
    return out;
}
