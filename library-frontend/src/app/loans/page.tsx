'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  RefreshCw, 
  RotateCw,
  Search, 
  User
} from 'lucide-react';
import { loanService, bookService } from '@/services';
import { LoanStatus, LoanWithBook } from '@/types';
import { formatDate, getDaysUntil, getDaysOverdue } from '@/lib/utils';

export default function LoansPage() {
  // 로컬 상태 설정
  const [userId, setUserId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [loans, setLoans] = useState<LoanWithBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // 선택된 대출 항목 (연장 및 반납 작업용)
  const [selectedLoan, setSelectedLoan] = useState<LoanWithBook | null>(null);
  const [extensionDays, setExtensionDays] = useState<number>(7); // 기본 연장 일수
  const [processingAction, setProcessingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // 모달 상태
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false);

  // 대출 항목 필터링
  const activeLoans = loans.filter((loan: LoanWithBook) => loan.status !== LoanStatus.RETURNED);
  const returnedLoans = loans.filter((loan: LoanWithBook) => loan.status === LoanStatus.RETURNED);
  const overdueLoans = loans.filter(
    (loan: LoanWithBook) => 
      loan.status === LoanStatus.OVERDUE || 
      (loan.status === LoanStatus.LOANED && getDaysUntil(loan.dueDate) < 0)
  );
  
  // 대출 목록 가져오기
  const fetchLoans = async () => {
    if (!searchId.trim()) {
      setError('사용자 ID를 입력해주세요');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      // 대출 목록 가져오기
      const loansData = await loanService.getUserLoans(searchId);
      
      // 각 대출 항목에 대한 도서 정보 가져오기
      const loansWithBooks = await Promise.all(
        loansData.map(async (loan) => {
          try {
            const book = await bookService.getBookById(loan.bookId);
            return {
              ...loan,
              book: {
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                category: book.category
              }
            } as LoanWithBook;
          } catch (error) {
            // 도서 정보를 가져오지 못한 경우
            console.error(`도서 정보를 가져오는데 실패했습니다 (ID: ${loan.bookId}):`, error);
            return loan as LoanWithBook;
          }
        })
      );
      
      setLoans(loansWithBooks);
      setUserId(searchId);
      
    } catch (error) {
      console.error('대출 목록을 불러오는데 실패했습니다:', error);
      setError('대출 목록을 불러오는데 실패했습니다. 올바른 사용자 ID인지 확인해주세요.');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 도서 반납 처리
  const handleReturnBook = async () => {
    if (!selectedLoan) return;
    
    setProcessingAction(true);
    setActionError(null);
    
    try {
      // 오늘 날짜 생성 (YYYY-MM-DD 형식)
      const today = new Date();
      const returnDate = today.toISOString().split('T')[0];
      
      // 반납 요청
      const result = await loanService.returnBook(selectedLoan.loanId, returnDate);
      
      // 대출 목록 갱신
      setLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.loanId === result.loanId 
            ? { ...loan, status: result.status, returnedAt: result.returnedAt } 
            : loan
        ) as LoanWithBook[]
      );
      
      setActionSuccess('도서가 성공적으로 반납되었습니다.');
      setReturnModalOpen(false);
      
    } catch (error) {
      console.error('도서 반납 중 오류가 발생했습니다:', error);
      setActionError('도서 반납 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setProcessingAction(false);
    }
  };
  
  // 대출 연장 처리
  const handleExtendLoan = async (useDefaultDays: boolean = false) => {
    if (!selectedLoan) return;
    
    setProcessingAction(true);
    setActionError(null);
    
    try {
      let result;
      
      if (useDefaultDays) {
        // 기본 일수 연장 (14일)
        result = await loanService.extendLoanWithDefaultDays(selectedLoan.loanId);
      } else {
        // 지정 일수 연장
        result = await loanService.extendLoan(selectedLoan.loanId, extensionDays);
      }
      
      // 대출 목록 갱신
      setLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.loanId === result.loanId 
            ? { 
                ...loan, 
                dueDate: result.dueDate, 
                extensionCount: result.extensionCount 
              } 
            : loan
        ) as LoanWithBook[]
      );
      
      setActionSuccess('대출 기간이 성공적으로 연장되었습니다.');
      setExtendModalOpen(false);
      
    } catch (error) {
      console.error('대출 연장 중 오류가 발생했습니다:', error);
      setActionError('대출 연장 중 오류가 발생했습니다. 이미 최대 연장 횟수(3회)에 도달했거나 다른 문제가 있을 수 있습니다.');
    } finally {
      setProcessingAction(false);
    }
  };
  
  useEffect(() => {
    // 성공 메시지 자동 제거
    if (actionSuccess) {
      const timer = setTimeout(() => {
        setActionSuccess(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">내 대출</h1>
          <p className="text-muted-foreground">
            대출한 도서와 반납 기한을 확인하고 연장할 수 있습니다.
          </p>
        </div>
        
        {/* 사용자 ID 검색 영역 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>사용자 ID로 대출 조회</CardTitle>
            <CardDescription>
              사용자 ID를 입력하여 대출 목록을 조회하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="사용자 ID를 입력하세요"
                  className="pl-9"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') fetchLoans();
                  }}
                />
              </div>
              <Button onClick={fetchLoans} disabled={loading} className="flex gap-2 items-center">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                조회
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* 검색 결과 영역 */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {actionSuccess && (
          <Alert className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>성공</AlertTitle>
            <AlertDescription>{actionSuccess}</AlertDescription>
          </Alert>
        )}
        
        {hasSearched && !loading && loans.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-muted-foreground">
                  대출 내역이 없습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : hasSearched && !loading && loans.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {userId}님의 대출 목록
              </h2>
              <Button variant="outline" onClick={fetchLoans} className="flex gap-2 items-center">
                <RefreshCw className="h-4 w-4" />
                새로고침
              </Button>
            </div>
            
            <Tabs defaultValue="active" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="active">
                  현재 대출 중 ({activeLoans.length})
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  연체 중 ({overdueLoans.length})
                </TabsTrigger>
                <TabsTrigger value="returned">
                  반납 완료 ({returnedLoans.length})
                </TabsTrigger>
              </TabsList>
              
              {/* 현재 대출 중 탭 */}
              <TabsContent value="active">
                <Card>
                  <CardHeader>
                    <CardTitle>현재 대출 중인 도서</CardTitle>
                    <CardDescription>
                      반납 기한을 확인하고 필요한 경우 연장하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>도서 제목</TableHead>
                          <TableHead>저자</TableHead>
                          <TableHead>카테고리</TableHead>
                          <TableHead>대출일</TableHead>
                          <TableHead>반납기한</TableHead>
                          <TableHead>연장횟수</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeLoans.map((loan) => (
                          <TableRow key={loan.loanId}>
                            <TableCell className="font-medium">
                              {loan.book?.title || '제목 없음'}
                            </TableCell>
                            <TableCell>{loan.book?.author || '작자 미상'}</TableCell>
                            <TableCell>{loan.book?.category || '-'}</TableCell>
                            <TableCell>{formatDate(loan.loanDate)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {formatDate(loan.dueDate)}
                                {getDaysUntil(loan.dueDate) < 0 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                                    {getDaysOverdue(loan.dueDate)}일 연체
                                  </span>
                                ) : getDaysUntil(loan.dueDate) <= 3 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                    {getDaysUntil(loan.dueDate)}일 남음
                                  </span>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell>{loan.extensionCount}/3</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                {loan.extensionCount < 3 && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setExtendModalOpen(true);
                                    }}
                                    className="flex gap-1 items-center"
                                  >
                                    <RotateCw className="h-3.5 w-3.5" />
                                    연장
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedLoan(loan);
                                    setReturnModalOpen(true);
                                  }}
                                  className="flex gap-1 items-center"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  반납
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* 연체 탭 */}
              <TabsContent value="overdue">
                <Card>
                  <CardHeader>
                    <CardTitle>연체 중인 도서</CardTitle>
                    <CardDescription>
                      연체 중인 도서는 즉시 반납해주세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overdueLoans.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">연체 중인 도서가 없습니다</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>도서 제목</TableHead>
                            <TableHead>저자</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>대출일</TableHead>
                            <TableHead>반납기한</TableHead>
                            <TableHead>연체일수</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {overdueLoans.map((loan) => (
                            <TableRow key={loan.loanId}>
                              <TableCell className="font-medium">
                                {loan.book?.title || '제목 없음'}
                              </TableCell>
                              <TableCell>{loan.book?.author || '작자 미상'}</TableCell>
                              <TableCell>{loan.book?.category || '-'}</TableCell>
                              <TableCell>{formatDate(loan.loanDate)}</TableCell>
                              <TableCell>{formatDate(loan.dueDate)}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                                  {getDaysOverdue(loan.dueDate)}일 연체
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setReturnModalOpen(true);
                                    }}
                                    className="flex gap-1 items-center"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    반납
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* 반납 완료 탭 */}
              <TabsContent value="returned">
                <Card>
                  <CardHeader>
                    <CardTitle>반납 완료 도서</CardTitle>
                    <CardDescription>
                      과거에 대출 후 반납한 도서 목록
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {returnedLoans.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">반납 완료된 도서가 없습니다</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>도서 제목</TableHead>
                            <TableHead>저자</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>대출일</TableHead>
                            <TableHead>반납일</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {returnedLoans.map((loan) => (
                            <TableRow key={loan.loanId}>
                              <TableCell className="font-medium">
                                {loan.book?.title || '제목 없음'}
                              </TableCell>
                              <TableCell>{loan.book?.author || '작자 미상'}</TableCell>
                              <TableCell>{loan.book?.category || '-'}</TableCell>
                              <TableCell>{formatDate(loan.loanDate)}</TableCell>
                              <TableCell>{formatDate(loan.returnedAt || '')}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
        
        {/* 반납 확인 모달 */}
        <Dialog open={returnModalOpen} onOpenChange={setReturnModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>도서 반납 확인</DialogTitle>
              <DialogDescription>
                다음 도서를 반납하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            
            {selectedLoan && (
              <div className="py-4">
                <h3 className="font-semibold">{selectedLoan.book?.title || '제목 없음'}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedLoan.book?.author || '작자 미상'}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>대출일: {formatDate(selectedLoan.loanDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>반납기한: {formatDate(selectedLoan.dueDate)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {actionError && (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setReturnModalOpen(false)} 
                disabled={processingAction}
              >
                취소
              </Button>
              <Button 
                onClick={handleReturnBook} 
                disabled={processingAction}
                className="flex gap-2 items-center"
              >
                {processingAction ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                반납 확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 연장 확인 모달 */}
        <Dialog open={extendModalOpen} onOpenChange={setExtendModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>대출 연장</DialogTitle>
              <DialogDescription>
                대출 기간을 연장할 수 있습니다 (최대 3회)
              </DialogDescription>
            </DialogHeader>
            
            {selectedLoan && (
              <div className="py-4">
                <h3 className="font-semibold">{selectedLoan.book?.title || '제목 없음'}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedLoan.book?.author || '작자 미상'}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>현재 반납기한: {formatDate(selectedLoan.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <RotateCw className="h-4 w-4 text-muted-foreground" />
                    <span>연장횟수: {selectedLoan.extensionCount}/3</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">연장 옵션</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="extensionDays" className="mb-2">
                        연장 일수 지정
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="extensionDays"
                          type="number"
                          min={1}
                          max={30}
                          value={extensionDays}
                          onChange={(e) => setExtensionDays(parseInt(e.target.value) || 7)}
                        />
                        <Button
                          onClick={() => handleExtendLoan(false)}
                          disabled={processingAction}
                        >
                          적용
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2">기본 연장 (14일)</Label>
                      <Button
                        className="w-full"
                        onClick={() => handleExtendLoan(true)}
                        disabled={processingAction}
                      >
                        기본 일수로 연장
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {actionError && (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setExtendModalOpen(false)} 
                disabled={processingAction}
              >
                취소
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
} 