package com.library.domain.reservation;

import com.library.domain.BaseTimeEntity;
import com.library.domain.book.Book;
import com.library.domain.user.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "reservations")
public class Reservation extends BaseTimeEntity {

    @Id
    @Column(name = "reservation_id")
    private String reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(nullable = false)
    private LocalDateTime reservationDate;

    @Column(nullable = false)
    private LocalDateTime expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Builder
    public Reservation(User user, Book book, LocalDateTime reservationDate, LocalDateTime expirationDate) {
        this.reservationId = "r" + UUID.randomUUID().getMostSignificantBits();
        this.user = user;
        this.book = book;
        this.reservationDate = reservationDate;
        this.expirationDate = expirationDate;
        this.status = ReservationStatus.RESERVED;
    }

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
    }

    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expirationDate);
    }
} 