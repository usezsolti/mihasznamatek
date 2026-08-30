/**
 * Generates utils/game/kombinatorikaLevels.ts — 6 × 20 single-answer combinatorics tasks.
 * Source: Kombinatorika.pdf (MIHASZNAMATEK, 6 szint).
 * Run: node scripts/gen-kombinatorika-levels.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function item(stage, body, answer, expression) {
  return [
    '    {',
    `        stage: ${stage},`,
    `        question: \`${esc(body)}\`,`,
    `        answer: ${Number(answer)},`,
    `        type: 'multiplication',`,
    `        expression: \`${esc(expression)}\`,`,
    '    },',
  ].join('\n');
}

const levels = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
const add = (stage, body, answer, expression) => {
  levels[stage].push(item(stage, body, answer, expression));
};

const q = (text) => `${text}\n\nAdd meg a darabszámot!`;

// ===== 1. szint — Alapvető összeszámlálás =====
add(1, q('Egy ruhatárban 5 különböző póló és 4 különböző nadrág van.\nHányféle póló–nadrág összeállítás választható?'), 20, '5 · 4 = 20');
add(1, q('Egy étteremben 4 leves és 6 főétel közül választunk egy-egyet.\nHányféle ebéd állítható össze?'), 24, '4 · 6 = 24');
add(1, q('Egy utazás első szakaszára 3, a másodikra 5, a harmadikra 2 különböző útvonal közül választhatunk.\nHányféle teljes útvonal lehetséges?'), 30, '3 · 5 · 2 = 30');
add(1, q('Hat különböző tanuló hányféle sorrendben állhat egymás mellé?'), 720, '6! = 720');
add(1, q('Hét különböző könyvet hányféle sorrendben lehet egy polcra helyezni?'), 5040, '7! = 5040');
add(1, q('Nyolc futó indul egy versenyen.\nHányféle befutási sorrend lehetséges, ha nincs holtverseny?'), 40320, '8! = 40320');
add(1, q('Az A, B, C, D, E betűket mind felhasználva hány különböző ötbetűs sorrend készíthető?'), 120, '5! = 120');
add(1, q('Az 1, 2, 3, 4, 5, 6 számjegyek mindegyikét pontosan egyszer felhasználva hány hatjegyű szám képezhető?'), 720, '6! = 720');
add(1, q('Nyolc különböző betűből hány hárombetűs jelszó készíthető, ha egy betű legfeljebb egyszer szerepelhet?'), 336, '8 · 7 · 6 = 336');
add(1, q('Hány négyjegyű PIN-kód készíthető a 0, 1, …, 9 számjegyekből, ha ismétlés megengedett?'), 10000, '10^4 = 10000');
add(1, q('Hány 6 karakter hosszú 0-1 sorozat létezik?'), 64, '2^6 = 64');
add(1, q('Egy teszt 4 kérdésből áll, mindegyikhez 5 válaszlehetőség tartozik.\nHányféleképpen tölthető ki a teszt, ha minden kérdésre pontosan egy választ jelölünk?'), 625, '5^4 = 625');
add(1, q('Egy 12 fős csoportból hányféleképpen választható ki egy csoportvezető?'), 12, '12');
add(1, q('Egy 12 fős csoportból hányféleképpen választható ki egy csoportvezető és egy helyettes, ha a két tisztséget különböző személy tölti be?'), 132, '12 · 11 = 132');
add(1, q('Egy polcon 8 matematikakönyv és 7 fizikakönyv van.\nHányféleképpen választhatunk ki pontosan egy könyvet?'), 15, '8 + 7 = 15');
add(1, q('Kilenc könyv közül választunk egyet, majd három különböző toll közül egyet.\nHányféle választás lehetséges?'), 27, '9 · 3 = 27');
add(1, q('Hét különböző ember áll sorba.\nHány sorrendben állhatnak, ha Anna biztosan az első helyen áll?'), 720, '6! = 720');
add(1, q('Hét különböző ember áll sorba.\nHány sorrendben állhatnak, ha Anna biztosan az utolsó helyen áll?'), 720, '6! = 720');
add(1, q('Hét különböző ember áll sorba.\nHány sorrendben állhatnak, ha Anna vagy az első, vagy az utolsó helyen áll?'), 1440, '2 · 6! = 1440');
add(1, q('Hat különböző ember áll sorba.\nHány sorrendben előzi meg Anna Bélát?'), 360, '6! / 2 = 360');

// ===== 2. szint — Variáció és kombináció =====
add(2, q('Nyolc tanuló közül hányféleképpen választhatunk ki háromfős csapatot?'), 56, 'C(8,3) = 56');
add(2, q('Tíz ember közül hányféleképpen választható ki egy 4 fős bizottság?'), 210, 'C(10,4) = 210');
add(2, q('Hét tanulóból háromfős csapatot választunk, majd a három tag közül kijelöljük a csapatkapitányt.\nHány lehetőség van?'), 105, 'C(7,3) · 3 = 105');
add(2, q('Tíz versenyző közül arany-, ezüst- és bronzérmest választunk.\nHányféle eredmény lehetséges?'), 720, '10 · 9 · 8 = 720');
add(2, q('Hét különböző jelből négykarakteres kódot készítünk ismétlés nélkül.\nHány különböző kód készíthető?'), 840, '7 · 6 · 5 · 4 = 840');
add(2, q('A 0, 1, …, 8 számjegyekből hány különböző számjegyekből álló ötjegyű szám készíthető?'), 13440, '8 · 8 · 7 · 6 · 5 = 13440');
add(2, q('Hat fiú és öt lány közül két fiút és két lányt választunk ki.\nHányféle csoport lehetséges?'), 150, 'C(6,2) · C(5,2) = 150');
add(2, q('Kilenc emberből négyfős bizottságot választunk úgy, hogy Anna biztosan tagja legyen.\nHány lehetőség van?'), 56, 'C(8,3) = 56');
add(2, q('Kilenc emberből négyfős bizottságot választunk úgy, hogy Anna ne legyen tag.\nHány lehetőség van?'), 70, 'C(8,4) = 70');
add(2, q('Tíz emberből négyfős bizottságot választunk.\nHány olyan bizottság van, amely Anna és Béla közül pontosan az egyiket tartalmazza?'), 112, '2 · C(8,3) = 112');
add(2, q('Tizenegy emberből ötfős bizottságot választunk.\nHány olyan bizottság van, amely Anna és Béla közül legalább az egyiket tartalmazza?'), 336, 'C(11,5) − C(9,5) = 336');
add(2, q('Nyolc futó befutási sorrendjét vizsgáljuk.\nHány olyan sorrend van, amelyben Anna az első három hely valamelyikén végez?'), 15120, '3 · 7! = 15120');
add(2, q('Hét különböző ember áll sorba.\nHány sorrendben áll Anna és Béla egymás mellett?'), 1440, '2 · 6! = 1440');
add(2, q('Hét különböző ember áll sorba.\nHány sorrendben nem áll Anna és Béla egymás mellett?'), 3600, '7! − 2 · 6! = 3600');
add(2, q('Nyolc különböző könyvet helyezünk polcra.\nHány sorrendben kerül három előre kijelölt könyv egymás mellé?'), 4320, '3! · 6! = 4320');
add(2, q('Nyolc különböző könyvet helyezünk polcra.\nHány olyan sorrend van, amelyben három előre kijelölt könyv egymáshoz viszonyított sorrendje A-B-C?'), 6720, '8! / 3! = 6720');
add(2, q('Tizenkét különböző pont közül hány szakasz határozható meg?'), 66, 'C(12,2) = 66');
add(2, q('Kilenc, három egyenesre nem illeszkedő pont közül hány háromszög választható ki?'), 84, 'C(9,3) = 84');
add(2, q('Két párhuzamos egyenesen 6, illetve 5 kijelölt pont van.\nHány olyan egyenes húzható, amely mindkét megadott egyenesen pontosan egy kijelölt ponton halad át?'), 30, '6 · 5 = 30');
add(2, q('Tíz emberből négyfős csoportot választunk.\nAnna és Béla vagy mindketten legyenek benne, vagy egyikük se.\nHány csoport lehetséges?'), 98, 'C(8,2) + C(8,4) = 98');

// ===== 3. szint — Ismétléses elrendezések és kötött sorrendek =====
add(3, q('Hány különböző sorrendben írhatók le a BANANA szó betűi?'), 60, '6! / (3! · 2!) = 60');
add(3, q('Hány különböző sorrendben írhatók le a MATEMATIKA szó betűi?'), 151200, '10! / (3! · 2! · 2!) = 151200');
add(3, q('Hány különböző sorrendben írhatók le a MISSISSIPPI szó betűi?'), 34650, '11! / (4! · 4! · 2!) = 34650');
add(3, q('Nyolc különböző ember áll sorba.\nHány sorrendben áll három előre kijelölt személy egymás mellett?'), 4320, '3! · 6! = 4320');
add(3, q('Nyolc különböző ember áll sorba.\nHány sorrendben van Anna és Béla között pontosan két ember?'), 7200, '5 · 2 · 6! = 7200');
add(3, q('Hét különböző ember áll sorba.\nHány sorrendben szerepel Anna Béla előtt, Béla pedig Csaba előtt?'), 840, '7! / 3! = 840');
add(3, q('Kilenc különböző ember áll sorba.\nHány sorrendben nem áll Anna és Béla egymás mellett?'), 282240, '9! − 2 · 8! = 282240');
add(3, q('Hány 6 karakteres 0-1 sorozatban van pontosan két darab 1?'), 15, 'C(6,2) = 15');
add(3, q('Hány 10 karakteres 0-1 sorozatban van pontosan négy darab 1?'), 210, 'C(10,4) = 210');
add(3, q('Hány 8 karakteres, 0, 1, 2 jelekből álló sorozatban van 3 darab 0, 2 darab 1 és 3 darab 2?'), 560, '8! / (3! · 2! · 3!) = 560');
add(3, q('Az A, B, C betűkből hatbetűs szót készítünk ismétléssel.\nHány olyan szó van, amelyben pontosan két A szerepel?'), 240, 'C(6,2) · 2^4 = 240');
add(3, q('Az A, B, C, D betűkből hétbetűs szót készítünk ismétléssel.\nHány olyan szó van, amelyben pontosan egy D szerepel?'), 5103, '7 · 3^6 = 5103');
add(3, q('Az A, B, C, D betűkből hatbetűs szót készítünk ismétléssel.\nHány olyan szó van, amelyben mind a négy betű legalább egyszer szerepel?'), 1560, '4^6 − 4·3^6 + 6·2^6 − 4 = 1560');
add(3, q('Ötjegyű kódot készítünk a 0, 1, …, 9 számjegyekből ismétléssel.\nHány olyan kód van, amelyben pontosan két darab 7 szerepel?'), 7290, 'C(5,2) · 9^3 = 7290');
add(3, q('Öt fiú és négy lány ül egymás mellé úgy, hogy a fiúk és lányok felváltva követik egymást.\nHány ülésrend lehetséges?'), 2880, '5! · 4! = 2880');
add(3, q('Négy fiú és négy lány ül egymás mellé úgy, hogy a fiúk és lányok felváltva követik egymást.\nHány ülésrend lehetséges?'), 1152, '2 · 4! · 4! = 1152');
add(3, q('Hat különböző ember ül egy kerek asztal köré.\nHány különböző ülésrend lehetséges, ha az elforgatással egymásba vihető elrendezéseket azonosnak tekintjük?'), 120, '5! = 120');
add(3, q('Hét különböző ember ül egy kerek asztal köré.\nHány ülésrendben ül Anna és Béla egymás mellett?'), 240, '2 · 5! = 240');
add(3, q('Hét különböző ember ül egy kerek asztal köré.\nHány ülésrendben nem ül Anna és Béla egymás mellett?'), 480, '6! − 2 · 5! = 480');
add(3, q('Nyolc különböző embert négy, sorrend nélküli párba osztunk.\nHány különböző párosítás lehetséges?'), 105, '7 · 5 · 3 · 1 = 105');

// ===== 4. szint — Elosztások, ismétléses kombináció =====
add(4, q('Tíz egyforma golyót osztunk szét négy megkülönböztetett doboz között.\nEgy doboz üres is maradhat.\nHány szétosztás lehetséges?'), 286, 'C(13,3) = 286');
add(4, q('Tíz egyforma golyót osztunk szét négy megkülönböztetett doboz között úgy, hogy mindegyik dobozba kerüljön legalább egy golyó.\nHány szétosztás lehetséges?'), 84, 'C(9,3) = 84');
add(4, q('Tizenkét egyforma golyót osztunk szét három megkülönböztetett doboz között úgy, hogy mindegyik dobozba legalább két golyó kerüljön.\nHány szétosztás lehetséges?'), 28, 'C(8,2) = 28');
add(4, q('Tizenöt egyforma érmét osztunk szét öt ember között úgy, hogy mindenki kapjon legalább egyet.\nHányféle elosztás van?'), 1001, 'C(14,4) = 1001');
add(4, q('Hány nemnegatív egész megoldása van az\nx + y + z = 10\negyenletnek?'), 66, 'C(12,2) = 66');
add(4, q('Hány pozitív egész megoldása van az\nx + y + z = 10\negyenletnek?'), 36, 'C(9,2) = 36');
add(4, q('Hány nemnegatív egész megoldása van\nx₁ + x₂ + x₃ + x₄ = 8\negyenletnek, ha x₁ ≥ 2?'), 84, 'C(9,3) = 84');
add(4, q('Hány nemnegatív egész megoldása van\nx + y + z = 12\negyenletnek, ha x ≤ 4?'), 55, 'C(14,2) − C(9,2) = 55');
add(4, q('Négyféle fagylaltból összesen 6 gombócot választunk.\nA sorrend nem számít, egy ízből többet is kérhetünk.\nHányféle választás lehetséges?'), 84, 'C(9,6) = 84');
add(4, q('Ötféle tárgytípusból összesen 8 darabot választunk.\nEgy típusból tetszőlegesen sok választható, a sorrend nem számít.\nHány lehetőség van?'), 495, 'C(12,8) = 495');
add(4, q('Nyolc különböző ajándék mindegyikét a három megkülönböztetett gyerek valamelyikének adjuk.\nHány elosztás lehetséges, ha valaki akár egyet sem kaphat?'), 6561, '3^8 = 6561');
add(4, q('Nyolc különböző ajándékot három megkülönböztetett gyerek között osztunk szét úgy, hogy mindenki kapjon legalább egyet.\nHány elosztás lehetséges?'), 5796, '3^8 − 3·2^8 + 3 = 5796');
add(4, q('Hat különböző ajándékot három megkülönböztetett gyerek között osztunk szét úgy, hogy mindenki kapjon legalább egyet.\nHány elosztás lehetséges?'), 540, '3^6 − 3·2^6 + 3 = 540');
add(4, q('Hat megkülönböztetett helyet négy színnel színezünk.\nHány olyan színezés van, amelyben pontosan három különböző szín fordul elő?'), 2160, 'C(4,3) · (3^6 − 3·2^6 + 3) = 2160');
add(4, q('Tíz egymás melletti helyre négy piros, három kék és három zöld jelölést helyezünk el.\nAz azonos színű jelöléseket nem különböztetjük meg.\nHány sorrend lehetséges?'), 4200, '10! / (4! · 3! · 3!) = 4200');
add(4, q('Kilenc helyre három azonos piros, két azonos kék és négy azonos zöld korongot teszünk.\nHány különböző sorrend lehetséges?'), 1260, '9! / (3! · 2! · 4!) = 1260');
add(4, q('Hány 12 karakteres szó készíthető 5 darab A, 4 darab B és 3 darab C betűből?'), 27720, '12! / (5! · 4! · 3!) = 27720');
add(4, q('Kilenc különböző ember ül kör alakú asztalhoz.\nHány ülésrendben ül három előre kijelölt személy egymás mellett?'), 4320, '6! · 3! = 4320');
add(4, q('Nyolc különböző ember ül kör alakú asztalhoz.\nHány ülésrendben nem ül Anna és Béla egymás mellett?'), 3600, '7! − 2 · 6! = 3600');
add(4, q('Öt szín közül pontosan hármat felhasználva színezünk ki hét megkülönböztetett helyet úgy, hogy mindhárom kiválasztott szín legalább egyszer előforduljon.\nHány színezés lehetséges?'), 18060, 'C(5,3) · (3^7 − 3·2^7 + 3) = 18060');

// ===== 5. szint — Összetett korlátozott kombinatorika =====
add(5, q('Hat különböző levelet hat megcímzett borítékba teszünk, mindegyik borítékba egyet.\nHány olyan elhelyezés van, amelyben egyetlen levél sem kerül a saját borítékjába?'), 265, 'D₆ = 265');
add(5, q('Hét különböző levelet hét megcímzett borítékba teszünk, mindegyik borítékba egyet.\nHány olyan elhelyezés van, amelyben egyetlen levél sem kerül a saját borítékjába?'), 1854, 'D₇ = 1854');
add(5, q('Nyolc különböző ember áll sorba.\nHány sorrendben teljesül, hogy Anna, Béla és Csaba közül egyik kettő sem áll egymás mellett?'), 14400, 'megoldókulcs: 14400');
add(5, q('Öt fiú és öt lány áll sorba.\nHány olyan sorrend van, amelyben két lány soha nem áll egymás mellett?'), 86400, 'megoldókulcs: 86400');
add(5, q('Hat fiú és négy lány áll sorba.\nHány olyan sorrend van, amelyben két lány soha nem áll egymás mellett?'), 604800, 'megoldókulcs: 604800');
add(5, q('Tíz különböző könyvet helyezünk polcra.\nHány olyan sorrend van, amelyben négy előre kijelölt könyv egymáshoz viszonyított sorrendje rögzített?'), 151200, '10! / 4! = 151200');
add(5, q('Tíz futó befutási sorrendjét vizsgáljuk.\nHány olyan sorrend van, amelyben Anna, Béla és Csaba mind az első öt hely valamelyikén végez?'), 302400, 'megoldókulcs: 302400');
add(5, q('Kilenc különböző ember ül kör alakú asztalhoz.\nHány ülésrendben ül Anna, Béla és Csaba három egymást követő helyen?'), 4320, 'megoldókulcs: 4320');
add(5, q('Kilenc különböző ember ül kör alakú asztalhoz.\nHány ülésrendben nem ül Anna és Béla egymás mellett?'), 30240, 'megoldókulcs: 30240');
add(5, q('Tíz különböző embert öt, sorrend nélküli párba osztunk.\nHány különböző párosítás lehetséges?'), 945, '9 · 7 · 5 · 3 · 1 = 945');
add(5, q('Tizenkét különböző embert három, egymástól meg nem különböztetett 4 fős csapatra osztunk.\nHány felosztás lehetséges?'), 5775, '12! / ((4!)^3 · 3!) = 5775');
add(5, q('Tíz különböző embert egy 2, egy 3 és egy 5 fős csapatra osztunk.\nHány felosztás lehetséges?'), 2520, 'C(10,2) · C(8,3) = 2520');
add(5, q('Nyolc emberből négyfős bizottságot választunk, majd a bizottságon belül külön elnököt és titkárt választunk.\nHány lehetőség van?'), 840, 'C(8,4) · 4 · 3 = 840');
add(5, q('Tíz emberből ötfős bizottságot választunk.\nHány olyan bizottság van, amely három kijelölt személy közül pontosan kettőt tartalmaz?'), 105, 'C(3,2) · C(7,3) = 105');
add(5, q('Tíz emberből ötfős bizottságot választunk.\nHány olyan bizottság van, amely három kijelölt személy közül legalább kettőt tartalmaz?'), 126, 'C(3,2)·C(7,3) + C(7,2) = 126');
add(5, q('Hétkarakteres kódot készítünk a 0, 1, …, 9 számjegyekből ismétléssel.\nHány olyan kód van, amelyben pontosan három különböző számjegy fordul elő?'), 216720, 'C(10,3) · (3^7 − 3·2^7 + 3) = 216720');
add(5, q('Hatbetűs szót készítünk öt különböző betűből ismétléssel.\nHány olyan szó van, amelyben pontosan három különböző betű fordul elő?'), 5400, 'C(5,3) · (3^6 − 3·2^6 + 3) = 5400');
add(5, q('Nyolc egyforma golyót osztunk szét négy megkülönböztetett doboz között úgy, hogy egy dobozba legfeljebb három golyó kerülhet.\nHány elosztás lehetséges?'), 31, 'megoldókulcs: 31');
add(5, q('Hány nemnegatív egész megoldása van\nx₁ + x₂ + x₃ + x₄ = 12\negyenletnek, ha mindegyik xᵢ ≤ 5?'), 125, 'megoldókulcs: 125');
add(5, 'Határozd meg a pozitív egész n-et, ha\n\nC(n, 2) = 3 · C(n, 1).\n\nAdd meg n értékét!', 7, 'n(n−1)/2 = 3n → n = 7');

// ===== 6. szint — Mihaszna-mesterfok =====
add(6, 'Adj kombinatorikus bizonyítást:\n\n∑_{k=0}^{n} C(n, k) = 2ⁿ.\n\nEllenőrzés: n = 6 esetén mennyi a jobb oldal?', 64, '2^6 = 64');
add(6, 'Adj kombinatorikus bizonyítást:\n\nk · C(n, k) = n · C(n−1, k−1).\n\nEllenőrzés: n = 8, k = 3 esetén mennyi mindkét oldal?', 168, '3 · C(8,3) = 8 · C(7,2) = 168');
add(6, 'Adj kombinatorikus bizonyítást Pascal azonosságára:\n\nC(n, k) = C(n−1, k) + C(n−1, k−1).\n\nEllenőrzés: n = 8, k = 3 esetén mennyi C(8, 3)?', 56, 'C(7,3)+C(7,2) = 35+21 = 56');
add(6, 'Adj kombinatorikus bizonyítást Vandermonde azonosságára:\n\n∑_{k=0}^{r} C(m, k) C(n, r−k) = C(m+n, r).\n\nEllenőrzés: m = 5, n = 4, r = 3 esetén mennyi a jobb oldal?', 84, 'C(9,3) = 84');
add(6, 'Bizonyítsd be a skatulyaelv segítségével, hogy bármely n + 1 egész szám között van kettő, amelyek n-nel osztva ugyanazt a maradékot adják!\n\nIgaz az állítás? (1 = igaz, 0 = hamis)', 1, 'n maradékosztály → n+1 elem');
add(6, 'Bizonyítsd be, hogy 13 ember között biztosan van legalább kettő, akik ugyanabban a hónapban születtek!\n\nIgaz az állítás? (1 = igaz, 0 = hamis)', 1, '12 hónap, 13 ember');
add(6, 'Az {1, 2, …, 10} halmazból kiválasztunk 6 különböző számot.\nBizonyítsd be, hogy a kiválasztottak között van kettő, amelyek összege 11!\n\nIgaz az állítás? (1 = igaz, 0 = hamis)', 1, 'párok (1,10), …, (5,6)');
add(6, 'Az {1, 2, …, 100} halmazból kiválasztunk 51 különböző számot.\nBizonyítsd be, hogy van köztük két egymást követő egész szám!\n\nIgaz az állítás? (1 = igaz, 0 = hamis)', 1, '50 pár + skatulya');
add(6, q('Egy rácson az (0, 0) pontból az (5, 4) pontba csak jobbra vagy felfelé léphetünk egységnyit.\nHány különböző legrövidebb út van?'), 126, 'C(9,4) = 126');
add(6, q('Egy rácson az (0, 0) pontból az (5, 5) pontba csak jobbra vagy felfelé léphetünk.\nHány olyan legrövidebb út van, amely soha nem kerül az y = x egyenes fölé?'), 42, 'C₅ = (1/6) C(10,5) = 42');
add(6, q('Hány 10 karakteres 0-1 sorozat létezik, amelyben nincs két egymást követő 1?'), 144, 'a₁₀ = 144');
add(6, q('Hány 12 karakteres 0-1 sorozatban van pontosan öt 1, ha két 1 nem állhat egymás mellett?'), 56, 'C(8,5) = 56');
add(6, q('Húsz egyforma golyót osztunk szét öt megkülönböztetett doboz között úgy, hogy mindegyik dobozba legalább 2, de legfeljebb 6 golyó kerüljön.\nHány elosztás lehetséges?'), 381, 'megoldókulcs: 381');
add(6, q('Nyolc különböző levelet nyolc megcímzett borítékba teszünk.\nHány olyan elhelyezés van, amelyben egyetlen levél sem kerül a saját borítékjába?'), 14833, 'D₈ = 14833');
add(6, q('Nyolc különböző levelet nyolc megcímzett borítékba teszünk.\nHány olyan elhelyezés van, amelyben pontosan két levél kerül a saját borítékjába?'), 7420, 'C(8,2) · D₆ = 28 · 265 = 7420');
add(6, q('Hány szürjektív függvény létezik egy 7 elemű halmazból egy 4 elemű halmazba?'), 8400, '4^7 − 4·3^7 + 6·2^7 − 4 = 8400');
add(6, q('Hány szürjektív függvény létezik egy 8 elemű halmazból egy 3 elemű halmazba?'), 5796, '3^8 − 3·2^8 + 3 = 5796');
add(6, q('Hányféleképpen bontható fel egy 6 elemű halmaz pontosan három nemüres, egymástól meg nem különböztetett részhalmazra?'), 90, 'S(6, 3) = 90');
add(6, 'Legyen aₙ az n karakteres 0-1 sorozatok száma, amelyekben nincs két egymást követő 1.\nMutasd meg, hogy aₙ = aₙ₋₁ + aₙ₋₂, majd számítsd ki a₁₅ értékét!', 1597, 'a₁₅ = 1597');
add(6, 'Legyen Dₙ az n elem derangementjeinek száma.\nMutasd meg a rekurziót Dₙ = (n−1)(Dₙ₋₁ + Dₙ₋₂), majd számítsd ki D₇ értékét!', 1854, 'D₇ = 1854');

for (const s of [1, 2, 3, 4, 5, 6]) {
  if (levels[s].length !== 20) {
    throw new Error(`stage ${s} has ${levels[s].length}, expected 20`);
  }
}

const header = `import type { Question } from './types';

/**
 * Kombinatorika — 6 szint × 20 feladat (MIHASZNAMATEK Kombinatorika.pdf).
 * 1 Összeszámlálás → 2 Variáció/kombináció → 3 Ismétléses elrendezés →
 * 4 Elosztások → 5 Korlátozott → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getKombinatorikaPracticeQuestions = (): Question[] => [
`;

const body = [1, 2, 3, 4, 5, 6].map((s) => levels[s].join('\n')).join('\n');
const out = header + body + '\n];\n';
const dest = path.join(__dirname, '..', 'utils', 'game', 'kombinatorikaLevels.ts');
fs.writeFileSync(dest, out, 'utf8');
console.log('OK wrote', dest, 'total', [1, 2, 3, 4, 5, 6].reduce((n, s) => n + levels[s].length, 0));
