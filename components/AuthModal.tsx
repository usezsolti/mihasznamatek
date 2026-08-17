import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
    LESSON_SUBJECTS,
    type PreferredLessonType,
    type RegistrationProfile,
    validateRegistrationProfile,
} from "../utils/registrationProfile";
import {
    formatAuthError,
    signInAsTestUser,
    TEST_LOGIN_EMAIL,
    isTestLoginAllowed,
} from "../utils/testLogin";
import { isAdminEmail } from "../utils/admin";
import { useLang } from "../utils/i18n";

type AuthMode = "login" | "register";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "register";
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
            return "Ez a bejelentkezési mód ki van kapcsolva. Firebase Console → Authentication → Sign-in method: kapcsold be az Email/Password (és/vagy Anonymous) opciót.";
        case "auth/unauthorized-domain":
            return "Ez a domain nincs engedélyezve a Firebase-ben (Authorized domains).";
        case "auth/network-request-failed":
            return "Hálózati hiba — ellenőrizd az internetet / adblokkolót.";
        case "auth/invalid-login-credentials":
            return "Hibás e-mail cím vagy jelszó.";
        default:
            return code ? `Hiba történt (${code}).` : "Hiba történt. Kérjük, próbáld újra.";
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
    options?: {
        name?: string;
        gdprAccepted?: boolean;
        profile?: RegistrationProfile;
    }
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
    const profileFields = options?.profile
        ? {
              name: options.profile.name,
              preferredLessonType: options.profile.preferredLessonType,
              preferredSubject: options.profile.preferredSubject,
              hobby: options.profile.hobby || "",
              postalCode: options.profile.postalCode,
              street: options.profile.street,
              houseNumber: options.profile.houseNumber,
              profileCompletedAt: firebase.firestore.FieldValue.serverTimestamp(),
          }
        : { name: options?.name || user.displayName || "" };

    if (!snap.exists) {
        await ref.set({
            email: user.email || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...profileFields,
            ...gdprFields,
        });
    } else {
        await ref.set(
            {
                ...profileFields,
                ...gdprFields,
                email: user.email || snap.data()?.email || "",
            },
            { merge: true }
        );
    }
}

function isEmailPasswordUser(user: any): boolean {
    const providers = user?.providerData || [];
    return providers.some((p: any) => p?.providerId === "password");
}

const emptyProfile = () => ({
    lessonType: "online" as PreferredLessonType,
    subject: LESSON_SUBJECTS[0] as string,
    hobby: "",
    postalCode: "",
    street: "",
    houseNumber: "",
});

