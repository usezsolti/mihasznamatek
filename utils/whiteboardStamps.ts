import { newStrokeId, type WbPoint, type WbStroke } from './whiteboardTypes';

export type StampId = 'axes' | 'numberline' | 'unitcircle' | 'triangle' | 'righttriangle' | 'circle';

export const WHITEBOARD_STAMPS: { id: StampId; label: string }[] = [
    { id: 'axes', label: 'Koordinátarendszer' },
    { id: 'numberline', label: 'Számegyenes' },
    { id: 'unitcircle', label: 'Egységkör' },
    { id: 'triangle', label: 'Háromszög' },
    { id: 'righttriangle', label: 'Derékszögű háromszög' },
    { id: 'circle', label: 'Kör sugárral' },
];

/** A tábla háttere sötét, ezért a bélyegző a toll színétől függetlenül világos. */
const INK = '#f4f6fb';

type Author = { authorId: string; authorName: string };

function line(a: WbPoint, b: WbPoint, author: Author, width = 2): WbStroke {
    return {
        id: newStrokeId(),
        tool: 'line',
        color: INK,
        width,
        points: [a, b],
        authorId: author.authorId,
        authorName: author.authorName,
        createdAtMs: Date.now(),
    };
}

function arrow(from: WbPoint, to: WbPoint, author: Author): WbStroke[] {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const back = { x: to.x - ux * 14, y: to.y - uy * 14 };
    return [
        line(from, to, author),
        line(to, { x: back.x - uy * 6, y: back.y + ux * 6 }, author),
        line(to, { x: back.x + uy * 6, y: back.y - ux * 6 }, author),
    ];
}

function text(value: string, x: number, y: number, author: Author): WbStroke {
    return {
        id: newStrokeId(),
        tool: 'text',
        color: INK,
        width: 4,
        points: [],
        x,
        y,
        text: value,
        authorId: author.authorId,
        authorName: author.authorName,
        createdAtMs: Date.now(),
    };
}

function oval(x: number, y: number, w: number, h: number, author: Author): WbStroke {
    return {
        id: newStrokeId(),
        tool: 'ellipse',
        color: INK,
        width: 2,
        points: [],
        x,
        y,
        w,
        h,
        authorId: author.authorId,
        authorName: author.authorName,
        createdAtMs: Date.now(),
    };
}

function poly(points: WbPoint[], author: Author): WbStroke {
    return {
        id: newStrokeId(),
        tool: 'polygon',
        color: INK,
        width: 2,
        points,
        authorId: author.authorId,
        authorName: author.authorName,
        createdAtMs: Date.now(),
    };
}

function axes(cx: number, cy: number, author: Author): WbStroke[] {
    const strokes: WbStroke[] = [
        ...arrow({ x: cx - 150, y: cy }, { x: cx + 170, y: cy }, author),
        ...arrow({ x: cx, y: cy + 140 }, { x: cx, y: cy - 160 }, author),
    ];
    for (const tick of [-120, -80, -40, 40, 80, 120]) {
        strokes.push(line({ x: cx + tick, y: cy - 6 }, { x: cx + tick, y: cy + 6 }, author, 1.5));
    }
    for (const tick of [-80, -40, 40, 80, 120]) {
        strokes.push(line({ x: cx - 6, y: cy - tick }, { x: cx + 6, y: cy - tick }, author, 1.5));
    }
    strokes.push(text('O', cx + 8, cy + 6, author));
    strokes.push(text('x', cx + 150, cy + 8, author));
    strokes.push(text('y', cx + 8, cy - 168, author));
    return strokes;
}

function numberLine(cx: number, cy: number, author: Author): WbStroke[] {
    const strokes = [...arrow({ x: cx - 170, y: cy }, { x: cx + 180, y: cy }, author)];
    for (let i = -3; i <= 3; i++) {
        const x = cx + i * 44;
        strokes.push(line({ x, y: cy - 8 }, { x, y: cy + 8 }, author, 1.5));
        if (i % 2 === 0) strokes.push(text(String(i), x - 6, cy + 12, author));
    }
    return strokes;
}

function unitCircle(cx: number, cy: number, author: Author): WbStroke[] {
    return [
        oval(cx - 100, cy - 100, 200, 200, author),
        line({ x: cx - 120, y: cy }, { x: cx + 120, y: cy }, author, 1.5),
        line({ x: cx, y: cy + 120 }, { x: cx, y: cy - 120 }, author, 1.5),
        text('0', cx + 108, cy - 8, author),
        text('π/2', cx - 16, cy - 128, author),
        text('π', cx - 136, cy - 8, author),
        text('3π/2', cx - 24, cy + 108, author),
    ];
}

function triangle(cx: number, cy: number, author: Author): WbStroke[] {
    const a = { x: cx - 90, y: cy + 70 };
    const b = { x: cx + 100, y: cy + 55 };
    const c = { x: cx - 15, y: cy - 85 };
    return [
        poly([a, b, c], author),
        text('A', a.x - 20, a.y + 2, author),
        text('B', b.x + 8, b.y + 2, author),
        text('C', c.x - 8, c.y - 28, author),
    ];
}

function rightTriangle(cx: number, cy: number, author: Author): WbStroke[] {
    const a = { x: cx - 80, y: cy + 70 };
    const b = { x: cx + 90, y: cy + 70 };
    const c = { x: cx - 80, y: cy - 80 };
    const mark = 18;
    return [
        poly([a, b, c], author),
        line({ x: a.x, y: a.y - mark }, { x: a.x + mark, y: a.y - mark }, author, 1.5),
        line({ x: a.x + mark, y: a.y - mark }, { x: a.x + mark, y: a.y }, author, 1.5),
        text('A', a.x - 20, a.y + 2, author),
        text('B', b.x + 8, b.y + 2, author),
        text('C', c.x - 18, c.y - 26, author),
    ];
}

function circle(cx: number, cy: number, author: Author): WbStroke[] {
    const radius = 90;
    return [
        oval(cx - radius, cy - radius, radius * 2, radius * 2, author),
        line({ x: cx, y: cy }, { x: cx + radius, y: cy }, author),
        oval(cx - 3, cy - 3, 6, 6, author),
        text('O', cx - 24, cy + 6, author),
        text('r', cx + radius / 2 - 6, cy - 20, author),
    ];
}

export function buildStamp(id: StampId, center: WbPoint, author: Author): WbStroke[] {
    switch (id) {
        case 'axes':
            return axes(center.x, center.y, author);
        case 'numberline':
            return numberLine(center.x, center.y, author);
        case 'unitcircle':
            return unitCircle(center.x, center.y, author);
        case 'triangle':
            return triangle(center.x, center.y, author);
        case 'righttriangle':
            return rightTriangle(center.x, center.y, author);
        case 'circle':
            return circle(center.x, center.y, author);
    }
}
