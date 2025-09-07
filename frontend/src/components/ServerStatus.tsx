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
            // First, test if the server root is accessible
            const baseUrl = api.defaults.baseURL?.replace('/api', '') || 'https://taskmanagerpro-i68r.onrender.com';
            const rootResponse = await fetch(baseUrl, { 
                method: 'GET',
                signal: AbortSignal.timeout(10000)
            });
            
            if (rootResponse.ok) {
                // Server root is working, now test API endpoint
                try {
                    await api.get('/', { timeout: 5000 });
                    setIsOnline(true);
                } catch {
                    // API routes might not be working, but server is up
                    console.warn('Server is up but API routes may not be deployed properly');
                    setIsOnline(false);
                }
            } else {
                setIsOnline(false);
            }
        } catch {
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