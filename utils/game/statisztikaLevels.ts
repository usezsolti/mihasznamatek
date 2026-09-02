import type { Question } from './types';

/**
 * Statisztika — 6 szint × 20 feladat (Statisztika.pdf).
 * 1 Leíró alapok → 2 Gyakoriság / súlyozott átlag → 3 Szóródás →
 * 4 Kvartilisek → 5 Fordított / összetett → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 * Szórás: populációs σ (1/n). Decimális: 3 tizedesjegy.
 */
export const getStatisztikaPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Határozd meg a 4, 6, 8, 10, 12 adatsokaság átlagát!`,
        answer: 8,
        type: 'multiplication',
        expression: `(4+6+8+10+12)/5 = 8`,
    },
    {
        stage: 1,
        question: `Határozd meg a 3, 5, 7, 9, 11 adatsokaság mediánját!`,
        answer: 7,
        type: 'multiplication',
        expression: `Rendezve a középső tag 7`,
    },
    {
        stage: 1,
        question: `Határozd meg a 2, 4, 6, 10, 12, 18 adatsokaság mediánját!`,
        answer: 8,
        type: 'multiplication',
        expression: `(6+10)/2 = 8`,
    },
    {
        stage: 1,
        question: `Határozd meg az 1, 2, 2, 3, 4, 4, 4, 5 adatsokaság móduszát!`,
        answer: 4,
        type: 'multiplication',
        expression: `A 4 háromszor szerepel`,
    },
    {
        stage: 1,
        question: `Határozd meg a 7, 9, 13, 18, 23 adatsokaság terjedelmét!`,
        answer: 16,
        type: 'multiplication',
        expression: `23 − 7 = 16`,
    },
    {
        stage: 1,
        question: `A 2, 4, 4, 5, 7, 8 adatsokaságnak add meg az átlagát!`,
        answer: 5,
        type: 'multiplication',
        expression: `Átlag 5, medián 4,5, módusz 4, terjedelem 6`,
    },
    {
        stage: 1,
        question: `Az 6, 8, 10, 12, x adatok átlaga 10. Határozd meg x-et!`,
        answer: 14,
        type: 'multiplication',
        expression: `(36+x)/5 = 10 → x = 14`,
    },
    {
        stage: 1,
        question: `Nyolc adat átlaga 12. Az egyik 9-es adatot 17-re cseréljük.
Mennyi lesz az új átlag?`,
        answer: 13,
        type: 'multiplication',
        expression: `12 + (17−9)/8 = 13`,
    },
    {
        stage: 1,
        question: `Egy 30 fős csoportból 12 fő választotta az A lehetőséget.
Határozd meg az A választás relatív gyakoriságát!

Add meg 3 tizedesjeggyel!`,
        answer: 0.4,
        type: 'multiplication',
        expression: `12/30 = 0,4`,
    },
    {
        stage: 1,
        question: `Az adatok: 1, 1, 2, 2, 2, 3, 3, 4, 5, 5.
Hányszor fordul elő a 2-es?`,
        answer: 3,
        type: 'multiplication',
        expression: `1:2, 2:3, 3:2, 4:1, 5:2`,
    },
    {
        stage: 1,
        question: `érték 1 2 3 4
gyakoriság 2 3 4 1

Határozd meg az adatok átlagát!`,
        answer: 2.4,
        type: 'multiplication',
        expression: `(2+6+12+4)/10 = 2,4`,
    },
    {
        stage: 1,
        question: `érték 2 4 6 8
gyakoriság 3 2 4 1

Határozd meg a mediánt!`,
        answer: 5,
        type: 'multiplication',
        expression: `n = 10, 5. és 6. tag: (4+6)/2 = 5`,
    },
    {
        stage: 1,
        question: `érték 1 2 3 4 5
gyakoriság 2 5 3 1 2

Határozd meg a móduszt!`,
        answer: 2,
        type: 'multiplication',
        expression: `A 2-es gyakorisága 5`,
    },
    {
        stage: 1,
        question: `jegy 2 3 4 5
darabszám 5 8 5 2

Határozd meg a dolgozatok átlagát!`,
        answer: 3.2,
        type: 'multiplication',
        expression: `(10+24+20+10)/20 = 3,2`,
    },
    {
        stage: 1,
        question: `Egy 200 elemű mintában egy esemény relatív gyakorisága 0,18.
