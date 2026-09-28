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

const FIG = '/figures/erettsegi/2025okt-kozep';

/** 2025. október 14. középszint — itemek a javítási útmutató szerint. */
export function getErettsegi2025OktKozepQuestions(): Question[] {
    const tri = imageFigure(`${FIG}/t8-triangle.png`, '2025/8. derékszögű háromszög, befogók 5 cm és 12 cm');
    const chord = imageFigure(`${FIG}/t14-chord.png`, '2025/14. OAB húr, 100°');
    const regions = imageFigure(
        `${FIG}/t14-regions.svg`,
        'A számok a három tartományt jelölik: 1 a háromszög, 2 a húr alatti szelet, 3 a többi rész.'
    );
    const expChart = imageFigure(`${FIG}/t18-solar.png`, 'Globális napelem-kapacitás, 2008–2023');
    const solar =
        'Anna a globális napelem-kapacitás alakulásával kapcsolatos projektmunkájában a 2008 és 2023 közötti időszakot tanulmányozta. Az erre az időszakra vonatkozó adatokat beírta egy táblázatkezelő programba, amely az adatokra exponenciális függvénygörbét (úgynevezett trendvonalat) is illesztett, melynek egyenlete: y = 7,67·1,27^x. Ebben a képletben x a 2007 óta eltelt évek számát, y pedig a gigawattban (GW) megadott globális napelem-kapacitást jelöli. (A globális napelem-kapacitás a Földön üzemben lévő napelemek összteljesítményét jelenti.) Az Anna által talált éves adatokat és az azokra illesztett exponenciális görbét (trendvonalat) mutatja az alábbi ábra.';
    const linChart = imageFigure(`${FIG}/t18-linear.png`, 'Globális napelem-kapacitás, 2008–2016');
    const solarLinear =
        '2008 és 2016 között a kapacitás növekedése még mérsékeltebb volt. Ebben az időszakban az adatokra a táblázatkezelő program által illesztett közelítő lineáris összefüggés: y = 7,7x − 5, ahol x a 2007 óta eltelt évek számát, y pedig a gigawattban (GW) megadott globális napelem-kapacitást jelöli. Az adatokat és az azokra illesztett lineáris trendvonalat mutatja az alábbi ábra.';

    const list: Question[] = [
        q(
            'er25o-1',
            '2025/1. x^2 − 5x + 6 = 0 a valós számokon. Írd be a két gyököt.',
            2,
            'x = 2 vagy x = 3',
            { alternativeAnswer: 3 }
        ),
        q(
            'er25o-2',
            '2025/2. a = b + c · t, ahol a = 11, b = 5, c = 2. Mennyi t?',
            3,
            't = (11 − 5)/2 = 3'
        ),
        q(
            'er25o-3I',
            '2025/3. I. Ha két rombusz területe egyenlő, akkor egybevágók. Igaz=1, hamis=0.',
            0,
            'Hamis.'
        ),
        q(
            'er25o-3II',
            '2025/3. II. Ha egy paralelogramma átlói egyenlő hosszúak, akkor téglalap. Igaz=1, hamis=0.',
            1,
            'Igaz.'
        ),
        q(
            'er25o-3III',
            '2025/3. III. Ha két vektor párhuzamos és egyenlő hosszú, akkor egyenlők. Igaz=1, hamis=0.',
            0,
            'Hamis (ellentétes irányúak is lehetnek).'
        ),
        q(
            'er25o-4',
            '2025/4. Hány éle van annak a hétpontú gráfnak, amelyben minden pont fokszáma 4?',
            14,
            '7·4/2 = 14'
        ),
        q(
            'er25o-5',
            '2025/5. Melyik egyenlő b^{2/3}-mal minden pozitív b-re?\nA) (2/3)b\nB) b^{−3/2}\nC) cuberoot(b^2)\nD) b^2 / b^3\nBetű száma: A=1 … D=4.',
            3,
            'C: (b^2)^{1/3} = b^{2/3}'
        ),
        q(
            'er25o-6',
            '2025/6. Négyen várnak az osztályterem előtt: az osztályfőnök és három diákja. Hányféle sorrendben léphetnek be egymás után a terembe, ha az osztályfőnök elsőként vagy utolsóként lép be?',
            12,
            '2 · 3! = 12'
        ),
        q(
            'er25o-7u',
            '2025/7. A = {1;2;3;5;7}, B = {1;3;5;7;9}, C = {1;4;9}.\nSorold fel A ∪ B elemeit.',
            0,
            '{1; 2; 3; 5; 7; 9}',
            { expectedSet: ['1', '2', '3', '5', '7', '9'] }
        ),
        q(
            'er25o-7d',
            '2025/7. Ugyanazok a halmazok. Sorold fel (A ∩ B) \\ C elemeit.',
            0,
            '{3; 5; 7}',
            { expectedSet: ['3', '5', '7'] }
        ),
        q(
            'er25o-8',
            '2025/8. Derékszögű háromszög befogói 5 cm és 12 cm. A két hegyesszög foka, egy tizedesre. Írd be mindkettőt.',
            22.6,
            'tg α = 5/12 → α ≈ 22,6°, β ≈ 67,4°',
            { alternativeAnswer: 67.4, figure: tri }
        ),
        q(
            'er25o-9',
            '2025/9. Egy a valós számok halmazán értelmezett függvény minden számhoz hozzárendeli a szám kétszeresénél hárommal nagyobb számot. Melyik számot rendeli ez a függvény a 7-hez?',
            17,
            '2·7 + 3 = 17'
        ),
        q(
            'er25o-10',
            '2025/10. Egy forgáskúp alapkörének sugara 3 cm, magassága 4 cm. Számítsa ki a kúp felszínét! Megoldását részletezze!',
            75.4,
            'alkotó 5 cm, A = 3π·3 + 3π·5 = 24π ≈ 75,4'
        ),
        q(
            'er25o-11',
            '2025/11. 0, 1, 1, 2, 3, 5. Írd be az átlagot és a szórást (szórás két tizedesre, ≈1,63).',
            2,
            'átlag 2, szórás sqrt(8/3) ≈ 1,63',
            { alternativeAnswer: 1.63 }
        ),
        q(
            'er25o-12',
            '2025/12. Két szabályos dobókockával egyszerre dobunk. Számítsa ki annak a valószínűségét, hogy a két dobott szám összege osztható 6-tal! Megoldását részletezze!',
            6 / 36,
            '6 kedvező / 36 = 1/6 ≈ 0,167'
        ),
        q(
            'er25o-13a',
            '2025/13.a) Számtani sorozat: a2 = 7, a4 = 13. Írd be a10-et és az első 10 tag összegét.',
            31,
            'd = 3, a1 = 4, a10 = 31, S10 = 175',
            { alternativeAnswer: 175 }
        ),
        q(
            'er25o-13b',
            '2025/13.b) Mértani sorozat: b2 = 6, b5 = −162. Írd be b10-et és az első 10 tag összegét.',
            39366,
            'q = −3, b1 = −2, b10 = 39366, S10 = 29524',
            { alternativeAnswer: 29524 }
        ),
        q(
            'er25o-14a',
            '2025/14.a) Kör r = 5 cm, középponti szög 100°. Az AB húr hossza cm-ben, két tizedesre.',
            7.66,
            'h ≈ 7,66 cm',
            { figure: chord }
        ),
        q(
            'er25o-14b',
            '2025/14.b) Az OAB háromszög területe cm²-ben, egy tizedesre.',
            12.3,
            '(1/2)·5·5·sin 100° ≈ 12,3',
            { figure: chord }
        ),
        q(
            'er25o-14c',
            '2025/14.c) A 100°-os AB ív hossza cm-ben, két tizedesre.',
            8.73,
            '100/360 · 2π·5 ≈ 8,73',
            { figure: chord }
        ),
        q(
            'er25o-14d',
            '2025/14.d) A jobb oldali ábrán látható körlap három tartományát a piros, a sárga, illetve a zöld színekkel szeretnénk kiszínezni úgy, hogy két vagy három színt használunk fel a színezéshez. (Egy tartományt egy színnel színezünk ki, szomszédos tartományok azonos színűek is lehetnek.)\nHányféleképpen színezhető ki a feltételeknek megfelelően az ábra?',
            24,
            '3^3 − 3 = 24',
            { figure: regions }
        ),
        q(
            'er25o-15mm',
            '2025/15.a) 14 lány magassága: 153, 156, 160, 162, 162, 164, 167, 169, 169, 172, 174, 174, 175, 177.\nÍrd be a minimumot és a maximumot (cm).',
            153,
            'min 153, max 177',
            { alternativeAnswer: 177 }
        ),
        q(
            'er25o-15q',
            '2025/15.a) Ugyanazok az adatok. Írd be az alsó kvartilist, a mediánt és a felső kvartilist (cm).',
            162,
            'Q1=162, medián=168, Q3=174',
            { alternativeAnswer: 168, thirdAnswer: 174 }
        ),
        q(
            'er25o-15b',
            '2025/15.b) 14 lány magassága: 153, 156, 160, 162, 162, 164, 167, 169, 169, 172, 174, 174, 175, 177.\nA 11.b osztályba járó lányok közül véletlenszerűen kiválasztunk kettőt. Határozza meg annak a valószínűségét, hogy az egyik kiválasztott lány magasabb, a másik pedig alacsonyabb 170 cm-nél!',
            45 / 91,
            '5 magasabb, 9 alacsonyabb → 45/91 ≈ 0,495'
        ),
        q(
            'er25o-15c',
            '2025/15.c) 28 tanuló átlaga 172,75 cm, érkezik egy 180 cm-es. Az új átlag (cm)?',
            173,
            '(28·172,75 + 180)/29 = 173'
        ),
        q(
            'er25o-16a',
            '2025/16.a) Az emberiség évente körülbelül 56 milliárd kávékapszulát használ el. Egy környezetvédelemmel foglalkozó honlapon az az állítás olvasható, hogy 56 milliárd darab kapszulát egymás mellé sorba állítva a kapszulák lánca 57-szer olyan hosszú lenne, mint az Egyenlítő.\nTételezzük fel, hogy egy darab kávékapszula szélessége 40 mm. Számítással igazolja, hogy ekkor a honlapon olvasható állítás jó közelítéssel igaz! (A közelítést akkor tekintjük jónak, ha a kapott érték 55 és 59 közé esik. Az Egyenlítőt tekintsük egy 6370 km sugarú körnek.)',
            56,
            '2 240 000 / 40 024 ≈ 56'
        ),
        q(
            'er25o-16b',
            '2025/16.b) Az egyik népszerű kávékapszula belseje jó közelítéssel tekinthető egy olyan csonkakúpnak, melynek méretei a következők: alapkörének átmérője 28 mm, fedőkörének átmérője 24 mm, alkotója pedig szintén 28 mm hosszú.\nMennyi kávé fér egy ilyen kapszulába? Válaszát köbcentiméterben, egészre kerekítve adja meg!',
            15,
            '≈ 14 842 mm³ → 15 cm³'
        ),
        q(
            'er25o-16c',
            '2025/16.c) Egy másik kávékapszula belseje jó közelítéssel félgömb alakú, űrtartalma 10 milliliter. Számítsa ki a félgömb sugarát!',
            1.7,
            '(2/3)π r^3 = 10 → r ≈ 1,7 cm'
        ),
        q(
            'er25o-16d',
            '2025/16.d) Egy gépsoron az elkészült kapszuláknak körülbelül az ezredrésze selejtes. (Ezt tekintjük úgy, hogy 0,001 annak a valószínűsége, hogy egy véletlenszerűen kiválasztott kapszula selejtes.)\nHatározza meg annak a valószínűségét, hogy 100 véletlenszerűen kiválasztott kapszula között nem lesz selejtes!',
            Math.pow(0.999, 100),
            '0,999^100 ≈ 0,905'
        ),
        q(
            'er25o-17a',
            '2025/17.a) Egy szemüvegeket árusító bolt egy akció során a szemüvegkeretek árából annyi százalék kedvezményt ad, ahány éves a vásárló.\nMennyit fizet egy 30 000 Ft-os szemüvegkeretért egy 37 éves vásárló az akció során?',
            18900,
            '30 000 · 0,63 = 18 900'
        ),
        q(
            'er25o-17b',
            '2025/17.b) Egy szemüvegeket árusító bolt egy akció során a szemüvegkeretek árából annyi százalék kedvezményt ad, ahány éves a vásárló.\nHány éves az a vásárló, aki az akció során egy 30 000 Ft-os szemüvegkeretért 16 500 Ft-ot fizet?',
            45,
            '16500/30000 = 55% → 45 éves'
        ),
        q(
            'er25o-17c',
            '2025/17.c) Egy szemüvegeket árusító bolt egy akció során a szemüvegkeretek árából annyi százalék kedvezményt ad, ahány éves a vásárló.\nPéter nagymamája háromszor annyi éves, mint Péter. Ha mindketten egy-egy 30 000 Ft-os szemüvegkeretet vásárolnának meg az akció során, akkor Péter háromszor annyit fizetne a keretért, mint a nagymamája.\nHány éves Péter, és hány éves a nagymamája?',
            25,
            'Péter 25, nagymama 75',
            { alternativeAnswer: 75 }
        ),
        q(
            'er25o-17d',
            '2025/17.d) Egy 32 fős végzős osztályba járó fiúk és lányok számának aránya 5:3. Az osztály tanulói közül 11-en szemüvegesek, köztük 7 fiú. A matematikaérettségi napján az összes tanuló között 3 olyan van, aki nem töltötte be a 18. életévét, mindhárman lányok, egyikük szemüveges.\nHány olyan lány jár az osztályba, aki nem szemüveges és betöltötte a 18. életévét?',
            6,
            '12 lány, 4 szemüveges, 2 kiskorú nem szemüveges → 6'
        ),
        q(
            'er25o-18a',
            `2025/18.a) ${solar}\nSzámítsa ki, hogy az adatokra illesztett görbe megadott egyenletéből kiszámítható 2020-as érték mennyivel tér el a grafikonon megadott 2020-as adattól!`,
            25.5,
            'x=13 → y≈171,5; 171,5 − 146 = 25,5',
            { figure: expChart }
        ),
        q(
            'er25o-18b',
            `2025/18.b) ${solar}\nA görbe egyenletéből számítva évente hány százalékkal nőtt 2008 és 2023 között a globális napelem-kapacitás?`,
            27,
            '1,27-szeres → 27%',
            { figure: expChart }
        ),
        q(
            'er25o-18c',
            `2025/18.c) ${solar}\nA görbe egyenlete alapján melyik évben érné el a globális napelem-kapacitás a 3000 gigawattot?`,
            2032,
            '7,67·1,27^x = 3000 → x≈24,97 → 2032',
            { figure: expChart }
        ),
        q(
            'er25o-18d',
            `2025/18.d) ${solarLinear}\nHány százalékkal kevesebb a lineáris összefüggés alapján kiszámítható 2016-os érték a grafikonon megadott 2016-os adatnál?`,
            16.5,
            'y=64,3; 64,3/77≈0,835 → 16,5%',
            { figure: linChart }
        ),
        q(
            'er25o-18e',
            `2025/18.e) ${solarLinear}\nAnna szeretné tudni, hogy az első (2008) és a kilencedik (2016) év adataira illeszthető egyenes egyenlete mennyire hasonlít a program által megadott lineáris összefüggésre.\nÍrja fel annak az egyenesnek az egyenletét, amely illeszkedik az (1; 7) és (9; 77) pontokra!`,
            8.75,
            'y = 8,75x − 1,75',
            { alternativeAnswer: -1.75, figure: linChart }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H1',
        location: 'er2025OktKozepBank.ts:getErettsegi2025OktKozepQuestions',
        message: '2025 okt kozep bank loaded',
        data: {
            total: list.length,
            firstId: list[0]?.id,
            lastId: list[list.length - 1]?.id,
            a4: list.find((x) => x.id === 'er25o-4')?.answer,
            a6: list.find((x) => x.id === 'er25o-6')?.answer,
            a14d: list.find((x) => x.id === 'er25o-14d')?.answer,
            a18c: list.find((x) => x.id === 'er25o-18c')?.answer,
        },
        runId: 'er-2025-okt',
    });
    // #endregion

    return list;
}

export const ERETTSEGI_2025_OKT_KOZEP_COUNT = 38;
