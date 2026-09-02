import type { Question } from './types';

/**
 * Térgeometria — 6 szint × 20 feladat (Térgeometria.pdf).
 * 1 Alapok → 2 Összetett / csonkolás → 3 Távolság / szög / metszet →
 * 4 Hasonlóság / szélsőérték → 5 Alkalmazott → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz. π-s eredmény: a π együtthatója.
 */
export const getTergeometriaPracticeQuestions = (): Question[] => [
    // —— 1. szint ——
    {
        stage: 1,
        question: `Egy kocka élhossza 5 cm. Határozd meg a térfogatát cm³-ben!`,
        answer: 125,
        type: 'multiplication',
        expression: `A = 150 cm², V = 125 cm³`,
    },
    {
        stage: 1,
        question: `Egy téglatest élei 3 cm, 4 cm és 12 cm. Határozd meg a testátlót cm-ben!`,
        answer: 13,
        type: 'multiplication',
        expression: `V = 144, A = 192, d = 13`,
    },
    {
        stage: 1,
        question: `Négyzet alapú egyenes hasáb, alapél 6 cm, magasság 10 cm.
Határozd meg a térfogatát cm³-ben!`,
        answer: 360,
        type: 'multiplication',
        expression: `A = 312 cm², V = 360 cm³`,
    },
    {
        stage: 1,
        question: `Háromszög alapú egyenes hasáb: alap 3, 4, 5 cm, magasság 10 cm.
Határozd meg a térfogatát cm³-ben!`,
        answer: 60,
        type: 'multiplication',
        expression: `A = 132 cm², V = 60 cm³`,
    },
    {
        stage: 1,
        question: `Forgáshenger: r = 3 cm, h = 8 cm.
A térfogat kπ cm³. Add meg k-t!`,
        answer: 72,
        type: 'multiplication',
        expression: `A = 66π, V = 72π`,
    },
    {
        stage: 1,
        question: `Felül nyitott forgáshenger: r = 4 cm, h = 10 cm. Az alsó alaplapot beleszámítjuk.
A külső felület kπ cm². Add meg k-t!`,
        answer: 96,
        type: 'multiplication',
        expression: `πr² + 2πrh = 96π`,
    },
    {
        stage: 1,
        question: `Forgáskúp: r = 5 cm, h = 12 cm. Határozd meg az alkotót cm-ben!`,
        answer: 13,
        type: 'multiplication',
        expression: `s = 13, A = 90π, V = 100π`,
    },
    {
        stage: 1,
        question: `Gömb sugara 6 cm. A térfogat kπ cm³. Add meg k-t!`,
        answer: 288,
        type: 'multiplication',
        expression: `A = 144π, V = 288π`,
    },
    {
        stage: 1,
        question: `Félgömb sugara 3 cm, az alapkört beleszámítjuk.
A térfogat kπ cm³. Add meg k-t!`,
        answer: 18,
        type: 'multiplication',
        expression: `V = 18π, A = 27π`,
    },
    {
        stage: 1,
        question: `Szabályos négyzet alapú gúla: alapél 6 cm, magasság 4 cm.
Határozd meg a térfogatát cm³-ben!`,
        answer: 48,
        type: 'multiplication',
        expression: `V = 48, A = 96`,
    },
    {
        stage: 1,
        question: `Téglatest térfogata 240 cm³, két éle 5 cm és 6 cm. Mennyi a harmadik él?`,
        answer: 8,
        type: 'multiplication',
        expression: `240 / 30 = 8`,
    },
    {
        stage: 1,
        question: `Forgáshenger térfogata 200π cm³, sugara 5 cm. Határozd meg a magasságot!`,
        answer: 8,
        type: 'multiplication',
        expression: `200π / (25π) = 8`,
    },
    {
        stage: 1,
        question: `Forgáskúp térfogata 96π cm³, magassága 8 cm. Határozd meg az alapkör sugarát!`,
        answer: 6,
        type: 'multiplication',
        expression: `(1/3)πr²·8 = 96π → r = 6`,
    },
    {
        stage: 1,
        question: `Gömb felszíne 100π cm². Határozd meg a sugarát!`,
        answer: 5,
        type: 'multiplication',
        expression: `r = 5, V = 500π/3`,
    },
    {
        stage: 1,
        question: `Kocka testátlója 6√3 cm. Határozd meg az élhosszát!`,
        answer: 6,
        type: 'multiplication',
        expression: `a = 6, A = 216`,
    },
    {
        stage: 1,
        question: `Kocka térfogata 343 cm³. Határozd meg az élhosszát!`,
        answer: 7,
        type: 'multiplication',
        expression: `a = 7, A = 294`,
    },
    {
        stage: 1,
        question: `Egyenes hasáb: alapterület 25 cm², kerület 20 cm, magasság 8 cm.
Határozd meg a térfogatát cm³-ben!`,
        answer: 200,
        type: 'multiplication',
        expression: `V = 200, A = 210`,
    },
    {
        stage: 1,
        question: `Forgáshenger átmérője 10 cm, magassága 5 cm.
A térfogat kπ cm³. Add meg k-t!`,
        answer: 125,
        type: 'multiplication',
        expression: `V = 125π`,
    },
    {
        stage: 1,
        question: `Forgáskúp átmérője 6 cm, alkotója 5 cm. Határozd meg a magasságot!`,
        answer: 4,
        type: 'multiplication',
        expression: `h = 4, V = 12π`,
    },
    {
        stage: 1,
        question: `Forgáshenger palástja 40π cm², sugara 2 cm. Határozd meg a magasságot!`,
        answer: 10,
        type: 'multiplication',
        expression: `h = 10, V = 40π`,
    },

    // —— 2. szint ——
    {
        stage: 2,
        question: `Hengeres tartály: r = 0,5 m, h = 2 m. Hány liter folyadék fér bele?
Egész literre kerekítve!`,
        answer: 1571,
        type: 'multiplication',
        expression: `500π ≈ 1571 liter`,
    },
    {
        stage: 2,
        question: `Téglatest akvárium: 40 cm × 30 cm × 25 cm. Hány liter a térfogata?`,
        answer: 30,
        type: 'multiplication',
        expression: `30000 cm³ = 30 l`,
    },
    {
        stage: 2,
        question: `Üreges henger: h = 10 cm, külső r = 5 cm, belső r = 4 cm.
Az anyag térfogata kπ cm³. Add meg k-t!`,
        answer: 90,
        type: 'multiplication',
        expression: `π(25−16)·10 = 90π`,
    },
    {
        stage: 2,
        question: `Csonkakúp: R = 6 cm, r = 3 cm, h = 4 cm.
A térfogat kπ cm³. Add meg k-t!`,
        answer: 84,
        type: 'multiplication',
        expression: `V = 84π, A = 90π`,
    },
    {
        stage: 2,
        question: `Henger r = 4 cm, h = 10 cm, tetején 4 cm sugarú félgömb.
A térfogat (kπ)/3 cm³. Add meg k-t!`,
        answer: 608,
        type: 'multiplication',
        expression: `V = 608π/3`,
    },
    {
        stage: 2,
        question: `10 cm élű kockán 2 cm sugarú hengeres furat a lapokra merőlegesen.
A megmaradó térfogat 1000 − kπ. Add meg k-t!`,
        answer: 40,
        type: 'multiplication',
        expression: `1000 − 40π`,
    },
    {
        stage: 2,
        question: `Felül nyitott négyzet alapú hasáb: alapél 5 cm, magasság 12 cm.
Mekkora anyagfelület kell cm²-ben?`,
        answer: 265,
        type: 'multiplication',
        expression: `25 + 4·5·12 = 265`,
    },
    {
        stage: 2,
        question: `Felül nyitott téglatest doboz: alj 8×6 cm, magasság 5 cm.
Mekkora a karton területe cm²-ben?`,
        answer: 188,
        type: 'multiplication',
        expression: `48 + 2·8·5 + 2·6·5 = 188`,
    },
    {
        stage: 2,
        question: `Szabályos háromszög alapú hasáb: alapél 6 cm, magasság 10 cm.
A térfogat k√3 cm³. Add meg k-t!`,
        answer: 90,
        type: 'multiplication',
        expression: `V = 90√3, A = 180+18√3`,
    },
    {
        stage: 2,
        question: `Szabályos hatszög alapú hasáb: alapél 4 cm, magasság 10 cm.
A térfogat k√3 cm³. Add meg k-t!`,
        answer: 240,
        type: 'multiplication',
        expression: `V = 240√3, A = 240+48√3`,
    },
    {
        stage: 2,
        question: `Kúp r = 6 cm, h = 12 cm, magasság felénél párhuzamos vágás.
A csonkakúp térfogata kπ cm³. Add meg k-t!`,
        answer: 126,
        type: 'multiplication',
        expression: `V = 126π`,
    },
    {
        stage: 2,
        question: `10 cm élű kockába írt gömb térfogata (kπ)/3 cm³. Add meg k-t!`,
        answer: 500,
        type: 'multiplication',
        expression: `Vg = 500π/3`,
    },
    {
        stage: 2,
        question: `12 cm élű kockába írt gömb és a kocka térfogatának aránya π/k.
Add meg k-t!`,
        answer: 6,
        type: 'multiplication',
        expression: `π/6`,
    },
    {
        stage: 2,
        question: `4 cm sugarú gömb köré írt, a gömböt mindkét alapon érintő henger.
A henger és gömb közti üres tér (kπ)/3 cm³. Add meg k-t!`,
        answer: 128,
        type: 'multiplication',
        expression: `128π/3`,
    },
    {
        stage: 2,
        question: `Kúp r = 3 cm, h = 4 cm palástját síkba terítjük.
Határozd meg a körcikk középponti szögét fokban!`,
        answer: 216,
        type: 'multiplication',
        expression: `s = 5, α = 216°`,
    },
    {
        stage: 2,
        question: `Henger r = 4 cm, h = 10 cm palástját síkba terítjük.
A téglalap egyik oldala 10 cm, a másik kπ cm. Add meg k-t!`,
        answer: 8,
        type: 'multiplication',
        expression: `8π cm × 10 cm`,
    },
    {
        stage: 2,
        question: `Kúp r = 6 cm, h = 8 cm palástját síkba terítjük.
Határozd meg a körcikk középponti szögét fokban!`,
        answer: 216,
        type: 'multiplication',
        expression: `s = 10, α = 216°`,
    },
    {
        stage: 2,
        question: `Henger magasságát 3 : 2 arányban osztjuk az alappal párhuzamos síkkal.
A nagyobb térfogatrész hányszorosa a kisebbnek?`,
        answer: 1.5,
        type: 'multiplication',
        expression: `3 : 2`,
    },
    {
        stage: 2,
        question: `Kúpot az alappal párhuzamosan a csúcstól mért magasság 1/3-ánál vágunk.
A csonkakúp az eredeti térfogat hányad része?

Add meg 3 tizedesjeggyel!`,
        answer: 0.963,
        type: 'multiplication',
        expression: `26/27 ≈ 0,963`,
    },
    {
        stage: 2,
        question: `7 cm sugarú gömböt a középpontján át síkkal metszünk.
A metszet területe kπ cm². Add meg k-t!`,
        answer: 49,
        type: 'multiplication',
        expression: `T = 49π, K = 14π`,
    },

    // —— 3. szint ——
    {
        stage: 3,
        question: `6 cm élű kocka testátlója k√3 cm. Add meg k-t!`,
        answer: 6,
        type: 'multiplication',
        expression: `lapátló 6√2, testátló 6√3`,
    },
    {
        stage: 3,
        question: `3, 4, 12 cm élű téglatest testátlója cm-ben?`,
        answer: 13,
        type: 'multiplication',
        expression: `√(9+16+144) = 13`,
    },
    {
        stage: 3,
        question: `Kocka testátlója milyen szöget zár be egy lap síkjával? Add meg fokban, 3 tizedesjeggyel!`,
        answer: 35.264,
        type: 'multiplication',
        expression: `arcsin(1/√3) ≈ 35,264°`,
    },
    {
        stage: 3,
        question: `Négyzet alapú hasáb: alapél 6 cm, magasság 8 cm.
A testátló és az alaplap szöge fokban, 3 tizedesjeggyel?`,
        answer: 43.314,
        type: 'multiplication',
        expression: `arctan(8/(6√2)) ≈ 43,314°`,
    },
    {
        stage: 3,
        question: `Kocka testátlója milyen szöget zár be egy éllel? Fokban, 3 tizedesjeggyel!`,
        answer: 54.736,
        type: 'multiplication',
        expression: `arccos(1/√3) ≈ 54,736°`,
    },
    {
        stage: 3,
        question: `Téglatest élei 4, 6, 12 cm. A testátló és a 12 cm-es él szöge fokban, 3 tizedesjeggyel?`,
        answer: 31.003,
        type: 'multiplication',
        expression: `arccos(12/√(16+36+144)) = arccos(12/14) ≈ 31,003°`,
    },
    {
        stage: 3,
        question: `8 cm élű kocka egyik csúcsa és a szemközti lap síkja közti távolság?`,
        answer: 8,
        type: 'multiplication',
        expression: `8 cm`,
    },
    {
        stage: 3,
        question: `5, 12, 13 cm élű téglatest két szemközti csúcsa közti távolság.
Add meg 3 tizedesjeggyel!`,
        answer: 18.385,
        type: 'multiplication',
        expression: `√338 ≈ 18,385`,
    },
    {
        stage: 3,
        question: `Szabályos négyzet alapú gúla: alapél 10 cm, magasság 12 cm.
Az oldalél hossza 3 tizedesjeggyel?`,
        answer: 13.928,
        type: 'multiplication',
        expression: `√194 ≈ 13,928`,
    },
    {
        stage: 3,
        question: `Az előző gúlában határozd meg az oldallap magasságát!`,
        answer: 13,
        type: 'multiplication',
        expression: `13 cm`,
    },
    {
        stage: 3,
        question: `Szabályos tetraéder élhossza 6 cm. A magasság 3 tizedesjeggyel?`,
        answer: 4.899,
        type: 'multiplication',
        expression: `2√6 ≈ 4,899`,
    },
    {
        stage: 3,
        question: `Szabályos tetraéder élhossza 6 cm. A térfogat 3 tizedesjeggyel?`,
        answer: 25.456,
        type: 'multiplication',
        expression: `18√2 ≈ 25,456`,
    },
    {
        stage: 3,
        question: `6 cm élű kockában a lapátlókból álló egyenlő oldalú metszetháromszög területe 3 tizedesjeggyel?`,
        answer: 31.177,
        type: 'multiplication',
        expression: `18√3 ≈ 31,177`,
    },
    {
        stage: 3,
        question: `8 cm élű kocka egy csúcsából induló három él felezőpontjait összekötjük.
A háromszög területe 3 tizedesjeggyel?`,
        answer: 13.856,
        type: 'multiplication',
        expression: `8√3 ≈ 13,856`,
    },
    {
        stage: 3,
        question: `Henger r = 4 cm, h = 10 cm, tengelyen átmenő síkmetszet területe?`,
        answer: 80,
        type: 'multiplication',
        expression: `8 · 10 = 80`,
    },
    {
        stage: 3,
        question: `Kúp r = 5 cm, h = 12 cm, tengelyen átmenő síkmetszet területe?`,
        answer: 60,
        type: 'multiplication',
        expression: `5 · 12 = 60`,
    },
    {
        stage: 3,
        question: `7 cm sugarú gömböt a középpontján át síkkal metszünk.
A metszet területe kπ. Add meg k-t!`,
        answer: 49,
        type: 'multiplication',
        expression: `49π`,
    },
    {
        stage: 3,
        question: `5 cm sugarú gömböt a középponttól 3 cm-re síkkal metszünk.
Határozd meg a metszet sugarát!`,
        answer: 4,
        type: 'multiplication',
        expression: `r = 4, T = 16π`,
    },
    {
        stage: 3,
        question: `Henger r = 5 cm, h = 12 cm. Alsó alapkör pontja és a felső átellenes pont távolsága, 3 tizedesjeggyel?`,
        answer: 15.62,
        type: 'multiplication',
        expression: `2√61 ≈ 15,620`,
    },
    {
        stage: 3,
        question: `Kúp r = 5 cm, h = 12 cm. Az alkotó és az alaplap szöge fokban, 3 tizedesjeggyel?`,
        answer: 67.38,
        type: 'multiplication',
        expression: `arcsin(12/13) ≈ 67,380°`,
    },

    // —— 4. szint ——
    {
        stage: 4,
        question: `Kocka élét 20%-kal megnöveljük. Hány százalékkal nő a térfogata?`,
        answer: 72.8,
        type: 'multiplication',
        expression: `Felszín +44%, térfogat +72,8%`,
    },
    {
        stage: 4,
        question: `Gömb sugarát 10%-kal csökkentjük. Hány százalékkal csökken a térfogata?`,
        answer: 27.1,
        type: 'multiplication',
        expression: `Felszín −19%, térfogat −27,1%`,
    },
    {
        stage: 4,
        question: `Két hasonló test térfogataránya 64 : 125. A felszínarány 16 : k. Add meg k-t!`,
        answer: 25,
        type: 'multiplication',
        expression: `Hossz 4 : 5, felszín 16 : 25`,
    },
    {
        stage: 4,
        question: `Két hasonló kúp magassága 6 cm és 15 cm. A nagyobb térfogata 1000 cm³.
Mennyi a kisebb térfogata?`,
        answer: 64,
        type: 'multiplication',
        expression: `1000 · (6/15)³ = 64`,
    },
    {
        stage: 4,
        question: `Zárt henger V = 128π. A minimális felszínű henger sugara?`,
        answer: 4,
        type: 'multiplication',
        expression: `r = 4, h = 8`,
    },
    {
        stage: 4,
        question: `Felül nyitott henger V = 125π. A minimális anyagfelületű henger sugara?`,
        answer: 5,
        type: 'multiplication',
        expression: `r = h = 5`,
    },
    {
        stage: 4,
        question: `Felül nyitott négyzet alapú hasáb V = 108. A minimális felszínű doboz alapéle?`,
        answer: 6,
        type: 'multiplication',
        expression: `a = 6, h = 3`,
    },
    {
        stage: 4,
        question: `Zárt négyzet alapú hasáb V = 216. A minimális felszínű test éle?`,
        answer: 6,
        type: 'multiplication',
        expression: `6 × 6 × 6`,
    },
    {
        stage: 4,
        question: `Forgáskúp alkotója 10 cm. A maximális térfogatú kúp magassága 3 tizedesjeggyel?`,
        answer: 5.774,
        type: 'multiplication',
        expression: `h = 10/√3 ≈ 5,774`,
    },
    {
        stage: 4,
        question: `5 cm sugarú gömbbe írt maximális térfogatú henger sugara 3 tizedesjeggyel?`,
        answer: 4.082,
        type: 'multiplication',
        expression: `r = 5√(2/3) ≈ 4,082, h = 10/√3`,
    },
    {
        stage: 4,
        question: `20×20 cm-es karton sarkaiból x oldalú négyzeteket vágunk. Maximális doboztérfogatnál x?

Add meg 3 tizedesjeggyel!`,
        answer: 3.333,
        type: 'multiplication',
        expression: `x = 10/3`,
    },
    {
        stage: 4,
        question: `Felül nyitott négyzet alapú doboz: alj 4 tallér/dm², oldal 3 tallér/dm², keret 300 tallér.
A maximális térfogatú doboz alapéle dm-ben?`,
        answer: 5,
        type: 'multiplication',
        expression: `a = 5, h = 10/3`,
    },
    {
        stage: 4,
        question: `Felül nyitott henger: alj költsége kétszerese az oldalfalénak, összesen 72π.
A maximális térfogatú henger sugara 3 tizedesjeggyel?`,
        answer: 3.464,
        type: 'multiplication',
        expression: `r = 2√3 ≈ 3,464, h = 4√3`,
    },
    {
        stage: 4,
        question: `Téglatest: a + b + c = 18. Mekkora lehet legfeljebb a térfogata?`,
        answer: 216,
        type: 'multiplication',
        expression: `Kocka, 6³ = 216`,
    },
    {
        stage: 4,
        question: `Téglatest összes élének hossza 72 cm. A lehető legnagyobb térfogat?`,
        answer: 216,
        type: 'multiplication',
        expression: `4(a+b+c)=72 → a=b=c=6, V=216`,
    },
    {
        stage: 4,
        question: `Zárt henger felszíne 150π. A maximális térfogatú henger sugara?`,
        answer: 5,
        type: 'multiplication',
        expression: `r = 5, h = 10`,
    },
    {
        stage: 4,
        question: `12 cm élű kockába írt gömb és a kocka térfogataránya. Add meg 3 tizedesjeggyel!`,
        answer: 0.524,
        type: 'multiplication',
        expression: `π/6 ≈ 0,524`,
    },
    {
        stage: 4,
        question: `Minden lineáris méretet kétszeresére növelünk. Hányszorosára nő a térfogat?`,
        answer: 8,
        type: 'multiplication',
        expression: `Felszín 4-szeres, térfogat 8-szoros`,
    },
    {
        stage: 4,
        question: `12 cm magas kúp, a levágott kisebb kúp térfogata az eredeti fele.
A metszősík csúcstól mért távolsága 3 tizedesjeggyel?`,
        answer: 9.524,
        type: 'multiplication',
        expression: `12 / ∛2 ≈ 9,524`,
    },
    {
        stage: 4,
        question: `10 cm sugarú gömb, metszet területe 64π. A sík távolsága a középponttól?`,
        answer: 6,
        type: 'multiplication',
        expression: `√(100−64) = 6`,
    },

    // —— 5. szint ——
    {
        stage: 5,
        question: `200 literes, 80 cm magas, felül nyitott hordó, 12% hulladék.
A megvásárolandó lemez m²-ben, 3 tizedesjeggyel?`,
        answer: 1.895,
        type: 'multiplication',
        expression: `r ≈ 0,282 m; lemez ≈ 1,895 m²`,
    },
    {
        stage: 5,
        question: `200 literes felül nyitott hengerek közül a minimális felszínű sugara méterben, 3 tizedesjeggyel?`,
        answer: 0.399,
        type: 'multiplication',
        expression: `r = h ≈ 0,399 m`,
    },
    {
        stage: 5,
        question: `Festőhenger r = 2 cm, szélesség 20 cm, fordulatonként 3 ml. Elegendő-e 4 liter 40 m²-hez?
(1 = igen, 0 = nem)`,
        answer: 0,
        type: 'multiplication',
        expression: `Nem; kb. 4,775 liter kell`,
    },
    {
        stage: 5,
        question: `16 cm belső átmérőjű vödörbe 4 liter festék. Milyen magasan áll? 1 tizedesjeggyel, cm-ben!`,
        answer: 19.9,
        type: 'multiplication',
        expression: `4000/(64π) ≈ 19,9`,
    },
    {
        stage: 5,
        question: `Két lyukas gyűrű együtt 16 g, sűrűség 15 g/cm³. Azonos szélesség mm-ben, 2 tizedesjeggyel?`,
        answer: 5.48,
        type: 'multiplication',
        expression: `≈ 5,48 mm`,
    },
    {
        stage: 5,
        question: `2 m hosszú cső, külső r = 5 cm, belső r = 4 cm, sűrűség 7,8 g/cm³.
Tömeg kg-ban, 1 tizedesjeggyel?`,
        answer: 44.1,
        type: 'multiplication',
        expression: `≈ 44,1 kg`,
    },
    {
        stage: 5,
        question: `7 m × 4 m tető, 15 mm csapadék, 95% négy hordóba (átmérő 40 cm).
A víz magassága a hordókban cm-ben, 1 tizedesjeggyel?`,
        answer: 79.4,
        type: 'multiplication',
        expression: `≈ 79,4 cm`,
    },
    {
        stage: 5,
        question: `Raktér 2,4 × 2 × 7 m, 86 darab 24 cm átmérőjű, 7 m-es rönk.
Hány százalék marad üresen? 2 tizedesjeggyel!`,
        answer: 18.95,
        type: 'multiplication',
        expression: `≈ 18,95%`,
    },
    {
        stage: 5,
        question: `2 dl-es pohár 60%-a 0,1 mm sugarú homokszem. Hány millió darab, 2 tizedesjeggyel?`,
        answer: 28.65,
        type: 'multiplication',
        expression: `≈ 28,65 millió`,
    },
    {
        stage: 5,
        question: `Homokkupac: alkotó 1,8 m, alapátmérő 3,1 m. Térfogat m³-ben, 3 tizedesjeggyel?`,
        answer: 2.302,
        type: 'multiplication',
        expression: `h ≈ 0,915 m, V ≈ 2,302 m³`,
    },
    {
        stage: 5,
        question: `1,8 m alkotójú kúpok közül a maximális térfogat m³-ben, 3 tizedesjeggyel?`,
        answer: 2.351,
        type: 'multiplication',
        expression: `r ≈ 1,470, h ≈ 1,039, V ≈ 2,351`,
    },
    {
        stage: 5,
        question: `1000 cm³ zárt doboz: alj/tető 0,2 Ft/cm², oldal 0,1 Ft/cm².
A minimális anyagköltség forintban?`,
        answer: 70,
        type: 'multiplication',
        expression: `r ≈ 4,3, h ≈ 17,2, K ≈ 70`,
    },
    {
        stage: 5,
        question: `4000 cm³ felül nyitott négyzet alapú edény, magasság 6,4 cm.
A zománcozandó felület cm²-ben?`,
        answer: 1265,
        type: 'multiplication',
        expression: `a = 25, A = 1265`,
    },
    {
        stage: 5,
        question: `4000 cm³ felül nyitott négyzet alapú edények közül a minimális felületű alapél cm-ben?`,
        answer: 20,
        type: 'multiplication',
        expression: `a = 20, h = 10`,
    },
    {
        stage: 5,
        question: `12 konzerv, r = 4 cm, h = 12 cm, 3×4-es elrendezés téglatest dobozban.
A konzervek a doboz hány százalékát töltik ki? 2 tizedesjeggyel!`,
        answer: 78.54,
        type: 'multiplication',
        expression: `π/4 · 100% ≈ 78,54%`,
    },
    {
        stage: 5,
        question: `Nyeregtető: hossz 10 m, szélesség 8 m, gerinc 3 m-rel az eresznél magasabb.
A két tetősík területe m²-ben?`,
        answer: 100,
        type: 'multiplication',
        expression: `2 · 10 · 5 = 100`,
    },
    {
        stage: 5,
        question: `Szabályos háromszög alapú vályú: alapél 38 cm, hossz 72 cm.
Hány liter a térfogata? 1 tizedesjeggyel!`,
        answer: 45,
        type: 'multiplication',
        expression: `≈ 45,0 liter`,
    },
    {
        stage: 5,
        question: `Csonkakúp: R = 20 cm, r = 15 cm, h = 30 cm. Térfogat literben, 2 tizedesjeggyel?`,
        answer: 29.06,
        type: 'multiplication',
        expression: `9,25π ≈ 29,06 liter`,
    },
    {
        stage: 5,
        question: `Szabályos háromoldalú gúla: alapél 6 cm, oldalélek 30°-os szöget zárnak az alappal.
Határozd meg a magasságot!`,
        answer: 2,
        type: 'multiplication',
        expression: `h = 2, V = 6√3`,
    },
    {
        stage: 5,
        question: `30×20 cm-es karton sarkaiból 3 cm-es négyzeteket vágunk. A doboz térfogata cm³-ben?`,
        answer: 1008,
        type: 'multiplication',
        expression: `24 · 14 · 3 = 1008`,
    },

    // —— 6. szint ——
    {
        stage: 6,
        question: `Kocka és gömb felszíne egyenlő. A gömb/kocka térfogatarány 3 tizedesjeggyel?
(√(6/π))`,
        answer: 1.382,
        type: 'multiplication',
        expression: `√(6/π) ≈ 1,382 > 1`,
    },
    {
        stage: 6,
        question: `Két kocka összeolvasztásával készült új kocka felszíne kisebb-e az eredetiek összegénél?
(1 = igen, 0 = nem)`,
        answer: 1,
        type: 'multiplication',
        expression: `Igaz`,
    },
    {
        stage: 6,
        question: `Rögzített l alkotó mellett a maximális térfogatú kúpra h/l értéke 3 tizedesjeggyel?`,
        answer: 0.577,
        type: 'multiplication',
        expression: `h = l/√3, r = l√(2/3)`,
    },
    {
        stage: 6,
        question: `Rögzített térfogatú, felül nyitott henger minimális felszínénél h/r = ?`,
        answer: 1,
        type: 'multiplication',
        expression: `h = r`,
    },
    {
        stage: 6,
        question: `Rögzített térfogatú zárt henger minimális felszínénél h/r = ?`,
        answer: 2,
        type: 'multiplication',
        expression: `h = 2r`,
    },
    {
        stage: 6,
        question: `Rögzített térfogatú, felül nyitott négyzet alapú hasáb minimális felszínénél h/a = ?`,
        answer: 0.5,
        type: 'multiplication',
        expression: `h = a/2`,
    },
    {
        stage: 6,
        question: `Rögzített térfogatú zárt négyzet alapú hasáb minimális felszíne a kocka. Ekkor h/a = ?`,
        answer: 1,
        type: 'multiplication',
        expression: `h = a`,
    },
    {
        stage: 6,
        question: `Téglatest V = 72 dm³, egyik él kétszerese egy másiknak. A minimális felszín dm²-ben?`,
        answer: 108,
        type: 'multiplication',
        expression: `3, 6, 4 dm; A = 108`,
    },
    {
        stage: 6,
        question: `5 cm sugarú gömbbe írt maximális térfogatú henger térfogata kπ/(3√3).
Add meg k-t!`,
        answer: 500,
        type: 'multiplication',
        expression: `Vmax = 500π/(3√3)`,
    },
    {
        stage: 6,
        question: `24×24 cm-es karton sarkaiból négyzeteket vágunk. A maximális doboztérfogat cm³-ben?`,
        answer: 1024,
        type: 'multiplication',
        expression: `x = 4, V = 1024`,
    },
    {
        stage: 6,
        question: `30×18 cm-es karton. A maximális térfogatot adó x 3 tizedesjeggyel?`,
        answer: 3.641,
        type: 'multiplication',
        expression: `x = 8−√19 ≈ 3,641`,
    },
    {
        stage: 6,
        question: `12 cm magas kúp, a kisebb kúp és a csonkakúp térfogata egyenlő.
A metszősík csúcstól mért távolsága 3 tizedesjeggyel?`,
        answer: 9.524,
        type: 'multiplication',
        expression: `12 / ∛2 ≈ 9,524`,
    },
    {
        stage: 6,
        question: `10 cm sugarú gömb, metszet 64π. A sík távolsága a középponttól?`,
        answer: 6,
        type: 'multiplication',
        expression: `6 cm`,
    },
    {
        stage: 6,
        question: `Kúp r = 6 cm, h = 8 cm. A beírt gömb sugara?`,
        answer: 3,
        type: 'multiplication',
        expression: `r = 3`,
    },
    {
        stage: 6,
        question: `Szabályos négyzet alapú gúla: alapél 10 cm, magasság 12 cm. Beírt gömb sugara 3 tizedesjeggyel?`,
        answer: 3.333,
        type: 'multiplication',
        expression: `10/3 ≈ 3,333`,
    },
    {
        stage: 6,
        question: `Szabályos tetraéder élhossza 6 cm. A beírt gömb sugara 3 tizedesjeggyel?`,
        answer: 1.225,
        type: 'multiplication',
        expression: `√6/2 ≈ 1,225; körülírt 3√6/2`,
    },
    {
        stage: 6,
        question: `a élű kockába írt és köré írt gömb térfogataránya (kisebb/nagyobb) 3 tizedesjeggyel?`,
        answer: 0.192,
        type: 'multiplication',
        expression: `1 : 3√3 → 1/(3√3) ≈ 0,192`,
    },
    {
        stage: 6,
        question: `Gömb köré a lehető legszorosabban hengert írunk. A gömb a henger térfogatának hányada?

Add meg 3 tizedesjeggyel!`,
        answer: 0.667,
        type: 'multiplication',
        expression: `2/3 ≈ 0,667`,
    },
    {
        stage: 6,
        question: `R sugarú gömbbe írt maximális térfogatú hengerre h/R értéke 3 tizedesjeggyel?`,
        answer: 1.155,
        type: 'multiplication',
        expression: `h = 2R/√3, r = R√(2/3)`,
    },
    {
        stage: 6,
        question: `Adott összes élhosszúságú téglatestek közül a kocka térfogata a legnagyobb.
Igaz-e? (1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `Maximum ha a = b = c`,
    },
];
