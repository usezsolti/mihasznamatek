import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { openAuthModal } from '../../utils/authModal';
import {
    loadUserPracticeProgress,
    resolveProgressStorageKey,
    type TopicProgress,
} from '../../utils/practiceProgress';
import type { EducationLevelId, ErettsegiExamLevel } from '../../utils/mathTopicsCatalog';
import {
    aggregateTopicStats,
    buildTopicPracticeHref,
    findCatalogTopic,
    filterResultsForTopic,
    formatResultDate,
    pathLessonSummary,
    sortResultsNewestFirst,
    type RawGameResult,
    type TopicSessionAggregate,
} from '../../utils/topicStats';

function parseEducationLevel(value: unknown): EducationLevelId {
    if (value === 'elementary' || value === 'highschool' || value === 'university' || value === 'erettsegi') {
        return value;
    }
    return 'university';
}

function parseErettsegiLevel(value: unknown): ErettsegiExamLevel {
    return value === 'kozep' ? 'kozep' : 'emelt';
}

export default function TopicStatsPage() {
    const router = useRouter();
    const topicIdParam = typeof router.query.topicId === 'string' ? router.query.topicId : '';
    const educationLevel = parseEducationLevel(router.query.educationLevel);
    const erettsegiLevel = parseErettsegiLevel(router.query.level);

    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState<string | null>(null);
    const [results, setResults] = useState<RawGameResult[]>([]);
    const [topicProgress, setTopicProgress] = useState<TopicProgress | null>(null);

    const catalogTopic = useMemo(
        () => (topicIdParam ? findCatalogTopic(topicIdParam, educationLevel, erettsegiLevel) : null),
        [topicIdParam, educationLevel, erettsegiLevel]
    );

    const topicTitle = catalogTopic?.title || topicIdParam || 'Témakör';
    const topicIcon = catalogTopic?.icon || '📚';
    const topicColor = catalogTopic?.color || '#39ff14';

    useEffect(() => {
        if (!router.isReady || !topicIdParam) return;

        let unsub: (() => void) | undefined;
        let cancelled = false;

        const loadForUser = async (userId: string | null) => {
            if (!userId) {
                if (!cancelled) {
                    setUid(null);
                    setResults([]);
                    setTopicProgress(null);
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            setUid(userId);

            try {
                const firebase = (window as any).firebase;
                const db = firebase?.firestore?.();
                let rows: RawGameResult[] = [];

                if (db) {
                    const snap = await db.collection('gameResults').where('userId', '==', userId).get();
                    snap.forEach((doc: any) => {
                        rows.push({ id: doc.id, ...doc.data() });
                    });
                    rows = sortResultsNewestFirst(filterResultsForTopic(rows, topicIdParam));
                }

                const progress = await loadUserPracticeProgress(userId);
                const key = resolveProgressStorageKey(topicIdParam);
                const tp = progress.topics?.[key] || null;

                if (!cancelled) {
                    setResults(rows);
                    setTopicProgress(tp);
                }
            } catch (err) {
                console.error('Topic stats load error:', err);
                if (!cancelled) {
                    setResults([]);
                    setTopicProgress(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        const waitForAuth = () => {
            const firebase = (window as any).firebase;
            if (!firebase?.auth) {
                setTimeout(waitForAuth, 100);
                return;
            }
            unsub = firebase.auth().onAuthStateChanged((user: any) => {
                void loadForUser(user?.uid || null);
            });
        };

        waitForAuth();

        return () => {
            cancelled = true;
            if (unsub) unsub();
        };
    }, [router.isReady, topicIdParam]);

    const stats: TopicSessionAggregate = useMemo(
        () => aggregateTopicStats(results),
        [results]
    );
    const path = useMemo(() => pathLessonSummary(topicProgress), [topicProgress]);

    const practiceHref = buildTopicPracticeHref(topicIdParam, educationLevel, erettsegiLevel);

    const goPractice = () => {
        router.push(practiceHref);
    };

    if (!router.isReady || !topicIdParam) {
        return (
            <div className="dashboard-container modern-theme has-site-navbar">
                <main className="main-content">
                    <div className="loading-screen">
                        <div className="loading-spinner" />
                        <p>Betöltés...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container modern-theme has-site-navbar">
            <main className="main-content" style={{ maxWidth: 960, margin: '0 auto' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <Link
                        href="/dashboard"
                        style={{ color: '#9f9', textDecoration: 'none', fontWeight: 600 }}
                    >
                        ← Vissza a dashboardra
                    </Link>
                </div>

                <header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: topicColor,
                            color: '#0a0a0a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            flexShrink: 0,
                        }}
                    >
                        {topicIcon}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <h1 style={{ margin: 0, color: topicColor, fontSize: '1.75rem' }}>
                            {topicTitle}
                        </h1>
                        <p style={{ margin: '0.35rem 0 0', color: '#aaa' }}>
                            Statisztikák és előrehaladás ebben a témakörben
                        </p>
                    </div>
                    {uid && (
                        <button
                            type="button"
                            onClick={goPractice}
                            style={{
                                background: topicColor,
                                color: '#0a0a0a',
                                border: 'none',
                                borderRadius: 12,
                                padding: '0.85rem 1.4rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            Gyakorlás →
                        </button>
                    )}
                </header>

                {loading ? (
                    <div className="loading-screen" style={{ minHeight: 200 }}>
                        <div className="loading-spinner" />
                        <p>Betöltés...</p>
                    </div>
                ) : !uid ? (
                    <section
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(57,255,20,0.25)',
                            borderRadius: 16,
                            padding: '2rem',
                            textAlign: 'center',
                        }}
                    >
                        <p style={{ color: '#fff', fontSize: '1.1rem', marginTop: 0 }}>
                            Jelentkezz be a témakör statisztikáinak megtekintéséhez.
                        </p>
                        <button
                            type="button"
                            className="auth-btn"
                            onClick={() => openAuthModal({ mode: 'login' })}
                            style={{
                                background: '#39ff14',
                                color: '#0a0a0a',
                                border: 'none',
                                borderRadius: 10,
                                padding: '0.75rem 1.25rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                            }}
                        >
                            Bejelentkezés
                        </button>
                    </section>
                ) : (
                    <>
                        <section
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: '0.85rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            {[
                                { label: 'Játszott körök', value: String(stats.totalGames) },
                                {
                                    label: 'Helyes / összes',
                                    value: `${stats.totalCorrect}/${stats.totalQuestions}`,
                                },
                                { label: 'Átlagos siker', value: `${stats.averageSuccessRate}%` },
                                { label: 'Legjobb score', value: String(stats.bestScore) },
                                { label: 'Összes XP', value: String(stats.totalXp) },
                                {
                                    label: 'Utolsó játék',
                                    value: stats.lastPlayedAt
                                        ? formatResultDate(stats.lastPlayedAt)
                                        : '—',
                                },
                            ].map((card) => (
                                <div
                                    key={card.label}
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 14,
                                        padding: '1rem',
                                    }}
                                >
                                    <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: 6 }}>
                                        {card.label}
                                    </div>
                                    <div
                                        style={{
                                            color: topicColor,
                                            fontWeight: 800,
                                            fontSize: card.label === 'Utolsó játék' ? '0.95rem' : '1.35rem',
                                            lineHeight: 1.25,
                                        }}
                                    >
                                        {card.value}
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 16,
                                padding: '1.25rem 1.4rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <h2 style={{ margin: '0 0 0.75rem', color: '#fff', fontSize: '1.2rem' }}>
                                Út / leckék
                            </h2>
                            {path.lessonsDone === 0 && !topicProgress ? (
                                <p style={{ color: '#aaa', margin: 0 }}>
                                    Még nincs út-progressz ebben a témában. A gyakorlás indításával
                                    elkezded a leckéket.
                                </p>
                            ) : (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: 8,
                                            color: path.completed ? '#ffd700' : '#9f9',
                                            fontWeight: 700,
                                        }}
                                    >
                                        <span>
                                            {path.completed
                                                ? '✓ Út kész'
                                                : `${path.lessonsDone}/${path.lessonsTotal} lecke`}
                                            {path.perfect ? ' · Hibátlan' : ''}
                                        </span>
                                        <span>{path.percent}%</span>
                                    </div>
                                    <div
                                        style={{
                                            height: 10,
                                            background: 'rgba(255,255,255,0.12)',
                                            borderRadius: 999,
                                            overflow: 'hidden',
                                            marginBottom: '0.85rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${Math.min(100, path.percent)}%`,
                                                background: path.completed
                                                    ? 'linear-gradient(90deg,#ffd700,#39ff14)'
                                                    : topicColor,
                                                borderRadius: 999,
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.75rem 1.25rem',
                                            color: '#bbb',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        <span>
                                            Legjobb: {topicProgress?.bestCorrect ?? 0}/
                                            {topicProgress?.totalQuestions ?? path.lessonsTotal * 3}
                                        </span>
                                        <span>
                                            Szakaszok:{" "}
                                            {path.stagesCompleted.length
                                                ? path.stagesCompleted.join(', ')
                                                : '—'}
                                        </span>
                                        <span>Kincsek: {path.chestsClaimed}/3</span>
                                    </div>
                                </>
                            )}
                        </section>

                        <section
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 16,
                                padding: '1.25rem 1.4rem',
                                marginBottom: '2rem',
                            }}
                        >
                            <h2 style={{ margin: '0 0 0.75rem', color: '#fff', fontSize: '1.2rem' }}>
                                Játéktörténet
                            </h2>
                            {results.length === 0 ? (
                                <p style={{ color: '#aaa', margin: 0 }}>
                                    Még nincs mentett játék ebben a témakörben.
                                </p>
                            ) : (
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    {results.map((r, i) => {
                                        const correct = r.correct || 0;
                                        const total = r.total || 0;
                                        const rate =
                                            total > 0 ? Math.round((correct / total) * 100) : 0;
                                        return (
                                            <li
                                                key={r.id || `${i}-${correct}-${total}`}
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.5rem 1rem',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '0.85rem 0',
                                                    borderTop:
                                                        i === 0
                                                            ? 'none'
                                                            : '1px solid rgba(255,255,255,0.08)',
                                                }}
                                            >
                                                <div>
                                                    <div style={{ color: '#fff', fontWeight: 600 }}>
                                                        {formatResultDate(r.completedAt)}
                                                    </div>
                                                    <div style={{ color: '#888', fontSize: '0.85rem' }}>
                                                        {correct}/{total} helyes · {rate}%
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        color: topicColor,
                                                        fontWeight: 700,
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    <div>Score: {r.score || 0}</div>
                                                    {(r.xpEarned || 0) > 0 && (
                                                        <div style={{ fontSize: '0.85rem', color: '#9f9' }}>
                                                            +{r.xpEarned} XP
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </section>

                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <button
                                type="button"
                                onClick={goPractice}
                                style={{
                                    background: topicColor,
                                    color: '#0a0a0a',
                                    border: 'none',
                                    borderRadius: 12,
                                    padding: '0.95rem 1.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    fontSize: '1.05rem',
                                }}
                            >
                                Gyakorlás indítása
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
