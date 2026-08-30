import type { Question } from './types';

/**
 * Kombinatorika — 6 szint × 20 feladat (MIHASZNAMATEK Kombinatorika.pdf).
 * 1 Összeszámlálás → 2 Variáció/kombináció → 3 Ismétléses elrendezés →
 * 4 Elosztások → 5 Korlátozott → 6 Mesterfok.
 * Egy kártya = egy feladat = egy válasz.
 */
export const getKombinatorikaPracticeQuestions = (): Question[] => [
    {
        stage: 1,
        question: `Egy ruhatárban 5 különböző póló és 4 különböző nadrág van.
Hányféle póló–nadrág összeállítás választható?

Add meg a darabszámot!`,
        answer: 20,
        type: 'multiplication',
        expression: `5 · 4 = 20`,
    },
    {
        stage: 1,
        question: `Egy étteremben 4 leves és 6 főétel közül választunk egy-egyet.
Hányféle ebéd állítható össze?

Add meg a darabszámot!`,
        answer: 24,
        type: 'multiplication',
        expression: `4 · 6 = 24`,
    },
    {
        stage: 1,
        question: `Egy utazás első szakaszára 3, a másodikra 5, a harmadikra 2 különböző útvonal közül választhatunk.
Hányféle teljes útvonal lehetséges?

Add meg a darabszámot!`,
        answer: 30,
        type: 'multiplication',
        expression: `3 · 5 · 2 = 30`,
    },
    {
        stage: 1,
        question: `Hat különböző tanuló hányféle sorrendben állhat egymás mellé?

Add meg a darabszámot!`,
        answer: 720,
        type: 'multiplication',
        expression: `6! = 720`,
    },
    {
        stage: 1,
        question: `Hét különböző könyvet hányféle sorrendben lehet egy polcra helyezni?

Add meg a darabszámot!`,
        answer: 5040,
        type: 'multiplication',
        expression: `7! = 5040`,
    },
    {
        stage: 1,
        question: `Nyolc futó indul egy versenyen.
Hányféle befutási sorrend lehetséges, ha nincs holtverseny?

Add meg a darabszámot!`,
        answer: 40320,
        type: 'multiplication',
        expression: `8! = 40320`,
    },
    {
        stage: 1,
        question: `Az A, B, C, D, E betűket mind felhasználva hány különböző ötbetűs sorrend készíthető?

Add meg a darabszámot!`,
        answer: 120,
        type: 'multiplication',
        expression: `5! = 120`,
    },
    {
        stage: 1,
        question: `Az 1, 2, 3, 4, 5, 6 számjegyek mindegyikét pontosan egyszer felhasználva hány hatjegyű szám képezhető?

Add meg a darabszámot!`,
        answer: 720,
        type: 'multiplication',
        expression: `6! = 720`,
    },
    {
        stage: 1,
        question: `Nyolc különböző betűből hány hárombetűs jelszó készíthető, ha egy betű legfeljebb egyszer szerepelhet?

Add meg a darabszámot!`,
        answer: 336,
        type: 'multiplication',
        expression: `8 · 7 · 6 = 336`,
    },
    {
        stage: 1,
        question: `Hány négyjegyű PIN-kód készíthető a 0, 1, …, 9 számjegyekből, ha ismétlés megengedett?

Add meg a darabszámot!`,
        answer: 10000,
        type: 'multiplication',
        expression: `10^4 = 10000`,
    },
    {
        stage: 1,
        question: `Hány 6 karakter hosszú 0-1 sorozat létezik?

Add meg a darabszámot!`,
        answer: 64,
        type: 'multiplication',
        expression: `2^6 = 64`,
    },
    {
        stage: 1,
        question: `Egy teszt 4 kérdésből áll, mindegyikhez 5 válaszlehetőség tartozik.
Hányféleképpen tölthető ki a teszt, ha minden kérdésre pontosan egy választ jelölünk?

Add meg a darabszámot!`,
        answer: 625,
        type: 'multiplication',
        expression: `5^4 = 625`,
    },
    {
        stage: 1,
        question: `Egy 12 fős csoportból hányféleképpen választható ki egy csoportvezető?

Add meg a darabszámot!`,
        answer: 12,
        type: 'multiplication',
        expression: `12`,
    },
    {
        stage: 1,
        question: `Egy 12 fős csoportból hányféleképpen választható ki egy csoportvezető és egy helyettes, ha a két tisztséget különböző személy tölti be?

Add meg a darabszámot!`,
        answer: 132,
        type: 'multiplication',
        expression: `12 · 11 = 132`,
    },
    {
        stage: 1,
        question: `Egy polcon 8 matematikakönyv és 7 fizikakönyv van.
Hányféleképpen választhatunk ki pontosan egy könyvet?

Add meg a darabszámot!`,
        answer: 15,
        type: 'multiplication',
        expression: `8 + 7 = 15`,
    },
    {
        stage: 1,
        question: `Kilenc könyv közül választunk egyet, majd három különböző toll közül egyet.
Hányféle választás lehetséges?

Add meg a darabszámot!`,
        answer: 27,
        type: 'multiplication',
        expression: `9 · 3 = 27`,
    },
    {
        stage: 1,
        question: `Hét különböző ember áll sorba.
Hány sorrendben állhatnak, ha Anna biztosan az első helyen áll?

Add meg a darabszámot!`,
        answer: 720,
        type: 'multiplication',
        expression: `6! = 720`,
    },
    {
        stage: 1,
        question: `Hét különböző ember áll sorba.
Hány sorrendben állhatnak, ha Anna biztosan az utolsó helyen áll?

Add meg a darabszámot!`,
        answer: 720,
        type: 'multiplication',
        expression: `6! = 720`,
    },
    {
        stage: 1,
        question: `Hét különböző ember áll sorba.
Hány sorrendben állhatnak, ha Anna vagy az első, vagy az utolsó helyen áll?

Add meg a darabszámot!`,
        answer: 1440,
        type: 'multiplication',
        expression: `2 · 6! = 1440`,
    },
    {
        stage: 1,
        question: `Hat különböző ember áll sorba.
Hány sorrendben előzi meg Anna Bélát?

Add meg a darabszámot!`,
        answer: 360,
        type: 'multiplication',
        expression: `6! / 2 = 360`,
    },
    {
        stage: 2,
        question: `Nyolc tanuló közül hányféleképpen választhatunk ki háromfős csapatot?

Add meg a darabszámot!`,
        answer: 56,
        type: 'multiplication',
        expression: `C(8,3) = 56`,
    },
    {
        stage: 2,
        question: `Tíz ember közül hányféleképpen választható ki egy 4 fős bizottság?

Add meg a darabszámot!`,
        answer: 210,
        type: 'multiplication',
        expression: `C(10,4) = 210`,
    },
    {
        stage: 2,
        question: `Hét tanulóból háromfős csapatot választunk, majd a három tag közül kijelöljük a csapatkapitányt.
Hány lehetőség van?

Add meg a darabszámot!`,
        answer: 105,
        type: 'multiplication',
        expression: `C(7,3) · 3 = 105`,
    },
    {
        stage: 2,
        question: `Tíz versenyző közül arany-, ezüst- és bronzérmest választunk.
Hányféle eredmény lehetséges?

Add meg a darabszámot!`,
        answer: 720,
        type: 'multiplication',
        expression: `10 · 9 · 8 = 720`,
    },
    {
        stage: 2,
        question: `Hét különböző jelből négykarakteres kódot készítünk ismétlés nélkül.
Hány különböző kód készíthető?

Add meg a darabszámot!`,
        answer: 840,
        type: 'multiplication',
        expression: `7 · 6 · 5 · 4 = 840`,
    },
    {
        stage: 2,
        question: `A 0, 1, …, 8 számjegyekből hány különböző számjegyekből álló ötjegyű szám készíthető?

Add meg a darabszámot!`,
        answer: 13440,
        type: 'multiplication',
        expression: `8 · 8 · 7 · 6 · 5 = 13440`,
    },
    {
        stage: 2,
        question: `Hat fiú és öt lány közül két fiút és két lányt választunk ki.
Hányféle csoport lehetséges?

Add meg a darabszámot!`,
        answer: 150,
        type: 'multiplication',
        expression: `C(6,2) · C(5,2) = 150`,
    },
    {
        stage: 2,
        question: `Kilenc emberből négyfős bizottságot választunk úgy, hogy Anna biztosan tagja legyen.
Hány lehetőség van?

Add meg a darabszámot!`,
        answer: 56,
        type: 'multiplication',
        expression: `C(8,3) = 56`,
    },
    {
        stage: 2,
        question: `Kilenc emberből négyfős bizottságot választunk úgy, hogy Anna ne legyen tag.
Hány lehetőség van?

Add meg a darabszámot!`,
        answer: 70,
        type: 'multiplication',
        expression: `C(8,4) = 70`,
    },
    {
        stage: 2,
        question: `Tíz emberből négyfős bizottságot választunk.
Hány olyan bizottság van, amely Anna és Béla közül pontosan az egyiket tartalmazza?

Add meg a darabszámot!`,
        answer: 112,
        type: 'multiplication',
        expression: `2 · C(8,3) = 112`,
    },
    {
        stage: 2,
        question: `Tizenegy emberből ötfős bizottságot választunk.
Hány olyan bizottság van, amely Anna és Béla közül legalább az egyiket tartalmazza?

Add meg a darabszámot!`,
        answer: 336,
        type: 'multiplication',
        expression: `C(11,5) − C(9,5) = 336`,
    },
    {
        stage: 2,
        question: `Nyolc futó befutási sorrendjét vizsgáljuk.
Hány olyan sorrend van, amelyben Anna az első három hely valamelyikén végez?

Add meg a darabszámot!`,
        answer: 15120,
        type: 'multiplication',
        expression: `3 · 7! = 15120`,
    },
    {
        stage: 2,
        question: `Hét különböző ember áll sorba.
Hány sorrendben áll Anna és Béla egymás mellett?

Add meg a darabszámot!`,
        answer: 1440,
        type: 'multiplication',
        expression: `2 · 6! = 1440`,
    },
    {
        stage: 2,
        question: `Hét különböző ember áll sorba.
Hány sorrendben nem áll Anna és Béla egymás mellett?

Add meg a darabszámot!`,
        answer: 3600,
        type: 'multiplication',
        expression: `7! − 2 · 6! = 3600`,
    },
    {
        stage: 2,
        question: `Nyolc különböző könyvet helyezünk polcra.
Hány sorrendben kerül három előre kijelölt könyv egymás mellé?

Add meg a darabszámot!`,
        answer: 4320,
        type: 'multiplication',
        expression: `3! · 6! = 4320`,
    },
    {
        stage: 2,
        question: `Nyolc különböző könyvet helyezünk polcra.
Hány olyan sorrend van, amelyben három előre kijelölt könyv egymáshoz viszonyított sorrendje A-B-C?

Add meg a darabszámot!`,
        answer: 6720,
        type: 'multiplication',
        expression: `8! / 3! = 6720`,
    },
    {
        stage: 2,
        question: `Tizenkét különböző pont közül hány szakasz határozható meg?

Add meg a darabszámot!`,
        answer: 66,
        type: 'multiplication',
        expression: `C(12,2) = 66`,
    },
    {
        stage: 2,
        question: `Kilenc, három egyenesre nem illeszkedő pont közül hány háromszög választható ki?

Add meg a darabszámot!`,
        answer: 84,
        type: 'multiplication',
        expression: `C(9,3) = 84`,
    },
    {
        stage: 2,
        question: `Két párhuzamos egyenesen 6, illetve 5 kijelölt pont van.
Hány olyan egyenes húzható, amely mindkét megadott egyenesen pontosan egy kijelölt ponton halad át?

Add meg a darabszámot!`,
        answer: 30,
        type: 'multiplication',
        expression: `6 · 5 = 30`,
    },
    {
        stage: 2,
        question: `Tíz emberből négyfős csoportot választunk.
Anna és Béla vagy mindketten legyenek benne, vagy egyikük se.
Hány csoport lehetséges?

Add meg a darabszámot!`,
        answer: 98,
        type: 'multiplication',
        expression: `C(8,2) + C(8,4) = 98`,
    },
    {
        stage: 3,
        question: `Hány különböző sorrendben írhatók le a BANANA szó betűi?

Add meg a darabszámot!`,
        answer: 60,
        type: 'multiplication',
        expression: `6! / (3! · 2!) = 60`,
    },
    {
        stage: 3,
        question: `Hány különböző sorrendben írhatók le a MATEMATIKA szó betűi?

Add meg a darabszámot!`,
        answer: 151200,
        type: 'multiplication',
        expression: `10! / (3! · 2! · 2!) = 151200`,
    },
    {
        stage: 3,
        question: `Hány különböző sorrendben írhatók le a MISSISSIPPI szó betűi?

Add meg a darabszámot!`,
        answer: 34650,
        type: 'multiplication',
        expression: `11! / (4! · 4! · 2!) = 34650`,
    },
    {
        stage: 3,
        question: `Nyolc különböző ember áll sorba.
Hány sorrendben áll három előre kijelölt személy egymás mellett?

Add meg a darabszámot!`,
        answer: 4320,
        type: 'multiplication',
        expression: `3! · 6! = 4320`,
    },
    {
        stage: 3,
        question: `Nyolc különböző ember áll sorba.
Hány sorrendben van Anna és Béla között pontosan két ember?

Add meg a darabszámot!`,
        answer: 7200,
        type: 'multiplication',
        expression: `5 · 2 · 6! = 7200`,
    },
    {
        stage: 3,
        question: `Hét különböző ember áll sorba.
Hány sorrendben szerepel Anna Béla előtt, Béla pedig Csaba előtt?

Add meg a darabszámot!`,
        answer: 840,
        type: 'multiplication',
        expression: `7! / 3! = 840`,
    },
    {
        stage: 3,
        question: `Kilenc különböző ember áll sorba.
Hány sorrendben nem áll Anna és Béla egymás mellett?

Add meg a darabszámot!`,
        answer: 282240,
        type: 'multiplication',
        expression: `9! − 2 · 8! = 282240`,
    },
    {
        stage: 3,
        question: `Hány 6 karakteres 0-1 sorozatban van pontosan két darab 1?

Add meg a darabszámot!`,
        answer: 15,
        type: 'multiplication',
        expression: `C(6,2) = 15`,
    },
    {
        stage: 3,
        question: `Hány 10 karakteres 0-1 sorozatban van pontosan négy darab 1?

Add meg a darabszámot!`,
        answer: 210,
        type: 'multiplication',
        expression: `C(10,4) = 210`,
    },
    {
        stage: 3,
        question: `Hány 8 karakteres, 0, 1, 2 jelekből álló sorozatban van 3 darab 0, 2 darab 1 és 3 darab 2?

Add meg a darabszámot!`,
        answer: 560,
        type: 'multiplication',
        expression: `8! / (3! · 2! · 3!) = 560`,
    },
    {
        stage: 3,
        question: `Az A, B, C betűkből hatbetűs szót készítünk ismétléssel.
Hány olyan szó van, amelyben pontosan két A szerepel?

Add meg a darabszámot!`,
        answer: 240,
        type: 'multiplication',
        expression: `C(6,2) · 2^4 = 240`,
    },
    {
        stage: 3,
        question: `Az A, B, C, D betűkből hétbetűs szót készítünk ismétléssel.
Hány olyan szó van, amelyben pontosan egy D szerepel?

Add meg a darabszámot!`,
        answer: 5103,
        type: 'multiplication',
        expression: `7 · 3^6 = 5103`,
    },
    {
        stage: 3,
        question: `Az A, B, C, D betűkből hatbetűs szót készítünk ismétléssel.
Hány olyan szó van, amelyben mind a négy betű legalább egyszer szerepel?

Add meg a darabszámot!`,
        answer: 1560,
        type: 'multiplication',
        expression: `4^6 − 4·3^6 + 6·2^6 − 4 = 1560`,
    },
    {
        stage: 3,
        question: `Ötjegyű kódot készítünk a 0, 1, …, 9 számjegyekből ismétléssel.
Hány olyan kód van, amelyben pontosan két darab 7 szerepel?

Add meg a darabszámot!`,
        answer: 7290,
        type: 'multiplication',
        expression: `C(5,2) · 9^3 = 7290`,
    },
    {
        stage: 3,
        question: `Öt fiú és négy lány ül egymás mellé úgy, hogy a fiúk és lányok felváltva követik egymást.
Hány ülésrend lehetséges?

Add meg a darabszámot!`,
        answer: 2880,
        type: 'multiplication',
        expression: `5! · 4! = 2880`,
    },
    {
        stage: 3,
        question: `Négy fiú és négy lány ül egymás mellé úgy, hogy a fiúk és lányok felváltva követik egymást.
Hány ülésrend lehetséges?

Add meg a darabszámot!`,
        answer: 1152,
        type: 'multiplication',
        expression: `2 · 4! · 4! = 1152`,
    },
    {
        stage: 3,
        question: `Hat különböző ember ül egy kerek asztal köré.
Hány különböző ülésrend lehetséges, ha az elforgatással egymásba vihető elrendezéseket azonosnak tekintjük?

Add meg a darabszámot!`,
        answer: 120,
        type: 'multiplication',
        expression: `5! = 120`,
    },
    {
        stage: 3,
        question: `Hét különböző ember ül egy kerek asztal köré.
Hány ülésrendben ül Anna és Béla egymás mellett?

Add meg a darabszámot!`,
        answer: 240,
        type: 'multiplication',
        expression: `2 · 5! = 240`,
    },
    {
        stage: 3,
        question: `Hét különböző ember ül egy kerek asztal köré.
Hány ülésrendben nem ül Anna és Béla egymás mellett?

Add meg a darabszámot!`,
        answer: 480,
        type: 'multiplication',
        expression: `6! − 2 · 5! = 480`,
    },
    {
        stage: 3,
        question: `Nyolc különböző embert négy, sorrend nélküli párba osztunk.
Hány különböző párosítás lehetséges?

Add meg a darabszámot!`,
        answer: 105,
        type: 'multiplication',
        expression: `7 · 5 · 3 · 1 = 105`,
    },
    {
        stage: 4,
        question: `Tíz egyforma golyót osztunk szét négy megkülönböztetett doboz között.
Egy doboz üres is maradhat.
Hány szétosztás lehetséges?

Add meg a darabszámot!`,
        answer: 286,
        type: 'multiplication',
        expression: `C(13,3) = 286`,
    },
    {
        stage: 4,
        question: `Tíz egyforma golyót osztunk szét négy megkülönböztetett doboz között úgy, hogy mindegyik dobozba kerüljön legalább egy golyó.
Hány szétosztás lehetséges?

Add meg a darabszámot!`,
        answer: 84,
        type: 'multiplication',
        expression: `C(9,3) = 84`,
    },
    {
        stage: 4,
        question: `Tizenkét egyforma golyót osztunk szét három megkülönböztetett doboz között úgy, hogy mindegyik dobozba legalább két golyó kerüljön.
Hány szétosztás lehetséges?

Add meg a darabszámot!`,
        answer: 28,
        type: 'multiplication',
        expression: `C(8,2) = 28`,
    },
    {
        stage: 4,
        question: `Tizenöt egyforma érmét osztunk szét öt ember között úgy, hogy mindenki kapjon legalább egyet.
Hányféle elosztás van?

Add meg a darabszámot!`,
        answer: 1001,
        type: 'multiplication',
        expression: `C(14,4) = 1001`,
    },
    {
        stage: 4,
        question: `Hány nemnegatív egész megoldása van az
x + y + z = 10
egyenletnek?

Add meg a darabszámot!`,
        answer: 66,
        type: 'multiplication',
        expression: `C(12,2) = 66`,
    },
    {
        stage: 4,
        question: `Hány pozitív egész megoldása van az
x + y + z = 10
egyenletnek?

Add meg a darabszámot!`,
        answer: 36,
        type: 'multiplication',
        expression: `C(9,2) = 36`,
    },
    {
        stage: 4,
        question: `Hány nemnegatív egész megoldása van
x₁ + x₂ + x₃ + x₄ = 8
egyenletnek, ha x₁ ≥ 2?

Add meg a darabszámot!`,
        answer: 84,
        type: 'multiplication',
        expression: `C(9,3) = 84`,
    },
    {
        stage: 4,
        question: `Hány nemnegatív egész megoldása van
x + y + z = 12
egyenletnek, ha x ≤ 4?

Add meg a darabszámot!`,
        answer: 55,
        type: 'multiplication',
        expression: `C(14,2) − C(9,2) = 55`,
    },
    {
        stage: 4,
        question: `Négyféle fagylaltból összesen 6 gombócot választunk.
A sorrend nem számít, egy ízből többet is kérhetünk.
Hányféle választás lehetséges?

Add meg a darabszámot!`,
        answer: 84,
        type: 'multiplication',
        expression: `C(9,6) = 84`,
    },
    {
        stage: 4,
        question: `Ötféle tárgytípusból összesen 8 darabot választunk.
Egy típusból tetszőlegesen sok választható, a sorrend nem számít.
Hány lehetőség van?

Add meg a darabszámot!`,
        answer: 495,
        type: 'multiplication',
        expression: `C(12,8) = 495`,
    },
    {
        stage: 4,
        question: `Nyolc különböző ajándék mindegyikét a három megkülönböztetett gyerek valamelyikének adjuk.
Hány elosztás lehetséges, ha valaki akár egyet sem kaphat?

Add meg a darabszámot!`,
        answer: 6561,
        type: 'multiplication',
        expression: `3^8 = 6561`,
    },
    {
        stage: 4,
        question: `Nyolc különböző ajándékot három megkülönböztetett gyerek között osztunk szét úgy, hogy mindenki kapjon legalább egyet.
Hány elosztás lehetséges?

Add meg a darabszámot!`,
        answer: 5796,
        type: 'multiplication',
        expression: `3^8 − 3·2^8 + 3 = 5796`,
    },
    {
        stage: 4,
        question: `Hat különböző ajándékot három megkülönböztetett gyerek között osztunk szét úgy, hogy mindenki kapjon legalább egyet.
Hány elosztás lehetséges?

Add meg a darabszámot!`,
        answer: 540,
        type: 'multiplication',
        expression: `3^6 − 3·2^6 + 3 = 540`,
    },
    {
        stage: 4,
        question: `Hat megkülönböztetett helyet négy színnel színezünk.
Hány olyan színezés van, amelyben pontosan három különböző szín fordul elő?

Add meg a darabszámot!`,
        answer: 2160,
        type: 'multiplication',
        expression: `C(4,3) · (3^6 − 3·2^6 + 3) = 2160`,
    },
    {
        stage: 4,
        question: `Tíz egymás melletti helyre négy piros, három kék és három zöld jelölést helyezünk el.
Az azonos színű jelöléseket nem különböztetjük meg.
Hány sorrend lehetséges?

Add meg a darabszámot!`,
        answer: 4200,
        type: 'multiplication',
        expression: `10! / (4! · 3! · 3!) = 4200`,
    },
    {
        stage: 4,
        question: `Kilenc helyre három azonos piros, két azonos kék és négy azonos zöld korongot teszünk.
Hány különböző sorrend lehetséges?

Add meg a darabszámot!`,
        answer: 1260,
        type: 'multiplication',
        expression: `9! / (3! · 2! · 4!) = 1260`,
    },
    {
        stage: 4,
        question: `Hány 12 karakteres szó készíthető 5 darab A, 4 darab B és 3 darab C betűből?

Add meg a darabszámot!`,
        answer: 27720,
        type: 'multiplication',
        expression: `12! / (5! · 4! · 3!) = 27720`,
    },
    {
        stage: 4,
        question: `Kilenc különböző ember ül kör alakú asztalhoz.
Hány ülésrendben ül három előre kijelölt személy egymás mellett?

Add meg a darabszámot!`,
        answer: 4320,
        type: 'multiplication',
        expression: `6! · 3! = 4320`,
    },
    {
        stage: 4,
        question: `Nyolc különböző ember ül kör alakú asztalhoz.
Hány ülésrendben nem ül Anna és Béla egymás mellett?

Add meg a darabszámot!`,
        answer: 3600,
        type: 'multiplication',
        expression: `7! − 2 · 6! = 3600`,
    },
    {
        stage: 4,
        question: `Öt szín közül pontosan hármat felhasználva színezünk ki hét megkülönböztetett helyet úgy, hogy mindhárom kiválasztott szín legalább egyszer előforduljon.
Hány színezés lehetséges?

Add meg a darabszámot!`,
        answer: 18060,
        type: 'multiplication',
        expression: `C(5,3) · (3^7 − 3·2^7 + 3) = 18060`,
    },
    {
        stage: 5,
        question: `Hat különböző levelet hat megcímzett borítékba teszünk, mindegyik borítékba egyet.
Hány olyan elhelyezés van, amelyben egyetlen levél sem kerül a saját borítékjába?

Add meg a darabszámot!`,
        answer: 265,
        type: 'multiplication',
        expression: `D₆ = 265`,
    },
    {
        stage: 5,
        question: `Hét különböző levelet hét megcímzett borítékba teszünk, mindegyik borítékba egyet.
Hány olyan elhelyezés van, amelyben egyetlen levél sem kerül a saját borítékjába?

Add meg a darabszámot!`,
        answer: 1854,
        type: 'multiplication',
        expression: `D₇ = 1854`,
    },
    {
        stage: 5,
        question: `Nyolc különböző ember áll sorba.
Hány sorrendben teljesül, hogy Anna, Béla és Csaba közül egyik kettő sem áll egymás mellett?

Add meg a darabszámot!`,
        answer: 14400,
        type: 'multiplication',
        expression: `megoldókulcs: 14400`,
    },
    {
        stage: 5,
        question: `Öt fiú és öt lány áll sorba.
Hány olyan sorrend van, amelyben két lány soha nem áll egymás mellett?

Add meg a darabszámot!`,
        answer: 86400,
        type: 'multiplication',
        expression: `megoldókulcs: 86400`,
    },
    {
        stage: 5,
        question: `Hat fiú és négy lány áll sorba.
Hány olyan sorrend van, amelyben két lány soha nem áll egymás mellett?

Add meg a darabszámot!`,
        answer: 604800,
        type: 'multiplication',
        expression: `megoldókulcs: 604800`,
    },
    {
        stage: 5,
        question: `Tíz különböző könyvet helyezünk polcra.
Hány olyan sorrend van, amelyben négy előre kijelölt könyv egymáshoz viszonyított sorrendje rögzített?

Add meg a darabszámot!`,
        answer: 151200,
        type: 'multiplication',
        expression: `10! / 4! = 151200`,
    },
    {
        stage: 5,
        question: `Tíz futó befutási sorrendjét vizsgáljuk.
Hány olyan sorrend van, amelyben Anna, Béla és Csaba mind az első öt hely valamelyikén végez?

Add meg a darabszámot!`,
        answer: 302400,
        type: 'multiplication',
        expression: `megoldókulcs: 302400`,
    },
    {
        stage: 5,
        question: `Kilenc különböző ember ül kör alakú asztalhoz.
Hány ülésrendben ül Anna, Béla és Csaba három egymást követő helyen?

Add meg a darabszámot!`,
        answer: 4320,
        type: 'multiplication',
        expression: `megoldókulcs: 4320`,
    },
    {
        stage: 5,
        question: `Kilenc különböző ember ül kör alakú asztalhoz.
Hány ülésrendben nem ül Anna és Béla egymás mellett?

Add meg a darabszámot!`,
        answer: 30240,
        type: 'multiplication',
        expression: `megoldókulcs: 30240`,
    },
    {
        stage: 5,
        question: `Tíz különböző embert öt, sorrend nélküli párba osztunk.
Hány különböző párosítás lehetséges?

Add meg a darabszámot!`,
        answer: 945,
        type: 'multiplication',
        expression: `9 · 7 · 5 · 3 · 1 = 945`,
    },
    {
        stage: 5,
        question: `Tizenkét különböző embert három, egymástól meg nem különböztetett 4 fős csapatra osztunk.
Hány felosztás lehetséges?

Add meg a darabszámot!`,
        answer: 5775,
        type: 'multiplication',
        expression: `12! / ((4!)^3 · 3!) = 5775`,
    },
    {
        stage: 5,
        question: `Tíz különböző embert egy 2, egy 3 és egy 5 fős csapatra osztunk.
Hány felosztás lehetséges?

Add meg a darabszámot!`,
        answer: 2520,
        type: 'multiplication',
        expression: `C(10,2) · C(8,3) = 2520`,
    },
    {
        stage: 5,
        question: `Nyolc emberből négyfős bizottságot választunk, majd a bizottságon belül külön elnököt és titkárt választunk.
Hány lehetőség van?

Add meg a darabszámot!`,
        answer: 840,
        type: 'multiplication',
        expression: `C(8,4) · 4 · 3 = 840`,
    },
    {
        stage: 5,
        question: `Tíz emberből ötfős bizottságot választunk.
Hány olyan bizottság van, amely három kijelölt személy közül pontosan kettőt tartalmaz?

Add meg a darabszámot!`,
        answer: 105,
        type: 'multiplication',
        expression: `C(3,2) · C(7,3) = 105`,
    },
    {
        stage: 5,
        question: `Tíz emberből ötfős bizottságot választunk.
Hány olyan bizottság van, amely három kijelölt személy közül legalább kettőt tartalmaz?

Add meg a darabszámot!`,
        answer: 126,
        type: 'multiplication',
        expression: `C(3,2)·C(7,3) + C(7,2) = 126`,
    },
    {
        stage: 5,
        question: `Hétkarakteres kódot készítünk a 0, 1, …, 9 számjegyekből ismétléssel.
Hány olyan kód van, amelyben pontosan három különböző számjegy fordul elő?

Add meg a darabszámot!`,
        answer: 216720,
        type: 'multiplication',
        expression: `C(10,3) · (3^7 − 3·2^7 + 3) = 216720`,
    },
    {
        stage: 5,
        question: `Hatbetűs szót készítünk öt különböző betűből ismétléssel.
Hány olyan szó van, amelyben pontosan három különböző betű fordul elő?

Add meg a darabszámot!`,
        answer: 5400,
        type: 'multiplication',
        expression: `C(5,3) · (3^6 − 3·2^6 + 3) = 5400`,
    },
    {
        stage: 5,
        question: `Nyolc egyforma golyót osztunk szét négy megkülönböztetett doboz között úgy, hogy egy dobozba legfeljebb három golyó kerülhet.
Hány elosztás lehetséges?

Add meg a darabszámot!`,
        answer: 31,
        type: 'multiplication',
        expression: `megoldókulcs: 31`,
    },
    {
        stage: 5,
        question: `Hány nemnegatív egész megoldása van
x₁ + x₂ + x₃ + x₄ = 12
egyenletnek, ha mindegyik xᵢ ≤ 5?

Add meg a darabszámot!`,
        answer: 125,
        type: 'multiplication',
        expression: `megoldókulcs: 125`,
    },
    {
        stage: 5,
        question: `Határozd meg a pozitív egész n-et, ha

C(n, 2) = 3 · C(n, 1).

Add meg n értékét!`,
        answer: 7,
        type: 'multiplication',
        expression: `n(n−1)/2 = 3n → n = 7`,
    },
    {
        stage: 6,
        question: `Adj kombinatorikus bizonyítást:

∑_{k=0}^{n} C(n, k) = 2ⁿ.

Ellenőrzés: n = 6 esetén mennyi a jobb oldal?`,
        answer: 64,
        type: 'multiplication',
        expression: `2^6 = 64`,
    },
    {
        stage: 6,
        question: `Adj kombinatorikus bizonyítást:

k · C(n, k) = n · C(n−1, k−1).

Ellenőrzés: n = 8, k = 3 esetén mennyi mindkét oldal?`,
        answer: 168,
        type: 'multiplication',
        expression: `3 · C(8,3) = 8 · C(7,2) = 168`,
    },
    {
        stage: 6,
        question: `Adj kombinatorikus bizonyítást Pascal azonosságára:

C(n, k) = C(n−1, k) + C(n−1, k−1).

Ellenőrzés: n = 8, k = 3 esetén mennyi C(8, 3)?`,
        answer: 56,
        type: 'multiplication',
        expression: `C(7,3)+C(7,2) = 35+21 = 56`,
    },
    {
        stage: 6,
        question: `Adj kombinatorikus bizonyítást Vandermonde azonosságára:

∑_{k=0}^{r} C(m, k) C(n, r−k) = C(m+n, r).

Ellenőrzés: m = 5, n = 4, r = 3 esetén mennyi a jobb oldal?`,
        answer: 84,
        type: 'multiplication',
        expression: `C(9,3) = 84`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be a skatulyaelv segítségével, hogy bármely n + 1 egész szám között van kettő, amelyek n-nel osztva ugyanazt a maradékot adják!

Igaz az állítás? (1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `n maradékosztály → n+1 elem`,
    },
    {
        stage: 6,
        question: `Bizonyítsd be, hogy 13 ember között biztosan van legalább kettő, akik ugyanabban a hónapban születtek!

Igaz az állítás? (1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `12 hónap, 13 ember`,
    },
    {
        stage: 6,
        question: `Az {1, 2, …, 10} halmazból kiválasztunk 6 különböző számot.
Bizonyítsd be, hogy a kiválasztottak között van kettő, amelyek összege 11!

Igaz az állítás? (1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `párok (1,10), …, (5,6)`,
    },
    {
        stage: 6,
        question: `Az {1, 2, …, 100} halmazból kiválasztunk 51 különböző számot.
Bizonyítsd be, hogy van köztük két egymást követő egész szám!

Igaz az állítás? (1 = igaz, 0 = hamis)`,
        answer: 1,
        type: 'multiplication',
        expression: `50 pár + skatulya`,
    },
    {
        stage: 6,
        question: `Egy rácson az (0, 0) pontból az (5, 4) pontba csak jobbra vagy felfelé léphetünk egységnyit.
Hány különböző legrövidebb út van?

Add meg a darabszámot!`,
        answer: 126,
        type: 'multiplication',
        expression: `C(9,4) = 126`,
    },
    {
        stage: 6,
        question: `Egy rácson az (0, 0) pontból az (5, 5) pontba csak jobbra vagy felfelé léphetünk.
Hány olyan legrövidebb út van, amely soha nem kerül az y = x egyenes fölé?

Add meg a darabszámot!`,
        answer: 42,
        type: 'multiplication',
        expression: `C₅ = (1/6) C(10,5) = 42`,
    },
    {
        stage: 6,
        question: `Hány 10 karakteres 0-1 sorozat létezik, amelyben nincs két egymást követő 1?

Add meg a darabszámot!`,
        answer: 144,
        type: 'multiplication',
        expression: `a₁₀ = 144`,
    },
    {
        stage: 6,
        question: `Hány 12 karakteres 0-1 sorozatban van pontosan öt 1, ha két 1 nem állhat egymás mellett?

Add meg a darabszámot!`,
        answer: 56,
        type: 'multiplication',
        expression: `C(8,5) = 56`,
    },
    {
        stage: 6,
        question: `Húsz egyforma golyót osztunk szét öt megkülönböztetett doboz között úgy, hogy mindegyik dobozba legalább 2, de legfeljebb 6 golyó kerüljön.
Hány elosztás lehetséges?

Add meg a darabszámot!`,
        answer: 381,
        type: 'multiplication',
        expression: `megoldókulcs: 381`,
    },
    {
        stage: 6,
        question: `Nyolc különböző levelet nyolc megcímzett borítékba teszünk.
Hány olyan elhelyezés van, amelyben egyetlen levél sem kerül a saját borítékjába?

Add meg a darabszámot!`,
        answer: 14833,
        type: 'multiplication',
        expression: `D₈ = 14833`,
    },
    {
        stage: 6,
        question: `Nyolc különböző levelet nyolc megcímzett borítékba teszünk.
Hány olyan elhelyezés van, amelyben pontosan két levél kerül a saját borítékjába?

Add meg a darabszámot!`,
        answer: 7420,
        type: 'multiplication',
        expression: `C(8,2) · D₆ = 28 · 265 = 7420`,
    },
    {
        stage: 6,
        question: `Hány szürjektív függvény létezik egy 7 elemű halmazból egy 4 elemű halmazba?

Add meg a darabszámot!`,
        answer: 8400,
        type: 'multiplication',
        expression: `4^7 − 4·3^7 + 6·2^7 − 4 = 8400`,
    },
    {
        stage: 6,
        question: `Hány szürjektív függvény létezik egy 8 elemű halmazból egy 3 elemű halmazba?

Add meg a darabszámot!`,
        answer: 5796,
        type: 'multiplication',
        expression: `3^8 − 3·2^8 + 3 = 5796`,
    },
    {
        stage: 6,
        question: `Hányféleképpen bontható fel egy 6 elemű halmaz pontosan három nemüres, egymástól meg nem különböztetett részhalmazra?

Add meg a darabszámot!`,
        answer: 90,
        type: 'multiplication',
        expression: `S(6, 3) = 90`,
    },
    {
        stage: 6,
        question: `Legyen aₙ az n karakteres 0-1 sorozatok száma, amelyekben nincs két egymást követő 1.
Mutasd meg, hogy aₙ = aₙ₋₁ + aₙ₋₂, majd számítsd ki a₁₅ értékét!`,
        answer: 1597,
        type: 'multiplication',
        expression: `a₁₅ = 1597`,
    },
    {
        stage: 6,
        question: `Legyen Dₙ az n elem derangementjeinek száma.
Mutasd meg a rekurziót Dₙ = (n−1)(Dₙ₋₁ + Dₙ₋₂), majd számítsd ki D₇ értékét!`,
        answer: 1854,
        type: 'multiplication',
        expression: `D₇ = 1854`,
    },
];
