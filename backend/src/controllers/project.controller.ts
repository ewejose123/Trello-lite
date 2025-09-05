import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import * as projectService from '../services/project.service.js';

export const createProject = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description, teamId } = req.body;
        const userId = req.userId!;
        const project = await projectService.createProject(name, description, teamId, userId);
        res.status(201).json(project);
    } catch (error: unknown) {
        console.error('Project creation error:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error creating project' });
        }
    }
};

export const getProjectsByTeam = async (req: AuthRequest, res: Response) => {
    try {
        const { teamId } = req.params;
        const userId = req.userId!;
        const projects = await projectService.getProjectsByTeamId(teamId, userId);
        res.json(projects);
    } catch (error: unknown) {
        console.error('Get projects error:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error fetching projects' });
        }
    }
};

export const getProject = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const userId = req.userId!;
        const project = await projectService.getProjectById(projectId, userId);
        res.json(project);
    } catch (error: unknown) {
        console.error('Get project error:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error fetching project' });
        }
    }
};
