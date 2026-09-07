import type { LaRow as DeRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: DeRow[], make: (i: number) => DeRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Másodrendű homogén egyenletek */
export function de2Homogen(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`ay''+by'+cy=0 állandó együtthatós homogén?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `y''+y=0 rendje?`, 2, '2'];
        if (i % 4 === 2) return [1, yn(`Karakterisztikus: ar²+br+c=0?`), 1, 'igen'];
        return [1, yn(`Két független megoldás adja az alaprendszert?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `r²-1=0, r=±1. nagyobb r?`, 1, '1'];
        if (i % 4 === 1) return [2, `r²+1=0, valós gyökök száma?`, 0, '±i'];
        if (i % 4 === 2) return [2, `r²+2r+1=0, kettős r=?`, -1, '−1'];
        return [2, yn(`y=e^{rx} próba homogénre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `r1≠r2: y=C1 e^{r1 x}+C2 e^{r2 x}? (1=igen)`, 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Kettős gyöknél kell x e^{rx} tag?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Komplex: e^{αx}(C1 cos βx+C2 sin βx)?`), 1, 'igen'];
        return [3, `y''-y=0, r=±1, y(0)=0, C1+C2=0. C1=1, C2=?`, -1, '−1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `y''+4y=0, ω=2, β=?`, 2, '2'];
        if (i % 4 === 1) return [4, `y''+2y'+y=0, r=?`, -1, '−1'];
        if (i % 4 === 2) return [4, yn(`Homogén szuperpozíció érvényes?`), 1, 'igen'];
        return [4, `dim megoldástér 2. rendű lineárisnál?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Állandó együttható: p,q konstans?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `y''=0, általános y=C1+C2 x. y''=?`, 0, '0'];
        if (i % 4 === 2) return [5, `r²-4=0, r=2 vagy? a másik`, -2, '−2'];
        return [5, yn(`Triviális megoldás y=0 mindig homogénnel?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `y''+ω² y=0, ω=3, T=2π/ω. T=? (3 tizedes)`, 2.094, '2π/3'];
        if (i % 5 === 1) return [6, yn(`Változó együtthatós nem karakterisztikus polinommal megy?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `C1=0, C2=0, y=?`, 0, '0'];
        if (i % 5 === 3) return [6, yn(`Két valós különböző gyök: nincs oszcilláció e^{rx} páron?`), 1, 'igen'];
        return [6, `b²-4ac=0 kettős. diszkrimináns 0? (1)`, 1, 'igen'];
    });
    return out;
}

/** Karakterisztikus egyenlet és gyöktípusok */
export function de2Karakt(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, `r²+5r+6=0, gyökök -2,-3. összeg?`, -5, '−5'];
        if (i % 4 === 1) return [1, `r²+5r+6=0, szorzat?`, 6, '6'];
        if (i % 4 === 2) return [1, `diszkrimináns 25-24=?`, 1, '1'];
        return [1, yn(`D>0 két különböző valós?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`D=0 kettős valós?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`D<0 komplex konjugált?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `r²+1=0, α=? (valós rész)`, 0, '0'];
        return [2, `r²+1=0, β=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `r=3±2i, α=?`, 3, '3'];
        if (i % 4 === 1) return [3, `r=3±2i, β=?`, 2, '2'];
        if (i % 4 === 2) return [3, `kettős r=4, második megoldás x e^{4x}. e^0 x=0-nál?`, 0, '0'];
        return [3, yn(`Euler-formula köti a komplex gyököt sin/cos-hoz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `3. rendű: 3 gyök (ℂ, multiplicitással). n=?`, 3, '3'];
        if (i % 4 === 1) return [4, yn(`Magasabb rend: karakterisztikus polinom n-edfokú?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `r^3=0, hármas 0. megoldások 1,x,x². hány?`, 3, '3'];
        return [4, `r=0 kétszer, y=C1+C2 x. y(0)=C1. C1=5, y(0)=?`, 5, '5'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Vieta: összeg -b/a?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `a=1,b=0,c=4, r²+4=0, β=?`, 2, '2'];
        if (i % 4 === 2) return [5, yn(`Valós együttható ⇒ konjugált gyökpár?`), 1, 'igen'];
        return [5, `egy gyök r=0: van konstans megoldás? (1)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `r=±3, y=C1 e^{3x}+C2 e^{-3x}. y=0,x=0: C1+C2=?`, 0, '0'];
        if (i % 5 === 1) return [6, yn(`Többszörös gyöknél x^k e^{rx} k=0..m-1?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `D=9-8=1>0. két valós? (1)`, 1, 'igen'];
        if (i % 5 === 3) return [6, `α=0, β=5, y=C1 cos 5x+C2 sin 5x. y(0)=C1. C1=0, y(0)=?`, 0, '0'];
        return [6, yn(`Karakterisztikus gyök = exponenciális kitevő?`), 1, 'igen'];
    });
    return out;
}

/** Inhomogén differenciálegyenletek */
export function de2Inhomogen(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`y = yh + yp?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Próbafüggvény: f alakjához hasonló yp?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Rezonancia: f benne van a homogénben ⇒ x^s szorzó?`), 1, 'igen'];
        return [1, `f=konstans, yp=A, y''+y=2, A=2. A=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `y''+y=e^{0}, yp=A, A=1, y''+y=1. A=?`, 1, '1'];
        if (i % 4 === 1) return [2, yn(`Exponenciális jobb oldal: yp=A e^{αx} ha α nem gyök?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Polinom jobb oldal: yp polinom?`), 1, 'igen'];
        return [2, yn(`sin/cos jobb oldal: yp=A cos+B sin?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `y''+y=sin x rezonáns, yp=x(A cos+B sin). s=? (x hatvány)`, 1, '1'];
        if (i % 4 === 1) return [3, yn(`Állandók variálása mindig működik (elméletben)?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `yh dimenziója 2. hány C?`, 2, '2'];
        return [3, yn(`yp egy partikuláris, nem tartalmazza a C-ket?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `y''=6, yp=x³, y''(x³)=6. 6=?`, 6, '6'];
        if (i % 4 === 1) return [4, yn(`f=e^{rx} és r gyök ⇒ yp=A x e^{rx}?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `kettős gyök rezonancia x² e^{rx}. kitevő x-en?`, 2, '2'];
        return [4, yn(`Összeg jobb oldalnál yp összege?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`IVP a C1,C2-t yh+yp-ben rögzíti?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `yp=3, konstans. yh+3. ha yh(0)=0, y(0)=?`, 3, '3'];
        if (i % 4 === 2) return [5, yn(`Próba bukik, ha rossz alak?`), 1, 'igen'];
        return [5, yn(`Lineáris inhomogén: homogén + 1 partikuláris?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `f=x, yp=Ax+B. y''+y=x, A=1,B=0. A=?`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Komplex módszer e^{iωx} próbával?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `y''-y=1, yp=-1. yp=?`, -1, '−1'];
        if (i % 5 === 3) return [6, yn(`Variáció: C_i(x) a homogén bázison?`), 1, 'igen'];
        return [6, yn(`Jobb oldal 0 ⇒ yp=0 választható?`), 1, 'igen'];
    });
    return out;
}

/** Állandók variálása és Wronski */
export function de2Wronski(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`W(y1,y2)=y1 y2'-y2 y1'?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `y1=e^x, y2=e^{2x}, W=e^{3x}. W(0)=?`, 1, '1'];
        if (i % 4 === 2) return [1, yn(`W≠0 ⇒ lineárisan független?`), 1, 'igen'];
        return [1, yn(`W=0 mindenütt ⇒ függő (sima esetben)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `y1=1, y2=x, W=1. W=?`, 1, '1'];
        if (i % 4 === 1) return [2, `cos, sin, W=1. W(0)=?`, 1, '1'];
        if (i % 4 === 2) return [2, yn(`Abel: W=C exp(-∫p)?`), 1, 'igen'];
        return [2, yn(`Alaprendszer: n független megoldás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Variáció: u1' y1 + u2' y2 = 0?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`u1' y1' + u2' y2' = f? (2. rend, standard)`), 1, 'igen'];
        if (i % 4 === 2) return [3, `W=2, u1' = -y2 f / W. ha y2=0,u1'=?`, 0, '0'];
        return [3, yn(`Fundamentális rendszer generálja a homogént?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `e^x, e^{-x} W=-2. |W|=?`, 2, '2'];
        if (i % 4 === 1) return [4, yn(`Liouville–Abel W soha nem vált előjelet 0-n át ha C≠0?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`n. rendű W n×n determináns?`), 1, 'igen'];
        return [4, `y1=x, y2=x², W=x². W(1)=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`yp=u1 y1+u2 y2?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Homogén W-je 0-ra esik függő párnál?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `W(sin,sin)=0. 0=?`, 0, '0'];
        return [5, yn(`Wronski függetlenség teszt?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `y1=e^{2x}, y2=x e^{2x}, kettős gyök bázis. W(0)=?  e^0(1)=1`, 1, '1'];
        if (i % 5 === 1) return [6, yn(`Variáció működik változó együtthatónál is?`), 1, 'igen'];
        if (i % 5 === 2) return [6, yn(`Cramer a u'-kre W-vel?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `2×2 W, két függvény. dim?`, 2, '2'];
        return [6, yn(`Alaprendszer W≠0 egy ponton (Abel)?`), 1, 'igen'];
    });
    return out;
}

/** Harmonikus és csillapított rezgések */
export function de2Rezges(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`y''+ω² y=0 harmonikus?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `ω=2, periódus T=2π/ω. T=? (3 tizedes)`, 3.142, 'π'];
        if (i % 4 === 2) return [1, `y=A cos(ωt)+B sin. y(0)=A. A=3, y(0)=?`, 3, '3'];
        return [1, yn(`Sajátfrekvencia ω0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`y''+2δ y'+ω0² y=0 csillapított?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`δ>ω0 túlcsillapított?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`δ=ω0 kritikus?`), 1, 'igen'];
        return [2, yn(`δ<ω0 alulcsillapított (oszcillál)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, `ω=1, y=cos t, y(0)=?`, 1, '1'];
        if (i % 4 === 1) return [3, `kritikus: y=(C1+C2 t)e^{-δ t}. t=0, C1=y(0). y(0)=2, C1=?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Csillapítás energiát visz el?`), 1, 'igen'];
        return [3, `Túlcsillapított: két valós negatív r. oszcilláció? (0=nem)`, 0, 'nem'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `ω=4, T=π/2=1.571`, 1.571, 'π/2'];
        if (i % 4 === 1) return [4, yn(`Fázis φ: A cos(ωt-φ) alak?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `A=5, B=0, amplitúdó?`, 5, '5'];
        return [4, yn(`Harmonikus energia megmarad (ideális)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `alul: e^{-δt} (cos μ t...). μ²=ω0²-δ². δ=0, μ=ω0=3, μ=?`, 3, '3'];
        if (i % 4 === 1) return [5, yn(`Csillapított amplitúdó csökken?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `y=0 egyensúly. F=0? (1)`, 1, 'igen'];
        return [5, yn(`Hooke: F=-ky, y''+ω²y, ω²=k/m?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `T=2, ω=2π/T. ω=? (3 tizedes)`, 3.142, 'π'];
        if (i % 5 === 1) return [6, yn(`Kritikus a leggyorsabb visszatérés oszcilláció nélkül?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `δ=0 redukál harmonikusra? (1)`, 1, 'igen'];
        if (i % 5 === 3) return [6, `y=sin(2t), ω=?`, 2, '2'];
        return [6, yn(`Csillapítás 2δ a y' együttható?`), 1, 'igen'];
    });
    return out;
}

/** Gerjesztett rezgések, rezonancia */
export function de2Gerjeszt(): DeRow[] {
    const out: DeRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Gerjesztett: jobb oldal F(t)≠0?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Rezonancia: gerjesztés ≈ sajátfrekvencia?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Csillapítás nélkül rezonancia amplitúdó nő t-vel?`), 1, 'igen'];
        return [1, `F=cos(ω t), ω=ω0, yp ~ t sin. t szorzó? (1=igen)`, 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Állandósult állapot csillapítottnál a gerjesztés frekvenciáján?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Tranziens e^{-δt}-vel lecseng?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `ω0=1, ω=1, rezonancia? (1)`, 1, 'igen'];
        return [2, `ω0=1, ω=2, rezonancia? (0=nem)`, 0, 'nem'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`n. rendű állandó együtthatós: karakterisztikus n-edfok?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `3. rend homogén: 3 független megoldás. hány?`, 3, '3'];
        if (i % 4 === 2) return [3, yn(`Magasabb rend próbafüggvény is megy?`), 1, 'igen'];
        return [3, yn(`Beating: közeli ω és ω0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `F=5 konstans, yp=A, y''+y=5, A=5. A=?`, 5, '5'];
        if (i % 4 === 1) return [4, yn(`Frekvenciaátvitel |H(iω)| max rezonanciánál?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Csillapított rezonancia véges amplitúdó?`), 1, 'igen'];
        return [4, `n=4 ODE, kezdeti feltételek száma?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`y^{(4)}+y=0 karakterisztikus r^4+1=0?`), 1, 'igen'];
        if (i % 4 === 1) return [5, yn(`Gerjesztés periodikus ⇒ partikuláris periodikus (csillapított)?`), 1, 'igen'];
        if (i % 4 === 2) return [5, `ω=0, F konstans. statikus eltérés? (1)`, 1, 'igen'];
        return [5, yn(`Rezonancia káros lehet szerkezeteknél?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `F=sin(3t), próba A cos 3t+B sin 3t ha 3i nem gyök. 3=?`, 3, '3'];
        if (i % 5 === 1) return [6, yn(`Homogén + inhomogén = teljes?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `amplitúdó ∞ ideális rezonancián t→∞? (1)`, 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Variáció magasabb rendre is általános?`), 1, 'igen'];
        return [6, yn(`Sajátfrekvencia a gerjesztés nélkül?`), 1, 'igen'];
    });
    return out;
}
