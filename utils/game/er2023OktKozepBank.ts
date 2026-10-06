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

const FIG = '/figures/erettsegi/2023okt-kozep';

/** 2023. október 17. középszint (2313) — válaszok a javítási útmutató szerint. */
export function getErettsegi2023OktKozepQuestions(): Question[] {
    const paraStem =
        'Az ABCD paralelogramma AB oldala 8 cm, AC átlója 11 cm hosszú. Az AB oldal és az AC átló 32°-os szöget zár be egymással.';
    const pillowStem =
        'Egy párnákat gyártó cég a képen látható ülőpárnát szivacsból készíti, majd szövettel befedi. A szivacsból először egy 42 cm átmérőjű, 7 cm magasságú körhengert vágnak ki. Ezután a henger közepéből kivágnak egy 18 cm átmérőjű kisebb körhengert. A két henger alapkörének középpontja egybeesik.';
    const vennStem =
        'A H alaphalmaz a négyszögek halmaza. Az alábbi Venn-diagramon a H három részhalmaza látható. Írja be az alábbi négyszögek betűjelét a diagram megfelelő részébe! N: Egy négyzet. T: Egy téglalap, melynek oldalai 3, illetve 5 cm hosszúak. R: Egy rombusz, melynek egyik szöge 60°-os. P: Egy paralelogramma, melynek oldalai 3, illetve 5 cm hosszúak, és egyik szöge 60°-os.';
    const para = imageFigure(`${FIG}/p14-1.png`, '2023/14. ABCD paralelogramma');
    const color = imageFigure(`${FIG}/p16-1.jpeg`, '2023/14.d) színezés');
    const pillow = imageFigure(`${FIG}/p22-1.jpeg`, '2023/18. szivacspárna');

    const list: Question[] = [
        q(
            'er23o-1',
            '2023/1. Adja meg az 1848 prímtényezős felbontását!\nÍrd be a különböző prímtényezőket.',
            0,
            '1848 = 2³ · 3 · 7 · 11',
            { expectedSet: ['2', '3', '7', '11'] }
        ),
        q(
            'er23o-2',
            '2023/2. Egy építkezésre teherautókkal szállítják a homokot. Öt egyforma teherautó mindegyikének nyolcszor kellene fordulnia, hogy az összes homokot odaszállítsák. Hány fordulóval tudná odaszállítani ugyanezt a mennyiségű homokot négy ugyanekkora teherautó?',
            10,
            '5·8 / 4 = 10'
        ),
        q(
            'er23o-3a',
            '2023/3.a) Egy derékszögű háromszög két befogója 10 és 24 cm hosszú. Számítsa ki az átfogó hosszát, és a 10 cm-es befogóval szemközti szög nagyságát! Válaszát indokolja!\nAz átfogó hossza (cm):',
            26,
            'sqrt(10²+24²) = 26'
        ),
        q(
            'er23o-3b',
            '2023/3.b) Egy derékszögű háromszög két befogója 10 és 24 cm hosszú. Számítsa ki az átfogó hosszát, és a 10 cm-es befogóval szemközti szög nagyságát! Válaszát indokolja!\nA 10 cm-es befogóval szemközti szög nagysága (fok):',
            22.62,
            'tg α = 10/24 → α ≈ 22,62°'
        ),
        q(
            'er23o-4',
            '2023/4. Válassza ki az alábbi, a valós számok halmazán értelmezett függvények közül azt, amelyik nem vesz fel negatív értéket!\nA) f(x)=x+3\nB) f(x)=x²−3\nC) f(x)=x−3\nA=1, B=2, C=3.',
            3,
            'C: f(x)=x−3'
        ),
        q(
            'er23o-5',
            '2023/5. Egy autók bérbeadásával foglalkozó cég honlapja szerint ha legfeljebb 5 napra bérlünk egy bizonyos típust, akkor a bérlés díja 7500 Ft/nap. Ha legalább 6 napra béreljük ugyanezt a típust, akkor a bérlés díja csak 6300 Ft/nap. Mennyivel magasabb a teljes bérleti díj, ha 5 nap helyett 6 napra béreljük ezt a típust?',
            300,
            '6·6300 − 5·7500 = 300'
        ),
        q(
            'er23o-6',
            '2023/6. Egy meteorológiai állomáson november első hetében az alábbi napi hőmérsékleti maximumokat mérték (°C)-ban: 9, 5, 6, 9, 6, 6, 8. Adja meg az adatok átlagát, terjedelmét és mediánját!',
            7,
            'átlag=7, terjedelem=4, medián=6',
            { alternativeAnswer: 4, thirdAnswer: 6 }
        ),
        q(
            'er23o-7',
            '2023/7. Egy dobozban 10 piros és néhány zöld golyó van. Tudjuk, hogy ha egy golyót kihúzunk véletlenszerűen a dobozból, akkor annak 2/3 a valószínűsége, hogy a golyó piros. Hány zöld golyó van a dobozban?',
            5,
            '10/(10+z)=2/3 → z=5'
        ),
        q(
            'er23o-8',
            '2023/8. Bontsa fel a zárójeleket az alábbi kifejezésben, és végezze el a lehetséges összevonásokat! Megoldását részletezze!\n(a+1)(a−1)+(a+4)²\nA beírandó szám a kifejezés konstans tagja.',
            15,
            'a²−1 + a²+8a+16 = 2a²+8a+15'
        ),
        q(
            'er23o-9',
            '2023/9. Egy vasúti tartálykocsi tömege üres tartállyal 23,8 tonna. Ebben a tartálykocsiban maximum 60 000 liter üzemanyagot szállíthatnak. Egy liter üzemanyag tömege 0,85 kg. Hány tonna a tartálykocsi tömege tele tartállyal? Megoldását részletezze!',
            74.8,
            '51 000 kg = 51 t; 51+23,8 = 74,8'
        ),
        q(
            'er23o-10',
            '2023/10. Egy kör egyenlete: (x−2)²+(y−4)²=25. Adja meg a kör középpontjának koordinátáit és a kör sugarát!',
            2,
            'O(2; 4), r=5',
            { alternativeAnswer: 4, thirdAnswer: 5 }
        ),
        q(
            'er23o-11',
            '2023/11. Adja meg a nemnegatív valós számok halmazán értelmezett f(x)=√x−3 függvény zérushelyét!',
            9,
            '√x = 3 → x=9'
        ),
        q(
            'er23o-12',
            '2023/12. Egy szabályos pénzérmét háromszor feldobunk. Határozza meg annak a valószínűségét, hogy a három dobás közül pontosan egy lesz fej! Válaszát indokolja!',
            0.375,
            'C(3,1)/8 = 3/8 = 0,375'
        ),
        q(
            'er23o-13a',
            '2023/13.a) Adott a valós számok halmazán értelmezett f függvény: f(x)=(x−3)²+2. Mit rendel az f függvény az x=3,5-hez?',
            2.25,
            '(0,5)²+2 = 2,25'
        ),
        q(
            'er23o-13b',
            '2023/13.b) Adott a valós számok halmazán értelmezett f függvény: f(x)=(x−3)²+2. Mely számokhoz rendeli az f függvény a 6-ot?',
            1,
            'x=1 vagy x=5',
            { alternativeAnswer: 5 }
        ),
        q(
            'er23o-13c',
            '2023/13.c) Adott a valós számok halmazán értelmezett f függvény: f(x)=(x−3)²+2. Válassza ki az alábbiak közül az f függvény értékkészletét!\nA: [−3; ∞[,  B: [2; ∞[,  C: [3; ∞[,\nD: [2; 3],  E: ℝ.\nA=1, B=2, C=3, D=4, E=5.',
            2,
            'B'
        ),
        q(
            'er23o-13d',
            '2023/13.d) Adott a valós számok halmazán értelmezett f függvény: f(x)=(x−3)²+2. Oldja meg az x²−6x+11≤3 egyenlőtlenséget az egész számok halmazán!',
            2,
            '2, 3, 4',
            { alternativeAnswer: 3, thirdAnswer: 4 }
        ),
        q(
            'er23o-14a',
            `2023/14.a) ${paraStem} Számítsa ki a BC oldal hosszát!`,
            6,
            'koszinusztétel → BC≈6',
            { figure: para }
        ),
        q(
            'er23o-14b',
            `2023/14.b) ${paraStem} Számítsa ki a paralelogramma területét!`,
            46.6,
            '11·8·sin32° ≈ 46,6',
            { figure: para }
        ),
        q(
            'er23o-14c',
            `2023/14.c) ${paraStem} Az AC átló felezőpontjából az AB-re bocsátott merőleges szakasz talppontját jelölje T. Számítsa ki, mekkora részekre osztja az AB oldalt a T pont!`,
            4.66,
            'AT≈4,66 cm, TB≈3,34 cm',
            { alternativeAnswer: 3.34, figure: para }
        ),
        q(
            'er23o-14d',
            `2023/14.d) ${paraStem} Az ABCD paralelogrammát a két átlója négy tartományra osztja. Ezeket kiszínezzük pirosra, sárgára vagy kékre úgy, hogy minden színt legalább egy tartomány kiszínezéséhez felhasználunk, és oldalszomszédos tartományok nem lehetnek azonos színűek. Hányféleképpen színezhető ki a paralelogramma a feltételeknek megfelelően?`,
            12,
            '3·2·2 = 12',
            { figure: color }
        ),
        q(
            'er23o-15bI',
            `2023/15.b) ${vennStem} Határozza meg az alábbi állítások logikai értékét (igaz vagy hamis)! Válaszait indokolja! Ha az A és a B halmaznak is két eleme van, akkor az A∪B halmaz négyelemű. Igaz=1, hamis=0.`,
            0,
            'Hamis, pl. A={1;2}, B={1;3}.'
        ),
        q(
            'er23o-15bII',
            `2023/15.b) ${vennStem} Határozza meg az alábbi állítások logikai értékét (igaz vagy hamis)! Válaszait indokolja! A kétjegyű négyzetszámok halmazának hat eleme van. Igaz=1, hamis=0.`,
            1,
            '16, 25, 36, 49, 64, 81'
        ),
        q(
            'er23o-16a',
            '2023/16.a) Az előző tanévben Janka történelemből kapott első három jegye 3, 3, 4 volt. A tanév hátralevő részében már csak ötösöket kapott. Hány ötöst kapott összesen történelemből Janka, ha tudjuk, hogy a tanév végén éppen 4,5 lett az átlaga?',
            7,
            '(10+5n)/(3+n)=4,5 → n=7'
        ),
        q(
            'er23o-16b',
            '2023/16.b) Janka a szüleitől minden hónapban annyiszor 1000 Ft zsebpénzt kap, ahányadik évfolyamra éppen jár. Az elsőtől a tizenkettedikig Janka egy-egy évfolyamra mindig 12 hónapig jár. Összesen mennyi zsebpénzt kap Janka a 12 év alatt, amíg elvégzi az általános és a középiskolát?',
            936000,
            '12·1000·(1+…+12)=12·1000·78=936000'
        ),
        q(
            'er23o-16c',
            '2023/16.c) Egy mértani sorozat hányadosa 3, a sorozat első kilenc tagjának az összege 59 046. Határozza meg a sorozat első és kilencedik tagját!',
            39366,
            'a1=6; a9=6·3⁸=39366',
            { alternativeAnswer: 6 }
        ),
        q(
            'er23o-16d',
            '2023/16.d) Egy bankban 50 000 Ft-ot helyezünk el évi p százalékos kamatos kamatra. Három év elteltével a kamatokkal növelt összeg 59 046 Ft. Számítsa ki p értékét!',
            5.7,
            'p≈5,7'
        ),
        q(
            'er23o-17a',
            '2023/17.a) Egy gyorsvonat a mozdony mögött öt másodosztályú személykocsiból, egy kerékpárszállító kocsiból, valamint egy étkezőkocsiból áll. Hányféle sorrendben állíthatják össze a hét kocsit, ha a másodosztályú személykocsikat nem különböztetjük meg egymástól?',
            42,
            '7!/5! = 42'
        ),
        q(
            'er23o-17b',
            '2023/17.b) Ha jegykiadó automatából vásároljuk meg a vonatjegyet, akkor a jegy árából 5% kedvezményt kapunk. Hány Ft annak a vonatjegynek a kedvezmény nélküli ára, melyért jegykiadó automatából vásárolva 3040 Ft-ot fizettünk?',
            3200,
            '3040/0,95 = 3200'
        ),
        q(
            'er23o-17c',
            '2023/17.c) 2022 januárjában egy havi vasúti tanulóbérlet ára 30 km-es távolságra 2140 Ft volt, erre további kedvezmény nem járt. Ugyanerre a távolságra egy tanulónak a menetjegy ára 280 Ft volt, amelyből 5% kedvezményt kapott az utas, ha jegykiadó automatából vásárolta meg a jegyet. A középiskolás Ábel ebben a hónapban többször utazott vonattal ezen a 30 km-es távolságon, így már jobban megérte neki havi tanulóbérletet venni. Ha eggyel kevesebbszer utazott volna, akkor viszont olcsóbb lett volna egyesével, jegykiadó automatából jegyeket vásárolnia. Hányszor utazott ebben a hónapban Ábel ezen a 30 km-es távolságon?',
            9,
            '2140/266≈8,05 → 9 utazás'
        ),
        q(
            'er23o-17d',
            '2023/17.d) A négytagú Kiss és az öttagú Nagy család vonattal utazott közös nyaralásuk helyszínére. A Kiss család két teljes árú, egy 20%-os mérséklésű és egy 50%-os mérséklésű menetjegyet, valamint négy gyorsvonati pótjegyet vett a jegypénztárban. Ezekért összesen 7960 Ft-ot fizettek. A Nagy család öt 90%-os mérséklésű menetjegyet és öt gyorsvonati pótjegyet vett a jegypénztárban. Ők ezekért összesen 1975 Ft-ot fizettek. A gyorsvonati pótjegyek ára egységes. A 20%-os, 50%-os, illetve 90%-os mérséklésű menetjegy azt jelenti, hogy a jegy ára a teljes árú menetjegy áránál rendre annak 20, 50, illetve 90%-ával kevesebb. Mennyibe került az adott utazáson egy teljes árú menetjegy, és mennyibe került egy gyorsvonati pótjegy?',
            2200,
            'x=2200 Ft, y=175 Ft',
            { alternativeAnswer: 175 }
        ),
        q(
            'er23o-18a',
            `2023/18.a) ${pillowStem} Számítsa ki a párna szivacsos részének térfogatát!`,
            7917,
            'π·21²·7 − π·9²·7 ≈ 7917',
            { figure: pillow }
        ),
        q(
            'er23o-18b',
            `2023/18.b) ${pillowStem} Mennyi szövetre van szükség 30 párna befedéséhez? Válaszát négyzetméterben, egészre kerekítve adja meg! A veszteségektől itt eltekintünk.`,
            11,
            '30·3582 cm² = 10,746 m² → 11 m²',
            { figure: pillow }
        ),
        q(
            'er23o-18c',
            `2023/18.c) ${pillowStem} A gyártás során egy párna 0,03 valószínűséggel selejtes lesz. Határozza meg annak a valószínűségét, hogy 30 legyártott párnából legfeljebb egy lesz selejtes!`,
            0.773,
            '0,97³⁰ + C(30,1)·0,03·0,97²⁹ ≈ 0,773',
            { figure: pillow }
        ),
    ];

    // #region agent log
    agentDebugLog({
        hypothesisId: 'H12',
        location: 'er2023OktKozepBank.ts',
        message: '2023 okt kozep bank',
        data: { total: list.length, firstId: list[0]?.id },
        runId: 'er-batch-2325',
    });
    // #endregion
    return list;
}

export const ERETTSEGI_2023_OKT_KOZEP_COUNT = 34;
