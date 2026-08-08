'use client';

import { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Alert({ message, type, onClose, autoClose = true, duration = 4000 }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  const borderColor = {
    success: 'border-l-4 border-l-green-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500',
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }[type];

  const titleText = {
    success: 'Success',
    error: 'Error',
    info: 'Info',
  }[type];

  return (
    <div className={`fixed top-6 right-6 max-w-md z-50 animate-slideIn`}>
      <div className={`${bgColor} ${borderColor} rounded-lg shadow-lg p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 text-2xl mr-3">{icon}</div>
          <div className="flex-1">
            <h3 className={`font-semibold ${textColor}`}>{titleText}</h3>
            <p className={`text-sm mt-1 ${textColor}`}>{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={`ml-3 text-gray-400 hover:text-gray-600`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
