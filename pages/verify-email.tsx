// frontend/pages/verify-email.tsx
import Head from "next/head";
import Link from "next/link";
import CookieBanner from "../components/CookieBanner";

export default function VerifyEmail() {
    return (
        <>
            <Head>
                <title>E-mail Ellenőrzés - MIHASZNA Matek</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="verify-email-page" style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                fontFamily: 'Montserrat, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Mathematical symbols background */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    fontSize: '24px',
                    color: '#39FF14',
                    opacity: 0.6,
                    animation: 'float 8s ease-in-out infinite'
                }}>∑</div>

                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '15%',
                    fontSize: '20px',
                    color: '#FF49DB',
                    opacity: 0.5,
                    animation: 'float 10s ease-in-out infinite'
                }}>π</div>

                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '20%',
                    fontSize: '28px',
                    color: '#39FF14',
                    opacity: 0.4,
                    animation: 'float 12s ease-in-out infinite'
                }}>∞</div>

                <div style={{
                    position: 'absolute',
                    bottom: '30%',
                    right: '10%',
                    fontSize: '22px',
                    color: '#FF49DB',
                    opacity: 0.6,
                    animation: 'float 9s ease-in-out infinite'
                }}>∫</div>

                {/* Main content */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '40px',
                    maxWidth: '600px',
                    width: '100%',
                    textAlign: 'center',
                    border: '1px solid rgba(57, 255, 20, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        fontSize: '64px',
                        marginBottom: '20px',
                        color: '#39FF14'
                    }}>
                        📧
                    </div>

                    <h1 style={{
                        color: '#ffffff',
                        fontSize: '32px',
                        marginBottom: '20px',
                        fontWeight: '600'
                    }}>
                        E-mail Ellenőrzés
                    </h1>

                    <p style={{
                        color: '#ffffff',
                        fontSize: '18px',
                        marginBottom: '30px',
                        lineHeight: '1.6'
                    }}>
                        Köszönjük a regisztrációt! Kérlek ellenőrizd az e-mail fiókod és kattints a verifikációs linkre a fiókod aktiválásához.
                    </p>

                    <div style={{
                        background: 'rgba(57, 255, 20, 0.1)',
                        border: '1px solid rgba(57, 255, 20, 0.3)',
                        borderRadius: '15px',
                        padding: '20px',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{
                            color: '#39FF14',
                            fontSize: '20px',
                            marginBottom: '15px',
                            fontWeight: '600'
                        }}>
                            Mit kell tenned?
                        </h3>
                        <ul style={{
                            color: '#ffffff !important',
                            fontSize: '16px',
                            textAlign: 'left',
                            lineHeight: '1.8',
                            listStyle: 'none',
                            padding: 0
                        }}>
                            <li style={{ marginBottom: '10px' }}>📧 Nyisd meg az e-mail fiókod</li>
                            <li style={{ marginBottom: '10px' }}>🔍 Keresd meg a MIHASZNA Matek e-mailt</li>
                            <li style={{ marginBottom: '10px' }}>🔗 Kattints a verifikációs linkre</li>
                            <li style={{ marginBottom: '10px' }}>✅ Fiókod aktiválva lesz</li>
                        </ul>
                    </div>

                    <div style={{
                        background: 'rgba(255, 193, 7, 0.1)',
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                        borderRadius: '15px',
                        padding: '20px',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{
                            color: '#FFC107',
                            fontSize: '18px',
                            marginBottom: '10px',
                            fontWeight: '600'
                        }}>
                            ⚠️ Fontos
                        </h3>
                        <p style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }}>
                            Ha nem találod az e-mailt, ellenőrizd a spam mappát is. A verifikációs link 24 óráig érvényes.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link href="/" style={{
                            display: 'inline-block',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            Főoldal
                        </Link>

                        <Link href="/register" style={{
                            display: 'inline-block',
                            background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(57, 255, 20, 0.3)'
                        }}>
                            Új E-mail Küldése
                        </Link>
                    </div>

                    <div style={{
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <p style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            marginBottom: '10px'
                        }}>
                            Problémád van? Írj nekünk:
                        </p>
                        <a href="mailto:mihaszna.math@gmail.com" style={{
                            color: '#39FF14',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'color 0.3s ease'
                        }}>
                            mihaszna.math@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            <CookieBanner />

            <style jsx global>{`
                 @keyframes float {
                     0%, 100% { transform: translateY(0px); }
                     50% { transform: translateY(-20px); }
                 }
                 
                 .verify-email-page * {
                     color: #ffffff !important;
                 }
                 
                 .verify-email-page ul li {
                     color: #ffffff !important;
                 }
             `}</style>
        </>
    );
}
