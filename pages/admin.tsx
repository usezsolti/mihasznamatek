import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type User = {
    uid: string;
    name: string;
    email: string;
    educationLevel?: string;
};

type PublicTask = {
    id: string;
    topicId: string;
    topicTitle: string;
    taskDescription: string;
    correctAnswer: string;
    createdBy: string;
    createdAt: any;
    educationLevel: string;
};

export default function Admin() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [publicTasks, setPublicTasks] = useState<PublicTask[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // New task form
    const [newTask, setNewTask] = useState({
        topicId: '',
        topicTitle: '',
        description: '',
        correctAnswer: '',
        educationLevel: 'highschool'
    });

    useEffect(() => {
        const checkAuth = async () => {
            let attempts = 0;
            while (!window.firebase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.firebase) {
                setLoading(false);
                return;
            }

            try {
                const auth = (window as any).firebase.auth();
                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    console.log('Auth state changed:', user?.email);

                    if (!user) {
                        // Ha nincs bejelentkezett felhasználó, folytatjuk bejelentkezés nélkül
                        setLoading(false);
                        return;
                    }

                    setCurrentUser(user);

                    // Check if admin
                    if (user.email === 'usezsolti@gmail.com') {
                        console.log('Admin access granted');
                        setIsAdmin(true);
                        await loadUsers();
                        await loadPublicTasks();
                    } else {
                        console.log('Not admin, redirecting');
                        router.replace("/dashboard");
                        return;
                    }

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

    const loadUsers = async () => {
        try {
            const db = (window as any).firebase.firestore();
            const snapshot = await db.collection('users').get();
            const usersData: User[] = [];

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                usersData.push({
                    uid: doc.id,
                    name: data.name || data.displayName || 'Névtelen',
                    email: data.email || '',
                    educationLevel: data.educationLevel || 'highschool'
                });
            });

            console.log('Loaded users:', usersData.length);
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadPublicTasks = async () => {
        try {
            const db = (window as any).firebase.firestore();
            const snapshot = await db.collection('publicTasks').get();
            const tasks: PublicTask[] = [];

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                tasks.push({
                    id: doc.id,
                    ...data
                });
            });

            console.log('Loaded public tasks:', tasks.length);
            setPublicTasks(tasks);
        } catch (error) {
            console.error('Error loading public tasks:', error);
        }
    };

    const createPublicTask = async () => {
        if (!newTask.description || !newTask.correctAnswer || !newTask.topicId) {
            alert('Kérlek töltsd ki az összes mezőt!');
            return;
        }

        try {
            const db = (window as any).firebase.firestore();
            const taskData = {
                topicId: newTask.topicId,
                topicTitle: newTask.topicTitle || newTask.topicId,
                taskDescription: newTask.description,
                correctAnswer: newTask.correctAnswer,
                educationLevel: newTask.educationLevel,
                createdBy: currentUser.email,
                createdAt: (window as any).firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true
            };

            await db.collection('publicTasks').add(taskData);

            alert('Nyilvános feladat sikeresen létrehozva! Minden felhasználó látni fogja.');
            setNewTask({ topicId: '', topicTitle: '', description: '', correctAnswer: '', educationLevel: 'highschool' });
            await loadPublicTasks();
        } catch (error) {
            console.error('Error creating public task:', error);
            alert('Hiba történt a feladat létrehozásakor!');
        }
    };

    const deleteTask = async (taskId: string) => {
        if (!confirm('Biztosan törölni szeretnéd ezt a feladatot?')) return;

        try {
            const db = (window as any).firebase.firestore();
            await db.collection('publicTasks').doc(taskId).delete();
            alert('Feladat törölve!');
            await loadPublicTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Hiba a törlés során!');
        }
    };


    if (loading) {
        return (
            <div className="dashboard-container dark-theme">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ color: '#39FF14', fontSize: '2rem' }}>🔐</div>
                    <p style={{ color: '#FF49DB' }}>Admin hozzáférés ellenőrzése...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="dashboard-container dark-theme">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    gap: '1rem',
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <div style={{ color: '#EF4444', fontSize: '3rem' }}>🚫</div>
                    <h2 style={{ color: '#EF4444' }}>Hozzáférés Megtagadva</h2>
                    <p style={{ color: '#FF49DB' }}>
                        Csak adminisztrátorok férhetnek hozzá.<br />
                        Jelenlegi felhasználó: {currentUser?.email || 'Ismeretlen'}
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{
                            background: '#39FF14',
                            color: '#000',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        🏠 Vissza a Dashboard-ra
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container dark-theme">
            {/* Navigation */}
            <div className="top-nav">
                <nav className="nav-tabs">
                    <button className="nav-tab" onClick={() => router.push('/dashboard')}>
                        <i className="nav-icon">🏠</i>
                        Kezdőlap
                    </button>
                    <button className="nav-tab" onClick={() => router.push('/booking')}>
                        <i className="nav-icon">📅</i>
                        Időpontfoglalás
                    </button>
                    <button className="nav-tab" onClick={() => router.push('/profile')}>
                        <i className="nav-icon">👤</i>
                        Adataim
                    </button>
                    <button className="nav-tab active">
                        <i className="nav-icon">⚙️</i>
                        Admin
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <main className="main-content">
                <section className="admin-section">
                    <div className="admin-header">
                        <h2 className="admin-title">👑 ADMIN DASHBOARD</h2>
                        <p className="admin-subtitle">Nyilvános feladatok létrehozása és kezelése</p>
                        <p style={{ color: '#39FF14', textAlign: 'center', marginTop: '1rem' }}>
                            Admin: <strong>{currentUser?.email}</strong> ✅
                        </p>
                    </div>

                    {/* Create Public Task Form */}
                    <div className="task-creation-section">
                        <h3 style={{ color: '#39FF14', marginBottom: '1.5rem', textAlign: 'center' }}>
                            📚 Új Nyilvános Feladat Létrehozása
                        </h3>

                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '2rem',
                            borderRadius: '15px',
                            border: '1px solid rgba(57, 255, 20, 0.2)',
                            marginBottom: '3rem'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <label style={{ color: '#FF49DB', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                                        Oktatási Szint
                                    </label>
                                    <select
                                        value={newTask.educationLevel}
                                        onChange={(e) => setNewTask({ ...newTask, educationLevel: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            color: '#39FF14',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <option value="elementary">🏫 Általános Iskola</option>
                                        <option value="highschool">🎒 Középiskola</option>
                                        <option value="university">🎓 Egyetem</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: '#FF49DB', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                                        Témakör ID
                                    </label>
                                    <input
                                        type="text"
                                        value={newTask.topicId}
                                        onChange={(e) => setNewTask({ ...newTask, topicId: e.target.value })}
                                        placeholder="pl. egyenletek"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            color: '#39FF14',
                                            fontWeight: '500'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ color: '#FF49DB', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                                    Feladat Leírás
                                </label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Írd le a feladatot részletesen..."
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        color: '#39FF14',
                                        fontWeight: '500',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ color: '#FF49DB', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                                    Helyes Válasz
                                </label>
                                <input
                                    type="text"
                                    value={newTask.correctAnswer}
                                    onChange={(e) => setNewTask({ ...newTask, correctAnswer: e.target.value })}
                                    placeholder="A helyes válasz"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        color: '#39FF14',
                                        fontWeight: '500'
                                    }}
                                />
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={createPublicTask}
                                    style={{
                                        background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                        color: '#000',
                                        border: 'none',
                                        padding: '1rem 3rem',
                                        borderRadius: '15px',
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    📤 Feladat Létrehozása (Mindenki Látja)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Public Tasks List */}
                    <div className="public-tasks-section">
                        <h3 style={{ color: '#FF49DB', marginBottom: '2rem', textAlign: 'center' }}>
                            📋 Létrehozott Nyilvános Feladatok ({publicTasks.length})
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {publicTasks.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    color: '#FF49DB',
                                    padding: '2rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '15px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    Még nincsenek nyilvános feladatok.
                                </div>
                            ) : (
                                publicTasks.map(task => (
                                    <div key={task.id} style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '1rem'
                                        }}>
                                            <h4 style={{ color: '#39FF14', margin: 0 }}>
                                                {task.topicTitle || task.topicId}
                                            </h4>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <span style={{
                                                    background: 'rgba(255, 73, 219, 0.2)',
                                                    color: '#FF49DB',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '15px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {task.educationLevel === 'elementary' && '🏫 Általános'}
                                                    {task.educationLevel === 'highschool' && '🎒 Középiskola'}
                                                    {task.educationLevel === 'university' && '🎓 Egyetem'}
                                                </span>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    style={{
                                                        background: '#EF4444',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    🗑️ Törlés
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ color: '#FF49DB', marginBottom: '1rem' }}>
                                            <strong>Feladat:</strong> {task.taskDescription}
                                        </div>
                                        <div style={{ color: '#39FF14' }}>
                                            <strong>Helyes válasz:</strong> {task.correctAnswer}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Users Overview */}
                    <div className="users-overview">
                        <h3 style={{ color: '#39FF14', marginBottom: '2rem', textAlign: 'center' }}>
                            👥 Regisztrált Felhasználók ({users.length})
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1rem'
                        }}>
                            {users.map(user => (
                                <div key={user.uid} style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        color: '#000',
                                        fontWeight: '700'
                                    }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ color: '#39FF14', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        {user.name}
                                    </div>
                                    <div style={{ color: '#FF49DB', fontSize: '0.9rem' }}>
                                        {user.email}
                                    </div>
                                    <div style={{
                                        marginTop: '0.5rem',
                                        background: 'rgba(255, 73, 219, 0.2)',
                                        color: '#FF49DB',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        display: 'inline-block'
                                    }}>
                                        {user.educationLevel === 'elementary' && '🏫 Általános'}
                                        {user.educationLevel === 'highschool' && '🎒 Középiskola'}
                                        {user.educationLevel === 'university' && '🎓 Egyetem'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
