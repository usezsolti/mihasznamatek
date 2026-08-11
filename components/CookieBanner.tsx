import { useState, useEffect } from 'react';
import Link from 'next/link';

/** Alsó cookie / GDPR sáv — stílus: public/style.css (.cookie-banner). */
export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            setShowBanner(true);
        }
    }, []);

    useEffect(() => {
        document.body.classList.toggle('cookie-banner-open', showBanner);
        return () => document.body.classList.remove('cookie-banner-open');
    }, [showBanner]);

    const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setShowBanner(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookiesAccepted', 'false');
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-live="polite">
            <div className="cookie-banner__inner">
                <div className="cookie-banner__copy">
                    <h3 id="cookie-banner-title">Cookie-k és adatkezelés</h3>
                    <p>
                        A szükséges cookie-k a belépéshez és a biztonságos működéshez kellenek.
                        A részleteket az adatkezelési tájékoztatóban találod.{' '}
                        <Link href="/adatkezelesi-tajekoztato" target="_blank" rel="noopener noreferrer">
                            Adatkezelési tájékoztató
                        </Link>
                    </p>
                </div>
                <div className="cookie-banner__actions">
                    <button type="button" className="cookie-banner__btn cookie-banner__btn--ghost" onClick={declineCookies}>
                        Elutasítom
                    </button>
                    <button type="button" className="cookie-banner__btn cookie-banner__btn--primary" onClick={acceptCookies}>
                        Elfogadom
                    </button>
                </div>
            </div>
        </div>
    );
}