Hányszor fordult elő az esemény?`,
        answer: 36,
        type: 'multiplication',
        expression: `0,18 · 200 = 36`,
    },
    {
        stage: 1,
        question: `Egy 24 adatból álló adatsokaság átlaga 7,5. Mennyi az adatok összege?`,
        answer: 180,
        type: 'multiplication',
        expression: `24 · 7,5 = 180`,
    },
    {
        stage: 1,
        question: `Kilenc adat átlaga 14. A mintához hozzáadunk egy 24-es értéket.
Mennyi lesz a tíz adat átlaga?`,
        answer: 15,
        type: 'multiplication',
        expression: `(126+24)/10 = 15`,
    },
    {
        stage: 1,
        question: `Tíz adat átlaga 20. Az adatsokaságból elhagyunk egy 29-es értéket.
Mennyi lesz a megmaradt kilenc adat átlaga?`,
        answer: 19,
        type: 'multiplication',
        expression: `(200−29)/9 = 19`,
    },
    {
        stage: 1,
        question: `Egy adatsokaság minden eleméhez 4-et adunk.
Mennyivel nő az átlag?`,
        answer: 4,
        type: 'multiplication',
        expression: `Átlag és medián +4, a terjedelem nem változik`,
    },
    {
        stage: 1,
        question: `Az öt adat: 4, 7, 8, x, 12, átlaga 8.
Határozd meg x-et!`,
        answer: 9,
        type: 'multiplication',
        expression: `x = 9, medián 8`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `érték 2 3 4 5
gyakoriság 4 6 8 2

Határozd meg az átlagot!`,
        answer: 3.4,
        type: 'multiplication',
        expression: `(8+18+32+10)/20 = 3,4`,
    },
    {
        stage: 2,
        question: `érték 2 3 4 5
gyakoriság 4 6 8 2

Határozd meg a mediánt!`,
        answer: 3.5,
        type: 'multiplication',
        expression: `n = 20, 10. és 11. tag: (3+4)/2 = 3,5; módusz 4`,
    },
    {
        stage: 2,
        question: `érték 2 3 4 5
gyakoriság 4 6 8 2

Add meg a 4-es relatív gyakoriságát!`,
        answer: 0.4,
        type: 'multiplication',
        expression: `0,20; 0,30; 0,40; 0,10`,
    },
    {
        stage: 2,
        question: `Az 1, 2, 3 értékek gyakorisága rendre 2, x, 4.
