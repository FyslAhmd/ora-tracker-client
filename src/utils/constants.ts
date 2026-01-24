// Score thresholds for color coding
export const SCORE_THRESHOLDS = {
  excellent: { min: 90, color: '#22c55e', label: 'Excellent', bgClass: 'bg-green-500/20', textClass: 'text-green-400' },
  good: { min: 70, color: '#84cc16', label: 'Good', bgClass: 'bg-lime-500/20', textClass: 'text-lime-400' },
  fair: { min: 50, color: '#eab308', label: 'Fair', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400' },
  poor: { min: 30, color: '#f97316', label: 'Poor', bgClass: 'bg-orange-500/20', textClass: 'text-orange-400' },
  critical: { min: 0, color: '#ef4444', label: 'Critical', bgClass: 'bg-red-500/20', textClass: 'text-red-400' },
};

export const getScoreConfig = (score: number) => {
  if (score >= 90) return SCORE_THRESHOLDS.excellent;
  if (score >= 70) return SCORE_THRESHOLDS.good;
  if (score >= 50) return SCORE_THRESHOLDS.fair;
  if (score >= 30) return SCORE_THRESHOLDS.poor;
  return SCORE_THRESHOLDS.critical;
};

// Traffic score colors
export const TRAFFIC_SCORE_COLORS: Record<string, { bgClass: string; textClass: string }> = {
  A: { bgClass: 'bg-green-500/20', textClass: 'text-green-400' },
  B: { bgClass: 'bg-lime-500/20', textClass: 'text-lime-400' },
  C: { bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400' },
  D: { bgClass: 'bg-orange-500/20', textClass: 'text-orange-400' },
  F: { bgClass: 'bg-red-500/20', textClass: 'text-red-400' },
};

// Role colors
export const ROLE_COLORS: Record<string, { bgClass: string; textClass: string }> = {
  admin: { bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
  inspector: { bgClass: 'bg-cyan-500/20', textClass: 'text-cyan-400' },
  viewer: { bgClass: 'bg-slate-500/20', textClass: 'text-slate-400' },
};

// Format relative date
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Score level type
export type ScoreLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

// Get score level based on value
export const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 30) return 'poor';
  return 'critical';
};

// Score colors with hex values for charts
export const SCORE_COLORS: Record<ScoreLevel, { hex: string; bg: string; text: string }> = {
  excellent: { hex: '#22c55e', bg: 'bg-green-500', text: 'text-green-400' },
  good: { hex: '#84cc16', bg: 'bg-lime-500', text: 'text-lime-400' },
  fair: { hex: '#eab308', bg: 'bg-yellow-500', text: 'text-yellow-400' },
  poor: { hex: '#f97316', bg: 'bg-orange-500', text: 'text-orange-400' },
  critical: { hex: '#ef4444', bg: 'bg-red-500', text: 'text-red-400' },
};

// Vehicle types
export const VEHICLE_TYPES = [
  'Sedan',
  'SUV',
  'Truck',
  'Van',
  'Bus',
  'Motorcycle',
  'Heavy Equipment',
  'Trailer',
  'Emergency Vehicle',
  'Other',
];

// Status badge variants
export const getStatusBadgeVariant = (
  status: string
): 'default' | 'success' | 'info' | 'warning' => {
  switch (status) {
    case 'active':
      return 'success';
    case 'completed':
      return 'info';
    case 'archived':
      return 'default';
    case 'draft':
    default:
      return 'warning';
  }
};

// Format date with time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate days until next inspection
export const getDaysUntilInspection = (nextInspectionDate: string): number => {
  const now = new Date();
  const inspection = new Date(nextInspectionDate);
  const diffTime = inspection.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get inspection urgency
export const getInspectionUrgency = (
  nextInspectionDate: string
): 'overdue' | 'urgent' | 'upcoming' | 'normal' => {
  const days = getDaysUntilInspection(nextInspectionDate);
  if (days < 0) return 'overdue';
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'upcoming';
  return 'normal';
};
