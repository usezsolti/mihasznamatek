import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MatekWhiteboard from '../components/whiteboard/MatekWhiteboard';
import { openAuthModal } from '../utils/authModal';
import { waitForFirebase } from '../utils/firebaseReady';

export default function WhiteboardPage() {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [uid, setUid] = useState<string | null>(null);
    const [name, setName] = useState('Vendég');
    const [boardFromUrl, setBoardFromUrl] = useState<string | null>(null);

    useEffect(() => {
        document.body.classList.add('wb-body');
        return () => document.body.classList.remove('wb-body');
    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        const b = String(router.query.board || '').trim();
        setBoardFromUrl(b || null);
    }, [router.isReady, router.query.board]);

    useEffect(() => {
        let cancelled = false;
        let unsub: (() => void) | undefined;
        void (async () => {
            const firebase = await waitForFirebase();
            if (cancelled) return;
            if (!firebase?.auth) {
                setReady(true);
                return;
            }
            unsub = firebase.auth().onAuthStateChanged((user: any) => {
                if (cancelled) return;
                if (user) {
                    setUid(user.uid);
                    setName(String(user.displayName || user.email || 'Felhasználó'));
                } else {
                    setUid(null);
                }
                setReady(true);
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
    }, []);

    const onBoardId = (id: string) => {
        if (!router.isReady) return;
        if (String(router.query.board || '') === id) return;
        void router.replace({ pathname: '/whiteboard', query: { board: id } }, undefined, {
            shallow: true,
        });
    };

    return (
        <>
            <Head>
                <title>Whiteboard | Mihaszna Matek</title>
            </Head>
            <div className="wb-page">
                <div className="wb-page-head">
                    <div>
                        <p className="wb-kicker">MIHASZNA MATEK</p>
                        <h1 className="wb-title">Whiteboard</h1>
                    </div>
                    <div className="wb-page-links">
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/community">MihaSocial</Link>
                    </div>
                </div>

                {!ready ? (
                    <p className="wb-status">Betöltés…</p>
                ) : !uid ? (
                    <div className="wb-gate">
                        <h2>Belépés szükséges</h2>
                        <p>A közös whiteboardhoz jelentkezz be (tanár és diák egyaránt).</p>
                        <button
                            type="button"
                            className="wb-primary"
                            onClick={() => openAuthModal({ mode: 'login', redirectTo: '/whiteboard' })}
                        >
                            Bejelentkezés
                        </button>
                        <Link href="/dashboard">Vissza</Link>
                    </div>
                ) : (
                    <MatekWhiteboard
                        uid={uid}
                        displayName={name}
                        initialBoardId={boardFromUrl}
                        onBoardId={onBoardId}
                    />
                )}
            </div>
        </>
    );
}
