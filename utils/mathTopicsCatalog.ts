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
            { id: 'differencialegyenletek', title: 'Differenciálegyenletek', icon: 'dy/dx' },
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
    erettsegiLevel: ErettsegiExamLevel = 'emelt'
): CatalogTopic[] {
    if (level === 'elementary') return elementaryTopics;
    if (level === 'highschool') return highschoolTopics;
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
