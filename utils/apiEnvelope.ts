/**
 * Tiszta API envelope parser — fetch nélkül, unit-tesztelhető.
 */

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = {
    ok: false;
    error: string;
    status: number;
    meta?: Record<string, unknown>;
};
export type ApiResult<T> = ApiOk<T> | ApiErr;

/** HTML / karbantartó oldal ne menjen ki a UI-ba. */
export function sanitizePublicError(raw: unknown, status = 0): string {
    const text = String(raw || '').trim();
    if (!text) return status ? `HTTP ${status}` : 'Ismeretlen hiba';
    if (/<!DOCTYPE|<html[\s>]|Site under maintenance|502 Bad Gateway|cloudflare/i.test(text)) {
        return status === 502
            ? 'A levelező szerver nem elérhető (502). Próbáld újra egy perc múlva.'
            : `A szerver HTML hibát adott (HTTP ${status || 'ismeretlen'}).`;
    }
    return text.length > 240 ? `${text.slice(0, 237)}...` : text;
}

/** HTTP status + JSON body → egységes ApiResult. */
export function parseApiEnvelope<T>(status: number, json: unknown): ApiResult<T> {
    const body = json as any;
    const httpOk = status >= 200 && status < 300;

    if (!httpOk || body?.ok === false) {
        const meta: Record<string, unknown> = {};
        if (body && typeof body === 'object') {
            for (const [k, v] of Object.entries(body)) {
                if (k === 'ok' || k === 'error' || k === 'data') continue;
                meta[k] = v;
            }
        }
        return {
            ok: false,
            error: sanitizePublicError(body?.error || `HTTP ${status}`, status),
            status,
            ...(Object.keys(meta).length ? { meta } : {}),
        };
    }

    if (body && typeof body === 'object' && 'data' in body && body.ok === true) {
        return { ok: true, data: body.data as T };
    }

    // Legacy flat ok:true (provider a gyökérben)
    if (body && typeof body === 'object' && body.ok === true) {
        const { ok: _ok, ...rest } = body;
        return { ok: true, data: rest as T };
    }

    return { ok: true, data: body as T };
}
