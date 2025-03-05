package com.library.dto.book;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class BookReservationDto {
    private String bookId;
    private String title;
    private String author;
    private String category;
    private int copiesAvailable;
    private int currentReservations;
    private Integer userReservationOrder;  // null이면 예약하지 않은 상태
    private LocalDate publishedDate;
    private String isbn;

    @Builder
    public BookReservationDto(String bookId, String title, String author, String category,
                            int copiesAvailable, int currentReservations, Integer userReservationOrder,
                            LocalDate publishedDate, String isbn) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.category = category;
        this.copiesAvailable = copiesAvailable;
        this.currentReservations = currentReservations;
        this.userReservationOrder = userReservationOrder;
        this.publishedDate = publishedDate;
        this.isbn = isbn;
    }
} 