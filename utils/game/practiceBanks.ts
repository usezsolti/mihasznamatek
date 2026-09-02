import type { Question } from './types';

// Paraméteres egyenletek — 6×20 (lásd parameterLevels.ts)
import { getParameterPracticeQuestions as getParameterRaw } from './parameterLevels';

export const getParameterPracticeQuestions = (): Question[] => {
    const list = getParameterRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Exponenciális és logaritmusos gyakorló feladatok (emelt algebra munkalap 1–16)
export const getExponentialLogPracticeQuestions = (): Question[] => [
    {
        question: `1. Értelmezési tartomány\n\nAdd meg a valós számok halmazának azt a legbővebb részhalmazát, amelyen az alábbi kifejezések értelmezhetők!\n\na) log₃(√(2x − 1))\nb) √(log₂(x + 3))\nc) log_{x−1}(9 − x²)\nd) √(x + 4) / log₂(x − 2)\n\nAdd meg:\n1) a) alsó határát (nyílt), 3 tizedesjegyre;\n2) b) alsó határát (zárt);\n3) d) kizárt belső pontját!`,
        answer: 0.5,
        alternativeAnswer: -2,
        thirdAnswer: 3,
        type: 'multiplication',
        expression: `a) 2x−1 > 0 → x > 1/2\nb) log₂(x+3) ≥ 0 → x+3 ≥ 1 → x ≥ −2\nc) (1,2) ∪ (2,3)\nd) x > 2 és x ≠ 3`
    },
    {
        question: `2. Gyökös egyenletek\n\nOldd meg a valós számok halmazán!\n\na) √(x + 5) = 3 − x\nb) √(3x − 2) = x\nc) √(2x + 7) − √(x + 3) = 1\n\nAdd meg a) megoldását 3 tizedesjegyre, majd b) két megoldását!`,
        answer: 0.628,
        alternativeAnswer: 1,
        thirdAnswer: 2,
        type: 'multiplication',
        expression: `a) x = (7−√33)/2 ≈ 0,628\nb) x = 1 és x = 2\nc) x = −3 vagy x = 1`
    },
    {
        question: `2c. Gyökös egyenlet\n\nOldd meg a valós számok halmazán!\n\n√(2x + 7) − √(x + 3) = 1\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
        answer: -3,
        alternativeAnswer: 1,
        type: 'multiplication',
        expression: `√(2x+7) = 1 + √(x+3) → t = √(x+3): t² = 2t → x = −3 vagy x = 1`
    },
    {
        question: `3. Két gyökös tagot tartalmazó egyenlet\n\nOldd meg a valós számok halmazán!\n\n√(5x − 4) = √(x + 8) + 2\n\nA megoldás során minden négyzetre emelés előtt vizsgáld meg az ekvivalencia feltételeit!\n\nAdd meg a megoldást!`,
        answer: 8,
        type: 'multiplication',
        expression: `x − 4 = √(x+8) (x ≥ 4) → x² − 9x + 8 = 0 → x = 8`
    },
    {
        question: `7. Exponenciális egyenletek\n\nOldd meg a valós számok halmazán!\n\na) 3^{2x−1} = 27^{x−2}\nb) 2^{x+2} + 2^x = 80\nc) 4^x − 5·2^x + 4 = 0\nd) 9^x + 3^{x+1} − 18 = 0\n\nAdd meg a), b), d) megoldását, majd c) nagyobbik megoldását!`,
        answer: 5,
        alternativeAnswer: 4,
        thirdAnswer: 1,
        fourthAnswer: 2,
        type: 'multiplication',
        expression: `a) x = 5\nb) x = 4\nc) x = 0 vagy 2\nd) x = 1`
    },
    {
        question: `8. Helyettesítéssel megoldható exponenciális egyenlet\n\nOldd meg a valós számok halmazán!\n\n5^{2x} − 26·5^x + 25 = 0\n\nA megoldás során vezess be új ismeretlent: t = 5^x.\n\nAdd meg a két megoldást (tetszőleges sorrendben)!`,
        answer: 0,
        alternativeAnswer: 2,
        type: 'multiplication',
        expression: `t = 5^x: t² − 26t + 25 = 0 → t = 1 vagy 25 → x = 0 vagy 2`
    },
    {
        question: `9. Exponenciális egyenlőtlenségek\n\nOldd meg a valós számok halmazán!\n\na) 2^{3x−1} > 16\nb) (1/3)^{2x+1} ≤ 27\nc) 4^x − 5·2^x + 4 ≤ 0\n\nAdd meg:\n1) a) alsó határát 3 tizedesjegyre (x > …);\n2) b) alsó határát (x ≥ …);\n3) c) alsó, majd felső határát (zárt)!`,
        answer: 1.667,
        alternativeAnswer: -2,
        thirdAnswer: 0,
        fourthAnswer: 2,
        type: 'multiplication',
        expression: `a) x > 5/3 ≈ 1,667\nb) x ≥ −2\nc) 0 ≤ x ≤ 2`
    },
    {
        question: `10. Logaritmusos egyenletek\n\nOldd meg a valós számok halmazán!\n\na) log₂(x − 1) = 3\nb) log₃(x + 5) + log₃(x − 1) = 2\nc) log₂(x + 2) − log₂(x − 2) = 1\nd) lg x + lg(x − 9) = 2\n\nAdd meg a), c) megoldását, majd b) és d) megoldását 3 tizedesjegyre!`,
        answer: 9,
        alternativeAnswer: 6,
        thirdAnswer: 2.243,
        fourthAnswer: 15.466,
        type: 'multiplication',
        expression: `a) x = 9\nb) x ≈ 2,243\nc) x = 6\nd) x ≈ 15,466`
    },
    {
        question: `11. Logaritmusos egyenlőtlenségek\n\nOldd meg a valós számok halmazán!\n\na) log₂(3x − 1) ≥ 3\nb) log_{1/2}(x + 4) < −2\nc) Hány egész szám elégíti ki: log₃(2x + 7) ≤ 4?\n\nAdd meg:\n1) a) alsó határát (x ≥ …);\n2) b) alsó határát (x > …);\n3) c) egész megoldások számát!`,
        answer: 3,
        alternativeAnswer: 0,
        thirdAnswer: 41,
        type: 'multiplication',
        expression: `a) x ≥ 3\nb) x > 0\nc) −3,…,37 → 41 db`
    },
    {
        question: `12. Változó alapú logaritmus\n\nOldd meg a valós számok halmazán!\n\nlog_{x−1}(x + 5) = 2\n\nA megoldás során külön vizsgáld meg: x−1 > 0, x−1 ≠ 1, x+5 > 0.\n\nAdd meg a megoldást!`,
        answer: 4,
        type: 'multiplication',
        expression: `x+5 = (x−1)² → x = 4`
    },
    {
        question: `13. Logaritmikus egyenletrendszer\n\nOldd meg az alábbi egyenletrendszert, ahol x és y pozitív valós számok!\n\nx + y = 10\nlog₂ x + log₂ y = 4\n\nAdd meg a két lehetséges x (vagy y) értéket (tetszőleges sorrendben)!`,
        answer: 2,
        alternativeAnswer: 8,
        type: 'multiplication',
        expression: `xy = 16, x+y = 10 → (2,8) és (8,2)`
    },
    {
        question: `14. Vegyes gyökös és logaritmikus feladat\n\nOldd meg a valós számok halmazán!\n\nlog₂(√(x + 1)) = 2\n\nEllenőrizd, hogy a kapott megoldás eleme-e az értelmezési tartománynak!\n\nAdd meg a megoldást!`,
        answer: 15,
        type: 'multiplication',
        expression: `√(x+1) = 4 → x = 15`
    },
    {
        question: `15. Szöveges exponenciális feladat\n\nEgy baktériumtenyészetben kezdetben 500 baktérium. Számuk óránként 25%-kal nő:\nN(t) = 500 · 1,25^t\n\na) Hány baktérium lesz 4 óra múlva?\nb) Hány óra múlva lesz először legalább 2000?\nc) Az aₙ = 500 · 1,25ⁿ sorozat monoton növekvő? (1 = igen, 0 = nem)\n\nAdd meg a), b) értékét 3 tizedesjegyre, majd c) válaszát!`,
        answer: 1220.703,
        alternativeAnswer: 6.213,
        thirdAnswer: 1,
        type: 'multiplication',
        expression: `a) N(4) = 1220,703\nb) t ≈ 6,213\nc) q = 1,25 > 1 → szigorúan monoton növekvő`
    },
    {
        question: `16. Mihaszna-mesterfok\n\nOldd meg a valós számok halmazán!\n\na) √(x + 6) + √(10 − x) = 4\nb) 2^{x+1} + 2^{1−x} = 5\n\nAdd meg a) két megoldását, majd b) két megoldását (tetszőleges sorrendben)!`,
        answer: -6,
        alternativeAnswer: 10,
        thirdAnswer: -1,
        fourthAnswer: 1,
        type: 'multiplication',
        expression: `a) x = −6 és x = 10\nb) x = −1 és x = 1`
    },
    {
        question: `16c–d. Mihaszna-mesterfok\n\nOldd meg a valós számok halmazán!\n\nc) log₂(x − 1) + log₂(x + 3) = 3\nd) |x − 1| = √(x + 5)\n\nAdd meg c) megoldását 3 tizedesjegyre, majd d) két megoldását!`,
        answer: 2.464,
        alternativeAnswer: -1,
        thirdAnswer: 4,
        type: 'multiplication',
        expression: `c) x = −1 + 2√3 ≈ 2,464\nd) x = −1 vagy x = 4`
    }
];


// Abszolútértékes és gyökös kifejezések — 6×20 (lásd absrootLevels.ts)
import { getAbsoluteRootPracticeQuestions as getAbsRootRaw } from './absrootLevels';
import { agentDebugLog } from '../agentDebugLog';

export const getAbsoluteRootPracticeQuestions = (): Question[] => {
    const list = getAbsRootRaw().map((q) => {
        // Egy válasz / kártya — ne legyen több mező
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    let multiAnswer = 0;
    let withHeader = 0;
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
        if ((q as Question).alternativeAnswer !== undefined || (q as Question).thirdAnswer !== undefined) {
            multiAnswer += 1;
        }
        if (/^\d+\.\s*szint/i.test(String(q.question || ''))) withHeader += 1;
    });
    agentDebugLog({
        hypothesisId: 'B',
        location: 'practiceBanks.ts:getAbsoluteRootPracticeQuestions',
        message: 'absroot single-answer bank loaded',
        data: {
            total: list.length,
            byStage,
            multiAnswer,
            withHeader,
            sample: String(list[0]?.question || '').slice(0, 80),
        },
        runId: 'single-q',
    });
    // #endregion
    return list;
};

// Függvények és analízis (emelt munkalap 1–10) — numerikus ellenőrző kérdések
export const getFunctionsPracticeQuestions = (): Question[] => [
    {
        question: `1. Paraméteres függvény\n\nLegyen p valós paraméter, és tekintsük a valós számok halmazán értelmezett\nfₚ(x) = −2x³ + (p − 1)x² + (p² − 4)x − 3 függvényt!\n\na) Számítsd ki a ∫₀² fₚ(x) dx határozott integrál értékét, ha p = 2!\nb) Határozd meg p értékét úgy, hogy az x = 1 az fₚ függvény zérushelye legyen!\nc) Határozd meg p összes lehetséges értékét úgy, hogy fₚ'(1) > 0 teljesüljön!\n\nAdd meg:\n1) a) értékét 3 tizedesjegyre;\n2) b) pozitív p értékét 3 tizedesjegyre;\n3) c) alsó, majd felső határát (p < … vagy p > …) 3 tizedesjegyre!`,
        answer: -11.333,
        alternativeAnswer: 2.702,
        thirdAnswer: -4.606,
        fourthAnswer: 2.606,
        type: 'multiplication',
        expression: `a) p=2: f₂(x)=−2x³+x²−3 → ∫₀² = −34/3 ≈ −11,333\nb) fₚ(1)=0 → p²+p−10=0 → p = (−1±√41)/2 ≈ 2,702 és −3,702\nc) fₚ'(1)=p²+2p−12 > 0 → p < −1−√13 vagy p > −1+√13 ≈ −4,606 illetve 2,606`
    },
    {
        question: `2. Konzervdoboz optimalizálása\n\nEgy üzemben 1500 cm³ térfogatú, zárt, forgáshenger alakú dobozokat gyártanak. A doboz alap- és fedőlapjához használt anyag ára 0,3 Ft/cm², a palást anyagának ára pedig 0,15 Ft/cm². Jelölje r a doboz alapkörének sugarát, h pedig a magasságát centiméterben!\n\na) Fejezd ki a doboz h magasságát az r sugár segítségével!\nb) Igazold, hogy a doboz teljes anyagköltségét a\nK(r) = 0,6πr² + 450/r, r > 0\nfüggvény adja meg!\nc) Határozd meg a doboz optimális sugarát és magasságát úgy, hogy az anyagköltség minimális legyen! Válaszodat centiméterben, egy tizedesjegyre kerekítve add meg!\n\nAdd meg c) optimális sugarát, majd magasságát (egy tizedesjegy)!`,
        answer: 4.9,
        alternativeAnswer: 19.7,
        type: 'multiplication',
        expression: `a) h = 1500/(πr²)\nb) K = 0,6πr² + 0,3πrh = 0,6πr² + 450/r\nc) K'(r)=0 → r³ = 375/π → r ≈ 4,9 cm, h ≈ 19,7 cm`
    },
    {
        question: `3. Függvényvizsgálat\n\nLegyen f: ]−3; 4[ → ℝ, f(x) = x³ − 3x² − 9x + 5.\n\na) Határozd meg az f' deriváltfüggvényt és annak zérushelyeit!\nb) Vizsgáld meg az f függvényt monotonitás szempontjából!\nc) Határozd meg az f függvény lokális szélsőértékeinek helyét és értékét!\nd) Add meg azt a g primitív függvényt, amelyre g'(x) = f(x) és g(1) = 0.\n\nAdd meg:\n1) f' kisebbik, majd nagyobbik zérushelyét;\n2) a lokális maximum értékét;\n3) a lokális minimum értékét!`,
        answer: -1,
        alternativeAnswer: 3,
        thirdAnswer: 10,
        fourthAnswer: -22,
        type: 'multiplication',
        expression: `f'(x)=3x²−6x−9=3(x+1)(x−3)\nNövekvő: ]−3,−1] és [3,4[; csökkenő: [−1,3]\nLok. max: f(−1)=10; lok. min: f(3)=−22\ng(x)=x⁴/4 − x³ − (9/2)x² + 5x + 1/4`
    },
    {
        question: `4. Érintő és területszámítás\n\nLegyen f(x) = 4x − x².\n\na) Igazold, hogy a függvény grafikonja az x = 0 és x = 4 helyeken metszi az x tengelyt!\nb) Írd fel a görbe x = 1 abszcisszájú pontjában húzott érintőjének egyenletét!\nc) Számítsd ki a görbe és az x tengely által közbezárt korlátos síkidom területét!\n\nAdd meg:\n1) az érintő meredekségét;\n2) az érintő y-tengelymetszetét;\n3) a területet 3 tizedesjegyre!`,
        answer: 2,
        alternativeAnswer: 1,
        thirdAnswer: 10.667,
        type: 'multiplication',
        expression: `a) f(0)=f(4)=0\nb) f'(x)=4−2x, f'(1)=2, f(1)=3 → y = 2x + 1\nc) ∫₀⁴ (4x−x²) dx = 32/3 ≈ 10,667`
    },
    {
        question: `5. Két függvény kapcsolata\n\nLegyen f(x) = 2x + 3 és g(x) = x² − 1.\n\na) Határozd meg a 2f + g függvény zérushelyeit!\nb) Határozd meg az f és g függvény grafikonjainak metszéspontjait!\nc) Számítsd ki az f és g függvények grafikonja által közbezárt korlátos síkidom területét!\nd) Legyen h(x) = g(x)/f(x). Határozd meg a h függvény értelmezési tartományát!\n\nAdd meg:\n1) a) valós zérushelyeinek számát;\n2) b) kisebbik, majd nagyobbik x-koordinátáját 3 tizedesjegyre;\n3) c) területét 3 tizedesjegyre!`,
        answer: 0,
        alternativeAnswer: -1.236,
        thirdAnswer: 3.236,
        fourthAnswer: 14.907,
        type: 'multiplication',
        expression: `a) 2f+g = x²+4x+5, D<0 → 0 db zérushely\nb) x = 1±√5 ≈ −1,236 és 3,236\nc) T = 20√5/3 ≈ 14,907\nd) ℝ ∖ {−3/2}`
    },
    {
        question: `6. Téglalap maximális területtel\n\nEgy 20 cm kerületű téglalap egyik oldalának hossza x cm.\n\na) Fejezd ki a téglalap másik oldalának hosszát x segítségével!\nb) Igazold, hogy a téglalap területét a T(x) = 10x − x², 0 < x < 10 függvény adja meg!\nc) Határozd meg a téglalap oldalainak hosszát úgy, hogy a területe maximális legyen!\nd) Határozd meg a maximális területét!\n\nAdd meg:\n1) a) értékét x = 4 esetén;\n2) c) mindkét oldal hosszát;\n3) d) maximális területét!`,
        answer: 6,
        alternativeAnswer: 5,
        thirdAnswer: 5,
        fourthAnswer: 25,
        type: 'multiplication',
        expression: `a) másik oldal: 10 − x (x=4 → 6)\nb) T = x(10−x) = 10x − x²\nc) T'=0 → x = 5, oldalak: 5 cm és 5 cm\nd) T_max = 25 cm²`
    },
    {
        question: `7. Közlekedési költség\n\nEgy futárszolgálat járművének üzemeltetési költsége két részből áll.\nAz x km/h átlagsebesség mellett az üzemeltetési költség kilométerenként (300 + 0,5x) forint.\nA sofőr órabére 1800 forint.\n\na) Igazold, hogy a kilométerenkénti teljes költséget a\nK(x) = 300 + 0,5x + 1800/x, x > 0\nfüggvény adja meg!\nb) Határozd meg azt az átlagsebességet, amelynél a kilométerenkénti költség minimális! Válaszodat egész kilométer per órára kerekítve add meg!\nc) Határozd meg a minimális kilométerenkénti költséget egész forintra kerekítve!\n\nAdd meg b) átlagsebességét (km/h), majd c) minimális költséget (Ft)!`,
        answer: 60,
        alternativeAnswer: 360,
        type: 'multiplication',
        expression: `a) bér km-enként: 1800/x → K(x) = 300 + 0,5x + 1800/x\nb) K'=0 → x = 60 km/h\nc) K(60) = 360 Ft`
    },
    {
        question: `8. Paraméteres határozott integrál\n\nLegyen fₚ(x) = x² + px − 2, ahol p valós paraméter.\n\na) Számítsd ki a ∫₀³ fₚ(x) dx integrált p függvényében!\nb) Határozd meg p értékét úgy, hogy ∫₀³ fₚ(x) dx = 0 teljesüljön!\nc) Határozd meg p értékét úgy, hogy az fₚ függvény grafikonjához az x = 1 abszcisszájú pontban húzott érintő párhuzamos legyen az y = 5x − 4 egyenessel!\n\nAdd meg:\n1) a) értékét p = 0 esetén;\n2) b) p értékét 3 tizedesjegyre;\n3) c) p értékét!`,
        answer: 3,
        alternativeAnswer: -0.667,
        thirdAnswer: 3,
        type: 'multiplication',
        expression: `a) ∫₀³ = 3 + (9/2)p (p=0 → 3)\nb) 3 + 9p/2 = 0 → p = −2/3 ≈ −0,667\nc) f'=2x+p, f'(1)=2+p = 5 → p = 3`
    },
    {
        question: `9. Bevétel maximalizálása\n\nEgy rendezvényre jelenleg 3000 darab belépőjegyet adnak el darabonként 4000 forintért. A szervezők becslése szerint minden 100 forintos áremelés 50-nel csökkenti az eladott jegyek számát.\nJelölje x a 100 forintos áremelések számát!\n\na) Fejezd ki a jegy új árát és az eladott jegyek számát x segítségével!\nb) Igazold, hogy a teljes bevételt a B(x) = (4000 + 100x)(3000 − 50x) függvény adja meg!\nc) Határozd meg azt a jegyárat, amely mellett a bevétel maximális!\nd) Határozd meg a maximális bevételt!\n\nAdd meg:\n1) a) jegyárat x = 2 esetén;\n2) c) optimális jegyárat;\n3) d) maximális bevételt!`,
        answer: 4200,
        alternativeAnswer: 5000,
        thirdAnswer: 12500000,
        type: 'multiplication',
        expression: `a) ár = 4000+100x, darab = 3000−50x (x=2 → 4200 Ft)\nb) B(x)=(4000+100x)(3000−50x)\nc) B'=0 → x=10 → ár = 5000 Ft\nd) B(10)=12 500 000 Ft`
    },
    {
        question: `10. Mihaszna-mesterfok\n\nLegyen f(x) = x⁴ − 4x³ − 2x² + 12x.\n\na) Határozd meg az f' deriváltfüggvény zérushelyeit!\nb) Vizsgáld meg a függvény monotonitását!\nc) Határozd meg a lokális szélsőértékek helyét és értékét!\nd) Határozd meg azokat az intervallumokat, amelyeken az f függvény konvex, illetve konkáv!\ne) Számítsd ki a ∫₀² f(x) dx határozott integrált!\n\nAdd meg f' három zérushelyét növekvő sorrendben, majd e) integrál értékét 3 tizedesjegyre!`,
        answer: -1,
        alternativeAnswer: 1,
        thirdAnswer: 3,
        fourthAnswer: 9.067,
        type: 'multiplication',
        expression: `f'(x)=4(x+1)(x−1)(x−3) → zérusok: −1, 1, 3\nLok. max: f(1)=7; lok. min: f(−1)=f(3)=−9\nKonvex: x < 1−(2/3)√3 vagy x > 1+(2/3)√3\n∫₀² f = 136/15 ≈ 9,067`
    }
];

