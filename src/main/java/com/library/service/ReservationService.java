package com.library.service;

import com.library.domain.book.Book;
import com.library.domain.reservation.Reservation;
import com.library.domain.reservation.ReservationStatus;
import com.library.domain.user.User;
import com.library.dto.reservation.ReservationDto;
import com.library.exception.BusinessException;
import com.library.exception.ErrorCode;
import com.library.repository.BookRepository;
import com.library.repository.ReservationRepository;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    private static final int RESERVATION_EXPIRATION_DAYS = 7;
    private static final int MAX_RESERVATIONS_PER_USER = 3;

    @Transactional
    public ReservationDto.Response createReservation(ReservationDto.CreateRequest request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findByBookId(request.getBookId())
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));

        if (book.getCopiesAvailable() > 0) {
            throw new BusinessException(ErrorCode.BOOK_AVAILABLE_FOR_LOAN);
        }

        long userReservationsCount = reservationRepository.countByUserUserIdAndStatus(user.getUserId(), ReservationStatus.RESERVED);
        if (userReservationsCount >= MAX_RESERVATIONS_PER_USER) {
            throw new BusinessException(ErrorCode.MAX_RESERVATIONS_EXCEEDED);
        }

        Optional<Reservation> existingReservation = reservationRepository.findByUserUserIdAndBookBookIdAndStatus(
                user.getUserId(), book.getBookId(), ReservationStatus.RESERVED);
        if (existingReservation.isPresent()) {
            throw new BusinessException(ErrorCode.USER_ALREADY_RESERVED);
        }

        LocalDateTime expirationDate = request.getReservationDate().plusDays(RESERVATION_EXPIRATION_DAYS);

        Reservation reservation = Reservation.builder()
                .user(user)
                .book(book)
                .reservationDate(request.getReservationDate())
                .expirationDate(expirationDate)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        
        ReservationDto.Response response = ReservationDto.Response.from(savedReservation);
        
        return response;
    }

    public List<ReservationDto.Response> getReservationsByUserId(String userId) {
        userRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return reservationRepository.findByUserUserIdOrderByReservationDateDesc(userId).stream()
                .map(ReservationDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelReservation(String reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
        }

        reservation.cancel();
    }

    @Transactional
    public void completeReservation(String reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
        }

        if (reservation.isExpired()) {
            throw new BusinessException(ErrorCode.RESERVATION_EXPIRED);
        }

        reservation.complete();
    }
} 