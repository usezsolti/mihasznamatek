import type { LaRow as StRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: StRow[], make: (i: number) => StRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Hipotézisvizsgálat alapjai */
export function st2Hipotezis(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`H0 a nullhipotézis?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`H1 az alternatíva?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `α=0.05 szignifikanciaszint. α=?`, 0.05, '0.05'];
        return [1, yn(`Elsőfajú hiba: H0 igaz, mégis elvetjük?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Másodfajú hiba: H0 hamis, mégsem vetjük el?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Erő = 1−β?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `β=0.2, erő=?`, 0.8, '0.8'];
        return [2, yn(`p-érték: H0 mellett legalább ilyen szélsőséges adat?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`p<α ⇒ elvetjük H0-t (klasszikus)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `p=0.03, α=0.05, elvetés? (1)`, 1, 'igen'];
        if (i % 4 === 2) return [3, `p=0.2, α=0.05, elvetés? (0)`, 0, 'nem'];
        return [3, yn(`Kritikus tartomány a próbastatisztika szélső zónája?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Kétoldali vs egyoldali próba?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `α/2=0.025 ha α=0.05 kétoldali. α/2=?`, 0.025, '0.025'];
        if (i % 4 === 2) return [4, yn(`Próbastatisztika a mintából?`), 1, 'igen'];
        return [4, yn(`H0-t „elfogadni” óvatosan: inkább nem vetjük el?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, `P(elsőfajú)≤α tervezésnél. α=0.01?`, 0.01, '0.01'];
        if (i % 4 === 1) return [5, yn(`Nagyobb n növeli az erőt (általában)?`), 1, 'igen'];
        if (i % 4 === 2) return [5, yn(`p-érték nem P(H0 igaz)?`), 1, 'igen'];
        return [5, yn(`Szignifikáns ≠ gyakorlati jelentőség?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Neyman–Pearson: adott α mellett max erő?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `p=0, extrém. 0=?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`H0 egyszerű vs összetett?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `1−α=0.95. 0.95=?`, 0.95, '0.95'];
        return [6, yn(`Döntés: elvet / nem vet el?`), 1, 'igen'];
    });
    return out;
}

/** Paraméteres próbák */
export function st2ParamProba(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`z-próba: ismert σ, normális/átlag CLT?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`t-próba: ismeretlen σ, df=n-1?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `n=10, df t=?`, 9, '9'];
        return [1, yn(`Kétmintás: két független minta?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Páros t: különbségek egy mintája?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Welch: egyenlőtlen varianciák t?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`F-próba: két szórás / varianciaarány?`), 1, 'igen'];
        return [2, `z=(x̄-μ0)/(σ/√n). ha x̄=μ0, z=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Egymintás H0: μ=μ0?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Kétmintás H0: μ1=μ2?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `páros n=8 párok, df=?`, 7, '7'];
        return [3, yn(`Előfeltétel: normalitás / nagy n?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `F=s1²/s2². ha s1=s2, F=?`, 1, '1'];
        if (i % 4 === 1) return [4, yn(`Kétoldali t: |t| nagy ⇒ elvetés?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`z és t ≈ nagy df-nél?`), 1, 'igen'];
        return [4, `√n n=16?`, 4, '4'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Kétmintás z ritka (σ ismert)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `μ0=0, x̄=0, t=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Varianciahomogenitás F/Levene a t előtt?`), 1, 'igen'];
        return [5, yn(`Egyoldali: H1: μ>μ0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Pooled t: közös s² feltételezve?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `két minta n1=n2=5, pooled df=?`, 8, '8'];
        if (i % 5 === 2) return [6, yn(`Paraméteres: eloszlásalakot feltételez?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `kritikus z=1.96. 1.96≈?`, 1.96, '1.96'];
        return [6, yn(`Welch df nem feltétlen n1+n2-2?`), 1, 'igen'];
    });
    return out;
}

/** Khi-négyzet próbák */
export function st2Chi2(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`χ² illeszkedés: eloszlás illeszkedik-e?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`χ² függetlenség: kontingencia két változó?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Homogenitás: több minta ugyanaz az eloszlás?`), 1, 'igen'];
        return [1, `χ²=Σ (O-E)²/E. ha O=E, χ²=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `2×2 tábla df=(2-1)(2-1)=?`, 1, '1'];
        if (i % 4 === 1) return [2, `k kategória illeszkedés, ismert param, df=k-1. k=4, df=?`, 3, '3'];
        if (i % 4 === 2) return [2, yn(`Várt gyakoriság n·p_i?`), 1, 'igen'];
        return [2, `O=10, E=10, tag=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Szabály: E≥5 cellánként (ökölszabály)?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `3×2 df=?`, 2, '2'];
        if (i % 4 === 2) return [3, yn(`Pearson χ² aszimptotikus?`), 1, 'igen'];
        return [3, yn(`Yates-korrekció 2×2-re?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `O=5, E=4, (1)²/4=?`, 0.25, '0.25'];
        if (i % 4 === 1) return [4, yn(`H0 függetlenség: P(sor,oszlop)=szorzat?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`G-próba / likelihood-hányados is χ²?`), 1, 'igen'];
        return [4, `r=2,c=3, df=(1)(2)=?`, 2, '2'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Homogenitás = függetlenség más mintavétellel?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `k=2 illeszkedés df=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Multinomiális modell illeszkedéshez?`), 1, 'igen'];
        return [5, yn(`Nagy χ² ⇒ rossz illeszkedés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, `4×4 df=9. 9=?`, 9, '9'];
        if (i % 5 === 1) return [6, yn(`Szabadságfok = cellák − korlátok?`), 1, 'igen'];
        if (i % 5 === 2) return [6, `E=n/k egyenletes, n=12,k=3, E=?`, 4, '4'];
        if (i % 5 === 3) return [6, yn(`Folytonossági korrekció kis n?`), 1, 'igen'];
        return [6, yn(`χ²≥0 mindig?`), 1, 'igen'];
    });
    return out;
}

