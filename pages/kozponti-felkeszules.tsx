import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
    KOZPONTI_GRADES,
    kozpontiPapersByYear,
    type KozpontiGrade,
} from '../utils/game/kozpontiPapers';
import { agentDebugLog } from '../utils/agentDebugLog';

export default function KozpontiFelkeszules() {
    const router = useRouter();
    const [selectedGrade, setSelectedGrade] = useState<KozpontiGrade | null>(null);

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

    const yearGroups = selectedGrade ? kozpontiPapersByYear(selectedGrade) : [];

    useEffect(() => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H1',
            location: 'kozponti-felkeszules.tsx:mount',
            message: 'kf page tracks',
            data: {
                grades: KOZPONTI_GRADES,
                selectedGrade,
                yearN: yearGroups.length,
                monthsPerYear: yearGroups[0]?.papers.map((p) => p.month) || [],
                y2026: yearGroups
                    .find((g) => g.year === 2026)
                    ?.papers.map((p) => ({ id: p.id, month: p.month, ready: p.ready, n: p.questionCount, sub: p.subtitle })),
                usedGlobalSectionClass: false,
            },
            runId: 'kf-tracks',
        });
        // #endregion
    }, [selectedGrade, yearGroups.length]);

    const handlePaperClick = (paperId: string, ready: boolean, month?: string) => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'H2',
            location: 'kozponti-felkeszules.tsx:paperClick',
            message: 'kf paper click',
            data: { paperId, ready, grade: selectedGrade, month },
            runId: 'kf-tracks',
        });
        // #endregion
        if (!ready) return;
        router.push(`/game?kozponti=true&paper=${encodeURIComponent(paperId)}`);
    };

    const handleTopicClick = (topicId: string) => {
        const gradeQ = selectedGrade ? `&grade=${selectedGrade}` : '';
        router.push(`/game?kozponti=true&topic=${topicId}${gradeQ}`);
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
                    .kf-month-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 0.85rem;
                    }
                    .kf-year-row {
                        margin: 0 0 1.25rem;
                    }
                    .kf-year-row h3 {
                        margin: 0 0 0.55rem;
                        color: #fff;
                        font-size: 1.05rem;
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
                        .kf-grid,
                        .kf-month-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
                <div className="kf-wrap">
                    <button
                        type="button"
                        className="kf-back"
                        onClick={() => {
                            if (selectedGrade) setSelectedGrade(null);
                            else router.push('/dashboard');
                        }}
                    >
                        {selectedGrade ? '← Vissza az évfolyamokhoz' : '← Vissza a dashboardra'}
                    </button>
                    <div className="kf-hero">
                        <h1>Központi felvételi</h1>
                        <p>
                            {selectedGrade
                                ? selectedGrade === 8
                                    ? '8. évfolyam · 9. évfolyamra · évenként külön januári és februári játék'
                                    : '6. évfolyam · 6/8 évfolyamos gimnázium · évenként külön januári és februári játék'
                                : '6. és 8. évfolyam központi írásbeli. Egy éven belül a január és a február külön játék.'}
                        </p>
                    </div>
                    {!selectedGrade ? (
                        <div className="kf-block">
                            <h2>Válassz évfolyamot</h2>
                            <p>A 6. évfolyam a 6/8 évfolyamos, a 8. évfolyam a 9. évfolyamra készülő felvételi.</p>
                            <div className="kf-grid">
                                {KOZPONTI_GRADES.map((grade) => (
                                    <button
                                        key={grade}
                                        type="button"
                                        className="kf-card ready"
                                        onClick={() => {
                                            // #region agent log
                                            agentDebugLog({
                                                hypothesisId: 'H1',
                                                location: 'kozponti-felkeszules.tsx:gradeClick',
                                                message: 'kf grade selected',
                                                data: { grade },
                                                runId: 'kf-tracks',
                                            });
                                            // #endregion
                                            setSelectedGrade(grade);
                                        }}
                                    >
                                        <div className="kf-year">{grade}.</div>
                                        <h3>{grade}. évfolyam</h3>
                                        <p>
                                            {grade === 6
                                                ? 'Központi írásbeli 6/8 évfolyamos gimnáziumba'
                                                : 'Központi írásbeli 9. évfolyamra'}
                                        </p>
                                        <span className="kf-badge ready">Január és február külön</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="kf-block">
                                <h2>Feladatsorok évek szerint</h2>
                                <p>
                                    Minden évben a januári rendes és a februári pótló írásbeli külön játék. Jelenleg a
                                    2026–2023 8. évfolyam sorai, valamint a 2022-es január 22., január 27. és február 4. sora játszható.
                                </p>
                                {yearGroups.map(({ year, papers }) => (
                                    <div key={year} className="kf-year-row">
                                        <h3>{year}</h3>
                                        <div className="kf-month-grid">
                                            {papers.map((paper) => (
                                                <button
                                                    key={paper.id}
                                                    type="button"
                                                    className={`kf-card ${paper.ready ? 'ready' : 'soon'}`}
                                                    onClick={() =>
                                                        handlePaperClick(paper.id, paper.ready, paper.month)
                                                    }
                                                >
                                                    <div className="kf-year">
                                                        {paper.month === 'januar'
                                                            ? '01'
                                                            : paper.month === 'februar'
                                                              ? '02'
                                                              : '03'}
                                                    </div>
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
                                ))}
                            </div>
                            <div className="kf-block">
                                <h2>Témakörös gyakorlás</h2>
                                <p>Vegyes, generált feladatok a {selectedGrade}. évfolyam felvételi témaköreire.</p>
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
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
