import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  Users,
  Package,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Anchor,
  Ship,
  Warehouse,
  Train,
  Boxes,
  Command,
  CircleGauge,
  DollarSign,
  Activity,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSSE } from '@/contexts/SSEContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  roles?: string[];
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/command-center', label: 'Port Command', icon: <Command size={20} /> },
  { path: '/fleet', label: 'Fleet Management', icon: <Truck size={20} /> },
  { path: '/drivers', label: 'Drivers', icon: <Users size={20} /> },
  { path: '/trips', label: 'Trip Management', icon: <Route size={20} /> },
  { path: '/containers', label: 'Containers', icon: <Package size={20} /> },
  { path: '/tracking', label: 'Container Tracking', icon: <Search size={20} /> },
  { path: '/ships', label: 'Ship Arrivals', icon: <Ship size={20} /> },
  { path: '/docks', label: 'Dock Management', icon: <Anchor size={20} /> },
  { path: '/equipment', label: 'Equipment', icon: <Boxes size={20} /> },
  { path: '/maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
  { path: '/fuel', label: 'Fuel & Expenses', icon: <Fuel size={20} /> },
  { path: '/warehouses', label: 'Warehouses', icon: <Warehouse size={20} /> },
  { path: '/rail', label: 'Rail Dispatch', icon: <Train size={20} /> },
  { path: '/reports', label: 'Reports', icon: <CircleGauge size={20} /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { path: '/expenses', label: 'Expenses', icon: <DollarSign size={20} /> },
  { path: '/notifications', label: 'Notifications', icon: <Bell size={20} /> },
  { path: '/live-updates', label: 'Live Updates', icon: <Activity size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, onMobileClose }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useSSE();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const updatedNavItems = navItems.map(item =>
    item.path === '/notifications' ? { ...item, badge: unreadCount || undefined } : item
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col sidebar-shadow overflow-hidden"
      style={{ backgroundColor: '#0B1F33' }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center h-16 px-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center flex-shrink-0">
            <Anchor size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <div className="whitespace-nowrap">
                  <p className="text-white font-bold text-sm leading-tight">VADHVAN</p>
                  <p className="text-white/50 text-xs leading-tight">GOES Port</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onToggle}
          className="ml-auto text-white/40 hover:text-white transition-colors hidden md:flex flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">
        {updatedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 relative group ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-r"
                  />
                )}
                <span className="flex-shrink-0">{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-body-sm font-medium whitespace-nowrap overflow-hidden flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && item.badge > 0 && (
                  <span className="bg-error text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-primary-container text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="flex-shrink-0 border-t border-white/10 p-3 space-y-2">
        {user && (
          <div className={`flex items-center gap-3 px-1 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden flex-1 min-w-0"
                >
                  <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                  <p className="text-white/40 text-[10px] truncate">{user.role.replace('_', ' ')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-white/60 hover:text-white hover:bg-error/20 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-body-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
