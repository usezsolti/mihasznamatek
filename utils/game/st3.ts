import type { LaRow as StRow } from './linearisTypes';
import { yn } from './linearisTypes';

function push20(out: StRow[], make: (i: number) => StRow): void {
    for (let i = 0; i < 20; i++) out.push(make(i));
}

/** Többszörös regresszió */
export function st3Tobbreg(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Y=β0+β1X1+…+βp Xp+ε?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `p=3 prediktor. p=?`, 3, '3'];
        if (i % 4 === 2) return [1, yn(`H0: βj=0 t, H0: mind 0 F?`), 1, 'igen'];
        return [1, yn(`Modellépítés: forward/backward/stepwise?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Polinomiális: X, X², … tagok?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Logisztikus: P(Y=1) logit lineáris?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Nemlineáris: paraméterekben nem lineáris?`), 1, 'igen'];
        return [2, `df_error=n-p-1, n=20,p=2, df=?`, 17, '17'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Multikollinearitás: X-ek korrelálnak?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Adjusted R² bünteti a plusz változót?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `R² nőhet p-vel akkor is, ha zaj. R²≥0? (1)`, 1, 'igen'];
        return [3, yn(`AIC/BIC modellválasztás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Odds = p/(1-p) logisztikusnál?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `p=0.5, odds=?`, 1, '1'];
        if (i % 4 === 2) return [4, yn(`MLE logisztikus, nem OLS?`), 1, 'igen'];
        return [4, yn(`Parciális hatás: többi X rögzítve?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`VIF>10 gyanús kollinearitás (ökölszabály)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `p=0 prediktor, csak átlag. p=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Interakció: X1·X2 tag?`), 1, 'igen'];
        return [5, yn(`F-teszt nested modellekre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`GLM: logit/Poisson a család?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `logit(0.5)=0. 0=?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Polinom fok k: k+1 együttható X-en?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `k=2 másodfok. k=?`, 2, '2'];
        return [6, yn(`Többszörös ≠ több Y (az MANOVA)?`), 1, 'igen'];
    });
    return out;
}

/** Varianciaanalízis ANOVA */
export function st3Anova(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`ANOVA: varianciafelbontás csoportok közt/belül?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`F = MS_between / MS_within?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `k=3 csoport egyszempontos. k=?`, 3, '3'];
        return [1, yn(`H0: μ1=μ2=…=μk?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `df_between=k-1, k=4, df=?`, 3, '3'];
        if (i % 4 === 1) return [2, `N=20, k=4, df_within=?`, 16, '16'];
        if (i % 4 === 2) return [2, yn(`Levene: varianciahomogenitás?`), 1, 'igen'];
        return [2, yn(`Post-hoc: Tukey/Bonferroni páronként?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Többszempontos: két faktor + interakció?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`SST=SSB+SSW?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `F=1 ha MSB=MSW. F=?`, 1, '1'];
        return [3, yn(`k=2 ANOVA ≈ kétmintás t²?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Fix vs random hatás?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Normális hiba + egyenlő σ?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `SSW=0 azonos csoporton belül. 0=?`, 0, '0'];
        return [4, yn(`Csoportátlagok összehasonlítása a lényeg?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Interakció: faktorhatás függ a másiktól?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `2×3 elrendezés cellák?`, 6, '6'];
        if (i % 4 === 2) return [5, yn(`Welch ANOVA egyenlőtlen σ-ra?`), 1, 'igen'];
        return [5, yn(`Nagy F + kis p ⇒ van különbség?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Kruskal–Wallis nemparaméteres ANOVA?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `k=1 nincs between. k-1=?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`MS = SS/df?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `Bonferroni α/m, m=10, α=0.05, α/m=?`, 0.005, '0.005'];
        return [6, yn(`Post-hoc csak ha ANOVA szignifikáns (gyakori gyakorlat)?`), 1, 'igen'];
    });
    return out;
}

