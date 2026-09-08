/** Közös regisztrációs / profil mezők a foglaló űrlappal. */

export const LESSON_SUBJECTS = [
    "Általános iskola matek",
    "Középiskola / gimnázium",
    "Érettségi felkészítés",
    "Egyetem",
    "Egyéb",
] as const;

export type PreferredLessonType = "online" | "personal";

export type RegistrationProfile = {
    name: string;
    username: string;
    preferredLessonType: PreferredLessonType;
    preferredSubject: string;
    hobby: string;
    postalCode: string;
    street: string;
    houseNumber: string;
};

const USERNAME_RE = /^[a-zA-Z0-9._]{3,24}$/;

export function normalizeUsername(raw: string): string {
    return String(raw || '').trim().replace(/^@/, '');
}

export function validateRegistrationProfile(
    p: Partial<RegistrationProfile>
): string | null {
    if (!p.name?.trim()) return "Add meg a neved.";
    const username = normalizeUsername(p.username || '');
    if (!username) return "Add meg a felhasználóneved.";
    if (!USERNAME_RE.test(username)) {
        return "A felhasználónév 3–24 karakter: betű, szám, pont vagy aláhúzás.";
    }
    if (!p.postalCode?.trim() || !p.street?.trim() || !p.houseNumber?.trim()) {
        return "A számlázási cím megadása kötelező (irányítószám, utca, házszám).";
    }
    if (!p.preferredSubject?.trim()) return "Válassz témakört / szintet.";
    return null;
}

export function isRegistrationProfileComplete(
    p: Partial<RegistrationProfile> | Record<string, unknown> | null | undefined
): boolean {
    if (!p) return false;
    return !validateRegistrationProfile({
        name: String(p.name || ''),
        username: String((p as { username?: string }).username || ''),
        postalCode: String(p.postalCode || ''),
        street: String(p.street || ''),
        houseNumber: String(p.houseNumber || ''),
        preferredSubject: String((p as { preferredSubject?: string }).preferredSubject || ''),
        preferredLessonType:
            (p as RegistrationProfile).preferredLessonType === 'personal' ? 'personal' : 'online',
        hobby: String((p as { hobby?: string }).hobby || ''),
    });
}

/** Google: ha már egyszer kitöltötte, ne kérjük újra. */
export function hasCompletedRegistrationOnce(
    p: Record<string, unknown> | null | undefined
): boolean {
    if (!p) return false;
    if (p.profileCompletedAt) return true;
    return isRegistrationProfileComplete(p);
}
