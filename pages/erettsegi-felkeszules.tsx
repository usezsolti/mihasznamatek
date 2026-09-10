import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import TopicPathMap from '../components/TopicPathMap';
import {
    loadUserPracticeProgress,
    resolveProgressStorageKey,
    type TopicProgress,
    type UserPracticeProgress,
} from '../utils/practiceProgress';
import { PATH_LESSON_COUNT } from '../utils/topicPath';
import {
    erettsegiPapersByYear,
    type ErettsegiExamLevel,
    type ErettsegiPaperMeta,
} from '../utils/game/erettsegiPapers';
import { agentDebugLog } from '../utils/agentDebugLog';

interface ExamTopic {
    id: string;
    title: string;
    icon: string;
    color: string;
    description: string;
}

type PrepViewMode = 'choose' | 'topics' | 'papers';

export default function ErettsegiFelkeszules() {
    const router = useRouter();
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<PrepViewMode>('choose');
    const [selectedLevel, setSelectedLevel] = useState<'kozep' | 'emelt' | null>(null);
    const [topicProgressMap, setTopicProgressMap] = useState<Partial<Record<string, TopicProgress>>>({});
    const [pathTopicId, setPathTopicId] = useState<string | null>(null);

    useEffect(() => {
        if (!router.isReady) return;

        let nextMode: PrepViewMode = 'choose';
        if (typeof router.query.topic === 'string' && router.query.topic) {
            setPathTopicId(router.query.topic);
            nextMode = 'topics';
        } else if (router.query.mode === 'papers') {
            nextMode = 'papers';
        } else if (router.query.mode === 'topics') {
            nextMode = 'topics';
        } else {
            setPathTopicId(null);
        }
        setViewMode(nextMode);

        if (router.query.level === 'emelt' || router.query.level === 'kozep') {
            setSelectedLevel(router.query.level as 'kozep' | 'emelt');
        }

        // #region agent log
        agentDebugLog({
            hypothesisId: 'H6',
            location: 'erettsegi-felkeszules.tsx:urlSync',
            message: 'erettsegi prep hub url sync',
            data: {
                queryMode: typeof router.query.mode === 'string' ? router.query.mode : null,
                hasTopic: Boolean(router.query.topic),
                nextMode,
            },
            runId: 'er-choose-hub',
        });
        // #endregion
    }, [router.isReady, router.query.mode, router.query.level, router.query.topic]);

    const goToPrepMode = (mode: PrepViewMode) => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H7',
            location: 'erettsegi-felkeszules.tsx:goToPrepMode',
            message: 'erettsegi prep path chosen',
            data: { mode, selectedLevel, from: viewMode },
            runId: 'er-choose-hub',
        });
        // #endregion
        setViewMode(mode);
        setSelectedTopic(null);
        if (mode === 'choose') setPathTopicId(null);
        const query: Record<string, string> = {};
        if (mode === 'topics' || mode === 'papers') query.mode = mode;
        if (selectedLevel) query.level = selectedLevel;
        router.replace({ pathname: '/erettsegi-felkeszules', query }, undefined, { shallow: true });
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                let attempts = 0;
                while (!(window as any).firebase?.auth && attempts < 40) {
                    await new Promise((r) => setTimeout(r, 100));
                    attempts++;
                }
                const uid = (window as any).firebase?.auth?.()?.currentUser?.uid || null;
                const prog: UserPracticeProgress = await loadUserPracticeProgress(uid);
                if (!cancelled) setTopicProgressMap(prog.topics || {});
            } catch (e) {
                console.error('Erettsegi progress load:', e);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    // Érettségi témakörök - középszint
    const kozepTopics: ExamTopic[] = [
        {
            id: 'abszolutertek-gyok',
            title: 'Abszolútérték, gyök',
            icon: '|√',
            color: '#39ff14',
            description: 'Abszolútérték számítás, gyökvonás műveletek'
        },
        {
            id: 'egyenletek-egyenlotlensegek',
            title: 'Egyenletek, egyenlőtlenségek, egyenletrendszerek',
            icon: '=',
            color: '#39ff14',
            description: 'Lineáris és másodfokú egyenletek, egyenlőtlenségek megoldása'
        },
        {
            id: 'egyszerusitesek',
            title: 'Egyszerűsítések, átalakítások',
            icon: '↔️',
            color: '#39ff14',
            description: 'Algebrai kifejezések egyszerűsítése és átalakítása'
        },
        {
            id: 'ertelmezesi-tartomany',
            title: 'Értelmezési tartomány, értékkészlet',
            icon: '📊',
            color: '#39ff14',
            description: 'Függvények értelmezési tartománya és értékkészlete'
        },
        {
            id: 'exponencialis-logaritmus',
            title: 'Exponenciális és logaritmusos feladatok',
            icon: 'log',
            color: '#39ff14',
            description: 'Exponenciális és logaritmusos egyenletek, azonosságok'
        },
        {
            id: 'fuggvenyek-analizis',
            title: 'Függvények, analízis',
            icon: '📈',
            color: '#39ff14',
            description: 'MIHASZNAMATEK munkalap: paraméteres függvény, optimalizálás, érintő, integrál'
        },
        {
            id: 'halmazok',
            title: 'Halmazok',
            icon: '{}',
            color: '#39ff14',
            description: 'MIHASZNAMATEK 6×20: halmazelmélet, Venn, inklúzió–kizárás'
        },
        {
            id: 'kombinatorika',
            title: 'Kombinatorika',
            icon: '🔢',
            color: '#39ff14',
            description: 'MIHASZNAMATEK 6×20: összeszámlálás, variáció, kombináció'
        },
        {
            id: 'koordinatageometria',
            title: 'Koordinátageometria',
            icon: '📍',
            color: '#39ff14',
            description: 'Pontok, egyenesek, körök koordinátákkal'
        },
        {
            id: 'logika-grafok',
            title: 'Logika, gráfok',
            icon: '🕸️',
            color: '#39ff14',
            description: 'Logikai műveletek, gráfelmélet alapjai'
        },
        {
            id: 'sikgeometria',
            title: 'Síkgeometria',
            icon: '📐',
            color: '#39ff14',
            description: 'Síkidomok területe, kerülete, hasonlóság'
        },
        {
            id: 'sorozatok',
            title: 'Sorozatok',
            icon: '∞',
            color: '#39ff14',
            description: 'Számtani és mértani sorozatok'
        },
        {
            id: 'statisztika',
            title: 'Statisztika',
            icon: '📊',
            color: '#39ff14',
            description: 'Középértékek, szórás, adatok elemzése'
        },
        {
            id: 'szamelmelet',
            title: 'Számelmélet',
            icon: '🔢',
            color: '#39ff14',
            description: 'Oszthatóság, prímszámok, legnagyobb közös osztó'
        },
        {
            id: 'szoveges-feladatok',
            title: 'Szöveges feladatok',
            icon: '📝',
            color: '#39ff14',
            description: 'Szöveges feladatok megoldása egyenletekkel'
        },
        {
            id: 'tergeometria',
            title: 'Térgeometria',
            icon: '📦',
            color: '#39ff14',
            description: 'Testek térfogata, felszíne'
        },
        {
            id: 'trigonometria',
            title: 'Trigonometria',
            icon: '📊',
            color: '#39ff14',
            description: 'Szögfüggvények, trigonometrikus egyenletek'
        },
        {
            id: 'valoszinusegszamitas',
            title: 'Valószínűségszámítás',
            icon: '🎲',
            color: '#39ff14',
            description: 'Valószínűség számítás, események'
        }
    ];

    // Érettségi témakörök - emelt szint
    const emeltTopics: ExamTopic[] = [
        {
            id: 'abszolutertek-gyok-emelt',
            title: 'Abszolútérték, gyök',
            icon: '|√',
            color: '#ffd700',
            description: 'Abszolútértékes és gyökös egyenletek, egyenlőtlenségek, mesterfeladatok'
        },
        {
            id: 'bizonyitasok',
            title: 'Bizonyítások',
            icon: '✓',
            color: '#ffd700',
            description: 'Algebrai, számelméleti, geometriai bizonyítások és mesterfeladatok'
        },
        {
            id: 'egyenletek-egyenlotlensegek-emelt',
            title: 'Egyenletek, egyenlőtlenségek, egyenletrendszerek',
            icon: '=',
            color: '#ffd700',
            description: 'Bizonyítási feladatok: algebra, indukció, geometria, mesterfeladatok'
        },
        {
            id: 'egyszerusitesek-emelt',
            title: 'Egyszerűsítések, átalakítások',
            icon: '↔️',
            color: '#ffd700',
            description: 'Haladó algebrai kifejezések egyszerűsítése és átalakítása'
        },
        {
            id: 'ertelmezesi-tartomany-emelt',
            title: 'Értelmezési tartomány, értékkészlet',
            icon: '📊',
            color: '#ffd700',
            description: 'Haladó függvények értelmezési tartománya és értékkészlete'
        },
        {
            id: 'exponencialis-logaritmus-emelt',
            title: 'Exponenciális és logaritmusos feladatok',
            icon: 'log',
            color: '#ffd700',
            description: 'Haladó exponenciális és logaritmusos egyenletek, azonosságok'
        },
        {
            id: 'fuggvenyek-analizis-emelt',
            title: 'Függvények, analízis',
            icon: '📈',
            color: '#ffd700',
            description: 'MIHASZNAMATEK munkalap 1–10: függvényvizsgálat, optimalizálás, érintő, integrál'
        },
        {
            id: 'halmazok-emelt',
            title: 'Halmazok',
            icon: '{}',
            color: '#ffd700',
            description: 'MIHASZNAMATEK 6×20: emelt halmazok, paraméter, bizonyítás'
        },
        {
            id: 'kombinatorika-emelt',
            title: 'Kombinatorika',
            icon: '🔢',
            color: '#ffd700',
            description: 'MIHASZNAMATEK 6×20: elosztás, derangement, mesterfok'
        },
        {
            id: 'parameter',
            title: 'Paraméteres egyenletek',
            icon: 'α',
            color: '#ffd700',
            description: 'Paraméteres másodfokú, abszolútértékes és szöveges feladatok'
        },
        {
            id: 'koordinatageometria-emelt',
            title: 'Koordinátageometria',
            icon: '📍',
            color: '#ffd700',
            description: 'Haladó koordinátageometria, kúpszeletek, transzformációk'
        },
        {
            id: 'logika-grafok-emelt',
            title: 'Logika, gráfok',
            icon: '🕸️',
            color: '#ffd700',
            description: 'Haladó logikai műveletek, gráfelmélet'
        },
        {
            id: 'sikgeometria-emelt',
            title: 'Síkgeometria',
            icon: '📐',
            color: '#ffd700',
            description: 'Haladó síkgeometria, bizonyítások, hasonlóság'
        },
        {
            id: 'sorozatok-emelt',
            title: 'Sorozatok',
            icon: '∞',
            color: '#ffd700',
            description: 'Haladó számtani és mértani sorozatok, határértékek'
        },
        {
            id: 'statisztika-emelt',
            title: 'Statisztika',
            icon: '📊',
            color: '#ffd700',
            description: 'Haladó statisztika, középértékek, szórás, adatelemzés'
        },
        {
            id: 'szamelmelet-emelt',
            title: 'Számelmélet',
            icon: '🔢',
            color: '#ffd700',
            description: 'Haladó számelmélet, oszthatóság, prímszámok, kongruenciák'
        },
        {
            id: 'szoveges-feladatok-emelt',
            title: 'Szöveges feladatok',
            icon: '📝',
            color: '#ffd700',
            description: 'Haladó szöveges feladatok megoldása'
        },
        {
            id: 'tergeometria-emelt',
            title: 'Térgeometria',
            icon: '📦',
            color: '#ffd700',
            description: 'Haladó térgeometria, testek térfogata, felszíne'
        },
        {
            id: 'trigonometria-emelt',
            title: 'Trigonometria',
            icon: '📊',
            color: '#ffd700',
            description: 'Haladó trigonometria, szögfüggvények, trigonometrikus egyenletek'
        },
        {
            id: 'valoszinusegszamitas-emelt',
            title: 'Valószínűségszámítás',
            icon: '🎲',
            color: '#ffd700',
            description: 'Haladó valószínűségszámítás, események, feltételes valószínűség'
        }
    ];

    // Aktuális témakörök a kiválasztott szint alapján
    const examTopics = selectedLevel === 'kozep' ? kozepTopics : selectedLevel === 'emelt' ? emeltTopics : [];

    const yearGroups = selectedLevel ? erettsegiPapersByYear(selectedLevel) : [];

    useEffect(() => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H1',
            location: 'erettsegi-felkeszules.tsx:papers',
            message: 'erettsegi paper tracks',
            data: {
                viewMode,
                selectedLevel,
                yearN: yearGroups.length,
                y2026: yearGroups
                    .find((g) => g.year === 2026)
                    ?.papers.map((p) => ({ id: p.id, month: p.month, ready: p.ready, n: p.questionCount })),
                readyKozep: yearGroups.flatMap((g) =>
                    g.papers
                        .filter((p) => p.ready && p.level === 'kozep')
                        .map((p) => ({ id: p.id, n: p.questionCount }))
                ),
            },
            runId: 'er-batch-2325',
        });
        // #endregion
    }, [viewMode, selectedLevel, yearGroups.length]);

    const handleTopicClick = (topicId: string) => {
        const topic = examTopics.find(t => t.id === topicId);
        if (topic && selectedLevel) {
            setPathTopicId(topicId);
            router.replace(
                {
                    pathname: '/erettsegi-felkeszules',
                    query: { mode: 'topics', level: selectedLevel, topic: topicId },
                },
                undefined,
                { shallow: true }
            );
        }
    };

    const handlePathBack = () => {
        setPathTopicId(null);
        if (selectedLevel) {
            router.replace(
                {
                    pathname: '/erettsegi-felkeszules',
                    query: { mode: 'topics', level: selectedLevel },
                },
                undefined,
                { shallow: true }
            );
        }
    };

    const handlePaperClick = (paper: ErettsegiPaperMeta) => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H2',
            location: 'erettsegi-felkeszules.tsx:paperClick',
            message: 'erettsegi paper click',
            data: { paperId: paper.id, ready: paper.ready, month: paper.month, level: paper.level },
            runId: 'er-batch-2325',
        });
        // #endregion
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H52',
            location: 'erettsegi-felkeszules.tsx:paperClick:readyGate',
            message: 'emelt/kozep ready gate',
            data: {
                paperId: paper.id,
                ready: paper.ready,
                level: paper.level,
                questionCount: paper.questionCount,
                timeLimitMin: paper.timeLimitMin,
            },
            runId: 'er-emelt-batch',
        });
        // #endregion
        if (!paper.ready) return;
        const level: ErettsegiExamLevel = paper.level;
        router.push(`/game?erettsegi=true&paperId=${encodeURIComponent(paper.id)}&level=${level}`);
    };

    return (
        <>
            <Head>
                <title>Érettségi Felkészülés - Mihaszna Matek</title>
                <meta name="description" content="Érettségi felkészülés témakörök szerint és érettségi feladatsorok" />
            </Head>

            <div className="erettsegi-container">
                <div className="erettsegi-header">
                    <h1 className="erettsegi-title">
                        📚 Érettségi Felkészülés
                    </h1>
                    <p className="erettsegi-subtitle">
                        Először válassz: témakörönként gyakorolsz, vagy egy teljes feladatsort töltesz ki.
                    </p>
                </div>

                <div className="erettsegi-content">
                    {viewMode === 'choose' && (
                        <section className="prep-choose-section">
                            <h2 className="section-title">Hogyan szeretnél gyakorolni?</h2>
                            <p className="section-description">
                                Témakörönként haladhatsz leckénként, vagy kitölthetsz egy hivatalos
                                májusi / októberi érettségi feladatsort.
                            </p>
                            <div className="prep-choose-grid">
                                <button
                                    type="button"
                                    className="prep-choose-card"
                                    onClick={() => goToPrepMode('topics')}
                                >
                                    <span className="prep-choose-icon">📖</span>
                                    <span className="prep-choose-name">Témakörönként</span>
                                    <span className="prep-choose-desc">
                                        Egy témakört választasz, és leckénként gyakorolsz
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="prep-choose-card papers"
                                    onClick={() => goToPrepMode('papers')}
                                >
                                    <span className="prep-choose-icon">📄</span>
                                    <span className="prep-choose-name">Egy feladatsor kitöltése</span>
                                    <span className="prep-choose-desc">
                                        Hivatalos érettségi sor, időkerettel — május vagy október
                                    </span>
                                </button>
                            </div>
                        </section>
                    )}

                    {viewMode !== 'choose' && (
                    <div className="view-mode-selector">
                        <button
                            type="button"
                            className="mode-btn"
                            onClick={() => goToPrepMode('choose')}
                        >
                            ← Vissza
                        </button>
                        <button
                            type="button"
                            className={`mode-btn ${viewMode === 'topics' ? 'active' : ''}`}
                            onClick={() => goToPrepMode('topics')}
                        >
                            📖 Témakörök
                        </button>
                        <button
                            type="button"
                            className={`mode-btn ${viewMode === 'papers' ? 'active' : ''}`}
                            onClick={() => goToPrepMode('papers')}
                        >
                            📄 Feladatsor
                        </button>
                    </div>
                    )}

                    {/* Témakörök nézet */}
                    {viewMode === 'topics' && (
                        <section className="topics-section">
                            {!selectedLevel ? (
                                <div className="level-selector-section">
                                    <h2 className="section-title">Válassz szintet:</h2>
                                    <p className="section-description">
                                        Válassz egy szintet, hogy témakörönként gyakorolhass!
                                    </p>
                                    <div className="level-selector-buttons">
                                        <button
                                            className="level-select-btn kozep"
                                            onClick={() => setSelectedLevel('kozep')}
                                        >
                                            <span className="level-select-icon">📝</span>
                                            <span className="level-select-name">Közép Szint</span>
                                            <span className="level-select-desc">Középszintű érettségi feladatok</span>
                                        </button>
                                        <button
                                            className="level-select-btn emelt"
                                            onClick={() => setSelectedLevel('emelt')}
                                        >
                                            <span className="level-select-icon">⭐</span>
                                            <span className="level-select-name">Emelt Szint</span>
                                            <span className="level-select-desc">Emelt szintű érettségi feladatok</span>
                                        </button>
                                    </div>
                                </div>
                            ) : pathTopicId && selectedLevel ? (
                                (() => {
                                    const pathTopic = examTopics.find((t) => t.id === pathTopicId);
                                    if (!pathTopic) return null;
                                    return (
                                        <TopicPathMap
                                            topicId={pathTopic.id}
                                            topicTitle={pathTopic.title}
                                            topicIcon={pathTopic.icon}
                                            topicColor={pathTopic.color}
                                            educationLevel="erettsegi"
                                            erettsegiLevel={selectedLevel}
                                            level={selectedLevel}
                                            onBack={handlePathBack}
                                        />
                                    );
                                })()
                            ) : (
                                <>
                                    <div className="selected-level-header">
                                        <h2 className="section-title">
                                            {selectedLevel === 'emelt' ? '⭐ Emelt Szint' : '📝 Közép Szint'} - Témakörök
                                        </h2>
                                        <button
                                            className="change-level-btn"
                                            onClick={() => setSelectedLevel(null)}
                                        >
                                            🔄 Szint váltása
                                        </button>
                                    </div>
                                    <p className="section-description">
                                        Válassz egy témakört — Duolingo-s úton, leckénként haladhatsz!
                                    </p>
                                    {examTopics.length > 0 ? (
                                        <div className="topics-grid">
                                            {examTopics.map(topic => {
                                                const key = resolveProgressStorageKey(topic.id);
                                                const tp = topicProgressMap[key];
                                                const lessonsDone = tp?.lessonsCompleted?.length || 0;
                                                const pct = Math.round((lessonsDone / PATH_LESSON_COUNT) * 100);
                                                return (
                                                <div
                                                    key={topic.id}
                                                    className="topic-card"
                                                    onClick={() => handleTopicClick(topic.id)}
                                                >
                                                    <div className="topic-icon" style={{ color: topic.color }}>
                                                        {topic.icon}
                                                    </div>
                                                    <h3 className="topic-title">{topic.title}</h3>
                                                    <p className="topic-description">{topic.description}</p>
                                                    <div style={{ marginTop: '0.75rem', width: '100%' }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            fontSize: '0.8rem',
                                                            color: tp?.completed ? '#ffd700' : '#9f9',
                                                            marginBottom: '0.35rem'
                                                        }}>
                                                            <span>
                                                                {tp?.completed
                                                                    ? '✓ Út kész'
                                                                    : `${lessonsDone}/${PATH_LESSON_COUNT} lecke`}
                                                            </span>
                                                            <span>{pct}%</span>
                                                        </div>
                                                        <div style={{
                                                            height: '6px',
                                                            background: 'rgba(255,255,255,0.12)',
                                                            borderRadius: '999px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                height: '100%',
                                                                width: `${Math.min(100, pct)}%`,
                                                                background: tp?.completed
                                                                    ? 'linear-gradient(90deg,#ffd700,#39ff14)'
                                                                    : '#39ff14',
                                                                borderRadius: '999px'
                                                            }} />
                                                        </div>
                                                    </div>
                                                    <div className="topic-arrow">→</div>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#ffffff', textAlign: 'center', marginTop: '2rem' }}>
                                            Kérjük, válassz egy szintet!
                                        </p>
                                    )}
                                </>
                            )}
                        </section>
                    )}

                    {/* Érettségi feladatsorok nézet */}
                    {viewMode === 'papers' && (
                        <section className="papers-section">
                            <div className="papers-header">
                                <h2 className="section-title">Érettségi Feladatsorok</h2>
                                <p className="section-description">
                                    2020–2026, külön május és október. Először válassz szintet, majd egy
                                    játszható sort. Most a 2026. májusi és a 2025. októberi középszint él.
                                </p>
                            </div>
                            {!selectedLevel ? (
                                <div className="level-selector-section">
                                    <h2 className="section-title">Válassz szintet:</h2>
                                    <div className="level-selector-buttons">
                                        <button
                                            className="level-select-btn kozep"
                                            onClick={() => setSelectedLevel('kozep')}
                                        >
                                            <span className="level-select-icon">📝</span>
                                            <span className="level-select-name">Közép Szint</span>
                                            <span className="level-select-desc">Május és október külön</span>
                                        </button>
                                        <button
                                            className="level-select-btn emelt"
                                            onClick={() => setSelectedLevel('emelt')}
                                        >
                                            <span className="level-select-icon">⭐</span>
                                            <span className="level-select-name">Emelt Szint</span>
                                            <span className="level-select-desc">Május és október külön</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="clear-filter-btn"
                                        onClick={() => setSelectedLevel(null)}
                                        style={{ marginBottom: '1.25rem' }}
                                    >
                                        ← Másik szint
                                    </button>
                                    {yearGroups.map(({ year, papers }) => (
                                        <div key={year} className="er-year-row">
                                            <h3 className="er-year-title">{year}</h3>
                                            <div className="er-month-grid">
                                                {papers.map((paper) => (
                                                    <button
                                                        key={paper.id}
                                                        type="button"
                                                        className={`er-paper-card ${paper.ready ? 'ready' : 'soon'}`}
                                                        onClick={() => handlePaperClick(paper)}
                                                    >
                                                        <div className="er-month-num">
                                                            {paper.month === 'majus' ? '05' : '10'}
                                                        </div>
                                                        <h4>{paper.title}</h4>
                                                        <p>{paper.subtitle}</p>
                                                        <span className={`er-badge ${paper.ready ? 'ready' : 'soon'}`}>
                                                            {paper.ready
                                                                ? `${paper.questionCount} feladat · ${paper.timeLimitMin} perc`
                                                                : 'Hamarosan'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </section>
                    )}
                </div>
            </div>

            <style jsx>{`
                .erettsegi-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
                    color: #ffffff;
                    font-family: 'Montserrat', 'Open Sans', sans-serif;
                    padding: 2rem;
                    position: relative;
                    overflow-x: hidden;
                }

                .erettsegi-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding-top: 80px;
                }

                .erettsegi-title {
                    color: #39ff14;
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }

                .erettsegi-subtitle {
                    color: #ffcccc;
                    font-size: 1.3rem;
                    font-weight: 400;
                }

                .erettsegi-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .prep-choose-section {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .prep-choose-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 1.25rem;
                    max-width: 860px;
                    margin: 0 auto;
                }

                .prep-choose-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.65rem;
                    min-height: 220px;
                    padding: 2rem 1.5rem;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 2px solid rgba(57, 255, 20, 0.45);
                    color: #ffffff;
                    cursor: pointer;
                    text-align: center;
                    backdrop-filter: blur(10px);
                    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .prep-choose-card:hover {
                    transform: translateY(-4px);
                    border-color: #39ff14;
                    box-shadow: 0 10px 28px rgba(57, 255, 20, 0.22);
                }

                .prep-choose-card.papers {
                    border-color: rgba(255, 215, 0, 0.5);
                }

                .prep-choose-card.papers:hover {
                    border-color: #ffd700;
                    box-shadow: 0 10px 28px rgba(255, 215, 0, 0.2);
                }

                .prep-choose-icon {
                    font-size: 2.4rem;
                    line-height: 1;
                }

                .prep-choose-name {
                    font-size: 1.35rem;
                    font-weight: 800;
                    color: #39ff14;
                }

                .prep-choose-card.papers .prep-choose-name {
                    color: #ffd700;
                }

                .prep-choose-desc {
                    color: #ffcccc;
                    font-size: 0.98rem;
                    line-height: 1.45;
                    font-weight: 500;
                }

                .view-mode-selector {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 3rem;
                }

                .mode-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    border-radius: 15px;
                    padding: 1rem 2rem;
                    color: #ffffff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .mode-btn:hover {
                    background: rgba(57, 255, 20, 0.2);
                    border-color: #39ff14;
                    transform: translateY(-2px);
                }

                .mode-btn.active {
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    border-color: #39ff14;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
                }

                .section-title {
                    color: #39ff14;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
                }

                .section-description {
                    color: #ffffff;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }

                .topics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .topic-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 2rem;
                    border: 1px solid rgba(57, 255, 20, 0.3);
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    cursor: pointer;
                    position: relative;
                }

                .topic-card:hover {
                    transform: translateY(-5px);
                    border-color: #39ff14;
                    box-shadow: 0 8px 30px rgba(57, 255, 20, 0.3);
                }

                .topic-icon {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                    filter: drop-shadow(0 0 10px currentColor);
                }

                .topic-title {
                    color: #ffcccc;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .topic-description {
                    color: #ffffff;
                    line-height: 1.6;
                    opacity: 0.9;
                    margin-bottom: 1rem;
                }

                .topic-arrow {
                    color: #39ff14;
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-top: 1rem;
                }

                .papers-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .clear-filter-btn {
                    background: rgba(255, 77, 198, 0.2);
                    border: 2px solid rgba(255, 77, 198, 0.5);
                    border-radius: 10px;
                    padding: 0.5rem 1rem;
                    color: #ff77c6;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .clear-filter-btn:hover {
                    background: rgba(255, 77, 198, 0.3);
                    border-color: #ff77c6;
                }

                .papers-by-year {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                .year-group {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 2rem;
                    border: 1px solid rgba(57, 255, 20, 0.2);
                }

                .year-title {
                    color: #39ff14;
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
                }

                .papers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .er-year-row {
                    margin: 0 0 1.5rem;
                }

                .er-year-title {
                    color: #fff;
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0 0 0.65rem;
                }

                .er-month-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 0.85rem;
                }

                .er-paper-card {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.25rem;
                    min-height: 168px;
                    padding: 1.15rem 1.2rem 1.05rem;
                    border-radius: 16px;
                    background: rgba(20, 28, 44, 0.55);
                    border: 1px solid rgba(57, 255, 20, 0.22);
                    color: inherit;
                    text-align: left;
                    cursor: pointer;
                    transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
                }

                .er-paper-card h4 {
                    margin: 0;
                    color: #39ff14;
                    font-size: 1.05rem;
                }

                .er-paper-card p {
                    margin: 0;
                    color: #c5c5d0;
                    font-size: 0.88rem;
                    line-height: 1.35;
                }

                .er-paper-card.ready:hover {
                    transform: translateY(-3px);
                    border-color: #39ff14;
                    box-shadow: 0 10px 24px rgba(57, 255, 20, 0.12);
                }

                .er-paper-card.soon {
                    opacity: 0.62;
                    cursor: default;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .er-month-num {
                    font-size: 1.7rem;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 0.2rem;
                }

                .er-badge {
                    margin-top: auto;
                    padding: 0.22rem 0.55rem;
                    border-radius: 999px;
                    font-size: 0.72rem;
                    font-weight: 800;
                }

                .er-badge.ready {
                    background: rgba(57, 255, 20, 0.16);
                    color: #39ff14;
                }

                .er-badge.soon {
                    background: rgba(255, 255, 255, 0.08);
                    color: #9a9aa8;
                }

                .paper-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 1.5rem;
                    border: 1px solid rgba(57, 255, 20, 0.3);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .paper-card:hover {
                    transform: translateY(-5px);
                    border-color: #39ff14;
                    box-shadow: 0 8px 30px rgba(57, 255, 20, 0.3);
                }

                .paper-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: 1rem;
                    gap: 1rem;
                }

                .paper-title {
                    color: #ffcccc;
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin: 0;
                    flex: 1;
                }

                .paper-type {
                    padding: 0.3rem 0.8rem;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .paper-type.emelt {
                    background: rgba(255, 215, 0, 0.2);
                    border: 1px solid rgba(255, 215, 0, 0.5);
                    color: #ffd700;
                }

                .paper-type.kozep {
                    background: rgba(57, 255, 20, 0.2);
                    border: 1px solid rgba(57, 255, 20, 0.5);
                    color: #39ff14;
                }

                .paper-description {
                    color: #ffffff;
                    line-height: 1.6;
                    opacity: 0.9;
                    margin-bottom: 1rem;
                }

                .paper-meta {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }

                .meta-item {
                    color: #78dbff;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .paper-topics {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .topic-tag {
                    padding: 0.3rem 0.6rem;
                    border: 1px solid;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.1);
                }

                .paper-action {
                    text-align: right;
                    margin-top: 1rem;
                }

                .action-text {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 1rem;
                }

                .erettsegi-footer {
                    margin-top: 4rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(57, 255, 20, 0.3);
                    text-align: center;
                }

                .back-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    border-radius: 15px;
                    padding: 0.8rem 2rem;
                    color: #ffffff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .back-btn:hover {
                    background: rgba(57, 255, 20, 0.2);
                    border-color: #39ff14;
                    transform: translateY(-2px);
                }

                @keyframes neonGlow {
                    from {
                        text-shadow: 0 0 20px rgba(57, 255, 20, 0.5), 0 0 30px rgba(57, 255, 20, 0.3);
                    }
                    to {
                        text-shadow: 0 0 30px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.5);
                    }
                }

                .level-selector-section {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .level-selector-buttons {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 2rem;
                }

                .level-select-btn {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 2rem;
                    border: 2px solid rgba(57, 255, 20, 0.3);
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    min-width: 250px;
                }

                .level-select-btn:hover {
                    transform: translateY(-5px);
                    border-color: #39ff14;
                    box-shadow: 0 8px 30px rgba(57, 255, 20, 0.3);
                }

                .level-select-btn.kozep {
                    border-color: rgba(57, 255, 20, 0.5);
                }

                .level-select-btn.emelt {
                    border-color: rgba(255, 215, 0, 0.5);
                }

                .level-select-btn.emelt:hover {
                    border-color: #ffd700;
                    box-shadow: 0 8px 30px rgba(255, 215, 0, 0.3);
                }

                .level-select-icon {
                    font-size: 3rem;
                    filter: drop-shadow(0 0 10px currentColor);
                }

                .level-select-name {
                    color: #ffcccc;
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                .level-select-desc {
                    color: #ffffff;
                    line-height: 1.6;
                    opacity: 0.9;
                    font-size: 0.95rem;
                }

                .selected-level-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .change-level-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    border-radius: 10px;
                    padding: 0.5rem 1rem;
                    color: #39ff14;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .change-level-btn:hover {
                    background: rgba(57, 255, 20, 0.2);
                    border-color: #39ff14;
                }

                @media (max-width: 768px) {
                    .erettsegi-title {
                        font-size: 2.5rem;
                    }

                    .topics-grid,
                    .papers-grid {
                        grid-template-columns: 1fr;
                    }

                    .view-mode-selector {
                        flex-direction: column;
                    }

                    .papers-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .level-selector-buttons {
                        flex-direction: column;
                        align-items: center;
                    }

                    .selected-level-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </>
    );
}

