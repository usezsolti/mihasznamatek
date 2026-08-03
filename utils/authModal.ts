/** Globális esemény: AuthModal megnyitása bárhonnan (Navbar figyeli). */

export const OPEN_AUTH_MODAL_EVENT = "mihaszna:open-auth-modal";

export type OpenAuthModalDetail = {
    mode?: "login" | "register";
    /** Sikeres auth után: útvonal, vagy `false` = maradj az oldalon (csak zárd a modalt). */
    redirectTo?: string | false;
};

export function openAuthModal(detail?: OpenAuthModalDetail) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent(OPEN_AUTH_MODAL_EVENT, {
            detail: detail || { mode: "login" },
        })
    );
}
