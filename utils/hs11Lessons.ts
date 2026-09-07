/** OH-MAT11TA 11. osztály — 6 játéklecke cím / fejezet. */
export const HS11_LESSON_LABELS: Record<string, Record<1 | 2 | 3 | 4 | 5 | 6, string>> = {
    'hs11-trig': {
        1: 'Hegyesszög tangense',
        2: 'Szinusz és koszinusz',
        3: 'Területképlet',
        4: 'Szinusztétel',
        5: 'Koszinusztétel',
        6: 'Sokszögek, kör, gyakorlás',
    },
    'hs11-kombi': {
        1: 'Jelszavak, szorzási szabály',
        2: 'Sorba rendezés',
        3: 'Kombináció',
        4: 'Binomiális együtthatók',
        5: 'Esetszétválasztás',
        6: 'Gráfok',
    },
    'hs11-explog': {
        1: 'Hatványozás',
        2: 'Gyök, racionális kitevő',
        3: 'Exponenciális folyamatok',
        4: 'Logaritmus',
        5: 'Pénzügy, pH, infó',
        6: 'Gyakorlás, tudáspróba',
    },
    'hs11-nt': {
        1: 'Számhalmazok',
        2: 'Osztó, többszörös',
        3: 'LNKO és LKKT',
        4: 'Oszthatóság, prímek',
        5: 'Számrendszerek',
        6: 'Racionális és irracionális',
    },
    'hs11-stat': {
        1: 'Statisztikai jellemzők',
        2: 'Diagramok, dobozdiagram',
        3: 'Szórás',
        4: 'Valószínűség',
        5: 'Várható érték, húzás',
        6: 'Mintavétel',
    },
    'hs11-coord': {
        1: 'Vektorok',
        2: 'Koordináták, távolság',
        3: 'Egyenes egyenlete',
        4: 'Kör egyenlete',
        5: 'Meredekség, iránytangens',
        6: 'Metszéspont, merőleges',
    },
    'hs11-finance': {
        1: 'Áfa, százalék, ár',
        2: 'Egyszerű kamat',
        3: 'Kamatos kamat',
        4: 'Kamatfizetés gyakorisága',
        5: 'Befektetés, árfolyam',
        6: 'Hitel, biztosítás',
    },
};

export function getHs11LessonLabel(topicId: string, lesson: number): string | null {
    const map = HS11_LESSON_LABELS[topicId.toLowerCase()];
    if (!map) return null;
    const key = Math.min(6, Math.max(1, Math.floor(lesson))) as 1 | 2 | 3 | 4 | 5 | 6;
    return map[key] || null;
}