/** Idősorelemzés — ID st3-idosor, ne sorozat */
export function st3Idosor(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Idősor: időben rendezett megfigyelések?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Trend: hosszú távú irány?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Szezonalitás: naptári ismétlődés?`), 1, 'igen'];
        return [1, yn(`Mozgóátlag simít?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, `MA(3) ablak 3. 3=?`, 3, '3'];
        if (i % 4 === 1) return [2, yn(`Exponenciális simítás: recens súly nagyobb?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Autokorreláció: corr(X_t, X_{t-k})?`), 1, 'igen'];
        return [2, `lag 0 autokorreláció=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`AR(p): X_t a saját késleltetéseiből?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`MA(q): hibák késleltetése?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`ARMA = AR+MA?`), 1, 'igen'];
        return [3, `ARIMA d=1 differencia. d=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Box–Jenkins: azonosít, becsül, ellenőriz?`), 1, 'igen'];
        if (i % 4 === 1) return [4, yn(`Stacionaritás: állandó közép/var?`), 1, 'igen'];
        if (i % 4 === 2) return [4, `AR(1) p=?`, 1, '1'];
        return [4, yn(`ACF/PACF lag-választáshoz?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Differenciálás trendet vehet ki?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `szezon 12 hónap. 12=?`, 12, '12'];
        if (i % 4 === 2) return [5, yn(`Fehérzaj: korrelálatlan?`), 1, 'igen'];
        return [5, yn(`Előrejelzés a modellből?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`SARIMA szezonális ARIMA?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `MA(0)+AR(0)=zaj. q+p=?`, 0, '0'];
        if (i % 5 === 2) return [6, yn(`Holt–Winters trend+szezon simítás?`), 1, 'igen'];
        if (i % 5 === 3) return [6, `lag 1 ACF fehérzaj ≈0. 0=?`, 0, '0'];
        return [6, yn(`Időrend számít, nem i.i.d. minta?`), 1, 'igen'];
    });
    return out;
}

/** Többváltozós: kovariancia, PCA, faktor */
export function st3Pca(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Kovarianciamátrix szimmetrikus, diag=varianciák?`), 1, 'igen'];
        if (i % 4 === 1) return [1, `p=2 változó, kovariancia mátrix 2×2. p=?`, 2, '2'];
        if (i % 4 === 2) return [1, yn(`Korrelációs mátrix: standardizált Cov?`), 1, 'igen'];
        return [1, `diag R mind 1. R_11=?`, 1, '1'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`PCA: max variancia irányok, sajátvektorok?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Első PC a legnagyobb sajátérték?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `Σ λ = nyom = összes var. 2 változó var 3+1, nyom=?`, 4, '4'];
        return [2, yn(`Faktoranalízis: látens faktorok + egyedi?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Dimenziócsökkentés: k≪p komponens?`), 1, 'igen'];
        if (i % 4 === 1) return [3, `k=1 PC. k=?`, 1, '1'];
        if (i % 4 === 2) return [3, yn(`Scree-plot a λ-kra?`), 1, 'igen'];
        return [3, yn(`Többdimenziós adat: vektor megfigyelésenként?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`Ortogonális PC-k (korrelálatlan)?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `p=p PC megőrzi az egészet. p=5?`, 5, '5'];
        if (i % 4 === 2) return [4, yn(`Standardizálás PCA előtt gyakran?`), 1, 'igen'];
        return [4, yn(`Többváltozós regresszió: több X, egy Y (itt)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Pozitív szemidefinit Σ?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `λ1=9, λ2=1, első PC hányad 9/10=?`, 0.9, '0.9'];
        if (i % 4 === 2) return [5, yn(`Kommunalitás faktorban?`), 1, 'igen'];
        return [5, yn(`Biplot PC+változó nyilak?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`SVD a PCA számolása?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `p=1, PCA triviális. p=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Korreláció 0 ⇒ Cov 0 (centrálva)?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`Korrelálatlanság mindig függetlenség?`), 0, 'nem'];
        return [6, yn(`Főkomponens ≠ faktor mindig?`), 1, 'igen'];
    });
    return out;
}

