import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Warehouse, Package } from 'lucide-react';
import { warehousesApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Warehouse } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  capacity: z.coerce.number().min(1),
  availableSpace: z.coerce.number().min(0).optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
});
type FormData = z.infer<typeof schema>;

export default function WarehousesPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Warehouse|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Warehouse|null>(null);

  const { data, isLoading } = useQuery({ queryKey:['warehouses'], queryFn:()=>warehousesApi.getAll() });

  const createMut = useMutation({ mutationFn:(d:FormData)=>warehousesApi.create(d), onSuccess:()=>{ qc.invalidateQueries({queryKey:['warehouses']}); closeModal(); } });
  const updateMut = useMutation({ mutationFn:({id,data}:{id:string;data:FormData})=>warehousesApi.update(id,data), onSuccess:()=>{ qc.invalidateQueries({queryKey:['warehouses']}); closeModal(); } });
  const deleteMut = useMutation({ mutationFn:(id:string)=>warehousesApi.delete(id), onSuccess:()=>{ qc.invalidateQueries({queryKey:['warehouses']}); setDeleteTarget(null); } });

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver:zodResolver(schema) });
  const openCreate = () => { setEditing(null); reset({}); setShowModal(true); };
  const openEdit = (w:Warehouse) => { setEditing(w); reset({ name:w.name, capacity:w.capacity, availableSpace:w.availableSpace, locationLat:w.locationLat, locationLng:w.locationLng }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); reset({}); };
  const onSubmit = (d:FormData) => editing?updateMut.mutate({id:editing.id,data:d}):createMut.mutate(d);

  const list: Warehouse[] = (data as any)?.data ?? [];
  const totalCapacity = list.reduce((s,w)=>s+w.capacity,0);
  const totalOccupied = list.reduce((s,w)=>s+w.occupiedSpace,0);

  const getUtilPct = (w:Warehouse) => w.capacity>0 ? Math.round((w.occupiedSpace/w.capacity)*100) : 0;
  const getBarColor = (pct:number) => pct>90?'bg-red-500':pct>70?'bg-yellow-500':'bg-green-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Warehouses</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Monitor storage capacity and container allocation</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16}/>Add Warehouse</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Warehouses', value:list.length, icon:Warehouse },
          { label:'Total Capacity', value:`${totalCapacity.toLocaleString()} TEU`, icon:Package },
          { label:'Occupied Space', value:`${totalOccupied.toLocaleString()} TEU`, icon:Package },
        ].map(k=>(
          <div key={k.label} className="card p-4 flex items-center gap-3">
            <div className="p-2 rounded-md bg-gray-50 text-secondary"><k.icon size={20}/></div>
            <div>
              <p className="text-label-md text-on-surface-variant">{k.label}</p>
              <p className="text-headline-sm font-bold text-on-surface">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? <LoadingSpinner/> : list.length===0 ? (
        <EmptyState title="No Warehouses" description="Add warehouses to manage container storage."/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(w=>{
            const pct = getUtilPct(w);
            return (
              <div key={w.id} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gray-50 text-secondary"><Warehouse size={20}/></div>
                    <div>
                      <h3 className="text-title-lg font-bold text-on-surface">{w.name}</h3>
                      {w.locationLat && <p className="text-label-sm text-on-surface-variant">{w.locationLat.toFixed(4)}, {w.locationLng?.toFixed(4)}</p>}
                    </div>
                  </div>
                  <span className={`text-label-sm font-bold ${pct>90?'text-red-500':pct>70?'text-yellow-600':'text-green-600'}`}>{pct}%</span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-label-sm text-on-surface-variant mb-1">
                    <span>Utilization</span>
                    <span>{w.occupiedSpace.toLocaleString()} / {w.capacity.toLocaleString()} TEU</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${getBarColor(pct)}`} style={{width:`${pct}%`}}/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-body-sm">
                  <div className="bg-green-50 rounded p-2 text-center">
                    <p className="text-label-sm text-on-surface-variant">Available</p>
                    <p className="font-bold text-green-600">{w.availableSpace.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded p-2 text-center">
                    <p className="text-label-sm text-on-surface-variant">Occupied</p>
                    <p className="font-bold text-blue-600">{w.occupiedSpace.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 pt-3 border-t border-outline-variant">
                  <button className="btn btn-secondary text-xs flex-1" onClick={()=>openEdit(w)}>Edit</button>
                  <button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget(w)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="text-headline-sm font-semibold">{editing?'Edit':'Add'} Warehouse</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="form-label">Warehouse Name *</label>
                <input className="form-input w-full" placeholder="Warehouse A" {...register('name')}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Capacity (TEU) *</label>
                  <input type="number" className="form-input w-full" {...register('capacity')}/>
                </div>
                <div>
                  <label className="form-label">Available Space</label>
                  <input type="number" className="form-input w-full" {...register('availableSpace')}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Latitude</label>
                  <input type="number" step="0.0001" className="form-input w-full" {...register('locationLat')}/>
                </div>
                <div>
                  <label className="form-label">Longitude</label>
                  <input type="number" step="0.0001" className="form-input w-full" {...register('locationLng')}/>
                </div>
              </div>
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
        title="Delete Warehouse"
        message={`Remove "${deleteTarget?.name}"?`}
        onConfirm={()=>deleteTarget&&deleteMut.mutate(deleteTarget.id)}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
