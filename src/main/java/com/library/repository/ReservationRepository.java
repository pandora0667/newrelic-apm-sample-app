package com.library.repository;

import com.library.domain.book.Book;
import com.library.domain.reservation.Reservation;
import com.library.domain.reservation.ReservationStatus;
import com.library.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {
    Optional<Reservation> findByReservationId(String reservationId);
    List<Reservation> findByUserUserIdAndStatus(String userId, ReservationStatus status);
    List<Reservation> findByBookBookIdAndStatus(String bookId, ReservationStatus status);
    boolean existsByBookBookIdAndStatus(String bookId, ReservationStatus status);
    List<Reservation> findByUserUserIdOrderByReservationDateDesc(String userId);
    long countByStatus(ReservationStatus status);
    long countByUserUserIdAndStatus(String userId, ReservationStatus status);
    long countByBookBookIdAndStatus(String bookId, ReservationStatus status);
    Optional<Reservation> findByUserUserIdAndBookBookIdAndStatus(String userId, String bookId, ReservationStatus status);
    
    // 추가된 메서드
    Optional<Reservation> findFirstByBookAndUserAndStatus(Book book, User user, ReservationStatus status);
    Optional<Reservation> findFirstByBookAndStatusOrderByReservationDateAsc(Book book, ReservationStatus status);
} 