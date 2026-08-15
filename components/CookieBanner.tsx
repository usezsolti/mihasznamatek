import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '../utils/i18n';

/** Alsó cookie / GDPR sáv — stílus: public/style.css (.cookie-banner). */
export default function CookieBanner() {
    const { t } = useLang();
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
                    <h3 id="cookie-banner-title">{t('cookie.title')}</h3>
                    <p>
                        {t('cookie.body')}{' '}
                        <Link href="/adatkezelesi-tajekoztato" target="_blank" rel="noopener noreferrer">
                            {t('cookie.privacyLink')}
                        </Link>
                    </p>
                </div>
                <div className="cookie-banner__actions">
                    <button type="button" className="cookie-banner__btn cookie-banner__btn--ghost" onClick={declineCookies}>
                        {t('cookie.decline')}
                    </button>
                    <button type="button" className="cookie-banner__btn cookie-banner__btn--primary" onClick={acceptCookies}>
                        {t('cookie.accept')}
                    </button>
                </div>
            </div>
        </div>
    );
}
