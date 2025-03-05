'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Book, ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { bookService } from '@/services';
import { Book as BookType } from '@/types';

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

export default function BookDetailPage() {
  const router = useRouter();
  const { bookId } = useParams() as { bookId: string };
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 도서 정보 로드
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const bookData = await bookService.getBookById(bookId);
        setBook(bookData);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('도서 정보를 불러올 수 없습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  // 로딩 상태 표시
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-7 w-40 bg-muted rounded animate-pulse ml-2"></div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse"></div>
              <div className="h-5 w-1/3 bg-muted rounded animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-full bg-muted rounded animate-pulse"></div>
                ))}
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // 에러 상태 표시
  if (error || !book) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold ml-2">도서 정보</h2>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Book className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">도서를 찾을 수 없습니다</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {error || '요청하신 도서 정보를 찾을 수 없습니다.'}
              </p>
              <Link href="/books">
                <Button>도서 목록으로 돌아가기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="뒤로 가기">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold ml-2">도서 정보</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{book.title}</CardTitle>
                <CardDescription className="mt-2">{book.author}</CardDescription>
              </div>
              <Badge className="w-fit" variant={book.copiesAvailable > 0 ? 'default' : 'outline'}>
                {book.copiesAvailable > 0 ? '대출 가능' : '대출 중'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">도서 소개</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {book.description || '도서 설명이 없습니다.'}
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Book className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium mr-2">ISBN:</span>
                {book.isbn}
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium mr-2">출판일:</span>
                {formatDate(book.publishedDate)}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium mr-2">카테고리:</span>
                {book.category}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">보유 수량:</span>
                {book.copiesAvailable}권
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/loans/request?bookId=${book.bookId}`}>
              <Button disabled={book.copiesAvailable <= 0} className="flex gap-2 items-center">
                <Book className="h-4 w-4" />
                {book.copiesAvailable > 0 ? '도서 대출하기' : '대출 불가'}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
} 