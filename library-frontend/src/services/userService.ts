import axios from 'axios';
import { User, UserRegisterRequest } from '@/types';

const API_BASE_URL = '/api/v1';

export const userService = {
  // 회원가입
  register: async (userData: UserRegisterRequest): Promise<User> => {
    const response = await axios.post<User>(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  },

  // 사용자 정보 조회
  getUserById: async (userId: string): Promise<User> => {
    const response = await axios.get<User>(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  },

  // 사용자 정보 수정
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await axios.put<User>(`${API_BASE_URL}/users/${userId}`, userData);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${userId}`);
  }
}; 