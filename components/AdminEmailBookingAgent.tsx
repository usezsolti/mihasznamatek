import { useCallback, useEffect, useState } from 'react';
import { isAdminEmail } from '../utils/admin';
import { apiGetAuth, apiPostAuth } from '../utils/apiClient';
import type { EmailBookingThread } from '../utils/emailBookingThread';
import { waitForFirebase } from '../utils/firebaseReady';

type AgentState = {
    enabled: boolean;
    imapReady: boolean;
    threads: EmailBookingThread[];
};

export default function AdminEmailBookingAgent() {
    const [allowed, setAllowed] = useState(false);
    const [data, setData] = useState<AgentState | null>(null);
    const [err, setErr] = useState('');
    const [busy, setBusy] = useState('');

    useEffect(() => {
        let cancelled = false;
        let unsub: (() => void) | undefined;
        (async () => {
            const firebase = await waitForFirebase();
            if (cancelled || !firebase?.auth) return;
            unsub = firebase.auth().onAuthStateChanged((user: { email?: string } | null) => {
                if (!cancelled) setAllowed(isAdminEmail(user?.email));
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

    const load = useCallback(async () => {
        const res = await apiGetAuth<AgentState>('/api/admin/email-booking-agent');
        if (!res.ok) {
            setErr(res.error || 'Betöltés sikertelen');
            return;
        }
        setErr('');
        setData(res.data);
    }, []);

    useEffect(() => {
        if (!allowed) return;
        void load();
    }, [allowed, load]);

    const act = async (action: string, extra?: Record<string, string>) => {
        setBusy(action);
        try {
            const res = await apiPostAuth(`/api/admin/email-booking-agent`, { action, ...extra });
            if (!res.ok) {
                alert(res.error || 'Sikertelen');
                return;
            }
            if (action === 'run') {
                const r = res.data as { drafts?: number; scanned?: number; errors?: string[] };
                alert(
                    `Átvizsgálva: ${r.scanned ?? 0}, piszkozat: ${r.drafts ?? 0}` +
                        (r.errors?.length ? `\n${r.errors.slice(0, 4).join('\n')}` : '')
                );
            }
            await load();
        } finally {
            setBusy('');
        }
    };

    if (!allowed) return null;

    const enabled = !!data?.enabled;
    const toggling = busy === 'enable' || busy === 'disable';

    return (
        <div className="mm-agent">
            <div className="mm-agent-head">
                <div>
                    <p className="mm-agent-kicker">Tanári automata</p>
                    <h2 className="mm-agent-title">E-mail ügynök</h2>
                    <p className="mm-agent-sub">
                        Foglalós levelekre Gmail-piszkozatot ír, egymás mellé pakolt sávokkal. Nem
                        küld magától — te nyomod el a piszkozatot.
                    </p>
                </div>
                <button
                    type="button"
                    className={`mm-agent-switch ${enabled ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={enabled}
                    aria-label={enabled ? 'E-mail ügynök kikapcsolása' : 'E-mail ügynök bekapcsolása'}
                    disabled={!!busy || !data}
                    onClick={() => void act(enabled ? 'disable' : 'enable')}
                >
                    <span className="mm-agent-switch-track">
                        <span className="mm-agent-switch-knob" />
                    </span>
                    <span className="mm-agent-switch-text">
                        {toggling ? '…' : enabled ? 'Bekapcsolva' : 'Bekapcsolás'}
                    </span>
                </button>
            </div>

            <div className="mm-agent-meta">
                <span className={`mm-agent-pill ${data?.imapReady ? 'ok' : 'bad'}`}>
                    IMAP {data?.imapReady ? 'kész' : 'nincs Gmail jelszó'}
                </span>
                <button
                    type="button"
                    className="mm-agent-run"
                    disabled={!!busy || !enabled}
                    onClick={() => void act('run')}
                >
                    {busy === 'run' ? 'Futtatás…' : 'Futtasd most'}
                </button>
            </div>
            {err ? <div className="mm-agent-err">{err}</div> : null}

            {(data?.threads || []).length > 0 ? (
                <ul className="mm-agent-threads">
                    {data!.threads.slice(0, 12).map((t) => (
                        <li key={t.id}>
                            <div>
                                <strong>{t.fromName || t.fromEmail}</strong> · {t.status}
                                {t.holdDate ? ` · félretéve ${t.holdDate} ${t.holdTime}` : ''}
                            </div>
                            <div className="mm-agent-subject">{t.subject}</div>
                            {t.lastDraftText ? (
                                <pre>{t.lastDraftText.slice(0, 420)}</pre>
                            ) : null}
                            {t.bookingId ? (
                                <button
                                    type="button"
                                    className="mm-agent-run"
                                    style={{ marginTop: 8 }}
                                    onClick={() => void act('release', { threadId: t.id })}
                                >
                                    Sáv feloldása
                                </button>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mm-agent-empty">Még nincs feldolgozott szál.</p>
            )}

            <style jsx>{`
                .mm-agent {
                    background: linear-gradient(180deg, rgba(18, 28, 22, 0.96), rgba(12, 16, 22, 0.94));
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    border-radius: 16px;
                    padding: 1.05rem 1.15rem 1.15rem;
                    margin: 0 0 1rem;
                    color: #d7e6dc;
                    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
                }
                .mm-agent-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                    align-items: flex-start;
                }
                .mm-agent-kicker {
                    margin: 0;
                    font-size: 0.68rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #39ff14;
                    font-weight: 800;
                }
                .mm-agent-title {
                    margin: 0.2rem 0 0;
                    font-size: 1.28rem;
                    font-weight: 800;
                    color: #e8f0ea;
                }
                .mm-agent-sub {
                    margin: 0.4rem 0 0;
                    max-width: 38rem;
                    line-height: 1.45;
                    opacity: 0.86;
                    font-size: 0.92rem;
                }
                .mm-agent-switch {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.7rem;
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    background: rgba(8, 12, 16, 0.72);
                    color: #e8f0ea;
                    border-radius: 999px;
                    padding: 0.45rem 0.85rem 0.45rem 0.45rem;
                    cursor: pointer;
                    font-weight: 800;
                    min-width: 11.5rem;
                }
                .mm-agent-switch:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .mm-agent-switch.is-on {
                    border-color: rgba(57, 255, 20, 0.7);
                    background: rgba(57, 255, 20, 0.12);
                    box-shadow: 0 0 18px rgba(57, 255, 20, 0.18);
                }
                .mm-agent-switch-track {
                    width: 52px;
                    height: 30px;
                    border-radius: 999px;
                    background: rgba(255, 105, 180, 0.28);
                    position: relative;
                    flex-shrink: 0;
                    transition: background 0.2s ease;
                }
                .mm-agent-switch.is-on .mm-agent-switch-track {
                    background: #39ff14;
                }
                .mm-agent-switch-knob {
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
                    transition: transform 0.2s ease;
                }
                .mm-agent-switch.is-on .mm-agent-switch-knob {
                    transform: translateX(22px);
                }
                .mm-agent-switch-text {
                    font-size: 0.92rem;
                }
                .mm-agent-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.55rem;
                    align-items: center;
                    margin-top: 0.95rem;
                }
                .mm-agent-pill {
                    border-radius: 999px;
                    padding: 0.28rem 0.7rem;
                    font-size: 0.8rem;
                    font-weight: 700;
                }
                .mm-agent-pill.ok {
                    color: #39ff14;
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid rgba(57, 255, 20, 0.35);
                }
                .mm-agent-pill.bad {
                    color: #ff9ec8;
                    background: rgba(255, 105, 180, 0.12);
                    border: 1px solid rgba(255, 105, 180, 0.35);
                }
                .mm-agent-run {
                    border: 1px solid rgba(57, 255, 20, 0.4);
                    background: transparent;
                    color: #39ff14;
                    border-radius: 10px;
                    padding: 0.4rem 0.8rem;
                    font-weight: 800;
                    cursor: pointer;
                }
                .mm-agent-run:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .mm-agent-err {
                    color: #ff9ec8;
                    margin-top: 0.65rem;
                }
                .mm-agent-threads {
                    margin: 0.95rem 0 0;
                    padding: 0;
                    list-style: none;
                }
                .mm-agent-threads li {
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 0.7rem 0;
                }
                .mm-agent-subject {
                    opacity: 0.8;
                    font-size: 0.82rem;
                    margin-top: 0.15rem;
                }
                .mm-agent-threads pre {
                    white-space: pre-wrap;
                    font-size: 0.78rem;
                    margin: 0.4rem 0 0;
                    opacity: 0.9;
                }
                .mm-agent-empty {
                    margin: 0.85rem 0 0;
                    opacity: 0.72;
                }
            `}</style>
        </div>
    );
}
