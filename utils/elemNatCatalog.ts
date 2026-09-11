/** NAT 2020 alsó (1–4.) és felső tagozat (5–8.) — témakörök és leckejelek. */

export type ElemNatCatalogTopic = {
    id: string;
    title: string;
    icon: string;
    color: string;
};

export type ElemNatGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ElemNatSlug =
    | 'halmaz'
    | 'rendszer'
    | 'allitas'
    | 'problema'
    | 'szoveg'
    | 'valosag'
    | 'szamlalas'
    | 'rendezes'
    | 'tulajdonsag'
    | 'helyiertek'
    | 'meres'
    | 'muvelet'
    | 'muvtul'
    | 'szobeli'
    | 'fejben'
    | 'alkotas'
    | 'alakzat'
    | 'tukor'
    | 'tajekozas'
    | 'szabaly'
    | 'adat'
    | 'veletlen'
    | 'iras-pm'
    | 'iras-szor'
    | 'tortresz'
    | 'negativ'
    | 'halmazok'
    | 'logika'
    | 'nt'
    | 'natmuv'
    | 'egesz'
    | 'racionalis'
    | 'tortmuv'
    | 'tizedmuv'
    | 'arany'
    | 'szoveges'
    | 'fuggveny'
    | 'sorozat'
    | 'mertek'
    | 'sikidom'
    | 'szerkeszt'
    | 'tergeo'
    | 'stat'
    | 'valszam'
    | 'szamhalmaz'
    | 'grafok'
    | 'hatvany'
    | 'szazalek'
    | 'egyenlet'
    | 'szovegmod'
    | 'grafikon'
    | 'negyzet'
    | 'kozeppont'
    | 'hasab'
    | 'kozep'
    | 'esely';

type TopicMeta = {
    slug: ElemNatSlug;
    title: string;
    icon: string;
    color: string;
    fromGrade: ElemNatGrade;
    toGrade: ElemNatGrade;
    lessons: Record<1 | 2 | 3 | 4 | 5 | 6, string>;
};

const C = {
    green: '#39ff14',
    blue: '#3aa0ff',
    gold: '#f5c400',
    purple: '#c084fc',
    orange: '#ff6b1a',
    lime: '#58cc02',
};

