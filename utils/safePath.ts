/**
 * Csak same-origin relatív app path — open redirect ellen.
 * Engedélyezett: "/dashboard", "/ora/abc?x=1"
 * Tiltott: "//evil.com", "https://…", "\\evil", ""
 */
export function safeAppPath(path: unknown): string | null {
    if (typeof path !== 'string') return null;
    const p = path.trim();
    if (!p.startsWith('/')) return null;
    if (p.startsWith('//')) return null;
    if (p.includes('://')) return null;
    if (p.includes('\\')) return null;
    if (/[\u0000-\u001F]/.test(p)) return null;
    return p;
}
