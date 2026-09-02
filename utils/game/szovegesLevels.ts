import type { Question } from './types';

/**
 * Szöveges feladatok — 6 szint × 20 feladat (Szöveges_feladatok.pdf).
 * 1 Százalék / arány → 2 Lineáris modellek → 3 Egyenletrendszerek →
 * 4 Másodfokú / racionális → 5 Exponenciális → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getSzovegesPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Egy alkalmazott fizetésének 24%-a 150 000 Ft. Mennyi a teljes fizetése?`,
        answer: 625000,
        type: 'multiplication',
        expression: `150000 / 0,24 = 625000`,
    },
    {
        stage: 1,
        question: `Egy 8000 Ft-os terméket 15%-kal leáraznak. Mennyi az új ára?`,
        answer: 6800,
        type: 'multiplication',
        expression: `8000 · 0,85 = 6800`,
    },
    {
        stage: 1,
        question: `Egy termék ára 1200 Ft-ról 18%-kal emelkedik. Mennyi lesz az új ár?`,
        answer: 1416,
        type: 'multiplication',
        expression: `1200 · 1,18 = 1416`,
    },
    {
        stage: 1,
        question: `Egy gazdaság éves tojástermelése 2,4 millió darab. A tyúkok száma 4%-kal csökken, az egy tyúkra jutó termelés 8%-kal nő.
Mennyi lesz az új éves termelés?`,
        answer: 2488320,
        type: 'multiplication',
        expression: `2,4e6 · 0,96 · 1,08 = 2488320`,
    },
    {
        stage: 1,
        question: `Egy 17 grammos, 18 karátos ékszer tömegének hány grammja tiszta arany, ha a 24 karátos arany tiszta?

Add meg 2 tizedesjeggyel!`,
        answer: 12.75,
        type: 'multiplication',
        expression: `17 · 18/24 = 12,75`,
    },
    {
        stage: 1,
        question: `Egy kosárlabdázó 250 dobásának 72%-a sikeres. Hány sikeres dobása volt?`,
        answer: 180,
        type: 'multiplication',
        expression: `250 · 0,72 = 180`,
    },
    {
        stage: 1,
        question: `500 darab A4-es lap, egy lap területe 1/16 m², a papír 80 g/m², a csomagolás 20 g.
Mekkora a csomag tömege kilogrammban?`,
        answer: 2.52,
        type: 'multiplication',
        expression: `500 · (1/16) · 80 + 20 = 2520 g = 2,52 kg`,
    },
    {
        stage: 1,
        question: `Egy csapat 50 dobási kísérletének 44%-a sikeres. Hány sikeres dobás történt?`,
        answer: 22,
        type: 'multiplication',
        expression: `50 · 0,44 = 22`,
    },
    {
        stage: 1,
        question: `500 Ft/kg mellett a készlet 50%-a, 300 Ft/kg mellett 70%-a fogy el. Az eladott hányad lineárisan változik.
A készlet hány százaléka fogy el 400 Ft/kg mellett?`,
        answer: 60,
        type: 'multiplication',
        expression: `A 400 a 500 és 300 közepe, így 60%`,
    },
    {
        stage: 1,
        question: `Egy kereskedő 200 kg gyümölcs 60%-át 400 Ft/kg áron adja el. Mennyi bevétele származik ebből?`,
        answer: 48000,
        type: 'multiplication',
        expression: `120 · 400 = 48000`,
    },
    {
        stage: 1,
        question: `Egy autó 45 literes tankkal indul. Az első 200 km-en 10 liter/100 km az átlagfogyasztása.
Hány liter üzemanyag marad?`,
        answer: 25,
        type: 'multiplication',
        expression: `45 − 20 = 25`,
    },
    {
        stage: 1,
        question: `Az autó tankjában 25 liter üzemanyag van, az átlagfogyasztása 10 liter/100 km.
Hány kilométert tud még megtenni?`,
        answer: 250,
        type: 'multiplication',
        expression: `25 / 0,1 = 250`,
    },
    {
        stage: 1,
        question: `Egy tonna zabmagból egy mag tömege átlagosan 35 mg.
Körülbelül hány millió darab mag van egy tonnában?

Add meg 3 tizedesjeggyel!`,
        answer: 28.571,
        type: 'multiplication',
        expression: `10⁹ / 35 / 10⁶ ≈ 28,571`,
    },
    {
        stage: 1,
        question: `Egy hajó 12 km/h sebességgel halad. Mennyi idő alatt tesz meg 10 km-t?
Add meg percben!`,
        answer: 50,
        type: 'multiplication',
        expression: `10/12 óra = 50 perc`,
    },
    {
        stage: 1,
        question: `640 jegy: elővételes 2400 Ft, helyszíni 3000 Ft, bevétel 1 656 000 Ft.
Hány jegyet adtak el elővételben?`,
        answer: 440,
        type: 'multiplication',
        expression: `440 elővételes és 200 helyszíni`,
    },
    {
        stage: 1,
        question: `Egy kenyérhez 1350 g liszt kell, ennek 5/9-e búzaliszt. Kezdetben 450 g búzaliszt volt.
Hány gramm búzalisztet kell még hozzáadni?`,
        answer: 300,
        type: 'multiplication',
        expression: `(5/9)·1350 − 450 = 300`,
    },
    {
        stage: 1,
        question: `4000 tábla, egyenként 3 dm². 1 kg festék 1200 dm²-re elég.
Hány kilogramm festék szükséges?`,
        answer: 10,
        type: 'multiplication',
        expression: `12000 / 1200 = 10`,
    },
    {
        stage: 1,
        question: `1 000 000 Ft egy év alatt 5%-kal kamatozik. Mennyi lesz az összeg az év végén?`,
        answer: 1050000,
        type: 'multiplication',
        expression: `1 000 000 · 1,05 = 1 050 000`,
    },
    {
        stage: 1,
        question: `Egy 20 fős csoport átlaga 72 pont, egy 30 fős csoporté 78 pont.
Mennyi az 50 fő együttes átlaga?`,
        answer: 75.6,
        type: 'multiplication',
        expression: `(1440+2340)/50 = 75,6`,
    },
    {
        stage: 1,
        question: `Egy 60 fős csoport kördiagramján egy kategóriához 90°-os körcikk tartozik.
Hány fő van ebben a kategóriában?`,
        answer: 15,
        type: 'multiplication',
        expression: `(90/360)·60 = 15`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Két szám összege 45, különbségük 9. Határozd meg a nagyobbikat!`,
        answer: 27,
        type: 'multiplication',
        expression: `27 és 18`,
    },
    {
        stage: 2,
        question: `Egy téglalap kerülete 54 cm, hosszabb oldala 3 cm-rel hosszabb a rövidebbnél.
Határozd meg a rövidebb oldalt!`,
        answer: 12,
        type: 'multiplication',
        expression: `12 cm és 15 cm`,
    },
    {
        stage: 2,
        question: `Egy osztálykirándulás szállásköltsége 78 000 Ft, 26 tanuló között egyenlően osztják.
Mennyi jut egy tanulóra?`,
        answer: 3000,
        type: 'multiplication',
        expression: `78000 / 26 = 3000`,
    },
    {
        stage: 2,
        question: `640 jegy: elővételes 2400 Ft, helyszíni 3000 Ft, bevétel 1 656 000 Ft.
Hány helyszíni jegyet adtak el?`,
        answer: 200,
        type: 'multiplication',
        expression: `440 és 200`,
    },
    {
        stage: 2,
        question: `8 kg 20%-os sóoldathoz vizet adunk, hogy 10%-os oldatot kapjunk.
Hány kilogramm vizet kell hozzáadni?`,
        answer: 8,
        type: 'multiplication',
        expression: `1,6 / (x+8) = 0,1 → x = 8`,
    },
    {
        stage: 2,
        question: `Tíz dolgozat átlaga 70 pont. Egy 50 pontos eredmény valójában 80 pont volt.
Mennyi a javított átlag?`,
        answer: 73,
        type: 'multiplication',
        expression: `70 + 30/10 = 73`,
    },
    {
        stage: 2,
        question: `Egy számhoz 15-öt adva ugyanazt kapjuk, mint a szám négyszereséből 6-ot levonva.
Mi a szám?`,
        answer: 7,
        type: 'multiplication',
        expression: `x+15 = 4x−6 → x = 7`,
    },
    {
        stage: 2,
        question: `Egy gép egy munkát 6 óra alatt végez el. A munka mekkora részével végez 2 óra alatt?

Add meg 3 tizedesjeggyel!`,
        answer: 0.333,
        type: 'multiplication',
        expression: `2/6 = 1/3 ≈ 0,333`,
    },
    {
        stage: 2,
        question: `Két kerékpáros egymással szemben indul 120 km távolságból, 18 km/h és 22 km/h.
Hány óra múlva találkoznak?`,
        answer: 3,
        type: 'multiplication',
        expression: `120 / 40 = 3`,
    },
    {
        stage: 2,
        question: `Egy autó egy út első felét 60 km/h, második felét 90 km/h sebességgel teszi meg.
Mennyi az egész útra számított átlagsebessége?`,
        answer: 72,
        type: 'multiplication',
        expression: `2 / (1/60 + 1/90) = 72`,
    },
    {
        stage: 2,
        question: `Egy autó átlagfogyasztása 9 liter/100 km. Mennyi üzemanyagot fogyaszt 350 km-en?`,
        answer: 31.5,
        type: 'multiplication',
        expression: `3,5 · 9 = 31,5`,
    },
    {
        stage: 2,
        question: `Egy autó 1 gallonnal 25,4 mérföldet tesz meg. 1 mérföld = 1,61 km, 1 gallon = 3,79 liter.
Mennyi a fogyasztás liter/100 km-ben?

Add meg 3 tizedesjeggyel!`,
        answer: 9.268,
        type: 'multiplication',
        expression: `100 · 3,79 / (25,4 · 1,61) ≈ 9,268`,
    },
    {
        stage: 2,
        question: `Egy 10 000 Ft-os termék árát előbb 20%-kal emelik, majd az új árból 10%-ot engednek.
Mennyi lesz a végső ár?`,
        answer: 10800,
        type: 'multiplication',
        expression: `10000 · 1,2 · 0,9 = 10800`,
    },
    {
        stage: 2,
        question: `Egy terméket 15%-os kedvezménnyel 6800 Ft-ért adnak. Mennyi volt az eredeti ára?`,
        answer: 8000,
        type: 'multiplication',
        expression: `6800 / 0,85 = 8000`,
    },
    {
        stage: 2,
        question: `Egy osztály tanulóinak 40%-a fiú. A fiúk száma 18. Hány tanuló jár az osztályba?`,
        answer: 45,
        type: 'multiplication',
        expression: `45 tanuló, ebből 27 lány`,
    },
    {
        stage: 2,
        question: `p : q = 2 : 3, r : p = 4 : 5, p + q + r = 165.
Határozd meg p-t!`,
        answer: 50,
        type: 'multiplication',
        expression: `p = 50, q = 75, r = 40`,
    },
    {
        stage: 2,
        question: `Egy 20 grammos, 18 karátos ékszer aranytartalmával azonos 14 karátos ékszert készítünk.
Mekkora lesz az új ékszer tömege?

Add meg 3 tizedesjeggyel!`,
        answer: 25.714,
        type: 'multiplication',
        expression: `20 · 18/14 = 180/7 ≈ 25,714`,
    },
    {
        stage: 2,
        question: `Havi fizetés 700 000 Ft, árfolyam 200 Ft/dollár, a termék 35 dollár/kg.
Hány kilogramm termék vásárolható a teljes fizetésből?`,
        answer: 100,
        type: 'multiplication',
        expression: `700000 / 200 / 35 = 100`,
    },
    {
        stage: 2,
        question: `Egy 12 kg-os keverék tömegének 25%-a só. Hány kilogramm só van a keverékben?`,
        answer: 3,
        type: 'multiplication',
        expression: `12 · 0,25 = 3`,
    },
    {
        stage: 2,
        question: `1000 darab A4-es lap tömege mennyi kilogrammban, ha egy lap 1/16 m² és a papír 80 g/m²?`,
        answer: 5,
        type: 'multiplication',
        expression: `1000 · (1/16) · 80 = 5000 g = 5 kg`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `Négy kék és három zöld sorsjegy 5900 Ft, három kék és két zöld 4300 Ft.
Mennyi egy kék sorsjegy ára?`,
        answer: 1100,
        type: 'multiplication',
        expression: `Kék 1100 Ft, zöld 500 Ft`,
    },
    {
        stage: 3,
        question: `Három mogyorókrémes és két túrós palacsinta 1230 Ft, két mogyorókrémes és öt túrós 1590 Ft.
Mennyi egy mogyorókrémes palacsinta ára?`,
        answer: 270,
        type: 'multiplication',
        expression: `270 Ft és 210 Ft`,
    },
    {
        stage: 3,
        question: `2m + 3t + f = 1410, m + t + 4f = 1440, 3m + t + 2f = 1500.
Határozd meg f-et!`,
        answer: 240,
        type: 'multiplication',
        expression: `m = 270, t = 210, f = 240`,
    },
    {
        stage: 3,
        question: `25 részvény: 7000 Ft-osak és 5000 Ft-osak, összérték 145 000 Ft.
Hány darab 7000 Ft-os van?`,
        answer: 10,
        type: 'multiplication',
        expression: `10 db 7000 Ft-os és 15 db 5000 Ft-os`,
    },
    {
        stage: 3,
        question: `20 kg 40%-os sóoldatot 30%-os és 50%-os oldatból keverünk.
Hány kilogramm kell a 30%-osból?`,
        answer: 10,
        type: 'multiplication',
        expression: `10 kg és 10 kg`,
    },
    {
        stage: 3,
        question: `30 kg 50%-os oldatot 20%-os és 70%-os oldatból keverünk.
Hány kilogramm kell a 20%-osból?`,
        answer: 12,
        type: 'multiplication',
        expression: `12 kg 20%-os és 18 kg 70%-os`,
    },
    {
        stage: 3,
        question: `Apa és fia életkorának összege 56 év. Négy évvel ezelőtt az apa háromszor olyan idős volt, mint a fia.
Hány éves az apa?`,
        answer: 44,
        type: 'multiplication',
        expression: `Apa 44, fiú 12`,
    },
    {
        stage: 3,
        question: `Egy kétjegyű szám számjegyeinek összege 11. A számjegyek cseréjével 27-tel kisebb számot kapunk.
Mi az eredeti szám?`,
        answer: 74,
        type: 'multiplication',
        expression: `74`,
    },
    {
        stage: 3,
        question: `25 érme, csak 100 és 200 Ft-osak, összérték 3500 Ft.
Hány darab 100 Ft-os van?`,
        answer: 15,
        type: 'multiplication',
        expression: `15 db 100 Ft-os, 10 db 200 Ft-os`,
    },
    {
        stage: 3,
        question: `80 jegy: felnőtt 3500 Ft, diák 2200 Ft, bevétel 228 000 Ft.
Hány felnőttjegyet adtak el?`,
        answer: 40,
        type: 'multiplication',
        expression: `40 felnőtt- és 40 diákjegy`,
    },
    {
        stage: 3,
        question: `Egy hajó 30 km-t lefelé 2 óra, felfelé 3 óra alatt tesz meg.
Határozd meg a hajó állóvízi sebességét km/h-ban!`,
        answer: 12.5,
        type: 'multiplication',
        expression: `12,5 km/h és 2,5 km/h`,
    },
    {
        stage: 3,
        question: `35 állat, 94 láb: csirkék és nyulak.
Hány csirke van?`,
        answer: 23,
        type: 'multiplication',
        expression: `23 csirke és 12 nyúl`,
    },
    {
        stage: 3,
        question: `40 kg 1200 Ft/kg kávét hány kg 800 Ft/kg kávéval kell keverni, hogy az átlagár 1000 Ft/kg legyen?`,
        answer: 40,
        type: 'multiplication',
        expression: `40 kg`,
    },
    {
        stage: 3,
        question: `1 000 000 Ft két befektetés: 5% és 8%, összesen 68 000 Ft kamat.
Mennyi került az 5%-os befektetésbe?`,
        answer: 400000,
        type: 'multiplication',
        expression: `400 000 Ft és 600 000 Ft`,
    },
    {
        stage: 3,
        question: `30 darab 50 és 100 Ft-os érme, összesen 2200 Ft.
Hány darab 50 Ft-os van?`,
        answer: 16,
        type: 'multiplication',
        expression: `16 db 50 Ft-os és 14 db 100 Ft-os`,
    },
    {
        stage: 3,
        question: `120 km: első fél v km/h, második fél 60 km/h, átlag 48 km/h.
Határozd meg v-t!`,
        answer: 40,
        type: 'multiplication',
        expression: `v = 40`,
    },
    {
        stage: 3,
        question: `Két csap együtt 3 óra alatt tölti a medencét. Az első egyedül 5 óra alatt.
Mennyi idő alatt töltené a második egyedül?`,
        answer: 7.5,
        type: 'multiplication',
        expression: `1/3 − 1/5 = 2/15 → 7,5 óra`,
    },
    {
        stage: 3,
        question: `Az egyik gép 4 óra, a másik 6 óra alatt végezne egyedül.
Mennyi idő alatt készülnek el együtt?

Add meg órában, 1 tizedesjeggyel!`,
        answer: 2.4,
        type: 'multiplication',
        expression: `12/5 = 2,4 óra`,
    },
    {
        stage: 3,
        question: `150 jegy: felnőtt 2400 Ft, gyerek 1600 Ft, bevétel 300 000 Ft.
Hány felnőttjegyet adtak el?`,
        answer: 75,
        type: 'multiplication',
        expression: `75 felnőtt- és 75 gyerekjegy`,
    },
    {
        stage: 3,
        question: `40 liter 40%-os oldatot 25%-os és 55%-os oldatból keverünk.
Hány liter kell a 25%-osból?`,
        answer: 20,
        type: 'multiplication',
        expression: `20 l és 20 l`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Egy téglalap területe 180 cm², hosszabb oldala 3 cm-rel nagyobb a rövidebbnél.
Határozd meg a rövidebb oldalt!`,
        answer: 12,
        type: 'multiplication',
        expression: `12 cm és 15 cm`,
    },
    {
        stage: 4,
        question: `Két egymást követő pozitív egész szám szorzata 306.
Add meg a kisebbiket!`,
        answer: 17,
        type: 'multiplication',
        expression: `17 és 18`,
    },
    {
        stage: 4,
        question: `Két pozitív szám összege 26, szorzata 165.
Add meg a kisebbiket!`,
        answer: 11,
        type: 'multiplication',
        expression: `11 és 15`,
    },
    {
        stage: 4,
        question: `Egy autó 240 km-t tesz meg. Ha 20 km/h-val növelné a sebességét, 1 órával rövidebb lenne.
Mennyi az eredeti sebesség?`,
        answer: 60,
        type: 'multiplication',
        expression: `240/v − 240/(v+20) = 1 → v = 60`,
    },
    {
        stage: 4,
        question: `Két munkás együtt 2 óra alatt végez. Az egyik 3 órával több idő alatt dolgozna, mint a másik.
Mennyi idő alatt végezne a gyorsabb egyedül?`,
        answer: 3,
        type: 'multiplication',
        expression: `3 óra és 6 óra`,
    },
    {
        stage: 4,
        question: `Szállásköltség 72 000 Ft. Ha 4 tanuló nem menne, fejenként 600 Ft-tal többet fizetnének.
Hány tanuló készül eredetileg?`,
        answer: 24,
        type: 'multiplication',
        expression: `72000/n + 600 = 72000/(n−4) → n = 24`,
    },
    {
        stage: 4,
        question: `Egy kétjegyű szám számjegyeinek összege 9, szorzatuk 18.
Add meg a lehetséges számok halmazát!`,
        answer: 2,
        expectedSet: ['36', '63'],
        type: 'multiplication',
        expression: `36 vagy 63`,
    },
    {
        stage: 4,
        question: `Egy anya 24 évvel idősebb a gyermekénél. Életkoruk szorzata 280.
Hány éves a gyermek?`,
        answer: 10,
        type: 'multiplication',
        expression: `10 és 34 éves`,
    },
    {
        stage: 4,
        question: `Derékszögű háromszög: befogók szorzata 60, átfogó 13.
Add meg a rövidebb befogót!`,
        answer: 5,
        type: 'multiplication',
        expression: `5 cm és 12 cm`,
    },
    {
        stage: 4,
        question: `h(t) = −5t² + 20t + 25 méterben. Hány másodperc múlva ér földet a labda?`,
        answer: 5,
        type: 'multiplication',
        expression: `−5t² + 20t + 25 = 0 → t = 5`,
    },
    {
        stage: 4,
        question: `Jegyár x száz forint, 100 − x darab jegy, bevétel 2400 százforint.
Add meg a lehetséges x értékek halmazát!`,
        answer: 2,
        expectedSet: ['40', '60'],
        type: 'multiplication',
        expression: `x = 40 vagy 60`,
    },
    {
        stage: 4,
        question: `Egy pozitív egész szám négyzete 18-cal nagyobb a szám hétszeresénél. Mi a szám?`,
        answer: 9,
        type: 'multiplication',
        expression: `n² − 7n − 18 = 0 → n = 9`,
    },
    {
        stage: 4,
        question: `Derékszögű háromszög befogói között 7 cm a különbség, területe 60 cm².
Add meg a rövidebb befogót!`,
        answer: 8,
        type: 'multiplication',
        expression: `8 cm és 15 cm`,
    },
    {
        stage: 4,
        question: `x sor, soronként x + 5 fa, összesen 300 fa.
Hány sor van?`,
        answer: 15,
        type: 'multiplication',
        expression: `15 sor, soronként 20 fa`,
    },
    {
        stage: 4,
        question: `Két testvér életkorának összege 38 év. Négy év múlva a szorzatuk 504.
Add meg a fiatalabb korát!`,
        answer: 14,
        type: 'multiplication',
        expression: `14 és 24 éves`,
    },
    {
        stage: 4,
        question: `Ár p száz forint, kereslet 200 − 2p, bevétel 4800 százforint.
Add meg a lehetséges p értékek halmazát!`,
        answer: 2,
        expectedSet: ['40', '60'],
        type: 'multiplication',
        expression: `p = 40 vagy 60`,
    },
    {
        stage: 4,
        question: `Téglalap területe 192 m², hosszabb oldala 4 m-rel nagyobb a rövidebbnél.
Határozd meg a rövidebb oldalt!`,
        answer: 12,
        type: 'multiplication',
        expression: `12 m és 16 m`,
    },
    {
        stage: 4,
        question: `Két egymást követő pozitív páros szám szorzata 224.
Add meg a kisebbiket!`,
        answer: 14,
        type: 'multiplication',
        expression: `14 és 16`,
    },
    {
        stage: 4,
        question: `120 km oda adott sebességgel, vissza 10 km/h-val nagyobbal, összesen 7 óra.
Mekkora az első szakasz sebessége?`,
        answer: 30,
        type: 'multiplication',
        expression: `v = 30`,
    },
    {
        stage: 4,
        question: `n sorban soronként n + 2 tanuló, összesen 168.
Határozd meg n-et!`,
        answer: 12,
        type: 'multiplication',
        expression: `n(n+2) = 168 → n = 12`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `1 000 000 Ft évi 5%-os kamatos kamatra. Mennyi lesz 8 év múlva?
Egész forintra kerekítve!`,
        answer: 1477455,
        type: 'multiplication',
        expression: `1 000 000 · 1,05⁸ ≈ 1 477 455`,
    },
    {
        stage: 5,
        question: `Egy akkumulátor minden ciklus után a kapacitás 99,94%-át őrzi meg.
A kezdeti kapacitás hány százaléka marad 350 ciklus után?

Add meg 2 tizedesjeggyel!`,
        answer: 81.05,
        type: 'multiplication',
        expression: `0,9994³⁵⁰ · 100 ≈ 81,05`,
    },
    {
        stage: 5,
        question: `Az előző akkumulátornál hány teljes töltési ciklus után csökken a kapacitás először 50% alá?`,
        answer: 1155,
        type: 'multiplication',
        expression: `0,9994ⁿ < 0,5 → n = 1155`,
    },
    {
        stage: 5,
        question: `Bolti árbevétel évente 2%-kal csökken. Internetes kezdetben a bolti 70%-a, évente 4%-kal nő.
Körülbelül hány év múlva lesz a két bevétel egyenlő?`,
        answer: 6,
        type: 'multiplication',
        expression: `≈ 6 év`,
    },
    {
        stage: 5,
        question: `Baktériumtenyészet: 500 egyed, naponta 8%-kal nő. Hány egyed lesz 5 nap múlva?

Add meg 3 tizedesjeggyel!`,
        answer: 734.664,
        type: 'multiplication',
        expression: `500 · 1,08⁵ ≈ 734,664`,
    },
    {
        stage: 5,
        question: `A 2. órában 7 fertőzött sejt van, ezután óránként megduplázódik.
Hányadik órában haladja meg először a 10 milliót?`,
        answer: 23,
        type: 'multiplication',
        expression: `7 · 2²¹ > 10⁷ a 23. órában`,
    },
    {
        stage: 5,
        question: `Egy 2 000 000 Ft értékű gép értéke évente 15%-kal csökken. Mennyi lesz 4 év múlva?
Egész forintra kerekítve!`,
        answer: 1044013,
        type: 'multiplication',
        expression: `2 000 000 · 0,85⁴ ≈ 1 044 013`,
    },
    {
        stage: 5,
        question: `Egy labdát 1 m-re pattintunk. Minden felpattanás az előző 84%-a.
Mekkora a tizedik felpattanás magassága méterben?

Add meg 3 tizedesjeggyel!`,
        answer: 0.175,
        type: 'multiplication',
        expression: `0,84¹⁰ ≈ 0,175`,
    },
    {
        stage: 5,
        question: `Egy gyógyszer óránként az előző 88%-ára csökken. Kezdetben 80 mg.
Hány teljes óra múlva lesz először 20 mg-nál kevesebb?`,
        answer: 11,
        type: 'multiplication',
        expression: `80 · 0,88ⁿ < 20 → n = 11`,
    },
    {
        stage: 5,
        question: `Lakosság 1200 fő, évente 3,5%-kal nő. Hányadik év végén haladja meg először az 1500 főt?`,
        answer: 7,
        type: 'multiplication',
        expression: `1200 · 1,035⁷ > 1500 a 7. év végén`,
    },
    {
        stage: 5,
        question: `Árat először p%-kal, majd p+5%-kal csökkentik. A végső ár az eredeti 80%-a.
Határozd meg a reális p-t 2 tizedesjeggyel!`,
        answer: 8.02,
        type: 'multiplication',
        expression: `p ≈ 8,02`,
    },
    {
        stage: 5,
        question: `500 000 Ft-os kiadás évente 3%-os inflációval nő. Mekkora lesz 10 év múlva?
Egész forintra kerekítve!`,
        answer: 671958,
        type: 'multiplication',
        expression: `500 000 · 1,03¹⁰ ≈ 671 958`,
    },
    {
        stage: 5,
        question: `100 000 Ft évi 6%-os kamatos kamattal. Mennyi lesz 5 év múlva?
Egész forintra kerekítve!`,
        answer: 133823,
        type: 'multiplication',
        expression: `100 000 · 1,06⁵ ≈ 133 823`,
    },
    {
        stage: 5,
        question: `Egy anyag tömege naponta 2%-kal csökken. Hány teljes nap múlva lesz először a kezdeti 60%-ánál kisebb?`,
        answer: 26,
        type: 'multiplication',
        expression: `0,98ⁿ < 0,6 → n = 26`,
    },
    {
        stage: 5,
        question: `200 sejt, minden 5 órában megháromszorozódik. Hány óra múlva haladja meg először az 1 000 000-t?`,
        answer: 40,
        type: 'multiplication',
        expression: `3⁸ > 5000, 8 · 5 = 40`,
    },
    {
        stage: 5,
        question: `100 °C-os test 20 °C-os helyiségben. 10 percenként a különbség 80%-ára csökken.
Hány perc múlva lesz a test először 30 °C alatt?`,
        answer: 100,
        type: 'multiplication',
        expression: `80 · 0,8¹⁰ < 10 → 100 perc`,
    },
    {
        stage: 5,
        question: `A: 500 000 Ft, havonta +1%. B: 450 000 Ft, havonta +1,3%.
Hányadik hónap végén lesz először több a B-ben?`,
        answer: 36,
        type: 'multiplication',
        expression: `A 36. hónap végén`,
    },
    {
        stage: 5,
        question: `8 000 000 Ft-os autó értéke évente 12%-kal csökken.
Hányadik év végén kerül először 4 000 000 Ft alá?`,
        answer: 6,
        type: 'multiplication',
        expression: `0,88ⁿ < 0,5 → n = 6`,
    },
    {
        stage: 5,
        question: `500 egyed, óránként 1,6-szorosára nő. Hány teljes óra múlva haladja meg először a 100 000-t?`,
        answer: 12,
        type: 'multiplication',
        expression: `500 · 1,6¹² > 100000`,
    },
    {
        stage: 5,
        question: `100 mg gyógyszer, hatóránként 85% marad. Hány óra múlva lesz először 20 mg-nál kevesebb?`,
        answer: 60,
        type: 'multiplication',
        expression: `0,85¹⁰ < 0,2 → 10 · 6 = 60`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Ételek 27% ÁFA, italok 18% ÁFA. Helyes bruttó 24 680 Ft, felcserélve 24 320 Ft.
Mennyi az ételek nettó értéke?`,
        answer: 12000,
        type: 'multiplication',
        expression: `Ételek 12 000 Ft, italok 8000 Ft`,
    },
    {
        stage: 6,
        question: `Teljes szállásköltség 78 000 Ft. Ha 2 tanuló visszalép, fejenként 250 Ft-tal többet fizetnek.
Hány fős az osztály?`,
        answer: 26,
        type: 'multiplication',
        expression: `26 fő, 3000 Ft/fő`,
    },
    {
        stage: 6,
        question: `25 részvény: 7000 Ft és 5000 Ft, összérték 145 000 Ft.
Hány darab 7000 Ft-os van?`,
        answer: 10,
        type: 'multiplication',
        expression: `10 db 7000 Ft-os és 15 db 5000 Ft-os`,
    },
    {
        stage: 6,
        question: `Kétszer csökkentik az árat: p%, majd p+4%. A végső ár az eredeti 80,96%-a.
Határozd meg a reális p-t!`,
        answer: 8,
        type: 'multiplication',
        expression: `p = 8`,
    },
    {
        stage: 6,
        question: `Jegyár p száz forint, kereslet 500 − 5p. Mekkora a maximális bevétel forintban?`,
        answer: 1250000,
        type: 'multiplication',
        expression: `p = 50 (5000 Ft), 250 jegy, bevétel 1 250 000`,
    },
    {
        stage: 6,
        question: `1000 autó, n őr, bliccelők (30−n)%, őr 50 autót ellenőriz, díj 10, bírság 100, bér 200 garas.
Hány parkolóőr mellett maximális a napi nettó bevétel?`,
        answer: 14,
        type: 'multiplication',
        expression: `n = 14, max. 16 800 garas`,
    },
    {
        stage: 6,
        question: `300 km: városban 10 l/100 km, országúton 7 l/100 km, összesen 24 liter.
Hány kilométert tett meg városban?`,
        answer: 100,
        type: 'multiplication',
        expression: `100 km városban és 200 km országúton`,
    },
    {
        stage: 6,
        question: `Három testvér: x−4, x, x+6 mértani sorozat.
Add meg a középső életkorát!`,
        answer: 12,
        type: 'multiplication',
        expression: `8, 12, 18 év`,
    },
    {
        stage: 6,
        question: `400 fős iskola, 10/n + 20/(400−n) = 0,15, legalább annyi fiú, mint lány.
Hány fiú van?`,
        answer: 200,
        type: 'multiplication',
        expression: `200 fiú és 200 lány`,
    },
    {
        stage: 6,
        question: `Két éve n célállomás, ma 50%-kal több. Az útvonalpárok száma 87-tel nőtt.
Hány célállomás volt két éve?`,
        answer: 12,
        type: 'multiplication',
        expression: `12 két éve, 18 most`,
    },
    {
        stage: 6,
        question: `500 g búza + 300 g rozs, majd +400 g liszt, a végső 1200 g keverék 2/3-a búza.
A hozzáadott 400 g-ból mennyi legyen búzaliszt?`,
        answer: 300,
        type: 'multiplication',
        expression: `300 g`,
    },
    {
        stage: 6,
        question: `60 utas × 1700 Ft, majd 90 utas × 1500 Ft.
Mennyi a két utat együtt tekintve az egy utasra jutó átlagos jegyár?`,
        answer: 1580,
        type: 'multiplication',
        expression: `(102000+135000)/150 = 1580`,
    },
    {
        stage: 6,
        question: `80 fős évfolyam, x hiányzó. Tévesen 0-val: átlag 63. Hiányzók később 64, végső átlag 67.
Határozd meg x-et!`,
        answer: 5,
        type: 'multiplication',
        expression: `x = 5, y = 67,2`,
    },
    {
        stage: 6,
        question: `1000 vendég költségei adott sávokban. Mindenki 3900 Ft-ot fizet.
Mekkora a szervező várható haszna?`,
        answer: 840000,
        type: 'multiplication',
        expression: `3 900 000 − 3 060 000 = 840 000`,
    },
    {
        stage: 6,
        question: `12 munkás 15 nap alatt végezne. 5 nap után 3 munkás elmegy.
Hány nap alatt készül el összesen a munka?

Add meg 3 tizedesjeggyel!`,
        answer: 18.333,
        type: 'multiplication',
        expression: `5 + 120/9 = 18,333`,
    },
    {
        stage: 6,
        question: `Egy szivattyú 4 óra alatt töltene. Lefolyó miatt 6 óra alatt telik meg.
Mennyi idő alatt ürítené a lefolyó a tele medencét?`,
        answer: 12,
        type: 'multiplication',
        expression: `1/4 − 1/6 = 1/12 → 12 óra`,
    },
    {
        stage: 6,
        question: `300 km, 4,5 óra áll rendelkezésre, ebből 30 perc pihenő.
Mekkora állandó haladási sebesség szükséges?`,
        answer: 75,
        type: 'multiplication',
        expression: `300 / 4 = 75`,
    },
    {
        stage: 6,
        question: `30 liter 40%-os sóoldatból x litert kiveszünk, majd vízzel pótoljuk. Végső koncentráció 25%.
Határozd meg x-et!`,
        answer: 11.25,
        type: 'multiplication',
        expression: `12 · (1 − x/30) = 7,5 → x = 11,25`,
    },
    {
        stage: 6,
        question: `Melyek azok a kétjegyű számok, amelyek jegyei nem nullák, és a számtani közép 0,5-del nagyobb a harmonikusnál?

Add meg a számok halmazát!`,
        answer: 4,
        expectedSet: ['13', '31', '36', '63'],
        type: 'multiplication',
        expression: `13, 31, 36, 63`,
    },
    {
        stage: 6,
        question: `Sorsjegy 500 Ft, 5000 db. Minden 10 Ft-os árcsökkentés +200 darab.
Add meg a bevételt maximalizáló árcsökkentések halmazát!`,
        answer: 2,
        expectedSet: ['120', '130'],
        type: 'multiplication',
        expression: `120 Ft vagy 130 Ft; bevétel 2 812 000 Ft`,
    },
];
