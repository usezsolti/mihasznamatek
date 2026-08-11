import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAvatarColor, getRankEmoji, getRankTitle } from '../utils/practiceProgress';

export default function UniBoostGame() {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [showExpression, setShowExpression] = useState(false);
    const [avatarLevel, setAvatarLevel] = useState(1);
    const [avatarProgress, setAvatarProgress] = useState(0);
    const [studentName, setStudentName] = useState('');
    const [taskId, setTaskId] = useState('');

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('uniboostHighScore');
            if (saved) {
                setHighScore(parseInt(saved));
            }
        }
    }, []);

    useEffect(() => {
        if (router.isReady) {
            const { studentName: urlStudentName, taskId: urlTaskId } = router.query;
            if (urlStudentName) {
                setStudentName(decodeURIComponent(urlStudentName as string));
            }
            if (urlTaskId) {
                setTaskId(urlTaskId as string);
            }
        }
    }, [router.isReady, router.query]);

    interface Question {
        question: string;
        answer: number;
        type: 'addition' | 'subtraction' | 'multiplication' | 'division';
        expression: string;
        longDivision?: string;
    }

    // Pick Szeged kézilabda feladatok
    const questions: Question[] = [
        {
            question: 'A Pick Szeged férfi kézilabda csapatában az átlövők testmagassága 193, 198, 199, 200, 203 és 203 centiméter. Véletlenszerűen kiválasztva egy játékost mi az esélye annak, hogy az ő testmagassága legalább 200 cm?',
            answer: 0.5,
            type: 'multiplication',
            expression: 'ξ = a kiválasztott játékos testmagassága\nP(ξ ≥ 200) = 50% = 0.5'
        },
        {
            question: 'Mennyi a testmagasság várható értéke? (Add meg két tizedesjegy pontossággal)',
            answer: 199.33,
            type: 'multiplication',
            expression: 'E(ξ) = (193+198+199+200+203+203)/6 = 1196/6 = 199.33'
        },
        {
            question: 'Mennyi a testmagasság szórása? (Add meg egy tizedesjegy pontossággal)',
            answer: 3.4,
            type: 'multiplication',
            expression: 'D(ξ) = 3.4'
        },
        // Sárkány feladatok
        {
            question: 'A biológiai kutatások egyik új és fontos területe a sárkányok vizsgálata. A tudósok eddig 1, 3, 7 és 12 fejű sárkányokat figyeltek meg, ezek aránya a populáción belül 10, 40, 30 illetve 20 százalék. Véletlenszerűen kiválasztunk egy egyedet a populációból, és jelölje ξ a fejek számát a választott egyednél! Mi a ξ változó módusza?',
            answer: 3,
            type: 'multiplication',
            expression: 'Rξ = {1, 3, 7, 12}\nP(ξ=1) = 0.1, P(ξ=3) = 0.4, P(ξ=7) = 0.3, P(ξ=12) = 0.2\nmódusz = 3, jelentése: a legnagyobb arányban előforduló érték'
        },
        {
            question: 'Mennyi a sárkány fejek számának várható értéke? (Add meg egy tizedesjegy pontossággal)',
            answer: 5.8,
            type: 'multiplication',
            expression: 'E(ξ) = 1×0.1 + 3×0.4 + 7×0.3 + 12×0.2 = 0.1 + 1.2 + 2.1 + 2.4 = 5.8\njelentése: a fejek számának átlagos értéke'
        },
        {
            question: 'Mennyi a sárkány fejek számának szórása? (Add meg egy tizedesjegy pontossággal)',
            answer: 3.7,
            type: 'multiplication',
            expression: 'D(ξ) = 3.7\njelentése: a várható értéktől vett átlagos eltérés'
        },
        // Biológiai feladatok
        {
            question: 'Biológusok azt vizsgálták, hogy egy nemzeti parkban hány egyed él egy ritka fafajból. Felosztották a park területét 1 hektár területű négyzetekre, és felmérték, hogy az egyes négyzetekben hány egyed található ebből a fajból. Egy egyedet sem találtak a négyzetek 40 százalékán, 1 egyedet találtak a négyzetek 30 százalékán, 2 egyedet találtak a négyzetek 20 százalékán, és végül 3 egyedet találtak a négyzetek 10 százalékán. Három egyednél többet sehol sem találtak. Legyen ξ az egyedek száma egy véletlenszerűen kiválasztott négyzetben! Mennyi az esélye, hogy a kiválasztott négyzeten 1-nél több egyed található a fafajból?',
            answer: 0.3,
            type: 'multiplication',
            expression: 'Rξ = {0, 1, 2, 3}\nP(ξ=0) = 0.4, P(ξ=1) = 0.3, P(ξ=2) = 0.2, P(ξ=3) = 0.1\nP(ξ > 1) = P(ξ=2) + P(ξ=3) = 0.2 + 0.1 = 0.3 = 30%'
        },
        {
            question: 'Mi a ξ változó módusza?',
            answer: 0,
            type: 'multiplication',
            expression: 'módusz = 0\njelentése: a legnagyobb arányban előforduló érték'
        },
        {
            question: 'Mennyi a ξ várható értéke?',
            answer: 1,
            type: 'multiplication',
            expression: 'E(ξ) = 0×0.4 + 1×0.3 + 2×0.2 + 3×0.1 = 0 + 0.3 + 0.4 + 0.3 = 1\njelentése: átlagosan ennyi fa található az 1 hektáros négyzetekben'
        },
        {
            question: 'Mennyi a ξ szórása?',
            answer: 1,
            type: 'multiplication',
            expression: 'D(ξ) = 1\njelentése: a várható értéktől vett átlagos eltérés'
        },
        // Szerencsejáték feladatok
        {
            question: 'Egy szerencsejátékban a játékos 1000, 2000, 3000 vagy 5000 forintot nyerhet, ezen nyeremények esélye 50, 30, 15 illetve 5 százalék. Egyszer játsszuk ezt a játékot, jelölje ξ a nyeremény nagyságát! Mennyi az esélye annak, hogy legfeljebb 2000 forintot nyerünk?',
            answer: 0.8,
            type: 'multiplication',
            expression: 'Rξ = {1000, 2000, 3000, 5000}\nP(ξ=1000) = 0.5, P(ξ=2000) = 0.3, P(ξ=3000) = 0.15, P(ξ=5000) = 0.05\nP(ξ ≤ 2000) = P(ξ=1000) + P(ξ=2000) = 0.5 + 0.3 = 0.8'
        },
        {
            question: 'Mi a ξ változó módusza?',
            answer: 1000,
            type: 'multiplication',
            expression: 'módusz = 1000 (a legnagyobb valószínűséggel előforduló érték)'
        },
        {
            question: 'Mennyi a ξ várható értéke?',
            answer: 1800,
            type: 'multiplication',
            expression: 'E(ξ) = 1000×0.5 + 2000×0.3 + 3000×0.15 + 5000×0.05 = 500 + 600 + 450 + 250 = 1800'
        },
        {
            question: 'Mennyi a ξ szórása?',
            answer: 1030,
            type: 'multiplication',
            expression: 'D(ξ) = 1030'
        },
        // Család feladatok
        {
            question: 'Egy családban 4 gyerek van, a testtömegük: 50, 54, 60, 70 kg. Véletlenszerűen kiválasztunk egy gyereket. Legyen ξ = kiválasztott gyerek tömege. Mennyi a ξ várható értéke? (Add meg egy tizedesjegy pontossággal)',
            answer: 58.5,
            type: 'multiplication',
            expression: 'E(ξ) = (50 + 54 + 60 + 70) / 4 = 234 / 4 = 58.5'
        },
        {
            question: 'Mennyi a ξ varianciája? (Add meg két tizedesjegy pontossággal)',
            answer: 56.75,
            type: 'multiplication',
            expression: 'Var(ξ) = ([50-58.5]² + [54-58.5]² + [60-58.5]² + [70-58.5]²) / 4\nVar(ξ) = ([-8.5]² + [-4.5]² + [1.5]² + [11.5]²) / 4\nVar(ξ) = (72.25 + 20.25 + 2.25 + 132.25) / 4 = 227 / 4 = 56.75'
        },
        {
            question: 'Mennyi a ξ szórása? (Add meg két tizedesjegy pontossággal)',
            answer: 7.53,
            type: 'multiplication',
            expression: 'D(ξ) = √Var(ξ) = √56.75 = 7.53'
        },
        // Fészek feladatok
        {
            question: 'Egy diszkrét valószínűségi változó ξ valószínűségeloszlása: P(ξ=2) = 0.1, P(ξ=3) = 0.2, P(ξ=4) = 0.35, P(ξ=5) = 0.35. Mennyi a ξ változó lehetséges értékeinek összvalószínűsége?',
            answer: 1,
            type: 'multiplication',
            expression: 'P(ξ=2) + P(ξ=3) + P(ξ=4) + P(ξ=5) = 0.1 + 0.2 + 0.35 + 0.35 = 1'
        },
        {
            question: 'A fészkek mekkora hányadában található legfeljebb 3 tojás?',
            answer: 0.3,
            type: 'multiplication',
            expression: 'P(legfeljebb 3 tojás) = P(ξ ≤ 3) = P(ξ=2) + P(ξ=3) = 0.1 + 0.2 = 0.3'
        },
        {
            question: 'Hány módusza van a ξ változónak?',
            answer: 2,
            type: 'multiplication',
            expression: 'Két módusz van, a 4 és az 5. Mindkettő 35% arányban fordul elő.\nP(ξ=4) = 0.35 és P(ξ=5) = 0.35 (legnagyobb valószínűségek)'
        },
        // Folytonos valószínűségi változó feladatok
        {
            question: 'Jelölje ξ a napi középhőmérsékletet Celsiusban egy januári napon. A ξ egy folytonos valószínűségi változó, melynek sűrűségfüggvénye f(x) = 1/20 ha -15 ≤ x ≤ 5, és f(x) = 0 minden más x esetén. Mennyi annak az esélye, hogy a napi középhőmérséklet -10°C és 10°C közé esik?',
            answer: 0.75,
            type: 'multiplication',
            expression: 'Rξ = [-15, +5]\nP(-10 ≤ ξ ≤ +10) = ∫_{-10}^{+10} fξ(x) dx = 0.75'
        },
        {
            question: 'Mekkora valószínűséggel lesz a napi középhőmérséklet legalább 0°C?',
            answer: 0.25,
            type: 'multiplication',
            expression: 'P(ξ ≥ 0) = ∫_0^{+5} fξ(x) dx = 0.25'
        },
        // Fa átmérő feladatok
        {
            question: 'Egy erdőben a fák törzsének méterben kifejezett átmérője a következő sűrűségfüggvénnyel írható le: f(x) = 3√x / 2 ha 0 ≤ x ≤ 1, és f(x) = 0 minden más x esetén. Véletlenszerűen kiválasztunk egy fát, és legyen ξ ezen egyed átmérője! Mennyi a P(0.5 ≤ ξ ≤ 1.5) valószínűség értéke?',
            answer: 0.65,
            type: 'multiplication',
            expression: 'Rξ = [0, 1]\nP(0.5 ≤ ξ ≤ 1.5) = ∫_{0.5}^{1.5} fξ(x) dx = 0.65\na fák 65 százaléka esik 0.5 és 1.5 közé'
        },
        {
            question: 'Mennyi a P(ξ ≤ 0.8) valószínűség értéke?',
            answer: 0.72,
            type: 'multiplication',
            expression: 'P(ξ ≤ 0.8) = ∫_{0}^{0.8} fξ(x) dx = 0.72\na fák 72 százaléka legfeljebb 0.8 átmérőjű'
        },
        // Állat testhossz feladatok
        {
            question: 'Egy állatpopulációban az egyedek testhossza a következő sűrűségfüggvénnyel írható le: f(x) = 8/(3x³) ha 1 ≤ x ≤ 2, és f(x) = 0 minden más x valós számra. A populációban az egyedek mekkora hányadának esik a testhossza 0.5 és 1.5 közé?',
            answer: 0.74,
            type: 'multiplication',
            expression: 'Rξ = [1, 2]\nP(0.5 ≤ ξ ≤ 1.5) = ∫_{0.5}^{1.5} fξ(x)dx = 0.74'
        },
        {
            question: 'Az egyedek hány százaléka éri el az 1.8 hosszúságot?',
            answer: 0.08,
            type: 'multiplication',
            expression: 'P(ξ ≥ 1.8) = ∫_{1.8}^{2} fξ(x)dx = 0.08'
        }
    ];

    const startGame = () => {
        setGameActive(true);
        setCurrentQuestion(0);
        setScore(0);
        setLives(3);
        setAvatarLevel(1);
        setAvatarProgress(0);
        setUserAnswer('');
        setMessage('');
        setIsCorrect(false);
        setShowExpression(false);
    };

    const submitAnswer = () => {
        if (!userAnswer) return;

        const currentQ = questions[currentQuestion];
        const userNum = parseFloat(userAnswer);
        const correctAnswer = currentQ.answer;

        // Különböző tolerancia a különböző válaszokhoz
        let tolerance;
        if (currentQuestion === 0) {
            // P(ξ ≥ 200) = 0.5 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 1) {
            // E(ξ) = 199.33 - két tizedesjegy pontosság
            tolerance = 0.01;
        } else if (currentQuestion === 2) {
            // D(ξ) = 3.4 - egy tizedesjegy pontosság
            tolerance = 0.1;
        } else if (currentQuestion === 3) {
            // módusz = 3 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 4) {
            // E(ξ) = 5.8 - egy tizedesjegy pontosság
            tolerance = 0.1;
        } else if (currentQuestion === 5) {
            // D(ξ) = 3.7 - egy tizedesjegy pontosság
            tolerance = 0.1;
        } else if (currentQuestion === 6) {
            // P(ξ > 1) = 0.3 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 7) {
            // módusz = 0 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 8) {
            // E(ξ) = 1 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 9) {
            // D(ξ) = 1 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 10) {
            // P(ξ ≤ 2000) = 0.8 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 11) {
            // módusz = 1000 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 12) {
            // E(ξ) = 1800 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 13) {
            // D(ξ) = 1030 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 14) {
            // E(ξ) = 58.5 - egy tizedesjegy pontosság
            tolerance = 0.1;
        } else if (currentQuestion === 15) {
            // Var(ξ) = 56.75 - két tizedesjegy pontosság
            tolerance = 0.01;
        } else if (currentQuestion === 16) {
            // D(ξ) = 7.53 - két tizedesjegy pontosság
            tolerance = 0.01;
        } else if (currentQuestion === 17) {
            // Összvalószínűség = 1 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 18) {
            // P(ξ ≤ 3) = 0.3 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 19) {
            // Móduszok száma = 2 - egész szám
            tolerance = 0.01;
        } else if (currentQuestion === 20) {
            // P(-10 ≤ ξ ≤ +10) = 0.75 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 21) {
            // P(ξ ≥ 0) = 0.25 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 22) {
            // P(0.5 ≤ ξ ≤ 1.5) = 0.65 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 23) {
            // P(ξ ≤ 0.8) = 0.72 - szigorúbb tolerancia
            tolerance = 0.01;
        } else if (currentQuestion === 24) {
            // P(0.5 ≤ ξ ≤ 1.5) = 0.74 - szigorúbb tolerancia
            tolerance = 0.01;
        } else {
            // P(ξ ≥ 1.8) = 0.08 - szigorúbb tolerancia
            tolerance = 0.01;
        }

        const isAnswerCorrect = Math.abs(userNum - correctAnswer) <= tolerance;

        if (isAnswerCorrect) {
            setScore(score + 10);
            setMessage('Helyes! 🎉');
            setIsCorrect(true);
            setShowExpression(true);

            // Avatar progress
            setAvatarProgress(avatarProgress + 1);
            if (avatarProgress >= 10) {
                setAvatarLevel(avatarLevel + 1);
                setAvatarProgress(0);
            }
        } else {
            setLives(lives - 1);
            setMessage(`Helytelen! A helyes válasz: ${correctAnswer}`);
            setIsCorrect(false);
            setShowExpression(true);
        }

        setUserAnswer('');
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setLevel(Math.floor((currentQuestion + 1) / 5) + 1);
        } else {
            // Játék vége
            if (score > highScore) {
                setHighScore(score);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('uniboostHighScore', score.toString());
                }
            }
            setGameActive(false);
        }
        setMessage('');
        setIsCorrect(false);
        setShowExpression(false);
    };

    const resetGame = () => {
        setGameActive(false);
        setCurrentQuestion(0);
        setScore(0);
        setLives(3);
        setAvatarLevel(1);
        setAvatarProgress(0);
        setUserAnswer('');
        setMessage('');
        setIsCorrect(false);
        setShowExpression(false);
    };


    const getAvatarImage = (level: number) => getRankEmoji(level);

    const getAvatarTitle = (level: number) => getRankTitle(level);

    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <div className="game-container">
            <Head>
                <title>Mihaszna Matek - Játék</title>
            </Head>

            <div className="background-effects">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <div className="game-content">
                {!gameActive && (
                    <>
                        <h1 className="game-title">🚀 UniBoost</h1>
                        {studentName && <p className="student-info">Tanuló: {studentName}</p>}
                    </>
                )}

                {!gameActive ? (
                    <div className="game-info-section">
                        <div className="selected-level">
                            <h3>🎓 Egyetemi szint - Diszkrét valószínűségi változók</h3>
                        </div>
                        <div className="stats-display">
                            <div className="stat-item">
                                <span className="stat-icon">🏆</span>
                                <span className="stat-label">Legjobb eredmény</span>
                                <span className="stat-value">{highScore}</span>
                            </div>
                        </div>
                        <button
                            className="start-button"
                            onClick={startGame}
                        >
                            <span className="button-icon">🚀</span>
                            JÁTÉK INDÍTÁSA
                        </button>
                    </div>
                ) : (
                    <div className="game-screen">
                        <div className="hud">
                            <div className="hud-item">
                                <span className="hud-label">Pontszám:</span>
                                <span className="hud-value">{score}</span>
                            </div>
                            <div className="hud-item">
                                <span className="hud-label">Életek:</span>
                                <span className="hud-value">{"❤️".repeat(lives)}</span>
                            </div>
                            <div className="hud-item">
                                <span className="hud-label">Feladat:</span>
                                <span className="hud-value">{currentQuestion + 1}/{questions.length}</span>
                            </div>
                        </div>

                        <div className="avatar-container">
                            <div
                                className="avatar"
                                style={{ background: getAvatarColor(avatarLevel) }}
                            >
                                {getAvatarImage(avatarLevel)}
                            </div>
                            <div className="avatar-info">
                                <div className="legend-text">{getAvatarTitle(avatarLevel)}</div>
                                <div className="legend-badge">Szint {avatarLevel}</div>
                            </div>
                        </div>

                        <div className="question-card">
                            <h2 className="question-text">
                                {questions[currentQuestion]?.question}
                            </h2>

                            <div className="answer-section">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                    placeholder="Add meg a választ..."
                                    className="answer-input"
                                />
                                <button
                                    className="submit-button"
                                    onClick={submitAnswer}
                                    disabled={!userAnswer}
                                >
                                    <span className="button-icon">✔</span>
                                    VÁLASZ
                                </button>
                            </div>

                            {message && (
                                <div className={`message ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    {message}
                                </div>
                            )}

                            {showExpression && (
                                <div className="expression-display">
                                    <h3>📝 Megoldás:</h3>
                                    <pre>{questions[currentQuestion]?.expression}</pre>
                                    <button className="next-button" onClick={nextQuestion}>
                                        Következő kérdés →
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="reset-button" onClick={resetGame}>
                            <span className="button-icon">🔄</span>
                            ÚJ JÁTÉK
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .game-container {
                    min-height: 100vh;
                    background: 
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
                    background-color: #0a0a0a;
                    color: white;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .background-effects {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .floating-shapes {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }

                .shape {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(45deg, rgba(57, 255, 20, 0.1), rgba(255, 119, 198, 0.1));
                    animation: float 6s ease-in-out infinite;
                }

                .shape-1 {
                    width: 100px;
                    height: 100px;
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .shape-2 {
                    width: 150px;
                    height: 150px;
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .shape-3 {
                    width: 80px;
                    height: 80px;
                    bottom: 20%;
                    left: 20%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }

                .game-content {
                    width: 100%;
                    max-width: 800px;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }

                .game-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    background: linear-gradient(45deg, #39ff14, #ff77c6, #78dbff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                    text-shadow: 0 0 30px rgba(57, 255, 20, 0.5);
                }

                .game-subtitle {
                    color: #39ff14;
                    font-size: 1.3rem;
                    margin-bottom: 40px;
                    font-weight: 600;
                }

                .student-info {
                    color: #78dbff;
                    font-size: 1.1rem;
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                .selected-level h3 {
                    color: #39ff14;
                    font-size: 1.5rem;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                    margin-bottom: 30px;
                }

                .stats-display {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 40px;
                }

                .stat-item {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 20px;
                    padding: 20px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    position: relative;
                    top: 0;
                    transition: all 0.3s ease;
                }

                .stat-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(120, 219, 255, 0.4);
                }

                .stat-icon {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 10px;
                }

                .stat-label {
                    display: block;
                    color: #78dbff;
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                    font-weight: 600;
                }

                .stat-value {
                    display: block;
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .start-button, .reset-button {
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    border: none;
                    border-radius: 25px;
                    padding: 15px 30px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 10px;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 15px rgba(57, 255, 20, 0.3);
                }

                .start-button:hover, .reset-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(57, 255, 20, 0.5);
                }

                .button-icon {
                    font-size: 1.2rem;
                }

                .game-screen {
                    width: 100%;
                }

                .hud {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .hud-item {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 15px;
                    padding: 15px 20px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    min-width: 120px;
                }

                .hud-label {
                    display: block;
                    color: #78dbff;
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                    font-weight: 600;
                }

                .hud-value {
                    display: block;
                    color: white;
                    font-size: 1.3rem;
                    font-weight: 800;
                }

                .avatar-container {
                    margin: 30px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }

                .avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 3px solid rgba(255, 255, 255, 0.2);
                }

                .avatar-info {
                    text-align: center;
                }

                .legend-text {
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .legend-badge {
                    background: rgba(120, 219, 255, 0.2);
                    border: 1px solid rgba(120, 219, 255, 0.5);
                    border-radius: 15px;
                    padding: 5px 15px;
                    color: #78dbff;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .question-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(120, 219, 255, 0.3);
                    border-radius: 25px;
                    padding: 40px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    margin: 30px 0;
                }

                .question-text {
                    font-size: 1.4rem;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    color: #fff;
                    font-weight: 500;
                }

                .answer-section {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .answer-input {
                    flex: 1;
                    min-width: 200px;
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    border-radius: 15px;
                    padding: 15px 20px;
                    color: #39ff14;
                    font-size: 1.5rem;
                    font-weight: 600;
                    text-align: center;
                    width: 200px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
                    background: rgba(0, 0, 0, 0.3);
                }

                .answer-input:focus {
                    outline: none;
                    border-color: #39ff14;
                    box-shadow: 0 0 30px rgba(57, 255, 20, 0.4);
                }

                .answer-input::placeholder {
                    color: rgba(57, 255, 20, 0.6);
                }

                .submit-button {
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    border: none;
                    border-radius: 20px;
                    padding: 15px 25px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 140px;
                    justify-content: center;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(57, 255, 20, 0.4);
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .message {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    text-align: center;
                }

                .message.correct {
                    background: rgba(57, 255, 20, 0.2);
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    color: #39ff14;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
                }

                .message.incorrect {
                    background: rgba(255, 77, 198, 0.2);
                    border: 2px solid rgba(255, 77, 198, 0.5);
                    color: #ff77c6;
                    box-shadow: 0 0 20px rgba(255, 77, 198, 0.3);
                }

                .expression-display {
                    margin-top: 20px;
                    padding: 20px;
                    background: rgba(120, 219, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.3);
                    border-radius: 15px;
                }

                .expression-display h3 {
                    margin: 0 0 15px 0;
                    color: #78dbff;
                }

                .expression-display pre {
                    color: #78dbff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0 0 20px 0;
                    white-space: pre-line;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 10px;
                    border-left: 4px solid #78dbff;
                }

                .next-button {
                    padding: 12px 25px;
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .next-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(57, 255, 20, 0.4);
                }

                @media (max-width: 768px) {
                    .hud {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .answer-section {
                        flex-direction: column;
                    }
                    
                    .game-title {
                        font-size: 2.5rem;
                    }
                }
            `}</style>
        </div>
    );
}