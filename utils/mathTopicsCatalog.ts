/** Közös témakörök — ugyanaz, mint a játék kezdőképernyőjén + érettségi. */

export type EducationLevelId = 'elementary' | 'highschool' | 'university' | 'erettsegi';
export type ErettsegiExamLevel = 'kozep' | 'emelt';

export type CatalogTopic = {
    id: string;
    title: string;
    icon: string;
    color: string;
};

export type UniversitySubject = CatalogTopic & {
    topics: Array<{ id: string; title: string; icon: string }>;
};

export const EDUCATION_LEVELS: Array<{
    id: EducationLevelId;
    name: string;
    desc: string;
    emoji: string;
}> = [
    { id: 'elementary', name: 'Általános iskola', desc: '1-8. osztály', emoji: '🏫' },
    { id: 'highschool', name: 'Középiskola', desc: '9-12. osztály', emoji: '🎒' },
    { id: 'university', name: 'Egyetem', desc: 'Felsőbb matematika', emoji: '🎓' },
    { id: 'erettsegi', name: 'Érettségire felkészülés', desc: 'Közép és emelt szint', emoji: '📝' },
];

export const elementaryTopics: CatalogTopic[] = [
    { id: 'szamok-20ig', title: 'Számok 20-ig', icon: '2️⃣', color: '#39ff14' },
    { id: 'szamok-100ig', title: 'Számok 100-ig', icon: '💯', color: '#39ff14' },
    { id: 'osszeadas-kivonas', title: 'Összeadás-kivonás', icon: '➕', color: '#39ff14' },
    { id: 'szorzotabla', title: 'Szorzótábla', icon: '✖️', color: '#39ff14' },
    { id: 'tortek', title: 'Törtek', icon: '½', color: '#39ff14' },
    { id: 'geometria-alapok', title: 'Geometria alapok', icon: '📐', color: '#39ff14' },
];

export const highschoolTopics: CatalogTopic[] = [
    { id: 'abszolutertek', title: 'Abszolútérték', icon: '|x|', color: '#39ff14' },
    { id: 'egyenletek', title: 'Egyenletek', icon: 'Σ', color: '#39ff14' },
    { id: 'sikgeometria', title: 'Síkgeometria', icon: '📐', color: '#39ff14' },
    { id: 'fuggvenyek', title: 'Függvények', icon: '📈', color: '#39ff14' },
    { id: 'trigonometria', title: 'Trigonometria', icon: '📐', color: '#39ff14' },
    { id: 'statisztika', title: 'Statisztika', icon: '📊', color: '#39ff14' },
    { id: 'koordinatageometria', title: 'Koordinátageometria', icon: '📍', color: '#39ff14' },
    { id: 'valoszinusegszamitas', title: 'Valószínűségszámítás', icon: '🎲', color: '#39ff14' },
    { id: 'logaritmus', title: 'Logaritmus', icon: 'log', color: '#39ff14' },
    { id: 'kombinatorika', title: 'Kombinatorika', icon: '🔢', color: '#39ff14' },
    { id: 'sorozatok', title: 'Sorozatok', icon: '∞', color: '#39ff14' },
];

/** OH-MAT09TA/I (NAT 2020) — 9. osztály I. kötet fejezetei. */
export const highschoolGrade09Topics: CatalogTopic[] = [
    { id: 'hs09-kombi', title: '1. Kombinatorika, halmazok', icon: '🔢', color: '#3aa0ff' },
    { id: 'hs09-szamok', title: '2. A számok világa', icon: '💯', color: '#f5c400' },
    { id: 'hs09-eq', title: '3. Egyenletek és azonosságok', icon: 'Σ', color: '#39ff14' },
];

