import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { containersApi } from '@/services/api';
import { mockContainers } from '@/utils/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Package, ToggleLeft, ToggleRight, LayoutGrid, List, Plus, X } from 'lucide-react';

type ContainerColumn = 'WAITING' | 'ALLOCATED' | 'LOADING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

const columns: { label: string; value: ContainerColumn; color: string }[] = [
  { label: 'Waiting Queue', value: 'WAITING', color: 'border-t-4 border-t-outline' },
  { label: 'Allocated', value: 'ALLOCATED', color: 'border-t-4 border-t-port-blue' },
  { label: 'Loading Slot', value: 'LOADING', color: 'border-t-4 border-t-warning' },
  { label: 'In Transit', value: 'IN_TRANSIT', color: 'border-t-4 border-t-port-blue' },
  { label: 'Delivered', value: 'DELIVERED', color: 'border-t-4 border-t-success' },
  { label: 'Cancelled', value: 'CANCELLED', color: 'border-t-4 border-t-error' },
];

export const ContainersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [code, setCode] = useState('');
  const [weight, setWeight] = useState(25);
  const [priority, setPriority] = useState('MEDIUM');

  // Fetch Containers
  const { data: containers } = useQuery({
    queryKey: ['containers'],
    queryFn: async () => {
      try {
        const res = await containersApi.getAll();
        return res.data;
      } catch {
        return mockContainers;
      }
    },
    initialData: mockContainers,
  });

  // Create Container Mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => containersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      setIsAddOpen(false);
      setCode('');
      setWeight(25);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      containerCode: code,
      weight: parseFloat(weight as any),
      priority,
      status: 'WAITING',
    });
  };

  const getPriorityBadge = (p: string) => {
    if (p === 'CRITICAL') return 'text-error bg-error-container';
    if (p === 'HIGH') return 'text-warning bg-warning-container';
    return 'text-on-surface-variant bg-surface-container-high';
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-4">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Container Logistics</h2>
          <p className="text-body-sm text-on-surface-variant">Track cargo containers moving from maritime berths to road or rail networks</p>
        </div>
        <div className="flex gap-3">
          {/* Toggle buttons */}
          <div className="inline-flex border border-outline-variant rounded-md overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 ${viewMode === 'kanban' ? 'bg-secondary text-white' : 'text-on-surface hover:bg-surface-container'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-secondary text-white' : 'text-on-surface hover:bg-surface-container'}`}
            >
              <List size={16} />
            </button>
          </div>
          <button onClick={() => setIsAddOpen(true)} className="btn-primary">
            <Plus size={16} /> Create Container
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        /* Kanban View */
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
          {columns.map((col) => {
            const colContainers = containers?.filter((c) => c.status === col.value) || [];
            return (
              <div key={col.value} className={`kanban-column min-w-[260px] max-w-[260px] ${col.color}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">{col.label}</span>
                  <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {colContainers.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
                  {colContainers.map((c) => (
                    <div key={c.id} className="kanban-card">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs tracking-wider font-mono text-port-blue uppercase">{c.containerCode}</span>
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${getPriorityBadge(c.priority)}`}>
                          {c.priority}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex justify-between items-end">
                        <p className="text-[10px] text-on-surface-variant font-medium">Weight: {c.weight} Tons</p>
                        <Package size={14} className="text-on-surface-variant/40" />
                      </div>
                    </div>
                  ))}
                  {colContainers.length === 0 && (
                    <p className="text-[10px] text-on-surface-variant/40 italic text-center py-6">Empty</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-outline-variant rounded-md shadow-card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Container Code</th>
                <th>Cargo Weight</th>
                <th>Priority</th>
                <th>Terminal Berth</th>
                <th>Destination Yard</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {containers?.map((c) => (
                <tr key={c.id}>
                  <td className="font-bold text-xs tracking-wider font-mono text-port-blue uppercase">{c.containerCode}</td>
                  <td className="text-xs font-semibold">{c.weight} Tons</td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityBadge(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="text-xs">{c.sourceDock?.dockNumber || 'Berth 1'}</td>
                  <td className="text-xs">{c.destWarehouse?.name || 'Warehouse A'}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-outline-variant shadow-modal w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-headline-sm font-bold text-on-surface">Add Container</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="form-label">Container Code</label>
                <input
                  type="text"
                  placeholder="e.g. MSCU1048596"
                  className="form-input font-mono uppercase"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Cargo Weight (Tons)</label>
                <input
                  type="number"
                  placeholder="25"
                  className="form-input"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Container
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainersPage;
