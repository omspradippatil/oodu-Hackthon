import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { maintenanceApi, vehiclesApi, equipmentApi } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { MaintenanceLog } from '../../types';

const schema = z.object({
  vehicleId: z.string().optional(),
  equipmentId: z.string().optional(),
  type: z.enum(['OIL_CHANGE','INSPECTION','TYRE_REPLACEMENT','BRAKE_SERVICE','ENGINE_SERVICE','REPAIR','SCHEDULED','EMERGENCY']),
  description: z.string().min(5),
  technicianName: z.string().optional(),
  scheduledAt: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const TYPE_LABELS: Record<string, string> = {
  OIL_CHANGE:'Oil Change', INSPECTION:'Inspection', TYRE_REPLACEMENT:'Tyre Replacement',
  BRAKE_SERVICE:'Brake Service', ENGINE_SERVICE:'Engine Service', REPAIR:'Repair',
  SCHEDULED:'Scheduled', EMERGENCY:'Emergency',
};

const STATUS_COLOR: Record<string, string> = {
  OPEN:'border-l-4 border-l-yellow-500',
  IN_PROGRESS:'border-l-4 border-l-blue-500',
  COMPLETED:'border-l-4 border-l-green-500',
};

export default function MaintenancePage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [closeTarget, setCloseTarget] = useState<MaintenanceLog | null>(null);
  const [closeCost, setCloseCost] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceLog | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['maintenance', filterStatus],
    queryFn: () => maintenanceApi.getAll(filterStatus ? { status: filterStatus } : {}),
  });

  const { data: vehicles } = useQuery({ queryKey: ['vehicles-all'], queryFn: () => vehiclesApi.getAll() });
  const { data: equipment } = useQuery({ queryKey: ['equipment-all'], queryFn: () => equipmentApi.getAll() });

  const createMut = useMutation({
    mutationFn: (d: FormData) => maintenanceApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['maintenance'] }); qc.invalidateQueries({ queryKey: ['vehicles'] }); closeModal(); },
  });
  const closeMut = useMutation({
    mutationFn: ({ id, cost }: { id: string; cost: number }) => maintenanceApi.close(id, cost),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['maintenance'] }); qc.invalidateQueries({ queryKey: ['vehicles'] }); setCloseTarget(null); setCloseCost(''); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => maintenanceApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['maintenance'] }); setDeleteTarget(null); },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const closeModal = () => { setShowModal(false); reset({}); };
  const onSubmit = (d: FormData) => createMut.mutate(d);

  const list: MaintenanceLog[] = (data as any)?.data ?? [];
  const filtered = list.filter(m =>
    m.description.toLowerCase().includes(search.toLowerCase()) ||
    (m.vehicle?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (m.technicianName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    open: list.filter(m=>m.status==='OPEN').length,
    inProgress: list.filter(m=>m.status==='IN_PROGRESS').length,
    completed: list.filter(m=>m.status==='COMPLETED').length,
    totalCost: list.reduce((s,m)=>s+(m.cost||0),0),
  };

  const vehicleList: any[] = (vehicles as any)?.data ?? [];
  const equipList: any[] = (equipment as any)?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Maintenance</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Track vehicle and equipment service records</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={()=>setShowModal(true)}><Plus size={16}/>New Maintenance</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Open', value: stats.open, icon: AlertTriangle, cls:'text-warning' },
          { label:'In Progress', value: stats.inProgress, icon: Clock, cls:'text-blue-500' },
          { label:'Completed', value: stats.completed, icon: CheckCircle, cls:'text-success' },
          { label:'Total Cost', value: `₹${stats.totalCost.toLocaleString()}`, icon: Wrench, cls:'text-secondary' },
        ].map(k => (
          <div key={k.label} className="card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-md bg-gray-50 ${k.cls}`}><k.icon size={20}/></div>
            <div>
              <p className="text-label-md text-on-surface-variant">{k.label}</p>
              <p className="text-headline-sm font-bold text-on-surface">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
          <input className="form-input pl-8 w-full" placeholder="Search records..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-input w-44" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {isLoading ? <LoadingSpinner/> : filtered.length===0 ? (
        <EmptyState title="No Maintenance Records" description="Create a maintenance record to get started."/>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Vehicle / Equipment</th>
                <th>Type</th>
                <th>Description</th>
                <th>Technician</th>
                <th>Cost (₹)</th>
                <th>Status</th>
                <th>Scheduled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={STATUS_COLOR[m.status]||''}>
                  <td className="text-data font-medium">
                    {m.vehicle?.name || m.equipment?.name || '—'}
                  </td>
                  <td><span className="badge badge-info">{TYPE_LABELS[m.type]||m.type}</span></td>
                  <td className="text-data max-w-xs truncate">{m.description}</td>
                  <td className="text-data">{m.technicianName||'—'}</td>
                  <td className="text-data">₹{(m.cost||0).toLocaleString()}</td>
                  <td><StatusBadge status={m.status}/></td>
                  <td className="text-data">{m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="flex gap-1">
                      {m.status !== 'COMPLETED' && (
                        <button
                          className="btn btn-success text-xs"
                          onClick={()=>{ setCloseTarget(m); setCloseCost(''); }}
                        >Close</button>
                      )}
                      <button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget(m)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="text-headline-sm font-semibold">New Maintenance Record</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">Opening this will set vehicle status to In Shop</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Vehicle</label>
                  <select className="form-input w-full" {...register('vehicleId')}>
                    <option value="">None</option>
                    {vehicleList.map((v:any)=><option key={v.id} value={v.id}>{v.name} ({v.registrationNo})</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Equipment</label>
                  <select className="form-input w-full" {...register('equipmentId')}>
                    <option value="">None</option>
                    {equipList.map((e:any)=><option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Maintenance Type *</label>
                <select className="form-input w-full" {...register('type')}>
                  {Object.entries(TYPE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Description *</label>
                <textarea className="form-input w-full" rows={3} placeholder="Describe the maintenance work..." {...register('description')}/>
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Technician Name</label>
                  <input className="form-input w-full" placeholder="John Smith" {...register('technicianName')}/>
                </div>
                <div>
                  <label className="form-label">Scheduled Date</label>
                  <input type="date" className="form-input w-full" {...register('scheduledAt')}/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={createMut.isPending}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Maintenance Modal */}
      {closeTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-headline-sm font-semibold">Close Maintenance</h2>
            <p className="text-body-sm text-on-surface-variant">Enter the final repair cost to close this record. Vehicle will return to Available.</p>
            <div>
              <label className="form-label">Final Cost (₹)</label>
              <input type="number" className="form-input w-full" placeholder="0" value={closeCost} onChange={e=>setCloseCost(e.target.value)}/>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-secondary flex-1" onClick={()=>setCloseTarget(null)}>Cancel</button>
              <button
                className="btn btn-success flex-1"
                disabled={closeMut.isPending}
                onClick={()=>closeMut.mutate({ id: closeTarget.id, cost: parseFloat(closeCost)||0 })}
              >Close Record</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Record"
        message={`Delete this maintenance record? This cannot be undone.`}
        onConfirm={()=>deleteTarget&&deleteMut.mutate(deleteTarget.id)}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
