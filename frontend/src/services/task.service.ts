import api from './api';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    projectId: string;
    assigneeId: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export const createTask = async (title: string, description: string, projectId: string): Promise<Task> => {
    const response = await api.post('/tasks', { title, description, projectId });
    return response.data;
};

export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
};

export const updateTaskStatus = async (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<Task> => {
    const response = await api.put(`/tasks/${taskId}/status`, { status });
    return response.data;
};
