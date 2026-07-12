import React from 'react';
import { 
  CloudRain, 
  Sun, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Bot,
  Truck,
  Anchor
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const GATE_CONGESTION_DATA = [
  { time: '00:00', actual: 45, predicted: 42 },
  { time: '04:00', actual: 30, predicted: 35 },
  { time: '08:00', actual: 120, predicted: 110 },
  { time: '12:00', actual: 180, predicted: 195 }, // Peak
  { time: '16:00', actual: 150, predicted: 160 },
  { time: '20:00', actual: 80, predicted: 90 },
  { time: '24:00', actual: null, predicted: 50 }, // Future prediction
];

export default function AIPredictionsTab() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-port-navy to-secondary/80 rounded-xl p-6 text-white shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="text-blue-300" /> Vadhvan AI Insights Engine
          </h2>
          <p className="text-white/80 mt-1">Real-time predictive models powering smart port operations.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">Model Confidence</div>
          <div className="text-3xl font-black text-green-400">94.2%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Predictor */}
        <div className="bg-surface rounded-xl p-5 border border-outline-variant shadow-card flex flex-col">
          <h3 className="font-semibold text-port-navy flex items-center gap-2 mb-4">
            <CloudRain size={18} className="text-secondary" /> Maritime Weather Impact
          </h3>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={24} />
                <div>
                  <div className="font-bold text-red-900 text-sm">Monsoon Squall Approaching</div>
                  <div className="text-xs text-red-700 mt-0.5">ETA: 14:00 IST (High Confidence)</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Pilot Boarding Delay Risk</span>
                <span className="font-bold text-warning flex items-center gap-1"><TrendingUp size={14}/> 78%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Crane Wind-Lock Risk</span>
                <span className="font-bold text-error flex items-center gap-1"><TrendingUp size={14}/> 92%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Visibility Index</span>
                <span className="font-bold text-success flex items-center gap-1">Normal</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-outline-variant text-xs text-on-surface-variant italic">
              AI Recommendation: Suspend Mega Container Terminal-1 STS Cranes from 13:45 to 15:30.
            </div>
          </div>
        </div>

        {/* Gate Congestion Forecast */}
        <div className="lg:col-span-2 bg-surface rounded-xl p-5 border border-outline-variant shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-port-navy flex items-center gap-2">
              <Truck size={18} className="text-secondary" /> 24h Gate Congestion Forecast
            </h3>
            <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded-full font-bold uppercase">Live ML Model</span>
          </div>
          
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GATE_CONGESTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="predicted" name="Predicted Traffic" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorPredicted)" />
                <Area type="monotone" dataKey="actual" name="Actual Traffic" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-background rounded-lg p-3 border border-outline-variant">
              <div className="text-xs text-on-surface-variant mb-1">Predicted Peak Time</div>
              <div className="font-bold text-lg text-port-navy">12:00 - 14:00</div>
            </div>
            <div className="bg-background rounded-lg p-3 border border-outline-variant">
              <div className="text-xs text-on-surface-variant mb-1">AI Mitigation Strategy</div>
              <div className="font-bold text-sm text-success">Open Gate 4 & 5 at 11:30</div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Smart Allocation */}
      <div className="bg-surface rounded-xl p-5 border border-outline-variant shadow-card">
        <h3 className="font-semibold text-port-navy flex items-center gap-2 mb-4">
          <Anchor size={18} className="text-secondary" /> Smart Berth Allocation Optimization
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              ship: 'MSC India', 
              issue: 'Draft limitation at Berth 2', 
              solution: 'Reallocate to Multipurpose Berth-1', 
              impact: '+2.4 hrs saved'
            },
            { 
              ship: 'SCI Mumbai', 
              issue: 'Liquid cargo pipeline #2 maintenance', 
              solution: 'Route via secondary pipeline #4', 
              impact: 'Zero downtime'
            },
            { 
              ship: 'Mumbai Maersk', 
              issue: 'High yard density at Terminal 1', 
              solution: 'Pre-allocate export stack C before docking', 
              impact: '-15% turnaround time'
            },
          ].map((rec, i) => (
            <div key={i} className="border border-outline-variant rounded-lg p-4 bg-background/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
              <div className="font-bold text-port-navy mb-2">{rec.ship}</div>
              <div className="text-xs text-on-surface-variant mb-1"><span className="font-semibold">Detected Issue:</span> {rec.issue}</div>
              <div className="text-xs text-on-surface-variant mb-3"><span className="font-semibold">AI Solution:</span> {rec.solution}</div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">
                <TrendingDown size={12} /> {rec.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
