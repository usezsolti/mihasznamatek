/**
 * Admin e-mail lista — csak env (ADMIN_EMAILS / ADMIN_EMAIL).
 * Production: ha nincs env → senki sem admin (fail-closed).
 * Dev: opcionális FALLBACK csak ha ALLOW_DEV_ADMIN_FALLBACK=1.
 */
const FALLBACK_ADMIN = 'usezsolti@gmail.com';

function parseAdminEmails(): string[] {
    const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
    const fromEnv = raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    if (fromEnv.length) return fromEnv;
    if (process.env.NODE_ENV === 'production') {
        console.error('ADMIN_EMAILS missing in production — admin routes locked');
        return [];
    }
    if (String(process.env.ALLOW_DEV_ADMIN_FALLBACK || '') === '1') {
        return [FALLBACK_ADMIN.toLowerCase()];
    }
    return [];
}

export const ADMIN_EMAILS = parseAdminEmails();

/** Első admin e-mail (env), vagy üres string ha nincs konfigurálva */
export const ADMIN_EMAIL = ADMIN_EMAILS[0] || '';

export function isAdminEmail(email?: string | null): boolean {
    const e = (email || '').toLowerCase();
    if (!e) return false;
    return ADMIN_EMAILS.includes(e);
}
