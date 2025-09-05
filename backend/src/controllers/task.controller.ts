import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import * as taskService from '../services/task.service.js';

export const createTask = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, projectId } = req.body;
        const userId = req.userId!;
        const task = await taskService.createTask(title, description, projectId, userId);
        res.status(201).json(task);
    } catch (error: unknown) {
        res.status(500).json({ message: 'Error creating task' });
    }
};

export const getTasksByProject = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const userId = req.userId!;
        const tasks = await taskService.getTasksByProjectId(projectId, userId);
        res.json(tasks);
    } catch (error: unknown) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const userId = req.userId!;
        const task = await taskService.updateTaskStatus(taskId, status, userId);
        res.json(task);
    } catch (error: unknown) {
        res.status(500).json({ message: 'Error updating task' });
    }
};
