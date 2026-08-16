/**
 * Admin e-mail — csak a kijelölt cím(ek). Nincs Gmail +alias wildcard.
 */
import { ADMIN_LOGIN_EMAIL } from './adminLoginShared';

const FALLBACK_ADMIN = ADMIN_LOGIN_EMAIL;

function parseAdminEmails(): string[] {
    const raw =
        process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
        process.env.ADMIN_EMAILS ||
        process.env.ADMIN_EMAIL ||
        '';
    const fromEnv = raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

    const primary = FALLBACK_ADMIN.toLowerCase();
    const set = new Set<string>();
    if (primary) set.add(primary);
    for (const e of fromEnv) set.add(e);
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
