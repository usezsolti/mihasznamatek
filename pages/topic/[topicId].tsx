import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TopicPathMap from '../../components/TopicPathMap';
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
    buildTopicStatsHref,
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
    const showPath = router.query.view === 'path';
    const gradeParam = router.query.grade ? parseInt(String(router.query.grade), 10) : NaN;
    const pathGrade = Number.isFinite(gradeParam)
        ? gradeParam
        : educationLevel === 'elementary'
          ? 5
          : educationLevel === 'highschool'
            ? 10
            : undefined;

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
                <main className="main-content topic-stats-page">
                    <div className="loading-screen">
                        <div className="loading-spinner" />
                        <p>Betöltés...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (showPath) {
        return (
            <div className="dashboard-container modern-theme has-site-navbar">
                <main className="main-content topic-stats-page">
                    <TopicPathMap
                        topicId={topicIdParam}
                        topicTitle={topicTitle}
                        topicIcon={topicIcon}
                        topicColor={topicColor}
                        educationLevel={educationLevel}
                        erettsegiLevel={erettsegiLevel}
                        grade={pathGrade}
                        onBack={() =>
                            router.push(
                                buildTopicStatsHref(topicIdParam, educationLevel, erettsegiLevel)
                            )
                        }
                    />
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container modern-theme has-site-navbar">
            <main
                className="main-content topic-stats-page"
                style={{ ['--topic-color' as string]: topicColor }}
            >
                <Link href="/dashboard" className="topic-stats-back">
                    ← Vissza a dashboardra
                </Link>

                <div className="topic-stats-hero">
                    <div className="topic-stats-icon" aria-hidden="true">
                        {topicIcon}
                    </div>
                    <div className="topic-stats-hero-text">
                        <h1 className="topic-stats-title">{topicTitle}</h1>
                        <p className="topic-stats-subtitle">
                            Statisztikák és előrehaladás ebben a témakörben
                        </p>
                    </div>
                    {uid && (
                        <button type="button" className="topic-stats-cta" onClick={goPractice}>
                            Gyakorlás →
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="loading-screen" style={{ minHeight: 200 }}>
                        <div className="loading-spinner" />
                        <p>Betöltés...</p>
                    </div>
                ) : !uid ? (
                    <div className="topic-stats-panel topic-stats-login">
                        <p>Jelentkezz be a témakör statisztikáinak megtekintéséhez.</p>
                        <button
                            type="button"
                            className="topic-stats-cta"
                            onClick={() => openAuthModal({ mode: 'login' })}
                        >
                            Bejelentkezés
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="topic-stats-grid">
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
                                    small: true,
                                },
                            ].map((card) => (
                                <div key={card.label} className="topic-stats-card">
                                    <div className="topic-stats-card-label">{card.label}</div>
                                    <div
                                        className={`topic-stats-card-value${card.small ? ' is-small' : ''}`}
                                    >
                                        {card.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="topic-stats-panel">
                            <h2 className="topic-stats-panel-title">Út / leckék</h2>
                            {path.lessonsDone === 0 && !topicProgress ? (
                                <p className="topic-stats-muted">
                                    Még nincs út-progressz ebben a témában. A gyakorlás indításával
                                    elkezded a leckéket.
                                </p>
                            ) : (
                                <>
                                    <div
                                        className={`topic-stats-path-meta${path.completed ? ' is-done' : ''}`}
                                    >
                                        <span>
                                            {path.completed
                                                ? '✓ Út kész'
                                                : `${path.lessonsDone}/${path.lessonsTotal} lecke`}
                                            {path.perfect ? ' · Hibátlan' : ''}
                                        </span>
                                        <span>{path.percent}%</span>
                                    </div>
                                    <div className="topic-stats-path-bar">
                                        <div
                                            className={`topic-stats-path-fill${path.completed ? ' is-done' : ''}`}
                                            style={{ width: `${Math.min(100, path.percent)}%` }}
                                        />
                                    </div>
                                    <div className="topic-stats-path-details">
                                        <span>
                                            Legjobb: {topicProgress?.bestCorrect ?? 0}/
                                            {topicProgress?.totalQuestions ?? path.lessonsTotal * 3}
                                        </span>
                                        <span>
                                            Szakaszok:{' '}
                                            {path.stagesCompleted.length
                                                ? path.stagesCompleted.join(', ')
                                                : '—'}
                                        </span>
                                        <span>Kincsek: {path.chestsClaimed}/3</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="topic-stats-panel">
                            <h2 className="topic-stats-panel-title">Játéktörténet</h2>
                            {results.length === 0 ? (
                                <p className="topic-stats-muted">
                                    Még nincs mentett játék ebben a témakörben.
                                </p>
                            ) : (
                                <ul className="topic-stats-history">
                                    {results.map((r, i) => {
                                        const correct = r.correct || 0;
                                        const total = r.total || 0;
                                        const rate =
                                            total > 0 ? Math.round((correct / total) * 100) : 0;
                                        return (
                                            <li
                                                key={r.id || `${i}-${correct}-${total}`}
                                                className="topic-stats-history-item"
                                            >
                                                <div>
                                                    <div className="topic-stats-history-date">
                                                        {formatResultDate(r.completedAt)}
                                                    </div>
                                                    <div className="topic-stats-history-meta">
                                                        {correct}/{total} helyes · {rate}%
                                                    </div>
                                                </div>
                                                <div className="topic-stats-history-score">
                                                    <div>Score: {r.score || 0}</div>
                                                    {(r.xpEarned || 0) > 0 && (
                                                        <div className="topic-stats-history-xp">
                                                            +{r.xpEarned} XP
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        <div className="topic-stats-footer-cta">
                            <button type="button" className="topic-stats-cta" onClick={goPractice}>
                                Gyakorlás indítása
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
