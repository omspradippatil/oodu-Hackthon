import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driversApi } from '@/services/api';
import { mockDrivers } from '@/utils/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Users, Plus, Search, Star, X } from 'lucide-react';

export const DriversPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('Heavy Commercial');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState(5);

  const { data: drivers } = useQuery({
    queryKey: ['drivers', search, statusFilter],
    queryFn: async () => {
      try {
        const res = await driversApi.getAll({ search, status: statusFilter });
        return res.data;
      } catch {
        return mockDrivers.filter(d => {
          const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.licenseNo.toLowerCase().includes(search.toLowerCase());
          const matchStatus = statusFilter ? d.status === statusFilter : true;
          return matchSearch && matchStatus;
        });
      }
    },
    initialData: mockDrivers,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => driversApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsAddOpen(false);
      setName('');
      setLicenseNo('');
      setPhone('');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      licenseNo,
      licenseCategory,
      phone,
      experienceYears: parseInt(experience as any),
      licenseExpiry: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 5 yrs out
    });
  };

  const getSafetyClass = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-port-blue';
    return 'text-warning';
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-4">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Driver Management</h2>
          <p className="text-body-sm text-on-surface-variant">Register drivers, track licensing status and monitor safety scores</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Driver
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Total Registered</p>
          <p className="text-headline-sm font-bold text-on-surface mt-1">{drivers?.length || 0}</p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Available Drivers</p>
          <p className="text-headline-sm font-bold text-success mt-1">
            {drivers?.filter(d => d.status === 'AVAILABLE').length || 0}
          </p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">On Active Trip</p>
          <p className="text-headline-sm font-bold text-port-blue mt-1">
            {drivers?.filter(d => d.status === 'ON_TRIP').length || 0}
          </p>
        </div>
        <div className="bg-white border border-outline-variant rounded-md p-4 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">Safety Score Avg</p>
          <p className="text-headline-sm font-bold text-success mt-1">91%</p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-outline-variant rounded-md p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-card mt-2">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search name or license..."
            className="form-input pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
        </div>

        <select
          className="form-input text-xs w-full md:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Driver Data Table */}
      <div className="bg-white border border-outline-variant rounded-md shadow-card overflow-x-auto mt-2">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12">Avatar</th>
              <th>Name</th>
              <th>License Information</th>
              <th>Contact Phone</th>
              <th>Experience</th>
              <th>Safety Score</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers?.map((driver) => (
              <tr key={driver.id}>
                <td>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs">
                    {driver.name.charAt(0)}
                  </div>
                </td>
                <td className="font-bold text-on-surface">{driver.name}</td>
                <td>
                  <p className="text-xs font-mono font-semibold text-port-blue">{driver.licenseNo}</p>
                  <p className="text-[10px] text-on-surface-variant">Class: {driver.licenseCategory}</p>
                </td>
                <td className="text-xs font-medium">{driver.phone}</td>
                <td className="text-xs font-semibold">{driver.experienceYears} Years</td>
                <td>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-warning fill-current" />
                    <span className={`text-xs font-bold ${getSafetyClass(driver.safetyScore || 100)}`}>
                      {driver.safetyScore}%
                    </span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={driver.status} />
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
              <h3 className="text-headline-sm font-bold text-on-surface">Add Driver Profile</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pradip Patil"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">License Number</label>
                <input
                  type="text"
                  placeholder="DL-MH04-XXXXXXXX"
                  className="form-input"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">License Class</label>
                  <select
                    className="form-input"
                    value={licenseCategory}
                    onChange={(e) => setLicenseCategory(e.target.value)}
                  >
                    <option value="Heavy Commercial">Heavy Commercial</option>
                    <option value="Light Commercial">Light Commercial</option>
                    <option value="Special Equipment">Special Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    placeholder="8"
                    className="form-input"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversPage;
