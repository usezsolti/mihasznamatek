import type { Question } from './types';
import { agentDebugLog } from '../agentDebugLog';
import {
    bmeValszamGyakCount,
    getBmeValszamGyakQuestions,
    logBmeValszamBank,
} from './bmeValszamBanks';

export type BmeValszamPaperMeta = {
    id: string;
    n: number;
    title: string;
    subtitle: string;
    ready: boolean;
    questionCount: number;
};

function paper(
    n: number,
    title: string,
    subtitle: string,
    ready: boolean
): BmeValszamPaperMeta {
    const count = ready ? bmeValszamGyakCount(n) : 0;
    return {
        id: `valszam-bme-gyak${n}`,
        n,
        title,
        subtitle,
        ready: ready && count > 0,
        questionCount: count,
    };
}

export const BME_VALSZAM_PAPERS: BmeValszamPaperMeta[] = [
    paper(1, '1. gyakorlat', 'Eseményalgebra, Poincaré-formula · 2020. szept. 9–11.', true),
    paper(2, '2. gyakorlat', 'Feltételes valószínűség, Bayes · 2020. szept. 16–18.', true),
    paper(3, '3. gyakorlat', 'Diszkrét v.v., várható érték, geometriai valószínűség · 2020. szept. 30.', true),
    paper(4, '4. gyakorlat', 'Folytonos v.v., sűrűségfüggvény · 2020. okt. 7.', true),
    paper(5, '5. gyakorlat', 'Exponenciális, geometriai, Poisson · 2020. okt. 14.', true),
    paper(6, '6. gyakorlat', 'Transzformáltak · 2020. okt. 21.', true),
    paper(7, '7. gyakorlat', 'Függetlenség, korreláció · 2020. okt. 28.', true),
    paper(8, '8. gyakorlat', 'Együttes sűrűség, konvolúció · 2020. nov. 4.', true),
    paper(9, '9. gyakorlat', 'Normális eloszlás, CHT · 2020. nov. 11.', true),
    paper(10, '9. gyakorlat (nov. 18.)', 'Ugyanaz a sor, másik alkalom · Normális eloszlás, CHT', true),
    paper(11, '10. gyakorlat', 'Kovariancia, lineáris regresszió · 2020. nov. 25–27.', true),
    paper(12, '11. gyakorlat', 'Feltételes várható érték · 2020. dec. 2–4.', true),
];

export function getBmeValszamPaperById(paperId: string): BmeValszamPaperMeta | undefined {
    const id = String(paperId || '').toLowerCase();
    return BME_VALSZAM_PAPERS.find(
        (p) => p.id === id || id === `bme-vsz-${p.n}` || id === `gyak${p.n}`
    );
}

export function getBmeValszamPaperQuestions(paperId: string): Question[] | null {
    const id = String(paperId || '').toLowerCase();
    const meta = getBmeValszamPaperById(id);
    if (!meta) {
        const m = id.match(/(?:valszam-bme-gyak|bme-vsz-|gyak)(\d{1,2})$/);
        if (!m) {
            logBmeValszamBank(id, null, 'bmeValszamPapers.ts:miss');
            return null;
        }
        const n = parseInt(m[1], 10);
        const list = getBmeValszamGyakQuestions(n);
        logBmeValszamBank(id, list, 'bmeValszamPapers.ts:n');
        return list.length ? list : null;
    }
    const list = getBmeValszamGyakQuestions(meta.n);
    logBmeValszamBank(id, list, 'bmeValszamPapers.ts:get');
    return list.length ? list : null;
}

export function isBmeValszamPaperId(paperId: string): boolean {
    const id = String(paperId || '').toLowerCase();
    return (
        id.startsWith('valszam-bme-gyak') ||
        /^bme-vsz-\d+$/.test(id) ||
        Boolean(getBmeValszamPaperById(id))
    );
}

export function logBmeValszamCatalog(): void {
    // #region agent log
    agentDebugLog({
        hypothesisId: 'H30',
        location: 'bmeValszamPapers.ts:catalog',
        message: 'BME valszam papers catalog',
        data: {
            n: BME_VALSZAM_PAPERS.length,
            ready: BME_VALSZAM_PAPERS.filter((p) => p.ready).map((p) => ({
                id: p.id,
                q: p.questionCount,
            })),
            notReady: BME_VALSZAM_PAPERS.filter((p) => !p.ready).map((p) => p.id),
            gyak5Ready: BME_VALSZAM_PAPERS.find((p) => p.n === 5)?.ready === true,
            gyak5Count: BME_VALSZAM_PAPERS.find((p) => p.n === 5)?.questionCount ?? 0,
            gyak12Ready: BME_VALSZAM_PAPERS.find((p) => p.n === 12)?.ready === true,
            gyak12Count: BME_VALSZAM_PAPERS.find((p) => p.n === 12)?.questionCount ?? 0,
            hasValoszinusegId: BME_VALSZAM_PAPERS.some((p) => p.id.includes('valoszinuseg')),
        },
        runId: 'bme-valszam',
    });
    // #endregion
}
