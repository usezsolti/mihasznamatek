/** Kliens → Next.js / Node.js backend API */

export type BackendResponse<T> = { ok: true; data: T } | { ok: false; error: string };

async function getIdToken(): Promise<string | null> {
    try {
        const user = (window as any).firebase?.auth?.()?.currentUser;
        if (!user?.getIdToken) return null;
        return (await user.getIdToken()) || null;
    } catch {
        return null;
    }
}

export async function backendHealth(): Promise<BackendResponse<Record<string, unknown>>> {
    const res = await fetch('/api/backend/health');
    return res.json();
}

export async function backendSocial<T = unknown>(
    action: string,
    body: Record<string, unknown> = {}
): Promise<T> {
    const token = await getIdToken();
    if (!token) throw new Error('Bejelentkezés szükséges.');

    const res = await fetch('/api/backend/social', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, ...body }),
    });
    const json = (await res.json()) as BackendResponse<T>;
    if (!res.ok || !json.ok) {
        throw new Error((json as any)?.error || `Backend hiba (${res.status})`);
    }
    return json.data;
}