export const ELEM_NAT_TOPICS: TopicMeta[] = [
    {
        slug: 'halmaz',
        title: 'Válogatás, halmazok',
        icon: '🔵',
        color: C.blue,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Mi változott? · tulajdonság',
            2: 'Varázszsák · egy szempont',
            3: 'Kapuőr · logikai nem',
            4: 'Hulahopp · két szempont',
            5: 'Halmazábra',
            6: 'Igaz vagy hamis?',
        },
    },
    {
        slug: 'rendszer',
        title: 'Rendszerezés',
        icon: '🧩',
        color: C.purple,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Elvitte a szarka',
            2: 'Barkochba',
            3: 'Királyos · egy különbség',
            4: 'Táblázat, fadiagram',
            5: 'Fagylalt, zászló, öltözék',
            6: 'Hiányzó elem a rendszerben',
        },
    },
    {
        slug: 'allitas',
        title: 'Állítások',
        icon: '💬',
        color: C.gold,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Jancsi bohóc · igaz-hamis',
            2: 'Telefonos játék',
            3: 'Mindegyik, van köztük, egyik sem',
            4: 'Rontó játék',
            5: 'Hiányos állítás',
            6: 'Példa és ellenpélda',
        },
    },
    {
        slug: 'problema',
        title: 'Problémamegoldás',
        icon: '🧠',
        color: C.orange,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Boltos játék',
            2: 'Labirintus, útvonal',
            3: 'Visszafelé gondolkodás',
            4: 'Öntögetés, helycsere',
            5: 'Logikai rejtvény',
            6: 'Előre tervezés',
        },
    },
    {
        slug: 'szoveg',
        title: 'Szöveges feladatok',
        icon: '📝',
        color: C.green,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Eljátszás, kirakás',
            2: 'Ismert és keresett adat',
            3: 'Egy lépéses feladat',
            4: 'Két lépéses feladat',
            5: 'Lényeges és felesleges adat',
            6: 'Feladatalkotás, ellenőrzés',
        },
    },
    {
        slug: 'valosag',
        title: 'Szám és valóság',
        icon: '🍎',
        color: C.lime,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Több, kevesebb, ugyanannyi',
            2: 'Párosítás',
            3: 'Darabszám ránézésre',
            4: 'Számok bontása',
            5: 'Mennyiség mérőszámként',
            6: 'Összehasonlítás jelekkel',
        },
    },
    {
        slug: 'szamlalas',
        title: 'Számlálás, becslés',
        icon: '🔢',
        color: C.blue,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Számfuttatás egyesével',
            2: 'Kettesével, ötösével, tízesével',
            3: 'Oda-vissza számlálás',
            4: 'Közelítő számlálás',
            5: 'Becslés ellenőrzése',
            6: 'Újrabecslés',
        },
    },
    {
        slug: 'rendezes',
        title: 'Számok rendezése',
        icon: '📶',
        color: C.gold,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Élő számegyenes',
            2: 'Sorszámok',
            3: 'Szomszédok',
            4: 'Számtábla',
            5: 'Kukás játék · sorba rakás',
            6: 'Kerekítés, hely a számegyenesen',
        },
    },
    {
        slug: 'tulajdonsag',
        title: 'Számok tulajdonságai',
        icon: '🏷️',
        color: C.purple,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Páros és páratlan',
            2: 'Számjegyek, alak',
            3: 'Ország, város · tulajdonság',
            4: 'Többszörös, viszony',
            5: 'Római számok: I, V, X',
            6: 'Kitalálós',
        },
    },
    {
        slug: 'helyiertek',
        title: 'Helyi érték',
        icon: '🧱',
        color: C.orange,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Csoportosítás, beváltás',
            2: 'Tízesek és egyesek',
            3: 'Leltár',
            4: 'Bontott alak',
            5: 'Helyi, alaki, valódi érték',
            6: 'Olvasás, írás, összehasonlítás',
        },
    },
    {
        slug: 'meres',
        title: 'Mérés',
        icon: '📏',
        color: C.green,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Összemérés',
            2: 'Alkalmi egység',
            3: 'cm, dm, m · dl, l · kg',
            4: 'Idő és óra',
            5: 'Pénz, felváltás',
            6: 'Kerület és terület',
        },
    },
    {
        slug: 'muvelet',
        title: 'Alapműveletek értelmezése',
        icon: '➕',
        color: C.lime,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Hozzáadás, elvétel',
            2: 'Egyesítés, különbség',
            3: 'Szorzás mint ismételt összeadás',
            4: 'Bennfoglalás és részekre osztás',
            5: 'Maradékos osztás',
            6: 'Művelet a történetből',
        },
    },
    {
        slug: 'muvtul',
        title: 'Műveleti tulajdonságok',
        icon: '🔄',
        color: C.blue,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Felcserélhetőség',
            2: 'Babos játék · megfordítás',
            3: 'Hiányos művelet',
            4: 'Szorzat széttagolása',
            5: 'Változás az eredményben',
            6: 'Összefüggő műveletek',
        },
    },
    {
        slug: 'szobeli',
        title: 'Szóbeli számolás',
        icon: '🗣️',
        color: C.gold,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Bontás és pótlás',
            2: 'Tízesátlépés',
            3: 'Boltos · kerek tízes',
            4: 'Analógia nagyobb körben',
            5: 'Szorzótábla-összefüggés',
            6: 'Észszerű becslés',
        },
    },
    {
        slug: 'fejben',
        title: 'Fejben számolás',
        icon: '⚡',
        color: C.orange,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: '20-as kör',
            2: 'Kerek tízesek',
            3: 'Kétjegyű + egyjegyű',
            4: 'Kétjegyű + kétjegyű',
            5: 'Kisegyszeregy',
            6: 'Analóg nagy számok',
        },
    },
    {
        slug: 'alkotas',
        title: 'Alkotás térben és síkon',
        icon: '🏗️',
        color: C.purple,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Építés feltétel szerint',
            2: 'Sorminta, síkminta',
            3: 'Alaprajz, nézet',
            4: 'Szimmetrikus alkotás',
            5: 'Tangram, gyufarejtvény',
            6: 'Összes lehetőség',
        },
    },
    {
        slug: 'alakzat',
        title: 'Alakzatok',
        icon: '📐',
        color: C.green,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Test vagy síkidom?',
            2: 'Háromszög, négyszög, kör',
            3: 'Téglalap és négyzet',
            4: 'Téglatest és kocka',
            5: 'Oldal, csúcs, lap, él',
            6: 'Derékszög, jellemzés',
        },
    },
    {
        slug: 'tukor',
        title: 'Transzformációk',
        icon: '🪞',
        color: C.blue,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Tükörjáték',
            2: 'Tükörtengely',
            3: 'Eltolás',
            4: 'Sor- és síkminta',
            5: 'Nagyítás, kicsinyítés',
            6: 'Tükör vagy eltolás?',
        },
    },
    {
        slug: 'tajekozas',
        title: 'Tájékozódás',
        icon: '🧭',
        color: C.gold,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Jobbra, balra, fel, le',
            2: 'Előtte, mögötte, mellette',
            3: 'Vonalvezetős játék',
            4: 'Négyzetháló',
            5: 'Térkép, keresőháló',
            6: 'Útvonal oda-vissza',
        },
    },
    {
        slug: 'szabaly',
        title: 'Összefüggések, szabályok',
        icon: '🔗',
        color: C.lime,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Kakukktojás, mi változott?',
            2: 'Periodikus sorozat',
            3: 'Évszak, hónap, nap',
            4: 'Gépes játék',
            5: 'Táblázat, nyíl',
            6: 'Szabály megfordítása',
        },
    },
    {
        slug: 'adat',
        title: 'Adatok',
        icon: '📊',
        color: C.orange,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Adatgyűjtés',
            2: 'Tornasor · oszlopok',
            3: 'Diagram leolvasása',
            4: 'Legkisebb, legnagyobb',
            5: 'Táblázat',
            6: 'Összesség jellemzése',
        },
    },
    {
        slug: 'veletlen',
        title: 'Valószínűség',
        icon: '🎲',
        color: C.purple,
        fromGrade: 1,
        toGrade: 4,
        lessons: {
            1: 'Biztos, lehetetlen, lehetséges',
            2: 'Kukás, húzás',
            3: 'Melyik valószínűbb?',
            4: 'Kísérlet számlálása',
            5: 'Tipp és megfigyelés',
            6: 'Ellenpélda',
        },
    },
    {
        slug: 'iras-pm',
        title: 'Írásbeli összeadás, kivonás',
        icon: '🧾',
        color: C.green,
        fromGrade: 3,
        toGrade: 4,
        lessons: {
            1: 'Továbbvitel az egyesben',
            2: 'Továbbvitel a tízesben',
            3: 'Hiányos összeadás',
            4: 'Pótlásos kivonás',
            5: 'Becslés kerekítéssel',
            6: 'Ellenőrzés ellentétes művelettel',
        },
    },
    {
        slug: 'iras-szor',
        title: 'Írásbeli szorzás, osztás',
        icon: '✖️',
        color: C.blue,
        fromGrade: 3,
        toGrade: 4,
        lessons: {
            1: 'Egyjegyű szorzó',
            2: 'Kerek tízes szorzó',
            3: 'Kétjegyű szorzó',
            4: 'Osztás egyjegyűvel',
            5: 'Visszaszorzás, maradék',
            6: 'Becslés és ellenőrzés',
        },
    },
    {
        slug: 'tortresz',
        title: 'Törtrészek',
        icon: '🍕',
        color: C.gold,
        fromGrade: 3,
        toGrade: 4,
        lessons: {
            1: 'Egész egyenlő részekre',
            2: 'Egységtört',
            3: 'Egységtört többszöröse',
            4: 'Pizzatányér · összehasonlítás',
            5: 'Egyenlő törtrészek',
            6: 'Kirakás, modell',
        },
    },
    {
        slug: 'negativ',
        title: 'Negatív számok',
        icon: '🌡️',
        color: C.orange,
        fromGrade: 3,
        toGrade: 4,
        lessons: {
            1: 'Előtt és után, alatt és fölött',
            2: 'Hőmérő',
            3: 'Tengerszint',
            4: 'Készpénz és adósság',
            5: 'Összehasonlítás',
            6: 'Időjárás-jelentős',
        },
    },
    {
        slug: 'halmazok',
        title: 'Halmazok',
        icon: '🔵',
        color: C.blue,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Válogatás egy-két szempont szerint',
            2: 'Halmazábra',
            3: 'Részhalmaz',
            4: 'Metszet',
            5: 'Unió',
            6: 'Számegyenes, számhalmaz',
        },
    },
    {
        slug: 'logika',
        title: 'Logika, kombinatorika',
        icon: '🧠',
        color: C.purple,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Füllentős · igaz-hamis',
            2: 'Nyitott mondat',
            3: 'És, vagy, legalább',
            4: 'Sorba rendezés',
            5: 'Ágrajz, táblázat',
            6: 'Einstein-fejtörő, Rontó',
        },
    },
    {
        slug: 'nt',
        title: 'Természetes számok, számelmélet',
        icon: '🔢',
        color: C.gold,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Helyi érték, nagy számok',
            2: 'Római számok: L, C, D, M',
            3: 'Osztók, többszörösök',
            4: 'Oszthatóság 2, 5, 10, 100',
            5: 'Oszthatóság 3, 9, 4, 6',
            6: 'Bumm · közös többszörös',
        },
    },
    {
        slug: 'natmuv',
        title: 'Műveletek természetes számokkal',
        icon: '➕',
        color: C.green,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Írásbeli összeadás, kivonás',
            2: 'Írásbeli szorzás',
            3: 'Írásbeli osztás',
            4: 'Műveleti sorrend, zárójel',
            5: 'Számalkotó · becslés',
            6: 'Ellenőrzés, kerekítés',
        },
    },
    {
        slug: 'egesz',
        title: 'Egész számok',
        icon: '🌡️',
        color: C.orange,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Adósság, hőmérő, tengerszint',
            2: 'Ellentett, abszolút érték',
            3: 'Összeadás, kivonás',
            4: 'Szorzás, osztás',
            5: 'Élő számegyenes, Kukás',
            6: 'Zárójel, ellenőrzés',
        },
    },
    {
        slug: 'racionalis',
        title: 'Törtek, tizedes törtek',
        icon: '🍕',
        color: C.lime,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Törtrész, számláló, nevező',
            2: 'Egyszerűsítés, bővítés',
            3: 'Összehasonlítás',
            4: 'Tizedes tört, helyi érték',
            5: 'Közönséges ↔ tizedes',
            6: 'Számegyenes',
        },
    },
    {
        slug: 'tortmuv',
        title: 'Műveletek közönséges törtekkel',
        icon: '➗',
        color: C.blue,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Azonos nevezőjű összeadás',
            2: 'Kivonás',
            3: 'Közös nevező',
            4: 'Szorzás',
            5: 'Reciprok, osztás',
            6: '21-ezés · ellenőrzés',
        },
    },
    {
        slug: 'tizedmuv',
        title: 'Műveletek tizedes törtekkel',
        icon: '💶',
        color: C.gold,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Összeadás',
            2: 'Kivonás',
            3: 'Szorzás',
            4: 'Osztás',
            5: 'Műveleti sorrend',
            6: 'Kerekítés, becslés',
        },
    },
    {
        slug: 'arany',
        title: 'Arányosság, mértékegység',
        icon: '⚖️',
        color: C.purple,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Egyenes arányosság',
            2: 'Hosszúság átváltása',
            3: 'Tömeg, űrtartalom, idő',
            4: 'Törtrész kiszámítása',
            5: 'Századrész és százalék',
            6: 'Mindennapi százalék',
        },
    },
    {
        slug: 'szoveges',
        title: 'Szöveges feladatok',
        icon: '📝',
        color: C.green,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Gondoltam egy számot',
            2: 'Szakaszos ábra',
            3: 'Visszafelé gondolkodás',
            4: 'Pénzügyi helyzet',
            5: 'Becslés',
            6: 'Ellenőrzés',
        },
    },
    {
        slug: 'fuggveny',
        title: 'Függvény előkészítése',
        icon: '📈',
        color: C.orange,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Megfeleltetés, szabály',
            2: 'Koordináta-rendszer',
            3: 'Pont ábrázolása',
            4: 'Telefonos játék',
            5: 'Egyenes arányosság grafikonja',
            6: 'Nem hiszem · grafikon',
        },
    },
    {
        slug: 'sorozat',
        title: 'Sorozatok',
        icon: '🔁',
        color: C.lime,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Szabálykövetés',
            2: 'Számsorozat folytatása',
            3: 'Képzési szabály',
            4: 'Bumm játék',
            5: 'Több lehetséges szabály',
            6: 'Saját szabály',
        },
    },
    {
        slug: 'mertek',
        title: 'Mérés és mértékegységek',
        icon: '📏',
        color: C.blue,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Szögfajták, fok',
            2: 'Téglalap kerülete',
            3: 'Téglalap, négyzet területe',
            4: 'Háromszög kerülete',
            5: 'Téglatest felszíne',
            6: 'Téglatest, kocka térfogata',
        },
    },
    {
        slug: 'sikidom',
        title: 'Síkbeli alakzatok',
        icon: '📐',
        color: C.gold,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Egyenes, félegyenes, szakasz',
            2: 'Háromszög szögei',
            3: 'Háromszög-egyenlőtlenség',
            4: 'Háromszögek csoportosítása',
            5: 'Téglalap, négyzet',
            6: 'Tangram, egybevágóság',
        },
    },
    {
        slug: 'szerkeszt',
        title: 'Transzformációk, szerkesztések',
        icon: '🪞',
        color: C.purple,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Egybevágóság',
            2: 'Tengelyes tükrözés',
            3: 'Tükrös alakzat',
            4: 'Merőleges, párhuzamos',
            5: 'Szakaszfelező, szögfelező',
            6: 'Szerkesztési terv',
        },
    },
    {
        slug: 'tergeo',
        title: 'Térgeometria',
        icon: '📦',
        color: C.orange,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Kocka, téglatest',
            2: 'Lap, él, csúcs',
            3: 'Lapátló, testátló',
            4: 'Háló, alaprajz',
            5: 'Nézetek',
            6: 'Gömb',
        },
    },
    {
        slug: 'stat',
        title: 'Leíró statisztika',
        icon: '📊',
        color: C.green,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Adatgyűjtés',
            2: 'Táblázat',
            3: 'Oszlopdiagram',
            4: 'Átlag',
            5: 'Leolvasás',
            6: 'Következtetés',
        },
    },
    {
        slug: 'valszam',
        title: 'Valószínűség-számítás',
        icon: '🎲',
        color: C.lime,
        fromGrade: 5,
        toGrade: 6,
        lessons: {
            1: 'Biztos, lehetetlen, lehetséges',
            2: 'Kocka, érme',
            3: 'Eseménykártya',
            4: 'Gyakoriság',
            5: 'Tipp és kísérlet',
            6: 'Nem hiszem',
        },
    },
    {
        slug: 'szamhalmaz',
        title: 'Halmazok, számhalmazok',
        icon: 'ℚ',
        color: C.blue,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Több szempont, Venn',
            2: 'Komplementer',
            3: 'Metszet és unió',
            4: 'ℕ, ℤ, ℚ',
            5: 'Tizedes tört típusok',
            6: 'Logikai szita',
        },
    },
    {
        slug: 'grafok',
        title: 'Logika, kombinatorika, gráfok',
        icon: '🕸️',
        color: C.purple,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Minden, van olyan',
            2: 'Sorba rendezés',
            3: 'Kiválasztás',
            4: 'Ágrajz',
            5: 'Gráf: csúcs, él',
            6: 'Kézfogás, körmérkőzés',
        },
    },
    {
        slug: 'hatvany',
        title: 'Számelmélet, hatvány, gyök',
        icon: '√',
        color: C.gold,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Prím és összetett',
            2: 'Prímtényezős felbontás',
            3: 'LNKO, LKKT',
            4: 'Hatvány',
            5: 'Négyzetszám, négyzetgyök',
            6: 'Eratoszthenész, Bumm',
        },
    },
    {
        slug: 'szazalek',
        title: 'Arányosság, százalékszámítás',
        icon: '%',
        color: C.green,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Egyenes arányosság',
            2: 'Fordított arányosság',
            3: 'Áremelés, leárazás',
            4: 'Kamat, bank',
            5: 'Keverés',
            6: 'Terület, térfogat átváltása',
        },
    },
    {
        slug: 'egyenlet',
        title: 'Szöveges feladatok előkészítése',
        icon: '𝑥',
        color: C.orange,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Betűs kifejezés',
            2: 'Helyettesítési érték',
            3: 'Szorzás, kiemelés',
            4: 'Lebontogatás',
            5: 'Mérlegelv',
            6: 'Gondoltam egy számot',
        },
    },
    {
        slug: 'szovegmod',
        title: 'Szöveges feladatok',
        icon: '📝',
        color: C.lime,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Modell választása',
            2: 'Egyenletes mozgás',
            3: 'Keverés, arány',
            4: 'Pénzügyi tudatosság',
            5: 'Becslés',
            6: 'Ellenőrzés a szövegben',
        },
    },
    {
        slug: 'grafikon',
        title: 'Függvény, grafikon',
        icon: '📈',
        color: C.blue,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Megfeleltetés',
            2: 'Értéktáblázat',
            3: 'Növekedés, szélsőérték',
            4: 'Egyenes arányosság grafikonja',
            5: 'Fordított arányosság',
            6: 'Grafikon jellemzése',
        },
    },
    {
        slug: 'negyzet',
        title: 'Síkbeli alakzatok',
        icon: '⬜',
        color: C.gold,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Négyszögek, átló',
            2: 'Speciális négyszögek',
            3: 'Kerület, terület',
            4: 'Pitagorasz-tétel',
            5: 'Kör részei',
            6: 'Halmazábra, Rontó',
        },
    },
    {
        slug: 'kozeppont',
        title: 'Transzformációk, szerkesztések',
        icon: '🔄',
        color: C.purple,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Középpontos tükrözés',
            2: 'Középpontos szimmetria',
            3: 'Kicsinyítés, nagyítás',
            4: 'Arány 1:2, 2:1',
            5: 'Több feltétel',
            6: 'Szerkesztési terv',
        },
    },
    {
        slug: 'hasab',
        title: 'Térgeometria',
        icon: '🔺',
        color: C.orange,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Hasáb',
            2: 'Gúla',
            3: 'Háló',
            4: 'Felszín',
            5: 'Térfogat',
            6: 'Gömb, Föld modell',
        },
    },
    {
        slug: 'kozep',
        title: 'Leíró statisztika',
        icon: '📊',
        color: C.green,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Diagramtípusok',
            2: 'Átlag',
            3: 'Módusz',
            4: 'Medián',
            5: 'Összehasonlítás',
            6: 'Következtetés',
        },
    },
    {
        slug: 'esely',
        title: 'Valószínűség-számítás',
        icon: '🎲',
        color: C.lime,
        fromGrade: 7,
        toGrade: 8,
        lessons: {
            1: 'Kimenetelek',
            2: 'Esély összehasonlítása',
            3: 'Gyakoriság',
            4: 'Relatív gyakoriság',
            5: 'Stratégia',
            6: 'Folyón átkelés, 21-ezés',
        },
    },
];

