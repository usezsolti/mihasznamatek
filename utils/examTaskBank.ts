/** Közös feladatkészlet — tanári konzol + (legacy) exam-prep.
 *  Alap: mathTopicsCatalog (minden iskolaszint + témakör), plusz minta + customTasks.
 */

import {
    elementaryTopics,
    erettsegiEmeltTopics,
    erettsegiKozepTopics,
    highschoolTopics,
    universitySubjects,
} from './mathTopicsCatalog';

export type ExamEducationLevel =
    | 'elementary'
    | 'highschool'
    | 'university'
    | 'erettsegi';

export type ExamTaskBankItem = {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;
    /** Valódi catalog id (játék / kiosztás). */
    topicId?: string;
    educationLevel: ExamEducationLevel;
    /** Érettségi: közép / emelt */
    erettsegiLevel?: 'kozep' | 'emelt';
    /** Egyetem: tantárgy id */
    subjectId?: string;
    questions: number;
    timeLimit: number;
    customQuestions?: Array<{
        question: string;
        answer: number;
        expression: string;
        type?: string;
        subtopic?: string;
    }>;
};

function catalogTask(
    partial: Omit<ExamTaskBankItem, 'difficulty' | 'questions' | 'timeLimit'> &
        Partial<Pick<ExamTaskBankItem, 'difficulty' | 'questions' | 'timeLimit'>>
): ExamTaskBankItem {
    return {
        difficulty: 'medium',
        questions: 10,
        timeLimit: 30,
        ...partial,
    };
}

/** Minden iskolaszint összes témaköre — kiosztáshoz. */
export function buildCatalogExamTasks(): ExamTaskBankItem[] {
    const out: ExamTaskBankItem[] = [];

    for (const t of elementaryTopics) {
        out.push(
            catalogTask({
                id: `cat-el-${t.id}`,
                title: t.title,
                description: `Általános iskola · ${t.title}`,
                topic: t.title,
                topicId: t.id,
                educationLevel: 'elementary',
                questions: 10,
                timeLimit: 25,
            })
        );
    }

    for (const t of highschoolTopics) {
        out.push(
            catalogTask({
                id: `cat-hs-${t.id}`,
                title: t.title,
                description: `Középiskola · ${t.title}`,
                topic: t.title,
                topicId: t.id,
                educationLevel: 'highschool',
                questions: 12,
                timeLimit: 35,
            })
        );
    }

    for (const t of erettsegiKozepTopics) {
        out.push(
            catalogTask({
                id: `cat-ek-${t.id}`,
                title: t.title,
                description: `Érettségi · középszint · ${t.title}`,
                topic: t.title,
                topicId: t.id,
                educationLevel: 'erettsegi',
                erettsegiLevel: 'kozep',
                difficulty: 'medium',
                questions: 12,
                timeLimit: 40,
            })
        );
    }

    for (const t of erettsegiEmeltTopics) {
        out.push(
            catalogTask({
                id: `cat-ee-${t.id}`,
                title: t.title,
                description: `Érettségi · emelt · ${t.title}`,
                topic: t.title,
                topicId: t.id,
                educationLevel: 'erettsegi',
                erettsegiLevel: 'emelt',
                difficulty: 'hard',
                questions: 15,
                timeLimit: 50,
            })
        );
    }

    for (const subject of universitySubjects) {
        for (const t of subject.topics) {
            out.push(
                catalogTask({
                    id: `cat-uni-${subject.id}-${t.id}`,
                    title: t.title,
                    description: `Egyetem · ${subject.title} · ${t.title}`,
                    topic: t.title,
                    topicId: t.id,
                    subjectId: subject.id,
                    educationLevel: 'university',
                    difficulty: 'hard',
                    questions: 12,
                    timeLimit: 45,
                })
            );
        }
    }

    return out;
}

