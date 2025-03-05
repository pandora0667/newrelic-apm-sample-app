import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 yyyy-MM-dd 형식의 문자열로 변환
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // 유효하지 않은 날짜는 그대로 반환
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '');
};

/**
 * 지정된 날짜까지 남은 일수 계산
 */
export const getDaysUntil = (dateString: string): number => {
  if (!dateString) return 0;
  
  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) return 0;
  
  const today = new Date();
  
  // 시간 부분 제거
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 연체된 일수 계산
 */
export const getDaysOverdue = (dateString: string): number => {
  const daysUntil = getDaysUntil(dateString);
  return daysUntil < 0 ? Math.abs(daysUntil) : 0;
};
