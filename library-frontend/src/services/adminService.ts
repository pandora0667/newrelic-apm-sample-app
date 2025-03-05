import { HealthStatus, LibraryStats, SystemStatus } from '@/types';
import api from './api';

export const adminService = {
  // 도서관 통계 조회
  getLibraryStats: async (): Promise<LibraryStats> => {
    const response = await api.get('/api/v1/admin/reports/summary');
    return response.data;
  },

  // 시스템 헬스 체크
  checkHealth: async (): Promise<HealthStatus> => {
    const response = await api.get<HealthStatus>('/monitor/health');
    return response.data;
  },

  // 시스템 상태 정보
  getSystemStatus: async (): Promise<SystemStatus> => {
    const response = await api.get('/api/v1/monitor/status');
    return response.data;
  },
}; 