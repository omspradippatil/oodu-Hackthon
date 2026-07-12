import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 / refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.data?.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to unwrap axios response
const unwrap = <T>(promise: Promise<AxiosResponse<T>>): Promise<T> =>
  promise.then((r) => r.data);

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  login: (email: string, password: string) =>
    unwrap(api.post('/auth/login', { email, password })),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    unwrap(api.post('/auth/register', data)),
  logout: () => unwrap(api.post('/auth/logout')),
  refresh: () => unwrap(api.post('/auth/refresh')),
  getProfile: () => unwrap(api.get('/auth/profile')),
  updateProfile: (data: { name?: string; email?: string }) =>
    unwrap(api.put('/auth/profile', data)),
  forgotPassword: (email: string) => unwrap(api.post('/auth/forgot-password', { email })),
  resetPassword: (token: string, password: string) =>
    unwrap(api.post('/auth/reset-password', { token, password })),
};

// ============================================================================
// Vehicles API
// ============================================================================

export const vehiclesApi = {
  getAll: (params?: Record<string, string>) =>
    unwrap(api.get('/vehicles', { params })),
  getById: (id: string) => unwrap(api.get(`/vehicles/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/vehicles', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/vehicles/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/vehicles/${id}`)),
  getAvailable: (minCapacity?: number) =>
    unwrap(api.get('/vehicles/available', { params: { minCapacity } })),
  getStats: () => unwrap(api.get('/vehicles/stats')),
};

// ============================================================================
// Drivers API
// ============================================================================

export const driversApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/drivers', { params })),
  getById: (id: string) => unwrap(api.get(`/drivers/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/drivers', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/drivers/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/drivers/${id}`)),
  getAvailable: () => unwrap(api.get('/drivers/available')),
};

// ============================================================================
// Trips API
// ============================================================================

export const tripsApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/trips', { params })),
  getById: (id: string) => unwrap(api.get(`/trips/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/trips', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/trips/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/trips/${id}`)),
  dispatch: (id: string) => unwrap(api.post(`/trips/${id}/dispatch`)),
  complete: (id: string) => unwrap(api.post(`/trips/${id}/complete`)),
  cancel: (id: string) => unwrap(api.post(`/trips/${id}/cancel`)),
};

// ============================================================================
// Containers API
// ============================================================================

export const containersApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/containers', { params })),
  getById: (id: string) => unwrap(api.get(`/containers/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/containers', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/containers/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/containers/${id}`)),
  getRequests: () => unwrap(api.get('/containers/requests')),
  createRequest: (data: Record<string, unknown>) => unwrap(api.post('/containers/requests', data)),
};

// ============================================================================
// Equipment API
// ============================================================================

export const equipmentApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/equipment', { params })),
  getById: (id: string) => unwrap(api.get(`/equipment/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/equipment', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/equipment/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/equipment/${id}`)),
  getAvailable: () => unwrap(api.get('/equipment/available')),
};

// ============================================================================
// Maintenance API
// ============================================================================

export const maintenanceApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/maintenance', { params })),
  getById: (id: string) => unwrap(api.get(`/maintenance/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/maintenance', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/maintenance/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/maintenance/${id}`)),
  open: (id: string) => unwrap(api.post(`/maintenance/${id}/open`)),
  close: (id: string, cost?: number) => unwrap(api.post(`/maintenance/${id}/close`, { cost })),
};

// ============================================================================
// Fuel API
// ============================================================================

export const fuelApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/fuel', { params })),
  getById: (id: string) => unwrap(api.get(`/fuel/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/fuel', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/fuel/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/fuel/${id}`)),
};

// ============================================================================
// Expenses API
// ============================================================================

export const expensesApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/expenses', { params })),
  getById: (id: string) => unwrap(api.get(`/expenses/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/expenses', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/expenses/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/expenses/${id}`)),
};

// ============================================================================
// Ships API
// ============================================================================

export const shipsApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/ships', { params })),
  getById: (id: string) => unwrap(api.get(`/ships/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/ships', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/ships/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/ships/${id}`)),
  dockShip: (id: string, dockId: string) => unwrap(api.post(`/ships/${id}/dock`, { dockId })),
  departShip: (id: string) => unwrap(api.post(`/ships/${id}/depart`)),
};

