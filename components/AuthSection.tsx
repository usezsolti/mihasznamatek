import { useEffect, useState } from "react";
import Link from "next/link";
import { openAuthModal } from "../utils/authModal";
import { isTestAuthUser } from "../utils/testLogin";

interface CurrentUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

async function waitForFirebaseReady(maxAttempts = 50): Promise<any | null> {
    for (let i = 0; i < maxAttempts; i++) {
        const firebase = (window as any).firebase;
        if (firebase?.apps?.length > 0) return firebase;
        if (firebase && !firebase.apps.length && (window as any).__FIREBASE_CONFIG__) {
            try {
                firebase.initializeApp((window as any).__FIREBASE_CONFIG__);
                return firebase;
            } catch {
                // init folyamatban
            }
        }
        await new Promise((r) => setTimeout(r, 100));
    }
    return (window as any).firebase?.apps?.length ? (window as any).firebase : null;
}

/**
 * Főoldali „Fiókom” szekció — NEM tartalmaz külön bejelentkező űrlapot.
 * Kijelentkezve: a Navbar AuthModalját nyitja.
 * Bejelentkezve: dashboard + kijelentkezés.
 */
export default function AuthSection() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        let unsub: (() => void) | undefined;
        let cancelled = false;

        (async () => {
            const firebase = await waitForFirebaseReady();
            if (cancelled || !firebase) {
                setCheckingAuth(false);
                return;
            }
            unsub = firebase.auth().onAuthStateChanged((user: any) => {
                if (!user) {
                    setCurrentUser(null);
                    setCheckingAuth(false);
                    return;
                }
                const isPassword = (user.providerData || []).some(
                    (p: any) => p?.providerId === "password"
                );
                if (isPassword && !user.emailVerified && !isTestAuthUser(user)) {
                    setCurrentUser(null);
                    setCheckingAuth(false);
                    return;
                }
                setCurrentUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL || null,
                });
                setCheckingAuth(false);
            });
        })();

        return () => {
            cancelled = true;
            if (unsub) unsub();
        };
    }, []);

    const handleLogout = async () => {
        try {
            const firebase = (window as any).firebase;
            if (firebase?.auth) await firebase.auth().signOut();
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    if (checkingAuth) {
        return <p className="form-msg" style={{ textAlign: "center" }}>Betöltés…</p>;
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
                    Szia, <strong>{label}</strong>!
                </p>
                <p style={{ color: "#aaa", margin: "0 0 1.25rem" }}>
                    Itt követheted a foglalásaidat és a tanulási előrehaladásodat.
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
                        Dashboard megnyitása
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
                        Kijelentkezés
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="home-auth-cta" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
            <p style={{ color: "#ccc", marginBottom: "1.25rem", lineHeight: 1.55 }}>
                Egy helyen jelentkezhetsz be: a navigáció <strong>Bejelentkezés</strong> gombjával,
                vagy ide kattintva.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                    type="button"
                    className="submit-btn"
                    onClick={() => openAuthModal({ mode: "login" })}
                    style={{ padding: "0.85rem 1.4rem", cursor: "pointer", border: "none" }}
                >
                    Bejelentkezés
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
                    Regisztráció
                </button>
            </div>
        </div>
    );
}
