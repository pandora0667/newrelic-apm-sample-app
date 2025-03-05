import { BookReservation, ReservationRequest, ReservationResponse } from '@/types/reservation';

// API URL 설정
const API_BASE_URL = '/api/v1';

export const reservationService = {
  // 예약 가능한 도서 목록 조회
  getAvailableBooks: async (userId?: string): Promise<BookReservation[]> => {
    try {
      const url = userId 
        ? `${API_BASE_URL}/books/available-for-reservation?userId=${userId}`
        : `${API_BASE_URL}/books/available-for-reservation`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`예약 가능한 도서 목록을 불러오는데 실패했습니다: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('서비스 오류:', error);
      throw error;
    }
  },

  // 도서 예약
  createReservation: async (data: ReservationRequest): Promise<ReservationResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          reservationDate: new Date().toISOString().replace('Z', ''),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`예약 생성에 실패했습니다: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('예약 생성 오류:', error);
      throw error;
    }
  },

  // 예약 취소
  cancelReservation: async (reservationId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`예약 취소에 실패했습니다: ${response.status}`);
      }
    } catch (error) {
      console.error('예약 취소 오류:', error);
      throw error;
    }
  },

  // 사용자 예약 내역 조회
  getReservationsByUserId: async (userId: string): Promise<ReservationResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/reservations/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user reservations');
    }
    return response.json();
  },

  // 예약 완료 처리
  completeReservation: async (reservationId: string): Promise<ReservationResponse> => {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/complete`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to complete reservation');
    }
    return response.json();
  },
}; 