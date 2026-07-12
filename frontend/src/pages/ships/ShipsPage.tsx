import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Ship as ShipIcon, Anchor, LogOut } from 'lucide-react';
import { shipsApi, docksApi } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Ship } from '../../types';

const schema = z.object({
  imoNumber: z.string().min(3),
  name: z.string().min(2),
  arrivalTime: z.string().min(1),
  expectedDeparture: z.string().optional(),
  containerCount: z.coerce.number().min(0),
  priority: z.enum(['LOW','MEDIUM','HIGH','CRITICAL']),
  cargoType: z.string().min(2),
  shipLength: z.coerce.number().optional(),
  shipWidth: z.coerce.number().optional(),
  draft: z.coerce.number().optional(),
});
type FormData = z.infer<typeof schema>;

const PRIORITY_BADGE: Record<string,string> = {
  LOW:'badge badge-neutral', MEDIUM:'badge badge-info', HIGH:'badge badge-warning', CRITICAL:'badge badge-error',
};

export default function ShipsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Ship|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ship|null>(null);
  const [dockTarget, setDockTarget] = useState<Ship|null>(null);
  const [selectedDock, setSelectedDock] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['ships', filterStatus],
    queryFn: () => shipsApi.getAll(filterStatus?{status:filterStatus}:{}),
  });
  const { data: docks } = useQuery({ queryKey:['docks-avail'], queryFn:()=>docksApi.getAll({status:'AVAILABLE'}) });

  const createMut = useMutation({ mutationFn:(d:FormData)=>shipsApi.create(d), onSuccess:()=>{ qc.invalidateQueries({queryKey:['ships']}); closeModal(); } });
  const updateMut = useMutation({ mutationFn:({id,data}:{id:string;data:FormData})=>shipsApi.update(id,data), onSuccess:()=>{ qc.invalidateQueries({queryKey:['ships']}); closeModal(); } });
  const deleteMut = useMutation({ mutationFn:(id:string)=>shipsApi.delete(id), onSuccess:()=>{ qc.invalidateQueries({queryKey:['ships']}); setDeleteTarget(null); } });
  const dockMut = useMutation({ mutationFn:({id,dockId}:{id:string;dockId:string})=>shipsApi.dockShip(id,dockId), onSuccess:()=>{ qc.invalidateQueries({queryKey:['ships']}); qc.invalidateQueries({queryKey:['docks']}); setDockTarget(null); } });
  const departMut = useMutation({ mutationFn:(id:string)=>shipsApi.departShip(id), onSuccess:()=>{ qc.invalidateQueries({queryKey:['ships']}); qc.invalidateQueries({queryKey:['docks']}); } });

  const { register, handleSubmit, reset, formState:{errors} } = useForm<FormData>({ resolver:zodResolver(schema) });
  const openCreate = () => { setEditing(null); reset({}); setShowModal(true); };
  const openEdit = (s:Ship) => {
    setEditing(s);
    reset({ imoNumber:s.imoNumber, name:s.name, arrivalTime:s.arrivalTime.slice(0,16), expectedDeparture:s.expectedDeparture?.slice(0,16), containerCount:s.containerCount, priority:s.priority, cargoType:s.cargoType, shipLength:s.shipLength, shipWidth:s.shipWidth, draft:s.draft });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); reset({}); };
  const onSubmit = (d:FormData) => editing?updateMut.mutate({id:editing.id,data:d}):createMut.mutate(d);

  const list: Ship[] = (data as any)?.data ?? [];
  const filtered = list.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.imoNumber.toLowerCase().includes(search.toLowerCase()));
  const dockList: any[] = (docks as any)?.data ?? [];

  const stats = {
    waiting: list.filter(s=>s.status==='WAITING').length,
    docked: list.filter(s=>s.status==='DOCKED'||s.status==='LOADING'||s.status==='UNLOADING').length,
    completed: list.filter(s=>s.status==='COMPLETED'||s.status==='DEPARTED').length,
    containers: list.reduce((s,sh)=>s+sh.containerCount,0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Ship Arrivals</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Manage incoming vessels and port arrivals</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16}/>Add Ship</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Waiting', value:stats.waiting, cls:'text-warning' },
          { label:'At Dock', value:stats.docked, cls:'text-success' },
          { label:'Departed', value:stats.completed, cls:'text-on-surface-variant' },
          { label:'Total Containers', value:stats.containers, cls:'text-secondary' },
        ].map(k=>(
          <div key={k.label} className="card p-4">
            <p className="text-label-md text-on-surface-variant">{k.label}</p>
            <p className={`text-headline-md font-bold mt-1 ${k.cls}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
          <input className="form-input pl-8 w-full" placeholder="Search ships..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-input w-44" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="WAITING">Waiting</option>
          <option value="DOCKED">Docked</option>
          <option value="LOADING">Loading</option>
          <option value="UNLOADING">Unloading</option>
          <option value="DEPARTED">Departed</option>
        </select>
      </div>

      {isLoading ? <LoadingSpinner/> : filtered.length===0 ? (
        <EmptyState title="No Ships" description="Register ship arrivals to begin port operations."/>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table w-full">
            <thead><tr>
              <th>IMO No.</th><th>Ship Name</th><th>Cargo Type</th><th>Containers</th>
              <th>Priority</th><th>Arrival</th><th>Dock</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td className="text-data font-mono">{s.imoNumber}</td>
                  <td className="text-data font-semibold flex items-center gap-2"><ShipIcon size={14} className="text-secondary"/>{s.name}</td>
                  <td className="text-data">{s.cargoType}</td>
                  <td className="text-data">{s.containerCount}</td>
                  <td><span className={PRIORITY_BADGE[s.priority]||'badge'}>{s.priority}</span></td>
                  <td className="text-data">{new Date(s.arrivalTime).toLocaleString()}</td>
                  <td className="text-data">{s.dock?.dockNumber||'—'}</td>
                  <td><StatusBadge status={s.status}/></td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      <button className="btn btn-secondary text-xs" onClick={()=>openEdit(s)}>Edit</button>
                      {(s.status==='WAITING') && (
                        <button className="btn btn-success text-xs flex items-center gap-1" onClick={()=>setDockTarget(s)}><Anchor size={12}/>Dock</button>
                      )}
                      {(s.status==='DOCKED'||s.status==='LOADING'||s.status==='UNLOADING') && (
                        <button className="btn btn-ghost text-xs flex items-center gap-1" onClick={()=>departMut.mutate(s.id)} disabled={departMut.isPending}><LogOut size={12}/>Depart</button>
                      )}
                      <button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget(s)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="text-headline-sm font-semibold">{editing?'Edit':'Add'} Ship</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">IMO Number *</label>
                  <input className="form-input w-full" placeholder="IMO9999999" {...register('imoNumber')}/>
                  {errors.imoNumber&&<p className="form-error">{errors.imoNumber.message}</p>}
                </div>
                <div>
                  <label className="form-label">Ship Name *</label>
                  <input className="form-input w-full" placeholder="MV Vadhvan Star" {...register('name')}/>
                  {errors.name&&<p className="form-error">{errors.name.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Arrival Time *</label>
                  <input type="datetime-local" className="form-input w-full" {...register('arrivalTime')}/>
                </div>
                <div>
                  <label className="form-label">Expected Departure</label>
                  <input type="datetime-local" className="form-input w-full" {...register('expectedDeparture')}/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Container Count *</label>
                  <input type="number" className="form-input w-full" {...register('containerCount')}/>
                </div>
                <div>
                  <label className="form-label">Priority *</label>
                  <select className="form-input w-full" {...register('priority')}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Cargo Type *</label>
                  <input className="form-input w-full" placeholder="Dry Bulk" {...register('cargoType')}/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Length (m)</label>
                  <input type="number" className="form-input w-full" {...register('shipLength')}/>
                </div>
                <div>
                  <label className="form-label">Width (m)</label>
                  <input type="number" className="form-input w-full" {...register('shipWidth')}/>
                </div>
                <div>
                  <label className="form-label">Draft (m)</label>
                  <input type="number" step="0.1" className="form-input w-full" {...register('draft')}/>
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

      {/* Dock Assignment Modal */}
      {dockTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-headline-sm font-semibold">Assign Dock</h2>
            <p className="text-body-sm text-on-surface-variant">Select an available dock for <strong>{dockTarget.name}</strong></p>
            <select className="form-input w-full" value={selectedDock} onChange={e=>setSelectedDock(e.target.value)}>
              <option value="">Select dock</option>
              {dockList.map((d:any)=><option key={d.id} value={d.id}>Dock {d.dockNumber}</option>)}
            </select>
            <div className="flex gap-3">
              <button className="btn btn-secondary flex-1" onClick={()=>setDockTarget(null)}>Cancel</button>
              <button className="btn btn-primary flex-1" disabled={!selectedDock||dockMut.isPending} onClick={()=>dockMut.mutate({id:dockTarget.id,dockId:selectedDock})}>Dock Ship</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Ship"
        message={`Remove "${deleteTarget?.name}" from registry?`}
        onConfirm={()=>deleteTarget&&deleteMut.mutate(deleteTarget.id)}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
