import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Navbar() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{ uid: string; name: string; email: string } | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleAnchorClick = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
        e.preventDefault();
        setIsMenuOpen(false);
        const go = () => {
            if (router.pathname !== '/') {
                // Másik oldalon vagyunk: navigáljunk az indexre a megfelelő hash-sel
                router.push(`/${hash}`);
                return;
            }
            // Főoldalon vagyunk: smooth scroll a szekcióra
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
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('currentUser');
            if (user) {
                setCurrentUser(JSON.parse(user));
            }
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('currentUser');
        }
        setCurrentUser(null);
        router.push('/');
    };


    return (
        <nav suppressHydrationWarning>
            <div className="logo">
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
            </div>
            <div className="nav-center">
                <ul className={`nav-links ${isMenuOpen ? 'open' : 'closed'}`}>
                    <li className="nav-close">
                        <button onClick={toggleMenu} className="close-btn">✕</button>
                    </li>
                    <li>
                        <a href="/#about" onClick={handleAnchorClick('#about')}>Rólam</a>
                    </li>
                    <li>
                        <a href="/#courses" onClick={handleAnchorClick('#courses')}>Kiket vállalok?</a>
                    </li>
                    <li>
                        <a href="/#testimonials" onClick={handleAnchorClick('#testimonials')}>Vélemények</a>
                    </li>
                    <li>
                        <a href="/#pricing" onClick={handleAnchorClick('#pricing')}>Ár</a>
                    </li>
                    <li>
                        <a href="/#contact" onClick={handleAnchorClick('#contact')}>Kapcsolat</a>
                    </li>
                    <li>
                        <Link href="/workout" onClick={toggleMenu}>Személyi edzés</Link>
                    </li>
                </ul>
                <div className="nav-social-links">
                    <a href="https://www.facebook.com/profile.php?id=100075272401924" target="_blank" rel="noopener noreferrer" className="nav-social-link facebook" title="Facebook">
                        <FaFacebook size={16} />
                    </a>
                    <a href="https://www.instagram.com/mihaszna__/" target="_blank" rel="noopener noreferrer" className="nav-social-link instagram" title="Instagram">
                        <FaInstagram size={16} />
                    </a>
                    <a href="https://www.youtube.com/@Mihasznamatek" target="_blank" rel="noopener noreferrer" className="nav-social-link youtube" title="YouTube">
                        <FaYoutube size={16} />
                    </a>
                    <a href="https://tiktok.com/@mihasznamatek" target="_blank" rel="noopener noreferrer" className="nav-social-link tiktok" title="TikTok">
                        <FaTiktok size={16} />
                    </a>
                    <a href="/game" className="nav-social-link game" title="Játék">
                        🎮
                    </a>
                </div>
            </div>
            <button className="hamburger-menu" onClick={toggleMenu} aria-label="Menu">
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
        </nav>
    );
}
