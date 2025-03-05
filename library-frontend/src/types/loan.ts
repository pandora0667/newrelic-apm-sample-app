// 대출 상태 열거형
export enum LoanStatus {
  LOANED = 'LOANED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE'
}

// 대출 정보 인터페이스
export interface Loan {
  loanId: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  loanDate: string;
  dueDate: string;
  status: LoanStatus;
  extensionCount: number;
  returnedAt?: string | null;
  createdAt: string;
}

// 대출 내역에 표시할 확장 인터페이스 (도서 정보 포함)
export interface LoanWithBook extends Loan {
  book?: {
    title: string;
    author: string;
    isbn: string;
    category: string;
  };
}

// 대출 생성 요청 인터페이스
export interface LoanCreateRequest {
  userId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
}

// 대출 반납 요청 인터페이스
export interface LoanReturnRequest {
  returnDate: string;
}

// 대출 연장 요청 인터페이스
export interface LoanExtendRequest {
  days: number;
} 