export const SAMPLE_EXAM_TASKS: ExamTaskBankItem[] = [
    {
        id: 'hs1',
        title: 'Másodfokú egyenletek',
        description: 'Megoldás, diszkrimináns, gyökök számítása',
        difficulty: 'medium',
        topic: 'Algebra',
        topicId: 'egyenletek',
        educationLevel: 'highschool',
        questions: 10,
        timeLimit: 30,
    },
    {
        id: 'hs2',
        title: 'Trigonometria',
        description: 'Szögfüggvények, azonosságok, egyenletek',
        difficulty: 'medium',
        topic: 'Trigonometria',
        topicId: 'trigonometria',
        educationLevel: 'highschool',
        questions: 12,
        timeLimit: 35,
    },
    {
        id: 'hs3',
        title: 'Síkgeometria',
        description: 'Terület, kerület, hasonlóság',
        difficulty: 'easy',
        topic: 'Geometria',
        topicId: 'sikgeometria',
        educationLevel: 'highschool',
        questions: 8,
        timeLimit: 25,
    },
    {
        id: 'hs4',
        title: 'Függvények',
        description: 'Lineáris, másodfokú, exponenciális függvények',
        difficulty: 'medium',
        topic: 'Függvények',
        topicId: 'fuggvenyek',
        educationLevel: 'highschool',
        questions: 12,
        timeLimit: 40,
    },
    {
        id: 'hs5',
        title: 'Logaritmus',
        description: 'Logaritmus azonosságok és egyenletek',
        difficulty: 'hard',
        topic: 'Logaritmus',
        topicId: 'logaritmus',
        educationLevel: 'highschool',
        questions: 10,
        timeLimit: 45,
    },
    {
        id: 'hs6',
        title: '2025 Emelt Érettségi',
        description: 'Komplex feladatok, szöveges problémák, bizonyítások',
        difficulty: 'hard',
        topic: 'Emelt szint',
        topicId: 'bizonyitasok',
        educationLevel: 'erettsegi',
        erettsegiLevel: 'emelt',
        questions: 25,
        timeLimit: 90,
    },
    {
        id: 'hs7',
        title: 'Hatványozás és Gyökvonás',
        description: 'Hatványozás, gyökvonás és exponenciális kifejezések',
        difficulty: 'medium',
        topic: 'Algebra',
        topicId: 'egyenletek',
        educationLevel: 'highschool',
        questions: 12,
        timeLimit: 60,
    },
    {
        id: 'elementary1',
        title: 'Alapvető Műveletek',
        description: 'Összeadás, kivonás, szorzás, osztás',
        difficulty: 'easy',
        topic: 'Aritmetika',
        topicId: 'osszeadas-kivonas',
        educationLevel: 'elementary',
        questions: 10,
        timeLimit: 30,
    },
    {
        id: 'elementary2',
        title: 'Törtek',
        description: 'Törtek műveletei',
        difficulty: 'medium',
        topic: 'Törtek',
        topicId: 'tortek',
        educationLevel: 'elementary',
        questions: 12,
        timeLimit: 45,
    },
    {
        id: 'elementary3',
        title: 'Tizedes Törtek',
        description: 'Tizedes törtek műveletei és átváltása',
        difficulty: 'medium',
        topic: 'Tizedes Törtek',
        topicId: 'tortek',
        educationLevel: 'elementary',
        questions: 15,
        timeLimit: 50,
    },
    {
        id: 'elementary4',
        title: 'Szöveges Feladatok',
        description: 'Szöveges feladatok alapműveletekkel',
        difficulty: 'medium',
        topic: 'Szöveges Feladatok',
        topicId: 'osszeadas-kivonas',
        educationLevel: 'elementary',
        questions: 8,
        timeLimit: 40,
    },
    {
        id: 'elementary5',
        title: 'Geometria Alapok',
        description: 'Alakzatok, kerület, terület',
        difficulty: 'medium',
        topic: 'Geometria',
        topicId: 'geometria-alapok',
        educationLevel: 'elementary',
        questions: 10,
        timeLimit: 35,
    },
    {
        id: 'elementary6',
        title: 'Mértékegységek',
        description: 'Hosszúság, tömeg, idő átváltása',
        difficulty: 'easy',
        topic: 'Mértékegységek',
        topicId: 'szamok-100ig',
        educationLevel: 'elementary',
        questions: 12,
        timeLimit: 30,
    },
    {
        id: 'uniboost1',
        title: 'Analízis I. - Határértékek',
        description: 'Határérték és folytonosság',
        difficulty: 'hard',
        topic: 'Analízis',
        topicId: 'a1-fv-hatarertek',
        subjectId: 'analizis1',
        educationLevel: 'university',
        questions: 15,
        timeLimit: 60,
    },
    {
        id: 'uniboost2',
        title: 'Lineáris Algebra - Mátrixok',
        description: 'Mátrix műveletek, determináns, inverz',
        difficulty: 'medium',
        topic: 'Lineáris Algebra',
        topicId: 'la1-mx-muveletek',
        subjectId: 'linearis1',
        educationLevel: 'university',
        questions: 12,
        timeLimit: 45,
    },
    {
        id: 'uniboost3',
        title: 'Diszkrét Matematika - Gráfelmélet',
        description: 'Gráfok, fák, útvonalak',
        difficulty: 'hard',
        topic: 'Diszkrét Matematika',
        educationLevel: 'university',
        questions: 18,
        timeLimit: 75,
    },
    {
        id: 'uniboost4',
        title: 'Numerikus Módszerek',
        description: 'Numerikus integrálás, egyenletrendszerek',
        difficulty: 'hard',
        topic: 'Numerikus Analízis',
        educationLevel: 'university',
        questions: 20,
        timeLimit: 90,
    },
    {
        id: 'uniboost5',
        title: 'Operációkutatás',
        description: 'Lineáris programozás, szállítási probléma',
        difficulty: 'medium',
        topic: 'Operációkutatás',
        educationLevel: 'university',
        questions: 14,
        timeLimit: 60,
    },
    {
        id: 'uniboost6',
        title: 'Folytonos valószínűségi változók',
        description: 'Sűrűség, eloszlás, várható érték, szórás',
        difficulty: 'hard',
        topic: 'Valószínűségszámítás',
        educationLevel: 'university',
        questions: 16,
        timeLimit: 70,
    },
    {
        id: 'task2',
        title: 'Függvényhatárértékek',
        description: 'lim x→a, nevezetes alakok, kétoldali határérték',
        difficulty: 'hard',
        topic: 'Analízis',
        topicId: 'a1-fv-hatarertek',
        subjectId: 'analizis1',
        educationLevel: 'university',
        questions: 15,
        timeLimit: 45,
    },
    {
        id: 'task5',
        title: 'Nevezetes határértékek',
        description: 'sin x/x, (1+1/n)^n, e, ln',
        difficulty: 'hard',
        topic: 'Analízis',
        topicId: 'a1-nevezetes-lim',
        subjectId: 'analizis1',
        educationLevel: 'university',
        questions: 20,
        timeLimit: 60,
    },
];

