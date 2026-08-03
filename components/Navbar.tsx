import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { isAdminEmail } from "../utils/admin";
import { OPEN_AUTH_MODAL_EVENT, type OpenAuthModalDetail } from "../utils/authModal";

interface NavUser {
    uid: string;
    displayName: string | null;
    email: string | null;
}

export default function Navbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [currentUser, setCurrentUser] = useState<NavUser | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
    const [authRedirectTo, setAuthRedirectTo] = useState<string | false | undefined>(undefined);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || typeof window === "undefined") return;

        let unsub: (() => void) | undefined;
        let cancelled = false;

        const init = async () => {
            for (let i = 0; i < 50; i++) {
                const firebase = (window as any).firebase;
                if (firebase?.apps?.length > 0) break;
                if (firebase && !firebase.apps.length && (window as any).__FIREBASE_CONFIG__) {
                    try {
                        firebase.initializeApp((window as any).__FIREBASE_CONFIG__);
                        break;
                    } catch {
                        // ignore
                    }
                }
                await new Promise((r) => setTimeout(r, 100));
            }

            if (cancelled) return;
            const firebase = (window as any).firebase;
            if (!firebase?.apps?.length) return;

            const auth = firebase.auth();
            unsub = auth.onAuthStateChanged((user: any) => {
                if (!user) {
                    setCurrentUser(null);
                    return;
                }
                setCurrentUser({
                    uid: user.uid,
                    displayName: user.displayName || null,
                    email: user.email || null,
                });

                // Admin: naponta egyszer, bárhol a site-on — holnapi órák emlékeztetője
                if (isAdminEmail(user.email)) {
                    (async () => {
                        try {
                            const { getBudapestDateKeyOffset, processLessonReminders } =
                                await import("../utils/bookingNotify");
                            const todayKey = getBudapestDateKeyOffset(0);
                            if (localStorage.getItem(`remindersRan_${todayKey}`)) return;
                            const result = await processLessonReminders();
                            if (result.candidates === 0 || result.sent > 0) {
                                localStorage.setItem(`remindersRan_${todayKey}`, String(Date.now()));
                            }
                        } catch (err) {
                            console.warn("Auto reminder run failed:", err);
                        }
                    })();
                }
            });
        };

        init();
        return () => {
            cancelled = true;
            if (unsub) unsub();
        };
    }, [isClient]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleAnchorClick = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
        e.preventDefault();
        setIsMenuOpen(false);
        const go = () => {
            if (router.pathname !== "/") {
                router.push(`/${hash}`);
                return;
            }
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                if (typeof window !== "undefined") {
                    history.replaceState(null, "", hash);
                }
            }
        };
        setTimeout(go, 150);
    };

    const handleLogout = async () => {
        setIsMenuOpen(false);
        try {
            const firebase = (window as any).firebase;
            if (firebase?.auth) {
                await firebase.auth().signOut();
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const openLocalAuthModal = (
        mode: "login" | "register" = "login",
        redirectTo?: string | false
    ) => {
        setIsMenuOpen(false);
        setAuthModalMode(mode);
        setAuthRedirectTo(redirectTo);
        setAuthModalOpen(true);
    };

    // Bárhonnan nyitható (Fiókom szekció, /#auth, ?auth=1)
    useEffect(() => {
        if (!isClient) return;

        const onOpen = (e: Event) => {
            const detail = (e as CustomEvent<OpenAuthModalDetail>).detail;
            openLocalAuthModal(
                detail?.mode === "register" ? "register" : "login",
                detail?.redirectTo
            );
        };
        window.addEventListener(OPEN_AUTH_MODAL_EVENT, onOpen);

        const stripAuthQuery = () => {
            const params = new URLSearchParams(window.location.search);
            if (!params.has("auth") && !params.has("verify")) return;
            params.delete("auth");
            params.delete("verify");
            const qs = params.toString();
            const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash || ""}`;
            window.history.replaceState(null, "", next);
        };

        const maybeOpenFromUrl = () => {
            if (typeof window === "undefined") return;
            const params = new URLSearchParams(window.location.search);
            const auth = params.get("auth");
            const needsVerify = params.get("verify") === "1";
            if (auth === "1" || auth === "login") {
                openLocalAuthModal("login");
                if (needsVerify) {
                    window.setTimeout(() => {
                        alert(
                            "Az e-mail címed még nincs megerősítve. Nézd meg a postaládádat (Spam is), majd jelentkezz be újra."
                        );
                    }, 300);
                }
                stripAuthQuery();
                return;
            }
            if (auth === "register") {
                openLocalAuthModal("register");
                stripAuthQuery();
                return;
            }
            if (window.location.hash === "#auth") {
                openLocalAuthModal("login");
            }
        };

        maybeOpenFromUrl();
        router.events.on("routeChangeComplete", maybeOpenFromUrl);
        return () => {
            window.removeEventListener(OPEN_AUTH_MODAL_EVENT, onOpen);
            router.events.off("routeChangeComplete", maybeOpenFromUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient, router.events]);

    const displayLabel =
        currentUser?.displayName || currentUser?.email || "Felhasználó";

    return (
        <>
            <nav suppressHydrationWarning>
                <div className="logo">
                    <Link href="/" aria-label="Kezdőlap" onClick={() => setIsMenuOpen(false)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        width="48"
                        height="48"
                    >
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#39FF14" />
                                <stop offset="100%" stopColor="#FF49DB" />
                            </linearGradient>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <text
                            x="40%"
                            y="60%"
                            textAnchor="middle"
                            fontFamily="Montserrat, sans-serif"
                            fontWeight="700"
                            fontSize="100"
                            fill="url(#grad)"
                            filter="url(#glow)"
                        >
                            ∑
                        </text>
                        <text
                            x="60%"
                            y="60%"
                            textAnchor="middle"
                            fontFamily="Montserrat, sans-serif"
                            fontWeight="700"
                            fontSize="100"
                            fill="url(#grad)"
                            filter="url(#glow)"
                        >
                            ∫
                        </text>
                    </svg>
                    </Link>
                </div>
                <div className="nav-center">
                    <ul className={`nav-links ${isMenuOpen ? "open" : "closed"}`}>
                        <li className="nav-close">
                            <button onClick={toggleMenu} className="close-btn">
                                ✕
                            </button>
                        </li>
                        <li>
                            <a href="/#about" onClick={handleAnchorClick("#about")}>
                                Rólam
                            </a>
                        </li>
                        <li>
                            <a href="/#courses" onClick={handleAnchorClick("#courses")}>
                                Kiket vállalok?
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#testimonials"
                                onClick={handleAnchorClick("#testimonials")}
                            >
                                Vélemények
                            </a>
                        </li>
                        <li>
                            <a href="/#pricing" onClick={handleAnchorClick("#pricing")}>
                                Ár
                            </a>
                        </li>
                        <li>
                            <Link href="/booking" onClick={toggleMenu}>
                                Időpontfoglalás
                            </Link>
                        </li>
                        <li>
                            <a href="/#contact" onClick={handleAnchorClick("#contact")}>
                                Kapcsolat
                            </a>
                        </li>
                        <li>
                            <Link href="/workout" onClick={toggleMenu}>
                                Személyi edzés
                            </Link>
                        </li>
                        {isClient && currentUser && (
                            <li className="nav-auth-mobile">
                                <Link href="/dashboard" onClick={toggleMenu}>
                                    Dashboard
                                </Link>
                            </li>
                        )}
                        {isClient && currentUser && (
                            <li className="nav-auth-mobile">
                                <button type="button" className="auth-btn" onClick={handleLogout}>
                                    Kijelentkezés
                                </button>
                            </li>
                        )}
                        {isClient && !currentUser && (
                            <li className="nav-auth-mobile">
                                <button type="button" className="auth-btn" onClick={() => openLocalAuthModal("login")}>
                                    Bejelentkezés
                                </button>
                            </li>
                        )}
                    </ul>
                    <div className="nav-social-links">
                        <a
                            href="https://www.facebook.com/profile.php?id=100075272401924"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-social-link facebook"
                            title="Facebook"
                        >
                            <FaFacebook size={16} />
                        </a>
                        <a
                            href="https://www.instagram.com/mihaszna__/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-social-link instagram"
                            title="Instagram"
                        >
                            <FaInstagram size={16} />
                        </a>
                        <a
                            href="https://www.youtube.com/@Mihasznamatek"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-social-link youtube"
                            title="YouTube"
                        >
                            <FaYoutube size={16} />
                        </a>
                        <a
                            href="https://tiktok.com/@mihasznamatek"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-social-link tiktok"
                            title="TikTok"
                        >
                            <FaTiktok size={16} />
                        </a>
                        <a href="/game" className="nav-social-link game" title="Játék">
                            🎮
                        </a>

                        {isClient && (
                            <div className="nav-auth">
                                {currentUser ? (
                                    <div className="nav-user">
                                        <Link href="/dashboard" className="nav-user-link" title={displayLabel}>
                                            {displayLabel}
                                        </Link>
                                        <button
                                            type="button"
                                            className="auth-btn nav-logout-btn"
                                            onClick={handleLogout}
                                        >
                                            Kijelentkezés
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="auth-btn nav-login-btn"
                                        onClick={() => openLocalAuthModal("login")}
                                    >
                                        Bejelentkezés
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <button className="hamburger-menu" onClick={toggleMenu} aria-label="Menu">
                    <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
                </button>
            </nav>

            <AuthModal
                isOpen={authModalOpen}
                initialMode={authModalMode}
                redirectTo={authRedirectTo}
                onClose={() => {
                    setAuthModalOpen(false);
                    setAuthRedirectTo(undefined);
                }}
            />
        </>
    );
}
