import { body } from 'express-validator';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as teamController from '../controllers/team.controller.js';

const router = Router();

// All team routes are protected
router.use(authMiddleware);

// Create team
router.post(
    '/',
    [body('name').not().isEmpty().withMessage('Team name is required')],
    teamController.createTeam
);

// Invite user to team
router.post('/:teamId/invite', (req, res) => {
    res.send('Invite user to team');
});

// Get user's teams
router.get('/', teamController.getTeams);

// Get team by ID
router.get('/:teamId', teamController.getTeamById);

export default router;
