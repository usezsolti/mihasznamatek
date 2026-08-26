/** Mai / holnapi dátumkulcs Budapest időzónában (YYYY-MM-DD). */
export function getBudapestDateKeyOffset(daysFromToday: number): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Budapest',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    const y = Number(parts.find((p) => p.type === 'year')?.value);
    const m = Number(parts.find((p) => p.type === 'month')?.value);
    const d = Number(parts.find((p) => p.type === 'day')?.value);
    const base = new Date(Date.UTC(y, m - 1, d));
    base.setUTCDate(base.getUTCDate() + daysFromToday);
    const yy = base.getUTCFullYear();
    const mm = String(base.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(base.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

/** Éles / lokális site URL a dashboard linkekhez. */
export function resolveSiteOrigin(options?: {
    clientOrigin?: string;
    hostHeader?: string | string[];
    protoHeader?: string | string[];
}): string {
    const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
    if (envUrl) return envUrl;

    const hostRaw = options?.hostHeader;
    const host = Array.isArray(hostRaw) ? hostRaw[0] : hostRaw;
    const protoRaw = options?.protoHeader;
    const proto = (Array.isArray(protoRaw) ? protoRaw[0] : protoRaw) || 'https';

    if (host && !/localhost|127\.0\.0\.1/i.test(host)) {
        return `${proto}://${host}`.replace(/\/$/, '');
    }

    const client = (options?.clientOrigin || '').replace(/\/$/, '');
    if (client) return client;

    return 'https://mihasznamatek.hu';
}
