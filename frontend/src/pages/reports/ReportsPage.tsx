import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Truck, Users, Route, Package, Wrench, Fuel } from 'lucide-react';
import { reportsApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';

type ReportTab = 'fleet'|'trips'|'fuel'|'expenses'|'maintenance'|'containers'|'driver-performance';

const TABS: {id:ReportTab;label:string;icon:typeof FileText}[] = [
  { id:'fleet', label:'Fleet', icon:Truck },
  { id:'trips', label:'Trips', icon:Route },
  { id:'fuel', label:'Fuel', icon:Fuel },
  { id:'expenses', label:'Expenses', icon:FileText },
  { id:'maintenance', label:'Maintenance', icon:Wrench },
  { id:'containers', label:'Containers', icon:Package },
  { id:'driver-performance', label:'Driver Perf.', icon:Users },
];

function exportCSV(data: unknown[], filename: string) {
  if (!data?.length) return;
  const headers = Object.keys(data[0] as object);
  const rows = data.map((r:any)=>headers.map(h=>JSON.stringify(r[h]??'')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('fleet');

  const apiFns: Record<ReportTab, ()=>Promise<unknown>> = {
    'fleet': reportsApi.getFleetReport,
    'trips': reportsApi.getTripReport,
    'fuel': reportsApi.getFuelReport,
    'expenses': reportsApi.getExpenseReport,
    'maintenance': reportsApi.getMaintenanceReport,
    'containers': reportsApi.getContainerReport,
    'driver-performance': reportsApi.getDriverPerformanceReport,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['report', tab],
    queryFn: () => apiFns[tab](),
  });

  const rows: any[] = (data as any)?.data ?? [];

  const renderFleet = () => (
    <table className="data-table w-full">
      <thead><tr><th>Vehicle</th><th>Reg. No.</th><th>Type</th><th>Status</th><th>Health</th><th>Odometer</th><th>Fuel Level</th></tr></thead>
      <tbody>{rows.map((r:any,i)=>(
        <tr key={i}>
          <td className="text-data font-medium">{r.name}</td>
          <td className="text-data font-mono">{r.registrationNo}</td>
          <td className="text-data">{r.type}</td>
          <td><StatusBadge status={r.status}/></td>
          <td className="text-data">{r.healthScore}%</td>
          <td className="text-data">{r.odometer?.toLocaleString()} km</td>
          <td className="text-data">{r.fuelLevel}%</td>
        </tr>
      ))}</tbody>
    </table>
  );

  const renderTrips = () => (
    <table className="data-table w-full">
      <thead><tr><th>Trip No.</th><th>Vehicle</th><th>Driver</th><th>Source</th><th>Destination</th><th>Status</th><th>Weight</th><th>Created</th></tr></thead>
      <tbody>{rows.map((r:any,i)=>(
        <tr key={i}>
          <td className="text-data font-mono">{r.tripNumber}</td>
          <td className="text-data">{r.vehicle?.name||'—'}</td>
          <td className="text-data">{r.driver?.name||'—'}</td>
          <td className="text-data">{r.source}</td>
          <td className="text-data">{r.destination}</td>
          <td><StatusBadge status={r.status}/></td>
          <td className="text-data">{r.cargoWeight} T</td>
          <td className="text-data">{new Date(r.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  const renderFuel = () => (
    <table className="data-table w-full">
      <thead><tr><th>Vehicle</th><th>Driver</th><th>Qty (L)</th><th>Cost/L</th><th>Total (₹)</th><th>Mileage</th><th>Date</th></tr></thead>
      <tbody>{rows.map((r:any,i)=>(
        <tr key={i}>
          <td className="text-data font-medium">{r.vehicle?.name||'—'}</td>
          <td className="text-data">{r.driver?.name||'—'}</td>
          <td className="text-data">{r.quantityLitres}</td>
          <td className="text-data">₹{r.costPerLitre}</td>
          <td className="text-data font-semibold">₹{r.totalCost?.toLocaleString()}</td>
          <td className="text-data">{r.mileage||'—'}</td>
          <td className="text-data">{new Date(r.loggedAt).toLocaleDateString()}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  const renderExpenses = () => (
    <table className="data-table w-full">
      <thead><tr><th>Vehicle</th><th>Type</th><th>Amount (₹)</th><th>Description</th><th>Date</th></tr></thead>
      <tbody>{rows.map((r:any,i)=>(
        <tr key={i}>
          <td className="text-data font-medium">{r.vehicle?.name||'—'}</td>
          <td><span className="badge badge-info">{r.type}</span></td>
          <td className="text-data font-semibold">₹{r.amount?.toLocaleString()}</td>
          <td className="text-data">{r.description||'—'}</td>
          <td className="text-data">{new Date(r.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  const renderMaintenance = () => (
    <table className="data-table w-full">
      <thead><tr><th>Vehicle/Equip.</th><th>Type</th><th>Technician</th><th>Cost (₹)</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>{rows.map((r:any,i)=>(
        <tr key={i}>
          <td className="text-data font-medium">{r.vehicle?.name||r.equipment?.name||'—'}</td>
          <td><span className="badge badge-info">{r.type}</span></td>
          <td className="text-data">{r.technicianName||'—'}</td>
          <td className="text-data font-semibold">₹{r.cost?.toLocaleString()}</td>
          <td><StatusBadge status={r.status}/></td>
          <td className="text-data">{new Date(r.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  const renderContainers = () => (
    <table className="data-table w-full">
      <thead><tr><th>Container ID</th><th>Weight (T)</th><th>Priority</th><th>Dock</th><th>Warehouse</th><th>Status</th></tr></thead>
      <tbody>{rows.map((r:any,i)=>(
        <tr key={i}>
          <td className="text-data font-mono">{r.containerCode}</td>
          <td className="text-data">{r.weight}</td>
          <td><span className="badge badge-warning">{r.priority}</span></td>
          <td className="text-data">{r.sourceDock?.dockNumber||'—'}</td>
          <td className="text-data">{r.destWarehouse?.name||'—'}</td>
          <td><StatusBadge status={r.status}/></td>
        </tr>
      ))}</tbody>
    </table>
  );

  const renderDriverPerf = () => (
    <table className="data-table w-full">
      <thead><tr><th>Driver</th><th>License No.</th><th>Status</th><th>Safety Score</th><th>Experience</th><th>Completed Trips</th><th>License Expiry</th></tr></thead>
      <tbody>{rows.map((r:any,i)=>(
        <tr key={i}>
          <td className="text-data font-medium">{r.name}</td>
          <td className="text-data font-mono">{r.licenseNo}</td>
          <td><StatusBadge status={r.status}/></td>
          <td className="text-data">{r.safetyScore}/100</td>
          <td className="text-data">{r.experienceYears} yrs</td>
          <td className="text-data">{r.completedTrips||0}</td>
          <td className="text-data">{new Date(r.licenseExpiry).toLocaleDateString()}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  const RENDERERS: Record<ReportTab, ()=>JSX.Element> = {
    fleet: renderFleet, trips: renderTrips, fuel: renderFuel,
    expenses: renderExpenses, maintenance: renderMaintenance,
    containers: renderContainers, 'driver-performance': renderDriverPerf,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Reports</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Generate and export operational reports</p>
        </div>
        <button
          className="btn btn-secondary flex items-center gap-2"
          onClick={()=>exportCSV(rows, tab)}
          disabled={!rows.length}
        ><Download size={16}/>Export CSV</button>
      </div>

      <div className="card p-1 flex flex-wrap gap-1">
        {TABS.map(t=>(
          <button
            key={t.id}
            onClick={()=>setTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-body-sm font-medium transition-colors ${tab===t.id?'bg-secondary text-white':'text-on-surface-variant hover:bg-gray-100'}`}
          ><t.icon size={14}/>{t.label}</button>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-sm font-semibold capitalize">{tab.replace('-',' ')} Report</h2>
          <span className="badge badge-info">{rows.length} records</span>
        </div>
        {isLoading ? <LoadingSpinner/> : rows.length===0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <FileText size={40} className="mx-auto mb-3 opacity-30"/>
            <p>No data available for this report</p>
          </div>
        ) : (
          <div className="overflow-x-auto">{RENDERERS[tab]()}</div>
        )}
      </div>
    </div>
  );
}
