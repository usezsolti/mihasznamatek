import { evaluateScientific, formatScientific } from './scientificEval';
import { strokeInkBounds } from './whiteboardExport';
import type { WbPoint, WbStroke } from './whiteboardTypes';

/** Same-line gap: the equals sign sits just to the right of the expression. */
const BESIDE_GAP = 140;
const BESIDE_SLACK = 28;

function evaluated(expr: string): string | null {
    const left = expr.trim();
    if (!left) return null;
    try {
        return formatScientific(evaluateScientific(left, 'deg'));
    } catch {
        return null;
    }
}

/** `2+3=` → `2+3 = 5`. Returns null when the text does not end in equals or cannot be calculated. */
export function expressionWithResult(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed.endsWith('=')) return null;
    const left = trimmed.slice(0, -1).trim();
    const result = evaluated(left);
    if (result == null) return null;
    return `${left} = ${result}`;
}

function resultBeside(strokes: WbStroke[], at: WbPoint): string | null {
    let best: { gap: number; text: string } | null = null;
    for (const stroke of strokes) {
        if (stroke.tool !== 'text' || !stroke.text) continue;
        const result = evaluated(stroke.text);
        if (result == null) continue;
        const box = strokeInkBounds(stroke);
        const gap = at.x - box.maxX;
        if (gap < -BESIDE_SLACK || gap > BESIDE_GAP) continue;
        const midY = (box.minY + box.maxY) / 2;
        if (Math.abs(at.y - midY) > BESIDE_SLACK && (at.y < box.minY - BESIDE_SLACK || at.y > box.maxY + BESIDE_SLACK)) {
            continue;
        }
        if (!best || gap < best.gap) best = { gap, text: result };
    }
    return best?.text ?? null;
}

/** Text to place on the board. A trailing equals sign is filled in; a lone equals sign reads the expression to its left. */
export function textForBoard(typed: string, strokes: WbStroke[], at: WbPoint): string {
    const inline = expressionWithResult(typed);
    if (inline) return inline;
    const trimmed = typed.trim();
    if (trimmed === '=') {
        const value = resultBeside(strokes, at);
        if (value) return `= ${value}`;
    }
    return trimmed;
}
