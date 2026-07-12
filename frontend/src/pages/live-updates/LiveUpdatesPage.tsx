import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ship, Anchor, Package, Truck, Waves, Activity, Clock, CheckCircle2,
  AlertCircle, Navigation, Container, ArrowRight, Zap, Radio, Eye
} from 'lucide-react';

// ─── Vadhvan Mega Port layout constants ──────────────
const PORT_DOCKS = [
  { id: 'D1', label: 'Mega Container Terminal-1', x: 52, y: 42, type: 'container' },
  { id: 'D2', label: 'Mega Container Terminal-2', x: 52, y: 50, type: 'container' },
  { id: 'D3', label: 'Multipurpose Berth-1', x: 52, y: 58, type: 'multi' },
  { id: 'D4', label: 'Liquid Cargo Berth-1', x: 52, y: 66, type: 'coal' },
];

const APPROACH_PATH = [
  { x: 8, y: 35 },   // far sea
  { x: 20, y: 38 },  // approach channel entry
  { x: 35, y: 44 },  // turning circle area
  { x: 47, y: 44 },  // near berth
];

// Ships with life cycle state
interface ShipState {
  id: string;
  name: string;
  imoNumber: string;
  cargoType: string;
  containerCount: number;
  containersLeft: number;
  priority: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  phase: 'approaching' | 'turning' | 'docking' | 'unloading' | 'reloading' | 'departing' | 'at_sea';
  phaseProgress: number; // 0-100
  dockId: string;
  pathPos: number; // 0-1 along approach path
  color: string;
  speed: number; // knots
  x: number;
  y: number;
  cycleStartTime: number;
}

interface LogEntry {
  id: string;
  time: string;
  ship: string;
  event: string;
  type: 'info' | 'success' | 'warning' | 'critical';
}

interface TruckState {
  id: string;
  shipId: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  containersCarried: number;
  visible: boolean;
}

// Phase durations in ms — slower, majestic, realistic pace (~6.25 min cycle)
const PHASE_DURATIONS: Record<string, number> = {
  approaching: 60000,   // 60s — massive ships take time to approach
  turning: 20000,       // 20s — turning circle maneuver
  docking: 25000,       // 25s — slow berth approach
  unloading: 120000,    // 2 min — heavy unloading operations
  reloading: 90000,     // 1.5 min — export loading
  departing: 60000,     // 60s — heading back to sea
  at_sea: 30000,        // 30s — spacing between cycles
};

const TOTAL_CYCLE = Object.values(PHASE_DURATIONS).reduce((a, b) => a + b, 0);

