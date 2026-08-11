import type { Question } from './types';
import { pick, randInt } from './random';

export const generateQuadraticQuestion = (): Question => {
    const a = randInt(1, 5);
    const b = randInt(-5, 4);
    const c = randInt(-5, 4);

    const discriminant = b * b - 4 * a * c;
    let answer = 0;
    let question = '';

    if (discriminant >= 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        answer = Math.round(x1 * 10) / 10;
        question = `${a}x² + ${b}x + ${c} = 0 egyenlet egyik gyöke?`;
    } else {
        answer = 0;
        question = `${a}x² + ${b}x + ${c} = 0 egyenlet diszkriminánsa pozitív? (1 = igen, 0 = nem)`;
    }

    return {
        question,
        answer,
        type: 'multiplication' as const,
        expression: `${a}x² + ${b}x + ${c} = 0`,
    };
};

export const generateDerivativeQuestion = (): Question => {
    const coefficient = randInt(1, 5);
    const power = randInt(2, 5);

    const answer = coefficient * power;
    const question = `${coefficient}x^${power} deriváltja?`;

    return {
        question,
        answer,
        type: 'multiplication' as const,
        expression: `d/dx(${coefficient}x^${power})`,
    };
};

export const generateTrigonometryQuestion = (): Question => {
    const angle = pick([0, 30, 45, 60, 90]);

    let answer = 0;
    if (angle === 0) answer = 0;
    else if (angle === 30) answer = 0.5;
    else if (angle === 45) answer = Math.sqrt(2) / 2;
    else if (angle === 60) answer = Math.sqrt(3) / 2;
    else if (angle === 90) answer = 1;

    return {
        question: `sin(${angle}°) értéke?`,
        answer: Math.round(answer * 100) / 100,
        type: 'multiplication' as const,
        expression: `sin(${angle}°)`,
    };
};

export const generateIntegralQuestion = (): Question => {
    const coefficient = randInt(1, 5);
    const power = randInt(1, 3);

    return {
        question: `∫${coefficient}x^${power} dx eredménye?`,
        answer: coefficient / (power + 1),
        type: 'multiplication' as const,
        expression: `∫${coefficient}x^${power} dx`,
    };
};

export const generateGeometryQuestion = (): Question => {
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    return {
        question: `Derékszögű háromszög befogói ${a} és ${b}. Mekkora az átfogó (egészre kerekítve)?`,
        answer: Math.round(Math.sqrt(a * a + b * b)),
        type: 'multiplication' as const,
        expression: `√(${a}²+${b}²)`,
    };
};

export const generateAlgebraQuestion = (): Question => {
    const a = randInt(2, 9);
    const b = randInt(1, 9);
    return {
        question: `Mennyi ${a}·(${a}+${b}) − ${a}·${b}?`,
        answer: a * a,
        type: 'multiplication' as const,
        expression: `${a}(${a}+${b})-${a}·${b}`,
    };
};

/** Highschool ↔ Érettségi közös témák (korábban byte-identical duplikátumok). */
export function generatePointDistanceQuestion(): Question {
    const x1 = randInt(-5, 5);
    const y1 = randInt(-5, 5);
    const x2 = randInt(-5, 5);
    const y2 = randInt(-5, 5);
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return {
        question: `A(${x1};${y1}) és B(${x2};${y2}) távolsága? (1 tizedes)`,
        answer: Math.round(dist * 10) / 10,
        type: 'multiplication',
        expression: `√((${x2}-${x1})²+(${y2}-${y1})²)`,
    };
}

export function generateArithmeticSequenceA5(): Question {
    const a1 = randInt(1, 10);
    const d = randInt(1, 5);
    return {
        question: `Számtani sorozat: a₁=${a1}, d=${d}. Mennyi a₅?`,
        answer: a1 + 4 * d,
        type: 'multiplication',
        expression: `a₅=${a1}+4·${d}`,
    };
}

export function generateSimpleMeanQuestion(): Question {
    const vals = [1, 2, 3, 4, 5];
    const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
    return {
        question: `Mi a számtani közepe: ${vals.join(', ')}?`,
        answer: mean,
        type: 'multiplication',
        expression: `(${vals.join('+')})/${vals.length}`,
    };
}
