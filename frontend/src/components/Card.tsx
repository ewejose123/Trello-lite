import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, hover = false, onClick }) => {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        hover && 'hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
        onClick && 'cursor-pointer text-left',
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Card;