// ============================================================================
// Docks API
// ============================================================================

export const docksApi = {
  getAll: (params?: Record<string, string>) => unwrap(api.get('/docks', { params })),
  getById: (id: string) => unwrap(api.get(`/docks/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/docks', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/docks/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/docks/${id}`)),
};

// ============================================================================
// Warehouses API
// ============================================================================

export const warehousesApi = {
  getAll: () => unwrap(api.get('/warehouses')),
  getById: (id: string) => unwrap(api.get(`/warehouses/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/warehouses', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/warehouses/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/warehouses/${id}`)),
};

// ============================================================================
// Rail Tracks API
// ============================================================================

export const railTracksApi = {
  getAll: () => unwrap(api.get('/rail-tracks')),
  getById: (id: string) => unwrap(api.get(`/rail-tracks/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/rail-tracks', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/rail-tracks/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/rail-tracks/${id}`)),
};

// ============================================================================
// Dashboard & Analytics API
// ============================================================================

export const dashboardApi = {
  getKPIs: () => unwrap(api.get('/analytics/kpis')),
  getPortHealth: () => unwrap(api.get('/port-health')),
  getRecentActivity: (limit?: number) =>
    unwrap(api.get('/activity', { params: { limit: limit || 10 } })),
  getCharts: () => unwrap(api.get('/analytics/charts')),
};

export const analyticsApi = {
  getCharts: () => unwrap(api.get('/analytics/charts')),
  getVehicleStats: () => unwrap(api.get('/analytics/vehicles')),
  getDriverStats: () => unwrap(api.get('/analytics/drivers')),
  getTripStats: () => unwrap(api.get('/analytics/trips')),
  getFuelStats: () => unwrap(api.get('/analytics/fuel')),
};

// ============================================================================
// Reports API
// ============================================================================

export const reportsApi = {
  getFleetReport: (params?: Record<string, string>) =>
    unwrap(api.get('/reports/fleet', { params })),
  getTripReport: (params?: Record<string, string>) =>
    unwrap(api.get('/reports/trips', { params })),
  getFuelReport: (params?: Record<string, string>) =>
    unwrap(api.get('/reports/fuel', { params })),
  getExpenseReport: (params?: Record<string, string>) =>
    unwrap(api.get('/reports/expenses', { params })),
  getMaintenanceReport: (params?: Record<string, string>) =>
    unwrap(api.get('/reports/maintenance', { params })),
  getContainerReport: (params?: Record<string, string>) =>
    unwrap(api.get('/reports/containers', { params })),
  getDriverPerformanceReport: (params?: Record<string, string>) =>
    unwrap(api.get('/reports/driver-performance', { params })),
};

// ============================================================================
// Smart Recommendation API
// ============================================================================

export const recommendApi = {
  getRecommendation: (params: { cargoWeight: number; sourceDockId?: string; destination?: string }) =>
    unwrap(api.get('/recommend', { params })),
};

// ============================================================================
// Notifications API
// ============================================================================

export const notificationsApi = {
  getAll: () => unwrap(api.get('/notifications')),
  markRead: (id: string) => unwrap(api.put(`/notifications/${id}/read`)),
  markAllRead: () => unwrap(api.put('/notifications/read-all')),
};

// ============================================================================
// Port Health API
// ============================================================================

export const portHealthApi = {
  getScore: () => unwrap(api.get('/port-health')),
};

// ============================================================================
// Settings API
// ============================================================================

export const settingsApi = {
  get: () => unwrap(api.get('/settings')),
  update: (data: Record<string, unknown>) => unwrap(api.put('/settings', data)),
};

// ============================================================================
// Users API (Admin only)
// ============================================================================

export const usersApi = {
  getAll: () => unwrap(api.get('/users')),
  getById: (id: string) => unwrap(api.get(`/users/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(api.post('/users', data)),
  update: (id: string, data: Record<string, unknown>) => unwrap(api.put(`/users/${id}`, data)),
  delete: (id: string) => unwrap(api.delete(`/users/${id}`)),
};

export default api;
