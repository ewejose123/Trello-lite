import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable for production or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || (
    import.meta.env.PROD 
        ? 'https://taskmanagerpro-i68r.onrender.com/api' // Your actual Render URL
        : 'http://localhost:8000/api'
);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 45000, // 45 seconds to handle cold starts
    withCredentials: true, // Enable credentials for CORS
});

// Track cold start state - only show when user attempts an action
let isColdStarting = false;
let coldStartToastId: string | undefined;
let hasUserTriggeredAction = false;

// Function to mark that user has triggered an action requiring backend
export const markUserAction = () => {
  hasUserTriggeredAction = true;
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Only show cold start message if user has triggered an action and we're in production
        if (!isColdStarting && hasUserTriggeredAction && import.meta.env.PROD) {
            const coldStartTimer = setTimeout(() => {
                if (!isColdStarting) {
                    isColdStarting = true;
                    coldStartToastId = toast.loading(
                        '🚀 Server is starting up (cold start)... Please wait, this may take up to 30 seconds.',
                        {
                            duration: 30000,
                            style: {
                                background: '#1f2937',
                                color: '#f3f4f6',
                                border: '1px solid #374151',
                            },
                        }
                    );
                }
            }, 3000); // Show after 3 seconds of waiting
            
            // Store timer on config for cleanup
            (config as typeof config & { _coldStartTimer?: NodeJS.Timeout })._coldStartTimer = coldStartTimer;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        // Clear cold start message on successful response
        if (isColdStarting && coldStartToastId) {
            toast.dismiss(coldStartToastId);
            toast.success('✅ Server is ready!', {
                duration: 2000,
                style: {
                    background: '#059669',
                    color: '#ffffff',
                },
            });
            isColdStarting = false;
            coldStartToastId = undefined;
        }
        
        // Clear any pending cold start timer
        if ((response.config as typeof response.config & { _coldStartTimer?: NodeJS.Timeout })?._coldStartTimer) {
            clearTimeout((response.config as typeof response.config & { _coldStartTimer?: NodeJS.Timeout })._coldStartTimer!);
        }
        
        return response;
    },
    (error) => {
        // Clear cold start message on error too
        if (isColdStarting && coldStartToastId) {
            toast.dismiss(coldStartToastId);
            isColdStarting = false;
            coldStartToastId = undefined;
        }
        
        // Clear any pending cold start timer
        if (error.config && (error.config as typeof error.config & { _coldStartTimer?: NodeJS.Timeout })?._coldStartTimer) {
            clearTimeout((error.config as typeof error.config & { _coldStartTimer?: NodeJS.Timeout })._coldStartTimer!);
        }
        
        // Handle specific errors
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            toast.error('🚀 Server is starting up (cold start). Please wait and try again in a moment.', {
                duration: 8000,
                style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    border: '1px solid #374151',
                },
            });
        } else if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        } else if (!error.response) {
            // Network error - server might be cold starting
            toast.error('🚀 Server is starting up. This may take up to 30 seconds. Please try again shortly.', {
                duration: 8000,
                style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    border: '1px solid #374151',
                },
            });
        }
        
        return Promise.reject(error);
    }
);

export default api;
