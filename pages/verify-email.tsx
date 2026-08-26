import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

/**
 * /verify-email?token=... — Gmail branded custom megerősítés (Admin nélkül is).
 */
export default function VerifyEmailPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'ok' | 'err'>('loading');
    const [message, setMessage] = useState('Megerősítés folyamatban…');

    useEffect(() => {
        if (!router.isReady) return;
        const token = String(router.query.token || '').trim();
        if (!token) {
            setStatus('err');
            setMessage('Hiányzik a megerősítő token a linkből.');
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/auth/confirm-email-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });
                const json = await res.json().catch(() => ({}));
                if (cancelled) return;
                if (res.ok && json?.ok) {
                    setStatus('ok');
                    setMessage('E-mail cím megerősítve. Most már bejelentkezhetsz.');
                } else {
                    setStatus('err');
                    setMessage(String(json?.error || 'A megerősítés nem sikerült.'));
                }
            } catch {
                if (!cancelled) {
                    setStatus('err');
                    setMessage('Hálózati hiba a megerősítés közben.');
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [router.isReady, router.query.token]);

    return (
        <main style={{ maxWidth: 480, margin: '4rem auto', padding: '0 1.25rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ fontSize: '1.5rem' }}>Mihaszna Matek</h1>
            <p style={{ color: status === 'err' ? '#b42318' : status === 'ok' ? '#027a48' : '#444' }}>
                {message}
            </p>
            <p>
                <Link href="/">Vissza a főoldalra</Link>
                {' · '}
                <Link href="/dashboard">Dashboard</Link>
            </p>
        </main>
    );
}
