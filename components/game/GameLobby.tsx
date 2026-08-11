import type { CatalogTopic, UniversitySubject } from '../../utils/mathTopicsCatalog';

export type GameEducationLevel = 'elementary' | 'highschool' | 'university' | null;

export type GameLobbyProps = {
    isErettsegiMode: boolean;
    educationLevel: GameEducationLevel;
    setEducationLevel: (level: GameEducationLevel) => void;
    currentTopic: string;
    selectedTask: { title: string } | null;
    questionsLength: number;
    showErettsegiMenu: boolean;
    setShowErettsegiMenu: (show: boolean) => void;
    setSelectedErettsegiMode: (mode: 'topics' | 'papers' | null) => void;
    onSelectErettsegiTopics: () => void;
    onSelectErettsegiPapers: () => void;
    selectedGrade: number | null;
    setSelectedGrade: (grade: number | null) => void;
    selectedElementaryTopic: string | null;
    elementaryTopics: CatalogTopic[];
    onSelectElementaryTopic: (topicId: string, grade: number) => void;
    selectedHighschoolGrade: number | null;
    setSelectedHighschoolGrade: (grade: number | null) => void;
    selectedHighschoolTopic: string | null;
    highschoolTopics: CatalogTopic[];
    onSelectHighschoolTopic: (topicId: string, grade: number) => void;
    selectedUniversitySubject: string | null;
    setSelectedUniversitySubject: (subjectId: string | null) => void;
    selectedUniversityTopic: string | null;
    showSzigorlatMenu: boolean;
    setShowSzigorlatMenu: (show: boolean) => void;
    universitySubjects: UniversitySubject[];
    onGenerateKozponti: () => void;
    onGenerateVegyesSzigorlat: () => void;
    onSelectUniversityTopic: (subjectId: string, topicId: string) => void;
    highScore: number;
    assignedTasks: Array<{ title: string }>;
    onStartGame: () => void;
    onResetGame: () => void;
};

