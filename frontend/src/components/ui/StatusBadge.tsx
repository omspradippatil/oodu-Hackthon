import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'vehicle' | 'driver' | 'trip' | 'container' | 'equipment' | 'maintenance' | 'ship' | 'dock';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const getStyles = () => {
    const s = status.toUpperCase();
    
    // Default success/warning/error semantic mappings
    if (['AVAILABLE', 'ACTIVE', 'DOCKED', 'DELIVERED', 'COMPLETED', 'ON_DUTY', 'OPEN'].includes(s)) {
      return 'bg-success-container text-success';
    }
    if (['ON_TRIP', 'IN_TRANSIT', 'DISPATCHED', 'LOADING', 'BUSY'].includes(s)) {
      return 'bg-port-blue-light text-port-blue';
    }
    if (['IN_SHOP', 'PENDING', 'MAINTENANCE', 'IN_PROGRESS', 'OFFLINE', 'WAITING', 'UNLOADING', 'ALLOCATED', 'WARNING'].includes(s)) {
      return 'bg-warning-container text-warning';
    }
    if (['RETIRED', 'SUSPENDED', 'CANCELLED', 'CRITICAL', 'OFF_DUTY'].includes(s)) {
      return 'bg-error-container text-error';
    }
    
    return 'bg-surface-container text-on-surface-variant';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStyles()}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
