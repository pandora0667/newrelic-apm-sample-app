'use client';

import { AvailableBooksList } from '@/components/reservations/AvailableBooksList';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReservationsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">도서 예약</h1>
        <p className="text-muted-foreground">
          대출 중인 도서를 미리 예약하고 대기 순서를 확인하세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>예약 가능한 도서 목록</CardTitle>
          <CardDescription>
            현재 대출 중인 도서 중 예약 가능한 도서 목록입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailableBooksList />
        </CardContent>
      </Card>
    </MainLayout>
  );
} 