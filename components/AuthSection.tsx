import { useEffect, useState } from "react";
import Link from "next/link";
import { openAuthModal } from "../utils/authModal";
import { isTestAuthUser } from "../utils/testLogin";
import { isAdminEmail } from "../utils/admin";
import { waitForFirebase } from "../utils/firebaseReady";
import { checkAppEmailVerified, skipEmailVerification } from "../utils/authUserDoc";
import { useLang } from "../utils/i18n";

interface CurrentUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

/**
 * Főoldali „Fiókom” szekció — NEM tartalmaz külön bejelentkező űrlapot.
 * Kijelentkezve: a Navbar AuthModalját nyitja.
 * Bejelentkezve: dashboard + kijelentkezés.
 */
export default function AuthSection() {
    const { t } = useLang();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        let unsub: (() => void) | undefined;
        let cancelled = false;

        (async () => {
            const firebase = await waitForFirebase();
            if (cancelled || !firebase) {
                setCheckingAuth(false);
                return;
            }
            unsub = firebase.auth().onAuthStateChanged((user: any) => {
                void (async () => {
                    if (!user) {
                        setCurrentUser(null);
                        setCheckingAuth(false);
                        return;
                    }
                    const isPassword = (user.providerData || []).some(
                        (p: any) => p?.providerId === "password"
                    );
                    if (
                        isPassword &&
                        !skipEmailVerification() &&
                        !isTestAuthUser(user) &&
                        !isAdminEmail(user.email)
                    ) {
                        const verified =
                            Boolean(user.emailVerified) ||
                            (await checkAppEmailVerified(user));
                        if (!verified) {
                            setCurrentUser(null);
                            setCheckingAuth(false);
                            return;
                        }
                    }
                    setCurrentUser({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL || null,
                    });
                    setCheckingAuth(false);
                })();
            });
        })();

        return () => {
            cancelled = true;
            if (unsub) unsub();
        };
    }, []);

    const handleLogout = async () => {
        setCurrentUser(null);
        const { signOutUser } = await import("../utils/authLogout");
        await signOutUser({ redirectTo: "/" });
    };

    if (checkingAuth) {
        return <p className="form-msg" style={{ textAlign: "center" }}>{t("common.loading")}</p>;
    }

    if (currentUser) {
        const label = currentUser.displayName || currentUser.email || "Felhasználó";
        return (
            <div className="home-auth-signed-in" style={{ textAlign: "center", maxWidth: 420, margin: "0 auto" }}>
                {currentUser.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={currentUser.photoURL}
                        alt=""
                        width={72}
                        height={72}
                        style={{ borderRadius: "50%", objectFit: "cover", marginBottom: "0.75rem" }}
                    />
                ) : (
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            margin: "0 auto 0.75rem",
                            background: "rgba(57,255,20,0.2)",
                            border: "2px solid #39ff14",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.75rem",
                            color: "#39ff14",
                            fontWeight: 800,
                        }}
                    >
                        {(label[0] || "?").toUpperCase()}
                    </div>
                )}
                <p style={{ color: "#eee", fontSize: "1.15rem", margin: "0 0 0.35rem" }}>
                    {t("auth.hello", { name: label })}
                </p>
                <p style={{ color: "#aaa", margin: "0 0 1.25rem" }}>
                    {t("auth.signedInHint")}
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                        href="/dashboard"
                        className="submit-btn"
                        style={{
                            display: "inline-block",
                            textDecoration: "none",
                            padding: "0.75rem 1.25rem",
                        }}
                    >
                        {t("auth.openDashboard")}
                    </Link>
                    <button
                        type="button"
                        className="auth-btn"
                        onClick={handleLogout}
                        style={{
                            padding: "0.75rem 1.25rem",
                            borderRadius: "12px",
                            border: "1px solid #ff69b4",
                            color: "#ff69b4",
                            background: "transparent",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        {t("nav.logout")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="home-auth-cta" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
            <p style={{ color: "#ccc", marginBottom: "1.25rem", lineHeight: 1.55 }}>
                {t("auth.ctaHint")}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                    type="button"
                    className="submit-btn"
                    onClick={() => openAuthModal({ mode: "login" })}
                    style={{ padding: "0.85rem 1.4rem", cursor: "pointer", border: "none" }}
                >
                    {t("auth.login")}
                </button>
                <button
                    type="button"
                    onClick={() => openAuthModal({ mode: "register" })}
                    style={{
                        padding: "0.85rem 1.4rem",
                        borderRadius: "12px",
                        border: "2px solid #39ff14",
                        color: "#39ff14",
                        background: "rgba(57,255,20,0.1)",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    {t("auth.register")}
                </button>
            </div>
        </div>
    );
}
