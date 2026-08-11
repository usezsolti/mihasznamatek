import type { Question } from './types';
import {
    generateDerivativeQuestion,
    generateIntegralQuestion,
} from './generateHelpers';

export const generateUniversityQuestionByTopic = (subjectId: string, topicId: string, difficulty: number = 0): Question | null => {
    const topicIdLower = topicId.toLowerCase();
    const subjectIdLower = subjectId.toLowerCase();

    // Analízis I témakörök
    if (subjectIdLower.includes('analizis1') || subjectIdLower.includes('analizis-1')) {
        if (topicIdLower.includes('komplex') || topicIdLower.includes('komplex')) {
            return {
                question: 'i² = ? (ahol i a komplex egyseg)',
                answer: -1,
                type: 'multiplication',
                expression: 'i² = -1 (komplex szám definíciója)'
            };
        } else if (topicIdLower.includes('sorozatok') || topicIdLower.includes('sorozat')) {
            return {
                question: '∑(n=1 to ∞) 1/2ⁿ = ?',
                answer: 1,
                type: 'multiplication',
                expression: 'Geometriai sor: a/(1-r) = (1/2)/(1-1/2) = 1'
            };
        } else if (topicIdLower.includes('egyvaltozos') || topicIdLower.includes('egyváltozós')) {
            return {
                question: 'f(x) = x² + 3x - 2, f(1) = ?',
                answer: 2,
                type: 'multiplication',
                expression: 'f(1) = 1² + 3·1 - 2 = 1 + 3 - 2 = 2'
            };
        } else if (topicIdLower.includes('fuggvenyvizsgalat') || topicIdLower.includes('függvényvizsgálat')) {
            return generateDerivativeQuestion();
        } else if (topicIdLower.includes('differencialszamitas') || topicIdLower.includes('differenciálszámítás') || topicIdLower.includes('differencial')) {
            return generateDerivativeQuestion();
        } else if (topicIdLower.includes('kozepertek') || topicIdLower.includes('középérték')) {
            return {
                question: 'Lagrange középértéktétel: f(x)=x² [0,2] intervallumon. Hányadik pontban?',
                answer: 1,
                type: 'multiplication',
                expression: 'f\'(c) = (f(2)-f(0))/(2-0) = (4-0)/2 = 2, c=1'
            };
        } else if (topicIdLower.includes('parametereesen') || topicIdLower.includes('paraméteresen') || topicIdLower.includes('gorbek')) {
            return {
                question: 'x(t)=t, y(t)=t² paraméteres görbe. dy/dx t=1-nél?',
                answer: 2,
                type: 'multiplication',
                expression: 'dy/dx = (dy/dt)/(dx/dt) = 2t/1 = 2t, t=1-nél: 2'
            };
        } else if (topicIdLower.includes('integralas') || topicIdLower.includes('integrál')) {
            return generateIntegralQuestion();
        }
    }
    // Analízis II témakörök
    else if (subjectIdLower.includes('analizis2') || subjectIdLower.includes('analizis-2')) {
        if (topicIdLower.includes('matrix') || topicIdLower.includes('mátrix')) {
            return {
                question: '[[2,1],[3,4]] determinánsa?',
                answer: 5,
                type: 'multiplication',
                expression: 'det = 2·4 - 1·3 = 8 - 3 = 5'
            };
        } else if (topicIdLower.includes('linearis-transzform') || topicIdLower.includes('lineáris transzform')) {
            return {
                question: 'Lineáris transzformáció: T(x,y) = (2x, 3y). T(1,1) első komponense?',
                answer: 2,
                type: 'multiplication',
                expression: 'T(1,1) = (2·1, 3·1) = (2, 3), első komponens: 2'
            };
        } else if (topicIdLower.includes('numerikus-sorok') || topicIdLower.includes('numerikus sor')) {
            return {
                question: '∑(n=1 to ∞) 1/n² konvergens? (1=igen, 0=nem)',
                answer: 1,
                type: 'multiplication',
                expression: 'Igen, p-sor p=2>1, konvergens'
            };
        } else if (topicIdLower.includes('sorok') && !topicIdLower.includes('fourier') && !topicIdLower.includes('taylor') && !topicIdLower.includes('numerikus')) {
            return {
                question: '∑(n=0 to ∞) xⁿ konvergenciasugara? |x|<1 esetén (1=konvergens, 0=divergens)',
                answer: 1,
                type: 'multiplication',
                expression: 'Geometriai sor, |x|<1 esetén konvergens'
            };
        } else if (topicIdLower.includes('fourier')) {
            return {
                question: 'Fourier-sor periodikus függvényeket reprezentál? (1=igen, 0=nem)',
                answer: 1,
                type: 'multiplication',
                expression: 'Igen, Fourier-sor periodikus függvényeket reprezentál'
            };
        } else if (topicIdLower.includes('taylor')) {
            return {
                question: 'e^x Taylor-sora x=0 körül első tagja?',
                answer: 1,
                type: 'multiplication',
                expression: 'e^x = 1 + x + x²/2! + ..., első tag: 1'
            };
        } else if (topicIdLower.includes('ketvaltozos') || topicIdLower.includes('kétváltozós')) {
            return {
                question: 'f(x,y) = x² + y², ∂f/∂x(1,2) = ?',
                answer: 2,
                type: 'multiplication',
                expression: '∂f/∂x = 2x, ∂f/∂x(1,2) = 2·1 = 2'
            };
        } else if (topicIdLower.includes('tobbvaltozos') || topicIdLower.includes('többváltozós')) {
            return {
                question: 'f(x,y,z) = x² + y² + z², ∂f/∂x(1,1,1) = ?',
                answer: 2,
                type: 'multiplication',
                expression: '∂f/∂x = 2x, ∂f/∂x(1,1,1) = 2·1 = 2'
            };
        }
    }
    // Analízis III témakörök
    else if (subjectIdLower.includes('analizis3') || subjectIdLower.includes('analizis-3')) {
        if (topicIdLower.includes('vektoranalizis') || topicIdLower.includes('vektoranalízis') || topicIdLower.includes('vektor')) {
            return {
                question: '(2,3,1) és (1,1,0) vektorok skaláris szorzata?',
                answer: 5,
                type: 'multiplication',
                expression: '(2,3,1)·(1,1,0) = 2·1 + 3·1 + 1·0 = 5'
            };
        } else if (topicIdLower.includes('differencialegyenletek') || topicIdLower.includes('differenciálegyenlet')) {
            return {
                question: 'dy/dx = y egyenlet általános megoldása? (Egyszerűsített, C=1 esetén y(0)=?)',
                answer: 1,
                type: 'multiplication',
                expression: 'y = Ce^x, C=1 esetén y(0) = 1'
            };
        }
    }

    // Alapértelmezett: deriválás
    return generateDerivativeQuestion();
};