/** Nemparaméteres próbák */
export function st2Nemparam(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Előjelpróba: különbségek előjele?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Wilcoxon: előjeles rangok?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Mann–Whitney: két független minta rangjai?`), 1, 'igen'];
        return [1, yn(`Nemparaméteres: kevesebb eloszlásfeltevés?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`KS: tapasztalati vs elméleti F?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Kruskal–Wallis: ≥3 minta, rang ANOVA?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Friedman: ismételt mérések rangjai?`), 1, 'igen'];
        return [2, `előjel: 3+, 0−, n=3 (nullák nélkül). 3=?`, 3, '3'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`H0 Wilcoxon: szimmetria 0 körül / medián 0?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`MW H0: P(X>Y)=1/2?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `KS D=sup|Fn-F|. ha egyenlő, D=?`, 0, '0'];
        return [3, yn(`Rang: sorrend, nem a nyers érték?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`KW k=2 ≈ Mann–Whitney?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `k=3 csoport Kruskal. k=?`, 3, '3'];
        if (i % 4 === 2) return [4, yn(`Outlier-tűrőbb, mint t?`), 1, 'igen'];
        return [4, yn(`Kötések (ties) korrekció rangpróbánál?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Előjel kevesebb erő, mint Wilcoxon?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `n=1 Wilcoxon kevés. n=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`KS kétmintás is van?`), 1, 'igen'];
        return [5, yn(`Friedman H0: kezelések azonos?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Aszimptotikus χ² KW/Friedman nagy n?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `rang 1..n összege n(n+1)/2, n=4?`, 10, '10'];
        if (i % 5 === 2) return [6, yn(`Mediánra fókusz, nem μ-re?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Normalitás nélkül is érvényes (H0 alatt)?`), 1, 'igen'];
        return [6, yn(`Paraméteres erősebb, ha a feltevés igaz?`), 1, 'igen'];
    });
    return out;
}

/** Kapcsolatok vizsgálata */
export function st2Kapcsolat(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Kovariancia: együttmozgás?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`r=0 azt jelenti, hogy nincs lineáris kapcsolat?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`r=±1 tökéletes lineáris?`), 1, 'igen'];
        return [1, `r(X,X)=1. 1=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Spearman: rangkorreláció?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Cov(aX,Y)=a Cov(X,Y)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `Cov(X,X)=Var(X). Var=4, Cov=?`, 4, '4'];
        return [2, yn(`Parciális: harmadik változó kontroll?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Többszörös R: Y vs X-ek együtt?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`r szignifikancia: t-próba ρ=0?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `df=n-2 Pearson t. n=10, df=?`, 8, '8'];
        return [3, yn(`Korreláció ≠ kauzalitás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, `r=-1. -1=?`, -1, '−1'];
        if (i % 4 === 1) return [4, yn(`Pearson lineáris, Spearman monoton?`), 1, 'igen'];
        if (i % 4 === 2) return [4, yn(`Standardizált Cov = Pearson?`), 1, 'igen'];
        return [4, `két konstans Cov=?`, 0, '0'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`r² a lineáris magyarázott hányad (egy X)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `r=0.5, r²=?`, 0.25, '0.25'];
        if (i % 4 === 2) return [5, yn(`Előjel r = együtt nő / ellentétes?`), 1, 'igen'];
        return [5, yn(`Outlier elronthatja Pearson-t?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Többszörös R² ∈[0,1]?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `n=2 Pearson df=0. n=?`, 2, '2'];
        if (i % 5 === 2) return [6, yn(`Parciális 0: feltételes lineáris függetlenség?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `Cov skalár 2D-ben. 1 szám. 1=?`, 1, '1'];
        return [6, yn(`Kapcsolat vizsgálata regresszió előtt?`), 1, 'igen'];
    });
    return out;
}

/** Lineáris regresszió */
export function st2Linreg(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Y ≈ β0+β1 X + ε?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`OLS: min Σ e_i²?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `e=y-ŷ, ha y=ŷ, e=?`, 0, '0'];
        return [1, yn(`R² = magyarázott / teljes SST?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `R²=1 tökéletes illeszkedés. 1=?`, 1, '1'];
        if (i % 4 === 1) return [2, `R²=0. 0=?`, 0, '0'];
        if (i % 4 === 2) return [2, yn(`β1 meredekség, β0 tengelymetszet?`), 1, 'igen'];
        return [2, yn(`Reziduum = megfigyelt − illesztett?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Normálegyenlet XᵀX β̂ = Xᵀy?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`H0: β1=0 t-próba?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `egy X, df_error=n-2. n=12, df=?`, 10, '10'];
        return [3, yn(`Gauss–Markov: BLUE a OLS (feltevésekkel)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Homoszkedaszticitás: konstans Var(ε)?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Független hibák?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `β̂1=0 vízszintes. meredekség=?`, 0, '0'];
        return [4, yn(`Modellilleszkedés: reziduumábra, R²?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`SST=SSR+SSE?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `SSE=0, R²=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Átlagos X,Y ponton átmegy az OLS egyenes?`), 1, 'igen'];
        return [5, yn(`Predikció vs becslés a vonalon?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Egy X: r² = R²?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `n=2 két pont, R²=? (nem függőleges)`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Leverage / befolyásos pont?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `β0=5, X=0, Ŷ=?`, 5, '5'];
        return [6, yn(`Lineáris a paraméterekben?`), 1, 'igen'];
    });
    return out;
}
