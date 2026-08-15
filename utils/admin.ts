/**
 * Admin e-mail lista — env + kijelölt admin login fiók (ADMIN_LOGIN_EMAIL).
 * Production: ha nincs env → csak a kijelölt admin e-mail.
 * Dev: ALLOW_DEV_ADMIN_FALLBACK=1 ugyanarra a fallbackre.
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
    const merge = (list: string[]) => {
        const set = new Set(list.map((e) => e.toLowerCase()));
        set.add(primary);
        return [...set];
    };

    if (fromEnv.length) return merge(fromEnv);

    if (process.env.NODE_ENV === 'production') {
        // Fail-closed for arbitrary emails; designated owner admin still allowed.
        if (!primary) return [];
        return [primary];
    }

    if (String(process.env.ALLOW_DEV_ADMIN_FALLBACK || '') === '1') {
        return [primary];
    }

    // Local/dev: one-click admin still works
    return primary ? [primary] : [];
}

export const ADMIN_EMAILS = parseAdminEmails();

/** Első admin e-mail */
export const ADMIN_EMAIL = ADMIN_EMAILS[0] || '';

export function isAdminEmail(email?: string | null): boolean {
    const e = (email || '').toLowerCase();
    if (!e) return false;
    if (ADMIN_EMAILS.includes(e)) return true;
    // Gmail +alias (usezsolti+mihaadmin@…) is admin, ha az alap cím az
    const primary = FALLBACK_ADMIN.toLowerCase();
    if (e.endsWith('@gmail.com') && primary.endsWith('@gmail.com')) {
        const base = (addr: string) => addr.split('@')[0].split('+')[0];
        if (base(e) === base(primary)) return true;
    }
    return false;
}
