/** OH-MAT09TA I–II. (NAT 2020) — 9. osztály, 6 játéklecke / fejezet. */
export const HS09_LESSON_LABELS: Record<string, Record<1 | 2 | 3 | 4 | 5 | 6, string>> = {
    'hs09-kombi': {
        1: 'Hányféleképpen lehet?',
        2: 'Gráfok',
        3: 'Számzárak, összeszámlálás',
        4: 'Halmazok',
        5: 'Unió, metszet, szitaformula',
        6: 'Intervallumok, gyakorlás',
    },
    'hs09-szamok': {
        1: 'Műveletek, törtek',
        2: 'Racionális és irracionális',
        3: 'Arányosság, arányos osztás',
        4: 'Százalékszámítás',
        5: 'Hatványozás, négyzetgyök',
        6: 'Normálalak, kamatos kamat',
    },
    'hs09-eq': {
        1: 'Betűk, algebrai számolás',
        2: 'Nevezetes szorzatok',
        3: 'Szorzattá alakítás',
        4: 'Egyenletek',
        5: 'Szöveges feladatok',
        6: 'Alaphalmaz, gyakorlás',
    },
    'hs09-geo': {
        1: 'A sík geometriája, szögek',
        2: 'Háromszögek, Pitagorasz',
        3: 'Távolságok, kör',
        4: 'Nevezetes vonalak és pontok',
        5: 'Thalész tétele',
        6: 'Kerület, terület, gyakorlás',
    },
    'hs09-plot': {
        1: 'Táblázatok, diagramok',
        2: 'A függvény fogalma, grafikon',
        3: 'Arányosság, meredekség',
        4: 'Lineáris és abszolútérték',
        5: 'Szélsőérték, másodfokú',
        6: 'Grafikus megoldás, gyakorlás',
    },
    'hs09-ngon': {
        1: 'Forgatás, középpontos tükrözés',
        2: 'Vektorok, eltolás',
        3: 'Tengelyes tükrözés, szerkesztés',
        4: 'Szimmetrikus négyszögek',
        5: 'Négyszögek területe',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs09-cash': {
        1: 'Árengedmény',
        2: 'Költségvetési egyenes',
        3: 'Állampapír',
        4: 'SZJA, valutaváltás',
        5: 'Vállalkozó, áfa',
        6: 'Gyakorlás',
    },
};

export function getHs09LessonLabel(topicId: string, lesson: number): string | null {
    const map = HS09_LESSON_LABELS[topicId.toLowerCase()];
    if (!map) return null;
    const key = Math.min(6, Math.max(1, Math.floor(lesson))) as 1 | 2 | 3 | 4 | 5 | 6;
    return map[key] || null;
}
