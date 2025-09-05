import { body } from 'express-validator';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as taskController from '../controllers/task.controller.js';

const router = Router();

router.use(authMiddleware);

// Create task
router.post(
    '/',
    [
        body('title').not().isEmpty().withMessage('Task title is required'),
        body('projectId').not().isEmpty().withMessage('Project ID is required'),
    ],
    taskController.createTask
);

// Get tasks for a project
router.get('/project/:projectId', taskController.getTasksByProject);

// Update task status
router.put(
    '/:taskId/status',
    [
        body('status').isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
    ],
    taskController.updateTaskStatus
);

export default router;
