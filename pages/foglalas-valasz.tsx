import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';

export default function FoglalasValasz() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState('');
    const [ok, setOk] = useState(false);

    const id = String(router.query.id || '');
    const email = String(router.query.email || '');
    const name = String(router.query.name || '');
    const date = String(router.query.date || '');
    const times = String(router.query.times || '');
    const token = String(router.query.token || '');

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
            setMsg('Elfogadva. Zsolt kapott erről emailt.');
        } catch {
            setMsg('Hálózati hiba.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Head>
                <title>Időpont elfogadása – Mihaszna Matek</title>
            </Head>
            <div className="wrap">
                <h1>Javasolt időpont</h1>
                <p>
                    {name ? `${name}, ` : ''}ez az időpont lett javasolva:
                </p>
                <p className="slot">
                    <strong>{date}</strong>
                    <br />
                    {times.split(',').join(', ')}
                </p>
                {ok ? (
                    <p className="ok">{msg}</p>
                ) : (
                    <>
                        <button type="button" disabled={busy || !id || !token} onClick={() => void accept()}>
                            {busy ? 'Küldés…' : 'Elfogadom ezt az időpontot'}
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
                }
                .slot {
                    font-size: 1.2rem;
                    line-height: 1.5;
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
