export const ADMIN_EMAIL = "usezsolti@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
    return (email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
