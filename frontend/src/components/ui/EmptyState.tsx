import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  message,
  description,
  icon = <HelpCircle size={32} className="text-on-surface-variant/40" />,
}) => {
  const displayMessage = message || description || 'Try modifying your filters or search terms.';
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-outline-variant bg-surface-container-low rounded-md text-center">
      <div className="p-3 bg-surface rounded-full shadow-card mb-3">
        {icon}
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface">{title}</h3>
      <p className="text-body-sm text-on-surface-variant max-w-[280px] mt-1">{displayMessage}</p>
    </div>
  );
};

export default EmptyState;
