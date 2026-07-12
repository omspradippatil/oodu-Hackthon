import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, portHealthApi } from '@/services/api';
import { mockKPIs, mockShips, mockDocks } from '@/utils/mockData';
import { Shield, Anchor, Activity, Clock, Ship as ShipIcon, RefreshCw, BarChart, Server } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const CommandCenterPage: React.FC = () => {
  const { data: healthData } = useQuery({
    queryKey: ['portHealth'],
    queryFn: async () => {
      try {
        const res = await portHealthApi.getScore();
        return res.data;
      } catch {
        return {
          score: 84,
          rating: 'GOOD',
          components: {
            fleetAvailability: 78,
            equipmentAvailability: 89,
            tripCompletionRate: 92,
            maintenanceUptime: 85,
            dockUtilization: 62,
          },
        };
      }
    },
  });

  const { data: ships } = useQuery({
    queryKey: ['ships-live'],
    queryFn: async () => {
      try {
        const res = await dashboardApi.getRecentActivity(); // fallback query or mock
        return mockShips;
      } catch {
        return mockShips;
      }
    },
    initialData: mockShips,
  });

  const { data: docks } = useQuery({
    queryKey: ['docks-live'],
    queryFn: async () => {
      return mockDocks;
    },
    initialData: mockDocks,
  });

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-success border-success';
    if (score >= 70) return 'text-port-blue border-port-blue';
    if (score >= 50) return 'text-warning border-warning';
    return 'text-error border-error';
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-4">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Port Command Center</h2>
          <p className="text-body-sm text-on-surface-variant">Central control room for maritime logistics & terminal ops</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Health Score Box */}
          <div className={`border-2 rounded-md px-4 py-2 bg-white flex items-center gap-3 shadow-card ${getHealthColor(healthData?.score || 84)}`}>
            <Shield size={28} />
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant/60">Port Health Score</p>
              <p className="text-headline-sm font-bold leading-none">{healthData?.score || 84}% ({healthData?.rating || 'GOOD'})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Command stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Fleet Availability</p>
          <p className="text-headline-md font-bold text-port-blue mt-1">{healthData?.components?.fleetAvailability || 78}%</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Equipment Availability</p>
          <p className="text-headline-md font-bold text-success mt-1">{healthData?.components?.equipmentAvailability || 89}%</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Trip Completion Rate</p>
          <p className="text-headline-md font-bold text-success mt-1">{healthData?.components?.tripCompletionRate || 92}%</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Maintenance Uptime</p>
          <p className="text-headline-md font-bold text-warning mt-1">{healthData?.components?.maintenanceUptime || 85}%</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-4 text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Dock Occupancy</p>
          <p className="text-headline-md font-bold text-port-blue mt-1">{healthData?.components?.dockUtilization || 62}%</p>
        </div>
      </div>

      {/* Main Terminal Visualization Map & Ships Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dock / Berth Grid visual */}
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6 lg:col-span-2">
          <h3 className="text-headline-sm font-semibold text-on-surface mb-4">Vadhvan Terminal Operations Visual</h3>
          
          {/* Berths layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {docks.map((dock) => (
              <div
                key={dock.id}
                className={`border rounded-md p-4 flex flex-col justify-between h-[120px] transition-all ${
                  dock.status === 'AVAILABLE'
                    ? 'border-success bg-success-container/10'
                    : dock.status === 'OCCUPIED'
                    ? 'border-port-blue bg-port-blue-light/10'
                    : 'border-warning bg-warning-container/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-label-md font-bold text-on-surface">{dock.dockNumber}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    dock.status === 'AVAILABLE' ? 'bg-success' : dock.status === 'OCCUPIED' ? 'bg-port-blue' : 'bg-warning'
                  }`} />
                </div>
                
                <div className="mt-2">
                  {dock.status === 'OCCUPIED' ? (
                    <div>
                      <p className="text-[11px] font-semibold text-on-surface truncate">Ship: Vadhvan Express</p>
                      <p className="text-[10px] text-on-surface-variant">Containers: {dock.containerCount}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant/60 italic">
                      {dock.status === 'AVAILABLE' ? 'Berth Vacant' : 'Under Crane Service'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Turnaround metrics */}
          <div className="border-t border-outline-variant/60 pt-6">
            <h4 className="text-label-md font-bold text-on-surface mb-4 uppercase tracking-wider">Turnaround Time KPI Monitor</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">Target Turnaround</span>
                  <Clock size={16} className="text-on-surface-variant/40" />
                </div>
                <p className="text-title-lg font-bold text-on-surface mt-1">45 Minutes</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">Average turnaround</span>
                  <Clock size={16} className="text-port-blue" />
                </div>
                <p className="text-title-lg font-bold text-on-surface mt-1">41.8 Minutes</p>
              </div>
              <div className="bg-success-container/20 p-4 rounded-md border border-success/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-success">Target Status</span>
                  <RefreshCw size={16} className="text-success animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <p className="text-title-lg font-bold text-success mt-1">EXCELLENT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Ship Traffic */}
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-headline-sm font-semibold text-on-surface mb-4">Ship Traffic Control</h3>
            <div className="space-y-4">
              {ships.map((ship) => (
                <div key={ship.id} className="border border-outline-variant/60 rounded p-3 bg-surface-container-low/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body-sm font-bold text-on-surface flex items-center gap-1.5">
                      <ShipIcon size={14} className="text-port-blue" /> {ship.name}
                    </span>
                    <StatusBadge status={ship.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-on-surface-variant">
                    <p>IMO: <span className="font-semibold text-on-surface">{ship.imoNumber}</span></p>
                    <p>Priority: <span className="font-semibold text-error uppercase">{ship.priority}</span></p>
                    <p>Berth: <span className="font-semibold text-on-surface">{ship.dockId ? `Berth ${ship.dockId}` : 'Anchorage'}</span></p>
                    <p>Loads: <span className="font-semibold text-on-surface">{ship.containerCount} TEUs</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-outline-variant/60 pt-4 mt-4">
            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Connected Gateways</h4>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant/80">
              <span className="flex items-center gap-1"><Server size={12} className="text-success" /> Cloudflare Workers</span>
              <span className="flex items-center gap-1"><Anchor size={12} className="text-success" /> Odoo Core API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenterPage;
