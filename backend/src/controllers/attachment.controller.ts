import { Request, Response } from 'express';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import prisma from '../prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const uploadAttachment = async (req: AuthRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { taskId } = req.params;
    const userId = req.userId!;

    try {
        // Check if the user has permission to upload to this task
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                project: {
                    team: {
                        members: { some: { userId } },
                    },
                },
            },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have access.' });
        }

        const file = req.file;
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        
        // Create user-specific directory
        const userDir = join(uploadsDir, userId);
        await mkdir(userDir, { recursive: true });
        
        // Create task-specific directory
        const taskDir = join(userDir, taskId);
        await mkdir(taskDir, { recursive: true });
        
        // Generate unique filename
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = join(taskDir, fileName);
        
        // Write file to local storage
        await writeFile(filePath, file.buffer);
        
        // Store relative path in database
        const relativePath = `uploads/${userId}/${taskId}/${fileName}`;

        const newAttachment = await prisma.attachment.create({
            data: {
                fileName: file.originalname,
                url: relativePath,
                taskId: taskId,
            },
        });

        res.status(201).json(newAttachment);
    } catch (error: unknown) {
        console.error('File upload error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error uploading file', error: error.message });
        } else {
            res.status(500).json({ message: 'Error uploading file' });
        }
    }
};

export const getAttachmentsByTask = async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    const userId = req.userId!;

    try {
        // Check if the user has permission to access this task
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                project: {
                    team: {
                        members: { some: { userId } },
                    },
                },
            },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have access.' });
        }

        const attachments = await prisma.attachment.findMany({
            where: {
                taskId: taskId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(attachments);
    } catch (error: unknown) {
        console.error('Get attachments error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching attachments', error: error.message });
        } else {
            res.status(500).json({ message: 'Error fetching attachments' });
        }
    }
};
