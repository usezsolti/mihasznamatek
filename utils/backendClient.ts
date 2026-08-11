/**
 * Backend convenience — vékony wrapper az apiClient fölött (backward compat).
 * Új kód: preferáld közvetlenül az apiClient domain helperjeit.
 */
import {
    apiBackendHealth,
    apiBackendSocial,
    authHeaders,
    getIdToken,
    type ApiResult,
    type BackendResponse,
} from './apiClient';

export type { BackendResponse };
export { authHeaders, getIdToken };

export async function backendHealth(): Promise<BackendResponse<Record<string, unknown>>> {
    const res = await apiBackendHealth();
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true, data: res.data };
}

/** Social action — throw on error (socialApi viaBackend elvárja). */
export async function backendSocial<T = unknown>(
    action: string,
    body: Record<string, unknown> = {}
): Promise<T> {
    const res: ApiResult<T> = await apiBackendSocial<T>(action, body);
    if (!res.ok) {
        throw new Error(res.error || 'Backend hiba');
    }
    return res.data;
}
