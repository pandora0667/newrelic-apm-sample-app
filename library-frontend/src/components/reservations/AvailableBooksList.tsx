'use client';

import { useEffect, useState } from 'react';
import { BookReservation } from '@/types/reservation';
import { reservationService } from '@/services/reservationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AvailableBooksList() {
  const [books, setBooks] = useState<BookReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setError(null);
        const data = await reservationService.getAvailableBooks();
        setBooks(data);
      } catch (error) {
        console.error('API Error:', error);
        setError('예약 가능한 도서 목록을 불러오는데 실패했습니다.');
        toast.error('예약 가능한 도서 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleReserveClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsReservationModalOpen(true);
  };

  const handleReserve = async () => {
    if (!selectedBookId || !userId) return;

    try {
      await reservationService.createReservation({
        userId,
        bookId: selectedBookId,
        reservationDate: new Date().toISOString().replace('Z', '')
      });
      toast.success('도서 예약이 완료되었습니다.');
      setIsReservationModalOpen(false);
      setUserId('');
      // 목록 새로고침
      const data = await reservationService.getAvailableBooks();
      setBooks(data);
    } catch (error) {
      console.error('Reservation Error:', error);
      toast.error('도서 예약에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>오류</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">현재 예약 가능한 도서가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.bookId}>
            <CardHeader>
              <CardTitle className="text-lg">{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">저자: {book.author}</p>
              <p className="text-sm text-gray-600 mb-2">카테고리: {book.category}</p>
              <p className="text-sm text-gray-600 mb-2">
                현재 예약자 수: {book.currentReservations}명
              </p>
              {book.userReservationOrder && (
                <p className="text-sm text-blue-600 mb-4">
                  나의 예약 순서: {book.userReservationOrder}번째
                </p>
              )}
              <Button
                onClick={() => handleReserveClick(book.bookId)}
                disabled={!!book.userReservationOrder}
                className="w-full"
              >
                {book.userReservationOrder ? '이미 예약됨' : '예약하기'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isReservationModalOpen} onOpenChange={setIsReservationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>도서 예약</DialogTitle>
            <DialogDescription>
              예약하시려면 사용자 ID를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">사용자 ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="사용자 ID를 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReservationModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleReserve} disabled={!userId}>
              예약하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 