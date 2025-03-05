package com.library.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "Invalid input value"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C002", "Internal server error"),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "User not found"),
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "U002", "Username already exists"),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U003", "Email already exists"),
    MAX_LOANS_EXCEEDED(HttpStatus.BAD_REQUEST, "U004", "Maximum number of loans exceeded"),

    // Book
    BOOK_NOT_FOUND(HttpStatus.NOT_FOUND, "B001", "Book not found"),
    BOOK_AVAILABLE_FOR_LOAN(HttpStatus.BAD_REQUEST, "B002", "Book is available for loan"),
    BOOK_ALREADY_RESERVED(HttpStatus.CONFLICT, "B003", "Book is already reserved"),
    BOOK_HAS_ACTIVE_LOANS(HttpStatus.CONFLICT, "B004", "Book has active loans"),
    BOOK_HAS_RESERVATIONS(HttpStatus.CONFLICT, "B005", "Book has active reservations"),

    // Reservation
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "Reservation not found"),
    INVALID_RESERVATION_STATUS(HttpStatus.BAD_REQUEST, "R002", "Invalid reservation status"),
    RESERVATION_EXPIRED(HttpStatus.BAD_REQUEST, "R003", "Reservation has expired"),
    MAX_RESERVATIONS_EXCEEDED(HttpStatus.BAD_REQUEST, "R004", "Maximum number of reservations exceeded"),
    USER_ALREADY_RESERVED(HttpStatus.CONFLICT, "R005", "User has already reserved this book");

    private final HttpStatus status;
    private final String code;
    private final String message;
} 