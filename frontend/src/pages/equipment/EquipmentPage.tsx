import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Wrench, Zap, Truck, AlertTriangle, CheckCircle } from 'lucide-react';
import { equipmentApi } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import HealthScore from '../../components/ui/HealthScore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Equipment, EquipmentType } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  equipmentNumber: z.string().min(2),
  type: z.enum(['CRANE','FORKLIFT','REACH_STACKER','TRAILER','MATERIAL_HANDLER']),
  healthScore: z.coerce.number().min(0).max(100).optional(),
  maintenanceDue: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const TYPE_LABELS: Record<EquipmentType, string> = {
  CRANE: 'Crane', FORKLIFT: 'Forklift', REACH_STACKER: 'Reach Stacker',
  TRAILER: 'Trailer', MATERIAL_HANDLER: 'Material Handler',
};

const BORDER: Record<string, string> = {
  AVAILABLE: 'border-l-4 border-l-green-500',
  BUSY: 'border-l-4 border-l-blue-500',
  MAINTENANCE: 'border-l-4 border-l-yellow-500',
  OFFLINE: 'border-l-4 border-l-red-500',
};

export default function EquipmentPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['equipment', filterStatus],
    queryFn: () => equipmentApi.getAll(filterStatus ? { status: filterStatus } : {}),
  });

  const createMut = useMutation({
    mutationFn: (d: FormData) => equipmentApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipment'] }); closeModal(); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => equipmentApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipment'] }); closeModal(); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => equipmentApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipment'] }); setDeleteTarget(null); },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => { setEditing(null); reset({}); setShowModal(true); };
  const openEdit = (e: Equipment) => {
    setEditing(e);
    reset({ name: e.name, equipmentNumber: e.equipmentNumber, type: e.type, healthScore: e.healthScore, maintenanceDue: e.maintenanceDue?.slice(0,10) });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); reset({}); };
  const onSubmit = (d: FormData) => editing ? updateMut.mutate({ id: editing.id, data: d }) : createMut.mutate(d);

  const list: Equipment[] = (data as any)?.data ?? [];
  const filtered = list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.equipmentNumber.toLowerCase().includes(search.toLowerCase()));
  const stats = { total: list.length, available: list.filter(e=>e.status==='AVAILABLE').length, busy: list.filter(e=>e.status==='BUSY').length, maint: list.filter(e=>e.status==='MAINTENANCE').length };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Equipment Registry</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Cranes, forklifts, reach stackers and port handling equipment</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16}/>Add Equipment</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total', value: stats.total, icon: Wrench, cls:'text-secondary' },
          { label:'Available', value: stats.available, icon: CheckCircle, cls:'text-success' },
          { label:'Busy', value: stats.busy, icon: Zap, cls:'text-blue-500' },
          { label:'In Maintenance', value: stats.maint, icon: AlertTriangle, cls:'text-warning' },
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
          <input className="form-input pl-8 w-full" placeholder="Search equipment..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-input w-44" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="BUSY">Busy</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>

      {isLoading ? <LoadingSpinner/> : filtered.length===0 ? (
        <EmptyState title="No Equipment Found" description="Add equipment to start managing port assets."/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(eq => (
            <div key={eq.id} className={`card p-4 ${BORDER[eq.status]||''} hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-md bg-gray-50 text-secondary"><Wrench size={20}/></div>
                <StatusBadge status={eq.status}/>
              </div>
              <h3 className="text-title-lg font-semibold text-on-surface truncate">{eq.name}</h3>
              <p className="text-label-md text-on-surface-variant">{eq.equipmentNumber}</p>
              <p className="text-body-sm text-on-surface-variant">{TYPE_LABELS[eq.type]}</p>
              <div className="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between">
                <span className="text-label-sm text-on-surface-variant">Health</span>
                <HealthScore score={eq.healthScore}/>
              </div>
              {eq.maintenanceDue && (
                <p className="text-label-sm text-warning mt-1">Due: {new Date(eq.maintenanceDue).toLocaleDateString()}</p>
              )}
              <div className="mt-3 flex gap-2">
                <button className="btn btn-secondary text-xs flex-1" onClick={()=>openEdit(eq)}>Edit</button>
                <button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget(eq)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="text-headline-sm font-semibold">{editing?'Edit':'Add'} Equipment</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input className="form-input w-full" placeholder="Crane Alpha-1" {...register('name')}/>
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="form-label">Equipment No. *</label>
                  <input className="form-input w-full" placeholder="CR-001" {...register('equipmentNumber')}/>
                  {errors.equipmentNumber && <p className="form-error">{errors.equipmentNumber.message}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Type *</label>
                <select className="form-input w-full" {...register('type')}>
                  {Object.entries(TYPE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Health Score</label>
                  <input type="number" className="form-input w-full" placeholder="85" {...register('healthScore')}/>
                </div>
                <div>
                  <label className="form-label">Maintenance Due</label>
                  <input type="date" className="form-input w-full" {...register('maintenanceDue')}/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={createMut.isPending||updateMut.isPending}>
                  {editing?'Update':'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Equipment"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={()=>deleteTarget&&deleteMut.mutate(deleteTarget.id)}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
