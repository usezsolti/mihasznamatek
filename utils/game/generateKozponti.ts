import type { Question } from './types';
import { generateAlgebraQuestion } from './generateHelpers';

export const generateKozpontiQuestionByTopic = (topicId: string, difficulty: number = 0): Question | null => {
    const topicIdLower = topicId.toLowerCase();

    // Számítás - gimnáziumi felvételi szint
    if (topicIdLower.includes('szamitas') || topicIdLower.includes('számítás')) {
        const baseRange = 10 + difficulty * 20;
        const a = Math.floor(Math.random() * baseRange) + 10;
        const b = Math.floor(Math.random() * baseRange) + 10;
        const operation = Math.floor(Math.random() * 6);

        if (operation === 0) {
            // Összeadás
            return {
                question: `${a} + ${b} = ?`,
                answer: a + b,
                type: 'addition',
                expression: `${a} + ${b} = ${a + b}`
            };
        } else if (operation === 1) {
            // Kivonás
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            return {
                question: `${larger} - ${smaller} = ?`,
                answer: larger - smaller,
                type: 'subtraction',
                expression: `${larger} - ${smaller} = ${larger - smaller}`
            };
        } else if (operation === 2) {
            // Szorzás
            const factor = Math.floor(Math.random() * (5 + difficulty)) + 2;
            return {
                question: `${a} × ${factor} = ?`,
                answer: a * factor,
                type: 'multiplication',
                expression: `${a} × ${factor} = ${a * factor}`
            };
        } else if (operation === 3) {
            // Osztás
            const divisor = Math.floor(Math.random() * (5 + difficulty)) + 2;
            const dividend = a * divisor;
            return {
                question: `${dividend} ÷ ${divisor} = ?`,
                answer: a,
                type: 'division',
                expression: `${dividend} ÷ ${divisor} = ${a}`
            };
        } else if (operation === 4 && difficulty >= 2) {
            // Törtek összeadása/kivonása
            const num1 = Math.floor(Math.random() * 5) + 1;
            const den1 = num1 + Math.floor(Math.random() * 5) + 1;
            const num2 = Math.floor(Math.random() * 5) + 1;
            const den2 = num2 + Math.floor(Math.random() * 5) + 1;
            const commonDen = den1 * den2;
            const sumNum = num1 * den2 + num2 * den1;
            const answer = Math.round((sumNum / commonDen) * 100) / 100;
            return {
                question: `${num1}/${den1} + ${num2}/${den2} = ? (2 tizedesjegyre)`,
                answer: answer,
                type: 'addition',
                expression: `${num1}/${den1} + ${num2}/${den2} = ${sumNum}/${commonDen} = ${answer}`
            };
        } else {
            // Hatványozás
            const base = Math.floor(Math.random() * 5) + 2;
            const exp = Math.floor(Math.random() * 4) + 2;
            return {
                question: `${base}^${exp} = ?`,
                answer: Math.pow(base, exp),
                type: 'multiplication',
                expression: `${base}^${exp} = ${Math.pow(base, exp)}`
            };
        }
    }
    // Algebra - gimnáziumi felvételi szint
    else if (topicIdLower.includes('algebra')) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 20) + 5;
        const c = Math.floor(Math.random() * 10) + 1;
        return {
            question: `${a}x + ${b} = ${a * c + b}. Mennyi x?`,
            answer: c,
            type: 'multiplication',
            expression: `${a}x + ${b} = ${a * c + b} → ${a}x = ${a * c} → x = ${c}`
        };
    }
    // Geometria - gimnáziumi felvételi szint
    else if (topicIdLower.includes('geometria')) {
        const shape = Math.floor(Math.random() * (5 + difficulty));
        const baseSize = Math.floor(Math.random() * 10) + 5;

        if (shape === 0 || difficulty === 0) {
            // Négyzet terület
            return {
                question: `${baseSize} cm oldalú négyzet területe?`,
                answer: baseSize * baseSize,
                type: 'multiplication',
                expression: `T = a² = ${baseSize}² = ${baseSize * baseSize} cm²`
            };
        } else if (shape === 1 || difficulty <= 1) {
            // Téglalap terület
            const width = baseSize + Math.floor(Math.random() * 5);
            return {
                question: `${baseSize} cm × ${width} cm téglalap területe?`,
                answer: baseSize * width,
                type: 'multiplication',
                expression: `T = a × b = ${baseSize} × ${width} = ${baseSize * width} cm²`
            };
        } else if (shape === 2 || difficulty <= 2) {
            // Kör terület
            const radius = baseSize;
            const area = Math.round(Math.PI * radius * radius);
            return {
                question: `${radius} cm sugarú kör területe? (Egész számra kerekítve, π ≈ 3.14)`,
                answer: area,
                type: 'multiplication',
                expression: `T = πr² = 3.14 × ${radius}² ≈ ${area} cm²`
            };
        } else if (shape === 3 || difficulty <= 3) {
            // Háromszög terület
            const base = baseSize;
            const height = baseSize + Math.floor(Math.random() * 5);
            const area = Math.round((base * height) / 2);
            return {
                question: `${base} cm alapú, ${height} cm magasságú háromszög területe?`,
                answer: area,
                type: 'multiplication',
                expression: `T = (a × m) / 2 = (${base} × ${height}) / 2 = ${area} cm²`
            };
        } else {
            // Derékszögű háromszög átfogó (Pitagorasz-tétel)
            const a = Math.floor(Math.random() * 5) + 3;
            const b = Math.floor(Math.random() * 5) + 4;
            const c = Math.round(Math.sqrt(a * a + b * b));
            return {
                question: `Derékszögű háromszög befogói: ${a} cm és ${b} cm. Az átfogó hossza? (Egész számra kerekítve)`,
                answer: c,
                type: 'multiplication',
                expression: `c² = a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b} → c ≈ ${c} cm`
            };
        }
    }
    // Szöveges feladatok
    else if (topicIdLower.includes('szoveges') || topicIdLower.includes('szöveges')) {
        const problemType = Math.floor(Math.random() * (4 + difficulty));

        if (problemType === 0 || difficulty === 0) {
            // Egyszerű szöveges feladat
            const a = Math.floor(Math.random() * 20) + 10;
            const b = Math.floor(Math.random() * 20) + 5;
            return {
                question: `Péter ${a} forinttal rendelkezik. ${b} forintot költött. Mennyi pénze maradt?`,
                answer: a - b,
                type: 'subtraction',
                expression: `${a} - ${b} = ${a - b} forint`
            };
        } else if (problemType === 1 || difficulty <= 1) {
            // Szorzással kapcsolatos
            const price = Math.floor(Math.random() * 5) + 2;
            const quantity = Math.floor(Math.random() * 10) + 5;
            return {
                question: `Egy ${price} forintos csomagból ${quantity} darabot vettünk. Összesen mennyit fizettünk?`,
                answer: price * quantity,
                type: 'multiplication',
                expression: `${price} × ${quantity} = ${price * quantity} forint`
            };
        } else if (problemType === 2 || difficulty <= 2) {
            // Osztással kapcsolatos
            const total = Math.floor(Math.random() * 20 + 10) * 5;
            const people = Math.floor(Math.random() * 5) + 2;
            return {
                question: `${total} forintot ${people} személy között osztunk szét. Mennyi jut egy személyre?`,
                answer: total / people,
                type: 'division',
                expression: `${total} ÷ ${people} = ${total / people} forint`
            };
        } else if (problemType === 3 || difficulty <= 3) {
            // Kétismeretlenes
            const a = Math.floor(Math.random() * 10) + 3;
            const b = Math.floor(Math.random() * 10) + 5;
            const x = Math.floor(Math.random() * 5) + 2;
            const sum = a * x + b;
            return {
                question: `Egy szám ${a}-szorosa plusz ${b} egyenlő ${sum}. Mennyi a szám?`,
                answer: x,
                type: 'multiplication',
                expression: `Legyen x a szám. ${a}x + ${b} = ${sum} → ${a}x = ${sum - b} → x = ${x}`
            };
        } else {
            // Sebesség/idő/távolság
            const speed = Math.floor(Math.random() * 30) + 40;
            const time = Math.floor(Math.random() * 3) + 2;
            const distance = speed * time;
            return {
                question: `Egy autó ${speed} km/h sebességgel ${time} órát halad. Hány km-t tesz meg?`,
                answer: distance,
                type: 'multiplication',
                expression: `s = v × t = ${speed} × ${time} = ${distance} km`
            };
        }
    }
    // Halmazok
    else if (topicIdLower.includes('halmazok')) {
        const problemType = Math.floor(Math.random() * (3 + difficulty));

        if (problemType === 0 || difficulty === 0) {
            // Halmazok uniója
            const a = Math.floor(Math.random() * 10) + 5;
            const b = Math.floor(Math.random() * 10) + 5;
            const intersection = Math.floor(Math.random() * Math.min(a, b));
            return {
                question: `A halmaz ${a} elemet, B halmaz ${b} elemet tartalmaz, közös elemeik száma ${intersection}. A ∪ B elemeinek száma?`,
                answer: a + b - intersection,
                type: 'addition',
                expression: `|A ∪ B| = |A| + |B| - |A ∩ B| = ${a} + ${b} - ${intersection} = ${a + b - intersection}`
            };
        } else if (problemType === 1 || difficulty <= 2) {
            // Halmazok különbsége
            const a = Math.floor(Math.random() * 15) + 10;
            const b = Math.floor(Math.random() * 10) + 5;
            const intersection = Math.floor(Math.random() * Math.min(a, b));
            const diff = a - intersection;
            return {
                question: `A halmaz ${a} elemet, A ∩ B = ${intersection} elem. A \\ B elemeinek száma?`,
                answer: diff,
                type: 'subtraction',
                expression: `|A \\ B| = |A| - |A ∩ B| = ${a} - ${intersection} = ${diff}`
            };
        } else {
            // Három halmaz
            const a = Math.floor(Math.random() * 8) + 5;
            const b = Math.floor(Math.random() * 8) + 5;
            const c = Math.floor(Math.random() * 8) + 5;
            const intersection = Math.floor(Math.random() * Math.min(a, b, c));
            const union = a + b + c - 2 * intersection;
            return {
                question: `A, B, C halmazok elemszáma: ${a}, ${b}, ${c}. Ha |A ∩ B ∩ C| = ${intersection} és nincs más metszet, mennyi |A ∪ B ∪ C|?`,
                answer: union,
                type: 'addition',
                expression: `|A ∪ B ∪ C| = |A| + |B| + |C| - 2|A ∩ B ∩ C| = ${a} + ${b} + ${c} - 2×${intersection} = ${union}`
            };
        }
    }
    // Függvények
    else if (topicIdLower.includes('fuggvenyek') || topicIdLower.includes('függvények')) {
        const problemType = Math.floor(Math.random() * (4 + difficulty));

        if (problemType === 0 || difficulty === 0) {
            // Lineáris függvény értéke
            const a = Math.floor(Math.random() * 5) + 2;
            const b = Math.floor(Math.random() * 10) + 1;
            const x = Math.floor(Math.random() * 5) + 1;
            return {
                question: `f(x) = ${a}x + ${b}. Mennyi f(${x})?`,
                answer: a * x + b,
                type: 'multiplication',
                expression: `f(${x}) = ${a} × ${x} + ${b} = ${a * x + b}`
            };
        } else if (problemType === 1 || difficulty <= 1) {
            // Függvény nullhelye
            const a = Math.floor(Math.random() * 5) + 2;
            const b = Math.floor(Math.random() * 10) + 1;
            const zero = -b / a;
            return {
                question: `f(x) = ${a}x + ${b}. Mennyi x, ha f(x) = 0? (2 tizedesjegyre)`,
                answer: Math.round(zero * 100) / 100,
                type: 'multiplication',
                expression: `${a}x + ${b} = 0 → ${a}x = -${b} → x = ${Math.round(zero * 100) / 100}`
            };
        } else if (problemType === 2 || difficulty <= 2) {
            // Másodfokú függvény értéke
            const a = Math.floor(Math.random() * 3) + 1;
            const b = Math.floor(Math.random() * 5) + 1;
            const x = Math.floor(Math.random() * 3) + 1;
            const value = a * x * x + b;
            return {
                question: `f(x) = ${a}x² + ${b}. Mennyi f(${x})?`,
                answer: value,
                type: 'multiplication',
                expression: `f(${x}) = ${a} × ${x}² + ${b} = ${a * x * x} + ${b} = ${value}`
            };
        } else {
            // Függvények összege
            const a1 = Math.floor(Math.random() * 3) + 2;
            const a2 = Math.floor(Math.random() * 3) + 2;
            const x = Math.floor(Math.random() * 3) + 1;
            const f1 = a1 * x;
            const f2 = a2 * x;
            return {
                question: `f(x) = ${a1}x és g(x) = ${a2}x. Mennyi f(${x}) + g(${x})?`,
                answer: f1 + f2,
                type: 'addition',
                expression: `f(${x}) + g(${x}) = ${a1}×${x} + ${a2}×${x} = ${f1} + ${f2} = ${f1 + f2}`
            };
        }
    }
    // Statisztika
    else if (topicIdLower.includes('statisztika')) {
        const problemType = Math.floor(Math.random() * (3 + difficulty));
        const count = 5 + Math.floor(difficulty);
        const nums: number[] = [];

        for (let i = 0; i < count; i++) {
            nums.push(Math.floor(Math.random() * 20) + 1);
        }

        if (problemType === 0 || difficulty === 0) {
            // Átlag
            const sum = nums.reduce((a, b) => a + b, 0);
            const answer = sum / nums.length;
            return {
                question: `Adatok: ${nums.join(', ')}. Átlag? (2 tizedesjegyre)`,
                answer: Math.round(answer * 100) / 100,
                type: 'multiplication',
                expression: `Átlag = (${nums.join(' + ')}) / ${nums.length} = ${sum} / ${nums.length} = ${Math.round(answer * 100) / 100}`
            };
        } else if (problemType === 1 || difficulty <= 2) {
            // Maximum
            const max = Math.max(...nums);
            return {
                question: `Adatok: ${nums.join(', ')}. Maximum érték?`,
                answer: max,
                type: 'multiplication',
                expression: `Maximum = ${max}`
            };
        } else {
            // Összeg
            const sum = nums.reduce((a, b) => a + b, 0);
            return {
                question: `Adatok: ${nums.join(', ')}. Összeg?`,
                answer: sum,
                type: 'addition',
                expression: `Összeg = ${nums.join(' + ')} = ${sum}`
            };
        }
    }
    // Valószínűség
    else if (topicIdLower.includes('valoszinuseg') || topicIdLower.includes('valószínűség')) {
        const problemType = Math.floor(Math.random() * (3 + difficulty));

        if (problemType === 0 || difficulty === 0) {
            // Kocka dobás
            const favorable = Math.floor(Math.random() * 2) + 1;
            const total = 6;
            return {
                question: `Egy kockával dobva, mi a valószínűsége, hogy ${favorable}-t dobunk? (2 tizedesjegyre)`,
                answer: Math.round((1 / total) * 100) / 100,
                type: 'multiplication',
                expression: `Kedvező: 1 db, Összes: ${total}, P = 1/${total} = ${Math.round((1 / total) * 100) / 100}`
            };
        } else if (problemType === 1 || difficulty <= 1) {
            // Páros szám
            const total = 6;
            return {
                question: `Egy kockával dobva, mi a valószínűsége, hogy páros számot dobunk? (2 tizedesjegyre)`,
                answer: Math.round((3 / total) * 100) / 100,
                type: 'multiplication',
                expression: `Kedvező: 2, 4, 6 (3 db), Összes: ${total}, P = 3/${total} = ${Math.round((3 / total) * 100) / 100}`
            };
        } else if (problemType === 2 || difficulty <= 2) {
            // Két kocka összeg
            const target = Math.floor(Math.random() * 5) + 7; // 7-11 között
            const favorable = target <= 7 ? target - 1 : 13 - target;
            const total = 36;
            return {
                question: `Két kockával dobva, mi a valószínűsége, hogy ${target}-t dobunk? (2 tizedesjegyre)`,
                answer: Math.round((favorable / total) * 100) / 100,
                type: 'multiplication',
                expression: `Kedvező: ${favorable} db, Összes: ${total}, P = ${favorable}/${total} = ${Math.round((favorable / total) * 100) / 100}`
            };
        } else {
            // Egyenletes eloszlás
            const total = Math.floor(Math.random() * 5) + 6; // 6-10
            const favorable = Math.floor(Math.random() * (total - 1)) + 1;
            return {
                question: `${total} szám közül egyet választunk. Mi a valószínűsége, hogy ${favorable}-t választunk? (2 tizedesjegyre)`,
                answer: Math.round((1 / total) * 100) / 100,
                type: 'multiplication',
                expression: `Kedvező: 1 db, Összes: ${total}, P = 1/${total} = ${Math.round((1 / total) * 100) / 100}`
            };
        }
    }

    // Alapértelmezett
    return generateAlgebraQuestion();
};
