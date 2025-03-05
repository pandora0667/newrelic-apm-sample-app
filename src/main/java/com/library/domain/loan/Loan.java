package com.library.domain.loan;

import com.library.domain.book.Book;
import com.library.domain.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Loan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String loanId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @Column(nullable = false)
    private LocalDate loanDate;
    
    @Column(nullable = false)
    private LocalDate dueDate;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoanStatus status;
    
    @Column(nullable = false)
    private Integer extensionCount = 0;
    
    private LocalDateTime returnedAt;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // 대출 생성을 위한 정적 팩토리 메서드
    public static Loan createLoan(User user, Book book, LocalDate loanDate, LocalDate dueDate) {
        Loan loan = new Loan();
        loan.setLoanId("l" + System.currentTimeMillis());
        loan.setUser(user);
        loan.setBook(book);
        loan.setLoanDate(loanDate);
        loan.setDueDate(dueDate);
        loan.setStatus(LoanStatus.LOANED);
        return loan;
    }
    
    // 도서 반납 처리
    public void returnBook(LocalDateTime returnedAt) {
        this.status = LoanStatus.RETURNED;
        this.returnedAt = returnedAt;
    }
    
    // 대출 연장 처리 메서드 추가
    public void extendLoan(int days) {
        if (status != LoanStatus.LOANED) {
            throw new IllegalStateException("대출 중인 도서만 연장할 수 있습니다.");
        }
        
        if (extensionCount >= 3) {
            throw new IllegalStateException("최대 연장 횟수(3회)를 초과했습니다.");
        }
        
        this.dueDate = this.dueDate.plusDays(days);
        this.extensionCount++;
    }
} 