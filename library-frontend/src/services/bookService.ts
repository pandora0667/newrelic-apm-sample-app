import api from './api';
import { Book, BookCreateRequest, BookSimple, BookUpdateRequest, PaginatedResponse } from '@/types';

export const bookService = {
  // 도서 등록 (관리자용)
  createBook: async (bookData: BookCreateRequest): Promise<Book> => {
    const response = await api.post<Book>('/api/v1/books', bookData);
    return response.data;
  },

  // 도서 정보 수정 (관리자용)
  updateBook: async (bookId: string, bookData: BookUpdateRequest): Promise<Book> => {
    const response = await api.put<Book>(`/api/v1/books/${bookId}`, bookData);
    return response.data;
  },

  // 도서 삭제 (관리자용)
  deleteBook: async (bookId: string): Promise<void> => {
    await api.delete(`/api/v1/books/${bookId}`);
  },

  // 도서 목록 조회
  getAllBooks: async (): Promise<BookSimple[]> => {
    const response = await api.get('/api/v1/books?format=array');
    
    // 응답 형식 확인
    if (Array.isArray(response.data)) {
      // 배열 형태로 직접 반환되는 경우
      return response.data;
    } else if (response.data && typeof response.data === 'object' && 'content' in response.data && Array.isArray(response.data.content)) {
      // PaginatedResponse 형태로 반환되는 경우
      return response.data.content;
    } else {
      console.error('서버에서 반환된 도서 데이터 형식이 예상과 다릅니다:', response.data);
      return [];
    }
  },

  // 도서 목록 페이지네이션 조회
  getBooksPaginated: async (page: number, size: number): Promise<PaginatedResponse<BookSimple>> => {
    const response = await api.get<PaginatedResponse<BookSimple>>(`/api/v1/books?page=${page}&size=${size}`);
    return response.data;
  },

  // 카테고리 목록 및 각 카테고리별 도서 수 조회
  getAllCategories: async (): Promise<{ categories: string[], countByCategory: Record<string, number> }> => {
    try {
      // 모든 도서 데이터를 한 번에 가져옴 (API가 모든 데이터를 반환한다고 가정)
      const response = await api.get('/api/v1/books?format=array');
      
      // 응답 형식 확인
      let books: BookSimple[] = [];
      
      if (Array.isArray(response.data)) {
        // 배열 형태로 직접 반환되는 경우
        books = response.data;
      } else if (response.data && typeof response.data === 'object' && 'content' in response.data && Array.isArray(response.data.content)) {
        // PaginatedResponse 형태로 반환되는 경우
        books = response.data.content;
      } else {
        throw new Error('카테고리 정보를 불러올 수 없습니다');
      }
      
      // 카테고리별 도서 수 계산
      const countByCategory: Record<string, number> = {};
      const categorySet = new Set<string>();
      
      books.forEach(book => {
        if (book.category) {
          categorySet.add(book.category);
          countByCategory[book.category] = (countByCategory[book.category] || 0) + 1;
        }
      });
      
      return {
        categories: Array.from(categorySet).sort(),
        countByCategory
      };
    } catch (error) {
      console.error('카테고리 정보를 불러오는 중 오류가 발생했습니다:', error);
      return { categories: [], countByCategory: {} };
    }
  },

  // 도서 상세 조회
  getBookById: async (bookId: string): Promise<Book> => {
    const response = await api.get<Book>(`/api/v1/books/${bookId}`);
    return response.data;
  },

  // 카테고리별 도서 조회
  getBooksByCategory: async (category: string): Promise<BookSimple[]> => {
    const response = await api.get<BookSimple[]>(`/api/v1/books/category/${category}`);
    return response.data;
  },
  
  // 도서 검색
  searchBooks: async (params: {
    keyword?: string;
    category?: string;
    author?: string;
    page?: number;
    size?: number;
  }): Promise<{
    books: BookSimple[];
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
  }> => {
    // URL 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category) queryParams.append('category', params.category);
    if (params.author) queryParams.append('author', params.author);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    
    const queryString = queryParams.toString();
    const url = `/api/v1/search/books${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },
}; 