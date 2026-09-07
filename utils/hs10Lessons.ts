/** OH-MAT10TA I–II. (NAT 2020) — 10. osztály, 6 játéklecke / fejezet. */
export const HS10_LESSON_LABELS: Record<string, Record<1 | 2 | 3 | 4 | 5 | 6, string>> = {
    'hs10-logic': {
        1: 'Igaz vagy hamis',
        2: 'Állítás és tagadása',
        3: 'Kötőszavak: és, vagy',
        4: 'Igazságtáblázat',
        5: 'Állítás és megfordítása',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs10-sys': {
        1: 'Grafikus megoldás',
        2: 'Algebrai módszer',
        3: 'Egyenletrendszerek',
        4: 'Szöveges feladatok',
        5: 'Gyakorlás',
        6: 'Tudáspróba',
    },
    'hs10-pow': {
        1: 'Hatványozás',
        2: 'Egész kitevő, negatív kitevő',
        3: 'Normálalak',
        4: 'Gyökvonás azonosságai',
        5: 'Négyzetgyökös feladatok',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs10-xform': {
        1: 'Függvény, konkrét probléma',
        2: 'Parabolák',
        3: 'Eltolás fel–le, jobbra–balra',
        4: 'Nyújtás, zsugorítás',
        5: 'Összetett transzformációk',
        6: 'Másodfokú függvény grafikonja',
    },
    'hs10-quad': {
        1: 'Teljes négyzetté kiegészítés',
        2: 'Megoldóképlet',
        3: 'Diszkrimináns',
        4: 'Geometriai szöveges',
        5: 'Pénzügyi, munka szöveges',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs10-cong': {
        1: 'Egybevágóság alapesetei',
        2: 'Egybevágó háromszögek',
        3: 'Kör kerülete és területe',
        4: 'Középponti szög, körív, körcikk',
        5: 'Sokszögek és körök',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs10-data': {
        1: 'Átlag, számtani közép',
        2: 'Adatok rendezése',
        3: 'Statisztikai jellemzők',
        4: 'Osztályba sorolás',
        5: 'Relatív gyakoriság, véletlen',
        6: 'Valószínűség, gyakorlás',
    },
    'hs10-ineq': {
        1: 'Ekvivalens egyenletek',
        2: 'Gyökös egyenletek',
        3: 'Másodfokú egyenlőtlenségek',
        4: 'Gyöktényezős alak',
        5: 'Gyakorlás',
        6: 'Tudáspróba',
    },
    'hs10-sim': {
        1: 'Nagyítás, kicsinyítés',
        2: 'Középpontos hasonlóság',
        3: 'Geometriai hozzárendelések',
        4: 'Hasonlóság alkalmazása',
        5: 'Háromszögek, középvonal',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs10-cash': {
        1: 'Kamatozás',
        2: 'Folyószámla, bankbetét',
        3: 'Kereset és értéke',
        4: 'Vállalkozások',
        5: 'Biztosítások',
        6: 'Gyakorlás',
    },
};

export function getHs10LessonLabel(topicId: string, lesson: number): string | null {
    const map = HS10_LESSON_LABELS[topicId.toLowerCase()];
    if (!map) return null;
    const key = Math.min(6, Math.max(1, Math.floor(lesson))) as 1 | 2 | 3 | 4 | 5 | 6;
    return map[key] || null;
}