// Bizonyítási feladatok — 6×20 (lásd proofLevels.ts)
import { getProofPracticeQuestions as getProofRaw } from './proofLevels';

export const getProofPracticeQuestions = (): Question[] => {
    const list = getProofRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
    });
    agentDebugLog({
        hypothesisId: 'P',
        location: 'practiceBanks.ts:getProofPracticeQuestions',
        message: 'proof bank loaded',
        data: { total: list.length, byStage },
        runId: 'proof-120',
    });
    // #endregion
    return list;
};

// Egyenletek, egyenletrendszerek, egyenlőtlenségek — 6×20 (lásd eqLevels.ts)
import { getEquationsPracticeQuestions as getEquationsRaw } from './eqLevels';

export const getEquationsPracticeQuestions = (): Question[] => {
    const list = getEquationsRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    let multiAnswer = 0;
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
        if ((q as Question).alternativeAnswer !== undefined) multiAnswer += 1;
    });
    agentDebugLog({
        hypothesisId: 'E',
        location: 'practiceBanks.ts:getEquationsPracticeQuestions',
        message: 'equations bank loaded',
        data: { total: list.length, byStage, multiAnswer },
        runId: 'eq-120',
    });
    // #endregion
    return list;
};

// Halmazok — 6×20 (lásd halmazLevels.ts)
import { getHalmazPracticeQuestions as getHalmazRaw } from './halmazLevels';

