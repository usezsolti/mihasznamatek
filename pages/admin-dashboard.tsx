import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type User = {
    uid: string;
    name: string;
    email: string;
    educationLevel?: string;
    lastLogin?: any;
    createdAt?: any;
};

type TaskAssignment = {
    id: string;
    userId: string;
    userName: string;
    topicId: string;
    topicTitle: string;
    taskDescription: string;
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
    attempts: number;
    assignedAt: any;
    completedAt?: any;
    mistakes: string[];
};

type TaskResult = {
    taskId: string;
    userId: string;
    topicId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timestamp: any;
    mistakes: string[];
};

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
    const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'results'>('users');

    // New task form
    const [newTask, setNewTask] = useState({
        topicId: '',
        topicTitle: '',
        description: '',
        correctAnswer: ''
    });

    useEffect(() => {
        const checkAdminAuth = async () => {
            let attempts = 0;
            while (!window.firebase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.firebase) {
                router.replace("/");
                return;
            }

            try {
                const auth = window.firebase.auth();
                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user || user.email !== 'usezsoli@gmail.com') {
                        router.replace("/");
                        return;
                    }

                    setIsAdmin(true);
                    await loadUsers();
                    await loadTaskAssignments();
                    await loadTaskResults();
                    setLoading(false);
                });

                return () => unsub();
            } catch (err) {
                router.replace("/");
            }
        };

        checkAdminAuth();
    }, [router]);

    const loadUsers = async () => {
        try {
            const db = window.firebase.firestore();
            const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
            const usersData: User[] = [];

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                usersData.push({
                    uid: doc.id,
                    name: data.name || data.displayName || 'Névtelen',
                    email: data.email || '',
                    educationLevel: data.educationLevel || 'highschool',
                    lastLogin: data.lastLogin,
                    createdAt: data.createdAt
                });
            });

            setUsers(usersData);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadTaskAssignments = async () => {
        try {
            const db = window.firebase.firestore();
            const snapshot = await db.collection('taskAssignments').orderBy('assignedAt', 'desc').get();
            const assignments: TaskAssignment[] = [];

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                assignments.push({
                    id: doc.id,
                    ...data
                });
            });

            setTaskAssignments(assignments);
        } catch (error) {
            console.error('Error loading task assignments:', error);
        }
    };

    const loadTaskResults = async () => {
        try {
            const db = window.firebase.firestore();
            const snapshot = await db.collection('taskResults').orderBy('timestamp', 'desc').get();
            const results: TaskResult[] = [];

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                results.push({
                    taskId: doc.id,
                    ...data
                });
            });

            setTaskResults(results);
        } catch (error) {
            console.error('Error loading task results:', error);
        }
    };

    const assignTask = async () => {
        if (!selectedUser || !newTask.description || !newTask.correctAnswer) {
            alert('Kérlek töltsd ki az összes mezőt!');
            return;
        }

        try {
            const db = window.firebase.firestore();
            const taskData = {
                userId: selectedUser.uid,
                userName: selectedUser.name,
                topicId: newTask.topicId,
                topicTitle: newTask.topicTitle,
                taskDescription: newTask.description,
                correctAnswer: newTask.correctAnswer,
                attempts: 0,
                assignedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
                mistakes: []
            };

            await db.collection('taskAssignments').add(taskData);

            // Send notification to user
            await db.collection('notifications').add({
                userId: selectedUser.uid,
                type: 'task_assigned',
                title: 'Új feladat kapott!',
                message: `Új feladat a(z) ${newTask.topicTitle} témakörben: ${newTask.description}`,
                isRead: false,
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
            });

            alert('Feladat sikeresen kiadva!');
            setNewTask({ topicId: '', topicTitle: '', description: '', correctAnswer: '' });
            await loadTaskAssignments();
        } catch (error) {
            console.error('Error assigning task:', error);
            alert('Hiba történt a feladat kiadásakor!');
        }
    };


    if (loading) {
        return (
            <div className="dashboard-container dark-theme">
                <div className="loading-screen">
                    <p>Admin betöltés...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="dashboard-container dark-theme">
                <div className="error-screen">
                    <h2>Hozzáférés megtagadva</h2>
                    <p>Csak adminisztrátorok férhetnek hozzá ehhez az oldalhoz.</p>
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
                        <h2 className="admin-title">⚙️ ADMIN DASHBOARD</h2>
                        <p className="admin-subtitle">Felhasználók és feladatok kezelése</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            👥 Felhasználók ({users.length})
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'tasks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tasks')}
                        >
                            📚 Feladatok ({taskAssignments.length})
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'results' ? 'active' : ''}`}
                            onClick={() => setActiveTab('results')}
                        >
                            📊 Eredmények ({taskResults.length})
                        </button>
                    </div>

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="admin-content">
                            <div className="users-grid">
                                {users.map(user => (
                                    <div
                                        key={user.uid}
                                        className={`user-card ${selectedUser?.uid === user.uid ? 'selected' : ''}`}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-info">
                                            <h3>{user.name}</h3>
                                            <p>{user.email}</p>
                                            <span className="education-badge">
                                                {user.educationLevel === 'elementary' && '🏫 Általános'}
                                                {user.educationLevel === 'highschool' && '🎒 Középiskola'}
                                                {user.educationLevel === 'university' && '🎓 Egyetem'}
                                            </span>
                                        </div>
                                        <div className="user-stats">
                                            <div className="stat">
                                                <span className="stat-number">
                                                    {taskAssignments.filter(t => t.userId === user.uid).length}
                                                </span>
                                                <span className="stat-label">Feladat</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-number">
                                                    {taskResults.filter(r => r.userId === user.uid && r.isCorrect).length}
                                                </span>
                                                <span className="stat-label">Helyes</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Task Assignment Form */}
                            {selectedUser && (
                                <div className="task-assignment-form">
                                    <h3>📝 Új feladat kiadása: {selectedUser.name}</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Témakör ID</label>
                                            <input
                                                type="text"
                                                value={newTask.topicId}
                                                onChange={(e) => setNewTask({ ...newTask, topicId: e.target.value })}
                                                placeholder="pl. egyenletek"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Témakör Cím</label>
                                            <input
                                                type="text"
                                                value={newTask.topicTitle}
                                                onChange={(e) => setNewTask({ ...newTask, topicTitle: e.target.value })}
                                                placeholder="pl. Egyenletek"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Feladat Leírás</label>
                                            <textarea
                                                value={newTask.description}
                                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                placeholder="Írd le a feladatot részletesen..."
                                                rows={3}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Helyes Válasz</label>
                                            <input
                                                type="text"
                                                value={newTask.correctAnswer}
                                                onChange={(e) => setNewTask({ ...newTask, correctAnswer: e.target.value })}
                                                placeholder="A helyes válasz"
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button className="assign-btn" onClick={assignTask}>
                                                📤 Feladat Kiadása
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tasks Tab */}
                    {activeTab === 'tasks' && (
                        <div className="admin-content">
                            <div className="tasks-list">
                                {taskAssignments.map(task => (
                                    <div key={task.id} className={`task-item ${task.completedAt ? 'completed' : 'pending'}`}>
                                        <div className="task-header">
                                            <h4>{task.topicTitle}: {task.taskDescription}</h4>
                                            <span className={`task-status ${task.completedAt ? 'completed' : 'pending'}`}>
                                                {task.completedAt ? '✅ Befejezve' : '⏳ Függőben'}
                                            </span>
                                        </div>
                                        <div className="task-details">
                                            <p><strong>Diák:</strong> {task.userName} ({task.userId})</p>
                                            <p><strong>Helyes válasz:</strong> {task.correctAnswer}</p>
                                            {task.userAnswer && (
                                                <p><strong>Diák válasza:</strong>
                                                    <span className={task.isCorrect ? 'correct' : 'incorrect'}>
                                                        {task.userAnswer} {task.isCorrect ? '✅' : '❌'}
                                                    </span>
                                                </p>
                                            )}
                                            <p><strong>Próbálkozások:</strong> {task.attempts}</p>
                                            {task.mistakes.length > 0 && (
                                                <div className="mistakes">
                                                    <strong>Hibák:</strong>
                                                    <ul>
                                                        {task.mistakes.map((mistake, i) => (
                                                            <li key={i}>{mistake}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Tab */}
                    {activeTab === 'results' && (
                        <div className="admin-content">
                            <div className="results-overview">
                                <div className="overview-stats">
                                    <div className="overview-stat">
                                        <span className="stat-number">{taskResults.filter(r => r.isCorrect).length}</span>
                                        <span className="stat-label">Helyes Válaszok</span>
                                    </div>
                                    <div className="overview-stat">
                                        <span className="stat-number">{taskResults.filter(r => !r.isCorrect).length}</span>
                                        <span className="stat-label">Hibás Válaszok</span>
                                    </div>
                                    <div className="overview-stat">
                                        <span className="stat-number">
                                            {taskResults.length > 0 ? Math.round((taskResults.filter(r => r.isCorrect).length / taskResults.length) * 100) : 0}%
                                        </span>
                                        <span className="stat-label">Pontosság</span>
                                    </div>
                                </div>

                                <div className="results-list">
                                    {taskResults.map(result => (
                                        <div key={result.taskId} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                            <div className="result-header">
                                                <h4>{result.topicId}</h4>
                                                <span className={`result-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                                    {result.isCorrect ? '✅ Helyes' : '❌ Hibás'}
                                                </span>
                                            </div>
                                            <div className="result-details">
                                                <p><strong>Diák válasza:</strong> {result.userAnswer}</p>
                                                <p><strong>Helyes válasz:</strong> {result.correctAnswer}</p>
                                                {result.mistakes.length > 0 && (
                                                    <div className="result-mistakes">
                                                        <strong>Hibák:</strong>
                                                        <ul>
                                                            {result.mistakes.map((mistake, i) => (
                                                                <li key={i}>{mistake}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}


