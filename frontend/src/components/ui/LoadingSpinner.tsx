import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 w-full">
      <div className="h-8 w-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-body-sm text-on-surface-variant font-medium">Loading platform data...</span>
    </div>
  );
};

export default LoadingSpinner;
