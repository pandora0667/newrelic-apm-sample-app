'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { BookList, BookSkeleton } from '@/components/books';
import { bookService } from '@/services';
import { BookSimple } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL에서 검색 매개변수 가져오기
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const authorParam = searchParams.get('author') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  
  // 로컬 상태 설정
  const [keyword, setKeyword] = useState(keywordParam);
  const [category, setCategory] = useState(categoryParam || 'all');
  const [author, setAuthor] = useState(authorParam);
  const [page, setPage] = useState(pageParam);
  const [size] = useState(10); // 고정 페이지 크기
  
  const [searchResults, setSearchResults] = useState<BookSimple[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 함수
  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await bookService.searchBooks({
        keyword: keywordParam,
        category: categoryParam !== 'all' ? categoryParam : '',
        author: authorParam,
        page: pageParam,
        size: size,
      });
      
      setSearchResults(result.books || []);
      setTotalElements(result.totalElements || 0);
      setTotalPages(result.totalPages || 0);
      setHasNext(result.hasNext || false);
      setHasSearched(true);
    } catch (error) {
      console.error('도서 검색 중 오류가 발생했습니다:', error);
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      setSearchResults([]);
      setTotalElements(0);
      setTotalPages(0);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [keywordParam, categoryParam, authorParam, pageParam, size]);
  
  // URL 매개변수가 변경될 때 검색 실행
  useEffect(() => {
    if (keywordParam || categoryParam !== 'all' || authorParam || pageParam > 0) {
      performSearch();
    }
  }, [keywordParam, categoryParam, authorParam, pageParam, performSearch]);
  
  // 카테고리 목록 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await bookService.getAllCategories();
        if (categoryData && categoryData.categories) {
          setCategories(categoryData.categories);
        }
      } catch (error) {
        console.error('카테고리 정보를 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    
    loadCategories();
  }, []);
  
  // 검색 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 페이지 초기화
    setPage(0);
    
    // URL 업데이트
    updateSearchParams();
  };
  
  // 검색 매개변수로 URL 업데이트
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (keyword) params.set('keyword', keyword);
    if (category && category !== 'all') params.set('category', category);
    if (author) params.set('author', author);
    // 페이지 정보는 초기화하여 첫 페이지부터 검색
    
    router.push(`/search?${params.toString()}`);
  };
  
  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    // 현재 URL 파라미터 유지하면서 페이지만 변경
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    
    router.push(`/search?${params.toString()}`);
  };
  
  // 필터 초기화
  const handleClearFilters = () => {
    setKeyword('');
    setCategory('all');
    setAuthor('');
    setPage(0);
    
    router.push('/search');
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">도서 검색</h1>
        <p className="text-muted-foreground">
          찾고 싶은 도서를 검색해보세요.
        </p>
      </div>
      
      {/* 검색 필터 영역 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>검색 필터</CardTitle>
          <CardDescription>원하는 조건으로 도서를 검색하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 검색어 입력 */}
              <div className="space-y-2">
                <Label htmlFor="keyword">검색어 (제목 또는 저자)</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="keyword"
                    placeholder="검색어를 입력하세요"
                    className="pl-8"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>
              
              {/* 카테고리 선택 */}
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 저자 입력 */}
              <div className="space-y-2">
                <Label htmlFor="author">저자</Label>
                <Input
                  id="author"
                  placeholder="저자명을 입력하세요"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
            
            {/* 검색 버튼 영역 */}
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                필터 초기화
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                검색
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* 검색 결과 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 결과</CardTitle>
          {hasSearched && (
            <CardDescription>
              총 {totalElements}권의 도서를 찾았습니다.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BookSkeleton key={i} viewMode="grid" />
              ))}
            </div>
          ) : (
            <>
              {hasSearched && searchResults.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">
                    검색 결과가 없습니다. 다른 검색어로 시도해보세요.
                  </p>
                </div>
              ) : (
                <BookList books={searchResults} viewMode="grid" />
              )}
            </>
          )}
        </CardContent>
        
        {/* 페이지네이션 */}
        {hasSearched && totalPages > 0 && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {page * size + 1} - {Math.min((page + 1) * size, totalElements)}권 / 총 {totalElements}권
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center px-4 text-sm">
                {page + 1} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchForm />
      </Suspense>
    </MainLayout>
  );
} 