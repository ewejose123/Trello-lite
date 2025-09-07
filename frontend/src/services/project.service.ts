import api, { markUserAction } from './api';

export interface Project {
    id: string;
    name: string;
    description: string;
    teamId: string;
    createdAt: string;
    updatedAt: string;
}

export const createProject = async (name: string, description: string, teamId: string): Promise<Project> => {
    markUserAction();
    const response = await api.post('/projects', { name, description, teamId });
    return response.data;
};

export const getProjectsByTeam = async (teamId: string): Promise<Project[]> => {
    markUserAction();
    const response = await api.get(`/projects/team/${teamId}`);
    return response.data;
};

export const getProject = async (projectId: string): Promise<Project> => {
    markUserAction();
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

export const getProjectById = async (projectId: string): Promise<Project> => {
    markUserAction();
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};
