import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { KOZPONTI_PAPERS } from '../utils/game/kozpontiPapers';
import { agentDebugLog } from '../utils/agentDebugLog';

export default function KozpontiFelkeszules() {
    const router = useRouter();

    const kozpontiTopics = [
        { id: 'szamitas', title: 'Számítás', icon: '🔢', description: 'Alapműveletek, számolási feladatok' },
        { id: 'algebra', title: 'Algebra', icon: '📐', description: 'Egyenletek, egyenlőtlenségek, kifejezések' },
        { id: 'geometria', title: 'Geometria', icon: '📏', description: 'Síkgeometria, testek, terület, kerület' },
        { id: 'szoveges', title: 'Szöveges feladatok', icon: '📝', description: 'Szöveges problémák megoldása' },
        { id: 'halmazok', title: 'Halmazok', icon: '{}', description: 'Halmazműveletek, halmazok közötti kapcsolatok' },
        { id: 'fuggvenyek', title: 'Függvények', icon: '📈', description: 'Függvények, grafikonok, függvényvizsgálat' },
        { id: 'statisztika', title: 'Statisztika', icon: '📊', description: 'Adatok elemzése, átlag, medián' },
        { id: 'valoszinuseg', title: 'Valószínűség', icon: '🎲', description: 'Valószínűségszámítás alapjai' },
    ];

    useEffect(() => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'L',
            location: 'kozponti-felkeszules.tsx:mount',
            message: 'kf page using namespaced layout',
            data: {
                papers: KOZPONTI_PAPERS.length,
                topics: kozpontiTopics.length,
                usedGlobalSectionClass: false,
            },
            runId: 'kf-layout',
        });
        // #endregion
    }, []);

    const handlePaperClick = (paperId: string, ready: boolean) => {
        if (!ready) return;
        router.push(`/game?kozponti=true&paper=${encodeURIComponent(paperId)}`);
    };

    const handleTopicClick = (topicId: string) => {
        router.push(`/game?kozponti=true&topic=${topicId}`);
    };

    return (
        <>
            <Head>
                <title>Központi felvételi felkészülés - Mihaszna Matek</title>
            </Head>
            <div className="kf-page">
                <style jsx>{`
                    .kf-page {
                        min-height: 100vh;
                        background: linear-gradient(160deg, #07080f 0%, #12182a 55%, #0a0a12 100%);
                        padding: 1.5rem 1.25rem 3rem;
                        color: #fff;
                    }
                    .kf-wrap {
                        max-width: 1080px;
                        margin: 0 auto;
                    }
                    .kf-back {
                        display: inline-flex;
                        align-items: center;
                        margin-bottom: 1.25rem;
                        background: rgba(255, 73, 219, 0.16);
                        border: 2px solid rgba(255, 73, 219, 0.45);
                        color: #ff49db;
                        padding: 0.55rem 1.05rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 0.95rem;
                        font-weight: 700;
                    }
                    .kf-back:hover {
                        background: rgba(255, 73, 219, 0.28);
                    }
                    .kf-hero {
                        text-align: center;
                        margin: 0 0 2rem;
                    }
                    .kf-hero h1 {
                        margin: 0 0 0.45rem;
                        font-size: clamp(1.8rem, 4vw, 2.6rem);
                        background: linear-gradient(90deg, #39ff14, #ff69b4);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .kf-hero p {
                        margin: 0 auto;
                        max-width: 36rem;
                        color: #c8c8d4;
                        font-size: 1.05rem;
                        line-height: 1.45;
                    }
                    .kf-block {
                        margin: 0 0 2.25rem;
                    }
                    .kf-block h2 {
                        margin: 0 0 0.4rem;
                        color: #39ff14;
                        font-size: 1.35rem;
                    }
                    .kf-block > p {
                        margin: 0 0 1.1rem;
                        color: #b7b7c5;
                        max-width: 40rem;
                        line-height: 1.45;
                    }
                    .kf-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
                        gap: 1rem;
                    }
                    .kf-card {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                        min-height: 168px;
                        padding: 1.15rem 1.2rem 1.05rem;
                        border-radius: 16px;
                        background: rgba(20, 28, 44, 0.88);
                        border: 1px solid rgba(57, 255, 20, 0.22);
                        color: inherit;
                        text-align: left;
                        cursor: pointer;
                        transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
                    }
                    .kf-card:hover,
                    .kf-card.ready:hover {
                        transform: translateY(-3px);
                        border-color: #39ff14;
                        box-shadow: 0 10px 24px rgba(57, 255, 20, 0.12);
                    }
                    .kf-card.soon {
                        opacity: 0.62;
                        cursor: default;
                        border-color: rgba(255, 255, 255, 0.1);
                    }
                    .kf-card.soon:hover {
                        transform: none;
                        box-shadow: none;
                    }
                    .kf-year,
                    .kf-icon {
                        font-size: 1.7rem;
                        font-weight: 800;
                        line-height: 1;
                        margin-bottom: 0.35rem;
                    }
                    .kf-card h3 {
                        margin: 0;
                        color: #39ff14;
                        font-size: 1.05rem;
                    }
                    .kf-card p {
                        margin: 0;
                        color: #c5c5d0;
                        font-size: 0.88rem;
                        line-height: 1.35;
                    }
                    .kf-badge {
                        margin-top: auto;
                        padding: 0.22rem 0.55rem;
                        border-radius: 999px;
                        font-size: 0.72rem;
                        font-weight: 800;
                    }
                    .kf-badge.ready {
                        background: rgba(57, 255, 20, 0.16);
                        color: #39ff14;
                    }
                    .kf-badge.soon {
                        background: rgba(255, 255, 255, 0.08);
                        color: #9a9aa8;
                    }
                    @media (max-width: 640px) {
                        .kf-page {
                            padding: 1rem 0.85rem 2.2rem;
                        }
                        .kf-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
                <div className="kf-wrap">
                    <button type="button" className="kf-back" onClick={() => router.push('/dashboard')}>
                        ← Vissza a dashboardra
                    </button>
                    <div className="kf-hero">
                        <h1>Központi felvételi</h1>
                        <p>8. évfolyam · hivatalos sorok évek szerint, plusz témakörös gyakorlás</p>
                    </div>
                    <div className="kf-block">
                        <h2>Feladatsorok évek szerint</h2>
                        <p>
                            A 2026-os Mat1 már bent van. A 2020–2025-ös sorok ugyanide kerülnek, ha megvannak.
                        </p>
                        <div className="kf-grid">
                            {KOZPONTI_PAPERS.map((paper) => (
                                <button
                                    key={paper.id}
                                    type="button"
                                    className={`kf-card ${paper.ready ? 'ready' : 'soon'}`}
                                    onClick={() => handlePaperClick(paper.id, paper.ready)}
                                >
                                    <div className="kf-year">{paper.year}</div>
                                    <h3>{paper.title}</h3>
                                    <p>{paper.subtitle}</p>
                                    <span className={`kf-badge ${paper.ready ? 'ready' : 'soon'}`}>
                                        {paper.ready
                                            ? `${paper.questionCount} feladat · ${paper.timeLimitMin} perc`
                                            : 'Hamarosan'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="kf-block">
                        <h2>Témakörös gyakorlás</h2>
                        <p>Vegyes, generált feladatok a felvételi témakörökre.</p>
                        <div className="kf-grid">
                            {kozpontiTopics.map((topic) => (
                                <button
                                    key={topic.id}
                                    type="button"
                                    className="kf-card"
                                    onClick={() => handleTopicClick(topic.id)}
                                >
                                    <div className="kf-icon">{topic.icon}</div>
                                    <h3>{topic.title}</h3>
                                    <p>{topic.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
