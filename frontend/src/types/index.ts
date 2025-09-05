export interface UserRegistrationData {
    email: string;
    password: string;
    name: string;
}

export interface UserLoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    teamId: string;
    createdAt: string;
    updatedAt: string;
}

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

export interface Team {
    id: string;
    name: string;
    createdAt: string;
    _count?: {
        projects: number;
        tasks: number;
    };
}

export interface Attachment {
    id: string;
    fileName: string;
    url: string;
    taskId: string;
    createdAt: string;
    updatedAt: string;
}
