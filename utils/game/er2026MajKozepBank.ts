import type { Question } from './types';
import { imageFigure } from './questionFigure';
import { agentDebugLog } from '../agentDebugLog';

function q(
    id: string,
    question: string,
    answer: number,
    expression: string,
    extra?: Partial<Question>
): Question {
    return {
        id,
        question,
        answer,
        type: 'multiplication',
        expression,
        ...extra,
    };
}

const FIG = '/figures/erettsegi/2026maj-kozep';

/** 2026. május 5. középszint — itemek a javítási útmutató szerint. */
export function getErettsegi2026MajKozepQuestions(): Question[] {
    const graphs = imageFigure(`${FIG}/t5-graphs.png`, '2026/5. A–D grafikonok');
    const box = imageFigure(`${FIG}/t6-box.png`, '2026/6. dobozdiagram');
    const tri = imageFigure(`${FIG}/t9-tri.png`, '2026/9. háromszög');
    const venn = imageFigure(`${FIG}/t14-venn.png`, '2026/14. Venn-ábrák');
    const light = imageFigure(`${FIG}/t16-light.png`, '2026/16.d) világítótorony');
    const table = imageFigure(`${FIG}/t17-table.png`, '2026/17. csapatok száma');
    const goal = imageFigure(`${FIG}/t17-goal.png`, '2026/17.d) kapuháló');
    const plane = imageFigure(`${FIG}/t18-plane.png`, '2026/18.e) ülésrend');

    const set14 =
        'Legyen a H alaphalmaz az 50-nél kisebb pozitív egész számok halmaza. Legyenek A, B és C a H alábbi részhalmazai: A = {2-vel osztható számok}, B = {3-mal osztható számok}, C = {5-tel osztható számok}.';
    const fStem = 'Adott az f: R → R, f(x)=(x−1)²−4 függvény.';
    const storm =
        'Nagyobb hazai tavainkon a viharjelzési időszak április 1-jén 0 órától október 31-én 24 óráig tart. A 2025-ös viharjelzési időszakban a statisztikák szerint a Balaton középső medencéjére 147 alkalommal adtak ki elsőfokú viharjelzést, amelyek összesen 1319 órán át voltak érvényben, míg 115 alkalommal adtak ki másodfokú viharjelzést, amelyek összesen 668 órán át voltak érvényben.';
    const teams =
        'A 2000-es években Magyarországon csökkent a nagypályás, felnőtt korosztályú férfi futballcsapatok száma. A falusi futball megerősítéséért indult 2022-ben egy civil kezdeményezés. Év és csapatok száma: 2000: 2272, 2005: 2135, 2010: 2009, 2015: 1960, 2020: 1774, 2025: 1554.';
    const bag =
        'Egy légitársaságnál a téglatest alakú szabványos kézipoggyász méretei 55 cm × 40 cm × 23 cm.';
    const airport =
        '2025-ben a Liszt Ferenc Nemzetközi Repülőtér éves utasforgalma 19,6 millió fő volt. Egy év végén készült becslés szerint a repülőtér éves utasforgalma a következő évben 900 ezerrel nőhet. Tegyük fel, hogy a következő évtől kezdve minden évben 900 ezerrel nő az éves utasforgalom.';

    const list: Question[] = [
        q(
            'er26m-1',
            '2026/1. Adott az A={2; 4} halmaz. Adjon meg egy olyan B halmazt, amelyre teljesül, hogy A∪B={1; 2; 3; 4; 5}.\nÍrd be B elemeit.',
            0,
            'B-nek tartalmaznia kell {1; 3; 5}-öt. Mintamegoldás: B = {1; 3; 5}.',
            { expectedSet: ['1', '3', '5'] }
        ),
        q(
            'er26m-2',
            '2026/2. Rajzoljon egy olyan ötpontú gráfot, amelyben a pontok fokszámának összege 10, és az egyik pontjának fokszáma 4.\nA beírandó szám a gráf éleinek száma.',
            5,
            'Fokszámösszeg = 2e → e = 5'
        ),
        q(
            'er26m-3',
            '2026/3. Egy derékszögű háromszög átfogója 50 cm, az egyik befogója 14 cm hosszú. Határozza meg a másik befogó hosszát!',
            48,
            'sqrt(50^2 − 14^2) = sqrt(2500 − 196) = sqrt(2304) = 48'
        ),
        q(
            'er26m-4',
            '2026/4. Hány átlója van egy konvex 11-szögnek?',
            44,
            'n(n−3)/2 = 11·8/2 = 44'
        ),
        q(
            'er26m-5',
            '2026/5. Válassza ki az alábbiak közül az f: R → R, f(x)=2^x függvény grafikonját!\nA=1, B=2, C=3, D=4.',
            1,
            '2^x átmegy (0;1) és (1;2) ponton, x→−∞ esetén y→0. A',
            { figure: graphs }
        ),
        q(
            'er26m-6',
            '2026/6. Egy végzős osztály diákjainak matematikaérettségi eredményeiről készült az alábbi dobozdiagram. A diagram alapján adja meg a diákok eredményeinek maximumát, mediánját, alsó kvartilisét és terjedelmét!',
            96,
            'max=96, medián=70, Q1=58, terjedelem=96−42=54',
            { alternativeAnswer: 70, thirdAnswer: 58, fourthAnswer: 54, figure: box }
        ),
        q(
            'er26m-7',
            '2026/7. Határozza meg az alábbi egyenletben az n értékét!\n(2^2)^4 / 8 = 2^n',
            5,
            '(4)^4 / 8 = 256/8 = 32 = 2^5 → n = 5'
        ),
        q(
            'er26m-8',
            '2026/8. Írja fel annak a körnek az egyenletét, melynek középpontja a (−3; 0) pont, sugara pedig 4 egység hosszú!\nA beírandó szám az egyenlet jobb oldala.',
            16,
            '(x+3)^2 + y^2 = 16'
        ),
        q(
            'er26m-9',
            '2026/9. Egy háromszög egyik oldala 6 cm hosszú, az oldalon fekvő két szög 45°-os, illetve 70°-os. Határozza meg a 45°-os szöggel szemközti oldal hosszát! Válaszát indokolja!',
            4.68,
            'Harmadik szög 65°. Szinusztétel: b/sin45 = 6/sin65 → b ≈ 4,68 cm',
            { figure: tri }
        ),
        q(
            'er26m-10',
            '2026/10. Adja meg azt a két egész számot, amelyeknek a különbsége 6, az abszolútértékük pedig egyenlő!',
            3,
            '3 és −3',
            { alternativeAnswer: -3 }
        ),
        q(
            'er26m-11',
            '2026/11. Hány háromjegyű, különböző számjegyekből álló páratlan természetes szám alkotható az 1, 2, 3, 4 számjegyekből? Válaszát indokolja!',
            12,
            '4·3·2 = 24 különböző jegyű háromjegyű, fele páratlan → 12'
        ),
        q(
            'er26m-12',
            '2026/12. Két szabályos dobókockával egyszerre dobunk. Határozza meg annak a valószínűségét, hogy a két dobott szám között legalább 4 lesz a különbség! Válaszát indokolja!',
            1 / 6,
            '36 összes, 6 kedvező (6-1, 6-2, 5-1 és fordítva) → 6/36 = 1/6'
        ),
        q(
            'er26m-13a',
            '2026/13.a) Oldja meg az alábbi egyenletet a valós számok halmazán!\n(x+3)^2+2(x+3)=80',
            5,
            'x = 5 vagy x = −13',
            { alternativeAnswer: -13 }
        ),
        q(
            'er26m-13b',
            '2026/13.b) Két pozitív szám összege 15. Ha a kisebb szám háromszorosához hozzáadjuk a nagyobb szám kétszeresét, akkor ugyanazt az értéket kapjuk, mintha a nagyobb szám háromszorosából kivonjuk a kisebb szám kétszeresét. Határozza meg ezt a két számot!',
            2.5,
            'kisebb 2,5; nagyobb 12,5',
            { alternativeAnswer: 12.5 }
        ),
        q(
            'er26m-14a',
            `2026/14.a) ${set14} Jelölje az 1. ábrán satírozással a C \\ (A ∪ B) halmazt, és sorolja fel az elemeit!`,
            0,
            '{5; 25; 35}',
            { expectedSet: ['5', '25', '35'], figure: venn }
        ),
        q(
            'er26m-14b',
            `2026/14.b) ${set14} Írja fel halmazműveletek segítségével a 2. ábrán satírozással jelölt halmazt!\nÍrd be a halmazműveletet.`,
            0,
            '(A ∩ B) \\ C',
            { expectedSet: ['(A∩B)\\C'], figure: venn }
        ),
        q(
            'er26m-14c',
            `2026/14.c) ${set14} A H elemei közül véletlenszerűen kiválasztunk egyet. Határozza meg annak a valószínűségét, hogy a kiválasztott szám 2-vel osztható lesz, de 3-mal nem!`,
            16 / 49,
            '49 összes, 24 páros, 8 osztható 6-tal → 16/49 ≈ 0,327'
        ),
        q(
            'er26m-14d',
            `2026/14.d) ${set14} Van-e olyan háromjegyű pozitív egész szám, amelyik csupa azonos számjegyből áll, és 2-vel, 3-mal és 5-tel is osztható? Ha van ilyen szám, akkor adjon meg egyet, ha nincs ilyen, akkor pedig bizonyítsa be, hogy nincs!\n0 = nincs, 1 = van.`,
            0,
            'Nincs. 5-tel osztható azonos jegyű: 555, az nem páros.'
        ),
        q(
            'er26m-15aI',
            `2026/15.a) ${fStem} Határozza meg az alábbi állítások logikai értékét (igaz vagy hamis)! Válaszait itt nem kell indokolnia! Az f függvény minimumhelye az 1. Igaz=1, hamis=0.`,
            1,
            'Parabola csúcsa x=1, minimumhely. Igaz.'
        ),
        q(
            'er26m-15aII',
            `2026/15.a) ${fStem} Határozza meg az alábbi állítások logikai értékét (igaz vagy hamis)! Válaszait itt nem kell indokolnia! Az f függvény szigorúan monoton nő. Igaz=1, hamis=0.`,
            0,
            'Csúcsos parabola, nem szigorúan monoton. Hamis.'
        ),
        q(
            'er26m-15aIII',
            `2026/15.a) ${fStem} Határozza meg az alábbi állítások logikai értékét (igaz vagy hamis)! Válaszait itt nem kell indokolnia! Az f függvény egy kölcsönösen egyértelmű megfeleltetés. Igaz=1, hamis=0.`,
            0,
            'Nem injektív. Hamis.'
        ),
        q(
            'er26m-15b',
            `2026/15.b) ${fStem} Határozza meg az f zérushelyeit!`,
            -1,
            'x = −1 és x = 3',
            { alternativeAnswer: 3 }
        ),
        q(
            'er26m-15c',
            `2026/15.c) ${fStem} Válassza ki az alábbi lehetőségek közül az f értékkészletét!\nA) [1; ∞[,  B) [4; ∞[,  C) [−4; ∞[,  D) R.\nA=1, B=2, C=3, D=4.`,
            3,
            'Minimum −4, értékkészlet [−4; ∞[ → C'
        ),
        q(
            'er26m-15d',
            `2026/15.d) ${fStem} Határozza meg annak a két pontnak a távolságát, amelyek az f grafikonján helyezkednek el, és első koordinátájuk x=0, illetve x=4!`,
            Math.sqrt(80),
            'f(0)=−3, f(4)=5 → sqrt(4^2 + 8^2) = sqrt(80) ≈ 8,94'
        ),
        q(
            'er26m-16a',
            `2026/16.a) ${storm} A 2025-ös viharjelzési időszak teljes időtartamának hány százalékában volt érvényben valamilyen, első- vagy másodfokú viharjelzés a Balaton középső medencéjében? Az április, a június és a szeptember 30, a másik négy érintett hónap 31 napos.`,
            38.7,
            '214 nap = 5136 óra. 1987/5136 ≈ 38,7%'
        ),
        q(
            'er26m-16b',
            `2026/16.b) ${storm} Határozza meg, hogy átlagosan mennyi ideig volt érvényben egy másodfokú viharjelzés ebben az időszakban! Válaszát órában és percben, egész percre kerekítve adja meg!`,
            5,
            '668/115 ≈ 5,81 óra → 5 óra 49 perc',
            { alternativeAnswer: 49 }
        ),
        q(
            'er26m-16c',
            '2026/16.c) Egy világítótorony árnyéka 19 méter hosszú, amikor a Nap sugarai 70°-os szögben érik a Földet. Milyen magas a világítótorony?',
            52.2,
            'h = 19 · tg 70° ≈ 52,2 m'
        ),
        q(
            'er26m-16d',
            '2026/16.d) Az Ír-tengerhez közeli Bidston Lighthouse nevű világítótorony a tengerparttól 3 km-re található a szárazföld belseje felé. A világítótorony fénye jó látási viszonyok között körülbelül 30 km-ig látható. Határozza meg annak a területnek a nagyságát a tengeren, ahonnan jó látási viszonyok között egy, a tengerparttól 3 km-re található világítótorony fénye látható! A Föld görbületétől tekintsünk el. A tengerpartot jó közelítéssel tekinthetjük egyenesnek.',
            1234,
            'Körszelet ≈ 1233,7 km² → 1234 km²',
            { figure: light }
        ),
        q(
            'er26m-17a',
            `2026/17.a) ${teams} A kezdeményezők egy diagramon szeretnék szemléltetni a csapatok számának időbeli változását. Az alábbi diagramtípusok közül melyik a legalkalmasabb erre a célra?\nA) kördiagram  B) oszlopdiagram  C) dobozdiagram\nA=1, B=2, C=3.`,
            2,
            'Időbeli változás: oszlopdiagram. B',
            { figure: table }
        ),
        q(
            'er26m-17b',
            `2026/17.b) ${teams} A 2000-es adathoz viszonyítva hány százalékkal csökkent a csapatok száma 2025-re?`,
            31.6,
            '1554/2272 ≈ 0,684 → 31,6% csökkenés',
            { figure: table }
        ),
        q(
            'er26m-17c',
            `2026/17.c) ${teams} Azt feltételezve, hogy 2025-öt követően évről évre 2%-kal nő majd a csapatok száma, melyik évben éri el a csapatok száma ismét az 1800-at?`,
            2033,
            '1554 · 1,02^n = 1800 → n ≈ 7,41 → 2033'
        ),
        q(
            'er26m-17d',
            '2026/17.d) Egy szabványos futballkapu szélessége 7,32 méter, magassága 2,44 méter. A futballkapukra felül, hátul és a két oldalon hálót rögzítenek. Hány négyzetméter területű háló szükséges egy szabványos futballkapuhoz, ha a kaput egy olyan téglatestnek tekintjük, amelynek harmadik éle 1,5 méter hosszú?',
            36.2,
            '7,32·2,44 + 7,32·1,5 + 2·2,44·1,5 ≈ 36,2',
            { figure: goal }
        ),
        q(
            'er26m-17e',
            '2026/17.e) Egy labdarúgó-mérkőzésen egy csapatban 11 kezdőjátékos van, és mérkőzés közben legfeljebb 5 játékost lehet közülük lecserélni. A lecserélt játékosok száma tehát 0, 1, 2, 3, 4 vagy 5 lehet. Hányféleképpen választhatók ki a 11 kezdőjátékos közül a lecserélt játékosok? Két kiválasztás különböző, ha az egyikben van olyan lecserélt játékos, aki a másikban nem szerepel.',
            1024,
            'C(11,0)+…+C(11,5) = 1024 = 2^11 / 2'
        ),
        q(
            'er26m-18a',
            `2026/18.a) ${bag} Hány literesnek tekinti ezt a kézipoggyászt a légitársaság, ha tíz literre kerekítve adják meg az értéket?`,
            50,
            '50 600 cm³ = 50,6 liter → 50 liter'
        ),
        q(
            'er26m-18b',
            `2026/18.b) ${bag} Igazolja, hogy egy 75 cm hosszú esernyő még átlósan sem fér el egy ilyen szabványos kézipoggyászban!\nA beírandó szám a testátló hossza (cm).`,
            71.8,
            'sqrt(55^2+40^2+23^2) ≈ 71,8 < 75'
        ),
        q(
            'er26m-18c',
            `2026/18.c) ${airport} Határozza meg, hogy ezzel a feltételezéssel élve 2025-öt követően hányadik évben éri el a repülőtér éves utasforgalma a 30 millió főt!`,
            2037,
            '19,6 + 0,9n > 30 → n > 11,56 → 12. év = 2037'
        ),
        q(
            'er26m-18d',
            `2026/18.d) ${airport} Évi 900 ezres növekedést feltételezve a 2025. január 1. és 2040. december 31. közötti 16 évben hány utas fordul meg összesen a repülőtéren?`,
            421.6,
            'Számtani sor: S_16 = 16/2 · (2·19,6 + 15·0,9) = 421,6'
        ),
        q(
            'er26m-18e',
            '2026/18.e) Egy repülőjáraton 70 ülőhely van, ezek közül 36 ablak melletti. Az ülőhelyeket sorsolják az utasok között. Ezen a járaton fog utazni egy 3 fős baráti társaság is. Határozza meg annak a valószínűségét, hogy a baráti társaság 3 tagja közül legfeljebb az egyikük kap ablak melletti ülőhelyet!',
            26180 / 54740,
            'C(70,3)=54740; kedvező 5984+20196=26180 → ≈0,478',
            { figure: plane }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H1',
        location: 'er2026MajKozepBank.ts:getErettsegi2026MajKozepQuestions',
        message: '2026 maj kozep bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            lastId: list[list.length - 1]?.id,
            a3: list.find((x) => x.id === 'er26m-3')?.answer,
            a12: list.find((x) => x.id === 'er26m-12')?.answer,
            a17e: list.find((x) => x.id === 'er26m-17e')?.answer,
            hasGraphs: Boolean(list.find((x) => x.id === 'er26m-5')?.figure),
            hasVenn: Boolean(list.find((x) => x.id === 'er26m-14a')?.figure),
        },
        runId: 'er-2026-maj',
    });
    // #endregion

    return list;
}

export const ERETTSEGI_2026_MAJ_KOZEP_COUNT = 38;
