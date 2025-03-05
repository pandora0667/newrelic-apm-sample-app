// 사용하지 않는 import와 타입 제거
import { Loan, LoanWithBook } from '@/types/loan';

// API URL 설정
const API_BASE_URL = '/api/v1';

// 새 대출 생성
export async function createLoan(userId: string, bookId: string): Promise<Loan> {
  try {
    // 오늘 날짜와 30일 후 날짜 계산
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30); // 기본 대출 기간은 30일
    
    const loanData = {
      userId,
      bookId,
      loanDate: today.toISOString().split('T')[0], // YYYY-MM-DD 형태
      dueDate: dueDate.toISOString().split('T')[0]
    };
    
    console.log('대출 요청 데이터:', loanData);
    
    const response = await fetch(`${API_BASE_URL}/loans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 응답 에러:', response.status, errorText);
      throw new Error(`도서 대출에 실패했습니다: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('대출 성공 응답:', data);
    
    return data;
  } catch (error) {
    console.error('도서 대출 오류:', error);
    throw error;
  }
}

// 사용자 대출 목록 조회
export async function getUserLoans(userId: string): Promise<LoanWithBook[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/loans?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('대출 내역을 불러오는데 실패했습니다.');
    }
    
    const data: Loan[] = await response.json();
    
    // Transform Loan to LoanWithBook
    return data.map(loan => ({
      ...loan,
      book: {
        title: loan.bookTitle,
        author: loan.bookAuthor,
        isbn: loan.bookId,
        category: 'Unknown' // 백엔드에서 카테고리 정보를 제공하지 않는 경우 기본값
      }
    }));
  } catch (error) {
    console.error('대출 목록 조회 오류:', error);
    throw error;
  }
}

// 도서 반납
export async function returnBook(loanId: string, returnDate: string): Promise<Loan> {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/return`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ returnDate }),
    });
    
    if (!response.ok) {
      throw new Error(`도서 반납에 실패했습니다: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('도서 반납 오류:', error);
    throw error;
  }
}

// 대출 연장 (일수 지정)
export async function extendLoan(loanId: string, days: number): Promise<Loan> {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/extend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ days }),
    });
    
    if (!response.ok) {
      throw new Error(`대출 연장에 실패했습니다: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('대출 연장 오류:', error);
    throw error;
  }
}

// 대출 연장 (기본 일수)
export async function extendLoanWithDefaultDays(loanId: string): Promise<Loan> {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/extend/default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`기본 일수로 대출 연장에 실패했습니다: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('기본 일수 대출 연장 오류:', error);
    throw error;
  }
}

const loanService = {
  getUserLoans,
  returnBook,
  extendLoan,
  extendLoanWithDefaultDays,
  createLoan
};

export default loanService; 