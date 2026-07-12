import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, AlertTriangle, Info, Truck, Wrench, Package } from 'lucide-react';
import { notificationsApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { Notification } from '../../types';

const TYPE_ICON: Record<string, typeof Bell> = {
  MAINTENANCE: Wrench,
  TRIP: Truck,
  CONTAINER: Package,
  ALERT: AlertTriangle,
  DEFAULT: Info,
};

const TYPE_BG: Record<string, string> = {
  MAINTENANCE: 'bg-yellow-50 border-l-yellow-400',
  TRIP: 'bg-blue-50 border-l-blue-400',
  CONTAINER: 'bg-purple-50 border-l-purple-400',
  ALERT: 'bg-red-50 border-l-red-400',
  DEFAULT: 'bg-gray-50 border-l-gray-400',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff/60000);
  if (mins<1) return 'just now';
  if (mins<60) return `${mins}m ago`;
  const hrs = Math.floor(mins/60);
  if (hrs<24) return `${hrs}h ago`;
  return `${Math.floor(hrs/24)}d ago`;
}

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey:['notifications'], queryFn:()=>notificationsApi.getAll() });

  const markRead = useMutation({
    mutationFn:(id:string)=>notificationsApi.markRead(id),
    onSuccess:()=>qc.invalidateQueries({queryKey:['notifications']}),
  });
  const markAll = useMutation({
    mutationFn:()=>notificationsApi.markAllRead(),
    onSuccess:()=>qc.invalidateQueries({queryKey:['notifications']}),
  });

  const list: Notification[] = (data as any)?.data ?? [];
  const unread = list.filter(n=>!n.read).length;

  const getType = (n: Notification) => {
    const t = (n.type||'').toUpperCase();
    if (t.includes('MAINTENANCE')) return 'MAINTENANCE';
    if (t.includes('TRIP')) return 'TRIP';
    if (t.includes('CONTAINER')) return 'CONTAINER';
    if (t.includes('ALERT')||t.includes('WARN')) return 'ALERT';
    return 'DEFAULT';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-on-surface flex items-center gap-3">
            Notifications
            {unread>0 && <span className="badge badge-error">{unread} unread</span>}
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Real-time port operations alerts</p>
        </div>
        {unread>0 && (
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={()=>markAll.mutate()}
            disabled={markAll.isPending}
          ><CheckCheck size={16}/>Mark All Read</button>
        )}
      </div>

      {isLoading ? <LoadingSpinner/> : list.length===0 ? (
        <div className="card p-16 text-center">
          <Bell size={48} className="mx-auto mb-4 text-on-surface-variant opacity-30"/>
          <h3 className="text-headline-sm text-on-surface">No Notifications</h3>
          <p className="text-body-sm text-on-surface-variant mt-2">You're all caught up. New alerts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(n=>{
            const type = getType(n);
            const Icon = TYPE_ICON[type]||Bell;
            return (
              <div
                key={n.id}
                className={`card p-4 border-l-4 flex items-start gap-4 transition-all ${TYPE_BG[type]} ${!n.read?'opacity-100':'opacity-60'}`}
              >
                <div className={`p-2 rounded-full bg-white shadow-sm flex-shrink-0 ${!n.read?'':'opacity-50'}`}>
                  <Icon size={18} className={type==='ALERT'?'text-red-500':type==='MAINTENANCE'?'text-yellow-500':type==='TRIP'?'text-blue-500':'text-gray-500'}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-body-md font-semibold text-on-surface ${!n.read?'':'font-normal'}`}>{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0"/>}
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">{n.message}</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <button
                    className="btn btn-ghost text-xs flex items-center gap-1 flex-shrink-0"
                    onClick={()=>markRead.mutate(n.id)}
                    disabled={markRead.isPending}
                  ><Check size={12}/>Mark read</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
