/** Shared admin login identity — NEM tartalmaz jelszót. */

export const ADMIN_LOGIN_EMAIL = 'usezsolti@gmail.com';

/** Titkos tanári belépő URL (ne tedd a menübe / főoldalra). */
export const ADMIN_GATE_PATH = '/sigma-desk-m9k2';

/** Gyors / jelszó-relay tanári belépés — véglegesen kikapcsolva. */
export function isAdminQuickLoginAllowed(): boolean {
    return false;
}
