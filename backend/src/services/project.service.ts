import prisma from '../prisma.js';

export const createProject = async (name: string, description: string, teamId: string, userId: string) => {
    // Check if user is member of the team
    const teamMembership = await prisma.teamMembership.findFirst({
        where: {
            teamId,
            userId,
        },
    });

    if (!teamMembership) {
        throw new Error('You are not a member of this team');
    }

    const project = await prisma.project.create({
        data: {
            name,
            description,
            teamId,
        },
    });

    return project;
};

export const getProjectsByTeamId = async (teamId: string, userId: string) => {
    // Check if user is member of the team
    const teamMembership = await prisma.teamMembership.findFirst({
        where: {
            teamId,
            userId,
        },
    });

    if (!teamMembership) {
        throw new Error('You are not a member of this team');
    }

    const projects = await prisma.project.findMany({
        where: {
            teamId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return projects;
};

export const getProjectById = async (projectId: string, userId: string) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            team: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
        },
    });

    if (!project) {
        throw new Error('Project not found or you do not have access');
    }

    return project;
};