/** OH-MAT11TA (NAT 2020) — 11. osztály tankönyv fejezetei. */
export const highschoolGrade11Topics: CatalogTopic[] = [
    { id: 'hs11-trig', title: '1. Trigonometria', icon: '📐', color: '#39ff14' },
    { id: 'hs11-kombi', title: '2. Kombinatorika, gráfok', icon: '🕸️', color: '#3aa0ff' },
    { id: 'hs11-explog', title: '3. Hatvány, gyök, logaritmus', icon: 'log', color: '#f5c400' },
    { id: 'hs11-nt', title: '4. Számelmélet', icon: '🔢', color: '#c084fc' },
    { id: 'hs11-stat', title: '5. Statisztika, valószínűség', icon: '📊', color: '#ff6b1a' },
    { id: 'hs11-coord', title: '6. Koordinátageometria', icon: '📍', color: '#39ff14' },
    { id: 'hs11-finance', title: '7. Mindennapi pénzügyeink', icon: '💰', color: '#58cc02' },
];

export function getHighschoolTopicsForGrade(grade: number): CatalogTopic[] {
    if (grade === 9) return highschoolGrade09Topics;
    if (grade === 11) return highschoolGrade11Topics;
    return highschoolTopics;
}

export const universitySubjects: UniversitySubject[] = [
    {
        id: 'analizis1',
        title: 'Analízis I.',
        icon: '∫',
        color: '#39ff14',
        topics: [
            { id: 'a1-valos-szamok', title: 'Valós számok és rendezési tulajdonságok', icon: 'ℝ' },
            { id: 'a1-komplex', title: 'Komplex számok', icon: 'ℂ' },
            { id: 'a1-szamsorozatok', title: 'Számsorozatok', icon: 'aₙ' },
            { id: 'a1-seq-hatarertek', title: 'Sorozatok határértéke', icon: 'lim' },
            { id: 'a1-cauchy', title: 'Cauchy-sorozatok', icon: 'ε' },
            { id: 'a1-numerikus-sorok', title: 'Numerikus sorok', icon: 'Σ' },
            { id: 'a1-konv-kriteriumok', title: 'Konvergenciakritériumok', icon: 'ρ' },
            { id: 'a1-absz-felteteles', title: 'Abszolút és feltételes konvergencia', icon: '|Σ|' },
            { id: 'a1-fv-hatarertek', title: 'Függvények határértéke', icon: '→' },
            { id: 'a1-nevezetes-lim', title: 'Nevezetes határértékek', icon: '★' },
            { id: 'a1-folytonossag', title: 'Folytonosság', icon: 'C⁰' },
            { id: 'a1-folytonos-tetelek', title: 'Folytonos függvények fontos tételei', icon: 'IVT' },
        ],
    },
    {
        id: 'analizis2',
        title: 'Analízis II.',
        icon: '∂',
        color: '#39ff14',
        topics: [
            { id: 'a2-diffhat', title: 'Differenciálhatóság', icon: "f'" },
            { id: 'a2-szabalyok', title: 'Deriválási szabályok', icon: 'd' },
            { id: 'a2-elemi-der', title: 'Elemi függvények deriváltjai', icon: '∂' },
            { id: 'a2-magasabb', title: 'Magasabb rendű deriváltak', icon: "fⁿ" },
            { id: 'a2-mvt', title: 'Középértéktételek', icon: 'MVT' },
            { id: 'a2-monoton', title: 'Monotonitás', icon: '↗' },
            { id: 'a2-szelso', title: 'Szélsőérték', icon: 'min' },
            { id: 'a2-konvex', title: 'Konvexitás és konkávitás', icon: '∪' },
            { id: 'a2-lhospital', title: 'L’Hospital-szabály', icon: 'H' },
            { id: 'a2-aszimptota', title: 'Aszimptoták', icon: '∕' },
            { id: 'a2-vizsgalat', title: 'Teljes függvényvizsgálat', icon: '📈' },
            { id: 'a2-taylor', title: 'Taylor-polinom', icon: 'Tₙ' },
        ],
    },
    {
        id: 'analizis3',
        title: 'Analízis III.',
        icon: '∭',
        color: '#39ff14',
        topics: [
            { id: 'vektoranalizis', title: 'Vektoranalízis', icon: '→' },
        ],
    },
    {
        id: 'linearis1',
        title: 'Lineáris algebra I.',
        icon: '[]',
        color: '#39ff14',
        topics: [
            { id: 'la1-vektorok', title: 'Vektorok és alapműveletek', icon: 'v' },
            { id: 'la1-mx-muveletek', title: 'Mátrixműveletek', icon: 'AB' },
            { id: 'la1-gauss', title: 'Lineáris egyenletrendszerek és Gauss-elimináció', icon: 'Ax' },
            { id: 'la1-det', title: 'Determinánsok', icon: 'det' },
            { id: 'la1-inverz', title: 'Inverz mátrix és Cramer-szabály', icon: 'A⁻¹' },
            { id: 'la1-rang', title: 'Rang és összetett egyenletrendszerek', icon: 'rk' },
        ],
    },
    {
        id: 'linearis2',
        title: 'Lineáris algebra II.',
        icon: 'V',
        color: '#39ff14',
        topics: [
            { id: 'la2-vektorter', title: 'Vektortér és altér', icon: 'V' },
            { id: 'la2-span', title: 'Lineáris kombináció és generált tér', icon: '⟨⟩' },
            { id: 'la2-fuggetlenseg', title: 'Lineáris függetlenség', icon: '∥' },
            { id: 'la2-bazis', title: 'Bázis és koordináták', icon: 'eᵢ' },
            { id: 'la2-dimenzio', title: 'Dimenzió és báziscsere', icon: 'dim' },
            { id: 'la2-lekepezes', title: 'Lineáris leképezések, magtér és képtér', icon: 'T' },
        ],
    },
    {
        id: 'linearis3',
        title: 'Lineáris algebra III.',
        icon: 'λ',
        color: '#39ff14',
        topics: [
            { id: 'la3-sajatvektor', title: 'Sajátérték és sajátvektor', icon: 'λv' },
            { id: 'la3-karpolinom', title: 'Karakterisztikus polinom és sajátalterek', icon: 'p' },
            { id: 'la3-multiplicitas', title: 'Multiplicitások', icon: 'm' },
            { id: 'la3-diagonal', title: 'Diagonalizálás és Cayley–Hamilton-tétel', icon: 'PDP' },
            { id: 'la3-gramschmidt', title: 'Belső szorzat és Gram–Schmidt', icon: '⟨,⟩' },
            { id: 'la3-spektral', title: 'Spektráltétel és ortogonális diagonalizálás', icon: 'QDQ' },
        ],
    },
    {
        id: 'linearis4',
        title: 'Lineáris algebra IV.',
        icon: 'Σσ',
        color: '#39ff14',
        topics: [
            { id: 'la4-kvadratikus', title: 'Bilineáris és kvadratikus formák', icon: 'xᵀAx' },
            { id: 'la4-lu-qr', title: 'LU- és QR-felbontás', icon: 'LU' },
            { id: 'la4-householder', title: 'Householder- és Givens-transzformáció', icon: 'H' },
            { id: 'la4-svd', title: 'SVD és pszeudoinverz', icon: 'Σ' },
            { id: 'la4-jordan', title: 'Jordan- és Schur-felbontás', icon: 'J' },
            { id: 'la4-normak', title: 'Mátrixnormák, kondíciószám és alkalmazások', icon: 'κ' },
        ],
    },
    {
        id: 'de1',
        title: 'Differenciálegyenletek I.',
        icon: "y'",
        color: '#39ff14',
        topics: [
            { id: 'de1-alapok', title: 'Alapfogalmak és iránymezők', icon: '↗' },
            { id: 'de1-szeparal', title: 'Szeparálható differenciálegyenletek', icon: '∫' },
            { id: 'de1-linear', title: 'Elsőrendű lineáris differenciálegyenletek', icon: 'μ' },
            { id: 'de1-bernoulli', title: 'Homogén, Bernoulli és egzakt egyenletek', icon: 'B' },
            { id: 'de1-ivp', title: 'Kezdetiérték-problémák és létezési kérdések', icon: 'IVP' },
            { id: 'de1-modellek', title: 'Matematikai modellezés', icon: '📐' },
        ],
    },
    {
        id: 'de2',
        title: 'Differenciálegyenletek II.',
        icon: "y''",
        color: '#39ff14',
        topics: [
            { id: 'de2-homogen', title: 'Másodrendű homogén egyenletek', icon: 'h' },
            { id: 'de2-karakt', title: 'Karakterisztikus egyenlet és gyöktípusok', icon: 'r' },
            { id: 'de2-inhomogen', title: 'Inhomogén differenciálegyenletek', icon: 'yp' },
            { id: 'de2-wronski', title: 'Állandók variálása és Wronski-determináns', icon: 'W' },
            { id: 'de2-rezges', title: 'Harmonikus és csillapított rezgések', icon: 'ω' },
            { id: 'de2-gerjeszt', title: 'Gerjesztett rezgések, rezonancia és magasabb rendű ODE-k', icon: 'F' },
        ],
    },
    {
        id: 'de3',
        title: 'Differenciálegyenletek III.',
        icon: 'ẋ',
        color: '#39ff14',
        topics: [
            { id: 'de3-rendszerek', title: 'Differenciálegyenlet-rendszerek', icon: 'sys' },
            { id: 'de3-linear-rendszer', title: 'Lineáris rendszerek', icon: 'Ax' },
            { id: 'de3-expat', title: 'Sajátértékek és mátrixexponenciális', icon: 'eᴬᵗ' },
            { id: 'de3-fazis', title: 'Autonóm rendszerek és fázisportrék', icon: 'φ' },
            { id: 'de3-stabil', title: 'Stabilitás és linearizálás', icon: 'stab' },
            { id: 'de3-dinamika', title: 'Nemlineáris dinamikai rendszerek és modellek', icon: 'λ' },
        ],
    },
    {
        id: 'de4',
        title: 'Differenciálegyenletek IV.',
        icon: 'ℒ',
        color: '#39ff14',
        topics: [
            { id: 'de4-laplace', title: 'Laplace-transzformáció', icon: 'L' },
            { id: 'de4-inverz', title: 'Inverz Laplace és kezdetiérték-problémák', icon: 'L⁻¹' },
            { id: 'de4-konvolucio', title: 'Lépcsőfüggvény, impulzus és konvolúció', icon: '*' },
            { id: 'de4-euler', title: 'Euler- és Heun-módszer', icon: 'h' },
            { id: 'de4-rk', title: 'Runge–Kutta-módszerek', icon: 'RK' },
            { id: 'de4-merev', title: 'Numerikus stabilitás és merev rendszerek', icon: 'stiff' },
        ],
    },
    {
        id: 'pde1',
        title: 'Parciális differenciálegyenletek I.',
        icon: '∂u',
        color: '#39ff14',
        topics: [
            { id: 'pde1-osztaly', title: 'PDE-alapfogalmak és osztályozás', icon: 'Δ' },
            { id: 'pde1-karakter', title: 'Elsőrendű PDE-k és karakterisztikák', icon: 'χ' },
            { id: 'pde1-ho', title: 'Hőegyenlet', icon: 'T' },
            { id: 'pde1-hullam', title: 'Hullámegyenlet', icon: 'c' },
            { id: 'pde1-laplace', title: 'Laplace- és Poisson-egyenlet', icon: '∇²' },
            { id: 'pde1-perem', title: 'Fourier-módszer és peremérték-problémák', icon: 'Σ' },
        ],
    },
    {
        id: 'pde2',
        title: 'Parciális differenciálegyenletek II.',
        icon: 'H¹',
        color: '#39ff14',
        topics: [
            { id: 'pde2-gyenge', title: 'Gyenge derivált és gyenge megoldás', icon: '⟨⟩' },
            { id: 'pde2-szoboljev', title: 'Lp- és Szoboljev-terek', icon: 'W' },
            { id: 'pde2-variacio', title: 'Variációs módszerek', icon: 'δ' },
            { id: 'pde2-elliptikus', title: 'Elliptikus problémák', icon: 'E' },
            { id: 'pde2-parabolikus', title: 'Parabolikus és hiperbolikus problémák', icon: 'P' },
            { id: 'pde2-green', title: 'Spektrális módszerek, Green-függvények és modern PDE-k', icon: 'G' },
        ],
    },
    {
        id: 'dm1',
        title: 'Diszkrét matematika I.',
        icon: 'n!',
        color: '#39ff14',
        topics: [
            { id: 'dm1-osszeadas', title: 'Összeadási és szorzási elv', icon: '+' },
            { id: 'dm1-permvar', title: 'Permutáció, variáció és kombináció', icon: 'P' },
            { id: 'dm1-binom', title: 'Binomiális együtthatók és azonosságok', icon: 'C' },
            { id: 'dm1-skatulya', title: 'Skatulyaelv és kettős leszámlálás', icon: '⊞' },
            { id: 'dm1-szita', title: 'Szitaformula és multihalmazok', icon: '∪' },
            { id: 'dm1-ossz-biz', title: 'Összetett kombinatorikai bizonyítások', icon: '∴' },
        ],
    },
    {
        id: 'dm2',
        title: 'Diszkrét matematika II.',
        icon: 'aₙ',
        color: '#39ff14',
        topics: [
            { id: 'dm2-rekurzio', title: 'Rekurzív sorozatok', icon: '↻' },
            { id: 'dm2-linear-rek', title: 'Lineáris rekurziók', icon: 'r' },
            { id: 'dm2-fibonacci', title: 'Fibonacci-számok', icon: 'F' },
            { id: 'dm2-catalan', title: 'Catalan-, Stirling- és Bell-számok', icon: 'Cₙ' },
            { id: 'dm2-gf', title: 'Generátorfüggvények', icon: 'A(x)' },
            { id: 'dm2-ossz-rek', title: 'Összetett rekurziós és leszámlálási problémák', icon: 'Σ' },
        ],
    },
    {
        id: 'ge1',
        title: 'Gráfelmélet I.',
        icon: 'G',
        color: '#39ff14',
        topics: [
            { id: 'ge1-alapok', title: 'Gráfok alapfogalmai és fokszám', icon: 'd' },
            { id: 'ge1-utak', title: 'Utak, körök és összefüggőség', icon: '↔' },
            { id: 'ge1-fak', title: 'Fák és erdők', icon: 'T' },
            { id: 'ge1-cayley', title: 'Feszítőfák, Cayley-tétel és Prüfer-kód', icon: 'nⁿ⁻²' },
            { id: 'ge1-euler', title: 'Euler- és Hamilton-problémák', icon: 'E' },
            { id: 'ge1-mst', title: 'Minimális feszítőfa és gráfalgoritmusok', icon: 'MST' },
        ],
    },
    {
        id: 'ge2',
        title: 'Gráfelmélet II.',
        icon: 'χ',
        color: '#39ff14',
        topics: [
            { id: 'ge2-szinezes', title: 'Gráfszínezés', icon: 'χ' },
            { id: 'ge2-sik', title: 'Síkgráfok', icon: '△' },
            { id: 'ge2-paros', title: 'Páros gráfok', icon: 'A|B' },
            { id: 'ge2-parositas', title: 'Párosítások és Hall–Kőnig-elmélet', icon: 'ν' },
            { id: 'ge2-folyam', title: 'Hálózati folyamok', icon: 'st' },
            { id: 'ge2-menger', title: 'Menger-, Tutte- és kombinatorikus algoritmusok', icon: 'κ' },
        ],
    },
    {
        id: 'dm3',
        title: 'Diszkrét matematika III.',
        icon: 'ex',
        color: '#39ff14',
        topics: [
            { id: 'dm3-extrem', title: 'Extremális gráfelmélet', icon: 'ex' },
            { id: 'dm3-turan', title: 'Mantel- és Turán-elmélet', icon: 'Tᵣ' },
            { id: 'dm3-ramsey', title: 'Ramsey-elmélet', icon: 'R' },
            { id: 'dm3-hiper', title: 'Hipergráfok és extremális halmazrendszerek', icon: 'H' },
            { id: 'dm3-prob', title: 'Valószínűségi és lineáris algebrai módszerek', icon: 'E' },
            { id: 'dm3-polinom', title: 'Polinomos módszer és haladó kombinatorikai problémák', icon: 'f' },
        ],
    },
    {
        id: 'st1',
        title: 'Statisztika I.',
        icon: 'x̄',
        color: '#39ff14',
        topics: [
            { id: 'st1-alapok', title: 'Statisztikai alapok', icon: 'n' },
            { id: 'st1-leiras', title: 'Adatok leírása', icon: '▣' },
            { id: 'st1-kozep', title: 'Középértékek és szóródás', icon: 'σ' },
            { id: 'st1-eloszlas', title: 'Valószínűségi háttér', icon: 'P' },
            { id: 'st1-becsles', title: 'Becslések', icon: 'θ̂' },
            { id: 'st1-konfidencia', title: 'Konfidenciaintervallumok', icon: 'CI' },
        ],
    },
    {
        id: 'st2',
        title: 'Statisztika II.',
        icon: 'H₀',
        color: '#39ff14',
        topics: [
            { id: 'st2-hipotezis', title: 'Hipotézisvizsgálat alapjai', icon: 'α' },
            { id: 'st2-param-proba', title: 'Paraméteres próbák', icon: 't' },
            { id: 'st2-chi2', title: 'Khi-négyzet próbák', icon: 'χ²' },
            { id: 'st2-nemparam', title: 'Nemparaméteres próbák', icon: 'R' },
            { id: 'st2-kapcsolat', title: 'Kapcsolatok vizsgálata', icon: 'r' },
            { id: 'st2-linreg', title: 'Lineáris regresszió', icon: 'β' },
        ],
    },
    {
        id: 'st3',
        title: 'Statisztika III.',
        icon: 'PCA',
        color: '#39ff14',
        topics: [
            { id: 'st3-tobbreg', title: 'Többszörös regresszió', icon: 'Xβ' },
            { id: 'st3-anova', title: 'Varianciaanalízis (ANOVA)', icon: 'F' },
            { id: 'st3-idosor', title: 'Idősorelemzés', icon: 'AR' },
            { id: 'st3-pca', title: 'Többváltozós statisztika (PCA, faktor)', icon: 'λ' },
            { id: 'st3-klaszter', title: 'Klaszteranalízis és skálázás', icon: 'k' },
            { id: 'st3-halado', title: 'Haladó matematikai statisztika', icon: 'I' },
        ],
    },
];

