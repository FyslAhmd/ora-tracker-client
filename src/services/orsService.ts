import api from './api';
import { 
  ApiResponse, 
  ORSPlan, 
  ORSQueryParams, 
  ORSFormData, 
  PaginationInfo,
  ORSStats 
} from '@/types';

interface ORSListResponse {
  orsPlans: ORSPlan[];
  pagination: PaginationInfo;
}

interface ORSStatsResponse {
  stats: ORSStats;
  recentPlans: ORSPlan[];
}

export const orsService = {
  getAll: async (params?: ORSQueryParams): Promise<ORSListResponse> => {
    const response = await api.get<ApiResponse<ORSListResponse>>('/ors', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<ORSPlan> => {
    const response = await api.get<ApiResponse<{ orsPlan: ORSPlan }>>(`/ors/${id}`);
    return response.data.data!.orsPlan;
  },

  create: async (data: ORSFormData): Promise<ORSPlan> => {
    const response = await api.post<ApiResponse<{ orsPlan: ORSPlan }>>('/ors', data);
    return response.data.data!.orsPlan;
  },

  update: async (id: string, data: Partial<ORSFormData>): Promise<ORSPlan> => {
    const response = await api.put<ApiResponse<{ orsPlan: ORSPlan }>>(`/ors/${id}`, data);
    return response.data.data!.orsPlan;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/ors/${id}`);
  },

  getStats: async (): Promise<ORSStatsResponse> => {
    const response = await api.get<ApiResponse<ORSStatsResponse>>('/ors/stats');
    return response.data.data!;
  },
};

export default orsService;
