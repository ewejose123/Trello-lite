import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// Global state to track if we've already shown a cold start message
let hasShownColdStartMessage = false;
let coldStartToastId: string | undefined;

export const useServerConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const showColdStartMessage = useCallback(() => {
    if (!hasShownColdStartMessage) {
      hasShownColdStartMessage = true;
      coldStartToastId = toast.loading(
        '\ud83d\ude80 Server is starting up (cold start). This may take up to 30 seconds...',
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
  }, []);

  const hideColdStartMessage = useCallback(() => {
    if (coldStartToastId) {
      toast.dismiss(coldStartToastId);
      toast.success('\u2705 Server is ready!', {
        duration: 2000,
        style: {
          background: '#059669',
          color: '#ffffff',
        },
      });
      hasShownColdStartMessage = false;
      coldStartToastId = undefined;
    }
  }, []);

  const handleConnectionError = useCallback(() => {
    showColdStartMessage();
  }, [showColdStartMessage]);

  const handleConnectionSuccess = useCallback(() => {
    hideColdStartMessage();
  }, [hideColdStartMessage]);

  const resetColdStartState = useCallback(() => {
    hasShownColdStartMessage = false;
    if (coldStartToastId) {
      toast.dismiss(coldStartToastId);
      coldStartToastId = undefined;
    }
  }, []);

  return {
    isConnecting,
    setIsConnecting,
    showColdStartMessage,
    hideColdStartMessage,
    handleConnectionError,
    handleConnectionSuccess,
    resetColdStartState,
  };
};