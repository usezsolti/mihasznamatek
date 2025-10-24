// frontend/pages/verify.tsx
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import CookieBanner from "../components/CookieBanner";

export default function Verify() {
    const router = useRouter();
    const { token, email } = router.query;
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token && email) {
            verifyEmail(token as string, email as string);
        }
    }, [token, email]);

    const verifyEmail = async (token: string, email: string) => {
        try {
            console.log('Verifikáció kezdeményezve:', { token, email });

            // Token ellenőrzése localStorage-ból
            const pendingVerifications = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
            console.log('Pending verifications:', pendingVerifications);

            const verification = pendingVerifications.find((v: { email: string; token: string; uid: string }) =>
                v.token === token && v.email === email
            );

            console.log('Talált verifikáció:', verification);

            if (verification) {
                // Token érvényes, felhasználó verifikálása
                const users = JSON.parse(localStorage.getItem('admin_users') || '[]');
                const userIndex = users.findIndex((u: { email: string; verified?: boolean }) => u.email === email);

                console.log('Felhasználó index:', userIndex);

                if (userIndex !== -1) {
                    // Felhasználó verifikált státuszának beállítása
                    users[userIndex].verified = true;
                    users[userIndex].verifiedAt = new Date().toISOString();
                    localStorage.setItem('admin_users', JSON.stringify(users));

                    // Token eltávolítása a pending listából
                    const updatedPending = pendingVerifications.filter((v: { email: string; token: string; uid: string }) =>
                        !(v.token === token && v.email === email)
                    );
                    localStorage.setItem('pending_verifications', JSON.stringify(updatedPending));

                    setVerificationStatus('success');
                    setMessage('E-mail címed sikeresen verifikálva! Most már bejelentkezhetsz.');
                } else {
                    // Ha a felhasználó nem található, de a token érvényes, akkor is verifikáljuk
                    console.log('Felhasználó nem található, de token érvényes - verifikálás...');

                    // Teszt felhasználó létrehozása
                    const testUser = {
                        uid: 'test_uid',
                        name: 'Teszt Felhasználó',
                        email: email,
                        verified: true,
                        verifiedAt: new Date().toISOString(),
                        createdAt: new Date().toISOString()
                    };

                    users.push(testUser);
                    localStorage.setItem('admin_users', JSON.stringify(users));

                    // Token eltávolítása a pending listából
                    const updatedPending = pendingVerifications.filter((v: { email: string; token: string; uid: string }) =>
                        !(v.token === token && v.email === email)
                    );
                    localStorage.setItem('pending_verifications', JSON.stringify(updatedPending));

                    setVerificationStatus('success');
                    setMessage('Teszt e-mail sikeresen verifikálva! Az e-mail rendszer működik.');
                }
            } else {
                console.log('Token nem található vagy érvénytelen');
                setVerificationStatus('invalid');
                setMessage('Érvénytelen vagy lejárt verifikációs link. Kérlek próbáld újra a teszt e-mail küldést.');
            }
        } catch (error) {
            console.error('Verifikációs hiba:', error);
            setVerificationStatus('error');
            setMessage('Hiba történt a verifikáció során.');
        }
    };

    return (
        <>
            <Head>
                <title>E-mail Verifikáció - MIHASZNA Matek</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div style={{
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
                    maxWidth: '500px',
                    width: '100%',
                    textAlign: 'center',
                    border: '1px solid rgba(57, 255, 20, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '20px',
                        color: '#39FF14'
                    }}>
                        {verificationStatus === 'loading' && '⏳'}
                        {verificationStatus === 'success' && '✅'}
                        {verificationStatus === 'error' && '❌'}
                        {verificationStatus === 'invalid' && '⚠️'}
                    </div>

                    <h1 style={{
                        color: '#ffffff',
                        fontSize: '28px',
                        marginBottom: '20px',
                        fontWeight: '600'
                    }}>
                        E-mail Verifikáció
                    </h1>

                    {verificationStatus === 'loading' && (
                        <p style={{
                            color: '#ffffff',
                            fontSize: '16px',
                            marginBottom: '30px'
                        }}>
                            Verifikáció ellenőrzése...
                        </p>
                    )}

                    {verificationStatus === 'success' && (
                        <>
                            <p style={{
                                color: '#39FF14',
                                fontSize: '16px',
                                marginBottom: '30px',
                                lineHeight: '1.6'
                            }}>
                                {message}
                            </p>
                            <Link href="/dashboard" style={{
                                display: 'inline-block',
                                background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                color: '#ffffff',
                                padding: '15px 30px',
                                borderRadius: '25px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(57, 255, 20, 0.3)'
                            }}>
                                Bejelentkezés
                            </Link>
                        </>
                    )}

                    {verificationStatus === 'error' && (
                        <>
                            <p style={{
                                color: '#FF6B6B',
                                fontSize: '16px',
                                marginBottom: '30px',
                                lineHeight: '1.6'
                            }}>
                                {message}
                            </p>
                            <Link href="/register" style={{
                                display: 'inline-block',
                                background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                color: '#ffffff',
                                padding: '15px 30px',
                                borderRadius: '25px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(57, 255, 20, 0.3)'
                            }}>
                                Újra regisztráció
                            </Link>
                        </>
                    )}

                    {verificationStatus === 'invalid' && (
                        <>
                            <p style={{
                                color: '#FFA500',
                                fontSize: '16px',
                                marginBottom: '30px',
                                lineHeight: '1.6'
                            }}>
                                {message}
                            </p>
                            <Link href="/register" style={{
                                display: 'inline-block',
                                background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                color: '#ffffff',
                                padding: '15px 30px',
                                borderRadius: '25px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(57, 255, 20, 0.3)'
                            }}>
                                Újra regisztráció
                            </Link>
                        </>
                    )}

                    <div style={{
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <Link href="/" style={{
                            color: '#39FF14',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'color 0.3s ease'
                        }}>
                            ← Vissza a főoldalra
                        </Link>
                    </div>
                </div>
            </div>

            <CookieBanner />

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </>
    );
}




