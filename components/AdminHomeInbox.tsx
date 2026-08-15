import { useCallback, useEffect, useState } from 'react';
import type { BookingPayload } from '../utils/bookingNotify';
import {
    findStudentForBooking,
    loadLessonDayBookings,
    type TeacherStudent,
} from '../utils/teacherConsole';

type Props = {
    students: TeacherStudent[];
    onOpenStudent: (uid: string) => void;
    onOpenSchedule: () => void;
    onOpenLessons: () => void;
};

export default function AdminHomeInbox({
    students,
    onOpenStudent,
    onOpenSchedule,
    onOpenLessons,
}: Props) {
    const [pending, setPending] = useState<BookingPayload[]>([]);
    const [todayLessons, setTodayLessons] = useState<Array<BookingPayload & { dateKey: string }>>(
        []
    );
    const [busyId, setBusyId] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const refresh = useCallback(async () => {
        try {
            const { loadPendingBookingsFromFirestore } = await import('../utils/bookingNotify');
            const [p, lessons] = await Promise.all([
                loadPendingBookingsFromFirestore(),
                loadLessonDayBookings(0),
            ]);
            setPending(p);
            setTodayLessons(lessons);
        } catch {
            /* soft */
        }
    }, []);

    useEffect(() => {
        void refresh();
        const t = setInterval(() => void refresh(), 30000);
        return () => clearInterval(t);
    }, [refresh]);

    const decide = async (booking: BookingPayload, status: 'approved' | 'rejected') => {
        setBusyId(booking.id);
        setMsg('');
        try {
            const { updateBookingStatus, sendBookingEmailFromClient } = await import(
                '../utils/bookingNotify'
            );
            const saved = await updateBookingStatus(booking.id, status, booking);
            if (!saved) {
                setMsg('Mentés sikertelen');
                return;
            }
            await sendBookingEmailFromClient(
                status === 'approved' ? 'student_approved' : 'student_rejected',
                { ...booking, status }
            );
            setPending((prev) => prev.filter((b) => b.id !== booking.id));
            setMsg(status === 'approved' ? 'Jóváhagyva + e-mail' : 'Elutasítva + e-mail');
            void refresh();
        } catch (err: any) {
            setMsg(String(err?.message || err).slice(0, 120));
        } finally {
            setBusyId(null);
        }
    };

    const needAttention = (() => {
        const byUid = new Map<
            string,
            { student: TeacherStudent; reasons: string[] }
        >();
        const add = (s: TeacherStudent | null | undefined, reason: string) => {
            if (!s?.uid) return;
            const cur = byUid.get(s.uid);
            if (cur) {
                if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
                return;
            }
            byUid.set(s.uid, { student: s, reasons: [reason] });
        };
        for (const b of pending) {
            add(findStudentForBooking(students, b), 'Függő foglalás');
        }
        for (const b of todayLessons) {
            add(findStudentForBooking(students, b), 'Mai óra');
        }
        return Array.from(byUid.values());
    })();

    return (
        <section className="ahi">
            <div className="ahi-head">
                <h2>Mai áttekintés</h2>
                <button type="button" className="ahi-link" onClick={() => void refresh()}>
                    Frissítés
                </button>
            </div>
            {msg ? <p className="ahi-msg">{msg}</p> : null}

            <div className="ahi-grid">
                <div className="ahi-card">
                    <div className="ahi-card-top">
                        <strong>Függő foglalások</strong>
                        <span>{pending.length}</span>
                    </div>
                    {pending.length === 0 ? (
                        <p className="ahi-empty">Nincs függő foglalás.</p>
                    ) : (
                        <ul>
                            {pending.slice(0, 5).map((b) => {
                                const st = findStudentForBooking(students, b);
                                return (
                                    <li key={b.id}>
                                        <div>
                                            <b>{b.customerName}</b>
                                            <small>
                                                {b.date} · {(b.times || []).join(', ')}
                                            </small>
                                        </div>
                                        <div className="ahi-actions">
                                            {st ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onOpenStudent(st.uid)}
                                                >
                                                    Diák
                                                </button>
                                            ) : null}
                                            <button
                                                type="button"
                                                className="ok"
                                                disabled={busyId === b.id}
                                                onClick={() => void decide(b, 'approved')}
                                            >
                                                OK
                                            </button>
                                            <button
                                                type="button"
                                                className="no"
                                                disabled={busyId === b.id}
                                                onClick={() => void decide(b, 'rejected')}
                                            >
                                                Nem
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <button type="button" className="ahi-link" onClick={onOpenSchedule}>
                        Naptár →
                    </button>
                </div>

                <div className="ahi-card">
                    <div className="ahi-card-top">
                        <strong>Mai órák</strong>
                        <span>{todayLessons.length}</span>
                    </div>
                    {todayLessons.length === 0 ? (
                        <p className="ahi-empty">Ma nincs óra a listában.</p>
                    ) : (
                        <ul>
                            {todayLessons.slice(0, 6).map((b) => {
                                const st = findStudentForBooking(students, b);
                                return (
                                    <li key={b.id}>
                                        <div>
                                            <b>
                                                {(b.times || [])[0] || '—'} · {b.customerName}
                                            </b>
                                            <small>{b.selectedSubject || 'Téma nincs'}</small>
                                        </div>
                                        {st ? (
                                            <button
                                                type="button"
                                                onClick={() => onOpenStudent(st.uid)}
                                            >
                                                Dosszié
                                            </button>
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <button type="button" className="ahi-link" onClick={onOpenLessons}>
                        Órák →
                    </button>
                </div>

                <div className="ahi-card">
                    <div className="ahi-card-top">
                        <strong>Figyelem</strong>
                        <span>{needAttention.length}</span>
                    </div>
                    {needAttention.length === 0 ? (
                        <p className="ahi-empty">Nincs kiemelendő diák mára.</p>
                    ) : (
                        <ul>
                            {needAttention.slice(0, 6).map(({ student: s, reasons }) => (
                                <li key={s.uid}>
                                    <div>
                                        <b>{s.name}</b>
                                        <small>{reasons.join(' · ')}</small>
                                    </div>
                                    <button type="button" onClick={() => onOpenStudent(s.uid)}>
                                        Megnyit
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <style jsx>{`
                .ahi {
                    margin: 0 0 1rem;
                    padding: 0.85rem 1rem;
                    border-radius: 14px;
                    border: 1px solid rgba(57, 255, 20, 0.22);
                    background: rgba(12, 16, 22, 0.92);
                    color: #e8f0ea;
                }
                .ahi-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.65rem;
                }
                .ahi-head h2 {
                    margin: 0;
                    font-size: 1.05rem;
                }
                .ahi-msg {
                    color: #39ff14;
                    font-size: 0.85rem;
                    margin: 0 0 0.5rem;
                }
                .ahi-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 0.65rem;
                }
                @media (max-width: 900px) {
                    .ahi-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .ahi-card {
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 0.65rem 0.7rem;
                    background: rgba(0, 0, 0, 0.22);
                    display: flex;
                    flex-direction: column;
                    gap: 0.45rem;
                    min-height: 140px;
                }
                .ahi-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .ahi-card-top span {
                    color: #39ff14;
                    font-weight: 800;
                }
                .ahi-empty {
                    margin: 0;
                    color: #8b9a93;
                    font-size: 0.85rem;
                    flex: 1;
                }
                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    flex: 1;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.5rem;
                    align-items: center;
                    padding: 0.35rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    font-size: 0.84rem;
                }
                li b {
                    display: block;
                }
                li small {
                    display: block;
                    color: #8b9a93;
                    font-size: 0.75rem;
                }
                .ahi-actions {
                    display: flex;
                    gap: 0.25rem;
                    flex-wrap: wrap;
                }
                button {
                    border: 1px solid rgba(57, 255, 20, 0.3);
                    background: rgba(57, 255, 20, 0.08);
                    color: #39ff14;
                    border-radius: 8px;
                    padding: 0.25rem 0.45rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                }
                button.ok {
                    background: rgba(57, 255, 20, 0.2);
                }
                button.no {
                    border-color: rgba(255, 105, 180, 0.4);
                    color: #ff9ecd;
                    background: rgba(255, 105, 180, 0.1);
                }
                button:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }
                .ahi-link {
                    align-self: flex-start;
                    background: transparent;
                    border: none;
                    color: #39ff14;
                    padding: 0;
                    text-decoration: underline;
                }
            `}</style>
        </section>
    );
}
