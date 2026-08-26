import type { Question } from './types';
import {
    getParameterPracticeQuestions,
    getExponentialLogPracticeQuestions,
    getAbsoluteRootPracticeQuestions,
    getFunctionsPracticeQuestions,
    getProofPracticeQuestions,
    getEquationsPracticeQuestions,
    getHalmazPracticeQuestions,
} from './practiceBanks';
import {
    generateAlgebraQuestion,
    generateGeometryQuestion,
    generateTrigonometryQuestion,
} from './generateHelpers';

export const generateErettsegiQuestionByTopicId = (topicId: string, level: string): Question | null => {
    // Érettségi témakör ID alapján feladat generálása
    const topicIdLower = topicId.toLowerCase();

    // Abszolútérték, gyök — munkalap feladatok
    if (topicIdLower.includes('abszolutertek') || topicIdLower.includes('gyok')) {
        const list = getAbsoluteRootPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Egyenletek, egyenlőtlenségek — 6×20 bank
    else if (topicIdLower.includes('egyenletek') || topicIdLower.includes('egyenlotlenseg')) {
        const list = getEquationsPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Egyszerűsítések, átalakítások
    else if (topicIdLower.includes('egyszerusites') || topicIdLower.includes('atalakitas')) {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('emelt')) {
            // Emelt szint: összetett algebrai kifejezések
            const a = Math.floor(Math.random() * 5) + 2;
            const b = Math.floor(Math.random() * 5) + 2;
            // (a² - b²) / (a - b) = a + b
            const answer = a + b;
            return {
                question: `Egyszerűsítsd: (${a}² - ${b}²) / (${a} - ${b}) = ?`,
                answer: answer,
                type: 'multiplication',
                expression: `(${a}² - ${b}²) / (${a} - ${b}) = (${a} - ${b})(${a} + ${b}) / (${a} - ${b}) = ${a} + ${b} = ${answer}`
            };
        }
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = a * b;
        return {
            question: `${a} × ${b} = ?`,
            answer: answer,
            type: 'multiplication',
            expression: `${a} × ${b} = ${answer}`
        };
    }
    // Exponenciális és logaritmusos — munkalap feladatok
    else if (topicIdLower.includes('exponencialis') || topicIdLower.includes('logaritmus')) {
        const list = getExponentialLogPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Függvények, analízis — munkalap feladatok
    else if (topicIdLower.includes('fuggveny') || topicIdLower.includes('analizis')) {
        const list = getFunctionsPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Halmazok — 6×20 bank
    else if (topicIdLower.includes('halmaz')) {
        const list = getHalmazPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Kombinatorika
    else if (topicIdLower.includes('kombinatorika')) {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('emelt')) {
            // Emelt szint: valódi kombináció számítás
            const n = Math.floor(Math.random() * 5) + 5;
            const k = 2; // Egyszerűsítés: k=2 esetén C(n,2) = n*(n-1)/2
            const answer = (n * (n - 1)) / 2;
            return {
                question: `${n} elem közül hányféleképpen választhatunk ki ${k} elemet?`,
                answer: answer,
                type: 'multiplication',
                expression: `C(${n},${k}) = ${n}! / (${k}!(${n}-${k})!) = ${n} × ${n-1} / 2 = ${answer}`
            };
        }
        const n = Math.floor(Math.random() * 5) + 3;
        const k = Math.floor(Math.random() * (n - 1)) + 1;
        const answer = n * (n - 1) / 2;
        return {
            question: `${n} elem közül hányféleképpen választhatunk ki ${k} elemet? (Egyszerűsített)`,
            answer: Math.round(answer),
            type: 'multiplication',
            expression: `C(${n},${k}) ≈ ${Math.round(answer)}`
        };
    }
    // Koordinátageometria
    else if (topicIdLower.includes('koordinatageometria') || topicIdLower.includes('koordinata')) {
        const x1 = Math.floor(Math.random() * 10);
        const y1 = Math.floor(Math.random() * 10);
        const x2 = Math.floor(Math.random() * 10);
        const y2 = Math.floor(Math.random() * 10);
        const answer = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return {
            question: `A(${x1}, ${y1}) és B(${x2}, ${y2}) pontok távolsága?`,
            answer: Math.round(answer * 10) / 10,
            type: 'multiplication',
            expression: `d = √((${x2}-${x1})² + (${y2}-${y1})²) = ${Math.round(answer * 10) / 10}`
        };
    }
    // Síkgeometria
    else if (topicIdLower.includes('sikgeometria') || topicIdLower.includes('sik')) {
        return generateGeometryQuestion();
    }
    // Sorozatok
    else if (topicIdLower.includes('sorozat')) {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('emelt')) {
            // Emelt szint: geometriai sorozat
            const a1 = Math.floor(Math.random() * 5) + 2;
            const q = Math.floor(Math.random() * 3) + 2;
            const n = 4;
            const answer = a1 * Math.pow(q, n - 1);
            return {
                question: `Geometriai sorozat: a₁ = ${a1}, q = ${q}. Mennyi a₄?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                answer: Math.round(answer * 1000) / 1000,
                type: 'multiplication',
                expression: `a₄ = a₁ · q³ = ${a1} · ${q}³ = ${a1} · ${Math.pow(q, 3)} = ${Math.round(answer * 1000) / 1000}`
            };
        }
        const a1 = Math.floor(Math.random() * 10) + 1;
        const d = Math.floor(Math.random() * 5) + 1;
        const n = 5;
        const answer = a1 + (n - 1) * d;
        return {
            question: `Számtani sorozat: a₁ = ${a1}, d = ${d}. Mennyi a₅?`,
            answer: answer,
            type: 'addition',
            expression: `a₅ = a₁ + 4d = ${a1} + 4·${d} = ${answer}`
        };
    }
    // Statisztika
    else if (topicIdLower.includes('statisztika')) {
        const nums = [1, 2, 3, 4, 5];
        const answer = nums.reduce((a, b) => a + b, 0) / nums.length;
        return {
            question: `Adatok: ${nums.join(', ')}. Átlag?`,
            answer: answer,
            type: 'multiplication',
            expression: `Átlag = (${nums.join(' + ')}) / ${nums.length} = ${answer}`
        };
    }
    // Számelmélet
    else if (topicIdLower.includes('szamelmelet') || topicIdLower.includes('szam')) {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('emelt')) {
            // Emelt szint: LKKT számítás
            const a = Math.floor(Math.random() * 5) + 4;
            const b = Math.floor(Math.random() * 5) + 4;
            const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
            const lcm = (a * b) / gcd(a, b);
            return {
                question: `LKKT(${a}, ${b}) = ?`,
                answer: lcm,
                type: 'multiplication',
                expression: `LKKT(${a}, ${b}) = (${a} × ${b}) / LNKO(${a}, ${b}) = ${lcm}`
            };
        }
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 20) + 10;
        const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
        const answer = gcd(a, b);
        return {
            question: `LNKO(${a}, ${b}) = ?`,
            answer: answer,
            type: 'multiplication',
            expression: `LNKO(${a}, ${b}) = ${answer}`
        };
    }
    // Szöveges feladatok
    else if (topicIdLower.includes('szoveges')) {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('emelt')) {
            // Emelt szint: összetett szöveges feladat
            const b = Math.floor(Math.random() * 5) + 3;
            const pali = b;
            const kati = 2 * pali;
            return {
                question: `Kati kétszer annyi almát szedett, mint Pali. Ha Pali ${pali} almát szedett, hány almát szedett Kati?`,
                answer: kati,
                type: 'multiplication',
                expression: `Kati = 2 × Pali = 2 × ${pali} = ${kati}`
            };
        }
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = a + b;
        return {
            question: `Kati ${a} almát, Pali ${b} almát szedett. Összesen hány alma?`,
            answer: answer,
            type: 'addition',
            expression: `${a} + ${b} = ${answer}`
        };
    }
    // Paraméter — ELŐBB, mert a "parameter" id tartalmazza a "ter" szócskát
    else if (topicIdLower.includes('parameter') || topicIdLower.includes('paramet')) {
        const list = getParameterPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Térgeometria (ne használj includes('ter') — elkapná a parameter témát is!)
    else if (topicIdLower.includes('tergeometria')) {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('emelt')) {
            // Emelt szint: gömb térfogata
            const r = Math.floor(Math.random() * 5) + 2;
            const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
            return {
                question: `Gömb sugara ${r} cm. Térfogat? (π ≈ 3.14, egész szám)`,
                answer: Math.round(volume),
                type: 'multiplication',
                expression: `V = (4/3)πr³ = (4/3) × 3.14 × ${r}³ = ${Math.round(volume)} cm³`
            };
        }
        const a = Math.floor(Math.random() * 5) + 2;
        const answer = Math.pow(a, 3);
        return {
            question: `Kocka éle ${a} cm. Térfogat?`,
            answer: answer,
            type: 'multiplication',
            expression: `V = a³ = ${a}³ = ${answer} cm³`
        };
    }
    // Trigonometria
    else if (topicIdLower.includes('trigonometria') || topicIdLower.includes('trigonometri')) {
        return generateTrigonometryQuestion();
    }
    // Valószínűségszámítás
    else if (topicIdLower.includes('valoszinuseg')) {
        return {
            question: 'Egy kockával dobva, mi a valószínűsége, hogy 3-nál nagyobb számot dobunk?',
            answer: 0.5,
            type: 'multiplication',
            expression: 'Kedvező: 4,5,6 (3 db), Összes: 6, P = 3/6 = 0.5'
        };
    }
    // Bizonyítások — munkalap feladatok
    else if (topicIdLower.includes('bizonyitas')) {
        const list = getProofPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Logika, gráfok
    else if (topicIdLower.includes('logika') || topicIdLower.includes('graf')) {
        return {
            question: 'Logikai művelet: (1 ÉS 0) VAGY 1 = ?',
            answer: 1,
            type: 'multiplication',
            expression: '(1 ÉS 0) = 0, 0 VAGY 1 = 1'
        };
    }
    // Értelmezési tartomány, értékkészlet
    else if (topicIdLower.includes('ertelmezesi') || topicIdLower.includes('tartomany') || topicIdLower.includes('ertekkeszlet')) {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('emelt')) {
            // Emelt szint: összetett függvény értelmezési tartománya
            const a = Math.floor(Math.random() * 5) + 3;
            // f(x) = √(x-2) + 1/(x-a), értelmezési tartomány: x ≥ 2 ÉS x ≠ a
            const minValue = Math.max(2, a + 1);
            return {
                question: `f(x) = √(x-2) + 1/(x-${a}) értelmezési tartománya? (Add meg a legkisebb egész számot)`,
                answer: minValue,
                type: 'multiplication',
                expression: `x - 2 ≥ 0 → x ≥ 2, és x ≠ ${a}, legkisebb egész: ${minValue}`
            };
        }
        return {
            question: 'f(x) = √(x-2) értelmezési tartománya? (Add meg a legkisebb egész számot)',
            answer: 2,
            type: 'multiplication',
            expression: 'x - 2 ≥ 0 → x ≥ 2, legkisebb egész: 2'
        };
    }

    // Alapértelmezett
    return generateAlgebraQuestion();
};