Az adatok átlaga 2,2. Határozd meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `(2+2x+12)/(6+x) = 2,2 → x = 4`,
    },
    {
        stage: 2,
        question: `Egy 20 fős osztály dolgozatátlaga 72 pont, egy 30 fős osztályé 78 pont.
Mennyi az összes 50 tanuló átlaga?`,
        answer: 75.6,
        type: 'multiplication',
        expression: `(1440+2340)/50 = 75,6`,
    },
    {
        stage: 2,
        question: `Egy 12 fős csoport átlaga 15, egy 8 fős csoport átlaga 21.
Határozd meg az egyesített csoport átlagát!`,
        answer: 17.4,
        type: 'multiplication',
        expression: `(180+168)/20 = 17,4`,
    },
    {
        stage: 2,
        question: `Egy adatsokaság minden adatához 5-öt adunk.
Mennyivel nő az átlag?`,
        answer: 5,
        type: 'multiplication',
        expression: `Átlag, medián, módusz +5; a szórás változatlan`,
    },
    {
        stage: 2,
        question: `Egy adatsokaság minden adatát −2-vel megszorozzuk.
A szórás hányszorosára változik?`,
        answer: 2,
        type: 'multiplication',
        expression: `Az átlag −2-szeres, a szórás |−2| = 2-szeres`,
    },
    {
        stage: 2,
        question: `Egy 25 fős csoport átlaga 68 pont. Öt új tanuló érkezik, a 30 fős csoport átlaga 70.
Mennyi az öt új tanuló pontszámának átlaga?`,
        answer: 80,
        type: 'multiplication',
        expression: `(30·70 − 25·68)/5 = 80`,
    },
    {
        stage: 2,
        question: `Húsz adat átlaga 75. Három adatot elhagyunk, amelyek átlaga 90.
Mennyi a megmaradt 17 adat átlaga?

Add meg 3 tizedesjeggyel!`,
        answer: 72.353,
        type: 'multiplication',
        expression: `(1500−270)/17 = 1230/17 ≈ 72,353`,
    },
    {
        stage: 2,
        question: `Egy kördiagram egy 60 fős csoport A kategóriájához 90°-os körcikket rendel.
Hány fő tartozik az A kategóriába?`,
        answer: 15,
        type: 'multiplication',
        expression: `(90/360)·60 = 15`,
    },
    {
        stage: 2,
        question: `Egy 120 elemű minta relatív gyakoriságai: 0,10; 0,30; 0,30; 0,15; 0,10; 0,05.
Hány elem tartozik a 0,15-ös relatív gyakoriságú osztályba?`,
        answer: 18,
        type: 'multiplication',
        expression: `12, 36, 36, 18, 12, 6`,
    },
    {
        stage: 2,
        question: `tömeg (g) 105 106 107 108 109 110
gyakoriság 12 36 36 18 12 6

Határozd meg az átlagos tömeget!`,
        answer: 107,
        type: 'multiplication',
        expression: `12840/120 = 107`,
    },
    {
        stage: 2,
        question: `tömeg (g) 105 106 107 108 109 110
gyakoriság 12 36 36 18 12 6

Határozd meg a mediánt!`,
        answer: 107,
        type: 'multiplication',
        expression: `Medián 107 g; módusz 106 g és 107 g`,
    },
    {
        stage: 2,
        question: `Minta: 491, 493, 493, 506, 508, 512, 512, 517.
Határozd meg az 500-tól mért átlagos abszolút eltérést!`,
        answer: 9.75,
        type: 'multiplication',
        expression: `(9+7+7+6+8+12+12+17)/8 = 9,75`,
    },
    {
        stage: 2,
        question: `A 491, 493, 493, 506, 508, 512, 512, 517 adatsokaság átlagát határozd meg!`,
        answer: 504,
        type: 'multiplication',
        expression: `Átlag 504, terjedelem 26`,
    },
    {
        stage: 2,
        question: `120 termék: 10% 105 g, 30% 106 g, 30% 107 g, 15% 108 g, 10% 109 g, 5% 110 g.
Hány termék tömege kisebb 107 grammnál?`,
        answer: 48,
        type: 'multiplication',
        expression: `0,10·120 + 0,30·120 = 48`,
    },
    {
        stage: 2,
        question: `Egy eperkészlet 35%-a 800 Ft/kg, 37,5%-a 650 Ft/kg, a maradék 450 Ft/kg.
Határozd meg az eredeti súlyozott átlagár 85%-át!

Add meg 3 tizedesjeggyel!`,
        answer: 550.375,
        type: 'multiplication',
        expression: `647,5 · 0,85 = 550,375`,
    },
    {
        stage: 2,
        question: `12 férfi átlagéletkora 30 év, 18 nőé 26 év.
Mennyi az egész csoport átlagéletkora?`,
        answer: 27.6,
        type: 'multiplication',
        expression: `(360+468)/30 = 27,6`,
    },
    {
        stage: 2,
        question: `Hét adat átlaga 73. Hat ismert adat: 70, 71, 71, 72, 75, 75.
Határozd meg a hetedik adatot!`,
        answer: 77,
        type: 'multiplication',
        expression: `511 − 434 = 77`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `A 2, 4, 6, 8, 10 adatok varianciáját határozd meg!`,
        answer: 8,
        type: 'multiplication',
        expression: `Átlag 6, σ² = 8, σ = 2√2`,
    },
    {
        stage: 3,
        question: `A 3, 3, 5, 7, 7 adatok szórását határozd meg!

Add meg 3 tizedesjeggyel!`,
        answer: 1.789,
        type: 'multiplication',
        expression: `Átlag 5, σ = 4/√5 ≈ 1,789`,
    },
    {
        stage: 3,
        question: `érték 10 12 14 16
gyakoriság 2 3 4 1

Határozd meg a szórást 3 tizedesjeggyel!`,
        answer: 1.833,
        type: 'multiplication',
        expression: `Átlag 12,8; σ = √3,36 ≈ 1,833`,
    },
    {
        stage: 3,
        question: `A: 46, 47, 51, 52 és B: 48, 49, 53, 54.
Mennyi a B minta átlaga?`,
        answer: 51,
        type: 'multiplication',
        expression: `A = 49, B = 51; mindkét szórás √6,5`,
    },
    {
        stage: 3,
        question: `Egy adatsokaság átlaga 20, szórása 4. Minden adathoz 7-et adunk.
Mi lesz az új átlag?`,
        answer: 27,
        type: 'multiplication',
        expression: `Átlag 27, szórás 4`,
    },
    {
        stage: 3,
        question: `Egy adatsokaság átlaga 12, szórása 5. Minden adatot 3-mal megszorzunk.
Mi lesz az új szórás?`,
        answer: 15,
        type: 'multiplication',
        expression: `Átlag 36, szórás 15`,
    },
    {
        stage: 3,
        question: `Két adat átlaga 10, szórása 4.
Add meg a két adatot!

Add meg a két szám halmazát!`,
        answer: 2,
        expectedSet: ['6', '14'],
        type: 'multiplication',
        expression: `6 és 14`,
    },
    {
        stage: 3,
        question: `Az 1, 2, 3, 4, 5 adatok varianciáját határozd meg!`,
        answer: 2,
        type: 'multiplication',
        expression: `σ² = 2, σ = √2`,
    },
    {
        stage: 3,
        question: `Határozd meg a 2, 4, 6, 8 adatok átlagtól mért átlagos abszolút eltérését!`,
        answer: 2,
        type: 'multiplication',
        expression: `Átlag 5; (3+1+1+3)/4 = 2`,
    },
    {
        stage: 3,
        question: `Öt adat átlaga 20, az átlagtól vett eltérések négyzetösszege 180.
Határozd meg a szórást!`,
        answer: 6,
        type: 'multiplication',
        expression: `σ = √(180/5) = 6`,
    },
    {
        stage: 3,
        question: `Egy minta átlaga 12, szórása 3. Az új adatok: y = 2x − 5.
Határozd meg az új minta átlagát!`,
        answer: 19,
        type: 'multiplication',
        expression: `Átlag 19, szórás 6`,
    },
    {
        stage: 3,
        question: `Egy mérési adatsor minden eleméhez ugyanazt a c számot adjuk.
Változik-e az átlagtól mért átlagos abszolút eltérés?
(1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem változik`,
    },
    {
        stage: 3,
        question: `Tömegek: 163, 163, 163, 163, 163, 164, 165, 166, 166.
Határozd meg az átlagot!`,
        answer: 164,
        type: 'multiplication',
        expression: `Átlag 164, terjedelem 3, σ = √(14/9) ≈ 1,247`,
    },
    {
        stage: 3,
        question: `Adatok: 506, 491, 493, 512, 508, 517, 493, 512.
Határozd meg a szórást 3 tizedesjeggyel!`,
        answer: 9.539,
        type: 'multiplication',
        expression: `Átlag 504, σ = √91 ≈ 9,539`,
    },
    {
        stage: 3,
        question: `Igaz vagy hamis? Ha egy adatsokaság minden eleméhez ugyanazt a számot adjuk, akkor a szórás nem változik.
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 3,
        question: `Milyen adatsokaságok szórása 0?
Add meg ezt a szórást!`,
        answer: 0,
        type: 'multiplication',
        expression: `Pontosan azoké, amelyekben minden adat egyenlő`,
    },
    {
        stage: 3,
        question: `Tíz adat közül négy darab 1, hat darab 0.
Határozd meg a szórást 3 tizedesjeggyel!`,
        answer: 0.49,
        type: 'multiplication',
        expression: `Átlag 0,4; σ = √0,24 ≈ 0,490`,
    },
    {
        stage: 3,
        question: `Húsz adat átlaga 50, szórása 4. Minden adatot 10-zel növelünk.
Határozd meg az új átlagot!`,
        answer: 60,
        type: 'multiplication',
        expression: `Átlag 60, szórás 4`,
    },
    {
        stage: 3,
        question: `A: 1, 3, 5, 7, 9 és B: 4, 4, 5, 6, 6. Mindkét átlag 5.
Mennyi A szórása 3 tizedesjeggyel?`,
        answer: 2.828,
        type: 'multiplication',
        expression: `σA = 2√2 ≈ 2,828 > σB ≈ 0,894`,
    },
    {
        stage: 3,
        question: `Ha egy adatsokaság minden eleme c, mennyi a szórás?`,
        answer: 0,
        type: 'multiplication',
        expression: `Minden eltérés 0, ezért σ = 0`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Rendezett adatsor: 2, 4, 5, 6, 8, 9, 12, 15.
Határozd meg az interkvartilis terjedelmet!`,
        answer: 6,
        type: 'multiplication',
        expression: `Q1 = 4,5; Me = 7; Q3 = 10,5; IQR = 6`,
    },
    {
        stage: 4,
        question: `Ötszám-összefoglaló: min = 3, Q1 = 5, Me = 8, Q3 = 12, max = 17.
Határozd meg az interkvartilis terjedelmet!`,
        answer: 7,
        type: 'multiplication',
        expression: `Terjedelem 14, IQR = 7`,
    },
    {
        stage: 4,
        question: `Ötszám-összefoglaló: 2, 5, 7, 10, 14. Minden adathoz 4-et adunk.
Add meg az új ötszám-összefoglaló elemeit!

Add meg a halmazt!`,
        answer: 5,
        expectedSet: ['6', '9', '11', '14', '18'],
        type: 'multiplication',
        expression: `6, 9, 11, 14, 18`,
    },
    {
        stage: 4,
        question: `Ötszám-összefoglaló: 1, 3, 5, 8, 10. Minden adatot 2-vel megszorzunk.
Add meg az új ötszám-összefoglaló elemeit!

Add meg a halmazt!`,
        answer: 5,
        expectedSet: ['2', '6', '10', '16', '20'],
        type: 'multiplication',
        expression: `2, 6, 10, 16, 20`,
    },
    {
        stage: 4,
        question: `Ötszám-összefoglaló: 2, 4, 6, 9, 13. Minden adatot −1-gyel megszorzunk.
Add meg az új ötszám-összefoglalót növekvő sorrendben!

Add meg a halmazt!`,
        answer: 5,
        expectedSet: ['-13', '-9', '-6', '-4', '-2'],
        type: 'multiplication',
        expression: `−13, −9, −6, −4, −2`,
    },
    {
        stage: 4,
        question: `Hét pozitív egész: átlag 10, medián 10, két módusz 8 és 12, min 6, max 14.
Add meg a maximumot!`,
        answer: 14,
        type: 'multiplication',
        expression: `6, 8, 8, 10, 12, 12, 14`,
    },
    {
        stage: 4,
        question: `Hét pozitív egész: két módusz 71 és 75, medián 72, átlag 73, terjedelem 7.
Add meg a maximumot!`,
        answer: 77,
        type: 'multiplication',
        expression: `70, 71, 71, 72, 75, 75, 77`,
    },
    {
        stage: 4,
        question: `Öt adat közül négy: 90, 150, 160, 200.
Az öt adat átlaga szerepel az adatok között, és az egyetlen módusz nem egyenlő a mediánnal.
Határozd meg az ötödik adatot!`,
        answer: 200,
        type: 'multiplication',
        expression: `Az ötödik adat 200`,
    },
    {
        stage: 4,
        question: `Adatsor: 3, 4, 6, 6, 7, 7, 7, 8.
Határozd meg a mediánt!`,
        answer: 6.5,
        type: 'multiplication',
        expression: `Átlag 6, medián 6,5, Q1 = 5, Q3 = 7`,
    },
    {
        stage: 4,
        question: `Rendezett adatsor: 2, 3, 3, 4, 5, 7, 8, 8, 9, 12.
Határozd meg a mediánt!`,
        answer: 6,
        type: 'multiplication',
        expression: `min 2, Q1 3, Me 6, Q3 8, max 12`,
    },
    {
        stage: 4,
        question: `Q1 = 12, Q3 = 20.
Mekkora az interkvartilis terjedelem?`,
        answer: 8,
        type: 'multiplication',
        expression: `IQR = 8; ez a középső kb. 50%`,
    },
    {
        stage: 4,
        question: `Az 10, 20, 30 értékek gyakorisága rendre 4, x, 2.
Az átlag 18. Határozd meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4; módusz 10 és 20`,
    },
    {
        stage: 4,
        question: `Ötven adat mindegyike 0, 1 vagy 2, az átlag 0,32.
Legfeljebb hány darab 2-es lehet közöttük?`,
        answer: 8,
        type: 'multiplication',
        expression: `Összeg 16; max 8 darab 2-es`,
    },
    {
        stage: 4,
        question: `Ötven adat mindegyike 0, 1 vagy 2, az átlag 1,04.
Lehet-e a medián 0? (1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `Összeg 52; a medián nem lehet 0`,
    },
    {
        stage: 4,
        question: `Ötven adat mindegyike 0, 1 vagy 2, az átlag 0,62.
Lehet-e az egyetlen módusz 1? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igen, pl. 31 darab 1 és 19 darab 0`,
    },
    {
        stage: 4,
        question: `200 magyar, 70 angol, 130 német. Angolok átlaga 44, németeké 48, összes 45,7.
Határozd meg a magyarok átlagéletkorát!`,
        answer: 44.8,
        type: 'multiplication',
        expression: `(18280 − 3080 − 6240)/200 = 44,8`,
    },
    {
        stage: 4,
        question: `Egy továbbképzés átlagéletkora 28 év. Az öt legidősebb átlaga 40, a többieké 25,6.
Hány résztvevő van?`,
        answer: 30,
        type: 'multiplication',
        expression: `30 fő: 18 nő és 12 férfi`,
    },
    {
        stage: 4,
        question: `Egy csapatnak n tagja volt, átlaguk y. Egy 186 cm-es játékosnál az átlag +1 cm,
majd egy 194 cm-esnél az eredetihez képest +2,5 cm.
Határozd meg n-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `n = 10, y = 175`,
    },
    {
        stage: 4,
        question: `Egy 24 fős csoport átlaga 72, egy 16 fős csoport átlaga 84.
Határozd meg a 40 fő együttes átlagát!`,
        answer: 76.8,
        type: 'multiplication',
        expression: `(1728+1344)/40 = 76,8`,
    },
    {
        stage: 4,
        question: `8 elem: min 2, Q1 3, Me 6, Q3 8, max 12.
Mekkora az interkvartilis terjedelem?`,
        answer: 5,
        type: 'multiplication',
        expression: `Terjedelem 10, IQR 5`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `Ötven adat mindegyike 0, 1 vagy 2, az átlag 0,68.
Legfeljebb hány darab 2-es lehet közöttük?`,
        answer: 17,
        type: 'multiplication',
        expression: `Összeg 34; max 17 darab 2-es`,
    },
    {
        stage: 5,
        question: `Negyven adat mindegyike 0, 1 vagy 2, az átlag 1,15.
Lehet-e a medián 0? (1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `Összeg 46; a medián nem lehet 0`,
    },
    {
        stage: 5,
        question: `Harminc adat mindegyike 0, 1 vagy 2, az átlag 0,8.
Lehet-e az egyetlen módusz 1? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igen, pl. 10 db 0, 16 db 1, 4 db 2`,
    },
    {
        stage: 5,
        question: `Hét pozitív egész: átlag 20, medián 20, két módusz 18 és 22, terjedelem 8.
Add meg a legkisebb adatot!`,
        answer: 16,
        type: 'multiplication',
        expression: `16, 18, 18, 20, 22, 22, 24`,
    },
    {
        stage: 5,
        question: `Tomi első hét értékelése: 5, 7, 5, 1, 7, 7, 5.
A következő három után a tíz adat átlaga 5,3, terjedelme 8, és egyetlen módusza van.
Add meg a három új értékelést!

Add meg a halmazt!`,
        answer: 3,
        expectedSet: ['2', '5', '9'],
        type: 'multiplication',
        expression: `2, 5, 9 valamilyen sorrendben`,
    },
    {
        stage: 5,
        question: `Tíz mérkőzés értékelésének átlaga 8,4. A tizenegyedik értékelés x.
Az új átlag az előző átlagnál az x tizedével kisebb.
Határozd meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `(84+x)/11 = 8,4 − x/10 → x = 4`,
    },
    {
        stage: 5,
        question: `Egy 120 fős csoport átlaga 44, egy 80 fős csoporté 50.
Határozd meg az egyesített csoport átlagát!`,
        answer: 46.4,
        type: 'multiplication',
        expression: `(5280+4000)/200 = 46,4`,
    },
    {
        stage: 5,
        question: `Húsz ember átlagéletkora 60 év. A négy legidősebb átlaga 90 év.
Határozd meg a maradék 16 ember átlagéletkorát!`,
        answer: 52.5,
        type: 'multiplication',
        expression: `(1200−360)/16 = 52,5`,
    },
    {
        stage: 5,
        question: `Egy csoport átlaga 70. Egy 85 pontos tanuló csatlakozásakor az átlag 71-re nő.
Hányan voltak eredetileg a csoportban?`,
        answer: 14,
        type: 'multiplication',
        expression: `70n + 85 = 71(n+1) → n = 14`,
    },
    {
        stage: 5,
        question: `Létszám n, átlag y. Egy 190 cm-es játékosnál az átlag +0,5 cm,
majd egy 205 cm-esnél az eredetihez képest +1,5 cm.
Határozd meg n-et!`,
        answer: 26,
        type: 'multiplication',
        expression: `n = 26, y = 176,5`,
    },
    {
        stage: 5,
        question: `Nyolc csomag (dkg): 496, 508, 503, 491, 512, 499, 505, 486.
Feltétel: egyik sem 490-nél kisebb, és az 500-tól mért átlagos abszolút eltérés ≤ 10.
Engedélyezhető-e az árusítás? (1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem: van 486 dkg-os csomag`,
    },
    {
        stage: 5,
        question: `Hat mérés: 99, 101, 100, 100, 102, 98.
Megfelelő, ha a terjedelem ≤ 4 és a szórás ≤ 1,5.
Megfelelő-e? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `Terjedelem 4, σ = √(5/3) ≈ 1,291`,
    },
    {
        stage: 5,
        question: `Tíz adat közül x darab 0, a többi 2. Az átlag 1,2.
Határozd meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4, σ = √0,96 ≈ 0,980`,
    },
    {
        stage: 5,
        question: `Száz különböző pozitív egész szám átlaga 500.
Legfeljebb mekkora lehet közülük a legnagyobb?`,
        answer: 45050,
        type: 'multiplication',
        expression: `1+⋯+99 + x = 50000 → x = 45050`,
    },
    {
        stage: 5,
        question: `Húsz nemnegatív egész szám átlaga 7,3.
Legalább mekkorának kell lennie a legnagyobb számnak?`,
        answer: 8,
        type: 'multiplication',
        expression: `Legalább 8; pl. 14 darab 7 és 6 darab 8`,
    },
    {
        stage: 5,
        question: `Igaz-e: egy véges adatsokaságban van legalább egy adat, amely nem kisebb az átlagnál, és legalább egy, amely nem nagyobb az átlagnál?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 5,
        question: `Harminc adat: 0, 1 vagy 2, átlag 0,8.
Lehet-e az egyetlen módusz 1? (1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `Pl. 10 db 0, 16 db 1, 4 db 2`,
    },
    {
        stage: 5,
        question: `Átlag 12, szórás 3. Új adatok: y = −2x + 7.
Határozd meg az új átlagot!`,
        answer: -17,
        type: 'multiplication',
        expression: `Átlag −17, szórás 6`,
    },
    {
        stage: 5,
        question: `Határozd meg x > 0-t úgy, hogy 7 és x harmonikus közepe 10 legyen!`,
        answer: 17.5,
        type: 'multiplication',
        expression: `2/(1/7+1/x) = 10 → x = 17,5`,
    },
    {
        stage: 5,
        question: `Számítsd ki 4 és 9 harmonikus közepét 3 tizedesjeggyel!`,
        answer: 5.538,
        type: 'multiplication',
        expression: `H = 72/13 ≈ 5,538 < G = 6 < A = 6,5`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Ha minden adathoz c = 5-öt adunk, mennyivel nő az átlag?`,
        answer: 5,
        type: 'multiplication',
        expression: `x̄ + c`,
    },
    {
        stage: 6,
        question: `Ha minden adathoz ugyanazt a c számot adjuk, változik-e a szórás?
(1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `A szórás változatlan`,
    },
    {
        stage: 6,
        question: `Ha minden adatot k = −3-mal megszorzunk, a szórás hányszorosára változik?`,
        answer: 3,
        type: 'multiplication',
        expression: `σúj = |k|σ`,
    },
    {
        stage: 6,
        question: `Σ(xᵢ − a)² akkor minimális, ha a megegyezik az átlaggal.
Ha az átlag 7, melyik a-nál van a minimum?`,
        answer: 7,
        type: 'multiplication',
        expression: `Minimum a = x̄-nél`,
    },
    {
        stage: 6,
        question: `Igaz-e, hogy bármely nemüres véges adatsokaságban min xᵢ ≤ x̄ ≤ max xᵢ?
(1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Az állítás igaz`,
    },
    {
        stage: 6,
        question: `Ha egy adatsokaság átlaga megegyezik a legnagyobb adatával, hányféle különböző adat lehet?`,
        answer: 1,
        type: 'multiplication',
        expression: `Minden adat a maximummal egyenlő`,
    },
    {
        stage: 6,
        question: `n = 10 elemű minta, az a = 3 értéket b = 13-ra cseréljük.
Mennyivel nő az átlag?`,
        answer: 1,
        type: 'multiplication',
        expression: `x̄új = x̄ + (b−a)/n = x̄ + 1`,
    },
    {
        stage: 6,
        question: `Két csoport: n₁ = 10, x̄₁ = 5 és n₂ = 20, x̄₂ = 8.
Mennyi az egyesített átlag?`,
        answer: 7,
        type: 'multiplication',
        expression: `(n₁x̄₁ + n₂x̄₂)/(n₁+n₂) = 7`,
    },
    {
        stage: 6,
        question: `n = 10, átlag 4, Σxᵢ² = 200.
Határozd meg a varianciát!`,
        answer: 4,
        type: 'multiplication',
        expression: `σ² = (Σx²)/n − x̄² = 20 − 16 = 4`,
    },
    {
        stage: 6,
        question: `Az 1, 2, …, n adatsokaság varianciája n = 5 esetén mennyi?`,
        answer: 2,
        type: 'multiplication',
        expression: `x̄ = (n+1)/2, σ² = (n²−1)/12; n = 5-re 2`,
    },
    {
        stage: 6,
        question: `Az 1, 3, 6, 10, 15 adatok szórását határozd meg 3 tizedesjeggyel!`,
        answer: 5.02,
        type: 'multiplication',
        expression: `Átlag 7, σ = √25,2 ≈ 5,020`,
    },
    {
        stage: 6,
        question: `24 elemű minta kördiagramja: 49, 50, 51, 52, 53, 54 értékekhez
30°, 60°, 105°, 60°, 75°, 30°.
Határozd meg az átlagot!`,
        answer: 51.5,
        type: 'multiplication',
        expression: `Gyakoriságok 2, 4, 7, 4, 5, 2; átlag 51,5; σ = √2`,
    },
    {
        stage: 6,
        question: `40 értékelés 1-től 10-ig. 18 darab 1-es, a többi 9-es vagy 10-es, átlag 5,5.
Hány 10-es értékelés volt?`,
        answer: 4,
        type: 'multiplication',
        expression: `18 darab 9-es és 4 darab 10-es; σ ≈ 4,081`,
    },
    {
        stage: 6,
        question: `Kétszáz különböző pozitív egész szám átlaga 600.
Legfeljebb mekkora lehet közülük a legnagyobb?`,
        answer: 100100,
        type: 'multiplication',
        expression: `1+⋯+199 + x = 120000 → x = 100100`,
    },
    {
        stage: 6,
        question: `Kilenc rendezett adat közül nyolc: 10, 14, 14, 15, 16, 18, 18, 22.
Az átlag 16. Határozd meg a hiányzó adatot!`,
        answer: 17,
        type: 'multiplication',
        expression: `Hiányzó 17; medián 16; móduszok 14 és 18; terjedelem 12`,
    },
    {
        stage: 6,
        question: `Nyolc rendezett adat: 2, 4, 5, 6, x, 10, 12, 15. Az átlag 8.
Határozd meg x-et!`,
        answer: 10,
        type: 'multiplication',
        expression: `x = 10, Q1 = 4,5, Me = 8, Q3 = 11`,
    },
    {
        stage: 6,
        question: `Az 1, 2, 3, 4 értékek gyakorisága rendre 2, x, 5, 1.
Az átlag 29/12. Határozd meg x-et!`,
        answer: 4,
        type: 'multiplication',
        expression: `x = 4; módusz 3`,
    },
    {
        stage: 6,
        question: `Két, egyenként 10 elemű csoport átlaga 5 és 9, mindkét variancia 4.
Határozd meg a 20 adat együttes varianciáját!`,
        answer: 8,
        type: 'multiplication',
        expression: `Együttes átlag 7, variancia 8`,
    },
    {
        stage: 6,
        question: `Σ|xᵢ − a| akkor minimális, ha a a medián.
A rendezett 1, 2, 3, 4, 5 adatsornál add meg ezt az a-t!`,
        answer: 3,
        type: 'multiplication',
        expression: `A mediánnál az abszolút eltérések összege minimális`,
    },
    {
        stage: 6,
        question: `Adj meg egy 9 elemű egész adatsokaságot: átlag 10, medián 10, egyetlen módusz 8, terjedelem 11.
Hányszor szerepel a módusz?`,
        answer: 3,
        type: 'multiplication',
        expression: `Pl. {4, 8, 8, 8, 10, 11, 12, 14, 15}`,
    },
];