export async function loadExamTaskBank(): Promise<ExamTaskBankItem[]> {
    const firebase = typeof window !== 'undefined' ? (window as any).firebase : null;
    const custom: ExamTaskBankItem[] = [];
    if (firebase?.firestore) {
        try {
            const snap = await firebase.firestore().collection('customTasks').get();
            snap.forEach((doc: any) => {
                const d = doc.data() || {};
                const id = String(d.id || doc.id);
                const level = String(d.educationLevel || 'highschool');
                const educationLevel: ExamEducationLevel =
                    level === 'elementary' ||
                    level === 'highschool' ||
                    level === 'university' ||
                    level === 'erettsegi'
                        ? level
                        : 'highschool';
                custom.push({
                    id,
                    title: String(d.title || 'Feladat'),
                    description: String(d.description || ''),
                    difficulty: (d.difficulty as ExamTaskBankItem['difficulty']) || 'medium',
                    topic: String(d.topic || d.topicTitle || ''),
                    topicId: d.topicId ? String(d.topicId) : undefined,
                    educationLevel,
                    erettsegiLevel:
                        d.erettsegiLevel === 'kozep' || d.erettsegiLevel === 'emelt'
                            ? d.erettsegiLevel
                            : undefined,
                    subjectId: d.subjectId ? String(d.subjectId) : undefined,
                    questions: Number(d.questions) || 10,
                    timeLimit: Number(d.timeLimit) || 30,
                    customQuestions: Array.isArray(d.customQuestions) ? d.customQuestions : undefined,
                });
            });
        } catch (err) {
            console.warn('customTasks load failed:', err);
        }
    }

    const catalog = buildCatalogExamTasks();
    const byId = new Map<string, ExamTaskBankItem>();
    for (const t of catalog) byId.set(t.id, t);
    for (const t of SAMPLE_EXAM_TASKS) byId.set(t.id, t);
    for (const t of custom) byId.set(t.id, t);

    const levelOrder: Record<string, number> = {
        elementary: 0,
        highschool: 1,
        erettsegi: 2,
        university: 3,
    };

    return Array.from(byId.values()).sort((a, b) => {
        const la = levelOrder[a.educationLevel] ?? 9;
        const lb = levelOrder[b.educationLevel] ?? 9;
        if (la !== lb) return la - lb;
        if (a.erettsegiLevel !== b.erettsegiLevel) {
            return String(a.erettsegiLevel || '').localeCompare(String(b.erettsegiLevel || ''));
        }
        return a.title.localeCompare(b.title, 'hu');
    });
}

