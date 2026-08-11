/**
 * Egységes kliens API réteg — minden /api hívás { ok, data|error } felé.
 * Presentation/hooks/utils ezt használják; ne legyen ad-hoc fetch('/api/...').
 */
import { parseApiEnvelope, type ApiErr, type ApiOk, type ApiResult } from './apiEnvelope';

export type { ApiErr, ApiOk, ApiResult };
export { parseApiEnvelope };

/** @deprecated alias — használd ApiResult */
export type BackendResponse<T> = { ok: true; data: T } | { ok: false; error: string };

export async function getIdToken(): Promise<string | null> {
    try {
        const user = (window as any).firebase?.auth?.()?.currentUser;
        if (!user?.getIdToken) return null;
        return (await user.getIdToken()) || null;
    } catch {
        return null;
    }
}

export async function authHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
    const token = await getIdToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(extra || {}),
    };
}

export async function apiRequest<T>(
    path: string,
    init?: RequestInit
): Promise<ApiResult<T>> {
    try {
        const res = await fetch(path, init);
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
        ...rest,
    });
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    return apiRequest<T>(path, { method: 'GET', ...init });
}

/** Auth-os POST (Bearer + JSON). */
export async function apiPostAuth<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return apiPost<T>(path, body, { headers: await authHeaders() });
}

/** Auth-os GET. */
export async function apiGetAuth<T>(path: string): Promise<ApiResult<T>> {
    return apiGet<T>(path, { headers: await authHeaders() });
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
        customToken?: string;
        email?: string;
        localId?: string;
        method?: string;
        oneTimePassword?: string;
    }>('/api/auth/test-login', {});
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

export async function apiFirestoreRulesText() {
    return apiGetAuth<{ rules: string }>('/api/backend/firestore-rules-text');
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
