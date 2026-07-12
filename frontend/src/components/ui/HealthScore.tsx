import React from 'react';

interface HealthScoreProps {
  score: number;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score }) => {
  const getColorClass = (val: number) => {
    if (val >= 80) return 'text-success';
    if (val >= 60) return 'text-port-blue';
    if (val >= 40) return 'text-warning';
    return 'text-error';
  };

  const getBgClass = (val: number) => {
    if (val >= 80) return 'bg-success';
    if (val >= 60) return 'bg-port-blue';
    if (val >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-[120px]">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className={getColorClass(score)}>{score}%</span>
        <span className="text-[10px] text-on-surface-variant/60 uppercase">Health</span>
      </div>
      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBgClass(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default HealthScore;
