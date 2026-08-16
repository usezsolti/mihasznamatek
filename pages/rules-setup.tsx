import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFirestoreRulesText, apiSocialDiag } from '../utils/apiClient';

/** Egylépéses Firestore Rules Publish segédoldal */
export default function RulesSetupPage() {
    const [rules, setRules] = useState('');
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    const [adminHint, setAdminHint] = useState('');

    useEffect(() => {
        (async () => {
            const res = await apiFirestoreRulesText();
            if (!res.ok) {
                setStatus(res.error || 'Rules betöltés sikertelen');
                return;
            }
            setRules(res.data.rules || '');
            const text = res.data.rules || '';
            const hasLatestAdmin =
                text.includes('isAdminAccount') &&
                (text.includes("usezsolti.*@gmail") || text.includes("split('+')[0] == 'usezsolti'"));
            if (!hasLatestAdmin) {
                setStatus('Figyelem: a betöltött rules nem a legújabb admin-verzió.');
            } else {
                setStatus('Rules betöltve. Másold → Firebase Console → Publish (local fájl önmagában nem él).');
            }
        })();
    }, []);

    useEffect(() => {
        const t = setInterval(() => {
            try {
                const u = (window as any).firebase?.auth?.()?.currentUser;
                setAdminHint(
                    u
                        ? `Bejelentkezve: ${u.email || u.uid}`
                        : 'Nincs bejelentkezve — előbb Tanári belépés / konzol.'
                );
            } catch {
                setAdminHint('');
            }
        }, 800);
        return () => clearInterval(t);
    }, []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(rules);
            setStatus('Másolva. Most Publish a Firebase Console-ban (Ctrl+V → Publish).');
        } catch {
            setStatus('Másolás sikertelen — jelöld ki kézzel a szöveget alul.');
        }
    };

    const runDiag = async () => {
        setBusy(true);
        setStatus('Diag fut…');
        try {
            const res = await apiSocialDiag();
            let adminLine = '';
            try {
                const fb = (window as any).firebase;
                const user = fb?.auth?.()?.currentUser;
                if (user && fb?.firestore) {
                    await user.getIdToken(true);
                    const token = await user.getIdTokenResult();
                    const claim = !!(token?.claims as any)?.isAdminAccount;
                    try {
                        await fb
                            .firestore()
                            .collection('bookings')
                            .where('status', '==', 'pending')
                            .limit(1)
                            .get();
                        adminLine = ` | Admin bookings: OK (claim=${claim}, email=${user.email || '—'})`;
                    } catch (e: any) {
                        adminLine = ` | Admin bookings: FAIL (${e?.code || e?.message || e}; claim=${claim}, email=${user.email || '—'})`;
                    }
                    if (adminLine.includes('Admin bookings: OK')) {
                        const { clearAdminFirestoreDenied } = await import('../utils/adminFirestoreGate');
                        clearAdminFirestoreDenied();
                    }
                } else {
                    adminLine = ' | Admin: nincs session';
                }
            } catch (e: any) {
                adminLine = ` | Admin diag hiba: ${e?.message || e}`;
            }

            if (!res.ok) {
                setStatus((res.error || 'Diag hiba (jelentkezz be)') + adminLine);
                return;
            }
            if (res.data?.ok) {
                setStatus('Diag OK — socialProfiles OK.' + adminLine);
            } else {
                setStatus(
                    `Diag FAIL (${res.data?.step || '?'}): ${String(res.data?.error || '').slice(0, 200)}` +
                        adminLine
                );
            }
        } catch (e: any) {
            setStatus(e?.message || 'Diag hiba');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div style={{ maxWidth: 880, margin: '2rem auto', padding: '0 1rem', color: '#eee' }}>
            <Head>
                <title>Firestore Rules setup | Mihaszna Matek</title>
            </Head>
            <h1>Firestore Rules telepítés</h1>
            <p>
                A fájl szerkesztése a gépen <strong>nem</strong> Publish. A Console-ba kell bemásolni a
                teljes szöveget, majd Publish — különben marad a{' '}
                <code>Missing or insufficient permissions</code>.
            </p>
            <p style={{ opacity: 0.85 }}>{adminHint}</p>
            <ol>
                <li>
                    <button type="button" onClick={copy} disabled={!rules}>
                        1. Rules másolása (újra!)
                    </button>
                </li>
                <li>
                    Nyisd meg:{' '}
                    <a
                        href="https://console.firebase.google.com/project/mihasznamatek-c9701/firestore/rules"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Firebase Console → Rules
                    </a>
                </li>
                <li>
                    <strong>Jelöld ki az egész régi rules-t</strong>, illeszd be az újat (Ctrl+V), majd{' '}
                    <strong>Publish</strong>.
                </li>
                <li>
                    A rules-ban keresd: <code>usezsolti.*@gmail</code> — ez engedi a{' '}
                    <code>usezsolti+mihaadmin@gmail.com</code> fiókot is.
                </li>
                <li>
                    <button type="button" onClick={runDiag} disabled={busy}>
                        2. Diagnosztika
                    </button>
                </li>
                <li>
                    Ha Diag OK → <Link href="/dashboard?tab=admin">Tanári konzol</Link> ·{' '}
                    <Link href="/community">MihaSocial</Link>
                </li>
            </ol>
            {status && (
                <p style={{ padding: '0.75rem 1rem', background: '#222', borderRadius: 8 }}>{status}</p>
            )}
            <pre
                style={{
                    whiteSpace: 'pre-wrap',
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: 8,
                    padding: '1rem',
                    maxHeight: 420,
                    overflow: 'auto',
                    fontSize: 12,
                }}
            >
                {rules || 'Rules betöltése…'}
            </pre>
        </div>
    );
}
