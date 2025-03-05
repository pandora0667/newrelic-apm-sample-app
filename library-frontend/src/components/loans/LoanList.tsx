import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/date';
import { LoanWithBook } from '@/types/loan';
import { loanService } from '@/services';

interface LoanListProps {
  userId: string;
}

export function LoanList({ userId }: LoanListProps) {
  const [loans, setLoans] = useState<LoanWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loanService.getUserLoans(userId);
        setLoans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
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

  const currentLoans = loans.filter(loan => loan.status === 'LOANED');
  const loanHistory = loans.filter(loan => loan.status === 'RETURNED');

  return (
    <div className="space-y-6">
      {currentLoans.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">현재 대출 중인 도서</h3>
          <div className="space-y-4">
            {currentLoans.map((loan) => (
              <Card key={loan.loanId}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{loan.book?.title}</h4>
                      <p className="text-sm text-gray-500">{loan.book?.author}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        대출일: {formatDate(loan.loanDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        반납 예정일: {formatDate(loan.dueDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {loanHistory.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">대출 내역</h3>
          <div className="space-y-4">
            {loanHistory.map((loan) => (
              <Card key={loan.loanId}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{loan.book?.title}</h4>
                      <p className="text-sm text-gray-500">{loan.book?.author}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        대출일: {formatDate(loan.loanDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        반납일: {loan.returnedAt ? formatDate(loan.returnedAt) : '미반납'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentLoans.length === 0 && loanHistory.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          대출 내역이 없습니다.
        </div>
      )}
    </div>
  );
} 