/** JSON stored as String for SQLite compatibility. */

export function parseJsonField<T>(raw: unknown, fallback: T): T {
    if (raw == null || raw === '') return fallback;
    if (typeof raw !== 'string') return raw as T;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function stringifyJsonField(value: unknown): string {
    return JSON.stringify(value ?? null);
}