export default function GameLobby({
    isErettsegiMode,
    educationLevel,
    setEducationLevel,
    currentTopic,
    selectedTask,
    questionsLength,
    showErettsegiMenu,
    setShowErettsegiMenu,
    setSelectedErettsegiMode,
    onSelectErettsegiTopics,
    onSelectErettsegiPapers,
    selectedGrade,
    setSelectedGrade,
    selectedElementaryTopic,
    elementaryTopics,
    onSelectElementaryTopic,
    selectedHighschoolGrade,
    setSelectedHighschoolGrade,
    selectedHighschoolTopic,
    highschoolTopics,
    onSelectHighschoolTopic,
    selectedUniversitySubject,
    setSelectedUniversitySubject,
    selectedUniversityTopic,
    showSzigorlatMenu,
    setShowSzigorlatMenu,
    universitySubjects,
    onGenerateKozponti,
    onGenerateVegyesSzigorlat,
    onSelectUniversityTopic,
    highScore,
    assignedTasks,
    onStartGame,
    onResetGame,
}: GameLobbyProps) {
    return (
        <div className="start-screen">
            <h1 className="game-title">
                {isErettsegiMode
                    ? '📚 Érettségi Felkészülés'
                    : educationLevel === 'elementary'
                        ? '🏫 Általános Iskolai Kvíz'
                        : educationLevel === 'highschool'
                            ? '🎒 Gimnáziumi Kvíz'
                            : educationLevel === 'university'
                                ? '🚀 UniBoost'
                                : '🧮 Matek Kvíz'}
            </h1>
            <p className="game-subtitle">
                {isErettsegiMode
                    ? (currentTopic ? `Témakör: ${currentTopic}` : 'Témakörönkénti gyakorlás')
                    : (selectedTask
                        ? selectedTask.title
                        : currentTopic
                            ? `Témakör: ${currentTopic}`
                            : 'Válassz szintet, majd indítsd a kvízt a tanítványaiddal')}
            </p>
            {questionsLength === 0 && (
                <div className="no-questions-warning">
                    <p>⚠️ Nincsenek elérhető feladatok ezen a szinten!</p>
                    <p>Kérjük, válasszon másik oktatási szintet.</p>
                </div>
            )}

            {!educationLevel && !showErettsegiMenu ? (
                <div className="level-selector">
                    <h2 className="level-title">Válassz oktatási szintet:</h2>
                    <div className="level-buttons">
                        <button
                            className="level-btn elementary"
                            onClick={() => setEducationLevel('elementary')}
                        >
                            <span className="level-icon">🎒</span>
                            <span className="level-name">Általános iskola</span>
                            <span className="level-desc">1-8. osztály</span>
                        </button>
                        <button
                            className="level-btn highschool"
                            onClick={() => setEducationLevel('highschool')}
                        >
                            <span className="level-icon">📚</span>
                            <span className="level-name">Középiskola</span>
                            <span className="level-desc">9-12. osztály</span>
                        </button>
                        <button
                            className="level-btn university"
                            onClick={() => setEducationLevel('university')}
                        >
                            <span className="level-icon">🎓</span>
                            <span className="level-name">Egyetem</span>
                            <span className="level-desc">Felsőbb matematika</span>
                        </button>
                        <button
                            className="level-btn erettsegi"
                            onClick={() => setShowErettsegiMenu(true)}
                        >
                            <span className="level-icon">📚</span>
                            <span className="level-name">Érettségi Felkészülés</span>
                            <span className="level-desc">Témakörök és feladatsorok</span>
                        </button>
                        <button
                            className="level-btn kozponti"
                            onClick={onGenerateKozponti}
                        >
                            <span className="level-icon">🎯</span>
                            <span className="level-name">Központi Felvételi</span>
                            <span className="level-desc">Gimnáziumi felvételi felkészülés</span>
                        </button>
                    </div>
                </div>
            ) : showErettsegiMenu ? (
                <div className="erettsegi-menu-section">
                    <button
                        className="back-to-levels-btn"
                        onClick={() => {
                            setShowErettsegiMenu(false);
                            setEducationLevel(null);
                            setSelectedErettsegiMode(null);
                        }}
                        style={{ marginBottom: '2rem' }}
                    >
                        ← Vissza a szintekhez
                    </button>
                    <h2 className="level-title">Válassz érettségi felkészülés módot:</h2>
                    <div className="level-buttons">
                        <button
                            className="level-btn erettsegi-option"
                            onClick={onSelectErettsegiTopics}
                        >
                            <span className="level-icon">📖</span>
                            <span className="level-name">Érettségi Témakörök szerint</span>
                            <span className="level-desc">Témakörönként gyakorlás</span>
                        </button>
                        <button
                            className="level-btn erettsegi-option"
                            onClick={onSelectErettsegiPapers}
                        >
                            <span className="level-icon">📄</span>
                            <span className="level-name">Érettségi Feladatsorok</span>
                            <span className="level-desc">Évek szerint csoportosított feladatsorok</span>
                        </button>
                    </div>
                </div>
            ) : educationLevel === 'elementary' && !selectedGrade ? (
                <div className="grade-selector-section">
                    <h2 className="level-title">Válassz osztályt:</h2>
                    <div className="grade-buttons">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
                            <button
                                key={grade}
                                className="grade-btn"
                                onClick={() => setSelectedGrade(grade)}
                            >
                                <span className="grade-number">{grade}.</span>
                                <span className="grade-label">osztály</span>
                            </button>
                        ))}
                    </div>
                    <button className="reset-button" onClick={() => setEducationLevel(null)}>
                        <span className="button-icon">←</span>
                        VISSZA
                    </button>
                </div>
            ) : educationLevel === 'elementary' && selectedGrade && !selectedElementaryTopic ? (
                <div className="topic-selector-section">
                    <div className="selected-grade-header">
                        <h2 className="level-title">{selectedGrade}. osztály - Válassz témakört:</h2>
                        <button
                            className="change-grade-btn"
                            onClick={() => setSelectedGrade(null)}
                        >
                            🔄 Osztály váltása
                        </button>
                    </div>
                    <div className="elementary-topics-grid">
                        {elementaryTopics.map(topic => (
                            <div
                                key={topic.id}
                                className="elementary-topic-card"
                                onClick={() => onSelectElementaryTopic(topic.id, selectedGrade)}
                            >
                                <div className="topic-icon" style={{ color: topic.color }}>
                                    {topic.icon}
                                </div>
                                <h3 className="topic-title">{topic.title}</h3>
                                <div className="topic-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : educationLevel === 'highschool' && !selectedHighschoolGrade ? (
                <div className="grade-selector-section">
                    <h2 className="level-title">Válassz osztályt:</h2>
                    <div className="grade-buttons">
                        {[9, 10, 11, 12].map(grade => (
                            <button
                                key={grade}
                                className="grade-btn"
                                onClick={() => setSelectedHighschoolGrade(grade)}
                            >
                                <span className="grade-number">{grade}.</span>
                                <span className="grade-label">osztály</span>
                            </button>
                        ))}
                    </div>
                    <button className="reset-button" onClick={() => setEducationLevel(null)}>
                        <span className="button-icon">←</span>
                        VISSZA
                    </button>
                </div>
            ) : educationLevel === 'highschool' && selectedHighschoolGrade && !selectedHighschoolTopic ? (
                <div className="topic-selector-section">
                    <div className="selected-grade-header">
                        <h2 className="level-title">{selectedHighschoolGrade}. osztály - Válassz témakört:</h2>
                        <button
                            className="change-grade-btn"
                            onClick={() => setSelectedHighschoolGrade(null)}
                        >
                            🔄 Osztály váltása
                        </button>
                    </div>
                    <div className="elementary-topics-grid">
                        {highschoolTopics.map(topic => (
                            <div
                                key={topic.id}
                                className="elementary-topic-card"
                                onClick={() => onSelectHighschoolTopic(topic.id, selectedHighschoolGrade)}
                            >
                                <div className="topic-icon" style={{ color: topic.color }}>
                                    {topic.icon}
                                </div>
                                <h3 className="topic-title">{topic.title}</h3>
                                <div className="topic-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : educationLevel === 'university' && !selectedUniversitySubject && !showSzigorlatMenu ? (
                <div className="subject-selector-section">
                    <h2 className="level-title">Válassz opciót:</h2>
                    <div className="elementary-topics-grid">
                        {universitySubjects.map(subject => (
                            <div
                                key={subject.id}
                                className="elementary-topic-card"
                                onClick={() => setSelectedUniversitySubject(subject.id)}
                            >
                                <div className="topic-icon" style={{ color: subject.color }}>
                                    {subject.icon}
                                </div>
                                <h3 className="topic-title">{subject.title}</h3>
                                <div className="topic-arrow">→</div>
                            </div>
                        ))}
                        <div
                            className="elementary-topic-card"
                            onClick={() => setShowSzigorlatMenu(true)}
                            style={{ border: '2px solid rgba(255, 73, 219, 0.5)' }}
                        >
                            <div className="topic-icon" style={{ color: '#FF49DB' }}>
                                📝
                            </div>
                            <h3 className="topic-title">Szigorlat</h3>
                            <div className="topic-arrow">→</div>
                        </div>
                    </div>
                    <button className="reset-button" onClick={() => setEducationLevel(null)}>
                        <span className="button-icon">←</span>
                        VISSZA
                    </button>
                </div>
            ) : educationLevel === 'university' && showSzigorlatMenu ? (
                <div className="subject-selector-section">
                    <button
                        className="reset-button"
                        onClick={() => {
                            setShowSzigorlatMenu(false);
                        }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <span className="button-icon">←</span>
                        VISSZA A TANTÁRGYAKHOZ
                    </button>
                    <h2 className="level-title">Szigorlat Felkészülés</h2>
                    <p style={{ color: '#ccc', marginBottom: '2rem', textAlign: 'center' }}>
                        Analízis I., II. és III. tantárgyakból vegyes feladatok
                    </p>
                    <div className="elementary-topics-grid">
                        <div
                            className="elementary-topic-card"
                            onClick={onGenerateVegyesSzigorlat}
                        >
                            <div className="topic-icon" style={{ color: '#FF49DB' }}>
                                📝
                            </div>
                            <h3 className="topic-title">Vegyes Szigorlat</h3>
                            <p style={{ color: '#ccc', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Analízis I-III. vegyes feladatok
                            </p>
                            <div className="topic-arrow">→</div>
                        </div>
                    </div>
                </div>
            ) : educationLevel === 'university' && selectedUniversitySubject && !selectedUniversityTopic ? (
                <div className="topic-selector-section">
                    <div className="selected-grade-header">
                        <h2 className="level-title">
                            {universitySubjects.find(s => s.id === selectedUniversitySubject)?.title} - Válassz témakört:
                        </h2>
                        <button
                            className="change-grade-btn"
                            onClick={() => setSelectedUniversitySubject(null)}
                        >
                            🔄 Tantárgy váltása
                        </button>
                    </div>
                    <div className="elementary-topics-grid">
                        {universitySubjects.find(s => s.id === selectedUniversitySubject)?.topics.map(topic => (
                            <div
                                key={topic.id}
                                className="elementary-topic-card"
                                onClick={() => onSelectUniversityTopic(selectedUniversitySubject, topic.id)}
                            >
                                <div className="topic-icon" style={{ color: '#39ff14' }}>
                                    {topic.icon}
                                </div>
                                <h3 className="topic-title">{topic.title}</h3>
                                <div className="topic-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="game-info-section">
                    <div className="selected-level"></div>
                    <div className="stats-display">
                        <div className="stat-item">
                            <span className="stat-icon">🏆</span>
                            <span className="stat-label">Legjobb eredmény</span>
                            <span className="stat-value" suppressHydrationWarning>{highScore}</span>
                        </div>
                    </div>

                    {/* Kiosztott feladatok megjelenítése */}
                    {assignedTasks.length > 0 && (
                        <div style={{
                            background: 'rgba(57, 255, 20, 0.1)',
                            border: '2px solid #39FF14',
                            borderRadius: '15px',
                            padding: '1rem',
                            margin: '1rem 0',
                            textAlign: 'center'
                        }}>
                            <h4 style={{ color: '#39FF14', marginBottom: '0.5rem' }}>
                                📝 Kiosztott Feladatok ({assignedTasks.length})
                            </h4>
                            <p style={{ color: '#fff', fontSize: '0.9rem' }}>
                                {assignedTasks.map(task => task.title).join(', ')}
                            </p>
                        </div>
                    )}

                    <button
                        className="start-button"
                        onClick={onStartGame}
                        disabled={questionsLength === 0}
                    >
                        <span className="button-icon">🚀</span>
                        {questionsLength === 0 ? 'NINCSENEK FELADATOK' : 'JÁTÉK INDÍTÁSA'}
                    </button>
                    <button className="reset-button" onClick={onResetGame}>
                        <span className="button-icon">🔄</span>
                        VISSZA A VÁLASZTÁSHOZ
                    </button>
                </div>
            )}
        </div>
    );
}
