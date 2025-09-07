import api, { markUserAction } from './api';
import type { UserRegistrationData, UserLoginData } from '../types';

export const register = async (userData: UserRegistrationData) => {
    markUserAction(); // Mark that user is attempting an action
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (userData: UserLoginData) => {
    markUserAction(); // Mark that user is attempting an action
    const response = await api.post('/auth/login', userData);
    return response.data;
};
