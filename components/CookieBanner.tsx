import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Ellenőrizzük, hogy a felhasználó már elfogadta-e a cookie-kat
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            setShowBanner(true);
        }
    }, []);

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
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(57, 255, 20, 0.3)',
            padding: '20px',
            zIndex: 1000,
            fontFamily: 'Montserrat, sans-serif'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <h3 style={{
                        color: '#39FF14',
                        margin: '0 0 8px 0',
                        fontSize: '18px',
                        fontWeight: '600'
                    }}>
                        🍪 Cookie-k használata
                    </h3>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        margin: '0',
                        fontSize: '14px',
                        lineHeight: '1.5'
                    }}>
                        Ez a weboldal cookie-kat használ a felhasználói élmény javítása érdekében.
                        A weboldal használatával elfogadja a cookie-k használatát.
                        <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#39FF14',
                                textDecoration: 'none',
                                marginLeft: '5px'
                            }}
                        >
                            Részletek
                        </a>
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexShrink: 0
                }}>
                    <button
                        onClick={declineCookies}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'rgba(255,255,255,0.8)',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Montserrat, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        }}
                    >
                        Elutasítom
                    </button>

                    <button
                        onClick={acceptCookies}
                        style={{
                            background: '#39FF14',
                            border: '1px solid #39FF14',
                            color: '#0f0f23',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Montserrat, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#2ddb0f';
                            e.currentTarget.style.borderColor = '#2ddb0f';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(57, 255, 20, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#39FF14';
                            e.currentTarget.style.borderColor = '#39FF14';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Elfogadom
                    </button>
                </div>
            </div>
        </div>
    );
}








