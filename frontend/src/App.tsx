import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SSEProvider } from './contexts/SSEContext';
import AppLayout from './components/layouts/AppLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CommandCenterPage from './pages/command-center/CommandCenterPage';
import FleetPage from './pages/fleet/FleetPage';
import DriversPage from './pages/drivers/DriversPage';
import TripsPage from './pages/trips/TripsPage';
import ContainersPage from './pages/containers/ContainersPage';
import EquipmentPage from './pages/equipment/EquipmentPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import FuelPage from './pages/fuel/FuelPage';
import ShipsPage from './pages/ships/ShipsPage';
import DocksPage from './pages/docks/DocksPage';
import WarehousesPage from './pages/warehouses/WarehousesPage';
import RailPage from './pages/rail/RailPage';
import ReportsPage from './pages/reports/ReportsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-body-sm">Loading PortSync…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SSEProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="command-center" element={<CommandCenterPage />} />
                <Route path="fleet" element={<FleetPage />} />
                <Route path="drivers" element={<DriversPage />} />
                <Route path="trips" element={<TripsPage />} />
                <Route path="containers" element={<ContainersPage />} />
                <Route path="equipment" element={<EquipmentPage />} />
                <Route path="maintenance" element={<MaintenancePage />} />
                <Route path="fuel" element={<FuelPage />} />
                <Route path="ships" element={<ShipsPage />} />
                <Route path="docks" element={<DocksPage />} />
                <Route path="warehouses" element={<WarehousesPage />} />
                <Route path="rail" element={<RailPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </SSEProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
