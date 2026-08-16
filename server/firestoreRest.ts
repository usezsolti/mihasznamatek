/** Firestore REST codec + CRUD (Node.js, user ID tokennel). */

import { FIRESTORE_COMMIT_URL, FIRESTORE_DOCS_BASE } from './config';

type FsValue =
    | { stringValue: string }
    | { integerValue: string }
    | { doubleValue: number }
    | { booleanValue: boolean }
    | { timestampValue: string }
    | { nullValue: null }
    | { arrayValue: { values?: FsValue[] } }
    | { mapValue: { fields?: Record<string, FsValue> } };

export function toFsValue(v: unknown): FsValue {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') {
        if (Number.isInteger(v)) return { integerValue: String(v) };
        return { doubleValue: v };
    }
    if (Array.isArray(v)) {
        return { arrayValue: { values: v.map(toFsValue) } };
    }
    if (typeof v === 'object') {
        const fields: Record<string, FsValue> = {};
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
            fields[k] = toFsValue(val);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(v) };
}

export function fromFsValue(v: any): unknown {
    if (!v || typeof v !== 'object') return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('timestampValue' in v) return v.timestampValue;
    if ('nullValue' in v) return null;
    if ('arrayValue' in v) {
        return (v.arrayValue?.values || []).map(fromFsValue);
    }
    if ('mapValue' in v) {
        const out: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(v.mapValue?.fields || {})) {
            out[k] = fromFsValue(val);
        }
        return out;
    }
    return null;
}

export function docToObject(doc: any): Record<string, unknown> {
    const fields = doc?.fields || {};
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
        out[k] = fromFsValue(v);
    }
    if (doc?.name) {
        const parts = String(doc.name).split('/');
        out.__id = parts[parts.length - 1];
    }
    return out;
}

export function objectToFields(data: Record<string, unknown>): Record<string, FsValue> {
    const fields: Record<string, FsValue> = {};
    for (const [k, v] of Object.entries(data)) {
        if (k.startsWith('__')) continue;
        fields[k] = toFsValue(v);
    }
    return fields;
}

async function fsFetch(url: string, token: string, init?: RequestInit) {
    const res = await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
        },
    });
    const text = await res.text();
    let json: any = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {
        json = { raw: text };
    }
    if (!res.ok) {
        const msg = json?.error?.message || json?.error || text || `Firestore HTTP ${res.status}`;
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
    return json;
}

export async function getDocument(path: string, token: string): Promise<Record<string, unknown> | null> {
    const url = `${FIRESTORE_DOCS_BASE}/${path}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) return null;
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
        throw new Error(json?.error?.message || `Firestore get failed (${res.status})`);
    }
    return docToObject(json);
}

export async function setDocument(
    path: string,
    token: string,
    data: Record<string, unknown>,
    merge = true
): Promise<void> {
    const fields = objectToFields(data);
    if (merge) {
        // Ha még nincs a doksi, a PATCH 404-et ad — ilyenkor create
        try {
            const mask = Object.keys(fields)
                .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
                .join('&');
            await fsFetch(`${FIRESTORE_DOCS_BASE}/${path}?${mask}`, token, {
                method: 'PATCH',
                body: JSON.stringify({ fields }),
            });
            return;
        } catch (e: any) {
            const msg = String(e?.message || e);
            if (!/not found|404|NOT_FOUND/i.test(msg)) throw e;
        }
    }
    const parts = path.split('/');
    const docId = parts.pop();
    const parent = parts.join('/');
    if (!docId || !parent) throw new Error(`Érvénytelen Firestore path: ${path}`);
    await fsFetch(`${FIRESTORE_DOCS_BASE}/${parent}?documentId=${encodeURIComponent(docId)}`, token, {
        method: 'POST',
        body: JSON.stringify({ fields }),
    });
}

export async function createDocument(
    collection: string,
    token: string,
    data: Record<string, unknown>,
    documentId?: string
): Promise<string> {
    const fields = objectToFields(data);
    const q = documentId ? `?documentId=${encodeURIComponent(documentId)}` : '';
    const json = await fsFetch(`${FIRESTORE_DOCS_BASE}/${collection}${q}`, token, {
        method: 'POST',
        body: JSON.stringify({ fields }),
    });
    const name = String(json?.name || '');
    const parts = name.split('/');
    return parts[parts.length - 1] || documentId || '';
}

export async function deleteDocument(path: string, token: string): Promise<void> {
    await fsFetch(`${FIRESTORE_DOCS_BASE}/${path}`, token, { method: 'DELETE' });
}

export async function listCollection(
    collection: string,
    token: string,
    opts?: { pageSize?: number; orderBy?: string }
): Promise<Array<Record<string, unknown>>> {
    const params = new URLSearchParams();
    if (opts?.pageSize) params.set('pageSize', String(opts.pageSize));
    if (opts?.orderBy) params.set('orderBy', opts.orderBy);
    const q = params.toString() ? `?${params}` : '';
    const json = await fsFetch(`${FIRESTORE_DOCS_BASE}/${collection}${q}`, token);
    return (json?.documents || []).map(docToObject);
}

export async function runQuery(
    token: string,
    structuredQuery: Record<string, unknown>
): Promise<Array<Record<string, unknown>>> {
    const url = `${FIRESTORE_DOCS_BASE}:runQuery`;
    const json = await fsFetch(url, token, {
        method: 'POST',
        body: JSON.stringify({ structuredQuery }),
    });
    if (!Array.isArray(json)) return [];
    return json
        .filter((row) => row?.document)
        .map((row) => docToObject(row.document));
}

export async function commitIncrement(
    token: string,
    docPath: string,
    field: string,
    by: number
): Promise<void> {
    const { FIREBASE_PROJECT_ID } = await import('./config');
    const fullName = `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${docPath}`;
    await fsFetch(FIRESTORE_COMMIT_URL, token, {
        method: 'POST',
        body: JSON.stringify({
            writes: [
                {
                    transform: {
                        document: fullName,
                        fieldTransforms: [
                            {
                                fieldPath: field,
                                increment: { integerValue: String(by) },
                            },
                        ],
                    },
                },
            ],
        }),
    });
}

export function nowMs() {
    return Date.now();
}
