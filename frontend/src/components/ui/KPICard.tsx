import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection = 'neutral',
  subtitle,
}) => {
  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-success bg-success-container';
    if (trendDirection === 'down') return 'text-error bg-error-container';
    return 'text-on-surface-variant bg-surface-container-high';
  };

  return (
    <div className="bg-white border border-outline-variant rounded-md shadow-card p-6 flex flex-col justify-between h-[128px]">
      <div className="flex justify-between items-start">
        <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-surface-container rounded-md text-primary-container">
          {icon}
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-2">
        <div>
          <span className="text-display-lg font-bold text-on-surface">{value}</span>
          {subtitle && <p className="text-[10px] text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${getTrendColor()}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default KPICard;
