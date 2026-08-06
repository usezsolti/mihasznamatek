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

interface ExamTopic {
    id: string;
    title: string;
    icon: string;
    color: string;
    description: string;
}

interface ExamPaper {
    id: string;
    year: number;
    type: 'közép' | 'emelt';
    title: string;
    description: string;
    questions: number;
    timeLimit: number; // minutes
    topics: string[];
}

export default function ErettsegiFelkeszules() {
    const router = useRouter();
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null);
    const [viewMode, setViewMode] = useState<'topics' | 'papers'>('topics');
    const [selectedLevel, setSelectedLevel] = useState<'kozep' | 'emelt' | null>(null);
    const [topicProgressMap, setTopicProgressMap] = useState<Partial<Record<string, TopicProgress>>>({});
    const [pathTopicId, setPathTopicId] = useState<string | null>(null);

    useEffect(() => {
        // URL paraméter alapján beállítjuk a módot
        if (router.query.mode === 'papers') {
            setViewMode('papers');
        } else if (router.query.mode === 'topics') {
            setViewMode('topics');
        }
        
        // Szint paraméter kezelése
        if (router.query.level === 'emelt' || router.query.level === 'kozep') {
            setSelectedLevel(router.query.level as 'kozep' | 'emelt');
        }

        // Visszatérés a játékból: path újra megnyitása
        if (typeof router.query.topic === 'string' && router.query.topic) {
            setPathTopicId(router.query.topic);
            setViewMode('topics');
        }
    }, [router.query.mode, router.query.level, router.query.topic]);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                let attempts = 0;
                while (!(window as any).firebase?.auth && attempts < 40) {
                    await new Promise((r) => setTimeout(r, 100));
                    attempts++;
                }
                const user = (window as any).firebase?.auth?.()?.currentUser;
                if (!user) return;
                const prog: UserPracticeProgress = await loadUserPracticeProgress(user.uid);
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
            description: 'Halmazműveletek, Venn-diagramok'
        },
        {
            id: 'kombinatorika',
            title: 'Kombinatorika',
            icon: '🔢',
            color: '#39ff14',
            description: 'Permutáció, kombináció, variáció'
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
            description: 'Haladó halmazműveletek, Venn-diagramok'
        },
        {
            id: 'kombinatorika-emelt',
            title: 'Kombinatorika',
            icon: '🔢',
            color: '#ffd700',
            description: 'Haladó permutáció, kombináció, variáció feladatok'
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

    // Érettségi feladatsorok - 10 közép és 10 emelt szintű feladatsor, mindegyik vegyes témakörökből
    const examPapers: ExamPaper[] = [
        // 10 közép szintű feladatsor
        ...Array.from({ length: 10 }, (_, i) => ({
            id: `feladatsor-kozep-${i + 1}`,
            year: i + 1,
            type: 'közép' as 'közép' | 'emelt',
            title: `Közép Szint - Feladatsor ${i + 1}`,
            description: `Érettségi feladatsor ${i + 1} - közép szint, vegyes témakörökből`,
            questions: 50,
            timeLimit: 180,
            topics: ['algebra', 'geometria', 'trigonometria', 'valoszinuseg', 'logaritmus', 'sorozatok', 'fuggvenyek']
        })),
        // 10 emelt szintű feladatsor
        ...Array.from({ length: 10 }, (_, i) => ({
            id: `feladatsor-emelt-${i + 1}`,
            year: i + 11,
            type: 'emelt' as 'közép' | 'emelt',
            title: `Emelt Szint - Feladatsor ${i + 1}`,
            description: `Érettségi feladatsor ${i + 1} - emelt szint, vegyes témakörökből`,
            questions: 50,
            timeLimit: 180,
            topics: ['algebra', 'geometria', 'trigonometria', 'analizis', 'valoszinuseg', 'logaritmus', 'sorozatok', 'fuggvenyek']
        }))
    ];

    const filteredPapers = selectedTopic
        ? examPapers.filter(paper => paper.topics.includes(selectedTopic))
        : examPapers;

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

    const handlePaperClick = (paper: ExamPaper) => {
        // Navigálás a játékhoz érettségi módban - közép vagy emelt szintű feladatokkal vegyes témakörökből
        const level = paper.type === 'emelt' ? 'emelt' : 'kozep';
        router.push(`/game?erettsegi=true&paperId=${paper.id}&level=${level}`);
    };

    const getTopicById = (topicId: string) => {
        return examTopics.find(t => t.id === topicId);
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
                        Témakörök szerinti gyakorlás és érettségi feladatsorok
                    </p>
                </div>

                <div className="erettsegi-content">
                    {/* Navigációs gombok */}
                    <div className="view-mode-selector">
                        <button
                            className={`mode-btn ${viewMode === 'topics' ? 'active' : ''}`}
                            onClick={() => {
                                setViewMode('topics');
                                setSelectedTopic(null);
                            }}
                        >
                            📖 Témakörök
                        </button>
                        <button
                            className={`mode-btn ${viewMode === 'papers' ? 'active' : ''}`}
                            onClick={() => setViewMode('papers')}
                        >
                            📄 Érettségi Feladatsorok
                        </button>
                    </div>

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
                                <h2 className="section-title">
                                    {selectedTopic ? `${getTopicById(selectedTopic)?.title} - Érettségi Feladatsorok` : 'Érettségi Feladatsorok'}
                                </h2>
                                {selectedTopic && (
                                    <button
                                        className="clear-filter-btn"
                                        onClick={() => setSelectedTopic(null)}
                                    >
                                        ✕ Szűrő törlése
                                    </button>
                                )}
                            </div>

                            {/* Feladatsorok listázása 1-10-ig */}
                            <div className="papers-grid">
                                {filteredPapers.map(paper => (
                                    <div
                                        key={paper.id}
                                        className="paper-card"
                                        onClick={() => handlePaperClick(paper)}
                                    >
                                        <div className="paper-header">
                                            <h4 className="paper-title">{paper.title}</h4>
                                            <span className="paper-type" style={{
                                                background: 'rgba(57, 255, 20, 0.2)',
                                                border: '1px solid rgba(57, 255, 20, 0.5)',
                                                color: '#39ff14',
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '10px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                🔀 Vegyes
                                            </span>
                                        </div>
                                        <p className="paper-description">{paper.description}</p>
                                        <div className="paper-meta">
                                            <span className="meta-item">❓ {paper.questions} feladat</span>
                                            <span className="meta-item">⏱️ {paper.timeLimit} perc</span>
                                        </div>
                                        <div className="paper-action">
                                            <span className="action-text">Kezdés →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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

