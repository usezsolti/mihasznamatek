import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { apiGetAuth, apiPostAuth } from '../utils/apiClient';
import type { EmailBookingThread } from '../utils/emailBookingThread';

type AgentState = {
    enabled: boolean;
    imapReady: boolean;
    threads: EmailBookingThread[];
};

const card: CSSProperties = {
    background: 'rgba(18, 24, 33, 0.9)',
    border: '1px solid rgba(57,255,20,0.25)',
    borderRadius: 12,
    padding: '0.75rem 1rem',
    margin: '0 0 1rem',
    color: '#ddd',
    fontSize: '0.9rem',
};

export default function AdminEmailBookingAgent() {
    const [data, setData] = useState<AgentState | null>(null);
    const [err, setErr] = useState('');
    const [busy, setBusy] = useState('');

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
        void load();
    }, [load]);

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

    return (
        <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                    <strong>E-mail ügynök</strong>
                    <div style={{ marginTop: 4, opacity: 0.85 }}>
                        Foglalós levelekre Gmail-piszkozat (tömbösített sávok). Nem küld magától.
                    </div>
                    {data && (
                        <div style={{ marginTop: 6 }}>
                            Állapot:{' '}
                            <strong style={{ color: data.enabled ? '#39ff14' : '#ff69b4' }}>
                                {data.enabled ? 'bekapcsolva' : 'ki van kapcsolva'}
                            </strong>
                            {' · '}
                            IMAP:{' '}
                            <strong style={{ color: data.imapReady ? '#39ff14' : '#ff69b4' }}>
                                {data.imapReady ? 'kész' : 'nincs Gmail jelszó'}
                            </strong>
                        </div>
                    )}
                    {err ? <div style={{ color: '#ff69b4', marginTop: 6 }}>{err}</div> : null}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <button
                        type="button"
                        className="atc-inline-btn"
                        disabled={!!busy}
                        onClick={() => void act(data?.enabled ? 'disable' : 'enable')}
                    >
                        {data?.enabled ? 'Kikapcsolás' : 'Bekapcsolás'}
                    </button>
                    <button
                        type="button"
                        className="atc-inline-btn"
                        disabled={!!busy || !data?.enabled}
                        onClick={() => void act('run')}
                    >
                        {busy === 'run' ? '…' : 'Futtasd most'}
                    </button>
                </div>
            </div>
            {(data?.threads || []).length > 0 ? (
                <ul style={{ margin: '0.85rem 0 0', padding: 0, listStyle: 'none' }}>
                    {data!.threads.slice(0, 12).map((t) => (
                        <li
                            key={t.id}
                            style={{
                                borderTop: '1px solid rgba(255,255,255,0.08)',
                                padding: '0.55rem 0',
                            }}
                        >
                            <div>
                                <strong>{t.fromName || t.fromEmail}</strong> · {t.status}
                                {t.holdDate ? ` · félretéve ${t.holdDate} ${t.holdTime}` : ''}
                            </div>
                            <div style={{ opacity: 0.8, fontSize: '0.82rem' }}>{t.subject}</div>
                            {t.lastDraftText ? (
                                <pre
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        fontSize: '0.78rem',
                                        margin: '0.35rem 0 0',
                                        opacity: 0.9,
                                    }}
                                >
                                    {t.lastDraftText.slice(0, 420)}
                                </pre>
                            ) : null}
                            {t.bookingId ? (
                                <button
                                    type="button"
                                    className="atc-inline-btn"
                                    style={{ marginTop: 6 }}
                                    onClick={() => void act('release', { threadId: t.id })}
                                >
                                    Sáv feloldása
                                </button>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ margin: '0.7rem 0 0', opacity: 0.75 }}>Még nincs feldolgozott szál.</p>
            )}
        </div>
    );
}
