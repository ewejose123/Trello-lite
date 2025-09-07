import api from '../services/api';

export const testCORSConnection = async (): Promise<{
    success: boolean;
    message: string;
    details?: unknown;
}> => {
    try {
        console.log('Testing CORS connection...');
        
        // Test the API CORS endpoint
        const response = await api.get('/cors-test');
        
        console.log('CORS test response:', response.data);
        
        return {
            success: true,
            message: 'CORS connection successful!',
            details: response.data
        };
    } catch (error) {
        console.error('CORS test failed:', error);
        
        let message = 'CORS connection failed';
        
        if (error instanceof Error) {
            if (error.message.includes('Network Error')) {
                message = 'Network error - server may be starting up (cold start)';
            } else if (error.message.includes('timeout')) {
                message = 'Request timeout - server may be cold starting';
            } else if (error.message.includes('CORS')) {
                message = 'CORS policy error - check server configuration';
            } else {
                message = `Connection error: ${error.message}`;
            }
        }
        
        return {
            success: false,
            message,
            details: error
        };
    }
};

// Test with credentials
export const testCORSWithCredentials = async (): Promise<{
    success: boolean;
    message: string;
    details?: unknown;
}> => {
    try {
        console.log('Testing CORS with credentials...');
        
        // Test with a request that requires credentials
        const response = await api.get('/health');
        
        console.log('CORS credentials test response:', response.data);
        
        return {
            success: true,
            message: 'CORS with credentials successful!',
            details: response.data
        };
    } catch (error) {
        console.error('CORS credentials test failed:', error);
        
        return {
            success: false,
            message: 'CORS credentials test failed',
            details: error
        };
    }
};