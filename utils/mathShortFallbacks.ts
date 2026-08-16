/** Shorts tartalom: nincs beépített minta — csak valódi feltöltött videók. */
import type { MathShort, SocialPost } from './socialTypes';

export const SAMPLE_VIDEO_SHORTS: SocialPost[] = [];

/** Csak /api/generate-math-short tartalék — nem a Shorts fül. */
export const FALLBACK_MATH_SHORTS: Omit<MathShort, 'id'>[] = [
    {
        topic: 'Matek',
        title: 'Gyors tipp',
        hook: 'Egy rövid emlékeztető',
        body: 'Gyakorolj naponta 10 percet — a rutinos fejszámolás felgyorsítja a vizsgát.',
        tip: 'Írd le a lépéseket hangosan.',
        difficulty: 'közepes',
        createdAtMs: Date.now(),
    },
];
