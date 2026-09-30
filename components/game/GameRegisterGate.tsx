import { useState } from 'react';
import Head from 'next/head';
import AuthModal from '../AuthModal';

/**
 * A játék csak bejelentkezett, regisztrált fiókkal indul.
 * A menü a játékoldalakon nincs kint, ezért a belépés itt nyílik meg.
 */
export default function GameRegisterGate() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('register');

    const openAuth = (next: 'login' | 'register') => {
        setMode(next);
        setOpen(true);
    };

    return (
        <div className="game-auth-gate">
            <Head>
                <title>Regisztráció szükséges – Mihaszna Matek</title>
            </Head>
            <div className="game-auth-card">
                <h1>A játékhoz regisztráció kell</h1>
                <p>Csak regisztrált fiókkal lehet játszani. Vendégként a játék nem indul el.</p>
                <div className="game-auth-actions">
                    <button type="button" className="game-auth-primary" onClick={() => openAuth('register')}>
                        Regisztráció
                    </button>
                    <button type="button" className="game-auth-secondary" onClick={() => openAuth('login')}>
                        Bejelentkezés
                    </button>
                </div>
            </div>
            <AuthModal
                isOpen={open}
                onClose={() => setOpen(false)}
                initialMode={mode}
                redirectTo={false}
            />
            <style jsx>{`
                .game-auth-gate {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: #0b1020;
                    color: #f4f7ff;
                }
                .game-auth-card {
                    width: min(440px, 100%);
                    background: #151b2e;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 18px;
                    padding: 28px 24px;
                    text-align: center;
                }
                h1 {
                    margin: 0 0 10px;
                    font-size: 1.45rem;
                }
                p {
                    margin: 0 0 22px;
                    color: #c5d0e6;
                    line-height: 1.5;
                }
                .game-auth-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                button {
                    border: 0;
                    border-radius: 12px;
                    padding: 12px 18px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .game-auth-primary {
                    background: #39ff14;
                    color: #071208;
                }
                .game-auth-secondary {
                    background: transparent;
                    color: #f4f7ff;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                }
            `}</style>
        </div>
    );
}
