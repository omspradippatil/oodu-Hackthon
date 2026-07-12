import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Anchor } from 'lucide-react';
import { docksApi } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Dock } from '../../types';

const schema = z.object({
  dockNumber: z.string().min(1),
  status: z.enum(['AVAILABLE','OCCUPIED','MAINTENANCE']).optional(),
});
type FormData = z.infer<typeof schema>;

const STATUS_COLOR: Record<string,string> = {
  AVAILABLE:'bg-green-50 border-green-200',
  OCCUPIED:'bg-blue-50 border-blue-200',
  MAINTENANCE:'bg-yellow-50 border-yellow-200',
};

export default function DocksPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Dock|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dock|null>(null);

  const { data, isLoading } = useQuery({ queryKey:['docks'], queryFn:()=>docksApi.getAll() });

  const createMut = useMutation({ mutationFn:(d:FormData)=>docksApi.create(d), onSuccess:()=>{ qc.invalidateQueries({queryKey:['docks']}); closeModal(); } });
  const updateMut = useMutation({ mutationFn:({id,data}:{id:string;data:FormData})=>docksApi.update(id,data), onSuccess:()=>{ qc.invalidateQueries({queryKey:['docks']}); closeModal(); } });
  const deleteMut = useMutation({ mutationFn:(id:string)=>docksApi.delete(id), onSuccess:()=>{ qc.invalidateQueries({queryKey:['docks']}); setDeleteTarget(null); } });

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver:zodResolver(schema) });
  const openCreate = () => { setEditing(null); reset({}); setShowModal(true); };
  const openEdit = (d:Dock) => { setEditing(d); reset({ dockNumber:d.dockNumber, status:d.status }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); reset({}); };
  const onSubmit = (d:FormData) => editing?updateMut.mutate({id:editing.id,data:d}):createMut.mutate(d);

  const list: Dock[] = (data as any)?.data ?? [];
  const stats = { available:list.filter(d=>d.status==='AVAILABLE').length, occupied:list.filter(d=>d.status==='OCCUPIED').length, maintenance:list.filter(d=>d.status==='MAINTENANCE').length };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Dock Management</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Monitor and manage all port berths and docking stations</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16}/>Add Dock</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Available', value:stats.available, cls:'text-success', bg:'bg-green-50' },
          { label:'Occupied', value:stats.occupied, cls:'text-secondary', bg:'bg-blue-50' },
          { label:'Maintenance', value:stats.maintenance, cls:'text-warning', bg:'bg-yellow-50' },
        ].map(k=>(
          <div key={k.label} className={`card p-5 ${k.bg}`}>
            <p className="text-label-md text-on-surface-variant">{k.label}</p>
            <p className={`text-4xl font-bold mt-2 ${k.cls}`}>{k.value}</p>
            <p className="text-body-sm text-on-surface-variant mt-1">of {list.length} total docks</p>
          </div>
        ))}
      </div>

      {isLoading ? <LoadingSpinner/> : list.length===0 ? (
        <EmptyState title="No Docks" description="Add docks to start managing port berths."/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(dock=>(
            <div key={dock.id} className={`card p-5 border ${STATUS_COLOR[dock.status]||''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-white shadow-sm"><Anchor size={20} className="text-secondary"/></div>
                  <div>
                    <h3 className="text-title-lg font-bold text-on-surface">Dock {dock.dockNumber}</h3>
                    <StatusBadge status={dock.status}/>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {dock.assignedShip && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Ship:</span>
                    <span className="font-medium text-on-surface">{dock.assignedShip.name}</span>
                  </div>
                )}
                {dock.assignedCrane && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Crane:</span>
                    <span className="font-medium text-on-surface">{dock.assignedCrane.name}</span>
                  </div>
                )}
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Containers:</span>
                  <span className="font-medium text-on-surface">{dock.containerCount}</span>
                </div>
                {dock.estimatedCompletion && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Est. Complete:</span>
                    <span className="font-medium text-on-surface">{new Date(dock.estimatedCompletion).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2 pt-3 border-t border-white/50">
                <button className="btn btn-secondary text-xs flex-1" onClick={()=>openEdit(dock)}>Edit</button>
                <button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget(dock)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="text-headline-sm font-semibold">{editing?'Edit':'Add'} Dock</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="form-label">Dock Number *</label>
                <input className="form-input w-full" placeholder="e.g. B-01" {...register('dockNumber')}/>
              </div>
              {editing && (
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input w-full" {...register('status')}>
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={createMut.isPending||updateMut.isPending}>{editing?'Update':'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Dock"
        message={`Remove Dock ${deleteTarget?.dockNumber}?`}
        onConfirm={()=>deleteTarget&&deleteMut.mutate(deleteTarget.id)}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