export const getHalmazPracticeQuestions = (): Question[] => {
    const list = getHalmazRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    let multiAnswer = 0;
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
        if ((q as Question).alternativeAnswer !== undefined) multiAnswer += 1;
    });
    agentDebugLog({
        hypothesisId: 'H',
        location: 'practiceBanks.ts:getHalmazPracticeQuestions',
        message: 'halmazok bank loaded',
        data: { total: list.length, byStage, multiAnswer },
        runId: 'halmaz-120',
    });
    // #endregion
    return list;
};

// Kombinatorika — 6×20 (lásd kombinatorikaLevels.ts)
import { getKombinatorikaPracticeQuestions as getKombinatorikaRaw } from './kombinatorikaLevels';

export const getKombinatorikaPracticeQuestions = (): Question[] => {
    const list = getKombinatorikaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Koordinátageometria — 6×20 (lásd koordinatageometriaLevels.ts)
import { getKoordinatageometriaPracticeQuestions as getKoordRaw } from './koordinatageometriaLevels';

export const getKoordinatageometriaPracticeQuestions = (): Question[] => {
    const list = getKoordRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Logika, gráfok — 6×20 (lásd grafokLevels.ts)
import { getGrafokPracticeQuestions as getGrafokRaw } from './grafokLevels';

export const getGrafokPracticeQuestions = (): Question[] => {
    const list = getGrafokRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Sorozatok — 6×20 (lásd sorozatokLevels.ts)
import { getSorozatokPracticeQuestions as getSorozatokRaw } from './sorozatokLevels';

export const getSorozatokPracticeQuestions = (): Question[] => {
    const list = getSorozatokRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Statisztika — 6×20 (lásd statisztikaLevels.ts)
import { getStatisztikaPracticeQuestions as getStatisztikaRaw } from './statisztikaLevels';

export const getStatisztikaPracticeQuestions = (): Question[] => {
    const list = getStatisztikaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Számelmélet — 6×20 (lásd szamelmeletLevels.ts)
import { getSzamelmeletPracticeQuestions as getSzamelmeletRaw } from './szamelmeletLevels';

export const getSzamelmeletPracticeQuestions = (): Question[] => {
    const list = getSzamelmeletRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Szöveges feladatok — 6×20 (lásd szovegesLevels.ts)
import { getSzovegesPracticeQuestions as getSzovegesRaw } from './szovegesLevels';

export const getSzovegesPracticeQuestions = (): Question[] => {
    const list = getSzovegesRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Térgeometria — 6×20 (lásd tergeometriaLevels.ts)
import { getTergeometriaPracticeQuestions as getTergeometriaRaw } from './tergeometriaLevels';

export const getTergeometriaPracticeQuestions = (): Question[] => {
    const list = getTergeometriaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Valószínűségszámítás — 6×20 (lásd valoszinusegLevels.ts)
import { getValoszinusegPracticeQuestions as getValoszinusegRaw } from './valoszinusegLevels';

export const getValoszinusegPracticeQuestions = (): Question[] => {
    const list = getValoszinusegRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Trigonometria — 6×20 (lásd trigonometriaLevels.ts)
import { getTrigonometriaPracticeQuestions as getTrigonometriaRaw } from './trigonometriaLevels';

export const getTrigonometriaPracticeQuestions = (): Question[] => {
    const list = getTrigonometriaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};
