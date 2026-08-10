import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Student {
    id: string;
    name: string;
    email: string;
    grade: string;
    assignedTasks: string[];
    completedTasks: string[];
    progress: number;
}

interface ExamTask {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string; // Kötelező témakör
    educationLevel: 'elementary' | 'highschool' | 'university';
    questions: number;
    timeLimit: number; // minutes
    customQuestions?: {
        question: string,
        answer: number,
        expression: string,
        type?: string,
        subtopic?: string // Al-témakör vegyes feladatokhoz
    }[];
}

export default function ExamPrep() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [examTasks, setExamTasks] = useState<ExamTask[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [showGameInterface, setShowGameInterface] = useState(false);
    const [showTaskEditor, setShowTaskEditor] = useState(false);
    const [editingTask, setEditingTask] = useState<ExamTask | null>(null);
    const [editableTask, setEditableTask] = useState<ExamTask | null>(null);
    const [customQuestions, setCustomQuestions] = useState<{ question: string, answer: number, expression: string, subtopic?: string }[]>([]);
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<ExamTask | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quizLevel, setQuizLevel] = useState<'elementary' | 'highschool' | 'university'>('university');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        topic: '', // Kötelező, nincs alapértelmezett érték
        educationLevel: 'university' as 'elementary' | 'highschool' | 'university',
        difficulty: 'medium' as 'easy' | 'medium' | 'hard',
        questions: 10,
        timeLimit: 30
    });

    // Sample exam tasks mindhárom szintre
    const sampleTasks: ExamTask[] = [
        // Középiskola / gimnázium
        {
            id: 'hs1',
            title: 'Másodfokú egyenletek',
            description: 'Megoldás, diszkrimináns, gyökök számítása',
            difficulty: 'medium',
            topic: 'Algebra',
            educationLevel: 'highschool',
            questions: 10,
            timeLimit: 30
        },
        {
            id: 'hs2',
            title: 'Trigonometria',
            description: 'Szögfüggvények, azonosságok, egyenletek',
            difficulty: 'medium',
            topic: 'Trigonometria',
            educationLevel: 'highschool',
            questions: 12,
            timeLimit: 35
        },
        {
            id: 'hs3',
            title: 'Síkgeometria',
            description: 'Terület, kerület, hasonlóság',
            difficulty: 'easy',
            topic: 'Geometria',
            educationLevel: 'highschool',
            questions: 8,
            timeLimit: 25
        },
        {
            id: 'hs4',
            title: 'Függvények',
            description: 'Lineáris, másodfokú, exponenciális függvények',
            difficulty: 'medium',
            topic: 'Függvények',
            educationLevel: 'highschool',
            questions: 12,
            timeLimit: 40
        },
        {
            id: 'hs5',
            title: 'Logaritmus',
            description: 'Logaritmus azonosságok és egyenletek',
            difficulty: 'hard',
            topic: 'Logaritmus',
            educationLevel: 'highschool',
            questions: 10,
            timeLimit: 45
        },
        {
            id: 'hs6',
            title: '2025 Emelt Érettségi',
            description: 'Komplex feladatok, szöveges problémák, bizonyítások',
            difficulty: 'hard',
            topic: 'Emelt szint',
            educationLevel: 'highschool',
            questions: 25,
            timeLimit: 90
        },
        {
            id: 'hs7',
            title: 'Hatványozás és Gyökvonás',
            description: 'Hatványozás, gyökvonás és exponenciális kifejezések gyakorlása',
            difficulty: 'medium',
            topic: 'Algebra',
            educationLevel: 'highschool',
            questions: 12,
            timeLimit: 60
        },
        // Általános iskolai feladatok
        {
            id: 'elementary1',
            title: 'Alapvető Műveletek',
            description: 'Összeadás, kivonás, szorzás, osztás gyakorlása',
            difficulty: 'easy',
            topic: 'Aritmetika',
            educationLevel: 'elementary',
            questions: 10,
            timeLimit: 30
        },
        {
            id: 'elementary2',
            title: 'Törtek',
            description: 'Törtek összeadása, kivonása, szorzása, osztása',
            difficulty: 'medium',
            topic: 'Törtek',
            educationLevel: 'elementary',
            questions: 12,
            timeLimit: 45
        },
        {
            id: 'elementary3',
            title: 'Tizedes Törtek',
            description: 'Tizedes törtek műveletei és átváltása',
            difficulty: 'medium',
            topic: 'Tizedes Törtek',
            educationLevel: 'elementary',
            questions: 15,
            timeLimit: 50
        },
        {
            id: 'elementary4',
            title: 'Szöveges Feladatok',
            description: 'Szöveges feladatok megoldása alapvető műveletekkel',
            difficulty: 'medium',
            topic: 'Szöveges Feladatok',
            educationLevel: 'elementary',
            questions: 8,
            timeLimit: 40
        },
        {
            id: 'elementary5',
            title: 'Geometria Alapok',
            description: 'Alakzatok, kerület, terület számítása',
            difficulty: 'medium',
            topic: 'Geometria',
            educationLevel: 'elementary',
            questions: 10,
            timeLimit: 35
        },
        {
            id: 'elementary6',
            title: 'Mértékegységek',
            description: 'Hosszúság, tömeg, idő mértékegységek átváltása',
            difficulty: 'easy',
            topic: 'Mértékegységek',
            educationLevel: 'elementary',
            questions: 12,
            timeLimit: 30
        },
        // Egyetemi feladatok
        {
            id: 'uniboost1',
            title: 'Analízis I. - Határértékek',
            description: 'Függvények határértéke, folytonosság, deriválás alapjai',
            difficulty: 'hard',
            topic: 'Analízis',
            educationLevel: 'university',
            questions: 15,
            timeLimit: 60
        },
        {
            id: 'uniboost2',
            title: 'Lineáris Algebra - Mátrixok',
            description: 'Mátrix műveletek, determináns, inverz mátrix',
            difficulty: 'medium',
            topic: 'Lineáris Algebra',
            educationLevel: 'university',
            questions: 12,
            timeLimit: 45
        },
        {
            id: 'uniboost3',
            title: 'Diszkrét Matematika - Gráfelmélet',
            description: 'Gráfok, fák, útvonalak, színezési problémák',
            difficulty: 'hard',
            topic: 'Diszkrét Matematika',
            educationLevel: 'university',
            questions: 18,
            timeLimit: 75
        },
        {
            id: 'uniboost4',
            title: 'Numerikus Módszerek',
            description: 'Numerikus integrálás, egyenletrendszerek megoldása',
            difficulty: 'hard',
            topic: 'Numerikus Analízis',
            educationLevel: 'university',
            questions: 20,
            timeLimit: 90
        },
        {
            id: 'uniboost5',
            title: 'Operációkutatás',
            description: 'Lineáris programozás, szállítási probléma, hozzárendelési probléma',
            difficulty: 'medium',
            topic: 'Operációkutatás',
            educationLevel: 'university',
            questions: 14,
            timeLimit: 60
        },
        {
            id: 'uniboost6',
            title: 'Folytonos valószínűségi változók',
            description: 'Sűrűségfüggvények, eloszlásfüggvények, várható érték, szórás',
            difficulty: 'hard',
            topic: 'Valószínűségszámítás',
            educationLevel: 'university',
            questions: 16,
            timeLimit: 70
        },
        {
            id: 'task8',
            title: 'C Programozás Alapok',
            description: 'C nyelv alapjai, változók, ciklusok, függvények',
            difficulty: 'medium',
            topic: 'Programozás',
            educationLevel: 'university',
            questions: 15,
            timeLimit: 90
        },
        {
            id: 'task9',
            title: 'C Programozás Haladó',
            description: 'Pointerek, tömbök, struktúrák, fájlkezelés',
            difficulty: 'hard',
            topic: 'Programozás',
            educationLevel: 'university',
            questions: 20,
            timeLimit: 120
        },
        {
            id: 'task10',
            title: 'Diszkrét valószínűségi változók',
            description: 'Valószínűségi eloszlások, várható érték, szórás, binomiális és Poisson eloszlás',
            difficulty: 'hard',
            topic: 'Valószínűségszámítás',
            educationLevel: 'university',
            questions: 1,
            timeLimit: 45,
            customQuestions: [
                {
                    question: 'A Pick Szeged férfi kézilabda csapatában az átlövők testmagassága 193, 198, 199, 200, 203 és 203 centiméter. Véletlenszerűen kiválasztva egy játékost mi az esélye annak, hogy az ő testmagassága legalább 200 cm? Mennyi a testmagasság várható értéke és szórása?',
                    answer: 0.5,
                    expression: 'ξ = a kiválasztott játékos testmagassága\nP(ξ ≥ 200) = 50% = 0.5\nE(ξ) = 199.33\nD(ξ) = 3.4',
                    type: 'Valószínűségszámítás'
                }
            ]
        },
        {
            id: 'task2',
            title: 'Deriválás alapjai',
            description: 'Hatványfüggvények, szorzat, hányados deriválása',
            difficulty: 'hard',
            topic: 'Analízis',
            educationLevel: 'university',
            questions: 15,
            timeLimit: 45
        },
        {
            id: 'task5',
            title: 'Integrálás',
            description: 'Alapintegrálok, helyettesítéses integrálás',
            difficulty: 'hard',
            topic: 'Analízis',
            educationLevel: 'university',
            questions: 20,
            timeLimit: 60
        }
    ];

    useEffect(() => {
        const checkAuth = async () => {
            let attempts = 0;
            while (!(window as any).firebase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!(window as any).firebase) {
                setError("Firebase nem elérhető.");
                setLoading(false);
                return;
            }

            try {
                const auth = (window as any).firebase.auth();
                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user) {
                        // Ha nincs bejelentkezett felhasználó, folytatjuk bejelentkezés nélkül
                        setLoading(false);
                        return;
                    }

                    setCurrentUser(user);

                    // Admin ellenőrzés - csak usezsolti@gmail.com férhet hozzá
                    if (user.email === 'usezsolti@gmail.com') {
                        console.log('Admin hozzáférés engedélyezve:', user.email);
                        setIsAdmin(true);
                        // Load sample tasks
                        setExamTasks(sampleTasks);
                        // Load students from Firebase
                        loadStudents();
                        // Load custom tasks from Firebase
                        loadCustomTasks();

                        // Check if we came with a level filter
                        const levelQuery = router.query.level as string | undefined;
                        if (levelQuery === 'elementary' || levelQuery === 'highschool' || levelQuery === 'university') {
                            setQuizLevel(levelQuery);
                            setNewTask(prev => ({ ...prev, educationLevel: levelQuery }));
                        } else if (router.query.uniboost === 'true') {
                            setQuizLevel('university');
                        } else if (router.query.elementaryboost === 'true') {
                            setQuizLevel('elementary');
                        }
                        setLoading(false);
                    } else {
                        console.log('Nincs admin jogosultság:', user.email);
                        setError("Csak adminisztrátorok férhetnek hozzá ehhez az oldalhoz.");
                        setLoading(false);
                    }
                });

                return () => unsub();
            } catch (err) {
                setError("Hiba történt az autentikáció során.");
                setLoading(false);
            }
        };

        checkAuth();
    }, [router.query]);

    const loadStudents = async () => {
        try {
            if (!(window as any).firebase) {
                setError('Firebase nincs betöltve');
                setLoading(false);
                return;
            }

            const db = (window as any).firebase.firestore();
            const snapshot = await db.collection('users').get();

            const studentsList: Student[] = [];
            snapshot.forEach((doc: any) => {
                const data = doc.data();
                studentsList.push({
                    id: doc.id,
                    name: data.displayName || data.name || 'Névtelen',
                    email: data.email,
                    grade: data.grade || 'N/A',
                    assignedTasks: data.assignedTasks || [],
                    completedTasks: data.completedTasks || [],
                    progress: data.progress || 0
                });
            });

            // Hozzáadjuk az általános iskolai tanulókat
            const elementaryStudents: Student[] = [
                {
                    id: 'rab_dominik',
                    name: 'Rab Dominik',
                    email: 'rab.dominik@elementary.hu',
                    grade: '2. osztály',
                    assignedTasks: ['elementary1', 'elementary2'],
                    completedTasks: [],
                    progress: 0
                }
            ];

            // Hozzáadjuk az egyetemi tanulókat
            const universityStudents: Student[] = [
                {
                    id: 'galoczi_imre',
                    name: 'Galóczi Imre',
                    email: 'galoczi.imre@student.szeged.hu',
                    grade: 'egyetemista',
                    assignedTasks: ['task10'],
                    completedTasks: [],
                    progress: 0
                }
            ];

            // Egyesítjük a Firebase-ből betöltött, általános iskolai és egyetemi tanulókat
            const allStudents = [...studentsList, ...elementaryStudents, ...universityStudents];

            setStudents(allStudents);
            setLoading(false);
        } catch (error) {
            console.error('Error loading students:', error);
            setError('Hiba a tanulók betöltése során');
            setLoading(false);
        }
    };

    const inferEducationLevel = (task: Partial<ExamTask> & { id?: string }): 'elementary' | 'highschool' | 'university' => {
        if (task.educationLevel === 'elementary' || task.educationLevel === 'highschool' || task.educationLevel === 'university') {
            return task.educationLevel;
        }
        const id = task.id || '';
        if (id.startsWith('elementary') || id.includes('elementary')) return 'elementary';
        if (id.startsWith('hs') || id.includes('highschool') || id.includes('erettsegi')) return 'highschool';
        if (id.startsWith('uniboost')) return 'university';
        return 'university';
    };

    const loadCustomTasks = async () => {
        try {
            if (!(window as any).firebase) {
                return;
            }

            const db = (window as any).firebase.firestore();
            const snapshot = await db.collection('customTasks').get();

            const customTasks: ExamTask[] = [];
            snapshot.forEach((doc: any) => {
                const data = doc.data();
                customTasks.push({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    topic: data.topic,
                    educationLevel: inferEducationLevel(data),
                    difficulty: data.difficulty,
                    questions: data.questions,
                    timeLimit: data.timeLimit,
                    customQuestions: data.customQuestions || []
                });
            });

            // Összevonjuk a sample tasks-okat a custom tasks-okkal
            setExamTasks(prevTasks => {
                // Eltávolítjuk azokat a sample tasks-okat, amelyeknek van custom verziója
                const filteredSampleTasks = sampleTasks.filter(sampleTask =>
                    !customTasks.some(customTask => customTask.id === sampleTask.id)
                );

                // Visszaadjuk a custom tasks-okat + a nem felülírt sample tasks-okat
                return [...customTasks, ...filteredSampleTasks];
            });

        } catch (error) {
            console.error('Error loading custom tasks:', error);
        }
    };

    const assignSelectedTaskToStudent = async (): Promise<boolean> => {
        if (!selectedStudent || selectedTasks.length === 0) return false;
        const selectedTask = examTasks.find((t) => t.id === selectedTasks[0]);
        if (!selectedTask) return false;

        const { assignTaskToStudent } = await import("../utils/assignedTasks");
        const level = inferEducationLevel(selectedTask);
        const result = await assignTaskToStudent({
            taskId: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description,
            topicId: (selectedTask.topic || "").toLowerCase().replace(/\s+/g, "-"),
            topicTitle: selectedTask.topic,
            educationLevel: level,
            difficulty: selectedTask.difficulty,
            questions: selectedTask.questions,
            timeLimit: selectedTask.timeLimit,
            customQuestions: selectedTask.customQuestions || [],
            studentId: selectedStudent.id,
            studentEmail: selectedStudent.email,
            studentName: selectedStudent.name,
            createdBy: currentUser?.email || "",
        });

        if (!result.ok) {
            alert(result.error || "Feladat kiosztása sikertelen.");
            return false;
        }

        setStudents((prev) =>
            prev.map((s) =>
                s.id === selectedStudent.id
                    ? {
                          ...s,
                          assignedTasks: Array.from(new Set([...(s.assignedTasks || []), selectedTask.id])),
                      }
                    : s
            )
        );
        return true;
    };

    const assignOnlyToStudent = async () => {
        const ok = await assignSelectedTaskToStudent();
        if (ok) {
            alert("Feladat kiosztva! A diák a Dashboard → mymihaszna mat felületen látja.");
        }
    };

    const startGameForStudent = async () => {
        if (!selectedStudent) return;

        const selectedTask = examTasks.find((t) => t.id === selectedTasks[0]);
        const level = selectedTask ? inferEducationLevel(selectedTask) : quizLevel;

        if (selectedTasks.length > 0) {
            await assignSelectedTaskToStudent();
            const taskId = selectedTasks[0];
            window.location.href = `/game?educationLevel=${level}&taskId=${taskId}&studentId=${selectedStudent.id}&studentName=${encodeURIComponent(selectedStudent.name)}`;
        } else {
            window.location.href = `/game?educationLevel=${level}&studentId=${selectedStudent.id}&studentName=${encodeURIComponent(selectedStudent.name)}`;
        }
    };

    const filteredExamTasks = examTasks.filter(task => inferEducationLevel(task) === quizLevel);

    const openGameInterface = (student: Student) => {
        setSelectedStudent(student);
        setShowGameInterface(true);
    };

    const openTaskEditor = (task: ExamTask) => {
        setEditingTask(task);
        setEditableTask({ ...task });
        setCustomQuestions(task.customQuestions || []);
        setShowTaskEditor(true);
    };

    const openTaskDetails = (task: ExamTask) => {
        setSelectedTaskForDetails(task);
        setShowTaskDetails(true);
    };

    const selectTask = (taskId: string) => {
        setSelectedTasks([taskId]);
    };

    const updateEditableTask = (field: keyof ExamTask, value: string | number) => {
        if (editableTask) {
            setEditableTask({ ...editableTask, [field]: value });
        }
    };

    const addCustomQuestion = () => {
        setCustomQuestions([...customQuestions, { question: '', answer: 0, expression: '', subtopic: '' }]);
    };

    const updateCustomQuestion = (index: number, field: string, value: string | number) => {
        const updated = [...customQuestions];
        updated[index] = { ...updated[index], [field]: value };
        setCustomQuestions(updated);
    };

    const removeCustomQuestion = (index: number) => {
        setCustomQuestions(customQuestions.filter((_, i) => i !== index));
    };

    const duplicateCustomQuestion = (index: number) => {
        const questionToDuplicate = customQuestions[index];
        const newQuestion = {
            ...questionToDuplicate,
            question: questionToDuplicate.question + ' (másolat)'
        };
        setCustomQuestions([
            ...customQuestions.slice(0, index + 1),
            newQuestion,
            ...customQuestions.slice(index + 1)
        ]);
    };

    const saveCustomTask = async () => {
        if (!editableTask || customQuestions.length === 0) return;

        // Témakör validáció
        if (!editableTask.topic || editableTask.topic.trim() === '') {
            alert('Kérjük, adjon meg egy témakört a feladathoz!');
            return;
        }

        try {
            const db = (window as any).firebase.firestore();

            // Save custom questions to the existing task
            const updatedTask = {
                ...editableTask,
                customQuestions: customQuestions,
                questions: customQuestions.length
            };

            // Update the task in the local state
            setExamTasks(prev => prev.map(task =>
                task.id === editableTask.id ? updatedTask : task
            ));

            // Save assigned tasks to Firebase for all users
            const assignedTaskData = {
                taskId: editableTask.id,
                title: editableTask.title,
                description: editableTask.description,
                topicId: editableTask.topic.toLowerCase().replace(/\s+/g, '-'),
                topicTitle: editableTask.topic,
                customQuestions: customQuestions,
                questions: customQuestions.length,
                difficulty: editableTask.difficulty,
                timeLimit: editableTask.timeLimit,
                createdAt: (window as any).firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: currentUser?.email
            };

            // Save to customTasks collection for game loading
            const customTaskData = {
                id: editableTask.id,
                title: editableTask.title,
                description: editableTask.description,
                topic: editableTask.topic,
                educationLevel: editableTask.educationLevel || quizLevel,
                difficulty: editableTask.difficulty,
                questions: customQuestions.length,
                timeLimit: editableTask.timeLimit,
                customQuestions: customQuestions,
                createdAt: (window as any).firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: currentUser?.email
            };

            // Check if task already exists in customTasks
            const existingTask = await db.collection('customTasks')
                .where('id', '==', editableTask.id)
                .get();

            if (existingTask.empty) {
                // Create new custom task
                await db.collection('customTasks').add(customTaskData);
            } else {
                // Update existing custom task
                const taskDoc = existingTask.docs[0];
                await taskDoc.ref.update({
                    title: editableTask.title,
                    description: editableTask.description,
                    topic: editableTask.topic,
                    educationLevel: editableTask.educationLevel || quizLevel,
                    difficulty: editableTask.difficulty,
                    questions: customQuestions.length,
                    timeLimit: editableTask.timeLimit,
                    customQuestions: customQuestions,
                    updatedAt: (window as any).firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // Save to assignedTasks collection for all users
            await db.collection('assignedTasks').add(assignedTaskData);

            setShowTaskEditor(false);
            setEditingTask(null);
            setEditableTask(null);
            setCustomQuestions([]);
            alert('Egyedi feladatok sikeresen mentve! A játék most már ezeket a feladatokat fogja használni.');
        } catch (error) {
            console.error('Error saving custom task:', error);
            alert('Hiba az egyedi feladatok mentése során');
        }
    };

    const deleteTask = async (taskId: string) => {
        if (!confirm('Biztosan törölni szeretnéd ezt a feladatot? Ez a művelet nem vonható vissza!')) {
            return;
        }

        try {
            const db = (window as any).firebase.firestore();

            // Delete from customTasks collection
            const customTasksSnapshot = await db.collection('customTasks')
                .where('id', '==', taskId)
                .get();

            customTasksSnapshot.forEach(async (doc: any) => {
                await doc.ref.delete();
            });

            // Remove from local state
            setExamTasks(prev => prev.filter(task => task.id !== taskId));

            // Remove from selected tasks if it was selected
            setSelectedTasks(prev => prev.filter(id => id !== taskId));

            alert('Feladat sikeresen törölve!');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Hiba a feladat törlése során');
        }
    };

    const addNewTask = async () => {
        if (!newTask.title.trim() || !newTask.description.trim()) return;

        // Témakör validáció
        if (!newTask.topic || newTask.topic.trim() === '') {
            alert('Kérjük, adjon meg egy témakört az új feladathoz!');
            return;
        }

        const taskId = `task_${Date.now()}`;
        const newTaskData: ExamTask = {
            id: taskId,
            title: newTask.title,
            description: newTask.description,
            topic: newTask.topic || 'Általános',
            educationLevel: newTask.educationLevel || quizLevel,
            difficulty: newTask.difficulty,
            questions: newTask.questions,
            timeLimit: newTask.timeLimit
        };

        setExamTasks([...examTasks, newTaskData]);

        // Save to customTasks collection for game loading
        try {
            const db = (window as any).firebase.firestore();

            const customTaskData = {
                id: taskId,
                title: newTask.title,
                description: newTask.description,
                topic: newTask.topic || 'Általános',
                educationLevel: newTask.educationLevel || quizLevel,
                difficulty: newTask.difficulty,
                questions: newTask.questions,
                timeLimit: newTask.timeLimit,
                customQuestions: [], // Empty initially, can be added later
                createdAt: (window as any).firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: currentUser?.email
            };

            await db.collection('customTasks').add(customTaskData);
        } catch (error) {
            console.error('Error saving new task to customTasks:', error);
        }

        // Form reset
        setNewTask({
            title: '',
            description: '',
            topic: '',
            educationLevel: quizLevel,
            difficulty: 'medium',
            questions: 10,
            timeLimit: 30
        });
        setShowNewTaskForm(false);
    };

    const toggleNewTaskForm = () => {
        setShowNewTaskForm(!showNewTaskForm);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#39ff14';
            case 'medium': return '#ffbb55';
            case 'hard': return '#ff6b9d';
            default: return '#39ff14';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Könnyű';
            case 'medium': return 'Közepes';
            case 'hard': return 'Nehéz';
            default: return 'Könnyű';
        }
    };

    if (loading) {
        return (
            <div className="exam-prep-container">
                <div className="loading">Betöltés...</div>
            </div>
        );
    }

    if (error && !isAdmin) {
        return (
            <div className="exam-prep-container">
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
                        Csak adminisztrátorok férhetnek hozzá ehhez az oldalhoz.<br />
                        Jelenlegi felhasználó: {currentUser?.email || 'Ismeretlen'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>🚀 UniBoost - Mihaszna Matek</title>
                <meta name="description" content="Tanuló-feladat kiosztás és követés" />
            </Head>

            <div className="exam-prep-container">
                <div className="exam-prep-header">
                    <h1 className="exam-prep-title">
                        🚀 UniBoost
                    </h1>
                    <p className="exam-prep-subtitle">
                        Egyetemi matematikai feladatok
                    </p>
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
                            boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
                        }}>
                            👑 ADMIN MODE - {currentUser?.email}
                        </div>
                    )}
                </div>

                <div className="exam-prep-content">
                    {!showGameInterface ? (
                        <>
                            {/* Students Section */}
                            <section className="students-section">
                                <h2 className="section-title">👥 Tanulók</h2>
                                <div className="students-grid">
                                    {students.map(student => (
                                        <div
                                            key={student.id}
                                            className="student-card"
                                            onClick={() => openGameInterface(student)}
                                        >
                                            <div className="student-info">
                                                <h3 className="student-name">{student.name}</h3>
                                                <p className="student-email">{student.email}</p>
                                                <p className="student-grade">Osztály: {student.grade}</p>
                                            </div>
                                            <div className="student-stats">
                                                <div className="stat">
                                                    <span className="stat-label">Kiosztott</span>
                                                    <span className="stat-value">{student.assignedTasks.length}</span>
                                                </div>
                                                <div className="stat">
                                                    <span className="stat-label">Elkészült</span>
                                                    <span className="stat-value">{student.completedTasks.length}</span>
                                                </div>
                                                <div className="stat">
                                                    <span className="stat-label">Haladás</span>
                                                    <span className="stat-value">{student.progress}%</span>
                                                </div>
                                            </div>
                                            <div className="student-action">
                                                <span className="action-text">Kattints a feladat kiosztásához</span>
                                                <i className="action-arrow">→</i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : (
                        <>
                            {/* Game Interface for Task Assignment */}
                            <div className="game-interface">
                                <div className="game-header">
                                    <button
                                        className="back-btn"
                                        onClick={() => {
                                            setShowGameInterface(false);
                                            setSelectedStudent(null);
                                            setSelectedTasks([]);
                                        }}
                                    >
                                        ← Vissza a tanulókhoz
                                    </button>
                                    <h2 className="game-title">🎮 Feladat Kiosztás</h2>
                                    <h3 className="student-name">{selectedStudent?.name}</h3>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    marginBottom: '1.5rem'
                                }}>
                                    {([
                                        { id: 'elementary', label: '🏫 Általános' },
                                        { id: 'highschool', label: '🎒 Gimnázium' },
                                        { id: 'university', label: '🎓 Egyetem' },
                                    ] as const).map(level => (
                                        <button
                                            key={level.id}
                                            type="button"
                                            onClick={() => {
                                                setQuizLevel(level.id);
                                                setSelectedTasks([]);
                                                setNewTask(prev => ({ ...prev, educationLevel: level.id }));
                                            }}
                                            style={{
                                                padding: '0.65rem 1.25rem',
                                                borderRadius: '12px',
                                                border: quizLevel === level.id ? '2px solid #39ff14' : '2px solid rgba(255,255,255,0.2)',
                                                background: quizLevel === level.id ? 'rgba(57,255,20,0.2)' : 'rgba(255,255,255,0.05)',
                                                color: '#fff',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {level.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="task-assignment-grid">
                                    {filteredExamTasks.length === 0 && (
                                        <p style={{ color: '#a0a0a0', textAlign: 'center', gridColumn: '1 / -1' }}>
                                            Nincs még kvíz ezen a szinten. Hozz létre újat lent!
                                        </p>
                                    )}
                                    {filteredExamTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className={`task-card ${selectedTasks.includes(task.id) ? 'selected' : ''}`}
                                            onClick={() => selectTask(task.id)}
                                        >
                                            <div className="task-header">
                                                <h3 className="task-title">{task.title}</h3>
                                                <span
                                                    className="task-difficulty"
                                                    style={{ color: getDifficultyColor(task.difficulty) }}
                                                >
                                                    {getDifficultyText(task.difficulty)}
                                                </span>
                                            </div>
                                            <p className="task-description">{task.description}</p>
                                            <div className="task-meta">
                                                <span className="task-topic">📖 {task.topic}</span>
                                                <span className="task-questions">❓ {task.questions} feladat</span>
                                                <span className="task-time">⏱️ {task.timeLimit} perc</span>
                                            </div>

                                            {/* Custom Questions Indicator */}
                                            {task.customQuestions && task.customQuestions.length > 0 && (
                                                <div className="custom-questions-indicator">
                                                    <span className="indicator-text">
                                                        📝 {task.customQuestions.length} egyedi feladat
                                                    </span>
                                                </div>
                                            )}
                                            <div className="task-actions">
                                                <button
                                                    className="details-task-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openTaskDetails(task);
                                                    }}
                                                >
                                                    📖 Részletek
                                                </button>
                                                <button
                                                    className="edit-task-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openTaskEditor(task);
                                                    }}
                                                >
                                                    ✏️ Szerkesztés
                                                </button>
                                                <button
                                                    className="delete-task-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteTask(task.id);
                                                    }}
                                                >
                                                    🗑️ Törlés
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Új feladat hozzáadás gomb */}
                                    <div className="add-task-card" onClick={toggleNewTaskForm}>
                                        <div className="add-task-content">
                                            <div className="add-task-icon">➕</div>
                                            <div className="add-task-text">Új Feladat</div>
                                        </div>
                                    </div>

                                    {/* Új feladat form */}
                                    {showNewTaskForm && (
                                        <div className="new-task-form">
                                            <div className="form-header">
                                                <h3>Új Feladat Létrehozása</h3>
                                                <button className="close-form-btn" onClick={toggleNewTaskForm}>✕</button>
                                            </div>
                                            <div className="form-content">
                                                <div className="form-group">
                                                    <label>Feladat címe:</label>
                                                    <input
                                                        type="text"
                                                        value={newTask.title}
                                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                        placeholder="pl. Másodfokú egyenletek"
                                                        className="task-input"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Leírás:</label>
                                                    <textarea
                                                        value={newTask.description}
                                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                        placeholder="pl. Megoldás, diszkrimináns, gyökök számítása"
                                                        className="task-textarea"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Oktatási szint:</label>
                                                    <select
                                                        value={newTask.educationLevel}
                                                        onChange={(e) => setNewTask({
                                                            ...newTask,
                                                            educationLevel: e.target.value as 'elementary' | 'highschool' | 'university'
                                                        })}
                                                        className="task-select"
                                                    >
                                                        <option value="elementary">Általános iskola</option>
                                                        <option value="highschool">Gimnázium / középiskola</option>
                                                        <option value="university">Egyetem</option>
                                                    </select>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Témakör: <span style={{ color: '#ff6b6b' }}>*</span></label>
                                                        <select
                                                            value={newTask.topic}
                                                            onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
                                                            className="task-select"
                                                            required
                                                        >
                                                            <option value="">Válassz témakört *</option>
                                                            <option value="Algebra">Algebra</option>
                                                            <option value="Analízis">Analízis</option>
                                                            <option value="Geometria">Geometria</option>
                                                            <option value="Trigonometria">Trigonometria</option>
                                                            <option value="Valószínűségszámítás">Valószínűségszámítás</option>
                                                            <option value="Emelt szint">Emelt szint</option>
                                                            <option value="Másodfokú egyenletek">Másodfokú egyenletek</option>
                                                            <option value="Deriválás alapjai">Deriválás alapjai</option>
                                                            <option value="Integrálás">Integrálás</option>
                                                            <option value="Síkgeometria">Síkgeometria</option>
                                                            <option value="Folytonos valószínűségi változók">Folytonos valószínűségi változók</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Nehézség:</label>
                                                        <select
                                                            value={newTask.difficulty}
                                                            onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                                                            className="task-select"
                                                        >
                                                            <option value="easy">Könnyű</option>
                                                            <option value="medium">Közepes</option>
                                                            <option value="hard">Nehéz</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Feladatok száma:</label>
                                                        <input
                                                            type="number"
                                                            value={newTask.questions}
                                                            onChange={(e) => setNewTask({ ...newTask, questions: parseInt(e.target.value) || 10 })}
                                                            className="task-input"
                                                            min={1}
                                                            max={50}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Időlimit (perc):</label>
                                                        <input
                                                            type="number"
                                                            value={newTask.timeLimit}
                                                            onChange={(e) => setNewTask({ ...newTask, timeLimit: parseInt(e.target.value) || 30 })}
                                                            className="task-input"
                                                            min={5}
                                                            max={120}
                                                        />
                                                    </div>
                                                </div>
                                                <button className="create-task-btn" onClick={addNewTask}>
                                                    Feladat Létrehozása
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="assignment-actions">
                                    <div className="selected-info">
                                        <span>Tanuló: {selectedStudent?.name}</span>
                                        {selectedTasks.length > 0 && (
                                            <span className="selected-task-info">
                                                Kiválasztott feladat: {examTasks.find(task => task.id === selectedTasks[0])?.title}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                                        <button
                                            className="assign-btn"
                                            onClick={assignOnlyToStudent}
                                            disabled={selectedTasks.length === 0 || !selectedStudent}
                                            style={{ background: "linear-gradient(135deg, #39ff14, #2ecc71)" }}
                                        >
                                            📬 Feladat kiosztása
                                        </button>
                                        <button
                                            className="assign-btn"
                                            onClick={startGameForStudent}
                                            disabled={selectedTasks.length === 0 || !selectedStudent}
                                        >
                                            🎮 Kiosztás + Játék
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Task Details Modal */}
                    {showTaskDetails && selectedTaskForDetails && (
                        <div className="task-details-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="header-left">
                                        <h2>📚 {selectedTaskForDetails.title}</h2>
                                        <h3>{selectedTaskForDetails.topic}</h3>
                                    </div>
                                    <div className="header-actions">
                                        <button
                                            className="edit-task-btn"
                                            onClick={() => {
                                                setShowTaskDetails(false);
                                                openTaskEditor(selectedTaskForDetails);
                                            }}
                                        >
                                            ✏️ Szerkesztés
                                        </button>
                                        <button
                                            className="close-btn"
                                            onClick={() => setShowTaskDetails(false)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="task-details-content">
                                    <div className="task-info-section">
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <label>📖 Témakör:</label>
                                                <span>{selectedTaskForDetails.topic}</span>
                                            </div>
                                            <div className="info-item">
                                                <label>📝 Feladatok száma:</label>
                                                <span>{selectedTaskForDetails.questions}</span>
                                            </div>
                                            <div className="info-item">
                                                <label>⏱️ Időtartam:</label>
                                                <span>{selectedTaskForDetails.timeLimit} perc</span>
                                            </div>
                                            <div className="info-item">
                                                <label>🎯 Nehézség:</label>
                                                <span style={{ color: getDifficultyColor(selectedTaskForDetails.difficulty) }}>
                                                    {getDifficultyText(selectedTaskForDetails.difficulty)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="description-section">
                                            <label>📄 Leírás:</label>
                                            <p>{selectedTaskForDetails.description}</p>
                                        </div>
                                    </div>

                                    {selectedTaskForDetails.customQuestions && selectedTaskForDetails.customQuestions.length > 0 && (
                                        <div className="custom-questions-section">
                                            <h3>📝 Egyedi Feladatok ({selectedTaskForDetails.customQuestions.length})</h3>
                                            <div className="questions-list">
                                                {selectedTaskForDetails.customQuestions.map((question, index) => (
                                                    <div key={index} className="question-item">
                                                        <div className="question-header">
                                                            <span className="question-number">{index + 1}.</span>
                                                            <span className="question-type">{question.type}</span>
                                                        </div>
                                                        <div className="question-text">{question.question}</div>
                                                        <div className="question-answer">
                                                            <strong>Válasz:</strong> {question.answer}
                                                        </div>
                                                        {question.expression && (
                                                            <div className="question-expression">
                                                                <strong>Megoldás:</strong> {question.expression}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(!selectedTaskForDetails.customQuestions || selectedTaskForDetails.customQuestions.length === 0) && (
                                        <div className="no-custom-questions">
                                            <p>📝 Még nincsenek egyedi feladatok hozzáadva ehhez a témakörhöz.</p>
                                            <button
                                                className="add-questions-btn"
                                                onClick={() => {
                                                    setShowTaskDetails(false);
                                                    openTaskEditor(selectedTaskForDetails);
                                                }}
                                            >
                                                ➕ Feladatok Hozzáadása
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task Editor Modal */}
                    {showTaskEditor && editingTask && (
                        <div className="task-editor-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="header-left">
                                        <h2>✏️ Feladat Szerkesztése</h2>
                                        <h3>{editingTask.title}</h3>
                                    </div>
                                    <div className="header-actions">
                                        <button
                                            className="delete-modal-btn"
                                            onClick={() => {
                                                if (confirm('Biztosan törölni szeretnéd ezt a feladatot?')) {
                                                    deleteTask(editingTask.id);
                                                    setShowTaskEditor(false);
                                                    setEditingTask(null);
                                                    setEditableTask(null);
                                                    setCustomQuestions([]);
                                                }
                                            }}
                                        >
                                            🗑️
                                        </button>
                                        <button
                                            className="close-btn"
                                            onClick={() => {
                                                setShowTaskEditor(false);
                                                setEditingTask(null);
                                                setEditableTask(null);
                                                setCustomQuestions([]);
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="editor-content">
                                    <div className="task-info">
                                        <div className="info-item">
                                            <label>Cím:</label>
                                            <input
                                                type="text"
                                                value={editableTask?.title || ''}
                                                onChange={(e) => updateEditableTask('title', e.target.value)}
                                                className="editable-field"
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>Leírás:</label>
                                            <input
                                                type="text"
                                                value={editableTask?.description || ''}
                                                onChange={(e) => updateEditableTask('description', e.target.value)}
                                                className="editable-field"
                                            />
                                        </div>
                                        <div className="info-item">
                                            <label>Témakör: <span style={{ color: '#ff6b6b' }}>*</span></label>
                                            <select
                                                value={editableTask?.topic || ''}
                                                onChange={(e) => updateEditableTask('topic', e.target.value)}
                                                className="editable-field"
                                                required
                                            >
                                                <option value="">Válassz témakört *</option>
                                                <option value="Algebra">Algebra</option>
                                                <option value="Analízis">Analízis</option>
                                                <option value="Trigonometria">Trigonometria</option>
                                                <option value="Geometria">Geometria</option>
                                                <option value="Valószínűségszámítás">Valószínűségszámítás</option>
                                                <option value="Emelt szint">Emelt szint</option>
                                                <option value="Másodfokú egyenletek">Másodfokú egyenletek</option>
                                                <option value="Deriválás alapjai">Deriválás alapjai</option>
                                                <option value="Integrálás">Integrálás</option>
                                                <option value="Síkgeometria">Síkgeometria</option>
                                                <option value="Folytonos valószínűségi változók">Folytonos valószínűségi változók</option>
                                                <option value="Programozás">Programozás</option>
                                                <option value="Emelt szint">Emelt szint</option>
                                                <option value="Általános">Általános</option>
                                            </select>
                                        </div>
                                        <div className="info-item">
                                            <label>Nehézség:</label>
                                            <select
                                                value={editableTask?.difficulty || 'medium'}
                                                onChange={(e) => updateEditableTask('difficulty', e.target.value)}
                                                className="editable-field"
                                            >
                                                <option value="easy">Könnyű</option>
                                                <option value="medium">Közepes</option>
                                                <option value="hard">Nehéz</option>
                                            </select>
                                        </div>
                                        <div className="info-item">
                                            <label>Időtartam (perc):</label>
                                            <input
                                                type="number"
                                                value={editableTask?.timeLimit || 30}
                                                onChange={(e) => updateEditableTask('timeLimit', parseInt(e.target.value) || 30)}
                                                className="editable-field"
                                                min="5"
                                                max="180"
                                            />
                                        </div>
                                    </div>

                                    <div className="questions-section">
                                        <div className="section-header">
                                            <h4>📝 Egyedi Feladatok</h4>
                                            <button className="add-question-btn" onClick={addCustomQuestion}>
                                                ➕ Új Feladat
                                            </button>
                                        </div>

                                        {customQuestions.length === 0 && (
                                            <div className="no-questions-message">
                                                <p>📝 Még nincsenek egyedi feladatok hozzáadva.</p>
                                                <p>Kattints a "➕ Új Feladat" gombra a hozzáadáshoz!</p>
                                            </div>
                                        )}

                                        <div className="questions-list">
                                            {customQuestions.map((question, index) => (
                                                <div key={index} className="question-editor">
                                                    <div className="question-header">
                                                        <span className="question-number">Feladat {index + 1}</span>
                                                        <div className="question-actions">
                                                            <button
                                                                className="duplicate-question-btn"
                                                                onClick={() => duplicateCustomQuestion(index)}
                                                                title="Feladat duplikálása"
                                                            >
                                                                📋
                                                            </button>
                                                            <button
                                                                className="remove-question-btn"
                                                                onClick={() => removeCustomQuestion(index)}
                                                                title="Feladat törlése"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="question-fields">
                                                        <div className="field-group">
                                                            <label>Feladat szövege:</label>
                                                            <textarea
                                                                value={question.question}
                                                                onChange={(e) => updateCustomQuestion(index, 'question', e.target.value)}
                                                                placeholder="Írd ide a feladat szövegét..."
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <div className="field-group">
                                                            <label>Al-témakör (opcionális):</label>
                                                            <select
                                                                value={question.subtopic || ''}
                                                                onChange={(e) => updateCustomQuestion(index, 'subtopic', e.target.value)}
                                                                className="task-select"
                                                            >
                                                                <option value="">Nincs al-témakör</option>
                                                                <option value="Másodfokú egyenletek">Másodfokú egyenletek</option>
                                                                <option value="Deriválás alapjai">Deriválás alapjai</option>
                                                                <option value="Integrálás">Integrálás</option>
                                                                <option value="Síkgeometria">Síkgeometria</option>
                                                                <option value="Folytonos valószínűségi változók">Folytonos valószínűségi változók</option>
                                                            </select>
                                                        </div>
                                                        <div className="field-group">
                                                            <label>Helyes válasz:</label>
                                                            <input
                                                                type="number"
                                                                value={question.answer}
                                                                onChange={(e) => updateCustomQuestion(index, 'answer', parseFloat(e.target.value) || 0)}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div className="field-group">
                                                            <label>Megoldás lépései:</label>
                                                            <textarea
                                                                value={question.expression}
                                                                onChange={(e) => updateCustomQuestion(index, 'expression', e.target.value)}
                                                                placeholder="Írd ide a megoldás lépéseit..."
                                                                rows={2}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="save-btn"
                                        onClick={saveCustomTask}
                                        disabled={customQuestions.length === 0}
                                    >
                                        💾 Mentés
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => {
                                            setShowTaskEditor(false);
                                            setEditingTask(null);
                                            setEditableTask(null);
                                            setCustomQuestions([]);
                                        }}
                                    >
                                        ❌ Mégse
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .exam-prep-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                    color: #fff;
                    padding: 2rem;
                    font-family: 'Poppins', sans-serif;
                }

                .exam-prep-header {
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

                .exam-prep-title {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #39ff14;
                    text-shadow: 0 0 20px rgba(57, 255, 20, 0.6);
                    margin-bottom: 1rem;
                    animation: neonGlow 2s ease-in-out infinite alternate;
                }

                .exam-prep-subtitle {
                    font-size: 1.2rem;
                    color: #ff6b9d;
                    text-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
                }

                .exam-prep-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .section-title {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #39ff14;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .students-grid, .tasks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }

                .student-card, .task-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .student-card:hover, .task-card:hover {
                    border-color: #39ff14;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
                    transform: translateY(-5px);
                }

                .student-card.selected {
                    border-color: #ff6b9d;
                    background: rgba(255, 107, 157, 0.1);
                    box-shadow: 0 0 25px rgba(255, 107, 157, 0.3);
                }

                .task-card.selected {
                    border-color: #39ff14;
                    background: rgba(57, 255, 20, 0.1);
                    box-shadow: 0 0 25px rgba(57, 255, 20, 0.3);
                    transform: scale(1.02);
                }

                .task-card {
                    cursor: pointer;
                    position: relative;
                }


                .student-action {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .action-text {
                    color: #39ff14;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .action-arrow {
                    color: #39ff14;
                    font-size: 1.2rem;
                    transition: transform 0.3s ease;
                }

                .student-card:hover .action-arrow {
                    transform: translateX(5px);
                }

                .game-interface {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .game-title {
                    font-size: 2rem;
                    color: #39ff14;
                    margin-bottom: 1rem;
                }

                .student-info-badge {
                    background: rgba(57, 255, 20, 0.1);
                    border: 2px solid #39ff14;
                    border-radius: 15px;
                    padding: 0.8rem 1.5rem;
                    margin: 1rem 0;
                    text-align: center;
                }

                .badge-text {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-shadow: 0 0 8px rgba(57, 255, 20, 0.5);
                }

                .task-assignment-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .assignment-actions {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    border-radius: 20px;
                    padding: 2rem;
                    text-align: center;
                }

                .selected-info {
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                    color: #39ff14;
                    font-weight: 600;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .selected-task-info {
                    font-size: 1rem;
                    color: #ff6b9d;
                    font-weight: 500;
                }

                .task-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .details-task-btn, .edit-task-btn, .delete-task-btn {
                    flex: 1;
                    padding: 0.8rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                }

                .details-task-btn {
                    background: rgba(57, 255, 20, 0.1);
                    border: 2px solid #39ff14;
                    color: #39ff14;
                }

                .details-task-btn:hover {
                    background: rgba(57, 255, 20, 0.2);
                    box-shadow: 0 0 15px rgba(57, 255, 20, 0.4);
                }

                .edit-task-btn {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    color: #ff6b9d;
                }

                .edit-task-btn:hover {
                    background: rgba(255, 107, 157, 0.2);
                    box-shadow: 0 0 15px rgba(255, 107, 157, 0.4);
                }

                .delete-task-btn {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    color: #ff6b9d;
                }

                .delete-task-btn:hover {
                    background: rgba(255, 107, 157, 0.2);
                    box-shadow: 0 0 15px rgba(255, 107, 157, 0.4);
                    transform: scale(1.05);
                }

                .task-editor-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                }

                .modal-content {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                    border: 2px solid #39ff14;
                    border-radius: 20px;
                    padding: 2rem;
                    max-width: 800px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid rgba(57, 255, 20, 0.3);
                    padding-bottom: 1rem;
                }

                .header-left h2 {
                    color: #39ff14;
                    font-size: 1.8rem;
                    margin: 0;
                }

                .header-left h3 {
                    color: #ff6b9d;
                    font-size: 1.2rem;
                    margin: 0.5rem 0 0 0;
                }

                .header-actions {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .close-btn {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    color: #ff6b9d;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn:hover {
                    background: rgba(255, 107, 157, 0.2);
                }

                .delete-modal-btn {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    color: #ff6b9d;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .delete-modal-btn:hover {
                    background: rgba(255, 107, 157, 0.2);
                    transform: scale(1.1);
                }

                .task-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .info-item label {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .info-item span {
                    color: #fff;
                }

                .editable-field {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(57, 255, 20, 0.3);
                    border-radius: 8px;
                    padding: 0.8rem;
                    color: #fff;
                    font-size: 1rem;
                    font-family: inherit;
                    width: 100%;
                }

                .editable-field:focus {
                    outline: none;
                    border-color: #39ff14;
                    box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
                }

                .editable-field option {
                    background: #1a1a2e;
                    color: #fff;
                }

                .questions-section {
                    margin-bottom: 2rem;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .section-header h4 {
                    color: #39ff14;
                    font-size: 1.3rem;
                    margin: 0;
                }

                .add-question-btn {
                    background: linear-gradient(45deg, #ff6b9d, #39ff14);
                    color: #000;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .add-question-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px rgba(255, 107, 157, 0.6);
                }

                .questions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .question-editor {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(57, 255, 20, 0.3);
                    border-radius: 15px;
                    padding: 1.5rem;
                }

                .question-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .question-number {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .question-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .duplicate-question-btn {
                    background: rgba(255, 165, 2, 0.1);
                    border: 1px solid #ffa502;
                    color: #ffa502;
                    padding: 0.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .duplicate-question-btn:hover {
                    background: rgba(255, 165, 2, 0.2);
                    transform: scale(1.05);
                }

                .remove-question-btn {
                    background: rgba(255, 107, 157, 0.1);
                    border: 1px solid #ff6b9d;
                    color: #ff6b9d;
                    padding: 0.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .remove-question-btn:hover {
                    background: rgba(255, 107, 157, 0.2);
                    transform: scale(1.05);
                }

                .question-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .field-group label {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .field-group input, .field-group textarea {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(57, 255, 20, 0.3);
                    border-radius: 8px;
                    padding: 0.8rem;
                    color: #fff;
                    font-size: 1rem;
                    font-family: inherit;
                }

                .field-group input:focus, .field-group textarea:focus {
                    outline: none;
                    border-color: #39ff14;
                    box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
                }

                .field-group textarea {
                    resize: vertical;
                    min-height: 60px;
                }

                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(57, 255, 20, 0.3);
                }

                .save-btn, .cancel-btn {
                    padding: 1rem 2rem;
                    border-radius: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .save-btn {
                    background: linear-gradient(45deg, #ff6b9d, #39ff14);
                    color: #000;
                    border: none;
                }

                .save-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px rgba(255, 107, 157, 0.6);
                }

                .save-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .cancel-btn {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    color: #ff6b9d;
                }

                .cancel-btn:hover {
                    background: rgba(255, 107, 157, 0.2);
                }

                .student-name, .task-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #39ff14;
                    margin-bottom: 0.5rem;
                }

                .student-email, .task-description {
                    color: #ccc;
                    margin-bottom: 0.5rem;
                }

                .student-grade {
                    color: #ff6b9d;
                    font-weight: 500;
                }

                .student-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                }

                .stat {
                    text-align: center;
                }

                .stat-label {
                    display: block;
                    font-size: 0.8rem;
                    color: #999;
                }

                .stat-value {
                    display: block;
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #39ff14;
                }

                .task-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .task-difficulty {
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.3rem 0.8rem;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .task-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    color: #fff !important;
                }

                .task-meta span {
                    color: #fff !important;
                }

                .custom-questions-indicator {
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: rgba(57, 255, 20, 0.1);
                    border: 1px solid rgba(57, 255, 20, 0.3);
                    border-radius: 20px;
                    text-align: center;
                }

                .indicator-text {
                    color: #39ff14;
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-shadow: 0 0 8px rgba(57, 255, 20, 0.5);
                }

                .task-details-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                }

                .task-details-content {
                    max-height: 80vh;
                    overflow-y: auto;
                    padding: 1rem;
                }

                .task-info-section {
                    margin-bottom: 2rem;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .info-item label {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .info-item span {
                    color: #fff;
                    font-size: 1rem;
                }

                .description-section {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .description-section label {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .description-section p {
                    color: #fff;
                    line-height: 1.6;
                }

                .custom-questions-section {
                    margin-top: 2rem;
                }

                .custom-questions-section h3 {
                    color: #39ff14;
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
                }

                .question-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border-left: 4px solid #39ff14;
                }

                .question-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.8rem;
                }

                .question-number {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 1rem;
                }

                .question-type {
                    color: #ff6b9d;
                    font-size: 0.8rem;
                    background: rgba(255, 107, 157, 0.1);
                    padding: 0.3rem 0.8rem;
                    border-radius: 15px;
                    border: 1px solid rgba(255, 107, 157, 0.3);
                }

                .question-text {
                    color: #fff;
                    font-size: 1rem;
                    line-height: 1.5;
                    margin-bottom: 0.8rem;
                }

                .question-answer, .question-expression {
                    color: #fff;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }

                .question-answer strong, .question-expression strong {
                    color: #39ff14;
                }

                .no-custom-questions {
                    text-align: center;
                    padding: 2rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    border: 2px dashed rgba(255, 255, 255, 0.2);
                }

                .no-custom-questions p {
                    color: #fff;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                }

                .add-questions-btn {
                    background: linear-gradient(135deg, #39ff14, #00ff88);
                    color: #000;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(57, 255, 20, 0.3);
                }

                .add-questions-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(57, 255, 20, 0.4);
                }

                .no-questions-message {
                    text-align: center;
                    padding: 2rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    border: 2px dashed rgba(255, 255, 255, 0.2);
                    margin: 1rem 0;
                }

                .no-questions-message p {
                    color: #fff;
                    margin-bottom: 0.5rem;
                    font-size: 1rem;
                }

                .no-questions-message p:last-child {
                    color: #39ff14;
                    font-weight: 600;
                }

                .assignment-section {
                    margin-top: 3rem;
                }

                .assignment-card {
                    background: rgba(255, 107, 157, 0.1);
                    border: 2px solid #ff6b9d;
                    border-radius: 20px;
                    padding: 2rem;
                    text-align: center;
                }

                .assignment-info h3 {
                    color: #39ff14;
                    margin-bottom: 1rem;
                }

                .assignment-info p {
                    color: #ff6b9d;
                    margin-bottom: 2rem;
                }

                .assign-btn {
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

                .assign-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 0 25px rgba(255, 107, 157, 0.6);
                }

                .assign-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .loading {
                    text-align: center;
                    font-size: 1.5rem;
                    color: #39ff14;
                    margin-top: 5rem;
                }

                @keyframes neonGlow {
                    0% { text-shadow: 0 0 20px rgba(57, 255, 20, 0.6); }
                    100% { text-shadow: 0 0 30px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.4); }
                }

                @media (max-width: 768px) {
                    .exam-prep-container {
                        padding: 1rem;
                    }
                    
                    .exam-prep-title {
                        font-size: 2rem;
                    }
                    
                    .students-grid, .tasks-grid {
                        grid-template-columns: 1fr;
                    }
                }

                /* Új feladat hozzáadás gomb */
                .add-task-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(57, 255, 20, 0.3);
                    border-radius: 20px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                }

                .add-task-card:hover {
                    border-color: rgba(57, 255, 20, 0.8);
                    box-shadow: 0 0 30px rgba(57, 255, 20, 0.3);
                    transform: translateY(-5px);
                }

                .add-task-content {
                    text-align: center;
                    color: #39ff14;
                }

                .add-task-icon {
                    font-size: 3rem;
                    margin-bottom: 10px;
                    filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.8));
                }

                .add-task-text {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #39ff14;
                    text-shadow: 0 0 15px rgba(57, 255, 20, 1);
                    filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.8));
                }

                /* Új feladat form */
                .new-task-form {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(57, 255, 20, 0.5);
                    border-radius: 20px;
                    padding: 25px;
                    margin-top: 20px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 0 30px rgba(57, 255, 20, 0.2);
                    grid-column: 1 / -1;
                }

                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(57, 255, 20, 0.3);
                }

                .form-header h3 {
                    color: #39ff14;
                    font-size: 1.3rem;
                    font-weight: 600;
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.8);
                    margin: 0;
                }

                .close-form-btn {
                    background: rgba(255, 107, 107, 0.2);
                    border: 1px solid rgba(255, 107, 107, 0.5);
                    color: #ff6b6b;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .close-form-btn:hover {
                    background: rgba(255, 107, 107, 0.3);
                    border-color: rgba(255, 107, 107, 0.8);
                    box-shadow: 0 0 15px rgba(255, 107, 107, 0.4);
                }

                .form-content {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-shadow: 0 0 5px rgba(57, 255, 20, 0.6);
                }

                .task-input, .task-textarea, .task-select {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(57, 255, 20, 0.3);
                    border-radius: 10px;
                    padding: 12px 15px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    font-family: inherit;
                }

                .task-input:focus, .task-textarea:focus, .task-select:focus {
                    outline: none;
                    border-color: rgba(57, 255, 20, 0.8);
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
                }

                .task-input::placeholder, .task-textarea::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .task-textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .task-select option {
                    background: #1a1a2e;
                    color: white;
                }

                .create-task-btn {
                    background: linear-gradient(45deg, #39ff14, #ff49db);
                    border: none;
                    border-radius: 15px;
                    padding: 15px 25px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }

                .create-task-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(57, 255, 20, 0.4);
                }

                .create-task-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .add-task-card {
                        min-height: 150px;
                        padding: 20px;
                    }
                    
                    .add-task-icon {
                        font-size: 2.5rem;
                    }
                    
                    .add-task-text {
                        font-size: 1rem;
                        color: #39ff14;
                        text-shadow: 0 0 15px rgba(57, 255, 20, 1);
                        filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.8));
                    }
                    
                    .new-task-form {
                        padding: 20px;
                    }
                    
                    .form-header h3 {
                        font-size: 1.1rem;
                    }
                }
            `}</style>
        </>
    );
}
