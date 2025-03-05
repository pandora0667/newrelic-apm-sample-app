'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Book, CheckCircle2, Loader2 } from 'lucide-react';
import { bookService, loanService } from '@/services';
import { Book as BookType } from '@/types';

function LoanRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookIdParam = searchParams.get('bookId');
  
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState(bookIdParam || '');
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);

  // 책 정보 로드 함수
  const fetchBookInfo = useCallback(async () => {
    if (!bookId) return;
    
    setBookLoading(true);
    setBookError(null);
    
    try {
      const bookData = await bookService.getBookById(bookId);
      setBook(bookData);
      
      if (bookData.copiesAvailable <= 0) {
        setBookError('이 도서는 현재 대출 가능한 재고가 없습니다.');
      }
    } catch (error) {
      console.error('도서 정보를 불러오는 중 오류가 발생했습니다:', error);
      setBookError('도서 정보를 불러올 수 없습니다. 올바른 도서 ID인지 확인해주세요.');
      setBook(null);
    } finally {
      setBookLoading(false);
    }
  }, [bookId]);

  // URL에서 책 ID를 가져왔을 경우 책 정보 로드
  useEffect(() => {
    if (bookId) {
      fetchBookInfo();
    }
  }, [bookId, fetchBookInfo]);

  // 대출 요청 제출 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setError('사용자 ID를 입력해주세요.');
      return;
    }
    
    if (!bookId.trim()) {
      setError('도서 ID를 입력해주세요.');
      return;
    }
    
    // 대출 가능 여부 확인
    if (book && book.copiesAvailable <= 0) {
      setError('이 도서는 현재 대출 가능한 재고가 없습니다.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await loanService.createLoan(userId, bookId);
      
      setSuccess(`도서가 성공적으로 대출되었습니다. 반납 기한은 ${result.dueDate} 입니다.`);
      
      // 3초 후 대출 목록 페이지로 이동
      setTimeout(() => {
        router.push(`/loans?userId=${userId}`);
      }, 3000);
      
    } catch (error) {
      console.error('도서 대출 중 오류가 발생했습니다:', error);
      setError('도서 대출에 실패했습니다. 도서나 사용자 ID가 유효한지 확인하거나 관리자에게 문의하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="뒤로 가기">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold ml-2">도서 대출 신청</h2>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>도서 대출 신청</CardTitle>
          <CardDescription>
            대출할 도서와 사용자 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">사용자 ID</Label>
                <Input
                  id="userId"
                  placeholder="사용자 ID를 입력하세요"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bookId">도서 ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="bookId"
                    placeholder="도서 ID를 입력하세요"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={fetchBookInfo}
                    disabled={!bookId || bookLoading}
                  >
                    {bookLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "확인"}
                  </Button>
                </div>
              </div>
            </div>
            
            {bookError && (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{bookError}</AlertDescription>
              </Alert>
            )}
            
            {book && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span>카테고리:</span>
                      <span className="font-medium">{book.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ISBN:</span>
                      <span className="font-medium">{book.isbn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>대출 가능 수량:</span>
                      <span className={`font-medium ${book.copiesAvailable > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.copiesAvailable}권
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>성공</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={loading || bookLoading || !book || book.copiesAvailable <= 0 || !!success}
                className="flex gap-2 items-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Book className="h-4 w-4" />
                )}
                대출 신청
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoanRequestPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <LoanRequestForm />
      </Suspense>
    </MainLayout>
  );
} 