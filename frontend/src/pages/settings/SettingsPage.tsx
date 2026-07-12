import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Users, Shield, Building, Bell } from 'lucide-react';
import { settingsApi, usersApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const orgSchema = z.object({
  orgName: z.string().min(2),
  theme: z.string().optional(),
  language: z.string().optional(),
});
type OrgForm = z.infer<typeof orgSchema>;

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional().or(z.literal('')),
  role: z.enum(['ADMIN','OPERATIONS_MANAGER','FLEET_MANAGER','MAINTENANCE_SUPERVISOR','DRIVER']),
});
type UserForm = z.infer<typeof userSchema>;

const ROLE_LABELS: Record<string,string> = {
  ADMIN:'Admin', OPERATIONS_MANAGER:'Ops Manager', FLEET_MANAGER:'Fleet Manager',
  MAINTENANCE_SUPERVISOR:'Maint. Supervisor', DRIVER:'Driver',
};

type Tab = 'org'|'users'|'roles'|'notifications';

export default function SettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('org');
  const [showUserModal, setShowUserModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const { data: settingsData, isLoading: settingsLoading } = useQuery({ queryKey:['settings'], queryFn:()=>settingsApi.get() });
  const { data: usersData, isLoading: usersLoading } = useQuery({ queryKey:['users'], queryFn:()=>usersApi.getAll(), enabled:user?.role==='ADMIN' });

  const settings = (settingsData as any)?.data ?? {};
  const usersList: any[] = (usersData as any)?.data ?? [];

  const updateSettings = useMutation({
    mutationFn:(d:OrgForm)=>settingsApi.update(d),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:['settings']}); setSaved(true); setTimeout(()=>setSaved(false),2000); },
  });
  const createUser = useMutation({
    mutationFn:(d:UserForm)=>usersApi.create(d),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:['users']}); setShowUserModal(false); userForm.reset({}); },
  });
  const deleteUser = useMutation({
    mutationFn:(id:string)=>usersApi.delete(id),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:['users']}); setDeleteTarget(null); },
  });

  const orgForm = useForm<OrgForm>({
    resolver: zodResolver(orgSchema),
    values: { orgName: settings.orgName||'Vadhvan Port', theme: settings.theme||'light', language: settings.language||'en' },
  });
  const userForm = useForm<UserForm>({ resolver: zodResolver(userSchema) });

  const TABS: {id:Tab;label:string;icon:typeof Save;adminOnly?:boolean}[] = [
    { id:'org', label:'Organization', icon:Building },
    { id:'users', label:'Users', icon:Users, adminOnly:true },
    { id:'roles', label:'Roles & Permissions', icon:Shield },
    { id:'notifications', label:'Notifications', icon:Bell },
  ];

  const ROLE_PERMISSIONS: Record<string,string[]> = {
    ADMIN: ['All modules', 'User management', 'Settings', 'Delete records'],
    OPERATIONS_MANAGER: ['Dashboard', 'Trips', 'Containers', 'Ships', 'Docks', 'Reports', 'Analytics'],
    FLEET_MANAGER: ['Vehicles', 'Drivers', 'Trips', 'Fuel', 'Maintenance'],
    MAINTENANCE_SUPERVISOR: ['Maintenance', 'Equipment', 'Vehicles (read)'],
    DRIVER: ['Own trips only'],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-lg text-on-surface">Settings</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">Manage platform configuration and user access</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="card p-2 space-y-1">
            {TABS.filter(t=>!t.adminOnly||user?.role==='ADMIN').map(t=>(
              <button
                key={t.id}
                onClick={()=>setTab(t.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-body-sm font-medium transition-colors text-left ${tab===t.id?'bg-secondary text-white':'text-on-surface-variant hover:bg-gray-100'}`}
              ><t.icon size={16}/>{t.label}</button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab==='org' && (
            <div className="card p-6">
              <h2 className="text-headline-sm font-semibold mb-6">Organization Settings</h2>
              {settingsLoading ? <LoadingSpinner/> : (
                <form onSubmit={orgForm.handleSubmit(d=>updateSettings.mutate(d))} className="space-y-4 max-w-lg">
                  <div>
                    <label className="form-label">Organization Name</label>
                    <input className="form-input w-full" {...orgForm.register('orgName')}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Theme</label>
                      <select className="form-input w-full" {...orgForm.register('theme')}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Language</label>
                      <select className="form-input w-full" {...orgForm.register('language')}>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={updateSettings.isPending}>
                    <Save size={16}/>{saved?'Saved!':'Save Changes'}
                  </button>
                </form>
              )}
            </div>
          )}

          {tab==='users' && user?.role==='ADMIN' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-headline-sm font-semibold">User Management</h2>
                <button className="btn btn-primary text-sm" onClick={()=>setShowUserModal(true)}>+ Add User</button>
              </div>
              {usersLoading ? <LoadingSpinner/> : (
                <table className="data-table w-full">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th><th></th></tr></thead>
                  <tbody>
                    {usersList.map((u:any)=>(
                      <tr key={u.id}>
                        <td className="text-data font-medium">{u.name}</td>
                        <td className="text-data">{u.email}</td>
                        <td><span className="badge badge-info">{ROLE_LABELS[u.role]||u.role}</span></td>
                        <td><StatusBadge status={u.status}/></td>
                        <td className="text-data">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {u.id!==user.id && (
                            <button className="btn btn-danger text-xs" onClick={()=>setDeleteTarget(u)}>Remove</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab==='roles' && (
            <div className="card p-6">
              <h2 className="text-headline-sm font-semibold mb-6">Roles & Permissions</h2>
              <div className="space-y-4">
                {Object.entries(ROLE_PERMISSIONS).map(([role,perms])=>(
                  <div key={role} className="border border-outline-variant rounded-md p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield size={18} className="text-secondary"/>
                      <h3 className="text-title-lg font-semibold">{ROLE_LABELS[role]}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perms.map(p=><span key={p} className="badge badge-info">{p}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='notifications' && (
            <div className="card p-6">
              <h2 className="text-headline-sm font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-3 max-w-lg">
                {[
                  'Trip Started', 'Trip Completed', 'Trip Cancelled',
                  'Maintenance Due', 'Vehicle Breakdown', 'Driver License Expiry',
                  'Container Delivered', 'Dock Ready', 'Crane Available',
                  'Warehouse Near Capacity',
                ].map(pref=>(
                  <div key={pref} className="flex items-center justify-between py-2 border-b border-outline-variant last:border-0">
                    <span className="text-body-md text-on-surface">{pref}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer"/>
                      <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-secondary rounded-full peer peer-checked:bg-secondary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"/>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-outline-variant"><h2 className="text-headline-sm font-semibold">Add User</h2></div>
            <form onSubmit={userForm.handleSubmit(d=>createUser.mutate(d))} className="p-6 space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input className="form-input w-full" {...userForm.register('name')}/>
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input type="email" className="form-input w-full" {...userForm.register('email')}/>
              </div>
              <div>
                <label className="form-label">Password *</label>
                <input type="password" className="form-input w-full" {...userForm.register('password')}/>
              </div>
              <div>
                <label className="form-label">Role *</label>
                <select className="form-input w-full" {...userForm.register('role')}>
                  {Object.entries(ROLE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={()=>setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={createUser.isPending}>Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove User"
        message={`Remove "${deleteTarget?.name}"? They will lose all access.`}
        onConfirm={()=>deleteTarget&&deleteUser.mutate(deleteTarget.id)}
        onCancel={()=>setDeleteTarget(null)}
        loading={deleteUser.isPending}
      />
    </div>
  );
}
