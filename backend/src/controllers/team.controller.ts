import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import * as teamService from '../services/team.service.js';

export const createTeam = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const userId = req.userId!;
        const team = await teamService.createTeam(name, userId);
        res.status(201).json(team);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating team' });
    }
};

export const getTeams = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const teams = await teamService.getTeamsByUserId(userId);
        res.json(teams);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching teams' });
    }
};

export const getTeamById = async (req: AuthRequest, res: Response) => {
    try {
        const { teamId } = req.params;
        const userId = req.userId!;
        const team = await teamService.getTeamById(teamId, userId);
        res.json(team);
    } catch (error: any) {
        if (error.message === 'Team not found') {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(500).json({ message: 'Error fetching team' });
    }
};
