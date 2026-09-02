export type GraphEdge = [string, string];

export type GraphLayout = 'circle' | 'bipartite' | 'path' | 'grid' | 'multipartite';

export type GraphFigure = {
    vertices: string[];
    edges: GraphEdge[];
    layout?: GraphLayout;
    parts?: string[][];
    grid?: { rows: number; cols: number };
    highlightVertices?: string[];
    caption?: string;
};

const letter = (i: number) => String.fromCharCode(65 + i);

export function labeled(verts: string, edges: string[]): GraphFigure {
    return {
        vertices: verts.split(''),
        edges: edges.map((e) => [e[0], e[1]] as GraphEdge),
        layout: 'circle',
    };
}

export function kn(n: number): GraphFigure {
    const vertices = Array.from({ length: n }, (_, i) => letter(i));
    const edges: GraphEdge[] = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) edges.push([vertices[i], vertices[j]]);
    }
    return { vertices, edges, layout: 'circle' };
}

export function cn(n: number): GraphFigure {
    const vertices = Array.from({ length: n }, (_, i) => letter(i));
    const edges: GraphEdge[] = vertices.map((v, i) => [v, vertices[(i + 1) % n]]);
    return { vertices, edges, layout: 'circle' };
}

export function knm(a: number, b: number): GraphFigure {
    const left = Array.from({ length: a }, (_, i) => letter(i));
    const right = Array.from({ length: b }, (_, i) => letter(a + i));
    const edges: GraphEdge[] = [];
    for (const u of left) for (const v of right) edges.push([u, v]);
    return { vertices: [...left, ...right], edges, layout: 'bipartite', parts: [left, right] };
}

export function kparts(sizes: number[]): GraphFigure {
    const parts: string[][] = [];
    let offset = 0;
    for (const s of sizes) {
        parts.push(Array.from({ length: s }, (_, i) => letter(offset + i)));
        offset += s;
    }
    const vertices = parts.flat();
    const edges: GraphEdge[] = [];
    for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
            for (const u of parts[i]) for (const v of parts[j]) edges.push([u, v]);
        }
    }
    return { vertices, edges, layout: 'multipartite', parts };
}

export function pathGraph(labels: string[]): GraphFigure {
    const edges: GraphEdge[] = labels.slice(1).map((v, i) => [labels[i], v]);
    return { vertices: labels, edges, layout: 'path' };
}

export function gridGraph(rows: number, cols: number): GraphFigure {
    const vertices: string[] = [];
    const index = (r: number, c: number) => r * cols + c;
    for (let i = 0; i < rows * cols; i++) vertices.push(letter(i));
    const edges: GraphEdge[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const id = vertices[index(r, c)];
            if (c + 1 < cols) edges.push([id, vertices[index(r, c + 1)]]);
            if (r + 1 < rows) edges.push([id, vertices[index(r + 1, c)]]);
        }
    }
    return { vertices, edges, layout: 'grid', grid: { rows, cols } };
}

export type GraphPoint = { x: number; y: number };

export function layoutGraph(
    figure: GraphFigure,
    width = 320,
    height = 220
): Record<string, GraphPoint> {
    const padX = 36;
    const padY = 32;
    const pos: Record<string, GraphPoint> = {};
    const layout = figure.layout || 'circle';

    if (layout === 'path') {
        const n = figure.vertices.length;
        figure.vertices.forEach((v, i) => {
            const t = n === 1 ? 0.5 : i / (n - 1);
            pos[v] = { x: padX + t * (width - 2 * padX), y: height / 2 };
        });
        return pos;
    }

    if (layout === 'grid' && figure.grid) {
        const { rows, cols } = figure.grid;
        figure.vertices.forEach((v, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            pos[v] = {
                x: padX + (cols === 1 ? 0.5 : c / (cols - 1)) * (width - 2 * padX),
                y: padY + (rows === 1 ? 0.5 : r / (rows - 1)) * (height - 2 * padY),
            };
        });
        return pos;
    }

    if ((layout === 'bipartite' || layout === 'multipartite') && figure.parts?.length) {
        const parts = figure.parts;
        const cols = parts.length;
        parts.forEach((part, col) => {
            const x = padX + (cols === 1 ? 0.5 : col / (cols - 1)) * (width - 2 * padX);
            part.forEach((v, i) => {
                const t = part.length === 1 ? 0.5 : i / (part.length - 1);
                pos[v] = { x, y: padY + t * (height - 2 * padY) };
            });
        });
        figure.vertices.forEach((v) => {
            if (!pos[v]) pos[v] = { x: width / 2, y: height / 2 };
        });
        return pos;
    }

    const n = figure.vertices.length;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - 28;
    figure.vertices.forEach((v, i) => {
        const a = (-Math.PI / 2) + (2 * Math.PI * i) / Math.max(1, n);
        pos[v] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
    return pos;
}
