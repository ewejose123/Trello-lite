import prisma from '../prisma.js';

export const createTask = async (title: string, description: string, projectId: string, userId: string) => {
    // Check if user has access to the project
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

    const task = await prisma.task.create({
        data: {
            title,
            description,
            projectId,
            status: 'TODO',
        },
    });

    return task;
};

export const getTasksByProjectId = async (projectId: string, userId: string) => {
    // Check if user has access to the project
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

    const tasks = await prisma.task.findMany({
        where: {
            projectId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return tasks;
};

export const updateTaskStatus = async (taskId: string, status: string, userId: string) => {
    // Check if user has access to the task
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            project: {
                team: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        },
    });

    if (!task) {
        throw new Error('Task not found or you do not have access');
    }

    const updatedTask = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            status: status as 'TODO' | 'IN_PROGRESS' | 'DONE',
        },
    });

    return updatedTask;
};