const G = '#39ff14';
const E = '#ffd700';

export const erettsegiKozepTopics: CatalogTopic[] = [
    { id: 'abszolutertek-gyok', title: 'Abszolútérték, gyök', icon: '|√', color: G },
    { id: 'egyenletek-egyenlotlensegek', title: 'Egyenletek, egyenlőtlenségek, egyenletrendszerek', icon: '=', color: G },
    { id: 'egyszerusitesek', title: 'Egyszerűsítések, átalakítások', icon: '↔️', color: G },
    { id: 'ertelmezesi-tartomany', title: 'Értelmezési tartomány, értékkészlet', icon: '📊', color: G },
    { id: 'exponencialis-logaritmus', title: 'Exponenciális és logaritmusos feladatok', icon: 'log', color: G },
    { id: 'fuggvenyek-analizis', title: 'Függvények, analízis', icon: '📈', color: G },
    { id: 'halmazok', title: 'Halmazok', icon: '{}', color: G },
    { id: 'kombinatorika', title: 'Kombinatorika', icon: '🔢', color: G },
    { id: 'koordinatageometria', title: 'Koordinátageometria', icon: '📍', color: G },
    { id: 'logika-grafok', title: 'Logika, gráfok', icon: '🕸️', color: G },
    { id: 'sikgeometria', title: 'Síkgeometria', icon: '📐', color: G },
    { id: 'sorozatok', title: 'Sorozatok', icon: '∞', color: G },
    { id: 'statisztika', title: 'Statisztika', icon: '📊', color: G },
    { id: 'szamelmelet', title: 'Számelmélet', icon: '🔢', color: G },
    { id: 'szoveges-feladatok', title: 'Szöveges feladatok', icon: '📝', color: G },
    { id: 'tergeometria', title: 'Térgeometria', icon: '📦', color: G },
    { id: 'trigonometria', title: 'Trigonometria', icon: '📊', color: G },
    { id: 'valoszinusegszamitas', title: 'Valószínűségszámítás', icon: '🎲', color: G },
];

