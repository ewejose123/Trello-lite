import prisma from '../prisma.js';

// Type definition for Prisma error with meta information
interface PrismaError extends Error {
    code: string;
    meta?: {
        column?: string;
        modelName?: string;
        [key: string]: unknown;
    };
}

export const createProject = async (name: string, description: string | null = null, teamId: string, userId: string) => {
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

    // Create project with description only if it's provided and column exists
    const projectData: any = {
        name,
        teamId,
    };
    
    // Only add description if it's provided (handles missing column gracefully)
    if (description) {
        projectData.description = description;
    }

    const project = await prisma.project.create({
        data: projectData,
    });

    return project;
};

export const getProjectsByTeamId = async (teamId: string, userId: string) => {
    try {
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
            // Only select fields that definitely exist
            select: {
                id: true,
                name: true,
                teamId: true,
                createdAt: true,
                updatedAt: true,
                // description: true, // Commented out until database is fixed
            },
        });

        return projects;
    } catch (error: unknown) {
        console.error('Get projects error:', error);
        // Type guard to check if it's a Prisma error
        const isPrismaError = (err: unknown): err is PrismaError => {
            return err instanceof Error && 
                   'code' in err && 
                   typeof err.code === 'string';
        };
        
        // If it's a Prisma error about missing column, return projects without description
        if (isPrismaError(error) && 
            error.code === 'P2022' && 
            error.meta?.column?.includes('description')) {
            console.log('Description column not found, querying without it...');
            const projects = await prisma.project.findMany({
                where: {
                    teamId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    name: true,
                    teamId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return projects;
        }
        throw error;
    }
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
