import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isAdminEmail } from '../utils/admin';
import { ADMIN_LOGIN_EMAIL, signInAsAdmin } from '../utils/adminLogin';
import { waitForFirebase } from '../utils/firebaseReady';
import { formatAuthError } from '../utils/testLogin';
import { agentDebugLog } from '../utils/agentDebugLog';

/** Titkos belépő — URL: ADMIN_GATE_PATH */
export default function SigmaDeskGatePage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [email, setEmail] = useState(ADMIN_LOGIN_EMAIL);
    const [password, setPassword] = useState('');

    useEffect(() => {
        let cancelled = false;
        let unsub: (() => void) | undefined;
        (async () => {
            const firebase = await waitForFirebase();
            if (cancelled) return;
            if (!firebase?.auth) {
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
            await signInAsAdmin(password, email);
            setPassword('');
            await router.replace('/dashboard?tab=admin');
        } catch (err: any) {
            // #region agent log
            agentDebugLog({
                hypothesisId: 'L2',
                location: 'sigma-desk-m9k2.tsx:onLogin',
                message: 'teacher gate login failed',
                data: {
                    code: String(err?.code || '').slice(0, 80),
                    msgSlice: String(err?.message || '').slice(0, 120),
                },
                runId: 'login-debug',
            });
            // #endregion
            setError(formatAuthError(err) || err?.message || 'Belépés sikertelen.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Mihaszna Matek</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="mm-gate">
                <div className="mm-gate-card">
                    <p className="mm-gate-kicker">Mihaszna Matek</p>
                    <h1>Belépés</h1>
                    <p className="mm-gate-sub">
                        Firebase e-mail + jelszó a <strong>usezsolti@gmail.com</strong> fiókhoz.
                        Nem a Gmail webes jelszó, és nem a GMAIL_APP_PASSWORD (az csak levelezéshez kell).
                    </p>

                    {checking ? (
                        <p className="mm-gate-status">Ellenőrzés…</p>
                    ) : (
                        <>
                            <label className="mm-gate-label">
                                E-mail
                                <input
                                    type="email"
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-mail"
                                    disabled={loading}
                                />
                            </label>
                            <label className="mm-gate-label">
                                Jelszó
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Jelszó"
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
                                className="mm-gate-btn"
                                disabled={loading || !password.trim() || !email.trim()}
                                onClick={() => void onLogin()}
                            >
                                {loading ? 'Belépés…' : 'Belépés'}
                            </button>
                            {error && <p className="mm-gate-error">{error}</p>}
                        </>
                    )}

                    <div className="mm-gate-links">
                        <Link href="/">Főoldal</Link>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .mm-gate {
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
                .mm-gate-card {
                    width: min(420px, 100%);
                    padding: 1.75rem 1.5rem 1.35rem;
                    border-radius: 22px;
                    background: rgba(16, 16, 28, 0.94);
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    box-shadow: 0 0 40px rgba(57, 255, 20, 0.12);
                    text-align: center;
                }
                .mm-gate-kicker {
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
                .mm-gate-sub,
                .mm-gate-status {
                    margin: 0 0 1.25rem;
                    color: #a0a0a0;
                    font-size: 0.92rem;
                    line-height: 1.45;
                }
                .mm-gate-label {
                    display: grid;
                    gap: 0.35rem;
                    text-align: left;
                    color: #bbb;
                    font-size: 0.85rem;
                    margin-bottom: 0.85rem;
                }
                .mm-gate-label input {
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    background: #0a0f0c;
                    color: #fff;
                    padding: 0.75rem 0.85rem;
                    font-size: 1rem;
                }
                .mm-gate-btn {
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
                .mm-gate-btn:disabled {
                    opacity: 0.55;
                    cursor: default;
                }
                .mm-gate-error {
                    margin: 0.9rem 0 0;
                    color: #ff69b4;
                    font-weight: 650;
                    font-size: 0.9rem;
                }
                .mm-gate-links {
                    display: flex;
                    justify-content: center;
                    margin-top: 1.25rem;
                    padding-top: 0.85rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }
                .mm-gate-links :global(a) {
                    color: #9dff3a;
                    text-decoration: none;
                    font-size: 0.88rem;
                    font-weight: 650;
                }
            `}</style>
        </>
    );
}
