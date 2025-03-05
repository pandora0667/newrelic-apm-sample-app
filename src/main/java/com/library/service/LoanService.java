package com.library.service;

import com.library.domain.book.Book;
import com.library.domain.loan.Loan;
import com.library.domain.loan.LoanStatus;
import com.library.domain.reservation.ReservationStatus;
import com.library.domain.user.User;
import com.library.dto.loan.LoanDto;
import com.library.repository.BookRepository;
import com.library.repository.LoanRepository;
import com.library.repository.UserRepository;
import com.library.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoanService {
    
    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReservationRepository reservationRepository;
    
    @Transactional
    public LoanDto.Response createLoan(LoanDto.CreateRequest request) {
        // 사용자 확인
        User user = userRepository.findByUserId(request.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        // 도서 확인
        Book book = bookRepository.findByBookId(request.getBookId())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));
        
        // 도서 대출 가능 여부 확인
        if (book.getCopiesAvailable() <= 0) {
            throw new IllegalStateException("대출 가능한 도서가 없습니다.");
        }
        
        // 사용자의 현재 대출 건수 확인 (최대 5권으로 제한)
        long userLoanCount = loanRepository.countByUserAndStatusNot(user, LoanStatus.RETURNED);
        if (userLoanCount >= 5) {
            throw new IllegalStateException("최대 대출 가능 권수(5권)를 초과했습니다.");
        }
        
        // 도서 수량 감소
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        
        // 대출 생성
        Loan loan = Loan.createLoan(user, book, request.getLoanDate(), request.getDueDate());
        
        // 저장
        Loan savedLoan = loanRepository.save(loan);
        
        // 해당 도서에 대한 예약이 있었다면 완료 처리
        reservationRepository.findFirstByBookAndUserAndStatus(book, user, ReservationStatus.RESERVED)
            .ifPresent(reservation -> {
                reservation.complete();
                reservationRepository.save(reservation);
            });
        
        return LoanDto.Response.from(savedLoan);
    }
    
    public List<LoanDto.SimpleResponse> getLoansByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        return loanRepository.findByUser(user).stream()
            .map(LoanDto.SimpleResponse::from)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public LoanDto.Response returnBook(String loanId, LoanDto.ReturnRequest request) {
        Loan loan = loanRepository.findByLoanId(loanId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 대출 기록입니다."));
        
        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new IllegalStateException("이미 반납된 도서입니다.");
        }
        
        // 도서 수량 증가
        Book book = loan.getBook();
        book.setCopiesAvailable(book.getCopiesAvailable() + 1);
        
        // 반납 처리
        loan.returnBook(LocalDateTime.now());
        
        // 반납 후 예약자에게 알림 처리를 위한 로직 (실제 알림 전송은 별도 서비스 필요)
        checkAndNotifyReservations(book);
        
        return LoanDto.Response.from(loan);
    }
    
    // 대출 연장 메서드 추가
    @Transactional
    public LoanDto.Response extendLoan(String loanId, LoanDto.ExtendRequest request) {
        Loan loan = loanRepository.findByLoanId(loanId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 대출 기록입니다."));
        
        // 대출 연장 처리 (기본 14일 또는 요청받은 일수)
        int days = request.getDays() != null ? request.getDays() : 14;
        loan.extendLoan(days);
        
        return LoanDto.Response.from(loan);
    }
    
    // 대출 연장 메서드 추가 (일수 기본값 사용)
    @Transactional
    public LoanDto.Response extendLoan(String loanId) {
        Loan loan = loanRepository.findByLoanId(loanId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 대출 기록입니다."));
        
        // 기본 14일 연장
        loan.extendLoan(14);
        
        return LoanDto.Response.from(loan);
    }
    
    // 매일 자정에 실행되는 연체 상태 업데이트 메서드
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void updateOverdueLoans() {
        LocalDate today = LocalDate.now();
        List<Loan> overdueLoans = loanRepository.findByStatusAndDueDateBefore(LoanStatus.LOANED, today);
        
        for (Loan loan : overdueLoans) {
            loan.setStatus(LoanStatus.OVERDUE);
            loanRepository.save(loan);
        }
    }
    
    // 도서 반납 시 해당 도서에 대한 예약자 확인
    private void checkAndNotifyReservations(Book book) {
        reservationRepository.findFirstByBookAndStatusOrderByReservationDateAsc(book, ReservationStatus.RESERVED)
            .ifPresent(reservation -> {
                // 여기에 알림 로직 구현 (이메일 또는 푸시 알림 등)
                // 실제 구현은 별도의 NotificationService 등을 통해 처리
                System.out.println("예약자 " + reservation.getUser().getUsername() + "에게 알림 발송: " 
                    + book.getTitle() + " 도서가 반납되었습니다.");
            });
    }
} 