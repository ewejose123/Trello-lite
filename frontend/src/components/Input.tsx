import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 dark:text-gray-300">
          {label}
        </label>
      )}
      <motion.div
        initial={false}
        animate={{
          scale: error ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          id={inputId}
          className={cn(
            'block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-all duration-200 text-base',
            'placeholder:text-gray-400 dark:placeholder:text-gray-400',
            error && 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
