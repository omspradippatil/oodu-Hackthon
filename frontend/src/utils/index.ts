import { VehicleStatus, DriverStatus, TripStatus, ContainerStatus, EquipmentStatus, ShipStatus, MaintenanceStatus, PortHealthRating, Priority } from '@/types';

// ============================================================================
// Status Color Mappings
// ============================================================================

export const vehicleStatusColors: Record<VehicleStatus, string> = {
  AVAILABLE: 'badge-success',
  ON_TRIP: 'badge-info',
  IN_SHOP: 'badge-warning',
  RETIRED: 'badge-neutral',
};

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
};

export const driverStatusColors: Record<DriverStatus, string> = {
  AVAILABLE: 'badge-success',
  ON_TRIP: 'badge-info',
  OFF_DUTY: 'badge-neutral',
  SUSPENDED: 'badge-error',
};

export const driverStatusLabels: Record<DriverStatus, string> = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
};

export const tripStatusColors: Record<TripStatus, string> = {
  DRAFT: 'badge-neutral',
  APPROVED: 'badge-info',
  DISPATCHED: 'badge-info',
  LOADING: 'badge-warning',
  IN_TRANSIT: 'badge-info',
  DELIVERED: 'badge-success',
  COMPLETED: 'badge-success',
  CANCELLED: 'badge-error',
};

export const tripStatusLabels: Record<TripStatus, string> = {
  DRAFT: 'Draft',
  APPROVED: 'Approved',
  DISPATCHED: 'Dispatched',
  LOADING: 'Loading',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const containerStatusColors: Record<ContainerStatus, string> = {
  WAITING: 'badge-warning',
  ALLOCATED: 'badge-info',
  LOADING: 'badge-info',
  IN_TRANSIT: 'badge-info',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-error',
};

export const equipmentStatusColors: Record<EquipmentStatus, string> = {
  AVAILABLE: 'badge-success',
  BUSY: 'badge-info',
  MAINTENANCE: 'badge-warning',
  OFFLINE: 'badge-neutral',
};

export const shipStatusColors: Record<ShipStatus, string> = {
  WAITING: 'badge-warning',
  DOCKED: 'badge-info',
  LOADING: 'badge-info',
  UNLOADING: 'badge-warning',
  COMPLETED: 'badge-success',
  DEPARTED: 'badge-neutral',
};

export const maintenanceStatusColors: Record<MaintenanceStatus, string> = {
  OPEN: 'badge-error',
  IN_PROGRESS: 'badge-warning',
  COMPLETED: 'badge-success',
};

export const priorityColors: Record<Priority, string> = {
  LOW: 'badge-neutral',
  MEDIUM: 'badge-info',
  HIGH: 'badge-warning',
  CRITICAL: 'badge-error',
};

export const portHealthColors: Record<PortHealthRating, string> = {
  EXCELLENT: 'text-success',
  GOOD: 'text-port-blue',
  AVERAGE: 'text-warning',
  CRITICAL: 'text-error',
};

export const portHealthBgColors: Record<PortHealthRating, string> = {
  EXCELLENT: 'bg-success-container',
  GOOD: 'bg-port-blue-light',
  AVERAGE: 'bg-warning-container',
  CRITICAL: 'bg-error-container',
};

// ============================================================================
// Chart Colors
// ============================================================================

export const CHART_COLORS = {
  primary: '#2D5BFF',
  success: '#27AE60',
  warning: '#F5A623',
  error: '#E74C3C',
  navy: '#0B1F33',
  teal: '#009A50',
  purple: '#7C3AED',
  orange: '#EA580C',
};

export const PIE_COLORS = [
  '#27AE60', // available/success
  '#2D5BFF', // on trip/blue
  '#F5A623', // in shop/warning
  '#94A3B8', // retired/neutral
];

// ============================================================================
// Formatters
// ============================================================================

export const formatCurrency = (amount: number, currency = '₹'): string => {
  if (amount >= 10000000) return `${currency}${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `${currency}${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`;
  return `${currency}${amount.toFixed(2)}`;
};

export const formatNumber = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

export const isLicenseExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

export const isLicenseExpiringSoon = (expiryDate: string, days = 30): boolean => {
  const expiry = new Date(expiryDate);
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return expiry < futureDate && !isLicenseExpired(expiryDate);
};

// ============================================================================
// CSV Export
// ============================================================================

export const exportToCSV = <T extends Record<string, unknown>>(data: T[], filename: string): void => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const header = keys.join(',');
  const rows = data.map(row =>
    keys.map(k => {
      const val = row[k];
      const str = val === null || val === undefined ? '' : String(val);
      return str.includes(',') ? `"${str}"` : str;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ============================================================================
// Validation helpers
// ============================================================================

export const validateRegistrationNo = (regNo: string): boolean => {
  // Indian vehicle registration format: MH-01-XX-1234
  const pattern = /^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/;
  return pattern.test(regNo);
};

export const validatePhone = (phone: string): boolean => {
  const pattern = /^[6-9]\d{9}$/;
  return pattern.test(phone.replace(/\D/g, ''));
};

// ============================================================================
// Port Health Score color
// ============================================================================

export const getHealthScoreColor = (score: number): string => {
  if (score >= 80) return '#27AE60';
  if (score >= 60) return '#F5A623';
  return '#E74C3C';
};

export const getHealthScoreRating = (score: number): PortHealthRating => {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  if (score >= 50) return 'AVERAGE';
  return 'CRITICAL';
};
