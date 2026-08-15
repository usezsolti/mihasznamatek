/** Shared whiteboard stroke model (teacher + student). */

export type WbTool =
    | 'pen'
    | 'highlighter'
    | 'eraser'
    | 'line'
    | 'rect'
    | 'ellipse'
    | 'polygon'
    | 'text'
    | 'pan';

export type WbPoint = { x: number; y: number };

export type WbStroke = {
    id: string;
    tool: Exclude<WbTool, 'pan'>;
    color: string;
    width: number;
    points: WbPoint[];
    /** Shapes / text box origin */
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    text?: string;
    authorId: string;
    authorName: string;
    createdAtMs: number;
};

export type WbBoardMeta = {
    id: string;
    title: string;
    createdBy: string;
    createdAtMs: number;
    updatedAtMs: number;
};

export const WB_COLORS = [
    '#000000', // fekete
    '#ffffff', // fehér
    '#e03131', // piros
    '#fd7e14', // narancs
    '#fab005', // sárga
    '#2f9e44', // zöld
    '#1971c2', // kék
    '#9c36b5', // lila
    '#795548', // barna
    '#868e96', // szürke
];

export function newStrokeId(): string {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function newBoardId(): string {
    return `wb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
