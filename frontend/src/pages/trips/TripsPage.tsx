import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi, vehiclesApi, driversApi, recommendApi } from '@/services/api';
import { mockTrips } from '@/utils/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Route, Plus, Search, CheckCircle, RefreshCw, XCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const TripsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState(25);
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');

  // Recommendation engine state
  const [recEngineActive, setRecEngineActive] = useState(false);
  const [recData, setRecData] = useState<any>(null);

  // Fetch Trips
  const { data: trips } = useQuery({
    queryKey: ['trips', statusFilter],
    queryFn: async () => {
      try {
        const res = await tripsApi.getAll({ status: statusFilter });
        return res.data;
      } catch {
        return mockTrips.filter(t => (statusFilter ? t.status === statusFilter : true));
      }
    },
    initialData: mockTrips,
  });

  // Fetch Available Vehicles & Drivers
  const { data: availVehicles } = useQuery({
    queryKey: ['availableVehicles'],
    queryFn: async () => {
      try {
        const res = await vehiclesApi.getAvailable();
        return res.data;
      } catch {
        return [];
      }
    },
    initialData: [],
  });

  const { data: availDrivers } = useQuery({
    queryKey: ['availableDrivers'],
    queryFn: async () => {
      try {
        const res = await driversApi.getAvailable();
        return res.data;
      } catch {
        return [];
      }
    },
    initialData: [],
  });

  // Recommendation engine query trigger
  const handleRecEngineClick = async () => {
    if (!weight) return;
    setRecEngineActive(true);
    try {
      const res = await recommendApi.getRecommendation({
        cargoWeight: weight,
        sourceDockId: '1', // default for recomendation context
      });
      setRecData(res.data);
      if (res.data) {
        setVehicleId(res.data.vehicle.id);
        setDriverId(res.data.driver.id);
      }
    } catch {
      // fallback mock recommendation
      if (availVehicles.length > 0 && availDrivers.length > 0) {
        setRecData({
          vehicle: availVehicles[0],
          driver: availDrivers[0],
          score: 95,
          reasons: [
            'Nearest vehicle available',
            'Driver has 12 years experience',
            'Full fuel level (92%)',
          ],
        });
        setVehicleId(availVehicles[0].id);
        setDriverId(availDrivers[0].id);
      }
    }
  };

  // Create Trip Mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => tripsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setIsAddOpen(false);
      // Reset
      setSource('');
      setDestination('');
      setVehicleId('');
      setDriverId('');
      setRecData(null);
      setRecEngineActive(false);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      source,
      destination,
      cargoWeight: parseFloat(weight as any),
      vehicleId,
      driverId,
      priority: 'MEDIUM',
    });
  };

  // Dispatch / Complete / Cancel Mutations
  const dispatchMutation = useMutation({
    mutationFn: (id: string) => tripsApi.dispatch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => tripsApi.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => tripsApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-4">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Transit Logs</h2>
          <p className="text-body-sm text-on-surface-variant">Intelligently dispatch cargo haulage trips and monitor statuses</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn-primary">
          <Plus size={16} /> Create Trip
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-outline-variant rounded-md p-4 flex gap-4 items-center shadow-card mt-2">
        <select
          className="form-input text-xs w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Trips Registry Table */}
      <div className="bg-white border border-outline-variant rounded-md shadow-card overflow-x-auto mt-2">
        <table className="data-table">
          <thead>
            <tr>
              <th>Trip No</th>
              <th>Source / Destination</th>
              <th>Haulage Info</th>
              <th>Assigned Vehicle</th>
              <th>Assigned Driver</th>
              <th>Trip Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips?.map((trip) => (
              <tr key={trip.id}>
                <td className="font-bold text-xs tracking-wider font-mono text-port-blue uppercase">
                  {trip.tripNumber}
                </td>
                <td>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-bold text-on-surface">{trip.source}</span>
                    <ArrowRight size={12} className="text-on-surface-variant/60" />
                    <span className="font-bold text-on-surface">{trip.destination}</span>
                  </div>
                </td>
                <td className="text-xs font-semibold">{trip.cargoWeight} Tons</td>
                <td className="text-xs text-on-surface-variant font-mono">
                  {trip.vehicle?.registrationNo || 'MH-04-GP-XXXX'}
                </td>
                <td className="text-xs font-semibold">{trip.driver?.name || 'Assigned Driver'}</td>
                <td>
                  <StatusBadge status={trip.status} />
                </td>
                <td className="text-right">
                  <div className="inline-flex gap-2">
                    {trip.status === 'DRAFT' && (
                      <button
                        onClick={() => dispatchMutation.mutate(trip.id)}
                        className="btn bg-port-blue text-white hover:bg-blue-600 text-xs px-2.5 py-1"
                      >
                        Dispatch
                      </button>
                    )}
                    {trip.status === 'DISPATCHED' && (
                      <button
                        onClick={() => completeMutation.mutate(trip.id)}
                        className="btn bg-success text-white hover:bg-green-600 text-xs px-2.5 py-1"
                      >
                        Complete
                      </button>
                    )}
                    {['DRAFT', 'DISPATCHED'].includes(trip.status) && (
                      <button
                        onClick={() => cancelMutation.mutate(trip.id)}
                        className="btn bg-error text-white hover:bg-red-600 text-xs px-2.5 py-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-outline-variant shadow-modal w-full max-w-lg p-6 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-headline-sm font-bold text-on-surface">Create Trip Request</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Source Terminal Slot</label>
                  <input
                    type="text"
                    placeholder="Berth 1"
                    className="form-input"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    placeholder="Warehouse A"
                    className="form-input"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="form-label">Cargo Weight (Tons)</label>
                  <input
                    type="number"
                    placeholder="25"
                    className="form-input"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRecEngineClick}
                  className="btn bg-secondary text-white justify-center h-10 gap-2 flex items-center shadow"
                >
                  <Sparkles size={16} /> Recommend Resources
                </button>
              </div>

              {/* Recommendation Panel */}
              {recEngineActive && recData && (
                <div className="p-4 bg-success-container/10 border border-success rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-success flex items-center gap-1.5">
                      <Sparkles size={14} /> Optimization Score: {recData.score}%
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant space-y-1">
                    <p>Recommended Vehicle: <span className="font-semibold text-on-surface">{recData.vehicle.name} ({recData.vehicle.registrationNo})</span></p>
                    <p>Recommended Driver: <span className="font-semibold text-on-surface">{recData.driver.name}</span></p>
                    <div className="pt-2 border-t border-success/20">
                      <p className="font-semibold text-success">Matching Criteria Met:</p>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                        {recData.reasons.map((r: string, i: number) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Selection Fallbacks */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Haulage Vehicle</label>
                  <select
                    className="form-input"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {availVehicles.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.registrationNo})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Operator Driver</label>
                  <select
                    className="form-input"
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    required
                  >
                    <option value="">Select Driver</option>
                    {availDrivers.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Request Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsPage;
