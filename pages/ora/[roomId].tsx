import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AuthModal from '../../components/AuthModal';
import LessonHourRoom from '../../components/LessonHourRoom';
import {
    lessonCallRoomName,
    loadLessonRoom,
    type LessonRoom,
} from '../../utils/lessonRoom';

function fallbackRoom(roomId: string): LessonRoom {
    return {
        id: roomId,
        title: 'Matek óra',
        createdBy: '',
        whiteboardId: '',
        jitsiRoom: lessonCallRoomName(roomId),
        createdAtMs: Date.now(),
    };
}

export default function OraPage() {
    const router = useRouter();
    const roomId = String(router.query.roomId || '').trim();
    const { data: session, status } = useSession();

    const ready = status !== 'loading';
    const uid = String((session?.user as { id?: string } | undefined)?.id || '') || null;
    const name = String(session?.user?.name || session?.user?.email || 'Felhasználó');
    const photoURL = String(session?.user?.image || '');
    const [room, setRoom] = useState<LessonRoom | null>(null);
    const [loadErr, setLoadErr] = useState('');
    const [loadingRoom, setLoadingRoom] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    useEffect(() => {
        document.body.classList.add('ora-body');
        return () => document.body.classList.remove('ora-body');
    }, []);

    useEffect(() => {
        if (uid) setAuthOpen(false);
    }, [uid]);

    useEffect(() => {
        if (!router.isReady || !roomId || !uid) {
            setLoadingRoom(false);
            return;
        }
        let cancelled = false;
        setLoadingRoom(true);
        setLoadErr('');

        const timer = window.setTimeout(() => {
            if (cancelled) return;
            // Ha az API lassú — ne fehér képernyő: helyi fallback óra
            setRoom((prev) => prev || fallbackRoom(roomId));
            setLoadErr(
                'Az óra adatai részben helyiek (API lassú). A hívás így is megy.'
            );
            setLoadingRoom(false);
        }, 8000);

        void loadLessonRoom(roomId)
            .then((r) => {
                if (cancelled) return;
                window.clearTimeout(timer);
                if (r) {
                    setRoom(r);
                    setLoadErr('');
                } else {
                    setRoom(fallbackRoom(roomId));
                    setLoadErr(
                        'Az óra nincs a szerveren. Helyi óra: hívás + tábla így is elérhető.'
                    );
                }
                setLoadingRoom(false);
            })
            .catch(() => {
                if (cancelled) return;
                window.clearTimeout(timer);
                setRoom(fallbackRoom(roomId));
                setLoadErr('Óra betöltés hiba — helyi óra módban folytatjuk.');
                setLoadingRoom(false);
            });

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [router.isReady, roomId, uid]);

    const openLogin = (mode: 'login' | 'register' = 'login') => {
        setAuthMode(mode);
        setAuthOpen(true);
    };

    const showRoom = Boolean(uid && room && !loadingRoom);

    return (
        <>
            <Head>
                <title>
                    {room?.title ? `${room.title} | Élő óra` : 'Élő óra'} | Mihaszna Matek
                </title>
            </Head>
            <div className="ora-page">
                {!ready ? (
                    <p className="ora-status">Betöltés…</p>
                ) : !uid ? (
                    <div className="ora-gate">
                        <p className="ora-kicker">MIHASZNA MATEK</p>
                        <h1>Élő óra</h1>
                        <p>
                            A híváshoz, táblához és csevegéshez jelentkezz be. A csatlakozási link
                            ugyanaz marad.
                        </p>
                        {roomId ? (
                            <p className="ora-room-id">
                                Óra: <code>{roomId}</code>
                            </p>
                        ) : null}
                        <button type="button" className="ora-primary" onClick={() => openLogin('login')}>
                            Bejelentkezés
                        </button>
                        <button type="button" className="ora-secondary" onClick={() => openLogin('register')}>
                            Regisztráció
                        </button>
                        <Link href="/dashboard">Vissza a dashboardra</Link>
                    </div>
                ) : !roomId ? (
                    <div className="ora-gate">
                        <h1>Hiányzó óra link</h1>
                        <p>Kérj érvényes csatlakozási linket a tanártól.</p>
                        <Link href="/dashboard">Dashboard</Link>
                    </div>
                ) : loadingRoom && !room ? (
                    <p className="ora-status">Óra betöltése…</p>
                ) : showRoom && room ? (
                    <>
                        {loadErr ? (
                            <p className="ora-banner" role="status">
                                {loadErr}
                            </p>
                        ) : null}
                        <LessonHourRoom
                            room={room}
                            uid={uid}
                            displayName={name}
                            photoURL={photoURL}
                            onRoomUpdated={setRoom}
                        />
                    </>
                ) : (
                    <div className="ora-gate">
                        <h1>Óra nem elérhető</h1>
                        <p>{loadErr || 'Ismeretlen hiba.'}</p>
                        <button type="button" className="ora-primary" onClick={() => openLogin('login')}>
                            Újra bejelentkezés
                        </button>
                        <Link href="/dashboard">Dashboard</Link>
                    </div>
                )}
            </div>

            <AuthModal
                isOpen={authOpen}
                onClose={() => setAuthOpen(false)}
                initialMode={authMode}
                redirectTo={false}
            />

            <style jsx>{`
                .ora-page {
                    min-height: calc(100vh - 72px);
                    color: #e8f0ea;
                    background: #0c1016;
                }
                .ora-status {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: #a8b8b0;
                    font-size: 1.05rem;
                }
                .ora-banner {
                    margin: 0.5rem 0.75rem 0;
                    padding: 0.55rem 0.75rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 200, 80, 0.35);
                    background: rgba(60, 40, 10, 0.55);
                    color: #ffd27a;
                    font-size: 0.85rem;
                }
                .ora-gate {
                    max-width: 440px;
                    margin: 3rem auto;
                    padding: 1.5rem;
                    border-radius: 14px;
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    background: rgba(12, 16, 22, 0.96);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    align-items: center;
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
                }
                .ora-kicker {
                    margin: 0;
                    font-size: 0.7rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #39ff14;
                    font-weight: 800;
                }
                .ora-gate h1 {
                    margin: 0;
                    font-size: 1.45rem;
                    color: #e8f0ea;
                }
                .ora-gate p {
                    margin: 0;
                    color: #a8b8b0;
                    line-height: 1.45;
                }
                .ora-room-id {
                    font-size: 0.78rem !important;
                    word-break: break-all;
                }
                .ora-room-id code {
                    color: #39ff14;
                }
                .ora-primary {
                    border: none;
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                    color: #061008;
                    font-weight: 800;
                    padding: 0.7rem 1.2rem;
                    border-radius: 10px;
                    cursor: pointer;
                    width: 100%;
                    max-width: 280px;
                }
                .ora-secondary {
                    border: 1px solid rgba(57, 255, 20, 0.35);
                    background: transparent;
                    color: #39ff14;
                    font-weight: 700;
                    padding: 0.6rem 1.1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    width: 100%;
                    max-width: 280px;
                }
                .ora-gate :global(a) {
                    color: #39ff14;
                }
            `}</style>
            <style jsx global>{`
                body.ora-body {
                    background: #0c1016 !important;
                    background-image: none !important;
                    color: #e8f0ea;
                    min-height: 100vh;
                }
            `}</style>
        </>
    );
}
