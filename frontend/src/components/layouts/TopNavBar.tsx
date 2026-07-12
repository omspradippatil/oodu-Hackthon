import React, { useState } from 'react';
import { Bell, Search, Menu, X, Wifi, WifiOff, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSSE } from '@/contexts/SSEContext';
import { formatRelativeTime } from '@/utils';

interface TopNavBarProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onMenuToggle, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, isConnected, markAsRead } = useSSE();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const recentNotifs = notifications.slice(0, 5);

  return (
    <header
      className="fixed top-0 right-0 z-30 bg-white border-b border-outline-variant flex items-center h-16 px-4 gap-3 transition-all duration-250"
      style={{ left: sidebarWidth }}
    >
      {/* Mobile menu toggle */}
      <button
        className="md:hidden text-on-surface-variant hover:text-on-surface"
        onClick={onMenuToggle}
      >
        <Menu size={20} />
      </button>

      {/* Page context - breadcrumb can go here */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded px-3 py-1.5">
            <Search size={16} className="text-on-surface-variant" />
            <input
              autoFocus
              type="text"
              placeholder="Search vehicles, drivers, trips..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-64 bg-transparent text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant/60"
              onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
              <X size={14} className="text-on-surface-variant" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded px-3 py-1.5 text-body-sm transition-colors"
          >
            <Search size={14} />
            <span>Search...</span>
            <kbd className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant">⌘K</kbd>
          </button>
        )}
      </div>

      {/* Live Indicator */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low border border-outline-variant">
        {isConnected ? (
          <>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <Wifi size={13} className="text-success" />
            <span className="text-[11px] text-success font-medium hidden sm:block">Live</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-error" />
            <WifiOff size={13} className="text-error" />
            <span className="text-[11px] text-error font-medium hidden sm:block">Offline</span>
          </>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          id="notif-btn"
          onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          className="relative w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-transparent hover:border-outline-variant transition-all"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-outline-variant rounded-md shadow-modal z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
              <h3 className="text-title-lg font-semibold text-on-surface">Notifications</h3>
              {unreadCount > 0 && (
                <button className="text-label-md text-secondary hover:underline" onClick={() => navigate('/notifications')}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {recentNotifs.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant text-center py-8">No notifications</p>
              ) : (
                recentNotifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => { markAsRead(n.id); setNotifOpen(false); navigate('/notifications'); }}
                    className={`px-4 py-3 border-b border-outline-variant/50 hover:bg-surface-container-low cursor-pointer transition-colors ${!n.read ? 'bg-port-blue-light/30' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />}
                      <div className={!n.read ? '' : 'ml-4'}>
                        <p className="text-body-sm font-medium text-on-surface">{n.title}</p>
                        <p className="text-label-md text-on-surface-variant mt-0.5">{n.message}</p>
                        <p className="text-label-sm text-on-surface-variant/60 mt-1">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-outline-variant">
              <button
                onClick={() => { setNotifOpen(false); navigate('/notifications'); }}
                className="text-label-md text-secondary hover:underline w-full text-center"
              >
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-container border border-transparent hover:border-outline-variant transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-label-md font-semibold text-on-surface">{user?.name}</p>
            <p className="text-[10px] text-on-surface-variant">{user?.role.replace(/_/g, ' ')}</p>
          </div>
          <ChevronDown size={14} className="text-on-surface-variant hidden md:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-outline-variant rounded-md shadow-modal z-50">
            <div className="px-4 py-3 border-b border-outline-variant">
              <p className="text-body-sm font-semibold text-on-surface">{user?.name}</p>
              <p className="text-label-sm text-on-surface-variant">{user?.email}</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <User size={14} />Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <Settings size={14} />Settings
              </button>
              <div className="border-t border-outline-variant my-1" />
              <button
                onClick={() => { setProfileOpen(false); handleLogout(); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-body-sm text-error hover:bg-error-container transition-colors"
              >
                <LogOut size={14} />Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
        />
      )}
    </header>
  );
};

export default TopNavBar;
