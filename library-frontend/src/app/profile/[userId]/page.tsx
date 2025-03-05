'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userService } from '@/services';
import { User } from '@/types';
import { formatDate } from '@/utils/date';
import Link from 'next/link';
import { LoanList } from '@/components/loans/LoanList';
import { ReservationList } from '@/components/reservations/ReservationList';
import { use } from 'react';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { userId } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-2">오류가 발생했습니다</p>
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-500 text-center">
            <p className="text-xl font-semibold mb-2">사용자 정보를 찾을 수 없습니다</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user.fullName}</h1>
              <p className="text-muted-foreground">{user.username}</p>
            </div>
            <Link href="/profile">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                목록으로 돌아가기
              </button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>사용자 계정 정보</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">사용자 ID</p>
                    <p className="mt-1">{user.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">이메일</p>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">가입일</p>
                    <p className="mt-1">{formatDate(user.createdAt || '')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 대출 및 예약 내역 */}
          <Card>
            <CardHeader>
              <CardTitle>활동 내역</CardTitle>
              <CardDescription>대출 및 예약 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="loans" className="w-full">
                <TabsList>
                  <TabsTrigger value="loans">대출 내역</TabsTrigger>
                  <TabsTrigger value="reservations">예약 내역</TabsTrigger>
                </TabsList>
                <TabsContent value="loans">
                  <LoanList userId={user.userId} />
                </TabsContent>
                <TabsContent value="reservations">
                  <ReservationList userId={user.userId} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 