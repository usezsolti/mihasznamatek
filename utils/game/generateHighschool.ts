import type { Question } from './types';
import {
    generateDerivativeQuestion,
    generateGeometryQuestion,
    generateQuadraticQuestion,
    generateTrigonometryQuestion,
} from './generateHelpers';

export const generateHighschoolQuestionByTopic = (topicId: string, grade: number, difficulty: number = 0): Question | null => {
    const topicIdLower = topicId.toLowerCase();

    // Abszolútérték, gyök
    if (topicIdLower.includes('abszolutertek') || topicIdLower.includes('gyok')) {
        // A difficulty alapján változtatjuk a nehézséget (0-4: könnyűtől nehezebbig)
        const questionType = Math.floor(Math.random() * (difficulty + 1) * 10) % 15;

        if (questionType < 5 || difficulty === 0) {
            // Könnyű: egyszerű abszolútérték számítások
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const answer = Math.abs(a - b);
            return {
                question: `|${a} - ${b}| = ?`,
                answer: answer,
                type: 'multiplication',
                expression: `|${a} - ${b}| = |${a - b}| = ${answer}`
            };
        } else if (questionType < 10 || difficulty <= 2) {
            // Közepes: abszolútértékes egyenletek |x - a| = b
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const solution1 = a + b;
            const solution2 = a - b;
            return {
                question: `|x - ${a}| = ${b}. Mennyi x?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                answer: Math.round(solution1 * 1000) / 1000,
                alternativeAnswer: Math.round(solution2 * 1000) / 1000,
                type: 'multiplication',
                expression: `|x - ${a}| = ${b} → x - ${a} = ±${b} → x = ${a} ± ${b} → x₁ = ${Math.round(solution1 * 1000) / 1000}, x₂ = ${Math.round(solution2 * 1000) / 1000}`
            };
        } else {
            // Nehezebb: gyökös egyenletek √(x + a) = b
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 5) + 2;
            const solution = b * b - a;
            if (solution >= 0) {
                return {
                    question: `√(x + ${a}) = ${b}\n\nMennyi x?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                    answer: Math.round(solution * 1000) / 1000,
                    type: 'multiplication',
                    expression: `√(x + ${a}) = ${b} → x + ${a} = ${b}² → x + ${a} = ${b * b} → x = ${Math.round(solution * 1000) / 1000}`
                };
            } else {
                // Ha negatív lenne, akkor abszolútértékes egyenletet adunk
                const a2 = Math.floor(Math.random() * 10) + 1;
                const b2 = Math.floor(Math.random() * 10) + 1;
                const solution1 = a2 + b2;
                const solution2 = a2 - b2;
                return {
                    question: `|x - ${a2}| = ${b2}. Mennyi x?\n\nVálaszaidat 3 tizedesjegyre add meg!`,
                    answer: Math.round(solution1 * 1000) / 1000,
                    alternativeAnswer: Math.round(solution2 * 1000) / 1000,
                    type: 'multiplication',
                    expression: `|x - ${a2}| = ${b2} → x - ${a2} = ±${b2} → x = ${a2} ± ${b2} → x₁ = ${Math.round(solution1 * 1000) / 1000}, x₂ = ${Math.round(solution2 * 1000) / 1000}`
                };
            }
        }
    }
    // Egyenletek
    else if (topicIdLower.includes('egyenletek') || topicIdLower.includes('egyenlet')) {
        return generateQuadraticQuestion();
    }
    // Síkgeometria
    else if (topicIdLower.includes('sikgeometria') || topicIdLower.includes('sik')) {
        return generateGeometryQuestion();
    }
    // Függvények
    else if (topicIdLower.includes('fuggvenyek') || topicIdLower.includes('fuggveny')) {
        return generateDerivativeQuestion();
    }
    // Trigonometria
    else if (topicIdLower.includes('trigonometria') || topicIdLower.includes('trigonometri')) {
        return generateTrigonometryQuestion();
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
    // Valószínűségszámítás
    else if (topicIdLower.includes('valoszinuseg')) {
        return {
            question: 'Egy kockával dobva, mi a valószínűsége, hogy 3-nál nagyobb számot dobunk?',
            answer: 0.5,
            type: 'multiplication',
            expression: 'Kedvező: 4,5,6 (3 db), Összes: 6, P = 3/6 = 0.5'
        };
    }
    // Logaritmus
    else if (topicIdLower.includes('logaritmus') || topicIdLower.includes('log')) {
        const base = Math.floor(Math.random() * 3) + 2;
        const power = Math.floor(Math.random() * 5) + 1;
        return {
            question: `log${base}(${Math.pow(base, power)}) = ?`,
            answer: power,
            type: 'multiplication',
            expression: `log${base}(${Math.pow(base, power)}) = log${base}(${base}^${power}) = ${power}`
        };
    }
    // Kombinatorika
    else if (topicIdLower.includes('kombinatorika')) {
        const n = Math.floor(Math.random() * 5) + 3;
        const k = Math.floor(Math.random() * (n - 1)) + 1;
        const answer = Math.round((n * (n - 1)) / 2);
        return {
            question: `${n} elem közül hányféleképpen választhatunk ki ${k} elemet? (Egyszerűsített)`,
            answer: answer,
            type: 'multiplication',
            expression: `C(${n},${k}) ≈ ${answer}`
        };
    }
    // Sorozatok
    else if (topicIdLower.includes('sorozatok') || topicIdLower.includes('sorozat')) {
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

    // Alapértelmezett
    return generateQuadraticQuestion();
};
