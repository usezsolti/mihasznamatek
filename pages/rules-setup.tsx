import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFirestoreRulesText, apiSocialDiag } from '../utils/apiClient';

/** Egylépéses Firestore Rules Publish segédoldal */
export default function RulesSetupPage() {
    const [rules, setRules] = useState('');
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await apiFirestoreRulesText();
            if (!res.ok) {
                setStatus(res.error || 'Rules betöltés sikertelen');
                return;
            }
            setRules(res.data.rules || '');
        })();
    }, []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(rules);
            setStatus('Másolva a vágólapra.');
        } catch {
            setStatus('Másolás sikertelen — jelöld ki kézzel a szöveget.');
        }
    };

    const runDiag = async () => {
        setBusy(true);
        setStatus('Diag fut…');
        try {
            const res = await apiSocialDiag();
            if (!res.ok) {
                setStatus(res.error || 'Diag hiba (jelentkezz be)');
                return;
            }
            if (res.data?.ok) {
                setStatus('Diag OK — a socialProfiles már írható. Mehet a /community.');
            } else {
                setStatus(
                    `Diag FAIL (${res.data?.step || '?'}): ${String(res.data?.error || '').slice(0, 200)}`
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
                A közösség és a gameResults azért bukik, mert a Firebase-ben még nincs (vagy hiányos) a{' '}
                <code>firestore.rules</code>.
            </p>
            <ol>
                <li>
                    <button type="button" onClick={copy} disabled={!rules}>
                        1. Rules másolása
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
                <li>Illeszd be (Ctrl+V), majd <strong>Publish</strong>.</li>
                <li>
                    <button type="button" onClick={runDiag} disabled={busy}>
                        2. Diagnosztika (socialProfiles)
                    </button>
                </li>
                <li>
                    Ha Diag OK → <Link href="/community">Közösség</Link>
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
