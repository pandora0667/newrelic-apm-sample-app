package com.library.repository;

import com.library.domain.loan.Loan;
import com.library.domain.loan.LoanStatus;
import com.library.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    Optional<Loan> findByLoanId(String loanId);
    List<Loan> findByUserUserId(String userId);
    List<Loan> findByUser(User user);
    List<Loan> findByBookBookId(String bookId);
    boolean existsByBookBookIdAndStatus(String bookId, LoanStatus status);
    
    List<Loan> findByStatusAndDueDateBefore(LoanStatus status, LocalDate date);
    
    long countByUserAndStatusNot(User user, LoanStatus status);
    long countByStatus(LoanStatus status);

    @Query("SELECT COUNT(DISTINCT l.user.userId) FROM Loan l WHERE l.status = :status")
    long countDistinctUserIdByStatus(@Param("status") LoanStatus status);
} 