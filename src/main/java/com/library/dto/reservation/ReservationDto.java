package com.library.dto.reservation;

import com.library.domain.reservation.Reservation;
import com.library.domain.reservation.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ReservationDto {

    @Getter
    @NoArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "사용자 ID는 필수입니다.")
        private String userId;

        @NotNull(message = "도서 ID는 필수입니다.")
        private String bookId;

        @NotNull(message = "예약 일자는 필수입니다.")
        private LocalDateTime reservationDate;

        @Builder
        public CreateRequest(String userId, String bookId, LocalDateTime reservationDate) {
            this.userId = userId;
            this.bookId = bookId;
            this.reservationDate = reservationDate;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Response {
        private String reservationId;
        private String userId;
        private String bookId;
        private String bookTitle;
        private String bookAuthor;
        private LocalDateTime reservationDate;
        private LocalDateTime expirationDate;
        private ReservationStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        @Builder
        public Response(String reservationId, String userId, String bookId,
                       String bookTitle, String bookAuthor,
                       LocalDateTime reservationDate, LocalDateTime expirationDate,
                       ReservationStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.reservationId = reservationId;
            this.userId = userId;
            this.bookId = bookId;
            this.bookTitle = bookTitle;
            this.bookAuthor = bookAuthor;
            this.reservationDate = reservationDate;
            this.expirationDate = expirationDate;
            this.status = status;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static Response from(Reservation reservation) {
            return Response.builder()
                    .reservationId(reservation.getReservationId())
                    .userId(reservation.getUser().getUserId())
                    .bookId(reservation.getBook().getBookId())
                    .bookTitle(reservation.getBook().getTitle())
                    .bookAuthor(reservation.getBook().getAuthor())
                    .reservationDate(reservation.getReservationDate())
                    .expirationDate(reservation.getExpirationDate())
                    .status(reservation.getStatus())
                    .createdAt(reservation.getCreatedAt())
                    .updatedAt(reservation.getUpdatedAt())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class SimpleResponse {
        private String reservationId;
        private String bookId;
        private String bookTitle;
        private String bookAuthor;
        private LocalDateTime reservationDate;
        private LocalDateTime expirationDate;
        private ReservationStatus status;

        @Builder
        public SimpleResponse(String reservationId, String bookId,
                            String bookTitle, String bookAuthor,
                            LocalDateTime reservationDate, LocalDateTime expirationDate,
                            ReservationStatus status) {
            this.reservationId = reservationId;
            this.bookId = bookId;
            this.bookTitle = bookTitle;
            this.bookAuthor = bookAuthor;
            this.reservationDate = reservationDate;
            this.expirationDate = expirationDate;
            this.status = status;
        }

        public static SimpleResponse from(Reservation reservation) {
            return SimpleResponse.builder()
                    .reservationId(reservation.getReservationId())
                    .bookId(reservation.getBook().getBookId())
                    .bookTitle(reservation.getBook().getTitle())
                    .bookAuthor(reservation.getBook().getAuthor())
                    .reservationDate(reservation.getReservationDate())
                    .expirationDate(reservation.getExpirationDate())
                    .status(reservation.getStatus())
                    .build();
        }
    }
} 