'use client';

import { useEffect, useState } from 'react';
import { ReservationResponse } from '@/types/reservation';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { reservationService } from '@/services/reservationService';

interface ReservationListProps {
  userId: string;
}

interface ReservationCardProps {
  reservation: ReservationResponse;
}

function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{reservation.bookTitle}</h4>
            <p className="text-sm text-gray-500">{reservation.bookAuthor}</p>
            <p className="text-sm text-gray-500 mt-1">
              예약일: {formatDate(reservation.reservationDate)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReservationList({ userId }: ReservationListProps) {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reservationService.getReservationsByUserId(userId);
        setReservations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        <p>{error}</p>
      </div>
    );
  }

  const currentReservations = reservations.filter(res => res.status === 'RESERVED');
  const reservationHistory = reservations.filter(res => res.status === 'COMPLETED');

  if (currentReservations.length === 0 && reservationHistory.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">예약 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentReservations.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">현재 예약 중인 도서</h4>
          <div className="space-y-4">
            {currentReservations.map((reservation) => (
              <ReservationCard key={reservation.reservationId} reservation={reservation} />
            ))}
          </div>
        </div>
      )}

      {reservationHistory.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">예약 내역</h4>
          <div className="space-y-4">
            {reservationHistory.map((reservation) => (
              <ReservationCard key={reservation.reservationId} reservation={reservation} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 