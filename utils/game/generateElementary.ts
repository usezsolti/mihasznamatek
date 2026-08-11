import type { Question } from './types';
import { generateAlgebraQuestion } from './generateHelpers';

export const generateElementaryQuestionByTopic = (topicId: string, grade: number, difficulty: number = 0): Question | null => {
    const topicIdLower = topicId.toLowerCase();

    // Számok 20-ig — többféle feladatvariáns
    if (topicIdLower.includes('szamok-20ig') || topicIdLower.includes('20ig')) {
        const max = 10 + Math.min(10, difficulty * 2);
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * Math.max(1, max - a + 1));
        const variant = Math.floor(Math.random() * 4);
        if (variant === 0) {
            return {
                question: `Mennyi ${a} + ${b}?`,
                answer: a + b,
                type: 'addition',
                expression: `${a} + ${b} = ${a + b}`,
            };
        }
        if (variant === 1) {
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            return {
                question: `Mennyi ${larger} − ${smaller}?`,
                answer: larger - smaller,
                type: 'subtraction',
                expression: `${larger} - ${smaller} = ${larger - smaller}`,
            };
        }
        if (variant === 2) {
            return {
                question: `Melyik a nagyobb: ${a} vagy ${b}? Írd be a nagyobbat!`,
                answer: Math.max(a, b),
                type: 'addition',
                expression: `max(${a},${b}) = ${Math.max(a, b)}`,
            };
        }
        return {
            question: `Mi következik ${a} után?`,
            answer: a + 1,
            type: 'addition',
            expression: `${a} + 1 = ${a + 1}`,
        };
    }
    // Számok 100-ig
    else if (topicIdLower.includes('szamok-100ig') || topicIdLower.includes('100ig')) {
        const max = 20 + difficulty * 15;
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        const variant = Math.floor(Math.random() * 3);
        if (variant === 0) {
            return {
                question: `Mennyi ${a} + ${b}?`,
                answer: a + b,
                type: 'addition',
                expression: `${a} + ${b} = ${a + b}`,
            };
        }
        if (variant === 1) {
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            return {
                question: `Mennyi ${larger} − ${smaller}?`,
                answer: larger - smaller,
                type: 'subtraction',
                expression: `${larger} - ${smaller} = ${larger - smaller}`,
            };
        }
        const tens = Math.floor(a / 10) * 10;
        return {
            question: `Kerekítsd ${a}-t a legközelebbi tizesre!`,
            answer: a - tens >= 5 ? tens + 10 : tens,
            type: 'addition',
            expression: `kerekítés(${a})`,
        };
    }
    // Összeadás-kivonás
    else if (topicIdLower.includes('osszeadas') || topicIdLower.includes('kivonas')) {
        const maxNum = Math.min(grade * 10, 100);
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * maxNum) + 1;
        const isAddition = Math.random() > 0.5;
        if (isAddition) {
            return {
                question: `${a} + ${b} = ?`,
                answer: a + b,
                type: 'addition',
                expression: `${a} + ${b} = ${a + b}`
            };
        } else {
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            return {
                question: `${larger} - ${smaller} = ?`,
                answer: larger - smaller,
                type: 'subtraction',
                expression: `${larger} - ${smaller} = ${larger - smaller}`
            };
        }
    }
    // Szorzótábla
    else if (topicIdLower.includes('szorzotabla') || topicIdLower.includes('szorzas')) {
        const maxFactor = Math.min(grade + 2, 10);
        const a = Math.floor(Math.random() * maxFactor) + 1;
        const b = Math.floor(Math.random() * maxFactor) + 1;
        return {
            question: `${a} × ${b} = ?`,
            answer: a * b,
            type: 'multiplication',
            expression: `${a} × ${b} = ${a * b}`
        };
    }
    // Törtek
    else if (topicIdLower.includes('tortek') || topicIdLower.includes('tort')) {
        const numerator = Math.floor(Math.random() * 5) + 1;
        const denominator = Math.floor(Math.random() * 5) + numerator;
        const answer = Math.round((numerator / denominator) * 100) / 100;
        return {
            question: `${numerator}/${denominator} tizedes törtben? (Kerekíts 2 tizedesjegyre)`,
            answer: answer,
            type: 'division',
            expression: `${numerator}/${denominator} = ${answer}`
        };
    }
    // Geometria alapok
    else if (topicIdLower.includes('geometria') || topicIdLower.includes('geometri')) {
        const side = Math.floor(Math.random() * 10) + 1;
        const answer = side * side;
        return {
            question: `${side} cm oldalú négyzet területe?`,
            answer: answer,
            type: 'multiplication',
            expression: `T = a² = ${side}² = ${answer} cm²`
        };
    }

    // Alapértelmezett
    return generateAlgebraQuestion();
};