export function elemNatTopicId(grade: ElemNatGrade, slug: ElemNatSlug): string {
    return `el0${grade}-${slug}`;
}

export function isElemNatTopicId(topicId: string): boolean {
    return /^el0[1-8]-/.test(String(topicId || '').toLowerCase());
}

export function parseElemNatTopicId(
    topicId: string
): { grade: ElemNatGrade; slug: ElemNatSlug } | null {
    const m = String(topicId || '')
        .toLowerCase()
        .match(/^el0([1-8])-([a-z0-9-]+)$/);
    if (!m) return null;
    const grade = Number(m[1]) as ElemNatGrade;
    const slug = m[2] as ElemNatSlug;
    if (!ELEM_NAT_TOPICS.some((t) => t.slug === slug)) return null;
    return { grade, slug };
}

export function topicsForElemNatGrade(grade: ElemNatGrade): ElemNatCatalogTopic[] {
    return ELEM_NAT_TOPICS.filter((t) => grade >= t.fromGrade && grade <= t.toGrade).map((t) => ({
        id: elemNatTopicId(grade, t.slug),
        title: t.title,
        icon: t.icon,
        color: t.color,
    }));
}

export function allElemNatCatalogTopics(): ElemNatCatalogTopic[] {
    return ([1, 2, 3, 4, 5, 6, 7, 8] as ElemNatGrade[]).flatMap((g) => topicsForElemNatGrade(g));
}

export function getElemNatLessonLabel(topicId: string, lesson: number): string | null {
    const parsed = parseElemNatTopicId(topicId);
    if (!parsed) return null;
    const meta = ELEM_NAT_TOPICS.find((t) => t.slug === parsed.slug);
    if (!meta) return null;
    const key = Math.min(6, Math.max(1, Math.floor(lesson))) as 1 | 2 | 3 | 4 | 5 | 6;
    return meta.lessons[key] || null;
}

export function elemNatGradeFromTopicId(topicId: string): number | null {
    return parseElemNatTopicId(topicId)?.grade ?? null;
}
