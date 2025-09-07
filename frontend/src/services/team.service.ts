import api, { markUserAction } from './api';
import type { Team } from '../types';

export const createTeam = async (name: string): Promise<Team> => {
    markUserAction();
    const response = await api.post('/teams', { name });
    return response.data;
};

export const getTeams = async (): Promise<Team[]> => {
    markUserAction();
    try {
        const response = await api.get('/teams');
        const teams = response.data;
        
        // If teams already have _count from backend, use them directly
        if (teams.length > 0 && teams[0]._count) {
            return teams;
        }
        
        // Fallback: Fetch project counts for each team if not included
        const teamsWithCounts = await Promise.all(
            teams.map(async (team: Team) => {
                try {
                    const projectsResponse = await api.get(`/projects/team/${team.id}`);
                    const projects = projectsResponse.data;
                    
                    // Fetch task counts for each project
                    let totalTasks = 0;
                    for (const project of projects) {
                        try {
                            const tasksResponse = await api.get(`/tasks/project/${project.id}`);
                            totalTasks += tasksResponse.data.length;
                        } catch (error) {
                            console.warn(`Could not fetch tasks for project ${project.id}:`, error);
                        }
                    }
                    
                    return {
                        ...team,
                        _count: {
                            projects: projects.length,
                            tasks: totalTasks
                        }
                    };
                } catch (error) {
                    console.warn(`Could not fetch projects for team ${team.id}:`, error);
                    return {
                        ...team,
                        _count: {
                            projects: 0,
                            tasks: 0
                        }
                    };
                }
            })
        );
        
        return teamsWithCounts;
    } catch (error: unknown) {
        console.error('Error fetching teams:', error);
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Failed to fetch team data. Please try again.';
        throw new Error(errorMessage);
    }
};

export const getTeamById = async (teamId: string): Promise<Team> => {
    markUserAction();
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
};

export const getTeamStats = async (): Promise<{ totalProjects: number; totalTasks: number }> => {
    markUserAction();
    try {
        // Get all teams and their projects/tasks
        const teams = await getTeams();
        let totalProjects = 0;
        let totalTasks = 0;

        for (const team of teams) {
            try {
                const projectsResponse = await api.get(`/projects/team/${team.id}`);
                const projects = projectsResponse.data;
                totalProjects += projects.length;

                for (const project of projects) {
                    try {
                        const tasksResponse = await api.get(`/tasks/project/${project.id}`);
                        const tasks = tasksResponse.data;
                        totalTasks += tasks.length;
                    } catch (error) {
                        console.warn(`Could not fetch tasks for project ${project.id}:`, error);
                    }
                }
            } catch (error) {
                console.warn(`Could not fetch projects for team ${team.id}:`, error);
            }
        }

        return { totalProjects, totalTasks };
    } catch (error) {
        console.error('Error fetching team stats:', error);
        return { totalProjects: 0, totalTasks: 0 };
    }
};