/** Klaszteranalízis és MDS */
export function st3Klaszter(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Klaszter: hasonló megfigyelések csoportja?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`k-means: k centroida, euklideszi?`), 1, 'igen'];
        if (i % 4 === 2) return [1, `k=3 klaszter. k=?`, 3, '3'];
        return [1, yn(`Hierarchikus: dendrogram?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`MDS: távolságok síkba/térbe?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Távolság d(i,i)=0?`), 1, 'igen'];
        if (i % 4 === 2) return [2, `k=1 minden egy csoport. k=?`, 1, '1'];
        return [2, yn(`WCSS k-means célfüggvény?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Linkage: single/complete/average?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Standardizálás a távolság előtt?`), 1, 'igen'];
        if (i % 4 === 2) return [3, `n=n singleton hierarchia elején. n=4?`, 4, '4'];
        return [3, yn(`Felügyelet nélküli tanulás?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`MDS stress a torzítás?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `2D MDS dim=?`, 2, '2'];
        if (i % 4 === 2) return [4, yn(`Elbow: WCSS vs k?`), 1, 'igen'];
        return [4, yn(`Másik metrika: Manhattan, korreláció?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`k-means lokális minimum (init)?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `üres klaszter rossz. 0 elem. 0=?`, 0, '0'];
        if (i % 4 === 2) return [5, yn(`Agglomeratív vs osztó hierarchia?`), 1, 'igen'];
        return [5, yn(`Sziluett a klaszterminőségre?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`PCA előszűrő klaszter előtt?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `k=n, minden pont saját. k/n=1. 1=?`, 1, '1'];
        if (i % 5 === 2) return [6, yn(`Klasszifikáció felügyelt, klaszter nem?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`MDS klasszikus = sajátérték a kettős centráláson?`), 1, 'igen'];
        return [6, yn(`Cél: belső hasonlóság nagy, külső kicsi?`), 1, 'igen'];
    });
    return out;
}

/** Haladó matematikai statisztika */
export function st3Halado(): StRow[] {
    const out: StRow[] = [];
    push20(out, (i) => {
        if (i % 4 === 0) return [1, yn(`Glivenko–Cantelli: ||Fn-F||_∞→0 m.m.?`), 1, 'igen'];
        if (i % 4 === 1) return [1, yn(`Elégséges: a minta sűrűsége a T-n keresztül?`), 1, 'igen'];
        if (i % 4 === 2) return [1, yn(`Fisher–Neyman faktorizáció?`), 1, 'igen'];
        return [1, yn(`Teljes statisztika: minden torzítatlan 0 csak 0?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [2, yn(`Fisher-információ I(θ)=E[(ℓ')²]?`), 1, 'igen'];
        if (i % 4 === 1) return [2, yn(`Cramér–Rao: Var ≥ 1/(n I)?`), 1, 'igen'];
        if (i % 4 === 2) return [2, yn(`Rao–Blackwell: elégségesre kondicionálás javít?`), 1, 'igen'];
        return [2, yn(`UMVUE: minimális var torzítatlan?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [3, yn(`Bayes: posterior ∝ likelihood × prior?`), 1, 'igen'];
        if (i % 4 === 1) return [3, yn(`Minimax: legrosszabb kockázat min?`), 1, 'igen'];
        if (i % 4 === 2) return [3, yn(`Neyman–Pearson: likelihood-hányados próba?`), 1, 'igen'];
        return [3, yn(`LRT aszimptotikusan χ²?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [4, yn(`KDE: nemparaméteres sűrűség?`), 1, 'igen'];
        if (i % 4 === 1) return [4, `I=0 degenerált információ. 0=?`, 0, '0'];
        if (i % 4 === 2) return [4, yn(`Lehmann–Scheffé: teljes+elégséges ⇒ UMVUE?`), 1, 'igen'];
        return [4, yn(`MLE aszimptotikusan hatékony (regularitás)?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 4 === 0) return [5, yn(`Prior+adat = posterior döntés?`), 1, 'igen'];
        if (i % 4 === 1) return [5, `λ=1 LRT H0 határán. 1=?`, 1, '1'];
        if (i % 4 === 2) return [5, yn(`Sávszélesség h a KDE-ben?`), 1, 'igen'];
        return [5, yn(`Próba aszimptotikus szint n→∞?`), 1, 'igen'];
    });
    push20(out, (i) => {
        if (i % 5 === 0) return [6, yn(`Exponenciális család: természetes elégséges?`), 1, 'igen'];
        if (i % 5 === 1) return [6, `n I, n=1, I=4, alsó Var≥?`, 0.25, '1/4'];
        if (i % 5 === 2) return [6, yn(`MAP vs posterior közép Bayes?`), 1, 'igen'];
        if (i % 5 === 3) return [6, yn(`NP lemma Neyman-féle α-szintű legerősebb?`), 1, 'igen'];
        return [6, yn(`Elmélet a próbák/becslések határait adja?`), 1, 'igen'];
    });
    return out;
}
