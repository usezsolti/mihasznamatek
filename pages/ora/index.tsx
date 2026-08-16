import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthModal from '../../components/AuthModal';
import { isAdminEmail } from '../../utils/admin';
import { useLang } from '../../utils/i18n';
import { createLessonRoom, lessonJoinPath } from '../../utils/lessonRoom';

type RecentRoom = { id: string; title: string; at: number };

const RECENT_KEY = 'miha_recent_ora_rooms';

function readRecent(): RecentRoom[] {
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        const list = raw ? (JSON.parse(raw) as RecentRoom[]) : [];
        return Array.isArray(list) ? list.slice(0, 8) : [];
    } catch {
        return [];
    }
}

function pushRecent(room: RecentRoom) {
    try {
        const next = [room, ...readRecent().filter((r) => r.id !== room.id)].slice(0, 8);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
        /* ignore */
    }
}

function parseRoomInput(raw: string): string {
    const s = String(raw || '').trim();
    if (!s) return '';
    try {
        if (s.includes('/ora/')) {
            const u = s.startsWith('http') ? new URL(s) : new URL(s, 'https://local');
            const parts = u.pathname.split('/').filter(Boolean);
            const i = parts.indexOf('ora');
            if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
        }
    } catch {
        /* fall through */
    }
    const m = s.match(/ora\/([^/?#]+)/i);
    if (m?.[1]) return decodeURIComponent(m[1]);
    return s.replace(/^\/+/, '').split(/[/?#]/)[0];
}

async function waitForFirebase(maxAttempts = 50): Promise<any | null> {
    for (let i = 0; i < maxAttempts; i++) {
        const firebase = (window as any).firebase;
        if (firebase?.apps?.length > 0 && firebase.auth) return firebase;
        await new Promise((r) => setTimeout(r, 100));
    }
    return (window as any).firebase?.auth ? (window as any).firebase : null;
}

/** /ora hub — tanár: új óra; diák: kód/link */
export default function OraHubPage() {
    const router = useRouter();
    const { t, lang } = useLang();
    const [ready, setReady] = useState(false);
    const [uid, setUid] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [joinRaw, setJoinRaw] = useState('');
    const [recent, setRecent] = useState<RecentRoom[]>([]);
    const [authOpen, setAuthOpen] = useState(false);

    const isTeacher = isAdminEmail(email);

    useEffect(() => {
        document.body.classList.add('ora-body');
        setRecent(readRecent());
        return () => document.body.classList.remove('ora-body');
    }, []);

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
                    setEmail(String(user.email || ''));
                } else {
                    setUid(null);
                    setEmail('');
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

    const startQuickLesson = async () => {
        if (!uid) {
            setAuthOpen(true);
            return;
        }
        setBusy(true);
        setErr('');
        try {
            const title =
                lang === 'en'
                    ? `Math lesson · ${new Date().toLocaleString('en-GB', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                      })}`
                    : `Matek óra · ${new Date().toLocaleString('hu-HU', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                      })}`;
            const { room } = await createLessonRoom({ title, createdBy: uid });
            pushRecent({ id: room.id, title: room.title, at: Date.now() });
            await router.push(lessonJoinPath(room.id));
        } catch (e: any) {
            setErr(String(e?.message || e).slice(0, 180));
        } finally {
            setBusy(false);
        }
    };

    const joinLesson = async () => {
        const id = parseRoomInput(joinRaw);
        if (!id) {
            setErr(t('ora.joinHint'));
            return;
        }
        if (!uid) {
            setAuthOpen(true);
            return;
        }
        setErr('');
        pushRecent({ id, title: id, at: Date.now() });
        await router.push(lessonJoinPath(id));
    };

    return (
        <>
            <Head>
                <title>
                    {t('ora.hubTitle')} | Mihaszna Matek
                </title>
            </Head>
            <div className="ora-hub">
                {!ready ? (
                    <p className="ora-hub-status">{t('common.loading')}</p>
                ) : !uid ? (
                    <div className="ora-hub-card">
                        <p className="ora-hub-kicker">MIHASZNA MATEK</p>
                        <h1>{t('ora.hubTitle')}</h1>
                        <p>{t('ora.hubLoginBody')}</p>
                        <button type="button" className="ora-hub-primary" onClick={() => setAuthOpen(true)}>
                            {t('auth.login')}
                        </button>
                        <Link href="/dashboard">{t('ora.backDashboard')}</Link>
                    </div>
                ) : (
                    <div className="ora-hub-layout">
                        <section className="ora-hub-hero">
                            <p className="ora-hub-kicker">{t('ora.hubTitle')}</p>
                            <h1>{isTeacher ? t('ora.teacherHero') : t('ora.studentHero')}</h1>
                            <p className="ora-hub-lead">
                                {isTeacher ? t('ora.teacherBody') : t('ora.studentBody')}
                            </p>
                            {isTeacher ? (
                                <div className="ora-hub-actions">
                                    <button
                                        type="button"
                                        className="ora-hub-primary"
                                        disabled={busy}
                                        onClick={() => void startQuickLesson()}
                                    >
                                        {busy ? t('common.loading') : t('ora.startLesson')}
                                    </button>
                                    <Link href="/dashboard?tab=admin" className="ora-hub-secondary">
                                        {t('ora.openAdmin')}
                                    </Link>
                                </div>
                            ) : null}
                            {err ? <p className="ora-hub-err">{err}</p> : null}
                        </section>

                        <section className="ora-hub-join">
                            <h2>{t('ora.joinCode')}</h2>
                            <p className="ora-hub-join-hint">{t('ora.joinHint')}</p>
                            <div className="ora-hub-join-row">
                                <input
                                    value={joinRaw}
                                    onChange={(e) => setJoinRaw(e.target.value)}
                                    placeholder={t('ora.joinCodePh')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            void joinLesson();
                                        }
                                    }}
                                />
                                <button type="button" className="ora-hub-primary" onClick={() => void joinLesson()}>
                                    {t('ora.joinGo')}
                                </button>
                            </div>
                        </section>

                        <section className="ora-hub-how">
                            <h2>{t('ora.howTitle')}</h2>
                            <ol>
                                <li>{t('ora.how1')}</li>
                                <li>{t('ora.how2')}</li>
                                <li>{t('ora.how3')}</li>
                            </ol>
                        </section>

                        {recent.length > 0 ? (
                            <section className="ora-hub-recent">
                                <h2>{t('ora.recent')}</h2>
                                <ul>
                                    {recent.map((r) => (
                                        <li key={r.id}>
                                            <Link href={lessonJoinPath(r.id)}>
                                                <strong>{r.title}</strong>
                                                <span>
                                                    {new Date(r.at).toLocaleString(
                                                        lang === 'en' ? 'en-GB' : 'hu-HU',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ) : null}

                        <p className="ora-hub-foot">
                            <Link href="/dashboard">{t('ora.backDashboard')}</Link>
                        </p>
                    </div>
                )}
            </div>

            <AuthModal
                isOpen={authOpen}
                onClose={() => setAuthOpen(false)}
                initialMode="login"
                redirectTo={false}
            />

            <style jsx>{`
                .ora-hub {
                    min-height: calc(100vh - 72px);
                    background: radial-gradient(circle at top, rgba(57, 255, 20, 0.08), transparent 42%),
                        #0b100e;
                    color: #eef7f0;
                    padding: 1.25rem;
                }
                .ora-hub-status {
                    text-align: center;
                    padding: 4rem 1rem;
                    color: #b7cfc0;
                }
                .ora-hub-card,
                .ora-hub-layout {
                    max-width: 720px;
                    margin: 1.25rem auto 0;
                }
                .ora-hub-card {
                    text-align: center;
                    padding: 1.75rem 1.25rem;
                    border-radius: 18px;
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    background: rgba(12, 18, 16, 0.96);
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    align-items: center;
                }
                .ora-hub-layout {
                    display: grid;
                    gap: 0.85rem;
                }
                .ora-hub-hero,
                .ora-hub-join,
                .ora-hub-how,
                .ora-hub-recent {
                    padding: 1.25rem 1.2rem;
                    border-radius: 16px;
                    border: 1px solid rgba(57, 255, 20, 0.22);
                    background: linear-gradient(145deg, rgba(16, 28, 22, 0.98), rgba(10, 14, 18, 0.96));
                }
                .ora-hub-join,
                .ora-hub-how,
                .ora-hub-recent {
                    border-color: rgba(255, 255, 255, 0.08);
                    background: rgba(0, 0, 0, 0.28);
                }
                .ora-hub-kicker {
                    margin: 0 0 0.35rem;
                    font-size: 0.72rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #39ff14;
                    font-weight: 800;
                }
                .ora-hub-hero h1,
                .ora-hub-card h1 {
                    margin: 0;
                    font-size: clamp(1.55rem, 3vw, 2.05rem);
                    line-height: 1.15;
                }
                .ora-hub-lead,
                .ora-hub-card p,
                .ora-hub-join-hint {
                    margin: 0.55rem 0 0;
                    color: #b7cfc0;
                    line-height: 1.5;
                    max-width: 36rem;
                }
                .ora-hub-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.55rem;
                    margin-top: 1rem;
                }
                .ora-hub-join h2,
                .ora-hub-how h2,
                .ora-hub-recent h2 {
                    margin: 0;
                    font-size: 1rem;
                }
                .ora-hub-join-row {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                    flex-wrap: wrap;
                }
                .ora-hub-join-row input {
                    flex: 1;
                    min-width: 200px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: #0a0f0c;
                    color: #fff;
                    padding: 0.7rem 0.85rem;
                }
                .ora-hub-how ol {
                    margin: 0.65rem 0 0;
                    padding-left: 1.15rem;
                    color: #b7cfc0;
                    line-height: 1.55;
                    display: grid;
                    gap: 0.35rem;
                }
                .ora-hub-primary,
                .ora-hub-secondary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    font-weight: 800;
                    padding: 0.7rem 1.1rem;
                    text-decoration: none;
                    cursor: pointer;
                }
                .ora-hub-primary {
                    border: none;
                    color: #061008;
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                    box-shadow: 0 8px 22px rgba(57, 255, 20, 0.22);
                }
                .ora-hub-primary:disabled {
                    opacity: 0.6;
                    cursor: wait;
                }
                .ora-hub-secondary {
                    border: 1px solid rgba(57, 255, 20, 0.4);
                    color: #39ff14;
                    background: transparent;
                }
                .ora-hub-err {
                    margin: 0.85rem 0 0;
                    color: #ffb4b4;
                    font-size: 0.9rem;
                }
                .ora-hub-recent ul {
                    list-style: none;
                    margin: 0.7rem 0 0;
                    padding: 0;
                    display: grid;
                    gap: 0.4rem;
                }
                .ora-hub-recent a {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.75rem;
                    padding: 0.65rem 0.75rem;
                    border-radius: 12px;
                    text-decoration: none;
                    color: inherit;
                    background: rgba(57, 255, 20, 0.06);
                    border: 1px solid rgba(57, 255, 20, 0.18);
                }
                .ora-hub-recent a:hover {
                    border-color: rgba(57, 255, 20, 0.45);
                }
                .ora-hub-recent span {
                    color: #9eb5a8;
                    font-size: 0.82rem;
                    white-space: nowrap;
                }
                .ora-hub-foot {
                    margin: 0.25rem 0 0;
                    text-align: center;
                }
                .ora-hub-foot a,
                .ora-hub-card :global(a) {
                    color: #39ff14;
                }
            `}</style>
            <style jsx global>{`
                body.ora-body {
                    background: #0b100e !important;
                    background-image: none !important;
                    color: #eef7f0;
                    min-height: 100vh;
                }
            `}</style>
        </>
    );
}
