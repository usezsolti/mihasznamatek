const MAX_EDGE = 1600;
const MAX_SRC_CHARS = 700_000;
const QUALITIES = [0.82, 0.68, 0.52, 0.38, 0.26];

const cache = new Map<string, HTMLImageElement>();

export function primeWhiteboardImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const existing = cache.get(src);
        if (existing?.complete && existing.naturalWidth > 0) {
            resolve();
            return;
        }
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('A kép nem tölthető be.'));
        img.src = src;
        cache.set(src, img);
    });
}

export function drawCachedImage(
    ctx: CanvasRenderingContext2D,
    src: string,
    x: number,
    y: number,
    w: number,
    h: number,
    onReady: () => void
): void {
    let img = cache.get(src);
    if (!img) {
        img = new Image();
        img.onload = () => onReady();
        img.src = src;
        cache.set(src, img);
    }
    if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x, y, w, h);
    }
}

/** Shrink a clipboard image so the stroke document stays under Firestore's 1 MB limit. */
export async function compressWhiteboardImage(blob: Blob): Promise<{ src: string; width: number; height: number }> {
    const bitmap = await createImageBitmap(blob);
    try {
        const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('A kép nem dolgozható fel.');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        for (const quality of QUALITIES) {
            const src = canvas.toDataURL('image/jpeg', quality);
            if (src.length <= MAX_SRC_CHARS) return { src, width, height };
        }
        throw new Error('A kép túl nagy a táblához.');
    } finally {
        bitmap.close();
    }
}
