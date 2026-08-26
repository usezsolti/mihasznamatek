/**
 * Admin e-mail — csak a kijelölt cím(ek). Nincs Gmail +alias wildcard.
 * Extra adminok: szerveroldali ADMIN_EMAILS / ADMIN_EMAIL (nem NEXT_PUBLIC_*).
 */
import { ADMIN_LOGIN_EMAIL } from './adminLoginShared';

const FALLBACK_ADMIN = ADMIN_LOGIN_EMAIL;

function parseAdminEmails(): string[] {
    const primary = FALLBACK_ADMIN.toLowerCase();
    const set = new Set<string>();
    if (primary) set.add(primary);

    // Kliens bundle-ben ne legyen bővíthető allowlist (NEXT_PUBLIC leak + rules mismatch)
    const raw =
        typeof window === 'undefined'
            ? process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''
            : '';

    for (const e of raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)) {
        set.add(e);
    }
    return [...set];
}

export const ADMIN_EMAILS = parseAdminEmails();

/** Első admin e-mail */
export const ADMIN_EMAIL = ADMIN_EMAILS[0] || '';

export function isAdminEmail(email?: string | null): boolean {
    const e = (email || '').trim().toLowerCase();
    if (!e) return false;
    return ADMIN_EMAILS.includes(e);
}
