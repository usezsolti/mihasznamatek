import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type AuthMode = "login" | "register";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "register";
    /** Sikeres belépés után: útvonal, vagy `false` = csak bezárás (pl. foglaló oldal). */
    redirectTo?: string | false;
}

function mapFirebaseError(code?: string): string {
    switch (code) {
        case "auth/email-already-in-use":
            return "Ez az e-mail cím már regisztrálva van. Próbálj bejelentkezni!";
        case "auth/invalid-email":
            return "Érvénytelen e-mail cím.";
        case "auth/weak-password":
            return "A jelszónak legalább 6 karakter hosszúnak kell lennie.";
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Hibás e-mail cím vagy jelszó.";
        case "auth/user-not-found":
            return "Nincs ilyen felhasználó. Regisztrálj előbb!";
        case "auth/too-many-requests":
            return "Túl sok próbálkozás történt. Kérjük, próbáld újra később.";
        case "auth/popup-closed-by-user":
            return "A bejelentkezési ablak bezáródott, mielőtt befejeződött volna.";
        case "auth/popup-blocked":
            return "A böngésző blokkolta a bejelentkezési ablakot. Engedd meg a felugró ablakokat.";
        case "auth/account-exists-with-different-credential":
            return "Ez az e-mail cím már egy másik bejelentkezési móddal van regisztrálva.";
        case "auth/operation-not-allowed":
            return "Ez a bejelentkezési mód jelenleg nem elérhető. Kapcsold be a Google providert a Firebase Console-ban.";
        case "auth/unauthorized-domain":
            return "Ez a domain nincs engedélyezve a Firebase-ben (Authorized domains).";
        default:
            return "Hiba történt. Kérjük, próbáld újra.";
    }
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

async function ensureUserDoc(
    firebase: any,
    user: any,
    options?: { name?: string; gdprAccepted?: boolean }
) {
    if (!user) return;
    const db = firebase.firestore();
    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();
    const gdprFields = options?.gdprAccepted
        ? {
              gdprAccepted: true,
              gdprAcceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
              gdprVersion: "2026-08-03",
          }
        : {};
    if (!snap.exists) {
        await ref.set({
            name: options?.name || user.displayName || "",
            email: user.email || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...gdprFields,
        });
    } else if (options?.gdprAccepted) {
        await ref.set(gdprFields, { merge: true });
    }
}

function isEmailPasswordUser(user: any): boolean {
    const providers = user?.providerData || [];
    return providers.some((p: any) => p?.providerId === "password");
}

export default function AuthModal({
    isOpen,
    onClose,
    initialMode = "login",
    redirectTo,
}: AuthModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [awaitingVerification, setAwaitingVerification] = useState(false);
    const [gdprAccepted, setGdprAccepted] = useState(false);

    const finishAuthSuccess = () => {
        onClose();
        if (redirectTo === false) return;
        if (typeof redirectTo === "string" && redirectTo) {
            router.push(redirectTo);
            return;
        }
        router.push("/dashboard");
    };

    useEffect(() => {
        if (!isOpen) {
            setError("");
            setInfoMessage("");
            setLoading(false);
            setAwaitingVerification(false);
            setGdprAccepted(false);
            return;
        }
        setMode(initialMode);
        setGdprAccepted(false);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose, initialMode]);

    const switchMode = (next: AuthMode) => {
        setMode(next);
        setError("");
        setGdprAccepted(false);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const firebase = await waitForFirebaseReady();
            if (!firebase) {
                setError("A Firebase nem töltődött be. Frissítsd az oldalt.");
                return;
            }
            const auth = firebase.auth();

            if (mode === "login") {
                const cred = await auth.signInWithEmailAndPassword(email.trim(), password);
                const user = cred.user;
                if (user && isEmailPasswordUser(user) && !user.emailVerified) {
                    setAwaitingVerification(true);
                    setInfoMessage("Erősítsd meg az e-mail címed a belépéshez. Nézd a postaládát (és a Spam mappát).");
                    setPassword("");
                    return;
                }
            } else {
                if (!name.trim()) {
                    setError("Add meg a neved a regisztrációhoz.");
                    return;
                }
                if (!gdprAccepted) {
                    setError("A regisztrációhoz el kell fogadnod az adatkezelési tájékoztatót.");
                    return;
                }
                const credential = await auth.createUserWithEmailAndPassword(
                    email.trim(),
                    password
                );
                const user = credential.user;
                if (user) {
                    await user.updateProfile({ displayName: name.trim() });
                    await ensureUserDoc(firebase, user, {
                        name: name.trim(),
                        gdprAccepted: true,
                    });
                    try {
                        await user.sendEmailVerification();
                    } catch (verErr) {
                        console.warn("Verification email failed:", verErr);
                    }
                    setAwaitingVerification(true);
                    setInfoMessage(
                        "Regisztráció kész! Küldtünk egy megerősítő e-mailt. Erősítsd meg, majd jelentkezz be."
                    );
                    setPassword("");
                    return;
                }
            }
            setPassword("");
            finishAuthSuccess();
        } catch (err: any) {
            console.error(err);
            setError(mapFirebaseError(err?.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        if (mode === "register" && !gdprAccepted) {
            setError("A regisztrációhoz el kell fogadnod az adatkezelési tájékoztatót.");
            return;
        }
        setLoading(true);
        try {
            const firebase = await waitForFirebaseReady();
            if (!firebase) {
                setError("A Firebase nem töltődött be. Frissítsd az oldalt.");
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope("email");
            provider.addScope("profile");
            const result = await firebase.auth().signInWithPopup(provider);
            const isNewUser = result.additionalUserInfo?.isNewUser;
            if (isNewUser && !gdprAccepted) {
                try {
                    await firebase.auth().signOut();
                } catch {
                    /* ignore */
                }
                setMode("register");
                setError(
                    "Új fiók létrehozásához fogadd el az adatkezelési tájékoztatót, majd próbáld újra a Google belépést."
                );
                return;
            }
            if (result.user) {
                await ensureUserDoc(firebase, result.user, {
                    gdprAccepted: Boolean(isNewUser && gdprAccepted),
                });
            }
            setPassword("");
            finishAuthSuccess();
        } catch (err: any) {
            console.error(err);
            setError(mapFirebaseError(err?.code));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="auth-modal show"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="auth-modal-content">
                <button
                    type="button"
                    className="auth-modal-close"
                    onClick={onClose}
                    aria-label="Bezárás"
                >
                    ×
                </button>
                <h2 id="auth-modal-title">
                    {awaitingVerification
                        ? "E-mail megerősítés"
                        : mode === "login"
                          ? "Bejelentkezés"
                          : "Regisztráció"}
                </h2>

                {awaitingVerification ? (
                    <div className="auth-tab-content active">
                        <p className="form-msg" style={{ color: "#39ff14" }}>
                            {infoMessage || "Erősítsd meg az e-mail címed."}
                        </p>
                        <p style={{ color: "#aaa", fontSize: "0.95rem", marginBottom: "1rem" }}>
                            Cím: <strong style={{ color: "#eee" }}>{email}</strong>
                        </p>
                        <button
                            type="button"
                            className="submit-btn"
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                setError("");
                                try {
                                    const firebase = await waitForFirebaseReady();
                                    const user = firebase?.auth()?.currentUser;
                                    if (user) {
                                        await user.reload();
                                        if (user.emailVerified) {
                                            finishAuthSuccess();
                                            return;
                                        }
                                    }
                                    setError("Még nincs megerősítve. Kattints a levélben a linkre, majd ide.");
                                } catch (err: any) {
                                    setError(mapFirebaseError(err?.code));
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Már megerősítettem
                        </button>
                        <button
                            type="button"
                            className="google-login-btn"
                            style={{ marginTop: "0.75rem" }}
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                setError("");
                                try {
                                    const firebase = await waitForFirebaseReady();
                                    const user = firebase?.auth()?.currentUser;
                                    if (user) await user.sendEmailVerification();
                                    setInfoMessage("Újra elküldtük a megerősítő levelet.");
                                } catch (err: any) {
                                    setError(mapFirebaseError(err?.code));
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Megerősítő e-mail újraküldése
                        </button>
                        {error && <p className="form-msg">{error}</p>}
                        <button
                            type="button"
                            onClick={() => {
                                setAwaitingVerification(false);
                                setMode("login");
                                setError("");
                            }}
                            style={{
                                marginTop: "1rem",
                                background: "transparent",
                                border: "none",
                                color: "#aaa",
                                cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            Vissza a bejelentkezéshez
                        </button>
                    </div>
                ) : (
                <>
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab ${mode === "login" ? "active" : ""}`}
                        onClick={() => switchMode("login")}
                    >
                        Bejelentkezés
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${mode === "register" ? "active" : ""}`}
                        onClick={() => switchMode("register")}
                    >
                        Regisztráció
                    </button>
                </div>

                <div className={`auth-tab-content active`}>
                    <form className="email-form" onSubmit={handleEmailSubmit}>
                        {mode === "register" && (
                            <div className="form-group">
                                <label htmlFor="auth-modal-name">Név</label>
                                <input
                                    id="auth-modal-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Teljes neved"
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="auth-modal-email">E-mail</label>
                            <input
                                id="auth-modal-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="pelda@email.hu"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="auth-modal-password">Jelszó</label>
                            <input
                                id="auth-modal-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Legalább 6 karakter"
                                autoComplete={
                                    mode === "login" ? "current-password" : "new-password"
                                }
                                minLength={6}
                                required
                            />
                        </div>

                        {mode === "register" && (
                            <label className="gdpr-consent">
                                <input
                                    type="checkbox"
                                    checked={gdprAccepted}
                                    onChange={(e) => setGdprAccepted(e.target.checked)}
                                    required
                                />
                                <span>
                                    Elolvastam és elfogadom az{" "}
                                    <a
                                        href="/adatkezelesi-tajekoztato"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        adatkezelési tájékoztatót
                                    </a>{" "}
                                    (GDPR). *
                                </span>
                            </label>
                        )}

                        {error && <p className="form-msg">{error}</p>}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading
                                ? "Folyamatban..."
                                : mode === "login"
                                  ? "Bejelentkezés"
                                  : "Regisztráció"}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>vagy</span>
                    </div>

                    <button
                        type="button"
                        className="google-login-btn"
                        onClick={handleGoogle}
                        disabled={loading}
                    >
                        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                                fill="#34A853"
                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                        </svg>
                        Folytatás Google-lal
                    </button>
                </div>
                </>
                )}
            </div>
        </div>
    );
}
