'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BookList, BookFilter, BookSkeleton } from '@/components/books';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';
import { bookService } from '@/services';
import { BookSimple } from '@/types';

// 도서 정렬 옵션 타입
type SortOption = 'title' | 'author' | 'publishedDate';

export default function BooksPage() {
  const [books, setBooks] = useState<BookSimple[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookSimple[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [countByCategory, setCountByCategory] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 도서 목록 로드
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const booksData = await bookService.getAllBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);
        
        // 카테고리 정보 로드
        try {
          const categoryData = await bookService.getAllCategories();
          if (categoryData && categoryData.categories) {
            setCategories(['전체', ...categoryData.categories]);
            setCountByCategory(categoryData.countByCategory || {});
          } else {
            setCategories(['전체']);
            setCountByCategory({});
          }
        } catch (categoryError) {
          console.error('카테고리 정보를 불러오는 중 오류가 발생했습니다:', categoryError);
          setCategories(['전체']);
          setCountByCategory({});
        }
      } catch (error) {
        console.error('도서 목록을 불러오는 중 오류가 발생했습니다:', error);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // 카테고리 필터링
  useEffect(() => {
    // books가 없거나 빈 배열인 경우 처리
    if (!books || books.length === 0) {
      setFilteredBooks([]);
      return;
    }
    
    if (selectedCategory === '전체') {
      setFilteredBooks(sortBooks(books, sortOption, sortDirection));
    } else {
      const filtered = books.filter(book => book.category === selectedCategory);
      setFilteredBooks(sortBooks(filtered, sortOption, sortDirection));
    }
  }, [selectedCategory, books, sortOption, sortDirection]);

  // 정렬 함수
  const sortBooks = (booksToSort: BookSimple[], option: SortOption, direction: 'asc' | 'desc') => {
    // 배열이 아니거나 undefined인 경우 빈 배열 반환
    if (!booksToSort || !Array.isArray(booksToSort)) {
      return [];
    }
    
    return [...booksToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (option) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'publishedDate':
          const dateA = a.publishedDate ? new Date(a.publishedDate) : new Date(0);
          const dateB = b.publishedDate ? new Date(b.publishedDate) : new Date(0);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        default:
          comparison = 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">도서 목록</h1>
          <p className="text-muted-foreground">
            다양한 장르의 도서를 살펴보세요.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* 필터 사이드바 */}
          <aside className="w-full md:w-1/4 md:self-start md:sticky" 
            style={{ 
              top: '5.5rem', 
              height: 'fit-content', 
              transition: 'all 0.3s ease',
              zIndex: 10,
              paddingTop: '0.5rem'
            }}>
            <Card className="md:h-auto shadow-md border border-gray-200">
              <CardHeader className="pb-4 bg-background/95 backdrop-blur-sm">
                <CardTitle>카테고리</CardTitle>
                <CardDescription>원하는 카테고리를 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <BookFilter 
                    categories={categories}
                    countByCategory={countByCategory}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                  />
                )}
              </CardContent>
            </Card>
          </aside>

          {/* 도서 목록 영역 */}
          <div className="w-full md:w-3/4">
            <Card className="shadow-sm border-muted">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center">
                    {selectedCategory === '전체' 
                      ? '모든 도서' 
                      : (
                        <>
                          <span>{selectedCategory}</span>
                          <span className="ml-2 text-sm font-normal px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {countByCategory[selectedCategory] || 0}권
                          </span>
                        </>
                      )}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={viewMode === 'grid' ? 'default' : 'outline'} 
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className="w-8 h-8"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={viewMode === 'list' ? 'default' : 'outline'} 
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className="w-8 h-8"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    <select 
                      className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={`${sortOption}-${sortDirection}`}
                      onChange={(e) => {
                        const [option, direction] = e.target.value.split('-');
                        setSortOption(option as SortOption);
                        setSortDirection(direction as 'asc' | 'desc');
                      }}
                    >
                      <option value="title-asc">제목 (오름차순)</option>
                      <option value="title-desc">제목 (내림차순)</option>
                      <option value="author-asc">저자 (오름차순)</option>
                      <option value="author-desc">저자 (내림차순)</option>
                      <option value="publishedDate-asc">출판일 (오래된순)</option>
                      <option value="publishedDate-desc">출판일 (최신순)</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <BookSkeleton key={i} viewMode={viewMode} />
                    ))}
                  </div>
                ) : (
                  <BookList books={filteredBooks} viewMode={viewMode} />
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {filteredBooks.length}권의 도서가 있습니다.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 