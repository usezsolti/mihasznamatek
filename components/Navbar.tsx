import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import AuthModal from './AuthModal';
import LanguageToggle from './LanguageToggle';
import { isAdminEmail } from '../utils/admin';
import { OPEN_AUTH_MODAL_EVENT, type OpenAuthModalDetail } from '../utils/authModal';
import { useLang } from '../utils/i18n';

interface NavUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

export default function Navbar() {
    const router = useRouter();
    const { t } = useLang();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<NavUser | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
    const [authRedirectTo, setAuthRedirectTo] = useState<string | false | undefined>(undefined);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user?.id) {
            setCurrentUser(null);
            return;
        }

        const base: NavUser = {
            uid: session.user.id,
            displayName: session.user.name || null,
            email: session.user.email || null,
            photoURL: session.user.image || null,
        };
        setCurrentUser(base);

        let cancelled = false;
        (async () => {
            try {
                const { apiGetAuth } = await import('../utils/apiClient');
                const res = await apiGetAuth<{
                    name?: string | null;
                    image?: string | null;
                }>('/api/user/profile');
                if (cancelled || !res.ok || !res.data) return;
                setCurrentUser((prev) =>
                    prev
                        ? {
                              ...prev,
                              displayName: res.data?.name || prev.displayName,
                              photoURL: res.data?.image || prev.photoURL,
                          }
                        : prev
                );
            } catch {
                /* optional profile fetch */
            }
        })();

        if (session.user.email && isAdminEmail(session.user.email)) {
            (async () => {
                try {
                    const { getBudapestDateKeyOffset, processLessonReminders } =
                        await import('../utils/bookingNotify');
                    const todayKey = getBudapestDateKeyOffset(0);
                    if (localStorage.getItem(`remindersRan_${todayKey}`)) return;
                    const result = await processLessonReminders();
                    if (result.candidates === 0 || result.sent > 0) {
                        localStorage.setItem(`remindersRan_${todayKey}`, String(Date.now()));
                    }
                } catch (err) {
                    console.warn('Auto reminder run failed:', err);
                }
            })();
        }

        return () => {
            cancelled = true;
        };
    }, [session, status]);

    useEffect(() => {
        const onProfileUpdated = (e: Event) => {
            const detail = (e as CustomEvent<{ photoURL?: string | null; displayName?: string | null }>)
                .detail;
            setCurrentUser((prev) =>
                prev
                    ? {
                          ...prev,
                          photoURL:
                              detail?.photoURL !== undefined ? detail.photoURL : prev.photoURL,
                          displayName:
                              detail?.displayName !== undefined
                                  ? detail.displayName
                                  : prev.displayName,
                      }
                    : prev
            );
        };
        window.addEventListener('mihaszna:user-profile-updated', onProfileUpdated);
        const onLogoutEvent = () => setCurrentUser(null);
        window.addEventListener('mihaszna:auth-logout', onLogoutEvent);
        return () => {
            window.removeEventListener('mihaszna:user-profile-updated', onProfileUpdated);
            window.removeEventListener('mihaszna:auth-logout', onLogoutEvent);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleAnchorClick = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
        e.preventDefault();
        setIsMenuOpen(false);
        const go = () => {
            if (router.pathname !== '/') {
                router.push(`/${hash}`);
                return;
            }
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (typeof window !== 'undefined') {
                    history.replaceState(null, '', hash);
                }
            }
        };
        setTimeout(go, 150);
    };

    const handleLogout = async () => {
        setIsMenuOpen(false);
        setCurrentUser(null);
        const { signOutUser } = await import('../utils/authLogout');
        await signOutUser({ redirectTo: '/' });
    };

    const openLocalAuthModal = (
        mode: 'login' | 'register' = 'login',
        redirectTo?: string | false
    ) => {
        setIsMenuOpen(false);
        setAuthModalMode(mode);
        setAuthRedirectTo(redirectTo);
        setAuthModalOpen(true);
    };

    useEffect(() => {
        const onOpen = (e: Event) => {
            const detail = (e as CustomEvent<OpenAuthModalDetail>).detail;
            openLocalAuthModal(
                detail?.mode === 'register' ? 'register' : 'login',
                detail?.redirectTo
            );
        };
        window.addEventListener(OPEN_AUTH_MODAL_EVENT, onOpen);

        const stripAuthQuery = () => {
            const params = new URLSearchParams(window.location.search);
            if (!params.has('auth') && !params.has('verify')) return;
            params.delete('auth');
            params.delete('verify');
            const qs = params.toString();
            const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash || ''}`;
            window.history.replaceState(null, '', next);
        };

        const maybeOpenFromUrl = () => {
            if (typeof window === 'undefined') return;
            const params = new URLSearchParams(window.location.search);
            const auth = params.get('auth');
            if (auth === '1' || auth === 'login') {
                openLocalAuthModal('login');
                stripAuthQuery();
                return;
            }
            if (auth === 'register') {
                openLocalAuthModal('register');
                stripAuthQuery();
                return;
            }
            if (window.location.hash === '#auth') {
                openLocalAuthModal('login');
            }
        };

        maybeOpenFromUrl();
        router.events.on('routeChangeComplete', maybeOpenFromUrl);
        return () => {
            window.removeEventListener(OPEN_AUTH_MODAL_EVENT, onOpen);
            router.events.off('routeChangeComplete', maybeOpenFromUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.events]);

    const isClient = status !== 'loading';
    const displayLabel =
        currentUser?.displayName || currentUser?.email || t('nav.user');

    return (
        <>
            <nav className="site-navbar" suppressHydrationWarning>
                <div className="logo">
                    <Link href="/" aria-label={t('nav.home')} onClick={() => setIsMenuOpen(false)}>
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
                    {isClient && currentUser && (
                        <Link
                            href="/dashboard"
                            className="nav-user-chip nav-user-chip-left"
                            title={displayLabel}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span className="nav-user-avatar" aria-hidden>
                                {currentUser.photoURL ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={currentUser.photoURL} alt="" />
                                ) : (
                                    <span className="nav-user-avatar-fallback">
                                        {(displayLabel[0] || '?').toUpperCase()}
                                    </span>
                                )}
                            </span>
                            <span className="nav-user-name">{displayLabel}</span>
                        </Link>
                    )}
                </div>
                <div className="nav-center">
                    <ul className={`nav-links ${isMenuOpen ? 'open' : 'closed'}`}>
                        <li className="nav-close">
                            <button onClick={toggleMenu} className="close-btn">
                                ✕
                            </button>
                        </li>
                        {isClient &&
                            currentUser &&
                            (isAdminEmail(currentUser.email) ||
                                (session?.user as { role?: string } | undefined)?.role ===
                                    'admin') && (
                            <li>
                                <Link
                                    href="/dashboard?tab=admin"
                                    className={
                                        router.pathname === '/dashboard' &&
                                        router.query.tab === 'admin'
                                            ? 'nav-link-active'
                                            : undefined
                                    }
                                    onClick={toggleMenu}
                                >
                                    {t('nav.admin')}
                                </Link>
                            </li>
                        )}
                        {isClient &&
                            !(
                                currentUser &&
                                (isAdminEmail(currentUser.email) ||
                                    (session?.user as { role?: string } | undefined)?.role ===
                                        'admin')
                            ) && (
                            <li className="nav-auth-mobile">
                                <Link
                                    href="/admin-login"
                                    className={
                                        router.pathname === '/admin-login'
                                            ? 'nav-link-active'
                                            : undefined
                                    }
                                    onClick={toggleMenu}
                                >
                                    {t('nav.adminEnter')}
                                </Link>
                            </li>
                        )}
                        <li>
                            <a href="/#about" onClick={handleAnchorClick('#about')}>
                                {t('nav.about')}
                            </a>
                        </li>
                        <li>
                            <a href="/#courses" onClick={handleAnchorClick('#courses')}>
                                {t('nav.courses')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/#testimonials"
                                onClick={handleAnchorClick('#testimonials')}
                            >
                                {t('nav.testimonials')}
                            </a>
                        </li>
                        <li>
                            <a href="/#pricing" onClick={handleAnchorClick('#pricing')}>
                                {t('nav.pricing')}
                            </a>
                        </li>
                            <li>
                                <Link
                                    href="/community"
                                    className={router.pathname === '/community' ? 'nav-link-active' : undefined}
                                    onClick={toggleMenu}
                                >
                                    {t('nav.community')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/whiteboard"
                                    className={router.pathname === '/whiteboard' ? 'nav-link-active' : undefined}
                                    onClick={toggleMenu}
                                >
                                    {t('nav.whiteboard')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking" onClick={toggleMenu}>
                                    {t('nav.booking')}
                                </Link>
                            </li>
                        <li>
                            <a href="/#contact" onClick={handleAnchorClick('#contact')}>
                                {t('nav.contact')}
                            </a>
                        </li>
                        <li>
                            <Link href="/workout" onClick={toggleMenu}>
                                {t('nav.workout')}
                            </Link>
                        </li>
                        <li className="nav-lang-mobile">
                            <LanguageToggle />
                        </li>
                        {isClient && currentUser && (
                            <li className="nav-auth-mobile">
                                <Link href="/dashboard" onClick={toggleMenu}>
                                    {displayLabel}
                                </Link>
                            </li>
                        )}
                        {isClient && currentUser && (
                            <li className="nav-auth-mobile">
                                <button type="button" className="auth-btn" onClick={handleLogout}>
                                    {t('nav.logout')}
                                </button>
                            </li>
                        )}
                        {isClient && !currentUser && (
                            <li className="nav-auth-mobile">
                                <button type="button" className="auth-btn" onClick={() => openLocalAuthModal('login')}>
                                    {t('nav.login')}
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
                        <a href="/game" className="nav-social-link game" title={t('nav.game')}>
                            🎮
                        </a>
                    </div>

                    <div className="nav-lang-desktop">
                        <LanguageToggle />
                    </div>

                    {isClient && (
                        <div className="nav-auth">
                            {!(
                                currentUser &&
                                (isAdminEmail(currentUser.email) ||
                                    (session?.user as { role?: string } | undefined)?.role ===
                                        'admin')
                            ) && (
                                <Link
                                    href="/admin-login"
                                    className="auth-btn nav-admin-enter-btn"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t('nav.adminEnter')}
                                </Link>
                            )}
                            {currentUser ? (
                                <button
                                    type="button"
                                    className="auth-btn nav-logout-btn"
                                    onClick={handleLogout}
                                >
                                    {t('nav.logout')}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="auth-btn nav-login-btn"
                                    onClick={() => openLocalAuthModal('login')}
                                >
                                    {t('nav.login')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <button className="hamburger-menu" onClick={toggleMenu} aria-label="Menu">
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
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
