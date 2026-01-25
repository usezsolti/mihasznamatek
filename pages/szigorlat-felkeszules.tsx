import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SzigorlatFelkeszules() {
    const router = useRouter();

    // Szigorlat témakörök - minden egyetemi tantárgyból
    const szigorlatTopics = [
        { id: 'analizis1-osszes', title: 'Analízis I. - Összes témakör', icon: '∫', subject: 'analizis1' },
        { id: 'analizis2-osszes', title: 'Analízis II. - Összes témakör', icon: '∂', subject: 'analizis2' },
        { id: 'analizis3-osszes', title: 'Analízis III. - Összes témakör', icon: '∭', subject: 'analizis3' },
        { id: 'vegyes-szigorlat', title: 'Vegyes Szigorlat', icon: '📚', subject: 'vegyes' },
    ];

    const handleTopicClick = (topicId: string, subject: string) => {
        if (subject === 'vegyes') {
            router.push(`/game?szigorlat=true&vegyes=true`);
        } else {
            router.push(`/game?szigorlat=true&subject=${subject}`);
        }
    };

    return (
        <>
            <Head>
                <title>Szigorlat Felkészülés - UniBoost</title>
            </Head>
            <div className="container">
                <style jsx>{`
                    .container {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                        padding: 2rem;
                        color: #ffffff;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 3rem;
                    }
                    .header h1 {
                        font-size: 2.5rem;
                        background: linear-gradient(90deg, #39ff14 0%, #ff69b4 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 0.5rem;
                    }
                    .topics-section {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .topics-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 1.5rem;
                        margin-top: 2rem;
                    }
                    .topic-card {
                        background: rgba(57, 255, 20, 0.1);
                        border: 2px solid rgba(57, 255, 20, 0.3);
                        border-radius: 15px;
                        padding: 1.5rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-align: center;
                    }
                    .topic-card:hover {
                        background: rgba(57, 255, 20, 0.2);
                        border-color: #39ff14;
                        transform: translateY(-5px);
                    }
                    .topic-icon {
                        font-size: 3rem;
                        margin-bottom: 1rem;
                    }
                    .topic-title {
                        font-size: 1.2rem;
                        color: #39ff14;
                        margin: 0;
                    }
                    .back-button {
                        background: rgba(255, 73, 219, 0.2);
                        border: 2px solid rgba(255, 73, 219, 0.5);
                        color: #FF49DB;
                        padding: 0.75rem 1.5rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 1rem;
                        font-weight: 600;
                        margin-bottom: 2rem;
                        transition: all 0.3s ease;
                    }
                    .back-button:hover {
                        background: rgba(255, 73, 219, 0.3);
                        border-color: #FF49DB;
                    }
                `}</style>
                <div className="header">
                    <h1>📝 Szigorlat Felkészülés</h1>
                    <p style={{ fontSize: '1.2rem', color: '#cccccc' }}>
                        Szigorlatra felkészítő feladatok
                    </p>
                </div>
                <div className="topics-section">
                    <button
                        className="back-button"
                        onClick={() => router.push('/game')}
                    >
                        ← Vissza a játékhoz
                    </button>
                    <div className="topics-grid">
                        {szigorlatTopics.map(topic => (
                            <div
                                key={topic.id}
                                className="topic-card"
                                onClick={() => handleTopicClick(topic.id, topic.subject)}
                            >
                                <div className="topic-icon">{topic.icon}</div>
                                <h3 className="topic-title">{topic.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

