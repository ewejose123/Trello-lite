import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as authService from '../services/auth.service.js';

export const register = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailedErrors = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: (error as any).value || undefined
        }));
        return res.status(400).json({ 
            message: 'Validation failed. Please check your input.',
            errors: detailedErrors 
        });
    }

    try {
        const { email, password, name } = req.body;
        const user = await authService.registerUser(email, password, name);
        res.status(201).json(user);
    } catch (error: any) {
        if (error.code === 'P2002') { // Prisma unique constraint violation
            return res.status(409).json({ 
                message: 'Registration failed: Email address is already registered. Please use a different email or try logging in instead.' 
            });
        }
        res.status(500).json({ 
            message: 'Registration failed: Unable to create account. Please try again later or contact support if the problem persists.' 
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailedErrors = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: (error as any).value || undefined
        }));
        return res.status(400).json({ 
            message: 'Login failed. Please check your credentials.',
            errors: detailedErrors 
        });
    }

    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await authService.loginUser(email, password);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.json({ accessToken, user });
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ 
                message: 'Login failed: Email or password is incorrect. Please check your credentials and try again.' 
            });
        }
        res.status(500).json({ 
            message: 'Login failed: Unable to authenticate. Please try again later or contact support if the problem persists.' 
        });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.sendStatus(204);
};

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
    }

    try {
        const { accessToken } = await authService.refreshAccessToken(refreshToken);
        res.json({ accessToken });
    } catch (error: any) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};
