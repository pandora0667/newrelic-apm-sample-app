package com.library.repository;

import com.library.domain.book.Book;
import com.library.domain.reservation.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByBookId(String bookId);
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    List<Book> findByCategory(String category);

    @Query("SELECT b FROM Book b WHERE " +
           "(:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR b.category = :category) AND " +
           "(:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%')))")
    Page<Book> searchBooks(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("author") String author,
            Pageable pageable
    );

    @Query("SELECT b.category as category, COUNT(b) as count FROM Book b GROUP BY b.category")
    List<Object[]> countBooksByCategory();

    @Query("SELECT b, COUNT(l) as loanCount " +
           "FROM Book b LEFT JOIN Loan l ON b = l.book " +
           "GROUP BY b " +
           "ORDER BY loanCount DESC")
    List<Object[]> findTopBooksByLoanCount(Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.copiesAvailable = 0")
    List<Book> findBooksAvailableForReservation();
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.book = :book AND r.status = :status")
    long countReservationsByBookAndStatus(@Param("book") Book book, @Param("status") ReservationStatus status);
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.book = :book AND r.status = :status AND r.user.userId = :userId")
    long countUserReservationsByBookAndStatus(@Param("book") Book book, @Param("userId") String userId, @Param("status") ReservationStatus status);
} 