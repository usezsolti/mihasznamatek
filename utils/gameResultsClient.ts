/**
 * gameResults kliens — Postgres API.
 */
import { apiGetAuth, apiPostAuth } from './apiClient';

export type GameResultDoc = { id: string; [k: string]: unknown };

export async function fetchGameResultsForUser(userId: string): Promise<{
    results: GameResultDoc[];
    source: 'userId' | 'uid' | 'empty';
    permissionDenied: boolean;
}> {
    if (!userId) {
        return { results: [], source: 'empty', permissionDenied: false };
    }

    try {
        const path =
            typeof window !== 'undefined'
                ? '/api/game-results'
                : `/api/game-results?userId=${encodeURIComponent(userId)}`;
        const res = await apiGetAuth<{ results: GameResultDoc[] }>(path);
        if (!res.ok) {
            const denied = res.status === 401 || res.status === 403;
            return { results: [], source: 'empty', permissionDenied: denied };
        }
        return { results: res.data.results || [], source: 'userId', permissionDenied: false };
    } catch (err) {
        console.warn('gameResults load failed:', err);
        return { results: [], source: 'empty', permissionDenied: false };
    }
}

export async function saveGameResult(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
    try {
        const res = await apiPostAuth<{ result: GameResultDoc }>('/api/game-results', payload);
        if (!res.ok) return { ok: false, error: res.error };
        return { ok: true };
    } catch (err) {
        return { ok: false, error: String((err as Error)?.message || err) };
    }
}
