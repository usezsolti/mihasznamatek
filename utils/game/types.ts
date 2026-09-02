import type { PracticeStage } from '../practiceProgress';
import type { GraphFigure } from './graphFigure';
import type { QuestionFigure } from './questionFigure';

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
    /** Egy ábra (kép / gráf / általános rajz) — bármely témakörnél */
    figure?: QuestionFigure;
    /** Több ábra ugyanazon a kártyán */
    figures?: QuestionFigure[];
    /** Rövidítés: graph: labeled(...) ugyanaz, mint figure: { kind: 'graph', graph } */
    graph?: GraphFigure;
    /** Rövidítés: imageSrc: '/figures/tema/abra.png' */
    imageSrc?: string;
    subQuestions?: Array<{ // Részfeladatok külön válaszmezőkkel
        question: string;
        rubric: string;
        answer: number;
    }>;
}
