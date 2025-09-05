import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { User } from '@prisma/client';

export const registerUser = async (email: string, password: string, name: string): Promise<Omit<User, 'password'>> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: '7d',
    });

    const { password: _, ...userWithoutPassword } = user;

    return { accessToken, refreshToken, user: userWithoutPassword };
};

export const refreshAccessToken = async (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };

    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: '15m',
    });

    return { accessToken };
};
