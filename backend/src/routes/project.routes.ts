import { body } from 'express-validator';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as projectController from '../controllers/project.controller.js';

const router = Router();

router.use(authMiddleware);

// Create project
router.post(
    '/',
    [
        body('name').not().isEmpty().withMessage('Project name is required'),
        body('teamId').not().isEmpty().withMessage('Team ID is required'),
    ],
    projectController.createProject
);

// Get projects for a team
router.get('/team/:teamId', projectController.getProjectsByTeam);

// Get specific project
router.get('/:projectId', projectController.getProject);

export default router;
