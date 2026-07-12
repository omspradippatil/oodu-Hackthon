import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '@/services/api';
import { mockVehicles } from '@/utils/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { HealthScore } from '@/components/ui/HealthScore';
import { Truck, Plus, Search, Filter, Trash2, Edit, AlertCircle, X } from 'lucide-react';

export const FleetPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('TRUCK');
  const [capacity, setCapacity] = useState(40);

  // Fetch Vehicles
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles', search, typeFilter, statusFilter],
    queryFn: async () => {
      try {
        const res = await vehiclesApi.getAll({
          search,
          type: typeFilter,
          status: statusFilter,
        });
        return res.data;
      } catch {
        // Fallback filtering on mock data
        return mockVehicles.filter(v => {
          const matchSearch = v.registrationNo.toLowerCase().includes(search.toLowerCase()) || v.name.toLowerCase().includes(search.toLowerCase());
          const matchType = typeFilter ? v.type === typeFilter : true;
          const matchStatus = statusFilter ? v.status === statusFilter : true;
          return matchSearch && matchType && matchStatus;
        });
      }
    },
    initialData: mockVehicles,
  });

  // Create Vehicle Mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => vehiclesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsAddOpen(false);
      // Reset form
      setRegNo('');
      setName('');
      setModel('');
      setCapacity(40);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      registrationNo: regNo,
      name,
      model,
      type,
      maxCapacity: parseFloat(capacity as any),
    });
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-4">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Vehicle Registry</h2>
          <p className="text-body-sm text-on-surface-variant">Manage and track port haulage fleet & equipment status</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Total Fleet Size</p>
          <p className="text-headline-sm font-bold text-on-surface mt-1">{vehicles?.length || 0}</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Available Trucks</p>
          <p className="text-headline-sm font-bold text-success mt-1">
            {vehicles?.filter(v => v.status === 'AVAILABLE').length || 0}
          </p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Hauling (On Trip)</p>
          <p className="text-headline-sm font-bold text-port-blue mt-1">
            {vehicles?.filter(v => v.status === 'ON_TRIP').length || 0}
          </p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">In Workshop</p>
          <p className="text-headline-sm font-bold text-warning mt-1">
            {vehicles?.filter(v => v.status === 'IN_SHOP').length || 0}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-outline-variant rounded-md p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-card mt-2">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search registration or name..."
            className="form-input pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="form-input text-xs"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Vehicle Types</option>
            <option value="TRUCK">Truck</option>
            <option value="TRAILER">Trailer</option>
            <option value="FORKLIFT">Forklift</option>
            <option value="REACH_STACKER">Reach Stacker</option>
            <option value="CRANE_TRUCK">Crane Truck</option>
          </select>

          <select
            className="form-input text-xs"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="bg-white border border-outline-variant rounded-md shadow-card overflow-x-auto mt-2">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-16">Icon</th>
              <th>Registration No</th>
              <th>Name / Model</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Fuel Level</th>
              <th>Health Status</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles?.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="text-center">
                  <div className="p-1.5 bg-surface-container rounded-md inline-block">
                    <Truck size={16} className="text-on-surface-variant" />
                  </div>
                </td>
                <td className="font-semibold text-xs tracking-wider font-mono text-port-blue uppercase">
                  {vehicle.registrationNo}
                </td>
                <td>
                  <p className="text-body-sm font-bold text-on-surface">{vehicle.name}</p>
                  <p className="text-[10px] text-on-surface-variant">Model: {vehicle.model}</p>
                </td>
                <td className="text-xs uppercase font-medium">{vehicle.type.replace('_', ' ')}</td>
                <td className="text-xs font-semibold">{vehicle.maxCapacity} Tons</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium w-8">{vehicle.fuelLevel}%</span>
                    <div className="w-16 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${vehicle.fuelLevel < 30 ? 'bg-error' : 'bg-success'}`}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <HealthScore score={vehicle.healthScore} />
                </td>
                <td>
                  <StatusBadge status={vehicle.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-outline-variant shadow-modal w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-headline-sm font-bold text-on-surface">Add Vehicle to Registry</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="form-label">Registration Number</label>
                <input
                  type="text"
                  placeholder="MH-04-GP-XXXX"
                  className="form-input"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Vehicle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Scania R500"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Model Year</label>
                  <input
                    type="text"
                    placeholder="2024"
                    className="form-input"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Max Load (Tons)</label>
                  <input
                    type="number"
                    placeholder="45"
                    className="form-input"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Vehicle Category</label>
                <select
                  className="form-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="TRUCK">Truck</option>
                  <option value="TRAILER">Trailer</option>
                  <option value="FORKLIFT">Forklift</option>
                  <option value="REACH_STACKER">Reach Stacker</option>
                  <option value="CRANE_TRUCK">Crane Truck</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetPage;
