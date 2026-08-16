/** Diákoknak kiosztott feladatok (exam-prep → dashboard). */

import { apiGetAuth, apiPatchAuth, apiPostAuth } from './apiClient';

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
    status?: 'assigned' | 'completed' | 'started';
    createdAt?: string;
    createdBy?: string;
};

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
    customQuestions?: unknown[];
    studentId: string;
    studentEmail?: string;
    studentName?: string;
    createdBy?: string;
}): Promise<{ ok: boolean; error?: string }> {
    try {
        const res = await apiPostAuth<{ task: AssignedTaskDoc }>('/api/tasks/assigned', params);
        if (!res.ok) return { ok: false, error: res.error };
        return { ok: true };
    } catch (err: unknown) {
        console.error('assignTaskToStudent failed:', err);
        return { ok: false, error: String((err as Error)?.message || 'Kiosztás sikertelen') };
    }
}

export async function loadStudentAssignedTasks(
    _studentId: string,
    _studentEmail?: string
): Promise<AssignedTaskDoc[]> {
    try {
        const res = await apiGetAuth<{ tasks: AssignedTaskDoc[] }>('/api/tasks/assigned');
        if (!res.ok) {
            console.warn('loadStudentAssignedTasks:', res.error);
            return [];
        }
        return res.data.tasks || [];
    } catch (err) {
        console.error('loadStudentAssignedTasks failed:', err);
        return [];
    }
}

export async function updateAssignedTaskStatus(
    id: string,
    status: 'assigned' | 'started' | 'completed'
): Promise<{ ok: boolean; error?: string }> {
    const res = await apiPatchAuth<{ task: AssignedTaskDoc }>('/api/tasks/assigned', { id, status });
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true };
}

export function gameUrlForAssignedTask(task: AssignedTaskDoc): string {
    const level = task.educationLevel || 'highschool';
    const params = new URLSearchParams({
        educationLevel: level,
        taskId: task.taskId,
    });
    if (task.topicId) params.set('topic', task.topicId);
    if (task.studentId) params.set('studentId', task.studentId);
    if (task.studentName) params.set('studentName', task.studentName);
    return `/game?${params.toString()}`;
}
