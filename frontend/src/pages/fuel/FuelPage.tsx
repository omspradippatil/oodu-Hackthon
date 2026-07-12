import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Fuel, DollarSign, TrendingDown } from 'lucide-react';
import { fuelApi, expensesApi, vehiclesApi, driversApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { FuelLog, Expense } from '../../types';

const fuelSchema = z.object({
  vehicleId: z.string().min(1),
  driverId: z.string().optional(),
  tripId: z.string().optional(),
  quantityLitres: z.coerce.number().min(0.1),
  costPerLitre: z.coerce.number().min(0.1),
  totalCost: z.coerce.number().min(0),
  mileage: z.coerce.number().optional(),
  distanceCovered: z.coerce.number().optional(),
});
type FuelForm = z.infer<typeof fuelSchema>;

const expenseSchema = z.object({
  vehicleId: z.string().min(1),
  tripId: z.string().optional(),
  type: z.enum(['MAINTENANCE','FUEL','TOLL','PARKING','INSURANCE','REPAIR','OTHER']),
  amount: z.coerce.number().min(0),
  description: z.string().optional(),
});
type ExpenseForm = z.infer<typeof expenseSchema>;

const EXP_LABELS: Record<string,string> = {
  MAINTENANCE:'Maintenance', FUEL:'Fuel', TOLL:'Toll', PARKING:'Parking',
  INSURANCE:'Insurance', REPAIR:'Repair', OTHER:'Other',
};

export default function FuelPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'fuel'|'expenses'>('fuel');
  const [search, setSearch] = useState('');
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{id:string;type:'fuel'|'exp'}|null>(null);

  const { data: fuelData, isLoading: fuelLoading } = useQuery({ queryKey: ['fuel'], queryFn: ()=>fuelApi.getAll() });
  const { data: expData, isLoading: expLoading } = useQuery({ queryKey: ['expenses'], queryFn: ()=>expensesApi.getAll() });
  const { data: vehicles } = useQuery({ queryKey: ['vehicles-all'], queryFn: ()=>vehiclesApi.getAll() });
  const { data: drivers } = useQuery({ queryKey: ['drivers-all'], queryFn: ()=>driversApi.getAll() });

  const createFuel = useMutation({
    mutationFn: (d:FuelForm)=>fuelApi.create(d),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:['fuel']}); setShowFuelModal(false); fuelForm.reset({}); },
  });
  const createExp = useMutation({
    mutationFn: (d:ExpenseForm)=>expensesApi.create(d),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:['expenses']}); setShowExpModal(false); expForm.reset({}); },
  });
  const deleteFuel = useMutation({
    mutationFn: (id:string)=>fuelApi.delete(id),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:['fuel']}); setDeleteTarget(null); },
  });
  const deleteExp = useMutation({
    mutationFn: (id:string)=>expensesApi.delete(id),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:['expenses']}); setDeleteTarget(null); },
  });

  const fuelForm = useForm<FuelForm>({ resolver: zodResolver(fuelSchema) });
  const expForm = useForm<ExpenseForm>({ resolver: zodResolver(expenseSchema) });

  const fuelList: FuelLog[] = (fuelData as any)?.data ?? [];
  const expList: Expense[] = (expData as any)?.data ?? [];
  const vehicleList: any[] = (vehicles as any)?.data ?? [];
  const driverList: any[] = (drivers as any)?.data ?? [];

  const totalFuelCost = fuelList.reduce((s,f)=>s+(f.totalCost||0),0);
  const totalExpCost = expList.reduce((s,e)=>s+(e.amount||0),0);
  const totalLitres = fuelList.reduce((s,f)=>s+(f.quantityLitres||0),0);

  const filteredFuel = fuelList.filter(f=>(f.vehicle?.name||'').toLowerCase().includes(search.toLowerCase()));
  const filteredExp = expList.filter(e=>(e.vehicle?.name||'').toLowerCase().includes(search.toLowerCase()) || (e.description||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface">Fuel & Expenses</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Track fuel consumption and operational costs</p>
        </div>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={()=>tab==='fuel'?setShowFuelModal(true):setShowExpModal(true)}
        ><Plus size={16}/>{tab==='fuel'?'Log Fuel':'Add Expense'}</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label:'Total Fuel Cost', value:`₹${totalFuelCost.toLocaleString()}`, icon: Fuel, cls:'text-warning' },
          { label:'Litres Consumed', value:`${totalLitres.toLocaleString()} L`, icon: TrendingDown, cls:'text-secondary' },
          { label:'Total Expenses', value:`₹${totalExpCost.toLocaleString()}`, icon: DollarSign, cls:'text-error' },
        ].map(k=>(
          <div key={k.label} className="card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-md bg-gray-50 ${k.cls}`}><k.icon size={20}/></div>
            <div>
              <p className="text-label-md text-on-surface-variant">{k.label}</p>
              <p className="text-headline-sm font-bold text-on-surface">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-1 flex gap-1 w-fit">
        {(['fuel','expenses'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded text-body-sm font-medium capitalize transition-colors ${tab===t?'bg-secondary text-white':'text-on-surface-variant hover:bg-gray-100'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
          <input className="form-input pl-8 w-full" placeholder="Search by vehicle..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      {tab==='fuel' ? (
        fuelLoading ? <LoadingSpinner/> : filteredFuel.length===0 ? (
          <EmptyState title="No Fuel Logs" description="Log fuel refills to track consumption."/>
        ) : (
          <div className="card overflow-hidden">
            <table className="data-table w-full">
              <thead><tr>
                <th>Vehicle</th><th>Driver</th><th>Qty (L)</th>
                <th>Cost/L (₹)</th><th>Total (₹)</th><th>Mileage</th><th>Distance</th><th>Date</th><th></th>
              </tr></thead>
              <tbody>
                {filteredFuel.map(f=>(
                  <tr key={f.id}>
                    <td className="text-data font-medium">{f.vehicle?.name||'—'}</td>
                    <td className="text-data">{f.driver?.name||'—'}</td>
                    <td className="text-data">{f.quantityLitres}</td>
                    <td className="text-data">₹{f.costPerLitre}</td>
                    <td className="text-data font-semibold">₹{f.totalCost.toLocaleString()}</td>
                    <td className="text-data">{f.mileage||'—'}</td>
                    <td className="text-data">{f.distanceCovered ? `${f.distanceCovered} km` : '—'}</td>
                    <td className="text-data">{new Date(f.loggedAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget({id:f.id,type:'fuel'})}>Del</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        expLoading ? <LoadingSpinner/> : filteredExp.length===0 ? (
          <EmptyState title="No Expenses" description="Add expenses to track operational costs."/>
        ) : (
          <div className="card overflow-hidden">
            <table className="data-table w-full">
              <thead><tr>
                <th>Vehicle</th><th>Type</th><th>Amount (₹)</th><th>Description</th><th>Date</th><th></th>
              </tr></thead>
              <tbody>
                {filteredExp.map(e=>(
                  <tr key={e.id}>
                    <td className="text-data font-medium">{e.vehicle?.name||'—'}</td>
                    <td><span className="badge badge-info">{EXP_LABELS[e.type]||e.type}</span></td>
                    <td className="text-data font-semibold">₹{e.amount.toLocaleString()}</td>
                    <td className="text-data">{e.description||'—'}</td>
                    <td className="text-data">{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget({id:e.id,type:'exp'})}>Del</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Fuel Modal */}
      {showFuelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-outline-variant"><h2 className="text-headline-sm font-semibold">Log Fuel Refill</h2></div>
            <form onSubmit={fuelForm.handleSubmit(d=>createFuel.mutate(d))} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Vehicle *</label>
                  <select className="form-input w-full" {...fuelForm.register('vehicleId')}>
                    <option value="">Select vehicle</option>
                    {vehicleList.map((v:any)=><option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Driver</label>
                  <select className="form-input w-full" {...fuelForm.register('driverId')}>
                    <option value="">Select driver</option>
                    {driverList.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Qty (Litres) *</label>
                  <input type="number" step="0.1" className="form-input w-full" {...fuelForm.register('quantityLitres')}/>
                </div>
                <div>
                  <label className="form-label">Cost/Litre *</label>
                  <input type="number" step="0.01" className="form-input w-full" {...fuelForm.register('costPerLitre')}/>
                </div>
                <div>
                  <label className="form-label">Total Cost *</label>
                  <input type="number" step="0.01" className="form-input w-full" {...fuelForm.register('totalCost')}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Mileage (km/L)</label>
                  <input type="number" step="0.1" className="form-input w-full" {...fuelForm.register('mileage')}/>
                </div>
                <div>
                  <label className="form-label">Distance Covered (km)</label>
                  <input type="number" className="form-input w-full" {...fuelForm.register('distanceCovered')}/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={()=>setShowFuelModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={createFuel.isPending}>Log Fuel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-outline-variant"><h2 className="text-headline-sm font-semibold">Add Expense</h2></div>
            <form onSubmit={expForm.handleSubmit(d=>createExp.mutate(d))} className="p-6 space-y-4">
              <div>
                <label className="form-label">Vehicle *</label>
                <select className="form-input w-full" {...expForm.register('vehicleId')}>
                  <option value="">Select vehicle</option>
                  {vehicleList.map((v:any)=><option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Type *</label>
                  <select className="form-input w-full" {...expForm.register('type')}>
                    {Object.entries(EXP_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Amount (₹) *</label>
                  <input type="number" step="0.01" className="form-input w-full" {...expForm.register('amount')}/>
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input w-full" rows={2} {...expForm.register('description')}/>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={()=>setShowExpModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={createExp.isPending}>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Record"
        message="Delete this record? This cannot be undone."
        onConfirm={()=>{
          if(!deleteTarget) return;
          deleteTarget.type==='fuel'?deleteFuel.mutate(deleteTarget.id):deleteExp.mutate(deleteTarget.id);
        }}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteFuel.isPending||deleteExp.isPending}
      />
    </div>
  );
}
