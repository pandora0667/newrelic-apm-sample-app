'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  Book, 
  BookOpen, 
  Calendar, 
  Database, 
  Server, 
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '@/services';
import { 
  LibraryStats, 
  SystemStatus, 
  BookSimple, 
  BookCreateRequest, 
  BookUpdateRequest,
  Book as BookType 
} from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { bookService } from '@/services';
import { BookFormModal } from '@/components/admin/BookFormModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { toast } from 'sonner';

export default function AdminPage() {
  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 도서 관리 관련 상태
  const [books, setBooks] = useState<BookSimple[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookSimple[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [booksLoading, setBooksLoading] = useState(false);

  // 모달 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSimple | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, status] = await Promise.all([
          adminService.getLibraryStats(),
          adminService.getSystemStatus()
        ]);
        setLibraryStats(stats);
        setSystemStatus(status);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 도서 목록 로드
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);
        const booksData = await bookService.getAllBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);
        setTotalBooks(booksData.length);
        setTotalPages(Math.ceil(booksData.length / size));
        
        // 카테고리 목록 추출
        const uniqueCategories = Array.from(new Set(booksData.map(book => book.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('도서 목록을 불러오는 중 오류가 발생했습니다:', error);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, [size]);

  // 도서 필터링
  useEffect(() => {
    let filtered = [...books];

    // 검색어로 필터링
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
      );
    }

    // 카테고리로 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
    setTotalBooks(filtered.length);
    setTotalPages(Math.ceil(filtered.length / size));
    setPage(0);
  }, [searchKeyword, selectedCategory, books, size]);

  // 페이지네이션된 도서 목록
  const paginatedBooks = filteredBooks.slice(page * size, (page + 1) * size);

  // 도서 등록
  const handleCreateBook = async (data: BookCreateRequest) => {
    try {
      await bookService.createBook(data);
      toast.success('도서가 등록되었습니다.');
      // 도서 목록 새로고침
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
      setTotalBooks(booksData.length);
      setTotalPages(Math.ceil(booksData.length / size));
      
      // 카테고리 목록 업데이트
      const uniqueCategories = Array.from(new Set(booksData.map(book => book.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error creating book:', error);
      toast.error('도서 등록에 실패했습니다.');
      throw error;
    }
  };

  // 도서 수정
  const handleEditBook = async (data: BookUpdateRequest) => {
    if (!selectedBook) return;

    try {
      await bookService.updateBook(selectedBook.bookId.toString(), data);
      toast.success('도서 정보가 수정되었습니다.');
      // 도서 목록 새로고침
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
      setTotalBooks(booksData.length);
      setTotalPages(Math.ceil(booksData.length / size));
    } catch (error: unknown) {
      console.error('Error updating book:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      if (errorMessage.includes('Book not found')) {
        toast.error('존재하지 않는 도서입니다.');
      } else if (errorMessage.includes('Invalid input value')) {
        toast.error('입력값이 올바르지 않습니다.');
      } else {
        toast.error('도서 정보 수정에 실패했습니다.');
      }
      throw error;
    }
  };

  // 도서 삭제
  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    try {
      await bookService.deleteBook(selectedBook.bookId.toString());
      toast.success('도서가 삭제되었습니다.');
      // 도서 목록 새로고침
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
      setTotalBooks(booksData.length);
      setTotalPages(Math.ceil(booksData.length / size));
      
      // 카테고리 목록 업데이트
      const uniqueCategories = Array.from(new Set(booksData.map(book => book.category)));
      setCategories(uniqueCategories);
    } catch (error: unknown) {
      console.error('Error deleting book:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      if (errorMessage.includes('Book not found')) {
        toast.error('존재하지 않는 도서입니다.');
      } else if (errorMessage.includes('has active loans')) {
        toast.error('현재 대출 중인 도서는 삭제할 수 없습니다.');
      } else if (errorMessage.includes('has active reservations')) {
        toast.error('현재 예약된 도서는 삭제할 수 없습니다.');
      } else {
        toast.error('도서 삭제에 실패했습니다.');
      }
      throw error;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">
            도서관 시스템의 전반적인 상태와 통계를 확인할 수 있습니다.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              개요
            </TabsTrigger>
            <TabsTrigger value="system">
              <Server className="mr-2 h-4 w-4" />
              시스템
            </TabsTrigger>
            <TabsTrigger value="books">
              <Book className="mr-2 h-4 w-4" />
              도서 관리
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">전체 도서</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{libraryStats?.totalBooks}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">현재 대출</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{libraryStats?.totalLoans}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">현재 예약</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{libraryStats?.totalReservations}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{libraryStats?.activeUsers}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>카테고리별 도서 수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {libraryStats && Object.entries(libraryStats.booksByCategory).map(([category, count]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{category}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>가장 많이 대출된 도서</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {libraryStats?.topBooks.map((book) => (
                      <div key={book.bookId} className="flex justify-between">
                        <div>
                          <div className="font-medium">{book.title}</div>
                          <div className="text-sm text-muted-foreground">{book.author}</div>
                        </div>
                        <span className="font-medium">{book.loanCount}회</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">데이터베이스</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStatus?.database.status}</div>
                  <p className="text-xs text-muted-foreground">
                    응답 시간: {systemStatus?.database.responseTime}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">캐시</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStatus?.cache.status}</div>
                  <p className="text-xs text-muted-foreground">
                    응답 시간: {systemStatus?.cache.responseTime}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">외부 서비스</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStatus?.externalService.status}</div>
                  <p className="text-xs text-muted-foreground">
                    응답 시간: {systemStatus?.externalService.responseTime}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">도서 관리</h2>
                <p className="text-muted-foreground">
                  도서 등록, 수정, 삭제 및 검색 기능을 제공합니다.
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                도서 등록
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>도서 목록</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="도서 검색..."
                        className="pl-8 w-[200px]"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {booksLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>저자</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>ISBN</TableHead>
                        <TableHead>대출 가능</TableHead>
                        <TableHead>출판일</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBooks.map((book) => (
                        <TableRow key={book.bookId}>
                          <TableCell>{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{book.category}</TableCell>
                          <TableCell>{book.isbn}</TableCell>
                          <TableCell>{book.copiesAvailable}</TableCell>
                          <TableCell>{book.publishedDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setSelectedBook(book);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setSelectedBook(book);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-muted-foreground">
                    총 {totalBooks}권의 도서
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPage(page - 1)}
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
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 도서 등록 모달 */}
        <BookFormModal<BookCreateRequest>
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateBook}
          mode="create"
        />

        {/* 도서 수정 모달 */}
        <BookFormModal<BookUpdateRequest>
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBook(null);
          }}
          onSubmit={handleEditBook}
          book={selectedBook ? {
            ...selectedBook,
            description: '' // BookSimple에는 description이 없으므로 빈 문자열로 설정
          } as BookType : undefined}
          mode="edit"
        />

        {/* 도서 삭제 확인 모달 */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedBook(null);
          }}
          onConfirm={handleDeleteBook}
          title={selectedBook?.title || ''}
        />
      </div>
    </MainLayout>
  );
} 