export const erettsegiEmeltTopics: CatalogTopic[] = [
    { id: 'abszolutertek-gyok-emelt', title: 'Abszolútérték, gyök', icon: '|√', color: E },
    { id: 'bizonyitasok', title: 'Bizonyítások', icon: '✓', color: E },
    { id: 'egyenletek-egyenlotlensegek-emelt', title: 'Egyenletek, egyenlőtlenségek, egyenletrendszerek', icon: '=', color: E },
    { id: 'egyszerusitesek-emelt', title: 'Egyszerűsítések, átalakítások', icon: '↔️', color: E },
    { id: 'ertelmezesi-tartomany-emelt', title: 'Értelmezési tartomány, értékkészlet', icon: '📊', color: E },
    { id: 'exponencialis-logaritmus-emelt', title: 'Exponenciális és logaritmusos feladatok', icon: 'log', color: E },
    { id: 'fuggvenyek-analizis-emelt', title: 'Függvények, analízis', icon: '📈', color: E },
    { id: 'halmazok-emelt', title: 'Halmazok', icon: '{}', color: E },
    { id: 'kombinatorika-emelt', title: 'Kombinatorika', icon: '🔢', color: E },
    { id: 'parameter', title: 'Paraméteres egyenletek', icon: 'α', color: E },
    { id: 'koordinatageometria-emelt', title: 'Koordinátageometria', icon: '📍', color: E },
    { id: 'logika-grafok-emelt', title: 'Logika, gráfok', icon: '🕸️', color: E },
    { id: 'sikgeometria-emelt', title: 'Síkgeometria', icon: '📐', color: E },
    { id: 'sorozatok-emelt', title: 'Sorozatok', icon: '∞', color: E },
    { id: 'statisztika-emelt', title: 'Statisztika', icon: '📊', color: E },
    { id: 'szamelmelet-emelt', title: 'Számelmélet', icon: '🔢', color: E },
    { id: 'szoveges-feladatok-emelt', title: 'Szöveges feladatok', icon: '📝', color: E },
    { id: 'tergeometria-emelt', title: 'Térgeometria', icon: '📦', color: E },
    { id: 'trigonometria-emelt', title: 'Trigonometria', icon: '📊', color: E },
    { id: 'valoszinusegszamitas-emelt', title: 'Valószínűségszámítás', icon: '🎲', color: E },
];

/** Dashboard / progress listákhoz: flat témakörök iskolaszintenként. */
export function getTopicsForEducationLevel(
    level: EducationLevelId,
    erettsegiLevel: ErettsegiExamLevel = 'emelt',
    highschoolGrade?: number
): CatalogTopic[] {
    if (level === 'elementary') return elementaryTopics;
    if (level === 'highschool') return getHighschoolTopicsForGrade(highschoolGrade ?? 10);
    if (level === 'erettsegi') {
        return erettsegiLevel === 'kozep' ? erettsegiKozepTopics : erettsegiEmeltTopics;
    }
    return universitySubjects.map(({ id, title, icon, color }) => ({ id, title, icon, color }));
}

export function getUniversitySubjectById(subjectId: string): UniversitySubject | undefined {
    return universitySubjects.find((s) => s.id === subjectId);
}

export function findUniversityTopic(
    topicId: string
): { subject: UniversitySubject; topic: { id: string; title: string; icon: string } } | null {
    const id = topicId.toLowerCase();
    for (const subject of universitySubjects) {
        const topic = subject.topics.find((t) => t.id === id);
        if (topic) return { subject, topic };
    }
    return null;
}