const SHIPS_DATA: Omit<ShipState, 'phase' | 'phaseProgress' | 'pathPos' | 'x' | 'y' | 'cycleStartTime'>[] = [
  {
    id: 's1', name: 'Mumbai Maersk', imoNumber: 'IMO-9780471', cargoType: 'Ultra Large Container',
    containerCount: 19038, containersLeft: 19038, priority: 'CRITICAL',
    dockId: 'D1', color: '#3B82F6', speed: 22,
  },
  {
    id: 's2', name: 'Nhava Sheva Express', imoNumber: 'IMO-9406738', cargoType: 'Containers',
    containerCount: 8530, containersLeft: 8530, priority: 'HIGH',
    dockId: 'D2', color: '#8B5CF6', speed: 19,
  },
  {
    id: 's3', name: 'MSC India', imoNumber: 'IMO-9231248', cargoType: 'Containers/General',
    containerCount: 6732, containersLeft: 6732, priority: 'MEDIUM',
    dockId: 'D3', color: '#10B981', speed: 18,
  },
  {
    id: 's4', name: 'SCI Mumbai', imoNumber: 'IMO-9419539', cargoType: 'Liquid Bulk',
    containerCount: 4200, containersLeft: 4200, priority: 'HIGH',
    dockId: 'D4', color: '#F59E0B', speed: 16,
  },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function getPathPosition(t: number, dockId: string): { x: number; y: number; angle: number } {
  const dock = PORT_DOCKS.find(d => d.id === dockId)!;
  const fullPath = [...APPROACH_PATH, { x: dock.x, y: dock.y }];
  const segments = fullPath.length - 1;
  const segT = t * segments;
  const segIdx = Math.min(Math.floor(segT), segments - 1);
  const localT = segT - segIdx;
  const from = fullPath[segIdx];
  const to = fullPath[segIdx + 1];
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
  return {
    x: lerp(from.x, to.x, localT),
    y: lerp(from.y, to.y, localT),
    angle,
  };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

const PHASE_LABELS: Record<string, string> = {
  approaching: 'Approaching Port',
  turning: 'Navigating Turn',
  docking: 'Docking at Berth',
  unloading: 'Unloading Cargo',
  reloading: 'Loading for Export',
  departing: 'Departing Port',
  at_sea: 'At Sea (Waiting)',
};

const PHASE_COLORS: Record<string, string> = {
  approaching: '#3B82F6',
  turning: '#8B5CF6',
  docking: '#F59E0B',
  unloading: '#EF4444',
  reloading: '#10B981',
  departing: '#6B7280',
  at_sea: '#1E40AF',
};

export default function LiveUpdatesPage() {
  const [ships, setShips] = useState<ShipState[]>(() =>
    SHIPS_DATA.map((s, i) => {
      const offset = (i / SHIPS_DATA.length) * TOTAL_CYCLE;
      const dock = PORT_DOCKS.find(d => d.id === s.dockId)!;
      return {
        ...s,
        phase: 'at_sea',
        phaseProgress: 0,
        pathPos: 0,
        x: 8,
        y: dock.y,
        cycleStartTime: Date.now() - offset,
      };
    })
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [trucks, setTrucks] = useState<TruckState[]>([]);
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));
  const [containersProcessed, setContainersProcessed] = useState(0);
  const [totalOperations, setTotalOperations] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const animFrame = useRef<number>(0);
  const lastTickRef = useRef<number>(Date.now());

  const addLog = useCallback((ship: string, event: string, type: LogEntry['type']) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).slice(2),
      time: formatTime(new Date()),
      ship, event, type,
    };
    setLogs(prev => [entry, ...prev].slice(0, 80));
  }, []);

  // Main simulation loop
  useEffect(() => {
    let running = true;

    function tick() {
      if (!running) return;
      const now = Date.now();
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      setCurrentTime(formatTime(new Date()));

      setShips(prev => prev.map(ship => {
        const elapsed = (now - ship.cycleStartTime) % TOTAL_CYCLE;
        let acc = 0;
        let phase: ShipState['phase'] = 'at_sea';
        let phaseElapsed = 0;

        for (const [p, dur] of Object.entries(PHASE_DURATIONS)) {
          if (elapsed < acc + dur) {
            phase = p as ShipState['phase'];
            phaseElapsed = elapsed - acc;
            break;
          }
          acc += dur;
        }

        const phaseDur = PHASE_DURATIONS[phase];
        const phaseProgress = Math.min((phaseElapsed / phaseDur) * 100, 100);

        // Log phase transitions
        const prevPhase = ship.phase;
        if (prevPhase !== phase) {
          const msgs: Record<string, { msg: string; type: LogEntry['type'] }> = {
            approaching: { msg: 'Entered approach channel at 12 knots', type: 'info' },
            turning: { msg: 'Executing turning maneuver at Turning Circle (800m DIA)', type: 'info' },
            docking: { msg: `Docking at ${PORT_DOCKS.find(d => d.id === ship.dockId)?.label}`, type: 'warning' },
            unloading: { msg: `Unloading ${ship.containerCount} containers — Cranes activated`, type: 'critical' },
            reloading: { msg: 'Loading export cargo — Trucks dispatched', type: 'success' },
            departing: { msg: 'Cleared berth — Departing port', type: 'info' },
            at_sea: { msg: 'Returned to sea lane — Awaiting next cycle', type: 'info' },
          };
          if (msgs[phase]) {
            setTimeout(() => addLog(ship.name, msgs[phase].msg, msgs[phase].type), 0);
          }
          if (phase === 'unloading') {
            setTimeout(() => setTotalOperations(n => n + 1), 0);
          }
        }

        // Position
        let x = ship.x;
        let y = ship.y;
        const dock = PORT_DOCKS.find(d => d.id === ship.dockId)!;

        if (phase === 'approaching') {
          const t = phaseElapsed / phaseDur;
          const pos = getPathPosition(t * 0.7, ship.dockId);
          x = pos.x;
          y = pos.y;
        } else if (phase === 'turning') {
          const t = phaseElapsed / phaseDur;
          const pos = getPathPosition(0.7 + t * 0.15, ship.dockId);
          x = pos.x;
          y = pos.y;
        } else if (phase === 'docking') {
          const t = phaseElapsed / phaseDur;
          const pos = getPathPosition(0.85 + t * 0.15, ship.dockId);
          x = pos.x;
          y = pos.y;
        } else if (phase === 'unloading' || phase === 'reloading') {
          x = dock.x;
          y = dock.y;
          if (phase === 'unloading') {
            const unloaded = Math.floor((phaseElapsed / phaseDur) * ship.containerCount);
            if (unloaded > 0) {
              setTimeout(() => setContainersProcessed(n => Math.max(n, unloaded + (ship.id === 's2' ? 120 : ship.id === 's3' ? 205 : 0))), 0);
            }
          }
        } else if (phase === 'departing') {
          const t = phaseElapsed / phaseDur;
          const pos = getPathPosition(1 - t * 0.9, ship.dockId);
          x = pos.x;
          y = pos.y;
        } else if (phase === 'at_sea') {
          x = 8;
          y = dock.y;
        }

        return { ...ship, phase, phaseProgress, x, y };
      }));

      // Animate trucks during unloading/reloading
      setTrucks(prev => {
        const newTrucks = [...prev];
        ships.forEach(ship => {
          if (ship.phase === 'unloading' || ship.phase === 'reloading') {
            const warehouseX = 67;
            const warehouseY = 45;
            // Spawn a truck every ~8 seconds
            const should = Math.random() < 0.003 * dt;
            if (should && newTrucks.filter(t => t.shipId === ship.id).length < 4) {
              newTrucks.push({
                id: Math.random().toString(36).slice(2),
                shipId: ship.id,
                x: ship.x,
                y: ship.y,
                targetX: warehouseX + (Math.random() - 0.5) * 6,
                targetY: warehouseY + (Math.random() - 0.5) * 8,
                progress: 0,
                containersCarried: Math.ceil(Math.random() * 5 + 1),
                visible: true,
              });
            }
          }
        });
        return newTrucks
          .map(t => ({ ...t, progress: Math.min(t.progress + dt / 8000, 1) }))
          .filter(t => t.progress < 1);
      });

      animFrame.current = requestAnimationFrame(tick);
    }

    animFrame.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(animFrame.current);
    };
  }, [addLog, ships]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Seed initial log
  useEffect(() => {
    addLog('System', 'Live Port Operations Monitor Initialized — Vadhvan GOES Port', 'info');
    addLog('System', '3 vessels tracked — Automated cycle: ~7 min per ship', 'success');
  }, []);

  const unloadingShips = ships.filter(s => s.phase === 'unloading' || s.phase === 'reloading' || s.phase === 'docking');
  const atSeaShips = ships.filter(s => s.phase === 'approaching' || s.phase === 'turning' || s.phase === 'at_sea' || s.phase === 'departing');

  return (
    <div className="min-h-screen bg-[#050D1A] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Header */}
      <div className="border-b border-white/10 bg-[#071525] px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <Radio size={16} className="text-green-400" />
          <span className="text-green-400 font-bold text-sm uppercase tracking-wider">LIVE</span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-white font-semibold">Port of Vadhvan — Real-Time Operations Monitor</span>
        <div className="ml-auto flex items-center gap-4 text-white/50 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span className="font-mono">{currentTime} IST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={13} />
            <span>{ships.length} Vessels Tracked</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">

        {/* ─── Left Panel: Port Map ──────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden bg-[#071E34] border-r border-white/10">
          {/* Map Background — ocean + port layout SVG */}
          <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Ocean */}
            <rect width="100" height="80" fill="#0A3354" />

            {/* Subtle wave pattern */}
            <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q5 5 10 10 Q15 15 20 10" stroke="#0D4A78" strokeWidth="0.3" fill="none" opacity="0.5" />
            </pattern>
            <rect width="100" height="80" fill="url(#waves)" />

            {/* Land / Port area (right side) */}
            <path d="M60 0 L100 0 L100 80 L60 80 Q55 70 55 60 Q53 50 54 40 Q55 30 57 20 Q58 10 60 0Z" fill="#1A4731" />

            {/* Port infrastructure area */}
            <rect x="47" y="30" width="16" height="42" rx="0.5" fill="#C8A96E" opacity="0.8" />

            {/* Northern Breakwater */}
            <path d="M20 25 Q32 28 48 32" stroke="#8B8B7A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="22" y="23" fontSize="2.2" fill="#8B8B7A" opacity="0.7">Northern Breakwater 3600m</text>

            {/* Southern Breakwater */}
            <path d="M20 68 Q38 67 55 70" stroke="#8B8B7A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="22" y="73" fontSize="2.2" fill="#8B8B7A" opacity="0.7">Southern Breakwater 6440m</text>

            {/* Approach Channel */}
            <path d="M8 35 Q16 37 28 40 Q36 42 46 43" stroke="#0E6AAD" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.4" />
            <text x="10" y="32" fontSize="2.5" fill="#60C5FF" opacity="0.8" transform="rotate(-10, 10, 32)">Approach Channel 280m Wide</text>

            {/* Turning circle */}
            <circle cx="36" cy="45" r="7" fill="none" stroke="#1BAFFF" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
            <text x="36" y="43.5" fontSize="2" fill="#1BAFFF" opacity="0.6" textAnchor="middle">Turning</text>
            <text x="36" y="46" fontSize="2" fill="#1BAFFF" opacity="0.6" textAnchor="middle">Circle 800m</text>

            {/* Container Berths */}
            {PORT_DOCKS.map((dock, i) => (
              <g key={dock.id}>
                <rect
                  x={dock.x - 1.5} y={dock.y - 1}
                  width="6" height="2" rx="0.3"
                  fill={dock.type === 'container' ? '#2563EB' : dock.type === 'coal' ? '#78350F' : '#059669'}
                  opacity="0.85"
                />
                <text x={dock.x + 1.5} y={dock.y + 3.5} fontSize="1.7" fill="#94A3B8" textAnchor="middle">{dock.label}</text>
              </g>
            ))}

            {/* Warehouse area */}
            <rect x="63" y="36" width="10" height="16" rx="0.5" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="0.3" opacity="0.8" />
            <text x="68" y="45" fontSize="2" fill="#93C5FD" textAnchor="middle">Container</text>
            <text x="68" y="47.5" fontSize="2" fill="#93C5FD" textAnchor="middle">Terminal</text>

            {/* Rail tracks */}
            <line x1="55" y1="68" x2="90" y2="68" stroke="#4B5563" strokeWidth="0.5" />
            <line x1="55" y1="70" x2="90" y2="70" stroke="#4B5563" strokeWidth="0.5" />
            {[60, 65, 70, 75, 80, 85].map(x => (
              <line key={x} x1={x} y1="67" x2={x} y2="71" stroke="#4B5563" strokeWidth="0.3" />
            ))}
            <text x="72" y="66" fontSize="2" fill="#6B7280" textAnchor="middle">Rail Dispatch</text>

            {/* Truck paths */}
            {trucks.map(truck => {
              const tx = lerp(truck.x, truck.targetX, truck.progress);
              const ty = lerp(truck.y, truck.targetY, truck.progress);
              const ship = ships.find(s => s.id === truck.shipId);
              return (
                <g key={truck.id}>
                  <circle cx={tx} cy={ty} r="0.8" fill={ship?.color || '#F59E0B'} opacity={0.7} />
                  <text x={tx} y={ty - 1.2} fontSize="1.5" fill={ship?.color || '#F59E0B'} textAnchor="middle" opacity={0.8}>🚛</text>
                </g>
              );
            })}

            {/* Ships */}
            {ships.map(ship => {
              const isMoving = ship.phase === 'approaching' || ship.phase === 'departing' || ship.phase === 'turning' || ship.phase === 'docking';
              const dock = PORT_DOCKS.find(d => d.id === ship.dockId)!;
              return (
                <g key={ship.id}>
                  {/* Wake trail for moving ships */}
                  {isMoving && (
                    <circle cx={ship.x} cy={ship.y} r="2" fill="none" stroke={ship.color} strokeWidth="0.3" opacity="0.2">
                      <animate attributeName="r" values="1;4" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Ship body */}
                  <g transform={`translate(${ship.x}, ${ship.y})`}>
                    {/* Glow */}
                    <circle cx="0" cy="0" r="2.5" fill={ship.color} opacity="0.15" />
                    {/* Red dot indicator */}
                    <circle cx="0" cy="0" r="1.4" fill={ship.color} stroke="white" strokeWidth="0.3">
                      {isMoving && <animate attributeName="r" values="1.2;1.6;1.2" dur="2s" repeatCount="indefinite" />}
                    </circle>
                    {/* Ship icon (unicode ship) */}
                    <text x="0" y="0.6" fontSize="2.5" textAnchor="middle" style={{ userSelect: 'none' }}>⛵</text>

                    {/* Ship name label */}
                    <g>
                      <rect x="-7" y="-7" width="14" height="4" rx="0.8" fill="#0B1F33" opacity="0.85" />
                      <text x="0" y="-3.5" fontSize="1.8" fill="white" textAnchor="middle" fontWeight="bold">
                        {ship.name.split(' ').slice(1).join(' ')}
                      </text>
                    </g>

                    {/* Status badge */}
                    <rect x="-5.5" y="2.5" width="11" height="3" rx="0.5" fill={PHASE_COLORS[ship.phase]} opacity="0.9" />
                    <text x="0" y="4.6" fontSize="1.5" fill="white" textAnchor="middle">
                      {PHASE_LABELS[ship.phase].split(' ').slice(0, 2).join(' ')}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Compass */}
            <g transform="translate(5, 6)">
              <circle cx="0" cy="0" r="3" fill="#0B1F33" stroke="#1E40AF" strokeWidth="0.3" opacity="0.8" />
              <text x="0" y="-1.2" fontSize="2.5" fill="white" textAnchor="middle" fontWeight="bold">N</text>
              <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#EF4444" strokeWidth="0.4" />
              <polygon points="0,-1.5 -0.5,0 0.5,0" fill="#EF4444" />
            </g>
          </svg>

          {/* Map overlay — stats */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {[
              { label: 'At Sea', count: atSeaShips.length, color: '#3B82F6' },
              { label: 'At Berth', count: unloadingShips.length, color: '#10B981' },
              { label: 'Trucks Active', count: trucks.length, color: '#F59E0B' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                <span className="text-white/70 text-xs">{stat.label}</span>
                <span className="text-white font-bold text-sm ml-1">{stat.count}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-white/10 text-xs">
            <div className="text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Legend</div>
            {[
              { color: '#2563EB', label: 'Container Berth' },
              { color: '#059669', label: 'Multipurpose Berth' },
              { color: '#78350F', label: 'Coal Berth' },
              { color: '#F59E0B', label: 'Active Truck' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 mb-0.5">
                <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: l.color }} />
                <span className="text-white/60">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Right Panel ──────────────────────────────────────────────── */}
        <div className="w-[400px] flex flex-col bg-[#060F1D] border-l border-white/10 overflow-hidden">

          {/* KPIs */}
          <div className="grid grid-cols-3 border-b border-white/10">
            {[
              { label: 'Containers Processed', value: containersProcessed + 265, icon: Package, color: '#3B82F6' },
              { label: 'Operations', value: totalOperations + 3, icon: Activity, color: '#10B981' },
              { label: 'Vessels Active', value: ships.filter(s => s.phase !== 'at_sea').length, icon: Ship, color: '#F59E0B' },
            ].map(kpi => (
              <div key={kpi.label} className="p-3 border-r border-white/10 last:border-r-0">
                <kpi.icon size={14} style={{ color: kpi.color }} className="mb-1" />
                <div className="text-white font-bold text-xl leading-none">{kpi.value.toLocaleString()}</div>
                <div className="text-white/40 text-[10px] mt-0.5 leading-tight">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Ship Status Cards */}
          <div className="p-3 border-b border-white/10 space-y-2 overflow-y-auto" style={{ maxHeight: '280px' }}>
            <div className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Navigation size={11} /> Vessel Tracker
            </div>
            {ships.map(ship => {
              const dock = PORT_DOCKS.find(d => d.id === ship.dockId)!;
              const isActive = ship.phase !== 'at_sea';
              return (
                <motion.div
                  key={ship.id}
                  layout
                  className="rounded-xl p-3 border"
                  style={{
                    backgroundColor: `${ship.color}12`,
                    borderColor: isActive ? ship.color + '50' : 'rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ship.color }} />
                        <span className="text-white font-semibold text-sm">{ship.name}</span>
                        {isActive && <span className="text-[9px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full font-bold">LIVE</span>}
                      </div>
                      <div className="text-white/40 text-[10px] mt-0.5">{ship.imoNumber} · {ship.cargoType}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold" style={{ color: PHASE_COLORS[ship.phase] }}>
                        {PHASE_LABELS[ship.phase]}
                      </div>
                      <div className="text-white/40 text-[10px]">{dock.label}</div>
                    </div>
                  </div>

                  {/* Phase progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                      <span>{PHASE_LABELS[ship.phase]}</span>
                      <span>{Math.round(ship.phaseProgress)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: PHASE_COLORS[ship.phase] }}
                        animate={{ width: `${ship.phaseProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Container progress */}
                  {(ship.phase === 'unloading' || ship.phase === 'reloading') && (
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <Container size={10} />
                      <span>
                        {ship.phase === 'unloading'
                          ? `Unloaded: ${Math.round((ship.phaseProgress / 100) * ship.containerCount)}/${ship.containerCount}`
                          : `Loaded for export: ${Math.round((ship.phaseProgress / 100) * 30)}/30`}
                      </span>
                    </div>
                  )}

                  {/* Truck count */}
                  {(ship.phase === 'unloading' || ship.phase === 'reloading') && trucks.filter(t => t.shipId === ship.id).length > 0 && (
                    <div className="flex items-center gap-2 text-[10px] text-amber-400/70 mt-1">
                      <Truck size={10} />
                      <span>{trucks.filter(t => t.shipId === ship.id).length} trucks dispatched to warehouse</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Live Event Log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">Event Log</span>
              <span className="ml-auto text-white/30 text-[10px]">{logs.length} events</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 text-[11px]">
              <AnimatePresence initial={false}>
                {logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 items-start rounded-lg px-2.5 py-1.5"
                    style={{
                      backgroundColor:
                        log.type === 'critical' ? 'rgba(239,68,68,0.08)' :
                        log.type === 'success' ? 'rgba(16,185,129,0.08)' :
                        log.type === 'warning' ? 'rgba(245,158,11,0.08)' :
                        'rgba(255,255,255,0.03)',
                      borderLeft: `2px solid ${
                        log.type === 'critical' ? '#EF4444' :
                        log.type === 'success' ? '#10B981' :
                        log.type === 'warning' ? '#F59E0B' :
                        '#3B82F6'
                      }`,
                    }}
                  >
                    <span className="text-white/30 font-mono whitespace-nowrap shrink-0">{log.time}</span>
                    <div>
                      <span className="font-semibold" style={{
                        color: log.type === 'critical' ? '#FCA5A5' : log.type === 'success' ? '#6EE7B7' : log.type === 'warning' ? '#FDE68A' : '#93C5FD'
                      }}>
                        {log.ship}
                      </span>
                      <span className="text-white/50 ml-1">→</span>
                      <span className="text-white/60 ml-1">{log.event}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
