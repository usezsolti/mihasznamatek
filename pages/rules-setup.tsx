import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { apiFirestoreRulesText, apiSocialDiag } from '../utils/apiClient';

/** Egylépéses Firestore Rules Publish segédoldal */
export default function RulesSetupPage() {
    const [rules, setRules] = useState('');
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    const [adminHint, setAdminHint] = useState('');
    const preRef = useRef<HTMLPreElement>(null);

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
                setStatus('Rules betöltve. Csak a fekete doboz szövegét másold a Firebase Console-ba.');
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

    const selectRulesBox = () => {
        const el = preRef.current;
        if (!el) return;
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
    };

    const copy = async () => {
        if (!rules.trim().startsWith('rules_version')) {
            setStatus('Hiba: a betöltött szöveg nem tűnik rules fájlnak. Frissítsd az oldalt.');
            return;
        }
        try {
            await navigator.clipboard.writeText(rules);
            selectRulesBox();
            setStatus(
                'OK — csak a rules került a vágólapra. Firebase Console → jelöld ki a RÉGI rules egészét → Ctrl+V → Publish. Ne az egész weblapot másold.'
            );
        } catch {
            selectRulesBox();
            setStatus('Automatikus másolás sikertelen — a fekete doboz ki van jelölve, Ctrl+C, majd Console-ba Ctrl+V.');
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
                        adminLine = ` | Admin bookings: OK (claim=${claim}, email=${user.email || '-'})`;
                    } catch (e: any) {
                        adminLine = ` | Admin bookings: FAIL (${e?.code || e?.message || e}; claim=${claim}, email=${user.email || '-'})`;
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
            <p
                style={{
                    padding: '0.85rem 1rem',
                    background: '#3a1515',
                    border: '1px solid #c44',
                    borderRadius: 8,
                    lineHeight: 1.45,
                }}
            >
                <strong>Ne az egész oldalt másold</strong> a Firebase Console-ba. Ha
                &quot;Unexpected Head&quot; vagy magyar ékezetes hibák jönnek, a weblap HTML-je
                került be — töröld, és csak a fekete doboz tartalmát illeszd be (vagy használd a
                Másolás gombot).
            </p>
            <p>
                A fájl szerkesztése a gépen <strong>nem</strong> Publish. A Console-ba kell bemásolni a
                teljes rules szöveget, majd Publish.
            </p>
            <p style={{ opacity: 0.85 }}>{adminHint}</p>
            <ol>
                <li>
                    <button type="button" onClick={copy} disabled={!rules}>
                        1. Csak a rules másolása
                    </button>
                </li>
                <li>
                    Nyisd meg:{' '}
                    <a
                        href="https://console.firebase.google.com/project/mihasznamatek-c9701/firestore/rules"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Firebase Console - Rules
                    </a>
                </li>
                <li>
                    <strong>Jelöld ki az egész régi rules-t</strong>, illeszd be az újat (Ctrl+V), majd{' '}
                    <strong>Publish</strong>. Az első sornak így kell kinéznie:{' '}
                    <code>rules_version = &apos;2&apos;;</code>
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
            <p style={{ marginBottom: '0.35rem', opacity: 0.8, fontSize: 13 }}>
                Csak ez a doboz megy a Console-ba (kattints rá, vagy használd a Másolás gombot):
            </p>
            <pre
                ref={preRef}
                onClick={selectRulesBox}
                style={{
                    whiteSpace: 'pre-wrap',
                    background: '#111',
                    border: '2px solid #39ff14',
                    borderRadius: 8,
                    padding: '1rem',
                    maxHeight: 420,
                    overflow: 'auto',
                    fontSize: 12,
                    cursor: 'text',
                    userSelect: 'text',
                }}
            >
                {rules || 'Rules betöltése…'}
            </pre>
        </div>
    );
}
