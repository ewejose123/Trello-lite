import api from './api';
import type { Team } from '../types';

export const createTeam = async (name: string): Promise<Team> => {
    const response = await api.post('/teams', { name });
    return response.data;
};

export const getTeams = async (): Promise<Team[]> => {
    try {
        const response = await api.get('/teams');
        const teams = response.data;
        
        // Fetch project counts for each team
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
    } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
    }
};

export const getTeamById = async (teamId: string): Promise<Team> => {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
};

export const getTeamStats = async (): Promise<{ totalProjects: number; totalTasks: number }> => {
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
