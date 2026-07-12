import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartWidgetProps {
  data: any[];
  xKey?: string;
  areas?: Array<{ key: string; color: string; label?: string }>;
  height?: number;
  color?: string;
  fillColor?: string;
  [key: string]: any;
}

export const AreaChartWidget: React.FC<AreaChartWidgetProps> = ({
  data,
  color = '#2D5BFF',
  fillColor = '#EEF2FF',
  xKey = 'name',
  areas,
  height = 240,
}) => {
  const chartHeight = typeof height === 'number' ? height : 240;

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {areas ? (
              areas.map((a, idx) => (
                <linearGradient key={`grad-${idx}`} id={`color-${a.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={a.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={a.color} stopOpacity={0.0} />
                </linearGradient>
              ))
            ) : (
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E8EB" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: '#74777D', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#74777D', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0B1F33',
              border: 'none',
              borderRadius: '4px',
              color: '#FFFFFF',
              fontSize: '12px',
            }}
          />
          {areas ? (
            areas.map((a, idx) => (
              <Area
                key={`area-${idx}`}
                type="monotone"
                dataKey={a.key}
                stroke={a.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-${a.key})`}
                name={a.label || a.key}
              />
            ))
          ) : (
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartWidget;
