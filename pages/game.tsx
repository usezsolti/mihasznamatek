import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Game() {
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
    const [educationLevel, setEducationLevel] = useState<'elementary' | 'highschool' | 'university' | null>(null);
    const [universityQuestions, setUniversityQuestions] = useState<Question[]>([]);
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [currentTopic, setCurrentTopic] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [taskQuestions, setTaskQuestions] = useState<Question[]>([]);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('highScore');
            if (saved) {
                setHighScore(parseInt(saved));
            }
        }

        // Admin ellenőrzés
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
                        // Ha nincs bejelentkezve, engedjük a játékot
                        setLoading(false);
                        return;
                    }

                    setCurrentUser(user);

                    // Admin ellenőrzés - csak usezsolti@gmail.com férhet hozzá a játék módosításhoz
                    if (user.email === 'usezsolti@gmail.com') {
                        console.log('Admin hozzáférés engedélyezve:', user.email);
                        setIsAdmin(true);
                    } else {
                        console.log('Felhasználó játékban:', user.email);
                        setIsAdmin(false);
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

        // URL paraméterek kezelése - csak UniBoost támogatott
        if (router.query.uniboost === 'true') {
            setEducationLevel('university');
        }

        // Témakör paraméter kezelése
        if (router.query.topic) {
            setCurrentTopic(router.query.topic as string);
        }

        // Kártya feladatok betöltése
        if (router.query.taskId) {
            loadTaskQuestions(router.query.taskId as string);
        }

        // Kiosztott feladatok betöltése
        loadAssignedTasks();
    }, [router.query]);

    const loadTaskQuestions = async (taskId: string) => {
        try {
            if (!(window as any).firebase) {
                return;
            }

            const db = (window as any).firebase.firestore();

            // Kártya feladatok betöltése a customTasks collection-ból
            const snapshot = await db.collection('customTasks')
                .where('id', '==', taskId)
                .get();

            if (!snapshot.empty) {
                const taskDoc = snapshot.docs[0];
                const taskData = taskDoc.data();

                setSelectedTask(taskData);

                // Csak a customQuestions-okat használjuk, ha vannak
                if (taskData.customQuestions && taskData.customQuestions.length > 0) {
                    const questions = taskData.customQuestions.map((q: any, index: number) => ({
                        id: `task_${taskId}_${index}`,
                        question: q.question || `Feladat ${index + 1}`,
                        answer: q.answer || 0,
                        expression: q.expression || '',
                        level: 'university'
                    }));
                    setTaskQuestions(questions);
                } else {
                    // Ha nincsenek custom questions, üres tömb
                    setTaskQuestions([]);
                }
            }
        } catch (error) {
            console.error('Error loading task questions:', error);
        }
    };

    const generateTaskQuestions = (taskData: any) => {
        // Alapértelmezett feladatok generálása a kártya alapján
        const questions: Question[] = [];
        const taskCount = taskData.questions || 10;

        for (let i = 0; i < taskCount; i++) {
            const question = generateQuestionByTopic(taskData.topic || taskData.title);
            if (question) {
                questions.push({
                    ...question,
                    id: `generated_${taskData.id}_${i}`,
                    level: 'university'
                });
            }
        }

        setTaskQuestions(questions);
    };

    const generateQuestionByTopic = (topic: string) => {
        // Témakör alapján feladat generálása
        const topicLower = topic.toLowerCase();

        if (topicLower.includes('másodfokú') || topicLower.includes('egyenlet')) {
            return generateQuadraticQuestion();
        } else if (topicLower.includes('derivál') || topicLower.includes('derivált')) {
            return generateDerivativeQuestion();
        } else if (topicLower.includes('trigonometri')) {
            return generateTrigonometryQuestion();
        } else if (topicLower.includes('integrál')) {
            return generateIntegralQuestion();
        } else if (topicLower.includes('geometri')) {
            return generateGeometryQuestion();
        } else {
            // Alapértelmezett algebra feladat
            return generateAlgebraQuestion();
        }
    };

    const generateQuadraticQuestion = () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) - 5;
        const c = Math.floor(Math.random() * 10) - 5;

        const discriminant = b * b - 4 * a * c;
        let answer = 0;
        let question = '';

        if (discriminant >= 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            answer = Math.round(x1 * 10) / 10;
            question = `${a}x² + ${b}x + ${c} = 0 egyenlet egyik gyöke?`;
        } else {
            answer = 0;
            question = `${a}x² + ${b}x + ${c} = 0 egyenlet diszkriminánsa pozitív? (1 = igen, 0 = nem)`;
        }

        return {
            question,
            answer,
            expression: `${a}x² + ${b}x + ${c} = 0`
        };
    };

    const generateDerivativeQuestion = () => {
        const coefficient = Math.floor(Math.random() * 5) + 1;
        const power = Math.floor(Math.random() * 4) + 2;

        const answer = coefficient * power;
        const question = `${coefficient}x^${power} deriváltja?`;

        return {
            question,
            answer,
            expression: `d/dx(${coefficient}x^${power})`
        };
    };

    const generateTrigonometryQuestion = () => {
        const angles = [0, 30, 45, 60, 90];
        const angle = angles[Math.floor(Math.random() * angles.length)];

        let answer = 0;
        let question = '';

        if (angle === 0) answer = 0;
        else if (angle === 30) answer = 0.5;
        else if (angle === 45) answer = Math.sqrt(2) / 2;
        else if (angle === 60) answer = Math.sqrt(3) / 2;
        else if (angle === 90) answer = 1;

        question = `sin(${angle}°) értéke?`;

        return {
            question,
            answer: Math.round(answer * 100) / 100,
            expression: `sin(${angle}°)`
        };
    };

    const generateIntegralQuestion = () => {
        const coefficient = Math.floor(Math.random() * 5) + 1;
        const power = Math.floor(Math.random() * 3) + 1;

        const answer = coefficient / (power + 1);
        const question = `∫${coefficient}x^${power} dx eredménye?`;

        return {
            question,
            answer,
            expression: `∫${coefficient}x^${power} dx`
        };
    };

    const generateGeometryQuestion = () => {
        const side = Math.floor(Math.random() * 10) + 1;
        const answer = side * side;
        const question = `${side} cm oldalú négyzet területe?`;

        return {
            question,
            answer,
            expression: `${side} cm × ${side} cm`
        };
    };

    const generateAlgebraQuestion = () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = a + b;
        const question = `${a} + ${b} = ?`;

        return {
            question,
            answer,
            expression: `${a} + ${b}`
        };
    };

    const loadAssignedTasks = async () => {
        try {
            if (!(window as any).firebase) {
                return;
            }

            const db = (window as any).firebase.firestore();
            const snapshot = await db.collection('assignedTasks')
                .where('userId', '==', currentUser?.uid || '')
                .where('topicId', '==', currentTopic)
                .get();

            const tasks: any[] = [];
            snapshot.forEach((doc: any) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });

            setAssignedTasks(tasks);
        } catch (error) {
            console.error('Error loading assigned tasks:', error);
        }
    };

    interface Question {
        question: string;
        answer: number;
        type: 'addition' | 'subtraction' | 'multiplication' | 'division';
        expression: string;
        longDivision?: string;
    }

    // Általános iskola feladatok (központi felvételi szint)
    const elementaryQuestions: Question[] = [
        // Alapvető műveletek
        { question: 'Mennyi 15 + 27?', answer: 42, type: 'addition', expression: '15 + 27 = 42' },
        { question: 'Mennyi 50 - 23?', answer: 27, type: 'subtraction', expression: '50 - 23 = 27' },
        { question: 'Mennyi 6 × 8?', answer: 48, type: 'multiplication', expression: '6 × 8 = 48' },
        { question: 'Mennyi 72 ÷ 9?', answer: 8, type: 'division', expression: '72 ÷ 9 = 8' },
        { question: 'Mennyi 3²?', answer: 9, type: 'multiplication', expression: '3² = 3 × 3 = 9' },
        { question: 'Mennyi √16?', answer: 4, type: 'multiplication', expression: '√16 = 4, mert 4² = 16' },
        
        // Geometria feladatok
        { question: 'Egy téglalap oldalai 8 cm és 12 cm. Mekkora a kerülete?', answer: 40, type: 'multiplication', expression: 'K = 2(a+b) = 2(8+12) = 2×20 = 40 cm' },
        { question: 'Számítsd ki a 15² értékét!', answer: 225, type: 'multiplication', expression: '15² = 15×15 = 225' },
        { question: 'Egy kör sugara 7 cm. Mekkora a területe? (π ≈ 3.14)', answer: 153.86, type: 'multiplication', expression: 'T = πr² = 3.14×7² = 3.14×49 = 153.86 cm²' },
        { question: 'Mekkora a 3/4 + 2/3 összege? (Add meg tizedes törtben)', answer: 1.417, type: 'addition', expression: '3/4 + 2/3 = 9/12 + 8/12 = 17/12 ≈ 1.417' },
        { question: 'Egy kocka éle 5 cm. Mekkora a térfogata?', answer: 125, type: 'multiplication', expression: 'V = a³ = 5³ = 125 cm³' },
        // Hatványozás és gyökvonás feladatok
        { question: 'Számítsd ki: √(3^(-3)) / 27²', answer: 0.00137, type: 'multiplication', expression: '√(3^(-3)) / 27² = √(1/27) / 729 = (1/3√3) / 729 ≈ 0.00137' },
        { question: 'Számítsd ki: ³√128 / ⁵√16', answer: 2, type: 'division', expression: '³√128 / ⁵√16 = ³√(2^7) / ⁵√(2^4) = 2^(7/3) / 2^(4/5) = 2^(35/15 - 12/15) = 2^(23/15) ≈ 2' },
        { question: 'Számítsd ki: 9 / ³√81', answer: 3, type: 'division', expression: '9 / ³√81 = 9 / ³√(3^4) = 9 / 3^(4/3) = 3^2 / 3^(4/3) = 3^(2-4/3) = 3^(2/3) ≈ 3' },
        { question: 'Számítsd ki: (2²)⁵ × (1/2) × 8^(-2)', answer: 0.5, type: 'multiplication', expression: '(2²)⁵ × (1/2) × 8^(-2) = 2^10 × 2^(-1) × 2^(-6) = 2^(10-1-6) = 2³ = 8' },
        { question: 'Számítsd ki: ⁵√3 / ³√9', answer: 0.577, type: 'division', expression: '⁵√3 / ³√9 = 3^(1/5) / 9^(1/3) = 3^(1/5) / 3^(2/3) = 3^(1/5 - 2/3) = 3^(-7/15) ≈ 0.577' },
        { question: 'Számítsd ki: 4 / ⁵√8', answer: 2, type: 'division', expression: '4 / ⁵√8 = 4 / 8^(1/5) = 2² / 2^(3/5) = 2^(2-3/5) = 2^(7/5) ≈ 2' },
        { question: 'Számítsd ki: √3 × 27 × ³√9²', answer: 81, type: 'multiplication', expression: '√3 × 27 × ³√9² = 3^(1/2) × 3³ × (3²)^(2/3) = 3^(1/2) × 3³ × 3^(4/3) = 3^(1/2 + 3 + 4/3) = 3^(3/6 + 18/6 + 8/6) = 3^(29/6) ≈ 81' },
        { question: 'Számítsd ki: ³√16 / ⁵√4', answer: 2, type: 'division', expression: '³√16 / ⁵√4 = 16^(1/3) / 4^(1/5) = (2^4)^(1/3) / (2²)^(1/5) = 2^(4/3) / 2^(2/5) = 2^(4/3 - 2/5) = 2^(20/15 - 6/15) = 2^(14/15) ≈ 2' },
        { question: 'Számítsd ki: √128 / ³√16', answer: 4, type: 'division', expression: '√128 / ³√16 = √(2^7) / ³√(2^4) = 2^(7/2) / 2^(4/3) = 2^(7/2 - 4/3) = 2^(21/6 - 8/6) = 2^(13/6) ≈ 4' },
        { question: 'Számítsd ki: 1 / √(27 × 9^(1/3))', answer: 0.192, type: 'division', expression: '1 / √(27 × 9^(1/3)) = 1 / √(3³ × 3^(2/3)) = 1 / √(3^(3 + 2/3)) = 1 / √(3^(11/3)) = 1 / 3^(11/6) ≈ 0.192' },
        { question: 'Számítsd ki a √(169) értékét!', answer: 13, type: 'multiplication', expression: '√(169) = 13, mert 13² = 169' },
        { question: 'Egy háromszög alapja 10 cm, magassága 6 cm. Mekkora a területe?', answer: 30, type: 'multiplication', expression: 'T = (a×m)/2 = (10×6)/2 = 60/2 = 30 cm²' },
        { question: 'Mekkora a 2⁵ értéke?', answer: 32, type: 'multiplication', expression: '2⁵ = 2×2×2×2×2 = 32' },
        { question: 'Egy paralelogramma alapja 8 cm, magassága 5 cm. Mekkora a területe?', answer: 40, type: 'multiplication', expression: 'T = a×m = 8×5 = 40 cm²' },
        { question: 'Számítsd ki a 0.25 × 8 értékét!', answer: 2, type: 'multiplication', expression: '0.25 × 8 = 2' },
        { question: 'Egy trapéz párhuzamos oldalai 6 cm és 10 cm, magassága 4 cm. Mekkora a területe?', answer: 32, type: 'multiplication', expression: 'T = (a+c)×m/2 = (6+10)×4/2 = 16×2 = 32 cm²' },
        { question: 'Mekkora a 5/6 - 1/3 különbsége? (Add meg tizedes törtben)', answer: 0.5, type: 'subtraction', expression: '5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2 = 0.5' },
        { question: 'Egy derékszögű háromszög befogói 3 cm és 4 cm. Mekkora az átfogója?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5 cm' },
        { question: 'Számítsd ki a 12% -át a 200-nak!', answer: 24, type: 'multiplication', expression: '200 × 0.12 = 24' },
        { question: 'Egy rombusz oldala 6 cm, magassága 4 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = a×m = 6×4 = 24 cm²' },
        { question: 'Mekkora a 3/5 × 10 értéke?', answer: 6, type: 'multiplication', expression: '3/5 × 10 = 30/5 = 6' },
        { question: 'Egy henger sugara 4 cm, magassága 7 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 351.68, type: 'multiplication', expression: 'V = πr²h = 3.14×4²×7 = 3.14×16×7 = 351.68 cm³' },
        { question: 'Számítsd ki a √(256) értékét!', answer: 16, type: 'multiplication', expression: '√(256) = 16, mert 16² = 256' },
        { question: 'Egy deltoid átlói 6 cm és 8 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = (d₁×d₂)/2 = (6×8)/2 = 48/2 = 24 cm²' },
        { question: 'Mekkora a 0.6 + 0.4 összege?', answer: 1, type: 'addition', expression: '0.6 + 0.4 = 1.0' },
        { question: 'Egy szabályos hatszög oldala 5 cm. Mekkora a kerülete?', answer: 30, type: 'multiplication', expression: 'K = 6a = 6×5 = 30 cm' },
        { question: 'Számítsd ki a 4³ értékét!', answer: 64, type: 'multiplication', expression: '4³ = 4×4×4 = 64' },
        { question: 'Egy kúp sugara 3 cm, magassága 6 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 56.52, type: 'multiplication', expression: 'V = πr²h/3 = 3.14×3²×6/3 = 3.14×9×2 = 56.52 cm³' },
        { question: 'Mekkora a 7/8 - 3/4 különbsége? (Add meg tizedes törtben)', answer: 0.125, type: 'subtraction', expression: '7/8 - 3/4 = 7/8 - 6/8 = 1/8 = 0.125' },
        { question: 'Egy téglalap területe 48 cm², egyik oldala 8 cm. Mekkora a másik oldala?', answer: 6, type: 'division', expression: 'T = a×b, 48 = 8×b, b = 48÷8 = 6 cm' },
        { question: 'Számítsd ki a 15% -át a 80-nak!', answer: 12, type: 'multiplication', expression: '80 × 0.15 = 12' },
        { question: 'Egy gömb sugara 6 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 904.32, type: 'multiplication', expression: 'V = 4πr³/3 = 4×3.14×6³/3 = 4×3.14×216/3 = 904.32 cm³' },
        { question: 'Mekkora a 2/3 × 9 értéke?', answer: 6, type: 'multiplication', expression: '2/3 × 9 = 18/3 = 6' },
        { question: 'Egy paralelogramma kerülete 24 cm, egyik oldala 7 cm. Mekkora a másik oldala?', answer: 5, type: 'subtraction', expression: 'K = 2(a+b), 24 = 2(7+b), 12 = 7+b, b = 5 cm' },
        { question: 'Számítsd ki a √(400) értékét!', answer: 20, type: 'multiplication', expression: '√(400) = 20, mert 20² = 400' }
    ];

    // Középiskola feladatok (érettségi szint)
    const highschoolQuestions: Question[] = [
        // Másodfokú egyenletek
        { question: 'Számítsd ki a 2x² - 5x + 3 = 0 másodfokú egyenlet gyökeit! (Add meg a nagyobb gyököt)', answer: 1.5, type: 'multiplication', expression: 'x = (5 ± √(25-24))/4 = (5 ± 1)/4, x₁ = 1, x₂ = 1.5' },
        { question: 'Oldd meg az x² - 4x + 3 = 0 egyenletet! (Add meg a kisebb gyököt)', answer: 1, type: 'multiplication', expression: 'x² - 4x + 3 = (x-1)(x-3) = 0, x₁ = 1, x₂ = 3' },
        { question: 'Számítsd ki a 3x² + 2x - 1 = 0 egyenlet diszkriminánsát!', answer: 16, type: 'multiplication', expression: 'D = b² - 4ac = 2² - 4×3×(-1) = 4 + 12 = 16' },
        
        // Trigonometria
        { question: 'Számítsd ki a sin(30°) értékét!', answer: 0.5, type: 'multiplication', expression: 'sin(30°) = 1/2 = 0.5' },
        { question: 'Számítsd ki a cos(60°) értékét!', answer: 0.5, type: 'multiplication', expression: 'cos(60°) = 1/2 = 0.5' },
        { question: 'Számítsd ki a tan(45°) értékét!', answer: 1, type: 'multiplication', expression: 'tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1' },
        
        // Logaritmus
        { question: 'Számítsd ki a log₂(8) értékét!', answer: 3, type: 'multiplication', expression: 'log₂(8) = log₂(2³) = 3·log₂(2) = 3·1 = 3' },
        { question: 'Számítsd ki a log₃(27) értékét!', answer: 3, type: 'multiplication', expression: 'log₃(27) = log₃(3³) = 3·log₃(3) = 3·1 = 3' },
        { question: 'Számítsd ki a log₁₀(1000) értékét!', answer: 3, type: 'multiplication', expression: 'log₁₀(1000) = log₁₀(10³) = 3·log₁₀(10) = 3·1 = 3' },
        
        // Geometria
        { question: 'Egy derékszögű háromszög befogói 3 és 4. Mekkora az átfogó?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5' },
        { question: 'Egy derékszögű háromszög befogói 3 és 4. Mekkora az átfogó?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5' },
        { question: 'Számítsd ki a log₂(8) értékét!', answer: 3, type: 'multiplication', expression: 'log₂(8) = log₂(2³) = 3·log₂(2) = 3·1 = 3' },
        { question: 'Egy kör sugara 5 cm. Mekkora a kerülete? (π ≈ 3.14)', answer: 31.4, type: 'multiplication', expression: 'K = 2πr = 2·3.14·5 = 31.4 cm' },
        { question: 'Számítsd ki a sin(30°) értékét!', answer: 0.5, type: 'multiplication', expression: 'sin(30°) = 1/2 = 0.5' },
        // Hatványozás és gyökvonás feladatok (középiskola szint)
        { question: 'Számítsd ki: (√3)^(-3) × 27^(2/3)', answer: 3, type: 'multiplication', expression: '(√3)^(-3) × 27^(2/3) = 3^(-3/2) × (3³)^(2/3) = 3^(-3/2) × 3² = 3^(-3/2 + 2) = 3^(1/2) = √3 ≈ 1.73' },
        { question: 'Számítsd ki: log₃(√(27))', answer: 1.5, type: 'multiplication', expression: 'log₃(√(27)) = log₃(√(3³)) = log₃(3^(3/2)) = (3/2)·log₃(3) = 3/2 = 1.5' },
        { question: 'Számítsd ki: 2^(log₂(8)) + 3^(log₃(9))', answer: 17, type: 'addition', expression: '2^(log₂(8)) + 3^(log₃(9)) = 8 + 9 = 17' },
        { question: 'Számítsd ki: √(2 + √3) × √(2 - √3)', answer: 1, type: 'multiplication', expression: '√(2 + √3) × √(2 - √3) = √((2 + √3)(2 - √3)) = √(4 - 3) = √1 = 1' },
        { question: 'Számítsd ki: (1/2)^(-2) + (1/3)^(-1)', answer: 7, type: 'addition', expression: '(1/2)^(-2) + (1/3)^(-1) = 2² + 3 = 4 + 3 = 7' },
        { question: 'Egy számtani sorozat első tagja 2, differenciája 3. Mennyi a 10. tag?', answer: 29, type: 'multiplication', expression: 'a₁₀ = a₁ + (10-1)·d = 2 + 9·3 = 2 + 27 = 29' },
        { question: 'Számítsd ki a 2⁴ + 3² értékét!', answer: 25, type: 'multiplication', expression: '2⁴ + 3² = 16 + 9 = 25' },
        { question: 'Egy téglalap oldalai 6 cm és 8 cm. Mekkora az átlója?', answer: 10, type: 'multiplication', expression: 'd² = a² + b² = 6² + 8² = 36 + 64 = 100, d = 10 cm' },
        { question: 'Számítsd ki a cos(60°) értékét!', answer: 0.5, type: 'multiplication', expression: 'cos(60°) = 1/2 = 0.5' },
        { question: 'Egy mértani sorozat első tagja 3, hányadosa 2. Mennyi a 5. tag?', answer: 48, type: 'multiplication', expression: 'a₅ = a₁·q⁴ = 3·2⁴ = 3·16 = 48' },
        { question: 'Számítsd ki a √(144) + √(25) értékét!', answer: 17, type: 'multiplication', expression: '√(144) + √(25) = 12 + 5 = 17' },
        { question: 'Egy kocka éle 4 cm. Mekkora a térfogata?', answer: 64, type: 'multiplication', expression: 'V = a³ = 4³ = 64 cm³' },
        { question: 'Számítsd ki a tan(45°) értékét!', answer: 1, type: 'multiplication', expression: 'tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1' },
        { question: 'Egy paralelogramma oldalai 5 cm és 7 cm, a köztük lévő szög 60°. Mekkora a területe?', answer: 30.3, type: 'multiplication', expression: 'T = a·b·sin(α) = 5·7·sin(60°) = 35·√3/2 ≈ 30.3 cm²' },
        { question: 'Számítsd ki a log₃(27) értékét!', answer: 3, type: 'multiplication', expression: 'log₃(27) = log₃(3³) = 3·log₃(3) = 3·1 = 3' },
        { question: 'Egy henger sugara 3 cm, magassága 8 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 226.08, type: 'multiplication', expression: 'V = πr²h = 3.14·3²·8 = 3.14·9·8 = 226.08 cm³' },
        { question: 'Számítsd ki a sin(90°) értékét!', answer: 1, type: 'multiplication', expression: 'sin(90°) = 1' },
        { question: 'Egy trapéz párhuzamos oldalai 6 cm és 10 cm, magassága 4 cm. Mekkora a területe?', answer: 32, type: 'multiplication', expression: 'T = (a+c)·m/2 = (6+10)·4/2 = 16·2 = 32 cm²' },
        { question: 'Számítsd ki a 5³ - 2⁴ értékét!', answer: 109, type: 'multiplication', expression: '5³ - 2⁴ = 125 - 16 = 109' },
        { question: 'Egy gúla alapterülete 36 cm², magassága 8 cm. Mekkora a térfogata?', answer: 96, type: 'multiplication', expression: 'V = T·m/3 = 36·8/3 = 288/3 = 96 cm³' },
        { question: 'Számítsd ki a cos(0°) értékét!', answer: 1, type: 'multiplication', expression: 'cos(0°) = 1' },
        { question: 'Egy rombusz oldala 5 cm, egyik átlója 6 cm. Mekkora a másik átlója?', answer: 8, type: 'multiplication', expression: 'd₁² + d₂² = 4a², 6² + d₂² = 4·5², 36 + d₂² = 100, d₂² = 64, d₂ = 8 cm' },
        { question: 'Számítsd ki a log₁₀(1000) értékét!', answer: 3, type: 'multiplication', expression: 'log₁₀(1000) = log₁₀(10³) = 3·log₁₀(10) = 3·1 = 3' },
        { question: 'Egy kúp sugara 4 cm, magassága 9 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 150.72, type: 'multiplication', expression: 'V = πr²h/3 = 3.14·4²·9/3 = 3.14·16·3 = 150.72 cm³' },
        { question: 'Számítsd ki a sin(60°) értékét!', answer: 0.866, type: 'multiplication', expression: 'sin(60°) = √3/2 ≈ 0.866' },
        { question: 'Egy deltoid átlói 8 cm és 6 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = (d₁·d₂)/2 = (8·6)/2 = 48/2 = 24 cm²' },
        { question: 'Számítsd ki a 7² - 3³ értékét!', answer: 22, type: 'multiplication', expression: '7² - 3³ = 49 - 27 = 22' },
        { question: 'Egy gömb sugara 5 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 523.33, type: 'multiplication', expression: 'V = 4πr³/3 = 4·3.14·5³/3 = 4·3.14·125/3 ≈ 523.33 cm³' },
        { question: 'Számítsd ki a cos(30°) értékét!', answer: 0.866, type: 'multiplication', expression: 'cos(30°) = √3/2 ≈ 0.866' },
        { question: 'Egy szabályos hatszög oldala 4 cm. Mekkora a kerülete?', answer: 24, type: 'multiplication', expression: 'K = 6a = 6·4 = 24 cm' }
    ];

    // Egyetemi matematika témák
    const universityTopics = [
        'deriválás',
        'integrálás',
        'differenciál egyenletek',
        'határértékszámítás',
        'függvényvizsgálat',
        'sorozatok és sorok',
        'többváltozós függvények',
        'lineáris algebra',
        'valószínűségszámítás',
        'komplex számok'
    ];

    // Fallback egyetemi feladatok (ha az API nem elérhető)
    const fallbackUniversityQuestions: Question[] = [
        // Deriválás
        { question: 'Számítsd ki az f(x) = x² + 3x + 2 függvény deriváltját az x = 2 pontban!', answer: 7, type: 'multiplication', expression: 'f\'(x) = 2x + 3, f\'(2) = 2·2 + 3 = 7' },
        { question: 'Számítsd ki az f(x) = 3x² + 2x függvény deriváltját az x = 1 pontban!', answer: 8, type: 'multiplication', expression: 'f\'(x) = 6x + 2, f\'(1) = 6·1 + 2 = 8' },
        { question: 'Számítsd ki az f(x) = x³ - 2x függvény deriváltját az x = 2 pontban!', answer: 10, type: 'multiplication', expression: 'f\'(x) = 3x² - 2, f\'(2) = 3·4 - 2 = 10' },
        { question: 'Számítsd ki az f(x) = e^x függvény deriváltját az x = 0 pontban!', answer: 1, type: 'multiplication', expression: 'f\'(x) = e^x, f\'(0) = e^0 = 1' },
        
        // Integrálás
        { question: 'Számítsd ki a ∫(2x + 1)dx integrált 0-tól 2-ig!', answer: 6, type: 'multiplication', expression: '∫(2x + 1)dx = x² + x, [x² + x]₀² = (4 + 2) - (0 + 0) = 6' },
        { question: 'Számítsd ki a ∫(x² + 2x)dx integrált 0-tól 1-ig!', answer: 1.33, type: 'multiplication', expression: '∫(x² + 2x)dx = x³/3 + x², [x³/3 + x²]₀¹ = 1/3 + 1 = 4/3 ≈ 1.33' },
        { question: 'Számítsd ki a ∫(3x²)dx integrált 0-tól 2-ig!', answer: 8, type: 'multiplication', expression: '∫(3x²)dx = x³, [x³]₀² = 8 - 0 = 8' },
        
        // Határértékek
        { question: 'Számítsd ki a lim(x→0) (sin x)/x határértéket!', answer: 1, type: 'multiplication', expression: 'L\'Hôpital szabály alapján: lim(x→0) (sin x)/x = lim(x→0) cos x/1 = 1' },
        { question: 'Számítsd ki a lim(x→1) (x²-1)/(x-1) határértéket!', answer: 2, type: 'multiplication', expression: 'lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1)(x-1)/(x-1) = lim(x→1) (x+1) = 2' },
        { question: 'Számítsd ki a lim(x→0) (1-cos x)/x² határértéket!', answer: 0.5, type: 'multiplication', expression: 'L\'Hôpital szabály: lim(x→0) (1-cos x)/x² = lim(x→0) sin x/(2x) = 1/2' },
        { question: 'Számítsd ki a ∫(2x + 1)dx integrált 0-tól 2-ig!', answer: 6, type: 'multiplication', expression: '∫(2x + 1)dx = x² + x, [x² + x]₀² = (4 + 2) - (0 + 0) = 6' },
        { question: 'Számítsd ki a lim(x→0) (sin x)/x határértéket!', answer: 1, type: 'multiplication', expression: 'L\'Hôpital szabály alapján: lim(x→0) (sin x)/x = lim(x→0) cos x/1 = 1' },
        { question: 'Oldd meg a dy/dx = 2x differenciál egyenletet y(0) = 1 kezdeti feltétellel!', answer: 1, type: 'multiplication', expression: 'y = x² + C, y(0) = 1 = 0 + C, tehát C = 1, y = x² + 1' },
        { question: 'Melyik pontban van az f(x) = x³ - 3x² + 2 függvénynek lokális minimuma?', answer: 2, type: 'multiplication', expression: 'f\'(x) = 3x² - 6x = 3x(x-2), f\'\'(x) = 6x - 6, f\'\'(2) = 6 > 0, tehát x = 2-ben minimum' },
        { question: 'Számítsd ki a ∑(n=1 to ∞) 1/n² sor összegét!', answer: 1.645, type: 'multiplication', expression: 'Ez a Riemann zeta függvény ζ(2) = π²/6 ≈ 1.645' },
        { question: 'Számítsd ki az f(x,y) = x² + y² függvény parciális deriváltját ∂f/∂x az (1,2) pontban!', answer: 2, type: 'multiplication', expression: '∂f/∂x = 2x, ∂f/∂x(1,2) = 2·1 = 2' },
        { question: 'Számítsd ki a [[2,1],[3,4]] 2x2-es mátrix determinánsát!', answer: 5, type: 'multiplication', expression: 'det = 2·4 - 1·3 = 8 - 3 = 5' },
        { question: 'Egy kockával dobva, mi a valószínűsége annak, hogy 3-nál nagyobb számot dobunk?', answer: 0.5, type: 'multiplication', expression: 'Kedvező esetek: 4,5,6 (3 db), összes eset: 6, P = 3/6 = 0.5' },
        { question: 'Számítsd ki a (2+3i) + (1-2i) komplex szám összegét!', answer: 3, type: 'multiplication', expression: '(2+3i) + (1-2i) = (2+1) + (3-2)i = 3 + i, valós rész: 3' },
        // C Programozás feladatok
        { question: 'Mi lesz az "int x = 5; printf(\"%d\", ++x);" kimenete?', answer: 6, type: 'multiplication', expression: '++x először növeli x-et 6-ra, majd kiírja: 6' },
        { question: 'Mi lesz az "int arr[5] = {1,2,3,4,5}; printf(\"%d\", arr[2]);" kimenete?', answer: 3, type: 'multiplication', expression: 'arr[2] a tömb harmadik eleme (0-indexelés): 3' },
        { question: 'Mi lesz az "int x = 10; int *p = &x; printf(\"%d\", *p);" kimenete?', answer: 10, type: 'multiplication', expression: 'p mutat x-re, *p az x értékét adja vissza: 10' },
        { question: 'Mi lesz az "int x = 5; int y = x++; printf(\"%d %d\", x, y);" kimenete?', answer: 6, type: 'multiplication', expression: 'x++ először értéket ad y-nak (5), majd növeli x-et (6): "6 5"' },
        { question: 'Mi lesz az "int x = 10; if(x > 5) x = x * 2; printf(\"%d\", x);" kimenete?', answer: 20, type: 'multiplication', expression: 'x > 5 igaz, ezért x = 10 * 2 = 20' },
        { question: 'Mi lesz az "int i, sum = 0; for(i=1; i<=3; i++) sum += i; printf(\"%d\", sum);" kimenete?', answer: 6, type: 'multiplication', expression: 'sum = 1 + 2 + 3 = 6' },
        { question: 'Mi lesz az "char str[] = \"Hello\"; printf(\"%c\", str[0]);" kimenete?', answer: 72, type: 'multiplication', expression: 'str[0] az \'H\' karakter, ASCII kódja: 72' },
        { question: 'Mi lesz az "int x = 15; int y = x / 4; printf(\"%d\", y);" kimenete?', answer: 3, type: 'multiplication', expression: '15 / 4 = 3 (egész osztás)' },
        { question: 'Mi lesz az "int x = 7; int y = x % 3; printf(\"%d\", y);" kimenete?', answer: 1, type: 'multiplication', expression: '7 % 3 = 1 (maradékos osztás)' },
        // Folytonos valószínűségi változók feladatok
        { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,2] intervallumon. Mi a várható értéke?', answer: 1, type: 'multiplication', expression: 'E[X] = (a+b)/2 = (0+2)/2 = 1' },
        { question: 'Egy exponenciális eloszlású valószínűségi változó λ=2 paraméterrel. Mi a várható értéke?', answer: 0.5, type: 'multiplication', expression: 'E[X] = 1/λ = 1/2 = 0.5' },
        { question: 'Egy normális eloszlású valószínűségi változó μ=5, σ=2 paraméterekkel. Mi a várható értéke?', answer: 5, type: 'multiplication', expression: 'E[X] = μ = 5' },
        { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,4] intervallumon. Mi a szórása?', answer: 1.15, type: 'multiplication', expression: 'D[X] = (b-a)/(2√3) = (4-0)/(2√3) = 4/(2√3) ≈ 1.15' },
        { question: 'Egy exponenciális eloszlású valószínűségi változó λ=3 paraméterrel. Mi a szórása?', answer: 0.33, type: 'multiplication', expression: 'D[X] = 1/λ = 1/3 ≈ 0.33' },
        { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x > y ? x : y);" kimenete?', answer: 5, type: 'multiplication', expression: 'x > y igaz (5 > 3), ezért az első értéket adja: 5' },
        { question: 'Számítsd ki az f(x) = e^x függvény deriváltját az x = 0 pontban!', answer: 1, type: 'multiplication', expression: 'f\'(x) = e^x, f\'(0) = e^0 = 1' },
        { question: 'Számítsd ki a ∫(x² + 2x)dx integrált 0-tól 1-ig!', answer: 1.33, type: 'multiplication', expression: '∫(x² + 2x)dx = x³/3 + x², [x³/3 + x²]₀¹ = 1/3 + 1 = 4/3 ≈ 1.33' },
        { question: 'Számítsd ki a lim(x→1) (x²-1)/(x-1) határértéket!', answer: 2, type: 'multiplication', expression: 'lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1)(x-1)/(x-1) = lim(x→1) (x+1) = 2' },
        { question: 'Oldd meg a dy/dx = y differenciál egyenletet y(0) = 1 kezdeti feltétellel!', answer: 1, type: 'multiplication', expression: 'y = Ce^x, y(0) = 1 = C·1, tehát C = 1, y = e^x, y(0) = 1' },
        { question: 'Melyik pontban van az f(x) = x⁴ - 4x² függvénynek lokális maximuma?', answer: 0, type: 'multiplication', expression: 'f\'(x) = 4x³ - 8x = 4x(x²-2), f\'\'(x) = 12x² - 8, f\'\'(0) = -8 < 0, tehát x = 0-ban maximum' },
        { question: 'Számítsd ki a ∑(n=1 to ∞) 1/2ⁿ sor összegét!', answer: 1, type: 'multiplication', expression: 'Geometriai sor: a/(1-r) = (1/2)/(1-1/2) = (1/2)/(1/2) = 1' },
        { question: 'Számítsd ki az f(x,y) = xy függvény parciális deriváltját ∂f/∂y az (2,3) pontban!', answer: 2, type: 'multiplication', expression: '∂f/∂y = x, ∂f/∂y(2,3) = 2' },
        { question: 'Számítsd ki a [[1,2],[0,3]] 2x2-es mátrix determinánsát!', answer: 3, type: 'multiplication', expression: 'det = 1·3 - 2·0 = 3 - 0 = 3' },
        { question: 'Egy érmével dobva, mi a valószínűsége annak, hogy fejet dobunk?', answer: 0.5, type: 'multiplication', expression: 'Kedvező esetek: fej (1 db), összes eset: 2, P = 1/2 = 0.5' },
        { question: 'Számítsd ki a (3+4i) · (1+2i) komplex szám szorzatát!', answer: -5, type: 'multiplication', expression: '(3+4i)(1+2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i, valós rész: -5' }
    ];

    // ChatGPT API hívás egyetemi feladatok generálásához
    const generateUniversityQuestion = async (topic: string, difficulty: 'könnyű' | 'közepes' | 'nehéz' = 'közepes'): Promise<Question | null> => {
        try {
            setIsGeneratingQuestion(true);
            const response = await fetch('/api/generate-math-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: topic,
                    difficulty: difficulty
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return {
                    question: data.question,
                    answer: parseFloat(data.answer) || parseInt(data.answer) || 0,
                    type: 'multiplication', // Default type for university questions
                    expression: data.explanation || data.question
                };
            } else {
                console.error('API error:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error generating university question:', error);
            return null;
        } finally {
            setIsGeneratingQuestion(false);
        }
    };

    // Egyetemi feladatok generálása játék indításakor
    const generateUniversityQuestions = async () => {
        // Egyelőre használjuk a fallback feladatokat, mert az API még nincs beállítva
        const shuffledQuestions = [...fallbackUniversityQuestions].sort(() => Math.random() - 0.5);
        setUniversityQuestions(shuffledQuestions);

        // TODO: Később visszaállítani az API hívást
        /*
        const questions: Question[] = [];
        const topicsToUse = [...universityTopics].sort(() => Math.random() - 0.5).slice(0, 10);
        
        for (const topic of topicsToUse) {
            const question = await generateUniversityQuestion(topic);
            if (question) {
                questions.push(question);
            }
        }

        // Ha nem sikerült elég feladatot generálni, töltsük fel a fallback feladatokkal
        if (questions.length < 5) {
            questions.push(...fallbackUniversityQuestions.slice(0, 10 - questions.length));
        }

        setUniversityQuestions(questions);
        */
    };

    const getQuestionsForLevel = (level: 'elementary' | 'highschool' | 'university'): Question[] => {
        switch (level) {
            case 'elementary':
                return elementaryQuestions;
            case 'highschool':
                return highschoolQuestions;
            case 'university':
                return fallbackUniversityQuestions; // Mindig használjuk a fallback feladatokat
            default:
                return elementaryQuestions;
        }
    };

    // Feladatok betöltése a kiválasztott szint alapján
    const questions: Question[] = taskQuestions.length > 0 ? taskQuestions : getQuestionsForLevel(educationLevel || 'elementary');

    const startGame = async () => {
        if (!educationLevel) return;

        // Ellenőrizzük, hogy vannak-e feladatok
        if (questions.length === 0) {
            alert('Nincsenek elérhető feladatok ezen a szinten. Kérjük, válasszon másik szintet!');
            return;
        }

        // Ha egyetemi szint van kiválasztva, generáljuk a feladatokat
        if (educationLevel === 'university') {
            generateUniversityQuestions(); // Nem await, mert azonnal elérhető
        }

        // Ha van kiosztott feladat a témakörhöz, akkor azt használjuk
        if (assignedTasks.length > 0) {
            // Itt lehetne implementálni a kiosztott feladatok kezelését
            console.log('Kiosztott feladatok használata:', assignedTasks);
        }

        setGameActive(true);
        setScore(0);
        setLevel(1);
        setLives(3);
        setCurrentQuestion(0);
        setUserAnswer('');
        setMessage('');
        setIsCorrect(false);
        setShowExpression(false);
        setAvatarLevel(1);
        setAvatarProgress(0);
    };

    const resetGame = () => {
        setGameActive(false);
        setScore(0);
        setLevel(1);
        setLives(3);
        setCurrentQuestion(0);
        setUserAnswer('');
        setMessage('');
        setIsCorrect(false);
        setShowExpression(false);
        setAvatarLevel(1);
        setAvatarProgress(0);
        setEducationLevel(null);
    };

    const submitAnswer = () => {
        if (!userAnswer.trim()) return;

        const currentQ = questions[currentQuestion];
        const userNum = parseInt(userAnswer);
        const correct = userNum === currentQ.answer;

        setIsCorrect(correct);
        setShowExpression(true);

        if (correct) {
            setScore(score + 10);
            setMessage('Helyes! 🎉');

            // Avatar progress
            setAvatarProgress(avatarProgress + 1);
            if (avatarProgress >= 4) {
                setAvatarLevel(avatarLevel + 1);
                setAvatarProgress(0);
            }
        } else {
            setLives(lives - 1);
            setMessage(`Hibás! A helyes válasz: ${currentQ.answer}`);
        }

        setTimeout(() => {
            if (correct) {
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setUserAnswer('');
                    setMessage('');
                    setIsCorrect(false);
                    setShowExpression(false);
                } else {
                    // Game won
                    if (score > highScore) {
                        setHighScore(score);
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('highScore', score.toString());
                        }
                    }
                    setMessage('Gratulálok! Megnyerted a játékot! 🏆');
                    // Játék eredmények mentése Firebase-be
                    saveGameResults();
                }
            } else {
                if (lives <= 1) {
                    // Game over
                    if (score > highScore) {
                        setHighScore(score);
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('highScore', score.toString());
                        }
                    }
                    setMessage('Játék vége! Próbáld újra! 💪');
                    // Játék eredmények mentése Firebase-be
                    saveGameResults();
                } else {
                    setUserAnswer('');
                    setMessage('');
                    setIsCorrect(false);
                    setShowExpression(false);
                }
            }
        }, 2000);
    };


    const saveGameResults = async () => {
        if (selectedTask && currentUser && (window as any).firebase) {
            try {
                const db = (window as any).firebase.firestore();
                const totalQuestions = questions.length;
                const correctAnswers = score; // A score a helyes válaszok számát jelenti

                await db.collection('gameResults').add({
                    userId: currentUser.uid,
                    topicId: selectedTask.id,
                    topicTitle: selectedTask.title,
                    correct: correctAnswers,
                    total: totalQuestions,
                    score: score,
                    completedAt: (window as any).firebase.firestore.FieldValue.serverTimestamp(),
                    gameMode: 'uniboost'
                });
            } catch (error) {
                console.error('Error saving game results:', error);
            }
        }
    };

    const getAvatarImage = (level: number) => {
        if (level >= 20) return '🏆'; // Master
        if (level >= 15) return '👑'; // Expert
        if (level >= 10) return '⭐'; // Advanced
        if (level >= 5) return '🔥'; // Intermediate
        return '🌟'; // Beginner
    };

    const getAvatarTitle = (level: number) => {
        if (level >= 20) return 'MASTER';
        if (level >= 15) return 'EXPERT';
        if (level >= 10) return 'ADVANCED';
        if (level >= 5) return 'INTERMEDIATE';
        return 'BEGINNER';
    };

    const getAvatarColor = (level: number) => {
        if (level >= 20) return 'linear-gradient(45deg, #FFD700, #FFA500)'; // Gold
        if (level >= 15) return 'linear-gradient(45deg, #C0C0C0, #808080)'; // Silver
        if (level >= 10) return 'linear-gradient(45deg, #CD7F32, #8B4513)'; // Bronze
        if (level >= 5) return 'linear-gradient(45deg, #4169E1, #1E90FF)'; // Blue
        return 'linear-gradient(45deg, #87CEEB, #4682B4)'; // Light blue
    };

    if (!isClient || loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Mihaszna Matek - Játék</title>
                <meta name="description" content="Matematikai kihívás" />
            </Head>

            <div className="game-container">
                <main className="game-main">
                    {!gameActive ? (
                        <div className="start-screen">
                            <h1 className="game-title">🚀 UniBoost</h1>
                            <p className="game-subtitle">
                                {selectedTask ? selectedTask.title : 'Együtt teremtjük a tanítás jövőjét'}
                            </p>
                            {questions.length === 0 && (
                                <div className="no-questions-warning">
                                    <p>⚠️ Nincsenek elérhető feladatok ezen a szinten!</p>
                                    <p>Kérjük, válasszon másik oktatási szintet.</p>
                                </div>
                            )}

                            {!educationLevel ? (
                                <div className="level-selector">
                                    <h2 className="level-title">Válassz oktatási szintet:</h2>
                                    <div className="level-buttons">
                                        <button
                                            className="level-btn elementary"
                                            onClick={() => setEducationLevel('elementary')}
                                        >
                                            <span className="level-icon">🎒</span>
                                            <span className="level-name">Általános iskola</span>
                                            <span className="level-desc">1-6. osztály</span>
                                        </button>
                                        <button
                                            className="level-btn highschool"
                                            onClick={() => setEducationLevel('highschool')}
                                        >
                                            <span className="level-icon">📚</span>
                                            <span className="level-name">Középiskola</span>
                                            <span className="level-desc">7-12. osztály</span>
                                        </button>
                                        <button
                                            className="level-btn university"
                                            onClick={() => setEducationLevel('university')}
                                        >
                                            <span className="level-icon">🎓</span>
                                            <span className="level-name">Egyetem</span>
                                            <span className="level-desc">Felsőbb matematika</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="game-info-section">
                                    <div className="selected-level"></div>
                                    <div className="stats-display">
                                        <div className="stat-item">
                                            <span className="stat-icon">🏆</span>
                                            <span className="stat-label">Legjobb eredmény</span>
                                            <span className="stat-value">{highScore}</span>
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
                                        onClick={startGame}
                                        disabled={questions.length === 0}
                                    >
                                        <span className="button-icon">🚀</span>
                                        {questions.length === 0 ? 'NINCSENEK FELADATOK' : 'JÁTÉK INDÍTÁSA'}
                                    </button>
                                    <button className="reset-button" onClick={resetGame}>
                                        <span className="button-icon">🔄</span>
                                        VISSZA A VÁLASZTÁSHOZ
                                    </button>
                                </div>
                            )}
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
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                        className="answer-input"
                                        placeholder="Írd be a választ..."
                                        autoFocus
                                    />
                                    <div className="answer-buttons">
                                        <button
                                            className="submit-button"
                                            onClick={submitAnswer}
                                            disabled={!userAnswer.trim()}
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

                                {showExpression && questions[currentQuestion] && (
                                    <div className="expression-display">
                                        <pre>{questions[currentQuestion].expression}</pre>
                                    </div>
                                )}
                            </div>

                            <button className="reset-button" onClick={resetGame}>
                                <span className="button-icon">🔄</span>
                                ÚJ JÁTÉK
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .game-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
                    position: relative;
                    overflow: hidden;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .game-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
                    pointer-events: none;
                }

                .game-main {
                    position: relative;
                    z-index: 10;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .start-screen {
                    text-align: center;
                    width: 100%;
                }

                .game-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    background: linear-gradient(45deg, #39ff14, #ff77c6, #78dbff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 20px;
                    text-shadow: 0 0 30px rgba(57, 255, 20, 0.5);
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }

                .game-subtitle {
                    color: #39ff14;
                    font-size: 1.3rem;
                    margin-bottom: 40px;
                    font-weight: 600;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }

                .level-selector {
                    margin: 40px 0;
                }

                .level-title {
                    color: #39ff14;
                    font-size: 1.8rem;
                    margin-bottom: 30px;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                }

                .level-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    max-width: 400px;
                    margin: 0 auto;
                }

                .level-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 20px;
                    padding: 25px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .level-btn:hover {
                    background: rgba(120, 219, 255, 0.2);
                    border-color: rgba(120, 219, 255, 0.8);
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(120, 219, 255, 0.4);
                }

                .level-icon {
                    font-size: 2.5rem;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .level-name {
                    color: white;
                    font-size: 1.3rem;
                    font-weight: 700;
                }

                .level-desc {
                    color: #78dbff;
                    font-size: 1rem;
                    opacity: 0.8;
                }

                .game-info-section {
                    margin: 40px 0;
                }

                .selected-level {
                    margin-bottom: 30px;
                }

                .selected-level h3 {
                    color: #39ff14;
                    font-size: 1.5rem;
                    font-weight: 700;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                }

                .stats-display {
                    margin-bottom: 40px;
                }

                .stat-item {
                    display: inline-block;
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
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(120, 219, 255, 0.4);
                    border-color: rgba(120, 219, 255, 0.8);
                }

                .stat-icon {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 10px;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
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
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(57, 255, 20, 0.3);
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    margin: 10px;
                }

                .start-button:hover, .reset-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(57, 255, 20, 0.5);
                }

                .start-button:active, .reset-button:active {
                    transform: translateY(1px);
                }

                .start-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: linear-gradient(45deg, #666, #888);
                }

                .no-questions-warning {
                    background: rgba(255, 193, 7, 0.1);
                    border: 2px solid rgba(255, 193, 7, 0.5);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }

                .no-questions-warning p {
                    color: #ffc107;
                    margin: 5px 0;
                    font-size: 1.1rem;
                    text-shadow: 0 0 10px rgba(255, 193, 7, 0.8);
                }


                .button-icon {
                    font-size: 1.2rem;
                }

                .game-screen {
                    width: 100%;
                    text-align: center;
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
                    font-size: 2.5rem;
                    box-shadow: 0 0 30px rgba(120, 219, 255, 0.5);
                    animation: avatarPulse 2s ease-in-out infinite;
                }

                .avatar-info {
                    text-align: center;
                }

                .legend-text {
                    color: white;
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
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(120, 219, 255, 0.5);
                    border-radius: 25px;
                    padding: 40px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(120, 219, 255, 0.2);
                    margin: 30px 0;
                }

                .question-text {
                    color: white;
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 30px;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                }

                .answer-section {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .answer-input {
                    background: rgba(255, 255, 255, 0.1);
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
                }

                .answer-input::placeholder {
                    color: rgba(57, 255, 20, 0.6);
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
                }

                .answer-input:focus {
                    outline: none;
                    border-color: rgba(57, 255, 20, 0.8);
                    box-shadow: 0 0 30px rgba(57, 255, 20, 0.4);
                }

                .submit-button {
                    background: linear-gradient(45deg, #39ff14, #ff77c6);
                    border: none;
                    border-radius: 20px;
                    padding: 15px 25px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(57, 255, 20, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(57, 255, 20, 0.5);
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .answer-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 1rem;
                }


                .message {
                    margin-top: 20px;
                    padding: 15px 25px;
                    border-radius: 15px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    animation: messageSlide 0.5s ease-out;
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
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 15px;
                    border: 1px solid rgba(120, 219, 255, 0.3);
                }

                .expression-display pre {
                    color: #78dbff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0;
                    text-align: left;
                    white-space: pre-wrap;
                }

                @keyframes neonGlow {
                    from {
                        text-shadow: 0 0 20px rgba(57, 255, 20, 0.5), 0 0 30px rgba(57, 255, 20, 0.3);
                    }
                    to {
                        text-shadow: 0 0 30px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.5);
                    }
                }

                @keyframes avatarPulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 30px rgba(120, 219, 255, 0.5);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 40px rgba(120, 219, 255, 0.8);
                    }
                }

                @keyframes messageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .game-title {
                        font-size: 2.5rem;
                    }
                    
                    .question-text {
                        font-size: 2rem;
                    }
                    
                    .answer-section {
                        flex-direction: column;
                    }
                    
                    .answer-input {
                        width: 100%;
                        max-width: 300px;
                    }
                    
                    .hud {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .level-buttons {
                        max-width: 100%;
                    }
                }
            `}</style>
        </>
    );
}
