// User Types
export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  createdAt?: string;
  registeredAt?: string;
  updatedAt?: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface UserUpdateRequest {
  email?: string;
  fullName?: string;
}

// Book Types
export interface Book {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  category: string;
  copiesAvailable: number;
  description: string;
}

export interface BookCreateRequest {
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  category: string;
  copiesAvailable: number;
  description: string;
}

export interface BookUpdateRequest {
  title?: string;
  author?: string;
  isbn?: string;
  publishedDate?: string;
  category?: string;
  copiesAvailable?: number;
  description?: string;
}

export interface BookSimple {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  category: string;
  copiesAvailable: number;
}

// Loan Types
export interface Loan {
  loanId: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  loanDate: string;
  dueDate: string;
  status: 'LOANED' | 'RETURNED';
  extensionCount: number;
  returnedAt?: string;
  createdAt?: string;
}

export interface LoanCreateRequest {
  userId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
}

export interface LoanReturnRequest {
  returnDate: string;
}

export interface LoanExtendRequest {
  days: number;
}

// Reservation Types
export interface Reservation {
  reservationId: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  reservationDate: string;
  status: 'RESERVED' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

export interface ReservationCreateRequest {
  userId: string;
  bookId: string;
  reservationDate: string;
}

// Search Types
export interface SearchParams {
  keyword?: string;
  category?: string;
  author?: string;
  page?: number;
  size?: number;
}

export interface SearchResponse {
  books: BookSimple[];
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

// Admin Report Types
export interface LibraryStats {
  totalBooks: number;
  totalLoans: number;
  totalReservations: number;
  activeUsers: number;
  booksByCategory: Record<string, number>;
  topBooks: {
    bookId: string;
    title: string;
    author: string;
    loanCount: number;
  }[];
}

// Monitoring Types
export interface HealthStatus {
  status: string;
  database: {
    status: string;
    responseTime: string;
  };
  timestamp: string;
}

export interface SystemStatus {
  database: {
    status: string;
    responseTime: string;
  };
  cache: {
    status: string;
    responseTime: string;
  };
  externalService: {
    status: string;
    responseTime: string;
  };
}

// Pagination
export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  hasNext: boolean;
}

export * from './loan'; 