import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

function q(v: string | string[] | undefined): string {
    return String(Array.isArray(v) ? v[0] : v || '');
}

function toHm(raw: string): string {
    const m = String(raw || '').match(/^(\d{2}:\d{2})/);
    return m ? m[1] : raw;
}

export default function FoglalasValasz() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState('');
    const [ok, setOk] = useState(false);
    const [counterDate, setCounterDate] = useState('');
    const [counterTime, setCounterTime] = useState('');

    const id = q(router.query.id);
    const email = q(router.query.email);
    const name = q(router.query.name);
    const date = q(router.query.date);
    const times = q(router.query.times);
    const token = q(router.query.token);

    useEffect(() => {
        if (!router.isReady) return;
        setCounterDate((prev) => prev || date);
        setCounterTime((prev) => prev || toHm(times.split(',')[0] || '17:00'));
    }, [router.isReady, date, times]);

    const accept = async () => {
        setBusy(true);
        setMsg('');
        try {
            const res = await fetch('/api/booking-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'accept',
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
                setMsg(data?.error || 'Nem sikerült elfogadni.');
                return;
            }
            setOk(true);
            setMsg('Elfogadva. Zsolt kapott erről e-mailt.');
        } catch {
            setMsg('Hálózati hiba.');
        } finally {
            setBusy(false);
        }
    };

    const counter = async () => {
        const nextDate = counterDate;
        const nextTime = toHm(counterTime);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(nextDate) || !/^\d{2}:\d{2}$/.test(nextTime)) {
            setMsg('Adj meg dátumot és időt.');
            return;
        }
        setBusy(true);
        setMsg('');
        try {
            const res = await fetch('/api/booking-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'student_counter',
                    id,
                    email,
                    name,
                    offeredDate: date,
                    offeredTimes: times.split(','),
                    newDate: nextDate,
                    newTimes: [nextTime],
                    token,
                }),
            });
            const data = await res.json();
            if (!res.ok || data?.ok === false) {
                setMsg(data?.error || 'Nem sikerült elküldeni a kérést.');
                return;
            }
            setOk(true);
            setMsg('Elküldve. Zsolt kap e-mailt az új időpontról. Ha az sem jó, ő javasol másikat.');
        } catch {
            setMsg('Hálózati hiba.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Head>
                <title>Időpont egyeztetés – Mihaszna Matek</title>
            </Head>
            <div className="wrap">
                <h1>Javasolt időpont</h1>
                <p>{name ? `${name}, ` : ''}ezt az időpontot kaptad:</p>
                <p className="slot">
                    <strong>{date}</strong>
                    <br />
                    {times.split(',').filter(Boolean).join(', ')}
                </p>
                {ok ? (
                    <p className="ok">{msg}</p>
                ) : (
                    <>
                        <button type="button" disabled={busy || !id || !token} onClick={() => void accept()}>
                            {busy ? 'Küldés…' : 'Elfogadom ezt az időpontot'}
                        </button>
                        <div className="alt">
                            <p>Ha ez nem jó, kérhetsz másikat:</p>
                            <label>
                                Dátum
                                <input
                                    type="date"
                                    value={counterDate}
                                    onChange={(e) => setCounterDate(e.target.value)}
                                />
                            </label>
                            <label>
                                Idő
                                <input
                                    type="time"
                                    value={counterTime}
                                    onChange={(e) => setCounterTime(toHm(e.target.value))}
                                />
                            </label>
                            <button
                                type="button"
                                className="secondary"
                                disabled={busy || !id || !token}
                                onClick={() => void counter()}
                            >
                                {busy ? 'Küldés…' : 'Ezt kérem helyette'}
                            </button>
                        </div>
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
                .alt {
                    margin-top: 1.75rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid #2a4a32;
                }
                label {
                    display: block;
                    margin: 0.85rem 0;
                    font-weight: 600;
                }
                input {
                    display: block;
                    margin-top: 0.35rem;
                    width: 100%;
                    padding: 0.55rem 0.7rem;
                    border-radius: 8px;
                    border: 1px solid #2a4a32;
                    background: #0d1810;
                    color: #e8f0ea;
                }
                button {
                    background: #39ff14;
                    color: #061008;
                    border: 0;
                    border-radius: 10px;
                    padding: 0.75rem 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                }
                button.secondary {
                    background: transparent;
                    color: #39ff14;
                    border: 2px solid #39ff14;
                }
                button:disabled {
                    opacity: 0.6;
                    cursor: default;
                }
                .ok {
                    color: #39ff14;
                }
                .err {
                    color: #ff8a8a;
                }
            `}</style>
        </>
    );
}