export default function AuthModal({
    isOpen,
    onClose,
    initialMode = "login",
    redirectTo,
}: AuthModalProps) {
    const router = useRouter();
    const { t } = useLang();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [lessonType, setLessonType] = useState<PreferredLessonType>("online");
    const [subject, setSubject] = useState<string>(LESSON_SUBJECTS[0]);
    const [hobby, setHobby] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [awaitingVerification, setAwaitingVerification] = useState(false);
    const [gdprAccepted, setGdprAccepted] = useState(false);
    const wasOpenRef = useRef(false);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const buildProfile = (): RegistrationProfile => ({
        name: name.trim(),
        preferredLessonType: lessonType,
        preferredSubject: subject,
        hobby: hobby.trim(),
        postalCode: postalCode.trim(),
        street: street.trim(),
        houseNumber: houseNumber.trim(),
    });

    const finishAuthSuccess = () => {
        onClose();
        if (redirectTo === false) return;
        if (typeof redirectTo === "string" && redirectTo) {
            const here =
                typeof window !== "undefined"
                    ? `${window.location.pathname}${window.location.search}`
                    : "";
            // Ne navigáljunk újra ugyanarra az URL-re (üres / fehér flash).
            if (here === redirectTo || router.asPath === redirectTo) return;
            void router.push(redirectTo);
            return;
        }
        void router.push("/dashboard");
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        const p = emptyProfile();
        setLessonType(p.lessonType);
        setSubject(p.subject);
        setHobby(p.hobby);
        setPostalCode(p.postalCode);
        setStreet(p.street);
        setHouseNumber(p.houseNumber);
        setGdprAccepted(false);
        setError("");
        setInfoMessage("");
        setAwaitingVerification(false);
    };

    // Csak nyitáskor inicializál — ne állítsa vissza a regisztrációt Navbar újrarendernél
    useEffect(() => {
        if (!isOpen) {
            if (wasOpenRef.current) {
                setLoading(false);
                resetForm();
            }
            wasOpenRef.current = false;
            return;
        }

        const justOpened = !wasOpenRef.current;
        wasOpenRef.current = true;
        if (justOpened) {
            setMode(initialMode);
            setGdprAccepted(false);
            setError("");
            setInfoMessage("");
            setAwaitingVerification(false);
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseRef.current();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // initialMode only applied on open transition
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

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
                setError(t("auth.errorFirebase"));
                return;
            }
            const auth = firebase.auth();

            if (mode === "login") {
                const cred = await auth.signInWithEmailAndPassword(email.trim(), password);
                const user = cred.user;
                const isTestEmail =
                    email.trim().toLowerCase() === TEST_LOGIN_EMAIL.toLowerCase();
                // Teszt fióknál ne blokkoljon az e-mail megerősítés
                if (user && isEmailPasswordUser(user) && !user.emailVerified && !isTestEmail && !isAdminEmail(user.email)) {
                    setAwaitingVerification(true);
                    setInfoMessage(
                        t("auth.verifyLoginInfo")
                    );
                    setPassword("");
                    return;
                }
                try {
                    await ensureUserDoc(firebase, user, { name: user?.displayName || undefined });
                } catch (docErr) {
                    console.warn("ensureUserDoc after login:", docErr);
                }
            } else {
                const profile = buildProfile();
                const profileErr = validateRegistrationProfile(profile);
                if (profileErr) {
                    setError(profileErr);
                    return;
                }
                if (!gdprAccepted) {
                    setError(t("auth.errorGdpr"));
                    return;
                }
                const credential = await auth.createUserWithEmailAndPassword(
                    email.trim(),
                    password
                );
                const user = credential.user;
                if (user) {
                    await user.updateProfile({ displayName: profile.name });
                    try {
                        await ensureUserDoc(firebase, user, {
                            name: profile.name,
                            gdprAccepted: true,
                            profile,
                        });
                    } catch (docErr) {
                        console.warn("ensureUserDoc after register:", docErr);
                    }
                    try {
                        await user.sendEmailVerification();
                    } catch (verErr) {
                        console.warn("Verification email failed:", verErr);
                    }
                    setAwaitingVerification(true);
                    setInfoMessage(
                        t("auth.verifyRegisteredInfo")
                    );
                    setPassword("");
                    return;
                }
            }
            setPassword("");
            finishAuthSuccess();
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapFirebaseError(err?.code));
        } finally {
            setLoading(false);
        }
    };

    const handleTestLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await signInAsTestUser();
            setPassword("");
            setEmail(result.email.includes("@") ? result.email : TEST_LOGIN_EMAIL);
            onClose();
            if (redirectTo === false) return;
            if (typeof redirectTo === "string" && redirectTo) {
                const here =
                    typeof window !== "undefined"
                        ? `${window.location.pathname}${window.location.search}`
                        : "";
                if (here === redirectTo || router.asPath === redirectTo) return;
                void router.push(redirectTo);
                return;
            }
            void router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapFirebaseError(err?.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        if (mode === "register") {
            const profile = buildProfile();
            if (!profile.postalCode.trim() || !profile.street.trim() || !profile.houseNumber.trim()) {
                setError(t("auth.errorGoogleBilling"));
                return;
            }
            if (!gdprAccepted) {
                setError(t("auth.errorGdpr"));
                return;
            }
        }
        setLoading(true);
        try {
            const firebase = await waitForFirebaseReady();
            if (!firebase) {
                setError(t("auth.errorFirebase"));
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope("email");
            provider.addScope("profile");
            const result = await firebase.auth().signInWithPopup(provider);
            const isNewUser = result.additionalUserInfo?.isNewUser;
            if (isNewUser && mode !== "register") {
                try {
                    await firebase.auth().signOut();
                } catch {
                    /* ignore */
                }
                setMode("register");
                setError(
                    t("auth.errorGoogleNew")
                );
                return;
            }
            if (isNewUser && !gdprAccepted) {
                try {
                    await firebase.auth().signOut();
                } catch {
                    /* ignore */
                }
                setMode("register");
                setError(
                    t("auth.errorGoogleGdpr")
                );
                return;
            }
            if (result.user) {
                const profile = buildProfile();
                const displayName = profile.name || result.user.displayName || "";
                const fullProfile: RegistrationProfile = {
                    ...profile,
                    name: displayName,
                };
                if (isNewUser) {
                    const err = validateRegistrationProfile(fullProfile);
                    if (err) {
                        try {
                            await firebase.auth().signOut();
                        } catch {
                            /* ignore */
                        }
                        setError(err);
                        return;
                    }
                    if (displayName && displayName !== result.user.displayName) {
                        try {
                            await result.user.updateProfile({ displayName });
                        } catch {
                            /* ignore */
                        }
                    }
                }
                try {
                    await ensureUserDoc(firebase, result.user, {
                        gdprAccepted: Boolean(isNewUser && gdprAccepted),
                        profile: isNewUser ? fullProfile : undefined,
                        name: displayName || undefined,
                    });
                } catch (docErr) {
                    console.warn("ensureUserDoc after Google:", docErr);
                }
            }
            setPassword("");
            finishAuthSuccess();
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapFirebaseError(err?.code));
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
                // Ne zárjon véletlen háttérkattintásra űrlap kitöltés közben
                if (mode === "register" || awaitingVerification) return;
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="auth-modal-content">
                <button
                    type="button"
                    className="auth-modal-close"
                    onClick={onClose}
                    aria-label={t("common.close")}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                        <path
                            d="M6 6l12 12M18 6L6 18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
                <h2 id="auth-modal-title">
                    {awaitingVerification
                        ? t("auth.verifyTitle")
                        : mode === "login"
                          ? t("auth.login")
                          : t("auth.register")}
                </h2>

                {awaitingVerification ? (
                    <div className="auth-tab-content active">
                        <p className="form-msg" style={{ color: "#39ff14" }}>
                            {infoMessage || t("auth.verifyPrompt")}
                        </p>
                        <p style={{ color: "#aaa", fontSize: "0.95rem", marginBottom: "1rem" }}>
                            {t("auth.verifyAddress")}: <strong style={{ color: "#eee" }}>{email}</strong>
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
                                    setError(
                                        t("auth.verifyMissing")
                                    );
                                } catch (err: any) {
                                    setError(mapFirebaseError(err?.code));
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {t("auth.verified")}
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
                                    setInfoMessage(t("auth.verifyResent"));
                                } catch (err: any) {
                                    setError(mapFirebaseError(err?.code));
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {t("auth.resendVerify")}
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
                            {t("auth.backToLogin")}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="auth-tabs">
                            <button
                                type="button"
                                className={"auth-tab " + (mode === "login" ? "active" : "")}
                                onClick={() => switchMode("login")}
                            >
                                {t("auth.login")}
                            </button>
                            <button
                                type="button"
                                className={"auth-tab " + (mode === "register" ? "active" : "")}
                                onClick={() => switchMode("register")}
                            >
                                {t("auth.register")}
                            </button>
                        </div>

                        <div className="auth-tab-content active">
                            {mode === "login" && isTestLoginAllowed() && (
                                <div style={{ marginBottom: "1rem" }}>
                                    <button
                                        type="button"
                                        className="google-login-btn"
                                        onClick={handleTestLogin}
                                        disabled={loading}
                                        style={{
                                            background: "rgba(255, 215, 0, 0.18)",
                                            border: "2px solid #ffd700",
                                            color: "#ffd700",
                                            width: "100%",
                                            position: "relative",
                                            zIndex: 5,
                                        }}
                                    >
                                        {loading ? t("auth.loggingIn") : t("auth.testLogin")}
                                    </button>
                                    <p
                                        style={{
                                            color: "#888",
                                            fontSize: "0.75rem",
                                            margin: "0.45rem 0 0",
                                            textAlign: "center",
                                        }}
                                    >
                                        Dev: {TEST_LOGIN_EMAIL} (jelszó csak szerveren)
                                    </p>
                                    <div className="auth-divider" style={{ margin: "1rem 0" }}>
                                        <span>{t("auth.orEmailGoogle")}</span>
                                    </div>
                                </div>
                            )}
                            <form className="email-form" onSubmit={handleEmailSubmit}>
                                {mode === "register" && (
                                    <div className="form-group">
                                        <label htmlFor="auth-modal-name">{t("auth.name")}</label>
                                        <input
                                            id="auth-modal-name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t("auth.namePlaceholder")}
                                            autoComplete="name"
                                            required
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label htmlFor="auth-modal-email">{t("auth.email")}</label>
                                    <input
                                        id="auth-modal-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("auth.emailPlaceholder")}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="auth-modal-password">{t("auth.password")}</label>
                                    <input
                                        id="auth-modal-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t("auth.passwordPlaceholder")}
                                        autoComplete={
                                            mode === "login" ? "current-password" : "new-password"
                                        }
                                        minLength={6}
                                        required
                                    />
                                </div>

                                {mode === "register" && (
                                    <div
                                        className="auth-register-extra"
                                        style={{
                                            display: "block",
                                            visibility: "visible",
                                            opacity: 1,
                                            width: "100%",
                                            marginTop: "0.5rem",
                                            paddingTop: "0.75rem",
                                            borderTop: "1px solid rgba(57,255,20,0.4)",
                                        }}
                                    >
                                        <p
                                            className="auth-extra-title"
                                            style={{
                                                color: "#39ff14",
                                                fontWeight: 700,
                                                textAlign: "left",
                                                margin: "0 0 0.85rem",
                                            }}
                                        >
                                            {t("auth.bookingDetails")}
                                        </p>
                                        <div className="form-group">
                                            <label>{t("auth.lessonType")}</label>
                                            <div className="auth-lesson-toggle">
                                                <button
                                                    type="button"
                                                    className={lessonType === "online" ? "active" : ""}
                                                    onClick={() => setLessonType("online")}
                                                >
                                                    {t("auth.online")}
                                                </button>
                                                <button
                                                    type="button"
                                                    className={lessonType === "personal" ? "active" : ""}
                                                    onClick={() => setLessonType("personal")}
                                                >
                                                    {t("auth.personal")}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="auth-modal-subject">{t("auth.subject")}</label>
                                            <select
                                                id="auth-modal-subject"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                required
                                                style={{
                                                    width: "100%",
                                                    padding: "1rem",
                                                    background: "#000",
                                                    color: "#fff",
                                                    border: "2px solid rgba(255,255,255,0.15)",
                                                    borderRadius: 10,
                                                }}
                                            >
                                                {LESSON_SUBJECTS.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="auth-modal-hobby">{t("auth.hobby")}</label>
                                            <input
                                                id="auth-modal-hobby"
                                                type="text"
                                                value={hobby}
                                                onChange={(e) => setHobby(e.target.value)}
                                                placeholder={t("auth.hobbyPlaceholder")}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t("auth.billing")}</label>
                                            <p
                                                style={{
                                                    color: "#ddd",
                                                    fontSize: "0.8rem",
                                                    margin: "0 0 0.5rem",
                                                    textAlign: "left",
                                                }}
                                            >
                                                {t("auth.billingHint")}
                                            </p>
                                            <div className="auth-address-row">
                                                <input
                                                    type="text"
                                                    value={postalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                    placeholder={t("auth.postalCode")}
                                                    required
                                                    autoComplete="postal-code"
                                                />
                                                <input
                                                    type="text"
                                                    value={street}
                                                    onChange={(e) => setStreet(e.target.value)}
                                                    placeholder={t("auth.street")}
                                                    required
                                                    autoComplete="street-address"
                                                />
                                                <input
                                                    type="text"
                                                    value={houseNumber}
                                                    onChange={(e) => setHouseNumber(e.target.value)}
                                                    placeholder={t("auth.houseNumber")}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <label className="gdpr-consent">
                                            <input
                                                type="checkbox"
                                                checked={gdprAccepted}
                                                onChange={(e) => setGdprAccepted(e.target.checked)}
                                                required
                                            />
                                            <span style={{ color: "#fff" }}>
                                                {t("auth.gdprPrefix")}{" "}
                                                <a
                                                    href="/adatkezelesi-tajekoztato"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {t("auth.gdprLink")}
                                                </a>{" "}
                                                (GDPR). *
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {error && <p className="form-msg">{error}</p>}

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading
                                        ? t("auth.processing")
                                        : mode === "login"
                                          ? t("auth.login")
                                          : t("auth.register")}
                                </button>
                            </form>

                            <div className="auth-divider">
                                <span>{t("common.or")}</span>
                            </div>

                            <button
                                type="button"
                                className="google-login-btn"
                                onClick={handleGoogle}
                                disabled={loading}
                            >
                                {t("auth.google")}
                            </button>

                            {mode === "register" && (
                                <p
                                    style={{
                                        color: "#aaa",
                                        fontSize: "0.8rem",
                                        marginTop: "0.75rem",
                                        textAlign: "center",
                                    }}
                                >
                                    {t("auth.googleRegisterHint")}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
