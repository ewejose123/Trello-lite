import api from './api';
import type { UserRegistrationData, UserLoginData } from '../types'; // We will create this type definition next

export const register = async (userData: UserRegistrationData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (userData: UserLoginData) => {
    const response = await api.post('/auth/login', userData);
    return response.data;
};
