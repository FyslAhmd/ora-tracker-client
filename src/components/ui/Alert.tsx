import React from 'react';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiXMark,
} from 'react-icons/hi2';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const variants: Record<AlertVariant, { bg: string; icon: React.ElementType; iconColor: string }> = {
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: HiInformationCircle,
      iconColor: 'text-blue-400',
    },
    success: {
      bg: 'bg-green-500/10 border-green-500/30',
      icon: HiCheckCircle,
      iconColor: 'text-green-400',
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: HiExclamationTriangle,
      iconColor: 'text-yellow-400',
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: HiExclamationCircle,
      iconColor: 'text-red-400',
    },
  };

  const { bg, icon: Icon, iconColor } = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-start gap-3 p-4 rounded-lg border ${bg} ${className}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1">
        {title && <h4 className="font-medium text-white mb-1">{title}</h4>}
        <p className="text-gray-300 text-sm">{children}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-dark-700/50 transition-colors"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default Alert;
