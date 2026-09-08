import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
    LESSON_SUBJECTS,
    type PreferredLessonType,
    type RegistrationProfile,
    isRegistrationProfileComplete,
    validateRegistrationProfile,
} from "../utils/registrationProfile";
import {
    formatAuthError,
    signInAsTestUser,
    TEST_LOGIN_EMAIL,
    isTestLoginAllowed,
} from "../utils/testLogin";
import { isAdminEmail } from "../utils/admin";
import {
    checkAppEmailVerified,
    ensureUserDoc,
    isEmailPasswordUser,
    mapFirebaseAuthError,
    sendVerificationEmail,
    skipEmailVerification,
} from "../utils/authUserDoc";
import { waitForFirebase } from "../utils/firebaseReady";
import { useLang } from "../utils/i18n";
import { safeAppPath } from "../utils/safePath";
import { agentDebugLog } from "../utils/agentDebugLog";
import { apiPost } from "../utils/apiClient";

type AuthMode = "login" | "register";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "register";
    redirectTo?: string | false;
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
    const { t, lang } = useLang();
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
    const [verifyLink, setVerifyLink] = useState("");
    const [gdprAccepted, setGdprAccepted] = useState(false);
    const [googleProfilePending, setGoogleProfilePending] = useState(false);
    const wasOpenRef = useRef(false);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!isOpen) return;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'R2',
            location: 'AuthModal.tsx:open',
            message: 'auth modal opened after refactor',
            data: { mode: initialMode, hasRedirect: redirectTo !== false && !!redirectTo },
        });
        // #endregion
    }, [isOpen, initialMode, redirectTo]);

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
        const safe = typeof redirectTo === "string" ? safeAppPath(redirectTo) : null;
        if (safe) {
            const here =
                typeof window !== "undefined"
                    ? `${window.location.pathname}${window.location.search}`
                    : "";
            // Ne navigáljunk újra ugyanarra az URL-re (üres / fehér flash).
            if (here === safe || router.asPath === safe) return;
            void router.push(safe);
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
        setGoogleProfilePending(false);
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
            setGoogleProfilePending(false);
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

    const saveGoogleRegistrationProfile = async () => {
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
        setLoading(true);
        try {
            const firebase = await waitForFirebase();
            const user = firebase?.auth?.()?.currentUser;
            if (!firebase || !user) {
                setError(t("auth.errorFirebase"));
                return;
            }
            if (profile.name && profile.name !== user.displayName) {
                try {
                    await user.updateProfile({ displayName: profile.name });
                } catch {
                    /* ignore */
                }
            }
            await ensureUserDoc(firebase, user, {
                name: profile.name,
                gdprAccepted: true,
                profile,
            });
            setGoogleProfilePending(false);
            finishAuthSuccess();
        } catch (err: any) {
            setError(formatAuthError(err) || mapFirebaseAuthError(err?.code));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (googleProfilePending) {
            await saveGoogleRegistrationProfile();
            return;
        }
        setError("");
        setLoading(true);
        try {
            const firebase = await waitForFirebase();
            if (!firebase) {
                setError(t("auth.errorFirebase"));
                return;
            }
            const auth = firebase.auth();
            // Firebase a kiválasztott nyelven küldi a saját e-mail sablonját.
            auth.languageCode = lang;

            if (mode === "login") {
                const tableLogin = await apiPost<{ name?: string }>("/api/auth/password-login", {
                    email: email.trim(),
                    password,
                });
                if (!tableLogin.ok && tableLogin.status !== 404) {
                    setError(tableLogin.error || t("auth.errorGeneric"));
                    return;
                }
                let cred: { user: any };
                try {
                    cred = await auth.signInWithEmailAndPassword(email.trim(), password);
                } catch (fbErr: any) {
                    const code = String(fbErr?.code || "");
                    if (tableLogin.ok && /user-not-found|invalid-credential|invalid-login/i.test(code)) {
                        cred = await auth.createUserWithEmailAndPassword(email.trim(), password);
                    } else {
                        throw fbErr;
                    }
                }
                const user = cred.user;
                if (tableLogin.ok && tableLogin.data?.name && user && !user.displayName) {
                    try {
                        await user.updateProfile({ displayName: tableLogin.data.name });
                    } catch {
                        /* ignore */
                    }
                }
                const isTestEmail =
                    email.trim().toLowerCase() === TEST_LOGIN_EMAIL.toLowerCase();
                // Teszt fióknál ne blokkoljon az e-mail megerősítés
                if (
                    user &&
                    isEmailPasswordUser(user) &&
                    !skipEmailVerification() &&
                    !isTestEmail &&
                    !isAdminEmail(user.email)
                ) {
                    const verified =
                        Boolean(user.emailVerified) ||
                        (await checkAppEmailVerified(user));
                    if (!verified) {
                        setAwaitingVerification(true);
                        setInfoMessage(t("auth.verifyLoginInfo"));
                        setPassword("");
                        return;
                    }
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
                const saved = await apiPost<{ emailSent?: boolean; emailError?: string }>(
                    "/api/auth/password-register",
                    {
                        name: profile.name,
                        email: email.trim(),
                        password,
                    }
                );
                if (!saved.ok) {
                    setError(saved.error || t("auth.errorGeneric"));
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
                        if (saved.data?.emailSent) {
                            setAwaitingVerification(true);
                            setVerifyLink("");
                            setInfoMessage(
                                'Regisztráció kész! Küldtünk megerősítő e-mailt a Mihaszna Matek feladóval (info@mihasznamatek.hu). Nézd a Beérkezett és a Spam mappát is.'
                            );
                        } else {
                            const sent = await sendVerificationEmail(user);
                            setAwaitingVerification(true);
                            setVerifyLink(sent.verifyLink || "");
                            setInfoMessage(
                                sent.provider === 'gmail' || sent.provider === 'resend'
                                    ? 'Regisztráció kész! Küldtünk megerősítő e-mailt a Mihaszna Matek feladóval. Erősítsd meg, majd jelentkezz be.'
                                    : t("auth.verifyRegisteredInfo")
                            );
                        }
                    } catch (verErr) {
                        console.warn("Verification email failed:", verErr);
                        setAwaitingVerification(true);
                        setInfoMessage(t("auth.verifySendFailed"));
                        setError(
                            String((verErr as any)?.message || '').includes('Gmail') ||
                            String((verErr as any)?.message || '').includes('megerősítő')
                                ? String((verErr as any).message)
                                : mapFirebaseAuthError((verErr as any)?.code) ||
                                      formatAuthError(verErr)
                        );
                        setPassword("");
                        return;
                    }
                    setPassword("");
                    return;
                }
            }
            setPassword("");
            finishAuthSuccess();
        } catch (err: any) {
            console.error(err);
            // #region agent log
            let methods: string[] = [];
            try {
                const firebase = await waitForFirebase();
                if (firebase?.auth && email.trim()) {
                    methods = await firebase.auth().fetchSignInMethodsForEmail(email.trim());
                }
            } catch {
                /* ignore */
            }
            agentDebugLog({
                hypothesisId: 'L1',
                location: 'AuthModal.tsx:handleEmailSubmit',
                message: 'email login/register failed',
                data: {
                    mode,
                    code: String(err?.code || '').slice(0, 80),
                    methods,
                    hasPasswordProvider: methods.includes('password'),
                    emailDomain: email.includes('@') ? email.trim().split('@')[1] : '',
                },
                runId: 'login-debug',
            });
            // #endregion
            if (mode === 'login' && methods.length && !methods.includes('password')) {
                setError(
                    'Ehhez az e-mailhez nincs jelszó — használd a Google gombot, vagy állíts be jelszót a Firebase-ben.'
                );
            } else {
                setError(formatAuthError(err) || mapFirebaseAuthError(err?.code));
            }
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
            finishAuthSuccess();
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapFirebaseAuthError(err?.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setLoading(true);
        try {
            const firebase = await waitForFirebase();
            if (!firebase) {
                setError(t("auth.errorFirebase"));
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope("email");
            provider.addScope("profile");
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;
            if (!user) {
                setError(t("auth.errorGeneric"));
                return;
            }

            const displayName = name.trim() || String(user.displayName || "");
            setEmail(String(user.email || ""));
            if (displayName && !name.trim()) setName(displayName);

            let storedComplete = false;
            try {
                const snap = await firebase.firestore().collection("users").doc(user.uid).get();
                storedComplete = isRegistrationProfileComplete(snap.exists ? snap.data() : null);
                if (snap.exists) {
                    const d = snap.data() || {};
                    if (!name.trim() && d.name) setName(String(d.name));
                    if (d.postalCode) setPostalCode(String(d.postalCode));
                    if (d.street) setStreet(String(d.street));
                    if (d.houseNumber) setHouseNumber(String(d.houseNumber));
                    if (d.preferredSubject) setSubject(String(d.preferredSubject));
                    if (d.preferredLessonType === "personal" || d.preferredLessonType === "online") {
                        setLessonType(d.preferredLessonType);
                    }
                    if (d.hobby) setHobby(String(d.hobby));
                }
            } catch {
                storedComplete = false;
            }

            const formProfile = { ...buildProfile(), name: displayName };
            const formReady = !validateRegistrationProfile(formProfile) && gdprAccepted;

            if (formReady) {
                try {
                    await ensureUserDoc(firebase, user, {
                        name: formProfile.name,
                        gdprAccepted: true,
                        profile: formProfile,
                    });
                } catch (docErr) {
                    console.warn("ensureUserDoc after Google:", docErr);
                }
                setPassword("");
                setGoogleProfilePending(false);
                finishAuthSuccess();
                return;
            }

            if (storedComplete) {
                try {
                    await ensureUserDoc(firebase, user, { name: user.displayName || undefined });
                } catch {
                    /* ignore */
                }
                setPassword("");
                finishAuthSuccess();
                return;
            }

            setMode("register");
            setGoogleProfilePending(true);
            setInfoMessage("");
            setError("");
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapFirebaseAuthError(err?.code));
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
                if (mode === "register" || awaitingVerification || googleProfilePending) return;
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
                        : googleProfilePending
                          ? t("auth.googleNeedProfile")
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
                        <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1rem", lineHeight: 1.45 }}>
                            {t("auth.verifySpamHint")}
                        </p>
                        {verifyLink ? (
                            <p style={{ marginBottom: "1rem" }}>
                                <a
                                    href={verifyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="submit-btn"
                                    style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}
                                >
                                    Megerősítés most (link)
                                </a>
                            </p>
                        ) : null}
                        <button
                            type="button"
                            className="submit-btn"
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                setError("");
                                try {
                                    const firebase = await waitForFirebase();
                                    const user = firebase?.auth()?.currentUser;
                                    if (user) {
                                        await user.reload();
                                        const verified =
                                            Boolean(user.emailVerified) ||
                                            (await checkAppEmailVerified(user));
                                        if (verified) {
                                            finishAuthSuccess();
                                            return;
                                        }
                                    }
                                    setError(
                                        t("auth.verifyMissing")
                                    );
                                } catch (err: any) {
                                    setError(mapFirebaseAuthError(err?.code));
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
                                    const firebase = await waitForFirebase();
                                    const user = firebase?.auth()?.currentUser;
                                    if (user) {
                                        await sendVerificationEmail(user);
                                        // #region agent log
                                        agentDebugLog({
                                            hypothesisId: 'V1',
                                            location: 'AuthModal.tsx:resendVerification',
                                            message: 'verification email resent ok',
                                            data: { hasEmail: Boolean(user.email) },
                                            runId: 'verify-email',
                                        });
                                        // #endregion
                                    }
                                    setInfoMessage(t("auth.verifyResent"));
                                } catch (err: any) {
                                    // #region agent log
                                    agentDebugLog({
                                        hypothesisId: 'V1',
                                        location: 'AuthModal.tsx:resendVerification:err',
                                        message: 'verification resend failed',
                                        data: { code: String(err?.code || '').slice(0, 80) },
                                        runId: 'verify-email',
                                    });
                                    // #endregion
                                    setError(mapFirebaseAuthError(err?.code) || formatAuthError(err));
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
                                        readOnly={googleProfilePending}
                                    />
                                </div>
                                {!googleProfilePending ? (
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
                                ) : null}

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
                                        : googleProfilePending
                                          ? t("auth.googleSave")
                                          : mode === "login"
                                          ? t("auth.login")
                                          : t("auth.register")}
                                </button>
                            </form>

                            {!googleProfilePending ? (
                            <>
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
                            </>
                            ) : null}

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
