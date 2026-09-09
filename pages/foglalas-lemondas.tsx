import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import { CANCEL_POLICY_HU } from '../utils/booking/types';

function q(v: string | string[] | undefined): string {
    return String(Array.isArray(v) ? v[0] : v || '');
}

function isLateCancel(date: string, times: string): boolean {
    const hm = times.split(',')[0]?.trim() || '00:00';
    const start = Date.parse(`${date}T${hm}:00`);
    if (!Number.isFinite(start)) return false;
    return start - Date.now() < 24 * 60 * 60 * 1000;
}

export default function FoglalasLemondas() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState('');
    const [ok, setOk] = useState(false);
    const [late, setLate] = useState(false);

    const id = q(router.query.id);
    const email = q(router.query.email);
    const name = q(router.query.name);
    const date = q(router.query.date);
    const times = q(router.query.times);
    const token = q(router.query.token);

    const latePreview = useMemo(() => isLateCancel(date, times), [date, times]);

    const cancel = async () => {
        setBusy(true);
        setMsg('');
        try {
            const res = await fetch('/api/booking-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'student_cancel',
                    id,
                    email,
                    name,
                    date,
                    times: times.split(','),
                    token,
                }),
            });
            const data = await res.json();
            if (!res.ok || data?.ok === false) {
                setMsg(data?.error || 'Nem sikerült lemondani.');
                return;
            }
            setOk(true);
            const wasLate = Boolean(data?.data?.lateCancel) || latePreview;
            setLate(wasLate);
            setMsg(
                data?.data?.already
                    ? 'Ez a foglalás már le volt mondva.'
                    : wasLate
                      ? 'Lemondva. Mivel 24 órán belül történt, a teljes összeget ki kell fizetni.'
                      : 'Lemondva. Zsolt kapott erről e-mailt.'
            );
        } catch {
            setMsg('Hálózati hiba.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Head>
                <title>Foglalás lemondása – Mihaszna Matek</title>
            </Head>
            <div className="wrap">
                <h1>Foglalás lemondása</h1>
                <p>{name ? `${name}, ` : ''}ezt az órát mondanád le:</p>
                <p className="slot">
                    <strong>{date}</strong>
                    <br />
                    {times.split(',').filter(Boolean).join(', ')}
                </p>
                <p className="policy">{CANCEL_POLICY_HU}</p>
                {ok ? (
                    <p className={late ? 'warn' : 'ok'}>{msg}</p>
                ) : (
                    <>
                        {latePreview ? (
                            <p className="warn">Most 24 órán belül vagy az órához — lemondás esetén a teljes díj jár.</p>
                        ) : null}
                        <button type="button" disabled={busy || !id || !token} onClick={() => void cancel()}>
                            {busy ? 'Küldés…' : 'Lemondom az órát'}
                        </button>
                        {msg ? <p className="err">{msg}</p> : null}
                    </>
                )}
            </div>
            <style jsx>{`
                .wrap {
                    max-width: 480px;
                    margin: 3rem auto;
                    padding: 1.5rem;
                    color: #e8f0ea;
                    font-family: system-ui, sans-serif;
                }
                .slot {
                    font-size: 1.2rem;
                    line-height: 1.5;
                }
                .policy {
                    padding: 0.85rem 1rem;
                    background: #2a2410;
                    border-radius: 10px;
                    color: #ffe8b3;
                    line-height: 1.45;
                }
                button {
                    background: #ff8a8a;
                    color: #2a0808;
                    border: 0;
                    border-radius: 10px;
                    padding: 0.75rem 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                }
                button:disabled {
                    opacity: 0.6;
                    cursor: default;
                }
                .ok {
                    color: #39ff14;
                }
                .warn {
                    color: #ffd28a;
                }
                .err {
                    color: #ff8a8a;
                }
            `}</style>
        </>
    );
}
