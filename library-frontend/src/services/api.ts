import axios from 'axios';

// API 기본 설정
const api = axios.create({
  // Next.js API Routes를 사용하기 위해 baseURL을 변경합니다.
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    // 요청 전에 처리할 작업 (예: 토큰 추가)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리 로직
    return Promise.reject(error);
  }
);

export default api; 