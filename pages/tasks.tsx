import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

// Firebase típus definíciók
// Window interface már definiálva van a types/global.d.ts fájlban

type Task = {
    id: string;
    title: string;
    description: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
    dueDate: string;
    completed: boolean;
    assignedBy: string;
    assignedDate: string;
    solution?: string;
    notes?: string;
    type?: 'regular' | 'mini-game';
    gameComponent?: string;
    studentId?: string;
};

type UserDoc = {
    uid?: string;
    name?: string;
    fullName?: string;
    email?: string;
    grade?: string;
    course?: string;
};

// Session-based auth (Auth.js) — no Firebase client
const useAuthReady = () => {
    const { status } = useSession();
    return {
        isReady: status !== 'loading',
        authError: null as string | null,
    };
};

export default function Tasks() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserDoc | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [error, setError] = useState<string | null>(null);

    const { isReady: isAuthReady, authError } = useAuthReady();

    useEffect(() => {
        // Admin panelből betöltött feladatok - felhasználó-specifikus
        const loadAdminTasks = () => {
            try {
                const adminTasks = JSON.parse(localStorage.getItem('admin_tasks') || '[]');
                console.log('Admin feladatok betöltve:', adminTasks.length, 'feladat');

                // Felhasználó azonosítása
                const currentUser = localStorage.getItem('currentUser');
                let userTasks: Task[] = [];

                if (currentUser) {
                    try {
                        const userData = JSON.parse(currentUser);
                        console.log('Felhasználó adatok:', userData);

                        // Felhasználó-specifikus feladatok szűrése
                        if (userData.email === 'anna@example.com') {
                            userTasks = adminTasks.filter((task: Task) => task.studentId === 'demo_1');
                            console.log('Kovács Anna feladatai:', userTasks.length);
                        } else if (userData.email === 'peter@example.com') {
                            userTasks = adminTasks.filter((task: Task) => task.studentId === 'demo_2');
                            console.log('Nagy Péter feladatai:', userTasks.length);
                        } else if (userData.email === 'eszter@example.com') {
                            userTasks = adminTasks.filter((task: Task) => task.studentId === 'demo_3');
                            console.log('Szabó Eszter feladatai:', userTasks.length);
                        } else if (userData.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3') {
                            // Admin látja az összes admin által kiosztott feladatot
                            userTasks = [...adminTasks];
                            console.log('Admin - kiosztott feladatok:', userTasks.length);
                        } else {
                            // Ha nem ismert felhasználó, üres lista
                            userTasks = [];
                            console.log('Ismeretlen felhasználó, üres feladatlista');
                        }
                    } catch (userError) {
                        console.error('Hiba a felhasználó adatok feldolgozásakor:', userError);
                        userTasks = [];
                    }
                } else {
                    console.log('Nincs bejelentkezett felhasználó');
                    userTasks = [];
                }

                setTasks(userTasks);
                setLoading(false);
            } catch (error) {
                console.error('Hiba az admin feladatok betöltésekor:', error);
                setTasks([]);
                setLoading(false);
            }
        };

        // Kezdeti betöltés
        loadAdminTasks();

        // Stabil betöltés késleltetéssel - felhasználó-specifikus
        const initialLoadTimeout = setTimeout(() => {
            const adminTasks = JSON.parse(localStorage.getItem('admin_tasks') || '[]');
            const currentUser = localStorage.getItem('currentUser');
            let userTasks: Task[] = [];

            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    if (userData.email === 'anna@example.com') {
                        userTasks = adminTasks.filter((task: any) => task.studentId === 'demo_1');
                    } else if (userData.email === 'peter@example.com') {
                        userTasks = adminTasks.filter((task: any) => task.studentId === 'demo_2');
                    } else if (userData.email === 'eszter@example.com') {
                        userTasks = adminTasks.filter((task: any) => task.studentId === 'demo_3');
                    } else if (userData.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3') {
                        // Admin látja az összes admin által kiosztott feladatot
                        userTasks = [...adminTasks];
                    }
                } catch (error) {
                    console.error('Hiba a késleltetett betöltésben:', error);
                }
            }

            console.log('Késleltetett betöltés:', userTasks.length, 'feladat');
            setTasks(userTasks);
        }, 1000);

        // Automatikus frissítés az admin panel változásaihoz - felhasználó-specifikus
        const interval = setInterval(() => {
            const adminTasks = JSON.parse(localStorage.getItem('admin_tasks') || '[]');
            const currentUser = localStorage.getItem('currentUser');
            let userTasks: Task[] = [];

            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    if (userData.email === 'anna@example.com') {
                        userTasks = adminTasks.filter((task: any) => task.studentId === 'demo_1');
                    } else if (userData.email === 'peter@example.com') {
                        userTasks = adminTasks.filter((task: any) => task.studentId === 'demo_2');
                    } else if (userData.email === 'eszter@example.com') {
                        userTasks = adminTasks.filter((task: any) => task.studentId === 'demo_3');
                    } else if (userData.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3') {
                        // Admin látja az összes admin által kiosztott feladatot
                        userTasks = [...adminTasks];
                    }
                } catch (error) {
                    console.error('Hiba az automatikus frissítésben:', error);
                }
            }

            // Csak akkor frissítünk, ha változás történt
            setTasks(prevTasks => {
                if (prevTasks.length !== userTasks.length) {
                    console.log('Felhasználó feladatok változás észlelve:', prevTasks.length, '->', userTasks.length);
                    return userTasks;
                }
                return prevTasks;
            });
        }, 3000); // 3 másodpercenként frissít

        // Session alapú felhasználó (Auth.js)
        if (session?.user?.id) {
            setUser({
                uid: session.user.id,
                email: session.user.email || '',
                name: session.user.name || '',
            });
        }

        return () => {
            clearInterval(interval);
            clearTimeout(initialLoadTimeout);
        };
    }, [isAuthReady, session?.user?.id, session?.user?.email, session?.user?.name]);

    const toggleTaskCompletion = async (taskId: string) => {
        // Lokális állapot frissítése azonnal
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );

        // Admin panel frissítése
        try {
            const adminTasks = JSON.parse(localStorage.getItem('admin_tasks') || '[]');
            const taskIndex = adminTasks.findIndex((task: Task) => task.id === taskId);

            if (taskIndex !== -1) {
                adminTasks[taskIndex].completed = !adminTasks[taskIndex].completed;
                adminTasks[taskIndex].completedDate = adminTasks[taskIndex].completed ? new Date().toISOString() : null;
                localStorage.setItem('admin_tasks', JSON.stringify(adminTasks));
            }
        } catch (error) {
            console.warn("Admin panel frissítés nem sikerült:", error);
        }

        if (taskId.startsWith('demo-') === false) {
            try {
                const { apiPatchAuth } = await import('../utils/apiClient');
                const prev = tasks.find((t) => t.id === taskId);
                const nextCompleted = !Boolean(prev?.completed);
                await apiPatchAuth('/api/tasks/assigned', {
                    id: taskId,
                    status: nextCompleted ? 'completed' : 'assigned',
                });
            } catch (err: unknown) {
                console.warn('Feladat státusz frissítés nem sikerült:', err);
            }
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#10B981';
            case 'medium': return '#F59E0B';
            case 'hard': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Könnyű';
            case 'medium': return 'Közepes';
            case 'hard': return 'Nehéz';
            default: return 'Ismeretlen';
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });


    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Betöltés...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Hiba történt</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Újrapróbálkozás</button>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Feladatok - Mihaszna Matek</title>
                <meta name="description" content="Matematikai feladatok kezelése" />
            </Head>

            <div className="tasks-page">
                {/* Modern Navigation */}
                <nav className="modern-nav">
                    <div className="nav-container">
                        <div className="nav-brand">
                            <Link href="/dashboard" className="brand-link">
                                <span className="brand-icon">📚</span>
                                <span className="brand-text">Mihaszna Matek</span>
                            </Link>
                        </div>

                        <div className="nav-menu">
                            <Link href="/dashboard" className="nav-item">
                                <span className="nav-icon">🏠</span>
                                <span className="nav-text">Kezdőlap</span>
                            </Link>
                            <Link href="/booking" className="nav-item">
                                <span className="nav-icon">📅</span>
                                <span className="nav-text">Foglalás</span>
                            </Link>
                            <div className="nav-item active">
                                <span className="nav-icon">📝</span>
                                <span className="nav-text">Feladatok</span>
                            </div>
                            <Link href="/game" className="nav-item">
                                <span className="nav-icon">🎮</span>
                                <span className="nav-text">Game</span>
                            </Link>
                            <Link href="/profile" className="nav-item">
                                <span className="nav-icon">👤</span>
                                <span className="nav-text">Profil</span>
                            </Link>
                            {user?.uid === "4lUUn5fX4sZ79pVoy5y4t3hJFpF3" && (
                                <Link href="/admin" className="nav-item">
                                    <span className="nav-icon">⚙️</span>
                                    <span className="nav-text">Admin</span>
                                </Link>
                            )}
                        </div>

                    </div>
                </nav>

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-container">
                        {/* Header Section */}
                        <header className="page-header">
                            <div className="header-content">
                                <div className="header-text">
                                    <h1 className="page-title">📝 Feladatok</h1>
                                    <p className="page-subtitle">{user?.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3' ? 'Itt találod az admin által kiosztott feladatokat' : 'Itt találod a matematikai feladataidat'}</p>
                                    {tasks.length === 0 && (
                                        <div className="demo-notice">
                                            <span className="demo-icon">💡</span>
                                            <span className="demo-text">{user?.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3' ? 'Nincsenek kiosztott feladatok. Az admin panelben tudsz feladatokat kiadni a diákoknak.' : 'Nincsenek hozzárendelt feladatok. A tanár az admin panelben tud feladatokat kiadni.'}</span>
                                            <button
                                                onClick={() => {
                                                    const adminTasks = JSON.parse(localStorage.getItem('admin_tasks') || '[]');
                                                    console.log('Admin feladatok:', adminTasks);
                                                    alert(`Admin feladatok száma: ${adminTasks.length}`);
                                                }}
                                                style={{
                                                    marginTop: '1rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Debug: Admin feladatok ellenőrzése
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="header-stats">
                                    <div className="stat-card">
                                        <div className="stat-number">{tasks.length}</div>
                                        <div className="stat-label">Összes</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-number">{tasks.filter(t => !t.completed).length}</div>
                                        <div className="stat-label">Függőben</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-number">{tasks.filter(t => t.completed).length}</div>
                                        <div className="stat-label">Kész</div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Filter Section */}
                        <section className="filter-section">
                            <div className="filter-tabs">
                                <button
                                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    <span className="filter-icon">📋</span>
                                    <span className="filter-text">Összes</span>
                                    <span className="filter-count">{tasks.length}</span>
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                                    onClick={() => setFilter('pending')}
                                >
                                    <span className="filter-icon">⏳</span>
                                    <span className="filter-text">Függőben</span>
                                    <span className="filter-count">{tasks.filter(t => !t.completed).length}</span>
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                                    onClick={() => setFilter('completed')}
                                >
                                    <span className="filter-icon">✅</span>
                                    <span className="filter-text">Kész</span>
                                    <span className="filter-count">{tasks.filter(t => t.completed).length}</span>
                                </button>
                            </div>
                        </section>

                        {/* Tasks Section */}
                        <section className="tasks-section">
                            {filteredTasks.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📝</div>
                                    <h3 className="empty-title">Nincsenek feladatok</h3>
                                    <p className="empty-description">
                                        {filter === 'all' && (user?.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3' ? "Még nincsenek kiosztott feladatok." : "Még nincsenek hozzárendelt feladatok.")}
                                        {filter === 'pending' && "Nincs függőben lévő feladat."}
                                        {filter === 'completed' && "Nincs elkészült feladat."}
                                    </p>
                                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                                        <p>Betöltött feladatok száma: {tasks.length}</p>
                                        <p>Szűrt feladatok száma: {filteredTasks.length}</p>
                                        <p>Felhasználó: {(() => {
                                            const currentUser = localStorage.getItem('currentUser');
                                            if (currentUser) {
                                                try {
                                                    const userData = JSON.parse(currentUser);
                                                    if (userData.email === 'anna@example.com') return 'Kovács Anna';
                                                    if (userData.email === 'peter@example.com') return 'Nagy Péter';
                                                    if (userData.email === 'eszter@example.com') return 'Szabó Eszter';
                                                    if (userData.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3') return 'Admin (Kiosztott feladatok)';
                                                    return userData.email || 'Ismeretlen';
                                                } catch (e) {
                                                    return 'Hiba a felhasználó azonosításban';
                                                }
                                            }
                                            return 'Nincs bejelentkezett felhasználó';
                                        })()}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="tasks-grid">
                                    {filteredTasks.map((task) => (
                                        <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                                            {/* Admin megjelenítés - diák neve */}
                                            {user?.uid === '4lUUn5fX4sZ79pVoy5y4t3hJFpF3' && (
                                                <div style={{
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    marginBottom: '1rem',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600',
                                                    color: '#667eea'
                                                }}>
                                                    👤 Diák: {(() => {
                                                        if (task.studentId === 'demo_1') return 'Kovács Anna';
                                                        if (task.studentId === 'demo_2') return 'Nagy Péter';
                                                        if (task.studentId === 'demo_3') return 'Szabó Eszter';
                                                        return task.studentId;
                                                    })()}
                                                </div>
                                            )}
                                            <div className="task-header">
                                                <div className="task-info">
                                                    <h3 className="task-title">
                                                        {task.title}
                                                        {task.type === 'mini-game' && (
                                                            <span className="mini-game-badge">
                                                                🎮 MINI-JÁTÉK
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="task-meta">
                                                        <span className="task-subject">📚 {task.subject}</span>
                                                        <span
                                                            className="difficulty-badge"
                                                            style={{ backgroundColor: getDifficultyColor(task.difficulty) }}
                                                        >
                                                            {getDifficultyText(task.difficulty)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    className={`completion-toggle ${task.completed ? 'completed' : ''}`}
                                                    onClick={() => toggleTaskCompletion(task.id)}
                                                    title={task.completed ? 'Jelölés nem késznek' : 'Jelölés késznek'}
                                                >
                                                    {task.completed ? '✅' : '⭕'}
                                                </button>
                                            </div>

                                            <div className="task-content">
                                                <p className="task-description">{task.description}</p>

                                                <div className="task-details">
                                                    <div className="detail-item">
                                                        <span className="detail-icon">📅</span>
                                                        <span className="detail-text">
                                                            Határidő: {new Date(task.dueDate).toLocaleDateString('hu-HU')}
                                                        </span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-icon">👤</span>
                                                        <span className="detail-text">{task.assignedBy}</span>
                                                    </div>
                                                </div>

                                                {task.solution && (
                                                    <div className="task-solution">
                                                        <h4 className="solution-title">💡 Megoldás:</h4>
                                                        <p className="solution-text">{task.solution}</p>
                                                    </div>
                                                )}

                                                {task.notes && (
                                                    <div className="task-notes">
                                                        <h4 className="notes-title">📝 Megjegyzések:</h4>
                                                        <p className="notes-text">{task.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="task-footer">
                                                <div className="task-actions">
                                                    {task.type === 'mini-game' && (
                                                        <button
                                                            className="play-game-btn"
                                                            onClick={() => {
                                                                // Mini-játék indítása új ablakban
                                                                const gameWindow = window.open(
                                                                    `/mini-game/${task.gameComponent}`,
                                                                    'MathCraftGame',
                                                                    'width=1200,height=800,scrollbars=yes,resizable=yes'
                                                                );
                                                            }}
                                                        >
                                                            🎮 JÁTÉK INDÍTÁSA
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="assigned-date">
                                                    Hozzárendelve: {new Date(task.assignedDate).toLocaleDateString('hu-HU')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>

            <style jsx global>{`
                * {
                    box-sizing: border-box;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden;
                }
                
                /* Eltávolítjuk a bal oldali fehér sávot */
                .sidebar, .left-sidebar, .side-nav {
                    display: none !important;
                }
                
                /* Biztosítjuk, hogy a tartalom látszik */
                .main-content, .content, .page-content {
                    visibility: visible !important;
                    opacity: 1 !important;
                    display: block !important;
                }
            `}</style>

            <style jsx>{`
                .tasks-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    width: 100%;
                }

                /* Modern Navigation */
                .modern-nav {
                    background: rgba(255, 255, 255, 0.95);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    width: 100%;
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 70px;
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                }

                .brand-link {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    color: #1f2937;
                    font-weight: 700;
                    font-size: 1.25rem;
                }

                .brand-icon {
                    font-size: 1.5rem;
                    margin-right: 0.5rem;
                }

                .nav-menu {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    text-decoration: none;
                    color: #6b7280;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .nav-item:hover {
                    background: rgba(102, 126, 234, 0.1);
                    color: #667eea;
                    transform: translateY(-1px);
                }

                .nav-item.active {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .nav-icon {
                    font-size: 1.1rem;
                }

                .nav-actions {
                    display: flex;
                    align-items: center;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .logout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
                }

                /* Main Content */
                .main-content {
                    padding: 2rem 0;
                    position: relative;
                    z-index: 1;
                }

                .content-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    position: relative;
                    z-index: 2;
                    visibility: visible;
                    opacity: 1;
                    display: block;
                }

                /* Page Header */
                .page-header {
                    margin-bottom: 3rem;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 2rem;
                }

                .header-text {
                    flex: 1;
                }

                .page-title {
                    font-size: 3rem;
                    font-weight: 800;
                    color: white;
                    margin: 0 0 0.5rem 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                }

                .page-subtitle {
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.9);
                    margin: 0 0 1rem 0;
                }

                .demo-notice {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .demo-icon {
                    font-size: 1.2rem;
                }

                .demo-text {
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                }

                .header-stats {
                    display: flex;
                    gap: 1rem;
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 16px;
                    padding: 1.5rem;
                    text-align: center;
                    min-width: 100px;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 500;
                }

                /* Filter Section */
                .filter-section {
                    margin-bottom: 2rem;
                }

                .filter-tabs {
                    display: flex;
                    gap: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 16px;
                    padding: 0.5rem;
                }

                .filter-tab {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: transparent;
                    border: none;
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex: 1;
                    justify-content: center;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }

                .filter-tab:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .filter-tab.active {
                    background: white;
                    color: #667eea;
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
                }

                .filter-count {
                    background: rgba(102, 126, 234, 0.2);
                    color: #667eea;
                    padding: 0.25rem 0.5rem;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .filter-tab.active .filter-count {
                    background: #667eea;
                    color: white;
                }

                /* Tasks Section */
                .tasks-section {
                    margin-bottom: 3rem;
                    position: relative;
                    z-index: 10;
                }

                .tasks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                    gap: 2rem;
                }

                .task-card {
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    padding: 2rem;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .task-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .task-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .task-card:hover::before {
                    opacity: 1;
                }

                .task-card.completed {
                    opacity: 0.7;
                    background: rgba(16, 185, 129, 0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .task-card.completed::before {
                    background: linear-gradient(135deg, #10b981, #059669);
                    opacity: 1;
                }

                .task-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }

                .task-info {
                    flex: 1;
                }

                .task-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.75rem 0;
                    line-height: 1.3;
                    text-shadow: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .mini-game-badge {
                    background: linear-gradient(45deg, #FF49DB, #39FF14);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                }

                .task-meta {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .task-subject {
                    color: #6b7280;
                    font-weight: 500;
                    font-size: 0.875rem;
                }

                .difficulty-badge {
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .completion-toggle {
                    background: none;
                    border: 2px solid #e5e7eb;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1.2rem;
                }

                .completion-toggle:hover {
                    border-color: #667eea;
                    transform: scale(1.1);
                }

                .completion-toggle.completed {
                    background: #10b981;
                    border-color: #10b981;
                    color: white;
                }

                .task-content {
                    margin-bottom: 1.5rem;
                }

                .task-description {
                    color: #374151;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .task-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .detail-icon {
                    font-size: 1rem;
                }

                .detail-text {
                    color: #6b7280;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .task-solution, .task-notes {
                    background: rgba(102, 126, 234, 0.05);
                    border-left: 4px solid #667eea;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                .solution-title, .notes-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                }

                .solution-text, .notes-text {
                    color: #4b5563;
                    line-height: 1.5;
                    margin: 0;
                    font-size: 0.9rem;
                }

                .task-footer {
                    border-top: 1px solid #e5e7eb;
                    padding-top: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .task-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .play-game-btn {
                    background: linear-gradient(45deg, #FF49DB, #39FF14);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 15px rgba(255, 73, 219, 0.3);
                }

                .play-game-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 73, 219, 0.4);
                }

                .assigned-date {
                    color: #9ca3af;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .empty-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin: 0 0 0.5rem 0;
                }

                .empty-description {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 1rem;
                }

                /* Loading & Error States */
                .loading-container, .error-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0 1rem;
                    }

                    .nav-menu {
                        display: none;
                    }

                    .content-container {
                        padding: 0 1rem;
                    }

                    .header-content {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .header-stats {
                        justify-content: center;
                    }

                    .page-title {
                        font-size: 2rem;
                    }

                    .filter-tabs {
                        flex-direction: column;
                    }

                    .tasks-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .task-card {
                        padding: 1.5rem;
                    }

                    .task-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }

                    .task-meta {
                        flex-direction: column;
                        gap: 0.5rem;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </>
    );
}
