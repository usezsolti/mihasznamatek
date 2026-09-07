/** OH-MAT12TA (NAT 2020) — 12. osztály, 6 játéklecke / fejezet. */
export const HS12_LESSON_LABELS: Record<string, Record<1 | 2 | 3 | 4 | 5 | 6, string>> = {
    'hs12-solid': {
        1: 'Térelemek, hasáb',
        2: 'Hasáb és henger',
        3: 'Gömb, hasonló testek',
        4: 'Hajlásszög, gúla',
        5: 'Forgáskúp',
        6: 'Csonka testek, gyakorlás',
    },
    'hs12-seq': {
        1: 'Számsorozatok megadása',
        2: 'Számtani sorozat, összeg',
        3: 'Mértani sorozat, összeg',
        4: 'Vegyes feladatok',
        5: 'Tőkebefektetések',
        6: 'Hitelek, gyakorlás',
    },
    'hs12-chance': {
        1: 'Adatgyűjtés, jellemzők',
        2: 'Diagramok, osztályközép',
        3: 'Eseménytér',
        4: 'Valószínűség, geometriai',
        5: 'Várható érték, mintavétel',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs12-disc': {
        1: 'Halmazok',
        2: 'Logika',
        3: 'Sorba rendezés',
        4: 'Kombináció',
        5: 'Gráfok',
        6: 'Gyakorlás',
    },
    'hs12-alg': {
        1: 'Műveletek, hatvány',
        2: 'Egyenletek',
        3: 'Egyenlőtlenségek',
        4: 'Százalék, arány',
        5: 'Hatvány, logaritmus',
        6: 'Gyakorlás',
    },
    'hs12-maps': {
        1: 'Függvény fogalma',
        2: 'Lineáris, abszolútérték',
        3: 'Másodfokú, gyök',
        4: 'Transzformáció',
        5: 'Sorozat és grafikon',
        6: 'Gyakorlás',
    },
    'hs12-plane': {
        1: 'Háromszögek, Pitagorasz',
        2: 'Egybevágóság, hasonlóság',
        3: 'Kerület, terület',
        4: 'Szögfüggvények',
        5: 'Testek ismétlés',
        6: 'Gyakorlás',
    },
    'hs12-odds': {
        1: 'Átlag, medián',
        2: 'Szóródás',
        3: 'Klasszikus valószínűség',
        4: 'Függetlenség, szorzat',
        5: 'Várható érték',
        6: 'Gyakorlás',
    },
};

export function getHs12LessonLabel(topicId: string, lesson: number): string | null {
    const map = HS12_LESSON_LABELS[topicId.toLowerCase()];
    if (!map) return null;
    const key = Math.min(6, Math.max(1, Math.floor(lesson))) as 1 | 2 | 3 | 4 | 5 | 6;
    return map[key] || null;
}
