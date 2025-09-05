import prisma from '../prisma.js';

export const createTeam = async (name: string, userId: string) => {
    const team = await prisma.team.create({
        data: {
            name,
            members: {
                create: {
                    userId,
                    role: 'admin',
                },
            },
        },
    });
    return team;
};

export const getTeamsByUserId = async (userId: string) => {
    const teams = await prisma.team.findMany({
        where: {
            members: {
                some: {
                    userId,
                },
            },
        },
    });
    return teams;
};

export const getTeamById = async (teamId: string, userId: string) => {
    const team = await prisma.team.findFirst({
        where: {
            id: teamId,
            members: {
                some: {
                    userId,
                },
            },
        },
    });

    if (!team) {
        throw new Error('Team not found');
    }

    return team;
};
