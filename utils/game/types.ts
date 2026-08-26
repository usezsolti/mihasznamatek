import type { PracticeStage } from '../practiceProgress';

export interface Question {
    question: string;
    answer: number;
    alternativeAnswer?: number; // Második válasz lehetőség (pl. abszolútértékes egyenleteknél)
    thirdAnswer?: number; // Harmadik válasz lehetőség
    fourthAnswer?: number; // Negyedik válasz lehetőség
    type: 'addition' | 'subtraction' | 'multiplication' | 'division';
    expression: string;
    longDivision?: string;
    id?: string; // Opcionális ID a feladatok azonosításához
    level?: string; // Opcionális szint információ
    stage?: PracticeStage; // Munkalap nehézségi szakasz
    expectedSet?: string[]; // Halmaz elemei — sorrend nem számít
    subQuestions?: Array<{ // Részfeladatok külön válaszmezőkkel
        question: string;
        rubric: string;
        answer: number;
    }>;
}
