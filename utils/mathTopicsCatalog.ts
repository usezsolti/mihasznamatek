/** Közös témakörök — ugyanaz, mint a játék kezdőképernyőjén. */

export type EducationLevelId = 'elementary' | 'highschool' | 'university';

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
            { id: 'komplex-szamok', title: 'Komplex számok', icon: 'ℂ' },
            { id: 'sorozatok', title: 'Sorozatok', icon: 'Σ' },
            { id: 'egyvaltozos-fuggvenyek', title: 'Egyváltozós függvények', icon: 'f(x)' },
            { id: 'fuggvenyvizsgalat', title: 'Függvényvizsgálat', icon: 'f(x)' },
            { id: 'differencialszamitas', title: 'Differenciálszámítás', icon: 'd/dx' },
            { id: 'kozeperteketelek', title: 'Középérték tételek', icon: 'MVT' },
            { id: 'parametereesen-adott-gorbek', title: 'Paraméteresen adott görbék', icon: 'r(t)' },
            { id: 'integralas', title: 'Integrálás', icon: '∫' },
        ],
    },
    {
        id: 'analizis2',
        title: 'Analízis II.',
        icon: '∂',
        color: '#39ff14',
        topics: [
            { id: 'matrix-muveletek', title: 'Mátrix műveletek', icon: '[]' },
            { id: 'linearis-transzformaciok', title: 'Lineáris transzformációk', icon: 'T' },
            { id: 'numerikus-sorok', title: 'Numerikus sorok', icon: 'Σ' },
            { id: 'sorok', title: 'Sorok', icon: 'Σ' },
            { id: 'fourier-sorok', title: 'Fourier-sorok', icon: 'ℱ' },
            { id: 'taylor-sorok', title: 'Taylor-sorok', icon: 'T' },
            { id: 'ketvaltozos-fuggvenyek', title: 'Kétváltozós függvények', icon: 'f(x,y)' },
            { id: 'tobbvaltozos-fuggvenyek', title: 'Többváltozós függvények', icon: 'f(x,y,z)' },
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
];

/** Dashboard / progress listákhoz: flat témakörök iskolaszintenként (egyetemen a tantárgyak). */
export function getTopicsForEducationLevel(level: EducationLevelId): CatalogTopic[] {
    if (level === 'elementary') return elementaryTopics;
    if (level === 'highschool') return highschoolTopics;
    return universitySubjects.map(({ id, title, icon, color }) => ({ id, title, icon, color }));
}
