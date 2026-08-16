/** Diákoknak kiosztott feladatok (exam-prep → dashboard). */

export type AssignedTaskDoc = {
    id: string;
    taskId: string;
    title: string;
    description?: string;
    topicId?: string;
    topicTitle?: string;
    educationLevel?: string;
    difficulty?: string;
    questions?: number;
    timeLimit?: number;
    studentId?: string;
    studentEmail?: string;
    studentName?: string;
    status?: "assigned" | "completed" | "started";
    createdAt?: any;
    createdBy?: string;
};

function getFirebase(): any | null {
    if (typeof window === "undefined") return null;
    return (window as any).firebase || null;
}

export async function assignTaskToStudent(params: {
    taskId: string;
    title: string;
    description?: string;
    topicId?: string;
    topicTitle?: string;
    educationLevel?: string;
    difficulty?: string;
    questions?: number;
    timeLimit?: number;
    customQuestions?: any[];
    studentId: string;
    studentEmail?: string;
    studentName?: string;
    createdBy?: string;
}): Promise<{ ok: boolean; error?: string }> {
    try {
        const firebase = getFirebase();
        if (!firebase?.firestore) return { ok: false, error: "Firebase nem elérhető" };
        const db = firebase.firestore();

        const doc = {
            taskId: params.taskId,
            title: params.title,
            description: params.description || "",
            topicId: params.topicId || "",
            topicTitle: params.topicTitle || "",
            educationLevel: params.educationLevel || "",
            difficulty: params.difficulty || "",
            questions: params.questions || 0,
            timeLimit: params.timeLimit || 0,
            customQuestions: params.customQuestions || [],
            studentId: params.studentId,
            studentEmail: (params.studentEmail || "").toLowerCase(),
            studentName: params.studentName || "",
            status: "assigned",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: params.createdBy || "",
        };

        await db.collection("assignedTasks").add(doc);

        // Legacy: users/{uid}.assignedTasks string tömb (student-game kompatibilitás)
        try {
            await db
                .collection("users")
                .doc(params.studentId)
                .set(
                    {
                        assignedTasks: firebase.firestore.FieldValue.arrayUnion(params.taskId),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
        } catch (err) {
            console.warn("users.assignedTasks update failed:", err);
        }

        return { ok: true };
    } catch (err: any) {
        console.error("assignTaskToStudent failed:", err);
        return { ok: false, error: err?.message || "Kiosztás sikertelen" };
    }
}

export async function loadStudentAssignedTasks(
    studentId: string,
    studentEmail?: string
): Promise<AssignedTaskDoc[]> {
    const firebase = getFirebase();
    if (!firebase?.firestore || !studentId) return [];
    const db = firebase.firestore();
    const map = new Map<string, AssignedTaskDoc>();

    const merge = (snap: any) => {
        snap.forEach((doc: any) => {
            map.set(doc.id, { id: doc.id, ...doc.data() });
        });
    };

    try {
        try {
            const byId = await db.collection("assignedTasks").where("studentId", "==", studentId).get();
            merge(byId);
        } catch (err) {
            console.warn("assignedTasks by studentId failed:", err);
        }

        const email = (studentEmail || "").trim().toLowerCase();
        if (email) {
            try {
                const byEmail = await db
                    .collection("assignedTasks")
                    .where("studentEmail", "==", email)
                    .get();
                merge(byEmail);
            } catch {
                // ignore
            }
        }

        // Ha nincs diákhoz kötött, ne mutassuk a „mindenkié” legacy docokat
        return Array.from(map.values()).sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() || 0;
            const tb = b.createdAt?.toMillis?.() || 0;
            return tb - ta;
        });
    } catch (err) {
        console.error("loadStudentAssignedTasks failed:", err);
        return [];
    }
}

export function gameUrlForAssignedTask(task: AssignedTaskDoc): string {
    const level = task.educationLevel || "highschool";
    const params = new URLSearchParams({
        educationLevel: level,
        taskId: task.taskId,
    });
    if (task.topicId) params.set("topic", task.topicId);
    if (task.studentId) params.set("studentId", task.studentId);
    if (task.studentName) params.set("studentName", task.studentName);
    return `/game?${params.toString()}`;
}
