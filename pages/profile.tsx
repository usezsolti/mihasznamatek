import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface GameResult {
    id: string;
    topicId?: string;
    topicTitle?: string;
    educationLevel?: string;
    gameMode?: string;
    correct: number;
    total: number;
    score: number;
    completedAt: any;
    topic?: string;
    level?: string;
    grade?: number;
    subject?: string;
}

interface UserStats {
    totalGames: number;
    totalQuestions: number;
    totalCorrect: number;
    totalWrong: number;
    averageScore: number;
    bestScore: number;
    topicsPlayed: string[];
    educationLevels: { [key: string]: number };
}

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [gameResults, setGameResults] = useState<GameResult[]>([]);
    const [stats, setStats] = useState<UserStats>({
        totalGames: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalWrong: 0,
        averageScore: 0,
        bestScore: 0,
        topicsPlayed: [],
        educationLevels: {}
    });
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'elementary' | 'highschool' | 'university' | 'erettsegi'>('all');

    useEffect(() => {
        const checkAuth = async () => {
            let attempts = 0;
            while (!(window as any).firebase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!(window as any).firebase) {
                setLoading(false);
                return;
            }

            try {
                const auth = (window as any).firebase.auth();
                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user) {
                        router.replace('/');
                        return;
                    }

                    setCurrentUser(user);
                    await loadGameResults(user.uid);
                    setLoading(false);
                });

                return () => unsub();
            } catch (err) {
                console.error('Auth error:', err);
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const loadGameResults = async (userId: string) => {
        try {
            const db = (window as any).firebase.firestore();
            
            // Betöltjük az összes játék eredményt
            const resultsSnapshot = await db.collection('gameResults')
                .where('userId', '==', userId)
                .orderBy('completedAt', 'desc')
                .limit(100)
                .get();

            const results: GameResult[] = [];
            resultsSnapshot.forEach((doc: any) => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            setGameResults(results);
            calculateStats(results);
        } catch (error) {
            console.error('Error loading game results:', error);
        }
    };

    const calculateStats = (results: GameResult[]) => {
        const newStats: UserStats = {
            totalGames: results.length,
            totalQuestions: 0,
            totalCorrect: 0,
            totalWrong: 0,
            averageScore: 0,
            bestScore: 0,
            topicsPlayed: [],
            educationLevels: {}
        };

        let totalScore = 0;
        const topicsSet = new Set<string>();

        results.forEach(result => {
            newStats.totalQuestions += result.total || 0;
            newStats.totalCorrect += result.correct || 0;
            newStats.totalWrong += (result.total || 0) - (result.correct || 0);
            
            const score = result.score || 0;
            totalScore += score;
            if (score > newStats.bestScore) {
                newStats.bestScore = score;
            }

            if (result.topicTitle) {
                topicsSet.add(result.topicTitle);
            }
            if (result.topic) {
                topicsSet.add(result.topic);
            }

            const level = result.educationLevel || result.gameMode || 'unknown';
            newStats.educationLevels[level] = (newStats.educationLevels[level] || 0) + 1;
        });

        newStats.averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;
        newStats.topicsPlayed = Array.from(topicsSet);

        setStats(newStats);
    };

    const filteredResults = gameResults.filter(result => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'elementary') return result.educationLevel === 'elementary';
        if (selectedFilter === 'highschool') return result.educationLevel === 'highschool';
        if (selectedFilter === 'university') return result.educationLevel === 'university';
        if (selectedFilter === 'erettsegi') return result.gameMode === 'erettsegi' || result.level;
        return true;
    });

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Ismeretlen dátum';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#39ff14'
            }}>
                <div>Betöltés...</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Profil - Mihaszna Matek</title>
            </Head>
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                padding: '2rem',
                color: '#ffffff'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #39ff14 0%, #ff69b4 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: 0
                        }}>
                            👤 Profil
                        </h1>
                        <button
                            onClick={() => router.push('/dashboard')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'rgba(57, 255, 20, 0.2)',
                                border: '2px solid #39ff14',
                                borderRadius: '15px',
                                color: '#39ff14',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            ← Vissza a Dashboard-ra
                        </button>
                    </div>

                    {/* User Info */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(57, 255, 20, 0.5)',
                        borderRadius: '25px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, #39ff14, #ff69b4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold'
                            }}>
                                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: '1.8rem',
                                    margin: '0 0 0.5rem 0',
                                    color: '#ffffff'
                                }}>
                                    {currentUser?.displayName || currentUser?.email || 'Felhasználó'}
                                </h2>
                                <p style={{
                                    color: '#39ff14',
                                    margin: 0,
                                    fontSize: '1rem'
                                }}>
                                    {currentUser?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalGames}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Összes játék
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalCorrect}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Helyes válaszok
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalQuestions}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Összes kérdés
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalQuestions > 0 
                                    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) 
                                    : 0}%
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Sikerességi arány
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.bestScore}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Legjobb pontszám
                            </div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setSelectedFilter('all')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'all' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'all' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Összes
                        </button>
                        <button
                            onClick={() => setSelectedFilter('elementary')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'elementary' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'elementary' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🎒 Általános iskola
                        </button>
                        <button
                            onClick={() => setSelectedFilter('highschool')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'highschool' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'highschool' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            📚 Középiskola
                        </button>
                        <button
                            onClick={() => setSelectedFilter('university')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'university' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'university' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🎓 Egyetem
                        </button>
                        <button
                            onClick={() => setSelectedFilter('erettsegi')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'erettsegi' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'erettsegi' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            📚 Érettségi
                        </button>
                    </div>

                    {/* Game Results */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(57, 255, 20, 0.5)',
                        borderRadius: '25px',
                        padding: '2rem',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            marginBottom: '1.5rem',
                            color: '#39ff14'
                        }}>
                            Játék Eredmények ({filteredResults.length})
                        </h2>

                        {filteredResults.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#ffffff'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                <p>Még nincsenek mentett eredmények.</p>
                                <p style={{ color: '#39ff14', marginTop: '0.5rem' }}>
                                    Játssz néhány játékot, hogy itt megjelenjenek az eredményeid!
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gap: '1rem'
                            }}>
                                {filteredResults.map((result) => (
                                    <div
                                        key={result.id}
                                        style={{
                                            background: 'rgba(57, 255, 20, 0.1)',
                                            border: '2px solid rgba(57, 255, 20, 0.4)',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <h3 style={{
                                                fontSize: '1.2rem',
                                                margin: '0 0 0.5rem 0',
                                                color: '#39ff14'
                                            }}>
                                                {result.topicTitle || result.topic || 'Ismeretlen témakör'}
                                            </h3>
                                            <div style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                flexWrap: 'wrap',
                                                fontSize: '0.9rem',
                                                color: '#ffffff'
                                            }}>
                                                {result.educationLevel && (
                                                    <span>
                                                        {result.educationLevel === 'elementary' ? '🎒' : 
                                                         result.educationLevel === 'highschool' ? '📚' : 
                                                         result.educationLevel === 'university' ? '🎓' : ''} 
                                                        {result.educationLevel === 'elementary' ? 'Általános iskola' : 
                                                         result.educationLevel === 'highschool' ? 'Középiskola' : 
                                                         result.educationLevel === 'university' ? 'Egyetem' : result.educationLevel}
                                                    </span>
                                                )}
                                                {result.level && (
                                                    <span>Szint: {result.level === 'kozep' ? 'Közép' : 'Emelt'}</span>
                                                )}
                                                {result.grade && (
                                                    <span>{result.grade}. osztály</span>
                                                )}
                                                {result.subject && (
                                                    <span>Tantárgy: {result.subject}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '2rem',
                                            alignItems: 'center',
                                            flexWrap: 'wrap'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#39ff14'
                                                }}>
                                                    {result.correct}/{result.total}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: '#ffffff'
                                                }}>
                                                    Helyes/Összes
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#39ff14'
                                                }}>
                                                    {result.score}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: '#ffffff'
                                                }}>
                                                    Pontszám
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: '#ffffff',
                                                textAlign: 'right'
                                            }}>
                                                {formatDate(result.completedAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

