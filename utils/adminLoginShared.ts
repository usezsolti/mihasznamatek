/** Shared admin login identity — NEM tartalmaz jelszót. */

export const ADMIN_LOGIN_EMAIL = 'usezsolti@gmail.com';

export function isAdminQuickLoginAllowed(): boolean {
    // Always allow calling the API; API itself enforces password + admin list.
    return true;
}
