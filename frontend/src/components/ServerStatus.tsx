import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Wifi, WifiOff } from 'lucide-react';
import api from '../services/api';

interface ServerStatusProps {
    className?: string;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ className }) => {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const checkServerStatus = async () => {
        setIsChecking(true);
        try {
            // Test CORS with the backend
            const baseUrl = api.defaults.baseURL?.replace('/api', '') || 'https://taskmanagerpro-i68r.onrender.com';
            const response = await fetch(`${baseUrl}/cors-test`, {
                method: 'GET',
                credentials: 'include', // Important for CORS with credentials
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(10000)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('CORS test successful:', data);
                setIsOnline(true);
            } else {
                console.error('CORS test failed:', response.status, response.statusText);
                setIsOnline(false);
            }
        } catch (error) {
            console.error('CORS test error:', error);
            setIsOnline(false);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkServerStatus();

        // Check server status every 30 seconds
        const interval = setInterval(checkServerStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    if (isOnline === null) {
        return null; // Don't show anything while initial check is happening
    }

    return (
        <AnimatePresence>
            {(!isOnline || isChecking) && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 right-4 z-50 ${className}`}
                >
                    <div className={`
            px-4 py-2 rounded-lg shadow-lg border
            ${isOnline === false
                            ? 'bg-red-900/90 border-red-600 text-red-100'
                            : 'bg-yellow-900/90 border-yellow-600 text-yellow-100'
                        }
            backdrop-blur-sm flex items-center gap-2
          `}>
                        {isChecking ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Server className="w-4 h-4" />
                                </motion.div>
                                <span className="text-sm font-medium">Checking server...</span>
                            </>
                        ) : (
                            <>
                                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                                <span className="text-sm font-medium">
                                    {isOnline ? 'Server connecting...' : 'Server offline'}
                                </span>
                                {!isOnline && (
                                    <button
                                        onClick={checkServerStatus}
                                        className="ml-2 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition-colors"
                                    >
                                        Retry
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ServerStatus;