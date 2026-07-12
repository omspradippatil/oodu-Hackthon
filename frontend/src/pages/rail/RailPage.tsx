import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Train } from 'lucide-react';
import { railTracksApi } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { RailTrack } from '../../types';

const schema = z.object({
  trackNumber: z.string().min(1),
  capacity: z.coerce.number().min(1),
  destination: z.string().optional(),
  departureTime: z.string().optional(),
  status: z.enum(['AVAILABLE','OCCUPIED','MAINTENANCE']).optional(),
});
type FormData = z.infer<typeof schema>;

const TRACK_COLOR: Record<string,string> = {
  AVAILABLE:'border-l-4 border-l-green-500',
  OCCUPIED:'border-l-4 border-l-blue-500',
  MAINTENANCE:'border-l-4 border-l-yellow-500',
};

export default function RailPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RailTrack|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RailTrack|null>(null);

  const { data, isLoading } = useQuery({ queryKey:['rail-tracks'], queryFn:()=>railTracksApi.getAll() });

  const createMut = useMutation({ mutationFn:(d:FormData)=>railTracksApi.create(d), onSuccess:()=>{ qc.invalidateQueries({queryKey:['rail-tracks']}); closeModal(); } });
  const updateMut = useMutation({ mutationFn:({id,data}:{id:string;data:FormData})=>railTracksApi.update(id,data), onSuccess:()=>{ qc.invalidateQueries({queryKey:['rail-tracks']}); closeModal(); } });
  const deleteMut = useMutation({ mutationFn:(id:string)=>railTracksApi.delete(id), onSuccess:()=>{ qc.invalidateQueries({queryKey:['rail-tracks']}); setDeleteTarget(null); } });

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver:zodResolver(schema) });
  const openCreate = () => { setEditing(null); reset({}); setShowModal(true); };
  const openEdit = (t:RailTrack) => { setEditing(t); reset({ trackNumber:t.trackNumber, capacity:t.capacity, destination:t.destination, departureTime:t.departureTime?.slice(0,16), status:t.status }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); reset({}); };
  const onSubmit = (d:FormData) => editing?updateMut.mutate({id:editing.id,data:d}):createMut.mutate(d);

  const list: RailTrack[] = (data as any)?.data ?? [];
  const stats = { available:list.filter(t=>t.status==='AVAILABLE').length, occupied:list.filter(t=>t.status==='OCCUPIED').length, maintenance:list.filter(t=>t.status==='MAINTENANCE').length };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Rail Dispatch</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Manage rail tracks and container dispatch schedules</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16}/>Add Track</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Available', value:stats.available, cls:'text-success' },
          { label:'Occupied', value:stats.occupied, cls:'text-secondary' },
          { label:'Maintenance', value:stats.maintenance, cls:'text-warning' },
        ].map(k=>(
          <div key={k.label} className="card p-4">
            <p className="text-label-md text-on-surface-variant">{k.label}</p>
            <p className={`text-4xl font-bold mt-2 ${k.cls}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {isLoading ? <LoadingSpinner/> : list.length===0 ? (
        <EmptyState title="No Rail Tracks" description="Add rail tracks to manage dispatch operations."/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(track=>(
            <div key={track.id} className={`card p-5 ${TRACK_COLOR[track.status]||''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-50 text-secondary"><Train size={20}/></div>
                  <div>
                    <h3 className="text-title-lg font-bold text-on-surface">Track {track.trackNumber}</h3>
                    <StatusBadge status={track.status}/>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Capacity:</span>
                  <span className="font-medium">{track.capacity} TEU</span>
                </div>
                {track.destination && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Destination:</span>
                    <span className="font-medium">{track.destination}</span>
                  </div>
                )}
                {track.departureTime && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Departure:</span>
                    <span className="font-medium">{new Date(track.departureTime).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Containers:</span>
                  <span className="font-medium">{track.containerIds?.length || 0}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2 pt-3 border-t border-outline-variant">
                <button className="btn btn-secondary text-xs flex-1" onClick={()=>openEdit(track)}>Edit</button>
                <button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget(track)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="text-headline-sm font-semibold">{editing?'Edit':'Add'} Rail Track</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Track Number *</label>
                  <input className="form-input w-full" placeholder="T-01" {...register('trackNumber')}/>
                </div>
                <div>
                  <label className="form-label">Capacity (TEU) *</label>
                  <input type="number" className="form-input w-full" {...register('capacity')}/>
                </div>
              </div>
              <div>
                <label className="form-label">Destination</label>
                <input className="form-input w-full" placeholder="Mumbai Junction" {...register('destination')}/>
              </div>
              <div>
                <label className="form-label">Departure Time</label>
                <input type="datetime-local" className="form-input w-full" {...register('departureTime')}/>
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
        title="Delete Track"
        message={`Remove Track ${deleteTarget?.trackNumber}?`}
        onConfirm={()=>deleteTarget&&deleteMut.mutate(deleteTarget.id)}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
