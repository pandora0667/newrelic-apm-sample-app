import api from './api';
import { SearchParams, SearchResponse } from '@/types';

export const searchService = {
  // 도서 검색
  searchBooks: async (params: SearchParams): Promise<SearchResponse> => {
    const { keyword, category, author, page = 0, size = 10 } = params;
    
    // URL 파라미터 구성
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append('keyword', keyword);
    if (category) queryParams.append('category', category);
    if (author) queryParams.append('author', author);
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    const response = await api.get<SearchResponse>(`/search/books?${queryParams.toString()}`);
    return response.data;
  },
}; 