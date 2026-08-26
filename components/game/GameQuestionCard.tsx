import MathTemplateInput from '../MathTemplateInput';
import type { Question } from '../../utils/game';

export type GameQuestionCardProps = {
    question: Question | undefined;
    currentQuestion: number;
    questionsLength: number;
    subQuestionAnswers: { [key: number]: string };
    setSubQuestionAnswers: (answers: { [key: number]: string }) => void;
    showSolutions: boolean;
    setShowSolutions: (show: boolean) => void;
    setCurrentQuestion: (index: number) => void;
    setCurrentSubQuestion: (index: number) => void;
    setMessage: (message: string) => void;
    setIsCorrect: (correct: boolean) => void;
    checkSubQuestionAnswers: () => void;
    userAnswer: string;
    setUserAnswer: (value: string) => void;
    userAnswer2: string;
    setUserAnswer2: (value: string) => void;
    userAnswer3: string;
    setUserAnswer3: (value: string) => void;
    userAnswer4: string;
    setUserAnswer4: (value: string) => void;
    submitAnswer: () => void;
    message: string;
    isCorrect: boolean;
    showExpression: boolean;
};

export default function GameQuestionCard({
    question,
    currentQuestion,
    questionsLength,
    subQuestionAnswers,
    setSubQuestionAnswers,
    showSolutions,
    setShowSolutions,
    setCurrentQuestion,
    setCurrentSubQuestion,
    setMessage,
    setIsCorrect,
    checkSubQuestionAnswers,
    userAnswer,
    setUserAnswer,
    userAnswer2,
    setUserAnswer2,
    userAnswer3,
    setUserAnswer3,
    userAnswer4,
    setUserAnswer4,
    submitAnswer,
    message,
    isCorrect,
    showExpression,
}: GameQuestionCardProps) {
    return (
        <div className="question-card">
            {question?.subQuestions ? (
                // Részfeladatokkal rendelkező feladat megjelenítése
                <>
                    <h2 className="question-text" style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                        {question?.question}
                    </h2>
                    {question.subQuestions!.map((subQ, index) => (
                        <div key={index} style={{
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '10px',
                            border: '1px solid rgba(57, 255, 20, 0.3)'
                        }}>
                            <h3 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                {subQ.question}
                            </h3>
                            {showSolutions && (
                                <div style={{
                                    color: '#ccc',
                                    marginBottom: '1rem',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'pre-line',
                                    padding: '0.5rem',
                                    background: 'rgba(57, 255, 20, 0.1)',
                                    borderRadius: '5px'
                                }}>
                                    {subQ.rubric}
                                </div>
                            )}
                            <div className="answer-section" style={{ marginTop: '1rem' }}>
                                <MathTemplateInput
                                    id={`math-input-${index}`}
                                    value={subQuestionAnswers[index] || ''}
                                    disabled={showSolutions}
                                    autoFocus={index === 0}
                                    placeholder="Válasz"
                                    onChange={(text) => {
                                        const newAnswers = { ...subQuestionAnswers };
                                        newAnswers[index] = text;
                                        setSubQuestionAnswers(newAnswers);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        {currentQuestion > 0 && (
                            <button
                                className="submit-button"
                                onClick={() => {
                                    // Visszalépés az előző feladatra
                                    setCurrentQuestion(currentQuestion - 1);
                                    setCurrentSubQuestion(0);
                                    setSubQuestionAnswers({});
                                    setShowSolutions(false);
                                    setMessage('');
                                    setIsCorrect(false);
                                }}
                                style={{
                                    flex: 1,
                                    background: 'rgba(57, 255, 20, 0.2)',
                                    border: '2px solid rgba(57, 255, 20, 0.5)'
                                }}
                            >
                                <span className="button-icon">⬅️</span>
                                Előző
                            </button>
                        )}
                        {!showSolutions && (
                            <button
                                className="submit-button"
                                onClick={() => {
                                    setShowSolutions(true);
                                    checkSubQuestionAnswers();
                                }}
                                disabled={
                                    !question?.subQuestions
                                }
                                style={{ flex: 1 }}
                            >
                                <span className="button-icon">✅</span>
                                Válasz
                            </button>
                        )}
                        {currentQuestion < questionsLength - 1 && (
                            <button
                                className="submit-button"
                                onClick={() => {
                                    // Továbblépés a következő feladatra
                                    setCurrentQuestion(currentQuestion + 1);
                                    setCurrentSubQuestion(0);
                                    setSubQuestionAnswers({});
                                    setShowSolutions(false);
                                    setMessage('');
                                    setIsCorrect(false);
                                }}
                                style={{
                                    flex: 1,
                                    background: 'rgba(57, 255, 20, 0.2)',
                                    border: '2px solid rgba(57, 255, 20, 0.5)'
                                }}
                            >
                                <span className="button-icon">➡️</span>
                                Következő
                            </button>
                        )}
                    </div>

                    {message && (
                        <div className={`message ${isCorrect ? 'correct' : 'incorrect'}`}>
                            {message}
                        </div>
                    )}

                    {showExpression && question && (
                        <div className="expression-display">
                            <pre>{question.expression}</pre>
                        </div>
                    )}
                </>
            ) : (
                // Normál feladat megjelenítése
                <>
                    <h2 className="question-text" style={{ whiteSpace: 'pre-line' }}>
                        {question?.question}
                    </h2>

                    <div className="answer-section">
                        {question?.fourthAnswer !== undefined ? (
                            <>
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && userAnswer2.trim() && submitAnswer()}
                                    className="answer-input"
                                    placeholder="1. válasz"
                                    autoFocus
                                    style={{ marginRight: '10px' }}
                                />
                                <input
                                    type="number"
                                    value={userAnswer2}
                                    onChange={(e) => setUserAnswer2(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && userAnswer3.trim() && submitAnswer()}
                                    className="answer-input"
                                    placeholder="2. válasz"
                                    style={{ marginRight: '10px' }}
                                />
                                <input
                                    type="number"
                                    value={userAnswer3}
                                    onChange={(e) => setUserAnswer3(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && userAnswer4.trim() && submitAnswer()}
                                    className="answer-input"
                                    placeholder="3. válasz"
                                    style={{ marginRight: '10px' }}
                                />
                                <input
                                    type="number"
                                    value={userAnswer4}
                                    onChange={(e) => setUserAnswer4(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                    className="answer-input"
                                    placeholder="4. válasz"
                                />
                            </>
                        ) : question?.thirdAnswer !== undefined ? (
                            <>
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && userAnswer2.trim() && submitAnswer()}
                                    className="answer-input"
                                    placeholder="1. válasz"
                                    autoFocus
                                    style={{ marginRight: '10px' }}
                                />
                                <input
                                    type="number"
                                    value={userAnswer2}
                                    onChange={(e) => setUserAnswer2(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && userAnswer3.trim() && submitAnswer()}
                                    className="answer-input"
                                    placeholder="2. válasz"
                                    style={{ marginRight: '10px' }}
                                />
                                <input
                                    type="number"
                                    value={userAnswer3}
                                    onChange={(e) => setUserAnswer3(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                    className="answer-input"
                                    placeholder="3. válasz"
                                />
                            </>
                        ) : question?.alternativeAnswer !== undefined ? (
                            <>
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && userAnswer2.trim() && submitAnswer()}
                                    className="answer-input"
                                    placeholder="1. válasz"
                                    autoFocus
                                    style={{ marginRight: '10px' }}
                                />
                                <input
                                    type="number"
                                    value={userAnswer2}
                                    onChange={(e) => setUserAnswer2(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                    className="answer-input"
                                    placeholder="2. válasz"
                                />
                            </>
                        ) : (
                            <MathTemplateInput
                                value={userAnswer}
                                autoFocus
                                placeholder={
                                    question?.expectedSet
                                        ? 'Halmaz, pl. {1; 2; 3} vagy ∅'
                                        : 'Írd be a választ…'
                                }
                                onChange={setUserAnswer}
                                onSubmit={submitAnswer}
                            />
                        )}
                        <div className="answer-buttons">
                            <button
                                className="submit-button"
                                onClick={submitAnswer}
                                disabled={
                                    question?.fourthAnswer !== undefined
                                        ? (!userAnswer.trim() || !userAnswer2.trim() || !userAnswer3.trim() || !userAnswer4.trim())
                                        : question?.thirdAnswer !== undefined
                                            ? (!userAnswer.trim() || !userAnswer2.trim() || !userAnswer3.trim())
                                            : question?.alternativeAnswer !== undefined
                                                ? (!userAnswer.trim() || !userAnswer2.trim())
                                                : !userAnswer.trim()
                                }
                            >
                                <span className="button-icon">✅</span>
                                VÁLASZ
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`message ${isCorrect ? 'correct' : 'incorrect'}`}>
                            {message}
                        </div>
                    )}

                    {showExpression && question && (
                        <div className="expression-display">
                            <pre>{question.expression}</pre>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
