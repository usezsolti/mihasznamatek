import { useEffect, useMemo, useState } from 'react';
import { EDUCATION_LEVELS } from '../utils/mathTopicsCatalog';
import { getRankEmoji } from '../utils/practiceProgress';
import {
    loadStudentCardSummary,
    paymentStatusLabel,
    type StudentCardSummary,
    type TeacherStudent,
} from '../utils/teacherConsole';

type Props = {
    students: TeacherStudent[];
    loading: boolean;
    query: string;
    onQueryChange: (value: string) => void;
    onRefresh: () => void;
    onOpenStudent: (uid: string) => void;
};

const LEVEL_LABEL: Record<string, string> = {
    elementary: 'Ált. iskola',
    highschool: 'Középiskola',
    erettsegi: 'Érettségi',
    university: 'Egyetem',
};

function educationLabel(id?: string): string {
    if (!id) return '—';
    const hit = EDUCATION_LEVELS.find((l) => l.id === id);
    return hit?.name || LEVEL_LABEL[id] || id;
}

function initials(name: string, email: string): string {
    const src = (name || email || '?').trim();
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return src.slice(0, 2).toUpperCase();
}

function formatPlayed(ms?: number): string {
    if (!ms) return '';
    return new Date(ms).toLocaleString('hu-HU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function paymentClass(status: StudentCardSummary['paymentStatus']): string {
    if (status === 'paid') return 'ok';
    if (status === 'transfer_pending') return 'wait';
    if (status === 'unpaid') return 'bad';
    return 'muted';
}

type CardFilter = 'all' | 'unpaid' | 'transfer' | 'paid' | 'next' | 'opentask' | 'played';

export default function AdminStudentCards({
    students,
    loading,
    query,
    onQueryChange,
    onRefresh,
    onOpenStudent,
}: Props) {
    const [summaries, setSummaries] = useState<Record<string, StudentCardSummary | null>>({});
    const [filter, setFilter] = useState<CardFilter>('all');

    useEffect(() => {
        let cancelled = false;
        students.forEach((student) => {
            void loadStudentCardSummary(student)
                .then((data) => {
                    if (cancelled) return;
                    setSummaries((prev) => ({ ...prev, [student.uid]: data }));
                })
                .catch(() => {
                    if (!cancelled) setSummaries((prev) => ({ ...prev, [student.uid]: null }));
                });
        });
        return () => {
            cancelled = true;
        };
    }, [students]);

    const visible = useMemo(() => {
        return students.filter((student) => {
            const summary = summaries[student.uid];
            const pay = summary?.paymentStatus || student.paymentStatus || '';
            if (filter === 'unpaid') return pay === 'unpaid';
            if (filter === 'transfer') return pay === 'transfer_pending';
            if (filter === 'paid') return pay === 'paid';
            if (filter === 'next') return Boolean(summary?.nextLessonLabel);
            if (filter === 'opentask') return (summary?.openTaskCount || 0) > 0;
            if (filter === 'played') {
                return (summary?.gameCount || student.gameCount || 0) > 0 || (summary?.xp || student.xp || 0) > 0;
            }
            return true;
        });
    }, [students, summaries, filter]);

    const chips: Array<{ id: CardFilter; label: string }> = [
        { id: 'all', label: 'Mind' },
        { id: 'unpaid', label: 'Kifizetetlen' },
        { id: 'transfer', label: 'Utalásra vár' },
        { id: 'paid', label: 'Rendben' },
        { id: 'next', label: 'Van órája' },
        { id: 'opentask', label: 'Nyitott feladat' },
        { id: 'played', label: 'Játszott' },
    ];

    return (
        <section className="asc">
            <div className="asc-toolbar">
                <div>
                    <h2>Diákok</h2>
                    <p>XP, játéktörténet és a következő óra egy kártyán.</p>
                </div>
                <button type="button" className="asc-refresh" onClick={onRefresh}>
                    Frissítés
                </button>
            </div>
            <input
                className="asc-search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Keresés név vagy e-mail szerint…"
                aria-label="Diák keresés"
            />
            <div className="asc-filters" role="tablist" aria-label="Diák szűrők">
                {chips.map((chip) => (
                    <button
                        key={chip.id}
                        type="button"
                        className={filter === chip.id ? 'active' : ''}
                        onClick={() => setFilter(chip.id)}
                    >
                        {chip.label}
                    </button>
                ))}
            </div>
            {loading ? (
                <p className="asc-muted">Betöltés…</p>
            ) : visible.length === 0 ? (
                <p className="asc-muted">Nincs diák ebben a szűrőben.</p>
            ) : (
                <div className="asc-grid">
                    {visible.map((student) => (
                        <StudentCard
                            key={student.uid}
                            student={student}
                            summary={summaries[student.uid] ?? null}
                            onOpen={() => onOpenStudent(student.uid)}
                        />
                    ))}
                </div>
            )}
            <style jsx>{`
                .asc {
                    margin-top: 0.35rem;
                }
                .asc-toolbar {
                    display: flex;
                    justify-content: space-between;
                    gap: 0.85rem;
                    align-items: flex-end;
                    margin-bottom: 0.85rem;
                    flex-wrap: wrap;
                }
                .asc h2 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: #e8f0ea;
                }
                .asc p {
                    margin: 0.25rem 0 0;
                    color: #a8b8b0;
                    font-size: 0.9rem;
                }
                .asc-refresh,
                .asc-search {
                    border: 1px solid rgba(57, 255, 20, 0.22);
                    background: rgba(18, 24, 33, 0.95);
                    color: #d7e6dc;
                    border-radius: 10px;
                }
                .asc-refresh {
                    padding: 0.45rem 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                }
                .asc-search {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0.65rem 0.8rem;
                    margin-bottom: 0.7rem;
                }
                .asc-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                    margin: 0 0 0.95rem;
                }
                .asc-filters button {
                    border: 1px solid rgba(57, 255, 20, 0.22);
                    background: rgba(18, 24, 33, 0.95);
                    color: #d7e6dc;
                    border-radius: 999px;
                    padding: 0.32rem 0.7rem;
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                }
                .asc-filters button.active {
                    border-color: rgba(57, 255, 20, 0.6);
                    background: rgba(57, 255, 20, 0.14);
                    color: #39ff14;
                }
                .asc-muted {
                    color: #a8b8b0;
                }
                .asc-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 0.85rem;
                }
            `}</style>
        </section>
    );
}

function StudentCard({
    student,
    summary,
    onOpen,
}: {
    student: TeacherStudent;
    summary: StudentCardSummary | null;
    onOpen: () => void;
}) {
    const [infoOpen, setInfoOpen] = useState(false);

    const billing = summary?.billing;

    const xp = summary?.xp ?? student.xp ?? null;
    const games = summary?.gameCount ?? student.gameCount ?? null;
    const lastPlayed = summary?.lastPlayedMs ?? student.lastPlayedMs ?? 0;
    const completed = summary?.completedTopicCount ?? student.completedTopicCount ?? null;

    return (
        <article className="card">
            <button
                type="button"
                className="card-info"
                aria-label="Számlázási adatok"
                title="Számlázási adatok"
                onClick={(e) => {
                    e.stopPropagation();
                    setInfoOpen(true);
                }}
            >
                i
            </button>
            <button type="button" className="card-main" onClick={onOpen}>
                <span className="avatar" aria-hidden>
                    {student.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={student.photoURL} alt="" />
                    ) : (
                        initials(student.name, student.email)
                    )}
                </span>
                <strong>{student.name || 'Diák'}</strong>
                <em>{student.email || '—'}</em>
                <span className="level">{educationLabel(student.educationLevel)}</span>
                <div className="stats">
                    <span>
                        <b>
                            {xp != null
                                ? `${getRankEmoji(summary?.rankLevel || 1)} ${xp}`
                                : '…'}
                        </b>
                        XP
                    </span>
                    <span>
                        <b>{games != null ? games : '…'}</b>
                        játék
                    </span>
                    <span>
                        <b>{summary ? summary.openTaskCount : '…'}</b>
                        feladat
                    </span>
                    <span>
                        <b>{completed != null ? completed : '…'}</b>
                        kész
                    </span>
                </div>
                <div className={`pay ${paymentClass(summary?.paymentStatus || '')}`}>
                    {summary ? paymentStatusLabel(summary.paymentStatus) : 'Fizetés…'}
                </div>
                <div className="next">
                    {lastPlayed
                        ? `Utolsó játék: ${formatPlayed(lastPlayed)}`
                        : 'Még nem játszott a játékkal'}
                </div>
                <div className="next">
                    {summary?.nextLessonLabel
                        ? `Következő óra: ${summary.nextLessonLabel}`
                        : 'Nincs közelgő óra'}
                </div>
            </button>

            {infoOpen ? (
                <div
                    className="modal-bg"
                    role="presentation"
                    onClick={() => setInfoOpen(false)}
                >
                    <div
                        className="modal"
                        role="dialog"
                        aria-labelledby={`bill-${student.uid}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-head">
                            <h3 id={`bill-${student.uid}`}>Számlázási adatok</h3>
                            <button
                                type="button"
                                className="card-info"
                                aria-label="Bezárás"
                                onClick={() => setInfoOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <dl>
                            <div>
                                <dt>Név</dt>
                                <dd>{billing?.name || student.name || '—'}</dd>
                            </div>
                            <div>
                                <dt>E-mail</dt>
                                <dd>{billing?.email || student.email || '—'}</dd>
                            </div>
                            <div>
                                <dt>Telefon</dt>
                                <dd>{billing?.phone || '—'}</dd>
                            </div>
                            <div>
                                <dt>Számlázási cím</dt>
                                <dd>{billing?.address || '—'}</dd>
                            </div>
                            <div>
                                <dt>Irányítószám</dt>
                                <dd>{billing?.postalCode || '—'}</dd>
                            </div>
                            <div>
                                <dt>Utca</dt>
                                <dd>{billing?.street || '—'}</dd>
                            </div>
                            <div>
                                <dt>Házszám</dt>
                                <dd>{billing?.houseNumber || '—'}</dd>
                            </div>
                            <div>
                                <dt>Témakör</dt>
                                <dd>{billing?.preferredSubject || '—'}</dd>
                            </div>
                            <div>
                                <dt>Óratípus</dt>
                                <dd>
                                    {billing?.preferredLessonType === 'personal'
                                        ? 'Személyes'
                                        : billing?.preferredLessonType === 'online'
                                          ? 'Online'
                                          : '—'}
                                </dd>
                            </div>
                            <div>
                                <dt>Fizetés</dt>
                                <dd>
                                    {summary
                                        ? paymentStatusLabel(summary.paymentStatus)
                                        : '—'}
                                    {billing?.paymentNote ? ` · ${billing.paymentNote}` : ''}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            ) : null}

            <style jsx>{`
                .card {
                    position: relative;
                    background: linear-gradient(180deg, rgba(18, 28, 22, 0.96), rgba(12, 16, 22, 0.94));
                    border: 1px solid rgba(57, 255, 20, 0.22);
                    border-radius: 16px;
                    overflow: hidden;
                    min-height: 240px;
                }
                .card-info {
                    position: absolute;
                    top: 0.7rem;
                    right: 0.7rem;
                    z-index: 2;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid rgba(57, 255, 20, 0.4);
                    background: rgba(8, 12, 16, 0.92);
                    color: #39ff14;
                    font-weight: 800;
                    font-style: italic;
                    font-family: Georgia, 'Times New Roman', serif;
                    cursor: pointer;
                }
                .card-main {
                    width: 100%;
                    border: 0;
                    background: transparent;
                    color: inherit;
                    text-align: left;
                    padding: 1rem 1rem 0.95rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    min-height: 240px;
                }
                .avatar {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    overflow: hidden;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(57, 255, 20, 0.12);
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    font-weight: 800;
                    color: #39ff14;
                    margin-bottom: 0.7rem;
                }
                .avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                strong {
                    color: #e8f0ea;
                    font-size: 1.05rem;
                    padding-right: 2rem;
                }
                em {
                    font-style: normal;
                    color: #a8b8b0;
                    font-size: 0.82rem;
                    margin-top: 0.15rem;
                    word-break: break-all;
                }
                .level {
                    margin-top: 0.35rem;
                    font-size: 0.78rem;
                    font-weight: 700;
                    color: #39ff14;
                }
                .stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.45rem;
                    width: 100%;
                    margin-top: 0.85rem;
                }
                .stats span {
                    display: flex;
                    flex-direction: column;
                    background: rgba(8, 12, 16, 0.55);
                    border-radius: 10px;
                    padding: 0.4rem 0.5rem;
                    font-size: 0.72rem;
                    color: #a8b8b0;
                }
                .stats b {
                    color: #e8f0ea;
                    font-size: 0.95rem;
                }
                .pay {
                    margin-top: 0.7rem;
                    font-size: 0.78rem;
                    font-weight: 800;
                    border-radius: 999px;
                    padding: 0.22rem 0.6rem;
                }
                .pay.ok {
                    color: #39ff14;
                    background: rgba(57, 255, 20, 0.12);
                }
                .pay.wait {
                    color: #ffe08a;
                    background: rgba(255, 210, 80, 0.12);
                }
                .pay.bad {
                    color: #ff9ec8;
                    background: rgba(255, 105, 180, 0.12);
                }
                .pay.muted {
                    color: #a8b8b0;
                    background: rgba(255, 255, 255, 0.06);
                }
                .next {
                    margin-top: 0.55rem;
                    font-size: 0.78rem;
                    color: #cfe9d4;
                }
                .modal-bg {
                    position: fixed;
                    inset: 0;
                    z-index: 40;
                    background: rgba(0, 0, 0, 0.62);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal {
                    width: min(420px, 100%);
                    background: #121821;
                    border: 1px solid rgba(57, 255, 20, 0.28);
                    border-radius: 16px;
                    padding: 1rem 1.05rem 1.1rem;
                    color: #e8f0ea;
                    position: relative;
                }
                .modal-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 0.7rem;
                    margin-bottom: 0.75rem;
                }
                .modal h3 {
                    margin: 0;
                    font-size: 1.05rem;
                }
                .modal .card-info {
                    position: static;
                }
                dl {
                    margin: 0;
                    display: grid;
                    gap: 0.55rem;
                }
                dl div {
                    display: grid;
                    gap: 0.12rem;
                }
                dt {
                    font-size: 0.72rem;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #a8b8b0;
                }
                dd {
                    margin: 0;
                    font-weight: 700;
                }
            `}</style>
        </article>
    );
}
