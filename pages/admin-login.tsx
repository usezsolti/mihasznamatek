import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isAdminEmail } from '../utils/admin';
import { ADMIN_LOGIN_EMAIL, signInAsAdmin } from '../utils/adminLogin';

async function waitForFirebase(maxMs = 8000): Promise<any | null> {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
        const firebase = (window as any).firebase;
        if (firebase?.auth && firebase?.apps?.length) return firebase;
        await new Promise((r) => setTimeout(r, 100));
    }
    return (window as any).firebase || null;
}

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [password, setPassword] = useState('');

    useEffect(() => {
        let cancelled = false;
        let unsub: (() => void) | undefined;
        (async () => {
            const firebase = await waitForFirebase();
            if (!firebase?.auth || cancelled) {
                setChecking(false);
                return;
            }
            unsub = firebase.auth().onAuthStateChanged(async (user: any) => {
                if (cancelled) return;
                if (user?.email && isAdminEmail(user.email)) {
                    await router.replace('/dashboard?tab=admin');
                    return;
                }
                setChecking(false);
            });
        })();
        return () => {
            cancelled = true;
            try {
                unsub?.();
            } catch {
                /* ignore */
            }
        };
    }, [router]);

    const onLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signInAsAdmin(password);
            setPassword('');
            await router.replace('/dashboard?tab=admin');
        } catch (err: any) {
            setError(err?.message || 'Tanári belépés sikertelen.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Tanári belépés | Mihaszna Matek</title>
            </Head>
            <div className="mm-admin-login">
                <div className="mm-admin-login-card">
                    <p className="mm-admin-login-kicker">Mihaszna Matek</p>
                    <h1>Tanári belépés</h1>
                    <p className="mm-admin-login-sub">
                        Csak <strong>{ADMIN_LOGIN_EMAIL}</strong> — add meg a fiók jelszavát.
                    </p>

                    {checking ? (
                        <p className="mm-admin-login-status">Ellenőrzés…</p>
                    ) : (
                        <>
                            <label className="mm-admin-login-label">
                                Jelszó
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Tanári jelszó"
                                    disabled={loading}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            void onLogin();
                                        }
                                    }}
                                />
                            </label>
                            <button
                                type="button"
                                className="mm-admin-login-quick"
                                disabled={loading || !password.trim()}
                                onClick={() => void onLogin()}
                            >
                                {loading ? 'Belépés…' : 'Belépés a konzolra'}
                            </button>
                            {error && <p className="mm-admin-login-error">{error}</p>}
                        </>
                    )}

                    <div className="mm-admin-login-links">
                        <Link href="/">Főoldal</Link>
                        <Link href="/dashboard">Dashboard</Link>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .mm-admin-login {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    padding: 2rem 1rem;
                    background:
                        radial-gradient(ellipse 70% 50% at 15% 0%, rgba(57, 255, 20, 0.16), transparent 55%),
                        radial-gradient(ellipse 60% 45% at 90% 10%, rgba(255, 73, 219, 0.14), transparent 50%),
                        linear-gradient(165deg, #07070d 0%, #0f0f23 45%, #12182a 100%);
                    color: #f2f2f2;
                    font-family: 'Open Sans', system-ui, sans-serif;
                }
                .mm-admin-login-card {
                    width: min(420px, 100%);
                    padding: 1.75rem 1.5rem 1.35rem;
                    border-radius: 22px;
                    background: rgba(16, 16, 28, 0.94);
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    box-shadow: 0 0 40px rgba(57, 255, 20, 0.12);
                    text-align: center;
                }
                .mm-admin-login-kicker {
                    margin: 0;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    font-size: 0.68rem;
                    font-weight: 800;
                    color: #9dff3a;
                }
                h1 {
                    margin: 0.35rem 0 0.4rem;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 2rem;
                    background: linear-gradient(45deg, #39ff14, #ff49db);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .mm-admin-login-sub,
                .mm-admin-login-status {
                    margin: 0 0 1.25rem;
                    color: #a0a0a0;
                    font-size: 0.92rem;
                    line-height: 1.45;
                }
                .mm-admin-login-sub strong {
                    color: #9dff3a;
                }
                .mm-admin-login-label {
                    display: grid;
                    gap: 0.35rem;
                    text-align: left;
                    color: #bbb;
                    font-size: 0.85rem;
                    margin-bottom: 0.85rem;
                }
                .mm-admin-login-label input {
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    background: #0a0f0c;
                    color: #fff;
                    padding: 0.75rem 0.85rem;
                    font-size: 1rem;
                }
                .mm-admin-login-quick {
                    width: 100%;
                    border: none;
                    border-radius: 14px;
                    padding: 1rem 1.1rem;
                    font-weight: 800;
                    font-size: 1.05rem;
                    font-family: 'Montserrat', system-ui, sans-serif;
                    background: #39ff14;
                    color: #0a0a12;
                    cursor: pointer;
                    box-shadow: 0 0 22px rgba(57, 255, 20, 0.4);
                }
                .mm-admin-login-quick:disabled {
                    opacity: 0.55;
                    cursor: default;
                }
                .mm-admin-login-error {
                    margin: 0.9rem 0 0;
                    color: #ff69b4;
                    font-weight: 650;
                    font-size: 0.9rem;
                }
                .mm-admin-login-links {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-top: 1.25rem;
                    padding-top: 0.85rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }
                .mm-admin-login-links :global(a) {
                    color: #9dff3a;
                    text-decoration: none;
                    font-size: 0.88rem;
                    font-weight: 650;
                }
            `}</style>
        </>
    );
}
