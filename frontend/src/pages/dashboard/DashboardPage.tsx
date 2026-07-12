import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';
import { mockKPIs, mockCharts } from '@/utils/mockData';
import KPICard from '@/components/ui/KPICard';
import AreaChartWidget from '@/components/charts/AreaChartWidget';
import BarChartWidget from '@/components/charts/BarChartWidget';
import PieChartWidget from '@/components/charts/PieChartWidget';
import LineChartWidget from '@/components/charts/LineChartWidget';
import GlobalVesselMap from '@/components/maps/GlobalVesselMap';
import {
  Truck,
  Users,
  Route,
  Activity,
  Droplet,
  Package,
  Anchor,
  Wrench,
  AlertTriangle,
  Flame,
  CheckCircle,
  Clock,
  Gauge,
  Boxes,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  // Fetch KPIs from API
  const { data: kpiData, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      try {
        const res = await dashboardApi.getKPIs();
        return res.data;
      } catch {
        return mockKPIs;
      }
    },
    initialData: mockKPIs,
  });

  // Fetch Chart Data from API
  const { data: chartData, isLoading: chartsLoading } = useQuery({
    queryKey: ['charts'],
    queryFn: async () => {
      try {
        const res = await dashboardApi.getCharts();
        return res.data;
      } catch {
        return mockCharts;
      }
    },
    initialData: mockCharts,
  });

  // Calculate Health rating color
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-success bg-success-container';
    if (score >= 70) return 'text-port-blue bg-port-blue-light';
    if (score >= 50) return 'text-warning bg-warning-container';
    return 'text-error bg-error-container';
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-4">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Operations Control</h2>
          <p className="text-body-sm text-on-surface-variant">Real-time resource synchronization & transit metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-dot"></span>
          <span className="text-label-md font-bold text-success uppercase tracking-wider">System Live</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Vehicles"
          value={kpiData?.vehicles?.onTrip ?? 0}
          icon={<Truck size={20} className="text-port-blue" />}
          trend="72% Utilised"
          trendDirection="up"
        />
        <KPICard
          title="Available Vehicles"
          value={kpiData?.vehicles?.available ?? 0}
          icon={<Truck size={20} className="text-success" />}
          subtitle="Ready for dispatch"
        />
        <KPICard
          title="In Maintenance"
          value={kpiData?.vehicles?.inShop ?? 0}
          icon={<Wrench size={20} className="text-warning" />}
          subtitle="Estimated release: 4 hrs"
        />
        <KPICard
          title="Active Trips"
          value={kpiData?.trips?.active ?? 0}
          icon={<Route size={20} className="text-port-blue" />}
          trend="+5 this hr"
          trendDirection="up"
        />
        <KPICard
          title="Pending Trips"
          value={kpiData?.trips?.pending ?? 0}
          icon={<Clock size={20} className="text-warning" />}
          subtitle="Awaiting dispatch approval"
        />
        <KPICard
          title="Drivers On Duty"
          value={kpiData?.drivers?.onDuty ?? 0}
          icon={<Users size={20} className="text-success" />}
          subtitle="16 currently available"
        />
        <KPICard
          title="Fuel Cost Today"
          value={`₹${kpiData?.fuel?.costToday ?? 0}`}
          icon={<Droplet size={20} className="text-warning" />}
          trend="-2.4% avg"
          trendDirection="down"
        />
        <KPICard
          title="Completed Deliveries"
          value={kpiData?.trips?.completed ?? 0}
          icon={<CheckCircle size={20} className="text-success" />}
          subtitle="Today's total throughput"
        />
      </div>

      {/* Global Vessel Map */}
      <div className="bg-white border border-outline-variant rounded-md shadow-card p-6 h-[400px]">
        <GlobalVesselMap />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-sm font-semibold text-on-surface">Fleet Utilization Trend</h3>
            <span className="text-[10px] text-on-surface-variant font-semibold uppercase bg-surface-container px-2 py-1 rounded">Weekly</span>
          </div>
          <AreaChartWidget data={chartData?.fleetUtilization || []} />
        </div>

        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-sm font-semibold text-on-surface">Fuel Consumption (Liters)</h3>
            <span className="text-[10px] text-on-surface-variant font-semibold uppercase bg-surface-container px-2 py-1 rounded">Daily</span>
          </div>
          <BarChartWidget data={chartData?.fuelConsumption || []} />
        </div>

        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-sm font-semibold text-on-surface">Trips Velocity</h3>
            <span className="text-[10px] text-on-surface-variant font-semibold uppercase bg-surface-container px-2 py-1 rounded">Trips/Day</span>
          </div>
          <LineChartWidget data={chartData?.tripsPerDay || []} />
        </div>

        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-sm font-semibold text-on-surface">Vehicle Status Distribution</h3>
            <span className="text-[10px] text-on-surface-variant font-semibold uppercase bg-surface-container px-2 py-1 rounded">Current</span>
          </div>
          <PieChartWidget data={chartData?.vehicleStatus || []} />
        </div>
      </div>

      {/* Bottom Layout split: Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Recent Activities */}
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6 lg:col-span-2">
          <h3 className="text-headline-sm font-semibold text-on-surface mb-4">Recent Control Actions</h3>
          <div className="space-y-4">
            <div className="flex gap-3 border-b border-outline-variant/40 pb-3">
              <div className="p-1.5 bg-success-container text-success rounded-md h-fit">
                <CheckCircle size={16} />
              </div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-on-surface">Trip TRIP-00024 Completed</p>
                <p className="text-xs text-on-surface-variant">Driver Sanjay Shinde returned vehicle MH-04-GP-5847 safely.</p>
              </div>
              <span className="text-[10px] text-on-surface-variant/60 font-medium">10 mins ago</span>
            </div>

            <div className="flex gap-3 border-b border-outline-variant/40 pb-3">
              <div className="p-1.5 bg-port-blue-light text-port-blue rounded-md h-fit">
                <Truck size={16} />
              </div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-on-surface">Vehicle MH-04-GP-1024 Assigned</p>
                <p className="text-xs text-on-surface-variant">Recommended for Container Request CR-284 at Dock 1.</p>
              </div>
              <span className="text-[10px] text-on-surface-variant/60 font-medium">25 mins ago</span>
            </div>

            <div className="flex gap-3 pb-2">
              <div className="p-1.5 bg-warning-container text-warning rounded-md h-fit">
                <Wrench size={16} />
              </div>
              <div className="flex-1">
                <p className="text-body-sm font-semibold text-on-surface">Maintenance log opened for QC-01</p>
                <p className="text-xs text-on-surface-variant">Technician Assigned: Ramesh Patel for Quay Crane hydraulic service.</p>
              </div>
              <span className="text-[10px] text-on-surface-variant/60 font-medium">1 hr ago</span>
            </div>
          </div>
        </div>

        {/* Live Alerts */}
        <div className="bg-white border border-outline-variant rounded-md shadow-card p-6">
          <h3 className="text-headline-sm font-semibold text-on-surface mb-4">Operations Warning Feed</h3>
          <div className="space-y-3">
            <div className="alert-error text-xs p-3">
              <div className="flex gap-2 items-start">
                <AlertTriangle size={14} className="mt-0.5" />
                <div>
                  <p className="font-bold">Dock Congestion Warning</p>
                  <p className="text-[11px] text-error/80 mt-0.5">Dock 2 container queue is exceeding target throughput speed.</p>
                </div>
              </div>
            </div>

            <div className="alert-warning text-xs p-3">
              <div className="flex gap-2 items-start">
                <AlertTriangle size={14} className="mt-0.5" />
                <div>
                  <p className="font-bold">Driver License Expiry Alert</p>
                  <p className="text-[11px] text-warning/80 mt-0.5">Driver Amit Mishra license expires in 28 days.</p>
                </div>
              </div>
            </div>

            <div className="alert-info text-xs p-3">
              <div className="flex gap-2 items-start">
                <Activity size={14} className="mt-0.5" />
                <div>
                  <p className="font-bold">Cloudflare Sync Active</p>
                  <p className="text-[11px] text-port-blue/80 mt-0.5">Worker synchronizing dashboard status from worker.dev</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
