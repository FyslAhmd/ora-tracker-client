import api from './api';
import { 
  ApiResponse, 
  User, 
  UserQueryParams, 
  PaginationInfo,
  UserStats,
  UserRole,
  RegisterData
} from '@/types';

interface UserListResponse {
  users: User[];
  pagination: PaginationInfo;
}

interface CreateUserData extends RegisterData {
  role: UserRole;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const usersService = {
  getAll: async (params?: UserQueryParams): Promise<UserListResponse> => {
    const response = await api.get<ApiResponse<UserListResponse>>('/users', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data.data!.user;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User }>>('/users', data);
    return response.data.data!.user;
  },

  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}`, data);
    return response.data.data!.user;
  },

  updateRole: async (id: string, role: UserRole): Promise<User> => {
    const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}`, { role });
    return response.data.data!.user;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getStats: async (): Promise<UserStats> => {
    const response = await api.get<ApiResponse<{ stats: UserStats }>>('/users/stats');
    return response.data.data!.stats;
  },
};

export default usersService;
