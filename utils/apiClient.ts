/**
 * Egységes kliens API réteg — minden /api hívás { ok, data|error } felé.
 * Presentation/hooks/utils ezt használják; ne legyen ad-hoc fetch('/api/...').
 */
import { parseApiEnvelope, type ApiErr, type ApiOk, type ApiResult } from './apiEnvelope';

export type { ApiErr, ApiOk, ApiResult };
export { parseApiEnvelope };

/** @deprecated alias — használd ApiResult */
export type BackendResponse<T> = { ok: true; data: T } | { ok: false; error: string };

/** Auth.js cookie session — nincs Firebase ID token. */
export async function getIdToken(): Promise<string | null> {
    return null;
}

export async function authHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
    return {
        'Content-Type': 'application/json',
        ...(extra || {}),
    };
}

export async function apiRequest<T>(
    path: string,
    init?: RequestInit
): Promise<ApiResult<T>> {
    try {
        const res = await fetch(path, {
            credentials: 'include',
            ...init,
        });
        const json = await res.json().catch(() => ({}));
        return parseApiEnvelope<T>(res.status, json);
    } catch (e: any) {
        return { ok: false, error: String(e?.message || e), status: 0 };
    }
}

export async function apiPost<T>(
    path: string,
    body?: unknown,
    init?: RequestInit
): Promise<ApiResult<T>> {
    const { headers: initHeaders, body: _ignored, method: _m, ...rest } = init || {};
    return apiRequest<T>(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(initHeaders as Record<string, string>) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        credentials: 'include',
        ...rest,
    });
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    return apiRequest<T>(path, { method: 'GET', credentials: 'include', ...init });
}

/** Auth-os POST (session cookie + JSON). */
export async function apiPostAuth<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return apiPost<T>(path, body, { headers: await authHeaders() });
}

/** Auth-os GET. */
export async function apiGetAuth<T>(path: string): Promise<ApiResult<T>> {
    return apiGet<T>(path, { headers: await authHeaders() });
}

export async function apiPut<T>(
    path: string,
    body?: unknown,
    init?: RequestInit
): Promise<ApiResult<T>> {
    const { headers: initHeaders, body: _ignored, method: _m, ...rest } = init || {};
    return apiRequest<T>(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(initHeaders as Record<string, string>) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        credentials: 'include',
        ...rest,
    });
}

export async function apiPutAuth<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return apiPut<T>(path, body, { headers: await authHeaders() });
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    return apiRequest<T>(path, { method: 'DELETE', credentials: 'include', ...init });
}

export async function apiDeleteAuth<T>(path: string): Promise<ApiResult<T>> {
    return apiDelete<T>(path, { headers: await authHeaders() });
}

export async function apiPatch<T>(
    path: string,
    body?: unknown,
    init?: RequestInit
): Promise<ApiResult<T>> {
    const { headers: initHeaders, body: _ignored, method: _m, ...rest } = init || {};
    return apiRequest<T>(path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(initHeaders as Record<string, string>) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        credentials: 'include',
        ...rest,
    });
}

export async function apiPatchAuth<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return apiPatch<T>(path, body, { headers: await authHeaders() });
}

// ---- Domain helpers (egy helyen) ----

export async function apiChatGemini(
    message: string,
    history: { role: string; text: string }[] = []
) {
    return apiPost<{
        reply: string;
        source: string;
        hasKey?: boolean;
        model?: string;
        warning?: string;
    }>('/api/chat-gemini', { message, history });
}

export async function apiGenerateMathQuestion(topic: string, difficulty: string) {
    return apiPostAuth<{
        success?: boolean;
        question?: string;
        answer?: string | number;
        explanation?: string;
        error?: string;
    }>('/api/generate-math-question', { topic, difficulty });
}

export async function apiGenerateMathShort(topic: string, difficulty = 'közepes') {
    return apiPostAuth<{
        topic: string;
        title: string;
        hook: string;
        body: string;
        tip: string;
        difficulty?: string;
        createdAtMs?: number;
    }>('/api/generate-math-short', { topic, difficulty });
}

export async function apiTestLogin() {
    return apiPost<{
        uid?: string;
        email?: string;
        method?: string;
    }>('/api/auth/test-session-login', {});
}

export async function apiAdminLogin() {
    return apiPost<{
        customToken?: string;
        email?: string;
        localId?: string;
        method?: string;
        oneTimePassword?: string;
    }>('/api/auth/admin-login', {});
}

export async function apiBackendHealth() {
    return apiGet<Record<string, unknown>>('/api/backend/health');
}

export async function apiBackendSocial<T = unknown>(
    action: string,
    body: Record<string, unknown> = {}
): Promise<ApiResult<T>> {
    return apiPostAuth<T>('/api/backend/social', { action, ...body });
}

export async function apiSocialDiag() {
    return apiPostAuth<{
        ok?: boolean;
        step?: string;
        error?: string;
        existed?: boolean;
        [k: string]: unknown;
    }>('/api/backend/social-diag', {});
}

/** @deprecated Firebase rules removed. */
export async function apiFirestoreRulesText() {
    return { ok: false as const, error: 'Firestore rules removed — Postgres + Auth.js in use.', status: 410 };
}

export async function apiEmailStatus() {
    return apiGetAuth<{
        ready: boolean;
        mode: string;
        hasGmail: boolean;
        hasWeb3: boolean;
        siteConfigured: boolean;
        hint: string;
    }>('/api/email-status');
}

export async function apiSendBookingEmail(
    type: string,
    booking: Record<string, unknown>,
    origin?: string
) {
    return apiPostAuth<{
        provider?: string;
        warning?: string;
        needsActivation?: boolean;
    }>('/api/send-booking-email', {
        type,
        booking,
        origin:
            origin ||
            (typeof window !== 'undefined' ? window.location.origin : undefined),
    });
}

export async function apiNotifyStudent(payload: {
    to: string;
    studentName?: string;
    subject: string;
    message: string;
}) {
    return apiPostAuth<{ provider?: string }>('/api/admin/notify-student', payload);
}
