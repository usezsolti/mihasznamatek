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
    preferredLessonType: PreferredLessonType;
    preferredSubject: string;
    hobby: string;
    postalCode: string;
    street: string;
    houseNumber: string;
};

export function validateRegistrationProfile(
    p: Partial<RegistrationProfile>
): string | null {
    if (!p.name?.trim()) return "Add meg a neved.";
    if (!p.postalCode?.trim() || !p.street?.trim() || !p.houseNumber?.trim()) {
        return "A számlázási cím megadása kötelező (irányítószám, utca, házszám).";
    }
    if (!p.preferredSubject?.trim()) return "Válassz témakört / szintet.";
    return null;
}
