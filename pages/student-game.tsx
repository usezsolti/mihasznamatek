import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { isAdminEmail } from '../utils/admin';

interface Question {
    question: string;
    answer: number;
    type: string;
    expression: string;
}

interface AssignedTask {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;
    questions: Question[];
    timeLimit: number;
    completed: boolean;
    score: number;
}

export default function StudentGame() {
    const router = useRouter();
    const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
    const [currentTask, setCurrentTask] = useState<AssignedTask | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [lives, setLives] = useState(3);
    const [powerUps, setPowerUps] = useState({
        skip: 1,
        hint: 2,
        extraTime: 1
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { data: session, status: authStatus } = useSession();
    const isAdmin = Boolean(session?.user?.email && isAdminEmail(session.user.email));
    const currentUser = session?.user?.id
        ? {
              uid: session.user.id,
              email: session.user.email,
              displayName: session.user.name,
          }
        : null;

    useEffect(() => {
        if (authStatus !== 'loading') {
            setLoading(false);
        }
    }, [authStatus]);

    // Sample questions for different topics
    const sampleQuestions = {
        'Másodfokú egyenletek': [
            { question: 'x² - 5x + 6 = 0 megoldása? (Add meg a nagyobb gyököt)', answer: 3, type: 'quadratic', expression: 'x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2 vagy x = 3' },
            { question: 'x² + 4x - 5 = 0 megoldása? (Add meg a pozitív gyököt)', answer: 1, type: 'quadratic', expression: 'x² + 4x - 5 = 0 → (x+5)(x-1) = 0 → x = -5 vagy x = 1' },
            { question: '2x² - 8x + 6 = 0 megoldása? (Add meg a kisebb gyököt)', answer: 1, type: 'quadratic', expression: '2x² - 8x + 6 = 0 → 2(x²-4x+3) = 0 → x = 1 vagy x = 3' }
        ],
        'Deriválás alapjai': [
            { question: 'f(x) = x³ deriváltja x = 2 helyen?', answer: 12, type: 'derivative', expression: 'f\'(x) = 3x² → f\'(2) = 3·2² = 12' },
            { question: 'f(x) = 2x² + 3x deriváltja x = 1 helyen?', answer: 7, type: 'derivative', expression: 'f\'(x) = 4x + 3 → f\'(1) = 4·1 + 3 = 7' },
            { question: 'f(x) = x⁴ deriváltja x = 1 helyen?', answer: 4, type: 'derivative', expression: 'f\'(x) = 4x³ → f\'(1) = 4·1³ = 4' }
        ],
        'Trigonometria': [
            { question: 'sin(30°) értéke?', answer: 0.5, type: 'trigonometry', expression: 'sin(30°) = 1/2 = 0.5' },
            { question: 'cos(60°) értéke?', answer: 0.5, type: 'trigonometry', expression: 'cos(60°) = 1/2 = 0.5' },
            { question: 'tan(45°) értéke?', answer: 1, type: 'trigonometry', expression: 'tan(45°) = 1' }
        ],
        'Síkgeometria': [
            { question: 'Egy derékszögű háromszög befogói 3 és 4. Mekkora az átfogó?', answer: 5, type: 'geometry', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 25 → c = 5' },
            { question: 'Egy kör sugara 5 cm. Mekkora a kerülete? (π ≈ 3.14)', answer: 31.4, type: 'geometry', expression: 'K = 2πr = 2·3.14·5 = 31.4 cm' },
            { question: 'Egy négyzet oldala 6 cm. Mekkora a területe?', answer: 36, type: 'geometry', expression: 'T = a² = 6² = 36 cm²' }
        ],
        'Integrálás': [
            { question: '∫(2x + 3)dx = ? (x = 0-tól 2-ig)', answer: 10, type: 'integration', expression: '∫(2x + 3)dx = x² + 3x → [2² + 3·2] - [0² + 3·0] = 10' },
            { question: '∫(3x²)dx = ? (x = 0-tól 1-ig)', answer: 1, type: 'integration', expression: '∫(3x²)dx = x³ → [1³] - [0³] = 1' },
            { question: '∫(4x³)dx = ? (x = 0-tól 1-ig)', answer: 1, type: 'integration', expression: '∫(4x³)dx = x⁴ → [1⁴] - [0⁴] = 1' }
        ],
        '2025 Emelt Érettségi': [
            { question: 'Egy háromszög oldalai 5, 7, 8 cm. Mekkora a területe? (Heron-képlet)', answer: 17.32, type: 'advanced', expression: 's = (5+7+8)/2 = 10, T = √(10·5·3·2) = √300 ≈ 17.32 cm²' },
            { question: 'f(x) = x³ - 3x² + 2x lokális szélsőértékei? (Add meg a maximum értékét)', answer: 0, type: 'advanced', expression: 'f\'(x) = 3x² - 6x + 2 = 0 → x = 1±√(1/3), f(1+√(1/3)) ≈ 0' },
            { question: 'lim(x→0) (sin(3x)/x) = ?', answer: 3, type: 'advanced', expression: 'lim(x→0) (sin(3x)/x) = 3·lim(x→0) (sin(3x)/(3x)) = 3·1 = 3' },
            { question: 'Egy kör sugara 6 cm. Mekkora a 60°-os középponti szöghöz tartozó körcikk területe?', answer: 18.85, type: 'advanced', expression: 'T = (πr²·α)/360° = (π·6²·60°)/360° = 6π ≈ 18.85 cm²' },
            { question: 'Egy számtani sorozat első tagja 3, differenciája 4. Mennyi az első 10 tag összege?', answer: 210, type: 'advanced', expression: 'S₁₀ = (2a₁ + (n-1)d)·n/2 = (2·3 + 9·4)·10/2 = 42·5 = 210' }
        ],
        'Hatványozás és Gyökvonás': [
            { question: 'Számítsd ki: √(3^(-3)) / 27²', answer: 0.00137, type: 'power', expression: '√(3^(-3)) / 27² = √(1/27) / 729 = (1/3√3) / 729 ≈ 0.00137' },
            { question: 'Számítsd ki: ³√128 / ⁵√16', answer: 2, type: 'power', expression: '³√128 / ⁵√16 = ³√(2^7) / ⁵√(2^4) = 2^(7/3) / 2^(4/5) = 2^(35/15 - 12/15) = 2^(23/15) ≈ 2' },
            { question: 'Számítsd ki: 9 / ³√81', answer: 3, type: 'power', expression: '9 / ³√81 = 9 / ³√(3^4) = 9 / 3^(4/3) = 3^2 / 3^(4/3) = 3^(2-4/3) = 3^(2/3) ≈ 3' },
            { question: 'Számítsd ki: (2²)⁵ × (1/2) × 8^(-2)', answer: 8, type: 'power', expression: '(2²)⁵ × (1/2) × 8^(-2) = 2^10 × 2^(-1) × 2^(-6) = 2^(10-1-6) = 2³ = 8' },
            { question: 'Számítsd ki: ⁵√3 / ³√9', answer: 0.577, type: 'power', expression: '⁵√3 / ³√9 = 3^(1/5) / 9^(1/3) = 3^(1/5) / 3^(2/3) = 3^(1/5 - 2/3) = 3^(-7/15) ≈ 0.577' },
            { question: 'Számítsd ki: 4 / ⁵√8', answer: 2, type: 'power', expression: '4 / ⁵√8 = 4 / 8^(1/5) = 2² / 2^(3/5) = 2^(2-3/5) = 2^(7/5) ≈ 2' },
            { question: 'Számítsd ki: √3 × 27 × ³√9²', answer: 81, type: 'power', expression: '√3 × 27 × ³√9² = 3^(1/2) × 3³ × (3²)^(2/3) = 3^(1/2) × 3³ × 3^(4/3) = 3^(1/2 + 3 + 4/3) = 3^(3/6 + 18/6 + 8/6) = 3^(29/6) ≈ 81' },
            { question: 'Számítsd ki: ³√16 / ⁵√4', answer: 2, type: 'power', expression: '³√16 / ⁵√4 = 16^(1/3) / 4^(1/5) = (2^4)^(1/3) / (2²)^(1/5) = 2^(4/3) / 2^(2/5) = 2^(4/3 - 2/5) = 2^(20/15 - 6/15) = 2^(14/15) ≈ 2' },
            { question: 'Számítsd ki: √128 / ³√16', answer: 4, type: 'power', expression: '√128 / ³√16 = √(2^7) / ³√(2^4) = 2^(7/2) / 2^(4/3) = 2^(7/2 - 4/3) = 2^(21/6 - 8/6) = 2^(13/6) ≈ 4' },
            { question: 'Számítsd ki: 1 / √(27 × 9^(1/3))', answer: 0.192, type: 'power', expression: '1 / √(27 × 9^(1/3)) = 1 / √(3³ × 3^(2/3)) = 1 / √(3^(3 + 2/3)) = 1 / √(3^(11/3)) = 1 / 3^(11/6) ≈ 0.192' },
            { question: 'Számítsd ki: (√3)^(-3) × 27^(2/3)', answer: 1.73, type: 'power', expression: '(√3)^(-3) × 27^(2/3) = 3^(-3/2) × (3³)^(2/3) = 3^(-3/2) × 3² = 3^(-3/2 + 2) = 3^(1/2) = √3 ≈ 1.73' },
            { question: 'Számítsd ki: log₃(√(27))', answer: 1.5, type: 'power', expression: 'log₃(√(27)) = log₃(√(3³)) = log₃(3^(3/2)) = (3/2)·log₃(3) = 3/2 = 1.5' }
        ],
        'C Programozás Alapok': [
            { question: 'Mi lesz az "int x = 5; printf(\"%d\", ++x);" kimenete?', answer: 6, type: 'programming', expression: '++x először növeli x-et 6-ra, majd kiírja: 6' },
            { question: 'Mi lesz az "int arr[5] = {1,2,3,4,5}; printf(\"%d\", arr[2]);" kimenete?', answer: 3, type: 'programming', expression: 'arr[2] a tömb harmadik eleme (0-indexelés): 3' },
            { question: 'Mi lesz az "int x = 10; int *p = &x; printf(\"%d\", *p);" kimenete?', answer: 10, type: 'programming', expression: 'p mutat x-re, *p az x értékét adja vissza: 10' },
            { question: 'Mi lesz az "int x = 5; int y = x++; printf(\"%d %d\", x, y);" kimenete?', answer: 6, type: 'programming', expression: 'x++ először értéket ad y-nak (5), majd növeli x-et (6): "6 5"' },
            { question: 'Mi lesz az "int x = 10; if(x > 5) x = x * 2; printf(\"%d\", x);" kimenete?', answer: 20, type: 'programming', expression: 'x > 5 igaz, ezért x = 10 * 2 = 20' },
            { question: 'Mi lesz az "int i, sum = 0; for(i=1; i<=3; i++) sum += i; printf(\"%d\", sum);" kimenete?', answer: 6, type: 'programming', expression: 'sum = 1 + 2 + 3 = 6' },
            { question: 'Mi lesz az "char str[] = \"Hello\"; printf(\"%c\", str[0]);" kimenete?', answer: 72, type: 'programming', expression: 'str[0] az \'H\' karakter, ASCII kódja: 72' },
            { question: 'Mi lesz az "int x = 15; int y = x / 4; printf(\"%d\", y);" kimenete?', answer: 3, type: 'programming', expression: '15 / 4 = 3 (egész osztás)' },
            { question: 'Mi lesz az "int x = 7; int y = x % 3; printf(\"%d\", y);" kimenete?', answer: 1, type: 'programming', expression: '7 % 3 = 1 (maradékos osztás)' },
            { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x > y ? x : y);" kimenete?', answer: 5, type: 'programming', expression: 'x > y igaz (5 > 3), ezért az első értéket adja: 5' },
            { question: 'Mi lesz az "int x = 8; int y = x << 1; printf(\"%d\", y);" kimenete?', answer: 16, type: 'programming', expression: 'x << 1 biteltolás balra (szorzás 2-vel): 8 * 2 = 16' },
            { question: 'Mi lesz az "int x = 12; int y = x >> 2; printf(\"%d\", y);" kimenete?', answer: 3, type: 'programming', expression: 'x >> 2 biteltolás jobbra (osztás 4-gyel): 12 / 4 = 3' },
            { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x & y);" kimenete?', answer: 1, type: 'programming', expression: '5 & 3 = 101 & 011 = 001 = 1 (bitenkénti ÉS)' },
            { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x | y);" kimenete?', answer: 7, type: 'programming', expression: '5 | 3 = 101 | 011 = 111 = 7 (bitenkénti VAGY)' },
            { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x ^ y);" kimenete?', answer: 6, type: 'programming', expression: '5 ^ 3 = 101 ^ 011 = 110 = 6 (bitenkénti XOR)' }
        ],
        'C Programozás Haladó': [
            { question: 'Mi lesz az "int arr[3][3] = {{1,2,3},{4,5,6},{7,8,9}}; printf(\"%d\", arr[1][1]);" kimenete?', answer: 5, type: 'programming', expression: 'arr[1][1] a második sor második eleme: 5' },
            { question: 'Mi lesz az "int x = 10; int *p = &x; *p = 20; printf(\"%d\", x);" kimenete?', answer: 20, type: 'programming', expression: 'p mutat x-re, *p = 20 beállítja x-et 20-ra' },
            { question: 'Mi lesz az "int arr[] = {1,2,3,4,5}; int *p = arr; printf(\"%d\", *(p+2));" kimenete?', answer: 3, type: 'programming', expression: 'p+2 mutat arr[2]-re, *(p+2) = arr[2] = 3' },
            { question: 'Mi lesz az "char str[] = \"Hello\"; printf(\"%d\", strlen(str));" kimenete?', answer: 5, type: 'programming', expression: 'strlen(\"Hello\") = 5 (karakterek száma)' },
            { question: 'Mi lesz az "int x = 10; int y = 20; int *p = &x; p = &y; printf(\"%d\", *p);" kimenete?', answer: 20, type: 'programming', expression: 'p először x-re mutat, majd y-ra, *p = y = 20' },
            { question: 'Mi lesz az "int x = 5; int y = 10; int *p = &x; *p = y; printf(\"%d\", x);" kimenete?', answer: 10, type: 'programming', expression: 'p mutat x-re, *p = y beállítja x-et 10-re' },
            { question: 'Mi lesz az "int arr[5] = {1,2,3,4,5}; int *p = arr; printf(\"%d\", p[2]);" kimenete?', answer: 3, type: 'programming', expression: 'p[2] = *(p+2) = arr[2] = 3' },
            { question: 'Mi lesz az "int x = 15; int y = x & 7; printf(\"%d\", y);" kimenete?', answer: 7, type: 'programming', expression: '15 & 7 = 1111 & 0111 = 0111 = 7' },
            { question: 'Mi lesz az "int x = 8; int y = x | 3; printf(\"%d\", y);" kimenete?', answer: 11, type: 'programming', expression: '8 | 3 = 1000 | 0011 = 1011 = 11' },
            { question: 'Mi lesz az "int x = 12; int y = x ^ 7; printf(\"%d\", y);" kimenete?', answer: 11, type: 'programming', expression: '12 ^ 7 = 1100 ^ 0111 = 1011 = 11' },
            { question: 'Mi lesz az "int x = 16; int y = x >> 3; printf(\"%d\", y);" kimenete?', answer: 2, type: 'programming', expression: '16 >> 3 = 10000 >> 3 = 10 = 2' },
            { question: 'Mi lesz az "int x = 2; int y = x << 3; printf(\"%d\", y);" kimenete?', answer: 16, type: 'programming', expression: '2 << 3 = 10 << 3 = 10000 = 16' },
            { question: 'Mi lesz az "int x = 10; int y = ~x; printf(\"%d\", y);" kimenete?', answer: -11, type: 'programming', expression: '~10 = ~1010 = 0101... (kétkomplementer) = -11' },
            { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x && y);" kimenete?', answer: 1, type: 'programming', expression: '5 && 3 = igaz && igaz = igaz = 1' },
            { question: 'Mi lesz az "int x = 0; int y = 5; printf(\"%d\", x || y);" kimenete?', answer: 1, type: 'programming', expression: '0 || 5 = hamis || igaz = igaz = 1' }
        ],
        'Diszkrét valószínűségi változók': [
            { question: 'A Pick Szeged férfi kézilabda csapatában az átlövők testmagassága 193, 198, 199, 200, 203 és 203 centiméter. Véletlenszerűen kiválasztva egy játékost mi az esélye annak, hogy az ő testmagassága legalább 200 cm? Mennyi a testmagasság várható értéke és szórása?', answer: 0.5, type: 'Valószínűségszámítás', expression: 'ξ = a kiválasztott játékos testmagassága\nP(ξ ≥ 200) = 50% = 0.5\nE(ξ) = 199.33\nD(ξ) = 3.4' }
        ],
        'Folytonos valószínűségi változók': [
            { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,2] intervallumon. Mi a várható értéke?', answer: 1, type: 'Valószínűségszámítás', expression: 'E[X] = (a+b)/2 = (0+2)/2 = 1' },
            { question: 'Egy exponenciális eloszlású valószínűségi változó λ=2 paraméterrel. Mi a várható értéke?', answer: 0.5, type: 'Valószínűségszámítás', expression: 'E[X] = 1/λ = 1/2 = 0.5' },
            { question: 'Egy normális eloszlású valószínűségi változó μ=5, σ=2 paraméterekkel. Mi a várható értéke?', answer: 5, type: 'Valószínűségszámítás', expression: 'E[X] = μ = 5' },
            { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,4] intervallumon. Mi a szórása?', answer: 1.15, type: 'Valószínűségszámítás', expression: 'D[X] = (b-a)/(2√3) = (4-0)/(2√3) = 4/(2√3) ≈ 1.15' },
            { question: 'Egy exponenciális eloszlású valószínűségi változó λ=3 paraméterrel. Mi a szórása?', answer: 0.33, type: 'Valószínűségszámítás', expression: 'D[X] = 1/λ = 1/3 ≈ 0.33' }
        ]
    };

    useEffect(() => {
        // Ellenőrizzük, hogy vannak-e URL paraméterek (exam-prep-ből jövünk)
        if (router.query.studentId && router.query.studentName) {
            loadCustomTask();
        } else if (router.query.taskId) {
            // Ha csak taskId van, akkor is a custom task-ot töltjük
            loadCustomTask();
        } else {
            // Csak akkor töltjük a bejelentkezett felhasználó feladatait, ha nincs URL paraméter
            loadAssignedTasks();
        }
    }, [router.query]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && gameActive) {
            endGame();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameActive]);

    const loadCustomTask = () => {
        try {
            const { studentId, studentName, taskId } = router.query;

            if (taskId) {
                // Ha van taskId, akkor a standard feladatokat kell betölteni
                const taskTitles: { [key: string]: any } = {
                    'task1': { title: 'Másodfokú egyenletek', description: 'Megoldás, diszkrimináns, gyökök számítása', difficulty: 'medium', topic: 'Algebra', timeLimit: 30 },
                    'task2': { title: 'Deriválás alapjai', description: 'Hatványfüggvények, szorzat, hányados deriválása', difficulty: 'hard', topic: 'Analízis', timeLimit: 45 },
                    'task3': { title: 'Trigonometria', description: 'Szögfüggvények, azonosságok, egyenletek', difficulty: 'medium', topic: 'Trigonometria', timeLimit: 35 },
                    'task4': { title: 'Síkgeometria', description: 'Terület, kerület, hasonlóság', difficulty: 'easy', topic: 'Geometria', timeLimit: 25 },
                    'task5': { title: 'Integrálás', description: 'Alapintegrálok, helyettesítéses integrálás', difficulty: 'hard', topic: 'Analízis', timeLimit: 60 },
                    'task6': { title: '2025 Emelt Érettségi', description: 'Komplex feladatok, szöveges problémák, bizonyítások', difficulty: 'hard', topic: 'Emelt szint', timeLimit: 90 },
                    'task7': { title: 'Hatványozás és Gyökvonás', description: 'Hatványozás, gyökvonás és exponenciális kifejezések gyakorlása', difficulty: 'medium', topic: 'Algebra', timeLimit: 60 },
                    'task8': { title: 'C Programozás Alapok', description: 'C nyelv alapjai, változók, ciklusok, függvények', difficulty: 'medium', topic: 'Programozás', timeLimit: 90 },
                    'task9': { title: 'C Programozás Haladó', description: 'Pointerek, tömbök, struktúrák, fájlkezelés', difficulty: 'hard', topic: 'Programozás', timeLimit: 120 },
                    'task10': { title: 'Diszkrét valószínűségi változók', description: 'Valószínűségi eloszlások, várható érték, szórás, binomiális és Poisson eloszlás', difficulty: 'hard', topic: 'Valószínűségszámítás', timeLimit: 45 },
                    'task11': { title: 'Folytonos valószínűségi változók', description: 'Sűrűségfüggvények, eloszlásfüggvények, várható érték, szórás', difficulty: 'hard', topic: 'Valószínűségszámítás', timeLimit: 70 }
                };

                const taskInfo = taskTitles[taskId as string] || { title: 'Ismeretlen feladat', description: '', difficulty: 'medium', topic: 'Általános', timeLimit: 30 };

                const standardTask: AssignedTask = {
                    id: taskId as string,
                    title: taskInfo.title,
                    description: taskInfo.description,
                    difficulty: taskInfo.difficulty,
                    topic: taskInfo.topic,
                    questions: sampleQuestions[taskInfo.title as keyof typeof sampleQuestions] || [],
                    timeLimit: taskInfo.timeLimit,
                    completed: false,
                    score: 0
                };

                setAssignedTasks([standardTask]);
                setLoading(false);

                // Automatikusan elindítjuk a játékot
                setTimeout(() => {
                    setCurrentTask(standardTask);
                    setGameActive(true);
                    setGameStarted(true);
                    setTimeLeft(standardTask.timeLimit * 60);
                }, 1000);
            }
        } catch (error) {
            console.error('Error loading custom task:', error);
            setError('Hiba az egyedi feladat betöltése során');
            setLoading(false);
        }
    };

    const loadAssignedTasks = async () => {
        try {
            if (!currentUser?.uid) {
                if (!router.query.studentId) {
                    router.push('/');
                    return;
                }
                setLoading(false);
                return;
            }

            try {
                const { loadStudentAssignedTasks } = await import('../utils/assignedTasks');
                const list = await loadStudentAssignedTasks(currentUser.uid, currentUser.email || undefined);
                if (list.length) {
                    const tasks: AssignedTask[] = list.map((task) => ({
                        id: task.id,
                        title: task.title,
                        description: task.description || '',
                        difficulty: (task.difficulty as AssignedTask['difficulty']) || 'medium',
                        topic: task.topicTitle || task.topicId || 'Általános',
                        questions: sampleQuestions[task.title as keyof typeof sampleQuestions] || sampleQuestions['Másodfokú egyenletek'],
                        timeLimit: task.timeLimit || 30,
                        completed: task.status === 'completed',
                        score: 0,
                    }));
                    setAssignedTasks(tasks);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                console.warn('Assigned tasks API load failed:', e);
            }

            setAssignedTasks([]);
            setLoading(false);
        } catch (error) {
            console.error('Error loading assigned tasks:', error);
            setError('Hiba a feladatok betöltése során');
            setLoading(false);
        }
    };

    const startTask = (task: AssignedTask) => {
        setCurrentTask(task);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimeLeft(task.timeLimit * 60); // Convert minutes to seconds
        setGameActive(true);
        setGameCompleted(false);
        setGameStarted(false);
        setCurrentStreak(0);
        setMaxStreak(0);
        setLives(3);
        setPowerUps({
            skip: 1,
            hint: 2,
            extraTime: 1
        });
        setUserAnswer('');
    };

    const startGame = () => {
        setGameStarted(true);
    };

    const submitAnswer = () => {
        if (!currentTask || !userAnswer) return;

        const currentQuestion = currentTask.questions[currentQuestionIndex];
        const isCorrect = parseFloat(userAnswer) === currentQuestion.answer;

        if (isCorrect) {
            setScore(score + 1);
            setCurrentStreak(currentStreak + 1);
            if (currentStreak + 1 > maxStreak) {
                setMaxStreak(currentStreak + 1);
            }
        } else {
            setCurrentStreak(0);
            setLives(lives - 1);
            if (lives - 1 <= 0) {
                endGame();
                return;
            }
        }

        if (currentQuestionIndex < currentTask.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUserAnswer('');
        } else {
            endGame();
        }
    };

    const usePowerUp = (type: 'skip' | 'hint' | 'extraTime') => {
        if (powerUps[type] <= 0) return;

        switch (type) {
            case 'skip':
                setPowerUps(prev => ({ ...prev, skip: prev.skip - 1 }));
                if (currentQuestionIndex < currentTask!.questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setUserAnswer('');
                } else {
                    endGame();
                }
                break;
            case 'hint':
                setPowerUps(prev => ({ ...prev, hint: prev.hint - 1 }));
                // Show hint (could be implemented with a modal or tooltip)
                alert(`Tipp: ${currentTask!.questions[currentQuestionIndex].expression}`);
                break;
            case 'extraTime':
                setPowerUps(prev => ({ ...prev, extraTime: prev.extraTime - 1 }));
                setTimeLeft(timeLeft + 60); // Add 1 minute
                break;
        }
    };

    const endGame = async () => {
        setGameActive(false);
        setGameCompleted(true);

        if (!currentTask) return;

        const finalScore = Math.round((score / currentTask.questions.length) * 100);

        setAssignedTasks(prev => prev.map(task =>
            task.id === currentTask.id
                ? { ...task, completed: true, score: finalScore }
                : task
        ));
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#39ff14';
            case 'medium': return '#ffbb55';
            case 'hard': return '#ff6b9d';
            default: return '#39ff14';
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="student-game-container">
                <div className="loading">Betöltés...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="student-game-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>🎮 Tanulói Játék - Mihaszna Matek</title>
                <meta name="description" content="Kiosztott feladatok megoldása" />
            </Head>

            <div className="student-game-container">
                {!gameActive && !gameCompleted && (
                    <div className="task-selection">
                        <div className="game-header">
                            <h1 className="game-title">🎮 Kiosztott Feladatok</h1>
                            <p className="game-subtitle">Válaszd ki a megoldandó feladatot!</p>
                            {isAdmin && (
                                <div style={{
                                    background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                    color: '#000',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '15px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    marginTop: '1rem',
                                    boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)',
                                    maxWidth: '300px',
                                    margin: '1rem auto 0'
                                }}>
                                    👑 ADMIN MODE - {currentUser?.email}
                                </div>
                            )}
                        </div>

                        <div className="tasks-grid">
                            {assignedTasks.map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-header">
                                        <h3 className="task-title">{task.title}</h3>
                                        <span
                                            className="task-difficulty"
                                            style={{ color: getDifficultyColor(task.difficulty) }}
                                        >
                                            {task.difficulty === 'easy' ? 'Könnyű' :
                                                task.difficulty === 'medium' ? 'Közepes' : 'Nehéz'}
                                        </span>
                                    </div>
                                    <p className="task-description">{task.description}</p>
                                    <div className="task-meta">
                                        <span className="task-topic">📖 {task.topic}</span>
                                        <span className="task-questions">❓ {task.questions.length} feladat</span>
                                        <span className="task-time">⏱️ {task.timeLimit} perc</span>
                                    </div>
                                    {task.completed && (
                                        <div className="task-completed">
                                            ✅ Elkészült - Pontszám: {task.score}%
                                        </div>
                                    )}
                                    <button
                                        className="start-task-btn"
                                        onClick={() => startTask(task)}
                                        disabled={task.completed}
                                    >
                                        {task.completed ? 'Elkészült' : 'Feladat Kezdése'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameActive && currentTask && !gameStarted && (
                    <div className="game-start-screen">
                        <div className="start-content">
                            <h2 className="game-title">🎮 {currentTask.title}</h2>
                            <div className="game-info">
                                <div className="info-card">
                                    <h3>📋 Feladat információk</h3>
                                    <p><strong>Témakör:</strong> {currentTask.topic}</p>
                                    <p><strong>Feladatok:</strong> {currentTask.questions.length} db</p>
                                    <p><strong>Időtartam:</strong> {currentTask.timeLimit} perc</p>
                                    <p><strong>Nehézség:</strong> {currentTask.difficulty === 'easy' ? 'Könnyű' : currentTask.difficulty === 'medium' ? 'Közepes' : 'Nehéz'}</p>
                                </div>
                                <div className="info-card">
                                    <h3>🎯 Játék szabályok</h3>
                                    <p>• 3 életed van</p>
                                    <p>• Helyes válasz = pont + streak</p>
                                    <p>• Helytelen válasz = élet vesztés</p>
                                    <p>• Power-up-ok segítenek</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {gameActive && currentTask && gameStarted && (
                    <div className="game-interface">
                        <div className="game-header">
                            <h2 className="current-task-title">{currentTask.title}</h2>
                            <div className="game-stats">
                                <div className="stat-item">
                                    <span className="stat-icon">⏱️</span>
                                    <span className="stat-value">{formatTime(timeLeft)}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">❓</span>
                                    <span className="stat-value">{currentQuestionIndex + 1}/{currentTask.questions.length}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">⭐</span>
                                    <span className="stat-value">{score}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">🔥</span>
                                    <span className="stat-value">{currentStreak}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">❤️</span>
                                    <span className="stat-value">{lives}</span>
                                </div>
                            </div>
                        </div>

                        <div className="power-ups">
                            <button
                                className={`power-up-btn ${powerUps.skip <= 0 ? 'disabled' : ''}`}
                                onClick={() => usePowerUp('skip')}
                                disabled={powerUps.skip <= 0}
                            >
                                ⏭️ Kihagyás ({powerUps.skip})
                            </button>
                            <button
                                className={`power-up-btn ${powerUps.hint <= 0 ? 'disabled' : ''}`}
                                onClick={() => usePowerUp('hint')}
                                disabled={powerUps.hint <= 0}
                            >
                                💡 Tipp ({powerUps.hint})
                            </button>
                            <button
                                className={`power-up-btn ${powerUps.extraTime <= 0 ? 'disabled' : ''}`}
                                onClick={() => usePowerUp('extraTime')}
                                disabled={powerUps.extraTime <= 0}
                            >
                                ⏰ +1 perc ({powerUps.extraTime})
                            </button>
                        </div>

                        <div className="question-container">
                            <div className="question">
                                <h3>{currentTask.questions[currentQuestionIndex].question}</h3>
                            </div>
                            <div className="answer-input">
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Add meg a választ..."
                                    className="answer-field"
                                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                />
                                <button className="submit-btn" onClick={submitAnswer}>
                                    Válasz
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {gameCompleted && currentTask && (
                    <div className="game-results">
                        <div className="results-header">
                            <h2>🎉 Feladat Befejezve!</h2>
                            <h3>{currentTask.title}</h3>
                        </div>
                        <div className="results-stats">
                            <div className="stat">
                                <span className="stat-label">Helyes válaszok</span>
                                <span className="stat-value">{score} / {currentTask.questions.length}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Pontszám</span>
                                <span className="stat-value">{Math.round((score / currentTask.questions.length) * 100)}%</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Legjobb streak</span>
                                <span className="stat-value">{maxStreak}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Hátralevő életek</span>
                                <span className="stat-value">{lives}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Idő</span>
                                <span className="stat-value">{formatTime((currentTask.timeLimit * 60) - timeLeft)}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Power-up-ok használva</span>
                                <span className="stat-value">{3 - powerUps.skip - powerUps.hint - powerUps.extraTime}</span>
                            </div>
                        </div>
                        <div className="results-actions">
                            <button className="new-task-btn" onClick={() => {
                                setGameCompleted(false);
                                setCurrentTask(null);
                            }}>
                                Új Feladat
                            </button>
                            <button className="dashboard-btn" onClick={() => router.push('/dashboard')}>
                                Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .student-game-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                    color: #fff;
                    padding: 2rem;
                    font-family: 'Poppins', sans-serif;
                }

                .game-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .back-btn {
                    background: rgba(57, 255, 20, 0.1);
                    border: 2px solid #39ff14;
                    color: #39ff14;
                    padding: 0.8rem 1.5rem;
                    border-radius: 15px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-bottom: 2rem;
                }

                .back-btn:hover {
                    background: rgba(57, 255, 20, 0.2);
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
                    transform: translateY(-2px);
                }

                .game-title {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #39ff14;
                    text-shadow: 0 0 20px rgba(57, 255, 20, 0.6);
                    margin-bottom: 1rem;
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }

                .game-subtitle {
                    font-size: 1.2rem;
                    color: #ff6b9d;
                    text-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
                }

                .tasks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .task-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .task-card:hover {
                    border-color: #39ff14;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
                    transform: translateY(-5px);
                }

                .task-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .task-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #39ff14;
                }

                .task-difficulty {
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.3rem 0.8rem;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .task-description {
                    color: #ccc;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }

                .task-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    color: #999;
                }

                .task-completed {
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid #39ff14;
                    border-radius: 10px;
                    padding: 1rem;
                    text-align: center;
                    color: #39ff14;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .start-task-btn {
                    width: 100%;
                    background: linear-gradient(45deg, #ff6b9d, #39ff14);
                    color: #000;
                    border: none;
                    padding: 1rem;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .start-task-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 0 25px rgba(255, 107, 157, 0.6);
                }

                .start-task-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .game-start-screen {
                    max-width: 800px;
                    margin: 0 auto;
                    text-align: center;
                }

                .start-content {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 3rem;
                    backdrop-filter: blur(10px);
                }

                .game-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin: 2rem 0;
                }

                .info-card {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    border-radius: 15px;
                    padding: 1.5rem;
                    text-align: left;
                }

                .info-card h3 {
                    color: #39ff14;
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                }

                .info-card p {
                    color: #fff;
                    margin-bottom: 0.5rem;
                    line-height: 1.6;
                }

                .start-game-btn {
                    background: linear-gradient(45deg, #ff6b9d, #39ff14);
                    color: #000;
                    border: none;
                    padding: 1.5rem 3rem;
                    border-radius: 20px;
                    font-size: 1.3rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 2rem;
                }

                .start-game-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 30px rgba(255, 107, 157, 0.6);
                }

                .game-interface {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .current-task-title {
                    font-size: 2rem;
                    color: #39ff14;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .game-stats {
                    display: flex;
                    justify-content: space-around;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(57, 255, 20, 0.1);
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    border: 1px solid #39ff14;
                }

                .stat-icon {
                    font-size: 1.2rem;
                }

                .stat-value {
                    font-weight: 600;
                    color: #39ff14;
                    font-size: 1.1rem;
                }

                .power-ups {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .power-up-btn {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    color: #ff6b9d;
                    padding: 0.8rem 1.5rem;
                    border-radius: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                }

                .power-up-btn:hover:not(.disabled) {
                    background: rgba(255, 107, 157, 0.2);
                    box-shadow: 0 0 15px rgba(255, 107, 157, 0.4);
                    transform: translateY(-2px);
                }

                .power-up-btn.disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .question-container {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 2rem;
                    text-align: center;
                }

                .question h3 {
                    font-size: 1.5rem;
                    color: #fff;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .answer-input {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    align-items: center;
                }

                .answer-field {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid #39ff14;
                    border-radius: 10px;
                    padding: 1rem;
                    font-size: 1.2rem;
                    color: #39ff14;
                    width: 200px;
                    text-align: center;
                }

                .answer-field:focus {
                    outline: none;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
                }

                .submit-btn {
                    background: linear-gradient(45deg, #ff6b9d, #39ff14);
                    color: #000;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .submit-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 25px rgba(255, 107, 157, 0.6);
                }

                .game-results {
                    max-width: 600px;
                    margin: 0 auto;
                    text-align: center;
                }

                .results-header h2 {
                    font-size: 2.5rem;
                    color: #39ff14;
                    margin-bottom: 1rem;
                }

                .results-header h3 {
                    font-size: 1.5rem;
                    color: #ff6b9d;
                    margin-bottom: 2rem;
                }

                .results-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 1.5rem;
                }

                .stat-label {
                    display: block;
                    color: #999;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }

                .stat-value {
                    display: block;
                    color: #39ff14;
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                .results-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                .new-task-btn, .dashboard-btn {
                    background: linear-gradient(45deg, #ff6b9d, #39ff14);
                    color: #000;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .new-task-btn:hover, .dashboard-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 25px rgba(255, 107, 157, 0.6);
                }

                .loading, .error {
                    text-align: center;
                    font-size: 1.5rem;
                    color: #39ff14;
                    margin-top: 5rem;
                }

                .error {
                    color: #ff6b9d;
                }

                @keyframes neonGlow {
                    0% { text-shadow: 0 0 20px rgba(57, 255, 20, 0.6); }
                    100% { text-shadow: 0 0 30px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.4); }
                }

                @media (max-width: 768px) {
                    .student-game-container {
                        padding: 1rem;
                    }
                    
                    .game-title {
                        font-size: 2rem;
                    }
                    
                    .tasks-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .answer-input {
                        flex-direction: column;
                    }
                    
                    .results-stats {
                        grid-template-columns: 1fr;
                    }
                    
                    .results-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </>
    );
}