/** Sorok: „kérdés” vagy „kérdés || válaszszám” */
export function parseCustomQuestionsText(
    text: string
): NonNullable<ExamTaskBankItem['customQuestions']> {
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const parts = line.split(/\s*\|\|\s*/);
            const question = (parts[0] || '').trim();
            const answerRaw = (parts[1] || '').trim().replace(',', '.');
            const answer = answerRaw === '' ? 0 : Number(answerRaw);
            return {
                question,
                answer: Number.isFinite(answer) ? answer : 0,
                expression: '',
            };
        })
        .filter((q) => q.question.length > 0);
}

export async function saveCustomExamTask(
    task: ExamTaskBankItem
): Promise<{ ok: boolean; id?: string; error?: string }> {
    try {
        const firebase = typeof window !== 'undefined' ? (window as any).firebase : null;
        if (!firebase?.firestore) return { ok: false, error: 'Firebase nem elérhető' };
        const id = task.id || `custom-${Date.now()}`;
        const payload = {
            id,
            title: task.title,
            description: task.description || '',
            difficulty: task.difficulty || 'medium',
            topic: task.topic,
            topicId: task.topicId || '',
            educationLevel: task.educationLevel,
            erettsegiLevel: task.erettsegiLevel || null,
            subjectId: task.subjectId || null,
            questions: task.customQuestions?.length || task.questions || 1,
            timeLimit: task.timeLimit || 30,
            customQuestions: task.customQuestions || [],
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await firebase.firestore().collection('customTasks').doc(id).set(payload, { merge: true });
        return { ok: true, id };
    } catch (err: any) {
        return { ok: false, error: String(err?.message || err).slice(0, 160) };
    }
}

export async function deleteCustomExamTask(
    taskId: string
): Promise<{ ok: boolean; error?: string }> {
    try {
        const firebase = typeof window !== 'undefined' ? (window as any).firebase : null;
        if (!firebase?.firestore) return { ok: false, error: 'Firebase nem elérhető' };
        const id = String(taskId || '').trim();
        if (!id || id.startsWith('cat-')) return { ok: false, error: 'Alapfeladat nem törölhető' };
        await firebase.firestore().collection('customTasks').doc(id).delete();
        try {
            const snap = await firebase
                .firestore()
                .collection('customTasks')
                .where('id', '==', id)
                .limit(5)
                .get();
            for (const doc of snap.docs) {
                if (doc.id !== id) await doc.ref.delete();
            }
        } catch {
            /* optional legacy */
        }
        return { ok: true };
    } catch (err: any) {
        return { ok: false, error: String(err?.message || err).slice(0, 160) };
    }
}

export function customQuestionsToText(
    questions: ExamTaskBankItem['customQuestions'] | undefined
): string {
    if (!questions?.length) return '';
    return questions
        .map((q) => {
            const a = Number(q.answer);
            if (Number.isFinite(a) && a !== 0) return `${q.question} || ${a}`;
            return q.question;
        })
        .join('\n');
}

export function isCatalogBaseTask(task: ExamTaskBankItem): boolean {
    return task.id.startsWith('cat-');
}

export function isSampleBaseTask(task: ExamTaskBankItem): boolean {
    return !task.id.startsWith('cat-') && !task.id.startsWith('custom-') && !task.customQuestions?.length;
}

export function isOwnCustomTask(task: ExamTaskBankItem): boolean {
    return Boolean(task.customQuestions?.length) || task.id.startsWith('custom-');
}
