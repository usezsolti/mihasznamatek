import type { MathShort } from './socialTypes';
import { FALLBACK_MATH_SHORTS } from './mathShortFallbacks';
import { apiGet, apiPostAuth } from './apiClient';

export { FALLBACK_MATH_SHORTS } from './mathShortFallbacks';

const LOCAL_KEY = 'mihaszna:mathShorts';

function readLocal(): MathShort[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') as MathShort[];
    } catch {
        return [];
    }
}

function writeLocal(list: MathShort[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 100)));
}

export async function saveMathShort(short: Omit<MathShort, 'id'>): Promise<MathShort> {
    const res = await apiPostAuth<MathShort>('/api/math-shorts', short);
    if (res.ok && res.data) {
        const list = readLocal();
        list.unshift(res.data);
        writeLocal(list);
        return res.data;
    }
    const local: MathShort = {
        id: `local_${Date.now()}`,
        ...short,
        createdAtMs: short.createdAtMs || Date.now(),
    };
    const list = readLocal();
    list.unshift(local);
    writeLocal(list);
    return local;
}

export async function listMathShorts(limit = 20): Promise<MathShort[]> {
    const res = await apiGet<{ shorts: MathShort[] }>(`/api/math-shorts?limit=${limit}`);
    if (res.ok && Array.isArray(res.data?.shorts) && res.data.shorts.length) {
        return res.data.shorts.slice(0, limit);
    }
    const local = readLocal();
    if (local.length) return local.slice(0, limit);
    return FALLBACK_MATH_SHORTS.slice(0, limit).map((s, i) => ({
        id: `fallback_${i}`,
        ...s,
        createdAtMs: Date.now() - i * 1000,
    })) as MathShort[];
}
