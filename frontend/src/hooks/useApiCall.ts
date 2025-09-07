import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseApiCallOptions {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
}

export const useApiCall = <T extends unknown[], R>(
  apiFunction: (...args: T) => Promise<R>,
  options: UseApiCallOptions = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    showSuccessToast = false,
    successMessage = 'Operation completed successfully',
    showErrorToast = true,
    errorMessage,
  } = options;

  const execute = useCallback(
    async (...args: T): Promise<R | null> => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunction(...args);
        
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        
        return result;
      } catch (err: unknown) {
        const errorMsg = errorMessage || 
          (err instanceof Error ? err.message : 'An unexpected error occurred');
        
        setError(errorMsg);
        
        if (showErrorToast) {
          // Don't show error toast if it's a cold start (already handled by interceptor)
          if (!errorMsg.includes('timeout') && !errorMsg.includes('cold start')) {
            toast.error(errorMsg);
          }
        }
        
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showSuccessToast, successMessage, showErrorToast, errorMessage]
  );

  return { execute, loading, error };
};