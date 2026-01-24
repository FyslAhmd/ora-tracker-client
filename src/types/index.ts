// User Types
export type UserRole = 'admin' | 'inspector' | 'viewer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ORS Plan Types
export type ORSStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface ORSScores {
  engine: number;
  brakes: number;
  tires: number;
  transmission: number;
  electrical: number;
  suspension: number;
  steering: number;
  bodyExterior: number;
  interior: number;
  safetyEquipment: number;
}

export interface TextDocumentation {
  engineNotes?: string;
  brakesNotes?: string;
  tiresNotes?: string;
  transmissionNotes?: string;
  electricalNotes?: string;
  suspensionNotes?: string;
  steeringNotes?: string;
  bodyExteriorNotes?: string;
  interiorNotes?: string;
  safetyEquipmentNotes?: string;
}

export interface ORSPlan {
  _id: string;
  vehicleId: string;
  vehicleType: string;
  inspectionDate: string;
  nextInspectionDate: string;
  status: ORSStatus;
  scores: ORSScores;
  overallScore: number;
  textDocumentation: TextDocumentation;
  notes?: string;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ORSPlansResponse {
  plans: ORSPlan[];
  pagination: PaginationInfo;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

// Auth Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ORS Query Types
export interface ORSQueryParams {
  search?: string;
  status?: string;
  scoreMin?: number;
  scoreMax?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface UserQueryParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

// Form Types
export interface ORSFormData {
  vehicleId: string;
  vehicleType: string;
  inspectionDate: string;
  nextInspectionDate: string;
  status: ORSStatus;
  scores: ORSScores;
  textDocumentation: TextDocumentation;
  notes?: string;
  assignedTo?: string;
}

// Stats Types
export interface ORSStats {
  total: number;
  averageScore: number;
  byStatus: {
    draft: number;
    active: number;
    completed: number;
    archived: number;
  };
  byScoreLevel: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
    critical: number;
  };
}

export interface ORSStatsResponse {
  success: boolean;
  data: ORSStats;
}

export interface UserStats {
  total: number;
  byRole: {
    admin: number;
    inspector: number;
    viewer: number;
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStats;
}
