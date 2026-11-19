import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.medium} border-gray-200 border-t-[#4F46E5] rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-content-secondary animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

