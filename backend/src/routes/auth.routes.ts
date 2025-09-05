import { body } from 'express-validator';
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// Register
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address (e.g., user@example.com)')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long for security')
            .isLength({ max: 128 })
            .withMessage('Password cannot exceed 128 characters')
            .matches(/^(?=.*[a-zA-Z])/)
            .withMessage('Password must contain at least one letter (a-z or A-Z)'),
        body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters long')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name can only contain letters and spaces'),
    ],
    authController.register
);

// Login
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail(),
        body('password')
            .not()
            .isEmpty()
            .withMessage('Password is required to access your account'),
    ],
    authController.login
);

// Logout
router.post(
    '/logout',
    authController.logout
);

// Refresh token
router.post(
    '/refresh',
    authController.refresh
);

export default router;
