import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { agentDebugLog } from '../utils/agentDebugLog';

function q(v: string | string[] | undefined): string {
    return String(Array.isArray(v) ? v[0] : v || '');
}

function toHm(raw: string): string {
    const m = raw.match(/^(\d{2}:\d{2})/);
    return m ? m[1] : raw;
}

export default function FoglalasDontes() {
    const router = useRouter();
    const action = q(router.query.action);
    const id = q(router.query.id);
    const email = q(router.query.email);
    const name = q(router.query.name);
    const date = q(router.query.date);
    const times = q(router.query.times);
    const token = q(router.query.token);
    const lessonType = q(router.query.lessonType) === 'personal' ? 'personal' : q(router.query.lessonType) === 'online' ? 'online' : '';

    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [already, setAlready] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [proposedDate, setProposedDate] = useState('');
    const [proposedTime, setProposedTime] = useState('');
    const approveStarted = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;
        setProposedDate((prev) => prev || date);
        setProposedTime((prev) => prev || toHm(times.split(',')[0] || '17:00'));
    }, [router.isReady, date, times]);

    useEffect(() => {
        if (!router.isReady || action !== 'approve' || !id || !token) return;
        const lockKey = `booking-approve:${id}:${token}`;
        if (approveStarted.current) return;
        if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(lockKey) === 'done') {
            setDone(true);
            setAlready(true);
            setMsg('Ez a foglalás már jóvá volt hagyva.');
            return;
        }
        approveStarted.current = true;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'foglalas-dontes.tsx:approve',
            message: 'teacher approve POST',
            data: { lessonTypeFromUrl: lessonType, hasLessonType: Boolean(lessonType) },
            runId: 'lesson-type-email',
        });
        // #endregion
        (async () => {
            setBusy(true);
            setErr('');
            try {
                const res = await fetch('/api/booking-proposal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'admin_approve',
                        id,
                        email,
                        name,
                        date,
                        times: times.split(','),
                        token,
                        lessonType: lessonType || undefined,
                    }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || data?.ok === false) {
                    approveStarted.current = false;
                    setErr(data?.error || 'Nem sikerült jóváhagyni.');
                    return;
                }
                try {
                    sessionStorage.setItem(lockKey, 'done');
                } catch {
                    /* ignore */
                }
                const wasAlready = Boolean(data?.data?.already);
                setAlready(wasAlready);
                setDone(true);
                setMsg(
                    wasAlready
                        ? 'Ez a foglalás már jóvá volt hagyva.'
                        : 'Elfogadva. A diák kapott megerősítő e-mailt.'
                );
            } catch {
                approveStarted.current = false;
                setErr('Hálózati hiba.');
            } finally {
                setBusy(false);
            }
        })();
    }, [router.isReady, action, id, token, email, name, date, times, lessonType]);

    const propose = async () => {
        const nextDate = proposedDate;
        const nextTime = toHm(proposedTime);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(nextDate) || !/^\d{2}:\d{2}$/.test(nextTime)) {
            setErr('Adj meg dátumot és időt.');
            return;
        }
        setBusy(true);
        setErr('');
        try {
            const res = await fetch('/api/booking-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'admin_propose',
                    id,
                    email,
                    name,
                    originalDate: date,
                    originalTimes: times.split(','),
                    proposedDate: nextDate,
                    proposedTimes: [nextTime],
                    token,
                    lessonType: lessonType || undefined,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data?.ok === false) {
                setErr(data?.error || 'A javaslat nem ment ki.');
                return;
            }
            setDone(true);
            setMsg('A diáknak kiment a másik időpont. Ha elfogadja, kapsz e-mailt.');
        } catch {
            setErr('Hálózati hiba.');
        } finally {
            setBusy(false);
        }
    };

    const title = action === 'propose' ? 'Másik időpont' : 'Foglalás elfogadása';

    return (
        <>
            <Head>
                <title>{title} – Mihaszna Matek</title>
            </Head>
            <div className="wrap">
                <h1>{title}</h1>
                <p>
                    {name || 'Diák'} · {email}
                </p>
                <p className="slot">
                    Kért időpont: <strong>{date}</strong>
                    <br />
                    {times.split(',').filter(Boolean).join(', ')}
                    {lessonType ? (
                        <>
                            <br />
                            Típus: {lessonType === 'personal' ? 'Személyes (Fót)' : 'Online'}
                        </>
                    ) : null}
                </p>

                {action === 'propose' && !done ? (
                    <>
                        <label>
                            Új dátum
                            <input
                                type="date"
                                value={proposedDate}
                                onChange={(e) => setProposedDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Új idő
                            <input
                                type="time"
                                value={proposedTime}
                                onChange={(e) => setProposedTime(toHm(e.target.value))}
                            />
                        </label>
                        <button type="button" disabled={busy || !id || !token} onClick={() => void propose()}>
                            {busy ? 'Küldés…' : 'Ezt javaslom a diáknak'}
                        </button>
                    </>
                ) : null}

                {action === 'approve' && busy && !done ? <p>Jóváhagyás…</p> : null}
                {done ? <p className={already ? 'info' : 'ok'}>{msg}</p> : null}
                {err ? <p className="err">{err}</p> : null}
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
                    font-size: 1.1rem;
                    line-height: 1.5;
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
                    margin-top: 0.5rem;
                }
                button:disabled {
                    opacity: 0.6;
                    cursor: default;
                }
                .ok {
                    color: #39ff14;
                }
                .info {
                    color: #c8e6c9;
                }
                .err {
                    color: #ff8a8a;
                }
            `}</style>
        </>
    );
}
